import { useState, useRef, useCallback, useEffect } from "react";
import * as api from "../api";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

const POLL_INTERVAL = 1500;
const RINGING_TIMEOUT = 45000;
const ICE_FLUSH_DELAY = 300;

/**
 * useWebRTC — manages a WebRTC peer-to-peer video call between a customer
 * (caller) and an admin (callee). Signaling is exchanged via REST + DB
 * polling since Vercel is serverless (no persistent WebSocket).
 *
 * The actual video/audio/chat data flows peer-to-peer through RTCPeerConnection;
 * only SDP offers/answers and ICE candidates go through the server.
 *
 * Status flow: idle → requesting_media → ringing → connecting → active → ended
 */
export function useWebRTC() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [status, setStatus] = useState("idle");
  const [callId, setCallId] = useState(null);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const pcRef = useRef(null);
  const dcRef = useRef(null);
  const pollRef = useRef(null);
  const pollActiveRef = useRef(false);
  const roleRef = useRef(null);
  const callIdRef = useRef(null);
  const localStreamRef = useRef(null);
  const iceBufferRef = useRef([]);
  const iceFlushTimerRef = useRef(null);
  const processedIceRef = useRef(0);
  const pendingRemoteIceRef = useRef([]);
  const remoteDescSetRef = useRef(false);

  // ─── Helpers ───

  const stopPolling = useCallback(() => {
    pollActiveRef.current = false;
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  /** Tear down peer connection, data channel, and local media tracks. */
  const teardownPeer = useCallback(() => {
    const pc = pcRef.current;
    if (pc) {
      pc.ontrack = null;
      pc.onicecandidate = null;
      pc.ondatachannel = null;
      pc.onconnectionstatechange = null;
      pc.close();
      pcRef.current = null;
    }
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    const stream = localStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (iceFlushTimerRef.current) {
      clearTimeout(iceFlushTimerRef.current);
      iceFlushTimerRef.current = null;
    }
  }, []);

  const updateLocalStream = useCallback((stream) => {
    localStreamRef.current = stream;
    setLocalStream(stream);
  }, []);

  // ─── ICE candidate sending (serialized via buffer + flush timer) ───

  const flushIceBuffer = useCallback(async () => {
    if (!callIdRef.current || iceBufferRef.current.length === 0) return;
    const candidates = [...iceBufferRef.current];
    iceBufferRef.current = [];
    for (const candidate of candidates) {
      try {
        await api.addIceCandidate(callIdRef.current, candidate);
      } catch (err) {
        console.error("[WebRTC] Failed to send ICE candidate:", err);
      }
    }
  }, []);

  const scheduleIceFlush = useCallback(() => {
    if (iceFlushTimerRef.current) return;
    iceFlushTimerRef.current = setTimeout(() => {
      iceFlushTimerRef.current = null;
      flushIceBuffer();
    }, ICE_FLUSH_DELAY);
  }, [flushIceBuffer]);

  // ─── Data channel ───

  const setupDataChannel = useCallback((channel) => {
    dcRef.current = channel;
    channel.onopen = () => console.log("[WebRTC] Data channel open");
    channel.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "chat") {
          setChatMessages((prev) => [
            ...prev,
            { text: msg.text, from: "remote", time: msg.time },
          ]);
        }
      } catch {
        setChatMessages((prev) => [
          ...prev,
          { text: event.data, from: "remote", time: Date.now() },
        ]);
      }
    };
    channel.onclose = () => console.log("[WebRTC] Data channel closed");
  }, []);

  // ─── Remote ICE candidate handling ───

  const flushPendingIce = useCallback(() => {
    const pc = pcRef.current;
    if (!pc || !remoteDescSetRef.current) return;
    for (const candidate of pendingRemoteIceRef.current) {
      pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) =>
        console.error("[WebRTC] pending ICE error:", err)
      );
    }
    pendingRemoteIceRef.current = [];
  }, []);

  /**
   * Apply remote ICE candidates from startIndex. Candidates are applied
   * immediately if remote description is set, otherwise deferred to
   * pendingRemoteIceRef. The processed counter ALWAYS advances so deferred
   * candidates are not re-applied on the next poll.
   */
  const addRemoteIceCandidates = useCallback((candidates, startIndex) => {
    const pc = pcRef.current;
    if (!pc) return startIndex;
    let processed = startIndex;
    for (let i = startIndex; i < candidates.length; i++) {
      const candidate = candidates[i];
      if (remoteDescSetRef.current) {
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) =>
          console.error("[WebRTC] addIceCandidate error:", err)
        );
      } else {
        pendingRemoteIceRef.current.push(candidate);
      }
      processed = i + 1;
    }
    return processed;
  }, []);

  // ─── Peer connection ───

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // Always buffer candidates and flush via timer — serializes sends to
    // avoid concurrent read-modify-write races on the server.
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        iceBufferRef.current.push(event.candidate);
        scheduleIceFlush();
      }
    };

    pc.ondatachannel = (event) => setupDataChannel(event.channel);

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === "connected") {
        setStatus("active");
      } else if (state === "disconnected") {
        setStatus("connecting");
      } else if (state === "failed") {
        stopPolling();
        teardownPeer();
        setLocalStream(null);
        setRemoteStream(null);
        setIsMuted(false);
        setIsCameraOff(false);
        setError("Connection failed. Please try again.");
        setStatus("ended");
        if (callIdRef.current) {
          api.endCall(callIdRef.current).catch(() => {});
        }
      }
    };

    pcRef.current = pc;
    return pc;
  }, [setupDataChannel, scheduleIceFlush, stopPolling, teardownPeer]);

  // ─── Signaling poll (recursive setTimeout — no overlapping requests) ───

  const startPolling = useCallback(
    (id) => {
      stopPolling();
      pollActiveRef.current = true;
      const startTime = Date.now();

      const poll = async () => {
        if (!pollActiveRef.current) return;

        try {
          const res = await api.getCall(id);
          const call = res.data;
          if (!call) {
            if (pollActiveRef.current) {
              pollRef.current = setTimeout(poll, POLL_INTERVAL);
            }
            return;
          }

          if (
            call.status === "ended" ||
            call.status === "declined" ||
            call.status === "missed"
          ) {
            pollActiveRef.current = false;
            teardownPeer();
            setLocalStream(null);
            setRemoteStream(null);
            setIsMuted(false);
            setIsCameraOff(false);
            setStatus("ended");
            if (call.status === "declined") {
              setError("Call was declined by admin");
            }
            return;
          }

          if (roleRef.current === "caller") {
            if (call.sdp_answer && !remoteDescSetRef.current) {
              const pc = pcRef.current;
              if (pc) {
                try {
                  await pc.setRemoteDescription(
                    new RTCSessionDescription({
                      type: "answer",
                      sdp: call.sdp_answer,
                    })
                  );
                  remoteDescSetRef.current = true;
                  setStatus("connecting");
                  flushPendingIce();
                } catch (err) {
                  console.error(
                    "[WebRTC] setRemoteDescription (answer) failed:",
                    err
                  );
                }
              }
            }
            if (call.callee_ice) {
              processedIceRef.current = addRemoteIceCandidates(
                call.callee_ice,
                processedIceRef.current
              );
            }
          } else {
            if (call.caller_ice) {
              processedIceRef.current = addRemoteIceCandidates(
                call.caller_ice,
                processedIceRef.current
              );
            }
          }

          if (
            roleRef.current === "caller" &&
            call.status === "ringing" &&
            Date.now() - startTime > RINGING_TIMEOUT
          ) {
            pollActiveRef.current = false;
            teardownPeer();
            setLocalStream(null);
            setRemoteStream(null);
            setIsMuted(false);
            setIsCameraOff(false);
            setStatus("ended");
            setError("No answer from admin. Please try again later.");
            try {
              await api.endCall(id);
            } catch {}
            return;
          }
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("[WebRTC] Polling error:", err);
          }
        }

        if (pollActiveRef.current) {
          pollRef.current = setTimeout(poll, POLL_INTERVAL);
        }
      };

      pollRef.current = setTimeout(poll, POLL_INTERVAL);
    },
    [stopPolling, addRemoteIceCandidates, flushPendingIce, teardownPeer]
  );

  // ─── Caller (customer): start a call ───

  const startCall = useCallback(async () => {
    try {
      setError(null);
      setStatus("requesting_media");
      setChatMessages([]);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      updateLocalStream(stream);

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const dc = pc.createDataChannel("chat", { ordered: true });
      setupDataChannel(dc);

      const offer = await pc.createOffer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      await pc.setLocalDescription(offer);

      roleRef.current = "caller";
      setStatus("ringing");

      const res = await api.initiateCall(offer.sdp);
      const id = res.data.id;
      callIdRef.current = id;
      setCallId(id);

      await flushIceBuffer();
      startPolling(id);
    } catch (err) {
      console.error("[WebRTC] startCall failed:", err);
      teardownPeer();
      updateLocalStream(null);
      setRemoteStream(null);
      setIsMuted(false);
      setIsCameraOff(false);
      if (err.name === "NotAllowedError") {
        setError("Camera/microphone access denied. Please allow permissions.");
      } else if (err.name === "NotFoundError") {
        setError("No camera or microphone found.");
      } else {
        setError(err.message || "Failed to start call");
      }
      setStatus("ended");
    }
  }, [
    createPeerConnection,
    setupDataChannel,
    flushIceBuffer,
    startPolling,
    teardownPeer,
    updateLocalStream,
  ]);

  // ─── Callee (admin): accept an incoming call ───

  const acceptCall = useCallback(
    async (incomingCall) => {
      try {
        setError(null);
        setStatus("requesting_media");
        setChatMessages([]);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        });
        updateLocalStream(stream);

        const pc = createPeerConnection();
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        const id = incomingCall.id;
        callIdRef.current = id;
        setCallId(id);
        roleRef.current = "callee";

        await pc.setRemoteDescription(
          new RTCSessionDescription({
            type: "offer",
            sdp: incomingCall.sdp_offer,
          })
        );
        remoteDescSetRef.current = true;
        flushPendingIce();

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        setStatus("connecting");
        await api.submitCallAnswer(id, answer.sdp);

        await flushIceBuffer();
        startPolling(id);
      } catch (err) {
        console.error("[WebRTC] acceptCall failed:", err);
        teardownPeer();
        updateLocalStream(null);
        setRemoteStream(null);
        setIsMuted(false);
        setIsCameraOff(false);
        if (err.name === "NotAllowedError") {
          setError("Camera/microphone access denied. Please allow permissions.");
        } else if (err.name === "NotFoundError") {
          setError("No camera or microphone found.");
        } else {
          setError(err.message || "Failed to accept call");
        }
        setStatus("ended");
      }
    },
    [
      createPeerConnection,
      flushPendingIce,
      flushIceBuffer,
      startPolling,
      teardownPeer,
      updateLocalStream,
    ]
  );

  // ─── End call (either party) ───

  const endCall = useCallback(async () => {
    stopPolling();
    teardownPeer();
    setLocalStream(null);
    setRemoteStream(null);
    setIsMuted(false);
    setIsCameraOff(false);
    setStatus("ended");

    if (callIdRef.current) {
      try {
        await api.endCall(callIdRef.current);
      } catch {}
    }
  }, [stopPolling, teardownPeer]);

  // ─── Media controls ───

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!videoTrack.enabled);
    }
  }, []);

  const sendChatMessage = useCallback((text) => {
    if (!text.trim() || !dcRef.current) return;
    const time = Date.now();
    const msg = JSON.stringify({ type: "chat", text: text.trim(), time });
    try {
      dcRef.current.send(msg);
      setChatMessages((prev) => [
        ...prev,
        { text: text.trim(), from: "self", time },
      ]);
    } catch (err) {
      console.error("[WebRTC] sendChatMessage failed:", err);
    }
  }, []);

  // ─── Reset to idle (after modal close) ───

  const reset = useCallback(() => {
    stopPolling();
    teardownPeer();
    setLocalStream(null);
    setRemoteStream(null);
    setIsMuted(false);
    setIsCameraOff(false);
    callIdRef.current = null;
    roleRef.current = null;
    iceBufferRef.current = [];
    processedIceRef.current = 0;
    pendingRemoteIceRef.current = [];
    remoteDescSetRef.current = false;
    setError(null);
    setCallId(null);
    setStatus("idle");
    setChatMessages([]);
  }, [stopPolling, teardownPeer]);

  // ─── Cleanup on unmount ───

  useEffect(() => {
    return () => {
      stopPolling();
      teardownPeer();
      if (callIdRef.current) {
        api.endCall(callIdRef.current).catch(() => {});
      }
    };
  }, [stopPolling, teardownPeer]);

  return {
    localStream,
    remoteStream,
    status,
    callId,
    error,
    isMuted,
    isCameraOff,
    chatMessages,
    startCall,
    acceptCall,
    endCall,
    toggleMute,
    toggleCamera,
    sendChatMessage,
    reset,
  };
}

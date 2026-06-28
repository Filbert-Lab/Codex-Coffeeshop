import { useRef, useEffect, useState } from "react";

const STATUS_TEXT = {
  requesting_media: "Accessing camera…",
  ringing: "Calling admin…",
  connecting: "Connecting…",
  active: "Connected",
  ended: "Call ended",
};

export default function CallModal({ webrtc, role, onClose }) {
  const {
    localStream,
    remoteStream,
    status,
    error,
    isMuted,
    isCameraOff,
    chatMessages,
    endCall,
    toggleMute,
    toggleCamera,
    sendChatMessage,
  } = webrtc;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, showChat]);

  const handleHangup = async () => {
    await endCall();
    if (onClose) onClose();
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    sendChatMessage(chatInput);
    setChatInput("");
  };

  const isActive = status === "active";
  const isRinging = status === "ringing" || status === "requesting_media";

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center animate-fade-in"
      style={{
        background: "rgba(20,12,6,0.85)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="relative w-full h-full sm:w-[92vw] sm:h-[90vh] sm:rounded-3xl overflow-hidden flex animate-scale-in"
        style={{
          background: "linear-gradient(180deg, #2A1B0E 0%, #1C1410 100%)",
          border: "1px solid #5C3D24",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* ─── Remote video (full area) ─── */}
        <div className="flex-1 relative bg-black">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              remoteStream ? "opacity-100" : "opacity-0"
            }`}
          />
          {!remoteStream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              {/* Pulsing avatar */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    background: "rgba(184,139,90,0.3)",
                    animationDuration: "2s",
                  }}
                />
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold relative"
                  style={{
                    background:
                      "linear-gradient(135deg, #C9A876 0%, #9C6B3F 50%, #5A3920 100%)",
                    color: "#FAF6EF",
                    boxShadow:
                      "0 8px 28px rgba(156,107,63,0.4), 0 1px 0 rgba(255,255,255,0.2) inset",
                  }}
                >
                  {role === "caller" ? "🎧" : "☕"}
                </div>
              </div>
              <p
                className="text-lg font-semibold animate-pulse-soft"
                style={{ color: "#C9A876" }}
              >
                {STATUS_TEXT[status] || "Connecting…"}
              </p>
            </div>
          )}

          {/* Status bar — top */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <div
              className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2"
              style={{
                background: "rgba(42,27,14,0.7)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(184,139,90,0.2)",
                color: "#FAF6EF",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: isActive ? "#5A9070" : "#C8924E",
                  boxShadow: isActive
                    ? "0 0 8px #5A9070"
                    : "0 0 8px #C8924E",
                  animation: "pulseSoft 2s ease-in-out infinite",
                }}
              />
              {STATUS_TEXT[status] || "Connecting…"}
            </div>
            <button
              onClick={handleHangup}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(42,27,14,0.7)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(184,84,80,0.3)",
                color: "#E5A19E",
              }}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Local video — picture-in-picture */}
          <div
            className="absolute bottom-4 right-4 w-32 h-24 sm:w-44 sm:h-32 rounded-2xl overflow-hidden border-2 z-10 transition-all duration-300"
            style={{
              borderColor: "rgba(184,139,90,0.4)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              background: "#1C1410",
            }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {isCameraOff && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#1C1410" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B6F47" strokeWidth="2" strokeLinecap="round">
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* ─── Chat panel ─── */}
        {showChat && (
          <div
            className="w-full max-w-[320px] flex flex-col animate-fade-in pb-[92px] sm:pb-[108px]"
            style={{
              background: "rgba(28,20,16,0.95)",
              borderLeft: "1px solid #3D2E22",
            }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid #3D2E22" }}
            >
              <span className="text-sm font-semibold" style={{ color: "#C9A876" }}>
                Live Chat
              </span>
              <button
                onClick={() => setShowChat(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                style={{ color: "#8B6F47" }}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatMessages.length === 0 && (
                <p className="text-center text-xs mt-8" style={{ color: "#5C4530" }}>
                  No messages yet. Say hello! 👋
                </p>
              )}
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "self" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[80%] px-3 py-2 rounded-2xl text-sm"
                    style={
                      msg.from === "self"
                        ? {
                            background: "linear-gradient(135deg, #9C6B3F, #7A5230)",
                            color: "#FAF6EF",
                            borderBottomRightRadius: "6px",
                          }
                        : {
                            background: "rgba(250,246,239,0.06)",
                            color: "#F0E6D8",
                            border: "1px solid #3D2E22",
                            borderBottomLeftRadius: "6px",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form
              onSubmit={handleSendChat}
              className="p-3 flex gap-2"
              style={{ borderTop: "1px solid #3D2E22" }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "rgba(250,246,239,0.06)",
                  border: "1px solid #3D2E22",
                  color: "#F0E6D8",
                }}
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #B88B5A, #9C6B3F)",
                  color: "#FAF6EF",
                }}
                aria-label="Send"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* ─── Control bar ─── */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-center gap-3 z-20">
          <button
            onClick={toggleMute}
            disabled={!isActive && !isRinging}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
            style={{
              background: isMuted
                ? "linear-gradient(135deg, #B85450, #963A37)"
                : "rgba(250,246,239,0.08)",
              border: "1px solid rgba(184,139,90,0.2)",
              color: "#FAF6EF",
              backdropFilter: "blur(8px)",
            }}
            aria-label={isMuted ? "Unmute" : "Mute"}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
                <path d="M19 5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleCamera}
            disabled={!isActive && !isRinging}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
            style={{
              background: isCameraOff
                ? "linear-gradient(135deg, #B85450, #963A37)"
                : "rgba(250,246,239,0.08)",
              border: "1px solid rgba(184,139,90,0.2)",
              color: "#FAF6EF",
              backdropFilter: "blur(8px)",
            }}
            aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"}
            title={isCameraOff ? "Turn camera on" : "Turn camera off"}
          >
            {isCameraOff ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative"
            style={{
              background: showChat
                ? "linear-gradient(135deg, #9C6B3F, #7A5230)"
                : "rgba(250,246,239,0.08)",
              border: "1px solid rgba(184,139,90,0.2)",
              color: "#FAF6EF",
              backdropFilter: "blur(8px)",
            }}
            aria-label="Toggle chat"
            title="Toggle chat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {chatMessages.length > 0 && !showChat && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: "#B85450", color: "#FAF6EF" }}
              >
                {chatMessages.length > 9 ? "9+" : chatMessages.length}
              </span>
            )}
          </button>

          <div className="w-px h-8 mx-1" style={{ background: "rgba(184,139,90,0.2)" }} />

          <button
            onClick={handleHangup}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #B85450 0%, #963A37 50%, #7A2A27 100%)",
              color: "#FAF6EF",
              boxShadow: "0 4px 20px rgba(184,84,80,0.4), 0 1px 0 rgba(255,255,255,0.15) inset",
            }}
            aria-label="End call"
            title="End call"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(135deg)" }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
        </div>

        {/* Error overlay */}
        {error && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 animate-fade-in">
            <div
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-center max-w-[80vw]"
              style={{
                background: "rgba(184,84,80,0.15)",
                border: "1px solid rgba(184,84,80,0.4)",
                color: "#E5A19E",
                backdropFilter: "blur(8px)",
              }}
            >
              {error}
            </div>
          </div>
        )}

        {/* Ended overlay */}
        {status === "ended" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-30 animate-fade-in" style={{ background: "rgba(20,12,6,0.9)" }}>
            <p className="text-lg font-semibold" style={{ color: "#C9A876" }}>
              {error || "Call ended"}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #B88B5A, #9C6B3F)",
                color: "#FAF6EF",
                boxShadow: "0 4px 14px rgba(156,107,63,0.3)",
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

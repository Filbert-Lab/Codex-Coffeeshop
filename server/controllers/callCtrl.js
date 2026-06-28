const CallSession = require("../models/CallSession");

const parseIce = (val) => {
  try {
    return JSON.parse(val || "[]");
  } catch {
    return [];
  }
};

const MAX_ICE_CANDIDATES = 50;

/** Verify the requester is the caller of this call or an admin. */
const verifyCallAccess = (call, user) => {
  if (!call) return false;
  return call.caller_id === user?.id || user?.role === "admin";
};

/**
 * POST /api/calls — Caller (customer) initiates a call.
 * Body: { sdp_offer }
 * Creates a CallSession row with status "ringing".
 */
const initiateCall = async (req, res, next) => {
  try {
    const caller_id = req.user?.id;
    const caller_name = req.user?.name?.trim() || "Customer";
    const { sdp_offer } = req.body;

    if (!sdp_offer || typeof sdp_offer !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "SDP offer is required" });
    }

    // Clean up any previous active/ringing call from this caller.
    await CallSession.update(
      { status: "ended", ended_by: "system" },
      { where: { caller_id, status: ["ringing", "active"] } }
    );

    const call = await CallSession.create({
      caller_id,
      caller_name,
      status: "ringing",
      sdp_offer,
      caller_ice: "[]",
      callee_ice: "[]",
    });

    res.status(201).json({
      success: true,
      message: "Call initiated — waiting for admin to answer",
      data: { id: call.id, status: call.status, caller_name },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/calls/incoming — Admin polls for a ringing call.
 */
const getIncomingCall = async (req, res, next) => {
  try {
    const call = await CallSession.findRinging();
    if (!call) {
      return res.json({ success: true, data: null });
    }
    res.json({
      success: true,
      data: {
        id: call.id,
        caller_id: call.caller_id,
        caller_name: call.caller_name,
        status: call.status,
        sdp_offer: call.sdp_offer,
        created_at: call.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/calls/:id — Poll for signaling data (offer, answer, ICE, status).
 * Caller reads answer + callee_ice; callee reads caller_ice.
 */
const getCall = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const call = await CallSession.findByPk(id);
    if (!call) {
      return res
        .status(404)
        .json({ success: false, message: "Call not found" });
    }

    const isCaller = call.caller_id === req.user?.id;
    const isAdmin = req.user?.role === "admin";
    if (!isCaller && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.json({
      success: true,
      data: {
        id: call.id,
        caller_id: call.caller_id,
        caller_name: call.caller_name,
        status: call.status,
        sdp_offer: call.sdp_offer,
        sdp_answer: call.sdp_answer,
        caller_ice: parseIce(call.caller_ice),
        callee_ice: parseIce(call.callee_ice),
        ended_by: call.ended_by,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/calls/:id/answer — Admin submits the SDP answer.
 * Body: { sdp_answer }
 */
const submitAnswer = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { sdp_answer } = req.body;
    if (!sdp_answer || typeof sdp_answer !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "SDP answer is required" });
    }

    const call = await CallSession.findByPk(id);
    if (!call) {
      return res
        .status(404)
        .json({ success: false, message: "Call not found" });
    }
    if (call.status !== "ringing") {
      return res.status(400).json({
        success: false,
        message: "Call is no longer ringing (may have been answered or ended)",
      });
    }

    call.sdp_answer = sdp_answer;
    call.status = "active";
    await call.save();

    res.json({ success: true, message: "Answer submitted — call is now active" });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/calls/:id/ice — Append an ICE candidate.
 * Caller writes to caller_ice; admin writes to callee_ice.
 * Body: { candidate }
 */
const addIceCandidate = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { candidate } = req.body;
    if (!candidate) {
      return res
        .status(400)
        .json({ success: false, message: "ICE candidate is required" });
    }

    const call = await CallSession.findByPk(id);
    if (!call) {
      return res
        .status(404)
        .json({ success: false, message: "Call not found" });
    }
    if (call.status === "ended" || call.status === "declined") {
      return res
        .status(400)
        .json({ success: false, message: "Call has already ended" });
    }

    if (!verifyCallAccess(call, req.user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const isAdmin = req.user?.role === "admin";
    const field = isAdmin ? "callee_ice" : "caller_ice";
    const arr = parseIce(call[field]);
    if (arr.length >= MAX_ICE_CANDIDATES) {
      return res
        .status(400)
        .json({ success: false, message: "ICE candidate limit reached" });
    }
    arr.push(candidate);
    await call.update({ [field]: JSON.stringify(arr) });

    res.json({ success: true, message: "ICE candidate stored" });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/calls/:id/end — Either party ends the call.
 */
const endCall = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const call = await CallSession.findByPk(id);
    if (!call) {
      return res
        .status(404)
        .json({ success: false, message: "Call not found" });
    }
    if (call.status === "ended" || call.status === "declined") {
      return res.json({ success: true, message: "Call already ended" });
    }

    if (!verifyCallAccess(call, req.user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const isAdmin = req.user?.role === "admin";
    call.status = "ended";
    call.ended_by = isAdmin ? "callee" : "caller";
    await call.save();

    res.json({ success: true, message: "Call ended" });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/calls/:id/decline — Admin declines an incoming call.
 */
const declineCall = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const call = await CallSession.findByPk(id);
    if (!call) {
      return res
        .status(404)
        .json({ success: false, message: "Call not found" });
    }
    call.status = "declined";
    call.ended_by = "callee";
    await call.save();
    res.json({ success: true, message: "Call declined" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initiateCall,
  getIncomingCall,
  getCall,
  submitAnswer,
  addIceCandidate,
  endCall,
  declineCall,
};

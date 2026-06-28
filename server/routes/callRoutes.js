const express = require("express");
const router = express.Router();
const {
  initiateCall,
  getIncomingCall,
  getCall,
  submitAnswer,
  addIceCandidate,
  endCall,
  declineCall,
} = require("../controllers/callCtrl");
const { requireAuth, requireAdmin } = require("../auth");
const { validateIdParam } = require("../middleware/validate");

// Caller (customer) initiates a call — creates SDP offer
router.post("/", requireAuth, initiateCall);

// Admin polls for an incoming ringing call
router.get("/incoming", requireAdmin, getIncomingCall);

// Either party polls for signaling data (answer, ICE candidates, status)
router.get("/:id", validateIdParam, requireAuth, getCall);

// Admin submits the SDP answer
router.post("/:id/answer", validateIdParam, requireAuth, requireAdmin, submitAnswer);

// Either party sends an ICE candidate
router.post("/:id/ice", validateIdParam, requireAuth, addIceCandidate);

// Either party ends the call
router.patch("/:id/end", validateIdParam, requireAuth, endCall);

// Admin declines an incoming call
router.patch("/:id/decline", validateIdParam, requireAuth, requireAdmin, declineCall);

module.exports = router;

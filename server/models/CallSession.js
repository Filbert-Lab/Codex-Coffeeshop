const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const BaseModel = require("./BaseModel");
const { Op } = require("sequelize");

/**
 * CallSession — stores WebRTC signaling data for a video support call.
 *
 * Because Vercel is serverless (no persistent WebSocket), signaling is
 * exchanged via REST + DB polling: each side writes its own SDP / ICE
 * candidates, and the other side polls to read them.
 *
 *   caller (customer) ── sdp_offer / caller_ice ──┐
 *                                                  ├── CallSession row
 *   callee (admin)    ── sdp_answer / callee_ice ──┘
 */
class CallSession extends BaseModel {
  /**
   * Most recent call with status "ringing" that is younger than
   * RINGING_TTL seconds (stale calls from closed tabs are excluded).
   */
  static async findRinging() {
    const cutoff = new Date(Date.now() - CallSession.RINGING_TTL_MS);
    return this.findOne({
      where: {
        status: "ringing",
        created_at: { [Op.gt]: cutoff },
      },
      order: [["created_at", "DESC"]],
    });
  }
}

CallSession.RINGING_TTL_MS = 60000;

CallSession.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    caller_id: { type: DataTypes.INTEGER, allowNull: false },
    caller_name: { type: DataTypes.STRING(100), allowNull: false },
    status: {
      type: DataTypes.ENUM("ringing", "active", "ended", "declined", "missed"),
      defaultValue: "ringing",
    },
    sdp_offer: { type: DataTypes.TEXT, allowNull: true },
    sdp_answer: { type: DataTypes.TEXT, allowNull: true },
    caller_ice: { type: DataTypes.TEXT, allowNull: true, defaultValue: "[]" },
    callee_ice: { type: DataTypes.TEXT, allowNull: true, defaultValue: "[]" },
    ended_by: { type: DataTypes.STRING(20), allowNull: true },
  },
  {
    sequelize,
    modelName: "CallSession",
    tableName: "call_sessions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = CallSession;

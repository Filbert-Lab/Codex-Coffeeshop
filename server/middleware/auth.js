/**
 * middleware/auth.js — Backwards-compat shim.
 *
 * The real implementation lives in `server/auth/`. We keep this file so
 * existing routes that imported `authMiddleware` / `adminMiddleware` from
 * here keep working without modification. New code should import from
 * `../auth` directly.
 */
const auth = require("../auth");

module.exports = {
  // Old names → new Passport-based guards
  authMiddleware: auth.requireAuth,
  adminMiddleware: auth.requireAdmin,
  optionalAuth: auth.optionalAuth,

  // New names exposed too
  requireAuth: auth.requireAuth,
  requireAdmin: auth.requireAdmin,

  // Token helpers (some controllers used JWT_SECRET directly)
  JWT_SECRET: auth.JWT_SECRET,
};

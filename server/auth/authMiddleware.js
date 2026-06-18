/**
 * authMiddleware.js — exports JWT-based guards built on Passport.
 * - requireAuth   : fail with 401 if no/invalid Bearer token
 * - requireAdmin  : run requireAuth, then enforce role === 'admin'
 * - optionalAuth  : populate req.user when a valid token is present, never fail
 *
 * Keeps the public surface compatible with the old `middleware/auth.js` so
 * existing controllers can swap imports without changing behaviour.
 */
const passport = require("./passport");

/** 401 unless a valid Bearer JWT is present. */
function requireAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      const message =
        (info && info.message) ||
        (info && info.name === "TokenExpiredError" ? "Token expired" : null) ||
        "No token provided";
      return res.status(401).json({ success: false, message });
    }
    req.user = user;
    return next();
  })(req, res, next);
}

/** 401 if not authenticated, then 403 if role !== 'admin'. */
function requireAdmin(req, res, next) {
  requireAuth(req, res, (err) => {
    if (err) return next(err);
    if (req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }
    return next();
  });
}

/** Populates req.user when a Bearer token is valid; never errors out. */
function optionalAuth(req, _res, next) {
  passport.authenticate("jwt", { session: false }, (_err, user) => {
    if (user) req.user = user;
    return next();
  })(req, _res, next);
}

module.exports = { requireAuth, requireAdmin, optionalAuth };

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Fail-fast: refuse to start if JWT_SECRET is missing or weak in production
if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error(
      "FATAL: JWT_SECRET environment variable must be set to a strong (32+ char) secret in production."
    );
  }
}

// Dev fallback (warn loudly)
const SECRET = JWT_SECRET || "codex_dev_only_secret_NOT_FOR_PRODUCTION_USE";
if (!JWT_SECRET) {
  console.warn(
    "⚠️  [auth] JWT_SECRET not set — using dev-only fallback. SET JWT_SECRET in production!"
  );
}

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  const token = auth.slice(7);

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

/** Optional auth — sets req.user if token valid, but doesn't reject if missing */
const optionalAuth = (req, _res, next) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    try {
      req.user = jwt.verify(auth.slice(7), SECRET);
    } catch { /* ignore — proceed unauthenticated */ }
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, optionalAuth, JWT_SECRET: SECRET };

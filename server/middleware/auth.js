const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

// Production: must have a JWT_SECRET (any length); warn if weak
if (isProd) {
  if (!JWT_SECRET) {
    throw new Error(
      "FATAL: JWT_SECRET environment variable must be set in production. " +
        "Set it in Vercel project Settings → Environment Variables."
    );
  }
  if (JWT_SECRET.length < 32) {
    console.warn(
      `⚠️  [auth] JWT_SECRET is only ${JWT_SECRET.length} chars. ` +
        "Recommended: 32+ chars random string for stronger security."
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

const optionalAuth = (req, _res, next) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    try {
      req.user = jwt.verify(auth.slice(7), SECRET);
    } catch { /* ignore */ }
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, optionalAuth, JWT_SECRET: SECRET };

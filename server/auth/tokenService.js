/**
 * tokenService.js
 * Centralised JWT issue / verify helpers.
 * Keeps secret-management logic in one place so the rest of the codebase
 * never touches `process.env.JWT_SECRET` directly.
 */
const jwt = require("jsonwebtoken");

const TOKEN_EXPIRY = process.env.JWT_EXPIRY || "7d";
const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

function resolveSecret() {
  const secret = process.env.JWT_SECRET;
  if (isProd) {
    if (!secret) {
      throw new Error(
        "FATAL: JWT_SECRET environment variable must be set in production. " +
          "Set it in Vercel project Settings → Environment Variables.",
      );
    }
    if (secret.length < 32) {
      console.warn(
        `⚠️  [auth] JWT_SECRET is only ${secret.length} chars. ` +
          "Recommended: 32+ chars random string for stronger security.",
      );
    }
    return secret;
  }
  if (!secret) {
    console.warn(
      "⚠️  [auth] JWT_SECRET not set — using dev-only fallback. SET JWT_SECRET in production!",
    );
    return "codex_dev_only_secret_NOT_FOR_PRODUCTION_USE";
  }
  return secret;
}

const JWT_SECRET = resolveSecret();

/**
 * Build a token payload from a user instance.
 * Only stable, non-sensitive fields go into the JWT.
 */
function buildPayload(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

/** Sign a JWT for the given user. */
function issueToken(user, options = {}) {
  return jwt.sign(buildPayload(user), JWT_SECRET, {
    expiresIn: options.expiresIn || TOKEN_EXPIRY,
  });
}

/** Verify a JWT. Throws on invalid/expired. */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  JWT_SECRET,
  TOKEN_EXPIRY,
  issueToken,
  verifyToken,
  buildPayload,
};

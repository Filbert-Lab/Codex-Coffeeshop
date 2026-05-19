/**
 * Vercel serverless entry point.
 * Reuses the main Express app from server/server.js to avoid duplicating
 * security middleware (helmet, CORS, rate limiting, etc.).
 *
 * Vercel sets process.env.VERCEL=1 — server.js detects this and skips listen().
 */
require("dotenv").config();

console.log("🚀 [API] Vercel serverless entry — loading app...");

let app;
try {
  app = require("../server/server");
  console.log("✅ [API] Express app loaded");
} catch (err) {
  console.error("❌ [API] Failed to load server:", err.message);
  console.error(err.stack);
  // Fallback: respond with 500 to all requests so debugging is visible
  const express = require("express");
  app = express();
  app.use((_req, res) => {
    res.status(500).json({
      success: false,
      message: "Server initialization failed: " + err.message,
      hint:
        "Check Vercel Environment Variables. Required: DATABASE_URL, JWT_SECRET. " +
        "See deployment guide in README.",
    });
  });
}

// Sync database on first request (cold start), but cache the promise so
// subsequent requests don't re-sync.
let dbReady;

module.exports = async (req, res) => {
  if (!dbReady) {
    dbReady = (async () => {
      try {
        const { sequelize } = require("../server/models/index");
        await sequelize.authenticate();
        await sequelize.sync({ alter: false });
        console.log("✅ [API] Database connected & synced");
      } catch (err) {
        console.error("❌ [API] Database init failed:", err.message);
        // Reset so next request retries
        dbReady = null;
        throw err;
      }
    })();
  }

  try {
    await dbReady;
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database unavailable: " + err.message,
    });
  }

  return app(req, res);
};

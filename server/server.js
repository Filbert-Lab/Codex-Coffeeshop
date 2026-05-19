const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

dotenv.config();

// Load models & associations (registers them with Sequelize)
const { sequelize } = require("./models/index");

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

// ─── Trust proxy (needed for rate-limit + req.ip behind Vercel/CDN) ───
app.set("trust proxy", 1);

// ─── Security headers ───
app.use(
  helmet({
    contentSecurityPolicy: false, // managed by frontend
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ─── CORS ───
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: isProd
      ? (origin, cb) => {
          // Allow same-origin / no-origin requests (e.g. curl, server-to-server)
          if (!origin) return cb(null, true);
          if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return cb(null, true);
          }
          return cb(new Error("Not allowed by CORS"), false);
        }
      : true, // dev: reflect any origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ─── Body parsing with size limits ───
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// ─── Rate limiting on auth endpoints (mitigates brute-force) ───
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts, please try again later" },
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // 200 req/min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please slow down" },
});

app.use("/api", generalLimiter);

// Routes — auth endpoints get stricter limit
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/promos", require("./routes/promoRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Codex Coffee API is running ☕", env: isProd ? "production" : "development" });
});

// 404 for unknown /api routes
app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// ─── Centralized error handler ───
app.use((err, _req, res, _next) => {
  // Don't leak stack traces in production
  console.error("[ERROR]", err.message, isProd ? "" : err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: isProd && (err.status || 500) >= 500 ? "Internal Server Error" : err.message,
  });
});

// ─── Start server (skip in Vercel — they handle it) ───
if (!process.env.VERCEL) {
  sequelize
    .sync()
    .then(() => {
      console.log("✅ Database synced");
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error("❌ DB sync failed:", err.message);
      process.exit(1);
    });
}

module.exports = app;

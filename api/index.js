const express = require("express");
const cors = require("cors");
const path = require("path");

console.log("🚀 [API] Starting Express app initialization...");

const app = express();

// Middleware
app.use(
  cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (no DB dependency)
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Codex Coffee API is running ☕" });
});

// Lazy load models and routes on first request
let sequelize = null;
let routesLoaded = false;

app.use(async (req, res, next) => {
  // Load models on first request
  if (!routesLoaded) {
    try {
      console.log("📦 [API] Loading models on first request...");
      console.log("NODE_ENV:", process.env.NODE_ENV);
      console.log(
        "DATABASE_URL_UNPOOLED:",
        process.env.DATABASE_URL_UNPOOLED ? "✅" : "❌",
      );
      console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅" : "❌");

      console.log("📦 [API] About to require models...");
      const models = require(path.join(__dirname, "../server/models/index"));
      console.log("✅ [API] Models require succeeded");
      sequelize = models.sequelize;
      console.log("✅ [API] Models loaded successfully");

      // Sync database
      console.log("🔄 [API] About to sync database...");
      await sequelize.sync({ alter: false });
      console.log("✅ [API] Database synced successfully");

      // Load routes
      console.log("🛣️ [API] Loading routes...");
      app.use(
        "/api/users",
        require(path.join(__dirname, "../server/routes/userRoutes")),
      );
      console.log("  ✅ User routes loaded");
      app.use(
        "/api/categories",
        require(path.join(__dirname, "../server/routes/categoryRoutes")),
      );
      console.log("  ✅ Category routes loaded");
      app.use(
        "/api/products",
        require(path.join(__dirname, "../server/routes/productRoutes")),
      );
      console.log("  ✅ Product routes loaded");
      app.use(
        "/api/orders",
        require(path.join(__dirname, "../server/routes/orderRoutes")),
      );
      console.log("  ✅ Order routes loaded");
      app.use(
        "/api/promos",
        require(path.join(__dirname, "../server/routes/promoRoutes")),
      );
      console.log("  ✅ Promo routes loaded");
      app.use(
        "/api/stats",
        require(path.join(__dirname, "../server/routes/statsRoutes")),
      );
      console.log("  ✅ Stats routes loaded");
      console.log("✅ [API] All routes loaded successfully");

      routesLoaded = true;
    } catch (err) {
      console.error(
        "❌ [API] Failed to load models/routes/sync on first request",
      );
      console.error("Error Type:", err.constructor.name);
      console.error("Error Message:", err.message);
      console.error("Stack:", err.stack);
      console.error(
        "Full Error:",
        JSON.stringify(err, Object.getOwnPropertyNames(err)),
      );
      return res.status(500).json({
        success: false,
        message: "Failed to initialize database: " + err.message,
        error: err.message,
      });
    }
  }
  next();
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("❌ [API] Error:", err.message);
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

console.log("✅ [API] Express app configured");

// Export as serverless handler for Vercel
module.exports = app;

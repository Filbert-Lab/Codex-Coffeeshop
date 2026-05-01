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
      console.log("DATABASE_URL_UNPOOLED:", process.env.DATABASE_URL_UNPOOLED ? "✅" : "❌");
      console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅" : "❌");

      const models = require(path.join(__dirname, "../server/models/index"));
      sequelize = models.sequelize;
      console.log("✅ [API] Models loaded successfully");

      // Sync database
      console.log("🔄 [API] Syncing database...");
      await sequelize.sync({ alter: false });
      console.log("✅ [API] Database synced");

      // Load routes
      app.use(
        "/api/users",
        require(path.join(__dirname, "../server/routes/userRoutes")),
      );
      app.use(
        "/api/categories",
        require(path.join(__dirname, "../server/routes/categoryRoutes")),
      );
      app.use(
        "/api/products",
        require(path.join(__dirname, "../server/routes/productRoutes")),
      );
      app.use(
        "/api/orders",
        require(path.join(__dirname, "../server/routes/orderRoutes")),
      );
      app.use(
        "/api/promos",
        require(path.join(__dirname, "../server/routes/promoRoutes")),
      );
      app.use(
        "/api/stats",
        require(path.join(__dirname, "../server/routes/statsRoutes")),
      );
      console.log("✅ [API] All routes loaded successfully");

      routesLoaded = true;
    } catch (err) {
      console.error("❌ [API] Failed to load models/routes/sync on first request");
      console.error("Error:", err.message);
      console.error("Stack:", err.stack);
      return res.status(500).json({
        success: false,
        message: "Failed to initialize database: " + err.message,
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

module.exports = app;

module.exports = app;

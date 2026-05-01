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
  // Load models and routes on first request
  if (!routesLoaded) {
    try {
      console.log("📦 [API] Loading models on first request...");


      // Load models and sequelize instance
      console.log("  About to require models...");
      let models;
      try {
        models = require("../server/models/index");
      } catch (requireErr) {
        console.error("❌ [API] Require failed:", requireErr.message);
        throw requireErr;
      }
      console.log("✅ [API] Models require succeeded");
      sequelize = models.sequelize;
      console.log("✅ [API] Sequelize instance obtained");

      // Sync database
      console.log("🔄 [API] Syncing database...");
      await sequelize.sync({ alter: false });
      console.log("✅ [API] Database synced successfully");

      // Load routes
      console.log("🛣️ [API] Loading routes...");
      app.use("/api/users", require("../server/routes/userRoutes"));
      app.use("/api/categories", require("../server/routes/categoryRoutes"));
      app.use("/api/products", require("../server/routes/productRoutes"));
      app.use("/api/orders", require("../server/routes/orderRoutes"));
      app.use("/api/promos", require("../server/routes/promoRoutes"));
      app.use("/api/stats", require("../server/routes/statsRoutes"));
      console.log("✅ [API] All routes loaded successfully");

      routesLoaded = true;
    } catch (err) {
      console.error("❌ [API] Initialization failed");
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
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

console.log("✅ [API] Express app configured");

// Export as serverless handler for Vercel
module.exports = app;

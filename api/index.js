const express = require("express");
const cors = require("cors");
const path = require("path");

// Load env variables
require("dotenv").config();
console.log("🔧 DATABASE_URL present:", !!process.env.DATABASE_URL);

// Load models & associations - with error handling
let sequelize;
try {
  const models = require(path.join(__dirname, "../server/models/index"));
  sequelize = models.sequelize;
  console.log("✅ Models loaded successfully");
} catch (err) {
  console.error("❌ Failed to load models:", err.message);
  console.error(err);
}

const app = express();

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (no DB dependency)
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Codex Coffee API is running ☕" });
});

// Sync DB and load routes
let dbSynced = false;

app.use(async (req, res, next) => {
  if (!dbSynced) {
    if (!sequelize) {
      console.error("❌ Sequelize not initialized");
      return res.status(500).json({ success: false, message: "Database not initialized" });
    }
    try {
      console.log("🔄 Syncing database...");
      await sequelize.sync({ alter: false });
      dbSynced = true;
      console.log("✅ Database synced");
    } catch (err) {
      console.error("❌ DB sync failed:", err.message);
      console.error(err);
      return res.status(500).json({ success: false, message: "Database connection failed: " + err.message });
    }
  }
  next();
});

// Routes (only load after DB sync middleware)
try {
  app.use("/api/users", require(path.join(__dirname, "../server/routes/userRoutes")));
  app.use("/api/categories", require(path.join(__dirname, "../server/routes/categoryRoutes")));
  app.use("/api/products", require(path.join(__dirname, "../server/routes/productRoutes")));
  app.use("/api/orders", require(path.join(__dirname, "../server/routes/orderRoutes")));
  app.use("/api/promos", require(path.join(__dirname, "../server/routes/promoRoutes")));
  app.use("/api/stats", require(path.join(__dirname, "../server/routes/statsRoutes")));
  console.log("✅ All routes loaded successfully");
} catch (err) {
  console.error("❌ Failed to load routes:", err.message);
  console.error(err);
}

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("❌ API Error:", err.message);
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

module.exports = app;

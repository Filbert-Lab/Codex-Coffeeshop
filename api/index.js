const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../server/.env") });

// Load models & associations
const { sequelize } = require(path.join(__dirname, "../server/models/index"));

const app = express();

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require(path.join(__dirname, "../server/routes/userRoutes")));
app.use("/api/categories", require(path.join(__dirname, "../server/routes/categoryRoutes")));
app.use("/api/products", require(path.join(__dirname, "../server/routes/productRoutes")));
app.use("/api/orders", require(path.join(__dirname, "../server/routes/orderRoutes")));
app.use("/api/promos", require(path.join(__dirname, "../server/routes/promoRoutes")));
app.use("/api/stats", require(path.join(__dirname, "../server/routes/statsRoutes")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Codex Coffee API is running ☕" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("❌ API Error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

// Sync DB (one-time on serverless cold start)
let dbSynced = false;

app.use(async (req, res, next) => {
  if (!dbSynced) {
    try {
      await sequelize.sync({ alter: false });
      dbSynced = true;
      console.log("✅ Database synced");
    } catch (err) {
      console.error("❌ DB sync failed:", err);
      return res.status(500).json({ success: false, message: "Database connection failed" });
    }
  }
  next();
});

module.exports = app;

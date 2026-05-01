const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Load models & associations
const { sequelize } = require("./models/index");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/promos", require("./routes/promoRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Codex Coffee API is running ☕" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

// Sync DB then start server
sequelize.sync()
  .then(() => {
    console.log("✅ Database synced");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB sync failed:", err));

// Export for Vercel
module.exports = app;

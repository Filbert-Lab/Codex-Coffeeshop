const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/statsCtrl");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, adminMiddleware, getDashboardStats);

module.exports = router;

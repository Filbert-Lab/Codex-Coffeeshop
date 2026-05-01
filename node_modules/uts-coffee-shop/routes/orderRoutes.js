const express = require("express");
const router = express.Router();
const { getOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder } = require("../controllers/orderCtrl");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, adminMiddleware, getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);
router.delete("/:id", authMiddleware, adminMiddleware, deleteOrder);

module.exports = router;

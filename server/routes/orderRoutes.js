const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderCtrl");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { validateIdParam } = require("../middleware/validate");

router.get("/", authMiddleware, adminMiddleware, getOrders);
router.get("/:id", validateIdParam, getOrderById);
router.post("/", createOrder);
router.patch("/:id/status", validateIdParam, authMiddleware, adminMiddleware, updateOrderStatus);
router.delete("/:id", validateIdParam, authMiddleware, adminMiddleware, deleteOrder);

module.exports = router;

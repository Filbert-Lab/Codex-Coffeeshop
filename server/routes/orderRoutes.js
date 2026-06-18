const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderCtrl");
const { requireAuth, requireAdmin } = require("../auth");
const { validateIdParam } = require("../middleware/validate");

router.get("/", requireAuth, requireAdmin, getOrders);
router.get("/:id", validateIdParam, requireAuth, getOrderById);
// Customers MUST be logged in to place an order
router.post("/", requireAuth, createOrder);
router.patch(
  "/:id/status",
  validateIdParam,
  requireAuth,
  requireAdmin,
  updateOrderStatus,
);
router.delete("/:id", validateIdParam, requireAuth, requireAdmin, deleteOrder);

module.exports = router;

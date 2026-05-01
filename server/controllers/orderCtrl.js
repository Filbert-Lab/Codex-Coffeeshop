const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Promo = require("../models/Promo");

const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = status ? { status } : {};
    const result = await Order.findPaginated({
      where,
      page,
      limit,
      order: [["created_at", "DESC"]],
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findWithItems(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { customer_name, items, order_type = "pickup", promo_code, notes, user_id } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: "Order must have at least one item" });

    let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount_amount = 0;
    let delivery_fee = order_type === "delivery" ? 15000 : 0;

    if (promo_code) {
      const promo = await Promo.findByCode(promo_code);
      if (promo) {
        if (subtotal >= promo.min_order) {
          discount_amount = promo.calculateDiscount(subtotal);
        }
      }
    }

    const total_amount = subtotal + delivery_fee - discount_amount;

    const order = await Order.createRecord({
      customer_name: customer_name || "Walk-in Guest",
      user_id,
      total_amount,
      discount_amount,
      delivery_fee,
      status: "pending",
      order_type,
      promo_code: promo_code?.toUpperCase() || null,
      notes,
    });

    for (const item of items) {
      await OrderItem.createRecord({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      });
    }

    res.status(201).json({ success: true, message: "Order placed successfully", data: { id: order.id, total_amount } });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ["pending", "processing", "completed", "cancelled"];
    if (!valid.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });
    const affected = await Order.updateById(req.params.id, { status });
    if (!affected) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const affected = await Order.deleteById(req.params.id);
    if (!affected) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder };

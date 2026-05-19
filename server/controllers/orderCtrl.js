const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Promo = require("../models/Promo");
const sequelize = require("../config/sequelize");
const { Op } = require("sequelize");

const VALID_STATUSES = ["pending", "processing", "completed", "cancelled"];
const VALID_ORDER_TYPES = ["pickup", "delivery"];
const DELIVERY_FEE = 15000;
const MAX_ITEMS_PER_ORDER = 50;

const getOrders = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const status = VALID_STATUSES.includes(req.query.status) ? req.query.status : null;

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
    const id = Number(req.params.id);
    const order = await Order.findWithItems(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  // Use a transaction so order + items are atomic
  const t = await sequelize.transaction();
  try {
    const {
      customer_name,
      items,
      order_type = "pickup",
      promo_code,
      notes,
      user_id,
    } = req.body;

    // ─── Validation ───
    if (!Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Order must have at least one item" });
    }
    if (items.length > MAX_ITEMS_PER_ORDER) {
      await t.rollback();
      return res.status(400).json({ success: false, message: `Maximum ${MAX_ITEMS_PER_ORDER} items per order` });
    }
    if (!VALID_ORDER_TYPES.includes(order_type)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Invalid order type" });
    }

    // ─── SECURITY: refetch product prices server-side, NEVER trust client ───
    const productIds = [...new Set(items.map((i) => Number(i.product_id)).filter(Boolean))];
    const products = await Product.findAll({
      where: { id: { [Op.in]: productIds } },
      attributes: ["id", "price", "name", "is_available"],
      transaction: t,
    });

    if (products.length !== productIds.length) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "One or more products not found" });
    }

    const priceMap = new Map(products.map((p) => [p.id, p]));

    // Build server-priced items
    const validatedItems = [];
    for (const raw of items) {
      const product = priceMap.get(Number(raw.product_id));
      if (!product) {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Product ${raw.product_id} not found` });
      }
      if (!product.is_available) {
        await t.rollback();
        return res
          .status(400)
          .json({ success: false, message: `${product.name} is not available` });
      }
      const qty = Math.max(1, Math.min(99, parseInt(raw.quantity, 10) || 1));
      const price = Number(product.price); // server-trusted price
      validatedItems.push({ product_id: product.id, quantity: qty, price, subtotal: price * qty });
    }

    const subtotal = validatedItems.reduce((s, i) => s + i.subtotal, 0);
    const delivery_fee = order_type === "delivery" ? DELIVERY_FEE : 0;

    // ─── Promo validation (server-side) ───
    let discount_amount = 0;
    let appliedPromoCode = null;
    if (promo_code) {
      const promo = await Promo.findByCode(promo_code);
      if (promo && subtotal >= Number(promo.min_order || 0)) {
        discount_amount = promo.calculateDiscount(subtotal);
        appliedPromoCode = promo.code;
      }
    }

    const total_amount = subtotal + delivery_fee - discount_amount;

    const order = await Order.create(
      {
        customer_name: (customer_name || "Walk-in Guest").trim().slice(0, 100),
        user_id: user_id || null,
        total_amount,
        discount_amount,
        delivery_fee,
        status: "pending",
        order_type,
        promo_code: appliedPromoCode,
        notes: notes ? String(notes).trim().slice(0, 500) : null,
      },
      { transaction: t }
    );

    await OrderItem.bulkCreate(
      validatedItems.map((i) => ({ ...i, order_id: order.id })),
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: { id: order.id, total_amount, discount_amount, delivery_fee },
    });
  } catch (error) {
    await t.rollback().catch(() => {});
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const affected = await Order.updateById(id, { status });
    if (!affected) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = Number(req.params.id);
    // Delete items first to avoid FK orphans
    await OrderItem.destroy({ where: { order_id: id }, transaction: t });
    const affected = await Order.destroy({ where: { id }, transaction: t });
    if (!affected) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    await t.commit();
    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    await t.rollback().catch(() => {});
    next(error);
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder };

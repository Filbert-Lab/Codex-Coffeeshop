const Promo = require("../models/Promo");
const { Op } = require("sequelize");

const normalizeExpiry = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const getPromos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    const where = active !== undefined ? { is_active: active === "true" } : {};
    const result = await Promo.findPaginated({
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

const getActivePromos = async (req, res, next) => {
  try {
    const promos = await Promo.findAll({
      where: {
        is_active: true,
        [Op.or]: [
          { expires_at: null },
          { expires_at: { [Op.gt]: new Date() } },
        ],
      },
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: promos });
  } catch (error) {
    next(error);
  }
};

const validatePromo = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const promo = await Promo.findByCode(code);
    if (!promo)
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found or inactive" });
    if (subtotal < promo.min_order)
      return res
        .status(400)
        .json({
          success: false,
          message: `Minimum order Rp ${promo.min_order} required`,
        });
    const discount = promo.calculateDiscount(subtotal);
    res.json({ success: true, data: { promo, discount } });
  } catch (error) {
    next(error);
  }
};

const createPromo = async (req, res, next) => {
  try {
    const {
      code,
      description,
      type,
      value,
      max_discount,
      min_order,
      is_active,
      expires_at,
    } = req.body;
    if (!code || !type || !value)
      return res
        .status(400)
        .json({ success: false, message: "Code, type, value required" });
    const expiry = normalizeExpiry(expires_at);
    if (expiry === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Invalid expiration date" });
    const promo = await Promo.createRecord({
      code: code.toUpperCase(),
      description,
      type,
      value,
      max_discount,
      min_order,
      is_active,
      expires_at: expiry,
    });
    res
      .status(201)
      .json({ success: true, message: "Promo created", data: promo });
  } catch (error) {
    next(error);
  }
};

const updatePromo = async (req, res, next) => {
  try {
    const {
      code,
      description,
      type,
      value,
      max_discount,
      min_order,
      is_active,
      expires_at,
    } = req.body;
    const expiry = normalizeExpiry(expires_at);
    if (expiry === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Invalid expiration date" });
    const data = {
      description,
      type,
      value,
      max_discount,
      min_order,
      is_active,
      expires_at: expiry,
    };
    if (code) data.code = code.toUpperCase();
    const affected = await Promo.updateById(req.params.id, data);
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "Promo not found" });
    res.json({ success: true, message: "Promo updated" });
  } catch (error) {
    next(error);
  }
};

const deletePromo = async (req, res, next) => {
  try {
    const affected = await Promo.deleteById(req.params.id);
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "Promo not found" });
    res.json({ success: true, message: "Promo deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPromos,
  getActivePromos,
  validatePromo,
  createPromo,
  updatePromo,
  deletePromo,
};

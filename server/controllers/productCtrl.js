const Product = require("../models/Product");

const getProducts = async (req, res, next) => {
  try {
    const { search, category_id, page = 1, limit = 12 } = req.query;
    const result = await Product.findWithCategory({ search, categoryId: category_id, page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const Category = require("../models/Category");
    const product = await Product.findOne({
      where: { id: req.params.id },
      include: [{ model: Category, as: "category" }],
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, category_id, description, price, image, stock, is_available } = req.body;
    if (!name || !price) return res.status(400).json({ success: false, message: "Name and price required" });
    const product = await Product.createRecord({ name, category_id, description, price, image, stock, is_available });
    res.status(201).json({ success: true, message: "Product created", data: product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, category_id, description, price, image, stock, is_available } = req.body;
    const affected = await Product.updateById(req.params.id, { name, category_id, description, price, image, stock, is_available });
    if (!affected) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product updated" });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const affected = await Product.deleteById(req.params.id);
    if (!affected) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

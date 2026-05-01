const Category = require("../models/Category");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [["id", "ASC"]] });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    const category = await Category.createRecord({ name, description, icon });
    res.status(201).json({ success: true, message: "Category created", data: category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    const affected = await Category.updateById(req.params.id, { name, description, icon });
    if (!affected) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category updated" });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const affected = await Category.deleteById(req.params.id);
    if (!affected) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

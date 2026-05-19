const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryCtrl");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { validateIdParam } = require("../middleware/validate");

router.get("/", getCategories);
router.post("/", authMiddleware, adminMiddleware, createCategory);
router.put("/:id", validateIdParam, authMiddleware, adminMiddleware, updateCategory);
router.delete("/:id", validateIdParam, authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;

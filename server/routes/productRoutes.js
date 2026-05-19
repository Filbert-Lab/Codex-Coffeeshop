const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productCtrl");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { validateIdParam } = require("../middleware/validate");

router.get("/", getProducts);
router.get("/:id", validateIdParam, getProductById);
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", validateIdParam, authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", validateIdParam, authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;

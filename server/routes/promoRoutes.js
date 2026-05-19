const express = require("express");
const router = express.Router();
const {
  getPromos,
  getActivePromos,
  validatePromo,
  createPromo,
  updatePromo,
  deletePromo,
} = require("../controllers/promoCtrl");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { validateIdParam } = require("../middleware/validate");

router.get("/active", getActivePromos);
router.post("/validate", validatePromo);
router.get("/", authMiddleware, adminMiddleware, getPromos);
router.post("/", authMiddleware, adminMiddleware, createPromo);
router.put("/:id", validateIdParam, authMiddleware, adminMiddleware, updatePromo);
router.delete("/:id", validateIdParam, authMiddleware, adminMiddleware, deletePromo);

module.exports = router;

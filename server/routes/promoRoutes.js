const express = require("express");
const router = express.Router();
const { getPromos, getActivePromos, validatePromo, createPromo, updatePromo, deletePromo } = require("../controllers/promoCtrl");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/active", getActivePromos);
router.post("/validate", validatePromo);
router.get("/", authMiddleware, adminMiddleware, getPromos);
router.post("/", authMiddleware, adminMiddleware, createPromo);
router.put("/:id", authMiddleware, adminMiddleware, updatePromo);
router.delete("/:id", authMiddleware, adminMiddleware, deletePromo);

module.exports = router;

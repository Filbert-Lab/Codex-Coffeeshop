const express = require("express");
const router = express.Router();
const { login, register, getUsers, updateUser, deleteUser } = require("../controllers/userCtrl");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { validateIdParam } = require("../middleware/validate");

router.post("/login", login);
router.post("/register", register);
router.get("/", authMiddleware, adminMiddleware, getUsers);
router.put("/:id", validateIdParam, authMiddleware, adminMiddleware, updateUser);
router.delete("/:id", validateIdParam, authMiddleware, adminMiddleware, deleteUser);

module.exports = router;

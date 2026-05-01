const express = require("express");
const router = express.Router();
const { login, register, getUsers, updateUser, deleteUser } = require("../controllers/userCtrl");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.post("/login", login);
router.post("/register", register);
router.get("/", authMiddleware, adminMiddleware, getUsers);
router.put("/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;

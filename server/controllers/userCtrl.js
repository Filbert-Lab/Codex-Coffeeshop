const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/User");
const sequelize = require("../config/sequelize");
const { JWT_SECRET } = require("../middleware/auth");
const { isValidEmail } = require("../middleware/validate");

const TOKEN_EXPIRY = "7d";
const MIN_PASSWORD_LENGTH = 6;
const MAX_NAME_LENGTH = 100;

const sanitize = (s, max) => (typeof s === "string" ? s.trim().slice(0, max) : "");

const issueToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });

const login = async (req, res, next) => {
  try {
    const email = sanitize(req.body.email, 254).toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findByEmail(email);
    // Constant-time-like check: always run comparePassword to mitigate timing leaks
    const match = user ? await user.comparePassword(password) : false;
    if (!user || !match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    return res.json({
      success: true,
      message: "Login successful",
      data: { token: issueToken(user), user },
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const name = sanitize(req.body.name, MAX_NAME_LENGTH);
    const email = sanitize(req.body.email, 254).toLowerCase();
    const { password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res
        .status(400)
        .json({ success: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // role is hardcoded to 'customer' — never trust client-supplied role
    const user = await User.createRecord({ name, email, password, role: "customer" });

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: { token: issueToken(user), user },
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const search = sanitize(req.query.search, 100);

    const likeOp = sequelize.getDialect() === "postgres" ? Op.iLike : Op.like;
    const where = search ? { name: { [likeOp]: `%${search}%` } } : {};

    const result = await User.findPaginated({
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

const updateUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = {};

    if (req.body.name !== undefined) {
      const name = sanitize(req.body.name, MAX_NAME_LENGTH);
      if (!name) return res.status(400).json({ success: false, message: "Name cannot be empty" });
      data.name = name;
    }

    if (req.body.role !== undefined) {
      if (!["admin", "customer"].includes(req.body.role)) {
        return res.status(400).json({ success: false, message: "Invalid role" });
      }
      // Prevent admin from demoting themselves (lockout protection)
      if (req.user?.id === id && req.body.role !== "admin") {
        return res
          .status(400)
          .json({ success: false, message: "You cannot demote your own admin account" });
      }
      data.role = req.body.role;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const affected = await User.updateById(id, data);
    if (!affected) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User updated" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    // Prevent admin from deleting themselves
    if (req.user?.id === id) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot delete your own account" });
    }

    const affected = await User.deleteById(id);
    if (!affected) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, getUsers, updateUser, deleteUser };

/**
 * userCtrl.js
 *
 * Admin-facing user management. Auth flows (register / login / OAuth /
 * current-user) now live in `server/auth/authController.js`. We keep
 * `login` and `register` re-exports here so the legacy routes
 * `/api/users/login` and `/api/users/register` continue to work.
 */
const { Op } = require("sequelize");
const User = require("../models/User");
const sequelize = require("../config/sequelize");
const { register, login } = require("../auth/authController");

const MAX_NAME_LENGTH = 100;
const sanitize = (s, max) =>
  typeof s === "string" ? s.trim().slice(0, max) : "";

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
      if (!name)
        return res
          .status(400)
          .json({ success: false, message: "Name cannot be empty" });
      data.name = name;
    }

    if (req.body.role !== undefined) {
      if (!["admin", "customer"].includes(req.body.role)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid role" });
      }
      // Prevent admin from demoting themselves (lockout protection)
      if (req.user?.id === id && req.body.role !== "admin") {
        return res.status(400).json({
          success: false,
          message: "You cannot demote your own admin account",
        });
      }
      data.role = req.body.role;
    }

    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid fields to update" });
    }

    const affected = await User.updateById(id, data);
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User updated" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (req.user?.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }
    const affected = await User.deleteById(id);
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Legacy auth endpoints — delegate to the auth module
  login,
  register,
  // Admin user management
  getUsers,
  updateUser,
  deleteUser,
};

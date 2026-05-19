const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findByEmail(email);
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, message: "Login successful", data: { token, user } });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existing = await User.findByEmail(email);
    if (existing)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.createRecord({ name, email, password, role: "customer" });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ success: true, message: "Registered successfully", data: { token, user } });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const { Op } = require("sequelize");
    const sequelizeInstance = require("../config/sequelize");
    const likeOp = sequelizeInstance.getDialect() === "postgres" ? Op.iLike : Op.like;
    const where = search ? { name: { [likeOp]: `%${search}%` } } : {};
    const result = await User.findPaginated({ where, page, limit, order: [["created_at", "DESC"]] });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, role } = req.body;
    const affected = await User.updateById(req.params.id, { name, role });
    if (!affected) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User updated" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const affected = await User.deleteById(req.params.id);
    if (!affected) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, getUsers, updateUser, deleteUser };

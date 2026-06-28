// models/index.js — defines all Sequelize associations
const sequelize = require("../config/sequelize");
const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Promo = require("./Promo");
const CallSession = require("./CallSession");

// Category ↔ Product
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// OrderItem ↔ Product
Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// User ↔ Order
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

// User ↔ CallSession (WebRTC video support calls)
User.hasMany(CallSession, { foreignKey: "caller_id", as: "calls" });
CallSession.belongsTo(User, { foreignKey: "caller_id", as: "caller" });

module.exports = { sequelize, User, Category, Product, Order, OrderItem, Promo, CallSession };

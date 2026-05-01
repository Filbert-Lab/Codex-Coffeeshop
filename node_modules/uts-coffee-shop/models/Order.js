const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const BaseModel = require("./BaseModel");

class Order extends BaseModel {
  static async findWithItems(id) {
    const OrderItem = require("./OrderItem");
    const Product = require("./Product");
    return this.findOne({
      where: { id },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product", attributes: ["id", "name", "image"] }],
        },
      ],
    });
  }
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    customer_name: { type: DataTypes.STRING(100), defaultValue: "Walk-in Guest" },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    discount_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    delivery_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    status: {
      type: DataTypes.ENUM("pending", "processing", "completed", "cancelled"),
      defaultValue: "pending",
    },
    order_type: { type: DataTypes.ENUM("pickup", "delivery"), defaultValue: "pickup" },
    promo_code: { type: DataTypes.STRING(50), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Order;

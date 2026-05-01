const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const BaseModel = require("./BaseModel");

class Promo extends BaseModel {
  static async findByCode(code) {
    return this.findOne({ where: { code: code.toUpperCase(), is_active: true } });
  }

  calculateDiscount(subtotal) {
    let discount = 0;
    if (this.type === "percent") {
      discount = subtotal * (this.value / 100);
      if (this.max_discount) discount = Math.min(discount, this.max_discount);
    } else if (this.type === "fixed") {
      discount = this.value;
    }
    return Math.min(discount, subtotal);
  }
}

Promo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(255), allowNull: false },
    type: { type: DataTypes.ENUM("percent", "fixed"), allowNull: false },
    value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    max_discount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    min_order: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: "Promo",
    tableName: "promos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Promo;

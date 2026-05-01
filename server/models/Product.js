const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/sequelize");
const BaseModel = require("./BaseModel");

class Product extends BaseModel {
  static async findWithCategory({ search, categoryId, page = 1, limit = 12 } = {}) {
    const Category = require("./Category");
    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (categoryId) where.category_id = categoryId;

    return this.findPaginated({
      where,
      page,
      limit,
      include: [{ model: Category, as: "category", attributes: ["id", "name", "icon"] }],
      order: [["id", "DESC"]],
    });
  }
}

Product.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    category_id: { type: DataTypes.INTEGER, allowNull: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: "" },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    image: { type: DataTypes.TEXT, defaultValue: "" },
    stock: { type: DataTypes.INTEGER, defaultValue: 99 },
    is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Product;

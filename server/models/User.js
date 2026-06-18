const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const BaseModel = require("./BaseModel");
const bcrypt = require("bcryptjs");

class User extends BaseModel {
  static async findByEmail(email) {
    return this.findOne({ where: { email } });
  }

  static async findByProvider(provider, providerId) {
    return this.findOne({
      where: { provider, provider_id: String(providerId) },
    });
  }

  /** Safe-compare; returns false for OAuth-only users (no password set). */
  async comparePassword(plainPassword) {
    if (!this.password) return false;
    return bcrypt.compare(plainPassword, this.password);
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    delete values.provider_id;
    return values;
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    // password is nullable: OAuth-only users won't have one
    password: { type: DataTypes.STRING(255), allowNull: true },
    role: {
      type: DataTypes.ENUM("admin", "customer"),
      defaultValue: "customer",
    },
    // OAuth fields
    provider: {
      type: DataTypes.ENUM("local", "google", "github"),
      allowNull: false,
      defaultValue: "local",
    },
    provider_id: { type: DataTypes.STRING(255), allowNull: true },
    avatar_url: { type: DataTypes.STRING(500), allowNull: true },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      // Composite index for OAuth lookups
      { fields: ["provider", "provider_id"] },
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password") && user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);

module.exports = User;

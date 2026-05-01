const { sequelize } = require("../models/index");
const { QueryTypes } = require("sequelize");

const getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders] = await sequelize.query(
      "SELECT COUNT(*) as count FROM orders", { type: QueryTypes.SELECT }
    );
    const [totalRevenue] = await sequelize.query(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status = 'completed'",
      { type: QueryTypes.SELECT }
    );
    const [totalProducts] = await sequelize.query(
      "SELECT COUNT(*) as count FROM products", { type: QueryTypes.SELECT }
    );
    const [totalUsers] = await sequelize.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'customer'", { type: QueryTypes.SELECT }
    );
    const [pendingOrders] = await sequelize.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'pending'", { type: QueryTypes.SELECT }
    );
    const recentOrders = await sequelize.query(
      "SELECT * FROM orders ORDER BY created_at DESC LIMIT 5", { type: QueryTypes.SELECT }
    );

    res.json({
      success: true,
      data: {
        totalOrders: Number(totalOrders.count),
        totalRevenue: Number(totalRevenue.total),
        totalProducts: Number(totalProducts.count),
        totalUsers: Number(totalUsers.count),
        pendingOrders: Number(pendingOrders.count),
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };

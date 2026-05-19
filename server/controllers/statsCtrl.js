const { sequelize } = require("../models/index");
const { QueryTypes } = require("sequelize");

const getDashboardStats = async (req, res, next) => {
  try {
    const dialect = sequelize.getDialect();
    const isPostgres = dialect === "postgres";

    // Date functions differ between SQLite and PostgreSQL
    const dateFunc = isPostgres ? "CURRENT_DATE" : "DATE('now')";
    const dateCast = (col) => isPostgres ? `DATE(${col})` : `DATE(${col})`;
    const dateInterval7 = isPostgres
      ? `${dateCast("created_at")} >= CURRENT_DATE - INTERVAL '7 days'`
      : `${dateCast("created_at")} >= DATE('now', '-7 days')`;

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

    // Daily revenue for the last 7 days
    const dailyRevenue = await sequelize.query(
      `SELECT ${dateCast("created_at")} as date, 
              COALESCE(SUM(total_amount), 0) as revenue,
              COUNT(*) as orders
       FROM orders 
       WHERE status = 'completed' 
         AND ${dateInterval7}
       GROUP BY ${dateCast("created_at")}
       ORDER BY date ASC`,
      { type: QueryTypes.SELECT }
    );

    // Top selling products (by quantity sold)
    const topProducts = await sequelize.query(
      `SELECT p.name, p.image, SUM(oi.quantity) as total_sold, SUM(oi.subtotal) as total_revenue
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.status = 'completed'
       GROUP BY oi.product_id, p.name, p.image
       ORDER BY total_sold DESC
       LIMIT 5`,
      { type: QueryTypes.SELECT }
    );

    // Order type breakdown
    const orderTypeBreakdown = await sequelize.query(
      `SELECT order_type, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue
       FROM orders
       WHERE status = 'completed'
       GROUP BY order_type`,
      { type: QueryTypes.SELECT }
    );

    // Order status breakdown
    const statusBreakdown = await sequelize.query(
      `SELECT status, COUNT(*) as count
       FROM orders
       GROUP BY status`,
      { type: QueryTypes.SELECT }
    );

    // Today's stats
    const [todayStats] = await sequelize.query(
      `SELECT COUNT(*) as orders, COALESCE(SUM(total_amount), 0) as revenue
       FROM orders
       WHERE ${dateCast("created_at")} = ${dateFunc} AND status != 'cancelled'`,
      { type: QueryTypes.SELECT }
    );

    // Average order value
    const [avgOrder] = await sequelize.query(
      `SELECT COALESCE(AVG(total_amount), 0) as avg_value
       FROM orders WHERE status = 'completed'`,
      { type: QueryTypes.SELECT }
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
        dailyRevenue,
        topProducts,
        orderTypeBreakdown,
        statusBreakdown,
        todayOrders: Number(todayStats.orders),
        todayRevenue: Number(todayStats.revenue),
        avgOrderValue: Number(avgOrder.avg_value),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };

const { sequelize } = require("../models/index");
const { QueryTypes } = require("sequelize");

/**
 * Returns dialect-aware SQL helpers for date functions.
 * Postgres uses CURRENT_DATE / INTERVAL; SQLite uses DATE('now').
 */
const getDialectHelpers = () => {
  const isPg = sequelize.getDialect() === "postgres";
  return {
    todayDate: isPg ? "CURRENT_DATE" : "DATE('now')",
    last7Days: isPg
      ? "DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days'"
      : "DATE(created_at) >= DATE('now', '-7 days')",
  };
};

const q = (sql, opts = {}) => sequelize.query(sql, { type: QueryTypes.SELECT, ...opts });

const getDashboardStats = async (_req, res, next) => {
  try {
    const { todayDate, last7Days } = getDialectHelpers();

    // Run ALL queries in parallel — major perf win vs sequential awaits
    const [
      [totalOrders],
      [totalRevenue],
      [totalProducts],
      [totalUsers],
      [pendingOrders],
      recentOrders,
      dailyRevenue,
      topProducts,
      orderTypeBreakdown,
      statusBreakdown,
      [todayStats],
      [avgOrder],
    ] = await Promise.all([
      q("SELECT COUNT(*) as count FROM orders"),
      q("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status = 'completed'"),
      q("SELECT COUNT(*) as count FROM products"),
      q("SELECT COUNT(*) as count FROM users WHERE role = 'customer'"),
      q("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'"),
      q("SELECT id, customer_name, total_amount, status, order_type, created_at FROM orders ORDER BY created_at DESC LIMIT 5"),
      q(
        `SELECT DATE(created_at) AS date,
                COALESCE(SUM(total_amount), 0) AS revenue,
                COUNT(*) AS orders
         FROM orders
         WHERE status = 'completed' AND ${last7Days}
         GROUP BY DATE(created_at)
         ORDER BY date ASC`
      ),
      q(
        `SELECT p.name, p.image,
                SUM(oi.quantity) AS total_sold,
                SUM(oi.subtotal) AS total_revenue
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         JOIN orders o ON oi.order_id = o.id
         WHERE o.status = 'completed'
         GROUP BY oi.product_id, p.name, p.image
         ORDER BY total_sold DESC
         LIMIT 5`
      ),
      q(
        `SELECT order_type, COUNT(*) AS count, COALESCE(SUM(total_amount), 0) AS revenue
         FROM orders
         WHERE status = 'completed'
         GROUP BY order_type`
      ),
      q("SELECT status, COUNT(*) AS count FROM orders GROUP BY status"),
      q(
        `SELECT COUNT(*) AS orders, COALESCE(SUM(total_amount), 0) AS revenue
         FROM orders
         WHERE DATE(created_at) = ${todayDate} AND status != 'cancelled'`
      ),
      q("SELECT COALESCE(AVG(total_amount), 0) AS avg_value FROM orders WHERE status = 'completed'"),
    ]);

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

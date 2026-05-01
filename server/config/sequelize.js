const { Sequelize } = require("sequelize");

let sequelize;

console.log("🔧 [Sequelize] Checking database configuration...");
console.log("  DATABASE_URL:", process.env.DATABASE_URL ? "✅ set" : "❌ not set");
console.log("  DATABASE_URL_UNPOOLED:", process.env.DATABASE_URL_UNPOOLED ? "✅ set" : "❌ not set");
console.log("  NODE_ENV:", process.env.NODE_ENV);
console.log("  VERCEL:", process.env.VERCEL ? "✅ yes" : "❌ no");

const isVercel = !!process.env.VERCEL;
const isProduction = process.env.NODE_ENV === "production" || isVercel;

try {
  if (process.env.DATABASE_URL_UNPOOLED) {
    console.log("🚀 [Sequelize] Using DATABASE_URL_UNPOOLED (Vercel production)");
    sequelize = new Sequelize(process.env.DATABASE_URL_UNPOOLED, {
      dialect: "postgres",
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      pool: {
        max: 1,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: false,
    });
  } else if (process.env.DATABASE_URL) {
    console.log("🔌 [Sequelize] Using DATABASE_URL (pooled)");
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: false,
    });
  } else if (isProduction || isVercel) {
    throw new Error(
      "DATABASE_URL or DATABASE_URL_UNPOOLED is required in production!",
    );
  } else {
    console.log("💾 [Sequelize] Using SQLite (local development)");
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "./database.sqlite",
      logging: false,
    });
  }
  console.log("✅ [Sequelize] Instance created successfully");
} catch (err) {
  console.error("❌ [Sequelize] Failed to create instance");
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  throw err;
}

module.exports = sequelize;

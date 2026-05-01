const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

console.log("🔧 Checking database configuration...");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ set" : "❌ not set");
console.log("DATABASE_URL_UNPOOLED:", process.env.DATABASE_URL_UNPOOLED ? "✅ set" : "❌ not set");
console.log("NODE_ENV:", process.env.NODE_ENV);

const isVercel = !!process.env.VERCEL;
const isProduction = process.env.NODE_ENV === "production" || isVercel;

if (process.env.DATABASE_URL_UNPOOLED) {
  // Production: Use unpooled connection for Vercel serverless
  console.log("🚀 Using DATABASE_URL_UNPOOLED (Vercel production)");
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
  // Fallback: Use pooled connection
  console.log("🔌 Using DATABASE_URL (pooled)");
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
  // Production without DATABASE_URL - throw error
  throw new Error(
    "❌ DATABASE_URL or DATABASE_URL_UNPOOLED is required in production! Set it in Vercel environment variables."
  );
} else {
  // Local development only: SQLite fallback
  console.log("💾 Using SQLite (local development)");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
  });
}

module.exports = sequelize;

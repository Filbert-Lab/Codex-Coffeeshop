const { Sequelize } = require("sequelize");
const path = require("path");

// Explicitly require database drivers so Vercel's bundler (nft) includes them
require("pg");
require("pg-hstore");

let sequelize;

console.log("🔧 [Sequelize] Checking database configuration...");
console.log(
  "  DATABASE_URL:",
  process.env.DATABASE_URL ? "✅ set" : "❌ not set",
);
console.log(
  "  DATABASE_URL_UNPOOLED:",
  process.env.DATABASE_URL_UNPOOLED ? "✅ set" : "❌ not set",
);
console.log("  NODE_ENV:", process.env.NODE_ENV);
console.log("  VERCEL:", process.env.VERCEL ? "✅ yes" : "❌ no");

const isVercel = !!process.env.VERCEL;
const isProduction = process.env.NODE_ENV === "production" || isVercel;

// Try to use DATABASE_URL_UNPOOLED first, then DATABASE_URL
let dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

// Add libpq compatibility flag if using Neon
if (dbUrl && dbUrl.includes("neon")) {
  // Ensure sslmode is set properly for libpq compatibility
  if (!dbUrl.includes("sslmode")) {
    dbUrl += "?sslmode=require";
  }
  // Add libpq compatibility if not present
  if (!dbUrl.includes("uselibpqcompat")) {
    dbUrl += dbUrl.includes("?") ? "&" : "?";
    dbUrl += "uselibpqcompat=true";
  }
  console.log("🔒 [Sequelize] Configured for Neon with libpq compatibility");
}

try {
  if (dbUrl) {
    const usingUnpooled = !!process.env.DATABASE_URL_UNPOOLED;
    console.log(
      `🚀 [Sequelize] Using ${usingUnpooled ? "DATABASE_URL_UNPOOLED" : "DATABASE_URL"}`,
    );
    console.log("[Sequelize] Connection string set (masked for security)");

    sequelize = new Sequelize(dbUrl, {
      dialect: "postgres",
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      pool: {
        max: usingUnpooled ? 1 : 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: (sql) => {
        // Only log on errors to reduce noise
        if (process.env.DEBUG_SQL) {
          console.log("[Sequelize SQL]", sql);
        }
      },
    });
  } else if (isProduction || isVercel) {
    throw new Error(
      "DATABASE_URL or DATABASE_URL_UNPOOLED is required in production! Check Vercel environment variables.",
    );
  } else {
    console.log("💾 [Sequelize] Using SQLite (local development)");
    const dbPath = path.join(__dirname, "../../database.sqlite");
    console.log("  SQLite path:", dbPath);
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: dbPath,
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

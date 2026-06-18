/**
 * One-time migration: add OAuth columns to the existing `users` table.
 *
 * Why this exists:
 *   The `users` table was created before the OAuth fields were added to the
 *   User model. `sequelize.sync({ alter: false })` never adds new columns to
 *   existing tables, so `provider`, `provider_id`, and `avatar_url` were
 *   missing in Neon. Any sync that tried to build the composite index on
 *   `provider` failed with: column "provider" does not exist — which cascaded
 *   into a "Database unavailable" 500 on every endpoint.
 *
 * This script is idempotent: safe to run multiple times.
 *
 * Run with:  node server/config/migrateOAuthColumns.js
 */
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config();

const sequelize = require("./sequelize");

const SQL = `
DO $$
BEGIN
  CREATE TYPE "enum_users_provider" AS ENUM ('local', 'google', 'github');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "provider" "enum_users_provider" NOT NULL DEFAULT 'local';

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "provider_id" VARCHAR(255);

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "avatar_url" VARCHAR(500);

-- OAuth-only users have no password. The table was created with a NOT NULL
-- constraint before the model made password nullable, so relax it here.
ALTER TABLE "users"
  ALTER COLUMN "password" DROP NOT NULL;

CREATE INDEX IF NOT EXISTS "users_provider_provider_id"
  ON "users" ("provider", "provider_id");

`;

(async () => {
  try {
    console.log("🔧 [migrate] Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ [migrate] Connected. Adding OAuth columns to users...");

    await sequelize.query(SQL);

    console.log(
      "✅ [migrate] OAuth columns ensured (provider, provider_id, avatar_url).",
    );
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ [migrate] Migration failed:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();

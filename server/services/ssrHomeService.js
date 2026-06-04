const Product = require("../models/Product");
const Category = require("../models/Category");

const HOME_CACHE_TTL_MS = Number(process.env.SSR_HOME_CACHE_TTL_MS) || 30_000;
let homeCache = null;

function toPlain(record) {
  if (!record) return record;
  if (typeof record.get === "function") return record.get({ plain: true });
  return record;
}

async function getHomeSnapshot() {
  const now = Date.now();
  if (homeCache && homeCache.expiresAt > now) return homeCache.data;

  const [categories, productsResult] = await Promise.all([
    Category.findAll({ order: [["id", "ASC"]] }),
    Product.findWithCategory({ page: 1, limit: 24 }),
  ]);

  const data = {
    categories: categories.map(toPlain),
    products: (productsResult.data || []).map(toPlain),
  };

  homeCache = {
    data,
    expiresAt: now + HOME_CACHE_TTL_MS,
  };

  return data;
}

function clearHomeSnapshotCache() {
  homeCache = null;
}

module.exports = {
  clearHomeSnapshotCache,
  getHomeSnapshot,
};

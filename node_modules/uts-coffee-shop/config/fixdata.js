// Fix category_id assignments in database
require("dotenv").config();
const { sequelize } = require("../models/index");

async function fix() {
  const updates = [
    `UPDATE products SET category_id=1 WHERE name IN ('Signature Latte','Cappuccino','Americano','Caramel Macchiato','Flat White','Café Mocha')`,
    `UPDATE products SET category_id=2 WHERE name IN ('Matcha Latte','Lychee Tea','Hot Chocolate','Red Velvet Latte')`,
    `UPDATE products SET category_id=3 WHERE name IN ('Butter Croissant','Chocolate Muffin','Cinnamon Roll','Cheese Tart')`,
    `UPDATE products SET category_id=4 WHERE name IN ('Lavender Honey Latte')`,
  ];
  for (const sql of updates) {
    const [, meta] = await sequelize.query(sql);
    console.log("Updated:", meta?.changes ?? "done");
  }
  const products = await sequelize.query("SELECT id, name, category_id FROM products", { type: "SELECT" });
  console.log("Products:", JSON.stringify(products));
  process.exit(0);
}

fix().catch((e) => { console.error(e); process.exit(1); });

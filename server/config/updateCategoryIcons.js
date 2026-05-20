/**
 * Updates category icons without reseeding or deleting existing data.
 * Run: node server/config/updateCategoryIcons.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const { sequelize, Category } = require("../models/index");

const iconByName = {
  "Espresso Based": "espresso-bean",
  "Non-Coffee": "iced-drink",
  Pastries: "croissant",
  "Seasonal Special": "honey-spark",
};

async function updateCategoryIcons() {
  try {
    await sequelize.authenticate();

    for (const [name, icon] of Object.entries(iconByName)) {
      const [count] = await Category.update({ icon }, { where: { name } });
      console.log(`${count ? "Updated" : "Skipped"}: ${name} -> ${icon}`);
    }

    const categories = await Category.findAll({
      attributes: ["id", "name", "icon"],
      order: [["id", "ASC"]],
    });
    console.table(categories.map((category) => category.get({ plain: true })));
    process.exit(0);
  } catch (err) {
    console.error("Failed to update category icons:", err);
    process.exit(1);
  }
}

updateCategoryIcons();

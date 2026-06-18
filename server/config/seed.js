/**
 * seed.js — Seeds the database with initial data.
 * Run: node server/config/seed.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const {
  sequelize,
  User,
  Category,
  Product,
  Promo,
} = require("../models/index");

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log("✅ Tables created");

    // Users
    await User.bulkCreate(
      [
        {
          name: "Admin Codex",
          email: "admin@codex.com",
          password: "admin123",
          role: "admin",
        },
        {
          name: "Customer Test",
          email: "user@codex.com",
          password: "user123",
          role: "customer",
        },
      ],
      { individualHooks: true },
    ); // individualHooks ensures bcrypt hooks run
    console.log("✅ Users seeded (passwords are hashed)");

    // Categories — use create() individually so IDs are reliably captured
    const espresso = await Category.create({
      name: "Espresso Based",
      description: "Coffee drinks made with espresso shots",
      icon: "espresso-bean",
    });
    const nonCoffee = await Category.create({
      name: "Non-Coffee",
      description: "Tea, matcha, and fruit-based beverages",
      icon: "iced-drink",
    });
    const pastries = await Category.create({
      name: "Pastries",
      description: "Fresh baked goods and snacks",
      icon: "croissant",
    });
    const seasonal = await Category.create({
      name: "Seasonal Special",
      description: "Limited time seasonal offerings",
      icon: "honey-spark",
    });
    console.log("✅ Categories seeded", {
      espresso: espresso.id,
      nonCoffee: nonCoffee.id,
      pastries: pastries.id,
      seasonal: seasonal.id,
    });

    // Products
    await Product.bulkCreate([
      // Espresso Based
      {
        category_id: espresso.id,
        name: "Signature Latte",
        description: "Our signature creamy latte with a velvety texture",
        price: 28000,
        image:
          "https://images.unsplash.com/photo-1541167760496-9af0ab7f0da7?w=400&h=400&fit=crop",
        stock: 99,
      },
      {
        category_id: espresso.id,
        name: "Cappuccino",
        description: "Classic Italian cappuccino with thick microfoam",
        price: 30000,
        image:
          "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
        stock: 99,
      },
      {
        category_id: espresso.id,
        name: "Americano",
        description: "Bold and clean espresso diluted with hot water",
        price: 22000,
        image:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop",
        stock: 99,
      },
      {
        category_id: espresso.id,
        name: "Caramel Macchiato",
        description: "Sweet espresso with caramel drizzle and steamed milk",
        price: 32000,
        image:
          "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop",
        stock: 99,
      },
      {
        category_id: espresso.id,
        name: "Flat White",
        description: "Velvety microfoam over a double ristretto",
        price: 28000,
        image:
          "https://images.unsplash.com/photo-1611564494260-6f21b80af7ea?w=400&h=400&fit=crop",
        stock: 99,
      },
      {
        category_id: espresso.id,
        name: "Café Mocha",
        description: "Rich chocolate meets premium espresso",
        price: 33000,
        image:
          "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=400&fit=crop",
        stock: 99,
      },
      // Non-Coffee
      {
        category_id: nonCoffee.id,
        name: "Matcha Latte",
        description: "Premium Uji matcha with creamy steamed milk",
        price: 35000,
        image:
          "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=400&fit=crop",
        stock: 99,
      },
      {
        category_id: nonCoffee.id,
        name: "Lychee Tea",
        description: "Refreshing lychee flavored tea with fruit bits",
        price: 22000,
        image:
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
        stock: 99,
      },
      {
        category_id: nonCoffee.id,
        name: "Hot Chocolate",
        description: "Rich and creamy Belgian dark chocolate",
        price: 25000,
        image:
          "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop",
        stock: 99,
      },
      {
        category_id: nonCoffee.id,
        name: "Red Velvet Latte",
        description: "Vibrant red velvet flavored steamed milk",
        price: 29000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
        stock: 99,
      },
      // Pastries
      {
        category_id: pastries.id,
        name: "Butter Croissant",
        description: "Flaky, buttery layers baked to golden perfection",
        price: 18000,
        image:
          "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop",
        stock: 50,
      },
      {
        category_id: pastries.id,
        name: "Chocolate Muffin",
        description: "Double chocolate chip muffin, moist and decadent",
        price: 20000,
        image:
          "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop",
        stock: 50,
      },
      {
        category_id: pastries.id,
        name: "Cinnamon Roll",
        description: "Soft, gooey cinnamon roll with cream cheese glaze",
        price: 22000,
        image:
          "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=400&fit=crop",
        stock: 30,
      },
      {
        category_id: pastries.id,
        name: "Cheese Tart",
        description: "Silky smooth cheese custard in a buttery crust",
        price: 24000,
        image:
          "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=400&fit=crop",
        stock: 30,
      },
      // Seasonal
      {
        category_id: seasonal.id,
        name: "Lavender Honey Latte",
        description: "Floral lavender with local honey and oat milk",
        price: 38000,
        image:
          "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=400&fit=crop",
        stock: 20,
      },
    ]);
    console.log("✅ Products seeded");

    // Promos
    await Promo.bulkCreate([
      {
        code: "CODEX20",
        description: "20% Off (Max Rp 15.000)",
        type: "percent",
        value: 20,
        max_discount: 15000,
        min_order: 0,
        is_active: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        code: "HEMAT10K",
        description: "Flat discount Rp 10.000",
        type: "fixed",
        value: 10000,
        max_discount: null,
        min_order: 30000,
        is_active: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        code: "NEWMEMBER",
        description: "30% off for new members (Max Rp 20.000)",
        type: "percent",
        value: 30,
        max_discount: 20000,
        min_order: 0,
        is_active: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log("✅ Promos seeded");

    console.log("\n🎉 Database seeded successfully!");
    console.log("📧 Admin login: admin@codex.com / admin123");
    console.log("📧 User login:  user@codex.com  / user123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();

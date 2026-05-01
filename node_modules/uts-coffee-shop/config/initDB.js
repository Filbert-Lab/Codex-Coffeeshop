const mysql = require("mysql2/promise");

const initDB = async () => {
  try {
    // Create connection without selecting the database yet
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
    });

    console.log("Connected to MySQL server.");

    // Create Database
    await connection.query("CREATE DATABASE IF NOT EXISTS coffee_shop_db");
    console.log("Database checked/created.");

    // Use the Database
    await connection.query("USE coffee_shop_db");

    // Drop existing tables for fresh seed (optional but good for a deterministic state)
    await connection.query("DROP TABLE IF EXISTS order_items");
    await connection.query("DROP TABLE IF EXISTS orders");
    await connection.query("DROP TABLE IF EXISTS products");
    await connection.query("DROP TABLE IF EXISTS categories");
    await connection.query("DROP TABLE IF EXISTS users");

    // Create tables
    const createUsersTable = `
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'customer') DEFAULT 'customer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

    const createCategoriesTable = `
            CREATE TABLE categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

    const createProductsTable = `
            CREATE TABLE products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `;

    const createOrdersTable = `
            CREATE TABLE orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(100),
                total_amount DECIMAL(10, 2) NOT NULL,
                status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

    const createOrderItemsTable = `
            CREATE TABLE order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                product_id INT,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `;

    await connection.query(createUsersTable);
    await connection.query(createCategoriesTable);
    await connection.query(createProductsTable);
    await connection.query(createOrdersTable);
    await connection.query(createOrderItemsTable);

    console.log("5 Resource Tables created successfully.");

    // Seeds
    // Users
    await connection.query(`INSERT INTO users (name, email, password, role) VALUES 
            ('Admin', 'admin@mail.com', 'admin123', 'admin'),
            ('Customer', 'user@mail.com', 'user123', 'customer')
        `);

    // Categories
    await connection.query(`INSERT INTO categories (id, name) VALUES 
            (1, 'Espresso Based'),
            (2, 'Non-Coffee'),
            (3, 'Pastries')
        `);

    // Products
    await connection.query(`INSERT INTO products (category_id, name, description, price, image) VALUES 
            (1, 'Signature Latte', 'Delicious creamy latte', 28000, 'https://images.unsplash.com/photo-1541167760496-1628856ab772'),
            (1, 'Cappuccino', 'Classic Italian cappuccino', 30000, 'https://images.unsplash.com/photo-1534778101976-62847782c213'),
            (1, 'Americano', 'Strong bold coffee', 22000, 'https://images.unsplash.com/photo-1551030173-122aabc4489c'),
            (1, 'Caramel Macchiato', 'Sweet espresso drink', 32000, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2'),
            (2, 'Matcha Green Tea', 'Premium Uji Matcha', 35000, 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002'),
            (3, 'Chocolate Croissant', 'Flaky chocolate filling', 25000, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a')
        `);

    console.log("Dummy Data / Seed inserted successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Error in Database Initialization:", error);
    process.exit(1);
  }
};

initDB();

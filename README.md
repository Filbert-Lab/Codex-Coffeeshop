# ☕ Codex Coffee Shop

> Aplikasi web coffee shop full-stack berbasis Node.js + Express + Sequelize + React  
> Tema: **Point-of-Sale (POS) Coffee Shop** — Sistem pemesanan kopi dan makanan lengkap dengan manajemen admin.

---

## 👥 Tim Pengembang

**Nama Tim: Codex**

| NIM | Nama Lengkap |
|---|---|
| 241112498 | Nachelle Ferari |
| 241110460 | Filbert Matthew |
| 241112002 | Ryu Kierando |
| 241110371 | Zakky Pratama |

---

## 🎥 Video Demo

🔗 **[Link Video Demo Aplikasi]** *(masukkan link Google Drive / YouTube di sini)*

> Video demo berdurasi maksimal 15 menit, menjelaskan seluruh fitur aplikasi.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Runtime | Node.js v18+ |
| Framework | Express.js v4 |
| ORM | Sequelize v6 |
| Database | SQLite (dev) / PostgreSQL via Neon (prod) |
| Frontend | React 18, React Router v6, Vite 5 |
| Styling | Tailwind CSS v3 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Deployment | Vercel (frontend static + backend serverless) |

---

## 📁 Struktur Proyek

```
codex-coffee-shop/
├── api/                        # Vercel serverless entry point
│   └── index.js
├── client/                     # Frontend React (Vite)
│   ├── src/
│   │   ├── api/                # Centralized fetch API helpers
│   │   │   └── index.js
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── CartPreview.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   └── PaymentModal.jsx
│   │   ├── context/            # React Context (AuthContext)
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Halaman utama customer
│   │   │   └── admin/          # Admin panel pages
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Products.jsx
│   │   │       ├── Categories.jsx
│   │   │       ├── Orders.jsx
│   │   │       ├── Users.jsx
│   │   │       └── Promos.jsx
│   │   ├── App.jsx             # Routes & protected admin
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles & design system
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Backend Node.js
│   ├── config/
│   │   ├── sequelize.js        # DB connection (SQLite / PostgreSQL)
│   │   ├── seed.js             # Database seeder
│   │   ├── initDB.js           # DB initialization
│   │   └── db.js               # DB helper
│   ├── controllers/            # Business logic per resource
│   │   ├── userCtrl.js
│   │   ├── categoryCtrl.js
│   │   ├── productCtrl.js
│   │   ├── orderCtrl.js
│   │   ├── promoCtrl.js
│   │   └── statsCtrl.js
│   ├── middleware/
│   │   └── auth.js             # JWT auth + admin middleware
│   ├── models/                 # Sequelize models (OOP inheritance)
│   │   ├── BaseModel.js        # Parent class dengan CRUD methods
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Promo.js
│   │   └── index.js            # Model associations
│   ├── routes/                 # Express route definitions
│   │   ├── userRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── promoRoutes.js
│   │   └── statsRoutes.js
│   ├── server.js               # Server entry point
│   └── .env                    # Environment variables (not committed)
├── .env.example                # Template environment variables
├── vercel.json                 # Vercel deployment config
├── package.json
└── Tim.txt
```

---

## 🗄️ Resource Database (6 Resource)

Aplikasi ini memiliki **6 tabel/resource** database relasional:

| # | Resource | Tabel | Deskripsi | CRUD |
|---|---|---|---|---|
| 1 | **Users** | `users` | Manajemen user dengan role admin/customer | ✅ C-R-U-D |
| 2 | **Categories** | `categories` | Kategori menu (Espresso, Non-Coffee, Pastries, Seasonal) | ✅ C-R-U-D |
| 3 | **Products** | `products` | Menu kopi dan makanan dengan harga, stok, gambar | ✅ C-R-U-D |
| 4 | **Orders** | `orders` | Pesanan customer dengan status tracking | ✅ C-R-U-D |
| 5 | **OrderItems** | `order_items` | Detail item per pesanan (relasi Order ↔ Product) | ✅ C-R |
| 6 | **Promos** | `promos` | Kode promo diskon (percent/fixed) | ✅ C-R-U-D |

### Relasi Antar Tabel

```
User ──────< Order ──────< OrderItem >────── Product >────── Category
                                                  
Promo (standalone, divalidasi saat checkout)
```

- `Category` 1:N `Product` (setiap produk punya satu kategori)
- `User` 1:N `Order` (setiap user bisa punya banyak order)
- `Order` 1:N `OrderItem` (setiap order punya banyak item)
- `OrderItem` N:1 `Product` (setiap item merujuk ke satu produk)

---

## 🚀 Panduan Setup (Cara Menjalankan Lokal)

### Prerequisites
- **Node.js** v18 atau lebih baru
- **npm** (sudah termasuk dalam Node.js)

### Langkah-langkah

```bash
# 1. Clone atau extract project
cd codex-coffee-shop

# 2. Install dependencies (root — includes server + client deps)
npm install

# 3. Install client dependencies
cd client && npm install && cd ..

# 4. Seed database (SQLite otomatis dibuat)
npm run db:seed

# 5. Jalankan server + client bersamaan
npm run dev

# Atau jalankan terpisah:
# Terminal 1 (Backend):
npm run dev:server
# Terminal 2 (Frontend):
npm run dev:client
```

### Akses Aplikasi

| Halaman | URL |
|---|---|
| **Customer (Menu)** | http://localhost:5173 |
| **Admin Panel** | http://localhost:5173/admin |
| **API Backend** | http://localhost:5000/api |
| **Health Check** | http://localhost:5000/api/health |

### 🔐 Akun Default untuk Pengujian

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@codex.com` | `admin123` |
| **Customer** | `user@codex.com` | `user123` |

> Login sebagai **Admin** untuk mengakses halaman `/admin` (Dashboard, CRUD Products, Categories, Orders, Users, Promos).

---

## 📡 API Endpoints

### Auth (`/api/users`)
| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| `POST` | `/api/users/login` | Login user, return JWT token | ❌ |
| `POST` | `/api/users/register` | Registrasi user baru | ❌ |
| `GET` | `/api/users` | List semua user (search, pagination) | 🔒 Admin |
| `PUT` | `/api/users/:id` | Update user (name, role) | 🔒 Admin |
| `DELETE` | `/api/users/:id` | Hapus user | 🔒 Admin |

### Products (`/api/products`)
| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| `GET` | `/api/products?search=&category_id=&page=&limit=` | List produk (filter, search, pagination) | ❌ |
| `GET` | `/api/products/:id` | Detail satu produk | ❌ |
| `POST` | `/api/products` | Tambah produk baru | 🔒 Admin |
| `PUT` | `/api/products/:id` | Update produk | 🔒 Admin |
| `DELETE` | `/api/products/:id` | Hapus produk | 🔒 Admin |

### Categories (`/api/categories`)
| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| `GET` | `/api/categories` | List semua kategori | ❌ |
| `POST` | `/api/categories` | Tambah kategori baru | 🔒 Admin |
| `PUT` | `/api/categories/:id` | Update kategori | 🔒 Admin |
| `DELETE` | `/api/categories/:id` | Hapus kategori | 🔒 Admin |

### Orders (`/api/orders`)
| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| `POST` | `/api/orders` | Buat pesanan baru (checkout) | ❌ |
| `GET` | `/api/orders?status=&page=&limit=` | List pesanan (filter status, pagination) | 🔒 Admin |
| `GET` | `/api/orders/:id` | Detail pesanan + items | ❌ |
| `PATCH` | `/api/orders/:id/status` | Update status order | 🔒 Admin |
| `DELETE` | `/api/orders/:id` | Hapus pesanan | 🔒 Admin |

### Promos (`/api/promos`)
| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| `GET` | `/api/promos/active` | List promo aktif (public) | ❌ |
| `POST` | `/api/promos/validate` | Validasi kode promo + hitung diskon | ❌ |
| `GET` | `/api/promos?page=&limit=` | List semua promo (pagination) | 🔒 Admin |
| `POST` | `/api/promos` | Tambah promo baru | 🔒 Admin |
| `PUT` | `/api/promos/:id` | Update promo | 🔒 Admin |
| `DELETE` | `/api/promos/:id` | Hapus promo | 🔒 Admin |

### Stats (`/api/stats`)
| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| `GET` | `/api/stats` | Dashboard statistik (orders, revenue, products, users) | 🔒 Admin |

---

## 📋 Contoh Request/Response & Skema Error

### ✅ Format Response Sukses (200/201)

Semua response sukses menggunakan format JSON yang konsisten:

```json
{
  "success": true,
  "message": "Deskripsi sukses (opsional)",
  "data": { }
}
```

### Contoh: POST `/api/users/login`

**Request:**
```json
{
  "email": "admin@codex.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "Admin Codex",
      "email": "admin@codex.com",
      "role": "admin",
      "created_at": "2026-05-01T..."
    }
  }
}
```

### Contoh: GET `/api/products?search=latte&page=1&limit=5`

**Response (200) — Dengan Pagination:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Signature Latte",
      "description": "Our signature creamy latte with a velvety texture",
      "price": 28000,
      "image": "https://images.unsplash.com/...",
      "stock": 99,
      "is_available": true,
      "category_id": 1,
      "category": { "id": 1, "name": "Espresso Based", "icon": "☕" }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 5,
  "totalPages": 1
}
```

### Contoh: POST `/api/orders` (Checkout)

**Request:**
```json
{
  "customer_name": "John Doe",
  "order_type": "pickup",
  "promo_code": "CODEX20",
  "notes": "No sugar",
  "items": [
    { "product_id": 1, "quantity": 2, "price": 28000 },
    { "product_id": 3, "quantity": 1, "price": 22000 }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": { "id": 5, "total_amount": 62400 }
}
```

### ❌ Format Response Error (400/401/403/404/500)

Semua error mengembalikan format yang konsisten:

```json
{
  "success": false,
  "message": "Pesan error spesifik"
}
```

| Status Code | Contoh Message | Kapan Muncul |
|---|---|---|
| `400` | `"Name and price required"` | Validasi input gagal |
| `400` | `"Email already registered"` | Duplikat data |
| `400` | `"Invalid status"` | Status order tidak valid |
| `401` | `"No token provided"` | Request tanpa JWT token |
| `401` | `"Invalid or expired token"` | Token expired/invalid |
| `401` | `"Invalid credentials"` | Email/password salah |
| `403` | `"Admin access required"` | Customer akses route admin |
| `404` | `"Product not found"` | Resource tidak ditemukan |
| `500` | `"Internal Server Error"` | Server error (centralized handler) |

---

## 🗃️ Skrip Database

### Seed Database (Inisialisasi Data)

```bash
# Menjalankan seeder (membuat tabel + data awal)
npm run db:seed
```

Seed script (`server/config/seed.js`) akan membuat:
- **2 Users** (admin + customer) — password di-hash otomatis dengan bcrypt
- **4 Categories** (Espresso Based, Non-Coffee, Pastries, Seasonal Special)
- **15 Products** (6 espresso, 4 non-coffee, 4 pastries, 1 seasonal)
- **3 Promos** (CODEX20, HEMAT10K, NEWMEMBER)

### Reset Database

```bash
# Seed menggunakan { force: true } — akan DROP semua tabel dan membuat ulang
npm run db:seed
```

---

## ✨ Fitur Aplikasi

### 👤 Customer (Halaman Utama `/`)

| # | Fitur | Deskripsi |
|---|---|---|
| 1 | 🔐 Login / Register | Autentikasi user dengan JWT token |
| 2 | 🔍 Search Produk | Live search produk berdasarkan nama |
| 3 | 🗂️ Filter Kategori | Filter menu berdasarkan kategori (All, Espresso, Non-Coffee, Pastries, Seasonal) |
| 4 | 🛒 Keranjang Belanja | Tambah/kurang item, quantity control real-time |
| 5 | 💳 Checkout | Form pembayaran dengan pilihan Pickup/Delivery |
| 6 | 🏷️ Kode Promo | Validasi kode promo, kalkulasi diskon otomatis |
| 7 | 📱 Responsive | Layout adaptif dari desktop hingga mobile |
| 8 | 🎨 Animasi & Hover | Micro-animasi, hover effects, toast notification |

### 🛡️ Admin Panel (`/admin`)

| # | Fitur | Deskripsi |
|---|---|---|
| 1 | 📊 Dashboard | Statistik ringkasan: total order, revenue, produk, user, pending |
| 2 | ☕ CRUD Produk | Tambah, edit, hapus produk + search & pagination |
| 3 | 🗂️ CRUD Kategori | Tambah, edit, hapus kategori dengan icon picker |
| 4 | 📦 Manajemen Order | Lihat detail order, update status (pending → processing → completed → cancelled) |
| 5 | 👥 Manajemen User | Lihat daftar user, toggle role (admin/customer), hapus user |
| 6 | 🏷️ CRUD Promo | Tambah, edit, hapus promo, toggle aktif/nonaktif |
| 7 | 🔒 Protected Route | Hanya admin yang bisa akses (ProtectedAdmin component) |

---

## 🌐 Deployment (Vercel + Neon PostgreSQL)

### Step 1: Setup Neon Database
1. Buka [neon.tech](https://neon.tech) → Login → **New Project**
2. Copy **Connection String** (format `postgresql://...`)

### Step 2: Environment Variables
Buat file `server/.env`:
```env
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require
JWT_SECRET=ganti_dengan_string_yang_aman
PORT=5000
```

### Step 3: Seed Database Neon
```bash
npm run db:seed
```

### Step 4: Deploy ke Vercel
1. Push ke GitHub
2. Import di [vercel.com](https://vercel.com)
3. Tambahkan Environment Variables: `DATABASE_URL`, `JWT_SECRET`
4. Deploy!

---

## 🏗️ Arsitektur & Pola Desain

### Class Inheritance (OOP)

```
Sequelize Model (base)
  └── BaseModel (custom abstract class)
        ├── findPaginated()    — pagination helper
        ├── findByField()      — single lookup
        ├── createRecord()     — create wrapper
        ├── updateById()       — update by PK
        └── deleteById()       — delete by PK
              ├── User         → findByEmail(), comparePassword(), toJSON()
              ├── Category     — inherits all BaseModel methods
              ├── Product      → findWithCategory() (search + filter + include)
              ├── Order        → findWithItems() (eager load items + products)
              ├── OrderItem    — inherits all BaseModel methods
              └── Promo        → findByCode(), calculateDiscount()
```

### Module System

- **Server (CommonJS):** `require()` / `module.exports` — controllers, models, routes, middleware
- **Client (ES Modules):** `import` / `export` — React components, API helpers, context

### Async Pattern

- Semua controller menggunakan `async/await` dengan `try/catch`
- Error di-forward ke centralized error handler via `next(error)`
- Async hooks di model (bcrypt password hashing)
- Client fetch API dengan async `handleRes()` helper

---

*Crafted with ☕ by Tim Codex — 2026*

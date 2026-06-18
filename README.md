\<div align="center">

# ☕ Codex Coffee Shop

**A modern full-stack coffee shop POS application**

Sistem pemesanan kopi & makanan dengan admin panel lengkap, dashboard analytics penjualan, dan dukungan PostgreSQL via Neon.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://neon.tech)

</div>

---

## 👥 Tim Pengembang — **Codex**

| NIM       | Nama Lengkap    |
| --------- | --------------- |
| 241112498 | Nachelle Ferari |
| 241110460 | Filbert Matthew |
| 241112002 | Ryu Kierando    |
| 241110371 | Zakky Pratama   |

## 🎥 Video Demo

🔗 **[Link Video Demo Aplikasi]** _(masukkan link Google Drive / YouTube)_

---

## ✨ Highlights

- 🎨 **Dark coffee aesthetic** — palette warm-orange & deep brown yang elegan
- 📊 **Sales Dashboard** — chart revenue 7 hari, top produk, donut status, breakdown tipe pesanan
- 📱 **Mobile responsive** — drawer cart, category pills, mobile menu untuk admin
- 🔔 **Toast notifications** — feedback instan saat tambah ke cart / checkout
- ☁️ **Cloud-ready** — siap deploy ke Vercel + Neon PostgreSQL serverless
- 🔐 **JWT authentication via Passport.js** — role-based (admin / customer), wajib login untuk checkout
- 🌐 **OAuth 2.0** — sign in with Google & GitHub (opt-in via env vars)

---

## 🛠️ Tech Stack

| Layer      | Teknologi                                              |
| ---------- | ------------------------------------------------------ |
| Runtime    | Node.js v18+                                           |
| Backend    | Express.js v4 + Sequelize ORM v6                       |
| Database   | SQLite (dev) / PostgreSQL via Neon (prod)              |
| Frontend   | React 18 + React Router v6 + Vite 5                    |
| Styling    | Tailwind CSS v3 (custom dark theme)                    |
| Auth       | Passport.js (Local + JWT + Google + GitHub) + bcryptjs |
| Deployment | Vercel (static frontend + serverless backend)          |

---

## 📁 Struktur Proyek

```
codex-coffee-shop/
├── api/                        # Vercel serverless entry
│   ├── index.js
│   └── package.json
├── client/                     # Frontend (Vite + React)
│   ├── src/
│   │   ├── api/                # Centralized fetch helpers
│   │   ├── components/         # Reusable UI
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── CartPreview.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── PaymentModal.jsx
│   │   │   └── Toast.jsx       # NEW: toast notifications
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/              # NEW
│   │   │   └── useToast.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── Dashboard.jsx     # Sales analytics
│   │   │       ├── Products.jsx
│   │   │       ├── Categories.jsx
│   │   │       ├── Orders.jsx
│   │   │       ├── Users.jsx
│   │   │       └── Promos.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Dark theme design system
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Backend
│   ├── auth/                   # 🔐 Passport.js + JWT + OAuth
│   │   ├── index.js            # Public surface (re-exports)
│   │   ├── passport.js         # Strategy registration
│   │   ├── tokenService.js     # JWT issue / verify
│   │   ├── authController.js   # register / login / me / oauth callbacks
│   │   ├── authRoutes.js       # /api/auth/* endpoints
│   │   ├── authMiddleware.js   # requireAuth, requireAdmin, optionalAuth
│   │   └── strategies/
│   │       ├── localStrategy.js
│   │       ├── jwtStrategy.js
│   │       ├── googleStrategy.js
│   │       └── githubStrategy.js
│   ├── config/
│   │   ├── sequelize.js        # SQLite + Neon support
│   │   └── seed.js
│   ├── controllers/
│   │   ├── userCtrl.js         # Admin user mgmt (auth lives in /auth)
│   │   ├── categoryCtrl.js
│   │   ├── productCtrl.js
│   │   ├── orderCtrl.js
│   │   ├── promoCtrl.js
│   │   └── statsCtrl.js        # Dashboard analytics queries
│   ├── middleware/
│   │   ├── auth.js             # Backwards-compat shim → server/auth
│   │   └── validate.js
│   ├── models/                 # OOP inheritance
│   │   ├── BaseModel.js
│   │   ├── User.js             # + provider, provider_id, avatar_url
│   │   ├── Category.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Promo.js
│   │   └── index.js
│   ├── routes/
│   └── server.js

├── .env.example
├── .gitignore
├── vercel.json
└── package.json
```

---

## 🗄️ Database — 6 Resource

| #   | Resource       | Tabel         | Deskripsi                                 | CRUD       |
| --- | -------------- | ------------- | ----------------------------------------- | ---------- |
| 1   | **Users**      | `users`       | User dengan role admin/customer           | ✅ C-R-U-D |
| 2   | **Categories** | `categories`  | Kategori menu (Espresso, Non-Coffee, dll) | ✅ C-R-U-D |
| 3   | **Products**   | `products`    | Menu kopi & makanan dengan stok, harga    | ✅ C-R-U-D |
| 4   | **Orders**     | `orders`      | Pesanan dengan status tracking            | ✅ C-R-U-D |
| 5   | **OrderItems** | `order_items` | Detail item per pesanan (junction)        | ✅ C-R     |
| 6   | **Promos**     | `promos`      | Kode promo (percent / fixed)              | ✅ C-R-U-D |

### Relasi

```
User ──< Order ──< OrderItem >── Product >── Category
                                     │
                              Promo (validated at checkout)
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js v18+** & **npm**

### Setup Lokal (SQLite — tanpa Neon)

```bash
# 1. Install dependencies
npm install
cd client && npm install && cd ..

# 2. Pastikan server/.env kosong DATABASE_URL nya (atau hapus baris itu)
#    Tanpa DATABASE_URL, app otomatis pakai SQLite

# 3. Seed database
npm run db:seed

# 4. Run dev (server + client bersamaan)
npm run dev
```

### Setup dengan Neon PostgreSQL

```bash
# 1. Buka https://neon.tech, buat project baru
# 2. Copy connection string ke server/.env:
echo 'DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require' > server/.env
echo 'JWT_SECRET=ganti_dengan_string_aman' >> server/.env

# 3. Seed Neon database
npm run db:seed

# 4. Run dev
npm run dev
```

### Akses

| Halaman         | URL                              |
| --------------- | -------------------------------- |
| Customer (Menu) | http://localhost:5173            |
| Admin Panel     | http://localhost:5173/admin      |
| API Backend     | http://localhost:5000/api        |
| Health Check    | http://localhost:5000/api/health |

### 🔐 Default Login

| Role     | Email             | Password   |
| -------- | ----------------- | ---------- |
| Admin    | `admin@codex.com` | `admin123` |
| Customer | `user@codex.com`  | `user123`  |

---

## 📡 API Endpoints

### Auth — `/api/auth` (NEW, powered by Passport.js)

| Method | Endpoint           | Auth    | Notes                                    |
| ------ | ------------------ | ------- | ---------------------------------------- |
| `POST` | `/register`        | ❌      | Local sign-up (email + password)         |
| `POST` | `/login`           | ❌      | Local sign-in (returns JWT)              |
| `GET`  | `/me`              | 🔒 User | Returns current user from Bearer token   |
| `POST` | `/logout`          | ❌      | Stateless — clears token client-side     |
| `GET`  | `/providers`       | ❌      | Lists enabled OAuth providers            |
| `GET`  | `/google`          | ❌      | Start Google OAuth (browser redirect)    |
| `GET`  | `/google/callback` | ❌      | Google OAuth callback → redirects to SPA |
| `GET`  | `/github`          | ❌      | Start GitHub OAuth (browser redirect)    |
| `GET`  | `/github/callback` | ❌      | GitHub OAuth callback → redirects to SPA |

> Legacy aliases `POST /api/users/login` & `POST /api/users/register` masih
> berfungsi dan langsung delegate ke `/api/auth/login` & `/api/auth/register`.

### Users — `/api/users` (admin management)

| Method   | Endpoint | Auth     |
| -------- | -------- | -------- |
| `GET`    | `/`      | 🔒 Admin |
| `PUT`    | `/:id`   | 🔒 Admin |
| `DELETE` | `/:id`   | 🔒 Admin |

### Products — `/api/products`

| Method   | Endpoint                              | Auth     |
| -------- | ------------------------------------- | -------- |
| `GET`    | `/?search=&category_id=&page=&limit=` | ❌       |
| `GET`    | `/:id`                                | ❌       |
| `POST`   | `/`                                   | 🔒 Admin |
| `PUT`    | `/:id`                                | 🔒 Admin |
| `DELETE` | `/:id`                                | 🔒 Admin |

### Categories — `/api/categories`

| Method   | Endpoint | Auth     |
| -------- | -------- | -------- |
| `GET`    | `/`      | ❌       |
| `POST`   | `/`      | 🔒 Admin |
| `PUT`    | `/:id`   | 🔒 Admin |
| `DELETE` | `/:id`   | 🔒 Admin |

### Orders — `/api/orders`

| Method   | Endpoint                 | Auth     | Notes                             |
| -------- | ------------------------ | -------- | --------------------------------- |
| `POST`   | `/`                      | 🔒 User  | **Wajib login** untuk place order |
| `GET`    | `/?status=&page=&limit=` | 🔒 Admin |                                   |
| `GET`    | `/:id`                   | 🔒 User  |                                   |
| `PATCH`  | `/:id/status`            | 🔒 Admin |                                   |
| `DELETE` | `/:id`                   | 🔒 Admin |                                   |

### Promos — `/api/promos`

| Method   | Endpoint         | Auth     |
| -------- | ---------------- | -------- |
| `GET`    | `/active`        | ❌       |
| `POST`   | `/validate`      | ❌       |
| `GET`    | `/?page=&limit=` | 🔒 Admin |
| `POST`   | `/`              | 🔒 Admin |
| `PUT`    | `/:id`           | 🔒 Admin |
| `DELETE` | `/:id`           | 🔒 Admin |

### Stats — `/api/stats`

| Method | Endpoint | Returns                                               | Auth     |
| ------ | -------- | ----------------------------------------------------- | -------- |
| `GET`  | `/`      | Dashboard analytics (revenue, daily chart, top prods) | 🔒 Admin |

**Stats response:**

```json
{
  "success": true,
  "data": {
    "totalOrders": 25,
    "totalRevenue": 1250000,
    "totalProducts": 15,
    "totalUsers": 8,
    "pendingOrders": 3,
    "todayRevenue": 180000,
    "todayOrders": 4,
    "avgOrderValue": 50000,
    "dailyRevenue": [{ "date": "2026-05-15", "revenue": 200000, "orders": 5 }],
    "topProducts": [{ "name": "Latte", "total_sold": 30, "total_revenue": 840000 }],
    "orderTypeBreakdown": [{ "order_type": "pickup", "count": 18, "revenue": 900000 }],
    "statusBreakdown": [{ "status": "completed", "count": 22 }],
    "recentOrders": [...]
  }
}
```

---

## 📋 Format Response

### ✅ Success

```json
{ "success": true, "message": "...", "data": {...} }
```

### ❌ Error

```json
{ "success": false, "message": "..." }
```

| Status | Saat                               |
| ------ | ---------------------------------- |
| `400`  | Validasi input gagal               |
| `401`  | Token tidak ada / expired          |
| `403`  | Bukan admin                        |
| `404`  | Resource tidak ditemukan           |
| `500`  | Server error (centralized handler) |

---

## ✨ Fitur

### 👤 Customer (`/`)

- 🔐 Login / Register dengan JWT (email-password) + OAuth (Google / GitHub)
- 🛒 Browse menu tanpa login — bebas eksplor & isi keranjang
- 🔒 **Wajib login sebelum checkout** — modal auth otomatis muncul saat klik Checkout, lalu lanjut ke pembayaran setelah berhasil
- 🔍 Live search produk
- 🗂️ Filter kategori (desktop sidebar + mobile category pills)
- 🛒 Cart dengan quantity control & live total
- 📱 Mobile drawer cart + floating cart button
- 💳 Checkout dengan Pickup / Delivery
- 🏷️ Validasi promo & kalkulasi diskon
- 🔔 Toast notification saat tambah cart / order placed

### 🛡️ Admin Panel (`/admin`)

- 📊 **Dashboard** dengan analytics:
  - Stats cards (revenue, orders, products, customers)
  - Highlight cards (today, avg order, pending)
  - Bar chart revenue 7 hari terakhir
  - Donut chart distribusi status pesanan
  - Top 5 produk terlaris dengan progress bar
  - Breakdown tipe pesanan (Pickup vs Delivery)
  - Recent orders feed
- ☕ CRUD Products (search, pagination, kategori)
- 🗂️ CRUD Categories (icon picker)
- 📦 Order management (filter status, transition pending→processing→completed)
- 👥 User management (toggle role, search)
- 🏷️ CRUD Promos (toggle active)
- 🔄 Sidebar collapsible (state persisted di localStorage)
- 📱 Mobile drawer untuk admin nav
- 🔙 Tombol "Back to Store" di sidebar

---

## 🌐 Deployment ke Vercel

```bash
# 1. Setup Neon DB (https://neon.tech) → copy connection string
# 2. Push ke GitHub
git push origin main

# 3. Import di vercel.com
# 4. Tambahkan Environment Variables:
#    - DATABASE_URL = postgresql://...neon.tech/...
#    - JWT_SECRET   = string_aman
# 5. Deploy
```

Aplikasi otomatis menggunakan Neon di production (terdeteksi via `process.env.VERCEL`) dan SQLite di local dev.

---

## 🔐 Authentication (Passport.js + JWT + OAuth)

Auth module hidup di **`server/auth/`** — terpisah dari controller/middleware lain, jadi mudah dirawat dan ditest.

### Flow

```
                        ┌──────────────────────────────────────┐
  Email + password ───► │ POST /api/auth/login (LocalStrategy) │ ──┐
                        └──────────────────────────────────────┘   │
                                                                   ├─► JWT (Bearer) ─► localStorage ─► Authorization header
   Google / GitHub  ───► /api/auth/{provider}                      │
                              ↓                                    │
                         OAuth dance                                │
                              ↓                                    │
                         /api/auth/{provider}/callback ─────────────┘
                              ↓
                         Redirect ke `/auth/callback?token=...`
                              ↓
                         SPA AuthContext baca query → simpan token → fetch /me
```

- **Stateless** — tidak ada session cookie. JWT disimpan di `localStorage` client.
- **Wajib login untuk POST `/api/orders`** — `user_id` diambil dari JWT, **tidak** dari body request (dilindungi tampering).
- **OAuth opsional** — strategi hanya didaftarkan kalau credentials ada di env. Strategi yang tidak dikonfigurasi tidak muncul di UI.

### Setup OAuth

#### Google

1. Buka https://console.cloud.google.com → buat OAuth Client (type: **Web application**).
2. Tambahkan **Authorized redirect URI**: `http://localhost:5000/api/auth/google/callback`
   (untuk Vercel: ganti host ke domain produksi).
3. Salin Client ID + Secret ke `server/.env`:
   ```env
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

#### GitHub

1. Buka https://github.com/settings/developers → **New OAuth App**.
2. Authorization callback URL: `http://localhost:5000/api/auth/github/callback`.
3. Salin ke `server/.env`:
   ```env
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   ```

Restart dev server. Tombol Continue with Google / GitHub otomatis muncul di modal login.

### Custom callback URL (production)

Di Vercel, set:

```env
GOOGLE_CALLBACK_URL=https://your-domain.vercel.app/api/auth/google/callback
GITHUB_CALLBACK_URL=https://your-domain.vercel.app/api/auth/github/callback
OAUTH_SUCCESS_REDIRECT=/auth/callback
OAUTH_FAILURE_REDIRECT=/auth/callback
```

---

## 🏗️ Pola Desain

### OOP Inheritance pada Models

```
Sequelize.Model
  └── BaseModel (abstract — generic CRUD)
        ├── findPaginated()
        ├── findByField()
        ├── createRecord()
        ├── updateById()
        └── deleteById()
              ├── User       → findByEmail(), comparePassword()
              ├── Category   — inherits all
              ├── Product    → findWithCategory() (search + filter)
              ├── Order      → findWithItems() (eager load)
              ├── OrderItem  — inherits all
              └── Promo      → findByCode(), calculateDiscount()
```

### Module System

- **Server**: CommonJS (`require` / `module.exports`)
- **Client**: ES Modules (`import` / `export`)

### Async / Error Handling

- Semua controller pakai `async/await` + `try/catch`
- Error di-forward ke centralized error handler via `next(error)`
- Async hooks di model untuk bcrypt password hashing
- Client menggunakan `handleRes()` helper untuk parsing & error throwing

---

## 🎨 Design System

**Color Palette (Dark Coffee):**

| Token           | Hex       | Usage              |
| --------------- | --------- | ------------------ |
| `codex-bg`      | `#1C1410` | Background utama   |
| `codex-surface` | `#251C16` | Cards & panels     |
| `codex-panel`   | `#2E2218` | Navbar/sidebar     |
| `codex-border`  | `#3D2E22` | Border subtle      |
| `codex-accent`  | `#E8A045` | Orange-gold accent |
| `codex-text`    | `#F0E6D8` | Text utama         |
| `codex-muted`   | `#8A7060` | Text sekunder      |

**Fonts:** Poppins (display) + Inter (body)

---

<div align="center">

_Crafted with ☕ by Tim Codex — 2026_

</div>

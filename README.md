<div align="center">

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

| NIM       | Nama Lengkap    | Kontribusi Utama                                         |
| --------- | --------------- | -------------------------------------------------------- |
| 241112498 | Nachelle Ferari | Frontend UI/UX, Customer flow, Cart & Checkout           |
| 241110460 | Filbert Matthew | Backend API, Database, Auth & Middleware                 |
| 241112002 | Ryu Kierando    | Admin Panel, Dashboard analytics, CRUD operations         |
| 241110371 | Zakky Pratama   | WebRTC Integration, Deployment, Testing                   |

## 🎥 Video Demo

🔗 **[Link Video Demo Aplikasi]** _(upload ke Google Drive / YouTube, set public, durasi max 15 menit)_

> Video demo menjelaskan **semua fitur** aplikasi: customer flow (browse, cart, checkout, promo), admin panel (dashboard, CRUD products/categories/orders/users/promos), REST API & middleware, dan WebRTC live video support.

---

## 🌐 Akses Aplikasi (Production)

| Halaman         | URL                                          |
| --------------- | -------------------------------------------- |
| Customer (Menu) | https://codex-coffeeshop.vercel.app/         |
| Admin Panel    | https://codex-coffeeshop.vercel.app/admin    |
| API Health     | https://codex-coffeeshop.vercel.app/api/health |

### 🔐 Kredensial Login

| Role     | Email             | Password   |
| -------- | ----------------- | ---------- |
| Admin    | `admin@codex.com` | `admin123` |
| Customer | `user@codex.com`  | `user123`  |

---

## 📋 Pemenuhan Indikator Penilaian UAS

| # | Indikator Penilaian | Bobot | Status | Implementasi |
|---|---------------------|-------|--------|--------------|
| 1 | Database di server | 15% | ✅ | 7 model (Users, Categories, Products, Orders, OrderItems, Promos, CallSessions) + full CRUD via Sequelize ORM, SQLite dev / Neon PostgreSQL prod |
| 2 | Middleware | 10% | ✅ | `requireAuth`, `requireAdmin`, `optionalAuth` (Passport JWT), `validateIdParam`, `sanitizeBody`, helmet, CORS, express-rate-limit (auth + general), centralized error handler |
| 3 | REST | 10% | ✅ | HTTP method sesuai (GET/POST/PUT/PATCH/DELETE), status code (200/201/400/401/403/404/500), format response konsisten `{success, message, data}` |
| 4 | Autentikasi & Otorisasi | 15% | ✅ | JWT + Passport.js (Local/JWT/Google/GitHub), bcrypt, role-based (admin/customer), ownership check di setiap endpoint, `user_id` dari JWT bukan body |
| 5 | Tampilan web | 20% | ✅ | React 18 + Tailwind CSS v3, dark coffee theme, glassmorphism, micro-animation, responsive, dashboard + chart, toast notifications |
| 6 | RTC & hosting | 20% | ✅ | WebRTC video call P2P (RTCPeerConnection + DataChannel), STUN servers, live chat, signaling via REST + DB polling. Hosting: Vercel + Neon PostgreSQL serverless |
| 7 | Teknologi mandiri | 10% | ✅ | OAuth 2.0 (Google + GitHub), Neon serverless Postgres, Vercel serverless, OOP inheritance BaseModel, SSR (EJS), WebRTC native browser API |

---

## ✨ Highlights

- 🎨 **Dark coffee aesthetic** — palette warm-orange & deep brown yang elegan
- 📊 **Sales Dashboard** — chart revenue 7 hari, top produk, donut status, breakdown tipe pesanan
- 📱 **Mobile responsive** — drawer cart, category pills, mobile menu untuk admin
- 🔔 **Toast notifications** — feedback instan saat tambah ke cart / checkout
- ☁️ **Cloud-ready** — siap deploy ke Vercel + Neon PostgreSQL serverless
- 🔐 **JWT authentication via Passport.js** — role-based (admin / customer), wajib login untuk checkout
- 🌐 **OAuth 2.0** — sign in with Google & GitHub (opt-in via env vars)
- 📹 **WebRTC Live Video Support** — customer dapat memanggil admin via video call P2P dengan live chat (DataChannel)

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
| RTC        | WebRTC (RTCPeerConnection + DataChannel) + STUN         |
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
│   │   │   ├── CategoryIcon.jsx     # Category emoji/icon renderer
│   │   │   ├── CartPreview.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── PaymentModal.jsx
│   │   │   ├── ConfirmCallModal.jsx       # NEW: pre-call confirmation
│   │   │   ├── CallModal.jsx        # NEW: WebRTC video call UI
│   │   │   ├── IncomingCallNotification.jsx  # NEW: admin call alert
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/              # NEW
│   │   │   ├── useToast.js
│   │   │   └── useWebRTC.js    # NEW: RTCPeerConnection manager
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
│   │   ├── callCtrl.js       # NEW: WebRTC signaling controller
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
│   │   ├── CallSession.js    # NEW: WebRTC signaling storage
│   │   └── index.js
│   ├── routes/
│   │   └── callRoutes.js     # NEW: /api/calls endpoints
│   └── server.js

├── .env.example
├── .gitignore
├── vercel.json
└── package.json
```

---

## 🗄️ Database — 7 Resource

| #   | Resource       | Tabel         | Deskripsi                                 | CRUD       |
| --- | -------------- | ------------- | ----------------------------------------- | ---------- |
| 1   | **Users**      | `users`       | User dengan role admin/customer           | ✅ C-R-U-D |
| 2   | **Categories** | `categories`  | Kategori menu (Espresso, Non-Coffee, dll) | ✅ C-R-U-D |
| 3   | **Products**   | `products`    | Menu kopi & makanan dengan stok, harga    | ✅ C-R-U-D |
| 4   | **Orders**     | `orders`      | Pesanan dengan status tracking            | ✅ C-R-U-D |
| 5   | **OrderItems** | `order_items` | Detail item per pesanan (junction)        | ✅ C-R     |
| 6   | **Promos**     | `promos`        | Kode promo (percent / fixed)              | ✅ C-R-U-D |
| 7   | **CallSessions** | `call_sessions` | WebRTC signaling data (offer, answer, ICE) | ✅ C-R-U-D |

### Relasi

```
User ──< Order ──< OrderItem >── Product >── Category
   │                                    │
   │                             Promo (validated at checkout)
   │
   └──< CallSession (WebRTC signaling: offer, answer, ICE)
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

### Calls — `/api/calls` (WebRTC Signaling)

Since Vercel is serverless (no persistent WebSocket), WebRTC signaling is
exchanged via REST + DB polling. The actual video/audio/chat data flows
peer-to-peer through `RTCPeerConnection`.

| Method   | Endpoint         | Auth     | Notes                                              |
| -------- | ---------------- | -------- | -------------------------------------------------- |
| `POST`   | `/`              | 🔒 User  | Caller creates SDP offer → status "ringing"        |
| `GET`    | `/incoming`      | 🔒 Admin  | Admin polls for a ringing call                     |
| `GET`    | `/:id`           | 🔒 User  | Poll for answer, ICE candidates, status             |
| `POST`   | `/:id/answer`    | 🔒 Admin | Admin submits SDP answer → status "active"        |
| `POST`   | `/:id/ice`       | 🔒 User  | Append ICE candidate (caller→caller_ice, admin→callee_ice) |
| `PATCH`  | `/:id/end`       | 🔒 User  | Either party ends the call                         |
| `PATCH`  | `/:id/decline`   | 🔒 Admin | Admin declines an incoming call                    |

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
- 📹 **Live Video Support** — panggil admin via WebRTC video call + live chat

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
- 📹 **Incoming video call support** — notifikasi otomatis + video call P2P dengan customer
- 🔄 Sidebar collapsible (state persisted di localStorage)
- 📱 Mobile drawer untuk admin nav
- 🔙 Tombol "Back to Store" di sidebar

---

## 📊 Daftar Fitur & Tingkat Kesulitan

> Sesuai ketentuan: "Jumlah fitur dan tingkat kesulitan fitur seharusnya disesuaikan dengan jumlah anggota." Dengan 4 anggota, target ideal 12+ fitur. Proyek ini mengembangkan **25 fitur** dengan tingkat kesulitan bervariasi.

### Tingkat Kesulitan
- 🟢 **Rendah** — CRUD sederhana, UI statis
- 🟡 **Sedang** — Logika bisnis, validasi, relasi database
- 🔴 **Tinggi** — Integrasi kompleks, real-time, keamanan multi-layer

| #  | Fitur                                              | Area    | Kesulitan | Indikator |
|----|----------------------------------------------------|---------|-----------|-----------|
| 1  | Sistem Autentikasi (JWT + Passport.js + bcrypt)    | Backend | 🔴        | #4        |
| 2  | OAuth 2.0 (Google + GitHub)                        | Backend | 🔴        | #4, #7    |
| 3  | Role-based Authorization (admin/customer)          | Backend | 🔴        | #4        |
| 4  | Ownership check per-endpoint (IDOR protection)     | Backend | 🔴        | #2, #4    |
| 5  | REST API lengkap (7 resource, 40+ endpoints)       | Backend | 🟡        | #3        |
| 6  | Middleware: auth guard, rate-limit, helmet, CORS   | Backend | 🟡        | #2        |
| 7  | Middleware: input validation & sanitization        | Backend | 🟡        | #2        |
| 8  | Centralized error handler                          | Backend | 🟢        | #2        |
| 9  | OOP BaseModel inheritance (7 model)                | Backend | 🟡        | #7        |
| 10 | Dual database (SQLite dev / Neon PostgreSQL prod)  | Backend | 🟡        | #1, #7    |
| 11 | CRUD Products (search, filter, pagination)         | Backend | 🟡        | #1, #3    |
| 12 | CRUD Categories (icon picker)                      | Backend | 🟢        | #1, #3    |
| 13 | CRUD Orders (status tracking, transaction)         | Backend | 🟡        | #1, #3    |
| 14 | CRUD Users (role toggle)                           | Backend | 🟡        | #1, #3    |
| 15 | CRUD Promos (percent & fixed discount)              | Backend | 🟡        | #1, #3    |
| 16 | Checkout POS (pickup/delivery + promo + ongkir)   | Backend | 🔴        | #1, #4    |
| 17 | Dashboard analytics (raw SQL: revenue, chart)      | Backend | 🔴        | #1        |
| 18 | WebRTC Video Call (RTCPeerConnection P2P)          | Full    | 🔴        | #6        |
| 19 | WebRTC Live Chat (RTCDataChannel P2P)              | Full    | 🔴        | #6, #7    |
| 20 | WebRTC Signaling via REST + DB polling             | Backend | 🔴        | #6, #7    |
| 21 | UI: Dark coffee theme + glassmorphism + animasi    | Frontend| 🟡        | #5        |
| 22 | UI: Responsive (desktop + mobile drawer/pills)     | Frontend| 🟡        | #5        |
| 23 | UI: Toast notifications + micro-interactions        | Frontend| 🟢        | #5        |
| 24 | UI: Admin dashboard dengan chart & visualisasi     | Frontend| 🔴        | #5        |
| 25 | Deployment: Vercel serverless + Neon cloud         | DevOps  | 🟡        | #6, #7    |

**Ringkasan:** 25 fitur — 🔴 Tinggi: 11 | 🟡 Sedang: 11 | 🟢 Rendah: 3

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

---

## 📹 WebRTC Live Video Support (RTC)

Aplikasi mendukung **video call real-time** antara customer dan admin
menggunakan WebRTC — media (video/audio) dan chat mengalir **peer-to-peer**,
hanya signaling yang melalui server.

### Arsitektur Signaling

```
Customer (Caller)                              Admin (Callee)
      │                                              │
      │  1. getUserMedia + createOffer               │
      │  2. POST /api/calls (sdp_offer)              │
      │──────────────────────────────────────────►   │
      │  status: "ringing"                           │
      │                                  3. GET /api/calls/incoming (poll)
      │ ◄──────────────────────────────────────────  │
      │                                  4. getUserMedia + setRemoteDescription(offer)
      │                                  5. createAnswer + POST /api/calls/:id/answer
      │ ◄──────────────────────────────────────────  │
      │  6. setRemoteDescription(answer)             │
      │                                              │
      │  ◄──── ICE candidates (via REST polling) ───►│
      │                                              │
      │  ════ P2P video/audio/chat established ═════ │
      │         (no server in the media path)        │
```

### Fitur

- 🎥 **Video call dua arah** — customer dan admin saling melihat
- 🎙️ **Mute / camera toggle** — kontrol media real-time
- 💬 **Live chat via DataChannel** — pesan teks P2P tanpa server
- 🔔 **Incoming call notification** — admin mendapat notifikasi otomatis
- ⏱️ **Auto-timeout** — call otomatis berakhir jika tidak diangkat dalam 45 detik
- 🌐 **STUN servers** — Google STUN untuk NAT traversal cross-network
- 📱 **Responsive** — video call bekerja di desktop & mobile

### Alur Customer

1. Klik tombol **"Live Support"** (floating, bottom-left)
2. Jika belum login → modal auth muncul, lalu confirm modal tampil
3. Klik **"Start Call"** di confirm modal → browser request izin kamera & mikrofon
4. Tunggu admin menjawab (status: "Calling admin…")
5. Saat admin accept → video call aktif
6. Kontrol: mute, camera off, chat, hangup

### Alur Admin

1. Notifikasi muncul otomatis di pojok kanan atas saat ada call masuk
2. Klik **Accept** → browser request izin kamera & mikrofon
3. Video call aktif dengan customer
4. Atau klik **Decline** untuk menolak

### Catatan Teknis

- **Signaling via REST + DB polling** — karena Vercel serverless tidak
  mendukung WebSocket persisten. SDP offer/answer dan ICE candidates disimpan
  di tabel `call_sessions` dan di-poll oleh kedua sisi.
- **Media P2P** — setelah koneksi terbentuk, video/audio/chat mengalir
  langsung antar peer tanpa melalui server (sesuai prinsip WebRTC).
- **HTTPS required** — WebRTC `getUserMedia` memerlukan HTTPS (Vercel
  menyediakan ini secara default; localhost juga diizinkan untuk dev).

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
              ├── User          → findByEmail(), findByProvider(), comparePassword()
              ├── Category      — inherits all
              ├── Product       → findWithCategory() (search + filter)
              ├── Order         → findWithItems() (eager load)
              ├── OrderItem     — inherits all
              ├── Promo         → findByCode(), calculateDiscount()
              └── CallSession   → findRinging() (with TTL filter)
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

**Color Palette (Warm Coffee / Cream):**

| Token                | Hex       | Usage                      |
| -------------------- | --------- | -------------------------- |
| `codex-base`         | `#FAF6EF` | Background terang utama    |
| `codex-bg`           | `#F4ECDF` | Body background            |
| `codex-coffee`       | `#3D2817` | Deep espresso (sidebar)   |
| `codex-coffee-soft`  | `#5C3D24` | Medium roast (borders)     |
| `codex-coffee-light` | `#8B6F47` | Latte (text sekunder)      |
| `codex-coffee-pale`  | `#C9A876` | Foam (accents)             |
| `codex-accent`       | `#9C6B3F` | Primary action (buttons)   |
| `codex-accent-glow`  | `#B88B5A` | Hover glow                 |
| `codex-text`         | `#2A1B0E` | Primary text               |
| `codex-muted`        | `#8C7458` | Tertiary text              |
| `codex-success`      | `#5A9070` | Success state              |
| `codex-danger`       | `#B85450` | Danger / delete            |

**Fonts:** Plus Jakarta Sans (display) + Inter (body) + Playfair Display (serif)

**Effects:**
- Glassmorphism dengan backdrop blur
- Micro-animasi (fade-in, slide-up, scale-in, float, pulse-soft)
- Custom scrollbar dengan gradient
- Surface layering (3 levels of elevation)
- Paper texture overlay (SVG noise)

---

<div align="center">

_Crafted with ☕ by Tim Codex — 2026_

</div>

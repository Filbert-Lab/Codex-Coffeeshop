# Codex Coffee Shop ☕

> Aplikasi web coffee shop full-stack menggunakan Node.js + Express + Sequelize + React

**Tim Pengembang:**
| NIM | Nama |
|---|---|
| 241112498 | Nachelle Ferari |
| 241110460 | Filbert Matthew |
| 241112002 | Ryu Kierando |
| 241110371 | Zakky Pratama |

---

## 🎥 Video Demo
🔗 **[Link Video Demo Aplikasi (YouTube/Google Drive)]** *(Silakan masukkan link video presentasi Anda di sini)*

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express 4, Sequelize ORM, SQLite (dev) / PostgreSQL Neon (prod)
- **Frontend**: React 18, React Router v6, Tailwind CSS v3, Vite 5
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Deployment**: Vercel (frontend static + backend serverless)

---

## 🗄️ Struktur Resource (6 Resource)

1. **Users** — Registrasi, login, role admin/customer
2. **Categories** — Kategori menu (Espresso, Non-Coffee, Pastries, Seasonal)
3. **Products** — Menu kopi dan makanan dengan stok
4. **Orders** — Pesanan dengan status (pending → processing → completed)
5. **OrderItems** — Item detail per pesanan
6. **Promos** — Kode promo diskon (percent/fixed)

---

## 🚀 Cara Menjalankan Lokal

### Prerequisites
- Node.js v18+
- npm

### Setup

```bash
# 1. Install semua dependencies
cd server && npm install
cd ../client && npm install

# 2. Seed database (SQLite otomatis dibuat)
cd server && node config/seed.js

# 3. Jalankan server + client bersamaan
# Terminal 1 (di root):
cd server && node server.js
# Terminal 2 (di root):
cd client && npx vite
```

### Akun Default
| Role | Email | Password |
|---|---|---|
| Admin | admin@codex.com | admin123 |
| Customer | user@codex.com | user123 |

Buka: **http://localhost:5173**  
Admin Panel: **http://localhost:5173/admin** (login sebagai admin dulu)

---

## 🌐 Deploy ke Vercel + Neon (PostgreSQL)

### Step 1: Setup Neon Database
1. Buka [neon.tech](https://neon.tech) → Login → **New Project**
2. Isi nama project (misal: `codex-coffee`) → Create
3. Di halaman project, klik **Connection Details**
4. Pilih **Connection String** format → Copy URL yang dimulai dengan `postgresql://`

### Step 2: Setup Environment Variables
Edit file `server/.env`:
```env
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require
JWT_SECRET=codex_coffee_secret_2024
PORT=5000
```
Ganti `DATABASE_URL` dengan URL dari Neon.

### Step 3: Seed Database Neon
```bash
cd server && node config/seed.js
```

### Step 4: Deploy ke Vercel
1. Push kode ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import repository
3. Di **Environment Variables**, tambahkan:
   - `DATABASE_URL` = URL Neon PostgreSQL
   - `JWT_SECRET` = secret yang aman
4. Deploy!

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/users/login` | Login user |
| POST | `/api/users/register` | Registrasi |

### Products
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/products` | List produk (search, category_id, page, limit) |
| GET | `/api/products/:id` | Detail produk |
| POST | `/api/products` | Tambah produk (admin) |
| PUT | `/api/products/:id` | Update produk (admin) |
| DELETE | `/api/products/:id` | Hapus produk (admin) |

### Orders
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/orders` | Buat pesanan |
| GET | `/api/orders` | List pesanan (admin) |
| GET | `/api/orders/:id` | Detail pesanan |
| PATCH | `/api/orders/:id/status` | Update status (admin) |
| DELETE | `/api/orders/:id` | Hapus pesanan (admin) |

### Promos
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/promos/active` | Daftar promo aktif (public) |
| POST | `/api/promos/validate` | Validasi kode promo |
| GET | `/api/promos` | Semua promo (admin) |
| POST | `/api/promos` | Tambah promo (admin) |
| PUT | `/api/promos/:id` | Update promo (admin) |
| DELETE | `/api/promos/:id` | Hapus promo (admin) |

### Stats
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/stats` | Dashboard stats (admin) |

---

## 📋 Contoh Request/Response & Skema Error

### ✅ Contoh Response Sukses (200/201)
Semua response sukses menggunakan format standar:
```json
{
  "success": true,
  "message": "Deskripsi sukses opsional",
  "data": { ... } // Payload data (object atau array)
}
```
**Contoh GET `/api/products` (Pagination & Filter)**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Espresso", "price": 25000, "category_id": 1 }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### ❌ Contoh Response Error (400/401/404/500)
Error validation dan server mengembalikan skema error yang konsisten:
```json
{
  "success": false,
  "message": "Pesan error spesifik (contoh: Email already registered)"
}
```

---

## ✨ Fitur Aplikasi

### Customer
- 🔍 Search produk dan filter per kategori
- 🛒 Keranjang belanja dengan quantity control
- 💳 Checkout dengan pilihan Pickup/Delivery
- 🏷️ Kode promo diskon
- 🔐 Login / Register
- 📱 Responsive layout

### Admin Panel (`/admin`)
- 📊 Dashboard dengan statistik (total order, revenue, users)
- ☕ CRUD Produk (create, edit, delete, search, pagination)
- 🗂️ CRUD Kategori dengan icon picker
- 📦 Manajemen Order (lihat detail, update status: pending→processing→completed)
- 👥 Manajemen User (lihat daftar, toggle role, delete)
- 🏷️ CRUD Promo (toggle aktif/nonaktif, validasi diskon)

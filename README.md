# 🐉 Golden Dragon Wok - Sistem Manajemen Restoran

Aplikasi web full-stack untuk manajemen restoran makanan oriental dengan fitur lengkap untuk admin dan pelanggan.

## 📋 Deskripsi Proyek

**Golden Dragon Wok** adalah sistem manajemen restoran berbasis web yang dirancang untuk memudahkan pengelolaan menu, pesanan, promo, dan user management. Aplikasi ini dibangun dengan teknologi modern dan menyediakan antarmuka yang intuitif untuk admin dan pelanggan.

### ✨ Fitur Utama

#### 👨‍💼 Fitur Admin
- **Dashboard Overview** - Statistik penjualan, pendapatan, dan performa restoran
- **Manajemen Menu** - CRUD menu lengkap dengan upload gambar
- **Manajemen Kategori** - Organisasi menu berdasarkan kategori
- **Manajemen Promo** - Buat dan assign promo ke menu tertentu
- **Manajemen Pesanan** - Lihat dan update status pesanan
- **Manajemen User** - CRUD user dengan fitur ban/unban
- **Download Struk PDF** - Generate struk pesanan dalam format PDF

#### 👥 Fitur Pelanggan
- **Browse Menu** - Lihat katalog menu dengan filter kategori
- **Shopping Cart** - Tambah menu ke keranjang belanja
- **Checkout** - Buat pesanan dengan validasi stok otomatis
- **Riwayat Pesanan** - Lihat semua pesanan yang pernah dibuat
- **Download Struk** - Download struk pesanan dalam PDF

## 🛠️ Teknologi yang Digunakan

### Backend
- **Laravel 11** - PHP Framework
- **MySQL** - Database
- **JWT Authentication** - Keamanan API
- **DomPDF** - Generate PDF struk

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **Axios** - HTTP client
- **React Router** - Routing

## 📦 Instalasi

### Prasyarat
- PHP 8.2 atau lebih tinggi
- Composer
- Node.js 18+ dan npm/bun
- MySQL 8.0+
- Git

### 1. Clone Repository

```bash
git clone https://github.com/fiko942/uap-web.git
cd uap-web
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Configure database di .env
# DB_CONNECTION=mysql
# DB_HOST=103.150.190.87
# DB_PORT=3306
# DB_DATABASE=golden-dragon-wok
# DB_USERNAME=golden-dragon-wok
# DB_PASSWORD=officer123

# Run migrations dan seeder
php artisan migrate:fresh --seed

# Create storage link
php artisan storage:link

# Start development server
php artisan serve
```

Backend akan berjalan di `http://127.0.0.1:8000`

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies (menggunakan bun atau npm)
bun install
# atau
npm install

# Copy environment file
copy .env.example .env
# Atau buat file .env dengan isi:
# VITE_API_BASE_URL=http://127.0.0.1:8000/api

# Start development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 🔐 Default Login Credentials

### Admin
- **Email:** tobellord@gmail.com
- **Password:** officer123

### Customer (Test Account)
- **Email:** customer@test.com
- **Password:** customer123

## 📁 Struktur Proyek

```
golden-dragon-wok/
├── backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/  # API Controllers
│   │   ├── Models/            # Eloquent Models
│   │   └── Traits/            # Reusable Traits
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/           # Database Seeders
│   ├── resources/views/       # Blade Templates (PDF)
│   ├── routes/api.php         # API Routes
│   └── storage/               # File Storage
│
└── frontend/                   # React Frontend
    ├── src/
    │   ├── api/               # API Client & Helpers
    │   ├── components/        # Reusable Components
    │   ├── context/           # React Context (Auth, Cart)
    │   ├── pages/             # Page Components
    │   │   ├── dashboard/     # Admin Pages
    │   │   └── public/        # Public Pages
    │   └── App.jsx            # Main App Component
    └── public/                # Static Assets
```

## 🚀 Deployment

### Backend (Laravel)

1. **Set Environment ke Production**
```bash
APP_ENV=production
APP_DEBUG=false
```

2. **Optimize Application**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

3. **Setup Web Server** (Apache/Nginx)
- Point document root ke `backend/public`
- Enable mod_rewrite (Apache)

### Frontend (React)

1. **Build Production**
```bash
npm run build
```

2. **Deploy ke Hosting**
- Upload folder `dist/` ke web server
- Configure web server untuk SPA routing

## 🔧 Konfigurasi

### Database
Database menggunakan MySQL dengan konfigurasi:
- Host: `103.150.190.87`
- Database: `golden-dragon-wok`
- User: `golden-dragon-wok`
- Password: `officer123`

### Storage
File upload (gambar menu) disimpan di `backend/storage/app/public/menus`

### API Base URL
Frontend berkomunikasi dengan backend melalui:
- Development: `http://127.0.0.1:8000/api`
- Production: Sesuaikan di `.env` frontend

## 📝 API Documentation

### Authentication
- `POST /api/register` - Register user baru
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/me` - Get user info

### Public Endpoints
- `GET /api/categories` - List kategori
- `GET /api/menus` - List menu
- `GET /api/promos` - List promo aktif

### Protected Endpoints (Requires JWT)
- `GET /api/dashboard` - Dashboard statistics (Admin)
- `GET /api/users` - List users (Admin)
- `GET /api/orders` - List orders (Admin)
- `POST /api/orders` - Create order (Customer)
- `GET /api/orders/my` - My orders (Customer)

## 🎨 Fitur Keamanan

- **JWT Authentication** - Token-based authentication
- **Role-based Access Control** - Admin & Customer roles
- **Password Hashing** - Bcrypt encryption
- **Input Validation** - Server-side validation
- **CORS Protection** - Configured CORS policy

## 🐛 Troubleshooting

### Backend Issues

**Error: Class 'PDO' not found**
```bash
# Aktifkan extension di php.ini
extension=pdo_mysql
```

**Error: Storage link not found**
```bash
php artisan storage:link
```

**Migration Error**
```bash
php artisan migrate:fresh --seed
```

### Frontend Issues

**API Connection Error**
- Pastikan backend running di `http://127.0.0.1:8000`
- Check `.env` file: `VITE_API_BASE_URL=http://127.0.0.1:8000/api`
- Restart dev server setelah ubah `.env`

**Module Not Found**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 Kontak

**Developer:** WIJI FIKO TEREN  
**Email:** tobellord@gmail.com  
**Lokasi:** Jl. Raya Donomulyo No. 123, Donomulyo, Malang, Jawa Timur

## 📄 Lisensi

© 2025 WIJI FIKO TEREN. All rights reserved.

---

**Dibuat dengan ❤️ untuk UAP Pemrograman Web**

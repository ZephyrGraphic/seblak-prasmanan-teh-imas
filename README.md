# 🍜 Seblak Teh Imas - Modern POS Application

Aplikasi Point of Sales (POS) modern berbasis web untuk Seblak Prasmanan Teh Imas. Dibangun dengan Next.js 16, Tailwind CSS v4, dan Database PostgreSQL, aplikasi ini mendukung pemesanan mandiri oleh pelanggan dan dashboard admin yang lengkap.

![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange)
![Mobile First](https://img.shields.io/badge/Design-Mobile%20First-green)
![Status](https://img.shields.io/badge/Status-Production-blue)

## ✨ Fitur Utama

### 📱 Untuk Pelanggan (Customer App)
*   **Self-Service Order**: Pelanggan memilih level pedas, kuah, dan topping sendiri.
*   **Real-time Calculation**: Harga terhitung otomatis saat memilih topping.
*   **Struk Digital**: Generate struk gambar (PNG) dengan sekali klik.
*   **PWA Support**: Bisa di-install di HP Android/iOS layaknya aplikasi native.

### 🛡️ Untuk Admin (Dashboard)
*   **Live Order Monitoring**: Memantau pesanan masuk secara real-time.
*   **Revenue Analytics**: Grafik pendapatan harian dan statistik topping terlaris.
*   **PDF Reporting**: Export laporan pendapatan harian ke PDF.
*   **Menu Management**: (Coming soon) Kelola stok dan harga.

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Styling**: Tailwind CSS v4 (Mobile First Design)
*   **Database**: PostgreSQL (via Prisma ORM)
*   **PWA**: @ducanh2912/next-pwa
*   **PDF/Image**: jsPDF, html2canvas

## 🚀 Cara Menjalankan (Development)

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/seblak-teh-imas.git
    cd seblak-teh-imas
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Database**
    Buat file `.env` dan isi `DATABASE_URL` (PostgreSQL).
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Jalankan Server**
    ```bash
    npm run dev
    # Akses di http://localhost:3000
    ```

## 🌐 Cara Deploy (Vercel)

1.  Push project ke GitHub.
2.  Buka [Vercel](https://vercel.com) dan import repository.
3.  Set Environment Variables: `DATABASE_URL` dan `DIRECT_URL`.
4.  Build Command: `npm run build` (sudah termasuk `prisma generate`).
5.  Deploy!

## 📱 PWA Instructions

*   Aplikasi ini memenuhi standar PWA.
*   Buka di browser Chrome (Android) atau Safari (iOS).
*   Klik "Add to Home Screen" untuk menginstall.

---
© 2026 Seblak Teh Imas. Built with ❤️ by Antigravity Agent.

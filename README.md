# 🍜 Seblak Teh Imas - Integrated POS & CRM System

**Sistem Informasi POS-CRM untuk Digitalisasi UMKM**

Aplikasi web modern yang mengintegrasikan **Point of Sales (POS)** dan **Customer Relationship Management (CRM)** untuk meningkatkan efisiensi operasional dan loyalitas pelanggan Seblak Prasmanan Teh Imas. Dibangun dengan teknologi terkini (Next.js 16, PWA), sistem ini menghadirkan solusi digital menyeluruh dari pemesanan mandiri hingga manajemen hubungan pelanggan.

![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange)
![POS-CRM](https://img.shields.io/badge/Type-POS%20%26%20CRM-blueviolet)
![Status](https://img.shields.io/badge/Status-Production-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)

## 👥 Tim Pengembang (Kelompok 2)

| Nama Lengkap                         | NIM         |
| ------------------------------------ | ----------- |
| **ETHELDREDA MARIA HERVEM PITA WEA** | 20230050137 |
| **LUTPANDEA PUTRA SUTRIYANA**        | 20230050140 |
| **M. Z. HAIKAL HAMDANI**             | 20240050147 |

## 🌟 Transformasi Digital UMKM (POS + CRM)

Sistem ini dirancang untuk menjawab tantangan UMKM kuliner dengan dua fokus utama:

1.  **Operational Efficiency (POS)**: Mempercepat proses pemesanan, mengurangi human error, dan otomatisasi hitung harga.
2.  **Customer Engagement (CRM)**: Membangun kedekatan dengan pelanggan melalui fitur kritik & saran terintegrasi, serta personalisasi pengalaman memesan.

## ✨ Fitur Unggulan

### 📱 1. Dual PWA Ecosystem

Implementasi **Dual PWA** memberikan pengalaman native app tanpa perlu install lewat Play Store:

- **Customer App (Front-office)**: Fokus pada kecepatan pemesanan dan pengalaman visual yang menggugah selera.
- **Admin Dashboard (Back-office)**: Fokus pada monitoring data dan manajemen bisnis.

### 🛒 2. Smart POS (Point of Sales)

- **Self-Service Ordering**: Pelanggan memilih sendiri varian, level pedas (1-5), dan topping.
- **Real-time Cart**: Kalkulasi harga otomatis dan transparan.
- **Visual Receipt**: Struk belanja digital (Generate PNG) yang ramah lingkungan dan mudah dibagikan.
- **WhatsApp Integration**: Konfirmasi pesanan terhubung langsung ke WhatsApp pemilik.

### 🤝 3. Integrated CRM (Customer Relationship Management)

- **Voice of Customer**: Portal khusus bagi pelanggan untuk memberikan rating bintang 1-5 dan masukan tekstual.
- **Feedback & Complaint Loop**: Admin dapat memantau kepuasan pelanggan secara real-time dari dashboard.
- **Outlet Information Center**: Informasi lokasi terintegrasi Google Maps memudahkan pelanggan baru menemukan outlet.

### 🛡️ 4. Admin Management Console

- **Live Order Tracking**: Notifikasi pesanan masuk secara real-time.
- **Revenue Analytics**: Visualisasi grafik pendapatan harian untuk analisa tren penjualan.
- **Product Management**: Kontrol penuh atas ketersediaan stok topping dan update harga.
- **Business Reporting**: Laporan keuangan harian otomatis yang dapat di-export ke PDF.

## 📍 Informasi Outlet

- **Lokasi**: Cibolang Kaler, Kec. Cisaat, Kabupaten Sukabumi, Jawa Barat
- **Maps Link**: [Klik untuk Navigasi](https://maps.app.goo.gl/YMV8LpdpLpWUeLkKA)
- **Kontak Resmi**: 0838-1373-1449

## 🛠️ Tech Stack & Architecture

Dibangun menggunakan teknologi **Modern Web** untuk performa, skalabilitas, dan SEO yang optimal:

- **Frontend Framework**: Next.js 16.1.1 (App Router)
- **UI/UX Library**: React 19 + Tailwind CSS v4
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **PWA Engine**: @ducanh2912/next-pwa (Dual Manifest Strategy)
- **Report Engine**: jsPDF & html2canvas (Client-side generation)
- **State Management**: Zustand (Global Store)

## 🚀 Cara Menjalankan (Development)

1.  **Clone Repository**

    ```bash
    git clone https://github.com/ZephyrGraphic/seblak-prasmanan-teh-imas.git
    cd seblak-teh-imas-v2
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Setup Environment**
    Buat file `.env` berisi `DATABASE_URL` (koneksi PostgreSQL).

    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    # Buka App Pelanggan: http://localhost:3000
    # Buka Dashboard Admin: http://localhost:3000/admin
    ```

---

© 2026 Seblak Teh Imas. **Sistem Informasi POS-CRM untuk UMKM**.

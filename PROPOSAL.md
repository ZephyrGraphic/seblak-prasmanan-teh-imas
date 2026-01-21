# Proposal Pengembangan Sistem POS-CRM Digital "Seblak Teh Imas"

**Tanggal:** 19 Januari 2026  
**Versi:** 2.0 (dengan Integrasi CRM)  
**Status:** Siap Produksi (Production Ready)  
**Disiapkan Oleh:** Tim Pengembang (Antigravity Agent)

---

## 1. Pendahuluan

### 1.1 Latar Belakang

Usaha kuliner "Seblak Teh Imas" saat ini menghadapi tantangan dalam operasional harian, terutama pada proses pencatatan pesanan yang masih manual (kertas). Metode konvensional ini memiliki beberapa kelemahan:

- Risiko kesalahan perhitungan total harga, terutama dengan variasi topping yang beragam.
- Antrian yang menumpuk karena proses pencatatan yang lama.
- Kesulitan dalam merekap pendapatan harian secara akurat.
- Pemborosan kertas nota/struk.
- **Tidak adanya database pelanggan untuk membangun loyalitas customer.**

### 1.2 Tujuan

Proposal ini menawarkan solusi berupa **Sistem Informasi Point of Sales dengan Integrasi Customer Relationship Management (POS-CRM) Berbasis Web** yang dirancang khusus untuk kebutuhan Seblak Teh Imas. Sistem ini bertujuan untuk:

1. Mendigitalisasi seluruh proses pemesanan, pembayaran, hingga pelaporan keuangan.
2. **Membangun hubungan jangka panjang dengan pelanggan melalui sistem membership.**
3. **Mengumpulkan feedback untuk meningkatkan kualitas layanan.**

---

## 2. Jenis Sistem Informasi

Sistem ini dikategorikan sebagai:

### **Sistem Informasi Point of Sale + Customer Relationship Management (POS-CRM)**

Dalam terminologi akademik, sistem ini mencakup:
| Jenis | Penjelasan |
|-------|------------|
| **Transaction Processing System (TPS)** | Mengelola transaksi penjualan harian |
| **Customer Relationship Management (CRM)** | Mengelola data dan hubungan pelanggan |
| **Management Information System (MIS)** | Menyediakan laporan revenue & statistik |

---

## 3. Solusi yang Ditawarkan

Kami mengembangkan aplikasi berbasis web (Web App) dengan kemampuan **Progressive Web App (PWA)**, yang memungkinkan aplikasi diakses melalui browser namun memiliki performa dan tampilan layaknya aplikasi native di Android/iOS.

### 3.1 Keunggulan Utama

- **Mobile First Design**: Tampilan antarmuka yang optimal untuk layar smartphone/tablet.
- **Real-time Calculation**: Harga terhitung otomatis setiap kali topping dipilih/dihapus.
- **Tanpa Instalasi Rumit**: Berbasis web, tidak perlu download lewat App Store/Play Store.
- **Hemat Biaya Hardware**: Bisa dijalankan di perangkat tablet/smartphone Android biasa.
- **Integrasi CRM**: Sistem membership dan feedback untuk meningkatkan loyalitas pelanggan.

---

## 4. Fitur Aplikasi

### 📱 Modul Pelanggan (Customer App)

#### 4.1 Fitur Pemesanan

1.  **Kustomisasi Pesanan Lengkap**:
    - Pilihan Level Pedas (1-5).
    - Pilihan Jenis Kuah & Rasa (Kencur/Bawang).
    - Seleksi Topping interaktif dengan harga dinamis.
2.  **Keranjang Belanja Pintar**: Ringkasan pesanan sebelum checkout.
3.  **Struk Digital**:
    - Generate struk pesanan otomatis.
    - Fitur "Simpan Struk" sebagai gambar.
    - **Status Pesanan Real-time** (Menunggu → Diproses → Siap).

#### 4.2 Fitur Member (CRM)

1.  **Login Member**: Autentikasi sederhana dengan nama + nomor HP.
2.  **Profil Member**: Menampilkan statistik pribadi (total belanja, jumlah order).
3.  **Sistem Membership**:
    - 🥉 **Bronze** - Level awal
    - 🥈 **Silver** - Member aktif
    - 🥇 **Gold** - Pelanggan setia
4.  **Riwayat Pesanan**: Melihat semua pesanan yang pernah dilakukan.
5.  **Kirim Feedback**: Rating bintang (1-5) dan komentar untuk perbaikan layanan.

---

### 🛡️ Modul Admin (Dashboard Pemilik)

#### 4.3 Manajemen Operasional

1.  **Dashboard Real-time**: Memantau ringkasan order masuk hari ini.
2.  **Manajemen Pesanan**: Update status pesanan (Pending → Preparing → Ready → Completed).
3.  **Notifikasi Pesanan**: Suara notifikasi saat ada pesanan baru.

#### 4.4 Laporan & Statistik

1.  **Laporan Pendapatan**:
    - Grafik tren pendapatan harian.
    - Pemisahan metode pembayaran (Tunai/Transfer).
2.  **Statistik Produk**: Analisa topping paling laris (Best Seller).
3.  **Export Laporan**: Unduh laporan keuangan.

#### 4.5 CRM Admin

1.  **Manajemen Pelanggan**:
    - Daftar semua member terdaftar.
    - Pencarian & filter berdasarkan membership.
    - Edit data pelanggan.
2.  **Detail Pelanggan**:
    - Profil lengkap member.
    - Riwayat transaksi per pelanggan.
    - Catatan internal admin.
3.  **Feedback Dashboard**:
    - Melihat semua feedback dari member.
    - Statistik rating rata-rata.
    - Filter berdasarkan rating.

---

## 5. Spesifikasi Teknis

Sistem dibangun menggunakan teknologi industri terkini untuk menjamin kecepatan, keamanan, dan skalabilitas:

| Komponen               | Teknologi               | Keterangan                               |
| :--------------------- | :---------------------- | :--------------------------------------- |
| **Frontend Framework** | Next.js 16 (App Router) | Performa tinggi & SEO friendly.          |
| **Styling**            | Tailwind CSS v4         | Desain modern & responsif.               |
| **Database**           | PostgreSQL              | Penyimpanan data yang aman & relasional. |
| **ORM**                | Prisma                  | Manajemen data yang efisien.             |
| **PWA Engine**         | next-pwa                | Kapabilitas offline & installable.       |
| **State Management**   | Zustand                 | Manajemen state ringan & persist.        |
| **Cloud Hosting**      | Vercel + Supabase       | Infrastruktur serverless global.         |

### 5.1 Skema Database CRM

```
┌─────────────────┐       ┌─────────────────┐
│    Customer     │───────│      Order      │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ name            │       │ customerId (FK) │
│ phone (unique)  │       │ queueNumber     │
│ email           │       │ totalPrice      │
│ membership      │       │ status          │
│ totalSpent      │       └─────────────────┘
│ orderCount      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───┴───┐ ┌───┴───┐
│ Note  │ │Feedback│
└───────┘ └───────┘
```

---

## 6. Manfaat Implementasi

Implementasi sistem ini akan memberikan dampak positif langsung:

### 6.1 Manfaat Operasional

1.  **Efisiensi Waktu**: Memangkas waktu pemesanan per pelanggan hingga 50%.
2.  **Akurasi Keuangan**: Menghilangkan selisih perhitungan harga manual.
3.  **Profesionalisme**: Meningkatkan citra usaha menjadi lebih modern dan higienis (paperless).

### 6.2 Manfaat CRM

1.  **Loyalitas Pelanggan**: Sistem membership mendorong pelanggan untuk kembali.
2.  **Personalisasi**: Data pelanggan memungkinkan layanan yang lebih personal.
3.  **Feedback Loop**: Masukan pelanggan membantu perbaikan berkelanjutan.
4.  **Data Driven**: Keputusan bisnis berdasarkan statistik rill.

---

## 7. Penutup

Aplikasi **POS-CRM Seblak Teh Imas** ini telah selesai dikembangkan dan berada dalam status **Production Ready**. Dengan fitur yang lengkap mulai dari pemesanan mandiri, sistem membership, hingga pelaporan manajerial, sistem ini siap menjadi tulang punggung operasional digital Seblak Teh Imas.

### Fitur Utama:

- ✅ Point of Sale dengan kustomisasi lengkap
- ✅ Progressive Web App (installable)
- ✅ Dashboard Admin real-time
- ✅ Laporan Revenue & Statistik
- ✅ **Sistem Membership Bronze/Silver/Gold**
- ✅ **Login Member sederhana (nama + HP)**
- ✅ **Profil Member dengan statistik**
- ✅ **Status Pesanan Real-time**
- ✅ **Sistem Feedback dari Member**

Kami merekomendasikan untuk segera melakukan tahap deployment agar manfaat dari efisiensi sistem ini dapat segera dirasakan.

---

_Dokumen ini terakhir diperbarui: 19 Januari 2026_

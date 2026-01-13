# Proposal Pengembangan Sistem POS Digital "Seblak Teh Imas"

**Tanggal:** 13 Januari 2026  
**Status:** Siap Produksi (Production Ready)  
**Disiapkan Oleh:** Tim Pengembang (Antigravity Agent)

---

## 1. Pendahuluan

### 1.1 Latar Belakang
Usaha kuliner "Seblak Teh Imas" saat ini menghadapi tantangan dalam operasional harian, terutama pada proses pencatatan pesanan yang masih manual (kertas). Metode konvensional ini memiliki beberapa kelemahan:
*   Risiko kesalahan perhitungan total harga, terutama dengan variasi topping yang beragam.
*   Antrian yang menumpuk karena proses pencatatan yang lama.
*   Kesulitan dalam merekap pendapatan harian secara akurat.
*   Pemborosan kertas nota/struk.

### 1.2 Tujuan
Proposal ini menawarkan solusi berupa pengembangan **Aplikasi Point of Sales (POS) Modern Berbasis Web** yang dirancang khusus untuk kebutuhan Seblak Teh Imas. Aplikasi ini bertujuan untuk mendigitalisasi seluruh proses pemesanan, pembayaran, hingga pelaporan keuangan guna meningkatkan efisiensi dan pengalaman pelanggan.

---

## 2. Solusi yang Ditawarkan

Kami mengembangkan aplikasi berbasis web (Web App) dengan kemampuan **Progressive Web App (PWA)**, yang memungkinkan aplikasi diakses melalui browser namun memiliki performa dan tampilan layaknya aplikasi native di Android/iOS. Konsep utama adalah "Self-Service", di mana pelanggan dapat memilih pesanan mereka sendiri melalui perangkat tablet/smartphone yang disediakan.

### 2.1 Keunggulan Utama
*   **Mobile First Design**: Tampilan antarmuka yang optimal untuk layar smartphone/tablet.
*   **Real-time Calculation**: Harga terhitung otomatis setiap kali topping dipilih/dihapus.
*   **Tanpa Instalasi Rumit**: Berbasis web, tidak perlu download lewat App Store/Play Store.
*   **Hemat Biaya Hardware**: Bisa dijalankan di perangkat tablet/smartphone Android biasa.

---

## 3. Fitur Aplikasi

### 📱 Modul Pelanggan (Customer App)
1.  **Kustomisasi Pesanan Lengkap**:
    *   Pilihan Level Pedas (1-5).
    *   Pilihan Jenis Kuah & Rasa (Kencur/Bawang).
    *   Seleksi Topping interaktif dengan harga dinamis.
2.  **Keranjang Belanja Pintar**: Ringkasan pesanan sebelum checkout.
3.  **Identitas Pemesan**: Input nama pelanggan untuk antrian.
4.  **Struk Digital**:
    *   Generate struk pesanan otomatis.
    *   Fitur "Simpan Struk" sebagai gambar (untuk bukti pembayaran/antrian).

### 🛡️ Modul Admin (Dashboard Pemilik)
1.  **Dashboard Real-time**: Memantau ringkasan order masuk hari ini.
2.  **Laporan Pendapatan**:
    *   Grafik tren pendapatan harian.
    *   Pemisahan metode pembayaran (Tunai/Transfer).
3.  **Statistik Produk**: Analisa topping paling laris (Best Seller).
4.  **Export Laporan**: Unduh laporan keuangan harian dalam format PDF siap cetak.
5.  **Manajemen Pesanan**: Melihat detail pesanan yang masuk secara real-time.

---

## 4. Spesifikasi Teknis

Sistem dibangun menggunakan teknologi industri terkini untuk menjamin kecepatan, keamanan, dan skalabilitas:

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router) | Performa tinggi & SEO friendly. |
| **Styling** | Tailwind CSS v4 | Desain modern & responsif. |
| **Database** | PostgreSQL | Penyimpanan data yang aman & relasional. |
| **ORM** | Prisma | Manajemen data yang efisien. |
| **PWA Engine** | next-pwa | Kapabilitas offline & installable. |
| **Cloud Hosting** | Vercel (Recommended) | Infrastruktur serverless global. |

---

## 5. Manfaat Implementasi

Implementasi sistem ini akan memberikan dampak positif langsung:

1.  **Efisiensi Waktu**: Memangkas waktu pemesanan per pelanggan hingga 50%.
2.  **Akurasi Keuangan**: Menghilangkan selisih perhitungan harga manual.
3.  **Profesionalisme**: Meningkatkan citra usaha "Seblak Teh Imas" menjadi lebih modern dan higienis (paperless).
4.  **Data Driven**: Pemilik dapat mengambil keputusan bisnis (seperti stok topping) berdasarkan data statistik rill.

---

## 6. Penutup

Aplikasi POS Seblak Teh Imas ini telah selesai dikembangkan dan berada dalam status **Production Ready**. Dengan fitur yang lengkap mulai dari pemesanan mandiri hingga pelaporan manajerial, sistem ini siap menjadi tulang punggung operasional digital Seblak Teh Imas.

Kami merekomendasikan untuk segera melakukan tahap deployment agar manfaat dari efisiensi sistem ini dapat segera dirasakan.

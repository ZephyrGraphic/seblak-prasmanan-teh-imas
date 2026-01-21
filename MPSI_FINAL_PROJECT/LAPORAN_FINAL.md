# LAPORAN FINAL PROJECT

## MANAJEMEN PROYEK SISTEM INFORMASI (MPSI)

---

<div align="center">

# LAPORAN FINAL PROJECT

## MANAJEMEN PROYEK SISTEM INFORMASI (MPSI)

---

# SISTEM INFORMASI POS-CRM UMKM

### "SEBLAK TEH IMAS"

---

**Disusun oleh:**

| No  | Nama                             |  NIM  | Peran               |
| :-: | -------------------------------- | :---: | ------------------- |
|  1  | M. Z. HAIKAL HAMDANI             | [NIM] | Project Manager     |
|  2  | LUTPANDEA PUTRA SUTRIYANA        | [NIM] | Project Planner     |
|  3  | ETHELDREDA MARIA HERVEM PITA WEA | [NIM] | Cost & Risk Analyst |

---

**Program Studi Sistem Informasi**  
**Fakultas Teknik, Komputer dan Desain**  
**Universitas Nusa Putra**  
**Tahun Akademik 2025/2026**

</div>

---

# KATA PENGANTAR

Puji syukur kami panjatkan kepada Tuhan Yang Maha Esa atas berkat dan rahmat-Nya sehingga laporan Final Project mata kuliah Manajemen Proyek Sistem Informasi (MPSI) ini dapat diselesaikan dengan baik.

Laporan ini disusun sebagai pemenuhan tugas akhir mata kuliah MPSI dengan tujuan untuk menerapkan konsep-konsep manajemen proyek secara end-to-end pada studi kasus nyata, yaitu **Pengembangan Sistem Informasi POS-CRM untuk UMKM "Seblak Teh Imas"**.

Proyek ini mencakup seluruh fase manajemen proyek mulai dari inisiasi, perencanaan, penjadwalan, hingga manajemen risiko. Kami menggunakan pendekatan sistematis dengan menerapkan berbagai tools dan teknik seperti Project Charter, Work Breakdown Structure (WBS), Network Diagram, Critical Path Method (CPM), Gantt Chart, dan Risk Management.

Kami menyadari bahwa laporan ini masih jauh dari sempurna. Oleh karena itu, kritik dan saran yang membangun sangat kami harapkan untuk perbaikan di masa mendatang.

**Sukabumi, Januari 2026**

**Tim Penyusun**

---

# DAFTAR ISI

- [KATA PENGANTAR](#kata-pengantar)
- [BAB I PENDAHULUAN](#bab-i-pendahuluan)
- [BAB II TINJAUAN KONSEP](#bab-ii-tinjauan-konsep)
- [BAB III INISIASI & PERENCANAAN](#bab-iii-inisiasi--perencanaan)
- [BAB IV PENJADWALAN PROYEK](#bab-iv-penjadwalan-proyek)
- [BAB V ESTIMASI & MANAJEMEN RISIKO](#bab-v-estimasi--manajemen-risiko)
- [BAB VI ANALISIS KRITIS](#bab-vi-analisis-kritis)
- [BAB VII PENUTUP](#bab-vii-penutup)
- [DAFTAR PUSTAKA](#daftar-pustaka)
- [LAMPIRAN](#lampiran)

---

# BAB I PENDAHULUAN

## 1.1 Latar Belakang

Usaha kuliner "Seblak Teh Imas" adalah salah satu UMKM yang bergerak di bidang makanan dengan produk utama seblak dengan berbagai varian topping. Saat ini, operasional bisnis masih menggunakan metode konvensional yang menimbulkan berbagai permasalahan:

| Aspek                  | Kondisi Saat Ini               | Permasalahan                             |
| ---------------------- | ------------------------------ | ---------------------------------------- |
| **Pencatatan Pesanan** | Menggunakan kertas/nota manual | Risiko kesalahan tulis, nota hilang      |
| **Perhitungan Harga**  | Kalkulator manual              | Kesalahan hitung saat topping bervariasi |
| **Antrian Pesanan**    | Verbal/ingatan                 | Pesanan tertukar, waktu tunggu lama      |
| **Rekap Keuangan**     | Buku kas manual                | Akurasi rendah, rekap memakan waktu      |
| **Data Pelanggan**     | Tidak ada                      | Tidak dapat membangun loyalitas customer |

Berdasarkan kondisi tersebut, diperlukan solusi teknologi berupa **Sistem Informasi Point of Sales dengan integrasi Customer Relationship Management (POS-CRM) berbasis Web** untuk mendigitalisasi operasional bisnis dan membangun hubungan jangka panjang dengan pelanggan.

## 1.2 Rumusan Masalah

Berdasarkan latar belakang di atas, rumusan masalah dalam proyek ini adalah:

1. Bagaimana merancang dan merencanakan proyek pengembangan sistem POS-CRM secara sistematis?
2. Bagaimana menyusun penjadwalan proyek menggunakan WBS, Network Diagram, dan Gantt Chart?
3. Bagaimana mengidentifikasi dan mengelola risiko proyek secara proaktif?
4. Bagaimana menganalisis dampak keterlambatan pada jalur kritis dan solusi manajerialnya?

## 1.3 Tujuan Proyek

### Tujuan Umum

Mengembangkan Sistem Informasi POS-CRM berbasis Web yang dapat mendigitalisasi seluruh proses operasional "Seblak Teh Imas" dari pemesanan hingga pelaporan.

### Tujuan Khusus (SMART Goals)

| No  | Tujuan                              | Indikator               | Target              |
| --- | ----------------------------------- | ----------------------- | ------------------- |
| 1   | Mendigitalisasi proses pemesanan    | Waktu input pesanan     | < 2 menit/transaksi |
| 2   | Menghilangkan kesalahan perhitungan | Akurasi harga           | 100%                |
| 3   | Mempercepat proses antrian          | Throughput pelanggan    | +50%                |
| 4   | Membangun database pelanggan        | Jumlah member terdaftar | > 100 dalam 3 bulan |
| 5   | Menyediakan laporan real-time       | Ketersediaan dashboard  | 24/7                |

## 1.4 Ruang Lingkup

### In-Scope (Termasuk dalam Proyek)

| Modul                   | Fitur                                                                      |
| ----------------------- | -------------------------------------------------------------------------- |
| **Point of Sale (POS)** | Pemesanan digital, kustomisasi pesanan, struk digital, manajemen antrian   |
| **CRM**                 | Registrasi member, sistem membership tier, riwayat pesanan, feedback       |
| **Dashboard Admin**     | Dashboard real-time, manajemen pesanan, laporan pendapatan, data pelanggan |
| **Infrastruktur**       | Web Application (PWA), Database PostgreSQL, Cloud deployment               |

### Out-of-Scope (Tidak Termasuk)

| Item                                   | Alasan                                         |
| -------------------------------------- | ---------------------------------------------- |
| Integrasi payment gateway (OVO, GoPay) | Kompleksitas tinggi, butuh sertifikasi PCI-DSS |
| Native mobile app (Android/iOS)        | PWA sudah mencukupi kebutuhan                  |
| Multi-outlet management                | Bisnis masih single outlet                     |
| Integrasi akunting (Jurnal, Accurate)  | Tahap pengembangan lanjutan                    |

## 1.5 Manfaat Proyek

### Manfaat Operasional

- **Efisiensi Waktu:** Memangkas waktu pemesanan hingga 50%
- **Akurasi Keuangan:** Menghilangkan selisih perhitungan manual
- **Profesionalisme:** Meningkatkan citra usaha menjadi lebih modern

### Manfaat Bisnis

- **Customer Loyalty:** Sistem membership mendorong pelanggan kembali
- **Data-Driven Decision:** Keputusan bisnis berdasarkan statistik riil
- **Competitive Advantage:** Unggul dari kompetitor yang masih manual

---

# BAB II TINJAUAN KONSEP

## 2.1 Konsep Struktur Organisasi Proyek

### 2.1.1 Definisi Struktur Organisasi Proyek

Struktur organisasi proyek adalah kerangka kerja yang mendefinisikan hubungan, peran, dan tanggung jawab antar anggota tim dalam menjalankan proyek. Menurut PMBOK (Project Management Body of Knowledge), struktur organisasi yang tepat sangat penting untuk keberhasilan proyek karena:

1. **Kejelasan Peran:** Setiap anggota memahami tanggung jawabnya
2. **Alur Komunikasi:** Jalur pelaporan dan koordinasi yang jelas
3. **Pengambilan Keputusan:** Otoritas yang terdefinisi dengan baik
4. **Akuntabilitas:** Setiap deliverable memiliki penanggung jawab

### 2.1.2 Jenis Struktur Organisasi

| Jenis           | Karakteristik          | Kelebihan                  | Kekurangan                    |
| --------------- | ---------------------- | -------------------------- | ----------------------------- |
| **Fungsional**  | Berdasarkan departemen | Spesialisasi tinggi        | Koordinasi antar fungsi sulit |
| **Projectized** | Fokus pada proyek      | PM memiliki otoritas penuh | Duplikasi resources           |
| **Matrix**      | Kombinasi keduanya     | Fleksibel                  | Dual reporting                |

### 2.1.3 Struktur Organisasi Proyek POS-CRM

Proyek ini menggunakan struktur **Projectized** dengan karakteristik:

```
        ┌─────────────────────────────┐
        │      PROJECT SPONSOR        │
        │       (Teh Imas)            │
        │   - Approval & Funding      │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │     PROJECT MANAGER         │
        │  (M. Z. Haikal Hamdani)     │
        │   - Koordinasi & Charter    │
        └──────────────┬──────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼───────┐           ┌─────────▼─────────┐
│ PROJECT       │           │ COST & RISK       │
│ PLANNER       │           │ ANALYST           │
│ (Lutpandea)   │           │ (Etheldreda)      │
│ - WBS, Gantt  │           │ - CBA, Risiko     │
└───────────────┘           └───────────────────┘
```

### 2.1.4 RACI Matrix

| Aktivitas                | Sponsor | PM  | Planner | Analyst |
| ------------------------ | :-----: | :-: | :-----: | :-----: |
| Approval Project Charter |  **A**  |  R  |    C    |    C    |
| Menyusun WBS             |    I    |  A  |  **R**  |    C    |
| Network Diagram          |    I    |  A  |  **R**  |    C    |
| Estimasi Biaya           |    A    |  C  |    C    |  **R**  |
| Manajemen Risiko         |    I    |  A  |    C    |  **R**  |

> **Keterangan:** R = Responsible, A = Accountable, C = Consulted, I = Informed

---

# BAB III INISIASI & PERENCANAAN

## 3.1 Project Charter

### 3.1.1 Informasi Proyek

| Item                | Keterangan                                    |
| ------------------- | --------------------------------------------- |
| **Nama Proyek**     | Pengembangan Sistem POS-CRM "Seblak Teh Imas" |
| **Project Sponsor** | Teh Imas (Pemilik UMKM)                       |
| **Project Manager** | M. Z. Haikal Hamdani                          |
| **Tanggal Mulai**   | 20 Januari 2026                               |
| **Target Selesai**  | 16 April 2026                                 |

### 3.1.2 Stakeholder Analysis

| Stakeholder  | Kategori  | Kepentingan | Pengaruh | Strategi       |
| ------------ | --------- | :---------: | :------: | -------------- |
| Teh Imas     | Internal  |   Tinggi    |  Tinggi  | Manage Closely |
| Tim Proyek   | Internal  |   Tinggi    |  Sedang  | Keep Informed  |
| Pelanggan    | Eksternal |   Tinggi    |  Rendah  | Keep Satisfied |
| Vendor Cloud | Eksternal |   Rendah    |  Rendah  | Monitor        |

### 3.1.3 Etika & Profesionalisme

| Prinsip            | Implementasi                           |
| ------------------ | -------------------------------------- |
| **Integritas**     | Transparan dalam pelaporan progress    |
| **Tanggung Jawab** | Setiap task memiliki PIC yang jelas    |
| **Kerahasiaan**    | Data bisnis dilindungi dengan NDA      |
| **Kualitas**       | Code review dan testing di setiap fase |

## 3.2 Struktur Organisasi Proyek

_(Lihat BAB II Tinjauan Konsep)_

## 3.3 Perencanaan Sumber Daya Manusia (SDM)

### 3.3.1 Kebutuhan SDM

| No  | Peran               | Jumlah | Jam Kerja/Minggu |  Total Jam  |
| --- | ------------------- | :----: | :--------------: | :---------: |
| 1   | Project Manager     |   1    |        10        |     100     |
| 2   | Project Planner     |   1    |        15        |     150     |
| 3   | Cost & Risk Analyst |   1    |        12        |     120     |
| 4   | UI/UX Designer      |   1    |        20        |     60      |
| 5   | Frontend Developer  |   1    |        35        |     210     |
| 6   | Backend Developer   |   1    |        35        |     210     |
| 7   | QA Tester           |   1    |        15        |     45      |
|     | **TOTAL**           | **7**  |                  | **895 jam** |

### 3.3.2 Resource Loading

```
Minggu    : W1  W2  W3  W4  W5  W6  W7  W8  W9  W10
═══════════════════════════════════════════════════
PM        : ███ ██░ ██░ ██░ ██░ ██░ ██░ ██░ ██░ ███
Planner   : ███ ███ ███ ██░ ██░ ██░ ██░ ██░ ███ ███
Analyst   : ██░ ███ ███ ██░ ██░ ██░ ██░ ██░ ██░ ███
Frontend  : ░░░ ░░░ ██░ ███ ███ ███ ███ ███ ██░ ░░░
Backend   : ░░░ ░░░ ██░ ███ ███ ███ ███ ███ ██░ ░░░
═══════════════════════════════════════════════════
```

## 3.4 Perencanaan Biaya

### 3.4.1 Estimasi Biaya

| Kategori          | Item                                  |            Jumlah |
| ----------------- | ------------------------------------- | ----------------: |
| **SDM**           | Project Manager (100 jam × Rp 50.000) |      Rp 5.000.000 |
|                   | Project Planner (150 jam × Rp 40.000) |      Rp 6.000.000 |
|                   | Cost Analyst (120 jam × Rp 40.000)    |      Rp 4.800.000 |
|                   | UI/UX Designer (60 jam × Rp 75.000)   |      Rp 4.500.000 |
|                   | Frontend Dev (210 jam × Rp 80.000)    |     Rp 16.800.000 |
|                   | Backend Dev (210 jam × Rp 80.000)     |     Rp 16.800.000 |
|                   | QA Tester (45 jam × Rp 50.000)        |      Rp 2.250.000 |
| **Subtotal SDM**  |                                       | **Rp 56.150.000** |
| **Infrastruktur** | Domain, Hosting, Hardware             |      Rp 4.675.000 |
| **Indirect**      | Overhead, komunikasi                  |      Rp 1.250.000 |
| **Reserve**       | Contingency + Management (10%)        |      Rp 6.207.500 |
| **TOTAL**         |                                       | **Rp 68.282.500** |

### 3.4.2 Cost-Benefit Analysis

| Manfaat                           |      Nilai/Bulan |
| --------------------------------- | ---------------: |
| Eliminasi kesalahan hitung        |       Rp 500.000 |
| Efisiensi kertas                  |        Rp 75.000 |
| Revenue increase (+30 order/hari) |     Rp 3.000.000 |
| **Total Manfaat/Bulan**           | **Rp 3.575.000** |

**ROI Analysis:**

- Break-Even Point: **18.4 bulan**
- ROI Tahun ke-3: **+168%**
- **Rekomendasi: LAYAK DILAKSANAKAN** ✅

## 3.5 Perencanaan Kualitas

| Aspek       | Standar                  | Target    |
| ----------- | ------------------------ | --------- |
| Reliability | Uptime sistem            | 99%       |
| Performance | Page load time           | < 3 detik |
| Usability   | SUS Score                | > 70      |
| Security    | Critical vulnerabilities | 0         |

---

# BAB IV PENJADWALAN PROYEK

## 4.1 Work Breakdown Structure (WBS)

### 4.1.1 WBS Hierarchical

```
1.0 POS-CRM Seblak Teh Imas (63 hari)
│
├── 1.1 Inisiasi (8 hari)
│   ├── 1.1.1 Requirement Gathering (5 hari)
│   └── 1.1.2 Feasibility Study (3 hari)
│
├── 1.2 Perencanaan (15 hari)
│   ├── 1.2.1 System Design (5 hari)
│   ├── 1.2.2 UI/UX Design (7 hari)
│   └── 1.2.3 Database Design (3 hari)
│
├── 1.3 Pengembangan (40 hari)
│   ├── 1.3.1 Modul POS
│   │   ├── 1.3.1.1 Frontend POS (12 hari)
│   │   └── 1.3.1.2 Backend POS (10 hari)
│   ├── 1.3.2 Modul CRM
│   │   ├── 1.3.2.1 Frontend CRM (8 hari)
│   │   └── 1.3.2.2 Backend CRM (7 hari)
│   ├── 1.3.3 Admin Dashboard (10 hari)
│   └── 1.3.4 Integration & PWA (5 hari)
│
├── 1.4 Pengujian (16 hari)
│   ├── 1.4.1 Unit Testing (4 hari)
│   ├── 1.4.2 Integration Testing (4 hari)
│   ├── 1.4.3 UAT (5 hari)
│   └── 1.4.4 Bug Fixing (3 hari)
│
└── 1.5 Deployment (6 hari)
    ├── 1.5.1 Production Deploy (2 hari)
    ├── 1.5.2 Training (3 hari)
    └── 1.5.3 Go-Live & Handover (1 hari)
```

## 4.2 Daftar Aktivitas & Network Diagram

### 4.2.1 Daftar Aktivitas

| ID  | Aktivitas             | Durasi  | Predecessor |
| --- | --------------------- | :-----: | ----------- |
| A   | Requirement Gathering | 5 hari  | -           |
| B   | Feasibility Study     | 3 hari  | A           |
| C   | System Design         | 5 hari  | B           |
| D   | UI/UX Design          | 7 hari  | B           |
| E   | Database Setup        | 3 hari  | C           |
| F   | Frontend POS          | 12 hari | D, E        |
| G   | Backend POS           | 10 hari | E           |
| H   | Frontend CRM          | 8 hari  | F           |
| I   | Backend CRM           | 7 hari  | G           |
| J   | Admin Dashboard       | 10 hari | G           |
| K   | Integration           | 5 hari  | H, I, J     |
| L   | Unit Testing          | 4 hari  | K           |
| M   | Integration Testing   | 4 hari  | L           |
| N   | UAT                   | 5 hari  | M           |
| O   | Bug Fixing            | 3 hari  | N           |
| P   | Deployment            | 2 hari  | O           |
| Q   | Training              | 3 hari  | P           |
| R   | Go-Live               | 1 hari  | Q           |

### 4.2.2 Network Diagram (AON)

```
     ┌───┐    ┌───┐    ┌───┐    ┌───┐
     │ A │───►│ B │───►│ C │───►│ E │─────────┐
     │ 5 │    │ 3 │    │ 5 │    │ 3 │         │
     └───┘    └─┬─┘    └───┘    └───┘         │
               │                   │           │
               ▼                   ▼           ▼
            ┌───┐              ┌────┐       ┌───┐
            │ D │─────────────►│ F  │──────►│ H │────┐
            │ 7 │              │ 12 │       │ 8 │    │
            └───┘              └────┘       └───┘    │
                                   │                  │
                                   ▼                  ▼
                               ┌────┐            ┌───┐
                               │ G  │───────────►│ K │───► L → M → N → O → P → Q → R
                               │ 10 │            │ 5 │
                               └────┘            └───┘

🔴 Node merah = Jalur Kritis
```

## 4.3 Jalur Kritis (Critical Path)

### 4.3.1 Perhitungan ES, EF, LS, LF

| ID  |  ES |  EF |  LS |  LF | Float | Critical? |
| --- | --: | --: | --: | --: | :---: | :-------: |
| A   |   0 |   5 |   0 |   5 |   0   |    ✅     |
| B   |   5 |   8 |   5 |   8 |   0   |    ✅     |
| C   |   8 |  13 |   8 |  13 |   0   |    ✅     |
| D   |   8 |  15 |   9 |  16 |   1   |    ❌     |
| E   |  13 |  16 |  13 |  16 |   0   |    ✅     |
| F   |  16 |  28 |  16 |  28 |   0   |    ✅     |
| G   |  16 |  26 |  16 |  26 |   0   |    ✅     |
| H   |  28 |  36 |  28 |  36 |   0   |    ✅     |
| I   |  26 |  33 |  29 |  36 |   3   |    ❌     |
| J   |  26 |  36 |  26 |  36 |   0   |    ✅     |
| K-R | ... | ... | ... | ... |   0   |    ✅     |

### 4.3.2 Identifikasi Critical Path

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         CRITICAL PATH                                     │
├──────────────────────────────────────────────────────────────────────────┤
│  A → B → C → E → F → H → K → L → M → N → O → P → Q → R                  │
│                                                                           │
│  Total Durasi: 63 hari kerja (~12.6 minggu)                              │
│  Aktivitas Kritis: 16 dari 18 aktivitas                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

## 4.4 Gantt Chart

### 4.4.1 Gantt Chart Manual

```
Jan 2026        Feb 2026        Mar 2026        Apr 2026
W1  W2  W3  W4  W5  W6  W7  W8  W9  W10 W11 W12 W13
├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤

▓▓▓▓▓                              Requirement
     ▓▓▓                           Feasibility
        ▓▓▓▓▓                      System Design
        ████████                   UI/UX Design
             ▓▓▓                   Database
                ▓▓▓▓▓▓▓▓▓▓▓▓       Frontend POS
                ██████████         Backend POS
                            ▓▓▓▓▓▓▓▓ Frontend CRM
                                    ▓▓▓▓▓ Integration
                                         ▓▓▓▓▓▓▓▓ Testing
                                                 ▓▓▓ Deploy

▓ = Critical Path | █ = Non-Critical
```

### 4.4.2 Timeline Detail

| WBS   | Aktivitas     | Start  | End    | Durasi |
| ----- | ------------- | ------ | ------ | :----: |
| 1.1.1 | Requirement   | 20 Jan | 24 Jan |   5    |
| 1.1.2 | Feasibility   | 27 Jan | 29 Jan |   3    |
| 1.2.1 | System Design | 30 Jan | 5 Feb  |   5    |
| 1.2.2 | UI/UX Design  | 30 Jan | 7 Feb  |   7    |
| ...   | ...           | ...    | ...    |  ...   |
| 1.5.3 | Go-Live       | 16 Apr | 16 Apr |   1    |

---

# BAB V ESTIMASI & MANAJEMEN RISIKO

## 5.1 Estimasi Waktu

### 5.1.1 Metode PERT

| Task         | Optimistic | Most Likely | Pessimistic | Expected  |
| ------------ | :--------: | :---------: | :---------: | :-------: |
| Requirement  |   3 hari   |   5 hari    |   8 hari    | 5.2 hari  |
| Frontend POS |   9 hari   |   12 hari   |   18 hari   | 12.5 hari |
| Integration  |   3 hari   |   5 hari    |   9 hari    | 5.3 hari  |

### 5.1.2 Ringkasan Durasi

| Parameter            | Nilai            |
| -------------------- | ---------------- |
| Durasi Baseline      | 63 hari kerja    |
| Durasi dengan Buffer | 70 hari kerja    |
| Dalam Minggu         | 12.6 - 14 minggu |
| Start Date           | 20 Januari 2026  |
| Target End Date      | 16 April 2026    |

## 5.2 Estimasi Biaya

_(Lihat BAB III Perencanaan Biaya)_

**Total Budget: Rp 68.282.500**

## 5.3 Identifikasi Risiko

| ID  | Risiko                 | Prob | Impact | Score  | Priority  |
| --- | ---------------------- | :--: | :----: | :----: | :-------: |
| R1  | Scope Creep            | 60%  |   4    | **16** |  🔴 HIGH  |
| R2  | Technical Debt         | 50%  |   3    |   9    | 🟡 MEDIUM |
| R3  | Key Person Unavailable | 25%  |   4    |   8    | 🟡 MEDIUM |
| R4  | Integration Failure    | 40%  |   4    | **12** |  🔴 HIGH  |
| R5  | Third-party Dependency | 20%  |   3    |   6    |  🟢 LOW   |
| R6  | Low User Adoption      | 55%  |   4    | **16** |  🔴 HIGH  |
| R7  | Schedule Slippage      | 60%  |   3    | **12** |  🔴 HIGH  |
| R8  | Critical Bug           | 40%  |   5    | **15** |  🔴 HIGH  |
| R9  | Data Breach            | 10%  |   5    |   5    |  🟢 LOW   |
| R10 | Poor Communication     | 40%  |   3    |   9    | 🟡 MEDIUM |

## 5.4 Strategi Mitigasi

| ID  | Risk         | Strategy | Prevention          | Contingency        |
| --- | ------------ | -------- | ------------------- | ------------------ |
| R1  | Scope Creep  | Avoid    | CCB, Scope freeze   | Phase 2 list       |
| R6  | Low Adoption | Mitigate | User involvement    | Extended training  |
| R8  | Critical Bug | Mitigate | Multi-layer testing | Rollback procedure |
| R4  | Integration  | Mitigate | API contract        | 3-day buffer       |
| R7  | Schedule     | Mitigate | Daily tracking      | 7-day buffer       |

---

# BAB VI ANALISIS KRITIS

## 6.1 Analisis Skenario Anggaran

### 6.1.1 Perbandingan Skenario

| Kriteria   | Skenario A (Terbatas) | Skenario B (Ideal) |
| ---------- | :-------------------: | :----------------: |
| Budget     |      Rp 15 juta       |     Rp 65 juta     |
| Fitur      |          40%          |        100%        |
| Timeline   |       14 minggu       |     10 minggu      |
| CRM        |     ❌ Tidak ada      |     ✅ Lengkap     |
| ROI Year 3 |         +50%          |       +168%        |

### 6.1.2 Rekomendasi

**Skenario B (Anggaran Ideal)** lebih rasional karena:

1. ROI lebih tinggi (168% vs 50%)
2. Competitive advantage dari CRM
3. TCO lebih rendah jika dihitung dengan upgrade di masa depan

## 6.2 Dampak Keterlambatan 3 Hari pada Aktivitas Kritis

### 6.2.1 Skenario: Aktivitas F (Frontend POS) Delay 3 Hari

| Aspek           | Sebelum  | Sesudah Delay |
| --------------- | -------- | ------------- |
| Total Durasi    | 63 hari  | 66 hari       |
| Target Selesai  | 16 April | 19 April      |
| Budget Tambahan | -        | +Rp 2.100.000 |

### 6.2.2 Opsi Solusi Manajerial

| Opsi                 | Strategi                  | Biaya        | Hasil            |
| -------------------- | ------------------------- | ------------ | ---------------- |
| **1. Crashing**      | Tambah resource di H & K  | Rp 5.36 juta | Recover 5 hari   |
| **2. Fast-Tracking** | Parallel H dengan F (75%) | Rp 0         | Recover 2-3 hari |
| **3. Scope Cut**     | Hapus fitur non-esensial  | Rp 0         | Recover 3 hari   |
| **4. Negotiation**   | Negosiasi deadline        | Rp 0         | Deadline baru    |

**Rekomendasi:** Opsi 1 (Crashing) jika budget tersedia, Opsi 3 (Scope Cut) jika budget terbatas.

## 6.3 Refleksi Penggunaan AI dalam Proyek

### 6.3.1 Peran AI dalam Penyusunan Dokumentasi

Dalam penyusunan dokumentasi proyek ini, kami menggunakan bantuan AI (Antigravity Agent) dengan peran sebagai berikut:

| Aspek            | Peran AI           | Peran Manusia         |
| ---------------- | ------------------ | --------------------- |
| Struktur Dokumen | Generate template  | Validasi & customize  |
| Perhitungan CPM  | Assist calculation | Verify accuracy       |
| Estimasi Biaya   | Provide benchmark  | Adjust to context     |
| Analisis Risiko  | Suggest risk items | Prioritize & validate |
| Visualization    | Generate diagrams  | Review & refine       |

### 6.3.2 Lesson Learned

1. **AI sebagai Akselerator:** AI membantu mempercepat pembuatan dokumen, bukan menggantikan pemikiran kritis
2. **Validasi Tetap Diperlukan:** Output AI perlu divalidasi dengan konteks proyek sebenarnya
3. **Customization:** Template dari AI perlu disesuaikan dengan kebutuhan spesifik
4. **Critical Thinking:** Analisis kritis tetap harus dilakukan oleh tim manusia

### 6.3.3 Risiko Penggunaan AI yang Sering Diabaikan

| Risiko          | Dampak                 | Mitigasi                          |
| --------------- | ---------------------- | --------------------------------- |
| Over-reliance   | Kurang memahami materi | Pelajari konsep, bukan hanya copy |
| Generic output  | Tidak sesuai konteks   | Customize setiap output           |
| Accuracy issues | Data salah             | Verify setiap angka dan fakta     |

---

# BAB VII PENUTUP

## 7.1 Kesimpulan

Berdasarkan analisis dan perencanaan yang telah dilakukan, dapat disimpulkan:

1. **Proyek Layak Dilaksanakan**
   - ROI positif (+168% di tahun ke-3)
   - Break-even dalam 18.4 bulan
   - Manfaat operasional dan bisnis yang signifikan

2. **Perencanaan Sistematis**
   - WBS tersusun dalam 4 level dengan 18 work packages
   - Critical path teridentifikasi (63 hari, 16 aktivitas kritis)
   - Network diagram dan Gantt chart memudahkan monitoring

3. **Risiko Terkelola**
   - 10 risiko teridentifikasi dengan strategi mitigasi
   - Budget reserve 10% untuk penanganan risiko
   - Risiko tertinggi: Scope Creep dan User Adoption

4. **Manajemen Proyek Kunci Keberhasilan**
   - Tanpa manajemen proyek, 70% proyek SI gagal
   - Critical points di setiap fase harus diperhatikan

## 7.2 Saran

1. **Untuk Pelaksanaan Proyek:**
   - Lakukan kick-off meeting dengan semua stakeholder
   - Prototype sebelum development untuk validasi requirement
   - Training user minimal 1 minggu sebelum go-live

2. **Untuk Pengembangan Lanjutan:**
   - Integrasi payment gateway di Phase 2
   - Multi-outlet management jika bisnis ekspansi
   - Mobile native app jika traffic meningkat signifikan

3. **Untuk Pembelajaran:**
   - Requirement gathering adalah FONDASI - jangan diabaikan
   - User involvement sejak awal mengurangi resistance
   - Tools membantu akurasi, tapi pemahaman konsep tetap utama

---

# DAFTAR PUSTAKA

1. Project Management Institute. (2021). _A Guide to the Project Management Body of Knowledge (PMBOK® Guide)_ – Seventh Edition. PMI Publications.

2. Schwalbe, K. (2020). _Information Technology Project Management_ (9th Edition). Cengage Learning.

3. Standish Group. (2020). _CHAOS Report 2020: Beyond Infinity_. The Standish Group International.

4. Pressman, R. S., & Maxim, B. R. (2020). _Software Engineering: A Practitioner's Approach_ (9th Edition). McGraw-Hill Education.

5. Sommerville, I. (2016). _Software Engineering_ (10th Edition). Pearson Education.

6. Wysocki, R. K. (2019). _Effective Project Management: Traditional, Agile, Extreme_ (8th Edition). Wiley.

7. Kerzner, H. (2017). _Project Management: A Systems Approach to Planning, Scheduling, and Controlling_ (12th Edition). Wiley.

---

# LAMPIRAN

## Lampiran A: Log Kontribusi Anggota

### A.1 M. Z. Haikal Hamdani (Project Manager)

| No        | Aktivitas                | Deliverable         | Waktu      |
| --------- | ------------------------ | ------------------- | ---------- |
| 1         | Menyusun Project Charter | BAB III Section 3.1 | 4 jam      |
| 2         | Analisis stakeholder     | Stakeholder matrix  | 2 jam      |
| 3         | Koordinasi tim           | Meeting minutes     | 3 jam      |
| 4         | Review dokumen           | Quality check       | 3 jam      |
| 5         | Kompilasi laporan        | Laporan final       | 4 jam      |
| **Total** |                          |                     | **16 jam** |

### A.2 Lutpandea Putra Sutriyana (Project Planner)

| No        | Aktivitas             | Deliverable        | Waktu      |
| --------- | --------------------- | ------------------ | ---------- |
| 1         | Menyusun WBS          | BAB IV Section 4.1 | 3 jam      |
| 2         | Network Diagram       | BAB IV Section 4.2 | 4 jam      |
| 3         | Perhitungan CPM       | BAB IV Section 4.3 | 4 jam      |
| 4         | Gantt Chart           | BAB IV Section 4.4 | 3 jam      |
| 5         | Analisis dampak delay | BAB VI Section 6.2 | 3 jam      |
| **Total** |                       |                    | **17 jam** |

### A.3 Etheldreda Maria Hervem Pita Wea (Cost & Risk Analyst)

| No        | Aktivitas             | Deliverable         | Waktu      |
| --------- | --------------------- | ------------------- | ---------- |
| 1         | Estimasi SDM          | BAB III Section 3.3 | 2 jam      |
| 2         | Cost-Benefit Analysis | BAB III Section 3.4 | 4 jam      |
| 3         | Identifikasi risiko   | BAB V Section 5.3   | 3 jam      |
| 4         | Analisis risiko       | BAB V Section 5.4   | 3 jam      |
| 5         | Skenario anggaran     | BAB VI Section 6.1  | 3 jam      |
| **Total** |                       |                     | **15 jam** |

## Lampiran B: Dokumen Pendukung

- [01_PROJECT_CHARTER.md](./01_PROJECT_CHARTER.md) - Dokumen lengkap Project Charter
- [02_PERENCANAAN_PROYEK.md](./02_PERENCANAAN_PROYEK.md) - Dokumen Perencanaan
- [03_NETWORK_DIAGRAM.md](./03_NETWORK_DIAGRAM.md) - Network Diagram & CPM
- [04_WBS_GANTT.md](./04_WBS_GANTT.md) - WBS & Gantt Chart
- [05_MANAJEMEN_RISIKO.md](./05_MANAJEMEN_RISIKO.md) - Manajemen Risiko

## Lampiran C: File Microsoft Project

_(File .mpp terlampir terpisah)_

---

**Disusun oleh:**  
Tim Kelompok MPSI - Universitas Nusa Putra  
Tahun Akademik 2025/2026

# SLIDE PRESENTASI

## Final Project MPSI - POS-CRM Seblak Teh Imas

---

# 📊 PANDUAN PRESENTASI (15 SLIDE)

## Durasi: 15-20 menit

## Format: PowerPoint / Google Slides / Canva

---

## SLIDE 1: Cover

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    FINAL PROJECT MPSI                           │
│                                                                  │
│      PENGEMBANGAN SISTEM INFORMASI POS-CRM UMKM                │
│              "SEBLAK TEH IMAS"                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    [LOGO KAMPUS]                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Kelompok [X]:                                                  │
│  • M. Z. Haikal Hamdani (Project Manager)                       │
│  • Lutpandea Putra Sutriyana (Project Planner)                 │
│  • Etheldreda Maria Hervem Pita Wea (Cost & Risk Analyst)      │
│                                                                  │
│  [Nama Universitas]                                             │
│  Tahun Akademik 2025/2026                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Perkenalan tim dan pembagian peran
- Sebutkan mata kuliah: Manajemen Proyek Sistem Informasi

---

## SLIDE 2: Tim & Pembagian Tugas

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               👥 TIM & PEMBAGIAN TUGAS                          │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │   👔 PROJECT MANAGER                                       │ │
│  │   M. Z. Haikal Hamdani                                     │ │
│  │   → Project Charter, Scope, Koordinasi                     │ │
│  │                                                            │ │
│  │   📊 PROJECT PLANNER                                       │ │
│  │   Lutpandea Putra Sutriyana                               │ │
│  │   → WBS, Network Diagram, Gantt Chart                     │ │
│  │                                                            │ │
│  │   💰 COST & RISK ANALYST                                   │ │
│  │   Etheldreda Maria Hervem Pita Wea                        │ │
│  │   → Biaya, CBA, Manajemen Risiko                          │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Setiap anggota punya peran berbeda dan terukur
- Tidak ada "numpang nama" - semua berkontribusi

---

## SLIDE 3: Latar Belakang Proyek

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               📋 LATAR BELAKANG MASALAH                         │
│                                                                  │
│  UMKM "Seblak Teh Imas" menghadapi tantangan:                   │
│                                                                  │
│  ❌ Pencatatan manual (kertas)         → Risiko hilang/salah    │
│  ❌ Perhitungan harga manual           → Kesalahan hitung       │
│  ❌ Antrian panjang                    → Customer tidak puas    │
│  ❌ Tidak ada data pelanggan           → Tidak bisa loyalty     │
│  ❌ Rekap keuangan manual              → Memakan waktu          │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  💡 SOLUSI: Sistem POS-CRM Berbasis Web                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Jelaskan kondisi riil UMKM sebelum digitalisasi
- Highlight dampak negatif dari kondisi manual
- Transisi ke solusi yang ditawarkan

---

## SLIDE 4: Tujuan & Stakeholder

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               🎯 TUJUAN & STAKEHOLDER                           │
│                                                                  │
│  TUJUAN PROYEK (SMART):                                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 1. Digitalisasi pemesanan      → < 2 menit/transaksi     │ │
│  │ 2. Akurasi perhitungan         → 100%                    │ │
│  │ 3. Database pelanggan          → 100+ member             │ │
│  │ 4. Laporan real-time           → 24/7                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  STAKEHOLDER:                                                    │
│  ┌────────────────┬──────────────┬────────────────────────┐    │
│  │ Teh Imas       │ Sponsor      │ Decision maker          │    │
│  │ Tim Proyek     │ Executor     │ Development             │    │
│  │ Pelanggan      │ End User     │ System user             │    │
│  └────────────────┴──────────────┴────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Tujuan menggunakan format SMART
- Jelaskan power-interest matrix stakeholder

---

## SLIDE 5: Struktur Organisasi Proyek

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               🏢 STRUKTUR ORGANISASI                            │
│                                                                  │
│                    ┌───────────────┐                            │
│                    │  SPONSOR      │                            │
│                    │  (Teh Imas)   │                            │
│                    └───────┬───────┘                            │
│                            │                                     │
│                    ┌───────▼───────┐                            │
│                    │ PROJECT MGR   │                            │
│                    │ (Haikal)      │                            │
│                    └───────┬───────┘                            │
│                            │                                     │
│              ┌─────────────┴─────────────┐                      │
│              │                           │                       │
│      ┌───────▼───────┐           ┌───────▼───────┐              │
│      │ PLANNER       │           │ ANALYST       │              │
│      │ (Lutpandea)   │           │ (Etheldreda)  │              │
│      └───────────────┘           └───────────────┘              │
│                                                                  │
│  + Tim Teknis: Designer, Frontend, Backend, QA                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Hirarki jelas: Sponsor → PM → Team
- RACI Matrix untuk pembagian tanggung jawab

---

## SLIDE 6: Estimasi Sumber Daya

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               📊 ESTIMASI SUMBER DAYA                           │
│                                                                  │
│  SDM (7 orang):                                                 │
│  ┌──────────────────────────────┬─────────────────────────────┐│
│  │ Project Manager              │ 100 jam                     ││
│  │ Project Planner              │ 150 jam                     ││
│  │ Cost & Risk Analyst          │ 120 jam                     ││
│  │ UI/UX Designer               │ 60 jam                      ││
│  │ Frontend Developer           │ 210 jam                     ││
│  │ Backend Developer            │ 210 jam                     ││
│  │ QA Tester                    │ 45 jam                      ││
│  ├──────────────────────────────┼─────────────────────────────┤│
│  │ TOTAL                        │ 895 jam                     ││
│  └──────────────────────────────┴─────────────────────────────┘│
│                                                                  │
│  Non-SDM: Laptop, Tablet kasir, Domain, Cloud hosting          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Total effort 895 jam kerja
- Infrastruktur menggunakan free tier (Vercel, Supabase)

---

## SLIDE 7: Cost-Benefit Analysis

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               💰 COST-BENEFIT ANALYSIS                          │
│                                                                  │
│  BIAYA:                           MANFAAT:                      │
│  ┌────────────────────────┐      ┌────────────────────────────┐│
│  │ SDM: Rp 56.15 juta     │      │ Efisiensi: +50% speed     ││
│  │ Infra: Rp 4.68 juta    │      │ Akurasi: 100%             ││
│  │ Indirect: Rp 1.25 juta │      │ Hemat kertas: Rp 75K/bln  ││
│  │ Reserve: Rp 6.2 juta   │      │ Revenue: +Rp 3 juta/bln   ││
│  ├────────────────────────┤      │ Customer loyalty: data    ││
│  │ TOTAL: Rp 68.28 juta   │      └────────────────────────────┘│
│  └────────────────────────┘                                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │   💡 Break-Even: 18.4 bulan | ROI Tahun 3: +168%          ││
│  │   ✅ REKOMENDASI: LAYAK DILANJUTKAN                       ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Total biaya ~Rp 68 juta
- Break-even dalam 1.5 tahun
- ROI di tahun ke-3 mencapai 168%

---

## SLIDE 8: Daftar Aktivitas

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               📝 DAFTAR AKTIVITAS PROYEK                        │
│                                                                  │
│  ┌──────┬──────────────────────────────────┬────────┬────────┐ │
│  │ ID   │ Aktivitas                        │ Durasi │ Pred.  │ │
│  ├──────┼──────────────────────────────────┼────────┼────────┤ │
│  │ A    │ Requirement Gathering            │ 5 hari │ -      │ │
│  │ B    │ Feasibility Study                │ 3 hari │ A      │ │
│  │ C    │ System Design                    │ 5 hari │ B      │ │
│  │ D    │ UI/UX Design                     │ 7 hari │ B      │ │
│  │ E    │ Database Setup                   │ 3 hari │ C      │ │
│  │ F    │ Frontend POS                     │ 12 hari│ D,E    │ │
│  │ G    │ Backend POS                      │ 10 hari│ E      │ │
│  │ ...  │ ...                              │ ...    │ ...    │ │
│  │ R    │ Go-Live & Handover               │ 1 hari │ Q      │ │
│  ├──────┴──────────────────────────────────┴────────┴────────┤ │
│  │ TOTAL: 18 aktivitas | 63 hari kerja                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- 18 aktivitas dari inisiasi sampai go-live
- Predecessor menentukan urutan dan dependensi

---

## SLIDE 9: Network Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               🔗 NETWORK DIAGRAM (AON)                          │
│                                                                  │
│     ┌───┐    ┌───┐    ┌───┐    ┌───┐                           │
│     │ A │───►│ B │───►│ C │───►│ E │─────────┐                 │
│     │ 5 │    │ 3 │    │ 5 │    │ 3 │         │                 │
│     └───┘    └─┬─┘    └───┘    └───┘         │                 │
│               │                   │           │                  │
│               ▼                   ▼           ▼                  │
│            ┌───┐              ┌───┐       ┌───┐                 │
│            │ D │─────────────►│ F │──────►│ H │────┐            │
│            │ 7 │              │12 │       │ 8 │    │            │
│            └───┘              └───┘       └───┘    │            │
│                                   │                │            │
│                                   ▼                ▼            │
│                               ┌───┐            ┌───┐            │
│                               │ G │───────────►│ K │───► ...    │
│                               │10 │            │ 5 │            │
│                               └───┘            └───┘            │
│                                                                  │
│     🔴 Merah = Critical Path                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Activity-on-Node (AON) representation
- Critical path ditandai dengan warna merah
- Float = 0 untuk aktivitas kritis

---

## SLIDE 10: Critical Path Analysis

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               🔥 CRITICAL PATH ANALYSIS                         │
│                                                                  │
│  JALUR KRITIS:                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ A → B → C → E → F → H → K → L → M → N → O → P → Q → R   │ │
│  │                                                            │ │
│  │ Total: 63 hari kerja (~12.6 minggu)                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  PERHITUNGAN ES/EF/LS/LF:                                       │
│  ┌──────┬────┬────┬────┬────┬───────┬──────────┐              │
│  │ Task │ ES │ EF │ LS │ LF │ Float │ Critical │              │
│  ├──────┼────┼────┼────┼────┼───────┼──────────┤              │
│  │ A    │ 0  │ 5  │ 0  │ 5  │   0   │    ✅    │              │
│  │ D    │ 8  │ 15 │ 9  │ 16 │   1   │    ❌    │              │
│  │ I    │ 26 │ 33 │ 29 │ 36 │   3   │    ❌    │              │
│  └──────┴────┴────┴────┴────┴───────┴──────────┘              │
│                                                                  │
│  📌 16 dari 18 aktivitas adalah KRITIS                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Jalur kritis tidak boleh terlambat
- Float = 0 artinya tidak ada "ruang gerak"
- Aktivitas D dan I memiliki float, bisa sedikit delay

---

## SLIDE 11: WBS

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               📂 WORK BREAKDOWN STRUCTURE                       │
│                                                                  │
│  1.0 POS-CRM Seblak Teh Imas                                    │
│  │                                                               │
│  ├── 1.1 Inisiasi (8 hari)                                      │
│  │   ├── 1.1.1 Requirement Gathering                            │
│  │   └── 1.1.2 Feasibility Study                                │
│  │                                                               │
│  ├── 1.2 Perencanaan (15 hari)                                  │
│  │   ├── 1.2.1 System Design                                    │
│  │   ├── 1.2.2 UI/UX Design                                     │
│  │   └── 1.2.3 Database Design                                  │
│  │                                                               │
│  ├── 1.3 Pengembangan (40 hari)                                 │
│  │   ├── 1.3.1 Modul POS                                        │
│  │   ├── 1.3.2 Modul CRM                                        │
│  │   └── 1.3.3 Integration                                      │
│  │                                                               │
│  ├── 1.4 Pengujian (16 hari)                                    │
│  └── 1.5 Deployment (6 hari)                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- WBS sampai level 4 untuk detail lengkap
- Total 18 work packages
- Mengikuti prinsip 100% rule

---

## SLIDE 12: Gantt Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               📅 GANTT CHART                                    │
│                                                                  │
│  Jan 2026        Feb 2026        Mar 2026        Apr 2026       │
│  W1  W2  W3  W4  W5  W6  W7  W8  W9  W10 W11 W12 W13           │
│  ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤         │
│                                                                  │
│  ▓▓▓▓▓                              Requirement                 │
│       ▓▓▓                           Feasibility                 │
│          ▓▓▓▓▓                      System Design               │
│          ████████                   UI/UX Design                │
│               ▓▓▓                   Database                    │
│                  ▓▓▓▓▓▓▓▓▓▓▓▓       Frontend POS                │
│                  ██████████         Backend POS                 │
│                              ▓▓▓▓▓▓▓▓ Frontend CRM              │
│                                      ▓▓▓▓▓ Integration          │
│                                           ▓▓▓▓▓▓▓▓ Testing      │
│                                                   ▓▓▓ Deploy    │
│                                                                  │
│  ▓ = Critical Path | █ = Non-Critical                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Timeline 13 minggu (20 Jan - 16 Apr 2026)
- Gantt manual dibandingkan dengan MS Project
- Rekomendasi: gunakan tools untuk akurasi

---

## SLIDE 13: Risiko Utama

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               ⚠️ RISIKO UTAMA                                   │
│                                                                  │
│  ┌──────┬────────────────────┬───────┬────────┬──────────────┐ │
│  │ ID   │ Risiko             │ Score │ Level  │ Strategy     │ │
│  ├──────┼────────────────────┼───────┼────────┼──────────────┤ │
│  │ R1   │ Scope Creep        │  16   │ 🔴 HIGH│ Avoid        │ │
│  │ R6   │ Low User Adoption  │  16   │ 🔴 HIGH│ Mitigate     │ │
│  │ R8   │ Critical Bug       │  15   │ 🔴 HIGH│ Mitigate     │ │
│  │ R4   │ Integration Fail   │  12   │ 🔴 HIGH│ Mitigate     │ │
│  │ R7   │ Schedule Slip      │  12   │ 🔴 HIGH│ Mitigate     │ │
│  └──────┴────────────────────┴───────┴────────┴──────────────┘ │
│                                                                  │
│  📊 Risk Score = Probability × Impact                           │
│  🔴 HIGH (13-25) | 🟡 MEDIUM (6-12) | 🟢 LOW (1-5)              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- 5 risiko teratas dengan score ≥12
- Scope creep dan user adoption adalah yang tertinggi
- Setiap risiko punya strategi mitigasi

---

## SLIDE 14: Strategi Mitigasi

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               🛡️ STRATEGI MITIGASI                              │
│                                                                  │
│  R1: SCOPE CREEP                                                │
│  ├── Prevention: Scope baseline + CCB                           │
│  └── Contingency: Phase 2 untuk fitur nice-to-have             │
│                                                                  │
│  R6: LOW USER ADOPTION                                          │
│  ├── Prevention: User involvement + prototype                   │
│  └── Contingency: Extended training + on-site support          │
│                                                                  │
│  R8: CRITICAL BUG                                               │
│  ├── Prevention: Multi-layer testing                            │
│  └── Contingency: Rollback procedure + hotfix process          │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  💡 RISIKO YANG SERING DIABAIKAN TAPI PALING FATAL:      │ │
│  │                                                            │ │
│  │  1. Poor Requirement Gathering (60% project failure)      │ │
│  │  2. User Resistance to Change (sistem tidak dipakai)      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Setiap risiko punya 2 layer: prevention + contingency
- Highlight: risiko "silent killer" yang sering diabaikan
- Budget reserve 10% untuk penanganan risiko

---

## SLIDE 15: Kesimpulan & Lesson Learned

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│               ✅ KESIMPULAN & LESSON LEARNED                    │
│                                                                  │
│  RINGKASAN PROYEK:                                              │
│  ┌──────────────────┬────────────────────────────────────────┐ │
│  │ Durasi           │ 63 hari (12.6 minggu)                  │ │
│  │ Budget           │ Rp 68.28 juta                          │ │
│  │ Tim              │ 3 anggota + 4 support                  │ │
│  │ Aktivitas Kritis │ 16 dari 18                             │ │
│  │ ROI (Year 3)     │ +168%                                  │ │
│  └──────────────────┴────────────────────────────────────────┘ │
│                                                                  │
│  LESSON LEARNED:                                                │
│  ✅ Requirement adalah FONDASI - jangan skip!                   │
│  ✅ Libatkan user sejak awal untuk mengurangi resistance       │
│  ✅ Risk management harus PROAKTIF, bukan reaktif              │
│  ✅ Gunakan tools untuk proyek kompleks                        │
│  ✅ Komunikasi adalah KUNCI keberhasilan tim                   │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              🙏 TERIMA KASIH                              │ │
│  │              Questions & Discussion                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Speaker Notes:**

- Recap key numbers dan lesson learned
- Buka sesi Q&A
- Siapkan backup slides jika perlu

---

# 📌 TIPS PRESENTASI

## Do's ✅

1. **Jelaskan setiap critical point** - ini yang dinilai
2. **Gunakan visual** - diagram lebih baik dari text
3. **Jaga waktu** - 1-1.5 menit per slide
4. **Siapkan backup** - data lengkap jika ditanya

## Don'ts ❌

1. Jangan baca slide - jelaskan dengan kata sendiri
2. Jangan terlalu teknis - fokus pada manajemen
3. Jangan terburu-buru - jelas dan terstruktur
4. Jangan lupa critical points di setiap CLO

## Pembagian Presenter

| Slide | Presenter                   | Durasi  |
| ----- | --------------------------- | ------- |
| 1-2   | Semua (intro)               | 2 menit |
| 3-5   | Project Manager (Haikal)    | 4 menit |
| 6-7   | Cost Analyst (Etheldreda)   | 3 menit |
| 8-12  | Project Planner (Lutpandea) | 6 menit |
| 13-14 | Cost Analyst (Etheldreda)   | 3 menit |
| 15    | Project Manager (Haikal)    | 2 menit |

---

_Panduan ini untuk membuat presentasi PowerPoint/Canva berdasarkan konten yang sudah ada_

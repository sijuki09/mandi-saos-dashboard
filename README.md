# 🥣 Mandi Saos — Dashboard Keuangan

Dashboard interaktif laporan keuangan Mandi Saos, dibangun dengan React + Recharts.
Bisa di-deploy ke internet gratis dalam waktu 5 menit via Vercel.

---

## 🚀 Tutorial Deploy ke Vercel (Step-by-Step)

### Langkah 1 — Install Node.js (kalau belum ada)

Pergi ke https://nodejs.org dan download versi **LTS** (yang kiri).
Setelah install, buka Terminal / Command Prompt dan cek:

```bash
node --version   # harusnya v18 ke atas
npm --version    # harusnya v9 ke atas
```

---

### Langkah 2 — Buat akun GitHub (kalau belum ada)

1. Pergi ke https://github.com
2. Klik **Sign Up**, daftar gratis
3. Verifikasi email

---

### Langkah 3 — Upload kode ke GitHub

#### Cara A — Via GitHub Website (lebih mudah, tanpa Git)

1. Buka https://github.com/new
2. Beri nama repo: `mandi-saos-dashboard`
3. Pilih **Private** atau **Public** (terserah)
4. Klik **Create repository**
5. Klik **uploading an existing file** (link biru kecil di halaman)
6. Upload semua file dari folder `mandi-saos-dashboard` ini:
   - Drag & drop seluruh isi folder (bukan foldernya, tapi isinya)
   - Pastikan struktur seperti ini:
     ```
     package.json
     vite.config.js
     index.html
     README.md
     src/
       main.jsx
       App.jsx
       index.css
     public/
       favicon.svg
     ```
7. Scroll bawah, klik **Commit changes**

#### Cara B — Via Terminal (pakai Git)

```bash
# Masuk ke folder project
cd mandi-saos-dashboard

# Inisialisasi git
git init
git add .
git commit -m "Initial commit: Mandi Saos Dashboard"

# Hubungkan ke GitHub (ganti URL dengan repo kamu)
git remote add origin https://github.com/USERNAME/mandi-saos-dashboard.git
git branch -M main
git push -u origin main
```

---

### Langkah 4 — Deploy ke Vercel

1. Buka https://vercel.com
2. Klik **Sign Up** → pilih **Continue with GitHub**
3. Authorize Vercel untuk akses GitHub kamu
4. Di dashboard Vercel, klik **Add New... → Project**
5. Pilih repo `mandi-saos-dashboard` dari list
6. Klik **Import**
7. Di halaman konfigurasi:
   - **Framework Preset**: pilih `Vite` (biasanya auto-detect)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - Biarkan yang lain default
8. Klik **Deploy** 🎉

Vercel akan otomatis build dan dalam 1-2 menit dashboard kamu **live di internet!**

---

### Langkah 5 — Akses Dashboard Online

Setelah deploy selesai, Vercel memberi URL seperti:
```
https://mandi-saos-dashboard.vercel.app
```

URL ini bisa langsung dibuka di HP, laptop, atau dibagikan ke siapa saja!

---

## 🔄 Update Data

Kalau mau update data (misal ada data minggu baru):

1. Edit file `src/App.jsx`
2. Cari bagian `// ── DATA ───`
3. Update angka-angka sesuai data terbaru
4. Commit & push ke GitHub → Vercel otomatis re-deploy dalam beberapa menit

---

## 💻 Jalankan Lokal (Opsional)

Kalau mau preview dulu sebelum deploy:

```bash
# Masuk folder project
cd mandi-saos-dashboard

# Install dependencies (sekali saja)
npm install

# Jalankan di browser
npm run dev
```

Buka http://localhost:5173 di browser.

---

## 📋 Fitur Dashboard

| Tab | Isi |
|-----|-----|
| **Ringkasan** | KPI utama, revenue per minggu, metode pembayaran, insight bisnis |
| **Produk** | Analisis per produk, margin HPP, komposisi penjualan per minggu |
| **Cashflow** | Tabel & grafik realisasi 4 minggu, tren qty & transaksi |
| **Proyeksi** | Proyeksi 3 bulan ke depan, asumsi, tabel rinci |
| **Modal** | Alokasi modal awal, pie chart distribusi, BEP analysis |

---

## 🛠 Teknologi

- **React 18** — UI framework
- **Recharts** — Library grafik
- **Vite** — Build tool super cepat
- **Vercel** — Hosting gratis + auto-deploy dari GitHub

---

*Dashboard ini dibangun khusus untuk Mandi Saos — usaha kuliner berbasis saus.*

# Class ARS UNIBANG

Website Resmi Mahasiswa Class Administrasi Rumah Sakit (ARS), Fakultas Ilmu Kesehatan dan Sains, Universitas Bhakti Asih Tangerang (UNIBANG) Angkatan 2025.

Proyek ini dibangun menggunakan framework Next.js 16 dengan arsitektur App Router, basis data PostgreSQL melalui Prisma ORM, pemrosesan aset otomatis WebP via Sharp, dan animasi antarmuka terpadu berbasis Motion.

---

## Daftar Isi

- Ringkasan Proyek
- Fitur Utama
- Teknologi yang Digunakan
- Struktur Direktori
- Variabel Lingkungan (.env)
- Panduan Instalasi dan Menjalankan Proyek
- Alur Optimasi Gambar Otomatis (WebP)
- Panduan Deployment ke Vercel
- Pengelola Proyek

---

## Ringkasan Proyek

Class ARS UNIBANG adalah platform digital yang mendokumentasikan profil kelas, direktori mahasiswa aktif, galeri dokumentasi kegiatan, serta portal administrasi terproteksi untuk pembaruan data secara langsung (real-time).

Perguruan Tinggi: Universitas Bhakti Asih Tangerang (UNIBANG)
Fakultas: Fakultas Ilmu Kesehatan dan Sains
Program Studi: S1 Administrasi Rumah Sakit (Gelar: S.Ars)
Akreditasi: Unggul
Domain Produksi: https://classarsunibang.vercel.app/
Website Kampus: https://www.universitasbhaktiasih.ac.id/
Website Program Studi S1 ARS: https://www.universitasbhaktiasih.ac.id/s1-administrasi-rs/
Instagram Resmi: https://www.instagram.com/administrasirs25/

---

## Fitur Utama

### 1. Halaman Beranda (Landing Page)
- 3D Tilted Grid Hero yang menampilkan cuplikan dokumentasi angkatan dalam format silinder kurva responsif.
- Bagian Profil Kelas yang mendeskripsikan visi akademik dan nilai kekeluargaan mahasiswa.
- Pratinjau direktori mahasiswa dan galeri foto dengan animasi scroll reveal berbasis pegas (spring physics).

### 2. Direktori Mahasiswa (/students)
- Daftar lengkap mahasiswa angkatan 2025 diurutkan secara alfabetis A-Z.
- Pencarian instan berdasarkan nama dan peran/jabatan mahasiswa.
- Kartu profil interaktif yang dapat diklik untuk membuka jendela modal informasi lengkap dan foto resolusi tinggi.

### 3. Galeri Foto (/gallery)
- Tampilan kolase masonry responsif yang menyesuaikan ukuran pada perangkat seluler (2 kolom kontinu) dan desktop (4 kolom kontinu) tanpa menyisakan ruang kosong vertikal.
- Lightbox penampil foto layar penuh dilengkapi tombol navigasi Sebelumnya (Prev), Selanjutnya (Next), dan pintasan keyboard (tombol panah kiri, kanan, serta Escape).

### 4. Portal Admin Terproteksi (/admin)
- Sistem autentikasi berbasis sesi aman (HTTP-only cookie).
- Manajemen data mahasiswa: Tambah mahasiswa baru, edit nama, pilihan jabatan terstandarisasi (Ketua Kelas, Wakil Ketua, Sekretaris, Bendahara, Anggota) atau custom role, serta hapus data.
- Manajemen galeri: Unggah foto dokumentasi baru, edit judul/deskripsi, dan hapus foto.
- Kompresi dan konversi otomatis file foto ke format WebP langsung dari formulir dashboard.

### 5. Optimasi Aset dan Berbagi Tautan (Open Graph)
- Seluruh aset grafis menggunakan format modern WebP dengan efisiensi ukuran hingga 73% lebih ringan dibanding format raster konvensional.
- Ikon browser (favicon.ico multi-resolusi, icon.png, apple-icon.png) menggunakan logo resmi Class ARS UNIBANG.
- Kartu Open Graph otomatis (1200 x 630 px) untuk tampilan pratinjau tautan ketika dibagikan melalui WhatsApp, Telegram, Facebook, Twitter/X, Discord, atau LinkedIn.

---

## Teknologi yang Digunakan

- Framework Frontend & Backend: Next.js 16 (App Router, Turbopack, Partial Prefetching)
- Pustaka UI: React 19
- Styling Sistem: Tailwind CSS v4
- Basis Data: PostgreSQL (Neon Serverless PostgreSQL)
- ORM: Prisma ORM v6
- Mesin Pengolah Gambar: Sharp
- Animasi Antarmuka: Motion (Framer Motion)
- Koleksi Ikon UI: Lucide React
- Bahasa Pemrograman: TypeScript & JavaScript

---

## Struktur Direktori

```text
kelas-fadil/
├── prisma/
│   └── schema.prisma              # Definisi skema database Prisma
├── public/
│   ├── images/
│   │   ├── ars/                   # Aset foto dokumentasi profil (.webp)
│   │   ├── gallery/               # Aset foto dokumentasi galeri (.webp)
│   │   ├── students/              # Aset default foto mahasiswa (.webp)
│   │   ├── logo-ars.webp          # Logo resmi Class ARS UNIBANG
│   │   ├── logo-gallery.webp      # Ikon bagian galeri
│   │   └── logo-students.webp     # Ikon bagian mahasiswa
│   ├── favicon.ico                # Favicon tab browser (multi-size)
│   ├── icon-192.png               # Ikon PWA 192px
│   ├── icon-512.png               # Ikon PWA 512px
│   ├── og-image.png               # Kartu Open Graph media sosial (1200x630)
│   └── site.webmanifest           # Manifest aplikasi web
├── scripts/
│   ├── convert-webp.js            # Skrip utilitas konversi gambar batch
│   ├── generate-branding.js       # Skrip pembuat favicon dan kartu OG
│   └── migrate-db-webp.js         # Skrip migrasi data basis data ke WebP
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/page.tsx     # Halaman login portal admin
│   │   │   └── page.tsx           # Dashboard manajemen mahasiswa & galeri
│   │   ├── api/
│   │   │   ├── admin/             # Rute API login, logout, me
│   │   │   ├── gallery/           # Rute API CRUD foto galeri
│   │   │   └── students/          # Rute API CRUD direktori mahasiswa
│   │   ├── gallery/page.js        # Halaman khusus galeri foto (/gallery)
│   │   ├── students/page.js       # Halaman khusus direktori mahasiswa (/students)
│   │   ├── globals.css            # Pengaturan tema dan gaya global
│   │   ├── layout.js              # Layout akar dengan konfigurasi metadata OG
│   │   ├── not-found.tsx          # Halaman penanganan rute 404 kustom
│   │   └── page.tsx               # Halaman utama beranda
│   ├── components/
│   │   ├── ui/
│   │   │   ├── footer-section-1.tsx   # Komponen footer situs
│   │   │   ├── tilted-grid-hero.tsx   # Mesin animasi 3D hero
│   │   │   └── tilted-grid-hero-demo.tsx # Implementasi hero beranda
│   │   ├── AboutSection.tsx       # Komponen informasi profil kelas
│   │   ├── ConditionalShell.tsx   # Penampil kondisional navbar/footer
│   │   ├── GallerySection.tsx     # Komponen galeri foto & modal lightbox
│   │   ├── Header.js              # Bilah navigasi atas (Navbar)
│   │   └── StudentsSection.tsx    # Komponen kartu mahasiswa & modal detail
│   └── lib/
│       ├── auth.ts                # Utilitas otentikasi sesi admin
│       ├── image-utils.ts         # Pipeline konversi gambar ke WebP (Sharp)
│       └── prisma.ts              # Inisialisasi klien tunggal Prisma
├── next.config.mjs                # Konfigurasi Next.js & format gambar
├── package.json                   # Dependensi dan skrip proyek
└── tsconfig.json                  # Konfigurasi compiler TypeScript
```

---

## Variabel Lingkungan (.env)

Buat file `.env` di direktori utama proyek dengan format konfigurasi berikut:

```env
# Koneksi Basis Data PostgreSQL (Neon Serverless atau PostgreSQL lokal)
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require"

# Kredensial Masuk Portal Admin
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="password_admin_anda"

# Kunci Rahasia Enkripsi Sesi Admin
AUTH_SECRET="kunci_rahasia_acak_panjang_untuk_keamanan_sesi"
```

---

## Panduan Instalasi dan Menjalankan Proyek

### Prasyarat
- Node.js versi 18.18 atau yang lebih baru
- Manajer paket npm (atau pnpm / yarn)
- Layanan database PostgreSQL aktif

### Langkah-langkah

1. Gandakan repositori proyek:
   ```bash
   git clone https://github.com/Masmas99/classarsunibang.git
   cd classarsunibang
   ```

2. Pasang seluruh dependensi:
   ```bash
   npm install
   ```

3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

4. Sinkronisasikan skema ke basis data:
   ```bash
   npx prisma db push
   ```

5. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

6. Buka aplikasi di peramban:
   - Halaman Utama: http://localhost:3000
   - Direktori Mahasiswa: http://localhost:3000/students
   - Galeri Foto: http://localhost:3000/gallery
   - Portal Admin: http://localhost:3000/admin

---

## Alur Optimasi Gambar Otomatis (WebP)

Aplikasi menerapkan sistem optimasi gambar dua lapis:

1. Lapisan Klien (Frontend Admin):
   Ketika pengguna memilih file gambar baru di formulir mahasiswa atau galeri, kanvas HTML5 otomatis mereskalasi resolusi maksimal dan mengonversi format ke Data URI `image/webp` dengan kualitas terkompresi 80%.

2. Lapisan Server (Backend API):
   Pada endpoint `POST` dan `PUT` di `/api/students` dan `/api/gallery`, utilitas `optimizeToWebP` yang didukung pustaka `sharp` memeriksa buffer gambar masuk, memastikan ukuran maksimal yang proporsional, serta mengonversinya menjadi WebP sebelum disimpan ke basis data.

3. Penayangan Next.js:
   File `next.config.mjs` dikonfigurasi dengan `formats: ['image/avif', 'image/webp']` untuk negosiasi otomatis format terkompresi terbaik ke peramban pengunjung.

---

## Panduan Deployment ke Vercel

Proyek ini telah dikonfigurasi agar dapat langsung dideploy ke platform Vercel:

1. Hubungkan repositori GitHub ke akun Vercel Anda.
2. Pada bagian pengaturan proyek (Project Settings) menu Environment Variables, tambahkan variabel berikut:
   - `DATABASE_URL`: Connection string PostgreSQL Neon Anda.
   - `ADMIN_USERNAME`: Username untuk masuk admin.
   - `ADMIN_PASSWORD`: Password untuk masuk admin.
   - `AUTH_SECRET`: String acak aman untuk penandatanganan token cookie.
3. Pastikan pengaturan build menggunakan perintah bawaan:
   - Build Command: `npm run build` (secara otomatis memanggil `prisma generate && next build`).
   - Output Directory: `.next`
   - Install Command: `npm install` (secara otomatis memicu skrip `postinstall` untuk Prisma).
4. Klik tombol Deploy.

---

## Perintah Perawatan (Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan lokal pada port 3000 |
| `npm run build` | Menjalankan Prisma Generate dan membangun versi produksi Next.js |
| `npm run start` | Menjalankan server aplikasi Next.js versi build produksi |
| `npm run lint` | Menjalankan pengecekan kualitas kode menggunakan ESLint |
| `node scripts/generate-branding.js` | Menghasilkan ulang seluruh favicon dan kartu Open Graph |

---

## Hak Cipta dan Lisensi

Hak Cipta (c) 2025 Class ARS UNIBANG - Fakultas Ilmu Kesehatan dan Sains, Universitas Bhakti Asih Tangerang. Seluruh hak cipta dilindungi undang-undang.

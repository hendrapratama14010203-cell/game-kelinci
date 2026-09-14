# 🥒 Monitoring Kebun Timun

Aplikasi monitoring kebun: buka halaman di HP, izinkan kamera & lokasi, foto diambil otomatis, lalu Anda konfirmasi sebelum data dikirim ke server. Semua (frontend + backend) jalan dari **satu server** Node.js/Express + MongoDB.

## Struktur Folder

```
kebun-monitor/
├── backend/
│   ├── models/Monitoring.js     # skema data MongoDB
│   ├── routes/monitoring.js     # endpoint API
│   ├── public/
│   │   ├── index.html           # halaman ambil foto & lokasi
│   │   └── dashboard.html       # halaman lihat semua data + peta
│   ├── uploads/                 # foto tersimpan di sini
│   ├── server.js
│   ├── package.json
│   └── .env                     # isi dengan MONGODB_URI Anda
└── README.md
```

## Cara Menjalankan (Cukup Sekali Setup)

```bash
cd backend
npm install
```

Edit file `.env` (sudah ada di dalam folder `backend`), isi `MONGODB_URI` dengan connection string MongoDB Atlas Anda. Contoh:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kebun-monitor
PORT=5000
```

> Dapatkan connection string dari https://cloud.mongodb.com → Database → Connect → Drivers.
> Kalau pakai MongoDB lokal, isi: `mongodb://localhost:27017/kebun-monitor`

Jalankan:

```bash
npm run dev
```

Server jalan di `http://localhost:5000` — frontend dan backend sudah jadi satu, tidak perlu proses terpisah.

## Akses dari HP

Kalau server dijalankan di laptop tapi mau diakses dari HP (untuk ambil foto langsung di kebun):

1. Pastikan HP & laptop terhubung ke **WiFi yang sama**
2. Cari IP laptop, misal `192.168.1.10`
3. Di browser HP, buka `http://192.168.1.10:5000`

> **Catatan:** akses kamera & geolocation via browser **mengharuskan HTTPS** kecuali di `localhost`. Untuk akses dari HP di jaringan lokal (`http://192.168.x.x`), sebagian browser (terutama Chrome Android) masih mengizinkan untuk keperluan development, tapi kalau nanti di-deploy ke internet, wajib pasang HTTPS (misalnya pakai Let's Encrypt atau layanan seperti Render/Railway yang otomatis HTTPS).

## Alur Penggunaan

1. Buka halaman utama (`/` atau `index.html`) di browser HP
2. Tekan **"Mulai Monitoring"** → izinkan kamera
3. Foto **otomatis diambil** begitu kamera aktif (tanpa perlu tekan tombol shutter)
4. Browser minta izin lokasi → izinkan
5. Foto & lokasi ditampilkan sebagai **preview + konfirmasi** — belum terkirim
6. Tambahkan keterangan (opsional)
7. Tekan **"Kirim ke Server"** untuk mengonfirmasi pengiriman, atau **"Batal / Ulangi"** untuk mengulang dari awal
8. Buka `/dashboard.html` untuk lihat semua foto, waktu, dan lokasi di peta

## Catatan Keamanan & Privasi

- Kamera & lokasi **tidak pernah aktif tanpa izin eksplisit** dari browser — ini dikontrol oleh sistem operasi/browser, bukan oleh kode aplikasi.
- Foto diambil otomatis setelah izin kamera diberikan, **tapi tidak langsung terkirim** — ada langkah konfirmasi manual sebelum data benar-benar dikirim ke server, supaya Anda selalu tahu & menyetujui apa yang dikirim.
- Data foto tersimpan di `backend/uploads/` dan metadata (lokasi, waktu) di MongoDB — pastikan koneksi database Anda aman (gunakan username/password yang kuat di Atlas, whitelist IP kalau perlu).

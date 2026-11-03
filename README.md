# RESTful API App

Backend REST API menggunakan Express.js dan MongoDB melalui Mongoose. Project ini memiliki modul mahasiswa, program studi (prodi), fakultas, dan dosen.

## Prasyarat

- Node.js versi LTS dan npm.
- MongoDB Community Server yang berjalan di komputer lokal.
- MongoDB Compass untuk melihat database secara visual.

> Compass adalah aplikasi klien untuk mengelola dan melihat MongoDB. Compass tidak menjalankan MongoDB Server. Pastikan MongoDB Community Server sudah terpasang dan berjalan sebelum menghubungkan aplikasi atau Compass.

## Setup awal

Buka PowerShell di folder project ini:

```powershell
cd D:\SI5C-Express\restful-api-app
npm install
```

`npm install` memasang dependency yang tercantum di `package.json`, yaitu Express, Mongoose, dotenv, CORS, dan Nodemon untuk pengembangan.

### Konfigurasi environment

Salin `.env.example` menjadi `.env` jika file `.env` belum ada:

```powershell
Copy-Item .env.example .env
```

Isi `.env`:

```env
PORT=3000
API_KEY=ganti-dengan-kunci-rahasia-anda
CORS_ORIGIN=http://127.0.0.1:5500
DB_URI=mongodb://localhost:27017/paw2
```

- `PORT`: port server Express.
- `API_KEY`: kunci yang dikirim pada operasi tulis yang dilindungi.
- `CORS_ORIGIN`: origin frontend yang diizinkan. Sesuaikan jika frontend berjalan pada alamat atau port lain.
- `DB_URI`: alamat MongoDB dan nama database. Contoh di atas menggunakan MongoDB lokal pada port `27017` dengan database `paw2`.

Jangan membagikan atau meng-commit `.env`. File tersebut sudah tercantum di `.gitignore`.

## Menjalankan aplikasi

Mode pengembangan dengan Nodemon:

```powershell
npm run dev
```

Mode biasa:

```powershell
npm start
```

Jika berhasil, terminal menampilkan server di `http://localhost:3000` dan pesan `Terhubung ke MongoDB`. Buka `http://localhost:3000/` untuk memeriksa endpoint dasar.

> Server HTTP tetap dapat berjalan jika `DB_URI` tidak diatur atau koneksi MongoDB gagal. Karena itu, pastikan pesan `Terhubung ke MongoDB` muncul sebelum menganggap koneksi database berhasil.

## Menghubungkan MongoDB Compass

1. Pastikan MongoDB Community Server sedang berjalan.
2. Buka MongoDB Compass dan pilih **New Connection**.
3. Masukkan connection string berikut:

   ```text
   mongodb://localhost:27017
   ```

4. Pilih **Connect**. Jika berhasil, Compass akan menampilkan koneksi ke server lokal.
5. Pastikan nilai host dan port ini sama dengan bagian server pada `DB_URI` di `.env`. Nama database pada URI aplikasi adalah `paw2`.
6. Untuk memunculkan database dan koleksi pada Compass, isi database terlebih dahulu. Dari terminal project, jalankan:

   ```powershell
   node seed.js
   ```

   Perintah ini membuat data contoh untuk prodi dan mahasiswa. **Perhatian:** seed menghapus seluruh dokumen pada koleksi mahasiswa dan prodi dalam database yang dituju sebelum memasukkan data baru. Jangan jalankan pada database yang berisi data penting.

7. Kembali ke Compass, pilih koneksi lokal lalu tekan **Refresh**. Database `paw2` dan koleksi yang berisi data seed seharusnya terlihat. Buka koleksinya untuk memeriksa dokumen.

Jika koneksi berhasil tetapi database belum terlihat, database MongoDB biasanya baru muncul setelah ada data yang ditulis. Pastikan `DB_URI` di `.env` menunjuk ke server dan nama database yang sama dengan yang sedang dibuka di Compass.

## Pembagian kode

```text
app.js
controllers/
middlewares/
models/
routes/
seed.js
```

- **`app.js`** — memuat konfigurasi environment, membuat aplikasi Express, memasang middleware global, menghubungkan route, mengatur koneksi Mongoose, dan menjalankan server.
- **`routes/`** — mendefinisikan URL dan HTTP method, lalu meneruskan request ke controller. Contoh: `mahasiswaRoutes.js`.
- **`controllers/`** — menangani alur request dan response, membaca parameter/query/body, serta memanggil model. Contoh: `mahasiswaController.js`.
- **`models/`** — mendefinisikan struktur dan operasi data. Model Mongoose menggunakan schema untuk koleksi MongoDB; contoh: `mahasiswaModel.js` dan `prodiModel.js`.
- **`middlewares/`** — fungsi yang berjalan di antara request dan controller. `cekApiKey.js` memeriksa header API key, `logger.js` mencatat request, dan `errorHandler.js` menangani route yang tidak ditemukan serta error.
- **`seed.js`** — memasukkan data contoh prodi dan mahasiswa ke database yang ditentukan oleh `DB_URI`.

Alur request umumnya: **client → route → middleware (jika dipasang) → controller → model/database → response**.

### Kondisi penyimpanan data saat ini

Koneksi MongoDB dipakai oleh model mahasiswa dan prodi. Sebaliknya, `fakultasModel.js` dan `dosenModel.js` saat ini menyimpan data dalam array di memori, sehingga perubahan pada modul tersebut tidak tersimpan di MongoDB dan tidak terlihat di Compass. Data memori itu juga kembali ke kondisi awal saat server dijalankan ulang.

## Endpoint yang tersedia

Base URL: `http://localhost:3000`

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/` | Memeriksa server |
| GET | `/mahasiswa` | Daftar mahasiswa; mendukung query `kota`, `prodi`, `fields`, `page`, `limit`, dan `sort` |
| GET | `/mahasiswa/:id` | Detail mahasiswa berdasarkan MongoDB ObjectId |
| POST | `/mahasiswa` | Membuat mahasiswa di MongoDB |
| PUT | `/mahasiswa/:id` | Memperbarui mahasiswa di MongoDB |
| DELETE | `/mahasiswa/:id` | Menghapus mahasiswa dari MongoDB |
| GET | `/prodi` | Daftar prodi dari MongoDB |
| POST | `/prodi` | Membuat prodi di MongoDB |
| GET | `/fakultas` | Daftar fakultas dalam memori |
| GET | `/fakultas/:id` | Detail fakultas dalam memori |
| POST | `/fakultas` | Membuat fakultas dalam memori |
| GET | `/dosen` | Daftar dosen dalam memori |
| GET | `/dosen/:id` | Detail dosen dalam memori |
| POST | `/dosen` | Membuat dosen dalam memori |

Operasi `POST`, `PUT`, dan `DELETE` yang dipasang dengan middleware API key memerlukan header:

```text
x-api-key: nilai API_KEY dari .env
```

Contoh membaca data mahasiswa:

```text
http://localhost:3000/mahasiswa?page=1&limit=10
```

Contoh filter kota dan prodi:

```text
http://localhost:3000/mahasiswa?kota=Palembang&prodi=SI
```

## Troubleshooting

- **`ECONNREFUSED` atau gagal terhubung:** pastikan MongoDB Community Server berjalan dan port pada `DB_URI` sesuai.
- **Compass tidak dapat terhubung:** coba `mongodb://localhost:27017`, pastikan server MongoDB berjalan, lalu periksa konfigurasi host/port.
- **Database `paw2` belum terlihat:** jalankan `node seed.js` setelah memeriksa `DB_URI`; kemudian tekan **Refresh** di Compass.
- **Operasi tulis mendapat `401`:** kirim header `x-api-key` dengan nilai `API_KEY` yang sedang dipakai aplikasi, lalu restart server setelah mengubah `.env`.
- **Perubahan hilang setelah restart:** pastikan endpoint yang digunakan memang tersimpan di MongoDB; modul fakultas dan dosen saat ini masih menggunakan array dalam memori.

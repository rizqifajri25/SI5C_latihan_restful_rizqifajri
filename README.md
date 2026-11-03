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

### Menggunakan MongoDB Atlas (cloud)

MongoDB Atlas menyediakan server MongoDB di cloud. Di Atlas, server/database deployment ini sering disebut **cluster**. Compass adalah aplikasi klien yang dapat digunakan untuk melihat data di cluster tersebut.

1. Masuk atau daftar di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), lalu buat project.
2. Buat database deployment/cluster. Untuk belajar, tier gratis dapat digunakan jika tersedia pada pilihan Atlas.
3. Di pengaturan **Database Access**, buat database user beserta password. Ini adalah kredensial database, bukan akun login Atlas.
4. Di pengaturan **Network Access**, tambahkan alamat IP publik komputer yang akan mengakses Atlas. Hindari mengizinkan `0.0.0.0/0` secara permanen karena itu membuka akses dari semua alamat IP.
5. Pada deployment, pilih **Connect** lalu **Drivers**. Salin connection string yang diberikan Atlas. Bentuknya kurang lebih seperti berikut:

   ```text
   mongodb+srv://<username>:<password>@<cluster-host>/paw2?retryWrites=true&w=majority
   ```

6. Ganti `<username>`, `<password>`, dan `<cluster-host>` dengan nilai yang sesuai. Jika password berisi karakter khusus seperti `@`, `:`, `/`, `?`, atau `#`, URL-encode password tersebut sebelum memasukkannya ke URI.
7. Ganti nilai `DB_URI` pada `.env` dengan connection string Atlas yang sudah lengkap. Contoh format:

   ```env
   DB_URI=mongodb+srv://user_database:password-ter-encode@cluster0.example.mongodb.net/paw2?retryWrites=true&w=majority
   ```

   Jangan menyalin contoh tersebut apa adanya. Gunakan host dan kredensial yang diberikan untuk cluster milik Anda. Jangan menaruh spasi atau tanda kutip di sekitar nilai URI.
8. Simpan `.env`, lalu jalankan aplikasi:

   ```powershell
   npm run dev
   ```

   Pastikan terminal menampilkan `Terhubung ke MongoDB`. Pesan gagal koneksi perlu ditangani sebelum melanjutkan.
9. Untuk melihat data dari Atlas di Compass, gunakan connection string Atlas yang sama melalui **New Connection** → **Paste connection string** → **Connect**. Setelah terkoneksi, pilih database `paw2`.
10. Jika database atau koleksi belum tampak, belum ada dokumen di dalamnya. Setelah memastikan `DB_URI` menunjuk ke database Atlas yang benar, data contoh bisa dimasukkan dengan:

    ```powershell
    node seed.js
    ```

    **Perhatian:** `seed.js` menghapus semua dokumen pada koleksi mahasiswa dan prodi dari database yang dituju sebelum memasukkan data contoh. Jangan jalankan terhadap database berisi data penting.

Connection string berisi kredensial rahasia. Simpan hanya di `.env`, jangan tempel ke chat, unggah ke repositori, atau bagikan tangkapan layar yang memperlihatkan password. Jika kredensial terlanjur terekspos, ganti password database user di Atlas.

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

Untuk menggunakan Atlas di Compass, lihat langkah **Menggunakan MongoDB Atlas (cloud)** di atas. Gunakan connection string Atlas, bukan `mongodb://localhost:27017`.

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

## Filtering, pagination, sorting, dan projection

Fitur-fitur ini diterapkan pada endpoint `GET /mahasiswa` di `controllers/mahasiswaController.js`, tepatnya pada fungsi `getAll`. Nilainya dikirim sebagai **query parameter** (setelah tanda `?` pada URL), sehingga route yang sudah ada di `routes/mahasiswaRoutes.js` tidak perlu diubah.

### Contoh penggunaan

| Fitur | Contoh URL | Hasil |
| --- | --- | --- |
| Filter kota | `/mahasiswa?kota=Palembang` | Mahasiswa dengan `alamat.kota` bernilai `Palembang` |
| Filter prodi | `/mahasiswa?prodi=SI` | Mahasiswa dengan prodi berkode `SI` |
| Pagination | `/mahasiswa?page=2&limit=5` | Halaman kedua, maksimal 5 data |
| Sorting naik | `/mahasiswa?sort=nama` | Urut nama A–Z |
| Sorting turun | `/mahasiswa?sort=-nama` | Urut nama Z–A |
| Projection | `/mahasiswa?fields=nama,nim` | Field `nama` dan `nim` (MongoDB tetap menyertakan `_id` secara default) |
| Kombinasi | `/mahasiswa?kota=Palembang&prodi=SI&page=1&limit=5&sort=nama&fields=nama,nim,alamat` | Semua fitur dipakai bersama |

Query parameter bisa digabung dengan `&`. Dalam project ini, `kota` mencocokkan field bersarang `alamat.kota`, sedangkan `prodi` menerima kode prodi. Kode diubah menjadi huruf besar sebelum dicari. Jika kode prodi tidak ditemukan, hasil mahasiswa kosong.

### Cara menerapkannya di controller

1. **Baca parameter dari `req.query`.** Buat object `filter` untuk kriteria MongoDB. Contohnya, `filter['alamat.kota'] = String(req.query.kota)` memfilter subfield alamat. Untuk prodi, cari dokumen `Prodi` berdasarkan kode lalu gunakan `_id`-nya pada `filter.prodiId`.
2. **Tentukan field projection yang diizinkan.** Pada project ini daftar yang diizinkan adalah `nama`, `nim`, `alamat`, `prodiId`, dan `createdAt`. Pisahkan nilai `fields` berdasarkan koma, trim spasi, dan tolak field yang tidak ada di daftar. Ini membatasi data yang dapat diminta client.
3. **Hitung pagination dengan nilai aman.** Fungsi `angkaAman` menerapkan default `page=1` dan `limit=10`, memastikan nilai minimal 1, serta membatasi limit maksimal 50. Offset untuk MongoDB adalah `(page - 1) * limit`.
4. **Validasi sorting.** `sort=nama` berarti urutan naik dan `sort=-nama` berarti urutan turun. Hanya `nama`, `nim`, dan `createdAt` yang diperbolehkan. Jika parameter tidak diberikan, default-nya `-createdAt` (data terbaru lebih dulu).
5. **Rangkai operasi query Mongoose.** `.find(filter)` menerapkan filter, `.select(select)` menerapkan projection, `.sort(...)` mengurutkan, lalu `.skip(...)` dan `.limit(...)` mengambil halaman yang diminta. `countDocuments(filter)` menghitung total data yang cocok dengan filter untuk metadata pagination.

Implementasi inti di `getAll` mengikuti pola berikut (validasi, penanganan kode prodi yang tidak dikenal, dan `populate` tetap diperlukan seperti pada implementasi lengkap):

```js
const query = Mahasiswa.find(filter)
  .select(select)
  .sort({ [sortField]: arah, _id: 1 })
  .skip((page - 1) * limit)
  .limit(limit);

const [data, total] = await Promise.all([
  query,
  Mahasiswa.countDocuments(filter),
]);

res.json({
  data,
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
```

Field `_id: 1` menjadi pengurut kedua agar urutan stabil jika beberapa dokumen memiliki nilai yang sama pada field sorting utama. Untuk mahasiswa, controller juga menjalankan `populate('prodiId', 'kode nama')` bila `prodiId` diminta (atau tidak ada projection), sehingga respons dapat menyertakan informasi prodi. Saat menambah filter atau field sort/projection, sesuaikan daftar validasi di controller dan pastikan field tersebut memang ada di schema model.

## Troubleshooting

- **`ECONNREFUSED` atau gagal terhubung:** pastikan MongoDB Community Server berjalan dan port pada `DB_URI` sesuai.
- **Compass tidak dapat terhubung:** coba `mongodb://localhost:27017`, pastikan server MongoDB berjalan, lalu periksa konfigurasi host/port.
- **Atlas gagal terhubung:** pastikan IP publik komputer terdaftar di Network Access, database user/password benar, password pada URI sudah di-URL-encode jika perlu, dan host cluster sesuai dengan URI dari Atlas.
- **Database `paw2` belum terlihat:** jalankan `node seed.js` setelah memeriksa `DB_URI`; kemudian tekan **Refresh** di Compass.
- **Operasi tulis mendapat `401`:** kirim header `x-api-key` dengan nilai `API_KEY` yang sedang dipakai aplikasi, lalu restart server setelah mengubah `.env`.
- **Perubahan hilang setelah restart:** pastikan endpoint yang digunakan memang tersimpan di MongoDB; modul fakultas dan dosen saat ini masih menggunakan array dalam memori.

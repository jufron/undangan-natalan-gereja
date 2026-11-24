# Brief Proyek: Web Undangan Ibadah Perayaan Natal Bersama 2026

> Dokumen ini adalah spesifikasi lengkap untuk dikerjakan di Google AI Studio.
> Baca seluruh dokumen sebelum menulis kode. Jika ada hal yang ambigu, pilih opsi paling sederhana yang sesuai dokumen ini, lalu catat asumsinya di bagian akhir jawaban.

---

## 1. Ringkasan Proyek

| Item | Detail |
|---|---|
| Jenis | Web undangan digital satu halaman (single page, scroll vertikal) |
| Acara | Ibadah Perayaan Natal Bersama |
| Tanggal | Senin, 28 Desember 2026 |
| Waktu | **Pukul 18.00 WITA sampai selesai** (jam berakhir tidak ditentukan) |
| Lokasi, alamat, link Google Maps | **Belum ditentukan** (tampilkan "Segera diumumkan") |
| Penyelenggara, tema, ayat | Tidak ditampilkan (belum ada) |
| Rundown acara | Tidak ditampilkan |
| Dress code | Belum ditentukan |
| Jenis undangan | **Satu link umum** untuk dibagikan ke semua orang. Tidak ada personalisasi nama tamu |
| Bahasa | Indonesia saja |
| Pengguna utama | Jemaat dan kenalan yang membuka link dari WhatsApp di HP |

**Tujuan utama:** pengunjung memahami acaranya, melihat hitung mundur, menyimpan acara ke kalender, mengisi RSVP, dan membagikan undangan ke orang lain.

---

## 2. Tech Stack

- **React JS** (Vite) dengan JavaScript. TypeScript tidak wajib.
- **Tailwind CSS** untuk seluruh styling.
- Library yang boleh dipakai:
  - `framer-motion` (atau `motion`) untuk animasi transisi saat scroll
  - `lucide-react` untuk ikon
- Hindari library UI berat (MUI, Ant Design, dsb.).
- Tidak ada backend sendiri. Penyimpanan RSVP memakai **Google Apps Script + Google Sheets** (lihat bagian 7).
- Deployment belum ditentukan. Pastikan hasil `build` statis dan bisa di-host di mana saja (Vercel, Netlify, GitHub Pages).

---

## 3. Arah Desain

### 3.1 Gaya
- **Modern minimalis dan elegan.**
- Banyak ruang kosong (whitespace), tipografi bersih, hierarki jelas, tidak ramai.
- Jangan memakai dekorasi berlebihan, clipart, atau gradien mencolok.
- Kesan: tenang, hangat, khidmat, tetapi tetap modern.

### 3.2 Warna
- **Palet warna diambil dari logo GKKD Bali** (file logo dilampirkan bersama brief ini, simpan di `src/assets/logo.png`).
- Karakter logo: lingkaran bergradasi **hitam → ungu tua → ungu magenta terang**, dengan elemen **putih/perak** (salib, lengkungan, dan teks "gkkd bali" berwarna putih dengan outline hitam).
- Palet acuan (perkiraan dari logo; cocokkan ulang dengan file logo jika perlu):

  | Token | Hex | Penggunaan |
  |---|---|---|
  | `brand-magenta` | `#C800FF` | aksen terang, highlight, garis dekoratif |
  | `brand-purple` | `#8A00B8` | warna utama (tombol, ikon, judul kecil) |
  | `brand-deep` | `#3B0052` | latar section gelap, gradasi |
  | `brand-black` | `#0A0010` | latar paling gelap, teks utama |
  | `surface` | `#FBF8FD` | latar halaman (putih sedikit keunguan) |
  | `ink` | `#1A0B22` | teks isi |
  | `muted` | `#6B5B75` | teks sekunder |
  | `silver` | `#E9E6EC` | garis pemisah, border halus |

- Daftarkan semuanya sebagai token di `tailwind.config` (atau CSS variables) agar mudah diganti.
- **Komposisi warna:**
  - Mayoritas halaman bernuansa **terang** (`surface`) dengan aksen ungu, agar elegan, minimalis, dan mudah dibaca di HP.
  - Sediakan **satu atau dua section gelap** (misalnya Countdown dan Penutup) dengan gradasi `brand-black → brand-deep → brand-purple` yang menggemakan gradasi logo.
  - Gradasi `brand-purple → brand-magenta` hanya untuk aksen kecil (garis, tombol utama, angka countdown), jangan dipakai sebagai latar besar.
- Gunakan `brand-purple` (bukan `brand-magenta`) untuk teks kecil di atas latar terang agar kontras memenuhi **WCAG AA**.
- **Penanganan logo:**
  - File logo punya **latar putih (bukan transparan)** dan margin kosong yang besar. Pangkas margin kosongnya dengan CSS (`object-fit: contain` pada wadah berukuran tetap) atau minta pemilik proyek memangkas gambarnya.
  - Karena latar logo putih, **letakkan logo di atas latar terang** (hero terang) agar menyatu. Jika harus tampil di section gelap, taruh di dalam kartu atau lingkaran putih.
  - Nama pada logo ("gkkd bali") cukup tampil lewat logo. **Jangan menambahkan teks nama gereja atau penyelenggara** di tempat lain.

### 3.3 Tipografi
- Satu font serif elegan untuk judul (contoh: Playfair Display, Cormorant Garamond) dan satu font sans-serif bersih untuk isi (contoh: Inter, Poppins). Muat lewat Google Fonts.
- Ukuran teks nyaman dibaca di HP (isi minimal 16px).

### 3.4 Animasi
- **Hanya animasi transisi saat scroll** (reveal): elemen muncul halus (fade + naik sedikit) ketika masuk viewport, sekali saja per elemen.
- Durasi 400–700 ms, easing halus.
- Wajib menghormati `prefers-reduced-motion` (matikan animasi jika diminta pengguna).
- Tidak ada animasi salju, bintang, atau partikel.

---

## 4. Responsif dan Performa

- **Mobile-first.** Mayoritas pengunjung memakai HP lewat WhatsApp.
- Harus rapi dan nyaman di seluruh ukuran layar: 320px, 360×640, 390×844, 412×915, tablet 768px dan 1024px, desktop 1440px ke atas.
- Di desktop, konten dibatasi lebar maksimum (misalnya 480–640px untuk kolom utama, atau layout dua kolom yang elegan) agar tidak terlihat melebar.
- Gunakan `dvh` (bukan hanya `vh`) untuk hero agar tidak terpotong address bar HP, dan hormati `safe-area-inset`.
- Tidak boleh ada scroll horizontal pada ukuran layar apa pun.
- Tombol dan area ketuk minimal 44×44 px.
- Gambar dioptimalkan dan diberi atribut `width`/`height` serta `loading="lazy"` bila berada di bawah fold.
- Target Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95.

---

## 5. Struktur Halaman (urutan section dari atas ke bawah)

### Section 1 — Hero
- Logo (ukuran proporsional, di atas).
- Label kecil: `Undangan`
- Judul besar: **Ibadah Perayaan Natal Bersama**
- Tanggal dan waktu: **Senin, 28 Desember 2026 · 18.00 WITA – selesai**
- Latar hero **terang** (menyatu dengan latar putih logo), dihiasi bentuk gradasi ungu halus sebagai aksen.
- Dua tombol: **Konfirmasi Kehadiran** (scroll ke form RSVP) dan **Simpan ke Kalender**.
- Indikator scroll halus di bagian bawah.

### Section 2 — Pesan Pembuka
- Teks pengantar singkat (lihat bagian 6).

### Section 3 — Hitung Mundur (Countdown)
- Menampilkan Hari, Jam, Menit, Detik menuju acara.
- Detail di bagian 7.1.

### Section 4 — Detail Acara
Tiga kartu sederhana:
1. **Tanggal**: Senin, 28 Desember 2026
2. **Waktu**: 18.00 WITA – selesai
3. **Tempat**: Segera diumumkan
   - Tombol "Lihat di Peta" **disembunyikan** selama link Google Maps belum diisi di config. Tombol otomatis muncul jika `mapsUrl` terisi.
- Satu baris catatan di bawah kartu: info dress code dan yang perlu dibawa (lihat bagian 6).

### Section 5 — RSVP
- Form konfirmasi kehadiran (detail di bagian 7.4).

### Section 6 — Bagikan Undangan
- Ajakan singkat + tombol **Bagikan via WhatsApp**.

### Section 7 — Penutup dan Footer
- Kalimat penutup, ucapan Natal, dan footer sederhana (tahun 2026).

### Elemen global
- Tombol musik melayang (floating) di pojok. **Dinonaktifkan dulu** lewat flag config (bagian 7.5).
- Navigasi: tidak perlu navbar. Cukup tombol anchor di hero. (Opsional: tombol kecil "kembali ke atas".)

---

## 6. Konten Teks (Draft Awal, Akan Direvisi)

Gunakan teks berikut apa adanya. Simpan semua teks di satu file `src/config/content.js` agar mudah direvisi tanpa menyentuh komponen.

**Label hero:** Undangan

**Judul:** Ibadah Perayaan Natal Bersama

**Sub-judul:** Senin, 28 Desember 2026 · 18.00 WITA – selesai

**Pesan pembuka:**
> Dengan penuh sukacita dan syukur, kami mengundang Bapak/Ibu/Saudara/i untuk bersama-sama merayakan kelahiran Tuhan Yesus Kristus dalam Ibadah Perayaan Natal Bersama.
>
> Kehadiran Anda akan melengkapi sukacita Natal kita tahun ini.

**Judul countdown:** Menuju Hari Natal Bersama

**Detail acara:**
- Tanggal: Senin, 28 Desember 2026
- Waktu: 18.00 WITA – selesai
- Tempat: Segera diumumkan
- Catatan: *Informasi lokasi akan kami perbarui di halaman ini. Untuk acara ini, tamu cukup membawa diri dan hati yang bersukacita. Dress code belum ditentukan.*

**Judul RSVP:** Konfirmasi Kehadiran
**Pengantar RSVP:** Mohon isi data berikut agar kami dapat mempersiapkan acara dengan baik.

**Pesan sukses setelah RSVP:**
> Terima kasih, {nama}. Konfirmasi kehadiran Anda sudah kami terima. Sampai jumpa di Ibadah Perayaan Natal Bersama!

**Pesan error:**
> Maaf, data belum terkirim. Periksa koneksi internet Anda lalu coba lagi.

**Judul bagikan:** Ajak Keluarga dan Sahabat
**Pengantar bagikan:** Bagikan undangan ini kepada orang-orang terkasih agar kita dapat merayakan Natal bersama.

**Teks pesan WhatsApp (otomatis, ikut disertai URL halaman):**
> Shalom, kami mengundang Anda untuk hadir di Ibadah Perayaan Natal Bersama pada Senin, 28 Desember 2026, pukul 18.00 WITA. Buka undangan dan konfirmasi kehadiran di sini:

**Penutup:**
> Selamat menyambut Natal. Tuhan Yesus memberkati kita semua.

**Footer:** © 2026 · Ibadah Perayaan Natal Bersama

---

## 7. Spesifikasi Fitur

### 7.1 Countdown
- Hitung mundur ke tanggal dan waktu mulai acara yang diambil dari `src/config/event.js`.
- Target hitung mundur: **28 Desember 2026 pukul 18.00 WITA** (`+08:00`).
- Acara berlangsung **"sampai selesai"**, jadi jam berakhir tidak ditentukan dan tidak boleh ditampilkan di UI.
- Config yang disediakan:
  ```js
  export const EVENT = {
    title: "Ibadah Perayaan Natal Bersama",
    startISO: "2026-12-28T18:00:00+08:00",
    endISO: null,                 // null = "sampai selesai", tidak ditampilkan di UI
    defaultDurationHours: 2,      // hanya dipakai untuk event kalender saat endISO null
    timeLabel: "18.00 WITA – selesai",
    locationName: "",             // kosong = tampil "Segera diumumkan"
    address: "",
    mapsUrl: "",                  // kosong = tombol peta disembunyikan
    timezoneLabel: "WITA",
  };
  ```
- Tampilkan empat kotak: Hari, Jam, Menit, Detik, diperbarui tiap detik.
- Jika waktu sudah lewat, tampilkan pesan: "Selamat Natal! Acara sedang atau telah berlangsung."
- Bersihkan interval saat komponen di-unmount.

### 7.2 Tambah ke Kalender (Add to Calendar)
- Satu tombol yang membuka pilihan kecil (dropdown/sheet):
  1. **Google Calendar**: buka URL template `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&details=...&location=...`
  2. **Apple/Outlook (file .ics)**: buat file `.ics` di sisi klien dan unduh.
- Event dimulai **28 Desember 2026 pukul 18.00 WITA**.
- Karena acara "sampai selesai", jam berakhir di kalender memakai `endISO` jika ada. Jika `null`, pakai durasi bawaan `defaultDurationHours` (2 jam) dan tulis di deskripsi event: "Acara berlangsung sampai selesai".
- Gunakan zona waktu eksplisit (`Asia/Makassar` atau offset `+08:00`) di link Google Calendar dan di file `.ics` (`DTSTART;TZID=Asia/Makassar` beserta definisi `VTIMEZONE`, atau waktu UTC yang sudah dikonversi dengan benar) agar jam tidak bergeser di perangkat dengan zona waktu berbeda.
- Jika lokasi belum ada, tulis di deskripsi: "Lokasi akan diumumkan di halaman undangan". Jika `locationName` dan `address` terisi, masukkan ke field lokasi event.

### 7.3 Bagikan ke WhatsApp
- Tombol memakai `https://wa.me/?text=` dengan teks dari bagian 6 yang di-`encodeURIComponent`, ditambah URL halaman saat ini (`window.location.href`).
- Dibuka di tab baru (`target="_blank"` dan `rel="noopener noreferrer"`).
- Siapkan juga **meta tag Open Graph dan Twitter Card** di `index.html` (judul, deskripsi singkat, `og:image` memakai logo atau gambar share) agar pratinjau link di WhatsApp tampil rapi. Beri komentar di mana URL gambar harus diganti setelah deploy.

### 7.4 Form RSVP (Google Apps Script → Google Sheets)

**Pendekatan:** form dibuat langsung di website (React), lalu data dikirim ke **Google Apps Script Web App** yang menulis baris baru ke Google Sheets. (Bukan Google Forms tertanam.)

**Field form:**

| Field | Tipe | Aturan |
|---|---|---|
| Nama lengkap | teks | wajib, min. 3 karakter |
| Nomor HP | tel | wajib, format Indonesia (`08…`, `62…`, atau `+62…`), 9–15 digit, hanya angka dan `+` |
| Alamat | textarea | wajib |
| Mengetahui undangan dari mana | pilihan (radio/select) | wajib, opsi: **Teman**, **Keluarga**, **Gereja**, **Media Sosial** |
| Jumlah orang yang ikut (termasuk diri sendiri) | angka (stepper − / +) | wajib, min. 1, maks. 10 (bisa diubah di config) |
| Nama orang yang diajak (selain diri sendiri) | input dinamis | muncul **otomatis sebanyak (jumlah − 1)** kolom; wajib terisi semua jika jumlah > 1; disembunyikan jika jumlah = 1 |

**Perilaku UI:**
- Validasi per field, pesan error berbahasa Indonesia di bawah field.
- Tombol kirim menampilkan status loading dan dinonaktifkan saat proses kirim (cegah klik ganda).
- Setelah sukses: tampilkan kartu terima kasih (lihat bagian 6), form disembunyikan. Sediakan tautan kecil "Isi untuk orang lain" yang mereset form.
- Setelah gagal: tampilkan pesan error, data yang sudah diisi **tidak hilang**.
- Tambahkan **honeypot** (field tersembunyi) sederhana untuk menekan spam bot.
- Aksesibel: label terhubung ke input, fokus ke error pertama saat validasi gagal.

**Pengiriman:**
- URL Apps Script disimpan di variabel lingkungan `VITE_APPS_SCRIPT_URL` (sediakan `.env.example`). **Jangan hardcode.**
- Kirim dengan `fetch` metode `POST`, body JSON, dan header `Content-Type: text/plain;charset=utf-8` agar tidak memicu preflight CORS ke Apps Script.
- Payload:
  ```json
  {
    "namaLengkap": "",
    "nomorHp": "",
    "alamat": "",
    "sumberUndangan": "Teman | Keluarga | Gereja | Media Sosial",
    "jumlahPeserta": 1,
    "namaPendamping": ["", ""],
    "honeypot": ""
  }
  ```
- Jika `VITE_APPS_SCRIPT_URL` belum diisi, form tetap berjalan dalam **mode demo** (simulasi sukses setelah 1 detik, log payload ke console) dan tampil catatan kecil khusus untuk developer di console, bukan di UI.

**File terpisah yang harus dibuat: `apps-script/Code.gs`**
- Fungsi `doPost(e)` yang:
  1. Membaca `e.postData.contents` dan mem-parse JSON.
  2. Menolak jika `honeypot` terisi.
  3. Memvalidasi ulang field wajib di sisi server.
  4. Menambah baris ke sheet bernama `RSVP` dengan kolom berurutan:
     `Timestamp | Nama Lengkap | Nomor HP | Alamat | Sumber Undangan | Jumlah Peserta | Nama Pendamping`
  5. Menyimpan **Nomor HP sebagai teks** (agar angka `0` di depan tidak hilang), misalnya dengan awalan apostrof atau format kolom `@`.
  6. Menggabungkan `namaPendamping` menjadi satu sel dipisah koma.
  7. Mengembalikan JSON `{ "status": "ok" }` atau `{ "status": "error", "message": "..." }` lewat `ContentService`.
- Gunakan `LockService` untuk mencegah tabrakan tulis saat banyak pengisi bersamaan.
- Sediakan `doGet()` sederhana yang mengembalikan teks "OK" untuk uji cepat.
- Sertakan komentar langkah deploy di bagian atas file:
  - Buat Google Sheet, tambahkan header di baris 1.
  - Extensions → Apps Script, tempel kode.
  - Deploy → New deployment → Web app → *Execute as: Me*, *Who has access: Anyone*.
  - Salin URL `/exec` ke `.env` sebagai `VITE_APPS_SCRIPT_URL`.

### 7.5 Musik Latar (Disiapkan, Dinonaktifkan Dulu)
- Buat komponen `MusicPlayer` berupa tombol bulat melayang (ikon putar/jeda) di pojok kanan bawah.
- Kontrol dengan flag di `src/config/event.js`: `ENABLE_MUSIC = false`. Saat `false`, komponen tidak dirender sama sekali.
- Jika diaktifkan: sumber audio `public/audio/bgm.mp3` (file disediakan nanti), **tidak autoplay** (browser memblokirnya). Musik hanya mulai setelah pengguna menekan tombol. Volume awal sedang, mode loop.
- Jika file audio tidak ditemukan, tombol disembunyikan tanpa error.

---

## 8. Struktur Folder yang Diharapkan

```
/
├── index.html                 # meta OG/Twitter, font, title
├── .env.example               # VITE_APPS_SCRIPT_URL=
├── public/
│   └── audio/                 # bgm.mp3 (nanti)
├── apps-script/
│   └── Code.gs                # backend RSVP
├── src/
│   ├── assets/logo.png
│   ├── config/
│   │   ├── event.js           # data acara, flag ENABLE_MUSIC
│   │   ├── content.js         # seluruh teks
│   │   └── theme.js           # token warna dari logo
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── Greeting.jsx
│   │   ├── Countdown.jsx
│   │   ├── EventDetails.jsx
│   │   ├── RsvpForm.jsx
│   │   ├── ShareSection.jsx
│   │   ├── AddToCalendar.jsx
│   │   ├── MusicPlayer.jsx
│   │   ├── Reveal.jsx         # wrapper animasi scroll
│   │   └── Footer.jsx
│   ├── utils/
│   │   ├── calendar.js        # generator link GCal dan file .ics
│   │   └── validators.js
│   ├── App.jsx
│   └── main.jsx
└── README.md                  # cara menjalankan, mengganti data, deploy
```

---

## 9. Batasan (Yang Tidak Boleh Dilakukan)

- **Jangan** menambahkan fitur yang tidak diminta: ucapan/doa tamu, galeri foto, rundown, navbar penuh, login, dashboard admin.
- **Jangan** mengarang data acara (lokasi, alamat, jam selesai, tema, ayat, nama penyelenggara). Lokasi dan alamat yang belum ada tampil sebagai "Segera diumumkan".
- **Jangan** mengutip ayat Alkitab atau teks berhak cipta.
- **Jangan** memakai gambar stok dari internet. Jika butuh ornamen, gunakan elemen CSS/SVG sederhana yang selaras dengan logo.
- **Jangan** menyimpan kunci, URL rahasia, atau data pribadi di kode sumber.
- **Jangan** memakai animasi selain transisi scroll.

---

## 10. Kriteria Selesai (Acceptance Checklist)

- [ ] Halaman terbuka tanpa error dan rapi di 320px hingga 1440px, tanpa scroll horizontal.
- [ ] Palet warna konsisten dengan logo dan terpusat sebagai token.
- [ ] Waktu tampil "18.00 WITA – selesai"; teks "Segera diumumkan" tampil hanya untuk lokasi, dan tombol peta muncul otomatis begitu `mapsUrl` diisi.
- [ ] Countdown berjalan dan benar menuju 28 Desember 2026 pukul 18.00 WITA.
- [ ] Add to Calendar menghasilkan event pukul 18.00 WITA (durasi bawaan 2 jam) di Google Calendar dan file `.ics`, dengan zona waktu yang benar.
- [ ] Logo tampil rapi (margin kosong terpangkas) di atas latar terang, dan palet warna mengikuti tabel di bagian 3.2.
- [ ] Tombol WhatsApp membuka pesan terisi lengkap dengan URL halaman.
- [ ] Form RSVP: semua field, validasi, kolom nama pendamping dinamis, status loading, sukses, dan error berfungsi.
- [ ] `Code.gs` siap ditempel dan menulis ke Google Sheets dengan urutan kolom yang benar; nomor HP tidak kehilangan angka `0`.
- [ ] Mode demo RSVP berfungsi saat URL Apps Script belum diisi.
- [ ] Animasi reveal saat scroll berjalan dan menghormati `prefers-reduced-motion`.
- [ ] Komponen musik ada, tetapi tidak tampil selama `ENABLE_MUSIC = false`.
- [ ] Semua teks bisa direvisi hanya lewat `src/config/content.js`.
- [ ] `README.md` menjelaskan cara menjalankan, mengganti data acara, mengaktifkan musik, setup Apps Script, dan build.

---

## 11. Format Jawaban yang Diharapkan

1. Bangun proyek lengkap sesuai struktur di bagian 8.
2. Tulis semua file dengan lengkap (tanpa potongan `...` atau placeholder kode).
3. Di akhir, berikan ringkasan singkat: asumsi yang diambil, hal yang masih perlu diisi pemilik proyek (lokasi, alamat, link Google Maps, URL Apps Script, file musik), dan langkah menjalankan proyek.

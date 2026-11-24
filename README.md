# Undangan Digital — Ibadah Perayaan Natal Bersama 2026
**Gereja Kristen Kemah Daud Bali** · Senin, 28 Desember 2026 · 18.00 WITA – selesai

Aplikasi undangan satu halaman berbasis React + Vite + Tailwind CSS dengan gerbang pembuka 2 tahap (Cover Sambutan -> Form RSVP tunggal) serta penyimpanan data tamu di **Firebase Firestore** (lengkap dengan penolakan nomor HP ganda dan **Panel Panitia** real-time).

## Struktur Fitur Utama
- **Form RSVP Tunggal di Halaman Pembuka**: Tamu cukup mengisi form konfirmasi kehadiran satu kali saja saat membuka undangan, termasuk menambahkan jumlah peserta dan nama anggota keluarga/orang lain yang ikut hadir.
- **Database Firebase Firestore**: Data RSVP disimpan pada koleksi `/rsvps/{phoneHash}` beserta pengunci keunikan tanpa PII pada `/rsvp_phones/{phoneHash}` untuk menolak pengisian ulang dengan nomor HP Indonesia yang sama (`08…`, `62…`, `+62…`).
- **Panel Panitia (`?panitia=1` atau tautan `Akses Panitia` di footer)**: Menampilkan daftar tamu secara real-time, ringkasan total peserta, pencarian, filter sumber undangan, serta ekspor CSV. Akses dibaca langsung melalui aturan keamanan `firestore.rules` dan dilindungi **Masuk dengan Google** untuk akun panitia terverifikasi (`jufrontamoama@gmail.com`).

## Pengembangan Lokal
```bash
npm install
npm run dev
```

## Validasi Aturan Keamanan & Build
```bash
npx eslint firestore.rules
npm run lint
npm run build
```

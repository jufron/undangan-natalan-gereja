/**
 * Konfigurasi data acara dan fitur global.
 * Ubah file ini saat lokasi, alamat, link Google Maps, atau musik latar siap digunakan.
 */
export const EVENT = {
  title: "Ibadah Perayaan Natal Bersama",
  startISO: "2026-12-28T18:00:00+08:00",
  endISO: null, // null = "sampai selesai", tidak ditampilkan di UI
  defaultDurationHours: 2, // hanya dipakai untuk event kalender saat endISO null
  dateLabel: "Senin, 28 Desember 2026",
  timeLabel: "18.00 WITA – selesai",
  locationName: "", // kosong = tampil "Segera diumumkan"
  address: "",
  mapsUrl: "", // kosong = tombol peta disembunyikan
  timezoneLabel: "WITA",
  timezoneIANA: "Asia/Makassar",
  maxGuests: 10,
};

// Flag musik latar (set true jika file public/audio/bgm.mp3 sudah tersedia)
export const ENABLE_MUSIC = false;
export const MUSIC_SRC = "/audio/bgm.mp3";

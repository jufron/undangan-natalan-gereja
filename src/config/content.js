/**
 * Seluruh konten teks halaman undangan tersimpan di sini
 * agar mudah direvisi tanpa mengubah komponen UI.
 */
export const CONTENT = {
  churchName: "Gereja Kristen Kemah Daud Bali",
  welcome: {
    label: "Undangan",
    title: "Ibadah Perayaan Natal Bersama",
    subtitle: "Senin, 28 Desember 2026 · 18.00 WITA – selesai",
    intro:
      "Dengan penuh sukacita, kami mengundang Anda untuk merayakan Natal bersama. Silakan buka undangan dan lengkapi konfirmasi kehadiran Anda.",
    openButton: "Buka Undangan",
    formStepTitle: "Konfirmasi Kehadiran",
    formStepSubtitle:
      "Mohon isi data berikut satu kali saja untuk membuka undangan. Jika mengajak keluarga atau mendaftarkan orang lain yang turut hadir, tambahkan langsung pada jumlah peserta di form ini.",
    backButton: "Kembali ke sambutan",
  },
  hero: {
    label: "Undangan",
    personalWelcome: "Selamat datang, {nama}",
    title: "Ibadah Perayaan Natal Bersama",
    subtitle: "Senin, 28 Desember 2026 · 18.00 WITA – selesai",
    primaryCta: "Lihat Detail Acara",
    secondaryCta: "Simpan ke Kalender",
    scrollHint: "Gulir ke bawah",
    snapshotDateLabel: "Tanggal",
    snapshotTimeLabel: "Waktu",
    snapshotLocationLabel: "Tempat",
  },
  calendar: {
    googleLabel: "Google Calendar",
    icsLabel: "Apple / Outlook (.ics)",
    descriptionEndNote: "Acara berlangsung sampai selesai.",
    descriptionLocationPending: "Lokasi akan diumumkan di halaman undangan.",
  },
  greeting: {
    paragraphs: [
      "Dengan penuh sukacita dan syukur, kami mengundang Bapak/Ibu/Saudara/i untuk bersama-sama merayakan kelahiran Tuhan Yesus Kristus dalam Ibadah Perayaan Natal Bersama.",
      "Kehadiran Anda akan melengkapi sukacita Natal kita tahun ini.",
    ],
  },
  countdown: {
    title: "Menuju Hari Natal Bersama",
    units: {
      days: "Hari",
      hours: "Jam",
      minutes: "Menit",
      seconds: "Detik",
    },
    expiredMessage: "Selamat Natal! Acara sedang atau telah berlangsung.",
  },
  details: {
    sectionTitle: "Detail Acara",
    cards: {
      dateLabel: "Tanggal",
      timeLabel: "Waktu",
      locationLabel: "Tempat",
      locationFallback: "Segera diumumkan",
      mapsButton: "Lihat di Peta",
    },
    note: "Informasi lokasi akan kami perbarui di halaman ini. Untuk acara ini, tamu cukup membawa diri dan hati yang bersukacita. Dress code belum ditentukan.",
  },
  rsvp: {
    title: "Konfirmasi Kehadiran",
    intro: "Mohon isi data berikut agar kami dapat mempersiapkan acara dengan baik.",
    fields: {
      fullNameLabel: "Nama lengkap",
      fullNamePlaceholder: "Masukkan nama lengkap Anda",
      phoneLabel: "Nomor HP (WhatsApp)",
      phonePlaceholder: "Contoh: 081234567890",
      addressLabel: "Alamat",
      addressPlaceholder: "Alamat tempat tinggal saat ini",
      sourceLabel: "Mengetahui undangan dari mana",
      sourceOptions: ["Teman", "Keluarga", "Gereja", "Media Sosial"],
      guestCountLabel: "Jumlah orang yang ikut (termasuk diri sendiri & orang lain)",
      guestCountHint:
        "Jika mendaftarkan anggota keluarga atau orang lain yang ikut hadir, ubah jumlah peserta lalu tulis nama mereka di bawah ini (cukup isi sekali saja).",
      guestCountDecreaseLabel: "Kurangi jumlah peserta",
      guestCountIncreaseLabel: "Tambah jumlah peserta",
      companionTitle: "Nama orang lain / pendamping yang turut hadir",
      companionPrefix: "Nama peserta tambahan",
      companionPlaceholder: "Masukkan nama lengkap peserta ke-",
    },
    submitLabel: "Kirim & Buka Undangan",
    submittingLabel: "Mengirim...",
    successTemplate:
      "Terima kasih, {nama}. Konfirmasi kehadiran Anda sudah kami terima. Sampai jumpa di Ibadah Perayaan Natal Bersama!",
    errorMessage:
      "Maaf, data belum terkirim. Periksa koneksi internet Anda lalu coba lagi.",
    validation: {
      fullNameRequired: "Nama lengkap wajib diisi.",
      fullNameMin: "Nama lengkap minimal 3 karakter.",
      phoneRequired: "Nomor HP wajib diisi.",
      phoneChars: "Nomor HP hanya boleh berisi angka dan tanda + di awal.",
      phoneFormat:
        "Gunakan format nomor Indonesia yang valid (08…, 62…, atau +62…), 9–15 digit.",
      duplicatePhone:
        "Nomor HP ini sudah terdaftar. Pengisian ganda tidak diperbolehkan.",
      addressRequired: "Alamat wajib diisi.",
      sourceRequired: "Pilih dari mana Anda mengetahui undangan ini.",
      guestCountRange: "Jumlah peserta harus antara 1 hingga {max} orang.",
      companionRequired: "Nama peserta tambahan ke-{index} wajib diisi.",
    },
  },
  rsvpSummary: {
    kicker: "Konfirmasi Tercatat",
    title: "Status Kehadiran Anda",
    guestMetaTemplate: "Atas nama {nama} · {jumlah} peserta",
    singleFormNote:
      "Konfirmasi kehadiran Anda beserta seluruh peserta yang didaftarkan telah tersimpan.",
  },
  panitia: {
    kicker: "Panel Panitia",
    title: "Daftar Tamu Terkonfirmasi",
    subtitle:
      "Pantau daftar jemaat dan tamu yang telah mengisi konfirmasi kehadiran secara langsung dari database.",
    backToInvitation: "Kembali ke Undangan",
    signInTitle: "Masuk sebagai Panitia",
    signInDescription:
      "Gunakan akun Google panitia yang berwenang untuk melihat data lengkap dan nomor kontak tamu.",
    signInButton: "Masuk dengan Google",
    signingInButton: "Memverifikasi...",
    signOutButton: "Keluar",
    refreshButton: "Muat Ulang",
    exportCsvButton: "Unduh CSV",
    retryButton: "Coba Lagi",
    totalRegistrationsLabel: "Total Pendaftar",
    totalGuestsLabel: "Total Peserta Hadir",
    searchPlaceholder: "Cari nama, nomor HP, alamat, atau pendamping...",
    allSourcesLabel: "Semua Sumber",
    emptyMessage: "Belum ada tamu yang mengisi konfirmasi kehadiran.",
    noMatchMessage: "Tidak ada data tamu yang sesuai dengan pencarian Anda.",
  },
  share: {
    title: "Ajak Keluarga dan Sahabat",
    intro:
      "Bagikan undangan ini kepada orang-orang terkasih agar kita dapat merayakan Natal bersama.",
    whatsappButton: "Bagikan via WhatsApp",
    whatsappText:
      "Shalom, kami mengundang Anda untuk hadir di Ibadah Perayaan Natal Bersama pada Senin, 28 Desember 2026, pukul 18.00 WITA. Buka undangan dan konfirmasi kehadiran di sini:",
  },
  footer: {
    closing: "Selamat menyambut Natal. Tuhan Yesus memberkati kita semua.",
    copyright: "© 2026 · Ibadah Perayaan Natal Bersama",
    backToTop: "Kembali ke atas",
    panitiaLink: "Akses Panitia",
  },
  music: {
    playLabel: "Putar musik latar",
    pauseLabel: "Jeda musik latar",
  },
};

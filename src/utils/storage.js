const STORAGE_KEY = "natal_bersama_2026_rsvp_session";

/**
 * Membaca status konfirmasi & pembukaan undangan dari localStorage secara aman.
 */
export function loadGuestSession() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || parsed.unlocked !== true || !parsed.namaLengkap) {
      return null;
    }

    return {
      unlocked: true,
      namaLengkap: String(parsed.namaLengkap),
      jumlahPeserta: Number(parsed.jumlahPeserta) || 1,
      submittedAt: parsed.submittedAt || "",
    };
  } catch {
    return null;
  }
}

/**
 * Menyimpan status undangan terbuka dan ringkasan tamu ke localStorage.
 */
export function saveGuestSession({ namaLengkap, jumlahPeserta }) {
  const session = {
    unlocked: true,
    namaLengkap: String(namaLengkap || "").trim(),
    jumlahPeserta: Number(jumlahPeserta) || 1,
    submittedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Abaikan jika browser memblokir localStorage (mis. mode privat ketat)
    }
  }

  return session;
}

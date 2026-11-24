import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase.ts";

const ALLOWED_SOURCES = new Set(["Teman", "Keluarga", "Gereja", "Media Sosial"]);
const MAX_GUESTS = 10;

export class DuplicatePhoneError extends Error {
  constructor(
    message = "Nomor HP ini sudah terdaftar. Pengisian ganda tidak diperbolehkan."
  ) {
    super(message);
    this.name = "DuplicatePhoneError";
  }
}

export function normalizeIndonesianPhone(rawPhone: string): string {
  const cleaned = String(rawPhone || "").trim();
  if (cleaned.startsWith("+62")) {
    return cleaned;
  }
  if (cleaned.startsWith("62")) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("08")) {
    return `+62${cleaned.slice(1)}`;
  }
  return cleaned;
}

export async function hashCanonicalPhone(canonicalPhone: string): Promise<string> {
  const data = new TextEncoder().encode(canonicalPhone);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface SubmitRsvpPayload {
  namaLengkap: string;
  nomorHp: string;
  alamat: string;
  sumberUndangan: string;
  jumlahPeserta: number;
  namaPendamping?: string[];
  honeypot?: string;
}

export interface RsvpRecord {
  id: string;
  namaLengkap: string;
  nomorHp: string;
  nomorHpKanonik: string;
  alamat: string;
  sumberUndangan: string;
  jumlahPeserta: number;
  namaPendamping: string[];
  createdAt: string;
}

function sanitizeAndValidatePayload(payload: SubmitRsvpPayload) {
  if (String(payload.honeypot || "").trim() !== "") {
    throw new Error("Permintaan tidak valid.");
  }

  const namaLengkap = String(payload.namaLengkap || "").trim().slice(0, 120);
  const nomorHp = String(payload.nomorHp || "").trim().slice(0, 16);
  const alamat = String(payload.alamat || "").trim().slice(0, 500);
  const sumberUndangan = String(payload.sumberUndangan || "").trim();
  const jumlahPeserta = Math.max(
    1,
    Math.min(MAX_GUESTS, Math.trunc(Number(payload.jumlahPeserta) || 1))
  );

  if (namaLengkap.length < 3) {
    throw new Error("Nama lengkap minimal 3 karakter.");
  }
  if (!/^\+?[0-9]+$/.test(nomorHp)) {
    throw new Error("Format nomor HP tidak valid.");
  }
  const nomorHpKanonik = normalizeIndonesianPhone(nomorHp);
  if (!/^\+62[0-9]{8,13}$/.test(nomorHpKanonik)) {
    throw new Error("Gunakan format nomor HP Indonesia yang valid (08…, 62…, atau +62…).");
  }
  if (!alamat) {
    throw new Error("Alamat wajib diisi.");
  }
  if (!ALLOWED_SOURCES.has(sumberUndangan)) {
    throw new Error("Sumber undangan tidak valid.");
  }

  const expectedCompanions = jumlahPeserta - 1;
  const rawCompanions = Array.isArray(payload.namaPendamping)
    ? payload.namaPendamping
    : [];
  const namaPendamping: string[] = [];

  for (let i = 0; i < expectedCompanions; i += 1) {
    const comp = String(rawCompanions[i] || "").trim().slice(0, 120);
    if (!comp) {
      throw new Error(`Nama pendamping ke-${i + 1} wajib diisi.`);
    }
    namaPendamping.push(comp);
  }

  return {
    namaLengkap,
    nomorHp,
    nomorHpKanonik,
    alamat,
    sumberUndangan,
    jumlahPeserta,
    namaPendamping,
  };
}

export async function submitRsvpToFirestore(payload: SubmitRsvpPayload) {
  const sanitized = sanitizeAndValidatePayload(payload);
  const phoneHash = await hashCanonicalPhone(sanitized.nomorHpKanonik);
  const phoneLockPath = `rsvp_phones/${phoneHash}`;
  const rsvpPath = `rsvps/${phoneHash}`;

  const phoneLockRef = doc(db, "rsvp_phones", phoneHash);
  const rsvpRef = doc(db, "rsvps", phoneHash);

  // Cek terlebih dahulu apakah nomor HP sudah terdaftar di indeks non-PII
  let existingLockSnap;
  try {
    existingLockSnap = await getDoc(phoneLockRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, phoneLockPath);
  }

  if (existingLockSnap.exists()) {
    throw new DuplicatePhoneError();
  }

  const batch = writeBatch(db);
  batch.set(phoneLockRef, {
    createdAt: serverTimestamp(),
  });
  batch.set(rsvpRef, {
    ...sanitized,
    phoneHash,
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    // Antisipasi race condition jika dua pengiriman terjadi di milidetik yang sama
    try {
      const recheckSnap = await getDoc(phoneLockRef);
      if (recheckSnap.exists()) {
        throw new DuplicatePhoneError();
      }
    } catch (recheckError) {
      if (recheckError instanceof DuplicatePhoneError) {
        throw recheckError;
      }
    }
    handleFirestoreError(error, OperationType.WRITE, rsvpPath);
  }

  return {
    id: phoneHash,
    ...sanitized,
  };
}

function mapSnapshotToRecord(
  id: string,
  data: Record<string, unknown>
): RsvpRecord {
  const rawCreatedAt = data.createdAt;
  let createdAtIso = "";
  if (rawCreatedAt instanceof Timestamp) {
    createdAtIso = rawCreatedAt.toDate().toISOString();
  } else if (
    rawCreatedAt &&
    typeof (rawCreatedAt as { toDate?: () => Date }).toDate === "function"
  ) {
    createdAtIso = (rawCreatedAt as { toDate: () => Date })
      .toDate()
      .toISOString();
  } else if (typeof rawCreatedAt === "string") {
    createdAtIso = rawCreatedAt;
  }

  return {
    id,
    namaLengkap: String(data.namaLengkap || ""),
    nomorHp: String(data.nomorHp || ""),
    nomorHpKanonik: String(data.nomorHpKanonik || ""),
    alamat: String(data.alamat || ""),
    sumberUndangan: String(data.sumberUndangan || ""),
    jumlahPeserta: Number(data.jumlahPeserta) || 1,
    namaPendamping: Array.isArray(data.namaPendamping)
      ? data.namaPendamping.map((n) => String(n))
      : [],
    createdAt: createdAtIso,
  };
}

export function buildRsvpSummary(rows: RsvpRecord[]) {
  const totalSubmissions = rows.length;
  const totalGuests = rows.reduce(
    (sum, row) => sum + (Number(row.jumlahPeserta) || 1),
    0
  );

  const bySource: Record<string, number> = {
    Teman: 0,
    Keluarga: 0,
    Gereja: 0,
    "Media Sosial": 0,
  };

  for (const row of rows) {
    if (row.sumberUndangan in bySource) {
      bySource[row.sumberUndangan] += Number(row.jumlahPeserta) || 1;
    }
  }

  return {
    totalSubmissions,
    totalGuests,
    bySource,
  };
}

export function subscribePanitiaRsvps(
  onData: (rows: RsvpRecord[]) => void,
  onError: (err: unknown) => void
) {
  const rsvpsQuery = query(
    collection(db, "rsvps"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    rsvpsQuery,
    (snapshot) => {
      const rows = snapshot.docs.map((docSnap) =>
        mapSnapshotToRecord(docSnap.id, docSnap.data())
      );
      onData(rows);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, "rsvps");
      } catch (wrappedError) {
        onError(wrappedError);
      }
    }
  );
}

export async function fetchPanitiaRsvpsOnce(): Promise<RsvpRecord[]> {
  const rsvpsQuery = query(
    collection(db, "rsvps"),
    orderBy("createdAt", "desc")
  );

  try {
    const snapshot = await getDocs(rsvpsQuery);
    return snapshot.docs.map((docSnap) =>
      mapSnapshotToRecord(docSnap.id, docSnap.data())
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "rsvps");
  }
}

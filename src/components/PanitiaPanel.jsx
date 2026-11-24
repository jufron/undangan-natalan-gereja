import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Download,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
} from "lucide-react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleAuthProvider } from "../lib/firebase";
import {
  buildRsvpSummary,
  fetchPanitiaRsvpsOnce,
  subscribePanitiaRsvps,
} from "../lib/rsvpService";
import { CONTENT } from "../config/content";
import LogoMark from "./LogoMark";

function formatWitaDateTime(isoString) {
  if (!isoString) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Makassar",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

function escapeCsvCell(value) {
  let str = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatPanitiaLoadError(err) {
  const raw = err instanceof Error ? err.message : String(err || "");
  const lower = raw.toLowerCase();
  if (
    lower.includes("missing or insufficient permissions") ||
    lower.includes("permission-denied")
  ) {
    return "Akun Google ini tidak terdaftar sebagai panitia untuk mengakses data tamu.";
  }
  if (lower.includes("quota exceeded")) {
    return "Batas kuota harian Firestore telah tercapai. Silakan coba lagi besok atau tingkatkan paket Firebase.";
  }
  return "Gagal memuat daftar tamu dari Firebase. Periksa koneksi Anda lalu coba lagi.";
}

export default function PanitiaPanel({ onBack }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [guests, setGuests] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("ALL");

  const summary = useMemo(() => buildRsvpSummary(guests), [guests]);

  const handleManualRefresh = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    setDataError("");
    try {
      const rows = await fetchPanitiaRsvpsOnce();
      setGuests(rows);
    } catch (err) {
      setDataError(formatPanitiaLoadError(err));
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      setUser(currentUser);
      setAuthReady(true);

      if (!currentUser) {
        setGuests([]);
        setDataError("");
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      setDataError("");
      unsubscribeSnapshot = subscribePanitiaRsvps(
        (rows) => {
          setGuests(rows);
          setDataError("");
          setLoadingData(false);
        },
        (err) => {
          setGuests([]);
          setDataError(formatPanitiaLoadError(err));
          setLoadingData(false);
        }
      );
    });

    return () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
      unsubscribeAuth();
    };
  }, []);

  async function handleSignIn() {
    setAuthLoading(true);
    setAuthError("");
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch {
      setAuthError("Proses masuk dengan Google dibatalkan atau gagal. Silakan coba lagi.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut(auth);
    setGuests([]);
    setDataError("");
  }

  const filteredGuests = useMemo(() => {
    const queryText = searchQuery.trim().toLowerCase();
    return guests.filter((row) => {
      if (sourceFilter !== "ALL" && row.sumberUndangan !== sourceFilter) {
        return false;
      }
      if (!queryText) return true;
      const companions = Array.isArray(row.namaPendamping)
        ? row.namaPendamping.join(" ").toLowerCase()
        : "";
      return (
        String(row.namaLengkap || "").toLowerCase().includes(queryText) ||
        String(row.nomorHp || "").toLowerCase().includes(queryText) ||
        String(row.alamat || "").toLowerCase().includes(queryText) ||
        companions.includes(queryText)
      );
    });
  }, [guests, searchQuery, sourceFilter]);

  function handleExportCsv() {
    const headers = [
      "Waktu Daftar (WITA)",
      "Nama Lengkap",
      "Nomor HP",
      "Alamat",
      "Sumber Undangan",
      "Jumlah Peserta",
      "Nama Pendamping",
    ];
    const rows = filteredGuests.map((item) => [
      formatWitaDateTime(item.createdAt),
      item.namaLengkap,
      `'${item.nomorHp}`,
      item.alamat,
      item.sumberUndangan,
      item.jumlahPeserta,
      Array.isArray(item.namaPendamping) ? item.namaPendamping.join(", ") : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvCell).join(","))
      .join("\r\n");

    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "daftar-tamu-natal-2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="min-h-[100dvh] bg-[#FBF8FD] text-[#1A0B22] px-5 sm:px-8 lg:px-12 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(3rem,env(safe-area-inset-bottom))] overflow-x-clip">
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between gap-4 pb-5 border-b border-[#E9E6EC]">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] -ml-2 px-2 py-2 text-sm font-medium text-[#6B5B75] hover:text-[#1A0B22] inline-flex items-center gap-2 transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A00B8] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{CONTENT.panitia.backToInvitation}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-semibold text-[#6B5B75]">
            {CONTENT.churchName}
          </span>
          <LogoMark size="sm" />
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto pt-10 sm:pt-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8 border-b border-[#E9E6EC]">
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-[0.14em] text-[#9B793E] mb-2">
              {CONTENT.panitia.kicker}
            </p>
            <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-[#0A0010] tracking-tight text-balance">
              {CONTENT.panitia.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#6B5B75] max-w-2xl">
              {CONTENT.panitia.subtitle}
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-[#6B5B75] hidden md:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="min-h-[44px] px-4 py-2 rounded-lg border border-[#D5CEDB] bg-white hover:border-[#8A00B8] text-sm font-medium text-[#1A0B22] inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{CONTENT.panitia.signOutButton}</span>
              </button>
            </div>
          )}
        </div>

        {!authReady ? (
          <div className="py-16 flex items-center justify-center gap-3 text-sm text-[#6B5B75]">
            <Loader2 className="w-5 h-5 animate-spin text-[#8A00B8]" aria-hidden="true" />
            <span>Memeriksa sesi masuk...</span>
          </div>
        ) : !user ? (
          <div className="py-14 max-w-md">
            <h2 className="font-serif text-2xl font-semibold text-[#0A0010]">
              {CONTENT.panitia.signInTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#6B5B75] leading-relaxed">
              {CONTENT.panitia.signInDescription}
            </p>

            {authError && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-2.5"
              >
                <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleSignIn}
              disabled={authLoading}
              className="mt-6 min-h-[48px] px-6 py-3 rounded-lg bg-[#8A00B8] hover:bg-[#6E0094] text-white font-semibold text-sm sm:text-base transition-colors inline-flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 disabled:opacity-65 cursor-pointer"
            >
              {authLoading && (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
              )}
              <span>
                {authLoading
                  ? CONTENT.panitia.signingInButton
                  : CONTENT.panitia.signInButton}
              </span>
            </button>
          </div>
        ) : loadingData ? (
          <div className="py-16 flex items-center justify-center gap-3 text-sm text-[#6B5B75]">
            <Loader2 className="w-5 h-5 animate-spin text-[#8A00B8]" aria-hidden="true" />
            <span>Memuat data tamu dari Firebase...</span>
          </div>
        ) : dataError ? (
          <div className="py-10 max-w-lg space-y-4">
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{dataError}</span>
            </div>
            <button
              type="button"
              onClick={handleManualRefresh}
              className="min-h-[44px] px-5 py-2.5 rounded-lg border border-[#8A00B8] text-sm font-semibold text-[#8A00B8] hover:bg-[#8A00B8] hover:text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{CONTENT.panitia.retryButton}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8 pt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-[#E9E6EC] divide-y sm:divide-y-0 sm:divide-x divide-[#E9E6EC]">
              <div className="py-5 pr-4">
                <p className="text-xs font-medium text-[#6B5B75]">
                  {CONTENT.panitia.totalRegistrationsLabel}
                </p>
                <p className="mt-1 font-serif text-3xl sm:text-4xl font-semibold text-[#0A0010] tabular-nums">
                  {summary.totalSubmissions}
                </p>
              </div>

              <div className="py-5 pl-4 sm:px-6">
                <p className="text-xs font-medium text-[#6B5B75]">
                  {CONTENT.panitia.totalGuestsLabel}
                </p>
                <p className="mt-1 font-serif text-3xl sm:text-4xl font-semibold text-[#8A00B8] tabular-nums">
                  {summary.totalGuests}
                </p>
              </div>

              <div className="py-5 pr-4 sm:px-6">
                <p className="text-xs font-medium text-[#6B5B75]">
                  Gereja / Keluarga
                </p>
                <p className="mt-1 font-serif text-3xl sm:text-4xl font-semibold text-[#1A0B22] tabular-nums">
                  {(summary.bySource?.Gereja || 0) +
                    (summary.bySource?.Keluarga || 0)}
                </p>
              </div>

              <div className="py-5 pl-4 sm:pl-6">
                <p className="text-xs font-medium text-[#6B5B75]">
                  Teman / Media Sosial
                </p>
                <p className="mt-1 font-serif text-3xl sm:text-4xl font-semibold text-[#1A0B22] tabular-nums">
                  {(summary.bySource?.Teman || 0) +
                    (summary.bySource?.["Media Sosial"] || 0)}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="w-4 h-4 text-[#6B5B75] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={CONTENT.panitia.searchPlaceholder}
                    aria-label={CONTENT.panitia.searchPlaceholder}
                    className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-lg border border-[#D5CEDB] bg-white text-sm text-[#1A0B22] placeholder:text-[#6B5B75]/75 focus:outline-none focus:ring-2 focus:ring-[#8A00B8]/20 focus:border-[#8A00B8]"
                  />
                </div>

                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  aria-label="Filter sumber undangan"
                  className="min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D5CEDB] bg-white text-sm text-[#1A0B22] focus:outline-none focus:ring-2 focus:ring-[#8A00B8]/20 focus:border-[#8A00B8]"
                >
                  <option value="ALL">{CONTENT.panitia.allSourcesLabel}</option>
                  {CONTENT.rsvp.fields.sourceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  className="min-h-[44px] px-4 py-2 rounded-lg border border-[#D5CEDB] bg-white hover:border-[#8A00B8] text-sm font-medium text-[#1A0B22] inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{CONTENT.panitia.refreshButton}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={filteredGuests.length === 0}
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-[#8A00B8] hover:bg-[#6E0094] disabled:opacity-45 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{CONTENT.panitia.exportCsvButton}</span>
                </button>
              </div>
            </div>

            {guests.length === 0 ? (
              <p className="py-12 text-center text-sm sm:text-base text-[#6B5B75] border-y border-[#E9E6EC]">
                {CONTENT.panitia.emptyMessage}
              </p>
            ) : filteredGuests.length === 0 ? (
              <p className="py-12 text-center text-sm sm:text-base text-[#6B5B75] border-y border-[#E9E6EC]">
                {CONTENT.panitia.noMatchMessage}
              </p>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto border-y border-[#E9E6EC]">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#E9E6EC] text-xs font-semibold text-[#6B5B75]">
                        <th className="py-3.5 pr-4">Waktu (WITA)</th>
                        <th className="py-3.5 px-4">Nama Lengkap</th>
                        <th className="py-3.5 px-4">Nomor HP</th>
                        <th className="py-3.5 px-4">Alamat</th>
                        <th className="py-3.5 px-4">Sumber</th>
                        <th className="py-3.5 px-4 text-right">Peserta</th>
                        <th className="py-3.5 pl-4">Pendamping</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E6EC]">
                      {filteredGuests.map((row) => (
                        <tr key={row.id} className="align-top">
                          <td className="py-4 pr-4 text-xs text-[#6B5B75] whitespace-nowrap tabular-nums">
                            {formatWitaDateTime(row.createdAt)}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#1A0B22]">
                            {row.namaLengkap}
                          </td>
                          <td className="py-4 px-4 text-[#1A0B22] tabular-nums whitespace-nowrap">
                            {row.nomorHp}
                          </td>
                          <td className="py-4 px-4 text-[#6B5B75] max-w-[220px]">
                            {row.alamat}
                          </td>
                          <td className="py-4 px-4 text-[#6B5B75] whitespace-nowrap">
                            {row.sumberUndangan}
                          </td>
                          <td className="py-4 px-4 text-right font-semibold text-[#8A00B8] tabular-nums">
                            {row.jumlahPeserta}
                          </td>
                          <td className="py-4 pl-4 text-[#6B5B75]">
                            {Array.isArray(row.namaPendamping) &&
                            row.namaPendamping.length > 0
                              ? row.namaPendamping.join(", ")
                              : "–"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden divide-y divide-[#E9E6EC] border-y border-[#E9E6EC]">
                  {filteredGuests.map((row) => (
                    <div key={row.id} className="py-4 space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-semibold text-base text-[#1A0B22]">
                          {row.namaLengkap}
                        </p>
                        <span className="text-xs font-semibold text-[#8A00B8] tabular-nums shrink-0">
                          {row.jumlahPeserta} orang
                        </span>
                      </div>
                      <p className="text-sm text-[#1A0B22] tabular-nums">
                        {row.nomorHp} ·{" "}
                        <span className="text-[#6B5B75]">{row.sumberUndangan}</span>
                      </p>
                      <p className="text-sm text-[#6B5B75]">{row.alamat}</p>
                      {Array.isArray(row.namaPendamping) &&
                        row.namaPendamping.length > 0 && (
                          <p className="text-xs text-[#6B5B75]">
                            Pendamping: {row.namaPendamping.join(", ")}
                          </p>
                        )}
                      <p className="text-xs text-[#6B5B75]/80 tabular-nums">
                        {formatWitaDateTime(row.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

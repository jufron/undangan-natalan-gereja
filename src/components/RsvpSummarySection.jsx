import { CheckCircle2 } from "lucide-react";
import { CONTENT } from "../config/content";
import Reveal from "./Reveal";

/**
 * Menampilkan ringkasan konfirmasi kehadiran secara editorial (read-only),
 * tanpa form tambahan di halaman utama karena seluruh pendaftaran peserta
 * sudah disatukan pada form pembuka saat welcome.
 */
export default function RsvpSummarySection({ session }) {
  const guestName = session?.namaLengkap || "";
  const guestCount = session?.jumlahPeserta || 1;

  return (
    <section
      id="rsvp"
      aria-labelledby="rsvp-status-heading"
      className="bg-[#FFFFFF] border-t border-[#E9E6EC] px-5 sm:px-8 lg:px-12 py-16 sm:py-24"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.14em] text-[#8A00B8] mb-2">
                {CONTENT.rsvpSummary.kicker}
              </p>
              <h2
                id="rsvp-status-heading"
                className="font-serif font-semibold text-3xl sm:text-4xl text-[#0A0010] tracking-tight text-balance"
              >
                {CONTENT.rsvpSummary.title}
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
              <div
                role="status"
                aria-live="polite"
                className="border-t border-[#E9E6EC] pt-6 space-y-4"
              >
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A00B8]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>
                    {CONTENT.rsvpSummary.guestMetaTemplate
                      .replace("{nama}", guestName)
                      .replace("{jumlah}", String(guestCount))}
                  </span>
                </div>

                <p className="text-base sm:text-lg font-medium text-[#1A0B22] leading-relaxed">
                  {CONTENT.rsvp.successTemplate.replace("{nama}", guestName)}
                </p>

                <p className="pt-3 border-t border-[#E9E6EC] text-sm text-[#6B5B75]">
                  {CONTENT.rsvpSummary.singleFormNote}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

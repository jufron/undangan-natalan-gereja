import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { EVENT } from "../config/event";
import { CONTENT } from "../config/content";
import AddToCalendar from "./AddToCalendar";
import LogoMark from "./LogoMark";
import ParallaxLayer from "./ParallaxLayer";
import Reveal from "./Reveal";
import {
  HangingOrnaments,
  PineSprig,
  StarOfBethlehem,
} from "./ChristmasOrnaments";

export default function Hero({ guestName = "" }) {
  const heroRef = useRef(null);

  const locationDisplay =
    EVENT.locationName && EVENT.locationName.trim()
      ? EVENT.locationName.trim()
      : CONTENT.details.cards.locationFallback;

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <header
      ref={heroRef}
      className="relative min-h-[100dvh] flex flex-col justify-between bg-[#FBF8FD] text-[#1A0B22] px-5 sm:px-8 lg:px-12 pt-[max(1.25rem,env(safe-area-inset-top))] pb-6 overflow-x-clip"
    >
      {/* Lapisan ornamen Natal garis emas sampanye dengan animasi parallax halus */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <ParallaxLayer
          targetRef={heroRef}
          offset={["start start", "end start"]}
          range={[0, 48]}
          className="absolute -top-2 right-2 sm:right-10 lg:right-16 text-[#9B793E] opacity-40"
        >
          <HangingOrnaments className="w-28 h-40 sm:w-36 sm:h-48" />
        </ParallaxLayer>

        <ParallaxLayer
          targetRef={heroRef}
          offset={["start start", "end start"]}
          range={[0, -30]}
          className="absolute -bottom-8 -left-10 sm:left-0 text-[#9B793E] opacity-30"
        >
          <PineSprig className="w-40 h-40 sm:w-52 sm:h-52" />
        </ParallaxLayer>
      </div>

      {/* Baris atas editorial: Logo + Gereja Kristen Kemah Daud Bali */}
      <div className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between gap-4 pb-5 border-b border-[#E9E6EC]">
        <div className="flex items-center gap-3 min-w-0">
          <LogoMark size="sm" />
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-[#1A0B22] leading-snug">
              {CONTENT.churchName}
            </p>
            <p className="text-[11px] sm:text-xs text-[#9B793E] font-medium">
              {CONTENT.hero.label}
            </p>
          </div>
        </div>

        <p className="hidden sm:block text-xs sm:text-sm font-medium text-[#6B5B75] text-right whitespace-nowrap shrink-0">
          {EVENT.dateLabel}
        </p>
      </div>

      {/* Komposisi utama editorial asimetris 12-kolom dengan kedalaman parallax halus */}
      <div className="relative z-10 max-w-5xl w-full mx-auto my-auto py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* Kolom kiri: Sapaan personal & judul monumental */}
          <ParallaxLayer
            targetRef={heroRef}
            offset={["start start", "end start"]}
            range={[0, 18]}
            className="lg:col-span-7"
          >
            <Reveal>
              <div className="inline-flex items-center gap-2 text-[#9B793E] mb-3">
                <StarOfBethlehem className="w-5 h-5 shrink-0" />
                {guestName ? (
                  <p className="text-sm sm:text-base font-semibold text-[#8A00B8]">
                    {CONTENT.hero.personalWelcome.replace("{nama}", guestName)}
                  </p>
                ) : (
                  <p className="text-sm font-semibold tracking-[0.14em] text-[#8A00B8]">
                    {CONTENT.hero.label}
                  </p>
                )}
              </div>

              <h1 className="font-serif font-semibold text-[#0A0010] leading-[1.05] tracking-tight text-[clamp(2.5rem,6vw,4.75rem)] text-balance">
                {CONTENT.hero.title}
              </h1>

              <div className="flex items-center gap-2 mt-7" aria-hidden="true">
                <span className="w-12 h-[2px] bg-[#8A00B8]" />
                <span className="w-6 h-[2px] bg-[#9B793E]" />
              </div>
            </Reveal>
          </ParallaxLayer>

          {/* Kolom kanan: Ringkasan terstruktur dengan garis pemisah tipis & tombol solid */}
          <div className="lg:col-span-5 lg:border-l lg:border-[#E9E6EC] lg:pl-10">
            <Reveal delay={0.08}>
              <dl className="divide-y divide-[#E9E6EC] border-t border-b border-[#E9E6EC]">
                <div className="py-3.5 flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-[#6B5B75]">
                    {CONTENT.hero.snapshotDateLabel}
                  </dt>
                  <dd className="text-sm sm:text-base font-semibold text-[#1A0B22] text-right">
                    {EVENT.dateLabel}
                  </dd>
                </div>

                <div className="py-3.5 flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-[#6B5B75]">
                    {CONTENT.hero.snapshotTimeLabel}
                  </dt>
                  <dd className="text-sm sm:text-base font-semibold text-[#1A0B22] text-right">
                    {EVENT.timeLabel}
                  </dd>
                </div>

                <div className="py-3.5 flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-[#6B5B75]">
                    {CONTENT.hero.snapshotLocationLabel}
                  </dt>
                  <dd className="text-sm sm:text-base font-semibold text-[#1A0B22] text-right">
                    {locationDisplay}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection("detail")}
                  className="w-full min-h-[48px] px-6 py-3 rounded-lg bg-[#8A00B8] hover:bg-[#6E0094] text-white font-semibold text-sm sm:text-base transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A00B8] cursor-pointer"
                >
                  {CONTENT.hero.primaryCta}
                </button>

                <AddToCalendar variant="light" align="right" fullWidth />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Baris bawah editorial dengan indikator gulir */}
      <div className="relative z-10 max-w-5xl w-full mx-auto pt-4 border-t border-[#E9E6EC] flex items-center justify-between">
        <button
          type="button"
          onClick={() => scrollToSection("pembuka")}
          aria-label={CONTENT.hero.scrollHint}
          className="min-h-[44px] -ml-2 px-2 py-2 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#6B5B75] hover:text-[#8A00B8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A00B8] rounded-lg cursor-pointer"
        >
          <span>{CONTENT.hero.scrollHint}</span>
          <ArrowDown className="w-4 h-4" aria-hidden="true" />
        </button>

        <span className="text-xs text-[#6B5B75] hidden sm:inline">
          {EVENT.timeLabel}
        </span>
      </div>
    </header>
  );
}

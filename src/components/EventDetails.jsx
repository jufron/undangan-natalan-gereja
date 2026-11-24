import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { EVENT } from "../config/event";
import { CONTENT } from "../config/content";
import ParallaxLayer from "./ParallaxLayer";
import Reveal from "./Reveal";
import { StarOfBethlehem } from "./ChristmasOrnaments";

export default function EventDetails() {
  const sectionRef = useRef(null);
  const hasLocationName = Boolean(EVENT.locationName && EVENT.locationName.trim());
  const hasAddress = Boolean(EVENT.address && EVENT.address.trim());
  const hasMapsUrl = Boolean(EVENT.mapsUrl && EVENT.mapsUrl.trim());

  const locationDisplay = hasLocationName
    ? EVENT.locationName.trim()
    : CONTENT.details.cards.locationFallback;

  return (
    <section
      ref={sectionRef}
      id="detail"
      aria-labelledby="details-heading"
      className="relative bg-[#FBF8FD] px-5 sm:px-8 lg:px-12 py-16 sm:py-24 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <ParallaxLayer
          targetRef={sectionRef}
          range={[-20, 20]}
          className="absolute top-6 right-4 sm:right-12 text-[#9B793E] opacity-30"
        >
          <StarOfBethlehem className="w-20 h-20 sm:w-24 sm:h-24" />
        </ParallaxLayer>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <Reveal>
          <div className="mb-10 sm:mb-12">
            <h2
              id="details-heading"
              className="font-serif font-semibold text-3xl sm:text-4xl text-[#0A0010] tracking-tight text-balance"
            >
              {CONTENT.details.sectionTitle}
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-3 border-y border-[#E9E6EC] divide-y md:divide-y-0 md:divide-x divide-[#E9E6EC]">
            {/* 01. Tanggal */}
            <div className="py-7 md:py-8 md:pr-8">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#9B793E] mb-2">
                01. {CONTENT.details.cards.dateLabel}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-[#1A0B22] leading-snug">
                {EVENT.dateLabel}
              </p>
            </div>

            {/* 02. Waktu */}
            <div className="py-7 md:py-8 md:px-8">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#9B793E] mb-2">
                02. {CONTENT.details.cards.timeLabel}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-[#1A0B22] leading-snug">
                {EVENT.timeLabel}
              </p>
            </div>

            {/* 03. Tempat */}
            <div className="py-7 md:py-8 md:pl-8 flex flex-col justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-[#9B793E] mb-2">
                  03. {CONTENT.details.cards.locationLabel}
                </p>
                <p className="text-lg sm:text-xl font-semibold text-[#1A0B22] leading-snug">
                  {locationDisplay}
                </p>
                {hasAddress && (
                  <p className="mt-2 text-sm text-[#6B5B75] leading-relaxed">
                    {EVENT.address.trim()}
                  </p>
                )}
              </div>

              {hasMapsUrl && (
                <div>
                  <a
                    href={EVENT.mapsUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-4 py-2 rounded-lg border border-[#8A00B8] text-sm font-semibold text-[#8A00B8] hover:bg-[#8A00B8] hover:text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A00B8]"
                  >
                    <span>{CONTENT.details.cards.mapsButton}</span>
                    <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-sm sm:text-base text-[#6B5B75] leading-relaxed">
            {CONTENT.details.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

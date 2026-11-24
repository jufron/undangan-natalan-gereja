import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { CONTENT } from "../config/content";
import ParallaxLayer from "./ParallaxLayer";
import Reveal from "./Reveal";
import { PineSprig, StarOfBethlehem } from "./ChristmasOrnaments";

export default function Footer({ onOpenPanitia }) {
  const footerRef = useRef(null);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#0A0010] text-white px-5 sm:px-8 lg:px-12 py-16 sm:py-20 pb-[max(3rem,env(safe-area-inset-bottom))] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <ParallaxLayer
          targetRef={footerRef}
          range={[-18, 16]}
          className="absolute -bottom-8 right-2 sm:right-12 text-[#D6B87A] opacity-30"
        >
          <PineSprig className="w-40 h-40 sm:w-48 sm:h-48" />
        </ParallaxLayer>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 text-[#D6B87A] mb-4">
            <StarOfBethlehem className="w-5 h-5 shrink-0" />
            <span className="text-xs sm:text-sm font-medium tracking-wide text-[#E7CF9B]">
              {CONTENT.churchName}
            </span>
          </div>

          <p className="font-serif text-2xl sm:text-3xl font-medium text-white leading-snug text-balance max-w-2xl">
            {CONTENT.footer.closing}
          </p>

          <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="text-xs sm:text-sm text-[#E9E6EC]/70">
                {CONTENT.footer.copyright}
              </p>

              {onOpenPanitia && (
                <button
                  type="button"
                  onClick={onOpenPanitia}
                  className="min-h-[44px] py-2 text-xs text-[#E9E6EC]/55 hover:text-[#E7CF9B] transition-colors underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                >
                  {CONTENT.footer.panitiaLink}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="min-h-[44px] -ml-2 sm:ml-0 px-2 py-2 rounded-lg text-xs sm:text-sm font-medium text-[#E9E6EC]/85 hover:text-[#E7CF9B] inline-flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer self-start sm:self-auto"
            >
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{CONTENT.footer.backToTop}</span>
            </button>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

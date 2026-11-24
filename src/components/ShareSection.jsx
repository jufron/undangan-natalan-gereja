import { Share2 } from "lucide-react";
import { CONTENT } from "../config/content";
import Reveal from "./Reveal";

export default function ShareSection() {
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const fullMessage = `${CONTENT.share.whatsappText} ${currentUrl}`.trim();
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;

  return (
    <section
      id="bagikan"
      aria-labelledby="share-heading"
      className="bg-[#FBF8FD] border-t border-[#E9E6EC] px-5 sm:px-8 lg:px-12 py-16 sm:py-20"
    >
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <h2
                id="share-heading"
                className="font-serif font-semibold text-3xl sm:text-4xl text-[#0A0010] tracking-tight text-balance"
              >
                {CONTENT.share.title}
              </h2>
              <p className="mt-3 text-base text-[#6B5B75] leading-relaxed">
                {CONTENT.share.intro}
              </p>
            </div>

            <div className="shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto min-h-[48px] px-7 py-3 rounded-lg border border-[#8A00B8] text-[#8A00B8] hover:bg-[#8A00B8] hover:text-white font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A00B8]"
              >
                <Share2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{CONTENT.share.whatsappButton}</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

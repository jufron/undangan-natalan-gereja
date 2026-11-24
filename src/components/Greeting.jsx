import { useRef } from "react";
import { CONTENT } from "../config/content";
import ParallaxLayer from "./ParallaxLayer";
import Reveal from "./Reveal";
import { PineSprig } from "./ChristmasOrnaments";

export default function Greeting() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      id="pembuka"
      aria-label="Pesan Pembuka"
      className="relative bg-[#FFFFFF] border-t border-[#E9E6EC] px-5 sm:px-8 lg:px-12 py-16 sm:py-24 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <ParallaxLayer
          targetRef={sectionRef}
          range={[-22, 22]}
          className="absolute -right-8 top-6 text-[#9B793E] opacity-30"
        >
          <PineSprig className="w-36 h-36 sm:w-48 sm:h-48 -rotate-12" />
        </ParallaxLayer>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-2 mb-8" aria-hidden="true">
            <span className="w-10 h-[2px] bg-[#8A00B8]" />
            <span className="w-5 h-[2px] bg-[#9B793E]" />
          </div>

          <div className="space-y-5 text-base sm:text-lg leading-[1.8] text-[#1A0B22]">
            {CONTENT.greeting.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === 1
                    ? "font-serif text-xl sm:text-2xl font-medium text-[#3B0052] leading-snug pt-2"
                    : ""
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

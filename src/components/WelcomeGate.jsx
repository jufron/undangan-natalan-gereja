import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EVENT } from "../config/event";
import { CONTENT } from "../config/content";
import LogoMark from "./LogoMark";
import RsvpForm from "./RsvpForm";
import ParallaxLayer from "./ParallaxLayer";
import {
  HangingOrnaments,
  PineSprig,
  StarOfBethlehem,
} from "./ChristmasOrnaments";

/**
 * Gerbang pembuka dua tahap dengan identitas gereja di bagian atas,
 * ornamen Natal garis modern (emas sampanye), dan animasi parallax halus.
 */
export default function WelcomeGate({
  stage,
  onOpenForm,
  onBackToWelcome,
  onUnlock,
}) {
  const shouldReduceMotion = useReducedMotion();

  const transitionProps = shouldReduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <AnimatePresence mode="wait">
      {stage === "welcome" ? (
        <motion.div key="welcome-cover" {...transitionProps}>
          <WelcomeCover onOpenForm={onOpenForm} />
        </motion.div>
      ) : (
        <motion.div key="welcome-form" {...transitionProps}>
          <WelcomeFormStep
            onBackToWelcome={onBackToWelcome}
            onUnlock={onUnlock}
            shouldReduceMotion={shouldReduceMotion}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WelcomeCover({ onOpenForm }) {
  const coverRef = useRef(null);

  return (
    <div
      ref={coverRef}
      className="relative min-h-[100dvh] bg-[#0A0010] text-white flex flex-col justify-between px-5 sm:px-8 lg:px-12 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.75rem,env(safe-area-inset-bottom))] overflow-x-clip"
    >
      {/* Lapisan ornamen Natal garis halus dengan parallax */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <ParallaxLayer
          targetRef={coverRef}
          offset={["start start", "end start"]}
          range={[0, 44]}
          className="absolute -top-2 right-3 sm:right-12 lg:right-20 text-[#D6B87A] opacity-55"
        >
          <HangingOrnaments className="w-28 h-40 sm:w-36 sm:h-48" />
        </ParallaxLayer>

        <ParallaxLayer
          targetRef={coverRef}
          offset={["start start", "end start"]}
          range={[0, 28]}
          className="hidden md:block absolute top-32 left-6 lg:left-14 text-[#D6B87A] opacity-30"
        >
          <StarOfBethlehem className="w-20 h-20 lg:w-24 lg:h-24" />
        </ParallaxLayer>

        <ParallaxLayer
          targetRef={coverRef}
          offset={["start start", "end start"]}
          range={[0, -26]}
          className="absolute -bottom-8 -left-10 sm:left-0 text-[#D6B87A] opacity-30"
        >
          <PineSprig className="w-40 h-40 sm:w-52 sm:h-52" />
        </ParallaxLayer>
      </div>

      {/* Baris atas: Logo + Nama Gereja di posisi atas */}
      <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between gap-4 pb-5 border-b border-white/15">
        <div className="flex items-center gap-3 min-w-0">
          <LogoMark size="sm" />
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#E7CF9B] leading-snug">
              {CONTENT.churchName}
            </p>
            <p className="text-[11px] sm:text-xs text-[#E9E6EC]/70">
              {CONTENT.welcome.label}
            </p>
          </div>
        </div>

        <p className="hidden sm:block text-xs sm:text-sm text-[#E9E6EC]/80 font-medium text-right whitespace-nowrap shrink-0">
          {EVENT.dateLabel}
        </p>
      </header>

      {/* Konten utama asimetris dengan kedalaman parallax halus pada judul */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-auto py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          <ParallaxLayer
            targetRef={coverRef}
            offset={["start start", "end start"]}
            range={[0, 16]}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 text-[#D6B87A] mb-4">
              <StarOfBethlehem className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium tracking-[0.16em] text-[#E7CF9B]">
                {CONTENT.welcome.label}
              </span>
            </div>

            <h1 className="font-serif font-semibold text-white leading-[1.06] tracking-tight text-[clamp(2.4rem,6vw,4.5rem)] text-balance">
              {CONTENT.welcome.title}
            </h1>

            <div className="flex items-center gap-2 mt-7" aria-hidden="true">
              <span className="w-12 h-[2px] bg-[#D6B87A]" />
              <span className="w-6 h-[2px] bg-[#8A00B8]" />
            </div>
          </ParallaxLayer>

          <div className="lg:col-span-5 lg:border-l lg:border-white/15 lg:pl-10 space-y-6">
            <p className="text-base sm:text-lg font-medium text-white">
              {CONTENT.welcome.subtitle}
            </p>

            <p className="text-sm sm:text-base text-[#E9E6EC]/80 leading-relaxed">
              {CONTENT.welcome.intro}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenForm}
                className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-lg bg-white text-[#0A0010] hover:bg-[#E7CF9B] font-semibold text-sm sm:text-base transition-colors duration-200 inline-flex items-center justify-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
              >
                <span>{CONTENT.welcome.openButton}</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Garis penutup bawah editorial */}
      <div className="relative z-10 max-w-5xl w-full mx-auto pt-5 border-t border-white/15 flex items-center justify-between text-xs text-[#E9E6EC]/65">
        <span>{EVENT.timeLabel}</span>
        <span>{EVENT.timezoneLabel}</span>
      </div>
    </div>
  );
}

function WelcomeFormStep({ onBackToWelcome, onUnlock, shouldReduceMotion }) {
  const formHeadingRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" });
    const timer = window.setTimeout(() => {
      formHeadingRef.current?.focus();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion]);

  return (
    <div className="min-h-[100dvh] bg-[#FBF8FD] text-[#1A0B22] px-5 sm:px-8 lg:px-12 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(3rem,env(safe-area-inset-bottom))] overflow-x-clip">
      {/* Navigasi atas minimal dengan identitas gereja */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between gap-4 pb-5 border-b border-[#E9E6EC]">
        <button
          type="button"
          onClick={onBackToWelcome}
          className="min-h-[44px] -ml-2 px-2 py-2 text-sm font-medium text-[#6B5B75] hover:text-[#1A0B22] inline-flex items-center gap-2 transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A00B8] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{CONTENT.welcome.backButton}</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline text-xs font-semibold text-[#6B5B75]">
            {CONTENT.churchName}
          </span>
          <LogoMark size="sm" />
        </div>
      </header>

      {/* Layout 2 kolom editorial langsung di atas kanvas */}
      <main className="max-w-5xl w-full mx-auto pt-10 sm:pt-14 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-10">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.14em] text-[#9B793E] mb-2">
              {CONTENT.churchName}
            </p>
            <h1
              ref={formHeadingRef}
              tabIndex={-1}
              className="font-serif font-semibold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-[#0A0010] tracking-tight text-balance focus:outline-none"
            >
              {CONTENT.welcome.formStepTitle}
            </h1>
            <p className="mt-4 text-base text-[#6B5B75] leading-relaxed">
              {CONTENT.welcome.formStepSubtitle}
            </p>

            <div className="mt-8 pt-6 border-t border-[#E9E6EC] space-y-2 text-sm text-[#1A0B22]">
              <p className="font-semibold">{EVENT.title}</p>
              <p className="text-[#6B5B75]">{CONTENT.welcome.subtitle}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <RsvpForm mode="gate" onSuccess={onUnlock} />
          </div>
        </div>
      </main>
    </div>
  );
}

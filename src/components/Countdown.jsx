import { useEffect, useRef, useState } from "react";
import { EVENT } from "../config/event";
import { CONTENT } from "../config/content";
import ParallaxLayer from "./ParallaxLayer";
import Reveal from "./Reveal";
import { ChristmasBell, StarOfBethlehem } from "./ChristmasOrnaments";

function getTimeRemaining(targetTimestamp) {
  const diff = targetTimestamp - Date.now();
  if (diff <= 0) {
    return {
      expired: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    expired: false,
    days,
    hours,
    minutes,
    seconds,
  };
}

function padTwo(value) {
  return String(value).padStart(2, "0");
}

export default function Countdown() {
  const sectionRef = useRef(null);
  const targetTimestamp = new Date(EVENT.startISO).getTime();
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetTimestamp));

  useEffect(() => {
    setTimeLeft(getTimeRemaining(targetTimestamp));
    const timerId = window.setInterval(() => {
      setTimeLeft(getTimeRemaining(targetTimestamp));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [targetTimestamp]);

  const units = [
    { label: CONTENT.countdown.units.days, value: String(timeLeft.days) },
    { label: CONTENT.countdown.units.hours, value: padTwo(timeLeft.hours) },
    { label: CONTENT.countdown.units.minutes, value: padTwo(timeLeft.minutes) },
    { label: CONTENT.countdown.units.seconds, value: padTwo(timeLeft.seconds) },
  ];

  return (
    <section
      ref={sectionRef}
      id="hitung-mundur"
      aria-labelledby="countdown-heading"
      className="relative bg-[#0A0010] text-white px-5 sm:px-8 lg:px-12 py-16 sm:py-24 overflow-hidden"
    >
      {/* Ornamen Natal garis emas sampanye bergerak parallax halus */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <ParallaxLayer
          targetRef={sectionRef}
          range={[-28, 28]}
          className="absolute -top-4 right-4 sm:right-14 text-[#D6B87A] opacity-35"
        >
          <ChristmasBell className="w-24 h-28 sm:w-28 sm:h-32" />
        </ParallaxLayer>

        <ParallaxLayer
          targetRef={sectionRef}
          range={[20, -20]}
          className="hidden sm:block absolute bottom-4 left-6 lg:left-12 text-[#D6B87A] opacity-25"
        >
          <StarOfBethlehem className="w-20 h-20" />
        </ParallaxLayer>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <h2
              id="countdown-heading"
              className="font-serif font-semibold text-3xl sm:text-4xl tracking-tight text-white text-balance"
            >
              {CONTENT.countdown.title}
            </h2>
            <p className="text-sm text-[#E7CF9B]/85">
              {EVENT.dateLabel} · {EVENT.timeLabel}
            </p>
          </div>
        </Reveal>

        {timeLeft.expired ? (
          <Reveal delay={0.05}>
            <div className="border-y border-white/15 py-8">
              <p className="text-lg sm:text-xl font-medium text-white tracking-wide">
                {CONTENT.countdown.expiredMessage}
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.05}>
            <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-white/15 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
              {units.map((unit) => (
                <div
                  key={unit.label}
                  className="py-7 sm:py-9 px-4 sm:px-6 flex flex-col items-start sm:items-center justify-center"
                >
                  <span className="font-serif font-semibold text-4xl sm:text-6xl leading-none tabular-nums text-white">
                    {unit.value}
                  </span>
                  <span className="mt-3 text-xs sm:text-sm font-medium tracking-wide text-[#E7CF9B]">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { CalendarPlus, ChevronDown, Download, ExternalLink } from "lucide-react";
import { CONTENT } from "../config/content";
import { buildGoogleCalendarUrl, downloadIcsFile } from "../utils/calendar";

export default function AddToCalendar({
  variant = "light",
  align = "center",
  fullWidth = false,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const googleCalendarUrl = buildGoogleCalendarUrl();

  function handleDownloadIcs() {
    downloadIcsFile();
    setOpen(false);
  }

  const buttonTheme =
    variant === "dark"
      ? "border-white/25 bg-transparent text-white hover:bg-white/10 hover:border-white/50 focus-visible:outline-white"
      : "border-[#D5CEDB] bg-white text-[#1A0B22] hover:border-[#8A00B8] hover:text-[#8A00B8] focus-visible:outline-[#8A00B8]";

  const iconColor = variant === "dark" ? "text-[#E8B8FF]" : "text-[#8A00B8]";
  const chevronColor = variant === "dark" ? "text-[#E9E6EC]/80" : "text-[#6B5B75]";

  const menuAlignClass =
    align === "right"
      ? "left-0 right-0 sm:left-auto sm:right-0 sm:w-64"
      : "left-0 right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-64";

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${fullWidth ? "w-full" : "w-full sm:w-auto"}`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`${
          fullWidth ? "w-full" : "w-full sm:w-auto"
        } min-h-[48px] px-6 py-3 rounded-lg border font-medium text-sm sm:text-base inline-flex items-center justify-center gap-2.5 transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer ${buttonTheme}`}
      >
        <CalendarPlus className={`w-4 h-4 shrink-0 ${iconColor}`} aria-hidden="true" />
        <span>{CONTENT.hero.secondaryCta}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 shrink-0 ${chevronColor} ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={CONTENT.hero.secondaryCta}
          className={`absolute mt-2 rounded-lg bg-white border border-[#E9E6EC] shadow-lg py-1.5 z-40 ${menuAlignClass}`}
        >
          <a
            role="menuitem"
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="w-full min-h-[44px] px-4 py-2.5 text-sm text-[#1A0B22] hover:bg-[#FBF8FD] hover:text-[#8A00B8] flex items-center justify-between gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#8A00B8]"
          >
            <span className="font-medium whitespace-nowrap">
              {CONTENT.calendar.googleLabel}
            </span>
            <ExternalLink className="w-4 h-4 text-[#6B5B75] shrink-0" aria-hidden="true" />
          </a>

          <div className="my-1 border-t border-[#E9E6EC]" />

          <button
            type="button"
            role="menuitem"
            onClick={handleDownloadIcs}
            className="w-full min-h-[44px] px-4 py-2.5 text-sm text-[#1A0B22] hover:bg-[#FBF8FD] hover:text-[#8A00B8] flex items-center justify-between gap-3 transition-colors text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#8A00B8] cursor-pointer"
          >
            <span className="font-medium whitespace-nowrap">
              {CONTENT.calendar.icsLabel}
            </span>
            <Download className="w-4 h-4 text-[#6B5B75] shrink-0" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

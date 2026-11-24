import { EVENT } from "../config/event";
import { CONTENT } from "../config/content";

const WITA_OFFSET_MS = 8 * 60 * 60 * 1000;

function pad2(num) {
  return String(num).padStart(2, "0");
}

/**
 * Memformat epoch ms menjadi string YYYYMMDDTHHMMSS pada zona waktu WITA (UTC+8),
 * bebas dari pergeseran zona waktu lokal perangkat pengguna.
 */
function formatLocalWitaStamp(epochMs) {
  const shifted = new Date(epochMs + WITA_OFFSET_MS);
  const year = shifted.getUTCFullYear();
  const month = pad2(shifted.getUTCMonth() + 1);
  const day = pad2(shifted.getUTCDate());
  const hours = pad2(shifted.getUTCHours());
  const minutes = pad2(shifted.getUTCMinutes());
  const seconds = pad2(shifted.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function formatUtcStamp(date) {
  const year = date.getUTCFullYear();
  const month = pad2(date.getUTCMonth() + 1);
  const day = pad2(date.getUTCDate());
  const hours = pad2(date.getUTCHours());
  const minutes = pad2(date.getUTCMinutes());
  const seconds = pad2(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function getEventWindow() {
  const startMs = new Date(EVENT.startISO).getTime();
  const endMs = EVENT.endISO
    ? new Date(EVENT.endISO).getTime()
    : startMs + EVENT.defaultDurationHours * 60 * 60 * 1000;

  return { startMs, endMs };
}

function getLocationString() {
  const parts = [EVENT.locationName, EVENT.address]
    .map((item) => (item || "").trim())
    .filter(Boolean);
  return parts.join(", ");
}

function getEventDescription() {
  const notes = [];
  if (!EVENT.endISO) {
    notes.push(CONTENT.calendar.descriptionEndNote);
  }
  if (!getLocationString()) {
    notes.push(CONTENT.calendar.descriptionLocationPending);
  }
  return notes.join(" ");
}

function escapeIcsText(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * Menghasilkan URL Google Calendar dengan zona waktu eksplisit Asia/Makassar (WITA).
 */
export function buildGoogleCalendarUrl() {
  const { startMs, endMs } = getEventWindow();
  const dates = `${formatLocalWitaStamp(startMs)}/${formatLocalWitaStamp(endMs)}`;
  const location = getLocationString();
  const description = getEventDescription();

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT.title,
    dates,
    ctz: EVENT.timezoneIANA || "Asia/Makassar",
    details: description,
  });

  if (location) {
    params.set("location", location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Menghasilkan isi file .ics standar RFC 5545 dengan VTIMEZONE Asia/Makassar.
 */
export function buildIcsContent() {
  const { startMs, endMs } = getEventWindow();
  const tzId = EVENT.timezoneIANA || "Asia/Makassar";
  const dtStart = formatLocalWitaStamp(startMs);
  const dtEnd = formatLocalWitaStamp(endMs);
  const dtStamp = formatUtcStamp(new Date());
  const location = getLocationString();
  const description = getEventDescription();

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Undangan Natal Bersama 2026//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    `TZID:${tzId}`,
    `X-LIC-LOCATION:${tzId}`,
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0800",
    "TZOFFSETTO:+0800",
    "TZNAME:WITA",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:natal-bersama-2026-${dtStart}@undangan`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=${tzId}:${dtStart}`,
    `DTEND;TZID=${tzId}:${dtEnd}`,
    `SUMMARY:${escapeIcsText(EVENT.title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
  ];

  if (location) {
    lines.push(`LOCATION:${escapeIcsText(location)}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

/**
 * Mengunduh file .ics di browser pengguna untuk Apple Calendar & Outlook.
 */
export function downloadIcsFile() {
  const content = buildIcsContent();
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "undangan-natal-bersama-2026.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

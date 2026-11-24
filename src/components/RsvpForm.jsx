import { useRef, useState } from "react";
import { AlertCircle, Loader2, Minus, Plus } from "lucide-react";
import { EVENT } from "../config/event";
import { CONTENT } from "../config/content";
import { validateRsvpForm } from "../utils/validators";
import { DuplicatePhoneError, submitRsvpToFirestore } from "../lib/rsvpService";

const INITIAL_FORM = {
  namaLengkap: "",
  nomorHp: "",
  alamat: "",
  sumberUndangan: "",
  jumlahPeserta: 1,
  namaPendamping: [],
  honeypot: "",
};

/**
 * Form RSVP tunggal pada halaman pembuka (WelcomeGate) yang langsung tersimpan
 * ke Firebase Firestore dengan penolakan otomatis untuk nomor HP ganda.
 */
export default function RsvpForm({ onSuccess }) {
  const maxGuests = EVENT.maxGuests || 10;
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const namaRef = useRef(null);
  const hpRef = useRef(null);
  const alamatRef = useRef(null);
  const sourceRef = useRef(null);
  const guestCountRef = useRef(null);
  const companionRefs = useRef([]);

  function clearFieldError(field) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleGuestCountChange(nextCount) {
    const clamped = Math.max(1, Math.min(maxGuests, nextCount));
    setForm((prev) => {
      const targetLen = clamped - 1;
      const updatedCompanions = Array.from(
        { length: targetLen },
        (_, i) => prev.namaPendamping[i] || ""
      );
      return {
        ...prev,
        jumlahPeserta: clamped,
        namaPendamping: updatedCompanions,
      };
    });
    clearFieldError("jumlahPeserta");
    clearFieldError("namaPendamping");
  }

  function handleCompanionChange(index, value) {
    setForm((prev) => {
      const nextCompanions = [...prev.namaPendamping];
      nextCompanions[index] = value;
      return { ...prev, namaPendamping: nextCompanions };
    });

    setErrors((prev) => {
      if (!prev.namaPendamping || !prev.namaPendamping[index]) return prev;
      const nextCompErrors = [...prev.namaPendamping];
      nextCompErrors[index] = "";
      if (!nextCompErrors.some(Boolean)) {
        const next = { ...prev };
        delete next.namaPendamping;
        return next;
      }
      return { ...prev, namaPendamping: nextCompErrors };
    });
  }

  function focusFirstError(validationErrors) {
    if (validationErrors.namaLengkap) {
      namaRef.current?.focus();
      return;
    }
    if (validationErrors.nomorHp) {
      hpRef.current?.focus();
      return;
    }
    if (validationErrors.alamat) {
      alamatRef.current?.focus();
      return;
    }
    if (validationErrors.sumberUndangan) {
      sourceRef.current?.focus();
      return;
    }
    if (validationErrors.jumlahPeserta) {
      guestCountRef.current?.focus();
      return;
    }
    if (validationErrors.namaPendamping) {
      const firstIdx = validationErrors.namaPendamping.findIndex(Boolean);
      if (firstIdx !== -1) {
        companionRefs.current[firstIdx]?.focus();
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    setSubmitError("");
    const validationErrors = validateRsvpForm(form, maxGuests);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusFirstError(validationErrors);
      return;
    }

    const payload = {
      namaLengkap: form.namaLengkap.trim(),
      nomorHp: form.nomorHp.trim(),
      alamat: form.alamat.trim(),
      sumberUndangan: form.sumberUndangan,
      jumlahPeserta: form.jumlahPeserta,
      namaPendamping:
        form.jumlahPeserta > 1
          ? form.namaPendamping.slice(0, form.jumlahPeserta - 1).map((n) => n.trim())
          : [],
      honeypot: form.honeypot,
    };

    setIsSubmitting(true);

    try {
      await submitRsvpToFirestore(payload);
      if (onSuccess) {
        onSuccess(payload);
      }
    } catch (error) {
      if (error instanceof DuplicatePhoneError) {
        const dupMsg = error.message || CONTENT.rsvp.validation.duplicatePhone;
        setErrors((prev) => ({ ...prev, nomorHp: dupMsg }));
        setSubmitError(dupMsg);
        hpRef.current?.focus();
        return;
      }

      setSubmitError(CONTENT.rsvp.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const companionCount = Math.max(0, form.jumlahPeserta - 1);
  const idPrefix = "gate-rsvp";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 text-left text-[#1A0B22]"
    >
      {/* Honeypot anti-bot */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${idPrefix}-website`}>Website</label>
        <input
          id={`${idPrefix}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.honeypot}
          onChange={(e) => setForm((prev) => ({ ...prev, honeypot: e.target.value }))}
        />
      </div>

      {/* 1. Nama lengkap */}
      <div>
        <label
          htmlFor={`${idPrefix}-nama`}
          className="block text-sm font-semibold text-[#1A0B22] mb-2"
        >
          {CONTENT.rsvp.fields.fullNameLabel}
        </label>
        <input
          ref={namaRef}
          id={`${idPrefix}-nama`}
          name="namaLengkap"
          type="text"
          required
          autoComplete="name"
          placeholder={CONTENT.rsvp.fields.fullNamePlaceholder}
          value={form.namaLengkap}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, namaLengkap: e.target.value }));
            clearFieldError("namaLengkap");
          }}
          aria-invalid={Boolean(errors.namaLengkap)}
          aria-describedby={errors.namaLengkap ? `${idPrefix}-err-nama` : undefined}
          className={`w-full min-h-[48px] rounded-lg border bg-white px-4 py-2.5 text-base text-[#1A0B22] placeholder:text-[#6B5B75]/70 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8A00B8]/20 focus:border-[#8A00B8] ${
            errors.namaLengkap ? "border-red-600" : "border-[#D5CEDB]"
          }`}
        />
        {errors.namaLengkap && (
          <p id={`${idPrefix}-err-nama`} className="mt-1.5 text-sm text-red-700" role="alert">
            {errors.namaLengkap}
          </p>
        )}
      </div>

      {/* 2. Nomor HP */}
      <div>
        <label
          htmlFor={`${idPrefix}-hp`}
          className="block text-sm font-semibold text-[#1A0B22] mb-2"
        >
          {CONTENT.rsvp.fields.phoneLabel}
        </label>
        <input
          ref={hpRef}
          id={`${idPrefix}-hp`}
          name="nomorHp"
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel"
          placeholder={CONTENT.rsvp.fields.phonePlaceholder}
          value={form.nomorHp}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, nomorHp: e.target.value }));
            clearFieldError("nomorHp");
            setSubmitError("");
          }}
          aria-invalid={Boolean(errors.nomorHp)}
          aria-describedby={errors.nomorHp ? `${idPrefix}-err-hp` : undefined}
          className={`w-full min-h-[48px] rounded-lg border bg-white px-4 py-2.5 text-base text-[#1A0B22] placeholder:text-[#6B5B75]/70 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8A00B8]/20 focus:border-[#8A00B8] ${
            errors.nomorHp ? "border-red-600" : "border-[#D5CEDB]"
          }`}
        />
        {errors.nomorHp && (
          <p id={`${idPrefix}-err-hp`} className="mt-1.5 text-sm text-red-700" role="alert">
            {errors.nomorHp}
          </p>
        )}
      </div>

      {/* 3. Alamat */}
      <div>
        <label
          htmlFor={`${idPrefix}-alamat`}
          className="block text-sm font-semibold text-[#1A0B22] mb-2"
        >
          {CONTENT.rsvp.fields.addressLabel}
        </label>
        <textarea
          ref={alamatRef}
          id={`${idPrefix}-alamat`}
          name="alamat"
          rows={3}
          required
          autoComplete="street-address"
          placeholder={CONTENT.rsvp.fields.addressPlaceholder}
          value={form.alamat}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, alamat: e.target.value }));
            clearFieldError("alamat");
          }}
          aria-invalid={Boolean(errors.alamat)}
          aria-describedby={errors.alamat ? `${idPrefix}-err-alamat` : undefined}
          className={`w-full rounded-lg border bg-white px-4 py-3 text-base text-[#1A0B22] placeholder:text-[#6B5B75]/70 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8A00B8]/20 focus:border-[#8A00B8] ${
            errors.alamat ? "border-red-600" : "border-[#D5CEDB]"
          }`}
        />
        {errors.alamat && (
          <p id={`${idPrefix}-err-alamat`} className="mt-1.5 text-sm text-red-700" role="alert">
            {errors.alamat}
          </p>
        )}
      </div>

      {/* 4. Mengetahui undangan dari mana */}
      <fieldset>
        <legend className="block text-sm font-semibold text-[#1A0B22] mb-2.5">
          {CONTENT.rsvp.fields.sourceLabel}
        </legend>
        <div className="grid grid-cols-2 gap-2.5">
          {CONTENT.rsvp.fields.sourceOptions.map((option, idx) => {
            const selected = form.sumberUndangan === option;
            return (
              <label
                key={option}
                className={`min-h-[48px] px-4 py-2.5 rounded-lg border text-sm sm:text-base font-medium flex items-center gap-2.5 cursor-pointer transition-colors ${
                  selected
                    ? "border-[#8A00B8] bg-[#8A00B8]/6 text-[#3B0052]"
                    : "border-[#D5CEDB] bg-white text-[#1A0B22] hover:border-[#8A00B8]/50"
                }`}
              >
                <input
                  ref={idx === 0 ? sourceRef : undefined}
                  type="radio"
                  name={`${idPrefix}-sumberUndangan`}
                  value={option}
                  checked={selected}
                  onChange={() => {
                    setForm((prev) => ({ ...prev, sumberUndangan: option }));
                    clearFieldError("sumberUndangan");
                  }}
                  className="w-4 h-4 accent-[#8A00B8] shrink-0"
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
        {errors.sumberUndangan && (
          <p className="mt-1.5 text-sm text-red-700" role="alert">
            {errors.sumberUndangan}
          </p>
        )}
      </fieldset>

      {/* 5. Jumlah peserta (termasuk pendaftaran untuk orang lain dalam satu form) */}
      <div>
        <label
          htmlFor={`${idPrefix}-jumlah`}
          className="block text-sm font-semibold text-[#1A0B22] mb-1"
        >
          {CONTENT.rsvp.fields.guestCountLabel}
        </label>
        <p className="text-xs sm:text-sm text-[#6B5B75] mb-2.5 leading-relaxed">
          {CONTENT.rsvp.fields.guestCountHint}
        </p>
        <div className="inline-flex items-center rounded-lg border border-[#D5CEDB] bg-white">
          <button
            type="button"
            onClick={() => handleGuestCountChange(form.jumlahPeserta - 1)}
            disabled={form.jumlahPeserta <= 1}
            aria-label={CONTENT.rsvp.fields.guestCountDecreaseLabel}
            className="w-11 h-11 flex items-center justify-center text-[#1A0B22] hover:bg-[#FBF8FD] disabled:opacity-35 disabled:pointer-events-none transition-colors rounded-l-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A00B8] cursor-pointer"
          >
            <Minus className="w-4 h-4" aria-hidden="true" />
          </button>

          <input
            ref={guestCountRef}
            id={`${idPrefix}-jumlah`}
            type="number"
            readOnly
            min={1}
            max={maxGuests}
            value={form.jumlahPeserta}
            aria-live="polite"
            className="w-14 h-11 text-center border-x border-[#E9E6EC] bg-transparent font-semibold text-base text-[#0A0010] tabular-nums focus:outline-none"
          />

          <button
            type="button"
            onClick={() => handleGuestCountChange(form.jumlahPeserta + 1)}
            disabled={form.jumlahPeserta >= maxGuests}
            aria-label={CONTENT.rsvp.fields.guestCountIncreaseLabel}
            className="w-11 h-11 flex items-center justify-center text-[#1A0B22] hover:bg-[#FBF8FD] disabled:opacity-35 disabled:pointer-events-none transition-colors rounded-r-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A00B8] cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        {errors.jumlahPeserta && (
          <p className="mt-1.5 text-sm text-red-700" role="alert">
            {errors.jumlahPeserta}
          </p>
        )}
      </div>

      {/* 6. Input dinamis nama peserta tambahan jika jumlahPeserta > 1 */}
      {companionCount > 0 && (
        <div className="pt-4 border-t border-[#E9E6EC] space-y-4">
          <p className="text-sm font-semibold text-[#3B0052]">
            {CONTENT.rsvp.fields.companionTitle}
          </p>

          {Array.from({ length: companionCount }).map((_, idx) => {
            const compError = errors.namaPendamping?.[idx];
            const inputId = `${idPrefix}-pendamping-${idx}`;
            return (
              <div key={inputId}>
                <label
                  htmlFor={inputId}
                  className="block text-sm font-medium text-[#1A0B22] mb-1.5"
                >
                  {CONTENT.rsvp.fields.companionPrefix} {idx + 1}
                </label>
                <input
                  ref={(el) => {
                    companionRefs.current[idx] = el;
                  }}
                  id={inputId}
                  type="text"
                  required
                  placeholder={`${CONTENT.rsvp.fields.companionPlaceholder}${idx + 1}`}
                  value={form.namaPendamping[idx] || ""}
                  onChange={(e) => handleCompanionChange(idx, e.target.value)}
                  aria-invalid={Boolean(compError)}
                  aria-describedby={compError ? `${idPrefix}-err-comp-${idx}` : undefined}
                  className={`w-full min-h-[48px] rounded-lg border bg-white px-4 py-2.5 text-base text-[#1A0B22] placeholder:text-[#6B5B75]/70 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8A00B8]/20 focus:border-[#8A00B8] ${
                    compError ? "border-red-600" : "border-[#D5CEDB]"
                  }`}
                />
                {compError && (
                  <p
                    id={`${idPrefix}-err-comp-${idx}`}
                    className="mt-1.5 text-sm text-red-700"
                    role="alert"
                  >
                    {compError}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pesan error pengiriman / nomor HP ganda */}
      {submitError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-2.5"
        >
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[48px] px-6 py-3 rounded-lg bg-[#8A00B8] hover:bg-[#6E0094] text-white font-semibold text-base disabled:opacity-65 disabled:cursor-not-allowed transition-colors duration-200 inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A00B8] cursor-pointer"
      >
        {isSubmitting && (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        )}
        <span>
          {isSubmitting
            ? CONTENT.rsvp.submittingLabel
            : CONTENT.rsvp.submitLabel}
        </span>
      </button>
    </form>
  );
}

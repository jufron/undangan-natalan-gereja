import { CONTENT } from "../config/content";

export const ALLOWED_SOURCES = CONTENT.rsvp.fields.sourceOptions;

/**
 * Memvalidasi format nomor HP Indonesia (08..., 62..., atau +62...),
 * hanya karakter angka dan +, panjang 9-15 digit.
 */
export function validateIndonesianPhone(rawPhone) {
  const value = String(rawPhone || "").trim();
  if (!value) {
    return CONTENT.rsvp.validation.phoneRequired;
  }

  if (!/^\+?[0-9]+$/.test(value)) {
    return CONTENT.rsvp.validation.phoneChars;
  }

  const digitsOnly = value.replace(/^\+/, "");
  if (digitsOnly.length < 9 || digitsOnly.length > 15) {
    return CONTENT.rsvp.validation.phoneFormat;
  }

  if (!/^(08|62|\+62)/.test(value)) {
    return CONTENT.rsvp.validation.phoneFormat;
  }

  return "";
}

/**
 * Memvalidasi seluruh field form RSVP dan mengembalikan objek error per field.
 */
export function validateRsvpForm(values, maxGuests = 10) {
  const errors = {};
  const v = CONTENT.rsvp.validation;

  const fullName = String(values.namaLengkap || "").trim();
  if (!fullName) {
    errors.namaLengkap = v.fullNameRequired;
  } else if (fullName.length < 3) {
    errors.namaLengkap = v.fullNameMin;
  }

  const phoneError = validateIndonesianPhone(values.nomorHp);
  if (phoneError) {
    errors.nomorHp = phoneError;
  }

  const address = String(values.alamat || "").trim();
  if (!address) {
    errors.alamat = v.addressRequired;
  }

  if (!ALLOWED_SOURCES.includes(values.sumberUndangan)) {
    errors.sumberUndangan = v.sourceRequired;
  }

  const count = Number(values.jumlahPeserta);
  if (!Number.isInteger(count) || count < 1 || count > maxGuests) {
    errors.jumlahPeserta = v.guestCountRange.replace("{max}", String(maxGuests));
  }

  if (Number.isInteger(count) && count > 1) {
    const companionErrors = [];
    const expectedCount = count - 1;
    for (let i = 0; i < expectedCount; i += 1) {
      const compName = String((values.namaPendamping || [])[i] || "").trim();
      if (!compName) {
        companionErrors[i] = v.companionRequired.replace("{index}", String(i + 1));
      } else {
        companionErrors[i] = "";
      }
    }
    if (companionErrors.some(Boolean)) {
      errors.namaPendamping = companionErrors;
    }
  }

  return errors;
}

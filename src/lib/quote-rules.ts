/** Rules shared by the quote form (browser) and the /api/quote endpoint (server). */

export const ACCEPTED_EXTENSIONS = ['pdf', 'ai', 'psd', 'png', 'jpg', 'jpeg'] as const;
export const ACCEPT_ATTR = '.pdf,.ai,.psd,.png,.jpg,.jpeg';
export const MAX_FILE_MB = 25;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

/**
 * Serverless functions on Vercel accept request bodies up to ~4.5 MB. Files at or below this
 * size are uploaded with the form and attached to the email. Bigger files (up to MAX_FILE_MB)
 * are validated in the browser and the customer is asked to send them via Messenger or email.
 * See README → "Large artwork files" for the Vercel Blob upgrade path.
 */
export const INLINE_UPLOAD_MAX_BYTES = 4 * 1024 * 1024;

export const fileExtension = (name: string) => name.split('.').pop()?.toLowerCase() ?? '';

export const isAcceptedFile = (name: string) => (ACCEPTED_EXTENSIONS as readonly string[]).includes(fileExtension(name));

/** Normalises '0917 717 7429', '+63 917-717-7429' etc. to '09177177429'. Returns null if invalid. */
export const normalizePhMobile = (raw: string): string | null => {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('63')) digits = `0${digits.slice(2)}`;
  if (digits.length === 10 && digits.startsWith('9')) digits = `0${digits}`;
  return /^09\d{9}$/.test(digits) ? digits : null;
};

export const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** Today's date (YYYY-MM-DD) in Manila, used as the minimum deadline. */
export const manilaToday = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

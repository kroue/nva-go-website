/**
 * POST /api/quote/ — quote requests and corporate bulk inquiries.
 *
 * Live mode: RESEND_API_KEY and QUOTE_TO_EMAIL are set → emails the shop via Resend.
 * Demo mode: either is missing → validates everything, stores and sends nothing,
 *            and replies with a success message flagged `demo: true`.
 */
import type { APIRoute } from 'astro';
import { QUOTE_FROM_EMAIL, QUOTE_TO_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { Resend } from 'resend';
import { site } from '../../config/site';
import { findProduct } from '../../data/products';
import { bundles, budgetRanges } from '../../data/bundles';
import {
  INLINE_UPLOAD_MAX_BYTES,
  MAX_FILE_BYTES,
  MAX_FILE_MB,
  formatBytes,
  isAcceptedFile,
  manilaToday,
  normalizePhMobile,
} from '../../lib/quote-rules';

export const prerender = false;

type Fields = Record<string, string>;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const str = (fd: FormData, key: string, max = 500) => {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
};

const productLabel = (value: string) => {
  if (value === 'other') return 'Something else / not sure';
  if (value === 'kit:custom') return 'Custom mix of items (kit)';
  if (value.startsWith('kit:')) return `${bundles.find((b) => `kit:${b.id}` === value)?.name ?? value} (kit)`;
  return findProduct(value)?.name ?? '';
};

const reference = () => `NVA-${Date.now().toString(36).slice(-5).toUpperCase()}${Math.floor(Math.random() * 36).toString(36).toUpperCase()}`;

function wantsJson(request: Request) {
  return (request.headers.get('accept') ?? '').includes('application/json');
}

function respond(request: Request, status: number, body: Record<string, unknown>) {
  if (wantsJson(request)) {
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  }
  // No-JS fallback
  if (body.ok) {
    const q = new URLSearchParams({ ref: String(body.reference ?? '') });
    if (body.demo) q.set('demo', '1');
    return new Response(null, { status: 303, headers: { Location: `/quote/sent/?${q}` } });
  }
  const errors = Object.values((body.errors as Fields) ?? { error: String(body.message ?? 'Something went wrong.') });
  const html = `<!doctype html><html lang="en-PH"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Please check your form | ${esc(site.name)}</title>
<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:3rem auto;padding:0 1rem;line-height:1.6;color:#141414">
<h1>Please check your form</h1><ul>${errors.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>
<p><a href="javascript:history.back()">Go back and fix it</a> or message us on <a href="${site.social.messenger}">Messenger</a>.</p></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export const POST: APIRoute = async ({ request }) => {
  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return respond(request, 400, { ok: false, message: 'We couldn’t read the form. Please try again.' });
  }

  // Honeypot filled → pretend success, do nothing.
  if (str(fd, 'website')) return respond(request, 200, { ok: true, reference: reference() });

  const bulk = str(fd, 'form_type') === 'bulk';
  const errors: Fields = {};
  const f: Fields = {
    product: str(fd, 'product', 80),
    quantity: str(fd, 'quantity', 12),
    deadline: str(fd, 'deadline', 10),
    rush: str(fd, 'rush') === 'yes' ? 'Yes' : 'No',
    name: str(fd, 'name', 120),
    mobile: str(fd, 'mobile', 20),
    email: str(fd, 'email', 160),
    notes: str(fd, 'notes', 2000),
  };

  const product = productLabel(f.product);
  if (!product) errors.product = 'Please choose a product.';

  const qty = Number(f.quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 1_000_000) errors.quantity = 'Please enter a quantity of at least 1.';

  if (f.deadline) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.deadline)) errors.deadline = 'Please enter a valid deadline date.';
    else if (f.deadline < manilaToday()) errors.deadline = 'The deadline can’t be in the past.';
  } else if (bulk) errors.deadline = 'Please tell us your deadline.';

  if (!f.name) errors.name = 'Please enter your name.';
  const mobile = normalizePhMobile(f.mobile);
  if (!mobile) errors.mobile = 'Please enter an 11-digit mobile number starting with 09.';
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = 'Please enter a valid email address.';
  if (bulk && !f.email) errors.email = 'Please enter your email address.';
  if (str(fd, 'consent') !== 'yes') errors.consent = 'Please agree to the privacy notice so we can reply to you.';

  // Size (quote form)
  let size = '';
  const w = Number(str(fd, 'width_ft', 8));
  const h = Number(str(fd, 'height_ft', 8));
  if (!bulk && (str(fd, 'width_ft') || str(fd, 'height_ft'))) {
    if (!(w > 0 && h > 0 && w <= 200 && h <= 200)) errors.size = 'Please enter both width and height in feet.';
    else size = `${w} × ${h} ft (${Math.round(w * h * 100) / 100} sq ft)`;
  }

  // Bulk-only
  let organization = '';
  let budget = '';
  if (bulk) {
    organization = str(fd, 'organization', 160);
    budget = str(fd, 'budget', 60);
    if (!organization) errors.organization = 'Please enter your company, school or organization.';
    if (!budgetRanges.includes(budget)) errors.budget = 'Please choose a budget range.';
  }

  const design = bulk ? '' : str(fd, 'design') === 'need' ? 'Needs a design' : 'Has a design';

  // Artwork: either an uploaded file (≤ inline limit) or metadata for a large file sent later.
  let attachment: { filename: string; content: Buffer } | undefined;
  let artwork = 'None';
  const upload = fd.get('artwork');
  if (upload instanceof File && upload.size > 0) {
    if (!isAcceptedFile(upload.name)) errors.artwork = 'Artwork must be a PDF, AI, PSD, PNG or JPG file.';
    else if (upload.size > MAX_FILE_BYTES) errors.artwork = `Artwork must be ${MAX_FILE_MB} MB or smaller.`;
    else if (upload.size > INLINE_UPLOAD_MAX_BYTES) artwork = `${upload.name} (${formatBytes(upload.size)}), too large to attach; customer will send it separately`;
    else {
      artwork = `${upload.name} (${formatBytes(upload.size)}), attached`;
      attachment = { filename: upload.name.replace(/[^\w.\- ]/g, '_'), content: Buffer.from(await upload.arrayBuffer()) };
    }
  } else if (str(fd, 'artwork_deferred') === '1') {
    const name = str(fd, 'artwork_name', 200);
    const bytes = Number(str(fd, 'artwork_size', 12));
    if (!isAcceptedFile(name)) errors.artwork = 'Artwork must be a PDF, AI, PSD, PNG or JPG file.';
    else if (!(bytes > 0) || bytes > MAX_FILE_BYTES) errors.artwork = `Artwork must be ${MAX_FILE_MB} MB or smaller.`;
    else artwork = `${name} (${formatBytes(bytes)}), customer will send via Messenger/email`;
  }

  if (Object.keys(errors).length) return respond(request, 400, { ok: false, errors });

  const ref = reference();
  const demo = !RESEND_API_KEY || !QUOTE_TO_EMAIL;
  if (demo) {
    // Demo mode: validated, nothing stored, nothing sent.
    return respond(request, 200, { ok: true, demo: true, reference: ref });
  }

  const rows: [string, string][] = [
    ['Reference', ref],
    ...(bulk ? ([['Organization', organization]] as [string, string][]) : []),
    [bulk ? 'Kit / item' : 'Product', product],
    ['Quantity', String(qty)],
    ...(size ? ([['Size', size]] as [string, string][]) : []),
    ['Deadline', f.deadline || 'Not given'],
    ['Rush order', f.rush],
    ...(bulk ? ([['Budget range', budget]] as [string, string][]) : [['Design', design] as [string, string]]),
    ['Artwork', artwork],
    ['Name', f.name],
    ['Mobile', mobile!],
    ['Email', f.email || 'Not given'],
    ['Notes', f.notes || '—'],
  ];

  const subject = `${f.rush === 'Yes' ? '[RUSH] ' : ''}${bulk ? 'Bulk inquiry' : 'Quote request'}: ${product} × ${qty} (${f.name}) ${ref}`;
  const html = `<div style="font-family:Arial,sans-serif;color:#141414">
<div style="height:6px;background:linear-gradient(90deg,#00AEEF,#EC008C,#FFD400)"></div>
<h2 style="margin:16px 0">${esc(bulk ? 'New bulk inquiry' : 'New quote request')} from the website</h2>
<table cellpadding="8" style="border-collapse:collapse;font-size:15px">${rows
    .map(([k, v]) => `<tr><td style="border-bottom:1px solid #eee;color:#6b6b6b;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('')}</table>
<p style="font-size:13px;color:#6b6b6b">Reply to this email to answer the customer${f.email ? '' : ' (no email given: call or text them)'}.</p></div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: QUOTE_FROM_EMAIL || `${site.shortName} Website <onboarding@resend.dev>`,
      to: QUOTE_TO_EMAIL!.split(',').map((s) => s.trim()),
      replyTo: f.email || undefined,
      subject,
      html,
      text,
      attachments: attachment ? [attachment] : undefined,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error('Quote email failed', err);
    return respond(request, 502, {
      ok: false,
      message: `Sorry, we couldn’t send your request just now. Please message us on Messenger or call ${site.phone.mobile.label}.`,
    });
  }

  return respond(request, 200, { ok: true, reference: ref });
};

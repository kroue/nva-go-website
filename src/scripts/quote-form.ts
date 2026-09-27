import {
  INLINE_UPLOAD_MAX_BYTES,
  MAX_FILE_BYTES,
  MAX_FILE_MB,
  formatBytes,
  isAcceptedFile,
  manilaToday,
  normalizePhMobile,
} from '../lib/quote-rules';

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 });
const num = (v: string) => (v.trim() === '' ? NaN : Number(v));

interface ApiResponse {
  ok: boolean;
  demo?: boolean;
  reference?: string;
  message?: string;
  errors?: Record<string, string>;
}

function initForm(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-quote-form]');
  if (!form || form.dataset.ready) return;
  form.dataset.ready = 'true';

  const $ = <T extends Element>(sel: string) => form.querySelector<T>(sel);
  const params = new URLSearchParams(location.search);
  const pricePerSqft = num(form.dataset.pricePerSqft ?? '');

  // --- Pre-fill from the URL: ?product=tarpaulin, ?kit=event-kit, ?rush=1
  const select = $<HTMLSelectElement>('[data-product-select]');
  const wanted = params.get('product') ?? (params.get('kit') ? `kit:${params.get('kit')}` : null);
  if (select && wanted && [...select.options].some((o) => o.value === wanted)) select.value = wanted;
  if (params.get('design') === 'need') {
    const need = $<HTMLInputElement>('input[name="design"][value="need"]');
    if (need) need.checked = true;
  }
  if (params.get('rush') === '1') {
    const rush = $<HTMLInputElement>('[data-rush]');
    if (rush) rush.checked = true;
  }

  // --- Deadline cannot be in the past (Manila date)
  const deadline = $<HTMLInputElement>('[data-deadline]');
  if (deadline) deadline.min = manilaToday();

  // --- Tarpaulin size helper
  const width = $<HTMLInputElement>('[data-width]');
  const height = $<HTMLInputElement>('[data-height]');
  const qty = $<HTMLInputElement>('[data-qty]');
  const sizeOut = $<HTMLElement>('[data-size-output]');
  const updateSize = () => {
    if (!width || !height || !sizeOut) return;
    const w = num(width.value);
    const h = num(height.value);
    if (!(w > 0 && h > 0)) {
      sizeOut.textContent = 'Enter width and height to see the area in square feet. We’ll send your exact price.';
      return;
    }
    const sqft = Math.round(w * h * 100) / 100;
    const pieces = Math.max(1, Math.floor(num(qty?.value ?? '') || 1));
    const area = `${w} × ${h} ft = ${sqft.toLocaleString('en-PH')} sq ft${pieces > 1 ? ` each (${(sqft * pieces).toLocaleString('en-PH')} sq ft total)` : ''}.`;
    sizeOut.replaceChildren();
    const strong = document.createElement('strong');
    strong.textContent = area;
    sizeOut.append(strong, document.createElement('br'));
    const large = select?.selectedOptions[0]?.hasAttribute('data-large') ?? true;
    if (pricePerSqft > 0 && large) {
      sizeOut.append(
        `Estimated ${peso.format(sqft * pieces * pricePerSqft)} before finishing. Your final price is confirmed in the quote.`,
      );
    } else {
      sizeOut.append('We’ll send your exact price.');
    }
  };
  [width, height, qty].forEach((el) => el?.addEventListener('input', updateSize));
  select?.addEventListener('change', updateSize);

  // --- Mobile number: normalise on blur, strict check
  const mobile = $<HTMLInputElement>('[data-mobile]');
  const checkMobile = () => {
    if (!mobile || !mobile.value.trim()) return mobile?.setCustomValidity('');
    const normalized = normalizePhMobile(mobile.value);
    mobile.setCustomValidity(normalized ? '' : 'Enter an 11-digit mobile number starting with 09, e.g. 09171234567.');
    if (normalized) mobile.value = normalized;
  };
  mobile?.addEventListener('blur', checkMobile);
  mobile?.addEventListener('input', () => mobile.setCustomValidity(''));

  // --- Artwork file checks (type + 25 MB)
  const file = $<HTMLInputElement>('[data-file]');
  const fileName = root.querySelector<HTMLElement>('[data-file-name]');
  const fileHint = root.querySelector<HTMLElement>('[data-file-hint]');
  const defaultHint = fileHint?.innerHTML ?? '';
  file?.addEventListener('change', () => {
    const f = file.files?.[0];
    file.setCustomValidity('');
    file.removeAttribute('aria-invalid');
    if (fileHint) fileHint.innerHTML = defaultHint;
    if (!f) {
      if (fileName) fileName.textContent = 'Choose a file';
      return;
    }
    if (fileName) fileName.textContent = `${f.name} (${formatBytes(f.size)})`;
    let problem = '';
    if (!isAcceptedFile(f.name)) problem = 'That file type isn’t supported. Please use PDF, AI, PSD, PNG or JPG.';
    else if (f.size > MAX_FILE_BYTES) problem = `That file is ${formatBytes(f.size)}. The limit is ${MAX_FILE_MB} MB.`;
    if (problem) {
      file.setCustomValidity(problem);
      file.setAttribute('aria-invalid', 'true');
      if (fileHint) fileHint.textContent = problem;
    } else if (f.size > INLINE_UPLOAD_MAX_BYTES && fileHint) {
      fileHint.textContent = 'Looks good. It’s a big one, so after you submit we’ll ask you to send it on Messenger or by email.';
    }
  });

  // --- Submit in place
  const summary = $<HTMLElement>('[data-error-summary]');
  const list = $<HTMLElement>('[data-error-list]');
  const submit = $<HTMLButtonElement>('[data-submit]');
  const submitLabel = $<HTMLElement>('[data-submit-label]');
  const success = root.querySelector<HTMLElement>('[data-success]');

  const showErrors = (messages: string[]) => {
    if (!summary || !list) return;
    list.replaceChildren(
      ...messages.map((m) => {
        const li = document.createElement('li');
        li.textContent = m;
        return li;
      }),
    );
    summary.hidden = false;
    summary.scrollIntoView({ block: 'center' });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    checkMobile();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const f = file?.files?.[0];
    if (f && f.size > INLINE_UPLOAD_MAX_BYTES) {
      // Too big for a serverless request: send the details only, file follows on Messenger/email.
      data.delete('artwork');
      data.set('artwork_name', f.name);
      data.set('artwork_size', String(f.size));
      data.set('artwork_deferred', '1');
    }

    const label = submitLabel?.textContent ?? '';
    if (submit) submit.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Sending…';
    if (summary) summary.hidden = true;

    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const json = (await res.json().catch(() => ({ ok: false }))) as ApiResponse;
      if (!res.ok || !json.ok) {
        showErrors(json.errors ? Object.values(json.errors) : [json.message ?? 'Something went wrong. Please try again, or message us on Messenger.']);
        return;
      }
      if (success) {
        const text = success.querySelector<HTMLElement>('[data-success-text]');
        if (text && json.reference) text.append(` Your reference: ${json.reference}.`);
        if (text && data.get('artwork_deferred')) text.append(' Please send your artwork file on Messenger or by email and mention your reference.');
        const demo = success.querySelector<HTMLElement>('[data-demo-note]');
        if (demo) demo.hidden = !json.demo;
        form.hidden = true;
        success.hidden = false;
        success.focus();
        success.scrollIntoView({ block: 'center' });
      }
    } catch {
      showErrors(['We couldn’t reach the server. Check your connection and try again, or message us on Messenger.']);
    } finally {
      if (submit) submit.disabled = false;
      if (submitLabel) submitLabel.textContent = label;
    }
  });

  updateSize();
}

export function initQuoteForms() {
  document.querySelectorAll<HTMLElement>('[data-quote-root]').forEach(initForm);
}

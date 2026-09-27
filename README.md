# NVA Printing Services website

Public marketing site for **NVA Printing Services**, a printing shop and corporate giveaways supplier in Divisoria, Cagayan de Oro City. It feeds quote requests to the shop by email and sends online orders to **NVAGo**, the booking and POS system.

- Astro 7 + Tailwind CSS 4 + TypeScript, static output with one serverless endpoint (`/api/quote/`)
- Deployed on Vercel (`@astrojs/vercel`), images served as AVIF/WebP by Vercel Image Optimization
- Fonts self-hosted (Archivo Black, Cormorant SC, Figtree) with metric-matched fallbacks, so text doesn't jump when fonts load
- Minimal JavaScript: small scripts for the mobile menu, the "Open now" pill and the quote form. No framework runtime.

## Setup

Requires Node.js 22.12 or newer.

```bash
npm install
cp .env.example .env   # optional, see "Environment variables"
npm run dev            # http://localhost:4321
npm run build          # production build into .vercel/output
npm run check          # type-check .astro and .ts files
```

To deploy, import the repo in Vercel. The framework preset is detected automatically. Add the environment variables below in **Vercel → Project → Settings → Environment Variables**.

## Environment variables

| Variable | Required | What it does |
| --- | --- | --- |
| `RESEND_API_KEY` | For live email | API key from [resend.com](https://resend.com). |
| `QUOTE_TO_EMAIL` | For live email | Where quote and bulk inquiries go, e.g. `nvaprintingservices@gmail.com`. Comma-separate for several. |
| `QUOTE_FROM_EMAIL` | Recommended | Sender address on a domain verified in Resend, e.g. `NVA Website <quotes@nvaprinting.com>`. If empty, Resend's test sender is used, which only delivers to the email on your Resend account. |

**Demo mode for the form:** if `RESEND_API_KEY` or `QUOTE_TO_EMAIL` is missing, the form still validates everything and shows a success message with a note that it's a preview. Nothing is sent or stored.

## Where to edit content

Everything editable lives in `src/config/` and `src/data/`. Components only render it.

| File | Contents |
| --- | --- |
| `src/config/site.ts` | Business name, address, map link, hours, phone numbers, emails, Facebook/Messenger, Shopee/Lazada links, the one real review, navigation, and the launch switches (`DEMO_MODE`, `NVAGO_URL`, `PRICE_PER_SQFT`, `SITE_URL`) |
| `src/data/products.ts` | Product categories and items |
| `src/data/jobs.ts` | Job openings for the Careers page |
| `src/data/faq.ts` | FAQ (home page + FAQPage structured data) |
| `src/data/bundles.ts` | Corporate giveaway kits and budget ranges |
| `src/data/images.ts` | All photos (placeholders to be replaced) |
| `src/styles/global.css` | Design tokens: colors, fonts, type scale, buttons, print motifs |

Items marked `TODO-confirm` in code comments (turnaround times, payment channels, landlines, map pin, sign materials, DPO name) need a quick check with the owner. They never appear on the page.

### Add or remove a product

Open `src/data/products.ts`, find the category, and copy an item:

```ts
{
  slug: 'mouse-pads',              // unique, lowercase, dashes
  name: 'Mouse pads',
  description: 'Custom printed mouse pads for offices and gaming teams.',
},
```

Add `largeFormat: true` for items measured in feet. The product automatically appears on the Products page, in the quote form dropdown and in the structured data, and `/quote/?product=mouse-pads` pre-selects it. To remove a product, delete its block.

### Post a job opening

Add an entry to `src/data/jobs.ts` (there's a commented example in the file):

```ts
export const jobs: Job[] = [
  {
    title: 'Layout Artist',
    type: 'Full-time',
    summary: 'Turn customer ideas into print-ready tarpaulins, cards and merch layouts.',
    requirements: ['Comfortable with Photoshop or Illustrator', 'Based in or near CDO'],
  },
];
```

With an empty list, the page shows "No openings right now, send your CV anyway." Applications go to `nvaprintingserviceshr@gmail.com`.

### Replace the placeholder photos

The photos are Unsplash placeholders. Swap them for NVA's own photos before launch:

1. Put the photo in `src/assets/photos/`, e.g. `tarp-wall.jpg`.
2. In `src/data/images.ts`, import it: `import tarpWall from '../assets/photos/tarp-wall.jpg';`
3. Set `src: tarpWall` on the entry and **update its `alt` text** to describe the new photo.

If a photo ever fails to load, the frame shows a branded CMYK panel instead of a broken image.

### Replace the logo

`src/components/Logo.astro` is a vector recreation of the logo (ink drop + NVA + PRINTING SERVICES). The favicon, app icon and share image use the same ink-drop mark from `src/lib/mark.ts`. To use the official artwork, add it to `src/assets/` and render it in `Logo.astro` with `<Image>` from `astro:assets`.

## Launch switches (`src/config/site.ts`)

### `NVAGO_URL`: online ordering

```ts
export const NVAGO_URL = 'https://your-nvago-link';
```

With a URL, `/order-online/` explains how ordering and tracking work and shows a big **Open NVAGo** button. Left empty (`''`), the page shows the quote form instead.

### `PRICE_PER_SQFT`: tarpaulin estimate

```ts
export const PRICE_PER_SQFT: number | null = 18; // PHP per square foot
```

When set, the quote form's size helper shows an estimate (width × height × quantity × rate) for large-format items, with a note that the final price comes with the quote. When `null`, customers see "We'll send your exact price." No prices appear anywhere else.

### `SITE_URL`

Set this to the final domain before launch. It's used for canonical URLs, the sitemap, Open Graph images and structured data.

### `DEMO_MODE`: turn off before launch

```ts
export const DEMO_MODE = false;
```

While `true`, every page carries `<meta name="robots" content="noindex,nofollow">` and a small "Preview by Kuro" badge. Setting it to `false` removes both and makes the site indexable. `robots.txt` always allows crawling so search engines can see the noindex tag during the preview.

**Launch checklist**

1. Set `DEMO_MODE = false` and the real `SITE_URL`.
2. Add `RESEND_API_KEY`, `QUOTE_TO_EMAIL` and `QUOTE_FROM_EMAIL` in Vercel, then send a test quote.
3. Swap placeholder photos (and alt text) for NVA's own.
4. Confirm the `TODO-confirm` items with the owner.
5. Submit `https://<domain>/sitemap-index.xml` in Google Search Console and link the site from the Facebook page and Google Business Profile.

## Quote form notes

- Works without JavaScript (plain POST, then a confirmation page). With JavaScript it submits in place and shows a reference number.
- Validates product, quantity, deadline (not in the past, Manila date), PH mobile (`09XXXXXXXXX`, spaces and `+63` accepted and normalized), email, Data Privacy Act consent and artwork (PDF, AI, PSD, PNG, JPG, up to 25 MB) in the browser **and** on the server.
- Spam protection: a hidden honeypot field plus Astro's built-in same-origin check.
- Pre-fill with URL parameters: `?product=<slug>`, `?rush=1`, `?design=need`, and on the corporate page `?kit=<bundle-id>`.

### Large artwork files

Vercel serverless functions accept request bodies up to about 4.5 MB. Files up to 4 MB are uploaded with the form and attached to the email. Larger files (up to 25 MB) are checked in the browser, and the customer is asked to send them on Messenger or by email with their reference number. The shop's email shows the file name and size. To accept big uploads directly, add client-side uploads to [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) and email the link instead.

## SEO

- Unique title and meta description per page, targeting local searches ("printing services Cagayan de Oro", "tarpaulin printing CDO", "sublimation printing Cagayan de Oro", "corporate giveaways Cagayan de Oro", "Divisoria printing shop" and more).
- JSON-LD: `LocalBusiness` (address, geo, hours, phone, sameAs), `Service` + `OfferCatalog` per category, `FAQPage`, `BreadcrumbList`, `Article` (artwork guide).
- Open Graph/Twitter image generated at build time (`/og.png`), sitemap, `robots.txt`, canonical URLs, `lang="en-PH"`, one H1 per page.

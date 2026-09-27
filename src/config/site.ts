/**
 * NVA Printing Services — site configuration.
 * Single source of truth for business details, links and launch switches.
 * Everything a non-developer may need to change lives here or in src/data/.
 */

// ---------------------------------------------------------------------------
// Launch switches
// ---------------------------------------------------------------------------

/**
 * DEMO_MODE
 * true  → every page gets <meta name="robots" content="noindex,nofollow"> and a small
 *         "Preview by Kuro" badge. Use while the owner is reviewing.
 * false → site is indexable and the badge disappears. Set this before launch.
 */
export const DEMO_MODE = true;

/**
 * Public URL of the NVAGo booking and order-tracking app.
 * Leave empty ('') and the Order Online page shows the quote form instead.
 * Example: 'https://nvago.app/nva'
 */
export const NVAGO_URL = '';

/**
 * Tarpaulin / large-format price per square foot in PHP (e.g. 18).
 * null → no estimate is shown anywhere; customers see "We'll send your exact price."
 */
export const PRICE_PER_SQFT: number | null = null;

/**
 * Production URL, used for canonical links, sitemap, Open Graph and JSON-LD.
 * TODO: update to the final domain before launch (e.g. https://nvaprinting.com).
 */
export const SITE_URL = 'https://nva-printing.vercel.app';

// ---------------------------------------------------------------------------
// Business details
// ---------------------------------------------------------------------------

export const site = {
  name: 'NVA Printing Services',
  shortName: 'NVA Printing',
  tagline: 'One stop shop for your printing needs',
  description:
    'Printing shop in Divisoria, Cagayan de Oro: tarpaulins, signage, sublimation shirts, custom mugs, lanyards and corporate giveaways. Rush orders welcome.',
  locale: 'en-PH',

  address: {
    street: 'Pabayo-Chavez Sts.',
    landmark: 'Beside Greenwich Divisoria, in front of LBC',
    city: 'Cagayan de Oro City',
    region: 'Misamis Oriental',
    postalCode: '9000',
    country: 'PH',
  },

  // TODO-confirm: approximate pin for Pabayo-Chavez Sts., Divisoria. Verify on Google Maps.
  geo: { lat: 8.4779, lng: 124.6457 },

  mapsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=NVA+Printing+Services%2C+Pabayo-Chavez+Sts.%2C+Divisoria%2C+Cagayan+de+Oro+City',

  /**
   * Opening hours. day: 0 = Sunday … 6 = Saturday. Times are 24h, Asia/Manila.
   * Days not listed are treated as closed.
   */
  timeZone: 'Asia/Manila',
  hours: [
    { day: 1, open: '08:30', close: '17:30' },
    { day: 2, open: '08:30', close: '17:30' },
    { day: 3, open: '08:30', close: '17:30' },
    { day: 4, open: '08:30', close: '17:30' },
    { day: 5, open: '08:30', close: '17:30' },
    { day: 6, open: '08:30', close: '17:30' },
  ],
  hoursLabel: 'Monday to Saturday, 8:30 AM to 5:30 PM',
  hoursShort: 'Mon–Sat · 8:30 AM–5:30 PM',
  closedLabel: 'Closed Sunday',

  phone: {
    mobile: { label: '0917 717 7429', tel: '+639177177429' },
    // TODO-confirm: landlines copied from the Facebook cover banner. Confirm with the owner.
    landlines: [
      { label: '(088) 851-1478', tel: '+63888511478' },
      { label: '(088) 881-3757', tel: '+63888813757' },
    ],
  },

  email: 'nvaprintingservices@gmail.com',
  hrEmail: 'nvaprintingserviceshr@gmail.com',

  social: {
    facebook: 'https://www.facebook.com/nvaprintingservices',
    messenger: 'https://m.me/nvaprintingservices',
  },

  stores: {
    shopee: 'https://tinyurl.com/ycx8pd9b',
    lazada: 'https://tinyurl.com/mrkcfxa7',
  },

  // The one real public review. Do not add invented testimonials.
  review: {
    quote: 'Excellent customer service. They even accommodated my rush request. Keep up the good work.',
    author: 'Giovanni L.',
    source: 'Facebook review',
  },
} as const;

/** Primary navigation (header). */
export const nav = [
  { href: '/products/', label: 'Products' },
  { href: '/corporate-giveaways/', label: 'Corporate' },
  { href: '/artwork-guide/', label: 'Artwork Guide' },
  { href: '/order-online/', label: 'Order Online' },
  { href: '/shop-online/', label: 'Shop Online' },
  { href: '/contact/', label: 'Contact' },
] as const;

/** Footer link columns. */
export const footerNav = [
  {
    title: 'Print',
    links: [
      { href: '/products/#large-format', label: 'Tarpaulins & signage' },
      { href: '/products/#business-print', label: 'Business print' },
      { href: '/products/#apparel', label: 'Shirts & sublimation' },
      { href: '/products/#merch', label: 'Custom merch' },
      { href: '/corporate-giveaways/', label: 'Corporate giveaways' },
    ],
  },
  {
    title: 'Order',
    links: [
      { href: '/quote/', label: 'Get a quote' },
      { href: '/order-online/', label: 'Order online' },
      { href: '/shop-online/', label: 'Shopee & Lazada' },
      { href: '/artwork-guide/', label: 'Artwork guide' },
    ],
  },
  {
    title: 'NVA',
    links: [
      { href: '/contact/', label: 'Contact & directions' },
      { href: '/careers/', label: 'Careers' },
      { href: '/privacy/', label: 'Privacy policy' },
    ],
  },
] as const;

export const fullAddress = `${site.address.street}, ${site.address.landmark}, ${site.address.city} ${site.address.postalCode}`;

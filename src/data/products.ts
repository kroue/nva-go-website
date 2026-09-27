/**
 * Products and services.
 *
 * To add a product: copy an item inside the right category and change slug, name
 * and description. The slug must be unique (lowercase, dashes) because it is
 * used in quote links: /quote/?product=<slug>
 * To remove a product: delete its line. Nothing else needs to change.
 *
 * No prices here on purpose. Every item gets a "Get a quote" button.
 */
import { photos, type Photo } from './images';

export type Accent = 'cyan' | 'magenta' | 'yellow' | 'ink';

export interface Product {
  slug: string;
  name: string;
  description: string;
  /** Large-format items show the width × height (feet) size helper on the quote form. */
  largeFormat?: boolean;
}

export interface Category {
  id: string;
  name: string;
  /** Short line for the home page grid. */
  blurb: string;
  /** Longer intro on the Products page. */
  intro: string;
  accent: Accent;
  photo: Photo;
  items: Product[];
}

export const categories: Category[] = [
  {
    id: 'large-format',
    name: 'Large Format',
    blurb: 'Tarpaulins, banners, standees and signage that people notice from across the street.',
    intro:
      'Big, bright prints for store fronts, birthdays, fiestas, campaigns and company events. Tell us the size in feet and we handle the rest, eyelets and all.',
    accent: 'cyan',
    photo: photos.largeFormat,
    items: [
      {
        slug: 'tarpaulin',
        name: 'Tarpaulin printing',
        description: 'Full-color tarps in any size for birthdays, store fronts, events and announcements. Finished with eyelets or pole pockets.',
        largeFormat: true,
      },
      {
        slug: 'roll-up-banner',
        name: 'Roll-up banners',
        description: 'Pull-up stand with a printed banner that sets up in a minute. Easy to carry to booths, lobbies and seminars.',
        largeFormat: true,
      },
      {
        slug: 'x-banner',
        name: 'X-banners',
        description: 'Light, budget-friendly X-frame stand for promos, counters and school events.',
        largeFormat: true,
      },
      {
        slug: 'flag-banner',
        name: 'Teardrop & flag banners',
        description: 'Tall flag banners that move with the wind. Made for outdoor events, grand openings and roadside promos.',
        largeFormat: true,
      },
      {
        slug: 'standee',
        name: 'Standees & life-size cutouts',
        description: 'Printed, cut-to-shape figures for photo ops, product launches, debuts and birthdays.',
        largeFormat: true,
      },
      {
        // TODO-confirm: which sign materials NVA offers (panaflex, sintra, acrylic, etc.).
        slug: 'signage',
        name: 'Signage',
        description: 'Indoor and outdoor signs for shops, offices, clinics and events, printed to stay sharp for years.',
        largeFormat: true,
      },
      {
        slug: 'vehicle-decal',
        name: 'Vehicle decals',
        description: 'Branded stickers for cars, vans, motorcycles and delivery fleets. Your moving billboard around CDO.',
        largeFormat: true,
      },
    ],
  },
  {
    id: 'business-print',
    name: 'Business Print',
    blurb: 'Calling cards, flyers, menus and labels that make a small business look big.',
    intro:
      'The everyday printing that keeps a business running. Crisp, color-accurate and ready when you need it, from 100 calling cards to thousands of flyers.',
    accent: 'magenta',
    photo: photos.businessPrint,
    items: [
      {
        slug: 'calling-cards',
        name: 'Calling cards',
        description: 'Business cards on thick card stock, single or double-sided, with matte or glossy finish.',
      },
      {
        slug: 'flyers',
        name: 'Flyers',
        description: 'Promo flyers and leaflets for sales, openings, enrollment and events. Small runs or bulk.',
      },
      {
        slug: 'brochures',
        name: 'Brochures',
        description: 'Folded brochures that explain your products or services clearly. Bi-fold and tri-fold.',
      },
      {
        slug: 'menus',
        name: 'Menus',
        description: 'Restaurant and café menus, table tents and price boards that are easy to read and wipe clean.',
      },
      {
        slug: 'stickers-labels',
        name: 'Stickers & labels',
        description: 'Product labels, packaging stickers and die-cut logo stickers for food, cosmetics and small brands.',
      },
    ],
  },
  {
    id: 'apparel',
    name: 'Apparel & Sublimation',
    blurb: 'Team jerseys, event shirts and uniforms with colors that don’t fade in the wash.',
    intro:
      'Full-color sublimation and shirt printing for teams, reunions, fun runs, company uniforms and org shirts. Names and numbers included.',
    accent: 'yellow',
    photo: photos.apparel,
    items: [
      {
        slug: 'shirts',
        name: 'Shirts',
        description: 'Custom shirts for events, family reunions, orgs and staff uniforms. Small batches or bulk.',
      },
      {
        slug: 'jerseys',
        name: 'Jerseys',
        description: 'Full-sublimation jerseys for basketball, volleyball and esports teams, with names and numbers.',
      },
      {
        slug: 'caps',
        name: 'Caps',
        description: 'Caps with your logo for staff, events, campaigns and giveaways.',
      },
    ],
  },
  {
    id: 'merch',
    name: 'Custom Merch & Giveaways',
    blurb: 'Mugs, tumblers, lanyards, pins and more, branded with your logo.',
    intro:
      'Useful things with your name on them. Perfect for giveaways, souvenirs, seminars, reunions and company anniversaries.',
    accent: 'ink',
    photo: photos.merch,
    items: [
      {
        slug: 'mugs',
        name: 'Mugs',
        description: 'Full-color printed mugs for souvenirs, gifts and office giveaways.',
      },
      {
        slug: 'tumblers',
        name: 'Tumblers',
        description: 'Branded tumblers that get used every day, so your logo gets seen every day.',
      },
      {
        slug: 'pens',
        name: 'Printed pens',
        description: 'Pens with your logo or event name. A classic for seminars, schools and conventions.',
      },
      {
        slug: 'lanyards-ids',
        name: 'Lanyards & IDs',
        description: 'Printed lanyards and PVC IDs for employees, students, delegates and event staff.',
      },
      {
        slug: 'button-pins',
        name: 'Button pins',
        description: 'Round button pins for campaigns, org fairs, events and merch tables.',
      },
      {
        slug: 'keychains',
        name: 'Keychains',
        description: 'Custom keychains for souvenirs, wedding giveaways and brand merch.',
      },
      {
        slug: 'wristbands',
        name: 'Rubber wristbands',
        description: 'Silicone wristbands with your text or logo for events, teams and causes.',
      },
      {
        slug: 'umbrellas',
        name: 'Umbrellas',
        description: 'Branded umbrellas that are actually useful in CDO weather. Great for corporate gifts.',
      },
      {
        slug: 'fans',
        name: 'Fans',
        description: 'Printed hand fans for fiestas, campaigns, churches and outdoor events.',
      },
    ],
  },
];

export const allProducts: (Product & { categoryId: string; categoryName: string })[] = categories.flatMap((c) =>
  c.items.map((item) => ({ ...item, categoryId: c.id, categoryName: c.name })),
);

export const findProduct = (slug: string) => allProducts.find((p) => p.slug === slug);

export const quoteHref = (slug?: string) => (slug ? `/quote/?product=${encodeURIComponent(slug)}` : '/quote/');

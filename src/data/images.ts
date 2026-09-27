/**
 * Placeholder photography (Unsplash, free to use under the Unsplash License).
 *
 * TODO: swap every entry for NVA's own photos before launch. Real shop photos
 * (the counter, the machines, finished tarps, happy customers) convert better
 * than stock. To use a local photo instead:
 *   1. put the file in src/assets/photos/ (e.g. tarp-wall.jpg)
 *   2. import it at the top of this file:  import tarpWall from '../assets/photos/tarp-wall.jpg';
 *   3. set src: tarpWall  (and update the alt text to describe the new photo)
 *
 * If a remote photo ever fails to load, the frame falls back to a branded
 * CMYK panel, so the page never shows a broken image.
 */
import type { ImageMetadata } from 'astro';

export interface Photo {
  src: string | ImageMetadata;
  alt: string;
}

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const photos = {
  // TODO: swap for NVA photo — a finished tarpaulin or the large-format printer at work.
  largeFormat: {
    src: unsplash('photo-1612815154858-60aa4c59eaa6'),
    alt: 'Wide-format printer laying down a full-color banner',
  },
  // TODO: swap for NVA photo — a fan of calling cards, flyers and stickers.
  businessPrint: {
    src: unsplash('photo-1586075010923-2dd4570fb338'),
    alt: 'Stack of freshly printed business stationery',
  },
  // TODO: swap for NVA photo — sublimated jerseys or shirts on a rack.
  apparel: {
    src: unsplash('photo-1521572163474-6864f9cf17ab'),
    alt: 'Plain shirt ready for custom printing',
  },
  // TODO: swap for NVA photo — branded mugs, tumblers and lanyards laid out on a table.
  merch: {
    src: unsplash('photo-1514228742587-6b1558fcca3d'),
    alt: 'White ceramic mug ready for custom printing',
  },
  // TODO: swap for NVA photo — a corporate giveaway set packed for a client.
  corporate: {
    src: unsplash('photo-1540575467063-178a50c2df87'),
    alt: 'Conference hall full of attendees at a company event',
  },
  // TODO: swap for NVA photo — a school or community event with NVA-printed items.
  schoolEvent: {
    src: unsplash('photo-1523050854058-8df90110c9f1'),
    alt: 'Students celebrating at a school event',
  },
  // TODO: swap for NVA photo — a company anniversary or team photo with branded shirts.
  anniversary: {
    src: unsplash('photo-1522071820081-009f0129c71c'),
    alt: 'Team gathered around a table at the office',
  },
  // TODO: swap for NVA photo — the print floor.
  pressRoom: {
    src: unsplash('photo-1581092160562-40aa08e78837'),
    alt: 'Print operator checking a machine on the production floor',
  },
  // TODO: swap for NVA photo — a designer preparing a layout.
  design: {
    src: unsplash('photo-1561070791-2526d30994b5'),
    alt: 'Designer working on a layout with color swatches on the desk',
  },
  // TODO: swap for NVA photo — shirts or caps from a recent job.
  tees: {
    src: unsplash('photo-1556905055-8f358a7a47b2'),
    alt: 'Rack of shirts in assorted colors',
  },
} satisfies Record<string, Photo>;

/** "Our work" gallery on the home page. Order here = order on the page. */
export const gallery: (Photo & { caption: string })[] = [
  { ...photos.largeFormat, caption: 'Tarpaulins & banners' },
  { ...photos.tees, caption: 'Custom shirts' },
  { ...photos.merch, caption: 'Printed mugs' },
  { ...photos.businessPrint, caption: 'Business print' },
  { ...photos.pressRoom, caption: 'On the print floor' },
  { ...photos.design, caption: 'Layout & design' },
];

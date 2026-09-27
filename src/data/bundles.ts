/**
 * Corporate giveaway bundle ideas, shown on /corporate-giveaways/.
 * No prices: every bundle is quoted based on quantity and items chosen.
 * `items` are product slugs from src/data/products.ts.
 */
import { photos, type Photo } from './images';
import type { Accent } from './products';

export interface Bundle {
  id: string;
  name: string;
  forWho: string;
  description: string;
  items: string[];
  accent: Accent;
  photo: Photo;
}

export const bundles: Bundle[] = [
  {
    id: 'event-kit',
    name: 'Event kit',
    forWho: 'Seminars, launches, conventions, fun runs',
    description:
      'Everything your guests wear, carry and see on the day. Branded from the registration table to the stage backdrop.',
    items: ['lanyards-ids', 'pens', 'shirts', 'tarpaulin', 'roll-up-banner', 'tumblers'],
    accent: 'cyan',
    photo: photos.corporate,
  },
  {
    id: 'anniversary-kit',
    name: 'Company anniversary kit',
    forWho: 'Anniversaries, Christmas parties, team building',
    description:
      'Thank-you gifts your team will actually use, plus the backdrop for the group photo everyone will post.',
    items: ['shirts', 'mugs', 'tumblers', 'umbrellas', 'standee', 'tarpaulin'],
    accent: 'magenta',
    photo: photos.anniversary,
  },
  {
    id: 'school-kit',
    name: 'School event kit',
    forWho: 'Intramurals, foundation day, graduation, org fairs',
    description:
      'Jerseys for every team, IDs for every delegate, and souvenirs for every student. We work with school budgets and deadlines.',
    items: ['jerseys', 'lanyards-ids', 'button-pins', 'wristbands', 'fans', 'tarpaulin'],
    accent: 'yellow',
    photo: photos.schoolEvent,
  },
];

/** Budget ranges on the bulk inquiry form (the customer's budget, not NVA prices). */
export const budgetRanges = [
  'Below ₱10,000',
  '₱10,000 – ₱25,000',
  '₱25,000 – ₱50,000',
  '₱50,000 – ₱100,000',
  'Above ₱100,000',
  'Not sure yet',
];

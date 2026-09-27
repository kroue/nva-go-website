/**
 * Current job openings, shown on /careers/.
 *
 * Empty list → the page shows "No openings right now, send your CV anyway."
 * To post an opening, add an object like the example below. To close it, delete it.
 *
 * Example:
 * {
 *   title: 'Layout Artist',
 *   type: 'Full-time',
 *   summary: 'Turn customer ideas into print-ready tarpaulins, cards and merch layouts.',
 *   requirements: ['Comfortable with Photoshop or Illustrator', 'Can work with walk-in customers', 'Based in or near CDO'],
 * },
 */
export interface Job {
  title: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  summary: string;
  requirements: string[];
}

export const jobs: Job[] = [];

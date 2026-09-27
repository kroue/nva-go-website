/**
 * Frequently asked questions. Shown on the home page and marked up as FAQPage JSON-LD.
 * Keep answers short and plain. Answers are plain text (no HTML).
 */
export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: 'How long does printing take?',
    // TODO-confirm: typical turnaround per product with the owner.
    a: 'It depends on the item and quantity. Tarpaulins, calling cards and stickers are usually quick once you approve the layout. Shirts, jerseys and bulk merch take a bit longer. We always give you a clear release date together with your quote.',
  },
  {
    q: 'Do you accept rush orders?',
    // TODO-confirm: rush fee policy and cut-off times.
    a: 'Yes. Tick "Rush order" on the quote form or tell us your deadline on Messenger. We will tell you honestly if we can make it before you pay anything. The earlier in the day you send your file, the better.',
  },
  {
    q: 'What file formats do you accept?',
    a: 'PDF, AI, PSD, PNG and JPG. PDF is best for most jobs. For tarpaulins, send the file at the actual size in feet. Our Artwork Guide explains resolution, bleed and colors in plain words.',
  },
  {
    q: 'Can you design it for me?',
    // TODO-confirm: layout fee, if any.
    a: 'Yes. Choose "I need a design" on the quote form and send us your idea, logo, photos and text. Our layout artist prepares a draft for your approval before anything is printed.',
  },
  {
    q: 'Do you do bulk orders for companies and schools?',
    a: 'Yes, all the time. Giveaways, uniforms, IDs and lanyards, event tarps and souvenirs. Send us your quantity, deadline and budget through the Corporate Giveaways page and we will suggest options that fit.',
  },
  {
    q: 'Do you deliver?',
    // TODO-confirm: delivery coverage and fees.
    a: 'You can pick up your order at our shop in Divisoria, beside Greenwich and in front of LBC. We can also arrange delivery within Cagayan de Oro. Fees depend on the location and size of the order.',
  },
  {
    q: 'How do I pay?',
    // TODO-confirm: accepted payment channels and down payment policy.
    a: 'Cash at the shop, GCash, Maya or bank transfer. For bigger orders we usually ask for a down payment before printing, and the balance on pick-up or delivery.',
  },
];

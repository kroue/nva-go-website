/** JSON-LD builders. All business facts come from src/config/site.ts. */
import { SITE_URL, site } from '../config/site';
import { categories } from '../data/products';
import type { Faq } from '../data/faq';
import { openingHoursSpecification } from './hours';

export const BUSINESS_ID = `${SITE_URL}/#business`;

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;

export const localBusiness = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': BUSINESS_ID,
  name: site.name,
  description:
    'Printing shop in Divisoria, Cagayan de Oro City offering tarpaulin printing, signage, roll-up banners, sublimation shirts and jerseys, custom mugs, lanyards and IDs, and corporate giveaways. Rush orders welcome.',
  url: absoluteUrl('/'),
  logo: absoluteUrl('/apple-touch-icon.png'),
  image: absoluteUrl('/og.png'),
  telephone: site.phone.mobile.tel,
  email: site.email,
  priceRange: '₱₱',
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${site.address.street} (${site.address.landmark})`,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  hasMap: site.mapsUrl,
  openingHoursSpecification: openingHoursSpecification(),
  areaServed: [
    { '@type': 'City', name: 'Cagayan de Oro City' },
    { '@type': 'AdministrativeArea', name: 'Northern Mindanao' },
  ],
  sameAs: [site.social.facebook, site.stores.shopee, site.stores.lazada],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: site.phone.mobile.tel,
      email: site.email,
      areaServed: 'PH',
      availableLanguage: ['English', 'Filipino', 'Cebuano'],
    },
  ],
});

export const services = () =>
  categories.map((c) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': absoluteUrl(`/products/#${c.id}`),
    name: `${c.name} printing in Cagayan de Oro`,
    serviceType: c.name,
    description: c.intro,
    url: absoluteUrl(`/products/#${c.id}`),
    areaServed: { '@type': 'City', name: 'Cagayan de Oro City' },
    provider: { '@id': BUSINESS_ID },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: c.name,
      itemListElement: c.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.name,
          description: item.description,
        },
      })),
    },
  }));

export const faqPage = (faqs: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export interface Crumb {
  name: string;
  path: string;
}

export const breadcrumbs = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});

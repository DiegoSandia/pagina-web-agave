import { BRANCHES, FAQ, MENU, SITE, placeUrl } from './site';
import { SCHEDULES, type BranchId } from './hours';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const hhmm = (min: number) => `${String(Math.floor((min % 1440) / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

function hoursFor(id: BranchId) {
  return Object.entries(SCHEDULES[id])
    .filter(([, s]) => s)
    .map(([d, s]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DAYS[Number(d)], opens: hhmm(s!.open), closes: hhmm(s!.close) }));
}

export function jsonLd() {
  const menuId = `${SITE.url}/menu`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE.url}/#brand`,
        name: SITE.legalName,
        url: SITE.url,
        logo: `${SITE.url}/icon.png`,
        sameAs: [SITE.instagram, ...BRANCHES.map((b) => b.facebook)],
      },
      ...BRANCHES.map((b) => ({
        '@type': 'Restaurant',
        '@id': `${SITE.url}/#${b.id}`,
        name: `${SITE.legalName} (${b.name})`,
        brand: { '@id': `${SITE.url}/#brand` },
        url: SITE.url,
        telephone: SITE.phoneTel,
        email: SITE.email,
        image: `${SITE.url}/opengraph-image.jpg`,
        servesCuisine: ['Mexicana', 'Jalisciense', 'Birria'],
        priceRange: '$$',
        acceptsReservations: `${SITE.url}/reservar`,
        menu: menuId,
        sameAs: [b.facebook],
        address: {
          '@type': 'PostalAddress',
          streetAddress: b.street,
          addressLocality: 'Tlalnepantla de Baz',
          addressRegion: 'Estado de México',
          postalCode: b.postalCode,
          addressCountry: 'MX',
        },
        hasMap: placeUrl(b),
        openingHoursSpecification: hoursFor(b.id),      })),
      {
        '@type': 'Menu',
        '@id': menuId,
        name: 'Menú El Agave',
        hasMenuSection: MENU.filter((g) => g.id !== 'barra').flatMap((g) =>
          g.categories.map((c) => ({
            '@type': 'MenuSection',
            name: c.label,
            hasMenuItem: c.items
              .filter((i) => i.price)
              .map((i) => ({
                '@type': 'MenuItem',
                name: i.name,
                ...(i.desc || i.note ? { description: [i.note, i.desc].filter(Boolean).join('. ') } : {}),
                offers: { '@type': 'Offer', price: String(i.price), priceCurrency: 'MXN' },
              })),
          })),
        ),
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}

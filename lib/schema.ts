import { BRANCHES, FAQ, MENU, SITE } from './site';

const HOURS = [
  { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday', 'Thursday'], opens: '08:00', closes: '23:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '08:00', closes: '02:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '08:00', closes: '22:00' },
];

export function jsonLd() {
  const menuId = `${SITE.url}/#menu`;
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
        acceptsReservations: true,
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
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapsQuery)}`,
        openingHoursSpecification: HOURS,
      })),
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

import type { NextConfig } from 'next';

const PLACE = {
  arboledas: 'ChIJv3R-YwAd0oUR7bI8fhf2seM',
  centro: 'ChIJDUTgGB330YURjObAqnz2DSA',
};

const place = (name: string, id: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`El Agave ${name}`)}&query_place_id=${id}`;
const review = (id: string) => `https://search.google.com/local/writereview?placeid=${id}`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75, 85],
  },
  async redirects() {
    return [
      { source: '/arboledas', destination: place('Arboledas', PLACE.arboledas), permanent: false },
      { source: '/centro', destination: place('Centro', PLACE.centro), permanent: false },
      { source: '/resena-arboledas', destination: review(PLACE.arboledas), permanent: false },
      { source: '/resena-centro', destination: review(PLACE.centro), permanent: false },
      { source: '/whatsapp', destination: 'https://wa.me/525510699414', permanent: false },
      { source: '/horario', destination: '/#sucursales', permanent: false },
      { source: '/ubicacion', destination: '/#sucursales', permanent: false },
      { source: '/carta', destination: '/menu', permanent: true },
      { source: '/reservas', destination: '/reservar', permanent: true },
    ];
  },
};

export default nextConfig;

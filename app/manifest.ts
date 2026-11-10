import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'El Agave — Birria & Cantaritos',
    short_name: 'El Agave',
    description: 'Birria estilo Jalisco y cantaritos en Tlalnepantla.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0706',
    theme_color: '#0A0706',
    lang: 'es-MX',
    icons: [{ src: '/icon.png', sizes: '192x192', type: 'image/png' }],
  };
}

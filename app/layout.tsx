import type { Metadata, Viewport } from 'next';
import { Inter, Monoton } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SmoothScroll from '@/components/SmoothScroll';
import { SITE } from '@/lib/site';
import { jsonLd } from '@/lib/schema';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const monoton = Monoton({ subsets: ['latin'], weight: '400', variable: '--font-monoton', display: 'swap' });
const bebas = localFont({
  src: '../assets/fonts/BebasNeue-Regular.ttf',
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'El Agave — Birria y Cantaritos en Tlalnepantla',
    template: '%s · El Agave',
  },
  description:
    'Birria estilo Jalisco y cantaritos de barro en Tlalnepantla. Dos sucursales: Arboledas y Centro. Martes a domingo de 10 AM a 2 AM. Aparta tu mesa por WhatsApp.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: SITE.url,
    siteName: SITE.legalName,
    title: 'El Agave — Birria que abraza, cantaritos que prenden',
    description: 'Birria estilo Jalisco y cantaritos en Tlalnepantla. Dos sucursales, abierto de martes a domingo.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Agave — Birria y Cantaritos',
    description: 'Birria estilo Jalisco y cantaritos en Tlalnepantla.',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0A0706',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${inter.variable} ${monoton.variable} ${bebas.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, '\\u003c') }}
        />
        <SmoothScroll />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

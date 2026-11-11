import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Reserve from '@/components/Reserve';
import Locations from '@/components/Locations';
import Footer from '@/components/Footer';
import Dock from '@/components/Dock';

export const metadata: Metadata = {
  title: 'Reservar mesa',
  description:
    'Aparta tu mesa en El Agave Arboledas o Centro, Tlalnepantla. Elige sucursal, día, hora y personas, y confirma por WhatsApp.',
  alternates: { canonical: '/reservar' },
};

export default function ReservarPage() {
  return (
    <>
      <Nav onHome={false} />
      <main className="page-main">
        <Reserve asPage />
        <Locations />
      </main>
      <Footer />
      <Dock onHome={false} />
    </>
  );
}

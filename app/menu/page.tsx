import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import MenuSection from '@/components/MenuSection';
import Footer from '@/components/Footer';
import Dock from '@/components/Dock';
import { ArrowRight, WhatsApp } from '@/components/icons';
import { waLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Menú con precios',
  description:
    'Menú completo de El Agave en Tlalnepantla: birria estilo Jalisco desde $150, tacos, carne asada, desayunos, cantaritos, mezcalinas, cervezas y barra con precios.',
  alternates: { canonical: '/menu' },
};

export default function MenuPage() {
  return (
    <>
      <Nav onHome={false} />
      <main className="page-main">
        <MenuSection asPage />
        <section className="page-cta">
          <div className="container page-cta-inner">
            <div>
              <h2>¿Ya se te antojó?</h2>
              <p>Aparta tu mesa en Arboledas o Centro y llega directo a pedir.</p>
            </div>
            <div className="page-cta-actions">
              <a href="/reservar" className="btn btn-primary btn-lg">
                Aparta tu mesa <ArrowRight />
              </a>
              <a href={waLink('Hola, tengo una pregunta sobre el menú.')} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
                <WhatsApp size={20} /> Preguntar
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Dock onHome={false} />
    </>
  );
}

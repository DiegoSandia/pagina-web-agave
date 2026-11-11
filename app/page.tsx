import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Signature from '@/components/Signature';
import MenuSection from '@/components/MenuSection';
import Gallery from '@/components/Gallery';
import NightBand from '@/components/NightBand';
import Locations from '@/components/Locations';
import Reserve from '@/components/Reserve';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Dock from '@/components/Dock';

export default function Home() {
  return (
    <>
      <a href="#menu" className="skip">Saltar al menú</a>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Signature />
        <MenuSection />
        <Gallery />
        <NightBand />
        <Locations />
        <Reserve />
        <Faq />
      </main>
      <Footer />
      <Dock />
    </>
  );
}

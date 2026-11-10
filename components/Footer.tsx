import Image from 'next/image';
import logo from '@/assets/brand/logo-full.png';
import { BRANCHES, SITE } from '@/lib/site';
import { Facebook, Instagram } from './icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-neon" aria-hidden="true">
          <span className="neon flicker">Prende</span> <span className="neon neon-hot">la noche</span>
        </p>

        <div className="footer-grid">
          <div className="footer-brand">
            <Image src={logo} alt="El Agave — Birria & Cantaritos" width={150} height={200} className="footer-logo" />
            <p>Birria estilo Jalisco y cantaritos de barro en Tlalnepantla de Baz, Estado de México.</p>
          </div>

          {BRANCHES.map((b) => (
            <div key={b.id} className="footer-col">
              <h3>{b.name}</h3>
              <p>{b.street}<br />{b.area}</p>
              <a href={b.facebook} target="_blank" rel="noopener noreferrer"><Facebook size={15} /> {b.facebookHandle}</a>
            </div>
          ))}

          <div className="footer-col">
            <h3>Contacto</h3>
            <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={15} /> {SITE.instagramHandle}</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} El Agave · Birria & Cantaritos</span>
          <span>La propina es opcional · Consume con moderación</span>
        </div>
      </div>
    </footer>
  );
}

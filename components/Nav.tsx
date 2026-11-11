'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import mark from '@/assets/brand/agave-mark.png';
import LiveStatus from './LiveStatus';
import { ArrowUpRight, Instagram, Phone } from './icons';
import { SITE } from '@/lib/site';
import { lockScroll } from '@/lib/lenis';

const LINKS = [
  { href: '#firma', label: 'La firma' },
  { href: '#menu', label: 'Menú' },
  { href: '#ambiente', label: 'Ambiente' },
  { href: '#sucursales', label: 'Sucursales' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 480 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
        <div className="nav-inner">
          <a href="#top" className="nav-brand" onClick={close} aria-label="El Agave, inicio">
            <Image src={mark} alt="" width={40} height={35} priority className="nav-mark" />
            <span className="nav-word">El Agave</span>
          </a>

          <nav className="nav-links" aria-label="Principal">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav-end">
            <LiveStatus className="nav-live" />
            <a href="#reservar" className="btn btn-primary btn-sm nav-cta">
              Reservar
            </a>
            <button
              type="button"
              className={`burger ${open ? 'is-open' : ''}`}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`sheet ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={!open}>
        <nav className="sheet-links" aria-label="Móvil">
          {[...LINKS, { href: '#faq', label: 'Preguntas' }].map((l, i) => (
            <a key={l.href} href={l.href} onClick={close} className="sheet-link" style={{ '--i': i } as React.CSSProperties}>
              <span className="sheet-num">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="sheet-foot">
          <a href="#reservar" onClick={close} className="btn btn-primary btn-lg">
            Aparta tu mesa <ArrowUpRight />
          </a>
          <div className="sheet-contact">
            <a href={`tel:${SITE.phoneTel}`}><Phone size={16} /> {SITE.phoneDisplay}</a>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={16} /> {SITE.instagramHandle}</a>
          </div>
        </div>
      </div>
    </>
  );
}

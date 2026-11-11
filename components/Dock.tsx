'use client';

import { useEffect, useState } from 'react';
import { BRANCHES, SITE, directionsUrl, waLink } from '@/lib/site';
import { Phone, Pin, WhatsApp } from './icons';

export default function Dock({ onHome = true }: { onHome?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 160;
      setShow((!onHome || window.scrollY > window.innerHeight * 0.7) && !nearEnd);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onHome]);

  const wa = waLink('Hola, vi su página y quiero información.');

  return (
    <>
      <nav className={`dock ${show ? 'is-visible' : ''}`} aria-label="Acciones rápidas">
        <a href={`tel:${SITE.phoneTel}`}><Phone size={18} /><span>Llamar</span></a>
        <a href={directionsUrl(BRANCHES[0])} target="_blank" rel="noopener noreferrer"><Pin size={18} /><span>Cómo llegar</span></a>
        <a href={onHome ? '#reservar' : '/reservar'} className="dock-main"><span>Reservar</span></a>
      </nav>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={`wa-fab ${show ? 'is-visible' : ''}`} aria-label="Escríbenos por WhatsApp">
        <WhatsApp size={26} />
        <span className="wa-tip">¿Dudas? Escríbenos</span>
      </a>
    </>
  );
}

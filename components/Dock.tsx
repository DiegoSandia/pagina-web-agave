'use client';

import { useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import { BRANCHES, SITE, directionsUrl } from '@/lib/site';
import { getOrigin } from '@/lib/origin';
import ReserveModal, { openReserve } from './ReserveModal';
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

  const open = (from: string) => {
    track('Abrir reserva', { desde: from, origen: getOrigin() });
    openReserve();
  };

  return (
    <>
      <nav className={`dock ${show ? 'is-visible' : ''}`} aria-label="Acciones rápidas">
        <a href={`tel:${SITE.phoneTel}`}><Phone size={18} /><span>Llamar</span></a>
        <a href={directionsUrl(BRANCHES[0])} target="_blank" rel="noopener noreferrer"><Pin size={18} /><span>Cómo llegar</span></a>
        <button type="button" className="dock-main" onClick={() => open('barra')}><span>Reservar</span></button>
      </nav>
      <button type="button" className={`wa-fab ${show ? 'is-visible' : ''}`} onClick={() => open('whatsapp-flotante')} aria-label="Apartar mesa por WhatsApp">
        <WhatsApp size={26} />
        <span className="wa-tip">Aparta tu mesa</span>
      </button>
      <ReserveModal />
    </>
  );
}

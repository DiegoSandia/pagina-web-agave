'use client';

import { useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import { getOrigin } from '@/lib/origin';
import { openReserve } from './ReserveModal';
import { ArrowRight, Close } from './icons';

// Season banner: disappears by itself after Reyes.
const UNTIL = new Date('2027-01-07T00:00:00-06:00').getTime();
const KEY = 'agave_promo_posadas';

export default function PromoBar({ hidden = false }: { hidden?: boolean }) {
  // Start visible so server and client markup match; the effect hides it when expired or dismissed.
  const [show, setShow] = useState(true);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(KEY) === '1';
    } catch {}
    setShow(Date.now() < UNTIL && !dismissed);
  }, []);

  if (!show) return null;

  const open = () => {
    track('Abrir reserva', { desde: 'franja-posadas', origen: getOrigin() });
    openReserve({ occasion: 'Posada' });
  };

  const dismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {}
  };

  return (
    <div className={`promo-bar ${hidden ? 'is-off' : ''}`} role="region" aria-label="Aviso de temporada">
      <button type="button" className="promo-bar-cta" onClick={open}>
        <span aria-hidden="true">🎄</span>
        <span>
          <strong>Posadas y grupos:</strong> <span className="promo-bar-long">diciembre se llena, </span>aparta tu fecha
        </span>
        <ArrowRight size={14} />
      </button>
      <button type="button" className="promo-bar-x" onClick={dismiss} aria-label="Cerrar aviso">
        <Close size={14} />
      </button>
    </div>
  );
}

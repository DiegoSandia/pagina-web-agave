'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';
import { captureOrigin, getOrigin } from '@/lib/origin';

function eventFor(href: string) {
  if (href.startsWith('https://wa.me')) return 'WhatsApp';
  if (href.startsWith('tel:')) return 'Llamar';
  if (href.includes('/maps/dir/')) return 'Cómo llegar';
  if (href.includes('writereview')) return 'Escribir reseña';
  if (/\/reservar|#reservar/.test(href)) return 'Ir a reservar';
  if (/\/menu|#menu/.test(href)) return 'Ver menú';
  return null;
}

export default function Tracker() {
  useEffect(() => {
    captureOrigin();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a');
      const href = a?.getAttribute('href');
      const name = href && eventFor(href);
      if (name) track(name, { origen: getOrigin(), pagina: window.location.pathname });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}

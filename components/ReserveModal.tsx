'use client';

import { useEffect, useRef, useState } from 'react';
import ReserveForm, { type ReservePreset } from './ReserveForm';
import { Close, WhatsApp } from './icons';
import { lockScroll } from '@/lib/lenis';
import { waLink } from '@/lib/site';

export const OPEN_RESERVE = 'agave:open-reserve';

export function openReserve(preset?: ReservePreset) {
  window.dispatchEvent(new CustomEvent(OPEN_RESERVE, { detail: preset ?? null }));
}

export default function ReserveModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const [preset, setPreset] = useState<ReservePreset | null>(null);

  useEffect(() => {
    const open = (e: Event) => {
      setPreset((e as CustomEvent<ReservePreset | null>).detail ?? null);
      setMounted(true);
      if (ref.current && !ref.current.open) {
        ref.current.showModal();
        lockScroll(true);
      }
    };
    window.addEventListener(OPEN_RESERVE, open);
    return () => window.removeEventListener(OPEN_RESERVE, open);
  }, []);

  const close = () => {
    ref.current?.close();
    lockScroll(false);
  };

  const group = !!preset?.occasion;

  return (
    <dialog
      ref={ref}
      className="res-modal"
      aria-labelledby="res-modal-title"
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="res-modal-inner">
        <header className="res-modal-head">
          <h2 id="res-modal-title">{group ? 'Aparta para tu grupo' : 'Aparta tu mesa'}</h2>
          <button type="button" className="lb-btn res-modal-close" onClick={close} aria-label="Cerrar">
            <Close size={20} />
          </button>
        </header>
        {mounted && <ReserveForm key={preset?.occasion ?? 'mesa'} idPrefix="modal" preset={preset ?? undefined} />}
        <a
          className="res-modal-chat"
          href={waLink(group ? 'Hola, quiero cotizar un paquete para grupo. Somos ___ personas, para (desayuno / comida / cena), el día ___, en la sucursal ___.' : 'Hola, tengo una pregunta.')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsApp size={16} /> {group ? '¿Dudas sobre tu grupo? Escríbenos' : '¿Solo una pregunta? Escríbenos'}
        </a>
      </div>
    </dialog>
  );
}

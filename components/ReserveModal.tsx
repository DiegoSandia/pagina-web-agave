'use client';

import { useEffect, useRef, useState } from 'react';
import ReserveForm from './ReserveForm';
import { Close, WhatsApp } from './icons';
import { lockScroll } from '@/lib/lenis';
import { waLink } from '@/lib/site';

export const OPEN_RESERVE = 'agave:open-reserve';

export function openReserve() {
  window.dispatchEvent(new Event(OPEN_RESERVE));
}

export default function ReserveModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const open = () => {
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
          <h2 id="res-modal-title">Aparta tu mesa</h2>
          <button type="button" className="lb-btn res-modal-close" onClick={close} aria-label="Cerrar">
            <Close size={20} />
          </button>
        </header>
        {mounted && <ReserveForm idPrefix="modal" />}
        <a className="res-modal-chat" href={waLink('Hola, tengo una pregunta.')} target="_blank" rel="noopener noreferrer">
          <WhatsApp size={16} /> ¿Solo una pregunta? Escríbenos
        </a>
      </div>
    </dialog>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import { GALLERY } from '@/lib/site';
import { lockScroll } from '@/lib/lenis';
import { ArrowLeft, ArrowRight, Close } from './icons';

const VT = 'gallery-photo';

function transition(update: () => void) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !document.startViewTransition) {
    update();
    return null;
  }
  const t = document.startViewTransition(() => flushSync(update));
  t.ready.catch(() => {});
  return t;
}

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);

  const open = (i: number) => {
    const thumb = thumbs.current[i];
    if (thumb) thumb.style.viewTransitionName = VT;
    const t = transition(() => {
      if (thumb) thumb.style.viewTransitionName = '';
      setIndex(i);
      dialog.current?.showModal();
      lockScroll(true);
    });
    if (!t && thumb) thumb.style.viewTransitionName = '';
  };

  const close = useCallback(() => {
    if (index === null) return;
    const thumb = thumbs.current[index];
    const t = transition(() => {
      setIndex(null);
      dialog.current?.close();
      lockScroll(false);
      if (thumb) thumb.style.viewTransitionName = VT;
    });
    const clear = () => thumb && (thumb.style.viewTransitionName = '');
    if (t) t.finished.finally(clear);
    else clear();
  }, [index]);

  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + GALLERY.length) % GALLERY.length)),
    [],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, step]);

  const touchX = useRef(0);
  const current = index === null ? null : GALLERY[index];

  return (
    <section id="ambiente" className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow rv">Así se vive</p>
            <h2 id="gallery-title" className="h-xl rv">El ambiente</h2>
          </div>
          <p className="lede rv">Madera, neón, barro y la mesa llena. Toca cualquier foto para verla completa.</p>
        </header>

        <ul className="bento">
          {GALLERY.map((g, i) => (
            <li key={i} className={`bento-item rv-img ${g.span ?? ''}`}>
              <button
                ref={(el) => {
                  thumbs.current[i] = el;
                }}
                type="button"
                className="bento-btn"
                onClick={() => open(i)}
                aria-label={`Ver foto: ${g.alt}`}
              >
                <Image src={g.img} alt={g.alt} placeholder="blur" sizes="(max-width: 700px) 50vw, 25vw" />
                <span className="bento-label">{g.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Galería"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        }}
      >
        {current && (
          <>
            <figure className="lb-figure" onClick={(e) => e.target === e.currentTarget && close()}>
              <Image
                key={index}
                src={current.img}
                alt={current.alt}
                placeholder="blur"
                sizes="92vw"
                className="lb-img"
                style={{ viewTransitionName: VT }}
              />
              <figcaption>
                <span>{current.label}</span>
                <span className="lb-count">{String(index! + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}</span>
              </figcaption>
            </figure>
            <button type="button" className="lb-btn lb-close" onClick={close} aria-label="Cerrar">
              <Close />
            </button>
            <button type="button" className="lb-btn lb-prev" onClick={() => step(-1)} aria-label="Anterior">
              <ArrowLeft />
            </button>
            <button type="button" className="lb-btn lb-next" onClick={() => step(1)} aria-label="Siguiente">
              <ArrowRight />
            </button>
          </>
        )}
      </dialog>
    </section>
  );
}

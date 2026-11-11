'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from './icons';
import { SIGNATURE } from '@/lib/site';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Signature() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.utils.toArray<HTMLElement>('.sig-card img').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: { trigger: img.closest('.sig-card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="firma" className="sig" aria-labelledby="sig-title">
      <div className="sig-viewport">
        <div ref={track} className="sig-track">
          <div className="sig-intro">
            <p className="eyebrow">La firma de la casa</p>
            <h2 id="sig-title" className="h-xl">
              Lo que <span className="neon">pides</span> la segunda vez
            </h2>
            <p className="lede">
              Cuatro razones por las que la gente regresa. Empieza por la birria; termina con la cazuela de diez litros.
            </p>
            <span className="sig-hint" aria-hidden="true">
              <span className="hint-desk">Sigue bajando</span>
              <span className="hint-mob">Desliza</span>
              <ArrowRight size={16} />
            </span>
          </div>

          {SIGNATURE.map((s) => (
            <article key={s.n} className="sig-card">
              <div className="sig-img">
                <Image src={s.img} alt={s.name} placeholder="blur" sizes="(max-width: 900px) 82vw, 34vw" />
              </div>
              <span className="sig-num" aria-hidden="true">{s.n}</span>
              <div className="sig-body">
                <h3>{s.name}</h3>
                <p>{s.copy}</p>
                <span className="price-chip">{s.price}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

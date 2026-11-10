'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CountUp from './CountUp';
import birria from '@/assets/photos/v2/birria-neon.jpg';
import barra from '@/assets/photos/v2/barra-tequila.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LEAD =
  'Somos una cantina con dos casas en Tlalnepantla. Birria estilo Jalisco a fuego lento, cantaritos de barro con Tequila Arandas y la mesa siempre llena. Lo que aprendimos en casa, servido de noche.';

export default function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.story-word',
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: { trigger: '.story-lead', start: 'top 80%', end: 'bottom 45%', scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          const amount = Number(el.dataset.parallax);
          gsap.fromTo(
            el,
            { yPercent: -amount },
            { yPercent: amount, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="historia" className="section story" aria-labelledby="story-title">
      <div className="container story-grid">
        <div className="story-copy">
          <p className="eyebrow rv">Nuestra historia</p>
          <h2 id="story-title" className="sr-only">Nuestra historia</h2>
          <p className="story-lead">
            {LEAD.split(' ').map((w, i) => (
              <span key={i} className="story-word">
                {w}{' '}
              </span>
            ))}
          </p>

          <dl className="stats">
            <div className="stat rv">
              <dt>Sucursales</dt>
              <dd><CountUp to={2} /></dd>
            </div>
            <div className="stat rv">
              <dt>Litros, la cazuela grande</dt>
              <dd><CountUp to={10} /></dd>
            </div>
            <div className="stat rv">
              <dt>En copeo, todos los días</dt>
              <dd>2×1</dd>
            </div>
            <div className="stat rv">
              <dt>Calificación en Google</dt>
              <dd><CountUp to={4.4} decimals={1} />★</dd>
            </div>
          </dl>
        </div>

        <div className="story-media">
          <figure className="story-fig story-fig-a rv-img">
            <div className="parallax-wrap">
              <Image data-parallax="8" src={birria} alt="Birria estilo Jalisco bajo el letrero de neón de El Agave" placeholder="blur" sizes="(max-width: 900px) 90vw, 40vw" />
            </div>
          </figure>
          <figure className="story-fig story-fig-b rv-img">
            <div className="parallax-wrap">
              <Image data-parallax="12" src={barra} alt="Bartender sirviendo tequila en la barra" placeholder="blur" sizes="(max-width: 900px) 50vw, 22vw" />
            </div>
          </figure>
          <span className="sticker" aria-hidden="true">Tequila<br />Arandas</span>
        </div>
      </div>
    </section>
  );
}

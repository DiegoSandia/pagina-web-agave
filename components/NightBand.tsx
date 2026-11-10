'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import noche from '@/assets/photos/v2/noche-neon.jpg';
import { ArrowRight } from './icons';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function NightBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.night-img', { scale: 1.25, yPercent: -6 }, {
          scale: 1,
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.fromTo('.night-title .w', { yPercent: 110 }, {
          yPercent: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.night-title', start: 'top 85%' },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="night" aria-labelledby="night-title">
      <div className="night-media" aria-hidden="true">
        <Image src={noche} alt="" fill placeholder="blur" sizes="100vw" className="night-img" />
      </div>
      <div className="container night-inner">
        <p className="eyebrow">Viernes y sábado hasta las 2 AM</p>
        <h2 id="night-title" className="night-title">
          <span className="w-wrap"><span className="w">Prende</span></span>{' '}
          <span className="w-wrap"><span className="w">la</span></span>{' '}
          <span className="w-wrap"><span className="w neon neon-hot flicker">noche</span></span>
        </h2>
        <p className="lede">Karaoke, cantaritos de barro y 2×1 en copeo. Llega temprano o aparta tu mesa.</p>
        <a href="#reservar" className="btn btn-primary btn-lg">
          Aparta tu mesa <ArrowRight />
        </a>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef } from 'react';

// React doesn't serialize `muted` in SSR, so autoplay is kicked off after hydration.
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    v.play().catch(() => {});
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="hero-video"
      muted
      loop
      playsInline
      preload="auto"
      poster="/video/hero-poster.webp"
      aria-hidden="true"
    >
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
  );
}

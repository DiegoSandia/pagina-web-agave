'use client';

import { useEffect, useRef } from 'react';

// React doesn't serialize `muted` in SSR, so playback starts after hydration, only while visible.
export default function HeroVideo({ className = '', preload = 'auto' }: { className?: string; preload?: 'auto' | 'none' }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={`bg-video ${className}`}
      muted
      loop
      playsInline
      preload={preload}
      poster="/video/hero-poster.webp"
      aria-hidden="true"
    >
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
  );
}

import Embers from './Embers';
import HeroVideo from './HeroVideo';
import LiveStatus from './LiveStatus';
import { ArrowRight, Pin, Star } from './icons';
import { SITE, TOTAL_REVIEWS } from '@/lib/site';

export default function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-media">
        <HeroVideo />
      </div>
      <Embers />

      <div className="hero-inner">
        <div className="hero-copy">
          <LiveStatus className="hero-live" />

          <h1 id="hero-title" className="hero-title">
            <span className="line"><span style={{ '--i': 0 } as React.CSSProperties}>Birria que</span></span>
            <span className="line"><span style={{ '--i': 1 } as React.CSSProperties} className="neon">abraza.</span></span>
            <span className="line"><span style={{ '--i': 2 } as React.CSSProperties}>Cantaritos</span></span>
            <span className="line"><span style={{ '--i': 3 } as React.CSSProperties}>que <em className="neon neon-hot flicker">prenden.</em></span></span>
          </h1>

          <p className="hero-lede">
            Birria estilo Jalisco a fuego lento y cantaritos servidos en barro.
            Dos sucursales en Tlalnepantla, abiertas desde las 10 AM y hasta las 5 AM en Arboledas.
          </p>

          <div className="hero-ctas">
            <a href="#reservar" className="btn btn-primary btn-lg">
              Aparta tu mesa <ArrowRight />
            </a>
            <a href="#menu" className="btn btn-ghost btn-lg">
              Ver el menú
            </a>
          </div>
        </div>

        <div className="hero-meta">
          <a href="#opiniones" className="hero-chip">
            <span className="stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} />)}
            </span>
            <strong>{SITE.rating}</strong> · {TOTAL_REVIEWS} reseñas en Google
          </a>
          <a href="#sucursales" className="hero-chip">
            <Pin size={15} /> Arboledas · Centro
          </a>
          <a href="#firma" className="scroll-cue" aria-label="Seguir bajando">
            <span>Desliza</span>
            <i aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

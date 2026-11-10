import { ArrowUpRight, Star } from './icons';
import { SITE } from '@/lib/site';

export default function Proof() {
  const pct = (SITE.rating / 5) * 100;
  return (
    <section className="section proof" aria-labelledby="proof-title">
      <div className="container proof-inner">
        <p className="eyebrow rv">Lo que dicen en Google</p>
        <h2 id="proof-title" className="sr-only">Calificación en Google</h2>
        <div className="proof-score rv" aria-label={`${SITE.rating} de 5 estrellas`}>
          <span className="proof-num">{SITE.rating}</span>
          <div className="proof-side">
            <span className="proof-stars" style={{ '--pct': `${pct}%` } as React.CSSProperties} aria-hidden="true">
              <span className="base">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={26} />)}</span>
              <span className="fill">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={26} />)}</span>
            </span>
            <span className="proof-count">Más de {SITE.reviewCount} reseñas</span>
          </div>
        </div>
        <div className="proof-ctas rv">
          <a href={SITE.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            Leer reseñas <ArrowUpRight />
          </a>
          <a href={SITE.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-link">
            ¿Ya viniste? Cuéntanos qué tal
          </a>
        </div>
      </div>
    </section>
  );
}

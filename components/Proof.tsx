import { ArrowUpRight, Star } from './icons';
import { BRANCHES, SITE, TOTAL_REVIEWS, placeUrl, writeReviewUrl } from '@/lib/site';

function Stars({ value, size }: { value: number; size: number }) {
  return (
    <span className="proof-stars" style={{ '--pct': `${(value / 5) * 100}%` } as React.CSSProperties} aria-hidden="true">
      <span className="base">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={size} />)}</span>
      <span className="fill">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={size} />)}</span>
    </span>
  );
}

export default function Proof() {
  return (
    <section id="opiniones" className="section proof" aria-labelledby="proof-title">
      <div className="container proof-inner">
        <p className="eyebrow rv">Lo que dicen en Google</p>
        <h2 id="proof-title" className="sr-only">Calificación en Google</h2>
        <div className="proof-score rv" aria-label={`${SITE.rating} de 5 estrellas con ${TOTAL_REVIEWS} reseñas`}>
          <span className="proof-num">{SITE.rating}</span>
          <div className="proof-side">
            <Stars value={SITE.rating} size={26} />
            <span className="proof-count">{TOTAL_REVIEWS} reseñas</span>
          </div>
        </div>

        <ul className="proof-branches rv">
          {BRANCHES.map((b) => (
            <li key={b.id} className="proof-branch">
              <div className="proof-branch-head">
                <strong>{b.name}</strong>
                <span>
                  <Stars value={b.rating} size={14} /> {b.rating} · {b.reviewCount} reseñas
                </span>
              </div>
              <div className="proof-branch-links">
                <a href={placeUrl(b)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  Leer reseñas <ArrowUpRight size={15} />
                </a>
                <a href={writeReviewUrl(b)} target="_blank" rel="noopener noreferrer" className="btn btn-link">
                  Escribir una
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

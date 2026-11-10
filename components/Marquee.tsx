import { Spark } from './icons';
import { PROMOS } from '@/lib/site';

export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {PROMOS.map((p, i) => (
        <li key={i} className={i % 2 ? 'outline' : ''}>
          <Spark size={18} className="marquee-spark" />
          {p}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" role="region" aria-label="Promociones">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

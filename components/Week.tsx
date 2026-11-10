'use client';

import { useOpenStatus } from '@/lib/useOpenStatus';
import { WEEK, waLink } from '@/lib/site';
import { ArrowUpRight, Spark } from './icons';

export default function Week() {
  const status = useOpenStatus();
  const today = status?.day;

  return (
    <section id="semana" className="section week" aria-labelledby="week-title">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow rv">Cada día tiene su plan</p>
            <h2 id="week-title" className="h-xl rv">La semana en <span className="neon">El Agave</span></h2>
          </div>
          <p className="lede rv">Lunes y martes descansamos. El resto de la semana, la cocina abre temprano y la barra cierra tarde.</p>
        </header>

        <ol className="week-grid">
          {WEEK.map((d, i) => (
            <li key={d.day} className={`week-card rv ${today === d.day ? 'is-today' : ''}`} style={{ '--i': i } as React.CSSProperties}>
              {today === d.day && <span className="today-badge">Hoy</span>}
              <span className="week-short" aria-hidden="true">{d.short}</span>
              <span className="week-name">{d.name}</span>
              <span className="week-hours">{d.hours}</span>
              <span className="week-plan"><Spark size={12} /> {d.plan}</span>
            </li>
          ))}
        </ol>

        <div className="perk rv">
          <div>
            <strong>2×1 en copeo todos los días</strong>
            <span>Y un cantarito chico de cortesía cuando llegas con mesa de 4 o más.</span>
          </div>
          <a className="btn btn-ghost" href={waLink('Hola, quiero apartar una mesa para 4 o más personas en El Agave.')} target="_blank" rel="noopener noreferrer">
            Apartar para 4+ <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { BRANCHES, SITE, directionsUrl, mapEmbedUrl, type Branch } from '@/lib/site';
import { SCHEDULE, formatTime } from '@/lib/hours';
import { useOpenStatus } from '@/lib/useOpenStatus';
import LiveStatus from './LiveStatus';
import { ArrowUpRight, Facebook, Phone, Pin } from './icons';

const ORDER = [2, 3, 4, 5, 6, 0, 1];
const NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function BranchCard({ b, i }: { b: Branch; i: number }) {
  const [map, setMap] = useState(false);
  return (
    <article className="branch rv">
      <header className="branch-head">
        <span className="tag">Sucursal 0{i + 1}</span>
        <LiveStatus />
      </header>
      <h3 className="branch-name">{b.name}</h3>
      <address className="branch-addr">
        {b.street}
        <br />
        {b.area}
      </address>

      <div className="branch-map">
        {map ? (
          <iframe
            title={`Mapa de la sucursal ${b.name}`}
            src={mapEmbedUrl(b)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <button type="button" className="map-facade" onClick={() => setMap(true)}>
            <Pin size={22} />
            <span>Ver mapa</span>
          </button>
        )}
      </div>

      <div className="branch-actions">
        <a href={directionsUrl(b)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
          Cómo llegar <ArrowUpRight size={16} />
        </a>
        <a href={`tel:${SITE.phoneTel}`} className="btn btn-ghost btn-sm">
          <Phone size={15} /> Llamar
        </a>
        <a href={b.facebook} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={`Facebook de ${b.name}`}>
          <Facebook size={17} />
        </a>
      </div>
    </article>
  );
}

export default function Locations() {
  const status = useOpenStatus();
  return (
    <section id="sucursales" className="section locations" aria-labelledby="loc-title">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow rv">Visítanos</p>
            <h2 id="loc-title" className="h-xl rv">Dos casas en <span className="neon">Tlalnepantla</span></h2>
          </div>
          <p className="lede rv">Mismo menú, misma birria, mismos cantaritos. Escoge la que te quede más cerca.</p>
        </header>

        <div className="loc-grid">
          {BRANCHES.map((b, i) => <BranchCard key={b.id} b={b} i={i} />)}

          <aside className="hours rv" aria-labelledby="hours-title">
            <h3 id="hours-title">Horario</h3>
            <ul>
              {ORDER.map((d) => {
                const s = SCHEDULE[d];
                return (
                  <li key={d} className={`${status?.day === d ? 'is-today' : ''} ${s ? '' : 'is-closed'}`}>
                    <span>{NAMES[d]}</span>
                    <span>{s ? `${formatTime(s.open)} – ${formatTime(s.close)}` : 'Descansamos'}</span>
                  </li>
                );
              })}
            </ul>
            <p className="hours-note">Desayunos de 10:00 a 14:00 h.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

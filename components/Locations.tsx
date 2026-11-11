'use client';

import { useState } from 'react';
import { BRANCHES, SITE, directionsUrl, mapEmbedUrl, placeUrl, writeReviewUrl, type Branch } from '@/lib/site';
import { SCHEDULES, formatSlot } from '@/lib/hours';
import { useOpenStatus } from '@/lib/useOpenStatus';
import LiveStatus from './LiveStatus';
import { ArrowUpRight, Facebook, Phone, Pin, Star } from './icons';

const ORDER = [1, 2, 3, 4, 5, 6, 0];
const NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function BranchCard({ b, i }: { b: Branch; i: number }) {
  const [map, setMap] = useState(false);
  return (
    <article className="branch rv">
      <header className="branch-head">
        <span className="tag">Sucursal 0{i + 1}</span>
        <LiveStatus branch={b.id} />
      </header>
      <h3 className="branch-name">{b.name}</h3>
      <address className="branch-addr">
        {b.street}
        <br />
        {b.area}
      </address>
      <p className="branch-hours">{b.hoursSummary}</p>
      <div className="branch-rating">
        <span className="stars" aria-hidden="true">
          {Array.from({ length: 5 }, (_, k) => <Star key={k} size={13} />)}
        </span>
        <span><strong>{b.rating}</strong> · {b.reviewCount} reseñas en Google</span>
        <a href={placeUrl(b)} target="_blank" rel="noopener noreferrer">Leer</a>
        <a href={writeReviewUrl(b)} target="_blank" rel="noopener noreferrer">Escribir una</a>
      </div>

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
          <p className="lede rv">Mismo menú, misma birria, mismos cantaritos. Centro abre todos los días; Arboledas se queda hasta las 5 de la mañana.</p>
        </header>

        <div className="loc-grid">
          {BRANCHES.map((b, i) => <BranchCard key={b.id} b={b} i={i} />)}

          <aside className="hours rv" aria-labelledby="hours-title">
            <h3 id="hours-title">Horario</h3>
            <table>
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Día</span></th>
                  {BRANCHES.map((b) => <th key={b.id} scope="col">{b.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {ORDER.map((d) => (
                  <tr key={d} className={status?.day === d ? 'is-today' : ''}>
                    <th scope="row">{NAMES[d]}</th>
                    {BRANCHES.map((b) => {
                      const s = SCHEDULES[b.id][d];
                      return (
                        <td key={b.id} className={s ? '' : 'is-closed'}>
                          {s ? formatSlot(s).replace(' – ', '–') : 'Cerrado'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="hours-note">Desayunos de 10:00 a 14:00 h en ambas sucursales.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

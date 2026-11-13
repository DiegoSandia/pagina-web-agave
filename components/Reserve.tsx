'use client';

import { SITE, WEEK } from '@/lib/site';
import { useOpenStatus } from '@/lib/useOpenStatus';
import ReserveForm from './ReserveForm';
import { Instagram, Phone, Spark } from './icons';

export default function Reserve({ asPage = false }: { asPage?: boolean }) {
  const Title = asPage ? 'h1' : 'h2';
  const status = useOpenStatus();

  return (
    <section id="reservar" className="section reserve" aria-labelledby="reserve-title">
      <div className="container reserve-grid">
        <div className="reserve-copy">
          <p className="eyebrow rv">Aparta tu mesa</p>
          <Title id="reserve-title" className="h-xl rv">Tu mesa <span className="neon">te espera</span></Title>
          <p className="lede rv">
            Elige día, hora y cuántos vienen. Toma 20 segundos y te confirmamos por WhatsApp.
          </p>
          <ul className="perks rv">
            <li><Spark size={14} /> Confirmación por WhatsApp</li>
            <li><Spark size={14} /> Cumpleaños, grupos y mesas grandes</li>
            <li><Spark size={14} /> Cantarito chico de cortesía con mesa de 4+</li>
          </ul>
          <div className="week-mini rv">
            <p className="label">Cada día tiene su plan</p>
            <ol>
              {WEEK.map((d) => (
                <li key={d.day} className={status?.day === d.day ? 'is-today' : ''}>
                  <strong>{status?.day === d.day ? 'Hoy' : d.short}</strong>
                  <span>{d.plan}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="direct rv">
            <a href={`tel:${SITE.phoneTel}`}><Phone size={16} /> {SITE.phoneDisplay}</a>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={16} /> {SITE.instagramHandle}</a>
          </div>
        </div>

        <div className="rv">
          <ReserveForm idPrefix="sec" />
        </div>
      </div>
    </section>
  );
}

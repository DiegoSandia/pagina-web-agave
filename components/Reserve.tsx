'use client';

import { useEffect, useMemo, useState } from 'react';
import { BRANCHES, SITE, WEEK, waLink } from '@/lib/site';
import { useOpenStatus } from '@/lib/useOpenStatus';
import { SCHEDULES, mexicoNow, slotsFor } from '@/lib/hours';
import { ArrowRight, Instagram, Phone, Spark, WhatsApp } from './icons';

function todayISO() {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dayOf(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

function prettyDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function Reserve({ asPage = false }: { asPage?: boolean }) {
  const Title = asPage ? 'h1' : 'h2';
  const [branch, setBranch] = useState(BRANCHES[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(4);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const status = useOpenStatus();
  const [minDate, setMinDate] = useState<string>();
  useEffect(() => {
    setMinDate(todayISO());
    const s = new URLSearchParams(window.location.search).get('sucursal');
    const b = BRANCHES.find((x) => x.id === s);
    if (b) setBranch(b.id);
  }, []);

  const current = BRANCHES.find((b) => b.id === branch)!;
  const day = date ? dayOf(date) : null;
  const closed = day !== null && !SCHEDULES[branch][day];
  const slots = useMemo(() => {
    if (day === null || closed) return [];
    const all = slotsFor(branch, day);
    if (date !== todayISO()) return all;
    const { minutes } = mexicoNow();
    const open = SCHEDULES[branch][day]!.open;
    return all.filter((s) => {
      const [h, m] = s.value.split(':').map(Number);
      const mins = h * 60 + m < open ? h * 60 + m + 1440 : h * 60 + m;
      return mins > minutes + 30;
    });
  }, [branch, day, closed, date]);

  const valid = name.trim().length > 1 && date && !closed && time;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const b = BRANCHES.find((x) => x.id === branch)!;
    const slot = slots.find((s) => s.value === time);
    const msg = [
      'Hola, quiero apartar una mesa en El Agave.',
      '',
      `Sucursal: ${b.name}`,
      `Fecha: ${prettyDate(date)}`,
      `Hora: ${slot?.label ?? time}`,
      `Personas: ${people >= 20 ? '20 o más' : people}`,
      `A nombre de: ${name.trim()}`,
      notes.trim() ? `Notas: ${notes.trim()}` : '',
    ]
      .filter((l, i, a) => l !== '' || a[i - 1] !== '')
      .join('\n')
      .trim();
    const url = waLink(msg);
    window.open(url, '_blank', 'noopener');
    setSentUrl(url);
  }

  return (
    <section id="reservar" className="section reserve" aria-labelledby="reserve-title">
      <div className="container reserve-grid">
        <div className="reserve-copy">
          <p className="eyebrow rv">Aparta tu mesa</p>
          <Title id="reserve-title" className="h-xl rv">Tu mesa <span className="neon">te espera</span></Title>
          <p className="lede rv">
            Llena tus datos y se abre WhatsApp con tu reservación lista para enviar. Te confirmamos por el mismo chat.
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

        <form className="res-card rv" onSubmit={submit} noValidate>
          <fieldset className="field">
            <legend className="label">Sucursal</legend>
            <div className="seg">
              {BRANCHES.map((b) => (
                <label key={b.id} className="seg-opt">
                  <input type="radio" name="branch" value={b.id} checked={branch === b.id} onChange={() => { setBranch(b.id); setTime(''); }} />
                  <span>
                    <strong>{b.name}</strong>
                    <small>{b.street}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field-row">
            <label className="field">
              <span className="label">Fecha</span>
              <input
                type="date"
                className="input"
                min={minDate}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime('');
                }}
                required
                aria-invalid={closed || undefined}
                aria-describedby="date-hint"
              />
              <span id="date-hint" className={`hint ${closed ? 'is-error' : ''}`}>
                {closed ? `${current.name} descansa los lunes. Prueba en Centro u otro día.` : current.hoursSummary}
              </span>
            </label>

            <label className="field">
              <span className="label">Hora</span>
              <select className="input" value={time} onChange={(e) => setTime(e.target.value)} disabled={!slots.length} required>
                <option value="">{date && !closed && !slots.length ? 'Sin horarios hoy' : 'Elige hora'}</option>
                {slots.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="field">
            <span className="label" id="people-label">Personas</span>
            <div className="stepper" role="group" aria-labelledby="people-label">
              <button type="button" onClick={() => setPeople((p) => Math.max(1, p - 1))} aria-label="Menos personas">−</button>
              <output aria-live="polite">{people >= 20 ? '20+' : people}</output>
              <button type="button" onClick={() => setPeople((p) => Math.min(20, p + 1))} aria-label="Más personas">+</button>
            </div>
          </div>

          <label className="field">
            <span className="label">A nombre de</span>
            <input className="input" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
          </label>

          <label className="field">
            <span className="label">Notas <em>(opcional)</em></span>
            <input className="input" type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Cumpleaños, silla para bebé, terraza…" maxLength={160} />
          </label>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={!valid}>
            <WhatsApp size={20} /> Enviar por WhatsApp <ArrowRight />
          </button>

          {sentUrl ? (
            <p className="res-sent" role="status">
              Listo. Si WhatsApp no se abrió, <a href={sentUrl} target="_blank" rel="noopener noreferrer">toca aquí</a>.
            </p>
          ) : (
            <p className="res-fine">Tu reservación queda confirmada cuando te respondemos por WhatsApp.</p>
          )}
        </form>
      </div>
    </section>
  );
}

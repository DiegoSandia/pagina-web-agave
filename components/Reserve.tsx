'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { BRANCHES, SITE, WEEK, waLink, type Branch } from '@/lib/site';
import { useOpenStatus } from '@/lib/useOpenStatus';
import { getOrigin } from '@/lib/origin';
import { track } from '@vercel/analytics';
import { SCHEDULES, mexicoNow, slotsFor, type BranchId } from '@/lib/hours';
import { ArrowRight, Instagram, Phone, Spark, WhatsApp } from './icons';

const NAME_KEY = 'agave_nombre';
const PEOPLE = ['1', '2', '3', '4', '5', '6', '8', '10+'];
const GROUPS = [
  { label: 'De día', from: 0, to: 19 * 60 },
  { label: 'De noche', from: 19 * 60, to: 24 * 60 },
  { label: 'Madrugada', from: 24 * 60, to: 30 * 60 },
];

function mxToday() {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromIso = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const shortDate = (d: Date) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).replace('.', '');
const longDate = (s: string) => fromIso(s).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
const weekday = (d: Date) => {
  const w = d.toLocaleDateString('es-MX', { weekday: 'short' }).replace('.', '');
  return w.charAt(0).toUpperCase() + w.slice(1);
};

// Slots for a branch/day as minutes since opening day's midnight (after-midnight > 1440).
function slotsWithMinutes(branch: BranchId, dateIso: string) {
  const day = fromIso(dateIso).getDay();
  const s = SCHEDULES[branch][day];
  if (!s) return [];
  const isToday = dateIso === iso(mxToday());
  const now = mexicoNow().minutes;
  return slotsFor(branch, day)
    .map((slot) => {
      const [h, m] = slot.value.split(':').map(Number);
      const raw = h * 60 + m;
      return { ...slot, mins: raw < s.open ? raw + 1440 : raw };
    })
    .filter((slot) => slot.mins % 60 === 0 && (!isToday || slot.mins > now + 30));
}

function upcomingDays(branch: BranchId, count = 5) {
  const out: { iso: string; label: string; sub: string }[] = [];
  const base = mxToday();
  for (let i = 0; i < 14 && out.length < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const key = iso(d);
    if (!slotsWithMinutes(branch, key).length) continue;
    out.push({ iso: key, label: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : weekday(d), sub: shortDate(d) });
  }
  return out;
}

export default function Reserve({ asPage = false }: { asPage?: boolean }) {
  const Title = asPage ? 'h1' : 'h2';
  const status = useOpenStatus();
  const [ready, setReady] = useState(false);
  const [branch, setBranch] = useState<BranchId>(BRANCHES[0].id);
  const [date, setDate] = useState('');
  const [customDate, setCustomDate] = useState(false);
  const [time, setTime] = useState('');
  const [people, setPeople] = useState('2');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [missing, setMissing] = useState<'time' | 'name' | null>(null);
  const [sent, setSent] = useState<{ url: string; folio: string } | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const timeRef = useRef<HTMLFieldSetElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('sucursal');
    if (BRANCHES.some((b) => b.id === s)) setBranch(s as BranchId);
    try {
      setName(localStorage.getItem(NAME_KEY) ?? '');
    } catch {}
    setReady(true);
  }, []);

  const days = useMemo(() => (ready ? upcomingDays(branch) : []), [branch, ready]);
  const current = BRANCHES.find((b) => b.id === branch) as Branch;

  useEffect(() => {
    if (!ready) return;
    if (!date || (!customDate && !days.some((d) => d.iso === date))) setDate(days[0]?.iso ?? '');
  }, [days, date, customDate, ready]);

  const slots = useMemo(() => (date ? slotsWithMinutes(branch, date) : []), [branch, date]);
  const closedDay = !!date && !SCHEDULES[branch][fromIso(date).getDay()];
  const groups = GROUPS.map((g) => ({ ...g, slots: slots.filter((s) => s.mins >= g.from && s.mins < g.to) })).filter((g) => g.slots.length);

  useEffect(() => {
    if (time && !slots.some((s) => s.value === time)) setTime('');
  }, [slots, time]);

  const slot = slots.find((s) => s.value === time);
  const peopleText = people === '10+' ? '10 o más' : `${people} ${people === '1' ? 'persona' : 'personas'}`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) {
      setMissing('time');
      timeRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    if (!/\p{L}.*\p{L}/u.test(name.trim())) {
      setMissing('name');
      nameRef.current?.focus();
      return;
    }
    setMissing(null);
    try {
      localStorage.setItem(NAME_KEY, name.trim());
    } catch {}

    const folio = `AG-${Math.random().toString(36).slice(2, 7).toUpperCase().padEnd(5, '0')}`;
    fetch('/api/reservar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        folio,
        sucursal: current.name,
        fecha: date,
        hora: slot.label,
        personas: people,
        nombre: name.trim(),
        notas: notes.trim(),
        origen: getOrigin(),
        website: honeypot,
      }),
    }).catch(() => {});
    track('Reserva enviada', { sucursal: current.name, personas: people, origen: getOrigin() });

    const msg = [
      `Hola, quiero apartar una mesa en El Agave ${current.name} 🌵`,
      '',
      `📅 ${longDate(date)}`,
      `🕐 ${slot.label}`,
      `👥 ${peopleText}`,
      `🙋 A nombre de ${name.trim()}`,
      notes.trim() ? `📝 ${notes.trim()}` : '',
      '',
      `Folio: ${folio}`,
    ]
      .filter((l, i, a) => l !== '' || (a[i - 1] !== '' && i !== a.length - 1))
      .join('\n');
    const url = waLink(msg);
    window.open(url, '_blank', 'noopener');
    setSent({ url, folio });
  }

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

        {sent ? (
          <div className="res-card res-done rv" role="status">
            <WhatsApp size={40} className="res-done-icon" />
            <h3>¡Ya casi! Solo falta un toque</h3>
            <ol className="res-steps">
              <li>Se abrió WhatsApp con tu reserva escrita.</li>
              <li><strong>Toca “Enviar”</strong> en WhatsApp.</li>
              <li>Te confirmamos tu mesa por el mismo chat.</li>
            </ol>
            <p className="res-folio">Folio <strong>{sent.folio}</strong> · {current.name} · {longDate(date)} · {slot?.label}</p>
            <a href={sent.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg btn-block">
              <WhatsApp size={20} /> Abrir WhatsApp otra vez
            </a>
            <button type="button" className="btn btn-link" onClick={() => setSent(null)}>Hacer otra reserva</button>
          </div>
        ) : (
          <form className="res-card rv" onSubmit={submit} noValidate>
            <fieldset className="field">
              <legend className="label"><b>1</b> Sucursal</legend>
              <div className="seg">
                {BRANCHES.map((b) => (
                  <label key={b.id} className="seg-opt">
                    <input type="radio" name="branch" value={b.id} checked={branch === b.id} onChange={() => setBranch(b.id)} />
                    <span>
                      <strong>{b.name}</strong>
                      <small>{b.hoursSummary}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="field">
              <legend className="label"><b>2</b> Día</legend>
              <div className="chips">
                {days.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    className="chip chip-date"
                    aria-pressed={!customDate && date === d.iso}
                    onClick={() => {
                      setCustomDate(false);
                      setDate(d.iso);
                    }}
                  >
                    <span>{d.label}</span>
                    <small>{d.sub}</small>
                  </button>
                ))}
                <label className="chip chip-date chip-other" data-active={customDate || undefined}>
                  <span>{customDate && date ? weekday(fromIso(date)) : 'Otro día'}</span>
                  <small>{customDate && date ? shortDate(fromIso(date)) : 'Calendario'}</small>
                  <input
                    type="date"
                    min={ready ? iso(mxToday()) : undefined}
                    value={customDate ? date : ''}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      setCustomDate(true);
                      setDate(e.target.value);
                    }}
                    aria-label="Elegir otra fecha"
                  />
                </label>
              </div>
              {closedDay && (
                <p className="hint is-error">
                  {current.name} descansa ese día.{' '}
                  {branch === 'arboledas' && (
                    <button type="button" className="inline-link" onClick={() => setBranch('centro')}>Reservar en Centro</button>
                  )}
                </p>
              )}
            </fieldset>

            <fieldset className="field" ref={timeRef}>
              <legend className="label"><b>3</b> Hora</legend>
              {groups.length ? (
                <div className="chip-grid time-grid">
                  {groups.map((g) => (
                    <Fragment key={g.label}>
                      <span className="time-group">{g.label}</span>
                      {g.slots.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          className="chip"
                          aria-pressed={time === s.value}
                          onClick={() => {
                            setTime(s.value);
                            if (missing === 'time') setMissing(null);
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </Fragment>
                  ))}
                </div>
              ) : (
                <p className="hint">{date && !closedDay ? 'Ya no hay horarios este día, elige otro.' : 'Elige un día primero.'}</p>
              )}
              {missing === 'time' && <p className="hint is-error">Elige una hora para tu mesa.</p>}
            </fieldset>

            <fieldset className="field">
              <legend className="label"><b>4</b> ¿Cuántos son?</legend>
              <div className="chip-grid">
                {PEOPLE.map((p) => (
                  <button key={p} type="button" className="chip" aria-pressed={people === p} onClick={() => setPeople(p)}>
                    {p}
                  </button>
                ))}
              </div>
              {people === '10+' && <p className="hint">Para grupos grandes coordinamos los detalles por WhatsApp.</p>}
            </fieldset>

            <label className="field">
              <span className="label"><b>5</b> A nombre de <em className="req">obligatorio</em></span>
              <input
                ref={nameRef}
                className="input"
                type="text"
                required
                aria-required="true"
                autoComplete="given-name"
                enterKeyHint="send"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (missing === 'name') setMissing(null);
                }}
                placeholder="Tu nombre"
                aria-invalid={missing === 'name' || undefined}
              />
              {missing === 'name' && <span className="hint is-error">Escribe tu nombre para apartar la mesa.</span>}
            </label>

            {showNotes ? (
              <label className="field">
                <span className="label">Nota <em>(opcional)</em></span>
                <input className="input" type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Cumpleaños, silla para bebé, terraza…" maxLength={160} autoFocus />
              </label>
            ) : (
              <button type="button" className="inline-link res-add-note" onClick={() => setShowNotes(true)}>
                + Agregar una nota (cumpleaños, silla para bebé…)
              </button>
            )}

            <label className="hp" aria-hidden="true">
              Sitio web
              <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </label>

            <p className="res-summary" aria-live="polite">
              {slot
                ? <>Mesa para <strong>{peopleText}</strong> · <strong>{longDate(date)}</strong> · <strong>{slot.label}</strong> · {current.name}</>
                : <>Elige una hora y escribe tu nombre.</>}
            </p>

            <button type="submit" className="btn btn-primary btn-lg btn-block">
              <WhatsApp size={20} /> Apartar por WhatsApp <ArrowRight />
            </button>
            <p className="res-fine">Se abre WhatsApp con todo escrito. Solo dale enviar.</p>
          </form>
        )}
      </div>
    </section>
  );
}

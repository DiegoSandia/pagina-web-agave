'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BRANCHES, waLink, type Branch } from '@/lib/site';
import { getOrigin } from '@/lib/origin';
import { trackEvent as track } from '@/lib/analytics';
import { SCHEDULES, mexicoNow, slotsFor, type BranchId } from '@/lib/hours';
import TimeWheel from './TimeWheel';
import { ArrowRight, WhatsApp } from './icons';

const NAME_KEY = 'agave_nombre';
const PHONE_KEY = 'agave_tel';
const EMAIL_KEY = 'agave_correo';

// Mexican mobile/landline: 10 digits, optionally typed with +52 / 52 / 1 prefixes and spaces.
function phoneDigits(raw: string) {
  let d = raw.replace(/\D/g, '');
  if (d.length === 13 && d.startsWith('521')) d = d.slice(3);
  else if (d.length === 12 && d.startsWith('52')) d = d.slice(2);
  return d;
}
const prettyPhone = (d: string) => `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PEOPLE = ['1', '2', '3', '4', '5', '6', '8', '10+'];
const PREFERRED_MINUTES = 20 * 60;
const OCCASIONS = ['Posada', 'Cumpleaños', 'Reunión de trabajo', 'Otro festejo'] as const;
type Occasion = (typeof OCCASIONS)[number];

export type ReservePreset = { occasion?: Occasion };

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

// Slots as minutes from the opening day's midnight (after-midnight > 1440).
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
    .filter((slot) => !isToday || slot.mins > now + 30);
}

function upcomingDays(branch: BranchId, count = 6) {
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

export default function ReserveForm({ idPrefix = 'res', preset }: { idPrefix?: string; preset?: ReservePreset }) {
  const [ready, setReady] = useState(false);
  const [branch, setBranch] = useState<BranchId>(BRANCHES[0].id);
  const [date, setDate] = useState('');
  const [customDate, setCustomDate] = useState(false);
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(preset?.occasion ? '10+' : '2');
  const [headcount, setHeadcount] = useState('');
  const [occasion, setOccasion] = useState<Occasion | null>(preset?.occasion ?? null);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [sent, setSent] = useState<{ url: string; folio: string; when: string } | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('sucursal');
    if (BRANCHES.some((b) => b.id === s)) setBranch(s as BranchId);
    try {
      setName(localStorage.getItem(NAME_KEY) ?? '');
      setPhone(localStorage.getItem(PHONE_KEY) ?? '');
      setEmail(localStorage.getItem(EMAIL_KEY) ?? '');
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

  useEffect(() => {
    if (!slots.length || slots.some((s) => s.value === time)) return;
    const best = slots.reduce((a, b) => (Math.abs(b.mins - PREFERRED_MINUTES) < Math.abs(a.mins - PREFERRED_MINUTES) ? b : a));
    setTime(best.value);
  }, [slots, time]);

  const onTime = useCallback((v: string) => setTime(v), []);
  const slot = slots.find((s) => s.value === time);
  const bigTable = people === '8' || people === '10+';
  const count = people === '10+' && Number(headcount) >= 10 ? String(Math.min(Number(headcount), 300)) : '';
  const peopleText = people === '10+' ? (count ? `${count} personas aprox.` : '10 o más') : `${people} ${people === '1' ? 'persona' : 'personas'}`;
  const festejo = bigTable ? occasion : null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) return;
    const tel = phoneDigits(phone);
    const mail = email.trim();
    const badName = !/\p{L}.*\p{L}/u.test(name.trim());
    const badPhone = tel.length !== 10;
    const badEmail = !!mail && !EMAIL_RE.test(mail);
    setNameError(badName);
    setPhoneError(badPhone);
    setEmailError(badEmail);
    if (badName || badPhone || badEmail) {
      (badName ? nameRef : badPhone ? phoneRef : emailRef).current?.focus();
      return;
    }
    try {
      localStorage.setItem(NAME_KEY, name.trim());
      localStorage.setItem(PHONE_KEY, prettyPhone(tel));
      if (mail) localStorage.setItem(EMAIL_KEY, mail);
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
        personas: count || people,
        nombre: name.trim(),
        telefono: tel,
        correo: mail,
        notas: [festejo?.toUpperCase(), notes.trim()].filter(Boolean).join(' · '),
        origen: getOrigin(),
        website: honeypot,
      }),
    }).catch(() => {});
    track('Reserva enviada', { sucursal: current.name, personas: count || people, festejo: festejo ?? 'no', origen: getOrigin() });

    const msg = [
      festejo
        ? `Hola, quiero apartar para un grupo en El Agave ${current.name} 🌵`
        : `Hola, quiero apartar una mesa en El Agave ${current.name} 🌵`,
      '',
      ...(festejo ? [`🎉 ${festejo}`] : []),
      `📅 ${longDate(date)}`,
      `🕐 ${slot.label}`,
      `👥 ${peopleText}`,
      `🙋 A nombre de ${name.trim()}`,
      ...(notes.trim() ? [`📝 ${notes.trim()}`] : []),
      '',
      `Folio: ${folio}`,
    ].join('\n');
    const url = waLink(msg);
    window.open(url, '_blank', 'noopener');
    setSent({ url, folio, when: `${current.name} · ${longDate(date)} · ${slot.label}` });
  }

  if (sent) {
    return (
      <div className="res-card res-done" role="status">
        <WhatsApp size={40} className="res-done-icon" />
        <h3>¡Ya casi! Solo falta un toque</h3>
        <ol className="res-steps">
          <li>Se abrió WhatsApp con tu reserva escrita.</li>
          <li><strong>Toca “Enviar”</strong> en WhatsApp.</li>
          <li>Te confirmamos tu mesa por el mismo chat.</li>
        </ol>
        <p className="res-folio">Folio <strong>{sent.folio}</strong> · {sent.when}</p>
        <a href={sent.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg btn-block">
          <WhatsApp size={20} /> Abrir WhatsApp otra vez
        </a>
        <button type="button" className="btn btn-link" onClick={() => setSent(null)}>Hacer otra reserva</button>
      </div>
    );
  }

  return (
    <form className="res-card" onSubmit={submit} noValidate>
      <fieldset className="field">
        <legend className="label"><b>1</b> Sucursal</legend>
        <div className="seg seg-compact">
          {BRANCHES.map((b) => (
            <label key={b.id} className="seg-opt">
              <input type="radio" name={`${idPrefix}-branch`} value={b.id} checked={branch === b.id} onChange={() => setBranch(b.id)} />
              <span><strong>{b.name}</strong></span>
            </label>
          ))}
        </div>
        <p className="hint">{current.hoursSummary}</p>
      </fieldset>

      <fieldset className="field">
        <legend className="label"><b>2</b> Día</legend>
        <div className="chips chips-row" data-lenis-prevent>
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

      <div className="field-row res-row">
        <div className="field">
          <span className="label" id={`${idPrefix}-time`}><b>3</b> Hora</span>
          {slots.length ? (
            <TimeWheel options={slots} value={time} onChange={onTime} label="Hora de llegada" />
          ) : (
            <p className="hint">{closedDay ? 'Elige otro día.' : 'Ya no hay horarios este día.'}</p>
          )}
        </div>

        <div className="field">
          <span className="label"><b>4</b> Personas</span>
          <div className="people-grid">
            {PEOPLE.map((p) => (
              <button key={p} type="button" className="chip" aria-pressed={people === p} onClick={() => setPeople(p)}>
                {p}
              </button>
            ))}
          </div>
          {people === '10+' && (
            <input
              className="input input-sm"
              type="number"
              inputMode="numeric"
              min={10}
              max={300}
              value={headcount}
              onChange={(e) => setHeadcount(e.target.value)}
              placeholder="¿Cuántos más o menos?"
              aria-label="Número aproximado de personas"
            />
          )}
        </div>
      </div>

      {bigTable && (
        <fieldset className="field">
          <legend className="label">¿Qué celebran? <em>(opcional)</em></legend>
          <div className="chips">
            {OCCASIONS.map((o) => (
              <button key={o} type="button" className="chip" aria-pressed={occasion === o} onClick={() => setOccasion(occasion === o ? null : o)}>
                {o}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <label className="field">
        <span className="label"><b>5</b> A nombre de <em className="req">obligatorio</em></span>
        <input
          ref={nameRef}
          className="input"
          type="text"
          required
          aria-required="true"
          autoComplete="given-name"
          enterKeyHint="next"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(false);
          }}
          placeholder="Tu nombre"
          aria-invalid={nameError || undefined}
        />
        {nameError && <span className="hint is-error">Escribe tu nombre para apartar la mesa.</span>}
      </label>

      <div className="field-row res-contact">
        <label className="field">
          <span className="label"><b>6</b> Teléfono <em className="req">obligatorio</em></span>
          <input
            ref={phoneRef}
            className="input"
            type="tel"
            inputMode="tel"
            required
            aria-required="true"
            autoComplete="tel-national"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (phoneError) setPhoneError(false);
            }}
            onBlur={() => {
              const d = phoneDigits(phone);
              if (d.length === 10) setPhone(prettyPhone(d));
            }}
            placeholder="55 1234 5678"
            aria-invalid={phoneError || undefined}
          />
          {phoneError && <span className="hint is-error">Escribe tu número a 10 dígitos.</span>}
        </label>

        <label className="field">
          <span className="label">Correo <em>(opcional)</em></span>
          <input
            ref={emailRef}
            className="input"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(false);
            }}
            placeholder="tu@correo.com"
            aria-invalid={emailError || undefined}
          />
          {emailError && <span className="hint is-error">Revisa tu correo o déjalo vacío.</span>}
        </label>
      </div>
      <p className="hint res-privacy">Solo los usamos para confirmar tu reserva y avisarte si algo cambia.</p>

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

      {slot && (
        <p className="res-summary" aria-live="polite">
          {festejo ? <>{festejo} · </> : 'Mesa para '}<strong>{peopleText}</strong> · <strong>{longDate(date)}</strong> · <strong>{slot.label}</strong> · {current.name}
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={!slot}>
        <WhatsApp size={20} /> Apartar por WhatsApp <ArrowRight />
      </button>
      <p className="res-fine">Se abre WhatsApp con todo escrito. Solo dale enviar.</p>
    </form>
  );
}

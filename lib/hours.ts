// Minutes from midnight; close > 1440 means it closes after midnight.
type Slot = { open: number; close: number } | null;

const DAILY: Slot = { open: 10 * 60, close: 26 * 60 };

export const SCHEDULE: Record<number, Slot> = {
  0: DAILY,
  1: null,
  2: DAILY,
  3: DAILY,
  4: DAILY,
  5: DAILY,
  6: DAILY,
};

const DAY_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

export function formatTime(min: number) {
  const m = min % 1440;
  const h24 = Math.floor(m / 60);
  const mm = m % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}${mm ? `:${String(mm).padStart(2, '0')}` : ''} ${h24 < 12 ? 'AM' : 'PM'}`;
}

export function mexicoNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export type OpenStatus = { open: boolean; soon: boolean; label: string; day: number };

export function getStatus(date = new Date()): OpenStatus {
  const { day, minutes } = mexicoNow(date);
  const yesterday = SCHEDULE[(day + 6) % 7];
  if (yesterday && yesterday.close > 1440 && minutes < yesterday.close - 1440) {
    const left = yesterday.close - 1440 - minutes;
    return { open: true, soon: left <= 60, label: `Abierto · cierra ${formatTime(yesterday.close)}`, day };
  }
  const today = SCHEDULE[day];
  if (today && minutes >= today.open && minutes < today.close) {
    const left = today.close - minutes;
    return { open: true, soon: left <= 60, label: `Abierto · cierra ${formatTime(today.close)}`, day };
  }
  if (today && minutes < today.open) {
    return { open: false, soon: false, label: `Cerrado · abre hoy ${formatTime(today.open)}`, day };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const slot = SCHEDULE[d];
    if (slot) {
      const when = i === 1 ? 'mañana' : DAY_SHORT[d];
      return { open: false, soon: false, label: `Cerrado · abre ${when} ${formatTime(slot.open)}`, day };
    }
  }
  return { open: false, soon: false, label: 'Cerrado', day };
}

// Reservation slots every 30 min, last one 90 min before closing.
export function slotsFor(day: number) {
  const s = SCHEDULE[day];
  if (!s) return [];
  const out: { value: string; label: string }[] = [];
  for (let m = s.open; m <= s.close - 90; m += 30) {
    const mm = m % 1440;
    out.push({
      value: `${String(Math.floor(mm / 60)).padStart(2, '0')}:${String(mm % 60).padStart(2, '0')}`,
      label: formatTime(m),
    });
  }
  return out;
}

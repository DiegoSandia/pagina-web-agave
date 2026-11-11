// Minutes from midnight; close > 1440 means it closes after midnight.
export type Slot = { open: number; close: number } | null;
export type Schedule = Record<number, Slot>;
export type BranchId = 'arboledas' | 'centro';

const every = (slot: Slot, closedDays: number[] = []): Schedule =>
  Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map((d) => [d, closedDays.includes(d) ? null : slot]));

export const SCHEDULES: Record<BranchId, Schedule> = {
  arboledas: every({ open: 10 * 60, close: 29 * 60 }, [1]),
  centro: every({ open: 10 * 60, close: 26 * 60 }),
};

const DAY_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const BRANCH_NAME: Record<BranchId, string> = { arboledas: 'Arboledas', centro: 'Centro' };

export function formatTime(min: number) {
  const m = min % 1440;
  const h24 = Math.floor(m / 60);
  const mm = m % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}${mm ? `:${String(mm).padStart(2, '0')}` : ''} ${h24 < 12 ? 'AM' : 'PM'}`;
}

export function formatSlot(s: Slot) {
  return s ? `${formatTime(s.open)} – ${formatTime(s.close)}` : 'Cerrado';
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

type BranchState = { open: boolean; soon: boolean; closesAt?: number; nextOpen?: { inDays: number; day: number; at: number } };

function branchState(schedule: Schedule, day: number, minutes: number): BranchState {
  const yesterday = schedule[(day + 6) % 7];
  if (yesterday && yesterday.close > 1440 && minutes < yesterday.close - 1440) {
    return { open: true, soon: yesterday.close - 1440 - minutes <= 60, closesAt: yesterday.close };
  }
  const today = schedule[day];
  if (today && minutes >= today.open && minutes < today.close) {
    return { open: true, soon: today.close - minutes <= 60, closesAt: today.close };
  }
  if (today && minutes < today.open) return { open: false, soon: false, nextOpen: { inDays: 0, day, at: today.open } };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const slot = schedule[d];
    if (slot) return { open: false, soon: false, nextOpen: { inDays: i, day: d, at: slot.open } };
  }
  return { open: false, soon: false };
}

function opensLabel(n: NonNullable<BranchState['nextOpen']>) {
  const when = n.inDays === 0 ? 'hoy' : n.inDays === 1 ? 'mañana' : DAY_SHORT[n.day];
  return `abre ${when} ${formatTime(n.at)}`;
}

export type OpenStatus = { open: boolean; soon: boolean; label: string; day: number };

export function getStatus(branch?: BranchId, date = new Date()): OpenStatus {
  const { day, minutes } = mexicoNow(date);

  if (branch) {
    const s = branchState(SCHEDULES[branch], day, minutes);
    if (s.open) return { open: true, soon: s.soon, label: `Abierto · cierra ${formatTime(s.closesAt!)}`, day };
    return { open: false, soon: false, label: s.nextOpen ? `Cerrado · ${opensLabel(s.nextOpen)}` : 'Cerrado', day };
  }

  const ids = Object.keys(SCHEDULES) as BranchId[];
  const states = ids.map((id) => ({ id, ...branchState(SCHEDULES[id], day, minutes) }));
  const open = states.filter((s) => s.open);
  if (open.length === ids.length) {
    return { open: true, soon: open.every((s) => s.soon), label: 'Abierto en las 2 sucursales', day };
  }
  if (open.length) {
    const s = open[0];
    return { open: true, soon: s.soon, label: `Abierto en ${BRANCH_NAME[s.id]} · cierra ${formatTime(s.closesAt!)}`, day };
  }
  const next = states
    .filter((s) => s.nextOpen)
    .sort((a, b) => a.nextOpen!.inDays * 1440 + a.nextOpen!.at - (b.nextOpen!.inDays * 1440 + b.nextOpen!.at))[0];
  return { open: false, soon: false, label: next ? `Cerrado · ${opensLabel(next.nextOpen!)}` : 'Cerrado', day };
}

// Reservation slots every 30 min, last one 90 min before closing.
export function slotsFor(branch: BranchId, day: number) {
  const s = SCHEDULES[branch][day];
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

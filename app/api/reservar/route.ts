import { NextResponse } from 'next/server';

type Payload = {
  folio?: unknown;
  sucursal?: unknown;
  fecha?: unknown;
  hora?: unknown;
  personas?: unknown;
  nombre?: unknown;
  notas?: unknown;
  origen?: unknown;
  website?: unknown;
};

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
// Sheets treats cells starting with these characters as formulas.
const cell = (v: string) => (/^[=+\-@]/.test(v) ? `'${v}` : v);

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (str(body.website, 100)) return NextResponse.json({ ok: true });

  const row = {
    folio: str(body.folio, 12),
    sucursal: str(body.sucursal, 20),
    fecha: str(body.fecha, 10),
    hora: str(body.hora, 10),
    personas: str(body.personas, 6),
    nombre: str(body.nombre, 80),
    notas: str(body.notas, 160),
    origen: str(body.origen, 40) || 'directo',
  };

  const valid =
    /^AG-[A-Z0-9]{4,8}$/.test(row.folio) &&
    ['Arboledas', 'Centro'].includes(row.sucursal) &&
    /^\d{4}-\d{2}-\d{2}$/.test(row.fecha) &&
    /^\d{1,2}(:\d{2})? (AM|PM)$/.test(row.hora) &&
    row.nombre.length > 1;
  if (!valid) return NextResponse.json({ ok: false }, { status: 422 });

  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_SECRET;
  if (!url || !secret) return NextResponse.json({ ok: true, saved: false });

  const safe = Object.fromEntries(Object.entries(row).map(([k, v]) => [k, cell(v)]));
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...safe, secret }),
      signal: AbortSignal.timeout(8000),
    });
    return NextResponse.json({ ok: res.ok, saved: res.ok });
  } catch {
    return NextResponse.json({ ok: false, saved: false }, { status: 502 });
  }
}

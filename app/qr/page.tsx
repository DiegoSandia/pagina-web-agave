import type { Metadata } from 'next';
import Image from 'next/image';
import QRCode from 'qrcode';
import mark from '@/assets/brand/agave-mark-alpha.png';
import PrintButton from './PrintButton';

export const metadata: Metadata = {
  title: 'QR para mesas',
  robots: { index: false, follow: false },
};

const CARDS = [
  { path: '/menu', eyebrow: 'Escanea y pide', title: 'El menú', note: 'Birria, tacos, cantaritos y barra con precios' },
  { path: '/reservar', eyebrow: 'Para la próxima', title: 'Aparta tu mesa', note: 'Elige sucursal, día y hora por WhatsApp' },
  { path: '/resena-arboledas', eyebrow: '¿Te gustó?', title: 'Califícanos', note: 'Tu reseña de Arboledas en Google nos ayuda muchísimo' },
  { path: '/resena-centro', eyebrow: '¿Te gustó?', title: 'Califícanos', note: 'Tu reseña de Centro en Google nos ayuda muchísimo' },
];

export default async function QrPage() {
  const cards = await Promise.all(
    CARDS.map(async (c) => ({
      ...c,
      svg: await QRCode.toString(`https://el-agave-arandas.com${c.path}${c.path.startsWith('/resena') ? '' : '?ref=qr'}`, {
        type: 'svg',
        margin: 1,
        errorCorrectionLevel: 'M',
        color: { dark: '#0a0706', light: '#ffffff' },
      }),
    })),
  );

  return (
    <main className="qr-page">
      <header className="qr-head">
        <h1>QR para mesas</h1>
        <p>Imprime en hoja carta a color y corta por las líneas punteadas. Cada código lleva a la página correspondiente.</p>
        <PrintButton />
      </header>
      <div className="qr-sheet">
        {cards.map((c) => (
          <article key={c.path} className="qr-card">
            <Image src={mark} alt="" width={64} height={56} className="qr-mark" />
            <p className="qr-eyebrow">{c.eyebrow}</p>
            <h2 className="qr-title">{c.title}</h2>
            <div className="qr-code" dangerouslySetInnerHTML={{ __html: c.svg }} />
            <p className="qr-note">{c.note}</p>
            <p className="qr-url">el-agave-arandas.com{c.path}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

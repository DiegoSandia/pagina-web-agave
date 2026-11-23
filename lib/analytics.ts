import { track as vercelTrack } from '@vercel/analytics';

/**
 * One place for every conversion event. It goes to Vercel Analytics and, when
 * their IDs are configured, to the Meta Pixel and Google tag so the audience
 * can be retargeted with ads.
 */

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

// Meta standard events (and Google recommended events) for each site event.
const MAP: Record<string, { meta?: string; google?: string }> = {
  'Ver menú': { meta: 'ViewContent', google: 'view_item_list' },
  'Ir a reservar': { meta: 'InitiateCheckout', google: 'begin_checkout' },
  'Abrir reserva': { meta: 'InitiateCheckout', google: 'begin_checkout' },
  'Reserva enviada': { meta: 'Schedule', google: 'generate_lead' },
  WhatsApp: { meta: 'Contact', google: 'contact' },
  Llamar: { meta: 'Contact', google: 'contact' },
  'Cómo llegar': { meta: 'FindLocation', google: 'find_location' },
};

const clean = (p: Props = {}) =>
  Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined && v !== null && v !== ''));

export function trackEvent(name: string, props: Props = {}) {
  const data = clean(props);
  try {
    vercelTrack(name, data as Record<string, string | number | boolean>);
  } catch {}

  const m = MAP[name];
  try {
    if (window.fbq) {
      if (m?.meta) window.fbq('track', m.meta, { content_name: name, ...data });
      else window.fbq('trackCustom', name.replace(/\s+/g, ''), data);
    }
  } catch {}
  try {
    window.gtag?.('event', m?.google ?? name.toLowerCase().replace(/\s+/g, '_'), { event_label: name, ...data });
  } catch {}
}

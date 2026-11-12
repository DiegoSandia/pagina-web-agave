const KEY = 'agave_origen';

function classify(host: string) {
  if (/google\./.test(host)) return 'google';
  if (/instagram\./.test(host)) return 'instagram';
  if (/facebook\.|fb\.me/.test(host)) return 'facebook';
  if (/tiktok\./.test(host)) return 'tiktok';
  if (/whatsapp\.|wa\.me/.test(host)) return 'whatsapp';
  return host.replace(/^www\./, '');
}

// An explicit ?ref= / ?utm_source= always wins; otherwise keep the first origin of the visit.
export function captureOrigin() {
  try {
    const params = new URLSearchParams(window.location.search);
    let origin = params.get('ref') || params.get('utm_source');
    if (!origin && sessionStorage.getItem(KEY)) return;
    if (!origin && document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host === window.location.hostname) return;
      origin = classify(host);
    }
    sessionStorage.setItem(KEY, (origin || 'directo').toLowerCase().slice(0, 40));
  } catch {}
}

export function getOrigin() {
  try {
    return sessionStorage.getItem(KEY) || 'directo';
  } catch {
    return 'directo';
  }
}

/**
 * Aviso de privacidad (LFPDPPP, DOF 20-03-2025, arts. 15 y 16).
 *
 * The legal identity and address of the data controller come from the owner.
 * Until both are filled in, nothing about the notice or the promo opt-in is
 * shown on the site: an incomplete notice must not be published.
 */
export const PRIVACY = {
  /** Nombre completo (persona física) o razón social del responsable. */
  responsible: '',
  /** Domicilio completo del responsable. */
  address: '',
  updated: '24 de noviembre de 2026',
};

export const PRIVACY_READY = Boolean(PRIVACY.responsible && PRIVACY.address);

export const PRIVACY_HASH = 'aviso-de-privacidad';
export const OPEN_PRIVACY = 'agave:open-privacy';

export function openPrivacy() {
  window.dispatchEvent(new Event(OPEN_PRIVACY));
}

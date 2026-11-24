'use client';

import { useEffect, useRef } from 'react';
import { lockScroll } from '@/lib/lenis';
import { OPEN_PRIVACY, PRIVACY, PRIVACY_HASH, PRIVACY_READY, openPrivacy } from '@/lib/privacy';
import { SITE } from '@/lib/site';
import { Close } from './icons';

export function PrivacyLink({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <a
      href={`#${PRIVACY_HASH}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        openPrivacy();
      }}
    >
      {children}
    </a>
  );
}

export default function PrivacyDialog() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!PRIVACY_READY) return;
    const open = () => {
      if (ref.current && !ref.current.open) {
        ref.current.showModal();
        lockScroll(true);
      }
    };
    const fromHash = () => {
      if (window.location.hash === `#${PRIVACY_HASH}`) open();
    };
    fromHash();
    window.addEventListener(OPEN_PRIVACY, open);
    window.addEventListener('hashchange', fromHash);
    return () => {
      window.removeEventListener(OPEN_PRIVACY, open);
      window.removeEventListener('hashchange', fromHash);
    };
  }, []);

  if (!PRIVACY_READY) return null;

  const close = () => {
    ref.current?.close();
    // It may have been opened from inside the reservation dialog.
    if (!document.querySelector('dialog[open]')) lockScroll(false);
    if (window.location.hash === `#${PRIVACY_HASH}`) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const mail = <a href={`mailto:${SITE.email}?subject=Datos%20personales`}>{SITE.email}</a>;

  return (
    <dialog
      ref={ref}
      className="res-modal privacy-modal"
      aria-labelledby="privacy-title"
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="res-modal-inner">
        <header className="res-modal-head">
          <h2 id="privacy-title">Aviso de privacidad</h2>
          <button type="button" className="lb-btn res-modal-close" onClick={close} aria-label="Cerrar">
            <Close size={20} />
          </button>
        </header>

        <div className="privacy-text">
          <h3>1. Quién es responsable de tus datos</h3>
          <p>
            <strong>{PRIVACY.responsible}</strong> (“El Agave”), con domicilio en {PRIVACY.address}, es responsable del
            tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión
            de los Particulares.
          </p>

          <h3>2. Qué datos tratamos</h3>
          <p>
            Los que escribes al reservar: nombre, teléfono, correo (si lo das), sucursal, fecha, hora, número de personas,
            motivo del festejo y nota (si los indicas). También registramos desde qué sitio o enlace llegaste.
          </p>
          <p>
            <strong>No pedimos datos personales sensibles.</strong> Por favor no los escribas en la nota.
          </p>

          <h3>3. Para qué los usamos</h3>
          <p>
            <strong>Finalidades necesarias para tu reserva</strong> (no requieren tu consentimiento): registrarla,
            confirmarla, avisarte de cambios, atenderte y darle seguimiento.
          </p>
          <p>
            <strong>Finalidad que requiere tu consentimiento:</strong> enviarte promociones y novedades por WhatsApp o
            correo. Solo lo hacemos si marcas la casilla correspondiente; si no la marcas, tu reserva se atiende igual.
          </p>

          <h3>4. Quién más interviene</h3>
          <p>
            Usamos proveedores que tratan los datos por nuestra cuenta: Google (hoja de reservas y correo) y Vercel
            (alojamiento y estadísticas de la página). No transferimos tus datos personales a terceros, salvo los casos
            que la ley permite sin tu consentimiento.
          </p>
          <p>
            Al terminar tu reserva se abre WhatsApp con un mensaje escrito. Tú decides si lo envías; WhatsApp trata esa
            información conforme a sus propias políticas.
          </p>

          <h3>5. Cómo limitar su uso o retirar tu consentimiento</h3>
          <p>
            Escribe a {mail} o al {SITE.phoneDisplay} y pide no recibir promociones, limitar el uso de tus datos o revocar
            tu consentimiento. La revocación no tiene efectos retroactivos.
          </p>

          <h3>6. Derechos ARCO</h3>
          <p>
            Puedes pedir el acceso, la rectificación o la cancelación de tus datos, u oponerte a su uso, escribiendo a{' '}
            {mail}. Incluye:
          </p>
          <ul>
            <li>Tu nombre y un domicilio u otro medio para responderte.</li>
            <li>Un documento que acredite tu identidad o, en su caso, la de tu representante.</li>
            <li>Los datos de que se trata (salvo en solicitudes de acceso) y el derecho que quieres ejercer.</li>
            <li>Si es una rectificación, los cambios y el documento que los sustente.</li>
            <li>Lo que ayude a localizarlos; por ejemplo, el folio de tu reserva.</li>
          </ul>
          <p>
            Te respondemos en un máximo de 20 días hábiles y, si procede, lo hacemos efectivo dentro de los 15 días hábiles
            siguientes a la respuesta. Ambos plazos pueden ampliarse una sola vez, por un periodo igual, si el caso lo
            justifica. Los datos de acceso se entregan por correo electrónico, previa acreditación de identidad. El trámite
            es gratuito, salvo costos de reproducción, copias o envío.
          </p>
          <p>
            Si no estás de acuerdo con la respuesta, puedes acudir a la Secretaría Anticorrupción y Buen Gobierno dentro de
            los 15 días hábiles siguientes a que se te comunique.
          </p>

          <h3>7. Cuánto tiempo los conservamos</h3>
          <p>
            El necesario para las finalidades de este aviso y los plazos que exija la ley. Después se bloquean, cuando
            corresponda, y se suprimen.
          </p>

          <h3>8. Datos en tu dispositivo</h3>
          <p>
            Para que no los escribas otra vez, tu navegador guarda en tu propio dispositivo el nombre, teléfono y correo de
            tu última reserva. Puedes borrarlos eliminando los datos de este sitio en tu navegador.
          </p>

          <h3>9. Cambios a este aviso</h3>
          <p>
            Publicaremos cualquier cambio en esta misma ventana, en {SITE.url.replace('https://', '')}/#{PRIVACY_HASH}, con
            su fecha de actualización. Si queremos usar tus datos para algo distinto, te pediremos de nuevo tu
            consentimiento.
          </p>

          <p className="privacy-date">Última actualización: {PRIVACY.updated}</p>
        </div>
      </div>
    </dialog>
  );
}

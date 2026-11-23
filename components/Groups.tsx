'use client';

import Image from 'next/image';
import { trackEvent as track } from '@/lib/analytics';
import mesaLlena from '@/assets/photos/v2/mesa-llena.jpg';
import { waLink } from '@/lib/site';
import { getOrigin } from '@/lib/origin';
import { openReserve } from './ReserveModal';
import { ArrowRight, Spark, WhatsApp } from './icons';

const PERKS = [
  { title: 'Cazuelas para compartir', copy: 'De 5 litros ($990) y de 10 litros ($1,799) para que nadie se quede con el vaso vacío.' },
  { title: 'Cubetas y 2×1 en copeo', copy: 'Cubetas desde $270 y 2×1 en copeo todos los días.' },
  { title: 'Cortesía en mesas de 4+', copy: 'Cantarito chico de cortesía al llegar.' },
  { title: 'Viernes y sábado, karaoke', copy: 'Para que la posada termine como debe: cantando.' },
];

export default function Groups() {
  const open = () => {
    track('Abrir reserva', { desde: 'grupos', origen: getOrigin() });
    openReserve({ occasion: 'Posada' });
  };

  return (
    <section id="grupos" className="section groups" aria-labelledby="groups-title">
      <div className="container groups-grid">
        <div className="groups-photo rv-img">
          <Image src={mesaLlena} alt="Grupo de amigos brindando con una cazuela de cantarito bajo el neón de El Agave" placeholder="blur" sizes="(max-width: 900px) 100vw, 46vw" />
          <span className="groups-badge">Diciembre se aparta rápido</span>
        </div>

        <div className="groups-copy">
          <p className="eyebrow rv">Posadas · cumpleaños · equipos</p>
          <h2 id="groups-title" className="h-xl rv">
            Trae a <span className="neon">todo el grupo</span>
          </h2>
          <p className="lede rv">
            La posada de la oficina, el cumpleaños o la reunión de fin de año. Dinos cuántos son y qué día, y te confirmamos por WhatsApp.
          </p>

          <ul className="groups-perks rv">
            {PERKS.map((p) => (
              <li key={p.title}>
                <Spark size={14} />
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.copy}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="groups-cta rv">
            <button type="button" className="btn btn-primary btn-lg" onClick={open}>
              Apartar para mi grupo <ArrowRight />
            </button>
            <a
              className="btn btn-ghost btn-lg"
              href={waLink('Hola, quiero preguntar por una posada o reunión para un grupo.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp size={18} /> Preguntar primero
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

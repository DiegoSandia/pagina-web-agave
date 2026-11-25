'use client';

import Image from 'next/image';
import { trackEvent as track } from '@/lib/analytics';
import cazuelaGrupo from '@/assets/photos/v2/barra-cantaritos.jpg';
import { waLink } from '@/lib/site';
import { getOrigin } from '@/lib/origin';
import { openReserve } from './ReserveModal';
import { ArrowRight, Spark, WhatsApp } from './icons';

const PERKS = [
  { title: 'Paquetes para tu grupo', copy: 'Desayuno, comida o cena, según cuántos sean. Te cotizamos por WhatsApp.' },
  { title: 'Cazuelas para compartir', copy: 'De 5 litros ($990) y de 10 litros ($1,799) para que nadie se quede con el vaso vacío.' },
  { title: 'Cubetas, 2×1 y cortesía', copy: 'Cubetas desde $270, 2×1 en copeo todos los días y cantarito chico de cortesía en mesas de 4+.' },
  { title: 'Karaoke', copy: 'Miércoles en Arboledas. Viernes y sábado en Centro.' },
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
          <Image src={cazuelaGrupo} alt="Cazuela rodeada de cantaritos de barro servidos en la barra de El Agave" placeholder="blur" sizes="(max-width: 900px) 100vw, 46vw" />
          <span className="groups-badge">Diciembre se aparta rápido</span>
        </div>

        <div className="groups-copy">
          <p className="eyebrow rv">Posadas · cumpleaños · equipos</p>
          <h2 id="groups-title" className="h-xl rv">
            Trae a <span className="neon">todo el grupo</span>
          </h2>
          <p className="lede rv">
            La posada de la oficina, el cumpleaños o la reunión de fin de año. Elige paquete de desayuno, comida o cena: dinos cuántos son y qué día, y te cotizamos por WhatsApp.
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
              href={waLink('Hola, quiero cotizar un paquete para grupo. Somos ___ personas, para (desayuno / comida / cena), el día ___, en la sucursal ___.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp size={18} /> Cotizar paquete
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

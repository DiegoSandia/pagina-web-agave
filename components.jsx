/* global React */
const { useState, useEffect, useRef } = React;

// ============================================================
// Hook: reveal on scroll
// ============================================================
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-letters, .blur-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          if (e.target.classList.contains('reveal-letters')) {
            const letters = e.target.querySelectorAll('.letter');
            letters.forEach((l, i) => {
              l.style.transitionDelay = `${i * 35}ms`;
            });
          }
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Wrap text into per-letter spans
function LetterReveal({ text, className = '', tag: Tag = 'span', delay = 0 }) {
  const chars = text.split('');
  return (
    <Tag className={`reveal-letters ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {chars.map((c, i) => (
        <span key={i} className="letter" style={{ transitionDelay: `${i * 35 + delay}ms` }}>
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </Tag>
  );
}

// ============================================================
// Magnetic button — moves slightly toward cursor
// ============================================================
function MagneticBtn({ children, className = '', href = '#', onClick, primary = false, ...rest }) {
  const ref = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  function onMove(e) {
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.35;
    setT({ x: dx, y: dy });
  }
  function onLeave() { setT({ x: 0, y: 0 }); }

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`btn ${primary ? 'btn-primary' : 'btn-ghost'} ${className}`}
      style={{ transform: `translate(${t.x}px, ${t.y}px)` }}
      {...rest}
    >
      {children}
    </a>
  );
}

// ============================================================
// Smoke layer — randomly positioned drifting glows
// ============================================================
function SmokeLayer() {
  const particles = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    left: `${(i * 11 + 5) % 100}%`,
    delay: `${i * 2.2}s`,
    duration: `${18 + (i % 4) * 3}s`,
    scale: 0.6 + (i % 3) * 0.3,
  }));
  return (
    <div className="smoke-layer" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="smoke-particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `scale(${p.scale})`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// Nav
// ============================================================
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function close() { setOpen(false); }

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <a href="#hero" className="nav-brand" onClick={close}>
          <img src="assets/logo.png" alt="El Agave" className="nav-brand-mark" />
          <span className="nav-brand-text">EL AGAVE</span>
        </a>
        <div className="nav-links">
          <a href="#nosotros" className="nav-link">Nosotros</a>
          <a href="#menu" className="nav-link">Menú</a>
          <a href="#galeria" className="nav-link">Galería</a>
          <a href="#contacto" className="nav-link">Contacto</a>
          <a href="#contacto" className="nav-cta">Reservar</a>
        </div>
        <button
          type="button"
          className={`nav-burger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div
        className={`nav-drawer ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <div className="nav-drawer-inner">
          <a href="#nosotros" className="nav-drawer-link" onClick={close}>Nosotros</a>
          <a href="#menu" className="nav-drawer-link" onClick={close}>Menú</a>
          <a href="#galeria" className="nav-drawer-link" onClick={close}>Galería</a>
          <a href="#visita" className="nav-drawer-link" onClick={close}>Visítanos</a>
          <a href="#contacto" className="nav-drawer-link" onClick={close}>Contacto</a>
          <a href="#contacto" className="nav-drawer-cta" onClick={close}>Reservar mesa →</a>
          <div className="nav-drawer-foot">
            <a href="tel:5510699414">55 1069 9414</a>
            <span>·</span>
            <a href="https://instagram.com/el_agave_arandas" target="_blank" rel="noopener">@el_agave_arandas</a>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// FadingVideo — rAF-driven crossfade looping
// ============================================================
function FadingVideo({ src, className = '', style = {} }) {
  const vidRef = useRef(null);
  const rafRef = useRef(null);
  const fadingOutRef = useRef(false);

  const FADE_MS = 500;
  const FADE_OUT_LEAD = 0.55;

  function fadeTo(target, duration = FADE_MS) {
    const v = vidRef.current;
    if (!v) return;
    cancelAnimationFrame(rafRef.current);
    const start = parseFloat(v.style.opacity) || 0;
    const t0 = performance.now();
    function step(t) {
      const k = Math.min(1, (t - t0) / duration);
      v.style.opacity = String(start + (target - start) * k);
      if (k < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    v.style.opacity = '0';

    function onLoaded() {
      v.style.opacity = '0';
      v.play().catch(() => {});
      fadeTo(1);
    }
    function onTime() {
      if (fadingOutRef.current) return;
      const left = v.duration - v.currentTime;
      if (left > 0 && left <= FADE_OUT_LEAD) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    }
    function onEnded() {
      v.style.opacity = '0';
      setTimeout(() => {
        v.currentTime = 0;
        v.play().catch(() => {});
        fadingOutRef.current = false;
        fadeTo(1);
      }, 100);
    }

    v.addEventListener('loadeddata', onLoaded);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', onEnded);

    return () => {
      cancelAnimationFrame(rafRef.current);
      v.removeEventListener('loadeddata', onLoaded);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <video
      ref={vidRef}
      src={src}
      className={className}
      style={style}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}

// ============================================================
// BlurText — word-by-word blur in on intersection
// ============================================================
function BlurText({ text, className = '', stagger = 90, baseDelay = 200 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const words = text.split(' ');
  return (
    <h1 ref={ref} className={`hero-title ${className}`}>
      {words.map((w, i) => (
        <span
          key={i}
          className={`word ${visible ? 'in' : ''}`}
          style={{ transitionDelay: visible ? `${baseDelay + i * stagger}ms` : '0ms' }}
        >
          {w}
        </span>
      ))}
    </h1>
  );
}

// ============================================================
// Hero
// ============================================================
function Hero() {
  return (
    <section id="hero" className="hero" data-screen-label="Hero">
      <FadingVideo src="assets/hero.mp4" className="hero-bg-video" />
      <div className="hero-bg-tint" />

      <div className="hero-content">
        <div className="hero-inner">
          <div className="hero-badge liquid-glass blur-reveal d-1">
            <span className="hero-badge-pill">NUEVO</span>
            <span>Birria estilo Jalisco · 2 sucursales en Tlalnepantla</span>
          </div>

          <BlurText text="SABOR DE CASA ENERGÍA DE NOCHE" />

          <div className="hero-sub blur-reveal d-4">EL AGAVE · BIRRIA & CANTARITOS</div>

          <p className="hero-tagline blur-reveal d-5">
            Birria estilo Jalisco y cantaritos que prenden la noche.
            Recetas de casa, neón en la pared y la mesa siempre llena.
          </p>

          <div className="hero-ctas blur-reveal d-6">
            <a href="#menu" className="hero-cta-primary liquid-glass-strong">
              Ver el menú
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
            <a href="#contacto" className="hero-cta-secondary">
              Reservar mesa
              <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
            </a>
          </div>

          <div className="hero-stats blur-reveal d-7">
            <div className="hero-stat-card liquid-glass">
              <svg className="hero-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div className="hero-stat-num">Miérc — Dom</div>
              <div className="hero-stat-label">Abierto 5 días, lunes y martes descansamos</div>
            </div>
            <div className="hero-stat-card liquid-glass">
              <svg className="hero-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="hero-stat-num">2 Sucursales</div>
              <div className="hero-stat-label">Arboledas · Centro · Tlalnepantla</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// About
// ============================================================
function About() {
  return (
    <section id="nosotros" className="section" data-screen-label="Nosotros">
      <div className="section-inner about">
        <div>
          <div className="section-eyebrow reveal">Nuestra historia</div>
          <h2 className="section-title bebas reveal delay-1">
            SABOR DE <span className="accent">CASA</span>,<br/>
            ENERGÍA DE <span className="accent">NOCHE</span>
          </h2>
          <div className="about-copy">
            <p className="reveal delay-2">
              Somos una cantina con dos sucursales en Tlalnepantla. Servimos birria
              estilo Jalisco a fuego lento y cantaritos llenos hasta el borde —
              lo que nos enseñaron en casa, en plato y en barro.
            </p>
            <p className="about-pull reveal delay-3">
              "Birria estilo Jalisco, cantarito bien servido y la mesa siempre llena."
            </p>
            <p className="reveal delay-4">
              Ingredientes frescos, recetas de familia, neón en la pared. Vení por la
              birria, quedate por la noche.
            </p>
          </div>

          <div className="about-stats reveal delay-5">
            <div className="stat">
              <div className="stat-num">2</div>
              <div className="stat-label">Sucursales</div>
            </div>
            <div className="stat">
              <div className="stat-num">12+</div>
              <div className="stat-label">Cantaritos en carta</div>
            </div>
            <div className="stat">
              <div className="stat-num">100%</div>
              <div className="stat-label">Estilo Jalisco</div>
            </div>
          </div>
        </div>

        <div className="about-image reveal delay-2">
          <img src="assets/photos/birria-pour.jpg" alt="Birria caliente con salsa" />
          <div className="about-image-tag">★ Birria Jaliciense</div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Menu
// ============================================================
const MENU_DATA = {
  birria: [
    { name: 'Birria estilo Jalisco', desc: 'Servida con consomé, cebolla, cilantro y limón. Receta de casa.', price: '$220', tag: 'La firma', img: 'assets/photos/birria-ramen.jpg' },
    { name: 'Tostadas de Birria', desc: 'Tres tostadas con birria deshebrada, pico de gallo y guacamole.', price: '$180', tag: 'Clásico', img: 'assets/photos/birria-tostadas.jpg' },
    { name: 'Ramen de Birria', desc: 'Fideo japonés bañado en consomé de birria. Fusión que prende.', price: '$210', tag: 'Nuevo', img: 'assets/photos/birria-noodles.jpg' },
  ],
  cantaritos: [
    { name: 'Cantarito Clásico', desc: 'Tequila blanco, jugo de toronja, naranja, limón y sal de gusano.', price: '$160', tag: 'House', img: 'assets/photos/cantarito-clasico.jpg' },
    { name: 'Cantarito Squirt', desc: 'Tequila reposado con Squirt frío y chamoy en el borde.', price: '$170', tag: 'Top venta', img: 'assets/photos/cantarito-squirt.jpg' },
    { name: 'Agua de Jamaica Fuerte', desc: 'Agua fresca de jamaica con un toque de mezcal y chile.', price: '$140', tag: 'Refrescante', img: 'assets/photos/agua-jamaica.jpg' },
  ],
  desayunos: [
    { name: 'Chilaquiles Verdes', desc: 'Salsa verde de la casa, huevo estrellado y aguacate fresco.', price: '$165', tag: 'Mañanero', img: 'assets/photos/chilaquiles-verdes-huevo.jpg' },
    { name: 'Chilaquiles Rojos', desc: 'Bañados en salsa de la casa con chorizo, crema y queso fresco.', price: '$165', tag: 'Picante', img: 'assets/photos/chilaquiles-rojos.jpg' },
    { name: 'Huevos Mexicanos', desc: 'Huevo revuelto con tomate, cebolla y chile, frijoles y bolillo.', price: '$130', tag: 'Casa', img: 'assets/photos/huevos-mexicanos.jpg' },
  ],
  antojos: [
    { name: 'Enchiladas Rojas', desc: 'Tres enchiladas en salsa roja, bañadas a la mesa, con queso.', price: '$155', tag: 'Tradicional', img: 'assets/photos/enchiladas-salsa.jpg' },
    { name: 'Enchiladas Verdes', desc: 'En salsa verde de tomate y chile, con pollo deshebrado.', price: '$155', tag: 'Clásico', img: 'assets/photos/enchiladas-verdes.jpg' },
    { name: 'Frijoles Charros', desc: 'Frijoles con chile, cebolla y tortilla, para mojar y disfrutar.', price: '$95', tag: 'Para compartir', img: 'assets/photos/frijoles.jpg' },
  ],
};

function Menu() {
  const [tab, setTab] = useState('birria');
  const items = MENU_DATA[tab];

  return (
    <section id="menu" className="section" data-screen-label="Menu">
      <div className="section-inner">
        <div className="menu-head">
          <div>
            <div className="section-eyebrow reveal">La carta</div>
            <h2 className="section-title reveal delay-1">EL MENÚ</h2>
          </div>
          <p className="section-lede reveal delay-2">
            Birria desde las seis de la mañana, cantaritos hasta que se acabe la noche.
            Todo cocinado lento, servido caliente y acompañado de buen tequila.
          </p>
        </div>

        <div className="menu-tabs reveal delay-2">
          {[
            ['birria', 'Birria'],
            ['cantaritos', 'Cantaritos'],
            ['desayunos', 'Desayunos'],
            ['antojos', 'Antojos'],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`menu-tab ${tab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="menu-grid" key={tab}>
          {items.map((item, i) => (
            <article
              key={`${tab}-${item.name}`}
              className="menu-card"
              style={{ animationDelay: `${i * 110}ms` }}
            >
              <div className="menu-card-img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="menu-card-overlay" />
              <div className="menu-card-glow" />
              <div className="menu-card-content">
                <span className="menu-card-tag">★ {item.tag}</span>
                <h3 className="menu-card-name">{item.name}</h3>
                <p className="menu-card-desc">{item.desc}</p>
                <div className="menu-card-price-row">
                  <span className="menu-card-price">{item.price}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Gallery
// ============================================================
const GALLERY_ITEMS = [
  { src: 'assets/photos/cantarito-pour.jpg', label: 'Cantaritos', cls: 'tall' },
  { src: 'assets/photos/desayuno-spread.jpg', label: 'Almuerzos', cls: '' },
  { src: 'assets/photos/agua-fresca-splash.jpg', label: 'Aguas frescas', cls: '' },
  { src: 'assets/photos/enchiladas-salsa.jpg', label: 'Enchiladas', cls: 'wide' },
  { src: 'assets/photos/birria-noodles.jpg', label: 'Birria ramen', cls: '' },
  { src: 'assets/photos/cantarito-hero.jpg', label: 'En la cantina', cls: 'tall' },
  { src: 'assets/photos/chilaquiles-verdes-aguacate.jpg', label: 'Chilaquiles', cls: '' },
  { src: 'assets/photos/birria-pour.jpg', label: 'Recién hecha', cls: '' },
];

function Gallery() {
  return (
    <section id="galeria" className="section" data-screen-label="Galeria">
      <div className="section-inner">
        <div className="menu-head">
          <div>
            <div className="section-eyebrow reveal">Visualízalo</div>
            <h2 className="section-title bebas reveal delay-1">
              EL <span className="accent">AMBIENTE</span>
            </h2>
          </div>
          <p className="section-lede reveal delay-2">
            Madera, neón, vapor y buen tequila. Una probada de lo que te espera
            cuando cruces la puerta.
          </p>
        </div>

        <div className="gallery">
          {GALLERY_ITEMS.map((g, i) => (
            <div
              key={i}
              className={`gallery-item reveal ${g.cls}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <img src={g.src} alt={g.label} loading="lazy" />
              <span className="gallery-item-label">★ {g.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Reservations / Contact
// ============================================================
function Reservations() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', people: '2' });

  function update(k, v) { setForm({ ...form, [k]: v }); }

  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section id="contacto" className="section" data-screen-label="Contacto">
      <div className="section-inner">
        <div className="menu-head">
          <div>
            <div className="section-eyebrow reveal">Apártanos tu mesa</div>
            <h2 className="section-title reveal delay-1">RESERVA</h2>
          </div>
          <p className="section-lede reveal delay-2">
            Las mesas se llenan rápido los fines de semana. Apártala y llega con
            hambre — la birria no espera.
          </p>
        </div>

        <div className="reservations">
          <form className="res-form reveal" onSubmit={submit}>
            <label className="field">
              <span className="field-label">Nombre</span>
              <input
                type="text"
                className="field-input"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Teléfono</span>
              <input
                type="tel"
                className="field-input"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="55 1234 5678"
                required
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span className="field-label">Fecha</span>
                <input
                  type="date"
                  className="field-input"
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                  required
                />
              </label>
              <label className="field">
                <span className="field-label">Hora</span>
                <input
                  type="time"
                  className="field-input"
                  value={form.time}
                  onChange={(e) => update('time', e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="field">
              <span className="field-label">Personas</span>
              <select
                className="field-select"
                value={form.people}
                onChange={(e) => update('people', e.target.value)}
              >
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4 personas</option>
                <option value="6">6 personas</option>
                <option value="8">8 personas</option>
                <option value="10+">10+ personas</option>
              </select>
            </label>

            <MagneticBtn primary onClick={submit} href="#" className="btn-submit">
              {submitted ? '¡Listo! Te contactamos' : 'Apartar mesa'}
              {!submitted && <span className="btn-arrow">→</span>}
            </MagneticBtn>
          </form>

          <div className="res-info reveal delay-2">
            <h3>O contáctanos directo</h3>
            <p>
              Estamos disponibles por WhatsApp, Instagram y correo. Para grupos
              grandes o eventos privados, escríbenos con un par de días de anticipación.
            </p>

            <ul className="contact-list">
              <li className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <div className="contact-meta">Teléfono</div>
                  <a href="tel:5510699414" className="contact-value">55 1069 9414</a>
                </div>
              </li>
              <li className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </div>
                <div>
                  <div className="contact-meta">Instagram</div>
                  <a href="https://instagram.com/el_agave_arandas" target="_blank" rel="noopener" className="contact-value">@el_agave_arandas</a>
                </div>
              </li>
              <li className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <div className="contact-meta">Correo</div>
                  <a href="mailto:elagavearandas@gmail.com" className="contact-value">elagavearandas@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Hours + Location
// ============================================================
function HoursLocation() {
  const today = new Date().getDay(); // 0=Sun..6=Sat
  const days = [
    { idx: 1, day: 'Lunes',     time: 'Cerrado', closed: true },
    { idx: 2, day: 'Martes',    time: 'Cerrado', closed: true },
    { idx: 3, day: 'Miércoles', time: '8:00 AM — 11:00 PM' },
    { idx: 4, day: 'Jueves',    time: '8:00 AM — 11:00 PM' },
    { idx: 5, day: 'Viernes',   time: '8:00 AM — 02:00 AM' },
    { idx: 6, day: 'Sábado',    time: '8:00 AM — 02:00 AM' },
    { idx: 0, day: 'Domingo',   time: '8:00 AM — 10:00 PM' },
  ];

  const todayClosed = today === 1 || today === 2;

  return (
    <section id="visita" className="section" data-screen-label="Visita" style={{ paddingTop: 0 }}>
      <div className="section-inner">
        <div className="menu-head">
          <div>
            <div className="section-eyebrow reveal">Visítanos</div>
            <h2 className="section-title bebas reveal delay-1">
              HORARIOS Y <span className="accent">SUCURSALES</span>
            </h2>
          </div>
          <p className="section-lede reveal delay-2">
            Miércoles a domingo, dos sucursales en Tlalnepantla. Lunes y martes
            descansamos para volver con todo el resto de la semana.
          </p>
        </div>

        <div className="hours-location">
          <div className="hours-card reveal">
            <div className={`hours-status ${todayClosed ? 'closed' : ''}`}>
              <span className="live-dot"></span>
              {todayClosed ? 'Cerrado hoy' : 'Abierto ahora'}
            </div>
            <h3 className="hours-title">Horarios</h3>
            <ul className="hours-list">
              {days.map((d) => (
                <li
                  key={d.idx}
                  className={`hours-row ${d.idx === today ? 'today' : ''} ${d.closed ? 'closed' : ''}`}
                >
                  <span className="hours-day">{d.day}</span>
                  <span className="hours-time">{d.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="branches">
            <article className="branch-card reveal delay-1">
              <div className="branch-head">
                <span className="branch-pill">Sucursal 01</span>
                <h4 className="branch-name">Arboledas</h4>
              </div>
              <p className="branch-addr">
                Av. Niños Héroes #26<br/>
                Res. El Dorado, Tlalnepantla
              </p>
              <a
                className="branch-link"
                href="https://www.google.com/maps/search/?api=1&query=Av.+Ni%C3%B1os+H%C3%A9roes+26+Res+El+Dorado+Tlalnepantla"
                target="_blank"
                rel="noopener"
              >
                Cómo llegar <span>→</span>
              </a>
            </article>

            <article className="branch-card reveal delay-2">
              <div className="branch-head">
                <span className="branch-pill">Sucursal 02</span>
                <h4 className="branch-name">Centro</h4>
              </div>
              <p className="branch-addr">
                Av. Morelos #39<br/>
                San Javier, Tlalnepantla Centro
              </p>
              <a
                className="branch-link"
                href="https://www.google.com/maps/search/?api=1&query=Av.+Morelos+39+San+Javier+Tlalnepantla+Centro"
                target="_blank"
                rel="noopener"
              >
                Cómo llegar <span>→</span>
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Footer
// ============================================================
function Footer() {
  return (
    <footer className="footer" data-screen-label="Footer">
      <div className="footer-band"></div>
      <div className="section-inner">
        <div className="footer-cta reveal">PRENDE LA NOCHE</div>

        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <img src="assets/logo.png" alt="El Agave" />
            <p>Birria estilo Jalisco & cantaritos en Tlalnepantla. Sabor de casa, energía de noche.</p>
          </div>
          <div className="footer-col">
            <h5>Sucursal Arboledas</h5>
            <p>Av. Niños Héroes #26<br/>Res. El Dorado, Tlalnepantla</p>
            <h5 style={{marginTop:'18px'}}>Sucursal Centro</h5>
            <p>Av. Morelos #39<br/>San Javier, Tlalnepantla Centro</p>
          </div>
          <div className="footer-col">
            <h5>Contacto</h5>
            <a href="tel:5510699414">55 1069 9414</a>
            <a href="mailto:elagavearandas@gmail.com">elagavearandas@gmail.com</a>
            <a href="https://instagram.com/el_agave_arandas" target="_blank" rel="noopener">@el_agave_arandas</a>
          </div>
          <div className="footer-col">
            <h5>Síguenos</h5>
            <a href="#menu">Menú completo</a>
            <a href="#contacto">Reservaciones</a>
            <a href="#nosotros">Nuestra historia</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 El Agave · Birria & Cantaritos</span>
          <span>Hecho con ★ en Tlalnepantla</span>
        </div>
      </div>
    </footer>
  );
}

// Export to window so app.jsx can use them
Object.assign(window, {
  Nav, Hero, About, Menu, Gallery, Reservations, HoursLocation, Footer,
  SmokeLayer, useReveal,
});

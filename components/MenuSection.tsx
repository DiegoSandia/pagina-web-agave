'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import mark from '@/assets/brand/agave-mark.png';
import { MENU, MENU_NOTES, money, type MenuCategory } from '@/lib/site';

function withTransition(el: HTMLElement | null, update: () => void) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!el || reduced || !document.startViewTransition) {
    update();
    return;
  }
  el.style.viewTransitionName = 'menu-panel';
  const t = document.startViewTransition(() => flushSync(update));
  t.ready.catch(() => {});
  t.finished.finally(() => {
    el.style.viewTransitionName = '';
  });
}

function Pill({ items, active, onPick, label, size }: {
  items: { id: string; label: string }[];
  active: string;
  onPick: (id: string) => void;
  label: string;
  size: 'lg' | 'sm';
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const btn = wrap.current?.querySelector<HTMLButtonElement>(`[data-id="${active}"]`);
      if (btn) setInd({ left: btn.offsetLeft, width: btn.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [active, items]);

  return (
    <div ref={wrap} className={`pill pill-${size}`} role="tablist" aria-label={label}>
      <span className="pill-ind" style={{ transform: `translateX(${ind.left}px)`, width: ind.width }} aria-hidden="true" />
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          role="tab"
          data-id={it.id}
          aria-selected={active === it.id}
          className="pill-btn"
          onClick={(e) => {
            onPick(it.id);
            e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
          }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

function Panel({ cat }: { cat: MenuCategory }) {
  return (
    <div className="menu-panel-inner">
      <div className="menu-visual">
        {cat.img ? (
          <Image key={cat.id} src={cat.img} alt={cat.label} placeholder="blur" sizes="(max-width: 900px) 100vw, 38vw" />
        ) : (
          <div className="menu-visual-fallback">
            <Image src={mark} alt="" width={120} height={106} />
            <span>{cat.label}</span>
          </div>
        )}
        <div className="menu-visual-cap">
          <h3>{cat.label}</h3>
          {cat.intro && <p>{cat.intro}</p>}
        </div>
      </div>

      <div className="menu-list-wrap">
        {cat.cols && (
          <div className="menu-cols" aria-hidden="true">
            <span />
            <span>{cat.cols[0]}</span>
            <span>{cat.cols[1]}</span>
          </div>
        )}
        <ul className={`menu-list ${cat.cols ? 'has-cols' : cat.items.length > 6 ? 'is-long' : ''}`}>
          {cat.items.map((it, i) => (
            <li key={`${it.name}-${i}`} className="menu-row">
              <div className="menu-row-main">
                <span className="menu-name">
                  {it.name}
                  {it.note && <small>{it.note}</small>}
                </span>
                {it.desc && <span className="menu-desc">{it.desc}</span>}
              </div>
              {cat.cols ? (
                <>
                  <span className="menu-price" aria-label={`${cat.cols[0]}: ${it.price ? money(it.price) : 'no disponible'}`}>
                    {it.price ? money(it.price) : '—'}
                  </span>
                  <span className="menu-price alt" aria-label={`${cat.cols[1]}: ${it.price2 ? money(it.price2) : 'no disponible'}`}>
                    {it.price2 ? money(it.price2) : '—'}
                  </span>
                </>
              ) : (
                <span className="menu-price">{it.price ? money(it.price) : ''}</span>
              )}
            </li>
          ))}
        </ul>
        {cat.footnote && <p className="menu-foot">{cat.footnote}</p>}
      </div>
    </div>
  );
}

export default function MenuSection() {
  const [groupId, setGroupId] = useState(MENU[0].id);
  const group = MENU.find((g) => g.id === groupId)!;
  const [catId, setCatId] = useState(group.categories[0].id);
  const cat = group.categories.find((c) => c.id === catId) ?? group.categories[0];
  const panel = useRef<HTMLDivElement>(null);

  const pickGroup = (id: string) =>
    withTransition(panel.current, () => {
      setGroupId(id);
      setCatId(MENU.find((g) => g.id === id)!.categories[0].id);
    });
  const pickCat = (id: string) => withTransition(panel.current, () => setCatId(id));

  return (
    <section id="menu" className="section menu" aria-labelledby="menu-title">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow rv">La carta completa</p>
            <h2 id="menu-title" className="h-xl rv">El menú</h2>
          </div>
          <p className="lede rv">
            Todo se prepara al momento. Precios en pesos mexicanos; la propina es opcional.
          </p>
        </header>

        <div className="menu-nav rv">
          <Pill items={MENU} active={groupId} onPick={pickGroup} label="Secciones del menú" size="lg" />
          <Pill items={group.categories} active={cat.id} onPick={pickCat} label={`Categorías de ${group.label}`} size="sm" />
        </div>

        <div ref={panel} className="menu-panel" role="tabpanel" aria-label={cat.label}>
          <Panel cat={cat} />
        </div>

        {MENU_NOTES[groupId] && <p className="menu-note">{MENU_NOTES[groupId]}</p>}
      </div>
    </section>
  );
}

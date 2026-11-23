'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import mark from '@/assets/brand/agave-mark.png';
import { FEATURED, MENU, MENU_NOTES, money, type MenuCategory, type MenuItem } from '@/lib/site';
import { lockScroll } from '@/lib/lenis';
import { Close } from './icons';

type Dish = MenuItem & { categoryLabel?: string; cols?: [string, string] };

function priceText(d: Dish) {
  if (d.cols && d.price && d.price2) return `${d.cols[0]} ${money(d.price)} · ${d.cols[1]} ${money(d.price2)}`;
  if (d.price) return money(d.price);
  if (d.price2) return money(d.price2);
  return '';
}

function DishView({ dish, onClose }: { dish: Dish | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (dish && !el.open) {
      el.showModal();
      lockScroll(true);
    }
    if (!dish && el.open) {
      el.close();
      lockScroll(false);
    }
  }, [dish]);

  return (
    <dialog
      ref={ref}
      className="dish-view"
      aria-label={dish?.name ?? 'Platillo'}
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {dish?.img && (
        <figure className="dish-view-inner">
          <Image src={dish.img} alt={dish.name} placeholder="blur" sizes="(max-width: 700px) 100vw, 560px" />
          <figcaption>
            {dish.tag && <span className="dish-tag">{dish.tag}</span>}
            <h3>{dish.name}</h3>
            {(dish.note || dish.categoryLabel) && (
              <p className="dish-meta">{[dish.categoryLabel, dish.note].filter(Boolean).join(' · ')}</p>
            )}
            {dish.desc && <p className="dish-desc">{dish.desc}</p>}
            <p className="dish-price">{priceText(dish)}</p>
          </figcaption>
          <button type="button" className="lb-btn dish-close" onClick={onClose} aria-label="Cerrar">
            <Close size={20} />
          </button>
        </figure>
      )}
    </dialog>
  );
}

function Featured({ onOpen }: { onOpen: (d: Dish) => void }) {
  return (
    <div className="featured rv">
      <p className="label featured-label">Lo que más se pide</p>
      <ul className="featured-row" data-lenis-prevent>
        {FEATURED.map((d) => (
          <li key={`${d.category}-${d.name}`}>
            <button type="button" className="featured-card" onClick={() => onOpen(d)} aria-label={`Ver ${d.name}`}>
              <Image src={d.img!} alt="" placeholder="blur" sizes="(max-width: 700px) 62vw, 260px" />
              <span className="dish-tag">{d.tag}</span>
              <span className="featured-cap">
                <strong>{d.name === 'Tradicional' ? 'Cantarito tradicional' : d.name}</strong>
                <span>{priceText(d)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

function Panel({ cat, onOpen }: { cat: MenuCategory; onOpen: (d: Dish) => void }) {
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
            <li key={`${it.name}-${i}`} className={`menu-row ${it.img ? 'has-thumb' : ''}`}>
              <div className="menu-row-main">
                <span className="menu-name">
                  {it.img && (
                    <button
                      type="button"
                      className="menu-thumb"
                      onClick={() => onOpen({ ...it, categoryLabel: cat.label, cols: cat.cols })}
                      aria-label={`Ver foto de ${it.name}`}
                    >
                      <Image src={it.img} alt="" placeholder="blur" sizes="56px" />
                    </button>
                  )}
                  <span className="menu-name-text">
                    {it.name}
                    {it.tag && <em className="menu-tag">{it.tag}</em>}
                  </span>
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

export default function MenuSection({ asPage = false }: { asPage?: boolean }) {
  const Title = asPage ? 'h1' : 'h2';
  const [groupId, setGroupId] = useState(MENU[0].id);
  const group = MENU.find((g) => g.id === groupId)!;
  const [catId, setCatId] = useState(group.categories[0].id);
  const cat = group.categories.find((c) => c.id === catId) ?? group.categories[0];
  const panel = useRef<HTMLDivElement>(null);
  const [dish, setDish] = useState<Dish | null>(null);

  const pickGroup = (id: string) =>
    withTransition(panel.current, () => {
      setGroupId(id);
      setCatId(MENU.find((g) => g.id === id)!.categories[0].id);
    });
  const pickCat = (id: string) => withTransition(panel.current, () => setCatId(id));

  useEffect(() => {
    const select = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      const g = MENU.find((x) => x.id === h || x.categories.some((c) => c.id === h));
      if (!g) return;
      setGroupId(g.id);
      setCatId(g.categories.find((c) => c.id === h)?.id ?? g.categories[0].id);
    };
    select();
    window.addEventListener('hashchange', select);
    return () => window.removeEventListener('hashchange', select);
  }, []);

  return (
    <section id="menu" className="section menu" aria-labelledby="menu-title">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow rv">La carta completa</p>
            <Title id="menu-title" className="h-xl rv">El menú</Title>
          </div>
          <p className="lede rv">
            Todo se prepara al momento. Precios en pesos mexicanos; la propina es opcional.
          </p>
        </header>

        <Featured onOpen={setDish} />

        <div className="menu-nav rv">
          <Pill items={MENU} active={groupId} onPick={pickGroup} label="Secciones del menú" size="lg" />
          <Pill items={group.categories} active={cat.id} onPick={pickCat} label={`Categorías de ${group.label}`} size="sm" />
        </div>

        <div ref={panel} className="menu-panel" role="tabpanel" aria-label={cat.label}>
          <Panel cat={cat} onOpen={setDish} />
        </div>

        {MENU_NOTES[groupId] && <p className="menu-note">{MENU_NOTES[groupId]}</p>}
      </div>
      <DishView dish={dish} onClose={() => setDish(null)} />
    </section>
  );
}

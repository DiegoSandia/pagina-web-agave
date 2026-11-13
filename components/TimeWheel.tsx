'use client';

import { useEffect, useRef } from 'react';

const ITEM = 44;

type Option = { value: string; label: string };

export default function TimeWheel({
  options,
  value,
  onChange,
  label,
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const userScrolling = useRef(false);
  const index = Math.max(0, options.findIndex((o) => o.value === value));

  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    const el = ref.current;
    if (el && !userScrolling.current) el.scrollTo({ top: index * ITEM });
  }, [index, options]);

  // Re-align when the wheel becomes visible (e.g. inside a dialog that opens later).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (el.clientHeight && !userScrolling.current) el.scrollTo({ top: indexRef.current * ITEM });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const onScroll = () => {
      if (!el.clientHeight) return;
      userScrolling.current = true;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        userScrolling.current = false;
        const i = Math.min(options.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM)));
        if (options[i] && options[i].value !== value) onChange(options[i].value);
      }, 90);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
    };
  }, [options, value, onChange]);

  const go = (i: number) => {
    const next = Math.min(options.length - 1, Math.max(0, i));
    ref.current?.scrollTo({ top: next * ITEM, behavior: 'smooth' });
  };

  return (
    <div className="wheel">
      <div
        ref={ref}
        className="wheel-scroll"
        role="listbox"
        aria-label={label}
        aria-activedescendant={value ? `wheel-${value}` : undefined}
        tabIndex={0}
        data-lenis-prevent
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            go(index + 1);
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            go(index - 1);
          }
        }}
      >
        {options.map((o, i) => (
          <div
            key={o.value}
            id={`wheel-${o.value}`}
            role="option"
            aria-selected={o.value === value}
            className="wheel-item"
            data-dist={Math.min(3, Math.abs(i - index))}
            onClick={() => go(i)}
          >
            {o.label}
          </div>
        ))}
      </div>
      <div className="wheel-band" aria-hidden="true" />
    </div>
  );
}

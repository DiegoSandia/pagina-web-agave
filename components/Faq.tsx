import { FAQ } from '@/lib/site';

export default function Faq() {
  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <header className="faq-head">
          <p className="eyebrow rv">Preguntas frecuentes</p>
          <h2 id="faq-title" className="h-xl rv">¿Dudas?</h2>
          <p className="lede rv">Si no está aquí, escríbenos por WhatsApp y te contestamos.</p>
        </header>
        <div className="faq-list">
          {FAQ.map((f, i) => (
            <details key={i} name="faq" className="faq-item rv" open={i === 0}>
              <summary>
                <span>{f.q}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

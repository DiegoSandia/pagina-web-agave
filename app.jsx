/* global React, ReactDOM, Nav, Hero, PromoStrip, About, Menu, Gallery, Reviews, FAQ, Reservations, HoursLocation, Footer, SmokeLayer, useReveal, WhatsAppFloat, useTweaks, TweaksPanel, TweakSection, TweakRadio */
const { useEffect } = React;

const TWEAKS = /*EDITMODE-BEGIN*/{
  "neonColor": "amber"
}/*EDITMODE-END*/;

const NEON_PRESETS = {
  amber:  { primary: '#FFB800', secondary: '#FF6B1A', tertiary: '#E53E0C' },
  orange: { primary: '#FF6B1A', secondary: '#E53E0C', tertiary: '#FF3D00' },
  red:    { primary: '#E53E0C', secondary: '#FF3D00', tertiary: '#B71C1C' },
};

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAKS);

  useReveal();

  useEffect(() => {
    const preset = NEON_PRESETS[tweaks.neonColor] || NEON_PRESETS.amber;
    const r = document.documentElement;
    r.style.setProperty('--neon-primary', preset.primary);
    r.style.setProperty('--neon-secondary', preset.secondary);
    r.style.setProperty('--neon-tertiary', preset.tertiary);
  }, [tweaks.neonColor]);

  return (
    <>
      <div className="app-bg"><div className="wood-texture" /></div>
      <SmokeLayer />
      <Nav />
      <Hero />
      <PromoStrip />
      <About />
      <Menu />
      <Gallery />
      <Reviews />
      <FAQ />
      <Reservations />
      <HoursLocation />
      <Footer />
      <WhatsAppFloat />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Color del neón">
          <TweakRadio
            value={tweaks.neonColor}
            onChange={(v) => setTweak('neonColor', v)}
            options={[
              { value: 'amber',  label: 'Amarillo' },
              { value: 'orange', label: 'Naranja' },
              { value: 'red',    label: 'Rojo' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

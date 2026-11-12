import { useEffect, useRef, useState } from 'react';

const developments = [
  {
    name: 'Mirante do Vale',
    slug: 'mirante-do-vale',
    description: 'Varandas em terraços acompanham o relevo e abrem a vista para o vale.',
    alt: 'Edifício residencial com varandas escalonadas e iluminadas, em uma encosta cercada de mata.',
  },
  {
    name: 'Casa Nascente',
    slug: 'casa-nascente',
    description: 'Tijolo aparente e madeira emolduram um pátio tropical com espelho d’água.',
    alt: 'Casa de dois pavimentos com fachada de tijolos e madeira ao lado de um espelho d’água.',
  },
  {
    name: 'Bosque Alto',
    slug: 'bosque-alto',
    description: 'Fachadas em madeira e metal escuro se abrem para o verde ao redor.',
    alt: 'Condomínio de poucos pavimentos entre árvores, com fachadas de madeira e varandas iluminadas.',
  },
] as const;

const rotationDelay = 5500;

export default function Developments() {
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [interacting, setInteracting] = useState({ hovering: false, focused: false });
  const selected = developments[active];

  useEffect(() => {
    const element = stage.current;
    if (!element) return;

    const preference = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const updatePreference = () => setMotionAllowed(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);

    const visibleThreshold = 0.45;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.intersectionRatio >= visibleThreshold);
    }, { threshold: visibleThreshold });
    observer.observe(element);

    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updatePreference);
    };
  }, []);

  const autoRotate = playing && inView && motionAllowed && !interacting.hovering && !interacting.focused;
  useEffect(() => {
    if (!autoRotate) return;
    const timer = window.setTimeout(() => {
      setActive(current => (current + 1) % developments.length);
    }, rotationDelay);
    return () => window.clearTimeout(timer);
  }, [active, autoRotate]);

  const select = (index: number) => {
    setPlaying(false);
    setActive(index);
  };

  return (
    <section className="developments" id="empreendimentos" aria-labelledby="developments-heading">
      <div className="developments-inner">
        <div className="developments-intro">
          <h2 id="developments-heading">Três formas <em>de morar.</em></h2>
        </div>

        <div
          className="developments-stage"
          ref={stage}
          role="group"
          aria-label="Selecionar empreendimento"
          onMouseEnter={() => setInteracting(current => ({ ...current, hovering: true }))}
          onMouseLeave={() => setInteracting(current => ({ ...current, hovering: false }))}
          onFocus={event => {
            const focused = Boolean(event.target.closest('.development-card'));
            setInteracting(current => ({ ...current, focused }));
          }}
          onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setInteracting(current => ({ ...current, focused: false }));
            }
          }}
        >
          <button
            className="developments-playback"
            type="button"
            aria-label={playing ? 'Pausar rotação das imagens' : 'Retomar rotação das imagens'}
            data-playing={playing}
            onClick={() => setPlaying(current => !current)}
          />
          {developments.map((development, index) => {
            const depth = (index - active + developments.length) % developments.length;
            return (
              <figure className="development-card" key={development.slug} data-depth={depth}>
                <img
                  src={`/images/empreendimentos/${development.slug}.webp`}
                  alt={depth === 0 ? development.alt : ''}
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption aria-hidden={depth !== 0}>{development.name}</figcaption>
                <button type="button" aria-label={`Mostrar ${development.name}`} aria-pressed={depth === 0} onClick={() => select(index)} />
              </figure>
            );
          })}
        </div>

        <div className="developments-caption" aria-live={playing && motionAllowed ? 'off' : 'polite'} aria-atomic="true">
          <div className="developments-caption-copy" key={selected.slug}>
            <span className="sr-only">{selected.name}. </span>
            <p>{selected.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

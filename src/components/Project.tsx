import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

type ProjectProps = { imageSrc: string; imageWidth: number; imageHeight: number };

export default function Project({ imageSrc, imageWidth, imageHeight }: ProjectProps) {
  const section = useRef<HTMLElement>(null);
  const house = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    let disposed = false;
    // Font and image readiness keep the reveal aligned with the final layout.
    Promise.all([document.fonts.ready, house.current?.decode().catch(() => {})]).then(() => {
      if (disposed || !section.current) return;
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const root = section.current!;
        const split = SplitText.create(root.querySelectorAll('.project-heading-part'), {
          type: 'words', aria: 'none',
        });
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
          defaults: { ease: 'power4.out' },
        });
        timeline
          .from(split.words, { transform: 'translateY(45%)', opacity: 0, duration: 1, stagger: .055 }, 0)
          .from(root.querySelectorAll('.project-body > *'), { transform: 'translateY(24px)', opacity: 0, duration: .85, stagger: .08 }, .25)
          .from(root.querySelector('.project-house'), { transform: 'translate(5%, 8%) scale(.97)', opacity: 0, duration: 1.5 }, .1);
        return () => split.revert();
      }, section);
    });
    return () => { disposed = true; media.revert(); };
  }, []);

  return (
    <section className="project-section" id="projeto" ref={section} aria-labelledby="project-heading">
      <div className="project-intro">
        <h2 id="project-heading" aria-label="Um novo jeito de viver. Pensado para o seu conforto.">
          <span className="project-heading-part" aria-hidden="true">Um novo jeito de viver.</span>
          <em className="project-heading-part" aria-hidden="true">Pensado para o seu conforto.</em>
        </h2>
      </div>

      <div className="project-composition">
        <div className="project-body">
          <p>Arquitetura que acolhe. Espaços que aproximam. Uma residência onde a elegância dos materiais encontra o conforto de todos os dias e cada detalhe faz você se sentir em casa.</p>
          <details className="project-details" onToggle={() => ScrollTrigger.refresh()}>
            <summary>Explorar os espaços <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></summary>
            <div className="project-details-content">
              <p><strong>Conexão com o exterior</strong> Grandes aberturas e varandas aproximam os ambientes da paisagem.</p>
              <p><strong>Materiais que acolhem</strong> Pedra, madeira e vidro compõem uma arquitetura de texturas e luz.</p>
              <p><strong>Conforto em cada espaço</strong> Áreas de convivência para compartilhar e ambientes íntimos para desacelerar.</p>
            </div>
          </details>
        </div>
        <div className="project-house">
          <img ref={house} src={imageSrc} width={imageWidth} height={imageHeight} alt="Casa contemporânea com fachada de pedra, madeira e vidro, varanda e ambientes iluminados em tons quentes." loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  );
}

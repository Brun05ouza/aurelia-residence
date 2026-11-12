import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const facade = '/images/residencia/fachada.webp';
const facadeDescription = 'Perspectiva de uma residência contemporânea com varandas de concreto, ripas de madeira e piscina junto ao jardim.';

const questions = [
  {
    title: 'Como são os espaços da residência?',
    answer: 'São 320 m² de área privativa e quatro suítes. As varandas e as amplas aberturas aproximam as áreas de convivência do jardim.',
  },
  {
    title: 'A que distância fica o centro?',
    answer: 'A residência fica a cerca de 15 minutos do centro da cidade. O endereço completo será divulgado quando estiver disponível.',
  },
  {
    title: 'Como posso agendar uma visita?',
    answer: 'O canal de agendamento será disponibilizado nesta página. Por ele, você poderá combinar um horário para conhecer a residência.',
  },
];

export default function ResidenceQuestions() {
  const section = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const root = section.current;
    if (!root) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const reveal = (trigger: string) => gsap.timeline({
        scrollTrigger: { trigger, start: 'top 88%', once: true },
        defaults: { ease: 'power4.out' },
      });

      const heading = reveal('#residence-questions-title')
        .from('.residence-heading-line', { opacity: 0, yPercent: 34, duration: .85, stagger: .075 });

      const facade = reveal('.residence-feature')
        .fromTo('.residence-feature-trigger', { clipPath: 'inset(0 100% 0 0)' }, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.06,
          ease: 'power3.inOut',
          clearProps: 'clipPath',
        })
        .from('.residence-feature-expand, .residence-feature figcaption', {
          opacity: 0, y: 9, duration: .58, stagger: .075,
        }, .65);

      const questions = reveal('.residence-questions-side')
        .from('.residence-space-link', { opacity: 0, y: 23, duration: .72 })
        .from('.residence-answers details', { opacity: 0, y: 14, duration: .65, stagger: .075 }, .2);

      const finishOnFocus = () => {
        for (const animation of [heading, facade, questions]) animation.progress(1);
      };
      root.addEventListener('focusin', finishOnFocus);
      return () => root.removeEventListener('focusin', finishOnFocus);
    }, root);

    return () => media.revert();
  }, []);

  return (
    <section className="residence-questions" id="duvidas" ref={section} aria-labelledby="residence-questions-title">
      <div className="residence-questions-inner">
        <h2 id="residence-questions-title">
          <span className="residence-heading-line">Por que escolher</span>{' '}
          <em className="residence-heading-line">o Aurelia?</em>
        </h2>

        <div className="residence-questions-layout">
          <figure className="residence-feature">
            <button className="residence-feature-trigger" type="button" aria-label="Ampliar a perspectiva da fachada" onClick={() => preview.current?.showModal()}>
              <img
                src={facade}
                srcSet={`/images/residencia/fachada-768.webp 768w, ${facade} 1536w`}
                sizes="(max-width: 740px) calc(100vw - 48px), (max-width: 1600px) 47vw, 780px"
                width="1536"
                height="1024"
                alt={facadeDescription}
                loading="lazy"
                decoding="async"
              />
              <span className="residence-feature-expand" aria-hidden="true">⤢</span>
            </button>
            <figcaption>Perspectiva da fachada</figcaption>
          </figure>

          <div className="residence-questions-side">
            <a className="residence-space-link" href="#projeto">
              <span className="residence-space-copy">
                <strong>Espaços para<br />viver bem</strong>
                <span>Ver o projeto <span aria-hidden="true">↗</span></span>
              </span>
              <img
                src="/images/residencia/convivencia.webp"
                width="640"
                height="427"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </a>

            <div className="residence-answers">
              {questions.map(({ title, answer }) => (
                <details key={title} name="aurelia-questions">
                  <summary>{title}<span aria-hidden="true" /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <dialog ref={preview} className="residence-photo-dialog" aria-label="Perspectiva da fachada" onClick={event => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}>
        <figure>
          <img src={facade} width="1536" height="1024" alt={facadeDescription} loading="lazy" decoding="async" />
          <form method="dialog">
            <button type="submit" aria-label="Fechar imagem ampliada" autoFocus>×</button>
          </form>
        </figure>
      </dialog>
    </section>
  );
}

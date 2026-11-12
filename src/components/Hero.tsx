import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const details = {
  projeto: {
    eyebrow: 'O PROJETO', title: 'Um novo olhar para viver.',
    text: 'Arquitetura contemporânea, conforto absoluto e conexão com a natureza. O Aurelia Residence traduz o equilíbrio entre espaços abertos e a privacidade de estar em casa.',
  },
  espacos: {
    eyebrow: 'OS ESPAÇOS', title: 'Espaço para o que importa.',
    text: '320 m² de área privativa e 4 suítes. Ambientes que aproximam a vida de dentro à paisagem lá fora, com espaço para compartilhar e privacidade para desacelerar.',
  },
  local: {
    eyebrow: 'A LOCALIZAÇÃO', title: 'Perto da cidade. Perto de você.',
    text: 'A 15 minutos do centro da cidade, segundo a apresentação do projeto. A localização completa será disponibilizada em breve.',
  },
  contato: {
    eyebrow: 'CONHEÇA O AURELIA', title: 'Imagine a sua vida aqui.',
    text: 'Em breve, você poderá agendar uma visita e conhecer cada detalhe do Aurelia Residence. O canal de atendimento será disponibilizado nesta página.',
  },
};
type Detail = keyof typeof details;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={diagonal ? 'arrow diagonal' : 'arrow'}><path d="M4 12h15M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Hero() {
  const scene = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Detail>('projeto');
  const [menuOpen, setMenuOpen] = useState(false);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const split = SplitText.create(scene.current!.querySelectorAll('.title-word'), {
        type: 'chars', aria: 'none',
      });
      gsap.fromTo(split.chars,
        { transform: 'translateY(105%)', opacity: 0 },
        { transform: 'translateY(0%)', opacity: 1, duration: 1.15, stagger: .045, delay: .15, ease: 'power4.out', clearProps: 'transform,opacity' },
      );
      return () => split.revert();
    }, scene);
    return () => media.revert();
  }, []);
  const openDetail = (detail: Detail) => {
    if (detail === 'projeto') {
      setMenuOpen(false);
      const destination = document.getElementById('projeto');
      destination?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      return;
    }
    setActive(detail);
    setMenuOpen(false);
    dialog.current?.showModal();
  };

  return (
    <>
      <section className="hero-shell" id="inicio" aria-label="Aurelia Residence">
        <div className="hero-scene" ref={scene}>
          <div className="sky" aria-hidden="true" />
          <img className="residence-image" src="/images/aurelia-residence-predio-recorte.jpg" width="1031" height="407" alt="Residência contemporânea com amplas varandas, fachada em madeira, jardim e piscina integrada à área de convivência." fetchPriority="high" />
          <svg className="residence-foreground" viewBox="0 0 1031 407" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
            <defs><clipPath id="residence-roof"><path d="M290 70L803 0H1031V407H0V222L40 213V207L505 152L505 112L290 96Z" /></clipPath></defs>
            <image href="/images/aurelia-residence-predio-recorte.jpg" width="1031" height="407" clipPath="url(#residence-roof)" />
          </svg>
          <div className="image-shade" aria-hidden="true" />

          <header className="site-header entrance">
            <a className="brand" href="#inicio" aria-label="Aurelia Residence — início"><img src="/images/aurelia-residence-logo-branca.svg" alt="Aurelia Residence" width="510" height="100" /></a>
            <nav className="desktop-nav" aria-label="Navegação principal">
              <a href="#inicio" aria-current="page">Início</a>
              <button onClick={() => openDetail('projeto')}>Projeto</button>
              <button onClick={() => openDetail('espacos')}>Espaços</button>
              <button onClick={() => openDetail('local')}>Local</button>
              <button onClick={() => openDetail('contato')}>Contato</button>
            </nav>
            <button className="pill visit-button" onClick={() => openDetail('contato')}><span>Agendar visita</span><span className="arrow-circle"><Arrow /></span></button>
            <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-nav" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
          </header>

          <nav id="mobile-nav" className="mobile-nav" aria-label="Navegação móvel" hidden={!menuOpen} onKeyDown={event => { if (event.key === 'Escape') { setMenuOpen(false); document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus(); } }}>
            <a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a>
            {(['projeto', 'espacos', 'local', 'contato'] as Detail[]).map((item, index) => <button key={item} onClick={() => openDetail(item)}>{['Projeto', 'Espaços', 'Local', 'Contato'][index]}<Arrow diagonal /></button>)}
          </nav>

          <div className="hero-copy">
            <div className="heading-topline">
              <span className="where entrance">Where</span>
            </div>
          </div>
          <h1 className="hero-title" ref={title} aria-label="LIFE BELONGS — Aurelia Residence"><span className="title-word" aria-hidden="true">LIFE</span>{' '}<span className="title-word title-belongs" aria-hidden="true">BELONGS</span></h1>

          <div className="property-facts" aria-label="Destaques da residência">
            <div className="fact entrance"><strong>320 <span>m²</span></strong><span>Área privativa</span></div>
            <div className="fact entrance"><strong>4 suítes</strong><span>Conforto e privacidade</span></div>
            <div className="fact entrance"><strong>15 <span>min</span></strong><span>Do centro da cidade</span></div>
          </div>

          <div className="project-cta entrance"><button className="pill" onClick={() => openDetail('projeto')}><span>Conhecer o projeto</span><span className="arrow-circle"><Arrow /></span></button></div>
          <svg className="hero-bottom-cutout" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0Q0 22 24 22H235C263 22 263 60 295 60H0ZM1000 0Q1000 22 976 22H765C737 22 737 60 705 60H1000Z" />
          </svg>
        </div>
      </section>

      <dialog ref={dialog} className="detail-dialog" aria-labelledby="detail-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="dialog-inner">
          <button className="dialog-close" aria-label="Fechar" onClick={() => dialog.current?.close()} autoFocus>×</button>
          <img className="dialog-logo" src="/images/aurelia-residence-logo-azul-marinho.svg" alt="Aurelia Residence" width="510" height="100" />
          <span className="detail-eyebrow">{details[active].eyebrow}</span>
          <h2 id="detail-title">{details[active].title}</h2>
          <p>{details[active].text}</p>
          {active !== 'contato' && <img className="detail-image" src="/images/aurelia-residence-predio-recorte.jpg" alt="Fachada e piscina do Aurelia Residence" width="1031" height="407" />}
          <button className="dialog-back" onClick={() => dialog.current?.close()}>Voltar para a residência <Arrow /></button>
        </div>
      </dialog>
    </>
  );
}

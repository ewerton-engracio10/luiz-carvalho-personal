const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const sections = [...document.querySelectorAll('main section[id], header[id]')];
const links = [...document.querySelectorAll('.nav a')];
window.addEventListener('scroll', () => {
  let current = 'inicio';
  for (const section of sections) {
    const top = section.getBoundingClientRect().top;
    if (top <= 130) current = section.id;
  }
  links.forEach(link => {
    const href = link.getAttribute('href')?.slice(1);
    link.classList.toggle('active', href === current);
  });
}, { passive: true });

// Força o carregamento da versão atual do logo e evita cache antigo/quebrado.
document.querySelectorAll('img[src="/assets/team-carvalho.png"]').forEach((img) => {
  img.src = '/assets/team-carvalho.png?v=20260913-2';
});

// Ajustes finos do hero em desktop para manter todo o conteúdo dentro da tela.
const layoutFix = document.createElement('style');
layoutFix.textContent = `
@media (min-width: 901px) {
  .brand {
    min-width: 0;
    overflow: visible;
  }

  .brand img {
    width: 205px;
    max-width: 100%;
    height: auto;
    max-height: 58px;
    object-fit: contain;
    object-position: left center;
  }

  .hero {
    grid-template-columns: minmax(0, 38%) minmax(0, 44%) minmax(210px, 18%);
    min-height: calc(100vh - 78px);
  }

  .hero-copy {
    padding-left: clamp(42px, 4.8vw, 80px);
    padding-right: 28px;
  }

  .hero-copy h1 span {
    font-size: clamp(72px, 6vw, 110px);
  }

  .hero-copy h1 strong {
    font-size: clamp(68px, 5.5vw, 104px);
  }

  .hero-subtitle {
    font-size: 14px;
    letter-spacing: .22em;
  }

  .hero-text {
    font-size: 16px;
    max-width: 470px;
  }

  .hero-mantra {
    min-width: 0;
    overflow: hidden;
    padding: 56px 14px 40px 18px;
  }

  .hero-mantra .script {
    max-width: 100%;
    font-size: clamp(28px, 2.3vw, 39px);
    line-height: 1.02;
    white-space: nowrap;
    transform: rotate(-5deg);
  }

  .hero-mantra .stacked {
    margin-top: 34px;
    font-size: 11px;
    letter-spacing: .2em;
  }
}

@media (min-width: 901px) and (max-height: 760px) {
  .hero-copy {
    padding-top: 34px;
    padding-bottom: 34px;
  }

  .hero-copy h1 span {
    font-size: clamp(64px, 5.4vw, 94px);
  }

  .hero-copy h1 strong {
    font-size: clamp(60px, 5vw, 90px);
    margin-top: 10px;
  }

  .hero-subtitle {
    margin-top: 18px;
  }

  .accent-line {
    margin: 13px 0 16px;
  }

  .hero-text {
    margin-bottom: 16px;
    line-height: 1.4;
  }

  .ig-line {
    margin-top: 10px;
  }
}
`;
document.head.appendChild(layoutFix);

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

// Correção definitiva dos assets principais em PNG.
// O parâmetro de versão impede o navegador de reaproveitar os arquivos antigos em cache.
const ASSET_VERSION = '20260912-0058';
const logoUrl = `/assets/team-carvalho.png?v=${ASSET_VERSION}`;
const heroUrl = `/assets/luiz-hero.png?v=${ASSET_VERSION}`;

document.querySelectorAll('.brand img, .footer-logo').forEach(img => {
  img.src = logoUrl;
  img.removeAttribute('srcset');
  img.style.objectFit = 'contain';
  img.style.background = 'transparent';
});

const heroSection = document.querySelector('.hero');
const heroPhoto = document.querySelector('.hero-photo');
const heroImg = document.querySelector('.hero-photo img');

if (heroSection) {
  heroSection.style.minHeight = '700px';
}

if (heroPhoto) {
  heroPhoto.style.height = '700px';
  heroPhoto.style.minHeight = '700px';
  heroPhoto.style.overflow = 'hidden';
  heroPhoto.style.display = 'block';
}

if (heroImg) {
  heroImg.src = heroUrl;
  heroImg.removeAttribute('srcset');
  heroImg.style.display = 'block';
  heroImg.style.width = '100%';
  heroImg.style.height = '100%';
  heroImg.style.objectFit = 'cover';
  heroImg.style.objectPosition = 'center 18%';
}

// Ajuste mobile sem alterar a direção visual aprovada.
const applyHeroResponsiveFix = () => {
  if (!heroPhoto || !heroImg) return;
  if (window.innerWidth <= 900) {
    heroPhoto.style.height = '61vh';
    heroPhoto.style.minHeight = '500px';
    heroImg.style.objectFit = 'cover';
    heroImg.style.objectPosition = 'center 14%';
  } else {
    heroPhoto.style.height = '700px';
    heroPhoto.style.minHeight = '700px';
    heroImg.style.objectFit = 'cover';
    heroImg.style.objectPosition = 'center 18%';
  }
};
applyHeroResponsiveFix();
window.addEventListener('resize', applyHeroResponsiveFix, { passive: true });

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

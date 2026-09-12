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

// Assets aprovados em PNG: corrige logo e hero sem depender dos antigos WEBP.
document.querySelectorAll('img[src="/assets/team-carvalho.webp"]').forEach(img => {
  img.src = '/assets/team-carvalho.png';
});
document.querySelectorAll('img[src="/assets/luiz-hero.webp"]').forEach(img => {
  img.src = '/assets/luiz-hero.png';
});

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

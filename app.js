const activePage = document.body.dataset.page;
document.querySelectorAll('.nav-links a').forEach((link) => {
  if (link.dataset.page === activePage) link.classList.add('active');
});

const toggle = document.querySelector('.mode-toggle');
const savedTheme = localStorage.getItem('rezaworld-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');

toggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('rezaworld-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

window.addEventListener('load', () => {
  document.querySelector('.preloader')?.classList.add('hidden');
});

if (window.AOS) {
  AOS.init({ duration: 800, once: true, offset: 90 });
}

if (window.gsap) {
  gsap.from('.hero h1, .hero p, .hero .btn', {
    y: 28,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power3.out'
  });
}

const slides = [...document.querySelectorAll('.slide')];
let idx = 0;
if (slides.length) {
  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 3500);
}

const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.port-item');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    const category = button.dataset.filter;
    portfolioItems.forEach((item) => {
      const show = category === 'all' || item.dataset.category === category;
      item.classList.toggle('hide', !show);
    });
  });
});

const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: 36 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.5 + 1,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45
  }));

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(125, 146, 255, 0.28)';
      ctx.fill();
    });
    requestAnimationFrame(render);
  };

  resize();
  render();
  window.addEventListener('resize', resize);
}

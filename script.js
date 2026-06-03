/* =============================================
   MOTOVOLIO — script.js
   ============================================= */

// ─── PARTICLES ────────────────────────────────
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.5;
    this.a  = Math.random() * 0.6 + 0.2;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function init() {
    resize();
    const count = Math.min(Math.floor((W * H) / 10000), 120);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawLine(p1, p2, dist) {
    const alpha = (1 - dist / 130) * 0.25;
    ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Mouse interaction — gentle repel
    particles.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        p.vx += (dx / d) * 0.04;
        p.vy += (dy / d) * 0.04;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) { p.vx /= speed * 0.9; p.vy /= speed * 0.9; }
      }
      p.update();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) drawLine(particles[i], particles[j], d);
      }
    }

    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${p.a})`;
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }

  init();
  loop();

  window.addEventListener('resize', init);
  document.getElementById('greeting').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  document.getElementById('greeting').addEventListener('mouseleave', () => {
    mouse.x = mouse.y = -999;
  });
})();


// ─── TYPING EFFECT ────────────────────────────
(function () {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const phrases = [
    'AI Enthusiast 🤖',
    'Math Lover 🔢',
    'CS Student at BINUS 🎓',
    'Astronomy Geek 🔭',
    'Aspiring Researcher 📖',
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 80);
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 40);
    }
  }
  setTimeout(tick, 600);
})();


// ─── SCROLL REVEAL ────────────────────────────
(function () {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
    observer.observe(el);
  });
})();


// ─── NAVBAR ───────────────────────────────────
document.querySelector('.menu-toggle').addEventListener('click', function () {
  document.querySelector('nav').classList.toggle('active');
});

// Active nav link on scroll
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    document.querySelector('nav').classList.remove('active');
  });
});


// ─── SKILL TABS ───────────────────────────────
document.querySelectorAll('.tab-button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');

    // Re-trigger reveal for newly shown cards
    document.querySelectorAll('#' + btn.dataset.tab + ' .reveal').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), 50);
    });
  });
});


// ─── ACHIEVEMENT CAROUSEL ─────────────────────
(function () {
  const track      = document.querySelector('.carousel-track');
  const slides     = document.querySelectorAll('.achievement-card');
  const indicators = document.querySelectorAll('.indicator');
  let idx = 0;

  function go(n) {
    idx = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    indicators.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  indicators.forEach((d, i) => d.addEventListener('click', () => go(i)));
  go(0);
  setInterval(() => go(idx + 1), 3200);
})();


// ─── TIMELINE REVEAL ──────────────────────────
(function () {
  const items = document.querySelectorAll('.timeline-item');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  items.forEach(el => io.observe(el));
})();


// ─── DARK / LIGHT TOGGLE ──────────────────────
(function () {
  const toggle = document.getElementById('darkModeToggle');
  const label  = document.getElementById('modeLabel');
  const body   = document.body;

  function apply(light) {
    body.classList.toggle('light-mode', light);
    toggle.checked = light;
    label.textContent = light ? 'Light' : 'Dark';
    localStorage.setItem('lightMode', light ? '1' : '0');
  }

  apply(localStorage.getItem('lightMode') === '1');
  toggle.addEventListener('change', () => apply(toggle.checked));
})();

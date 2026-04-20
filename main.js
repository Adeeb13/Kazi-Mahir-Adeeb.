/* ═══════════════════════════════════════════════
   KAZI MAHIR ADEEB — PORTFOLIO
   Main JavaScript · Cosmos · Particles · Aura
═══════════════════════════════════════════════ */

// ─── CUSTOM CURSOR ───
const cursorOrb = document.getElementById('cursorOrb');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorOrb.style.left = mouseX + 'px';
  cursorOrb.style.top  = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// ─── COSMOS CANVAS ───
const canvas = document.getElementById('cosmosCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Stars
const STAR_COUNT = 280;
const stars = Array.from({ length: STAR_COUNT }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.5 + 0.2,
  alpha: Math.random() * 0.8 + 0.1,
  speed: Math.random() * 0.3 + 0.05,
  twinkle: Math.random() * Math.PI * 2,
  twinkleSpeed: Math.random() * 0.02 + 0.005,
  gold: Math.random() < 0.08
}));

// Nebula particles
const nebula = Array.from({ length: 6 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 300 + 150,
  alpha: Math.random() * 0.04 + 0.01,
  hue: Math.random() < 0.4 ? 45 : 220,
  dx: (Math.random() - 0.5) * 0.2,
  dy: (Math.random() - 0.5) * 0.1
}));

let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; });

function drawCosmos(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Nebula
  nebula.forEach(n => {
    n.x += n.dx; n.y += n.dy;
    if (n.x < -n.r) n.x = canvas.width + n.r;
    if (n.x > canvas.width + n.r) n.x = -n.r;
    if (n.y < -n.r) n.y = canvas.height + n.r;
    if (n.y > canvas.height + n.r) n.y = -n.r;

    const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    grd.addColorStop(0, `hsla(${n.hue}, 60%, 50%, ${n.alpha})`);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Stars
  stars.forEach(s => {
    s.twinkle += s.twinkleSpeed;
    const tw = (Math.sin(s.twinkle) + 1) / 2;
    const alpha = s.alpha * (0.5 + tw * 0.5);

    // Parallax on scroll
    const px = s.x;
    const py = (s.y - scrollY * s.speed * 0.3 + canvas.height * 10) % canvas.height;

    ctx.beginPath();
    ctx.arc(px, py, s.r, 0, Math.PI * 2);

    if (s.gold) {
      ctx.fillStyle = `rgba(255, 215, 100, ${alpha})`;
      if (s.r > 1) {
        ctx.shadowColor = 'rgba(255,200,50,0.8)';
        ctx.shadowBlur = 6;
      }
    } else {
      ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Shooting stars
  if (Math.random() < 0.003) spawnShootingStar();
  drawShootingStars();
}

// Shooting stars
const shootingStars = [];
function spawnShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.5,
    vx: (Math.random() * 4 + 3) * (Math.random() < 0.5 ? 1 : -1),
    vy: Math.random() * 3 + 1,
    life: 1, decay: 0.015
  });
}
function drawShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.x += s.vx; s.y += s.vy; s.life -= s.decay;
    if (s.life <= 0) { shootingStars.splice(i, 1); continue; }

    const len = 80 * s.life;
    const grd = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * len / 5, s.y - s.vy * len / 5);
    grd.addColorStop(0, `rgba(255,240,180,${s.life * 0.9})`);
    grd.addColorStop(1, 'transparent');
    ctx.strokeStyle = grd;
    ctx.lineWidth = 1.5 * s.life;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx * len / 5, s.y - s.vy * len / 5);
    ctx.stroke();
  }
}

let frame = 0;
function cosmosLoop() {
  frame++;
  drawCosmos(frame);
  requestAnimationFrame(cosmosLoop);
}
cosmosLoop();

// ─── FLOATING PARTICLES ───
const particleField = document.getElementById('particleField');
const PARTICLE_COUNT = 30;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = document.createElement('div');
  const size = Math.random() * 3 + 1;
  const gold = Math.random() < 0.3;
  p.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: ${gold ? 'rgba(201,168,76,0.6)' : 'rgba(180,200,255,0.3)'};
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    animation: float-particle ${Math.random() * 20 + 15}s linear infinite;
    animation-delay: -${Math.random() * 20}s;
    pointer-events: none;
  `;
  particleField.appendChild(p);
}

// Inject particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes float-particle {
    0% { transform: translate(0,0) scale(1); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 0.6; }
    100% { transform: translate(${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 200 + 50}px, -${Math.random() * 300 + 200}px) scale(0.3); opacity: 0; }
  }
`;
document.head.appendChild(particleStyle);

// ─── NAVIGATION ───
const nav = document.getElementById('mainNav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.section-reveal').forEach(el => revealObserver.observe(el));

// ─── STAGGERED CARD REVEALS ───
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll(
        '.award-card, .prog-card, .project-card, .service-item, .research-item'
      );
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80);
      });
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

// Pre-hide cards
document.querySelectorAll('.award-card, .prog-card, .project-card, .service-item, .research-item').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(25px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.4s, box-shadow 0.4s, background 0.4s';
});

document.querySelectorAll('.awards-grid, .programmes-grid, .projects-grid, .service-grid, .research-list').forEach(grid => {
  cardObserver.observe(grid);
});

// ─── HERO TITLE GLITCH ON HOVER ───
document.querySelectorAll('.name-line').forEach(line => {
  line.addEventListener('mouseenter', () => {
    line.style.textShadow = '2px 0 rgba(255,50,50,0.5), -2px 0 rgba(50,50,255,0.5), 0 0 40px rgba(255,215,0,0.4)';
    setTimeout(() => {
      line.style.textShadow = '';
    }, 200);
  });
});

// ─── ACTIVE NAV LINK ON SCROLL ───
const sections = document.querySelectorAll('section[id]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

// Active nav style
const activeStyle = document.createElement('style');
activeStyle.textContent = `.nav-link.active { color: var(--gold2) !important; }
  .nav-link.active::after { transform: scaleX(1) !important; transform-origin: left !important; }`;
document.head.appendChild(activeStyle);

// ─── TITLE CYCLING ───
const titleItems = document.querySelectorAll('.title-item');
let currentTitle = 0;
setInterval(() => {
  titleItems[currentTitle].classList.remove('active');
  currentTitle = (currentTitle + 1) % titleItems.length;
  titleItems[currentTitle].classList.add('active');
}, 2500);

// Inject title active style
const titleStyle = document.createElement('style');
titleStyle.textContent = `.title-item { transition: color 0.5s ease; }
  .title-item.active { color: var(--gold2) !important; }`;
document.head.appendChild(titleStyle);

// ─── PARALLAX ───
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.35}px)`;
    heroContent.style.opacity = Math.max(0, 1 - scrolled / 600);
  }
  const rings = document.querySelectorAll('.hero-energy-ring');
  rings.forEach((ring, i) => {
    ring.style.transform = `translate(-50%, -50%) scale(${1 + scrolled * 0.0003 * (i + 1)})`;
    ring.style.opacity = Math.max(0, 0.8 - scrolled / 500);
  });
});

// ─── COUNT-UP ANIMATION ───
function countUp(el, target, suffix = '', duration = 1500) {
  const isFloat = target % 1 !== 0;
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = (isFloat ? start.toFixed(1) : Math.floor(start)) + suffix;
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        const text = num.textContent;
        const val = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/[0-9.]/g, '');
        countUp(num, val, suffix);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// ─── GOLD PULSE ON AWARD CARDS ───
document.querySelectorAll('.award-card.tier-gold').forEach(card => {
  let pulse = 0;
  setInterval(() => {
    pulse += 0.05;
    const intensity = (Math.sin(pulse) + 1) / 2;
    card.style.boxShadow = `0 0 ${20 + intensity * 20}px rgba(201,168,76,${0.05 + intensity * 0.08})`;
  }, 50);
});

// ─── CURSOR RIPPLE ON CLICK ───
document.addEventListener('click', (e) => {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    width: 4px; height: 4px;
    background: rgba(201,168,76,0.6);
    border-radius: 50%;
    transform: translate(-50%,-50%);
    pointer-events: none;
    z-index: 9997;
    animation: ripple-expand 0.6s ease forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-expand {
    to { width: 80px; height: 80px; opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

console.log('%c KAZI MAHIR ADEEB ', 'background: #c9a84c; color: #050508; font-size: 1.5rem; font-weight: 900; padding: 0.5rem 1rem;');
console.log('%c Ethical AI Architect · Builder · Independent Researcher ', 'color: #c9a84c; font-size: 0.9rem;');
console.log('%c github.com/Adeeb13 ', 'color: #888; font-size: 0.8rem;');

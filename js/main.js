let isDark = true;
let currentLang = 'es';

// ── THEME ────────────────────────────────────────
function setThemeStorage(value) {
  try {
    localStorage.setItem('ig_theme', value);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') return false;
    throw e;
  }
}
function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  setThemeStorage(isDark ? 'dark' : 'light');
}

// ── LANGUAGE ─────────────────────────────────────
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-lang]').forEach(function(el) {
    el.classList.toggle('active', el.dataset.lang === lang);
  });
  document.querySelectorAll('[data-lang-block]').forEach(function(el) {
    el.classList.toggle('active', el.dataset.langBlock === lang);
  });
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === lang);
  });
  document.documentElement.lang = lang;
}

// ── MOBILE MENU ───────────────────────────────────
function toggleMobileMenu() {
  const h = document.getElementById('hamburger');
  const n = document.getElementById('mobileNav');
  if (h) { h.classList.toggle('open'); h.setAttribute('aria-expanded', h.classList.contains('open')); h.setAttribute('aria-label', h.classList.contains('open') ? 'Cerrar menú' : 'Abrir menú'); }
  if (n) { n.classList.toggle('open'); n.setAttribute('aria-hidden', n.classList.contains('open') ? 'false' : 'true'); }
}
function closeMobile() {
  const h = document.getElementById('hamburger');
  const n = document.getElementById('mobileNav');
  if (h) { h.classList.remove('open'); h.setAttribute('aria-expanded', 'false'); h.setAttribute('aria-label', 'Abrir menú'); }
  if (n) { n.classList.remove('open'); n.setAttribute('aria-hidden', 'true'); }
}

// ── CURSOR ───────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', function(e) {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
});
function animRing() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  if (cursorRing) { cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; }
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a, button, .chip, .stat-cell, .project-card, .timeline-item, .channel, .cert-item').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    if (cursor) cursor.classList.add('hover');
    if (cursorRing) cursorRing.classList.add('hover');
  });
  el.addEventListener('mouseleave', function() {
    if (cursor) cursor.classList.remove('hover');
    if (cursorRing) cursorRing.classList.remove('hover');
  });
});

// ── TYPEWRITER ────────────────────────────────────
const tw = document.getElementById('typewriter');
const twTexts = {
  es: ['& Lead/Senior Frontend Developer', 'Angular/Vue Expert','Microfrontends Specialist'],
  en: ['& Lead/Senior Frontend Developer', 'Angular/Vue Expert','Microfrontends Specialist']
};
let twIdx = 0, twCi = 0, twDel = false;
function typeLoop() {
  const arr = twTexts[currentLang];
  const word = arr[twIdx % arr.length];
  if (twDel) {
    twCi--;
    if (tw) tw.textContent = word.slice(0, twCi);
    if (twCi === 0) { twDel = false; twIdx = (twIdx + 1) % arr.length; }
  } else {
    twCi++;
    if (tw) tw.textContent = word.slice(0, twCi);
    if (twCi === word.length) { twDel = true; setTimeout(typeLoop, 2000); return; }
  }
  setTimeout(typeLoop, twDel ? 45 : 85);
}
const prefersReducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  if (tw) tw.textContent = twTexts[currentLang][0];
} else {
  typeLoop();
}

// ── SCROLL REVEAL ─────────────────────────────────
const revealObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(function(r) { revealObs.observe(r); });

// ── SKILL BAR ANIMATION ──────────────────────────────
const skillObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(function(bar) { bar.classList.add('animate'); });
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-bar-list').forEach(function(el) { skillObs.observe(el); });

// ── FOOTER YEAR ───────────────────────────────────
(function() {
  const y = document.getElementById('footer-year');
  if (y) y.textContent = new Date().getFullYear();
})();

// ── INIT: restore saved preferences ───────────────
(function() {
  function getThemeStorage() {
    try {
      return localStorage.getItem('ig_theme');
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') return null;
      throw e;
    }
  }
  const t = getThemeStorage();
  if (t === 'light') {
    isDark = false;
    document.body.classList.add('light');
  }
})();

// ── ACTIVE NAV SECTION ───────────────────────────────
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)');
const navSections = [];
navLinks.forEach(function(link) {
  const id = link.getAttribute('href').slice(1);
  const section = document.getElementById(id);
  if (section) navSections.push({ link: link, section: section });
});
const activeObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function(l) { l.classList.remove('active'); });
      navSections.forEach(function(ns) {
        if (ns.section === entry.target) ns.link.classList.add('active');
      });
    }
  });
}, { rootMargin: '-20% 0px -60% 0px' });
navSections.forEach(function(ns) { activeObs.observe(ns.section); });

// ── LUCIDE ICONS (deferred for faster initial load) ─
(function() {
  function loadLucide() {
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js';
    s.onload = function() { if (typeof lucide !== 'undefined') lucide.createIcons(); };
    document.body.appendChild(s);
  }
  if ('requestIdleCallback' in globalThis) {
    requestIdleCallback(loadLucide, { timeout: 2000 });
  } else {
    setTimeout(loadLucide, 1);
  }
})();

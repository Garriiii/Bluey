/* ============================================
   CUSTOM CURSOR
============================================ */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

function lerpRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(lerpRing);
}
lerpRing();

document.querySelectorAll('a, button, [data-chip], .skill-tag').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ============================================
   HERO CHIP STAGGER REVEAL
============================================ */
document.querySelectorAll('[data-chip]').forEach((chip, i) => {
  chip.style.opacity = '0';
  chip.style.transform = 'translateY(20px)';
  setTimeout(() => {
    chip.style.transition = 'opacity 0.5s ease, transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
    chip.style.opacity = '1';
    chip.style.transform = 'translateY(0)';
  }, 220 + i * 110);
});

/* ============================================
   DRAGGABLE WORD CHIPS
============================================ */
document.querySelectorAll('[data-chip]').forEach(chip => {
  let dragging = false, sx = 0, sy = 0, cx = 0, cy = 0;

  chip.addEventListener('pointerdown', e => {
    dragging = true;
    chip.style.zIndex = '100';
    chip.style.transition = 'none';
    document.body.classList.add('cursor-hover');
    sx = e.clientX - cx;
    sy = e.clientY - cy;
    chip.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  chip.addEventListener('pointermove', e => {
    if (!dragging) return;
    cx = e.clientX - sx;
    cy = e.clientY - sy;
    chip.style.transform = `translate(${cx}px, ${cy}px) scale(1.07) rotate(-2deg)`;
  });

  function release() {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove('cursor-hover');
    chip.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
    chip.style.transform = 'translate(0,0) scale(1) rotate(0deg)';
    cx = 0; cy = 0;
    setTimeout(() => { chip.style.zIndex = ''; chip.style.transition = ''; }, 600);
  }
  chip.addEventListener('pointerup', release);
  chip.addEventListener('pointercancel', release);
});

/* ============================================
   SCROLL REVEAL
============================================ */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

/* ============================================
   MAGNETIC BUTTONS
============================================ */
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-hire, .contact-email-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ============================================
   COPY EMAIL
============================================ */
function copyEmail() {
  const email = 'oginnikayode05@gmail.com'; // Replace with your real email
  const copy = text => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(showToast).catch(() => fallback(text));
    } else { fallback(text); }
  };
  const fallback = text => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast();
  };
  copy(email);
}

function showToast() {
  const toast = document.getElementById('toast');
  const feedback = document.getElementById('copy-feedback');
  const btn = document.getElementById('email-btn-text');
  toast.classList.add('show');
  feedback.classList.add('show');
  if (btn) btn.textContent = 'Copied! \u2713';
  setTimeout(() => {
    toast.classList.remove('show');
    feedback.classList.remove('show');
    if (btn) btn.textContent = 'Copy my email';
  }, 3200);
}

/* ============================================
   ACTIVE NAV LINK HIGHLIGHT
============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) current = s.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--cyan-500)'
      : '';
    link.style.background = link.getAttribute('href') === '#' + current
      ? 'var(--cyan-glow)'
      : '';
  });
}, { passive: true });
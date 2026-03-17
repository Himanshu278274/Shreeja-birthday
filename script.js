// ── STARS ──
const sc = document.getElementById('star-canvas');
const sx = sc.getContext('2d');
let stars = [];

function rsz() {
  sc.width = innerWidth;
  sc.height = innerHeight;
}

function initS() {
  stars = [];
  for (let i = 0; i < 140; i++) {
    stars.push({
      x: Math.random() * sc.width,
      y: Math.random() * sc.height,
      r: Math.random() * 1.3 + 0.2,
      a: Math.random(),
      s: Math.random() * 0.004 + 0.002,
      d: Math.random() > 0.5 ? 1 : -1
    });
  }
}

function drawS() {
  sx.clearRect(0, 0, sc.width, sc.height);
  stars.forEach(s => {
    s.a += s.s * s.d;
    if (s.a >= 1 || s.a <= 0) s.d *= -1;
    sx.beginPath();
    sx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sx.fillStyle = `rgba(253,230,138,${s.a})`;
    sx.fill();
  });
  requestAnimationFrame(drawS);
}

rsz(); initS(); drawS();
window.addEventListener('resize', () => { rsz(); initS(); });


// ── HERO FADE on load ──
setTimeout(() => {
  document.querySelectorAll('#hero .fade-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 120);
  });
}, 100);


// ── COUNTDOWN ──
function tick() {
  const diff = new Date('2026-03-19T00:00:00') - new Date();

  if (diff <= 0) {
    document.getElementById('timer-row').style.display = 'none';
    document.getElementById('bday-now').style.display = 'block';
    document.getElementById('bday-now').classList.add('visible');
    launchConfetti();
    return;
  }

  const d = Math.floor(diff / 864e5);
  const h = Math.floor(diff % 864e5 / 36e5);
  const m = Math.floor(diff % 36e5 / 6e4);
  const s = Math.floor(diff % 6e4 / 1e3);

  document.getElementById('cd-d').textContent = String(d).padStart(2, '0');
  document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
}

tick();
setInterval(tick, 1000);


// ── SCROLL OBSERVE ──
const obs = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up, .letter-card, .photo-wrap').forEach(el => obs.observe(el));

const cardObs = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      const d = parseInt(e.target.dataset.delay || 0) * 120;
      setTimeout(() => e.target.classList.add('visible'), d);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.wish-item').forEach(el => cardObs.observe(el));


// ── BLOW CANDLES ──
function blowCandles() {
  ['f1', 'f2', 'f3'].forEach((id, i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      el.style.transition = 'opacity 0.3s';
      el.style.opacity = '0';
    }, i * 180);
  });

  setTimeout(() => {
    document.getElementById('blow-msg').classList.add('show');
    document.getElementById('blow-btn').textContent = '🎉 Wish ho gayi!';
    document.getElementById('blow-btn').disabled = true;
    launchConfetti();
  }, 700);
}


// ── CONFETTI ──
const cc = document.getElementById('confetti-canvas');
const cx = cc.getContext('2d');
let pieces = [], cOn = false;

function launchConfetti() {
  cc.style.display = 'block';
  cc.width = innerWidth;
  cc.height = innerHeight;
  cOn = true;
  pieces = [];

  const cols = ['#f472b6', '#fbbf24', '#a78bfa', '#fb7185', '#fde68a', '#86efac'];
  for (let i = 0; i < 130; i++) {
    pieces.push({
      x: Math.random() * cc.width,
      y: Math.random() * -cc.height,
      w: Math.random() * 11 + 4,
      h: Math.random() * 6 + 2,
      c: cols[~~(Math.random() * cols.length)],
      vx: (Math.random() - .5) * 4,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      rv: (Math.random() - .5) * 8
    });
  }
  animC();
}

function animC() {
  if (!cOn) return;
  cx.clearRect(0, 0, cc.width, cc.height);
  let alive = false;

  pieces.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.rot += p.rv;
    if (p.y < cc.height + 20) alive = true;
    cx.save();
    cx.translate(p.x, p.y);
    cx.rotate(p.rot * Math.PI / 180);
    cx.fillStyle = p.c;
    cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    cx.restore();
  });

  if (alive) requestAnimationFrame(animC);
  else { cc.style.display = 'none'; cOn = false; }
}
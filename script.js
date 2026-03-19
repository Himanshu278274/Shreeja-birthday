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


// ── CONFETTI ── (sabse pehle define — baaki sab ispe depend karta hai)
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


// ── MUSIC AUTOPLAY ──
const music = document.getElementById('bg-music');
music.volume = 0.3;
document.addEventListener('click', function startMusic() {
  music.play();
  document.removeEventListener('click', startMusic);
}, { once: true });


// ── TYPING ANIMATION ──
const heroTitle = document.querySelector('.hero-title');
const heroName  = document.querySelector('.hero-name');
const titleText = heroTitle.textContent;
const nameText  = heroName.textContent;
heroTitle.textContent = '';
heroName.textContent  = '';

let ti = 0;
function typeTitle() {
  if (ti < titleText.length) {
    heroTitle.textContent += titleText[ti++];
    setTimeout(typeTitle, 75);
  } else {
    heroTitle.classList.add('visible');
    let j = 0;
    function typeName() {
      if (j < nameText.length) {
        heroName.textContent += nameText[j++];
        setTimeout(typeName, 75);
      } else {
        heroName.classList.add('visible');
      }
    }
    setTimeout(typeName, 200);
  }
}
setTimeout(typeTitle, 500);


// ── HERO FADE on load ──
setTimeout(() => {
  document.querySelectorAll('#hero .fade-up').forEach(el => {
    if (el !== heroTitle && el !== heroName)
      el.classList.add('visible');
  });
}, 100);


// ── SURPRISE POPUP (19 March only) ──
const _today = new Date();
if (_today.getDate() === 19 && _today.getMonth() === 2) {
  setTimeout(() => {
    const popup = document.createElement('div');
    popup.id = 'surprise-popup';
    popup.innerHTML = `
      <div style="position:fixed;inset:0;z-index:999;background:rgba(10,0,15,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px;animation:fadeInPop 1s ease;">
        <div style="font-size:3rem;margin-bottom:16px;">🎂✨🎉</div>
        <h1 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2.5rem,8vw,5rem);background:linear-gradient(135deg,#fde68a,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:12px;line-height:1.1;">Aaj tera din hai<br>Shreeja! 🎂</h1>
        <p style="color:rgba(249,168,212,0.7);font-size:1rem;margin-bottom:32px;max-width:320px;line-height:1.8;">Teri zindagi mein hamesha khushiyan rahen.<br>Happy Birthday! 💕</p>
        <button onclick="document.getElementById('surprise-popup').remove()" style="padding:14px 40px;border:1px solid rgba(244,114,182,0.5);background:transparent;color:#f9a8d4;border-radius:50px;font-size:1rem;cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:0.05em;">Enter ✨</button>
      </div>`;
    document.body.appendChild(popup);
    launchConfetti();
  }, 800);
}


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
  const btn = document.getElementById('blow-btn');
  btn.disabled = true;
  btn.textContent = '💨 Bujh rahi hain...';

  ['f1', 'f2', 'f3'].forEach((id, i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      el.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
      el.style.opacity = '0';
      el.style.transform = 'scaleY(0.1) translateY(10px)';

      const canvasEl = document.querySelector('.cake-svg');
      const smokeX = [104.5, 140.5, 176.5][i];
      const smoke = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      smoke.setAttribute('cx', smokeX);
      smoke.setAttribute('cy', '80');
      smoke.setAttribute('rx', '6');
      smoke.setAttribute('ry', '4');
      smoke.setAttribute('fill', 'rgba(255,255,255,0.25)');
      smoke.style.transition = 'all 1s ease';
      canvasEl.appendChild(smoke);
      setTimeout(() => {
        smoke.setAttribute('ry', '12');
        smoke.setAttribute('rx', '10');
        smoke.style.opacity = '0';
        smoke.style.transform = 'translateY(-20px)';
      }, 50);
      setTimeout(() => smoke.remove(), 1200);
    }, i * 500);
  });

  setTimeout(() => {
    const svg = document.querySelector('.cake-svg');
    const hbd = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    hbd.setAttribute('x', '140');
    hbd.setAttribute('y', '170');
    hbd.setAttribute('text-anchor', 'middle');
    hbd.setAttribute('font-size', '13');
    hbd.setAttribute('font-family', 'Cormorant Garamond, serif');
    hbd.setAttribute('font-style', 'italic');
    hbd.setAttribute('fill', '#fde68a');
    hbd.setAttribute('opacity', '0');
    hbd.textContent = 'HBD Shreeja ✨';
    svg.appendChild(hbd);

    let op = 0;
    const glowIn = setInterval(() => {
      op += 0.05;
      hbd.setAttribute('opacity', op);
      if (op >= 1) clearInterval(glowIn);
    }, 40);

    let growing = true;
    setInterval(() => {
      const cur = parseFloat(hbd.getAttribute('opacity'));
      if (growing) {
        hbd.setAttribute('opacity', Math.min(cur + 0.02, 1));
        if (cur >= 1) growing = false;
      } else {
        hbd.setAttribute('opacity', Math.max(cur - 0.02, 0.5));
        if (cur <= 0.5) growing = true;
      }
    }, 50);

    document.getElementById('blow-msg').classList.add('show');
    btn.textContent = '🎉 Wish ho gayi!';

    launchConfetti();
    setTimeout(launchConfetti, 600);
    setTimeout(launchConfetti, 1200);

    setTimeout(() => {
      const popup = document.createElement('div');
      popup.id = 'wish-popup';
      popup.innerHTML = `
        <div style="position:fixed;inset:0;z-index:998;display:flex;align-items:center;justify-content:center;background:rgba(10,0,15,0.85);animation:fadeInPop 0.6s ease;padding:24px;" onclick="this.parentElement.remove()">
          <div style="background:linear-gradient(145deg,#1a0010,#2d0020);border:1px solid rgba(244,114,182,0.3);border-radius:28px;padding:40px 32px;text-align:center;max-width:360px;width:100%;">
            <div style="font-size:2.5rem;margin-bottom:16px;">🎂✨🎊</div>
            <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-style:italic;background:linear-gradient(135deg,#fde68a,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:14px;line-height:1.2;">Wish kar Motki!</h2>
            <p style="color:rgba(249,168,212,0.75);font-size:0.92rem;line-height:1.8;margin-bottom:28px;">Mombatti bujh gayi — ab jo wish ki hai<br>woh zaroor poori hogi. 💕</p>
            <button onclick="document.getElementById('wish-popup').remove()" style="padding:12px 32px;border:1px solid rgba(244,114,182,0.4);background:transparent;color:#f9a8d4;border-radius:50px;font-size:0.9rem;cursor:pointer;font-family:'DM Sans',sans-serif;">Shukriya ✨</button>
          </div>
        </div>`;
      document.body.appendChild(popup);
    }, 1500);
  }, 2200);
}
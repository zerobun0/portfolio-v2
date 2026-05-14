/* ======================================================
   main.js — custom cursor, nav, page transitions, AOS
====================================================== */

// ── Custom Cursor ─────────────────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
});

(function animRing() {
  if (ring) {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .folder-card, .filter-tab, [role="button"]').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ── Active Nav Link ───────────────────────────────────
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// ── Mobile Nav Toggle ─────────────────────────────────
const nav  = document.querySelector('.nav');
const burg = document.querySelector('.nav-hamburger');
if (burg) {
  burg.addEventListener('click', () => nav.classList.toggle('menu-open'));
}
document.querySelectorAll('.nav-mobile a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('menu-open'));
});

// ── Page Transitions ──────────────────────────────────
function goTo(url) {
  const ov = document.getElementById('page-overlay');
  if (!ov) { window.location.href = url; return; }
  ov.classList.add('entering');
  setTimeout(() => { window.location.href = url; }, 480);
}

document.querySelectorAll('a[href]').forEach(a => {
  const h = a.getAttribute('href');
  if (!h.startsWith('#') && !h.startsWith('http') &&
      !h.startsWith('mailto') && !h.startsWith('tel')) {
    a.addEventListener('click', e => { e.preventDefault(); goTo(h); });
  }
});

window.addEventListener('load', () => {
  const ov = document.getElementById('page-overlay');
  if (ov) ov.classList.remove('entering');
});

// ── Simple AOS (Animate On Scroll) fallback ───────────
(function initAOS() {
  if (typeof AOS !== 'undefined') return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('aos-animate'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-aos]').forEach(el => io.observe(el));
})();

// ── Lo-fi Music Player (YouTube IFrame API) ──────────
(function initMusicPlayer() {
  const widget    = document.getElementById('music-widget');
  const openBtn   = document.getElementById('music-btn');
  const panel     = document.getElementById('music-panel');
  const playPause = document.getElementById('music-play-pause');
  const prevBtn   = document.getElementById('music-prev');
  const nextBtn   = document.getElementById('music-next');
  const muteBtn   = document.getElementById('music-mute');
  const trackName = document.getElementById('music-track-name');
  if (!openBtn || !panel) return;

  const TRACKS = [
    { id: 'jfKfPfyJRdk', name: 'Lofi Hip Hop Radio' },
    { id: 'rUxyKA_-grg', name: 'Sleep / Chill Beats' },
    { id: '5qap5aO4i9A', name: 'Chillhop Radio'      },
  ];

  let idx       = 0;
  let isOpen    = false;
  let isPlaying = false;
  let isMuted   = false;
  let ytPlayer  = null;
  let ytReady   = false;

  function setActive(state) {
    isPlaying = state;
    if (widget) widget.classList.toggle('active', state);
    openBtn.classList.toggle('playing', state);
    if (playPause) playPause.textContent = state ? '⏸' : '▶';
  }

  function updateName() {
    if (trackName) trackName.textContent = TRACKS[idx].name;
  }

  function buildPlayer() {
    if (ytPlayer) return;
    const el = document.getElementById('yt-player-hidden');
    if (!el) return;
    ytPlayer = new YT.Player(el, {
      height: '1', width: '1',
      videoId: TRACKS[0].id,
      playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, playsinline: 1 },
      events: {
        onReady()       { ytReady = true; },
        onStateChange(e) {
          if (e.data === YT.PlayerState.PLAYING) setActive(true);
          if (e.data === YT.PlayerState.PAUSED)  setActive(false);
          if (e.data === YT.PlayerState.ENDED) {
            idx = (idx + 1) % TRACKS.length;
            updateName();
            ytPlayer.loadVideoById(TRACKS[idx].id);
          }
        }
      }
    });
  }

  /* Load API eagerly so player is ready before user clicks */
  if (window.YT && window.YT.Player) {
    buildPlayer();
  } else {
    window.onYouTubeIframeAPIReady = buildPlayer;
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }

  openBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen && !isPlaying && ytReady) {
      ytPlayer.loadVideoById(TRACKS[idx].id);
    }
  });

  if (playPause) playPause.addEventListener('click', () => {
    if (!ytReady) return;
    if (isPlaying) ytPlayer.pauseVideo();
    else           ytPlayer.loadVideoById(TRACKS[idx].id);
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (!ytReady) return;
    idx = (idx + 1) % TRACKS.length;
    updateName();
    ytPlayer.loadVideoById(TRACKS[idx].id);
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (!ytReady) return;
    idx = (idx - 1 + TRACKS.length) % TRACKS.length;
    updateName();
    ytPlayer.loadVideoById(TRACKS[idx].id);
  });

  if (muteBtn) muteBtn.addEventListener('click', () => {
    if (!ytReady) return;
    isMuted = !isMuted;
    if (isMuted) { ytPlayer.mute();   muteBtn.textContent = '🔇'; }
    else         { ytPlayer.unMute(); muteBtn.textContent = '🔊'; }
  });

  updateName();
})();

// ── Page View Counter ─────────────────────────────────
(function () {
  const el = document.getElementById('view-count');
  if (!el) return;
  fetch('https://api.countapi.xyz/hit/zerobun0.github.io/visits')
    .then(r => r.json())
    .then(d => { if (d && d.value) el.textContent = d.value.toLocaleString(); })
    .catch(() => { el.textContent = '—'; });
})();

// ── Ripped Note → Portfolio ───────────────────────────
(function () {
  const note = document.querySelector('.scatter-note');
  if (!note) return;
  note.addEventListener('click', () => goTo('portfolio.html'));
  note.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  note.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
})();

// ── Interactive Terminal ──────────────────────────────
(function initTerminal() {
  const trigger  = document.querySelector('.scatter-terminal');
  const overlay  = document.getElementById('terminal-overlay');
  const closeBtn = document.getElementById('terminal-close');
  const body     = document.getElementById('terminal-body');
  const inp      = document.getElementById('terminal-inp');
  const cwdEl    = document.getElementById('terminal-cwd');
  if (!trigger || !overlay) return;

  const ROOT = '~/projects';
  const FS = {
    'space-bun':    { files: ['main.py','game.py','menu.py','levels.py','ranking.py','README.md'],        readme: 'Python game — full menu, multiple modes, level & ranking progression engine.' },
    'vaultly':      { files: ['index.html','style.css','app.js','transactions.js','investments.js','README.md'], readme: 'Personal finance app — transactions, investments, savings goals & tax insights.' },
    'tailortech':   { files: ['index.html','style.css','fitcheck.js','studio.js','insights.js','README.md'],    readme: 'AI fashion app — fit check, body measurements studio, size insights dashboard.' },
    'visit-jordan': { files: ['index.html','destinations.html','quiz.html','assistant.html','style.css','README.md'], readme: 'Tourism site for Jordan — destinations, AI travel assistant, and interactive quiz.' },
    'dog-hotel':    { files: ['index.html','services.html','packages.html','gallery.html','style.css','README.md'],  readme: 'Pet hotel booking site — services, packages, photo gallery, and contact form.' },
    'calculator':   { files: ['index.html','style.css','calc.js','README.md'],                            readme: 'JS calculator — arithmetic, keyboard input, clean minimal design.' },
  };

  let cwd     = ROOT;
  let hist    = [];
  let histIdx = -1;

  function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function line(text, cls) {
    const el = document.createElement('div');
    el.className = 'terminal-line ' + (cls || '');
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function welcome() {
    line('  tarek@dev  —  zsh  5.9  ', 't-acc');
    line("type 'help' for available commands", 't-dim');
    line('', '');
  }

  function run(raw) {
    const cmd   = raw.trim();
    const parts = cmd.split(/\s+/);
    const op    = parts[0];

    const el = document.createElement('div');
    el.className = 'terminal-line t-cmd';
    el.innerHTML = '<span class="t-prompt">' + esc(cwd) + ' $ </span>' + esc(cmd);
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;

    if (!cmd) return;

    const inProj = cwd !== ROOT;
    const proj   = inProj ? cwd.replace(ROOT + '/', '') : null;

    switch (op) {
      case 'help':
        line('  whoami       — about me',            't-dim');
        line('  ls           — list contents',        't-dim');
        line('  cd <project> — open a project folder','t-dim');
        line('  cd ..        — back to ~/projects',   't-dim');
        line('  cat README.md— view description',     't-dim');
        line('  pwd          — show current path',    't-dim');
        line('  clear        — clear terminal',       't-dim');
        line('  exit         — close terminal',       't-dim');
        break;
      case 'whoami':
        line('tarek ahmed umar', '');
        line('cs student · web developer · cisco certified ×9', 't-dim');
        line('barking & dagenham college · 2025–2026', 't-dim');
        break;
      case 'pwd':
        line(cwd, '');
        break;
      case 'ls': {
        const items = inProj ? FS[proj].files : Object.keys(FS).map(k => k + '/');
        items.forEach(f => line(f, f.endsWith('/') ? 't-dir' : 't-file'));
        break;
      }
      case 'cd':
        if (!parts[1] || parts[1] === '..' || parts[1] === '~') {
          cwd = ROOT;
        } else {
          const t = parts[1].replace(/\/$/, '');
          if (FS[t]) { cwd = ROOT + '/' + t; }
          else { line('cd: no such directory: ' + parts[1], 't-err'); }
        }
        if (cwdEl) cwdEl.textContent = cwd;
        break;
      case 'cat':
        if (!parts[1]) { line('usage: cat <filename>', 't-err'); break; }
        if (parts[1] === 'README.md') {
          line(inProj && FS[proj] ? FS[proj].readme : 'Personal portfolio — 6 GitHub projects, 9 Cisco certs.', '');
        } else {
          line('cat: ' + parts[1] + ': no such file', 't-err');
        }
        break;
      case 'clear':
        body.innerHTML = '';
        return;
      case 'exit':
        closeTerminal();
        return;
      default:
        line('zsh: command not found: ' + op, 't-err');
        line("type 'help' for available commands", 't-dim');
    }
    body.scrollTop = body.scrollHeight;
  }

  function openTerminal() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (!body.children.length) welcome();
    setTimeout(() => inp && inp.focus(), 280);
  }

  function closeTerminal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', openTerminal);
  trigger.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  trigger.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));

  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeTerminal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeTerminal();
  });

  if (inp) {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const v = inp.value;
        if (v.trim()) hist.unshift(v);
        histIdx = -1;
        inp.value = '';
        run(v);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (histIdx < hist.length - 1) inp.value = hist[++histIdx];
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        histIdx > 0 ? (inp.value = hist[--histIdx]) : (histIdx = -1, inp.value = '');
      }
    });
    body.addEventListener('click', () => inp.focus());
  }
})();

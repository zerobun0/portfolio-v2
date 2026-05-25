/* ======================================================
   portfolio.js — filter tabs, folder cards, detail panel,
                  carousels, lightbox
====================================================== */

window.initPortfolio = function () {

// ── Cert data ─────────────────────────────────────────
const CERTS = {
  'it-essentials': {
    name:'IT Essentials', issuer:'Cisco Networking Academy',
    category:'Hardware & Software', level:'Foundational', icon:'💻', color:'#4A90D9',
    badge:'assets/images/cisco/it-essentials.png',
    certPdf: null,
    desc:'Covers fundamental computer hardware and software skills, including installation, configuration, and troubleshooting of personal computers and mobile devices.',
    skills:['Computer Hardware','Windows OS','Mobile Devices','Troubleshooting','Preventive Maintenance'],
  },
  'hardware-upgrade': {
    name:'Hardware and Upgrade Support', issuer:'Cisco Networking Academy',
    category:'Hardware', level:'Foundational', icon:'🔧', color:'#7B5EA7',
    badge:'assets/images/cisco/hardware-upgrade.png',
    certPdf:'assets/certs/cisco/hardware-upgrade-support.pdf',
    desc:'Focuses on diagnosing, upgrading, and maintaining PC hardware components, including CPUs, RAM, storage, and peripheral devices.',
    skills:['Component Identification','System Upgrades','Peripheral Setup','BIOS / UEFI','Storage Management'],
  },
  'os-support': {
    name:'Operating Systems Support', issuer:'Cisco Networking Academy',
    category:'Software', level:'Foundational', icon:'🖥️', color:'#2E9E6B',
    badge:'assets/images/cisco/os-support.png',
    certPdf:'assets/certs/cisco/os-support.pdf',
    desc:'Covers installation, configuration, and troubleshooting of multiple operating systems, including Windows 10/11 and basic Linux environments.',
    skills:['Windows Administration','Linux Basics','File Systems','User Accounts','CLI Tools'],
  },
  'security-connectivity': {
    name:'Security & Connectivity Support', issuer:'Cisco Networking Academy',
    category:'Security & Networking', level:'Intermediate', icon:'🔐', color:'#D97B4A',
    badge:'assets/images/cisco/security-connectivity.png',
    certPdf:'assets/certs/cisco/security-connectivity-support.pdf',
    desc:'Introduces network security principles and hands-on skills for protecting systems, configuring firewalls, and securing wireless connections.',
    skills:['Network Security','Firewall Config','VPN Basics','Wireless Security','Password Policies'],
  },
  'customer-support': {
    name:'IT Customer Support Basics', issuer:'Cisco Networking Academy',
    category:'Customer Service', level:'Foundational', icon:'🎧', color:'#D4547A',
    badge:'assets/images/cisco/customer-support.png',
    certPdf:'assets/certs/cisco/it-customer-support-basics.pdf',
    desc:'Develops professional IT support skills including communication, documentation, ticketing systems, and customer-facing problem resolution techniques.',
    skills:['Help Desk Skills','Communication','Ticketing Systems','Documentation','Problem Resolution'],
  },
  'js-essentials': {
    name:'JavaScript Essentials 1', issuer:'Cisco Networking Academy',
    category:'Programming', level:'Foundational', icon:'⚡', color:'#C9A227', dk:true,
    badge:'assets/images/cisco/js-essentials.png',
    certPdf:'assets/certs/cisco/javascript-essentials-1.pdf',
    desc:'Introduces JavaScript programming fundamentals including variables, functions, control structures, DOM manipulation, and browser-based scripting.',
    skills:['JS Syntax','DOM Manipulation','Functions','Control Flow','Data Types'],
  },
  'iot-intro': {
    name:'Introduction to IoT', issuer:'Cisco Networking Academy',
    category:'IoT & Emerging Tech', level:'Awareness', icon:'📡', color:'#3BAA8A',
    badge:'assets/images/cisco/iot-intro.png',
    certPdf:'assets/certs/cisco/introduction-to-iot.pdf',
    desc:'Explores the Internet of Things ecosystem — connected devices, sensors, data analytics, and the impact of IoT across industries.',
    skills:['IoT Concepts','Sensors & Actuators','Data Analytics','Smart Systems','Connectivity Protocols'],
  },
  'network-tech': {
    name:'Network Technician Career Path', issuer:'Cisco Networking Academy',
    category:'Networking', level:'Career Path', icon:'🌐', color:'#3476C0',
    badge:'assets/images/cisco/network-tech.png',
    certPdf:'assets/certs/cisco/network-technician-career-path.pdf',
    desc:'A comprehensive career pathway covering essential networking skills, TCP/IP protocols, routing, switching, and hands-on Cisco device configuration.',
    skills:['TCP/IP','Routing & Switching','Network Design','Cisco IOS','Troubleshooting'],
  },
  'cybersecurity': {
    name:'Junior Cybersecurity Analyst', issuer:'Cisco Networking Academy',
    category:'Cybersecurity', level:'Career Path', icon:'🛡️', color:'#5B3FA0',
    badge:'assets/images/cisco/cybersecurity.png',
    certPdf:'assets/certs/cisco/junior-cybersecurity-analyst.pdf',
    desc:'Prepares students for entry-level cybersecurity analyst roles with hands-on training in threat detection, security operations, and incident response.',
    skills:['Threat Analysis','SIEM Tools','Incident Response','Security Monitoring','Network Forensics'],
  },
};

// ── Filter Tabs ───────────────────────────────────────
const tabs        = document.querySelectorAll('.filter-tab');
const secAll      = document.getElementById('section-all');
const secCerts    = document.getElementById('section-certs');
const secProjects = document.getElementById('section-projects');
const secUnits    = document.getElementById('section-units');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.filter;
    const show = el => el && el.classList.remove('hidden');
    const hide = el => el && el.classList.add('hidden');
    if (f === 'all') {
      show(secAll); show(secCerts); show(secProjects); show(secUnits);
    } else if (f === 'certs') {
      hide(secAll); show(secCerts); hide(secProjects); hide(secUnits);
    } else if (f === 'projects') {
      hide(secAll); hide(secCerts); show(secProjects); hide(secUnits);
    } else if (f === 'units') {
      hide(secAll); hide(secCerts); hide(secProjects); show(secUnits);
    }
  });
});

// ── Detail Panel ──────────────────────────────────────
const panel    = document.getElementById('detail-panel');
const overlay  = document.getElementById('detail-overlay');
const btnClose = document.getElementById('detail-close');

function openPanel(certKey) {
  const c = CERTS[certKey];
  if (!c || !panel) return;
  panel.querySelector('#dp-cert-name').textContent   = c.name;
  panel.querySelector('#dp-cert-issuer').textContent = c.issuer;
  panel.querySelector('#dp-cert-cat').textContent    = c.category;
  panel.querySelector('#dp-cert-level').textContent  = c.level;
  panel.querySelector('#dp-cert-desc').textContent   = c.desc;
  const badgeImg = panel.querySelector('#dp-badge-img');
  if (badgeImg && c.badge) { badgeImg.src = c.badge; badgeImg.alt = c.name + ' badge'; badgeImg.style.display = 'block'; }
  const ft = panel.querySelector('#dp-folder-tab');
  const fb = panel.querySelector('#dp-folder-body');
  const fi = panel.querySelector('#dp-folder-icon');
  if (ft) ft.style.background = c.color;
  if (fb) fb.style.background = c.color;
  if (fi) fi.textContent = c.icon;
  panel.querySelector('#dp-skills').innerHTML = c.skills.map(s => `<span class="detail-skill-tag">${s}</span>`).join('');

  // Certificate PDF preview iframe
  const pdfPreview = panel.querySelector('#dp-pdf-preview');
  const pdfFrame   = panel.querySelector('#dp-pdf-frame');
  if (pdfPreview && pdfFrame) {
    if (c.certPdf) {
      pdfFrame.src = c.certPdf;
      pdfPreview.classList.add('show');
    } else {
      pdfFrame.src = '';
      pdfPreview.classList.remove('show');
    }
  }

  // Certificate PDF link (keep as download fallback)
  let pdfLink = panel.querySelector('#dp-cert-pdf');
  if (!pdfLink) {
    pdfLink = document.createElement('a');
    pdfLink.id = 'dp-cert-pdf';
    pdfLink.style.cssText = [
      'display:inline-flex','align-items:center','gap:6px',
      'font-family:var(--f-mono)','font-size:12px','font-weight:600',
      'padding:8px 16px','border-radius:7px','margin-top:16px',
      'background:rgba(216,108,61,0.1)','border:1.5px solid var(--accent)',
      'color:var(--accent)','text-decoration:none',
      'transition:background .2s,color .2s'
    ].join(';');
    pdfLink.target = '_blank';
    pdfLink.rel = 'noopener';
    panel.querySelector('.detail-panel-body').appendChild(pdfLink);
  }
  if (c.certPdf) {
    pdfLink.href = c.certPdf;
    pdfLink.textContent = '↗ Open Full Certificate';
    pdfLink.style.display = 'inline-flex';
  } else {
    pdfLink.style.display = 'none';
  }

  panel.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  if (panel) panel.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
  // Unload PDF iframe to stop background rendering
  setTimeout(() => {
    const pf = document.getElementById('dp-pdf-frame');
    if (pf) pf.src = '';
  }, 350);
}

document.querySelectorAll('.folder-card[data-cert]').forEach(card => {
  card.addEventListener('click', () => openPanel(card.dataset.cert));
});
if (btnClose) btnClose.addEventListener('click', closePanel);
if (overlay)  overlay.addEventListener('click', closePanel);

// ── Image Carousels ────────────────────────────────────
document.querySelectorAll('.project-img-wrap[data-carousel]').forEach(wrap => {
  const track    = wrap.querySelector('.carousel-track');
  const slides   = wrap.querySelectorAll('.carousel-slide');
  const dotsWrap = wrap.querySelector('.carousel-dots');
  const prevBtn  = wrap.querySelector('.carousel-btn.prev');
  const nextBtn  = wrap.querySelector('.carousel-btn.next');
  if (!track || slides.length < 2) return;

  let current = 0;
  let timer   = null;
  const count = slides.length;

  /* Build dots */
  dotsWrap.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', e => { e.stopPropagation(); go(i); resetTimer(); });
    dotsWrap.appendChild(dot);
  });

  /* Measure wrap and pin every slide to that exact pixel width */
  function applyWidths() {
    const w = wrap.getBoundingClientRect().width || wrap.offsetWidth || 272;
    slides.forEach(s => { s.style.width = w + 'px'; s.style.minWidth = w + 'px'; });
    track.style.width = (count * w) + 'px';
    return w;
  }

  function go(idx) {
    current = ((idx % count) + count) % count;
    const w = wrap.getBoundingClientRect().width || wrap.offsetWidth || 272;
    track.style.transform = 'translateX(-' + (current * w) + 'px)';
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 3600);
  }

  if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); go(current - 1); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); go(current + 1); resetTimer(); });

  const card = wrap.closest('.project-card');
  if (card) {
    card.addEventListener('mouseenter', () => clearInterval(timer));
    card.addEventListener('mouseleave', () => resetTimer());
  }

  /* Re-pin widths on window resize */
  window.addEventListener('resize', () => { applyWidths(); go(current); }, { passive: true });

  /* Touch swipe support */
  let touchStartX = 0;
  wrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { go(dx < 0 ? current + 1 : current - 1); }
    resetTimer();
  }, { passive: true });

  /* Init: wait for layout paint then pin widths and go to slide 0 */
  requestAnimationFrame(() => {
    applyWidths();
    go(0);
    resetTimer();
  });
});

// ── Image Lightbox ────────────────────────────────────
const lb      = document.getElementById('img-lightbox');
const lbImg   = document.getElementById('lightbox-img');
const lbClose = document.getElementById('lightbox-close');
const lbPrev  = document.getElementById('lightbox-prev');
const lbNext  = document.getElementById('lightbox-next');

if (lb && lbImg) {
  let currentSlides = [];
  let lbIdx = 0;

  function openLightbox(slides, idx) {
    currentSlides = slides;
    lbIdx = ((idx % slides.length) + slides.length) % slides.length;
    lbImg.src = slides[lbIdx];
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lbPrev) lbPrev.style.display = slides.length > 1 ? '' : 'none';
    if (lbNext) lbNext.style.display = slides.length > 1 ? '' : 'none';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 260);
  }

  function navLightbox(dir) {
    lbIdx = ((lbIdx + dir) + currentSlides.length) % currentSlides.length;
    lbImg.src = currentSlides[lbIdx];
  }

  document.querySelectorAll('.project-img-wrap').forEach(wrap => {
    const imgs = Array.from(wrap.querySelectorAll('.carousel-slide img'));
    if (!imgs.length) return;
    const srcs = imgs.map(img => img.src);
    function activeIdx() {
      const track = wrap.querySelector('.carousel-track');
      if (!track) return 0;
      const tx = track.style.transform;
      const m  = tx.match(/translateX\(-?([\d.]+)px\)/);
      if (!m) return 0;
      const w = wrap.offsetWidth || 272;
      return Math.round(parseFloat(m[1]) / w);
    }
    imgs.forEach(img => {
      img.addEventListener('click', e => { e.stopPropagation(); openLightbox(srcs, activeIdx()); });
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  if (lbPrev) lbPrev.addEventListener('click', () => navLightbox(-1));
  if (lbNext) lbNext.addEventListener('click', () => navLightbox(1));

  /* ESC / arrow keys — use a named handler so we can remove it on re-init */
  if (window._lbKeyHandler) document.removeEventListener('keydown', window._lbKeyHandler);
  window._lbKeyHandler = e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  };
  document.addEventListener('keydown', window._lbKeyHandler);
}

// ── Document Viewer ────────────────────────────────────
(function initDocViewer() {
  const dvOverlay = document.getElementById('dv-overlay');
  const dvModal   = document.getElementById('dv-modal');
  const dvClose   = document.getElementById('dv-close');
  const dvFrame   = document.getElementById('dv-frame');
  const dvTitle   = document.getElementById('dv-title');
  const dvUnit    = document.getElementById('dv-unit-label');
  const dvDl      = document.getElementById('dv-download');
  const dvLoad    = document.getElementById('dv-loading');
  const dvNote    = document.getElementById('dv-note');
  if (!dvModal || !dvFrame) return;

  // GitHub Pages public base URL — adjust if repo name changes
  const PAGES_BASE = 'https://zerobun0.github.io/portfolio-v2/';

  function openDocViewer(filePath, title, unitLabel) {
    dvTitle.textContent = title;
    dvUnit.textContent  = unitLabel;
    dvDl.href           = filePath;
    dvDl.download       = filePath.split('/').pop();

    // Show loading spinner
    if (dvLoad) dvLoad.classList.remove('hidden');
    if (dvNote) dvNote.classList.remove('show');
    dvFrame.src = '';

    const isPdf = filePath.toLowerCase().endsWith('.pdf');
    const absUrl = PAGES_BASE + filePath;

    if (isPdf) {
      // Direct iframe embed for PDFs
      dvFrame.src = filePath;
    } else {
      // Office Online Viewer for docx/pptx/xlsx (needs public URL)
      dvFrame.src = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(absUrl);
    }

    // Hide spinner once iframe loads (or after 2.5s timeout)
    const loadTimer = setTimeout(() => {
      if (dvLoad) dvLoad.classList.add('hidden');
      if (dvNote && !isPdf) dvNote.classList.add('show');
    }, 2500);
    dvFrame.onload = () => {
      clearTimeout(loadTimer);
      if (dvLoad) dvLoad.classList.add('hidden');
      if (dvNote && !isPdf) dvNote.classList.add('show');
    };

    dvOverlay.classList.add('open');
    dvModal.classList.add('open');
    dvModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDocViewer() {
    dvOverlay.classList.remove('open');
    dvModal.classList.remove('open');
    dvModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { dvFrame.src = ''; }, 350);
    if (dvNote) dvNote.classList.remove('show');
  }

  // Attach listeners to all task-row buttons (including future ones)
  document.addEventListener('click', e => {
    const row = e.target.closest('.task-row');
    if (!row) return;
    e.stopPropagation();
    openDocViewer(row.dataset.file, row.dataset.title, row.dataset.unit);
  });

  if (dvClose)   dvClose.addEventListener('click', closeDocViewer);
  if (dvOverlay) dvOverlay.addEventListener('click', closeDocViewer);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && dvModal.classList.contains('open')) closeDocViewer();
  });

  // Cursor hover effect on task rows
  document.querySelectorAll('.task-row').forEach(row => {
    row.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    row.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

}; // end window.initPortfolio

/* Run immediately on first script load */
window.initPortfolio();

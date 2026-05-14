/* ======================================================
   portfolio.js — filter tabs, folder cards, detail panel
====================================================== */

// ── Cert data ─────────────────────────────────────────
const CERTS = {
  'it-essentials': {
    name:     'IT Essentials',
    issuer:   'Cisco Networking Academy',
    category: 'Hardware & Software',
    level:    'Foundational',
    icon:     '💻',
    color:    '#4A90D9',
    badge:    'assets/images/cisco/it-essentials.png',
    desc:     'Covers fundamental computer hardware and software skills, including installation, configuration, and troubleshooting of personal computers and mobile devices.',
    skills:   ['Computer Hardware','Windows OS','Mobile Devices','Troubleshooting','Preventive Maintenance'],
  },
  'hardware-upgrade': {
    name:     'Hardware and Upgrade Support',
    issuer:   'Cisco Networking Academy',
    category: 'Hardware',
    level:    'Foundational',
    icon:     '🔧',
    color:    '#7B5EA7',
    badge:    'assets/images/cisco/hardware-upgrade.png',
    desc:     'Focuses on diagnosing, upgrading, and maintaining PC hardware components, including CPUs, RAM, storage, and peripheral devices.',
    skills:   ['Component Identification','System Upgrades','Peripheral Setup','BIOS / UEFI','Storage Management'],
  },
  'os-support': {
    name:     'Operating Systems Support',
    issuer:   'Cisco Networking Academy',
    category: 'Software',
    level:    'Foundational',
    icon:     '🖥️',
    color:    '#2E9E6B',
    badge:    'assets/images/cisco/os-support.png',
    desc:     'Covers installation, configuration, and troubleshooting of multiple operating systems, including Windows 10/11 and basic Linux environments.',
    skills:   ['Windows Administration','Linux Basics','File Systems','User Accounts','CLI Tools'],
  },
  'security-connectivity': {
    name:     'Security & Connectivity Support',
    issuer:   'Cisco Networking Academy',
    category: 'Security & Networking',
    level:    'Intermediate',
    icon:     '🔐',
    color:    '#D97B4A',
    badge:    'assets/images/cisco/security-connectivity.png',
    desc:     'Introduces network security principles and hands-on skills for protecting systems, configuring firewalls, and securing wireless connections.',
    skills:   ['Network Security','Firewall Config','VPN Basics','Wireless Security','Password Policies'],
  },
  'customer-support': {
    name:     'IT Customer Support Basics',
    issuer:   'Cisco Networking Academy',
    category: 'Customer Service',
    level:    'Foundational',
    icon:     '🎧',
    color:    '#D4547A',
    badge:    'assets/images/cisco/customer-support.png',
    desc:     'Develops professional IT support skills including communication, documentation, ticketing systems, and customer-facing problem resolution techniques.',
    skills:   ['Help Desk Skills','Communication','Ticketing Systems','Documentation','Problem Resolution'],
  },
  'js-essentials': {
    name:     'JavaScript Essentials 1',
    issuer:   'Cisco Networking Academy',
    category: 'Programming',
    level:    'Foundational',
    icon:     '⚡',
    color:    '#C9A227',
    dk:       true,
    badge:    'assets/images/cisco/js-essentials.png',
    desc:     'Introduces JavaScript programming fundamentals including variables, functions, control structures, DOM manipulation, and browser-based scripting.',
    skills:   ['JS Syntax','DOM Manipulation','Functions','Control Flow','Data Types'],
  },
  'iot-intro': {
    name:     'Introduction to IoT',
    issuer:   'Cisco Networking Academy',
    category: 'IoT & Emerging Tech',
    level:    'Awareness',
    icon:     '📡',
    color:    '#3BAA8A',
    badge:    'assets/images/cisco/iot-intro.png',
    desc:     'Explores the Internet of Things ecosystem — connected devices, sensors, data analytics, and the impact of IoT across industries.',
    skills:   ['IoT Concepts','Sensors & Actuators','Data Analytics','Smart Systems','Connectivity Protocols'],
  },
  'network-tech': {
    name:     'Network Technician Career Path',
    issuer:   'Cisco Networking Academy',
    category: 'Networking',
    level:    'Career Path',
    icon:     '🌐',
    color:    '#3476C0',
    badge:    'assets/images/cisco/network-tech.png',
    desc:     'A comprehensive career pathway covering essential networking skills, TCP/IP protocols, routing, switching, and hands-on Cisco device configuration.',
    skills:   ['TCP/IP','Routing & Switching','Network Design','Cisco IOS','Troubleshooting'],
  },
  'cybersecurity': {
    name:     'Junior Cybersecurity Analyst',
    issuer:   'Cisco Networking Academy',
    category: 'Cybersecurity',
    level:    'Career Path',
    icon:     '🛡️',
    color:    '#5B3FA0',
    badge:    'assets/images/cisco/cybersecurity.png',
    desc:     'Prepares students for entry-level cybersecurity analyst roles with hands-on training in threat detection, security operations, and incident response.',
    skills:   ['Threat Analysis','SIEM Tools','Incident Response','Security Monitoring','Network Forensics'],
  },
};

// ── Filter Tabs ───────────────────────────────────────
const tabs        = document.querySelectorAll('.filter-tab');
const secAll      = document.getElementById('section-all');
const secCerts    = document.getElementById('section-certs');
const secProjects = document.getElementById('section-projects');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const f = tab.dataset.filter;
    const show = el => el && el.classList.remove('hidden');
    const hide = el => el && el.classList.add('hidden');

    if (f === 'all') {
      show(secAll); show(secCerts); show(secProjects);
    } else if (f === 'certs') {
      hide(secAll); show(secCerts); hide(secProjects);
    } else if (f === 'projects') {
      hide(secAll); hide(secCerts); show(secProjects);
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

  // Show the actual Cisco badge image
  const badgeImg = panel.querySelector('#dp-badge-img');
  if (badgeImg && c.badge) {
    badgeImg.src = c.badge;
    badgeImg.alt = c.name + ' badge';
    badgeImg.style.display = 'block';
  }

  // Mini folder colour
  const ft = panel.querySelector('#dp-folder-tab');
  const fb = panel.querySelector('#dp-folder-body');
  if (ft) ft.style.background = c.color;
  if (fb) fb.style.background = c.color;
  const fi = panel.querySelector('#dp-folder-icon');
  if (fi) fi.textContent = c.icon;

  // Skills tags
  panel.querySelector('#dp-skills').innerHTML =
    c.skills.map(s => `<span class="detail-skill-tag">${s}</span>`).join('');

  panel.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  if (panel) panel.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.folder-card[data-cert]').forEach(card => {
  card.addEventListener('click', () => openPanel(card.dataset.cert));
});

if (btnClose) btnClose.addEventListener('click', closePanel);
if (overlay)  overlay.addEventListener('click',  closePanel);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

// ── Image Carousels ──────────────────────────────────
(function initCarousels() {
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

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', e => { e.stopPropagation(); go(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });

    function go(idx) {
      current = ((idx % count) + count) % count;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
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

    resetTimer();
  });
})();

// ── Image Lightbox ───────────────────────────────────
(function initLightbox() {
  const lb      = document.getElementById('img-lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev  = document.getElementById('lightbox-prev');
  const lbNext  = document.getElementById('lightbox-next');
  if (!lb || !lbImg) return;

  let currentSlides = [];
  let lbIdx = 0;

  function openLightbox(slides, idx) {
    currentSlides = slides;
    lbIdx = ((idx % slides.length) + slides.length) % slides.length;
    lbImg.src = slides[lbIdx];
    lbImg.alt = '';
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

  /* Wire each carousel wrap — clicking any img opens lightbox at active slide */
  document.querySelectorAll('.project-img-wrap').forEach(wrap => {
    const imgs = Array.from(wrap.querySelectorAll('.carousel-slide img'));
    if (!imgs.length) return;
    const slides = imgs.map(img => img.src);

    /* Get the current active carousel index from translateX */
    function activeIdx() {
      const track = wrap.querySelector('.carousel-track');
      if (!track) return 0;
      const tx = track.style.transform;
      const match = tx.match(/translateX\(-(\d+)%\)/);
      return match ? parseInt(match[1], 10) / 100 : 0;
    }

    imgs.forEach(img => {
      img.addEventListener('click', e => {
        e.stopPropagation();
        openLightbox(slides, activeIdx());
      });
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  if (lbPrev) lbPrev.addEventListener('click', () => navLightbox(-1));
  if (lbNext) lbNext.addEventListener('click', () => navLightbox(1));
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });
})();

/* ============================================================
   MILO vera — Portfolio Web JS
   Lee portfolio_data.json y renderiza toda la página.
   Compatible con GitHub Pages (rutas relativas).
   ============================================================ */

const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('mv-theme') || 'light';
root.setAttribute('data-theme', savedTheme);

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('mv-theme', next);
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 2px 20px rgba(0,0,0,0.08)'
    : 'none';
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function observeReveal() {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

const heroToggle = document.getElementById('hero-toggle');
const heroCollapsible = document.getElementById('hero-collapsible');

if (heroToggle && heroCollapsible) {
  heroToggle.addEventListener('click', () => {
    heroCollapsible.classList.toggle('open');
    heroToggle.setAttribute('aria-expanded', heroCollapsible.classList.contains('open'));
  });
  heroToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      heroCollapsible.classList.toggle('open');
      heroToggle.setAttribute('aria-expanded', heroCollapsible.classList.contains('open'));
    }
  });
}

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxSocial = document.getElementById('lightbox-social');
const lightboxImgWrap = document.getElementById('lightbox-img-wrap');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentLightboxItems = [];
let currentLightboxIndex = 0;

function showLightboxItem(index) {
  if (index < 0) index = currentLightboxItems.length - 1;
  if (index >= currentLightboxItems.length) index = 0;
  currentLightboxIndex = index;
  const obra = currentLightboxItems[index];

  lightboxImg.src = obra.imagen;
  lightboxImg.alt = obra.titulo || '';
  lightboxTitle.textContent = obra.titulo || '';
  lightboxDesc.textContent = obra.descripcion || '';

  lightboxSocial.innerHTML = '';
  if (obra.enlaces) {
    const icons = {
      instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
      twitter_x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>'
    };

    for (const [key, url] of Object.entries(obra.enlaces)) {
      if (url && icons[key]) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.className = 'lightbox-social-btn';
        a.title = `Ver en ${key === 'twitter_x' ? 'X' : 'Instagram'}`;
        a.innerHTML = icons[key];
        lightboxSocial.appendChild(a);
      }
    }
  }
}

function openLightbox(index) {
  showLightboxItem(index);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    lightboxImg.src = '';
    lightboxSocial.innerHTML = '';
  }, 400);
}

lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  showLightboxItem(currentLightboxIndex - 1);
});
lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  showLightboxItem(currentLightboxIndex + 1);
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox || e.target === lightboxImgWrap) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showLightboxItem(currentLightboxIndex - 1);
  if (e.key === 'ArrowRight') showLightboxItem(currentLightboxIndex + 1);
});

function hexToColor(hex) {
  return hex.startsWith('#') ? hex : `#${hex}`;
}

function renderHero(data) {
  const { artist, comisiones } = data;

  document.title = `${artist.name} — Arte & Comisiones`;
  document.getElementById('artist-name').textContent = artist.name;

  const acordeonNameEl = document.getElementById('acordeon-artist-name');
  if (acordeonNameEl) acordeonNameEl.textContent = artist.name;

  document.getElementById('artist-tagline').textContent = artist.tagline;
  document.getElementById('artist-bio').textContent = artist.bio;

  const avatarImg = document.getElementById('hero-avatar');
  if (artist.avatar) avatarImg.src = artist.avatar;

  const badge = document.getElementById('commission-badge');
  badge.className = 'commission-badge reveal ' + (comisiones.abiertas ? 'open' : 'closed');
  badge.querySelector('.badge-text').textContent = comisiones.abiertas
    ? 'Comisiones abiertas ✓'
    : 'Comisiones cerradas';
}

function renderSobreMi(artist) {
  const descriptionEl = document.getElementById('artist-likes-desc');
  if (descriptionEl) {
    descriptionEl.textContent = artist.me_gusta || 'No hay descripción disponible.';
  }
  const chipsSi = document.getElementById('chips-si');
  chipsSi.innerHTML = '';
  (artist.cosas_que_dibujo || []).forEach(cosa => {
    const span = document.createElement('span');
    span.className = 'chip chip-si';
    span.textContent = cosa;
    chipsSi.appendChild(span);
  });

  const chipsNo = document.getElementById('chips-no');
  chipsNo.innerHTML = '';
  (artist.cosas_que_no_dibujo || []).forEach(cosa => {
    const span = document.createElement('span');
    span.className = 'chip chip-no';
    span.textContent = cosa;
    chipsNo.appendChild(span);
  });
}

function renderGaleria(galeria) {
  const grid = document.getElementById('gallery-grid');
  const filterBar = document.getElementById('filter-bar');

  const tipos = ['todas', ...new Set(galeria.map(o => o.tipo).filter(Boolean))];

  filterBar.innerHTML = '';
  tipos.forEach(tipo => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (tipo === 'todas' ? ' active' : '');
    btn.dataset.filter = tipo;
    btn.textContent = tipo;
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderObraItems(galeria, tipo, grid);
    });
    filterBar.appendChild(btn);
  });

  renderObraItems(galeria, 'todas', grid);
}

function renderObraItems(galeria, filtro, grid) {
  const items = filtro === 'todas' ? galeria : galeria.filter(o => o.tipo === filtro);
  currentLightboxItems = items;

  grid.innerHTML = '';

  if (!items.length) {
    grid.innerHTML = '<div class="gallery-empty">✨ Próximamente más obras</div>';
    return;
  }

  items.forEach((obra, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-item reveal';
    div.style.transitionDelay = `${i * 0.06}s`;

    const imgOrPlaceholder = obra.imagen
      ? `<img src="${obra.imagen}" alt="${obra.titulo}" 
              loading="lazy"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
         />
         <div class="gallery-img-placeholder" style="display:none">🖼️</div>`
      : `<div class="gallery-img-placeholder">🖼️</div>`;

    const destacada = obra.destacada
      ? '<span class="badge-destacada">✦ destacada</span>'
      : '';

    div.innerHTML = `
      ${imgOrPlaceholder}
      ${destacada}
      <div class="gallery-overlay">
        <span class="gallery-overlay-title">${obra.titulo || ''}</span>
      </div>
    `;

    div.addEventListener('click', () => {
      const img = div.querySelector('img');
      if (img && img.style.display !== 'none') {
        openLightbox(i);
      }
    });

    grid.appendChild(div);
  });

  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function renderComisiones(comisiones) {
  const statusBadge = document.getElementById('comm-status-badge');
  const statusText = document.getElementById('comm-status-text');
  statusBadge.className = 'commission-status-badge ' + (comisiones.abiertas ? 'open' : 'closed');
  statusText.textContent = comisiones.abiertas ? 'abiertas' : 'cerradas';
  statusBadge.querySelector('.badge-dot').style.background = 'currentColor';

  const meta = document.getElementById('comisiones-meta');
  meta.innerHTML = `
    <div class="meta-chip">
      <div>
        <div class="meta-chip-label">tiempo de espera</div>
        <div class="meta-chip-value">⏱ ${comisiones.tiempo_espera}</div>
      </div>
    </div>
    <div class="meta-chip">
      <div>
        <div class="meta-chip-label">inteligencia artificial</div>
        <div class="meta-chip-value ${comisiones.acepta_ia ? '' : 'negative'}">
          ${comisiones.acepta_ia ? '✓ aceptada' : '✕ no banco'}
        </div>
      </div>
    </div>
    ${comisiones.lgbtq_friendly ? `
    <div class="meta-chip">
      <div>
        <div class="meta-chip-label">ambiente</div>
        <div class="meta-chip-value">🌈 LGBTQ+ friendly</div>
      </div>
    </div>` : ''}
  `;

  const nota = document.getElementById('comisiones-nota');
  if (comisiones.nota) {
    nota.textContent = comisiones.nota;
  } else {
    nota.style.display = 'none';
  }

  const grid = document.getElementById('comisiones-grid');
  grid.innerHTML = '';
  (comisiones.tipos || []).forEach((tipo, i) => {
    const card = document.createElement('div');
    card.className = 'comision-card reveal';
    card.style.transitionDelay = `${i * 0.1}s`;

    const imgHtml = tipo.imagen_ejemplo
      ? `<img src="${tipo.imagen_ejemplo}" alt="${tipo.nombre}"
              loading="lazy"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
         />
         <div class="comision-img-placeholder" style="display:none">🖼️</div>`
      : `<div class="comision-img-placeholder">🎨</div>`;

    card.innerHTML = `
      <div class="comision-img-wrap">${imgHtml}</div>
      <div class="comision-body">
        <div class="comision-nombre">${tipo.nombre}</div>
        <div class="comision-desc">${tipo.descripcion}</div>
        <div class="comision-precio">
          <span class="precio-desde">desde</span>
          <span class="precio-valor">${tipo.moneda} ${tipo.precio_desde}</span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function renderContacto(redes, artist) {
  const socialDefs = [
    { key: 'instagram', label: 'Instagram', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>', color: '#E1306C' },
    { key: 'twitter_x', label: 'X', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>', color: '#1DA1F2' },
    { key: 'email', label: 'Email', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>', color: '#4285F4' },
    { key: 'patreon', label: 'Patreon', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="14.5" cy="9.5" r="5.5"></circle><line x1="4" y1="4" x2="4" y2="20"></line></svg>', color: '#FF424D' },
  ];

  const grid = document.getElementById('social-grid');
  grid.innerHTML = '';

  socialDefs.forEach(({ key, label, icon, color }, i) => {
    const a = document.createElement('a');
    a.className = 'social-card reveal';
    a.href = '#';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Esta red social aún no está confirmada');
    });
    a.style.setProperty('--social-color', color);
    a.style.transitionDelay = `${i * 0.08}s`;
    a.innerHTML = `
      <div class="social-icon">${icon}</div>
      <span>${label}</span>
    `;
    grid.appendChild(a);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('site-footer').querySelector('#year').textContent =
    new Date().getFullYear();
}

async function init() {
  let data;

  try {
    const res = await fetch('portfolio_data.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.warn('No se pudo cargar portfolio_data.json:', err.message);
    document.getElementById('artist-bio').textContent =
      'Error al cargar el portfolio. Verificá que portfolio_data.json exista.';
    observeReveal();
    return;
  }

  renderHero(data);
  renderSobreMi(data.artist);
  renderGaleria(data.galeria || []);
  renderComisiones(data.comisiones);
  renderContacto(data.redes, data.artist);

  observeReveal();
}

document.addEventListener('DOMContentLoaded', init);

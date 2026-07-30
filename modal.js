// modal.js — изолированный модуль модального окна

const THEME_GRADIENT = {
  teal:  'var(--teal)',  pink:  'var(--pink)',  amber: 'var(--amber)',
  green: 'var(--green)', plum:  'var(--plum)',  coral: 'var(--coral)',
};

export function coverStyle(release) {
  if (release.cover_url) return `background-image:url('${release.cover_url}')`;
  return `background:${THEME_GRADIENT[release.cover_theme] || THEME_GRADIENT.teal}`;
}

export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '';
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function starsHTML(rating, size = '') {
  if (rating == null) return '<span class="rating-num">Без оценки</span>';
  const starSvg = (fillPct) => `
    <span class="star">
      <svg class="empty" viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.6 7.2.7-5.4 4.9 1.6 7.1L12 18.1l-6.3 3.7 1.6-7.1-5.4-4.9 7.2-.7z"/></svg>
      <svg class="fill" viewBox="0 0 24 24" style="--fill:${fillPct}%"><path d="M12 2.5l2.9 6.6 7.2.7-5.4 4.9 1.6 7.1L12 18.1l-6.3 3.7 1.6-7.1-5.4-4.9 7.2-.7z"/></svg>
    </span>`;
  let out = `<span class="stars ${size}">`;
  for (let i = 0; i < 10; i++) {
    out += starSvg(Math.max(0, Math.min(100, (rating - i) * 100)));
  }
  out += `</span><span class="rating-num">${rating.toFixed(1)}</span>`;
  return out;
}

// Инициализация событий модального окна
export function initModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');

  if (!modalOverlay || !closeBtn) return;

  const closeModal = () => modalOverlay.classList.remove('open');

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// Открытие модалки с данными конкретного релиза
export function openModal(release) {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCover = document.getElementById('modal-cover');
  const modalHeaderBg = document.getElementById('modal-header-bg');

  if (!modalOverlay) return;

  modalCover.style.cssText = coverStyle(release);
  modalHeaderBg.style.cssText = coverStyle(release);
  document.getElementById('modal-genre').textContent = release.genre;
  document.getElementById('modal-title').textContent = release.title;
  document.getElementById('modal-artist').textContent = release.artist;
  document.getElementById('modal-rating').innerHTML = starsHTML(release.rating, 'lg');

  const tracks = release.tracks || [];
  const tracksSection = document.getElementById('modal-tracks-section');
  if (tracks.length) {
    tracksSection.style.display = '';
    document.getElementById('modal-tracks').innerHTML = tracks.map(t => `
      <li>
        <span class="num">${String(t.number).padStart(2,'0')}</span>
        <span class="t-title">${t.title}</span>
        <span class="dur">${formatDuration(t.duration)}</span>
      </li>`).join('');
  } else {
    tracksSection.style.display = 'none';
  }

  const reviewSection = document.getElementById('modal-review-section');
  if (release.review) {
    reviewSection.style.display = '';
    document.getElementById('modal-review').textContent = release.review;
  } else {
    reviewSection.style.display = 'none';
  }

  modalOverlay.classList.add('open');
}
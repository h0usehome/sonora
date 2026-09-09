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
  c// Находим контейнер треклиста внутри modal.js
const tracksContainer = document.getElementById('modal-tracks');

if (release.tracks && release.tracks.length > 0) {
  // Сортируем треки по номеру, чтобы они шли по порядку
  const sortedTracks = release.tracks.sort((a, b) => a.number - b.number);
  
  tracksContainer.innerHTML = sortedTracks.map(t => {
    // Если оценка есть (не null и не пустая), создаем для неё красивый бейдж. Если нет — оставляем пустую строку.
    const ratingBadge = t.rating 
      ? `<span style="margin-left: auto; color: var(--accent); font-family: 'JetBrains Mono', monospace; font-size: 12px; background: rgba(232, 163, 61, 0.1); padding: 2px 6px; border-radius: 4px;">★ ${Number(t.rating).toFixed(1)}</span>` 
      : '';

    // Формируем строку трека
    return `
      <li>
        <span class="num">${String(t.number).padStart(2, '0')}</span>
        <span class="t-title">${t.title}</span>
        ${ratingBadge}
      </li>
    `;
  }).join('');
} else {
  tracksContainer.innerHTML = '<li style="color: var(--text-muted); font-size: 13px;">Треклист отсутствует</li>';
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

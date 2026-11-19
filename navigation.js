const menu = document.querySelector('.menu-switch');
const nav = document.getElementById('primary-links');
const narrow = window.matchMedia('(max-width: 1150px)');

function closeMenu() {
  nav.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
}
function setLayout() {
  closeMenu();
  menu.hidden = !narrow.matches;
  nav.classList.toggle('is-collapsible', narrow.matches);
}
menu.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', String(nav.classList.toggle('is-open')));
});
nav.addEventListener('click', closeMenu);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu();
    menu.focus();
  }
});
narrow.addEventListener('change', setLayout);
setLayout();

const header = menu.closest('.site-header');
new ResizeObserver(() => {
  if (!nav.classList.contains('is-open')) {
    document.documentElement.style.setProperty('--nav-height', header.offsetHeight + 'px');
  }
}).observe(header);

const reviewList = document.querySelector('.review-columns');
if (reviewList) {
  const rows = Math.ceil(reviewList.children.length / 2);
  reviewList.style.setProperty('--review-rows', rows);
  reviewList.classList.add('balanced');
}

const photoDialog = document.createElement('dialog');
photoDialog.className = 'photo-viewer';
photoDialog.setAttribute('aria-label', 'Photo preview');

const fullPhoto = document.createElement('img');
const closePhoto = document.createElement('button');
closePhoto.type = 'button';
closePhoto.setAttribute('aria-label', 'Close photo');
closePhoto.textContent = '×';
photoDialog.append(fullPhoto, closePhoto);
document.body.append(photoDialog);

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!link || link.hasAttribute('download') || link.target === '_blank' || link.origin !== location.origin) return;
  if (!/\.(?:jpe?g|png|webp|gif|avif)$/i.test(link.pathname) || !photoDialog.showModal) return;
  event.preventDefault();
  fullPhoto.alt = link.querySelector('img')?.alt || link.textContent.trim();
  fullPhoto.src = link.href;
  photoDialog.showModal();
});

photoDialog.addEventListener('click', (event) => {
  if (event.target === photoDialog || event.target === closePhoto) photoDialog.close();
});
photoDialog.addEventListener('close', () => fullPhoto.removeAttribute('src'));

// coin-effects.js - ESM coin UI effects (no window globals)

/**
 * Affiche l'animation de gain de pièce près d'un élément cible.
 * @param {HTMLElement} targetElement - Élément de référence (ex: icône pièce).
 */
export function showCoinGainAnimation(targetElement) {
  if (!targetElement) return;

  const coinEffect = document.createElement('div');
  coinEffect.className = 'coin-gain-effect';
  coinEffect.textContent = '🪙';

  const { left, top } = computeCoinPosition(targetElement);

  coinEffect.style.position = 'absolute';
  coinEffect.style.left = `${left}px`;
  coinEffect.style.top = `${top}px`;
  coinEffect.style.width = '40px';
  coinEffect.style.height = '40px';
  coinEffect.style.display = 'flex';
  coinEffect.style.alignItems = 'center';
  coinEffect.style.justifyContent = 'center';
  coinEffect.style.fontSize = '2em';
  coinEffect.style.background = 'none';
  coinEffect.style.border = 'none';
  coinEffect.style.zIndex = '9999';
  coinEffect.style.pointerEvents = 'none';
  coinEffect.title = '';
  coinEffect.classList.add('coin-fly-anim');

  document.body.appendChild(coinEffect);

  setTimeout(() => {
    if (document.body.contains(coinEffect)) {
      document.body.removeChild(coinEffect);
    }
  }, 800);
}

// Helpers
function getSafeWindow() {
  return typeof globalThis !== 'undefined' ? globalThis : {};
}

function getScrollOffsets(w) {
  const docEl = document?.documentElement;
  const left = typeof w.pageXOffset === 'number' ? w.pageXOffset : (docEl?.scrollLeft ?? 0);
  const top = typeof w.pageYOffset === 'number' ? w.pageYOffset : (docEl?.scrollTop ?? 0);
  return { left, top };
}

function centerFromRect(rect, scrollLeft, scrollTop, size = 40) {
  const half = size / 2;
  return {
    left: rect.left + rect.width / 2 - half + scrollLeft,
    top: rect.top + rect.height / 2 - half + scrollTop,
  };
}

function getViewportCenter(w, size = 40) {
  const docEl = document?.documentElement;
  const iw = typeof w.innerWidth === 'number' ? w.innerWidth : (docEl?.clientWidth ?? 1024);
  const ih = typeof w.innerHeight === 'number' ? w.innerHeight : (docEl?.clientHeight ?? 768);
  const half = size / 2;
  return { left: iw / 2 - half, top: ih / 2 - half };
}

function computeCoinPosition(targetElement) {
  const w = getSafeWindow();
  const { left: scrollLeft, top: scrollTop } = getScrollOffsets(w);

  const candidates = [targetElement, document.getElementById('game')];

  for (const el of candidates) {
    const rect = el?.getBoundingClientRect?.();
    if (rect && rect.width > 0 && rect.height > 0) {
      return centerFromRect(rect, scrollLeft, scrollTop);
    }
  }

  return getViewportCenter(w);
}

/**
 * Déclenche une courte animation de compteur de pièces dans la TopBar.
 */
export function triggerCoinCountAnimation() {
  const coinEl = document.querySelector('.top-bar .coin-count');
  if (!coinEl) return;
  coinEl.classList.add('coin-bounce');
  setTimeout(() => coinEl.classList.remove('coin-bounce'), 600);
}

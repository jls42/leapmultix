// ES module with selected helpers extracted from legacy main.js
import { UserState } from './core/userState.js';
import { getTranslation } from './utils-es6.js';
import { gameState } from './game.js';

const AVATAR_LIST = ['fox', 'panda', 'unicorn', 'dragon', 'astronaut'];

export function renderAvatarSelector(target) {
  let avatarSelector = null;
  if (!target) {
    const all = Array.from(document.querySelectorAll('.avatar-selector'));
    avatarSelector = all.find(el => el.offsetParent !== null);
  } else if (typeof target === 'string') {
    avatarSelector = document.querySelector(target);
  } else {
    avatarSelector = target;
  }
  if (!avatarSelector) return;

  const userData = UserState.getCurrentUserData();
  const unlocked = userData.unlockedAvatars || ['fox'];

  while (avatarSelector.firstChild) avatarSelector.removeChild(avatarSelector.firstChild);
  AVATAR_LIST.forEach(avatarName => {
    const isUnlocked = unlocked.includes(avatarName);
    const btn = document.createElement('button');
    btn.className = 'avatar-btn' + (isUnlocked ? '' : ' locked');
    btn.dataset.avatar = avatarName;
    const labelRaw = getTranslation(avatarName);
    const label =
      typeof labelRaw === 'string' && !/^\[.*\]$/.test(labelRaw) ? labelRaw : avatarName;
    const lockTipRaw = getTranslation('avatar_locked_tooltip');
    const lockTip =
      typeof lockTipRaw === 'string' && !/^\[.*\]$/.test(lockTipRaw)
        ? lockTipRaw
        : 'Avatar verrouillé';
    const img = document.createElement('img');
    img.src = `assets/images/arcade/${avatarName}_head_avatar_128x128.png`;
    img.width = 100;
    img.height = 100;
    img.alt = label;
    const span = document.createElement('span');
    span.className = 'avatar-label';
    span.textContent = label;
    btn.appendChild(img);
    btn.appendChild(document.createTextNode(' '));
    btn.appendChild(span);
    if (!isUnlocked) {
      const lock = document.createElement('span');
      lock.className = 'lock-icon';
      lock.title = lockTip;
      lock.textContent = '🔒';
      btn.appendChild(document.createTextNode(' '));
      btn.appendChild(lock);
    }
    btn.disabled = !isUnlocked;
    if (!isUnlocked) btn.title = getTranslation('avatar_locked_tooltip');
    avatarSelector.appendChild(btn);
  });
}

export async function updateWelcomeMessageUI() {
  const userData = UserState.getCurrentUserData();
  const nickname = userData.nickname || '';
  const welcomeMsgElement = document.getElementById('welcome-message');
  if (welcomeMsgElement) {
    while (welcomeMsgElement.firstChild)
      welcomeMsgElement.removeChild(welcomeMsgElement.firstChild);
    const welcomeText = getTranslation('welcome_user', { nickname });
    const introText = getTranslation('adventure_intro');
    welcomeMsgElement.appendChild(document.createTextNode(welcomeText));
    welcomeMsgElement.appendChild(document.createElement('br'));
    welcomeMsgElement.appendChild(document.createTextNode(introText));
  } else {
    const welcomeNicknameSpan = document.getElementById('welcome-nickname');
    if (welcomeNicknameSpan) {
      welcomeNicknameSpan.textContent = nickname;
    }
  }
}

export function pickRandomAvatarId() {
  const list = AVATAR_LIST;
  if (!Array.isArray(list) || list.length === 0) return 'fox';
  return list[Math.floor(Math.random() * list.length)];
}

// No global exposure; use ES module imports instead

// Background helpers (guarded definitions to avoid overriding main.js if present)
const avatarAvailableImages = {
  fox: [1, 2, 3, 10, 11, 12, 13, 14, 15, 16, 17],
  panda: Array.from({ length: 17 }, (_, i) => i + 1),
  unicorn: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  dragon: Array.from({ length: 17 }, (_, i) => i + 1),
  astronaut: Array.from({ length: 17 }, (_, i) => i + 1),
  default: [1],
};
const _lastUsedImageNumber = {};
let _backgroundIntervalId = null;

export function updateBackgroundByAvatar(avatarId) {
  // Resolve avatar id from arg or current state, normalize possible FR aliases
  const aliases = { renard: 'fox', licorne: 'unicorn', astronaute: 'astronaut' };
  let resolved = avatarId || gameState?.avatar || UserState.getCurrentUserData()?.avatar || 'fox';

  resolved = aliases[resolved] || resolved;

  let available = avatarAvailableImages[resolved];
  let effective = resolved;
  if (!available || available.length === 0) {
    available = avatarAvailableImages.default;
    effective = 'fox';
    if (!available || available.length === 0) return;
  }
  let chosen;
  if (available.length > 1) {
    do {
      chosen = available[Math.floor(Math.random() * available.length)];
    } while (chosen === _lastUsedImageNumber[effective]);
  } else {
    chosen = available[0];
  }

  _lastUsedImageNumber[effective] = chosen;
  const imageNumber = String(chosen).padStart(3, '0');
  const basePath = `../img/background_${effective}_${imageNumber}`;
  const pngPath = `${basePath}.png`;
  const webpPath = `${basePath}.webp`;
  const imageSet = `image-set(url('${webpPath}') type('image/webp'), url('${pngPath}') type('image/png'))`;
  document.body.style.setProperty('--current-bg-image-webp', imageSet);
  document.body.style.setProperty('--current-bg-image-url', `url('${pngPath}')`);
}

export function startBackgroundRotation(avatarId) {
  if (_backgroundIntervalId) clearInterval(_backgroundIntervalId);
  function changeBg() {
    updateBackgroundByAvatar(avatarId);
  }
  changeBg();
  _backgroundIntervalId = setInterval(changeBg, 42000);
}

export default { renderAvatarSelector, updateWelcomeMessageUI };

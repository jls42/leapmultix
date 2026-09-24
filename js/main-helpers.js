// ES module with selected helpers extracted from legacy main.js
import { UserState } from './core/userState.js';
import { getTranslation } from './utils-es6.js';
import { gameState } from './game.js';
import Storage from './core/storage.js';
import { createIcon } from './components/icons.js';
import { pickRandom } from './core/random.js';

const AVATAR_LIST = ['fox', 'panda', 'unicorn', 'dragon', 'astronaut'];
// Anciennes valeurs françaises encore présentes dans certains profils enregistrés
const AVATAR_ALIASES = { renard: 'fox', licorne: 'unicorn', astronaute: 'astronaut' };
const DEFAULT_AVATAR = 'fox';
const HERO_IMAGE_BY_LANG = {
  fr: 'assets/social/leapmultix-social-card.webp',
  en: 'assets/social/leapmultix-social-card.webp',
  es: 'assets/social/leapmultix-social-card.webp',
};
const HERO_DEFAULT_LANG = 'fr';
// Repli du message de la mascotte si aucune traduction n'est disponible
const WELCOME_FALLBACK = 'Salut {nickname} ! On joue à quoi aujourd’hui ?';

const isMissingTranslation = value => typeof value !== 'string' || /^\[.*\]$/.test(value);

/**
 * Ramène un identifiant d'avatar (éventuellement ancien ou inconnu) à un avatar connu.
 * @param {string} [avatarId]
 * @returns {string} Identifiant de la liste AVATAR_LIST (renard par défaut)
 */
export function normalizeAvatarId(avatarId) {
  const resolved = AVATAR_ALIASES[avatarId] || avatarId;
  return AVATAR_LIST.includes(resolved) ? resolved : DEFAULT_AVATAR;
}

/**
 * Chemin du visage (128×128) d'un avatar. L'identifiant est filtré par une liste
 * blanche : une valeur inattendue venant du stockage ne peut pas composer une URL.
 * @param {string} [avatarId]
 * @returns {string}
 */
export function getAvatarHeadSrc(avatarId) {
  return `assets/images/arcade/${normalizeAvatarId(avatarId)}_head_avatar_128x128.png`;
}

// Cadenas des avatars verrouillés : icône partagée (components/icons.js), pas d'émoji.
// Le conteneur .lock-icon est celui que la personnalisation sait déjà décorer.
function createLockIcon() {
  const lock = document.createElement('span');
  lock.className = 'lock-icon';
  lock.setAttribute('aria-hidden', 'true');
  const icon = createIcon('lock', { size: 18 });
  if (icon) lock.appendChild(icon);
  return lock;
}

function resolveAvatarSelector(target) {
  if (!target) {
    // Le sélecteur du formulaire « Nouveau joueur » (slide 0) n'est jamais régénéré ici :
    // il propose tous les avatars, indépendamment de ceux débloqués par le joueur courant.
    const all = Array.from(document.querySelectorAll('.avatar-selector'));
    return (
      all.find(
        el => el.offsetParent !== null && !el.classList.contains('creation-avatar-selector')
      ) || null
    );
  }
  if (typeof target === 'string') return document.querySelector(target);
  return target;
}

export function renderAvatarSelector(target) {
  const avatarSelector = resolveAvatarSelector(target);
  if (!avatarSelector) return;

  const userData = UserState.getCurrentUserData();
  const unlocked = userData.unlockedAvatars || ['fox'];
  const current = normalizeAvatarId(userData.avatar);
  const lockTipRaw = getTranslation('avatar_locked_tooltip');
  const lockTip = isMissingTranslation(lockTipRaw) ? 'Avatar verrouillé' : lockTipRaw;

  while (avatarSelector.firstChild) avatarSelector.removeChild(avatarSelector.firstChild);
  AVATAR_LIST.forEach(avatarName => {
    const isUnlocked = unlocked.includes(avatarName);
    // Un <label> qui habille un bouton radio natif : le navigateur gère le clavier
    // (flèches, Espace), l'état coché et l'annonce « option 2 sur 5 »
    const btn = document.createElement('label');
    btn.className = 'avatar-btn' + (isUnlocked ? '' : ' locked');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.className = 'avatar-radio';
    radio.name = 'customization-avatar';
    radio.value = avatarName;
    radio.checked = avatarName === current;
    radio.disabled = !isUnlocked;
    btn.appendChild(radio);
    const labelRaw = getTranslation(avatarName);
    const label = isMissingTranslation(labelRaw) ? avatarName : labelRaw;
    const img = document.createElement('img');
    img.src = getAvatarHeadSrc(avatarName);
    img.width = 100;
    img.height = 100;
    // Le nom visible donne déjà le nom accessible du bouton
    img.alt = '';
    const span = document.createElement('span');
    span.className = 'avatar-label';
    // Un changement de langue réécrit le nom sans régénérer le sélecteur (i18n.js)
    span.dataset.translate = avatarName;
    span.textContent = label;
    btn.appendChild(img);
    btn.appendChild(document.createTextNode(' '));
    btn.appendChild(span);
    if (!isUnlocked) {
      btn.appendChild(document.createTextNode(' '));
      btn.appendChild(createLockIcon());
      btn.title = lockTip;
      btn.dataset.translateTitle = 'avatar_locked_tooltip';
    }
    avatarSelector.appendChild(btn);
  });
}

/**
 * Message d'accueil de la bulle de la mascotte : une ligne courte avec le prénom.
 */
export async function updateWelcomeMessageUI() {
  const userData = UserState.getCurrentUserData();
  const nickname = userData.nickname || '';
  const welcomeMsgElement = document.getElementById('welcome-message');
  if (welcomeMsgElement) {
    let welcomeText = getTranslation('welcome_user_short', { nickname });
    if (isMissingTranslation(welcomeText)) {
      welcomeText = getTranslation('welcome_user', { nickname });
    }
    if (isMissingTranslation(welcomeText)) {
      welcomeText = WELCOME_FALLBACK.replace('{nickname}', nickname);
    }
    // Sans prénom, « Salut {nickname} ! » laisserait deux espaces consécutives
    welcomeMsgElement.textContent = String(welcomeText).replace(/\s{2,}/g, ' ');
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
  return pickRandom(list);
}

const normalizeLang = lang => {
  if (!lang) return HERO_DEFAULT_LANG;
  return String(lang).toLowerCase().split('-')[0];
};

const resolveHeroLanguage = preferredLang => {
  const storedLang = typeof Storage.loadLanguage === 'function' ? Storage.loadLanguage() : null;
  return normalizeLang(preferredLang || storedLang || HERO_DEFAULT_LANG);
};

const updateHeroImageSource = (heroImg, nextSrc) => {
  if (heroImg.getAttribute('src') !== nextSrc) {
    heroImg.setAttribute('src', nextSrc);
  }
};

const updateHeroImageAlt = heroImg => {
  try {
    const alt = getTranslation('seo_hero_alt');
    if (typeof alt === 'string' && !alt.startsWith('[')) {
      heroImg.setAttribute('alt', alt);
    }
  } catch (error) {
    console.warn('updateSeoHeroImage: impossible de traduire alt', error);
  }
};

export function updateSeoHeroImage(preferredLang) {
  const heroImg = document.querySelector('.seo-hero');
  if (!heroImg) return;

  const lang = resolveHeroLanguage(preferredLang);
  const nextSrc = HERO_IMAGE_BY_LANG[lang] || HERO_IMAGE_BY_LANG[HERO_DEFAULT_LANG];

  updateHeroImageSource(heroImg, nextSrc);
  updateHeroImageAlt(heroImg);
}

// No global exposure; use ES module imports instead

/* === FOND ILLUSTRÉ : UN MONDE FIXE PAR AVATAR ===
   Chaque avatar a plusieurs illustrations de fond. Une seule est tirée pour
   chaque avatar, la première fois qu'on l'affiche dans la session, puis elle
   ne change plus : ni minuterie, ni changement pendant une question. */
const avatarAvailableImages = {
  fox: [1, 2, 3, 10, 11, 12, 13, 14, 15, 16, 17],
  panda: Array.from({ length: 17 }, (_, i) => i + 1),
  unicorn: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  dragon: Array.from({ length: 17 }, (_, i) => i + 1),
  astronaut: Array.from({ length: 17 }, (_, i) => i + 1),
  default: [1],
};
const _chosenImageByAvatar = {};
let _appliedBackgroundKey = null;

/**
 * Tire au sort le monde illustré d'un avatar, une seule fois par session.
 * @param {string} avatarKey
 * @param {number[]} available
 * @returns {number}
 */
function chooseImageNumber(avatarKey, available) {
  if (!Object.prototype.hasOwnProperty.call(_chosenImageByAvatar, avatarKey)) {
    _chosenImageByAvatar[avatarKey] = pickRandom(available);
  }
  return _chosenImageByAvatar[avatarKey];
}

/**
 * Affiche le monde illustré de l'avatar. Appeler plusieurs fois avec le même
 * avatar ne change pas l'image ; changer d'avatar affiche le monde du nouvel avatar.
 * @param {string} [avatarId] - Avatar (par défaut : celui de la partie ou du joueur)
 */
export function updateBackgroundByAvatar(avatarId) {
  const requested =
    avatarId || gameState?.avatar || UserState.getCurrentUserData()?.avatar || DEFAULT_AVATAR;
  const resolved = AVATAR_ALIASES[requested] || requested;

  let available = avatarAvailableImages[resolved];
  let effective = resolved;
  if (!available || available.length === 0) {
    available = avatarAvailableImages.default;
    effective = DEFAULT_AVATAR;
  }

  const chosen = chooseImageNumber(effective, available);
  const backgroundKey = `${effective}_${chosen}`;
  if (backgroundKey === _appliedBackgroundKey) return;
  _appliedBackgroundKey = backgroundKey;

  const imageNumber = String(chosen).padStart(3, '0');
  const basePath = `../img/background_${effective}_${imageNumber}`;
  const pngPath = `${basePath}.png`;
  const webpPath = `${basePath}.webp`;
  const imageSet = `image-set(url('${webpPath}') type('image/webp'), url('${pngPath}') type('image/png'))`;
  document.body.style.setProperty('--current-bg-image-webp', imageSet);
  document.body.style.setProperty('--current-bg-image-url', `url('${pngPath}')`);
}

/**
 * @deprecated Le fond ne tourne plus (l'ancienne minuterie de 42 s est supprimée) :
 * utiliser updateBackgroundByAvatar(). Conservé pour les modules qui l'appellent
 * encore ; affiche simplement le monde de l'avatar.
 * @param {string} [avatarId]
 */
export function startBackgroundRotation(avatarId) {
  updateBackgroundByAvatar(avatarId);
}

export default { renderAvatarSelector, updateWelcomeMessageUI, updateSeoHeroImage };

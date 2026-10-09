// ES module with selected helpers extracted from legacy main.js
import { UserState } from './core/userState.js';
import { getTranslation } from './utils-es6.js';
import { gameState } from './game.js';
import Storage from './core/storage.js';
import { renderAvatarShop } from './components/avatarShop.js';
import { pickRandom } from './core/random.js';
import {
  AVATAR_IDS,
  DEFAULT_AVATAR,
  HEAD_SIZES,
  normalizeAvatarId,
  resolveAvatarAlias,
  setAvatarHead,
} from './avatar-heads.js';

// Ancienne adresse de la liste blanche des avatars (js/avatar-heads.js) : un module qui
// l'importe encore d'ici la trouve toujours
export { normalizeAvatarId } from './avatar-heads.js';

const HERO_IMAGE_BY_LANG = {
  fr: 'assets/social/leapmultix-social-card.webp',
  en: 'assets/social/leapmultix-social-card.webp',
  es: 'assets/social/leapmultix-social-card.webp',
};
const HERO_DEFAULT_LANG = 'fr';
// Repli du message de la mascotte si aucune traduction n'est disponible
const WELCOME_FALLBACK = 'Salut {nickname} ! On joue à quoi aujourd’hui ?';

const isMissingTranslation = value => typeof value !== 'string' || /^\[.*\]$/.test(value);

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

/**
 * Un avatar du joueur : un <label> qui habille un bouton radio natif. Le navigateur gère le
 * clavier (flèches, Espace), l'état coché et l'annonce « option 2 sur 5 ».
 * @param {string} avatarName
 * @param {boolean} checked - L'avatar porté
 * @returns {HTMLLabelElement}
 */
function avatarChoice(avatarName, checked) {
  const btn = document.createElement('label');
  btn.className = 'avatar-btn';
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.className = 'avatar-radio';
  radio.name = 'customization-avatar';
  radio.value = avatarName;
  radio.checked = checked;
  const labelRaw = getTranslation(avatarName);
  const img = document.createElement('img');
  setAvatarHead(img, avatarName, HEAD_SIZES.choice);
  img.width = 100;
  img.height = 100;
  // Le nom visible donne déjà le nom accessible du bouton
  img.alt = '';
  const span = document.createElement('span');
  span.className = 'avatar-label';
  // Un changement de langue réécrit le nom sans régénérer le sélecteur (i18n.js)
  span.dataset.translate = avatarName;
  span.textContent = isMissingTranslation(labelRaw) ? avatarName : labelRaw;
  btn.append(radio, img, ' ', span);
  return btn;
}

/**
 * Avatars de la personnalisation : ceux du joueur dans le groupe de boutons radio, qui ne
 * propose ainsi que des choix possibles ; les autres s'achètent avec les pièces, juste en
 * dessous (components/avatarShop.js).
 * @param {HTMLElement|string} [target] - Conteneur du groupe (par défaut, celui affiché)
 */
export function renderAvatarSelector(target) {
  const avatarSelector = resolveAvatarSelector(target);
  if (!avatarSelector) return;

  const userData = UserState.getCurrentUserData();
  const unlocked = userData.unlockedAvatars || ['fox'];
  const current = normalizeAvatarId(userData.avatar);

  // L'avatar porté n'est jamais verrouillé : un profil d'avant peut l'avoir hors de la liste
  const isLocked = avatarName => avatarName !== current && !unlocked.includes(avatarName);

  avatarSelector.replaceChildren(
    ...AVATAR_IDS.filter(avatarName => !isLocked(avatarName)).map(avatarName =>
      avatarChoice(avatarName, avatarName === current)
    )
  );
  renderAvatarShop(AVATAR_IDS.filter(isLocked));
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
    welcomeMsgElement.textContent = String(welcomeText).replaceAll(/\s{2,}/g, ' ');
  } else {
    const welcomeNicknameSpan = document.getElementById('welcome-nickname');
    if (welcomeNicknameSpan) {
      welcomeNicknameSpan.textContent = nickname;
    }
  }
}

export function pickRandomAvatarId() {
  const list = AVATAR_IDS;
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
  const resolved = resolveAvatarAlias(requested);

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

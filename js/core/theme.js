/**
 * Theme and accessibility helpers (extracted from main.js)
 * - initThemes, effectiveColorTheme, applyColorTheme, rememberColorTheme
 * - counterpartTheme, isDarkTheme, appliedColorTheme (bascule clair / sombre)
 * - updateVolume
 * - applyHighContrastMode
 * - applyFontSize
 */

import { getTranslation, updateSeoHeroImage } from '../utils-es6.js';
import { refreshBackground } from '../main-helpers.js';
import { AudioManager } from './audio.js';
import { TopBar } from '../components/topBar.js';
import { setIcon } from '../components/icons.js';
import { gameState } from '../game.js';
import { repaintAvatarHeads } from '../avatar-heads.js';
import { repaintModeLogos } from '../logos.js';
import {
  SEASONS,
  findSeason,
  seasonEdition,
  seasonOfTheme,
  wearSeason,
  wornSeason,
} from './seasons.js';

/** Thème ordinaire, choisi dans la Personnalisation (« default » : Classique) */
const COLOR_THEME_KEY = 'colorTheme';
/** Choix fait pendant une fête : « <édition>:<thème> », « none » pour un thème ordinaire */
const SEASON_CHOICE_KEY = 'seasonChoice';
const SEASON_DECLINED = 'none';
/**
 * Chaque thème a son contraire de l'autre clarté, [clair, sombre] : Classique et Nuit, Ciel et
 * Spatial, Nature et Forêt, Orangé et Braise, puis les deux thèmes de chaque fête. La bascule
 * passe de l'un à l'autre ; pendant une fête, un thème sombre donne le thème sombre de la fête.
 */
const THEME_PAIRS = Object.freeze([
  ['default', 'dark'],
  ['sky', 'blue'],
  ['green', 'moss'],
  ['orange', 'ember'],
  ...SEASONS.map(({ themes }) => [themes.light, themes.dark]),
]);
const DARK_THEMES = new Set(THEME_PAIRS.map(([, dark]) => dark));
const COUNTERPARTS = new Map(
  THEME_PAIRS.flatMap(([light, dark]) => [
    [light, dark],
    [dark, light],
  ])
);
// « pink », d'un ancien thème, peut rester dans un profil : sa classe s'efface comme les autres
const THEME_CLASSES = ['pink', ...COUNTERPARTS.keys()]
  .filter(theme => theme !== 'default')
  .map(theme => `theme-${theme}`);

/** Thème affiché en dernier (applyColorTheme) */
let applied = 'default';

/**
 * @param {string} theme
 * @returns {boolean} Le thème est-il sombre ?
 */
export function isDarkTheme(theme) {
  return DARK_THEMES.has(theme);
}

/**
 * @param {string} theme
 * @returns {string} Le même thème dans l'autre clarté ; Nuit pour un thème inconnu (Classique)
 */
export function counterpartTheme(theme) {
  return COUNTERPARTS.get(theme) ?? 'dark';
}

/** Un thème connu, Classique sinon (ancien « pink », valeur abîmée) */
const knownTheme = theme => (COUNTERPARTS.has(theme) ? theme : 'default');

/** @returns {string} Le thème affiché, que la bascule retourne */
export function appliedColorTheme() {
  return applied;
}

/**
 * Marque le bouton actif d'un groupe (classe .active et aria-pressed).
 * @param {string} selector - Boutons du groupe
 * @param {(btn: Element) => boolean} isActive - Prédicat du bouton sélectionné
 */
function markPressed(selector, isActive) {
  for (const btn of document.querySelectorAll(selector)) {
    const active = isActive(btn);
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  }
}

/**
 * La fête du jour, ou celle de l'essai ?saison=halloween (?saison=aucune : aucune)
 * @param {Date} [date]
 * @returns {import('./seasons.js').Season|null}
 */
export function currentSeason(date = new Date()) {
  const forced = new URLSearchParams(globalThis.location?.search ?? '').get('saison');
  return findSeason(date, forced);
}

/** Thème choisi pendant cette édition de la fête, s'il y en a un */
function seasonChoice(edition) {
  const [savedEdition, theme] = String(localStorage.getItem(SEASON_CHOICE_KEY) ?? '').split(':');
  return savedEdition === edition ? theme : null;
}

/**
 * Thème à afficher. Pendant une fête : celui que l'enfant y a choisi, sinon celui de la fête
 * qui suit la clarté de son thème ordinaire (sombre ou clair, THEME_PAIRS) ;
 * un thème ordinaire choisi pendant la fête la retire jusqu'à la suivante.
 * @param {import('./seasons.js').Season|null} [season]
 * @param {Date} [date]
 * @returns {string}
 */
export function effectiveColorTheme(season = currentSeason(), date = new Date()) {
  const ordinary = knownTheme(localStorage.getItem(COLOR_THEME_KEY));
  if (!season) return ordinary;
  const choice = seasonChoice(seasonEdition(season, date));
  if (choice === SEASON_DECLINED) return ordinary;
  if (Object.values(season.themes).includes(choice)) return choice;
  return DARK_THEMES.has(ordinary) ? season.themes.dark : season.themes.light;
}

/**
 * Retient le thème choisi : un thème de fête ne vaut que pour cette édition et laisse le
 * thème ordinaire intact (il revient seul à la fin de la fête) ; un thème ordinaire choisi
 * pendant une fête la retire jusqu'à la suivante.
 * @param {string} theme
 * @param {import('./seasons.js').Season|null} [season]
 * @param {Date} [date]
 */
export function rememberColorTheme(theme, season = currentSeason(), date = new Date()) {
  const owner = seasonOfTheme(theme);
  if (!owner) localStorage.setItem(COLOR_THEME_KEY, theme);
  if (season) {
    const choice = owner === season ? theme : SEASON_DECLINED;
    localStorage.setItem(SEASON_CHOICE_KEY, `${seasonEdition(season, date)}:${choice}`);
  }
}

/**
 * Seuls les thèmes de la clarté affichée se montrent, et ceux d'une fête pendant cette fête
 * seulement ; l'interrupteur « Mode sombre » suit
 */
function showThemeButtons(season, dark) {
  for (const btn of document.querySelectorAll('.color-theme-btn')) {
    const theme = btn.dataset.colorTheme;
    const owner = seasonOfTheme(theme);
    btn.hidden = isDarkTheme(theme) !== dark || (owner !== null && owner !== season);
  }
  for (const toggle of document.querySelectorAll('.theme-mode-switch')) {
    toggle.setAttribute('aria-checked', String(dark));
  }
}

/**
 * Le costume a changé : têtes, logos des modes, fond et image des héros déjà affichés sont
 * reposés (les écrans construits à l'ouverture, tableau de bord et jeux, le prennent seuls)
 */
function repaintCostumedImages() {
  repaintAvatarHeads();
  repaintModeLogos();
  refreshBackground();
  updateSeoHeroImage();
}

/**
 * Applique un thème : classe du body, boutons pressés, et costume des images (celui de la
 * fête dont c'est un thème, aucun sinon)
 * @param {string} theme
 * @param {import('./seasons.js').Season|null} [season]
 */
export function applyColorTheme(theme, season = currentSeason()) {
  applied = knownTheme(theme);
  document.body.classList.remove(...THEME_CLASSES);
  if (applied !== 'default') document.body.classList.add(`theme-${applied}`);
  showThemeButtons(season, isDarkTheme(applied));
  markPressed('.color-theme-btn', btn => btn.dataset.colorTheme === applied);

  const costume = seasonOfTheme(applied);
  if (costume !== wornSeason()) {
    wearSeason(costume);
    repaintCostumedImages();
  }
}

export function initThemes() {
  const season = currentSeason();
  applyColorTheme(effectiveColorTheme(season), season);
  applyHighContrastMode(localStorage.getItem('highContrastEnabled') === 'true');
  applyFontSize(localStorage.getItem('fontSize') || 'medium');
}

function getMuteButtonTitle(isMuted, translation) {
  const isMissingTranslation =
    typeof translation === 'string' && translation.startsWith('[') && translation.endsWith(']');
  if (isMissingTranslation) {
    return isMuted ? 'Activer le son' : 'Couper le son';
  }
  return translation;
}

/* Repli si la barre du haut n'est pas disponible : même icône et même libellé qu'elle */
function updateMuteButtons(newVolume) {
  const numericVolume = Number(newVolume);
  const isMuted = Number.isNaN(numericVolume) ? false : numericVolume === 0;
  for (const btn of document.querySelectorAll('.mute-btn')) {
    setIcon(btn, isMuted ? 'volume-x' : 'volume-2');
    const key = isMuted ? 'mute_button_label_off' : 'mute_button_label_on';
    const label = getMuteButtonTitle(isMuted, getTranslation(key));
    btn.title = label;
    btn.setAttribute('aria-label', label);
  }
}

function updateVolumeSliders(newVolume) {
  for (const slider of document.querySelectorAll('.volume-slider')) {
    slider.value = newVolume;
  }
}

function updateVolumeControlsFallback(newVolume) {
  updateMuteButtons(newVolume);
  updateVolumeSliders(newVolume);
}

export function updateVolume(newVolume) {
  const numericVolume = Number(newVolume);
  const isMuted = Number.isNaN(numericVolume) ? newVolume === 0 : numericVolume === 0;

  gameState.volume = newVolume;
  gameState.muted = isMuted;

  try {
    AudioManager.setVolume(newVolume);
  } catch {
    /* no-op */
  }

  try {
    TopBar.updateVolumeControls(newVolume, isMuted);
  } catch {
    updateVolumeControlsFallback(newVolume);
  }

  localStorage.setItem('volume', newVolume);
}

export function applyHighContrastMode(enabled) {
  document.body.classList.toggle('high-contrast', enabled);
  localStorage.setItem('highContrastEnabled', enabled);
  const toggle = document.getElementById('high-contrast-toggle');
  if (toggle) {
    toggle.checked = enabled;
  }
}

export function applyFontSize(size) {
  const selected = ['small', 'medium', 'large'].includes(size) ? size : 'medium';
  document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
  document.body.classList.add(`font-size-${selected}`);
  localStorage.setItem('fontSize', selected);
  markPressed('.font-size-btn', btn => btn.dataset.size === selected);
}

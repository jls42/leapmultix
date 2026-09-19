/**
 * Theme and accessibility helpers (extracted from main.js)
 * - initThemes
 * - updateVolume
 * - applyHighContrastMode
 * - applyFontSize
 */

import { getTranslation } from '../utils-es6.js';
import { AudioManager } from './audio.js';
import { TopBar } from '../components/topBar.js';
import { setIcon } from '../components/icons.js';
import { gameState } from '../game.js';

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

export function initThemes() {
  const savedColorTheme = localStorage.getItem('colorTheme') || 'default';
  if (savedColorTheme !== 'default') {
    document.body.classList.add('theme-' + savedColorTheme);
  }
  markPressed('.color-theme-btn', btn => btn.dataset.colorTheme === savedColorTheme);
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
  } catch (e) {
    void e; /* no-op */
  }

  try {
    TopBar.updateVolumeControls(newVolume, isMuted);
  } catch (e) {
    void e;
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

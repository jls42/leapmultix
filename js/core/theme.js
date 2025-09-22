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
import { gameState } from '../game.js';

export function initThemes() {
  const savedColorTheme = localStorage.getItem('colorTheme') || 'default';
  if (savedColorTheme !== 'default') {
    document.body.classList.add('theme-' + savedColorTheme);
  }
  for (const btn of document.querySelectorAll('.color-theme-btn')) {
    const isActive = btn.dataset.colorTheme === savedColorTheme;
    btn.classList.toggle('active', isActive);
    btn.ariaPressed = isActive ? 'true' : 'false';
  }
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

function updateMuteButtons(newVolume) {
  const numericVolume = Number(newVolume);
  const isMuted = Number.isNaN(numericVolume) ? false : numericVolume === 0;
  for (const btn of document.querySelectorAll('.mute-btn')) {
    btn.textContent = isMuted ? '🔇' : '🔊';
    const key = isMuted ? 'mute_button_label_off' : 'mute_button_label_on';
    const translation = getTranslation(key);
    btn.title = getMuteButtonTitle(isMuted, translation);
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
  document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');

  if (['small', 'medium', 'large'].includes(size)) {
    document.body.classList.add(`font-size-${size}`);
    localStorage.setItem('fontSize', size);
    for (const btn of document.querySelectorAll('.font-size-btn')) {
      btn.classList.toggle('active', btn.dataset.size === size);
    }
  } else {
    document.body.classList.add('font-size-medium');
    localStorage.setItem('fontSize', 'medium');
    for (const btn of document.querySelectorAll('.font-size-btn')) {
      btn.classList.toggle('active', btn.dataset.size === 'medium');
    }
  }
}

console.log('🎨 Theme helpers loaded');

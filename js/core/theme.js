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
  document.querySelectorAll('.color-theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.colorTheme === savedColorTheme);
  });
  applyHighContrastMode(localStorage.getItem('highContrastEnabled') === 'true');
  applyFontSize(localStorage.getItem('fontSize') || 'medium');
}

export function updateVolume(newVolume) {
  gameState.volume = newVolume;
  gameState.muted = newVolume === 0;

  try {
    AudioManager.setVolume(newVolume);
  } catch (e) {
    void e; /* no-op */
  }

  try {
    TopBar.updateVolumeControls(newVolume, newVolume === 0);
  } catch (e) {
    void e;
    document.querySelectorAll('.mute-btn').forEach(btn => {
      btn.textContent = newVolume > 0 ? '🔊' : '🔇';
      const key = newVolume > 0 ? 'mute_button_label_on' : 'mute_button_label_off';
      const t = getTranslation(key);
      const missing = typeof t === 'string' && t.startsWith('[') && t.endsWith(']');
      btn.title = missing ? (newVolume > 0 ? 'Couper le son' : 'Activer le son') : t;
    });
    document.querySelectorAll('.volume-slider').forEach(slider => (slider.value = newVolume));
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
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === size);
    });
  } else {
    document.body.classList.add('font-size-medium');
    localStorage.setItem('fontSize', 'medium');
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === 'medium');
    });
  }
}

console.log('🎨 Theme helpers loaded');

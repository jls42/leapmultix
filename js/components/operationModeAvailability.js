/**
 * Gère la disponibilité des modes de jeu selon l'opération sélectionnée
 * Tous les modes supportent les 4 opérations (×, +, −, ÷), Chrono compris depuis la v37.
 * La mécanique d'indisponibilité (tuile désactivée, raison écrite, lancement refusé) reste
 * prête pour un mode qui n'existerait que pour certaines opérations.
 */

import { UserState } from '../core/userState.js';
import { getTranslation } from '../utils-es6.js';

// Modes disponibles par opération
const ALL_MODES = ['discovery', 'quiz', 'challenge', 'adventure', 'arcade', 'chrono'];
const MODE_AVAILABILITY = {
  '×': ALL_MODES,
  '+': ALL_MODES,
  '−': ALL_MODES,
  '÷': ALL_MODES,
};

// Messages d'indisponibilité propres à un mode (aucun aujourd'hui : message général)
const UNAVAILABLE_MESSAGES = {};

/**
 * Vérifie si un mode est disponible pour l'opération actuelle
 * @param {string} mode - Le mode de jeu (discovery, quiz, challenge, adventure, arcade)
 * @param {string} operator - L'opérateur (×, +, −, ÷)
 * @returns {boolean}
 */
export function isModeAvailable(mode, operator = null) {
  const op = operator || UserState.getCurrentUserData().preferredOperator || '×';
  const availableModes = MODE_AVAILABILITY[op] || [];
  return availableModes.includes(mode);
}

/**
 * Obtient le message d'indisponibilité pour un mode
 * @param {string} mode - Le mode de jeu
 * @returns {string|null}
 */
export function getUnavailableMessage(mode) {
  const key = UNAVAILABLE_MESSAGES[mode];
  return key ? getTranslation(key) : getTranslation('mode_not_available_for_operation');
}

/**
 * Raison écrite dans une tuile indisponible, à la place de sa description : le bouton
 * désactivé ne prend pas le focus, une infobulle ne serait vue ni au toucher ni au clavier
 * @param {HTMLElement} btn - Tuile du mode
 * @param {string|null} message - Raison, ou null pour retirer la note
 */
function setUnavailableNote(btn, message) {
  let note = btn.querySelector('.mode-unavailable-note');
  if (!message) {
    note?.remove();
    return;
  }
  if (!note) {
    note = document.createElement('span');
    note.className = 'mode-unavailable-note';
    btn.appendChild(note);
  }
  note.textContent = message;
}

/**
 * Met à jour l'état visuel des boutons de mode selon l'opération
 * Désactive les modes indisponibles et y écrit la raison
 */
export function updateModeButtonsAvailability() {
  const operator = UserState.getCurrentUserData().preferredOperator || '×';
  const modeButtons = document.querySelectorAll('.mode-btn[data-mode]');

  modeButtons.forEach(btn => {
    const mode = btn.dataset.mode;
    if (!mode) return;

    const available = isModeAvailable(mode, operator);

    if (available) {
      // Mode disponible : activer le bouton
      btn.disabled = false;
      btn.classList.remove('mode-unavailable');
      btn.removeAttribute('title');
      btn.style.cursor = 'pointer';
      setUnavailableNote(btn, null);
    } else {
      // Mode indisponible : désactiver visuellement
      // Seule l'illustration s'efface (CSS) : la raison reste lisible
      const message = getUnavailableMessage(mode);
      btn.disabled = true;
      btn.classList.add('mode-unavailable');
      btn.setAttribute('title', message);
      btn.style.cursor = 'not-allowed';
      setUnavailableNote(btn, message);
    }
  });

  console.log(`✓ Disponibilité des modes mise à jour pour l'opération ${operator}`);
}

/**
 * Initialise le système de disponibilité des modes
 * Écoute les changements d'opération et met à jour l'UI
 */
export function initModeAvailability() {
  // Mise à jour initiale
  updateModeButtonsAvailability();

  // Écouter les changements d'opération
  if (globalThis.window !== undefined) {
    globalThis.addEventListener?.('operation-changed', event => {
      console.log('Événement operation-changed détecté:', event.detail);
      updateModeButtonsAvailability();
    });
  }

  console.log('✓ Système de disponibilité des modes initialisé');
}

/**
 * Vérifie si un mode peut être lancé pour l'opération actuelle
 * Affiche une alerte si le mode n'est pas disponible
 * @param {string} mode - Le mode à vérifier
 * @returns {boolean} true si le mode peut être lancé, false sinon
 */
export function canLaunchMode(mode) {
  const operator = UserState.getCurrentUserData().preferredOperator || '×';

  if (!isModeAvailable(mode, operator)) {
    const message = getUnavailableMessage(mode);
    alert(message);
    return false;
  }

  return true;
}

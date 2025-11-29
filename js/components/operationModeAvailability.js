/**
 * Gère la disponibilité des modes de jeu selon l'opération sélectionnée
 * R2: Discovery et Adventure disponibles pour ×, +, −
 * Arcade reste exclusif à la multiplication (R4)
 */

import { UserState } from '../core/userState.js';
import { getTranslation } from '../utils-es6.js';

// Modes disponibles par opération (R2/R3)
const MODE_AVAILABILITY = {
  '×': ['discovery', 'quiz', 'challenge', 'adventure', 'arcade'],
  '+': ['discovery', 'quiz', 'challenge', 'adventure'],
  '−': ['discovery', 'quiz', 'challenge', 'adventure'],
  '÷': ['discovery', 'quiz', 'challenge', 'adventure'], // R3: Division activée
};

// Messages d'indisponibilité
const UNAVAILABLE_MESSAGES = {
  discovery: 'discovery_multiplication_only',
  adventure: 'adventure_multiplication_only',
  arcade: 'arcade_multiplication_only',
};

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
 * Met à jour l'état visuel des boutons de mode selon l'opération
 * Désactive et ajoute un tooltip pour les modes indisponibles
 */
export function updateModeButtonsAvailability() {
  const operator = UserState.getCurrentUserData().preferredOperator || '×';
  const modeButtons = document.querySelectorAll('.mode-btn[data-mode]');

  modeButtons.forEach(btn => {
    const mode = btn.getAttribute('data-mode');
    if (!mode) return;

    const available = isModeAvailable(mode, operator);

    if (available) {
      // Mode disponible : activer le bouton
      btn.disabled = false;
      btn.classList.remove('mode-unavailable');
      btn.removeAttribute('title');
      btn.style.cursor = 'pointer';
      btn.style.opacity = '1';
    } else {
      // Mode indisponible : désactiver visuellement
      btn.disabled = true;
      btn.classList.add('mode-unavailable');
      btn.setAttribute('title', getUnavailableMessage(mode));
      btn.style.cursor = 'not-allowed';
      btn.style.opacity = '0.5';
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
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('operation-changed', event => {
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

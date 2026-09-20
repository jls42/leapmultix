// arcade-message.js - Messages posés sur les jeux d'arcade (ESM)
// L'apparence vient de css/arcade.css (.arcade-toast et ses tons) : ici, seulement
// le texte, le ton et la durée d'affichage.
import { getTranslation } from './i18n.js';
import { speak, isVoiceEnabled } from './speech.js';

/**
 * Tons disponibles, déclinés en classes CSS .arcade-toast--<ton>.
 * Pas de ton « danger » : dans un jeu, une erreur de l'enfant n'est jamais rouge
 * (DESIGN.md) ; une vie perdue ou une mauvaise réponse s'annonce en ton neutre.
 */
export const ARCADE_TONES = Object.freeze(['neutral', 'success', 'warning']);

/**
 * Ramène une valeur quelconque à un ton connu (« neutral » par défaut).
 * @param {string} tone - Ton demandé
 * @returns {string} Ton reconnu
 */
export function resolveArcadeTone(tone) {
  const value = typeof tone === 'string' ? tone.trim().toLowerCase() : '';
  return ARCADE_TONES.includes(value) ? value : 'neutral';
}

/**
 * Traduit une clé ; si elle manque (« [clé] »), renvoie le texte de repli.
 * @param {string} key - Clé de traduction
 * @param {string} [fallback=key] - Texte de repli
 * @returns {string}
 */
export function getArcadeText(key, fallback = key) {
  const value = getTranslation(key);
  if (typeof value !== 'string' || !value || /^\[[^\]]+\]$/.test(value)) return fallback;
  return value;
}

/**
 * Crée l'élément d'un message d'arcade (sans l'insérer).
 * @param {string} text - Texte déjà traduit
 * @param {string} [tone='neutral'] - neutral | success | warning
 * @returns {HTMLDivElement}
 */
export function createArcadeToast(text, tone = 'neutral') {
  const element = document.createElement('div');
  element.className = `arcade-message arcade-toast arcade-toast--${resolveArcadeTone(tone)}`;
  element.textContent = text;
  return element;
}

/**
 * Affiche un court message au centre de la zone de jeu, puis le retire.
 * @param {string} messageKey - Clé de traduction du message
 * @param {string} [tone='neutral'] - neutral | success | warning
 * @param {number} [duration=1500] - Durée d'affichage en millisecondes
 * @param {string} [fallback=messageKey] - Texte affiché si la clé manque
 */
export function showArcadeMessage(
  messageKey,
  tone = 'neutral',
  duration = 1500,
  fallback = messageKey
) {
  const gameContainer = document.getElementById('game');
  if (!gameContainer) return;

  const messageElement = createArcadeToast(getArcadeText(messageKey, fallback), tone);
  gameContainer.appendChild(messageElement);

  try {
    if (isVoiceEnabled()) speak(messageElement.textContent);
  } catch {
    // Erreur ignorée (non-critique)
  }

  setTimeout(() => messageElement.remove(), duration);
}

export default { showArcadeMessage };

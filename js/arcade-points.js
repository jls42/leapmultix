// arcade-points.js - ESM module for displaying arcade point popups
// Extracted from utils.js to enable ES module imports and reduce window.* coupling
// L'apparence vient de css/arcade.css (.arcade-points, --gain, --loss, --at).

import { AudioManager } from './core/audio.js';
import { isArcadeActive } from './arcade.js';
import { canvasToClientPoint } from './arcade-common.js';

// La pastille reste lisible un instant, puis s'efface en montant (transition CSS)
const POINTS_HOLD_MS = 500;
const POINTS_REMOVE_MS = 900;

function playPointsSound(isGain) {
  AudioManager.playSound(isGain ? 'good' : 'bad', { volume: 0.4 });
}

/**
 * Pose la pastille juste au-dessus du point du jeu où les points ont été gagnés
 * ou perdus : elle ne cache ni la question ni le reste du plateau, et deux coups
 * rapprochés ne s'empilent pas au même endroit.
 * @param {HTMLElement} element - Pastille
 * @param {HTMLElement} container - Parent positionné de la pastille (zone de jeu)
 * @param {HTMLCanvasElement} canvas - Canevas du jeu
 * @param {{x: number, y: number}} at - Point en coordonnées internes du canevas
 * @returns {boolean} true si la pastille a été placée
 */
function placeAtGamePoint(element, container, canvas, at) {
  if (!canPlaceAtGamePoint(container, canvas, at)) return false;
  const point = canvasToClientPoint(canvas, at.x, at.y);
  const box = container.getBoundingClientRect();
  const left = point.x - box.left - (container.clientLeft || 0);
  const top = point.y - box.top - (container.clientTop || 0);
  if (!Number.isFinite(left) || !Number.isFinite(top)) return false;
  element.classList.add('arcade-points--at');
  element.style.left = `${Math.round(left)}px`;
  element.style.top = `${Math.round(top)}px`;
  return true;
}

/**
 * Le point de jeu est-il exploitable ? (canevas mesurable, conteneur présent)
 * @param {HTMLElement} container
 * @param {HTMLCanvasElement} canvas
 * @param {{x: number, y: number}} [at]
 * @returns {boolean}
 */
function canPlaceAtGamePoint(container, canvas, at) {
  if (!at || !canvas || !container) return false;
  return typeof canvas.getBoundingClientRect === 'function';
}

/**
 * Affiche les points gagnés ou perdus dans les jeux arcade
 * @param {number} points - Nombre de points (positif pour gain, négatif pour perte)
 * @param {HTMLElement} targetElement - Élément canvas ou autre où afficher l'animation
 * @param {{x: number, y: number}} [at] - Point du jeu concerné (coordonnées internes du canevas)
 */
export function showArcadePoints(points, targetElement, at) {
  if (!isArcadeActive()) return;

  const isGain = points >= 0;
  const messageElement = document.createElement('div');
  messageElement.className = `arcade-points-message arcade-points arcade-points--${isGain ? 'gain' : 'loss'}`;
  // Le signe porte le sens : « − » typographique pour une perte, sans couleur d'alerte
  messageElement.textContent = `${isGain ? '+' : '−'}${Math.abs(points)}`;

  const container = targetElement?.parentNode || document.getElementById('game');
  if (container) {
    container.appendChild(messageElement);
    placeAtGamePoint(messageElement, container, targetElement, at);
  }

  setTimeout(() => messageElement.classList.add('is-leaving'), POINTS_HOLD_MS);
  setTimeout(() => messageElement.remove(), POINTS_REMOVE_MS);

  // Feedback audio direct via AudioManager
  playPointsSound(isGain);
}

/**
 * Affiche une pénalité : les points vraiment retirés, jamais plus.
 * Si le score était déjà à zéro, rien n'est retiré : pas de « −50 » trompeur,
 * seulement le son de la mauvaise réponse.
 * @param {number} removed - Points réellement retirés (0 ou plus)
 * @param {HTMLElement} targetElement - Canevas du jeu
 * @param {{x: number, y: number}} [at] - Point du jeu concerné (coordonnées internes)
 */
export function showArcadePenalty(removed, targetElement, at) {
  if (!isArcadeActive()) return;
  const amount = Math.max(0, Math.round(Number(removed) || 0));
  if (amount > 0) {
    showArcadePoints(-amount, targetElement, at);
    return;
  }
  playPointsSound(false);
}

// No legacy bridge; import from utils-es6.js in modules

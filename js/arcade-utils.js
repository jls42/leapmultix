// Utilitaires pour les jeux d'arcade LeapMultix
// (c) LeapMultix - 2025
// Fichier reconstruit pour corriger les erreurs de cache
import { pickRandom, shuffleInPlace } from './core/random.js';
import { gameState } from './game.js';
import { UserManager } from './userManager.js';
import { spriteFor } from './arcade-sprites.js';
import { avatarSpec } from './arcade-sprite-catalog.js';

// Fonctions d'avatar et monstres

/**
 * Avatar du joueur dans MultiMiam : une seule image, sa source haute définition, tournée
 * à l'écran du côté où il va (js/arcade-sprites.js la charge à la taille où elle s'affiche).
 * @param {string} name - fox, panda, unicorn, dragon ou astronaut
 * @returns {{name: string, sprite: import('./arcade-sprites.js').ArcadeSprite}}
 */
export function loadSingleAvatar(name) {
  return { name, sprite: spriteFor(avatarSpec(name)) };
}

// Fonction pour obtenir des avatars aléatoirement

// Fonction pour obtenir un avatar aléatoire
export function getRandomAvatar(avatars) {
  return pickRandom(avatars);
}

// Fonction pour obtenir l'avatar du joueur
export function getPlayerAvatar(avatars) {
  // Récupérer l'avatar depuis la variable globale avatars dans main.js
  // et gameState.avatar qui contient le nom de l'avatar sélectionné

  // Vérifier si gameState est disponible
  if (!gameState) {
    return avatars[0]; // Retourner le premier avatar disponible
  }

  // Récupérer le nom de l'avatar sélectionné
  const avatarName = gameState.avatar || 'unicorn'; // Licorne par défaut

  // Trouver l'avatar correspondant dans la liste des avatars disponibles
  const playerAvatar = avatars.find(avatar => avatar.name === avatarName);

  if (playerAvatar) {
    return playerAvatar;
  } else {
    return avatars[0]; // Retourner le premier avatar disponible
  }
}

// Fonction pour obtenir des monstres aléatoires
export function getRandomMonsters(monsters, count = 4) {
  const selectedMonsters = [];
  for (let i = 0; i < count; i++) {
    selectedMonsters.push(pickRandom(monsters));
  }
  return selectedMonsters;
}

// === Fonctions de scoring migrées depuis arcade-scores.js ===
const MAX_SCORES = 5;

export function getUserKeyPrefix(baseKey) {
  const user =
    (UserManager && typeof UserManager.getCurrentUser === 'function'
      ? UserManager.getCurrentUser()
      : null) ||
    gameState.currentUser ||
    'default';
  return baseKey + user;
}

export function saveScore(baseKey, score) {
  const key = getUserKeyPrefix(baseKey);
  let scores = JSON.parse(localStorage.getItem(key) || '[]');
  scores.push(Number(score) || 0);
  scores = scores.sort((a, b) => b - a).slice(0, MAX_SCORES);
  localStorage.setItem(key, JSON.stringify(scores));
}

export function getScores(baseKey) {
  return JSON.parse(localStorage.getItem(getUserKeyPrefix(baseKey)) || '[]');
}

export function resetScores(baseKey) {
  localStorage.setItem(getUserKeyPrefix(baseKey), '[]');
}

// Mélange en place (Fisher-Yates)
export function safeShuffleArray(array) {
  return shuffleInPlace(array);
}

// Exports des fonctions de score

export const arcadeUtils = {
  loadSingleAvatar,
  getRandomAvatar,
  getPlayerAvatar,
  getRandomMonsters,
  shuffleArray: safeShuffleArray,
};

export default arcadeUtils;

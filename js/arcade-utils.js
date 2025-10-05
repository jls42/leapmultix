// Utilitaires pour les jeux d'arcade LeapMultix
// (c) LeapMultix - 2025
// Fichier reconstruit pour corriger les erreurs de cache
import { Utils } from './utils-es6.js';
import { gameState } from './game.js';
import { UserManager } from './userManager.js';

// Fonctions d'avatar et monstres

// Fonction pour charger un seul avatar (optimisé pour Pacman)
export function loadSingleAvatar(name) {
  const img = new Image();
  const imgPath = `/assets/images/arcade/${name}_128x128.png`;
  img.src = imgPath;
  img.onload = function () {
    img.loadSuccess = true;
  };
  img.onerror = function () {
    console.error(`Impossible de charger l'image ${name}_128x128.png depuis ${imgPath}`);
    img.loadFailed = true;
  };
  return { name, image: img };
}

// Fonction pour obtenir des avatars aléatoirement

// Fonction pour obtenir un avatar aléatoire
export function getRandomAvatar(avatars) {
  const randomIndex = Math.floor(Math.random() * avatars.length);

  return avatars[randomIndex];
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
    const randomIndex = Math.floor(Math.random() * monsters.length);

    selectedMonsters.push(monsters[randomIndex]);
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

// Fonction shuffle sécurisée
export function safeShuffleArray(array) {
  if (Utils?.shuffleArray) {
    return Utils.shuffleArray(array);
  }
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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

/**
 * Arcade scores helpers (ESM)
 * Centralized helpers to save/get/reset per-user arcade scores (Top 5)
 * Exposes window bridges for legacy compatibility.
 */
import { UserState } from './core/userState.js';

function getCurrentUserId() {
  try {
    // ESM path: use UserState current user's nickname if available
    const name = UserState.getCurrentUserData()?.nickname;
    if (name && String(name).trim()) return String(name).trim();
  } catch {
    // Erreur ignorée (non-critique)
  }
  return 'default';
}

export function saveArcadeScore(score, prefix = 'arcadeScores_') {
  const user = getCurrentUserId();
  let arcadeScores;
  try {
    arcadeScores = JSON.parse(localStorage.getItem(prefix + user) || '[]');
  } catch {
    arcadeScores = [];
  }
  arcadeScores.push(Number(score) || 0);
  arcadeScores = arcadeScores.sort((a, b) => b - a).slice(0, 5);
  localStorage.setItem(prefix + user, JSON.stringify(arcadeScores));
}

export function getArcadeScores(prefix = 'arcadeScores_') {
  const user = getCurrentUserId();
  try {
    return JSON.parse(localStorage.getItem(prefix + user) || '[]');
  } catch {
    return [];
  }
}

export function resetArcadeScores(prefix = 'arcadeScores_') {
  const user = getCurrentUserId();
  localStorage.setItem(prefix + user, '[]');
}

// Specific wrappers
export function saveArcadeScoreSnake(score) {
  saveArcadeScore(score, 'arcadeScores_multisnake_');
}
export function getArcadeScoresSnake() {
  return getArcadeScores('arcadeScores_multisnake_');
}
export function resetArcadeScoresSnake() {
  resetArcadeScores('arcadeScores_multisnake_');
}

export function saveArcadeScorePacman(score) {
  saveArcadeScore(score, 'arcadeScores_multimiam_');
}
export function getArcadeScoresPacman() {
  return getArcadeScores('arcadeScores_multimiam_');
}
export function resetArcadeScoresPacman() {
  resetArcadeScores('arcadeScores_multimiam_');
}

export function saveArcadeScoreMemory(score) {
  saveArcadeScore(score, 'arcadeScores_multimemory_');
}
export function getArcadeScoresMemory() {
  return getArcadeScores('arcadeScores_multimemory_');
}
export function resetArcadeScoresMemory() {
  resetArcadeScores('arcadeScores_multimemory_');
}

// No global bridges; import functions via ESM

export default {
  saveArcadeScore,
  getArcadeScores,
  resetArcadeScores,
  saveArcadeScoreSnake,
  getArcadeScoresSnake,
  resetArcadeScoresSnake,
  saveArcadeScorePacman,
  getArcadeScoresPacman,
  resetArcadeScoresPacman,
  saveArcadeScoreMemory,
  getArcadeScoresMemory,
  resetArcadeScoresMemory,
};

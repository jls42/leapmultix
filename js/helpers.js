// helpers.js
// Fonctions d'accès et sauvegarde des données utilisateur.
// Regroupe getCurrentUserData et saveCurrentUserData.

import { UserState } from './core/userState.js';

export function getCurrentUserData() {
  return UserState.getCurrentUserData();
}

export function saveCurrentUserData(gameState) {
  return UserState.updateUserData(gameState);
}

/**
 * Fenêtre de confirmation du jeu (js/components/confirm-dialog.js), vue d'un test : la
 * question affichée, et la réponse qu'y donnerait l'enfant.
 */

/** @returns {HTMLElement|null} La fenêtre ouverte */
export const openDialog = () => document.querySelector('[role="alertdialog"]');

/** @returns {string|null} Le texte de la question ouverte (sous son titre) */
export const dialogQuestion = () =>
  openDialog()?.querySelector('.confirm-dialog-message')?.textContent ?? null;

/**
 * Répond à la fenêtre ouverte, puis laisse passer la suite (promesses de la réponse)
 * @param {boolean} confirmed - true : « Abandonner » ; false : « Continuer la partie »
 * @returns {Promise<void>}
 */
export async function answerDialog(confirmed) {
  const dialog = openDialog();
  if (!dialog) throw new Error('Aucune fenêtre de confirmation ouverte');
  dialog.querySelector(`[data-answer="${confirmed ? 'confirm' : 'cancel'}"]`).click();
  for (let turn = 0; turn < 10; turn += 1) await Promise.resolve();
}

/** Ferme une fenêtre restée ouverte (test en échec) : elle garderait les touches des suivants */
export function closeOpenDialog() {
  openDialog()?.querySelector('[data-answer="cancel"]')?.click();
}

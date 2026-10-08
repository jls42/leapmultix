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
 * Tours de la file des promesses, l'un après l'autre : la suite d'une réponse en enchaîne
 * plusieurs. Sans minuterie, pour les tests aux minuteries simulées.
 * @param {number} turns
 * @returns {Promise<void>}
 */
const flushPromises = turns =>
  turns > 0 ? Promise.resolve().then(() => flushPromises(turns - 1)) : Promise.resolve();

/**
 * Répond à la fenêtre ouverte, puis laisse passer la suite (promesses de la réponse)
 * @param {boolean} confirmed - true : « Abandonner » ; false : « Continuer la partie »
 * @returns {Promise<void>}
 */
export async function answerDialog(confirmed) {
  const dialog = openDialog();
  if (!dialog) throw new Error('Aucune fenêtre de confirmation ouverte');
  dialog.querySelector(`[data-answer="${confirmed ? 'confirm' : 'cancel'}"]`).click();
  await flushPromises(10);
}

/** Ferme une fenêtre restée ouverte (test en échec) : elle garderait les touches des suivants */
export function closeOpenDialog() {
  openDialog()?.querySelector('[data-answer="cancel"]')?.click();
}

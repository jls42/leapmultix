/**
 * Parcours commun des tests E2E : créer un joueur, l'ouvrir et passer l'intro vidéo, jusqu'au
 * menu des modes
 * @param {import('puppeteer').Page} page
 */
async function createUserAndSkipIntro(page) {
  await page.waitForSelector('#new-user-name', { visible: true, timeout: 10000 });
  await page.type('#new-user-name', 'TestUser-' + Date.now());
  await page.click('#create-user-btn');
  await page.waitForSelector('.user-container .user-tile', { visible: true, timeout: 10000 });
  const users = await page.$$('.user-container .user-tile');
  await users[0].click();
  await page.waitForSelector('#character-intro-modal', { visible: true, timeout: 10000 });
  await page.evaluate(() => document.getElementById('skip-intro-btn')?.click());
  await page.waitForFunction(
    () => document.querySelector('#character-intro-modal')?.style.display === 'none',
    { timeout: 10000 }
  );
  await page.waitForSelector('.mode-btn[data-mode="quiz"]', { visible: true, timeout: 10000 });
}

/**
 * Répond à la fenêtre de confirmation du jeu (js/components/confirm-dialog.js), puis attend
 * qu'elle se ferme
 * @param {import('puppeteer').Page} page
 * @param {boolean} confirmed - true : « Abandonner » ; false : « Continuer la partie »
 */
async function answerGameDialog(page, confirmed) {
  const answer = confirmed ? 'confirm' : 'cancel';
  const button = await page.waitForSelector(`[role="alertdialog"] [data-answer="${answer}"]`, {
    visible: true,
    timeout: 5000,
  });
  await button.evaluate(el => el.click());
  await page.waitForFunction(() => !document.querySelector('[role="alertdialog"]'), {
    timeout: 5000,
  });
}

/**
 * La fenêtre de confirmation ouverte : sa question et le bouton qui a le focus
 * @param {import('puppeteer').Page} page
 * @returns {Promise<{question: string|null, focused: string|null}|null>} null : pas de fenêtre
 */
function gameDialogState(page) {
  return page.evaluate(() => {
    const dialog = document.querySelector('[role="alertdialog"]');
    return (
      dialog && {
        question: dialog.querySelector('.confirm-dialog-message')?.textContent ?? null,
        focused: document.activeElement?.dataset.answer ?? null,
      }
    );
  });
}

module.exports = { createUserAndSkipIntro, answerGameDialog, gameDialogState };

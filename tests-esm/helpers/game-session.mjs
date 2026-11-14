/**
 * Parcours commun des tests E2E : créer un joueur, l'ouvrir et passer l'intro vidéo, jusqu'au
 * menu des modes
 * @param {import('puppeteer').Page} page
 */
export async function createUserAndSkipIntro(page) {
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
export async function answerGameDialog(page, confirmed) {
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
export function gameDialogState(page) {
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

/** Laisse au jeu le temps de dessiner ou d'animer */
export const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Appuie sur un bouton de navigation. Clic direct : juste après un changement d'écran,
 * l'émulation décale un instant la zone visible et un toucher calculé tomberait à côté.
 * Seuls les gestes testés passent par l'écran tactile.
 * @param {import('puppeteer').Page} page
 * @param {string} selector
 */
export async function pressButton(page, selector) {
  const button = await page.waitForSelector(selector, { visible: true, timeout: 10000 });
  await button.evaluate(el => el.click());
}

/**
 * Lance un mini-jeu depuis le menu Arcade : déplier sa tuile, puis « Jouer »
 * @param {import('puppeteer').Page} page
 * @param {string} game - data-game de la tuile du jeu
 */
export async function launchArcadeGame(page, game) {
  const card = `.arcade-game-card[data-game="${game}"]`;
  await page.waitForSelector(card, { visible: true, timeout: 10000 });
  const expanded = await page.$eval(card, el => el.classList.contains('expanded'));
  if (!expanded) await pressButton(page, `${card} .arcade-game-toggle`);
  await pressButton(page, `${card} .play-arcade-btn`);
  await page.waitForSelector('#game canvas', { visible: true, timeout: 10000 });
}

/**
 * Retour au menu Arcade : « Abandonner », confirmé (règle de sortie, js/game-exit.js), puis
 * « Retour au menu Arcade »
 * @param {import('puppeteer').Page} page
 */
export async function backToArcadeMenu(page) {
  await pressButton(page, '#game [id$="abandon-btn"]');
  await answerGameDialog(page, true);
  await pressButton(page, '#arcade-back-btn');
}

/**
 * Tête du serpent de MultiSnake, publiée par le jeu sur son plateau à chaque pas : direction
 * (up, down, left, right), centre de sa case et taille d'une case, en pixels de la fenêtre
 * @param {import('puppeteer').Page} page
 * @returns {Promise<{heading: string, x: number, y: number, cell: number}>}
 */
export async function snakeHead(page) {
  await page.waitForFunction(
    () => document.querySelector('#multisnake-canvas')?.dataset.snakeHeading,
    { timeout: 8000 }
  );
  return page.$eval('#multisnake-canvas', canvas => ({
    heading: canvas.dataset.snakeHeading,
    x: Number(canvas.dataset.snakeHeadX),
    y: Number(canvas.dataset.snakeHeadY),
    cell: Number(canvas.dataset.snakeCell),
  }));
}

/**
 * Attend que le serpent monte, la tête au-dessus d'une hauteur (relevé à chaque pas : sur une
 * machine chargée, il finirait par faire le tour du plateau)
 * @param {import('puppeteer').Page} page
 * @param {number} startY - Hauteur de la tête au départ (pixels de la fenêtre)
 * @returns {Promise<boolean>} Vrai si la tête est montée à temps
 */
export function snakeTurnedUp(page, startY) {
  return page
    .waitForFunction(
      y => {
        const data = document.querySelector('#multisnake-canvas')?.dataset;
        return data?.snakeHeading === 'up' && Number(data.snakeHeadY) < y;
      },
      { timeout: 3000 },
      startY
    )
    .then(() => true)
    .catch(() => false);
}

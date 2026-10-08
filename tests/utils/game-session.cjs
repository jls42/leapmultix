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

module.exports = { createUserAndSkipIntro };

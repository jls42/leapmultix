/**
 * Tests E2E - Rien ne bouge à l'arrivée de la barre du haut sur « Qui joue ? ».
 * La barre est posée par un composant chargé après le premier affichage : sa place est
 * réservée dans index.html, à la hauteur des vraies touches. Sans cette réserve, elle poussait
 * la carte de 146 px sur téléphone (décalage de 0,27, compté par les outils de mesure du Web).
 * @jest-environment node
 */

import { describe, expect, test } from '@jest/globals';
import { chromeSession } from '../helpers/chrome-session.mjs';
import { createUserAndSkipIntro } from '../helpers/game-session.mjs';
import { NO_SEASON } from '../../js/core/seasons.js';

/**
 * Avant tout script du site : un visiteur sans joueur, et les positions relevées dès que le
 * document est lu. Le test compare des positions, pas le décalage cumulé que mesure le
 * navigateur : sur une machine chargée, celui-ci compte aussi des écarts passagers qui ne
 * viennent pas de la barre (les feuilles de style sont redemandées avec leur version).
 */
function watchFirstPaint() {
  localStorage.clear();
  // Positions relevées avant les scripts du site, pour les comparer une fois tout arrivé
  globalThis.__layout = () => {
    const box = selector => document.querySelector(selector)?.getBoundingClientRect();
    const bar = document.querySelector('#slide0 > .top-bar');
    return {
      placeholder: bar.hasAttribute('data-top-bar-placeholder'),
      barHeight: Math.round(bar.getBoundingClientRect().height),
      cardTop: Math.round(box('#slide0 > .content-card').top),
      // Sous la liste des joueurs : bouge si la ligne « Aucun joueur » n'est pas écrite d'avance
      newPlayerTop: Math.round(box('#slide0 .new-player').top),
      // Change si le bouton d'enregistrement n'est pas masqué d'avance
      backupActionsHeight: Math.round(box('#slide0 .players-backup-actions').height),
    };
  };
  document.addEventListener('DOMContentLoaded', () => {
    globalThis.__before = globalThis.__layout();
  });
}

describe('Premier affichage de « Qui joue ? » (E2E)', () => {
  const chrome = chromeSession('load');

  test.each([
    [
      'téléphone',
      { width: 412, height: 823, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    ],
    [
      'petit téléphone',
      { width: 360, height: 640, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    ],
    ['tablette tournée', { width: 1024, height: 768, deviceScaleFactor: 1 }],
    ['ordinateur', { width: 1280, height: 800, deviceScaleFactor: 1 }],
  ])(
    '%s : la barre arrive à la place réservée, à la même hauteur, sans pousser la carte',
    async (_name, viewport) => {
      const page = await chrome.newPage();
      await page.setViewport(viewport);
      await page.evaluateOnNewDocument(watchFirstPaint);
      await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
      // La vraie barre (son menu) a remplacé la réserve
      await page.waitForSelector('#slide0 > .top-bar:not([data-top-bar-placeholder])', {
        timeout: 30000,
      });
      // La page est posée : deux relevés de suite identiques (les feuilles de style, redemandées
      // avec leur version, peuvent encore arriver sur une machine chargée)
      await page.waitForFunction(
        () => {
          const now = JSON.stringify(globalThis.__layout());
          const settled = now === globalThis.__lastLayout;
          globalThis.__lastLayout = now;
          return settled;
        },
        { polling: 300, timeout: 20000 }
      );
      const seen = await page.evaluate(() => ({
        before: globalThis.__before,
        after: globalThis.__layout(),
        bars: document.querySelectorAll('#slide0 > .top-bar').length,
        placeholderLeft: document.querySelectorAll('[data-top-bar-placeholder]').length,
        empty: document.querySelector('#user-list .user-list-empty')?.textContent.trim(),
      }));
      expect(seen.before.placeholder).toBe(true);
      expect([seen.bars, seen.placeholderLeft]).toEqual([1, 0]);
      // Tout est à la même place qu'avant l'arrivée des scripts : la barre a la hauteur
      // réservée, la carte, le formulaire et les boutons de sauvegarde n'ont pas bougé
      expect(seen.after).toEqual({ ...seen.before, placeholder: false });
      expect(seen.empty).toBe('Aucun joueur pour l’instant.');
    },
    60000
  );

  test('visiteur connu : ses joueurs remplacent la ligne « Aucun joueur », et le bouton pour les enregistrer revient', async () => {
    const page = await chrome.newPage();
    await page.setViewport({
      width: 412,
      height: 823,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
    // Nouveau visiteur : rien à enregistrer, le bouton est masqué, comme écrit dans index.html
    await page.waitForSelector('#slide0 > .top-bar:not([data-top-bar-placeholder])');
    expect(await page.$eval('#export-players-btn', button => button.hidden)).toBe(true);

    await createUserAndSkipIntro(page);
    await page.goto(`${chrome.server.url}?saison=${NO_SEASON}`, chrome.server.gotoOptions);
    await page.waitForSelector('#user-list .user-tiles', { visible: true });
    const known = await page.evaluate(() => ({
      empty: document.querySelectorAll('#user-list .user-list-empty').length,
      tiles: document.querySelectorAll('#user-list .user-tiles > *').length,
      exportShown: !document.getElementById('export-players-btn').hidden,
    }));
    expect(known).toEqual({ empty: 0, tiles: 1, exportShown: true });
  }, 60000);
});

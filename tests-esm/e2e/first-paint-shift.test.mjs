/**
 * Tests E2E - Rien ne bouge à l'arrivée de la barre du haut sur « Qui joue ? ».
 * La barre est posée par un composant chargé après le premier affichage : sa place est
 * réservée dans index.html, à la hauteur des vraies touches. Sans cette réserve, elle poussait
 * la carte de 146 px sur téléphone (décalage de 0,27, compté par les outils de mesure du Web).
 *
 * Le test compare des positions au repos, pas le décalage cumulé que mesure le navigateur :
 * celui-ci compte aussi des écarts passagers qui ne viennent pas de la barre (les feuilles de
 * style sont redemandées avec leur version, la page perd parfois ses styles un instant).
 * État « avant » : le composant retenu, la page posée. État « après » : chargement normal.
 * @jest-environment node
 */

import { describe, expect, test } from '@jest/globals';
import { chromeSession } from '../helpers/chrome-session.mjs';
import { createUserAndSkipIntro } from '../helpers/game-session.mjs';
import { NO_SEASON } from '../../js/core/seasons.js';

const PHONE = { width: 412, height: 823, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

/** Avant tout script du site : un visiteur sans joueur, et de quoi relever les positions */
function prepare() {
  localStorage.clear();
  globalThis.__layout = () => {
    const box = selector => document.querySelector(selector)?.getBoundingClientRect();
    const bar = document.querySelector('#slide0 > .top-bar');
    return {
      placeholder: bar.hasAttribute('data-top-bar-placeholder'),
      barHeight: Math.round(bar.getBoundingClientRect().height),
      cardTop: Math.round(box('#slide0 > .content-card').top),
      // Sous la liste des joueurs : bouge si la place de la ligne « Aucun joueur » n'est pas tenue
      newPlayerTop: Math.round(box('#slide0 .new-player').top),
      // Change si le bouton d'enregistrement n'est pas masqué d'avance
      backupActionsHeight: Math.round(box('#slide0 .players-backup-actions').height),
    };
  };
}

describe('Premier affichage de « Qui joue ? » (E2E)', () => {
  const chrome = chromeSession('load');
  const home = () => `${chrome.server.url}?saison=${NO_SEASON}`;

  /** Positions une fois la page posée : deux relevés de suite identiques */
  const settledLayout = async page => {
    await page.waitForFunction(
      () => {
        const now = JSON.stringify(globalThis.__layout());
        const settled = now === globalThis.__lastLayout;
        globalThis.__lastLayout = now;
        return settled;
      },
      { polling: 300, timeout: 20000 }
    );
    return page.evaluate(() => ({
      layout: globalThis.__layout(),
      list: document.getElementById('user-list').textContent.trim(),
      bars: document.querySelectorAll('#slide0 > .top-bar').length,
    }));
  };

  /** La page telle qu'elle reste tant que le composant de la barre n'est pas arrivé */
  const beforeScripts = async viewport => {
    const page = await chrome.newPage();
    await page.setViewport(viewport);
    // Le service worker servirait le script retenu depuis son cache
    await page.setBypassServiceWorker(true);
    await page.setRequestInterception(true);
    page.on('request', request =>
      request.url().includes('/js/main-es6.js') ? request.abort() : request.continue()
    );
    await page.evaluateOnNewDocument(prepare);
    await page.goto(home(), chrome.server.gotoOptions);
    return settledLayout(page);
  };

  /** La page chargée normalement, la vraie barre arrivée */
  const afterScripts = async viewport => {
    const page = await chrome.newPage();
    await page.setViewport(viewport);
    await page.evaluateOnNewDocument(prepare);
    await page.goto(home(), chrome.server.gotoOptions);
    await page.waitForSelector('#slide0 > .top-bar:not([data-top-bar-placeholder])', {
      timeout: 30000,
    });
    return settledLayout(page);
  };

  test.each([
    ['téléphone', PHONE],
    [
      'petit téléphone',
      { width: 360, height: 640, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    ],
    [
      'téléphone tourné',
      { width: 844, height: 390, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    ],
    ['tablette tournée', { width: 1024, height: 768, deviceScaleFactor: 1 }],
    ['ordinateur', { width: 1280, height: 800, deviceScaleFactor: 1 }],
  ])(
    '%s : la barre arrive à la place réservée, à la même hauteur, sans pousser la carte',
    async (_name, viewport) => {
      const before = await beforeScripts(viewport);
      expect([before.layout.placeholder, before.bars]).toEqual([true, 1]);
      // La place de la phrase « Aucun joueur » est tenue par une ligne vide : la phrase
      // n'arrive qu'avec la liste (écrite d'avance, un visiteur qui a ses joueurs la lirait
      // à tort)
      expect(before.list).toBe('');

      const after = await afterScripts(viewport);
      expect([after.layout.placeholder, after.bars]).toEqual([false, 1]);
      expect(after.list).toBe('Aucun joueur pour l’instant.');
      // Tout est à la même place : la barre a la hauteur réservée ; la carte, le formulaire
      // et les boutons de sauvegarde n'ont pas bougé
      expect(after.layout).toEqual({ ...before.layout, placeholder: false });
    },
    90000
  );

  test('sans feuilles de style, la barre réservée ne prend aucune place', async () => {
    // La page est parfois peinte un instant sans ses styles : la réserve ne doit pas y
    // pousser le contenu (sans l'attribut hidden, son icône nue occupait des centaines de px)
    const page = await chrome.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    // Le service worker posé par les tests d'avant servirait les feuilles depuis son cache
    await page.setBypassServiceWorker(true);
    await page.setRequestInterception(true);
    page.on('request', request =>
      request.resourceType() === 'stylesheet' ? request.abort() : request.continue()
    );
    await page.evaluateOnNewDocument(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const reserved = document.querySelector('#slide0 > [data-top-bar-placeholder]');
        globalThis.__unstyled = reserved ? reserved.getBoundingClientRect().height : -1;
      });
    });
    await page.goto(home(), { waitUntil: 'domcontentloaded' });
    expect(await page.evaluate(() => globalThis.__unstyled)).toBe(0);
  }, 60000);

  test('visiteur connu : ses joueurs remplacent la ligne vide, et le bouton pour les enregistrer revient', async () => {
    const page = await chrome.newPage();
    await page.setViewport(PHONE);
    await page.evaluateOnNewDocument(() => {
      // Visiteur sans joueur au premier passage seulement
      if (!sessionStorage.getItem('seen')) localStorage.clear();
      sessionStorage.setItem('seen', '1');
    });
    await page.goto(home(), chrome.server.gotoOptions);
    // Nouveau visiteur : rien à enregistrer, le bouton est masqué, comme écrit dans index.html
    await page.waitForSelector('#slide0 > .top-bar:not([data-top-bar-placeholder])');
    expect(await page.$eval('#export-players-btn', button => button.hidden)).toBe(true);

    await createUserAndSkipIntro(page);
    await page.goto(home(), chrome.server.gotoOptions);
    await page.waitForSelector('#user-list .user-tiles', { visible: true });
    const known = await page.evaluate(() => ({
      empty: document.querySelectorAll('#user-list .user-list-empty').length,
      tiles: document.querySelectorAll('#user-list .user-tiles > *').length,
      exportShown: !document.getElementById('export-players-btn').hidden,
    }));
    expect(known).toEqual({ empty: 0, tiles: 1, exportShown: true });
  }, 60000);
});

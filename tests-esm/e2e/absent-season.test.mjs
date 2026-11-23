/**
 * Tests E2E - Fête absente d'une copie du jeu. L'appli Android n'embarque pas les images d'une
 * fête lointaine et le dit dans la balise <meta name="leapmultix-seasons-absent"> ; le jeu ne
 * doit alors plus rien demander de cette fête, même forcée par ?saison= : ni thème, ni tête,
 * ni fond, ni image d'un jeu. Le premier passage, sans la balise, prouve que le parcours
 * demande bien des images de fête : sans lui, le second ne prouverait rien.
 * @jest-environment node
 */

import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  backToArcadeMenu,
  createUserAndSkipIntro,
  launchArcadeGame,
  pause,
  pressButton,
} from '../helpers/game-session.mjs';
import { chromeSession } from '../helpers/chrome-session.mjs';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../../..');
const EMPTY_META = '<meta name="leapmultix-seasons-absent" content="" />';
const PHONE = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

/** La page du site telle que la construction de l'appli la réécrit : ces fêtes sont absentes */
async function declareAbsent(page, seasons) {
  const source = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const body = source.replace(EMPTY_META, EMPTY_META.replace('""', `"${seasons}"`));
  if (body === source) throw new Error('balise des fêtes absentes introuvable dans index.html');
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (new URL(request.url()).pathname === '/index.html') {
      request.respond({ status: 200, contentType: 'text/html; charset=utf-8', body });
    } else {
      request.continue();
    }
  });
}

/** Accueil, menu de l'Arcade, une partie de MultiSnake puis de MultiMiam : ce que la page demande */
async function visit(page, url) {
  const asked = [];
  page.on('request', request => asked.push(new URL(request.url()).pathname));
  await page.setBypassServiceWorker(true);
  await page.setViewport(PHONE);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
  await createUserAndSkipIntro(page);
  await pause(500);
  await pressButton(page, '.mode-btn[data-mode="arcade"]');
  for (const game of ['multisnake', 'multimiam']) {
    await launchArcadeGame(page, game);
    await pause(1500);
    await backToArcadeMenu(page);
  }
  return {
    festive: asked.filter(pathname => pathname.includes('halloween')),
    images: asked.filter(pathname => /\.(?:webp|png)$/.test(pathname)).length,
    themes: await page.evaluate(() =>
      [...document.body.classList].filter(name => name.startsWith('theme-'))
    ),
  };
}

describe('Fête absente de cette copie du jeu (E2E)', () => {
  const chrome = chromeSession();

  test('sans la balise, ?saison=halloween habille le jeu : le parcours demande ses images', async () => {
    const page = await chrome.newPage();
    const seen = await visit(page, `${chrome.server.url}?saison=halloween`);
    expect(seen.themes).toEqual(['theme-pumpkin']);
    expect(seen.festive.length).toBeGreaterThan(5);
  }, 90000);

  test('Halloween absent : aucune requête pour lui, thème ordinaire, le jeu garde ses images', async () => {
    const page = await chrome.newPage();
    await declareAbsent(page, 'halloween');
    const seen = await visit(page, `${chrome.server.url}?saison=halloween`);
    expect(seen.festive).toEqual([]);
    expect(seen.themes).toEqual([]);
    expect(seen.images).toBeGreaterThan(20);
  }, 90000);

  test('une autre fête que l’absente s’applique toujours', async () => {
    const page = await chrome.newPage();
    await declareAbsent(page, 'halloween');
    const asked = [];
    page.on('request', request => asked.push(new URL(request.url()).pathname));
    await page.setBypassServiceWorker(true);
    await page.setViewport(PHONE);
    await page.goto(`${chrome.server.url}?saison=christmas`, chrome.server.gotoOptions);
    await createUserAndSkipIntro(page);
    await pause(500);
    expect(await page.evaluate(() => document.body.classList.contains('theme-snow'))).toBe(true);
    expect(asked.some(pathname => pathname.includes('christmas'))).toBe(true);
    expect(asked.filter(pathname => pathname.includes('halloween'))).toEqual([]);
  }, 60000);
});

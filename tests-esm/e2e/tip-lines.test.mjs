/**
 * Tests E2E - Une astuce en deux parties (« \n » dans la traduction) s'affiche sur deux lignes,
 * dans le vrai Chrome : la seconde partie commence sa propre ligne, au bord gauche du texte.
 * - Découverte, table de 5 : l'indice donné par la mascotte (css/discovery-mode.css) ;
 * - explication après une erreur (Quiz, Aventure) : la ligne « Indice » (css/game.css).
 * @jest-environment node
 */

import { beforeEach, describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createUserAndSkipIntro } from '../helpers/game-session.mjs';
import { chromeSession } from '../helpers/chrome-session.mjs';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../../..');

const FR = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/translations/fr.json'), 'utf8'));
const [, SECOND_TIP] = FR.mnemonic_5.split('\n');

/**
 * Où la seconde partie du texte commence, à l'écran : la ligne du dernier caractère de la
 * première partie, celle du premier caractère de la seconde et son écart au bord gauche du
 * paragraphe. null si le texte n'a pas de « \n ».
 */
function secondPartStart(page, selector) {
  return page.$eval(selector, el => {
    const node = [...el.childNodes].find(child => child.nodeType === Node.TEXT_NODE);
    const cut = node?.textContent.indexOf('\n') ?? -1;
    if (cut < 1) return null;
    const rectAt = index => {
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + 1);
      return range.getClientRects()[0];
    };
    const end = rectAt(cut - 1);
    const start = rectAt(cut + 1);
    return {
      text: node.textContent.slice(cut + 1),
      endOfFirstTop: Math.round(end.top),
      startTop: Math.round(start.top),
      startLeft: Math.round(start.left - el.closest('p').getBoundingClientRect().left),
    };
  });
}

/** La seconde astuce commence une nouvelle ligne, au bord gauche */
function expectOwnLine(start) {
  expect(start).not.toBeNull();
  expect(start.text.startsWith(SECOND_TIP.split(/\s/u)[0])).toBe(true);
  expect(start.startTop).toBeGreaterThan(start.endOfFirstTop);
  expect(Math.abs(start.startLeft)).toBeLessThanOrEqual(1);
}

describe('Astuce en deux parties (E2E)', () => {
  const chrome = chromeSession();
  let page;

  beforeEach(async () => {
    page = await chrome.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(chrome.server.url, chrome.server.gotoOptions);
    await createUserAndSkipIntro(page);
  }, 40000);

  test('la table de 5 a une seconde astuce, après un « \\n »', () => {
    expect(SECOND_TIP).toBeDefined();
  });

  test('Découverte, table de 5 : la seconde astuce commence sa propre ligne', async () => {
    await page.click('.mode-btn[data-mode="discovery"]');
    const table = await page.waitForSelector('.lab-item[data-table="5"]', { visible: true });
    await table.click();
    await page.waitForSelector('.mnemonic-tip p', { visible: true });

    expectOwnLine(await secondPartStart(page, '.mnemonic-tip p'));
  });

  test('explication d’une erreur : la seconde astuce commence sa propre ligne', async () => {
    await page.evaluate(async hint => {
      const url = new URL('js/security-utils.js', document.baseURI).href;
      const { setSafeComplexFeedback } = await import(url);
      const box = document.createElement('div');
      box.id = 'tip-lines-explain';
      (document.querySelector('.slide.active-slide') ?? document.body).append(box);
      setSafeComplexFeedback(box, 'La bonne réponse est 10.', hint, '', { lead: 'Raté !' });
    }, FR.mnemonic_5);

    expectOwnLine(await secondPartStart(page, '#tip-lines-explain .quiz-hint-inline span'));
  });
});

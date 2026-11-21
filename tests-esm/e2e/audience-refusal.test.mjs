/**
 * Tests E2E - Refus de la mesure d'audience, dans Chrome : le bouton de la politique de
 * confidentialité retient le refus sur l'appareil, il tient après un rechargement, et le
 * traceur de Plausible servi par le site n'envoie plus rien tant que le refus est là.
 * @jest-environment node
 */

import { describe, expect, test } from '@jest/globals';
import { chromeSession } from '../helpers/chrome-session.mjs';
import { createUserAndSkipIntro } from '../helpers/game-session.mjs';
import { NO_SEASON } from '../../js/core/seasons.js';

const POLICY = '#slide10.active-slide';
const BUTTON = `${POLICY} [data-audience-toggle]`;
const STATUS = `${POLICY} [data-audience-status]`;

/** Clés de traduction du bouton et de la phrase d'état, et ce que l'appareil a retenu */
const choiceState = page =>
  page.evaluate(
    (button, status) => ({
      button: document.querySelector(button).dataset.translate,
      status: document.querySelector(status).dataset.translate,
      stored: localStorage.getItem('plausible_ignore'),
    }),
    BUTTON,
    STATUS
  );

describe('Refus de la mesure d’audience (E2E)', () => {
  const session = chromeSession();

  /** La politique de confidentialité, ouverte comme depuis « À propos » */
  async function openPolicy(page) {
    await page.evaluate(async () => (await import('/js/slides.js')).goToSlide(10));
    await page.waitForSelector(BUTTON, { visible: true, timeout: 10000 });
  }

  test('le bouton retient le refus, le dit, et le refus tient après un rechargement', async () => {
    const page = await session.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`${session.server.url}?saison=${NO_SEASON}`, session.server.gotoOptions);
    await createUserAndSkipIntro(page);
    await openPolicy(page);
    expect(await choiceState(page)).toEqual({
      button: 'audience_choice_refuse',
      status: 'audience_status_counted',
      stored: null,
    });
    // Une cible de 44 px au moins, qui tient dans l'écran d'un téléphone
    const box = await (await page.$(BUTTON)).boundingBox();
    expect(Math.floor(box.height)).toBeGreaterThanOrEqual(44);
    expect(box.x + box.width).toBeLessThanOrEqual(390);

    await page.tap(BUTTON);
    const refused = {
      button: 'audience_choice_resume',
      status: 'audience_status_refused',
      stored: 'true',
    };
    expect(await choiceState(page)).toEqual(refused);

    await page.reload(session.server.gotoOptions);
    await page.waitForSelector('.user-container .user-tile', { visible: true, timeout: 10000 });
    await openPolicy(page);
    expect(await choiceState(page)).toEqual(refused);

    // Au clavier : le bouton lève le refus
    await page.focus(BUTTON);
    await page.keyboard.press('Enter');
    expect((await choiceState(page)).stored).toBeNull();
  }, 60000);

  test('depuis l’accueil, « En savoir plus » ouvre la politique, bouton de refus en vue', async () => {
    const page = await session.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`${session.server.url}?saison=${NO_SEASON}`, session.server.gotoOptions);
    await createUserAndSkipIntro(page);
    const link = '#slide1.active-slide .privacy-info [data-slide="10"]';
    await page.waitForSelector(link, { visible: true, timeout: 10000 });
    expect(await page.$eval(link, el => el.dataset.translate)).toBe('privacy_info_more');
    // Une cible de 44 px de haut, dans une ligne de texte de 14 px
    const target = await (await page.$(link)).boundingBox();
    expect(Math.floor(target.height)).toBeGreaterThanOrEqual(44);
    // Au clavier, comme à la souris : c'est un bouton
    await page.focus(link);
    await page.keyboard.press('Enter');
    await page.waitForSelector(BUTTON, { visible: true, timeout: 10000 });
    const box = await (await page.$(BUTTON)).boundingBox();
    expect(box.y + box.height).toBeLessThanOrEqual(844);
  }, 60000);

  test('le traceur servi par le site n’envoie rien tant que le refus est retenu', async () => {
    const page = await session.newPage();
    const sent = [];
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().startsWith('https://plausible.io/')) {
        sent.push(JSON.parse(request.postData() ?? '{}').n);
        void request.respond({ status: 202, body: 'ok' });
        return;
      }
      void request.continue();
    });
    await page.goto(`${session.server.url}?saison=${NO_SEASON}`, session.server.gotoOptions);
    // Le vrai traceur, lancé à la main : la page d'essai est sur 127.0.0.1 et pilotée par un
    // robot, deux cas qu'il ignore de lui-même (captureOnLocalhost, __plausible)
    await page.evaluate(async () => {
      globalThis.__plausible = true;
      const { init, track } = await import('/js/vendor/plausible.js');
      init({ domain: 'leapmultix.jls42.org', captureOnLocalhost: true, logging: false });
      globalThis.trackForTest = track;
    });
    const sendOne = async name => {
      await page.evaluate(event => globalThis.trackForTest(event, {}), name);
      await new Promise(resolve => setTimeout(resolve, 300));
    };
    await sendOne('Avant le refus');
    expect(sent).toContain('Avant le refus');

    await page.evaluate(async () => {
      const { setAudienceRefused } = await import('/js/core/audience-refusal.js');
      setAudienceRefused(true);
    });
    await sendOne('Pendant le refus');
    expect(sent).not.toContain('Pendant le refus');

    await page.evaluate(async () => {
      const { setAudienceRefused } = await import('/js/core/audience-refusal.js');
      setAudienceRefused(false);
    });
    await sendOne('Après le refus');
    expect(sent).toContain('Après le refus');
  }, 60000);
});

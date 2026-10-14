/**
 * Tests de bout en bout : le serveur du site et Chrome, partagés par les tests d'un describe.
 * Lancés avant le premier test et fermés après le dernier ; chaque onglet ouvert par newPage()
 * se ferme à la fin de son test.
 */
import { afterAll, afterEach, beforeAll } from '@jest/globals';
import puppeteer from 'puppeteer';
import { startStaticServer } from '../../tests/utils/static-server.cjs';

/**
 * Pose ces hooks dans le describe appelant
 * @param {string} [waitUntil] - fin de chargement attendue par page.goto (startStaticServer)
 * @returns {{server: Object|null, newPage: () => Promise<import('puppeteer').Page>}} server
 *   (url, gotoOptions) n'existe qu'à partir du premier test
 */
export function chromeSession(waitUntil = 'networkidle0') {
  let browser = null;
  const pages = [];
  const session = {
    server: null,
    async newPage() {
      const page = await browser.newPage();
      pages.push(page);
      return page;
    },
  };

  beforeAll(async () => {
    session.server = await startStaticServer(waitUntil);
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 30000);

  afterEach(async () => {
    const open = pages.splice(0).filter(page => !page.isClosed());
    await Promise.all(open.map(page => page.close()));
  });

  afterAll(async () => {
    if (browser) await browser.close();
    if (session.server) await session.server.stop();
  });

  return session;
}

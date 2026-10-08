/* eslint-env jest */
/**
 * js/cache-updater.js :
 * - détection d'un cache incohérent : seuls les scripts du site comptent. Le script externe
 *   de Plausible n'a jamais de version ; le compter déclenchait un nettoyage complet (service
 *   worker désinscrit, caches vidés, voix comprise) à chaque visite, depuis que deploy.sh
 *   versionne toutes les adresses du site ;
 * - rechargement après l'installation d'un nouveau service worker, réservé à une page qui
 *   n'est pas de sa version.
 */
import { describe, test, expect, jest } from '@jest/globals';
import { MessageChannel } from 'node:worker_threads';
import {
  APP_VERSION,
  askWorkerVersion,
  hasMixedScriptVersions,
  reloadIfOutdated,
} from '../js/cache-updater.js';

const ORIGIN = 'https://leapmultix.jls42.org';
const scripts = (...srcs) => srcs.map(src => ({ src }));

describe('hasMixedScriptVersions', () => {
  test('prod versionnée avec Plausible externe : pas de mélange, pas de nettoyage', () => {
    const page = scripts(
      `${ORIGIN}/js/optional-styles-loader.js?v=v24`,
      `${ORIGIN}/js/bootstrap-critical.js?v=v24`,
      'https://plausible.io/js/script.js'
    );
    expect(hasMixedScriptVersions(page, ORIGIN)).toBe(false);
  });

  test('scripts du site mélangés : versionnés et non versionnés', () => {
    const page = scripts(`${ORIGIN}/js/a.js?v=v24`, `${ORIGIN}/js/b.js`);
    expect(hasMixedScriptVersions(page, ORIGIN)).toBe(true);
  });

  test.each([
    ['développement : aucun script versionné', scripts('http://localhost:8080/js/a.js')],
    ['tous versionnés', scripts(`${ORIGIN}/js/a.js?v=v24`, `${ORIGIN}/js/b.js?v=v24`)],
    ['aucun script', []],
    ['adresse illisible ignorée', scripts('::', `${ORIGIN}/js/a.js?v=v24`)],
  ])('%s : pas de nettoyage', (_label, page) => {
    const origin = page[0]?.src.startsWith('http://localhost') ? 'http://localhost:8080' : ORIGIN;
    expect(hasMixedScriptVersions(page, origin)).toBe(false);
  });
});

describe('Nouveau service worker installé', () => {
  // jsdom n'a pas MessageChannel, que tout navigateur fournit
  globalThis.MessageChannel ??= MessageChannel;

  /** Service worker qui répond sa version, comme sw.js, par le port reçu */
  const workerAnswering = version => ({
    postMessage(message, [port]) {
      if (message?.type === 'version') port.postMessage({ version });
    },
  });
  const silentWorker = { postMessage() {} };
  const brokenWorker = {
    postMessage() {
      throw new Error('service worker remplacé');
    },
  };

  test('askWorkerVersion : la version que répond le service worker, ou null', async () => {
    expect(await askWorkerVersion(workerAnswering('v37'))).toBe('v37');
    expect(await askWorkerVersion(silentWorker, 20)).toBeNull();
    expect(await askWorkerVersion(brokenWorker)).toBeNull();
  });

  test('page déjà de sa version (venue du réseau) : pas de rechargement en pleine partie', async () => {
    const reload = jest.fn();
    await reloadIfOutdated(workerAnswering(APP_VERSION), reload);
    expect(reload).not.toHaveBeenCalled();
  });

  test('page d’une autre version (gardée hors ligne) ou sans réponse : rechargée', async () => {
    const reload = jest.fn();
    await reloadIfOutdated(workerAnswering('v1'), reload);
    await reloadIfOutdated(brokenWorker, reload);
    expect(reload).toHaveBeenCalledTimes(2);
  });
});

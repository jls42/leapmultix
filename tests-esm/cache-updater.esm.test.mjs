/* eslint-env jest */
/**
 * js/cache-updater.js :
 * - détection d'un cache incohérent : seuls les scripts du site comptent. Le script externe
 *   de Plausible n'a jamais de version ; le compter déclenchait un nettoyage complet (service
 *   worker désinscrit, caches vidés, voix comprise) à chaque visite, depuis que deploy.sh
 *   versionne toutes les adresses du site ;
 * - rechargement après l'installation d'un nouveau service worker, réservé à une page qui
 *   n'est pas de sa version ;
 * - moment de l'enregistrement du service worker : au premier geste pour une première visite,
 *   dès la page chargée pour un joueur déjà venu.
 */
import { describe, test, expect, jest } from '@jest/globals';
import { MessageChannel } from 'node:worker_threads';
import {
  APP_VERSION,
  askWorkerVersion,
  hasMixedScriptVersions,
  reloadIfOutdated,
  scheduleRegistration,
  versionedPageUrl,
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

describe('Rechargement après le nettoyage du cache', () => {
  test('l’adresse rechargée reste sur le site, même pour un chemin « //hôte/… »', () => {
    for (const path of ['/', '/index.html', '//example.test/x']) {
      const href = `${ORIGIN}${path}?ancien=1#fin`;
      // Le navigateur résout l'adresse donnée à location.href par rapport à la page
      const target = new URL(versionedPageUrl({ href, pathname: new URL(href).pathname }), href);
      expect([path, target.origin, target.pathname, target.search]).toEqual([
        path,
        ORIGIN,
        path,
        `?v=${APP_VERSION}`,
      ]);
    }
  });
});

describe('Enregistrement du service worker', () => {
  /** Fenêtre de page : ses événements, et l'état de chargement du document */
  const pageWindow = readyState => Object.assign(new EventTarget(), { document: { readyState } });
  const navigatorOf = controller => ({ serviceWorker: { controller } });
  const fire = (target, type) => target.dispatchEvent(new Event(type));

  test('première visite : rien au chargement, puis une seule fois au premier geste', () => {
    const target = pageWindow('complete');
    const register = jest.fn();
    scheduleRegistration(target, navigatorOf(null), register);
    fire(target, 'load');
    expect(register).not.toHaveBeenCalled();
    fire(target, 'pointerdown');
    fire(target, 'keydown');
    fire(target, 'click');
    expect(register).toHaveBeenCalledTimes(1);
  });

  test.each(['pointerdown', 'keydown', 'click'])(
    'première visite : « %s » suffit (souris, doigt, clavier, lecteur d’écran)',
    gesture => {
      const target = pageWindow('complete');
      const register = jest.fn();
      scheduleRegistration(target, navigatorOf(null), register);
      fire(target, gesture);
      expect(register).toHaveBeenCalledTimes(1);
    }
  );

  test('première visite, geste avant la fin du chargement : enregistré au chargement', () => {
    const target = pageWindow('loading');
    const register = jest.fn();
    scheduleRegistration(target, navigatorOf(null), register);
    fire(target, 'pointerdown');
    expect(register).not.toHaveBeenCalled();
    fire(target, 'load');
    expect(register).toHaveBeenCalledTimes(1);
  });

  test('joueur déjà venu : dès la page chargée, sans attendre de geste', () => {
    const loading = pageWindow('loading');
    const loaded = pageWindow('complete');
    const register = jest.fn();
    scheduleRegistration(loading, navigatorOf({}), register);
    expect(register).not.toHaveBeenCalled();
    fire(loading, 'load');
    expect(register).toHaveBeenCalledTimes(1);
    scheduleRegistration(loaded, navigatorOf({}), register);
    expect(register).toHaveBeenCalledTimes(2);
  });
});

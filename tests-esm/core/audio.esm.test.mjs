/* eslint-env jest, node */
/**
 * AudioManager : volume, coupure du son et lecture d'un son.
 *
 * Ce fichier remplace tests/__tests__/core/audio.test.js, qui ne testait rien.
 * Il chargeait le module par `await import()` sous Jest en CommonJS, où cet
 * appel lève « A dynamic import callback was invoked without
 * --experimental-vm-modules ». Le catch retombait sur `global.AudioManager`,
 * absent, si bien que chaque test prenait une branche de repli du genre
 * `expect(true).toBe(true)` : vingt-trois tests au vert qui n'exécutaient pas
 * une ligne du module. Ici, les modules ES sont activés, donc le module est
 * réellement chargé et réellement éprouvé.
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

/** Données du joueur courant, partagées par les simulacres */
const donneesJoueur = { volume: undefined };
let joueurCourant = null;

jest.unstable_mockModule('../../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => donneesJoueur,
    updateUserData: u => Object.assign(donneesJoueur, u),
  },
}));
jest.unstable_mockModule('../../js/userManager.js', () => ({
  UserManager: { getCurrentUser: () => joueurCourant },
}));

/** Volume conservé par la couche de stockage */
const stockage = { volume: 1 };
jest.unstable_mockModule('../../js/core/storage.js', () => ({
  default: {
    loadVolume: jest.fn(() => stockage.volume),
    saveVolume: jest.fn(v => {
      stockage.volume = v;
    }),
  },
}));
jest.unstable_mockModule('../../js/game.js', () => ({ gameState: {} }));

const { AudioManager } = await import('../../js/core/audio.js');
const Storage = (await import('../../js/core/storage.js')).default;

/** Dernières instances créées par `new Audio(...)`, pour inspection */
let sonsCrees = [];

beforeEach(() => {
  sonsCrees = [];
  joueurCourant = null;
  donneesJoueur.volume = undefined;
  stockage.volume = 1;
  jest.clearAllMocks();

  globalThis.Audio = jest.fn(src => {
    const son = {
      src,
      volume: 1,
      loop: false,
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    sonsCrees.push(son);
    return son;
  });

  AudioManager._volume = 1;
  AudioManager._muted = false;
  AudioManager._lastVolume = 1;
  AudioManager._gameState = null;
  AudioManager.activeSounds.clear();
});

describe('AudioManager : le module est bien chargé', () => {
  test('les méthodes attendues existent', () => {
    for (const methode of [
      'init',
      'setVolume',
      'getVolume',
      'isMuted',
      'toggleMute',
      'playSound',
      'loadPreferences',
      'savePreferences',
    ]) {
      expect(typeof AudioManager[methode]).toBe('function');
    }
  });

  test('le catalogue contient les trois sons du jeu', () => {
    for (const nom of ['good', 'bad', 'shoot']) {
      expect(AudioManager.sounds.get(nom)).toMatch(/^assets\/sounds\/.+\.wav$/);
    }
  });
});

describe('AudioManager : volume', () => {
  test('setVolume enregistre la valeur et la sauvegarde', () => {
    AudioManager.setVolume(0.3);
    expect(AudioManager.getVolume()).toBe(0.3);
    expect(Storage.saveVolume).toHaveBeenCalledWith(0.3);
  });

  test('une valeur hors bornes est ramenée entre 0 et 1', () => {
    AudioManager.setVolume(-0.5);
    expect(AudioManager.getVolume()).toBe(0);
    AudioManager.setVolume(1.5);
    expect(AudioManager.getVolume()).toBe(1);
  });

  test('le volume des sons déjà en cours suit le nouveau réglage', () => {
    AudioManager.playSound('good');
    const enCours = sonsCrees.at(-1);
    AudioManager.setVolume(0.25);
    expect(enCours.volume).toBe(0.25);
  });

  test('le volume est répercuté sur gameState', () => {
    const etat = { volume: 0, muted: false };
    AudioManager._gameState = etat;
    AudioManager.setVolume(0.4);
    expect(etat).toEqual({ volume: 0.4, muted: false });
  });
});

describe('AudioManager : coupure du son', () => {
  test('un volume nul vaut coupure', () => {
    AudioManager.setVolume(0);
    expect(AudioManager.isMuted()).toBe(true);
  });

  test('couper puis rétablir restitue le volume précédent', () => {
    AudioManager.setVolume(0.6);
    AudioManager.toggleMute();
    expect(AudioManager.isMuted()).toBe(true);
    expect(AudioManager.getVolume()).toBe(0);

    AudioManager.toggleMute();
    expect(AudioManager.isMuted()).toBe(false);
    expect(AudioManager.getVolume()).toBe(0.6);
  });

  test('rétablir depuis un démarrage à zéro donne le son au maximum', () => {
    AudioManager._volume = 0;
    AudioManager._muted = true;
    AudioManager._lastVolume = 0;
    AudioManager.toggleMute();
    expect(AudioManager.getVolume()).toBe(1);
  });
});

describe('AudioManager : lecture d’un son', () => {
  test('un son du catalogue est joué à la source attendue', () => {
    AudioManager.playSound('good');
    expect(globalThis.Audio).toHaveBeenCalledWith(AudioManager.sounds.get('good'));
    expect(sonsCrees.at(-1).play).toHaveBeenCalled();
  });

  test('rien n’est joué quand le son est coupé', () => {
    AudioManager.setVolume(0);
    AudioManager.playSound('good');
    expect(globalThis.Audio).not.toHaveBeenCalled();
  });

  test('un nom absent du catalogue avertit sans lever', () => {
    const avertir = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => AudioManager.playSound('inconnu')).not.toThrow();
    expect(avertir).toHaveBeenCalled();
    expect(globalThis.Audio).not.toHaveBeenCalled();
    avertir.mockRestore();
  });

  test('un nom qui n’est pas un identifiant est ignoré', () => {
    expect(() => AudioManager.playSound('../../etc/passwd')).not.toThrow();
    expect(globalThis.Audio).not.toHaveBeenCalled();
  });

  test('le volume demandé se combine au volume général', () => {
    AudioManager.setVolume(0.5);
    AudioManager.playSound('good', { volume: 0.8 });
    expect(sonsCrees.at(-1).volume).toBeCloseTo(0.4, 5);
  });

  test('l’option de répétition est transmise', () => {
    AudioManager.playSound('good', { loop: true });
    expect(sonsCrees.at(-1).loop).toBe(true);
  });

  test('un son joué est suivi tant qu’il dure', () => {
    AudioManager.playSound('good');
    expect(AudioManager.activeSounds.size).toBe(1);
    // le module s'abonne à « ended » pour cesser de le suivre
    const [evenement, retrait] = sonsCrees.at(-1).addEventListener.mock.calls[0];
    expect(evenement).toBe('ended');
    retrait();
    expect(AudioManager.activeSounds.size).toBe(0);
  });
});

describe('AudioManager : préférences', () => {
  test('sans joueur courant, le volume vient du stockage global', () => {
    stockage.volume = 0.8;
    AudioManager.loadPreferences();
    expect(AudioManager.getVolume()).toBe(0.8);
    expect(Storage.loadVolume).toHaveBeenCalled();
  });

  test('le volume du joueur courant prime sur le stockage global', () => {
    joueurCourant = 'Zoé';
    donneesJoueur.volume = 0.2;
    stockage.volume = 0.9;
    AudioManager.loadPreferences();
    expect(AudioManager.getVolume()).toBe(0.2);
    expect(Storage.loadVolume).not.toHaveBeenCalled();
  });

  test('un volume chargé à zéro coupe le son', () => {
    stockage.volume = 0;
    AudioManager.loadPreferences();
    expect(AudioManager.isMuted()).toBe(true);
  });

  test('savePreferences écrit dans le stockage et dans le profil', () => {
    joueurCourant = 'Zoé';
    AudioManager._volume = 0.7;
    AudioManager.savePreferences();
    expect(Storage.saveVolume).toHaveBeenCalledWith(0.7);
    expect(donneesJoueur.volume).toBe(0.7);
  });

  test('init relie gameState et charge les préférences', () => {
    stockage.volume = 0.45;
    const etat = { volume: 0, muted: false };
    AudioManager.init(etat);
    expect(AudioManager._gameState).toBe(etat);
    expect(AudioManager.getVolume()).toBe(0.45);
    expect(etat.volume).toBe(0.45);
  });
});

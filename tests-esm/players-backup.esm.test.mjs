/* eslint-env jest, node */
/**
 * Sauvegarde des joueurs : « Enregistrer les joueurs dans un fichier » télécharge un JSON de
 * tous les profils ; « Reprendre des joueurs d'un fichier » le relit, le vérifie, et ajoute
 * les joueurs sans jamais écraser un profil déjà là. Vider le stockage du navigateur n'efface
 * plus la classe sans recours. Le navigateur est prié de garder les données (storage.persist).
 */
import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { legacySnapshot, seedLegacyStorage } from './helpers/legacy-profiles.mjs';

const { UserManager } = await import('../js/userManager.js');
const { VideoManager } = await import('../js/VideoManager.js');
const { PlayerTools } = await import('../js/components/playerTools.js');
const { PLAYER_MAX_CHARS, readPlayersBackup, requestPersistentStorage } = await import(
  '../js/core/players-backup.js'
);
const store = await import('../js/i18n-store.js');

const FR = JSON.parse(readFileSync(new URL('../assets/translations/fr.json', import.meta.url)));
const INDEX = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const NOW = new Date(2026, 9, 8, 21, 30);

const stored = () => JSON.parse(localStorage.getItem('players'));
const reset = () => {
  localStorage.clear();
  UserManager._players = {};
  UserManager._currentUser = null;
};
const backupText = players =>
  JSON.stringify({ format: 'leapmultix-players', version: 1, exportedAt: '', players });
/** Fin des promesses et lectures de fichier en cours */
const flush = () => new Promise(resolve => setTimeout(resolve, 0));
// jsdom n'a pas Blob.text(), qu'ont tous les navigateurs pris en charge : le jeu s'en sert pour lire
// le fichier choisi, le test le prête à jsdom
if (typeof Blob.prototype.text !== 'function') {
  Blob.prototype.text = function text() {
    return readBlob(this);
  };
}
const readBlob = blob =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(blob);
  });
/** Attend qu'une condition devienne vraie (lecture de fichier asynchrone) */
async function waitFor(condition) {
  for (let i = 0; i < 50 && !condition(); i += 1) await flush();
  return condition();
}

beforeEach(() => {
  reset();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(VideoManager, 'playCharacterIntro').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  reset();
  document.body.replaceChildren();
  Reflect.deleteProperty(globalThis.navigator, 'storage');
});

describe('Export : tous les joueurs de la liste, tels qu’ils sont rangés', () => {
  test('format, date, et chaque profil à l’identique ; la corbeille n’en fait pas partie', () => {
    seedLegacyStorage(localStorage);
    UserManager._players = UserManager.loadPlayers();
    UserManager._players['Tom'].operationStats = {};
    UserManager.deleteUser('Tom');
    const backup = UserManager.exportPlayers(NOW);

    expect(backup).toMatchObject({
      format: 'leapmultix-players',
      version: 1,
      exportedAt: NOW.toISOString(),
    });
    expect(Object.keys(backup.players)).toEqual(['Zoé', 'Léa']);
    const legacy = new Map(Object.entries(legacySnapshot().players));
    for (const [name, profile] of Object.entries(backup.players)) {
      const { operationStats, ...rest } = profile;
      expect(rest).toEqual(legacy.get(name));
      // Profil jamais rouvert depuis la mise à jour : il emporte sa copie des statistiques
      expect(operationStats['7×8']).toMatchObject({ attempts: 9, errors: 4 });
    }
  });

  test('export, navigateur vidé, reprise : les profils reviennent à l’identique, marqués repris', () => {
    seedLegacyStorage(localStorage);
    UserManager._players = UserManager.loadPlayers();
    const text = JSON.stringify(UserManager.exportPlayers(NOW));
    reset();

    const backup = readPlayersBackup(text);
    expect(backup.rejected).toBe(0);
    expect(UserManager.importPlayers(backup.players)).toEqual({
      added: ['Zoé', 'Léa', 'Tom'],
      skipped: [],
      inTrash: [],
    });
    // Seul ajout : le marqueur d'un profil repris d'un fichier (anciens scores d'Arcade)
    const marked = Object.entries(JSON.parse(text).players).map(([name, profile]) => [
      name,
      { ...profile, legacyArcade: false },
    ]);
    expect(stored()).toEqual(Object.fromEntries(marked));
  });
});

describe('Reprise d’un fichier : vérifiée, sans écraser personne', () => {
  test('un prénom déjà là sous une autre forme (lettres décomposées, deux espaces) est laissé', () => {
    UserManager.createUser('Léa', 'panda');
    UserManager.createUser('Noé B.', 'fox');
    // « Le » + accent combinant : la même « Léa » à l'œil, une autre suite de caractères
    const decomposed = 'Le\u0301a';
    const backup = readPlayersBackup(
      backupText({ [decomposed]: { nickname: 'Léa' }, 'Noé  B.': { nickname: 'Noé' } })
    );
    expect(UserManager.importPlayers(backup.players)).toEqual({
      added: [],
      skipped: ['Léa', 'Noé B.'],
      inTrash: [],
    });
    expect(Object.keys(stored()).sort()).toEqual(['Léa', 'Noé B.']);
  });

  test('un nouveau prénom est rangé sous sa forme du formulaire (NFC, espaces simples)', () => {
    const backup = readPlayersBackup(backupText({ 'Ame\u0301lie  R.': { nickname: 'Amélie' } }));
    expect(UserManager.importPlayers(backup.players).added).toEqual(['Amélie R.']);
    expect(Object.keys(stored())).toEqual(['Amélie R.']);
  });

  test('un joueur déjà là est laissé tel quel, les autres sont ajoutés', () => {
    UserManager.createUser('Léa', 'panda');
    UserManager._players['Léa'].coins = 7;
    UserManager.savePlayers();
    const backup = readPlayersBackup(
      backupText({ Léa: { nickname: 'Léa', coins: 900 }, Noé: { nickname: 'Noé', coins: 4 } })
    );
    expect(UserManager.importPlayers(backup.players)).toEqual({
      added: ['Noé'],
      skipped: ['Léa'],
      inTrash: [],
    });
    expect(stored()['Léa'].coins).toBe(7);
    expect(stored()['Noé']).toEqual({
      nickname: 'Noé',
      coins: 4,
      operationStats: {},
      legacyArcade: false,
    });
  });

  test('un profil venu d’ailleurs, sans statistiques par calcul, ne prend pas celles de l’appareil', () => {
    localStorage.setItem(
      'operationStats',
      JSON.stringify({ '7×8': { operator: '×', a: 7, b: 8, attempts: 9, errors: 4 } })
    );
    UserManager.importPlayers(readPlayersBackup(backupText({ Noé: { nickname: 'Noé' } })).players);
    UserManager._currentUser = 'Noé';
    expect(UserManager.getCurrentUserData().operationStats).toEqual({});
  });

  test.each([
    ['pas du JSON', '{pas du json', 'json'],
    ['un autre JSON', JSON.stringify({ players: { Léa: {} } }), 'format'],
    ['une liste', JSON.stringify([1, 2]), 'format'],
    [
      'une version plus récente',
      JSON.stringify({ format: 'leapmultix-players', version: 2, players: {} }),
      'version',
    ],
  ])('%s : refusé (%s)', (_label, text, error) => {
    expect(readPlayersBackup(text)).toEqual({ error });
  });

  test('prénoms et profils illisibles écartés et comptés, sans polluer Object.prototype', () => {
    const text =
      '{"format":"leapmultix-players","version":1,"players":{' +
      '"__proto__":{"polluted":true},"<b>x</b>":{},"Léa":[1],"Noé":"texte",' +
      '"Zoé_2":{"nickname":"Zoé_2"},"Léa B.":{"nickname":"Léa B."},"7":{"nickname":"7"}}}';
    const backup = readPlayersBackup(text);
    expect(backup.players.map(([name]) => name)).toEqual(['7', 'Zoé_2', 'Léa B.']);
    expect(backup.rejected).toBe(4);
    UserManager.importPlayers(backup.players);
    expect({}.polluted).toBeUndefined();
    expect(Object.keys(stored())).toEqual(['7', 'Zoé_2', 'Léa B.']);
  });

  test('tout prénom qu’une version du jeu a pu ranger est repris', () => {
    // L'ancienne règle ([a-zA-Z0-9À-ÿ\s._-]) laissait passer « × », « ÷ » et toute espace
    const names = ['Léa 2', 'Lucas_B', 'Gal·la', 'Léa×', 'Tom÷', 'Zoé\tB'];
    const players = Object.fromEntries(names.map(name => [name, { nickname: name }]));
    const backup = readPlayersBackup(backupText(players));
    expect(backup.players.map(([name]) => name)).toEqual(names);
    expect(backup.rejected).toBe(0);
  });

  test('stockage plein : rien n’est ajouté, l’erreur est rendue', () => {
    UserManager.createUser('Léa', 'panda');
    jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const backup = readPlayersBackup(backupText({ Noé: { nickname: 'Noé' } }));
    expect(UserManager.importPlayers(backup.players)).toEqual({
      added: [],
      skipped: [],
      inTrash: [],
      error: 'storage',
    });
    expect(Object.keys(UserManager.getAllPlayers())).toEqual(['Léa']);
  });
});

describe('Sauvegarde fabriquée : un profil démesuré n’est pas repris', () => {
  test('un profil de 3 millions de caractères est écarté et compté, les autres sont repris', () => {
    const backup = readPlayersBackup(
      backupText({
        Géant: { nickname: 'Géant', notes: 'x'.repeat(3_000_000) },
        Noé: { nickname: 'Noé' },
      })
    );
    expect(backup.players.map(([name]) => name)).toEqual(['Noé']);
    expect(backup.rejected).toBe(1);
  });

  test('la borne laisse passer de très loin un vrai profil, même ancien et très joué', () => {
    // Zoé : treize mois de jeu, 506 réponses gardées dans l'historique d'avant la v37
    const zoe = JSON.stringify(legacySnapshot().players['Zoé']);
    expect(zoe.length * 20).toBeLessThan(PLAYER_MAX_CHARS);
  });
});

describe('Reprise : un homonyme n’hérite pas des anciens scores d’Arcade d’un enfant supprimé', () => {
  const DAY = 24 * 60 * 60 * 1000;
  const T0 = Date.UTC(2026, 9, 8, 12, 0, 0);
  // Scores d'avant la v37, rangés sous le surnom
  const TOM_KEYS = ['arcadeScores_Tom', 'arcadeScores_multimiam_Tom'];
  const seedDevice = players => {
    localStorage.setItem('players', JSON.stringify(players));
    for (const key of TOM_KEYS) localStorage.setItem(key, '[980,455]');
    UserManager._players = UserManager.loadPlayers();
  };
  const importText = players =>
    UserManager.importPlayers(readPlayersBackup(backupText(players)).players);
  const arcadeTop5Of = name => {
    UserManager._currentUser = name;
    return UserManager.getCurrentUserData().modeStats.arcadeTop5;
  };
  const tomKeys = () => TOM_KEYS.map(key => localStorage.getItem(key));

  test('« Tom » repris, sans compteurs : rien des anciennes clés de « Tom »', () => {
    seedDevice({});
    expect(importText({ Tom: { nickname: 'Tom' } }).added).toEqual(['Tom']);
    expect(arcadeTop5Of('Tom')).toEqual({});
  });

  test('« Tom » dans la corbeille : pas repris ; à l’échéance, ses clés partent avec lui', () => {
    seedDevice({ Tom: { nickname: 'Tom' } });
    const now = jest.spyOn(Date, 'now').mockReturnValue(T0);
    UserManager.deleteUser('Tom');
    expect(importText({ Tom: { nickname: 'Tom', coins: 5 } })).toEqual({
      added: [],
      skipped: [],
      inTrash: ['Tom'],
    });
    expect(UserManager.getAllPlayers()).toEqual({});
    // Relance du jeu trente jours plus tard
    now.mockReturnValue(T0 + 30 * DAY);
    UserManager.init();
    expect(JSON.parse(localStorage.getItem('playersTrash'))).toEqual([]);
    expect(tomKeys()).toEqual([null, null]);
  });

  test('« Zed », surnommé « Tom » : ni amorcé avec ses scores, ni gardien de ses clés', () => {
    seedDevice({ Tom: { nickname: 'Tom' } });
    jest.spyOn(Date, 'now').mockReturnValue(T0);
    UserManager.deleteUser('Tom');
    expect(importText({ Zed: { nickname: 'Tom' } }).added).toEqual(['Zed']);
    expect(arcadeTop5Of('Zed')).toEqual({});
    UserManager.purgeExpiredTrash(T0 + 30 * DAY);
    expect(tomKeys()).toEqual([null, null]);
  });

  test('« Tom » repris pendant que « Thomas », surnommé « Tom », est dans la corbeille', () => {
    seedDevice({ Thomas: { nickname: 'Tom' } });
    jest.spyOn(Date, 'now').mockReturnValue(T0);
    UserManager.deleteUser('Thomas');
    expect(importText({ Tom: { nickname: 'Tom' } }).added).toEqual(['Tom']);
    expect(arcadeTop5Of('Tom')).toEqual({});
    UserManager.purgeExpiredTrash(T0 + 30 * DAY);
    expect(tomKeys()).toEqual([null, null]);
  });

  test('un marqueur venu du fichier ne l’emporte pas : tout profil repris est marqué', () => {
    seedDevice({});
    importText({ Tom: { nickname: 'Tom', legacyArcade: true } });
    expect(stored()['Tom'].legacyArcade).toBe(false);
  });
});

describe('Stockage persistant (navigator.storage.persist)', () => {
  const fakeStorage = persisted => {
    const storage = {
      persisted: jest.fn(async () => persisted),
      persist: jest.fn(async () => true),
    };
    Object.defineProperty(globalThis.navigator, 'storage', { value: storage, configurable: true });
    return storage;
  };

  test('demandé quand les données ne sont pas encore protégées', async () => {
    const storage = fakeStorage(false);
    await expect(requestPersistentStorage()).resolves.toBe(true);
    expect(storage.persist).toHaveBeenCalledTimes(1);
  });

  test('déjà protégées : rien à redemander', async () => {
    const storage = fakeStorage(true);
    await expect(requestPersistentStorage()).resolves.toBe(true);
    expect(storage.persist).not.toHaveBeenCalled();
  });

  test('navigateur sans cette fonction : sans erreur', async () => {
    await expect(requestPersistentStorage()).resolves.toBe(false);
  });

  test('demandé à la création d’un joueur', async () => {
    const storage = fakeStorage(false);
    const parsed = new DOMParser().parseFromString(INDEX, 'text/html');
    document.body.replaceChildren(parsed.getElementById('slide0'));
    UserManager.initCreateUserEvents();
    document.getElementById('new-user-name').value = 'Noé';
    document.getElementById('create-user-btn').click();
    await flush();
    expect(storage.persist).toHaveBeenCalled();
  });
});

describe('« Qui joue ? » : boutons de la sauvegarde', () => {
  let downloads;

  beforeAll(() => {
    store.setTranslations(FR);
    store.setCurrentLanguage('fr');
  });

  beforeEach(() => {
    const parsed = new DOMParser().parseFromString(INDEX, 'text/html');
    document.body.replaceChildren(parsed.getElementById('slide0'));
    downloads = [];
    URL.createObjectURL = jest.fn(blob => {
      downloads.push(blob);
      return 'blob:sauvegarde';
    });
    URL.revokeObjectURL = jest.fn();
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
      downloads.push(this.download);
    });
    PlayerTools.init();
  });

  test('sans joueur, seule la reprise est proposée', () => {
    UserManager.refreshUserList();
    expect(document.getElementById('export-players-btn').hidden).toBe(true);
    expect(document.getElementById('import-players-btn').hidden).toBe(false);
  });

  test('« Enregistrer » télécharge le fichier du jour et le dit', async () => {
    jest.useFakeTimers({ now: NOW, doNotFake: ['queueMicrotask', 'nextTick'] });
    seedLegacyStorage(localStorage);
    UserManager._players = UserManager.loadPlayers();
    UserManager.refreshUserList();
    document.getElementById('export-players-btn').click();
    jest.useRealTimers();

    const [blob, fileName] = downloads;
    expect(fileName).toBe('leapmultix-joueurs-2026-10-08.json');
    expect(blob.type).toBe('application/json');
    const saved = JSON.parse(await readBlob(blob));
    expect(Object.keys(saved.players)).toEqual(['Zoé', 'Léa', 'Tom']);
    expect(document.getElementById('players-backup-message').textContent).toBe(
      '3 joueurs enregistrés dans « leapmultix-joueurs-2026-10-08.json ».'
    );
  });

  test('le champ du fichier est nommé par son bouton, les bilans sont des zones <output>', () => {
    const input = document.getElementById('import-players-input');
    const label = document.getElementById(input.getAttribute('aria-labelledby'));
    expect(label?.id).toBe('import-players-btn');
    expect(document.getElementById('players-backup-message').tagName).toBe('OUTPUT');
    expect(document.getElementById('user-tools-message').tagName).toBe('OUTPUT');
  });

  test('« Reprendre » ouvre le choix du fichier, puis ajoute et dit ce qu’il a fait', async () => {
    UserManager.createUser('Léa', 'panda');
    UserManager.refreshUserList();
    const input = document.getElementById('import-players-input');
    const pick = jest.spyOn(input, 'click').mockImplementation(() => {});
    document.getElementById('import-players-btn').click();
    expect(pick).toHaveBeenCalledTimes(1);

    const file = new File(
      [
        backupText({
          Léa: { nickname: 'Léa' },
          Noé: { nickname: 'Noé' },
          Zoé: { nickname: 'Zoé' },
        }),
      ],
      'joueurs.json',
      { type: 'application/json' }
    );
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    const message = document.getElementById('players-backup-message');
    expect(await waitFor(() => message.textContent !== '')).toBe(true);

    expect(message.textContent).toBe(
      '2 joueurs ajoutés. Déjà dans la liste, laissés tels quels : Léa.'
    );
    const tiles = [...document.querySelectorAll('#user-list .user-container')];
    expect(tiles.map(item => item.dataset.player)).toEqual(['Léa', 'Noé', 'Zoé']);
  });

  test('le même fichier repris deux fois : au-delà de 5, les joueurs déjà là sont comptés', async () => {
    const names = ['Adam', 'Inès', 'Jade', 'Lina', 'Noah', 'Rose'];
    const players = Object.fromEntries(names.map(name => [name, { nickname: name }]));
    UserManager.importPlayers(readPlayersBackup(backupText(players)).players);
    await PlayerTools.importFile(new File([backupText(players)], 'classe.json'));
    expect(document.getElementById('players-backup-message').textContent).toBe(
      'Aucun joueur ajouté. 6\u00a0joueurs déjà dans la liste, laissés tels quels.'
    );
  });

  test('un joueur de la corbeille n’est pas repris : le message le dit à part', async () => {
    UserManager.createUser('Léa', 'panda');
    UserManager.createUser('Noé', 'fox');
    UserManager.deleteUser('Léa');
    UserManager.refreshUserList();
    const players = {
      Léa: { nickname: 'Léa' },
      Noé: { nickname: 'Noé' },
      Zoé: { nickname: 'Zoé' },
    };
    await PlayerTools.importFile(new File([backupText(players)], 'joueurs.json'));
    expect(document.getElementById('players-backup-message').textContent).toBe(
      '1\u00a0joueur ajouté. Déjà dans la liste, laissés tels quels\u00a0: Noé. ' +
        'Dans la corbeille, laissés tels quels\u00a0: Léa.'
    );
  });

  test('au-delà de 5, les joueurs de la corbeille sont comptés', async () => {
    const names = ['Adam', 'Inès', 'Jade', 'Lina', 'Noah', 'Rose'];
    for (const name of names) UserManager.createUser(name, 'fox');
    for (const name of names) UserManager.deleteUser(name);
    const players = Object.fromEntries(names.map(name => [name, { nickname: name }]));
    await PlayerTools.importFile(new File([backupText(players)], 'classe.json'));
    expect(document.getElementById('players-backup-message').textContent).toBe(
      'Aucun joueur ajouté. 6\u00a0joueurs dans la corbeille, laissés tels quels.'
    );
  });

  test('un fichier qui n’est pas une sauvegarde : rien n’est ajouté, le message le dit', async () => {
    const file = new File(['{"bonjour": 1}'], 'autre.json', { type: 'application/json' });
    await PlayerTools.importFile(file);
    expect(document.getElementById('players-backup-message').textContent).toBe(
      'Ce fichier n’est pas une sauvegarde de joueurs LeapMultix.'
    );
    expect(UserManager.getAllPlayers()).toEqual({});
  });
});

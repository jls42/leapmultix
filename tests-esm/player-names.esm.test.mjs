/* eslint-env jest, node */
/**
 * Prénoms des joueurs : gardés tels qu'ils sont écrits, dans toutes les écritures (lettres et
 * accents, apostrophe droite ou typographique, trait d'union, espace). Le reste est refusé
 * avec un message qui dit quoi, au lieu d'être retiré en silence (« N'Guessan » devenait
 * « NGuessan », « Łukasz » « ukasz », et « عائشة » était refusé comme un champ vide).
 */
import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { readFileSync } from 'node:fs';

const { checkUsername, escapeHtml } = await import('../js/security-utils.js');
const { UserManager } = await import('../js/userManager.js');
const { VideoManager } = await import('../js/VideoManager.js');
const store = await import('../js/i18n-store.js');

const FR = JSON.parse(readFileSync(new URL('../assets/translations/fr.json', import.meta.url)));

const CREATION_MARKUP = `
  <div id="user-list" class="user-list"></div>
  <section class="new-player">
    <div class="new-player-name">
      <input type="text" id="new-user-name" />
      <button type="button" id="show-virtual-keyboard" aria-expanded="false">Clavier</button>
    </div>
    <p id="new-user-message" class="new-player-message" role="alert" hidden></p>
    <div class="avatar-selector creation-avatar-selector" role="radiogroup">
      <label class="avatar-btn"
        ><input class="avatar-radio" type="radio" name="creation-avatar" value="panda" checked
      /></label>
    </div>
    <button type="button" class="btn" id="create-user-btn">Créer</button>
  </section>
`;

/** Montage d'un gabarit d'essai, sans innerHTML */
const mount = markup => {
  const parsed = new DOMParser().parseFromString(markup, 'text/html');
  document.body.replaceChildren(...parsed.body.childNodes);
};

const ACCEPTED = [
  "N'Guessan",
  'N’Guessan',
  'Ayşe',
  'Łukasz',
  'عائشة',
  'Nguyễn',
  'Cœur',
  'Chloë',
  'Jean-Luc',
  'Marie Claire',
  'Maximilien-Alexandre de la Tour-Dupont',
  '王芳',
  'Gal·la',
  // Chiffres, point et tiret bas, permis avant : ils distinguent deux élèves de même prénom
  'Léa B.',
  'Léa 2',
  'Lucas_B',
];

describe('checkUsername : ce qui est écrit est gardé', () => {
  test.each(ACCEPTED)('« %s » est accepté tel quel', name => {
    expect(checkUsername(name)).toEqual({ name, problem: null, chars: '' });
  });

  test('espaces autour et en trop : une seule espace entre les mots', () => {
    expect(checkUsername('  Maël    Dupont  ').name).toBe('Maël Dupont');
  });

  test('accent tapé à part (e + accent) : la forme composée, pour un doublon repérable', () => {
    expect(checkUsername('Zoé').name).toBe('Zoé');
  });

  test.each([[''], ['   '], [null], [42]])('%p : prénom vide', value => {
    expect(checkUsername(value).problem).toBe('empty');
  });

  test.each([
    ['🦊', '🦊'],
    ['Léa !', '!'],
    ['Tom & Léo', '&'],
    ['Zoé (CM2)', '( )'],
    ['<b>Léo</b>', '< > /'],
    ['👨‍👩‍👧 Lou', '👨‍👩‍👧'],
  ])('« %s » est refusé, en citant « %s »', (name, chars) => {
    expect(checkUsername(name)).toMatchObject({ problem: 'chars', chars });
  });

  test('« __proto__ », nom réservé de JavaScript, est refusé en entier', () => {
    expect(checkUsername('__proto__')).toMatchObject({ problem: 'chars', chars: '__proto__' });
  });

  test('plus de 50 caractères : refusé, jamais coupé', () => {
    expect(checkUsername('A'.repeat(50)).problem).toBeNull();
    expect(checkUsername('A'.repeat(51))).toMatchObject({ problem: 'long', name: 'A'.repeat(51) });
  });
});

describe('« Nouveau joueur » : le prénom créé est celui qui a été écrit', () => {
  beforeAll(() => {
    store.setTranslations(FR);
    store.setCurrentLanguage('fr');
  });

  beforeEach(() => {
    localStorage.clear();
    mount(CREATION_MARKUP);
    UserManager._players = {};
    UserManager._currentUser = null;
    // La vidéo de l'avatar se termine aussitôt : le joueur créé est choisi
    jest.spyOn(VideoManager, 'playCharacterIntro').mockImplementation((_avatar, done) => done());
    jest.spyOn(console, 'error').mockImplementation(() => {});
    UserManager.initCreateUserEvents();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.replaceChildren();
    UserManager._players = {};
    UserManager._currentUser = null;
    localStorage.clear();
  });

  const create = name => {
    document.getElementById('new-user-name').value = name;
    document.getElementById('create-user-btn').click();
    return document.getElementById('new-user-message');
  };

  test.each(["N'Guessan", 'Ayşe', 'Łukasz', 'عائشة'])(
    '« %s » : profil, tuile et joueur choisi gardent chaque lettre',
    name => {
      const message = create(name);
      expect(message.hidden).toBe(true);
      expect(Object.keys(JSON.parse(localStorage.getItem('players')))).toEqual([name]);
      expect(UserManager.getCurrentUser()).toBe(name);
      expect(document.querySelector('#user-list .user-tile-name').textContent).toBe(name);
    }
  );

  test('espaces en trop : le joueur choisi est bien celui qui vient d’être créé', () => {
    create('  Maël   Dupont ');
    expect(Object.keys(UserManager.getAllPlayers())).toEqual(['Maël Dupont']);
    expect(UserManager.getCurrentUser()).toBe('Maël Dupont');
  });

  test('un signe refusé est cité dans le message, et rien n’est créé', () => {
    const message = create('🦊');
    expect(message.hidden).toBe(false);
    expect(message.textContent).toBe(
      'Ton prénom ne peut pas contenir « 🦊 ». Garde les lettres, les chiffres, l’espace, l’apostrophe, le trait d’union, le point et le tiret bas.'
    );
    expect(UserManager.getAllPlayers()).toEqual({});
  });

  test.each(['Léa B.', 'Léa 2', 'Lucas_B'])(
    '« %s » se crée tel quel, pour distinguer deux élèves de même prénom',
    name => {
      expect(create(name).hidden).toBe(true);
      expect(Object.keys(UserManager.getAllPlayers())).toEqual([name]);
      expect(UserManager.getCurrentUser()).toBe(name);
      expect(document.querySelector('#user-list .user-tile-name').textContent).toBe(name);
    }
  );

  test('un prénom trop long est refusé avec sa limite', () => {
    expect(create('A'.repeat(51)).textContent).toBe(
      'Ton prénom est trop long : 50 caractères au plus.'
    );
  });

  test('vide : le message de toujours', () => {
    expect(create('   ').textContent).toBe('Écris d’abord ton prénom.');
  });

  test('doublon exact, même écrit avec des espaces en trop : refusé', () => {
    create('Zoé');
    UserManager._currentUser = null;
    expect(create('  Zoé ').textContent).toContain('existe déjà');
    expect(Object.keys(UserManager.getAllPlayers())).toEqual(['Zoé']);
  });
});

describe('Profils créés avec l’ancienne règle : toujours là', () => {
  beforeEach(() => {
    localStorage.clear();
    mount(CREATION_MARKUP);
    UserManager._players = {
      7: { nickname: '7' },
      'Léa B.': { nickname: 'Léa B.' },
      Zoé_2: { nickname: 'Zoé_2' },
    };
    UserManager._currentUser = null;
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.replaceChildren();
    UserManager._players = {};
    UserManager._currentUser = null;
    localStorage.clear();
  });

  test.each(['7', 'Léa B.', 'Zoé_2'])('« %s » : listé, choisi, supprimé', name => {
    UserManager.refreshUserList();
    const labels = [...document.querySelectorAll('#user-list .user-tile-name')];
    expect(labels.map(label => label.textContent)).toContain(name);
    expect(UserManager.selectUser(name)).not.toBeNull();
    expect(UserManager.getCurrentUser()).toBe(name);
    expect(UserManager.deleteUser(name)).toBe(true);
    expect(Object.keys(UserManager.getAllPlayers())).not.toContain(name);
  });
});

describe('Le prénom est toujours affiché comme du texte', () => {
  test('un nom abîmé en balises reste du texte dans sa tuile', () => {
    mount('<div id="user-list"></div>');
    const hostile = '<img src=x onerror="globalThis.pwned=1">';
    UserManager._players = { [hostile]: { avatar: 'fox' } };
    UserManager.refreshUserList();
    const label = document.querySelector('#user-list .user-tile-name');
    expect(label.textContent).toBe(hostile);
    expect(label.children).toHaveLength(0);
    expect(document.querySelectorAll('#user-list img')).toHaveLength(1);
    expect(globalThis.pwned).toBeUndefined();
    UserManager._players = {};
    document.body.replaceChildren();
  });
});

describe('escapeHtml (motif de l’apostrophe réécrit pour que Lizard lise le fichier)', () => {
  test('les cinq caractères sensibles sont échappés, l’apostrophe comprise', () => {
    expect(escapeHtml(`<a href="x">N'Guessan & co</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;N&#39;Guessan &amp; co&lt;/a&gt;'
    );
  });
});

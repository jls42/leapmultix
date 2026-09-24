/* eslint-env jest, node */
/**
 * Tests ESM - Mode Découverte (js/modes/DiscoveryMode.js)
 * Voix traduite, égalités insécables, tuiles du labo, titres, repli des traductions,
 * rendu unique au changement de langue, manipulation bornée au niveau, progression
 * propre à chaque opération, points et bonds.
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// --- Traductions simulées : une clé absente renvoie « [clé] », comme le vrai i18n ---
const dictionaries = {
  fr: {
    table_of: 'Table de',
    difficulty_easy: 'Facile',
    difficulty_medium: 'Moyen',
    difficulty_hard: 'Difficile',
    operation_addition: 'Addition',
    operation_subtraction: 'Soustraction',
    operation_division: 'Division',
    the_addition: "l'addition",
    the_subtraction: 'la soustraction',
    the_division: 'la division',
    discovery_mode: 'Mode Découverte',
    discovery_lab_title: 'La table de {table}',
    discovery_lab_intro_operations: 'Choisis un niveau.',
    discovery_levels_title_subtraction: 'Découvre la soustraction',
    discovery_levels_intro_subtraction: 'Soustraire, c’est enlever. Choisis ton niveau.',
    discovery_range_up_to: "jusqu'à {max}",
    discovery_explored: 'Déjà exploré',
    discovery_count_by: 'Compte de {n} en {step}\u00a0:',
    discovery_speech_multiplication: '{a} fois {b} égale {result}',
    discovery_speech_addition: '{a} plus {b} égale {result}',
    discovery_speech_subtraction: '{a} moins {b} égale {result}',
    discovery_speech_division: '{a} divisé par {b} égale {result}',
    hint: 'Indice',
    mnemonic_7: 'Pense au calendrier ! Une semaine = 7 jours, deux semaines = 14 jours…',
    group: 'Groupe',
  },
  en: {
    table_of: 'Table of',
    operation_subtraction: 'Subtraction',
    discovery_speech_multiplication: '{a} times {b} equals {result}',
    discovery_speech_division: '{a} divided by {b} equals {result}',
  },
};
let lang = 'fr';
const translate = (key, params = {}) => {
  const value = dictionaries[lang][key];
  if (value === undefined) return `[${key}]`;
  return Object.entries(params).reduce((text, [p, v]) => text.replace(`{${p}}`, v), value);
};

const speakMock = jest.fn();
const userStore = { current: { avatar: 'panda', preferredOperator: '×' } };

jest.unstable_mockModule('../../js/utils-es6.js', () => ({
  getTranslation: (key, params) => translate(key, params),
  speak: speakMock,
  numberToWords: value => String(value),
  addArrowKeyNavigation: () => {},
  showFeedback: () => {},
  updateInfoBar: () => {},
  showMessage: () => {},
  getDailyChallengeTable: () => 3,
}));
jest.unstable_mockModule('../../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => userStore.current,
    updateUserData: data => {
      userStore.current = data;
    },
  },
}));
jest.unstable_mockModule('../../js/slides.js', () => ({ goToSlide: () => {} }));
jest.unstable_mockModule('../../js/game.js', () => ({ gameState: {} }));
jest.unstable_mockModule('../../js/core/audio.js', () => ({ AudioManager: { stopAll: () => {} } }));
jest.unstable_mockModule('../../js/components/infoBar.js', () => ({
  InfoBar: {
    inject: () => {},
    createElement: () => document.createElement('div'),
  },
}));

const { DiscoveryMode } = await import('../../js/modes/DiscoveryMode.js');
const { getOperation } = await import('../../js/core/operations/OperationRegistry.js');

/** Maximum affiché (« jusqu'à N ») de chaque niveau */
const LEVEL_MAX = {
  '+': { easy: 10, medium: 20, hard: 40 },
  '−': { easy: 10, medium: 20, hard: 50 },
  '÷': { easy: 50, medium: 100, hard: 144 },
};

/** Crée un mode prêt pour un opérateur, sans passer par start() */
function createMode(operator = '×') {
  const mode = new DiscoveryMode();
  mode.operator = operator;
  mode.operation = getOperation(operator);
  return mode;
}

/** Analyse une chaîne HTML (sans l'insérer dans la page) pour l'interroger */
function toFragment(html) {
  return new DOMParser().parseFromString(html, 'text/html').body;
}

/** Insère une chaîne HTML (interne au test) dans la page */
function render(html) {
  const host = document.createElement('div');
  host.append(...toFragment(html).childNodes);
  document.body.appendChild(host);
  return host;
}

/** Crée un élément et ses attributs par l'API DOM */
function el(tag, attrs = {}) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([name, value]) => node.setAttribute(name, value));
  return node;
}

/** Le conteneur #game où GameMode construit l'écran */
function mountGame() {
  const game = el('div', { id: 'game' });
  document.body.appendChild(game);
  return game;
}

/** Laisse passer les rendus en file (import dynamique compris) */
function flushRenders(mode) {
  return mode._renderQueue.then(() => new Promise(resolve => setTimeout(resolve, 0)));
}

beforeEach(() => {
  lang = 'fr';
  speakMock.mockClear();
  userStore.current = { avatar: 'panda', preferredOperator: '×' };
  document.body.textContent = '';
  global.requestAnimationFrame = cb => setTimeout(cb, 0);
  window.scrollTo = () => {};
  window.matchMedia = () => ({ matches: false });
});

describe('ESM: Découverte, voix traduite', () => {
  test('prononce l’égalité dans la langue de l’interface', () => {
    const mode = createMode('×');
    mode.speakOperation(7, 3);
    expect(speakMock).toHaveBeenLastCalledWith('7 fois 3 égale 21');

    lang = 'en';
    mode.speakOperation(7, 3);
    expect(speakMock).toHaveBeenLastCalledWith('7 times 3 equals 21');
  });

  test('utilise la clé propre à chaque opération', () => {
    expect(createMode('+').getSpokenEquation(5, 4, 9)).toBe('5 plus 4 égale 9');
    expect(createMode('−').getSpokenEquation(9, 4, 5)).toBe('9 moins 4 égale 5');
    expect(createMode('÷').getSpokenEquation(12, 3, 4)).toBe('12 divisé par 3 égale 4');
  });

  test('sans traduction, garde les symboles et jamais « égale » en dur', () => {
    lang = 'en';
    const spoken = createMode('+').getSpokenEquation(5, 4, 9);
    expect(spoken).toBe('5 + 4 = 9');
    expect(spoken).not.toMatch(/égale/);
  });

  test('sans phrase propre à l’opération, lit l’égalité avec les mots des symboles', async () => {
    const store = await import('../../js/i18n-store.js');
    store.setTranslations({ speech_plus: 'plus', speech_equals: 'equals' });
    try {
      lang = 'en';
      expect(createMode('+').getSpokenEquation(5, 4, 9)).toBe('5 plus 4 equals 9');
    } finally {
      store.setTranslations({});
    }
  });

  test('choisir un niveau fait dire l’opération et le niveau (« Addition, Facile »)', async () => {
    mountGame();
    const mode = createMode('+');
    await mode.showLevel('easy');
    expect(speakMock).toHaveBeenLastCalledWith('Addition, Facile');
  });
});

describe('ESM: Découverte, choix de la table ou du niveau', () => {
  test('chaque tuile montre la quantité de sa table, sans émoji d’interface', () => {
    const mode = createMode('×');
    mode.exploredTables = [7];
    const frag = toFragment(mode.getTableSelectionHTML());

    expect(frag.querySelectorAll('.lab-item')).toHaveLength(10);
    expect(frag.querySelectorAll('.lab-item[data-table="7"] .lab-dot')).toHaveLength(7);
    expect(frag.querySelector('.lab-dots').getAttribute('aria-hidden')).toBe('true');
    // « Table de » et le nombre ne se séparent pas
    expect(frag.querySelector('.lab-item[data-table="7"] .lab-name').textContent).toBe(
      'Table de\u00a07'
    );
    expect(frag.textContent).not.toMatch(/🧪|✅/u);
  });

  test('les tuiles sont des boutons, atteignables au clavier', () => {
    const tables = toFragment(createMode('×').getTableSelectionHTML());
    const levels = toFragment(createMode('+').getTableSelectionHTML());
    [...tables.querySelectorAll('.lab-item'), ...levels.querySelectorAll('.lab-item')].forEach(
      tile => {
        expect(tile.tagName).toBe('BUTTON');
        expect(tile.getAttribute('type')).toBe('button');
      }
    );
  });

  test('la table explorée porte une coche doublée d’un texte pour lecteur d’écran', () => {
    const mode = createMode('×');
    mode.exploredTables = [7];
    const frag = toFragment(mode.getTableSelectionHTML());
    const badges = frag.querySelectorAll('.explored-badge');
    expect(badges).toHaveLength(1);
    expect(badges[0].closest('.lab-item').dataset.table).toBe('7');
    expect(badges[0].querySelector('svg')).not.toBeNull();
    // Sans clé dédiée à la table (« Déjà explorée »), repli sur la clé générique
    expect(badges[0].querySelector('.sr-only').textContent).toBe('Déjà exploré');
  });

  test('les coches sont là dès le premier affichage (GameMode construit l’UI avant onStart)', async () => {
    userStore.current = { avatar: 'fox', discoveryProgress: { exploredTables: [3] } };
    const mode = createMode('×');
    const html = await mode.getCustomHTML();
    const frag = toFragment(html);
    expect(frag.querySelector('.lab-item[data-table="3"] .explored-badge')).not.toBeNull();
  });

  test('sans profil courant, la lecture de la progression ne plante pas', () => {
    userStore.current = null;
    const mode = createMode('×');
    expect(() => mode.loadExploredTables()).not.toThrow();
    expect(() => mode.saveExploredTable(4)).not.toThrow();
    expect(mode.exploredTables).toEqual([4]);
  });

  test('les niveaux disent « jusqu’à N » avec le vrai maximum de chaque opération', () => {
    const division = toFragment(createMode('÷').getTableSelectionHTML());
    expect([...division.querySelectorAll('.lab-range')].map(node => node.textContent)).toEqual([
      "jusqu'à 50",
      "jusqu'à 100",
      "jusqu'à 144",
    ]);
    const addition = toFragment(createMode('+').getTableSelectionHTML());
    expect(addition.querySelector('.lab-range').textContent).toBe("jusqu'à 10");

    lang = 'en'; // clé absente : repli en symboles
    const fallback = toFragment(createMode('−').getTableSelectionHTML());
    expect(fallback.querySelector('.lab-range').textContent).toBe('≤\u00a010');
  });

  test('l’écran des niveaux dit quelle opération on explore, sans émoji', () => {
    const frag = toFragment(createMode('−').getTableSelectionHTML());
    expect(frag.querySelector('h2.discovery-lab-title').textContent).toBe(
      'Découvre la soustraction'
    );
    expect(frag.querySelector('.discovery-intro').textContent).toBe(
      'Soustraire, c’est enlever. Choisis ton niveau.'
    );
    const symbols = [...frag.querySelectorAll('.lab-item .lab-symbol')];
    expect(symbols.map(node => node.textContent)).toEqual(['−', '−', '−']);
    expect(symbols[0].getAttribute('aria-hidden')).toBe('true');
    // Le niveau se lit sans savoir lire : 1, 2 puis 3 barres pleines
    expect(
      [...frag.querySelectorAll('.lab-level')].map(
        bars => bars.querySelectorAll('.lab-level-bar.is-on').length
      )
    ).toEqual([1, 2, 3]);
    expect(frag.textContent).not.toMatch(/🌱|🌿|🌳|🧪/u);
    expect(frag.querySelector('.lab-icon')).toBeNull();
  });

  test('sans titre dédié, l’écran des niveaux retombe sur le nom de l’opération', () => {
    lang = 'en';
    const frag = toFragment(createMode('−').getTableSelectionHTML());
    expect(frag.querySelector('h2.discovery-lab-title').textContent).toBe('Subtraction');
  });

  test('« Déjà exploré » est propre à chaque opération ; les anciennes coches sans opération sont écartées', () => {
    userStore.current = { discoveryProgress: { exploredTables: [7, 'easy', 'hard'] } };

    const addition = createMode('+');
    addition.saveExploredTable('easy');
    expect(userStore.current.discoveryProgress.exploredTables).toEqual([7, '+:easy']);
    const additionTiles = toFragment(addition.getTableSelectionHTML());
    expect(additionTiles.querySelectorAll('.explored-badge')).toHaveLength(1);
    expect(additionTiles.querySelector('[data-level="easy"] .explored-badge')).not.toBeNull();

    for (const operator of ['−', '÷']) {
      const other = createMode(operator);
      other.loadExploredTables();
      expect(
        toFragment(other.getTableSelectionHTML()).querySelectorAll('.explored-badge')
      ).toHaveLength(0);
    }

    const tables = createMode('×');
    tables.loadExploredTables();
    const tableTiles = toFragment(tables.getTableSelectionHTML());
    expect(tableTiles.querySelector('[data-table="7"] .explored-badge')).not.toBeNull();
  });
});

describe('ESM: Découverte, rendu', () => {
  test('changer de langue deux fois d’affilée ne duplique pas l’écran ni les écouteurs', async () => {
    const game = mountGame();
    const mode = createMode('×');
    mode.currentTable = 7;
    mode.phase = 'exploration';
    await mode.initializeUI();

    // bootstrap.js relaie l’événement deux fois (eventBus, puis window)
    await Promise.all([mode.refreshTexts(), mode.refreshTexts()]);

    expect(game.querySelectorAll('.content-card')).toHaveLength(1);
    for (const id of [
      'drop-zone',
      'animation-container',
      'discovery-table-back-btn',
      'visual-grid-container',
    ]) {
      expect(document.querySelectorAll(`#${id}`)).toHaveLength(1);
    }

    speakMock.mockClear();
    game.querySelector('.carousel-item').click();
    expect(speakMock).toHaveBeenCalledTimes(1);
    expect(game.querySelectorAll('.animated-equation')).toHaveLength(1);
  });

  test('« Retour » après un changement de langue affiche dix tables, pas vingt', async () => {
    const game = mountGame();
    const mode = createMode('×');
    mode.currentTable = 7;
    mode.phase = 'exploration';
    await Promise.all([mode.initializeUI(), mode.refreshTexts(), mode.refreshTexts()]);

    game.querySelector('#discovery-table-back-btn').click();
    await flushRenders(mode);

    expect(game.querySelectorAll('.lab-item')).toHaveLength(10);
    expect(game.querySelectorAll('.content-card')).toHaveLength(1);
  });

  test('un changement de langue garde les mêmes exemples', async () => {
    mountGame();
    const mode = createMode('+');
    mode.currentLevel = 'hard';
    mode.phase = 'exploration';
    await mode.initializeUI();
    const before = [...document.querySelectorAll('.carousel-item')].map(node => node.textContent);

    lang = 'en';
    await mode.refreshTexts();
    const after = [...document.querySelectorAll('.carousel-item')].map(node => node.textContent);
    expect(after).toEqual(before);
  });

  test('un écran remplacé par un autre mode n’est pas redessiné', async () => {
    const game = mountGame();
    const mode = createMode('×');
    await mode.initializeUI();
    game.textContent = '';
    await mode.refreshTexts();
    expect(game.querySelector('.content-card')).toBeNull();
  });
});

describe('ESM: Découverte, exploration', () => {
  test('le titre d’un niveau nomme l’opération puis le niveau', () => {
    const mode = createMode('+');
    mode.currentLevel = 'easy';
    mode.phase = 'exploration';
    const frag = toFragment(mode.getTableExplorationHTML());
    const title = frag.querySelector('h2.discovery-lab-title');
    expect(title.textContent).toBe('Addition – Facile');
    expect(title.textContent).not.toMatch(/Laboratoire|Bienvenue/);
  });

  test('les égalités sont des boutons, sans carte générique imbriquée, et sans doublon', () => {
    const mode = createMode('+');
    mode.currentLevel = 'easy';
    const frag = toFragment(mode.getTableExplorationHTML());
    const items = [...frag.querySelectorAll('.carousel-item')];
    expect(items).toHaveLength(10);
    expect(frag.querySelector('.card-base')).toBeNull();
    items.forEach(item => {
      expect(item.tagName).toBe('BUTTON');
      expect(item.querySelector('.equation-display').textContent).toMatch(/^\d+ \+ \d+ = \d+$/);
    });
    // 3 + 5 et 5 + 3 ne comptent qu’une fois
    const pairs = new Set(
      items.map(item => [item.dataset.a, item.dataset.b].sort((x, y) => x - y).join('|'))
    );
    expect(pairs.size).toBe(10);
  });

  test.each([
    ['+', 'easy', 2, 10],
    ['+', 'medium', 11, 20],
    ['+', 'hard', 21, 40],
  ])('addition %s : exemples rangés, dans la bande du niveau', (operator, level, min, max) => {
    const mode = createMode(operator);
    mode.currentLevel = level;
    const examples = mode._getPlan().examples;
    expect(examples).toHaveLength(10);
    examples.forEach(({ result }) => {
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
    const order = examples.map(({ a, b }) => a * 100 + b);
    expect(order).toEqual([...order].sort((x, y) => x - y));
  });

  test.each([
    ['easy', 2, 10],
    ['medium', 11, 20],
    ['hard', 21, 50],
  ])(
    'soustraction %s : premier nombre dans la bande, jamais de résultat nul ou négatif',
    (level, min, max) => {
      const mode = createMode('−');
      mode.currentLevel = level;
      mode._getPlan().examples.forEach(({ a, result }) => {
        expect(a).toBeGreaterThanOrEqual(min);
        expect(a).toBeLessThanOrEqual(max);
        expect(result).toBeGreaterThan(0);
      });
    }
  );

  test('division : la « table » d’un diviseur du niveau, dans l’ordre', () => {
    const mode = createMode('÷');
    mode.currentLevel = 'medium';
    const examples = mode._getPlan().examples;
    const divisors = new Set(examples.map(({ b }) => b));
    expect(divisors.size).toBe(1);
    const [divisor] = divisors;
    expect(divisor).toBeGreaterThanOrEqual(6);
    expect(divisor).toBeLessThanOrEqual(10);
    expect(examples.map(({ result }) => result)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    examples.forEach(({ a }) => expect(a).toBeLessThanOrEqual(LEVEL_MAX['÷'].medium));
  });

  test('l’égalité d’exemple reste groupée, l’explication à part', () => {
    const mode = createMode('÷');
    mode.currentLevel = 'easy';
    const frag = toFragment(mode.getTableExplorationHTML());
    const example = frag.querySelector('.example-equation');
    const unit = example.querySelector('.equation');
    expect(unit.querySelectorAll('.eq-number, .eq-operator, .eq-equals, .eq-result')).toHaveLength(
      5
    );
    expect(unit.querySelector('.eq-explanation')).toBeNull();
    expect(example.querySelector(':scope > .eq-explanation')).not.toBeNull();
  });

  test('l’indice est donné par la mascotte du joueur, sans émoji de magicien', () => {
    const mode = createMode('×');
    mode.currentTable = 7;
    let frag = toFragment(mode.getTableExplorationHTML());
    const img = frag.querySelector('.mnemonic-tip img.mnemonic-mascot');
    expect(img.getAttribute('src')).toBe('assets/images/arcade/panda_head_avatar_128x128.png');
    expect(img.getAttribute('alt')).toBe('');
    expect(frag.textContent).not.toMatch(/🧙/u);

    userStore.current = { avatar: '../../evil' };
    frag = toFragment(mode.getTableExplorationHTML());
    expect(frag.querySelector('.mnemonic-mascot').getAttribute('src')).toBe(
      'assets/images/arcade/fox_head_avatar_128x128.png'
    );
  });

  test('l’indice ne coupe pas ses égalités en fin de ligne', () => {
    const mode = createMode('×');
    mode.currentTable = 7;
    const tip = toFragment(mode.getTableExplorationHTML()).querySelector('.mnemonic-tip p');
    expect(tip.textContent).toContain('semaine\u00a0=\u00a07\u00a0jours');
    expect(tip.textContent).toContain('semaines\u00a0=\u00a014\u00a0jours');
  });

  test('les points des visualisations sont dessinés en CSS et masqués aux lecteurs d’écran', () => {
    const mode = createMode('×');
    mode.currentTable = 7;
    const frag = toFragment(mode.getTableExplorationHTML());
    const representation = frag.querySelector('.visual-item .visual-representation');
    expect(representation.getAttribute('aria-hidden')).toBe('true');
    expect(frag.querySelector('.visual-item').getAttribute('style')).toContain('--per-row: 7');
    expect(frag.querySelector('.visual-exploration').textContent).not.toMatch(/🔵|🟢/u);
  });

  test('addition : le second nombre se distingue par la forme, pas par le vert', () => {
    const frag = toFragment(createMode('+').generateVisualObjects(3, 4));
    expect(frag.querySelectorAll('.visual-group-first .visual-object')).toHaveLength(3);
    expect(frag.querySelectorAll('.visual-group-second .visual-object')).toHaveLength(4);
  });

  test('le partage équitable se dessine en points, décor masqué aux lecteurs d’écran', () => {
    const mode = createMode('÷');
    mode.currentLevel = 'easy';
    const frag = toFragment(mode.getTableExplorationHTML());
    expect(frag.textContent).not.toMatch(/🍎|🧪/u);
    expect(frag.querySelector('.total-items').getAttribute('aria-hidden')).toBe('true');
    expect(frag.querySelectorAll('.total-items .visual-object')).toHaveLength(12);
    expect(frag.querySelectorAll('.share-items[aria-hidden="true"] .visual-object')).toHaveLength(
      12
    );
    expect(frag.querySelector('.arrow-symbol').getAttribute('aria-hidden')).toBe('true');
  });

  test('ligne numérique : en Moyen, le bond s’arrête à la dizaine ronde', () => {
    const mode = createMode('+');
    mode.currentLevel = 'medium';
    const frag = toFragment(mode.generateNumberLineHTML());
    expect([...frag.querySelectorAll('.jump-label')].map(node => node.textContent)).toEqual([
      '+2',
      '+3',
    ]);
    expect(frag.querySelector('.highlight-start').dataset.value).toBe('8');
    expect(frag.querySelector('.highlight-end').dataset.value).toBe('13');
  });
});

describe('ESM: Découverte, zone d’animation', () => {
  function setupAnimationArea() {
    const container = document.createElement('div');
    container.id = 'animation-container';
    document.body.appendChild(container);
    return container;
  }

  test('« Compte de 7 en 7 » est traduit, chaque flèche reste collée à son nombre', () => {
    const container = setupAnimationArea();
    createMode('×').triggerAnimation(7, 3);
    expect(container.querySelector('.calc-step').textContent).toBe('Compte de 7 en 7\u00a0:');
    const hops = [...container.querySelectorAll('.calc-hop')];
    expect(hops.map(hop => hop.querySelector('.calc-number').textContent)).toEqual([
      '7',
      '14',
      '21',
    ]);
    // La flèche est dans le même bloc que le nombre qui la précède, et masquée
    expect(hops[0].querySelector('.calc-arrow').getAttribute('aria-hidden')).toBe('true');
    expect(hops[2].querySelector('.calc-arrow')).toBeNull();
    // Le rang de chaque bond, sous le nombre
    expect([...container.querySelectorAll('.calc-index')].map(node => node.textContent)).toEqual([
      '1',
      '2',
      '3',
    ]);
    expect(speakMock).toHaveBeenLastCalledWith('7 fois 3 égale 21');
  });

  test('sans traduction, pas de légende en français en dur', () => {
    lang = 'en';
    const container = setupAnimationArea();
    createMode('×').triggerAnimation(7, 3);
    expect(container.querySelector('.calc-step')).toBeNull();
    expect(container.textContent).not.toMatch(/Compter|Compte/);
  });

  test('les petites multiplications se comptent en points groupés, jamais en pommes', () => {
    const container = setupAnimationArea();
    createMode('×').triggerAnimation(4, 3);
    expect(container.querySelectorAll('.object-group')).toHaveLength(3);
    expect(container.querySelectorAll('.object-group .visual-object')).toHaveLength(12);
    expect(container.querySelector('.animation-objects').getAttribute('aria-hidden')).toBe('true');
    expect(container.textContent).not.toMatch(/🍎/u);
  });

  test('de grands nombres ne dévoilent pas le résultat avant « = résultat »', () => {
    const container = setupAnimationArea();
    const mode = createMode('−');
    mode.currentLevel = 'medium';
    mode.triggerAnimation(18, 7);
    expect(container.querySelector('.visual-message')).toBeNull();
    expect(container.querySelector('.animation-result').textContent).toBe('= 11');

    container.textContent = '';
    mode.triggerAnimation(9, 4);
    const objects = container.querySelector('.animation-objects');
    expect(objects.getAttribute('aria-hidden')).toBe('true');
    expect(objects.querySelectorAll('.visual-object-removed')).toHaveLength(4);
  });

  test('au-delà de 10, l’addition se montre en bonds : dizaines, puis jusqu’à la dizaine ronde', () => {
    const container = setupAnimationArea();
    createMode('+').triggerAnimation(16, 17);
    expect([...container.querySelectorAll('.calc-number')].map(node => node.textContent)).toEqual([
      '16',
      '26',
      '30',
      '33',
    ]);
    expect(
      [...container.querySelectorAll('.calc-leap-label')].map(node => node.textContent)
    ).toEqual(['+10', '+4', '+3']);
    expect(container.querySelector('.animation-result').textContent).toBe('= 33');
  });

  test('la soustraction de grands nombres recule par bonds, avec le vrai signe moins', () => {
    const container = setupAnimationArea();
    createMode('−').triggerAnimation(45, 27);
    expect([...container.querySelectorAll('.calc-number')].map(node => node.textContent)).toEqual([
      '45',
      '25',
      '20',
      '18',
    ]);
    expect(
      [...container.querySelectorAll('.calc-leap-label')].map(node => node.textContent)
    ).toEqual(['−20', '−5', '−2']);
  });

  test('la division de grands nombres compte les bonds du diviseur', () => {
    const container = setupAnimationArea();
    createMode('÷').triggerAnimation(28, 7);
    expect([...container.querySelectorAll('.calc-number')].map(node => node.textContent)).toEqual([
      '7',
      '14',
      '21',
      '28',
    ]);
    expect(container.querySelectorAll('.calc-index')).toHaveLength(4);
    expect(container.querySelector('.animation-result').textContent).toBe('= 4');
  });

  test('la zone d’animation est amenée à l’écran, sans défilement animé si le mouvement est réduit', () => {
    const host = render('<div class="animation-area"><div id="animation-container"></div></div>');
    const area = host.querySelector('.animation-area');
    area.scrollIntoView = jest.fn();

    createMode('×').triggerAnimation(3, 5);
    expect(area.scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest', behavior: 'smooth' });

    window.matchMedia = query => ({ matches: query.includes('reduce') });
    createMode('×').triggerAnimation(3, 10);
    expect(area.scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest', behavior: 'auto' });
  });
});

describe('ESM: Découverte, manipulation', () => {
  test.each(['easy', 'medium', 'hard'])(
    'soustraction %s : jamais de résultat négatif, le premier terme ne change pas',
    level => {
      const mode = createMode('−');
      mode.currentLevel = level;
      const plan = mode._getDropPlan();
      const firsts = new Set();
      plan.items.forEach(number => {
        const { a, b, result } = mode._calculateDropOperands(number);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(a).toBeGreaterThanOrEqual(b);
        expect(a).toBeLessThanOrEqual(LEVEL_MAX['−'][level]);
        firsts.add(a);
      });
      expect(firsts.size).toBe(1);
    }
  );

  test.each([
    ['+', 'easy'],
    ['+', 'medium'],
    ['+', 'hard'],
    ['÷', 'easy'],
    ['÷', 'medium'],
    ['÷', 'hard'],
  ])('%s %s : chaque nombre posé reste dans les limites affichées du niveau', (operator, level) => {
    const mode = createMode(operator);
    mode.currentLevel = level;
    const max = LEVEL_MAX[operator][level];
    mode._getDropPlan().items.forEach(number => {
      const { a, b, result } = mode._calculateDropOperands(number);
      expect(Math.max(a, b, result)).toBeLessThanOrEqual(max);
      expect(Number.isInteger(result)).toBe(true);
      // Le même nombre posé donne toujours le même calcul
      expect(mode._calculateDropOperands(number)).toEqual({ a, b, result });
    });
  });

  test('un nombre hors de la liste proposée est refusé', () => {
    const mode = createMode('+');
    mode.currentLevel = 'easy';
    expect(mode._calculateDropOperands(10)).toBeNull();
  });

  test('le terme fixe est affiché d’emblée, le nombre posé prend la place du « ? », sans vert', () => {
    const mode = createMode('−');
    mode.currentLevel = 'easy';
    const host = render(mode.generateInteractionHTML());
    const zone = host.querySelector('#drop-zone');
    expect(zone.textContent.replace(/\s+/g, ' ').trim()).toBe('10 − ? = ?');
    expect(zone.textContent).not.toMatch(/🧪/u);

    mode._placeNumber(3);
    expect(zone.querySelector('.dropzone-content').textContent).toBe('10 − 3 = 7');
    expect(zone.querySelector('.drop-placed').textContent).toBe('3');
    expect(zone.classList.contains('is-filled')).toBe(true);
    expect(zone.classList.contains('success')).toBe(false);
    expect(speakMock).toHaveBeenLastCalledWith('10 moins 3 égale 7');
  });

  test('on pose un nombre au clavier (Entrée) comme d’un simple toucher', () => {
    const mode = createMode('×');
    mode.currentTable = 6;
    const host = render(mode.generateInteractionHTML());
    mode.setupDragAndDrop(host);
    const four = host.querySelector('.drag-item[data-number="4"]');
    expect(four.getAttribute('role')).toBe('button');
    expect(four.getAttribute('tabindex')).toBe('0');

    four.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(host.querySelector('.dropzone-content').textContent).toBe('6 × 4 = 24');

    const two = host.querySelector('.drag-item[data-number="2"]');
    mode.handleTouchStart({
      preventDefault: () => {},
      currentTarget: two,
      touches: [{ clientX: 10, clientY: 10 }],
    });
    mode.handleTouchEnd({
      preventDefault: () => {},
      changedTouches: [{ clientX: 11, clientY: 10 }],
    });
    expect(host.querySelector('.dropzone-content').textContent).toBe('6 × 2 = 12');
    expect(mode.touchClone).toBeNull();
  });
});

describe('ESM: Découverte, interactions', () => {
  test('l’égalité animée est marquée comme courante, une seule à la fois', () => {
    const carousel = el('div');
    carousel.append(el('div', { class: 'carousel-item', id: 'a' }));
    carousel.append(el('div', { class: 'carousel-item', id: 'b' }));
    document.body.appendChild(carousel);
    const mode = createMode('×');
    mode._markCurrentCarouselItem(carousel, carousel.querySelector('#a'));
    mode._markCurrentCarouselItem(carousel, carousel.querySelector('#b'));
    expect(carousel.querySelectorAll('.is-current')).toHaveLength(1);
    expect(carousel.querySelector('#b').getAttribute('aria-current')).toBe('true');
    expect(carousel.querySelector('#a').hasAttribute('aria-current')).toBe(false);
  });

  test('le panneau touché est mis en évidence, un seul à la fois (+, −, ÷)', () => {
    const grid = el('div');
    grid.append(el('div', { class: 'visual-item', 'data-a': '2', 'data-b': '3' }));
    grid.append(el('div', { class: 'visual-item', 'data-a': '1', 'data-b': '1' }));
    document.body.appendChild(grid);
    const target = grid.querySelector('[data-a="2"]');
    createMode('+').highlightVisualAid(2, 3, target);
    expect(target.classList.contains('highlighted')).toBe(true);
    expect(grid.querySelectorAll('.highlighted')).toHaveLength(1);

    createMode('+').highlightVisualAid(1, 1);
    expect(grid.querySelector('[data-a="1"]').classList.contains('highlighted')).toBe(true);
    expect(grid.querySelectorAll('.highlighted')).toHaveLength(1);
  });

  test('la copie tactile ne reçoit que sa position (empilement et style en CSS)', () => {
    const mode = createMode('×');
    mode.touchClone = document.createElement('div');
    mode.touchCloneHalf = 28;
    mode.positionClone(100, 200);
    expect(mode.touchClone.style.left).toBe('72px');
    expect(mode.touchClone.style.top).toBe('172px');
    expect(mode.touchClone.style.zIndex).toBe('');
    expect(mode.touchClone.style.position).toBe('');
  });
});

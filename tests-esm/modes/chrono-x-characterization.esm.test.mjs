/* eslint-env jest, node */
/**
 * Caractérisation des écrans de Chrono en multiplication, figée avant l'ouverture aux autres
 * opérations : questions de course et de révision, écran de départ, liste à revoir et ligne
 * d'ajout, « Mes temps », écran de fin, Défi du jour, et le profil ancien de Zoé relu puis
 * réécrit sans rien perdre. Le profil est copié à chaque lecture, comme UserManager.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { createSlidesMock } from '../helpers/mode-test-helpers.mjs';
import {
  createLazyLoaderMock,
  createGameMock,
  createSpeechMock,
  createChronoNavigation,
  createChronoDriver,
  trackChronoInstances,
  quietFakeTime,
} from '../helpers/chrono-test-helpers.mjs';
import { legacyPlayers } from '../helpers/legacy-profiles.mjs';

let persisted;
const copy = value => JSON.parse(JSON.stringify(value));
jest.unstable_mockModule('../../js/core/userState.js', () => ({
  UserState: {
    getCurrentUserData: () => copy(persisted),
    updateUserData: data => {
      persisted = { ...persisted, ...copy(data) };
    },
  },
}));
const updateDailyChallengeProgress = jest.fn();
const refs = {};
const goToSlide = createChronoNavigation(jest, refs);
jest.unstable_mockModule('../../js/lazy-loader.js', createLazyLoaderMock);
jest.unstable_mockModule('../../js/game.js', () =>
  createGameMock(jest, updateDailyChallengeProgress)
);
const speak = jest.fn();
jest.unstable_mockModule('../../js/speech.js', () =>
  createSpeechMock({ speak, preloadSpeech: jest.fn() })
);
jest.unstable_mockModule('../../js/slides.js', () => ({ ...createSlidesMock(jest), goToSlide }));

const store = await import('../../js/i18n-store.js');
const { AudioManager } = await import('../../js/core/audio.js');
refs.orchestrator = await import('../../js/mode-orchestrator.js');
refs.chronoModule = await import('../../js/modes/ChronoMode.js');
const { ChronoMode, stopChronoMode } = refs.chronoModule;
const FR = JSON.parse(
  readFileSync(new URL('../../assets/translations/fr.json', import.meta.url), 'utf8')
);

let instances = [];
const { flush, startChrono, showQuestion, answer } = createChronoDriver(
  jest,
  refs,
  () => instances
);
const text = el => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

beforeEach(() => {
  trackChronoInstances(jest, ChronoMode, () => instances);
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  document.body.innerHTML = '<div id="game"></div><div id="results"></div>';
  persisted = { preferredOperator: '×', coins: 0 };
  instances = [];
  updateDailyChallengeProgress.mockReset();
  speak.mockReset();
  quietFakeTime(jest, AudioManager);
});

afterEach(() => {
  stopChronoMode();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

async function openMenu() {
  await refs.orchestrator.setGameMode('chrono');
  await flush();
  return instances.at(-1);
}

describe('Chrono × : questions', () => {
  test('course au pavé : « a × b = ? », table = a, multiplicande = b, réponse a × b', async () => {
    const chrono = await startChrono();
    const seen = [];
    for (let i = 0; i < 30 && chrono.state.isActive; i += 1) {
      const q = chrono.state.currentQuestion;
      seen.push(q);
      // Une erreur sur deux : la course dure, et l'on voit plus de questions
      await answer(chrono, i % 2 === 0);
    }
    expect(seen.length).toBeGreaterThanOrEqual(19);
    for (const q of seen) {
      expect(q.operator).toBe('×');
      expect(q.type).toBe('classic');
      expect(q.question).toBe(`${q.table} × ${q.num} = ?`);
      expect(q.a).toBe(q.table);
      expect(q.b).toBe(q.num);
      expect(q.answer).toBe(q.table * q.num);
      expect(q.table).toBeGreaterThanOrEqual(1);
      expect(q.table).toBeLessThanOrEqual(10);
      expect(q.num).toBeGreaterThanOrEqual(1);
      expect(q.num).toBeLessThanOrEqual(10);
    }
  });

  test('course au QCM : réponses en chiffres, la bonne parmi elles, question dite', async () => {
    const chrono = await startChrono({ inputMode: 'mcq' });
    const q = chrono.state.currentQuestion;
    expect(q.type).toBe('mcq');
    const options = [...document.querySelectorAll('#chrono-options .option')].map(text);
    expect(options).toContain(String(q.answer));
    for (const option of options) expect(option).toMatch(/^\d+$/);
    // Espace insécable avant le point d'interrogation, comme dans fr.json (speech_question)
    expect(speak.mock.calls.at(-1)[0]).toBe(`Combien font ${q.table} fois ${q.num}\u00a0?`);
  });

  test('révision : la question est construite pour le calcul de la liste', async () => {
    persisted.chronoStats = { buckets: [], basket: [{ a: 6, b: 7, due: 1 }] };
    const chrono = await startChrono({ revision: true });
    const q = chrono.state.currentQuestion;
    expect(['6 × 7 = ?', '7 × 6 = ?']).toContain(q.question);
    const { a, b } = q;
    expect(q).toEqual({
      question: `${a} × ${b} = ?`,
      answer: 42,
      type: 'classic',
      operator: '×',
      a,
      b,
      table: a,
      num: b,
    });
  });
});

describe('Chrono × : Défi du jour et pièces', () => {
  test('bonne réponse de course : une pièce, puis le Défi du jour avec table et multiplicande', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 5, 7);
    await answer(chrono);
    expect(updateDailyChallengeProgress).toHaveBeenCalledTimes(1);
    expect(updateDailyChallengeProgress).toHaveBeenCalledWith(5, 7);
    expect(persisted.coins).toBe(1);
  });

  test('révision : ni pièce par réponse ni Défi du jour', async () => {
    persisted.chronoStats = { buckets: [], basket: [{ a: 5, b: 7, due: 1 }] };
    const chrono = await startChrono({ revision: true });
    await answer(chrono);
    expect(updateDailyChallengeProgress).not.toHaveBeenCalled();
    expect(persisted.coins).toBe(0);
  });
});

describe('Chrono × : écran de départ', () => {
  test('textes de la course, liste à revoir et ligne d’ajout', async () => {
    persisted.chronoStats = {
      buckets: [],
      basket: [
        { a: 8, b: 9, due: 1 },
        { a: 6, b: 7, due: 2 },
      ],
    };
    await openMenu();
    expect(text(document.querySelector('#chrono-race-title'))).toBe('Course contre la montre');
    expect(text(document.querySelector('.chrono-race p'))).toBe(
      '10 bonnes réponses, le plus vite possible, sur tes tables.'
    );
    expect(text(document.querySelector('.chrono-race .chrono-tables-hint'))).toBe(
      'Tes tables se règlent avec l’engrenage, en haut ou dans le menu — le même choix que pour les autres jeux.'
    );
    const items = [...document.querySelectorAll('.chrono-basket-item')];
    expect(items.map(li => text(li.querySelector('.chrono-basket-eq')))).toEqual([
      '6 × 7',
      '8 × 9',
    ]);
    expect(items.map(li => text(li.querySelector('.chrono-basket-errors')))).toEqual([
      '2 fois',
      '1 fois',
    ]);
    expect(items[0].querySelector('.chrono-basket-remove').getAttribute('aria-label')).toBe(
      'Retirer 6 × 7'
    );
    const add = document.querySelector('.chrono-basket-add');
    expect(text(add.querySelector('.chrono-basket-add-label'))).toBe('Ajouter un calcul :');
    expect(text(add.querySelector('.chrono-basket-times'))).toBe('×');
    for (const id of ['chrono-add-a', 'chrono-add-b']) {
      const values = [...document.getElementById(id).options].map(o => o.textContent);
      expect(values).toEqual(['?', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    }
  });

  test('ajout à la main : 6 × 7 puis 7 × 6, chacun sa ligne', async () => {
    persisted.chronoStats = { buckets: [], basket: [] };
    const chrono = await openMenu();
    const add = async (a, b) => {
      document.getElementById('chrono-add-a').value = String(a);
      document.getElementById('chrono-add-b').value = String(b);
      document.getElementById('chrono-basket-add').click();
      await flush();
    };
    await add(6, 7);
    await add(7, 6);
    await add(6, 7);
    expect(persisted.chronoStats.basket).toEqual([
      { a: 6, b: 7, due: 2 },
      { a: 7, b: 6, due: 1 },
    ]);
    expect(chrono.phase).toBe('setup');
  });
});

describe('Chrono × : « Mes temps » et écran de fin', () => {
  test('classements de Zoé : libellés, parties, ordre', async () => {
    persisted = copy(legacyPlayers()['Zoé']);
    const chrono = await openMenu();
    await chrono.openStatsPick();
    const rows = [...document.querySelectorAll('.chrono-stats-row')];
    expect(rows.map(row => text(row.querySelector('.chrono-stats-label')))).toEqual([
      'Toutes les tables · Je tape',
      'Table 7 · Je choisis',
      'Tables 2, 3, 4, 5, 6, 7, 8, 9, 10 · Je tape',
    ]);
    expect(rows.map(row => text(row.querySelector('.chrono-stats-count')))).toEqual([
      '6 parties',
      '2 parties',
      '1 partie',
    ]);
    await chrono.openStatsDetail(rows[1].dataset.bucketKey);
    const panel = document.querySelector('.chrono-setup-panel');
    expect(text(panel.querySelector('.chrono-tables-hint'))).toBe('Table 7 · Je choisis');
    expect([...panel.querySelectorAll('.chrono-ranking li')].length).toBe(2);
  });

  test('écran de fin : chaque calcul « a × b = produit », juste ou faux, dans l’ordre', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 7, 8);
    await answer(chrono, false);
    showQuestion(chrono, 3, 4);
    await answer(chrono);
    while (chrono.state.correctAnswers < 10) await answer(chrono);
    await flush(1000);
    const facts = [...document.querySelectorAll('#results .chrono-fact')];
    expect(text(facts[0].querySelector('.chrono-fact-eq'))).toBe('7 × 8 = 56');
    expect(facts[0].classList.contains('is-wrong')).toBe(true);
    expect(text(facts[1].querySelector('.chrono-fact-eq'))).toBe('3 × 4 = 12');
    expect(facts[1].classList.contains('is-correct')).toBe(true);
    for (const li of facts) {
      expect(text(li.querySelector('.chrono-fact-eq'))).toMatch(/^(\d+) × (\d+) = (\d+)$/);
    }
    expect(text(document.querySelector('#results'))).toContain('Temps de la partie');
  });
});

describe('Chrono × : le profil ancien de Zoé', () => {
  test('une course ne touche qu’à chronoStats, aux pièces et aux compteurs ; les clés restent celles d’avant', async () => {
    const before = copy(legacyPlayers()['Zoé']);
    persisted = copy(before);
    const chrono = await startChrono();
    showQuestion(chrono, 4, 4);
    await answer(chrono, false);
    while (chrono.state.correctAnswers < 10) await answer(chrono);
    await flush(1000);

    const { chronoStats, coins, modeStats, operationStats, ...rest } = persisted;
    const { chronoStats: oldChrono, coins: oldCoins, ...oldRest } = before;
    // Rien d'autre ne bouge : ni l'historique (Chrono ne l'écrit pas) ni la meilleure série,
    // déjà à 10 chez Zoé ; qu'une course sans faute la fasse monter, comme en v36, est vérifié
    // dans chrono-operations (« comme avant, une course sans faute… »)
    expect(rest).toEqual(oldRest);
    expect(coins).toBe(oldCoins + 10);
    // Statistiques par calcul, rangées dans le profil et non plus dans une clé commune à
    // l'appareil : les onze réponses de la course, dont 4 × 4 raté
    const counted = Object.values(operationStats);
    expect(counted.reduce((sum, entry) => sum + entry.attempts, 0)).toBe(11);
    expect(counted.reduce((sum, entry) => sum + entry.errors, 0)).toBe(1);
    expect(operationStats['4×4']).toMatchObject({ operator: '×', a: 4, b: 4, errors: 1 });
    // v37 : la course compte au tableau de bord, une partie et ses onze réponses, après les
    // neuf courses de Zoé reprises de ses classements (amorçage à la première écriture)
    expect(modeStats.modes.chrono['×']).toEqual({ games: 10, questions: 11, correct: 10 });
    expect(chronoStats.buckets.map(b => [b.key, b.count])).toEqual([
      ['1,2,3,4,5,6,7,8,9,10|keypad', 7],
      ['7|mcq', 2],
      ['2,3,4,5,6,7,8,9,10|keypad', 1],
    ]);
    expect(chronoStats.basket).toEqual([
      { a: 6, b: 7, due: 2 },
      { a: 8, b: 9, due: 1 },
      { a: 7, b: 8, due: 2 },
      { a: 4, b: 4, due: 1 },
    ]);
    // La façon de répondre choisie au départ est retenue (Zoé était en QCM)
    expect(chronoStats.lastInputMode).toBe('keypad');
    expect(Object.keys(chronoStats).sort()).toEqual(Object.keys(oldChrono).sort());
  });
});

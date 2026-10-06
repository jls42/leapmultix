/* eslint-env jest, node */
/**
 * Mode Chrono, joué de bout en bout :
 * - une erreur est marquée sans la réponse, l'écran de fin donne chaque calcul complet ;
 *   rien ne reste sous la question suivante, et l'inverse ne suit pas ;
 * - le chrono s'arrête à la 10e bonne réponse, la partie s'enregistre une fois ;
 * - un abandon n'ajoute rien au classement ni à la liste ;
 * - l'écran de départ : la course et la liste ont chacune leur bouton, le focus clavier
 *   reste en place quand la liste change ;
 * - les résultats relancent par l'orchestrateur : aucune partie ne tourne en arrière-plan ;
 * - record, révision (le compteur baisse, une pièce par calcul sorti), langue, voix.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { createUserStateMock } from '../helpers/mode-test-helpers.mjs';

const userStore = { preferredOperator: '×', coins: 0 };
jest.unstable_mockModule('../../js/core/userState.js', () => createUserStateMock(userStore));
jest.unstable_mockModule('../../js/lazy-loader.js', () => ({
  lazyLoader: { loadForGameMode: async () => {} },
}));
const updateDailyChallengeProgress = jest.fn();
const gameState = { gameMode: null, avatar: 'fox', streak: 0 };
jest.unstable_mockModule('../../js/game.js', () => ({
  gameState,
  default: gameState,
  updateDailyChallengeProgress,
  displayDailyChallenge: jest.fn(),
}));
const speak = jest.fn();
const preloadSpeech = jest.fn();
jest.unstable_mockModule('../../js/speech.js', () => ({
  speak,
  preloadSpeech,
  isVoiceEnabled: () => true,
  updateSpeechVoice: () => {},
  cancelSpeech: () => {},
  whenSpeechEnds: () => Promise.resolve(),
}));

// Navigation comme slides.js : quitter un écran arrête Chrono, sauf pendant son démarrage
// par l'orchestrateur (c'est ce qui protège une relance depuis les résultats)
let orchestrator;
let chronoModule;
const goToSlide = jest.fn(async () => {
  if (orchestrator?.getStartingMode() !== 'chrono') chronoModule?.stopChronoMode();
});
jest.unstable_mockModule('../../js/slides.js', () => ({
  goToSlide,
  showSlide: jest.fn(),
  hideAllSlides: jest.fn(),
  nextSlide: jest.fn(),
  prevSlide: jest.fn(),
}));

const store = await import('../../js/i18n-store.js');
const { formatMessage } = await import('../../js/core/message-format.js');
const { AudioManager } = await import('../../js/core/audio.js');
orchestrator = await import('../../js/mode-orchestrator.js');
chronoModule = await import('../../js/modes/ChronoMode.js');
const { ChronoMode, stopChronoMode, refreshChronoTexts } = chronoModule;

const translations = lang =>
  JSON.parse(readFileSync(new URL(`../../assets/translations/${lang}.json`, import.meta.url)));
const FR = translations('fr');
const EN = translations('en');

/** Instances créées : pour voir qu'aucune ne tourne encore après un retour à l'accueil */
let instances = [];

async function flush(ms = 0) {
  await jest.advanceTimersByTimeAsync(ms);
}

/** Démarre Chrono comme un clic sur sa tuile, puis une partie (ou une révision) */
async function startChrono({ revision = false, inputMode = 'keypad' } = {}) {
  await orchestrator.setGameMode('chrono');
  await flush();
  const chrono = instances.at(-1);
  chrono.setInputMode(inputMode);
  await chrono.beginSession(revision);
  return chrono;
}

/** Question connue, comme le ferait le tirage */
function showQuestion(chrono, a, b) {
  chrono.state.currentQuestion = {
    question: `${a} × ${b} = ?`,
    answer: a * b,
    type: chrono.inputMode === 'mcq' ? 'mcq' : 'classic',
    operator: '×',
    a,
    b,
    table: a,
    num: b,
  };
  chrono.displayQuestion();
  chrono.onQuestionGenerated();
}

/** Répond à la question affichée, juste ou faux, puis laisse passer le retour */
async function answer(chrono, correct = true, waitMs = 800) {
  const { answer: expected } = chrono.state.currentQuestion;
  chrono.handleAnswer(correct ? expected : expected + 1);
  await flush(waitMs);
}

function feedbackText() {
  return document.querySelector('.chrono-feedback')?.textContent ?? '';
}

function resultButton(action) {
  return document.querySelector(`#results [data-action="${action}"]`);
}

function chronoStats() {
  return userStore.chronoStats;
}

beforeAll(() => {
  const realStart = ChronoMode.prototype.start;
  jest.spyOn(ChronoMode.prototype, 'start').mockImplementation(function start(...args) {
    instances.push(this);
    return realStart.apply(this, args);
  });
});

beforeEach(() => {
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  document.body.innerHTML = '<div id="game"></div><div id="results"></div>';
  userStore.chronoStats = undefined;
  userStore.coins = 0;
  instances = [];
  speak.mockClear();
  preloadSpeech.mockClear();
  updateDailyChallengeProgress.mockClear();
  goToSlide.mockClear();
  jest.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.useFakeTimers();
});

afterEach(() => {
  stopChronoMode();
  jest.useRealTimers();
  jest.mocked(AudioManager.playSound).mockRestore();
  jest.mocked(console.warn).mockRestore();
  jest.mocked(console.log).mockRestore();
});

describe('Chrono : une partie', () => {
  test('le départ annonce « Mode Chrono », comme les autres modes, et rien d’autre', async () => {
    await orchestrator.setGameMode('chrono');
    await flush();
    expect(document.querySelector('.chrono-setup-panel')).not.toBeNull();
    expect(document.querySelector('#chrono-start').textContent).toBe(FR.chrono_start);
    expect(speak.mock.calls.map(call => call[0])).toEqual([FR.chrono_mode]);
  });

  test('une erreur est marquée sans la réponse, et la question suivante arrive sur un écran propre', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 8, 6);
    await answer(chrono, false, 0);
    expect(feedbackText()).toBe(FR.incorrect);
    await flush(800);
    const next = chrono.state.currentQuestion;
    // L’inverse ne suit pas : 6 × 8 après 8 × 6, c’est le même calcul
    expect([`${next.a}×${next.b}`]).not.toContain('8×6');
    expect([`${next.a}×${next.b}`]).not.toContain('6×8');
    expect(feedbackText()).toBe('');
  });

  test('« Abandonner » suit la zone de réponse, comme dans les autres modes', async () => {
    await startChrono();
    const children = [...document.querySelector('.chrono-container').children];
    const at = cls => children.findIndex(el => el.classList.contains(cls));
    expect(at('chrono-options')).toBeLessThan(at('chrono-feedback'));
    expect(at('chrono-feedback')).toBeLessThan(at('chrono-controls'));
  });

  test('la question est lue, une erreur ne l’est pas et rien ne se précharge pour elle', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 7, 8);
    // Espace insécable avant « ? », comme dans le corpus de la voix
    expect(speak).toHaveBeenLastCalledWith('Combien font 7 fois 8\u00a0?');
    speak.mockClear();
    await answer(chrono, false, 0);
    expect(speak).not.toHaveBeenCalled();
    expect(preloadSpeech).not.toHaveBeenCalled();
  });

  test('le chrono s’arrête à la 10e bonne réponse, et la partie s’enregistre une fois', async () => {
    const chrono = await startChrono();
    for (let i = 0; i < 9; i += 1) await answer(chrono);
    chrono.handleAnswer(chrono.state.currentQuestion.answer);
    // Les 0,8 s d'affichage qui suivent la dernière réponse ne comptent pas
    await flush(5000);
    const [bucket] = chronoStats().buckets;
    expect(bucket.count).toBe(1);
    expect(bucket.best[0].durationMs).toBe(9 * 800);
    expect(document.querySelector('#results .results-lead').textContent).toContain('7,2');
  });

  test('une bonne réponse donne une pièce et compte pour le Défi du jour', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 5, 7);
    await answer(chrono);
    expect(userStore.coins).toBe(1);
    expect(updateDailyChallengeProgress).toHaveBeenCalledWith(5, 7);
  });

  test('un abandon n’ajoute rien au classement ni à la liste à revoir', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 7, 8);
    await answer(chrono, false);
    globalThis.confirm = () => true;
    chrono.confirmAbandon();
    await flush(5000);
    expect(chronoStats().buckets).toEqual([]);
    expect(chronoStats().basket).toEqual([]);
  });
});

describe('Chrono : écran de départ', () => {
  async function openSetup(basket = []) {
    userStore.chronoStats = { buckets: [], basket };
    await orchestrator.setGameMode('chrono');
    await flush();
    return instances.at(-1);
  }

  function block(name) {
    return document.querySelector(`.chrono-block.${name}`);
  }

  test('chaque bloc a son bouton : la course lance le chrono, la liste sa révision', async () => {
    await openSetup([{ a: 7, b: 8, due: 1 }]);
    const race = block('chrono-race');
    const basket = block('chrono-basket');
    expect(race.querySelector('h3').textContent).toBe(FR.chrono_race_title);
    expect(race.querySelector('#chrono-start').textContent).toBe(FR.chrono_start);
    expect(race.querySelector('#chrono-open-stats')).not.toBeNull();
    expect(race.querySelector('#chrono-start-revision')).toBeNull();
    expect(basket.querySelector('#chrono-start-revision').textContent).toBe(
      FR.chrono_start_revision
    );
    expect(basket.querySelector('#chrono-basket-clear')).not.toBeNull();

    basket.querySelector('#chrono-start-revision').click();
    await flush();
    const revision = instances.at(-1);
    expect(revision.isRevision).toBe(true);
    const { a, b } = revision.state.currentQuestion;
    expect([a, b].sort((x, y) => x - y)).toEqual([7, 8]);
  });

  test('« Lancer le chrono » lance une course sur les tables, pas une révision', async () => {
    const chrono = await openSetup([{ a: 7, b: 8, due: 1 }]);
    document.querySelector('#chrono-start').click();
    await flush();
    expect(chrono.phase).toBe('playing');
    expect(chrono.isRevision).toBe(false);
  });

  test('Chrono ne laisse rien sur #game, la zone de jeu commune à tous les modes', async () => {
    // Une classe laissée sur #game cachait la question et les réponses du mode suivant
    const game = document.getElementById('game');
    const before = game.className;
    await openSetup([{ a: 7, b: 8, due: 1 }]);
    expect(game.className).toBe(before);
    document.querySelector('#chrono-open-stats').click();
    await flush();
    expect(game.className).toBe(before);
    await goToSlide(1);
    expect(game.className).toBe(before);
  });

  test('liste vide : on dit d’où viennent les calculs, sans bouton de révision', async () => {
    await openSetup([]);
    const basket = block('chrono-basket');
    expect(basket.textContent).toContain(FR.chrono_basket_empty);
    expect(basket.querySelector('#chrono-start-revision')).toBeNull();
    expect(basket.querySelector('#chrono-basket-clear')).toBeNull();
    expect(basket.querySelector('#chrono-basket-add')).not.toBeNull();
  });

  test('au clavier, ajouter ou retirer un calcul garde le focus dans la liste', async () => {
    await openSetup([
      { a: 7, b: 8, due: 1 },
      { a: 6, b: 7, due: 1 },
    ]);
    document.querySelector('#chrono-add-a').value = '3';
    document.querySelector('#chrono-add-b').value = '4';
    document.querySelector('#chrono-basket-add').click();
    await flush();
    expect(document.activeElement.id).toBe('chrono-add-a');

    const removeLabels = () =>
      [...document.querySelectorAll('.chrono-basket-remove')].map(btn =>
        btn.getAttribute('aria-label')
      );
    expect(removeLabels()).toEqual([
      `${FR.chrono_basket_remove} 3 × 4`,
      `${FR.chrono_basket_remove} 6 × 7`,
      `${FR.chrono_basket_remove} 7 × 8`,
    ]);
    // Retirer le dernier : le focus passe au calcul d’avant
    document.querySelectorAll('.chrono-basket-remove')[2].click();
    await flush();
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      `${FR.chrono_basket_remove} 6 × 7`
    );
    // Tout effacer : le focus revient à la ligne d’ajout
    document.querySelector('#chrono-basket-clear').click();
    await flush();
    expect(document.activeElement.id).toBe('chrono-add-a');
  });

  test('retour des temps : le focus revient sur « Mes temps »', async () => {
    await openSetup([]);
    document.querySelector('#chrono-open-stats').click();
    await flush();
    expect(document.activeElement.textContent).toBe(FR.chrono_stats_pick_title);
    document.querySelector('#chrono-stats-back-setup').click();
    await flush();
    expect(document.activeElement.id).toBe('chrono-open-stats');
  });

  test('la liste à revoir n’utilise aucun signe de calcul comme icône', async () => {
    userStore.chronoStats = { buckets: [], basket: [{ a: 7, b: 8, due: 2 }] };
    await orchestrator.setGameMode('chrono');
    await flush();
    const item = document.querySelector('.chrono-basket-item');
    expect(item.querySelector('.chrono-basket-errors').textContent).toBe(
      formatMessage(FR.chrono_basket_due, { n: 2 }, 'fr')
    );
    const remove = item.querySelector('.chrono-basket-remove');
    expect(remove.textContent).toBe('');
    expect(remove.querySelector('svg.trash-icon')).not.toBeNull();
    expect(remove.getAttribute('aria-label')).toBe(`${FR.chrono_basket_remove} 7 × 8`);
    const add = document.querySelector('.chrono-basket-add');
    expect(add.querySelector('.chrono-basket-add-label').textContent).toBe(
      FR.chrono_basket_add_label
    );
    expect(document.querySelector('#chrono-basket-add').textContent).toBe(FR.chrono_basket_add);
    const blanks = [...add.querySelectorAll('select')].map(select => select.options[0].textContent);
    expect(blanks).toEqual(['?', '?']);
  });

  test('en « Je tape », la case de réponse vide affiche « ? », comme la question', async () => {
    const chrono = await startChrono({ inputMode: 'keypad' });
    expect(document.querySelector('#chrono-typed').textContent).toBe('?');
    showQuestion(chrono, 7, 8);
    document.querySelector('.chrono-key[data-key="5"]').click();
    expect(document.querySelector('#chrono-typed').textContent).toBe('5');
  });
});

describe('Chrono : résultats', () => {
  async function playGame({ error = false } = {}) {
    const chrono = await startChrono();
    if (error) {
      showQuestion(chrono, 7, 8);
      await answer(chrono, false);
    }
    while (chrono.state.correctAnswers < 10) await answer(chrono);
    await flush(1000);
    return chrono;
  }

  function resultActions() {
    return [...document.querySelectorAll('#results [data-action]')].map(btn => btn.dataset.action);
  }

  test('fin d’une course : rejouer, le menu, les temps, l’accueil ; pas de révision directe', async () => {
    await playGame({ error: true });
    expect(resultActions()).toEqual(['play-again', 'chrono-menu', 'stats', 'back-to-home']);
    expect(resultButton('chrono-menu').textContent).toBe(FR.chrono_back_to_menu);
  });

  test('« Rejouer » repart sans annoncer le mode : la question est dite aussitôt', async () => {
    await playGame();
    speak.mockClear();
    resultButton('play-again').click();
    await flush(10);
    const spoken = speak.mock.calls.map(call => call[0]);
    expect(spoken).not.toContain(FR.chrono_mode);
    expect(spoken[0]).toMatch(/^Combien font /);
  });

  test('« Retour au menu Chrono » montre la liste à jour, sans partie qui tourne', async () => {
    await playGame({ error: true });
    speak.mockClear();
    resultButton('chrono-menu').click();
    await flush(10);
    expect(speak.mock.calls.map(call => call[0])).toEqual([FR.chrono_mode]);
    const menu = instances.at(-1);
    expect(menu.phase).toBe('setup');
    const facts = [...document.querySelectorAll('.chrono-basket-eq')].map(el => el.textContent);
    expect(facts).toEqual(['7 × 8']);
    await goToSlide(1);
    expect(instances.every(chrono => chrono.state.isActive === false)).toBe(true);
    expect(instances.every(chrono => chrono.timerInterval === null)).toBe(true);
  });

  test('« Rejouer » ne laisse aucune partie tourner après un retour à l’accueil', async () => {
    await playGame();
    resultButton('play-again').click();
    await flush(10);
    const replay = instances.at(-1);
    expect(replay.phase).toBe('playing');
    await goToSlide(1);
    expect(instances.every(chrono => chrono.state.isActive === false)).toBe(true);
    expect(instances.every(chrono => chrono.timerInterval === null)).toBe(true);
  });

  test('l’écran de fin donne le résultat de chaque calcul, erreurs comprises', async () => {
    await playGame({ error: true });
    const rows = [...document.querySelectorAll('#results .chrono-fact')];
    const equations = rows.map(row => row.querySelector('.chrono-fact-eq').textContent);
    expect(rows[0].classList.contains('is-wrong')).toBe(true);
    expect(equations[0]).toBe('7 × 8 = 56');
    expect(equations.every(text => /^\d+ × \d+ = \d+$/.test(text))).toBe(true);
  });

  test('un meilleur temps s’annonce comme record, puis le rang s’affiche', async () => {
    const first = await startChrono();
    for (let i = 0; i < 10; i += 1) await answer(first, true, 1500);
    await flush(1000);
    expect(document.querySelector('#results .results-message').textContent).toBe(
      FR.chrono_session_average_none
    );
    resultButton('play-again').click();
    await flush(10);
    const second = instances.at(-1);
    for (let i = 0; i < 10; i += 1) await answer(second);
    await flush(1000);
    expect(document.querySelector('#results .results-message').textContent).toBe(
      FR.chrono_new_record
    );
  });
});

describe('Chrono : révision', () => {
  function seedBasket(basket) {
    userStore.chronoStats = { buckets: [], basket, lastInputMode: 'keypad' };
  }

  test('après une erreur, l’inverse arrive sans correction affichée : rien à recopier', async () => {
    seedBasket([{ a: 6, b: 7, due: 1 }]);
    const chrono = await startChrono({ revision: true });
    const first = { ...chrono.state.currentQuestion };
    await answer(chrono, false);
    const next = chrono.state.currentQuestion;
    expect([next.a, next.b]).toEqual([first.b, first.a]);
    expect(feedbackText()).toBe('');
  });

  test('toujours 10 questions ; réussi, le calcul sort de la liste et rapporte 1 pièce', async () => {
    seedBasket([{ a: 7, b: 8, due: 1 }]);
    const chrono = await startChrono({ revision: true });
    for (let i = 0; i < 10; i += 1) await answer(chrono);
    await flush(1000);
    expect(chrono.state.questionCount).toBe(10);
    expect(chronoStats().basket).toEqual([]);
    expect(userStore.coins).toBe(1);
    expect(updateDailyChallengeProgress).not.toHaveBeenCalled();
    expect(document.querySelector('#results .results-message').textContent).toContain('1');
  });

  test('fin d’une révision : le menu, sans « Rejouer » qui lancerait une course', async () => {
    seedBasket([{ a: 7, b: 8, due: 2 }]);
    const chrono = await startChrono({ revision: true });
    for (let i = 0; i < 10; i += 1) await answer(chrono);
    await flush(1000);
    const actions = [...document.querySelectorAll('#results [data-action]')].map(
      btn => btn.dataset.action
    );
    expect(actions).toEqual(['chrono-menu', 'back-to-home']);
  });

  test('raté à la fin, le calcul reste à revoir, sans pièce', async () => {
    seedBasket([{ a: 7, b: 8, due: 1 }]);
    const chrono = await startChrono({ revision: true });
    for (let i = 0; i < 9; i += 1) await answer(chrono);
    await answer(chrono, false);
    await flush(1000);
    expect(chronoStats().basket).toEqual([{ a: 7, b: 8, due: 1 }]);
    expect(userStore.coins).toBe(0);
  });

  test('une révision abandonnée ne change pas la liste', async () => {
    seedBasket([{ a: 7, b: 8, due: 2 }]);
    const chrono = await startChrono({ revision: true });
    for (let i = 0; i < 4; i += 1) await answer(chrono);
    globalThis.confirm = () => true;
    chrono.confirmAbandon();
    await flush(5000);
    expect(chronoStats().basket).toEqual([{ a: 7, b: 8, due: 2 }]);
    expect(userStore.coins).toBe(0);
  });
});

describe('Chrono : langue', () => {
  test('l’écran de départ se retraduit, textes à paramètres compris', async () => {
    seedLanguageTest();
    await orchestrator.setGameMode('chrono');
    await flush();
    store.setTranslations(EN);
    store.setCurrentLanguage('en');
    await refreshChronoTexts();
    expect(document.querySelector('.chrono-race h3').textContent).toBe(EN.chrono_race_title);
    expect(document.querySelector('#chrono-start').textContent).toBe(EN.chrono_start);
    expect(document.querySelector('.chrono-basket-errors').getAttribute('aria-label')).toBe(
      formatMessage(EN.chrono_basket_errors, { n: 2 }, 'en')
    );
  });

  function seedLanguageTest() {
    userStore.chronoStats = { buckets: [], basket: [{ a: 7, b: 8, due: 2 }] };
  }
});

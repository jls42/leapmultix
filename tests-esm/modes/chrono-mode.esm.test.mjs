/* eslint-env jest, node */
/**
 * Mode Chrono, joué de bout en bout :
 * - une erreur est marquée sans la réponse (en « Je choisis », seule la tuile choisie),
 *   l'écran de fin donne chaque calcul complet ; rien ne reste sous la question suivante ;
 *   en course l'inverse ne suit pas, en révision il arrive sans correction à recopier ;
 * - le chrono s'arrête à la 10e bonne réponse, la partie s'enregistre une fois ;
 * - un abandon n'ajoute rien au classement ni à la liste ;
 * - l'écran de départ : la course et la liste ont chacune leur bouton, le focus clavier
 *   reste en place quand la liste change ;
 * - les résultats relancent par l'orchestrateur : aucune partie ne tourne en arrière-plan ;
 * - record, révision (le compteur baisse, une pièce par calcul sorti), langue, voix.
 */
import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { readFileSync } from 'node:fs';
import { createUserStateMock, createSlidesMock } from '../helpers/mode-test-helpers.mjs';
import {
  createLazyLoaderMock,
  createGameMock,
  createSpeechMock,
  createChronoNavigation,
  createChronoDriver,
  trackChronoInstances,
  quietFakeTime,
} from '../helpers/chrono-test-helpers.mjs';

const userStore = { preferredOperator: '×', coins: 0 };
const updateDailyChallengeProgress = jest.fn();
const speak = jest.fn();
const preloadSpeech = jest.fn();
const refs = {};
const goToSlide = createChronoNavigation(jest, refs);
jest.unstable_mockModule('../../js/core/userState.js', () => createUserStateMock(userStore));
jest.unstable_mockModule('../../js/lazy-loader.js', createLazyLoaderMock);
jest.unstable_mockModule('../../js/game.js', () =>
  createGameMock(jest, updateDailyChallengeProgress)
);
jest.unstable_mockModule('../../js/speech.js', () => createSpeechMock({ speak, preloadSpeech }));
jest.unstable_mockModule('../../js/slides.js', () => ({ ...createSlidesMock(jest), goToSlide }));

const store = await import('../../js/i18n-store.js');
const { formatMessage } = await import('../../js/core/message-format.js');
const { AudioManager } = await import('../../js/core/audio.js');
refs.orchestrator = await import('../../js/mode-orchestrator.js');
refs.chronoModule = await import('../../js/modes/ChronoMode.js');
const { orchestrator } = refs;
const { ChronoMode, stopChronoMode, refreshChronoTexts } = refs.chronoModule;

const translations = lang =>
  JSON.parse(readFileSync(new URL(`../../assets/translations/${lang}.json`, import.meta.url)));
const FR = translations('fr');
const EN = translations('en');

/** Instances créées : pour voir qu'aucune ne tourne encore après un retour à l'accueil */
let instances = [];
const { flush, startChrono, showQuestion, answer, feedbackText } = createChronoDriver(
  jest,
  refs,
  () => instances
);

function resultButton(action) {
  return document.querySelector(`#results [data-action="${action}"]`);
}

function chronoStats() {
  return userStore.chronoStats;
}

/** Retour à l'accueil : aucune instance ne tourne encore, aucun minuteur ne reste */
async function expectNothingRunningAfterHome() {
  await goToSlide(1);
  expect(instances.every(chrono => chrono.state.isActive === false)).toBe(true);
  expect(instances.every(chrono => chrono.intervals.size === 0)).toBe(true);
}

beforeAll(() => {
  trackChronoInstances(jest, ChronoMode, () => instances);
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
  quietFakeTime(jest, AudioManager);
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

  test('en « Je choisis », une erreur ne marque que la tuile choisie, jamais la bonne', async () => {
    const chrono = await startChrono({ inputMode: 'mcq' });
    showQuestion(chrono, 7, 6);
    const tiles = () => [...document.querySelectorAll('.chrono-options .option')];
    const wrong = tiles().find(tile => tile.dataset.value !== '42');
    chrono.handleAnswer(Number(wrong.dataset.value));
    expect(wrong.classList.contains('is-chosen-wrong')).toBe(true);
    expect(document.querySelector('.chrono-options .is-correct')).toBeNull();
    expect(feedbackText()).toBe(FR.incorrect);

    // Une bonne réponse, elle, se coche
    await flush(800);
    const { answer: expected } = chrono.state.currentQuestion;
    const right = tiles().find(tile => tile.dataset.value === String(expected));
    chrono.handleAnswer(expected);
    expect(right.classList.contains('is-correct')).toBe(true);
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

  test('l’heure de l’appareil qui recule pendant la course ne fausse pas le temps', async () => {
    const chrono = await startChrono();
    for (let i = 0; i < 9; i += 1) await answer(chrono, true, 800);
    // Synchronisation de l’horloge de l’appareil : une heure en arrière
    jest.setSystemTime(Date.now() - 3600 * 1000);
    await answer(chrono, true, 1000);
    const [best] = chronoStats().buckets[0].best;
    expect(best.durationMs).toBe(9 * 800);
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
    const confirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(true);
    chrono.confirmAbandon();
    await flush(5000);
    expect(chronoStats().buckets).toEqual([]);
    expect(chronoStats().basket).toEqual([]);
    confirm.mockRestore();
  });

  test('« Annuler » à la question d’abandon : la course continue', async () => {
    const chrono = await startChrono();
    const confirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(false);
    document.querySelector('#chrono-abandon').click();
    await flush(5000);
    expect(confirm).toHaveBeenCalledWith(FR.confirm_abandon_chrono);
    expect(chrono.state.isActive).toBe(true);
    expect(chrono.phase).toBe('playing');
    expect(goToSlide).not.toHaveBeenCalledWith(1);
    confirm.mockRestore();
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

  test('« Comment tu réponds ? » : un titre qui nomme deux tuiles, le choix actif coché', async () => {
    await openSetup([]);
    const group = document.querySelector('.chrono-input-mode');
    expect(group.getAttribute('role')).toBe('group');
    const title = document.getElementById(group.getAttribute('aria-labelledby'));
    expect(title.tagName).toBe('H3');
    expect(title.textContent).toBe(FR.chrono_input_legend);
    const tiles = [...group.querySelectorAll('.chrono-input-btn')];
    expect(tiles.map(tile => tile.textContent)).toEqual([
      FR.chrono_input_mcq,
      FR.chrono_input_keypad,
    ]);
    // La passe de traduction de la page réécrit les libellés sans effacer la coche
    const { applyStaticTranslations } = await import('../../js/i18n.js');
    applyStaticTranslations();
    expect(tiles.every(tile => tile.querySelector('.option-mark'))).toBe(true);
    expect(tiles.map(tile => tile.textContent)).toEqual([
      FR.chrono_input_mcq,
      FR.chrono_input_keypad,
    ]);
  });

  /** Un classement joué : une partie par durée, de la plus ancienne à la plus récente */
  const playedBucket = (key, durations) => {
    const sessions = durations.map((durationMs, index) => ({ durationMs, date: index + 1 }));
    return {
      key,
      count: sessions.length,
      totalMs: durations.reduce((sum, ms) => sum + ms, 0),
      best: sessions,
      recent: sessions,
    };
  };

  test('« Mes temps » : chaque ligne finit par une flèche dessinée, que la traduction garde', async () => {
    userStore.chronoStats = { buckets: [playedBucket('7|keypad', [30000])], basket: [] };
    await orchestrator.setGameMode('chrono');
    await flush();
    document.querySelector('#chrono-open-stats').click();
    await flush();
    const open = document.querySelector('[data-bucket-key] .chrono-stats-open');
    expect(open.querySelector('svg.icon-chevron-right')).not.toBeNull();
    // La passe de traduction de la page réécrit « Voir tes temps » sans effacer la flèche
    const { applyStaticTranslations } = await import('../../js/i18n.js');
    applyStaticTranslations();
    expect(open.querySelector('svg.icon-chevron-right')).not.toBeNull();
    expect(open.textContent).toBe(FR.chrono_stats_open);
  });

  test('la courbe écrit chaque numéro de partie jusqu’à 10, au-delà un sur cinq', async () => {
    const twenty = Array.from({ length: 20 }, (_, index) => 30000 + index * 500);
    userStore.chronoStats = {
      buckets: [
        playedBucket('7|keypad', twenty),
        playedBucket('3|mcq', twenty.slice(0, 8)),
        playedBucket('5|mcq', twenty.slice(0, 16)),
      ],
      basket: [],
    };
    await orchestrator.setGameMode('chrono');
    await flush();
    document.querySelector('#chrono-open-stats').click();
    await flush();
    const curveOf = async key => {
      document.querySelector(`[data-bucket-key="${key}"]`).click();
      await flush();
      const curve = document.querySelector('.chrono-curve');
      const numbers = [...curve.querySelectorAll('text[text-anchor="middle"]')];
      const shown = { numbers: numbers.map(text => text.textContent) };
      shown.points = curve.querySelectorAll('circle').length;
      document.querySelector('#chrono-stats-back-pick').click();
      await flush();
      return shown;
    };
    // 20 parties : 20 points, mais cinq numéros, qui ne se chevauchent pas
    expect(await curveOf('7|keypad')).toEqual({
      numbers: ['1', '5', '10', '15', '20'],
      points: 20,
    });
    expect(await curveOf('3|mcq')).toEqual({
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8'],
      points: 8,
    });
    // 16 parties : pas de « 15 » collé au « 16 »
    expect(await curveOf('5|mcq')).toEqual({ numbers: ['1', '5', '10', '16'], points: 16 });
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
    const confirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(true);
    document.querySelector('#chrono-basket-clear').click();
    await flush();
    expect(document.activeElement.id).toBe('chrono-add-a');
    confirm.mockRestore();
  });

  test('« Tout effacer » demande d’abord ; « Annuler » garde la liste', async () => {
    await openSetup([{ a: 7, b: 8, due: 1 }]);
    const confirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(false);
    document.querySelector('#chrono-basket-clear').click();
    await flush();
    expect(confirm).toHaveBeenCalledWith(FR.confirm_clear_chrono_basket);
    expect(chronoStats().basket).toEqual([{ a: 7, b: 8, due: 1 }]);

    confirm.mockReturnValue(true);
    document.querySelector('#chrono-basket-clear').click();
    await flush();
    expect(chronoStats().basket).toEqual([]);
    confirm.mockRestore();
  });

  test('« Ajouter » sans les deux nombres : le focus va sur celui qui manque', async () => {
    await openSetup([]);
    document.querySelector('#chrono-add-a').value = '3';
    document.querySelector('#chrono-basket-add').click();
    await flush();
    const second = document.querySelector('#chrono-add-b');
    expect(document.activeElement).toBe(second);
    expect(second.getAttribute('aria-invalid')).toBe('true');
    expect(chronoStats().basket).toEqual([]);
    // Une phrase le dit sous la ligne, reliée à la liste à choisir (comme le prénom manquant)
    const message = document.querySelector('#chrono-add-message');
    expect(message.hidden).toBe(false);
    expect(message.textContent).toBe(FR.chrono_basket_add_missing);
    expect(second.getAttribute('aria-describedby')).toBe(message.id);

    second.value = '4';
    second.dispatchEvent(new Event('change'));
    expect(second.hasAttribute('aria-invalid')).toBe(false);
    expect(message.hidden).toBe(true);
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

  test('retour d’un classement : le focus revient sur sa ligne, pas en haut de la liste', async () => {
    const played = (key, durationMs) => ({
      key,
      count: 1,
      totalMs: durationMs,
      best: [{ durationMs, date: 1 }],
      recent: [{ durationMs, date: 1 }],
    });
    userStore.chronoStats = {
      buckets: [played('3,7|keypad', 20000), played('7|mcq', 9000)],
      basket: [],
    };
    await orchestrator.setGameMode('chrono');
    await flush();
    document.querySelector('#chrono-open-stats').click();
    await flush();
    const second = document.querySelectorAll('[data-bucket-key]')[1];
    const key = second.dataset.bucketKey;
    second.click();
    await flush();
    // Le classement ouvert montre son temps et sa courbe
    expect(document.querySelectorAll('.chrono-ranking li')).toHaveLength(1);
    expect(document.querySelectorAll('.chrono-curve circle')).toHaveLength(1);
    document.querySelector('#chrono-stats-back-pick').click();
    await flush();
    expect(document.activeElement.dataset.bucketKey).toBe(key);
  });

  test('un écran qui ne se construit pas montre l’erreur du jeu, pas un bouton sans effet', async () => {
    const chrono = await openSetup([]);
    const failure = new Error('écran illisible');
    jest.spyOn(chrono, 'initializeUI').mockRejectedValueOnce(failure);
    const handled = jest.spyOn(chrono, 'handleError').mockImplementation(() => {});
    document.querySelector('#chrono-open-stats').click();
    await flush(20);
    expect(handled).toHaveBeenCalledWith(failure);
    // La zone de retour est masquée sur ces écrans : une bulle porte le message
    expect(document.querySelector('.message-popup')?.textContent).toBe(FR.game_error);
  });

  test('les calculs les plus à revoir viennent en tête de la liste', async () => {
    await openSetup([
      { a: 3, b: 4, due: 1 },
      { a: 7, b: 8, due: 3 },
      { a: 6, b: 7, due: 2 },
    ]);
    const facts = [...document.querySelectorAll('.chrono-basket-eq')].map(eq => eq.textContent);
    expect(facts).toEqual(['7 × 8', '6 × 7', '3 × 4']);
  });

  test('la liste à revoir n’utilise aucun signe de calcul comme icône', async () => {
    userStore.chronoStats = { buckets: [], basket: [{ a: 7, b: 8, due: 2 }] };
    await orchestrator.setGameMode('chrono');
    await flush();
    const item = document.querySelector('.chrono-basket-item');
    expect(item.querySelector('.chrono-basket-errors').textContent).toBe(
      formatMessage(FR.chrono_basket_due, { n: 2 }, 'fr')
    );
    // Le badge « 2 fois » se lit en entier, en texte : « À revoir 2 fois »
    expect(item.querySelector('.chrono-basket-errors').getAttribute('aria-hidden')).toBe('true');
    expect(item.querySelector('.sr-only').textContent).toBe(
      formatMessage(FR.chrono_basket_errors, { n: 2 }, 'fr')
    );
    expect(item.querySelector('[aria-label]:not(button)')).toBeNull();
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

  test('au clavier AZERTY, la rangée du haut tape ses chiffres sans Maj', async () => {
    const chrono = await startChrono({ inputMode: 'keypad' });
    showQuestion(chrono, 6, 7);
    const press = (key, code, extra = {}) =>
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key, code, cancelable: true, bubbles: true, ...extra })
      );
    // Sans Maj, la touche 4 donne « ' » et la touche 2 donne « é » : leur code dit le chiffre
    press("'", 'Digit4');
    expect(document.querySelector('#chrono-typed').textContent).toBe('4');
    // Un raccourci ne tape rien
    press('é', 'Digit2', { ctrlKey: true });
    expect(document.querySelector('#chrono-typed').textContent).toBe('4');
    press('é', 'Digit2');
    expect(chrono.sessionFacts.at(-1)).toMatchObject({ a: 6, b: 7, correct: true });
  });

  test('Entrée valide ce qui est tapé, même incomplet ; sur une case vide, rien', async () => {
    const chrono = await startChrono({ inputMode: 'keypad' });
    showQuestion(chrono, 6, 7);
    const enter = () =>
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true })
      );
    enter();
    expect(chrono.sessionFacts).toHaveLength(0);
    document.querySelector('.chrono-key[data-key="4"]').click();
    expect(chrono.sessionFacts).toHaveLength(0);
    // « 4 » pourrait encore devenir 42 : sans Entrée, la question attend ; avec, c'est faux
    enter();
    expect(chrono.sessionFacts.at(-1)).toMatchObject({ a: 6, b: 7, correct: false });
  });

  test('Entrée sur un bouton qui a le focus : Chrono ne valide rien, le bouton agit', async () => {
    const chrono = await startChrono({ inputMode: 'keypad' });
    showQuestion(chrono, 6, 7);
    document.querySelector('.chrono-key[data-key="4"]').click();
    const two = document.querySelector('.chrono-key[data-key="2"]');
    two.focus();
    const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true });
    two.dispatchEvent(event);
    // Le navigateur clique lui-même le bouton qui a le focus : Chrono n'y touche pas
    expect(event.defaultPrevented).toBe(false);
    expect(chrono.sessionFacts).toHaveLength(0);
  });

  test('lecteur d’écran : chaque réponse et chaque chiffre du pavé sont reliés à la question', async () => {
    for (const inputMode of ['mcq', 'keypad']) {
      const chrono = await startChrono({ inputMode });
      showQuestion(chrono, 6, 7);
      const answers = document.querySelectorAll('#chrono-options .option, .chrono-key');
      const digits = [...answers].filter(el => el.dataset.key !== 'back');
      expect(digits.length).toBeGreaterThan(1);
      for (const el of digits) {
        const described = document.getElementById(el.getAttribute('aria-describedby'));
        expect(described?.textContent).toBe(document.getElementById('chrono-question').textContent);
      }
      chrono.stop();
    }
  });

  test('en « Je tape », la case de réponse vide affiche « ? », comme la question', async () => {
    const chrono = await startChrono({ inputMode: 'keypad' });
    expect(document.querySelector('#chrono-typed').textContent).toBe('?');
    // Zone annoncée nommée « Ta réponse » : le rôle « status » autorise ce nom
    expect(document.querySelector('#chrono-typed').getAttribute('role')).toBe('status');
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

  test('« Mes temps » depuis l’écran de fin dit quel classement il montre, comme depuis le menu', async () => {
    await playGame();
    resultButton('stats').click();
    await flush(10);
    const header = pane => [...pane.querySelectorAll(':scope > p')].map(p => p.textContent);
    const fromResults = header(document.querySelector('#results .chrono-results'));
    expect(fromResults).toHaveLength(2);
    // Le même classement, ouvert depuis le menu de Chrono : même en-tête
    resultButton('back-to-results').click();
    await flush(10);
    resultButton('chrono-menu').click();
    await flush(10);
    document.querySelector('#chrono-open-stats').click();
    await flush();
    document.querySelector('[data-bucket-key]').click();
    await flush();
    expect(header(document.querySelector('.chrono-setup-panel'))).toEqual(fromResults);
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
    await expectNothingRunningAfterHome();
  });

  test('« Rejouer » ne laisse aucune partie tourner après un retour à l’accueil', async () => {
    await playGame();
    resultButton('play-again').click();
    await flush(10);
    const replay = instances.at(-1);
    expect(replay.phase).toBe('playing');
    await expectNothingRunningAfterHome();
  });

  test('l’écran de fin donne le résultat de chaque calcul, erreurs comprises', async () => {
    await playGame({ error: true });
    const rows = [...document.querySelectorAll('#results .chrono-fact')];
    const equations = rows.map(row => row.querySelector('.chrono-fact-eq').textContent);
    expect(rows[0].classList.contains('is-wrong')).toBe(true);
    expect(equations[0]).toBe('7 × 8 = 56');
    expect(equations.every(text => /^\d+ × \d+ = \d+$/.test(text))).toBe(true);
    // Juste ou faux se lit aussi sans la couleur ni l’icône : en texte, pour les lecteurs d’écran
    expect(rows[0].querySelector('.sr-only').textContent).toBe(FR.chrono_fact_ko);
    expect(rows.at(-1).querySelector('.sr-only').textContent).toBe(FR.chrono_fact_ok);
  });

  test('un meilleur temps s’annonce comme record', async () => {
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

  test('ni record ni première partie : la place parmi les meilleurs temps s’affiche', async () => {
    const playRace = async (chrono, wait) => {
      for (let i = 0; i < 10; i += 1) await answer(chrono, true, wait);
      await flush(1000);
    };
    const replay = async () => {
      resultButton('play-again').click();
      await flush(10);
      return instances.at(-1);
    };
    await playRace(await startChrono(), 1500); // 13,5 s
    await playRace(await replay(), 800); // 7,2 s : record
    await playRace(await replay(), 1000); // 9 s : 2e sur 3
    expect(document.querySelector('#results .results-message').textContent).toBe(
      formatMessage(FR.chrono_rank, { rank: 2, count: 3 }, 'fr')
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
    expect(document.querySelector('#results .results-message').textContent).toBe(
      formatMessage(FR.chrono_revision_mastered, { n: 1 }, 'fr')
    );
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
    const confirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(true);
    chrono.confirmAbandon();
    await flush(5000);
    expect(chronoStats().basket).toEqual([{ a: 7, b: 8, due: 2 }]);
    expect(userStore.coins).toBe(0);
    confirm.mockRestore();
  });
});

describe('Chrono : langue', () => {
  test('les temps de l’écran de fin suivent la langue du jeu (7.2 s en anglais)', async () => {
    store.setTranslations(EN);
    store.setCurrentLanguage('en');
    const chrono = await startChrono();
    for (let i = 0; i < 10; i += 1) await answer(chrono);
    await flush(1000);
    expect(document.querySelector('#results .results-lead').textContent).toBe(
      // Point décimal anglais, espace insécable avant l’unité
      formatMessage(EN.chrono_session_time, { time: '7.2\u00a0s' }, 'en')
    );
  });

  test('changer de langue en pleine question garde la question et ce qui est tapé', async () => {
    const chrono = await startChrono();
    showQuestion(chrono, 7, 8);
    document.querySelector('.chrono-key[data-key="5"]').click();
    store.setTranslations(EN);
    store.setCurrentLanguage('en');
    await refreshChronoTexts();
    expect(chrono.phase).toBe('playing');
    expect(document.querySelector('.chrono-question').textContent).toContain('7 × 8');
    expect(document.querySelector('#chrono-typed').textContent).toBe('5');
    document.querySelector('.chrono-key[data-key="6"]').click();
    expect(feedbackText()).toBe(EN.chrono_feedback_correct);
  });

  test('les tables d’un classement s’accordent : « Table 7 », « Tables 3, 7 »', () => {
    const chrono = new ChronoMode();
    expect(chrono.bucketTablesText([7])).toBe('Table 7');
    expect(chrono.bucketTablesText([7, 3])).toBe('Tables 3, 7');
    store.setTranslations(translations('es'));
    store.setCurrentLanguage('es');
    expect(chrono.bucketTablesText([7])).toBe('Tabla 7');
  });

  test('l’écran de départ se retraduit, textes à paramètres compris', async () => {
    seedLanguageTest();
    await orchestrator.setGameMode('chrono');
    await flush();
    store.setTranslations(EN);
    store.setCurrentLanguage('en');
    await refreshChronoTexts();
    expect(document.querySelector('.chrono-race h3').textContent).toBe(EN.chrono_race_title);
    expect(document.querySelector('#chrono-start').textContent).toBe(EN.chrono_start);
    expect(document.querySelector('.chrono-basket-item .sr-only').textContent).toBe(
      formatMessage(EN.chrono_basket_errors, { n: 2 }, 'en')
    );
  });

  function seedLanguageTest() {
    userStore.chronoStats = { buckets: [], basket: [{ a: 7, b: 8, due: 2 }] };
  }
});

describe('Chrono : clavier, avec la navigation clavier de l’application', () => {
  // Chargée comme au démarrage du jeu (bootstrap-critical.js), donc avant Chrono : sur Entrée,
  // elle clique le bouton qui a le focus
  let keyboardNav;
  beforeAll(async () => {
    ({ keyboardNav } = await import('../../js/keyboard-navigation.js'));
  });
  afterAll(() => keyboardNav.dispose());

  const key = digit => document.querySelector(`.chrono-key[data-key="${digit}"]`);
  const typed = () => document.querySelector('#chrono-typed').textContent;
  const keydown = (target, init) =>
    target.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
    );
  /** Tab jusqu'au bouton, puis Entrée */
  const enterOn = button => {
    button.focus();
    keydown(button, { key: 'Enter', code: 'Enter' });
  };

  test('Tab puis Entrée sur les touches : chaque touche tape son chiffre, et 42 passe', async () => {
    const chrono = await startChrono({ inputMode: 'keypad' });
    showQuestion(chrono, 6, 7);
    enterOn(key('4'));
    expect(typed()).toBe('4');
    expect(chrono.sessionFacts).toHaveLength(0);
    enterOn(key('2'));
    expect(chrono.sessionFacts).toEqual([expect.objectContaining({ a: 6, b: 7, correct: true })]);
  });

  test('Entrée sur « Abandonner » abandonne, sans valider ce qui est tapé', async () => {
    const confirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(false);
    try {
      const chrono = await startChrono({ inputMode: 'keypad' });
      showQuestion(chrono, 6, 7);
      key('4').click();
      enterOn(document.getElementById('chrono-abandon'));
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(chrono.sessionFacts).toHaveLength(0);
      expect(typed()).toBe('4');
    } finally {
      confirm.mockRestore();
    }
  });

  test('après un clic à la souris, Entrée valide ce qui est tapé : « 10 », pas « 100 »', async () => {
    const chrono = await startChrono({ inputMode: 'keypad' });
    showQuestion(chrono, 10, 10);
    for (const digit of ['1', '0']) {
      // Comme un vrai clic : le bouton prend le focus au mousedown, puis reçoit le clic
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      key(digit).focus();
      key(digit).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    }
    expect(typed()).toBe('10');
    expect(document.activeElement).not.toBe(key('0'));
    keydown(document.activeElement, { key: 'Enter', code: 'Enter' });
    expect(chrono.sessionFacts).toEqual([
      expect.objectContaining({ a: 10, b: 10, correct: false }),
    ]);
  });

  test('pavé numérique : Verr. Num allumé, il tape ; éteint (Fin, flèches), rien', async () => {
    const chrono = await startChrono({ inputMode: 'keypad' });
    showQuestion(chrono, 6, 7);
    keydown(document.body, { key: '4', code: 'Numpad4' });
    expect(typed()).toBe('4');
    keydown(document.body, { key: 'End', code: 'Numpad1' });
    keydown(document.body, { key: 'ArrowLeft', code: 'Numpad4' });
    expect(typed()).toBe('4');
    expect(chrono.sessionFacts).toHaveLength(0);
  });

  test('Maj donne le chiffre ; Alt et Cmd ne tapent rien', async () => {
    const chrono = await startChrono({ inputMode: 'keypad' });
    showQuestion(chrono, 6, 7);
    keydown(document.body, { key: 'é', code: 'Digit2', altKey: true });
    keydown(document.body, { key: 'é', code: 'Digit2', metaKey: true });
    expect(typed()).toBe('?');
    // AZERTY avec Maj : la touche donne directement « 4 »
    keydown(document.body, { key: '4', code: 'Digit4', shiftKey: true });
    expect(typed()).toBe('4');
  });

  test('Entrée juste après une réponse validée seule : une seule réponse comptée', async () => {
    const chrono = await startChrono({ inputMode: 'keypad' });
    showQuestion(chrono, 6, 7);
    keydown(document.body, { key: "'", code: 'Digit4' });
    keydown(document.body, { key: 'é', code: 'Digit2' });
    expect(chrono.sessionFacts).toHaveLength(1);
    keydown(document.body, { key: 'Enter', code: 'Enter' });
    expect(chrono.sessionFacts).toHaveLength(1);
  });
});

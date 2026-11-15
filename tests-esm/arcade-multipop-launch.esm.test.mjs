/* eslint-env jest, node */
/**
 * Lancement de MultiPop depuis le menu de l'Arcade (startPopArcade) : écran du jeu,
 * minuteur du niveau, partie dans l'opération du joueur, consigne selon l'appareil, premières
 * monstres une fois la consigne partie, « Abandonner » (écran de fin avec le score), Accueil
 * (partie rendue sans écran de fin), relance (l'ancienne partie rendue d'abord). La partie est
 * la vraie : elle se joue ici au clavier, et ses monstres se lisent dans l'annonce du plateau.
 */
import { describe, test, expect, jest } from '@jest/globals';
import {
  FR,
  showArcadeGameOver,
  launchBench,
  commonLaunchTests,
} from './helpers/board-game-launch.mjs';

const { INSTRUCTIONS_MS } = await import('../js/arcade-common.js');
const { RISE_MS, BOTTOM_HOLES } = await import('../js/multipop-engine.js');
const { startPopArcade, PopGame, CORRECT_POINTS, FIRST_RAISE_MS } = await import(
  '../js/arcade-multipop.js'
);

const bench = launchBench('multipop');
const { press, status, instructions } = bench;

/** Les premiers monstres sortent et finissent de monter */
function waitForMonsters() {
  jest.advanceTimersByTime(FIRST_RAISE_MS + RISE_MS + 200);
}

describe('MultiPop : lancement depuis le menu de l’Arcade', () => {
  commonLaunchTests({
    mode: 'multipop',
    start: startPopArcade,
    Game: PopGame,
    bench,
    touchKey: 'arcade_pop_instructions_touch',
    ready: waitForMonsters,
    // Difficile : cinq monstres sortent ensemble (le banc commun en attend six, les cibles
    // de MultiGoal) ; Moyen : quatre
    second: count => new RegExp(String.raw`^Monstre 2 sur ${count === 6 ? 5 : count}\s: \d+$`),
  });

  test('la consigne à la souris ; les cinq monstres du niveau sortent après 1,5 s', () => {
    expect(FIRST_RAISE_MS).toBe(1500);
    startPopArcade();
    expect(instructions()).toBe(FR.arcade_pop_instructions_desktop);
    // Le temps de lire le calcul : rien avant 1,5 s (sans attente, ils sortiraient à 400 ms)
    jest.advanceTimersByTime(1000);
    press('ArrowRight');
    expect(status()).toBe('');
    jest.advanceTimersByTime(FIRST_RAISE_MS - 1000 + RISE_MS + 200);
    press('ArrowRight');
    expect(status()).toMatch(/^Monstre 2 sur 5\s: \d+$/);
  });

  test('tant que la consigne est affichée, personne ne sort de la rangée du bas', () => {
    const raised = jest.spyOn(PopGame.prototype, 'onRaised');
    const holes = [];
    raised.mockImplementation(function onRaised() {
      const { monsters, friend } = this.field;
      holes.push({
        shown: !document.querySelector('.game-instructions').hidden,
        bottom: [...monsters, friend].some(figure => figure && BOTTOM_HOLES.includes(figure.hole)),
      });
    });
    startPopArcade();
    // Difficile : une sortie toutes les 2,2 s ; la consigne reste 5 s puis s'efface
    jest.advanceTimersByTime(INSTRUCTIONS_MS + 60_000);
    const covered = holes.filter(sortie => sortie.shown);
    expect(covered.length).toBeGreaterThanOrEqual(2);
    expect(covered.every(sortie => !sortie.bottom)).toBe(true);
    // Ensuite, la rangée du bas sert comme les autres
    expect(holes.some(sortie => !sortie.shown && sortie.bottom)).toBe(true);
  });

  test('« Abandonner » : la partie est rendue, l’écran de fin montre son score', () => {
    startPopArcade();
    waitForMonsters();
    // Entrée tape le monstre visé, puis le suivant après un mauvais : le bon finit tapé
    for (let tap = 0; tap < 5; tap++) press('Enter');
    expect(document.getElementById('multipop-info-score').textContent).toBe(String(CORRECT_POINTS));
    const cleanup = jest.spyOn(PopGame.prototype, 'cleanup');
    document.getElementById('multipop-abandon-btn').click();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(showArcadeGameOver).toHaveBeenCalledWith(CORRECT_POINTS);
  });
});

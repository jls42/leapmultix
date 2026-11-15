/* eslint-env jest, node */
/**
 * Lancement de MultiGoal depuis le menu de l'Arcade (startGoalArcade) : écran du jeu,
 * minuteur du niveau, partie dans l'opération du joueur, consigne selon l'appareil, cibles
 * du niveau prêtes tout de suite, « Abandonner » (écran de fin avec le score), Accueil (partie
 * rendue sans écran de fin), relance (l'ancienne partie rendue d'abord). La partie est la
 * vraie : elle se joue ici au clavier, et ses cibles se lisent dans l'annonce du terrain.
 */
import { describe, test, expect, jest } from '@jest/globals';
import {
  FR,
  showArcadeGameOver,
  launchBench,
  commonLaunchTests,
} from './helpers/board-game-launch.mjs';

const { FLIGHT_MS } = await import('../js/multigoal-engine.js');
const { startGoalArcade, GoalGame, GOAL_POINTS } = await import('../js/arcade-multigoal.js');

const bench = launchBench('multigoal');
const { press, status, instructions } = bench;

describe('MultiGoal : lancement depuis le menu de l’Arcade', () => {
  commonLaunchTests({
    mode: 'multigoal',
    start: startGoalArcade,
    Game: GoalGame,
    bench,
    touchKey: 'arcade_goal_instructions_touch',
    // Les cibles sont prêtes dès le lancement
    ready: () => undefined,
    second: count => new RegExp(String.raw`^Cible 2 sur ${count}\s: \d+`),
  });

  test('la consigne à la souris ; les six cibles du niveau sont prêtes tout de suite', () => {
    startGoalArcade();
    expect(instructions()).toBe(FR.arcade_goal_instructions_desktop);
    press('ArrowRight');
    expect(status()).toMatch(/^Cible 2 sur 6\s: \d+/);
  });

  test('la boucle du jeu fait bouger le gardien, image après image', () => {
    const step = jest.spyOn(GoalGame.prototype, 'step');
    startGoalArcade();
    jest.advanceTimersByTime(400);
    expect(step.mock.calls.length).toBeGreaterThan(5);
    expect(step.mock.calls.reduce((total, [dt]) => total + dt, 0)).toBeGreaterThan(200);
  });

  test('« Abandonner » : la partie est rendue, l’écran de fin montre son score', () => {
    const land = jest.spyOn(GoalGame.prototype, 'onGoal');
    startGoalArcade();
    // Entrée tire sur la cible visée ; après un raté ou un arrêt, on retire : le but finit
    // par entrer (cinq mauvaises cibles au plus, le gardien ne reste pas devant)
    for (let shot = 0; shot < 40 && land.mock.calls.length === 0; shot++) {
      press('Enter');
      jest.advanceTimersByTime(FLIGHT_MS + 1000);
    }
    expect(land).toHaveBeenCalledTimes(1);
    expect(document.getElementById('multigoal-info-score').textContent).toMatch(/^\d+$/);
    const cleanup = jest.spyOn(GoalGame.prototype, 'cleanup');
    document.getElementById('multigoal-abandon-btn').click();
    expect(cleanup).toHaveBeenCalledTimes(1);
    const [[score]] = showArcadeGameOver.mock.calls;
    expect(score).toBeGreaterThanOrEqual(GOAL_POINTS - 50);
    expect(score).toBeLessThanOrEqual(GOAL_POINTS);
  });
});

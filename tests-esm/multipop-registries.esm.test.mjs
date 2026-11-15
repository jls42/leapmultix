/* eslint-env jest, node */
/**
 * MultiPop est connu de chaque registre des jeux d'Arcade. Plusieurs retombent en silence
 * sur MultiInvaders pour un jeu inconnu : statistiques et meilleurs scores mis au compte d'un
 * autre jeu, partie laissée tourner en quittant l'écran.
 */
import { describe, test, expect, jest } from '@jest/globals';

const stopArcadeMode = jest.fn();
jest.unstable_mockModule('../js/arcade.js', () => ({ isArcadeActive: jest.fn(), stopArcadeMode }));

const { arcadeGameOf } = await import('../js/arcade-session.js');
const { ARCADE_GAMES, LEGACY_ARCADE_GAMES } = await import('../js/core/mode-stats.js');
const { ARCADE_LOGOS } = await import('../js/logos.js');
const { InfoBar } = await import('../js/components/infoBar.js');
const { goToSlide } = await import('../js/slides.js');
const { gameState } = await import('../js/game.js');

describe('MultiPop dans les registres de l’Arcade', () => {
  test('une partie compte pour MultiPop, pas pour MultiInvaders', () => {
    expect(arcadeGameOf('multipop')).toBe('multipop');
  });

  test('statistiques et meilleurs scores : un jeu de plus, sans anciennes clés', () => {
    expect(ARCADE_GAMES).toContain('multipop');
    expect(LEGACY_ARCADE_GAMES).not.toContain('multipop');
  });

  test('son logo est parmi ceux des jeux (menu, tableau de bord, costumes de fête)', () => {
    expect(ARCADE_LOGOS).toContain('logo_multipop.png');
  });

  test('le bandeau du jeu : le score, et le titre du jeu pour les lecteurs d’écran', () => {
    expect(InfoBar.templates.multipop).toEqual(['score']);
    document.body.replaceChildren(InfoBar.createArcadeTemplateElement({ mode: 'multipop' }));
    expect(document.querySelector('h1').dataset.translate).toBe('arcade_pop_title');
  });

  test('quitter l’écran pendant une partie l’arrête', async () => {
    gameState.gameMode = 'multipop';
    await goToSlide(1);
    expect(stopArcadeMode).toHaveBeenCalled();
  });
});

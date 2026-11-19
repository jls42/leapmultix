/* eslint-env jest, node */
/**
 * Consigne du début d'une partie d'Arcade : elle part au premier geste du joueur (doigt,
 * souris ou touche du jeu), sinon après INSTRUCTIONS_MS de jeu (la pause arrête le décompte) ;
 * elle n'est montrée que les premières parties de chaque jeu, puis réservée aux lecteurs
 * d'écran. Sa pastille translucide garde un texte lisible sur le plus clair des dessins.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'node:fs';

const { showGameInstructions, INSTRUCTIONS_MS, INSTRUCTIONS_FADE_MS } = await import(
  '../js/arcade-common.js'
);
const { mountArcadePause, unmountArcadePause, pauseArcade, resumeArcade } = await import(
  '../js/arcade-time.js'
);
const { showStartInstructions, INSTRUCTIONS_GAMES } = await import(
  '../js/arcade-start-instructions.js'
);
const { arcadeGamesPlayed, recordArcadeGame, resetArcadeGame } = await import(
  '../js/core/mode-stats.js'
);
const { UserState } = await import('../js/core/userState.js');

/** Écran du jeu : zone de jeu avec son canevas, bandeau avec le temps */
function renderGame() {
  document.body.innerHTML = `
    <div id="game">
      <div class="arcade-banner"><span id="time">01:30</span><div class="arcade-banner-tools"></div></div>
      <div class="arcade-game-ui"><canvas id="board"></canvas><button id="abandon">Abandonner</button></div>
    </div>`;
  return document.getElementById('board');
}

const leaving = note => note.classList.contains('is-leaving');
const key = (target, name) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }));
const touch = target => target.dispatchEvent(new Event('pointerdown', { bubbles: true }));

/** Profil qui a joué `games` parties de MultiGoal (en multiplication et en addition) */
function playerWith(games) {
  const user = {};
  for (let i = 0; i < games; i++) {
    recordArcadeGame(user, { game: 'multigoal', operator: i % 2 ? '+' : '×', score: 10 });
  }
  return user;
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  unmountArcadePause();
  jest.restoreAllMocks();
  jest.useRealTimers();
  document.body.innerHTML = '';
});

describe('La consigne part au premier geste du joueur', () => {
  test('un doigt ou la souris posé sur le plateau : fondu, puis cachée', () => {
    const canvas = renderGame();
    const note = showGameInstructions(canvas, 'Touche la bonne cible');
    touch(canvas);
    expect(leaving(note)).toBe(true);
    jest.advanceTimersByTime(INSTRUCTIONS_FADE_MS);
    expect(note.hidden).toBe(true);
  });

  test('un geste hors du plateau (bandeau, « Abandonner ») la laisse', () => {
    const canvas = renderGame();
    const note = showGameInstructions(canvas, 'Touche la bonne cible');
    touch(document.getElementById('abandon'));
    touch(document.getElementById('time'));
    expect(leaving(note)).toBe(false);
  });

  test('une touche du jeu, même quand le jeu arrête sa propagation', () => {
    const canvas = renderGame();
    canvas.addEventListener('keydown', event => event.stopPropagation());
    const note = showGameInstructions(canvas, 'Utilise les flèches');
    key(canvas, 'ArrowLeft');
    expect(leaving(note)).toBe(true);
  });

  test('pause, abandon, tabulation, modificateurs et touches d’un bouton la laissent', () => {
    const canvas = renderGame();
    const note = showGameInstructions(canvas, 'Utilise les flèches');
    for (const name of ['p', 'P', 'Escape', 'Tab', 'Shift', 'Control', 'Alt', 'Meta']) {
      key(canvas, name);
    }
    key(document.getElementById('abandon'), 'Enter');
    expect(leaving(note)).toBe(false);
    key(document.body, ' ');
    expect(leaving(note)).toBe(true);
  });

  test('partie, elle n’écoute plus : la suivante attend son propre geste', () => {
    const canvas = renderGame();
    const first = showGameInstructions(canvas, 'Première');
    touch(canvas);
    jest.advanceTimersByTime(INSTRUCTIONS_FADE_MS);
    const second = showGameInstructions(canvas, 'Seconde');
    expect(second).toBe(first);
    expect(leaving(second)).toBe(false);
    expect(second.hidden).toBe(false);
    touch(canvas);
    expect(leaving(second)).toBe(true);
  });
});

describe('Sans geste, au plus INSTRUCTIONS_MS de jeu', () => {
  test('cinq secondes', () => {
    expect(INSTRUCTIONS_MS).toBe(5000);
    const note = showGameInstructions(renderGame(), 'Consigne');
    jest.advanceTimersByTime(INSTRUCTIONS_MS - 100);
    expect(leaving(note)).toBe(false);
    jest.advanceTimersByTime(100);
    expect(leaving(note)).toBe(true);
  });

  test('la pause arrête le décompte, la reprise le relance où il en était', () => {
    const canvas = renderGame();
    mountArcadePause(document.getElementById('time'));
    const note = showGameInstructions(canvas, 'Consigne');
    jest.advanceTimersByTime(2000);
    pauseArcade();
    jest.advanceTimersByTime(3 * INSTRUCTIONS_MS);
    expect(leaving(note)).toBe(false);
    resumeArcade();
    jest.advanceTimersByTime(INSTRUCTIONS_MS - 2000 - 100);
    expect(leaving(note)).toBe(false);
    jest.advanceTimersByTime(100);
    expect(leaving(note)).toBe(true);
  });
});

describe('Montrée les premières parties de chaque jeu', () => {
  test('parties d’un jeu, toutes opérations, remises à zéro avec ses scores', () => {
    const user = playerWith(3);
    expect(arcadeGamesPlayed(user, 'multigoal')).toBe(3);
    expect(arcadeGamesPlayed(user, 'multipop')).toBe(0);
    expect(arcadeGamesPlayed({}, 'multigoal')).toBe(0);
    resetArcadeGame(user, 'multigoal');
    expect(arcadeGamesPlayed(user, 'multigoal')).toBe(0);
  });

  test.each([
    [0, false],
    [INSTRUCTIONS_GAMES - 1, false],
    [INSTRUCTIONS_GAMES, true],
    [INSTRUCTIONS_GAMES + 5, true],
  ])('%i partie(s) de MultiGoal : réservée aux lecteurs d’écran = %s', (games, quiet) => {
    jest.spyOn(UserState, 'getCurrentUserData').mockReturnValue(playerWith(games));
    const note = showStartInstructions(renderGame(), 'Touche la bonne cible', {
      game: 'multigoal',
    });
    expect(note.classList.contains('sr-only')).toBe(quiet);
    // Toujours dite aux lecteurs d'écran
    expect(note.getAttribute('role')).toBe('status');
    expect(note.textContent).toBe('Touche la bonne cible');
    expect(note.hidden).toBe(false);
  });

  test('chaque jeu compte ses parties ; un profil illisible la montre', () => {
    jest.spyOn(UserState, 'getCurrentUserData').mockReturnValue(playerWith(5));
    const canvas = renderGame();
    expect(
      showStartInstructions(canvas, 'Tape le monstre', { game: 'multipop' }).classList
    ).not.toContain('sr-only');
    UserState.getCurrentUserData.mockImplementation(() => {
      throw new Error('stockage indisponible');
    });
    const note = showStartInstructions(canvas, 'Tire', { game: 'invasion', placement: 'middle' });
    expect(note.classList).not.toContain('sr-only');
    expect(note.dataset.placement).toBe('middle');
  });
});

describe('Pastille translucide', () => {
  const css = fs.readFileSync('css/themes.css', 'utf8');
  const rootBlock = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));
  const contrastBlock = css.slice(css.indexOf('body.high-contrast {'));

  /** Luminance relative d'un gris sRGB de niveau 0 à 1 */
  const luminance = level => (level <= 0.04045 ? level / 12.92 : ((level + 0.055) / 1.055) ** 2.4);

  test('texte blanc sur fond noir translucide : 4,5:1 au moins, même sur un dessin blanc', () => {
    const hint = rootBlock.match(/--color-hint:\s*oklch\(0% 0 0deg \/ ([\d.]+)\)/);
    expect(hint).not.toBeNull();
    expect(rootBlock).toMatch(/--color-hint-ink:\s*oklch\(100% 0 0deg\)/);
    // Noir posé sur du blanc avec l'opacité donnée : gris de niveau 1 − opacité
    const behind = luminance(1 - Number(hint[1]));
    const ratio = (1 + 0.05) / (behind + 0.05);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('contraste élevé : pastille opaque, noir et blanc', () => {
    expect(contrastBlock).toMatch(/--color-hint:\s*#000;/);
    expect(contrastBlock).toMatch(/--color-hint-ink:\s*#fff;/);
    expect(contrastBlock).toMatch(/--color-hint-edge:\s*#fff;/);
  });

  test('la consigne prend ses couleurs de ces jetons', () => {
    const arcade = fs.readFileSync('css/arcade.css', 'utf8');
    const rule = arcade.slice(arcade.indexOf('\n.game-instructions {'));
    const block = rule.slice(0, rule.indexOf('}'));
    expect(block).toMatch(/color:\s*var\(--color-hint-ink\)/);
    expect(block).toMatch(/background:\s*var\(--color-hint\)/);
    expect(block).toMatch(/border:\s*1px solid var\(--color-hint-edge\)/);
  });
});

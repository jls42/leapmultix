/**
 * Plateau de MultiMemory : sur téléphone, la disposition qui donne les plus grandes cartes
 * (3 × 4 pour 12 cartes en portrait), choisie au lancement ; sur ordinateur, toujours
 * 4 colonnes, avec des cartes aux proportions de carte. La consigne, posée sur le plateau,
 * ne change rien en partant. Ensuite l'écran peut changer : les cartes gardent leur place
 * dans la grille, et une carte touchée se retourne.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { fakeCanvasContext, touchEvent } from './helpers/touch-test-helpers.mjs';
import {
  renderArcadeStage,
  simulateArcadeScreen,
  useAndroidUserAgent,
} from './helpers/arcade-screen-helpers.mjs';

const { chooseMemoryGrid, memoryCardSize, MemoryGame } = await import(
  '../js/arcade-multimemory.js'
);
const { showGameInstructions, canvasToClientPoint } = await import('../js/arcade-common.js');

const restorers = [];
let game;

/** Ordre des cartes dans la grille : ce que l'enfant mémorise */
const cardOrder = g => g.cards.map(card => card.id);

/** Cartes à l'écran : grille, ordre, taille des cartes et taille affichée du canevas */
const cartes = g => ({
  grid: [g.cols, g.rows],
  order: cardOrder(g),
  card: [g.cardWidth, g.cardHeight],
  shown: [g.canvas.style.width, g.canvas.style.height],
});

/** Partie de 12 cartes (niveau moyen), consigne affichée comme au lancement */
function startGame() {
  const { canvas } = renderArcadeStage('multimemory-canvas');
  showGameInstructions(canvas, 'Touche les cartes pour les retourner');
  game = new MemoryGame('multimemory-canvas', { difficulty: 'moyen', pairs: 6 });
  game.start();
  return game;
}

/** Contexte 2D factice, dégradé du fond compris */
function memoryContext() {
  const ctx = fakeCanvasContext();
  ctx.createLinearGradient = () => ({ addColorStop: () => {} });
  return ctx;
}

beforeEach(() => {
  jest.useFakeTimers();
  HTMLCanvasElement.prototype.getContext = () => memoryContext();
  // jsdom ne joue pas de son : le nettoyage de fin de partie coupe des sons muets
  HTMLMediaElement.prototype.pause = () => {};
});

afterEach(() => {
  game?.cleanup();
  game = null;
  while (restorers.length) restorers.pop()();
  jest.useRealTimers();
});

describe('chooseMemoryGrid : la disposition qui donne les plus grandes cartes', () => {
  const portrait = { width: 363, height: 600 };

  test('12 cartes sur un téléphone en portrait : 3 colonnes, 4 rangées', () => {
    expect(chooseMemoryGrid(12, portrait, 6)).toEqual({ cols: 3, rows: 4 });
  });

  test('8 cartes : 2 × 4 ; 16 cartes : 4 × 4', () => {
    expect(chooseMemoryGrid(8, portrait, 6)).toEqual({ cols: 2, rows: 4 });
    expect(chooseMemoryGrid(16, portrait, 6)).toEqual({ cols: 4, rows: 4 });
  });

  test('téléphone tourné, plateau bas et large : 6 × 2', () => {
    expect(chooseMemoryGrid(12, { width: 580, height: 232 }, 6)).toEqual({ cols: 6, rows: 2 });
  });

  test('ordinateur : les 4 colonnes habituelles', () => {
    expect(chooseMemoryGrid(12, { width: 1234, height: 473 }, 10, [4])).toEqual({
      cols: 4,
      rows: 3,
    });
  });

  test('une carte garde des proportions de carte, ni bande étroite ni ruban', () => {
    const tall = memoryCardSize(4, 3, { width: 363, height: 600 }, 6);
    const flat = memoryCardSize(4, 3, { width: 1234, height: 473 }, 10);
    for (const card of [tall, flat]) {
      expect(card.width / card.height).toBeGreaterThanOrEqual(0.74);
      expect(card.width / card.height).toBeLessThanOrEqual(1.34);
    }
  });
});

describe('MultiMemory sur un téléphone de 390 × 844', () => {
  beforeEach(() => {
    restorers.push(useAndroidUserAgent());
    restorers.push(simulateArcadeScreen({ width: 363, height: 844 }));
  });

  test('12 cartes en 3 × 4, qui remplissent la largeur', () => {
    startGame();
    expect([game.cols, game.rows]).toEqual([3, 4]);
    // Quatre rangées : la consigne se pose entre la 2e et la 3e, loin du milieu des cartes
    expect(game.instructionPlacement()).toBe('middle');
    // Une seule bordure de 6 px de chaque côté : les cartes prennent la largeur
    expect(game.canvas.width).toBeGreaterThan(363 - game.cols);
    expect(game.canvas.width).toBeLessThanOrEqual(363);
  });

  test('la consigne qui part ne change rien : mêmes cartes, de même taille, à 1 s et à 7 s', () => {
    startGame();
    jest.advanceTimersByTime(1000);
    const at1s = cartes(game);
    jest.advanceTimersByTime(6000);
    expect(document.querySelector('.game-instructions').hidden).toBe(true);
    expect(cartes(game)).toEqual(at1s);
  });

  /** Toucher au centre d'une carte (coordonnées de la fenêtre) */
  function touchCard(card) {
    const point = canvasToClientPoint(
      game.canvas,
      card.x + card.width / 2,
      card.y + card.height / 2
    );
    game.canvas.dispatchEvent(touchEvent('touchend', point));
  }

  /** Téléphone tourné : écran bas et large */
  function rotate() {
    restorers.push(simulateArcadeScreen({ width: 620, height: 390, top: 120 }));
    globalThis.dispatchEvent(new Event('resize'));
    jest.advanceTimersByTime(50);
  }

  test('aucune carte encore vue : la disposition suit le téléphone tourné', () => {
    startGame();
    rotate();
    expect(game.cols).toBeGreaterThan(game.rows);
  });

  test('une carte déjà vue : chaque carte garde sa place, et la carte touchée se retourne', () => {
    startGame();
    touchCard(game.cards[0]);
    const order = cardOrder(game);
    rotate();
    expect([game.cols, game.rows]).toEqual([3, 4]);
    expect(cardOrder(game)).toEqual(order);
    const target = game.cards[7];
    touchCard(target);
    expect(game.cards.filter(card => card.isFlipped)).toEqual([game.cards[0], target]);
  });
});

describe('MultiMemory sur ordinateur', () => {
  test('4 colonnes comme avant, mais des cartes plus grandes que les bandes de 79 px', () => {
    restorers.push(simulateArcadeScreen({ width: 1234, height: 800, top: 200 }));
    startGame();
    expect(game.cols).toBe(4);
    // Trois rangées : la consigne se pose en bas, pas sur le milieu de la rangée du centre
    expect(game.instructionPlacement()).toBe('bottom');
    expect(game.cardWidth).toBeGreaterThan(79);
    expect(game.cardWidth / game.cardHeight).toBeGreaterThanOrEqual(0.74);
  });
});

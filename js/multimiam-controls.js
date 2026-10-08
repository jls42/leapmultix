// multimiam-controls.js - Gestion des contrôles clavier / tactile pour Pacman (ESM)
// (c) LeapMultix - 2025

import { clientToCanvasPoint } from './arcade-common.js';
import { attachDirectionalTouch } from './arcade-touch.js';

// Case voisine dans chaque direction
const CELL_STEPS = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
};

/**
 * Directions vers un point, vu depuis le personnage : l'axe dominant, puis l'autre.
 * @param {number} dx - Écart horizontal au personnage
 * @param {number} dy - Écart vertical au personnage
 * @returns {[string, string]} Direction principale, puis direction de repli
 */
function directionsToward(dx, dy) {
  const horizontal = dx > 0 ? 'RIGHT' : 'LEFT';
  const vertical = dy > 0 ? 'DOWN' : 'UP';
  return Math.abs(dx) > Math.abs(dy) ? [horizontal, vertical] : [vertical, horizontal];
}

/**
 * Initialise les contrôles pour une instance de PacmanGame
 * @param {PacmanGame} game Instance du jeu
 */
export function initPacmanControls(game) {
  if (!game || !game.canvas) {
    console.error('initPacmanControls : instance de jeu invalide');
    return;
  }

  // ================= Clavier =================
  function handleKeyDown(e) {
    let directionChanged = false;
    let newDirection = '';

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault(); // Empêcher le scroll de la page
        newDirection = 'UP';
        directionChanged = true;
        break;
      case 'ArrowDown':
        e.preventDefault(); // Empêcher le scroll de la page
        newDirection = 'DOWN';
        directionChanged = true;
        break;
      case 'ArrowLeft':
        e.preventDefault(); // Empêcher le scroll de la page
        newDirection = 'LEFT';
        directionChanged = true;
        break;
      case 'ArrowRight':
        e.preventDefault(); // Empêcher le scroll de la page
        newDirection = 'RIGHT';
        directionChanged = true;
        break;
      case ' ':
        e.preventDefault(); // Empêcher le scroll de la page
        if (game.gameOver) {
          game.start();
        } else {
          game.running ? game.pause() : game.resume();
        }
        break;
    }

    if (directionChanged) {
      game.multimiam.nextDirection = newDirection;
      if (!game.multimiam.isMoving) {
        tryToMovePacman(newDirection);
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown);
  // Retiré avec le jeu (cleanupGameResources) : resté branché, il relançait la partie
  // abandonnée à la barre d'espace, depuis n'importe quel écran
  game.eventListeners = [
    ...(game.eventListeners ?? []),
    { element: document, type: 'keydown', callback: handleKeyDown },
  ];

  // Le personnage prend la direction demandée dès qu'il le peut
  function steer(direction) {
    game.multimiam.nextDirection = direction;
    if (!game.multimiam.isMoving) {
      tryToMovePacman(direction);
    }
  }

  // ================= Toucher ou clic sur le labyrinthe =================
  // Le personnage part vers le point visé : l'axe dominant d'abord, l'autre s'il est bloqué
  function steerTowards(clientX, clientY) {
    // Coordonnées écran -> jeu (cadre et éventuelle réduction du canevas compris)
    const point = clientToCanvasPoint(game.canvas, clientX, clientY);
    const { x, y } = game.multimiam;

    // Direction vue depuis le centre de la case du personnage (pas du canevas)
    const [primary, secondary] = directionsToward(
      point.x - (x + 0.5) * game.cellSize,
      point.y - (y + 0.5) * game.cellSize
    );
    const open = [primary, secondary].find(dir =>
      game.canMove(x + CELL_STEPS[dir].dx, y + CELL_STEPS[dir].dy)
    );
    if (open) {
      steer(open);
      return;
    }

    // Si aucune n'est possible immédiatement, définir quand même nextDirection
    // pour tourner à la prochaine intersection.
    game.multimiam.nextDirection = primary;
  }

  // ================= Gestes tactiles (glissement et toucher) =================
  // Gestes communs avec MultiSnake (js/arcade-touch.js) : un doigt qui tremble un peu ou
  // reste posé compte comme un toucher
  attachDirectionalTouch(game.canvas, { onSwipe: steer, onTap: steerTowards });

  // Clic (ordinateur) : même règle que le toucher
  game.canvas.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    steerTowards(e.clientX, e.clientY);
  });

  // --------------------------------------------------
  // Fonction interne pour tenter un déplacement
  function tryToMovePacman(direction) {
    let nextX = game.multimiam.x;
    let nextY = game.multimiam.y;
    switch (direction) {
      case 'UP':
        nextY--;
        break;
      case 'DOWN':
        nextY++;
        break;
      case 'LEFT':
        nextX--;
        break;
      case 'RIGHT':
        nextX++;
        break;
    }
    if (game.canMove(nextX, nextY)) {
      game.multimiam.direction = direction;
      game.multimiam.nextDirection = direction;
      game.multimiam.isMoving = true;
      game.multimiam.isAtIntersection = false;
      return true;
    }
    return false;
  }

  // Exposer si d'autres morceaux du code en ont encore besoin
  game.tryToMovePacman = tryToMovePacman;
}

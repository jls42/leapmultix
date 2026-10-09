// multimiam-controls.js - Gestion des contrôles clavier / tactile pour Pacman (ESM)
// (c) LeapMultix - 2025

import { getCanvasContentRect } from './arcade-common.js';
import { attachDirectionalTouch } from './arcade-touch.js';
import { mazeToScreen, transposeDirection } from './multimiam-layout.js';
import { isKeyFromButton, toggleArcadePause } from './arcade-time.js';

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
 * Barre d'espace : la pause de l'Arcade (comme la touche P), compte à rebours compris.
 * Quand le focus est sur un bouton (« Reprendre », « Abandonner »), la touche lui revient.
 * @param {PacmanGame} game
 * @param {KeyboardEvent} event
 */
function onSpaceKey(game, event) {
  if (isKeyFromButton(event)) return;
  if (game.gameOver) game.start();
  else toggleArcadePause();
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
        onSpaceKey(game, e);
        break;
    }

    // La flèche dit une direction à l'écran (labyrinthe transposé en portrait)
    if (directionChanged) steer(transposeDirection(newDirection, game.transposed));
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
  // Point visé, en pixels du dessin du labyrinthe. Mesuré à l'écran (cadre, éventuelles
  // bandes et réduction du canevas compris), sans passer par canvas.width : la densité du
  // canevas peut le rendre plus grand que le dessin.
  function boardPoint(clientX, clientY) {
    const shown = getCanvasContentRect(game.canvas);
    return {
      x: ((clientX - shown.left) * game.boardWidth) / shown.width,
      y: ((clientY - shown.top) * game.boardHeight) / shown.height,
    };
  }

  // Le personnage part vers le point visé : l'axe dominant à l'écran d'abord, l'autre s'il
  // est bloqué (directions à l'écran, puis dans le labyrinthe s'il est dessiné transposé)
  function steerTowards(clientX, clientY) {
    const point = boardPoint(clientX, clientY);
    const { x, y } = game.multimiam;

    // Écart au centre de la case du personnage, à l'écran (cases cellWidth × cellHeight)
    const at = mazeToScreen(x, y, game.transposed);
    const [primary, secondary] = directionsToward(
      point.x - (at.x + 0.5) * game.cellWidth,
      point.y - (at.y + 0.5) * game.cellHeight
    ).map(direction => transposeDirection(direction, game.transposed));
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
  attachDirectionalTouch(game.canvas, {
    onSwipe: direction => steer(transposeDirection(direction, game.transposed)),
    onTap: steerTowards,
  });

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

// multimiam-controls.js - Gestion des contrôles clavier / tactile pour Pacman (ESM)
// (c) LeapMultix - 2025

import { clientToCanvasPoint } from './arcade-common.js';
import { attachDirectionalTouch } from './arcade-touch.js';

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
    const { x: gameClickX, y: gameClickY } = clientToCanvasPoint(game.canvas, clientX, clientY);

    // Position actuelle du personnage (pixels au centre de la case)
    const playerX = game.multimiam.x;
    const playerY = game.multimiam.y;
    const playerPX = playerX * game.cellSize + game.cellSize / 2;
    const playerPY = playerY * game.cellSize + game.cellSize / 2;

    // Calcul direction relative au joueur (pas au centre du canvas)
    const dx = gameClickX - playerPX;
    const dy = gameClickY - playerPY;

    // Choix primaire/secondaire selon l'axe dominant
    let primary, secondary;
    if (Math.abs(dx) > Math.abs(dy)) {
      primary = dx > 0 ? 'RIGHT' : 'LEFT';
      secondary = dy > 0 ? 'DOWN' : 'UP';
    } else {
      primary = dy > 0 ? 'DOWN' : 'UP';
      secondary = dx > 0 ? 'RIGHT' : 'LEFT';
    }

    // Tenter la direction primaire, sinon la secondaire
    const candidates = [primary, secondary];

    for (const dir of candidates) {
      let nx = playerX,
        ny = playerY;
      switch (dir) {
        case 'UP':
          ny--;
          break;
        case 'DOWN':
          ny++;
          break;
        case 'LEFT':
          nx--;
          break;
        case 'RIGHT':
          nx++;
          break;
      }
      if (game.canMove(nx, ny)) {
        steer(dir);
        return;
      }
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

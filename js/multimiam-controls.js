// multimiam-controls.js - Gestion des contrôles clavier / tactile pour Pacman (ESM)
// (c) LeapMultix - 2025

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

  // ================= Gestes tactiles (swipe et tap) =================
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let touchMoved = false;
  let touchStartTime = 0;

  const handleTouchStart = e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMoved = false;
    touchStartTime = Date.now();
  };

  const handleTouchMove = e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
    touchMoved = true;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;

    let newDirection = '';
    if (Math.abs(dx) > Math.abs(dy)) {
      newDirection = dx > 0 ? 'RIGHT' : 'LEFT';
    } else {
      newDirection = dy > 0 ? 'DOWN' : 'UP';
    }

    game.multimiam.nextDirection = newDirection;
    if (!game.multimiam.isMoving) {
      tryToMovePacman(newDirection);
    }

    touchStartX = touchEndX;
    touchStartY = touchEndY;
  };

  const handleTouchEnd = e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const touchDuration = Date.now() - touchStartTime;

    // Si c'est un tap rapide (< 200ms) et qu'on n'a pas bougé, traiter comme un clic
    if (touchDuration < 200 && !touchMoved) {
      const touch = e.changedTouches[0];
      const simulatedEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => {},
        stopPropagation: () => {},
        stopImmediatePropagation: () => {},
      };
      handleCanvasTouch(simulatedEvent);
    }

    touchMoved = false;
  };

  game.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  game.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  game.canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

  // ================= Clic ET Touch intelligent sur labyrinthe =================
  function handleCanvasTouch(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const rect = game.canvas.getBoundingClientRect();

    // Support touch ET click avec vérification sécurisée
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.clientX !== undefined && e.clientY !== undefined) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      console.warn('Événement canvas sans coordonnées valides:', e.type);
      return;
    }

    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    // Coordonnées canvas -> jeu
    const scaleX = game.canvas.width / rect.width;
    const scaleY = game.canvas.height / rect.height;
    const gameClickX = clickX * scaleX;
    const gameClickY = clickY * scaleY;

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
        game.multimiam.nextDirection = dir;
        if (!game.multimiam.isMoving) {
          tryToMovePacman(dir);
        }
        return;
      }
    }

    // Si aucune n'est possible immédiatement, définir quand même nextDirection
    // pour tourner à la prochaine intersection.
    game.multimiam.nextDirection = primary;
  }

  // Écouter clic desktop uniquement (touch géré par handleTouchEnd)
  game.canvas.addEventListener('click', handleCanvasTouch);

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

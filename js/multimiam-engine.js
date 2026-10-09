// multimiam-engine.js - Moteur de déplacement et collisions pour Pacman (ESM)
// (c) LeapMultix 2025

'use strict';

/**
 * Attache toutes les fonctions cœur du gameplay à l'instance `game`.
 * Ceci permet d’alléger multimiam.js en externalisant la logique complexe.
 * @param {Object} game Instance de PacmanGame
 */
import { showArcadeMessage, showArcadePoints } from './utils-es6.js';
import { showArcadePenalty } from './arcade-points.js';
import { chance, pickRandom } from './core/random.js';
import { recordOperationResult } from './core/operation-stats.js';
import { noteArcadePlay } from './arcade-session.js';
import { mazeToScreen } from './multimiam-layout.js';
import { isArcadePaused } from './arcade-time.js';

/**
 * Pause de l'Arcade : les horloges des déplacements restent à l'heure, pour que rien ne
 * saute d'une case à la reprise
 * @param {Object} ctx Instance de PacmanGame
 */
function holdMoveClocks(ctx) {
  const now = globalThis.performance ? globalThis.performance.now() : Date.now();
  ctx.lastMoveTime = now;
  ctx.lastGhostMoveTime = now;
}

/**
 * Le personnage et les monstres avancent-ils à ce pas ? Non si la partie est arrêtée, ni en
 * pause, où les horloges restent à l'heure (holdMoveClocks)
 * @param {Object} ctx Instance de PacmanGame
 * @returns {boolean}
 */
function readyToMove(ctx) {
  if (!ctx.running || ctx.gameOver) return false;
  if (!isArcadePaused()) return true;
  holdMoveClocks(ctx);
  return false;
}

/**
 * Invincibilité après une vie perdue : le personnage clignote, puis redevient normal.
 * @param {Object} ctx Instance de PacmanGame
 */
function updateInvincibility(ctx) {
  if (ctx.isInvincible && Date.now() > ctx.invincibilityEndTime) {
    ctx.isInvincible = false;
    ctx.isVisible = true;
  }
  if (ctx.isInvincible) {
    ctx.isVisible = Date.now() % ctx.blinkInterval < ctx.blinkInterval / 2;
  }
}

/**
 * Un pas de Pacman : il avance (arrêté à une intersection, il ne fait que bouger la bouche),
 * puis les réponses et les fantômes sont vérifiés.
 * @param {Object} ctx Instance de PacmanGame
 * @param {number} now Heure du pas (performance.now)
 */
function stepPacman(ctx, now) {
  // Sauvegarder les positions actuelles avant le déplacement
  ctx.lastPacmanPosition = { x: ctx.multimiam.x, y: ctx.multimiam.y };
  if (ctx.multimiam.isAtIntersection && !ctx.multimiam.isMoving) ctx.updateMouthAnimation();
  else ctx.movePacman();

  // Vérifier les collisions après le déplacement
  ctx.checkAnswerCollision();
  ctx.checkGhostCollision();

  // Réinitialiser l'animation et mettre à jour le temps
  ctx.animationProgress = 0;
  ctx.lastMoveTime = now;
}

/**
 * Un pas des fantômes, complètement indépendant de Pacman, puis la collision.
 * @param {Object} ctx Instance de PacmanGame
 * @param {number} now Heure du pas (performance.now)
 */
function stepGhosts(ctx, now) {
  // Sauvegarder la position actuelle des fantômes avant de les déplacer
  ctx.lastGhostPositions = ctx.ghosts.map(ghost => ({ x: ghost.x, y: ghost.y }));
  ctx.moveGhosts();
  ctx.checkGhostCollision();

  // Réinitialiser l'animation et mettre à jour le temps
  ctx.ghostAnimationProgress = 0;
  ctx.lastGhostMoveTime = now;
}

/**
 * Point du labyrinthe où poser la pastille de points : au-dessus de la case mangée.
 * @param {Object} ctx Instance de PacmanGame
 * @param {{x: number, y: number}} cell
 * @returns {{x: number, y: number}}
 */
function cellPoint(ctx, cell) {
  // Case vue à l'écran : le labyrinthe est dessiné transposé en portrait
  const screen = mazeToScreen(cell.x, cell.y, ctx.transposed);
  return { x: (screen.x + 0.5) * ctx.cellWidth, y: screen.y * ctx.cellHeight };
}

/**
 * Une réponse croquée : la partie est jouée, et le calcul compte dans les statistiques,
 * comme dans MultiInvaders et MultiSnake
 */
function noteEatenAnswer(game, answer) {
  noteArcadePlay();
  const { num1, num2 } = game.currentOperation ?? {};
  recordOperationResult(game.operator, num1, num2, Boolean(answer.isCorrect));
}

/**
 * Bonne réponse croquée : 100 points, un monstre de plus peut entrer, et un nouveau calcul
 * part de la case de MultiMiam
 */
function eatCorrectAnswer(game, answer, fromX, fromY) {
  game.score += 100;
  if (game.canvas) {
    showArcadePoints(100, game.canvas, cellPoint(game, answer));
  }
  game.updateUI();

  // Incrémenter le compteur de bonnes réponses
  game.goodAnswersCount++;

  // Vérifier si on doit activer un nouveau monstre (tous les 5 points)
  game.checkAndActivateGhost();
  game.generateOperation(fromX, fromY);
  // Met à jour l'affichage de la multiplication via l'UI si disponible
  if (typeof game.displayOperationUI === 'function') {
    game.displayOperationUI();
  }
}

/** Mauvaise réponse croquée : jusqu'à 50 points de moins, et la réponse disparaît */
function eatWrongAnswer(game, answer, index) {
  // Seuls les points vraiment retirés s'affichent (rien à retirer à 0 point)
  const removed = Math.min(game.score, 50);
  game.score -= removed;
  if (game.canvas) {
    showArcadePenalty(removed, game.canvas, cellPoint(game, answer));
  }
  game.updateUI();

  game.answerPositions.splice(index, 1);
}

/** Un monstre actif sur la case de MultiMiam */
function touchesMultimiam(game, ghost) {
  return ghost.active && game.multimiam.x === ghost.x && game.multimiam.y === ghost.y;
}

/** Monstre vulnérable croqué : il retourne au centre, 20 points */
function eatGhost(game, ghost) {
  ghost.x = 9;
  ghost.y = 8;
  ghost.vulnerable = false;
  game.score += 20;
  game.updateUI();
}

/**
 * Un monstre attrape MultiMiam : une vie de moins. Rend true si c'était la dernière (la
 * partie se termine), sinon MultiMiam repart, invincible un moment
 * @returns {boolean}
 */
function loseLife(game) {
  game.lives--;
  game.updateUI();
  // Utiliser la fonction unifiée pour tous les jeux d'arcade
  // Only show message if game is still running to prevent sounds after navigation away
  // Ton neutre : une vie perdue n'est pas signalée en rouge
  if (!game.gameOver && game.running) {
    showArcadeMessage('arcade_life_lost', 'neutral');
  }
  if (game.lives <= 0) {
    game.endGame();
    return true;
  }
  respawnAfterLifeLost(game);
  return false;
}

// Cases et couleurs des cinq monstres quand MultiMiam repart après une vie perdue
const GHOST_RESPAWNS = [
  { x: 9, y: 8, color: '#FF0000' },
  { x: 10, y: 8, color: '#FFB8FF' },
  { x: 8, y: 8, color: '#00FFFF' },
  { x: 9, y: 7, color: '#FFB852' },
  { x: 10, y: 7, color: '#800080' },
];

/** MultiMiam repart de l'intersection (2, 1), invincible ; les monstres sont replacés */
function respawnAfterLifeLost(game) {
  game.isInvincible = true;
  game.invincibilityEndTime = Date.now() + game.invincibilityDuration;
  game.multimiam.x = 2; // respawn on intersection
  game.multimiam.y = 1;
  game.multimiam.direction = 'RIGHT';
  game.multimiam.nextDirection = 'RIGHT';
  game.multimiam.isMoving = true;

  game.labyrinth[game.multimiam.y][game.multimiam.x] = 0;
  game.answerPositions = game.answerPositions.filter(
    pos => pos.x !== game.multimiam.x || pos.y !== game.multimiam.y
  );
  // Chaque monstre garde son état actif ; le tableau est remplacé en place, dans l'ordre
  const activeStatus = game.ghosts.map(g => g.active);
  const respawned = GHOST_RESPAWNS.map(({ x, y, color }, i) => ({
    x,
    y,
    color,
    direction: 'UP',
    vulnerable: false,
    active: activeStatus.at(i),
  }));
  Object.assign(game.ghosts, respawned);
  console.log('Respawn at', game.multimiam.x, game.multimiam.y);
  game.generateOperation(game.multimiam.x, game.multimiam.y);
  // Met à jour l'affichage de la multiplication via l'UI si disponible
  if (typeof game.displayOperationUI === 'function') {
    game.displayOperationUI();
  }
  console.log('New pellets after respawn:', game.answerPositions);
}

function ensureTimingState(ctx, now) {
  if (!ctx.lastMoveTime) ctx.lastMoveTime = now;
  if (!ctx.lastGhostMoveTime) ctx.lastGhostMoveTime = now;
  if (!ctx.lastPacmanPosition) ctx.lastPacmanPosition = { x: ctx.multimiam.x, y: ctx.multimiam.y };
  if (!ctx.lastGhostPositions || ctx.lastGhostPositions.length === 0) {
    ctx.lastGhostPositions = ctx.ghosts.map(g => ({ x: g.x, y: g.y }));
  }
}

export function initPacmanEngine(game) {
  /* === DÉPLACEMENTS & COLLISIONS =============================== */

  // Petits utilitaires pour réduire la complexité cyclomatique
  const DIRS = { UP: [0, -1], DOWN: [0, 1], LEFT: [-1, 0], RIGHT: [1, 0] };
  const OPP = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

  function getNextPos(x, y, dir) {
    const d = DIRS[dir];
    return d ? { x: x + d[0], y: y + d[1] } : { x, y };
  }

  function computePossibleDirections(ctx, ghost) {
    const res = [];
    for (const dir of ['UP', 'DOWN', 'LEFT', 'RIGHT']) {
      const opp = OPP[ghost.direction];
      if (dir === opp) continue;
      const n = getNextPos(ghost.x, ghost.y, dir);
      if (ctx.canMove(n.x, n.y)) res.push(dir);
    }
    if (res.length === 0) {
      const fallback = OPP[ghost.direction];
      const n = getNextPos(ghost.x, ghost.y, fallback);
      if (ctx.canMove(n.x, n.y)) res.push(fallback);
    }
    return res;
  }

  function pickDirectionByDistance(possible, from, target, closest = true) {
    const scored = possible.map(dir => {
      const n = getNextPos(from.x, from.y, dir);
      return { dir, dist: Math.abs(n.x - target.x) + Math.abs(n.y - target.y) };
    });
    scored.sort((a, b) => (closest ? a.dist - b.dist : b.dist - a.dist));
    return scored[0]?.dir ?? possible[0];
  }

  function avoidCriticalPath(ctx, ghost, chosenDir, multimiam, correct) {
    if (!correct) return chosenDir;
    const next = getNextPos(ghost.x, ghost.y, chosenDir);
    const onCritical = ctx.isOnCriticalPath(
      next.x,
      next.y,
      multimiam.x,
      multimiam.y,
      correct.x,
      correct.y
    );
    if (!onCritical) return chosenDir;
    const possibles = computePossibleDirections(ctx, ghost).filter(dir => {
      const n = getNextPos(ghost.x, ghost.y, dir);
      return !ctx.isOnCriticalPath(n.x, n.y, multimiam.x, multimiam.y, correct.x, correct.y);
    });
    if (possibles.length === 0) return chosenDir;
    return pickRandom(possibles);
  }

  // Peut-on se déplacer sur la case (x,y) ?
  game.canMove = function canMove(x, y) {
    // Limites
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
      return false;
    }
    // Mur ?

    return this.labyrinth[y][x] !== 1;
  };

  // Calculer la prochaine position selon la direction
  game.getNextPosition = function getNextPosition(x, y, direction) {
    switch (direction) {
      case 'UP':
        return { x, y: y - 1 };
      case 'DOWN':
        return { x, y: y + 1 };
      case 'LEFT':
        return { x: x - 1, y };
      case 'RIGHT':
        return { x: x + 1, y };
      default:
        return { x, y };
    }
  };

  // Animation de la bouche de Pacman
  game.updateMouthAnimation = function updateMouthAnimation() {
    this.multimiam.mouthAngle += this.multimiam.mouthSpeed;
    if (this.multimiam.mouthAngle > Math.PI / 4 || this.multimiam.mouthAngle < 0) {
      this.multimiam.mouthSpeed *= -1;
    }
  };

  // Gérer le changement de direction à l'arrêt
  game.handleDirectionChange = function handleDirectionChange() {
    const nextPos = this.getNextPosition(
      this.multimiam.x,
      this.multimiam.y,
      this.multimiam.nextDirection
    );

    if (this.canMove(nextPos.x, nextPos.y)) {
      this.multimiam.direction = this.multimiam.nextDirection;
      this.multimiam.nextDirection = this.multimiam.direction;
      this.multimiam.isMoving = true;
      this.multimiam.isAtIntersection = false;
    }
  };

  // Déplacer Pacman (appelé chaque tick)
  game.movePacman = function movePacman() {
    // À l'arrêt à une intersection → attendre nouvelle direction
    if (!this.multimiam.isMoving) {
      this.handleDirectionChange();
    }

    if (!this.multimiam.isMoving) {
      // Animation bouche même à l'arrêt
      this.updateMouthAnimation();
      return;
    }

    const nextPos = this.getNextPosition(
      this.multimiam.x,
      this.multimiam.y,
      this.multimiam.direction
    );

    if (this.canMove(nextPos.x, nextPos.y)) {
      this.multimiam.x = nextPos.x;
      this.multimiam.y = nextPos.y;
      this.checkIntersection();
    } else {
      this.multimiam.isMoving = false;
    }

    // Animation bouche
    this.updateMouthAnimation();
  };

  // Intersection ?
  game.checkIntersection = function checkIntersection() {
    let possibleDirections = 0;
    if (this.canMove(this.multimiam.x, this.multimiam.y - 1) && this.multimiam.direction !== 'DOWN')
      possibleDirections++;
    if (this.canMove(this.multimiam.x, this.multimiam.y + 1) && this.multimiam.direction !== 'UP')
      possibleDirections++;
    if (
      this.canMove(this.multimiam.x - 1, this.multimiam.y) &&
      this.multimiam.direction !== 'RIGHT'
    )
      possibleDirections++;
    if (this.canMove(this.multimiam.x + 1, this.multimiam.y) && this.multimiam.direction !== 'LEFT')
      possibleDirections++;
    if (possibleDirections > 1) {
      this.multimiam.isMoving = false;
      this.multimiam.isAtIntersection = true;
      this.multimiam.nextDirection = this.multimiam.direction;
    } else {
      this.multimiam.isAtIntersection = false;
    }
  };

  // Chemin critique ? (empêche fantômes de bloquer bonne réponse)
  game.isOnCriticalPath = function isOnCriticalPath(
    x,
    y,
    multimiamX,
    multimiamY,
    targetX,
    targetY
  ) {
    return (
      (x === multimiamX &&
        x === targetX &&
        y >= Math.min(multimiamY, targetY) &&
        y <= Math.max(multimiamY, targetY)) ||
      (y === multimiamY &&
        y === targetY &&
        x >= Math.min(multimiamX, targetX) &&
        x <= Math.max(multimiamX, targetX))
    );
  };

  // Déplacer les fantômes
  game.moveGhosts = function moveGhosts() {
    const correctAnswerPos = this.answerPositions.find(p => p.isCorrect) || null;
    for (const ghost of this.ghosts) {
      if (!ghost.active) continue;
      const possible = computePossibleDirections(this, ghost);
      if (possible.length > 0) {
        if (chance(0.3)) {
          ghost.direction = pickDirectionByDistance(possible, ghost, this.multimiam, true);
        } else if (correctAnswerPos && chance(0.5)) {
          ghost.direction = pickDirectionByDistance(possible, ghost, correctAnswerPos, false);
        } else {
          ghost.direction = pickRandom(possible);
        }
      }
      ghost.direction = avoidCriticalPath(
        this,
        ghost,
        ghost.direction,
        this.multimiam,
        correctAnswerPos
      );
      const next = getNextPos(ghost.x, ghost.y, ghost.direction);
      ghost.x = next.x;
      ghost.y = next.y;
    }
  };

  // Collision Pacman / réponses : seule la première réponse sous MultiMiam compte
  game.checkAnswerCollision = function checkAnswerCollision() {
    for (let i = 0; i < this.answerPositions.length; i++) {
      const answer = this.answerPositions[i];
      if (this.multimiam.x !== answer.x || this.multimiam.y !== answer.y) continue;
      this.labyrinth[answer.y][answer.x] = 0;
      const multimiamPosX = this.multimiam.x;
      const multimiamPosY = this.multimiam.y;
      noteEatenAnswer(this, answer);
      if (answer.isCorrect) {
        eatCorrectAnswer(this, answer, multimiamPosX, multimiamPosY);
      } else {
        eatWrongAnswer(this, answer, i);
      }
      return;
    }
  };

  // Collision Pacman / fantômes
  game.checkGhostCollision = function checkGhostCollision() {
    // Partie déjà finie (dernière vie perdue au pas précédent) : une seule fin
    if (this.gameOver || this.isInvincible) return;
    const now = Date.now();
    if (now - this.graceStartTime < this.graceDuration) return;
    for (const ghost of this.ghosts) {
      if (!touchesMultimiam(this, ghost)) continue;
      if (ghost.vulnerable) {
        eatGhost(this, ghost);
      } else if (loseLife(this)) {
        return;
      }
    }
  };

  // Boucle interne
  game.update = function update() {
    // Partie arrêtée, ou en pause : ni le personnage ni les monstres ne bougent
    if (!readyToMove(this)) return;
    this.updatePlayerAvatar();
    const now = globalThis.performance?.now?.() ?? Date.now();

    // Initialiser les variables de temps et de position si nécessaire
    ensureTimingState(this, now);

    // Calcul des intervalles de temps écoulés
    const deltaTime = now - this.lastMoveTime;
    const ghostDeltaTime = now - this.lastGhostMoveTime;

    // Calcul de la progression de l'animation pour Pacman entre 0 et 1
    this.animationProgress = Math.min(1, deltaTime / this.moveInterval);

    // Calcul de la progression de l'animation pour les fantômes entre 0 et 1
    // Le paramètre ghostIntervalMultiplier détermine la vitesse relative des fantômes par rapport à Pacman
    const ghostIntervalMultiplier = 3.5; // 3.5x plus lent que Pacman (valeur ajustée pour éviter l'effet de clignotement)
    const ghostMoveInterval = this.moveInterval * ghostIntervalMultiplier;
    this.ghostAnimationProgress = Math.min(1, ghostDeltaTime / ghostMoveInterval);

    // IMPORTANT: Les deux pas suivants sont indépendants - l'un pour Pacman, l'autre pour les fantômes
    if (deltaTime >= this.moveInterval) stepPacman(this, now);
    if (ghostDeltaTime >= ghostMoveInterval) stepGhosts(this, now);

    updateInvincibility(this);
  };

  // Vérifier et activer un nouveau monstre si nécessaire
  game.checkAndActivateGhost = function checkAndActivateGhost() {
    if (this.goodAnswersCount > 0 && this.goodAnswersCount % 5 === 0) {
      const inactiveGhostIndex = this.ghosts.findIndex(g => !g.active);
      if (inactiveGhostIndex !== -1) {
        this.ghosts[inactiveGhostIndex].active = true;
        this.showMessage('multimiam_new_ghost', 'warning', 2000);
        console.log(`Monstre #${inactiveGhostIndex + 1} activé! (score: ${this.goodAnswersCount})`);
      }
    }
  };
}

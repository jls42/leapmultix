// multimiam-engine.js - Moteur de déplacement et collisions pour Pacman (ESM)
// (c) LeapMultix 2025

'use strict';

/**
 * Attache toutes les fonctions cœur du gameplay à l'instance `game`.
 * Ceci permet d’alléger multimiam.js en externalisant la logique complexe.
 * @param {Object} game Instance de PacmanGame
 */
import { showArcadeMessage, showArcadePoints } from './utils-es6.js';
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
    return possibles[Math.floor(Math.random() * possibles.length)];
  }

  function ensureTimingState(ctx, now) {
    if (!ctx.lastMoveTime) ctx.lastMoveTime = now;
    if (!ctx.lastGhostMoveTime) ctx.lastGhostMoveTime = now;
    if (!ctx.lastPacmanPosition)
      ctx.lastPacmanPosition = { x: ctx.multimiam.x, y: ctx.multimiam.y };
    if (!ctx.lastGhostPositions || ctx.lastGhostPositions.length === 0) {
      ctx.lastGhostPositions = ctx.ghosts.map(g => ({ x: g.x, y: g.y }));
    }
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
    if (
      (x === multimiamX &&
        x === targetX &&
        y >= Math.min(multimiamY, targetY) &&
        y <= Math.max(multimiamY, targetY)) ||
      (y === multimiamY &&
        y === targetY &&
        x >= Math.min(multimiamX, targetX) &&
        x <= Math.max(multimiamX, targetX))
    ) {
      return true;
    }
    return false;
  };

  // Déplacer les fantômes
  game.moveGhosts = function moveGhosts() {
    const correctAnswerPos = this.answerPositions.find(p => p.isCorrect) || null;
    for (const ghost of this.ghosts) {
      if (!ghost.active) continue;
      const possible = computePossibleDirections(this, ghost);
      if (possible.length > 0) {
        if (Math.random() < 0.3) {
          ghost.direction = pickDirectionByDistance(possible, ghost, this.multimiam, true);
        } else if (correctAnswerPos && Math.random() < 0.5) {
          ghost.direction = pickDirectionByDistance(possible, ghost, correctAnswerPos, false);
        } else {
          ghost.direction = possible[Math.floor(Math.random() * possible.length)];
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

  // Collision Pacman / réponses
  game.checkAnswerCollision = function checkAnswerCollision() {
    for (let i = 0; i < this.answerPositions.length; i++) {
      const answer = this.answerPositions[i];
      if (this.multimiam.x === answer.x && this.multimiam.y === answer.y) {
        this.labyrinth[answer.y][answer.x] = 0;
        const multimiamPosX = this.multimiam.x;
        const multimiamPosY = this.multimiam.y;
        if (answer.isCorrect) {
          this.score += 100;
          if (this.canvas) {
            showArcadePoints(100, this.canvas);
          }
          this.updateUI();

          // Incrémenter le compteur de bonnes réponses
          this.goodAnswersCount++;

          // Vérifier si on doit activer un nouveau monstre (tous les 5 points)
          this.checkAndActivateGhost();
          this.generateOperation(multimiamPosX, multimiamPosY);
          // Met à jour l'affichage de la multiplication via l'UI si disponible
          if (typeof this.displayOperationUI === 'function') {
            this.displayOperationUI();
          }
          return;
        } else {
          this.score = Math.max(0, this.score - 50);
          if (this.canvas) {
            showArcadePoints(-50, this.canvas);
          }
          this.updateUI();

          this.answerPositions.splice(i, 1);
          break;
        }
      }
    }
  };

  // Collision Pacman / fantômes
  game.checkGhostCollision = function checkGhostCollision() {
    if (this.isInvincible) return;
    const now = Date.now();
    if (now - this.graceStartTime < this.graceDuration) return;
    for (const ghost of this.ghosts) {
      if (!ghost.active) continue;
      if (this.multimiam.x === ghost.x && this.multimiam.y === ghost.y) {
        if (ghost.vulnerable) {
          ghost.x = 9;
          ghost.y = 8;
          ghost.vulnerable = false;
          this.score += 20;
          this.updateUI();
        } else {
          this.lives--;
          this.updateUI();
          // Utiliser la fonction unifiée pour tous les jeux d'arcade
          // Only show message if game is still running to prevent sounds after navigation away
          if (!this.gameOver && this.running) {
            showArcadeMessage('arcade_life_lost', '#F44336');
          }
          if (this.lives <= 0) {
            this.endGame();
            return;
          }
          this.isInvincible = true;
          this.invincibilityEndTime = Date.now() + this.invincibilityDuration;
          this.multimiam.x = 2; // respawn on intersection
          this.multimiam.y = 1;
          this.multimiam.direction = 'RIGHT';
          this.multimiam.nextDirection = 'RIGHT';
          this.multimiam.isMoving = true;

          this.labyrinth[this.multimiam.y][this.multimiam.x] = 0;
          this.answerPositions = this.answerPositions.filter(
            pos => pos.x !== this.multimiam.x || pos.y !== this.multimiam.y
          );
          const activeStatus = this.ghosts.map(g => g.active);

          this.ghosts[0] = {
            x: 9,
            y: 8,
            color: '#FF0000',
            direction: 'UP',
            vulnerable: false,

            active: activeStatus[0],
          };

          this.ghosts[1] = {
            x: 10,
            y: 8,
            color: '#FFB8FF',
            direction: 'UP',
            vulnerable: false,

            active: activeStatus[1],
          };

          this.ghosts[2] = {
            x: 8,
            y: 8,
            color: '#00FFFF',
            direction: 'UP',
            vulnerable: false,

            active: activeStatus[2],
          };

          this.ghosts[3] = {
            x: 9,
            y: 7,
            color: '#FFB852',
            direction: 'UP',
            vulnerable: false,

            active: activeStatus[3],
          };

          this.ghosts[4] = {
            x: 10,
            y: 7,
            color: '#800080',
            direction: 'UP',
            vulnerable: false,

            active: activeStatus[4],
          };
          console.log('Respawn at', this.multimiam.x, this.multimiam.y);
          this.generateOperation(this.multimiam.x, this.multimiam.y);
          // Met à jour l'affichage de la multiplication via l'UI si disponible
          if (typeof this.displayOperationUI === 'function') {
            this.displayOperationUI();
          }
          console.log('New pellets after respawn:', this.answerPositions);
        }
      }
    }
  };

  // Boucle interne
  game.update = function update() {
    if (!this.running || this.gameOver) return;
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

    // IMPORTANT: Les deux blocs suivants sont indépendants - l'un pour Pacman, l'autre pour les fantômes

    // === PACMAN ===
    if (deltaTime >= this.moveInterval) {
      // Sauvegarder les positions actuelles avant le déplacement
      this.lastPacmanPosition = { x: this.multimiam.x, y: this.multimiam.y };

      // Déplacer Pacman
      if (this.multimiam.isAtIntersection && !this.multimiam.isMoving) {
        this.multimiam.mouthAngle += this.multimiam.mouthSpeed;
        if (this.multimiam.mouthAngle > Math.PI / 4 || this.multimiam.mouthAngle < 0) {
          this.multimiam.mouthSpeed *= -1;
        }
      } else {
        this.movePacman();
      }

      // Vérifier les collisions après le déplacement
      this.checkAnswerCollision();
      this.checkGhostCollision();

      // Réinitialiser l'animation et mettre à jour le temps
      this.animationProgress = 0;
      this.lastMoveTime = now;
    }

    // === FANTÔMES === (complètement indépendant de Pacman)
    if (ghostDeltaTime >= ghostMoveInterval) {
      // Sauvegarder la position actuelle des fantômes avant de les déplacer
      this.lastGhostPositions = this.ghosts.map(ghost => ({ x: ghost.x, y: ghost.y }));

      // Déplacer les fantômes selon leur logique de mouvement
      this.moveGhosts();

      // Vérifier les collisions après le déplacement
      this.checkGhostCollision();

      // Réinitialiser l'animation et mettre à jour le temps
      this.ghostAnimationProgress = 0;
      this.lastGhostMoveTime = now;

      // Désactiver les logs de débogage en production
      // console.log('Fantômes déplacés à', now);
    }

    // Gestion de l'invincibilité
    if (this.isInvincible && Date.now() > this.invincibilityEndTime) {
      this.isInvincible = false;
      this.isVisible = true;
    }
    if (this.isInvincible) {
      if (Date.now() % this.blinkInterval < this.blinkInterval / 2) {
        this.isVisible = true;
      } else {
        this.isVisible = false;
      }
    }
  };

  // Vérifier et activer un nouveau monstre si nécessaire
  game.checkAndActivateGhost = function checkAndActivateGhost() {
    if (this.goodAnswersCount > 0 && this.goodAnswersCount % 5 === 0) {
      const inactiveGhostIndex = this.ghosts.findIndex(g => !g.active);
      if (inactiveGhostIndex !== -1) {
        this.ghosts[inactiveGhostIndex].active = true;
        this.showMessage('multimiam_new_ghost', '#FF9800', 2000);
        console.log(`Monstre #${inactiveGhostIndex + 1} activé! (score: ${this.goodAnswersCount})`);
      }
    }
  };
}

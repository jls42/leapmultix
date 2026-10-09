// multimiam-renderer.js - Gestion du rendu pour le jeu Pacman (ESM)
// (c) LeapMultix - 2025

import { getCanvasFont, readableCanvasFontSize, getArcadeCanvasSize } from './arcade-common.js';
import { mazeToScreen, transposeDirection } from './multimiam-layout.js';
import { drawArcadeSprite, prefetchArcadeSprite } from './arcade-sprites.js';

export default class PacmanRenderer {
  constructor(game) {
    this.game = game; // Référence à l'instance de PacmanGame
  }

  /**
   * Coin d'une case du labyrinthe sur le canevas (labyrinthe transposé en portrait).
   * @param {number} x - Colonne dans le labyrinthe (décimale pendant un déplacement)
   * @param {number} y - Rangée dans le labyrinthe
   * @returns {{px: number, py: number}}
   */
  cellOrigin(x, y) {
    const g = this.game;
    const screen = mazeToScreen(x, y, g.transposed);
    return { px: screen.x * g.cellSize, py: screen.y * g.cellSize };
  }

  /**
   * Centre d'une case du labyrinthe sur le canevas.
   * @param {number} x
   * @param {number} y
   * @returns {{px: number, py: number}}
   */
  cellCenter(x, y) {
    const { px, py } = this.cellOrigin(x, y);
    const half = this.game.cellSize / 2;
    return { px: px + half, py: py + half };
  }

  /** Direction vue à l'écran (le personnage regarde du côté où il va à l'écran) */
  screenDirection(direction) {
    return transposeDirection(direction, this.game.transposed);
  }

  /** Côté vers lequel regarde un personnage qui va dans cette direction */
  facingOf(direction) {
    return this.screenDirection(direction) === 'LEFT' ? 'left' : 'right';
  }

  /**
   * Case d'un personnage centré sur ce point : une fois et demie une case du labyrinthe
   * @returns {{x: number, y: number, width: number, height: number}}
   */
  spriteBox(pixelX, pixelY) {
    const size = this.game.cellSize * 1.5;
    return { x: pixelX - size / 2, y: pixelY - size / 2, width: size, height: size };
  }

  // Méthode principale appelée à chaque frame
  draw() {
    const g = this.game;
    const ctx = g.ctx;
    if (!ctx) return;

    const board = getArcadeCanvasSize(g.canvas);
    ctx.clearRect(0, 0, board.width, board.height);

    this.drawLabyrinth();

    if (g.answerPositions && g.answerPositions.length > 0) {
      this.drawAnswers();
    } else {
      console.error('CRITIQUE: Aucune réponse à afficher!');
    }

    this.drawPacman();
    this.drawGhosts();
  }

  /* === LABYRINTHE ============================== */
  drawLabyrinth() {
    const g = this.game;
    const ctx = g.ctx;
    const wall = this.tileImage(g.wallTexture);
    const path = this.tileImage(g.pathTexture);

    // Chaque case : sa texture (mur, ou chemin sous les pastilles et les réponses), sinon
    // sa couleur tant que la texture n'est pas arrivée
    for (let y = 0; y < g.rows; y++) {
      for (let x = 0; x < g.cols; x++) {
        const isWall = g.labyrinth.at(y).at(x) === 1;
        const { px, py } = this.cellOrigin(x, y);
        const texture = isWall ? wall : path;
        if (texture) {
          ctx.drawImage(texture, px, py, g.cellSize, g.cellSize);
        } else {
          ctx.fillStyle = isWall ? '#000000' : '#0000FF';
          ctx.fillRect(px, py, g.cellSize, g.cellSize);
        }
      }
    }
  }

  /**
   * Image d'une texture de case, demandée une fois par image à la taille d'une case
   * @returns {HTMLImageElement|null}
   */
  tileImage(texture) {
    const g = this.game;
    prefetchArcadeSprite(g.canvas, texture, g.cellSize, g.cellSize);
    return texture?.image ?? null;
  }

  /* === RÉPONSES ================================= */
  drawAnswers() {
    const g = this.game;
    const ctx = g.ctx;
    if (!g.answerPositions || g.answerPositions.length === 0) return;

    const isMobile = getArcadeCanvasSize(g.canvas).width < 500;
    // Nombres lisibles : au moins 16 px à l'écran, même quand les cases sont petites
    const baseSize = isMobile ? g.cellSize * 0.6 : Math.max(20, Math.min(28, g.cellSize * 0.5));
    const fontSize = readableCanvasFontSize(g.canvas, baseSize);
    ctx.font = getCanvasFont(fontSize);

    for (const ans of g.answerPositions) {
      const { px: x, py: y } = this.cellCenter(ans.x, ans.y);
      const label = ans.value.toString();

      // Pastille à la taille du nombre (1 à 3 chiffres), jamais plus petite que la case
      const pillH = Math.max(g.cellSize * 0.8, fontSize * 1.3);
      const pillW = Math.max(pillH, ctx.measureText(label).width + fontSize * 0.6);
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x - pillW / 2, y - pillH / 2, pillW, pillH, pillH / 2);
      } else {
        ctx.arc(x, y, pillW / 2, 0, Math.PI * 2);
      }
      ctx.fillStyle = '#3333FF';
      ctx.fill();
      // Contour clair, plus fin sur mobile
      ctx.strokeStyle = isMobile ? 'rgba(255,255,255,0.6)' : 'white';
      ctx.lineWidth = isMobile ? 1 : 2;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'black';
      ctx.fillText(label, x + 1, y + 1);
      ctx.fillStyle = 'white';
      ctx.fillText(label, x, y);
    }
  }

  /* === PACMAN =================================== */
  drawPacman() {
    const g = this.game;
    if (!g.multimiam) return;

    g.updatePlayerAvatar();
    const { x, y } = this.getInterpolatedPacmanPosition();
    const { pixelX, pixelY } = this.getPacmanPixelCoordinates(x, y);

    if (!this.shouldRenderPacman()) return;

    this.updatePacmanAnimationState();

    if (!this.drawAvatarSprite(pixelX, pixelY)) {
      this.drawClassicPacman(pixelX, pixelY);
    }
  }

  getInterpolatedPacmanPosition() {
    const g = this.game;
    const defaultPosition = { x: g.multimiam.x, y: g.multimiam.y };

    if (!g.lastPacmanPosition || g.animationProgress >= 1) {
      return defaultPosition;
    }

    const dx = g.multimiam.x - g.lastPacmanPosition.x;
    const dy = g.multimiam.y - g.lastPacmanPosition.y;
    const teleportX = Math.abs(dx) > 1;
    const teleportY = Math.abs(dy) > 1;

    const interpolatedX = teleportX
      ? g.lastPacmanPosition.x
      : g.lastPacmanPosition.x + dx * g.animationProgress;
    const interpolatedY = teleportY
      ? g.lastPacmanPosition.y
      : g.lastPacmanPosition.y + dy * g.animationProgress;

    return { x: interpolatedX, y: interpolatedY };
  }

  getPacmanPixelCoordinates(x, y) {
    const { px, py } = this.cellCenter(x, y);
    return { pixelX: px, pixelY: py };
  }

  shouldRenderPacman() {
    const g = this.game;
    if (!g.isInvincible) return true;

    const blinkStart = g.invincibilityEndTime - g.invincibilityDuration;
    const elapsed = Date.now() - blinkStart;
    const visible = Math.floor(elapsed / g.blinkInterval) % 2 === 0;
    g.isVisible = visible;

    return visible;
  }

  updatePacmanAnimationState() {
    const g = this.game;
    if (!g.multimiam.animationStartTime) {
      g.multimiam.animationStartTime = Date.now();
    }

    const animTime = Date.now() - g.multimiam.animationStartTime;
    const cycle = (animTime % 300) / 300;
    g.multimiam.mouthAngle = 0.05 + 0.3 * Math.abs(Math.sin(cycle * Math.PI * 2));
  }

  drawAvatarSprite(pixelX, pixelY) {
    const g = this.game;
    const facing = this.facingOf(g.multimiam.direction);
    return drawArcadeSprite(g.ctx, g.avatar?.sprite, this.spriteBox(pixelX, pixelY), { facing });
  }

  drawClassicPacman(px, py) {
    const g = this.game;
    const ctx = g.ctx;
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();

    let start, end;
    switch (this.screenDirection(g.multimiam.direction)) {
      case 'LEFT':
        start = 1.2 * Math.PI;
        end = 0.8 * Math.PI;
        break;
      case 'UP':
        start = 1.7 * Math.PI;
        end = 1.3 * Math.PI;
        break;
      case 'DOWN':
        start = 0.7 * Math.PI;
        end = 0.3 * Math.PI;
        break;
      case 'RIGHT':
      default:
        start = 0.2 * Math.PI;
        end = 1.8 * Math.PI;
        break;
    }

    ctx.arc(px, py, g.multimiam.size / 2, start, end);
    ctx.lineTo(px, py);
    ctx.fill();
  }

  /* === fantômes ================================ */

  /**
   * Calcule la position interpolée d'un fantôme pour une animation fluide.
   * @param {object} ghost - L'objet fantôme.
   * @param {number} index - L'index du fantôme dans le tableau.
   * @returns {{x: number, y: number}} - La position interpolée en coordonnées de grille.
   */
  _getInterpolatedGhostPosition(ghost, index) {
    const g = this.game;
    if (!g.lastGhostPositions?.[index]) {
      return { x: ghost.x, y: ghost.y };
    }

    const progress = g.ghostAnimationProgress !== undefined ? g.ghostAnimationProgress : 0;
    const lastPos = g.lastGhostPositions[index];
    const dx = ghost.x - lastPos.x;
    const dy = ghost.y - lastPos.y;

    const teleportX = Math.abs(dx) > 1;
    const teleportY = Math.abs(dy) > 1;

    const x = teleportX ? ghost.x : lastPos.x + dx * progress;
    const y = teleportY ? ghost.y : lastPos.y + dy * progress;

    return { x, y };
  }

  /**
   * Dessine un seul fantôme sur le canvas.
   * @param {object} ghost - L'objet fantôme avec sa direction.
   * @param {object} monster - L'objet monstre avec les sprites.
   * @param {number} pixelX - Coordonnée X en pixels.
   * @param {number} pixelY - Coordonnée Y en pixels.
   */
  _drawSingleGhost(ghost, monster, pixelX, pixelY) {
    const ctx = this.game.ctx;
    const box = this.spriteBox(pixelX, pixelY);
    const facing = this.facingOf(ghost.direction);
    if (drawArcadeSprite(ctx, monster?.sprite, box, { facing })) return;
    // Repli tant que l'image n'est pas arrivée : un cercle rouge
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, box.width / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Méthode principale pour dessiner tous les fantômes actifs.
   */
  drawGhosts() {
    const g = this.game;
    if (!g.ghosts) return;

    for (let i = 0; i < g.ghosts.length; i++) {
      const ghost = g.ghosts[i];
      if (!ghost.active) continue;

      const { x, y } = this._getInterpolatedGhostPosition(ghost, i);

      const { px: pixelX, py: pixelY } = this.cellCenter(x, y);

      const monster = g.monsters && g.monsters[i % g.monsters.length];

      this._drawSingleGhost(ghost, monster, pixelX, pixelY);
    }
  }
}

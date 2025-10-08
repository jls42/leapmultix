// multimiam-renderer.js - Gestion du rendu pour le jeu Pacman (ESM)
// (c) LeapMultix - 2025

export default class PacmanRenderer {
  constructor(game) {
    this.game = game; // Référence à l'instance de PacmanGame
  }

  // Méthode principale appelée à chaque frame
  draw() {
    const g = this.game;
    const ctx = g.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);

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

    // On ne remplit plus tout le fond en bleu, on va dessiner chaque case
    for (let y = 0; y < g.rows; y++) {
      for (let x = 0; x < g.cols; x++) {
        const cell = g.labyrinth[y][x];
        const px = x * g.cellSize;
        const py = y * g.cellSize;
        if (cell === 1) {
          // Mur
          if (g.wallTexture && g.wallTexture.complete && g.wallTexture.naturalHeight !== 0) {
            ctx.drawImage(g.wallTexture, px, py, g.cellSize, g.cellSize);
          } else {
            ctx.fillStyle = '#000000';
            ctx.fillRect(px, py, g.cellSize, g.cellSize);
          }
        } else {
          // Chemin, pastille, super pastille, réponse...
          if (g.pathTexture && g.pathTexture.complete && g.pathTexture.naturalHeight !== 0) {
            ctx.drawImage(g.pathTexture, px, py, g.cellSize, g.cellSize);
          } else {
            ctx.fillStyle = '#0000FF';
            ctx.fillRect(px, py, g.cellSize, g.cellSize);
          }
        }
      }
    }
  }

  /* === RÉPONSES ================================= */
  drawAnswers() {
    const g = this.game;
    const ctx = g.ctx;
    if (!g.answerPositions || g.answerPositions.length === 0) return;

    const isMobile = g.canvas.width < 500;

    for (const ans of g.answerPositions) {
      const x = (ans.x + 0.5) * g.cellSize;
      const y = (ans.y + 0.5) * g.cellSize;

      // Ajuster la taille du cercle selon la longueur du nombre et l'écran
      let r = isMobile ? g.cellSize * 0.42 : g.cellSize * 0.4;
      if (ans.value >= 100) {
        // Agrandir légèrement le cercle pour les nombres à 3+ chiffres
        r *= isMobile ? 1.2 : 1.15;
      } else if (ans.value >= 10) {
        // Petite adaptation pour nombres à 2 chiffres
        r *= isMobile ? 1.05 : 1.0;
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#3333FF';
      ctx.fill();
      // Réduire ou supprimer le contour blanc problématique sur mobile
      if (!isMobile) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Sur mobile, contour très fin pour éviter l'effet blanc visible
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Déterminer une taille de police de base
      let fontSize = isMobile
        ? Math.max(12, Math.min(16, g.cellSize * 0.33)) // encore plus petit sur mobile
        : Math.max(20, Math.min(28, g.cellSize * 0.5));

      // Réduire la police si le nombre est plus grand
      if (ans.value >= 100) {
        fontSize *= 0.8; // réduction ~20 %
      }

      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'black';
      ctx.fillText(ans.value.toString(), x + 1, y + 1);
      ctx.fillStyle = 'white';
      ctx.fillText(ans.value.toString(), x, y);
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
    const g = this.game;
    return {
      pixelX: (x + 0.5) * g.cellSize,
      pixelY: (y + 0.5) * g.cellSize,
    };
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
    const leftImage = g.avatar?.image_left;
    const rightImage = g.avatar?.image_right;

    if (leftImage?.complete && rightImage?.complete) {
      const imageToDraw = g.multimiam.direction === 'LEFT' ? leftImage : rightImage;
      if (imageToDraw.naturalHeight === 0) {
        return false;
      }

      const size = g.cellSize * 1.5;
      const ctx = g.ctx;
      ctx.save();
      ctx.translate(pixelX, pixelY);
      ctx.drawImage(imageToDraw, -size / 2, -size / 2, size, size);
      ctx.restore();

      return true;
    }

    return false;
  }

  drawClassicPacman(px, py) {
    const g = this.game;
    const ctx = g.ctx;
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();

    let start, end;
    switch (g.multimiam.direction) {
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
    // eslint-disable-next-line security/detect-object-injection -- Safe: index is a controlled numeric parameter from a for loop
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
    const g = this.game;
    const ctx = g.ctx;
    const size = g.cellSize * 1.5;

    const imageToDraw = ghost.direction === 'LEFT' ? monster?.image_left : monster?.image_right;

    if (imageToDraw?.complete && imageToDraw.naturalHeight !== 0) {
      ctx.save();
      ctx.translate(pixelX, pixelY);
      ctx.drawImage(imageToDraw, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      // Fallback: dessiner un cercle rouge
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(pixelX, pixelY, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
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

      const pixelX = (x + 0.5) * g.cellSize;
      const pixelY = (y + 0.5) * g.cellSize;

      const monster = g.monsters && g.monsters[i % g.monsters.length];

      this._drawSingleGhost(ghost, monster, pixelX, pixelY);
    }
  }
}

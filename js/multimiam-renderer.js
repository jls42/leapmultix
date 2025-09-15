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
    const ctx = g.ctx;
    if (!g.multimiam) return;

    g.updatePlayerAvatar();

    // Animation fluide: interpolation entre la position précédente et la position actuelle
    let x, y;

    if (g.lastPacmanPosition && g.animationProgress < 1) {
      // Détecter si on a traversé un bord (téléportation)
      const dx = g.multimiam.x - g.lastPacmanPosition.x;
      const dy = g.multimiam.y - g.lastPacmanPosition.y;
      const teleportX = Math.abs(dx) > 1;
      const teleportY = Math.abs(dy) > 1;

      // Calcul de la position interpolée
      if (teleportX) {
        // Gestion du wrapped-around (téléportation d'un bord à l'autre)
        x = g.lastPacmanPosition.x;
      } else {
        x = g.lastPacmanPosition.x + dx * g.animationProgress;
      }

      if (teleportY) {
        // Gestion du wrapped-around (téléportation d'un bord à l'autre)
        y = g.lastPacmanPosition.y;
      } else {
        y = g.lastPacmanPosition.y + dy * g.animationProgress;
      }
    } else {
      // Pas d'animation ou animation terminée
      x = g.multimiam.x;
      y = g.multimiam.y;
    }

    // Convertir les coordonnées de la grille en pixels
    const pixelX = (x + 0.5) * g.cellSize;
    const pixelY = (y + 0.5) * g.cellSize;

    // Gestion clignotement invincibilité
    if (g.isInvincible) {
      const t = Date.now();
      g.isVisible =
        Math.floor((t - (g.invincibilityEndTime - g.invincibilityDuration)) / g.blinkInterval) %
          2 ===
        0;
      if (!g.isVisible) return;
    }

    // Animation bouche
    if (!g.multimiam.animationStartTime) g.multimiam.animationStartTime = Date.now();
    const animTime = Date.now() - g.multimiam.animationStartTime;
    const cycle = (animTime % 300) / 300;
    g.multimiam.mouthAngle = 0.05 + 0.3 * Math.abs(Math.sin(cycle * Math.PI * 2));

    // Avatar personnalisé ?
    if (
      g.avatar &&
      g.avatar.image &&
      g.avatar.image.complete &&
      g.avatar.image.naturalHeight !== 0
    ) {
      const size = g.cellSize * 1.5;
      ctx.save();
      ctx.translate(pixelX, pixelY);
      ctx.drawImage(g.avatar.image, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      this.drawClassicPacman(pixelX, pixelY);
    }
  }

  drawClassicPacman(px, py) {
    const g = this.game;
    const ctx = g.ctx;
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    const angles = {
      RIGHT: [0.2 * Math.PI, 1.8 * Math.PI],
      LEFT: [1.2 * Math.PI, 0.8 * Math.PI],
      UP: [1.7 * Math.PI, 1.3 * Math.PI],
      DOWN: [0.7 * Math.PI, 0.3 * Math.PI],
    };

    const [start, end] = angles[g.multimiam.direction] || [0, 2 * Math.PI];
    ctx.arc(px, py, g.multimiam.size / 2, start, end);
    ctx.lineTo(px, py);
    ctx.fill();
  }

  /* === fantômes ================================ */
  drawGhosts() {
    const g = this.game;
    const ctx = g.ctx;
    if (!g.ghosts) return;

    for (let i = 0; i < g.ghosts.length; i++) {
      const ghost = g.ghosts[i];
      if (!ghost.active) continue;

      // Animation fluide: interpolation entre la position précédente et la position actuelle
      let x, y;

      // Utiliser directement la position de la grille sans animation si les ghostPositions ne sont pas initialisées

      if (!g.lastGhostPositions || !g.lastGhostPositions[i]) {
        x = ghost.x;
        y = ghost.y;
      } else {
        // Sinon, utiliser l'animation fluide
        const progress = g.ghostAnimationProgress !== undefined ? g.ghostAnimationProgress : 0;

        // Détecter si on a traversé un bord (téléportation)

        const dx = ghost.x - g.lastGhostPositions[i].x;

        const dy = ghost.y - g.lastGhostPositions[i].y;
        const teleportX = Math.abs(dx) > 1;
        const teleportY = Math.abs(dy) > 1;

        // Calcul de la position interpolée en fonction de la progression
        if (teleportX) {
          // Si téléportation, utiliser directement la nouvelle position
          x = ghost.x;
        } else {
          // Sinon, interpoler linéairement entre l'ancienne et la nouvelle position

          x = g.lastGhostPositions[i].x + dx * progress;
        }

        if (teleportY) {
          // Si téléportation, utiliser directement la nouvelle position
          y = ghost.y;
        } else {
          // Sinon, interpoler linéairement entre l'ancienne et la nouvelle position

          y = g.lastGhostPositions[i].y + dy * progress;
        }
      }

      // Convertir les coordonnées de la grille en pixels
      const pixelX = (x + 0.5) * g.cellSize;
      const pixelY = (y + 0.5) * g.cellSize;
      const size = g.cellSize * 1.5;

      const monster = g.monsters && g.monsters[i % g.monsters.length];
      if (monster && monster.image && monster.image.complete && monster.image.naturalHeight !== 0) {
        ctx.save();
        ctx.translate(pixelX, pixelY);
        ctx.drawImage(monster.image, -size / 2, -size / 2, size, size);
        ctx.restore();
      } else {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(pixelX, pixelY, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

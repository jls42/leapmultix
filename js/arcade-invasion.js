/* =====================
   Arcade Multiplication Invasion Launcher (MultiInvaders)
   - Contient la fonction startMultiplicationInvasion déplacée depuis arcade.js
   - Dépend de getArcadeGameTemplate(), showArcadeGameOver() définis dans arcade.js
   ===================== */

import { generateQuestion } from './questionGenerator.js';
import {
  getTranslation,
  cleanupGameResources,
  speak,
  isVoiceEnabled,
  playSound,
  showNotification,
  showArcadePoints,
  updateInfoBar,
  showArcadeMessage,
} from './utils-es6.js';
import { eventBus } from './core/eventBus.js';
import { InfoBar } from './components/infoBar.js';
import { getDifficultySettings } from './difficulty.js';
import { gameState as globalGameState } from './game.js';
import { TablePreferences } from './core/tablePreferences.js';
import { UserManager } from './userManager.js';
import {
  startArcadeTimer,
  showArcadeGameOver,
  arcadeKeyDown,
  arcadeKeyUp,
  arcadeControls,
  stopArcadeMode,
  isArcadeActive,
} from './arcade.js';
import { recordMultiplicationResult } from './core/mult-stats.js';
import { showGameInstructions } from './arcade-common.js';
// Utilise les helpers arcades via window (arcade.js expose des ponts globaux)

// Constants for canvas dimensions
const baseWidth = 800;
const baseHeight = 600;

function initializeInvadersGame() {
  try {
    stopArcadeMode();
  } catch {
    // Erreur ignorée (non-critique)
  }

  try {
    globalGameState.gameMode = 'multiinvaders';
  } catch {
    // Erreur ignorée (non-critique)
  }

  const Root =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof window !== 'undefined'
        ? window
        : undefined;

  if (Root?.invadersGame) {
    cleanupGameResources(Root.invadersGame, {
      cleanAnimations: true,
      cleanEvents: true,
      cleanImages: true,
      cleanTimers: true,
    });
  }

  return {
    gameLoopId: null,
    avatarErrorAnim: 0,
    avatarErrorImg: null,
    avatarErrorX: 0,
    avatarErrorY: 0,
    avatarErrorW: 0,
    avatarErrorH: 0,
    avatarErrorPulse: 0,
    arcadeAvatarTimeoutId: null,
  };
}

function setupGameUI() {
  document.removeEventListener('keydown', arcadeKeyDown);
  document.removeEventListener('keyup', arcadeKeyUp);

  const gameScreen = document.getElementById('game');
  while (gameScreen.firstChild) gameScreen.removeChild(gameScreen.firstChild);

  const _frag = InfoBar.createArcadeTemplateElement({
    mode: 'multiinvaders',
    canvasId: 'arcade-canvas',
    operationId: 'arcade-mult-display',
    scoreId: 'multiinvaders-info-score',
    livesId: 'multiinvaders-info-lives',
    timerId: 'arcade-info-timer',
    abandonId: 'arcade-abandon-btn',
    operationLabel: '',
    abandonLabel: getTranslation('abandon_arcade_button'),
    showLives: true,
    showScore: true,
  });
  gameScreen.appendChild(_frag);

  const difficultySettings = getDifficultySettings(globalGameState?.difficulty ?? 'debutant');
  startArcadeTimer(difficultySettings.timeSeconds);

  return difficultySettings;
}

function getRootObject() {
  return typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : undefined;
}

/**
 * Fonction centralisée de nettoyage du jeu Invasion
 * @param {Object} params - Paramètres de nettoyage
 * @param {Object} params.gameVars - Variables du jeu (gameLoopId, arcadeAvatarTimeoutId)
 * @param {number} params.autoRestartTimeout - Timeout de redémarrage auto
 * @param {HTMLImageElement} params.spaceshipImg - Image du vaisseau
 * @param {HTMLImageElement} params.avatarImg - Image de l'avatar
 * @param {Function} params.handleSpaceDown - Handler pour la barre d'espace
 * @param {number} params.score - Score actuel
 * @returns {number} Le score actuel
 */
function cleanupInvasionGame({
  gameVars,
  autoRestartTimeout,
  spaceshipImg,
  avatarImg,
  handleSpaceDown,
  score = 0,
}) {
  const { gameLoopId, arcadeAvatarTimeoutId } = gameVars || {};

  // Créer l'objet pour cleanupGameResources
  const invadersGame = {
    eventListeners: [],
    timers: [arcadeAvatarTimeoutId, autoRestartTimeout].filter(Boolean),
    animationId: gameLoopId,
    images: [spaceshipImg, avatarImg].filter(Boolean),
  };

  // Nettoyer les ressources
  try {
    cleanupGameResources(invadersGame, {
      cleanAnimations: true,
      cleanEvents: true,
      cleanImages: true,
      cleanTimers: true,
    });
  } catch {
    // Erreur ignorée (non-critique)
  }

  // Nettoyage supplémentaire
  if (arcadeAvatarTimeoutId) {
    clearTimeout(arcadeAvatarTimeoutId);
  }

  if (autoRestartTimeout) {
    clearTimeout(autoRestartTimeout);
  }

  // Retirer le listener de la barre d'espace
  if (handleSpaceDown) {
    document.removeEventListener('keydown', handleSpaceDown);
  }

  return score;
}

function setupAbandonButton(gameVars) {
  // This function will be used to setup the abandon button after all variables are declared
  // For now, just return a function that can be called later
  return function (autoRestartTimeout, spaceshipImg, avatarImg, score, handleSpaceDown) {
    document.getElementById('arcade-abandon-btn').addEventListener('click', function () {
      const finalScore = cleanupInvasionGame({
        gameVars,
        autoRestartTimeout,
        spaceshipImg,
        avatarImg,
        handleSpaceDown,
        score,
      });
      showArcadeGameOver(finalScore);
    });
  };
}

function calculateCanvasDimensions(Root) {
  const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(globalThis.navigator?.userAgent || '');
  let displayWidth, displayHeight;

  if (isMobile) {
    const maxWidthMobile = Math.min((Root?.innerWidth || baseWidth) * 0.95, baseWidth);
    displayWidth = maxWidthMobile;
    const maxHeightMobile = Math.floor((Root?.innerHeight || baseHeight) * 0.7);
    const mobileRatio = 1.5;
    displayHeight = Math.round(displayWidth * mobileRatio);

    if (displayHeight > maxHeightMobile) {
      displayHeight = maxHeightMobile;
      displayWidth = Math.floor(displayHeight / mobileRatio);
    }
  } else {
    const maxWidthDesktop = Math.floor((Root?.innerWidth || baseWidth) * 0.9);
    displayWidth = maxWidthDesktop;
    const maxHeightDesktop = Math.floor((Root?.innerHeight || baseHeight) * 0.8);
    displayHeight = Math.round((displayWidth * baseHeight) / baseWidth);
    if (displayHeight > maxHeightDesktop) {
      displayHeight = maxHeightDesktop;
      displayWidth = Math.floor((displayHeight * baseWidth) / baseHeight);
    }
  }

  return { displayWidth, displayHeight, isMobile };
}

function computeBaseAlienSpeed(isMobile, difficulty, enemySpeed) {
  // Calcule une vitesse de base des aliens en fonction du device et de la difficulté
  const diff = difficulty || 'moyen';
  if (isMobile) {
    if (diff === 'debutant' || diff === 'facile') return 0.04 * enemySpeed;
    if (diff === 'moyen') return 0.05 * enemySpeed;
    return 0.055 * enemySpeed;
  }
  if (diff === 'debutant' || diff === 'facile') return 0.05 * enemySpeed;
  if (diff === 'moyen') return 0.07 * enemySpeed;
  return 0.09 * enemySpeed;
}

export function startMultiplicationInvasion() {
  const gameVars = initializeInvadersGame();
  const difficultySettings = setupGameUI();
  const Root = getRootObject();

  // Variables that are reassigned
  let {
    avatarErrorAnim,
    avatarErrorImg,
    avatarErrorX,
    avatarErrorY,
    avatarErrorW,
    avatarErrorH,
    avatarErrorPulse,
  } = gameVars;

  const setupAbandonButtonHandler = setupAbandonButton(gameVars);
  const canvas = document.getElementById('arcade-canvas');
  const ctx = canvas.getContext('2d');
  const { displayWidth, displayHeight, isMobile } = calculateCanvasDimensions(Root);

  canvas.width = displayWidth;
  canvas.height = displayHeight;
  canvas.style.width = displayWidth + 'px';
  canvas.style.height = displayHeight + 'px';

  // Ajout de la classe pour appliquer les styles communs
  canvas.classList.add('arcade-canvas');

  // Desktop controls: arrow keys & shoot
  document.addEventListener('keydown', arcadeKeyDown);
  document.addEventListener('keyup', arcadeKeyUp);

  // Adapter les entités à la taille du canvas - position du joueur en bas
  const player = {
    x: displayWidth / 2 - 25,
    y: displayHeight - 30, // Position bas d'écran avec un petit espace
    width: 50,
    height: 40, // Hauteur réduite
    color: '#4CAF50',
    speed: Math.max(8, displayWidth / 100),
  };
  const bullets = [];
  let aliens = [];
  const explosions = [];
  const currentProblem = { a: 0, b: 0 };
  let score = 0;
  let lives = 3;
  let wave = 1;
  let gameOver = false;
  // Vitesse réduite pour une meilleure jouabilité sur mobile
  // Vitesse des aliens selon le niveau de difficulté mais avec une base plus lente
  // Réutilisation de difficultySettings déjà déclaré
  const baseAlienSpeed = computeBaseAlienSpeed(
    isMobile,
    globalGameState.difficulty,
    difficultySettings.enemySpeed
  );

  // Augmentation progressive très douce pour limiter la pression
  const alienSpeedIncrement = baseAlienSpeed * 0.03;
  let currentAlienSpeed = baseAlienSpeed;
  const autoRestartTimeout = null;
  let showingAvatar = false;
  let avatarImg = null,
    avatarX = 0,
    avatarY = 0,
    avatarW = 0,
    avatarH = 0,
    avatarDisplayTime = 0;

  // Pré-chargement des images
  const playerAvatar = globalGameState?.avatar ?? 'fox';
  const spaceshipImg = new Image();
  let spaceshipLoaded = false;
  let imagesLoaded = false;
  // Nombre d'images à charger

  // Déterminer le fichier à charger selon la sélection
  const spaceshipFile =
    globalGameState.selectedSpaceship || `spaceship_${playerAvatar}.png|spaceship_default.png`;
  const [mainFile, fallbackFile] = spaceshipFile.split('|');
  spaceshipImg.onerror = function () {
    console.info(
      `[Arcade] Image du vaisseau personnalisée non trouvée (${spaceshipImg.src}), fallback sur le vaisseau générique.`
    );
    spaceshipImg.src = `assets/images/arcade/${fallbackFile}`;
  };
  spaceshipImg.onload = function () {
    spaceshipLoaded = true;
    if (spaceshipLoaded && monsterSpritesLoaded) imagesLoaded = true;
  };
  spaceshipImg.src = `assets/images/arcade/${mainFile}`;

  // ENNEMIS : monstres dédiés
  const monsterSpriteNames = [];
  for (let i = 1; i <= 43; i++) {
    const num = i.toString().padStart(2, '0');
    monsterSpriteNames.push(`monstre${num}_right_128x128.png`);
  }
  // Intégration nouveaux monstres convertis
  for (let i = 84; i <= 111; i++) {
    const num = i.toString().padStart(2, '0');
    monsterSpriteNames.push(`monstre${num}_right_128x128.png`);
  }
  for (let i = 121; i <= 145; i++) {
    const num = i.toString().padStart(2, '0');
    monsterSpriteNames.push(`monstre${num}_right_128x128.png`);
  }
  // Intégration des nouveaux monstres 146–155
  for (let i = 146; i <= 155; i++) {
    const num = i.toString().padStart(2, '0');
    monsterSpriteNames.push(`monstre${num}_right_128x128.png`);
  }
  const monsterSprites = monsterSpriteNames.map(name => {
    const img = new Image();
    img.src = 'assets/images/arcade/' + name;
    return img;
  });
  let monsterSpritesLoaded = false;
  let loadedCount = 0;
  const imagesToLoad = monsterSprites.length;
  monsterSprites.forEach(sprite => {
    sprite.onload = function () {
      loadedCount++;
      if (loadedCount === imagesToLoad) monsterSpritesLoaded = true;
      if (spaceshipLoaded && monsterSpritesLoaded) imagesLoaded = true;
    };
  });

  // Pool de sprites pour éviter répétitions avant épuisement
  let availableMonsterSprites = monsterSprites.slice();

  // Pré-chargement des sons (supprimé si non utilisé)

  const congratsMessages = [
    getTranslation('congrats1'),
    getTranslation('congrats2'),
    getTranslation('congrats3'),
    getTranslation('congrats4'),
    getTranslation('congrats5'),
  ];
  let lastCongratsScore = 0;

  // Variables globales pour la taille et l'espacement des aliens
  let alienWidth, spacing;

  // Gestion tactile améliorée - Clic monstre = déplace vaisseau + tire (tap unique)
  canvas.addEventListener(
    'touchstart',
    e => {
      e.preventDefault(); // Empêcher autres événements tactiles
      e.stopPropagation();
      e.stopImmediatePropagation();
      let hitMonster = false; // Déplacer la déclaration ici

      // Ignorer gestes multi-touch (pinch/zoom) pour éviter double interprétation
      if (e.touches.length === 1 && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const touchX = (e.touches[0].clientX - rect.left) * scaleX;
        const touchY = (e.touches[0].clientY - rect.top) * scaleY;

        // Vérifier si on touche un monstre OU sa colonne (peu importe où sur l'écran)
        for (const alien of aliens) {
          // Suppression de alien.active: tous les aliens présents sont ciblables
          const monsterX = alien.x;
          const monsterY = alien.y;
          const monsterW = alienWidth * (displayWidth / baseWidth);
          const monsterH = 64 * (displayHeight / baseHeight);

          // Vérifier collision avec le monstre OU dans sa colonne verticale (toute hauteur)
          const inMonsterColumn = touchX >= monsterX && touchX <= monsterX + monsterW;
          const directHitMonster =
            inMonsterColumn && touchY >= monsterY && touchY <= monsterY + monsterH;

          if (directHitMonster || (inMonsterColumn && touchY < canvas.height * 0.8)) {
            // Déplacer le vaisseau sous le monstre cliqué IMMÉDIATEMENT
            player.x = monsterX + monsterW / 2 - (64 * (displayWidth / baseWidth)) / 2;
            player.x = Math.max(
              64 * (displayWidth / baseWidth),
              Math.min(canvas.width - 64 * (displayWidth / baseWidth), player.x)
            );
            // Tir instantané (plus de délai artificiel) pour reactivité sur device réel
            shoot();
            hitMonster = true;
            break; // Sortie de boucle
          }
        }

        // Si pas de monstre touché, comportement classique (partie basse)
        if (!hitMonster && touchY > canvas.height / 2) {
          player.x = touchX - 64 * (displayWidth / baseWidth);
          player.x = Math.max(
            64 * (displayWidth / baseWidth),
            Math.min(canvas.width - 64 * (displayWidth / baseWidth), player.x)
          );
        }
      }

      // Tir simple immédiat si pas de monstre ciblé (remplace l'ancien double-tap)
      if (!hitMonster) shoot();
      // Empêcher propagation si monstre touché (on a déjà programmé le tir différé)
      if (hitMonster) {
        e.stopPropagation();
        return false;
      }
    },
    { passive: false }
  );
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.touches[0]) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      if (e.touches[0].clientY > rect.top + rect.height / 2) {
        const x = (e.touches[0].clientX - rect.left) * scaleX;
        player.x = x - 64 * (displayWidth / baseWidth);
        player.x = Math.max(
          64 * (displayWidth / baseWidth),
          Math.min(canvas.width - 64 * (displayWidth / baseWidth), player.x)
        );
      }
    }
  });

  // Ajouter touchend pour s'assurer que les événements ne se propagent pas
  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // Ne pas faire d'action spécifique, juste empêcher la propagation
  });

  // Avatars
  // Liste d'avatars disponibles (chargés lors de la libération aléatoire)

  function generateProblem() {
    // reset flag (variable supprimée)
    // Génération des questions selon le niveau de difficulté (Cascade 2025)
    // Récupération des paramètres de difficulté

    // Appliquer l'exclusion globale de tables
    const currentUser = UserManager.getCurrentUser();
    const excluded = TablePreferences.isGlobalEnabled(currentUser)
      ? TablePreferences.getActiveExclusions(currentUser)
      : [];

    const q = generateQuestion({
      type: 'mcq',
      tables: difficultySettings.tables,
      excludeTables: excluded,
      minNum: 2,
      maxNum: 10,
      distractorDistance: difficultySettings.distractorDistance,
    });
    currentProblem.a = q.table;
    currentProblem.b = q.num;
    const correctAnswer = q.answer;
    aliens = [];
    const nbAliens = 5;
    // Sélection unique de sprites pour cette vague, sans répétition inter-vagues
    if (availableMonsterSprites.length < nbAliens) {
      availableMonsterSprites = monsterSprites.slice();
    }
    const shuffledPool = availableMonsterSprites.sort(() => Math.random() - 0.5);

    const spritesForWave = shuffledPool.slice(0, nbAliens);
    // Retirer les sprites utilisées du pool
    availableMonsterSprites = availableMonsterSprites.filter(s => !spritesForWave.includes(s));
    // Ajouter des marges plus importantes sur les bords pour éviter les monstres coupés
    // Définir une marge minimale de sécurité sur les bords
    const safeMargin = 20;

    if (isMobile) {
      // Ajustement pour les petits écrans: réduire la taille et l'espacement
      // pour s'assurer que tous les monstres sont entièrement visibles
      const availableWidth = displayWidth - safeMargin * 2; // Retirer les marges des deux côtés
      alienWidth = Math.min(70, availableWidth / nbAliens - 10);
      spacing = Math.max(
        10,
        Math.min(20, (availableWidth - nbAliens * alienWidth) / (nbAliens - 1))
      );
    } else {
      // Version desktop: plus de flexibilité mais toujours avec des marges sécurisées
      const availableWidth = displayWidth - safeMargin * 2;
      alienWidth = Math.max(70, Math.min(100, availableWidth / nbAliens - 15));
      spacing = Math.max(
        20,
        Math.min(50, (availableWidth - nbAliens * alienWidth) / (nbAliens - 1))
      );
    }
    const totalWidth = nbAliens * alienWidth + (nbAliens - 1) * spacing;
    const startX = (displayWidth - totalWidth) / 2;
    let options = [correctAnswer];
    while (options.length < nbAliens) {
      // Génération des distracteurs selon le niveau de difficulté (Cascade 2025)
      // Réutilisation des paramètres de difficulté
      const wrong = generateQuestion({
        type: 'mcq',
        tables: difficultySettings.tables,
        minNum: 2,
        maxNum: 10,
        distractorDistance: difficultySettings.distractorDistance,
      }).answer;
      if (!options.includes(wrong)) options.push(wrong);
    }
    options = options.sort(() => Math.random() - 0.5);
    for (let i = 0; i < nbAliens; i++) {
      // Position verticale de départ ajustée selon le device
      // Sur mobile, commencer plus haut pour donner plus de temps
      const startY = isMobile
        ? 30 * (displayHeight / baseHeight) // Plus haut sur mobile
        : 50 * (displayHeight / baseHeight); // Position standard sur desktop

      const alien = {
        x: startX + i * (alienWidth + spacing),
        y: startY,

        value: options[i],
        color: '#ff5252',
        speed: currentAlienSpeed,

        sprite: spritesForWave[i],
      };
      aliens.push(alien);
    }
    updateMultiplicationDisplay();
  }

  function updateMultiplicationDisplay() {
    // Met à jour la question dans la structure responsive (score/question centrée)
    const questionSpan = document.querySelector('.arcade-mobile-top .arcade-question');
    if (questionSpan) {
      if (currentProblem && currentProblem.a !== undefined && currentProblem.b !== undefined) {
        questionSpan.textContent = `${currentProblem.a} × ${currentProblem.b} = ?`;
      } else {
        questionSpan.textContent = '';
      }
    }
  }

  function shoot() {
    // Positionner le tir au-dessus de la fusée avec des ajustements pour s'assurer
    // qu'il atteint bien les monstres même quand la fusée est en bas
    bullets.push({
      x: player.x + player.width / 2 - 2.5, // Centrer le tir horizontalement
      y: player.y - 20, // Démarrer le tir juste au-dessus de la fusée
      size: isMobile ? 8 : 5, // Tir plus visible sur mobile
    });

    if (isVoiceEnabled()) {
      playSound('shoot');
    }
  }

  // Gestion locale de la barre espace (supprime le bridge global window.shoot)
  const handleSpaceDown = e => {
    if (e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space') {
      e.preventDefault();
      shoot();
    }
  };
  document.addEventListener('keydown', handleSpaceDown);

  // Setup abandon button handler now that all variables are available
  setupAbandonButtonHandler(autoRestartTimeout, spaceshipImg, avatarImg, score, handleSpaceDown);

  function createExplosion(x, y) {
    explosions.push({ x: x, y: y, radius: 1, maxRadius: 30, color: '#ffff00' });
  }

  function updatePlayerPosition() {
    if (arcadeControls.leftPressed) player.x -= player.speed;
    if (arcadeControls.rightPressed) player.x += player.speed;
    player.x = Math.max(
      64 * (displayWidth / baseWidth),
      Math.min(canvas.width - 64 * (displayWidth / baseWidth), player.x)
    );
  }

  function handleWrongAlienHit(bIndex, aIndex) {
    if (!isArcadeActive()) return;
    score += 100;
    if (typeof showArcadePoints === 'function') {
      showArcadePoints(100, canvas);
    }
    refreshInfoBar();

    bullets.splice(bIndex, 1);

    aliens.splice(aIndex, 1);
  }

  function handleCorrectAlienHit(alien, bIndex) {
    if (!isArcadeActive()) return;
    recordMultiplicationResult(currentProblem.a, currentProblem.b, false);
    score = Math.max(0, score - difficultySettings.penalty);
    if (typeof showArcadePoints === 'function') {
      showArcadePoints(-50, canvas);
    }
    lives--;
    refreshInfoBar();

    bullets.splice(bIndex, 1);

    showArcadeMessage('arcade_life_lost', '#F44336');

    if (!avatarErrorAnim || avatarErrorAnim === 0) {
      avatarErrorAnim = 24;
      const errMsg =
        getTranslation('arcade_avatar_error') || "Attention ! Il ne faut pas tirer sur l'avatar !";
      showNotification('info', '', errMsg);
      speak(errMsg);
      playSound('bad');

      const possibleAvatars = ['panda', 'fox', 'astronaut', 'unicorn', 'dragon'].filter(
        a => a !== (globalGameState?.avatar ?? 'fox')
      );

      const randomAvatar = possibleAvatars[Math.floor(Math.random() * possibleAvatars.length)];
      avatarErrorImg = new Image();
      avatarErrorImg.src = `assets/images/arcade/${randomAvatar}_right_128x128.png`;
      avatarErrorX = alien.x;
      avatarErrorY = alien.y;
      avatarErrorW = alienWidth;
      avatarErrorH = alienWidth;
      avatarErrorPulse = 0;
    }
  }

  function updateBullets() {
    bullets.forEach((bullet, bIndex) => {
      bullet.y -= 7;

      aliens.forEach((alien, aIndex) => {
        if (
          bullet.x > alien.x &&
          bullet.x < alien.x + alienWidth &&
          bullet.y > alien.y &&
          bullet.y < alien.y + alienWidth
        ) {
          createExplosion(alien.x + alienWidth / 2, alien.y + alienWidth / 2);
          const correctVal = currentProblem.a * currentProblem.b;
          if (alien.value !== correctVal) {
            handleWrongAlienHit(bIndex, aIndex);
          } else {
            handleCorrectAlienHit(alien, bIndex);
          }
        }
      });
    });
  }

  function checkAlienCollision() {
    if (aliens.some(alien => alien.y + 40 >= player.y)) {
      if (!isArcadeActive()) return;
      lives--;
      aliens = [];
      refreshInfoBar();
      showArcadeMessage('arcade_life_lost', '#F44336');
      if (lives > 0) generateProblem();
    }
  }

  function handleAvatarTransformation() {
    if (
      aliens.length === 1 &&
      aliens[0].value === currentProblem.a * currentProblem.b &&
      !showingAvatar &&
      lives > 0
    ) {
      recordMultiplicationResult(currentProblem.a, currentProblem.b, true);
      showingAvatar = true;

      const avatarKeys = ['panda', 'fox', 'astronaut', 'unicorn', 'dragon'];
      const playerAvatar = globalGameState?.avatar ?? 'fox';
      const possibleAvatars = avatarKeys.filter(a => a !== playerAvatar);

      const liberatedAvatar = possibleAvatars[Math.floor(Math.random() * possibleAvatars.length)];

      avatarImg = new Image();
      avatarImg.src = `assets/images/arcade/${liberatedAvatar}_right_128x128.png`;
      avatarX = aliens[0].x;
      avatarY = aliens[0].y;
      avatarW = alienWidth;
      avatarH = alienWidth;
      avatarDisplayTime = 0;

      setTimeout(() => {
        showingAvatar = false;
        aliens.length = 0;
        wave++;
        currentAlienSpeed = baseAlienSpeed + (wave - 1) * alienSpeedIncrement;
        generateProblem();
      }, 1200);
    }
  }

  function checkGameOver() {
    if (lives <= 0 && !gameOver) {
      gameOver = true;
      refreshInfoBar();
      setTimeout(() => {
        if (isArcadeActive()) showArcadeGameOver(score);
      }, 600);
    }
  }

  function handleCongrats() {
    if (isVoiceEnabled() && score >= 1000 && score - lastCongratsScore >= 1000) {
      lastCongratsScore = score;

      const msg = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
      speak(msg);
    }
  }

  function update() {
    if (!isArcadeActive()) return;
    if (gameOver) return;
    if (showingAvatar) return;

    updatePlayerPosition();
    aliens.forEach(alien => (alien.y += alien.speed));
    updateBullets();
    checkAlienCollision();
    handleAvatarTransformation();

    if (aliens.length === 0 && lives > 0 && !showingAvatar) {
      generateProblem();
    }

    checkGameOver();
    handleCongrats();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (imagesLoaded) {
      // Affichage du vaisseau avec un alignement précis en bas de l'écran
      // Taille plus grande sur desktop pour une meilleure visibilité
      const shipWidth = isMobile ? player.width * 1.5 : player.width * 3.5;
      const shipHeight = isMobile ? player.height * 1.5 : player.height * 3.5;

      // Positionner la fusée pour qu'elle soit au-dessus de player.y avec un décalage minimal
      ctx.drawImage(
        spaceshipImg,
        player.x - shipWidth / 2 + player.width / 2, // Centrer horizontalement
        player.y - shipHeight + player.height / 2, // Placer juste au-dessus de la position y
        shipWidth,
        shipHeight
      );
    } else {
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
    // === Avatar error animation ===
    if (avatarErrorAnim && avatarErrorAnim > 0 && avatarErrorImg) {
      avatarErrorPulse = (avatarErrorPulse || 0) + 1;
      const pulse = 1 + 0.2 * Math.sin(avatarErrorPulse / 2);
      ctx.save();
      ctx.globalAlpha = 0.98;
      ctx.shadowColor = '#ff2d2d';
      ctx.shadowBlur = 48;
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#ff2d2d';
      ctx.beginPath();
      ctx.arc(
        avatarErrorX + avatarErrorW / 2,
        avatarErrorY + avatarErrorH / 2,
        (avatarErrorW * pulse) / 2 + 12,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      ctx.drawImage(
        avatarErrorImg,
        avatarErrorX + (avatarErrorW * (1 - pulse)) / 2,
        avatarErrorY + (avatarErrorH * (1 - pulse)) / 2,
        avatarErrorW * pulse,
        avatarErrorH * pulse
      );
      ctx.restore();
      avatarErrorAnim--;
      if (avatarErrorAnim === 0) {
        avatarErrorImg = null;
      }
    } else if (showingAvatar && avatarImg) {
      // Animation: simple scaling/pulse
      avatarDisplayTime++;
      const pulse = 1 + 0.15 * Math.sin(avatarDisplayTime / 5);
      ctx.save();
      ctx.globalAlpha = 0.96;
      ctx.shadowColor = '#ffe066';
      ctx.shadowBlur = 32;
      ctx.drawImage(
        avatarImg,
        avatarX + (avatarW * (1 - pulse)) / 2,
        avatarY + (avatarH * (1 - pulse)) / 2,
        avatarW * pulse,
        avatarH * pulse
      );
      ctx.restore();
    } else {
      aliens.forEach(alien => {
        if (imagesLoaded) {
          ctx.drawImage(alien.sprite, alien.x, alien.y, alienWidth, alienWidth);
        } else {
          ctx.fillStyle = alien.color;
          ctx.fillRect(alien.x, alien.y, alienWidth, alienWidth);
        }
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(
          alien.x + alienWidth / 2,
          alien.y - 0.28 * alienWidth,
          0.2 * alienWidth,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#222';
        ctx.font = `bold ${Math.round(alienWidth * 0.28)}px Arial`;
        ctx.textAlign = 'center';

        ctx.fillText(alien.value, alien.x + alienWidth / 2, alien.y - 0.18 * alienWidth);
        ctx.textAlign = 'start';
      });
    }
    ctx.fillStyle = '#ffff00';
    bullets.forEach(bullet => {
      ctx.fillRect(
        bullet.x,
        bullet.y,
        5 * (displayWidth / baseWidth),
        10 * (displayHeight / baseHeight)
      );
    });
  }

  function refreshInfoBar() {
    updateInfoBar({ score: score, lives: lives, streak: null, progress: null }, 'multiinvaders');
    updateMultiplicationDisplay();
  }

  function gameLoop() {
    update();
    draw();
    if (!gameOver && isArcadeActive()) {
      // Sauvegarder l'ID dans gameVars pour permettre un cleanup correct
      gameVars.gameLoopId = requestAnimationFrame(gameLoop);
    }
  }

  // Contrôles
  canvas.setAttribute('tabindex', '0');
  // Éviter de provoquer un scroll vers le canvas au démarrage (cachant le bandeau score)
  try {
    if (canvas.focus) {
      canvas.focus({ preventScroll: true });
    }
  } catch {
    // fallback silencieux
    try {
      canvas.focus();
    } catch {
      /* no-op */
    }
  }

  // Correction du positionnement: centrer parfaitement la fusée sous le curseur/doigt
  canvas.addEventListener('mousemove', e => {
    if (!isMobile) {
      // Récupérer les dimensions réelles du canvas pour le ratio
      const rect = canvas.getBoundingClientRect();
      // Convertir la position de la souris en position dans le canvas
      const canvasX = (e.clientX - rect.left) * (canvas.width / rect.width);
      // Le sprite du joueur fait environ 32px de large, on centre sous le curseur
      player.x = canvasX - player.width / 2;
      // Limiter aux bords du canvas avec une marge de sécurité
      player.x = Math.max(5, Math.min(canvas.width - player.width - 5, player.x));
    }
  });

  // Amélioration du contrôle tactile pour appareils mobiles
  canvas.addEventListener(
    'touchmove',
    e => {
      if (isMobile && e.touches.length > 0) {
        e.preventDefault(); // Éviter le défilement de la page
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        // Convertir la position du toucher en position dans le canvas
        const canvasX = (touch.clientX - rect.left) * (canvas.width / rect.width);
        // Centrer la fusée sous le doigt
        player.x = canvasX - player.width / 2;
        // Limiter aux bords du canvas avec une marge de sécurité
        player.x = Math.max(5, Math.min(canvas.width - player.width - 5, player.x));
      }
    },
    { passive: false }
  );

  // Tirer au clic ou toucher
  canvas.addEventListener('mousedown', e => {
    if (e.button === 0) shoot();
  });
  // (Ancien écouteur touchstart générique supprimé: le gestionnaire plus haut gère désormais le tir immédiat.)

  // Lancer le jeu
  score = 0;
  lives = 3;
  wave = 1;
  gameOver = false;
  generateProblem();
  refreshInfoBar();
  gameLoop();

  // Écouter l'arrêt arcade via EventBus (bouton accueil) → cleanup complet sans game over
  try {
    eventBus.on(
      'arcade:stop',
      () => {
        cleanupInvasionGame({
          gameVars,
          autoRestartTimeout,
          spaceshipImg,
          avatarImg,
          handleSpaceDown,
          score,
        });
      },
      { once: true }
    );
  } catch {
    // Erreur ignorée (non-critique)
  }

  // Afficher les instructions uniformisées au-dessus du canvas
  showGameInstructions(
    canvas,
    getTranslation('multiinvaders_instruction') ||
      'Détruis les monstres avec la bonne réponse ! Évite de tirer sur ton avatar.',
    '#FF5722', // Couleur orange pour MultiInvader
    5000
  );
}

// No global export; ES module named export is used by ArcadeMode and retry button

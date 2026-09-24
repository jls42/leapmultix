/* =====================
   Arcade Multiplication Invasion Launcher (MultiInvaders)
   - Contient la fonction startMultiplicationInvasion déplacée depuis arcade.js
   - Dépend de InfoBar.createArcadeTemplateElement (components/infoBar.js) et de showArcadeGameOver() (arcade.js)
   ===================== */

import { generateQuestion } from './questionGenerator.js';
import {
  getTranslation,
  cleanupGameResources,
  speak,
  isVoiceEnabled,
  playSound,
  showArcadePoints,
  updateInfoBar,
  showArcadeMessage,
} from './utils-es6.js';
import { showArcadePenalty } from './arcade-points.js';
import { getArcadeText } from './arcade-message.js';
import { eventBus } from './core/eventBus.js';
import { InfoBar } from './components/infoBar.js';
import { arcadeSpriteLoader } from './arcade-sprite-loader.js';
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
import { recordOperationResult } from './core/operation-stats.js';
import {
  showGameInstructions,
  getCanvasFont,
  prepareArcadeStage,
  getArcadeCanvasBox,
  clientToCanvasPoint,
  readableCanvasFontSize,
} from './arcade-common.js';
import { UserState } from './core/userState.js';
import { pickRandom, shuffleInPlace } from './core/random.js';
// Utilise les helpers arcades via window (arcade.js expose des ponts globaux)

// Constants for canvas dimensions
const baseWidth = 800;
const baseHeight = 600;
// Couleur de l'espace derrière les monstres (dessin du jeu)
const SPACE_COLOR = '#000';
// Textes de repli tant que les traductions manquent (espaces insécables avant « : » et « ! »)
const INVADERS_INSTRUCTION_FALLBACK =
  'Tire sur les mauvaises réponses. Ne tire pas sur la bonne\u00a0: elle cache un ami à libérer\u00a0!';
const AVATAR_ERROR_FALLBACK = 'Oups\u00a0! Ne tire pas sur la bonne réponse.';
// La consigne reste le temps de la lire (règle inhabituelle : ne pas tirer sur la bonne)
const INVADERS_INSTRUCTION_MS = 8000;

function initializeInvadersGame() {
  try {
    stopArcadeMode();
  } catch {
    // Erreur ignorée (non-critique)
  }

  try {
    // Même nom que dans le menu (ArcadeMode) et que la liste d'arrêt de js/slides.js :
    // quitter la partie par « Accueil » arrête bien le jeu et ses touches
    globalGameState.gameMode = 'invasion';
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
  // Les valeurs qui changent pendant la partie (score, image de l'ami) sont lues au
  // moment du clic : passées par valeur au lancement, « Abandonner » enregistrait 0
  return function (autoRestartTimeout, spaceshipImg, getLiveState, handleSpaceDown) {
    document.getElementById('arcade-abandon-btn').addEventListener('click', function () {
      const { score, avatarImg } = getLiveState();
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

/**
 * Taille du plateau : la plus grande qui tient dans la zone de jeu, avec ses proportions
 * (plus haut que large sur téléphone, pour laisser le temps de viser). La taille interne
 * est la taille affichée : pas de bandes, le pointeur tombe là où l'enfant vise.
 * @param {HTMLCanvasElement} canvas
 */
function calculateCanvasDimensions(canvas) {
  const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(globalThis.navigator?.userAgent || '');
  const ratio = isMobile ? 1.5 : baseHeight / baseWidth; // hauteur / largeur
  const box = getArcadeCanvasBox(canvas);
  let displayWidth = Math.floor(box.width);
  let displayHeight = Math.floor(displayWidth * ratio);
  if (displayHeight > box.height) {
    displayHeight = Math.floor(box.height);
    displayWidth = Math.floor(displayHeight / ratio);
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

function createSpaceshipSprite(selectedState) {
  const playerAvatar = selectedState?.avatar ?? 'fox';
  const spaceshipFile =
    selectedState?.selectedSpaceship || `spaceship_${playerAvatar}.png|spaceship_default.png`;
  const [mainFile, rawFallbackFile] = spaceshipFile.split('|');

  const sanitizeSpriteName = fileName => (fileName || '').trim().replace(/\.png$/i, '');
  const mainSpriteName = sanitizeSpriteName(mainFile) || 'spaceship_default';

  let fallbackSpriteName = null;
  if (rawFallbackFile?.trim() && rawFallbackFile !== mainFile) {
    fallbackSpriteName = sanitizeSpriteName(rawFallbackFile);
  } else if (mainSpriteName !== 'spaceship_default') {
    fallbackSpriteName = 'spaceship_default';
  }

  const loaderInstance = arcadeSpriteLoader?.loader;
  const spriteContext = 'ui';
  const createSpriteSource = spriteName => {
    if (!spriteName) return null;
    const normalized = sanitizeSpriteName(spriteName);
    const basePath = `assets/images/arcade/${normalized}.png`;
    let optimizedUrl = basePath;

    try {
      const optimalSize = loaderInstance?.calculateOptimalSize?.(spriteContext);
      if (optimalSize && loaderInstance?.getOptimalImageUrl) {
        optimizedUrl = loaderInstance.getOptimalImageUrl(basePath, optimalSize);
      }
    } catch (error) {
      console.warn(`[Arcade] Impossible d'optimiser le sprite ${normalized}`, error);
    }

    return {
      name: normalized,
      basePath,
      optimizedUrl,
    };
  };

  const spaceshipSources = {
    primary: createSpriteSource(mainSpriteName),
    fallback:
      fallbackSpriteName && fallbackSpriteName !== mainSpriteName
        ? createSpriteSource(fallbackSpriteName)
        : null,
  };

  const spaceshipImg = new Image();
  spaceshipImg.decoding = 'async';

  let activeSpriteKey = 'primary';
  let attemptedOptimizedRecovery = false;
  let fallbackApplied = false;

  const assignSpriteSource = key => {
    const source = spaceshipSources[key];
    if (!source) return false;
    activeSpriteKey = key;
    attemptedOptimizedRecovery = false;
    spaceshipImg.src = source.optimizedUrl || source.basePath;
    return true;
  };

  const canRetryWithBaseSource = source => {
    if (attemptedOptimizedRecovery) return false;
    const optimizedUrl = source?.optimizedUrl;
    if (!optimizedUrl) return false;
    return optimizedUrl !== source?.basePath;
  };

  const tryRecoverFromOptimizedFailure = source => {
    if (!canRetryWithBaseSource(source)) {
      return false;
    }

    attemptedOptimizedRecovery = true;
    spaceshipImg.src = source.basePath;
    return true;
  };

  const tryApplyFallbackSprite = () => {
    const fallbackSource = spaceshipSources.fallback;
    if (activeSpriteKey !== 'primary' || !fallbackSource || fallbackApplied) {
      return false;
    }

    fallbackApplied = true;
    const fallbackName = fallbackSource.name ?? 'spaceship_default';
    console.info(
      `[Arcade] Image du vaisseau personnalisée non trouvée, utilisation de "${fallbackName}" en secours.`
    );
    assignSpriteSource('fallback');
    return true;
  };

  spaceshipImg.onerror = function handleSpaceshipError() {
    const source = spaceshipSources[activeSpriteKey];
    if (tryRecoverFromOptimizedFailure(source)) {
      return;
    }

    if (tryApplyFallbackSprite()) {
      return;
    }

    console.error(
      `[Arcade] Impossible de charger le sprite de vaisseau "${source?.name ?? 'inconnu'}".`
    );
  };

  assignSpriteSource('primary');

  return spaceshipImg;
}

export function startMultiplicationInvasion() {
  const gameVars = initializeInvadersGame();
  const difficultySettings = setupGameUI();

  // Récupérer l'opérateur sélectionné (support multi-opérations R4)
  const userData = UserState.getCurrentUserData();
  const operator = userData.preferredOperator || '×';

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
  // Haut de page, zone de jeu sans hauteur imposée, consigne sous le plateau :
  // la place du plateau se calcule ensuite, consigne comprise
  prepareArcadeStage(canvas);
  showGameInstructions(
    canvas,
    getArcadeText('multiinvaders_instruction', INVADERS_INSTRUCTION_FALLBACK),
    'neutral',
    INVADERS_INSTRUCTION_MS
  );
  const { displayWidth, displayHeight, isMobile } = calculateCanvasDimensions(canvas);

  canvas.width = displayWidth;
  canvas.height = displayHeight;
  canvas.style.width = displayWidth + 'px';
  canvas.style.height = displayHeight + 'px';

  // Ajout de la classe pour appliquer les styles communs
  canvas.classList.add('arcade-canvas');
  // Ciel du jeu (art) : visible aussi dans les bandes quand l'écran est plus large que le dessin
  canvas.style.backgroundColor = SPACE_COLOR;

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
  const spaceshipImg = createSpaceshipSprite(globalGameState);
  let spaceshipLoaded = false;
  let imagesLoaded = false;
  // Nombre d'images à charger
  spaceshipImg.onload = function () {
    spaceshipLoaded = true;
    if (spaceshipLoaded && monsterSpritesLoaded) imagesLoaded = true;
  };

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
    const spriteName = name.replace(/\.png$/, '');
    return arcadeSpriteLoader.loadSpriteSync(spriteName, 'monster');
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

  // Tir : la balle part du milieu de la fusée (voir shoot()) ; ces fonctions placent la
  // fusée pour que la balle parte exactement sous le point visé
  const bulletOffset = () => player.width / 2 - 2.5;
  function aimAt(canvasX) {
    const x = canvasX - bulletOffset();
    player.x = Math.max(5, Math.min(canvas.width - player.width - 5, x));
  }

  // Monstre dont l'enfant a touché la colonne : toute la largeur dessinée du monstre,
  // plus la moitié de l'écart de chaque côté (pas de zone morte entre deux colonnes)
  function findAlienColumn(canvasX) {
    const margin = (spacing || 0) / 2;
    return aliens.find(
      alien => canvasX >= alien.x - margin && canvasX <= alien.x + alienWidth + margin
    );
  }

  // Toucher : la fusée se place sous le monstre de la colonne touchée (ou sous le doigt)
  // et tire aussitôt. Les coordonnées tiennent compte de l'affichage réel du canevas.
  canvas.addEventListener(
    'touchstart',
    e => {
      e.preventDefault(); // Pas de zoom ni de clic simulé
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Geste à plusieurs doigts : pas de visée, un simple tir
      if (e.touches.length === 1 && e.touches[0]) {
        const touch = e.touches[0];
        const point = clientToCanvasPoint(canvas, touch.clientX, touch.clientY);
        const target = findAlienColumn(point.x);
        aimAt(target ? target.x + alienWidth / 2 : point.x);
      }
      shoot();
    },
    { passive: false }
  );
  // Glisser dans la moitié basse : la fusée suit le doigt
  canvas.addEventListener(
    'touchmove',
    e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const touch = e.touches[0];
      if (!touch) return;
      const point = clientToCanvasPoint(canvas, touch.clientX, touch.clientY);
      if (point.y > canvas.height / 2) aimAt(point.x);
    },
    { passive: false }
  );

  // Ajouter touchend pour s'assurer que les événements ne se propagent pas
  canvas.addEventListener(
    'touchend',
    e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      // Ne pas faire d'action spécifique, juste empêcher la propagation
    },
    { passive: false }
  );

  // Avatars
  // Liste d'avatars disponibles (chargés lors de la libération aléatoire)

  // Taille des monstres et écart entre eux, selon la largeur du plateau
  function layoutAliens(nbAliens) {
    // Marge de sécurité sur les bords pour éviter les monstres coupés
    const safeMargin = 20;
    const availableWidth = displayWidth - safeMargin * 2;
    if (isMobile) {
      // Petits écrans : monstres et écarts réduits, tous entièrement visibles
      alienWidth = Math.min(70, availableWidth / nbAliens - 10);
      spacing = Math.max(
        10,
        Math.min(20, (availableWidth - nbAliens * alienWidth) / (nbAliens - 1))
      );
    } else {
      alienWidth = Math.max(70, Math.min(100, availableWidth / nbAliens - 15));
      spacing = Math.max(
        20,
        Math.min(50, (availableWidth - nbAliens * alienWidth) / (nbAliens - 1))
      );
    }
  }

  function generateProblem() {
    // reset flag (variable supprimée)
    // Génération des questions selon le niveau de difficulté (Cascade 2025)
    // Récupération des paramètres de difficulté

    // Appliquer l'exclusion globale de tables (uniquement pour multiplication)
    const currentUser = UserManager.getCurrentUser();
    const excluded =
      operator === '×' && TablePreferences.isGlobalEnabled(currentUser)
        ? TablePreferences.getActiveExclusions(currentUser)
        : [];

    const q = generateQuestion({
      type: 'mcq',
      operator, // Support multi-opérations (+, −, ×, ÷)
      difficulty: globalGameState?.difficulty || 'moyen',
      tables: operator === '×' ? difficultySettings.tables : undefined,
      excludeTables: operator === '×' ? excluded : [],
      distractorDistance: difficultySettings.distractorDistance,
    });
    currentProblem.a = q.a;
    currentProblem.b = q.b;
    const correctAnswer = q.answer;
    aliens = [];
    const nbAliens = 5;
    // Sélection unique de sprites pour cette vague, sans répétition inter-vagues
    if (availableMonsterSprites.length < nbAliens) {
      availableMonsterSprites = monsterSprites.slice();
    }
    const shuffledPool = shuffleInPlace(availableMonsterSprites);

    const spritesForWave = shuffledPool.slice(0, nbAliens);
    // Retirer les sprites utilisées du pool
    availableMonsterSprites = availableMonsterSprites.filter(s => !spritesForWave.includes(s));
    layoutAliens(nbAliens);
    const totalWidth = nbAliens * alienWidth + (nbAliens - 1) * spacing;
    const startX = (displayWidth - totalWidth) / 2;
    const options = [correctAnswer];
    while (options.length < nbAliens) {
      // Génération des distracteurs selon le niveau de difficulté (Cascade 2025)
      // Réutilisation des paramètres de difficulté + support multi-opérations
      const wrong = generateQuestion({
        type: 'mcq',
        operator, // Support multi-opérations (+, −, ×, ÷)
        difficulty: globalGameState?.difficulty || 'moyen',
        tables: operator === '×' ? difficultySettings.tables : undefined,
        distractorDistance: difficultySettings.distractorDistance,
      }).answer;
      if (!options.includes(wrong)) options.push(wrong);
    }
    shuffleInPlace(options);
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
        questionSpan.textContent = `${currentProblem.a} ${operator} ${currentProblem.b} = ?`;
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
  setupAbandonButtonHandler(
    autoRestartTimeout,
    spaceshipImg,
    () => ({ score, avatarImg }),
    handleSpaceDown
  );

  function createExplosion(x, y) {
    explosions.push({ x: x, y: y, radius: 1, maxRadius: 30, color: '#ffff00' });
  }

  function updatePlayerPosition(step) {
    if (arcadeControls.leftPressed) player.x -= player.speed * step;
    if (arcadeControls.rightPressed) player.x += player.speed * step;
    player.x = Math.max(
      64 * (displayWidth / baseWidth),
      Math.min(canvas.width - 64 * (displayWidth / baseWidth), player.x)
    );
  }

  // Helper function to compute correct answer based on operator
  const computeCorrectAnswer = (op, a, b) => {
    switch (op) {
      case '+':
        return a + b;
      case '−':
        return a - b;
      case '÷':
        return a / b;
      case '×':
      default:
        return a * b;
    }
  };

  // Point du plateau où poser la pastille de points : au-dessus du monstre touché
  function alienPoint(alien) {
    return { x: alien.x + alienWidth / 2, y: Math.max(0, alien.y - 0.5 * alienWidth) };
  }

  function handleWrongAlienHit(bIndex, aIndex) {
    if (!isArcadeActive()) return;
    score += 100;
    if (typeof showArcadePoints === 'function') {
      showArcadePoints(100, canvas, alienPoint(aliens[aIndex]));
    }
    refreshInfoBar();

    bullets.splice(bIndex, 1);

    aliens.splice(aIndex, 1);
  }

  function handleCorrectAlienHit(alien, bIndex) {
    if (!isArcadeActive()) return;
    bullets.splice(bIndex, 1);
    // Tir absorbé pendant que l'ami apparaît : une seule erreur ne coûte qu'une vie
    if (avatarErrorAnim > 0) return;

    recordOperationResult(operator, currentProblem.a, currentProblem.b, false);
    // La pastille montre les points vraiment retirés (50, 75 ou 100 selon le niveau)
    const removed = Math.min(score, difficultySettings.penalty);
    score -= removed;
    showArcadePenalty(removed, canvas, alienPoint(alien));
    lives--;
    refreshInfoBar();

    // Un seul message, posé sur le jeu et en ton neutre : il dit ce qui s'est passé
    // (la vie perdue se voit aux cœurs). Il est lu à voix haute si la voix est active ;
    // le son de la mauvaise réponse vient de la pastille.
    showArcadeMessage('arcade_avatar_error', 'neutral', 1800, AVATAR_ERROR_FALLBACK);

    // L'ami caché dans la bonne réponse apparaît un instant
    avatarErrorAnim = 24;
    const possibleAvatars = ['panda', 'fox', 'astronaut', 'unicorn', 'dragon'].filter(
      a => a !== (globalGameState?.avatar ?? 'fox')
    );
    const randomAvatar = pickRandom(possibleAvatars);
    const spriteName = `${randomAvatar}_right_128x128`;
    avatarErrorImg = arcadeSpriteLoader.loadSpriteSync(spriteName, 'ui');
    avatarErrorX = alien.x;
    avatarErrorY = alien.y;
    avatarErrorW = alienWidth;
    avatarErrorH = alienWidth;
    avatarErrorPulse = 0;
  }

  function updateBullets(step) {
    bullets.forEach((bullet, bIndex) => {
      bullet.y -= 7 * step;

      aliens.forEach((alien, aIndex) => {
        if (
          bullet.x > alien.x &&
          bullet.x < alien.x + alienWidth &&
          bullet.y > alien.y &&
          bullet.y < alien.y + alienWidth
        ) {
          createExplosion(alien.x + alienWidth / 2, alien.y + alienWidth / 2);
          const correctVal = computeCorrectAnswer(operator, currentProblem.a, currentProblem.b);
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
      // Une vie perdue n'est pas une faute grave : ton neutre, jamais rouge
      showArcadeMessage('arcade_life_lost', 'neutral');
      if (lives > 0) generateProblem();
    }
  }

  function handleAvatarTransformation() {
    const correctAnswer = computeCorrectAnswer(operator, currentProblem.a, currentProblem.b);

    if (aliens.length === 1 && aliens[0].value === correctAnswer && !showingAvatar && lives > 0) {
      recordOperationResult(operator, currentProblem.a, currentProblem.b, true);
      showingAvatar = true;

      const avatarKeys = ['panda', 'fox', 'astronaut', 'unicorn', 'dragon'];
      const playerAvatar = globalGameState?.avatar ?? 'fox';
      const possibleAvatars = avatarKeys.filter(a => a !== playerAvatar);

      const liberatedAvatar = pickRandom(possibleAvatars);

      const liberatedSpriteName = `${liberatedAvatar}_right_128x128`;
      avatarImg = arcadeSpriteLoader.loadSpriteSync(liberatedSpriteName, 'ui');
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

      const msg = pickRandom(congratsMessages);
      speak(msg);
    }
  }

  // Les vitesses sont données par image à 60 images/s : sur un écran à 120 ou 180 Hz,
  // le jeu irait deux ou trois fois plus vite. Chaque mise à jour avance donc selon le
  // temps réellement écoulé (borné pour éviter un saut après une pause).
  const FRAME_MS = 1000 / 60;
  let lastFrameTime = 0;
  function frameStep(now) {
    const elapsed = lastFrameTime ? now - lastFrameTime : FRAME_MS;
    lastFrameTime = now;
    return Math.min(3, Math.max(0.25, elapsed / FRAME_MS));
  }

  function update(step = 1) {
    if (!isArcadeActive()) return;
    if (gameOver) return;
    if (showingAvatar) return;

    updatePlayerPosition(step);
    aliens.forEach(alien => (alien.y += alien.speed * step));
    updateBullets(step);
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
      // L'ami caché apparaît dans un cercle clair : une erreur n'est jamais rouge
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#fff';
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
      // Nombres lisibles : au moins 16 px à l'écran, même sur un petit téléphone
      const fontSize = readableCanvasFontSize(canvas, alienWidth * 0.28);
      aliens.forEach(alien => {
        if (imagesLoaded) {
          ctx.drawImage(alien.sprite, alien.x, alien.y, alienWidth, alienWidth);
        } else {
          ctx.fillStyle = alien.color;
          ctx.fillRect(alien.x, alien.y, alienWidth, alienWidth);
        }
        drawAlienLabel(alien, fontSize);
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

  // Pastille claire derrière le nombre, à la taille du texte (1 à 3 chiffres)
  function drawAlienLabel(alien, fontSize) {
    const label = String(alien.value);
    ctx.font = getCanvasFont(fontSize);
    const pillH = fontSize * 1.3;
    const pillW = Math.max(pillH, ctx.measureText(label).width + fontSize * 0.7);
    const cx = alien.x + alienWidth / 2;
    const cy = Math.max(pillH / 2 + 2, alien.y - 0.28 * alienWidth);
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(cx - pillW / 2, cy - pillH / 2, pillW, pillH, pillH / 2);
    } else {
      ctx.rect(cx - pillW / 2, cy - pillH / 2, pillW, pillH);
    }
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, cx, cy + fontSize * 0.05);
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  function refreshInfoBar() {
    updateInfoBar({ score: score, lives: lives, streak: null, progress: null }, 'multiinvaders');
    updateMultiplicationDisplay();
  }

  function gameLoop(now = globalThis.performance?.now?.() ?? Date.now()) {
    update(frameStep(now));
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

  // Souris : la balle part exactement sous le curseur, quelle que soit la taille
  // d'affichage du canevas (bandes comprises)
  canvas.addEventListener('mousemove', e => {
    if (isMobile) return;
    aimAt(clientToCanvasPoint(canvas, e.clientX, e.clientY).x);
  });

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
}

// No global export; ES module named export is used by ArcadeMode and retry button

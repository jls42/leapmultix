/* =====================
   Fonctions communes pour les jeux d'arcade (ESM)
   - Fonctions partagées par tous les jeux arcade pour une cohérence d'interface
   ===================== */

// Durée du fondu de sortie de la consigne : suit le jeton --dur-slow (css/themes.css)
const INSTRUCTIONS_FADE_MS = 320;
// Durée d'affichage de la consigne, sauf demande du jeu
export const INSTRUCTIONS_MS = 5000;
const INSTRUCTION_TONES = new Set(['neutral', 'success', 'warning']);
// Où poser la consigne sur le plateau (css/arcade.css) : en bas, ou au milieu quand elle y
// cache moins (vaisseau de MultiInvaders en bas, rangées de cartes de MultiMemory)
const INSTRUCTION_PLACEMENTS = new Set(['bottom', 'middle']);
// Zone de jeu créée par le gabarit commun (js/components/infoBar.js)
const STAGE_SELECTOR = '.arcade-game-ui';
// Ancien conteneur, gardé pour les intégrations qui l'utiliseraient encore
const LEGACY_STAGE_SELECTOR = '.arcade-game-container';
// Minuteries de la consigne en cours, pour qu'un nouvel affichage ne soit pas masqué par l'ancien
const instructionTimers = new WeakMap();
// Surveillance du plateau tant que la consigne est posée dessus
const instructionObservers = new WeakMap();

/**
 * Événement de la zone de jeu quand la place du plateau change sans que l'écran change
 * (le bouton plein écran arrive dans le bandeau) : le plateau se recalcule
 * (watchArcadeViewport).
 */
export const STAGE_CHANGE_EVENT = 'arcade:stagechange';

function notifyStageChange(stage) {
  stage?.dispatchEvent(new Event(STAGE_CHANGE_EVENT));
}

/** Taille minimale des nombres à lire dans les jeux (DESIGN.md : 16 px au moins) */
export const MIN_CANVAS_TEXT_PX = 16;

/**
 * Zone de jeu qui contient le canevas.
 * @param {HTMLCanvasElement} canvas
 * @returns {HTMLElement|null}
 */
function findStage(canvas) {
  if (!canvas || typeof canvas.closest !== 'function') return null;
  return canvas.closest(STAGE_SELECTOR) || canvas.closest(LEGACY_STAGE_SELECTOR);
}

function clearInstructionTimers(element) {
  const timers = instructionTimers.get(element);
  if (!timers) return;
  timers.forEach(id => clearTimeout(id));
  instructionTimers.delete(element);
}

/**
 * Donne à la zone de jeu la place du plateau (haut, hauteur, largeur, cadre compris) :
 * css/arcade.css y pose la consigne.
 * @param {HTMLElement} stage
 * @param {HTMLCanvasElement} canvas
 */
function shareBoardPlace(stage, canvas) {
  stage.style.setProperty('--arcade-board-top', `${canvas.offsetTop}px`);
  stage.style.setProperty('--arcade-board-height', `${canvas.offsetHeight}px`);
  stage.style.setProperty('--arcade-board-width', `${canvas.offsetWidth}px`);
}

/**
 * La consigne suit le plateau tant qu'elle est affichée : au lancement, il peut être
 * dimensionné après elle, puis changer (téléphone tourné, plein écran).
 * @param {HTMLElement} element - La consigne
 * @param {HTMLElement} stage
 * @param {HTMLCanvasElement} canvas
 */
function followBoard(element, stage, canvas) {
  shareBoardPlace(stage, canvas);
  if (instructionObservers.has(element) || typeof ResizeObserver !== 'function') return;
  const observer = new ResizeObserver(() => shareBoardPlace(stage, canvas));
  observer.observe(canvas);
  instructionObservers.set(element, observer);
}

function stopFollowingBoard(element) {
  const observer = instructionObservers.get(element);
  if (!observer) return;
  observer.disconnect();
  instructionObservers.delete(element);
}

/**
 * Affiche la consigne d'un jeu, puis l'efface.
 * Elle est posée sur le plateau (sur un téléphone tourné, à côté) et laisse passer le doigt :
 * elle ne lui prend aucune place, il garde donc sa taille du premier au dernier instant de
 * la partie. L'apparence vient de css/arcade.css (.game-instructions et ses tons).
 * @param {HTMLCanvasElement} canvas - Canvas du jeu
 * @param {string} message - Consigne déjà traduite
 * @param {string} [tone='neutral'] - neutral | success | warning
 * @param {number} [duration=INSTRUCTIONS_MS] - Durée d'affichage en millisecondes
 * @param {string} [placement='bottom'] - bottom | middle : où la poser sur le plateau, là où
 *   elle cache le moins au départ
 * @returns {HTMLElement|undefined} L'élément de consigne
 */
export function showGameInstructions(
  canvas,
  message,
  tone = 'neutral',
  duration = INSTRUCTIONS_MS,
  placement = 'bottom'
) {
  if (!canvas) return;

  const gameContainer = findStage(canvas);
  if (!gameContainer) return;

  // Une seule consigne par zone de jeu
  let instructionsElement = gameContainer.querySelector('.game-instructions');
  if (!instructionsElement) {
    instructionsElement = document.createElement('div');
    instructionsElement.setAttribute('role', 'status');
    // Juste après le canevas, avant le bouton « Abandonner » (ordre de lecture)
    canvas.after(instructionsElement);
  }

  clearInstructionTimers(instructionsElement);
  const safeTone = INSTRUCTION_TONES.has(tone) ? tone : 'neutral';
  instructionsElement.className = `game-instructions game-instructions--${safeTone}`;
  instructionsElement.dataset.placement = INSTRUCTION_PLACEMENTS.has(placement)
    ? placement
    : 'bottom';
  instructionsElement.hidden = false;
  followBoard(instructionsElement, gameContainer, canvas);

  // Ajouter le message d'instruction sans innerHTML
  while (instructionsElement.firstChild)
    instructionsElement.removeChild(instructionsElement.firstChild);
  const p = document.createElement('p');
  p.textContent = message;
  instructionsElement.appendChild(p);

  // Faire disparaître le message après la durée spécifiée
  instructionsElement.classList.remove('is-leaving');
  const fadeTimer = setTimeout(() => {
    instructionsElement.classList.add('is-leaving');
    const hideTimer = setTimeout(() => {
      instructionsElement.hidden = true;
      instructionTimers.delete(instructionsElement);
      stopFollowingBoard(instructionsElement);
    }, INSTRUCTIONS_FADE_MS);
    instructionTimers.set(instructionsElement, [hideTimer]);
  }, duration);
  instructionTimers.set(instructionsElement, [fadeTimer]);

  return instructionsElement;
}

// Plus de pont global: importer showGameInstructions via ESM

/* =====================
   Zone de jeu : haut de page et place du canevas
   - Au lancement, la page revient en haut (le menu a pu être défilé).
   - Le canevas est dimensionné pour tenir dans l'écran, sous le bandeau, avec
     « Abandonner » (à côté du plateau sur un téléphone tourné) : la page ne déborde plus.
     La consigne, posée sur le plateau, ne lui prend pas de place.
   - Chaque jeu choisit sa grille au lancement ; ensuite, seul l'affichage suit l'écran
     (rotation, plein écran) : la partie ne change pas.
   ===================== */

// Éléments posés par-dessus le jeu (messages, points) : ils ne prennent pas de place
const OVERLAY_POSITIONS = new Set(['absolute', 'fixed']);
// Sens de la zone de jeu, donné par css/arcade.css : « row » quand la consigne et
// « Abandonner » passent à côté du plateau (téléphone tourné)
const STAGE_FLOW_PROPERTY = '--arcade-stage-flow';

function toPx(value) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Épaisseurs d'un côté à l'autre (bordure, marge intérieure ou extérieure).
 * @param {CSSStyleDeclaration|null} style
 * @param {'border'|'padding'|'margin'} kind
 * @returns {{top: number, right: number, bottom: number, left: number}}
 */
function edges(style, kind) {
  if (!style) return { top: 0, right: 0, bottom: 0, left: 0 };
  if (kind === 'border') {
    return {
      top: toPx(style.borderTopWidth),
      right: toPx(style.borderRightWidth),
      bottom: toPx(style.borderBottomWidth),
      left: toPx(style.borderLeftWidth),
    };
  }
  if (kind === 'padding') {
    return {
      top: toPx(style.paddingTop),
      right: toPx(style.paddingRight),
      bottom: toPx(style.paddingBottom),
      left: toPx(style.paddingLeft),
    };
  }
  return {
    top: toPx(style.marginTop),
    right: toPx(style.marginRight),
    bottom: toPx(style.marginBottom),
    left: toPx(style.marginLeft),
  };
}

/** Somme horizontale et verticale de plusieurs épaisseurs */
function sumEdges(...list) {
  return list.reduce((acc, e) => ({ x: acc.x + e.left + e.right, y: acc.y + e.top + e.bottom }), {
    x: 0,
    y: 0,
  });
}

function readStyle(element) {
  try {
    return element && typeof globalThis.getComputedStyle === 'function'
      ? globalThis.getComputedStyle(element)
      : null;
  } catch {
    return null;
  }
}

/**
 * Hauteur et largeur utiles de l'écran (barres d'outils mobiles déduites).
 * @returns {{width: number, height: number}}
 */
function getViewportSize() {
  const root = globalThis;
  const width = root.innerWidth || document.documentElement?.clientWidth || 800;
  const innerHeight = root.innerHeight || document.documentElement?.clientHeight || 600;
  const visualHeight = root.visualViewport?.height;
  const height = visualHeight ? Math.min(innerHeight, visualHeight) : innerHeight;
  return { width, height };
}

/**
 * Ramène la page (et les conteneurs qui défilent) tout en haut, sans animation.
 */
export function resetArcadeScroll() {
  const targets = [
    document.scrollingElement,
    document.documentElement,
    document.body,
    document.getElementById('slide4'),
    document.getElementById('game'),
  ];
  for (const el of targets) {
    if (el?.scrollTop) el.scrollTop = 0;
  }
}

/**
 * Prépare la zone de jeu avant que le jeu ne dimensionne son canevas.
 * Le gabarit commun (js/components/infoBar.js) fixe la zone à 80vh en ligne : ajoutée
 * au bandeau et à la barre du haut, cette hauteur faisait déborder la page. La zone
 * reprend la hauteur de son contenu ; getArcadeCanvasBox() donne la place du canevas.
 * @param {HTMLCanvasElement} canvas - Canevas du jeu (déjà dans la page)
 * @returns {HTMLElement|null} La zone de jeu
 */
export function prepareArcadeStage(canvas) {
  resetArcadeScroll();
  const stage = findStage(canvas);
  if (!stage) return null;
  for (const prop of ['height', 'min-height', 'margin-top', 'justify-content', 'align-items']) {
    stage.style.removeProperty(prop);
  }
  offerFullscreen(stage);
  return stage;
}

/**
 * Bouton plein écran dans le bandeau de la partie (js/arcade-fullscreen.js). Sans l'API
 * (iPhone, cadre sans permission), rien n'est chargé et aucun bouton n'apparaît.
 * @param {HTMLElement} stage - Zone de jeu
 */
function offerFullscreen(stage) {
  if (!document.fullscreenEnabled) return;
  import('./arcade-fullscreen.js')
    .then(module => {
      // Le bouton arrive après le calcul du plateau : la place est revue s'il l'a changée
      if (module.mountArcadeFullscreenButton(stage)) notifyStageChange(stage);
    })
    .catch(error => console.warn('[Arcade] Plein écran indisponible', error));
}

/**
 * Un enfant de la zone de jeu prend-il de la place sous le plateau ? La consigne jamais :
 * elle est posée sur le plateau (css/arcade.css), qui garde ainsi sa taille quand elle part.
 * @param {Element} el
 * @param {HTMLCanvasElement} canvas
 * @returns {boolean}
 */
function takesStageSpace(el, canvas) {
  if (el === canvas || el.hidden) return false;
  return !el.classList.contains('game-instructions');
}

/**
 * Hauteur occupée dans la zone de jeu par tout ce qui n'est pas le canevas
 * (« Abandonner »), écarts compris. Les messages posés par-dessus (position absolue)
 * ne comptent pas.
 */
function measureStageSiblings(stage, canvas, gap) {
  let total = 0;
  for (const el of stage.children) {
    if (!takesStageSpace(el, canvas)) continue;
    const style = readStyle(el);
    if (!style) continue;
    if (style.display === 'none' || OVERLAY_POSITIONS.has(style.position)) continue;
    const margin = edges(style, 'margin');
    total += el.getBoundingClientRect().height + margin.top + margin.bottom + gap;
  }
  return total;
}

/**
 * Largeur des colonnes posées à côté du plateau (grille de css/arcade.css sur un
 * téléphone tourné), écarts compris : toutes les colonnes sauf la première.
 * @param {CSSStyleDeclaration|null} stageStyle
 * @returns {number}
 */
function measureSideColumns(stageStyle) {
  const tracks = String(stageStyle?.gridTemplateColumns || '')
    .split(/\s+/)
    .map(toPx)
    .filter(size => size > 0);
  const gap = toPx(stageStyle?.columnGap);
  return tracks.slice(1).reduce((sum, size) => sum + size + gap, 0);
}

/**
 * Espace réservé sous la zone de jeu (marges et rembourrages des conteneurs). En plein
 * écran, les conteneurs restés dans la page ne comptent plus.
 */
function measureTrailingSpace(stage, stageStyle) {
  let trailing = edges(stageStyle, 'margin').bottom + edges(stageStyle, 'padding').bottom;
  const fullscreenRoot = document.fullscreenElement;
  for (const el of [stage.parentElement, stage.closest('.slide')]) {
    if (!el || el === stage || (fullscreenRoot && !fullscreenRoot.contains(el))) continue;
    const style = readStyle(el);
    trailing += edges(style, 'padding').bottom + edges(style, 'border').bottom;
  }
  return trailing;
}

/**
 * Cadre du canevas : bordure et marge intérieure. Pas ses marges extérieures : elles ne
 * servent qu'à le centrer (« auto »), et le navigateur les rend en pixels dès que le plateau
 * est plus étroit que la zone ; les compter l'empêcherait de regrandir.
 */
function canvasFrame(canvas) {
  const style = readStyle(canvas);
  return sumEdges(edges(style, 'border'), edges(style, 'padding'));
}

/**
 * Sens de la zone de jeu donné par la feuille de style (« row » sur un téléphone tourné).
 * @param {CSSStyleDeclaration|null} stageStyle
 * @returns {string}
 */
function stageFlow(stageStyle) {
  if (typeof stageStyle?.getPropertyValue !== 'function') return '';
  return String(stageStyle.getPropertyValue(STAGE_FLOW_PROPERTY)).trim();
}

/**
 * Défilement de la page et des conteneurs du jeu au-dessus de la zone : la partie se joue
 * page en haut, sa place se mesure donc comme si rien n'avait défilé (sinon un plateau
 * recalculé page défilée grandirait, et entretiendrait lui-même le défilement).
 * @param {HTMLElement} stage
 * @returns {number}
 */
function scrolledAbove(stage) {
  let offset = 0;
  for (let el = stage.parentElement; el; el = el.parentElement) offset += el.scrollTop || 0;
  return offset;
}

/**
 * Largeur intérieure de la zone de jeu et haut de son contenu, page en haut.
 * @returns {{width: number, top: number}}
 */
function stageContent(stage, stageStyle, view) {
  const padding = edges(stageStyle, 'padding');
  const top = stage.getBoundingClientRect().top + scrolledAbove(stage);
  return {
    width: (stage.clientWidth || view.width) - padding.left - padding.right,
    top: top + edges(stageStyle, 'border').top + padding.top,
  };
}

/**
 * Place prise par « Abandonner » (et la consigne sur un téléphone tourné) : à côté du
 * plateau sur un téléphone tourné (--arcade-stage-flow: row), dessous sinon.
 * @returns {{beside: number, below: number}}
 */
function measureStageOccupancy(stage, stageStyle, canvas) {
  if (stageFlow(stageStyle) === 'row') {
    return { beside: measureSideColumns(stageStyle), below: 0 };
  }
  const gap = toPx(stageStyle?.rowGap);
  return { beside: 0, below: measureStageSiblings(stage, canvas, gap) };
}

/**
 * Place disponible pour le dessin du canevas : largeur de la zone de jeu (moins la
 * colonne de côté sur un téléphone tourné), hauteur de l'écran sous le haut de la zone,
 * moins « Abandonner » et les marges. La consigne ne compte pas : elle est posée sur le
 * plateau, la place reste la même qu'elle soit affichée ou partie.
 * À appeler après prepareArcadeStage().
 * @param {HTMLCanvasElement} canvas
 * @param {{minWidth?: number, minHeight?: number}} [options]
 *   minHeight : plancher (160 px, encore jouable) : plus bas, la page défilerait sur un
 *   téléphone tourné, barre du haut comprise
 * @returns {{width: number, height: number}} En pixels CSS, cadre du canevas exclu
 */
export function getArcadeCanvasBox(canvas, { minWidth = 200, minHeight = 160 } = {}) {
  const view = getViewportSize();
  const stage = findStage(canvas) || canvas?.parentElement;
  if (!stage || !canvas) {
    return {
      width: Math.max(minWidth, Math.floor(view.width * 0.9)),
      height: Math.max(minHeight, Math.floor(view.height * 0.6)),
    };
  }
  const stageStyle = readStyle(stage);
  const frame = canvasFrame(canvas);
  const content = stageContent(stage, stageStyle, view);
  const { beside, below } = measureStageOccupancy(stage, stageStyle, canvas);
  const trailing = measureTrailingSpace(stage, stageStyle);

  const width = Math.floor(content.width - beside - frame.x);
  const height = Math.floor(view.height - content.top - below - trailing - frame.y);
  return { width: Math.max(minWidth, width), height: Math.max(minHeight, height) };
}

/* =====================
   Canevas à la densité de l'écran
   - Chaque jeu dessine en unités du jeu : la taille de son plateau (grille × case, ou
     taille choisie au lancement pour MultiInvaders). La taille interne du canevas suit sa
     taille affichée × la densité de l'écran, et une transformation ramène le dessin aux
     unités du jeu : le plateau est net sur un téléphone comme sur un écran 4K, sans rien
     changer aux positions, aux vitesses ni aux touchers (qui se convertissent en unités
     du jeu, plus bas).
   - Densité plafonnée à 3 : au-delà, rien ne se voit de plus à distance de jeu, et chaque
     image coûterait davantage (neuf fois plus de pixels à densité 3 qu'à densité 1). Côté
     plafonné à 4096 pixels : surface maximale d'un canevas sur Safari iOS (4096 × 4096) et
     taille de texture garantie des processeurs graphiques mobiles ; au-delà, un canevas
     peut rester blanc.
   ===================== */

export const MAX_PIXEL_RATIO = 3;
export const MAX_CANVAS_SIDE = 4096;
// Taille de chaque plateau en unités du jeu
const gameSizes = new WeakMap();

/** @returns {number} Densité de l'écran retenue, entre 1 et MAX_PIXEL_RATIO */
export function arcadePixelRatio() {
  const ratio = Number(globalThis.devicePixelRatio) || 1;
  return Math.min(MAX_PIXEL_RATIO, Math.max(1, ratio));
}

/**
 * Taille du plateau en unités du jeu (sa taille interne s'il n'en a pas reçu).
 * @param {HTMLCanvasElement} canvas
 * @returns {{width: number, height: number}}
 */
export function getArcadeCanvasSize(canvas) {
  return gameSizes.get(canvas) ?? { width: canvas?.width || 0, height: canvas?.height || 0 };
}

/**
 * Taille du plateau en unités du jeu, avant son affichage par fitArcadeCanvas.
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 */
export function setArcadeCanvasSize(canvas, width, height) {
  gameSizes.set(canvas, { width, height });
}

/**
 * Pixels internes du canevas par unité du jeu. Les ombres (shadowBlur, shadowOffsetX/Y) ne
 * suivent pas la transformation du contexte : elles se multiplient par ce facteur.
 * @param {HTMLCanvasElement} canvas
 * @returns {number}
 */
export function canvasPixelScale(canvas) {
  const { width } = getArcadeCanvasSize(canvas);
  return width > 0 && canvas.width > 0 ? canvas.width / width : 1;
}

/**
 * Taille interne pour un affichage donné (pixels CSS) : × la densité, côté plafonné. Changer
 * la taille d'un canevas remet son contexte à zéro : la transformation se repose à chaque fois.
 */
function renderAtDisplaySize(canvas, cssWidth, cssHeight) {
  const { width, height } = getArcadeCanvasSize(canvas);
  const ratio = Math.min(
    arcadePixelRatio(),
    MAX_CANVAS_SIDE / Math.max(1, cssWidth),
    MAX_CANVAS_SIDE / Math.max(1, cssHeight)
  );
  canvas.width = Math.max(1, Math.round(cssWidth * ratio));
  canvas.height = Math.max(1, Math.round(cssHeight * ratio));
  if (width > 0 && height > 0) {
    canvas.getContext('2d')?.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
  }
  // L'échelle d'affichage a changé : les nombres se recalculent dès la prochaine image
  displayScaleCache.delete(canvas);
}

/**
 * Plateau dont le dessin s'affiche à sa taille en unités du jeu (une unité = un pixel CSS) :
 * taille interne à la densité de l'écran. Le jeu pose la taille de l'élément (MultiMiam :
 * plus haut que son dessin, centré par object-fit).
 * @param {HTMLCanvasElement} canvas
 * @param {number} width - Unités du jeu, et pixels CSS du dessin affiché
 * @param {number} height
 */
export function renderArcadeCanvas(canvas, width, height) {
  setArcadeCanvasSize(canvas, width, height);
  renderAtDisplaySize(canvas, width, height);
}

/**
 * Plateau affiché à sa taille en unités du jeu (MultiSnake, MultiMemory) : élément et dessin
 * de cette taille en pixels CSS, taille interne à la densité de l'écran.
 * @param {HTMLCanvasElement} canvas
 * @param {number} width - Unités du jeu, et pixels CSS affichés
 * @param {number} height
 */
export function sizeArcadeCanvas(canvas, width, height) {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  renderArcadeCanvas(canvas, width, height);
}

/**
 * Affiche le canevas en entier dans la place donnée, sans changer sa taille en unités du jeu
 * (la partie, ses positions et ses vitesses restent les mêmes) ni ses proportions ; sa taille
 * interne suit l'affichage, à la densité de l'écran.
 * @param {HTMLCanvasElement} canvas
 * @param {{width: number, height: number}} box - Place (pixels CSS, cadre exclu)
 * @returns {number} Pixels CSS affichés par unité du jeu
 */
export function fitArcadeCanvas(canvas, box) {
  const size = getArcadeCanvasSize(canvas);
  // Premier affichage d'un canevas qui n'a reçu que sa taille interne : elle devient sa taille
  setArcadeCanvasSize(canvas, size.width, size.height);
  const scale = Math.min(box.width / size.width, box.height / size.height);
  const cssWidth = Math.max(1, Math.floor(size.width * scale));
  const cssHeight = Math.max(1, Math.floor(size.height * scale));
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  renderAtDisplaySize(canvas, cssWidth, cssHeight);
  return scale;
}

/**
 * Appelle `onChange` quand la place du plateau peut avoir changé : fenêtre redimensionnée
 * ou tournée, plein écran, bouton plein écran arrivé, bandeau qui change de hauteur.
 * Une seule fois par image ; la surveillance s'arrête d'elle-même quand le jeu a quitté la
 * page.
 * @param {HTMLCanvasElement} canvas
 * @param {() => void} onChange
 * @returns {() => void} Arrêt de la surveillance
 */
export function watchArcadeViewport(canvas, onChange) {
  const cleanups = [];
  let frame = 0;
  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    while (cleanups.length) cleanups.pop()();
  };
  const run = () => {
    frame = 0;
    if (canvas.isConnected) onChange();
    else stop();
  };
  const schedule = () => {
    if (!canvas.isConnected) stop();
    else if (!frame) frame = requestAnimationFrame(run);
  };
  const stage = findStage(canvas);
  const targets = [
    [globalThis, 'resize'],
    [globalThis.visualViewport, 'resize'],
    [document, 'fullscreenchange'],
    [stage, STAGE_CHANGE_EVENT],
  ];
  for (const [target, type] of targets) {
    if (!target) continue;
    target.addEventListener(type, schedule);
    cleanups.push(() => target.removeEventListener(type, schedule));
  }
  watchBannerSize(stage, schedule, cleanups);
  return stop;
}

/**
 * Le bandeau au-dessus du plateau change de hauteur (calcul affiché, police chargée,
 * langue) : la place du plateau aussi. Seul le bandeau est observé : sa taille ne dépend
 * pas du plateau, la mise à l'échelle ne peut pas relancer l'observation en boucle.
 * @param {HTMLElement|null} stage
 * @param {() => void} schedule
 * @param {Array<() => void>} cleanups
 */
function watchBannerSize(stage, schedule, cleanups) {
  const banner = stage?.parentElement?.querySelector('.arcade-mult-display');
  if (!banner || typeof ResizeObserver !== 'function') return;
  const observer = new ResizeObserver(schedule);
  observer.observe(banner);
  cleanups.push(() => observer.disconnect());
}

/* =====================
   Géométrie des canevas : du pointeur au dessin, et retour
   Le canevas peut être affiché à une autre taille que celle du jeu, avec des bandes
   (object-fit: contain), et sa taille interne suit la densité de l'écran : les jeux
   convertissent toujours par ces fonctions, en unités du jeu.
   ===================== */

/**
 * Position de l'image dans sa boîte selon object-position (centre par défaut).
 */
// Mots-clés d'alignement : part de l'espace libre laissée avant le dessin
const ALIGN_KEYWORDS = { left: 0, top: 0, right: 1, bottom: 1, center: 0.5 };

function alignOffset(free, token) {
  if (typeof token !== 'string' || !token) return free / 2;
  if (token.endsWith('%')) return (free * toPx(token)) / 100;
  if (token.endsWith('px')) return toPx(token);
  return free * (ALIGN_KEYWORDS[token] ?? 0.5);
}

/**
 * Taille du dessin dans sa boîte selon object-fit (le canevas n'est jamais rogné).
 */
function fittedSize(fit, boxW, boxH, intW, intH) {
  if (fit === 'none') return { width: intW, height: intH };
  if (fit === 'fill' || !fit) return { width: boxW, height: boxH };
  let scale =
    fit === 'cover' ? Math.max(boxW / intW, boxH / intH) : Math.min(boxW / intW, boxH / intH);
  if (fit === 'scale-down') scale = Math.min(1, scale);
  return { width: intW * scale, height: intH * scale };
}

/**
 * Rectangle réellement occupé par le dessin du canevas à l'écran.
 * @param {HTMLCanvasElement} canvas
 * @returns {{left: number, top: number, width: number, height: number, scaleX: number, scaleY: number}}
 *   left, top, width, height : en pixels CSS (coordonnées de la fenêtre) ;
 *   scaleX, scaleY : unités du jeu par pixel CSS.
 */
export function getCanvasContentRect(canvas) {
  const rect = canvas.getBoundingClientRect();
  const style = readStyle(canvas);
  const border = edges(style, 'border');
  const padding = edges(style, 'padding');
  const frame = sumEdges(border, padding);
  const boxW = Math.max(0, rect.width - frame.x);
  const boxH = Math.max(0, rect.height - frame.y);
  const size = getArcadeCanvasSize(canvas);
  const intW = size.width || boxW || 1;
  const intH = size.height || boxH || 1;
  const drawn = fittedSize(style?.objectFit, boxW, boxH, intW, intH);

  const [posX, posY] = String(style?.objectPosition || '50% 50%').split(/\s+/);
  const left = rect.left + border.left + padding.left + alignOffset(boxW - drawn.width, posX);
  const top = rect.top + border.top + padding.top + alignOffset(boxH - drawn.height, posY);
  return {
    left,
    top,
    width: drawn.width,
    height: drawn.height,
    scaleX: drawn.width > 0 ? intW / drawn.width : 1,
    scaleY: drawn.height > 0 ? intH / drawn.height : 1,
  };
}

/**
 * Point de la fenêtre (souris, doigt) → coordonnées du jeu (unités du jeu).
 * @param {HTMLCanvasElement} canvas
 * @param {number} clientX
 * @param {number} clientY
 * @returns {{x: number, y: number}}
 */
export function clientToCanvasPoint(canvas, clientX, clientY) {
  const r = getCanvasContentRect(canvas);
  return { x: (clientX - r.left) * r.scaleX, y: (clientY - r.top) * r.scaleY };
}

/**
 * Coordonnées du jeu (unités du jeu) → point de la fenêtre (pixels CSS).
 * @param {HTMLCanvasElement} canvas
 * @param {number} x
 * @param {number} y
 * @returns {{x: number, y: number}}
 */
export function canvasToClientPoint(canvas, x, y) {
  const r = getCanvasContentRect(canvas);
  return { x: r.left + x / r.scaleX, y: r.top + y / r.scaleY };
}

// L'échelle d'affichage est relue au plus deux fois par seconde (les jeux dessinent à 60 i/s)
const displayScaleCache = new WeakMap();
const DISPLAY_SCALE_CACHE_MS = 500;

/**
 * Pixels CSS affichés par unité du jeu (1 quand le plateau s'affiche à sa taille), quelle
 * que soit la densité de l'écran. Sert à garder des nombres lisibles quand l'écran réduit
 * le dessin.
 * @param {HTMLCanvasElement} canvas
 * @returns {number}
 */
/**
 * Échelle encore valable en cache pour ce canevas, sinon null.
 * @param {HTMLCanvasElement} canvas
 * @param {number} now
 * @returns {number|null}
 */
function cachedDisplayScale(canvas, now) {
  const cached = displayScaleCache.get(canvas);
  if (cached?.width !== canvas.width) return null;
  return now - cached.time < DISPLAY_SCALE_CACHE_MS ? cached.scale : null;
}

export function getCanvasDisplayScale(canvas) {
  if (!canvas || typeof canvas.getBoundingClientRect !== 'function') return 1;
  const now = Date.now();
  const enCache = cachedDisplayScale(canvas, now);
  if (enCache !== null) return enCache;
  const { width } = getCanvasContentRect(canvas);
  const gameWidth = getArcadeCanvasSize(canvas).width;
  const raw = gameWidth > 0 && width > 0 ? width / gameWidth : 1;
  const scale = Number.isFinite(raw) && raw > 0 ? raw : 1;
  displayScaleCache.set(canvas, { scale, time: now, width: canvas.width });
  return scale;
}

/* =====================
   Police des nombres dessinés dans les canvas
   - Même police que les calculs de l'application : jeton --font-display (Baloo 2)
   ===================== */
const CANVAS_FONT_FALLBACK = 'system-ui, sans-serif';
let canvasFontFamily = '';

/**
 * Famille de police des nombres dessinés, lue une fois dans la feuille de style.
 * @returns {string} Pile de polices CSS
 */
export function getCanvasFontFamily() {
  if (canvasFontFamily) return canvasFontFamily;
  let family = '';
  try {
    family = globalThis
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--font-display')
      .trim();
  } catch {
    family = '';
  }
  // Ne mémoriser que la vraie valeur : le repli sert tant que la feuille n'est pas lue
  if (family) canvasFontFamily = family;
  return family || CANVAS_FONT_FALLBACK;
}

/**
 * Valeur prête pour ctx.font : « 700 24px 'Baloo2', … ».
 * @param {number} sizePx - Taille en pixels
 * @param {number} [weight=700] - Graisse
 * @returns {string}
 */
export function getCanvasFont(sizePx, weight = 700) {
  return `${weight} ${Math.max(1, Math.round(sizePx))}px ${getCanvasFontFamily()}`;
}

/**
 * Taille de police (unités du jeu) qui s'affiche à au moins `minCssPx` pixels CSS,
 * même si l'écran réduit le canevas.
 * @param {HTMLCanvasElement} canvas
 * @param {number} sizePx - Taille voulue (unités du jeu)
 * @param {number} [minCssPx=MIN_CANVAS_TEXT_PX]
 * @returns {number}
 */
export function readableCanvasFontSize(canvas, sizePx, minCssPx = MIN_CANVAS_TEXT_PX) {
  const scale = getCanvasDisplayScale(canvas);
  return Math.max(sizePx, minCssPx / scale);
}

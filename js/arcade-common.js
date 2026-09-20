/* =====================
   Fonctions communes pour les jeux d'arcade (ESM)
   - Fonctions partagées par tous les jeux arcade pour une cohérence d'interface
   ===================== */

// Durée du fondu de sortie de la consigne : suit le jeton --dur-slow (css/themes.css)
const INSTRUCTIONS_FADE_MS = 320;
const INSTRUCTION_TONES = ['neutral', 'success', 'warning'];
// Zone de jeu créée par le gabarit commun (js/components/infoBar.js)
const STAGE_SELECTOR = '.arcade-game-ui';
// Ancien conteneur, gardé pour les intégrations qui l'utiliseraient encore
const LEGACY_STAGE_SELECTOR = '.arcade-game-container';
// Minuteries de la consigne en cours, pour qu'un nouvel affichage ne soit pas masqué par l'ancien
const instructionTimers = new WeakMap();

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
 * Affiche la consigne d'un jeu juste sous le canevas, puis l'efface.
 * Placée sous le plateau, elle ne cache rien du jeu, et sa disparition ne déplace
 * pas le canevas. L'apparence vient de css/arcade.css (.game-instructions et ses tons).
 * @param {HTMLCanvasElement} canvas - Canvas du jeu
 * @param {string} message - Consigne déjà traduite
 * @param {string} [tone='neutral'] - neutral | success | warning
 * @param {number} [duration=5000] - Durée d'affichage en millisecondes
 * @returns {HTMLElement|undefined} L'élément de consigne
 */
export function showGameInstructions(canvas, message, tone = 'neutral', duration = 5000) {
  if (!canvas) return;

  const gameContainer = findStage(canvas);
  if (!gameContainer) return;

  // Une seule consigne par zone de jeu
  let instructionsElement = gameContainer.querySelector('.game-instructions');
  if (!instructionsElement) {
    instructionsElement = document.createElement('div');
    instructionsElement.setAttribute('role', 'status');
    // Juste après le canevas, avant le bouton « Abandonner »
    canvas.after(instructionsElement);
  }

  clearInstructionTimers(instructionsElement);
  const safeTone = INSTRUCTION_TONES.includes(tone) ? tone : 'neutral';
  instructionsElement.className = `game-instructions game-instructions--${safeTone}`;
  instructionsElement.hidden = false;

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
   - Le canevas est dimensionné pour tenir dans l'écran, sous le bandeau, avec la
     consigne et « Abandonner » : la page ne déborde plus.
   ===================== */

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
    if (el && el.scrollTop) el.scrollTop = 0;
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
  return stage;
}

/**
 * Hauteur occupée dans la zone de jeu par tout ce qui n'est pas le canevas
 * (consigne, « Abandonner »), écarts compris. Les messages posés par-dessus
 * (position absolue) ne comptent pas.
 */
function measureStageSiblings(stage, canvas, gap) {
  let total = 0;
  for (const el of stage.children) {
    if (el === canvas || el.hidden) continue;
    const style = readStyle(el);
    if (!style) continue;
    if (style.display === 'none' || ['absolute', 'fixed'].includes(style.position)) continue;
    const margin = edges(style, 'margin');
    total += el.getBoundingClientRect().height + margin.top + margin.bottom + gap;
  }
  return total;
}

/**
 * Espace réservé sous la zone de jeu (marges et rembourrages des conteneurs).
 */
function measureTrailingSpace(stage, stageStyle) {
  let trailing = edges(stageStyle, 'margin').bottom + edges(stageStyle, 'padding').bottom;
  for (const el of [stage.parentElement, stage.closest('.slide')]) {
    if (!el || el === stage) continue;
    const style = readStyle(el);
    trailing += edges(style, 'padding').bottom + edges(style, 'border').bottom;
  }
  return trailing;
}

/**
 * Place disponible pour le dessin du canevas : largeur de la zone de jeu, hauteur de
 * l'écran sous le haut de la zone, moins la consigne, « Abandonner » et les marges.
 * À appeler après prepareArcadeStage() et après l'affichage de la consigne.
 * @param {HTMLCanvasElement} canvas
 * @param {{minWidth?: number, minHeight?: number}} [options]
 * @returns {{width: number, height: number}} En pixels CSS, cadre du canevas exclu
 */
export function getArcadeCanvasBox(canvas, { minWidth = 200, minHeight = 220 } = {}) {
  const view = getViewportSize();
  const stage = findStage(canvas) || canvas?.parentElement;
  if (!stage || !canvas) {
    return {
      width: Math.max(minWidth, Math.floor(view.width * 0.9)),
      height: Math.max(minHeight, Math.floor(view.height * 0.6)),
    };
  }
  const stageStyle = readStyle(stage);
  const canvasStyle = readStyle(canvas);
  const stagePadding = edges(stageStyle, 'padding');
  // Cadre du canevas : bordure, marge intérieure et extérieure
  const frame = sumEdges(
    edges(canvasStyle, 'border'),
    edges(canvasStyle, 'padding'),
    edges(canvasStyle, 'margin')
  );

  const innerWidth = (stage.clientWidth || view.width) - stagePadding.left - stagePadding.right;
  const contentTop =
    stage.getBoundingClientRect().top + edges(stageStyle, 'border').top + stagePadding.top;
  const below = measureStageSiblings(stage, canvas, toPx(stageStyle?.rowGap));
  const trailing = measureTrailingSpace(stage, stageStyle);

  const width = Math.floor(innerWidth - frame.x);
  const height = Math.floor(view.height - contentTop - below - trailing - frame.y);
  return { width: Math.max(minWidth, width), height: Math.max(minHeight, height) };
}

/* =====================
   Géométrie des canevas : du pointeur au dessin, et retour
   Le canevas peut être affiché plus petit que sa taille interne, et avec des bandes
   (object-fit: contain) : les jeux convertissent toujours par ces fonctions.
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
 *   scaleX, scaleY : pixels internes du canevas par pixel CSS.
 */
export function getCanvasContentRect(canvas) {
  const rect = canvas.getBoundingClientRect();
  const style = readStyle(canvas);
  const border = edges(style, 'border');
  const padding = edges(style, 'padding');
  const frame = sumEdges(border, padding);
  const boxW = Math.max(0, rect.width - frame.x);
  const boxH = Math.max(0, rect.height - frame.y);
  const intW = canvas.width || boxW || 1;
  const intH = canvas.height || boxH || 1;
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
 * Point de la fenêtre (souris, doigt) → coordonnées internes du canevas.
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
 * Coordonnées internes du canevas → point de la fenêtre (pixels CSS).
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
 * Pixels CSS affichés par pixel interne (1 quand le canevas n'est pas réduit).
 * Sert à garder des nombres lisibles quand l'écran réduit le dessin.
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
  if (!cached || cached.width !== canvas.width) return null;
  return now - cached.time < DISPLAY_SCALE_CACHE_MS ? cached.scale : null;
}

export function getCanvasDisplayScale(canvas) {
  if (!canvas || typeof canvas.getBoundingClientRect !== 'function') return 1;
  const now = Date.now();
  const enCache = cachedDisplayScale(canvas, now);
  if (enCache !== null) return enCache;
  const { width } = getCanvasContentRect(canvas);
  const raw = canvas.width > 0 && width > 0 ? width / canvas.width : 1;
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
 * Taille de police interne qui s'affiche à au moins `minCssPx` pixels CSS,
 * même si l'écran réduit le canevas.
 * @param {HTMLCanvasElement} canvas
 * @param {number} sizePx - Taille voulue (pixels internes)
 * @param {number} [minCssPx=MIN_CANVAS_TEXT_PX]
 * @returns {number}
 */
export function readableCanvasFontSize(canvas, sizePx, minCssPx = MIN_CANVAS_TEXT_PX) {
  const scale = getCanvasDisplayScale(canvas);
  return Math.max(sizePx, minCssPx / scale);
}

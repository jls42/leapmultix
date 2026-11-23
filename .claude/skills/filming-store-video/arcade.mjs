// Les six jeux d'Arcade, joués juste : chaque jeu se lit sur ce qu'il écrit et dessine sur son
// plateau (base.mjs), jamais dans son code.
import {
  BOARD,
  arcadeQuestion,
  arcadeScore,
  boardBox,
  boardImages,
  boardTexts,
  resultOf,
  swipe,
  tapAt,
  wait,
} from './base.mjs';

/** Note au journal un score qui monte (`gagne`) ou qui baisse (`perd`). */
async function noteScore(page, mark, run) {
  const now = await arcadeScore(page);
  if (now === run.score) return;
  mark(now > run.score ? 'gagne' : 'perd', { score: now });
  run.score = now;
}

/**
 * Une partie d'un jeu où l'on touche une réponse : `choose(question)` rend où toucher (ou
 * null), `gap` sépare deux gestes, `watch` note ce qu'il ne faudra pas montrer.
 */
export async function playArcade(page, mark, { seconds, gap, choose, watch }) {
  const until = Date.now() + seconds * 1000;
  const run = { score: await arcadeScore(page) };
  while (Date.now() < until) {
    if (watch) await watch();
    const q = await arcadeQuestion(page);
    const target = q.answer === null || q.solved ? null : await choose(q);
    if (target) {
      await tapAt(page, target.x, target.y, 90);
      mark('geste', { q: q.text, vers: target.t });
    }
    await wait(gap);
    await noteScore(page, mark, run);
  }
}

/** Le nombre de la bonne réponse, là où le plateau l'écrit. */
export async function rightAnswer(page, q) {
  const texts = await boardTexts(page);
  return texts.find(item => item.t === String(q.answer)) ?? null;
}

/** La mauvaise réponse la plus basse (MultiInvaders : on tire sur les mauvaises). */
export async function lowestWrongAnswer(page, q) {
  const texts = await boardTexts(page);
  const wrong = texts.filter(item => /^\d+$/.test(item.t) && item.t !== String(q.answer));
  return wrong.toSorted((a, b) => b.y - a.y)[0] ?? null;
}

/** Note `ami` quand une image du plateau répond à `isFriend` : le montage écarte ces instants. */
export function friendWatcher(page, mark, isFriend) {
  return async () => {
    const friend = (await boardImages(page, BOARD, 150)).find(image => isFriend(image.src));
    if (friend) mark('ami', { src: friend.src });
  };
}

/* --- MultiMiam : un labyrinthe --- */

// Un toucher ne fait que partir dans la direction du point visé : pour arriver à la bonne
// réponse il faut suivre les couloirs, donc glisser le doigt à chaque virage.

const STEPS = new Map([
  ['RIGHT', [1, 0]],
  ['LEFT', [-1, 0]],
  ['DOWN', [0, 1]],
  ['UP', [0, -1]],
]);
const cellKey = (x, y) => `${x},${y}`;
const isTile = image => /^(mur|chemin)-/.test(image.src);

/** La grille lue sur les tuiles « mur » et « chemin » que le jeu pose à chaque image. */
function gridOf(tiles) {
  const { w, h } = tiles[0];
  const minX = Math.min(...tiles.map(tile => tile.x));
  const minY = Math.min(...tiles.map(tile => tile.y));
  const spot = item => ({ fx: (item.x - minX) / w, fy: (item.y - minY) / h });
  const cellOf = item => ({ cx: Math.round(spot(item).fx), cy: Math.round(spot(item).fy) });
  const cells = tiles.map(tile => ({ ...cellOf(tile), wall: tile.src.startsWith('mur') }));
  return {
    spot,
    cellOf,
    cols: Math.max(...cells.map(cell => cell.cx)) + 1,
    rows: Math.max(...cells.map(cell => cell.cy)) + 1,
    walls: new Set(cells.filter(cell => cell.wall).map(cell => cellKey(cell.cx, cell.cy))),
  };
}

/** La dernière position de chaque image qui n'est pas une tuile (personnage, monstres). */
function latestSprites(images) {
  const latest = new Map();
  for (const image of images) {
    if (isTile(image)) continue;
    const known = latest.get(image.src);
    if (!known || image.at > known.at) latest.set(image.src, image);
  }
  return [...latest.values()];
}

/** MultiMiam lu sur son plateau : murs, personnage, monstres, réponses (en cases). */
async function miamState(page) {
  const images = await boardImages(page, BOARD, 250);
  const tiles = images.filter(isTile);
  if (tiles.length < 50) return null;
  const grid = gridOf(tiles);
  const sprites = latestSprites(images);
  const hero = sprites.find(image => !image.src.startsWith('monstre'));
  const texts = await boardTexts(page, BOARD, 250);
  return {
    ...grid,
    player: hero ? { ...grid.cellOf(hero), ...grid.spot(hero) } : null,
    monsters: sprites.filter(image => image.src.startsWith('monstre')).map(grid.cellOf),
    answers: texts
      .filter(item => /^\d+$/.test(item.t))
      .map(item => ({ t: item.t, ...grid.cellOf(item) })),
  };
}

function pathBack(from, key) {
  const path = [];
  for (let at = key; at; at = from.get(at)) path.unshift(at.split(',').map(Number));
  return path;
}

/** Plus court chemin en cases, du personnage à la réponse, hors des cases interdites. */
function miamPath(state, target, blocked) {
  const start = cellKey(state.player.cx, state.player.cy);
  const from = new Map([[start, null]]);
  const queue = [[state.player.cx, state.player.cy]];
  const inside = (x, y) => x >= 0 && y >= 0 && x < state.cols && y < state.rows;
  while (queue.length) {
    const [x, y] = queue.shift();
    if (x === target.cx && y === target.cy) return pathBack(from, cellKey(x, y));
    for (const [dx, dy] of STEPS.values()) {
      const key = cellKey(x + dx, y + dy);
      if (!inside(x + dx, y + dy) || blocked.has(key) || from.has(key)) continue;
      from.set(key, cellKey(x, y));
      queue.push([x + dx, y + dy]);
    }
  }
  return null;
}

/** Le chemin vers la bonne réponse : loin des monstres si possible, jamais sur une mauvaise. */
function miamRoute(state, answer) {
  const target = state.answers.find(item => item.t === String(answer));
  if (!target) return null;
  const others = state.answers.filter(item => item !== target);
  const hard = new Set([...state.walls, ...others.map(item => cellKey(item.cx, item.cy))]);
  const near = new Set(hard);
  for (const monster of state.monsters) {
    for (const [dx, dy] of [[0, 0], ...STEPS.values()]) {
      near.add(cellKey(monster.cx + dx, monster.cy + dy));
    }
  }
  near.delete(cellKey(target.cx, target.cy));
  return miamPath(state, target, near) ?? miamPath(state, target, hard);
}

function stepName(a, b) {
  const found = [...STEPS].find(([, [dx, dy]]) => b[0] - a[0] === dx && b[1] - a[1] === dy);
  return found?.[0];
}

/** Sens dans lequel le personnage avance entre deux relevés (null s'il est arrêté). */
function headingOf(before, player) {
  if (!before) return null;
  const dx = player.fx - before.fx;
  const dy = player.fy - before.fy;
  if (Math.abs(dx) <= 0.02 && Math.abs(dy) <= 0.02) return null;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'RIGHT' : 'LEFT';
  return dy > 0 ? 'DOWN' : 'UP';
}

/**
 * Direction à glisser maintenant : le premier tronçon ; puis, une fois lancé, le virage
 * suivant dès qu'aucune ouverture avant lui ne peut le faire prendre trop tôt (le jeu garde la
 * direction demandée et la prend à la première case où elle est libre).
 */
function miamWanted(state, path, heading) {
  const dirs = path.slice(1).map((cell, i) => stepName(path.at(i), cell));
  const first = dirs[0];
  if (heading !== first) return first;
  const run = dirs.findIndex(dir => dir !== first);
  if (run < 0) return null;
  const turn = dirs.at(run);
  const [tx, ty] = STEPS.get(turn);
  const [bx, by] = STEPS.get(first);
  const before = [[path[0][0] - bx, path[0][1] - by], ...path.slice(0, run)];
  const closed = before.every(([x, y]) => state.walls.has(cellKey(x + tx, y + ty)));
  return closed ? turn : null;
}

async function miamTick(page, mark, run) {
  const state = await miamState(page);
  const q = await arcadeQuestion(page);
  await noteScore(page, mark, run);
  if (!state?.player) return;
  const path = q.answer === null || q.solved ? null : miamRoute(state, q.answer);
  const wanted =
    path && path.length > 1 ? miamWanted(state, path, headingOf(run.before, state.player)) : null;
  run.before = state.player;
  if (!wanted || (wanted === run.sent && Date.now() - run.sentAt <= 700)) return;
  await swipe(page, run.thumb.x, run.thumb.y, wanted);
  mark('geste', { q: q.text, vers: wanted });
  run.sent = wanted;
  run.sentAt = Date.now();
}

/** Une partie de MultiMiam : le doigt glisse en bas à droite du labyrinthe. */
export async function playMiam(page, mark, seconds = 18) {
  const box = await boardBox(page);
  const run = {
    score: await arcadeScore(page),
    before: null,
    sent: null,
    sentAt: 0,
    thumb: { x: box.left + box.width * 0.86, y: box.top + box.height * 0.78 },
  };
  const until = Date.now() + seconds * 1000;
  while (Date.now() < until) {
    await miamTick(page, mark, run);
    await wait(60);
  }
}

/* --- MultiMemory : des paires à retrouver --- */

// Le plateau ne se redessine que quand il change : les cartes se relèvent une fois, sur tout ce
// qui a été dessiné depuis le début, et la valeur d'une carte se lit dans ce qui s'écrit après
// le toucher.

async function memoryCards(page) {
  const centres = [];
  for (const image of await boardImages(page, BOARD, 600000)) {
    const known = centres.some(c => Math.hypot(c.x - image.x, c.y - image.y) < 30);
    if (image.w >= 60 && !known) centres.push({ x: image.x, y: image.y });
  }
  return centres;
}

/** Valeur d'une face : un nombre, ou le résultat d'un calcul (« = 30 » ne compte pas). */
function cardValue(text) {
  const face = text.trim();
  if (/^\d+$/.test(face)) return Number(face);
  return /^\d+\s*[×x+\-−÷:]\s*\d+$/.test(face) ? resultOf(face) : null;
}

function nearestCard(centres, item) {
  const distance = c => Math.hypot(c.x - item.x, c.y - item.y);
  return centres.reduce((best, c, i) => (distance(c) < distance(centres.at(best)) ? i : best), 0);
}

/** Retient ce qui s'est écrit sur les cartes depuis `fresh` ms ; rend les cartes vues. */
async function learnCards(page, board, fresh) {
  const seen = new Set();
  for (const item of await boardTexts(page, BOARD, fresh)) {
    const value = cardValue(item.t);
    if (value === null) continue;
    const index = nearestCard(board.centres, item);
    board.known.set(index, value);
    seen.add(index);
  }
  return seen;
}

/** Retourne une carte ; un toucher ignoré (paire ratée encore montrée) se refait. */
async function flipCard(page, mark, board, index) {
  const card = board.centres.at(index);
  for (let attempt = 0; attempt < 4; attempt++) {
    const at = Date.now();
    await tapAt(page, card.x, card.y, 90);
    await wait(380);
    const seen = await learnCards(page, board, Date.now() - at);
    if (seen.has(index)) {
      mark('carte', { index, valeur: board.known.get(index) });
      return true;
    }
    await wait(450);
  }
  return false;
}

/** L'autre carte de même valeur, si elle est déjà connue. */
function twinOf(board, free, index) {
  if (!board.known.has(index)) return undefined;
  return free.find(other => other !== index && board.known.get(other) === board.known.get(index));
}

/** Un tour : une paire connue, sinon une carte inconnue puis sa jumelle ou une autre inconnue. */
async function memoryTurn(page, mark, board) {
  const free = board.centres.map((_, i) => i).filter(i => !board.done.has(i));
  const unknown = except => free.find(i => i !== except && !board.known.has(i));
  const a = free.find(i => twinOf(board, free, i) !== undefined) ?? unknown() ?? free[0];
  if (!(await flipCard(page, mark, board, a))) return null;
  const b = twinOf(board, free, a) ?? unknown(a) ?? free.find(i => i !== a);
  const deliberate = board.known.has(b);
  await wait(300);
  if (!(await flipCard(page, mark, board, b))) return null;
  return { a, b, deliberate };
}

async function scoreAfterPair(page, score) {
  let now = score;
  for (let i = 0; i < 10 && now === score; i++) {
    await wait(150);
    now = await arcadeScore(page);
  }
  return now;
}

/** Une partie de MultiMemory : elle s'arrête à deux paires trouvées. */
export async function playMemory(page, mark, seconds = 34) {
  const board = { centres: await memoryCards(page), known: new Map(), done: new Set() };
  let score = await arcadeScore(page);
  let pairs = 0;
  const until = Date.now() + seconds * 1000;
  while (Date.now() < until && pairs < 2 && board.done.size < board.centres.length) {
    const turn = await memoryTurn(page, mark, board);
    if (!turn) continue;
    const now = await scoreAfterPair(page, score);
    if (now > score) {
      mark('paire', { score: now, voulue: turn.deliberate });
      pairs++;
      board.done.add(turn.a).add(turn.b);
    }
    score = now;
    await wait(600);
  }
  await wait(900);
}

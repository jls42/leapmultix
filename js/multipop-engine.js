/**
 * MultiPop, le moteur : ce qui se passe dans les terriers, sans dessin ni DOM.
 *
 * Neuf terriers (3 × 3). À chaque sortie, les monstres du niveau montent ensemble, chacun avec
 * un nombre ; un seul porte la bonne réponse au calcul du bandeau. Taper le bon finit le
 * calcul (les autres redescendent, le bon reste le temps de lire le calcul complet) ; un
 * mauvais redescend seul ; personne de tapé à temps : ils redescendent tous, puis d'autres
 * sortent pour le même calcul. Parfois un ami sort avec eux, sans nombre : il ne faut pas le
 * taper. Chaque bonne réponse les fait sortir un peu moins longtemps (SPEED_UP), jusqu'à
 * FASTEST fois le temps du niveau : la partie s'anime pour qui trouve, jamais pour qui
 * cherche. Le temps est celui du jeu (tick) : la pause de l'Arcade l'arrête.
 */
import { shuffleInPlace, chance } from './core/random.js';

/** Côté de la grille des terriers */
export const GRID = 3;
/** Nombre de terriers */
export const HOLES = GRID * GRID;
/** Durée de la montée (et de la descente) d'un monstre ou d'un ami */
export const RISE_MS = 250;
/** Terriers vides entre deux sorties */
export const GAP_MS = 400;
/** Temps de sortie après une bonne réponse : 5 % de moins que le précédent */
export const SPEED_UP = 0.95;
/** Temps de sortie le plus court : 60 % de celui du niveau (environ 10 bonnes réponses) */
export const FASTEST = 0.6;

/** Terriers de la rangée du bas : la consigne du début est posée dessus */
export const BOTTOM_HOLES = Array.from({ length: GRID }, (_, column) => HOLES - GRID + column);

// Terriers tirés au hasard, tous différents, hors des terriers réservés tant qu'il en reste
// assez (sinon tous servent : la sortie passe avant ce qui les couvre)
function drawHoles(count, reserved = []) {
  const all = Array.from({ length: HOLES }, (_, hole) => hole);
  const free = all.filter(hole => !reserved.includes(hole));
  const holes = shuffleInPlace(free.length >= count ? free : all);
  return holes.slice(0, Math.min(count, HOLES));
}

/**
 * Terriers d'une sortie, tous différents, rangés dans l'ordre de lecture
 * @param {number} count
 * @returns {number[]}
 */
export function pickHoles(count) {
  return drawHoles(count).sort((a, b) => a - b);
}

/**
 * Rythme du niveau : combien de monstres sortent ensemble, et combien de temps ils restent
 * @param {{monstersUp: number, monsterSeconds: number}} settings - réglages de difficulty.js
 * @returns {{count: number, upMs: number}}
 */
export function monsterRhythm(settings) {
  return { count: settings.monstersUp, upMs: settings.monsterSeconds * 1000 };
}

const clamp01 = value => Math.min(1, Math.max(0, value));

/**
 * @typedef {Object} Monster
 * @property {number} hole - terrier (0 à 8, ligne par ligne)
 * @property {number} value - nombre de sa pancarte
 * @property {boolean} correct - la bonne réponse
 * @property {number|null} downAt - moment (horloge de la phase) où il a commencé à
 *   redescendre ; null tant qu'il est levé
 */

/**
 * @typedef {Object} Friend - l'ami sorti avec les monstres, sans nombre
 * @property {number} hole - terrier (0 à 8), jamais celui d'un monstre
 * @property {number|null} downAt - comme pour un monstre
 */

/** Les terriers d'une partie */
export class MonsterField {
  /**
   * @param {{count: number, upMs: number, solvedMs: number, friendChance?: number}} options -
   *   monstres par sortie, temps qu'ils restent, temps du calcul complet après la bonne
   *   réponse, chance qu'un ami sorte avec eux (0 : jamais, 1 : à chaque sortie)
   */
  constructor({ count, upMs, solvedMs, friendChance = 0 }) {
    this.count = count;
    /** Temps de sortie du niveau, puis raccourci à chaque bonne réponse (jusqu'à FASTEST) */
    this.upMs = upMs;
    this.slowestUpMs = upMs;
    this.solvedMs = solvedMs;
    this.friendChance = friendChance;
    /** waiting (pas de calcul), gap (terriers vides), up (monstres levés), solved */
    this.phase = 'waiting';
    this.elapsed = 0;
    /** @type {Monster[]} */
    this.monsters = [];
    /** @type {Friend|null} */
    this.friend = null;
    this.correct = null;
    this.drawAnswers = () => [];
    /** Attente des terriers vides avant la prochaine sortie */
    this.gapMs = GAP_MS;
    /** @type {number[]} Terriers laissés vides aux prochaines sorties (consigne posée dessus) */
    this.reserved = [];
  }

  /**
   * Un nouveau calcul : ses monstres sortent après les terriers vides
   * @param {number} correct - la bonne réponse
   * @param {() => number[]} drawAnswers - nombres d'une sortie, la bonne comprise, tirés à
   *   chaque sortie
   * @param {number} [waitMs] - attente avant la première sortie (plus longue au début de la
   *   partie, le temps de lire le calcul)
   */
  ask(correct, drawAnswers, waitMs = GAP_MS) {
    this.correct = correct;
    this.drawAnswers = drawAnswers;
    this.clear();
    this.gapMs = waitMs;
    this.enter('gap');
  }

  // Plus personne dans les terriers
  clear() {
    this.monsters = [];
    this.friend = null;
  }

  enter(phase) {
    this.phase = phase;
    this.elapsed = 0;
  }

  /**
   * Avance l'horloge du jeu
   * @param {number} dt - millisecondes de jeu écoulées
   * @returns {'raised'|'escaped'|'solved-done'|null} ce qui vient de se passer
   */
  tick(dt) {
    if (this.phase === 'waiting') return null;
    this.elapsed += dt;
    if (this.phase === 'gap' && this.elapsed >= this.gapMs) return this.raise();
    if (this.phase === 'up' && this.elapsed >= this.upMs) return this.escape();
    if (this.phase === 'solved' && this.elapsed >= this.solvedMs) return this.finish();
    return null;
  }

  raise() {
    const values = this.drawAnswers();
    // L'ami prend un terrier de plus, quand il en reste un et que le hasard le veut
    const withFriend = values.length < HOLES && this.friendChance > 0 && chance(this.friendChance);
    const holes = drawHoles(values.length + (withFriend ? 1 : 0), this.reserved);
    this.friend = withFriend ? { hole: holes.pop(), downAt: null } : null;
    holes.sort((a, b) => a - b);
    this.monsters = holes.map((hole, index) => {
      const value = values.at(index);
      return { hole, value, correct: value === this.correct, downAt: null };
    });
    this.enter('up');
    return 'raised';
  }

  escape() {
    this.clear();
    this.gapMs = GAP_MS;
    this.enter('gap');
    return 'escaped';
  }

  finish() {
    this.clear();
    this.enter('waiting');
    return 'solved-done';
  }

  /**
   * Tape le terrier : l'ami ou le monstre levé qui s'y trouve, sinon rien
   * @param {number} hole
   * @returns {{friend: true}|{correct: boolean, value: number}|null}
   */
  whack(hole) {
    const friend = this.upFriend();
    if (friend?.hole === hole) {
      friend.downAt = this.elapsed;
      return { friend: true };
    }
    const monster = this.upMonsters().find(candidate => candidate.hole === hole);
    if (!monster) return null;
    if (!monster.correct) {
      monster.downAt = this.elapsed;
      return { correct: false, value: monster.value };
    }
    this.solve(monster);
    return { correct: true, value: monster.value };
  }

  // Bonne réponse : son monstre reste levé, les autres et l'ami redescendent ensemble ; la
  // prochaine sortie sera un peu plus courte
  solve(monster) {
    this.monsters = this.upMonsters();
    this.friend = this.upFriend();
    this.enter('solved');
    for (const other of this.monsters) if (other !== monster) other.downAt = 0;
    if (this.friend) this.friend.downAt = 0;
    this.upMs = Math.max(this.slowestUpMs * FASTEST, this.upMs * SPEED_UP);
  }

  /**
   * Monstres encore levés, dans l'ordre des terriers (ceux qu'on peut taper)
   * @returns {Monster[]}
   */
  upMonsters() {
    if (this.phase !== 'up') return [];
    return this.monsters.filter(monster => monster.downAt === null);
  }

  /**
   * @returns {Friend|null} L'ami tant qu'il est levé
   */
  upFriend() {
    if (this.phase !== 'up' || !this.friend) return null;
    return this.friend.downAt === null ? this.friend : null;
  }

  /**
   * Hauteur sortie d'un monstre ou de l'ami, de 0 (au fond du terrier) à 1 (tout en haut)
   * @param {Monster|Friend} monster
   * @returns {number}
   */
  heightOf(monster) {
    if (monster.downAt !== null) return clamp01(1 - (this.elapsed - monster.downAt) / RISE_MS);
    if (this.phase === 'solved') return 1;
    const rising = this.elapsed / RISE_MS;
    const sinking = (this.upMs - this.elapsed) / RISE_MS;
    return clamp01(Math.min(rising, sinking));
  }
}

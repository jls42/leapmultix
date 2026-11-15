/**
 * MultiGoal, le moteur : la séance de tirs au but, sans dessin ni DOM.
 *
 * La cage porte les cibles du niveau, chacune avec un nombre ; une seule porte la bonne réponse
 * au calcul du bandeau. Un gardien va et vient devant la cage : il arrête tout ballon tiré
 * dans la colonne où il se trouve au moment du tir.
 *
 * | Tir               | Gardien ailleurs            | Gardien devant                  |
 * | Bonne réponse     | but                         | arrêté : rien ne compte, on retire |
 * | Mauvaise réponse  | raté : la cible tombe       | raté : la cible tombe           |
 *
 * Les positions sont en parts de la cage (0 à gauche ou en haut, 1 à droite ou en bas), la
 * vitesse du gardien en largeurs de cage par seconde : le jeu est le même sur tous les écrans.
 * Le temps est celui du jeu (tick) : la pause de l'Arcade l'arrête.
 */

/** Vol du ballon, du point de penalty à la cible */
export const FLIGHT_MS = 350;
/** Temps d'un tir arrêté ou raté avant de retirer */
export const REPLAY_MS = 800;
/** Demi-largeur de cage que le gardien bloque autour de lui */
export const KEEPER_REACH = 1 / 6;

// Hauteur des deux rangées de cibles, quand il y en a deux
const TWO_ROWS = [0.27, 0.73];
// Plus de cibles que ça : deux rangées
const ONE_ROW_MAX = 3;

/**
 * @typedef {Object} Slot
 * @property {number} slot - place dans la cage, dans l'ordre de lecture
 * @property {number} x - milieu, en parts de la largeur de la cage
 * @property {number} y - milieu, en parts de sa hauteur
 */

/**
 * Places des cibles dans la cage : trois sur une rangée, quatre ou six sur deux rangées
 * @param {number} count
 * @returns {Slot[]}
 */
export function targetSlots(count) {
  const rows = count > ONE_ROW_MAX ? 2 : 1;
  const columns = Math.ceil(count / rows);
  return Array.from({ length: count }, (_, slot) => ({
    slot,
    x: ((slot % columns) + 0.5) / columns,
    y: rows === 1 ? 0.5 : TWO_ROWS.at(Math.floor(slot / columns)),
  }));
}

/**
 * Rythme du niveau : combien de cibles dans la cage, et la vitesse du gardien
 * @param {{goalTargets: number, keeperSpeed: number}} settings - réglages de difficulty.js
 * @returns {{count: number, keeperSpeed: number}}
 */
export function shootoutRhythm(settings) {
  return { count: settings.goalTargets, keeperSpeed: settings.keeperSpeed };
}

/**
 * @typedef {Object} Target
 * @property {number} slot
 * @property {number} x
 * @property {number} y
 * @property {number} value - nombre de la cible
 * @property {boolean} correct - la bonne réponse
 * @property {boolean} out - tombée après un tir raté : on ne la vise plus
 */

/**
 * @typedef {Object} Shot
 * @property {number} slot - cible visée
 * @property {'goal'|'saved'|'missed'} outcome - décidé au moment du tir
 */

/** Résultat d'un tir, selon la cible et le gardien */
function outcomeOf(target, blocked) {
  if (!target.correct) return 'missed';
  return blocked ? 'saved' : 'goal';
}

/** Une séance de tirs au but */
export class Shootout {
  /**
   * @param {{count: number, keeperSpeed: number, solvedMs: number}} options - cibles dans la
   *   cage, vitesse du gardien (largeurs de cage par seconde), temps du calcul complet après
   *   un but
   */
  constructor({ count, keeperSpeed, solvedMs }) {
    this.count = count;
    this.keeperSpeed = keeperSpeed;
    this.solvedMs = solvedMs;
    this.slots = targetSlots(count);
    /** Le gardien va du milieu de la première colonne à celui de la dernière */
    this.keeperMin = this.slots.at(0).x;
    this.keeperMax = this.slots.at(-1).x;
    this.keeper = { x: this.keeperMin, direction: 1 };
    /** waiting (pas de calcul), aiming (on vise), flying (ballon en vol), goal, saved, missed */
    this.phase = 'waiting';
    this.elapsed = 0;
    /** @type {Target[]} */
    this.targets = [];
    /** @type {Shot|null} */
    this.shot = null;
  }

  /**
   * Un nouveau penalty : les cibles reçoivent leurs nombres, le gardien continue sa course
   * @param {number} correct - la bonne réponse
   * @param {number[]} values - un nombre par cible, la bonne réponse comprise
   */
  ask(correct, values) {
    this.targets = this.slots.map((place, index) => {
      const value = values.at(index);
      return { ...place, value, correct: value === correct, out: false };
    });
    this.shot = null;
    this.enter('aiming');
  }

  enter(phase) {
    this.phase = phase;
    this.elapsed = 0;
  }

  /**
   * Avance l'horloge du jeu
   * @param {number} dt - millisecondes de jeu écoulées
   * @returns {'goal'|'saved'|'missed'|'replay'|'goal-done'|null} ce qui vient de se passer :
   *   le ballon arrive (but, arrêt, raté), on retire, ou le but a été fêté
   */
  tick(dt) {
    if (this.phase === 'waiting') return null;
    this.elapsed += dt;
    if (this.phase === 'aiming') return this.moveKeeper(dt);
    if (this.phase === 'flying') return this.elapsed >= FLIGHT_MS ? this.land() : null;
    if (this.phase === 'goal') return this.elapsed >= this.solvedMs ? this.finish() : null;
    return this.elapsed >= REPLAY_MS ? this.replay() : null;
  }

  // Le gardien avance et fait demi-tour au bout de sa course ; il ne bouge que quand on vise
  moveKeeper(dt) {
    const { keeper } = this;
    let x = keeper.x + keeper.direction * this.keeperSpeed * (dt / 1000);
    if (x >= this.keeperMax) {
      x = this.keeperMax;
      keeper.direction = -1;
    } else if (x <= this.keeperMin) {
      x = this.keeperMin;
      keeper.direction = 1;
    }
    keeper.x = x;
    return null;
  }

  // Le ballon arrive : une cible ratée tombe
  land() {
    const { outcome, slot } = this.shot;
    if (outcome === 'missed') this.targets.at(slot).out = true;
    this.enter(outcome);
    return outcome;
  }

  // Tir arrêté ou raté : même calcul, on retire
  replay() {
    this.shot = null;
    this.enter('aiming');
    return 'replay';
  }

  finish() {
    this.shot = null;
    this.targets = [];
    this.enter('waiting');
    return 'goal-done';
  }

  /**
   * Le gardien est-il devant cette cible ? Il bloque toute sa colonne, pendant qu'on vise
   * comme pendant le tir (il ne bouge plus une fois le ballon parti)
   * @param {Target} target
   * @returns {boolean}
   */
  isBlocked(target) {
    return Math.abs(this.keeper.x - target.x) < KEEPER_REACH;
  }

  /**
   * Cibles qu'on peut viser : celles qui ne sont pas tombées, pendant qu'on vise
   * @returns {Target[]}
   */
  openTargets() {
    if (this.phase !== 'aiming') return [];
    return this.targets.filter(target => !target.out);
  }

  /**
   * Tire sur une cible ; rien hors de la visée ni sur une cible tombée. Le résultat est
   * décidé tout de suite, le ballon arrive après son vol
   * @param {number} slot
   * @returns {Shot|null}
   */
  shoot(slot) {
    const target = this.openTargets().find(candidate => candidate.slot === slot);
    if (!target) return null;
    this.shot = { slot, outcome: outcomeOf(target, this.isBlocked(target)) };
    this.enter('flying');
    return this.shot;
  }

  /**
   * Avancée du ballon en vol, de 0 (au point de penalty) à 1 (sur la cible)
   * @returns {number}
   */
  flight() {
    if (this.phase !== 'flying') return this.shot ? 1 : 0;
    return Math.min(1, this.elapsed / FLIGHT_MS);
  }
}

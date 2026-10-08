/**
 * Composant Dashboard centralisé
 * Gère l'affichage et la logique du tableau de bord utilisateur
 * Phase 3.4 - Extraction des fonctions dashboard de main.js
 *
 * Mise en page : une seule surface (.content-card). À l'intérieur, des listes
 * « libellé → valeur » et des rangées séparées par un filet, sans cartes imbriquées.
 */

import { UserState } from '../core/userState.js';
import { eventBus } from '../core/eventBus.js';
import { getAllBadges } from '../badges.js';
import { VideoManager } from '../VideoManager.js';
import { getTranslation } from '../utils-es6.js';
import { setSafeContentWithImage, createSafeElement } from '../security-utils.js';
import { ADVENTURE_LEVELS } from '../core/adventure-data.js';
import {
  normalizeChronoStats,
  normalizeChronoStatsByOperator,
  formatDuration,
} from '../core/chrono-stats.js';
import { adventureTotalsByOperator } from '../core/adventure-progress.js';
import {
  normalizeModeStats,
  modeEntries,
  answerTotals,
  weakTablesFrom,
  UNKNOWN_OPERATOR,
  CHALLENGE_DIFFICULTIES,
} from '../core/mode-stats.js';
import { getCurrentLanguage } from '../i18n-store.js';
import { createIcon } from './icons.js';

const MAX_STARS = 3;
const TABLE_COUNT = 10;
const OPERATORS = ['×', '+', '−', '÷'];
// Nom de chaque opération, lu par les lecteurs d'écran à côté de son signe
const OPERATOR_NAME_KEYS = Object.freeze({
  '×': ['operation_multiplication', 'Multiplication'],
  '+': ['operation_addition', 'Addition'],
  '−': ['operation_subtraction', 'Soustraction'],
  '÷': ['operation_division', 'Division'],
});
// La Découverte compte des tables de 1 à 10 en multiplication, trois niveaux ailleurs
const DISCOVERY_LEVELS = new Set(['easy', 'medium', 'hard']);

/**
 * Traduction avec repli lisible tant qu'une clé manque dans les fichiers de langue.
 * @param {string} key - Clé i18n
 * @param {string} fallback - Texte de repli
 * @param {Object} [params] - Paramètres d'interpolation ({name})
 * @returns {string}
 */
function tr(key, fallback, params = {}) {
  try {
    const value = getTranslation(key, params);
    if (typeof value === 'string' && value && !/^\[.*\]$/.test(value)) return value;
  } catch {
    // i18n pas encore prêt : on garde le repli
  }
  let text = fallback;
  for (const [name, value] of Object.entries(params)) text = text.replace(`{${name}}`, value);
  return text;
}

/**
 * Un nombre dans la langue du jeu : « 1 500 » en français, « 1,500 » en anglais. Un texte
 * (un temps déjà mis en forme, « — ») reste tel quel.
 * @param {string|number} value
 * @returns {string}
 */
function formatValue(value) {
  if (typeof value !== 'number') return String(value);
  try {
    return new Intl.NumberFormat(getCurrentLanguage() || 'fr').format(value);
  } catch {
    return String(value);
  }
}

/**
 * Une opération dans une valeur ventilée : son signe (son nom pour les lecteurs d'écran), ou
 * « avant la mise à jour » pour des données enregistrées sans leur opération
 * @param {string} operator
 * @returns {HTMLSpanElement}
 */
function operatorLabel(operator) {
  if (operator === UNKNOWN_OPERATOR) {
    return createSafeElement('span', tr('dashboard_before_update', 'avant la mise à jour'), {
      class: 'score-op is-legacy',
    });
  }
  const [key, fallback] = OPERATOR_NAME_KEYS[operator] ?? [operator, operator];
  const label = createSafeElement('span', '', { class: 'score-op' });
  label.appendChild(createSafeElement('span', operator, { 'aria-hidden': 'true' }));
  label.appendChild(createSafeElement('span', tr(key, fallback), { class: 'sr-only' }));
  return label;
}

/**
 * Remplit la valeur d'un fait : un nombre ou un texte ; ou, quand plusieurs opérations ont
 * été jouées, « 15 (× 12 · + 3) » pour un compte, « × 230 · + 180 » pour un record (D8)
 * @param {HTMLElement} dd
 * @param {string|number|{total?: number, parts: Array<{operator: string, value: (string|number)}>}} value
 */
function fillValue(dd, value) {
  if (!value || typeof value !== 'object' || !Array.isArray(value.parts)) {
    dd.textContent = formatValue(value);
    return;
  }
  const hasTotal = value.total !== undefined;
  if (hasTotal) dd.append(`${formatValue(value.total)} (`);
  value.parts.forEach((part, index) => {
    // Espace insécable avant le point : une ligne ne commence jamais par « · »
    if (index > 0) dd.append(' · ');
    // Un signe et sa valeur ne se séparent pas d'une ligne à l'autre
    const item = createSafeElement('span', '', {
      class: part.operator === UNKNOWN_OPERATOR ? 'score-part is-legacy' : 'score-part',
    });
    item.append(operatorLabel(part.operator), ` ${formatValue(part.value)}`);
    dd.append(item);
  });
  if (hasTotal) dd.append(')');
}

/**
 * Liste de définitions « libellé → valeur ».
 * @param {Array<{label: string, value: *}>} facts
 * @param {string} className
 * @returns {HTMLDListElement}
 */
function buildFacts(facts, className) {
  const list = document.createElement('dl');
  list.className = className;
  for (const { label, value } of facts) {
    const row = document.createElement('div');
    row.appendChild(createSafeElement('dt', label));
    const dd = document.createElement('dd');
    fillValue(dd, value);
    row.appendChild(dd);
    list.appendChild(row);
  }
  return list;
}

/**
 * Un compte, ventilé quand plusieurs opérations ont été jouées dans la rangée
 * @param {Array<Object>} entries - Opérations de la rangée (chacune avec son `operator`)
 * @param {(entry: Object) => number} pick
 */
function countValue(entries, pick) {
  const parts = entries.map(entry => ({
    operator: entry.operator,
    value: Number(pick(entry)) || 0,
  }));
  const total = parts.reduce((sum, part) => sum + part.value, 0);
  return parts.length > 1 ? { total, parts } : total;
}

/**
 * Les records des opérations qui en ont un, chacun avec son signe dès que la rangée couvre
 * plusieurs opérations ; « — » sans aucun record
 * @param {Array<{operator: string, value: (string|number|null)}>} records
 * @param {number} operatorCount - Opérations jouées dans la rangée
 * @returns {string|number|{parts: Array<{operator: string, value: (string|number)}>}} La
 *   valeur d'un fait, telle que fillValue l'affiche : le record seul, « — », ou le détail
 */
function recordsValue(records, operatorCount) {
  const parts = records.filter(part => part.value !== null && part.value !== undefined);
  if (parts.length === 0) return '—';
  return operatorCount > 1 ? { parts } : parts[0].value;
}

/**
 * Un record par opération jouée (celles qui en ont un)
 * @param {Array<Object>} entries
 * @param {(entry: Object) => (string|number|null)} pick
 */
function recordValue(entries, pick) {
  const records = entries.map(entry => ({ operator: entry.operator, value: pick(entry) }));
  return recordsValue(records, entries.length);
}

/**
 * Numéro de table normalisé en chaîne, ou null si la valeur n'en est pas un.
 * @param {unknown} candidate
 * @returns {string|null}
 */
function normalizeTableNumber(candidate) {
  if (typeof candidate === 'number' && Number.isFinite(candidate)) return String(candidate);
  if (typeof candidate === 'string' && /^\d+$/.test(candidate.trim())) {
    return String(Number(candidate.trim()));
  }
  return null;
}

/** Faits du Quiz : questions et bonnes réponses, par opération jouée ; null sans réponse */
function quizFacts(stats) {
  const entries = modeEntries(stats, 'quiz').filter(entry => entry.questions > 0);
  if (entries.length === 0) return null;
  return [
    { label: tr('stat_questions', 'Questions'), value: countValue(entries, e => e.questions) },
    {
      label: tr('stat_good_answers', 'Bonnes réponses'),
      value: countValue(entries, e => e.correct),
    },
  ];
}

/** Meilleur score d'un Défi et sa difficulté : « 210 (Difficile) », ou null */
function challengeBestText(entry) {
  let best = null;
  for (const difficulty of CHALLENGE_DIFFICULTIES) {
    const score = Number(entry.best?.[difficulty]) || 0;
    if (score > 0 && (best === null || score >= best.score)) best = { score, difficulty };
  }
  if (!best) return null;
  const level = tr(`difficulty_${best.difficulty}`, best.difficulty);
  return `${formatValue(best.score)} (${level})`;
}

/** Faits du Défi : parties (commencées, abandons compris), meilleur score d'une partie finie */
function challengeFacts(stats) {
  const entries = modeEntries(stats, 'challenge').filter(
    entry => entry.games > 0 || challengeBestText(entry) !== null
  );
  if (entries.length === 0) return null;
  return [
    {
      label: tr('sessions_count_label', 'Nombre de parties'),
      value: countValue(entries, e => e.games),
    },
    {
      label: tr('best_score_label', 'Meilleur score'),
      value: recordValue(entries, challengeBestText),
    },
  ];
}

/** Faits de l'Aventure : niveaux terminés et étoiles, par opération (la vraie progression) */
function adventureFacts(userData) {
  const totals = adventureTotalsByOperator(userData.adventureProgressByOperator);
  const entries = OPERATORS.filter(op => totals[op]).map(op => ({ operator: op, ...totals[op] }));
  if (entries.length === 0) return null;
  return [
    {
      label: tr('levels_completed_label', 'Niveaux complétés'),
      value: countValue(entries, e => e.levels),
    },
    { label: tr('stars_label', 'Étoiles'), value: countValue(entries, e => e.stars) },
  ];
}

/** Réserves de Chrono : × dans chronoStats, + − ÷ dans chronoStatsByOperator */
function chronoStores(userData) {
  return {
    '×': normalizeChronoStats(userData.chronoStats),
    ...normalizeChronoStatsByOperator(userData.chronoStatsByOperator),
  };
}

/** Plus petit meilleur temps d'une réserve (tous ses classements, comme avant), ou null */
function storeBestMs(store) {
  let bestMs = null;
  for (const bucket of store.buckets) {
    const best = bucket.best[0]?.durationMs;
    if (best !== undefined && (bestMs === null || best < bestMs)) bestMs = best;
  }
  return bestMs;
}

/**
 * Faits de Chrono (D8) : une seule rangée ; parties et calculs à revoir de toutes les
 * opérations, détaillés par opération jouée comme dans les autres modes, et un meilleur
 * temps par opération. null s'il n'a jamais servi (« Aucun score »).
 */
function chronoFacts(userData, stats) {
  const stores = chronoStores(userData);
  const entries = modeEntries(stats, 'chrono');
  const sessions = entries.reduce((sum, entry) => sum + entry.games, 0);
  const toReview = OPERATORS.reduce((sum, op) => sum + (stores[op]?.basket.length ?? 0), 0);
  if (!sessions && !toReview) return null;
  const lang = getCurrentLanguage();
  const times = OPERATORS.map(op => {
    const ms = stores[op] ? storeBestMs(stores[op]) : null;
    return { operator: op, value: ms === null ? null : formatDuration(ms, lang) };
  });
  // Opérations jouées : une partie comptée, un temps ou un calcul à revoir
  const played = [...OPERATORS, UNKNOWN_OPERATOR]
    .map(op => ({
      operator: op,
      games: entries.find(entry => entry.operator === op)?.games ?? 0,
      toReview: stores[op]?.basket.length ?? 0,
    }))
    .filter(
      count =>
        count.games > 0 ||
        count.toReview > 0 ||
        times.some(time => time.operator === count.operator && time.value !== null)
    );
  return [
    {
      label: tr('sessions_count_label', 'Nombre de parties'),
      value: countValue(played, count => count.games),
    },
    { label: tr('best_time_label', 'Meilleur temps'), value: recordsValue(times, played.length) },
    {
      label: tr('facts_to_review_label', 'Calculs à revoir'),
      value: countValue(played, count => count.toReview),
    },
  ];
}

/**
 * Ce qu'une clé de la Découverte a exploré : « 7 », une table de × ; « +:easy », un niveau.
 * Null pour une clé que la Découverte ignore.
 * @returns {{operator: string, item: (string|number)}|null}
 */
function discoveryItem(key) {
  const [operator, level] = String(key).split(':');
  if (level !== undefined) return DISCOVERY_LEVELS.has(level) ? { operator, item: level } : null;
  const table = /^\d+$/.test(operator) ? Number(operator) : 0;
  return table >= 1 && table <= TABLE_COUNT ? { operator: '×', item: table } : null;
}

/** Explorations de la Découverte, par opération : tables (×) ou niveaux (+ − ÷) */
function discoveryExplored(userData) {
  const explored = new Map(OPERATORS.map(op => [op, new Set()]));
  for (const key of userData.discoveryProgress?.exploredTables ?? []) {
    const found = discoveryItem(key);
    if (found) explored.get(found.operator)?.add(found.item);
  }
  return explored;
}

/** Faits de la Découverte : « 2 tables sur 10 », « 1 niveau sur 3 », par opération */
function discoveryFacts(userData) {
  const explored = discoveryExplored(userData);
  const parts = OPERATORS.filter(op => explored.get(op).size > 0).map(op => ({
    operator: op,
    value:
      op === '×'
        ? tr('discovery_tables_explored', '{n} tables sur 10', { n: explored.get(op).size })
        : tr('discovery_levels_explored', '{n} niveaux sur 3', { n: explored.get(op).size }),
  }));
  if (parts.length === 0) return null;
  return [
    {
      label: tr('discovery_explored_label', 'Déjà exploré'),
      value: parts.length > 1 ? { parts } : parts[0].value,
    },
  ];
}

/** Faits du Défi du jour (multiplication seulement) : défis réussis ; null tant qu'aucun */
function dailyFacts(userData) {
  const done = Math.floor(Number(userData.dailyChallengesCompleted) || 0);
  if (done <= 0) return null;
  return [{ label: tr('daily_challenges_completed_label', 'Défis réussis'), value: done }];
}

/** Faits d'un jeu d'Arcade : parties (abandons compris), record et moyenne, par opération */
function arcadeFacts(stats, game) {
  const entries = modeEntries(stats, game).filter(entry => entry.games > 0);
  if (entries.length === 0) return null;
  return [
    {
      label: tr('sessions_count_label', 'Nombre de parties'),
      value: countValue(entries, e => e.games),
    },
    { label: tr('best_score_label', 'Meilleur score'), value: recordValue(entries, e => e.best) },
    {
      label: tr('average_score_label', 'Score moyen'),
      value: recordValue(entries, e => Math.round(e.total / e.games)),
    },
  ];
}

/** Rien de joué : ni réponse, ni partie, ni étoile, ni exploration, ni défi du jour */
function isNewPlayer(userData, stats) {
  if (answerTotals(stats).questions > 0) return false;
  const anyGames = Object.values(stats.modes).some(byOperator =>
    Object.values(byOperator).some(entry => (entry.games ?? 0) > 0)
  );
  if (anyGames || Number(userData.dailyChallengesCompleted) > 0) return false;
  if (Object.keys(adventureTotalsByOperator(userData.adventureProgressByOperator)).length) {
    return false;
  }
  if ([...starsMapFrom(userData.starsByTable).values()].some(Boolean)) return false;
  const explored = discoveryExplored(userData);
  if (OPERATORS.some(op => explored.get(op).size > 0)) return false;
  const stores = chronoStores(userData);
  return OPERATORS.every(op => (stores[op]?.basket.length ?? 0) === 0);
}

/** Étoiles enregistrées par table, en table de correspondance. */
function starsMapFrom(starsByTable) {
  const entrees = Object.entries(starsByTable ?? {});
  return new Map(entrees.map(([table, valeur]) => [String(table), Number(valeur) || 0]));
}

/** Table d'un niveau d'Aventure : celle de la partie, sinon celle du niveau. */
function tableOfProgress(progress, levelInfo) {
  return normalizeTableNumber(progress?.table) ?? normalizeTableNumber(levelInfo?.table);
}

/**
 * Reporte les étoiles gagnées en Aventure sur leur table, si elles font mieux.
 * @param {Map<string, number>} starsByTable - Modifiée sur place
 * @param {Object} [adventureProgress]
 */
function mergeAdventureStars(starsByTable, adventureProgress) {
  if (!adventureProgress) return;
  const levelById = new Map(ADVENTURE_LEVELS.map(level => [level.id, level]));
  for (const [levelId, progress] of Object.entries(adventureProgress)) {
    const table = tableOfProgress(progress, levelById.get(Number(levelId)));
    if (!table) continue;
    const best = Number(progress?.stars) || 0;
    if (best > (starsByTable.get(table) ?? 0)) starsByTable.set(table, best);
  }
}

/** Compteurs du profil (amorcés depuis l'existant si la lecture du profil ne l'a pas fait) */
function statsOf(userData) {
  return normalizeModeStats(userData);
}

/** Rangées des modes classiques, dans l'ordre affiché : logo, nom, faits du profil */
const CLASSIC_ROWS = [
  {
    logo: 'logo_mode_quizz.png',
    key: 'quiz_mode_title',
    name: 'Quiz',
    facts: (_userData, stats) => quizFacts(stats),
  },
  {
    logo: 'logo_mode_defi.png',
    key: 'challenge_mode_title',
    name: 'Défi',
    facts: (_userData, stats) => challengeFacts(stats),
  },
  {
    logo: 'logo_mode_aventure.png',
    key: 'adventure_mode_title',
    name: 'Aventure',
    facts: userData => adventureFacts(userData),
  },
  {
    logo: 'logo_mode_chrono.png',
    key: 'chrono_mode_title',
    name: 'Chrono',
    facts: (userData, stats) => chronoFacts(userData, stats),
  },
  {
    logo: 'logo_mode_decouverte.png',
    key: 'discovery_mode_title',
    name: 'Découverte',
    facts: userData => discoveryFacts(userData),
  },
];

export const Dashboard = {
  /**
   * Initialiser le composant Dashboard
   */
  init() {
    this.initReplayVideoButton();
  },

  /**
   * Initialiser le bouton replay vidéo : icône SVG et libellé visible
   */
  initReplayVideoButton() {
    // Vérifier si le bouton existe (peut ne pas exister sur toutes les pages)
    const replayBtn = document.getElementById('replay-avatar-video');
    if (!replayBtn) return;

    if (!replayBtn.dataset.dashboardEnhanced) {
      replayBtn.type = 'button';
      replayBtn.classList.add('btn', 'btn-secondary', 'btn-sm');
      replayBtn.removeAttribute('title');
      delete replayBtn.dataset.translateTitle;
      const label = createSafeElement(
        'span',
        tr('replay_avatar_video', "Rejouer la vidéo d'avatar"),
        { 'data-translate': 'replay_avatar_video' }
      );
      const icon = createIcon('circle-play');
      replayBtn.replaceChildren(...(icon ? [icon] : []), label);
      replayBtn.dataset.dashboardEnhanced = 'true';
    }

    if (!replayBtn.dataset.dashboardListenerAttached) {
      replayBtn.addEventListener('click', () => {
        this.replayCurrentUserVideo();
      });
      replayBtn.dataset.dashboardListenerAttached = 'true';
    }
  },

  /**
   * Rejouer la vidéo de l'avatar actuel
   */
  replayCurrentUserVideo() {
    // Vérifier que VideoManager est disponible
    if (typeof VideoManager === 'undefined') {
      console.error('VideoManager non disponible pour replay vidéo');
      return;
    }

    // Obtenir l'avatar actuel de l'utilisateur
    const userData = UserState.getCurrentUserData();
    const currentAvatar = userData.avatar || 'fox';

    // Jouer la vidéo (sans callback car on reste sur le dashboard)
    VideoManager.playCharacterIntro(currentAvatar);
  },

  /**
   * Afficher le tableau de bord
   */
  /** Total d'étoiles de l'en-tête, accordé au nombre */
  showTotalStars() {
    const totalStarsEl = document.getElementById('total-stars');
    if (!totalStarsEl) return;
    const total = this.calculateTotalStars();
    totalStarsEl.textContent = formatValue(total);
    // « 1 étoile au total », « 0 étoile » en français, « 0 stars » en anglais
    const label = document.getElementById('total-stars-label');
    if (label) label.textContent = tr('total_stars_label', 'étoiles au total', { count: total });
    const summary = totalStarsEl.parentElement;
    if (summary && !summary.querySelector(':scope > svg.icon')) {
      const star = createIcon('star', { size: 20, className: 'star-icon is-filled' });
      if (star) summary.prepend(star);
    }
  },

  show() {
    // Charger les données de l'utilisateur
    const userData = UserState.getCurrentUserData();

    // Mettre à jour l'avatar et le nom
    const avatarEl = document.getElementById('dashboard-avatar');
    setSafeContentWithImage(avatarEl, {
      imageSrc: `assets/images/arcade/${userData.avatar || 'fox'}_head_avatar_128x128.png`,
      imageAlt: getTranslation(userData.avatar || 'fox'),
      width: '100',
      height: '100',
      imageClass: 'img-responsive',
    });
    const nicknameEl = document.getElementById('dashboard-nickname');
    if (nicknameEl) nicknameEl.textContent = userData.nickname || '';

    // Calculer et afficher le nombre total d'étoiles
    this.showTotalStars();

    this.initReplayVideoButton();

    // Générer la grille d'étoiles
    this.generateStarsGrid();

    // Nouveau joueur : une phrase d'accueil plutôt qu'une page de zéros
    const isNew = isNewPlayer(userData, statsOf(userData));
    this.toggleWelcome(isNew);

    // Afficher les statistiques globales
    this.updateStats();

    // Afficher les succès débloqués
    this.showAchievements();

    // Scores et statistiques par mode
    if (isNew) document.getElementById('dashboard-scores-section')?.remove();
    else this.generateScoresSection();
  },

  /**
   * Phrase d'accueil d'un joueur qui n'a encore rien joué, sous l'en-tête ; « Ton parcours »
   * (que des zéros) et les scores se cachent jusqu'à la première partie.
   * @param {boolean} isNew
   */
  toggleWelcome(isNew) {
    const container = document.querySelector('.dashboard-container');
    if (!container) return;
    container.querySelector('.history-section')?.toggleAttribute('hidden', isNew);
    container.querySelector('.dashboard-welcome')?.remove();
    if (!isNew) return;
    const welcome = createSafeElement(
      'p',
      tr('dashboard_welcome', 'Joue une partie : tes progrès s’afficheront ici.'),
      { class: 'dashboard-welcome', 'data-translate': 'dashboard_welcome' }
    );
    const header = container.querySelector('.dashboard-header');
    if (header) header.after(welcome);
    else container.prepend(welcome);
  },

  /**
   * Générer la grille d'étoiles du tableau de bord (tables ×1 à ×10)
   */
  generateStarsGrid() {
    const dashboardStars = document.getElementById('dashboard-stars');
    if (!dashboardStars) return;

    const userData = UserState.getCurrentUserData();
    const starsByTable = this._getStarsByTable(userData);
    // « À revoir » : les 20 dernières réponses de chaque table (Quiz, Défi, Aventure, Chrono)
    const weakTables = weakTablesFrom(statsOf(userData));

    dashboardStars.setAttribute('role', 'list');
    const cells = [];
    for (let table = 1; table <= TABLE_COUNT; table++) {
      cells.push(this._buildStarCell(table, starsByTable[table], weakTables.includes(table)));
    }
    dashboardStars.replaceChildren(...cells);
  },

  /**
   * Une table : numéro, trois étoiles (pleines ou vides), texte pour lecteur d'écran.
   * @param {number} table - Numéro de la table
   * @param {number} stars - Étoiles gagnées (0 à 3)
   * @param {boolean} isWeak - Table à retravailler
   * @returns {HTMLDivElement}
   */
  _buildStarCell(table, stars, isWeak) {
    const count = Math.max(0, Math.min(MAX_STARS, Number(stars) || 0));
    const cell = document.createElement('div');
    cell.className = `star-cell${isWeak ? ' weak-table' : ''}`;
    cell.setAttribute('role', 'listitem');

    cell.appendChild(
      createSafeElement('span', `×${table}`, { class: 'table-number', 'aria-hidden': 'true' })
    );

    const starRow = createSafeElement('span', '', { class: 'star-count', 'aria-hidden': 'true' });
    for (let index = 0; index < MAX_STARS; index++) {
      const estGagnee = count > index;
      const icon = createIcon('star', {
        size: 20,
        className: estGagnee ? 'star-icon is-filled' : 'star-icon',
      });
      if (icon) starRow.appendChild(icon);
    }
    cell.appendChild(starRow);

    const tableLabel = `${tr('table_of', 'Table de')} ${table}`;
    const starsLabel = tr('table_stars_sr', 'Étoiles : {count} sur 3', { count });
    cell.appendChild(
      createSafeElement('span', `${tableLabel}. ${starsLabel}`, { class: 'sr-only' })
    );

    if (isWeak) {
      cell.appendChild(
        createSafeElement('span', tr('table_to_review', 'À revoir'), { class: 'table-hint' })
      );
    }
    return cell;
  },

  /**
   * « Ton parcours » : une liste compacte libellé → valeur
   */
  updateStats() {
    const userData = UserState.getCurrentUserData();
    // Toutes les réponses : Quiz, Défi, Aventure et Chrono (course et révision)
    const totals = answerTotals(statsOf(userData));
    const rows = [
      {
        id: 'total-questions',
        key: 'stat_questions',
        fallback: 'Questions',
        value: totals.questions,
      },
      {
        id: 'correct-answers',
        key: 'stat_good_answers',
        fallback: 'Bonnes réponses',
        value: totals.correct,
      },
      {
        id: 'best-streak',
        key: 'stat_best_streak',
        fallback: 'Meilleure série',
        value: userData.bestStreak || 0,
      },
    ];

    const container = document.querySelector('.history-section .stats-container');
    if (container) {
      container.replaceChildren(this._buildJourneyList(rows));
      return;
    }
    // Sans conteneur de liste : mettre à jour les valeurs existantes
    for (const row of rows) {
      const el = document.getElementById(row.id);
      if (el) el.textContent = formatValue(row.value);
    }
  },

  _buildJourneyList(rows) {
    const list = document.createElement('dl');
    list.className = 'journey-list';
    for (const { id, key, fallback, value } of rows) {
      const row = document.createElement('div');
      row.className = 'journey-row';
      row.appendChild(createSafeElement('dt', tr(key, fallback), { 'data-translate': key }));
      row.appendChild(createSafeElement('dd', formatValue(value), { id }));
      list.appendChild(row);
    }
    return list;
  },

  /**
   * Afficher les succès débloqués
   */
  showAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    if (!achievementsList) return;

    achievementsList.textContent = '';
    const userData = UserState.getCurrentUserData();
    const userUnlockedBadges = userData.unlockedBadges || [];
    // Utiliser le module centralisé badges.js
    const allBadges = getAllBadges();

    if (userUnlockedBadges.length === 0) {
      achievementsList.removeAttribute('role');
      achievementsList.appendChild(
        createSafeElement('p', tr('no_badges_yet', 'Aucun badge débloqué pour le moment.'), {
          class: 'no-achievements',
        })
      );
      return;
    }

    achievementsList.setAttribute('role', 'list');
    userUnlockedBadges.forEach(badgeId => {
      const badgeInfo = allBadges.find(b => b.id === badgeId);
      if (!badgeInfo) {
        console.warn(getTranslation('badge_info_not_found', { badgeId: badgeId }));
        return;
      }
      const item = document.createElement('div');
      item.className = 'achievement-item';
      item.setAttribute('role', 'listitem');
      // L'image du badge (émoji) est décorative : son nom est écrit à côté
      item.appendChild(
        createSafeElement('span', String(badgeInfo.icon || ''), {
          class: 'achievement-icon',
          'aria-hidden': 'true',
        })
      );
      item.appendChild(
        createSafeElement('span', String(badgeInfo.name || ''), { class: 'achievement-name' })
      );
      item.appendChild(
        createSafeElement('span', String(badgeInfo.description || ''), {
          class: 'achievement-desc',
        })
      );
      achievementsList.appendChild(item);
    });
  },

  /**
   * Une rangée de score : logo du mode, nom, puis faits « libellé → valeur ».
   * @param {Object} spec
   * @param {string} spec.className - Classe historique de la rangée
   * @param {string} spec.logo - Chemin du logo (décoratif : le nom est écrit)
   * @param {string} spec.name - Nom du mode ou du jeu
   * @param {Array<{label: string, value: (string|number)}>|null} spec.facts - Faits, ou null si aucun score
   * @returns {HTMLLIElement}
   */
  _buildScoreRow({ className, logo, icon, name, facts }) {
    const row = document.createElement('li');
    row.className = `score-row ${className}`;
    if (icon) {
      // Pas de logo dessiné (Défi du jour) : une icône, décorative elle aussi
      const box = createSafeElement('span', '', {
        class: 'score-logo score-logo-icon',
        'aria-hidden': 'true',
      });
      const svg = createIcon(icon, { size: 36 });
      if (svg) box.appendChild(svg);
      row.appendChild(box);
    } else {
      row.appendChild(
        createSafeElement('img', '', {
          src: logo,
          alt: '',
          class: 'score-logo',
          width: '64',
          height: '64',
          loading: 'lazy',
          decoding: 'async',
        })
      );
    }
    const body = document.createElement('div');
    body.className = 'score-row-body';
    body.appendChild(createSafeElement('p', name, { class: 'score-row-title' }));
    body.appendChild(
      facts
        ? buildFacts(facts, 'score-facts')
        : createSafeElement('p', tr('no_scores_yet', 'Aucun score'), { class: 'score-empty' })
    );
    row.appendChild(body);
    return row;
  },

  /**
   * Modes classiques : les rangées d'avant (Quiz, Défi, Aventure, Chrono), puis la Découverte
   * et le Défi du jour (seulement quand un défi a été réussi)
   */
  _buildClassicRows(userData) {
    const stats = statsOf(userData);
    const rows = CLASSIC_ROWS.map(row =>
      this._buildScoreRow({
        className: 'classic-game-stats',
        logo: `assets/images/arcade/${row.logo}`,
        name: tr(row.key, row.name),
        facts: row.facts(userData, stats),
      })
    );
    const daily = dailyFacts(userData);
    if (daily) {
      rows.push(
        this._buildScoreRow({
          className: 'classic-game-stats daily-challenge-stats',
          icon: 'calendar',
          name: tr('daily_challenge_title', 'Défi du jour'),
          facts: daily,
        })
      );
    }
    return rows;
  },

  _buildArcadeRows(userData) {
    const stats = statsOf(userData);
    const games = [
      ['invasion', 'logo_multiinvaders.png', 'arcade_invasion_title', 'MultiInvaders'],
      ['multimiam', 'logo_multimiam.png', 'arcade_pacman_title', 'MultiMiam'],
      ['multimemory', 'logo_multimemory.png', 'arcade.multiMemory.title', 'MultiMemory'],
      ['multisnake', 'logo_multisnake.png', 'arcade_snake_title', 'MultiSnake'],
    ];
    return games.map(([game, logo, nameKey, fallback]) =>
      this._buildScoreRow({
        className: 'arcade-game-stats',
        logo: `assets/images/arcade/${logo}`,
        name: tr(nameKey, fallback),
        facts: arcadeFacts(stats, game),
      })
    );
  },

  _buildScoresGroup(titleKey, titleFallback, listClass, rows) {
    const group = document.createElement('div');
    group.className = 'scores-subblock';
    group.appendChild(
      createSafeElement('h4', tr(titleKey, titleFallback), {
        class: 'scores-subtitle',
        'data-translate': titleKey,
      })
    );
    const list = document.createElement('ul');
    list.className = `score-list ${listClass}`;
    list.append(...rows);
    group.appendChild(list);
    return group;
  },

  /**
   * Générer la section « Scores et statistiques »
   */
  generateScoresSection() {
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (!dashboardContainer) return;

    document.getElementById('dashboard-scores-section')?.remove(); // Toujours régénérer

    const section = document.createElement('section');
    section.id = 'dashboard-scores-section';
    section.className = 'dashboard-scores-section';
    section.appendChild(
      createSafeElement('h3', tr('dashboard_scores_title', 'Scores et statistiques'), {
        'data-translate': 'dashboard_scores_title',
      })
    );

    const userData = UserState.getCurrentUserData();
    const scoresBlock = document.createElement('div');
    scoresBlock.className = 'scores-block';
    scoresBlock.appendChild(
      this._buildScoresGroup(
        'classic_modes_title',
        'Modes classiques',
        'classic-stats',
        this._buildClassicRows(userData)
      )
    );
    scoresBlock.appendChild(
      this._buildScoresGroup(
        'arcade_games_title',
        'Mode Arcade',
        'arcade-games-grid',
        this._buildArcadeRows(userData)
      )
    );
    section.appendChild(scoresBlock);

    // Placer la section AVANT les succès débloqués
    const achievementsSection = document.getElementById('achievements-list')?.parentElement;
    if (achievementsSection?.parentElement === dashboardContainer) {
      dashboardContainer.insertBefore(section, achievementsSection);
    } else {
      dashboardContainer.appendChild(section);
    }
  },

  /**
   * Calculer le nombre total d'étoiles
   */
  /**
   * Total d'étoiles : celles des tables de multiplication (calcul d'avant), plus celles des
   * niveaux d'Aventure en addition, soustraction et division (comme le badge « Collectionneur
   * d'étoiles »)
   */
  calculateTotalStars() {
    const userData = UserState.getCurrentUserData();
    const starsByTable = this._getStarsByTable(userData);
    const multiplication = Object.values(starsByTable).reduce((sum, stars) => sum + stars, 0);
    const totals = adventureTotalsByOperator(userData.adventureProgressByOperator);
    const others = OPERATORS.filter(op => op !== '×').reduce(
      (sum, op) => sum + (totals[op]?.stars ?? 0),
      0
    );
    return multiplication + others;
  },
  _getStarsByTable(userData) {
    const starsByTable = starsMapFrom(userData.starsByTable);
    // Niveaux de multiplication seulement : ceux de + − ÷ n'ont pas de table (sinon le niveau 1
    // d'addition irait sur la table 1). L'ancien format est déjà recopié dans '×'
    const multiplication =
      userData.adventureProgressByOperator?.['×'] ?? userData.adventureProgress;
    mergeAdventureStars(starsByTable, multiplication);
    return Object.fromEntries(starsByTable);
  },
};

// Rafraîchir automatiquement sur changement de langue si visible (EventBus)
try {
  eventBus.on('languageChanged', () => {
    try {
      const slide7 = document.getElementById('slide7');
      if (slide7 && slide7.classList.contains('active-slide')) {
        Dashboard.show();
      }
    } catch {
      /* no-op: dashboard refresh best-effort */
    }
  });
} catch {
  /* no-op: eventBus optional */
}

export default Dashboard;

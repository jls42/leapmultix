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
import {
  getTranslation,
  getWeakTables,
  getArcadeScores,
  getArcadeScoresSnake,
  getArcadeScoresPacman,
  getArcadeScoresMemory,
} from '../utils-es6.js';
import { setSafeContentWithImage, createSafeElement } from '../security-utils.js';
import { ADVENTURE_LEVELS } from '../core/adventure-data.js';
import { createIcon } from './icons.js';

const MAX_STARS = 3;
const TABLE_COUNT = 10;

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
  } catch (error) {
    void error; // i18n pas encore prêt : on garde le repli
  }
  let text = fallback;
  for (const [name, value] of Object.entries(params)) text = text.replace(`{${name}}`, value);
  return text;
}

/**
 * Liste de définitions « libellé → valeur ».
 * @param {Array<{label: string, value: (string|number)}>} facts
 * @param {string} className
 * @returns {HTMLDListElement}
 */
function buildFacts(facts, className) {
  const list = document.createElement('dl');
  list.className = className;
  for (const { label, value } of facts) {
    const row = document.createElement('div');
    row.appendChild(createSafeElement('dt', label));
    row.appendChild(createSafeElement('dd', String(value)));
    list.appendChild(row);
  }
  return list;
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

/** Cumul du Quiz : questions posées et bonnes réponses. */
function quizTotals(userData) {
  const quiz = { total: 0, correct: 0 };
  for (const entry of userData.quizStats?.history || []) {
    quiz.total += Number(entry.total) || 0;
    quiz.correct += Number(entry.correct) || 0;
  }
  return quiz;
}

/** Cumul du Défi, toutes difficultés confondues. */
function challengeTotals(userData) {
  const challenge = { sessions: 0, best: 0 };
  for (const st of Object.values(userData.challengeStats || {})) {
    challenge.sessions += Number(st.totalPlayed) || 0;
    challenge.best = Math.max(challenge.best, Number(st.bestScore) || 0);
  }
  return challenge;
}

/** Cumul de l'Aventure : niveaux terminés et étoiles gagnées. */
function adventureTotals(userData) {
  const adventure = { levels: 0, stars: 0 };
  for (const progress of Object.values(userData.adventureProgress || {})) {
    if (progress.completed) adventure.levels++;
    adventure.stars += progress.stars || 0;
  }
  return adventure;
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

export const Dashboard = {
  _computeStats(scores) {
    const count = scores.length;
    const sum = scores.reduce((acc, s) => acc + s, 0);
    return { count, best: scores[0] || 0, avg: count ? Math.round(sum / count) : 0 };
  },

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
      replayBtn.removeAttribute('data-translate-title');
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
    const totalStarsEl = document.getElementById('total-stars');
    if (totalStarsEl) {
      totalStarsEl.textContent = this.calculateTotalStars();
      const summary = totalStarsEl.parentElement;
      if (summary && !summary.querySelector(':scope > svg.icon')) {
        const star = createIcon('star', { size: 20, className: 'star-icon is-filled' });
        if (star) summary.prepend(star);
      }
    }

    this.initReplayVideoButton();

    // Générer la grille d'étoiles
    this.generateStarsGrid();

    // Afficher les statistiques globales
    this.updateStats();

    // Afficher les succès débloqués
    this.showAchievements();

    // Scores et statistiques par mode
    this.generateScoresSection();
  },

  /**
   * Générer la grille d'étoiles du tableau de bord (tables ×1 à ×10)
   */
  generateStarsGrid() {
    const dashboardStars = document.getElementById('dashboard-stars');
    if (!dashboardStars) return;

    const userData = UserState.getCurrentUserData();
    const starsByTable = this._getStarsByTable(userData);
    const weakTables = getWeakTables();

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
    const history = userData.progressHistory || [];
    const rows = [
      {
        id: 'total-questions',
        key: 'stat_questions',
        fallback: 'Questions',
        value: history.length,
      },
      {
        id: 'correct-answers',
        key: 'stat_good_answers',
        fallback: 'Bonnes réponses',
        value: history.filter(item => item.correct).length,
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
      if (el) el.textContent = String(row.value);
    }
  },

  _buildJourneyList(rows) {
    const list = document.createElement('dl');
    list.className = 'journey-list';
    for (const { id, key, fallback, value } of rows) {
      const row = document.createElement('div');
      row.className = 'journey-row';
      row.appendChild(createSafeElement('dt', tr(key, fallback), { 'data-translate': key }));
      row.appendChild(createSafeElement('dd', String(value), { id }));
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
  _buildScoreRow({ className, logo, name, facts }) {
    const row = document.createElement('li');
    row.className = `score-row ${className}`;
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

  _arcadeFacts(scores) {
    if (!scores.length) return null;
    const stats = this._computeStats(scores);
    return [
      { label: tr('sessions_count_label', 'Nombre de parties'), value: stats.count },
      { label: tr('best_score_label', 'Meilleur score'), value: stats.best },
      { label: tr('average_score_label', 'Score moyen'), value: stats.avg },
    ];
  },

  _classicModeStats(userData) {
    return {
      quiz: quizTotals(userData),
      challenge: challengeTotals(userData),
      adventure: adventureTotals(userData),
    };
  },

  _buildClassicRows(userData) {
    const { quiz, challenge, adventure } = this._classicModeStats(userData);
    return [
      this._buildScoreRow({
        className: 'classic-game-stats',
        logo: 'assets/images/arcade/logo_mode_quizz.png',
        name: tr('quiz_mode_title', 'Quiz'),
        facts: quiz.total
          ? [
              { label: tr('stat_questions', 'Questions'), value: quiz.total },
              { label: tr('stat_good_answers', 'Bonnes réponses'), value: quiz.correct },
            ]
          : null,
      }),
      this._buildScoreRow({
        className: 'classic-game-stats',
        logo: 'assets/images/arcade/logo_mode_defi.png',
        name: tr('challenge_mode_title', 'Défi'),
        facts: challenge.sessions
          ? [
              { label: tr('sessions_count_label', 'Nombre de parties'), value: challenge.sessions },
              { label: tr('best_score_label', 'Meilleur score'), value: challenge.best },
            ]
          : null,
      }),
      this._buildScoreRow({
        className: 'classic-game-stats',
        logo: 'assets/images/arcade/logo_mode_aventure.png',
        name: tr('adventure_mode_title', 'Aventure'),
        facts:
          adventure.levels || adventure.stars
            ? [
                {
                  label: tr('levels_completed_label', 'Niveaux complétés'),
                  value: adventure.levels,
                },
                { label: tr('stars_label', 'Étoiles'), value: adventure.stars },
              ]
            : null,
      }),
    ];
  },

  _buildArcadeRows() {
    const read = getter => (typeof getter === 'function' ? getter() || [] : []);
    const games = [
      {
        logo: 'assets/images/arcade/logo_multiinvaders.png',
        nameKey: 'arcade_invasion_title',
        fallback: 'MultiInvaders',
        scores: read(getArcadeScores),
      },
      {
        logo: 'assets/images/arcade/logo_multimiam.png',
        nameKey: 'arcade_pacman_title',
        fallback: 'MultiMiam',
        scores: read(getArcadeScoresPacman),
      },
      {
        logo: 'assets/images/arcade/logo_multimemory.png',
        nameKey: 'arcade.multiMemory.title',
        fallback: 'MultiMemory',
        scores: read(getArcadeScoresMemory),
      },
      {
        logo: 'assets/images/arcade/logo_multisnake.png',
        nameKey: 'arcade_snake_title',
        fallback: 'MultiSnake',
        scores: read(getArcadeScoresSnake),
      },
    ];
    return games.map(game =>
      this._buildScoreRow({
        className: 'arcade-game-stats',
        logo: game.logo,
        name: tr(game.nameKey, game.fallback),
        facts: this._arcadeFacts(game.scores),
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
        this._buildArcadeRows()
      )
    );
    section.appendChild(scoresBlock);

    // Placer la section AVANT les succès débloqués
    const achievementsSection = document.getElementById('achievements-list')?.parentElement;
    if (achievementsSection && achievementsSection.parentElement === dashboardContainer) {
      dashboardContainer.insertBefore(section, achievementsSection);
    } else {
      dashboardContainer.appendChild(section);
    }
  },

  /**
   * Calculer le nombre total d'étoiles
   */
  calculateTotalStars() {
    const userData = UserState.getCurrentUserData();
    const starsByTable = this._getStarsByTable(userData);
    return Object.values(starsByTable).reduce((sum, stars) => sum + stars, 0);
  },
  _getStarsByTable(userData) {
    const starsByTable = starsMapFrom(userData.starsByTable);
    mergeAdventureStars(starsByTable, userData.adventureProgress);
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
    } catch (e) {
      void e; /* no-op: dashboard refresh best-effort */
    }
  });
} catch (e) {
  void e; /* no-op: eventBus optional */
}

export default Dashboard;

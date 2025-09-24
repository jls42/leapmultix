/**
 * Composant Dashboard centralisé
 * Gère l'affichage et la logique du tableau de bord utilisateur
 * Phase 3.4 - Extraction des fonctions dashboard de main.js
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
import { getChallengeTopScores } from '../core/challenge-stats.js';
import { setSafeContentWithImage, createSafeElement } from '../security-utils.js';
import { ADVENTURE_LEVELS } from '../core/adventure-data.js';

export const Dashboard = {
  // DOM builders (avoid innerHTML injection and ensure consistent rendering)
  _buildTop5Node(scores, medals) {
    const wrap = document.createElement('div');
    wrap.className = 'arcade-top5-modern';
    (scores || []).forEach((score, idx) => {
      const item = document.createElement('div');
      item.className = 'arcade-score-item';
      const medal = document.createTextNode(medals[idx] || '');
      const val = createSafeElement('span', String(score), { class: 'arcade-score' });
      item.appendChild(medal);
      item.appendChild(val);
      wrap.appendChild(item);
    });
    if (!scores || scores.length === 0) {
      wrap.appendChild(
        createSafeElement('div', getTranslation('no_scores_yet') || 'Aucun score', {
          class: 'arcade-score-empty',
        })
      );
    }
    return wrap;
  },

  _buildStatsRowNode(count, best, avg, labels) {
    const row = document.createElement('div');
    row.className = 'arcade-stats-row';
    const s1 = document.createElement('div');
    s1.className = 'arcade-stat';
    const s1b = document.createElement('b');
    s1b.textContent = labels.sessions;
    s1.appendChild(s1b);
    s1.appendChild(document.createTextNode(` : ${count}`));
    const s2 = document.createElement('div');
    s2.className = 'arcade-stat';
    const s2b = document.createElement('b');
    s2b.textContent = labels.best;
    s2.appendChild(s2b);
    s2.appendChild(document.createTextNode(` : ${best}`));
    const s3 = document.createElement('div');
    s3.className = 'arcade-stat';
    const s3b = document.createElement('b');
    s3b.textContent = labels.avg;
    s3.appendChild(s3b);
    s3.appendChild(document.createTextNode(` : ${avg}`));
    row.appendChild(s1);
    row.appendChild(s2);
    row.appendChild(s3);
    return row;
  },

  _computeStats(scores) {
    const count = scores.length;
    const sum = scores.reduce((acc, s) => acc + s, 0);
    return { count, best: scores[0] || 0, avg: count ? Math.round(sum / count) : 0 };
  },
  /**
   * Initialiser le composant Dashboard
   */
  init() {
    console.log('📊 Initialisation du composant Dashboard');
    this.initReplayVideoButton();
  },

  /**
   * Initialiser le bouton replay vidéo
   */
  initReplayVideoButton() {
    // Vérifier si le bouton existe (peut ne pas exister sur toutes les pages)
    const replayBtn = document.getElementById('replay-avatar-video');
    if (!replayBtn) return;

    replayBtn.addEventListener('click', () => {
      this.replayCurrentUserVideo();
    });
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

    console.log(`🎬 Replay vidéo demandé depuis Dashboard: ${currentAvatar}`);

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
    document.getElementById('dashboard-nickname').textContent = userData.nickname || '';

    // Calculer et afficher le nombre total d'étoiles
    const totalStars = this.calculateTotalStars();
    document.getElementById('total-stars').textContent = totalStars;

    // Générer la grille d'étoiles
    this.generateStarsGrid();

    // Afficher les statistiques globales
    this.updateStats();

    // Afficher les succès débloqués
    this.showAchievements();

    // === Nouvelle section Scores & Statistiques moderne ===
    this.generateScoresSection();
  },

  /**
   * Générer la grille d'étoiles du tableau de bord
   */
  generateStarsGrid() {
    const dashboardStars = document.getElementById('dashboard-stars');
    if (!dashboardStars) return;

    dashboardStars.textContent = '';
    const userData = UserState.getCurrentUserData();
    const starsByTable = this._getStarsByTable(userData);
    const weakTables = getWeakTables();

    /**
     * Fonction for
     * @param {*} let - Description du paramètre
     * @returns {*} Description du retour
     */
    for (let i = 1; i <= 10; i++) {
      const stars = starsByTable[i] || 0;
      const isWeak = weakTables.includes(i);

      const starCell = document.createElement('div');
      starCell.className = `star-cell ${isWeak ? 'weak-table' : ''}`;
      const tableDiv = createSafeElement('div', `×${i}`, { class: 'table-number' });
      const starDiv = document.createElement('div');
      starDiv.className = 'star-count';
      const starText =
        '⭐'.repeat(Math.max(0, Math.min(3, stars))) +
        '☆'.repeat(Math.max(0, 3 - Math.min(3, stars)));
      starDiv.textContent = starText;
      starCell.appendChild(tableDiv);
      starCell.appendChild(starDiv);

      dashboardStars.appendChild(starCell);
    }
  },

  /**
   * Mettre à jour les statistiques du tableau de bord
   */
  updateStats() {
    // Récupérer l'historique des questions
    const history = UserState.getCurrentUserData().progressHistory || [];

    // Total des questions
    document.getElementById('total-questions').textContent = history.length;

    // Réponses correctes
    const correctAnswers = history.filter(item => item.correct).length;
    document.getElementById('correct-answers').textContent = correctAnswers;

    // Meilleure série
    document.getElementById('best-streak').textContent =
      UserState.getCurrentUserData().bestStreak || 0;
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
    /**
     * Fonction if
     * @param {*} typeof - Description du paramètre
     * @returns {*} Description du retour
     */
    const allBadges = getAllBadges();
    /**
     * Fonction if
     * @param {*} userUnlockedBadges.length - Description du paramètre
     * @returns {*} Description du retour
     */
    if (userUnlockedBadges.length === 0) {
      const noAch = createSafeElement('div', getTranslation('no_badges_yet'), {
        class: 'no-achievements',
      });
      achievementsList.appendChild(noAch);
    } else {
      userUnlockedBadges.forEach(badgeId => {
        const badgeInfo = allBadges.find(b => b.id === badgeId);
        /**
         * Fonction if
         * @param {*} badgeInfo - Description du paramètre
         * @returns {*} Description du retour
         */
        if (badgeInfo) {
          const item = document.createElement('div');
          item.className = 'achievement-item';
          const iconDiv = createSafeElement('div', String(badgeInfo.icon || ''), {
            class: 'achievement-icon',
          });
          const nameDiv = createSafeElement('div', String(badgeInfo.name || ''), {
            class: 'achievement-name',
          });
          const descDiv = createSafeElement('div', String(badgeInfo.description || ''), {
            class: 'achievement-desc',
          });
          item.appendChild(iconDiv);
          item.appendChild(nameDiv);
          item.appendChild(descDiv);
          achievementsList.appendChild(item);
        } else {
          console.warn(getTranslation('badge_info_not_found', { badgeId: badgeId }));
        }
      });
    }
  },

  /**
   * Générer la section scores moderne
   */
  generateScoresSection() {
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (!dashboardContainer) return;

    let section = document.getElementById('dashboard-scores-section');
    if (section) section.remove(); // Toujours régénérer

    section = document.createElement('div');
    section.id = 'dashboard-scores-section';
    section.className = 'dashboard-scores-section';

    // Arcade top and stats
    const arcadeScores = typeof getArcadeScores === 'function' ? getArcadeScores() : [];
    const medals = ['🥇', '🥈', '🥉'];
    const arcadeNode = document.createElement('div');
    arcadeNode.appendChild(this._buildTop5Node(arcadeScores, medals));
    {
      const st = this._computeStats(arcadeScores);
      arcadeNode.appendChild(
        this._buildStatsRowNode(st.count, st.best, st.avg, {
          sessions: getTranslation('sessions_count_label'),
          best: getTranslation('best_score_label'),
          avg: getTranslation('average_score_label'),
        })
      );
    }

    // Snake (MultiSnake) stats
    const snakeScores = typeof getArcadeScoresSnake === 'function' ? getArcadeScoresSnake() : [];
    const snakeNode = document.createElement('div');
    snakeNode.appendChild(this._buildTop5Node(snakeScores, medals));
    {
      const st = this._computeStats(snakeScores);
      snakeNode.appendChild(
        this._buildStatsRowNode(st.count, st.best, st.avg, {
          sessions: getTranslation('sessions_count_label'),
          best: getTranslation('best_score_label'),
          avg: getTranslation('average_score_label'),
        })
      );
    }

    // Pacman (MultiMiam) stats
    const pacmanScores = typeof getArcadeScoresPacman === 'function' ? getArcadeScoresPacman() : [];
    const pacmanNode = document.createElement('div');
    pacmanNode.appendChild(this._buildTop5Node(pacmanScores, medals));
    {
      const st = this._computeStats(pacmanScores);
      pacmanNode.appendChild(
        this._buildStatsRowNode(st.count, st.best, st.avg, {
          sessions: getTranslation('sessions_count_label'),
          best: getTranslation('best_score_label'),
          avg: getTranslation('average_score_label'),
        })
      );
    }

    // Memory (MultiMemory) stats
    const memoryScores = typeof getArcadeScoresMemory === 'function' ? getArcadeScoresMemory() : [];
    const memoryNode = document.createElement('div');
    memoryNode.appendChild(this._buildTop5Node(memoryScores, medals));
    {
      const st = this._computeStats(memoryScores);
      memoryNode.appendChild(
        this._buildStatsRowNode(st.count, st.best, st.avg, {
          sessions: getTranslation('sessions_count_label'),
          best: getTranslation('best_score_label'),
          avg: getTranslation('average_score_label'),
        })
      );
    }

    // Challenge top scores (array used below to build DOM)
    const challengeScores =
      typeof getChallengeTopScores === 'function' ? getChallengeTopScores() : [];

    // Classic modes stats
    const userData = UserState.getCurrentUserData();
    // Quiz
    const qStats = (function () {
      const history = userData.quizStats?.history || [];
      let total = 0;
      let correct = 0;
      for (const entry of history) {
        total += Number(entry.total) || 0;
        correct += Number(entry.correct) || 0;
      }

      const rate = total ? Math.round((correct / total) * 100) : 0;
      return { total, correct, rate };
    })();

    // Challenge (all difficulties)
    const cStats = (function () {
      let sessions = 0,
        best = 0,
        total = 0,
        correct = 0;
      if (userData.challengeStats) {
        Object.values(userData.challengeStats).forEach(st => {
          sessions += st.totalPlayed;
          best = Math.max(best, st.bestScore);
          total += st.totalQuestions;
          correct += st.totalCorrect;
        });
      }
      const rate = total ? Math.round((correct / total) * 100) : 0;
      return { sessions, best, rate };
    })();

    // Adventure
    const aStats = (function () {
      let levels = 0,
        stars = 0;
      if (userData.adventureProgress) {
        Object.values(userData.adventureProgress).forEach(p => {
          if (p.completed) levels++;
          stars += p.stars || 0;
        });
      }
      return { levels, stars };
    })();

    // DOM pur: construire la structure sans chaînes HTML injectées
    section.textContent = '';
    const h3 = createSafeElement('h3', getTranslation('dashboard_scores_title'), {
      'data-translate': 'dashboard_scores_title',
    });
    section.appendChild(h3);

    const scoresBlock = document.createElement('div');
    scoresBlock.className = 'scores-block';

    // Sous-bloc "classiques"
    const classicSub = document.createElement('div');
    classicSub.className = 'scores-subblock';
    const classicTitle = createSafeElement('div', getTranslation('classic_modes_title'), {
      class: 'scores-subtitle',
      'data-translate': 'classic_modes_title',
    });
    classicSub.appendChild(classicTitle);
    const classicStats = document.createElement('div');
    classicStats.className = 'classic-stats';

    const mkClassicNode = (logo, titleText, bodyText) => {
      const wrap = document.createElement('div');
      wrap.className = 'classic-game-stats';
      const img = createSafeElement('img', '', {
        src: logo,
        alt: titleText,
        class: 'classic-logo',
      });
      const stat = document.createElement('div');
      stat.className = 'mode-stat';
      const b = document.createElement('b');
      b.textContent = titleText;
      stat.appendChild(b);
      stat.appendChild(document.createTextNode(' - ' + bodyText));
      wrap.appendChild(img);
      wrap.appendChild(stat);
      return wrap;
    };

    // Ajouter Quiz / Challenge / Top scores / Aventure
    classicStats.appendChild(
      mkClassicNode(
        'assets/images/arcade/logo_mode_quizz.png',
        getTranslation('quiz_mode_title'),
        `${qStats.total} Q / ${qStats.correct} ✔️ (${qStats.rate}%)`
      )
    );
    classicStats.appendChild(
      mkClassicNode(
        'assets/images/arcade/logo_mode_defi.png',
        getTranslation('challenge_mode_title'),
        `${getTranslation('best_score_label')}: ${cStats.best} - ${getTranslation('sessions_count_label')}: ${cStats.sessions} - ${cStats.rate}%`
      )
    );
    if (challengeScores.length) {
      const topTitle = createSafeElement('div', getTranslation('challenge_top_scores_title'), {
        class: 'mode-stat',
      });
      classicStats.appendChild(topTitle);
      const topList = document.createElement('div');
      topList.className = 'challenge-top5 arcade-top5-modern';
      challengeScores.forEach((score, idx) => {
        const item = document.createElement('div');
        item.className = 'arcade-score-item';
        const medal = document.createTextNode(medals[idx] || '');
        const val = createSafeElement('span', String(score), { class: 'arcade-score' });
        item.appendChild(medal);
        item.appendChild(val);
        topList.appendChild(item);
      });
      classicStats.appendChild(topList);
    }
    classicStats.appendChild(
      mkClassicNode(
        'assets/images/arcade/logo_mode_aventure.png',
        getTranslation('adventure_mode_title'),
        `${getTranslation('levels_completed_label', 'Niveaux')}: ${aStats.levels} - ${getTranslation('stars_label', 'Étoiles')}: ${aStats.stars}`
      )
    );
    classicSub.appendChild(classicStats);

    // Sous-bloc "arcade"
    const arcadeSub = document.createElement('div');
    arcadeSub.className = 'scores-subblock';
    const arcadeTitle = createSafeElement('div', getTranslation('arcade_games_title'), {
      class: 'scores-subtitle',
      'data-translate': 'arcade_games_title',
    });
    arcadeSub.appendChild(arcadeTitle);

    const arcadeGrid = document.createElement('div');
    arcadeGrid.className = 'arcade-games-grid';
    const mkArcadeItem = (logoSrc, alt, contentNode) => {
      const wrap = document.createElement('div');
      wrap.className = 'arcade-game-stats';
      const img = createSafeElement('img', '', { src: logoSrc, alt, class: 'arcade-logo' });
      wrap.appendChild(img);
      wrap.appendChild(contentNode);
      return wrap;
    };
    arcadeGrid.appendChild(
      mkArcadeItem(
        'assets/images/arcade/logo_multiinvaders.png',
        getTranslation('arcade_invasion_title'),
        arcadeNode
      )
    );
    arcadeGrid.appendChild(
      mkArcadeItem(
        'assets/images/arcade/logo_multimiam.png',
        getTranslation('arcade_pacman_title'),
        pacmanNode
      )
    );
    arcadeGrid.appendChild(
      mkArcadeItem(
        'assets/images/arcade/logo_multimemory.png',
        getTranslation('arcade.multiMemory.title'),
        memoryNode
      )
    );
    arcadeGrid.appendChild(
      mkArcadeItem(
        'assets/images/arcade/logo_multisnake.png',
        getTranslation('arcade_snake_title'),
        snakeNode
      )
    );
    arcadeSub.appendChild(arcadeGrid);

    scoresBlock.appendChild(classicSub);
    scoresBlock.appendChild(arcadeSub);
    section.appendChild(scoresBlock);

    // Placer la carte AVANT les succès débloqués
    const achievementsSection = document.getElementById('achievements-list')?.parentElement;
    /**
     * Fonction if
     * @param {*} achievementsSection - Description du paramètre
     * @returns {*} Description du retour
     */
    if (achievementsSection) {
      dashboardContainer.insertBefore(section, achievementsSection);
    } else {
      dashboardContainer.appendChild(section);
    }

    // Appliquer les traductions aux nouveaux noeuds (si disponibles)
    import('../i18n.js')
      .then(m => m.applyStaticTranslations?.())
      .catch(() => {
        /* no-op */
      });
    console.log('📊 Dashboard: section Scores rendue');
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
    const starsByTable = userData.starsByTable ? { ...userData.starsByTable } : {};

    if (userData.adventureProgress) {
      const levelById = new Map(ADVENTURE_LEVELS.map(level => [level.id, level]));
      for (const [levelId, progress] of Object.entries(userData.adventureProgress)) {
        const levelInfo = levelById.get(Number(levelId));
        const tableFromProgress = progress?.table;
        const table = tableFromProgress || levelInfo?.table;
        if (!table) continue;
        // eslint-disable-next-line security/detect-object-injection, sonarjs/no-unsafe-string-usage -- Safe: table is controlled multiplication table (1-10) from ADVENTURE_LEVELS
        const current = Number(starsByTable[table]) || 0;
        const best = Number(progress?.stars) || 0;
        // eslint-disable-next-line security/detect-object-injection, sonarjs/no-object-injection -- Safe: table is validated multiplication table number from internal data
        if (best > current) starsByTable[table] = best;
      }
    }

    return starsByTable;
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

console.log('📊 Module Dashboard chargé');
export default Dashboard;

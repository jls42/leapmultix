import { getCurrentDateString } from './core/storage.js';
import { loadDailyChallengeData, saveDailyChallengeData } from './core/daily-challenge.js';
import { getDailyChallengeTable, getTranslation, showMessage } from './utils-es6.js';
import { UserState } from './core/userState.js';
import { UserManager } from './userManager.js';
import { appendSanitizedHTML } from './security-utils.js';

/* ======================
   ÉTAT DU JEU
   ====================== */
export const gameState = {
  score: 0,
  level: 1,
  activeLevel: 1,
  currentQuestion: null,
  correctAnswer: null,
  progress: 0,
  questionsPerLevel: 10,
  timeLeft: 60,
  timerInterval: null,
  stars: 0,
  theme: 'forest',
  colorTheme: 'default', // Thème de couleurs: 'default', 'pink', 'blue', 'green', 'orange', 'dark'
  progressHistory: [],
  lives: 3,
  maxLives: 3,
  isPaused: false,
  extremeMode: false,
  volume: 1,
  questionStartTime: null,
  wrongAnswers: {},
  streak: 0, // Compteur de bonnes réponses consécutives
  gameMode: 'adventure', // Mode de jeu: 'adventure', 'discovery', 'quiz', 'challenge'
  avatar: 'fox', // Avatar du joueur: 'fox', 'unicorn', 'dragon', 'panda', 'astronaut'
  nickname: '', // Surnom du joueur
  unlockedAvatars: ['fox'], // Avatars débloqués
  starsByTable: {}, // Étoiles gagnées par table (ex: {'1': 2, '2': 3})
  unlockedBadges: [], // Badges débloqués par l'utilisateur
  remainingMultiplicands: [], // Pour le mode Aventure
};

// Plus de compat global window.gameState: utiliser les imports ESM

// Tâche 2.3: Constantes pour le défi quotidien
const DAILY_CHALLENGE_GOAL = 5; // Nombre de bonnes réponses requises
const DAILY_CHALLENGE_REWARD = 10; // Nombre de pièces en récompense

/* ======================
   RÉFÉRENCES DOM
   ====================== */
// Les références DOM globales sont maintenant dans main.js ou spécifiques aux modes

// Les références audio sont maintenant dans main.js

// La constante avatars a été déplacée dans main.js

/* ======================
   FONCTIONS INIT / JEU
   ====================== */
// l'initialisation se fait dans les fonctions startXXXMode

/* ======================
   SÉLECTION DES TABLES
   ====================== */
// ... (fonctions updateLevelTables, getSelectedTables restent potentiellement utiles pour certains modes)

/* ======================
   GESTION DES QUESTIONS
   ====================== */
// Les fonctions createNewQuestion et checkAnswer sont maintenant spécifiques à chaque mode (quiz.js, challenge.js, adventure.js)

/* ======================
   POWER-UPS
   ====================== */
// ... (fonctions maybeSpawnPowerUp, applyPowerUp)

/* ======================
   GESTION DES VIES
   ====================== */
// ... (fonctions loseLife, updateLivesDisplay - maintenant intégrées à updateGameInfoBar)

/* ======================
   LEVEL UP (Mode Aventure principalement)
   ====================== */
// ... (fonctions levelUp, updateStars)

/* ======================
   ANIMATIONS
   ====================== */
// ... (fonctions moveCharacter, resetCharacterPosition, celebrate, getRandomColor)

/* ======================
   TIMER (Mode Défi principalement)
   ====================== */
// ... (variables et fonctions startTimer, resetTimer, updateTimerDisplay)

/* ======================
   MISE À JOUR UI (Général)
   ====================== */
// les mises à jour se font dans les fonctions spécifiques ou via updateGameInfoBar

// ... (fonctions updateTheme, updateAvatar)

/* ======================
   TABLEAU DE BORD & STATS
   ====================== */
// ... (fonctions updateProgressReport, updateStreakDisplay)

/* ======================
   GAME OVER
   ====================== */
// ... (fonctions gameOver, closeGameOver)

/* ======================
   CONTRÔLES
   ====================== */
// ... (fonctions restartGame, toggleExtremeMode, togglePauseResume)

/* ======================
   ÉVÉNEMENTS
   ====================== */
// Les écouteurs globaux sont maintenant dans main.js

/* ======================
   DÉFI QUOTIDIEN (Tâche 2.3)
   ====================== */

// Vérifie l'état du défi et le réinitialise si nécessaire
function checkDailyChallengeStatus() {
  if (!UserManager.getCurrentUser || !UserManager.getCurrentUser())
    return { status: 'unavailable' };

  const challengeData = loadDailyChallengeData();
  const today = getCurrentDateString();
  const dailyTable = getDailyChallengeTable();

  if (challengeData.completedDate === today) {
    return { status: 'completed', table: dailyTable, progress: DAILY_CHALLENGE_GOAL }; // Déjà complété aujourd'hui
  } else if (challengeData.lastPlayedDate !== today) {
    // Si c'est un nouveau jour, réinitialiser la progression
    challengeData.progress = 0;
    challengeData.lastPlayedDate = today; // Marquer qu'on a joué aujourd'hui
    saveDailyChallengeData(challengeData);
    return { status: 'new', table: dailyTable, progress: 0 };
  } else {
    // Défi en cours pour aujourd'hui
    return { status: 'in_progress', table: dailyTable, progress: challengeData.progress };
  }
}

// Met à jour la progression du défi après une bonne réponse
// Correction: Ajouter le paramètre multiplicand
function updateDailyChallengeProgress(answeredTable, answeredMultiplicand) {
  if (!UserManager.getCurrentUser || !UserManager.getCurrentUser()) return;

  const challengeStatus = checkDailyChallengeStatus();
  const dailyTable = parseInt(challengeStatus.table); // Assurer que c'est un nombre
  const tableNum = parseInt(answeredTable);
  const multiplicandNum = parseInt(answeredMultiplicand);

  // Debug: Afficher les valeurs et types avant la comparaison
  console.log(
    `Défi Quotidien Check: Table Répondue=${tableNum} (type: ${typeof tableNum}), Multiplicande Répondu=${multiplicandNum} (type: ${typeof multiplicandNum}), Table Défi=${dailyTable} (type: ${typeof dailyTable}), Statut=${challengeStatus.status}`
  );

  // Ne rien faire si déjà complété
  if (challengeStatus.status === 'completed') {
    console.log('Défi Quotidien: Déjà complété.'); // Debug
    return;
  }

  // Vérifier si SOIT la table SOIT le multiplicande correspond à la table du défi
  if (tableNum !== dailyTable && multiplicandNum !== dailyTable) {
    console.log('Défi Quotidien: Ni la table ni le multiplicande ne correspondent.'); // Debug
    return;
  }

  // Si on arrive ici, la réponse concerne la table du jour
  const challengeData = loadDailyChallengeData();
  challengeData.progress = (challengeData.progress || 0) + 1;
  challengeData.lastPlayedDate = getCurrentDateString(); // Mettre à jour la date de jeu

  console.log(
    `Progression défi quotidien: ${challengeData.progress}/${DAILY_CHALLENGE_GOAL} pour table ${dailyTable}`
  ); // Debug

  if (challengeData.progress >= DAILY_CHALLENGE_GOAL) {
    completeDailyChallenge(challengeData);
  } else {
    saveDailyChallengeData(challengeData);
    // Correction: Mettre à jour l'affichage immédiatement après sauvegarde
    displayDailyChallenge();
    // Optionnel: Afficher un petit feedback de progression ?
    // showMessage(`Défi quotidien : ${challengeData.progress}/${DAILY_CHALLENGE_GOAL}`);
  }
}

// Plus d'export global: ESM import depuis './game.js'

// Marque le défi comme complété et donne la récompense
function completeDailyChallenge(challengeData) {
  if (!UserManager.getCurrentUser || !UserManager.getCurrentUser()) return;

  challengeData.completedDate = getCurrentDateString();
  challengeData.progress = DAILY_CHALLENGE_GOAL; // Assurer que la progression est au max
  saveDailyChallengeData(challengeData);

  // Donner la récompense
  const userData = UserState.getCurrentUserData();
  userData.coins = (userData.coins || 0) + DAILY_CHALLENGE_REWARD;

  // Tâche 2.2: Incrémenter le compteur de défis complétés
  userData.dailyChallengesCompleted = (userData.dailyChallengesCompleted || 0) + 1;

  UserState.updateUserData(userData); // Sauvegarder les pièces et le compteur

  // Afficher une notification spéciale
  showMessage(
    getTranslation('daily_challenge_finished_message', { reward: DAILY_CHALLENGE_REWARD })
  );
  import('./badges.js')
    .then(({ checkAndUnlockBadge }) => {
      try {
        checkAndUnlockBadge('daily_challenger');
      } catch (e) {
        void e;
      }
    })
    .catch(e => {
      void e;
    });

  // Mettre à jour l'affichage du défi sur l'écran d'accueil (si affiché)
  displayDailyChallenge();
}

// Afficher le défi quotidien sur l'écran d'accueil
function displayDailyChallenge() {
  const container = document.getElementById('daily-challenge-container'); // ID à ajouter dans index.html (slide 1)
  if (!container) return;

  const challengeStatus = checkDailyChallengeStatus();
  // DOM construction handled below - old HTML string building removed
  // Construire DOM sans innerHTML
  while (container.firstChild) container.removeChild(container.firstChild);

  const h3 = document.createElement('h3');
  h3.setAttribute('data-translate', 'daily_challenge_title');
  h3.textContent = getTranslation('daily_challenge_title');
  container.appendChild(h3);

  if (challengeStatus.status === 'unavailable') {
    const p = document.createElement('p');
    p.setAttribute('data-translate', 'daily_challenge_connect_prompt');
    p.textContent = getTranslation('daily_challenge_connect_prompt');
    container.appendChild(p);
  } else {
    const pTable = document.createElement('p');
    // eslint-disable-next-line sonarjs/no-unsafe-string-usage -- False positive: getTranslation returns safe internal content, not user input
    const translatedHTML = getTranslation('daily_challenge_table_of_day', {
      table: challengeStatus.table,
    });
    // eslint-disable-next-line sonarjs/no-html-injection -- Safe: using appendSanitizedHTML for proper sanitization of internal content
    appendSanitizedHTML(pTable, translatedHTML);
    container.appendChild(pTable);

    if (challengeStatus.status === 'completed') {
      const pDone = document.createElement('p');
      pDone.className = 'challenge-completed';
      pDone.textContent = getTranslation('daily_challenge_completed', {
        reward: DAILY_CHALLENGE_REWARD,
      });
      container.appendChild(pDone);
    } else {
      const pObj = document.createElement('p');
      pObj.textContent = getTranslation('daily_challenge_objective', {
        goal: DAILY_CHALLENGE_GOAL,
        table: challengeStatus.table,
      });
      container.appendChild(pObj);

      const bar = document.createElement('div');
      bar.className = 'challenge-progress-bar';
      const barInner = document.createElement('div');
      const pct = (challengeStatus.progress / DAILY_CHALLENGE_GOAL) * 100;
      barInner.style.width = `${pct}%`;
      bar.appendChild(barInner);
      container.appendChild(bar);

      const pProg = document.createElement('p');
      pProg.textContent = getTranslation('daily_challenge_progress', {
        progress: challengeStatus.progress,
        goal: DAILY_CHALLENGE_GOAL,
      });
      container.appendChild(pProg);
    }
  }
}

// Expose for legacy compatibility
// Plus d'export global: ESM import depuis './game.js'

export { updateDailyChallengeProgress, displayDailyChallenge };
export default gameState;

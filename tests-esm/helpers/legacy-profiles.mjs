/**
 * Profils enregistrés par les versions déjà publiées, au format exact de leurs écrivains
 * (git : 58e16bf et 236de4b^ pour l'historique sans opération et l'ancienne Aventure,
 * 236de4b pour les quatre opérations, #78 et #80 pour Chrono). Les tests de migration et
 * la capture « avant / après » dans Chrome partent de cet instantané de localStorage :
 * - Zoé joue depuis septembre 2025, en × seulement : ancien format de l'Aventure, 31 quiz
 *   (20 gardés dans quizStats), 9 défis et 7 niveaux d'Aventure, soit 506 réponses dans
 *   progressHistory, cohérentes avec ces bilans ; trois classements Chrono (une ligne de sa
 *   liste garde le nom « errors » de la première version de la PR) ;
 * - Léa joue en × et en + depuis 2026, a changé de surnom (« Léa » → « Léa B. ») et retiré
 *   les tables 1 et 10 dans les Paramètres ;
 * - Tom vient d'être créé par la v36 et n'a jamais joué.
 * Déterministe : un générateur pseudo-aléatoire à graine fixe.
 */

let seed = 20251001;
const rnd = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};
const pick = list => list[Math.floor(rnd() * list.length)];
const T0 = Date.UTC(2025, 8, 20, 16, 0, 0); // 20/09/2025
const T2026 = Date.UTC(2026, 0, 10, 16, 0, 0); // après les quatre opérations (236de4b)
const DAY = 86400000;
const ANSWER_GAP = 20000;

/**
 * Une réponse de progressHistory au format de son époque : sans `operator` avant 236de4b
 * (Quiz, Défi avec sa difficulté, Aventure avec son niveau), avec ensuite.
 * `game` : opération, mode, ancien format, difficulté et niveau de la partie.
 */
function answerEntry({ fact, correct, timestamp, game }) {
  const { a, b } = fact;
  const { operator, mode, legacy, difficulty, level } = game;
  const answer = operator === '+' ? a + b : a * b;
  const entry = { question: `${a} ${operator} ${b} = ?`, correct, timestamp, mode };
  if (mode === 'challenge') entry.difficulty = difficulty;
  if (!legacy) entry.operator = operator;
  if (mode === 'adventure') entry.level = level;
  entry.userAnswer = correct ? answer : answer + 1;
  entry.correctAnswer = answer;
  return entry;
}

/** Les réponses d'une partie, jouées l'une après l'autre ; `correctFor` décide de chaque réponse */
function playGame({ count, start, game, factFor, correctFor }) {
  return Array.from({ length: count }, (_, i) => {
    const fact = factFor(i);
    return answerEntry({
      fact,
      correct: correctFor(fact.a, i),
      timestamp: start + i * ANSWER_GAP,
      game,
    });
  });
}

/** Bilan d'un quiz, comme QuizMode.saveResults (meilleure série de toujours : défaut connu) */
function quizEntry(answers, date, bestStreakSoFar) {
  const correct = answers.filter(entry => entry.correct).length;
  return {
    score: correct * 10,
    correct,
    total: answers.length,
    errors: answers.length - correct,
    successRate: Math.round((correct / answers.length) * 100),
    maxStreak: bestStreakSoFar,
    date,
    excludedTables: [],
  };
}

/** Bilan d'un défi, comme ChallengeMode.saveResults */
function challengeEntry(answers, score, date) {
  const correct = answers.filter(entry => entry.correct).length;
  return {
    score,
    correct,
    total: answers.length,
    successRate: Math.round((correct / answers.length) * 100),
    maxStreak: 3,
    bonusTime: 2,
    date,
  };
}

function challengeBlock(games) {
  const history = games.map(game => game.entry).sort((x, y) => y.score - x.score);
  return {
    bestScore: Math.max(...games.map(game => game.entry.score)),
    totalPlayed: games.length,
    totalCorrect: games.reduce((sum, game) => sum + game.entry.correct, 0),
    totalQuestions: games.reduce((sum, game) => sum + game.entry.total, 0),
    history: history.slice(0, 10),
  };
}

const randomFact = tables => () => ({ a: pick(tables), b: 1 + Math.floor(rnd() * 10) });
const tableFact = table => i => ({ a: table, b: (i % 10) + 1 });

/**
 * Zoé : tout en multiplication. Avant 2026, elle rate souvent la table de 7 et la table de 8 ;
 * depuis, la table de 7 est rattrapée (« À revoir » sur tout l'historique, pas sur les 20
 * dernières réponses) et la table de 8 reste fragile.
 */
function buildZoe() {
  const history = [];
  const quizzes = [];
  const errorRate = (era, table) => {
    if (table === 7) return era === 'old' ? 0.6 : 0.05;
    if (table === 8) return era === 'old' ? 0.45 : 0.4;
    return 0.1;
  };
  const errsFor = era => table => rnd() >= errorRate(era, table);
  let clock = T0;
  let bestStreak = 0;
  const quizGame = era => {
    const tables = era === 'old' ? [2, 3, 4, 6, 7, 7, 8, 8, 9] : [2, 3, 4, 5, 6, 7, 8, 8, 9];
    const answers = playGame({
      count: 10,
      start: clock,
      game: { operator: '×', mode: 'quiz', legacy: era === 'old' },
      factFor: randomFact(tables),
      correctFor: errsFor(era),
    });
    let run = 0;
    for (const entry of answers) {
      run = entry.correct ? run + 1 : 0;
      bestStreak = Math.max(bestStreak, run);
    }
    history.push(...answers);
    quizzes.push(quizEntry(answers, clock + 10 * ANSWER_GAP, bestStreak));
    clock += DAY;
  };
  const challengeGames = { easy: [], medium: [], hard: [] };
  const challengeGame = (difficulty, score) => {
    const answers = playGame({
      count: 14,
      start: clock,
      game: { operator: '×', mode: 'challenge', legacy: true, difficulty },
      factFor: randomFact([3, 4, 6, 7, 7, 8, 9]),
      correctFor: errsFor('old'),
    });
    history.push(...answers);
    challengeGames[difficulty].push({ entry: challengeEntry(answers, score, clock) });
    clock += DAY;
  };
  const adventureAttempt = (level, table, correctCount) => {
    const answers = playGame({
      count: 10,
      start: clock,
      game: { operator: '×', mode: 'adventure', legacy: true, level },
      factFor: tableFact(table),
      correctFor: (_a, i) => correctCount > i,
    });
    history.push(...answers);
    clock += DAY / 2;
  };

  // Automne 2025 (format sans opération) : 11 quiz, 9 défis, 7 niveaux d'Aventure réussis
  for (let i = 0; i < 6; i += 1) quizGame('old');
  [120, 100, 90, 80, 70].forEach(score => challengeGame('easy', score));
  adventureAttempt(1, 1, 8);
  adventureAttempt(1, 1, 10);
  adventureAttempt(2, 2, 7);
  [160, 140, 120].forEach(score => challengeGame('medium', score));
  challengeGame('hard', 210);
  adventureAttempt(3, 5, 6);
  adventureAttempt(3, 5, 8);
  adventureAttempt(3, 5, 9);
  adventureAttempt(4, 10, 5);
  for (let i = 0; i < 5; i += 1) quizGame('old');
  // 2026 (avec opération) : 20 quiz
  clock = T2026;
  for (let i = 0; i < 20; i += 1) quizGame('new');

  return {
    history,
    quizStats: {
      history: quizzes.slice(-20),
      bestScore: Math.max(...quizzes.map(quiz => quiz.score)),
      totalQuizzes: quizzes.length,
    },
    challengeStats: {
      easy: challengeBlock(challengeGames.easy),
      medium: challengeBlock(challengeGames.medium),
      hard: challengeBlock(challengeGames.hard),
    },
    bestStreak,
  };
}

/** Léa : en 2026, des quiz, un défi et des niveaux d'Aventure en × et en + */
function buildLea() {
  const history = [];
  const quizzes = [];
  let clock = T2026 + 30 * DAY;
  const ok = () => rnd() > 0.2;
  const quiz = operator => {
    const answers = playGame({
      count: 10,
      start: clock,
      game: { operator, mode: 'quiz' },
      factFor: randomFact([2, 3, 4, 5, 6, 7, 8, 9]),
      correctFor: ok,
    });
    history.push(...answers);
    quizzes.push(quizEntry(answers, clock + 10 * ANSWER_GAP, 9));
    clock += DAY;
  };
  const challenges = [];
  const challenge = (operator, score) => {
    const answers = playGame({
      count: 14,
      start: clock,
      game: { operator, mode: 'challenge', difficulty: 'medium' },
      factFor: randomFact([2, 3, 4, 5, 6, 7, 8, 9]),
      correctFor: ok,
    });
    history.push(...answers);
    challenges.push({ entry: challengeEntry(answers, score, clock) });
    clock += DAY;
  };
  const adventure = (operator, level, table, correctCount) => {
    const answers = playGame({
      count: 10,
      start: clock,
      game: { operator, mode: 'adventure', level },
      factFor: operator === '×' ? tableFact(table) : randomFact([1, 2, 3, 4, 5]),
      correctFor: (_a, i) => correctCount > i,
    });
    history.push(...answers);
    clock += DAY / 2;
  };
  quiz('×');
  quiz('+');
  adventure('×', 1, 1, 10);
  adventure('×', 2, 2, 8);
  adventure('×', 2, 2, 9);
  challenge('×', 140);
  quiz('+');
  adventure('+', 1, 0, 7);
  adventure('+', 2, 0, 9);
  adventure('+', 3, 0, 5);
  adventure('+', 3, 0, 6);
  challenge('+', 110);
  quiz('×');
  return {
    history,
    quizStats: {
      history: quizzes,
      bestScore: Math.max(...quizzes.map(entry => entry.score)),
      totalQuizzes: quizzes.length,
    },
    challengeStats: { medium: challengeBlock(challenges) },
  };
}

const session = (durationMs, date) => ({ durationMs, date });
const bucket = (key, durations, start) => {
  const sessions = durations.map((ms, i) => session(ms, start + i * DAY));
  return {
    key,
    count: durations.length,
    totalMs: durations.reduce((s, ms) => s + ms, 0),
    best: [...sessions].sort((l, r) => l.durationMs - r.durationMs || l.date - r.date).slice(0, 10),
    recent: [...sessions].slice(-20),
  };
};

const CHRONO_START = Date.UTC(2026, 9, 5, 18, 0, 0); // 05/10/2026, sortie de Chrono (#78)

const zoeGames = buildZoe();
const zoe = {
  // Champs morts toujours présents (DEFAULT_USER_DATA depuis 58e16bf)
  bestScore: 0,
  wrongAnswers: {},
  progressHistory: zoeGames.history,
  avatar: 'panda',
  nickname: 'Zoé',
  theme: 'forest',
  colorTheme: 'default',
  unlockedAvatars: ['fox'],
  unlockedBadges: [
    'quiz_starter',
    'adventurer',
    'perfect_quiz',
    'daily_challenger',
    'challenge_accepted',
  ],
  volume: 0.8,
  dailyChallengesCompleted: 4,
  parentalLockEnabled: true,
  starsByTable: { 1: 3, 2: 2, 5: 3, 10: 1 },
  coins: 143,
  preferredOperator: '×',
  // Ancien format de l'Aventure (236de4b^ : saveAdventureProgress), niveaux × 1 à 4
  adventureProgress: {
    1: { completed: true, stars: 3, table: 1, lastPlayed: T0 + 2 * DAY, attempts: 2 },
    2: { completed: true, stars: 2, table: 2, lastPlayed: T0 + 3 * DAY, attempts: 1 },
    3: { completed: true, stars: 3, table: 5, lastPlayed: T0 + 5 * DAY, attempts: 3 },
    4: { completed: true, stars: 1, table: 10, lastPlayed: T0 + 9 * DAY, attempts: 1 },
  },
  quizStats: zoeGames.quizStats,
  challengeStats: zoeGames.challengeStats,
  bestStreak: zoeGames.bestStreak,
  dailyChallenge: { completedDate: '2026-10-06', progress: 5, lastPlayedDate: '2026-10-06' },
  discoveryProgress: { exploredTables: [7, 3], lastExplored: T0 + 100 * DAY },
  tablePreferences: { globalExclusions: [], globalEnabled: false },
  // Chrono (#78, #80) : trois classements ; une ligne de la liste garde « errors », nom de la
  // première version de la PR, jamais publiée
  chronoStats: {
    buckets: [
      bucket(
        '1,2,3,4,5,6,7,8,9,10|keypad',
        [48200, 41900, 39400, 44100, 36800, 35200],
        CHRONO_START
      ),
      bucket('7|mcq', [21800, 19400], CHRONO_START + DAY / 2),
      bucket('2,3,4,5,6,7,8,9,10|keypad', [52300], CHRONO_START + DAY),
    ],
    basket: [
      { a: 6, b: 7, due: 2 },
      { a: 8, b: 9, due: 1 },
      { a: 7, b: 8, errors: 2 },
    ],
    lastInputMode: 'mcq',
  },
};

const leaGames = buildLea();
const lea = {
  bestScore: 0,
  wrongAnswers: {},
  progressHistory: leaGames.history,
  avatar: 'unicorn',
  nickname: 'Léa B.',
  theme: 'forest',
  colorTheme: 'default',
  unlockedAvatars: ['fox'],
  unlockedBadges: ['quiz_starter', 'adventurer', 'star_collector', 'challenge_accepted'],
  volume: 1,
  dailyChallengesCompleted: 0,
  parentalLockEnabled: false,
  starsByTable: { 1: 3, 2: 3 },
  coins: 61,
  preferredOperator: '+',
  // Format des quatre opérations (236de4b) : la table n'existe qu'en ×
  adventureProgressByOperator: {
    '×': {
      1: { completed: true, stars: 3, table: 1, lastPlayed: T2026 + 32 * DAY, attempts: 1 },
      2: { completed: true, stars: 3, table: 2, lastPlayed: T2026 + 33 * DAY, attempts: 2 },
    },
    '+': {
      1: {
        completed: true,
        stars: 2,
        difficulty: 'easy',
        lastPlayed: T2026 + 35 * DAY,
        attempts: 1,
      },
      2: {
        completed: true,
        stars: 3,
        difficulty: 'easy',
        lastPlayed: T2026 + 36 * DAY,
        attempts: 1,
      },
      3: {
        completed: true,
        stars: 1,
        difficulty: 'easy',
        lastPlayed: T2026 + 37 * DAY,
        attempts: 2,
      },
    },
  },
  quizStats: leaGames.quizStats,
  challengeStats: leaGames.challengeStats,
  bestStreak: 9,
  dailyChallenge: { completedDate: null, progress: 2, lastPlayedDate: '2026-10-07' },
  discoveryProgress: { exploredTables: ['+:easy', '+:medium'], lastExplored: T2026 + 40 * DAY },
  tablePreferences: { globalExclusions: [1, 10], globalEnabled: true },
  chronoStats: {
    buckets: [bucket('2,3,4,5,6,7,8,9|keypad', [58100, 51700], CHRONO_START)],
    basket: [{ a: 3, b: 9, due: 1 }],
    lastInputMode: 'keypad',
  },
};

// Profil créé par la v36 (createDefaultUserData) et jamais joué
const tom = {
  bestScore: 0,
  wrongAnswers: {},
  progressHistory: [],
  avatar: 'fox',
  nickname: 'Tom',
  theme: 'forest',
  colorTheme: 'default',
  unlockedAvatars: ['fox'],
  unlockedBadges: [],
  volume: 1,
  dailyChallengesCompleted: 0,
  parentalLockEnabled: false,
  starsByTable: {},
  coins: 0,
  preferredOperator: '×',
  tablePreferences: { globalExclusions: [], globalEnabled: false },
  chronoStats: { buckets: [], basket: [], lastInputMode: 'keypad' },
};

function buildSnapshot() {
  return {
    players: { Zoé: zoe, Léa: lea, Tom: tom },
    // Scores d'Arcade : top 5 sous le SURNOM (arcade-scores.js), pas sous la clé du profil
    arcadeScores_Zoé: [1500, 1200, 800, 300, 0],
    arcadeScores_multimiam_Zoé: [640, 420, 380, 200, 100],
    arcadeScores_multimemory_Zoé: [140, 120],
    arcadeScores_multisnake_Zoé: [900, 400, 150],
    // Léa a changé de surnom : ses anciens scores (« Léa ») ne s'affichent plus aujourd'hui
    arcadeScores_Léa: [700],
    'arcadeScores_Léa B.': [300, 0],
    'arcadeScores_multisnake_Léa B.': [200],
    // Statistiques communes à l'appareil (operation-stats.js) et ancienne clé (mult-stats.js)
    operationStats: {
      '7×8': { operator: '×', a: 7, b: 8, attempts: 9, errors: 4, lastAttempt: CHRONO_START },
      '6×7': { operator: '×', a: 6, b: 7, attempts: 7, errors: 3, lastAttempt: CHRONO_START },
      '7+4': { operator: '+', a: 7, b: 4, attempts: 3, errors: 0, lastAttempt: CHRONO_START },
    },
    multiplicationStats: { '7x8': { attempts: 5, errors: 2 }, '6x7': { attempts: 4, errors: 1 } },
    language: 'fr',
  };
}

const SNAPSHOT = JSON.stringify(buildSnapshot());

/** Copie neuve de l'instantané : { clé localStorage → valeur } */
export function legacySnapshot() {
  return JSON.parse(SNAPSHOT);
}

/** Copie neuve des profils (`players`) de l'instantané */
export function legacyPlayers() {
  return legacySnapshot().players;
}

/** Écrit l'instantané dans un stockage (localStorage par défaut), comme l'aurait fait le jeu */
export function seedLegacyStorage(storage = globalThis.localStorage) {
  for (const [key, value] of Object.entries(legacySnapshot())) {
    storage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }
}

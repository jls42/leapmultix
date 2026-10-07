/**
 * Mise en place commune des tests de Chrono : modules simulés autour du mode, pilotage
 * d'une partie et suivi des instances créées. Les appels à jest.unstable_mockModule
 * restent dans chaque fichier de test : le chemin d'un module simulé se lit depuis le
 * fichier qui l'enregistre.
 */

/** Chargement paresseux : rien à charger */
export function createLazyLoaderMock() {
  return { lazyLoader: { loadForGameMode: async () => {} } };
}

/** Jeu : état partagé et Défi du jour, dont le test observe les appels */
export function createGameMock(jestApi, updateDailyChallengeProgress) {
  const gameState = { gameMode: null, avatar: 'fox', streak: 0 };
  return {
    gameState,
    default: gameState,
    updateDailyChallengeProgress,
    displayDailyChallenge: jestApi.fn(),
  };
}

/** Voix : la phrase dite et le préchargement, observés par le test ; le reste, neutre */
export function createSpeechMock({ speak, preloadSpeech }) {
  return {
    speak,
    preloadSpeech,
    isVoiceEnabled: () => true,
    updateSpeechVoice: () => {},
    cancelSpeech: () => {},
    whenSpeechEnds: () => Promise.resolve(),
  };
}

/**
 * Navigation comme slides.js : quitter un écran arrête Chrono, sauf pendant son propre
 * démarrage par l'orchestrateur (c'est ce qui protège une relance depuis les résultats).
 * `refs` reçoit l'orchestrateur et le module de Chrono une fois importés.
 */
export function createChronoNavigation(jestApi, refs) {
  return jestApi.fn(async () => {
    if (refs.orchestrator?.getStartingMode() !== 'chrono') refs.chronoModule?.stopChronoMode();
  });
}

/**
 * Chaque Chrono démarré rejoint la liste rendue par `getInstances` : on voit ainsi
 * qu'aucune partie ne tourne encore après un retour à l'accueil.
 */
export function trackChronoInstances(jestApi, ChronoMode, getInstances) {
  const realStart = ChronoMode.prototype.start;
  return jestApi.spyOn(ChronoMode.prototype, 'start').mockImplementation(function start(...args) {
    getInstances().push(this);
    return realStart.apply(this, args);
  });
}

/** Question connue, comme le ferait le tirage */
function showQuestion(chrono, a, b) {
  chrono.state.currentQuestion = {
    question: `${a} × ${b} = ?`,
    answer: a * b,
    type: chrono.inputMode === 'mcq' ? 'mcq' : 'classic',
    operator: '×',
    a,
    b,
    table: a,
    num: b,
  };
  chrono.displayQuestion();
  chrono.onQuestionGenerated();
}

/** Texte du retour affiché après une réponse */
function feedbackText() {
  return document.querySelector('.chrono-feedback')?.textContent ?? '';
}

/**
 * Pilote d'une partie : démarrer comme un clic sur la tuile, poser une question connue,
 * répondre juste ou faux, lire le retour affiché.
 */
export function createChronoDriver(jestApi, refs, getInstances) {
  const flush = (ms = 0) => jestApi.advanceTimersByTimeAsync(ms);

  async function startChrono({ revision = false, inputMode = 'keypad' } = {}) {
    await refs.orchestrator.setGameMode('chrono');
    await flush();
    const chrono = getInstances().at(-1);
    chrono.setInputMode(inputMode);
    await chrono.beginSession(revision);
    return chrono;
  }

  /** Répond à la question affichée, juste ou faux, puis laisse passer le retour */
  async function answer(chrono, correct = true, waitMs = 800) {
    const { answer: expected } = chrono.state.currentQuestion;
    chrono.handleAnswer(correct ? expected : expected + 1);
    await flush(waitMs);
  }

  return { flush, startChrono, showQuestion, answer, feedbackText };
}

/** Ni son ni journal pendant un test, et une horloge simulée */
export function quietFakeTime(jestApi, AudioManager) {
  jestApi.spyOn(AudioManager, 'playSound').mockImplementation(() => {});
  jestApi.spyOn(console, 'warn').mockImplementation(() => {});
  jestApi.spyOn(console, 'log').mockImplementation(() => {});
  jestApi.useFakeTimers();
}

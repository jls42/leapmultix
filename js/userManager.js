/**
 * Module de Gestion des Utilisateurs
 * Centralise toute la logique de gestion des utilisateurs, profils, et données persistantes
 * Phase 3.1 - Extraction depuis main.js
 */
import {
  getTranslation,
  updateBackgroundByAvatar,
  updateWelcomeMessageUI,
  updateCoinDisplay,
} from './utils-es6.js';
import { HEAD_SIZES, setAvatarHead } from './avatar-heads.js';
import { getCurrentLanguage } from './i18n-store.js';
import Storage from './core/storage.js';
import { checkUsername, normalizeUsername, USERNAME_MAX_LENGTH } from './security-utils.js';
import { VideoManager } from './VideoManager.js';
import { AudioManager } from './core/audio.js';
import { createVirtualKeyboard } from './virtual-keyboard.js';
import { goToSlide } from './slides.js';
import { gameState, displayDailyChallenge } from './game.js';
import { normalizeAdventureProgressByOperator } from './core/adventure-progress.js';
import { normalizeModeStats, emptyModeStats, ARCADE_GAMES } from './core/mode-stats.js';
import { eventBus } from './core/eventBus.js';
import {
  normalizeChronoStats,
  normalizeChronoStatsByOperator,
  emptyChronoStats,
} from './core/chrono-stats.js';
import { profileOperationStats } from './core/profile-operation-stats.js';
import { TRASH_DAYS, isTrashExpired, loadTrash, saveTrash } from './core/players-trash.js';
import { buildPlayersBackup, requestPersistentStorage } from './core/players-backup.js';
import { confirmDialog } from './components/confirm-dialog.js';

/**
 * Traduction avec texte de secours tant que la clé n'existe pas dans les fichiers de langue.
 * @param {string} key
 * @param {string} fallback
 * @param {Object} [params]
 * @returns {string}
 */
const translateOr = (key, fallback, params = {}) => {
  const value = getTranslation(key, params);
  return typeof value === 'string' && !/^\[.*\]$/.test(value) ? value : fallback;
};

const DEFAULT_TABLE_PREFERENCES = Object.freeze({
  globalExclusions: [],
  globalEnabled: false,
});

const DEFAULT_USER_DATA = Object.freeze({
  bestScore: 0,
  wrongAnswers: {},
  progressHistory: [],
  avatar: 'fox',
  nickname: '',
  theme: 'forest',
  colorTheme: 'default',
  unlockedAvatars: ['fox'],
  unlockedBadges: [],
  volume: 1,
  dailyChallengesCompleted: 0,
  starsByTable: {},
  coins: 0,
  preferredOperator: '×',
});

const ensureArray = (value, fallback = []) => (Array.isArray(value) ? [...value] : [...fallback]);

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const ensureObject = (value, fallback = {}) =>
  value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : { ...fallback };

const ensureNumber = (value, fallback = 0) => (Number.isFinite(value) ? Number(value) : fallback);

const createDefaultUserData = (nickname = '') => ({
  ...DEFAULT_USER_DATA,
  wrongAnswers: {},
  progressHistory: [],
  unlockedAvatars: [...DEFAULT_USER_DATA.unlockedAvatars],
  unlockedBadges: [],
  starsByTable: {},
  tablePreferences: { ...DEFAULT_TABLE_PREFERENCES, globalExclusions: [] },
  preferredOperator: '×',
  nickname,
  chronoStats: emptyChronoStats(),
  chronoStatsByOperator: normalizeChronoStatsByOperator(),
  modeStats: emptyModeStats(),
  operationStats: {},
});

/** Clé localStorage des 5 meilleurs scores d'un jeu d'Arcade, rangés sous le surnom (avant la v37) */
const legacyArcadeKey = (game, nickname) =>
  game === 'invasion' ? `arcadeScores_${nickname}` : `arcadeScores_${game}_${nickname}`;

/** Surnom sous lequel arcade-scores.js rangeait les scores : le surnom affiché, sans espaces autour */
const legacyArcadeOwner = (raw, currentUser) => String(raw.nickname || currentUser || '').trim();

/**
 * Les 5 meilleurs scores d'un jeu d'Arcade d'avant la v37, pour l'amorçage des compteurs
 * @param {string} nickname
 * @returns {(game: string) => number[]}
 */
const legacyArcadeReader = nickname => game => {
  if (!nickname) return [];
  const scores = Storage.get(legacyArcadeKey(game, nickname), []);
  return Array.isArray(scores) ? scores : [];
};

/**
 * Profil à emporter dans une sauvegarde : un profil jamais rouvert depuis l'arrivée des
 * statistiques par profil emporte sa copie de celles de l'appareil
 * @param {*} data
 * @returns {*}
 */
const withOwnOperationStats = data =>
  isPlainObject(data) && !Object.hasOwn(data, 'operationStats')
    ? { ...data, operationStats: profileOperationStats(data) }
    : data;

const normalizeUserData = (rawData, currentUser) => {
  // raw.x vaut exactement rawData?.x, quelle que soit la valeur reçue
  const raw = rawData ?? {};
  const tablePreferences = ensureObject(raw.tablePreferences, DEFAULT_TABLE_PREFERENCES);
  const chronoStats = normalizeChronoStats(raw.chronoStats);
  const chronoStatsByOperator = normalizeChronoStatsByOperator(raw.chronoStatsByOperator);
  const adventureProgressByOperator = normalizeAdventureProgressByOperator(
    raw.adventureProgressByOperator,
    raw.adventureProgress
  );
  // Compteurs du tableau de bord, amorcés une fois depuis l'existant déjà normalisé
  // (core/mode-stats.js) : un classement que la normalisation écarte ne compte pas non plus
  const modeStats = normalizeModeStats(
    { ...raw, chronoStats, chronoStatsByOperator, adventureProgressByOperator },
    legacyArcadeReader(legacyArcadeOwner(raw, currentUser))
  );

  return {
    ...DEFAULT_USER_DATA,
    ...rawData,
    bestScore: ensureNumber(raw.bestScore, 0),
    wrongAnswers: ensureObject(raw.wrongAnswers),
    progressHistory: ensureArray(raw.progressHistory),
    avatar: raw.avatar || 'fox',
    nickname: raw.nickname || currentUser,
    theme: raw.theme || 'forest',
    colorTheme: raw.colorTheme || 'default',
    unlockedAvatars: ensureArray(raw.unlockedAvatars, ['fox']),
    unlockedBadges: ensureArray(raw.unlockedBadges),
    volume: Number.isFinite(raw.volume) ? raw.volume : 1,
    dailyChallengesCompleted: ensureNumber(raw.dailyChallengesCompleted, 0),
    starsByTable: ensureObject(raw.starsByTable),
    coins: ensureNumber(raw.coins, 0),
    preferredOperator: raw.preferredOperator || '×',
    chronoStats,
    // Chrono hors multiplication : un champ à part, que le code d'avant recopie sans y toucher
    chronoStatsByOperator,
    // L'ancienne Aventure (× seule, avant décembre 2025) recopiée dans la multiplication
    adventureProgressByOperator,
    modeStats,
    tablePreferences: {
      ...DEFAULT_TABLE_PREFERENCES,
      ...tablePreferences,
      globalExclusions: ensureArray(tablePreferences.globalExclusions),
      globalEnabled: tablePreferences.globalEnabled === true,
    },
  };
};

/**
 * Profil relu : champs normalisés, plus les calculs ratés de ce joueur seul (tirage du Quiz).
 * Un profil d'avant ce champ part de la copie de la clé commune à l'appareil
 * (core/profile-operation-stats.js).
 * @param {Object|null|undefined} rawData
 * @param {string} currentUser
 * @returns {Object}
 */
const normalizeProfile = (rawData, currentUser) => ({
  ...normalizeUserData(rawData, currentUser),
  operationStats: profileOperationStats(rawData),
});

/**
 * Gestionnaire principal des utilisateurs
 */
export const UserManager = {
  // État interne
  _currentUser: null,
  _players: {},
  _persistenceRequested: false,

  /**
   * Initialiser le gestionnaire d'utilisateurs
   */
  init() {
    // Charger les joueurs depuis le stockage
    this._players = this.loadPlayers();
    // Corbeille : les joueurs supprimés depuis plus de TRASH_DAYS jours sont effacés
    this.purgeExpiredTrash();

    // Initialiser l'interface utilisateur
    this.initUI();

    // Les tuiles portent des libellés traduits (« Supprimer », nom accessible) :
    // les régénérer quand la langue change
    eventBus.on('languageChanged', () => this.refreshUserList());
  },

  /**
   * Obtenir l'utilisateur actuellement connecté
   * @returns {string|null} Nom de l'utilisateur ou null
   */
  getCurrentUser() {
    return this._currentUser;
  },

  /**
   * Obtenir tous les joueurs
   * @returns {Object} Objet des joueurs {nom: données}
   */
  getAllPlayers() {
    return { ...this._players };
  },

  /**
   * Obtenir les données de l'utilisateur actuel
   * @returns {Object} Données utilisateur avec valeurs par défaut
   */
  getCurrentUserData() {
    if (
      !this._currentUser ||
      !Object.prototype.hasOwnProperty.call(this._players, this._currentUser)
    ) {
      return createDefaultUserData(this._currentUser || '');
    }

    const normalized = normalizeProfile(this._players[this._currentUser], this._currentUser);
    this._players[this._currentUser] = normalized;
    return normalized;
  },

  /**
   * Sauvegarder les données de l'utilisateur actuel
   * @param {Object} gameState - État actuel du jeu
   */
  saveCurrentUserData(gameState) {
    if (
      !this._currentUser ||
      !Object.prototype.hasOwnProperty.call(this._players, this._currentUser)
    )
      return;

    const userData = this._players[this._currentUser];

    // Mettre à jour le meilleur score
    userData.bestScore = Math.max(userData.bestScore || 0, gameState.score || 0);

    // Fusionner les erreurs
    userData.wrongAnswers = {
      ...userData.wrongAnswers,
      ...gameState.wrongAnswers,
    };

    // Ajouter l'historique
    userData.progressHistory = [...userData.progressHistory, ...gameState.progressHistory];

    // Sauvegarder les nouvelles propriétés
    userData.avatar = gameState.avatar;
    userData.nickname = gameState.nickname || this._currentUser;
    userData.theme = gameState.theme;
    userData.colorTheme = gameState.colorTheme;
    userData.unlockedAvatars = gameState.unlockedAvatars;
    userData.volume = gameState.volume;

    // Sauvegarder dans le stockage
    this.savePlayers();
  },

  /**
   * Mettre à jour directement les données de l'utilisateur actuel
   * @param {Object} updatedData - Données à fusionner
   * @returns {boolean} Vrai si un joueur courant a reçu ces données
   */
  updateCurrentUserData(updatedData) {
    if (
      !this._currentUser ||
      !Object.prototype.hasOwnProperty.call(this._players, this._currentUser)
    )
      return false;

    this._players[this._currentUser] = {
      ...this._players[this._currentUser],
      ...updatedData,
    };

    this.savePlayers();
    return true;
  },

  /**
   * Met à jour les paramètres audio pour l'utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @private
   */
  _updateAudioSettings(userData) {
    try {
      AudioManager.loadPreferences();
      AudioManager.updateVolumeControls();
      const vol = userData.volume !== undefined ? userData.volume : 1;
      AudioManager.setVolume(vol);
    } catch {
      // AudioManager peut ne pas être initialisé
    }
  },

  /**
   * Met à jour l'interface utilisateur pour l'utilisateur sélectionné
   * @param {Object} userData - Données de l'utilisateur
   * @private
   */
  _updateUIForUser(userData) {
    const avatar = userData.avatar || 'fox';
    // Un monde illustré fixe par avatar (plus de rotation du fond)
    updateBackgroundByAvatar(avatar);
    void updateWelcomeMessageUI();
    updateCoinDisplay();

    const heroMascotImg = document.getElementById('hero-mascot-img');
    if (heroMascotImg) {
      setAvatarHead(heroMascotImg, avatar, HEAD_SIZES.mascot);
      // Décorative : la bulle porte le message
      heroMascotImg.alt = '';
    }
  },

  /**
   * Rafraîchit les composants liés aux opérations
   * @private
   */
  _refreshOperationComponents() {
    try {
      const container = document.getElementById('operation-selector-container');
      if (!container || container.children.length === 0) return;

      import('./components/operationSelector.js')
        .then(module => module.OperationSelector.refresh('operation-selector-container'))
        .catch(e => console.warn('OperationSelector refresh failed:', e));

      import('./components/operationModeAvailability.js')
        .then(module => module.updateModeButtonsAvailability())
        .catch(e => console.warn('updateModeButtonsAvailability failed:', e));

      import('./components/topBar.js')
        .then(module => module.TopBar.updateTableSettingsButtonVisibility?.())
        .catch(e => console.warn('TopBar.updateTableSettingsButtonVisibility failed:', e));
    } catch {
      // Composants peuvent ne pas être initialisés
    }
  },

  /**
   * Nettoie les scores par défaut du localStorage
   * @private
   */
  _cleanupDefaultScores() {
    this._removeLegacyArcadeScores(['default']);
  },

  /**
   * Retire les clés d'Arcade d'avant la v37 (arcadeScores_<surnom>), pour ces surnoms
   * @param {string[]} owners
   * @private
   */
  _removeLegacyArcadeScores(owners) {
    for (const owner of new Set(owners.filter(Boolean))) {
      for (const game of ARCADE_GAMES) {
        try {
          localStorage.removeItem(legacyArcadeKey(game, owner));
        } catch {
          // Stockage indisponible : rien à effacer
        }
      }
    }
  },

  /**
   * Sélectionner un utilisateur
   * @param {string} name - Nom de l'utilisateur
   * @returns {Object|null} Données de l'utilisateur sélectionné ou null si non trouvé
   */
  selectUser(name) {
    const raw = typeof name === 'string' ? name : '';
    // Clé exacte d'abord : les prénoms rangés par l'ancienne règle (« Léa B. ») restent valables
    const key = Object.prototype.hasOwnProperty.call(this._players, raw)
      ? raw
      : normalizeUsername(raw);

    if (!Object.prototype.hasOwnProperty.call(this._players, key)) {
      console.error(`Utilisateur "${name}" non trouvé`);
      return null;
    }

    this._currentUser = key;
    const userData = this.getCurrentUserData();

    // Mettre à jour gameState global
    try {
      gameState.avatar = userData.avatar || 'fox';
      gameState.nickname = userData.nickname || name;
    } catch {
      // gameState peut ne pas être disponible
    }

    // Mettre à jour les paramètres et l'interface
    this._updateAudioSettings(userData);
    this._updateUIForUser(userData);
    this._refreshOperationComponents();

    // Afficher le défi quotidien si disponible
    try {
      displayDailyChallenge();
    } catch {
      // Défi quotidien peut ne pas être disponible
    }

    this._cleanupDefaultScores();
    this._requestPersistenceOnce();
    void goToSlide(1);
    this.emitUserChanged(userData);

    return userData;
  },

  /**
   * Une fois par séance, au premier joueur choisi : le navigateur est prié de garder les
   * joueurs (Firefox peut poser la question, Chrome décide seul)
   * @private
   */
  _requestPersistenceOnce() {
    if (this._persistenceRequested) return;
    this._persistenceRequested = true;
    void requestPersistentStorage();
  },

  /**
   * Créer un nouveau utilisateur
   * @param {string} name - Nom du nouvel utilisateur
   * @param {string} avatar - Avatar sélectionné
   * @returns {boolean} Succès de la création
   */
  createUser(name, avatar = 'fox') {
    // Le prénom est gardé tel qu'il est écrit, ou refusé : jamais modifié en silence
    const { name: key, problem } = checkUsername(name);
    if (problem) {
      console.error(`Nom d'utilisateur refusé (${problem})`);
      return false;
    }

    // Déjà dans la liste, ou dans la corbeille (d'où il se restaure)
    if (this._nameTaken(key)) {
      console.error('Un utilisateur avec ce nom existe déjà');
      return false;
    }

    // Créer le nouvel utilisateur
    Object.defineProperty(this._players, key, {
      value: {
        bestScore: 0,
        wrongAnswers: {},
        progressHistory: [],
        avatar: avatar,
        nickname: key,
        theme: 'forest',
        colorTheme: 'default',
        unlockedAvatars: [avatar],
        unlockedBadges: [],
        volume: 1,
        dailyChallengesCompleted: 0,
        starsByTable: {},
        coins: 0,
        // Compteurs vierges : un nouveau profil ne reprend pas les anciens scores d'Arcade
        // d'un homonyme supprimé (clés rangées sous le surnom avant la v37)
        modeStats: emptyModeStats(),
        // Ni les calculs ratés des autres joueurs de l'appareil
        operationStats: {},
      },
      enumerable: true,
      configurable: true,
      writable: true,
    });

    // Sauvegarder
    this.savePlayers();

    // 🎬 Jouer la vidéo d'introduction de l'avatar si VideoManager est disponible
    if (VideoManager?.CHARACTER_VIDEOS?.has(avatar)) {
      // Callback pour sélectionner l'utilisateur après la vidéo
      VideoManager.playCharacterIntro(avatar, () => {
        this.selectUser(key);
      });
    }

    return true;
  },

  /**
   * Supprimer un utilisateur : il part dans la corbeille avec toutes ses données (rien n'est
   * effacé avant purgeExpiredTrash, TRASH_DAYS jours plus tard)
   * @param {string} name - Nom de l'utilisateur à supprimer
   * @returns {boolean} Succès de la suppression
   */
  deleteUser(name) {
    const key = Object.prototype.hasOwnProperty.call(this._players, name)
      ? name
      : normalizeUsername(name);
    if (!Object.prototype.hasOwnProperty.call(this._players, key)) {
      console.error(`Utilisateur "${name}" non trouvé`);
      return false;
    }

    const trash = loadTrash();
    trash.push({ name: key, deletedAt: Date.now(), data: Reflect.get(this._players, key) });
    // Une corbeille qui ne s'écrit pas : le profil reste, plutôt que d'être perdu
    if (!saveTrash(trash)) {
      console.error(`Corbeille indisponible : « ${key} » n'est pas supprimé`);
      return false;
    }

    // Si c'est l'utilisateur actuel, le déconnecter
    const wasCurrentUser = this._currentUser === key;
    if (wasCurrentUser) {
      this._currentUser = null;
    }
    Reflect.deleteProperty(this._players, key);
    this.savePlayers();
    // Plus de joueur courant : la barre du haut retire ce qui dépend d'un profil
    if (wasCurrentUser) this.emitUserChanged(null);
    return true;
  },

  /**
   * Remet dans la liste, à l'identique, un joueur de la corbeille
   * @param {{name: string, deletedAt: number}} entry - Entrée choisie (prénom et date)
   * @returns {{ok: boolean, name: string, problem?: 'missing'|'exists'|'storage'}}
   */
  restoreFromTrash({ name, deletedAt }) {
    const trash = loadTrash();
    const index = trash.findIndex(entry => entry.name === name && entry.deletedAt === deletedAt);
    if (index === -1) return { ok: false, name, problem: 'missing' };
    // Un joueur de la liste porte ce prénom : il n'est pas écrasé
    if (Object.prototype.hasOwnProperty.call(this._players, name)) {
      return { ok: false, name, problem: 'exists' };
    }
    this._addPlayer(name, trash.at(index).data);
    if (!this.savePlayers()) {
      Reflect.deleteProperty(this._players, name);
      return { ok: false, name, problem: 'storage' };
    }
    trash.splice(index, 1);
    saveTrash(trash);
    return { ok: true, name };
  },

  /**
   * Efface pour de bon les joueurs supprimés depuis TRASH_DAYS jours, avec leurs anciens
   * scores d'Arcade
   * @param {number} [now]
   * @returns {number} Nombre de joueurs effacés
   */
  purgeExpiredTrash(now = Date.now()) {
    const trash = loadTrash();
    const expired = trash.filter(entry => isTrashExpired(entry, now));
    if (expired.length === 0) return 0;
    const kept = trash.filter(entry => !isTrashExpired(entry, now));
    saveTrash(kept);
    // Effacement promis par la page Confidentialité : les anciens scores d'Arcade, rangés sous
    // le surnom (et donc le prénom en clair), partent avec le profil, sauf ceux d'un autre
    // profil qui porte le même nom, dans la liste ou dans la corbeille
    const inUse = this._legacyOwnersInUse(kept);
    const owners = expired.flatMap(entry => [
      entry.name,
      legacyArcadeOwner(entry.data ?? {}, entry.name),
    ]);
    this._removeLegacyArcadeScores(owners.filter(owner => !inUse.has(owner)));
    return expired.length;
  },

  /**
   * Prénoms et surnoms des joueurs de la liste et de la corbeille
   * @param {Array<{name: string, data: Object}>} trash
   * @returns {Set<string>}
   * @private
   */
  _legacyOwnersInUse(trash) {
    const profiles = [
      ...Object.entries(this._players),
      ...trash.map(entry => [entry.name, entry.data]),
    ];
    return new Set(profiles.flatMap(([name, data]) => [name, legacyArcadeOwner(data ?? {}, name)]));
  },

  /**
   * Sauvegarde de tous les joueurs de la liste (pas la corbeille), pour un fichier
   * @param {Date} [now]
   * @returns {{format: string, version: number, exportedAt: string, players: Object}}
   */
  exportPlayers(now = new Date()) {
    const players = Object.fromEntries(
      Object.entries(this._players).map(([name, data]) => [name, withOwnOperationStats(data)])
    );
    return buildPlayersBackup(players, now);
  },

  /**
   * Ajoute les joueurs d'une sauvegarde relue (core/players-backup.js). Un joueur déjà dans la
   * liste n'est jamais écrasé : il est rendu dans « skipped ».
   * @param {Array<[string, Object]>} entries - Prénom et profil, déjà vérifiés
   * @returns {{added: string[], skipped: string[], error?: 'storage'}}
   */
  importPlayers(entries) {
    const added = [];
    const skipped = [];
    for (const [name, data] of entries) {
      if (Object.prototype.hasOwnProperty.call(this._players, name)) {
        skipped.push(name);
      } else {
        // Venu d'ailleurs sans ses statistiques par calcul : il ne prend pas celles de l'appareil
        const profile = Object.hasOwn(data, 'operationStats')
          ? data
          : { ...data, operationStats: {} };
        this._addPlayer(name, profile);
        added.push(name);
      }
    }
    if (added.length > 0 && !this.savePlayers()) {
      added.forEach(name => Reflect.deleteProperty(this._players, name));
      return { added: [], skipped, error: 'storage' };
    }
    return { added, skipped };
  },

  /**
   * Ajoute un joueur à la liste, sous sa clé (propriété propre, jamais héritée)
   * @param {string} name
   * @param {Object} data
   * @private
   */
  _addPlayer(name, data) {
    Object.defineProperty(this._players, name, {
      value: data,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  },

  /**
   * Charger les joueurs depuis le stockage
   * @returns {Object} Données des joueurs
   */
  loadPlayers() {
    try {
      const players = Storage.get('players', {});
      // Une valeur illisible (texte, nombre, tableau…) ne doit pas devenir la liste des joueurs
      if (!players || typeof players !== 'object' || Array.isArray(players)) {
        console.warn('Liste des joueurs illisible : elle est ignorée.');
        return {};
      }
      return players;
    } catch (error) {
      console.error('Erreur lors du chargement des joueurs:', error);
      return {};
    }
  },

  /**
   * Sauvegarder les joueurs dans le stockage
   * @returns {boolean} Faux si le navigateur refuse d'écrire
   */
  savePlayers() {
    try {
      return Storage.set('players', this._players);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des joueurs:', error);
      return false;
    }
  },

  /**
   * Initialiser l'interface utilisateur
   */
  initUI() {
    // Rafraîchir la liste des utilisateurs
    this.refreshUserList();

    // Initialiser les événements de création d'utilisateur
    this.initCreateUserEvents();
  },

  /**
   * Rafraîchir la liste des utilisateurs dans l'interface
   */
  refreshUserList() {
    const userListDiv = document.getElementById('user-list');
    if (!userListDiv) return;

    while (userListDiv.firstChild) userListDiv.firstChild.remove();
    const names = this.sortedPlayerNames();

    if (names.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'user-list-empty';
      empty.textContent = getTranslation('no_existing_users');
      userListDiv.appendChild(empty);
    } else {
      // « Qui joue ? » : une tuile par joueur (visage de l'avatar + prénom).
      // Les flèches du clavier passent d'une tuile à l'autre grâce à la navigation
      // spatiale globale de keyboard-navigation.js : pas de gestionnaire local ici.
      const list = document.createElement('ul');
      list.className = 'user-tiles';
      names.forEach(name => list.appendChild(this._createUserTile(name)));
      userListDiv.appendChild(list);
    }
    // Filtre et barre de « Qui joue ? » (components/playerTools.js)
    eventBus.emit('playersChanged', { count: names.length });
  },

  /**
   * Prénoms des joueurs dans l'ordre alphabétique de la langue du jeu ; un prénom de
   * chiffres passe devant, « 2 » avant « 10 »
   * @returns {string[]}
   */
  sortedPlayerNames() {
    const collator = new Intl.Collator(getCurrentLanguage(), { numeric: true });
    const names = Object.keys(this._players);
    names.sort(collator.compare);
    return names;
  },

  /**
   * Crée la tuile d'un joueur : un grand bouton (visage + prénom) pour jouer,
   * et, nettement séparé en dessous, un petit bouton discret pour supprimer.
   * @param {string} name - Clé du joueur
   * @returns {HTMLLIElement}
   * @private
   */
  _createUserTile(name) {
    const userContainer = document.createElement('li');
    userContainer.className = 'user-container';
    // Prénom lu par le filtre de « Qui joue ? »
    userContainer.dataset.player = name;

    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'user-tile';
    const face = document.createElement('img');
    face.className = 'user-tile-face';
    setAvatarHead(face, Reflect.get(this._players, name)?.avatar, HEAD_SIZES.tile);
    face.alt = '';
    face.width = 72;
    face.height = 72;
    face.decoding = 'async';
    const label = document.createElement('span');
    label.className = 'user-tile-name';
    label.textContent = name;
    tile.appendChild(face);
    tile.appendChild(label);
    tile.onclick = () => this.selectUser(name);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-quiet btn-danger btn-sm delete-btn';
    deleteBtn.textContent = translateOr('delete_profile_button', 'Supprimer');
    // « Supprimer le profil « Emma » » : pas de « de Emma » à élider selon le prénom
    deleteBtn.setAttribute(
      'aria-label',
      translateOr('delete_profile_label', `Supprimer le profil «\u00a0${name}\u00a0»`, { name })
    );
    deleteBtn.onclick = e => {
      e.stopPropagation();
      this._confirmProfileRemoval(name, deleteBtn).catch(error =>
        console.error('Suppression du profil impossible', error)
      );
    };

    userContainer.appendChild(tile);
    userContainer.appendChild(deleteBtn);
    return userContainer;
  },

  /**
   * « Supprimer » : la fenêtre du jeu demande d'abord ; confirmé, le profil va dans la
   * corbeille
   * @param {string} name
   * @param {HTMLElement} origin - Son bouton « Supprimer » : refusé, le focus y revient
   * @returns {Promise<void>}
   * @private
   */
  async _confirmProfileRemoval(name, origin) {
    const confirmed = await confirmDialog({
      title: getTranslation('confirm_delete_user', { name }),
      message: getTranslation('confirm_delete_user_detail', { days: TRASH_DAYS }),
      confirmLabel: getTranslation('delete_profile_dialog_confirm'),
      cancelLabel: getTranslation('delete_profile_dialog_cancel'),
      returnFocusTo: origin,
    });
    if (!confirmed || !this.deleteUser(name)) return;
    this.refreshUserList();
    this._focusAfterProfileRemoval();
    // « Léa est dans la corbeille. » (components/playerTools.js)
    eventBus.emit('playerTrashed', { name });
  },

  /**
   * Après une suppression, le bouton qui avait le focus n'existe plus :
   * on le rend à la première tuile restante, sinon au champ « Ton prénom ».
   * @private
   */
  _focusAfterProfileRemoval() {
    const target =
      document.querySelector('#user-list .user-tile') || document.getElementById('new-user-name');
    target?.focus?.();
  },

  /**
   * Initialiser les événements de création d'utilisateur
   */
  initCreateUserEvents() {
    const newUserNameInput = document.getElementById('new-user-name');
    const createUserBtn = document.getElementById('create-user-btn');

    if (!newUserNameInput || !createUserBtn) return;

    // Le clavier virtuel ne s'ouvre pas au focus : la saisie physique reste possible
    const virtualKeyboardBtn = this._ensureVirtualKeyboardToggle(newUserNameInput);
    virtualKeyboardBtn.addEventListener('click', () => {
      this._toggleVirtualKeyboard(newUserNameInput, virtualKeyboardBtn);
    });

    // Entrée dans le champ vaut « Créer ». La touche s'arrête ici : la création ouvre la
    // vidéo et place le focus sur « Passer » ; si le même keydown remontait jusqu'à la
    // navigation clavier globale (keyboard-navigation.js), elle cliquerait ce bouton.
    newUserNameInput.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      event.stopPropagation();
      createUserBtn.click();
    });
    newUserNameInput.addEventListener('input', () => this._clearCreationMessage());

    createUserBtn.addEventListener('click', () => {
      this._handleCreateUser(newUserNameInput, virtualKeyboardBtn);
    });
  },

  /**
   * Bouton « Clavier » (index.html) ; créé ici s'il manque dans la page.
   * @param {HTMLInputElement} input
   * @returns {HTMLButtonElement}
   * @private
   */
  _ensureVirtualKeyboardToggle(input) {
    let toggle = document.getElementById('show-virtual-keyboard');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.id = 'show-virtual-keyboard';
      toggle.type = 'button';
      toggle.className = 'btn btn-secondary btn-sm virtual-keyboard-toggle';
      toggle.textContent = translateOr('virtual_keyboard_toggle', 'Clavier');
      toggle.setAttribute('aria-expanded', 'false');
      input.parentElement.appendChild(toggle);
    }
    return toggle;
  },

  /**
   * Affiche ou masque le clavier virtuel ; l'état est porté par aria-expanded.
   * @param {HTMLInputElement} input
   * @param {HTMLButtonElement} toggle
   * @private
   */
  _toggleVirtualKeyboard(input, toggle) {
    const keyboardId = `virtual-keyboard-${input.id}`;
    let keyboardContainer = document.getElementById(keyboardId);
    let willShow = true;
    if (keyboardContainer) {
      willShow = keyboardContainer.style.display === 'none';
    } else {
      keyboardContainer = createVirtualKeyboard(input, input.parentElement);
      toggle.setAttribute('aria-controls', keyboardContainer.id);
      this._notifyInputFromVirtualKeys(keyboardContainer, input);
    }
    keyboardContainer.style.display = willShow ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', willShow ? 'true' : 'false');
  },

  /**
   * Les touches du clavier à l'écran écrivent dans le champ sans émettre d'événement
   * « input » : on le signale après chaque touche, comme une frappe au clavier
   * physique (le message « Écris d'abord ton prénom. » s'efface alors aussi).
   * @param {HTMLElement} keyboardContainer
   * @param {HTMLInputElement} input
   * @private
   */
  _notifyInputFromVirtualKeys(keyboardContainer, input) {
    if (keyboardContainer.dataset.notifiesInput) return;
    keyboardContainer.dataset.notifiesInput = 'true';
    keyboardContainer.addEventListener('click', event => {
      if (!event.target.closest?.('.keyboard-key')) return;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  },

  /**
   * Message sous le formulaire « Nouveau joueur » (remplace les alert() natifs).
   * @param {string} text
   * @private
   */
  _showCreationMessage(text) {
    const input = document.getElementById('new-user-name');
    const messageEl = document.getElementById('new-user-message');
    if (!messageEl) {
      if (typeof globalThis !== 'undefined' && typeof globalThis.alert === 'function') {
        globalThis.alert(text);
      }
      return;
    }
    messageEl.textContent = text;
    messageEl.hidden = false;
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', messageEl.id);
      input.focus();
    }
  },

  /**
   * @private
   */
  _clearCreationMessage() {
    const messageEl = document.getElementById('new-user-message');
    if (!messageEl || messageEl.hidden) return;
    messageEl.hidden = true;
    messageEl.textContent = '';
    const input = document.getElementById('new-user-name');
    input?.removeAttribute('aria-invalid');
    input?.removeAttribute('aria-describedby');
  },

  /**
   * Valide le prénom, crée le joueur et lance la vidéo de son avatar.
   * @param {HTMLInputElement} input
   * @param {HTMLButtonElement} keyboardToggle
   * @private
   */
  _handleCreateUser(input, keyboardToggle) {
    const check = checkUsername(input.value);
    const selectedRadio = document.querySelector('.creation-avatar-selector .avatar-radio:checked');
    const selectedAvatar = selectedRadio ? selectedRadio.value : 'fox';

    const problem = check.problem || this._nameTaken(check.name);
    if (problem) {
      this._showCreationMessage(this._creationProblemMessage(problem, check));
      return;
    }

    if (!this.createUser(check.name, selectedAvatar)) {
      this._showCreationMessage(this._creationProblemMessage('exists', check));
      return;
    }

    input.value = '';
    this._clearCreationMessage();
    // Un joueur de plus à garder : le navigateur est prié de ne pas vider le stockage
    void requestPersistentStorage();

    // Cacher le clavier virtuel après création
    const keyboardContainer = document.getElementById(`virtual-keyboard-${input.id}`);
    if (keyboardContainer) {
      keyboardContainer.style.display = 'none';
      keyboardToggle.setAttribute('aria-expanded', 'false');
    }

    this.refreshUserList();

    // 🎬 Ne sélectionner l'utilisateur que si aucune vidéo ne va être jouée
    // (createUser gère déjà la sélection via le callback vidéo)
    if (!VideoManager?.CHARACTER_VIDEOS?.has(selectedAvatar)) {
      this.selectUser(check.name);
    }
  },

  /**
   * Prénom déjà pris par un joueur de la liste, ou de la corbeille
   * @param {string} name - Prénom rangé (checkUsername)
   * @returns {'exists'|'trash'|null}
   * @private
   */
  _nameTaken(name) {
    if (Object.prototype.hasOwnProperty.call(this._players, name)) return 'exists';
    return loadTrash().some(entry => entry.name === name) ? 'trash' : null;
  },

  /**
   * Message sous le champ « Ton prénom » : ce qui empêche de créer ce joueur
   * @param {string} problem - 'empty', 'chars', 'long', 'exists' ou 'trash'
   * @param {{name: string, chars: string}} check - Prénom rangé et signes refusés
   * @returns {string}
   * @private
   */
  _creationProblemMessage(problem, { name, chars }) {
    switch (problem) {
      case 'chars':
        return translateOr(
          'name_bad_chars_alert',
          `Ton prénom ne peut pas contenir «\u00a0${chars}\u00a0».`,
          { chars }
        );
      case 'long':
        return translateOr(
          'name_too_long_alert',
          `Ton prénom est trop long\u00a0: ${USERNAME_MAX_LENGTH}\u00a0caractères au plus.`,
          { max: USERNAME_MAX_LENGTH }
        );
      case 'exists':
        return translateOr(
          'user_already_exists_alert',
          'Ce joueur existe déjà. Touche son prénom plus haut pour jouer.'
        );
      case 'trash':
        return translateOr(
          'name_in_trash_alert',
          `«\u00a0${name}\u00a0» est dans la corbeille, en haut de la liste.`,
          { name }
        );
      default:
        return translateOr('enter_valid_name_alert', 'Écris d’abord ton prénom.');
    }
  },

  /**
   * Émettre un événement de changement d'utilisateur
   * @param {Object} userData - Données de l'utilisateur
   */
  emitUserChanged(userData) {
    // Créer un événement personnalisé
    const event = new CustomEvent('userChanged', {
      detail: {
        user: this._currentUser,
        userData: userData,
      },
    });

    // Envoyer l'événement
    document.dispatchEvent(event);
  },

  /**
   * Mettre à jour l'affichage du message d'accueil (bulle de la mascotte)
   */
  async updateWelcomeMessage() {
    if (!this._currentUser) return;
    await updateWelcomeMessageUI();
  },
};

// Export global pour compatibilité

export default UserManager;

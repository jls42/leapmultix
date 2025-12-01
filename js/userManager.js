/**
 * Module de Gestion des Utilisateurs
 * Centralise toute la logique de gestion des utilisateurs, profils, et données persistantes
 * Phase 3.1 - Extraction depuis main.js
 */
import {
  getTranslation,
  addArrowKeyNavigation,
  updateBackgroundByAvatar,
  startBackgroundRotation,
  updateWelcomeMessageUI,
  updateCoinDisplay,
} from './utils-es6.js';
import Storage from './core/storage.js';
import { sanitizeUsername } from './security-utils.js';
import { VideoManager } from './VideoManager.js';
import { AudioManager } from './core/audio.js';
import { createVirtualKeyboard } from './virtual-keyboard.js';
import { goToSlide } from './slides.js';
import { gameState, displayDailyChallenge } from './game.js';

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
  parentalLockEnabled: false,
  starsByTable: {},
  coins: 0,
  preferredOperator: '×',
});

const ensureArray = (value, fallback = []) => (Array.isArray(value) ? [...value] : [...fallback]);

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
});

const normalizeUserData = (rawData, currentUser) => {
  const base = {
    ...DEFAULT_USER_DATA,
    ...rawData,
  };

  const wrongAnswers = ensureObject(rawData?.wrongAnswers);
  const progressHistory = ensureArray(rawData?.progressHistory);
  const unlockedAvatars = ensureArray(rawData?.unlockedAvatars, ['fox']);
  const unlockedBadges = ensureArray(rawData?.unlockedBadges);
  const starsByTable = ensureObject(rawData?.starsByTable);
  const tablePreferences = ensureObject(rawData?.tablePreferences, DEFAULT_TABLE_PREFERENCES);

  return {
    ...base,
    bestScore: ensureNumber(rawData?.bestScore, 0),
    wrongAnswers,
    progressHistory,
    avatar: rawData?.avatar || 'fox',
    nickname: rawData?.nickname || currentUser,
    theme: rawData?.theme || 'forest',
    colorTheme: rawData?.colorTheme || 'default',
    unlockedAvatars,
    unlockedBadges,
    volume:
      typeof rawData?.volume === 'number' && Number.isFinite(rawData.volume) ? rawData.volume : 1,
    dailyChallengesCompleted: ensureNumber(rawData?.dailyChallengesCompleted, 0),
    parentalLockEnabled: rawData?.parentalLockEnabled === true,
    starsByTable,
    coins: ensureNumber(rawData?.coins, 0),
    preferredOperator: rawData?.preferredOperator || '×',
    tablePreferences: {
      ...DEFAULT_TABLE_PREFERENCES,
      ...tablePreferences,
      globalExclusions: ensureArray(tablePreferences.globalExclusions),
      globalEnabled: tablePreferences.globalEnabled === true,
    },
  };
};

/**
 * Gestionnaire principal des utilisateurs
 */
export const UserManager = {
  // État interne
  _currentUser: null,
  _players: {},

  /**
   * Initialiser le gestionnaire d'utilisateurs
   */
  init() {
    // Charger les joueurs depuis le stockage
    this._players = this.loadPlayers();

    // Initialiser l'interface utilisateur
    this.initUI();
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

    const normalized = normalizeUserData(this._players[this._currentUser], this._currentUser);
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
   */
  updateCurrentUserData(updatedData) {
    if (
      !this._currentUser ||
      !Object.prototype.hasOwnProperty.call(this._players, this._currentUser)
    )
      return;

    this._players[this._currentUser] = {
      ...this._players[this._currentUser],
      ...updatedData,
    };

    this.savePlayers();
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
    updateBackgroundByAvatar(avatar);
    startBackgroundRotation(avatar);
    updateWelcomeMessageUI();
    updateCoinDisplay();

    const heroMascotImg = document.getElementById('hero-mascot-img');
    if (heroMascotImg) {
      heroMascotImg.src = `assets/images/arcade/${avatar}_head_avatar.png`;
      heroMascotImg.alt = avatar;
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
    localStorage.removeItem('arcadeScores_default');
    localStorage.removeItem('arcadeScores_multisnake_default');
    localStorage.removeItem('arcadeScores_multimiam_default');
  },

  /**
   * Sélectionner un utilisateur
   * @param {string} name - Nom de l'utilisateur
   * @returns {Object|null} Données de l'utilisateur sélectionné ou null si non trouvé
   */
  selectUser(name) {
    const raw = typeof name === 'string' ? name : '';
    const safe = sanitizeUsername(raw);
    const key = Object.prototype.hasOwnProperty.call(this._players, raw) ? raw : safe;

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
    goToSlide(1);
    this.emitUserChanged(userData);

    return userData;
  },

  /**
   * Créer un nouveau utilisateur
   * @param {string} name - Nom du nouvel utilisateur
   * @param {string} avatar - Avatar sélectionné
   * @returns {boolean} Succès de la création
   */
  createUser(name, avatar = 'fox') {
    if (!name || typeof name !== 'string') {
      console.error("Nom d'utilisateur invalide");
      return false;
    }

    const trimmedName = name.trim();
    const sanitized = sanitizeUsername(trimmedName);
    /**
     * Fonction if
     * @param {*} !trimmedName - Description du paramètre
     * @returns {*} Description du retour
     */
    if (!trimmedName) {
      console.error("Le nom d'utilisateur ne peut pas être vide");
      return false;
    }

    /**
     * Fonction if
     * @param {*} this._players[trimmedName] - Description du paramètre
     * @returns {*} Description du retour
     */
    if (Object.prototype.hasOwnProperty.call(this._players, sanitized)) {
      console.error('Un utilisateur avec ce nom existe déjà');
      return false;
    }

    // Créer le nouvel utilisateur
    Object.defineProperty(this._players, sanitized, {
      value: {
        bestScore: 0,
        wrongAnswers: {},
        progressHistory: [],
        avatar: avatar,
        nickname: sanitized,
        theme: 'forest',
        colorTheme: 'default',
        unlockedAvatars: [avatar],
        unlockedBadges: [],
        volume: 1,
        dailyChallengesCompleted: 0,
        parentalLockEnabled: false,
        starsByTable: {},
        coins: 0,
      },
      enumerable: true,
      configurable: true,
      writable: true,
    });

    // Sauvegarder
    this.savePlayers();

    // 🎬 Jouer la vidéo d'introduction de l'avatar si VideoManager est disponible
    if (
      typeof VideoManager !== 'undefined' &&
      VideoManager.CHARACTER_VIDEOS &&
      VideoManager.CHARACTER_VIDEOS.has(avatar)
    ) {
      // Callback pour sélectionner l'utilisateur après la vidéo
      VideoManager.playCharacterIntro(avatar, () => {
        this.selectUser(sanitized);
      });
    }

    return true;
  },

  /**
   * Supprimer un utilisateur
   * @param {string} name - Nom de l'utilisateur à supprimer
   * @returns {boolean} Succès de la suppression
   */
  deleteUser(name) {
    const safe = sanitizeUsername(typeof name === 'string' ? name : '');
    const key = Object.prototype.hasOwnProperty.call(this._players, name) ? name : safe;
    if (!Object.prototype.hasOwnProperty.call(this._players, key)) {
      console.error(`Utilisateur "${name}" non trouvé`);
      return false;
    }

    // Si c'est l'utilisateur actuel, le déconnecter
    /**
     * Fonction if
     * @param {*} this._currentUser - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this._currentUser === key) {
      this._currentUser = null;
    }

    if (Object.prototype.hasOwnProperty.call(this._players, key)) {
      Reflect.deleteProperty(this._players, key);
    }
    this.savePlayers();
    return true;
  },

  /**
   * Charger les joueurs depuis le stockage
   * @returns {Object} Données des joueurs
   */
  loadPlayers() {
    try {
      return Storage.get('players', {});
    } catch (error) {
      console.error('Erreur lors du chargement des joueurs:', error);
      return {};
    }
  },

  /**
   * Sauvegarder les joueurs dans le stockage
   */
  savePlayers() {
    try {
      Storage.set('players', this._players);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des joueurs:', error);
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

    while (userListDiv.firstChild) userListDiv.removeChild(userListDiv.firstChild);
    const names = Object.keys(this._players);

    /**
     * Fonction if
     * @param {*} names.length - Description du paramètre
     * @returns {*} Description du retour
     */
    if (names.length === 0) {
      userListDiv.textContent = getTranslation('no_existing_users');
      return;
    }

    names.forEach(name => {
      const userContainer = document.createElement('div');
      userContainer.className = 'user-container';

      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = name;
      btn.onclick = () => this.selectUser(name);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn delete-btn';
      deleteBtn.textContent = '🗑️';
      {
        const delTitle = getTranslation('delete_user_title');
        deleteBtn.title =
          typeof delTitle === 'string' && !/^\[.*\]$/.test(delTitle)
            ? delTitle
            : "Supprimer l'utilisateur";
      }
      deleteBtn.onclick = e => {
        e.stopPropagation();
        const canConfirm =
          typeof globalThis !== 'undefined' && typeof globalThis.confirm === 'function';
        if (
          canConfirm ? globalThis.confirm(getTranslation('confirm_delete_user', { name })) : true
        ) {
          this.deleteUser(name);
          this.refreshUserList();
        }
      };

      userContainer.appendChild(btn);
      userContainer.appendChild(deleteBtn);
      userListDiv.appendChild(userContainer);
    });

    // Ajouter navigation clavier par flèches
    /**
     * Fonction if
     * @param {*} typeof - Description du paramètre
     * @returns {*} Description du retour
     */
    if (typeof addArrowKeyNavigation === 'function') {
      addArrowKeyNavigation(userListDiv, '.user-container .btn:not(.delete-btn)');
    }
  },

  /**
   * Initialiser les événements de création d'utilisateur
   */
  initCreateUserEvents() {
    const newUserNameInput = document.getElementById('new-user-name');
    const createUserBtn = document.getElementById('create-user-btn');

    if (!newUserNameInput || !createUserBtn) return;

    // NE PAS afficher automatiquement le clavier au focus pour permettre saisie physique
    // L'utilisateur peut cliquer sur l'input pour utiliser clavier physique normalement

    // Optionnel : Ajouter un bouton pour afficher/masquer le clavier virtuel
    let virtualKeyboardBtn = document.getElementById('show-virtual-keyboard');
    /**
     * Fonction if
     * @param {*} !virtualKeyboardBtn - Description du paramètre
     * @returns {*} Description du retour
     */
    if (!virtualKeyboardBtn) {
      virtualKeyboardBtn = document.createElement('button');
      virtualKeyboardBtn.id = 'show-virtual-keyboard';
      virtualKeyboardBtn.type = 'button';
      virtualKeyboardBtn.className = 'btn virtual-keyboard-toggle';
      virtualKeyboardBtn.textContent = '⌨️';
      virtualKeyboardBtn.title = 'Afficher/masquer le clavier virtuel';
      newUserNameInput.parentElement.appendChild(virtualKeyboardBtn);
    }

    // Gestionnaire pour afficher/masquer le clavier virtuel
    virtualKeyboardBtn.addEventListener('click', () => {
      const keyboardId = `virtual-keyboard-${newUserNameInput.id}`;
      let keyboardContainer = document.getElementById(keyboardId);
      if (!keyboardContainer) {
        keyboardContainer = createVirtualKeyboard(newUserNameInput, newUserNameInput.parentElement);
        keyboardContainer.style.display = 'block';
        virtualKeyboardBtn.textContent = '⌨️❌';
        virtualKeyboardBtn.title = 'Masquer le clavier virtuel';
      } else {
        const isVisible = keyboardContainer.style.display !== 'none';
        keyboardContainer.style.display = isVisible ? 'none' : 'block';
        virtualKeyboardBtn.textContent = isVisible ? '⌨️' : '⌨️❌';
        virtualKeyboardBtn.title = isVisible
          ? 'Afficher le clavier virtuel'
          : 'Masquer le clavier virtuel';
      }
    });

    // Gestionnaire de création
    createUserBtn.addEventListener('click', () => {
      const newName = newUserNameInput.value.trim();

      // Récupérer l'avatar sélectionné
      const selectedAvatarBtn = document.querySelector(
        '.creation-avatar-selector .avatar-btn.active'
      );
      const selectedAvatar = selectedAvatarBtn ? selectedAvatarBtn.dataset.avatar : 'fox';

      /**
       * Fonction if
       * @param {*} !newName - Description du paramètre
       * @returns {*} Description du retour
       */
      if (!newName) {
        if (typeof globalThis !== 'undefined' && typeof globalThis.alert === 'function') {
          globalThis.alert(getTranslation('enter_valid_name_alert'));
        }
        return;
      }

      if (this.createUser(newName, selectedAvatar)) {
        newUserNameInput.value = '';

        // Cacher le clavier virtuel après création
        const keyboardId = `virtual-keyboard-${newUserNameInput.id}`;
        const keyboardContainer = document.getElementById(keyboardId);
        /**
         * Fonction if
         * @param {*} keyboardContainer - Description du paramètre
         * @returns {*} Description du retour
         */
        if (keyboardContainer) {
          keyboardContainer.style.display = 'none';
          virtualKeyboardBtn.textContent = '⌨️';
          virtualKeyboardBtn.title = 'Afficher le clavier virtuel';
        }

        this.refreshUserList();

        // 🎬 Ne sélectionner l'utilisateur que si aucune vidéo ne va être jouée
        // (createUser gère déjà la sélection via le callback vidéo)
        if (!VideoManager?.CHARACTER_VIDEOS?.has(selectedAvatar)) {
          this.selectUser(newName);
        }
      } else {
        if (typeof globalThis !== 'undefined' && typeof globalThis.alert === 'function') {
          globalThis.alert(getTranslation('user_already_exists_alert'));
        }
      }
    });
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
   * Mettre à jour l'affichage du message d'accueil
   */
  async updateWelcomeMessage() {
    if (!this._currentUser) return;

    const userData = this.getCurrentUserData();
    const nickname = userData.nickname || this._currentUser;

    const welcomeMsgElement = document.getElementById('welcome-message');
    if (welcomeMsgElement) {
      while (welcomeMsgElement.firstChild)
        welcomeMsgElement.removeChild(welcomeMsgElement.firstChild);
      const welcomeText = getTranslation('welcome_user', { nickname });
      const introText = getTranslation('adventure_intro');
      welcomeMsgElement.appendChild(document.createTextNode(welcomeText));
      welcomeMsgElement.appendChild(document.createElement('br'));
      welcomeMsgElement.appendChild(document.createTextNode(introText));
    }
  },
};

// Export global pour compatibilité

export default UserManager;

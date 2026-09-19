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
import { getAvatarHeadSrc } from './main-helpers.js';
import Storage from './core/storage.js';
import { sanitizeUsername } from './security-utils.js';
import { VideoManager } from './VideoManager.js';
import { AudioManager } from './core/audio.js';
import { createVirtualKeyboard } from './virtual-keyboard.js';
import { goToSlide } from './slides.js';
import { gameState, displayDailyChallenge } from './game.js';
import { eventBus } from './core/eventBus.js';

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
    // Un monde illustré fixe par avatar (plus de rotation du fond)
    updateBackgroundByAvatar(avatar);
    updateWelcomeMessageUI();
    updateCoinDisplay();

    const heroMascotImg = document.getElementById('hero-mascot-img');
    if (heroMascotImg) {
      // Visage 128 px : la mascotte est affichée à 72 px au plus
      heroMascotImg.src = getAvatarHeadSrc(avatar);
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
    const wasCurrentUser = this._currentUser === key;
    if (wasCurrentUser) {
      this._currentUser = null;
    }

    if (Object.prototype.hasOwnProperty.call(this._players, key)) {
      Reflect.deleteProperty(this._players, key);
    }
    this.savePlayers();
    // Plus de joueur courant : la barre du haut retire ce qui dépend d'un profil
    if (wasCurrentUser) this.emitUserChanged(null);
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

    if (names.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'user-list-empty';
      empty.textContent = getTranslation('no_existing_users');
      userListDiv.appendChild(empty);
      return;
    }

    // « Qui joue ? » : une tuile par joueur (visage de l'avatar + prénom).
    // Les flèches du clavier passent d'une tuile à l'autre grâce à la navigation
    // spatiale globale de keyboard-navigation.js : pas de gestionnaire local ici.
    const list = document.createElement('ul');
    list.className = 'user-tiles';
    names.forEach(name => list.appendChild(this._createUserTile(name)));
    userListDiv.appendChild(list);
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

    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'user-tile';
    const face = document.createElement('img');
    face.className = 'user-tile-face';
    face.src = getAvatarHeadSrc(this._players[name]?.avatar);
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
      const canConfirm =
        typeof globalThis !== 'undefined' && typeof globalThis.confirm === 'function';
      if (canConfirm ? globalThis.confirm(getTranslation('confirm_delete_user', { name })) : true) {
        this.deleteUser(name);
        this.refreshUserList();
        this._focusAfterProfileRemoval();
      }
    };

    userContainer.appendChild(tile);
    userContainer.appendChild(deleteBtn);
    return userContainer;
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
    const newName = input.value.trim();
    const selectedAvatarBtn = document.querySelector(
      '.creation-avatar-selector .avatar-btn.active'
    );
    const selectedAvatar = selectedAvatarBtn ? selectedAvatarBtn.dataset.avatar : 'fox';

    // Un prénom fait seulement de caractères refusés deviendrait vide une fois nettoyé
    if (!newName || !sanitizeUsername(newName)) {
      this._showCreationMessage(translateOr('enter_valid_name_alert', 'Écris d’abord ton prénom.'));
      return;
    }

    if (!this.createUser(newName, selectedAvatar)) {
      this._showCreationMessage(
        translateOr(
          'user_already_exists_alert',
          'Ce joueur existe déjà. Touche son prénom plus haut pour jouer.'
        )
      );
      return;
    }

    input.value = '';
    this._clearCreationMessage();

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
      this.selectUser(newName);
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

/**
 * Composant Customization centralisé
 * Gère l'écran de personnalisation et toutes ses fonctionnalités
 * Phase 3.4 - Extraction des fonctions de personnalisation de main.js
 */
import { UserState } from '../core/userState.js';
import { gameState } from '../game.js';
import {
  addArrowKeyNavigation,
  showMessage,
  getTranslation,
  renderAvatarSelector,
  updateWelcomeMessageUI,
  updateBackgroundByAvatar,
  startBackgroundRotation,
} from '../utils-es6.js';
import { saveParentalLockEnabled } from '../storage.js';
import { createVirtualKeyboard } from '../virtual-keyboard.js';

export const Customization = {
  /**
   * Initialiser le composant Customization
   */
  init() {
    console.log('🎨 Initialisation du composant Customization');
  },

  /**
   * Afficher l'écran de personnalisation
   */
  show() {
    // Charger les données de l'utilisateur
    const userData = UserState.getCurrentUserData();
    // Mettre à jour l'état avec les données
    gameState.avatar = userData.avatar || 'fox';
    gameState.nickname = userData.nickname || '';
    gameState.unlockedAvatars = userData.unlockedAvatars || ['fox'];

    // Générer dynamiquement les boutons d'avatar (affichage lock/débloqué)
    renderAvatarSelector();

    // Mettre à jour l'affichage de l'avatar actuel (image + bouton actif)
    const currentImg = document.getElementById('current-avatar-img');
    if (currentImg) {
      const current = gameState.avatar || 'fox';
      currentImg.src = `assets/images/arcade/${current}_head_avatar_128x128.png`;
      currentImg.alt = current;
    }
    document.querySelectorAll('.avatar-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.avatar === (gameState.avatar || 'fox'));
    });

    // Mettre à jour le champ de surnom
    const nicknameInput = document.getElementById('nickname-input');
    /**
     * Fonction if
     * @param {*} nicknameInput - Description du paramètre
     * @returns {*} Description du retour
     */
    if (nicknameInput) {
      nicknameInput.value = gameState.nickname;
    }

    // Tâche 5.1: Mettre à jour l'état de la checkbox du code parental
    const parentalLockToggle = document.getElementById('parental-lock-toggle');
    /**
     * Fonction if
     * @param {*} parentalLockToggle - Description du paramètre
     * @returns {*} Description du retour
     */
    if (parentalLockToggle) {
      parentalLockToggle.checked = userData.parentalLockEnabled === true;
    }

    // Ajouter les écouteurs d'événements
    this.setupEvents();

    // Ajouter un petit bouton discret pour vider le cache navigateur (dans la section accessibilité)
    try {
      const opts = document.querySelector('#slide6 .accessibility-options');
      if (opts && !opts.querySelector('#clear-cache-btn')) {
        const btn = document.createElement('button');
        btn.id = 'clear-cache-btn';
        btn.className = 'btn btn-sm-desktop clear-cache-btn';
        btn.setAttribute('data-translate', 'clear_cache_button');
        btn.title = getTranslation('clear_cache_button') || 'Vider le cache';
        btn.style.marginLeft = '8px';
        btn.style.opacity = '0.75';
        btn.style.float = 'right';
        btn.textContent = getTranslation('clear_cache_button') || 'Vider le cache';
        opts.appendChild(btn);
      }
    } catch (e) {
      void e; /* noop */
    }
  },

  /**
   * Configurer les événements de l'écran de personnalisation
   */
  setupEvents() {
    document.querySelectorAll('.avatar-btn');

    // Sélection d'avatar
    document.querySelectorAll('.avatar-btn:not(.locked)').forEach(btn => {
      // Supprimer l'ancien écouteur s'il existe pour éviter les doublons
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', () => {
        const avatarName = newBtn.dataset.avatar;
        gameState.avatar = avatarName;
        updateBackgroundByAvatar(avatarName);
        startBackgroundRotation(avatarName); // Rotation auto après changement d'avatar

        // Mettre à jour la sélection visuelle
        document.querySelectorAll('.avatar-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.avatar === avatarName);
        });

        // Mettre à jour l'image d'avatar actuel
        const currentImg = document.getElementById('current-avatar-img');
        if (currentImg) {
          currentImg.src = `assets/images/arcade/${avatarName}_head_avatar_128x128.png`;
          currentImg.alt = avatarName;
        }

        // 🔧 FIX: Sauvegarder automatiquement l'avatar sélectionné
        const userData = UserState.getCurrentUserData();
        userData.avatar = avatarName;
        UserState.updateUserData(userData);
        console.log(`🎨 Avatar "${avatarName}" sauvegardé automatiquement`);
      });
    });

    // Ajouter le clavier virtuel pour le surnom
    const nicknameInput = document.getElementById('nickname-input');
    /**
     * Fonction if
     * @param {*} nicknameInput - Description du paramètre
     * @returns {*} Description du retour
     */
    if (nicknameInput) {
      // Afficher le clavier virtuel lorsque l'input reçoit le focus
      nicknameInput.addEventListener('focus', () => {
        const nicknameContainer = document.querySelector('.nickname-selector');
        const keyboardContainer = createVirtualKeyboard(nicknameInput, nicknameContainer);
        keyboardContainer.style.display = 'block';
      });

      // Sauvegarde du surnom
      const saveNicknameBtn = document.getElementById('save-nickname-btn');
      /**
       * Fonction if
       * @param {*} saveNicknameBtn - Description du paramètre
       * @returns {*} Description du retour
       */
      if (saveNicknameBtn) {
        // Supprimer l'ancien écouteur s'il existe
        const newSaveBtn = saveNicknameBtn.cloneNode(true);
        saveNicknameBtn.parentNode.replaceChild(newSaveBtn, saveNicknameBtn);
        newSaveBtn.addEventListener('click', () => {
          const nickname = nicknameInput.value.trim();
          /**
           * Fonction if
           * @param {*} nickname - Description du paramètre
           * @returns {*} Description du retour
           */
          if (nickname) {
            gameState.nickname = nickname;
            showMessage(getTranslation('nickname_saved'));

            // Mettre à jour et sauvegarder immédiatement le surnom utilisateur
            const userData = UserState.getCurrentUserData();
            userData.nickname = nickname;
            UserState.updateUserData(userData);
            updateWelcomeMessageUI();

            // Tâche 1.5: Cacher le clavier virtuel après sauvegarde
            const keyboardId = `virtual-keyboard-${nicknameInput.id}`;
            const keyboardContainer = document.getElementById(keyboardId);
            /**
             * Fonction if
             * @param {*} keyboardContainer - Description du paramètre
             * @returns {*} Description du retour
             */
            if (keyboardContainer) {
              keyboardContainer.style.display = 'none';
            }
          }
        });
      }
    }

    // Sélection thème d'aventure
    document.querySelectorAll('.theme-btn').forEach(btn => {
      // Supprimer l'ancien écouteur s'il existe
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', () => {
        const themeName = newBtn.dataset.theme;
        // Mettre à jour l'état global
        gameState.theme = themeName;
        // Mettre à jour la sélection visuelle
        document.querySelectorAll('.theme-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.theme === themeName);
        });
        // Note: updateTheme n'existe pas, la sauvegarde se fait dans saveCustomization
      });
    });

    // Sélection thème de couleurs
    document.querySelectorAll('.color-theme-btn').forEach(btn => {
      // Supprimer l'ancien écouteur s'il existe
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', () => {
        this.updateColorTheme(newBtn.dataset.colorTheme);
      });
    });

    // Tâche 4.2: Ajouter navigation clavier par flèches aux sélecteurs
    addArrowKeyNavigation(document.querySelector('.avatar-selector'), '.avatar-btn:not(.locked)');
    addArrowKeyNavigation(document.querySelector('.theme-selector'), '.theme-btn');
    addArrowKeyNavigation(document.querySelector('.color-theme-selector'), '.color-theme-btn');

    // Bouton « Vider le cache »
    const clearBtn = document.getElementById('clear-cache-btn');
    if (clearBtn && !clearBtn.dataset.listenerAttached) {
      clearBtn.addEventListener('click', () => {
        this.handleClearCacheClick();
      });
      clearBtn.dataset.listenerAttached = 'true';
    }
  },

  async handleClearCacheClick() {
    if (!this._confirmClear()) return;
    this._notifyClearing();
    try {
      await this._tryModuleClear();
    } catch {
      this._fallbackClear();
    }
  },

  _confirmClear() {
    const msg = getTranslation('clear_cache_confirm') || 'Vider le cache et recharger ?';
    const canConfirm =
      typeof globalThis !== 'undefined' && typeof globalThis.confirm === 'function';
    return canConfirm ? globalThis.confirm(msg) : true;
  },

  _notifyClearing() {
    try {
      showMessage(getTranslation('clearing_cache_message') || 'Nettoyage du cache...');
    } catch (e) {
      void e;
    }
  },

  async _tryModuleClear() {
    const mod = await import('../cache-updater.js');
    try {
      mod.forceDevCacheClear?.();
    } catch (e) {
      void e;
    }
    setTimeout(() => {
      try {
        mod.clearCacheAndReload?.();
      } catch (e) {
        void e;
      }
    }, 200);
  },

  _fallbackClear() {
    try {
      const cachesApi =
        typeof globalThis !== 'undefined' && globalThis.caches ? globalThis.caches : null;
      if (cachesApi) {
        cachesApi
          .keys()
          .then(names => Promise.all(names.map(n => cachesApi.delete(n))))
          .finally(() => globalThis.location && globalThis.location.reload());
      } else {
        if (globalThis.location) globalThis.location.reload();
      }
    } catch (err) {
      void err;
      if (globalThis.location) globalThis.location.reload();
    }
  },

  /**
   * Mettre à jour le thème de couleurs
   */
  updateColorTheme(themeName) {
    // Sauvegarder le thème dans gameState et localStorage
    gameState.colorTheme = themeName;
    localStorage.setItem('colorTheme', themeName);

    document.querySelectorAll('.color-theme-btn').forEach(btn => {
      const isActive = btn.dataset.colorTheme === themeName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Retirer toutes les classes de thème de couleur
    document.body.classList.remove(
      'theme-pink',
      'theme-blue',
      'theme-green',
      'theme-orange',
      'theme-dark'
    );

    // Ajouter la classe pour le nouveau thème si ce n'est pas le thème par défaut
    /**
     * Fonction if
     * @param {*} themeName - Description du paramètre
     * @returns {*} Description du retour
     */
    if (themeName !== 'default') {
      document.body.classList.add('theme-' + themeName);
    }

    // Message de confirmation
    showMessage(
      getTranslation('color_theme_applied', {
        themeName: getTranslation(`color_theme_${themeName}`) || themeName,
      })
    );
  },

  /**
   * Sauvegarder les personnalisations
   */
  save() {
    const userData = UserState.getCurrentUserData();

    userData.avatar = gameState.avatar;
    userData.nickname = gameState.nickname;
    userData.theme = gameState.theme;
    userData.unlockedAvatars = gameState.unlockedAvatars;

    // Tâche 5.1: Sauvegarder l'état du code parental
    const parentalLockToggle = document.getElementById('parental-lock-toggle');
    /**
     * Fonction if
     * @param {*} parentalLockToggle - Description du paramètre
     * @returns {*} Description du retour
     */
    if (parentalLockToggle) {
      userData.parentalLockEnabled = parentalLockToggle.checked;
      // Appeler saveParentalLockEnabled pour sauvegarder spécifiquement cette donnée
      saveParentalLockEnabled(parentalLockToggle.checked);
    }

    UserState.updateUserData(userData); // Sauvegarde l'objet players entier (qui inclut maintenant parentalLockEnabled)

    showMessage(getTranslation('customization_saved'));
  },
};

export const showCustomizationScreen = Customization.show.bind(Customization);
export const setupCustomizationEvents = Customization.setupEvents.bind(Customization);
export const updateColorTheme = Customization.updateColorTheme.bind(Customization);
export const saveCustomization = Customization.save.bind(Customization);

console.log('🎨 Module Customization chargé');

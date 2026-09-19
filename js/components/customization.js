/**
 * Composant Customization centralisé
 * Gère l'écran de personnalisation et toutes ses fonctionnalités
 * Phase 3.4 - Extraction des fonctions de personnalisation de main.js
 */
import { UserState } from '../core/userState.js';
import { gameState } from '../game.js';
import {
  showMessage,
  getTranslation,
  renderAvatarSelector,
  updateWelcomeMessageUI,
  updateBackgroundByAvatar,
} from '../utils-es6.js';
import { getAvatarHeadSrc, normalizeAvatarId } from '../main-helpers.js';
import { saveParentalLockEnabled } from '../storage.js';
import { createVirtualKeyboard } from '../virtual-keyboard.js';
import { singleActivation } from '../ui-feedback.js';
import { eventBus } from '../core/eventBus.js';
import UserManager from '../userManager.js';
import { createIcon } from './icons.js';

/** Avatars de la personnalisation (ceux de la création de profil, slide 0, sont à part) */
const SLIDE6_AVATARS = '#slide6 .avatar-selector .avatar-btn';

/** Libellés accessibles des trois boutons « A » (taille du texte) */
const FONT_SIZE_LABELS = {
  small: { key: 'text_size_small', fallback: 'Petit' },
  medium: { key: 'text_size_medium', fallback: 'Moyen' },
  large: { key: 'text_size_large', fallback: 'Grand' },
};

/**
 * Traduction avec repli lisible tant qu'une clé manque dans les fichiers de langue.
 * @param {string} key - Clé i18n
 * @param {string} fallback - Texte de repli
 * @returns {string}
 */
function tr(key, fallback) {
  try {
    const value = getTranslation(key);
    if (typeof value === 'string' && value && !/^\[.*\]$/.test(value)) return value;
  } catch (error) {
    void error; // i18n pas encore prêt : on garde le repli
  }
  return fallback;
}

/**
 * Remplit un modèle de texte : accepte {nom} et {{nom}} (les deux formes existent
 * dans les fichiers de langue ; getTranslation ne remplace que la première).
 * @param {string} template
 * @param {Object<string, string>} params
 * @returns {string}
 */
function fillTemplate(template, params) {
  let text = String(template || '');
  for (const [name, value] of Object.entries(params)) {
    text = text.split(`{{${name}}}`).join(value).split(`{${name}}`).join(value);
  }
  return text;
}

/** Retire un éventuel émoji décoratif en tête d'un libellé (« 🎨 Classique ») */
function stripLeadingSymbols(text) {
  return String(text || '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .trim();
}

export const Customization = {
  _languageBound: false,

  /**
   * Initialiser le composant Customization
   */
  init() {
    this.enhanceStaticControls();
    if (this._languageBound) return;
    this._languageBound = true;
    // Noms des avatars et infobulles : data-translate (main-helpers.js) ;
    // le texte alternatif de l'avatar actuel suit ici la nouvelle langue.
    eventBus.on('languageChanged', () => this._updateCurrentAvatarAlt());
  },

  /** Texte alternatif de « Avatar actuel » : le nom du personnage, dans la langue affichée */
  _updateCurrentAvatarAlt() {
    const currentImg = document.getElementById('current-avatar-img');
    if (!currentImg) return;
    const current = normalizeAvatarId(gameState.avatar);
    currentImg.alt = tr(current, current);
  },

  /**
   * Prépare une seule fois les contrôles écrits dans index.html :
   * pastilles de thème, boutons « A » nommés, bouton « Vider le cache ».
   */
  enhanceStaticControls() {
    this._enhanceColorThemeButtons();
    this._enhanceFontSizeButtons();
    this._ensureClearCacheButton();
  },

  /**
   * Bouton de thème = pastille (couleurs du thème) + libellé.
   * La pastille porte la classe du thème qu'elle montre : les jetons de
   * css/themes.css s'y appliquent, sans couleur écrite en dur.
   */
  _enhanceColorThemeButtons() {
    for (const btn of document.querySelectorAll('.color-theme-btn')) {
      if (btn.querySelector('.color-theme-swatch')) continue;
      const theme = btn.dataset.colorTheme || 'default';
      const key = btn.dataset.translate || `color_theme_${theme}`;
      const fallback = stripLeadingSymbols(btn.textContent);

      // Le texte traduit vit dans le libellé : data-translate sur le bouton effacerait la pastille
      btn.removeAttribute('data-translate');
      btn.type = 'button';

      const swatch = document.createElement('span');
      swatch.className = 'color-theme-swatch';
      swatch.setAttribute('aria-hidden', 'true');
      // Classique n'a pas de classe de thème : la feuille lui rend ses jetons (data-theme-preview)
      const fill = document.createElement('span');
      fill.className =
        theme === 'default' ? 'color-theme-swatch-fill' : `color-theme-swatch-fill theme-${theme}`;
      fill.dataset.themePreview = theme;
      swatch.appendChild(fill);

      const label = document.createElement('span');
      label.className = 'color-theme-label';
      label.dataset.translate = key;
      label.textContent = tr(key, fallback);

      btn.replaceChildren(swatch, label);
      if (!btn.hasAttribute('aria-pressed')) {
        btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
      }
    }
  },

  /** Les trois « A » : un nom accessible chacun et l'état sélectionné (aria-pressed) */
  _enhanceFontSizeButtons() {
    const selector = document.querySelector('.font-size-selector');
    if (!selector) return;

    if (!selector.hasAttribute('role')) {
      selector.setAttribute('role', 'group');
      const caption = selector.querySelector(':scope > span');
      if (caption) {
        caption.id = caption.id || 'font-size-selector-label';
        selector.setAttribute('aria-labelledby', caption.id);
      }
    }

    for (const btn of selector.querySelectorAll('.font-size-btn')) {
      const label = FONT_SIZE_LABELS[btn.dataset.size];
      if (!label) continue;
      btn.type = 'button';
      const text = tr(label.key, label.fallback);
      btn.setAttribute('aria-label', text);
      btn.dataset.translateAriaLabel = label.key;
      btn.title = text;
      btn.dataset.translateTitle = label.key;
      btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
    }
  },

  /** Petit bouton discret « Vider le cache », en fin de section accessibilité */
  _ensureClearCacheButton() {
    const opts = document.querySelector('#slide6 .accessibility-options');
    if (!opts || opts.querySelector('#clear-cache-btn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'clear-cache-btn';
    btn.className = 'btn btn-quiet btn-sm clear-cache-btn';
    btn.dataset.translate = 'clear_cache_button';
    btn.textContent = tr('clear_cache_button', 'Vider le cache');
    opts.appendChild(btn);
  },

  /**
   * Flèches : déplacent le focus dans un groupe de boutons, à partir du bouton
   * qui a le focus. Entrée et Espace gardent leur comportement natif.
   * @param {Element|null} container - Groupe de boutons
   * @param {string} itemSelector - Boutons navigables
   */
  _bindArrowKeys(container, itemSelector) {
    if (!container || container.dataset.arrowKeysBound) return;
    const steps = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    container.addEventListener('keydown', event => {
      const step = steps[event.key];
      if (!step) return;
      const items = [...container.querySelectorAll(itemSelector)].filter(item => !item.disabled);
      const index = items.indexOf(document.activeElement);
      if (index === -1) return;
      event.preventDefault();
      // La navigation globale au clavier ne doit pas déplacer le focus une seconde fois
      event.stopPropagation();
      items[(index + step + items.length) % items.length].focus();
    });
    container.dataset.arrowKeysBound = 'true';
  },

  /**
   * Avatars de la personnalisation : sémantique de boutons radio (le conteneur
   * est un radiogroup). Si le cadenas est encore un émoji dans un <span>, il est
   * redessiné en SVG ; un cadenas déjà en SVG est laissé tel quel.
   */
  _decorateAvatarSelector() {
    const current = gameState.avatar || 'fox';
    for (const btn of document.querySelectorAll(SLIDE6_AVATARS)) {
      btn.type = 'button';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(btn.dataset.avatar === current));
      const lock = btn.querySelector('.lock-icon');
      if (lock && !(lock instanceof SVGElement) && !lock.querySelector('svg')) {
        const icon = createIcon('lock', { size: 20 });
        if (icon) lock.replaceChildren(icon);
      }
    }
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
    const heroMascotImg = document.getElementById('hero-mascot-img');
    const current = gameState.avatar || 'fox';
    if (currentImg) {
      currentImg.src = getAvatarHeadSrc(current);
      currentImg.alt = tr(current, current);
    }
    // Mascotte de l'accueil : visage 128 px, décoratif (la bulle porte le message)
    if (heroMascotImg) {
      heroMascotImg.src = getAvatarHeadSrc(current);
      heroMascotImg.alt = '';
    }
    for (const btn of document.querySelectorAll(SLIDE6_AVATARS)) {
      btn.classList.toggle('active', btn.dataset.avatar === (gameState.avatar || 'fox'));
    }
    this._decorateAvatarSelector();

    // Mettre à jour le champ de surnom
    const nicknameInput = document.getElementById('nickname-input');
    if (nicknameInput) {
      nicknameInput.value = gameState.nickname;
    }

    // Tâche 5.1: Mettre à jour l'état de la checkbox du code parental
    const parentalLockToggle = document.getElementById('parental-lock-toggle');
    if (parentalLockToggle) {
      parentalLockToggle.checked = userData.parentalLockEnabled === true;
    }

    // Contrôles statiques (idempotent) puis écouteurs
    this.enhanceStaticControls();
    this.setupEvents();
  },

  /**
   * Configurer les événements de l'écran de personnalisation
   */
  setupEvents() {
    // Sélection d'avatar (seulement ceux de la personnalisation, pas ceux de la création de profil)
    for (const btn of document.querySelectorAll(`${SLIDE6_AVATARS}:not(.locked)`)) {
      // Supprimer l'ancien écouteur s'il existe pour éviter les doublons
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', () => {
        const avatarName = newBtn.dataset.avatar;
        gameState.avatar = avatarName;
        updateBackgroundByAvatar(avatarName);

        // Mettre à jour la sélection visuelle
        for (const avatarBtn of document.querySelectorAll(SLIDE6_AVATARS)) {
          const isSelected = avatarBtn.dataset.avatar === avatarName;
          avatarBtn.classList.toggle('active', isSelected);
          avatarBtn.setAttribute('aria-checked', String(isSelected));
        }

        // Mettre à jour l'image d'avatar actuel
        const currentImg = document.getElementById('current-avatar-img');
        if (currentImg) {
          currentImg.src = getAvatarHeadSrc(avatarName);
          currentImg.alt = tr(avatarName, avatarName);
        }

        // Mascotte de l'accueil : visage 128 px, décoratif
        const heroMascotImg = document.getElementById('hero-mascot-img');
        if (heroMascotImg) {
          heroMascotImg.src = getAvatarHeadSrc(avatarName);
          heroMascotImg.alt = '';
        }

        // Sauvegarder automatiquement l'avatar sélectionné
        const userData = UserState.getCurrentUserData();
        userData.avatar = avatarName;
        UserState.updateUserData(userData);
        // « Qui joue ? » montre le visage de l'avatar : la tuile suit le nouveau choix
        UserManager.refreshUserList();
      });
    }

    // Ajouter le clavier virtuel pour le surnom
    const nicknameInput = document.getElementById('nickname-input');
    if (nicknameInput) {
      // Afficher le clavier virtuel lorsque l'input reçoit le focus
      nicknameInput.addEventListener('focus', () => {
        const nicknameContainer = document.querySelector('.nickname-selector');
        const keyboardContainer = createVirtualKeyboard(nicknameInput, nicknameContainer);
        keyboardContainer.style.display = 'block';
      });

      // Sauvegarde du surnom
      const saveNicknameBtn = document.getElementById('save-nickname-btn');
      if (saveNicknameBtn) {
        // Supprimer l'ancien écouteur s'il existe
        const newSaveBtn = saveNicknameBtn.cloneNode(true);
        saveNicknameBtn.parentNode.replaceChild(newSaveBtn, saveNicknameBtn);
        newSaveBtn.addEventListener('click', () => {
          const nickname = nicknameInput.value.trim();
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
            if (keyboardContainer) {
              keyboardContainer.style.display = 'none';
            }
          }
        });
      }
    }

    // Sélection thème d'aventure
    for (const btn of document.querySelectorAll('.theme-btn')) {
      // Supprimer l'ancien écouteur s'il existe
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', () => {
        const themeName = newBtn.dataset.theme;
        // Mettre à jour l'état global
        gameState.theme = themeName;
        // Mettre à jour la sélection visuelle
        for (const themeBtn of document.querySelectorAll('.theme-btn')) {
          themeBtn.classList.toggle('active', themeBtn.dataset.theme === themeName);
        }
        // Note: updateTheme n'existe pas, la sauvegarde se fait dans saveCustomization
      });
    }

    // Sélection thème de couleurs
    for (const btn of document.querySelectorAll('.color-theme-btn')) {
      // Supprimer l'ancien écouteur s'il existe
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener(
        'click',
        singleActivation(() => {
          this.updateColorTheme(newBtn.dataset.colorTheme);
        })
      );
    }

    // Tâche 4.2: navigation par flèches dans les groupes (Entrée et Espace restent natifs)
    this._bindArrowKeys(
      document.querySelector('#slide6 .avatar-selector'),
      '.avatar-btn:not(.locked)'
    );
    this._bindArrowKeys(document.querySelector('.color-theme-selector'), '.color-theme-btn');

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

    for (const btn of document.querySelectorAll('.color-theme-btn')) {
      const isActive = btn.dataset.colorTheme === themeName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    }

    // Retirer toutes les classes de thème de couleur
    document.body.classList.remove(
      'theme-pink',
      'theme-blue',
      'theme-green',
      'theme-orange',
      'theme-dark'
    );

    // Ajouter la classe pour le nouveau thème si ce n'est pas le thème par défaut
    if (themeName !== 'default') {
      document.body.classList.add('theme-' + themeName);
    }

    // Message de confirmation
    const label = tr(`color_theme_${themeName}`, themeName);
    showMessage(
      fillTemplate(tr('color_theme_applied', 'Thème {themeName} appliqué !'), {
        themeName: label,
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

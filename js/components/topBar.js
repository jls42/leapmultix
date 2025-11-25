/**
 * Composant TopBar centralisé
 * Gère l'affichage et la logique de la barre supérieure pour toutes les slides
 * Phase 3.2 - Centralisation des 8 barres dupliquées
 */
import {
  getTranslation,
  changeLanguage,
  applyStaticTranslations,
  isVoiceEnabled as _isVoiceEnabled,
  speak as _speak,
} from '../utils-es6.js';
import { AudioManager } from '../core/audio.js';
import { goToSlide } from '../slides.js';
import Storage from '../core/storage.js';
import { eventBus } from '../core/eventBus.js';
import UserManager from '../userManager.js';
import { UserState } from '../core/userState.js';

const tableSettingsListeners = new WeakSet();

export const TopBar = {
  _outsideClickBound: false,
  /**
   * Initialiser le composant TopBar
   */
  init() {
    this.injectTopBarIntoSlides();
    this.setupEventListeners();

    // Mise à jour des traductions après un court délai (sans dépendre de window.i18nReady)
    setTimeout(() => {
      try {
        this.updateTranslations();
      } catch {
        /* no-op: translations update safe */
      }
    }, 120);

    // Re-mise à jour quand la langue change (assure les clés traduites après chargement)
    try {
      eventBus.on('languageChanged', () => {
        this.updateTranslations();
      });
    } catch {
      /* no-op: listener optional */
    }
  },

  /**
   * Générer le HTML de la barre supérieure
   * @param {string} slideId - ID de la slide (ex: 'slide1')
   * @param {Object} options - Options pour personnaliser la barre
   * @returns {string} HTML de la barre supérieure
   */
  generateTopBarHTML(slideId, options = {}) {
    const slideNumber = slideId.replace('slide', '');

    // Configuration par défaut
    const config = {
      showHomeButton: slideNumber !== '0' && slideNumber !== '1', // Pas de bouton home sur sélection utilisateur ET accueil
      showCoinDisplay: slideNumber !== '0', // Pas de pièces sur sélection utilisateur
      showChangeUserButton: slideNumber !== '0', // Pas de changement utilisateur sur sélection
      ...options,
    };

    // Bouton Accueil
    const homeButton = config.showHomeButton
      ? `<button id="home-button-${slideId}" class="btn home-btn" title="Accueil" data-translate-title="home_button_label">🏠</button>`
      : `<button id="home-button-${slideId}" class="btn home-btn" style="visibility: hidden;" title="Accueil" data-translate-title="home_button_label">🏠</button>`;

    // Sélecteur de langue
    const languageSelector = `
            <div class="language-selector">
                <button class="lang-btn active" data-lang="fr">🇫🇷</button>
                <button class="lang-btn" data-lang="en">🇬🇧</button>
                <button class="lang-btn" data-lang="es">🇪🇸</button>
            </div>`;

    // Bouton paramètres de tables (visible uniquement si utilisateur connecté)
    const tableSettingsButton = config.showCoinDisplay
      ? `<button id="table-settings-btn-${slideId}" class="btn btn-sm table-settings-btn" title="Paramètres des tables" data-translate-title="table_settings_button_label">⚙️</button>`
      : '';

    // Contrôles de volume
    const volumeControls = `
            <div class="global-volume-controls">
                <button id="mute-button-${slideId}" class="btn btn-sm mute-btn" title="Couper le son" data-translate-title="mute_button_label_on">🔊</button>
                <input type="range" id="global-volume-slider-${slideId}" min="0" max="1" step="0.1" value="1" class="volume-slider">
            </div>`;

    // Toggle Synthèse vocale
    const voiceEnabled = (() => {
      try {
        return !!Storage.loadVoiceEnabled();
      } catch {
        return true;
      }
    })();
    const voiceToggle = `
            <div class="voice-toggle-controls">
                <button id="voice-toggle-${slideId}" class="btn btn-sm voice-toggle" aria-pressed="${voiceEnabled}" title="${getTranslation(voiceEnabled ? 'voice_toggle_on' : 'voice_toggle_off') || (voiceEnabled ? 'Désactiver la voix' : 'Activer la voix')}">
                    ${voiceEnabled ? '🗣️' : '🤐'}
                </button>
            </div>`;

    // Affichage des pièces
    const coinDisplay = config.showCoinDisplay
      ? `<span class="coin-display">🪙 <span class="coin-count">0</span></span>`
      : '';

    // Bouton changement d'utilisateur
    const changeUserButton = config.showChangeUserButton
      ? `<button class="btn change-user-btn" data-slide="0" data-translate="change_user">Changer d'utilisateur</button>`
      : '';

    // Bouton À propos / Info
    const aboutButton =
      config.showAboutButton !== false
        ? `<button class="btn btn-sm about-btn" data-slide="8" title="À propos de l'application" data-translate-title="about_button_label">ℹ️</button>`
        : '';

    // Style pour slide 0 (position relative pour la note développeur)
    const topBarStyle = slideNumber === '0' ? 'position: relative;' : '';

    return `
            <div class="top-bar ${slideNumber === '0' ? 'top-bar--slide0' : ''}" style="${topBarStyle}">
                ${homeButton}
                ${aboutButton}
                ${languageSelector}
                ${tableSettingsButton}
                ${volumeControls}
                ${voiceToggle}
                ${coinDisplay}
                ${changeUserButton}
            </div>`;
  },

  /**
   * Construire un élément DOM TopBar (sans innerHTML/insertAdjacentHTML)
   */
  buildTopBarElement(slideId, options = {}) {
    const slideNumber = slideId.replace('slide', '');
    const config = {
      showHomeButton: slideNumber !== '0' && slideNumber !== '1',
      showCoinDisplay: slideNumber !== '0',
      showChangeUserButton: slideNumber !== '0',
      ...options,
    };

    const top = document.createElement('div');
    top.className = `top-bar ${slideNumber === '0' ? 'top-bar--slide0' : ''}`.trim();
    if (slideNumber === '0') top.style.position = 'relative';

    // --- Always Visible Elements ---
    const home = document.createElement('button');
    home.id = `home-button-${slideId}`;
    home.className = 'btn home-btn';
    home.title = 'Accueil';
    home.dataset.translateTitle = 'home_button_label';
    home.textContent = '🏠';
    if (!config.showHomeButton) home.style.visibility = 'hidden';
    top.appendChild(home);

    if (config.showAboutButton !== false) {
      const about = document.createElement('button');
      about.className = 'btn btn-sm about-btn';
      about.dataset.slide = '8';
      about.title = "À propos de l'application";
      about.dataset.translateTitle = 'about_button_label';
      about.textContent = 'ℹ️';
      top.appendChild(about);
    }

    if (config.showCoinDisplay) {
      const coins = document.createElement('span');
      coins.className = 'coin-display';
      coins.append('🪙 ');
      const count = document.createElement('span');
      count.className = 'coin-count';
      count.textContent = '0';
      coins.appendChild(count);
      top.appendChild(coins);
    }

    // --- Burger Menu Button (Mobile only) ---
    const burgerBtn = document.createElement('button');
    burgerBtn.className = 'burger-menu-btn';
    burgerBtn.textContent = '☰'; // Burger icon
    burgerBtn.setAttribute('aria-label', 'Toggle menu');
    top.appendChild(burgerBtn);

    // --- Navigation Container (for Burger Menu) ---
    const navContainer = document.createElement('div');
    navContainer.className = 'top-bar-nav';
    top.appendChild(navContainer);

    // --- Elements inside Nav Container ---
    const langWrap = document.createElement('div');
    langWrap.className = 'language-selector';
    [
      ['fr', '🇫🇷'],
      ['en', '🇬🇧'],
      ['es', '🇪🇸'],
    ].forEach(([code, flag], idx) => {
      const btn = document.createElement('button');
      btn.className = `lang-btn${idx === 0 ? ' active' : ''}`;
      btn.dataset.lang = code;
      btn.textContent = flag;
      langWrap.appendChild(btn);
    });
    navContainer.appendChild(langWrap);

    // Bouton paramètres de tables (visible uniquement si utilisateur connecté)
    if (config.showCoinDisplay) {
      const tableSettingsBtn = document.createElement('button');
      tableSettingsBtn.id = `table-settings-btn-${slideId}`;
      tableSettingsBtn.className = 'btn btn-sm table-settings-btn';
      tableSettingsBtn.title = 'Paramètres des tables';
      tableSettingsBtn.dataset.translateTitle = 'table_settings_button_label';
      tableSettingsBtn.textContent = '⚙️';
      navContainer.appendChild(tableSettingsBtn);
    }

    const volWrap = document.createElement('div');
    volWrap.className = 'global-volume-controls';
    const mute = document.createElement('button');
    mute.id = `mute-button-${slideId}`;
    mute.className = 'btn btn-sm mute-btn';
    mute.title = 'Couper le son';
    mute.dataset.translateTitle = 'mute_button_label_on';
    mute.textContent = '🔊';
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = `global-volume-slider-${slideId}`;
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.1';
    slider.value = '1';
    slider.className = 'volume-slider';
    volWrap.appendChild(mute);
    volWrap.appendChild(slider);
    navContainer.appendChild(volWrap);

    const voiceWrap = document.createElement('div');
    voiceWrap.className = 'voice-toggle-controls';
    const voiceBtn = document.createElement('button');
    voiceBtn.className = 'btn btn-sm voice-toggle';
    const voiceEnabled = (() => {
      try {
        return !!Storage.loadVoiceEnabled();
      } catch {
        return true;
      }
    })();
    voiceBtn.setAttribute('aria-pressed', String(voiceEnabled));
    voiceBtn.title =
      getTranslation(voiceEnabled ? 'voice_toggle_on' : 'voice_toggle_off') ||
      (voiceEnabled ? 'Désactiver la voix' : 'Activer la voix');
    voiceBtn.textContent = voiceEnabled ? '🗣️' : '🤐';
    voiceWrap.appendChild(voiceBtn);
    navContainer.appendChild(voiceWrap);

    if (config.showChangeUserButton) {
      const change = document.createElement('button');
      change.className = 'btn change-user-btn';
      change.dataset.slide = '0';
      change.dataset.translate = 'change_user';
      change.textContent = "Changer d'utilisateur";
      navContainer.appendChild(change);
    }

    return top;
  },

  /**
   * Injecter la barre supérieure dans toutes les slides
   */
  injectTopBarIntoSlides() {
    // Identifier toutes les slides
    const slides = document.querySelectorAll('.slide');

    slides.forEach(slide => {
      const slideId = slide.id;
      const replacement = this.buildTopBarElement(slideId);

      const existingTopBar = slide.querySelector('.top-bar');
      if (existingTopBar) {
        existingTopBar.replaceWith(replacement);
      } else {
        slide.insertBefore(replacement, slide.firstChild);
      }
    });
  },

  /**
   * Configurer les écouteurs d'événements pour la barre supérieure
   */
  setupEventListeners() {
    this.attachHomeButtons();
    this.attachLanguageButtons();
    this.attachVolumeControls();
    this.attachVoiceToggles();
    this.attachTableSettingsButtons();
    this.attachBurgerMenus();
    this.attachOutsideClickWatcher();

    // Mise à jour initiale de la visibilité du bouton de paramètres de tables
    this.updateTableSettingsButtonVisibility();

    // Écouter les changements d'opération pour mettre à jour la visibilité
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('operation-changed', () => {
        this.updateTableSettingsButtonVisibility();
      });
    }
  },

  attachHomeButtons() {
    for (const btn of document.querySelectorAll('.home-btn')) {
      btn.addEventListener('click', () => {
        goToSlide(1);
      });
    }
  },

  attachLanguageButtons() {
    for (const btn of document.querySelectorAll('.lang-btn')) {
      btn.addEventListener('click', event => {
        const lang = event.currentTarget?.dataset?.lang;
        if (lang) changeLanguage(lang);
      });
    }
  },

  attachVolumeControls() {
    for (const btn of document.querySelectorAll('.mute-btn')) {
      if (!btn.dataset.topBarListenerAttached) {
        btn.addEventListener('click', () => {
          AudioManager.toggleMute();
        });
        btn.dataset.topBarListenerAttached = 'true';
      }
    }

    for (const slider of document.querySelectorAll('.volume-slider')) {
      if (!slider.dataset.topBarListenerAttached) {
        slider.addEventListener('input', event => {
          const newVolume = Number.parseFloat(event.currentTarget?.value || '0');
          AudioManager.setVolume(newVolume);
        });
        slider.dataset.topBarListenerAttached = 'true';
      }
    }
  },

  attachVoiceToggles() {
    for (const btn of document.querySelectorAll('.voice-toggle')) {
      if (!btn.dataset.topBarListenerAttached) {
        btn.addEventListener('click', () => {
          try {
            const enabled = !!Storage.loadVoiceEnabled();
            const next = !enabled;
            Storage.saveVoiceEnabled(next);
            this.updateVoiceToggleUI(next);
            if (next) {
              try {
                _speak(getTranslation('voice_enabled') || 'Synthèse vocale activée');
              } catch (error) {
                console.warn('TopBar voice announcement failed', error);
              }
            }
          } catch (error) {
            console.warn('TopBar voice toggle failed', error);
          }
        });
        btn.dataset.topBarListenerAttached = 'true';
      }
    }
  },

  attachTableSettingsButtons() {
    for (const btn of document.querySelectorAll('.table-settings-btn')) {
      if (tableSettingsListeners.has(btn)) continue;
      btn.addEventListener('click', () => {
        const currentUser =
          typeof UserManager.getCurrentUser === 'function' ? UserManager.getCurrentUser() : null;
        if (!currentUser) {
          alert(
            getTranslation('table_settings_requires_user') ||
              'Choisis un profil avant de personnaliser les tables.'
          );
          return;
        }
        import('../components/tableSettingsModal.js')
          .then(module => {
            module.TableSettingsModal.open();
          })
          .catch(error => {
            console.error('Erreur chargement modale paramètres tables:', error);
          });
      });
      tableSettingsListeners.add(btn);
    }
  },

  /**
   * Met à jour la visibilité du bouton de paramètres de tables
   * Masque le bouton si l'opération n'est pas la multiplication
   */
  updateTableSettingsButtonVisibility() {
    const operator = UserState.getCurrentUserData().preferredOperator || '×';
    const buttons = document.querySelectorAll('.table-settings-btn');

    buttons.forEach(btn => {
      if (operator === '×') {
        // Multiplication : afficher le bouton
        btn.style.display = '';
        btn.disabled = false;
      } else {
        // Autres opérations : masquer le bouton
        btn.style.display = 'none';
        btn.disabled = true;
      }
    });
  },

  attachBurgerMenus() {
    for (const btn of document.querySelectorAll('.burger-menu-btn')) {
      if (!btn.dataset.topBarListenerAttached) {
        btn.addEventListener('click', event => {
          const topBar = event.currentTarget?.closest('.top-bar');
          if (topBar) {
            const nav = topBar.querySelector('.top-bar-nav');
            if (nav) {
              nav.classList.toggle('is-open');
            }
          }
          event.stopPropagation();
        });
        btn.dataset.topBarListenerAttached = 'true';
      }
    }
  },

  attachOutsideClickWatcher() {
    if (this._outsideClickBound) return;
    document.addEventListener('click', event => {
      for (const nav of document.querySelectorAll('.top-bar-nav.is-open')) {
        const topBar = nav.closest('.top-bar');
        if (topBar && !topBar.contains(event.target)) {
          nav.classList.remove('is-open');
        }
      }
    });
    this._outsideClickBound = true;
  },

  /**
   * Mettre à jour l'affichage des pièces dans toutes les top-bars
   * @param {number} count - Nombre de pièces
   */
  updateCoinDisplay(count) {
    document.querySelectorAll('.coin-count').forEach(el => {
      el.textContent = count || 0;
    });
  },

  /**
   * Mettre à jour l'affichage du toggle Voix
   */
  updateVoiceToggleUI(enabledParam) {
    const enabled =
      typeof enabledParam === 'boolean'
        ? enabledParam
        : (() => {
            try {
              return !!Storage.loadVoiceEnabled();
            } catch {
              return true;
            }
          })();
    document.querySelectorAll('.voice-toggle').forEach(btn => {
      btn.setAttribute('aria-pressed', String(enabled));
      btn.textContent = enabled ? '🗣️' : '🤐';
      const titleKey = enabled ? 'voice_toggle_on' : 'voice_toggle_off';
      const fallback = enabled ? 'Désactiver la voix' : 'Activer la voix';
      btn.title = getTranslation(titleKey) || fallback;
    });
  },

  /**
   * Mettre à jour l'état des boutons de langue
   * @param {string} activeLang - Langue active ('fr', 'en', 'es')
   */
  updateLanguageButtons(activeLang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === activeLang);
    });
  },

  /**
   * Mettre à jour les contrôles de volume dans toutes les top-bars
   * @param {number} volume - Volume (0-1)
   * @param {boolean} muted - État muet
   */
  updateVolumeControls(volume, muted) {
    // Mettre à jour les boutons mute
    document.querySelectorAll('.mute-btn').forEach(btn => {
      btn.textContent = volume > 0 && !muted ? '🔊' : '🔇';
      btn.title = getTranslation(
        volume > 0 && !muted ? 'mute_button_label_on' : 'mute_button_label_off'
      );
    });

    // Mettre à jour les sliders
    document.querySelectorAll('.volume-slider').forEach(slider => {
      slider.value = volume;
    });
  },

  /**
   * Forcer la mise à jour des traductions dans les TopBars
   */
  updateTranslations() {
    // Appliquer les traductions statiques via ESM
    applyStaticTranslations();

    // Mettre à jour le toggle voix avec libellé traduit
    try {
      this.updateVoiceToggleUI(_isVoiceEnabled());
    } catch (e) {
      void e;
    }
  },
};

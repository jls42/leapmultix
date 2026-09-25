/**
 * Composant TopBar centralisé
 * Gère l'affichage et la logique de la barre supérieure pour toutes les slides
 * Phase 3.2 - Centralisation des 8 barres dupliquées
 *
 * Icônes : SVG en ligne (./icons.js). Chaque bouton d'icône porte un aria-label
 * et un title traduits ; son libellé texte n'est visible que dans le menu mobile.
 */
import {
  getTranslation,
  changeLanguage,
  applyStaticTranslations,
  isVoiceEnabled as _isVoiceEnabled,
  speak as _speak,
} from '../utils-es6.js';
import { AudioManager } from '../core/audio.js';
import { cancelSpeech, unlockSpeech } from '../speech.js';
import { goToSlide } from '../slides.js';
import Storage from '../core/storage.js';
import { eventBus } from '../core/eventBus.js';
import UserManager from '../userManager.js';
import { UserState } from '../core/userState.js';
import { singleActivation } from '../ui-feedback.js';
import { createIcon, setIcon } from './icons.js';

const tableSettingsListeners = new WeakSet();

/** Langues proposées : le nom est écrit dans sa propre langue (attribut lang). */
const LANGUAGES = [
  { code: 'fr', short: 'FR', name: 'Français' },
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'es', short: 'ES', name: 'Español' },
];

/** Libellés des états du son : l'intitulé décrit l'action proposée. */
const MUTE_STATES = {
  on: { icon: 'volume-2', key: 'mute_button_label_on', fallback: 'Couper le son' },
  off: { icon: 'volume-x', key: 'mute_button_label_off', fallback: 'Activer le son' },
};

/**
 * Voix : le nom du bouton reste fixe (aria-pressed porte l'état).
 * L'infobulle décrit l'action : « voice_toggle_off » vaut « Désactiver la voix »
 * (proposée quand la voix est active), « voice_toggle_on » vaut « Activer la voix ».
 */
const VOICE_LABEL = { key: 'voice_toggle_label', fallback: 'Lecture à voix haute' };
const VOICE_TITLES = {
  enabled: { key: 'voice_toggle_off', fallback: 'Désactiver la voix' },
  disabled: { key: 'voice_toggle_on', fallback: 'Activer la voix' },
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
  } catch {
    // i18n pas encore prêt : on garde le repli
  }
  return fallback;
}

/** Parole active : le choix du joueur, ou la voix enregistrée activée par défaut */
function readVoiceEnabled() {
  try {
    return !!_isVoiceEnabled();
  } catch {
    return false;
  }
}

function readLanguage() {
  try {
    return Storage.loadLanguage?.() || 'fr';
  } catch {
    return 'fr';
  }
}

function readVolume() {
  try {
    const volume = Number(AudioManager.getVolume?.());
    return Number.isFinite(volume) ? volume : 1;
  } catch {
    return 1;
  }
}

function readMuted() {
  try {
    return !!AudioManager.isMuted?.();
  } catch {
    return false;
  }
}

/**
 * Nom accessible, infobulle et libellé visible (menu mobile) d'un bouton d'icône.
 * Les attributs data-translate-* suivent la clé en cours : un changement de
 * langue réapplique toujours le libellé qui correspond à l'état affiché.
 */
function setButtonLabel(button, key, fallback) {
  const text = tr(key, fallback);
  button.setAttribute('aria-label', text);
  button.dataset.translateAriaLabel = key;
  button.title = text;
  button.dataset.translateTitle = key;
  const label = button.querySelector('.icon-btn-label');
  if (label) {
    label.textContent = text;
    label.dataset.translate = key;
  }
}

function setButtonTitle(button, key, fallback) {
  button.title = tr(key, fallback);
  button.dataset.translateTitle = key;
}

/**
 * Crée un bouton d'icône de la barre.
 * @param {Object} spec
 * @param {string} [spec.id]
 * @param {string} spec.className - Classes (conservent les classes historiques)
 * @param {string} spec.icon - Nom de l'icône
 * @param {string} spec.labelKey - Clé i18n du libellé
 * @param {string} spec.labelFallback - Libellé de repli
 * @returns {HTMLButtonElement}
 */
function createIconButton({ id, className, icon, labelKey, labelFallback }) {
  const button = document.createElement('button');
  button.type = 'button';
  if (id) button.id = id;
  button.className = className;
  const svg = createIcon(icon);
  if (svg) button.appendChild(svg);
  const label = document.createElement('span');
  label.className = 'icon-btn-label';
  button.appendChild(label);
  setButtonLabel(button, labelKey, labelFallback);
  return button;
}

/**
 * Rétablit le contenu canonique d'un bouton d'icône (icône + libellé), au cas où
 * un autre module aurait remplacé son texte (ex. : un émoji écrit via textContent).
 */
function renderIconButton(button, iconName) {
  const isCanonical = [...button.childNodes].every(
    node => node.nodeType === 1 && (node.matches('svg.icon') || node.matches('.icon-btn-label'))
  );
  if (!isCanonical || !button.querySelector(':scope > .icon-btn-label')) {
    const label = document.createElement('span');
    label.className = 'icon-btn-label';
    button.replaceChildren(label);
  }
  setIcon(button, iconName);
}

function applyMuteState(button, soundOn) {
  const state = soundOn ? MUTE_STATES.on : MUTE_STATES.off;
  renderIconButton(button, state.icon);
  setButtonLabel(button, state.key, state.fallback);
}

function applyVoiceState(button, enabled) {
  button.setAttribute('aria-pressed', String(enabled));
  renderIconButton(button, enabled ? 'speech' : 'speech-off');
  setButtonLabel(button, VOICE_LABEL.key, VOICE_LABEL.fallback);
  const title = enabled ? VOICE_TITLES.enabled : VOICE_TITLES.disabled;
  setButtonTitle(button, title.key, title.fallback);
}

function applyLanguageState(button, activeLang) {
  const isActive = button.dataset.lang === activeLang;
  button.classList.toggle('active', isActive);
  button.setAttribute('aria-pressed', String(isActive));
}

/** Un joueur est-il choisi ? (sinon, l'accueil et les réglages de profil n'ont pas de sens) */
function hasCurrentPlayer() {
  try {
    return Boolean(UserManager.getCurrentUser?.());
  } catch {
    return false;
  }
}

export const TopBar = {
  _outsideClickBound: false,
  _escapeBound: false,
  _playerWatchBound: false,
  _busBound: false,
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

    if (this._busBound) return;
    this._busBound = true;
    try {
      // Re-mise à jour quand la langue change (assure les clés traduites après chargement)
      eventBus.on('languageChanged', () => {
        this.updateTranslations();
      });
      // Le son change ailleurs (raccourci, profil, curseur) : la barre suit l'état réel
      eventBus.on('volumeChanged', event => {
        const detail = event?.detail || {};
        this.updateVolumeControls(detail.volume, detail.muted);
      });
      // Voix enregistrée : l'index reçu peut activer la parole par défaut
      eventBus.on('voice:changed', event => {
        this.updateVoiceToggleUI(event?.detail?.active);
      });
    } catch {
      /* no-op: listener optional */
    }
  },

  /**
   * Générer le HTML de la barre supérieure.
   * Dérivé de buildTopBarElement() : les deux chemins de rendu restent identiques.
   * @param {string} slideId - ID de la slide (ex: 'slide1')
   * @param {Object} options - Options pour personnaliser la barre
   * @returns {string} HTML de la barre supérieure
   */
  generateTopBarHTML(slideId, options = {}) {
    return this.buildTopBarElement(slideId, options).outerHTML;
  },

  /**
   * Construire un élément DOM TopBar (sans innerHTML/insertAdjacentHTML)
   * @param {string} slideId - ID de la slide (ex: 'slide1')
   * @param {Object} options - Options pour personnaliser la barre
   * @returns {HTMLDivElement}
   */
  buildTopBarElement(slideId, options = {}) {
    const slideNumber = slideId.replace('slide', '');
    const config = {
      showHomeButton: slideNumber !== '0' && slideNumber !== '1', // Pas d'accueil sur le choix du joueur ni sur l'accueil
      showCoinDisplay: slideNumber !== '0', // Pas de pièces sur le choix du joueur
      showChangeUserButton: slideNumber !== '0',
      ...options,
    };

    const top = document.createElement('div');
    top.className = `top-bar ${slideNumber === '0' ? 'top-bar--slide0' : ''}`.trim();

    // --- Toujours visibles ---
    const home = createIconButton({
      id: `home-button-${slideId}`,
      className: 'btn btn-secondary icon-btn home-btn',
      icon: 'house',
      labelKey: 'home_button_label',
      labelFallback: 'Accueil',
    });
    if (!config.showHomeButton) home.hidden = true;
    top.appendChild(home);

    if (config.showAboutButton !== false) {
      const about = createIconButton({
        className: 'btn btn-sm btn-secondary icon-btn about-btn',
        icon: 'info',
        labelKey: 'about_button_label',
        labelFallback: 'À propos',
      });
      about.dataset.slide = '8';
      top.appendChild(about);
    }

    if (config.showCoinDisplay) {
      top.appendChild(this._buildCoinDisplay());
    }

    // --- Bouton du menu (mobile et tablette) ---
    const navId = `top-bar-nav-${slideId}`;
    const burgerBtn = createIconButton({
      className: 'burger-menu-btn icon-btn',
      icon: 'menu',
      labelKey: 'top_bar_menu_label',
      labelFallback: 'Menu',
    });
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-controls', navId);
    top.appendChild(burgerBtn);

    // --- Contenu du menu ---
    const navContainer = document.createElement('div');
    navContainer.className = 'top-bar-nav';
    navContainer.id = navId;
    top.appendChild(navContainer);

    navContainer.appendChild(this._buildLanguageSelector());

    // Paramètres des tables (visible uniquement si un profil est choisi)
    if (config.showCoinDisplay) {
      navContainer.appendChild(
        createIconButton({
          id: `table-settings-btn-${slideId}`,
          className: 'btn btn-sm btn-secondary icon-btn table-settings-btn',
          icon: 'settings',
          labelKey: 'table_settings_button_label',
          labelFallback: 'Paramètres des tables',
        })
      );
    }

    navContainer.appendChild(this._buildVolumeControls(slideId));

    const voiceWrap = document.createElement('div');
    voiceWrap.className = 'voice-toggle-controls';
    const voiceBtn = createIconButton({
      id: `voice-toggle-${slideId}`,
      className: 'btn btn-sm btn-secondary icon-btn voice-toggle',
      icon: 'speech',
      labelKey: VOICE_LABEL.key,
      labelFallback: VOICE_LABEL.fallback,
    });
    applyVoiceState(voiceBtn, readVoiceEnabled());
    voiceWrap.appendChild(voiceBtn);
    navContainer.appendChild(voiceWrap);

    if (config.showChangeUserButton) {
      const change = document.createElement('button');
      change.type = 'button';
      change.className = 'btn btn-secondary change-user-btn';
      change.dataset.slide = '0';
      const icon = createIcon('users');
      if (icon) change.appendChild(icon);
      const changeLabel = document.createElement('span');
      changeLabel.dataset.translate = 'change_user';
      changeLabel.textContent = tr('change_user', 'Changer de joueur');
      change.appendChild(changeLabel);
      navContainer.appendChild(change);
    }

    return top;
  },

  _buildCoinDisplay() {
    const coins = document.createElement('span');
    coins.className = 'coin-display';
    const icon = createIcon('coin', { className: 'coin-icon' });
    if (icon) coins.appendChild(icon);
    const label = document.createElement('span');
    label.className = 'sr-only';
    label.dataset.translate = 'coins_label';
    label.textContent = tr('coins_label', 'Pièces');
    coins.appendChild(label);
    const count = document.createElement('span');
    count.className = 'coin-count';
    count.textContent = '0';
    coins.appendChild(count);
    return coins;
  },

  _buildLanguageSelector() {
    const langWrap = document.createElement('div');
    langWrap.className = 'language-selector';
    langWrap.setAttribute('role', 'group');
    langWrap.setAttribute('aria-label', tr('language_selector_label', 'Langue'));
    langWrap.dataset.translateAriaLabel = 'language_selector_label';
    const activeLang = readLanguage();
    for (const { code, short, name } of LANGUAGES) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-btn';
      btn.dataset.lang = code;
      btn.lang = code;
      // Le nom accessible reste le texte visible (« FR ») : une commande vocale
      // « clique sur FR » le trouve. Le nom complet de la langue est la description.
      btn.title = name;
      btn.textContent = short;
      applyLanguageState(btn, activeLang);
      langWrap.appendChild(btn);
    }
    return langWrap;
  },

  _buildVolumeControls(slideId) {
    const volWrap = document.createElement('div');
    volWrap.className = 'global-volume-controls';
    const mute = createIconButton({
      id: `mute-button-${slideId}`,
      className: 'btn btn-sm btn-secondary icon-btn mute-btn',
      icon: 'volume-2',
      labelKey: MUTE_STATES.on.key,
      labelFallback: MUTE_STATES.on.fallback,
    });
    const volume = readVolume();
    applyMuteState(mute, volume > 0 && !readMuted());

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = `global-volume-slider-${slideId}`;
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.1';
    slider.value = String(volume);
    slider.className = 'volume-slider';
    slider.setAttribute('aria-label', tr('volume_label', 'Volume'));
    slider.dataset.translateAriaLabel = 'volume_label';
    volWrap.appendChild(mute);
    volWrap.appendChild(slider);
    return volWrap;
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
    this.attachMenuEscapeWatcher();
    this.attachPlayerWatcher();

    // Mise à jour initiale de la visibilité du bouton de paramètres de tables
    this.updateTableSettingsButtonVisibility();
    this.updatePlayerControls();

    // Écouter les changements d'opération pour mettre à jour la visibilité
    if (globalThis.window !== undefined) {
      globalThis.addEventListener?.('operation-changed', () => {
        this.updateTableSettingsButtonVisibility();
      });
    }
  },

  attachHomeButtons() {
    for (const btn of document.querySelectorAll('.home-btn')) {
      if (btn.dataset.homeWired) continue;
      // Sans joueur choisi (À propos ouvert depuis « Qui joue ? », joueur supprimé),
      // l'accueil est le choix du joueur : on ne joue jamais sans profil.
      btn.addEventListener('click', () => {
        goToSlide(hasCurrentPlayer() ? 1 : 0);
      });
      btn.dataset.homeWired = 'true';
    }
  },

  /**
   * Pièces, paramètres des tables et « Changer de joueur » n'existent qu'avec un
   * joueur choisi : sans lui, ils sont retirés de toutes les barres.
   */
  updatePlayerControls() {
    const hidden = !hasCurrentPlayer();
    for (const el of document.querySelectorAll(
      '.top-bar .coin-display, .top-bar .table-settings-btn, .top-bar .change-user-btn'
    )) {
      el.hidden = hidden;
    }
  },

  /** Le joueur change (choix, suppression) : la barre suit (événement de userManager.js) */
  attachPlayerWatcher() {
    if (this._playerWatchBound || typeof document === 'undefined') return;
    document.addEventListener('userChanged', () => this.updatePlayerControls());
    this._playerWatchBound = true;
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
        // Une seule bascule par geste : Entrée déclenche aussi un clic de accessibility.js
        btn.addEventListener(
          'click',
          singleActivation(() => {
            AudioManager.toggleMute();
          })
        );
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
        const toggleVoice = singleActivation(() => {
          try {
            // Le bouton bascule l'état effectif, puis l'enregistre comme choix du joueur
            const next = !readVoiceEnabled();
            Storage.saveVoiceEnabled(next);
            eventBus.emit('voice:preference-changed', { enabled: next });
            this.updateVoiceToggleUI(next);
            if (next) {
              // Ce clic est un geste : il déverrouille le son (iOS) avant la confirmation
              unlockSpeech();
              try {
                _speak(getTranslation('voice_enabled'));
              } catch (error) {
                console.warn('TopBar voice announcement failed', error);
              }
            } else {
              // Voix coupée : la phrase en cours s'arrête aussitôt
              cancelSpeech();
            }
          } catch (error) {
            console.warn('TopBar voice toggle failed', error);
          }
        });
        btn.addEventListener('click', toggleVoice);
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

  /**
   * Ouvrir ou fermer le menu d'une barre (mobile et tablette)
   * @param {Element} topBar - Barre concernée
   * @param {boolean} open - État voulu
   */
  setMenuOpen(topBar, open) {
    const nav = topBar?.querySelector('.top-bar-nav');
    if (!nav) return;
    nav.classList.toggle('is-open', open);
    const burger = topBar.querySelector('.burger-menu-btn');
    if (burger) {
      burger.setAttribute('aria-expanded', String(open));
      setIcon(burger, open ? 'x' : 'menu');
    }
  },

  attachBurgerMenus() {
    for (const btn of document.querySelectorAll('.burger-menu-btn')) {
      if (!btn.dataset.topBarListenerAttached) {
        const toggleMenu = singleActivation(topBar => {
          const nav = topBar?.querySelector('.top-bar-nav');
          if (nav) this.setMenuOpen(topBar, !nav.classList.contains('is-open'));
        });
        btn.addEventListener('click', event => {
          toggleMenu(event.currentTarget?.closest('.top-bar'));
          event.stopPropagation();
        });
        btn.dataset.topBarListenerAttached = 'true';
      }

      // Échap ferme le menu ouvert (et seulement lui : la touche ne remonte pas plus haut)
      const topBar = btn.closest('.top-bar');
      if (topBar && !topBar.dataset.menuKeysAttached) {
        topBar.addEventListener('keydown', event => {
          if (event.key !== 'Escape' || !topBar.querySelector('.top-bar-nav.is-open')) return;
          this.setMenuOpen(topBar, false);
          topBar.querySelector('.burger-menu-btn')?.focus();
          event.stopPropagation();
        });
        topBar.dataset.menuKeysAttached = 'true';
      }
    }
  },

  attachOutsideClickWatcher() {
    if (this._outsideClickBound) return;
    document.addEventListener('click', event => {
      for (const nav of document.querySelectorAll('.top-bar-nav.is-open')) {
        const topBar = nav.closest('.top-bar');
        if (topBar && !topBar.contains(event.target)) {
          this.setMenuOpen(topBar, false);
        }
      }
    });
    this._outsideClickBound = true;
  },

  /**
   * Ferme tous les menus ouverts (changement d'écran, Échap).
   * @returns {Element[]} Les barres dont le menu était ouvert
   */
  closeAllMenus() {
    const closed = [];
    for (const nav of document.querySelectorAll('.top-bar-nav.is-open')) {
      const topBar = nav.closest('.top-bar');
      if (!topBar) continue;
      this.setMenuOpen(topBar, false);
      closed.push(topBar);
    }
    return closed;
  },

  /**
   * Échap ferme le menu ouvert même quand le focus n'est pas dans la barre (appui
   * sur une zone non focalisable, Safari qui ne donne pas le focus au bouton) :
   * sans cela, le raccourci global d'accessibility.js ramènerait au choix du joueur.
   * Les fenêtres (vidéo, réglages des tables) captent Échap avant ce gestionnaire.
   */
  attachMenuEscapeWatcher() {
    if (this._escapeBound || typeof document === 'undefined') return;
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      const focusWasLost = !document.activeElement || document.activeElement === document.body;
      const closed = this.closeAllMenus();
      if (closed.length === 0) return;
      event.preventDefault();
      if (focusWasLost) {
        const visibleBar = closed.find(bar => bar.closest('.slide.active-slide')) || closed[0];
        visibleBar.querySelector('.burger-menu-btn')?.focus();
      }
    });
    this._escapeBound = true;
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
   * @param {boolean} [enabledParam] - État voulu ; lu dans le stockage si absent
   */
  updateVoiceToggleUI(enabledParam) {
    const enabled = typeof enabledParam === 'boolean' ? enabledParam : readVoiceEnabled();
    document.querySelectorAll('.voice-toggle').forEach(btn => {
      applyVoiceState(btn, enabled);
    });
  },

  /**
   * Mettre à jour l'état des boutons de langue
   * @param {string} activeLang - Langue active ('fr', 'en', 'es')
   */
  updateLanguageButtons(activeLang) {
    const lang = activeLang || readLanguage();
    document.querySelectorAll('.lang-btn').forEach(btn => {
      applyLanguageState(btn, lang);
    });
  },

  /**
   * Mettre à jour les contrôles de volume dans toutes les top-bars
   * @param {number} volume - Volume (0-1) ; lu dans l'AudioManager si absent
   * @param {boolean} muted - État muet
   */
  updateVolumeControls(volume, muted) {
    const numericVolume = Number(volume);
    const level = Number.isFinite(numericVolume) ? numericVolume : readVolume();
    const isMuted = typeof muted === 'boolean' ? muted : readMuted();
    const soundOn = level > 0 && !isMuted;

    document.querySelectorAll('.mute-btn').forEach(btn => {
      applyMuteState(btn, soundOn);
    });

    document.querySelectorAll('.volume-slider').forEach(slider => {
      slider.value = level;
    });
  },

  /**
   * Forcer la mise à jour des traductions dans les TopBars
   */
  updateTranslations() {
    // Appliquer les traductions statiques via ESM
    applyStaticTranslations();

    // Libellés qui dépendent d'un état : voix, son, langue active
    try {
      this.updateVoiceToggleUI(_isVoiceEnabled());
    } catch {
      /* ignoré volontairement */
    }
    try {
      this.updateVolumeControls();
    } catch {
      /* ignoré volontairement */
    }
    this.updateLanguageButtons();
  },
};

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

export const TopBar = {
  /**
   * Initialiser le composant TopBar
   */
  init() {
    console.log('🔝 Initialisation du composant TopBar');
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

    // Home button
    const home = document.createElement('button');
    home.id = `home-button-${slideId}`;
    home.className = 'btn home-btn';
    home.title = 'Accueil';
    home.setAttribute('data-translate-title', 'home_button_label');
    home.textContent = '🏠';
    if (!config.showHomeButton) home.style.visibility = 'hidden';
    top.appendChild(home);

    // About button
    if (config.showAboutButton !== false) {
      const about = document.createElement('button');
      about.className = 'btn btn-sm about-btn';
      about.setAttribute('data-slide', '8');
      about.title = "À propos de l'application";
      about.setAttribute('data-translate-title', 'about_button_label');
      about.textContent = 'ℹ️';
      top.appendChild(about);
    }

    // Language selector
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
    top.appendChild(langWrap);

    // Volume controls
    const volWrap = document.createElement('div');
    volWrap.className = 'global-volume-controls';
    const mute = document.createElement('button');
    mute.id = `mute-button-${slideId}`;
    mute.className = 'btn btn-sm mute-btn';
    mute.title = 'Couper le son';
    mute.setAttribute('data-translate-title', 'mute_button_label_on');
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
    top.appendChild(volWrap);

    // Voice toggle
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
    top.appendChild(voiceWrap);

    // Coin display
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

    // Change user
    if (config.showChangeUserButton) {
      const change = document.createElement('button');
      change.className = 'btn change-user-btn';
      change.dataset.slide = '0';
      change.setAttribute('data-translate', 'change_user');
      change.textContent = "Changer d'utilisateur";
      top.appendChild(change);
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
        console.log(`🔄 Top-bar remplacée pour ${slideId}`);
      } else {
        slide.insertBefore(replacement, slide.firstChild);
        console.log(`➕ Top-bar ajoutée pour ${slideId}`);
      }
    });
  },

  /**
   * Configurer les écouteurs d'événements pour la barre supérieure
   */
  setupEventListeners() {
    // Écouteurs pour les boutons Home
    document.querySelectorAll('.home-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        goToSlide(1);
      });
    });

    // Écouteurs pour les boutons de langue
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const lang = e.target.dataset.lang;
        changeLanguage(lang);
      });
    });

    // Écouteurs pour les contrôles de volume
    document.querySelectorAll('.mute-btn').forEach(btn => {
      if (!btn.dataset.topBarListenerAttached) {
        btn.addEventListener('click', () => {
          const current = AudioManager.getVolume();
          AudioManager.setVolume(current > 0 ? 0 : 1);
        });
        btn.dataset.topBarListenerAttached = 'true';
      }
    });

    document.querySelectorAll('.volume-slider').forEach(slider => {
      if (!slider.dataset.topBarListenerAttached) {
        slider.addEventListener('input', e => {
          const newVolume = parseFloat(e.target.value);
          AudioManager.setVolume(newVolume);
        });
        slider.dataset.topBarListenerAttached = 'true';
      }
    });

    // Écouteur pour le toggle voix
    document.querySelectorAll('.voice-toggle').forEach(btn => {
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
              } catch (e) {
                void e;
              }
            }
          } catch (e) {
            void e;
          }
        });
        btn.dataset.topBarListenerAttached = 'true';
      }
    });

    console.log('🎧 Écouteurs TopBar configurés');
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
    console.log('🔄 Mise à jour des traductions TopBar');
    applyStaticTranslations();

    // Mettre à jour le toggle voix avec libellé traduit
    try {
      this.updateVoiceToggleUI(_isVoiceEnabled());
    } catch (e) {
      void e;
    }
  },
};

console.log('🔝 Module TopBar chargé');

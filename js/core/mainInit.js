/**
 * App bootstrap and DOM wiring extracted from main.js
 */
import Storage from '../core/storage.js';
import { AudioManager } from '../core/audio.js';
import { TopBar } from '../components/topBar.js';
import Dashboard from '../components/dashboard.js';
import { Customization } from '../components/customization.js';
import { InfoBar } from '../components/infoBar.js';
import UserManager from '../userManager.js';
import { initThemes, applyHighContrastMode, applyFontSize } from './theme.js';
import { removeAvatarAfterCadenas } from './parental.js';
import { refreshUserList } from './userUi.js';
import {
  changeLanguage,
  getTranslation,
  loadTranslations,
  updateBackgroundByAvatar,
  updateSeoHeroImage,
} from '../utils-es6.js';
import { getAvatarHeadSrc, pickRandomAvatarId } from '../main-helpers.js';
import { VideoManager } from '../VideoManager.js';
import { OperationSelector } from '../components/operationSelector.js';
import { initModeAvailability } from '../components/operationModeAvailability.js';
import { autoMigrate } from './stats-migration.js';

const logInitWarning = (message, error) => {
  console.warn(`[MainInit] ${message}`, error);
};

function setupHighContrastAndFontSize() {
  const highContrastToggle = document.getElementById('high-contrast-toggle');
  if (highContrastToggle) {
    highContrastToggle.checked = localStorage.getItem('highContrastEnabled') === 'true';
    highContrastToggle.addEventListener('change', e => {
      applyHighContrastMode(e.target.checked);
    });
  }
  // applyFontSize (theme.js) tient aussi à jour .active et aria-pressed des boutons « A »
  for (const btn of document.querySelectorAll('.font-size-btn')) {
    btn.addEventListener('click', e => {
      applyFontSize(e.currentTarget.dataset.size);
    });
  }
}

const NATIVELY_ACTIVATED_TAGS = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY']);

function isActivableElement(el) {
  if (!el) return false;
  return (
    el.tagName === 'BUTTON' ||
    el.classList.contains('btn') ||
    el.classList.contains('option') ||
    el.classList.contains('keyboard-key') ||
    el.classList.contains('lab-item') ||
    el.classList.contains('level-card')
  );
}

function handleParentalPopup() {
  const parentalPopup = document.getElementById('parental-lock-popup');
  // La fenêtre est masquée par la classe .hidden et affichée par .visible
  if (
    !parentalPopup ||
    parentalPopup.classList.contains('hidden') ||
    !parentalPopup.classList.contains('visible')
  ) {
    return false;
  }

  if (document.activeElement === document.getElementById('parental-submit')) {
    document.getElementById('parental-submit')?.click();
  }
  return true; // Handled
}

function setupEnterKeyActivation() {
  document.addEventListener('keydown', e => {
    // keyboard-navigation.js active déjà les boutons (et appelle preventDefault) :
    // ne pas déclencher un second clic pour la même touche
    if (e.key !== 'Enter' || e.defaultPrevented) return;

    if (handleParentalPopup()) return;

    const focusedElement = document.activeElement;
    // Boutons, liens et champs s'activent seuls avec Entrée : ne cliquer que les autres
    if (
      focusedElement &&
      !NATIVELY_ACTIVATED_TAGS.has(focusedElement.tagName) &&
      isActivableElement(focusedElement) &&
      !focusedElement.closest('#parental-lock-popup')
    ) {
      e.preventDefault();
      focusedElement.click();
    }
  });
}

/**
 * Choix de l'avatar dans le formulaire « Nouveau joueur » (slide 0).
 * Ce choix ne concerne que le joueur en cours de création : il ne modifie jamais
 * l'avatar du joueur courant (qui reste défini après « Changer de joueur »).
 * L'illustration de fond et la mascotte donnent un aperçu du monde choisi.
 */
function wireCreationAvatarSelector() {
  const creationAvatarSelector = document.querySelector('.creation-avatar-selector');
  if (!creationAvatarSelector) return;
  creationAvatarSelector.addEventListener('click', e => {
    const btn = e.target.closest('.avatar-btn');
    if (!btn || !creationAvatarSelector.contains(btn)) return;
    for (const button of creationAvatarSelector.querySelectorAll('.avatar-btn')) {
      const isSelected = button === btn;
      button.classList.toggle('active', isSelected);
      button.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    }
    const selectedAvatarId = btn.dataset.avatar;
    updateBackgroundByAvatar(selectedAvatarId);
    updateHeroMascot(selectedAvatarId);
  });
}

function setupParentalPopup() {
  const parentalPopup = document.getElementById('parental-lock-popup');
  const parentalSubmitBtn = document.getElementById('parental-submit');
  const parentalCancelBtn = document.getElementById('parental-cancel');
  const parentalAnswerInput = document.getElementById('parental-answer');
  if (!(parentalPopup && parentalSubmitBtn && parentalCancelBtn && parentalAnswerInput)) return;
  parentalCancelBtn.addEventListener('click', () => {
    parentalPopup.classList.remove('visible');
    setTimeout(() => {
      parentalPopup.style.display = 'none';
    }, 300);
  });
  parentalSubmitBtn.addEventListener('click', () => {
    const answer = Number.parseInt(parentalAnswerInput.value, 10);
    const expectedAnswer = Number.parseInt(parentalAnswerInput.dataset.expectedAnswer, 10);
    const errorEl = document.getElementById('parental-error');
    if (answer === expectedAnswer) {
      parentalPopup.classList.remove('visible');
      setTimeout(() => {
        parentalPopup.style.display = 'none';
      }, 300);
      if (parentalPopup.callbackOnSuccess) {
        parentalPopup.callbackOnSuccess();
        parentalPopup.callbackOnSuccess = null;
      }
    } else {
      if (errorEl) errorEl.textContent = getTranslation('parental_incorrect_answer');
      parentalAnswerInput.value = '';
      parentalAnswerInput.focus();
    }
  });
  parentalAnswerInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') parentalSubmitBtn.click();
  });
}

function wirePersonalizationButton() {
  const targets = document.querySelectorAll('[data-translate="personalization"], [data-slide="6"]');
  for (const btn of targets) {
    if (btn._customizationWired) continue;
    btn.addEventListener('click', () => {
      setTimeout(() => {
        try {
          Customization.show();
        } catch (error) {
          logInitWarning('Affichage personnalisation impossible', error);
        }
      }, 0);
    });
    btn._customizationWired = true;
  }
}

/**
 * Au chargement, avant tout choix de joueur : le monde d'un avatar tiré au hasard.
 * Pas de rotation : l'image ne change ensuite qu'avec l'avatar (main-helpers.js).
 */
function scheduleInitialBackground() {
  const showInitialBackground = () => {
    // Un joueur choisi entre-temps a déjà posé son propre monde : ne pas l'écraser
    if (document.body.style.getPropertyValue('--current-bg-image-url')) return;
    updateBackgroundByAvatar(pickRandomAvatarId());
  };

  if ('requestIdleCallback' in globalThis) {
    globalThis.requestIdleCallback(showInitialBackground, { timeout: 2000 });
    return;
  }

  setTimeout(showInitialBackground, 1500);
}

async function prepareLanguage() {
  const lang = typeof Storage.loadLanguage === 'function' ? Storage.loadLanguage() : 'fr';
  if (lang === 'fr') {
    try {
      await loadTranslations('fr');
    } catch (error) {
      logInitWarning('Chargement traductions FR impossible', error);
    }
    return 'fr';
  }

  try {
    await changeLanguage(lang);
    return lang;
  } catch (error) {
    logInitWarning(`Chargement langue ${lang} impossible`, error);
    try {
      await changeLanguage('fr');
    } catch (fallbackError) {
      logInitWarning('Chargement langue FR de secours impossible', fallbackError);
    }
    return 'fr';
  }
}

function safeUpdateSeoHeroImage(resolvedLang) {
  try {
    updateSeoHeroImage(resolvedLang);
  } catch (error) {
    logInitWarning('Mise à jour SEO hero image échouée', error);
  }
}

function refreshAudioControls() {
  try {
    AudioManager.updateVolumeControls();
  } catch (error) {
    logInitWarning('Mise à jour des contrôles audio échouée', error);
  }
}

function initUserSystems() {
  try {
    UserManager.init();
  } catch (error) {
    logInitWarning('Initialisation UserManager impossible', error);
    refreshUserList();
  }
}

function initComponentModules() {
  try {
    TopBar.init();
  } catch (error) {
    logInitWarning('Initialisation TopBar impossible', error);
  }

  try {
    InfoBar.init?.();
  } catch (error) {
    logInitWarning('Initialisation InfoBar impossible', error);
  }

  try {
    Dashboard.init();
  } catch (error) {
    logInitWarning('Initialisation Dashboard impossible', error);
  }

  try {
    Customization.init();
  } catch (error) {
    logInitWarning('Initialisation Customization impossible', error);
  }

  try {
    VideoManager.init();
  } catch (error) {
    console.warn('VideoManager init failed', error);
  }

  try {
    OperationSelector.inject('operation-selector-container');
  } catch (error) {
    logInitWarning('Initialisation OperationSelector impossible', error);
  }

  try {
    initModeAvailability();
  } catch (error) {
    logInitWarning('Initialisation ModeAvailability impossible', error);
  }
}

/**
 * Un nouvel écran commence en haut : sans cela, « Retour à l'accueil » depuis le bas
 * du tableau de bord ouvrait l'accueil au milieu de la page (barre et mascotte
 * hors de l'écran). Le menu de la barre quittée est refermé au passage.
 * slides.js n'émet pas d'événement : on observe la classe active-slide.
 * @param {HTMLElement} slide - Écran qui vient de s'afficher
 */
function onSlideShown(slide) {
  try {
    TopBar.closeAllMenus();
  } catch (error) {
    logInitWarning('Fermeture des menus impossible', error);
  }
  slide.scrollTop = 0;
  if (typeof globalThis.scrollTo === 'function') {
    globalThis.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}

/**
 * Observe la classe des slides et appelle onSlideShown quand l'une devient active
 * (réafficher la slide déjà active ne compte pas). Exportée pour les tests.
 */
export function watchSlideChanges() {
  if (typeof MutationObserver === 'undefined') return;
  const becameActive = record =>
    record.target.classList.contains('active-slide') &&
    !String(record.oldValue || '')
      .split(/\s+/)
      .includes('active-slide');
  const observer = new MutationObserver(records => {
    const shown = records.find(becameActive);
    if (shown) onSlideShown(shown.target);
  });
  for (const slide of document.querySelectorAll('.slide')) {
    observer.observe(slide, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
    });
  }
}

function wireUiHandlers() {
  // Boutons Accueil : branchés par TopBar.attachHomeButtons (une seule fois)
  setupHighContrastAndFontSize();
  setupEnterKeyActivation();
  wireCreationAvatarSelector();
  setupParentalPopup();
  wirePersonalizationButton();
  watchSlideChanges();
}

function safeRemoveAvatarAfterCadenas() {
  try {
    removeAvatarAfterCadenas();
  } catch (error) {
    logInitWarning('Nettoyage avatar cadenas impossible', error);
  }
}

/**
 * Met à jour l'image de la mascotte hero avec l'avatar spécifié ou fox par défaut
 * @param {string} [avatarId] - ID de l'avatar à afficher (optionnel)
 */
function updateHeroMascot(avatarId) {
  try {
    const heroMascotImg = document.getElementById('hero-mascot-img');
    if (!heroMascotImg) return;

    // Visage 128 px (la mascotte est affichée à 72 px au plus) ; image décorative,
    // la bulle porte le message
    heroMascotImg.src = getAvatarHeadSrc(avatarId);
    heroMascotImg.alt = '';
  } catch (error) {
    logInitWarning('Mise à jour mascotte hero impossible', error);
  }
}

async function runInit() {
  scheduleInitialBackground();
  const resolvedLang = await prepareLanguage();
  safeUpdateSeoHeroImage(resolvedLang);
  refreshAudioControls();

  // Migration des anciennes stats vers le nouveau format (sécurisé)
  try {
    autoMigrate();
  } catch (error) {
    logInitWarning('Migration stats échouée (données anciennes préservées)', error);
  }

  initThemes();
  initUserSystems();
  initComponentModules();
  updateHeroMascot();
  wireUiHandlers();
  safeRemoveAvatarAfterCadenas();
}

let initRequested = false;
let initStarted = false;

const startInitOnce = () => {
  if (initStarted) return;
  initStarted = true;
  runInit();
};

export function initOnDomReady() {
  if (initRequested) {
    if (document.readyState !== 'loading') {
      startInitOnce();
    }
    return;
  }

  initRequested = true;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInitOnce, { once: true });
    return;
  }

  if (typeof queueMicrotask === 'function') {
    queueMicrotask(startInitOnce);
  } else {
    setTimeout(startInitOnce, 0);
  }
}

export default { initOnDomReady };

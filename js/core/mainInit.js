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
import { UserState } from '../core/userState.js';
import { gameState } from '../game.js';
import { goToSlide } from '../slides.js';
import { initThemes, applyHighContrastMode, applyFontSize } from './theme.js';
import { removeAvatarAfterCadenas } from './parental.js';
import { refreshUserList } from './userUi.js';
import {
  changeLanguage,
  getTranslation,
  loadTranslations,
  updateBackgroundByAvatar,
  startBackgroundRotation,
  updateSeoHeroImage,
} from '../utils-es6.js';
import { VideoManager } from '../VideoManager.js';
import { OperationSelector } from '../components/operationSelector.js';
import { initModeAvailability } from '../components/operationModeAvailability.js';

const avatarAvailableImages = {
  fox: [1, 2, 3, 10, 11, 12, 13, 14, 15, 16, 17],
  panda: Array.from({ length: 17 }, (_, i) => i + 1),
  unicorn: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  dragon: Array.from({ length: 17 }, (_, i) => i + 1),
  astronaut: Array.from({ length: 17 }, (_, i) => i + 1),
  default: [1],
};

const logInitWarning = (message, error) => {
  console.warn(`[MainInit] ${message}`, error);
};

function attachHomeButtons() {
  for (const btn of document.querySelectorAll('.home-btn')) {
    btn.addEventListener('click', () => {
      goToSlide(1);
    });
  }
}

function setupHighContrastAndFontSize() {
  const highContrastToggle = document.getElementById('high-contrast-toggle');
  if (highContrastToggle) {
    highContrastToggle.checked = localStorage.getItem('highContrastEnabled') === 'true';
    highContrastToggle.addEventListener('change', e => {
      applyHighContrastMode(e.target.checked);
    });
  }
  for (const btn of document.querySelectorAll('.font-size-btn')) {
    btn.addEventListener('click', e => {
      applyFontSize(e.target.dataset.size);
    });
  }
}

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
  if (!parentalPopup || parentalPopup.style.display === 'none') return false;

  if (document.activeElement === document.getElementById('parental-submit')) {
    document.getElementById('parental-submit')?.click();
  }
  return true; // Handled
}

function setupEnterKeyActivation() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;

    if (handleParentalPopup()) return;

    const focusedElement = document.activeElement;
    if (
      focusedElement &&
      isActivableElement(focusedElement) &&
      !focusedElement.closest('#parental-lock-popup')
    ) {
      e.preventDefault();
      focusedElement.click();
    }
  });
}

function wireCreationAvatarSelector() {
  const creationAvatarSelector = document.querySelector('.creation-avatar-selector');
  if (!creationAvatarSelector) return;
  creationAvatarSelector.addEventListener('click', e => {
    const btn = e.target.closest('.avatar-btn');
    if (!btn || !creationAvatarSelector.contains(btn)) return;
    for (const button of creationAvatarSelector.querySelectorAll('.avatar-btn')) {
      button.classList.remove('active');
    }
    btn.classList.add('active');
    const selectedAvatarId = btn.dataset.avatar;
    updateBackgroundByAvatar(selectedAvatarId);
    try {
      const name = UserManager.getCurrentUser?.();
      if (name) {
        const userData = UserState.getCurrentUserData();
        userData.avatar = selectedAvatarId;
        gameState.avatar = selectedAvatarId;
        try {
          UserState.updateUserData(userData);
        } catch (error) {
          logInitWarning('Impossible de persister le changement avatar', error);
        }
      }
    } catch (error) {
      logInitWarning('Sélection avatar création impossible', error);
    }
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

function scheduleBackgroundRotationTask() {
  const startRotation = () => {
    const avatarsWithImages = Object.keys(avatarAvailableImages).filter(
      id => id !== 'default' && avatarAvailableImages[id].length > 0
    );
    const randomAvatarId =
      avatarsWithImages[Math.floor(Math.random() * avatarsWithImages.length)] || 'fox';
    updateBackgroundByAvatar(randomAvatarId);
    startBackgroundRotation(randomAvatarId);
  };

  if ('requestIdleCallback' in globalThis) {
    globalThis.requestIdleCallback(startRotation, { timeout: 2000 });
    return;
  }

  setTimeout(startRotation, 1500);
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

function wireUiHandlers() {
  attachHomeButtons();
  setupHighContrastAndFontSize();
  setupEnterKeyActivation();
  wireCreationAvatarSelector();
  setupParentalPopup();
  wirePersonalizationButton();
}

function safeRemoveAvatarAfterCadenas() {
  try {
    removeAvatarAfterCadenas();
  } catch (error) {
    logInitWarning('Nettoyage avatar cadenas impossible', error);
  }
}

async function runInit() {
  scheduleBackgroundRotationTask();
  const resolvedLang = await prepareLanguage();
  safeUpdateSeoHeroImage(resolvedLang);
  refreshAudioControls();
  initThemes();
  initUserSystems();
  initComponentModules();
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

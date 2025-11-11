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
  getTranslation as translate,
} from '../utils-es6.js';
import { updateBackgroundByAvatar, startBackgroundRotation, updateSeoHeroImage } from '../utils-es6.js';
import { VideoManager } from '../VideoManager.js';

const avatarAvailableImages = {
  fox: [1, 2, 3, 10, 11, 12, 13, 14, 15, 16, 17],
  panda: Array.from({ length: 17 }, (_, i) => i + 1),
  unicorn: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  dragon: Array.from({ length: 17 }, (_, i) => i + 1),
  astronaut: Array.from({ length: 17 }, (_, i) => i + 1),
  default: [1],
};

function attachHomeButtons() {
  document.querySelectorAll('.home-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      goToSlide(1);
    });
  });
}

function setupHighContrastAndFontSize() {
  const highContrastToggle = document.getElementById('high-contrast-toggle');
  if (highContrastToggle) {
    highContrastToggle.checked = localStorage.getItem('highContrastEnabled') === 'true';
    highContrastToggle.addEventListener('change', e => {
      applyHighContrastMode(e.target.checked);
    });
  }
  document.querySelectorAll('.font-size-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      applyFontSize(e.target.dataset.size);
    });
  });
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
    creationAvatarSelector
      .querySelectorAll('.avatar-btn')
      .forEach(b => b.classList.remove('active'));
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
        } catch (e2) {
          void e2;
        }
      }
    } catch (e) {
      void e;
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
    const answer = parseInt(parentalAnswerInput.value);
    const expectedAnswer = parseInt(parentalAnswerInput.dataset.expectedAnswer);
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
  document.querySelectorAll('[data-translate="personalization"], [data-slide="6"]').forEach(btn => {
    if (btn._customizationWired) return;
    btn.addEventListener('click', () => {
      setTimeout(() => {
        try {
          Customization.show();
        } catch (e) {
          void e;
        }
      }, 0);
    });
    btn._customizationWired = true;
  });
}

async function runInit() {
  // Reporter la rotation des fonds pour ne pas bloquer le LCP
  const scheduleBackgroundRotation = () => {
    const avatarsWithImages = Object.keys(avatarAvailableImages).filter(
      id => id !== 'default' && avatarAvailableImages[id].length > 0
    );
    const randomAvatarId =
      avatarsWithImages[Math.floor(Math.random() * avatarsWithImages.length)] || 'fox';
    updateBackgroundByAvatar(randomAvatarId);
    startBackgroundRotation(randomAvatarId);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(scheduleBackgroundRotation, { timeout: 2000 });
  } else {
    setTimeout(scheduleBackgroundRotation, 1500);
  }

  // Language load and apply
  const lang = typeof Storage.loadLanguage === 'function' ? Storage.loadLanguage() : 'fr';
  let resolvedLang = lang;
  if (lang === 'fr') {
    try {
      await loadTranslations('fr');
    } catch (e) {
      void e;
    }
  } else {
    try {
      await changeLanguage(lang);
    } catch (e) {
      void e;
      resolvedLang = 'fr';
      try {
        await changeLanguage('fr');
      } catch (e2) {
        void e2;
      }
    }
  }

  try {
    updateSeoHeroImage(resolvedLang);
  } catch (e) {
    void e;
  }

  // Audio controls refresh after translations
  try {
    AudioManager.updateVolumeControls();
  } catch (e) {
    void e;
  }

  // Themes / accessibility
  initThemes();

  // User manager
  try {
    UserManager.init();
  } catch (e) {
    void e;
    refreshUserList();
  }

  // Components
  try {
    TopBar.init();
  } catch (e) {
    void e;
  }
  try {
    InfoBar.init?.();
  } catch (e) {
    void e;
  }
  try {
    Dashboard.init();
  } catch (e) {
    void e;
  }
  try {
    Customization.init();
  } catch (e) {
    void e;
  }
  try {
    VideoManager.init();
  } catch (e) {
    console.warn('VideoManager init failed', e);
  }

  attachHomeButtons();

  setupHighContrastAndFontSize();

  setupEnterKeyActivation();

  // Creation avatar selector
  wireCreationAvatarSelector();

  // Parental popup handlers
  setupParentalPopup();

  // Personalization button handler (robust selectors)
  wirePersonalizationButton();

  // Avatar ::after cleanup after DOM
  try {
    removeAvatarAfterCadenas();
  } catch (e) {
    void e;
  }
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

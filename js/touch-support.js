/**
 * Support gestes tactiles - Phase 8.3
 * Améliore l'expérience tactile sur mobile et tablette
 */

// Swipes supprimés - navigation uniquement par boutons

import { accessibilityManager } from './accessibility.js';

/** Écran d'un jeu d'Arcade : plateau, « Abandonner », voile de pause et bandeau */
const ARCADE_GAME_SCREEN = '.arcade-game-ui, .arcade-mult-display';

/**
 * Pincer agrandit la page (WCAG 1.4.4), sauf sur l'écran d'un jeu d'Arcade : deux doigts
 * posés en jouant ne doivent pas la zoomer par accident
 * @param {TouchEvent} event - Mouvement à deux doigts ou plus
 */
function blockGamePinch(event) {
  if (event.target instanceof Element && event.target.closest(ARCADE_GAME_SCREEN)) {
    event.preventDefault();
  }
}

export class TouchSupportManager {
  constructor() {
    this.touchStartX = undefined;
    this.touchStartY = undefined;
    this.init();
  }

  init() {
    // Initialiser support tactile général
    this.initTouchEvents();

    // Améliorer navigation mobile
    this.initMobileNavigation();

    // Les jeux d'arcade gèrent eux-mêmes leurs gestes (js/arcade-touch.js)
  }

  initTouchEvents() {
    // Désactiver tous les swipes et gestes de navigation globaux
    document.addEventListener(
      'touchstart',
      e => {
        // Prévenir le swipe de navigation du navigateur
        if (e.touches.length === 1) {
          const target = e.target;
          // Permettre le scroll sur certains éléments spécifiques ET ne pas interférer avec les canvas de jeu
          if (
            !target.closest(
              'input, textarea, .scrollable, .selectable-text, canvas, .arcade-canvas'
            )
          ) {
            // Marquer le début du touch pour vérification ultérieure
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
          }
        }
      },
      { passive: false }
    );

    document.addEventListener(
      'touchmove',
      e => {
        // Deux doigts : pincer agrandit la page, sauf sur l'écran d'un jeu (blockGamePinch)
        if (e.touches.length > 1) {
          blockGamePinch(e);
          return;
        }

        // Empêcher le swipe horizontal pour éviter la navigation du navigateur
        if (e.touches.length === 1 && this.touchStartX !== undefined) {
          const deltaX = Math.abs(e.touches[0].clientX - this.touchStartX);
          const deltaY = Math.abs(e.touches[0].clientY - this.touchStartY);

          // Si c'est un mouvement principalement horizontal et qu'on n'est pas dans une zone scrollable
          if (deltaX > deltaY && deltaX > 10) {
            const target = e.target;
            if (
              !target.closest(
                'input, textarea, .scrollable, .selectable-text, canvas, .arcade-canvas'
              )
            ) {
              e.preventDefault();
            }
          }
        }
      },
      { passive: false }
    );

    document.addEventListener(
      'touchend',
      () => {
        // Réinitialiser les valeurs de touch
        this.touchStartX = undefined;
        this.touchStartY = undefined;
      },
      { passive: false }
    );

    // Support tap = click pour améliorer réactivité
    document.addEventListener('touchstart', e => {
      if (e.target.matches('button, .btn, .clickable')) {
        e.target.classList.add('touch-active');
      }
    });

    document.addEventListener('touchend', e => {
      if (e.target.matches('button, .btn, .clickable')) {
        e.target.classList.remove('touch-active');
      }
    });
  }

  initMobileNavigation() {
    // Support burger menu
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);

        // Toggle classe pour animation
        mobileToggle.classList.toggle('active');

        // Annoncer changement aux lecteurs d'écran (ESM)
        try {
          accessibilityManager?.announce(isExpanded ? 'Menu fermé' : 'Menu ouvert');
        } catch {
          /* ignoré volontairement */
        }
      });
    }

    // Swipes désactivés : navigation uniquement par boutons pour éviter les gestes accidentels
  }

  // Optimiser performance tactile
  optimizeTouchPerformance() {
    // Désactiver sélection texte lors de touch
    document.body.style.setProperty('-webkit-user-select', 'none');
    document.body.style.webkitTouchCallout = 'none';

    // Désactiver délai 300ms sur mobile
    document.body.style.touchAction = 'manipulation';
  }
}

// Initialisation globale
const touchSupportManager = new TouchSupportManager();
export { touchSupportManager };

/**
 * Support gestes tactiles - Phase 8.3
 * Améliore l'expérience tactile sur mobile et tablette
 */

// Swipes supprimés - navigation uniquement par boutons

import { accessibilityManager } from './accessibility.js';

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

    // Support gestes pour jeux arcade
    this.initArcadeTouchSupport();

    console.log('👆 TouchSupportManager initialisé');
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
        // Empêcher zoom pinch dans jeux
        if (e.touches.length > 1) {
          e.preventDefault();
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
        } catch (e) {
          void e;
        }
      });
    }

    // Swipes désactivés : navigation uniquement par boutons pour éviter les gestes accidentels
  }

  initArcadeTouchSupport() {
    // Support tactile pour jeux arcade
    document.addEventListener('DOMContentLoaded', () => {
      const arcadeCanvas = document.querySelector('.arcade-canvas');
      if (!arcadeCanvas) return;

      // Variables pour tracking touch
      let touchStart = { x: 0, y: 0 };
      let touchEnd = { x: 0, y: 0 };

      arcadeCanvas.addEventListener('touchstart', e => {
        e.preventDefault();
        const touch = e.touches[0];
        touchStart = { x: touch.clientX, y: touch.clientY };
      });

      arcadeCanvas.addEventListener('touchmove', e => {
        e.preventDefault();
        const touch = e.touches[0];
        touchEnd = { x: touch.clientX, y: touch.clientY };

        // Calculer direction en temps réel
        const deltaX = touchEnd.x - touchStart.x;
        const deltaY = touchEnd.y - touchStart.y;

        // Simuler touches directionnelles
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Mouvement horizontal
          if (deltaX > 10) {
            this.simulateKeyPress('ArrowRight');
          } else if (deltaX < -10) {
            this.simulateKeyPress('ArrowLeft');
          }
        } else {
          // Mouvement vertical
          if (deltaY > 10) {
            this.simulateKeyPress('ArrowDown');
          } else if (deltaY < -10) {
            this.simulateKeyPress('ArrowUp');
          }
        }
      });

      arcadeCanvas.addEventListener('touchend', e => {
        e.preventDefault();

        // Tap = tir/action
        const deltaX = Math.abs(touchEnd.x - touchStart.x);
        const deltaY = Math.abs(touchEnd.y - touchStart.y);

        if (deltaX < 10 && deltaY < 10) {
          // Tap simple = action/tir
          this.simulateKeyPress(' '); // Espace
        }
      });
    });
  }

  simulateKeyPress(key) {
    // Simuler événement clavier pour jeux arcade
    if (typeof KeyboardEvent === 'undefined') return;
    const event = new KeyboardEvent('keydown', {
      key: key,
      code: key === ' ' ? 'Space' : key,
      bubbles: true,
    });
    document.dispatchEvent(event);

    // Relâcher après 100ms
    setTimeout(() => {
      if (typeof KeyboardEvent === 'undefined') return;
      const eventUp = new KeyboardEvent('keyup', {
        key: key,
        code: key === ' ' ? 'Space' : key,
        bubbles: true,
      });
      document.dispatchEvent(eventUp);
    }, 100);
  }

  // Optimiser performance tactile
  optimizeTouchPerformance() {
    // Désactiver sélection texte lors de touch
    document.body.style.webkitUserSelect = 'none';
    document.body.style.webkitTouchCallout = 'none';

    // Désactiver délai 300ms sur mobile
    document.body.style.touchAction = 'manipulation';
  }
}

// Initialisation globale
const touchSupportManager = new TouchSupportManager();
export { touchSupportManager };

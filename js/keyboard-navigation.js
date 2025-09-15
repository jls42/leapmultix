// Module navigation clavier pour améliorer l'accessibilité
// Ajoute le support clavier pour tous les éléments interactifs

class KeyboardNavigation {
  constructor() {
    this.isKeyboardMode = false;
    this.focusableElements = [];
    this.currentFocusIndex = -1;
    this.abortController =
      typeof AbortController !== 'undefined'
        ? new AbortController()
        : { abort() {}, signal: undefined };
    this.init();
  }

  init() {
    const { signal } = this.abortController;

    // Détecter utilisation clavier
    document.addEventListener(
      'keydown',
      e => {
        if (
          e.key === 'Tab' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight' ||
          e.key === 'Enter' ||
          e.key === ' '
        ) {
          this.enableKeyboardMode();
        }
      },
      { signal }
    );

    // Désactiver mode clavier sur clic souris
    document.addEventListener(
      'mousedown',
      () => {
        this.disableKeyboardMode();
      },
      { signal }
    );

    // Gestionnaires globaux
    document.addEventListener('keydown', this.handleGlobalKeydown.bind(this), { signal });

    // Observer changements DOM pour réindexer éléments focusables
    const observer = new MutationObserver(() => {
      this.updateFocusableElements();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden', 'disabled'],
    });

    // Initialiser la liste des éléments focusables
    this.updateFocusableElements();
  }

  enableKeyboardMode() {
    this.isKeyboardMode = true;
    document.body.classList.add('keyboard-navigation');
  }

  disableKeyboardMode() {
    this.isKeyboardMode = false;
    document.body.classList.remove('keyboard-navigation');
  }

  updateFocusableElements() {
    const selectors = [
      'button:not([disabled]):not([hidden])',
      'input:not([disabled]):not([hidden])',
      'select:not([disabled]):not([hidden])',
      'textarea:not([disabled]):not([hidden])',
      'a[href]:not([hidden])',
      '[tabindex]:not([tabindex="-1"]):not([hidden])',
      '.avatar-btn:not(.locked):not([hidden])',
      '.background-btn:not([hidden])',
      '.color-theme-btn:not([hidden])',
      '.card-base--clickable:not([hidden])',
      '.difficulty-btn:not([hidden])',
      'canvas[tabindex]:not([hidden])',
    ];

    this.focusableElements = Array.from(document.querySelectorAll(selectors.join(','))).filter(
      el => {
        // Vérifier si l'élément est vraiment visible
        const style = window.getComputedStyle(el);
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0' &&
          this.isElementVisible(el)
        );
      }
    );
  }

  isElementVisible(element) {
    // Vérifier si l'élément est dans la slide active
    const activeSlide = document.querySelector('.slide.active-slide');
    if (activeSlide && !activeSlide.contains(element)) {
      // Sauf si c'est dans la top-bar qui est globale
      const topBar = document.querySelector('.top-bar');
      return topBar && topBar.contains(element);
    }
    return true;
  }

  handleGlobalKeydown(event) {
    if (!this.isKeyboardMode) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        this.handleActivation(event);
        break;
      case 'ArrowUp':
        this.navigateVertical(-1, event);
        break;
      case 'ArrowDown':
        this.navigateVertical(1, event);
        break;
      case 'ArrowLeft':
        this.navigateHorizontal(-1, event);
        break;
      case 'ArrowRight':
        this.navigateHorizontal(1, event);
        break;
      case 'Home':
        this.focusFirst(event);
        break;
      case 'End':
        this.focusLast(event);
        break;
    }
  }

  handleActivation(event) {
    const activeElement = document.activeElement;

    if (activeElement.tagName === 'BUTTON' || activeElement.tagName === 'A') {
      // Simuler un clic
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activeElement.click();
      }
    } else if (
      activeElement.classList.contains('avatar-btn') ||
      activeElement.classList.contains('background-btn') ||
      activeElement.classList.contains('color-theme-btn')
    ) {
      event.preventDefault();
      activeElement.click();
    } else if (activeElement.classList.contains('card-base--clickable')) {
      event.preventDefault();
      activeElement.click();
    }
  }

  navigateVertical(direction, event) {
    this.updateFocusableElements();
    const currentIndex = this.focusableElements.indexOf(document.activeElement);

    if (currentIndex === -1) return;

    // Pour navigation verticale, trouver élément dans colonne similaire

    const currentRect = this.focusableElements[currentIndex].getBoundingClientRect();
    let bestMatch = null;
    let bestDistance = Infinity;

    for (let i = 0; i < this.focusableElements.length; i++) {
      if (i === currentIndex) continue;

      const rect = this.focusableElements[i].getBoundingClientRect();
      const verticalDistance =
        direction > 0 ? rect.top - currentRect.bottom : currentRect.top - rect.bottom;

      if (verticalDistance > 0) {
        const horizontalDistance = Math.abs(rect.left - currentRect.left);
        const totalDistance = verticalDistance + horizontalDistance * 0.3;

        if (totalDistance < bestDistance) {
          bestDistance = totalDistance;
          bestMatch = i;
        }
      }
    }

    if (bestMatch !== null) {
      event.preventDefault();

      this.focusableElements[bestMatch].focus();
    }
  }

  navigateHorizontal(direction, event) {
    this.updateFocusableElements();
    const currentIndex = this.focusableElements.indexOf(document.activeElement);

    if (currentIndex === -1) return;

    // Pour navigation horizontale, trouver élément dans ligne similaire

    const currentRect = this.focusableElements[currentIndex].getBoundingClientRect();
    let bestMatch = null;
    let bestDistance = Infinity;

    for (let i = 0; i < this.focusableElements.length; i++) {
      if (i === currentIndex) continue;

      const rect = this.focusableElements[i].getBoundingClientRect();
      const horizontalDistance =
        direction > 0 ? rect.left - currentRect.right : currentRect.left - rect.right;

      if (horizontalDistance > 0) {
        const verticalDistance = Math.abs(rect.top - currentRect.top);
        const totalDistance = horizontalDistance + verticalDistance * 0.3;

        if (totalDistance < bestDistance) {
          bestDistance = totalDistance;
          bestMatch = i;
        }
      }
    }

    if (bestMatch !== null) {
      event.preventDefault();

      this.focusableElements[bestMatch].focus();
    }
  }

  focusFirst(event) {
    event.preventDefault();
    this.updateFocusableElements();
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  focusLast(event) {
    event.preventDefault();
    this.updateFocusableElements();
    if (this.focusableElements.length > 0) {
      this.focusableElements[this.focusableElements.length - 1].focus();
    }
  }

  // Méthode pour ajouter le support clavier à un élément spécifique
  makeKeyboardAccessible(element, onActivate) {
    if (!element) return;

    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');

    element.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (onActivate) {
          onActivate(event);
        } else {
          element.click();
        }
      }
    });
  }

  // Ajout support ARIA live pour les changements dynamiques
  announceToScreenReader(message, priority = 'polite') {
    let liveRegion = document.getElementById('aria-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.classList.add('sr-only');
      document.body.appendChild(liveRegion);
    }

    // Clear and set message
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }

  // Méthode de cleanup pour éviter les fuites mémoire
  dispose() {
    if (this.abortController && typeof this.abortController.abort === 'function') {
      this.abortController.abort();
    }
    this.abortController =
      typeof AbortController !== 'undefined'
        ? new AbortController()
        : { abort() {}, signal: undefined };
  }
}

// Initialiser la navigation clavier
const keyboardNav = new KeyboardNavigation();

// Export pour utilisation dans d'autres modules
if (typeof window !== 'undefined') {
  window.keyboardNav = keyboardNav;
}

export { KeyboardNavigation, keyboardNav };

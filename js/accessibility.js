/**
 * Module d'accessibilité centralisé
 * Fournit des fonctions pour améliorer l'accessibilité de LeapMultix
 */

export class AccessibilityManager {
  constructor() {
    this.announcementRegion = null;
    this.alertRegion = null;
    this.keyboardNavigationEnabled = false;
    this.init();
  }

  init() {
    // Initialiser les zones d'annonces
    this.announcementRegion = document.getElementById('aria-announcements');
    this.alertRegion = document.getElementById('aria-alerts');

    // Activer la navigation clavier
    this.enableKeyboardNavigation();

    // Ajouter les raccourcis clavier
    this.setupKeyboardShortcuts();

    console.log('♿ AccessibilityManager initialisé');
  }

  // Annoncer un message aux lecteurs d'écran
  announce(message, priority = 'polite') {
    const region = priority === 'assertive' ? this.alertRegion : this.announcementRegion;

    if (region) {
      region.textContent = message;

      // Nettoyer après un délai
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }

  // Annoncer une alerte importante
  alert(message) {
    this.announce(message, 'assertive');
  }

  // Activer la navigation clavier
  enableKeyboardNavigation() {
    document.addEventListener('keydown', e => {
      // Échap pour fermer/retour
      if (e.key === 'Escape') {
        import('./slides.js').then(m => m.goToSlide(0));
        this.announce('Retour au menu principal');
      }

      // Entrée pour activer un élément en focus
      if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
        e.target.click();
      }

      // Flèches pour navigation dans les listes
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleArrowNavigation(e);
      }
    });

    this.keyboardNavigationEnabled = true;
    console.log('⌨️ Navigation clavier activée');
  }

  // Gestion navigation par flèches
  handleArrowNavigation(e) {
    const focusedElement = document.activeElement;
    const parent = focusedElement.closest('.game-grid, .avatar-selection, .button-group');

    if (parent) {
      const buttons = Array.from(parent.querySelectorAll('button:not([disabled])'));
      const currentIndex = buttons.indexOf(focusedElement);

      if (currentIndex !== -1) {
        let newIndex = currentIndex;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          newIndex = (currentIndex + 1) % buttons.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          newIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        }

        if (newIndex !== currentIndex) {
          buttons[newIndex].focus();
          e.preventDefault();
        }
      }
    }
  }

  // Configurer les raccourcis clavier
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      // Ctrl/Cmd + H pour aide
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        this.showHelp();
      }

      // Ctrl/Cmd + M pour volume/mute
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        import('./core/audio.js').then(({ AudioManager }) => {
          try {
            AudioManager.toggleMute();
          } catch (e) {
            void e;
          }
          this.announce('Son activé/désactivé');
        });
      }
    });
  }

  // Afficher l'aide accessibilité
  showHelp() {
    const helpMessage = `Raccourcis clavier LeapMultix:
- Échap: Retour au menu
- Tab/Shift+Tab: Navigation
- Entrée: Activer bouton
- Flèches: Navigation dans les groupes
- Ctrl+M: Activer/désactiver le son
- Ctrl+H: Cette aide`;

    this.alert(helpMessage);
    console.log('💡 Aide accessibilité affichée');
  }

  // Améliorer le focus sur un élément
  enhanceFocus(element, announcement = '') {
    if (element) {
      element.focus();

      if (announcement) {
        this.announce(announcement);
      }

      // Ajouter une classe temporaire pour styling
      element.classList.add('focused-by-script');
      setTimeout(() => {
        element.classList.remove('focused-by-script');
      }, 500);
    }
  }

  // Annoncer le score ou résultat
  announceScore(score, total = null) {
    const message = total ? `Score: ${score} sur ${total}` : `Score: ${score}`;

    this.announce(message);
  }

  // Annoncer le changement de mode de jeu
  announceGameMode(modeName) {
    this.announce(`Mode de jeu: ${modeName} sélectionné`);
  }

  // Annoncer erreur ou validation
  announceValidation(isCorrect, answer = '') {
    const message = isCorrect ? `Correct! ${answer}` : `Incorrect. Essayez encore.`;

    this.announce(message);
  }
}

// Initialisation module-scoped
const accessibilityManager = new AccessibilityManager();
export { accessibilityManager };

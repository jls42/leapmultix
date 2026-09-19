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
      // Touche déjà traitée ailleurs (fenêtre, navigation clavier) : ne rien refaire
      if (e.defaultPrevented) return;

      // Échap pour fermer/retour, sauf si une fenêtre ouverte le gère elle-même
      if (e.key === 'Escape' && !this.isDialogOpen()) {
        import('./slides.js').then(m => m.goToSlide(0));
        this.announce('Retour au menu principal');
      }

      // Entrée : un <button> natif s'active déjà seul (et keyboard-navigation.js
      // gère le mode clavier) ; un clic de plus ici provoquait une double activation.

      // Flèches pour navigation dans les listes
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleArrowNavigation(e);
      }
    });

    this.keyboardNavigationEnabled = true;
  }

  // Une fenêtre (vidéo, vérification parentale, réglages des tables) ou le menu de la
  // barre du haut est-il visible ? Échap les ferme d'abord (topBar.js pour le menu).
  // Certaines restent dans le DOM une fois fermées : seule la visibilité réelle compte.
  isDialogOpen() {
    const candidates = document.querySelectorAll(
      'dialog[open], [role="dialog"], .popup-overlay.visible, .top-bar-nav.is-open'
    );
    return Array.from(candidates).some(el =>
      typeof el.checkVisibility === 'function'
        ? el.checkVisibility({
            checkOpacity: true,
            checkVisibilityCSS: true,
            opacityProperty: true,
            visibilityProperty: true,
          })
        : el.getClientRects().length > 0
    );
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

/* ======================
   Module de gestion des slides (navigation, affichage, animation)
   ====================== */
import { gameState } from './game.js';
import { getStartingMode } from './mode-orchestrator.js';
// VERSION_PARAM is intentionally not used in dynamic imports to keep arguments literal
// and avoid security tool false-positives on import(). Cache-busting is handled elsewhere.
// import { VERSION_PARAM } from './cache-updater.js';
import Dashboard from './components/dashboard.js';
import { TopBar } from './components/topBar.js';

// Arrêt non bloquant des modes actifs sans créer de dépendances fortes.
function stopActiveModes() {
  const mode = gameState?.gameMode;
  // Ne pas arrêter un mode qui est en cours de démarrage (protection contre auto-stop)
  try {
    const starting = getStartingMode?.();
    if (starting && starting === mode) return; // skip
  } catch (e) {
    void e;
  }
  const STOPPERS = new Map([
    ['arcade', () => import('./modes/ArcadeMode.js').then(m => m.stopArcadeMode?.())],
    ['invasion', () => import('./arcade.js').then(m => m.stopArcadeMode?.())],
    ['multimiam', () => import('./arcade.js').then(m => m.stopArcadeMode?.())],
    ['multimemory', () => import('./arcade.js').then(m => m.stopArcadeMode?.())],
    ['multisnake', () => import('./arcade.js').then(m => m.stopArcadeMode?.())],
    ['quiz', () => import('./modes/QuizMode.js').then(m => m.stopQuizMode?.())],
    ['challenge', () => import('./modes/ChallengeMode.js').then(m => m.stopChallengeMode?.())],
    ['adventure', () => import('./modes/AdventureMode.js').then(m => m.stopAdventureMode?.())],
    ['discovery', () => import('./modes/DiscoveryMode.js').then(m => m.stopDiscoveryMode?.())],
  ]);

  const stopper = typeof mode === 'string' ? STOPPERS.get(mode) : undefined;
  if (typeof stopper === 'function') {
    try {
      stopper();
    } catch {
      /* no-op */
    }
  }
}

/**
 * Affiche la slide correspondant à l'identifiant ou au numéro donné.
 * @param {number|string} n - Numéro ou id de la slide (ex: 1 ou 'slide1')
 */
function goToSlide(n) {
  // Arrêt non bloquant des modes actifs avant le changement de slide
  try {
    stopActiveModes();
  } catch {
    /* no-op */
  }
  const slideId = typeof n === 'number' ? 'slide' + n : n;
  showSlide(slideId);

  // S'assurer que le message dev apparaît sur slide0
  if (slideId === 'slide0') {
    setTimeout(() => {
      try {
        TopBar.ensureDevNoteVisible();
      } catch (e) {
        void e;
      }
    }, 50);
  }
}

function nextSlide() {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const active = document.querySelector('.slide.active-slide');
  if (!slides.length) return;
  const index = Math.max(0, slides.indexOf(active));
  const nextIndex = Math.min(index + 1, slides.length - 1);
  const nextId = slides[nextIndex]?.id || 'slide1';
  goToSlide(nextId);
}

function prevSlide() {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const active = document.querySelector('.slide.active-slide');
  if (!slides.length) return;
  const index = Math.max(0, slides.indexOf(active));
  const prevIndex = Math.max(index - 1, 0);
  const prevId = slides[prevIndex]?.id || 'slide1';
  goToSlide(prevId);
}

/**
 * Affiche une slide et masque toutes les autres.
 * @param {string} slideId - L'id de la slide à afficher (ex: 'slide1')
 */
function showSlide(slideId) {
  const slides = document.querySelectorAll('.slide');
  slides.forEach(slide => {
    if (slide.id === slideId) {
      slide.classList.add('active-slide');
      slide.classList.add('slide-slide-in');
      setTimeout(() => {
        slide.classList.remove('slide-slide-in');
      }, 400);
      // Si on affiche des vues spécifiques, déclencher leurs hooks ESM
      if (slideId === 'slide7') {
        try {
          if (Dashboard && typeof Dashboard.show === 'function') {
            Dashboard.show();
          } else {
            import('./components/dashboard.js')
              .then(m => m.Dashboard?.show?.())
              .catch(err => console.error('Dashboard dynamic load failed', err));
          }
        } catch (e) {
          console.error('Dashboard.show failed', e);
        }
      } else if (slideId === 'slide6') {
        // Personnalisation: préparer l'écran (injection UI, etc.)
        import('./components/customization.js')
          .then(m => m.Customization?.show?.())
          .catch(e => {
            void e;
          });
      }
    } else {
      slide.classList.remove('active-slide', 'slide-slide-in', 'slide-slide-out');
    }
  });
}

/**
 * Masque toutes les slides.
 */
function hideAllSlides() {
  document.querySelectorAll('.slide').forEach(slide => {
    slide.classList.remove('active-slide', 'slide-slide-in', 'slide-slide-out');
  });
}

/**
 * Ajoute un listener à une slide spécifique.
 * @param {string} slideId - L'id de la slide
 * @param {string} event - Le type d'événement (ex: 'click')
 * @param {function} handler - La fonction à exécuter
 */
// Exportation ESM
export { goToSlide, showSlide, hideAllSlides, nextSlide, prevSlide };

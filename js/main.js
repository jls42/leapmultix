/* =========================================
   GESTION MULTI-UTILISATEURS (LOCALSTORAGE)
   ========================================= */
// Passage en module ES : importer les helpers nécessaires
// All functionality has been moved to specialized modules - see comments below for module locations
import { initOnDomReady } from './core/mainInit.js';
// Variables d'utilisateur maintenant gérées par UserManager
// Voir js/userManager.js pour la logique complète

// Variables principales pour le gestionnaire de scores et utilisateurs
// NOTE: Ces variables sont maintenant gérées par UserManager
// let players = {}; // Supprimé - géré par UserManager
// let currentUser = null; // Supprimé - géré par UserManager

// NOTE: Variables input supprimées car gérées par UserManager
// const newUserNameInput = document.getElementById('new-user-name');
// const createUserBtn = document.getElementById('create-user-btn');

// Avatar configuration moved to core/mainInit.js where it's actually used

// Fonction pour mettre à jour l'arrière-plan en fonction de l'avatar (utilise classes CSS)
// Background helpers migrés vers ES6 (main-helpers.js via utils-es6)
// Ne pas redéfinir ici pour éviter les collisions globales.

// Les références audio sont maintenant dans main.js

// Initialisation de players via storage.js
// 🔧 FIX: Supprimé - maintenant géré par UserManager pour éviter les conflits
// let players = loadPlayers(); // loadPlayers() de storage.js

// « Qui joue ? » : tuiles des profils (visage de l'avatar + prénom) rendues par
// UserManager.refreshUserList (js/userManager.js) ; repli dans core/userUi.js

// Supprimer un utilisateur
// deleteUser moved to core/userUi.js

// Sélection d'un utilisateur
// selectUser moved to core/userUi.js

// Fonction pour initialiser les thèmes et charger le thème préféré
/**
 * Initialiser le composant
 * @returns {*} Description du retour
 */
// initThemes moved to core/theme.js

// Fonction supprimée - Maintenant gérée par TopBar.setupEventListeners()
// Les contrôles de volume sont centralisés dans le composant TopBar

// Fonction pour mettre à jour le volume (état, UI, sauvegarde)
/**
 * Mettre à jour
 * @param {*} newVolume - Description du paramètre
 * @returns {*} Description du retour
 */
// updateVolume moved to core/theme.js

// Initialize app wiring on DOM ready
initOnDomReady();

// Fonction pour créer un clavier virtuel (maintenant gérée par UserManager)
// Cette fonction est conservée pour compatibilité avec customization.js
/**
 * Créer un nouvel élément
 * @param {*} inputElement - Description du paramètre
 * @param {*} container - Description du paramètre
 * @returns {*} Description du retour
 */
// createVirtualKeyboard exposé ailleurs si présent; pas de wrapper ici

// Fonction pour mettre à jour le message d'accueil dynamique
/**
 * Mettre à jour
 * @returns {*} Description du retour
 */
// updateWelcomeMessageUI géré par main-helpers (utils-es6); pas de wrapper ici

// Afficher les scores
// Ancienne fonction showScores supprimée (non utilisée / dépendait de players legacy)

/* =========================================
   SYSTÈME DE NAVIGATION (SLIDES)
   ========================================= */
// Nouvelle navigation centralisée :
// - goToSlide(n) pour naviguer
// - showSlide(slideId) pour afficher une slide précise
// - hideAllSlides() pour tout masquer
// Les callbacks métier (parental lock, refreshUserList, etc.) restent inchangés

// Adapter les appels dans le code :
// Exemple :
// goToSlide(n);
// showSlide('slide4');
// hideAllSlides();

/* ======================
   GESTION DES MODES DE JEU
   ====================== */
// Sélection du mode de jeu
/**
 * Définir une valeur
 * @param {*} mode - Description du paramètre
 * @returns {*} Description du retour
 */
// legacySetGameMode moved to core/navigation.js

// Fonction de retour au menu des modes
/**
 * Fonction backToModeSelection
 * @returns {*} Description du retour
 */
// backToModeSelection moved to core/navigation.js

/* ======================
   PERSONNALISATION (ESM via Customization)
   ====================== */

// Afficher un message temporaire
/**
 * Fonction showMessage
 * @param {*} message - Description du paramètre
 * @returns {*} Description du retour
 */
// showMessage importé via utils-es6.js

/* ======================
   TABLEAU DE BORD (ESM via Dashboard)
   ====================== */

// Afficher l'écran de fin de jeu
/**
 * Fonction showEndGameSlide
 * @returns {*} Description du retour
 */
// showEndGameSlide removed (now handled by specific modules)

/* ======================
   RÉCUPÉRER / SAUVER LES DONNÉES UTILISATEUR
   ====================== */
/**
 * Récupérer une valeur
 * @returns {*} Description du retour
 */
// Removed local wrapper getCurrentUserData (use UserState or helpers)

/**
 * Sauvegarder les données
 * @returns {*} Description du retour
 */
// Local wrapper removed; use helpers.saveCurrentUserData directly when needed

// Tâche 4.1: Fonction pour appliquer/retirer le mode contraste élevé
/**
 * Fonction applyHighContrastMode
 * @param {*} enabled - Description du paramètre
 * @returns {*} Description du retour
 */
// applyHighContrastMode moved to core/theme.js

// Tâche 4.1: Fonction pour appliquer la taille de police
/**
 * Fonction applyFontSize
 * @param {*} size - Description du paramètre
 * @returns {*} Description du retour
 */
// applyFontSize moved to core/theme.js

// Tâche 5.1: Fonction pour afficher et gérer la popup de code parental
/**
 * Fonction showParentalLockPopup
 * @param {*} callbackOnSuccess - Description du paramètre
 * @returns {*} Description du retour
 */
// showParentalLockPopup moved to core/parental.js

// Tâche 2.1: Mise à jour de l'affichage des pièces via ESM (utils-es6.updateCoinDisplay)

// La logique de validation et de fermeture est dans l'écouteur DOMContentLoaded

// Génération dynamique des boutons d'avatar dans la personnalisation
/**
 * Génère dynamiquement les boutons d'avatar dans le conteneur cible.
 * @param {string|Element} [target] - Sélecteur CSS ou élément DOM du conteneur. Par défaut, le premier .avatar-selector visible.
 */
// renderAvatarSelector géré par main-helpers (utils-es6); pas de wrapper ici

// body-level personalization handler removed (replaced by data-attribute wiring in bootstrap)

/**
 * Supprimer un élément
 * @returns {*} Description du retour
 */
// removeAvatarAfterCadenas moved to core/parental.js

// avatar ::after fix applied in mainInit

// Fond illustré : un monde fixe par avatar, sans rotation (main-helpers.updateBackgroundByAvatar).
// startBackgroundRotation n'est plus qu'un alias déprécié de updateBackgroundByAvatar.

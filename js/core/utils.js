/**
 * Module utilitaires centralisé
 * Centralise toutes les fonctions utilitaires génériques
 * Phase 2.2 - Consolidation des utilitaires
 */

/**
 * Utilitaires centralisés
 */
export const Utils = {
  // === MANIPULATION DE TABLEAUX ===

  /**
   * Mélange un tableau (algorithme Fisher-Yates)
   * @param {Array} array - Tableau à mélanger
   * @returns {Array} Le tableau mélangé (modifié en place)
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  /**
   * Obtient un élément aléatoire d'un tableau
   * @param {Array} array - Tableau source
   * @returns {*} Élément aléatoire
   */
  getRandomElement(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  },

  /**
   * Obtient N éléments aléatoires uniques d'un tableau
   * @param {Array} array - Tableau source
   * @param {number} count - Nombre d'éléments à obtenir
   * @returns {Array} Tableau d'éléments aléatoires
   */
  getRandomElements(array, count) {
    if (!array || array.length === 0) return [];
    const shuffled = [...array];
    Utils.shuffleArray(shuffled);
    return shuffled.slice(0, Math.min(count, array.length));
  },

  // === VALIDATION ET FORMATAGE ===

  /**
   * Valide un nombre et le normalise dans une plage
   * @param {*} value - Valeur à valider
   * @param {number} min - Minimum
   * @param {number} max - Maximum
   * @param {number} defaultValue - Valeur par défaut
   * @returns {number} Nombre validé
   */
  validateNumber(value, min = 0, max = Infinity, defaultValue = 0) {
    // Traiter null et undefined comme des valeurs invalides
    if (value === null || value === undefined) return defaultValue;

    const num = Number(value);
    if (isNaN(num)) return defaultValue;
    return Math.max(min, Math.min(max, num));
  },

  /**
   * Formate un nombre avec des étoiles HTML
   * @param {number} count - Nombre d'étoiles
   * @param {boolean} colored - Si true, utilise des étoiles colorées
   * @returns {string} HTML des étoiles
   */
  getStarsHTML(count, colored = false) {
    const filledStar = colored ? '⭐' : '★';
    const emptyStar = '☆';
    let html = '';
    for (let i = 1; i <= 3; i++) {
      html += i <= count ? filledStar : emptyStar;
    }
    return html;
  },

  /**
   * Convertit un nombre en mots (pour l'accessibilité)
   * @param {number} num - Nombre à convertir
   * @returns {string} Nombre en mots
   */
  numberToWords(num) {
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const teens = [
      'dix',
      'onze',
      'douze',
      'treize',
      'quatorze',
      'quinze',
      'seize',
      'dix-sept',
      'dix-huit',
      'dix-neuf',
    ];
    const tens = [
      '',
      '',
      'vingt',
      'trente',
      'quarante',
      'cinquante',
      'soixante',
      'soixante-dix',
      'quatre-vingts',
      'quatre-vingt-dix',
    ];

    if (num === 0) return 'zéro';

    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const unit = num % 10;

      return tens[ten] + (unit ? '-' + units[unit] : '');
    }
    return num.toString(); // Au-delà de 99, retourner le chiffre
  },

  // === GÉNÉRATION DE QCM ===

  /**
   * Génère des options pour un QCM
   * @param {*} correctAnswer - Réponse correcte
   * @param {Function} wrongGenerator - Fonction générant des réponses incorrectes
   * @param {number} count - Nombre total d'options
   * @param {number} maxAttempts - Tentatives max pour générer des options uniques
   * @returns {Array} Options mélangées
   */
  generateMCQOptions(correctAnswer, wrongGenerator, count = 4, maxAttempts = 50) {
    const options = [correctAnswer];
    let attempts = 0;

    while (options.length < count && attempts < maxAttempts) {
      const wrong = wrongGenerator();
      if (wrong !== correctAnswer && !options.includes(wrong)) {
        options.push(wrong);
      }
      attempts++;
    }

    return Utils.shuffleArray(options);
  },

  // === NAVIGATION CLAVIER ===

  /**
   * Ajoute la navigation par flèches à un conteneur
   * @param {HTMLElement|string} container - Conteneur ou sélecteur
   * @param {string} itemSelector - Sélecteur des éléments navigables
   * @param {Object} options - Options de navigation
   */
  addArrowKeyNavigation(container, itemSelector, options = {}) {
    const containerEl =
      typeof container === 'string' ? document.querySelector(container) : container;
    if (!containerEl) return;

    const defaults = {
      loop: true, // Revenir au début/fin
      autoFocus: true, // Focus automatique au premier élément
      onClick: null, // Callback sur clic/Enter
    };
    const opts = { ...defaults, ...options };

    let currentIndex = 0;

    function updateFocus() {
      const items = containerEl.querySelectorAll(itemSelector);
      if (items.length === 0) return;

      // Retirer focus précédent
      items.forEach(item => item.classList.remove('focused'));

      // Ajouter focus actuel
      if (currentIndex >= 0 && currentIndex < items.length) {
        items[currentIndex].classList.add('focused');

        items[currentIndex].focus();
      }
    }

    function handleKeydown(e) {
      const items = containerEl.querySelectorAll(itemSelector);
      if (items.length === 0) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          currentIndex--;
          if (currentIndex < 0) {
            currentIndex = opts.loop ? items.length - 1 : 0;
          }
          updateFocus();
          break;

        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          currentIndex++;
          if (currentIndex >= items.length) {
            currentIndex = opts.loop ? 0 : items.length - 1;
          }
          updateFocus();
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (items[currentIndex]) {
            if (opts.onClick) {
              opts.onClick(items[currentIndex], currentIndex);
            } else {
              items[currentIndex].click();
            }
          }
          break;
      }
    }

    // Attacher l'écouteur
    containerEl.addEventListener('keydown', handleKeydown);

    // Focus initial si demandé
    if (opts.autoFocus) {
      setTimeout(updateFocus, 0);
    }

    // Retourner une fonction de nettoyage
    return () => {
      containerEl.removeEventListener('keydown', handleKeydown);
    };
  },

  // === GÉNÉRATION HTML ===

  // Note: createInfoBarHTML maintenant centralisé dans js/components/infoBar.js

  // === UTILITAIRES DIVERS ===

  /**
   * Crée un délai (version Promise de setTimeout)
   * @param {number} ms - Millisecondes d'attente
   * @returns {Promise} Promise qui résout après le délai
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Débounce une fonction
   * @param {Function} func - Fonction à débouncer
   * @param {number} wait - Temps d'attente en ms
   * @returns {Function} Fonction débouncée
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Clamp une valeur entre min et max
   * @param {number} value - Valeur à clamper
   * @param {number} min - Minimum
   * @param {number} max - Maximum
   * @returns {number} Valeur clampée
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },
};

export default Utils;

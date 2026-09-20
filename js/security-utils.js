// Utilitaires de sécurité pour prévenir les attaques XSS
// Fonctions d'échappement et de validation des entrées utilisateur
import { getTranslation } from './utils-es6.js';

/**
 * Échappe les caractères HTML dangereux pour prévenir les attaques XSS
 * @param {string} text - Texte à échapper
 * @returns {string} Texte échappé sécurisé
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') {
    return String(text);
  }

  // Manual HTML escaping without innerHTML
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Crée un élément DOM de façon sécurisée avec textContent
 * @param {string} tagName - Nom de la balise
 * @param {string} textContent - Contenu textuel sécurisé
 * @param {Object} attributes - Attributs à ajouter
 * @returns {HTMLElement} Élément créé
 */
export function createSafeElement(tagName, textContent = '', attributes = {}) {
  const element = document.createElement(tagName);

  if (textContent) {
    element.textContent = textContent;
  }

  // Ajouter attributs de façon sécurisée
  for (const [key, value] of Object.entries(attributes)) {
    // Valider les noms d'attributs pour éviter l'injection
    if (/^[a-zA-Z-]+$/.test(key)) {
      element.setAttribute(key, String(value));
    }
  }

  return element;
}

/**
 * Remplace innerHTML par une approche sécurisée pour les messages simples
 * @param {HTMLElement} element - Élément cible
 * @param {string} message - Message à afficher
 * @param {string} className - Classe CSS optionnelle
 */
export function setSafeMessage(element, message, className = '') {
  if (!element) return;

  element.textContent = '';

  const messageDiv = createSafeElement('div', message, {
    class: className,
  });

  element.appendChild(messageDiv);
}

/**
 * Crée un message de feedback sécurisé (succès/erreur)
 * @param {HTMLElement} element - Élément cible
 * @param {string} message - Message à afficher
 * @param {string} type - Type: 'success' ou 'error'
 */
export function setSafeFeedback(element, message, type = 'info') {
  if (!element) return;

  const className = `feedback-${type}`;
  setSafeMessage(element, message, className);
}

/**
 * Valide et nettoie les noms d'utilisateur
 * @param {string} username - Nom d'utilisateur à valider
 * @returns {string} Nom nettoyé
 */
export function sanitizeUsername(username) {
  if (typeof username !== 'string') return '';

  // Autoriser seulement lettres, chiffres, espaces et quelques caractères
  return username
    .replace(/[^a-zA-Z0-9À-ÿ\s._-]/g, '')
    .trim()
    .slice(0, 50);
}

/**
 * Vérifie si une chaîne contient des balises HTML dangereuses
 * @param {string} input - Chaîne à vérifier
 * @returns {boolean} true si potentiellement dangereux
 */
export function containsHtml(input) {
  if (typeof input !== 'string') return false;

  // Recherche de balise en lecture simple plutôt que /<[^>]*>/ : sur une chaîne sans
  // « > », ce motif repart en arrière à chaque « < » et le coût devient quadratique.
  const ouvrante = input.indexOf('<');
  const contientBalise = ouvrante !== -1 && input.includes('>', ouvrante + 1);
  const scriptRegex = /<script|javascript:|on\w+=/i;

  return contientBalise || scriptRegex.test(input);
}

/**
 * Crée un élément image sécurisé avec validation du chemin
 * @param {string} src - Source de l'image
 * @param {string} alt - Texte alternatif
 * @param {Object} attributes - Attributs supplémentaires
 * @returns {HTMLImageElement} Élément image sécurisé
 */
export function createSafeImage(src, alt = '', attributes = {}) {
  // Valider que le src est dans les assets autorisés
  const allowedPaths = /^(assets\/images\/|\/assets\/images\/)/;

  if (!allowedPaths.test(src)) {
    console.warn('Image source non autorisée:', src);
    src = 'assets/images/arcade/fox_head_avatar_128x128.png'; // Image par défaut
  }

  const safeAttributes = {
    ...attributes,
    src: escapeHtml(src),
    alt: escapeHtml(alt),
  };

  const widthValue = safeAttributes.width ?? attributes.width;
  const heightValue = safeAttributes.height ?? attributes.height;

  const img = createSafeElement('img', '', safeAttributes);

  const widthNumber = Number.parseFloat(widthValue);
  const heightNumber = Number.parseFloat(heightValue);
  if (
    Number.isFinite(widthNumber) &&
    Number.isFinite(heightNumber) &&
    widthNumber > 0 &&
    heightNumber > 0
  ) {
    img.style.aspectRatio = `${widthNumber} / ${heightNumber}`;
  }

  return img;
}

/**
 * Remplace innerHTML pour les éléments avec images et texte
 * @param {HTMLElement} element - Élément cible
 * @param {Object} config - Configuration {text, imageSrc, imageAlt, className}
 */
export function setSafeContentWithImage(element, config) {
  if (!element) return;

  element.textContent = '';

  if (config.imageSrc) {
    const img = createSafeImage(config.imageSrc, config.imageAlt || '', {
      width: config.width || '100',
      height: config.height || '100',
      class: config.imageClass || 'img-responsive',
    });
    element.appendChild(img);
  }

  if (config.text) {
    const textSpan = createSafeElement('span', config.text, {
      class: config.textClass || 'avatar-label',
    });
    element.appendChild(textSpan);
  }

  if (config.className) {
    element.className = config.className;
  }
}

/**
 * Convertit une chaîne HTML en DocumentFragment sans utiliser innerHTML.
 * Note: Pour du contenu interne seulement. Ne pas utiliser pour des entrées utilisateur.
 * @param {string} htmlString
 * @returns {DocumentFragment}
 */
function parseHtmlToDocument(html) {
  const Parser = globalThis && globalThis.DOMParser ? globalThis.DOMParser : undefined;
  if (typeof Parser !== 'function') return null;
  try {
    const parser = new Parser();
    // Justification (Codacy/ESLint): le sanitizeur doit parser du HTML interne
    // pour pouvoir l'assainir. Aucune entrée utilisateur ici.

    return parser.parseFromString(html, 'text/html');
  } catch {
    return null;
  }
}

const ATTR_LINKS = new Set(['href', 'src', 'xlink:href']);

function hasBlockedProtocol(value) {
  return /^\s*(javascript:|data:|vbscript:)/i.test(value || '');
}

function hasUnsafeStyle(value) {
  return /url\s*\(.*javascript:/i.test(value || '');
}

function shouldRemoveAttribute(name, value) {
  const n = (name || '').toLowerCase();
  if (n.startsWith('on')) return true;
  if (ATTR_LINKS.has(n)) return hasBlockedProtocol(value);
  if (n === 'style') return hasUnsafeStyle(value);
  return false;
}

function scrubDangerousContent(doc) {
  // Retirer éléments potentiellement dangereux
  doc.querySelectorAll('script, iframe, object, embed').forEach(n => n.remove());
  // Nettoyer attributs dangereux
  const root = doc.body || doc;
  root.querySelectorAll('*').forEach(el => {
    for (const attr of Array.from(el.attributes)) {
      if (shouldRemoveAttribute(attr.name, attr.value)) {
        el.removeAttribute(attr.name);
      }
    }
  });
}

export function sanitizeHtmlToFragment(htmlString) {
  const html = typeof htmlString === 'string' ? htmlString : '';
  // Justification (Codacy/ESLint): appel du pipeline d'assainissement
  // pour convertir la chaîne interne en Document.

  const doc = parseHtmlToDocument(html);
  if (!doc) {
    const frag = document.createDocumentFragment();
    // Justification (Codacy/ESLint): fallback en texte brut (aucun HTML injecté)

    frag.appendChild(document.createTextNode(html));
    return frag;
  }
  scrubDangerousContent(doc);
  const frag = document.createDocumentFragment();
  const body = doc.body || doc;
  while (body.firstChild) frag.appendChild(body.firstChild);
  return frag;
}

// Alias conservé pour compatibilité et pour satisfaire les linters qui whitelistent security-utils.*
export function toSafeFragment(htmlString) {
  // Justification (Codacy/ESLint): alias direct vers le sanitizeur canonique
  // pour faciliter le whitelisting des appels internes.

  return sanitizeHtmlToFragment(htmlString);
}

/**
 * Ajoute au parent le HTML fourni après sanitization
 * @param {HTMLElement} parent
 * @param {string} htmlString
 */
export function appendSanitizedHTML(parent, htmlString) {
  if (!parent) return;
  // Justification (Codacy/ESLint): point d'entrée central — on assainit avant d'ajouter.

  const frag = sanitizeHtmlToFragment(htmlString);
  parent.appendChild(frag);
}

/**
 * Ligne de comptage : « Compter par 6 : 6 → 12 → … → 42 », la dernière valeur en évidence.
 * Les flèches sont décoratives (masquées aux lecteurs d'écran).
 * @param {{label: string, steps: number[]}} countBy
 * @returns {HTMLElement}
 */
function createCountLine({ label, steps }) {
  const line = createSafeElement('p', '', { class: 'feedback-count' });
  if (label) {
    line.appendChild(createSafeElement('span', label, { class: 'feedback-count-label' }));
  }
  const sequence = createSafeElement('span', '', { class: 'feedback-count-steps' });
  steps.forEach((value, index) => {
    if (index > 0) {
      sequence.appendChild(
        createSafeElement('span', '→', { class: 'feedback-count-arrow', 'aria-hidden': 'true' })
      );
    }
    const isLast = index === steps.length - 1;
    sequence.appendChild(
      createSafeElement(isLast ? 'strong' : 'span', String(value), { class: 'feedback-count-step' })
    );
  });
  line.appendChild(sequence);
  return line;
}

/**
 * Ligne de calcul : « Pour vérifier : 9 × 4 = 36 », le calcul en police de titre.
 * @param {{label: string, equation: string}} fact
 * @returns {HTMLElement}
 */
function createFactLine({ label, equation }) {
  const line = createSafeElement('p', '', { class: 'feedback-fact' });
  if (label) {
    line.appendChild(createSafeElement('span', label, { class: 'feedback-count-label' }));
  }
  line.appendChild(createSafeElement('span', equation, { class: 'feedback-fact-equation' }));
  return line;
}

/**
 * Astuce : l'intitulé (« Indice ») sur sa propre ligne, sans ponctuation à traduire
 * @param {string} hintText
 * @returns {HTMLElement}
 */
function createHintLine(hintText) {
  const hintDiv = createSafeElement('p', '', { class: 'quiz-hint-inline' });
  hintDiv.appendChild(createSafeElement('strong', getTranslation('hint')));
  hintDiv.appendChild(createSafeElement('span', hintText));
  return hintDiv;
}

/**
 * Lignes qui suivent la bonne réponse : calculs, comptage, astuce, texte libre
 * @returns {HTMLElement[]}
 */
function createExplanationLines({ facts, countBy, hintText, additionalContent }) {
  const lines = (Array.isArray(facts) ? facts : [])
    .filter(fact => fact?.equation)
    .map(createFactLine);

  if (Array.isArray(countBy?.steps) && countBy.steps.length > 0) {
    lines.push(createCountLine(countBy));
  }
  if (hintText) lines.push(createHintLine(hintText));
  // Contenu additionnel sous forme de texte seulement pour sécurité
  if (additionalContent) {
    lines.push(createSafeElement('p', additionalContent, { class: 'feedback-extra' }));
  }
  return lines;
}

/**
 * Explication calme après une erreur : une erreur est une étape, pas une sanction.
 * Un mot d'accueil (« Presque ! »), la bonne réponse, puis, si fournis, les calculs
 * utiles (vrai résultat, vérification), le comptage qui mène au résultat et une astuce.
 * Tout est construit en texte (aucun HTML injecté).
 * @param {HTMLElement} element - Élément cible
 * @param {string} message - Message principal (« La bonne réponse est 42. »)
 * @param {string} hintText - Texte d'astuce (optionnel)
 * @param {string} additionalContent - Contenu additionnel en texte (optionnel)
 * @param {Object} [options]
 * @param {string} [options.lead] - Mot d'accueil affiché avant le message
 * @param {Array<{label: string, equation: string}>} [options.facts] - Calculs affichés
 * @param {{label: string, steps: number[]}} [options.countBy] - Comptage menant au résultat
 */
export function setSafeComplexFeedback(
  element,
  message,
  hintText = '',
  additionalContent = '',
  options = {}
) {
  if (!element) return;

  element.textContent = '';
  const { lead = '', countBy = null, facts = [] } = options || {};

  // Panneau d'explication : encre normale, fond en creux, sans rouge ni secousse
  const panel = createSafeElement('div', '', { class: 'feedback-error feedback-explain' });

  if (lead) {
    panel.appendChild(createSafeElement('p', lead, { class: 'feedback-lead' }));
  }

  panel.appendChild(createSafeElement('p', message, { class: 'feedback-answer' }));

  for (const line of createExplanationLines({ facts, countBy, hintText, additionalContent })) {
    panel.appendChild(line);
  }

  element.appendChild(panel);
}

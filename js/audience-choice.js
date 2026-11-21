/**
 * Bouton « Ne plus compter mes visites » de la politique de confidentialité (index.html,
 * #slide10) : le droit de s'opposer à la mesure d'audience, exercé d'un appui, sans écrire à
 * personne. Le refus est retenu sur l'appareil (js/core/audience-refusal.js) ; un second appui
 * l'efface et la mesure reprend. Le bouton et la phrase d'état portent la clé de traduction
 * de leur état : un changement de langue les réécrit sans rien d'autre (i18n.js).
 */
import { getTranslation } from './i18n.js';
import { isReady } from './i18n-store.js';
import { eventBus } from './core/eventBus.js';
import { isAudienceRefused, setAudienceRefused } from './core/audience-refusal.js';

const BLOCK = '[data-audience-choice]';

/** Clés du bouton et de la phrase d'état, selon que le visiteur est compté ou non */
const TEXTS = new Map([
  [false, { button: 'audience_choice_refuse', status: 'audience_status_counted' }],
  [true, { button: 'audience_choice_resume', status: 'audience_status_refused' }],
]);
const UNAVAILABLE = 'audience_status_unavailable';

/**
 * Écrit un texte traduit et garde sa clé sur l'élément
 * @param {HTMLElement|null} element
 * @param {string} key
 */
function write(element, key) {
  if (!element) return;
  element.dataset.translate = key;
  // Traductions pas encore arrivées (ouverture de la page) : la clé suffit, i18n.js écrira le
  // texte en les appliquant
  if (!isReady()) return;
  const text = getTranslation(key);
  if (!text.startsWith('[')) element.textContent = text;
}

/**
 * Met le bouton et la phrase d'état d'un bloc à l'état retenu sur l'appareil
 * @param {HTMLElement} block
 * @param {string} [statusKey] - Phrase d'état à écrire à la place de celle de l'état
 */
function render(block, statusKey) {
  const texts = TEXTS.get(isAudienceRefused());
  // Le bouton nomme l'action à venir ; la phrase d'état (<output>) annonce le résultat
  write(block.querySelector('[data-audience-toggle]'), texts.button);
  write(block.querySelector('[data-audience-status]'), statusKey ?? texts.status);
  // Le résumé est traduit, dans une page juridique rédigée en français
  const summary = block.closest('[data-audience-summary]');
  if (summary) summary.lang = document.documentElement.lang || 'fr';
}

/** La mesure reprend tout de suite, sans attendre la prochaine visite */
async function resumeAudience() {
  try {
    const { ensureAudience } = await import('./plausible-init.js');
    ensureAudience();
  } catch (error) {
    // Module absent (appli Android, copie hors ligne) : la mesure reprendra à la prochaine visite
    console.warn('[Audience] Reprise de la mesure impossible', error);
  }
}

/**
 * Un appui : le choix s'inverse, est retenu, et le bloc dit le nouvel état
 * @param {HTMLElement} block
 */
function toggle(block) {
  const refuse = !isAudienceRefused();
  if (!setAudienceRefused(refuse)) {
    render(block, UNAVAILABLE);
    return;
  }
  render(block);
  if (!refuse) void resumeAudience();
}

/**
 * Branche les boutons de refus de la page
 * @param {ParentNode} [root]
 */
export function mountAudienceChoice(root = document) {
  const blocks = [...root.querySelectorAll(BLOCK)];
  for (const block of blocks) {
    if (block.dataset.audienceWired) continue;
    block.dataset.audienceWired = 'true';
    block.querySelector('[data-audience-toggle]')?.addEventListener('click', () => toggle(block));
    render(block);
  }
  if (blocks.length > 0) {
    eventBus.on('languageChanged', () => blocks.forEach(block => render(block)));
  }
}

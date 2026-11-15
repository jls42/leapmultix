/**
 * Le calcul du bandeau des jeux d'Arcade, écrit par tous les jeux au même endroit : la
 * question (« 7 × 5 = ? ») avec son « ? » dans une case, puis le calcul complet
 * (« 7 × 5 = 35 ») avec sa réponse dans la même case. Le texte de l'élément reste celui
 * reçu, au caractère près : les lecteurs d'écran l'annoncent une fois, tel quel.
 */

/** Case de la réponse, à la fin du calcul */
const ANSWER_CLASS = 'arcade-answer-box';
/** Signes larges du calcul : ses chiffres, tous de même largeur, et le « ? » */
const WIDE_GLYPHS = /[\d?]/g;

/**
 * Coupe un calcul après son « = » : « 7 × 5 = » et « ? » (ou « 35 »)
 * @param {string} text
 * @returns {[string, string]|null} null : pas de réponse à mettre en case
 */
function splitAtAnswer(text) {
  const equals = text.lastIndexOf('=');
  if (equals === -1) return null;
  // Le signe « = » et l'espace qui le suit restent avec le début du calcul
  const answer = text.slice(equals + 2);
  return answer.trim() === '' ? null : [text.slice(0, equals + 2), answer];
}

/**
 * Écrit le calcul dans le bandeau
 * @param {string} text - « 7 × 5 = ? », « 7 × 5 = 35 », ou vide
 * @param {Element|null} [element] - Le calcul du bandeau (.arcade-question)
 */
export function writeArcadeQuestion(text, element = document.querySelector('.arcade-question')) {
  if (!element) return;
  const value = String(text ?? '');
  const parts = splitAtAnswer(value);
  if (parts) {
    const [head, answer] = parts;
    const box = document.createElement('span');
    box.className = ANSWER_CLASS;
    box.textContent = answer;
    element.replaceChildren(head, box);
  } else {
    element.textContent = value;
  }
  // Chiffres et « ? » du calcul : la taille du texte se règle sur leur nombre pour tenir
  // dans la case (css/arcade.css)
  element.style.setProperty('--question-glyphs', String(value.match(WIDE_GLYPHS)?.length ?? 0));
}

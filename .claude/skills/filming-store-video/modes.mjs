// Les modes à questions (Quiz, Défi, Aventure) : lire la question affichée, trouver sa réponse,
// toucher une option.
import { resultOf, tapAt } from './base.mjs';

function shownQuestion(page) {
  return page.evaluate(() => {
    const tidy = el => el.textContent.replace(/\s+/g, ' ').trim();
    const question = document.querySelector('.slide.active-slide .question');
    const options = [...document.querySelectorAll('.slide.active-slide .option')]
      .filter(el => el.offsetParent !== null)
      .map(tidy);
    return { text: question ? tidy(question) : '', options };
  });
}

/** Réponse d'une question lue à l'écran : un calcul, un nombre manquant ou un vrai ou faux. */
function solve({ text, options }) {
  if (/^\d+ [×+−\-÷] \d+ = \?$/.test(text)) {
    return { answer: String(resultOf(text)), kind: 'calcul' };
  }
  const gap = /^(\d+) × \? = (\d+)$/.exec(text);
  if (gap) return { answer: String(Number(gap[2]) / Number(gap[1])), kind: 'trou' };
  const claim = /^(\d+ [×+−\-÷] \d+) = (\d+)$/.exec(text);
  if (claim && options.length === 2) {
    const right = resultOf(claim[1]) === Number(claim[2]);
    return { answer: right ? options[0] : options[1], kind: 'vrai-faux' };
  }
  return { answer: null, kind: 'autre' };
}

/** Le mot du jeu pour un nombre (« quarante ») : son module, à l'adresse que la page a chargée */
function inWords(page, number) {
  return page.evaluate(async n => {
    const loaded = performance
      .getEntriesByType('resource')
      .map(entry => entry.name)
      .find(name => name.includes('/js/utils-es6.js'));
    const { numberToWords } = await import(loaded ?? '/js/utils-es6.js');
    return String(numberToWords(n)).toLowerCase();
  }, number);
}

/**
 * Question d'un mode à choix : son texte, ses options, la bonne réponse quand le calcul se lit
 * (sinon null) et son genre (`calcul`, `trou`, `vrai-faux`, `autre`, avec `-lettres` quand
 * les réponses sont écrites en toutes lettres).
 */
export async function readQuestion(page) {
  const shown = await shownQuestion(page);
  const solved = solve(shown);
  const digits = solved.answer !== null && solved.kind !== 'vrai-faux';
  if (!digits || shown.options.includes(solved.answer)) return { ...shown, ...solved };
  const words = await inWords(page, Number(solved.answer));
  return {
    ...shown,
    answer: shown.options.find(option => option.toLowerCase() === words) ?? null,
    kind: `${solved.kind}-lettres`,
  };
}

/** Touche l'option qui porte ce texte (ou, à défaut, la première libre) ; rend son texte. */
export async function tapOption(page, text) {
  const point = await page.evaluate(wanted => {
    const tidy = el => el.textContent.replace(/\s+/g, ' ').trim();
    const options = [
      ...document.querySelectorAll('.slide.active-slide .option:not(:disabled)'),
    ].filter(el => el.offsetParent !== null);
    const el = options.find(option => tidy(option) === wanted) ?? options[0];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, text: tidy(el) };
  }, text);
  if (!point) return null;
  await tapAt(page, point.x, point.y);
  return point.text;
}

/** L'explication d'une erreur est-elle affichée ? */
export function explained(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('.slide.active-slide .feedback-explain')].some(
      el => el.offsetParent !== null
    )
  );
}

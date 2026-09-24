// message-format.js - Messages traduits : paramètres et accord au pluriel.
//
// Deux formes, reprises du format ICU (MessageFormat) :
// - {nom} : remplacé par la valeur du paramètre ;
// - {n, plural, one {# boîte} other {# boîtes}} : branche choisie selon les règles de
//   pluriel de la langue (Intl.PluralRules), # y vaut le nombre. Sélecteurs acceptés :
//   =0, =1… (valeur exacte, prioritaire), puis zero, one, two, few, many et other.
// Pas d'échappement par apostrophe comme en ICU : le français en est plein, et les
// accolades ne servent qu'à ces deux formes. Un gabarit mal formé ressort tel quel.
// Module pur, sans DOM ni stockage : les scripts Node du corpus vocal l'importent aussi.

const NAME = String.raw`[A-Za-z_][\w.]*`;
const SIMPLE_ARGUMENT = new RegExp(String.raw`^\s*(${NAME})\s*$`);
const PLURAL_ARGUMENT = new RegExp(String.raw`^\s*(${NAME})\s*,\s*plural\s*,`);
const PLURAL_CASE = /^\s*(=\d+|zero|one|two|few|many|other)\s*\{/;

const pluralRulesByLang = new Map();

/**
 * Catégorie de pluriel d'un nombre dans une langue (« one », « other »…).
 * Sans Intl.PluralRules, repli sur les règles des trois langues livrées :
 * en français, 0 et 1 sont au singulier ; en anglais et en espagnol, 1 seulement.
 * @param {number} count
 * @param {string} [lang='fr']
 * @returns {string}
 */
export function pluralCategory(count, lang = 'fr') {
  const n = Number(count);
  const code = String(lang || 'fr');
  try {
    let rules = pluralRulesByLang.get(code);
    if (!rules) {
      rules = new Intl.PluralRules(code);
      pluralRulesByLang.set(code, rules);
    }
    return rules.select(n);
  } catch {
    const singular = code.toLowerCase().startsWith('fr') ? n === 0 || n === 1 : n === 1;
    return singular ? 'one' : 'other';
  }
}

/**
 * Position de l'accolade fermante qui répond à celle de `open`, ou -1.
 * @param {string} text
 * @param {number} open
 * @returns {number}
 */
function matchingBrace(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Branches d'un pluriel : « one {…} other {…} » → Map(sélecteur → texte).
 * @param {string} text
 * @returns {Map<string, string>|null} null si la liste est mal formée
 */
function parsePluralCases(text) {
  const cases = new Map();
  let rest = text;
  while (rest.trim()) {
    const match = PLURAL_CASE.exec(rest);
    if (!match) return null;
    const open = match[0].length - 1;
    const close = matchingBrace(rest, open);
    if (close < 0) return null;
    cases.set(match[1], rest.slice(open + 1, close));
    rest = rest.slice(close + 1);
  }
  return cases.size > 0 ? cases : null;
}

/**
 * Remplit une branche de pluriel : # y vaut le nombre, hors des blocs imbriqués (qui
 * ont leur propre #). Les morceaux sont remplis séparément, puis joints par le nombre :
 * la valeur insérée n'est jamais relue comme un gabarit.
 * @param {string} branch
 * @param {string} countText
 * @param {Object} params
 * @param {string} lang
 * @returns {string}
 */
function formatBranch(branch, countText, params, lang) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < branch.length; i++) {
    const ch = branch[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    else if (ch === '#' && depth === 0) {
      parts.push(branch.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(branch.slice(start));
  return parts.map(part => formatMessage(part, params, lang)).join(countText);
}

/**
 * Valeur d'un bloc {…} : paramètre simple ou pluriel ; inconnu → bloc inchangé.
 * @param {string} block - Bloc complet, accolades comprises
 * @param {Object} params
 * @param {string} lang
 * @returns {string}
 */
function formatArgument(block, params, lang) {
  const inner = block.slice(1, -1);
  const simple = SIMPLE_ARGUMENT.exec(inner);
  if (simple) {
    return Object.hasOwn(params, simple[1]) ? String(params[simple[1]]) : block;
  }
  const plural = PLURAL_ARGUMENT.exec(inner);
  if (!plural || !Object.hasOwn(params, plural[1])) return block;
  const cases = parsePluralCases(inner.slice(plural[0].length));
  if (!cases) return block;
  const value = params[plural[1]];
  const count = Number(value);
  const chosen =
    cases.get(`=${count}`) ?? cases.get(pluralCategory(count, lang)) ?? cases.get('other');
  if (chosen === undefined) return block;
  return formatBranch(chosen, String(value), params, lang);
}

/**
 * Remplit un message traduit : {nom} et {n, plural, …}, dans la langue donnée.
 * Un paramètre absent laisse son bloc tel quel.
 * @param {string} template
 * @param {Object} [params={}]
 * @param {string} [lang='fr']
 * @returns {string}
 */
export function formatMessage(template, params = {}, lang = 'fr') {
  const text = String(template ?? '');
  const values = params && typeof params === 'object' ? params : {};
  let out = '';
  let index = 0;
  while (index < text.length) {
    const open = text.indexOf('{', index);
    const close = open < 0 ? -1 : matchingBrace(text, open);
    if (close < 0) {
      out += text.slice(index);
      break;
    }
    out += text.slice(index, open) + formatArgument(text.slice(open, close + 1), values, lang);
    index = close + 1;
  }
  return out;
}

/**
 * Ajoute à `names` les paramètres des blocs de `text`, branches de pluriel comprises.
 * @param {string} text
 * @param {Set<string>} names
 */
function collectArguments(text, names) {
  let index = 0;
  while (index < text.length) {
    const open = text.indexOf('{', index);
    const close = open < 0 ? -1 : matchingBrace(text, open);
    if (close < 0) return;
    const inner = text.slice(open + 1, close);
    const simple = SIMPLE_ARGUMENT.exec(inner);
    const plural = simple ? null : PLURAL_ARGUMENT.exec(inner);
    if (simple) names.add(simple[1]);
    if (plural) {
      names.add(plural[1]);
      const cases = parsePluralCases(inner.slice(plural[0].length));
      for (const body of cases?.values() ?? []) collectArguments(body, names);
    }
    index = close + 1;
  }
}

/**
 * Noms des paramètres d'un message, triés et sans doublon : « {n, plural, …} » compte
 * pour « n », et les paramètres écrits dans ses branches comptent aussi.
 * @param {string} template
 * @returns {string[]}
 */
export function messageArguments(template) {
  const names = new Set();
  collectArguments(String(template ?? ''), names);
  return [...names].sort((a, b) => a.localeCompare(b));
}

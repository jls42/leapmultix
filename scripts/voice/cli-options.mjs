// Options de la ligne de commande des scripts de la voix, lues d'après une table : option
// → clé du résultat et genre de valeur (drapeau, texte, chemin, entier). Lecture stricte :
// une option inconnue, une valeur manquante ou un nombre mal écrit arrêtent le script,
// jamais d'option ignorée ni de NaN en silence.

import path from 'node:path';

/** Entier ≥ min, sans quoi l'option est refusée (pas de NaN silencieux) */
export function wholeNumber(value, option, min = 0) {
  if (!/^\d+$/.test(String(value ?? '')) || Number(value) < min) {
    throw new Error(`${option} attend un entier ≥ ${min} (reçu : ${value ?? 'rien'})`);
  }
  return Number(value);
}

/** Code de langue à deux lettres, sans quoi --lang est refusé */
export function assertLangCode(lang) {
  if (!/^[a-z]{2}$/.test(lang ?? '')) throw new Error('--lang attend un code (fr, en, es)');
}

/** Valeur d'une option : absente, ou remplacée par l'option suivante, elle manque */
function presentValue(value, option) {
  if (value === undefined || value.startsWith('--'))
    throw new Error(`Valeur manquante : ${option}`);
  return value;
}

/** Drapeau : sa présence vaut true */
export const flagOption = key => ({ key });

/** Option suivie d'un texte, gardé tel quel */
export const valueOption = key => ({ key, read: presentValue });

/** Option suivie d'un chemin, rendu absolu */
export const pathOption = key => ({
  key,
  read: (value, option) => path.resolve(presentValue(value, option)),
});

/** Option suivie d'un entier ≥ min ; une valeur absente est refusée comme un nombre mal écrit */
export const integerOption = (key, min = 0) => ({
  key,
  read: (value, option) => wholeNumber(value, option, min),
});

/**
 * Lit les options d'après leur table ; une option donnée deux fois garde sa dernière valeur
 * @param {string[]} argv
 * @param {Object<string, {key: string, read?: Function}>} table - option → sa lecture
 *   (flagOption, valueOption, pathOption, integerOption)
 * @param {Object} [defaults] - valeurs par défaut, remplacées par les options données
 * @returns {Object}
 */
export function parseOptions(argv, table, defaults = {}) {
  const args = { ...defaults };
  const rest = [...argv];
  while (rest.length) {
    const option = rest.shift();
    // Seules les options de la table : « constructor » ou « __proto__ » restent inconnues
    if (!Object.hasOwn(table, option)) throw new Error(`Option inconnue : ${option}`);
    const { key, read } = table[option];
    args[key] = read ? read(rest.shift(), option) : true;
  }
  return args;
}

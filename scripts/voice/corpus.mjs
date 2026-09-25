#!/usr/bin/env node
// Corpus de la voix enregistrée : toutes les phrases que le jeu peut passer à speak(),
// par langue. Chaque phrase est composée par le code du jeu lui-même (opérations et
// leurs plages, formateur de messages, formes parlées, données des modes) : quand le jeu
// change une phrase, le corpus change, et le verrou corpus.lock.json le signale.
//
// Usage :
//   node scripts/voice/corpus.mjs                résumé par langue
//   node scripts/voice/corpus.mjs --list fr      phrases d'une langue, une par ligne
//   node scripts/voice/corpus.mjs --write-lock   met le verrou à jour
//   node scripts/voice/corpus.mjs --check        échoue si le verrou n'est plus à jour

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatMessage } from '../../js/core/message-format.js';
import {
  VOICE_KEY_SCHEMA,
  normalizeSpokenText,
  spokenEquation,
  spokenGapQuestion,
  spokenQuestion,
  voiceKey,
} from '../../js/core/spoken-text.js';
import { getAdventureLevelsByOperator } from '../../js/core/adventure-data.js';
import {
  DISCOVERY_FACTORS,
  DISCOVERY_TABLES,
  DIVISION_LEVELS,
  DROP_PLANS,
  EXAMPLE_BANDS,
  VISUAL_BANDS,
  bandExamples,
  divisionTableExamples,
  divisionVisualExamples,
  rangeOf,
} from '../../js/modes/discovery-data.js';

// Le registre des opérations annonce chaque opération dans la console à son chargement :
// on le charge en silence, pour que --list ne sorte que des phrases.
const { getOperation } = await (async () => {
  const log = console.log;
  console.log = () => {};
  try {
    return await import('../../js/core/operations/OperationRegistry.js');
  } finally {
    console.log = log;
  }
})();

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const LOCK_PATH = path.join(ROOT, 'scripts/voice/corpus.lock.json');

export const LANGS = ['fr', 'en', 'es'];
const OPERATORS = ['×', '+', '−', '÷'];
const LEVELS = ['easy', 'medium', 'hard'];

/** Modes annoncés au démarrage (GameMode.start : « <mode>_mode ») */
const ANNOUNCED_MODES = ['quiz', 'challenge', 'adventure', 'discovery', 'arcade'];

/** Quiz et Défi, multiplication : tables 1 à 10, multiplicandes 1 à 10 (getQuestionOptions) */
const QUIZ_FACTORS = Array.from({ length: 10 }, (_, i) => i + 1);

/** Quiz et Défi, autres opérations : difficulté moyenne (getQuestionOptions) */
const QUIZ_DIFFICULTY = 'medium';

/** Énoncés de problèmes, par opération (GameMode, PROBLEM_TEMPLATE_KEYS) */
const PROBLEM_TEMPLATE_KEYS = {
  '×': 'problem_templates',
  '+': 'problem_templates_addition',
  '−': 'problem_templates_subtraction',
  '÷': 'problem_templates_division',
};

/** Phrases fixes : fin d'arcade, messages des mini-jeux, félicitations, bouton de voix */
const FIXED_KEYS = [
  'arcade_try_again',
  'arcade_game_over_spoken',
  'arcade_life_lost',
  'arcade.multiMemory.match',
  'arcade.multiMemory.mismatch',
  'arcade.multiMemory.win',
  'arcade_avatar_error',
  'arcade_load_error',
  'congrats1',
  'congrats2',
  'congrats3',
  'congrats4',
  'congrats5',
  'voice_enabled',
];

/**
 * Traductions d'une langue
 * @param {string} lang
 * @returns {Object}
 */
export function readTranslations(lang) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, `assets/translations/${lang}.json`), 'utf8'));
}

function resolveKey(dict, key) {
  const nested = key.split('.').reduce((acc, part) => acc?.[part], dict);
  return nested ?? dict[key];
}

/**
 * Traductions d'une clé : toutes ses variantes s'il s'agit d'un tableau (translate()
 * en tire une au hasard), remplies avec les paramètres ; [] si la clé manque.
 */
function variantsOf(dict, lang, key, params = {}) {
  const value = resolveKey(dict, key);
  const list = Array.isArray(value) ? value : [value];
  return list.filter(v => typeof v === 'string' && v).map(v => formatMessage(v, params, lang));
}

/** translate(key, params) des formes parlées : texte traduit, ou null si la clé manque */
function translatorFor(dict, lang) {
  return (key, params) => variantsOf(dict, lang, key, params)[0] ?? null;
}

const pairKey = ({ a, b }) => `${a}|${b}`;

function uniquePairs(pairs) {
  return [...new Map(pairs.map(pair => [pairKey(pair), pair])).values()];
}

const swapped = pairs => pairs.map(({ a, b }) => ({ a: b, b: a }));

/** Paires du Quiz et du Défi pour une opération */
function quizPairs(operator) {
  if (operator === '×') {
    return QUIZ_FACTORS.flatMap(a => QUIZ_FACTORS.map(b => ({ a, b })));
  }
  return getOperation(operator).enumerateOperands(QUIZ_DIFFICULTY);
}

/**
 * Paires de l'Aventure, dans l'ordre affiché : la table de chaque niveau et les
 * multiplicandes 1 à 10 pour ×, la difficulté du niveau sinon ; × et + s'affichent
 * aussi facteurs inversés (AdventureMode.displayQuestion).
 */
function adventurePairs(operator) {
  const operation = getOperation(operator);
  const levels = getAdventureLevelsByOperator(operator);
  const pairs =
    operator === '×'
      ? levels.flatMap(level => QUIZ_FACTORS.map(b => ({ a: level.table, b })))
      : [...new Set(levels.map(level => level.difficulty || 'easy'))].flatMap(difficulty =>
          operation.enumerateOperands(difficulty)
        );
  return uniquePairs(operator === '×' || operator === '+' ? [...pairs, ...swapped(pairs)] : pairs);
}

/** Propositions du vrai/faux : le résultat, ±1 et ±2, jamais sous zéro (questionGenerator) */
function trueFalseProposals(result) {
  const proposals = new Set([result]);
  for (const magnitude of [1, 2]) {
    proposals.add(result + magnitude);
    proposals.add(result - magnitude < 0 ? result + magnitude : result - magnitude);
  }
  return [...proposals];
}

/** Égalités que la Découverte peut dire, pour une opération */
function discoveryExamples(operator) {
  const compute = (a, b) => getOperation(operator).compute(a, b);
  if (operator === '×') {
    return DISCOVERY_TABLES.flatMap(a => DISCOVERY_FACTORS.map(b => ({ a, b })));
  }
  if (operator === '÷') {
    return LEVELS.flatMap(level => {
      const divisionLevel = DIVISION_LEVELS[level];
      return rangeOf(divisionLevel.divisor).flatMap(divisor =>
        divisionTableExamples(divisor, divisionLevel, compute)
      );
    }).concat(divisionVisualExamples(compute));
  }
  return LEVELS.flatMap(level => {
    const drop = DROP_PLANS[operator][level];
    const dropped = rangeOf(drop.first)
      .flatMap(a => rangeOf(drop.items).map(b => ({ a, b })))
      .filter(({ a, b }) => Number.isInteger(compute(a, b)) && compute(a, b) >= 0);
    return [
      ...bandExamples(operator, EXAMPLE_BANDS[operator][level], compute),
      ...bandExamples(operator, VISUAL_BANDS[operator][level], compute),
      ...dropped,
    ];
  });
}

/**
 * Quiz (types au choix de l'opération) et Défi (QCM) : questions et bonnes réponses
 * @param {Object} ctx - Contexte de construction (voir buildCorpus)
 * @param {string} operator
 */
function addQuizPhrases(ctx, operator) {
  const { dict, lang, t, add, quizAnswers, challengeAnswers } = ctx;
  const operation = getOperation(operator);
  const types = operation.getSupportedTypes();
  const { symbol } = operation;
  for (const { a, b } of quizPairs(operator)) {
    const result = operation.compute(a, b);
    add('question', spokenQuestion(`${a} ${symbol} ${b} = ?`, t), operator);
    challengeAnswers.add(result);
    quizAnswers.add(result);
    if (types.includes('gap')) {
      add('question à trou', spokenGapQuestion(`${a} ${symbol} ? = ${result}`, t), operator);
      quizAnswers.add(b);
    }
    if (types.includes('true_false')) {
      for (const proposal of trueFalseProposals(result)) {
        add('vrai ou faux', spokenEquation(`${a} ${symbol} ${b} = ${proposal}`, t), operator);
      }
    }
    if (types.includes('problem')) {
      const params = operator === '×' ? { table: a, num: b } : { a, b };
      const statements = variantsOf(dict, lang, PROBLEM_TEMPLATE_KEYS[operator], params);
      statements.forEach(statement => add('énoncé', spokenQuestion(statement, t), operator));
    }
  }
}

/**
 * Aventure (QCM, facteurs parfois inversés) et Découverte (égalité touchée, montrée ou
 * complétée)
 * @param {Object} ctx - Contexte de construction (voir buildCorpus)
 * @param {string} operator
 */
function addAdventureAndDiscoveryPhrases(ctx, operator) {
  const { t, add, quizAnswers } = ctx;
  const operation = getOperation(operator);
  const { symbol } = operation;
  for (const { a, b } of adventurePairs(operator)) {
    add('question', spokenQuestion(`${a} ${symbol} ${b} = ?`, t), operator);
    quizAnswers.add(operation.compute(a, b));
  }
  for (const { a, b } of uniquePairs(discoveryExamples(operator))) {
    const result = operation.compute(a, b);
    const symbolic = spokenEquation(`${a} ${symbol} ${b} = ${result}`, t);
    const spoken = t(`discovery_speech_${operation.name}`, { a, b, result }) ?? symbolic;
    add('découverte', spoken, operator);
  }
}

/**
 * Erreurs : « Presque ! La bonne réponse est 8. » (Quiz et Aventure ; Défi à part)
 * @param {Object} ctx - Contexte de construction (voir buildCorpus)
 */
function addErrorPhrases(ctx) {
  const { t, add, quizAnswers, challengeAnswers } = ctx;
  const lead = t('incorrect');
  for (const n of quizAnswers) {
    add('erreur', `${lead} ${t('feedback_incorrect', { correctAnswer: n })}`);
  }
  for (const n of challengeAnswers) {
    add('erreur', `${lead} ${t('challenge_feedback_incorrect', { correctAnswer: n })}`);
  }
  add('erreur', `${lead} ${t('incorrect_answer_was_true')}`);
  add('erreur', `${lead} ${t('incorrect_answer_was_false')}`);
}

/**
 * Découverte : la table choisie, ou l'opération et le niveau (« Addition, Facile »)
 * @param {Object} ctx - Contexte de construction (voir buildCorpus)
 */
function addDiscoveryChoicePhrases(ctx) {
  const { t, add } = ctx;
  DISCOVERY_TABLES.forEach(table => add('découverte', `${t('table_of')} ${table}`));
  for (const operator of ['+', '−', '÷']) {
    const { name } = getOperation(operator);
    const operationName = t(`operation_${name}`) ?? name;
    LEVELS.forEach(level => add('découverte', `${operationName}, ${t(`difficulty_${level}`)}`));
  }
}

/**
 * Phrases d'une langue, dédoublonnées sur leur forme canonique. Une phrase garde la
 * famille et l'opération de sa première occurrence (operator : null hors opération).
 * @param {string} lang
 * @param {Object} [dict] - Traductions (lues sur disque par défaut)
 * @returns {Array<{text: string, key: string, family: string, operator: string|null}>}
 */
export function buildCorpus(lang, dict = readTranslations(lang)) {
  const phrases = new Map();
  const add = (family, text, operator = null) => {
    const canonical = normalizeSpokenText(text);
    if (canonical && !phrases.has(canonical)) phrases.set(canonical, { family, operator });
  };
  const ctx = {
    dict,
    lang,
    t: translatorFor(dict, lang),
    add,
    quizAnswers: new Set(),
    challengeAnswers: new Set(),
  };
  const addAll = (family, texts) => texts.forEach(text => add(family, text));

  addAll(
    'annonce',
    ANNOUNCED_MODES.flatMap(mode => variantsOf(dict, lang, `${mode}_mode`))
  );
  addAll('bravo', variantsOf(dict, lang, 'correct'));
  FIXED_KEYS.forEach(key => addAll('phrase fixe', variantsOf(dict, lang, key)));
  for (const operator of OPERATORS) {
    addQuizPhrases(ctx, operator);
    addAdventureAndDiscoveryPhrases(ctx, operator);
  }
  addErrorPhrases(ctx);
  addDiscoveryChoicePhrases(ctx);

  return [...phrases.entries()]
    .map(([text, { family, operator }]) => ({ text, key: voiceKey(text), family, operator }))
    .sort((x, y) => (x.text < y.text ? -1 : Number(x.text > y.text)));
}

/**
 * Empreinte d'un corpus : nombre de phrases et sha256 des phrases triées
 * @param {Array<{text: string}>} corpus
 * @returns {{phrases: number, sha256: string}}
 */
export function corpusFingerprint(corpus) {
  const hash = crypto.createHash('sha256');
  hash.update(corpus.map(entry => entry.text).join('\n'));
  return { phrases: corpus.length, sha256: hash.digest('hex') };
}

/** Verrou attendu pour l'état actuel du jeu */
export function currentLock() {
  const languages = {};
  for (const lang of LANGS) languages[lang] = corpusFingerprint(buildCorpus(lang));
  return { schema: VOICE_KEY_SCHEMA, languages };
}

function main(argv) {
  if (argv.includes('--write-lock')) {
    fs.writeFileSync(LOCK_PATH, `${JSON.stringify(currentLock(), null, 2)}\n`);
    console.log(`Verrou écrit : ${path.relative(ROOT, LOCK_PATH)}`);
    return 0;
  }
  if (argv.includes('--check')) {
    const expected = JSON.stringify(currentLock());
    const locked = fs.existsSync(LOCK_PATH)
      ? JSON.stringify(JSON.parse(fs.readFileSync(LOCK_PATH, 'utf8')))
      : '';
    if (expected === locked) return 0;
    console.error('Les phrases parlées ont changé : régénère les clips, puis --write-lock.');
    return 1;
  }
  const listIndex = argv.indexOf('--list');
  if (listIndex >= 0) {
    const lang = argv[listIndex + 1] || 'fr';
    for (const entry of buildCorpus(lang)) console.log(JSON.stringify(entry));
    return 0;
  }
  for (const lang of LANGS) {
    const corpus = buildCorpus(lang);
    const characters = corpus.reduce((sum, entry) => sum + [...entry.text].length, 0);
    console.log(`${lang} : ${corpus.length} phrases, ${characters} caractères`);
  }
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}

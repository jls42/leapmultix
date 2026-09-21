/* eslint-env jest, node */
/**
 * GameMode : ce qui est commun aux modes Quiz, Défi et Aventure.
 * - une erreur est expliquée selon l'opération (comptage, vérification, vrai résultat) ;
 * - le comptage d'un problème suit la taille des groupes de l'énoncé ;
 * - les réponses proposées sont des voisines plausibles, jamais des nombres au hasard ;
 * - un énoncé se retraduit avec le même gabarit.
 */
import { describe, test, expect, beforeAll, beforeEach, jest } from '@jest/globals';

jest.unstable_mockModule('../../js/slides.js', () => ({
  goToSlide: jest.fn(),
  showSlide: jest.fn(),
  hideAllSlides: jest.fn(),
  nextSlide: jest.fn(),
  prevSlide: jest.fn(),
}));

const store = await import('../../js/i18n-store.js');
const {
  buildErrorExplanation,
  plausibleWrongAnswers,
  buildAnswerOptions,
  findProblemTemplateIndex,
} = await import('../../js/core/GameMode.js');
const { keepNumbersTogether } = await import('../../js/ui-feedback.js');

const NBSP = '\u00a0';

const FR = {
  feedback_incorrect: 'La bonne réponse est {correctAnswer}.',
  incorrect_answer_was_true: 'La bonne réponse est Vrai.',
  incorrect_answer_was_false: 'La bonne réponse est Faux.',
  feedback_count_by: 'Compter par {step} :',
  feedback_count_on: 'Avancer de {step} depuis {start} :',
  feedback_count_back: 'Reculer de {step} depuis {start} :',
  feedback_check: 'Pour vérifier :',
  feedback_right_result: 'Le bon résultat :',
  number_line_addition_explanation: "Additionner, c'est avancer sur la ligne numérique !",
  number_line_subtraction_explanation: "Soustraire, c'est reculer sur la ligne numérique !",
  division_sharing_explanation: "Diviser, c'est partager en parts égales !",
  mnemonic_7: 'Multiplication par 7 : une semaine = 7 jours',
  mnemonic_8: 'Multiplication par 8 : double trois fois',
  mnemonic_9: 'Multiplication par 9 : astuce',
  mnemonic_3: 'Multiplication par 3 : astuce',
  problem_templates: [
    "Si j'ai {num} boîtes de {table} pommes, combien de pommes ai-je ?",
    'Il y a {table} groupes de {num} enfants. Combien d’enfants au total ?',
    'Une fusée fait {table} sauts de {num} cases. Quelle distance totale ?',
  ],
};

const EN_TEMPLATES = [
  'If I have {num} boxes of {table} apples, how many apples do I have?',
  'There are {table} groups of {num} children. How many children in total?',
  'A rocket makes {table} jumps of {num} squares. What is the total distance?',
];

/** Énoncé de problème tel que le produit questionGenerator (gabarit n°index) */
function problem(index, a, b) {
  const question = FR.problem_templates[index].replace('{table}', a).replace('{num}', b);
  return { question, answer: a * b, type: 'problem', operator: '×', a, b, table: a, num: b };
}

function steps(explanation) {
  return explanation.countBy?.steps ?? null;
}

beforeAll(() => {
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
});

beforeEach(() => {
  store.setTranslations(FR);
});

describe('Explication d’une erreur selon l’opération', () => {
  test('× : compter par le premier facteur, avec l’astuce de sa table', () => {
    const e = buildErrorExplanation({
      question: '7 × 3 = ?',
      answer: 21,
      type: 'mcq',
      operator: '×',
      a: 7,
      b: 3,
    });
    expect(e.message).toBe('La bonne réponse est 21.');
    expect(steps(e)).toEqual([7, 14, 21]);
    expect(e.countBy.label).toBe('Compter par 7 :');
    // « = 7 jours » ne se coupe pas
    expect(e.hint).toBe(`Multiplication par 7 : une semaine${NBSP}=${NBSP}7${NBSP}jours`);
  });

  test('+ : avancer à partir du plus grand nombre', () => {
    const e = buildErrorExplanation({
      question: '2 + 9 = ?',
      answer: 11,
      type: 'classic',
      operator: '+',
      a: 2,
      b: 9,
    });
    expect(steps(e)).toEqual([9, 10, 11]);
    expect(e.countBy.label).toBe('Avancer de 2 depuis 9 :');
    expect(e.hint).toBe("Additionner, c'est avancer sur la ligne numérique !");
    expect(e.facts).toEqual([]);
  });

  test('− : reculer pas à pas, ou vérifier par l’addition au-delà de 10 pas', () => {
    const small = buildErrorExplanation({
      question: '15 − 3 = ?',
      answer: 12,
      type: 'mcq',
      operator: '−',
      a: 15,
      b: 3,
    });
    expect(steps(small)).toEqual([15, 14, 13, 12]);
    expect(small.countBy.label).toBe('Reculer de 3 depuis 15 :');

    const big = buildErrorExplanation({
      question: '19 − 12 = ?',
      answer: 7,
      type: 'mcq',
      operator: '−',
      a: 19,
      b: 12,
    });
    expect(big.countBy).toBeNull();
    expect(big.facts).toEqual([
      { label: 'Pour vérifier :', equation: `7${NBSP}+${NBSP}12${NBSP}=${NBSP}19` },
    ]);
  });

  test('÷ : vérifier par la multiplication, avec l’idée du partage', () => {
    const e = buildErrorExplanation({
      question: '36 ÷ 4 = ?',
      answer: 9,
      type: 'mcq',
      operator: '÷',
      a: 36,
      b: 4,
    });
    expect(e.facts).toEqual([
      { label: 'Pour vérifier :', equation: `9${NBSP}×${NBSP}4${NBSP}=${NBSP}36` },
    ]);
    expect(e.hint).toBe("Diviser, c'est partager en parts égales !");
  });

  test('Vrai/Faux : le vrai résultat est écrit, puis ce que fait l’opération', () => {
    const e = buildErrorExplanation({
      question: '7 + 7 = 15',
      answer: false,
      type: 'true_false',
      operator: '+',
      a: 7,
      b: 7,
    });
    expect(e.message).toBe('La bonne réponse est Faux.');
    expect(e.facts[0]).toEqual({
      label: 'Le bon résultat :',
      equation: `7${NBSP}+${NBSP}7${NBSP}=${NBSP}14`,
    });
    expect(steps(e)).toEqual([7, 8, 9, 10, 11, 12, 13, 14]);
  });

  test('question à trou : le calcul complété sert de vérification', () => {
    const e = buildErrorExplanation({
      question: '3 × ? = 27',
      answer: 9,
      type: 'gap',
      operator: '×',
      a: 3,
      b: 9,
    });
    expect(e.countBy).toBeNull();
    expect(e.facts[0].equation).toBe(`3${NBSP}×${NBSP}9${NBSP}=${NBSP}27`);
    expect(e.hint).toBe('Multiplication par 3 : astuce');
  });
});

describe('Problèmes : le comptage suit la taille des groupes de l’énoncé', () => {
  test('« 8 boîtes de 7 pommes » : compter par 7, 8 fois', () => {
    const q = problem(0, 7, 8);
    expect(steps(buildErrorExplanation(q))).toEqual([7, 14, 21, 28, 35, 42, 49, 56]);
  });

  test('« 8 groupes de 7 enfants » : compter par 7, 8 fois', () => {
    const e = buildErrorExplanation(problem(1, 8, 7));
    expect(e.countBy.label).toBe('Compter par 7 :');
    expect(steps(e)).toEqual([7, 14, 21, 28, 35, 42, 49, 56]);
  });

  test('« 3 sauts de 9 cases » : 9 → 18 → 27', () => {
    const e = buildErrorExplanation(problem(2, 3, 9));
    expect(steps(e)).toEqual([9, 18, 27]);
    expect(e.hint).toBe('Multiplication par 9 : astuce');
  });

  test('gabarit introuvable : pas de comptage plutôt qu’un comptage faux', () => {
    const q = { ...problem(1, 8, 7), question: 'Énoncé inconnu' };
    expect(buildErrorExplanation(q).countBy).toBeNull();
  });

  test('le gabarit retenu à la génération sert encore après un changement de langue', () => {
    const q = problem(2, 3, 9);
    q.templateIndex = findProblemTemplateIndex(q);
    expect(q.templateIndex).toBe(2);
    store.setTranslations({ ...FR, problem_templates: EN_TEMPLATES });
    expect(steps(buildErrorExplanation(q))).toEqual([9, 18, 27]);
  });

  test('un nombre reste collé à son nom dans l’énoncé affiché', () => {
    expect(keepNumbersTogether('Une fusée fait 9 sauts de 6 cases.')).toBe(
      `Une fusée fait 9${NBSP}sauts de 6${NBSP}cases.`
    );
  });
});

describe('Réponses proposées plausibles', () => {
  const cases = [
    { question: '1 × 9 = ?', answer: 9, type: 'mcq', operator: '×', a: 1, b: 9 },
    { question: '7 × 8 = ?', answer: 56, type: 'mcq', operator: '×', a: 7, b: 8 },
    { question: '9 + 7 = ?', answer: 16, type: 'mcq', operator: '+', a: 9, b: 7 },
    { question: '9 + ? = 10', answer: 1, type: 'gap', operator: '+', a: 9, b: 1 },
    { question: '3 × ? = 9', answer: 3, type: 'gap', operator: '×', a: 3, b: 3 },
    { question: '5 − 5 = ?', answer: 0, type: 'mcq', operator: '−', a: 5, b: 5 },
    { question: '36 ÷ 4 = ?', answer: 9, type: 'mcq', operator: '÷', a: 36, b: 4 },
    { question: '10 × 10 = ?', answer: 100, type: 'mcq', operator: '×', a: 10, b: 10 },
  ];

  test.each(cases)('$question : trois voisines distinctes, proches de la bonne', q => {
    for (let run = 0; run < 30; run++) {
      const wrong = plausibleWrongAnswers(q);
      expect(wrong).toHaveLength(3);
      expect(new Set(wrong).size).toBe(3);
      expect(wrong).not.toContain(q.answer);
      for (const value of wrong) {
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(q.type === 'gap' || q.operator !== '−' ? 1 : 0);
        expect(value).toBeLessThanOrEqual(100);
        // Proches : au plus une table ou une dizaine d'écart
        expect(Math.abs(value - q.answer)).toBeLessThanOrEqual(Math.max(10, q.a, q.b));
      }
    }
  });

  test('les quatre réponses contiennent la bonne, une seule fois', () => {
    const q = cases[1];
    const options = buildAnswerOptions(q);
    expect(options).toHaveLength(4);
    expect(options.filter(v => v === q.answer)).toHaveLength(1);
  });
});

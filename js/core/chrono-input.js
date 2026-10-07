/**
 * Saisie Chrono : validation dès que la valeur tapée est la réponse,
 * ou dès qu’elle ne peut plus en être le préfixe.
 */

/**
 * @param {string} typed
 * @param {number|string} answer
 * @returns {'empty'|'prefix'|'correct'|'wrong'}
 */
export function classifyTypedAnswer(typed, answer) {
  const digits = String(typed ?? '').replace(/\D/g, '');
  const expected = String(answer);
  if (digits.length === 0) return 'empty';
  if (digits === expected) return 'correct';
  if (expected.startsWith(digits)) return 'prefix';
  return 'wrong';
}

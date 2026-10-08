/**
 * Progression de l'Aventure par opération (`adventureProgressByOperator`).
 *
 * Avant les quatre opérations (commit 236de4b, décembre 2025), l'Aventure n'existait qu'en
 * multiplication et rangeait ses niveaux dans `adventureProgress`. Ce champ n'est plus écrit :
 * il est recopié ici dans la multiplication, à chaque lecture du profil, sans être effacé (un
 * retour à une version précédente le relit tel quel). Un niveau × joué depuis ne masque plus
 * les anciens : chaque niveau garde le meilleur des deux.
 */

const isPlainObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/** Le meilleur d'un niveau : terminé s'il l'a été, le plus d'étoiles, le plus de réussites */
function bestOfLevel(older, current) {
  return {
    ...current,
    completed: Boolean(current.completed) || Boolean(older.completed),
    stars: Math.max(Number(current.stars) || 0, Number(older.stars) || 0),
    attempts: Math.max(Number(current.attempts) || 0, Number(older.attempts) || 0),
  };
}

/**
 * @param {unknown} byOperator - `adventureProgressByOperator` du profil
 * @param {unknown} legacy - `adventureProgress`, l'ancien format (multiplication seule)
 * @returns {Record<string, Record<string, Object>>}
 */
export function normalizeAdventureProgressByOperator(byOperator, legacy) {
  const source = isPlainObject(byOperator) ? byOperator : {};
  if (!isPlainObject(legacy) || Object.keys(legacy).length === 0) return { ...source };
  const multiplication = source['×'];
  const merged = new Map(Object.entries(isPlainObject(multiplication) ? multiplication : {}));
  for (const [levelId, older] of Object.entries(legacy)) {
    if (!isPlainObject(older)) continue;
    const current = merged.get(levelId);
    merged.set(levelId, isPlainObject(current) ? bestOfLevel(older, current) : { ...older });
  }
  return { ...source, '×': Object.fromEntries(merged) };
}

/**
 * Niveaux terminés et étoiles de chaque opération jouée, pour le tableau de bord
 * @param {unknown} byOperator - `adventureProgressByOperator`, déjà normalisé
 * @returns {Record<string, {levels: number, stars: number}>}
 */
export function adventureTotalsByOperator(byOperator) {
  const totals = Object.entries(isPlainObject(byOperator) ? byOperator : {})
    .map(([operator, levels]) => [operator, levelTotals(levels)])
    .filter(([, total]) => total.levels > 0 || total.stars > 0);
  return Object.fromEntries(totals);
}

/** Niveaux terminés et étoiles des niveaux d'une opération */
function levelTotals(levels) {
  let completed = 0;
  let stars = 0;
  for (const level of Object.values(isPlainObject(levels) ? levels : {})) {
    if (level?.completed) completed += 1;
    stars += Number(level?.stars) || 0;
  }
  return { levels: completed, stars };
}

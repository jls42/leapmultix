/*
 Appels en série des scripts : chaque tâche attend la fin de la précédente.

 Certains appels doivent rester l'un après l'autre : une API payante et ses
 limites de débit, des fichiers traités dans l'ordre, un journal qui se lit.
 Cette aide le dit en un mot, et ses tests le garantissent : jamais deux tâches
 à la fois, résultats dans l'ordre, arrêt au premier échec.
*/

/**
 * Appelle `task(item, index)` sur chaque élément, l'un après l'autre : un appel commence quand le
 * précédent est fini, et le premier échec arrête la suite, comme une boucle for…of avec await.
 * Les éléments sont lus au départ : un élément ajouté pendant le parcours n'est pas vu.
 * @template T, R
 * @param {Iterable<T>} items
 * @param {(item: T, index: number) => R | Promise<R>} task
 * @returns {Promise<Awaited<R>[]>} Les résultats, dans l'ordre des éléments
 */
async function inSequence(items, task) {
  const results = [];
  await Array.from(items).reduce(
    (previous, item, index) =>
      previous.then(async () => {
        results.push(await task(item, index));
      }),
    Promise.resolve()
  );
  return results;
}

module.exports = { inSequence };

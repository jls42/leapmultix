/* eslint-env jest, node */
/**
 * Inventaire des appels qui font parler le jeu. Chaque phrase dite doit figurer dans le
 * corpus de la voix enregistrée (scripts/voice/corpus.mjs), sinon elle n'a pas de clip.
 * Un appel ajouté, retiré ou déplacé fait échouer ce test : vérifier que sa phrase est
 * dans le corpus (et dans tests-esm/voice/modes-in-corpus.esm.test.mjs), puis mettre
 * l'inventaire à jour.
 */
import { describe, test, expect } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

/** Appels comptés : speak() et les deux aides qui peuvent lire leur message à voix haute */
const PATTERNS = {
  speak: /(?<![\w.])_?speak\(/g,
  showFeedback: /(?<![\w.])showFeedback\(/g,
  displayFeedback: /\.displayFeedback\(/g,
};

/** État connu, fichier par fichier, avec la famille de phrases du corpus */
const EXPECTED = {
  // congrats1 à congrats5 (phrases fixes)
  'js/arcade-invasion.js': { speak: 1 },
  // messages des mini-jeux, seulement traduits (phrases fixes)
  'js/arcade-message.js': { speak: 1 },
  // fin de partie sans le score : arcade_try_again, arcade_game_over_spoken
  'js/arcade.js': { speak: 1 },
  // voice_enabled
  'js/components/topBar.js': { speak: 1 },
  // annonce du mode ; la question, dite tout de suite ou en file après un « Bravo » (ses
  // trois formes viennent de spokenQuestionText) ; showFeedback : retours de la classe de
  // base, remplacés par chaque mode (feedback_correct, dont les points ne sont pas bornés)
  'js/core/GameMode.js': { speak: 3, showFeedback: 2 },
  // bravo, erreur ; showFeedback sans voix
  'js/modes/AdventureMode.js': { speak: 2, showFeedback: 1 },
  // bravo ; displayFeedback lit l'erreur (challenge_feedback_incorrect)
  'js/modes/ChallengeMode.js': { speak: 1, showFeedback: 1, displayFeedback: 2 },
  // table, opération et niveau, égalités
  'js/modes/DiscoveryMode.js': { speak: 3 },
  // bravo, erreur ; showFeedback sans voix
  'js/modes/QuizMode.js': { speak: 2, showFeedback: 1 },
  // showFeedback(…, speakIt) : la définition et son appel à speak()
  'js/ui-feedback.js': { speak: 1, showFeedback: 1 },
};

function jsFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return jsFiles(full);
    return full.endsWith('.js') ? [full] : [];
  });
}

/** Source sans commentaires : un appel cité dans un commentaire ne compte pas */
function codeOf(file) {
  return fs
    .readFileSync(file, 'utf8')
    .replaceAll(/\/\*[\s\S]*?\*\//g, '')
    .replaceAll(/\/\/.*$/gm, '');
}

function currentInventory() {
  const inventory = {};
  for (const file of jsFiles('js').sort((a, b) => a.localeCompare(b))) {
    // speech.js définit speak() et parle à speechSynthesis : il n'est pas un appelant
    if (file === path.join('js', 'speech.js')) continue;
    const code = codeOf(file);
    const counts = {};
    for (const [name, pattern] of Object.entries(PATTERNS)) {
      const found = code.match(pattern)?.length ?? 0;
      if (found > 0) counts[name] = found;
    }
    if (Object.keys(counts).length > 0) inventory[file.split(path.sep).join('/')] = counts;
  }
  return inventory;
}

describe('Inventaire des phrases dites', () => {
  test('chaque appel qui fait parler le jeu est connu du corpus', () => {
    expect(currentInventory()).toEqual(EXPECTED);
  });
});

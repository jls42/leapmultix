/* eslint-env jest, node */
/**
 * « Remettre à zéro » (écran de fin d'Arcade) efface les meilleurs scores du jeu, et aussi
 * ses compteurs du tableau de bord : nombre de parties, meilleur score et score moyen, dans
 * toutes les opérations (resetArcadeGame, core/mode-stats.js). La fenêtre de confirmation
 * le dit (sa question en titre, la suite en texte), avec les mots du tableau de bord, en
 * français, en anglais et en espagnol.
 */
import { describe, test, expect } from '@jest/globals';
import fs from 'node:fs';
import { formatMessage } from '../js/core/message-format.js';

const read = lang => JSON.parse(fs.readFileSync(`assets/translations/${lang}.json`, 'utf8'));
const lower = text => text.toLocaleLowerCase();
const lastWord = text => text.split(/\s+/).at(-1);

describe.each(['fr', 'en', 'es'])('« Remettre à zéro » (%s)', lang => {
  const dict = read(lang);
  const title = formatMessage(dict.reset_scores_confirm, { game: 'MultiSnake' }, lang);
  const detail = formatMessage(dict.reset_scores_confirm_detail, {}, lang);

  test('la question, en titre, nomme le jeu', () => {
    expect(title).toContain('MultiSnake');
  });

  test('la fenêtre dit tout ce qui sera effacé, avec les mots du tableau de bord', () => {
    const text = lower(`${title} ${detail}`);
    expect(text).toContain(lower(dict.arcade_top_scores));
    // « Nombre de parties » : les parties
    expect(text).toContain(lower(lastWord(dict.sessions_count_label)));
    expect(text).toContain(lower(dict.average_score_label));
    expect(text).toContain(lower(dict.dashboard));
  });
});

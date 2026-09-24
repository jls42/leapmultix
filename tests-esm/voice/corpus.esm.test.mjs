/* eslint-env jest, node */
/**
 * Corpus de la voix enregistrée (scripts/voice/corpus.mjs) : le verrou suit les phrases
 * du jeu, chaque phrase a son empreinte, et les phrases réellement produites par le
 * générateur de questions y figurent toutes.
 */
import { describe, test, expect, beforeAll } from '@jest/globals';
import fs from 'node:fs';

const { LANGS, LOCK_PATH, buildCorpus, currentLock } = await import(
  '../../scripts/voice/corpus.mjs'
);
const { normalizeSpokenText, voiceKey } = await import('../../js/core/spoken-text.js');

describe('Corpus de la voix enregistrée', () => {
  const corpora = {};

  beforeAll(() => {
    for (const lang of LANGS) corpora[lang] = buildCorpus(lang);
  });

  test('le verrou est à jour : une phrase parlée changée impose de régénérer les clips', () => {
    const locked = JSON.parse(fs.readFileSync(LOCK_PATH, 'utf8'));
    // En cas d'échec : régénérer les clips de la langue, puis
    // `node scripts/voice/corpus.mjs --write-lock`
    expect(currentLock()).toEqual(locked);
  });

  test.each(LANGS)('%s : chaque phrase a une empreinte à elle, et une forme canonique', lang => {
    const corpus = corpora[lang];
    expect(corpus.length).toBeGreaterThan(7000);
    expect(new Set(corpus.map(entry => entry.key)).size).toBe(corpus.length);
    for (const entry of corpus) {
      expect(entry.text).toBe(normalizeSpokenText(entry.text));
      expect(entry.key).toBe(voiceKey(entry.text));
    }
  });

  test.each(LANGS)('%s : aucune phrase ne garde une clé, une accolade ou un symbole', lang => {
    for (const { text } of corpora[lang]) {
      expect(text).not.toMatch(/\[[\w.-]+\]|[{}#×÷−=]/);
    }
  });

  test('les questions se disent « Combien font … ? », jamais « … égale ? »', () => {
    const texts = new Set(corpora.fr.map(entry => entry.text));
    expect(texts.has('Combien font 7 fois 8 ?')).toBe(true);
    expect(texts.has('7 fois combien égale 56 ?')).toBe(true);
    expect([...texts].some(text => text.endsWith('égale ?'))).toBe(false);
  });

  test('les énoncés accordés au singulier y figurent', () => {
    const texts = new Set(corpora.fr.map(entry => entry.text));
    expect(texts.has("Si j'ai 1 boîte de 7 pommes, combien de pommes ai-je ?")).toBe(true);
    expect(texts.has("Si j'ai 1 boîtes de 7 pommes, combien de pommes ai-je ?")).toBe(false);
  });
});

/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Contrôles des clips avant envoi : comparaison des transcriptions Whisper
 * (scripts/voice/transcript-compare.mjs) et contrôle du rangement (scripts/voice/check.mjs).
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { voiceKey } from '../../js/core/spoken-text.js';
import { saidText } from '../../scripts/voice/said-text.mjs';
import {
  compareTranscript,
  normalizeForComparison,
} from '../../scripts/voice/transcript-compare.mjs';
import { checkClips, isConsistent } from '../../scripts/voice/check.mjs';
import { loadVoice } from '../../scripts/voice/generate.mjs';
import { newManifest, sha256, storePaths, writeManifest } from '../../scripts/voice/clip-store.mjs';

describe('Nombres en lettres ramenés en chiffres', () => {
  test.each([
    ['fr', 'Combien font sept fois huit ?', 'combien font 7 fois 8'],
    ['fr', 'une fois sept égale sept', '1 fois 7 égale 7'],
    ['fr', 'vingt et une pommes', '21 pommes'],
    ['fr', 'soixante et onze', '71'],
    ['fr', 'soixante-dix-sept', '77'],
    ['fr', 'quatre-vingts', '80'],
    ['fr', 'quatre-vingt-dix-neuf', '99'],
    ['fr', 'cent vingt et un', '121'],
    ['fr', 'deux cent un', '201'],
    ['fr', 'Presque ! La bonne réponse est 56.', 'presque la bonne réponse est 56'],
    ['en', 'What is seven times eight?', 'what is 7 times 8'],
    ['en', 'one hundred and twenty-one', '121'],
    ['es', '¿Cuánto es siete por ocho?', 'cuánto es 7 por 8'],
    ['es', 'treinta y una canicas', '31 canicas'],
    ['es', 'ciento veintiuno', '121'],
  ])('%s : %s', (lang, text, expected) => {
    expect(normalizeForComparison(text, lang).join(' ')).toBe(expected);
  });
});

describe('Transcription comparée à la phrase', () => {
  test('mêmes nombres, écrits autrement : pas à réécouter', () => {
    const result = compareTranscript(
      'Combien font 1 fois 7 ?',
      'Combien font une fois sept ?',
      'fr'
    );
    expect(result).toMatchObject({ numbersMatch: true, flagged: false, similarity: 1 });
  });

  test('un nombre entendu différent : à réécouter', () => {
    const result = compareTranscript('7 fois 8 égale 54', '7 fois 8 égale 56', 'fr');
    expect(result.numbersMatch).toBe(false);
    expect(result.flagged).toBe(true);
    expect(result.heardNumbers).toEqual([7, 8, 56]);
  });

  test('un nombre en trop ou en moins : à réécouter', () => {
    expect(
      compareTranscript('Combien font 7 fois 8 ?', 'Combien font 7 fois ?', 'fr').flagged
    ).toBe(true);
    expect(compareTranscript('Mode Quiz', 'Mode Quiz 2', 'fr').flagged).toBe(true);
  });

  test('phrase trop différente, mêmes nombres : à réécouter', () => {
    const result = compareTranscript(
      'Presque ! La bonne réponse est 8.',
      'Merci d’avoir regardé 8',
      'fr'
    );
    expect(result.numbersMatch).toBe(true);
    expect(result.similarity).toBeLessThan(0.75);
    expect(result.flagged).toBe(true);
  });

  test('ponctuation et majuscules ne comptent pas', () => {
    expect(compareTranscript('Bravo, c’est correct !', 'bravo c’est correct', 'fr').flagged).toBe(
      false
    );
  });
});

describe('Cohérence du rangement', () => {
  const clean = {
    stale: [],
    entriesWithoutFile: [],
    filesWithoutEntry: [],
    invalid: [],
    changed: [],
  };

  test('rien à redire : cohérent', () => {
    expect(isConsistent(clean)).toBe(true);
  });

  test.each(Object.keys(clean))('%s seul suffit à rendre incohérent', field => {
    expect(isConsistent({ ...clean, [field]: ['x'] })).toBe(false);
  });
});

describe('Contrôle du rangement des clips', () => {
  const voice = { ...loadVoice('fr'), version: 'test-1' };
  const phrase = (text, family = 'question') => ({ text, key: voiceKey(text), family });
  const phrases = [
    phrase('Mode Quiz', 'annonce'),
    phrase('Combien font 1 fois 7 ?'),
    phrase('Bravo !', 'bravo'),
  ];
  let outDir;
  let paths;

  async function addClip(
    p,
    { said = saidText(p.text, 'fr'), duration = 1.2, data = `mp3 ${p.text}` } = {}
  ) {
    await fsp.mkdir(paths.clipDir, { recursive: true });
    await fsp.writeFile(path.join(paths.clipDir, `${p.key}.mp3`), data);
    return [p.key, { text: p.text, said, duration, bytes: data.length, sha256: sha256(data) }];
  }

  async function saveManifest(entries) {
    const manifest = newManifest('fr', voice);
    manifest.clips = Object.fromEntries(entries);
    await writeManifest(paths, manifest);
  }

  const check = options => checkClips({ lang: 'fr', phrases, voice, outDir, ...options });

  beforeEach(async () => {
    outDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'voices-check-'));
    paths = storePaths(outDir, 'fr', voice.version);
  });
  afterEach(() => fsp.rm(outDir, { recursive: true, force: true }));

  test('tout est là et concorde', async () => {
    await saveManifest(await Promise.all(phrases.map(p => addClip(p))));
    const report = await check();
    expect(report.clips).toBe(3);
    expect(report.missing.count).toBe(0);
    expect(isConsistent(report)).toBe(true);
  });

  test('phrases manquantes comptées par famille, avec leurs caractères dits', async () => {
    await saveManifest([await addClip(phrases[0])]);
    const report = await check();
    expect(report.missing).toEqual({
      count: 2,
      chars: [...'Combien font une fois 7 ?'].length + [...'Bravo !'].length,
      byFamily: { question: 1, bravo: 1 },
    });
    expect(isConsistent(report)).toBe(true);
  });

  test('entrée sans fichier, fichier sans entrée, texte dit périmé : incohérent', async () => {
    const [a, b, c] = await Promise.all(phrases.map(p => addClip(p)));
    await fsp.rm(path.join(paths.clipDir, `${phrases[0].key}.mp3`));
    b[1].said = 'Combien font un fois 7 ?';
    await saveManifest([a, b]);
    const report = await check();
    expect(report.entriesWithoutFile).toEqual([phrases[0].key]);
    expect(report.stale.map(s => s.key)).toEqual([phrases[1].key]);
    expect(report.filesWithoutEntry).toEqual([c[0]]);
    expect(isConsistent(report)).toBe(false);
  });

  test('--probe : clip invalide et clip modifié depuis sa génération', async () => {
    const entries = await Promise.all(phrases.map(p => addClip(p)));
    await saveManifest(entries);
    fs.writeFileSync(path.join(paths.clipDir, `${phrases[2].key}.mp3`), 'retouché');
    const probe = async file =>
      file.includes(phrases[0].key)
        ? { codec: 'mp3', channels: 2, duration: 1.2 }
        : { codec: 'mp3', channels: 1, duration: 1.2 };
    const report = await check({ probe });
    expect(report.invalid.map(i => i.key)).toEqual([phrases[0].key]);
    expect(report.changed.map(c => c.key)).toEqual([phrases[2].key]);
    expect(isConsistent(report)).toBe(false);
  });

  test('durées anormales et transcriptions douteuses : signalées, sans rendre incohérent', async () => {
    await saveManifest([
      await addClip(phrases[0], { duration: 6 }),
      await addClip(phrases[1]),
      await addClip(phrases[2]),
    ]);
    const report = await check({
      transcripts: [
        { key: phrases[1].key, heard: 'Combien font une fois huit ?' },
        { key: phrases[2].key, heard: 'Bravo !' },
      ],
    });
    expect(report.durationOutliers.map(o => o.key)).toEqual([phrases[0].key]);
    expect(report.transcripts.checked).toBe(2);
    expect(report.transcripts.flagged.map(f => f.key)).toEqual([phrases[1].key]);
    expect(isConsistent(report)).toBe(true);
  });
});

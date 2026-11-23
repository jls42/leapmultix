/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Voix en Opus de l'appli Android (scripts/voice/opus.mjs) : le format dans l'index, le choix
 * des clips à refaire, le contrôle du dossier, la pose dans un site. Le site, lui, reste en
 * MP3 : les commandes de publication n'écrivent jamais un autre format. Les tests qui appellent
 * ffmpeg ne tournent que là où il est installé avec l'encodeur Opus.
 */
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  VOICE_FORMATS,
  clipPath,
  parseLanguage,
  parseVoiceIndex,
} from '../../js/core/voice-index.js';
import {
  clipProblem,
  probeClip,
  processClipToOpus,
  transcodeToOpus,
} from '../../scripts/voice/audio-process.mjs';
import { loadVoice } from '../../scripts/voice/generate.mjs';
import {
  OPUS_BITRATE_KBPS,
  main,
  opusFile,
  opusPaths,
  opusProblems,
  placeInSite,
  planOpus,
  readOpusManifest,
} from '../../scripts/voice/opus.mjs';
import { alternativeEntry, indexEntry } from '../../scripts/voice/publish.mjs';
import { sha256 } from '../../scripts/voice/clip-store.mjs';

const ENTRY = {
  voice: 'lucie',
  version: 'lucie-v3-3',
  format: 'mp3',
  audience: 'all',
  defaultOn: true,
};

describe('Format des clips dans l’index', () => {
  test('MP3 et Opus sont acceptés, un autre format écarte la voix', () => {
    expect(parseLanguage(ENTRY)).toMatchObject({ format: 'mp3' });
    expect(parseLanguage({ ...ENTRY, format: 'opus' })).toMatchObject({ format: 'opus' });
    expect(parseLanguage({ ...ENTRY, format: 'wav' })).toBeNull();
    expect(parseLanguage({ ...ENTRY, format: undefined })).toBeNull();
  });

  test('adresse d’un clip : .mp3 comme avant, .ogg pour l’Opus', () => {
    expect(clipPath('fr', ENTRY, 'abc')).toBe('fr/lucie-v3-3/abc.mp3');
    expect(clipPath('fr', { ...ENTRY, format: 'opus' }, 'abc')).toBe('fr/lucie-v3-3/abc.ogg');
    // Une entrée sans format (ancien appelant) reste en MP3
    expect(clipPath('fr', { version: 'lucie-v3-3' }, 'abc')).toBe('fr/lucie-v3-3/abc.mp3');
  });

  test('chaque format dit son extension, son type et les réponses acceptées', () => {
    expect([...VOICE_FORMATS.keys()]).toEqual(['mp3', 'opus']);
    expect(VOICE_FORMATS.get('mp3')).toEqual({
      extension: 'mp3',
      type: 'audio/mpeg',
      responses: ['audio/mpeg'],
    });
    expect(VOICE_FORMATS.get('opus').responses).toEqual(['audio/ogg', 'application/ogg']);
  });

  test('le site reste en MP3 : la publication n’écrit jamais un autre format', () => {
    const voice = loadVoice('fr');
    expect(indexEntry(voice, { audience: 'all', defaultOn: true }).format).toBe('mp3');
    expect(alternativeEntry(voice, 'all').format).toBe('mp3');
  });
});

describe('Clips à refaire', () => {
  const clips = { a: { sha256: 'A1' }, b: { sha256: 'B1' }, c: { sha256: 'C1' } };

  test('rien n’est fait : tout est à faire', () => {
    expect(planOpus(clips, {}, () => false)).toEqual({ todo: ['a', 'b', 'c'], stale: [] });
  });

  test('un clip dont le MP3 a changé, ou dont le fichier manque, est refait ; un clip disparu est retiré', () => {
    const done = {
      a: { mp3Sha256: 'A1' },
      b: { mp3Sha256: 'B0' },
      c: { mp3Sha256: 'C1' },
      z: { mp3Sha256: 'Z' },
    };
    expect(planOpus(clips, done, key => key !== 'c')).toEqual({ todo: ['b', 'c'], stale: ['z'] });
  });

  test('un manifeste fait à un autre débit ne compte pas', () => {
    const work = fs.mkdtempSync(path.join(os.tmpdir(), 'leapmultix-opus-'));
    try {
      const paths = opusPaths(work, 'fr', 'v-1');
      fs.mkdirSync(path.dirname(paths.manifestFile), { recursive: true });
      fs.writeFileSync(paths.manifestFile, JSON.stringify({ bitrateKbps: 16, clips: { a: {} } }));
      expect(readOpusManifest(paths)).toEqual({ bitrateKbps: OPUS_BITRATE_KBPS, clips: {} });
      expect(readOpusManifest(paths, 16).clips).toEqual({ a: {} });
    } finally {
      fs.rmSync(work, { recursive: true, force: true });
    }
  });
});

describe('Contrôle du dossier des clips en Opus', () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'leapmultix-opus-'));
  const opus = opusPaths(work, 'fr', 'v-1');
  const voice = { clips: { a: { sha256: 'A1' }, b: { sha256: 'B1' } }, opus };
  const write = (key, text) => {
    fs.mkdirSync(opus.dir, { recursive: true });
    fs.writeFileSync(opusFile(opus, key), text);
    return {
      from: 'raw',
      mp3Sha256: voice.clips[key]?.sha256,
      bytes: text.length,
      sha256: sha256(Buffer.from(text)),
    };
  };
  const manifest = clips =>
    fs.writeFileSync(opus.manifestFile, JSON.stringify({ bitrateKbps: OPUS_BITRATE_KBPS, clips }));

  afterAll(() => fs.rmSync(work, { recursive: true, force: true }));

  test('complet et intact : aucun écart', async () => {
    manifest({ a: write('a', 'AAA'), b: write('b', 'BBB') });
    expect(await opusProblems(voice)).toEqual([]);
  });

  test('fichier changé, clip jamais fait, fichier en trop : chacun est nommé', async () => {
    const a = write('a', 'AAA');
    manifest({ a });
    fs.writeFileSync(opusFile(opus, 'a'), 'autre contenu');
    fs.writeFileSync(path.join(opus.dir, 'zzz.ogg'), 'oublié');
    expect((await opusProblems(voice)).sort()).toEqual([
      'a (fichier absent ou changé)',
      'b (à refaire)',
      'zzz.ogg (en trop)',
    ]);
  });
});

function hasOpusEncoder() {
  try {
    return /libopus/.test(
      execFileSync('ffmpeg', ['-hide_banner', '-encoders'], { encoding: 'utf8' })
    );
  } catch {
    return false;
  }
}

const withFfmpeg = hasOpusEncoder() ? describe : describe.skip;

withFfmpeg('Encodage (ffmpeg avec libopus)', () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'leapmultix-opus-'));
  const raw = path.join(work, 'brut.wav');
  const mp3 = path.join(work, 'clip.mp3');
  const encoding = loadVoice('fr').encoding;
  const ffmpeg = args =>
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);

  beforeAll(() => {
    // Une « phrase » : 1,2 s de son entre deux silences, à 44,1 kHz comme un brut de Lucie
    ffmpeg([
      '-f',
      'lavfi',
      '-i',
      'sine=frequency=330:duration=1.2:sample_rate=44100',
      '-af',
      'adelay=400,apad=pad_dur=0.6',
      raw,
    ]);
    ffmpeg(['-i', raw, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k', mp3]);
  });
  afterAll(() => fs.rmSync(work, { recursive: true, force: true }));

  test('depuis le brut : Opus mono, silences coupés comme pour le MP3, bien plus léger', async () => {
    const out = path.join(work, 'clip.ogg');
    await processClipToOpus(raw, out, encoding, OPUS_BITRATE_KBPS);
    const info = await probeClip(out);
    expect(clipProblem(info, 'opus')).toBeNull();
    expect(clipProblem(info)).toBe('codec opus');
    // 1,2 s de son, plus les silences gardés (0,15 s avant, 0,08 s après)
    expect(info.duration).toBeGreaterThan(1.2);
    expect(info.duration).toBeLessThan(1.6);
    expect(fs.statSync(out).size).toBeLessThan(fs.statSync(mp3).size * 0.6);
    expect(fs.existsSync(`${out}.wav.part`)).toBe(false);
  }, 30000);

  test('le même brut redonne le même fichier, à l’octet', async () => {
    const [first, second] = [path.join(work, 'un.ogg'), path.join(work, 'deux.ogg')];
    await processClipToOpus(raw, first, encoding, OPUS_BITRATE_KBPS);
    await processClipToOpus(raw, second, encoding, OPUS_BITRATE_KBPS);
    expect(fs.readFileSync(first).equals(fs.readFileSync(second))).toBe(true);
  }, 30000);

  test('sans brut : le MP3 du clip est réencodé tel quel', async () => {
    const out = path.join(work, 'depuis-mp3.ogg');
    await transcodeToOpus(mp3, out, OPUS_BITRATE_KBPS);
    const [info, source] = [await probeClip(out), await probeClip(mp3)];
    expect(clipProblem(info, 'opus')).toBeNull();
    expect(Math.abs(info.duration - source.duration)).toBeLessThan(0.1);
  }, 30000);
});

describe('Ligne de commande', () => {
  test('--out est requis, une option inconnue est refusée', async () => {
    await expect(main([], { log: () => {} })).rejects.toThrow('--out');
    await expect(main(['--out', '/tmp', '--debit', '16'], { log: () => {} })).rejects.toThrow();
  });

  describe('pose dans un site (--site)', () => {
    const work = fs.mkdtempSync(path.join(os.tmpdir(), 'leapmultix-opus-site-'));
    const site = path.join(work, 'www');
    const opus = opusPaths(path.join(work, 'voix'), 'fr', 'lucie-v3-3');
    const voice = { lang: 'fr', version: 'lucie-v3-3', opus };
    const indexFile = path.join(site, 'voice', 'index.json');
    const english = { ...ENTRY, voice: 'sulafat', version: 'sulafat-v1-1' };
    const readIndex = () => JSON.parse(fs.readFileSync(indexFile, 'utf8'));

    beforeAll(() => {
      fs.mkdirSync(opus.dir, { recursive: true });
      fs.writeFileSync(opusFile(opus, 'abc'), 'OPUS');
      // Le site tel que « publish.mjs local » le laisse : le dossier de la version, en MP3
      fs.mkdirSync(path.join(site, 'voice', 'fr', 'lucie-v3-3'), { recursive: true });
      fs.writeFileSync(path.join(site, 'voice', 'fr', 'lucie-v3-3', 'abc.mp3'), 'MP3');
      fs.writeFileSync(
        indexFile,
        JSON.stringify({ schema: 'cyrb53-nfc-1', languages: { fr: ENTRY, en: english } })
      );
    });
    afterAll(() => fs.rmSync(work, { recursive: true, force: true }));

    test('une autre version que celle de l’index est refusée, le site reste en MP3', async () => {
      await expect(placeInSite(site, { ...voice, version: 'lucie-v9' })).rejects.toThrow(
        'publish.mjs local'
      );
      expect(readIndex().languages.fr.format).toBe('mp3');
      expect(fs.existsSync(path.join(site, 'voice', 'fr', 'lucie-v3-3', 'abc.mp3'))).toBe(true);
    });

    test('la version devient les clips en Opus, l’index le dit, l’autre langue ne bouge pas', async () => {
      await placeInSite(site, voice);
      const placed = path.join(site, 'voice', 'fr', 'lucie-v3-3');
      expect(fs.readdirSync(placed)).toEqual(['abc.ogg']);
      expect(fs.readFileSync(path.join(placed, 'abc.ogg'), 'utf8')).toBe('OPUS');
      const index = readIndex();
      expect(index.languages.fr).toEqual({ ...ENTRY, format: 'opus' });
      expect(index.languages.en).toEqual(english);
      // Le jeu lit cet index et y trouve l'adresse en .ogg
      const parsed = parseVoiceIndex(index);
      expect(clipPath('fr', parsed.languages.fr, 'abc')).toBe('fr/lucie-v3-3/abc.ogg');
      expect(clipPath('en', parsed.languages.en, 'abc')).toBe('en/sulafat-v1-1/abc.mp3');
    });
  });

  test('l’index d’un site posé en Opus reste lisible par le jeu', () => {
    const index = { schema: 'cyrb53-nfc-1', languages: { fr: { ...ENTRY, format: 'opus' } } };
    expect(parseVoiceIndex(index).languages.fr.format).toBe('opus');
  });
});

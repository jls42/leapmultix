/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Traitement des clips (scripts/voice/audio-process.mjs). Les tests qui appellent ffmpeg
 * ne tournent que là où il est installé (poste qui génère les voix) ; ailleurs ils sont
 * sautés, et seul le contrôle des caractéristiques d'un clip est vérifié.
 */
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  ClipContentError,
  clipProblem,
  detectSilences,
  processClip,
  probeClip,
  usefulRange,
} from '../../scripts/voice/audio-process.mjs';
import { loadVoice } from '../../scripts/voice/generate.mjs';

const ENCODING = loadVoice('fr').encoding;

function hasFfmpeg() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    execFileSync('ffprobe', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

describe('Caractéristiques d’un clip valide', () => {
  test.each([
    [{ codec: 'mp3', channels: 1, duration: 1.4 }, null],
    [{ codec: 'aac', channels: 1, duration: 1.4 }, 'codec aac'],
    [{ codec: 'mp3', channels: 2, duration: 1.4 }, '2 canaux'],
    [{ codec: 'mp3', channels: 1, duration: 0.1 }, 'trop court (0.1 s)'],
    [{ codec: 'mp3', channels: 1, duration: Number.NaN }, 'trop court (NaN s)'],
    [{ codec: 'mp3', channels: 1, duration: 45 }, 'trop long (45 s)'],
  ])('%j → %s', (info, problem) => {
    expect(clipProblem(info)).toBe(problem);
  });
});

describe('Partie utile : un clic isolé par un long silence part avec lui', () => {
  test.each([
    ['phrase seule', { duration: 2, silences: [] }, { start: 0, end: 2 }],
    [
      'clic final après 3 s de silence',
      { duration: 5.1, silences: [{ start: 1.9, end: 4.95 }] },
      { start: 0, end: 1.95 },
    ],
    [
      'clic initial avant la phrase',
      { duration: 4, silences: [{ start: 0.1, end: 2 }] },
      { start: 1.95, end: 4 },
    ],
    [
      'pause entre deux phrases : gardée',
      { duration: 5, silences: [{ start: 2, end: 3 }] },
      { start: 0, end: 5 },
    ],
    [
      'silence final sans clic : gardé',
      { duration: 3, silences: [{ start: 2, end: 3 }] },
      { start: 0, end: 2.05 },
    ],
  ])('%s', (_label, analysis, range) => {
    const result = usefulRange(analysis);
    expect(result.start).toBeCloseTo(range.start, 5);
    expect(result.end).toBeCloseTo(range.end, 5);
  });
});

(hasFfmpeg() ? describe : describe.skip)('Traitement par ffmpeg', () => {
  let dir;
  const file = name => path.join(dir, name);
  /** Brut simulé : silence, son, silence, en MP3 stéréo 128 kb/s comme ElevenLabs */
  const makeRaw = (name, source) =>
    execFileSync('ffmpeg', [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-f',
      'lavfi',
      '-i',
      source,
      '-ac',
      '2',
      '-ar',
      '44100',
      '-c:a',
      'libmp3lame',
      '-b:a',
      '128k',
      file(name),
    ]);
  // ebur128 écrit son rapport sur la sortie d'erreur
  const loudness = target => {
    const { stderr } = spawnSync(
      'ffmpeg',
      ['-hide_banner', '-nostats', '-i', target, '-af', 'ebur128=peak=true', '-f', 'null', '-'],
      { encoding: 'utf8' }
    );
    return Number([...stderr.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop()[1]);
  };

  beforeAll(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'voice-audio-'));
    makeRaw(
      'raw.mp3',
      'aevalsrc=if(between(t\\,0.5\\,1.5)\\,0.03*sin(2*PI*440*t)\\,0):s=44100:d=2'
    );
    makeRaw('silence.mp3', 'anullsrc=r=44100:cl=stereo:d=1');
    // Son d'1 s, 3 s de silence, puis un clic de 0,05 s : le piège vu dans les vrais bruts
    makeRaw(
      'click.mp3',
      'aevalsrc=if(lt(t\\,1)\\,0.03*sin(2*PI*440*t)\\,if(between(t\\,4\\,4.05)\\,0.2*sin(2*PI*2000*t)\\,0)):s=44100:d=4.1'
    );
    fs.writeFileSync(file('garbage.mp3'), 'pas un mp3');
  });

  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

  test('silences coupés, mono, MP3 au débit de la voix, sonie visée', async () => {
    await processClip(file('raw.mp3'), file('out.mp3'), ENCODING);
    const info = await probeClip(file('out.mp3'));
    expect(info.codec).toBe('mp3');
    expect(info.channels).toBe(1);
    expect(info.duration).toBeGreaterThan(0.85);
    expect(info.duration).toBeLessThan(1.25);
    expect(Math.abs(info.bitRate - ENCODING.bitrateKbps * 1000)).toBeLessThan(3000);
    expect(Math.abs(loudness(file('out.mp3')) - ENCODING.loudnessLufs)).toBeLessThan(1.5);
    expect(fs.readdirSync(dir).filter(name => name.endsWith('.part'))).toEqual([]);
  });

  test('même brut, même clip (traitement reproductible)', async () => {
    await processClip(file('raw.mp3'), file('a.mp3'), ENCODING);
    await processClip(file('raw.mp3'), file('b.mp3'), ENCODING);
    expect(fs.readFileSync(file('a.mp3')).equals(fs.readFileSync(file('b.mp3')))).toBe(true);
  });

  test('clic isolé après un long silence : coupé avec le silence', async () => {
    await processClip(file('click.mp3'), file('click-out.mp3'), ENCODING);
    const info = await probeClip(file('click-out.mp3'));
    expect(info.duration).toBeLessThan(1.3);
    expect((await detectSilences(file('click-out.mp3'))).silences).toEqual([]);
  });

  test('fichier illisible : erreur de contenu (le brut ne vaut rien)', async () => {
    await expect(probeClip(file('garbage.mp3'))).rejects.toBeInstanceOf(ClipContentError);
  });

  test('un brut muet est refusé, sans fichier temporaire', async () => {
    await expect(processClip(file('silence.mp3'), file('muet.mp3'), ENCODING)).rejects.toThrow();
    expect(fs.readdirSync(dir).filter(name => name.endsWith('.part'))).toEqual([]);
  });
});

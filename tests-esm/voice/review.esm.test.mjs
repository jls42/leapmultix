/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * voice:review (scripts/voice/review.mjs) : Whisper (ici un faux interpréteur), contrôle et
 * page d'écoute en une commande, avec ses fichiers de travail, ses codes de sortie, et les
 * refus clairs quand Whisper manque ou échoue.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { voiceKey } from '../../js/core/spoken-text.js';
import { loadVoice } from '../../scripts/voice/generate.mjs';
import { newManifest, sha256, storePaths, writeManifest } from '../../scripts/voice/clip-store.mjs';

const SCRIPT = path.resolve('scripts/voice/review.mjs');
const VOICE = loadVoice('en');
const RIGHT = 'Quiz Mode';
const WRONG = 'What is 7 times 8?';

/**
 * Faux Whisper : lit le manifeste, transcrit chaque clip par sa phrase, sauf WRONG entendu
 * « 7 times 6 » ; garde ses arguments ; sort avec FAKE_WHISPER_EXIT s'il est donné
 */
const FAKE_WHISPER = `#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
fs.writeFileSync(path.join(__dirname, 'args.json'), JSON.stringify(args));
if (process.env.FAKE_WHISPER_EXIT) process.exit(Number(process.env.FAKE_WHISPER_EXIT));
const value = flag => args[args.indexOf(flag) + 1];
const { clips } = JSON.parse(fs.readFileSync(value('--manifest'), 'utf8'));
const lines = Object.entries(clips).map(([key, entry]) => {
  const heard = entry.text === ${JSON.stringify(WRONG)} ? 'What is 7 times 6?' : entry.text;
  return JSON.stringify({ key, sha256: entry.sha256, heard });
});
fs.appendFileSync(value('--out'), lines.join('\\n') + '\\n');
`;

let work;
let outDir;
let paths;
let fake;

async function addClip(text) {
  const data = `mp3 ${text}`;
  await fsp.writeFile(path.join(paths.clipDir, `${voiceKey(text)}.mp3`), data);
  return [
    voiceKey(text),
    { text, said: text, duration: 1.2, bytes: data.length, sha256: sha256(data) },
  ];
}

const run = (args, env = {}) =>
  spawnSync(process.execPath, [SCRIPT, '--lang', 'en', '--out', outDir, ...args], {
    cwd: work,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
const pageFile = name => path.join(outDir, 'ecoute', name);

beforeEach(async () => {
  work = await fsp.mkdtemp(path.join(os.tmpdir(), 'voice-review-work-'));
  outDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'voice-review-store-'));
  paths = storePaths(outDir, 'en', VOICE.version);
  await fsp.mkdir(paths.clipDir, { recursive: true });
  const manifest = newManifest('en', VOICE);
  manifest.clips = Object.fromEntries([await addClip(RIGHT), await addClip(WRONG)]);
  await writeManifest(paths, manifest);
  fake = path.join(work, 'fake-python.cjs');
  fs.writeFileSync(fake, FAKE_WHISPER, { mode: 0o755 });
});

afterEach(async () => {
  await fsp.rm(work, { recursive: true, force: true });
  await fsp.rm(outDir, { recursive: true, force: true });
});

describe('voice:review', () => {
  test('Whisper, contrôle et page : ce qui est mal entendu est signalé et listé', () => {
    const result = run(['--python', fake, '--allow-missing']);
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Whisper : 2 transcrits, 1 à réécouter');
    const flagged = fs.readFileSync(path.join(work, 'a-reecouter-en.txt'), 'utf8');
    expect(flagged.trim()).toBe(voiceKey(WRONG));
    expect(fs.readFileSync(pageFile('en-jane-v1-1.html'), 'utf8')).toContain(voiceKey(WRONG));
    expect(result.stdout).toContain(`file://${pageFile('en-jane-v1-1.html')}`);
    // Whisper reçoit la langue, le manifeste, les clips et le fichier de transcriptions
    const args = JSON.parse(fs.readFileSync(path.join(work, 'args.json'), 'utf8'));
    expect(args.slice(1)).toEqual([
      '--manifest',
      paths.manifestFile,
      '--clips',
      paths.clipDir,
      '--lang',
      'en',
      '--out',
      path.join(work, 'transcripts-en.jsonl'),
    ]);
    expect(args[0]).toMatch(/scripts\/voice\/whisper_transcribe\.py$/);
  });

  test('phrases manquantes sans --allow-missing : code 1, comme voice:check', () => {
    const result = run(['--python', fake]);
    expect(result.status).toBe(1);
    expect(result.stdout).toMatch(/manquants : [1-9]\d*/);
  });

  test('rangement incohérent : code 1, même avec --allow-missing', async () => {
    await fsp.rm(path.join(paths.clipDir, `${voiceKey(RIGHT)}.mp3`));
    const result = run(['--python', fake, '--allow-missing']);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('entrées sans fichier : 1');
  });

  test('Whisper absent : arrêt, avec la commande d’installation', () => {
    const result = run(['--allow-missing']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Interpréteur de Whisper introuvable');
    expect(result.stderr).toContain('pip install -r scripts/voice/requirements-whisper.txt');
  });

  test('Whisper en échec : arrêt, avec son code', () => {
    const result = run(['--python', fake, '--allow-missing'], { FAKE_WHISPER_EXIT: '3' });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Whisper a échoué (code 3)');
  });

  test('--skip-whisper : les transcriptions déjà là servent, Whisper n’est pas lancé', () => {
    const [right, wrong] = [RIGHT, WRONG].map(text => ({
      key: voiceKey(text),
      sha256: sha256(`mp3 ${text}`),
      heard: text,
    }));
    fs.writeFileSync(
      path.join(work, 'transcripts-en.jsonl'),
      `${JSON.stringify(right)}\n${JSON.stringify(wrong)}\n`
    );
    const result = run([
      '--python',
      path.join(work, 'absent'),
      '--skip-whisper',
      '--allow-missing',
    ]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Whisper : 2 transcrits, 0 à réécouter');
    expect(fs.existsSync(path.join(work, 'args.json'))).toBe(false);
  });

  test('--compare : page avant/après des clips de la liste', () => {
    fs.writeFileSync(path.join(work, 'ecartes-en.txt'), `${voiceKey(WRONG)}\n`);
    const result = run(['--python', fake, '--allow-missing', '--compare', 'ecartes-en.txt']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Comparaison en jane-v1-1 : 1 clip refait');
    expect(fs.existsSync(pageFile('en-jane-v1-1-refaits.html'))).toBe(true);
  });
});

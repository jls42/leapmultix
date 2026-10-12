/**
 * @jest-environment node
 *
 * Environnement des programmes lancés par les scripts de la voix (scripts/voice/child-env.mjs,
 * Whisper, ffmpeg, ffprobe) : ce qu'il faut pour tourner, sur le GPU compris, jamais une clé
 * des fournisseurs ni un identifiant du poste.
 */
import { afterEach, expect, test } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { childEnv } from '../../scripts/voice/child-env.mjs';
import { probeClip } from '../../scripts/voice/audio-process.mjs';

const SECRETS = {
  ELEVENLABS_API_KEY: 'cle',
  GOOGLE_TTS_API_KEY: 'cle',
  MISTRAL_API_KEY: 'cle',
  AWS_ACCESS_KEY_ID: 'id',
  AWS_SECRET_ACCESS_KEY: 'secret',
  GITHUB_TOKEN: 'jeton',
  HF_TOKEN: 'jeton',
  CUDA_TOKEN: 'jeton',
  NPM_CONFIG_PASSWORD: 'mot de passe',
};

const NEEDED = {
  PATH: '/usr/bin',
  HOME: '/home/joueur',
  LANG: 'fr_FR.UTF-8',
  LC_ALL: 'fr_FR.UTF-8',
  TMPDIR: '/tmp',
  LD_LIBRARY_PATH: '/opt/cuda/lib64',
  CUDA_VISIBLE_DEVICES: '0',
  NVIDIA_VISIBLE_DEVICES: 'all',
  HF_HOME: '/home/joueur/.cache/huggingface',
  HF_HUB_OFFLINE: '1',
  CT2_VERBOSE: '1',
  OMP_NUM_THREADS: '4',
};

test('garde ce qu’il faut à Whisper et ffmpeg, GPU compris', () => {
  expect(childEnv({ ...NEEDED, ...SECRETS })).toEqual(NEEDED);
});

test('jamais un secret, ni une variable inconnue', () => {
  expect(
    childEnv({ ...SECRETS, NODE_OPTIONS: '--require x', PYTHONPATH: '/x', AUTRE: '1' })
  ).toEqual({});
});

const savedPath = process.env.PATH;
let bin;

afterEach(() => {
  process.env.PATH = savedPath;
  delete process.env.ELEVENLABS_API_KEY;
  if (bin) fs.rmSync(bin, { recursive: true, force: true });
});

test('ffprobe lancé avec l’environnement réduit (faux ffprobe qui le relève)', async () => {
  bin = fs.mkdtempSync(path.join(os.tmpdir(), 'faux-ffprobe-'));
  const seen = path.join(bin, 'env.txt');
  const json =
    '{"format":{"duration":"1.2","bit_rate":"64000"},"streams":[{"codec_name":"mp3","channels":1}]}';
  fs.writeFileSync(path.join(bin, 'ffprobe'), `#!/bin/sh\nenv > '${seen}'\necho '${json}'\n`, {
    mode: 0o755,
  });
  process.env.PATH = `${bin}${path.delimiter}${savedPath}`;
  process.env.ELEVENLABS_API_KEY = 'cle-elevenlabs';
  expect(await probeClip('clip.mp3')).toEqual({
    duration: 1.2,
    codec: 'mp3',
    channels: 1,
    bitRate: 64000,
  });
  const names = fs
    .readFileSync(seen, 'utf8')
    .split('\n')
    .map(line => line.split('=')[0]);
  expect(names).toContain('PATH');
  expect(names).not.toContain('ELEVENLABS_API_KEY');
});

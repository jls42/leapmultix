/**
 * @jest-environment node
 *
 * Entrées des scripts de la voix : chaque morceau d'un chemin du dépôt des voix est un nom sûr
 * (storePaths), et le brut reçu d'un fournisseur est lu par ffmpeg sous un format imposé, en
 * fichiers locaux seulement (scripts/voice/audio-process.mjs).
 */
import { describe, expect, test } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { storePaths } from '../../scripts/voice/clip-store.mjs';
import { inputArgs, rawFormat } from '../../scripts/voice/audio-process.mjs';

const AUDIO_PROCESS = path.resolve('scripts/voice/audio-process.mjs');
const GENERATE = path.resolve('scripts/voice/generate.mjs');

describe('Chemins du dépôt des voix', () => {
  test('langue et version de voix connues : les chemins habituels', () => {
    const paths = storePaths('/depot', 'fr', 'lucie-v3-2');
    expect(paths.clipDir).toBe(path.join('/depot', 'clips', 'fr', 'lucie-v3-2'));
    expect(paths.manifestFile).toBe(path.join('/depot', 'manifests', 'fr', 'lucie-v3-2.json'));
  });

  test.each([
    ['version', ['fr', '../../victime-a']],
    ['version', ['fr', 'a/b']],
    ['version', ['fr', '.cache']],
    ['version', ['fr', '']],
    ['langue', ['../x', 'lucie-v3-2']],
    ['langue', ['fra', 'lucie-v3-2']],
    ['dossier des bruts', ['fr', 'lucie-v3-2', '../ailleurs']],
  ])('%s refusée : %j', (label, [lang, version, rawKey]) => {
    expect(() => storePaths('/depot', lang, version, rawKey ?? version)).toThrow(label);
  });
});

describe('Entrées de ffmpeg', () => {
  test('fichiers locaux seulement, format imposé quand il est donné', () => {
    expect(inputArgs('a.wav')).toEqual(['-protocol_whitelist', 'file', '-i', 'a.wav']);
    expect(inputArgs('brut.mp3', 'mp3')).toEqual([
      '-protocol_whitelist',
      'file',
      '-f',
      'mp3',
      '-i',
      'brut.mp3',
    ]);
  });

  test('format du brut d’après son extension ; une autre extension est refusée', () => {
    expect(rawFormat('/d/abc-123.mp3')).toBe('mp3');
    expect(rawFormat('/d/abc-123.WAV')).toBe('wav');
    expect(() => rawFormat('/d/liste.m3u8')).toThrow('format inconnu');
  });

  test('le brut est décodé sous son format, jamais deviné (faux ffmpeg qui relève ses arguments)', () => {
    // Processus à part : execFile lit le PATH du vrai processus, pas la copie de Jest
    const bin = fs.mkdtempSync(path.join(os.tmpdir(), 'faux-ffmpeg-'));
    try {
      const seen = path.join(bin, 'args.txt');
      fs.writeFileSync(path.join(bin, 'ffmpeg'), `#!/bin/sh\necho "$@" >> '${seen}'\nexit 1\n`, {
        mode: 0o755,
      });
      const raw = path.join(bin, 'abc-123.mp3');
      fs.writeFileSync(raw, '#EXTM3U\n#EXTINF:1,\nfile:///etc/hostname\n');
      const runner = [
        `const { processClip } = await import(${JSON.stringify(AUDIO_PROCESS)});`,
        `const { loadVoice } = await import(${JSON.stringify(GENERATE)});`,
        `await processClip(${JSON.stringify(raw)}, ${JSON.stringify(path.join(bin, 'out.mp3'))},`,
        "  loadVoice('fr').encoding).catch(() => {});",
      ].join('\n');
      const result = spawnSync(process.execPath, ['--input-type=module', '-e', runner], {
        env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` },
        encoding: 'utf8',
      });
      expect(result.status).toBe(0);
      const firstCall = fs.readFileSync(seen, 'utf8').split('\n')[0];
      expect(firstCall).toContain(`-protocol_whitelist file -f mp3 -i ${raw}`);
    } finally {
      fs.rmSync(bin, { recursive: true, force: true });
    }
  });
});

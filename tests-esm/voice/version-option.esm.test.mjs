/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * --version : les outils de la voix visent une autre voix de la langue (alternatives.json)
 * au lieu de sa voix par défaut (voices.json). Une phrase changée demande un clip à chaque
 * voix proposée au joueur : chacune se génère et se contrôle comme la voix par défaut.
 * Lancés en ligne de commande, sans appel payant (génération en --dry-run).
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadVoiceVersion } from '../../scripts/voice/generate.mjs';
import { newManifest, storePaths, writeManifest } from '../../scripts/voice/clip-store.mjs';

const JANE = loadVoiceVersion('en', 'jane-v1-1');

let outDir;

const run = (script, args) =>
  spawnSync(
    process.execPath,
    [path.resolve('scripts/voice', script), '--lang', 'en', '--out', outDir, ...args],
    { encoding: 'utf8' }
  );

beforeEach(async () => {
  outDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'voice-version-'));
  const paths = storePaths(outDir, 'en', JANE.version);
  await fsp.mkdir(paths.clipDir, { recursive: true });
  await writeManifest(paths, newManifest('en', JANE));
});

afterEach(() => fsp.rm(outDir, { recursive: true, force: true }));

describe('--version : une autre voix de la langue', () => {
  test('generate : le bilan porte sur cette voix', () => {
    const result = run('generate.mjs', ['--version', JANE.version, '--dry-run']);
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`"version": "${JANE.version}"`);
  });

  test('check : le contrôle porte sur cette voix', () => {
    const result = run('check.mjs', ['--version', JANE.version, '--allow-missing']);
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(new RegExp(`^en ${JANE.version} : 0/\\d+ clips`));
  });

  test('listen-page : la page porte le nom de cette voix', () => {
    const result = run('listen-page.mjs', ['--version', JANE.version]);
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
    const page = path.join(outDir, 'ecoute', `en-${JANE.version}.html`);
    expect(fs.existsSync(page)).toBe(true);
    expect(result.stdout).toContain(pathToFileURL(page).href);
  });

  test.each([['generate.mjs', '--dry-run'], ['check.mjs'], ['listen-page.mjs']])(
    '%s : une version inconnue arrête tout, en le disant',
    (script, ...options) => {
      const result = run(script, ['--version', 'inconnue-v1', ...options]);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('Aucune voix « inconnue-v1 » pour « en »');
    }
  );
});

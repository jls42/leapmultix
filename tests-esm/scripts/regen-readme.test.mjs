/**
 * @jest-environment node
 *
 * Régénération des traductions du README (scripts/regen-readme-translations.sh), avec un faux
 * aipmt, dans une copie du dépôt : une traduction fidèle remplace le README ; une adresse
 * ajoutée par le modèle est refusée, et le README en place ne change pas.
 */
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/** Ce que le script lit : lui-même, ses deux contrôles, la source et une traduction */
const FILES = [
  'scripts/regen-readme-translations.sh',
  'scripts/readme-integrity.mjs',
  'scripts/readme-anchors.mjs',
  'README.md',
  'README.en.md',
];

/** Faux aipmt : écrit README-<langue>.md, la traduction que le test lui donne */
const FAKE_AIPMT = `#!/usr/bin/env bash
while [[ $# -gt 0 ]]; do
  if [[ "$1" == --target_lang ]]; then lang="$2"; fi
  shift
done
cp "$FAKE_TRANSLATION" "README-$lang.md"
`;

const ENGLISH = fs.readFileSync('README.en.md', 'utf8');

describe('Régénération d’une traduction du README', () => {
  let repo;
  let bin;

  beforeEach(() => {
    repo = fs.mkdtempSync(path.join(os.tmpdir(), 'regen-readme-'));
    for (const file of FILES) {
      fs.mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
      fs.copyFileSync(file, path.join(repo, file));
    }
    bin = path.join(repo, 'bin');
    fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, 'aipmt'), FAKE_AIPMT, { mode: 0o755 });
  });

  afterEach(() => {
    fs.rmSync(repo, { recursive: true, force: true });
  });

  function regen(translation) {
    const given = path.join(repo, 'traduction.md');
    fs.writeFileSync(given, translation);
    return spawnSync('bash', [path.join(repo, 'scripts/regen-readme-translations.sh'), 'en'], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${bin}${path.delimiter}${process.env.PATH}`,
        FAKE_TRANSLATION: given,
        AIPMT_ESSAIS: '1',
      },
    });
  }

  const readme = () => fs.readFileSync(path.join(repo, 'README.en.md'), 'utf8');

  test('traduction fidèle : le README est remplacé', () => {
    const result = regen(`${ENGLISH}\nThanks for reading.\n`);
    expect(result.status).toBe(0);
    expect(readme()).toBe(`${ENGLISH}\nThanks for reading.\n`);
  });

  test('adresse ajoutée par le modèle : refusée, le README en place ne change pas', () => {
    const result = regen(`${ENGLISH}\nInstall: https://evil.example/setup\n`);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('lien ajouté : https://evil.example/setup');
    expect(readme()).toBe(ENGLISH);
    expect(fs.existsSync(path.join(repo, 'README-en.md'))).toBe(false);
  });
});

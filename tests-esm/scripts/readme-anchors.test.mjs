/**
 * @jest-environment node
 *
 * Ancres internes des README (scripts/readme-anchors.mjs) : ancres calculées comme GitHub,
 * liens cassés repérés, liens d'une traduction réalignés sur les titres, et surtout les
 * README du dépôt, dont aucun lien de table des matières ne doit rester sans titre.
 */
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { alignLinks, brokenLinks, headingAnchors, slugify } from '../../scripts/readme-anchors.mjs';

const SCRIPT = path.resolve('scripts/readme-anchors.mjs');

describe('Ancre d’un titre, comme GitHub', () => {
  test.each([
    ['🌍 Localisation', '-localisation'],
    ['Table des matières', 'table-des-matières'],
    ["Les mini-jeux d'arcade", 'les-mini-jeux-darcade'],
    // Le sélecteur de variante invisible d'un émoji reste, comme sur GitHub
    ['🏗️ Architecture', '\uFE0F-architecture'],
    ['🔊 録音済み音声', '-録音済み音声'],
    ['🐛 समस्या की सूचना दें', '-समस्या-की-सूचना-दें'],
    ['Le `code` et [un lien](https://exemple.fr)', 'le-code-et-un-lien'],
  ])('%p → %p', (title, anchor) => {
    expect(slugify(title)).toBe(anchor);
  });

  test('doublons suffixés, commentaires des blocs de code ignorés', () => {
    const text = ['# Titre', '```bash', '# Pas un titre', '```', '## Titre', '### Titre'].join(
      '\n'
    );
    expect(headingAnchors(text)).toEqual(['titre', 'titre-1', 'titre-2']);
  });
});

describe('Liens cassés', () => {
  test('seuls les liens sans titre sont rendus ; une ancre encodée vaut la même', () => {
    const text = [
      '- [Voix](#-voix-enregistrée)',
      '- [Voix encodée](#-voix-enregistr%C3%A9e)',
      '- [Ailleurs](#-nulle-part)',
      '```',
      '[dans un bloc](#-ignore)',
      '```',
      '## 🔊 Voix enregistrée',
    ].join('\n');
    expect(brokenLinks(text)).toEqual(['-nulle-part']);
  });
});

describe('Réalignement d’une traduction', () => {
  const source = [
    '- [Voix](#-voix-enregistrée)',
    '- [Problème](#-signaler-un-problème)',
    '## 🔊 Voix enregistrée',
    '## 🐛 Signaler un problème',
  ].join('\n');

  test('le lien cassé vise le titre de même rang ; les liens justes ne bougent pas', () => {
    const translation = [
      '- [録音音声](#-録音音声)',
      '- [Report an issue](#-reporting-an-issue)',
      '## 🔊 録音済み音声',
      '## 🐛 Reporting an Issue',
    ].join('\n');
    const { text, fixed } = alignLinks(source, translation);
    expect(fixed).toBe(1);
    expect(text).toContain('- [録音音声](#-録音済み音声)');
    expect(text).toContain('- [Report an issue](#-reporting-an-issue)');
    expect(brokenLinks(text)).toEqual([]);
  });

  test('titres ou liens en nombre différent : refus', () => {
    expect(() => alignLinks(source, '- [A](#-a)\n## A')).toThrow(/Structure différente/);
  });
});

describe('Les README du dépôt', () => {
  const readmes = fs.readdirSync('.').filter(name => /^README(\.[a-z]{2})?\.md$/.test(name));

  test('quinze README, français et quatorze traductions', () => {
    expect(readmes).toHaveLength(15);
  });

  test('aucun lien interne sans titre', () => {
    const broken = readmes.flatMap(file =>
      brokenLinks(fs.readFileSync(file, 'utf8')).map(anchor => `${file} → #${anchor}`)
    );
    expect(broken).toEqual([]);
  });

  test('chaque traduction a les titres et les liens internes du français', () => {
    const source = fs.readFileSync('README.md', 'utf8');
    for (const file of readmes.filter(name => name !== 'README.md')) {
      expect(() => alignLinks(source, fs.readFileSync(file, 'utf8'))).not.toThrow();
    }
  });
});

describe('Commande', () => {
  let dir;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-anchors-'));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  const run = (...args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });

  test('--fix réécrit la traduction, puis le contrôle passe', () => {
    const source = path.join(dir, 'README.md');
    const target = path.join(dir, 'README.ja.md');
    fs.writeFileSync(source, '- [Voix](#-voix)\n## 🔊 Voix\n');
    fs.writeFileSync(target, '- [音声](#-音声)\n## 🔊 録音済み音声\n');
    expect(run(target).status).toBe(1);
    const fixed = run('--fix', source, target);
    expect(fixed.status).toBe(0);
    expect(fixed.stdout).toContain('1 lien(s) réaligné(s)');
    expect(fs.readFileSync(target, 'utf8')).toBe('- [音声](#-録音済み音声)\n## 🔊 録音済み音声\n');
    expect(run(source, target).status).toBe(0);
  });

  test('sans fichier, ou --fix sans ses deux fichiers : usage, code 1', () => {
    expect(run().status).toBe(1);
    expect(run('--fix', path.join(dir, 'README.md')).stderr).toContain('Usage');
  });
});

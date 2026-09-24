/**
 * @jest-environment node
 *
 * Scripts d'assets lancés pour de vrai, dans un projet jetable : un fichier
 * « victime » placé à côté du projet vérifie que rien ne sort de ses dossiers.
 */
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SCRIPTS = path.resolve(process.cwd(), 'scripts');
const KEPT = 'assets/images/garde.png';
const ORPHAN = 'assets/images/orphelin.png';

let sandbox;
let project;

function write(rel, content = '') {
  const file = path.join(project, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function exists(rel) {
  return fs.existsSync(path.join(project, rel));
}

function run(script, ...args) {
  return spawnSync(process.execPath, [path.join(SCRIPTS, script), ...args], {
    cwd: project,
    encoding: 'utf8',
  });
}

beforeEach(() => {
  sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'leapmultix-assets-'));
  project = path.join(sandbox, 'projet');
  write(KEPT);
  write(ORPHAN);
  write('index.html', `<img src="${KEPT}">`);
  write('docs/audit/assets-delete-list.txt', `${KEPT}\n${ORPHAN}\n`);
  write('analysis/runtime-assets.json', JSON.stringify([KEPT]));
  fs.writeFileSync(path.join(sandbox, 'victime.txt'), 'hors du projet');
});

afterEach(() => {
  fs.rmSync(sandbox, { recursive: true, force: true });
});

describe('cleanup-assets.cjs', () => {
  it('supprime les orphelins et garde les assets vus en jeu', () => {
    const result = run('cleanup-assets.cjs', '--confirm');
    expect(result.status).toBe(0);
    expect(exists(KEPT)).toBe(true);
    expect(exists(ORPHAN)).toBe(false);
  });

  it('ne supprime rien sans preuve runtime', () => {
    fs.rmSync(path.join(project, 'analysis/runtime-assets.json'));
    const result = run('cleanup-assets.cjs', '--confirm');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Preuve runtime introuvable');
    expect(exists(KEPT)).toBe(true);
    expect(exists(ORPHAN)).toBe(true);
  });

  it('ne supprime rien si la preuve runtime est illisible', () => {
    write('analysis/runtime-assets.json', '{pas du json');
    const result = run('cleanup-assets.cjs', '--confirm');
    expect(result.status).toBe(1);
    expect(exists(KEPT)).toBe(true);
    expect(exists(ORPHAN)).toBe(true);
  });

  it.each(['../victime.txt', 'assets/../../victime.txt', 'index.html'])(
    'refuse toute la liste si un candidat (%s) sort des dossiers d’assets',
    candidate => {
      write('docs/audit/assets-delete-list.txt', `${ORPHAN}\n${candidate}\n`);
      const result = run('cleanup-assets.cjs', '--confirm');
      expect(result.status).toBe(1);
      expect(fs.existsSync(path.join(sandbox, 'victime.txt'))).toBe(true);
      expect(exists('index.html')).toBe(true);
      expect(exists(ORPHAN)).toBe(true);
    }
  );

  it.each([
    ['une liste', ['--list', '../liste.txt', '--confirm']],
    ['une preuve runtime', ['../runtime.json', '--confirm']],
  ])('refuse %s située hors du projet', (_label, args) => {
    fs.writeFileSync(path.join(sandbox, 'liste.txt'), `${ORPHAN}\n`);
    fs.writeFileSync(path.join(sandbox, 'runtime.json'), '[]');
    const result = run('cleanup-assets.cjs', ...args);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Chemin refusé');
    expect(exists(ORPHAN)).toBe(true);
  });

  it('en simulation, ne supprime rien et signale les candidats', () => {
    const result = run('cleanup-assets.cjs');
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('Dry-run');
    expect(exists(ORPHAN)).toBe(true);
  });

  it('rejette un argument inconnu', () => {
    const result = run('cleanup-assets.cjs', '--force');
    expect(result.status).toBe(1);
    expect(exists(ORPHAN)).toBe(true);
  });

  it('ne recopie pas les chemins reçus dans ses journaux', () => {
    const result = run('cleanup-assets.cjs', 'analysis/runtime-assets.json');
    expect(result.stdout).toContain('Runtime proof: 1 items');
    expect(result.stdout).not.toContain('analysis/runtime-assets.json');
  });
});

describe('assets-diff.cjs', () => {
  const readDeleteList = () =>
    fs.readFileSync(path.join(project, 'docs/audit/assets-delete-list.txt'), 'utf8');

  it('sans preuve runtime, produit une analyse statique', () => {
    const result = run('assets-diff.cjs');
    expect(result.status).toBe(0);
    expect(readDeleteList()).toBe(ORPHAN);
  });

  it('retire de la liste les assets prouvés en jeu', () => {
    write('analysis/runtime-assets.json', JSON.stringify([ORPHAN]));
    const result = run('assets-diff.cjs', 'analysis/runtime-assets.json');
    expect(result.status).toBe(0);
    expect(readDeleteList()).toBe('');
  });

  it('refuse une preuve runtime située hors du projet', () => {
    fs.writeFileSync(path.join(sandbox, 'runtime.json'), '[]');
    const result = run('assets-diff.cjs', '../runtime.json');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Chemin refusé');
    expect(exists('docs/audit/assets-diff-report.json')).toBe(false);
  });

  it('s’arrête sur une preuve runtime absente au lieu de passer en statique', () => {
    const result = run('assets-diff.cjs', 'analysis/absente.json');
    expect(result.status).toBe(1);
    expect(exists('docs/audit/assets-diff-report.json')).toBe(false);
  });
});

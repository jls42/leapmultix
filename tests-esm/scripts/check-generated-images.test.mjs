/**
 * @jest-environment node
 *
 * Garde-fou des images générées (scripts/check-generated-images.sh), avant le déploiement :
 * la synchronisation S3 utilise --delete, donc une génération absente ou partielle est
 * refusée ; les images arrivent d'un autre job de la CI, donc tout ce qui n'est pas une image
 * générée, en fichier ordinaire, est refusé aussi.
 */
import { afterEach, beforeEach, expect, test } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SCRIPT = path.resolve('scripts/check-generated-images.sh');

let site;

function write(file, content = 'x') {
  fs.mkdirSync(path.dirname(path.join(site, file)), { recursive: true });
  fs.writeFileSync(path.join(site, file), content);
}

function check() {
  return spawnSync('bash', [SCRIPT], { cwd: site, encoding: 'utf8' });
}

beforeEach(() => {
  site = fs.mkdtempSync(path.join(os.tmpdir(), 'generated-images-'));
  write('assets/images/arcade/renard.png');
  write('img/fond.png');
  write('assets/generated-images/arcade/renard-128.webp');
  write('assets/generated-images/arcade/renard-128.png');
  write('assets/generated-images/image-map.json', '{}');
});

afterEach(() => {
  fs.rmSync(site, { recursive: true, force: true });
});

test('génération complète, rien que des images : accepté', () => {
  const result = check();
  expect(result.stdout).toContain('PNG sources : 2 — fichiers générés : 3');
  expect(result.status).toBe(0);
});

test('dossier absent : refusé', () => {
  fs.rmSync(path.join(site, 'assets/generated-images'), { recursive: true });
  const result = check();
  expect(result.stderr).toContain('absent, ou lien symbolique');
  expect(result.status).toBe(1);
});

test('dossier remplacé par un lien : refusé comme tel', () => {
  fs.renameSync(path.join(site, 'assets/generated-images'), path.join(site, 'ailleurs'));
  fs.symlinkSync(path.join(site, 'ailleurs'), path.join(site, 'assets/generated-images'));
  const result = check();
  expect(result.stderr).toContain('absent, ou lien symbolique');
  expect(result.status).toBe(1);
});

test('moins de fichiers générés que de PNG sources : refusé', () => {
  write('img/autre-fond.png');
  write('img/encore-un.png');
  const result = check();
  expect(result.stderr).toContain('Génération incomplète');
  expect(result.status).toBe(1);
});

test.each([
  'assets/generated-images/page.html',
  'assets/generated-images/arcade/script.js',
  'assets/generated-images/arcade/image-map.json',
])('%s : fichier inattendu, refusé', file => {
  write(file);
  const result = check();
  expect(result.stderr).toContain('Fichiers inattendus');
  expect(result.stderr).toContain(file);
  expect(result.status).toBe(1);
});

test('lien parmi les images, même nommé en .webp : refusé', () => {
  write('secret.txt', 'secret du poste');
  fs.symlinkSync(
    path.join(site, 'secret.txt'),
    path.join(site, 'assets/generated-images/arcade/lien.webp')
  );
  const result = check();
  expect(result.stderr).toContain('lien.webp');
  expect(result.status).toBe(1);
});

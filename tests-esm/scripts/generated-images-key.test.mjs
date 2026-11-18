/**
 * @jest-environment node
 *
 * Cache des images générées dans la CI (scripts/generated-images-key.sh, job « images » de
 * .github/workflows/ci.yml) : la clé couvre tout ce qui détermine les images, sinon une image
 * changée pourrait partir en ligne avec sa variante périmée.
 * - la liste GENERATOR_FILES du script est exactement le générateur et les modules du dépôt
 *   qu'il charge, de proche en proche ;
 * - la clé change avec un original, un fichier du générateur, la version de sharp ou de libvips,
 *   et pas sans eux ;
 * - le job reprend le cache sur la clé exacte seulement, ne régénère qu'en son absence, passe
 *   toujours le garde-fou, et n'enregistre le cache qu'après lui.
 */
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve('.');
const SCRIPT = path.join(ROOT, 'scripts/generated-images-key.sh');
const GENERATOR = 'scripts/generate-responsive-assets.cjs';

/** GENERATOR_FILES du script, dans l'ordre */
function keyedFiles() {
  const source = fs.readFileSync(SCRIPT, 'utf8');
  const block = /GENERATOR_FILES=\(([\s\S]*?)\)/.exec(source)[1];
  return block.split(/\s+/).filter(Boolean);
}

/** Fichiers du dépôt qu'un fichier charge : require('./…'), import … from './…', import('./…'), path.resolve(__dirname, '…') */
function localDependencies(file) {
  const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const dir = path.dirname(file);
  const found = [];
  const relative = /(?:require\(|from\s+|import\()\s*'(\.{1,2}\/[^']+)'/g;
  for (const match of source.matchAll(relative)) found.push(path.join(dir, match[1]));
  const resolved = /path\.resolve\(__dirname,\s*'(\.{1,2}\/[^']+)'\)/g;
  for (const match of source.matchAll(resolved)) {
    const target = path.join(dir, match[1]);
    if (/\.(?:c?js|mjs)$/.test(target)) found.push(target);
  }
  return found.map(target => path.normalize(target));
}

function closure(start) {
  const seen = new Set();
  const queue = [start];
  while (queue.length) {
    const file = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);
    queue.push(...localDependencies(file));
  }
  return seen;
}

describe('clé du cache des images générées', () => {
  test('elle couvre le générateur et tous les modules du dépôt qu’il charge', () => {
    expect(new Set(keyedFiles())).toEqual(closure(GENERATOR));
  });

  describe('sur un dépôt d’essai', () => {
    let tmp;
    const key = () => execFileSync('bash', [SCRIPT], { cwd: tmp, encoding: 'utf8' }).trim();
    const write = (file, content) => {
      fs.mkdirSync(path.dirname(path.join(tmp, file)), { recursive: true });
      fs.writeFileSync(path.join(tmp, file), content);
    };
    const lock = sharp =>
      JSON.stringify({
        packages: {
          'node_modules/sharp': { version: sharp },
          'node_modules/@img/sharp-libvips-linux-x64': { version: '1.3.4' },
          'node_modules/jest': { version: '30.0.0' },
        },
      });

    beforeEach(() => {
      tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'images-key-'));
      for (const file of keyedFiles()) write(file, `// ${file}\n`);
      write('assets/images/arcade/renard.png', 'renard');
      write('package-lock.json', lock('0.35.5'));
    });

    afterEach(() => {
      fs.rmSync(tmp, { recursive: true, force: true });
    });

    test('stable tant que rien ne change, avec son préfixe de version', () => {
      expect(key()).toMatch(/^generated-images-v1-[0-9a-f]{40}$/);
      expect(key()).toBe(key());
    });

    test.each([
      ['un original modifié', () => write('assets/images/arcade/renard.png', 'renard costumé')],
      ['un original ajouté', () => write('assets/images/arcade/panda.png', 'panda')],
      [
        'un original renommé',
        () => {
          fs.renameSync(
            path.join(tmp, 'assets/images/arcade/renard.png'),
            path.join(tmp, 'assets/images/arcade/renard2.png')
          );
        },
      ],
      ['le générateur', () => write(GENERATOR, '// réglages WebP changés\n')],
      ['le catalogue des sprites', () => write('js/arcade-sprite-catalog.js', '// fête ajoutée\n')],
      ['la version de sharp', () => write('package-lock.json', lock('0.36.0'))],
    ])('elle change avec %s', (_label, change) => {
      const before = key();
      change();
      expect(key()).not.toBe(before);
    });

    test('une autre dépendance du verrou ne la change pas', () => {
      const before = key();
      const other = JSON.parse(fs.readFileSync(path.join(tmp, 'package-lock.json'), 'utf8'));
      other.packages['node_modules/jest'].version = '31.0.0';
      write('package-lock.json', JSON.stringify(other));
      expect(key()).toBe(before);
    });
  });
});

describe('job « images » de la CI', () => {
  const workflow = fs.readFileSync(path.join(ROOT, '.github/workflows/ci.yml'), 'utf8');
  const job = workflow.slice(workflow.indexOf('\n  images:'), workflow.indexOf('\n  deploy:'));
  const step = name => {
    const start = job.indexOf(`- name: ${name}`);
    expect(start).toBeGreaterThan(-1);
    const next = job.indexOf('\n      - name:', start + 1);
    return job.slice(start, next === -1 ? undefined : next);
  };

  test('la clé vient du script, et le cache se reprend sur la clé exacte seulement', () => {
    expect(step('Clé du cache des images')).toContain('bash scripts/generated-images-key.sh');
    const restore = step('Images du cache');
    expect(restore).toMatch(/uses: actions\/cache\/restore@[0-9a-f]{40}/);
    expect(restore).toContain('key: ${{ steps.cle.outputs.cle }}');
    expect(restore).not.toContain('restore-keys');
  });

  test('génération seulement sans cache ; garde-fou toujours ; cache enregistré après lui', () => {
    const miss = "if: steps.cache.outputs.cache-hit != 'true'";
    expect(step('Génération des images responsives')).toContain(miss);
    expect(step('Garde-fou avant l')).not.toContain('if:');
    const save = step('Images mises en cache');
    expect(save).toContain(miss);
    expect(save).toMatch(/uses: actions\/cache\/save@[0-9a-f]{40}/);
    expect(job.indexOf('- name: Garde-fou avant l')).toBeLessThan(
      job.indexOf('- name: Images mises en cache')
    );
  });
});

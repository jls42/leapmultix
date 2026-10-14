/**
 * @jest-environment node
 *
 * npm de la CI : package-lock.json est écrit par le npm du poste et de Dependabot (npm 11). Le
 * npm 10 livré avec Node 22 le refuse dès qu'une dépendance pair optionnelle ne s'accorde pas
 * (Lighthouse 13 : « Missing: proxy-agent@8.0.2 from lock file »). Chaque job qui installe les
 * dépendances installe donc d'abord ce npm, en version exacte, la même partout.
 */
import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';

const WORKFLOW = '.github/workflows/ci.yml';

/** npm installé en version exacte (x.y.z) */
const SETUP_NPM = /\bnpm install --global (?:--[\w-]+ )*npm@(\d+\.\d+\.\d+)\s*$/;
const NPM_CI = /\bnpm ci\b/;

/** Jobs du workflow, chacun avec ses lignes de commande (commentaires écartés) */
function jobs(text) {
  const lines = text.split('\n');
  const found = [];
  for (const line of lines.slice(lines.indexOf('jobs:') + 1)) {
    const header = /^ {2}([\w-]+):\s*$/.exec(line);
    if (header) found.push({ name: header[1], lines: [] });
    else if (!line.trim().startsWith('#')) found.at(-1)?.lines.push(line);
  }
  return found;
}

const installing = jobs(fs.readFileSync(WORKFLOW, 'utf8')).filter(job =>
  job.lines.some(line => NPM_CI.test(line))
);

describe('npm de la CI', () => {
  test('les jobs qui installent les dépendances sont bien lus', () => {
    expect(installing.map(job => job.name)).toEqual(['verify', 'seo-report', 'images']);
  });

  test.each(installing.map(job => [job.name, job]))(
    '%s installe un npm de version exacte avant npm ci',
    (_name, job) => {
      const setup = job.lines.findIndex(line => SETUP_NPM.test(line));
      expect(setup).toBeGreaterThanOrEqual(0);
      expect(setup).toBeLessThan(job.lines.findIndex(line => NPM_CI.test(line)));
    }
  );

  test('le même npm dans tous les jobs', () => {
    const versions = installing.flatMap(job =>
      job.lines.map(line => SETUP_NPM.exec(line)?.[1]).filter(Boolean)
    );
    expect(versions).toHaveLength(installing.length);
    expect(new Set(versions).size).toBe(1);
  });
});

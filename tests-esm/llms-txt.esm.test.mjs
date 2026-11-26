/**
 * @jest-environment node
 *
 * llms.txt : la présentation du site pour les assistants et les outils qui le lisent. Le
 * fichier suit la forme attendue (un titre, un résumé, des liens), ne cite que des pages qui
 * existent, et part en ligne avec le reste du site.
 */
import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';

const SITE = 'https://leapmultix.jls42.org/';
const read = file => fs.readFileSync(file, 'utf8');
const text = read('llms.txt');
const links = [...text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(match => match[2]);

describe('llms.txt', () => {
  test('un titre en première ligne, un résumé en citation, des liens', () => {
    const [first] = text.split('\n');
    expect(first).toBe('# LeapMultix');
    expect(text).toMatch(/^> .{40,}/m);
    expect(links.length).toBeGreaterThanOrEqual(4);
    expect(text.length).toBeGreaterThan(50);
  });

  test('chaque lien mène à une page du site qui existe, ou au code source', () => {
    for (const link of links) {
      if (link.startsWith(SITE)) {
        const page = link.slice(SITE.length) || 'index.html';
        expect(fs.existsSync(page)).toBe(true);
      } else {
        expect(link).toBe('https://github.com/jls42/leapmultix');
      }
    }
  });

  test('publié avec le site : envoyé par le déploiement, servi par le serveur local', () => {
    expect(read('deploy.sh')).toContain("--include='llms.txt'");
    expect(read('scripts/lib/site-server.cjs')).toContain("'llms.txt'");
  });

  test('le service worker ne le garde pas : toujours lu en ligne', () => {
    expect(read('sw.js')).not.toMatch(/'\/llms\.txt'/);
  });
});

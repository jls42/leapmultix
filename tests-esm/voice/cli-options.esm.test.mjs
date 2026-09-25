/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Options de la ligne de commande des scripts de la voix (scripts/voice/cli-options.mjs) :
 * lecture stricte, une option inconnue, une valeur manquante ou un nombre mal écrit
 * arrêtent tout, jamais d'option ignorée ni de NaN en silence.
 */
import { describe, test, expect } from '@jest/globals';
import path from 'node:path';
import {
  assertLangCode,
  flagOption,
  integerOption,
  parseOptions,
  pathOption,
  valueOption,
  wholeNumber,
} from '../../scripts/voice/cli-options.mjs';

const TABLE = {
  '--dry-run': flagOption('dryRun'),
  '--lang': valueOption('lang'),
  '--out': pathOption('out'),
  '--limit': integerOption('limit'),
  '--concurrency': integerOption('concurrency', 1),
};
const parse = argv => parseOptions(argv, TABLE, { concurrency: 4, dryRun: false });

describe('Lecture des options', () => {
  test('chaque option range sa valeur sous sa clé, les défauts restent sinon', () => {
    expect(parse(['--lang', 'fr', '--dry-run', '--limit', '0', '--out', 'voix'])).toEqual({
      lang: 'fr',
      dryRun: true,
      limit: 0,
      out: path.resolve('voix'),
      concurrency: 4,
    });
    expect(parse([])).toEqual({ concurrency: 4, dryRun: false });
  });

  test('une option donnée deux fois garde sa dernière valeur ; les défauts ne bougent pas', () => {
    const defaults = { concurrency: 4 };
    const args = parseOptions(['--concurrency', '2', '--concurrency', '8'], TABLE, defaults);
    expect(args.concurrency).toBe(8);
    expect(defaults).toEqual({ concurrency: 4 });
  });

  test.each([
    [['--vite'], 'Option inconnue : --vite'],
    [['--lang', 'fr', 'index'], 'Option inconnue : index'],
    [['-l', 'fr'], 'Option inconnue : -l'],
    [['constructor'], 'Option inconnue : constructor'],
    [['__proto__'], 'Option inconnue : __proto__'],
    [['toString', '5'], 'Option inconnue : toString'],
  ])('%j : option inconnue, refusée', (argv, message) => {
    expect(() => parse(argv)).toThrow(message);
  });

  test.each([[['--lang']], [['--lang', '--dry-run']], [['--out']], [['--out', '--lang', 'fr']]])(
    '%j : valeur manquante, refusée',
    argv => {
      expect(() => parse(argv)).toThrow(/^Valeur manquante : --(lang|out)$/);
    }
  );

  test.each([
    ['10k'],
    ['5 000'],
    ['1.5'],
    ['-1'],
    [' 5'],
    [''],
    ['1e3'],
    ['0x10'],
    ['Infinity'],
    ['--dry-run'],
  ])('--limit %p : refusé, jamais un NaN ni un nombre approché', value => {
    expect(() => parse(['--limit', value])).toThrow(
      `--limit attend un entier ≥ 0 (reçu : ${value})`
    );
  });

  test('entier absent ou sous le minimum : refusé en le disant', () => {
    expect(() => parse(['--limit'])).toThrow('--limit attend un entier ≥ 0 (reçu : rien)');
    expect(() => parse(['--concurrency', '0'])).toThrow(
      '--concurrency attend un entier ≥ 1 (reçu : 0)'
    );
  });
});

describe('Valeurs vérifiées', () => {
  test('entier strict : chiffres seulement, au moins le minimum', () => {
    expect(wholeNumber('0', '--n')).toBe(0);
    expect(wholeNumber('0042', '--n', 1)).toBe(42);
    expect(wholeNumber(16, '--n', 1)).toBe(16);
    for (const value of [undefined, null, 1.5, -1, NaN, '7 ', '+7']) {
      expect(() => wholeNumber(value, '--n')).toThrow(/--n attend un entier ≥ 0/);
    }
  });

  test('code de langue : deux lettres minuscules', () => {
    expect(() => assertLangCode('fr')).not.toThrow();
    for (const lang of [undefined, '', 'FR', 'fra', 'f', 'fr-FR', '../fr']) {
      expect(() => assertLangCode(lang)).toThrow('--lang attend un code (fr, en, es)');
    }
  });
});

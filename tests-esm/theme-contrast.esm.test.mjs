/**
 * Contraste WCAG 2.1 AA de chaque thème de couleur (css/themes.css), fêtes comprises : les
 * jetons OKLCH sont convertis en sRGB (conversion de Björn Ottosson, l'auteur d'OKLab), puis
 * comparés deux à deux. Texte : 4,5:1 ; anneau de focus, contours et touches : 3:1.
 * Un thème de fête (Halloween, Noël…) ne passe en prod qu'avec ce test au vert.
 */
import { describe, test, expect } from '@jest/globals';
import fs from 'node:fs';

const SHEET = fs.readFileSync('css/themes.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

/** Jetons de chaque sélecteur, dans l'ordre de la feuille (un bloc partagé compte pour chacun) */
function tokensBySelector() {
  const bySelector = new Map();
  for (const [, selectors, body] of SHEET.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const tokens = [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [
      name,
      value.trim(),
    ]);
    for (const selector of selectors.split(',').map(part => part.trim())) {
      bySelector.set(selector, new Map([...(bySelector.get(selector) ?? []), ...tokens]));
    }
  }
  return bySelector;
}

const BY_SELECTOR = tokensBySelector();
const ROOT = BY_SELECTOR.get(':root');
const THEME_NAMES = [...BY_SELECTOR.keys()]
  .map(selector => /^\.theme-([\w-]+)$/.exec(selector)?.at(1))
  .filter(Boolean);
const THEMES = [
  ['default', ROOT],
  ...THEME_NAMES.map(name => [name, new Map([...ROOT, ...BY_SELECTOR.get(`.theme-${name}`)])]),
];

/** Composantes sRGB linéaires (0 à 1) d'un oklch(L% C Hdeg) ; null pour une autre écriture */
function linearRgb(value) {
  const match = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)deg/.exec(value ?? '');
  if (!match) return null;
  const [lightness, chroma, hue] = match.slice(1).map(Number);
  const angle = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(angle);
  const b = chroma * Math.sin(angle);
  const l = (lightness / 100 + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness / 100 - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness / 100 - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(channel => Math.min(1, Math.max(0, channel)));
}

const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Rapport de contraste WCAG de deux couleurs sRGB linéaires */
function contrast(first, second) {
  const [light, dark] = [luminance(first), luminance(second)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const MODES = ['discovery', 'quiz', 'challenge', 'adventure', 'arcade', 'chrono'];
const TEXT_PAIRS = [
  ['--color-ink', '--color-page'],
  ['--color-ink', '--color-surface'],
  ['--color-ink', '--color-surface-sunken'],
  ['--color-ink-muted', '--color-page'],
  ['--color-ink-muted', '--color-surface'],
  ['--color-ink-muted', '--color-surface-sunken'],
  ['--color-ink-heading', '--color-page'],
  ['--color-ink-heading', '--color-surface'],
  ['--color-action-ink', '--color-surface'],
  ['--color-action-ink', '--color-action-tint'],
  ['--color-on-action', '--color-action'],
  ['--color-on-action', '--color-action-hover'],
  ['--color-success-ink', '--color-success-tint'],
  ['--color-danger-ink', '--color-danger-tint'],
  ['--color-warning-ink', '--color-warning-tint'],
  ...MODES.flatMap(mode => [
    [`--mode-${mode}`, `--mode-${mode}-tint`],
    [`--mode-${mode}`, '--color-surface'],
  ]),
];
const UI_PAIRS = [
  ['--color-focus', '--color-page'],
  ['--color-focus', '--color-surface'],
  ['--color-border-strong', '--color-surface'],
  // Pastille de l'interrupteur « Mode sombre » éteint, sur son rail
  ['--color-border-strong', '--color-surface-sunken'],
  ['--color-action', '--color-surface'],
];

/** Paires d'un thème sous leur minimum : « encre / page : 3.10 < 4.5 » */
function failures(tokens, pairs, minimum) {
  return pairs
    .map(([ink, ground]) => [
      ink,
      ground,
      linearRgb(tokens.get(ink)),
      linearRgb(tokens.get(ground)),
    ])
    .filter(([, , inkRgb, groundRgb]) => inkRgb && groundRgb)
    .map(([ink, ground, inkRgb, groundRgb]) => [ink, ground, contrast(inkRgb, groundRgb)])
    .filter(([, , ratio]) => ratio < minimum)
    .map(([ink, ground, ratio]) => `${ink} / ${ground} : ${ratio.toFixed(2)} < ${minimum}`);
}

describe('Contraste des thèmes de couleur (WCAG 2.1 AA)', () => {
  test('les thèmes de la feuille sont tous lus, fêtes comprises', () => {
    expect(THEME_NAMES).toEqual(
      expect.arrayContaining([
        'blue',
        'dark',
        'sky',
        'moss',
        'ember',
        'pumpkin',
        'halloween',
        'snow',
        'christmas',
      ])
    );
  });

  test('la conversion OKLCH rend le blanc, le noir et leur contraste de 21:1', () => {
    const white = linearRgb('oklch(100% 0 0deg)');
    const black = linearRgb('oklch(0% 0 0deg)');
    expect(contrast(white, black)).toBeCloseTo(21, 1);
  });

  test.each(THEMES)('%s : texte à 4,5:1, focus et contours à 3:1', (_name, tokens) => {
    expect([...failures(tokens, TEXT_PAIRS, 4.5), ...failures(tokens, UI_PAIRS, 3)]).toEqual([]);
  });
});

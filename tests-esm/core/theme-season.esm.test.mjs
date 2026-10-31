/**
 * Thème de fête (js/core/theme.js) : appliqué par défaut pendant la fête, à la clarté du thème
 * ordinaire de l'enfant ; un thème ordinaire choisi pendant la fête la retire jusqu'à la
 * suivante ; le thème ordinaire n'est jamais réécrit ; le costume des images suit. Chaque test
 * donne sa date (horloge simulée) : aucun ne dépend du jour où il tourne.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'node:fs';

const { SEASONS, wearSeason, wornSeason } = await import('../../js/core/seasons.js');
const { eventBus } = await import('../../js/core/eventBus.js');
const {
  applyColorTheme,
  appliedColorTheme,
  counterpartTheme,
  effectiveColorTheme,
  initThemes,
  isDarkTheme,
  rememberColorTheme,
  toggleColorMode,
} = await import('../../js/core/theme.js');
const { Customization } = await import('../../js/components/customization.js');

const HALLOWEEN = SEASONS.find(season => season.id === 'halloween');
const IN_2026 = new Date(2026, 9, 31, 12);
const IN_2027 = new Date(2027, 9, 31, 12);
const AFTER = new Date(2026, 10, 2, 12);

const SELECTOR = `
  <button type="button" id="theme-mode-switch" class="theme-mode-switch" data-theme-mode-switch role="switch"
    aria-checked="false">Mode sombre</button>
  <div class="color-theme-selector">
    <button class="color-theme-btn" data-color-theme="pumpkin" hidden>Citrouille</button>
    <button class="color-theme-btn" data-color-theme="halloween" hidden>Nuit d’Halloween</button>
    <button class="color-theme-btn" data-color-theme="default">Classique</button>
    <button class="color-theme-btn" data-color-theme="dark">Nuit</button>
    <button class="color-theme-btn" data-color-theme="green">Nature</button>
    <button class="color-theme-btn" data-color-theme="moss">Forêt</button>
  </div>
  <img id="head" alt="" sizes="56px"
    srcset="assets/generated-images/arcade/fox_head_avatar-128.webp 128w"
    src="assets/generated-images/arcade/fox_head_avatar-128.webp"
    data-fallback="assets/images/arcade/fox_head_avatar_128x128.png" />
  <button type="button" class="mode-btn" data-mode="challenge">
    <span class="mode-icon">
      <img id="logo" alt="" sizes="120px"
        srcset="assets/generated-images/arcade/logo_mode_defi-256.webp 256w"
        src="assets/generated-images/arcade/logo_mode_defi-256.webp" />
    </span>
  </button>
`;

const pressed = () =>
  [...document.querySelectorAll('.color-theme-btn')]
    .filter(btn => btn.getAttribute('aria-pressed') === 'true')
    .map(btn => btn.dataset.colorTheme);
const visible = () =>
  [...document.querySelectorAll('.color-theme-btn')]
    .filter(btn => !btn.hidden)
    .map(btn => btn.dataset.colorTheme);
const switchChecked = () =>
  document.getElementById('theme-mode-switch').getAttribute('aria-checked');
const head = () => document.getElementById('head');
const logo = () => document.getElementById('logo');

beforeEach(() => {
  localStorage.clear();
  document.body.className = '';
  const parsed = new DOMParser().parseFromString(SELECTOR, 'text/html');
  document.body.replaceChildren(...parsed.body.childNodes);
});

afterEach(() => {
  jest.useRealTimers();
  wearSeason(null);
  localStorage.clear();
  document.body.replaceChildren();
  document.body.className = '';
});

describe('Thème affiché pendant la fête', () => {
  test('hors fête : le thème ordinaire, tel quel', () => {
    localStorage.setItem('colorTheme', 'dark');
    expect(effectiveColorTheme(null, AFTER)).toBe('dark');
  });

  test.each([
    ['default', 'pumpkin'],
    ['green', 'pumpkin'],
    ['orange', 'pumpkin'],
    ['sky', 'pumpkin'],
    ['blue', 'halloween'],
    ['dark', 'halloween'],
    ['moss', 'halloween'],
    ['ember', 'halloween'],
  ])('par défaut, le thème %s devient %s (même clarté)', (ordinary, festive) => {
    localStorage.setItem('colorTheme', ordinary);
    expect(effectiveColorTheme(HALLOWEEN, IN_2026)).toBe(festive);
  });

  test('sans thème enregistré, Citrouille', () => {
    expect(effectiveColorTheme(HALLOWEEN, IN_2026)).toBe('pumpkin');
  });

  test('un thème de fête choisi reste choisi, sans toucher au thème ordinaire', () => {
    localStorage.setItem('colorTheme', 'green');
    rememberColorTheme('halloween', HALLOWEEN, IN_2026);
    expect(localStorage.getItem('colorTheme')).toBe('green');
    expect(effectiveColorTheme(HALLOWEEN, IN_2026)).toBe('halloween');
    expect(effectiveColorTheme(null, AFTER)).toBe('green');
  });

  test('un thème ordinaire choisi pendant la fête la retire, pour cette année seulement', () => {
    rememberColorTheme('dark', HALLOWEEN, IN_2026);
    expect(localStorage.getItem('colorTheme')).toBe('dark');
    expect(effectiveColorTheme(HALLOWEEN, IN_2026)).toBe('dark');
    expect(effectiveColorTheme(HALLOWEEN, IN_2027)).toBe('halloween');
  });

  test('hors fête, un thème de fête ne s’enregistre pas comme thème ordinaire', () => {
    localStorage.setItem('colorTheme', 'blue');
    rememberColorTheme('pumpkin', null, AFTER);
    expect(localStorage.getItem('colorTheme')).toBe('blue');
    expect(localStorage.getItem('seasonChoice')).toBeNull();
  });
});

describe('Application du thème et costume des images', () => {
  test('un thème de fête : sa classe, ses boutons visibles et pressés, les têtes costumées', () => {
    applyColorTheme('pumpkin', HALLOWEEN);
    expect(document.body.classList.contains('theme-pumpkin')).toBe(true);
    expect(visible()).toEqual(['pumpkin', 'default', 'green']);
    expect(pressed()).toEqual(['pumpkin']);
    expect(wornSeason()).toBe(HALLOWEEN);
    expect(head().getAttribute('src')).toContain('fox_halloween_head_avatar-128.webp');
    // Le repli reste la tête classique, gardée hors ligne
    expect(head().dataset.fallback).toBe('assets/images/arcade/fox_head_avatar_128x128.png');
    expect(head().getAttribute('sizes')).toBe('56px');
    // Logo du mode costumé, à la taille que lui donne l'accueil
    expect(logo().getAttribute('src')).toBe(
      'assets/generated-images/arcade/logo_mode_defi_halloween-256.webp'
    );
    expect(logo().getAttribute('srcset')).toContain('logo_mode_defi_halloween-512.webp 512w');
    expect(logo().getAttribute('sizes')).toBe('120px');
  });

  test('un thème ordinaire pendant la fête : boutons de fête visibles, rien de costumé', () => {
    applyColorTheme('pumpkin', HALLOWEEN);
    applyColorTheme('dark', HALLOWEEN);
    expect(document.body.classList.contains('theme-pumpkin')).toBe(false);
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(visible()).toEqual(['halloween', 'dark', 'moss']);
    expect(wornSeason()).toBeNull();
    expect(head().getAttribute('src')).toContain('/fox_head_avatar-128.webp');
    expect(logo().getAttribute('src')).toBe(
      'assets/generated-images/arcade/logo_mode_defi-256.webp'
    );
  });

  test('hors fête : boutons de fête cachés', () => {
    applyColorTheme('default', null);
    expect(visible()).toEqual(['default', 'green']);
    expect(document.body.className).toBe('');
  });

  test('initThemes pendant la fête : Nuit d’Halloween pour un joueur du thème Nuit', () => {
    jest.useFakeTimers({ now: IN_2026 });
    localStorage.setItem('colorTheme', 'dark');
    initThemes();
    expect(document.body.classList.contains('theme-halloween')).toBe(true);
    expect(pressed()).toEqual(['halloween']);
    expect(head().getAttribute('src')).toContain('fox_halloween_head_avatar');
  });

  test('hors fête, les flèches sautent les boutons cachés (fête, autre clarté)', () => {
    applyColorTheme('default', null);
    const selector = document.querySelector('.color-theme-selector');
    Customization._bindArrowKeys(selector, '.color-theme-btn');
    const classic = document.querySelector('[data-color-theme="default"]');
    classic.focus();
    classic.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement?.dataset.colorTheme).toBe('green');
    document.activeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(document.activeElement?.dataset.colorTheme).toBe('default');
  });

  test('initThemes le 2 novembre : le thème ordinaire revient, sans rien avoir défait', () => {
    jest.useFakeTimers({ now: IN_2026 });
    localStorage.setItem('colorTheme', 'dark');
    initThemes();
    jest.setSystemTime(AFTER);
    initThemes();
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(document.body.classList.contains('theme-halloween')).toBe(false);
    expect(visible()).toEqual(['dark', 'moss']);
    expect(head().getAttribute('src')).toContain('/fox_head_avatar-128.webp');
  });
});

describe('Bascule clair / sombre', () => {
  const INDEX = fs.readFileSync('index.html', 'utf8');
  const BUTTON_THEMES = [...INDEX.matchAll(/data-color-theme="([\w-]+)"/g)].map(([, id]) => id);
  const SHEET = fs.readFileSync('css/themes.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const DARK_BLOCK = [...SHEET.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, , body]) => body.includes('color-scheme: dark'))
    .flatMap(([, selectors]) => selectors.split(',').map(part => part.trim()));

  test.each(BUTTON_THEMES)('%s : un seul contraire, de l’autre clarté, qui le rend', theme => {
    const other = counterpartTheme(theme);
    expect(other).not.toBe(theme);
    expect(BUTTON_THEMES).toContain(other);
    expect(counterpartTheme(other)).toBe(theme);
    expect(isDarkTheme(other)).toBe(!isDarkTheme(theme));
  });

  test('chaque thème sombre prend les états et ombres des thèmes sombres', () => {
    const dark = BUTTON_THEMES.filter(isDarkTheme);
    expect(dark).toEqual(expect.arrayContaining(['dark', 'blue', 'moss', 'ember', 'halloween']));
    expect(dark.filter(theme => !DARK_BLOCK.includes(`.theme-${theme}`))).toEqual([]);
  });

  test('un thème inconnu (ancien « pink ») s’affiche en Classique, sans classe', () => {
    localStorage.setItem('colorTheme', 'pink');
    applyColorTheme(effectiveColorTheme(null, AFTER), null);
    expect(appliedColorTheme()).toBe('default');
    expect(document.body.className).toBe('');
    expect(pressed()).toEqual(['default']);
    expect(counterpartTheme('pink')).toBe('dark');
  });

  test('l’interrupteur suit la clarté du thème affiché', () => {
    applyColorTheme('green', null);
    expect(switchChecked()).toBe('false');
    applyColorTheme('moss', null);
    expect(switchChecked()).toBe('true');
    expect(visible()).toEqual(['dark', 'moss']);
  });

  test('hors fête, la bascule enregistre le contraire comme thème ordinaire', () => {
    localStorage.setItem('colorTheme', 'green');
    jest.useFakeTimers({ now: AFTER });
    initThemes();
    toggleColorMode();
    expect(localStorage.getItem('colorTheme')).toBe('moss');
    expect(document.body.classList.contains('theme-moss')).toBe(true);
    expect(localStorage.getItem('seasonChoice')).toBeNull();
  });

  test('la barre du haut demande la bascule par le bus : thème, clarté et interrupteurs suivent', () => {
    jest.useFakeTimers({ now: AFTER });
    initThemes();
    eventBus.emit('colorMode:toggle');
    expect(appliedColorTheme()).toBe('dark');
    expect(document.body.dataset.colorMode).toBe('dark');
    expect(switchChecked()).toBe('true');
    expect(localStorage.getItem('colorTheme')).toBe('dark');
  });

  test('pendant la fête, la bascule passe à l’autre thème de la fête, thème ordinaire intact', () => {
    localStorage.setItem('colorTheme', 'green');
    jest.useFakeTimers({ now: IN_2026 });
    initThemes();
    expect(appliedColorTheme()).toBe('pumpkin');
    toggleColorMode();
    expect(document.body.classList.contains('theme-halloween')).toBe(true);
    expect(localStorage.getItem('colorTheme')).toBe('green');
    expect(localStorage.getItem('seasonChoice')).toBe('halloween-2026:halloween');
  });
});

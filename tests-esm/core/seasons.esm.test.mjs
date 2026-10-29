/**
 * Fêtes du calendrier (js/core/seasons.js) : dates incluses, passage d'année, essai ?saison=,
 * édition d'une fête, noms des images costumées. Jamais la date du jour : chaque test donne la
 * sienne.
 */
import { describe, test, expect, afterEach } from '@jest/globals';
import {
  NO_SEASON,
  SEASONS,
  SEASON_THEMES,
  costumed,
  findSeason,
  isInSeason,
  isSeasonalImage,
  seasonEdition,
  seasonOfTheme,
  wearSeason,
  wornSeason,
} from '../../js/core/seasons.js';

const HALLOWEEN = SEASONS.find(season => season.id === 'halloween');
// Fête d'essai qui passe le 31 décembre, comme le fera le Nouvel An
const NEW_YEAR = Object.freeze({
  id: 'newyear',
  from: [12, 27],
  to: [1, 7],
  themes: { light: 'snow', dark: 'fireworks' },
  costumes: ['heads'],
});

const day = (year, month, date) => new Date(year, month - 1, date, 12);

describe('Halloween : du 24 octobre au 1er novembre inclus', () => {
  test.each([
    [day(2026, 10, 23), false],
    [day(2026, 10, 24), true],
    [day(2026, 10, 31), true],
    [day(2026, 11, 1), true],
    [day(2026, 11, 2), false],
    [day(2027, 10, 24), true],
    [day(2026, 6, 15), false],
  ])('%s → %s', (date, expected) => {
    expect(isInSeason(HALLOWEEN, date)).toBe(expected);
    expect(findSeason(date)).toBe(expected ? HALLOWEEN : null);
  });

  test('les bornes valent dès minuit et jusqu’à 23 h 59', () => {
    expect(isInSeason(HALLOWEEN, new Date(2026, 9, 24, 0, 0))).toBe(true);
    expect(isInSeason(HALLOWEEN, new Date(2026, 10, 1, 23, 59))).toBe(true);
    expect(isInSeason(HALLOWEEN, new Date(2026, 9, 23, 23, 59))).toBe(false);
  });

  test('deux thèmes, un clair et un sombre, reconnus comme ceux de la fête', () => {
    expect(HALLOWEEN.themes).toEqual({ light: 'pumpkin', dark: 'halloween' });
    expect(SEASON_THEMES).toEqual(expect.arrayContaining(['pumpkin', 'halloween']));
    expect(seasonOfTheme('pumpkin')).toBe(HALLOWEEN);
    expect(seasonOfTheme('halloween')).toBe(HALLOWEEN);
    expect(seasonOfTheme('dark')).toBeNull();
  });
});

describe('Fête qui passe le 31 décembre', () => {
  test.each([
    [day(2026, 12, 26), false],
    [day(2026, 12, 27), true],
    [day(2026, 12, 31), true],
    [day(2027, 1, 1), true],
    [day(2027, 1, 7), true],
    [day(2027, 1, 8), false],
  ])('%s → %s', (date, expected) => {
    expect(isInSeason(NEW_YEAR, date)).toBe(expected);
  });

  test('son édition est l’année où elle commence', () => {
    expect(seasonEdition(NEW_YEAR, day(2026, 12, 30))).toBe('newyear-2026');
    expect(seasonEdition(NEW_YEAR, day(2027, 1, 3))).toBe('newyear-2026');
    expect(seasonEdition(HALLOWEEN, day(2026, 10, 31))).toBe('halloween-2026');
    expect(seasonEdition(HALLOWEEN, day(2027, 10, 31))).toBe('halloween-2027');
  });
});

describe('Essai ?saison=', () => {
  test('« aucune » retire la fête du jour, un identifiant la force hors de ses dates', () => {
    expect(findSeason(day(2026, 10, 31), NO_SEASON)).toBeNull();
    expect(findSeason(day(2026, 6, 15), 'halloween')).toBe(HALLOWEEN);
  });

  test('une valeur inconnue laisse la date décider', () => {
    expect(findSeason(day(2026, 10, 31), 'paques')).toBe(HALLOWEEN);
    expect(findSeason(day(2026, 6, 15), 'paques')).toBeNull();
  });
});

describe('Images costumées', () => {
  afterEach(() => wearSeason(null));

  test('sans fête portée, chaque image garde son nom classique', () => {
    expect(wornSeason()).toBeNull();
    expect(costumed('fox', 'heads')).toBe('fox');
    expect(costumed('renard_vaisseau', 'ships')).toBe('renard_vaisseau');
  });

  test('pendant Halloween, le nom prend le suffixe de la fête', () => {
    wearSeason(HALLOWEEN);
    expect(costumed('fox', 'heads')).toBe('fox_halloween');
    expect(costumed('panda', 'bodies')).toBe('panda_halloween');
    expect(costumed('renard_vaisseau_2', 'ships')).toBe('renard_vaisseau_2_halloween');
    expect(costumed('dragon', 'backgrounds')).toBe('dragon_halloween');
  });

  test('une famille que la fête n’apporte pas reste classique', () => {
    wearSeason(NEW_YEAR);
    expect(costumed('fox', 'heads')).toBe('fox_newyear');
    expect(costumed('fox', 'bodies')).toBe('fox');
  });

  test.each([
    ['fox_halloween_head_avatar.png', true],
    ['fox_halloween.png', true],
    ['renard_vaisseau_2_halloween.png', true],
    ['background_fox_halloween_001.webp', true],
    ['leapmultix-social-card-halloween.webp', true],
    ['fox_head_avatar.png', false],
    ['background_fox_001.webp', false],
    ['leapmultix-social-card.webp', false],
    ['halloweenish.png', false],
  ])('%s est une image de fête : %s', (name, expected) => {
    expect(isSeasonalImage(name)).toBe(expected);
  });
});

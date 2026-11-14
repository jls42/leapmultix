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
  lunarNewYearDay,
  seasonDays,
  seasonEdition,
  seasonOfTheme,
  wearSeason,
  wornSeason,
} from '../../js/core/seasons.js';

const HALLOWEEN = SEASONS.find(season => season.id === 'halloween');
const CHRISTMAS = SEASONS.find(season => season.id === 'christmas');
const NEW_YEAR = SEASONS.find(season => season.id === 'newyear');

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

describe('Noël : du 1er au 26 décembre inclus', () => {
  test.each([
    [day(2026, 11, 30), false],
    [day(2026, 12, 1), true],
    [day(2026, 12, 24), true],
    [day(2026, 12, 26), true],
    [day(2026, 12, 27), false],
    [day(2027, 1, 1), false],
    [day(2027, 12, 1), true],
  ])('%s → %s', (date, expected) => {
    expect(isInSeason(CHRISTMAS, date)).toBe(expected);
    // Le 27 décembre et le 1er janvier sont au Nouvel An
    expect(findSeason(date) === CHRISTMAS).toBe(expected);
  });

  test('deux thèmes, un clair et un sombre, reconnus comme ceux de la fête', () => {
    expect(CHRISTMAS.themes).toEqual({ light: 'snow', dark: 'christmas' });
    expect(SEASON_THEMES).toEqual(expect.arrayContaining(['snow', 'christmas']));
    expect(seasonOfTheme('snow')).toBe(CHRISTMAS);
    expect(seasonOfTheme('christmas')).toBe(CHRISTMAS);
  });

  test('son édition est l’année du 1er décembre, ?saison=christmas la force hors de ses dates', () => {
    expect(seasonEdition(CHRISTMAS, day(2026, 12, 24))).toBe('christmas-2026');
    expect(findSeason(day(2026, 6, 15), 'christmas')).toBe(CHRISTMAS);
    expect(findSeason(day(2026, 12, 24), NO_SEASON)).toBeNull();
  });
});

describe('Nouvel An : du 27 décembre au 6 janvier inclus, il passe le 31 décembre', () => {
  test.each([
    [day(2026, 12, 26), false],
    [day(2026, 12, 27), true],
    [day(2026, 12, 31), true],
    [day(2027, 1, 1), true],
    [day(2027, 1, 6), true],
    [day(2027, 1, 7), false],
    [day(2027, 6, 15), false],
  ])('%s → %s', (date, expected) => {
    expect(isInSeason(NEW_YEAR, date)).toBe(expected);
    expect(findSeason(date) === NEW_YEAR).toBe(expected);
  });

  test('il reste là de 23 h 59 le 31 décembre à minuit le 1er janvier', () => {
    expect(findSeason(new Date(2026, 11, 31, 23, 59))).toBe(NEW_YEAR);
    expect(findSeason(new Date(2027, 0, 1, 0, 0))).toBe(NEW_YEAR);
    expect(findSeason(new Date(2027, 0, 6, 23, 59))).toBe(NEW_YEAR);
    expect(findSeason(new Date(2027, 0, 7, 0, 0))).toBeNull();
  });

  test('deux thèmes, un clair et un sombre, reconnus comme ceux de la fête', () => {
    expect(NEW_YEAR.themes).toEqual({ light: 'confetti', dark: 'fireworks' });
    expect(SEASON_THEMES).toEqual(expect.arrayContaining(['confetti', 'fireworks']));
    expect(seasonOfTheme('confetti')).toBe(NEW_YEAR);
    expect(seasonOfTheme('fireworks')).toBe(NEW_YEAR);
  });

  test('son édition est l’année où elle commence', () => {
    expect(seasonEdition(NEW_YEAR, day(2026, 12, 30))).toBe('newyear-2026');
    expect(seasonEdition(NEW_YEAR, day(2027, 1, 3))).toBe('newyear-2026');
    expect(seasonEdition(HALLOWEEN, day(2026, 10, 31))).toBe('halloween-2026');
    expect(seasonEdition(HALLOWEEN, day(2027, 10, 31))).toBe('halloween-2027');
  });
});

/** Fête d'essai dont la date change chaque année : de la veille du Nouvel An chinois au 15e jour */
const MOVABLE = Object.freeze({
  id: 'essai',
  movable: Object.freeze({ day: lunarNewYearDay, before: 1, after: 14 }),
  themes: Object.freeze({ light: 'essaiclair', dark: 'essaisombre' }),
  costumes: Object.freeze([]),
});

/** Les années de la table du Nouvel An chinois, de 2027 à 2040 */
const LUNAR_YEARS = Array.from({ length: 14 }, (_, index) => 2027 + index);

describe('Fête mobile : sa date change chaque année', () => {
  test.each([
    [day(2027, 2, 4), false],
    [day(2027, 2, 5), true],
    [day(2027, 2, 6), true],
    [day(2027, 2, 20), true],
    [day(2027, 2, 21), false],
    [day(2028, 1, 24), false],
    [day(2028, 1, 25), true],
    [day(2028, 2, 9), true],
    [day(2028, 2, 10), false],
    [day(2034, 3, 5), true],
    [day(2034, 3, 6), false],
  ])('%s → %s', (date, expected) => {
    expect(isInSeason(MOVABLE, date)).toBe(expected);
  });

  test('ses bornes de chaque année passent d’un mois à l’autre', () => {
    expect(seasonDays(MOVABLE, 2027)).toEqual({ from: [2, 5], to: [2, 20] });
    expect(seasonDays(MOVABLE, 2031)).toEqual({ from: [1, 22], to: [2, 6] });
    expect(seasonDays(MOVABLE, 2034)).toEqual({ from: [2, 18], to: [3, 5] });
  });

  test('une année hors de sa table n’a pas de fête, mais garde une édition pour ?saison=', () => {
    expect(seasonDays(MOVABLE, 2026)).toBeNull();
    expect(isInSeason(MOVABLE, day(2026, 2, 17))).toBe(false);
    expect(isInSeason(MOVABLE, day(2041, 2, 1))).toBe(false);
    expect(seasonEdition(MOVABLE, day(2026, 11, 11))).toBe('essai-2026');
    expect(seasonEdition(MOVABLE, day(2027, 2, 10))).toBe('essai-2027');
  });

  test('une fête à dates fixes garde les siennes, chaque année', () => {
    expect(seasonDays(HALLOWEEN, 2030)).toEqual({ from: [10, 24], to: [11, 1] });
    expect(seasonDays(NEW_YEAR, 2030)).toEqual({ from: [12, 27], to: [1, 6] });
  });
});

describe('Nouvel An chinois : table des tables de l’observatoire de Hong Kong', () => {
  test('chaque année de 2027 à 2040, sans trou', () => {
    expect(LUNAR_YEARS.filter(year => !lunarNewYearDay(year))).toEqual([]);
  });

  test('toujours entre le 21 janvier et le 20 février, comme le veut le calendrier lunaire', () => {
    const outside = LUNAR_YEARS.filter(year => {
      const [month, date] = lunarNewYearDay(year);
      return month * 100 + date < 121 || month * 100 + date > 220;
    });
    expect(outside).toEqual([]);
  });

  test('dates relevées', () => {
    expect(lunarNewYearDay(2027)).toEqual([2, 6]);
    expect(lunarNewYearDay(2028)).toEqual([1, 26]);
    expect(lunarNewYearDay(2034)).toEqual([2, 19]);
    expect(lunarNewYearDay(2040)).toEqual([2, 12]);
  });

  test('de la veille au 15e jour, la fête ne passe jamais le 31 décembre', () => {
    const crossing = LUNAR_YEARS.filter(year => {
      const { from, to } = seasonDays(MOVABLE, year);
      return from[0] * 100 + from[1] > to[0] * 100 + to[1];
    });
    expect(crossing).toEqual([]);
  });
});

const LUNAR_NEW_YEAR = SEASONS.find(season => season.id === 'lunarnewyear');

describe('Nouvel An chinois : de la veille à la fête des Lanternes, date nouvelle chaque année', () => {
  test.each([
    [day(2027, 2, 4), false],
    [day(2027, 2, 5), true],
    [day(2027, 2, 20), true],
    [day(2027, 2, 21), false],
    [day(2028, 1, 24), false],
    [day(2028, 1, 25), true],
    [day(2028, 2, 9), true],
    [day(2028, 2, 10), false],
  ])('%s → %s', (date, expected) => {
    expect(isInSeason(LUNAR_NEW_YEAR, date)).toBe(expected);
    expect(findSeason(date) === LUNAR_NEW_YEAR).toBe(expected);
  });

  test('deux thèmes, un clair et un sombre, reconnus comme ceux de la fête', () => {
    expect(LUNAR_NEW_YEAR.themes).toEqual({ light: 'lanterns', dark: 'dragondance' });
    expect(SEASON_THEMES).toEqual(expect.arrayContaining(['lanterns', 'dragondance']));
    expect(seasonOfTheme('lanterns')).toBe(LUNAR_NEW_YEAR);
    expect(seasonOfTheme('dragondance')).toBe(LUNAR_NEW_YEAR);
  });

  test('son édition est l’année de son début, ?saison=lunarnewyear la force hors de ses dates', () => {
    expect(seasonEdition(LUNAR_NEW_YEAR, day(2027, 2, 10))).toBe('lunarnewyear-2027');
    expect(seasonEdition(LUNAR_NEW_YEAR, day(2028, 1, 30))).toBe('lunarnewyear-2028');
    expect(findSeason(day(2026, 11, 11), 'lunarnewyear')).toBe(LUNAR_NEW_YEAR);
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
    // Fête d'essai qui n'apporte que les têtes
    wearSeason(Object.freeze({ ...NEW_YEAR, costumes: Object.freeze(['heads']) }));
    expect(costumed('fox', 'heads')).toBe('fox_newyear');
    expect(costumed('fox', 'bodies')).toBe('fox');
  });

  test.each([
    ['fox_halloween_head_avatar.png', true],
    ['fox_halloween.png', true],
    ['renard_vaisseau_2_halloween.png', true],
    ['background_fox_halloween_001.webp', true],
    ['leapmultix-social-card-halloween.webp', true],
    ['fox_lunarnewyear_head_avatar.png', true],
    ['fox_head_avatar.png', false],
    ['background_fox_001.webp', false],
    ['leapmultix-social-card.webp', false],
    ['halloweenish.png', false],
  ])('%s est une image de fête : %s', (name, expected) => {
    expect(isSeasonalImage(name)).toBe(expected);
  });
});

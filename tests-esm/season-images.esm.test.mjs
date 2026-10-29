/**
 * Images costumées des fêtes : têtes (js/avatar-heads.js), corps, fusées, serpent de l'Arcade
 * et labyrinthe de MultiMiam (js/arcade-sprite-catalog.js), logos des modes et des jeux
 * (js/logos.js), fonds de l'avatar et image des héros (js/main-helpers.js). Costumées seulement quand la fête est portée ; le repli reste
 * l'image classique, gardée hors ligne. Pour chaque fête du registre et chaque famille qu'elle
 * annonce, chaque image que le code demande existe dans le dépôt : une fête ajoutée sans ses
 * images fait échouer ce test, qui liste celles qui manquent.
 */
import { describe, test, expect, afterEach } from '@jest/globals';
import fs from 'node:fs';

const { SEASONS, costumed, seasonWorlds, wearSeason } = await import('../js/core/seasons.js');
const { avatarHeadImage, AVATAR_IDS } = await import('../js/avatar-heads.js');
const {
  SNAKE_PART_FILES,
  answerTokenSpec,
  arcadeOfflineImages,
  arcadeSpriteSpecs,
  avatarSpec,
  seasonalSpriteSpecs,
  snakePartSpec,
  spaceshipSpec,
  textureSpec,
} = await import('../js/arcade-sprite-catalog.js');
const { ARCADE_LOGOS, MODE_LOGOS, logoSource } = await import('../js/logos.js');
const { refreshBackground, updateBackgroundByAvatar, updateSeoHeroImage } = await import(
  '../js/main-helpers.js'
);

const HALLOWEEN = SEASONS.find(season => season.id === 'halloween');
const SHIP_SELECTIONS = AVATAR_IDS.flatMap(avatar => [
  `spaceship_${avatar}.png|spaceship_default_128x128.png`,
  `spaceship_${avatar}_2.png|spaceship_default_2.png`,
]);
const background = () => document.body.style.getPropertyValue('--current-bg-image-url');
const arcade = source => `assets/images/arcade/${source}.png`;
/** Source d'une variante demandée : « …/arcade/fox_halloween_head_avatar-128.webp » → PNG */
const sourceOf = url => arcade(/arcade\/(.+)-\d+\.webp$/.exec(url)[1]);

/** Image des héros que pose l'accueil pour la fête portée */
function heroImage() {
  const hero = document.createElement('img');
  hero.className = 'seo-hero';
  document.body.append(hero);
  updateSeoHeroImage('fr');
  hero.remove();
  return hero.getAttribute('src');
}

/**
 * Fichiers que chaque famille demande pour la fête portée, lus aux portes du code (et non
 * reconstruits ici) : une porte qui oublie le costume rend un nom classique, et le test le voit
 */
const FAMILY_FILES = new Map([
  ['heads', () => AVATAR_IDS.map(avatar => sourceOf(avatarHeadImage(avatar, '56px').src))],
  ['bodies', () => AVATAR_IDS.map(avatar => arcade(avatarSpec(avatar).source))],
  ['ships', () => SHIP_SELECTIONS.map(selection => arcade(spaceshipSpec(selection).source))],
  [
    'snake',
    () => [
      ...SNAKE_PART_FILES.map(file => arcade(snakePartSpec(file).source)),
      arcade(textureSpec('snake_apple.png').source),
      arcade(textureSpec('herbe.png').source),
    ],
  ],
  ['miam', () => [arcade(textureSpec('mur.png').source), arcade(answerTokenSpec().source)]],
  ['logos', () => [...MODE_LOGOS.values(), ...ARCADE_LOGOS].map(file => arcade(logoSource(file)))],
  [
    'backgrounds',
    season =>
      AVATAR_IDS.flatMap(avatar =>
        seasonWorlds(season).flatMap(number => {
          const base = `img/background_${costumed(avatar, 'backgrounds')}_${String(number).padStart(3, '0')}`;
          return [`${base}.png`, `${base}.webp`];
        })
      ),
  ],
  ['hero', () => [heroImage()]],
]);

afterEach(() => {
  wearSeason(null);
  document.body.replaceChildren();
  document.body.removeAttribute('style');
});

describe.each(SEASONS.map(season => [season.id, season]))('%s', (id, season) => {
  test('chaque famille annoncée est connue du jeu', () => {
    expect(season.costumes.filter(family => !FAMILY_FILES.has(family))).toEqual([]);
  });

  test.each(season.costumes)('%s : chaque image costumée demandée est dans le dépôt', family => {
    wearSeason(season);
    const files = FAMILY_FILES.get(family)(season);
    // Toutes costumées, toutes différentes
    expect(files.filter(file => !file.includes(`_${id}`) && !file.includes(`-${id}`))).toEqual([]);
    expect(new Set(files).size).toBe(files.length);
    expect(files.filter(file => !fs.existsSync(file))).toEqual([]);
  });

  test('sans fête portée, chaque famille rend ses images classiques', () => {
    // Fonds : numérotés d'après la fête ; réponses de MultiMiam : sans image hors fête
    const classic = [...FAMILY_FILES.entries()]
      .filter(([family]) => !['backgrounds', 'miam'].includes(family))
      .flatMap(([, files]) => files(season));
    expect(classic.filter(file => file.includes(`_${id}`) || file.includes(`-${id}`))).toEqual([]);
  });
});

describe('Têtes', () => {
  test('costumées pendant Halloween, repli toujours classique', () => {
    expect(avatarHeadImage('panda', '56px').src).toContain('/panda_head_avatar-128.webp');
    wearSeason(HALLOWEEN);
    const head = avatarHeadImage('panda', '56px');
    expect(head.src).toContain('/panda_halloween_head_avatar-128.webp');
    expect(head.srcset).toContain('panda_halloween_head_avatar-512.webp 512w');
    expect(head['data-fallback']).toBe('assets/images/arcade/panda_head_avatar_128x128.png');
  });
});

describe('Arcade', () => {
  test('corps : même côté et mêmes replis, source costumée', () => {
    const classic = avatarSpec('fox');
    wearSeason(HALLOWEEN);
    expect(avatarSpec('fox')).toEqual({ ...classic, source: 'fox_halloween' });
    expect(avatarSpec('inconnu').source).toBe('fox_halloween');
  });

  test('fusées pilotées costumées, fusées sans pilote inchangées', () => {
    wearSeason(HALLOWEEN);
    expect(spaceshipSpec('spaceship_fox_2.png|spaceship_default_2.png').source).toBe(
      'renard_vaisseau_2_halloween'
    );
    expect(spaceshipSpec('spaceship_default.png').source).toBe('spaceship_default');
    expect(spaceshipSpec('').source).toBe('spaceship_default');
  });

  test('serpent, pomme, herbe et murs costumés, mêmes replis ; chemin inchangé', () => {
    const head = snakePartSpec('tete_haut.png');
    const apple = textureSpec('snake_apple.png');
    const wall = textureSpec('mur.png');
    wearSeason(HALLOWEEN);
    expect(snakePartSpec('tete_haut.png')).toEqual({ ...head, source: 'tete_haut_halloween' });
    expect(textureSpec('snake_apple.png')).toEqual({ ...apple, source: 'snake_apple_halloween' });
    expect(textureSpec('herbe.png').source).toBe('herbe_halloween');
    expect(textureSpec('mur.png')).toEqual({ ...wall, source: 'mur_halloween' });
    expect(textureSpec('chemin.png').source).toBe('chemin');
  });

  test('réponses de MultiMiam : une pastille hors fête, un bonbon pendant Halloween', () => {
    expect(answerTokenSpec()).toBeNull();
    wearSeason(HALLOWEEN);
    expect(answerTokenSpec()).toMatchObject({
      source: 'multimiam_reponse_halloween',
      fallbacks: [],
    });
  });

  test('les images costumées ont leurs variantes, mais restent hors du préchargement', () => {
    const seasonal = seasonalSpriteSpecs().map(item => item.source);
    // Corps (5), fusées pilotées (10), serpent (14 morceaux, herbe, pomme), murs et réponses
    // de MultiMiam, par fête
    expect(seasonal).toHaveLength(33 * SEASONS.length);
    expect(seasonal).toEqual(
      expect.arrayContaining([
        'unicorn_halloween',
        'panda_vaisseau_halloween',
        'tete_bas_halloween',
      ])
    );
    expect(arcadeSpriteSpecs().filter(item => seasonal.includes(item.source))).toEqual([]);
    expect(arcadeOfflineImages().filter(file => file.includes('halloween'))).toEqual([]);
  });
});

describe('Logos', () => {
  test('modes et jeux d’Arcade costumés pendant la fête ; toute autre image reste classique', () => {
    wearSeason(HALLOWEEN);
    expect(logoSource('logo_mode_defi.png')).toBe('logo_mode_defi_halloween');
    expect(logoSource('logo_multisnake.png')).toBe('logo_multisnake_halloween');
    expect(logoSource('spaceship_default.png')).toBe('spaceship_default');
    wearSeason(null);
    expect(logoSource('logo_mode_defi.png')).toBe('logo_mode_defi');
  });
});

describe('Fond de l’avatar et image des héros', () => {
  test('le fond passe à un monde costumé et revient, pour le même avatar', () => {
    updateBackgroundByAvatar('dragon');
    const classic = background();
    expect(classic).toMatch(/background_dragon_\d{3}\.png/);
    wearSeason(HALLOWEEN);
    refreshBackground();
    expect(background()).toMatch(/background_dragon_halloween_00[1-4]\.png/);
    // Tiré une fois par session : le même monde costumé tant qu'on ne change pas d'avatar
    const festive = background();
    refreshBackground();
    expect(background()).toBe(festive);
    wearSeason(null);
    refreshBackground();
    expect(background()).toBe(classic);
  });

  test('l’image des héros de l’accueil suit la fête', () => {
    expect(heroImage()).toBe('assets/social/leapmultix-social-card.webp');
    wearSeason(HALLOWEEN);
    expect(heroImage()).toBe('assets/social/leapmultix-social-card-halloween.webp');
  });
});

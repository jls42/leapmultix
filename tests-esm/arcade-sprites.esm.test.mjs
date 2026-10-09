/**
 * Images des jeux d'Arcade (js/arcade-sprite-catalog.js, js/arcade-sprites.js) : chaque image
 * vient de sa source haute définition, en variante WebP au moins aussi grande que sa taille à
 * l'écran (taille dessinée × échelle d'affichage × densité), garde ses proportions, et se replie
 * sur le petit PNG du dépôt quand les variantes manquent, jamais sur la source de 1,5 Mo.
 * Avant : fusée de 128 px étirée à 175 × 140, monstres 85 × 128 écrasés en carré, variantes
 * choisies d'après la largeur de la fenêtre et non d'après la taille dessinée.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

const catalog = await import('../js/arcade-sprite-catalog.js');
const { ArcadeSprite, drawArcadeSprite } = await import('../js/arcade-sprites.js');

/** Image factice : le test décide quand elle se charge (et à quelle taille) ou échoue */
class FakeImage {
  static made = [];
  constructor() {
    this.src = '';
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    FakeImage.made.push(this);
  }
  load(width, height = width) {
    this.naturalWidth = width;
    this.naturalHeight = height;
    this.onload?.();
  }
  fail() {
    this.onerror?.();
  }
}

/** Contexte 2D qui note ses appels */
function recordingContext(canvas) {
  const calls = [];
  const note =
    name =>
    (...args) =>
      calls.push([name, ...args]);
  return {
    canvas,
    calls,
    drawImage: note('drawImage'),
    save: note('save'),
    restore: note('restore'),
    translate: note('translate'),
    scale: note('scale'),
    beginPath: note('beginPath'),
    rect: note('rect'),
    clip: note('clip'),
  };
}

/** Canevas affiché à sa taille interne (une unité du jeu = un pixel CSS) */
function canvasAtScale(scale = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  canvas.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 800 * scale,
    height: 600 * scale,
    right: 800 * scale,
    bottom: 600 * scale,
  });
  return canvas;
}

// Adresse demandée, à partir de « assets/ » (jsdom la rend absolue)
const urlOf = image => image.src.slice(image.src.indexOf('assets/'));
const realImage = globalThis.Image;
const realRatio = globalThis.devicePixelRatio;

beforeEach(() => {
  FakeImage.made = [];
  globalThis.Image = FakeImage;
});

afterEach(() => {
  globalThis.Image = realImage;
  globalThis.devicePixelRatio = realRatio;
});

describe('variante choisie d’après la taille à l’écran', () => {
  test('la plus petite variante au moins aussi grande que la taille dessinée', () => {
    expect(catalog.variantWidth(1024, 175, 140)).toBe(256);
    expect(catalog.variantWidth(1024, 350, 280)).toBe(512);
    expect(catalog.variantWidth(1024, 525, 420)).toBe(1024);
    expect(catalog.variantWidth(1024, 60, 60)).toBe(64);
  });

  test('les deux côtés comptent : un monstre deux fois plus haut que large', () => {
    // 128 px de large font 192 de haut : assez large pour 120 px, trop court pour 200 px
    expect(catalog.variantWidth(1024, 120, 200, 1.5)).toBe(256);
    expect(catalog.variantWidth(1024, 100, 150, 1.5)).toBe(128);
  });

  test('jamais au-delà de la plus grande variante produite pour la source', () => {
    expect(catalog.variantWidth(256, 400, 400)).toBe(256);
    expect(catalog.variantWidth(1024, 2442, 1776)).toBe(1024);
  });

  test('adresse d’une variante : le WebP produit par le générateur', () => {
    expect(catalog.variantUrl('renard_vaisseau_2', 256)).toBe(
      'assets/generated-images/arcade/renard_vaisseau_2-256.webp'
    );
  });
});

describe('source haute définition de chaque image', () => {
  test('la fusée choisie au menu garde sa valeur enregistrée et prend sa source 1024', () => {
    const lotus = catalog.spaceshipSpec(
      'renard_vaisseau_2_256x256.png|renard_vaisseau_256x256.png'
    );
    expect(lotus.source).toBe('renard_vaisseau_2');
    expect(lotus.fallbacks).toEqual([
      'renard_vaisseau_2_256x256.png',
      'renard_vaisseau_256x256.png',
    ]);
    const comete = catalog.spaceshipSpec('spaceship_fox.png|spaceship_default_128x128.png');
    expect(comete.source).toBe('renard_vaisseau');
    expect(catalog.spaceshipSpec('spaceship_unicorn_2.png|spaceship_default_2.png').source).toBe(
      'licorne_vaisseau_2'
    );
    expect(catalog.spaceshipSpec('spaceship_default_2.png').source).toBe('vaisseau_2');
    expect(catalog.spaceshipSpec(undefined).source).toBe('spaceship_default');
    expect(catalog.spaceshipSpec('inconnu.png').source).toBe('spaceship_default');
  });

  test('monstres : la source tournée vers la droite, le petit PNG en repli', () => {
    expect(catalog.monsterSpec(7)).toEqual({
      source: 'monstre07_right',
      maxWidth: 1024,
      fallbacks: ['monstre07_right_128x128.png'],
      facing: 'right',
    });
    expect(catalog.monsterSpec(146).source).toBe('monstre146_right');
  });

  test('personnages : le renard et l’astronaute regardent à gauche dans leur source', () => {
    expect(catalog.avatarSpec('fox')).toMatchObject({ source: 'fox', facing: 'left' });
    expect(catalog.avatarSpec('astronaut').facing).toBe('left');
    expect(catalog.avatarSpec('panda')).toMatchObject({ facing: 'right' });
    expect(catalog.avatarSpec('fox').fallbacks).toEqual(['fox_left_128x128.png']);
    expect(catalog.avatarSpec('licorne-inconnue').source).toBe('fox');
  });

  test('serpent et textures : sources de moins de 1024 px bornées à leurs variantes', () => {
    expect(catalog.snakePartSpec('tete_droite.png')).toMatchObject({
      source: 'tete_droite',
      maxWidth: 256,
      fallbacks: ['tete_droite.png'],
    });
    expect(catalog.textureSpec('herbe.png')).toMatchObject({ source: 'herbe', maxWidth: 1024 });
    expect(catalog.textureSpec('mur.png').fallbacks).toEqual(['mur_128x128.png']);
  });

  test('jamais la source haute définition en repli (1,5 Mo par image)', () => {
    const specs = catalog.arcadeSpriteSpecs();
    expect(specs.length).toBeGreaterThan(170);
    const heavy = specs.filter(
      spec => spec.maxWidth === 1024 && spec.fallbacks.includes(`${spec.source}.png`)
    );
    // Seule l'herbe n'a pas de petite version : son repli est sa source (comportement d'avant)
    expect(heavy.map(spec => spec.source)).toEqual(['herbe']);
  });
});

describe('chargement à la taille voulue, puis au-dessus si la partie grandit', () => {
  test('la variante à la taille demandée, puis la suivante sans effacer la première', () => {
    const sprite = new ArcadeSprite(catalog.spaceshipSpec('spaceship_fox.png'));
    expect(sprite.image).toBeNull();
    sprite.request(175, 140);
    expect(FakeImage.made.map(urlOf)).toEqual([
      'assets/generated-images/arcade/renard_vaisseau-256.webp',
    ]);
    FakeImage.made[0].load(256);
    expect(sprite.image).toBe(FakeImage.made[0]);
    // Plein écran : plus grand à l'écran, l'image en place reste dessinée pendant le chargement
    sprite.request(350, 280);
    expect(urlOf(FakeImage.made[1])).toBe(
      'assets/generated-images/arcade/renard_vaisseau-512.webp'
    );
    expect(sprite.image).toBe(FakeImage.made[0]);
    FakeImage.made[1].load(512);
    expect(sprite.image).toBe(FakeImage.made[1]);
  });

  test('une taille déjà demandée ou plus petite ne recharge rien', () => {
    const sprite = new ArcadeSprite(catalog.monsterSpec(3));
    sprite.request(200, 200);
    sprite.request(200, 200);
    sprite.request(90, 90);
    expect(FakeImage.made).toHaveLength(1);
  });

  test('variantes absentes (développement, CI) : le petit PNG, puis le suivant', () => {
    const sprite = new ArcadeSprite(
      catalog.spaceshipSpec('renard_vaisseau_2_256x256.png|renard_vaisseau_256x256.png')
    );
    sprite.request(175, 140);
    FakeImage.made[0].fail();
    expect(urlOf(FakeImage.made[1])).toBe('assets/images/arcade/renard_vaisseau_2_256x256.png');
    FakeImage.made[1].fail();
    expect(urlOf(FakeImage.made[2])).toBe('assets/images/arcade/renard_vaisseau_256x256.png');
    FakeImage.made[2].load(256);
    expect(sprite.image).toBe(FakeImage.made[2]);
    // Une fois en repli, plus de nouvelle tentative de variante
    sprite.request(600, 600);
    expect(FakeImage.made).toHaveLength(3);
    expect(FakeImage.made.map(urlOf).filter(url => /renard_vaisseau_2\.png$/.test(url))).toEqual(
      []
    );
  });

  test('une petite variante arrivée après la grande ne la remplace pas', () => {
    const sprite = new ArcadeSprite(catalog.monsterSpec(9));
    sprite.request(100, 100);
    sprite.request(400, 400);
    const [small, large] = FakeImage.made;
    large.load(512);
    small.load(128);
    expect(sprite.image).toBe(large);
  });

  test('une plus grande variante en échec garde l’image déjà affichée', () => {
    const sprite = new ArcadeSprite(catalog.monsterSpec(12));
    sprite.request(100, 100);
    FakeImage.made[0].load(128);
    sprite.request(400, 400);
    FakeImage.made[1].fail();
    expect(sprite.image).toBe(FakeImage.made[0]);
    expect(FakeImage.made).toHaveLength(2);
  });
});

describe('dessin : proportions gardées, taille à l’écran', () => {
  function loadedSprite(spec, width, height) {
    const sprite = new ArcadeSprite(spec);
    sprite.request(width, height);
    FakeImage.made.at(-1).load(width, height);
    return sprite;
  }

  test('la fusée tient dans sa case sans être étirée, posée sur le même bas', () => {
    const sprite = loadedSprite(catalog.spaceshipSpec('spaceship_fox.png'), 256, 256);
    const ctx = recordingContext(canvasAtScale(1));
    drawArcadeSprite(ctx, sprite, { x: 100, y: 400, width: 175, height: 140 });
    // Case 175 × 140 : image carrée de 140, centrée en largeur
    expect(ctx.calls.find(([name]) => name === 'drawImage').slice(2)).toEqual([
      117.5, 400, 140, 140,
    ]);
  });

  test('un monstre plus haut que large garde ses proportions dans sa case carrée', () => {
    const sprite = loadedSprite(catalog.monsterSpec(1), 128, 192);
    const ctx = recordingContext(canvasAtScale(1));
    drawArcadeSprite(ctx, sprite, { x: 0, y: 0, width: 90, height: 90 });
    const [, , x, y, w, h] = ctx.calls.find(([name]) => name === 'drawImage');
    expect([x, y, w, h]).toEqual([15, 0, 60, 90]);
  });

  test('la variante demandée suit l’échelle d’affichage et la densité de l’écran', () => {
    globalThis.devicePixelRatio = 2;
    const sprite = new ArcadeSprite(catalog.monsterSpec(20));
    // Canevas affiché à 1,5 fois sa taille interne, écran de densité 2 : 100 → 300 pixels
    drawArcadeSprite(recordingContext(canvasAtScale(1.5)), sprite, {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
    expect(urlOf(FakeImage.made[0])).toBe(
      'assets/generated-images/arcade/monstre20_right-512.webp'
    );
  });

  test('densité au-delà de 3 : plafonnée, comme la taille interne des canevas', () => {
    globalThis.devicePixelRatio = 4;
    const sprite = new ArcadeSprite(catalog.monsterSpec(21));
    // 80 × 3 = 240 pixels : la variante de 256 suffit (80 × 4 en demanderait 512)
    drawArcadeSprite(recordingContext(canvasAtScale(1)), sprite, {
      x: 0,
      y: 0,
      width: 80,
      height: 80,
    });
    expect(urlOf(FakeImage.made[0])).toBe(
      'assets/generated-images/arcade/monstre21_right-256.webp'
    );
  });

  test('regard vers l’autre côté : la même image, retournée, à la même place', () => {
    const sprite = loadedSprite(catalog.avatarSpec('fox'), 256, 256);
    const ctx = recordingContext(canvasAtScale(1));
    drawArcadeSprite(ctx, sprite, { x: 10, y: 20, width: 50, height: 50 }, { facing: 'right' });
    expect(ctx.calls.map(([name]) => name)).toEqual([
      'save',
      'translate',
      'scale',
      'drawImage',
      'restore',
    ]);
    expect(ctx.calls[1].slice(1)).toEqual([60, 20]);
    expect(ctx.calls[2].slice(1)).toEqual([-1, 1]);
    expect(ctx.calls[3].slice(2)).toEqual([0, 0, 50, 50]);
    // Même sens que la source : aucun retournement
    const plain = recordingContext(canvasAtScale(1));
    drawArcadeSprite(plain, sprite, { x: 10, y: 20, width: 50, height: 50 }, { facing: 'left' });
    expect(plain.calls.map(([name]) => name)).toEqual(['drawImage']);
  });

  test('texture : couvre sa case sans déformation, rognée aux bords', () => {
    const sprite = loadedSprite(catalog.textureSpec('chemin.png'), 1024, 1024);
    const ctx = recordingContext(canvasAtScale(1));
    drawArcadeSprite(ctx, sprite, { x: 0, y: 50, width: 300, height: 200 }, { fit: 'cover' });
    expect(ctx.calls.find(([name]) => name === 'rect').slice(1)).toEqual([0, 50, 300, 200]);
    // Carré de 300 centré sur la case : même centre que la case
    expect(ctx.calls.find(([name]) => name === 'drawImage').slice(2)).toEqual([0, 0, 300, 300]);
  });

  test('morceau du serpent : remplit sa case (les morceaux se raccordent)', () => {
    const sprite = loadedSprite(catalog.snakePartSpec('queue_fin_gauche.png'), 200, 256);
    const ctx = recordingContext(canvasAtScale(1));
    drawArcadeSprite(ctx, sprite, { x: 30, y: 30, width: 30, height: 30 }, { fit: 'fill' });
    expect(ctx.calls.find(([name]) => name === 'drawImage').slice(2)).toEqual([30, 30, 30, 30]);
  });

  test('rien à dessiner tant que l’image n’est pas là (le jeu garde sa forme de repli)', () => {
    const ctx = recordingContext(canvasAtScale(1));
    const sprite = new ArcadeSprite(catalog.monsterSpec(30));
    expect(drawArcadeSprite(ctx, sprite, { x: 0, y: 0, width: 50, height: 50 })).toBe(false);
    expect(drawArcadeSprite(ctx, { complete: false }, { x: 0, y: 0, width: 50, height: 50 })).toBe(
      false
    );
    expect(ctx.calls.filter(([name]) => name === 'drawImage')).toEqual([]);
  });
});

describe('hors ligne', () => {
  test('une variante de chaque image est préchargée, jamais toutes les tailles', () => {
    const offline = catalog.arcadeOfflineImages();
    expect(offline).toEqual(
      expect.arrayContaining([
        '/assets/generated-images/arcade/monstre01_right-128.webp',
        '/assets/generated-images/arcade/monstre155_right-128.webp',
        '/assets/generated-images/arcade/fox-128.webp',
        '/assets/generated-images/arcade/renard_vaisseau_2-128.webp',
        '/assets/generated-images/arcade/spaceship_default-128.webp',
        '/assets/generated-images/arcade/vaisseau_2-128.webp',
      ])
    );
    expect(offline.filter(path => !path.endsWith('-128.webp'))).toEqual([]);
    expect(new Set(offline).size).toBe(offline.length);
  });
});

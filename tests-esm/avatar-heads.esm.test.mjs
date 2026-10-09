/* eslint-env jest, node */
/**
 * Têtes des avatars (js/avatar-heads.js) : WebP de 128, 256 et 512 px de la source de 1024 px,
 * à la taille affichée, PNG de 128 px en repli ; identifiant filtré par une liste blanche.
 * Changer d'avatar sur une image réécrit srcset, sizes, src et repli : avec un srcset, changer
 * le seul src ne change plus l'image affichée.
 */
import { readFileSync } from 'node:fs';
import { describe, test, expect, beforeEach } from '@jest/globals';

const {
  AVATAR_IDS,
  HEAD_SIZES,
  avatarHeadAttributes,
  avatarHeadImage,
  normalizeAvatarId,
  setAvatarHead,
} = await import('../js/avatar-heads.js');

const DRAGON = {
  srcset:
    'assets/generated-images/arcade/dragon_head_avatar-128.webp 128w, ' +
    'assets/generated-images/arcade/dragon_head_avatar-256.webp 256w, ' +
    'assets/generated-images/arcade/dragon_head_avatar-512.webp 512w',
  sizes: '96px',
  src: 'assets/generated-images/arcade/dragon_head_avatar-128.webp',
  'data-fallback': 'assets/images/arcade/dragon_head_avatar_128x128.png',
};

/** Attributs d'image d'une tête, tels que le navigateur les lit */
const headOf = img => ({
  srcset: img.getAttribute('srcset'),
  sizes: img.getAttribute('sizes'),
  src: img.getAttribute('src'),
  fallback: img.dataset.fallback,
});

beforeEach(() => {
  document.body.replaceChildren();
});

describe('attributs d’une tête', () => {
  test('variantes de la source de 1024 px, srcset et sizes avant src, PNG de 128 px en repli', () => {
    const attributes = avatarHeadImage('dragon', HEAD_SIZES.results);
    expect(Object.keys(attributes).slice(0, 4)).toEqual([
      'srcset',
      'sizes',
      'src',
      'data-fallback',
    ]);
    expect(attributes).toMatchObject(DRAGON);
  });

  test('liste blanche : ancien nom français traduit, valeur inconnue ou piégée → renard', () => {
    expect(normalizeAvatarId('licorne')).toBe('unicorn');
    for (const odd of ['x" onerror="alert(1)', '../../evil', undefined, 42, {}]) {
      expect(normalizeAvatarId(odd)).toBe('fox');
      const { srcset, src } = avatarHeadImage(odd, HEAD_SIZES.tile);
      expect(srcset.split(', ').map(item => item.split(' ')[0])).toEqual([
        'assets/generated-images/arcade/fox_head_avatar-128.webp',
        'assets/generated-images/arcade/fox_head_avatar-256.webp',
        'assets/generated-images/arcade/fox_head_avatar-512.webp',
      ]);
      expect(src).toBe('assets/generated-images/arcade/fox_head_avatar-128.webp');
    }
    expect(AVATAR_IDS).toEqual(['fox', 'panda', 'unicorn', 'dragon', 'astronaut']);
  });

  test('gabarit HTML : les mêmes attributs', () => {
    const parsed = new DOMParser().parseFromString(
      `<img ${avatarHeadAttributes('dragon', HEAD_SIZES.results)} alt="">`,
      'text/html'
    );
    const img = parsed.querySelector('img');
    expect(img.getAttributeNames().slice(0, 4)).toEqual([
      'srcset',
      'sizes',
      'src',
      'data-fallback',
    ]);
    expect(headOf(img)).toEqual({
      srcset: DRAGON.srcset,
      sizes: '96px',
      src: DRAGON.src,
      fallback: DRAGON['data-fallback'],
    });
  });
});

describe('setAvatarHead : poser ou changer la tête d’une image', () => {
  test('changer d’avatar change toute l’image : srcset, sizes, src et repli', () => {
    const img = document.createElement('img');
    setAvatarHead(img, 'fox', HEAD_SIZES.mascot);
    setAvatarHead(img, 'panda', HEAD_SIZES.choice);
    const head = headOf(img);
    // Le navigateur choisit dans le srcset : un renard qui y resterait resterait affiché
    expect(head.srcset).not.toMatch(/fox/);
    expect(head).toEqual({
      srcset:
        'assets/generated-images/arcade/panda_head_avatar-128.webp 128w, ' +
        'assets/generated-images/arcade/panda_head_avatar-256.webp 256w, ' +
        'assets/generated-images/arcade/panda_head_avatar-512.webp 512w',
      sizes: '(max-width: 480px) 56px, 72px',
      src: 'assets/generated-images/arcade/panda_head_avatar-128.webp',
      fallback: 'assets/images/arcade/panda_head_avatar_128x128.png',
    });
  });

  test('sans sa variante : le PNG de la tête portée, une fois ; une nouvelle tête réarme', () => {
    const img = document.createElement('img');
    setAvatarHead(img, 'fox', HEAD_SIZES.tile);
    setAvatarHead(img, 'unicorn', HEAD_SIZES.tile);
    img.dispatchEvent(new Event('error'));
    expect(img.hasAttribute('srcset')).toBe(false);
    expect(img.getAttribute('src')).toBe('assets/images/arcade/unicorn_head_avatar_128x128.png');
    // Un PNG en échec ne relance rien
    img.setAttribute('src', 'autre.png');
    img.dispatchEvent(new Event('error'));
    expect(img.getAttribute('src')).toBe('autre.png');
    // Image repliée puis changée d'avatar : de nouveau en WebP, et de nouveau un repli
    setAvatarHead(img, 'dragon', HEAD_SIZES.tile);
    expect(img.getAttribute('srcset')).toMatch(/dragon_head_avatar-512\.webp 512w$/);
    img.dispatchEvent(new Event('error'));
    expect(img.getAttribute('src')).toBe('assets/images/arcade/dragon_head_avatar_128x128.png');
  });

  test('un seul repli armé, même après plusieurs changements d’avatar', () => {
    const img = document.createElement('img');
    const writes = [];
    const setAttribute = img.setAttribute.bind(img);
    img.setAttribute = (name, value) => {
      if (name === 'src') writes.push(value);
      setAttribute(name, value);
    };
    for (const avatar of ['fox', 'panda', 'dragon']) setAvatarHead(img, avatar, HEAD_SIZES.tile);
    writes.length = 0;
    img.dispatchEvent(new Event('error'));
    expect(writes).toEqual(['assets/images/arcade/dragon_head_avatar_128x128.png']);
  });

  test('aucune image : rien ne se passe', () => {
    expect(() => setAvatarHead(null, 'fox', HEAD_SIZES.tile)).not.toThrow();
  });
});

describe('têtes écrites dans la page (index.html)', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const page = new DOMParser().parseFromString(html, 'text/html');
  /** Espaces d'un attribut sur plusieurs lignes (Prettier coupe les srcset) */
  const oneLine = value => value?.replace(/\s+/g, ' ').trim();

  /** Chaque tête de la page : l'image, l'avatar qu'elle montre, sa taille affichée */
  function pageHeads() {
    const inGroup = (selector, sizes) =>
      [...page.querySelectorAll(selector)].map(label => [
        label.querySelector('img'),
        label.querySelector('.avatar-radio').value,
        sizes,
      ]);
    return [
      ...inGroup('.creation-avatar-selector .avatar-btn', HEAD_SIZES.creation),
      [page.getElementById('hero-mascot-img'), 'fox', HEAD_SIZES.mascot],
      [page.getElementById('current-avatar-img'), 'fox', HEAD_SIZES.current],
      ...inGroup('#slide6 .avatar-selector .avatar-btn', HEAD_SIZES.choice),
    ];
  }

  test('formulaire « Nouveau joueur », mascotte, Personnalisation : les attributs de l’aide', () => {
    const heads = pageHeads();
    expect(heads).toHaveLength(12);
    for (const [img, avatar, sizes] of heads) {
      const written = Object.fromEntries(
        Object.keys(avatarHeadImage(avatar, sizes)).map(name => [
          name,
          oneLine(img.getAttribute(name)),
        ])
      );
      expect([avatar, written]).toEqual([avatar, avatarHeadImage(avatar, sizes)]);
    }
  });

  test('plus aucune tête en PNG dans la page : chacune passe par son srcset', () => {
    expect(html).not.toMatch(/\ssrc="[^"]*_head_avatar[^"]*\.png"/);
    expect(page.querySelectorAll('img[srcset*="_head_avatar-"]')).toHaveLength(12);
  });
});

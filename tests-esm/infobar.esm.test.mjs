/* eslint-env jest, node */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Traductions simulées : la clé, ou le modèle connu rempli avec ses paramètres
const TEMPLATES = {
  info_lives_value: '{lives} vies sur {total}',
  info_lives_value_one: '{lives} vie sur {total}',
};
jest.unstable_mockModule('../js/i18n.js', () => ({
  getTranslation: (k, params = {}) => {
    const template = TEMPLATES[k];
    if (!template) return k;
    return Object.entries(params).reduce((text, [p, v]) => text.replace(`{${p}}`, v), template);
  },
}));

const { InfoBar } = await import('../js/components/infoBar.js');

const EMOJI = /\p{Extended_Pictographic}/u;

/** Nom accessible des vies (porté par l'image de cœurs, enfant de la valeur) */
function livesName(element) {
  return element.querySelector('[role="img"]')?.getAttribute('aria-label');
}

describe('ESM: InfoBar labels', () => {
  test('adventure template includes expected label keys', () => {
    const html = InfoBar.createHTML('adventure', {
      score: 0,
      lives: 3,
      progress: '0/10',
      streak: 0,
    });
    expect(html).toContain('data-translate="info_score_label"');
    expect(html).toContain('data-translate="info_lives_label"');
    expect(html).toContain('data-translate="info_progress_label"');
    expect(html).toContain('data-translate="info_streak_label"');
    expect(EMOJI.test(html)).toBe(false);
  });
});

describe('ESM: InfoBar rendu des modes Quiz, Défi et Aventure', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="game"></div>';
  });

  test('libellé et valeur portent leurs classes, chaque élément son modificateur', () => {
    InfoBar.inject('game', 'quiz', { score: 10, streak: 2 });
    const score = document.querySelector('.info-item--score');
    expect(score.querySelector('.info-label').textContent).toBe('info_score_label');
    expect(score.querySelector('.info-value').textContent).toBe('10');
    expect(document.querySelector('.info-item--streak .info-value').id).toBe('info-streak');
  });

  test('le nom de la barre suit la langue (data-translate-aria-label)', () => {
    InfoBar.inject(
      'game',
      'quiz',
      { score: 0 },
      { ariaLabel: 'Infos Quiz', ariaLabelKey: 'quiz_info_bar_label' }
    );
    const bar = document.querySelector('.game-info-bar');
    expect(bar.getAttribute('aria-label')).toBe('Infos Quiz');
    expect(bar.getAttribute('data-translate-aria-label')).toBe('quiz_info_bar_label');
  });

  test('les vies sont des cœurs dessinés, nommés « 2 vies sur 3 »', () => {
    InfoBar.inject('game', 'adventure', { score: 0, lives: 2, progress: '0/10', streak: 0 });
    const lives = document.getElementById('info-lives');
    expect(lives.querySelectorAll('svg.info-heart')).toHaveLength(3);
    expect(lives.querySelectorAll('svg.info-heart.is-empty')).toHaveLength(1);
    expect(livesName(lives)).toBe('2 vies sur 3');
    expect(lives.querySelectorAll('[role="img"]')).toHaveLength(1);

    InfoBar.update({ lives: 1 }, 'adventure');
    expect(livesName(lives)).toBe('1 vie sur 3');

    InfoBar.update({ lives: 0 }, 'adventure');
    expect(lives.querySelectorAll('svg.info-heart.is-empty')).toHaveLength(3);
    // Français : 0 au singulier
    expect(livesName(lives)).toBe('0 vie sur 3');
  });

  test('un script qui réécrit le texte ne laisse pas de nom accessible périmé', () => {
    InfoBar.inject('game', 'adventure', { score: 0, lives: 3, progress: '0/10', streak: 0 });
    const lives = document.getElementById('info-lives');
    lives.textContent = '2';
    expect(lives.querySelector('[role="img"]')).toBeNull();
    expect(lives.hasAttribute('aria-label')).toBe(false);
  });

  test('les mini-jeux d’Arcade dessinent aussi leurs vies (aucun émoji)', () => {
    document.body.innerHTML = '<span id="multisnake-info-lives"></span>';
    InfoBar.update({ lives: 1 }, 'multisnake');
    const lives = document.getElementById('multisnake-info-lives');
    expect(lives.querySelectorAll('svg.info-heart')).toHaveLength(3);
    expect(lives.querySelectorAll('svg.info-heart.is-empty')).toHaveLength(2);
    expect(EMOJI.test(lives.textContent)).toBe(false);
  });

  test('un cœur perdu reste affiché, vide : le total ne diminue pas', () => {
    document.body.innerHTML = '<span id="multiinvaders-info-lives"></span>';
    InfoBar.update({ lives: 5 }, 'multiinvaders');
    const lives = document.getElementById('multiinvaders-info-lives');
    expect(lives.querySelectorAll('svg.info-heart')).toHaveLength(5);
    InfoBar.update({ lives: 4 }, 'multiinvaders');
    expect(lives.querySelectorAll('svg.info-heart')).toHaveLength(5);
    expect(lives.querySelectorAll('svg.info-heart.is-empty')).toHaveLength(1);
  });

  test('le Défi n’a pas de case « Bonus » : le temps gagné s’ajoute au chrono', () => {
    InfoBar.inject('game', 'challenge', { score: 0, streak: 0, time: 60 });
    expect(document.getElementById('info-bonus')).toBeNull();
    expect(document.querySelectorAll('.game-info-bar .info-item')).toHaveLength(3);
  });

  test('le chrono s’affiche en minutes et secondes', () => {
    InfoBar.inject('game', 'challenge', { score: 0, streak: 0, time: 65 });
    expect(document.getElementById('info-time').textContent).toBe('01:05');
  });
});

describe('ESM: bandeau des mini-jeux d’Arcade', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.appendChild(
      InfoBar.createArcadeTemplateElement({
        mode: 'multimiam',
        livesId: 'multimiam-info-lives',
        scoreId: 'multimiam-info-score',
        timerId: 'multimiam-info-timer',
        operationLabel: '3 × 4 = ?',
      })
    );
  });

  test('vies dessinées dès le départ, sans émoji', () => {
    const lives = document.getElementById('multimiam-info-lives');
    expect(lives.querySelectorAll('svg.info-heart')).toHaveLength(3);
    expect(livesName(lives)).toBe('3 vies sur 3');
    expect(EMOJI.test(document.body.textContent)).toBe(false);
  });

  test('le score et le temps portent un libellé pour les lecteurs d’écran', () => {
    const score = document.getElementById('multimiam-info-score');
    expect(score.previousElementSibling.className).toBe('sr-only');
    expect(score.previousElementSibling.getAttribute('data-translate')).toBe('info_score_label');
    const timer = document.getElementById('multimiam-info-timer');
    expect(timer.previousElementSibling.getAttribute('data-translate')).toBe('info_time_label');
  });

  test('seule la question est annoncée (pas le chrono qui change chaque seconde)', () => {
    const live = [...document.querySelectorAll('[aria-live]')];
    expect(live).toHaveLength(1);
    expect(live[0].classList.contains('arcade-question')).toBe(true);
  });

  test('la version HTML donne le même bandeau', () => {
    const html = InfoBar.createArcadeTemplate({ mode: 'multisnake' });
    expect(html).toContain('id="multisnake-info-lives"');
    expect(html).toContain('class="info-heart"');
    expect(EMOJI.test(html)).toBe(false);
  });
});

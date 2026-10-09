/* eslint-env jest, node */
/**
 * Messages éphémères (showMessage) : un seul à la fois. Deux messages rapprochés ne
 * se superposent plus : le second remplace le texte du premier.
 * Défilement : immédiat quand le système demande de réduire les animations.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const { showMessage, preferredScrollBehavior, keepNumbersTogether, createResultsSummary } =
  await import('../js/ui-feedback.js');

beforeEach(() => {
  jest.useFakeTimers();
  document.body.innerHTML = '';
});

afterEach(() => {
  jest.useRealTimers();
  delete globalThis.matchMedia;
});

describe('showMessage', () => {
  test('deux messages rapprochés : un seul toast, le texte le plus récent', () => {
    showMessage('Thème Classique appliqué !');
    jest.advanceTimersByTime(1000);
    showMessage('Thème Orangé appliqué !');
    jest.advanceTimersByTime(10);

    const popups = document.querySelectorAll('.message-popup');
    expect(popups).toHaveLength(1);
    expect(popups[0].textContent).toBe('Thème Orangé appliqué !');
    expect(popups[0].getAttribute('role')).toBe('status');
  });

  test('le second message repousse la disparition, puis le toast s’en va', () => {
    showMessage('Premier');
    jest.advanceTimersByTime(2500);
    showMessage('Second');
    jest.advanceTimersByTime(2500);
    expect(document.querySelector('.message-popup.active')).not.toBeNull();

    jest.advanceTimersByTime(900);
    expect(document.querySelector('.message-popup')).toBeNull();
  });

  test('un toast retiré de la page est recréé au message suivant', () => {
    showMessage('Premier');
    jest.advanceTimersByTime(10);
    document.body.innerHTML = '';
    showMessage('Second');
    jest.advanceTimersByTime(10);
    expect(document.querySelector('.message-popup').textContent).toBe('Second');
  });
});

describe('showMessage ne cache aucune commande (« Défi du jour terminé » au téléphone)', () => {
  const RAISED = 'is-raised';
  let boxes;
  let saved;

  /** Boîte d'un élément : sa place à l'écran (jsdom ne calcule aucune mise en page) */
  const rect = ([top, bottom], [left, right] = [0, 390]) => ({
    top,
    bottom,
    left,
    right,
    width: right - left,
    height: bottom - top,
  });

  /** Une commande posée à l'écran */
  function control(id, vertical, horizontal) {
    const button = document.createElement('button');
    button.id = id;
    document.body.append(button);
    boxes.set(button, rect(vertical, horizontal));
    return button;
  }

  /** Écran du téléphone et taille du message, à sa place en bas (24 px du bord) */
  function screen(height, width, message) {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
    const metrics = {
      offsetWidth: () => message.width,
      offsetHeight: () => message.height,
      offsetTop(el) {
        return el.classList.contains(RAISED)
          ? Number.parseFloat(el.style.getPropertyValue('--message-top'))
          : height - 24 - message.height;
      },
    };
    for (const [name, value] of Object.entries(metrics)) {
      Object.defineProperty(HTMLElement.prototype, name, {
        configurable: true,
        get() {
          return this.classList.contains('message-popup') ? value(this) : 0;
        },
      });
    }
  }

  /** La barre du haut de l'écran affiché et ses boutons */
  function topBar(vertical) {
    const slide = document.createElement('section');
    slide.className = 'slide active-slide';
    const bar = document.createElement('div');
    bar.className = 'top-bar';
    slide.append(bar);
    document.body.append(slide);
    boxes.set(bar, rect(vertical));
    control('home', vertical, [20, 64]);
  }

  const popup = () => document.querySelector('.message-popup');
  const raisedTop = () =>
    popup().classList.contains(RAISED)
      ? Number.parseFloat(popup().style.getPropertyValue('--message-top'))
      : null;

  beforeEach(() => {
    boxes = new Map();
    saved = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function () {
      return boxes.get(this) ?? rect([0, 0], [0, 0]);
    };
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = saved;
    for (const name of ['offsetWidth', 'offsetHeight', 'offsetTop']) {
      delete HTMLElement.prototype[name];
    }
    delete window.innerHeight;
    delete window.innerWidth;
  });

  test('aucune commande sous sa place, en bas : il y reste', () => {
    screen(844, 390, { width: 351, height: 66 });
    topBar([17, 65]);
    control('option', [548, 620], [30, 190]);
    showMessage('Bravo ! Tu as terminé le défi du jour !');
    jest.advanceTimersByTime(10);
    expect(raisedTop()).toBeNull();
  });

  test('portrait : « Abandonner » dessous et pas la place au-dessus, il passe sous la barre du haut', () => {
    screen(844, 390, { width: 351, height: 66 });
    topBar([17, 65]);
    control('option', [548, 692], [30, 360]);
    control('abandon', [754, 802], [126, 263]);
    showMessage('Bravo ! Tu as terminé le défi du jour !');
    jest.advanceTimersByTime(10);
    expect(raisedTop()).toBe(73);
  });

  test('paysage, page en bas : il se pose juste au-dessus de « Abandonner », entre les réponses', () => {
    screen(390, 844, { width: 515, height: 47 });
    topBar([-220, -172]);
    control('option', [120, 190], [134, 710]);
    control('abandon', [300, 338], [353, 490]);
    showMessage('Bravo ! Tu as terminé le défi du jour !');
    jest.advanceTimersByTime(10);
    expect(raisedTop()).toBe(245);
  });

  test('nulle part sans commande : il garde sa place en bas', () => {
    screen(390, 844, { width: 515, height: 47 });
    control('grid', [0, 390], [0, 844]);
    showMessage('Bravo ! Tu as terminé le défi du jour !');
    jest.advanceTimersByTime(10);
    expect(raisedTop()).toBeNull();
  });

  test('la page défile pendant le message : il se repose, sans jamais passer sur une commande', () => {
    screen(390, 844, { width: 515, height: 47 });
    topBar([-220, -172]);
    const option = control('option', [120, 190], [134, 710]);
    const abandon = control('abandon', [300, 338], [353, 490]);
    showMessage('Bravo ! Tu as terminé le défi du jour !');
    jest.advanceTimersByTime(10);
    expect(raisedTop()).toBe(245);
    // L'enfant remonte : la barre du haut revient, « Abandonner » sort par le bas
    boxes.set(document.querySelector('.top-bar'), rect([17, 65]));
    boxes.set(document.getElementById('home'), rect([17, 65], [20, 64]));
    boxes.set(option, rect([250, 320], [134, 710]));
    boxes.set(abandon, rect([430, 468], [353, 490]));
    document.dispatchEvent(new Event('scroll'));
    jest.advanceTimersByTime(20);
    expect(raisedTop()).toBe(73);
    // Sa disparition arrête le suivi
    jest.advanceTimersByTime(3500);
    expect(popup()).toBeNull();
  });
});

describe('Défilement et typographie', () => {
  test('mouvement réduit : défilement immédiat', () => {
    globalThis.matchMedia = query => ({ matches: query.includes('reduce') });
    expect(preferredScrollBehavior()).toBe('auto');
    globalThis.matchMedia = () => ({ matches: false });
    expect(preferredScrollBehavior()).toBe('smooth');
  });

  test('« = » et un nombre restent collés à leurs voisins', () => {
    expect(keepNumbersTogether('Une semaine = 7 jours')).toBe(
      'Une semaine\u00a0=\u00a07\u00a0jours'
    );
  });
});

describe('Écran de fin', () => {
  test('la phrase principale est le titre de niveau 1 de l’écran ; un écran titré la garde en texte', () => {
    const lead = createResultsSummary({ lead: '7 bonnes réponses sur 10' }).firstChild;
    expect(lead.tagName).toBe('H1');
    expect(lead.className).toBe('results-lead');
    // L'Aventure a son propre titre (« Niveau terminé ») : la phrase y reste un paragraphe
    expect(createResultsSummary({ lead: 'x', leadTag: 'p' }).firstChild.tagName).toBe('P');
  });
});

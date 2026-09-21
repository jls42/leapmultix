/* eslint-env jest, node */
/**
 * Messages éphémères (showMessage) : un seul à la fois. Deux messages rapprochés ne
 * se superposent plus : le second remplace le texte du premier.
 * Défilement : immédiat quand le système demande de réduire les animations.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const { showMessage, preferredScrollBehavior, keepNumbersTogether } = await import(
  '../js/ui-feedback.js'
);

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

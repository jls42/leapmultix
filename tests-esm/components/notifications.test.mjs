import { describe, beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import { showNotification } from '../../js/notifications.js';

describe('showNotification : toast empilé et annoncé', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.textContent = '';
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.textContent = '';
  });

  test('crée une zone « status » polie, puis le contenu après insertion', () => {
    const toast = showNotification('badge', '🏆', 'As du Défi', {
      title: 'Nouveau badge débloqué',
    });

    const stack = document.getElementById('toast-stack');
    expect(stack).toBeTruthy();
    expect(stack.getAttribute('role')).toBe('status');
    expect(stack.getAttribute('aria-live')).toBe('polite');
    expect(stack.contains(toast)).toBe(true);
    expect(toast.className).toBe('notification notification-badge');
    // Le texte arrive après l'insertion, pour que la région live l'annonce
    expect(toast.textContent).toBe('');

    jest.advanceTimersByTime(10);
    expect(toast.classList.contains('active')).toBe(true);
    const icon = toast.querySelector('.notification-icon');
    expect(icon.textContent).toBe('🏆');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(toast.querySelector('.notification-title').textContent).toBe('Nouveau badge débloqué');
    expect(toast.querySelector('.notification-message').textContent).toBe('As du Défi');
  });

  test('sans image ni titre : seulement le message', () => {
    const toast = showNotification('info', '', 'Attention à l’avatar');
    jest.advanceTimersByTime(10);
    expect(toast.querySelector('.notification-icon')).toBeNull();
    expect(toast.querySelector('.notification-title')).toBeNull();
    expect(toast.textContent).toBe('Attention à l’avatar');
  });

  test('plusieurs toasts partagent la même zone puis disparaissent', () => {
    const first = showNotification('badge', '🎓', 'Apprenti du Quiz');
    const second = showNotification('badge', '💯', 'Quiz Parfait');
    expect(document.querySelectorAll('#toast-stack')).toHaveLength(1);
    expect(document.getElementById('toast-stack').children).toHaveLength(2);

    jest.advanceTimersByTime(6000);
    expect(first.classList.contains('active')).toBe(false);
    expect(first.isConnected).toBe(true);

    jest.advanceTimersByTime(400);
    expect(first.isConnected).toBe(false);
    expect(second.isConnected).toBe(false);
  });
});

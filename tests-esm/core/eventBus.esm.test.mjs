/**
 * @jest-environment jsdom
 */
import { eventBus } from '../../js/core/eventBus.js';

describe('EventBus Core Module (ESM)', () => {
  let testHandler;
  let eventData;

  beforeEach(() => {
    eventData = null;
    testHandler = event => {
      eventData = event.detail;
    };
  });

  afterEach(() => {
    // Clean up event listeners
    if (testHandler) {
      eventBus.off('test-event', testHandler);
      eventBus.off('another-event', testHandler);
    }
  });

  describe('on() - Event Registration', () => {
    test("devrait enregistrer un handler d'événement", () => {
      eventBus.on('test-event', testHandler);
      eventBus.emit('test-event', { message: 'test' });

      expect(eventData).toEqual({ message: 'test' });
    });

    test('ne devrait pas enregistrer avec handler invalide', () => {
      eventBus.on('test-event', null);
      eventBus.on('test-event', 'not-a-function');
      eventBus.emit('test-event', { message: 'test' });

      expect(eventData).toBeNull();
    });

    test('ne devrait pas enregistrer avec event name vide', () => {
      eventBus.on('', testHandler);
      eventBus.on(null, testHandler);
      eventBus.emit('', { message: 'test' });

      expect(eventData).toBeNull();
    });
  });

  describe('off() - Event Deregistration', () => {
    test("devrait retirer un handler d'événement", () => {
      eventBus.on('test-event', testHandler);
      eventBus.emit('test-event', { message: 'first' });
      expect(eventData).toEqual({ message: 'first' });

      eventBus.off('test-event', testHandler);
      eventBus.emit('test-event', { message: 'second' });
      expect(eventData).toEqual({ message: 'first' }); // Pas changé
    });
  });

  describe('emit() - Event Emission', () => {
    test('devrait émettre un événement avec détail', () => {
      eventBus.on('test-event', testHandler);
      const result = eventBus.emit('test-event', { count: 42 });

      expect(eventData).toEqual({ count: 42 });
      expect(result).toBe(true);
    });

    test('devrait retourner false pour événement vide', () => {
      const result1 = eventBus.emit('');
      const result2 = eventBus.emit(null);

      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    test("devrait normaliser les noms d'événement", () => {
      eventBus.on('test-event', testHandler);
      eventBus.emit('  test-event  ', { trimmed: true });

      expect(eventData).toEqual({ trimmed: true });
    });
  });

  describe('Robustesse', () => {
    test("devrait gérer les conversions de type d'événement", () => {
      eventBus.on('123', testHandler);
      eventBus.emit(123, { number: true });

      expect(eventData).toEqual({ number: true });
    });

    test('devrait gérer les erreurs gracieusement', () => {
      expect(() => {
        eventBus.emit('weird-event', { test: true });
        eventBus.emit(123);
        eventBus.off('nonexistent', () => {});
      }).not.toThrow();
    });
  });
});
/* eslint-env jest, node */

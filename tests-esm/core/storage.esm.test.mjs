/* eslint-env jest, node */
/**
 * Stockage (js/core/storage.js) : le vrai module, sur le localStorage de test. Remplace un
 * ancien test qui vérifiait une copie du module écrite dans le test lui-même (il restait vert
 * même quand Storage.get ne rendait plus rien de juste).
 */
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const {
  default: Storage,
  STORAGE_KEYS,
  getCurrentDateString,
} = await import('../../js/core/storage.js');

beforeEach(() => {
  localStorage.clear();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});

describe('Lecture et écriture', () => {
  test('valeur absente : la valeur par défaut ; JSON relu tel quel ; texte simple rendu en texte', () => {
    expect(Storage.get('absente', 'défaut')).toBe('défaut');
    localStorage.setItem('objet', JSON.stringify({ a: [1, 2] }));
    expect(Storage.get('objet')).toEqual({ a: [1, 2] });
    localStorage.setItem('texte', 'pas du JSON');
    expect(Storage.get('texte')).toBe('pas du JSON');
  });

  test('écriture : JSON pour un objet, la chaîne telle quelle pour une chaîne', () => {
    expect(Storage.set('objet', { b: 3 })).toBe(true);
    expect(localStorage.getItem('objet')).toBe('{"b":3}');
    expect(Storage.trySet('autre', { c: 4 })).toBe(true);
    expect(localStorage.getItem('autre')).toBe('{"c":4}');
    expect(Storage.set('langue', 'es')).toBe(true);
    expect(localStorage.getItem('langue')).toBe('es');
  });

  test('lecture refusée par le navigateur : la valeur par défaut, l’erreur journalisée', () => {
    jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(Storage.get('players', {})).toEqual({});
    expect(console.error).toHaveBeenCalled();
  });

  test('écriture refusée : set rend faux et journalise ; trySet rend faux sans journal', () => {
    jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(Storage.set('players', { Léa: {} })).toBe(false);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(Storage.trySet('players', { Léa: {} })).toBe(false);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  test('suppression : la clé part ; un refus du navigateur ne lève rien', () => {
    localStorage.setItem('volume', '0.5');
    Storage.remove('volume');
    expect(localStorage.getItem('volume')).toBeNull();
    jest.spyOn(localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(() => Storage.remove('volume')).not.toThrow();
  });
});

describe('Joueurs et préférences', () => {
  test('données d’un joueur : sa propre entrée, jamais une propriété héritée', () => {
    Storage.savePlayers({ Léa: { coins: 4 } });
    expect(Storage.getUserData('Léa')).toEqual({ coins: 4 });
    expect(Storage.getUserData('toString')).toEqual({});
    expect(Storage.getUserData('')).toEqual({});
    expect(Storage.loadPlayers()).toEqual({ Léa: { coins: 4 } });
  });

  test('préférences : valeurs par défaut, puis celles enregistrées', () => {
    expect(Storage.loadLanguage()).toBe('fr');
    expect(Storage.loadColorTheme()).toBe('default');
    expect(Storage.loadVoiceEnabled()).toBe(false);
    expect(Storage.loadHighContrastEnabled()).toBe(false);
    expect(Storage.loadFontSize()).toBe('medium');
    Storage.saveLanguage('en');
    Storage.saveColorTheme('dark');
    Storage.saveVoiceEnabled(true);
    Storage.saveHighContrastEnabled(true);
    Storage.saveFontSize('large');
    expect(Storage.loadLanguage()).toBe('en');
    expect(Storage.loadColorTheme()).toBe('dark');
    expect(Storage.loadVoiceEnabled()).toBe(true);
    expect(Storage.loadHighContrastEnabled()).toBe(true);
    expect(Storage.loadFontSize()).toBe('large');
    expect(localStorage.getItem(STORAGE_KEYS.LANGUAGE)).toBe('en');
  });

  test('volume : celui du joueur d’abord, borné entre 0 et 1 ; sinon le volume de l’appareil', () => {
    const players = { Léa: { volume: 1.7 }, Noé: {} };
    expect(Storage.loadVolume('Léa', players)).toBe(1);
    Storage.set(STORAGE_KEYS.VOLUME, -0.2);
    expect(Storage.loadVolume('Noé', players)).toBe(0);
    expect(Storage.loadVolume()).toBe(0);
  });

  test('volume enregistré pour l’appareil et pour le joueur', () => {
    const players = { Léa: { volume: 1 } };
    Storage.saveVolume(0.4, 'Léa', players);
    expect(Storage.get(STORAGE_KEYS.VOLUME)).toBe(0.4);
    expect(Storage.loadPlayers()).toEqual({ Léa: { volume: 0.4 } });
  });

  test('date du jour : celle de l’appareil, en AAAA-MM-JJ', () => {
    expect(getCurrentDateString(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });
});

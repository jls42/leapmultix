/* eslint-env jest, node */
/**
 * Refus de la mesure d'audience (js/core/audience-refusal.js) : retenu sur l'appareil sous la
 * clé et la valeur que lit le traceur de Plausible, et jamais d'erreur quand le navigateur
 * interdit le stockage.
 */
import { afterEach, describe, expect, test } from '@jest/globals';
import {
  AUDIENCE_REFUSAL_KEY,
  isAudienceRefused,
  setAudienceRefused,
} from '../../js/core/audience-refusal.js';

afterEach(() => localStorage.clear());

/** Stockage qui refuse tout, comme un navigateur réglé pour l'interdire */
const forbidden = {
  getItem() {
    throw new Error('interdit');
  },
  setItem() {
    throw new Error('interdit');
  },
  removeItem() {
    throw new Error('interdit');
  },
};

describe('Refus de la mesure d’audience', () => {
  test('la clé et la valeur sont celles que lit le traceur de Plausible', () => {
    expect(AUDIENCE_REFUSAL_KEY).toBe('plausible_ignore');
    expect(setAudienceRefused(true)).toBe(true);
    expect(localStorage.getItem('plausible_ignore')).toBe('true');
    expect(isAudienceRefused()).toBe(true);
  });

  test('aucun refus par défaut, et un refus levé ne laisse rien sur l’appareil', () => {
    expect(isAudienceRefused()).toBe(false);
    setAudienceRefused(true);
    expect(setAudienceRefused(false)).toBe(true);
    expect(localStorage.getItem('plausible_ignore')).toBeNull();
    expect(isAudienceRefused()).toBe(false);
  });

  test('seule la valeur « true » vaut refus (celle que le traceur reconnaît)', () => {
    localStorage.setItem('plausible_ignore', 'false');
    expect(isAudienceRefused()).toBe(false);
    localStorage.setItem('plausible_ignore', '1');
    expect(isAudienceRefused()).toBe(false);
  });

  test('stockage interdit ou absent : pas d’erreur, et le choix est dit non retenu', () => {
    expect(isAudienceRefused(forbidden)).toBe(false);
    expect(setAudienceRefused(true, forbidden)).toBe(false);
    expect(isAudienceRefused(null)).toBe(false);
    expect(setAudienceRefused(true, null)).toBe(false);
  });
});

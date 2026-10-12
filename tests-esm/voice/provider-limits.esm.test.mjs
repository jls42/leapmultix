/**
 * @jest-environment node
 *
 * Limites des appels aux fournisseurs de voix : l'adresse remplacée par l'environnement
 * (*_BASE_URL) reçoit la clé de l'API, donc https ou boucle locale seulement ; un délai
 * annoncé démesuré (retry-after) arrête l'exécution au lieu d'un nouvel essai immédiat.
 */
import { describe, expect, jest, test } from '@jest/globals';
import { ProviderError, checkedBaseUrl } from '../../scripts/voice/providers/common.mjs';
import { MAX_RETRY_AFTER_MS, withRetries } from '../../scripts/voice/generate.mjs';

describe('Adresse d’un fournisseur remplacée', () => {
  test.each([undefined, ''])('%j : l’adresse par défaut', value => {
    expect(checkedBaseUrl(value, 'ELEVENLABS_BASE_URL')).toBeUndefined();
  });

  test.each(['https://api.exemple.org', 'http://localhost:8080', 'http://127.0.0.1:3000/v1'])(
    '%s : acceptée',
    value => {
      expect(checkedBaseUrl(value, 'ELEVENLABS_BASE_URL')).toBe(value);
    }
  );

  test.each(['http://api.exemple.org', 'file:///etc/passwd', 'ftp://x', 'pas une adresse'])(
    '%s : refusée',
    value => {
      expect(() => checkedBaseUrl(value, 'ELEVENLABS_BASE_URL')).toThrow('ELEVENLABS_BASE_URL');
    }
  );
});

describe('Délai annoncé par le fournisseur', () => {
  const rateError = retryAfterMs => new ProviderError('rate', 'trop de requêtes', { retryAfterMs });

  test('délai raisonnable : attendu, puis nouvel essai', async () => {
    const sleep = jest.fn(async () => {});
    const task = jest.fn().mockRejectedValueOnce(rateError(3000)).mockResolvedValueOnce('clip');
    expect(await withRetries(task, { delays: [1000, 2000], sleep })).toBe('clip');
    expect(sleep).toHaveBeenCalledWith(3000);
  });

  test('délai démesuré : arrêt, sans attente ni nouvel essai', async () => {
    const sleep = jest.fn(async () => {});
    const task = jest.fn().mockRejectedValue(rateError(MAX_RETRY_AFTER_MS + 1));
    await expect(withRetries(task, { delays: [1000, 2000], sleep })).rejects.toThrow(
      'trop de requêtes'
    );
    expect(sleep).not.toHaveBeenCalled();
    expect(task).toHaveBeenCalledTimes(1);
  });
});

/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Appel HTTP des fournisseurs (scripts/voice/providers/common.mjs, httpCaller) : une redirection
 * n'est jamais suivie. Vers une autre origine, fetch retire Authorization (Mistral) mais garde
 * xi-api-key (ElevenLabs) et x-goog-api-key (Google), corps compris : la clé partirait chez le
 * destinataire de la redirection.
 */
import { describe, test, expect, afterEach } from '@jest/globals';
import http from 'node:http';
import { ProviderError, httpCaller } from '../../scripts/voice/providers/common.mjs';

const KEY = 'cle-factice-0123456789';

/** Petit serveur local : note chaque requête, puis répond par respond(res) */
async function startServer(respond) {
  const requests = [];
  const server = http.createServer((req, res) => {
    requests.push({ url: req.url, headers: req.headers });
    respond(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    requests,
    close: () =>
      new Promise(resolve => {
        server.closeAllConnections();
        server.close(resolve);
      }),
  };
}

let servers = [];

afterEach(async () => {
  await Promise.all(servers.map(server => server.close()));
  servers = [];
});

describe('Appel des fournisseurs', () => {
  test.each([
    ['ElevenLabs', { 'xi-api-key': KEY }],
    ['Google', { 'x-goog-api-key': KEY }],
    ['Mistral', { Authorization: `Bearer ${KEY}` }],
  ])(
    '%s : redirection vers une autre origine non suivie, la clé reste chez elle',
    async (label, authHeaders) => {
      const elsewhere = await startServer(res => res.writeHead(200).end('{}'));
      const redirecting = await startServer(res =>
        res.writeHead(307, { Location: `${elsewhere.url}/ailleurs` }).end()
      );
      servers = [elsewhere, redirecting];
      const call = httpCaller({
        label,
        apiKey: KEY,
        authHeaders,
        baseUrl: redirecting.url,
        fetchImpl: fetch,
        errorFrom: async res => new ProviderError('request', `${label} ${res.status}`),
      });

      const error = await call('/v1/synthese', {
        method: 'POST',
        body: '{"text":"Bravo !"}',
      }).catch(caught => caught);

      expect(error).toBeInstanceOf(ProviderError);
      // Arrêt de toute l'exécution, comme une réponse inutilisable
      expect(error.kind).toBe('response');
      expect(error.message).toContain('307');
      expect(error.message).not.toContain(KEY);
      expect(redirecting.requests).toHaveLength(1);
      expect(elsewhere.requests).toEqual([]);
    }
  );
});

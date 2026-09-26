/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Fournisseur Google Cloud Text-to-Speech (scripts/voice/providers/google.mjs) et génération des
 * clips espagnols avec lui (scripts/voice/generate.mjs) : requête exacte, brut WAV sans perte,
 * erreurs telles que l'API les renvoie (relevées le 26/09/2026), clé propre au fournisseur, bruts
 * WAV gardés d'une exécution à l'autre.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { voiceKey } from '../../js/core/spoken-text.js';
import { parseLanguage } from '../../js/core/voice-index.js';
import { createGoogle, googleErrorDetail } from '../../scripts/voice/providers/google.mjs';
import { ProviderError } from '../../scripts/voice/providers/common.mjs';
import { loadVoice, openProvider, runGeneration } from '../../scripts/voice/generate.mjs';
import {
  rawExtension,
  rawKeyOf,
  storePaths,
  synthesisHash,
} from '../../scripts/voice/clip-store.mjs';

const KEY = 'AIzaCleFactice0123456789';
const VOICE = { ...loadVoice('es'), version: 'test-es-1' };
/** Un WAV minimal : en-tête RIFF/WAVE, puis le texte pour reconnaître chaque brut */
const fakeWav = text =>
  Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WAVEfmt '), Buffer.from(text)]);
const fakeMp3 = text => Buffer.concat([Buffer.from([0xff, 0xfb, 0x90, 0x64]), Buffer.from(text)]);
const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
const audioReply = audio => json(200, { audioContent: audio.toString('base64') });
/** Corps d'erreur au format de Google, avec la raison quand l'API en donne une */
const googleError = (code, status, message, reason) => ({
  error: {
    code,
    message,
    status,
    ...(reason
      ? { details: [{ '@type': 'type.googleapis.com/google.rpc.ErrorInfo', reason }] }
      : {}),
  },
});

/** Fournisseur branché sur une fausse fonction fetch qui garde chaque appel */
function providerWith(reply) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init, body: init?.body ? JSON.parse(init.body) : null });
    return reply(url, init);
  };
  return {
    provider: createGoogle({ apiKey: KEY, baseUrl: 'https://tts.test', fetchImpl }),
    calls,
  };
}

async function errorOf(promise) {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('aucune erreur');
}

describe('Fournisseur Google : requête et réponse', () => {
  test('synthèse : requête exacte, WAV sans perte (LINEAR16), ni identifiant ni coût', async () => {
    const { provider, calls } = providerWith(() => audioReply(fakeWav('Modo Quiz')));
    const result = await provider.synthesize({ text: 'Modo Quiz', voice: VOICE });
    expect(calls[0].url).toBe('https://tts.test/v1/text:synthesize');
    expect(calls[0].init.method).toBe('POST');
    // La clé part dans l'en-tête, jamais dans l'adresse (qui finit dans les journaux)
    expect(calls[0].init.headers['x-goog-api-key']).toBe(KEY);
    expect(calls[0].url).not.toContain(KEY);
    expect(calls[0].body).toEqual({
      input: { text: 'Modo Quiz' },
      voice: { languageCode: 'es-ES', name: 'es-ES-Chirp3-HD-Sulafat' },
      audioConfig: { audioEncoding: 'LINEAR16' },
    });
    expect(result).toEqual({ audio: fakeWav('Modo Quiz'), requestId: null, cost: null });
  });

  test('voix en MP3 : encodage MP3 demandé, réponse contrôlée comme un MP3', async () => {
    const mp3Voice = { ...VOICE, sourceFormat: 'mp3' };
    const { provider, calls } = providerWith(() => audioReply(fakeMp3('a')));
    expect((await provider.synthesize({ text: 'a', voice: mp3Voice })).audio).toEqual(fakeMp3('a'));
    expect(calls[0].body.audioConfig).toEqual({ audioEncoding: 'MP3' });
    const wavForMp3 = providerWith(() => audioReply(fakeWav('a')));
    const error = await errorOf(wavForMp3.provider.synthesize({ text: 'a', voice: mp3Voice }));
    expect(error.kind).toBe('response');
  });

  test('voix cherchée dans la liste de sa langue ; absente : voice ; aucun solde lisible', async () => {
    const listed = names => json(200, { voices: names.map(name => ({ name })) });
    const found = providerWith(() => listed(['es-ES-Chirp3-HD-Kore', 'es-ES-Chirp3-HD-Sulafat']));
    await found.provider.checkVoice(VOICE);
    expect(found.calls[0].url).toBe('https://tts.test/v1/voices?languageCode=es-ES');
    const missing = providerWith(() => listed(['es-ES-Chirp3-HD-Kore']));
    const error = await errorOf(missing.provider.checkVoice(VOICE));
    expect(error.kind).toBe('voice');
    expect(error.message).toContain('es-ES-Chirp3-HD-Sulafat introuvable pour es-ES');
    expect(await found.provider.credits()).toBeNull();
  });

  test.each([
    ['sans audioContent', () => json(200, {})],
    ['audio qui n’est pas un WAV', () => audioReply(Buffer.from('<html>'))],
    ['corps illisible', () => new Response('pas du JSON', { status: 200 })],
  ])('%s : réponse payée inutilisable (response)', async (_label, reply) => {
    const { provider } = providerWith(reply);
    const error = await errorOf(provider.synthesize({ text: 'a', voice: VOICE }));
    expect(error).toBeInstanceOf(ProviderError);
    expect(error.kind).toBe('response');
  });

  test('format source inconnu : erreur de réglage (voice), avant tout appel', async () => {
    const { provider, calls } = providerWith(() => audioReply(fakeWav('a')));
    const oggVoice = { ...VOICE, sourceFormat: 'ogg' };
    expect((await errorOf(provider.synthesize({ text: 'a', voice: oggVoice }))).kind).toBe('voice');
    expect((await errorOf(provider.checkVoice(oggVoice))).kind).toBe('voice');
    expect(calls).toHaveLength(0);
  });
});

/** Erreurs réelles de Cloud TTS (26/09/2026) : [cas, statut, corps, kind attendu, fragment] */
const REAL_ERRORS = [
  [
    'voix inconnue',
    400,
    googleError(400, 'INVALID_ARGUMENT', "Voice 'es-ES-X' does not exist. Is it misspelled?"),
    'voice',
    'does not exist',
  ],
  [
    'clé invalide',
    400,
    googleError(400, 'INVALID_ARGUMENT', 'API key not valid.', 'API_KEY_INVALID'),
    'auth',
    'API_KEY_INVALID',
  ],
  [
    'clé restreinte à une autre API',
    403,
    googleError(
      403,
      'PERMISSION_DENIED',
      'Requests to this API are blocked.',
      'API_KEY_SERVICE_BLOCKED'
    ),
    'auth',
    'blocked',
  ],
  [
    'clé liée à un compte de service',
    401,
    googleError(
      401,
      'UNAUTHENTICATED',
      'API keys are not supported by this API.',
      'CREDENTIALS_MISSING'
    ),
    'auth',
    'not supported',
  ],
  [
    'API désactivée',
    403,
    googleError(403, 'PERMISSION_DENIED', 'The API is disabled.', 'SERVICE_DISABLED'),
    'auth',
    'disabled',
  ],
  [
    'facturation absente',
    403,
    googleError(
      403,
      'PERMISSION_DENIED',
      'This API method requires billing to be enabled.',
      'BILLING_DISABLED'
    ),
    'quota',
    'billing',
  ],
  [
    'texte refusé',
    400,
    googleError(400, 'INVALID_ARGUMENT', 'This request contains sentences that are too long.'),
    'request',
    'too long',
  ],
  [
    'autre refus',
    403,
    googleError(403, 'PERMISSION_DENIED', 'Permission denied.'),
    'auth',
    'Permission',
  ],
  [
    'débit dépassé',
    429,
    googleError(429, 'RESOURCE_EXHAUSTED', 'Quota exceeded.'),
    'rate',
    'Quota',
  ],
  [
    'panne',
    503,
    googleError(503, 'UNAVAILABLE', 'The service is unavailable.'),
    'server',
    'unavailable',
  ],
];

describe('Fournisseur Google : classement des erreurs réelles', () => {
  test.each(REAL_ERRORS)('%s → %s', async (_label, status, body, kind, fragment) => {
    const { provider } = providerWith(() => json(status, body));
    const error = await errorOf(provider.synthesize({ text: 'a', voice: VOICE }));
    expect(error).toBeInstanceOf(ProviderError);
    expect(error.kind).toBe(kind);
    expect(error.message).toContain(fragment);
    expect(error.message).not.toContain(KEY);
  });

  test('erreur sans corps lisible : classée par son statut, message réduit au statut', async () => {
    const { provider } = providerWith(() => new Response('oups', { status: 500 }));
    const error = await errorOf(provider.synthesize({ text: 'a', voice: VOICE }));
    expect(error.kind).toBe('server');
    expect(error.message).toBe('Google TTS 500');
  });
});

describe('Fournisseur Google : délai, réseau, clé', () => {
  test('débit dépassé : le délai annoncé est gardé ; pas pour une erreur définitive', async () => {
    const rate = providerWith(() =>
      json(429, googleError(429, 'RESOURCE_EXHAUSTED', 'Quota exceeded.'), { 'retry-after': '7' })
    );
    expect(
      (await errorOf(rate.provider.synthesize({ text: 'a', voice: VOICE }))).retryAfterMs
    ).toBe(7000);
    const auth = providerWith(() =>
      json(401, googleError(401, 'UNAUTHENTICATED', 'No.'), { 'retry-after': '7' })
    );
    expect(
      (await errorOf(auth.provider.synthesize({ text: 'a', voice: VOICE }))).retryAfterMs
    ).toBeUndefined();
  });

  test('réseau coupé : network, sans jamais citer la clé', async () => {
    const { provider } = providerWith(() => {
      throw new TypeError(`fetch failed (x-goog-api-key: ${KEY})`);
    });
    const error = await errorOf(provider.synthesize({ text: 'a', voice: VOICE }));
    expect(error.kind).toBe('network');
    expect(error.message).not.toContain(KEY);
  });

  test('clé absente ou mal formée : auth, avec le nom de la variable', () => {
    expect(() => createGoogle({ apiKey: '' })).toThrow('GOOGLE_TTS_API_KEY manquante');
    expect(() => createGoogle({ apiKey: 'AIza cle' })).toThrow('GOOGLE_TTS_API_KEY mal formée');
  });

  test.each([null, 'Bad Request', 42, {}, { error: 'texte' }])(
    'corps sans erreur lisible (%j) : message vide, sans planter',
    body => {
      expect(googleErrorDetail(body)).toEqual({ message: '' });
    }
  );
});

describe('Sulafat (Chirp 3 HD), en espagnol et en anglais', () => {
  test('entrée de voices.json : admise par l’index du jeu, brut WAV, bruts à part', () => {
    const es = loadVoice('es');
    expect(es).toMatchObject({
      provider: 'google',
      voice: 'sulafat',
      version: 'sulafat-v1-1',
      voiceId: 'es-ES-Chirp3-HD-Sulafat',
      languageCode: 'es-ES',
      sourceFormat: 'wav',
    });
    const entry = { voice: es.voice, version: es.version, format: 'mp3', audience: 'test' };
    expect(parseLanguage({ ...entry, defaultOn: false })).not.toBeNull();
    expect(rawExtension(es.sourceFormat)).toBe('wav');
    expect(synthesisHash(es)).not.toBe(synthesisHash(loadVoice('fr')));
  });

  test('anglais : Sulafat aussi, en britannique ; bruts à part de l’espagnol', () => {
    const en = loadVoice('en');
    expect(en).toMatchObject({
      provider: 'google',
      voice: 'sulafat',
      version: 'sulafat-v1-1',
      voiceId: 'en-GB-Chirp3-HD-Sulafat',
      languageCode: 'en-GB',
      sourceFormat: 'wav',
    });
    const entry = { voice: en.voice, version: en.version, format: 'mp3', audience: 'test' };
    expect(parseLanguage({ ...entry, defaultOn: false })).not.toBeNull();
    expect(synthesisHash(en)).not.toBe(synthesisHash(loadVoice('es')));
  });

  test('bruts : .wav pour une voix WAV, .mp3 sinon ; les deux se reconnaissent', () => {
    expect(rawExtension('wav')).toBe('wav');
    expect(rawExtension('mp3')).toBe('mp3');
    expect(rawExtension('mp3_44100_128')).toBe('mp3');
    expect(rawKeyOf('abc123-0123456789ab.wav')).toEqual({ key: 'abc123', hash: '0123456789ab' });
    expect(rawKeyOf('abc123-0123456789ab.mp3')).toEqual({ key: 'abc123', hash: '0123456789ab' });
    expect(rawKeyOf('abc123-0123456789ab.wav.part')).toBeNull();
    expect(rawKeyOf('abc123-0123456789ab.ogg')).toBeNull();
  });
});

describe('Génération avec Google (faux serveur)', () => {
  const phrase = (text, family) => ({ text, key: voiceKey(text), family, operator: null });
  const PHRASES = [
    phrase('Modo Quiz', 'annonce'),
    phrase('¡Muy bien!', 'bravo'),
    phrase('¡Inténtalo de nuevo!', 'phrase fixe'),
  ];
  let outDir;
  let server;
  let logs;

  async function startServer() {
    const requests = [];
    const srv = http.createServer(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString();
      const request = { url: req.url, headers: req.headers, body: raw ? JSON.parse(raw) : null };
      requests.push(request);
      const body = req.url.startsWith('/v1/voices')
        ? { voices: [{ name: VOICE.voiceId }] }
        : { audioContent: fakeWav(request.body.input.text).toString('base64') };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    });
    await new Promise(resolve => srv.listen(0, '127.0.0.1', resolve));
    return {
      url: `http://127.0.0.1:${srv.address().port}`,
      requests,
      synth: () => requests.filter(r => r.url === '/v1/text:synthesize'),
      close: () =>
        new Promise(resolve => {
          srv.closeAllConnections();
          srv.close(resolve);
        }),
    };
  }

  const fakeProcess = async (raw, out) => fsp.writeFile(out, await fsp.readFile(raw));
  const fakeProbe = async () => ({ duration: 1.2, codec: 'mp3', channels: 1, bitRate: 64000 });
  const run = () =>
    runGeneration({
      lang: 'es',
      phrases: PHRASES,
      voice: VOICE,
      outDir,
      provider: createGoogle({ apiKey: KEY, baseUrl: server.url }),
      concurrency: 1,
      processAudio: fakeProcess,
      probeAudio: fakeProbe,
      sleep: async () => {},
      log: message => logs.push(message),
    });
  const rawDir = () => storePaths(outDir, 'es', VOICE.version, synthesisHash(VOICE), 'wav').rawDir;
  const allFiles = dir =>
    fs.existsSync(dir)
      ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
          const full = path.join(dir, entry.name);
          return entry.isDirectory() ? allFiles(full) : [full];
        })
      : [];

  beforeEach(async () => {
    outDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'voices-google-'));
    logs = [];
    server = await startServer();
  });
  afterEach(async () => {
    await server?.close();
    server = null;
    await fsp.rm(outDir, { recursive: true, force: true });
  });

  test('bruts WAV rangés en .wav et gardés : une relance ne repaie rien', async () => {
    const first = await run();
    expect(first.generated).toBe(3);
    const raws = fs.readdirSync(rawDir());
    expect(raws).toHaveLength(3);
    expect(raws.every(name => name.endsWith('.wav'))).toBe(true);
    const second = await run();
    expect(second.generated).toBe(0);
    expect(second.staleRaw).toBe(0);
    expect(fs.readdirSync(rawDir())).toEqual(raws);
    expect(server.synth()).toHaveLength(3);
  });

  test('le texte dit part en lettres ; la clé ne part que dans x-goog-api-key, n’est écrite nulle part', async () => {
    await run();
    expect(server.synth().map(r => r.body.input.text)).toContain('Modo Quiz');
    expect(server.requests.every(r => r.headers['x-goog-api-key'] === KEY)).toBe(true);
    expect(server.requests.every(r => !r.url.includes(KEY))).toBe(true);
    for (const file of allFiles(outDir)) expect(fs.readFileSync(file).includes(KEY)).toBe(false);
    expect(logs.join('\n')).not.toContain(KEY);
  });
});

describe('Clé propre à Google', () => {
  let server;
  afterEach(async () => {
    await server?.close();
    server = null;
  });

  async function voicesServer(voices) {
    const seen = [];
    const srv = http.createServer((req, res) => {
      seen.push({ url: req.url, headers: req.headers });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ voices: voices.map(name => ({ name })) }));
    });
    await new Promise(resolve => srv.listen(0, '127.0.0.1', resolve));
    return {
      url: `http://127.0.0.1:${srv.address().port}`,
      seen,
      close: () => new Promise(resolve => srv.close(resolve)),
    };
  }

  test('Google lit GOOGLE_TTS_API_KEY et GOOGLE_TTS_BASE_URL', async () => {
    server = await voicesServer([VOICE.voiceId]);
    await openProvider(VOICE, {
      GOOGLE_TTS_API_KEY: 'cle-google',
      GOOGLE_TTS_BASE_URL: server.url,
    });
    expect(server.seen[0].url).toBe('/v1/voices?languageCode=es-ES');
    expect(server.seen[0].headers['x-goog-api-key']).toBe('cle-google');
  });

  test('clé d’un autre fournisseur seulement : refus nommé', async () => {
    await expect(openProvider(VOICE, { MISTRAL_API_KEY: 'cle-mistral' })).rejects.toThrow(
      'GOOGLE_TTS_API_KEY manquante'
    );
  });

  test('voix introuvable : conseil propre à Google', async () => {
    server = await voicesServer(['es-ES-Chirp3-HD-Kore']);
    await expect(
      openProvider(VOICE, { GOOGLE_TTS_API_KEY: 'cle-google', GOOGLE_TTS_BASE_URL: server.url })
    ).rejects.toThrow(/n'existe pas pour es-ES.*GET \/v1\/voices\?languageCode=es-ES/s);
  });
});

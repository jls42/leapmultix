/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Fournisseur Mistral (scripts/voice/providers/mistral.mjs) et génération des clips anglais
 * avec lui (scripts/voice/generate.mjs) : requête exacte, erreurs telles que l'API les
 * renvoie (relevées le 26/09/2026), modération (403) qui ne touche que sa phrase, registre
 * des caractères payés, plafond cumulé, clé propre à chaque fournisseur.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { voiceKey } from '../../js/core/spoken-text.js';
import { parseLanguage } from '../../js/core/voice-index.js';
import { createMistral } from '../../scripts/voice/providers/mistral.mjs';
import { createElevenLabs } from '../../scripts/voice/providers/elevenlabs.mjs';
import { ProviderError, errorDetail } from '../../scripts/voice/providers/common.mjs';
import {
  charCap,
  creditBudget,
  exitCodeFor,
  loadVoice,
  openProvider,
  runGeneration,
} from '../../scripts/voice/generate.mjs';
import {
  billedChars,
  storePaths,
  synthesisHash,
  voiceConfigHash,
} from '../../scripts/voice/clip-store.mjs';

const KEY = 'cle-factice-mistral-0123456789';
const VOICE = { ...loadVoice('en'), version: 'test-en-1' };
const fakeMp3 = text => Buffer.concat([Buffer.from([0xff, 0xfb, 0x90, 0x64]), Buffer.from(text)]);
const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
const audioReply = (text, headers) =>
  json(200, { audio_data: fakeMp3(text).toString('base64') }, headers);

/** Fournisseur branché sur une fausse fonction fetch qui garde chaque appel */
function providerWith(reply) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init, body: init?.body ? JSON.parse(init.body) : null });
    return reply(url, init);
  };
  return {
    provider: createMistral({ apiKey: KEY, baseUrl: 'https://mistral.test', fetchImpl }),
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

describe('Fournisseur Mistral : requête et réponse', () => {
  test('synthèse : requête exacte, audio décodé, identifiant de corrélation, coût inconnu', async () => {
    const { provider, calls } = providerWith(() =>
      audioReply('Quiz Mode', { 'mistral-correlation-id': 'corr-1' })
    );
    const result = await provider.synthesize({ text: 'Quiz Mode', voice: VOICE });
    expect(calls[0].url).toBe('https://mistral.test/v1/audio/speech');
    expect(calls[0].init.method).toBe('POST');
    expect(calls[0].init.headers.Authorization).toBe(`Bearer ${KEY}`);
    expect(calls[0].body).toEqual({
      model: 'voxtral-mini-tts-2603',
      input: 'Quiz Mode',
      voice_id: '82c99ee6-f932-423f-a4a3-d403c8914b8d',
      response_format: 'mp3',
    });
    expect(result).toEqual({ audio: fakeMp3('Quiz Mode'), requestId: 'corr-1', cost: null });
  });

  test('identifiant : repli sur x-kong-request-id, sinon null', async () => {
    const kong = providerWith(() => audioReply('a', { 'x-kong-request-id': 'kong-1' }));
    expect((await kong.provider.synthesize({ text: 'a', voice: VOICE })).requestId).toBe('kong-1');
    const none = providerWith(() => audioReply('a'));
    expect((await none.provider.synthesize({ text: 'a', voice: VOICE })).requestId).toBeNull();
  });

  test('voix vérifiée par GET /v1/audio/voices/<id> ; aucun solde lisible', async () => {
    const { provider, calls } = providerWith(() => json(200, { id: VOICE.voiceId }));
    await provider.checkVoice(VOICE);
    expect(calls[0].url).toBe(`https://mistral.test/v1/audio/voices/${VOICE.voiceId}`);
    expect(await provider.credits()).toBeNull();
  });

  test.each([
    ['sans audio_data', () => json(200, {})],
    [
      'audio qui n’est pas un MP3',
      () => json(200, { audio_data: Buffer.from('<html>').toString('base64') }),
    ],
    ['corps illisible', () => new Response('pas du JSON', { status: 200 })],
  ])('%s : réponse payée inutilisable (response)', async (_label, reply) => {
    const { provider } = providerWith(reply);
    const error = await errorOf(provider.synthesize({ text: 'a', voice: VOICE }));
    expect(error).toBeInstanceOf(ProviderError);
    expect(error.kind).toBe('response');
  });
});

describe('Fournisseur Mistral : classement des erreurs réelles', () => {
  test.each([
    ['clé refusée', 401, { detail: 'Invalid API Key' }, 'auth', 'Invalid API Key'],
    [
      'modération',
      403,
      { detail: 'Request blocked by content moderation' },
      'request',
      'modération',
    ],
    ['modération sans corps', 403, {}, 'request', 'modération'],
    ['paiement requis', 402, { detail: 'Payment required' }, 'quota', 'Payment'],
    ['solde épuisé', 400, { message: 'Insufficient balance' }, 'quota', 'balance'],
    ['quota au lieu du débit', 429, { message: 'Monthly quota exceeded' }, 'quota', 'quota'],
    ['débit dépassé', 429, { message: 'Requests rate limit exceeded' }, 'rate', 'rate limit'],
    ['voix inconnue (lecture)', 404, { detail: 'Voice not found' }, 'voice', 'Voice not found'],
    [
      'voix inconnue (synthèse)',
      404,
      { object: 'error', message: "Voice '0000' not found.", type: 'invalid_voice', code: '1902' },
      'voice',
      'invalid_voice',
    ],
    [
      'modèle inconnu',
      400,
      { object: 'error', message: 'Invalid model: voxtral-x', type: 'invalid_model', code: '1500' },
      'voice',
      'Invalid model',
    ],
    [
      'champ manquant',
      422,
      { detail: [{ type: 'missing', loc: ['body', 'input'], msg: 'Field required' }] },
      'request',
      'Field required',
    ],
    [
      'message imbriqué',
      400,
      { message: { detail: [{ msg: 'Bad input' }] } },
      'request',
      'Bad input',
    ],
    ['serveur', 503, { detail: 'Service unavailable' }, 'server', '503'],
  ])('%s (HTTP %i)', async (_label, status, body, kind, fragment) => {
    const { provider } = providerWith(() => json(status, body));
    const error = await errorOf(provider.synthesize({ text: 'a', voice: VOICE }));
    expect(error.kind).toBe(kind);
    expect(error.message).toContain(fragment);
  });

  test('débit dépassé : le délai annoncé est gardé ; pas pour une erreur définitive', async () => {
    const rate = providerWith(() =>
      json(429, { message: 'Requests rate limit exceeded' }, { 'retry-after': '7' })
    );
    expect(
      (await errorOf(rate.provider.synthesize({ text: 'a', voice: VOICE }))).retryAfterMs
    ).toBe(7000);
    const auth = providerWith(() =>
      json(401, { detail: 'Invalid API Key' }, { 'retry-after': '7' })
    );
    expect(
      (await errorOf(auth.provider.synthesize({ text: 'a', voice: VOICE }))).retryAfterMs
    ).toBeUndefined();
  });

  test('réseau coupé : network, sans jamais citer la clé', async () => {
    const provider = createMistral({
      apiKey: KEY,
      fetchImpl: async () => {
        throw new Error(`connexion refusée (Authorization: Bearer ${KEY})`);
      },
    });
    const error = await errorOf(provider.synthesize({ text: 'a', voice: VOICE }));
    expect(error.kind).toBe('network');
    expect(error.message).toBe(
      'Mistral injoignable : connexion refusée (Authorization: Bearer ***)'
    );
    expect(error.message).not.toContain(KEY);
  });

  test('appel annulé : son erreur passe telle quelle, sans devenir une panne réseau', async () => {
    const controller = new AbortController();
    const provider = createMistral({
      apiKey: KEY,
      fetchImpl: async (_url, init) => {
        controller.abort();
        throw init.signal.reason;
      },
    });
    const error = await errorOf(
      provider.synthesize({ text: 'a', voice: VOICE, signal: controller.signal })
    );
    expect(error).not.toBeInstanceOf(ProviderError);
    expect(error.name).toBe('AbortError');
  });

  test('clé absente ou mal formée : auth, avec le nom de la variable', () => {
    expect(() => createMistral({ apiKey: '' })).toThrow('MISTRAL_API_KEY manquante');
    expect(() => createMistral({ apiKey: 'cle avec espace' })).toThrow(
      /MISTRAL_API_KEY mal formée/
    );
  });

  test('ElevenLabs n’est pas touché : son 403 reste une clé refusée (auth)', async () => {
    const provider = createElevenLabs({
      apiKey: KEY,
      fetchImpl: async () => json(403, { detail: { status: 'forbidden', message: 'nope' } }),
    });
    expect((await errorOf(provider.synthesize({ text: 'a', voice: loadVoice('fr') }))).kind).toBe(
      'auth'
    );
  });

  test.each([null, 'Bad Request', 42, []])(
    'corps d’erreur sans rien de lisible (%j) : message vide, sans planter',
    body => {
      expect(errorDetail(body)).toEqual({ message: '' });
    }
  );
});

describe('Voix anglaise : entrée de voices.json', () => {
  test('nom et version admis par l’index du jeu ; empreintes publiées inchangées', () => {
    expect(VOICE.provider).toBe('mistral');
    expect(loadVoice('en')).toMatchObject({ voice: 'jane', version: 'jane-v1-1' });
    // voiceName est descriptif : il n'entre pas dans les empreintes
    const renamed = { ...loadVoice('en'), voiceName: 'Autre nom' };
    expect(voiceConfigHash(renamed)).toBe(voiceConfigHash(loadVoice('en')));
    expect(synthesisHash(renamed)).toBe(synthesisHash(loadVoice('en')));
    // Empreintes des manifestes publiés (manifests/fr/lucie-v3-2.json, manifests/en/jane-v1-1.json) :
    // ne doivent pas bouger, un clip publié n'est jamais réécrit
    expect(voiceConfigHash(loadVoice('fr'))).toBe('819e47334ba57974');
    expect(voiceConfigHash(loadVoice('en'))).toBe('2f293cad167f16be');
  });
});

describe('Voix espagnole : entrée de voices.json', () => {
  test('Jane aussi, en espagnol : nom et version admis par l’index, bruts à part', () => {
    const es = loadVoice('es');
    expect(es).toMatchObject({
      provider: 'mistral',
      voice: 'jane',
      version: 'jane-v1-1',
      voiceId: loadVoice('en').voiceId,
      languageCode: 'es',
    });
    const entry = { voice: es.voice, version: es.version, format: 'mp3', audience: 'test' };
    expect(parseLanguage({ ...entry, defaultOn: false })).not.toBeNull();
    // La langue entre dans l'empreinte : les bruts espagnols ne se mêlent pas aux anglais
    expect(synthesisHash(es)).not.toBe(synthesisHash(loadVoice('en')));
  });
});

describe('Plafond de la dépense', () => {
  test('--max-total-chars : ce qui reste après le déjà payé, borné par --max-chars', () => {
    expect(charCap({ maxTotalChars: 1000 }, 300)).toBe(700);
    expect(charCap({ maxChars: 200, maxTotalChars: 1000 }, 300)).toBe(200);
    expect(charCap({ maxChars: 200 }, 300)).toBe(200);
    expect(charCap({}, 300)).toBeUndefined();
  });

  test('plafond cumulé déjà atteint : départ refusé, avec les deux nombres', () => {
    expect(() => charCap({ maxTotalChars: 1000 }, 1000)).toThrow(
      'Plafond cumulé atteint : 1000 caractères déjà payés pour un plafond de 1000'
    );
  });

  test('sans solde lisible : le plafond cumulé suffit ; sans aucun plafond, refus', async () => {
    const provider = { credits: async () => null };
    const logs = [];
    const cap = charCap({ maxTotalChars: 227000 }, 478);
    await expect(
      creditBudget({ maxChars: cap, reserve: 0 }, provider, m => logs.push(m))
    ).resolves.toBe(Infinity);
    expect(logs.join('\n')).toContain('plafond 226522 caractères');
    await expect(creditBudget({ reserve: 0 }, provider, () => {})).rejects.toThrow(
      /--max-chars ou --max-total-chars/
    );
  });
});

describe('Génération avec Mistral (faux serveur)', () => {
  const phrase = (text, family) => ({ text, key: voiceKey(text), family, operator: null });
  const PHRASES = [
    phrase('Quiz Mode', 'annonce'),
    phrase('Great job!', 'bravo'),
    phrase("Oops! Don't shoot the right answer.", 'phrase fixe'),
    phrase('Try again!', 'phrase fixe'),
  ];
  let outDir;
  let server;
  let logs;

  async function startServer(respond) {
    const requests = [];
    const srv = http.createServer(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString();
      const request = { url: req.url, headers: req.headers, body: raw ? JSON.parse(raw) : null };
      requests.push(request);
      const reply = await respond(request);
      res.writeHead(reply.status, { 'Content-Type': 'application/json', ...reply.headers });
      res.end(JSON.stringify(reply.body));
    });
    await new Promise(resolve => srv.listen(0, '127.0.0.1', resolve));
    return {
      url: `http://127.0.0.1:${srv.address().port}`,
      requests,
      speech: () => requests.filter(r => r.url === '/v1/audio/speech'),
      close: () =>
        new Promise(resolve => {
          srv.closeAllConnections();
          srv.close(resolve);
        }),
    };
  }

  /** Mistral simulé : la modération refuse « shoot », le reste est synthétisé */
  const moderated = request => {
    if (request.url.startsWith('/v1/audio/voices/'))
      return { status: 200, body: { id: VOICE.voiceId } };
    if (request.body.input.includes('shoot')) {
      return { status: 403, body: { detail: 'Request blocked by content moderation' } };
    }
    return {
      status: 200,
      headers: { 'mistral-correlation-id': `corr-${request.body.input.length}` },
      body: { audio_data: fakeMp3(request.body.input).toString('base64') },
    };
  };

  async function fakeProcess(raw, out) {
    const data = await fsp.readFile(raw);
    if (data.includes('PANNE'))
      throw Object.assign(new Error('spawn ffmpeg ENOENT'), { code: 'ENOENT' });
    await fsp.writeFile(out, data);
  }
  const fakeProbe = async () => ({ duration: 1.2, codec: 'mp3', channels: 1, bitRate: 64000 });

  function run(options = {}) {
    return runGeneration({
      lang: 'en',
      phrases: PHRASES,
      voice: VOICE,
      outDir,
      provider: createMistral({ apiKey: KEY, baseUrl: server.url }),
      concurrency: 1,
      processAudio: fakeProcess,
      probeAudio: fakeProbe,
      sleep: async () => {},
      log: message => logs.push(message),
      ...options,
    });
  }
  const paths = () => storePaths(outDir, 'en', VOICE.version);
  const manifest = () => JSON.parse(fs.readFileSync(paths().manifestFile, 'utf8'));
  const billedLines = () =>
    fs
      .readFileSync(paths().billedFile, 'utf8')
      .trim()
      .split('\n')
      .map(line => JSON.parse(line));
  const allFiles = dir =>
    fs.existsSync(dir)
      ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
          const full = path.join(dir, entry.name);
          return entry.isDirectory() ? allFiles(full) : [full];
        })
      : [];

  beforeEach(async () => {
    outDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'voices-mistral-'));
    logs = [];
  });
  afterEach(async () => {
    await server?.close();
    server = null;
    await fsp.rm(outDir, { recursive: true, force: true });
  });

  test('une phrase refusée par la modération échoue seule, les autres sont générées', async () => {
    server = await startServer(moderated);
    const summary = await run();
    expect(summary.stop).toBeNull();
    expect(summary.generated).toBe(3);
    expect(summary.failed.map(f => f.text)).toEqual(["Oops! Don't shoot the right answer."]);
    expect(summary.failed[0].error).toContain('modération');
    expect(exitCodeFor(summary)).toBe(4);
    expect(Object.keys(manifest().clips)).toHaveLength(3);
    expect(manifest().clips[PHRASES[0].key].requestId).toBe('corr-9');
    // Coût inconnu : aucun crédit inventé, les journaux ne parlent que de caractères
    expect(summary.credits).toBeNull();
  });

  test('registre : une ligne par réponse payée, et le total retrouvé', async () => {
    server = await startServer(moderated);
    const summary = await run();
    const lines = billedLines();
    expect(lines.map(line => line.key).sort()).toEqual(
      [PHRASES[0], PHRASES[1], PHRASES[3]].map(p => p.key).sort()
    );
    expect(lines.reduce((sum, line) => sum + line.chars, 0)).toBe(summary.chars);
    expect(billedChars(paths())).toBe(summary.chars);
  });

  test('arrêt brutal après une réponse payée : le registre la garde, sans ligne de journal', async () => {
    server = await startServer(request =>
      request.url.startsWith('/v1/audio/voices/')
        ? { status: 200, body: {} }
        : {
            status: 200,
            body: { audio_data: fakeMp3(`PANNE ${request.body.input}`).toString('base64') },
          }
    );
    // Panne d'outil au traitement : l'exécution s'arrête (fatal) sans écrire runs.jsonl
    const summary = await run({ phrases: [PHRASES[0]] });
    expect(summary.stop).toBe('fatal');
    expect(fs.existsSync(paths().runLogFile)).toBe(false);
    expect(billedChars(paths())).toBe([...'Quiz Mode'].length);
  });

  test('réponse payée mais inutilisable : comptée au registre, puis tout s’arrête', async () => {
    server = await startServer(request =>
      request.url.startsWith('/v1/audio/voices/')
        ? { status: 200, body: {} }
        : { status: 200, body: { audio_data: Buffer.from('<html>').toString('base64') } }
    );
    const summary = await run({ phrases: [PHRASES[0], PHRASES[1]] });
    expect(summary.stop).toBe('response');
    expect(server.speech()).toHaveLength(1);
    expect(billedChars(paths())).toBe([...'Quiz Mode'].length);
  });

  test('journal d’avant le registre compté, lignes du registre jamais comptées deux fois', async () => {
    await fsp.mkdir(path.dirname(paths().runLogFile), { recursive: true });
    fs.writeFileSync(
      paths().runLogFile,
      `${JSON.stringify({ chars: 100 })}\n${JSON.stringify({ chars: 40, ledger: true })}\n`
    );
    fs.writeFileSync(paths().billedFile, `${JSON.stringify({ key: 'a', chars: 40 })}\n`);
    expect(billedChars(paths())).toBe(140);
  });

  test('modèle inconnu : toute la génération s’arrête au premier appel', async () => {
    server = await startServer(() => ({
      status: 400,
      body: { object: 'error', message: 'Invalid model: x', type: 'invalid_model' },
    }));
    const summary = await run();
    expect(summary.stop).toBe('voice');
    expect(server.speech()).toHaveLength(1);
    expect(exitCodeFor(summary)).toBe(1);
  });

  test('une relance ne repaie rien de ce qui est déjà là ; la clé n’est écrite nulle part', async () => {
    server = await startServer(moderated);
    await run();
    const second = await run();
    expect(second.generated).toBe(0);
    // Seule la phrase refusée est retentée
    expect(
      server
        .speech()
        .map(r => r.body.input)
        .filter(t => t.includes('shoot'))
    ).toHaveLength(2);
    expect(server.speech()).toHaveLength(5);
    for (const file of allFiles(outDir)) expect(fs.readFileSync(file).includes(KEY)).toBe(false);
    expect(logs.join('\n')).not.toContain(KEY);
    expect(server.speech().every(r => r.headers.authorization === `Bearer ${KEY}`)).toBe(true);
  });
});

describe('Clé propre à chaque fournisseur', () => {
  let server;
  afterEach(async () => {
    await server?.close();
    server = null;
  });

  async function voicesServer(status = 200) {
    const seen = [];
    const srv = http.createServer((req, res) => {
      seen.push({ url: req.url, headers: req.headers });
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(status === 200 ? {} : { detail: 'Voice not found' }));
    });
    await new Promise(resolve => srv.listen(0, '127.0.0.1', resolve));
    return {
      url: `http://127.0.0.1:${srv.address().port}`,
      seen,
      close: () => new Promise(resolve => srv.close(resolve)),
    };
  }

  test('Mistral lit MISTRAL_API_KEY, ElevenLabs ELEVENLABS_API_KEY', async () => {
    server = await voicesServer();
    const env = {
      MISTRAL_API_KEY: 'cle-mistral',
      MISTRAL_BASE_URL: server.url,
      ELEVENLABS_API_KEY: 'cle-eleven',
      ELEVENLABS_BASE_URL: server.url,
    };
    await openProvider(VOICE, env);
    await openProvider(loadVoice('fr'), env);
    expect(server.seen[0]).toMatchObject({ url: `/v1/audio/voices/${VOICE.voiceId}` });
    expect(server.seen[0].headers.authorization).toBe('Bearer cle-mistral');
    expect(server.seen[1].headers['xi-api-key']).toBe('cle-eleven');
  });

  test('clé de l’autre fournisseur seulement : refus nommé ; fournisseur inconnu : refus', async () => {
    await expect(openProvider(VOICE, { ELEVENLABS_API_KEY: 'cle-eleven' })).rejects.toThrow(
      'MISTRAL_API_KEY manquante'
    );
    await expect(openProvider({ ...VOICE, provider: 'autre' }, {})).rejects.toThrow(
      'Fournisseur inconnu : autre'
    );
    await expect(openProvider({ ...VOICE, provider: 'constructor' }, {})).rejects.toThrow(
      'Fournisseur inconnu'
    );
  });

  test('voix introuvable chez Mistral : conseil propre à Mistral', async () => {
    server = await voicesServer(404);
    await expect(
      openProvider(VOICE, { MISTRAL_API_KEY: 'cle-mistral', MISTRAL_BASE_URL: server.url })
    ).rejects.toThrow(
      /Jane - Neutral\) n'existe plus ou n'est pas accessible.*GET \/v1\/audio\/voices/s
    );
  });
});

/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Génération des clips (scripts/voice/generate.mjs) contre un faux serveur ElevenLabs :
 * chaque phrase est générée une fois, une relance ne refait rien, un arrêt (crédits
 * épuisés, interruption) ne laisse aucun fichier commencé, et la clé n'est écrite nulle part.
 * Le traitement ffmpeg est remplacé par une copie : il a son propre test.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { voiceKey } from '../../js/core/spoken-text.js';
import { saidText } from '../../scripts/voice/said-text.mjs';
import { generationOrder, loadVoice, runGeneration } from '../../scripts/voice/generate.mjs';
import { createElevenLabs, ProviderError } from '../../scripts/voice/providers/elevenlabs.mjs';
import { rawFile, saidHash, storePaths } from '../../scripts/voice/clip-store.mjs';

/** Clé factice : le faux serveur la reçoit, aucun fichier ni message ne doit la contenir */
const FAKE_KEY = 'cle-factice-du-faux-serveur-elevenlabs';
const VOICE = { ...loadVoice('fr'), version: 'test-1' };

const phrase = (text, family, operator = null) => ({ text, key: voiceKey(text), family, operator });
const PHRASES = [
  phrase('Combien font 1 fois 7 ?', 'question', '×'),
  phrase('7 fois 8 égale 54', 'vrai ou faux', '×'),
  phrase('Mode Quiz', 'annonce'),
  phrase('Combien font 9 moins 4 ?', 'question', '−'),
  phrase('Bravo !', 'bravo'),
];

/** Faux MP3 : mot de synchronisation, puis le texte reçu (pour les contrôles) */
const fakeMp3 = text => Buffer.concat([Buffer.from([0xff, 0xfb, 0x90, 0x64]), Buffer.from(text)]);

/** Faux serveur ElevenLabs : chaque requête passe par respond(requête, rang) */
async function startServer(respond) {
  const requests = [];
  const server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString();
    const request = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: raw ? JSON.parse(raw) : null,
    };
    requests.push(request);
    const reply = await respond(request, requests.length);
    if (!reply) return; // requête laissée en suspens (test d'interruption)
    res.writeHead(reply.status, reply.headers ?? {});
    res.end(reply.body);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    requests,
    tts: () => requests.filter(r => r.url.startsWith('/v1/text-to-speech/')),
    close: () =>
      new Promise(resolve => {
        server.closeAllConnections();
        server.close(resolve);
      }),
  };
}

/** Crédits décomptés par le faux serveur : un pour deux caractères, comme Eleven v3 */
const costOf = text => Math.ceil([...text].length / 2);

const ok = request => ({
  status: 200,
  headers: {
    'Content-Type': 'audio/mpeg',
    'request-id': `req-${request.body.text.length}`,
    'character-cost': String(costOf(request.body.text)),
  },
  body: fakeMp3(request.body.text),
});
const quotaExceeded = () => ({
  status: 401,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    detail: { status: 'quota_exceeded', message: 'This request exceeds your quota.' },
  }),
});

/** Traitement factice : copie, sauf un brut marqué CASSÉ */
async function fakeProcess(raw, out) {
  const data = await fsp.readFile(raw);
  if (data.includes('CASSÉ')) throw new Error('ffmpeg : entrée invalide');
  await fsp.writeFile(out, data);
}

/** Contrôle factice : un fichier marqué VIDE dure 0 s */
async function fakeProbe(file) {
  const data = await fsp.readFile(file);
  return { duration: data.includes('VIDE') ? 0 : 1.2, codec: 'mp3', channels: 1, bitRate: 48000 };
}

let outDir;
let server;
let logs;

function run(options = {}) {
  const provider = createElevenLabs({ apiKey: FAKE_KEY, baseUrl: server.url });
  return runGeneration({
    lang: 'fr',
    phrases: PHRASES,
    voice: VOICE,
    outDir,
    provider,
    concurrency: 1,
    processAudio: fakeProcess,
    probeAudio: fakeProbe,
    sleep: async () => {},
    log: message => logs.push(message),
    ...options,
  });
}

const paths = () => storePaths(outDir, 'fr', VOICE.version);
const manifest = () => JSON.parse(fs.readFileSync(paths().manifestFile, 'utf8'));
const clipOf = p => path.join(paths().clipDir, `${p.key}.mp3`);

function allFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? allFiles(full) : [full];
  });
}
const partFiles = () => allFiles(outDir).filter(file => file.endsWith('.part'));

beforeEach(async () => {
  outDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'voices-'));
  logs = [];
});

afterEach(async () => {
  await server?.close();
  server = null;
  await fsp.rm(outDir, { recursive: true, force: true });
});

describe('Génération des clips', () => {
  test('chaque phrase une fois, par ordre de priorité ; une relance n’appelle plus l’API', async () => {
    server = await startServer(ok);
    const first = await run();
    expect(first.generated).toBe(PHRASES.length);
    // Annonce, bravo, questions (× avant −), vrai/faux : l'ordre de priorité, écrit en clair
    expect(server.tts().map(r => r.body.text)).toEqual([
      'Mode Quiz',
      'Bravo !',
      'Combien font une fois 7 ?',
      'Combien font 9 moins 4 ?',
      '7 fois 8 égale 54',
    ]);
    for (const p of PHRASES) expect(fs.existsSync(clipOf(p))).toBe(true);
    expect(Object.keys(manifest().clips).sort()).toEqual(PHRASES.map(p => p.key).sort());
    expect(partFiles()).toEqual([]);

    const second = await run();
    expect(second.alreadyDone).toBe(PHRASES.length);
    expect(second.generated).toBe(0);
    expect(server.tts()).toHaveLength(PHRASES.length);
  });

  test('le texte dit part à la synthèse, la phrase de speak() reste la clé', async () => {
    server = await startServer(ok);
    await run({ phrases: [PHRASES[0]] });
    const [request] = server.tts();
    expect(request.body).toEqual({
      text: 'Combien font une fois 7 ?',
      model_id: VOICE.model,
      language_code: 'fr',
      voice_settings: VOICE.settings,
    });
    expect(request.url).toBe(
      `/v1/text-to-speech/${VOICE.voiceId}?output_format=${VOICE.sourceFormat}`
    );
    expect(manifest().clips[PHRASES[0].key]).toMatchObject({
      text: 'Combien font 1 fois 7 ?',
      said: 'Combien font une fois 7 ?',
      duration: 1.2,
    });
  });

  test('crédits épuisés : arrêt propre, rien de commencé ne reste, la relance reprend le reste', async () => {
    let quota = true;
    server = await startServer((request, rank) =>
      quota && rank > 2 ? quotaExceeded() : ok(request)
    );
    const first = await run();
    expect(first.stop).toBe('quota');
    expect(first.generated).toBe(2);
    expect(Object.keys(manifest().clips)).toHaveLength(2);
    expect(allFiles(paths().clipDir)).toHaveLength(2);
    expect(allFiles(paths().rawDir)).toHaveLength(2);
    expect(partFiles()).toEqual([]);

    quota = false;
    const second = await run();
    expect(second.generated).toBe(PHRASES.length - 2);
    expect(second.remaining).toBe(0);
    // Un appel refusé, puis chaque phrase une seule fois
    expect(server.tts()).toHaveLength(PHRASES.length + 1);
    expect(new Set(server.tts().map(r => r.body.text)).size).toBe(PHRASES.length);
  });

  test('traces d’une exécution interrompue : supprimées, clips complets repris, invalides refaits', async () => {
    server = await startServer(ok);
    const p = paths();
    const [adopted, invalid] = PHRASES;
    await fsp.mkdir(p.clipDir, { recursive: true });
    await fsp.mkdir(p.rawDir, { recursive: true });
    await fsp.mkdir(path.dirname(p.manifestFile), { recursive: true });
    // Restes d'un arrêt brutal, sous des noms qu'aucune étape ne réécrit
    await fsp.writeFile(path.join(p.clipDir, 'arret0brutal.mp3.part'), 'moitié');
    await fsp.writeFile(path.join(p.rawDir, 'arret0brutal-0123456789ab.mp3.part'), 'moitié');
    await fsp.writeFile(path.join(path.dirname(p.manifestFile), 'ancien.json.part'), '{');
    await fsp.writeFile(clipOf(adopted), fakeMp3('complet'));
    await fsp.writeFile(clipOf(invalid), fakeMp3('VIDE'));

    const summary = await run();
    expect(summary.leftovers).toBe(3);
    expect(summary.adopted).toBe(1);
    expect(summary.rejected).toBe(1);
    expect(server.tts().map(r => r.body.text)).not.toContain(saidText(adopted.text, 'fr'));
    expect(server.tts()).toHaveLength(PHRASES.length - 1);
    expect(fs.readFileSync(clipOf(invalid)).includes('VIDE')).toBe(false);
    expect(partFiles()).toEqual([]);
  });

  test('entrée de manifeste sans clip : retirée, le clip est refait depuis le brut, sans appel', async () => {
    server = await startServer(ok);
    await run();
    await fsp.rm(clipOf(PHRASES[1]));
    const summary = await run();
    expect(summary.dropped).toBe(1);
    expect(summary.reprocessed).toBe(1);
    expect(summary.generated).toBe(0);
    expect(server.tts()).toHaveLength(PHRASES.length);
    expect(fs.existsSync(clipOf(PHRASES[1]))).toBe(true);
  });

  test('entrée sans clip ni brut : refaite par un nouvel appel', async () => {
    server = await startServer(ok);
    await run();
    await fsp.rm(clipOf(PHRASES[1]));
    await fsp.rm(paths().rawDir, { recursive: true });
    const summary = await run();
    expect(summary.dropped).toBe(1);
    expect(summary.generated).toBe(1);
    expect(server.tts()).toHaveLength(PHRASES.length + 1);
  });

  test('un brut déjà payé est retraité sans nouvel appel', async () => {
    server = await startServer(ok);
    const [paid] = PHRASES;
    const said = saidText(paid.text, 'fr');
    await fsp.mkdir(paths().rawDir, { recursive: true });
    await fsp.writeFile(rawFile(paths(), paid.key, said), fakeMp3(said));
    const summary = await run();
    expect(summary.reprocessed).toBe(1);
    expect(summary.generated).toBe(PHRASES.length - 1);
    expect(server.tts().map(r => r.body.text)).not.toContain(said);
  });

  test('un brut qui ne se traite pas est supprimé avec son clip partiel, puis redemandé', async () => {
    let broken = true;
    server = await startServer(request => {
      if (broken && request.body.text === 'Mode Quiz') {
        broken = false;
        return { status: 200, headers: { 'Content-Type': 'audio/mpeg' }, body: fakeMp3('CASSÉ') };
      }
      return ok(request);
    });
    const first = await run();
    expect(first.failed.map(f => f.text)).toEqual(['Mode Quiz']);
    expect(partFiles()).toEqual([]);
    expect(fs.readdirSync(paths().rawDir).filter(n => n.startsWith(voiceKey('Mode Quiz')))).toEqual(
      []
    );
    const second = await run();
    expect(second.generated).toBe(1);
    expect(second.remaining).toBe(0);
  });

  test('débit dépassé puis panne serveur : nouvel essai, un seul clip', async () => {
    server = await startServer((request, rank) => {
      if (rank === 1)
        return {
          status: 429,
          headers: { 'retry-after': '0' },
          body: '{"detail":{"status":"too_many_concurrent_requests"}}',
        };
      if (rank === 2) return { status: 500, body: 'oups' };
      return ok(request);
    });
    const summary = await run({ phrases: [PHRASES[2]] });
    expect(summary.generated).toBe(1);
    expect(server.tts()).toHaveLength(3);
    expect(summary.failed).toEqual([]);
  });

  test('budget : arrêt avant la première phrase qui dépasse, dans l’ordre de priorité', async () => {
    server = await startServer(ok);
    const ordered = generationOrder(PHRASES);
    const budget = ordered
      .slice(0, 2)
      .reduce((sum, p) => sum + [...saidText(p.text, 'fr')].length, 0);
    const summary = await run({ maxChars: budget });
    expect(summary.stop).toBe('budget');
    expect(summary.generated).toBe(2);
    expect(summary.chars).toBe(budget);
    expect(Object.keys(manifest().clips).sort()).toEqual(
      ordered
        .slice(0, 2)
        .map(p => p.key)
        .sort()
    );
  });

  test('crédits réels : lus dans la réponse, notés au manifeste, comptés au bilan', async () => {
    server = await startServer(ok);
    const summary = await run();
    const costs = PHRASES.map(p => costOf(saidText(p.text, 'fr')));
    expect(summary.credits).toBe(costs.reduce((a, b) => a + b, 0));
    expect(manifest().clips[PHRASES[0].key].cost).toBe(costOf('Combien font une fois 7 ?'));
  });

  test('budget en crédits : arrêt avant la phrase qui dépasse, au coût réel observé', async () => {
    server = await startServer(ok);
    const ordered = generationOrder(PHRASES).map(p => saidText(p.text, 'fr'));
    // Les trois premières phrases au coût réel (moitié des caractères), plus 2 crédits de
    // marge : la réservation se fait au coût moyen observé, un peu au-dessus du coût réel
    const budget = ordered.slice(0, 3).reduce((sum, said) => sum + costOf(said), 0) + 2;
    const summary = await run({ maxCredits: budget });
    expect(summary.stop).toBe('budget');
    expect(summary.generated).toBe(3);
    expect(summary.credits).toBeLessThanOrEqual(budget);
  });

  test('coût absent de la réponse : estimé au caractère, sans dépasser le budget', async () => {
    server = await startServer(request => {
      const reply = ok(request);
      delete reply.headers['character-cost'];
      return reply;
    });
    const first = generationOrder(PHRASES)[0];
    const summary = await run({ maxCredits: [...saidText(first.text, 'fr')].length });
    expect(summary.generated).toBe(1);
    expect(manifest().clips[first.key].cost).toBeNull();
  });

  test('arrêt demandé : l’appel en cours est abandonné, aucun fichier', async () => {
    const controller = new AbortController();
    server = await startServer(() => {
      controller.abort();
      return null;
    });
    const summary = await run({ signal: controller.signal });
    expect(summary.stop).toBe('interrupted');
    expect(summary.generated).toBe(0);
    expect(allFiles(paths().clipDir)).toEqual([]);
    expect(allFiles(paths().rawDir)).toEqual([]);
    expect(partFiles()).toEqual([]);
  });

  test('réglages changés sous la même version : refus', async () => {
    server = await startServer(ok);
    await run({ phrases: [PHRASES[0]] });
    const changed = { ...VOICE, settings: { ...VOICE.settings, speed: 1.1 } };
    await expect(run({ voice: changed })).rejects.toThrow(/nouvelle version/);
    expect(server.tts()).toHaveLength(1);
  });

  test('texte dit changé (règle de prononciation) : le clip est refait', async () => {
    server = await startServer(ok);
    await run({ phrases: [PHRASES[0]] });
    // Clip et brut produits avec une ancienne règle (« un fois 7 »)
    const old = 'Combien font un fois 7 ?';
    const data = manifest();
    data.clips[PHRASES[0].key].said = old;
    fs.writeFileSync(paths().manifestFile, JSON.stringify(data));
    const current = rawFile(paths(), PHRASES[0].key, saidText(PHRASES[0].text, 'fr'));
    await fsp.rename(current, rawFile(paths(), PHRASES[0].key, old));
    const summary = await run({ phrases: [PHRASES[0]] });
    expect(summary.stale).toBe(1);
    expect(summary.staleRaw).toBe(1);
    expect(summary.generated).toBe(1);
    expect(manifest().clips[PHRASES[0].key].said).toBe('Combien font une fois 7 ?');
  });

  test('--redo : le clip écarté est refait, les autres non', async () => {
    server = await startServer(ok);
    await run();
    const summary = await run({ redo: [PHRASES[3].key] });
    expect(summary.generated).toBe(1);
    expect(server.tts()).toHaveLength(PHRASES.length + 1);
  });

  test('--dry-run : ni appel ni écriture', async () => {
    server = await startServer(ok);
    const summary = await run({ dryRun: true });
    expect(summary.toDo).toBe(PHRASES.length);
    expect(summary.toDoChars).toBe(
      PHRASES.reduce((s, p) => s + [...saidText(p.text, 'fr')].length, 0)
    );
    expect(server.requests).toEqual([]);
    expect(allFiles(outDir)).toEqual([]);
  });

  test('la clé n’apparaît dans aucun fichier ni message', async () => {
    let quota = false;
    server = await startServer(request => (quota ? quotaExceeded() : ok(request)));
    await run({ phrases: PHRASES.slice(0, 2) });
    quota = true;
    const summary = await run();
    for (const file of allFiles(outDir)) {
      expect(fs.readFileSync(file).includes(FAKE_KEY)).toBe(false);
    }
    expect(JSON.stringify(summary)).not.toContain(FAKE_KEY);
    expect(logs.join('\n')).not.toContain(FAKE_KEY);
    expect(server.tts().every(r => r.headers['xi-api-key'] === FAKE_KEY)).toBe(true);
  });
});

describe('Fournisseur ElevenLabs : classement des erreurs', () => {
  const reply =
    (status, body, headers = {}) =>
    async () =>
      new Response(typeof body === 'string' ? body : JSON.stringify(body), { status, headers });
  const synth = fetchImpl =>
    createElevenLabs({ apiKey: FAKE_KEY, fetchImpl }).synthesize({ text: 'x', voice: VOICE });

  test.each([
    [401, { detail: { status: 'quota_exceeded', message: 'quota' } }, 'quota'],
    [401, { detail: { status: 'invalid_api_key', message: 'nope' } }, 'auth'],
    [404, { detail: { status: 'voice_not_found', message: 'nope' } }, 'voice'],
    [429, { detail: { status: 'too_many_concurrent_requests' } }, 'rate'],
    [503, 'indisponible', 'server'],
    [400, { detail: { status: 'invalid_text' } }, 'request'],
  ])('HTTP %i → %s', async (status, body, kind) => {
    const error = await synth(reply(status, body)).catch(e => e);
    expect(error).toBeInstanceOf(ProviderError);
    expect(error.kind).toBe(kind);
    expect(error.message).not.toContain(FAKE_KEY);
  });

  test('retry-after est lu en secondes', async () => {
    const error = await synth(reply(429, {}, { 'retry-after': '3' })).catch(e => e);
    expect(error.retryAfterMs).toBe(3000);
  });

  test('une réponse 200 qui n’est pas un MP3 est une panne', async () => {
    const error = await synth(reply(200, '<html>erreur</html>')).catch(e => e);
    expect(error.kind).toBe('server');
  });

  test('réseau coupé : erreur réseau (nouvel essai possible)', async () => {
    const error = await synth(async () => {
      throw new TypeError('fetch failed');
    }).catch(e => e);
    expect(error.kind).toBe('network');
    expect(error.message).not.toContain(FAKE_KEY);
  });

  test('sans clé : refus immédiat', () => {
    expect(() => createElevenLabs({ apiKey: '' })).toThrow(ProviderError);
  });

  test('empreinte du texte dit : stable et courte', () => {
    expect(saidHash('Mode Quiz')).toMatch(/^[0-9a-f]{12}$/);
    expect(saidHash('Mode Quiz')).toBe(saidHash('Mode Quiz'));
  });
});

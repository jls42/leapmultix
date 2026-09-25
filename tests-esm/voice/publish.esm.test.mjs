/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Index de la voix (js/core/voice-index.js), publication (scripts/voice/publish.mjs, CLI AWS
 * simulée) et vérification en ligne (scripts/voice/check-online.mjs, faux site local).
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { voiceKey, VOICE_KEY_SCHEMA } from '../../js/core/spoken-text.js';
import { clipPath, parseVoiceIndex } from '../../js/core/voice-index.js';
import { loadVoice } from '../../scripts/voice/generate.mjs';
import {
  CLIP_CACHE_CONTROL,
  describeLanguages,
  indexEntry,
  isMissingObject,
  parsePublishArgs,
  planUpload,
  publish,
  withLanguage,
} from '../../scripts/voice/publish.mjs';
import {
  checkOnline,
  onlineProblems,
  parseCheckOnlineArgs,
} from '../../scripts/voice/check-online.mjs';
import { newManifest, sha256, storePaths, writeManifest } from '../../scripts/voice/clip-store.mjs';

const voice = { ...loadVoice('fr'), version: 'test-1' };
const md5 = data => crypto.createHash('md5').update(data).digest('hex');
const ENTRY = {
  voice: 'lucie',
  version: 'lucie-v3-1',
  format: 'mp3',
  audience: 'test',
  defaultOn: false,
};

describe('Index de la voix', () => {
  test('index valide : gardé tel quel', () => {
    const data = { schema: VOICE_KEY_SCHEMA, languages: { fr: ENTRY } };
    expect(parseVoiceIndex(data)).toEqual(data);
  });

  test.each([
    ['autre schéma', { schema: 'sha1-1', languages: { fr: ENTRY } }],
    ['sans langues', { schema: VOICE_KEY_SCHEMA }],
    ['pas un objet', 'fr'],
    ['vide', null],
  ])('%s : rejeté en entier', (_label, data) => {
    expect(parseVoiceIndex(data)).toBeNull();
  });

  test.each([
    ['audience inconnue', { ...ENTRY, audience: 'beta' }],
    ['format inconnu', { ...ENTRY, format: 'ogg' }],
    ['version qui sort du dossier', { ...ENTRY, version: '../../x' }],
    ['voix avec une barre', { ...ENTRY, voice: 'a/b' }],
    ['defaultOn non booléen', { ...ENTRY, defaultOn: 'oui' }],
  ])('%s : la langue est écartée, les autres restent', (_label, bad) => {
    const parsed = parseVoiceIndex({ schema: VOICE_KEY_SCHEMA, languages: { fr: bad, es: ENTRY } });
    expect(parsed.languages).toEqual({ es: ENTRY });
  });

  test('code de langue invalide : écarté', () => {
    const parsed = parseVoiceIndex({ schema: VOICE_KEY_SCHEMA, languages: { '../fr': ENTRY } });
    expect(parsed.languages).toEqual({});
  });

  test('chemin d’un clip : langue, version, empreinte', () => {
    expect(clipPath('fr', ENTRY, 'abc123')).toBe('fr/lucie-v3-1/abc123.mp3');
  });

  test('écrire puis retirer une langue (coupe-circuit)', () => {
    const current = { schema: VOICE_KEY_SCHEMA, languages: { es: ENTRY } };
    const added = withLanguage(
      current,
      'fr',
      indexEntry(voice, { audience: 'all', defaultOn: true })
    );
    expect(added.languages.fr).toEqual({
      voice: 'lucie',
      version: 'test-1',
      format: 'mp3',
      audience: 'all',
      defaultOn: true,
    });
    expect(added.languages.es).toEqual(ENTRY);
    expect(withLanguage(added, 'fr', null).languages).toEqual({ es: ENTRY });
    expect(() => indexEntry(voice, { audience: 'tous' })).toThrow();
  });

  test('plan d’envoi : manquants, identiques, conflits', () => {
    const remote = new Map([
      ['a', 'aaa'],
      ['b', 'autre'],
    ]);
    const plan = planUpload(
      [
        { key: 'a', md5: 'aaa' },
        { key: 'b', md5: 'bbb' },
        { key: 'c', md5: 'ccc' },
      ],
      remote
    );
    expect(plan.identical.map(c => c.key)).toEqual(['a']);
    expect(plan.conflicts.map(c => c.key)).toEqual(['b']);
    expect(plan.toUpload.map(c => c.key)).toEqual(['c']);
  });
});

describe('Publication', () => {
  const texts = ['Mode Quiz', 'Bravo !', 'Combien font 7 fois 8 ?'];
  const clips = texts.map(text => ({ key: voiceKey(text), text, data: `mp3 ${text}` }));
  const phrases = clips.map(({ key, text }) => ({ key, text }));
  const online = () => clips.map(c => [c.key, md5(c.data)]);
  let outDir;
  let paths;
  let calls;
  let logs;

  beforeEach(async () => {
    logs = [];
    outDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'voices-publish-'));
    paths = storePaths(outDir, 'fr', voice.version);
    await fsp.mkdir(paths.clipDir, { recursive: true });
    const manifest = newManifest('fr', voice);
    for (const clip of clips) {
      await fsp.writeFile(path.join(paths.clipDir, `${clip.key}.mp3`), clip.data);
      manifest.clips[clip.key] = {
        text: clip.text,
        said: clip.text,
        duration: 1,
        bytes: clip.data.length,
        sha256: sha256(clip.data),
      };
    }
    await writeManifest(paths, manifest);
    calls = [];
  });
  afterEach(() => fsp.rm(outDir, { recursive: true, force: true }));

  /**
   * CLI AWS simulée : objets distants, index distant (objet, texte brut, ou erreur de
   * lecture), et trace de chaque appel
   */
  function readIndex({ index = null, indexText = null, indexError = null }) {
    if (indexError) throw indexError;
    if (indexText !== null) return indexText;
    if (!index) throw new Error('fatal error: An error occurred (404) when calling HeadObject');
    return JSON.stringify(index);
  }

  /** Réponse de list-objects-v2 : les clips déjà en ligne, avec leur ETag */
  function listing(remote) {
    return JSON.stringify({
      Contents: remote.map(([key, etag]) => ({
        Key: `voice/fr/test-1/${key}.mp3`,
        ETag: `"${etag}"`,
      })),
    });
  }

  /** Garde la trace de ce qu'une copie vers S3 envoie : les clips préparés, ou l'index écrit */
  function traceCopy(call) {
    const [, , from, to] = call.args;
    if (call.args.includes('--recursive')) call.staged = fs.readdirSync(from).sort();
    if (to?.endsWith('index.json')) call.written = JSON.parse(fs.readFileSync(from, 'utf8'));
  }

  function fakeAws({ remote = [], ...indexOptions } = {}) {
    return async args => {
      const call = { args };
      calls.push(call);
      if (args[0] === 's3api' && args[1] === 'list-objects-v2') return listing(remote);
      if (args[0] !== 's3' || args[1] !== 'cp') return '';
      if (args[3] === '-') return readIndex(indexOptions);
      traceCopy(call);
      return '';
    };
  }

  const base = {
    lang: 'fr',
    out: outDir,
    voice,
    bucket: 'voix-test',
    distribution: 'E123',
    audience: 'test',
    defaultOn: false,
    dryRun: false,
  };
  const run = (args, aws, io = {}) =>
    publish(
      { ...base, out: outDir, ...args },
      { run: aws, log: message => logs.push(message), phrases, ...io }
    );
  const written = () => calls.find(c => c.written)?.written ?? null;

  test('clips : seuls les manquants partent, en audio/mpeg immuable', async () => {
    const [first, second, third] = clips;
    const aws = fakeAws({ remote: [[first.key, md5(first.data)]] });
    const plan = await run({ command: 'clips' }, aws);
    expect(plan.identical.map(c => c.key)).toEqual([first.key]);
    const upload = calls.find(c => c.staged);
    expect(upload.staged).toEqual([`${second.key}.mp3`, `${third.key}.mp3`].sort());
    expect(upload.args).toEqual(
      expect.arrayContaining([
        's3://voix-test/voice/fr/test-1/',
        '--content-type',
        'audio/mpeg',
        '--cache-control',
        CLIP_CACHE_CONTROL,
      ])
    );
  });

  test('clips : un clip publié avec un autre contenu n’est jamais réécrit', async () => {
    const aws = fakeAws({ remote: [[clips[0].key, 'autre-empreinte']] });
    await expect(run({ command: 'clips' }, aws)).rejects.toThrow(/jamais réécrits/);
    expect(calls.some(c => c.staged)).toBe(false);
  });

  test('clips en --dry-run : rien n’est envoyé', async () => {
    await run({ command: 'clips', dryRun: true }, fakeAws());
    expect(calls.map(c => c.args[1])).toEqual(['list-objects-v2']);
  });

  test('index : la langue rejoint l’index distant, sans cache, puis invalidation', async () => {
    const aws = fakeAws({
      remote: online(),
      index: { schema: VOICE_KEY_SCHEMA, languages: { es: ENTRY } },
    });
    await run({ command: 'index', audience: 'test' }, aws);
    expect(logs).toContain(`Langues avant : ${describeLanguages({ languages: { es: ENTRY } })}`);
    expect(
      logs.some(line => line.startsWith('Langues après : es ') && line.includes('fr (test-1'))
    ).toBe(true);
    const write = calls.find(c => c.written);
    expect(write.written.languages).toEqual({ es: ENTRY, fr: indexEntry(voice) });
    expect(write.args).toEqual(
      expect.arrayContaining(['--cache-control', 'no-cache', '--content-type', 'application/json'])
    );
    expect(calls.at(-1).args).toEqual([
      'cloudfront',
      'create-invalidation',
      '--distribution-id',
      'E123',
      '--paths',
      '/voice/index.json',
    ]);
  });

  test('remove : la langue quitte l’index (coupe-circuit), les autres restent', async () => {
    const aws = fakeAws({
      index: { schema: VOICE_KEY_SCHEMA, languages: { es: ENTRY, fr: ENTRY } },
    });
    await run({ command: 'remove' }, aws);
    expect(calls.find(c => c.written).written.languages).toEqual({ es: ENTRY });
  });

  test('index : refusé tant qu’un clip du manifeste n’est pas en ligne', async () => {
    const aws = fakeAws({ remote: online().slice(1) });
    await expect(run({ command: 'index' }, aws)).rejects.toThrow(
      /1 clips pas encore en ligne, 0 phrases du corpus sans clip/
    );
    expect(written()).toBeNull();
  });

  test('index : refusé si une phrase du corpus n’a pas de clip ; --allow-missing l’accepte', async () => {
    const corpus = [...phrases, { key: voiceKey('Mode Défi'), text: 'Mode Défi' }];
    const aws = fakeAws({ remote: online() });
    await expect(run({ command: 'index' }, aws, { phrases: corpus })).rejects.toThrow(
      /0 clips pas encore en ligne, 1 phrases du corpus sans clip/
    );
    expect(written()).toBeNull();
    await run({ command: 'index', allowMissing: true }, aws, { phrases: corpus });
    expect(written().languages.fr).toEqual(indexEntry(voice));
  });

  test('index : un clip en ligne qui diffère du manifeste bloque, même avec --allow-missing', async () => {
    const remote = online();
    remote[0][1] = 'autre-empreinte';
    const aws = fakeAws({ remote });
    await expect(run({ command: 'index', allowMissing: true }, aws)).rejects.toThrow(
      /diffèrent du manifeste/
    );
    expect(written()).toBeNull();
  });

  test('clips : un fichier local qui ne correspond plus au manifeste n’est jamais envoyé', async () => {
    fs.writeFileSync(path.join(paths.clipDir, `${clips[1].key}.mp3`), 'audio d’une autre phrase');
    fs.rmSync(path.join(paths.clipDir, `${clips[2].key}.mp3`));
    await expect(run({ command: 'clips' }, fakeAws())).rejects.toThrow(
      new RegExp(`2 clips ne correspondent pas.*${clips[1].key}.*${clips[2].key}.*check\\.mjs`)
    );
    expect(calls.some(c => c.staged)).toBe(false);
  });

  test.each([
    ['réseau', new Error('Could not connect to the endpoint URL')],
    [
      'droits',
      Object.assign(new Error('Command failed'), { stderr: 'An error occurred (AccessDenied)' }),
    ],
    ['ralentissement', new Error('An error occurred (SlowDown) when calling GetObject')],
  ])(
    'index distant illisible (%s) : rien n’est écrit ; --force repart d’un index vide',
    async (_label, error) => {
      const aws = fakeAws({ remote: online(), indexError: error });
      await expect(run({ command: 'remove' }, aws)).rejects.toThrow("Rien n'est écrit");
      expect(written()).toBeNull();
      await run({ command: 'remove', force: true }, aws);
      expect(written().languages).toEqual({});
    }
  );

  test.each([
    ['JSON illisible', '{"schema":'],
    ['autre schéma', JSON.stringify({ schema: 'sha1-1', languages: { es: ENTRY } })],
    [
      'langue invalide',
      JSON.stringify({ schema: VOICE_KEY_SCHEMA, languages: { es: ENTRY, it: { voice: 'x' } } }),
    ],
  ])('index distant %s : rien n’est écrit sans --force', async (_label, indexText) => {
    const aws = fakeAws({ remote: online(), indexText });
    await expect(run({ command: 'index' }, aws)).rejects.toThrow(/Index distant/);
    expect(written()).toBeNull();
  });

  test('--force garde les langues valides d’un index en partie invalide', async () => {
    const indexText = JSON.stringify({
      schema: VOICE_KEY_SCHEMA,
      languages: { es: ENTRY, it: { voice: 'x' } },
    });
    await run({ command: 'index', force: true }, fakeAws({ remote: online(), indexText }));
    expect(Object.keys(written().languages).sort()).toEqual(['es', 'fr']);
  });

  test('remove : marche sans manifeste ni voix (coupe-circuit depuis n’importe où)', async () => {
    const empty = await fsp.mkdtemp(path.join(os.tmpdir(), 'voices-empty-'));
    try {
      const aws = fakeAws({ index: { schema: VOICE_KEY_SCHEMA, languages: { fr: ENTRY } } });
      await publish(
        { ...base, out: empty, voice: undefined, lang: 'it', command: 'remove' },
        { run: aws, log: () => {} }
      );
      expect(written().languages).toEqual({ fr: ENTRY });
    } finally {
      await fsp.rm(empty, { recursive: true, force: true });
    }
  });

  test.each(['clips', 'index', 'local'])('%s : manifeste vide ou absent, refus', async command => {
    const empty = await fsp.mkdtemp(path.join(os.tmpdir(), 'voices-empty-'));
    try {
      await expect(
        publish(
          { ...base, out: empty, command, site: empty },
          { run: fakeAws({ remote: online() }), log: () => {}, phrases }
        )
      ).rejects.toThrow(/Manifeste vide ou absent/);
      expect(calls).toEqual([]);
    } finally {
      await fsp.rm(empty, { recursive: true, force: true });
    }
  });

  test('absence de l’index distant : reconnue, sans masquer les autres erreurs', () => {
    expect(isMissingObject(new Error('An error occurred (NoSuchKey)'))).toBe(true);
    expect(isMissingObject({ message: 'Command failed', stderr: 'An error occurred (404)' })).toBe(
      true
    );
    expect(isMissingObject(new Error('An error occurred (AccessDenied)'))).toBe(false);
    expect(isMissingObject(new Error('Could not connect to the endpoint URL'))).toBe(false);
  });

  test('options : commande en premier, valeurs présentes, langue et audience valides', () => {
    const env = { VOICE_BUCKET: 'voix' };
    expect(parsePublishArgs(['index', '--lang', 'fr', '--audience', 'all'], env)).toMatchObject({
      command: 'index',
      lang: 'fr',
      audience: 'all',
      bucket: 'voix',
      allowMissing: false,
      force: false,
    });
    expect(parsePublishArgs(['remove', '--lang', 'fr', '--force'], env).force).toBe(true);
    expect(() => parsePublishArgs(['--lang', 'fr', 'index'], env)).toThrow(/Commande attendue/);
    expect(() => parsePublishArgs(['index', '--lang'], env)).toThrow(/Valeur manquante/);
    expect(() => parsePublishArgs(['index', '--bucket', '--dry-run', '--lang', 'fr'], {})).toThrow(
      /Valeur manquante/
    );
    expect(() => parsePublishArgs(['index', '--lang', 'francais'], env)).toThrow(/--lang/);
    expect(() => parsePublishArgs(['index', '--lang', 'fr', '--audience', 'tous'], env)).toThrow(
      /--audience/
    );
    expect(() => parsePublishArgs(['index', '--lang', 'fr'], {})).toThrow(/--bucket/);
    expect(() => parsePublishArgs(['index', '--lang', 'fr', '--vite'], env)).toThrow(/inconnue/);
  });

  test('local : dossier voice/ du site relié aux clips, index écrit', async () => {
    const site = await fsp.mkdtemp(path.join(os.tmpdir(), 'site-'));
    try {
      await run({ command: 'local', site, audience: 'all', defaultOn: true }, fakeAws());
      const linked = path.join(site, 'voice', 'fr', voice.version, `${clips[0].key}.mp3`);
      expect(fs.readFileSync(linked, 'utf8')).toBe(clips[0].data);
      const index = JSON.parse(fs.readFileSync(path.join(site, 'voice', 'index.json'), 'utf8'));
      expect(parseVoiceIndex(index).languages.fr).toMatchObject({
        audience: 'all',
        defaultOn: true,
      });
      expect(calls).toEqual([]);
    } finally {
      await fsp.rm(site, { recursive: true, force: true });
    }
  });
});

describe('Vérification en ligne', () => {
  const texts = ['Mode Quiz', 'Bravo !', 'Combien font 7 fois 8 ?'];
  const clips = texts.map(text => ({ key: voiceKey(text), text, data: `mp3 ${text}` }));
  let outDir;
  let server;
  let seen;

  beforeEach(async () => {
    outDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'voices-online-'));
    const paths = storePaths(outDir, 'fr', voice.version);
    const manifest = newManifest('fr', voice);
    for (const clip of clips) {
      manifest.clips[clip.key] = {
        text: clip.text,
        said: clip.text,
        duration: 1,
        bytes: clip.data.length,
        sha256: sha256(clip.data),
      };
    }
    await writeManifest(paths, manifest);
    seen = [];
  });
  afterEach(async () => {
    if (server?.listening) await new Promise(resolve => server.close(resolve));
    server = null;
    await fsp.rm(outDir, { recursive: true, force: true });
  });

  /** Faux site : respond(url) donne la réponse, ou null pour couper la connexion sans répondre */
  async function startSite(respond) {
    server = http.createServer((req, res) => {
      seen.push({ url: req.url, method: req.method, headers: req.headers });
      const reply = respond(req.url);
      if (reply === null) {
        res.destroy();
        return;
      }
      res.writeHead(reply.status, reply.headers);
      res.end(req.method === 'HEAD' ? undefined : reply.body);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    return `http://127.0.0.1:${server.address().port}/voice/`;
  }

  test('clips conformes, clip manquant, mauvais type, cache non immuable', async () => {
    const [ok, missing, wrong] = clips;
    const base = await startSite(url => {
      if (url.endsWith('index.json')) {
        const index = {
          schema: VOICE_KEY_SCHEMA,
          languages: { fr: { ...ENTRY, version: 'test-1' } },
        };
        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(index),
        };
      }
      const clip = clips.find(c => url.includes(c.key));
      if (clip === missing) return { status: 403, headers: {} };
      const type = clip === wrong ? 'text/html' : 'audio/mpeg';
      return {
        status: 200,
        headers: {
          'Content-Type': type,
          'Content-Length': String(clip.data.length),
          'Cache-Control': CLIP_CACHE_CONTROL,
        },
      };
    });
    const report = await checkOnline({ lang: 'fr', voice, outDir, base });
    expect(report.checked).toBe(3);
    expect(report.failures.map(f => [f.key, f.problem]).sort()).toEqual(
      [
        [missing.key, 'HTTP 403'],
        [wrong.key, 'type text/html'],
      ].sort()
    );
    expect(report.failures.map(f => f.key)).not.toContain(ok.key);
    expect(report.index).toMatchObject({ version: 'test-1', matchesVersion: true });
    const head = seen.find(r => r.method === 'HEAD');
    expect(head.url).toBe(
      `/voice/${clipPath('fr', voice, clips.find(c => head.url.includes(c.key)).key)}`
    );
    expect(head.headers['sec-fetch-site']).toBe('same-origin');
  });

  test('index qui annonce une autre version : signalé', async () => {
    const base = await startSite(url =>
      url.endsWith('index.json')
        ? {
            status: 200,
            headers: {},
            body: JSON.stringify({ schema: VOICE_KEY_SCHEMA, languages: { fr: ENTRY } }),
          }
        : goodClip(url)
    );
    const report = await checkOnline({ lang: 'fr', voice, outDir, base, sample: 2 });
    expect(report.checked).toBe(2);
    expect(report.index.matchesVersion).toBe(false);
    expect(onlineProblems(report)).toEqual(["l'index annonce la version lucie-v3-1, pas test-1"]);
    expect(onlineProblems(report, { allowOtherVersion: true })).toEqual([]);
  });

  /** Réponse conforme pour le clip demandé : 200, audio/mpeg, taille du manifeste, immuable */
  function goodClip(url) {
    const clip = clips.find(c => url.includes(c.key));
    return {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(clip.data.length),
        'Cache-Control': CLIP_CACHE_CONTROL,
      },
    };
  }

  test.each([
    ['injoignable', () => null, /index injoignable/],
    ['en erreur serveur', () => ({ status: 500, headers: {} }), /index : HTTP 500/],
    ['illisible', () => ({ status: 200, headers: {}, body: '{"schema":' }), /index illisible/],
    [
      'invalide',
      () => ({ status: 200, headers: {}, body: JSON.stringify({ schema: 'x', languages: {} }) }),
      /index invalide/,
    ],
  ])('index %s : échec, pas « langue absente »', async (_label, reply, message) => {
    const base = await startSite(url => (url.endsWith('index.json') ? reply() : goodClip(url)));
    const report = await checkOnline({ lang: 'fr', voice, outDir, base });
    expect(report.failures).toEqual([]);
    expect(report.indexError).toMatch(message);
    expect(onlineProblems(report)).toEqual([expect.stringMatching(message)]);
  });

  test.each([403, 404])(
    'index pas encore publié (%i) : la langue n’est pas annoncée, sans échec',
    async status => {
      const base = await startSite(url =>
        url.endsWith('index.json') ? { status, headers: {} } : goodClip(url)
      );
      const report = await checkOnline({ lang: 'fr', voice, outDir, base });
      expect(report.index).toBeNull();
      expect(report.indexError).toBeNull();
      expect(onlineProblems(report)).toEqual([]);
    }
  );

  test('chaque clip compté est une requête réellement faite', async () => {
    const base = await startSite(url =>
      url.endsWith('index.json') ? { status: 404, headers: {} } : goodClip(url)
    );
    const report = await checkOnline({ lang: 'fr', voice, outDir, base, concurrency: 2 });
    // Requêtes comptées par le site lui-même : celles qui l'ont réellement atteint
    const heads = seen.filter(request => request.method === 'HEAD').length;
    expect(report.checked).toBe(heads);
    expect(report.planned).toBe(3);
    expect(heads).toBe(3);
    expect(onlineProblems(report)).toEqual([]);
  });

  test.each([0, -1, 1.5, 'abc', ''])(
    'concurrence %p : refusée (aucun faux « OK »)',
    async value => {
      const base = await startSite(url => goodClip(url));
      await expect(
        checkOnline({ lang: 'fr', voice, outDir, base, concurrency: value })
      ).rejects.toThrow(/--concurrency/);
    }
  );

  test('manifeste vide ou absent : erreur, pas « 0 clips vérifiés »', async () => {
    const base = await startSite(url => goodClip(url));
    const empty = await fsp.mkdtemp(path.join(os.tmpdir(), 'voices-empty-'));
    try {
      await expect(checkOnline({ lang: 'fr', voice, outDir: empty, base })).rejects.toThrow(
        /Manifeste vide ou absent/
      );
    } finally {
      await fsp.rm(empty, { recursive: true, force: true });
    }
  });

  test('options : nombres entiers ≥ 1, valeurs présentes', () => {
    expect(parseCheckOnlineArgs(['--lang', 'fr', '--sample', '50'])).toMatchObject({
      lang: 'fr',
      sample: 50,
      concurrency: 16,
      allowOtherVersion: false,
    });
    expect(parseCheckOnlineArgs(['--lang', 'fr', '--allow-other-version']).allowOtherVersion).toBe(
      true
    );
    for (const argv of [
      ['--lang', 'fr', '--sample', '0'],
      ['--lang', 'fr', '--sample', '10k'],
      ['--lang', 'fr', '--concurrency', 'x'],
      ['--lang', 'fr', '--sample'],
      ['--lang', 'fr', '--vite'],
      ['--sample', '5'],
    ]) {
      expect(() => parseCheckOnlineArgs(argv)).toThrow();
    }
  });
});

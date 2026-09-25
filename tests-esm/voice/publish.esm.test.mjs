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
  indexEntry,
  planUpload,
  publish,
  withLanguage,
} from '../../scripts/voice/publish.mjs';
import { checkOnline } from '../../scripts/voice/check-online.mjs';
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
  let outDir;
  let paths;
  let calls;

  beforeEach(async () => {
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

  /** CLI AWS simulée : objets distants, index distant, et trace de chaque appel */
  function fakeAws({ remote = [], index = null } = {}) {
    return async args => {
      const call = { args };
      calls.push(call);
      if (args[0] === 's3api' && args[1] === 'list-objects-v2') {
        return JSON.stringify({
          Contents: remote.map(([key, etag]) => ({
            Key: `voice/fr/test-1/${key}.mp3`,
            ETag: `"${etag}"`,
          })),
        });
      }
      if (args[0] === 's3' && args[1] === 'cp' && args[3] === '-') {
        if (!index) throw new Error('NoSuchKey');
        return JSON.stringify(index);
      }
      if (args[0] === 's3' && args[1] === 'cp' && args.includes('--recursive')) {
        call.staged = fs.readdirSync(args[2]).sort();
      }
      if (args[0] === 's3' && args[1] === 'cp' && args[3]?.endsWith('index.json')) {
        call.written = JSON.parse(fs.readFileSync(args[2], 'utf8'));
      }
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
  const run = (args, aws) =>
    publish({ ...base, out: outDir, ...args }, { run: aws, log: () => {} });

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
    const aws = fakeAws({ index: { schema: VOICE_KEY_SCHEMA, languages: { es: ENTRY } } });
    await run({ command: 'index', audience: 'test' }, aws);
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
    await new Promise(resolve => server.close(resolve));
    await fsp.rm(outDir, { recursive: true, force: true });
  });

  async function startSite(respond) {
    server = http.createServer((req, res) => {
      seen.push({ url: req.url, method: req.method, headers: req.headers });
      const reply = respond(req.url);
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
        : {
            status: 200,
            headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': CLIP_CACHE_CONTROL },
          }
    );
    const report = await checkOnline({ lang: 'fr', voice, outDir, base, sample: 2 });
    expect(report.checked).toBe(2);
    expect(report.index.matchesVersion).toBe(false);
  });
});

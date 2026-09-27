/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Banc d'écoute (scripts/voice/bench.mjs, bench-page.mjs) : fichier du banc validé, phrases
 * tirées du corpus (pièges, familles, opérations), plafond vérifié avant tout appel, phrase
 * payée une seule fois, références copiées, Whisper en un passage, page, et choix du
 * propriétaire gardé dans le stockage partagé de l'artifact.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { buildCorpus } from '../../scripts/voice/corpus.mjs';
import { hasAgreement, saidText } from '../../scripts/voice/said-text.mjs';
import { ProviderError } from '../../scripts/voice/providers/common.mjs';
import { billedChars } from '../../scripts/voice/clip-store.mjs';
import { FAMILY_ORDER, loadVoice } from '../../scripts/voice/generate.mjs';
import {
  CapError,
  DEFAULT_SIZE,
  assertCap,
  benchPaths,
  benchPhrases,
  benchSetup,
  centered,
  copyReferences,
  parseArgs,
  planBench,
  synthesizeBench,
  transcribeBench,
  voiceResults,
  writeBenchPage,
} from '../../scripts/voice/bench.mjs';

const SCRIPT = path.resolve('scripts/voice/bench.mjs');
const FR = buildCorpus('fr');
/** Version publiée de Lucie, voix de référence des bancs d'essai : celle de voices.json */
const LUCIE = loadVoice('fr').version;

/** Banc d'essai : deux candidates Google, puis Lucie en référence */
function benchConfig(overrides = {}) {
  return {
    id: 'essai',
    lang: 'fr',
    name: 'Banc essai',
    title: 'Quelle voix ?',
    voices: [
      { slug: 'sulafat', name: 'Sulafat', provider: 'google', voiceId: 'fr-FR-Chirp3-HD-Sulafat' },
      { slug: 'leda', name: 'Leda', provider: 'google', voiceId: 'fr-FR-Chirp3-HD-Leda' },
      { slug: 'lucie', name: 'Lucie', note: 'voix par défaut', version: LUCIE },
    ],
    questions: [
      {
        id: 'place',
        legend: 'Sa place',
        options: [
          { value: 'menu', label: 'Au choix' },
          { value: 'defaut', label: 'Par défaut' },
        ],
      },
    ],
    ...overrides,
  };
}

const google = (slug, voiceId) => ({ slug, name: slug, provider: 'google', voiceId });
const charsOf = texts => texts.reduce((sum, text) => sum + [...text].length, 0);

describe('fichier du banc', () => {
  test('voix dans leur ordre : candidates aux réglages de synthèse, références publiées', () => {
    const setup = benchSetup(benchConfig());
    expect(setup.voices.map(voice => [voice.slug, voice.kind])).toEqual([
      ['sulafat', 'candidate'],
      ['leda', 'candidate'],
      ['lucie', 'reference'],
    ]);
    expect(setup.voices[0].voice).toMatchObject({
      provider: 'google',
      voiceId: 'fr-FR-Chirp3-HD-Sulafat',
      languageCode: 'fr-FR',
      sourceFormat: 'wav',
      settings: {},
      lang: 'fr',
      encoding: loadVoice('fr').encoding,
    });
    expect(setup.voices[2].voice.version).toBe(LUCIE);
    expect(setup.size).toBe(DEFAULT_SIZE);
    expect(setup.texts).toMatchObject({ name: 'Banc essai', question: 'Quelle voix retenir ?' });
    expect(setup.questions[0].options.map(option => option.value)).toEqual(['menu', 'defaut']);
  });

  const lucie = { slug: 'lucie', name: 'Lucie', version: LUCIE };
  test.each([
    ['aucune candidate', { voices: [lucie] }, 'aucune voix candidate'],
    [
      'fournisseur inconnu',
      { voices: [{ ...google('x', 'v'), provider: 'acme' }] },
      'fournisseur inconnu',
    ],
    ['identifiant qui sort du dossier', { voices: [google('../x', 'v')] }, 'minuscules'],
    ['voix en double', { voices: [google('a', 'v1'), google('a', 'v2')] }, 'en double'],
    [
      'fournisseur et version à la fois',
      { voices: [{ ...google('a', 'v'), version: LUCIE }] },
      "l'un ou l'autre",
    ],
    [
      'Mistral sans modèle',
      { voices: [{ ...google('a', 'v'), provider: 'mistral' }] },
      '« a.model » manquant',
    ],
    [
      'question à une réponse',
      { questions: [{ id: 'q', legend: 'Q', options: [{ value: 'a', label: 'A' }] }] },
      'au moins deux réponses',
    ],
    [
      'référence inconnue',
      { voices: [google('a', 'v'), { ...lucie, version: 'lucie-v9' }] },
      'lucie-v9',
    ],
    ['include qui n’est pas une liste', { include: 'Mode Quiz' }, 'include'],
    ['taille nulle', { size: 0 }, 'size'],
    ['langue qui n’en est pas une', { lang: '__proto__' }, '--lang'],
    ['sans nom', { name: '' }, '« name » manquant'],
  ])('refusé : %s', (_label, overrides, message) => {
    expect(() => benchSetup(benchConfig(overrides))).toThrow(message);
  });
});

describe('phrases du banc', () => {
  const longest = FR.filter(phrase => phrase.family === 'énoncé').sort(
    (a, b) => b.text.length - a.text.length
  )[0];

  test('22 phrases de toutes les familles, avec les pièges du français', () => {
    const phrases = benchPhrases(FR, 'fr');
    expect(phrases).toHaveLength(22);
    expect(new Set(phrases.map(phrase => phrase.key)).size).toBe(22);
    expect(new Set(phrases.map(phrase => phrase.family))).toEqual(new Set(FAMILY_ORDER));
    expect(phrases.filter(phrase => hasAgreement(phrase.text, 'fr')).length).toBeGreaterThanOrEqual(
      2
    );
    expect(phrases.some(phrase => phrase.family === 'question' && /\b11\b/.test(phrase.text))).toBe(
      true
    );
    expect(phrases.some(phrase => /\b\d{3}\b/.test(phrase.text))).toBe(true);
    expect(phrases.map(phrase => phrase.key)).toContain(longest.key);
    // La multiplication, cœur du jeu, dans les questions
    expect(phrases.some(phrase => phrase.family === 'question' && phrase.operator === '×')).toBe(
      true
    );
    for (const phrase of phrases) expect(phrase.said).toBe(saidText(phrase.text, 'fr'));
  });

  test('même tirage à chaque fois, rangé par famille, loin de « 1 fois 1 »', () => {
    const phrases = benchPhrases(FR, 'fr');
    expect(benchPhrases(FR, 'fr')).toEqual(phrases);
    const ranks = phrases.map(phrase => FAMILY_ORDER.indexOf(phrase.family));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(phrases.filter(phrase => /\b1 fois 1\b/.test(phrase.text))).toHaveLength(0);
  });

  test('phrases demandées gardées ; une phrase absente du corpus est refusée', () => {
    expect(benchPhrases(FR, 'fr', { include: ['Mode Quiz'] }).map(p => p.text)).toContain(
      'Mode Quiz'
    );
    expect(() => benchPhrases(FR, 'fr', { include: ['Mode Inconnu'] })).toThrow(
      'absentes du corpus fr : Mode Inconnu'
    );
  });

  test('banc plus petit que ses pièges : les pièges restent, les familles attendent', () => {
    const phrases = benchPhrases(FR, 'fr', { size: 3 });
    expect(phrases).toHaveLength(5);
    expect(phrases.map(phrase => phrase.key)).toContain(longest.key);
  });

  test('anglais : aucun accord, toujours 22 phrases', () => {
    const phrases = benchPhrases(buildCorpus('en'), 'en');
    expect(phrases).toHaveLength(22);
    expect(phrases.some(phrase => hasAgreement(phrase.text, 'en'))).toBe(false);
  });

  test('tirage centré : le milieu de chaque tranche', () => {
    const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(centered(list, 2)).toEqual([2, 7]);
    expect(centered(list, 1)).toEqual([5]);
    expect(centered(list, 0)).toEqual([]);
    expect(centered([1, 2], 5)).toEqual([1, 2]);
  });
});

/** Faux fournisseur : garde ses appels, rend un WAV qui porte la voix et le texte */
function fakeOpen(calls, failure) {
  return async voice => ({
    async synthesize({ text }) {
      calls.push({ voiceId: voice.voiceId, text });
      if (failure) throw failure;
      return { audio: Buffer.from(`RIFF----WAVE ${voice.voiceId} ${text}`) };
    },
  });
}

/** Traitement sans ffmpeg : le clip est la copie du brut, 1,25 s */
const fakeAudio = {
  process: (raw, out) => fsp.copyFile(raw, out),
  probe: async () => ({ duration: 1.25 }),
};
const noRetry = { delays: [], sleep: async () => {} };

let work;
let paths;
let setup;
let phrases;

beforeEach(async () => {
  work = await fsp.mkdtemp(path.join(os.tmpdir(), 'voice-bench-'));
  paths = benchPaths(path.join(work, 'banc'));
  await fsp.mkdir(paths.manifestDir, { recursive: true });
  setup = benchSetup(benchConfig());
  // Trois phrases : une question avec 11, et deux accords (« une fois 6 », « de une pomme »)
  phrases = benchPhrases(FR, 'fr', { size: 5 }).filter((_, index) => [0, 1, 4].includes(index));
});

afterEach(async () => {
  await fsp.rm(work, { recursive: true, force: true });
});

const plan = () => planBench({ voices: setup.voices, phrases, lang: 'fr', paths });
const neededChars = steps => steps.reduce((sum, step) => sum + step.chars, 0);
const run = (steps, open) =>
  synthesizeBench(steps, { paths, open, audio: fakeAudio, retry: noRetry });
const clipOf = (slug, key) => path.join(paths.outDir, 'clips', slug, `${key}.mp3`);

describe('synthèse du banc', () => {
  test('plafond vérifié avant tout appel : absent ou trop court, refusé', () => {
    const needed = neededChars(plan());
    expect(needed).toBe(2 * charsOf(phrases.map(phrase => phrase.said)));
    expect(() => assertCap(needed, 0, undefined)).toThrow(CapError);
    expect(() => assertCap(needed, 0, undefined)).toThrow('--max-total-chars obligatoire');
    expect(() => assertCap(needed, 10, needed + 9)).toThrow('Plafond insuffisant');
    expect(() => assertCap(needed, 10, needed + 10)).not.toThrow();
    expect(() => assertCap(0, 999, undefined)).not.toThrow();
  });

  test('chaque phrase payée une fois : registre, brut, clip et manifeste', async () => {
    const steps = plan();
    const calls = [];
    expect(await run(steps, fakeOpen(calls))).toBe(2 * phrases.length);
    expect(calls).toHaveLength(2 * phrases.length);
    expect(calls.map(call => call.text)).toContain(phrases[2].said);
    expect(billedChars({ billedFile: paths.billedFile })).toBe(neededChars(steps));
    for (const phrase of phrases) {
      expect(fs.existsSync(clipOf('sulafat', phrase.key))).toBe(true);
      expect(fs.existsSync(clipOf('leda', phrase.key))).toBe(true);
    }
    const again = plan();
    expect(again.map(step => [step.bench.slug, step.todo.length, step.chars])).toEqual([
      ['sulafat', 0, 0],
      ['leda', 0, 0],
    ]);
  });

  test('clip perdu : refait depuis son brut, sans appel', async () => {
    await run(plan(), fakeOpen([]));
    await fsp.rm(clipOf('leda', phrases[1].key));
    const steps = plan();
    expect(steps[1].todo.map(item => [item.phrase.key, item.paid])).toEqual([
      [phrases[1].key, true],
    ]);
    expect(neededChars(steps)).toBe(0);
    await run(steps, async () => {
      throw new Error('aucun appel attendu');
    });
    expect(fs.existsSync(clipOf('leda', phrases[1].key))).toBe(true);
  });

  test('réglages changés : les phrases se rachètent', async () => {
    await run(plan(), fakeOpen([]));
    const voices = benchConfig().voices.map(voice =>
      voice.slug === 'sulafat' ? { ...voice, voiceId: 'fr-FR-Chirp3-HD-Aoede' } : voice
    );
    setup = benchSetup(benchConfig({ voices }));
    const steps = plan();
    expect(steps[0].chars).toBe(charsOf(phrases.map(phrase => phrase.said)));
    expect(steps[1].chars).toBe(0);
  });

  test('réponse payée mais inutilisable : inscrite au registre, puis arrêt', async () => {
    const failure = new ProviderError('response', 'Google TTS : réponse sans WAV exploitable');
    await expect(run(plan(), fakeOpen([], failure))).rejects.toThrow(
      'Sulafat : Google TTS : réponse sans WAV'
    );
    expect(billedChars({ billedFile: paths.billedFile })).toBe(charsOf([phrases[0].said]));
  });
});

/** Dépôt des voix factice : Lucie a publié les deux premières phrases seulement */
async function fakeVoicesRepo() {
  const repo = path.join(work, 'voices');
  const clips = {};
  for (const phrase of phrases.slice(0, 2)) {
    const file = path.join(repo, 'clips', 'fr', LUCIE, `${phrase.key}.mp3`);
    await fsp.mkdir(path.dirname(file), { recursive: true });
    await fsp.writeFile(file, `mp3 lucie ${phrase.text}`);
    clips[phrase.key] = { text: phrase.text, said: phrase.said, duration: 2 };
  }
  const manifest = path.join(repo, 'manifests', 'fr', `${LUCIE}.json`);
  await fsp.mkdir(path.dirname(manifest), { recursive: true });
  await fsp.writeFile(manifest, JSON.stringify({ clips }));
  return repo;
}

/** Faux Whisper : transcrit chaque clip par sa phrase, sauf sulafat sur la première phrase */
function fakeWhisper(received) {
  return options => {
    received.push(options);
    const { clips } = JSON.parse(fs.readFileSync(options.paths.manifestFile, 'utf8'));
    const lines = Object.entries(clips).map(([key, entry]) => {
      const heard = key === `sulafat/${phrases[1].key}` ? 'Combien font 99 fois 99 ?' : entry.text;
      return JSON.stringify({ key, sha256: entry.sha256, heard });
    });
    fs.writeFileSync(options.transcripts, `${lines.join('\n')}\n`);
  };
}

async function benchResults() {
  await run(plan(), fakeOpen([]));
  await copyReferences(setup.voices, phrases, {
    paths,
    voicesRepo: await fakeVoicesRepo(),
    lang: 'fr',
  });
  const received = [];
  await transcribeBench(
    setup.voices,
    paths,
    { python: 'python-factice', lang: 'fr' },
    fakeWhisper(received)
  );
  const transcripts = fs
    .readFileSync(paths.transcripts, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
  const results = setup.voices.map(voice =>
    voiceResults(voice, phrases, { paths, lang: 'fr', transcripts })
  );
  return { received, results };
}

describe('références, Whisper et résultats', () => {
  test('références : clips publiés copiés ; une phrase sans clip reste absente', async () => {
    const copied = await copyReferences(setup.voices, phrases, {
      paths,
      voicesRepo: await fakeVoicesRepo(),
      lang: 'fr',
    });
    expect(copied).toBe(2);
    expect(fs.readFileSync(clipOf('lucie', phrases[0].key), 'utf8')).toBe(
      `mp3 lucie ${phrases[0].text}`
    );
    expect(fs.existsSync(clipOf('lucie', phrases[2].key))).toBe(false);
  });

  test('Whisper une fois pour toutes les voix ; doutes et débit par voix', async () => {
    const { received, results } = await benchResults();
    expect(received).toHaveLength(1);
    expect(received[0]).toMatchObject({
      python: 'python-factice',
      lang: 'fr',
      transcripts: paths.transcripts,
      paths: { manifestFile: paths.whisperManifest, clipDir: path.join(paths.outDir, 'clips') },
    });
    const keys = Object.keys(JSON.parse(fs.readFileSync(paths.whisperManifest, 'utf8')).clips);
    expect(keys).toHaveLength(2 * phrases.length + 2);
    expect(keys).toContain(`lucie/${phrases[0].key}`);

    const [sulafat, leda, lucie] = results;
    expect([sulafat.doubts, sulafat.judged]).toEqual([1, 3]);
    expect(sulafat.clips[phrases[1].key]).toMatchObject({
      flagged: true,
      heard: 'Combien font 99 fois 99 ?',
      src: `clips/sulafat/${phrases[1].key}.mp3`,
    });
    expect([leda.doubts, leda.judged]).toEqual([0, 3]);
    expect([lucie.doubts, lucie.judged]).toEqual([0, 2]);
    const said = phrases.map(phrase => phrase.said);
    expect(sulafat.rate).toBeCloseTo((3 * 1.25) / charsOf(said), 6);
    expect(lucie.rate).toBeCloseTo(4 / charsOf(said.slice(0, 2)), 6);
  });
});

describe('page du banc', () => {
  async function page() {
    const { results } = await benchResults();
    const written = await writeBenchPage({ setup, phrases, results, paths, corpus: FR });
    return { ...written, html: fs.readFileSync(paths.page, 'utf8') };
  }

  /** Page chargée dans jsdom, son script exécuté ; prepare(window) avant le script */
  function open(html, prepare = () => {}) {
    const played = [];
    const dom = new JSDOM(html, {
      url: 'http://localhost/banc/index.html',
      runScripts: 'dangerously',
      beforeParse(window) {
        window.HTMLMediaElement.prototype.play = function play() {
          played.push({ src: this.getAttribute('src'), audio: this });
          return Promise.resolve();
        };
        window.HTMLMediaElement.prototype.pause = function pause() {};
        prepare(window);
      },
    });
    return { window: dom.window, document: dom.window.document, played };
  }

  const settle = () => new Promise(resolve => setTimeout(resolve, 0));

  /** Stockage partagé factice : ses documents, et ses écritures */
  function sharedStore(initial = {}) {
    const docs = new Map(Object.entries(initial));
    const writes = [];
    const db = {
      doc: docPath => ({
        get: async () => ({ exists: docs.has(docPath), data: () => docs.get(docPath) }),
        set: async data => {
          writes.push({ docPath, data });
          docs.set(docPath, data);
        },
      }),
    };
    return { db, writes };
  }

  function choose(window, id) {
    const input = window.document.getElementById(id);
    input.checked = true;
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
  }

  test('titre, une ligne par phrase, un bouton par clip, fichiers à joindre et choix', async () => {
    const { html, files, batches } = await page();
    expect(html.startsWith('<title>Banc essai</title>')).toBe(true);
    const { document } = open(html);
    expect(document.querySelectorAll('.item')).toHaveLength(phrases.length);
    const buttons = [...document.querySelectorAll('button.play')];
    expect(buttons).toHaveLength(2 * phrases.length + 2);
    expect(files).toEqual(buttons.map(button => button.dataset.src).sort(bySlugOrder));
    expect(JSON.parse(fs.readFileSync(paths.filesList, 'utf8'))).toEqual(
      files.map(file => ({ path: file }))
    );
    expect(batches).toBe(1);
    expect(document.querySelectorAll('button.play.doubt')).toHaveLength(1);
    expect(document.querySelector('.heard').textContent).toContain('Combien font 99 fois 99 ?');
    expect(document.querySelector('.missing').textContent).toBe('Lucie : pas de clip');
    const picks = [...document.querySelectorAll('input[name="pick"]')].map(input => input.value);
    expect(picks).toEqual(['sulafat', 'leda', 'aucune']);
    expect(document.getElementById('q-place-defaut')).not.toBeNull();
    expect(document.getElementById('choice').dataset.doc).toBe('choix/essai');
  });

  test('textes du banc échappés dans la page', async () => {
    setup = benchSetup(benchConfig({ title: 'Voix <b>grasse</b> & co', intro: '"<i>"' }));
    const { html } = await page();
    expect(html).toContain('<h1>Voix &lt;b&gt;grasse&lt;/b&gt; &amp; co</h1>');
    expect(html).toContain('<p>&quot;&lt;i&gt;&quot;</p>');
  });

  test('le choix va dans le stockage partagé de l’artifact, et y est relu', async () => {
    const { html } = await page();
    const store = sharedStore({
      'choix/essai': { voice: 'leda', answers: { place: 'defaut' }, comment: 'plus lente' },
    });
    const { window, document } = open(html, win => {
      win.claude = { use: async name => (name === 'db' ? store.db : null) };
    });
    await settle();
    await settle();
    expect(document.getElementById('pick-leda').checked).toBe(true);
    expect(document.getElementById('q-place-defaut').checked).toBe(true);
    expect(document.getElementById('remarque').value).toBe('plus lente');
    expect(document.getElementById('status').textContent).toBe('Choix partagé avec Claude.');

    choose(window, 'pick-sulafat');
    await settle();
    expect(store.writes).toHaveLength(1);
    expect(store.writes[0].docPath).toBe('choix/essai');
    expect(store.writes[0].data).toMatchObject({
      voice: 'sulafat',
      answers: { place: 'defaut' },
      comment: 'plus lente',
    });
    expect(typeof store.writes[0].data.updatedAt).toBe('string');
    expect(document.getElementById('status').textContent).toBe('Enregistré : Claude le lira.');
  });

  test('hors artifact, le choix reste dans ce navigateur', async () => {
    const { html } = await page();
    const { window, document } = open(html);
    choose(window, 'pick-aucune');
    expect(JSON.parse(window.localStorage.getItem('banc-essai'))).toMatchObject({
      voice: 'aucune',
      answers: { place: null },
    });
    expect(document.getElementById('status').textContent).toBe(
      'Gardé dans ce navigateur seulement.'
    );
  });

  test('« Tout écouter » enchaîne les clips d’une voix, « Stop » arrête', async () => {
    const { html } = await page();
    const { window, document, played } = open(html);
    document.querySelector('button.all[data-voice="leda"]').click();
    expect(document.getElementById('player-bar').hidden).toBe(false);
    played.at(-1).audio.dispatchEvent(new window.Event('ended'));
    played.at(-1).audio.dispatchEvent(new window.Event('ended'));
    expect(played.map(entry => entry.src)).toEqual(
      phrases.map(phrase => `clips/leda/${phrase.key}.mp3`)
    );
    document.getElementById('stop').click();
    expect(document.getElementById('player-bar').hidden).toBe(true);
    document.querySelector('button.every').click();
    expect(played.at(-1).src).toBe(`clips/sulafat/${phrases[0].key}.mp3`);
  });
});

/** Ordre des fichiers à joindre : voix du banc, puis phrases */
function bySlugOrder(a, b) {
  const order = ['sulafat', 'leda', 'lucie'];
  const slug = file => order.indexOf(file.split('/')[1]);
  return slug(a) - slug(b);
}

describe('commande', () => {
  const writeConfig = () => {
    const file = path.join(work, 'banc.json');
    fs.writeFileSync(file, JSON.stringify(benchConfig()));
    return file;
  };
  const bench = (...args) =>
    spawnSync(process.execPath, [SCRIPT, '--config', writeConfig(), ...args], {
      encoding: 'utf8',
      env: { ...process.env, GOOGLE_TTS_API_KEY: '' },
    });

  test('essai à blanc : phrases et caractères, sans appel ni écriture', () => {
    const out = path.join(work, 'sortie');
    const result = bench('--dry-run', '--out', out);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`${DEFAULT_SIZE} phrases :`);
    expect(result.stdout).toMatch(/Sulafat \(google\) : 22 clips à faire, \d+ caractères à payer/);
    expect(fs.existsSync(out)).toBe(false);
  });

  test('sans plafond, refus de payer (code 3), avant tout appel', () => {
    const result = bench('--out', path.join(work, 'sortie'));
    expect(result.status).toBe(3);
    expect(result.stderr).toContain('--max-total-chars obligatoire');
  });

  test('options : --config requis, --list-voices avec sa langue, Whisper du dossier courant', () => {
    expect(() => parseArgs([])).toThrow('--config <banc.json> est requis');
    expect(() => parseArgs(['--list-voices', 'google'])).toThrow('--language-code');
    expect(parseArgs(['--config', 'b.json'], '/atelier').python).toBe(
      '/atelier/.venv-whisper/bin/python'
    );
    expect(() => parseArgs(['--config', 'b.json', '--max-total-chars', '0'])).toThrow(
      '--max-total-chars attend un entier ≥ 1'
    );
  });
});

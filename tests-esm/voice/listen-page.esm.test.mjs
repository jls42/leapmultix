/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Pages d'écoute des clips (scripts/voice/listen-page.mjs) : clips signalés, échantillon des
 * formes féminines et des textes imposés, cases « à refaire » (script de la page exécuté dans
 * jsdom), comparaison avant/après des clips refaits, et la commande.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { voiceKey } from '../../js/core/spoken-text.js';
import { saidText } from '../../scripts/voice/said-text.mjs';
import {
  buildComparePage,
  buildListenPage,
  escapeHtml,
  evenlySpaced,
  saidSample,
} from '../../scripts/voice/listen-page.mjs';
import {
  newManifest,
  replacedFile,
  sha256,
  storePaths,
  writeManifest,
} from '../../scripts/voice/clip-store.mjs';
import { loadVoice } from '../../scripts/voice/generate.mjs';

const SCRIPT = path.resolve('scripts/voice/listen-page.mjs');
const VOICE = { ...loadVoice('fr'), version: 'test-1' };

const phrase = text => ({ text, key: voiceKey(text) });
/** Nombres entendus différents */
const WRONG = phrase('Combien font 7 fois 8 ?');
/** Durée anormale (6 s pour 9 caractères) */
const SLOW = phrase('Mode Quiz');
/** Forme féminine : « une fois 7 », bien entendue */
const FEMININE = phrase('Combien font 1 fois 7 ?');
/** Texte imposé (SAID_OVERRIDES), bien entendu */
const IMPOSED = phrase('108 divisé par 12 égale 9');
/** Rien à redire */
const FINE = phrase('Bravo !');
/** Transcription piégée : du HTML entendu par Whisper, et un nombre de trop */
const TRAPPED = phrase('Bonne réponse !');

let outDir;
let paths;
let pageDir;

const contentOf = p => `mp3 ${p.text}`;

// Durée d'une vraie voix : proportionnelle au texte dit (0,1 s par caractère)
async function addClip(
  p,
  { duration = [...saidText(p.text, 'fr')].length * 0.1, data = contentOf(p) } = {}
) {
  await fsp.mkdir(paths.clipDir, { recursive: true });
  await fsp.writeFile(path.join(paths.clipDir, `${p.key}.mp3`), data);
  const entry = { text: p.text, said: saidText(p.text, 'fr'), duration, sha256: sha256(data) };
  return [p.key, entry];
}

async function saveManifest(entries, voice = VOICE) {
  const manifest = newManifest('fr', voice);
  manifest.clips = Object.fromEntries(entries);
  await writeManifest(paths, manifest);
  return manifest;
}

const heard = (p, text, data = contentOf(p)) => ({ key: p.key, sha256: sha256(data), heard: text });

/** Dépôt de voix de test : six clips, et ce que Whisper en a entendu */
async function standardStore() {
  const manifest = await saveManifest(
    await Promise.all([
      addClip(WRONG),
      addClip(SLOW, { duration: 6 }),
      addClip(FEMININE),
      addClip(IMPOSED),
      addClip(FINE),
      addClip(TRAPPED),
    ])
  );
  const transcripts = [
    // Transcription d'un ancien contenu : ignorée, même juste
    { key: WRONG.key, sha256: 'ancien-contenu', heard: 'Combien font 7 fois 8 ?' },
    heard(WRONG, 'Combien font 7 fois 6 ?'),
    heard(SLOW, 'Mode Quiz'),
    heard(FEMININE, 'Combien font une fois sept ?'),
    heard(IMPOSED, 'Cent huit divisé par douze égale neuf.'),
    heard(FINE, 'Bravo !'),
    heard(TRAPPED, '<img src=x onerror="alert(1)"> Bonne réponse 3'),
  ];
  return { manifest, transcripts };
}

function listenPage({ manifest, transcripts }, sample = 24) {
  return buildListenPage({
    lang: 'fr',
    voice: VOICE,
    manifest,
    transcripts,
    sample,
    paths,
    pageDir,
  });
}

/** Page chargée dans jsdom, son script exécuté ; prepare(window) avant le script */
function openPage(html, prepare = () => {}) {
  const dom = new JSDOM(html, {
    url: 'http://localhost/ecoute/page.html',
    runScripts: 'dangerously',
    beforeParse(window) {
      window.HTMLMediaElement.prototype.pause = function pause() {
        this.dataset.paused = 'oui';
      };
      prepare(window);
    },
  });
  return dom.window;
}

/** Cartes d'une section (par son titre) : empreinte et raison */
function cardsOf(document, title) {
  const heading = [...document.querySelectorAll('h2')].find(h2 => h2.textContent === title);
  const list = heading.nextElementSibling;
  return [...list.querySelectorAll('.card')].map(card => ({
    key: card.querySelector('code').textContent,
    reason: card.querySelector('.reason')?.textContent,
    text: card.querySelector('dd').textContent,
    rows: Object.fromEntries(
      [...card.querySelectorAll('dt')].map(dt => [
        dt.textContent,
        dt.nextElementSibling.textContent,
      ])
    ),
    audio: [...card.querySelectorAll('audio')].map(audio => audio.getAttribute('src')),
  }));
}

beforeEach(async () => {
  outDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'voices-listen-'));
  paths = storePaths(outDir, 'fr', VOICE.version);
  pageDir = path.join(outDir, 'ecoute');
});

afterEach(() => fsp.rm(outDir, { recursive: true, force: true }));

describe('Page d’écoute : clips signalés', () => {
  test('nombres mal entendus et durée anormale signalés, les clips justes absents', async () => {
    const { html, summary } = listenPage(await standardStore());
    const { document } = new JSDOM(html).window;
    const flagged = cardsOf(document, 'Signalés par Whisper ou par leur durée');
    expect(flagged.map(card => [card.key, card.reason])).toEqual([
      [WRONG.key, 'Nombres entendus différents'],
      [TRAPPED.key, 'Nombres entendus différents'],
      [SLOW.key, 'Durée anormale'],
    ]);
    // La transcription du contenu actuel, pas celle d'un ancien contenu
    expect(flagged[0].rows.Whisper).toBe('Combien font 7 fois 6 ?');
    expect(flagged[0].audio).toEqual([`../clips/fr/test-1/${WRONG.key}.mp3`]);
    expect(summary).toContain('3 clips signalés (Whisper : 2, durée : 1)');
  });

  test('sans transcriptions : seules les durées signalent, et la page le dit', async () => {
    const { manifest } = await standardStore();
    const { html } = listenPage({ manifest, transcripts: [] });
    const { document } = new JSDOM(html).window;
    const flagged = cardsOf(document, 'Signalés par Whisper ou par leur durée');
    expect(flagged.map(card => card.key)).toEqual([SLOW.key]);
    expect(document.querySelector('main').textContent).toContain('seules les durées signalent');
  });

  test('une transcription piégée reste du texte : aucun élément injecté', async () => {
    const { html } = listenPage(await standardStore());
    const { document } = new JSDOM(html).window;
    expect(document.querySelectorAll('img')).toHaveLength(0);
    expect(document.querySelectorAll('script')).toHaveLength(1);
    const trapped = cardsOf(document, 'Signalés par Whisper ou par leur durée').find(
      card => card.key === TRAPPED.key
    );
    expect(trapped.rows.Whisper).toBe('<img src=x onerror="alert(1)"> Bonne réponse 3');
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;'
    );
  });
});

describe('Page d’écoute : formes féminines et textes imposés', () => {
  test('textes dits différents : le texte imposé d’abord, puis les accords en genre', async () => {
    const { html } = listenPage(await standardStore());
    const { document } = new JSDOM(html).window;
    const said = cardsOf(document, 'Texte dit différent de la phrase (échantillon)');
    expect(said.map(card => [card.key, card.reason])).toEqual([
      [IMPOSED.key, 'Texte imposé'],
      [FEMININE.key, 'Accord en genre'],
    ]);
    expect(said[1].rows).toMatchObject({
      Phrase: 'Combien font 1 fois 7 ?',
      'Texte dit': 'Combien font une fois 7 ?',
      Whisper: 'Combien font une fois sept ?',
    });
  });

  test('échantillon borné : textes imposés d’abord, puis accords régulièrement espacés', () => {
    // Onze formes féminines, dont plusieurs trient avant le texte imposé
    const feminine = Array.from({ length: 11 }, (_, i) => phrase(`Combien font 1 fois ${i + 2} ?`));
    const entry = p => ({ text: p.text, said: saidText(p.text, 'fr'), duration: 1.2 });
    const manifest = {
      clips: Object.fromEntries([IMPOSED, FINE, ...feminine].map(p => [p.key, entry(p)])),
    };
    const sorted = feminine.map(p => p.key).sort((a, b) => a.localeCompare(b));
    expect(sorted[0].localeCompare(IMPOSED.key)).toBeLessThan(0);

    expect(saidSample(manifest, 'fr', 1)).toEqual([IMPOSED.key]);
    expect(saidSample(manifest, 'fr', 4)).toEqual([IMPOSED.key, sorted[0], sorted[3], sorted[7]]);
    expect(saidSample(manifest, 'fr', 50)).toHaveLength(12);
    expect(saidSample(manifest, 'fr', 0)).toEqual([]);
    expect(evenlySpaced([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3)).toEqual([0, 3, 6]);
    expect(evenlySpaced([0, 1], 5)).toEqual([0, 1]);
    expect(evenlySpaced([0, 1], 0)).toEqual([]);
  });
});

describe('Cases « à refaire » (script de la page)', () => {
  const STORE = 'ecoute-fr-test-1';

  function check(window, ...keys) {
    for (const box of window.document.querySelectorAll('.redo-box')) {
      if (!keys.includes(box.value)) continue;
      box.checked = true;
      box.dispatchEvent(new window.Event('change'));
    }
  }

  test('les cases cochées forment la liste, gardée pour la prochaine ouverture', async () => {
    const { html } = listenPage(await standardStore());
    const window = openPage(html);
    const { document } = window;
    expect(document.getElementById('redo-count').textContent).toBe('0 clip à refaire');
    check(window, WRONG.key, FEMININE.key);
    expect(document.getElementById('redo-list').value).toBe(`${WRONG.key}\n${FEMININE.key}`);
    expect(document.getElementById('redo-count').textContent).toBe('2 clips à refaire');
    const box = document.querySelector(`.redo-box[value="${WRONG.key}"]`);
    expect(box.closest('.card').classList.contains('checked')).toBe(true);
    expect(box.getAttribute('aria-label')).toBe('À refaire : Combien font 7 fois 8 ?');

    const saved = window.localStorage.getItem(STORE);
    const reopened = openPage(html, next => next.localStorage.setItem(STORE, saved));
    expect(reopened.document.getElementById('redo-list').value).toBe(
      `${WRONG.key}\n${FEMININE.key}`
    );
  });

  test('un clip refait depuis n’est plus coché, les autres le restent', async () => {
    const store = await standardStore();
    const window = openPage(listenPage(store).html);
    check(window, WRONG.key, SLOW.key);
    const saved = window.localStorage.getItem(STORE);
    // WRONG refait : nouveau contenu, toujours mal entendu, donc toujours sur la page
    const redone = 'mp3 refait';
    store.manifest.clips[WRONG.key].sha256 = sha256(redone);
    store.transcripts.push(heard(WRONG, 'Combien font 7 fois 5 ?', redone));
    const reopened = openPage(listenPage(store).html, next =>
      next.localStorage.setItem(STORE, saved)
    );
    const box = reopened.document.querySelector(`.redo-box[value="${WRONG.key}"]`);
    expect(box.checked).toBe(false);
    expect(reopened.document.getElementById('redo-list').value).toBe(SLOW.key);
  });

  test('stockage refusé : la liste marche, la page prévient', async () => {
    const { html } = listenPage(await standardStore());
    const window = openPage(html, next => {
      next.Storage.prototype.setItem = () => {
        throw new next.DOMException('Stockage plein', 'QuotaExceededError');
      };
    });
    check(window, SLOW.key);
    expect(window.document.getElementById('redo-list').value).toBe(SLOW.key);
    expect(window.document.getElementById('redo-status').textContent).toContain('Stockage refusé');
  });

  test('copie : presse-papiers, sinon liste sélectionnée', async () => {
    const { html } = listenPage(await standardStore());
    const copied = [];
    const window = openPage(html, next => {
      Object.defineProperty(next.navigator, 'clipboard', {
        configurable: true,
        value: { writeText: async text => copied.push(text) },
      });
    });
    check(window, SLOW.key);
    window.document.getElementById('redo-copy').click();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(copied).toEqual([SLOW.key]);
    expect(window.document.getElementById('redo-status').textContent).toBe('Liste copiée.');

    const refused = openPage(html);
    check(refused, SLOW.key);
    refused.document.getElementById('redo-copy').click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const list = refused.document.getElementById('redo-list');
    expect([list.selectionStart, list.selectionEnd]).toEqual([0, SLOW.key.length]);
    expect(refused.document.getElementById('redo-status').textContent).toContain('Copie refusée');
  });

  test('un seul clip à la fois : en lancer un arrête les autres', async () => {
    const { html } = listenPage(await standardStore());
    const window = openPage(html);
    const [first, ...others] = window.document.querySelectorAll('audio');
    first.dispatchEvent(new window.Event('play'));
    expect(first.dataset.paused).toBeUndefined();
    expect(others.length).toBeGreaterThan(0);
    expect(others.every(audio => audio.dataset.paused === 'oui')).toBe(true);
  });
});

describe('Comparaison avant/après des clips refaits', () => {
  const NEW_WRONG = 'mp3 refait';
  const OLD_WRONG = contentOf(WRONG);

  /** WRONG refait (ancien gardé), FEMININE refait sans ancien gardé, SLOW pas encore transcrit */
  async function redoneStore() {
    const manifest = await saveManifest(
      await Promise.all([
        addClip(WRONG, { data: NEW_WRONG }),
        addClip(FEMININE, { data: 'mp3 refait aussi' }),
        addClip(SLOW, { data: 'mp3 refait encore' }),
      ])
    );
    await fsp.mkdir(paths.replacedDir, { recursive: true });
    await fsp.writeFile(replacedFile(paths, WRONG.key), OLD_WRONG);
    const transcripts = [
      heard(WRONG, 'Combien font 7 fois 6 ?', OLD_WRONG),
      heard(FEMININE, 'Combien font un fois sept ?', 'mp3 premier essai'),
      heard(FEMININE, 'Combien font une fois six ?', 'mp3 deuxième essai'),
      heard(WRONG, 'Combien font 7 fois 8 ?', NEW_WRONG),
      heard(FEMININE, 'Combien font une fois sept ?', 'mp3 refait aussi'),
    ];
    return { manifest, transcripts };
  }

  function comparePage({ manifest, transcripts }, keys) {
    return buildComparePage({
      lang: 'fr',
      voice: VOICE,
      manifest,
      transcripts,
      keys,
      paths,
      pageDir,
    });
  }

  test('ancien et nouveau clip, ce que Whisper a entendu de chacun, et son verdict', async () => {
    // En double, inconnue, ou nom d'une propriété de tout objet : jamais une fausse carte
    const keys = [WRONG.key, FEMININE.key, SLOW.key, WRONG.key, 'inconnu', 'constructor'];
    const { html, summary } = comparePage(await redoneStore(), keys);
    const { document } = new JSDOM(html).window;
    const cards = cardsOf(document, 'Avant et après');
    expect(cards.map(card => card.key)).toEqual([WRONG.key, FEMININE.key, SLOW.key]);

    const [wrong, feminine, slow] = cards;
    expect(wrong.rows).toMatchObject({
      'Whisper avant': 'Combien font 7 fois 6 ?',
      'Whisper après': 'Combien font 7 fois 8 ?',
    });
    expect(wrong.audio).toEqual([
      `avant/fr/test-1/${WRONG.key}.mp3`,
      `../clips/fr/test-1/${WRONG.key}.mp3`,
    ]);
    // Ancien clip non gardé : la dernière transcription d'un autre contenu
    expect(feminine.rows['Whisper avant']).toBe('Combien font une fois six ?');
    expect(feminine.audio).toEqual([`../clips/fr/test-1/${FEMININE.key}.mp3`]);
    expect(slow.rows['Whisper après']).toBeUndefined();

    const badges = [...document.querySelectorAll('.badge')].map(badge => badge.textContent);
    expect(badges).toEqual([
      'Whisper : juste',
      'Whisper : juste',
      'Pas encore transcrit : relancer Whisper',
    ]);
    expect(document.querySelector('main').textContent).toContain('inconnu constructor');
    expect(summary).toBe(
      'Comparaison fr test-1 : 3 clips refaits (Whisper : 2 justes, 0 douteux, 1 pas encore transcrit), 2 sans clip'
    );
  });

  test('un clip refait toujours mal entendu : Whisper doute encore', async () => {
    const store = await redoneStore();
    store.transcripts.push(heard(WRONG, 'Combien font 7 fois 9 ?', NEW_WRONG));
    const { html } = comparePage(store, [WRONG.key]);
    const { document } = new JSDOM(html).window;
    expect(document.querySelector('.badge').textContent).toBe('Whisper doute encore');
    expect(document.querySelector('.redo-box').getAttribute('aria-label')).toBe(
      'Encore à refaire : Combien font 7 fois 8 ?'
    );
  });
});

describe('Commande', () => {
  const run = (...args) =>
    spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', cwd: path.resolve('.') });
  const liveVoice = loadVoice('fr');

  beforeEach(() => {
    paths = storePaths(outDir, 'fr', liveVoice.version);
  });

  test('écrit la page dans ecoute/ du dépôt des voix et en donne l’adresse', async () => {
    // La durée se juge au débit médian de la voix : il faut assez de clips normaux autour
    const normal = await Promise.all([FEMININE, FINE].map(p => addClip(p)));
    await saveManifest([await addClip(SLOW, { duration: 6 }), ...normal], liveVoice);
    const transcripts = path.join(outDir, 'transcripts-fr.jsonl');
    fs.writeFileSync(
      transcripts,
      `${JSON.stringify(heard(FEMININE, 'Combien font une fois sept ?'))}\n`
    );
    const result = run('--lang', 'fr', '--out', outDir, '--transcripts', transcripts);
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
    const page = path.join(outDir, 'ecoute', `fr-${liveVoice.version}.html`);
    expect(result.stdout).toContain(`file://${page}`);
    expect(result.stdout).toContain(
      '1 clip signalé (Whisper : 0, durée : 1), 1 texte dit différent'
    );
    expect(fs.readFileSync(page, 'utf8')).toContain(SLOW.key);

    const list = path.join(outDir, 'ecartes.txt');
    fs.writeFileSync(list, `${SLOW.key}\n`);
    const compared = run('--lang', 'fr', '--out', outDir, '--compare', list);
    expect(compared.status).toBe(0);
    expect(compared.stdout).toContain(`fr-${liveVoice.version}-refaits.html`);
  });

  test('manifeste absent, empreinte invalide, option inconnue ou langue manquante : échec', async () => {
    const absent = run('--lang', 'fr', '--out', outDir);
    expect(absent.status).toBe(1);
    expect(absent.stderr).toContain('Manifeste introuvable');

    await saveManifest([await addClip(SLOW)], liveVoice);
    const list = path.join(outDir, 'ecartes.txt');
    fs.writeFileSync(list, '../../etc/passwd\n');
    const invalid = run('--lang', 'fr', '--out', outDir, '--compare', list);
    expect(invalid.status).toBe(1);
    expect(invalid.stderr).toContain('Empreinte invalide');

    expect(run('--lang', 'fr', '--out', outDir, '--bruit').status).toBe(1);
    expect(run('--out', outDir).status).toBe(1);
  });
});

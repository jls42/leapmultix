// Tournage de la vidéo de la fiche Play Store : une scène par écran ou par jeu, chacune dans
// son fichier, avec le journal de ce qui s'y passe (pour couper au montage).
//   node .claude/skills/filming-store-video/filmer.mjs <fr|en|es> [scène…]
// Sorties : analysis/video-fiche/prises/<langue>/<scène>.webm et journal.json (PRISES=<dossier>
// pour un autre endroit). Sans scène nommée, toutes sont filmées.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RACINE,
  TAKES,
  clickNow,
  film,
  home,
  launchArcade,
  open,
  tap,
  tapAt,
  wait,
} from './base.mjs';
import { explained, readQuestion, tapOption } from './modes.mjs';
import {
  friendWatcher,
  lowestWrongAnswer,
  playArcade,
  playMemory,
  playMiam,
  rightAnswer,
} from './arcade.mjs';

const [lang = 'fr', ...wanted] = process.argv.slice(2);
const out = join(TAKES, lang);

/* --- Quiz : une bonne réponse sur un calcul à quatre choix, puis une erreur expliquée --- */

function quizPick(q, need) {
  if (q.answer === null) return q.options[0];
  return need === 'erreur' ? q.options.find(option => option !== q.answer) : q.answer;
}

/** Une question du Quiz ; rend ce qu'il reste à montrer (`bonne`, `erreur` ou null). */
async function quizTurn(page, mark, need) {
  const q = await readQuestion(page);
  if (!q.options.length) return null;
  mark('question', { q: q.text, kind: q.kind });
  await wait(1300);
  await tapOption(page, quizPick(q, need));
  await wait(450);
  const wrong = await explained(page);
  mark(wrong ? 'erreur' : 'bonne', { q: q.text, kind: q.kind });
  if (!wrong) {
    await wait(1900);
    return need === 'bonne' && q.kind === 'calcul' ? 'erreur' : need;
  }
  if (need === 'erreur') {
    await wait(4500);
    return null;
  }
  // Erreur non voulue (question qui ne se lit pas) : on passe à la suivante
  await wait(900);
  await clickNow(page, '.slide.active-slide .game-continue .btn');
  await wait(700);
  return need;
}

/* --- Chrono : la réponse se tape au pavé, le jeu valide seul --- */

function chronoPad(page) {
  return page.evaluate(() => {
    const question = document.querySelector('#chrono-question');
    const keys = [...document.querySelectorAll('.slide.active-slide .chrono-key')]
      .filter(el => el.offsetParent !== null)
      .map(el => {
        const r = el.getBoundingClientRect();
        return {
          label: el.textContent.replace(/\s+/g, ' ').trim(),
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
        };
      });
    return { text: (question?.textContent ?? '').replace(/\s+/g, ' ').trim(), keys };
  });
}

async function chronoTurn(page, mark) {
  const pad = await chronoPad(page);
  const m = /^(\d+) × (\d+) = \?$/.exec(pad.text);
  if (!m) return false;
  mark('question', { q: pad.text });
  await wait(700);
  for (const digit of String(Number(m[1]) * Number(m[2]))) {
    const key = pad.keys.find(candidate => candidate.label === digit);
    await tapAt(page, key.x, key.y);
    await wait(380);
  }
  mark('valide');
  await wait(1500);
  return true;
}

/* --- Les scènes --- */

const SCENES = new Map([
  [
    'accueil',
    async (page, mark) => {
      await wait(2600);
      mark('repos');
      await tap(page, '.operation-btn:nth-child(2)');
      mark('addition');
      await wait(1100);
      await tap(page, '.operation-btn:nth-child(1)');
      mark('multiplication');
      await wait(1100);
      await tap(page, '.mode-btn[data-mode="quiz"]');
      mark('quiz');
      await wait(1200);
    },
  ],
  [
    'quiz',
    async (page, mark) => {
      let need = 'bonne';
      for (let i = 0; i < 14 && need; i++) need = await quizTurn(page, mark, need);
    },
  ],
  [
    'decouverte',
    async (page, mark) => {
      await wait(1400);
      await tap(page, '.slide.active-slide .lab-item:nth-of-type(7)');
      mark('table');
      await wait(1800);
      await tap(page, '.slide.active-slide .carousel-item:nth-of-type(4)');
      mark('calcul');
      await wait(3200);
    },
  ],
  [
    'defi',
    async (page, mark) => {
      await wait(900);
      await tap(page, '.slide.active-slide .difficulty-options button');
      mark('depart');
      await wait(4700);
      for (let i = 0; i < 4; i++) {
        const q = await readQuestion(page);
        if (!q.options.length) break;
        mark('question', { q: q.text });
        await wait(900);
        await tapOption(page, q.answer ?? q.options[0]);
        mark('reponse');
        await wait(1500);
      }
    },
  ],
  [
    'chrono',
    async (page, mark) => {
      await wait(900);
      await tap(page, '#chrono-start');
      mark('depart');
      await wait(4700);
      for (let i = 0; i < 3; i++) if (!(await chronoTurn(page, mark))) break;
    },
  ],
  [
    'aventure',
    async (page, mark) => {
      await wait(2600);
      mark('carte');
      await tap(page, '.slide.active-slide .level-card.is-available');
      mark('niveau');
      await wait(1700);
      const q = await readQuestion(page);
      if (!q.options.length) return;
      await tapOption(page, q.answer ?? q.options[0]);
      mark('reponse', { q: q.text });
      await wait(1800);
    },
  ],
  [
    'arcade-menu',
    async (page, mark) => {
      await wait(2400);
      mark('menu');
      await tap(page, '.arcade-game-card[data-game="multipop"] .arcade-game-toggle');
      mark('ouvre');
      await wait(1800);
    },
  ],
  [
    'multipop',
    (page, mark) =>
      playArcade(page, mark, {
        seconds: 14,
        gap: 220,
        choose: q => rightAnswer(page, q),
        // L'ami (un autre héros, à ne pas taper) : toute image qui n'est ni monstre ni décor
        watch: friendWatcher(page, mark, src => !/^(monstre|herbe|maillet)/.test(src)),
      }),
  ],
  [
    'multigoal',
    (page, mark) =>
      playArcade(page, mark, { seconds: 16, gap: 1500, choose: q => rightAnswer(page, q) }),
  ],
  [
    'invasion',
    (page, mark) =>
      playArcade(page, mark, {
        seconds: 14,
        gap: 520,
        choose: q => lowestWrongAnswer(page, q),
        // L'ami libéré est un héros tiré au sort : la fiche ne montre pas l'astronaute
        watch: friendWatcher(page, mark, src => src.startsWith('astronaut')),
      }),
  ],
  ['multimiam', (page, mark) => playMiam(page, mark)],
  [
    'multisnake',
    (page, mark) =>
      playArcade(page, mark, { seconds: 18, gap: 380, choose: q => rightAnswer(page, q) }),
  ],
  ['multimemory', (page, mark) => playMemory(page, mark)],
]);

const MODES = new Map([
  ['quiz', 'quiz'],
  ['decouverte', 'discovery'],
  ['defi', 'challenge'],
  ['chrono', 'chrono'],
  ['aventure', 'adventure'],
  ['arcade-menu', 'arcade'],
]);
const GAMES = new Set([
  'multipop',
  'multigoal',
  'invasion',
  'multimiam',
  'multisnake',
  'multimemory',
]);

/** Amène à l'écran de la scène, hors champ. */
async function enter(session, name) {
  await home(session.page, session.url);
  if (MODES.has(name)) {
    await clickNow(session.page, `.mode-btn[data-mode="${MODES.get(name)}"]`);
    await wait(700);
  }
  if (GAMES.has(name)) {
    await launchArcade(session.page, name);
    await wait(1200);
  }
}

/** Un jeu d'Arcade a son extrait : une bonne réponse sans faute ni ami dans les secondes d'avant */
function hasCleanWin(marks) {
  const spoiled = win =>
    marks.some(m => ['perd', 'ami'].includes(m.name) && m.t > win.t - 2.2 && m.t < win.t + 0.9);
  return marks.some(m => m.name === 'gagne' && m.t >= 2.2 && !spoiled(m));
}

/** Une prise est bonne si le montage y trouve son extrait (mêmes règles que monter.mjs). */
function usable(name, marks) {
  const has = wantedName => marks.some(m => m.name === wantedName);
  if (name === 'quiz') {
    return marks.some(m => m.name === 'bonne' && m.kind === 'calcul') && has('erreur');
  }
  if (name === 'multimemory') return marks.some(m => m.name === 'paire' && m.t >= 3);
  return GAMES.has(name) ? hasCleanWin(marks) : true;
}

function summary(marks) {
  const quiet = new Set(['geste', 'carte', 'fin', 'ami']);
  return marks
    .filter(m => !quiet.has(m.name))
    .map(m => `${m.name}@${m.t}`)
    .join(' ')
    .slice(0, 140);
}

/** Filme une scène ; une prise sans extrait pour le montage se refait, trois essais au plus. */
async function shoot(session, name, play) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const marks = await takeOf(session, name, play);
    if (marks) return marks;
  }
  return null;
}

/** Une prise : ses marques si le montage peut s'en servir, sinon null. */
async function takeOf(session, name, play) {
  try {
    await enter(session, name);
    const marks = await film(session.page, join(out, `${name}.webm`), mark =>
      play(session.page, mark)
    );
    const good = usable(name, marks);
    const seconds = `${String(marks.at(-1).t).padStart(6)} s`;
    console.log(name.padEnd(12), seconds, good ? 'bonne    ' : 'à refaire', summary(marks));
    return good ? marks : null;
  } catch (error) {
    // Un écran qui n'arrive pas (bouton absent, délai dépassé) ne doit pas arrêter les autres
    // scènes : la prise compte comme ratée, et l'erreur se lit ici
    console.log(name.padEnd(12), 'échec    ', error.message.split('\n')[0]);
    return null;
  }
}

/** Le journal de la langue, scène par scène */
function readJournal(file) {
  try {
    return new Map(Object.entries(JSON.parse(readFileSync(file, 'utf8'))));
  } catch {
    // Premier tournage de la langue : pas encore de journal
    return new Map();
  }
}

/** Range les marques d'une scène ; une scène sans bonne prise sort du journal, comme son fichier */
function recordScene(file, name, marks) {
  const journal = readJournal(file);
  if (marks) journal.set(name, marks);
  else journal.delete(name);
  writeFileSync(file, JSON.stringify(Object.fromEntries(journal), null, 1));
}

mkdirSync(out, { recursive: true });
console.log(`jeu filmé : ${RACINE}`);
const session = await open(lang);
const journalFile = join(out, 'journal.json');
const failed = [];
try {
  for (const [name, play] of SCENES) {
    if (wanted.length && !wanted.includes(name)) continue;
    const marks = await shoot(session, name, play);
    if (!marks) failed.push(name);
    recordScene(journalFile, name, marks);
  }
} finally {
  await session.close();
}
if (session.problems.length) console.log('erreurs de page :', session.problems.slice(0, 3));
if (failed.length) {
  console.log(`sans bonne prise après trois essais : ${failed.join(', ')}`);
  process.exitCode = 1;
}

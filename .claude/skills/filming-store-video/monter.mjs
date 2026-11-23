// Montage de la vidéo de la fiche Play Store : un extrait par scène, coupé autour des moments
// marqués au tournage, mis bout à bout, puis le carton de fin.
//   node .claude/skills/filming-store-video/monter.mjs <fr|en|es>
// Lit analysis/video-fiche/prises/<langue>/, écrit analysis/video-fiche/sorties/
// (PRISES=<dossier> et SORTIES=<dossier> pour d'autres endroits).
// Google ne lit toute seule que les 30 premières secondes, sans le son : l'accueil et les jeux
// d'Arcade passent donc d'abord, le carton en dernier.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';
import { APP_REPO, OUTPUTS, REPO, TAKES } from './base.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const [lang = 'fr'] = process.argv.slice(2);
const takes = join(TAKES, lang);

const first = (marks, name) => marks.find(m => m.name === name);
const last = (marks, name) => marks.findLast(m => m.name === name);
const firstSum = (marks, name) =>
  marks.find(m => m.name === name && m.kind === 'calcul') ?? first(marks, name);

/** Extrait autour d'une marque : `before` secondes avant, `after` secondes après. */
function around(name, before, after, pick = first) {
  return marks => {
    const mark = pick(marks, name);
    return mark ? { start: mark.t - before, end: mark.t + after } : null;
  };
}

/** Jeu d'Arcade : l'extrait qui montre le plus de bonnes réponses, sans faute ni ami. */
function bestWin(before, after) {
  return marks => {
    const within = (m, win) => m.t > win.t - before && m.t < win.t + after;
    const spoiled = win => marks.some(m => ['perd', 'ami'].includes(m.name) && within(m, win));
    const wins = marks.filter(m => m.name === 'gagne' && m.t - before >= 0.15 && !spoiled(m));
    const count = win => marks.filter(m => m.name === 'gagne' && within(m, win)).length;
    const best = wins.toSorted((a, b) => count(b) - count(a))[0];
    return best ? { start: best.t - before, end: best.t + after } : null;
  };
}

/** MultiMemory : les deux cartes retournées d'une paire trouvée, puis le bravo. */
function pairFound(marks) {
  const pair = marks.find(m => m.name === 'paire' && m.voulue) ?? first(marks, 'paire');
  if (!pair) return null;
  const flips = marks.filter(m => m.name === 'carte' && m.t < pair.t).slice(-2);
  return { start: flips[0].t - 0.65, end: pair.t + 0.75 };
}

// L'ordre et les durées se règlent ici : la scène, puis les secondes avant et après son moment
const PLAN = [
  ['accueil', around('quiz', 2.4, 0.2)],
  ['quiz', around('bonne', 1.6, 0.8, firstSum)],
  ['decouverte', around('calcul', 1.1, 1.7)],
  ['arcade-menu', around('ouvre', 1.4, 1.0)],
  ['multipop', bestWin(1.9, 0.6)],
  ['multigoal', bestWin(1.9, 0.6)],
  ['invasion', bestWin(1.9, 0.6)],
  ['multimiam', bestWin(2.0, 0.5)],
  ['multisnake', bestWin(1.9, 0.6)],
  ['multimemory', pairFound],
  ['defi', around('reponse', 1.3, 0.8)],
  ['chrono', around('valide', 1.5, 0.7)],
  ['aventure', around('niveau', 1.6, 0.9)],
  ['quiz', around('erreur', 1.2, 2.0, last)],
];
const CARD_SECONDS = 2.5;

function run(command, args) {
  return execFileSync(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
}

/** L'image du carton : l'en-tête de la fiche dans le dépôt de l'appli, sinon la carte du site */
function cardArt() {
  const header = join(APP_REPO, 'store/entete-source-3840x2160.png');
  return existsSync(header) ? header : join(REPO, 'assets/social/leapmultix-social-card.webp');
}

/** Photographie le carton de fin dans la langue (carton.html). */
async function shootCard(file) {
  const address = new URL(pathToFileURL(join(HERE, 'carton.html')));
  address.searchParams.set('lang', lang);
  address.searchParams.set('image', pathToFileURL(cardArt()).href);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    await page.goto(address.href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const ready = await page.evaluate(
      () =>
        document.getElementById('art').naturalWidth > 0 && document.fonts.check('700 62px Baloo2')
    );
    if (!ready) throw new Error("carton : l'image ou la police n'est pas arrivée");
    await page.screenshot({ path: file });
  } finally {
    await browser.close();
  }
}

/** Les extraits du plan, bornés à leur prise : scène, début et durée en secondes. */
function cutsOf(journal) {
  return PLAN.map(([scene, pick]) => {
    const marks = journal.get(scene);
    const cut = marks && pick(marks);
    if (!cut) throw new Error(`pas d'extrait pour ${scene} : refilmer la scène`);
    const start = Math.max(cut.start, 0.1);
    const end = Math.min(cut.end, marks.at(-1).t - 0.05);
    return { scene, start, seconds: Math.round((end - start) * 100) / 100 };
  });
}

/** Met bout à bout les extraits et le carton : un seul encodage, 1920 × 1080 à 30 images/s. */
function assemble(cuts, card, output) {
  const inputs = cuts.flatMap(cut => [
    '-ss',
    cut.start.toFixed(3),
    '-t',
    cut.seconds.toFixed(3),
    '-i',
    join(takes, `${cut.scene}.webm`),
  ]);
  inputs.push('-loop', '1', '-framerate', '30', '-t', String(CARD_SECONDS), '-i', card);
  const shape = 'fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p';
  const chains = cuts.map((_, i) => `[${i}:v]${shape}[v${i}]`);
  chains.push(`[${cuts.length}:v]${shape},fade=t=in:st=0:d=0.3[v${cuts.length}]`);
  const labels = chains.map((_, i) => `[v${i}]`).join('');
  const graph = `${chains.join(';')};${labels}concat=n=${chains.length}:v=1:a=0[out]`;
  run('ffmpeg', [
    '-loglevel',
    'error',
    '-y',
    ...inputs,
    '-filter_complex',
    graph,
    '-map',
    '[out]',
    ...['-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', '30'],
    ...['-movflags', '+faststart', output],
  ]);
}

/** Les planches de contrôle : deux images par seconde, 32 par planche (lisible d'un regard). */
function contactSheets(output, seconds) {
  const sheets = Math.ceil((seconds * 2) / 32);
  return Array.from({ length: sheets }, (_, i) => {
    const sheet = join(OUTPUTS, `planche-${lang}-${i + 1}.jpg`);
    const frames = `select='between(n,${i * 32},${i * 32 + 31})'`;
    const filter = `fps=2,${frames},scale=480:-1,tile=8x4`;
    run(
      'ffmpeg',
      ['-loglevel', 'error', '-y', '-i', output, '-vf', filter].concat([
        '-frames:v',
        '1',
        '-q:v',
        '3',
        sheet,
      ])
    );
    return sheet;
  });
}

mkdirSync(OUTPUTS, { recursive: true });
const journal = new Map(
  Object.entries(JSON.parse(readFileSync(join(takes, 'journal.json'), 'utf8')))
);
const cuts = cutsOf(journal);
let at = 0;
for (const cut of cuts) {
  const from = `de ${cut.start.toFixed(2)} s`.padEnd(13);
  console.log(cut.scene.padEnd(12), from, `${cut.seconds.toFixed(2)} s`, `à ${at.toFixed(1)} s`);
  at += cut.seconds;
}
console.log(
  'carton'.padEnd(12),
  ''.padEnd(13),
  `${CARD_SECONDS.toFixed(2)} s`,
  `à ${at.toFixed(1)} s`
);
const card = join(OUTPUTS, `carton-${lang}.png`);
await shootCard(card);
const output = join(OUTPUTS, `leapmultix-${lang}.mp4`);
assemble(cuts, card, output);
const probe = run(
  'ffprobe',
  ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0'].concat(output)
);
console.log(
  `durée prévue ${(at + CARD_SECONDS).toFixed(1)} s, mesurée ${Number(probe).toFixed(1)} s`
);
console.log(output);
for (const sheet of contactSheets(output, at + CARD_SECONDS)) console.log(sheet);

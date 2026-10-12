// Traitement d'un clip brut de la synthèse, avec ffmpeg : silences de début et de fin
// coupés, sonie alignée (−20 LUFS, pic ≤ −1 dBFS), MP3 mono à débit constant, sans
// métadonnées. Le résultat ne dépend que du fichier brut et des réglages : relancer le
// traitement redonne le même clip.
//
// La synthèse laisse parfois, après la phrase, plusieurs secondes de silence puis un clic :
// le clic arrêtait la coupe du silence de fin. Un bruit bref isolé par un long silence, au
// début ou à la fin, est donc coupé avec ce silence (usefulRange).

import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { childEnv } from './child-env.mjs';

const execFileAsync = promisify(execFile);
// detached : un Ctrl+C (envoyé au groupe de processus) ne tue pas un traitement en cours ;
// il se termine, puis la génération s'arrête proprement. Environnement réduit : ffmpeg et
// ffprobe n'ont pas à voir les clés des fournisseurs
const run = (command, args) =>
  execFileAsync(command, args, { detached: true, maxBuffer: 16 * 1024 * 1024, env: childEnv() });

/** Format d'un brut du fournisseur, d'après son extension (rawFile : .mp3 ou .wav) */
const RAW_FORMATS = new Map([
  ['.mp3', 'mp3'],
  ['.wav', 'wav'],
]);

/**
 * Arguments d'entrée de ffmpeg et ffprobe : fichiers locaux seulement, et le format imposé quand
 * il est donné. Le brut reçu du fournisseur l'impose toujours : laissé à deviner, son contenu
 * pourrait être lu comme une liste de lecture HLS, qui ouvre d'autres fichiers ou des adresses
 * @param {string} file
 * @param {string} [format] - Démultiplexeur de ffmpeg (« mp3 », « wav »)
 * @returns {string[]}
 */
export function inputArgs(file, format) {
  return ['-protocol_whitelist', 'file', ...(format ? ['-f', format] : []), '-i', file];
}

/** Format imposé au brut d'un fournisseur ; une autre extension est refusée */
export function rawFormat(rawPath) {
  const format = RAW_FORMATS.get(path.extname(rawPath).toLowerCase());
  if (!format) throw new Error(`Brut au format inconnu : ${path.basename(rawPath)} (.mp3 ou .wav)`);
  return format;
}

/** Sonie en dessous de laquelle un clip est muet (plancher d'ebur128 : −70 LUFS) */
const SILENT_LUFS = -69.9;

/** Un bruit plus court que ceci, séparé de la phrase par un long silence, est un clic */
export const BLIP_SECONDS = 0.3;
/** Silence à partir duquel un bruit isolé est coupé, et au-delà duquel un clip se réécoute */
export const LONG_SILENCE_SECONDS = 0.8;

/** Une erreur sur le contenu du clip (et non sur l'outil) : le brut ne vaut rien */
export class ClipContentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClipContentError';
  }
}

/** Bornes d'un clip valide : ni vide, ni interminable */
export const CLIP_LIMITS = { minSeconds: 0.25, maxSeconds: 30 };

/**
 * Silences d'au moins minSeconds, repérés par silencedetect
 * @returns {Promise<{duration: number, silences: Array<{start: number, end: number}>}>}
 */
export async function detectSilences(
  file,
  { noiseDb = -50, minSeconds = LONG_SILENCE_SECONDS } = {}
) {
  const { stderr } = await run('ffmpeg', [
    '-hide_banner',
    '-nostats',
    ...inputArgs(file),
    '-af',
    `silencedetect=noise=${noiseDb}dB:d=${minSeconds}`,
    '-f',
    'null',
    '-',
  ]);
  const clock = /Duration: (\d+):(\d+):([\d.]+)/.exec(stderr);
  const duration = clock
    ? Number(clock[1]) * 3600 + Number(clock[2]) * 60 + Number(clock[3])
    : Number.NaN;
  const starts = [...stderr.matchAll(/silence_start: (-?[\d.]+)/g)].map(m => Number(m[1]));
  const ends = [...stderr.matchAll(/silence_end: ([\d.]+)/g)].map(m => Number(m[1]));
  const silences = starts.map((start, i) => ({
    start: Math.max(0, start),
    end: ends[i] ?? duration,
  }));
  return { duration, silences };
}

/**
 * Partie utile d'un clip : un bruit bref (clic) isolé par un long silence, au début ou à
 * la fin, part avec ce silence ; un peu de silence est gardé autour de la phrase.
 * @param {{duration: number, silences: Array<{start: number, end: number}>}} analysis
 * @returns {{start: number, end: number}}
 */
export function usefulRange(
  { duration, silences },
  { blipSeconds = BLIP_SECONDS, keepSeconds = 0.05 } = {}
) {
  let start = 0;
  let end = duration;
  const first = silences[0];
  const last = silences.at(-1);
  if (first && first.start < blipSeconds && first.end < duration) {
    start = Math.max(0, first.end - keepSeconds);
  }
  if (last && duration - last.end < blipSeconds && last.start > start) {
    end = Math.min(duration, last.start + keepSeconds);
  }
  return { start, end };
}

/**
 * Coupe des silences de début et de fin. Un peu de silence reste avant la phrase
 * (leadSeconds) : le début du premier mot (« vingt », « huit ») s'entendait mal sans lui.
 */
function trimFilter({ silenceDb, leadSeconds = 0.05, trailSeconds = 0.05 }) {
  const silence = keep =>
    `silenceremove=start_periods=1:start_threshold=${silenceDb}dB:start_silence=${keep}`;
  return `${silence(leadSeconds)},areverse,${silence(trailSeconds)},areverse`;
}

async function measureLoudness(wavPath) {
  // ebur128 écrit son rapport sur la sortie d'erreur, que execFile rend dans stderr
  const { stderr } = await run('ffmpeg', [
    '-hide_banner',
    '-nostats',
    ...inputArgs(wavPath),
    '-af',
    'ebur128=peak=true',
    '-f',
    'null',
    '-',
  ]);
  const integrated = Number([...stderr.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop()?.[1]);
  const peak = Number([...stderr.matchAll(/Peak:\s+(-?[\d.]+) dBFS/g)].pop()?.[1]);
  return { integrated, peak };
}

/** Coupe, dans le WAV intermédiaire, un clic isolé par un long silence (usefulRange) */
async function cutIsolatedBlips(wavPath) {
  const analysis = await detectSilences(wavPath);
  if (!Number.isFinite(analysis.duration)) return;
  const { start, end } = usefulRange(analysis);
  if (start <= 0 && end >= analysis.duration) return;
  const cutPath = `${wavPath}.cut.part`;
  try {
    await run('ffmpeg', [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      ...inputArgs(wavPath),
      '-af',
      `atrim=start=${start.toFixed(3)}:end=${end.toFixed(3)},asetpts=PTS-STARTPTS`,
      '-f',
      'wav',
      cutPath,
    ]);
    await fs.rename(cutPath, wavPath);
  } finally {
    await fs.rm(cutPath, { force: true });
  }
}

/** Décode le brut en WAV mono intermédiaire, silences de début et de fin coupés */
async function decodeTrimmed(rawPath, wavPath, encoding) {
  await run('ffmpeg', [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    ...inputArgs(rawPath, rawFormat(rawPath)),
    '-af',
    trimFilter(encoding),
    '-ac',
    '1',
    '-f',
    'wav',
    wavPath,
  ]);
}

/**
 * Gain qui amène le clip à la sonie visée sans dépasser le pic permis
 * @throws {ClipContentError} si la sonie est illisible ou le clip muet
 */
async function loudnessGain(wavPath, encoding) {
  const { integrated, peak } = await measureLoudness(wavPath);
  if (!Number.isFinite(integrated) || !Number.isFinite(peak)) {
    throw new ClipContentError('sonie illisible');
  }
  // ebur128 plafonne le silence à −70 LUFS (et annonce alors un pic de 0 dBFS)
  if (integrated <= SILENT_LUFS) throw new ClipContentError('clip muet');
  return Math.min(encoding.loudnessLufs - integrated, encoding.truePeakDb - peak);
}

/** Encode le WAV en MP3 mono à débit constant, gain appliqué, sans métadonnées */
async function encodeMp3(wavPath, outPath, gain, bitrateKbps) {
  await run('ffmpeg', [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    ...inputArgs(wavPath),
    '-af',
    `volume=${gain.toFixed(2)}dB`,
    '-map_metadata',
    '-1',
    '-ac',
    '1',
    '-c:a',
    'libmp3lame',
    '-b:a',
    `${bitrateKbps}k`,
    '-id3v2_version',
    '0',
    '-f',
    'mp3',
    outPath,
  ]);
}

/**
 * Traite un clip brut vers outPath (écrit tel quel : à l'appelant de passer un nom
 * temporaire, puis de renommer).
 * @param {string} rawPath
 * @param {string} outPath
 * @param {{bitrateKbps: number, loudnessLufs: number, truePeakDb: number, silenceDb: number}} encoding
 */
export async function processClip(rawPath, outPath, encoding) {
  const wavPath = `${outPath}.wav.part`;
  try {
    await decodeTrimmed(rawPath, wavPath, encoding);
    await cutIsolatedBlips(wavPath);
    const gain = await loudnessGain(wavPath, encoding);
    await encodeMp3(wavPath, outPath, gain, encoding.bitrateKbps);
  } finally {
    await fs.rm(wavPath, { force: true });
  }
}

/**
 * Caractéristiques d'un fichier audio, lues par ffprobe
 * @param {string} filePath
 * @returns {Promise<{duration: number, codec: string, channels: number, bitRate: number}>}
 */
export async function probeClip(filePath) {
  let stdout;
  try {
    ({ stdout } = await run('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration,bit_rate:stream=codec_name,channels',
      '-of',
      'json',
      ...inputArgs(filePath).filter(arg => arg !== '-i'),
    ]));
  } catch (error) {
    // ffprobe absent : panne d'outil ; fichier que ffprobe ne lit pas : mauvais contenu
    if (error.code === 'ENOENT') throw error;
    throw new ClipContentError('illisible par ffprobe');
  }
  const data = JSON.parse(stdout);
  const stream = data.streams?.[0] ?? {};
  return {
    duration: Number(data.format?.duration),
    codec: stream.codec_name ?? '',
    channels: Number(stream.channels),
    bitRate: Number(data.format?.bit_rate),
  };
}

/**
 * Vérifie, avant tout appel payant, que ffmpeg (avec l'encodeur MP3) et ffprobe répondent
 * @throws {Error} si un outil manque
 */
export async function checkAudioTools() {
  let encoders;
  try {
    ({ stdout: encoders } = await run('ffmpeg', ['-hide_banner', '-encoders']));
    await run('ffprobe', ['-version']);
  } catch (error) {
    throw new Error(`ffmpeg et ffprobe sont requis (${error.code ?? error.message})`);
  }
  if (!/libmp3lame/.test(encoders)) throw new Error("ffmpeg n'a pas l'encodeur MP3 libmp3lame");
}

/**
 * Raison pour laquelle un clip traité n'est pas valide, ou null s'il l'est
 * @param {{duration: number, codec: string, channels: number}} info
 * @returns {string|null}
 */
export function clipProblem(info) {
  if (info.codec !== 'mp3') return `codec ${info.codec || 'inconnu'}`;
  if (info.channels !== 1) return `${info.channels} canaux`;
  if (info.duration > CLIP_LIMITS.maxSeconds) return `trop long (${info.duration} s)`;
  // Toute durée qui n'atteint pas le minimum est trop courte, une durée illisible (NaN) comprise
  if (info.duration >= CLIP_LIMITS.minSeconds) return null;
  return `trop court (${info.duration} s)`;
}

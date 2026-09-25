// Traitement d'un clip brut de la synthèse, avec ffmpeg : silences de début et de fin
// coupés, sonie alignée (−20 LUFS, pic ≤ −1 dBFS), MP3 mono à débit constant, sans
// métadonnées. Le résultat ne dépend que du fichier brut et des réglages : relancer le
// traitement redonne le même clip.

import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import { promisify } from 'node:util';

const run = promisify(execFile);

/** Sonie en dessous de laquelle un clip est muet (plancher d'ebur128 : −70 LUFS) */
const SILENT_LUFS = -69.9;

/** Bornes d'un clip valide : ni vide, ni interminable */
export const CLIP_LIMITS = { minSeconds: 0.25, maxSeconds: 30 };

function trimFilter(silenceDb) {
  const silence = `silenceremove=start_periods=1:start_threshold=${silenceDb}dB:start_silence=0.05`;
  return `${silence},areverse,${silence},areverse`;
}

async function measureLoudness(wavPath) {
  // ebur128 écrit son rapport sur la sortie d'erreur, que execFile rend dans stderr
  const { stderr } = await run('ffmpeg', [
    '-hide_banner',
    '-nostats',
    '-i',
    wavPath,
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
    await run('ffmpeg', [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-i',
      rawPath,
      '-af',
      trimFilter(encoding.silenceDb),
      '-ac',
      '1',
      '-f',
      'wav',
      wavPath,
    ]);
    const { integrated, peak } = await measureLoudness(wavPath);
    if (!Number.isFinite(integrated) || !Number.isFinite(peak)) {
      throw new Error('sonie illisible');
    }
    // ebur128 plafonne le silence à −70 LUFS (et annonce alors un pic de 0 dBFS)
    if (integrated <= SILENT_LUFS) throw new Error('clip muet');
    const gain = Math.min(encoding.loudnessLufs - integrated, encoding.truePeakDb - peak);
    await run('ffmpeg', [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-i',
      wavPath,
      '-af',
      `volume=${gain.toFixed(2)}dB`,
      '-map_metadata',
      '-1',
      '-ac',
      '1',
      '-c:a',
      'libmp3lame',
      '-b:a',
      `${encoding.bitrateKbps}k`,
      '-id3v2_version',
      '0',
      '-f',
      'mp3',
      outPath,
    ]);
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
  const { stdout } = await run('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration,bit_rate:stream=codec_name,channels',
    '-of',
    'json',
    filePath,
  ]);
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
 * Raison pour laquelle un clip traité n'est pas valide, ou null s'il l'est
 * @param {{duration: number, codec: string, channels: number}} info
 * @returns {string|null}
 */
export function clipProblem(info) {
  if (info.codec !== 'mp3') return `codec ${info.codec || 'inconnu'}`;
  if (info.channels !== 1) return `${info.channels} canaux`;
  if (!(info.duration >= CLIP_LIMITS.minSeconds)) return `trop court (${info.duration} s)`;
  if (info.duration > CLIP_LIMITS.maxSeconds) return `trop long (${info.duration} s)`;
  return null;
}

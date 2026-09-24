/*
 Entrées partagées des scripts d'assets (assets-diff.cjs, cleanup-assets.cjs).

 Un chemin reçu en ligne de commande, qu'il vienne d'un humain ou d'un agent,
 ne doit jamais faire lire ni supprimer un fichier hors du projet. La preuve
 runtime, elle, doit être lisible : un fichier absent ou invalide arrête le
 script au lieu d'être pris pour « aucun asset utilisé ».
*/
const fs = require('node:fs');
const path = require('node:path');

/** Chemin de projet normalisé : séparateurs « / », sans « / » initial. */
function normalize(p) {
  return String(p).replaceAll('\\', '/').replace(/^\//, '');
}

/**
 * Chemin absolu de `candidate`, résolu depuis `baseDir`, s'il reste dans `baseDir`.
 * @param {string} baseDir
 * @param {string} candidate
 * @returns {string}
 * @throws {Error} si le chemin sort de `baseDir`
 */
function resolveInside(baseDir, candidate) {
  const base = path.resolve(baseDir);
  const resolved = path.resolve(base, candidate);
  if (!resolved.startsWith(base + path.sep)) {
    throw new Error(`Chemin refusé : il sort du dossier ${path.basename(base)}/.`);
  }
  return resolved;
}

/**
 * Lit la preuve runtime : un tableau JSON des chemins d'assets chargés en jeu.
 * @param {string} file
 * @returns {string[]} Chemins normalisés
 * @throws {Error} si le fichier manque, est illisible ou n'est pas un tableau
 */
function readRuntimeProof(file) {
  if (!fs.existsSync(file)) {
    throw new Error('Preuve runtime introuvable.');
  }
  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    throw new Error('Preuve runtime illisible : JSON invalide.');
  }
  if (!Array.isArray(entries)) {
    throw new TypeError('Preuve runtime invalide : un tableau de chemins est attendu.');
  }
  return entries.map(normalize);
}

module.exports = { normalize, resolveInside, readRuntimeProof };

// Environnement des programmes que lancent les scripts de la voix (Whisper, ffmpeg,
// ffprobe) : ce qu'il leur faut pour tourner, sur le GPU compris, jamais les clés des
// fournisseurs que charge node --env-file (ELEVENLABS_API_KEY, GOOGLE_TTS_API_KEY…) ni les
// identifiants du poste (AWS_…, GITHUB_TOKEN…). Défense en profondeur : ces programmes
// tournent sous le même utilisateur.

/** Variables gardées telles quelles */
const KEPT = new Set([
  'PATH',
  'HOME',
  'USER',
  'LOGNAME',
  'SHELL',
  'LANG',
  'LANGUAGE',
  'TZ',
  'TERM',
  'TMPDIR',
  'TMP',
  'TEMP',
  'NO_COLOR',
  'FORCE_COLOR',
  'XDG_CACHE_HOME',
  // Bibliothèques CUDA hors des chemins du système : sans elles, Whisper passe sur le CPU
  'LD_LIBRARY_PATH',
  // Windows : sans elles, un programme ne démarre pas
  'SYSTEMROOT',
  'WINDIR',
  'COMSPEC',
  'PATHEXT',
]);

/**
 * Familles gardées : langue (LC_), GPU (CUDA_, NVIDIA_), cache des modèles (HF_,
 * HUGGINGFACE_), CTranslate2 (CT2_), fils de calcul (OMP_, MKL_)
 */
const KEPT_PREFIXES = ['LC_', 'CUDA_', 'NVIDIA_', 'HF_', 'HUGGINGFACE_', 'CT2_', 'OMP_', 'MKL_'];

/** Un nom de secret ne passe jamais, même dans une famille gardée (HF_TOKEN) */
const SECRET_NAME = /TOKEN|KEY|SECRET|PASSWORD|CREDENTIAL/i;

/**
 * Environnement réduit pour un programme lancé par les scripts de la voix
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {NodeJS.ProcessEnv}
 */
export function childEnv(env = process.env) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([name]) =>
        !SECRET_NAME.test(name) &&
        (KEPT.has(name) || KEPT_PREFIXES.some(prefix => name.startsWith(prefix)))
    )
  );
}

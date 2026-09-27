// Fournisseur Google Cloud Text-to-Speech (voix Chirp 3 HD) : synthèse d'une phrase et accès à
// la voix. La clé ne sort jamais d'ici : elle ne part que dans l'en-tête x-goog-api-key, aucun
// message d'erreur ni journal ne la contient.
//
// Il faut une clé API classique (« AIza… ») restreinte à Cloud Text-to-Speech : ce service
// refuse les clés liées à un compte de service (« AQ.… »), que crée AI Studio.
//
// L'API ne dit ni le solde ni le coût d'un appel : credits() rend null, et la dépense se
// plafonne en caractères (--max-chars, --max-total-chars de generate.mjs). Chirp 3 HD, au
// 26/09/2026 : le premier million de caractères de chaque mois est offert, puis 30 $ le million.
//
// Le brut se demande en LINEAR16, un WAV sans perte (24 kHz, 16 bits, mono) : le MP3 de Cloud
// TTS n'est qu'à 32 kb/s.
//
// Réponses d'erreur relevées le 26/09/2026, toutes au format { error: { code, message, status,
// details: [{ reason }] } } :
// - voix inconnue : 400 INVALID_ARGUMENT, « Voice '…' does not exist. Is it misspelled? » ;
// - clé invalide : 400 INVALID_ARGUMENT, reason API_KEY_INVALID ;
// - clé restreinte à une autre API : 403 PERMISSION_DENIED, reason API_KEY_SERVICE_BLOCKED ;
// - clé liée à un compte de service : 401 UNAUTHENTICATED, reason CREDENTIALS_MISSING.

import { ProviderError, assertApiKey, httpCaller, looksLikeMp3, looksLikeWav } from './common.mjs';

export const DEFAULT_BASE_URL = 'https://texttospeech.googleapis.com';

/** Format du brut (sourceFormat de voices.json) → encodage demandé, et contrôle de la réponse */
const FORMATS = {
  wav: { audioEncoding: 'LINEAR16', looksRight: looksLikeWav },
  mp3: { audioEncoding: 'MP3', looksRight: looksLikeMp3 },
};

/** Raisons d'erreur Google qui disent une clé refusée : inutile d'insister, on arrête tout */
const AUTH_REASONS = new Set([
  'API_KEY_INVALID',
  'API_KEY_SERVICE_BLOCKED',
  'API_KEY_HTTP_REFERRER_BLOCKED',
  'API_KEY_IP_ADDRESS_BLOCKED',
  'CREDENTIALS_MISSING',
  'SERVICE_DISABLED',
]);

/**
 * Classement d'une erreur HTTP : le premier cas qui s'applique l'emporte, « request » si aucun
 * (la phrase échoue seule, la génération continue). Les raisons de clé passent avant le statut :
 * une clé invalide répond 400, comme un texte refusé.
 */
const ERROR_KINDS = [
  { kind: 'auth', applies: (code, detail) => code === 401 || AUTH_REASONS.has(detail.reason) },
  {
    kind: 'quota',
    applies: (_code, detail) =>
      detail.reason === 'BILLING_DISABLED' || /billing/i.test(detail.message),
  },
  {
    kind: 'voice',
    applies: (code, detail) =>
      code === 400 && /\bvoice\b.*\b(does not exist|misspelled)/i.test(detail.message),
  },
  { kind: 'rate', applies: code => code === 429, transient: true },
  { kind: 'auth', applies: code => code === 403 },
  { kind: 'server', applies: code => code >= 500, transient: true },
];

function classifyError(code, detail) {
  return ERROR_KINDS.find(rule => rule.applies(code, detail)) ?? { kind: 'request' };
}

/** Détail d'un corps d'erreur Google : message, statut et première raison ; vide sinon */
export function googleErrorDetail(body) {
  const error = body && typeof body === 'object' ? body.error : null;
  if (!error || typeof error !== 'object') return { message: '' };
  const reason = (Array.isArray(error.details) ? error.details : [])
    .map(item => item?.reason)
    .find(value => typeof value === 'string');
  return {
    message: String(error.message ?? ''),
    status: typeof error.status === 'string' ? error.status : undefined,
    reason,
  };
}

async function errorFrom(res) {
  const detail = googleErrorDetail(await res.json().catch(() => null));
  const { kind, transient } = classifyError(res.status, detail);
  const parts = [`Google TTS ${res.status}`, detail.status, detail.reason].filter(Boolean);
  const text = detail.message.slice(0, 200);
  const retryAfterMs = Number(res.headers.get('retry-after')) * 1000 || undefined;
  return new ProviderError(
    kind,
    text ? `${parts.join(' ')} : ${text}` : parts.join(' '),
    transient ? { retryAfterMs } : {}
  );
}

/** Format du brut de la voix, ou une erreur de réglage qui arrête tout */
function formatOf(voice) {
  if (!Object.hasOwn(FORMATS, voice.sourceFormat)) {
    throw new ProviderError(
      'voice',
      `Google TTS : format source « ${voice.sourceFormat} » inconnu (wav ou mp3)`
    );
  }
  return FORMATS[voice.sourceFormat];
}

/**
 * @param {{apiKey: string, baseUrl?: string, fetchImpl?: typeof fetch}} options
 */
export function createGoogle({ apiKey, baseUrl = DEFAULT_BASE_URL, fetchImpl = fetch }) {
  assertApiKey(apiKey, 'GOOGLE_TTS_API_KEY');
  const call = httpCaller({
    label: 'Google TTS',
    apiKey,
    authHeaders: { 'x-goog-api-key': apiKey },
    baseUrl,
    fetchImpl,
    errorFrom,
  });

  /**
   * Voix d'une langue (appel gratuit), triées par nom
   * @param {string} languageCode - fr-FR, en-GB…
   * @returns {Promise<Array<{name: string, gender: string}>>}
   */
  async function listVoices(languageCode) {
    const res = await call(`/v1/voices?languageCode=${encodeURIComponent(languageCode)}`);
    const body = await res.json().catch(() => null);
    return (body?.voices ?? [])
      .filter(item => typeof item?.name === 'string')
      .map(item => ({ name: item.name, gender: String(item.ssmlGender ?? '') }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    name: 'google',

    /** Aucun solde lisible par l'API : la dépense se plafonne en caractères */
    async credits() {
      return null;
    },

    listVoices,

    /** Échoue si la voix n'existe pas pour sa langue, ou si son format est inconnu */
    async checkVoice(voice) {
      formatOf(voice);
      const names = (await listVoices(voice.languageCode)).map(item => item.name);
      if (!names.includes(voice.voiceId)) {
        throw new ProviderError(
          'voice',
          `Google TTS : voix ${voice.voiceId} introuvable pour ${voice.languageCode}`
        );
      }
    },

    /**
     * @param {{text: string, voice: Object, signal?: AbortSignal}} request
     * @returns {Promise<{audio: Buffer, requestId: null, cost: null}>} ni identifiant de
     *   requête ni coût : l'API ne les donne pas
     */
    async synthesize({ text, voice, signal }) {
      const format = formatOf(voice);
      const res = await call('/v1/text:synthesize', {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: voice.languageCode, name: voice.voiceId },
          audioConfig: { audioEncoding: format.audioEncoding },
        }),
      });
      const body = await res.json().catch(() => null);
      const data = body?.audioContent;
      const audio = typeof data === 'string' ? Buffer.from(data, 'base64') : Buffer.alloc(0);
      if (!format.looksRight(audio)) {
        // Réponse facturée mais inutilisable : réessayer referait payer, on arrête tout
        throw new ProviderError(
          'response',
          `Google TTS : réponse sans ${voice.sourceFormat.toUpperCase()} exploitable (${audio.length} octets)`
        );
      }
      return { audio, requestId: null, cost: null };
    },
  };
}

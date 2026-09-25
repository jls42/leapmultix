// Fournisseur Mistral (Voxtral TTS) : synthèse d'une phrase et accès à la voix. La clé ne
// sort jamais d'ici : elle ne part que dans l'en-tête Authorization, aucun message d'erreur
// ni journal ne la contient.
//
// L'API ne dit ni le solde ni le coût d'un appel : credits() rend null, et la dépense se
// plafonne en caractères (--max-chars, --max-total-chars de generate.mjs ; 16 $ le million
// de caractères au 26/09/2026).
//
// Réponses d'erreur relevées le 26/09/2026 :
// - clé refusée : 401 { detail: "Invalid API Key" } ;
// - voix inconnue : 404 { detail: "Voice not found" }, ou { message, type: "invalid_voice" } ;
// - modèle inconnu : 400 { message, type: "invalid_model" } ;
// - champ manquant : 422 { detail: [{ msg }] } ;
// - texte refusé par la modération : 403 (documentation du TTS).

import {
  ProviderError,
  assertApiKey,
  httpCaller,
  looksLikeMp3,
  readErrorDetail,
} from './common.mjs';

export const DEFAULT_BASE_URL = 'https://api.mistral.ai';

/** Mots d'un message qui disent un solde ou un quota épuisé, quel que soit le statut */
const QUOTA_WORDS = /quota|balance|credit|billing|funds|payment|insufficient/i;

/**
 * Classement d'une erreur HTTP : le premier cas qui s'applique l'emporte, « request » si
 * aucun. Le 403 est la modération : il ne touche que sa phrase, la génération continue.
 */
const ERROR_KINDS = [
  { kind: 'auth', applies: code => code === 401 },
  { kind: 'quota', applies: (code, detail) => code === 402 || QUOTA_WORDS.test(detail.message) },
  { kind: 'request', applies: code => code === 403, note: 'texte refusé par la modération' },
  { kind: 'rate', applies: code => code === 429, transient: true },
  {
    kind: 'voice',
    applies: (code, detail) =>
      code === 404 || detail.type === 'invalid_voice' || detail.type === 'invalid_model',
  },
  { kind: 'server', applies: code => code >= 500, transient: true },
];

function classifyError(code, detail) {
  return ERROR_KINDS.find(rule => rule.applies(code, detail)) ?? { kind: 'request' };
}

/** « Mistral <code> <type> : <texte> (<note>) », sans les morceaux vides */
function errorMessage(code, detail, note) {
  const text = String(detail.message ?? '').slice(0, 200);
  const parts = [`Mistral ${code}`, detail.type];
  if (text) parts.push(`: ${text}`);
  if (note) parts.push(`(${note})`);
  return parts.filter(Boolean).join(' ');
}

async function errorFrom(res) {
  const detail = await readErrorDetail(res);
  const { kind, transient, note } = classifyError(res.status, detail);
  const retryAfterMs = Number(res.headers.get('retry-after')) * 1000 || undefined;
  return new ProviderError(
    kind,
    errorMessage(res.status, detail, note),
    transient ? { retryAfterMs } : {}
  );
}

/** Audio d'une réponse de synthèse : { audio_data } en base64, vide s'il manque */
async function audioOf(res) {
  const body = await res.json().catch(() => null);
  const data = body?.audio_data;
  return typeof data === 'string' ? Buffer.from(data, 'base64') : Buffer.alloc(0);
}

/**
 * @param {{apiKey: string, baseUrl?: string, fetchImpl?: typeof fetch}} options
 */
export function createMistral({ apiKey, baseUrl = DEFAULT_BASE_URL, fetchImpl = fetch }) {
  assertApiKey(apiKey, 'MISTRAL_API_KEY');
  const call = httpCaller({
    label: 'Mistral',
    apiKey,
    authHeaders: { Authorization: `Bearer ${apiKey}` },
    baseUrl,
    fetchImpl,
    errorFrom,
  });

  return {
    name: 'mistral',

    /** Aucun solde lisible par l'API : la dépense se plafonne en caractères */
    async credits() {
      return null;
    },

    /** Échoue si la voix n'existe pas ou n'est pas accessible avec cette clé */
    async checkVoice(voice) {
      await call(`/v1/audio/voices/${encodeURIComponent(voice.voiceId)}`);
    },

    /**
     * @param {{text: string, voice: Object, signal?: AbortSignal}} request
     * @returns {Promise<{audio: Buffer, requestId: string|null, cost: null}>} cost : null,
     *   l'API ne le dit pas
     */
    async synthesize({ text, voice, signal }) {
      const res = await call('/v1/audio/speech', {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: voice.model,
          input: text,
          voice_id: voice.voiceId,
          response_format: voice.sourceFormat,
        }),
      });
      const audio = await audioOf(res);
      if (!looksLikeMp3(audio)) {
        // Réponse payée mais inutilisable : réessayer repaierait, on arrête tout
        throw new ProviderError(
          'response',
          `Mistral : réponse sans MP3 exploitable (${audio.length} octets)`
        );
      }
      return {
        audio,
        requestId:
          res.headers.get('mistral-correlation-id') ?? res.headers.get('x-kong-request-id'),
        cost: null,
      };
    },
  };
}

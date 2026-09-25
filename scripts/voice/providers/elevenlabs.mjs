// Fournisseur ElevenLabs : synthèse d'une phrase, crédits restants, accès à la voix.
// La clé ne sort jamais d'ici : elle ne part que dans l'en-tête xi-api-key, aucun message
// d'erreur ni journal ne la contient.

import {
  ProviderError,
  assertApiKey,
  httpCaller,
  looksLikeMp3,
  readErrorDetail,
} from './common.mjs';

// Les tests et d'anciens appels importent la classe d'ici
export { ProviderError } from './common.mjs';

export const DEFAULT_BASE_URL = 'https://api.elevenlabs.io';

/**
 * Classement d'une erreur HTTP : le premier cas qui s'applique l'emporte, « request » si
 * aucun. Seules les erreurs passagères gardent le délai annoncé par retry-after.
 */
const ERROR_KINDS = [
  { kind: 'quota', applies: (code, status) => status === 'quota_exceeded' || code === 402 },
  { kind: 'rate', applies: code => code === 429, transient: true },
  { kind: 'server', applies: code => code >= 500, transient: true },
  { kind: 'voice', applies: (code, status) => status === 'voice_not_found' || code === 404 },
  { kind: 'auth', applies: code => code === 401 || code === 403 },
];

function classifyError(code, status) {
  return ERROR_KINDS.find(rule => rule.applies(code, status)) ?? { kind: 'request' };
}

/** « ElevenLabs <code> <statut> : <texte> », sans les morceaux vides */
function errorMessage(code, status, detailMessage) {
  const text = String(detailMessage ?? '').slice(0, 200);
  return [`ElevenLabs ${code}`, status, text && `: ${text}`].filter(Boolean).join(' ');
}

async function errorFrom(res) {
  const detail = await readErrorDetail(res);
  const status = typeof detail.status === 'string' ? detail.status : '';
  const message = errorMessage(res.status, status, detail.message);
  const retryAfterMs = Number(res.headers.get('retry-after')) * 1000 || undefined;
  const { kind, transient } = classifyError(res.status, status);
  return new ProviderError(kind, message, transient ? { retryAfterMs } : {});
}

/**
 * @param {{apiKey: string, baseUrl?: string, fetchImpl?: typeof fetch}} options
 */
export function createElevenLabs({ apiKey, baseUrl = DEFAULT_BASE_URL, fetchImpl = fetch }) {
  assertApiKey(apiKey, 'ELEVENLABS_API_KEY');
  const call = httpCaller({
    label: 'ElevenLabs',
    apiKey,
    authHeaders: { 'xi-api-key': apiKey },
    baseUrl,
    fetchImpl,
    errorFrom,
  });

  return {
    name: 'elevenlabs',

    /** Crédits du compte : { used, limit } (null si la clé n'a pas ce droit) */
    async credits() {
      try {
        const data = await (await call('/v1/user/subscription')).json();
        const used = Number(data.character_count);
        const limit = Number(data.character_limit);
        return Number.isFinite(used) && Number.isFinite(limit) ? { used, limit } : null;
      } catch (error) {
        if (error instanceof ProviderError && error.kind === 'auth') return null;
        throw error;
      }
    },

    /** Échoue si la voix n'est pas utilisable avec cette clé */
    async checkVoice(voice) {
      await call(`/v1/voices/${encodeURIComponent(voice.voiceId)}`);
    },

    /**
     * @param {{text: string, voice: Object, signal?: AbortSignal}} request
     * @returns {Promise<{audio: Buffer, requestId: string|null, cost: number|null}>} cost :
     *   crédits décomptés (en-tête character-cost), null si la réponse ne le dit pas
     */
    async synthesize({ text, voice, signal }) {
      const query = `output_format=${encodeURIComponent(voice.sourceFormat)}`;
      const res = await call(`/v1/text-to-speech/${encodeURIComponent(voice.voiceId)}?${query}`, {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({
          text,
          model_id: voice.model,
          language_code: voice.languageCode,
          voice_settings: voice.settings,
        }),
      });
      const audio = Buffer.from(await res.arrayBuffer());
      if (!looksLikeMp3(audio)) {
        // Réponse payée mais inutilisable : réessayer repaierait, on arrête tout
        throw new ProviderError(
          'response',
          `ElevenLabs : réponse qui n'est pas un MP3 (${audio.length} octets)`
        );
      }
      const cost = res.headers.get('character-cost');
      return {
        audio,
        requestId: res.headers.get('request-id'),
        cost: cost === null || !Number.isFinite(Number(cost)) ? null : Number(cost),
      };
    },
  };
}

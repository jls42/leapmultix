// Fournisseur ElevenLabs : synthèse d'une phrase, crédits restants, accès à la voix.
// La clé ne sort jamais d'ici : elle ne part que dans l'en-tête xi-api-key, aucun message
// d'erreur ni journal ne la contient.

/** Erreur d'un fournisseur, classée pour décider de la suite (réessayer, arrêter…) */
export class ProviderError extends Error {
  /**
   * @param {'quota'|'auth'|'voice'|'rate'|'server'|'request'|'network'|'response'} kind
   * @param {string} message
   * @param {{retryAfterMs?: number}} [options]
   */
  constructor(kind, message, { retryAfterMs } = {}) {
    super(message);
    this.name = 'ProviderError';
    this.kind = kind;
    this.retryAfterMs = retryAfterMs;
  }
}

export const DEFAULT_BASE_URL = 'https://api.elevenlabs.io';

async function readDetail(res) {
  try {
    const body = await res.json();
    // Erreur de validation (422) : une liste de { msg, loc }
    if (Array.isArray(body?.detail)) {
      return { message: body.detail.map(item => item?.msg ?? JSON.stringify(item)).join(' ; ') };
    }
    if (body && typeof body.detail === 'object' && body.detail) return body.detail;
    return { message: String(body?.detail ?? body?.message ?? '') };
  } catch {
    return { message: '' };
  }
}

async function errorFrom(res) {
  const detail = await readDetail(res);
  const status = typeof detail.status === 'string' ? detail.status : '';
  const text = String(detail.message ?? '').slice(0, 200);
  const message = `ElevenLabs ${res.status}${status ? ` ${status}` : ''}${text ? ` : ${text}` : ''}`;
  const retryAfterMs = Number(res.headers.get('retry-after')) * 1000 || undefined;
  if (status === 'quota_exceeded' || res.status === 402) return new ProviderError('quota', message);
  if (res.status === 429) return new ProviderError('rate', message, { retryAfterMs });
  if (res.status >= 500) return new ProviderError('server', message, { retryAfterMs });
  if (status === 'voice_not_found' || res.status === 404)
    return new ProviderError('voice', message);
  if (res.status === 401 || res.status === 403) return new ProviderError('auth', message);
  return new ProviderError('request', message);
}

/** Premiers octets d'un MP3 : balise ID3 ou mot de synchronisation d'une trame */
function looksLikeMp3(buffer) {
  if (buffer.length < 4) return false;
  if (buffer.toString('latin1', 0, 3) === 'ID3') return true;
  return buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
}

/**
 * @param {{apiKey: string, baseUrl?: string, fetchImpl?: typeof fetch}} options
 */
export function createElevenLabs({ apiKey, baseUrl = DEFAULT_BASE_URL, fetchImpl = fetch }) {
  if (!apiKey) throw new ProviderError('auth', 'ELEVENLABS_API_KEY manquante');
  // Une clé avec un espace ou un saut de ligne ferait citer sa valeur par fetch
  if (!/^[\x21-\x7e]+$/.test(apiKey)) {
    throw new ProviderError(
      'auth',
      'ELEVENLABS_API_KEY mal formée (espace, saut de ligne ou caractère invisible)'
    );
  }
  const hide = message => String(message).replaceAll(apiKey, '***');

  async function call(pathname, init = {}) {
    let res;
    try {
      res = await fetchImpl(`${baseUrl}${pathname}`, {
        ...init,
        headers: { 'xi-api-key': apiKey, ...init.headers },
      });
    } catch (error) {
      if (init.signal?.aborted) throw error;
      throw new ProviderError('network', `ElevenLabs injoignable : ${hide(error.message)}`);
    }
    if (!res.ok) throw await errorFrom(res);
    return res;
  }

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

// Ce que les fournisseurs de synthèse partagent : la classe de leurs erreurs (generate.mjs
// décide de la suite d'après son kind), le contrôle d'une clé, la lecture d'un corps
// d'erreur et la vérification qu'une réponse est bien un MP3. Le classement des erreurs HTTP
// reste propre à chaque fournisseur : un même statut n'y veut pas dire la même chose (un 403
// est une clé refusée chez ElevenLabs, un texte refusé par la modération chez Mistral).

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

/**
 * Refuse une clé absente ou mal formée : une clé avec un espace ou un saut de ligne ferait
 * citer sa valeur par fetch dans un message d'erreur
 * @param {string|undefined} apiKey
 * @param {string} variable - Nom de la variable d'environnement, pour le message
 */
export function assertApiKey(apiKey, variable) {
  if (!apiKey) throw new ProviderError('auth', `${variable} manquante`);
  if (!/^[\x21-\x7e]+$/.test(apiKey)) {
    throw new ProviderError(
      'auth',
      `${variable} mal formée (espace, saut de ligne ou caractère invisible)`
    );
  }
}

/** Masque la clé dans un message (erreur réseau qui citerait l'en-tête) */
export const keyMasker = apiKey => message => String(message).replaceAll(apiKey, '***');

/**
 * Détail d'un corps d'erreur :
 * - { detail: [{ msg }] } (validation, 422) : les messages joints ;
 * - { detail: { status, message } } (ElevenLabs) : l'objet tel quel ;
 * - { detail: "…" } ou { message: "…" | { … }, type } (Mistral) : le texte, et le type.
 * @returns {{message: string, type?: string, status?: string}}
 */
export function errorDetail(body) {
  const detail = body?.detail;
  if (Array.isArray(detail)) {
    return { message: detail.map(item => item?.msg ?? JSON.stringify(item)).join(' ; ') };
  }
  if (detail && typeof detail === 'object') return detail;
  const nested = body?.message;
  const message = nested && typeof nested === 'object' ? errorDetail(nested).message : nested;
  const type = typeof body?.type === 'string' ? body.type : undefined;
  return { message: String(detail ?? message ?? ''), type };
}

/** Détail du corps d'une réponse en erreur ; vide si le corps n'est pas du JSON */
export async function readErrorDetail(res) {
  try {
    return errorDetail(await res.json());
  } catch {
    return { message: '' };
  }
}

/** Premiers octets d'un MP3 : balise ID3 ou mot de synchronisation d'une trame */
export function looksLikeMp3(buffer) {
  if (buffer.length < 4) return false;
  if (buffer.toString('latin1', 0, 3) === 'ID3') return true;
  return buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
}

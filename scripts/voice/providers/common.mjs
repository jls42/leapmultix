// Ce que les fournisseurs de synthèse partagent : la classe de leurs erreurs (generate.mjs
// décide de la suite d'après son kind), le contrôle d'une clé, l'appel HTTP, la lecture d'un
// corps d'erreur et la vérification qu'une réponse est bien un MP3. Le classement des erreurs
// HTTP reste propre à chaque fournisseur : un même statut n'y veut pas dire la même chose (un
// 403 est une clé refusée chez ElevenLabs, un texte refusé par la modération chez Mistral).

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
const keyMasker = apiKey => message => String(message).replaceAll(apiKey, '***');

/**
 * Appel HTTP d'un fournisseur : ses en-têtes d'accès s'ajoutent à ceux de l'appel, une panne
 * réseau devient une erreur « network » où la clé est masquée, une réponse en erreur passe par
 * errorFrom, le classement propre au fournisseur. Un appel annulé par son signal garde son
 * erreur telle quelle.
 * @param {{label: string, apiKey: string, authHeaders: Record<string, string>,
 *   baseUrl: string, fetchImpl: typeof fetch,
 *   errorFrom: (res: Response) => Promise<ProviderError>}} options
 * @returns {(pathname: string, init?: RequestInit) => Promise<Response>}
 */
export function httpCaller({ label, apiKey, authHeaders, baseUrl, fetchImpl, errorFrom }) {
  const hide = keyMasker(apiKey);
  return async function call(pathname, init = {}) {
    let res;
    try {
      res = await fetchImpl(`${baseUrl}${pathname}`, {
        ...init,
        headers: { ...authHeaders, ...init.headers },
      });
    } catch (error) {
      if (init.signal?.aborted) throw error;
      throw new ProviderError('network', `${label} injoignable : ${hide(error.message)}`);
    }
    if (!res.ok) throw await errorFrom(res);
    return res;
  };
}

/** Messages d'une liste de validation (422) : chaque { msg }, joints */
const validationMessages = list => list.map(item => item?.msg ?? JSON.stringify(item)).join(' ; ');

/** Texte d'un champ message : tel quel, ou lu dans l'objet qu'il contient */
function messageText(message) {
  return message && typeof message === 'object' ? errorDetail(message).message : message;
}

/** Texte et type d'un corps sans détail structuré : { detail: "…" } ou { message, type } */
function plainDetail({ detail, message, type }) {
  return {
    message: String(detail ?? messageText(message) ?? ''),
    type: typeof type === 'string' ? type : undefined,
  };
}

/**
 * Détail d'un corps d'erreur :
 * - { detail: [{ msg }] } (validation, 422) : les messages joints ;
 * - { detail: { status, message } } (ElevenLabs) : l'objet tel quel ;
 * - { detail: "…" } ou { message: "…" | { … }, type } (Mistral) : le texte, et le type ;
 * - autre chose qu'un objet : un message vide.
 * @returns {{message: string, type?: string, status?: string}}
 */
export function errorDetail(body) {
  if (!body || typeof body !== 'object') return { message: '' };
  const { detail } = body;
  if (Array.isArray(detail)) return { message: validationMessages(detail) };
  if (detail && typeof detail === 'object') return detail;
  return plainDetail(body);
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

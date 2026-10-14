/**
 * Audit dans un Chrome neuf, relancé si Chrome refuse la connexion juste après son lancement.
 * Vu une fois en CI (rapport SEO du 14/10/2026) : chrome-launcher avait trouvé le port de
 * débogage ouvert, puis Lighthouse s'y est vu refuser (ECONNREFUSED). Seul ce refus relance un
 * Chrome ; toute autre erreur remonte telle quelle.
 */

/** Essais d'un même audit, Chrome neuf à chaque fois */
export const ATTEMPTS = 3;

/** Chrome a-t-il refusé ou coupé la connexion, sans que l'audit ait commencé ? */
export function isConnectionRefused(error) {
  return /ECONNREFUSED|ECONNRESET|socket hang up/.test(
    `${error?.code ?? ''} ${error?.message ?? ''}`
  );
}

/**
 * Lance Chrome, y fait l'audit, ferme Chrome ; sur un refus de connexion, recommence avec un
 * Chrome neuf, jusqu'à ATTEMPTS essais
 * @param {string} url
 * @param {{launch: Function, audit: Function, log?: Function, attempts?: number}} io - launch
 *   (chrome-launcher) rend {port, kill} ; audit(url, port) rend le résultat de Lighthouse
 * @param {number} [attempt]
 */
export async function auditInFreshChrome(url, io, attempt = 1) {
  const { launch, audit, log = console.log, attempts = ATTEMPTS } = io;
  const chrome = await launch();
  try {
    return await audit(url, chrome.port);
  } catch (error) {
    if (!isConnectionRefused(error) || attempt >= attempts) throw error;
    log(`  Chrome a refusé la connexion (${error.message}) : Chrome neuf, essai ${attempt + 1}`);
  } finally {
    await chrome.kill();
  }
  return auditInFreshChrome(url, io, attempt + 1);
}

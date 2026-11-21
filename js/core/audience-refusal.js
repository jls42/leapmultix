/**
 * Refus de la mesure d'audience, retenu sur l'appareil du visiteur.
 *
 * Le site ne sait pas qui le visite : un refus ne peut donc être retenu que dans le navigateur
 * du visiteur. C'est le drapeau que le traceur de Plausible lit de lui-même avant chaque envoi
 * (localStorage, clé « plausible_ignore », valeur « true ») ; le jeu le lit aussi pour ne pas
 * démarrer la mesure (js/plausible-init.js). Aucune dépendance : ce module est chargé dès
 * l'ouverture de la page.
 */

/** Clé et valeur attendues par le traceur de Plausible (js/vendor/plausible.js) */
export const AUDIENCE_REFUSAL_KEY = 'plausible_ignore';
const REFUSED = 'true';

/**
 * Le stockage du navigateur, ou null s'il est interdit (navigation privée stricte, réglage)
 * @returns {Storage|null}
 */
function browserStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    // Accès refusé par le navigateur : on fait comme s'il n'y avait pas de stockage
    return null;
  }
}

/**
 * Le visiteur a-t-il refusé d'être compté sur cet appareil ?
 * @param {Storage|null} [storage]
 * @returns {boolean}
 */
export function isAudienceRefused(storage = browserStorage()) {
  try {
    return storage?.getItem(AUDIENCE_REFUSAL_KEY) === REFUSED;
  } catch {
    // Lecture refusée : rien n'est retenu, donc aucun refus connu
    return false;
  }
}

/**
 * Retient le refus du visiteur, ou l'efface
 * @param {boolean} refused
 * @param {Storage|null} [storage]
 * @returns {boolean} Vrai si le choix est retenu (faux : le navigateur interdit le stockage)
 */
export function setAudienceRefused(refused, storage = browserStorage()) {
  if (!storage) return false;
  try {
    if (refused) storage.setItem(AUDIENCE_REFUSAL_KEY, REFUSED);
    else storage.removeItem(AUDIENCE_REFUSAL_KEY);
    return isAudienceRefused(storage) === refused;
  } catch {
    // Écriture refusée (stockage plein ou interdit) : le choix n'est pas retenu
    return false;
  }
}

/**
 * Mesure d'audience : le traceur officiel de Plausible (paquet @plausible-analytics/tracker),
 * copié dans js/vendor/ et servi par le site (npm run vendor:plausible). Aucun script de
 * plausible.io ne tourne dans le jeu : seuls les événements partent vers son API.
 *
 * deploy.sh écrit le domaine dans <meta name="plausible-domain"> ; sans domaine valide
 * (serveur local, copie du dépôt), rien n'est mesuré. Le traceur ignore de lui-même localhost
 * et les navigateurs pilotés par un robot. Il pose window.plausible, qui reçoit les événements
 * du jeu (« Voice fallback », voice-clips.js).
 */
import { init } from './vendor/plausible.js';

/** Nom d'hôte seul : ni guillemet, ni barre, ni espace */
const HOSTNAME = /^[a-z0-9.-]{1,253}$/i;

/**
 * Domaine déclaré à Plausible, lu dans la page ; '' s'il manque ou n'est pas un nom d'hôte
 * (« {{PLAUSIBLE_DOMAIN}} » tant que deploy.sh ne l'a pas remplacé)
 * @param {Document} doc
 * @returns {string}
 */
export function plausibleDomain(doc) {
  const domain = doc.querySelector('meta[name="plausible-domain"]')?.content?.trim() ?? '';
  return HOSTNAME.test(domain) ? domain : '';
}

/**
 * Lance le traceur pour le domaine de la page, s'il y en a un
 * @param {Document} doc
 * @param {(options: {domain: string, logging: boolean}) => void} start - init du traceur
 * @returns {boolean} Vrai si la mesure est lancée
 */
export function startAudience(doc, start) {
  const domain = plausibleDomain(doc);
  if (!domain) return false;
  // Sans journal : pas d'« Ignoring Event: localhost » dans la console en développement
  start({ domain, logging: false });
  return true;
}

startAudience(document, init);

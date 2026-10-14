#!/usr/bin/env node
/**
 * Hook PreToolUse : l'agent chrome-devtools-tester ne navigue que vers le serveur local du jeu
 * (http://localhost ou http://127.0.0.1, port au choix). Il refuse aussi initScript, du code
 * exécuté dans la page suivante, qui pourrait la rediriger ailleurs.
 *
 * Copie locale : déclaré dans le frontmatter de l'agent, qui ne vaut que pendant son travail ;
 * --always y vérifie chaque appel. Un agent de plugin ignore ce frontmatter : le plugin du
 * marketplace pose ce script dans son hooks.json, qui vaut pour toute la session ; sans
 * --always, seul l'agent de test est visé, jamais l'agent principal ni un autre agent.
 *
 * Entrée : le JSON du hook sur l'entrée standard. Code 0 : appel accepté ; code 2 : refusé, la
 * raison sur la sortie d'erreur, que l'agent lit.
 */
import { readFileSync } from 'node:fs';

const TESTER = /^(chrome-devtools-tester:)?chrome-devtools-tester$/;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

/**
 * Une adresse du serveur local : http, hôte de la boucle locale. L'hôte est celui que lit le
 * navigateur : http://localhost@ailleurs.example vise ailleurs.example, refusé.
 */
function isLocal(address) {
  let url;
  try {
    url = new URL(address);
  } catch {
    return false; // pas une adresse valable : refusée
  }
  return url.protocol === 'http:' && LOCAL_HOSTS.has(url.hostname);
}

/** L'appel vient-il de l'agent de test ? (--always : chaque appel est vérifié) */
function fromTester(input, always) {
  return always || TESTER.test(input.agent_type ?? '');
}

/**
 * Raison du refus d'une navigation, ou null si elle passe
 * @param {{url?: string, initScript?: string}} [toolInput]
 */
function navigationRefusal({ url, initScript } = {}) {
  if (initScript) return 'initScript refusé : il pourrait mener la page hors du serveur local';
  // Sans adresse : retour, avance ou rechargement de la page déjà ouverte
  if (url === undefined || isLocal(url)) return null;
  return `Adresse refusée : cet agent ne navigue que vers http://localhost ou http://127.0.0.1 (demandé : ${url})`;
}

/**
 * Raison du refus, ou null si l'appel passe
 * @param {{agent_type?: string, tool_input?: {url?: string, initScript?: string}}} input
 * @param {boolean} always - vérifier quel que soit l'agent
 */
function refusal(input, always) {
  return fromTester(input, always) ? navigationRefusal(input.tool_input) : null;
}

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.stderr.write('Entrée du hook illisible : appel refusé\n');
  process.exit(2);
}
const reason = refusal(input, process.argv.includes('--always'));
if (reason) {
  process.stderr.write(`${reason}\n`);
  process.exit(2);
}

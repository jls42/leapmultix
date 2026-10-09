# Guide du dépôt LeapMultix

Jeu de calcul mental pour enfants de 6 à 12 ans : modules ES servis tels quels (pas de bundler),
textes en français, anglais et espagnol. Ce guide reste court : les détails sont dans les fichiers
cités par leur chemin, à lire quand le sujet se présente (aucun n'est importé). Les règles de
`.claude/rules/` se chargent d'elles-mêmes quand on touche leurs fichiers.

## Commandes

Depuis la racine (catalogue complet : `docs/guide/commandes.md`) :

```bash
npm install              # dépendances
npm run serve            # serveur de développement
npm test                 # Jest (tests/, dont les tests de bout en bout dans Chrome)
npm run test:esm         # tests ESM (tests-esm/, sur les vrais modules)
npm run verify           # lint + test + test:esm + couverture : la porte qualité
npm run format:check     # Prettier (npm run format pour corriger)
npm run lint             # ESLint sur js/** (les scripts : npx eslint <fichiers>)
npx stylelint "css/**/*.css"
npm run i18n:compare     # en et es synchronisés avec fr
npm run precache:update  # liste de préchargement hors ligne de sw.js
npm run assets:generate  # variantes WebP des images (assets/generated-images, non versionné)
npm run voice:corpus     # phrases lues à voix haute, par langue
```

Avant tout commit : `npm run format:check` (sinon `npm run format`), `npm run lint`, puis
`npm run verify`. La CI échoue sur un fichier mal formaté.

## Règles de code

- Variables et paramètres inutilisés retirés ; un `catch` dit pourquoi il ignore une erreur.
- Complexité cognitive sous 15 ; Lizard (Codacy) : complexité ≤ 8, ≤ 50 lignes et ≤ 8 paramètres
  par fonction. Une fonction trop complexe se découpe en fonctions nommées.
- Tout tirage au hasard passe par `js/core/random.js` (`randomInt`, `chance`, `pickRandom`,
  `shuffleInPlace`) : ESLint refuse `Math.random`.
- Toute entrée extérieure se valide. DOM : jamais d'`innerHTML` avec une donnée ; `security-utils.js` (`appendSanitizedHTML`,
  `createSafeElement`, `setSafeMessage`). Pas d'accès `objet[variable]` (Codacy) : `Map`,
  `Object.entries` / `Object.fromEntries`, `Reflect.deleteProperty`, `.at(i)`.
- Scripts Node : `node:fs`, `node:path`… ; des tâches asynchrones en série passent par
  `scripts/lib/in-sequence.cjs` plutôt que par un `await` dans une boucle.
- CSS : notation moderne `rgb(255 255 255 / 0.9)`, jamais `rgba(...)`.
- Scripts externes : `crossorigin="anonymous"` ; empreinte d'intégrité pour une bibliothèque figée,
  pas pour Plausible, qui change : la CSP restreint les sources.
- Faux positif d'un analyseur : suppression ESLint en ligne, au plus près, raison écrite après
  `--` (syntaxe et exemples : `docs/guide/analyse-statique.md`).

## Architecture

- `index.html` : point d'entrée, écrans numérotés (`slide0`, `slide1`…, `goToSlide()` de
  `js/slides.js`) ; `js/main.js` démarre le jeu ; `js/bootstrap.js` branche les événements (aucun
  `onclick` dans le HTML) ; `js/game.js` garde l'état de la partie (`gameState`).
- `js/core/` : services (`Storage`, `UserState`, `eventBus`, audio, statistiques) ; `js/modes/` :
  les six modes ; `js/components/` : l'interface ; Arcade : `js/arcade-*.js`, `js/multimiam*.js`,
  `js/multisnake.js`.
- Conventions : modules ES, camelCase et PascalCase, composants reliés par `eventBus`, modes chargés
  à la demande par `js/lazy-loader.js` ; importer `utils-es6.js` ou `core/utils.js`, jamais
  `./utils.js`.
- Tests : Jest et jsdom (`jest.config.cjs`) dans `tests/__tests__/*.test.js` ; un test qui charge
  les vrais modules va dans `tests-esm/*.test.mjs`.
- Carte complète des modules : `.claude/rules/architecture.md`.

## Données, textes, pages et images

- Un profil déjà enregistré se lit à l'identique : une nouvelle donnée s'ajoute sans rien effacer.
- Textes en fr, en et es ensemble, pluriels ICU (`{n, plural, one {# boîte} other {# boîtes}}`),
  mêmes paramètres dans les trois langues : `.claude/rules/traductions.md`.
- **Une phrase lue à voix haute modifiée se réenregistre avant sa mise en prod** : clips de chaque
  voix, payants, accord du propriétaire. `tests-esm/voice/corpus.esm.test.mjs` échoue exprès pour
  le rappeler. Marche à suivre : `.claude/rules/phrases-parlees.md`.
- **Pages juridiques** (`#slide9` mentions légales, `#slide10` politique de confidentialité, dans
  `index.html`) : un texte modifié change sa date de révision, clé `legal_last_updated` ou
  `privacy_last_updated` en fr, en et es, et la date écrite dans `index.html`. Le verrou
  `tests-esm/legal-pages.lock.json` l'exige (`tests-esm/legal-pages.esm.test.mjs`).
- Images : sources haute définition, variantes WebP produites par `npm run assets:generate` ;
  réglages et pièges : `.claude/rules/images.md`.
- Hors ligne : un module, un son, une image ou une feuille de style ajouté demande
  `npm run precache:update` (sinon `tests-esm/scripts/precache-list.test.mjs` échoue) ; service
  worker et déploiement : `.claude/rules/deploiement.md`.

## Commits et PR

- Proposer chaque commit avec le skill `helping-with-commits` et attendre l'accord. Exception : les
  commits qui ne font que corriger les retours des analyseurs d'une PR déjà autorisée.
- Jamais de commit sur `main` : une branche (`feat/…`, `fix/…`), poussée, puis une PR. Le
  propriétaire fusionne lui-même.
- Messages au format Conventional Commits, en français, à l'impératif, concis ; aucun outil d'IA
  nommé dans un commit ni dans une PR ; aucun secret.
- Skills et agents copiés dans `leapmultix-marketplace/` : `.claude/rules/marketplace.md`.

### Retours de PR : boucle obligatoire, jusqu'au vert

À l'ouverture d'une PR **et après chaque push**, aller lire les retours des
analyseurs (GitHub Actions, Codacy, CodeFactor, SonarCloud) et corriger ce qui
remonte. Ce n'est pas une demande à attendre : c'est la suite normale du travail.

1. Lire **toutes** les remontées, sans échantillonner.
2. Corriger à la source. Un faux positif se justifie par écrit, avec une
   suppression inline au périmètre le plus étroit. Une fonction trop complexe se
   découpe, elle ne se masque pas.
3. Relancer toute la batterie de vérification (section suivante).
4. Committer, pousser, puis **retourner lire les contrôles**. Recommencer tant
   que tout n'est pas vert.

**Une remontée se corrige, elle ne se rapporte pas.** Lister les problèmes en
laissant à l'utilisateur le soin de demander la correction n'est pas un
service : c'est du travail à moitié fait. La seule exception est le point qui
demande une décision qui ne s'invente pas — un arbitrage produit, une action
dans une console tierce, un coût. Celui-là se pose en une ligne, le reste se
corrige.

Cela vaut pour les remontées de la porte qualité **comme pour celles qui ne la
bloquent pas** : une odeur de code signalée sur une PR se traite dans cette PR.

**Une remontée en cache souvent une vraie.** Le message décrit un symptôme ;
chercher la cause avant de corriger. Trois exemples rencontrés : un
`find -name "**/*.js"` qui n'a jamais rien trouvé, donc une analyse d'assets
portant sur zéro fichier ; vingt-trois tests audio au vert qui n'exécutaient
pas une ligne du module ; des `.sort()` sans comparateur qui plaçaient tout un
dépôt en note D de fiabilité.

### Lire les analyseurs par leur API, pas au voyant

Un contrôle vert ne dit pas qu'il n'y a rien : la Quality Gate SonarCloud ne
juge que le **nouveau code**. Le 24/09/2026, elle était verte alors que `main`
affichait Sécurité D, Fiabilité C et 27 hotspots jamais revus, remontés sur du
code ancien par un changement de profil qualité. On compte donc les remontées,
sur la PR puis sur `main` :

```bash
PR=52 # numéro de la PR : les trois nombres doivent valoir 0
curl -s "https://sonarcloud.io/api/issues/search?componentKeys=jls42_leapmultix&pullRequest=$PR&resolved=false" | jq .total
curl -s "https://sonarcloud.io/api/hotspots/search?projectKey=jls42_leapmultix&pullRequest=$PR" | jq .paging.total
curl -s "https://app.codacy.com/api/v3/analysis/organizations/gh/jls42/repositories/leapmultix/pull-requests/$PR/issues?status=new" | jq '.data | length'

# Après fusion, notes globales de main : ratings à 1.0 (A), vulnérabilités, bugs et hotspots à 0
curl -s "https://sonarcloud.io/api/measures/component?component=jls42_leapmultix&branch=main&metricKeys=security_rating,reliability_rating,sqale_rating,security_review_rating,vulnerabilities,bugs,security_hotspots,duplicated_lines_density" \
  | jq -r '.component.measures[] | "\(.metric) \(.value)"'
```

Une note globale de `main` qui n'est pas à A se traite comme une remontée de PR.

## Vérifier : mesuré, jamais supposé

L'utilisateur est le dernier maillon. Quand on lui annonce que c'est bon, ça doit
l'être vraiment. Donc, avant toute annonce de résultat :

- Chaque affirmation repose sur une **mesure déterministe** : sortie de commande,
  valeur lue dans le DOM, capture d'écran. Jamais sur une lecture du code seule.
- Batterie complète : `npm run format:check`, `npm run lint`, `npm test`,
  `npm run test:esm`, `npm run verify`, `npx stylelint "css/**/*.css"`, et
  `npm run i18n:compare` si les traductions bougent.
- **Plus une validation dans Chrome** des écrans touchés : parcours à la souris
  **et** au clavier, console sans erreur, capture à l'appui, et au moins un
  passage en largeur téléphone (390 px).
- Les preuves n'ont pas à être montrées, mais elles doivent exister. Une
  vérification qui n'a pas pu être faite se dit explicitement ; elle ne se
  présente jamais comme faite.
- **Un test qui passe ne prouve rien tant qu'on ne l'a pas vu échouer.** Devant
  un test soupçonné de ne rien vérifier, injecter la panne qu'il est censé
  détecter : s'il reste vert, c'est de la couverture fantôme, et le corriger
  passe avant tout le reste.

## Déploiement

Un push sur `main` déploie le site après le job `verify` (`.github/workflows/ci.yml` : jeton OIDC,
images régénérées, puis `deploy.sh`). À savoir avant d'y toucher, détails dans
`.claude/rules/deploiement.md` :

- **Monter `APP_VERSION` à chaque mise en prod** (avec la `VERSION` de `sw.js`, un test l'exige) :
  elle change l'adresse de chaque module et renouvelle la copie du service worker, qui sert les
  modules de sa version avant le réseau.
- `assets/generated-images/` n'est pas versionné : la CI le reconstruit avant d'envoyer.
- Après chaque fusion, vérifier que la prod sert la version fusionnée (5 à 20 minutes) :

```bash
gh api "repos/jls42/leapmultix/actions/runs?head_sha=$(git rev-parse origin/main)" \
  --jq '.workflow_runs[] | "\(.status) \(.conclusion)"'
curl -s -H 'Cache-Control: no-cache' https://leapmultix.jls42.org/sw.js | grep -m1 'const VERSION'
git show origin/main:sw.js | grep -m1 'const VERSION'
```

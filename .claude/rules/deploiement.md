---
paths:
  - 'deploy.sh'
  - 'deploy.config*'
  - 'pull-from-s3.sh'
  - 'scripts/check-s3-copy.mjs'
  - '.github/workflows/**'
  - 'sw.js'
  - 'js/cache-updater.js'
  - 'js/lazy-loader.js'
  - 'scripts/version-module-urls.mjs'
  - 'scripts/precache-list.mjs'
  - 'offline.html'
  - 'pwa.html'
  - 'scripts/check-generated-images.sh'
---

# Déploiement et hors ligne

## Hors ligne

**Hors ligne : la liste de préchargement suit le code.** Le service worker garde à
l'installation tout ce que le jeu charge (modules, styles, polices, sons, traductions, images
nommées dans le code), pour que chaque mode démarre hors ligne après une première visite. Un
module, un son, une image ou une feuille de style ajouté : `npm run precache:update`, sinon
`tests-esm/scripts/precache-list.test.mjs` échoue. La version de `sw.js` et `APP_VERSION`
montent ensemble (test du même fichier).

- In local development the modes (`lazy-loader.js`) and the optional styles carry `?v=APP_VERSION`: once the service worker is installed, they come from its precache, so a change shows only after the service worker updates (DevTools, Application: « Update on reload » or « Bypass for network »)

## Déploiement automatique

Un push sur `main` déploie le site, mais seulement si le job `verify` est passé
(`.github/workflows/ci.yml`) : le job `images` régénère les images sans aucun droit AWS
(c'est lui qui exécute le code des dépendances npm), puis le job `deploy` les reçoit en
artefact, les contrôle (`scripts/check-generated-images.sh`), s'authentifie auprès d'AWS
par jeton OIDC (aucune clé stockée) et appelle `deploy.sh`, sans `npm ci`.

Deux points à connaître avant d'y toucher :

- **`assets/generated-images/` n'est pas versionné** (3100+ fichiers). Le job le
  reconstruit par `npm run assets:generate` avant la synchronisation. Sans cette
  étape, `aws s3 sync --delete` effacerait toutes les images du site : mesuré,
  3145 suppressions. Un garde-fou refuse de déployer si la génération est
  incomplète.
- **Rien d'autre que le site ne part** : ni lien symbolique (`rsync --no-links`, et
  `--no-follow-symlinks` pour l'AWS CLI), ni fichier caché (`--exclude='.*'`). Les outils de
  développement ne vivent pas dans les dossiers publiés (`assets/`, `css/`, `js/`, `img/`) :
  listes des scripts i18n dans `scripts/i18n-whitelist.txt` et `tools/i18n-keep.json`, rapports
  dans `analysis/` (ignoré par git). La synchronisation n'a pas de filtre : le bucket est le
  miroir exact de la copie, et `--delete` efface aussi ce qu'un ancien déploiement aurait
  laissé hors du site (les voix vivent dans un autre bucket). Test :
  `tests-esm/scripts/deploy-text-files.test.mjs`.
- **Seul le commit en tête de `main` se déploie** : un run relancé, ou dépassé par une fusion
  plus récente, s'arrête au premier pas du job `deploy` (avis « n'est plus la tête de main »,
  rien d'envoyé) ; le commit le plus récent se déploie par son propre run.
- **`deploy.sh` vérifie ses réglages avant tout envoi** : nom de bucket S3 selon les règles
  d'AWS, identifiant de distribution CloudFront (majuscules et chiffres), domaine Plausible,
  `VOICE_BASE`, et `VERSION` de `sw.js` égale à `APP_VERSION`. Un écart arrête tout, message
  sur la sortie d'erreur.
- **Le rôle IAM n'accepte que `refs/heads/main`.** Le dépôt étant public, c'est
  cette condition qui empêche la pull request d'un inconnu d'obtenir les droits
  de déploiement. Il est défini dans le dépôt d'infrastructure
  (`leapmultix-infra`, fichier `github-oidc.tf`).
- **`aws s3 sync --size-only` ne voit pas un fichier modifié à taille égale** : une
  version (« v19 » → « v20 »), une date, un mot de même longueur (« ElevenLabs » →
  « Mistral AI » dans `en.json`, resté ancien en ligne le 26/09/2026). `deploy.sh`
  renvoie donc d'office **tous les fichiers texte** du site (`.html`, `.js`, `.css`,
  `.json`, `.xml`, `.txt`) ; seuls les binaires (images, sons, vidéos, polices) s'en
  tiennent à la taille. Une nouvelle sorte de fichier texte s'ajoute à sa liste
  d'extensions, et au test `tests-esm/scripts/deploy-text-files.test.mjs`.
- **Chaque adresse de module porte la version** (`scripts/version-module-urls.mjs`,
  appelé par `deploy.sh` sur la copie à envoyer) : les modules s'importent sans
  version et CloudFront les donne au navigateur pour une semaine, qu'il ressert sans
  consulter le service worker. Sans ce versionnage, un joueur déjà venu mélangeait
  anciens et nouveaux modules après un déploiement (export absent : le mode ne
  démarre pas, constaté le 25/09/2026 en v22). **Monter `APP_VERSION` à chaque mise
  en prod** : c'est elle qui change toutes les adresses. C'est aussi elle qui renouvelle
  la copie du service worker : un module ou un style de sa version (`?v=<version>`) est
  servi par son préchargement avant le réseau, si bien qu'un déploiement sans montée de
  version laisse aux joueurs déjà venus leurs anciens modules jusqu'à la suivante
  (`sw.js` et `APP_VERSION` montent ensemble, un test l'exige).
- **Le npm de la CI est celui du poste et de Dependabot** (`npm@11.13.0`, installé avant
  chaque `npm ci`) : le npm 10 livré avec Node 22 refuse un `package-lock.json` écrit par
  npm 11 dès qu'une dépendance pair optionnelle ne s'accorde pas (Lighthouse 13, octobre 2026).
  Si le poste change de version majeure de npm, la CI suit. Test :
  `tests-esm/scripts/ci-npm.test.mjs`.

Après chaque fusion, vérifier en ligne que la prod sert la version fusionnée.
Le déploiement attend la fin de `verify` : compter 5 à 20 minutes.

```bash
# Le run de la fusion : attendre que verify et Déploiement soient terminés
gh api "repos/jls42/leapmultix/actions/runs?head_sha=$(git rev-parse origin/main)" \
  --jq '.workflow_runs[] | "\(.status) \(.conclusion)"'
# La version servie doit être celle du dépôt
curl -s -H 'Cache-Control: no-cache' https://leapmultix.jls42.org/sw.js | grep -m1 'const VERSION'
git show origin/main:sw.js | grep -m1 'const VERSION'
```

## CSP et mesure d'audience

- **Deux CSP s'appliquent à `index.html`** : celle de CloudFront (politiques d'en-têtes
  `leapmultix-default-policy`, `leapmultix-html-policy`, `leapmultix-assets-policy`, hors du
  dépôt), complète, et la balise meta de la page (`script-src 'self'`, `object-src 'none'`,
  `base-uri 'self'`, `form-action 'self'`), qui vaut aussi sur les serveurs locaux. Le
  navigateur applique les deux : un script hors du site est refusé même si CloudFront
  l'autorise. Pas de `frame-ancestors` ni d'`upgrade-insecure-requests` dans la balise :
  ignorés en meta, ou gênants sur `http://localhost`.
- **Plausible** : le traceur est servi par le site (`js/vendor/plausible.js`) ; `deploy.sh`
  écrit `PLAUSIBLE_DOMAIN` dans `<meta name="plausible-domain">` (nom d'hôte seul, sinon le
  déploiement s'arrête) et, sans domaine, retire les blocs `plausible:start` / `plausible:end`.
  Les événements partent vers `https://plausible.io/api/event` (`connect-src` de CloudFront).

Variables de dépôt attendues (Settings > Secrets and variables > Actions) :
`AWS_DEPLOY_ROLE_ARN`, `S3_BUCKET`, `CLOUDFRONT_DISTRIB`, `PLAUSIBLE_DOMAIN`, `VOICE_BASE`
(`/voice/` : adresse des clips de la voix enregistrée, voir `docs/voix-enregistree.md`).

Déploiement manuel toujours possible : `./deploy.sh` en local (lit `deploy.config`),
ou l'onglet Actions (« Run workflow » sur `main`, la seule branche que le job accepte),
avec l'option `dry_run` pour simuler sans rien écrire.

Rapatriement : `./pull-from-s3.sh` compare le contenu du bucket aux fichiers suivis de HEAD,
une fois défaits les changements de `deploy.sh` (`scripts/check-s3-copy.mjs`). Un seul fichier
différent ou inconnu de git, et rien n'est écrit dans le dépôt ; sinon, seules les images
générées (`assets/generated-images/`) y sont copiées.

<details>
<summary>Ce document est également disponible dans d'autres langues</summary>

- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Deutsch](./README.de.md)
- [中文](./README.zh.md)
- [हिन्दी](./README.hi.md)
- [العربية](./README.ar.md)
- [Italiano](./README.it.md)
- [Svenska](./README.sv.md)
- [Polski](./README.pl.md)
- [Nederlands](./README.nl.md)
- [Română](./README.ro.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)

</details>

# LeapMultix

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Licence : AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## Table des matières

- [Description](#description)
- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Démarrage rapide](#-démarrage-rapide)
- [Architecture](#-architecture)
- [Modes de Jeu Détaillés](#-modes-de-jeu-détaillés)
- [Développement](#-développement)
- [Compatibilité](#-compatibilité)
- [Localisation](#-localisation)
- [Voix enregistrée](#-voix-enregistrée)
- [Stockage des données](#-stockage-des-données)
- [Signaler un problème](#-signaler-un-problème)
- [Licence](#-licence)

## Description

LeapMultix est une application web éducative interactive destinée aux enfants de 6 à 12 ans pour maîtriser les 4 opérations arithmétiques : multiplication (×), addition (+), soustraction (−) et division (÷). Elle propose **5 modes de jeu** et **4 mini-jeux d'arcade** dans une interface intuitive, accessible et multilingue.

**Support multi-opérations :** les cinq modes acceptent les quatre opérations. Le choix se fait sur l'écran d'accueil et vaut pour tout le parcours.

**Développé par :** Julien LS (contact@jls42.org)

**URL en ligne :** https://leapmultix.jls42.org/

## 📸 Aperçu

### Les écrans

|                                                                                                               |                                                                                                                |
| :-----------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------: |
|                     ![Écran « Qui joue ? » : choix du profil](docs/media/01-accueil.webp)                     |              ![Menu principal : choix de l'opération et des cinq modes](docs/media/02-menu.webp)               |
|                   **Qui joue ?** — un profil par enfant, avec son avatar et sa progression.                   |                    **Le menu** — l'opération se choisit ici, puis les cinq modes s'ouvrent.                    |
|              ![Mode Découverte : la table de 4 montrée en points](docs/media/03-decouverte.webp)              |             ![Mode Quiz : réponse fausse en rouge, bonne réponse en vert](docs/media/04-quiz.webp)             |
|   **Découverte** — chaque égalité se montre en points, en bonds ou en comptage, avec l'astuce de la table.    | **Quiz** — le choix de l'enfant reste affiché à côté de la bonne réponse, et l'explication détaille le calcul. |
|                  ![Mode Défi : compte à rebours et série en cours](docs/media/05-defi.webp)                   |        ![Mode Aventure : carte des dix niveaux, les suivants verrouillés](docs/media/06-aventure.webp)         |
| **Défi** — course contre la montre. Sur une erreur, le chronomètre se fige le temps de lire la bonne réponse. |                **Aventure** — dix niveaux qui s'ouvrent l'un après l'autre, contre des étoiles.                |
|                       ![Menu Arcade : les quatre mini-jeux](docs/media/07-arcade.webp)                        |           ![Tableau de bord : étoiles par table et statistiques](docs/media/08-tableau-de-bord.webp)           |
|              **Arcade** — quatre mini-jeux, avec réglage de la difficulté et choix du vaisseau.               |                   **Tableau de bord** — étoiles par table, tables à revoir, scores par mode.                   |
|           ![Personnalisation : avatars, thèmes, accessibilité](docs/media/09-personnalisation.webp)           |                                                                                                                |
|      **Personnalisation** — avatar, thème de couleurs, taille du texte, contraste élevé, code parental.       |                                                                                                                |

### Les mini-jeux d'arcade

Quatre jeux qui posent la même question — celle affichée au-dessus de la zone de
jeu, avec le temps restant et les vies — mais demandent chaque fois un geste
différent.

|                                                                                                                        |                                                                                                            |
| :--------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: |
|  ![MultiInvaders : des monstres portant des nombres, un vaisseau en bas de l'écran](docs/media/10-multiinvaders.webp)  | ![MultiMiam : un labyrinthe où des pastilles portent les réponses possibles](docs/media/11-multimiam.webp) |
|         **MultiInvaders** — tirer sur les mauvaises réponses, épargner la bonne : elle cache un ami à libérer.         |      **MultiMiam** — parcourir le labyrinthe pour attraper le bon résultat, en évitant les monstres.       |
| ![MultiMemory : une grille de cartes, deux retournées montrant un calcul et un nombre](docs/media/12-multimemory.webp) |    ![MultiSnake : un serpent et des pommes numérotées dans une prairie](docs/media/13-multisnake.webp)     |
|               **MultiMemory** — retrouver de mémoire quelle carte porte le résultat du calcul retourné.                |               **MultiSnake** — grandir en avalant les bons nombres, éviter tous les autres.                |

## ✨ Fonctionnalités

### 🎮 Modes de Jeu

- **Mode Découverte** : Exploration visuelle et interactive adaptée à chaque opération
- **Mode Quiz** : Questions à choix multiples avec support des 4 opérations (×, +, −, ÷) et progression adaptative
- **Mode Défi** : Course contre la montre avec les 4 opérations (×, +, −, ÷) et différents niveaux de difficulté
- **Mode Aventure** : Progression narrative par niveaux avec support des 4 opérations

### 🕹️ Mini-jeux Arcade

- **MultiInvaders** : Space Invaders éducatif - Détruire les mauvaises réponses
- **MultiMiam** : Pac-Man mathématique - Collecter les bonnes réponses
- **MultiMemory** : Jeu de mémoire - Associer opérations et résultats
- **MultiSnake** : Snake éducatif - Grandir en mangeant les bons nombres

### ➕ Support Multi-Opérations

LeapMultix offre un entraînement complet aux 4 opérations arithmétiques dans **tous les modes** :

| Mode       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Défi       | ✅  | ✅  | ✅  | ✅  |
| Découverte | ✅  | ✅  | ✅  | ✅  |
| Aventure   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Fonctionnalités Transversales

- **Multi-utilisateurs** : Gestion de profils individuels avec progression sauvegardée
- **Multilingue** : Support français, anglais et espagnol
- **Personnalisation** : Avatars, thèmes de couleur, arrière-plans
- **Accessibilité** : Navigation clavier, support tactile, conformité WCAG 2.1 AA
- **Voix enregistrée** : questions et encouragements lus par une voix de synthèse pré-enregistrée (Lucie en français, créée avec ElevenLabs ; Jane en anglais, créée avec Mistral AI), avec repli automatique sur la voix de l'appareil ; clips hors du dépôt public (voir [Voix enregistrée](#-voix-enregistrée))
- **Mobile responsive** : Interface optimisée pour tablettes et smartphones
- **Système de progression** : Scores, badges, défis quotidiens

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 16 ou supérieure)
- Un navigateur web moderne

### Installation

```bash
# Cloner le projet
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Installer les dépendances
npm install

# Lancer le serveur de développement (option 1)
npm run serve
# L'application sera accessible sur http://localhost:8080 (ou port suivant disponible)

# Ou avec Python (option 2)
python3 -m http.server 8000
# L'application sera accessible sur http://localhost:8000
```

### Scripts disponibles

```bash
# Développement
npm run serve          # Serveur local (http://localhost:8080)
npm run lint           # Vérification du code avec ESLint
npm run lint:fix       # Correction automatique des problèmes ESLint
npm run format:check   # Vérifier le formatage du code (TOUJOURS avant commit)
npm run format         # Formater le code avec Prettier
npm run verify         # Quality gate: lint + test + coverage

# Tests
npm run test           # Lancer tous les tests (CJS)
npm run test:watch     # Tests en mode watch
npm run test:coverage  # Tests avec rapport de couverture
npm run test:core      # Tests des modules core uniquement
npm run test:integration # Tests d'intégration
npm run test:storage   # Tests du système de stockage
npm run test:esm       # Tests ESM (dossiers tests-esm/, Jest vm-modules)
npm run test:verbose   # Tests avec sortie détaillée
npm run test:pwa-offline # Test offline PWA (nécessite Puppeteer), après `npm run serve`

# Analyse et maintenance
npm run analyze:jsdoc  # Analyse de la documentation
npm run improve:jsdoc  # Amélioration automatique JSDoc
npm run audit:mobile   # Tests responsivité mobile
npm run audit:accessibility # Tests d'accessibilité
npm run dead-code      # Détection de code non utilisé
npm run analyze:globals # Analyse des variables globales
npm run analyze:dependencies # Analyse usage des dépendances
npm run verify:cleanup # Analyse combinée (dead code + globals)

# Gestion des assets
npm run assets:generate    # Générer les images responsives
npm run assets:backgrounds # Convertir les fonds en WebP
npm run assets:analyze     # Analyse des assets responsive
npm run assets:diff        # Comparaison des assets

# Internationalisation
npm run i18n:verify    # Vérifier la cohérence des clés de traduction
npm run i18n:unused    # Lister les clés de traduction non utilisées
npm run i18n:compare   # Comparer les traductions (en/es) avec fr.json (référence)

# Build & livraison
npm run build          # Build de prod (Rollup) + postbuild (dist/ complet)
npm run serve:dist     # Servir dist/ sur http://localhost:5000 (ou port disponible)

# PWA et Service Worker
npm run sw:disable     # Désactiver le service worker
npm run sw:fix         # Corriger les problèmes de service worker

# Voix enregistrée (poste du propriétaire, clips hors dépôt)
npm run voice:corpus       # Résumé des phrases dites, par langue
npm run voice:corpus:lock  # Mettre à jour le verrou du corpus
npm run voice:generate     # Générer les clips (ElevenLabs ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Architecture

### Structure des fichiers

Les modules JavaScript sont **à plat dans `js/`**, à trois dossiers près :
`core/`, `components/` et `modes/`. C'est donc le nom du fichier qui porte le
regroupement (`arcade-*`, `multimiam-*`, `i18n*`…).

```
leapmultix/
├── index.html              # Application (navigation par slides)
├── modes.html              # Page publique : les modes de jeu
├── parents.html            # Page publique : guide parents et enseignants
├── pwa.html                # Page publique : installation hors ligne
├── offline.html            # Page servie hors ligne par le service worker
├── sw.js                   # Service worker (version alignée sur js/cache-updater.js)
├── deploy.sh               # Déploiement S3 + invalidation CloudFront
├── js/
│   ├── core/               # Socle applicatif
│   │   ├── GameMode.js, GameModeManager.js   # Classe de base des modes
│   │   ├── storage.js, userState.js          # Persistance et session
│   │   ├── audio.js, theme.js, parental.js   # Son, thèmes, contrôle parental
│   │   ├── eventBus.js, mainInit.js          # Événements, amorçage DOM
│   │   ├── adventure-data.js                 # Niveaux du mode Aventure
│   │   ├── mult-stats.js, challenge-stats.js, operation-stats.js
│   │   ├── daily-challenge.js, tablePreferences.js, stats-migration.js
│   │   ├── userUi.js, utils.js               # Utilitaires (source canonique)
│   │   └── operations/                       # Une classe par opération
│   │       ├── Operation.js, OperationRegistry.js
│   │       └── Multiplication.js, Addition.js, Subtraction.js, Division.js
│   ├── components/         # Composants d'interface
│   │   ├── topBar.js, infoBar.js, dashboard.js, customization.js
│   │   ├── operationSelector.js, operationModeAvailability.js
│   │   └── icons.js, tableSettingsModal.js
│   ├── modes/              # Les cinq modes de jeu
│   │   ├── DiscoveryMode.js, QuizMode.js, ChallengeMode.js
│   │   └── AdventureMode.js, ArcadeMode.js
│   ├── arcade*.js          # Orchestrateur et briques communes des mini-jeux
│   ├── multimiam*.js       # Mini-jeu Pac-Man (moteur, rendu, contrôles…)
│   ├── multisnake.js       # Mini-jeu Snake
│   ├── i18n.js, i18n-store.js                # Internationalisation
│   ├── security-utils.js, error-handlers.js, logger.js
│   ├── accessibility.js, keyboard-navigation.js, touch-support.js, speech.js
│   ├── voice-clips.js      # Lecteur de la voix enregistrée (repli : speech.js)
│   ├── slides.js, mode-orchestrator.js, lazy-loader.js, game-cleanup.js
│   ├── VideoManager.js, responsive-image-loader.js
│   ├── userManager.js, main-helpers.js, utils-es6.js, questionGenerator.js
│   └── main-es6.js, main.js, bootstrap.js, game.js   # Points d'entrée
├── css/                    # Feuilles de style (jetons de design : themes.css)
├── assets/
│   ├── images/             # Sources PNG (avatars, sprites, fonds)
│   ├── generated-images/   # Variantes responsives (généré, hors git)
│   ├── fonts/, sounds/, videos/, icons/, social/
│   └── translations/       # fr.json, en.json, es.json
├── tests/__tests__/        # Tests Jest (jsdom, et bout-en-bout via Puppeteer)
├── tests-esm/              # Tests Jest en modules ES (.mjs)
├── scripts/                # Génération d'assets, i18n, rapports
│   └── voice/              # Voix enregistrée : corpus, génération, écoute, publication
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### Architecture technique

**Modules ES6 modernes** : Le projet utilise une architecture modulaire avec des classes ES6 et des imports/exports natifs.

**Composants réutilisables** : Interface construite avec des composants UI centralisés (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading** : Chargement intelligent des modules à la demande via `lazy-loader.js` pour optimiser les performances initiales.

**Système de stockage unifié** : API centralisée pour la persistance des données utilisateur via LocalStorage avec fallbacks.

**Gestion audio centralisée** : Contrôle du son avec support multilingue et préférences par utilisateur.

**Event Bus** : Communication événementielle découplée entre composants pour une architecture maintenable.

**Navigation par slides** : Système de navigation basé sur des slides numérotés (slide0, slide1, etc.) avec `goToSlide()`.

**Sécurité** : Protection XSS et sanitisation via `security-utils.js` pour toutes les manipulations DOM.

## 🎯 Modes de Jeu Détaillés

### Mode Découverte

Interface d'exploration visuelle des tables de multiplication avec :

- Visualisation interactive des multiplications
- Animations et aide-mémoires
- Glisser-déposer éducatif
- Progression libre par table

### Mode Quiz

Questions à choix multiples avec :

- 10 questions par session
- Progression adaptative selon les réussites
- Pavé numérique virtuel
- Système de streak (série de bonnes réponses)

### Mode Défi

Course contre la montre avec :

- 3 niveaux de difficulté (Débutant, Moyen, Difficile)
- Bonus de temps pour les bonnes réponses
- Système de vies
- Classement des meilleurs scores

### Mode Aventure

Progression narrative avec :

- 10 niveaux thématiques débloquables
- Carte interactive avec progression visuelle
- Histoire immersive avec personnages
- Système d'étoiles et de récompenses

### Mini-jeux Arcade

Chaque mini-jeu propose :

- Choix de difficulté et personnalisation
- Système de vies et score
- Contrôles clavier et tactile
- Classements individuels par utilisateur

## 🔧 Développement

### Workflow de développement

**Ne jamais commiter directement sur main.** Le projet travaille par branches de
fonctionnalité.

**1. Créer une branche**, `feat/` pour une fonctionnalité, `fix/` pour un correctif :

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Développer et vérifier.** Le formatage vient en premier : la CI le refuse
avant même de lancer les tests.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Committer sur la branche**, puis la pousser :

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Ouvrir une pull request** et attendre les analyses : verify, Codacy,
CodeFactor et SonarCloud. On corrige jusqu'au vert avant de fusionner.

**Style de commit** : Messages concis, mode impératif (ex: "Fix arcade init errors", "Refactor cache updater")

**Quality gate** : S'assurer que `npm run lint`, `npm test` et `npm run test:coverage` passent avant chaque commit

### Architecture des composants

**GameMode (classe de base)** : Tous les modes héritent d'une classe commune avec méthodes standardisées.

**GameModeManager** : Orchestration centralisée du lancement et de la gestion des modes.

**Composants UI** : TopBar, InfoBar, Dashboard et Customization fournissent une interface cohérente.

**Lazy Loading** : Les modules sont chargés à la demande pour optimiser les performances initiales.

**Event Bus** : Communication découplée entre composants via le système d'événements.

### Tests

Le projet inclut une suite de tests complète :

- Tests unitaires des modules core
- Tests d'intégration des composants
- Tests des modes de jeu
- Couverture de code automatisée

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Build de production

- **Rollup** : Bundle `js/main-es6.js` en ESM avec code-splitting et sourcemaps
- **Terser** : Minification automatique pour optimisation
- **Post-build** : Copie `css/` et `assets/`, les favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, et réécriture de `dist/index.html` vers le fichier d'entrée hashé (ex: `main-es6-*.js`)
- **Dossier final** : `dist/` prêt à être servi statiquement

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Intégration Continue

**GitHub Actions** : `.github/workflows/ci.yml`, déclenché à chaque push sur
`main` et à chaque pull request.

**`verify`** — la porte qualité, bloquante :

- `npm ci` puis `npm run verify` (ESLint, tests Jest, couverture)
- `npm run format:check` (Prettier)

**`seo-report`** — après `verify` : audit Lighthouse du site en ligne, pour
suivre les métriques SEO dans la durée.

**Analyses externes** branchées sur les pull requests : Codacy, CodeFactor et
SonarCloud. La porte SonarCloud exige les notes A en fiabilité, sécurité et
maintenabilité sur le code nouveau.

**Déploiement** : `./deploy.sh` synchronise le site vers S3 et invalide le cache
CloudFront. Le script régénère au besoin les images responsives, absentes de git.

### PWA (Progressive Web App)

LeapMultix est une PWA complète avec support hors-ligne et possibilité d'installation.

**Service Worker** (`sw.js`) :

- Navigation : Network-first avec fallback hors-ligne vers `offline.html`
- Images : Cache-first pour optimiser les performances
- Traductions : Stale-while-revalidate pour mise à jour en arrière-plan
- JS/CSS : Network-first pour toujours servir la dernière version
- Gestion de version automatique via `cache-updater.js`

**Manifest** (`manifest.json`) :

- Icônes SVG et PNG pour tous les appareils
- Installation possible sur mobile (Add to Home Screen)
- Configuration standalone pour expérience app-like
- Support des thèmes et couleurs

**Tester le mode hors-ligne localement.** Démarrer le serveur, puis ouvrir
`http://localhost:8080` (ou le port affiché) :

```bash
npm run serve
```

À la main : couper le réseau dans les outils de développement (onglet Réseau,
mode hors ligne), puis rafraîchir la page. `offline.html` doit s'afficher.

Automatiquement, avec Puppeteer :

```bash
npm run test:pwa-offline
```

**Scripts de gestion du Service Worker** :

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Standards de qualité

**Outils de qualité du code** :

- **ESLint** : Configuration moderne avec flat config (`eslint.config.js`), support ES2022
- **Prettier** : Formatage automatique du code (`.prettierrc`)
- **Stylelint** : Validation CSS (`.stylelintrc.json`)
- **JSDoc** : Documentation automatique des fonctions avec analyse de couverture

**Règles de code importantes** :

- Supprimer les variables et paramètres non utilisés (`no-unused-vars`)
- Utiliser une gestion d'erreur spécifique (pas de catch vides)
- Éviter `innerHTML` en faveur des fonctions `security-utils.js`
- Maintenir une complexité cognitive < 15 pour les fonctions
- Extraire les fonctions complexes en helpers plus petits

**Sécurité** :

- **Protection XSS** : Utiliser les fonctions de `security-utils.js` :
  - `appendSanitizedHTML()` au lieu de `innerHTML`
  - `createSafeElement()` pour créer des éléments sécurisés
  - `setSafeMessage()` pour le contenu texte
- **Scripts externes** : Attribut `crossorigin="anonymous"` obligatoire
- **Validation des entrées** : Toujours sanitiser les données externes
- **Content Security Policy** : Headers CSP pour restreindre les sources de scripts

**Accessibilité** :

- Conformité WCAG 2.1 AA
- Navigation clavier complète
- Rôles ARIA et labels appropriés
- Contrastes de couleur conformes

**Performance** :

- Lazy loading des modules via `lazy-loader.js`
- Optimisations CSS et assets responsives
- Service Worker pour mise en cache intelligente
- Code splitting et minification en production

## 📱 Compatibilité

### Navigateurs supportés

L'interface s'appuie sur `oklch()` pour les couleurs et sur `:has()` pour les
états contextuels, ce qui fixe le plancher :

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Appareils

- **Desktop** : Contrôles clavier et souris
- **Tablettes** : Interface tactile optimisée
- **Smartphones** : Design responsive adaptatif

### Accessibilité

- Navigation clavier complète (Tab, flèches, Échap)
- Rôles ARIA et labels pour lecteurs d'écran
- Contrastes de couleur conformes
- Support des technologies d'assistance

## 🌍 Localisation

Support multilingue complet :

- **Français** (langue par défaut)
- **Anglais**
- **Espagnol**

### Gestion des traductions

**Fichiers de traduction :** `assets/translations/*.json`

**Format :**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripts de gestion i18n

**`npm run i18n:verify`** - Vérifier la cohérence des clés de traduction

**`npm run i18n:unused`** - Lister les clés de traduction non utilisées

**`npm run i18n:compare`** - Comparer les fichiers de traduction avec fr.json (référence)

Ce script (`scripts/compare-translations.cjs`) assure la synchronisation de tous les fichiers de langue :

**Fonctionnalités :**

- Détection des clés manquantes (présentes dans fr.json mais absentes dans d'autres langues)
- Détection des clés supplémentaires (présentes dans d'autres langues mais pas dans fr.json)
- Identification des valeurs vides (`""`, `null`, `undefined`, `[]`)
- Vérification de cohérence des types (string vs array)
- Aplatissement des structures JSON imbriquées en notation par points (ex: `arcade.multiMemory.title`)
- Génération d'un rapport console détaillé
- Sauvegarde du rapport JSON dans `docs/translations-comparison-report.json`

**Exemple de sortie :**

```
🔍 Analyse comparative des fichiers de traduction

📚 Langue de référence: fr.json
✅ fr.json: 570 clés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de clés: 570
✅ Aucune clé manquante
✅ Aucune clé supplémentaire
✅ Aucune valeur vide

📊 RÉSUMÉ FINAL
  fr.json: 570 clés
  en.json: 570 clés
  es.json: 570 clés

✅ Tous les fichiers de traduction sont parfaitement synchronisés !
```

**Couverture des traductions :**

- Interface utilisateur complète
- Instructions des jeux
- Messages d'erreur et de feedback
- Descriptions et aide contextuelle
- Contenu narratif du mode Aventure
- Labels d'accessibilité et ARIA

## 🔊 Voix enregistrée

Le jeu lit à voix haute les questions, les encouragements et les explications, avec une voix de synthèse enregistrée à l'avance :

- en français, **Lucie**, créée avec ElevenLabs (modèle Eleven v3) ;
- en anglais, **Jane**, créée avec Mistral AI (Voxtral TTS).

Le jeu ne dit qu'un ensemble fini de phrases, environ 7 400 par langue : toutes sont enregistrées à l'avance, et aucune partie n'appelle un service de synthèse. L'espagnol garde pour l'instant la voix de l'appareil.

- **Repli automatique** sur la voix de l'appareil, phrase par phrase : clip absent ou en erreur, lecture refusée par le navigateur, clip qui ne démarre pas en 1,5 s, ou hors ligne sans le clip en cache.
- **Réglages** : le bouton de voix de la barre du haut active ou coupe la lecture ; la case « Voix enregistrée » (Accessibilité et contrôles) choisit entre la voix enregistrée (Lucie ou Jane) et la voix de l'appareil.
- **Hors ligne** : les clips déjà entendus restent en cache (service worker).

### Les clips ne sont pas dans ce dépôt

Les clips vivent dans un dépôt privé et dans un bucket S3 dédié, servi par CloudFront sur `/voice/*`. Un fork ou le développement local garde donc la voix de l'appareil : dans le dépôt, la balise `<meta name="leapmultix-voice-base">` est vide, et seul le déploiement de production y écrit `/voice/`.

Avec les clips sur le poste (dépôt privé cloné à côté du jeu, dans `../leapmultix-voices`), le paramètre `?voix=local` les fait lire par le serveur de développement :

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Générer les clips

La chaîne est scriptée dans `scripts/voice/` et tourne sur le poste du propriétaire, jamais dans la CI publique. Les clés des fournisseurs (ElevenLabs pour le français, Mistral pour l'anglais) restent dans un fichier `.env` hors dépôt, passé par `node --env-file` : aucune clé n'entre dans git. Le skill Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) déroule la procédure pas à pas (portes, accords, reprises) ; le détail est dans [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimer** les phrases restantes et les caractères à payer (Eleven v3 : environ 0,53 crédit par caractère ; Voxtral TTS : 16 $ le million de caractères).
2. **Générer**. Relancer la même commande reprend ce qui manque. Quand les crédits sont épuisés, le script s'arrête proprement (code 3) sans laisser de fichier à moitié écrit. `--max-total-chars` plafonne la dépense cumulée de la version : chaque réponse payée est inscrite dès sa réception dans un registre, qui survit à un arrêt brutal. Chez Mistral, qui ne donne aucun solde lisible, c'est la seule protection.
3. **Contrôler** : chaque phrase a son clip et chaque MP3 est valide. Whisper transcrit ensuite chaque clip en local, et le contrôle signale les nombres mal entendus et les durées anormales. `voice:review` enchaîne Whisper, ce contrôle et la page d'écoute en une commande.
4. **Écouter** sur la page d'écoute (`voice:listen`) les clips signalés et un échantillon de formes féminines (« une fois 7 »), que Whisper ne distingue pas. Chaque clip a une case « à refaire », qui l'ajoute à la liste des clips écartés.
5. **Refaire** les clips écartés (`--redo`) et relancer Whisper, puis comparer chaque clip avant et après sur une seconde page. Un clip encore mal dit après deux ou trois essais reçoit un texte imposé dans `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), par exemple le nombre en toutes lettres.
6. **Publier** les clips, vérifier qu'ils répondent en ligne, puis publier l'index de la langue, d'abord pour les testeurs (`?voix=test`).
7. **Ouvrir** la voix à tous, puis l'activer par défaut. Le coupe-circuit (`voice:publish -- remove`) retire une langue de l'index : le jeu revient à la voix de l'appareil.

```bash
# 1. Estimer (sans frais)
npm run voice:generate -- --lang fr --dry-run
# 2. Générer (payant), plafond cumulé en caractères ; --reserve protège les crédits ElevenLabs
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --reserve 5000 --max-total-chars <plafond>
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang en --max-total-chars <plafond>
# 3. Contrôler : Whisper (installé une fois : voir l'en-tête de whisper_transcribe.py), contrôle, page d'écoute
npm run voice:review -- --lang fr
npm run voice:check -- --lang fr --probe
# 4. Écouter sur la page indiquée (la liste « à refaire » va dans ecartes.txt)
# 5. Refaire (payant), puis comparer avant/après (Whisper ne transcrit que les clips refaits)
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --redo ecartes.txt --max-total-chars <plafond>
npm run voice:review -- --lang fr --compare ecartes.txt
# 6. Publier
npm run voice:publish -- clips --lang fr --bucket <bucket>
npm run voice:check-online -- --lang fr
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience test
# 7. Ouvrir
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience all --default-on
```

### Règle : une phrase dite modifiée se réenregistre avant la mise en prod

Toute phrase dite vient des traductions (`assets/translations/{fr,en,es}.json`) et fait partie du corpus. Changer une phrase parlée fait donc échouer le test du verrou du corpus (`scripts/voice/corpus.lock.json`). Pour une langue qui a sa voix enregistrée, on génère alors les clips des phrases touchées, on les contrôle et on les écoute, puis on les publie **avant** de fusionner. On met enfin le verrou à jour (`npm run voice:corpus:lock`). Sans ces clips, la phrase modifiée se lit avec la voix de l'appareil.

## 📊 Stockage des données

### Données utilisateur

- Profils et préférences
- Progression par mode de jeu
- Scores et statistiques des jeux arcade
- Paramètres de personnalisation

### Fonctionnalités techniques

- Stockage local (localStorage) avec fallbacks
- Isolation des données par utilisateur
- Sauvegarde automatique de la progression
- Migration automatique des données anciennes

## 🐛 Signaler un problème

Les problèmes peuvent être signalés via les issues GitHub. Merci d'inclure :

- Description détaillée du problème
- Étapes pour le reproduire
- Navigateur et version
- Captures d'écran si pertinentes

## 💝 Soutenir le projet

**[☕ Faire un don via PayPal](https://paypal.me/jls)**

## 📄 Licence

Ce projet est sous licence AGPL v3. Voir le fichier `LICENSE` pour plus de détails.

---

_LeapMultix — application éducative libre pour apprendre les quatre opérations_

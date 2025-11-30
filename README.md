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

<!-- Badges (mettre à jour <owner>/<repo> après migration GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Table des matières

- [Description](#description)
- [Fonctionnalités](#-fonctionnalités)
- [Démarrage rapide](#-démarrage-rapide)
- [Architecture](#-architecture)
- [Modes de Jeu Détaillés](#-modes-de-jeu-détaillés)
- [Développement](#-développement)
- [Compatibilité](#-compatibilité)
- [Localisation](#-localisation)
- [Stockage des données](#-stockage-des-données)
- [Signaler un problème](#-signaler-un-problème)
- [Licence](#-licence)

## Description

LeapMultix est une application web éducative interactive moderne destinée aux enfants (8–12 ans) pour maîtriser les 4 opérations arithmétiques : multiplication (×), addition (+), soustraction (−) et division (÷). L'application propose **5 modes de jeu** et **4 mini-jeux d'arcade** dans une interface intuitive, accessible et multilingue.

**Support multi-opérations :** Les modes Quiz et Défi permettent de pratiquer toutes les opérations. Les modes Découverte, Aventure et Arcade se concentrent sur la multiplication.

**Développé par :** Julien LS (contact@jls42.org)

**URL en ligne :** https://leapmultix.jls42.org/

## ✨ Fonctionnalités

### 🎮 Modes de Jeu

- **Mode Découverte** : Exploration visuelle et interactive des tables de multiplication
- **Mode Quiz** ⭐ : Questions à choix multiples avec support des 4 opérations (×, +, −, ÷) et progression adaptative
- **Mode Défi** ⭐ : Course contre la montre avec les 4 opérations (×, +, −, ÷) et différents niveaux de difficulté
- **Mode Aventure** : Progression narrative par niveaux avec carte interactive (multiplication)

⭐ = Support complet des 4 opérations arithmétiques

### 🕹️ Mini-jeux Arcade

- **MultiInvaders** : Space Invaders éducatif - Détruire les mauvaises réponses (multiplication)
- **MultiMiam** : Pac-Man mathématique - Collecter les bonnes réponses (multiplication)
- **MultiMemory** : Jeu de mémoire - Associer multiplications et résultats
- **MultiSnake** : Snake éducatif - Grandir en mangeant les bons nombres (multiplication)

### ➕ Support Multi-Opérations

LeapMultix va au-delà de la simple multiplication en offrant un entraînement complet aux 4 opérations arithmétiques :

| Mode       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Défi       | ✅  | ✅  | ✅  | ✅  |
| Découverte | ✅  | ❌  | ❌  | ❌  |
| Aventure   | ✅  | ❌  | ❌  | ❌  |
| Arcade     | ✅  | ❌  | ❌  | ❌  |

**Note :** Le support des opérations pour les modes Découverte, Aventure et Arcade est prévu dans une version ultérieure.

### 🌍 Fonctionnalités Transversales

- **Multi-utilisateurs** : Gestion de profils individuels avec progression sauvegardée
- **Multilingue** : Support français, anglais et espagnol
- **Personnalisation** : Avatars, thèmes de couleur, arrière-plans
- **Accessibilité** : Navigation clavier, support tactile, conformité WCAG 2.1 AA
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
```

## 🏗️ Architecture

### Structure des fichiers

```
leapmultix/
├── index.html              # Point d'entrée principal
├── js/
│   ├── core/               # Modules centraux ES6
│   │   ├── GameMode.js     # Classe de base des modes
│   │   ├── GameModeManager.js # Gestion des modes de jeu
│   │   ├── storage.js      # API de stockage LocalStorage
│   │   ├── audio.js        # Gestion du son
│   │   ├── utils.js        # Utilitaires génériques (source canonique)
│   │   ├── eventBus.js     # Communication événementielle
│   │   ├── userState.js    # Gestion de session utilisateur
│   │   ├── mainInit.js     # Initialisation DOM-ready
│   │   ├── theme.js        # Système de thèmes
│   │   ├── userUi.js       # Utilitaires d'interface utilisateur
│   │   ├── parental.js     # Contrôles parentaux
│   │   ├── adventure-data.js # Données du mode Aventure
│   │   ├── mult-stats.js   # Statistiques de multiplication
│   │   ├── challenge-stats.js # Statistiques de défi
│   │   └── daily-challenge.js # Gestion défis quotidiens
│   ├── components/         # Composants UI réutilisables
│   │   ├── topBar.js       # Barre de navigation
│   │   ├── infoBar.js      # Barres d'information des jeux
│   │   ├── dashboard.js    # Tableau de bord utilisateur
│   │   └── customization.js # Interface de personnalisation
│   ├── modes/              # Modes de jeu
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Mini-jeux arcade
│   │   ├── arcade.js       # Orchestrateur principal arcade
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Jeu de mémoire (31 KB)
│   │   ├── arcade-multimiam.js # Intégration Multimiam
│   │   ├── arcade-multisnake.js # Intégration Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilitaires partagés
│   │   ├── arcade-message.js, arcade-points.js # Composants UI
│   │   └── arcade-scores.js # Gestion des scores
│   ├── multimiam/          # Jeu Pac-Man (architecture décomposée)
│   │   ├── multimiam.js    # Contrôleur principal
│   │   ├── multimiam-engine.js # Moteur de jeu (15 KB)
│   │   ├── multimiam-renderer.js # Système de rendu (9 KB)
│   │   ├── multimiam-controls.js # Gestion des contrôles (7 KB)
│   │   ├── multimiam-questions.js # Génération de questions (6 KB)
│   │   └── multimiam-ui.js # Éléments d'interface
│   ├── multisnake.js       # Jeu Snake (38 KB)
│   ├── navigation/         # Système de navigation
│   │   ├── slides.js       # Navigation par slides (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Support clavier
│   ├── ui/                 # Interface utilisateur et feedback
│   │   ├── uiUtils.js      # Utilitaires d'interface
│   │   ├── ui-feedback.js  # Mécanismes de feedback
│   │   ├── touch-support.js # Support tactile (7 KB)
│   │   ├── virtual-keyboard.js # Clavier virtuel
│   │   ├── coin-display.js, coin-effects.js # Système de monnaie
│   │   ├── notifications.js # Système de notifications
│   │   └── badges.js       # Système de badges
│   ├── media/              # Gestion des médias
│   │   ├── VideoManager.js # Gestion de lecture vidéo (12 KB)
│   │   └── responsive-image-loader.js # Chargement d'images (9 KB)
│   ├── orchestration/      # Orchestration et chargement
│   │   ├── mode-orchestrator.js # Changement de modes
│   │   ├── lazy-loader.js  # Chargement dynamique (10 KB)
│   │   └── game-cleanup.js # Nettoyage d'état
│   ├── utils/              # Utilitaires
│   │   ├── utils-es6.js    # Agrégateur principal (5 KB)
│   │   ├── main-helpers.js # Helpers de l'application
│   │   ├── helpers.js      # Fonctions helpers legacy
│   │   ├── stats-utils.js  # Utilitaires de statistiques
│   │   ├── difficulty.js   # Gestion de difficulté
│   │   └── questionGenerator.js # Génération de questions
│   ├── storage/            # Stockage et état
│   │   ├── storage.js      # Wrapper de stockage legacy
│   │   └── userManager.js  # Gestion multi-utilisateurs (19 KB)
│   ├── i18n/               # Internationalisation
│   │   ├── i18n.js         # Système i18n
│   │   └── i18n-store.js   # Stockage des traductions
│   ├── security/           # Sécurité et gestion d'erreurs
│   │   ├── security-utils.js # Protection XSS, sanitisation
│   │   ├── error-handlers.js # Gestion globale d'erreurs
│   │   └── logger.js       # Système de logging
│   ├── accessibility/      # Accessibilité
│   │   ├── accessibility.js # Fonctionnalités d'accessibilité
│   │   └── speech.js       # Support de synthèse vocale
│   ├── integration/        # Intégration et analytics
│   │   ├── plausible-init.js # Analytics Plausible
│   │   ├── cache-updater.js # Gestion de cache (10 KB)
│   │   └── imports.js      # Utilitaires d'import
│   ├── main-es6.js         # Point d'entrée ES6
│   ├── main.js             # Orchestrateur principal
│   ├── bootstrap.js        # Configuration des event handlers ES6
│   └── game.js             # Gestion d'état et défis quotidiens
├── css/                    # Styles modulaires
├── assets/                 # Ressources
│   ├── images/             # Images et sprites
│   ├── generated-images/   # Images responsives générées
│   ├── sounds/             # Effets sonores
│   ├── translations/       # Fichiers de traduction (fr, en, es)
│   └── videos/             # Vidéos tutoriels
├── tests/                  # Tests automatisés
│   ├── __tests__/          # Tests unitaires et d'intégration
│   └── tests-esm/          # Tests ESM (.mjs)
├── scripts/                # Scripts de maintenance
│   ├── compare-translations.cjs # Comparaison des traductions
│   └── cleanup-i18n-keys.cjs # Nettoyage des clés i18n
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

- 12 niveaux thématiques débloquables
- Carte interactive avec progression visuelle
- Histoire immersive avec personnages
- Système d'étoiles et de récompenses

### Mini-jeux Arcade

Chaque mini-jeu propose :

- Choix de difficulté et personnalisation
- Système de vies et score
- Contrôles clavier et tactile
- Classements individuels par utilisateur

## 🛠️ Développement

### Workflow de développement

**IMPORTANT : Ne jamais commiter directement sur main**

Le projet utilise un workflow basé sur les branches de fonctionnalité :

1. **Créer une branche** :

   ```bash
   git checkout -b feat/nom-de-la-fonctionnalite
   # ou
   git checkout -b fix/nom-du-bug
   ```

2. **Développer et tester** :

   ```bash
   npm run format:check  # TOUJOURS vérifier le formatage en premier
   npm run format        # Formater si nécessaire
   npm run lint          # Vérifier la qualité du code
   npm run test          # Lancer les tests
   npm run test:coverage # Vérifier la couverture
   ```

3. **Commiter sur la branche** :

   ```bash
   git add .
   git commit -m "feat: description de la fonctionnalité"
   ```

4. **Pousser et créer une Pull Request** :
   ```bash
   git push -u origin feat/nom-de-la-fonctionnalite
   ```

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

**GitHub Actions** : Pipeline automatisé dans `.github/workflows/ci.yml`

Le pipeline CI/CD exécute automatiquement à chaque push et pull request :

**Jobs principaux** :

1. **build-test** : Job principal de validation
   - Installation des dépendances : `npm ci`
   - Vérification du formatage : `npm run format:check`
   - Analyse statique : `npm run lint`
   - Tests unitaires : `npm run test`
   - Audit de sécurité : `npm audit`
   - Génération de l'artefact de couverture

2. **accessibility** : Audit d'accessibilité (non bloquant)
   - Exécute `npm run audit:accessibility`
   - Génère un rapport d'accessibilité WCAG 2.1 AA

3. **test-esm** : Tests des modules ES6
   - Exécute `npm run test:esm` avec Jest VM modules
   - Valide les imports/exports ES6

4. **lighthouse** : Audit de performance (non bloquant)
   - Audit de performance mobile
   - Génération de rapports Lighthouse artefacts
   - Métriques Core Web Vitals

**Badges de qualité** :

- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

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

**Tester le mode hors-ligne localement** :

1. Démarrer le serveur de développement :

   ```bash
   npm run serve
   ```

   Ouvrir `http://localhost:8080` (ou le port affiché)

2. Tester manuellement :
   - Couper le réseau dans les DevTools (Network tab → Offline)
   - Rafraîchir la page → `offline.html` s'affiche

3. Test automatisé (Puppeteer requis) :
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

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

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
✅ fr.json: 335 clés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de clés: 335
✅ Aucune clé manquante
✅ Aucune clé supplémentaire
✅ Aucune valeur vide

📊 RÉSUMÉ FINAL
  fr.json: 335 clés
  en.json: 335 clés
  es.json: 335 clés

✅ Tous les fichiers de traduction sont parfaitement synchronisés !
```

**Couverture des traductions :**

- Interface utilisateur complète
- Instructions des jeux
- Messages d'erreur et de feedback
- Descriptions et aide contextuelle
- Contenu narratif du mode Aventure
- Labels d'accessibilité et ARIA

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

_LeapMultix - Application éducative moderne pour l'apprentissage des tables de multiplication_

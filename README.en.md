<details>
<summary>This document is also available in other languages</summary>

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
![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

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

## Table of Contents

- [Description](#description)
- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Detailed Game Modes](#-detailed-game-modes)
- [Development](#-development)
- [Compatibility](#-compatibility)
- [Localization](#-localization)
- [Recorded Voice](#-recorded-voice)
- [Data Storage](#-data-storage)
- [Report an Issue](#-reporting-an-issue)
- [License](#-license)

## Description

LeapMultix is an interactive educational web application designed for children aged 6 to 12 to master the 4 arithmetic operations: multiplication (×), addition (+), subtraction (−), and division (÷). It features **5 game modes** and **4 arcade mini-games** in an intuitive, accessible, and multilingual interface.

**Multi-operation support:** all five modes support the four operations. The choice is made on the home screen and applies throughout the journey.

**Developed by:** Julien LS (contact@jls42.org)

**Live URL:** https://leapmultix.jls42.org/

## 📸 Overview

### Screens

|                                                                                                           |                                                                                                                          |
| :-------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------: |
|                 !["Who's Playing?" screen: profile selection](docs/media/01-accueil.webp)                 |                        ![Main menu: operation selection and five modes](docs/media/02-menu.webp)                         |
|                **Who's Playing?** — one profile per child, with their avatar and progress.                |                       **The Menu** — the operation is selected here, then the five modes open up.                        |
|             ![Discovery mode: the 4 times table shown in dots](docs/media/03-decouverte.webp)             |                 ![Quiz mode: incorrect answer in red, correct answer in green](docs/media/04-quiz.webp)                  |
|    **Discovery** — each equation is shown in dots, jumps, or counting, along with a tip for the table.    | **Quiz** — the child's choice remains displayed next to the correct answer, and the explanation details the calculation. |
|                 ![Challenge mode: countdown and current streak](docs/media/05-defi.webp)                  |              ![Adventure mode: map of the ten levels, subsequent ones locked](docs/media/06-aventure.webp)               |
| **Challenge** — race against time. On a mistake, the timer pauses long enough to read the correct answer. |                     **Adventure** — ten levels that unlock one after another, in exchange for stars.                     |
|                      ![Arcade menu: the four mini-games](docs/media/07-arcade.webp)                       |                     ![Dashboard: stars per table and statistics](docs/media/08-tableau-de-bord.webp)                     |
|              **Arcade** — four mini-games, with difficulty settings and spaceship selection.              |                            **Dashboard** — stars per table, tables to review, scores by mode.                            |
|           ![Customization: avatars, themes, accessibility](docs/media/09-personnalisation.webp)           |                                                                                                                          |
|             **Customization** — avatar, color theme, text size, high contrast, parental gate.             |                                                                                                                          |

### Arcade Mini-games

Four games that ask the same question — the one displayed above the play area, along with the remaining time and lives — but require a different action each time.

|                                                                                                                        |                                                                                           |
| :--------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: |
| ![MultiInvaders: monsters carrying numbers, a spaceship at the bottom of the screen](docs/media/10-multiinvaders.webp) |  ![MultiMiam: a maze where pellets show possible answers](docs/media/11-multimiam.webp)   |
|            **MultiInvaders** — shoot the wrong answers, spare the correct one: it hides a friend to rescue.            | **MultiMiam** — navigate the maze to collect the correct answer, while avoiding monsters. |
|     ![MultiMemory: a grid of cards, two flipped showing an equation and a number](docs/media/12-multimemory.webp)      |   ![MultiSnake: a snake and numbered apples in a meadow](docs/media/13-multisnake.webp)   |
|                    **MultiMemory** — remember which card holds the answer to the flipped equation.                     |         **MultiSnake** — grow by eating the right numbers, avoid all the others.          |

## ✨ Features

### 🎮 Game Modes

- **Discovery Mode**: Visual and interactive exploration tailored to each operation
- **Quiz Mode**: Multiple-choice questions with support for all 4 operations (×, +, −, ÷) and adaptive progression
- **Challenge Mode**: Race against the clock with all 4 operations (×, +, −, ÷) and different difficulty levels
- **Adventure Mode**: Narrative progression through levels with support for all 4 operations

### 🕹️ Arcade Mini-games

- **MultiInvaders**: Educational Space Invaders - Destroy the wrong answers
- **MultiMiam**: Mathematical Pac-Man - Collect the right answers
- **MultiMemory**: Memory game - Match equations and results
- **MultiSnake**: Educational Snake - Grow by eating the right numbers

### ➕ Multi-Operation Support

LeapMultix offers comprehensive training for all 4 arithmetic operations across **all modes**:

| Mode      | ×   | +   | −   | ÷   |
| --------- | --- | --- | --- | --- |
| Quiz      | ✅  | ✅  | ✅  | ✅  |
| Challenge | ✅  | ✅  | ✅  | ✅  |
| Discovery | ✅  | ✅  | ✅  | ✅  |
| Adventure | ✅  | ✅  | ✅  | ✅  |
| Arcade    | ✅  | ✅  | ✅  | ✅  |

### 🌍 General Features

- **Multi-user**: Management of individual profiles with saved progress
- **Multilingual**: Support for French, English, and Spanish
- **Customization**: Avatars, color themes, backgrounds
- **Accessibility**: Keyboard navigation, touch support, WCAG 2.1 AA compliance
- **Recorded voice**: The game can read questions and encouragements using a pre-recorded synthesized voice, with an automatic fallback to the device's voice. Voices are not stored in this repository: the leapmultix.jls42.org site serves Lucie in French, Sulafat in English and Spanish, and an option of Sulafat and Marie in French, Jane in English (see [Recorded Voice](#-recorded-voice))
- **Mobile responsive**: Interface optimized for tablets and smartphones
- **Progression system**: Scores, badges, daily challenges

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- A modern web browser

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

### Available Scripts

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
npm run voice:generate     # Générer les clips (ElevenLabs, Google ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Architecture

### File Structure

The JavaScript modules are **flat in `js/`**, except for three folders: `core/`, `components/`, and `modes/`. File naming is therefore used for grouping (`arcade-*`, `multimiam-*`, `i18n*`...).

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

### Technical Architecture

**Modern ES6 Modules**: The project uses a modular architecture with ES6 classes and native imports/exports.

**Reusable Components**: Interface built with centralized UI components (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligent on-demand loading of modules via `lazy-loader.js` to optimize initial performance.

**Unified Storage System**: Centralized API for user data persistence via LocalStorage with fallbacks.

**Centralized Audio Management**: Sound control with multilingual support and per-user preferences.

**Event Bus**: Decoupled event-driven communication between components for a maintainable architecture.

**Slide Navigation**: Navigation system based on numbered slides (slide0, slide1, etc.) with `goToSlide()`.

**Security**: XSS protection and sanitization via `security-utils.js` for all DOM manipulations.

## 🎯 Detailed Game Modes

### Discovery Mode

Visual exploration interface for multiplication tables featuring:

- Interactive visualization of multiplications
- Animations and memory aids
- Educational drag-and-drop
- Free progression per table

### Quiz Mode

Multiple-choice questions featuring:

- 10 questions per session
- Adaptive progression based on success rate
- Virtual numeric keypad
- Streak system (series of correct answers)

### Challenge Mode

Race against the clock featuring:

- 3 difficulty levels (Beginner, Medium, Hard)
- Time bonus for correct answers
- Life system
- High score leaderboard

### Adventure Mode

Narrative progression featuring:

- 10 unlockable themed levels
- Interactive map with visual progression
- Immersive storyline with characters
- Star and reward system

### Arcade Mini-games

Each mini-game features:

- Difficulty selection and customization
- Lives and score system
- Keyboard and touch controls
- Individual leaderboards per user

## 🔧 Development

### Development Workflow

**Never commit directly to main.** The project uses feature branches.

**1. Create a branch**, `feat/` for a feature, `fix/` for a bugfix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Develop and verify.** Formatting comes first: the CI rejects it even before running tests.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Commit to the branch**, then push it:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Open a pull request** and wait for the checks: verify, Codacy, CodeFactor, and SonarCloud. Fix issues until everything is green before merging.

**Commit style**: Concise messages, imperative mood (e.g., "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Ensure that `npm run lint`, `npm test`, and `npm run test:coverage` pass before each commit

### Component Architecture

**GameMode (base class)**: All modes inherit from a common class with standardized methods.

**GameModeManager**: Centralized orchestration for launching and managing modes.

**UI Components**: TopBar, InfoBar, Dashboard, and Customization provide a consistent interface.

**Lazy Loading**: Modules are loaded on demand to optimize initial performance.

**Event Bus**: Decoupled communication between components via the event system.

### Tests

The project includes a comprehensive test suite:

- Unit tests for core modules
- Component integration tests
- Game mode tests
- Automated code coverage

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Production Build

- **Rollup**: Bundles `js/main-es6.js` into ESM with code splitting and sourcemaps
- **Terser**: Automatic minification for optimization
- **Post-build**: Copies `css/` and `assets/`, the favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, and rewrites `dist/index.html` to the hashed entry file (e.g., `main-es6-*.js`)
- **Final folder**: `dist/` ready to be served statically

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continuous Integration

**GitHub Actions**: `.github/workflows/ci.yml`, triggered on every push to `main` and on every pull request.

**`verify`** — the quality gate, blocking:

- `npm ci` then `npm run verify` (ESLint, Jest tests, coverage)
- `npm run format:check` (Prettier)

**`seo-report`** — after `verify`: Lighthouse audit of the live website, to track SEO metrics over time.

**External analyses** hooked into pull requests: Codacy, CodeFactor, and SonarCloud. The SonarCloud gate requires 'A' ratings for reliability, security, and maintainability on new code.

**Deployment**: `./deploy.sh` syncs the site to S3 and invalidates the CloudFront cache. The script regenerates responsive images as needed, which are absent from git.

### PWA (Progressive Web App)

LeapMultix is a full PWA with offline support and installability.

**Service Worker** (`sw.js`):

- Navigation: Network-first with offline fallback to `offline.html`
- Images: Cache-first to optimize performance
- Translations: Stale-while-revalidate for background updates
- JS/CSS: Network-first to always serve the latest version
- Automatic version management via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG and PNG icons for all devices
- Installation possible on mobile (Add to Home Screen)
- Standalone configuration for an app-like experience
- Support for themes and colors

**Test offline mode locally.** Start the server, then open `http://localhost:8080` (or the displayed port):

```bash
npm run serve
```

Manually: disable the network in developer tools (Network tab, offline mode), then refresh the page. `offline.html` should be displayed.

Automatically, with Puppeteer:

```bash
npm run test:pwa-offline
```

**Service Worker management scripts**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Quality Standards

**Code quality tools**:

- **ESLint**: Modern configuration with flat config (`eslint.config.js`), ES2022 support
- **Prettier**: Automatic code formatting (`.prettierrc`)
- **Stylelint**: CSS validation (`.stylelintrc.json`)
- **JSDoc**: Automatic function documentation with coverage analysis

**Important code rules**:

- Remove unused variables and parameters (`no-unused-vars`)
- Use specific error handling (no empty catches)
- Avoid `innerHTML` in favor of `security-utils.js` functions
- Maintain cognitive complexity < 15 for functions
- Extract complex functions into smaller helpers

**Security**:

- **XSS Protection**: Use functions from `security-utils.js`:
  - `appendSanitizedHTML()` instead of `innerHTML`
  - `createSafeElement()` to create secure elements
  - `setSafeMessage()` for text content
- **External scripts**: Mandatory `crossorigin="anonymous"` attribute
- **Input validation**: Always sanitize external data
- **Content Security Policy**: CSP headers to restrict script sources

**Accessibility**:

- WCAG 2.1 AA compliance
- Full keyboard navigation
- Appropriate ARIA roles and labels
- Compliant color contrasts

**Performance**:

- Lazy loading of modules via `lazy-loader.js`
- CSS optimizations and responsive assets
- Service Worker for intelligent caching
- Code splitting and minification in production

## 📱 Compatibility

### Supported Browsers

The interface relies on `oklch()` for colors and on `:has()` for
contextual states, setting the minimum requirements:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Devices

- **Desktop**: Keyboard and mouse controls
- **Tablets**: Optimized touch interface
- **Smartphones**: Adaptive responsive design

### Accessibility

- Full keyboard navigation (Tab, arrows, Esc)
- ARIA roles and labels for screen readers
- Compliant color contrasts
- Assistive technology support

## 🌍 Localization

Full multilingual support:

- **French** (default language)
- **English**
- **Spanish**

### Translation Management

**Translation files:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n Management Scripts

**`npm run i18n:verify`** - Check translation key consistency

**`npm run i18n:unused`** - List unused translation keys

**`npm run i18n:compare`** - Compare translation files with fr.json (reference)

This script (`scripts/compare-translations.cjs`) ensures synchronization across all language files:

**Features:**

- Detection of missing keys (present in fr.json but absent in other languages)
- Detection of extra keys (present in other languages but not in fr.json)
- Identification of empty values (`""`, `null`, `undefined`, `[]`)
- Type consistency checking (string vs array)
- Flattening of nested JSON structures into dot notation (e.g., `arcade.multiMemory.title`)
- Generation of a detailed console report
- Saving the JSON report to `docs/translations-comparison-report.json`

**Example output:**

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

**Translation coverage:**

- Complete user interface
- Game instructions
- Error and feedback messages
- Descriptions and contextual help
- Adventure mode narrative content
- Accessibility and ARIA labels

## 🔊 Recorded Voice

The game reads questions, encouragement, and explanations out loud. It speaks only a finite set of phrases, about 7,400 per language: they can therefore be recorded once and for all, meaning no game session calls a synthesis service. Without clips, the game reads using the device voice.

### In this repository: the application, without voices

The code can play pre-recorded clips, and it includes the pipeline that produces them. The clips are not included, nor are the provider keys: a fork or local installation reads using the device voice.

- **Automatic fallback** to the device voice, phrase by phrase: missing or failed clip, playback refused by the browser, clip failing to start within 1.5 s, or offline without the clip in cache.
- **Settings**: the voice button in the top bar enables or mutes playback; the "Recorded voice" checkbox (Accessibility and controls) chooses between the recorded voice and the device voice. It only appears in languages where a voice is published.
- **Offline**: clips that have already been played remain cached (service worker).
- **Where the game looks for clips**: in the `<meta name="leapmultix-voice-base">` tag, which is empty in the repository. Only the production deployment writes `/voice/` there.

With your own clips on your machine (built with the pipeline below, stored alongside the game in `../leapmultix-voices`), the `?voix=local` parameter makes the development server play them:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### On leapmultix.jls42.org: hosted voices

The site hosted by the author serves recorded synthetic voices:

- in French, **Lucie**, created with ElevenLabs (Eleven v3 model);
- in British English and European Spanish, **Sulafat**, created with Google Cloud Text-to-Speech (Chirp 3 HD voice);
- at the player's choice, **Sulafat** in French, to keep the same voice across all three languages;
- also at the player's choice, **Marie** in French and **Jane** in English, created with Mistral AI (Voxtral TTS).

Clips reside in a private repository and a dedicated S3 bucket, served by CloudFront at `/voice/*`. They are generated once: during gameplay, nothing is sent to these services. In the settings, the "Voice" menu offers the available voices for the language when multiple are available, and the credit mentions the service behind the voice being heard.

### Generating Clips

The pipeline is scripted in `scripts/voice/` and runs on the owner's machine, never in public CI. Provider keys (ElevenLabs for Lucie, Google Cloud Text-to-Speech for Sulafat, Mistral for Marie and Jane) stay in a `.env` file outside the repository, passed via `node --env-file`: no key ever enters git. The Claude Code skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) walks through the procedure step by step (gates, agreements, resumes); full details are in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimate** remaining phrases and billable characters (Eleven v3: about 0.53 credits per character; Chirp 3 HD: $30 per million characters, first million each month free; Voxtral TTS: $16 per million).
2. **Generate**. Re-running the same command resumes what is missing. When credits run out, the script exits cleanly (exit code 3) without leaving half-written files. `--max-total-chars` caps the cumulative spend for the release: each paid response is recorded in a ledger upon receipt, which survives sudden termination. For Google and Mistral, which do not provide a readable balance, this is the only protection.
3. **Check**: each phrase has its clip and each MP3 is valid. Whisper then transcribes each clip locally, and the check flags misheard numbers and abnormal durations. `voice:review` chains Whisper, this check, and the listening page into a single command.
4. **Listen** on the listening page (`voice:listen`) to flagged clips and a sample of feminine forms ("une fois 7"), which Whisper cannot distinguish. Each clip has a "redo" checkbox, which adds it to the list of rejected clips.
5. **Redo** rejected clips (`--redo`) and run Whisper again, then compare each clip before and after on a second page. A clip still mispronounced after two or three attempts receives an overridden text in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), such as spelling out the number in words.
6. **Publish** the clips, verify they respond online, then publish the language index, first for testers (`?voix=test`).
7. **Open** the voice to everyone, then enable it by default. The kill switch (`voice:publish -- remove`) removes a language from the index: the game falls back to the device voice.

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

### Rule: a modified spoken phrase must be re-recorded before production release

Every spoken phrase comes from translations (`assets/translations/{fr,en,es}.json`) and is part of the corpus. Changing a spoken phrase therefore causes the corpus lock test (`scripts/voice/corpus.lock.json`) to fail. For a language that has a recorded voice, the clips for affected phrases are generated, verified, and listened to, then published **before** merging. Finally, the lock is updated (`npm run voice:corpus:lock`). Without these clips, the modified phrase is read using the device voice.

## 📊 Data Storage

### User Data

- Profiles and preferences
- Progress per game mode
- Arcade game scores and statistics
- Customization settings

### Technical Features

- Local storage (localStorage) with fallbacks
- Data isolation per user
- Automatic progress saving
- Automatic migration of legacy data

## 🐛 Reporting an Issue

Issues can be reported via GitHub issues. Please include:

- Detailed description of the problem
- Steps to reproduce
- Browser and version
- Screenshots if relevant

## 💝 Supporting the Project

**[☕ Donate via PayPal](https://paypal.me/jls)**

## 📄 License

This project is licensed under the AGPL v3. See the `LICENSE` file for more details.

---

_LeapMultix — free and open-source educational application for learning the four operations_

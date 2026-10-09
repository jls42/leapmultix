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
- [Report an Issue](#-report-an-issue)
- [License](#-license)

## Description

LeapMultix is an interactive educational web application designed for children aged 6 to 12 to master the 4 arithmetic operations: multiplication (×), addition (+), subtraction (−), and division (÷). It offers **6 game modes** and **4 arcade mini-games** through an intuitive, accessible, multilingual interface.

**Multi-operation support:** all modes support all four operations. The operation is selected on the home screen and applies throughout the entire experience.

**Developed by:** Julien LS (contact@jls42.org)

**Live URL:** https://leapmultix.jls42.org/

## 📸 Overview

### Screens

|                                                                                                                                  |                                                                                                                              |
| :------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|                            ![“Who is playing?” screen: profile selection](docs/media/01-accueil.webp)                            |                         ![Main menu: selecting the operation and game mode](docs/media/02-menu.webp)                         |
|                           **Who is playing?** — one profile per child, with their avatar and progress.                           |                                **The menu** — choose the operation here, then the game mode.                                 |
|                       ![Discovery Mode: the 4 times table shown with dots](docs/media/03-decouverte.webp)                        |                   ![Quiz Mode: incorrect answer in red, correct answer in green](docs/media/04-quiz.webp)                    |
|           **Discovery** — each equation is illustrated with dots, jumps, or counting, along with a tip for the table.            | **Quiz** — the child's choice remains displayed next to the correct answer, and the explanation breaks down the calculation. |
|                             ![Challenge Mode: countdown and current streak](docs/media/05-defi.webp)                             |              ![Adventure Mode: map of the ten levels, with upcoming levels locked](docs/media/06-aventure.webp)              |
|       **Challenge** — a race against the clock. After an error, the timer freezes long enough to read the correct answer.        |                       **Adventure** — ten levels that unlock one after another in exchange for stars.                        |
|                        ![Chrono Mode: a subtraction race, timer, and progress](docs/media/14-chrono.webp)                        |                                ![Arcade menu: the four mini-games](docs/media/07-arcade.webp)                                |
| **Chrono** — ten correct answers against the clock using the selected operation; missed calculations are added to a review list. |                          **Arcade** — four mini-games, with difficulty settings and ship selection.                          |
|      ![Dashboard: games, records, and answers for each mode, broken down by operation](docs/media/08-tableau-de-bord.webp)       |                    ![Customization: avatars, themes, accessibility](docs/media/09-personnalisation.webp)                     |
|      **Dashboard** — games and records for each mode, broken down by operation; stars and multiplication tables to review.       |                   **Customization** — avatars unlocked with coins, color theme, text size, high contrast.                    |

### Arcade Mini-Games

Four games that ask the same question—the one displayed above the game area,
along with the remaining time and lives—but require a different action each
time.

|                                                                                                                           |                                                                                            |
| :-----------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: |
|  ![MultiInvaders: monsters carrying numbers, with a ship at the bottom of the screen](docs/media/10-multiinvaders.webp)   |   ![MultiMiam: a maze where dots display possible answers](docs/media/11-multimiam.webp)   |
|        **MultiInvaders** — shoot the incorrect answers and spare the correct one: it is hiding a friend to rescue.        | **MultiMiam** — navigate the maze to catch the correct result while avoiding the monsters. |
| ![MultiMemory: a grid of cards, with two flipped over showing a calculation and a number](docs/media/12-multimemory.webp) |   ![MultiSnake: a snake and numbered apples in a meadow](docs/media/13-multisnake.webp)    |
|                    **MultiMemory** — remember which card holds the result of the revealed calculation.                    |       **MultiSnake** — grow by eating the correct numbers and avoid all the others.        |

## ✨ Features

### 🎮 Game Modes

- **Discovery Mode**: Visual and interactive exploration tailored to each operation
- **Quiz Mode**: Multiple-choice questions supporting all 4 operations (×, +, −, ÷) and adaptive progression
- **Challenge Mode**: Race against the clock with all 4 operations (×, +, −, ÷) and different difficulty levels
- **Adventure Mode**: Level-based narrative progression supporting all 4 operations
- **Chrono Mode**: Get 10 correct answers against a timer that never stops to beat your best time, with all 4 operations (×, +, −, ÷)

### 🕹️ Arcade Mini-Games

- **MultiInvaders**: Educational Space Invaders — Destroy the incorrect answers
- **MultiMiam**: Mathematical Pac-Man — Collect the correct answers
- **MultiMemory**: Memory game — Match operations with their results
- **MultiSnake**: Educational Snake — Grow by eating the correct numbers

### ➕ Multi-Operation Support

LeapMultix provides comprehensive practice with all 4 arithmetic operations in **every mode**:

| Mode      | ×   | +   | −   | ÷   |
| --------- | --- | --- | --- | --- |
| Quiz      | ✅  | ✅  | ✅  | ✅  |
| Challenge | ✅  | ✅  | ✅  | ✅  |
| Discovery | ✅  | ✅  | ✅  | ✅  |
| Adventure | ✅  | ✅  | ✅  | ✅  |
| Chrono    | ✅  | ✅  | ✅  | ✅  |
| Arcade    | ✅  | ✅  | ✅  | ✅  |

### 🌍 Cross-Cutting Features

- **Multiple users**: one profile per child, with their progress; on a classroom computer, first names are sorted, a filter appears from 10 players onward, deleted profiles remain in the trash for 30 days, and player data can be saved to a file
- **Multilingual**: French, English, and Spanish support
- **Customization**: avatars (choose the first one freely, unlock the others with coins earned by playing, 50 coins each), color themes, backgrounds
- **Accessibility**: full keyboard navigation, touch support, pausing in Arcade, text sizing, and high contrast; checked with axe-core, with no WCAG Level A or AA violations on the tested screens
- **Recorded voice**: the game can read questions and encouragement aloud using a pre-recorded synthetic voice, with automatic fallback to the device voice. The voices are not included in this repository: the leapmultix.jls42.org website uses Lucie in French, Sulafat in English and Spanish, and offers a choice between Sulafat and Marie in French and Jane in English (see [Recorded Voice](#-recorded-voice))
- **Mobile responsive**: Interface optimized for tablets and smartphones
- **Progression system**: dashboard for each profile (games, records, and tables to review, broken down by operation), badges, daily challenges, coins (in Chrono, Adventure, Challenge, and the Daily Challenge)

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or later)
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
npm run test:pwa-offline # Hors ligne de bout en bout (Puppeteer, serveur intégré)

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

The JavaScript modules are **flat within `js/`**, except for three folders:
`core/`, `components/`, and `modes/`. The filename therefore indicates the
grouping (`arcade-*`, `multimiam-*`, `i18n*`…).

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
│   │   ├── audio.js, theme.js                # Son, thèmes
│   │   ├── eventBus.js, mainInit.js          # Événements, amorçage DOM
│   │   ├── adventure-data.js                 # Niveaux du mode Aventure
│   │   ├── mult-stats.js, challenge-stats.js, operation-stats.js
│   │   ├── chrono-stats.js, chrono-questions.js, chrono-input.js   # Mode Chrono
│   │   ├── mode-stats.js, adventure-progress.js   # Compteurs du tableau de bord
│   │   ├── profile-operation-stats.js        # Statistiques par calcul, rangées dans le profil
│   │   ├── players-trash.js, players-backup.js   # Corbeille et sauvegarde des joueurs
│   │   ├── avatar-shop.js                    # Avatars débloqués avec les pièces (prix, achat)
│   │   ├── daily-challenge.js, tablePreferences.js, stats-migration.js
│   │   ├── userUi.js, utils.js               # Utilitaires (source canonique)
│   │   └── operations/                       # Une classe par opération
│   │       ├── Operation.js, OperationRegistry.js
│   │       └── Multiplication.js, Addition.js, Subtraction.js, Division.js
│   ├── components/         # Composants d'interface
│   │   ├── topBar.js, infoBar.js, dashboard.js, customization.js
│   │   ├── operationSelector.js, operationModeAvailability.js
│   │   ├── playerTools.js  # « Qui joue ? » sur un poste de classe : filtre, corbeille, sauvegarde
│   │   ├── loadErrorNotice.js   # Avis d'un jeu qui n'a pas pu s'ouvrir (hors ligne…)
│   │   ├── confirm-dialog.js, avatarShop.js   # Fenêtre de confirmation du jeu, boutique d'avatars
│   │   └── icons.js, tableSettingsModal.js
│   ├── modes/              # Les six modes de jeu
│   │   ├── DiscoveryMode.js, QuizMode.js, ChallengeMode.js
│   │   └── AdventureMode.js, ChronoMode.js, ArcadeMode.js
│   ├── arcade*.js          # Orchestrateur et briques communes des mini-jeux (temps et pause :
│   │                       #   arcade-time.js ; plein écran : arcade-fullscreen.js)
│   ├── multimiam*.js       # Mini-jeu Pac-Man (moteur, rendu, contrôles…)
│   ├── multisnake.js       # Mini-jeu Snake
│   ├── i18n.js, i18n-store.js                # Internationalisation
│   ├── security-utils.js, error-handlers.js, logger.js
│   ├── accessibility.js, keyboard-navigation.js, touch-support.js, speech.js
│   ├── voice-clips.js      # Lecteur de la voix enregistrée (repli : speech.js)
│   ├── slides.js, mode-orchestrator.js, lazy-loader.js, game-cleanup.js
│   ├── game-exit.js        # Une seule règle pour quitter une partie en cours
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
│   ├── precache-list.mjs   # Liste de préchargement hors ligne de sw.js (npm run precache:update)
│   └── voice/              # Voix enregistrée : corpus, génération, écoute, publication
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### Technical Architecture

**Modern ES6 modules**: The project uses a modular architecture with ES6 classes and native imports/exports.

**Reusable components**: Interface built with centralized UI components (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligent on-demand module loading via `lazy-loader.js` to optimize initial performance.

**Unified storage system**: Centralized API for persisting user data through LocalStorage with fallbacks.

**Centralized audio management**: Sound control with multilingual support and per-user preferences.

**Event Bus**: Decoupled event-driven communication between components for a maintainable architecture.

**Slide-based navigation**: Navigation system based on numbered slides (slide0, slide1, etc.) with `goToSlide()`.

**Security**: XSS protection and sanitization via `security-utils.js` for all DOM manipulations.

## 🎯 Detailed Game Modes

### Discovery Mode

A visual exploration interface tailored to each operation, featuring:

- Interactive visualization of multiplications
- Animations and memory aids
- Educational drag and drop
- Free progression by table

### Quiz Mode

Multiple-choice questions featuring:

- 10 questions per session
- Adaptive progression based on correct answers
- Virtual numeric keypad
- Streak system (series of correct answers)

### Challenge Mode

A race against the clock featuring:

- 3 difficulty levels (Beginner, Medium, Hard)
- Time bonuses for correct answers
- Life system
- High-score leaderboard

### Adventure Mode

Narrative progression featuring:

- 10 unlockable themed levels
- Interactive map with visual progress
- Immersive story with characters
- Star and reward system

### Chrono Mode

Ten correct answers as quickly as possible against a timer that never stops:

- All four operations: multiplication tables (configured in Table Settings), and
  all addition tables (7 + k), subtraction tables ((7 + k) − 7), and division tables ((7 × k) ÷ 7)
- Answer using multiple choice or the numeric keypad, with either mouse clicks or the keyboard
- Best times, average time, and a chart of recent games, by operation
- “My calculations to review”: one list per operation, reviewed in both directions (6 × 7 and 7 × 6,
  15 − 7 and 15 − 8)

### Dashboard

What the child has actually played, profile by profile:

- Adventure stars and multiplication tables to review (the last 20 answers for each table)
- Questions and correct answers in Quiz, Challenge, Adventure, and Chrono
- Games and records for every mode and mini-game, including abandoned games, broken down by operation
  as soon as the child practices more than one

### Arcade Mini-Games

Each mini-game offers:

- Three difficulty levels across all four operations
- Life and scoring systems
- Mouse, keyboard, and touch controls, described on the game's information page
- Pause: button next to the timer or the P key; the game also pauses when the tab is
  hidden and never resumes on its own
- MultiMemory: an optional game with no time limit
- A board that fits the available space (taller than it is wide on a phone in portrait mode) and full-screen mode,
  on computers and phones alike, including when the phone is rotated (except on iPhone, whose browser
  does not support it)
- Best scores for each player; “Reset” explains everything it deletes

## 🔧 Development

### Development Workflow

**Never commit directly to main.** The project uses feature
branches.

**1. Create a branch**, `feat/` for a feature, `fix/` for a bug fix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Develop and verify.** Formatting comes first: CI rejects it
before even running the tests.

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

**4. Open a pull request** and wait for the checks: verify, Codacy,
CodeFactor, and SonarCloud. Fix issues until everything is green before merging.

**Commit style**: Concise messages in the imperative mood (e.g., "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Ensure that `npm run lint`, `npm test`, and `npm run test:coverage` pass before every commit

### Component Architecture

**GameMode (base class)**: All modes inherit from a common class with standardized methods.

**GameModeManager**: Centralized orchestration for launching and managing modes.

**UI components**: TopBar, InfoBar, Dashboard, and Customization provide a consistent interface.

**Lazy Loading**: Modules are loaded on demand to optimize initial performance.

**Event Bus**: Decoupled communication between components through the event system.

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
- **Post-build**: Copies `css/` and `assets/`, the favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), and `sw.js`, and rewrites `dist/index.html` to point to the hashed entry file (e.g., `main-es6-*.js`)
- **Final directory**: `dist/` ready to be served statically

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continuous Integration

**GitHub Actions**: `.github/workflows/ci.yml`, triggered on every push to
`main` and on every pull request.

**`verify`** — the blocking quality gate:

- `npm ci` then `npm run verify` (ESLint, Jest tests, coverage)
- `npm run format:check` (Prettier)

**`seo-report`** — after `verify`: Lighthouse audit of the live site, to
track SEO metrics over time.

**External analyses** integrated into pull requests: Codacy, CodeFactor, and
SonarCloud. The SonarCloud gate requires A ratings for reliability, security, and
maintainability on new code.

**Deployment**: `./deploy.sh` synchronizes the site to S3 and invalidates the
CloudFront cache. The script regenerates responsive images when needed, as they are not stored in git.

### PWA (Progressive Web App)

LeapMultix is a complete PWA with offline support and installation capabilities.

**Service Worker** (`sw.js`):

- Installation: precaching of everything required by the game, with the list generated from the code
  by `scripts/precache-list.mjs` (`npm run precache:update`, verified by tests): after
  the first visit, all 6 modes and 4 Arcade games start offline
- Navigation: Network-first; when offline, the cached game page (`offline.html` only
  for a page that has never been cached)
- Images: Cache-first; when offline, another size of the same sprite or another background for the same avatar
- Translations: Stale-while-revalidate for background updates
- JS/CSS: Network-first to always serve the latest version, with an offline cache
- Sounds and fonts: Cache-first, with byte ranges served (Safari audio player)
- Automatic version management via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG and PNG icons for all devices
- Installation available on mobile (Add to Home Screen)
- Standalone configuration for an app-like experience
- Theme and color support

**Testing offline mode locally.** Start the server, then open
`http://localhost:8080` (or the displayed port):

```bash
npm run serve
```

Manually: leave the page open long enough for the service worker to register the game, stop
the server (or disable the device's network), then refresh the page. The game should
appear, and every mode should start.

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

**Important coding rules**:

- Remove unused variables and parameters (`no-unused-vars`)
- Use specific error handling (no empty catch blocks)
- Avoid `innerHTML` in favor of `security-utils.js` functions
- Maintain cognitive complexity < 15 for functions
- Extract complex functions into smaller helpers

**Security**:

- **XSS protection**: Use the functions from `security-utils.js`:
  - `appendSanitizedHTML()` instead of `innerHTML`
  - `createSafeElement()` to create secure elements
  - `setSafeMessage()` for text content
- **External scripts**: `crossorigin="anonymous"` attribute required
- **Input validation**: Always sanitize external data
- **Content Security Policy**: CSP headers to restrict script sources

**Accessibility**:

- WCAG 2.1 Level AA target, checked with axe-core: no Level A or AA violations, nor any
  best-practice violations
- Full keyboard navigation
- ARIA roles and accessible names
- Contrast checked by axe-core

**Performance**:

- Lazy loading of modules via `lazy-loader.js`
- CSS optimizations and responsive assets
- Service Worker for intelligent caching
- Code splitting and minification in production

## 📱 Compatibility

### Supported Browsers

The interface relies on `oklch()` for colors and on `:has()` for
contextual states, which sets the minimum versions:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Devices

- **Desktop**: Keyboard and mouse controls
- **Tablets**: Optimized touch interface
- **Smartphones**: Adaptive responsive design

### Accessibility

- Full keyboard navigation: Tab, arrow keys in answer grids and MultiMemory cards,
  Enter, Escape; “Skip to the game modes” link at the top of the home page
- A single rule for leaving a game: “Give up,” Escape, or a button in the top bar
  asks the same question, and the game continues if the child declines
- Screen readers: each answer is linked to its question, one level 1 heading per screen, and
  messages are announced
- The page supports pinch-to-zoom (outside Arcade games); text size, high contrast,
  reduced motion, and a reading font derived from Andika, designed for beginning
  readers
- Arcade: pause (button, P key, or hidden tab); optional untimed MultiMemory mode
- Checked with axe-core (WCAG 2.0 through 2.2, Levels A and AA, and best practices): no
  violations across 41 desktop-width screens and 40 phone-width screens (390 px), including
  Night theme and high contrast

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

This script (`scripts/compare-translations.cjs`) keeps all language files synchronized:

**Features:**

- Detection of missing keys (present in fr.json but absent from other languages)
- Detection of extra keys (present in other languages but not in fr.json)
- Identification of empty values (`""`, `null`, `undefined`, `[]`)
- Type consistency checks (string vs array)
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

The game reads questions, encouragement, and explanations aloud. It uses only a finite set of phrases, approximately 7,400 per language: they can therefore be recorded once and for all, so no gameplay session needs to call a synthesis service. Without clips, the game uses the device voice.

### In This Repository: The Application, Without the Voices

The code can play prerecorded clips and includes the pipeline that produces them. The clips are not included, nor are the provider keys: a fork or local installation uses the device voice.

- **Automatic fallback** to the device voice, phrase by phrase: missing or failed clip, playback denied by the browser, clip that does not start within 1.5 seconds, or offline without the clip cached.
- **Settings**: the voice button in the top bar enables or disables speech; the “Recorded voice” checkbox (Accessibility and controls) selects between the recorded voice and the device voice. It appears only for languages in which a voice has been published.
- **Offline**: clips that have already been heard remain cached (service worker).
- **Where the game looks for clips**: in the `<meta name="leapmultix-voice-base">` tag, which is empty in the repository. Only the production deployment writes `/voice/` there.

With your own local clips (created using the pipeline below and stored alongside the game in `../leapmultix-voices`), the `?voix=local` parameter makes the development server play them:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### On leapmultix.jls42.org: Hosted Voices

The site provided by the author serves recorded synthetic voices:

- in French, **Lucie**, created with ElevenLabs (Eleven v3 model);
- in British English and Spanish from Spain, **Sulafat**, created with Google Cloud Text-to-Speech (Chirp 3 HD voice);
- at the player's option, **Sulafat** in French, to keep the same voice across all three languages;
- also at the player's option, **Marie** in French and **Jane** in English, created with Mistral AI (Voxtral TTS).

The clips are stored in a private repository and a dedicated S3 bucket, served by CloudFront at `/voice/*`. They are generated once: during gameplay, nothing is sent to these services. In the settings, the “Voice” menu offers the voices available for the language when there are several, and the attribution names the service behind the voice being heard.

### Generating the Clips

The pipeline is scripted in `scripts/voice/` and runs on the owner's machine, never in public CI. The provider keys (ElevenLabs for Lucie, Google Cloud Text-to-Speech for Sulafat, Mistral for Marie and Jane) remain in a `.env` file outside the repository, passed through `node --env-file`: no key enters git. The Claude Code skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) walks through the procedure step by step (gates, approvals, resumptions); details are available in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimate** the remaining phrases and billable characters (Eleven v3: approximately 0.53 credits per character; Chirp 3 HD: $30 per million characters, with the first million each month free; Voxtral TTS: $16 per million).
2. **Generate**. Running the same command again resumes what remains. When credits run out, the script stops cleanly (code 3) without leaving a partially written file. `--max-total-chars` caps the version's cumulative spending: each paid response is recorded in a ledger as soon as it is received, and the ledger survives an abrupt shutdown. With Google and Mistral, which provide no readable balance, this is the only safeguard.
3. **Verify**: every phrase has its clip and every MP3 is valid. Whisper then transcribes each clip locally, and the check flags misheard numbers and abnormal durations. `voice:review` runs Whisper, this check, and the listening page in a single command.
4. **Listen** on the listening page (`voice:listen`) to flagged clips and a sample of feminine forms (“one times 7”), which Whisper cannot distinguish. Each clip has a “redo” checkbox that adds it to the list of rejected clips.
5. **Redo** the rejected clips (`--redo`) and rerun Whisper, then compare each clip before and after on a second page. A clip still pronounced incorrectly after two or three attempts receives forced text in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), such as the number written out in full.
6. **Publish** the clips, verify that they are available online, then publish the language index, initially for testers (`?voix=test`).
7. **Release** the voice to everyone, then enable it by default. The kill switch (`voice:publish -- remove`) removes a language from the index: the game falls back to the device voice.

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

### Rule: A Modified Spoken Phrase Must Be Rerecorded Before Production

Every spoken phrase comes from the translations (`assets/translations/{fr,en,es}.json`) and is part of the corpus. Changing a spoken phrase therefore causes the corpus lock test (`scripts/voice/corpus.lock.json`) to fail. For a language with a recorded voice, the clips for the affected phrases must then be generated, checked, listened to, and published **before** merging. Finally, the lock is updated (`npm run voice:corpus:lock`). Without these clips, the modified phrase is read using the device voice.

## 📊 Data Storage

### User Data

- Profiles and preferences
- Progress by game mode
- Arcade game scores and statistics
- Customization settings

### Technical Features

- Local storage (localStorage) with fallbacks; the browser is asked not to delete it
  automatically (`navigator.storage.persist()`)
- Recycle bin for deleted players: all their data is retained for 30 days, with restoration available from
  “Who's playing?”
- Player backup to a JSON file, restorable on this device or another (an existing player
  is never overwritten)
- Game data stored by profile, including per-calculation statistics: on a shared device, one player's mistakes do not influence another player's questions
- Automatic progress saving
- Automatic migration of legacy data

## 🐛 Report an Issue

Issues can be reported through GitHub issues. Please include:

- A detailed description of the issue
- Steps to reproduce it
- Browser and version
- Screenshots, if relevant

## 💝 Support the Project

**[☕ Donate via PayPal](https://paypal.me/jls)**

## 📄 License

This project is licensed under the AGPL v3. See the `LICENSE` file for more details.

---

_LeapMultix — free educational application for learning the four arithmetic operations_

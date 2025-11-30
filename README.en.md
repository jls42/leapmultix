<details>
<summary>This document is also available in other languages</summary>

- [Français](./README.md)
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

<!-- Badges (update <owner>/<repo> after GitHub migration) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Table of Contents

- [Description](#description)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Detailed Game Modes](#-detailed-game-modes)
- [Development](#-development)
- [Compatibility](#-compatibility)
- [Localization](#-localization)
- [Data Storage](#-data-storage)
- [Reporting Issues](#-reporting-issues)
- [License](#-license)

## Description

LeapMultix is a modern interactive educational web application designed for children (ages 8–12) to master the 4 arithmetic operations: multiplication (×), addition (+), subtraction (−), and division (÷). The application offers **5 game modes** and **4 arcade mini-games** in an intuitive, accessible, and multilingual interface.

**Multi-operation support:** Quiz and Challenge modes allow practicing all operations. Discovery, Adventure, and Arcade modes focus on multiplication but are designed to support all operations.

**Developed by:** Julien LS (contact@jls42.org)

**Online URL:** https://leapmultix.jls42.org/

## ✨ Features

### 🎮 Game Modes

- **Discovery Mode**: Visual and interactive exploration adapted to each operation
- **Quiz Mode**: Multiple choice questions with support for all 4 operations (×, +, −, ÷) and adaptive progression
- **Challenge Mode**: Race against time with all 4 operations (×, +, −, ÷) and different difficulty levels
- **Adventure Mode**: Narrative progression by levels with support for all 4 operations

### 🕹️ Arcade Mini-games

- **MultiInvaders**: Educational Space Invaders - Destroy the wrong answers
- **MultiMiam**: Mathematical Pac-Man - Collect the correct answers
- **MultiMemory**: Memory game - Match operations and results
- **MultiSnake**: Educational Snake - Grow by eating the correct numbers

### ➕ Multi-Operations Support

LeapMultix offers complete training for the 4 arithmetic operations in **all modes**:

| Mode      | ×   | +   | −   | ÷   |
| --------- | --- | --- | --- | --- |
| Quiz      | ✅  | ✅  | ✅  | ✅  |
| Challenge | ✅  | ✅  | ✅  | ✅  |
| Discovery | ✅  | ✅  | ✅  | ✅  |
| Adventure | ✅  | ✅  | ✅  | ✅  |
| Arcade    | ✅  | ✅  | ✅  | ✅  |

### 🌍 Cross-Cutting Features

- **Multi-user**: Management of individual profiles with saved progression
- **Multilingual**: Support for French, English, and Spanish
- **Customization**: Avatars, color themes, backgrounds
- **Accessibility**: Keyboard navigation, touch support, WCAG 2.1 AA compliance
- **Mobile responsive**: Interface optimized for tablets and smartphones
- **Progression system**: Scores, badges, daily challenges

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- A modern web browser

### Installation

```bash
# Clone the project
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Install dependencies
npm install

# Start the development server (option 1)
npm run serve
# The application will be accessible at http://localhost:8080 (or next available port)

# Or with Python (option 2)
python3 -m http.server 8000
# The application will be accessible at http://localhost:8000
```

### Available Scripts

```bash
# Development
npm run serve          # Local server (http://localhost:8080)
npm run lint           # Code verification with ESLint
npm run lint:fix       # Automatic fix of ESLint issues
npm run format:check   # Check code formatting (ALWAYS before commit)
npm run format         # Format code with Prettier
npm run verify         # Quality gate: lint + test + coverage

# Tests
npm run test           # Run all tests (CJS)
npm run test:watch     # Tests in watch mode
npm run test:coverage  # Tests with coverage report
npm run test:core      # Tests for core modules only
npm run test:integration # Integration tests
npm run test:storage   # Storage system tests
npm run test:esm       # ESM tests (tests-esm/ folders, Jest vm-modules)
npm run test:verbose   # Tests with detailed output
npm run test:pwa-offline # PWA offline test (requires Puppeteer), after `npm run serve`

# Analysis and Maintenance
npm run analyze:jsdoc  # Documentation analysis
npm run improve:jsdoc  # Automatic JSDoc improvement
npm run audit:mobile   # Mobile responsiveness tests
npm run audit:accessibility # Accessibility tests
npm run dead-code      # Unused code detection
npm run analyze:globals # Global variables analysis
npm run analyze:dependencies # Dependency usage analysis
npm run verify:cleanup # Combined analysis (dead code + globals)

# Asset Management
npm run assets:generate    # Generate responsive images
npm run assets:backgrounds # Convert backgrounds to WebP
npm run assets:analyze     # Responsive asset analysis
npm run assets:diff        # Asset comparison

# Internationalization
npm run i18n:verify    # Verify translation key consistency
npm run i18n:unused    # List unused translation keys
npm run i18n:compare   # Compare translations (en/es) with fr.json (reference)

# Build & Delivery
npm run build          # Production build (Rollup) + postbuild (complete dist/)
npm run serve:dist     # Serve dist/ on http://localhost:5000 (or available port)

# PWA and Service Worker
npm run sw:disable     # Disable service worker
npm run sw:fix         # Fix service worker issues
```

## 🏗️ Architecture

### File Structure

```
leapmultix/
├── index.html              # Main entry point
├── js/
│   ├── core/               # ES6 core modules
│   │   ├── GameMode.js     # Base class for modes
│   │   ├── GameModeManager.js # Game mode management
│   │   ├── storage.js      # LocalStorage API
│   │   ├── audio.js        # Sound management
│   │   ├── utils.js        # Generic utilities (canonical source)
│   │   ├── eventBus.js     # Event communication
│   │   ├── userState.js    # User session management
│   │   ├── mainInit.js     # DOM-ready initialization
│   │   ├── theme.js        # Theme system
│   │   ├── userUi.js       # User interface utilities
│   │   ├── parental.js     # Parental controls
│   │   ├── adventure-data.js # Adventure mode data
│   │   ├── mult-stats.js   # Multiplication statistics
│   │   ├── challenge-stats.js # Challenge statistics
│   │   └── daily-challenge.js # Daily challenge management
│   ├── components/         # Reusable UI components
│   │   ├── topBar.js       # Navigation bar
│   │   ├── infoBar.js      # Game info bars
│   │   ├── dashboard.js    # User dashboard
│   │   └── customization.js # Customization interface
│   ├── modes/              # Game modes
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Arcade mini-games
│   │   ├── arcade.js       # Main arcade orchestrator
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Memory game (31 KB)
│   │   ├── arcade-multimiam.js # MultiMiam integration
│   │   ├── arcade-multisnake.js # Snake integration
│   │   ├── arcade-common.js, arcade-utils.js # Shared utilities
│   │   ├── arcade-message.js, arcade-points.js # UI components
│   │   └── arcade-scores.js # Score management
│   ├── multimiam/          # Pac-Man game (decomposed architecture)
│   │   ├── multimiam.js    # Main controller
│   │   ├── multimiam-engine.js # Game engine (15 KB)
│   │   ├── multimiam-renderer.js # Rendering system (9 KB)
│   │   ├── multimiam-controls.js # Controls management (7 KB)
│   │   ├── multimiam-questions.js # Question generation (6 KB)
│   │   └── multimiam-ui.js # Interface elements
│   ├── multisnake.js       # Snake game (38 KB)
│   ├── navigation/         # Navigation system
│   │   ├── slides.js       # Slide-based navigation (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Keyboard support
│   ├── ui/                 # User interface and feedback
│   │   ├── uiUtils.js      # Interface utilities
│   │   ├── ui-feedback.js  # Feedback mechanisms
│   │   ├── touch-support.js # Touch support (7 KB)
│   │   ├── virtual-keyboard.js # Virtual keyboard
│   │   ├── coin-display.js, coin-effects.js # Currency system
│   │   ├── notifications.js # Notification system
│   │   └── badges.js       # Badge system
│   ├── media/              # Media management
│   │   ├── VideoManager.js # Video playback management (12 KB)
│   │   └── responsive-image-loader.js # Image loading (9 KB)
│   ├── orchestration/      # Orchestration and loading
│   │   ├── mode-orchestrator.js # Mode switching
│   │   ├── lazy-loader.js  # Dynamic loading (10 KB)
│   │   └── game-cleanup.js # State cleanup
│   ├── utils/              # Utilities
│   │   ├── utils-es6.js    # Main aggregator (5 KB)
│   │   ├── main-helpers.js # Application helpers
│   │   ├── helpers.js      # Legacy helper functions
│   │   ├── stats-utils.js  # Statistics utilities
│   │   ├── difficulty.js   # Difficulty management
│   │   └── questionGenerator.js # Question generation
│   ├── storage/            # Storage and state
│   │   ├── storage.js      # Legacy storage wrapper
│   │   └── userManager.js  # Multi-user management (19 KB)
│   ├── i18n/               # Internationalization
│   │   ├── i18n.js         # i18n system
│   │   └── i18n-store.js   # Translation storage
│   ├── security/           # Security and error handling
│   │   ├── security-utils.js # XSS protection, sanitization
│   │   ├── error-handlers.js # Global error handling
│   │   └── logger.js       # Logging system
│   ├── accessibility/      # Accessibility
│   │   ├── accessibility.js # Accessibility features
│   │   └── speech.js       # Speech synthesis support
│   ├── integration/        # Integration and analytics
│   │   ├── plausible-init.js # Plausible analytics
│   │   ├── cache-updater.js # Cache management (10 KB)
│   │   └── imports.js      # Import utilities
│   ├── main-es6.js         # ES6 entry point
│   ├── main.js             # Main orchestrator
│   ├── bootstrap.js        # ES6 event handlers setup
│   └── game.js             # State management and daily challenges
├── css/                    # Modular styles
├── assets/                 # Resources
│   ├── images/             # Images and sprites
│   ├── generated-images/   # Generated responsive images
│   ├── sounds/             # Sound effects
│   ├── translations/       # Translation files (fr, en, es)
│   └── videos/             # Tutorial videos
├── tests/                  # Automated tests
│   ├── __tests__/          # Unit and integration tests
│   └── tests-esm/          # ESM tests (.mjs)
├── scripts/                # Maintenance scripts
│   ├── compare-translations.cjs # Translation comparison
│   └── cleanup-i18n-keys.cjs # i18n key cleanup
└── dist/                   # Production build (generated)
```

### Technical Architecture

**Modern ES6 Modules**: The project uses a modular architecture with ES6 classes and native imports/exports.

**Reusable Components**: Interface built with centralized UI components (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligent on-demand module loading via `lazy-loader.js` to optimize initial performance.

**Unified Storage System**: Centralized API for user data persistence via LocalStorage with fallbacks.

**Centralized Audio Management**: Sound control with multilingual support and per-user preferences.

**Event Bus**: Decoupled event-driven communication between components for a maintainable architecture.

**Slide Navigation**: Navigation system based on numbered slides (slide0, slide1, etc.) with `goToSlide()`.

**Security**: XSS protection and sanitization via `security-utils.js` for all DOM manipulations.

## 🎯 Detailed Game Modes

### Discovery Mode

Visual exploration interface for multiplication tables with:

- Interactive visualization of multiplications
- Animations and memory aids
- Educational drag-and-drop
- Free progression per table

### Quiz Mode

Multiple choice questions with:

- 10 questions per session
- Adaptive progression based on success
- Virtual numeric keypad
- Streak system (series of correct answers)

### Challenge Mode

Race against time with:

- 3 difficulty levels (Beginner, Medium, Hard)
- Time bonus for correct answers
- Lives system
- Leaderboard of best scores

### Adventure Mode

Narrative progression with:

- 12 unlockable thematic levels
- Interactive map with visual progression
- Immersive story with characters
- Star system and rewards

### Arcade Mini-games

Each mini-game offers:

- Choice of difficulty and customization
- Lives system and score
- Keyboard and touch controls
- Individual leaderboards per user

## 🛠️ Development

### Development Workflow

**IMPORTANT: Never commit directly to main**

The project uses a workflow based on feature branches:

1.  **Create a branch**:

    ```bash
    git checkout -b feat/feature-name
    # or
    git checkout -b fix/bug-name
    ```

2.  **Develop and test**:

    ```bash
    npm run format:check  # ALWAYS check formatting first
    npm run format        # Format if necessary
    npm run lint          # Check code quality
    npm run test          # Run tests
    npm run test:coverage # Check coverage
    ```

3.  **Commit to the branch**:

    ```bash
    git add .
    git commit -m "feat: description of the feature"
    ```

4.  **Push and create a Pull Request**:
    ```bash
    git push -u origin feat/feature-name
    ```

**Commit style**: Concise, imperative mood (e.g., "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Ensure `npm run lint`, `npm test`, and `npm run test:coverage` pass before each commit

### Component Architecture

**GameMode (base class)**: All modes inherit from a common class with standardized methods.

**GameModeManager**: Centralized orchestration of mode launching and management.

**UI Components**: TopBar, InfoBar, Dashboard, and Customization provide a consistent interface.

**Lazy Loading**: Modules are loaded on demand to optimize initial performance.

**Event Bus**: Decoupled communication between components via the event system.

### Tests

The project includes a comprehensive test suite:

- Unit tests for core modules
- Integration tests for components
- Game mode tests
- Automated code coverage

```bash
npm test              # All tests (CJS)
npm test:core         # Core module tests
npm test:integration  # Integration tests
npm test:coverage     # Coverage report
npm run test:esm      # ESM tests (e.g. components/dashboard) via vm-modules
```

### Production Build

- **Rollup**: Bundles `js/main-es6.js` into ESM with code-splitting and sourcemaps
- **Terser**: Automatic minification for optimization
- **Post-build**: Copies `css/` and `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, and rewrites `dist/index.html` to the hashed entry file (e.g., `main-es6-*.js`)
- **Final folder**: `dist/` ready to be served statically

```bash
npm run build      # generates dist/
npm run serve:dist # serves dist/ (port 5000)
```

### Continuous Integration

**GitHub Actions**: Automated pipeline in `.github/workflows/ci.yml`

The CI/CD pipeline automatically runs on every push and pull request:

**Main Jobs**:

1.  **build-test**: Main validation job
    - Install dependencies: `npm ci`
    - Check formatting: `npm run format:check`
    - Static analysis: `npm run lint`
    - Unit tests: `npm run test`
    - Security audit: `npm audit`
    - Coverage artifact generation

2.  **accessibility**: Accessibility audit (non-blocking)
    - Runs `npm run audit:accessibility`
    - Generates WCAG 2.1 AA accessibility report

3.  **test-esm**: ES6 module tests
    - Runs `npm run test:esm` with Jest VM modules
    - Validates ES6 imports/exports

4.  **lighthouse**: Performance audit (non-blocking)
    - Mobile performance audit
    - Generates Lighthouse report artifacts
    - Core Web Vitals metrics

**Quality Badges**:

- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix is a full PWA with offline support and installation capability.

**Service Worker** (`sw.js`):

- Navigation: Network-first with offline fallback to `offline.html`
- Images: Cache-first to optimize performance
- Translations: Stale-while-revalidate for background updates
- JS/CSS: Network-first to always serve the latest version
- Automatic version management via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG and PNG icons for all devices
- Installation possible on mobile (Add to Home Screen)
- Standalone configuration for app-like experience
- Support for themes and colors

**Testing offline mode locally**:

1.  Start the development server:

    ```bash
    npm run serve
    ```

    Open `http://localhost:8080` (or the displayed port)

2.  Test manually:
    - Cut the network in DevTools (Network tab → Offline)
    - Refresh the page → `offline.html` is displayed

3.  Automated test (Puppeteer required):
    ```bash
    npm run test:pwa-offline
    ```

**Service Worker Management Scripts**:

```bash
npm run sw:disable  # Disable service worker
npm run sw:fix      # Fix cache issues
```

### Quality Standards

**Code Quality Tools**:

- **ESLint**: Modern configuration with flat config (`eslint.config.js`), ES2022 support
- **Prettier**: Automatic code formatting (`.prettierrc`)
- **Stylelint**: CSS validation (`.stylelintrc.json`)
- **JSDoc**: Automatic function documentation with coverage analysis

**Important Code Rules**:

- Remove unused variables and parameters (`no-unused-vars`)
- Use specific error handling (no empty catches)
- Avoid `innerHTML` in favor of `security-utils.js` functions
- Keep cognitive complexity < 15 for functions
- Extract complex functions into smaller helpers

**Security**:

- **XSS Protection**: Use functions from `security-utils.js`:
  - `appendSanitizedHTML()` instead of `innerHTML`
  - `createSafeElement()` to create safe elements
  - `setSafeMessage()` for text content
- **External Scripts**: `crossorigin="anonymous"` attribute mandatory
- **Input Validation**: Always sanitize external data
- **Content Security Policy**: CSP headers to restrict script sources

**Accessibility**:

- WCAG 2.1 AA compliance
- Full keyboard navigation
- ARIA roles and appropriate labels
- Compliant color contrast

**Performance**:

- Lazy loading of modules via `lazy-loader.js`
- CSS and responsive asset optimizations
- Service Worker for intelligent caching
- Code splitting and minification in production

## 📱 Compatibility

### Supported Browsers

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Devices

- **Desktop**: Keyboard and mouse controls
- **Tablets**: Optimized touch interface
- **Smartphones**: Adaptive responsive design

### Accessibility

- Full keyboard navigation (Tab, Arrows, Escape)
- ARIA roles and labels for screen readers
- Compliant color contrast
- Assistive technology support

## 🌍 Localization

Full multilingual support:

- **French** (default language)
- **English**
- **Spanish**

### Translation Management

**Translation Files:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Start",
  "quiz_correct": "Well done!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n Management Scripts

**`npm run i18n:verify`** - Verify translation key consistency

**`npm run i18n:unused`** - List unused translation keys

**`npm run i18n:compare`** - Compare translation files with fr.json (reference)

This script (`scripts/compare-translations.cjs`) ensures synchronization of all language files:

**Features:**

- Detection of missing keys (present in fr.json but absent in other languages)
- Detection of extra keys (present in other languages but not in fr.json)
- Identification of empty values (`""`, `null`, `undefined`, `[]`)
- Type consistency check (string vs array)
- Flattening of nested JSON structures to dot notation (e.g., `arcade.multiMemory.title`)
- Generation of detailed console report
- Saving of JSON report to `docs/translations-comparison-report.json`

**Output Example:**

```
🔍 Comparative analysis of translation files

📚 Reference language: fr.json
✅ fr.json: 335 keys

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analysis of en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total keys: 335
✅ No missing keys
✅ No extra keys
✅ No empty values

📊 FINAL SUMMARY
  fr.json: 335 keys
  en.json: 335 keys
  es.json: 335 keys

✅ All translation files are perfectly synchronized!
```

**Translation Coverage:**

- Complete user interface
- Game instructions
- Error and feedback messages
- Descriptions and contextual help
- Adventure mode narrative content
- Accessibility and ARIA labels

## 📊 Data Storage

### User Data

- Profiles and preferences
- Progression by game mode
- Arcade game scores and statistics
- Customization settings

### Technical Features

- Local storage (localStorage) with fallbacks
- Data isolation per user
- Automatic progression saving
- Automatic migration of old data

## 🐛 Reporting Issues

Issues can be reported via GitHub issues. Please include:

- Detailed description of the problem
- Steps to reproduce
- Browser and version
- Screenshots if relevant

## 💝 Support the Project

**[☕ Donate via PayPal](https://paypal.me/jls)**

## 📄 License

This project is licensed under the AGPL v3 license. See the `LICENSE` file for more details.

---

_LeapMultix - Modern educational application for learning multiplication tables_

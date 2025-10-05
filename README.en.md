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
- [Reporting an Issue](#-reporting-an-issue)
- [License](#-license)

## Description

LeapMultix is a modern, interactive, and educational web application designed for children (ages 8-12) to master multiplication tables. The application offers **4 classic game modes** and **4 arcade mini-games** in an intuitive, accessible, and multilingual interface.

**Developed by:** Julien LS (contact@jls42.org)

**Online URL:** https://leapmultix.jls42.org/

## ✨ Features

### 🎮 Game Modes

- **Discovery Mode**: Visual and interactive exploration of multiplication tables.
- **Quiz Mode**: Multiple-choice questions with adaptive progression.
- **Challenge Mode**: A race against time with different difficulty levels.
- **Adventure Mode**: Narrative-driven progression through levels with an interactive map.

### 🕹️ Arcade Mini-Games

- **MultiInvaders**: An educational Space Invaders - Destroy the wrong answers.
- **MultiMiam**: A mathematical Pac-Man - Collect the correct answers.
- **MultiMemory**: A memory game - Match multiplications with their results.
- **MultiSnake**: An educational Snake - Grow by eating the correct numbers.

### 🌍 Cross-cutting Features

- **Multi-user**: Management of individual profiles with saved progress.
- **Multilingual**: Support for French, English, and Spanish.
- **Customization**: Avatars, color themes, backgrounds.
- **Accessibility**: Keyboard navigation, touch support, WCAG 2.1 AA compliance.
- **Mobile responsive**: Optimized interface for tablets and smartphones.
- **Progression System**: Scores, badges, daily challenges.

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
# The application will be accessible at http://localhost:8080 (or the next available port)

# Or with Python (option 2)
python3 -m http.server 8000
# The application will be accessible at http://localhost:8000
```

### Available Scripts

```bash
# Development
npm run serve          # Local server
npm run lint           # Code linting
npm run test           # Run all tests (CJS)
npm run test:coverage  # Tests with coverage
npm run test:esm       # ESM tests (tests-esm/ folders, Jest vm-modules)
npm run test:pwa-offline # PWA offline test (requires Puppeteer), after `npm run serve`

# Analysis and maintenance
npm run analyze:jsdoc  # Documentation analysis
npm run improve:jsdoc  # Automatic JSDoc improvement
npm run audit:mobile   # Mobile responsiveness tests
npm run audit:accessibility # Accessibility tests
npm run dead-code      # Dead code detection
npm run analyze:globals # Global variables analysis
npm run analyze:dependencies # Dependency usage analysis
npm run assets:analyze # Responsive assets analysis
npm run assets:diff    # Asset comparison
npm run i18n:compare   # Compare translations (en/es) with fr.json (reference)

# Build & delivery
npm run build          # Production build (Rollup) + postbuild (full dist/)
npm run serve:dist     # Serve dist/ on http://localhost:5000 (or available port)
```

## 🏗️ Architecture

### File Structure

```
leapmultix/
├── index.html              # Main entry point
├── js/
│   ├── core/               # Core ES6 modules
│   │   ├── GameMode.js     # Base class for game modes
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # Storage API
│   │   ├── audio.js        # Sound management
│   │   └── utils.js        # Generic utilities
│   ├── components/         # Reusable UI components
│   │   ├── topBar.js       # Navigation bar
│   │   ├── infoBar.js      # Game information bars
│   │   ├── dashboard.js    # User dashboard
│   │   └── customization.js # Customization interface
│   ├── modes/              # Refactored game modes
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # Arcade mini-games
│   ├── multimiam-*.js      # Pac-Man game modules
│   ├── multisnake.js       # Educational Snake game
│   ├── main-es6.js         # ES6 entry point
│   ├── main.js             # Main orchestrator
│   ├── lazy-loader.js      # On-demand loading (lazy loading)
│   └── utils-es6.js        # ES6 utilities
├── css/                    # Modular styles
├── assets/                 # Resources
│   ├── images/             # Images and sprites
│   ├── sounds/             # Sound effects
│   ├── translations/       # Translation files
│   └── videos/             # Tutorial videos
└── tests/                  # Automated tests
```

### Technical Architecture

**Modern ES6 Modules**: The project uses a modular architecture with ES6 classes and native imports/exports.

**Reusable Components**: The interface is built with centralized UI components (TopBar, InfoBar, Dashboard).

**Lazy Loading**: Smart loading of modules on demand to optimize performance.

**Unified Storage System**: Centralized API for user data persistence.

**Centralized Audio Management**: Sound control with multilingual support and per-user preferences.

## 🎯 Detailed Game Modes

### Discovery Mode

Visual exploration interface for multiplication tables with:

- Interactive visualization of multiplications
- Animations and memory aids
- Educational drag-and-drop
- Free progression by table

### Quiz Mode

Multiple-choice questions with:

- 10 questions per session
- Adaptive progression based on success
- Virtual numeric keypad
- Streak system (series of correct answers)

### Challenge Mode

A race against time with:

- 3 difficulty levels (Beginner, Medium, Hard)
- Time bonus for correct answers
- Life system
- High score leaderboard

### Adventure Mode

Narrative progression with:

- 12 unlockable themed levels
- Interactive map with visual progression
- Immersive story with characters
- Star and reward system

### Arcade Mini-Games

Each mini-game offers:

- Choice of difficulty and customization
- Life and score system
- Keyboard and touch controls
- Individual leaderboards per user

## 🛠️ Development

### Component Architecture

**GameMode (base class)**: All modes inherit from a common class with standardized methods.

**GameModeManager**: Centralized orchestration for launching and managing modes.

**UI Components**: TopBar, InfoBar, Dashboard, and Customization provide a consistent interface.

**Lazy Loading**: Modules are loaded on demand to optimize initial performance.

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
npm run test:esm      # ESM tests (e.g., components/dashboard) via vm-modules
```

### Production Build

- **Rollup**: Bundles `js/main-es6.js` into ESM with code-splitting and sourcemaps.
- **Terser**: Automatic minification for optimization.
- **Post-build**: Copies `css/` and `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, and rewrites `dist/index.html` to point to the hashed entry file (e.g., `main-es6-*.js`).
- **Final folder**: `dist/` ready to be served statically.

```bash
npm run build      # generates dist/
npm run serve:dist # serves dist/ (port 5000)
```

### Continuous Integration

**GitHub Actions**: `.github/workflows/ci.yml`

- **build-test**: `npm ci`, `lint`, `test`, `audit` + coverage artifact.
- **accessibility**: `npm run audit:accessibility` (non-blocking).
- **test-esm**: `npm run test:esm` with VM modules.
- **lighthouse**: Mobile performance audit (non-blocking), reports as artifacts.

### PWA (offline and installation)

- **Service Worker**: Network-first strategy with offline fallback; images with cache-first strategy; translations with stale-while-revalidate; JS/CSS with network-first.
- **Manifest**: SVG/PNG icons; installation possible on mobile.
- **Test offline locally**:
  1. `npm run serve` and open `http://localhost:8080` (or the displayed port).
  2. Disconnect the network and refresh the page → `offline.html` will be displayed.
  3. Automated test (requires Puppeteer): `npm run test:pwa-offline`.

### Quality Standards

- **ESLint**: JavaScript code validation.
- **Prettier**: Automatic formatting.
- **JSDoc**: Automatic function documentation.
- **Accessibility**: WCAG 2.1 AA compliance.
- **Performance**: Lazy loading, CSS optimizations.

## 📱 Compatibility

### Supported Browsers

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Devices

- **Desktop**: Keyboard and mouse controls.
- **Tablets**: Optimized touch interface.
- **Smartphones**: Adaptive responsive design.

### Accessibility

- Full keyboard navigation (Tab, arrows, Esc).
- ARIA roles and labels for screen readers.
- Compliant color contrasts.
- Support for assistive technologies.

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
  "menu_start": "Start",
  "quiz_correct": "Well done!",
  "arcade_invasion_title": "MultiInvaders"
}
```

**Management scripts:**

```bash
npm run i18n:verify  # Check for missing/inconsistent keys
npm run i18n:unused  # List unused keys
npm run i18n:compare # Compare en.json/es.json with fr.json (reference)
```

**Translation Coverage:**

- Full user interface
- Game instructions
- Error and feedback messages
- Descriptions and contextual help

## 📊 Data Storage

### User Data

- Profiles and preferences
- Progress by game mode
- Arcade game scores and statistics
- Customization settings

### Technical Features

- Local storage (localStorage) with fallbacks.
- User data isolation.
- Automatic progress saving.
- Automatic migration of old data.

## 🐛 Reporting an Issue

Issues can be reported via GitHub issues. Please include:

- Detailed description of the problem.
- Steps to reproduce it.
- Browser and version.
- Screenshots if relevant.

## 💝 Support the Project

**[☕ Donate via PayPal](https://paypal.me/jls)**

## 📄 License

This project is licensed under the AGPL v3 License. See the `LICENSE` file for more details.

---

_LeapMultix - A modern educational application for learning multiplication tables._

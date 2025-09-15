# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Run all commands from the root directory:

```bash
npm install          # Setup dependencies
npm run serve        # Start development server (static preview)
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:core   # Run core functionality tests only
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues automatically
npm run format      # Format code with Prettier
npm run verify      # Run lint + test + coverage (quality gate)
```

### Testing Commands

- `npm run test:integration` - Integration tests
- `npm run test:storage` - Storage-specific tests
- `npm run test:esm` - ES module tests (.mjs files)
- `npm run test:verbose` - Detailed test output

### Analysis and Maintenance Commands

- `npm run analyze:dependencies` - Check dependency usage
- `npm run verify:dead-code` - Detect unused code
- `npm run improved:dead-code` - Enhanced dead code analysis
- `npm run analyze:globals` - Analyze global variables
- `npm run css:analyze` - CSS analysis and optimization tools
- `npm run css:optimize` - Optimize CSS assets (use before adding large media)
- `npm run i18n:verify` - Verify internationalization keys
- `npm run analyze:assets` - Asset analysis and optimization
- `npm run verify:cleanup` - Run dead code and globals analysis

### Code Quality and Formatting

**CRITICAL WORKFLOW**: Before ANY commit, ALWAYS run these commands in order:

1. `npm run format:check` - Check if code formatting is correct
2. If formatting issues found: `npm run format` - Format code with Prettier (auto-fix)
3. `npm run lint` - Run ESLint to check code quality
4. `npm run lint:fix` - Fix ESLint issues automatically (if needed)

**MANDATORY COMMANDS**:

- `npm run format:check` - **ALWAYS run first** to check formatting
- `npm run format` - Format code with Prettier (auto-fix) - **ONLY if format:check fails**
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

**Note**: CI/CD will fail if code is not properly formatted. The format:check command will show exactly which files need formatting. Never commit without running format:check first.

#### Coding Standards and Best Practices

**JavaScript/TypeScript Rules:**

- Remove unused variables and parameters (no-unused-vars)
- Use specific error handling instead of empty catch blocks
- Avoid innerHTML in favor of security-utils functions
- Keep cognitive complexity under 15 for functions
- Extract complex functions into smaller helper methods
- Use `security-utils.js` functions for safe DOM manipulation:
  - `appendSanitizedHTML()` instead of innerHTML
  - `createSafeElement()` for safe element creation
  - `setSafeMessage()` for text content

**CSS Rules:**

- Use modern color function notation: `rgb(255 255 255 / 0.9)` instead of `rgba(255, 255, 255, 0.9)`
- Prefer `rgb` over `rgba` alias notation

**Security Guidelines:**

- Always sanitize HTML content using security-utils
- Add crossorigin="anonymous" to external scripts
- Consider integrity hashes for external resources (update when versions change)
- Never use innerHTML with user-controlled data
- Validate all external inputs

**External Script Integrity Guidelines:**

- **Use integrity hashes for:** Static libraries (React, jQuery, etc.) with fixed versions
- **Skip integrity hashes for:** Dynamic analytics/tracking scripts (Plausible, Google Analytics)
- **Rationale:** Analytics scripts update frequently; integrity hashes break functionality when providers update
- **Alternative security:** Use Content Security Policy (CSP) headers to restrict script sources

### Static Code Analysis - Handling False Positives

**Codacy/SonarCloud** use **ESLint** to analyze JavaScript/TypeScript. Use ESLint syntax to ignore false positives:

#### 1. Ignore a **single line**

```js
// eslint-disable-next-line no-console -- Debug output for development
console.log('debug');

// eslint-disable-line no-console -- Temporary logging
console.log('debug');
```

#### 2. Ignore a **code block**

```js
/* eslint-disable no-console */
console.log('debug');
console.log('another log');
/* eslint-enable no-console */
```

#### 3. Ignore **entire file**

Add at the top of the file:

```js
/* eslint-disable */
```

#### Common False Positives to Challenge

**HTML/XSS Warnings:**

- When using `appendSanitizedHTML()` from security-utils: Already sanitized, safe to use
- When using `getTranslation()` output: Internal content, not user input
- When clearing with `innerHTML = ''`: Safe operation, no injection risk

**Security/Integrity Warnings:**

- Analytics scripts without integrity: Auto-updating scripts would break with integrity hashes
- Script loading from trusted CDNs: Document why integrity is omitted

**Examples of proper suppression:**

**JavaScript (Codacy/SonarCloud):**

```js
// Multiple rules for comprehensive coverage
// eslint-disable-next-line security/detect-object-injection, sonarjs/no-unsafe-string-usage -- False positive: getTranslation returns safe internal content
const html = getTranslation('key');

// eslint-disable-next-line security/detect-unsafe-regex, sonarjs/no-html-injection -- Safe: using appendSanitizedHTML for proper sanitization
appendSanitizedHTML(element, html);

// eslint-disable-next-line no-restricted-properties -- Safe: clearing with empty string
element.innerHTML = '';
```

**HTML (SonarCloud):**

```html
<!-- Document reasoning in comment block -->
<!--
Suppressing static analysis warnings:
sonarjs:S5725 - External scripts without integrity is acceptable for analytics services that auto-update
-->
<!-- eslint-disable-next-line sonarjs/no-script-without-integrity -- Analytics script auto-updates, integrity would break functionality -->
<script src="https://example.com/analytics.js"></script>
```

#### Best Practices for Suppression

1. **Always add justification** with `--` explaining why it's safe
2. **Be specific** about the rule being disabled when possible
3. **Challenge warnings** before disabling - ensure they're actually false positives
4. **Use narrowest scope** - prefer single line over blocks over files
5. **Document patterns** in this file for team consistency

#### Important Notes

- ESLint comments are recognized by Codacy/SonarCloud
- Some "Code patterns" (Codacy UI-specific) may not respect inline annotations - disable them in **Repository → Code patterns**
- Ensure tools use your ESLint config (`.eslintrc.js`, `eslint.config.js`) to respect your inline exclusions
- Regular review of suppressions during code review to prevent abuse

## Architecture Overview

### Core Structure

- **`index.html`** - Main entry point with slide-based navigation system
- **`js/main.js`** - Primary application bootstrap and user management
- **`js/bootstrap.js`** - ES module event handler setup, replaces inline onclick handlers
- **`js/game.js`** - Core game state management and daily challenges

### Module Organization

#### Core System (`js/core/`)

- `GameMode.js` / `GameModeManager.js` - Abstract game mode system
- `userState.js` - User session and preference management
- `storage.js` - LocalStorage abstraction layer
- `audio.js` - Audio manager with volume controls
- `eventBus.js` - Event-driven communication between components
- `mainInit.js` - DOM-ready initialization logic
- `navigation.js` - Slide navigation system
- `parental.js` - Parental control features

#### Game Modes (`js/modes/`)

- `QuizMode.js` - Basic multiplication quiz
- `ChallengeMode.js` - Timed challenges with scoring
- `DiscoveryMode.js` - Learning-focused exploration mode
- `AdventureMode.js` - Story-driven progression
- `ArcadeMode.js` - Mini-games collection (Multimiam, Multisnake, etc.)

#### UI Components (`js/components/`)

- `topBar.js` - Navigation and user controls
- `dashboard.js` - Progress tracking and statistics
- `customization.js` - Avatar, theme, and personalization
- `infoBar.js` - Game status information display

#### Specialized Modules

- **Arcade Games**: `arcade-*.js`, `multimiam*.js`, `multisnake.js` - Individual mini-games
- **Utilities**: `utils-es6.js` (main utils), `core/utils.js` (canonical source)
- **I18n**: `i18n.js`, `i18n-store.js` - Internationalization system
- **Storage**: `userManager.js` - Multi-user profile management

### Module Import Patterns

**Preferred imports:**

```javascript
import { utils } from './utils-es6.js'; // Main utilities aggregator
import Storage from './core/storage.js'; // Core services
import { TopBar } from './components/topBar.js'; // UI components
```

**Deprecated patterns (avoid):**

- `./utils.js` - Use `utils-es6.js` or `core/utils.js` instead
- Direct mode imports - Use lazy loading via `lazy-loader.js`
- Legacy uiHandlers, domUtils, helpers modules

### Key Conventions

- **ES Modules**: All code uses `import/export` syntax (type: "module")
- **Naming**: camelCase for functions/variables, PascalCase for classes
- **Event System**: Components communicate via `eventBus` rather than direct coupling
- **Lazy Loading**: Game modes are dynamically loaded to improve initial page load
- **Slide Navigation**: UI uses numbered slides (slide0, slide1, etc.) with `goToSlide()`

### Game State Management

The application maintains state through:

- **`gameState`** object (in `game.js`) - Current session state
- **`UserState`** class - Persistent user preferences and progress
- **LocalStorage** - Via `Storage` abstraction for data persistence
- **Event Bus** - For reactive state updates across components

### Testing Architecture

- **Framework**: Jest with jsdom environment
- **Configuration**: `jest.config.cjs`
- **Location**: `tests/__tests__/` with `*.test.js` naming
- **Coverage**: Reports to `coverage/` directory, includes all `js/**/*.js` files
- **ESM Tests**: Separate `tests-esm/` directory for `.mjs` files

### Build and Quality Tools

- **ESLint**: Modern flat config (`eslint.config.js`) with ES2022 support
- **Prettier**: Code formatting (`.prettierrc`)
- **Stylelint**: CSS linting (`.stylelintrc.json`)
- **Jest**: Testing with jsdom for DOM simulation
- **No bundler**: Direct ES module loading in browsers

### Commit and Quality Guidelines

- **Commit style**: Concise, imperative mood (e.g., "Fix arcade init errors", "Refactor cache updater")
- **Quality gate**: Ensure `npm run lint`, `npm test`, and `npm run test:coverage` pass before commits
- **Security**: Do not commit secrets, API keys, or Terraform state files

### Deployment

- **GitHub**: Source code repository with CI/CD via GitHub Actions
- **Static hosting**: Application designed for static file serving

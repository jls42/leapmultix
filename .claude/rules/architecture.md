---
paths:
  - 'js/**/*.js'
  - 'index.html'
  - 'tests/**/*.js'
  - 'tests-esm/**/*.mjs'
---

# Architecture : carte des modules

## Core Structure

- **`index.html`** - Main entry point with slide-based navigation system
- **`js/main.js`** - Primary application bootstrap and user management
- **`js/bootstrap.js`** - ES module event handler setup, replaces inline onclick handlers
- **`js/game.js`** - Core game state management and daily challenges

## Module Organization

### Core System (`js/core/`)

- `GameMode.js` / `GameModeManager.js` - Abstract game mode system
- `userState.js` - User session and preference management
- `storage.js` - LocalStorage abstraction layer
- `audio.js` - Audio manager with volume controls
- `eventBus.js` - Event-driven communication between components
- `mainInit.js` - DOM-ready initialization logic
- `theme.js` - Theme and color customization system
- `userUi.js` - User interface utilities
- `adventure-data.js` - Adventure mode data structures
- `mult-stats.js` - Multiplication statistics tracking
- `challenge-stats.js` - Challenge mode statistics
- `chrono-stats.js` - Chrono mode statistics, one store per operation (× in `chronoStats`, + − ÷ in `chronoStatsByOperator`): times per table set and answer mode, review list of missed facts
- `chrono-questions.js` - Chrono grids per operation (n × k, n + k, (n + k) − n, (n × k) ÷ n), draw weighted toward the harder facts, and revision queue (both members of a fact family, no repeat in a row while another fact is left: a list of one fact with no other order, such as 7 × 7, repeats it)
- `mode-stats.js` - Dashboard counters per mode and per operation (`modeStats`): answers, games started (first answer, abandons included), records of finished games, 20-answer window per × table for « À revoir »; seeded once from older profiles, never deleting anything
- `adventure-progress.js` - Adventure progress per operation; the pre-December-2025 format is copied into × (best of each level), never deleted
- `profile-operation-stats.js` - Per-calculation stats stored in each profile (`operationStats`, read by the Quiz draw); a profile from before this field starts from a copy of the device-wide `operationStats` key, which is never written again nor deleted
- `players-trash.js` - Trash of deleted players (`playersTrash`): a deleted profile waits 30 days with all its data, restorable from « Qui joue ? », then is erased at the next launch with its old Arcade scores
- `players-backup.js` - Players backup file (JSON `leapmultix-players`, version 1): export, checked import that never overwrites a player already there, `navigator.storage.persist()`
- `avatar-shop.js` - Avatars unlocked with coins (`AVATAR_PRICE` = 50): balance, missing coins, purchase on the profile (no storage access: the caller saves)
- `chrono-input.js` - Chrono typed-answer check (validates as soon as the answer is right or can no longer be)
- `daily-challenge.js` - Daily challenge management
- `utils.js` - Core utility functions (canonical source)
- `random.js` - Single source of randomness (Web Crypto): `randomInt`, `chance`, `pickRandom`, `shuffleInPlace`

### Game Modes (`js/modes/`)

- `QuizMode.js` - Basic multiplication quiz
- `ChallengeMode.js` - Timed challenges with scoring
- `DiscoveryMode.js` - Learning-focused exploration mode
- `AdventureMode.js` - Story-driven progression
- `ChronoMode.js` - Timed series of 10 correct answers, in the operation chosen on the home screen, with a review list of missed facts per operation
- `ArcadeMode.js` - Mini-games collection (Multimiam, Multisnake, etc.)

### UI Components (`js/components/`)

- `topBar.js` - Navigation and user controls
- `dashboard.js` - Progress tracking and statistics
- `customization.js` - Avatar, theme, and personalization
- `infoBar.js` - Game status information display
- `playerTools.js` - « Qui joue ? » on a classroom device: name filter from 10 players, « Nouveau joueur » shortcut, trash, backup buttons (tiles sorted by `UserManager.refreshUserList`, which emits `playersChanged`)
- `confirm-dialog.js` - The game's confirmation window instead of `window.confirm` (alertdialog, focus on the safe button, Escape = cancel, page inert during the question, follows fullscreen); `emphasis: 'confirm'` for a non-destructive action; `returnFocus(origin)` gives the focus back to the opener, or to the ☰ button when the phone menu holding it has closed (also used by `tableSettingsModal.js`)
- `avatarShop.js` - Avatars to unlock under the player's own in Personalisation: one button per locked avatar with its price; purchase through `confirm-dialog.js`, then the `avatarUnlocked` event lets `customization.js` put it on

### Specialized Modules

**Navigation and Slides:**

- `slides.js` - Slide-based navigation system (goToSlide, showSlide)
- `keyboard-navigation.js` - Keyboard navigation support

**Arcade Games:**

- `arcade.js` - Main arcade mode orchestrator
- `arcade-invasion.js` - Space Invaders-style game
- `arcade-multimemory.js` - Memory matching game
- `arcade-multimiam.js` - Multimiam arcade integration
- `arcade-multisnake.js` - Snake game integration
- `arcade-common.js`, `arcade-utils.js` - Shared arcade utilities
- `arcade-touch.js` - Gestes tactiles communs à MultiSnake et MultiMiam (glisser, toucher tolérant)
- `arcade-sprite-catalog.js` - Every image the four games draw: its high-definition source (1024 px for most), largest WebP variant, small PNG fallbacks and facing side; read by `scripts/generate-responsive-assets.cjs` (512 and 1024 variants for these sources only) and `scripts/precache-list.mjs` (one offline variant each)
- Arcade canvases at the device pixel ratio (`arcade-common.js`): games draw in game units (board size), the backing store follows the displayed size × `devicePixelRatio` (capped at 3, 4096 px per side) with a context transform. Read board sizes with `getArcadeCanvasSize()`, never `canvas.width`; convert pointers with `clientToCanvasPoint()`; size boards with `sizeArcadeCanvas()` (element = drawing), `renderArcadeCanvas()` (the game sets the element size itself: MultiMiam's maze fills the board with near-square cells, at most 1.25:1, chosen by `js/multimiam-layout.js`; only the remainder beyond that cap is padded with wall bands, centred by object-fit) or `fitArcadeCanvas()` (MultiInvaders: fixed game size shown in the available space); multiply `shadowBlur`/`shadowOffset` by `canvasPixelScale()` (shadows ignore the transform)
- `arcade-sprites.js` - Arcade images loaded at their on-screen size (drawn size × canvas display scale × device pixel ratio, capped at 3), upgraded when the board grows, drawn at their proportions (`drawArcadeSprite`: contain, cover for textures, fill for snake tiles; mirrored to face the other way)
- `arcade-message.js`, `arcade-points.js` - Arcade UI components
- `arcade-scores.js`, `arcade-session.js` - Arcade scores stored in the player profile; a game counts from its first move, abandon included
- `arcade-time.js` - Arcade time: pause (button next to the time, P key, hidden tab; never resumes on its own) and MultiMemory's no-time-limit option, kept on the device like the difficulty; the games read `isArcadePaused()` at each step

**Multimiam (Decomposed Architecture):**

- `multimiam.js` - Main Multimiam game controller
- `multimiam-engine.js` - Game engine and logic
- `multimiam-renderer.js` - Rendering system
- `multimiam-controls.js` - Input handling
- `multimiam-questions.js` - Question generation
- `multimiam-ui.js` - UI elements
- `multisnake.js` - Snake game implementation

**User Interface and Feedback:**

- `uiUtils.js` - UI utility functions
- `ui-feedback.js` - User feedback mechanisms
- `touch-support.js` - Touch and mobile support
- `virtual-keyboard.js` - Virtual keyboard implementation
- `coin-display.js`, `coin-effects.js` - Coin/currency system
- `notifications.js` - Notification system
- `badges.js` - Achievement badges system

**Video and Media:**

- `VideoManager.js` - Video playback management
- `responsive-image-loader.js` - Responsive image loading
- `webp-images.js` - Screen illustrations (Arcade menu logos and ships, dashboard logos, Adventure gifts) served as WebP at their displayed size × device pixel ratio (`srcset`, `sizes`), with the repository PNG as fallback until `npm run assets:generate` has produced the variants: `createWebpImage`, `webpImageAttributes` for templates, `attachImageFallbacks` once a template is shown (the sanitizer strips `onerror`). Keep the PNG file name as a literal outside `${…}`: `scripts/precache-list.mjs` finds the images to keep offline by their names in the code
- `avatar-heads.js` - Every avatar head on screen (« Qui joue ? » tiles, form and trash, home mascot, Personalisation, dashboard, Adventure map, Discovery tip, end screens) goes through `setAvatarHead(img, id, HEAD_SIZES.<place>)`, or `avatarHeadAttributes()` in a template: WebP 128/256/512 from the 1024 px source at the size the CSS gives it, the 128 px PNG as fallback; it rewrites srcset, sizes, src and fallback together (with a srcset, changing `src` alone no longer changes the picture). The heads written in `index.html` carry the same attributes (test). Also the avatar whitelist (`AVATAR_IDS`, `normalizeAvatarId`, old French names)

**Game Orchestration:**

- `mode-orchestrator.js` - Mode switching orchestration
- `lazy-loader.js` - Dynamic module loading
- `game-cleanup.js` - Game state cleanup utilities

**Utilities:**

- `utils-es6.js` - Main utilities aggregator
- `core/utils.js` - Core utility functions (canonical source)
- `main-helpers.js` - Main application helpers
- `helpers.js` - Legacy helper functions
- `stats-utils.js` - Statistics utilities
- `difficulty.js` - Difficulty level management
- `questionGenerator.js` - Question generation system

**Storage and State:**

- `storage.js` - Legacy storage wrapper
- `userManager.js` - Multi-user profile management

**Internationalization:**

- `i18n.js` - Internationalization system
- `i18n-store.js` - Translation storage

**Security and Error Handling:**

- `security-utils.js` - Security utilities (XSS protection, sanitization); `checkUsername()` keeps a player name as typed (letters of any script and their accents, digits, apostrophes, hyphen, period, underscore, space) and refuses the rest, quoting the refused signs
- `error-handlers.js` - Global error handling
- `logger.js` - Logging system

**Accessibility and Input:**

- `accessibility.js` - Accessibility features
- `game-exit.js` - Single exit rule during a game: Escape, « Abandonner » and the top-bar screens (Home, About, Dashboard, Customization, Change player) ask the mode's own confirmation; confirmed, the game is recorded as an abandon, then the screen opens. Outside a game, nothing changes
- `speech.js` - Single speech queue (see `docs/voix-enregistree.md`): `speak(text, {priority, queue})`,
  `cancelSpeech()`, pluggable engine (`setSpeechEngine`); never call `speechSynthesis` directly

**Integration and Analytics:**

- `plausible-init.js` - Plausible analytics initialization
- `cache-updater.js` - Cache management and version control
- `imports.js` - Module import utilities

## Module Import Patterns

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

## Key Conventions

- **ES Modules**: All code uses `import/export` syntax (type: "module")
- **Naming**: camelCase for functions/variables, PascalCase for classes
- **Event System**: Components communicate via `eventBus` rather than direct coupling
- **Lazy Loading**: Game modes are dynamically loaded via `lazy-loader.js` to improve initial page load
- **Slide Navigation**: UI uses numbered slides (slide0, slide1, etc.) with `goToSlide()` from `slides.js`

## Game State Management

The application maintains state through:

- **`gameState`** object (in `game.js`) - Current session state
- **`UserState`** class - Persistent user preferences and progress
- **LocalStorage** - Via `Storage` abstraction for data persistence
- **Event Bus** - For reactive state updates across components

## Testing Architecture

- **Framework**: Jest with jsdom environment
- **Configuration**: `jest.config.cjs`
- **Location**: `tests/__tests__/` with `*.test.js` naming
- **Coverage**: Reports to `coverage/` directory, includes all `js/**/*.js` files
- **ESM Tests**: Separate `tests-esm/` directory for `.mjs` files; tests that load the real modules belong here

## Build and Quality Tools

- **ESLint**: Modern flat config (`eslint.config.js`) with ES2022 support
- **Prettier**: Code formatting (`.prettierrc`)
- **Stylelint**: CSS linting (`.stylelintrc.json`)
- **Jest**: Testing with jsdom for DOM simulation
- **No bundler**: Direct ES module loading in browsers

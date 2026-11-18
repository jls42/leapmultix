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
- `audio.js` - Audio manager with volume controls; catalog of the game's sounds (`sounds`), each at its own level under the answer sound (`soundVolumes`): `bad` (`erreur.wav`, every wrong answer), `munch` (`miam.wav`, MultiMiam's fox and MultiSnake's apple, the same soft bite), MultiGoal `kick` (`ballon.wav`), MultiMemory `cardFlip` (`carte.wav`), MultiInvaders `bubbleShot` (`tir-bulle.wav`), MultiPop `mallet` (`maillet.wav`); generated with ElevenLabs and chosen by ear (skill `generating-sound-effects`, `chosen` of each lot), played in the player's gesture
- `eventBus.js` - Event-driven communication between components
- `mainInit.js` - DOM-ready initialization logic
- `theme.js` - Theme and color customization system; the displayed theme (`effectiveColorTheme`): during a holiday, its theme of the same lightness as the player's own, unless the player picked an ordinary theme during this edition (`seasonChoice`); `colorTheme` is never overwritten by a holiday theme; every theme has a counterpart of the other lightness (`THEME_PAIRS`: Classique/Nuit, Ciel/Spatial, Nature/Forêt, Orangé/Braise, each holiday's two), swapped by the « Mode sombre » switch of Personalisation (`counterpartTheme`), and only the buttons of the displayed lightness show
- `seasons.js` - Holidays (`SEASONS`: Halloween from 24/10 to 01/11, Christmas from 01/12 to 26/12 and New Year from 27/12 to 06/01 (across 31/12), Lunar New Year from the eve of the lunar new year to the Lantern Festival (`movable`: its day each year from a 2027-2040 table, bounds of a year by `seasonDays`), all included, device date, `?saison=<id>` or `?saison=aucune` to test): the default theme follows the calendar, one entry per holiday, never two on the same day (test): two color themes each (light, dark) and the families of costumed images they bring (heads, Arcade bodies and monsters, ships, MultiSnake snake skin and head, apple and grass, MultiMiam walls and answer token, mode and Arcade game logos, Adventure gifts, `worlds` backgrounds per avatar, home hero image), each read through `costumed(name, family)` at its own gate, worn only while one of their themes is applied (`wearSeason`, set by `theme.js`), never precached (`isSeasonalImage`). Adding one: skill `dressing-for-events`; `tests-esm/core/seasons-registry.esm.test.mjs` and `tests-esm/season-images.esm.test.mjs` list what it still lacks
- `userUi.js` - User interface utilities
- `adventure-data.js` - Adventure mode data structures
- `mult-stats.js` - Multiplication statistics tracking
- `challenge-stats.js` - Challenge mode statistics
- `chrono-stats.js` - Chrono mode statistics, one store per operation (× in `chronoStats`, + − ÷ in `chronoStatsByOperator`): times per table set and answer mode, review list of missed facts
- `chrono-questions.js` - Chrono grids per operation (n × k, n + k, (n + k) − n, (n × k) ÷ n), draw weighted toward the harder facts, and revision queue (both members of a fact family, no repeat in a row while another fact is left: a list of one fact with no other order, such as 7 × 7, repeats it)
- `mode-stats.js` - Dashboard counters per mode and per operation (`modeStats`): answers, games started (first answer, abandons included), records of finished games, 20-answer window per × table for « À revoir », Arcade answers (`arcadeAnswers`, counted in « Ton parcours » since v87, nothing before); seeded once from older profiles, never deleting anything
- `adventure-progress.js` - Adventure progress per operation; the pre-December-2025 format is copied into × (best of each level), never deleted
- `profile-operation-stats.js` - Per-calculation stats stored in each profile (`operationStats`, read by the Quiz draw); a profile from before this field starts from a copy of the device-wide `operationStats` key, which is never written again nor deleted
- `players-trash.js` - Trash of deleted players (`playersTrash`): a deleted profile waits 30 days with all its data, restorable from « Qui joue ? », then is erased at the next launch with its old Arcade scores. Deleting never needs room for a second copy: when the trash cannot be written next to the list, the profile leaves the list first (`UserManager._trashWithoutSecondCopy`); a refusal says so under « Qui joue ? » (`playerTrashFailed`)
- `players-backup.js` - Players backup file (JSON `leapmultix-players`, version 1): export, checked import that never overwrites a player already there, in the list or in the trash (profiles over `PLAYER_MAX_CHARS` left out), `navigator.storage.persist()`. An imported profile is marked `legacyArcade: false`: it neither takes nor protects this device's pre-v37 Arcade keys (`arcadeScores_<nickname>`)
- `avatars.js` - Avatar whitelist (`AVATAR_IDS`) and the key of each mascot's welcome message (`welcomeMessageKey`), with no dependency: the voice corpus (`scripts/voice/corpus.mjs`) reads it under Node
- `avatar-shop.js` - Avatars unlocked with coins (`AVATAR_PRICE` = 50): balance, missing coins, purchase on the profile (no storage access: the caller saves)
- `chrono-input.js` - Chrono typed-answer check (validates as soon as the answer is right or can no longer be)
- `daily-challenge.js` - Daily challenge management
- `utils.js` - Core utility functions (canonical source)
- `wrong-answers.js` - Plausible wrong answers of a question (a child's real slips: one more or less, the next row of the table, swapped digits), used by the modes (re-exported by `GameMode.js`) and by MultiInvaders, which mixes them with far answers by level (`waveAnswers`: far in Débutant, half in Moyen, close in Difficile)
- `random.js` - Single source of randomness (Web Crypto): `randomInt`, `chance`, `pickRandom`, `shuffleInPlace`

### Game Modes (`js/modes/`)

- `QuizMode.js` - Basic multiplication quiz
- `ChallengeMode.js` - Timed challenges with scoring
- `DiscoveryMode.js` - Learning-focused exploration mode
- `AdventureMode.js` - Story-driven progression
- `ChronoMode.js` - Timed series of 10 correct answers, in the operation chosen on the home screen, with a review list of missed facts per operation
- `ArcadeMode.js` - Mini-games collection (Multimiam, Multisnake, etc.)

### UI Components (`js/components/`)

- `topBar.js` - Navigation and user controls: icon buttons with a short word under the icon from 1200 px (`icon-btn-caption`, contained in the button's accessible name, WCAG 2.5.3; the ☰ menu shows the full label), and the « Mode sombre » switch on every screen (`data-theme-mode-switch`, asks `theme.js` through `eventBus` `colorMode:toggle`)
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
- `arcade-multipop.js` - MultiPop, whack-a-mole: monsters rise from nine holes, each with a number; hit the one carrying the answer, never the friend (another hero). Rules in `multipop-engine.js` (no drawing, no DOM), board in `multipop-renderer.js` (holes, signs, the mallet image `maillet.png`, drawn by code until it has loaded). Monsters stay up less long after each right answer (`SPEED_UP` 0.95, down to `FASTEST` 0.6 of the level's time). The mallet's strike runs on the game clock (`MALLET_STRIKE`: down 80 ms, held 200 ms with the burst, up 220 ms, then a 180 ms fade after a finger or key tap; it stays raised under the mouse); a hit squashes the figure and plays `assets/sounds/maillet.wav` in the player's gesture, like the answer sound (Safari may refuse a sound started later by the game loop)
- `arcade-multigoal.js` - MultiGoal, penalty shootout: shoot at the target carrying the answer while the goalkeeper (a monster) is not in front of it. Rules in `multigoal-engine.js`, pitch in `multigoal-renderer.js` (goal, targets, ball and the player's hero; a target the keeper blocks is dimmed)
- `arcade-board-game.js` - Shared base of the drawn-board games where a child picks an answer (MultiPop, MultiGoal): canvas and listeners, frame loop on the game clock (stopped during pause), screen-reader announcement and keyboard help, banner score, game screen with its timer and « Abandonner ». Each game keeps its rules: `resize()`, `step(dt)`, `draw()`, `handlePointer(event)`, `handleKeyDown(event)`
- `arcade-answers.js` - Calculations and proposed answers of the games that show several answers at once (MultiInvaders, MultiPop, MultiGoal): the level's tables and numbers, tables to review drawn more often, wrong answers close or far by level
- `arcade-question.js` - The calculation of the game banner, written by the six games through `writeArcadeQuestion(text)`: the « ? », then the answer once solved, in one box (`.arcade-answer-box`); the element's text stays exactly the one received (screen readers announce it once), and `--question-glyphs` (digits and « ? ») lets `css/arcade.css` shrink a long calculation just enough to fit its line
- Game banner (`components/infoBar.js`, `css/arcade.css`): one line for the six games, score and lives on the left, the calculation in the middle, time and its buttons (`.arcade-banner-tools`: Pause, fullscreen) on the right; on a portrait phone the « Score » and « Temps » labels are for screen readers only and the fullscreen button moves under the score
- `arcade-fullscreen.js` - Fullscreen button of the banner, only where the API exists (none on iPhone); `offerFullscreen()` of `arcade-common.js` keeps its place in the banner (`has-fullscreen`) from the start of the game, so the button arriving after the board is sized moves nothing. On a touch-first device, a game started by a real tap on « Jouer » (`notePlayPressed`, trusted event, used once within `PLAY_GESTURE_MS`) enters fullscreen by itself (`enterFullscreenAfterPlay`, only while the tap's user activation is still active)
- `arcade-common.js`, `arcade-utils.js` - Shared arcade utilities
- `arcade-touch.js` - Gestes tactiles communs à MultiSnake et MultiMiam (glisser, toucher tolérant)
- `isTouchFirstDevice()` (`arcade-common.js`) - Device played with a finger: a phone or tablet browser, or any screen whose primary pointer is coarse (an iPad presents itself as a Mac). The six games read it for their board, instructions and touch tolerance, never the user agent alone (test)
- `arcade-sprite-catalog.js` - Every image the six games draw: its high-definition source (1024 px for most), largest WebP variant, small PNG fallbacks and facing side; read by `scripts/generate-responsive-assets.cjs` (512 and 1024 variants for these sources only) and `scripts/precache-list.mjs` (one offline variant each)
- Arcade canvases at the device pixel ratio (`arcade-common.js`): games draw in game units (board size), the backing store follows the displayed size × `devicePixelRatio` (capped at 3, 4096 px per side) with a context transform. Read board sizes with `getArcadeCanvasSize()`, never `canvas.width`; convert pointers with `clientToCanvasPoint()`; size boards with `sizeArcadeCanvas()` (element = drawing), `renderArcadeCanvas()` (the game sets the element size itself: MultiMiam's maze fills the board with near-square cells, at most 1.25:1, chosen by `js/multimiam-layout.js`; only the remainder beyond that cap is padded with wall bands, centred by object-fit) or `fitArcadeCanvas()` (MultiInvaders: fixed game size shown in the available space); multiply `shadowBlur`/`shadowOffset` by `canvasPixelScale()` (shadows ignore the transform)
- `arcade-sprites.js` - Arcade images loaded at their on-screen size (drawn size × canvas display scale × device pixel ratio, capped at 3), upgraded when the board grows, drawn at their proportions (`drawArcadeSprite`: contain, cover for textures, fill for snake tiles; mirrored to face the other way)
- `arcade-message.js`, `arcade-points.js` - Arcade UI components
- `arcade-learning.js` - What an Arcade game teaches: `recordArcadeAnswer` (calculation stats, then « Ton parcours » and in × the « À revoir » window of its table, `countArcadeAnswer` of `core/mode-stats.js`, never a mode counter; missed calculations kept by `arcade-session.js` for the end screen, which shows them with their answer and « Nouveau record ! »), `arcadeWeakTables` (tables to review, drawn more often by the six games). MultiMemory records nothing: a missed pair is a memory slip, not a calculation error
- `arcade-scores.js`, `arcade-session.js` - Arcade scores stored in the player profile; a game counts from its first move, abandon included
- `arcade-time.js` - Arcade time: pause (button next to the time, P key, hidden tab; never resumes on its own) and MultiMemory's no-time-limit option, kept on the device like the difficulty; the games read `isArcadePaused()` at each step

**Multimiam (Decomposed Architecture):**

- `multimiam.js` - Main Multimiam game controller
- `multimiam-engine.js` - Game engine and logic
- `multimiam-renderer.js` - Rendering system
- `multimiam-controls.js` - Input handling
- `multimiam-questions.js` - Question generation
- `multimiam-ui.js` - UI elements
- `multisnake.js` - Snake game implementation; the snake's body is drawn by code in one piece (`multisnake-renderer.js`: body following its centerline, rounded turns, tapered tail, nothing animated under `prefers-reduced-motion`), from the geometry of `multisnake-path.js` (centerline during a step, wrap across the edges); its head is the player's avatar under a snake hood (`<avatar>_snake_head.png`, `snakeHeadSpec` of `arcade-sprite-catalog.js`, costumed by the `snake` family), always upright, facing where the snake goes (`headFacingOf`), with a drawn head that turns, blinks and flicks its tongue until the image has loaded; its holiday skin comes from `multisnake-skins.js` (colors, hat, or the Lunar New Year dance dragon); the head's direction and cell are published on the board (`data-snake-heading`, `data-snake-head-x/y`) for the end-to-end tests

**User Interface and Feedback:**

- `uiUtils.js` - UI utility functions
- `ui-feedback.js` - User feedback mechanisms
- `touch-support.js` - Touch and mobile support
- `screen-awake.js` - Keeps the phone screen on during a game (Screen Wake Lock on the game screen `slide4`, released after 5 minutes without a touch or a key and outside the game, asked again when the tab comes back)
- Phone screen (`css/general.css`): the page stays out of the camera notch (`--safe-top`… from `env(safe-area-inset-*)` on `body`, also in the Android app, whose system bars are hidden); under 600 px the avatar's world is a band at the top of the page that scrolls with it and fades into the page, the card opening lower outside a game
- `virtual-keyboard.js` - Virtual keyboard implementation
- `coin-display.js`, `coin-effects.js` - Coin/currency system
- `notifications.js` - Notification system
- `badges.js` - Achievement badges system

**Video and Media:**

- `VideoManager.js` - Character intro video; the mascot reads its welcome message aloud (`speak`, recorded voice or device voice), « Passer » cuts it
- `webp-images.js` - Screen illustrations (Arcade menu logos and ships, dashboard logos, Adventure gifts) served as WebP at their displayed size × device pixel ratio (`srcset`, `sizes`), with the repository PNG as fallback until `npm run assets:generate` has produced the variants: `createWebpImage`, `webpImageAttributes` for templates, `attachImageFallbacks` once a template is shown (the sanitizer strips `onerror`). Keep the PNG file name as a literal outside `${…}`: `scripts/precache-list.mjs` finds the images to keep offline by their names in the code
- `logos.js` - Drawn logos of the six modes (home cards, `MODE_LOGOS` per `data-mode`) and the six Arcade games (Arcade menu, `ARCADE_LOGOS`), reused by the dashboard rows: `logoSource()` costumed during a holiday (`logos` family), `repaintModeLogos()` for the static home cards when the theme changes
- `adventure-gifts.js` - The two Adventure gifts (closed in the scene, open on victory and on the results screen): `giftSource()` costumed during a holiday (`gifts` family)
- `avatar-heads.js` - Every avatar head on screen (« Qui joue ? » tiles, form and trash, home mascot, Personalisation, dashboard, Adventure map, Discovery tip, end screens) goes through `setAvatarHead(img, id, HEAD_SIZES.<place>)`, or `avatarHeadAttributes()` in a template: WebP 128/256/512 from the 1024 px source at the size the CSS gives it, the 128 px PNG as fallback; it rewrites srcset, sizes, src and fallback together (with a srcset, changing `src` alone no longer changes the picture). The heads written in `index.html` carry the same attributes (test). Also `normalizeAvatarId` (old French names) and the avatar whitelist `AVATAR_IDS`, re-exported from `core/avatars.js`

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
- `difficulty.js` - Difficulty level management: per level, the length of a timed Arcade game (`timeSeconds` 60, 90, 120 s; MultiMemory `memorySeconds` 120, 180, 300 s) and each game's pace
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

- `plausible-init.js` - Audience measurement: Plausible's official tracker, served by the site (`js/vendor/plausible.js`, copied from the npm package by `npm run vendor:plausible`), started with the domain `deploy.sh` writes in `<meta name="plausible-domain">` (none in development: nothing is measured). No script comes from plausible.io; only the events go to its API. The tracker sets `window.plausible`, which receives the game's events (« Voice fallback »)
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
- **Coverage**: Measured on the ESM tests (`npm run test:coverage`, run by `npm run verify`), the only ones that load the real modules; reports in `coverage/`, all `js/**/*.js` files except `js/vendor/`; global thresholds at the measured level in `jest.config.cjs`
- **ESM Tests**: Separate `tests-esm/` directory for `.mjs` files; tests that load the real modules belong here
- **End-to-end Tests**: `tests-esm/e2e/` (Puppeteer drives Chrome against `tests/utils/static-server.cjs`); shared game steps in `tests-esm/helpers/game-session.mjs`

## Build and Quality Tools

- **ESLint**: Modern flat config (`eslint.config.js`) with ES2022 support
- **Prettier**: Code formatting (`.prettierrc`)
- **Stylelint**: CSS linting (`.stylelintrc.json`)
- **Jest**: Testing with jsdom for DOM simulation
- **No bundler**: Direct ES module loading in browsers

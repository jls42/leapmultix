// Progressive Web App: enhanced service worker
// Strategies:
// - Install: precache what the game asks for (list below, produced by
//   scripts/precache-list.mjs), so that every mode and arcade game starts offline after a
//   first visit
// - Navigation: network-first; offline, the cached game page (offline.html only for a page
//   never cached)
// - Images: cache-first; offline, another image of the same family (other size of a sprite,
//   other background of the same avatar)
// - Translations JSON: stale-while-revalidate
// - JS/CSS: network-first with cache fallback (updates take precedence)
// - Sounds, fonts and other precached files: cache-first (byte ranges served)
// - Recorded voice: clips cache-first in their own cache (kept across versions),
//   index network-first (kill switch) with an offline copy

const VERSION = 'v37'; // bump to trigger client update
const OFFLINE_CACHE = `leapmultix-offline-${VERSION}`;
const RUNTIME_CACHE = `leapmultix-runtime-${VERSION}`;
const OFFLINE_URL = '/offline.html';

// La page du jeu, servie hors ligne pour l'adresse du site comme pour index.html, quels que
// soient leurs paramètres. Jamais remplacée en cours de route : elle demande les modules de
// sa version, ceux que le préchargement a gardés avec elle.
const SHELL_URL = '/index.html';
const SHELL_PATHS = new Set(['/', SHELL_URL]);

// Variantes WebP des images, produites au déploiement (npm run assets:generate) : la carte
// dit lesquelles garder pour chaque original de PRECACHE_IMAGES
const IMAGE_MAP_URL = '/assets/generated-images/image-map.json';
const ORIGINAL_IMAGE = /^\/assets\/images\/(.+)\.png$/;
const GENERATED_IMAGES = '/assets/generated-images/';

// Familles d'images interchangeables hors ligne : un sprite et ses tailles (arcade/x.png,
// arcade/x-128.webp), les fonds illustrés d'un même avatar (le jeu en tire un au hasard)
const SPRITE_FAMILY = /^\/assets\/(?:images|generated-images)\/(.+?)(?:-(\d+))?\.(?:png|webp)$/;
const BACKGROUND_FAMILY = /^\/img\/background_([a-z]+)_\d+\.(?:png|webp)$/;

const TRANSLATIONS = /^\/assets\/translations\/[^/]+\.json$/;
const BYTE_RANGE = /^bytes=(\d*)-(\d*)$/;

// Voix enregistrée (docs/voix-enregistree.md). Les clips sont immuables : un cache à part,
// épargné par activate, que chaque nouvel index purge des versions périmées.
const VOICE_CACHE = 'leapmultix-voice';
const VOICE_CACHE_LIMIT = 2000;
const VOICE_INDEX = '/voice/index.json';
const VOICE_CLIP = /^\/voice\/([a-z]{2})\/([a-z0-9][a-z0-9.-]*)\/[0-9a-z]+\.mp3$/;

// <precache> Produit par scripts/precache-list.mjs (npm run precache:update)
const PRECACHE_CORE = [
  '/assets/fonts/baloo2-600.woff2',
  '/assets/fonts/baloo2-700.woff2',
  '/assets/fonts/leapmultix-lecture-400.woff2',
  '/assets/fonts/leapmultix-lecture-700.woff2',
  '/assets/icons/panda-16.png',
  '/assets/icons/panda-180.png',
  '/assets/icons/panda-192.png',
  '/assets/icons/panda-256.png',
  '/assets/icons/panda-32.png',
  '/assets/icons/panda-384.png',
  '/assets/icons/panda-512.png',
  '/assets/images/operators/addition-128.webp',
  '/assets/images/operators/addition-32.webp',
  '/assets/images/operators/addition-64.webp',
  '/assets/images/operators/division-128.webp',
  '/assets/images/operators/division-32.webp',
  '/assets/images/operators/division-64.webp',
  '/assets/images/operators/multiplication-128.webp',
  '/assets/images/operators/multiplication-32.webp',
  '/assets/images/operators/multiplication-64.webp',
  '/assets/images/operators/soustraction-128.webp',
  '/assets/images/operators/soustraction-32.webp',
  '/assets/images/operators/soustraction-64.webp',
  '/assets/social/leapmultix-social-card.webp',
  '/assets/sounds/mixkit-electronic-lock-success-beeps-2852.wav',
  '/assets/sounds/mixkit-failure-arcade-alert-notification-240.wav',
  '/assets/sounds/mixkit-short-laser-gun-shot-1670.wav',
  '/assets/translations/en.json',
  '/assets/translations/es.json',
  '/assets/translations/fr.json',
  '/css/adventure.css',
  '/css/arcade.css',
  '/css/challenge.css',
  '/css/chrono.css',
  '/css/discovery-mode.css',
  '/css/game.css',
  '/css/general.css',
  '/css/home.css',
  '/css/multimiam.css',
  '/css/multisnake.css',
  '/css/operation-selector.css',
  '/css/parent-controls.css',
  '/css/progress-dashboard.css',
  '/css/quiz.css',
  '/css/responsive-unified.css',
  '/css/stars.css',
  '/css/table-settings-modal.css',
  '/css/theme-selector.css',
  '/css/themes.css',
  '/css/timer.css',
  '/css/topbar.css',
  '/css/users.css',
  '/css/video.css',
  '/css/volume-control.css',
  '/favicon.ico',
  '/img/background_astronaut_001.webp',
  '/img/background_dragon_001.webp',
  '/img/background_fox_001.webp',
  '/img/background_panda_001.webp',
  '/img/background_unicorn_001.webp',
  '/index.html',
  '/js/accessibility.js',
  '/js/arcade-common.js',
  '/js/arcade-invasion.js',
  '/js/arcade-message.js',
  '/js/arcade-multimemory.js',
  '/js/arcade-multimiam.js',
  '/js/arcade-multisnake.js',
  '/js/arcade-points.js',
  '/js/arcade-scores.js',
  '/js/arcade-session.js',
  '/js/arcade-sprite-loader.js',
  '/js/arcade-time.js',
  '/js/arcade-touch.js',
  '/js/arcade-utils.js',
  '/js/arcade.js',
  '/js/badges.js',
  '/js/bootstrap-critical.js',
  '/js/bootstrap.js',
  '/js/cache-updater.js',
  '/js/coin-display.js',
  '/js/coin-effects.js',
  '/js/components/customization.js',
  '/js/components/dashboard.js',
  '/js/components/icons.js',
  '/js/components/infoBar.js',
  '/js/components/loadErrorNotice.js',
  '/js/components/operationModeAvailability.js',
  '/js/components/operationSelector.js',
  '/js/components/playerTools.js',
  '/js/components/tableSettingsModal.js',
  '/js/components/topBar.js',
  '/js/core/adventure-data.js',
  '/js/core/adventure-progress.js',
  '/js/core/audio.js',
  '/js/core/challenge-stats.js',
  '/js/core/chrono-input.js',
  '/js/core/chrono-questions.js',
  '/js/core/chrono-stats.js',
  '/js/core/daily-challenge.js',
  '/js/core/eventBus.js',
  '/js/core/GameMode.js',
  '/js/core/mainInit.js',
  '/js/core/message-format.js',
  '/js/core/mode-stats.js',
  '/js/core/mult-stats.js',
  '/js/core/operation-stats.js',
  '/js/core/operations/Addition.js',
  '/js/core/operations/Division.js',
  '/js/core/operations/Multiplication.js',
  '/js/core/operations/Operation.js',
  '/js/core/operations/OperationRegistry.js',
  '/js/core/operations/Subtraction.js',
  '/js/core/players-backup.js',
  '/js/core/players-trash.js',
  '/js/core/profile-operation-stats.js',
  '/js/core/random.js',
  '/js/core/spoken-text.js',
  '/js/core/stats-migration.js',
  '/js/core/storage.js',
  '/js/core/tablePreferences.js',
  '/js/core/theme.js',
  '/js/core/userState.js',
  '/js/core/userUi.js',
  '/js/core/utils.js',
  '/js/core/voice-activation.js',
  '/js/core/voice-index.js',
  '/js/difficulty.js',
  '/js/error-handlers.js',
  '/js/game-cleanup.js',
  '/js/game.js',
  '/js/i18n-store.js',
  '/js/i18n.js',
  '/js/imports.js',
  '/js/keyboard-navigation.js',
  '/js/lazy-loader.js',
  '/js/logger.js',
  '/js/main-es6.js',
  '/js/main-helpers.js',
  '/js/main.js',
  '/js/mode-orchestrator.js',
  '/js/modes/AdventureMode.js',
  '/js/modes/ArcadeMode.js',
  '/js/modes/ChallengeMode.js',
  '/js/modes/ChronoMode.js',
  '/js/modes/discovery-data.js',
  '/js/modes/DiscoveryMode.js',
  '/js/modes/QuizMode.js',
  '/js/multimiam-controls.js',
  '/js/multimiam-engine.js',
  '/js/multimiam-questions.js',
  '/js/multimiam-renderer.js',
  '/js/multimiam-ui.js',
  '/js/multimiam.js',
  '/js/multisnake.js',
  '/js/notifications.js',
  '/js/optional-styles-loader.js',
  '/js/plausible-init.js',
  '/js/questionGenerator.js',
  '/js/responsive-image-loader.js',
  '/js/security-utils.js',
  '/js/seo-assets-preloader.js',
  '/js/slides.js',
  '/js/speech.js',
  '/js/stats-utils.js',
  '/js/storage.js',
  '/js/touch-support.js',
  '/js/ui-feedback.js',
  '/js/uiUtils.js',
  '/js/userManager.js',
  '/js/utils-es6.js',
  '/js/VideoManager.js',
  '/js/virtual-keyboard.js',
  '/js/voice-clips.js',
  '/manifest.json',
  '/offline.html',
];
const PRECACHE_IMAGES = [
  '/assets/generated-images/arcade/logo_mode_arcade-128.webp',
  '/assets/generated-images/arcade/logo_mode_arcade-256.webp',
  '/assets/generated-images/arcade/logo_mode_arcade-512.webp',
  '/assets/generated-images/arcade/logo_mode_aventure-128.webp',
  '/assets/generated-images/arcade/logo_mode_aventure-256.webp',
  '/assets/generated-images/arcade/logo_mode_aventure-512.webp',
  '/assets/generated-images/arcade/logo_mode_chrono-128.webp',
  '/assets/generated-images/arcade/logo_mode_chrono-256.webp',
  '/assets/generated-images/arcade/logo_mode_chrono-512.webp',
  '/assets/generated-images/arcade/logo_mode_decouverte-128.webp',
  '/assets/generated-images/arcade/logo_mode_decouverte-256.webp',
  '/assets/generated-images/arcade/logo_mode_decouverte-512.webp',
  '/assets/generated-images/arcade/logo_mode_defi-128.webp',
  '/assets/generated-images/arcade/logo_mode_defi-256.webp',
  '/assets/generated-images/arcade/logo_mode_defi-512.webp',
  '/assets/generated-images/arcade/logo_mode_quizz-128.webp',
  '/assets/generated-images/arcade/logo_mode_quizz-256.webp',
  '/assets/generated-images/arcade/logo_mode_quizz-512.webp',
  '/assets/images/arcade/astronaut_head_avatar_128x128.png',
  '/assets/images/arcade/astronaut_left_128x128.png',
  '/assets/images/arcade/astronaut_right_128x128.png',
  '/assets/images/arcade/astronaute_vaisseau_2_256x256.png',
  '/assets/images/arcade/astronaute_vaisseau_256x256.png',
  '/assets/images/arcade/cadeau_ferme.png',
  '/assets/images/arcade/cadeau_ouvert.png',
  '/assets/images/arcade/chemin_128x128.png',
  '/assets/images/arcade/chemin.png',
  '/assets/images/arcade/corps_courbe_bas_gauche.png',
  '/assets/images/arcade/corps_courbe_droite_bas.png',
  '/assets/images/arcade/corps_courbe_gauche_haut.png',
  '/assets/images/arcade/corps_courbe_haut_droite.png',
  '/assets/images/arcade/corps_milieu_queue_bas_tete_haut.png',
  '/assets/images/arcade/corps_milieu_queue_gauche_tete_droite.png',
  '/assets/images/arcade/dragon_head_avatar_128x128.png',
  '/assets/images/arcade/dragon_left_128x128.png',
  '/assets/images/arcade/dragon_right_128x128.png',
  '/assets/images/arcade/dragon_vaisseau_2_256x256.png',
  '/assets/images/arcade/dragon_vaisseau_256x256.png',
  '/assets/images/arcade/fox_head_avatar_128x128.png',
  '/assets/images/arcade/fox_left_128x128.png',
  '/assets/images/arcade/fox_right_128x128.png',
  '/assets/images/arcade/herbe.png',
  '/assets/images/arcade/licorne_vaisseau_2_256x256.png',
  '/assets/images/arcade/licorne_vaisseau_256x256.png',
  '/assets/images/arcade/logo_mode_arcade.png',
  '/assets/images/arcade/logo_mode_aventure.png',
  '/assets/images/arcade/logo_mode_chrono.png',
  '/assets/images/arcade/logo_mode_decouverte.png',
  '/assets/images/arcade/logo_mode_defi.png',
  '/assets/images/arcade/logo_mode_quizz.png',
  '/assets/images/arcade/logo_multiinvaders.png',
  '/assets/images/arcade/logo_multimemory.png',
  '/assets/images/arcade/logo_multimiam_128x128.png',
  '/assets/images/arcade/logo_multimiam.png',
  '/assets/images/arcade/logo_multisnake.png',
  '/assets/images/arcade/monstre01_left_128x128.png',
  '/assets/images/arcade/monstre01_right_128x128.png',
  '/assets/images/arcade/monstre02_left_128x128.png',
  '/assets/images/arcade/monstre02_right_128x128.png',
  '/assets/images/arcade/monstre03_left_128x128.png',
  '/assets/images/arcade/monstre03_right_128x128.png',
  '/assets/images/arcade/monstre04_left_128x128.png',
  '/assets/images/arcade/monstre04_right_128x128.png',
  '/assets/images/arcade/monstre05_left_128x128.png',
  '/assets/images/arcade/monstre05_right_128x128.png',
  '/assets/images/arcade/monstre06_left_128x128.png',
  '/assets/images/arcade/monstre06_right_128x128.png',
  '/assets/images/arcade/monstre07_left_128x128.png',
  '/assets/images/arcade/monstre07_right_128x128.png',
  '/assets/images/arcade/monstre08_left_128x128.png',
  '/assets/images/arcade/monstre08_right_128x128.png',
  '/assets/images/arcade/monstre09_left_128x128.png',
  '/assets/images/arcade/monstre09_right_128x128.png',
  '/assets/images/arcade/monstre10_left_128x128.png',
  '/assets/images/arcade/monstre10_right_128x128.png',
  '/assets/images/arcade/monstre100_left_128x128.png',
  '/assets/images/arcade/monstre100_right_128x128.png',
  '/assets/images/arcade/monstre101_left_128x128.png',
  '/assets/images/arcade/monstre101_right_128x128.png',
  '/assets/images/arcade/monstre102_left_128x128.png',
  '/assets/images/arcade/monstre102_right_128x128.png',
  '/assets/images/arcade/monstre103_left_128x128.png',
  '/assets/images/arcade/monstre103_right_128x128.png',
  '/assets/images/arcade/monstre104_left_128x128.png',
  '/assets/images/arcade/monstre104_right_128x128.png',
  '/assets/images/arcade/monstre105_left_128x128.png',
  '/assets/images/arcade/monstre105_right_128x128.png',
  '/assets/images/arcade/monstre106_left_128x128.png',
  '/assets/images/arcade/monstre106_right_128x128.png',
  '/assets/images/arcade/monstre107_left_128x128.png',
  '/assets/images/arcade/monstre107_right_128x128.png',
  '/assets/images/arcade/monstre108_left_128x128.png',
  '/assets/images/arcade/monstre108_right_128x128.png',
  '/assets/images/arcade/monstre109_left_128x128.png',
  '/assets/images/arcade/monstre109_right_128x128.png',
  '/assets/images/arcade/monstre11_left_128x128.png',
  '/assets/images/arcade/monstre11_right_128x128.png',
  '/assets/images/arcade/monstre110_left_128x128.png',
  '/assets/images/arcade/monstre110_right_128x128.png',
  '/assets/images/arcade/monstre111_left_128x128.png',
  '/assets/images/arcade/monstre111_right_128x128.png',
  '/assets/images/arcade/monstre112_left_128x128.png',
  '/assets/images/arcade/monstre112_right_128x128.png',
  '/assets/images/arcade/monstre113_left_128x128.png',
  '/assets/images/arcade/monstre113_right_128x128.png',
  '/assets/images/arcade/monstre114_left_128x128.png',
  '/assets/images/arcade/monstre114_right_128x128.png',
  '/assets/images/arcade/monstre115_left_128x128.png',
  '/assets/images/arcade/monstre115_right_128x128.png',
  '/assets/images/arcade/monstre116_left_128x128.png',
  '/assets/images/arcade/monstre116_right_128x128.png',
  '/assets/images/arcade/monstre117_left_128x128.png',
  '/assets/images/arcade/monstre117_right_128x128.png',
  '/assets/images/arcade/monstre118_left_128x128.png',
  '/assets/images/arcade/monstre118_right_128x128.png',
  '/assets/images/arcade/monstre119_left_128x128.png',
  '/assets/images/arcade/monstre119_right_128x128.png',
  '/assets/images/arcade/monstre12_left_128x128.png',
  '/assets/images/arcade/monstre12_right_128x128.png',
  '/assets/images/arcade/monstre120_left_128x128.png',
  '/assets/images/arcade/monstre120_right_128x128.png',
  '/assets/images/arcade/monstre121_left_128x128.png',
  '/assets/images/arcade/monstre121_right_128x128.png',
  '/assets/images/arcade/monstre122_left_128x128.png',
  '/assets/images/arcade/monstre122_right_128x128.png',
  '/assets/images/arcade/monstre123_left_128x128.png',
  '/assets/images/arcade/monstre123_right_128x128.png',
  '/assets/images/arcade/monstre124_left_128x128.png',
  '/assets/images/arcade/monstre124_right_128x128.png',
  '/assets/images/arcade/monstre125_left_128x128.png',
  '/assets/images/arcade/monstre125_right_128x128.png',
  '/assets/images/arcade/monstre126_left_128x128.png',
  '/assets/images/arcade/monstre126_right_128x128.png',
  '/assets/images/arcade/monstre127_left_128x128.png',
  '/assets/images/arcade/monstre127_right_128x128.png',
  '/assets/images/arcade/monstre128_left_128x128.png',
  '/assets/images/arcade/monstre128_right_128x128.png',
  '/assets/images/arcade/monstre129_left_128x128.png',
  '/assets/images/arcade/monstre129_right_128x128.png',
  '/assets/images/arcade/monstre13_left_128x128.png',
  '/assets/images/arcade/monstre13_right_128x128.png',
  '/assets/images/arcade/monstre130_left_128x128.png',
  '/assets/images/arcade/monstre130_right_128x128.png',
  '/assets/images/arcade/monstre131_left_128x128.png',
  '/assets/images/arcade/monstre131_right_128x128.png',
  '/assets/images/arcade/monstre132_left_128x128.png',
  '/assets/images/arcade/monstre132_right_128x128.png',
  '/assets/images/arcade/monstre133_left_128x128.png',
  '/assets/images/arcade/monstre133_right_128x128.png',
  '/assets/images/arcade/monstre134_left_128x128.png',
  '/assets/images/arcade/monstre134_right_128x128.png',
  '/assets/images/arcade/monstre135_left_128x128.png',
  '/assets/images/arcade/monstre135_right_128x128.png',
  '/assets/images/arcade/monstre136_left_128x128.png',
  '/assets/images/arcade/monstre136_right_128x128.png',
  '/assets/images/arcade/monstre137_left_128x128.png',
  '/assets/images/arcade/monstre137_right_128x128.png',
  '/assets/images/arcade/monstre138_left_128x128.png',
  '/assets/images/arcade/monstre138_right_128x128.png',
  '/assets/images/arcade/monstre139_left_128x128.png',
  '/assets/images/arcade/monstre139_right_128x128.png',
  '/assets/images/arcade/monstre14_left_128x128.png',
  '/assets/images/arcade/monstre14_right_128x128.png',
  '/assets/images/arcade/monstre140_left_128x128.png',
  '/assets/images/arcade/monstre140_right_128x128.png',
  '/assets/images/arcade/monstre141_left_128x128.png',
  '/assets/images/arcade/monstre141_right_128x128.png',
  '/assets/images/arcade/monstre142_left_128x128.png',
  '/assets/images/arcade/monstre142_right_128x128.png',
  '/assets/images/arcade/monstre143_left_128x128.png',
  '/assets/images/arcade/monstre143_right_128x128.png',
  '/assets/images/arcade/monstre144_left_128x128.png',
  '/assets/images/arcade/monstre144_right_128x128.png',
  '/assets/images/arcade/monstre145_left_128x128.png',
  '/assets/images/arcade/monstre145_right_128x128.png',
  '/assets/images/arcade/monstre146_left_128x128.png',
  '/assets/images/arcade/monstre146_right_128x128.png',
  '/assets/images/arcade/monstre147_left_128x128.png',
  '/assets/images/arcade/monstre147_right_128x128.png',
  '/assets/images/arcade/monstre148_left_128x128.png',
  '/assets/images/arcade/monstre148_right_128x128.png',
  '/assets/images/arcade/monstre149_left_128x128.png',
  '/assets/images/arcade/monstre149_right_128x128.png',
  '/assets/images/arcade/monstre15_left_128x128.png',
  '/assets/images/arcade/monstre15_right_128x128.png',
  '/assets/images/arcade/monstre150_left_128x128.png',
  '/assets/images/arcade/monstre150_right_128x128.png',
  '/assets/images/arcade/monstre151_left_128x128.png',
  '/assets/images/arcade/monstre151_right_128x128.png',
  '/assets/images/arcade/monstre152_left_128x128.png',
  '/assets/images/arcade/monstre152_right_128x128.png',
  '/assets/images/arcade/monstre153_left_128x128.png',
  '/assets/images/arcade/monstre153_right_128x128.png',
  '/assets/images/arcade/monstre154_left_128x128.png',
  '/assets/images/arcade/monstre154_right_128x128.png',
  '/assets/images/arcade/monstre155_left_128x128.png',
  '/assets/images/arcade/monstre155_right_128x128.png',
  '/assets/images/arcade/monstre16_left_128x128.png',
  '/assets/images/arcade/monstre16_right_128x128.png',
  '/assets/images/arcade/monstre17_left_128x128.png',
  '/assets/images/arcade/monstre17_right_128x128.png',
  '/assets/images/arcade/monstre18_left_128x128.png',
  '/assets/images/arcade/monstre18_right_128x128.png',
  '/assets/images/arcade/monstre19_left_128x128.png',
  '/assets/images/arcade/monstre19_right_128x128.png',
  '/assets/images/arcade/monstre20_left_128x128.png',
  '/assets/images/arcade/monstre20_right_128x128.png',
  '/assets/images/arcade/monstre21_left_128x128.png',
  '/assets/images/arcade/monstre21_right_128x128.png',
  '/assets/images/arcade/monstre22_left_128x128.png',
  '/assets/images/arcade/monstre22_right_128x128.png',
  '/assets/images/arcade/monstre23_left_128x128.png',
  '/assets/images/arcade/monstre23_right_128x128.png',
  '/assets/images/arcade/monstre24_left_128x128.png',
  '/assets/images/arcade/monstre24_right_128x128.png',
  '/assets/images/arcade/monstre25_left_128x128.png',
  '/assets/images/arcade/monstre25_right_128x128.png',
  '/assets/images/arcade/monstre26_left_128x128.png',
  '/assets/images/arcade/monstre26_right_128x128.png',
  '/assets/images/arcade/monstre27_left_128x128.png',
  '/assets/images/arcade/monstre27_right_128x128.png',
  '/assets/images/arcade/monstre28_left_128x128.png',
  '/assets/images/arcade/monstre28_right_128x128.png',
  '/assets/images/arcade/monstre29_left_128x128.png',
  '/assets/images/arcade/monstre29_right_128x128.png',
  '/assets/images/arcade/monstre30_left_128x128.png',
  '/assets/images/arcade/monstre30_right_128x128.png',
  '/assets/images/arcade/monstre31_left_128x128.png',
  '/assets/images/arcade/monstre31_right_128x128.png',
  '/assets/images/arcade/monstre32_left_128x128.png',
  '/assets/images/arcade/monstre32_right_128x128.png',
  '/assets/images/arcade/monstre33_left_128x128.png',
  '/assets/images/arcade/monstre33_right_128x128.png',
  '/assets/images/arcade/monstre34_left_128x128.png',
  '/assets/images/arcade/monstre34_right_128x128.png',
  '/assets/images/arcade/monstre35_left_128x128.png',
  '/assets/images/arcade/monstre35_right_128x128.png',
  '/assets/images/arcade/monstre36_left_128x128.png',
  '/assets/images/arcade/monstre36_right_128x128.png',
  '/assets/images/arcade/monstre37_left_128x128.png',
  '/assets/images/arcade/monstre37_right_128x128.png',
  '/assets/images/arcade/monstre38_left_128x128.png',
  '/assets/images/arcade/monstre38_right_128x128.png',
  '/assets/images/arcade/monstre39_left_128x128.png',
  '/assets/images/arcade/monstre39_right_128x128.png',
  '/assets/images/arcade/monstre40_left_128x128.png',
  '/assets/images/arcade/monstre40_right_128x128.png',
  '/assets/images/arcade/monstre41_left_128x128.png',
  '/assets/images/arcade/monstre41_right_128x128.png',
  '/assets/images/arcade/monstre42_left_128x128.png',
  '/assets/images/arcade/monstre42_right_128x128.png',
  '/assets/images/arcade/monstre43_left_128x128.png',
  '/assets/images/arcade/monstre43_right_128x128.png',
  '/assets/images/arcade/monstre44_left_128x128.png',
  '/assets/images/arcade/monstre44_right_128x128.png',
  '/assets/images/arcade/monstre45_left_128x128.png',
  '/assets/images/arcade/monstre45_right_128x128.png',
  '/assets/images/arcade/monstre46_left_128x128.png',
  '/assets/images/arcade/monstre46_right_128x128.png',
  '/assets/images/arcade/monstre47_left_128x128.png',
  '/assets/images/arcade/monstre47_right_128x128.png',
  '/assets/images/arcade/monstre48_left_128x128.png',
  '/assets/images/arcade/monstre48_right_128x128.png',
  '/assets/images/arcade/monstre49_left_128x128.png',
  '/assets/images/arcade/monstre49_right_128x128.png',
  '/assets/images/arcade/monstre50_left_128x128.png',
  '/assets/images/arcade/monstre50_right_128x128.png',
  '/assets/images/arcade/monstre51_left_128x128.png',
  '/assets/images/arcade/monstre51_right_128x128.png',
  '/assets/images/arcade/monstre52_left_128x128.png',
  '/assets/images/arcade/monstre52_right_128x128.png',
  '/assets/images/arcade/monstre53_left_128x128.png',
  '/assets/images/arcade/monstre53_right_128x128.png',
  '/assets/images/arcade/monstre54_left_128x128.png',
  '/assets/images/arcade/monstre54_right_128x128.png',
  '/assets/images/arcade/monstre55_left_128x128.png',
  '/assets/images/arcade/monstre55_right_128x128.png',
  '/assets/images/arcade/monstre56_left_128x128.png',
  '/assets/images/arcade/monstre56_right_128x128.png',
  '/assets/images/arcade/monstre57_left_128x128.png',
  '/assets/images/arcade/monstre57_right_128x128.png',
  '/assets/images/arcade/monstre58_left_128x128.png',
  '/assets/images/arcade/monstre58_right_128x128.png',
  '/assets/images/arcade/monstre59_left_128x128.png',
  '/assets/images/arcade/monstre59_right_128x128.png',
  '/assets/images/arcade/monstre60_left_128x128.png',
  '/assets/images/arcade/monstre60_right_128x128.png',
  '/assets/images/arcade/monstre61_left_128x128.png',
  '/assets/images/arcade/monstre61_right_128x128.png',
  '/assets/images/arcade/monstre62_left_128x128.png',
  '/assets/images/arcade/monstre62_right_128x128.png',
  '/assets/images/arcade/monstre63_left_128x128.png',
  '/assets/images/arcade/monstre63_right_128x128.png',
  '/assets/images/arcade/monstre64_left_128x128.png',
  '/assets/images/arcade/monstre64_right_128x128.png',
  '/assets/images/arcade/monstre65_left_128x128.png',
  '/assets/images/arcade/monstre65_right_128x128.png',
  '/assets/images/arcade/monstre66_left_128x128.png',
  '/assets/images/arcade/monstre66_right_128x128.png',
  '/assets/images/arcade/monstre67_left_128x128.png',
  '/assets/images/arcade/monstre67_right_128x128.png',
  '/assets/images/arcade/monstre68_left_128x128.png',
  '/assets/images/arcade/monstre68_right_128x128.png',
  '/assets/images/arcade/monstre69_left_128x128.png',
  '/assets/images/arcade/monstre69_right_128x128.png',
  '/assets/images/arcade/monstre70_left_128x128.png',
  '/assets/images/arcade/monstre70_right_128x128.png',
  '/assets/images/arcade/monstre71_left_128x128.png',
  '/assets/images/arcade/monstre71_right_128x128.png',
  '/assets/images/arcade/monstre72_left_128x128.png',
  '/assets/images/arcade/monstre72_right_128x128.png',
  '/assets/images/arcade/monstre73_left_128x128.png',
  '/assets/images/arcade/monstre73_right_128x128.png',
  '/assets/images/arcade/monstre74_left_128x128.png',
  '/assets/images/arcade/monstre74_right_128x128.png',
  '/assets/images/arcade/monstre75_left_128x128.png',
  '/assets/images/arcade/monstre75_right_128x128.png',
  '/assets/images/arcade/monstre76_left_128x128.png',
  '/assets/images/arcade/monstre76_right_128x128.png',
  '/assets/images/arcade/monstre77_left_128x128.png',
  '/assets/images/arcade/monstre77_right_128x128.png',
  '/assets/images/arcade/monstre78_left_128x128.png',
  '/assets/images/arcade/monstre78_right_128x128.png',
  '/assets/images/arcade/monstre79_left_128x128.png',
  '/assets/images/arcade/monstre79_right_128x128.png',
  '/assets/images/arcade/monstre80_left_128x128.png',
  '/assets/images/arcade/monstre80_right_128x128.png',
  '/assets/images/arcade/monstre81_left_128x128.png',
  '/assets/images/arcade/monstre81_right_128x128.png',
  '/assets/images/arcade/monstre82_left_128x128.png',
  '/assets/images/arcade/monstre82_right_128x128.png',
  '/assets/images/arcade/monstre83_left_128x128.png',
  '/assets/images/arcade/monstre83_right_128x128.png',
  '/assets/images/arcade/monstre84_left_128x128.png',
  '/assets/images/arcade/monstre84_right_128x128.png',
  '/assets/images/arcade/monstre85_left_128x128.png',
  '/assets/images/arcade/monstre85_right_128x128.png',
  '/assets/images/arcade/monstre86_left_128x128.png',
  '/assets/images/arcade/monstre86_right_128x128.png',
  '/assets/images/arcade/monstre87_left_128x128.png',
  '/assets/images/arcade/monstre87_right_128x128.png',
  '/assets/images/arcade/monstre88_left_128x128.png',
  '/assets/images/arcade/monstre88_right_128x128.png',
  '/assets/images/arcade/monstre89_left_128x128.png',
  '/assets/images/arcade/monstre89_right_128x128.png',
  '/assets/images/arcade/monstre90_left_128x128.png',
  '/assets/images/arcade/monstre90_right_128x128.png',
  '/assets/images/arcade/monstre91_left_128x128.png',
  '/assets/images/arcade/monstre91_right_128x128.png',
  '/assets/images/arcade/monstre92_left_128x128.png',
  '/assets/images/arcade/monstre92_right_128x128.png',
  '/assets/images/arcade/monstre93_left_128x128.png',
  '/assets/images/arcade/monstre93_right_128x128.png',
  '/assets/images/arcade/monstre94_left_128x128.png',
  '/assets/images/arcade/monstre94_right_128x128.png',
  '/assets/images/arcade/monstre95_left_128x128.png',
  '/assets/images/arcade/monstre95_right_128x128.png',
  '/assets/images/arcade/monstre96_left_128x128.png',
  '/assets/images/arcade/monstre96_right_128x128.png',
  '/assets/images/arcade/monstre97_left_128x128.png',
  '/assets/images/arcade/monstre97_right_128x128.png',
  '/assets/images/arcade/monstre98_left_128x128.png',
  '/assets/images/arcade/monstre98_right_128x128.png',
  '/assets/images/arcade/monstre99_left_128x128.png',
  '/assets/images/arcade/monstre99_right_128x128.png',
  '/assets/images/arcade/mur_128x128.png',
  '/assets/images/arcade/panda_head_avatar_128x128.png',
  '/assets/images/arcade/panda_left_128x128.png',
  '/assets/images/arcade/panda_right_128x128.png',
  '/assets/images/arcade/panda_vaisseau_2_256x256.png',
  '/assets/images/arcade/panda_vaisseau_256x256.png',
  '/assets/images/arcade/queue_fin_bas.png',
  '/assets/images/arcade/queue_fin_droite.png',
  '/assets/images/arcade/queue_fin_gauche.png',
  '/assets/images/arcade/queue_fin_haut.png',
  '/assets/images/arcade/renard_vaisseau_2_256x256.png',
  '/assets/images/arcade/renard_vaisseau_256x256.png',
  '/assets/images/arcade/snake_apple_128x128.png',
  '/assets/images/arcade/spaceship_astronaut_2.png',
  '/assets/images/arcade/spaceship_astronaut.png',
  '/assets/images/arcade/spaceship_default_128x128.png',
  '/assets/images/arcade/spaceship_default_2.png',
  '/assets/images/arcade/spaceship_default.png',
  '/assets/images/arcade/spaceship_dragon_2.png',
  '/assets/images/arcade/spaceship_dragon.png',
  '/assets/images/arcade/spaceship_fox_2.png',
  '/assets/images/arcade/spaceship_fox.png',
  '/assets/images/arcade/spaceship_panda_2.png',
  '/assets/images/arcade/spaceship_panda.png',
  '/assets/images/arcade/spaceship_unicorn_2.png',
  '/assets/images/arcade/spaceship_unicorn.png',
  '/assets/images/arcade/tete_bas.png',
  '/assets/images/arcade/tete_droite.png',
  '/assets/images/arcade/tete_gauche.png',
  '/assets/images/arcade/tete_haut.png',
  '/assets/images/arcade/unicorn_head_avatar_128x128.png',
  '/assets/images/arcade/unicorn_left_128x128.png',
  '/assets/images/arcade/unicorn_right_128x128.png',
  '/assets/images/forest.png',
  '/assets/images/river.png',
];
// </precache>

/** Préchargement : jamais servi par le cache HTTP, qui garde parfois une version ancienne */
const freshRequest = url => new Request(url, { cache: 'reload' });

/**
 * Variantes de chaque original d'après la carte du déploiement ; null sans carte lisible
 * (en développement, le serveur répond la page pour un fichier absent) : les originaux
 * sont alors gardés. Sans réseau, l'installation échoue et sera reprise.
 * @returns {Promise<Map<string, string[]>|null>}
 */
async function imageVariants(cache) {
  const response = await fetch(freshRequest(IMAGE_MAP_URL));
  if (!response.ok) return null;
  let map;
  try {
    map = await response.clone().json();
  } catch {
    return null;
  }
  await cache.put(IMAGE_MAP_URL, response);
  return new Map(
    Object.entries(map).map(([base, entry]) => [base, Object.values(entry?.resolutions || {})])
  );
}

/** Adresses à garder pour une image : ses variantes WebP, sinon elle-même */
function imageUrls(url, variants) {
  const base = ORIGINAL_IMAGE.exec(url)?.[1];
  const files = base && variants ? variants.get(base) : null;
  if (!files?.length) return [url];
  return files.map(file => `${GENERATED_IMAGES}${file}`);
}

/**
 * Une image n'est gardée que si c'en est une : jamais la page qu'un serveur de
 * développement répond pour un fichier absent. Le type d'image n'est pas exigé : S3 ne
 * connaît pas toujours .webp, et le navigateur reconnaît une image à son contenu.
 */
async function keepImage(cache, url) {
  const response = await fetch(freshRequest(url));
  const type = response.headers.get('content-type') || '';
  if (response.ok && !type.startsWith('text/html')) await cache.put(url, response);
}

/**
 * Le code, les styles, les sons et les traductions : tous ou aucun (une installation à
 * moitié faite ne remplace pas la précédente). Les images ensuite, chacune pour elle-même.
 */
async function precache() {
  const cache = await caches.open(OFFLINE_CACHE);
  await cache.addAll(PRECACHE_CORE.map(freshRequest));
  const variants = await imageVariants(cache);
  const urls = new Set(PRECACHE_IMAGES.flatMap(url => imageUrls(url, variants)));
  await Promise.allSettled([...urls].map(url => keepImage(cache, url)));
}

self.addEventListener('install', event => {
  event.waitUntil(precache());

  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const keys = await caches.keys();
      const oldCaches = keys.filter(
        k =>
          (k.startsWith('leapmultix-offline-') || k.startsWith('leapmultix-runtime-')) &&
          !k.endsWith(VERSION)
      );

      await Promise.all(oldCaches.map(k => caches.delete(k)));

      await self.clients.claim();
    })()
  );
});

// La page demande la version de ce service worker (js/cache-updater.js) : elle ne se
// recharge que si ce n'est pas la sienne
self.addEventListener('message', event => {
  if (event.data?.type === 'version') event.ports?.[0]?.postMessage({ version: VERSION });
});

/** Un clip ne se garde que s'il est bien un MP3 du site, reçu en entier */
function isStorableClip(response) {
  return (
    response.status === 200 &&
    response.type === 'basic' &&
    !response.redirected &&
    (response.headers.get('content-type') || '').startsWith('audio/mpeg')
  );
}

async function voiceClip(event) {
  const cache = await caches.open(VOICE_CACHE);
  const hit = await cache.match(event.request);
  if (hit) return hit;
  let response;
  try {
    response = await fetch(event.request);
  } catch {
    // Hors ligne et pas en cache : échec immédiat, le jeu passe à la voix de l'appareil
    return Response.error();
  }
  if (isStorableClip(response)) event.waitUntil(cache.put(event.request, response.clone()));
  return response;
}

/** Versions qu'annonce une langue de l'index : sa voix par défaut et ses autres voix */
function announcedVersions(entry) {
  const others = Array.isArray(entry?.alternatives) ? entry.alternatives : [];
  return [entry?.version, ...others.map(voice => voice?.version)];
}

/**
 * Nouvel index : retire les clips des versions (ou des langues) qu'il n'annonce plus,
 * puis les plus anciens au-delà du plafond. Hors du chemin de la réponse.
 */
async function pruneVoiceCache(index) {
  const languages = index && typeof index.languages === 'object' ? index.languages : null;
  if (!languages) return;
  const cache = await caches.open(VOICE_CACHE);
  const clips = (await cache.keys()).filter(request =>
    VOICE_CLIP.test(new URL(request.url).pathname)
  );
  const isCurrent = request => {
    const [, lang, version] = VOICE_CLIP.exec(new URL(request.url).pathname);
    return announcedVersions(languages[lang]).includes(version);
  };
  const stale = clips.filter(request => !isCurrent(request));
  const kept = clips.filter(isCurrent);
  const excess = kept.slice(0, Math.max(0, kept.length - VOICE_CACHE_LIMIT));
  await Promise.all([...stale, ...excess].map(request => cache.delete(request)));
}

async function voiceIndex(event) {
  const cache = await caches.open(VOICE_CACHE);
  try {
    const response = await fetch(event.request);
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(
        cache
          .put(VOICE_INDEX, copy.clone())
          .then(() => copy.json())
          .then(pruneVoiceCache)
          .catch(() => {})
      );
    } else if ([403, 404, 410].includes(response.status)) {
      // Index retiré : sa copie ne doit pas revenir hors ligne
      event.waitUntil(cache.delete(VOICE_INDEX));
    }
    return response;
  } catch {
    // Hors ligne : la dernière copie de l'index
    return (await cache.match(VOICE_INDEX)) || Response.error();
  }
}

function sameOrigin(url) {
  try {
    return new URL(url, self.location.origin).origin === self.location.origin;
  } catch {
    return false;
  }
}

/** Copie gardée par cette version : le préchargement d'abord, puis ce qui a servi en ligne */
async function cachedCopy(key) {
  const offline = await caches.open(OFFLINE_CACHE);
  const hit = await offline.match(key);
  if (hit) return hit;
  const runtime = await caches.open(RUNTIME_CACHE);
  return runtime.match(key);
}

/** ?v= absent, ou celui de ce service worker (« v37 », « v=v37 » pour les traductions) */
function isOwnVersion(url) {
  const version = url.searchParams.get('v');
  return version === null || version.replace(/^v=/, '') === VERSION;
}

/**
 * Copie d'une requête : l'adresse exacte, sinon le même fichier sans paramètres, tel que le
 * préchargement le garde. La page demande ses modules avec ?v=<version> (deploy.sh,
 * lazy-loader.js) : un module d'une autre version n'est pas remplacé par celui-ci, qui
 * pourrait ne plus lui correspondre. Une image, elle, se remplace sans risque.
 * @param {Request} request
 * @param {boolean} [anyVersion=false]
 * @returns {Promise<Response|undefined>}
 */
async function cachedResponse(request, anyVersion = false) {
  const exact = await cachedCopy(request);
  if (exact) return exact;
  const url = new URL(request.url);
  if (!url.search || !(anyVersion || isOwnVersion(url))) return undefined;
  return cachedCopy(url.pathname);
}

/**
 * Famille d'une image : un sprite et ses tailles, ou les fonds d'un même avatar
 * @param {string} pathname
 * @returns {string|null} null pour une image sans famille
 */
function imageFamily(pathname) {
  const sprite = SPRITE_FAMILY.exec(pathname);
  if (sprite) return `sprite:${sprite[1]}`;
  const background = BACKGROUND_FAMILY.exec(pathname);
  return background ? `fond:${background[1]}` : null;
}

/** Largeur d'une variante (« -128.webp ») ; l'original passe avant toutes */
function variantWidth(request) {
  const width = SPRITE_FAMILY.exec(new URL(request.url).pathname)?.[2];
  return width ? Number(width) : Number.POSITIVE_INFINITY;
}

/**
 * Hors ligne, une image jamais gardée : la plus grande de sa famille parmi les copies
 * @param {Request} request
 * @returns {Promise<Response|undefined>}
 */
async function familyImage(request) {
  const family = imageFamily(new URL(request.url).pathname);
  if (!family) return undefined;
  const stores = await Promise.all([OFFLINE_CACHE, RUNTIME_CACHE].map(name => caches.open(name)));
  const keys = (await Promise.all(stores.map(store => store.keys()))).flat();
  const members = keys.filter(key => imageFamily(new URL(key.url).pathname) === family);
  if (members.length === 0) return undefined;
  const best = members.reduce((a, b) => (variantWidth(b) > variantWidth(a) ? b : a));
  return cachedCopy(best);
}

async function imageResponse(event) {
  const { request } = event;
  const cached = await cachedResponse(request, true);
  if (cached) return cached;
  try {
    const net = await fetch(request);
    if (net.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      event.waitUntil(cache.put(request, net.clone()));
    }
    return net;
  } catch {
    return (await familyImage(request)) || Response.error();
  }
}

async function translationResponse(event) {
  const { request } = event;
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cachedResponse(request);
  const fetchPromise = fetch(request)
    .then(net => {
      if (net.ok) event.waitUntil(cache.put(request, net.clone()));
      return net;
    })
    .catch(() => null);
  // La copie en cache part tout de suite : la mise à jour se poursuit après la réponse,
  // et le service worker reste actif jusqu'à sa fin
  event.waitUntil(fetchPromise);
  return cached || (await fetchPromise) || Response.error();
}

async function networkFirst(event) {
  const { request } = event;
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const net = await fetch(request, { cache: 'no-store' });
    if (net.ok) event.waitUntil(cache.put(request, net.clone()));
    return net;
  } catch {
    return (await cachedResponse(request)) || Response.error();
  }
}

/**
 * Plage d'octets d'un en-tête Range (« bytes=0- », « bytes=100-199 », « bytes=-500 »)
 * @param {string} header
 * @param {number} size - Taille du fichier entier
 * @returns {{start: number, end: number}|null} null si l'en-tête est illisible ou en
 *   demande plusieurs
 */
function byteRange(header, size) {
  const match = BYTE_RANGE.exec(header.trim());
  if (!match) return null;
  const [, first, last] = match;
  // « bytes=-500 » : les 500 derniers octets
  if (first === '') {
    return last === '' ? null : { start: Math.max(0, size - Number(last)), end: size - 1 };
  }
  const end = last === '' ? size - 1 : Math.min(Number(last), size - 1);
  return { start: Number(first), end };
}

/**
 * Un son demande une plage d'octets (Safari l'exige) : la copie entière en sert la partie
 * demandée (206), ou l'ensemble si la demande est illisible
 */
async function rangeResponse(request, response) {
  const header = request.headers.get('range');
  if (!header || response.status !== 200) return response;
  const body = await response.arrayBuffer();
  const headers = new Headers(response.headers);
  const range = byteRange(header, body.byteLength);
  if (!range) return new Response(body, { status: 200, headers });
  if (range.start > range.end) {
    headers.set('Content-Range', `bytes */${body.byteLength}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set('Content-Range', `bytes ${range.start}-${range.end}/${body.byteLength}`);
  headers.set('Content-Length', String(range.end - range.start + 1));
  return new Response(body.slice(range.start, range.end + 1), { status: 206, headers });
}

/** Sons, polices, manifeste, carte des images : la copie préchargée, sinon le réseau */
async function precachedResponse(request) {
  const cached = await cachedResponse(request);
  return cached ? rangeResponse(request, cached) : fetch(request);
}

/**
 * Hors ligne : la page du jeu pour l'adresse du site, une page gardée, sinon offline.html
 * @param {Request} request
 * @returns {Promise<Response|undefined>}
 */
async function offlinePage(request) {
  const cache = await caches.open(OFFLINE_CACHE);
  const { pathname } = new URL(request.url);
  const page = SHELL_PATHS.has(pathname) ? SHELL_URL : pathname;
  return (await cache.match(page)) || cache.match(OFFLINE_URL);
}

async function navigationResponse(request) {
  try {
    return await fetch(request);
  } catch {
    return (await offlinePage(request)) || Response.error();
  }
}

/**
 * Réponse d'un fichier du site selon sa nature
 * @param {FetchEvent} event
 * @param {string} pathname
 * @returns {Promise<Response>|null} null : le navigateur s'en charge seul
 */
function assetResponse(event, pathname) {
  const { destination } = event.request;
  if (destination === 'image') return imageResponse(event);
  if (TRANSLATIONS.test(pathname)) return translationResponse(event);
  if (destination === 'script' || destination === 'style') return networkFirst(event);
  // Vidéos : jamais préchargées, lues par plages ; le navigateur s'en charge seul
  if (destination === 'video') return null;
  return precachedResponse(event.request);
}

/**
 * Réponse du service worker
 * @param {FetchEvent} event
 * @returns {Promise<Response>|null} null : la requête suit son cours sans lui
 */
function routeRequest(event) {
  const { request } = event;
  if (request.method !== 'GET') return null;
  if (request.mode === 'navigate') return navigationResponse(request);
  if (!sameOrigin(request.url)) return null;
  const { pathname } = new URL(request.url);
  if (pathname === VOICE_INDEX) return voiceIndex(event);
  if (VOICE_CLIP.test(pathname)) return voiceClip(event);
  return assetResponse(event, pathname);
}

self.addEventListener('fetch', event => {
  const response = routeRequest(event);
  if (response) event.respondWith(response);
});

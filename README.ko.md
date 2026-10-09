<details>
<summary>이 문서는 다른 언어로도 제공됩니다</summary>

- [영어](./README.en.md)
- [스페인어](./README.es.md)
- [포르투갈어](./README.pt.md)
- [독일어](./README.de.md)
- [중국어](./README.zh.md)
- [힌디어](./README.hi.md)
- [아랍어](./README.ar.md)
- [이탈리아어](./README.it.md)
- [스웨덴어](./README.sv.md)
- [폴란드어](./README.pl.md)
- [네덜란드어](./README.nl.md)
- [루마니아어](./README.ro.md)
- [일본어](./README.ja.md)
- [한국어](./README.ko.md)

</details>

# LeapMultix

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![라이선스: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy 배지](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![품질 게이트 상태](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![신뢰성 등급](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![보안 등급](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![유지보수성 등급](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![기술 부채](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![버그](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![취약점](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![코드 스멜](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![중복된 줄 비율(%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![코드 줄 수](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## 목차

- [설명](#설명)
- [개요](#-개요)
- [기능](#-기능)
- [빠른 시작](#-빠른-시작)
- [아키텍처](#-아키텍처)
- [게임 모드 상세 설명](#-게임-모드-상세-설명)
- [개발](#-개발)
- [호환성](#-호환성)
- [현지화](#-현지화)
- [녹음 음성](#-녹음-음성)
- [데이터 저장](#-데이터-저장)
- [문제 신고](#-문제-신고)
- [라이선스](#-라이선스)

## 설명

LeapMultix는 6세부터 12세까지의 어린이가 곱셈(×), 덧셈(+), 뺄셈(−), 나눗셈(÷)의 네 가지 산술 연산을 익힐 수 있도록 만든 대화형 교육용 웹 애플리케이션입니다. 직관적이고 접근성이 뛰어난 다국어 인터페이스에서 **6가지 게임 모드**와 **4가지 아케이드 미니게임**을 제공합니다.

**다중 연산 지원:** 모든 모드에서 네 가지 연산을 사용할 수 있습니다. 홈 화면에서 연산을 선택하면 전체 학습 과정에 적용됩니다.

**개발자:** Julien LS (contact@jls42.org)

**온라인 URL:** https://leapmultix.jls42.org/

## 📸 개요

### 화면

|                                                                                                                    |                                                                                                  |
| :----------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
|                       ![“누가 플레이하나요?” 화면: 프로필 선택](docs/media/01-accueil.webp)                        |                  ![기본 메뉴: 연산 및 게임 모드 선택](docs/media/02-menu.webp)                   |
|             **누가 플레이하나요?** — 어린이마다 아바타와 학습 진도를 담은 프로필을 하나씩 사용합니다.              |                  **메뉴** — 여기에서 연산을 선택한 다음 게임 모드를 선택합니다.                  |
|                           ![탐색 모드: 점으로 표현된 4단](docs/media/03-decouverte.webp)                           |           ![퀴즈 모드: 오답은 빨간색, 정답은 초록색으로 표시](docs/media/04-quiz.webp)           |
|                 **탐색** — 각 등식을 점, 뛰기 또는 세기로 표현하고 구구단 요령을 함께 보여 줍니다.                 | **퀴즈** — 어린이가 선택한 답을 정답 옆에 계속 표시하며, 해설에서 계산 과정을 자세히 설명합니다. |
|                         ![도전 모드: 카운트다운과 현재 연속 정답](docs/media/05-defi.webp)                         |         ![모험 모드: 다음 단계가 잠겨 있는 10개 레벨 지도](docs/media/06-aventure.webp)          |
|                  **도전** — 시간과 겨루는 게임입니다. 틀리면 정답을 읽는 동안 타이머가 멈춥니다.                   |                     **모험** — 별을 얻으며 차례대로 열리는 10개 레벨입니다.                      |
|                     ![타임어택 모드: 뺄셈 경주, 타이머와 진행 상황](docs/media/14-chrono.webp)                     |                  ![아케이드 메뉴: 네 가지 미니게임](docs/media/07-arcade.webp)                   |
|        **타임어택** — 선택한 연산으로 정답 10개를 최대한 빨리 맞힙니다. 틀린 계산은 복습 목록에 추가됩니다.        |         **아케이드** — 난이도를 조절하고 우주선을 선택할 수 있는 네 가지 미니게임입니다.         |
|    ![대시보드: 연산별로 세분화된 각 모드의 플레이 기록, 최고 기록 및 정답](docs/media/08-tableau-de-bord.webp)     |             ![개인 설정: 아바타, 테마, 접근성](docs/media/09-personnalisation.webp)              |
| **대시보드** — 각 모드의 플레이 기록과 최고 기록을 연산별로 보여 주며, 곱셈에서는 별과 복습할 구구단도 표시합니다. |  **개인 설정** — 코인으로 잠금 해제하는 아바타, 색상 테마, 글자 크기, 고대비 설정을 제공합니다.  |

### 아케이드 미니게임

네 가지 게임은 게임 영역 위에 표시되는 동일한 문제를 제시하며 남은 시간과 목숨도 함께 보여 주지만, 게임마다 서로 다른 조작을 요구합니다.

|                                                                                                    |                                                                                 |
| :------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
| ![MultiInvaders: 숫자를 달고 있는 괴물들과 화면 아래쪽의 우주선](docs/media/10-multiinvaders.webp) |  ![MultiMiam: 가능한 답이 적힌 먹이가 놓인 미로](docs/media/11-multimiam.webp)  |
|   **MultiInvaders** — 오답을 쏘고 정답은 피하세요. 정답 뒤에는 구출해야 할 친구가 숨어 있습니다.   |       **MultiMiam** — 괴물을 피하면서 미로를 돌아다니며 정답을 잡으세요.        |
| ![MultiMemory: 계산식과 숫자가 보이도록 카드 두 장이 뒤집힌 격자](docs/media/12-multimemory.webp)  | ![MultiSnake: 초원에 있는 뱀과 숫자가 적힌 사과](docs/media/13-multisnake.webp) |
|              **MultiMemory** — 뒤집힌 계산식의 결과가 적힌 카드를 기억해 찾아내세요.               |  **MultiSnake** — 정답인 숫자를 먹어 몸을 키우고 나머지 숫자는 모두 피하세요.   |

## ✨ 기능

### 🎮 게임 모드

- **탐색 모드**: 각 연산에 맞게 구성된 시각적 대화형 학습
- **퀴즈 모드**: 네 가지 연산(×, +, −, ÷)과 적응형 진도를 지원하는 객관식 문제
- **도전 모드**: 네 가지 연산(×, +, −, ÷)과 다양한 난이도로 진행하는 시간제한 경주
- **모험 모드**: 네 가지 연산을 지원하는 레벨별 이야기 진행
- **타임어택 모드**: 네 가지 연산(×, +, −, ÷)으로 멈추지 않는 타이머에 맞서 정답 10개를 풀고 자신의 최고 기록에 도전

### 🕹️ 아케이드 미니게임

- **MultiInvaders**: 교육용 Space Invaders - 오답 파괴하기
- **MultiMiam**: 수학 Pac-Man - 정답 모으기
- **MultiMemory**: 기억력 게임 - 연산과 결과 짝짓기
- **MultiSnake**: 교육용 Snake - 정답인 숫자를 먹으며 성장하기

### ➕ 다중 연산 지원

LeapMultix는 **모든 모드**에서 네 가지 산술 연산을 완전하게 연습할 수 있도록 지원합니다.

| 모드     | ×   | +   | −   | ÷   |
| -------- | --- | --- | --- | --- |
| 퀴즈     | ✅  | ✅  | ✅  | ✅  |
| 도전     | ✅  | ✅  | ✅  | ✅  |
| 탐색     | ✅  | ✅  | ✅  | ✅  |
| 모험     | ✅  | ✅  | ✅  | ✅  |
| 타임어택 | ✅  | ✅  | ✅  | ✅  |
| 아케이드 | ✅  | ✅  | ✅  | ✅  |

### 🌍 공통 기능

- **다중 사용자**: 어린이마다 진도를 담은 프로필을 하나씩 사용합니다. 교실용 기기에서는 이름 정렬, 플레이어가 10명 이상일 때 필터, 30일간 보관되는 휴지통, 플레이어 데이터를 파일로 저장하는 기능을 제공합니다
- **다국어**: 프랑스어, 영어, 스페인어 지원
- **개인 설정**: 아바타(첫 번째는 자유롭게 선택하고, 나머지는 플레이로 얻은 코인 50개씩을 사용해 잠금 해제), 색상 테마, 배경
- **접근성**: 완전한 키보드 탐색, 터치 지원, 아케이드 일시 정지, 글자 크기 및 고대비 설정을 제공합니다. axe-core로 검사했으며 살펴본 화면에서 WCAG A 또는 AA 수준 위반이 없습니다
- **녹음 음성**: 게임은 미리 녹음된 합성 음성으로 문제와 격려 문구를 읽을 수 있으며, 사용할 수 없으면 기기의 음성으로 자동 전환됩니다. 음성 파일은 이 저장소에 포함되어 있지 않습니다. leapmultix.jls42.org 사이트에서는 프랑스어로 Lucie, 영어와 스페인어로 Sulafat을 제공하며, 선택 항목으로 프랑스어는 Sulafat과 Marie, 영어는 Jane을 제공합니다([녹음 음성](#-녹음-음성) 참조)
- **모바일 반응형**: 태블릿과 스마트폰에 최적화된 인터페이스
- **진도 시스템**: 프로필별 대시보드(연산별로 세분화된 플레이 기록, 최고 기록, 복습할 구구단), 배지, 일일 도전, 코인(타임어택, 모험, 도전 및 오늘의 도전에서 획득)

## 🚀 빠른 시작

### 사전 요구 사항

- Node.js(16 이상)
- 최신 웹 브라우저

### 설치

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

### 사용 가능한 스크립트

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

## 🧱 아키텍처

### 파일 구조

JavaScript 모듈은 세 폴더(`core/`, `components/`, `modes/`)를 제외하고 **`js/`에 단일 계층으로 배치**되어 있습니다. 따라서 파일 이름이 그룹을 나타냅니다(`arcade-*`, `multimiam-*`, `i18n*`…).

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

### 기술 아키텍처

**최신 ES6 모듈**: 이 프로젝트는 ES6 클래스와 네이티브 import/export를 사용하는 모듈식 아키텍처를 채택합니다.

**재사용 가능한 컴포넌트**: 중앙 집중식 UI 컴포넌트(TopBar, InfoBar, Dashboard, Customization)로 인터페이스를 구성합니다.

**Lazy Loading**: 초기 성능을 최적화하기 위해 `lazy-loader.js`을 통해 필요할 때 모듈을 지능적으로 불러옵니다.

**통합 저장 시스템**: fallback을 지원하는 LocalStorage를 통해 사용자 데이터를 영구 저장하는 중앙 집중식 API를 제공합니다.

**중앙 집중식 오디오 관리**: 다국어 지원 및 사용자별 환경 설정과 함께 소리를 제어합니다.

**Event Bus**: 유지보수하기 쉬운 아키텍처를 위해 컴포넌트 간 이벤트 기반 통신을 분리합니다.

**슬라이드 기반 탐색**: `goToSlide()`을 사용하며 번호가 지정된 슬라이드(slide0, slide1 등)를 기반으로 하는 탐색 시스템입니다.

**보안**: 모든 DOM 조작에 `security-utils.js`을 사용하여 XSS를 방지하고 데이터를 정제합니다.

## 🎯 게임 모드 상세 설명

### 탐색 모드

각 연산에 맞게 구성된 시각적 학습 인터페이스로 다음 기능을 제공합니다.

- 곱셈을 대화형으로 시각화
- 애니메이션과 기억 보조 기능
- 교육용 드래그 앤드 드롭
- 구구단별 자유로운 진도 진행

### 퀴즈 모드

다음 기능을 제공하는 객관식 문제입니다.

- 세션당 문제 10개
- 성취도에 따른 적응형 진도
- 가상 숫자 키패드
- 연속 정답 시스템

### 도전 모드

다음 기능을 제공하는 시간제한 경주입니다.

- 세 가지 난이도(초급, 중급, 고급)
- 정답을 맞히면 시간 보너스 제공
- 목숨 시스템
- 최고 점수 순위

### 모험 모드

다음 기능을 제공하는 이야기식 진행 모드입니다.

- 잠금 해제할 수 있는 10개의 테마별 레벨
- 진도를 시각적으로 보여 주는 대화형 지도
- 캐릭터가 등장하는 몰입형 이야기
- 별과 보상 시스템

### 타임어택 모드

멈추지 않는 타이머에 맞서 최대한 빠르게 정답 10개를 맞힙니다.

- 네 가지 연산: 곱셈 설정에서 지정한 구구단과 덧셈(7 + k), 뺄셈((7 + k) − 7), 나눗셈((7 × k) ÷ 7)의 모든 연산표
- 선택지 또는 숫자 키패드로 답변하며 클릭과 키보드를 모두 지원
- 연산별 최고 기록, 평균 시간, 최근 플레이 기록 그래프
- “내가 복습할 계산”: 연산별 목록을 양방향으로 복습(6 × 7과 7 × 6, 15 − 7과 15 − 8)

### 대시보드

어린이가 실제로 플레이한 내용을 프로필별로 보여 줍니다.

- 모험의 별과 복습할 구구단(각 구구단의 최근 답변 20개)
- 퀴즈, 도전, 모험, 타임어택의 문제 수와 정답 수
- 포기한 플레이를 포함하여 각 모드와 미니게임의 플레이 기록 및 최고 기록을 보여 주며, 어린이가 여러 연산을 연습하기 시작하면 연산별로 세분화

### 아케이드 미니게임

각 미니게임은 다음 기능을 제공합니다.

- 네 가지 연산에서 세 가지 난이도
- 목숨 및 점수 시스템
- 게임 안내 화면에서 설명하는 마우스, 키보드, 터치 조작
- 일시 정지: 시간 옆의 버튼 또는 P 키를 사용합니다. 탭이 숨겨져도 게임이 일시 정지되며 자동으로 다시 시작되지 않습니다
- MultiMemory: 선택에 따라 시간제한 없이 플레이 가능
- 사용 가능한 공간에 맞춘 게임판(세로 방향 휴대전화에서는 가로보다 세로가 김)과 전체 화면을 컴퓨터 및 휴대전화에서 지원하며, 휴대전화를 회전한 경우도 포함합니다(브라우저가 허용하지 않는 iPhone 제외)
- 플레이어별 최고 점수 제공. “초기화”를 선택하면 삭제되는 모든 항목을 안내합니다

## 🔧 개발

### 개발 워크플로

**절대로 main에 직접 커밋하지 마세요.** 프로젝트는 기능 브랜치를 사용합니다.

**1. 브랜치 생성:** 기능은 `feat/`, 버그 수정은 `fix/`을 사용합니다.

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 개발 및 검증:** 포맷 검사가 가장 먼저 실행되며, CI는 테스트를 실행하기도 전에 포맷 오류를 거부합니다.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. 브랜치에 커밋한 후 push합니다.**

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. pull request를 열고 분석 결과를 기다립니다:** verify, Codacy, CodeFactor, SonarCloud. 모두 통과할 때까지 수정한 후 병합합니다.

**커밋 스타일**: 간결한 명령형 메시지 사용(예: "Fix arcade init errors", "Refactor cache updater")

**품질 게이트**: 커밋하기 전에 매번 `npm run lint`, `npm test`, `npm run test:coverage`이 통과하는지 확인합니다

### 컴포넌트 아키텍처

**GameMode(기본 클래스)**: 모든 모드는 표준화된 메서드를 갖춘 공통 클래스를 상속합니다.

**GameModeManager**: 모드 실행과 관리를 중앙에서 조정합니다.

**UI 컴포넌트**: TopBar, InfoBar, Dashboard, Customization이 일관된 인터페이스를 제공합니다.

**Lazy Loading**: 초기 성능을 최적화하기 위해 필요할 때 모듈을 불러옵니다.

**Event Bus**: 이벤트 시스템을 통해 컴포넌트 간 통신을 분리합니다.

### 테스트

프로젝트에는 포괄적인 테스트 모음이 포함되어 있습니다.

- core 모듈 단위 테스트
- 컴포넌트 통합 테스트
- 게임 모드 테스트
- 자동화된 코드 커버리지

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### 프로덕션 빌드

- **Rollup**: code-splitting과 sourcemap을 사용하여 `js/main-es6.js`을 ESM으로 bundle
- **Terser**: 최적화를 위한 자동 minification
- **빌드 후 처리**: `css/`, `assets/`, favicon(`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`을 복사하고 `dist/index.html`을 해시가 포함된 진입점 파일로 다시 작성(예: `main-es6-*.js`)
- **최종 폴더**: 정적 서비스 준비가 완료된 `dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 지속적 통합

**GitHub Actions**: `.github/workflows/ci.yml`은 `main`에 push할 때마다, 그리고 pull request가 생성될 때마다 실행됩니다.

**`verify`** — 차단형 품질 게이트:

- `npm ci` 실행 후 `npm run verify` 실행(ESLint, Jest 테스트, 커버리지)
- `npm run format:check`(Prettier)

**`seo-report`** — `verify` 이후: 운영 중인 사이트를 Lighthouse로 감사하여 시간에 따른 SEO 지표를 추적합니다.

pull request에 연결된 **외부 분석 도구**: Codacy, CodeFactor, SonarCloud. SonarCloud 게이트는 새 코드의 신뢰성, 보안성, 유지보수성에서 모두 A 등급을 요구합니다.

**배포**: `./deploy.sh`은 사이트를 S3와 동기화하고 CloudFront 캐시를 무효화합니다. 필요한 경우 스크립트가 git에 없는 반응형 이미지를 다시 생성합니다.

### PWA(Progressive Web App)

LeapMultix는 오프라인 지원과 설치 기능을 갖춘 완전한 PWA입니다.

**Service Worker**(`sw.js`):

- 설치: 게임에 필요한 모든 항목을 미리 불러옵니다. 목록은 `scripts/precache-list.mjs`이 코드에서 생성하며(`npm run precache:update`, 테스트로 검증됨), 처음 한 번 방문한 뒤에는 6가지 모드와 4가지 Arcade 게임을 오프라인에서 실행할 수 있습니다.
- 탐색: Network-first이며 4초 기한이 있습니다. 기한이 지나면(학교 Wi-Fi, 캡티브 포털처럼 응답하지 않는 네트워크) 또는 오프라인에서는 캐시된 게임 페이지를 사용하며, 한 번도 저장되지 않은 페이지에만 `offline.html`을 사용합니다.
- 이미지: Cache-first. 오프라인에서는 같은 sprite의 다른 크기나 같은 avatar의 다른 배경을 사용합니다.
- 번역: 백그라운드 업데이트를 위해 Stale-while-revalidate를 사용합니다.
- JS/CSS: 이 버전의 파일(`?v=`가 붙은 주소, 즉 배포된 사이트의 주소)은 먼저 미리 저장된 사본에서 제공되며, 구조상 같은 버전입니다. 서버는 `?v=`를 무시하므로, 그렇지 않으면 배포 후 다른 버전을 제공할 수 있습니다. 그 밖의 파일(개발 중 `?v=` 없음)은 Network-first를 사용하며, 이 버전의 사본으로 넘어가기 전에 같은 4초 기한을 둡니다.
- 사운드와 글꼴: Cache-first를 사용하며 바이트 범위를 제공합니다(Safari 오디오 플레이어).
- `cache-updater.js`을 통한 자동 버전 관리

**Manifest**(`manifest.json`):

- 모든 기기용 SVG 및 PNG 아이콘
- 모바일에 설치 가능(Add to Home Screen)
- 앱과 같은 경험을 위한 standalone 구성
- 테마 및 색상 지원

**로컬에서 오프라인 모드 테스트하기.** 서버를 시작한 다음 `http://localhost:8080` 또는 표시된 포트를 엽니다.

```bash
npm run serve
```

수동으로 테스트하려면 Service Worker가 게임을 등록할 때까지 페이지를 열어 둔 뒤 서버를 중지하거나 기기의 네트워크를 끄고 페이지를 새로 고칩니다. 게임이 표시되고 각 모드가 실행되어야 합니다.

Puppeteer를 사용해 자동으로 테스트하려면:

```bash
npm run test:pwa-offline
```

**Service Worker 관리 스크립트**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### 품질 표준

**코드 품질 도구**:

- **ESLint**: flat config(`eslint.config.js`)를 사용하는 최신 구성, ES2022 지원
- **Prettier**: 자동 코드 서식 지정(`.prettierrc`)
- **Stylelint**: CSS 검증(`.stylelintrc.json`)
- **JSDoc**: 커버리지 분석을 포함한 자동 함수 문서화

**중요한 코드 규칙**:

- 사용하지 않는 변수와 매개변수 제거(`no-unused-vars`)
- 구체적인 오류 처리 사용(빈 catch 금지)
- `innerHTML` 대신 `security-utils.js` 함수 사용
- 함수의 인지 복잡도를 15 미만으로 유지
- 복잡한 함수를 더 작은 helper로 분리

**보안**:

- **XSS 방지**: `security-utils.js`의 함수 사용:
  - `innerHTML` 대신 `appendSanitizedHTML()` 사용
  - 안전한 요소를 생성할 때 `createSafeElement()` 사용
  - 텍스트 콘텐츠에 `setSafeMessage()` 사용
- **외부 스크립트**: `crossorigin="anonymous"` 속성 필수
- **입력 검증**: 외부 데이터는 항상 sanitize 처리
- **Content Security Policy**: 스크립트 출처를 제한하는 CSP header

**접근성**:

- axe-core로 검사하는 WCAG 2.1 AA 수준을 목표로 하며, A 또는 AA 수준 위반이나 모범 사례 위반이 없어야 합니다.
- 완전한 키보드 탐색
- ARIA 역할 및 접근 가능한 이름
- axe-core로 명암비 검증

**성능**:

- `lazy-loader.js`을 통한 모듈 lazy loading
- CSS 최적화 및 반응형 asset
- 지능형 캐싱을 위한 Service Worker
- 운영 환경의 code splitting 및 minification

## 📱 호환성

### 지원 브라우저

인터페이스는 색상에 `oklch()`을, 상황별 상태에 `:has()`을 사용하므로 최소 지원 버전은 다음과 같습니다.

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### 기기

- **Desktop**: 키보드 및 마우스 조작
- **태블릿**: 최적화된 터치 인터페이스
- **스마트폰**: 적응형 반응형 디자인

### 접근성

- 완전한 키보드 탐색: Tab, 답변 격자와 MultiMemory 카드에서의 방향키, Enter, Esc를 지원하며, 홈 화면 상단에 「게임 모드로 이동」 링크가 있습니다.
- 게임을 종료하는 규칙은 하나뿐입니다. 「포기」, Esc 또는 상단 표시줄의 버튼은 모두 같은 확인 질문을 표시하며, 어린이가 거부하면 게임이 계속됩니다.
- 스크린 리더: 각 답변은 해당 질문과 연결되고, 화면마다 1단계 제목이 하나씩 있으며, 메시지는 음성으로 안내됩니다.
- 페이지는 손가락으로 확대할 수 있습니다(Arcade 게임 제외). 텍스트 크기, 고대비, 동작 줄이기를 지원하며, 읽기를 처음 배우는 사용자를 위해 설계된 Andika 기반 읽기용 글꼴을 제공합니다.
- Arcade: 버튼, P 키 또는 숨겨진 탭으로 일시 정지할 수 있으며, MultiMemory에서는 시간제한 없이 플레이하도록 선택할 수 있습니다.
- axe-core로 검사했습니다(WCAG 2.0~2.2, A 및 AA 수준과 모범 사례). 컴퓨터 화면 너비의 41개 화면과 휴대전화 화면 너비(390 px)의 40개 화면에서 위반 사항이 없으며, 야간 테마와 고대비 모드도 포함됩니다.

## 🌍 현지화

완전한 다국어 지원:

- **프랑스어**(기본 언어)
- **영어**
- **스페인어**

### 번역 관리

**번역 파일:** `assets/translations/*.json`

**형식:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n 관리 스크립트

**`npm run i18n:verify`** - 번역 key의 일관성 검사

**`npm run i18n:unused`** - 사용되지 않는 번역 key 나열

**`npm run i18n:compare`** - 번역 파일을 fr.json(기준)과 비교

이 스크립트(`scripts/compare-translations.cjs`)는 모든 언어 파일이 동기화되도록 보장합니다.

**기능:**

- 누락된 key 감지(fr.json에는 있지만 다른 언어에는 없는 key)
- 추가된 key 감지(다른 언어에는 있지만 fr.json에는 없는 key)
- 빈 값 식별(`""`, `null`, `undefined`, `[]`)
- 타입 일관성 검사(string과 array 비교)
- 중첩된 JSON 구조를 점 표기법으로 평탄화(예: `arcade.multiMemory.title`)
- 상세한 console 보고서 생성
- JSON 보고서를 `docs/translations-comparison-report.json`에 저장

**출력 예시:**

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

**번역 범위:**

- 전체 사용자 인터페이스
- 게임 안내
- 오류 및 피드백 메시지
- 설명 및 상황별 도움말
- 모험 모드의 서사 콘텐츠
- 접근성 및 ARIA label

## 🔊 녹음 음성

게임은 질문, 격려, 설명을 소리 내어 읽어 줍니다. 언어마다 약 7,400개의 한정된 문장만 말하므로 한 번만 녹음해 두면 되며, 이후 게임 중에는 어떤 음성 합성 서비스도 호출하지 않습니다. clip이 없으면 기기의 음성으로 읽습니다.

### 이 저장소: 음성 파일이 없는 애플리케이션

코드는 미리 녹음된 clip을 재생할 수 있으며 이를 생성하는 도구 모음도 포함합니다. 하지만 clip과 공급업체 key는 저장소에 포함되지 않으므로 fork나 로컬 설치에서는 기기의 음성으로 읽습니다.

- **자동 대체**는 문장별로 기기의 음성을 사용합니다. clip이 없거나 오류가 발생한 경우, 브라우저가 재생을 거부한 경우, clip이 1.5초 안에 시작되지 않은 경우 또는 오프라인 상태에서 해당 clip이 캐시에 없는 경우에 적용됩니다.
- **설정**: 상단 표시줄의 음성 버튼으로 읽기를 켜거나 끕니다. 「녹음 음성」 확인란(접근성 및 조작)에서 녹음 음성과 기기 음성 중 하나를 선택합니다. 이 확인란은 녹음 음성이 공개된 언어에서만 표시됩니다.
- **오프라인**: 이미 들은 clip은 캐시에 유지됩니다(Service Worker).
- **게임이 clip을 찾는 위치**: 저장소에서는 비어 있는 `<meta name="leapmultix-voice-base">` 태그입니다. 운영 배포에서만 여기에 `/voice/`을 기록합니다.

아래 도구 모음으로 생성하여 `../leapmultix-voices`에서 게임과 나란히 배치한 자체 clip이 로컬 컴퓨터에 있다면, `?voix=local` 매개변수를 사용해 개발 서버에서 재생할 수 있습니다.

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org: 호스팅에서 제공하는 음성

저자가 제공하는 사이트에서는 녹음된 합성 음성을 사용합니다.

- 프랑스어는 ElevenLabs(Eleven v3 모델)로 만든 **Lucie**를 사용합니다.
- 영국 영어와 스페인 스페인어는 Google Cloud Text-to-Speech(Chirp 3 HD 음성)로 만든 **Sulafat**을 사용합니다.
- 플레이어가 선택하면 세 언어에서 같은 음성을 유지할 수 있도록 프랑스어에도 **Sulafat**을 사용할 수 있습니다.
- 플레이어가 선택할 수 있는 또 다른 음성으로는 Mistral AI(Voxtral TTS)로 만든 프랑스어 **Marie**와 영어 **Jane**이 있습니다.

clip은 비공개 저장소와 전용 S3 bucket에 저장되며 `/voice/*`의 CloudFront를 통해 제공됩니다. clip은 한 번만 생성되며 게임 중에는 이러한 서비스로 아무것도 전송되지 않습니다. 설정의 「음성」 메뉴는 여러 음성이 있는 언어에서 사용할 음성을 제시하며, 안내 문구에는 현재 들리는 음성의 서비스 이름이 표시됩니다.

### clip 생성

도구 모음은 `scripts/voice/`에 스크립트로 작성되어 있으며 공개 CI에서는 실행되지 않고 소유자의 컴퓨터에서만 실행됩니다. 공급업체 key(Lucie용 ElevenLabs, Sulafat용 Google Cloud Text-to-Speech, Marie 및 Jane용 Mistral)는 저장소 외부의 `.env` 파일에 보관되고 `node --env-file`를 통해 전달되므로 어떤 key도 git에 들어가지 않습니다. Claude Code skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md)은 절차를 단계별로 안내하며(게이트, 승인, 재개), 자세한 내용은 [`docs/voix-enregistree.md`](docs/voix-enregistree.md)에 있습니다.

1. **추산**: 남은 문장 수와 비용이 부과될 문자 수를 계산합니다(Eleven v3: 문자당 약 0.53 credit, Chirp 3 HD: 문자 100만 개당 30 $, 매월 첫 100만 개는 무료, Voxtral TTS: 100만 개당 16 $).
2. **생성**: 같은 명령을 다시 실행하면 누락된 부분부터 재개합니다. credit이 소진되면 스크립트는 파일을 반쯤 작성된 상태로 남기지 않고 정상적으로 중지됩니다(code 3). `--max-total-chars`은 해당 버전의 누적 지출 상한을 설정합니다. 비용이 발생한 각 응답은 수신 즉시 기록부에 기록되며, 갑작스러운 중단 후에도 유지됩니다. 확인 가능한 잔액을 제공하지 않는 Google과 Mistral에서는 이것이 유일한 보호 장치입니다.
3. **검사**: 모든 문장에 clip이 있고 각 MP3가 유효한지 확인합니다. 그런 다음 Whisper가 각 clip을 로컬에서 transcribe하며, 검사 과정에서 잘못 인식된 숫자와 비정상적인 길이를 표시합니다. `voice:review`은 Whisper, 이 검사, 청취 페이지를 하나의 명령으로 연이어 실행합니다.
4. **청취**: 청취 페이지(`voice:listen`)에서 표시된 clip과 Whisper가 구별하지 못하는 여성형 표현(「une fois 7」) 표본을 듣습니다. 각 clip에는 「다시 만들기」 확인란이 있으며, 선택하면 제외된 clip 목록에 추가됩니다.
5. **재생성**: 제외된 clip을 다시 만들고(`--redo`) Whisper를 다시 실행한 다음, 두 번째 페이지에서 각 clip의 변경 전후를 비교합니다. 두세 번 시도한 뒤에도 잘못 발음되는 clip에는 `SAID_OVERRIDES`(`scripts/voice/said-text.mjs`)에서 강제 텍스트를 지정합니다. 예를 들어 숫자를 글자로 모두 적습니다.
6. **공개**: clip을 공개하고 온라인에서 응답하는지 확인한 다음, 먼저 테스터를 대상으로 언어 index를 공개합니다(`?voix=test`).
7. **전체 공개**: 모든 사용자에게 음성을 개방한 다음 기본값으로 활성화합니다. 차단 스위치(`voice:publish -- remove`)는 index에서 언어를 제거하며, 게임은 기기의 음성으로 돌아갑니다.

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

### 규칙: 발화 문장이 변경되면 운영 배포 전에 다시 녹음합니다

모든 발화 문장은 번역(`assets/translations/{fr,en,es}.json`)에서 가져오며 corpus의 일부입니다. 따라서 발화 문장을 변경하면 corpus 잠금 테스트(`scripts/voice/corpus.lock.json`)가 실패합니다. 녹음 음성이 있는 언어에서는 변경된 문장의 clip을 생성하고 검사하고 청취한 다음, 병합하기 **전에** 공개해야 합니다. 마지막으로 잠금을 업데이트합니다(`npm run voice:corpus:lock`). 해당 clip이 없으면 변경된 문장은 기기의 음성으로 읽습니다.

## 📊 데이터 저장

### 사용자 데이터

- 프로필 및 환경설정
- 게임 모드별 진행 상황
- Arcade 게임의 점수 및 통계
- 사용자 지정 설정

### 기술적 기능

- fallback을 지원하는 로컬 저장소(localStorage). 브라우저에는 이를 자체적으로 삭제하지 않도록 요청합니다(`navigator.storage.persist()`).
- 삭제된 플레이어 휴지통: 모든 데이터를 30일 동안 보관하며 「누가 플레이하나요?」에서 복원할 수 있습니다.
- 플레이어 데이터를 JSON 파일에 저장하고 이 기기 또는 다른 기기에서 복원할 수 있습니다. 이미 존재하는 플레이어는 절대 덮어쓰지 않습니다.
- 계산별 통계를 포함한 게임 데이터는 프로필별로 분리됩니다. 공용 컴퓨터에서 한 플레이어의 실수가 다른 플레이어에게 제시되는 질문에 영향을 주지 않습니다.
- 진행 상황 자동 저장
- 이전 데이터 자동 마이그레이션

## 🐛 문제 신고

문제는 GitHub issue를 통해 신고할 수 있습니다. 다음 정보를 포함해 주세요.

- 문제에 대한 자세한 설명
- 문제를 재현하는 단계
- 브라우저 및 버전
- 관련된 경우 screenshot

## 💝 프로젝트 후원

**[☕ PayPal로 후원하기](https://paypal.me/jls)**

## 📄 라이선스

이 프로젝트는 AGPL v3 라이선스를 따릅니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

_LeapMultix — 사칙연산을 배우기 위한 자유 교육 애플리케이션_

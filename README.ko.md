<details>
<summary>이 문서는 다른 언어로도 제공됩니다</summary>

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
![라이선스: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy 배지](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate 상태](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![신뢰성 등급](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![보안 등급](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![유지보수성 등급](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![기술적 부채](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![버그](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![취약점](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![코드 스멜](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![중복 코드 줄 수 (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![코드 줄 수](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## 목차

- [설명](#설명)
- [미리보기](#-미리보기)
- [주요 기능](#-주요-기능)
- [빠른 시작](#-빠른-시작)
- [아키텍처](#-아키텍처)
- [상세 게임 모드](#-상세-게임-모드)
- [개발](#-개발)
- [호환성](#-호환성)
- [현지화](#-현지화)
- [녹음된 음성](#-녹음된-음성)
- [데이터 저장](#-데이터-저장)
- [문제 신고](#-문제-보고)
- [라이선스](#-라이선스)

## 설명

LeapMultix는 6세부터 12세까지의 어린이가 사칙연산(곱셈(×), 덧셈(+), 뺄셈(−), 나눗셈(÷))을 마스터할 수 있도록 돕는 대화형 교육용 웹 애플리케이션입니다. 직관적이고 접근성이 뛰어나며 다국어를 지원하는 인터페이스에서 **5가지 게임 모드**와 **4가지 아케이드 미니게임**을 제공합니다.

**다중 연산 지원:** 5가지 모드 모두 4가지 연산을 지원합니다. 시작 화면에서 선택하며 전체 진행 과정에 적용됩니다.

**개발자:** Julien LS (contact@jls42.org)

**온라인 URL:** https://leapmultix.jls42.org/

## 📸 미리보기

### 화면 구성

|                                                                                               |                                                                                                |
| :-------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: |
|             !['누가 플레이하나요?' 화면: 프로필 선택](docs/media/01-accueil.webp)             |                 ![메인 메뉴: 연산 및 5가지 모드 선택](docs/media/02-menu.webp)                 |
|          **누가 플레이하나요?** — 아바타와 진행 상황이 포함된 어린이별 개별 프로필.           |                    **메뉴** — 여기서 연산을 선택하면 5가지 모드가 열립니다.                    |
|                ![탐구 모드: 점으로 표시된 4단](docs/media/03-decouverte.webp)                 |              ![퀴즈 모드: 오답은 빨간색, 정답은 초록색](docs/media/04-quiz.webp)               |
| **탐구** — 각 연산식이 점, 건너뛰기 또는 셈하기로 표시되며, 해당 단의 꿀팁도 함께 제공됩니다. | **퀴즈** — 어린이가 선택한 답이 정답 옆에 표시되며, 계산 과정에 대한 자세한 설명이 제공됩니다. |
|              ![도전 모드: 카운트다운과 진행 중인 연승](docs/media/05-defi.webp)               |           ![모험 모드: 10개 레벨 맵, 다음 레벨은 잠김](docs/media/06-aventure.webp)            |
|      **도전** — 시간과의 싸움. 오답 시 정답을 확인할 수 있도록 타이머가 일시 정지됩니다.      |                    **모험** — 별을 획득하여 순차적으로 열리는 10개의 레벨.                     |
|                  ![아케이드 메뉴: 4가지 미니게임](docs/media/07-arcade.webp)                  |               ![대시보드: 단별 별점 및 통계](docs/media/08-tableau-de-bord.webp)               |
|               **아케이드** — 난이도 조절과 우주선 선택이 가능한 4가지 미니게임.               |                    **대시보드** — 단별 별점, 복습이 필요한 단, 모드별 점수.                    |
|            ![맞춤 설정: 아바타, 테마, 접근성](docs/media/09-personnalisation.webp)            |                                                                                                |
|          **맞춤 설정** — 아바타, 색상 테마, 텍스트 크기, 고대비, 자녀 보호 비밀번호.          |                                                                                                |

### 아케이드 미니게임

남은 시간 및 하트와 함께 게임 영역 위에 표시되는 동일한 문제를 다루지만, 매번 다른 방식의 플레이를 요구하는 4가지 게임입니다.

|                                                                                                       |                                                                                 |
| :---------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
|     ![MultiInvaders: 숫자가 적힌 몬스터들과 화면 하단의 우주선](docs/media/10-multiinvaders.webp)     | ![MultiMiam: 보기 숫자가 적힌 알약들이 있는 미로](docs/media/11-multimiam.webp) |
|  **MultiInvaders** — 오답을 격추하고 정답은 남겨두세요. 정답 속에 구출해야 할 친구가 숨어 있습니다.   |   **MultiMiam** — 몬스터를 피하면서 미로를 돌아다녀 올바른 결과를 획득하세요.   |
| ![MultiMemory: 카드 격자, 연산식과 숫자가 보이는 뒤집힌 두 장의 카드](docs/media/12-multimemory.webp) | ![MultiSnake: 풀밭 위의 뱀과 번호가 적힌 사과들](docs/media/13-multisnake.webp) |
|            **MultiMemory** — 뒤집힌 연산식의 결과가 적힌 카드를 기억을 더듬어 찾아내세요.             |  **MultiSnake** — 올바른 숫자를 먹어 몸집을 키우고, 다른 숫자는 모두 피하세요.  |

## ✨ 주요 기능

### 🎮 게임 모드

- **탐구 모드**: 각 연산에 맞춘 시각적이고 대화형인 탐구
- **퀴즈 모드**: 사칙연산(×, +, −, ÷)을 지원하는 객관식 퀴즈 및 맞춤형 난이도 조절
- **도전 모드**: 사칙연산(×, +, −, ÷)과 다양한 난이도를 제공하는 시간 제한 도전
- **모험 모드**: 사칙연산을 지원하는 레벨별 스토리 진행

### 🕹️ 아케이드 미니게임

- **MultiInvaders**: 교육용 Space Invaders - 오답 격추하기
- **MultiMiam**: 수학 팩맨 - 정답 수집하기
- **MultiMemory**: 기억력 게임 - 연산식과 결과 연결하기
- **MultiSnake**: 교육용 스네이크 - 올바른 숫자를 먹고 성장하기

### ➕ 다중 연산 지원

LeapMultix는 **모든 모드**에서 사칙연산에 대한 포괄적인 학습을 제공합니다:

| 모드     | ×   | +   | −   | ÷   |
| -------- | --- | --- | --- | --- |
| 퀴즈     | ✅  | ✅  | ✅  | ✅  |
| 도전     | ✅  | ✅  | ✅  | ✅  |
| 탐구     | ✅  | ✅  | ✅  | ✅  |
| 모험     | ✅  | ✅  | ✅  | ✅  |
| 아케이드 | ✅  | ✅  | ✅  | ✅  |

### 🌍 공통 기능

- **다중 사용자**: 진행 상황이 저장되는 개별 프로필 관리
- **다국어 지원**: 프랑스어, 영어, 스페인어 지원
- **맞춤 설정**: 아바타, 색상 테마, 배경
- **접근성**: 키보드 탐색, 터치 지원, WCAG 2.1 AA 준수
- **녹음된 음성**: 사전 녹음된 음성 합성을 통해 문제와 응원 문구를 읽어주며, 필요시 기기의 기본 음성으로 자동 전환됩니다. 음성 파일은 이 저장소에 포함되어 있지 않습니다. leapmultix.jls42.org 웹사이트에서는 프랑스어로 Lucie, 영어 및 스페인어로 Sulafat을 제공하며, 선택적으로 프랑스어 Marie 및 영어 Jane을 제공합니다([녹음된 음성](#-녹음된-음성) 참조)
- **모바일 반응형**: 태블릿과 스마트폰에 최적화된 인터페이스
- **성취 시스템**: 점수, 배지, 일일 챌린지

## 🚀 빠른 시작

### 사전 요구 사항

- Node.js (버전 16 이상)
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

## 🧱 아키텍처

### 파일 구조

JavaScript 모듈은 세 개의 폴더(`core/`, `components/`, `modes/`)를 제외하고 **`js/` 내에 플랫(단일 수준)하게** 위치합니다. 따라서 파일 이름을 통해 그룹화가 이루어집니다(`arcade-*`, `multimiam-*`, `i18n*` 등).

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

### 기술 아키텍처

**최신 ES6 모듈**: 이 프로젝트는 ES6 클래스와 네이티브 import/export를 사용하는 모듈식 아키텍처를 채택하고 있습니다.

**재사용 가능한 컴포넌트**: 중앙 집중식 UI 컴포넌트(TopBar, InfoBar, Dashboard, Customization)로 구축된 인터페이스입니다.

**지연 로딩 (Lazy Loading)**: 초기 성능을 최적화하기 위해 `lazy-loader.js`을 통해 필요에 따라 모듈을 지능적으로 로드합니다.

**통합 스토리지 시스템**: 폴백(fallback) 메커니즘을 갖춘 LocalStorage를 통해 사용자 데이터 지속성을 제공하는 중앙 집중식 API입니다.

**중앙 집중식 오디오 관리**: 다국어 지원 및 사용자별 환경설정을 갖춘 사운드 제어 기능입니다.

**이벤트 버스 (Event Bus)**: 유지보수가 용이한 아키텍처를 위해 컴포넌트 간의 분리된 이벤트 기반 통신을 지원합니다.

**슬라이드 기반 내비게이션**: `goToSlide()`을 사용한 번호가 매겨진 슬라이드(slide0, slide1 등) 기반 내비게이션 시스템입니다.

**보안**: 모든 DOM 조작 시 `security-utils.js`을 통한 XSS 방지 및 살균(sanitization)을 적용합니다.

## 🎯 상세 게임 모드

### 탐구 모드

다음을 포함하는 구구단 시각 탐색 인터페이스:

- 대화형 곱셈 시각화
- 애니메이션 및 요약 팁
- 교육용 드래그 앤 드롭
- 단별 자유로운 진행

### 퀴즈 모드

다음을 포함하는 객관식 질문:

- 세션당 10개 문제
- 정답률에 따른 맞춤형 난이도 조절
- 가상 숫자 키패드
- 연속 정답(스트릭) 시스템

### 도전 모드

다음을 포함하는 시간 제한 도전:

- 3단계 난이도(초급, 중급, 고급)
- 정답 시 보너스 시간 제공
- 라이프(하트) 시스템
- 최고 점수 순위표

### 모험 모드

다음을 포함하는 스토리 기반 진행:

- 잠금 해제 가능한 10개의 테마별 레벨
- 시각적 진행 상황이 표시되는 인터랙티브 맵
- 캐릭터와 함께하는 몰입감 있는 이야기
- 별 및 보상 시스템

### 아케이드 미니게임

각 미니게임에서 제공하는 기능:

- 난이도 선택 및 맞춤 설정
- 라이프 및 점수 시스템
- 키보드 및 터치 조작
- 사용자별 개별 순위표

## 🔧 개발

### 개발 워크플로

**main 브랜치에 직접 커밋하지 마세요.** 이 프로젝트는 기능별 브랜치를 통해 작업합니다.

**1. 브랜치 생성**: 새로운 기능은 `feat/`, 버그 수정은 `fix/`:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 개발 및 검증.** 코드 포맷팅을 먼저 확인해야 합니다. CI는 테스트를 실행하기 전에 포맷팅 오류부터 검사하여 거부합니다.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. 브랜치에 커밋** 후 푸시:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Pull Request 생성** 후 분석(verify, Codacy, CodeFactor, SonarCloud)을 대기합니다. 병합하기 전에 모든 검사가 통과(녹색)할 때까지 수정합니다.

**커밋 스타일**: 간결한 메시지, 명령형 어조(예: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: 매 커밋 전에 `npm run lint`, `npm test`, `npm run test:coverage`가 통과하는지 확인하세요.

### 컴포넌트 아키텍처

**GameMode (기본 클래스)**: 모든 모드는 표준화된 메서드를 갖춘 공통 클래스를 상속합니다.

**GameModeManager**: 모드의 실행 및 관리를 중앙에서 조율합니다.

**UI 컴포넌트**: TopBar, InfoBar, Dashboard, Customization이 일관된 인터페이스를 제공합니다.

**지연 로딩**: 초기 성능을 최적화하기 위해 모듈을 요청 시 로드합니다.

**이벤트 버스**: 이벤트 시스템을 통해 컴포넌트 간 분리된 통신을 수행합니다.

### 테스트

이 프로젝트에는 다음과 같은 종합 테스트 스위트가 포함되어 있습니다:

- 핵심 모듈 단위 테스트
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

- **Rollup**: 코드 분할 및 소스 맵을 지원하는 ESM 형태로 `js/main-es6.js` 번들링
- **Terser**: 최적화를 위한 자동 코드 경량화(Minification)
- **빌드 후 작업**: `css/`, `assets/`, 파비콘(`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` 복사 및 해시된 엔트리 파일(예: `main-es6-*.js`)을 가리키도록 `dist/index.html` 재작성
- **최종 디렉터리**: 정적 서비스 제공 준비가 완료된 `dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 지속적 통합 (CI)

**GitHub Actions**: `.github/workflows/ci.yml`, `main` 브랜치로의 매 푸시 및 풀 리퀘스트마다 실행됩니다.

**`verify`** — 차단 기준이 되는 품질 게이트(Quality Gate):

- `npm ci` 후 `npm run verify` (ESLint, Jest 테스트, 커버리지)
- `npm run format:check` (Prettier)

**`seo-report`** — `verify` 이후 실행: 장기적인 SEO 지표를 추적하기 위한 라이브 사이트의 Lighthouse 감사.

**풀 리퀘스트와 연동된 외부 분석 도구**: Codacy, CodeFactor, SonarCloud. SonarCloud 게이트는 새 코드에 대해 신뢰성, 보안, 유지보수성 등급 A를 요구합니다.

**배포**: `./deploy.sh` 스크립트가 사이트를 S3에 동기화하고 CloudFront 캐시를 무효화합니다. Git에 포함되지 않은 반응형 이미지가 필요한 경우 스크립트가 이를 재생성합니다.

### PWA (프로그레시브 웹 앱)

LeapMultix는 오프라인 지원 및 설치가 가능한 완전한 PWA입니다.

**Service Worker** (`sw.js`):

- 내비게이션: Network-first 방식, 오프라인 시 `offline.html`로 대체
- 이미지: 성능 최적화를 위한 Cache-first 방식
- 번역: 백그라운드 업데이트를 위한 Stale-while-revalidate 방식
- JS/CSS: 항상 최신 버전을 제공하기 위한 Network-first 방식
- `cache-updater.js`을 통한 자동 버전 관리

**Manifest** (`manifest.json`):

- 모든 기기를 위한 SVG 및 PNG 아이콘
- 모바일 설치 지원(홈 화면에 추가)
- 앱과 유사한 경험을 제공하는 standalone 구성
- 테마 및 색상 지원

**로컬에서 오프라인 모드 테스트하기.** 서버를 시작한 후 `http://localhost:8080`(또는 표시된 포트)을 엽니다:

```bash
npm run serve
```

수동 테스트: 개발자 도구(네트워크 탭, 오프라인 모드)에서 네트워크를 차단한 후 페이지를 새로고침합니다. `offline.html`이 표시되어야 합니다.

Puppeteer를 사용한 자동 테스트:

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

- **ESLint**: 플랫 구성(`eslint.config.js`)을 적용한 최신 설정, ES2022 지원
- **Prettier**: 코드 자동 서식 지정(`.prettierrc`)
- **Stylelint**: CSS 유효성 검사(`.stylelintrc.json`)
- **JSDoc**: 커버리지 분석을 포함한 함수 자동 문서화

**주요 코드 규칙**:

- 사용되지 않는 변수 및 매개변수 제거(`no-unused-vars`)
- 구체적인 오류 처리 사용(빈 catch 블록 금지)
- `innerHTML` 대신 `security-utils.js` 함수 권장
- 함수의 인지 복잡도 < 15 유지
- 복잡한 함수는 더 작은 헬퍼 함수로 분리

**보안**:

- **XSS 방지**: `security-utils.js` 함수 사용:
  - `innerHTML` 대신 `appendSanitizedHTML()` 사용
  - 안전한 요소 생성을 위한 `createSafeElement()`
  - 텍스트 콘텐츠를 위한 `setSafeMessage()`
- **외부 스크립트**: `crossorigin="anonymous"` 속성 필수
- **입력 유효성 검사**: 외부 데이터는 항상 새니타이즈(정제)
- **Content Security Policy**: 스크립트 소스를 제한하는 CSP 헤더

**접근성**:

- WCAG 2.1 AA 준수
- 완전한 키보드 탐색 지원
- 적절한 ARIA 역할 및 라벨
- 표준을 준수하는 색상 대비

**성능**:

- `lazy-loader.js`를 통한 모듈 지연 로딩(Lazy loading)
- CSS 최적화 및 반응형 에셋
- 지능형 캐싱을 위한 Service Worker
- 프로덕션 환경에서의 코드 분할(Code splitting) 및 축소(Minification)

## 📱 호환성

### 지원 브라우저

인터페이스는 색상에 `oklch()`를, 컨텍스트 상태에 `:has()`를
사용하므로 최소 지원 사양은 다음과 같습니다:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### 기기

- **데스크톱**: 키보드 및 마우스 제어
- **태블릿**: 최적화된 터치 인터페이스
- **스마트폰**: 적응형 반응형 디자인

### 접근성

- 완전한 키보드 탐색(Tab, 화살표 키, Esc)
- 스크린 리더를 위한 ARIA 역할 및 라벨
- 표준을 준수하는 색상 대비
- 보조 공학 기술 지원

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

**`npm run i18n:verify`** - 번역 키의 일관성 확인

**`npm run i18n:unused`** - 사용되지 않는 번역 키 목록 확인

**`npm run i18n:compare`** - fr.json(기준)과 번역 파일 비교

이 스크립트(`scripts/compare-translations.cjs`)는 모든 언어 파일의 동기화를 보장합니다:

**기능:**

- 누락된 키 감지(fr.json에는 있으나 다른 언어에는 없음)
- 불필요한 추가 키 감지(다른 언어에는 있으나 fr.json에는 없음)
- 비어 있는 값 식별(`""`, `null`, `undefined`, `[]`)
- 타입 일관성 확인(string 대 array)
- 중첩된 JSON 구조를 점 표기법으로 평탄화(예: `arcade.multiMemory.title`)
- 상세한 콘솔 보고서 생성
- `docs/translations-comparison-report.json`에 JSON 보고서 저장

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

**번역 적용 범위:**

- 전체 사용자 인터페이스
- 게임 설명
- 오류 및 피드백 메시지
- 설명 및 상황별 도움말
- 모험 모드의 스토리 콘텐츠
- 접근성 및 ARIA 라벨

## 🔊 녹음된 음성

게임은 질문, 격려 및 설명을 음성으로 읽어줍니다. 게임에서 사용되는 문장은 언어당 약 7,400개로 유한하므로 한 번에 모두 녹음할 수 있으며, 플레이 중에는 음성 합성 서비스를 호출하지 않습니다. 오디오 클립이 없으면 게임은 기기의 내장 음성으로 읽어줍니다.

### 이 저장소: 음성을 제외한 애플리케이션

코드에는 사전 녹음된 클립을 재생하는 기능과 이를 생성하는 파이프라인이 포함되어 있습니다. 클립 자체와 제공업체 API 키는 포함되어 있지 않으므로, 포크하거나 로컬에 설치한 경우 기기의 내장 음성으로 읽어줍니다.

- **기기 음성으로 자동 대체(폴백)**(문장 단위): 클립이 없거나 오류가 발생한 경우, 브라우저가 재생을 거부한 경우, 1.5초 이내에 클립이 시작되지 않는 경우, 또는 클립이 캐시되지 않은 오프라인 상태인 경우.
- **설정**: 상단 바의 음성 버튼으로 읽기를 켜거나 끌 수 있으며, '녹음된 음성' 체크박스(접근성 및 컨트롤)에서 녹음된 음성과 기기 음성 중 하나를 선택할 수 있습니다. 이 옵션은 음성이 게시된 언어에서만 나타납니다.
- **오프라인**: 이미 재생된 클립은 캐시에 유지됩니다(Service Worker).
- **게임이 클립을 찾는 위치**: 저장소에서는 비어 있는 `<meta name="leapmultix-voice-base">` 태그 내부입니다. 프로덕션 배포에서만 여기에 `/voice/`을 작성합니다.

로컬 컴퓨터에 자체 클립이 있는 경우(아래 파이프라인으로 생성하여 게임 옆 `../leapmultix-voices`에 배치), `?voix=local` 매개변수를 사용하여 개발 서버에서 이를 읽어오도록 할 수 있습니다:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org: 호스팅 제공 음성

작성자가 제공하는 사이트에서는 사전 녹음된 합성 음성을 제공합니다:

- 프랑스어: ElevenLabs(Eleven v3 모델)로 생성된 **Lucie**;
- 영국 영어 및 스페인(스페인 본토) 스페인어: Google Cloud Text-to-Speech(Chirp 3 HD 음성)로 생성된 **Sulafat**;
- 플레이어 선택 옵션: Mistral AI(Voxtral TTS)로 생성된 프랑스어의 **Marie** 및 영어의 **Jane**.

클립은 비공개 저장소와 전용 S3 버킷에 저장되며, `/voice/*`에서 CloudFront를 통해 제공됩니다. 설정의 '음성' 메뉴에는 언어에 여러 음성이 있는 경우 선택지가 제공되며, 안내 문구에 현재 재생 중인 음성의 서비스명이 표시됩니다.

### 클립 생성

파이프라인은 `scripts/voice/`에 스크립트화되어 있으며 공개 CI가 아닌 소유자의 로컬 컴퓨터에서만 실행됩니다. 제공업체 키(프랑스어용 ElevenLabs, 영어 및 스페인어용 Google Cloud Text-to-Speech, Marie와 Jane용 Mistral)는 저장소 외부에 있는 `.env` 파일에 보관되며 `node --env-file`을 통해 전달되므로 Git에 키가 유입되지 않습니다. Claude Code 스킬 [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md)에 단계별 절차(게이트, 승인, 재시도)가 안내되어 있으며, 자세한 내용은 [`docs/voix-enregistree.md`](docs/voix-enregistree.md)에 있습니다.

1. **견적 추정**: 남은 문장과 유료 문자 수 추정(Eleven v3: 문자당 약 0.53 크레딧, Chirp 3 HD: 100만 자당 30달러, 매월 첫 100만 자 무료, Voxtral TTS: 100만 자당 16달러).
2. **생성**: 동일한 명령을 다시 실행하면 누락된 부분을 이어서 처리합니다. 크레딧이 소진되면 스크립트가 반쯤 작성된 파일을 남기지 않고 정상적으로 종료됩니다(코드 3). `--max-total-chars`은 해당 버전의 누적 지출 한도를 제한합니다. 유료 응답은 수신 즉시 레지스트리에 기록되므로 갑작스러운 중단에도 보존됩니다. 잔액 조회를 제공하지 않는 Google 및 Mistral에서는 이것이 유일한 보호 장치입니다.
3. **검증**: 각 문장에 해당하는 클립이 있고 모든 MP3가 유효한지 확인합니다. 그런 다음 Whisper가 로컬에서 각 클립을 전사(텍스트 변환)하며, 검증 과정에서 잘못 인식된 숫자나 비정상적인 길이를 표시합니다. `voice:review`은 Whisper, 이 검증 및 청취 페이지 확인을 단일 명령어로 연결합니다.
4. **청취**: 청취 페이지(`voice:listen`)에서 표시된 클립과 Whisper가 구분하지 못하는 여성형 표현('une fois 7' 등) 샘플을 들어봅니다. 각 클립에는 '다시 녹음' 체크박스가 있어 제외된 클립 목록에 추가할 수 있습니다.
5. **재녹음**: 제외된 클립을 재녹음(`--redo`)하고 Whisper를 다시 실행한 후, 보조 페이지에서 각 클립의 전후를 비교합니다. 2~3회 시도 후에도 여전히 발음이 정확하지 않은 클립은 `SAID_OVERRIDES`(`scripts/voice/said-text.mjs`)에서 지정된 텍스트(예: 숫자를 글자로 풀어쓴 형태)를 할당받습니다.
6. **게시**: 클립을 게시하고 온라인에서 정상 응답하는지 확인한 후, 테스터를 위해 먼저 언어 인덱스를 게시합니다(`?voix=test`).
7. **전체 공개**: 모든 사용자에게 음성을 공개한 후 기본으로 활성화합니다. 서킷 브레이커(`voice:publish -- remove`)는 인덱스에서 언어를 제거하여 게임이 기기 음성으로 되돌아가도록 합니다.

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

### 규칙: 수정된 음성 문장은 프로덕션 배포 전에 다시 녹음해야 함

모든 음성 문장은 번역(`assets/translations/{fr,en,es}.json`)에서 가져오며 코퍼스의 일부입니다. 따라서 발화 문장을 변경하면 코퍼스 잠금 테스트(`scripts/voice/corpus.lock.json`)가 실패합니다. 녹음된 음성이 있는 언어의 경우, 영향을 받는 문장의 클립을 생성하고 검증 및 청취한 후 병합(머지) **전에** 게시해야 합니다. 마지막으로 잠금을 업데이트합니다(`npm run voice:corpus:lock`). 이 클립이 없으면 수정된 문장은 기기 음성으로 읽힙니다.

## 📊 데이터 저장

### 사용자 데이터

- 프로필 및 환경설정
- 게임 모드별 진행 상황
- 아케이드 게임 점수 및 통계
- 개인화 설정

### 기술적 특징

- 폴백을 포함한 로컬 스토리지(localStorage)
- 사용자별 데이터 격리
- 진행 상황 자동 저장
- 이전 데이터 자동 마이그레이션

## 🐛 문제 보고

문제는 GitHub 이슈를 통해 보고할 수 있습니다. 다음 내용을 포함해 주세요:

- 문제에 대한 자세한 설명
- 재현 단계
- 브라우저 및 버전
- 해당하는 경우 스크린샷

## 💝 프로젝트 후원

**[☕ PayPal을 통해 후원하기](https://paypal.me/jls)**

## 📄 라이선스

이 프로젝트는 AGPL v3 라이선스를 따릅니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

_LeapMultix — 사칙연산을 배우기 위한 무료 오픈소스 교육용 애플리케이션_

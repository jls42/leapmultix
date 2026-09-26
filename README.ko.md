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

## 목차

- [설명](#설명)
- [미리보기](#-미리보기)
- [기능](#-기능)
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

LeapMultix는 6세부터 12세까지의 어린이가 사칙연산(곱셈(×), 덧셈(+), 뺄셈(−), 나눗셈(÷))을 마스터할 수 있도록 고안된 대화형 교육용 웹 애플리케이션입니다. 직관적이고 접근성이 뛰어나며 다국어를 지원하는 인터페이스에서 **5가지 게임 모드**와 **4가지 아케이드 미니게임**을 제공합니다.

**다중 연산 지원:** 5가지 모드 모두 사칙연산을 지원합니다. 홈 화면에서 선택하며 전체 진행 과정에 적용됩니다.

**개발자:** Julien LS (contact@jls42.org)

**온라인 URL:** https://leapmultix.jls42.org/

## 📸 미리보기

### 화면

|                                                                                            |                                                                                                   |
| :----------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
|           !['누가 플레이하나요?' 화면: 프로필 선택](docs/media/01-accueil.webp)            |                  ![메인 메뉴: 연산 및 5가지 모드 선택](docs/media/02-menu.webp)                   |
|          **누가 플레이하나요?** — 아이별 아바타와 진행 상황이 포함된 개별 프로필.          |                     **메뉴** — 여기서 연산을 선택하면 5가지 모드가 열립니다.                      |
|               ![탐구 모드: 점으로 표시된 4단](docs/media/03-decouverte.webp)               |                ![퀴즈 모드: 오답은 빨간색, 정답은 초록색](docs/media/04-quiz.webp)                |
|  **탐구** — 각 등식이 점, 수직선 점프 또는 세기로 표시되며, 구구단 팁이 함께 제공됩니다.   | **퀴즈** — 아이가 선택한 답이 정답 옆에 계속 표시되며, 계산 과정에 대한 자세한 설명이 제공됩니다. |
|          ![챌린지 모드: 카운트다운 및 연속 정답 진행 중](docs/media/05-defi.webp)          |        ![어드벤처 모드: 10개 레벨 맵, 다음 레벨은 잠금 상태](docs/media/06-aventure.webp)         |
| **챌린지** — 시간과의 싸움. 오답 발생 시 정답을 확인할 수 있도록 타이머가 일시 정지됩니다. |                     **어드벤처** — 별을 획득하며 차례대로 열리는 10개의 레벨.                     |
|                ![아케이드 메뉴: 4가지 미니게임](docs/media/07-arcade.webp)                 |                ![대시보드: 단별 별점 및 통계](docs/media/08-tableau-de-bord.webp)                 |
|              **아케이드** — 난이도 조절과 기체 선택이 가능한 4가지 미니게임.               |                         **대시보드** — 단별 별점, 복습할 단, 모드별 점수.                         |
|          ![맞춤 설정: 아바타, 테마, 접근성](docs/media/09-personnalisation.webp)           |                                                                                                   |
|          **맞춤 설정** — 아바타, 색상 테마, 텍스트 크기, 고대비, 부모 안심 코드.           |                                                                                                   |

### 아케이드 미니게임

게임 영역 상단에 남은 시간 및 하트(목숨)와 함께 표시되는 동일한 문제를 풀지만, 매번 다른 방식의 조작을 요구하는 4가지 게임입니다.

|                                                                                                           |                                                                                            |
| :-------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: |
|    ![MultiInvaders: 숫자를 달고 있는 몬스터들과 화면 하단의 우주선](docs/media/10-multiinvaders.webp)     | ![MultiMiam: 보기에 해당하는 숫자가 적힌 구슬들이 있는 미로](docs/media/11-multimiam.webp) |
| **MultiInvaders** — 오답을 맞혀 격추하고 정답은 남겨두세요. 정답 속에는 구출해야 할 친구가 숨어 있습니다. |            **MultiMiam** — 몬스터를 피하면서 미로를 탐색하여 정답을 획득하세요.            |
|   ![MultiMemory: 카드 그리드, 연산과 숫자가 뒤집혀 보이는 두 장의 카드](docs/media/12-multimemory.webp)   |      ![MultiSnake: 들판 위의 뱀과 숫자가 적힌 사과들](docs/media/13-multisnake.webp)       |
|           **MultiMemory** — 뒤집힌 연산식의 계산 결과가 적힌 카드를 기억력을 활용해 찾아내세요.           |       **MultiSnake** — 올바른 숫자를 먹어 몸집을 키우고, 다른 숫자는 모두 피하세요.        |

## ✨ 기능

### 🎮 게임 모드

- **탐구 모드**: 각 연산에 맞춘 시각적 대화형 탐색
- **퀴즈 모드**: 사칙연산(×, +, −, ÷)을 지원하는 객관식 문제 및 맞춤형 난이도 조절
- **챌린지 모드**: 사칙연산(×, +, −, ÷)과 다양한 난이도를 제공하는 타임 어택
- **어드벤처 모드**: 사칙연산을 지원하는 스토리 기반 레벨 진행

### 🕹️ 아케이드 미니게임

- **MultiInvaders**: 교육용 Space Invaders - 오답 격추하기
- **MultiMiam**: 수학 Pac-Man - 정답 수집하기
- **MultiMemory**: 기억력 게임 - 연산식과 결과 짝 맞추기
- **MultiSnake**: 교육용 Snake - 올바른 숫자를 먹으며 성장하기

### ➕ 다중 연산 지원

LeapMultix는 **모든 모드**에서 사칙연산에 대한 완벽한 연습을 제공합니다:

| 모드     | ×   | +   | −   | ÷   |
| -------- | --- | --- | --- | --- |
| 퀴즈     | ✅  | ✅  | ✅  | ✅  |
| 챌린지   | ✅  | ✅  | ✅  | ✅  |
| 탐구     | ✅  | ✅  | ✅  | ✅  |
| 어드벤처 | ✅  | ✅  | ✅  | ✅  |
| 아케이드 | ✅  | ✅  | ✅  | ✅  |

### 🌍 공통 기능

- **다중 사용자**: 진행 상황이 저장되는 개별 프로필 관리
- **다국어 지원**: 프랑스어, 영어, 스페인어 지원
- **맞춤 설정**: 아바타, 색상 테마, 배경
- **접근성**: 키보드 탐색, 터치 지원, WCAG 2.1 AA 준수
- **녹음된 음성**: 사전 녹음된 합성 음성으로 문제와 격려 문구를 읽어줄 수 있으며, 기기 자체 음성으로 자동 대체(폴백)됩니다. 음성 파일은 이 저장소에 포함되어 있지 않습니다. leapmultix.jls42.org 사이트에서는 프랑스어로 Lucie 음성을, 영어와 스페인어로 Sulafat 음성을 제공합니다([녹음된 음성](#-녹음된-음성) 참조)
- **모바일 반응형**: 태블릿과 스마트폰에 최적화된 인터페이스
- **성장 시스템**: 점수, 배지, 일일 챌린지

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

JavaScript 모듈은 세 개의 폴더(`core/`, `components/`, `modes/`)를 제외하고 **`js/` 내에 평면적으로** 위치합니다. 따라서 파일 이름으로 그룹화가 이루어집니다(`arcade-*`, `multimiam-*`, `i18n*`…).

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

**모던 ES6 모듈**: 이 프로젝트는 ES6 클래스와 네이티브 import/export를 사용한 모듈식 아키텍처를 채택하고 있습니다.

**재사용 가능한 컴포넌트**: 중앙 집중식 UI 컴포넌트(TopBar, InfoBar, Dashboard, Customization)로 구축된 인터페이스입니다.

**지연 로딩 (Lazy Loading)**: 초기 성능을 최적화하기 위해 `lazy-loader.js`를 통해 모듈을 요청 시 스마트하게 로드합니다.

**통합 스토리지 시스템**: 폴백이 포함된 LocalStorage를 통해 사용자 데이터를 지속하기 위한 중앙 집중식 API입니다.

**중앙 오디오 관리**: 다국어 지원 및 사용자별 환경설정이 가능한 사운드 제어 기능입니다.

**이벤트 버스 (Event Bus)**: 유지보수가 용이한 아키텍처를 위해 컴포넌트 간 디커플링된 이벤트 기반 통신을 수행합니다.

**슬라이드 기반 내비게이션**: `goToSlide()`를 사용하는 번호가 매겨진 슬라이드(slide0, slide1 등) 기반 내비게이션 시스템입니다.

**보안**: 모든 DOM 조작 시 `security-utils.js`를 통한 XSS 방지 및 살균 처리를 수행합니다.

## 🎯 상세 게임 모드

### 탐구 모드

다음을 포함하는 구구단 시각 탐색 인터페이스:

- 곱셈에 대한 대화형 시각화
- 애니메이션 및 암기 도우미
- 교육용 드래그 앤 드롭
- 단별 자유 진행

### 퀴즈 모드

다음을 포함하는 객관식 문제:

- 세션당 10개 문제
- 정답률에 따른 적응형 난이도 조절
- 가상 숫자 키패드
- 스트릭(연속 정답) 시스템

### 챌린지 모드

다음을 포함하는 시간과의 싸움:

- 3단계 난이도 (초급, 중급, 고급)
- 정답에 따른 보너스 시간 제공
- 하트(목숨) 시스템
- 최고 점수 순위표

### 어드벤처 모드

다음을 포함하는 스토리 기반 진행:

- 잠금 해제 가능한 10개의 테마별 레벨
- 시각적 진행도를 보여주는 인터랙티브 맵
- 캐릭터가 등장하는 몰입도 높은 스토리
- 별 및 보상 시스템

### 아케이드 미니게임

각 미니게임에서 제공하는 기능:

- 난이도 선택 및 맞춤 설정
- 하트(목숨) 및 점수 시스템
- 키보드 및 터치 조작 지원
- 사용자별 개별 순위표

## 🔧 개발

### 개발 워크플로

**절대 main 브랜치에 직접 커밋하지 마세요.** 이 프로젝트는 기능 브랜치를 통해 작업합니다.

**1. 브랜치 생성**: 기능 추가는 `feat/`, 버그 수정은 `fix/`:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 개발 및 검증.** 포맷팅 검사가 우선입니다. CI에서는 테스트를 실행하기도 전에 포맷팅 오류를 거부합니다.

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

**4. Pull Request 열기** 및 분석 대기: verify, Codacy, CodeFactor, SonarCloud. 머지하기 전에 모든 항목이 통과(초록불)될 때까지 수정합니다.

**커밋 스타일**: 간결한 메시지, 명령형 어조 (예: "Fix arcade init errors", "Refactor cache updater")

**품질 게이트 (Quality gate)**: 커밋하기 전에 항상 `npm run lint`, `npm test`, `npm run test:coverage`가 통과하는지 확인하세요.

### 컴포넌트 아키텍처

**GameMode (기본 클래스)**: 모든 모드는 표준화된 메서드를 갖춘 공통 클래스를 상속합니다.

**GameModeManager**: 모드의 실행과 관리를 중앙 집중식으로 조율합니다.

**UI 컴포넌트**: TopBar, InfoBar, Dashboard 및 Customization은 일관된 인터페이스를 제공합니다.

**지연 로딩 (Lazy Loading)**: 초기 성능을 최적화하기 위해 모듈을 요청 시 로드합니다.

**이벤트 버스 (Event Bus)**: 이벤트 시스템을 통해 컴포넌트 간 디커플링된 통신을 지원합니다.

### 테스트

이 프로젝트는 포괄적인 테스트 스위트를 포함합니다:

- 코어 모듈 단위 테스트
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

- **Rollup**: 코드 스플리팅 및 소스 맵과 함께 ESM으로 `js/main-es6.js` 번들링
- **Terser**: 최적화를 위한 자동 코드 압축(Minification)
- **빌드 후 작업 (Post-build)**: `css/` 및 `assets/`, 파비콘(`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` 복사, 해시가 포함된 엔트리 파일(예: `main-es6-*.js`)로 `dist/index.html` 다시 쓰기
- **최종 폴더**: 정적 서빙이 준비된 `dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 지속적 통합 (CI)

**GitHub Actions**: `.github/workflows/ci.yml`, `main` 브랜치로의 모든 푸시 및 모든 풀 리퀘스트마다 실행됩니다.

**`verify`** — 차단 기준이 되는 품질 게이트:

- `npm ci` 및 `npm run verify` (ESLint, Jest 테스트, 커버리지)
- `npm run format:check` (Prettier)

**`seo-report`** — `verify` 실행 후: 지속적인 SEO 지표 추적을 위한 온라인 사이트의 Lighthouse 감사.

**풀 리퀘스트와 연동된 외부 분석 도구**: Codacy, CodeFactor, SonarCloud. SonarCloud 게이트는 신규 코드에 대해 신뢰성, 보안 및 유지보수성에서 A 등급을 요구합니다.

**배포**: `./deploy.sh` 스크립트가 사이트를 S3와 동기화하고 CloudFront 캐시를 무효화합니다. 이 스크립트는 git에 포함되지 않은 반응형 이미지를 필요에 따라 재생성합니다.

### PWA (프로그레시브 웹 앱)

LeapMultix는 오프라인 지원과 설치 기능을 갖춘 완전한 PWA입니다.

**Service Worker** (`sw.js`):

- 탐색: 네트워크 우선(Network-first), 오프라인 시 `offline.html`로 폴백
- 이미지: 성능 최적화를 위한 캐시 우선(Cache-first)
- 번역 파일: 백그라운드 업데이트를 위한 Stale-while-revalidate
- JS/CSS: 최신 버전을 항상 제공하기 위한 네트워크 우선(Network-first)
- `cache-updater.js`를 통한 자동 버전 관리

**Manifest** (`manifest.json`):

- 모든 기기용 SVG 및 PNG 아이콘
- 모바일 설치 지원 (홈 화면에 추가)
- 앱과 같은 사용자 경험을 위한 독립 실행형(standalone) 구성
- 테마 및 색상 지원

**로컬에서 오프라인 모드 테스트하기.** 서버를 시작한 다음, `http://localhost:8080`(또는 표시된 포트)을 엽니다:

```bash
npm run serve
```

수동 테스트: 개발자 도구(네트워크 탭, 오프라인 모드)에서 네트워크를 차단한 후 페이지를 새로고침합니다. `offline.html`이 표시되어야 합니다.

Puppeteer를 통한 자동 테스트:

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

- **ESLint**: flat config(`eslint.config.js`)을 적용한 최신 설정, ES2022 지원
- **Prettier**: 자동 코드 포맷팅(`.prettierrc`)
- **Stylelint**: CSS 유효성 검사(`.stylelintrc.json`)
- **JSDoc**: 커버리지 분석 기능이 포함된 함수 자동 문서화

**주요 코딩 규칙**:

- 사용하지 않는 변수 및 매개변수 제거(`no-unused-vars`)
- 구체적인 에러 처리 사용(빈 catch 블록 금지)
- `innerHTML` 대신 `security-utils.js` 함수 사용 지향
- 함수의 인지 복잡도(cognitive complexity) < 15 유지
- 복잡한 함수는 더 작은 헬퍼 함수로 분리

**보안**:

- **XSS 방어**: `security-utils.js` 함수 사용:
  - `innerHTML` 대신 `appendSanitizedHTML()` 사용
  - 안전한 요소 생성을 위한 `createSafeElement()` 사용
  - 텍스트 콘텐츠를 위한 `setSafeMessage()` 사용
- **외부 스크립트**: `crossorigin="anonymous"` 속성 필수 적용
- **입력값 검증**: 외부 데이터는 항상 새니타이즈(정제) 처리
- **콘텐츠 보안 정책(Content Security Policy)**: 스크립트 소스를 제한하는 CSP 헤더 적용

**접근성**:

- WCAG 2.1 AA 준수
- 완전한 키보드 내비게이션
- 적절한 ARIA 역할 및 라벨
- 규격에 맞는 색상 대비

**성능**:

- `lazy-loader.js`를 통한 모듈 레이지 로딩(Lazy loading)
- CSS 최적화 및 반응형 에셋
- 스마트 캐싱을 위한 Service Worker
- 프로덕션 빌드 시 코드 스플리팅 및 압축(minification)

## 📱 호환성

### 지원 브라우저

인터페이스는 색상 처리에 `oklch()`를 사용하고 컨텍스트 상태 처리에 `:has()`를 사용하므로 최소 요구 사항은 다음과 같습니다:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### 기기

- **데스크톱**: 키보드 및 마우스 제어
- **태블릿**: 최적화된 터치 인터페이스
- **스마트폰**: 적응형 반응형 디자인

### 접근성

- 완전한 키보드 내비게이션(Tab, 방향키, Esc)
- 스크린 리더를 위한 ARIA 역할 및 라벨
- 규격에 맞는 색상 대비
- 보조 기술 지원

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

**`npm run i18n:compare`** - 번역 파일을 fr.json(기준 파일)과 비교

이 스크립트(`scripts/compare-translations.cjs`)는 모든 언어 파일 간의 동기화를 보장합니다:

**기능:**

- 누락된 키 감지(fr.json에는 있으나 다른 언어에 없는 키)
- 초과된 키 감지(다른 언어에는 있으나 fr.json에는 없는 키)
- 빈 값 식별(`""`, `null`, `undefined`, `[]`)
- 타입 일관성 검사(문자열 vs 배열)
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

**번역 범위:**

- 전체 사용자 인터페이스
- 게임 안내 문구
- 오류 및 피드백 메시지
- 설명 및 컨텍스트 도움말
- 모험 모드의 스토리 콘텐츠
- 접근성 및 ARIA 라벨

## 🔊 녹음된 음성

이 게임은 질문, 응원 문구, 설명을 음성으로 읽어줍니다. 게임에서 사용되는 문장은 언어당 약 7,400개로 한정되어 있어, 한 번만 녹음해 두면 게임 플레이 중에 외부 음성 합성 서비스를 호출하지 않습니다. 음성 클립이 없으면 게임은 기기의 내장 음성으로 읽어줍니다.

### 본 저장소: 음성이 포함되지 않은 애플리케이션

코드에는 사전 녹음된 클립을 재생하는 기능과 이를 제작하는 파이프라인이 포함되어 있습니다. 단, 음성 클립 자체와 서비스 제공업체 API 키는 포함되어 있지 않으므로, 포크(fork)하거나 로컬에 설치한 버전은 기기의 내장 음성으로 재생됩니다.

- 문장 단위로 기기 내장 음성으로 **자동 대체(폴백)**: 클립이 없거나 오류가 발생한 경우, 브라우저가 재생을 거부한 경우, 클립이 1.5초 이내에 시작되지 않는 경우, 또는 클립이 캐시되지 않은 상태에서 오프라인인 경우.
- **설정**: 상단 표시줄의 음성 버튼으로 읽어주기를 켜거나 끌 수 있습니다. '녹음된 음성' 체크박스(접근성 및 제어)를 통해 녹음된 음성과 기기 내장 음성 중 하나를 선택할 수 있습니다. 이 체크박스는 음성이 배포된 언어에서만 표시됩니다.
- **오프라인**: 이미 재생된 클립은 캐시에 유지됩니다(Service Worker).
- **게임이 클립을 찾는 위치**: 저장소에서는 비어 있는 `<meta name="leapmultix-voice-base">` 태그 내부입니다. 프로덕션 배포 시에만 여기에 `/voice/`이 입력됩니다.

로컬 환경에 직접 생성한 클립이 있는 경우(아래 파이프라인으로 생성하여 게임 옆 `../leapmultix-voices`에 배치), `?voix=local` 매개변수를 사용하여 개발 서버에서 해당 클립을 재생할 수 있습니다:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org: 호스팅 제공 음성

제작자가 제공하는 웹사이트에서는 다음과 같은 녹음된 합성 음성을 제공합니다:

- 프랑스어: ElevenLabs(Eleven v3 모델)로 생성된 **Lucie**
- 영국 영어 및 스페인(본토) 스페인어: Google Cloud Text-to-Speech(Chirp 3 HD 음성)로 생성된 **Sulafat**

음성 클립은 비공개 저장소와 전용 S3 버킷에 저장되며, `/voice/*`의 CloudFront를 통해 제공됩니다. 설정 화면에는 각 언어별로 해당 음성을 생성한 서비스의 이름이 표시됩니다.

### 클립 생성하기

파이프라인은 `scripts/voice/`에 스크립트로 작성되어 있으며 공개 CI가 아닌 소유자의 로컬 PC에서만 실행됩니다. 서비스 제공업체의 키(프랑스어용 ElevenLabs, 영어 및 스페인어용 Google Cloud Text-to-Speech, Mistral 연동 유지)는 저장소 외부에 있는 `.env` 파일에 보관되며 `node --env-file`을 통해 전달되므로 git에 어떠한 키도 커밋되지 않습니다. Claude Code 스킬인 [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md)에 단계별 절차(게이트, 승인, 재시도)가 안내되어 있으며, 자세한 내용은 [`docs/voix-enregistree.md`](docs/voix-enregistree.md)에 나와 있습니다.

1. 남은 문장 수와 비용이 발생하는 문자 수를 **예측**합니다(Eleven v3: 문자당 약 0.53 크레딧, Chirp 3 HD: 100만 자당 $30, 매월 첫 100만 자 무료, Voxtral TTS: 100만 자당 $16).
2. **생성**합니다. 동일한 명령을 다시 실행하면 누락된 부분부터 이어받아 진행됩니다. 크레딧이 소진되면 스크립트가 파일 작성을 비정상적으로 남기지 않고 정상적으로 종료됩니다(코드 3). `--max-total-chars`는 해당 버전의 누적 지출 한도를 제한합니다. 유료 응답은 수신 즉시 레지스터에 기록되어 강제 종료 시에도 데이터가 보존됩니다. 잔액 조회를 제공하지 않는 Google과 Mistral에서는 이것이 유일한 보호 수단입니다.
3. **점검**합니다. 각 문장에 해당하는 클립이 있는지, 각 MP3가 유효한지 확인합니다. 그런 다음 Whisper가 로컬에서 각 클립을 텍스트로 변환하고, 점검 스크립트가 잘못 인식된 숫자와 비정상적인 재생 시간을 보고합니다. `voice:review`를 사용하면 Whisper 실행, 이 점검 작업, 청취 페이지 열기를 단일 명령으로 연속 실행할 수 있습니다.
4. 청취 페이지(`voice:listen`)에서 문제가 보고된 클립과 Whisper가 구분하지 못하는 여성형 표현("une fois 7" 등) 샘플을 직접 **청취**합니다. 각 클립에는 '다시 생성' 체크박스가 있어 제외 클립 목록에 추가할 수 있습니다.
5. 제외된 클립을 **다시 생성**하고(`--redo`) Whisper를 재실행한 뒤, 보조 페이지에서 각 클립의 이전과 이후 상태를 비교합니다. 2~3회 시도 후에도 여전히 발음이 정확하지 않은 클립은 `SAID_OVERRIDES`(`scripts/voice/said-text.mjs`)에 지정된 텍스트(예: 숫자를 철자로 전부 표기)를 부여합니다.
6. 클립을 **배포**하고 온라인에서 정상적으로 응답하는지 확인한 후, 먼저 테스터를 대상으로 언어 인덱스를 배포합니다(`?voix=test`).
7. 음성을 모든 사용자에게 **공개**한 뒤 기본값으로 활성화합니다. 서킷 브레이커(`voice:publish -- remove`)를 사용하면 인덱스에서 특정 언어를 제거하여 게임이 기기 내장 음성으로 즉시 되돌아가도록 할 수 있습니다.

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

### 규칙: 수정된 대사 문장은 프로덕션 배포 전에 다시 녹음해야 합니다

음성으로 읽어주는 모든 문장은 번역 파일(`assets/translations/{fr,en,es}.json`)에서 비롯되며 코퍼스의 일부를 구성합니다. 따라서 음성 문장을 변경하면 코퍼스 잠금 테스트(`scripts/voice/corpus.lock.json`)가 실패합니다. 녹음된 음성이 지원되는 언어의 경우, 변경된 문장의 클립을 생성하고 점검 및 청취를 마친 후 머지(merge)하기 **전에** 배포해야 합니다. 마지막으로 잠금 상태를 업데이트합니다(`npm run voice:corpus:lock`). 이러한 클립이 없으면 수정된 문장은 기기 내장 음성으로 읽히게 됩니다.

## 📊 데이터 저장

### 사용자 데이터

- 프로필 및 환경설정
- 게임 모드별 진행 상황
- 아케이드 게임 점수 및 통계
- 개인화 설정

### 기술적 특징

- 폴백 처리가 포함된 로컬 스토리지(localStorage)
- 사용자별 데이터 격리
- 진행 상황 자동 저장
- 이전 데이터 자동 마이그레이션

## 🐛 문제 보고

문제는 GitHub Issues를 통해 신고할 수 있습니다. 다음 내용을 포함해 주세요:

- 문제에 대한 상세한 설명
- 재현 단계
- 브라우저 및 버전
- 관련된 경우 스크린샷

## 💝 프로젝트 후원하기

**[☕ PayPal을 통해 후원하기](https://paypal.me/jls)**

## 📄 라이선스

이 프로젝트는 AGPL v3 라이선스를 따릅니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

_LeapMultix — 사칙연산을 배우기 위한 오픈 소스 교육용 애플리케이션_

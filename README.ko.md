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
[![중복된 줄 (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
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
- [녹음된 음성](#-녹음-음성)
- [데이터 저장](#-데이터-저장)
- [문제 신고](#-문제-신고)
- [라이선스](#-라이선스)

## 설명

LeapMultix는 6세부터 12세까지의 어린이가 곱셈(×), 덧셈(+), 뺄셈(−), 나눗셈(÷)의 네 가지 산술 연산을 익힐 수 있도록 만든 대화형 교육용 웹 애플리케이션입니다. 직관적이고 접근성이 뛰어난 다국어 인터페이스에서 **5가지 게임 모드**와 **4가지 아케이드 미니게임**을 제공합니다.

**다중 연산 지원:** 다섯 가지 모드 모두 네 가지 연산을 지원합니다. 시작 화면에서 선택한 연산은 전체 학습 과정에 적용됩니다.

**개발자:** Julien LS (contact@jls42.org)

**온라인 URL:** https://leapmultix.jls42.org/

## 📸 개요

### 화면

|                                                                                                     |                                                                                                     |
| :-------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
|                ![“누가 플레이하나요?” 화면: 프로필 선택](docs/media/01-accueil.webp)                |                  ![메인 메뉴: 연산과 다섯 가지 모드 선택](docs/media/02-menu.webp)                  |
| **누가 플레이하나요?** — 어린이마다 아바타와 학습 진도가 포함된 프로필을 하나씩 사용할 수 있습니다. |                 **메뉴** — 여기에서 연산을 선택한 다음 다섯 가지 모드로 이동합니다.                 |
|                   ![탐색 모드: 점으로 표현된 4단](docs/media/03-decouverte.webp)                    |            ![퀴즈 모드: 오답은 빨간색, 정답은 초록색으로 표시](docs/media/04-quiz.webp)             |
|        **탐색** — 각 등식을 점, 건너뛰기 또는 세기로 보여 주며 해당 단의 요령도 제공합니다.         | **퀴즈** — 어린이가 선택한 답을 정답 옆에 계속 표시하고, 해설을 통해 계산 과정을 자세히 설명합니다. |
|               ![도전 모드: 카운트다운과 진행 중인 연속 정답](docs/media/05-defi.webp)               |             ![모험 모드: 다음 단계가 잠긴 10개 레벨 지도](docs/media/06-aventure.webp)              |
|             **도전** — 시간제한 경주입니다. 틀리면 정답을 읽는 동안 타이머가 멈춥니다.              |                       **모험** — 별을 획득하며 차례로 열리는 10개 레벨입니다.                       |
|                    ![아케이드 메뉴: 네 가지 미니게임](docs/media/07-arcade.webp)                    |                   ![대시보드: 단별 별과 통계](docs/media/08-tableau-de-bord.webp)                   |
|          **아케이드** — 난이도를 설정하고 우주선을 선택할 수 있는 네 가지 미니게임입니다.           |                    **대시보드** — 단별 별, 복습할 단, 모드별 점수를 보여 줍니다.                    |
|               ![맞춤 설정: 아바타, 테마, 접근성](docs/media/09-personnalisation.webp)               |                                                                                                     |
|           **맞춤 설정** — 아바타, 색상 테마, 글자 크기, 고대비, 보호자 코드를 설정합니다.           |                                                                                                     |

### 아케이드 미니게임

네 게임 모두 게임 영역 위에 표시되는 동일한 문제와 남은 시간, 목숨을
제시하지만, 게임마다 서로 다른 동작을 요구합니다.

|                                                                                                   |                                                                                 |
| :-----------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
|  ![MultiInvaders: 숫자가 적힌 몬스터들과 화면 아래쪽의 우주선](docs/media/10-multiinvaders.webp)  | ![MultiMiam: 가능한 답이 적힌 알약이 배치된 미로](docs/media/11-multimiam.webp) |
|  **MultiInvaders** — 오답을 쏘고 정답은 피하세요. 정답 안에는 구출해야 할 친구가 숨어 있습니다.   |      **MultiMiam** — 몬스터를 피하면서 미로를 돌아다니며 정답을 잡으세요.       |
| ![MultiMemory: 계산식과 숫자가 보이도록 카드 두 장을 뒤집은 격자](docs/media/12-multimemory.webp) | ![MultiSnake: 초원에 있는 뱀과 숫자가 적힌 사과](docs/media/13-multisnake.webp) |
|              **MultiMemory** — 뒤집힌 계산식의 결과가 적힌 카드를 기억해서 찾으세요.              | **MultiSnake** — 올바른 숫자를 먹어 몸집을 키우고 나머지 숫자는 모두 피하세요.  |

## ✨ 기능

### 🎮 게임 모드

- **탐색 모드**: 각 연산에 맞춘 시각적이고 상호작용적인 학습
- **퀴즈 모드**: 네 가지 연산(×, +, −, ÷)을 지원하고 학습 진도에 맞게 조정되는 객관식 문제
- **도전 모드**: 네 가지 연산(×, +, −, ÷)과 다양한 난이도를 제공하는 시간제한 경주
- **모험 모드**: 네 가지 연산을 지원하는 레벨별 이야기 진행

### 🕹️ 아케이드 미니게임

- **MultiInvaders**: 교육용 Space Invaders - 오답 파괴하기
- **MultiMiam**: 수학 Pac-Man - 정답 모으기
- **MultiMemory**: 기억력 게임 - 연산과 결과 연결하기
- **MultiSnake**: 교육용 Snake - 올바른 숫자를 먹으며 성장하기

### ➕ 다중 연산 지원

LeapMultix는 **모든 모드**에서 네 가지 산술 연산을 완전하게 연습할 수 있도록 지원합니다.

| 모드     | ×   | +   | −   | ÷   |
| -------- | --- | --- | --- | --- |
| 퀴즈     | ✅  | ✅  | ✅  | ✅  |
| 도전     | ✅  | ✅  | ✅  | ✅  |
| 탐색     | ✅  | ✅  | ✅  | ✅  |
| 모험     | ✅  | ✅  | ✅  | ✅  |
| 아케이드 | ✅  | ✅  | ✅  | ✅  |

### 🌍 공통 기능

- **다중 사용자**: 저장된 학습 진도가 포함된 개별 프로필 관리
- **다국어**: 프랑스어, 영어, 스페인어 지원
- **맞춤 설정**: 아바타, 색상 테마, 배경
- **접근성**: 키보드 탐색, 터치 지원, WCAG 2.1 AA 준수
- **녹음된 음성**: 사전 녹음된 합성 음성(ElevenLabs로 제작)이 문제와 격려 문구를 읽어 주며, 사용할 수 없으면 기기 음성으로 자동 전환됩니다. 음성 클립은 공개 저장소에 포함되지 않습니다([녹음된 음성](#-녹음-음성) 참조).
- **모바일 반응형**: 태블릿과 스마트폰에 최적화된 인터페이스
- **진도 시스템**: 점수, 배지, 일일 도전

## 🚀 빠른 시작

### 사전 요구 사항

- Node.js(버전 16 이상)
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
npm run voice:generate     # Générer les clips (ElevenLabs)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 아키텍처

### 파일 구조

JavaScript 모듈은 세 폴더인 `core/`, `components/`, `modes/`을 제외하고
**`js/`에 평면적으로 배치**되어 있습니다. 따라서 파일 이름이 그룹을 나타냅니다
(`arcade-*`, `multimiam-*`, `i18n*`…).

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

**최신 ES6 모듈**: 이 프로젝트는 ES6 클래스와 네이티브 가져오기/내보내기를 사용하는 모듈식 아키텍처를 채택합니다.

**재사용 가능한 구성 요소**: 중앙화된 UI 구성 요소(TopBar, InfoBar, Dashboard, Customization)로 인터페이스를 구성합니다.

**Lazy Loading**: 초기 성능을 최적화하기 위해 `lazy-loader.js`을 통해 필요한 모듈을 지능적으로 불러옵니다.

**통합 저장 시스템**: 대체 처리 기능이 포함된 LocalStorage를 통해 사용자 데이터를 영구 저장하는 중앙화된 API입니다.

**중앙화된 오디오 관리**: 다국어 지원과 사용자별 환경 설정을 제공하는 소리 제어 기능입니다.

**Event Bus**: 유지보수하기 쉬운 아키텍처를 위해 구성 요소 간 통신을 이벤트 기반으로 분리합니다.

**슬라이드 기반 탐색**: `goToSlide()`을 사용하는 번호가 지정된 슬라이드(slide0, slide1 등) 기반의 탐색 시스템입니다.

**보안**: 모든 DOM 조작에 `security-utils.js`을 사용하여 XSS를 방지하고 데이터를 정제합니다.

## 🎯 게임 모드 상세 설명

### 탐색 모드

다음 기능을 제공하는 곱셈표 시각 학습 인터페이스입니다.

- 곱셈을 상호작용 방식으로 시각화
- 애니메이션과 암기 도우미
- 교육용 끌어서 놓기
- 단별 자유 학습

### 퀴즈 모드

다음 기능을 제공하는 객관식 문제입니다.

- 세션당 10개 문제
- 정답률에 따른 적응형 진행
- 가상 숫자 키패드
- 연속 정답 시스템

### 도전 모드

다음 기능을 제공하는 시간제한 경주입니다.

- 세 가지 난이도(초급, 중급, 고급)
- 정답에 대한 추가 시간
- 목숨 시스템
- 최고 점수 순위표

### 모험 모드

다음 기능을 제공하는 이야기형 진행 방식입니다.

- 잠금 해제할 수 있는 10개의 테마별 레벨
- 학습 진도를 시각적으로 보여 주는 대화형 지도
- 등장인물이 나오는 몰입형 이야기
- 별과 보상 시스템

### 아케이드 미니게임

각 미니게임은 다음 기능을 제공합니다.

- 난이도 선택과 맞춤 설정
- 목숨과 점수 시스템
- 키보드와 터치 조작
- 사용자별 개별 순위표

## 🔧 개발

### 개발 워크플로

**절대로 main에 직접 커밋하지 마세요.** 이 프로젝트는 기능별 브랜치에서
작업합니다.

**1. 브랜치를 생성합니다.** 기능에는 `feat/`, 버그 수정에는 `fix/`을 사용합니다.

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 개발하고 검증합니다.** 서식 검사가 가장 먼저 수행되며, 이를 통과하지 못하면 CI가
테스트를 실행하기도 전에 거부합니다.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. 브랜치에 커밋한 다음** 푸시합니다.

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. pull request를 열고** verify, Codacy, CodeFactor,
SonarCloud 분석 결과를 기다립니다. 모든 검사가 통과할 때까지 수정한 후 병합합니다.

**커밋 스타일**: 간결한 명령형 메시지를 사용합니다(예: "Fix arcade init errors", "Refactor cache updater").

**품질 게이트**: 매 커밋 전에 `npm run lint`, `npm test`, `npm run test:coverage`이 통과하는지 확인합니다.

### 구성 요소 아키텍처

**GameMode(기본 클래스)**: 모든 모드는 표준화된 메서드를 갖춘 공통 클래스를 상속합니다.

**GameModeManager**: 모드 실행과 관리를 중앙에서 조정합니다.

**UI 구성 요소**: TopBar, InfoBar, Dashboard, Customization이 일관된 인터페이스를 제공합니다.

**Lazy Loading**: 초기 성능을 최적화하기 위해 필요할 때 모듈을 불러옵니다.

**Event Bus**: 이벤트 시스템을 통해 구성 요소 간 통신을 분리합니다.

### 테스트

이 프로젝트에는 다음과 같은 포괄적인 테스트 모음이 포함되어 있습니다.

- core 모듈 단위 테스트
- 구성 요소 통합 테스트
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

- **Rollup**: 코드 분할과 소스 맵을 적용하여 `js/main-es6.js`을 ESM으로 번들링
- **Terser**: 최적화를 위한 자동 축소
- **빌드 후 처리**: `css/`과 `assets/`, 파비콘(`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`을 복사하고 `dist/index.html`을 해시가 포함된 진입점 파일(예: `main-es6-*.js`)로 재작성
- **최종 폴더**: 정적 서비스 준비가 완료된 `dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 지속적 통합

**GitHub Actions**: `.github/workflows/ci.yml`은
`main`에 푸시하거나 pull request를 열 때마다 실행됩니다.

**`verify`** — 병합을 차단하는 품질 게이트입니다.

- `npm ci` 실행 후 `npm run verify` 실행(ESLint, Jest 테스트, 커버리지)
- `npm run format:check`(Prettier)

**`seo-report`** — `verify` 이후 온라인 사이트를 Lighthouse로 감사하여
시간 경과에 따른 SEO 지표를 추적합니다.

pull request에는 **외부 분석 도구**인 Codacy, CodeFactor,
SonarCloud가 연결되어 있습니다. SonarCloud 게이트는 새 코드의 신뢰성, 보안,
유지보수성에서 모두 A 등급을 요구합니다.

**배포**: `./deploy.sh`은 사이트를 S3에 동기화하고
CloudFront 캐시를 무효화합니다. 이 스크립트는 git에 포함되지 않은 반응형 이미지를 필요할 때 다시 생성합니다.

### PWA (Progressive Web App)

LeapMultix는 오프라인 지원과 설치 기능을 갖춘 완전한 PWA입니다.

**Service Worker**(`sw.js`):

- 탐색: Network-first 방식이며 오프라인에서는 `offline.html`으로 대체
- 이미지: 성능 최적화를 위한 Cache-first 방식
- 번역: 백그라운드 업데이트를 위한 Stale-while-revalidate 방식
- JS/CSS: 항상 최신 버전을 제공하는 Network-first 방식
- `cache-updater.js`을 통한 자동 버전 관리

**Manifest**(`manifest.json`):

- 모든 기기를 위한 SVG 및 PNG 아이콘
- 모바일 설치 지원(Add to Home Screen)
- 앱과 유사한 경험을 위한 standalone 구성
- 테마 및 색상 지원

**로컬에서 오프라인 모드를 테스트합니다.** 서버를 시작한 다음
`http://localhost:8080` 또는 표시된 포트를 엽니다.

```bash
npm run serve
```

수동 테스트: 개발자 도구의 네트워크 탭에서 네트워크를 끄고
오프라인 모드로 전환한 다음 페이지를 새로 고칩니다. `offline.html`이 표시되어야 합니다.

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

- **ESLint**: flat config를 사용하는 최신 구성(`eslint.config.js`), ES2022 지원
- **Prettier**: 자동 코드 포매팅(`.prettierrc`)
- **Stylelint**: CSS 검증(`.stylelintrc.json`)
- **JSDoc**: 커버리지 분석을 포함한 자동 함수 문서화

**중요한 코드 규칙**:

- 사용하지 않는 변수와 매개변수 제거(`no-unused-vars`)
- 구체적인 오류 처리 사용(빈 catch 금지)
- `innerHTML` 대신 `security-utils.js` 함수 사용
- 함수의 인지 복잡도를 15 미만으로 유지
- 복잡한 함수를 더 작은 helper로 분리

**보안**:

- **XSS 보호**: `security-utils.js` 함수 사용:
  - `innerHTML` 대신 `appendSanitizedHTML()` 사용
  - 안전한 요소를 생성할 때 `createSafeElement()` 사용
  - 텍스트 콘텐츠에 `setSafeMessage()` 사용
- **외부 스크립트**: `crossorigin="anonymous"` 속성 필수
- **입력값 검증**: 외부 데이터를 항상 정제
- **Content Security Policy**: 스크립트 출처를 제한하는 CSP header

**접근성**:

- WCAG 2.1 AA 준수
- 완전한 키보드 탐색
- 적절한 ARIA role과 label
- 기준을 준수하는 색상 대비

**성능**:

- `lazy-loader.js`을 통한 module lazy loading
- CSS 최적화 및 반응형 asset
- 지능형 캐싱을 위한 Service Worker
- 프로덕션 환경에서 code splitting 및 minification

## 📱 호환성

### 지원 브라우저

인터페이스는 색상에 `oklch()`을, 상황별 상태에 `:has()`을 사용하므로 최소 지원 버전은 다음과 같습니다:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### 기기

- **Desktop**: 키보드 및 마우스 제어
- **태블릿**: 최적화된 터치 인터페이스
- **스마트폰**: 적응형 반응형 디자인

### 접근성

- 완전한 키보드 탐색(Tab, 화살표 키, Esc)
- 화면 읽기 프로그램을 위한 ARIA role과 label
- 기준을 준수하는 색상 대비
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

**`npm run i18n:verify`** - 번역 key의 일관성 확인

**`npm run i18n:unused`** - 사용하지 않는 번역 key 목록 표시

**`npm run i18n:compare`** - 번역 파일을 fr.json(기준)과 비교

이 스크립트(`scripts/compare-translations.cjs`)는 모든 언어 파일의 동기화를 보장합니다:

**기능:**

- 누락된 key 감지(fr.json에는 있지만 다른 언어에는 없는 key)
- 추가된 key 감지(다른 언어에는 있지만 fr.json에는 없는 key)
- 빈 값 식별(`""`, `null`, `undefined`, `[]`)
- type 일관성 확인(string과 array 비교)
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
- 게임 설명
- 오류 및 피드백 메시지
- 설명과 상황별 도움말
- 모험 모드의 이야기 콘텐츠
- 접근성 및 ARIA label

## 🔊 녹음 음성

게임은 문제, 격려 문구, 설명을 소리 내어 읽어 줍니다. 프랑스어에서는 ElevenLabs(Eleven v3 모델)로 만든 합성 음성인 **Lucie**를 사용합니다. 게임에서 말하는 문장은 언어당 약 7,400개로 한정되어 있으며, 모두 미리 녹음되어 어떤 부분에서도 ElevenLabs를 호출하지 않습니다. 영어와 스페인어는 현재 기기의 음성을 그대로 사용합니다.

- **자동 대체**는 문장별로 기기 음성을 사용합니다. 클립이 없거나 오류가 발생한 경우, 브라우저가 재생을 거부한 경우, 클립이 1.5초 이내에 시작되지 않는 경우 또는 오프라인 상태에서 클립이 캐시에 없는 경우에 적용됩니다.
- **설정**: 상단 표시줄의 음성 버튼으로 읽기 기능을 켜거나 끌 수 있으며, 「녹음 음성」 확인란(접근성 및 제어)에서 Lucie와 기기 음성 중 하나를 선택할 수 있습니다.
- **오프라인**: 이미 들은 클립은 캐시에 유지됩니다(service worker).

### 클립은 이 저장소에 포함되어 있지 않습니다

클립은 비공개 저장소와 전용 S3 bucket에 있으며, `/voice/*`의 CloudFront를 통해 제공됩니다. 따라서 fork나 로컬 개발 환경에서는 기기 음성이 사용됩니다. 저장소의 `<meta name="leapmultix-voice-base">` tag는 비어 있으며, 프로덕션 배포에서만 여기에 `/voice/`을 기록합니다.

클립이 컴퓨터에 있는 경우(게임 옆의 `../leapmultix-voices`에 비공개 저장소를 clone한 경우), `?voix=local` 매개변수를 사용하면 개발 서버에서 클립을 재생할 수 있습니다:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### 클립 생성

작업 과정은 `scripts/voice/`에 script로 구성되어 있으며, 공개 CI가 아닌 소유자의 컴퓨터에서 실행됩니다. ElevenLabs key는 저장소 외부의 `.env` 파일에 보관되고 `node --env-file`을 통해 전달되므로 어떤 key도 git에 들어가지 않습니다. Claude Code skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md)은 절차를 단계별로 안내하며(검문 단계, 승인, 재개), 자세한 내용은 [`docs/voix-enregistree.md`](docs/voix-enregistree.md)에 있습니다.

1. **산정**: 남은 문장과 비용이 발생할 문자 수를 산정합니다(Eleven v3: 문자당 약 0.53 credit).
2. **생성**: 같은 명령을 다시 실행하면 누락된 부분부터 재개됩니다. credit이 소진되면 script는 반쯤 작성된 파일을 남기지 않고 정상적으로 중지됩니다(code 3).
3. **검증**: 모든 문장에 클립이 있고 각 MP3가 유효한지 확인합니다. 그런 다음 Whisper가 각 클립을 로컬에서 전사하고, `voice:check`이 잘못 인식된 숫자와 비정상적인 길이를 표시합니다.
4. **청취**: 청취 페이지(`voice:listen`)에서 표시된 클립과 Whisper가 구분하지 못하는 여성형 표현 표본(「une fois 7」)을 듣습니다. 각 클립에는 「다시 만들기」 확인란이 있으며, 선택하면 제외된 클립 목록에 추가됩니다.
5. **재생성**: 제외된 클립을 다시 만들고(`--redo`) Whisper를 재실행한 다음, 두 번째 페이지에서 각 클립의 이전 버전과 이후 버전을 비교합니다. 두세 번 시도한 후에도 잘못 발음되는 클립에는 `SAID_OVERRIDES`에서 강제 텍스트를 지정합니다(`scripts/voice/said-text.mjs`). 예를 들어 숫자를 단어로 풀어 씁니다.
6. **게시**: 클립을 게시하고 온라인에서 응답하는지 확인한 다음, 먼저 테스터용으로 언어 index를 게시합니다(`?voix=test`).
7. **공개**: 모든 사용자에게 음성을 공개한 다음 기본으로 활성화합니다. 차단 스위치(`voice:publish -- remove`)로 index에서 특정 언어를 제거하면 게임이 기기 음성으로 돌아갑니다.

```bash
# 1. Estimer (sans frais)
npm run voice:generate -- --lang fr --dry-run
# 2. Générer (payant)
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --reserve 5000
# 3. Contrôler (Whisper s'installe une fois : voir l'en-tête de whisper_transcribe.py)
npm run voice:check -- --lang fr --probe
.venv-whisper/bin/python scripts/voice/whisper_transcribe.py --manifest ../leapmultix-voices/manifests/fr/<version>.json --clips ../leapmultix-voices/clips/fr/<version> --lang fr --out transcripts-fr.jsonl
npm run voice:check -- --lang fr --transcripts transcripts-fr.jsonl
# 4. Écouter (page locale ; la liste « à refaire » va dans ecartes.txt)
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl
# 5. Refaire (payant), relancer Whisper (il ne transcrit que les clips refaits), comparer
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --redo ecartes.txt
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl --compare ecartes.txt
# 6. Publier
npm run voice:publish -- clips --lang fr --bucket <bucket>
npm run voice:check-online -- --lang fr
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience test
# 7. Ouvrir
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience all --default-on
```

### 규칙: 발화 문장이 수정되면 프로덕션 배포 전에 다시 녹음합니다

모든 발화 문장은 번역(`assets/translations/{fr,en,es}.json`)에서 가져오며 corpus의 일부입니다. 따라서 발화 문장을 변경하면 corpus 잠금 test(`scripts/voice/corpus.lock.json`)가 실패합니다. 녹음 음성이 있는 언어에서는 변경된 문장의 클립을 생성하고 검증하여 들어 본 뒤, 병합하기 **전에** 게시합니다. 마지막으로 잠금을 업데이트합니다(`npm run voice:corpus:lock`). 이 클립이 없으면 수정된 문장은 기기 음성으로 재생됩니다.

## 📊 데이터 저장

### 사용자 데이터

- 프로필 및 환경설정
- 게임 모드별 진행 상황
- arcade 게임의 점수 및 통계
- 개인화 설정

### 기술 기능

- fallback을 포함한 로컬 저장소(localStorage)
- 사용자별 데이터 격리
- 진행 상황 자동 저장
- 이전 데이터 자동 migration

## 🐛 문제 신고

문제는 GitHub issue를 통해 신고할 수 있습니다. 다음 내용을 포함해 주세요:

- 문제에 대한 자세한 설명
- 재현 단계
- 브라우저 및 버전
- 필요한 경우 screenshot

## 💝 프로젝트 후원

**[☕ PayPal로 후원하기](https://paypal.me/jls)**

## 📄 라이선스

이 프로젝트는 AGPL v3 라이선스를 따릅니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

_LeapMultix — 사칙연산을 배우기 위한 자유 교육용 애플리케이션_

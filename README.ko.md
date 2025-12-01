<details>
<summary>이 문서는 다른 언어로도 제공됩니다</summary>

- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Deutsch](./README.de.md)
- [中文](./README.zh.md)
- [हिन्दी](./README.hi.md)
- [العربية](./README.ar.md)
- [Français](./README.md)
- [Italiano](./README.it.md)
- [Svenska](./README.sv.md)
- [Polski](./README.pl.md)
- [Nederlands](./README.nl.md)
- [Română](./README.ro.md)
- [日本語](./README.ja.md)

</details>

# LeapMultix

<!-- 배지 (GitHub 마이그레이션 후 <owner>/<repo> 업데이트) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## 목차

- [설명](#설명)
- [기능](#-기능)
- [빠른 시작](#-빠른-시작)
- [아키텍처](#-아키텍처)
- [상세 게임 모드](#-상세-게임-모드)
- [개발](#-개발)
- [호환성](#-호환성)
- [현지화](#-현지화)
- [데이터 저장](#-데이터-저장)
- [문제 신고](#-문제-신고)
- [라이선스](#-라이선스)

## 설명

LeapMultix는 어린이(8~12세)가 4가지 산술 연산인 곱셈(×), 덧셈(+), 뺄셈(−), 나눗셈(÷)을 마스터하도록 설계된 현대적인 대화형 교육 웹 애플리케이션입니다. 이 애플리케이션은 직관적이고 접근 가능하며 다국어를 지원하는 인터페이스에서 **5가지 게임 모드**와 **4가지 아케이드 미니 게임**을 제공합니다.

**다중 연산 지원:** 퀴즈 및 도전 모드에서는 모든 연산을 연습할 수 있습니다. 발견, 모험 및 아케이드 모드는 곱셈에 중점을 두지만 모든 연산을 지원하도록 설계되었습니다.

**개발자:** Julien LS (contact@jls42.org)

**온라인 URL:** https://leapmultix.jls42.org/

## ✨ 기능

### 🎮 게임 모드

- **발견 모드**: 각 연산에 맞게 조정된 시각적 및 대화형 탐색
- **퀴즈 모드**: 4가지 연산(×, +, −, ÷)을 모두 지원하고 적응형 진행 방식을 갖춘 객관식 질문
- **도전 모드**: 4가지 연산(×, +, −, ÷) 모두와 다양한 난이도 레벨이 있는 타임 어택
- **모험 모드**: 4가지 연산을 모두 지원하는 레벨별 내러티브 진행

### 🕹️ 아케이드 미니 게임

- **MultiInvaders**: 교육용 스페이스 인베이더 - 오답 파괴
- **MultiMiam**: 수학적 팩맨 - 정답 수집
- **MultiMemory**: 메모리 게임 - 연산과 결과 일치
- **MultiSnake**: 교육용 스네이크 - 올바른 숫자를 먹어 성장

### ➕ 다중 연산 지원

LeapMultix는 **모든 모드**에서 4가지 산술 연산에 대한 완전한 훈련을 제공합니다.

| 모드     | ×   | +   | −   | ÷   |
| -------- | --- | --- | --- | --- |
| 퀴즈     | ✅  | ✅  | ✅  | ✅  |
| 도전     | ✅  | ✅  | ✅  | ✅  |
| 발견     | ✅  | ✅  | ✅  | ✅  |
| 모험     | ✅  | ✅  | ✅  | ✅  |
| 아케이드 | ✅  | ✅  | ✅  | ✅  |

### 🌍 포괄적 기능

- **다중 사용자**: 진행 상황이 저장되는 개별 프로필 관리
- **다국어**: 프랑스어, 영어 및 스페인어 지원
- **사용자 정의**: 아바타, 색상 테마, 배경
- **접근성**: 키보드 탐색, 터치 지원, WCAG 2.1 AA 준수
- **모바일 반응형**: 태블릿 및 스마트폰에 최적화된 인터페이스
- **진행 시스템**: 점수, 배지, 일일 도전 과제

## 🚀 빠른 시작

### 전제 조건

- Node.js (버전 16 이상)
- 최신 웹 브라우저

### 설치

```bash
# 프로젝트 복제
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# 의존성 설치
npm install

# 개발 서버 시작 (옵션 1)
npm run serve
# 애플리케이션은 http://localhost:8080 (또는 다음 사용 가능한 포트)에서 액세스할 수 있습니다.

# 또는 Python 사용 (옵션 2)
python3 -m http.server 8000
# 애플리케이션은 http://localhost:8000에서 액세스할 수 있습니다.
```

### 사용 가능한 스크립트

```bash
# 개발
npm run serve          # 로컬 서버 (http://localhost:8080)
npm run lint           # ESLint로 코드 확인
npm run lint:fix       # ESLint 문제 자동 수정
npm run format:check   # 코드 서식 확인 (커밋 전 항상)
npm run format         # Prettier로 코드 서식 지정
npm run verify         # 품질 게이트: lint + test + coverage

# 테스트
npm run test           # 모든 테스트 실행 (CJS)
npm run test:watch     # 감시 모드에서 테스트
npm run test:coverage  # 커버리지 보고서 포함 테스트
npm run test:core      # 코어 모듈만 테스트
npm run test:integration # 통합 테스트
npm run test:storage   # 스토리지 시스템 테스트
npm run test:esm       # ESM 테스트 (tests-esm/ 폴더, Jest vm-modules)
npm run test:verbose   # 상세 출력 포함 테스트
npm run test:pwa-offline # PWA 오프라인 테스트 (Puppeteer 필요), `npm run serve` 후

# 분석 및 유지 관리
npm run analyze:jsdoc  # 문서 분석
npm run improve:jsdoc  # 자동 JSDoc 개선
npm run audit:mobile   # 모바일 반응성 테스트
npm run audit:accessibility # 접근성 테스트
npm run dead-code      # 사용되지 않는 코드 감지
npm run analyze:globals # 전역 변수 분석
npm run analyze:dependencies # 의존성 사용 분석
npm run verify:cleanup # 결합된 분석 (데드 코드 + 전역)

# 에셋 관리
npm run assets:generate    # 반응형 이미지 생성
npm run assets:backgrounds # 배경을 WebP로 변환
npm run assets:analyze     # 반응형 에셋 분석
npm run assets:diff        # 에셋 비교

# 국제화
npm run i18n:verify    # 번역 키 일관성 확인
npm run i18n:unused    # 사용되지 않는 번역 키 나열
npm run i18n:compare   # 번역 (en/es)을 fr.json (참조)과 비교

# 빌드 및 배포
npm run build          # 프로덕션 빌드 (Rollup) + postbuild (전체 dist/)
npm run serve:dist     # http://localhost:5000 (또는 사용 가능한 포트)에서 dist/ 제공

# PWA 및 Service Worker
npm run sw:disable     # service worker 비활성화
npm run sw:fix         # service worker 문제 수정
```

## 🏗️ 아키텍처

### 파일 구조

```
leapmultix/
├── index.html              # 메인 진입점
├── js/
│   ├── core/               # ES6 코어 모듈
│   │   ├── GameMode.js     # 모드 기본 클래스
│   │   ├── GameModeManager.js # 게임 모드 관리
│   │   ├── storage.js      # LocalStorage API
│   │   ├── audio.js        # 사운드 관리
│   │   ├── utils.js        # 일반 유틸리티 (표준 소스)
│   │   ├── eventBus.js     # 이벤트 통신
│   │   ├── userState.js    # 사용자 세션 관리
│   │   ├── mainInit.js     # DOM-ready 초기화
│   │   ├── theme.js        # 테마 시스템
│   │   ├── userUi.js       # 사용자 인터페이스 유틸리티
│   │   ├── parental.js     # 자녀 보호 기능
│   │   ├── adventure-data.js # 모험 모드 데이터
│   │   ├── mult-stats.js   # 곱셈 통계
│   │   ├── challenge-stats.js # 도전 통계
│   │   └── daily-challenge.js # 일일 도전 과제 관리
│   ├── components/         # 재사용 가능한 UI 구성 요소
│   │   ├── topBar.js       # 탐색 모음
│   │   ├── infoBar.js      # 게임 정보 표시줄
│   │   ├── dashboard.js    # 사용자 대시보드
│   │   └── customization.js # 사용자 정의 인터페이스
│   ├── modes/              # 게임 모드
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # 아케이드 미니 게임
│   │   ├── arcade.js       # 메인 아케이드 오케스트레이터
│   │   ├── arcade-invasion.js # 스페이스 인베이더 (31 KB)
│   │   ├── arcade-multimemory.js # 메모리 게임 (31 KB)
│   │   ├── arcade-multimiam.js # MultiMiam 통합
│   │   ├── arcade-multisnake.js # Snake 통합
│   │   ├── arcade-common.js, arcade-utils.js # 공유 유틸리티
│   │   ├── arcade-message.js, arcade-points.js # UI 구성 요소
│   │   └── arcade-scores.js # 점수 관리
│   ├── multimiam/          # 팩맨 게임 (분해된 아키텍처)
│   │   ├── multimiam.js    # 메인 컨트롤러
│   │   ├── multimiam-engine.js # 게임 엔진 (15 KB)
│   │   ├── multimiam-renderer.js # 렌더링 시스템 (9 KB)
│   │   ├── multimiam-controls.js # 제어 관리 (7 KB)
│   │   ├── multimiam-questions.js # 질문 생성 (6 KB)
│   │   └── multimiam-ui.js # 인터페이스 요소
│   ├── multisnake.js       # Snake 게임 (38 KB)
│   ├── navigation/         # 탐색 시스템
│   │   ├── slides.js       # 슬라이드 기반 탐색 (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # 키보드 지원
│   ├── ui/                 # 사용자 인터페이스 및 피드백
│   │   ├── uiUtils.js      # 인터페이스 유틸리티
│   │   ├── ui-feedback.js  # 피드백 메커니즘
│   │   ├── touch-support.js # 터치 지원 (7 KB)
│   │   ├── virtual-keyboard.js # 가상 키보드
│   │   ├── coin-display.js, coin-effects.js # 통화 시스템
│   │   ├── notifications.js # 알림 시스템
│   │   └── badges.js       # 배지 시스템
│   ├── media/              # 미디어 관리
│   │   ├── VideoManager.js # 비디오 재생 관리 (12 KB)
│   │   └── responsive-image-loader.js # 이미지 로딩 (9 KB)
│   ├── orchestration/      # 오케스트레이션 및 로딩
│   │   ├── mode-orchestrator.js # 모드 전환
│   │   ├── lazy-loader.js  # 동적 로딩 (10 KB)
│   │   └── game-cleanup.js # 상태 정리
│   ├── utils/              # 유틸리티
│   │   ├── utils-es6.js    # 메인 집계자 (5 KB)
│   │   ├── main-helpers.js # 애플리케이션 도우미
│   │   ├── helpers.js      # 레거시 도우미 함수
│   │   ├── stats-utils.js  # 통계 유틸리티
│   │   ├── difficulty.js   # 난이도 관리
│   │   └── questionGenerator.js # 질문 생성
│   ├── storage/            # 스토리지 및 상태
│   │   ├── storage.js      # 레거시 스토리지 래퍼
│   │   └── userManager.js  # 다중 사용자 관리 (19 KB)
│   ├── i18n/               # 국제화
│   │   ├── i18n.js         # i18n 시스템
│   │   └── i18n-store.js   # 번역 저장소
│   ├── security/           # 보안 및 오류 처리
│   │   ├── security-utils.js # XSS 보호, 살균
│   │   ├── error-handlers.js # 전역 오류 처리
│   │   └── logger.js       # 로깅 시스템
│   ├── accessibility/      # 접근성
│   │   ├── accessibility.js # 접근성 기능
│   │   └── speech.js       # 음성 합성 지원
│   ├── integration/        # 통합 및 분석
│   │   ├── plausible-init.js # Plausible 분석
│   │   ├── cache-updater.js # 캐시 관리 (10 KB)
│   │   └── imports.js      # 가져오기 유틸리티
│   ├── main-es6.js         # ES6 진입점
│   ├── main.js             # 메인 오케스트레이터
│   ├── bootstrap.js        # ES6 이벤트 핸들러 설정
│   └── game.js             # 상태 관리 및 일일 도전 과제
├── css/                    # 모듈식 스타일
├── assets/                 # 리소스
│   ├── images/             # 이미지 및 스프라이트
│   ├── generated-images/   # 생성된 반응형 이미지
│   ├── sounds/             # 사운드 효과
│   ├── translations/       # 번역 파일 (fr, en, es)
│   └── videos/             # 튜토리얼 비디오
├── tests/                  # 자동화된 테스트
│   ├── __tests__/          # 단위 및 통합 테스트
│   └── tests-esm/          # ESM 테스트 (.mjs)
├── scripts/                # 유지 관리 스크립트
│   ├── compare-translations.cjs # 번역 비교
│   └── cleanup-i18n-keys.cjs # i18n 키 정리
└── dist/                   # 프로덕션 빌드 (생성됨)
```

### 기술 아키텍처

**최신 ES6 모듈**: 이 프로젝트는 ES6 클래스와 네이티브 가져오기/내보내기가 포함된 모듈식 아키텍처를 사용합니다.

**재사용 가능한 구성 요소**: 중앙 집중식 UI 구성 요소(TopBar, InfoBar, Dashboard, Customization)로 구축된 인터페이스입니다.

**지연 로딩**: `lazy-loader.js`를 통해 모듈을 온디맨드로 지능적으로 로드하여 초기 성능을 최적화합니다.

**통합 스토리지 시스템**: 폴백이 있는 LocalStorage를 통한 사용자 데이터 지속성을 위한 중앙 집중식 API입니다.

**중앙 집중식 오디오 관리**: 다국어 지원 및 사용자별 기본 설정을 갖춘 사운드 제어입니다.

**이벤트 버스**: 유지 관리 가능한 아키텍처를 위한 구성 요소 간의 분리된 이벤트 기반 통신입니다.

**슬라이드 탐색**: `goToSlide()`를 사용하는 번호가 매겨진 슬라이드(slide0, slide1 등) 기반 탐색 시스템입니다.

**보안**: 모든 DOM 조작에 대해 `security-utils.js`를 통한 XSS 보호 및 살균입니다.

## 🎯 상세 게임 모드

### 발견 모드

다음을 갖춘 구구단 시각적 탐색 인터페이스:

- 곱셈의 대화형 시각화
- 애니메이션 및 기억 보조 도구
- 교육용 드래그 앤 드롭
- 표별 자유로운 진행

### 퀴즈 모드

다음을 갖춘 객관식 질문:

- 세션당 10개 질문
- 성공에 기반한 적응형 진행
- 가상 숫자 키패드
- 스트릭 시스템 (연속 정답)

### 도전 모드

다음을 갖춘 타임 어택:

- 3가지 난이도 레벨 (초급, 중급, 고급)
- 정답에 대한 시간 보너스
- 생명 시스템
- 최고 점수 순위표

### 모험 모드

다음을 갖춘 내러티브 진행:

- 잠금 해제 가능한 12개의 테마 레벨
- 시각적 진행이 포함된 대화형 지도
- 캐릭터가 있는 몰입형 스토리
- 별 시스템 및 보상

### 아케이드 미니 게임

각 미니 게임은 다음을 제공합니다:

- 난이도 선택 및 사용자 정의
- 생명 시스템 및 점수
- 키보드 및 터치 컨트롤
- 사용자별 개별 순위표

## 🛠️ 개발

### 개발 워크플로

**중요: main에 직접 커밋하지 마십시오**

이 프로젝트는 기능 브랜치를 기반으로 하는 워크플로를 사용합니다:

1.  **브랜치 생성**:

    ```bash
    git checkout -b feat/feature-name
    # 또는
    git checkout -b fix/bug-name
    ```

2.  **개발 및 테스트**:

    ```bash
    npm run format:check  # 항상 서식을 먼저 확인하십시오
    npm run format        # 필요한 경우 서식 지정
    npm run lint          # 코드 품질 확인
    npm run test          # 테스트 실행
    npm run test:coverage # 커버리지 확인
    ```

3.  **브랜치에 커밋**:

    ```bash
    git add .
    git commit -m "feat: description of the feature"
    ```

4.  **푸시 및 풀 리퀘스트 생성**:
    ```bash
    git push -u origin feat/feature-name
    ```

**커밋 스타일**: 간결함, 명령조 (예: "Fix arcade init errors", "Refactor cache updater")

**품질 게이트**: 각 커밋 전에 `npm run lint`, `npm run test` 및 `npm run test:coverage`가 통과하는지 확인하십시오.

### 구성 요소 아키텍처

**GameMode (기본 클래스)**: 모든 모드는 표준화된 메서드를 가진 공통 클래스에서 상속됩니다.

**GameModeManager**: 모드 실행 및 관리의 중앙 집중식 오케스트레이션입니다.

**UI 구성 요소**: TopBar, InfoBar, Dashboard 및 Customization은 일관된 인터페이스를 제공합니다.

**지연 로딩**: 모듈은 초기 성능을 최적화하기 위해 온디맨드로 로드됩니다.

**이벤트 버스**: 이벤트 시스템을 통한 구성 요소 간의 분리된 통신입니다.

### 테스트

이 프로젝트에는 포괄적인 테스트 모음이 포함되어 있습니다:

- 코어 모듈에 대한 단위 테스트
- 구성 요소에 대한 통합 테스트
- 게임 모드 테스트
- 자동화된 코드 커버리지

```bash
npm test              # 모든 테스트 (CJS)
npm test:core         # 코어 모듈 테스트
npm test:integration  # 통합 테스트
npm test:coverage     # 커버리지 보고서
npm run test:esm      # vm-modules를 통한 ESM 테스트 (예: components/dashboard)
```

### 프로덕션 빌드

- **Rollup**: 코드 분할 및 소스 맵을 사용하여 `js/main-es6.js`를 ESM으로 번들링합니다.
- **Terser**: 최적화를 위한 자동 축소
- **빌드 후**: `css/` 및 `assets/`, 파비콘(`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`를 복사하고 `dist/index.html`을 해시된 진입 파일(예: `main-es6-*.js`)로 다시 작성합니다.
- **최종 폴더**: 정적으로 제공할 준비가 된 `dist/`

```bash
npm run build      # dist/ 생성
npm run serve:dist # dist/ 제공 (포트 5000)
```

### 지속적 통합

**GitHub Actions**: `.github/workflows/ci.yml`의 자동화된 파이프라인

CI/CD 파이프라인은 모든 푸시 및 풀 리퀘스트에서 자동으로 실행됩니다:

**주요 작업**:

1.  **build-test**: 주요 검증 작업
    - 의존성 설치: `npm ci`
    - 서식 확인: `npm run format:check`
    - 정적 분석: `npm run lint`
    - 단위 테스트: `npm run test`
    - 보안 감사: `npm audit`
    - 커버리지 아티팩트 생성

2.  **accessibility**: 접근성 감사 (비차단)
    - `npm run audit:accessibility` 실행
    - WCAG 2.1 AA 접근성 보고서 생성

3.  **test-esm**: ES6 모듈 테스트
    - Jest VM modules로 `npm run test:esm` 실행
    - ES6 가져오기/내보내기 검증

4.  **lighthouse**: 성능 감사 (비차단)
    - 모바일 성능 감사
    - Lighthouse 보고서 아티팩트 생성
    - Core Web Vitals 지표

**품질 배지**:

- CI 빌드 상태 (GitHub Actions)
- CodeFactor 등급
- Codacy 배지
- SonarCloud 품질 게이트

### PWA (프로그레시브 웹 앱)

LeapMultix는 오프라인 지원 및 설치 기능을 갖춘 완전한 PWA입니다.

**Service Worker** (`sw.js`):

- 탐색: `offline.html`로의 오프라인 폴백이 있는 네트워크 우선
- 이미지: 성능 최적화를 위한 캐시 우선
- 번역: 백그라운드 업데이트를 위한 Stale-while-revalidate
- JS/CSS: 항상 최신 버전을 제공하기 위한 네트워크 우선
- `cache-updater.js`를 통한 자동 버전 관리

**매니페스트** (`manifest.json`):

- 모든 기기용 SVG 및 PNG 아이콘
- 모바일 설치 가능 (홈 화면에 추가)
- 앱과 같은 경험을 위한 독립형 구성
- 테마 및 색상 지원

**로컬에서 오프라인 모드 테스트**:

1.  개발 서버 시작:

    ```bash
    npm run serve
    ```

    `http://localhost:8080` (또는 표시된 포트) 열기

2.  수동 테스트:
    - DevTools에서 네트워크 차단 (Network 탭 → Offline)
    - 페이지 새로 고침 → `offline.html` 표시됨

3.  자동 테스트 (Puppeteer 필요):
    ```bash
    npm run test:pwa-offline
    ```

**Service Worker 관리 스크립트**:

```bash
npm run sw:disable  # service worker 비활성화
npm run sw:fix      # 캐시 문제 수정
```

### 품질 표준

**코드 품질 도구**:

- **ESLint**: 플랫 구성(`eslint.config.js`), ES2022 지원을 갖춘 최신 구성
- **Prettier**: 자동 코드 서식 지정 (`.prettierrc`)
- **Stylelint**: CSS 검증 (`.stylelintrc.json`)
- **JSDoc**: 커버리지 분석을 포함한 자동 함수 문서화

**중요한 코드 규칙**:

- 사용되지 않는 변수 및 매개변수 제거 (`no-unused-vars`)
- 구체적인 오류 처리 사용 (빈 캐치 없음)
- `security-utils.js` 함수를 선호하여 `innerHTML` 피하기
- 함수의 인지 복잡성을 15 미만으로 유지
- 복잡한 함수를 더 작은 도우미로 추출

**보안**:

- **XSS 보호**: `security-utils.js`의 함수 사용:
  - `innerHTML` 대신 `appendSanitizedHTML()`
  - 안전한 요소를 생성하기 위한 `createSafeElement()`
  - 텍스트 콘텐츠를 위한 `setSafeMessage()`
- **외부 스크립트**: `crossorigin="anonymous"` 속성 필수
- **입력 검증**: 항상 외부 데이터 살균
- **콘텐츠 보안 정책**: 스크립트 소스를 제한하기 위한 CSP 헤더

**접근성**:

- WCAG 2.1 AA 준수
- 전체 키보드 탐색
- ARIA 역할 및 적절한 레이블
- 준수하는 색상 대비

**성능**:

- `lazy-loader.js`를 통한 모듈 지연 로딩
- CSS 및 반응형 에셋 최적화
- 지능형 캐싱을 위한 Service Worker
- 프로덕션에서의 코드 분할 및 축소

## 📱 호환성

### 지원되는 브라우저

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 기기

- **데스크톱**: 키보드 및 마우스 제어
- **태블릿**: 최적화된 터치 인터페이스
- **스마트폰**: 적응형 반응형 디자인

### 접근성

- 전체 키보드 탐색 (Tab, 화살표, Esc)
- 스크린 리더용 ARIA 역할 및 레이블
- 준수하는 색상 대비
- 보조 기술 지원

## 🌍 현지화

완전한 다국어 지원:

- **프랑스어** (기본 언어)
- **영어**
- **스페인어**

### 번역 관리

**번역 파일:** `assets/translations/*.json`

**형식:**

```json
{
  "menu_start": "시작",
  "quiz_correct": "잘했어요!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n 관리 스크립트

**`npm run i18n:verify`** - 번역 키 일관성 확인

**`npm run i18n:unused`** - 사용되지 않는 번역 키 나열

**`npm run i18n:compare`** - 번역 파일을 fr.json (참조)과 비교

이 스크립트 (`scripts/compare-translations.cjs`)는 모든 언어 파일의 동기화를 보장합니다:

**기능:**

- 누락된 키 감지 (fr.json에는 있지만 다른 언어에는 없음)
- 추가 키 감지 (다른 언어에는 있지만 fr.json에는 없음)
- 빈 값 식별 (`""`, `null`, `undefined`, `[]`)
- 유형 일관성 확인 (문자열 vs 배열)
- 중첩된 JSON 구조를 점 표기법으로 평탄화 (예: `arcade.multiMemory.title`)
- 상세 콘솔 보고서 생성
- JSON 보고서를 `docs/translations-comparison-report.json`에 저장

**출력 예시:**

```
🔍 번역 파일 비교 분석

📚 참조 언어: fr.json
✅ fr.json: 335 키

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 en.json 분석
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 총 키: 335
✅ 누락된 키 없음
✅ 추가 키 없음
✅ 빈 값 없음

📊 최종 요약
  fr.json: 335 키
  en.json: 335 키
  es.json: 335 키

✅ 모든 번역 파일이 완벽하게 동기화되었습니다!
```

**번역 커버리지:**

- 전체 사용자 인터페이스
- 게임 지침
- 오류 및 피드백 메시지
- 설명 및 상황에 맞는 도움말
- 모험 모드 내러티브 콘텐츠
- 접근성 및 ARIA 레이블

## 📊 데이터 저장

### 사용자 데이터

- 프로필 및 기본 설정
- 게임 모드별 진행 상황
- 아케이드 게임 점수 및 통계
- 사용자 정의 설정

### 기술적 기능

- 폴백이 있는 로컬 스토리지 (localStorage)
- 사용자별 데이터 격리
- 자동 진행 상황 저장
- 오래된 데이터 자동 마이그레이션

## 🐛 문제 신고

문제는 GitHub 이슈를 통해 신고할 수 있습니다. 다음을 포함해 주세요:

- 문제에 대한 자세한 설명
- 재현 단계
- 브라우저 및 버전
- 관련 있는 경우 스크린샷

## 💝 프로젝트 후원

**[☕ PayPal을 통해 기부](https://paypal.me/jls)**

## 📄 라이선스

이 프로젝트는 AGPL v3 라이선스에 따라 라이선스가 부여됩니다. 자세한 내용은 `LICENSE` 파일을 참조하십시오.

---

_LeapMultix - 구구단을 배우기 위한 현대적인 교육 애플리케이션_

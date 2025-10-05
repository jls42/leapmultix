<details>
<summary>이 문서는 다른 언어로도 제공됩니다</summary>

- [Français](./README.md)
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

</details>

# LeapMultix

<!-- 배지 (GitHub 마이그레이션 후 <소유자>/<리포지토리> 업데이트) -->

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
- [문제 보고](#-문제-보고)
- [라이선스](#-라이선스)

## 설명

LeapMultix는 어린이(8-12세)가 구구단을 마스터할 수 있도록 설계된 현대적이고 상호작용적인 교육용 웹 애플리케이션입니다. 이 애플리케이션은 직관적이고 접근성이 뛰어나며 다국어를 지원하는 인터페이스에서 **4가지 클래식 게임 모드**와 **4가지 아케이드 미니 게임**을 제공합니다.

**개발자:** Julien LS (contact@jls42.org)

**온라인 URL:** https://leapmultix.jls42.org/

## ✨ 기능

### 🎮 게임 모드

- **발견 모드**: 구구단의 시각적이고 상호작용적인 탐색.
- **퀴즈 모드**: 적응형 진행이 포함된 객관식 문제.
- **챌린지 모드**: 다양한 난이도의 시간 제한 레이스.
- **어드벤처 모드**: 상호작용형 지도가 있는 레벨을 통한 서사적 진행.

### 🕹️ 아케이드 미니 게임

- **MultiInvaders**: 교육용 스페이스 인베이더 - 잘못된 답을 파괴하세요.
- **MultiMiam**: 수학 팩맨 - 정답을 수집하세요.
- **MultiMemory**: 기억력 게임 - 곱셈과 결과를 짝지으세요.
- **MultiSnake**: 교육용 스네이크 - 올바른 숫자를 먹고 성장하세요.

### 🌍 공통 기능

- **다중 사용자**: 저장된 진행 상황이 있는 개별 프로필 관리.
- **다국어**: 프랑스어, 영어, 스페인어 지원.
- **사용자 정의**: 아바타, 색상 테마, 배경.
- **접근성**: 키보드 탐색, 터치 지원, WCAG 2.1 AA 준수.
- **모바일 반응형**: 태블릿 및 스마트폰에 최적화된 인터페이스.
- **진행 시스템**: 점수, 배지, 일일 챌린지.

## 🚀 빠른 시작

### 전제 조건

- Node.js (버전 16 이상)
- 최신 웹 브라우저

### 설치

```bash
# 프로젝트 복제
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# 종속성 설치
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
npm run serve          # 로컬 서버
npm run lint           # 코드 린팅
npm run test           # 모든 테스트 실행 (CJS)
npm run test:coverage  # 커버리지가 포함된 테스트
npm run test:esm       # ESM 테스트 (tests-esm/ 폴더, Jest vm-modules)
npm run test:pwa-offline # PWA 오프라인 테스트 (Puppeteer 필요), `npm run serve` 후

# 분석 및 유지 관리
npm run analyze:jsdoc  # 문서 분석
npm run improve:jsdoc  # JSDoc 자동 개선
npm run audit:mobile   # 모바일 반응성 테스트
npm run audit:accessibility # 접근성 테스트
npm run dead-code      # 사용하지 않는 코드 감지
npm run analyze:globals # 전역 변수 분석
npm run analyze:dependencies # 종속성 사용 분석
npm run assets:analyze # 반응형 자산 분석
npm run assets:diff    # 자산 비교

# 빌드 및 배포
npm run build          # 프로덕션 빌드 (Rollup) + 포스트 빌드 (전체 dist/)
npm run serve:dist     # http://localhost:5000 (또는 사용 가능한 포트)에서 dist/ 제공
```

## 🏗️ 아키텍처

### 파일 구조

```
leapmultix/
├── index.html              # 메인 진입점
├── js/
│   ├── core/               # 핵심 ES6 모듈
│   │   ├── GameMode.js     # 게임 모드의 기본 클래스
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # 스토리지 API
│   │   ├── audio.js        # 사운드 관리
│   │   └── utils.js        # 일반 유틸리티
│   ├── components/         # 재사용 가능한 UI 구성 요소
│   │   ├── topBar.js       # 탐색 모음
│   │   ├── infoBar.js      # 게임 정보 표시줄
│   │   ├── dashboard.js    # 사용자 대시보드
│   │   └── customization.js # 사용자 정의 인터페이스
│   ├── modes/              # 리팩터링된 게임 모드
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # 아케이드 미니 게임
│   ├── multimiam-*.js      # 팩맨 게임 모듈
│   ├── multisnake.js       # 교육용 스네이크 게임
│   ├── main-es6.js         # ES6 진입점
│   ├── main.js             # 메인 오케스트레이터
│   ├── lazy-loader.js      # 주문형 로딩
│   └── utils-es6.js        # ES6 유틸리티
├── css/                    # 모듈식 스타일
├── assets/                 # 리소스
│   ├── images/             # 이미지 및 스프라이트
│   ├── sounds/             # 음향 효과
│   ├── translations/       # 번역 파일
│   └── videos/             # 튜토리얼 비디오
└── tests/                  # 자동화된 테스트
```

### 기술 아키텍처

**최신 ES6 모듈**: 이 프로젝트는 ES6 클래스와 네이티브 가져오기/내보내기를 사용하는 모듈식 아키텍처를 사용합니다.

**재사용 가능한 구성 요소**: 인터페이스는 중앙 집중식 UI 구성 요소(TopBar, InfoBar, Dashboard)로 구축됩니다.

**지연 로딩**: 성능 최적화를 위해 필요에 따라 모듈을 스마트하게 로드합니다.

**통합 스토리지 시스템**: 사용자 데이터 지속성을 위한 중앙 집중식 API.

**중앙 집중식 오디오 관리**: 다국어 지원 및 사용자별 기본 설정을 갖춘 사운드 제어.

## 🎯 상세 게임 모드

### 발견 모드

구구단 시각적 탐색 인터페이스:

- 곱셈의 상호작용적 시각화
- 애니메이션 및 기억 보조 도구
- 교육용 드래그 앤 드롭
- 테이블별 자유로운 진행

### 퀴즈 모드

객관식 문제:

- 세션당 10개 문제
- 성공에 기반한 적응형 진행
- 가상 숫자 키패드
- 연속 정답 시스템 (연속 정답)

### 챌린지 모드

시간과의 경쟁:

- 3가지 난이도 (초급, 중급, 고급)
- 정답에 대한 시간 보너스
- 생명 시스템
- 고득점 순위표

### 어드벤처 모드

서사적 진행:

- 12개의 잠금 해제 가능한 테마 레벨
- 시각적 진행 상황이 있는 상호작용형 지도
- 캐릭터가 있는 몰입형 스토리
- 별 및 보상 시스템

### 아케이드 미니 게임

각 미니 게임 제공:

- 난이도 및 사용자 정의 선택
- 생명 및 점수 시스템
- 키보드 및 터치 컨트롤
- 사용자별 개별 순위표

## 🛠️ 개발

### 구성 요소 아키텍처

**GameMode (기본 클래스)**: 모든 모드는 표준화된 메서드를 가진 공통 클래스를 상속합니다.

**GameModeManager**: 모드 시작 및 관리를 위한 중앙 집중식 오케스트레이션.

**UI 구성 요소**: TopBar, InfoBar, Dashboard 및 Customization은 일관된 인터페이스를 제공합니다.

**지연 로딩**: 초기 성능을 최적화하기 위해 모듈이 필요에 따라 로드됩니다.

### 테스트

이 프로젝트에는 포괄적인 테스트 스위트가 포함되어 있습니다:

- 핵심 모듈의 단위 테스트
- 구성 요소의 통합 테스트
- 게임 모드 테스트
- 자동화된 코드 커버리지

```bash
npm test              # 모든 테스트 (CJS)
npm test:core         # 핵심 모듈 테스트
npm test:integration  # 통합 테스트
npm test:coverage     # 커버리지 보고서
npm run test:esm      # ESM 테스트 (예: components/dashboard) vm-modules를 통해
```

### 프로덕션 빌드

- **Rollup**: `js/main-es6.js`를 코드 분할 및 소스 맵과 함께 ESM으로 번들링합니다.
- **Terser**: 최적화를 위한 자동 축소.
- **포스트 빌드**: `css/` 및 `assets/`, 파비콘(`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`를 복사하고, `dist/index.html`을 해시된 진입 파일(예: `main-es6-*.js`)을 가리키도록 다시 작성합니다.
- **최종 폴더**: `dist/`는 정적으로 제공될 준비가 되었습니다.

```bash
npm run build      # dist/ 생성
npm run serve:dist # dist/ 제공 (포트 5000)
```

### 지속적인 통합

**GitHub Actions**: `.github/workflows/ci.yml`

- **build-test**: `npm ci`, `lint`, `test`, `audit` + 커버리지 아티팩트.
- **accessibility**: `npm run audit:accessibility` (차단 안 함).
- **test-esm**: VM 모듈을 사용한 `npm run test:esm`.
- **lighthouse**: 모바일 성능 감사 (차단 안 함), 아티팩트로 보고.

### PWA (오프라인 및 설치)

- **Service Worker**: 오프라인 폴백이 있는 네트워크 우선 전략, 캐시 우선 전략이 있는 이미지, stale-while-revalidate가 있는 번역, 네트워크 우선 전략이 있는 JS/CSS.
- **Manifest**: SVG/PNG 아이콘, 모바일 설치 가능.
- **로컬에서 오프라인 테스트**:
  1. `npm run serve`를 실행하고 `http://localhost:8080` (또는 표시된 포트)을 엽니다.
  2. 네트워크 연결을 끊고 페이지를 새로 고치면 `offline.html`이 표시됩니다.
  3. 자동화된 테스트 (Puppeteer 필요): `npm run test:pwa-offline`.

### 품질 표준

- **ESLint**: JavaScript 코드 유효성 검사.
- **Prettier**: 자동 서식 지정.
- **JSDoc**: 함수 자동 문서화.
- **접근성**: WCAG 2.1 AA 준수.
- **성능**: 지연 로딩, CSS 최적화.

## 📱 호환성

### 지원되는 브라우저

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 장치

- **데스크톱**: 키보드 및 마우스 컨트롤.
- **태블릿**: 최적화된 터치 인터페이스.
- **스마트폰**: 적응형 반응형 디자인.

### 접근성

- 전체 키보드 탐색 (Tab, 화살표, Esc).
- 스크린 리더를 위한 ARIA 역할 및 레이블.
- 준수하는 색상 대비.
- 보조 기술 지원.

## 🌍 현지화

완벽한 다국어 지원:

- **프랑스어** (기본 언어)
- **영어**
- **스페인어**

### 번역 관리

**번역 파일:** `assets/translations/*.json`

**형식:**

```json
{
  "menu_start": "시작",
  "quiz_correct": "잘 했어요!",
  "arcade_invasion_title": "MultiInvaders"
}
```

**관리 스크립트:**

```bash
npm run i18n:verify  # 누락/불일치 키 확인
npm run i18n:unused  # 사용하지 않는 키 나열
```

**번역 범위:**

- 전체 사용자 인터페이스
- 게임 지침
- 오류 및 피드백 메시지
- 설명 및 상황별 도움말

## 📊 데이터 저장

### 사용자 데이터

- 프로필 및 기본 설정
- 게임 모드별 진행 상황
- 아케이드 게임 점수 및 통계
- 사용자 정의 설정

### 기술적 특징

- 폴백이 있는 로컬 스토리지 (localStorage).
- 사용자별 데이터 격리.
- 자동 진행 상황 저장.
- 이전 데이터 자동 마이그레이션.

## 🐛 문제 보고

GitHub 이슈를 통해 문제를 보고할 수 있습니다. 다음을 포함해 주세요:

- 문제에 대한 자세한 설명.
- 재현 단계.
- 브라우저 및 버전.
- 관련 스크린샷.

## 💝 프로젝트 지원

**[☕ PayPal을 통해 기부](https://paypal.me/jls)**

## 📄 라이선스

이 프로젝트는 AGPL v3 라이선스에 따라 라이선스가 부여됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

_LeapMultix - 구구단 학습을 위한 현대적인 교육용 애플리케이션._

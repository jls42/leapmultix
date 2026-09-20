<details>
<summary>このドキュメントは他の言語でもご覧いただけます</summary>

- [英語](./README.en.md)
- [スペイン語](./README.es.md)
- [ポルトガル語](./README.pt.md)
- [ドイツ語](./README.de.md)
- [中国語](./README.zh.md)
- [ヒンディー語](./README.hi.md)
- [アラビア語](./README.ar.md)
- [イタリア語](./README.it.md)
- [スウェーデン語](./README.sv.md)
- [ポーランド語](./README.pl.md)
- [オランダ語](./README.nl.md)
- [ルーマニア語](./README.ro.md)
- [日本語](./README.ja.md)
- [韓国語](./README.ko.md)

</details>

# LeapMultix

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![ライセンス：AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy バッジ](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![品質ゲートのステータス](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![信頼性評価](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![セキュリティ評価](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![保守性評価](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![技術的負債](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![バグ](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![脆弱性](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![コードスメル](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![重複行（%）](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![コード行数](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## 目次

- [説明](#説明)
- [概要](#-概要)
- [機能](#-機能)
- [クイックスタート](#-クイックスタート)
- [アーキテクチャ](#-アーキテクチャ)
- [ゲームモードの詳細](#-ゲームモードの詳細)
- [開発](#-開発)
- [互換性](#-互換性)
- [ローカライズ](#-ローカライズ)
- [データストレージ](#-データストレージ)
- [問題を報告する](#-問題を報告する)
- [ライセンス](#-ライセンス)

## 説明

LeapMultix は、6～12歳の子どもが乗算（×）、加算（+）、減算（−）、除算（÷）の4つの算術演算を習得するための、インタラクティブな教育用ウェブアプリケーションです。直感的でアクセシブルな多言語インターフェースに、**5つのゲームモード**と**4つのアーケード・ミニゲーム**を備えています。

**複数演算への対応：** 5つすべてのモードで4つの演算を利用できます。ホーム画面で選択した演算が、学習全体に適用されます。

**開発者：** Julien LS (contact@jls42.org)

**オンラインURL：** https://leapmultix.jls42.org/

## 📸 概要

### 各画面

|                                                                                                     |                                                                                                |
| :-------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: |
|             ![「誰がプレイする？」画面：プロフィールの選択](docs/media/01-accueil.webp)             |              ![メインメニュー：演算と5つのモードの選択](docs/media/02-menu.webp)               |
|       **誰がプレイする？** — 子どもごとに、アバターと進捗を備えたプロフィールを作成できます。       |               **メニュー** — ここで演算を選択してから、5つのモードを開始します。               |
|                    ![発見モード：4の段を点で表示](docs/media/03-decouverte.webp)                    |              ![クイズモード：不正解は赤、正解は緑で表示](docs/media/04-quiz.webp)              |
|          **発見** — 各式を点、ジャンプ、または数え上げで示し、その段の覚え方も表示します。          |        **クイズ** — 子どもが選んだ答えを正解の横に残し、解説で計算を詳しく説明します。         |
|           ![チャレンジモード：カウントダウンと継続中の連続正解](docs/media/05-defi.webp)            | ![アドベンチャーモード：10レベルのマップとロックされた後続レベル](docs/media/06-aventure.webp) |
|     **チャレンジ** — 時間との競争です。間違えると、正解を読めるようにタイマーが一時停止します。     |              **アドベンチャー** — 星を集めながら、10のレベルを順番に開放します。               |
|                  ![アーケードメニュー：4つのミニゲーム](docs/media/07-arcade.webp)                  |            ![ダッシュボード：段ごとの星と統計](docs/media/08-tableau-de-bord.webp)             |
|               **アーケード** — 難易度設定と宇宙船の選択が可能な4つのミニゲームです。                |       **ダッシュボード** — 段ごとの星、復習すべき段、モードごとのスコアを確認できます。        |
|      ![カスタマイズ：アバター、テーマ、アクセシビリティ](docs/media/09-personnalisation.webp)       |                                                                                                |
| **カスタマイズ** — アバター、配色テーマ、文字サイズ、高コントラスト、保護者用コードを設定できます。 |                                                                                                |

### アーケード・ミニゲーム

4つのゲームでは、ゲームエリアの上に残り時間とライフとともに表示される同じ形式の問題に答えますが、ゲームごとに異なる操作が必要です。

|                                                                                                             |                                                                                |
| :---------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
|        ![MultiInvaders：数字を掲げたモンスターと画面下部の宇宙船](docs/media/10-multiinvaders.webp)         |     ![MultiMiam：選択肢の数字が置かれた迷路](docs/media/11-multimiam.webp)     |
|      **MultiInvaders** — 不正解を撃ち、正解は撃たずに残します。その中には救出する仲間が隠れています。       |   **MultiMiam** — モンスターを避けながら迷路を進み、正しい答えを捕まえます。   |
| ![MultiMemory：カードのグリッドと、計算式および数字が表示された2枚のカード](docs/media/12-multimemory.webp) | ![MultiSnake：草原にいるヘビと数字付きのリンゴ](docs/media/13-multisnake.webp) |
|              **MultiMemory** — めくられた計算式の答えが書かれたカードを記憶から探し出します。               |  **MultiSnake** — 正しい数字を食べて成長し、それ以外の数字をすべて避けます。   |

## ✨ 機能

### 🎮 ゲームモード

- **発見モード**：各演算に合わせた視覚的でインタラクティブな学習
- **クイズモード**：4つの演算（×、+、−、÷）に対応した選択式問題と適応型の進捗
- **チャレンジモード**：4つの演算（×、+、−、÷）と複数の難易度に対応した時間制チャレンジ
- **アドベンチャーモード**：4つの演算に対応した、レベルごとに進む物語形式の学習

### 🕹️ アーケード・ミニゲーム

- **MultiInvaders**：教育版 Space Invaders - 不正解を破壊する
- **MultiMiam**：算数版 Pac-Man - 正解を集める
- **MultiMemory**：記憶ゲーム - 演算と答えを組み合わせる
- **MultiSnake**：教育版 Snake - 正しい数字を食べて成長する

### ➕ 複数演算への対応

LeapMultix では、**すべてのモード**で4つの算術演算を総合的に練習できます。

| モード         | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| クイズ         | ✅  | ✅  | ✅  | ✅  |
| チャレンジ     | ✅  | ✅  | ✅  | ✅  |
| 発見           | ✅  | ✅  | ✅  | ✅  |
| アドベンチャー | ✅  | ✅  | ✅  | ✅  |
| アーケード     | ✅  | ✅  | ✅  | ✅  |

### 🌍 共通機能

- **複数ユーザー**：進捗が保存される個別プロフィールの管理
- **多言語対応**：フランス語、英語、スペイン語をサポート
- **カスタマイズ**：アバター、配色テーマ、背景
- **アクセシビリティ**：キーボード操作、タッチ操作、WCAG 2.1 AA準拠
- **モバイル対応**：タブレットとスマートフォン向けに最適化されたインターフェース
- **進捗システム**：スコア、バッジ、デイリーチャレンジ

## 🚀 クイックスタート

### 前提条件

- Node.js（バージョン16以降）
- 最新のウェブブラウザ

### インストール

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

### 利用可能なスクリプト

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
```

## 🏗️ アーキテクチャ

### ファイル構成

JavaScript モジュールは、`core/`、`components/`、`modes/` の3つのディレクトリを除き、**`js/` の直下にフラットに配置されています**。そのため、ファイル名によってグループ分けされています（`arcade-*`、`multimiam-*`、`i18n*`…）。

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
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### 技術アーキテクチャ

**最新のES6モジュール**：このプロジェクトでは、ES6クラスとネイティブのimport/exportを使用したモジュール型アーキテクチャを採用しています。

**再利用可能なコンポーネント**：一元管理されたUIコンポーネント（TopBar、InfoBar、Dashboard、Customization）でインターフェースを構築しています。

**Lazy Loading**：初期パフォーマンスを最適化するため、`lazy-loader.js` を介して必要に応じてモジュールを効率的に読み込みます。

**統合ストレージシステム**：フォールバック付きのLocalStorageを介してユーザーデータを永続化するための一元化されたAPIです。

**一元化されたオーディオ管理**：多言語対応とユーザーごとの設定を備えたサウンド制御です。

**Event Bus**：保守しやすいアーキテクチャを実現する、コンポーネント間の疎結合なイベント通信です。

**スライド式ナビゲーション**：`goToSlide()` を使用した、番号付きスライド（slide0、slide1など）に基づくナビゲーションシステムです。

**セキュリティ**：すべてのDOM操作で `security-utils.js` を使用し、XSS対策とサニタイズを行います。

## 🎯 ゲームモードの詳細

### 発見モード

次の機能を備えた、掛け算の段を視覚的に学ぶためのインターフェースです。

- 掛け算のインタラクティブな視覚化
- アニメーションと暗記のヒント
- 教育的なドラッグ＆ドロップ
- 段ごとに自由に進められる学習

### クイズモード

次の機能を備えた選択式問題です。

- 1セッションにつき10問
- 正答状況に応じた適応型の進行
- 仮想テンキー
- 連続正解システム

### チャレンジモード

次の機能を備えた時間制チャレンジです。

- 3段階の難易度（初級、中級、上級）
- 正解時のタイムボーナス
- ライフシステム
- ハイスコアランキング

### アドベンチャーモード

次の機能を備えた物語形式の進行です。

- 開放可能な10のテーマ別レベル
- 進捗を視覚的に示すインタラクティブマップ
- キャラクターが登場する没入感のある物語
- 星と報酬のシステム

### アーケード・ミニゲーム

各ミニゲームには次の機能があります。

- 難易度の選択とカスタマイズ
- ライフとスコアのシステム
- キーボードとタッチ操作
- ユーザーごとの個別ランキング

## 🛠️ 開発

### 開発ワークフロー

**main に直接コミットしないでください。** このプロジェクトでは機能ブランチを使用します。

**1. ブランチを作成します。** 機能追加には `feat/`、バグ修正には `fix/` を使用します。

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 開発して確認します。** まずフォーマットを行ってください。CIはテストを実行する前にフォーマット違反を拒否します。

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. ブランチにコミットしてから、プッシュします。**

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. pull requestを作成し**、verify、Codacy、CodeFactor、SonarCloudの分析が完了するまで待ちます。すべて合格するまで修正してからマージします。

**コミットのスタイル**：簡潔な命令形のメッセージ（例："Fix arcade init errors"、"Refactor cache updater"）

**品質ゲート**：各コミットの前に `npm run lint`、`npm test`、`npm run test:coverage` が成功することを確認してください。

### コンポーネントのアーキテクチャ

**GameMode（基底クラス）**：すべてのモードは、標準化されたメソッドを持つ共通クラスを継承します。

**GameModeManager**：モードの起動と管理を一元的に制御します。

**UIコンポーネント**：TopBar、InfoBar、Dashboard、Customizationが一貫したインターフェースを提供します。

**Lazy Loading**：初期パフォーマンスを最適化するため、必要に応じてモジュールを読み込みます。

**Event Bus**：イベントシステムを介した、コンポーネント間の疎結合な通信です。

### テスト

このプロジェクトには包括的なテストスイートが含まれています。

- coreモジュールの単体テスト
- コンポーネントの統合テスト
- ゲームモードのテスト
- 自動コードカバレッジ

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### 本番ビルド

- **Rollup**：`js/main-es6.js` を、code-splittingとsourcemapを備えたESMにbundleします
- **Terser**：最適化のための自動minification
- **Post-build**：`css/` と `assets/`、favicon（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js` をコピーし、`dist/index.html` をハッシュ付きのエントリーファイル（例：`main-es6-*.js`）へ書き換えます
- **最終ディレクトリ**：静的配信の準備が整った `dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 継続的インテグレーション

**GitHub Actions**：`.github/workflows/ci.yml` は、`main` への各pushと各pull requestで実行されます。

**`verify`** — 処理を停止できる品質ゲートです。

- `npm ci`、続いて `npm run verify`（ESLint、Jestテスト、カバレッジ）
- `npm run format:check`（Prettier）

**`seo-report`** — `verify` の後にオンラインサイトのLighthouse監査を実行し、SEO指標を長期的に追跡します。

**pull requestに連携された外部分析**：Codacy、CodeFactor、SonarCloud。SonarCloudの品質ゲートでは、新しいコードの信頼性、セキュリティ、保守性についてA評価が必須です。

**デプロイ**：`./deploy.sh` はサイトをS3へ同期し、CloudFrontのキャッシュを無効化します。gitに含まれていないレスポンシブ画像は、必要に応じてスクリプトが再生成します。

### PWA（Progressive Web App）

LeapMultixは、オフライン対応とインストール機能を備えた完全なPWAです。

**Service Worker**（`sw.js`）：

- ナビゲーション：Network-firstを使用し、オフライン時は `offline.html` にフォールバック
- 画像：パフォーマンスを最適化するCache-first
- 翻訳：バックグラウンド更新を行うStale-while-revalidate
- JS/CSS：常に最新版を提供するNetwork-first
- `cache-updater.js` を使用した自動バージョン管理

**Manifest**（`manifest.json`）：

- すべてのデバイス向けのSVGおよびPNGアイコン
- モバイルへのインストールが可能（Add to Home Screen）
- アプリのような体験を実現するstandalone設定
- テーマと色をサポート

**オフラインモードをローカルでテストします。** サーバーを起動してから、`http://localhost:8080`（または表示されたポート）を開きます。

```bash
npm run serve
```

手動の場合：開発者ツールのネットワークを切断し（ネットワークタブのオフラインモード）、ページを再読み込みします。`offline.html` が表示される必要があります。

Puppeteerで自動的に行う場合：

```bash
npm run test:pwa-offline
```

**Service Worker管理スクリプト**：

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### 品質基準

**コード品質ツール**：

- **ESLint**：flat config（`eslint.config.js`）を使用した最新の設定、ES2022対応
- **Prettier**：コードの自動フォーマット（`.prettierrc`）
- **Stylelint**：CSSの検証（`.stylelintrc.json`）
- **JSDoc**：カバレッジ分析を備えた関数ドキュメントの自動生成

**重要なコーディング規則**：

- 未使用の変数と引数を削除する（`no-unused-vars`）
- 具体的なエラー処理を使用する（空のcatchを使わない）
- `innerHTML` を避け、`security-utils.js` の関数を使用する
- 関数の認知的複雑度を15未満に保つ
- 複雑な関数を、より小さなhelperに分割する

**セキュリティ**：

- **XSS対策**：`security-utils.js` の関数を使用する：
  - `innerHTML` の代わりに `appendSanitizedHTML()`
  - 安全な要素の作成には `createSafeElement()`
  - テキストコンテンツには `setSafeMessage()`
- **外部スクリプト**：`crossorigin="anonymous"` 属性が必須
- **入力検証**：外部データは必ずサニタイズする
- **Content Security Policy**：スクリプトの取得元を制限するCSPヘッダー

**アクセシビリティ**：

- WCAG 2.1 AA準拠
- 完全なキーボード操作
- 適切なARIAロールとラベル
- 基準を満たす色のコントラスト

**パフォーマンス**：

- `lazy-loader.js` を使用したモジュールのLazy Loading
- CSSの最適化とレスポンシブなasset
- 効率的なキャッシュを実現するService Worker
- 本番環境でのcode splittingとminification

## 📱 互換性

### サポート対象ブラウザー

インターフェースでは、色に `oklch()`、コンテキストに応じた状態に `:has()` を使用しているため、最低要件は次のとおりです：

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### デバイス

- **デスクトップ**：キーボードとマウスによる操作
- **タブレット**：最適化されたタッチインターフェース
- **スマートフォン**：画面に適応するレスポンシブデザイン

### アクセシビリティ

- 完全なキーボードナビゲーション（Tab、矢印キー、Esc）
- スクリーンリーダー向けの ARIA ロールとラベル
- 基準に準拠した色のコントラスト
- 支援技術への対応

## 🌍 ローカライゼーション

完全な多言語対応：

- **フランス語**（デフォルト言語）
- **英語**
- **スペイン語**

### 翻訳の管理

**翻訳ファイル：** `assets/translations/*.json`

**形式：**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n 管理スクリプト

**`npm run i18n:verify`** - 翻訳キーの整合性を確認

**`npm run i18n:unused`** - 使用されていない翻訳キーを一覧表示

**`npm run i18n:compare`** - 翻訳ファイルを fr.json（参照元）と比較

このスクリプト（`scripts/compare-translations.cjs`）は、すべての言語ファイルの同期を維持します：

**機能：**

- 不足しているキーの検出（fr.json には存在するが、ほかの言語には存在しないキー）
- 余分なキーの検出（ほかの言語には存在するが、fr.json には存在しないキー）
- 空の値の特定（`""`、`null`、`undefined`、`[]`）
- 型の整合性確認（string と array）
- ネストされた JSON 構造をドット記法にフラット化（例：`arcade.multiMemory.title`）
- 詳細なコンソールレポートの生成
- JSON レポートを `docs/translations-comparison-report.json` に保存

**出力例：**

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

**翻訳対象範囲：**

- ユーザーインターフェース全体
- ゲームの説明
- エラーおよびフィードバックメッセージ
- 説明とコンテキストヘルプ
- アドベンチャーモードの物語コンテンツ
- アクセシビリティおよび ARIA ラベル

## 📊 データストレージ

### ユーザーデータ

- プロフィールと設定
- ゲームモードごとの進捗
- アーケードゲームのスコアと統計
- カスタマイズ設定

### 技術的な機能

- フォールバック機能を備えたローカルストレージ（localStorage）
- ユーザーごとのデータ分離
- 進捗の自動保存
- 旧データの自動移行

## 🐛 問題を報告する

問題は GitHub の issue から報告できます。次の情報を含めてください：

- 問題の詳細な説明
- 再現手順
- ブラウザーとバージョン
- 必要に応じてスクリーンショット

## 💝 プロジェクトを支援する

**[☕ PayPal で寄付する](https://paypal.me/jls)**

## 📄 ライセンス

このプロジェクトは AGPL v3 の下でライセンスされています。詳細については `LICENSE` ファイルを参照してください。

---

_LeapMultix — 四則演算を学ぶための自由な教育アプリケーション_

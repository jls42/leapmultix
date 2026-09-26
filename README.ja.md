<details>
<summary>このドキュメントは他の言語でも利用できます</summary>

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
[![Quality Gate ステータス](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![信頼性評価](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![セキュリティ評価](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![保守性評価](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![技術的負債](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![バグ](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![脆弱性](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![コードの問題点](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![重複行（%）](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![コード行数](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## 目次

- [概要](#概要)
- [スクリーンショット](#-スクリーンショット)
- [機能](#-機能)
- [クイックスタート](#-クイックスタート)
- [アーキテクチャ](#-アーキテクチャ)
- [ゲームモードの詳細](#-ゲームモードの詳細)
- [開発](#-開発)
- [互換性](#-互換性)
- [ローカライズ](#-ローカライズ)
- [収録済み音声](#-収録音声)
- [データストレージ](#-データストレージ)
- [問題を報告する](#-問題を報告する)
- [ライセンス](#-ライセンス)

## 概要

LeapMultixは、6歳から12歳までの子どもが、掛け算（×）、足し算（+）、引き算（−）、割り算（÷）という4つの算術演算を習得するためのインタラクティブな教育用Webアプリケーションです。直感的でアクセシブルな多言語インターフェースに、**5つのゲームモード**と**4つのアーケードミニゲーム**を備えています。

**複数演算への対応：** 5つのモードすべてで4つの演算を利用できます。演算はホーム画面で選択し、その後の全行程に適用されます。

**開発者：** Julien LS（contact@jls42.org）

**オンラインURL：** https://leapmultix.jls42.org/

## 📸 スクリーンショット

### 各画面

|                                                                                                       |                                                                                                    |
| :---------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: |
|              ![「誰がプレイする？」画面：プロフィールの選択](docs/media/01-accueil.webp)              |                ![メインメニュー：演算と5つのモードの選択](docs/media/02-menu.webp)                 |
|         **誰がプレイする？** — 子どもごとに、アバターと進捗を持つプロフィールを作成できます。         |                 **メニュー** — ここで演算を選択してから、5つのモードを開始します。                 |
|                     ![発見モード：4の段を点で表示](docs/media/03-decouverte.webp)                     |                ![クイズモード：不正解を赤、正解を緑で表示](docs/media/04-quiz.webp)                |
|          **発見** — それぞれの等式を点、ジャンプ、数え上げで示し、その段のコツも紹介します。          |    **クイズ** — 子どもが選んだ答えを正解の横に表示したまま、解説で計算方法を詳しく説明します。     |
|            ![チャレンジモード：カウントダウンと現在の連続正解数](docs/media/05-defi.webp)             | ![アドベンチャーモード：次のステージがロックされた10ステージのマップ](docs/media/06-aventure.webp) |
|          **チャレンジ** — 時間との勝負です。間違えると、正解を読む間はタイマーが停止します。          |           **アドベンチャー** — 星を獲得しながら、10のステージを順番に解放していきます。            |
|                   ![アーケードメニュー：4つのミニゲーム](docs/media/07-arcade.webp)                   |              ![ダッシュボード：段ごとの星と統計](docs/media/08-tableau-de-bord.webp)               |
|                **アーケード** — 難易度設定と宇宙船の選択ができる4つのミニゲームです。                 |         **ダッシュボード** — 段ごとの星、復習すべき段、モードごとのスコアを確認できます。          |
|       ![カスタマイズ：アバター、テーマ、アクセシビリティ](docs/media/09-personnalisation.webp)        |                                                                                                    |
| **カスタマイズ** — アバター、配色テーマ、文字サイズ、ハイコントラスト、保護者用コードを設定できます。 |                                                                                                    |

### アーケードミニゲーム

4つのゲームでは、プレイ領域の上に残り時間やライフとともに表示される同じ問題に答えますが、ゲームごとに異なる操作が求められます。

|                                                                                                            |                                                                                      |
| :--------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: |
|     ![MultiInvaders：数字を身につけたモンスターと、画面下部の宇宙船](docs/media/10-multiinvaders.webp)     | ![MultiMiam：選択肢となる答えが付いたドットのある迷路](docs/media/11-multimiam.webp) |
| **MultiInvaders** — 間違った答えを撃ち、正解は撃たずに残します。正解の中には、救出する仲間が隠れています。 |      **MultiMiam** — モンスターを避けながら迷路を進み、正しい答えを捕まえます。      |
|  ![MultiMemory：計算式と数字を示す2枚のカードがめくられたカードグリッド](docs/media/12-multimemory.webp)   |    ![MultiSnake：草原にいるヘビと数字付きのリンゴ](docs/media/13-multisnake.webp)    |
|              **MultiMemory** — めくられた計算式の答えが書かれたカードを記憶から探し出します。              |     **MultiSnake** — 正しい数字を食べて成長し、それ以外の数字をすべて避けます。      |

## ✨ 機能

### 🎮 ゲームモード

- **発見モード**：各演算に合わせた視覚的でインタラクティブな学習
- **クイズモード**：4つの演算（×、+、−、÷）に対応した選択式問題と適応型の進行
- **チャレンジモード**：4つの演算（×、+、−、÷）と複数の難易度に対応した時間制チャレンジ
- **アドベンチャーモード**：4つの演算に対応した、物語形式のステージ進行

### 🕹️ アーケードミニゲーム

- **MultiInvaders**：教育版Space Invaders - 間違った答えを破壊します
- **MultiMiam**：算数版Pac-Man - 正しい答えを集めます
- **MultiMemory**：記憶ゲーム - 演算と答えを組み合わせます
- **MultiSnake**：教育版Snake - 正しい数字を食べて成長します

### ➕ 複数演算への対応

LeapMultixでは、**すべてのモード**で4つの算術演算を総合的に練習できます。

| モード         | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| クイズ         | ✅  | ✅  | ✅  | ✅  |
| チャレンジ     | ✅  | ✅  | ✅  | ✅  |
| 発見           | ✅  | ✅  | ✅  | ✅  |
| アドベンチャー | ✅  | ✅  | ✅  | ✅  |
| アーケード     | ✅  | ✅  | ✅  | ✅  |

### 🌍 共通機能

- **複数ユーザー**：保存される進捗を備えた個別プロフィールの管理
- **多言語対応**：フランス語、英語、スペイン語をサポート
- **カスタマイズ**：アバター、配色テーマ、背景
- **アクセシビリティ**：キーボード操作、タッチ操作、WCAG 2.1 AA準拠
- **収録済み音声**：事前収録された合成音声（フランス語はElevenLabsで作成したLucie、英語はMistral AIで作成したJane）による問題と励ましの読み上げに対応し、端末の音声へ自動的にフォールバックします。音声クリップは公開リポジトリには含まれていません（[収録済み音声](#-収録音声)を参照）
- **モバイル対応**：タブレットとスマートフォン向けに最適化されたインターフェース
- **進捗システム**：スコア、バッジ、デイリーチャレンジ

## 🚀 クイックスタート

### 前提条件

- Node.js（バージョン16以降）
- 最新のWebブラウザ

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

# Voix enregistrée (poste du propriétaire, clips hors dépôt)
npm run voice:corpus       # Résumé des phrases dites, par langue
npm run voice:corpus:lock  # Mettre à jour le verrou du corpus
npm run voice:generate     # Générer les clips (ElevenLabs ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 アーキテクチャ

### ファイル構成

JavaScriptモジュールは、`core/`、`components/`、`modes/`の3つのフォルダーを除き、**`js/`直下にフラットに配置**されています。そのため、ファイル名がグループ分けを表します（`arcade-*`、`multimiam-*`、`i18n*`…）。

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

### 技術アーキテクチャ

**最新のES6モジュール**：このプロジェクトでは、ES6クラスとネイティブなimport/exportを使用するモジュール式アーキテクチャを採用しています。

**再利用可能なコンポーネント**：一元管理されたUIコンポーネント（TopBar、InfoBar、Dashboard、Customization）でインターフェースを構築しています。

**Lazy Loading**：初期パフォーマンスを最適化するため、`lazy-loader.js`を介して必要に応じてモジュールを効率的に読み込みます。

**統合ストレージシステム**：フォールバックを備えたLocalStorageを介し、一元化されたAPIでユーザーデータを永続化します。

**一元化された音声管理**：多言語対応とユーザーごとの設定を備えたサウンド制御を行います。

**Event Bus**：保守しやすいアーキテクチャのため、コンポーネント間で疎結合なイベント通信を行います。

**スライド式ナビゲーション**：`goToSlide()`を使用した、番号付きスライド（slide0、slide1など）に基づくナビゲーションシステムです。

**セキュリティ**：すべてのDOM操作で`security-utils.js`によるXSS対策とサニタイズを実施します。

## 🎯 ゲームモードの詳細

### 発見モード

次の機能を備えた、掛け算の九九を視覚的に学ぶためのインターフェースです。

- 掛け算のインタラクティブな視覚化
- アニメーションと記憶を助けるヒント
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
- 正解時の制限時間ボーナス
- ライフシステム
- ハイスコアランキング

### アドベンチャーモード

次の機能を備えた物語形式の進行です。

- 解放可能なテーマ別の10ステージ
- 進捗を視覚的に示すインタラクティブマップ
- キャラクターが登場する没入感のある物語
- 星と報酬のシステム

### アーケードミニゲーム

各ミニゲームには次の機能があります。

- 難易度の選択とカスタマイズ
- ライフとスコアのシステム
- キーボードとタッチによる操作
- ユーザーごとの個別ランキング

## 🔧 開発

### 開発ワークフロー

**mainへ直接コミットしないでください。** このプロジェクトでは機能ブランチを使用します。

**1. ブランチを作成します。** 機能開発には`feat/`、バグ修正には`fix/`を使用します。

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 開発して検証します。** 最初にフォーマットを確認してください。CIはテストを実行する前にフォーマット違反を検出して失敗します。

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. ブランチにコミットし、プッシュします。**

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. pull requestを作成**し、verify、Codacy、CodeFactor、SonarCloudの解析を待ちます。すべて成功するまで修正してからマージします。

**コミット形式**：簡潔な命令形のメッセージ（例："Fix arcade init errors"、"Refactor cache updater"）

**Quality gate**：各コミットの前に`npm run lint`、`npm test`、`npm run test:coverage`が成功することを確認してください

### コンポーネントアーキテクチャ

**GameMode（基底クラス）**：すべてのモードは、標準化されたメソッドを持つ共通クラスを継承します。

**GameModeManager**：モードの起動と管理を一元的に統括します。

**UIコンポーネント**：TopBar、InfoBar、Dashboard、Customizationによって一貫性のあるインターフェースを提供します。

**Lazy Loading**：初期パフォーマンスを最適化するため、必要に応じてモジュールを読み込みます。

**Event Bus**：イベントシステムを介した、コンポーネント間の疎結合な通信を行います。

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

- **Rollup**：`js/main-es6.js`を、code-splittingとsourcemapを備えたESMとしてbundle化
- **Terser**：最適化のための自動minify
- **Post-build**：`css/`と`assets/`、favicon（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js`をコピーし、`dist/index.html`をハッシュ付きエントリーファイル（例：`main-es6-*.js`）へ書き換え
- **最終フォルダー**：静的配信の準備が整った`dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 継続的インテグレーション

**GitHub Actions**：`.github/workflows/ci.yml`は、`main`へのpushおよび各pull requestで実行されます。

**`verify`** — ブロッキング方式のQuality gateです。

- `npm ci`、続いて`npm run verify`（ESLint、Jestテスト、カバレッジ）
- `npm run format:check`（Prettier）

**`seo-report`** — `verify`の後にオンラインサイトのLighthouse監査を実行し、SEO指標を長期的に追跡します。

pull requestにはCodacy、CodeFactor、SonarCloudの**外部解析**が組み込まれています。SonarCloudのQuality gateでは、新規コードの信頼性、セキュリティ、保守性について評価Aが求められます。

**デプロイ**：`./deploy.sh`はサイトをS3に同期し、CloudFrontのキャッシュを無効化します。このスクリプトは、gitに含まれていないレスポンシブ画像を必要に応じて再生成します。

### PWA（Progressive Web App）

LeapMultixは、オフライン対応とインストール機能を備えた完全なPWAです。

**Service Worker**（`sw.js`）：

- ナビゲーション：Network-firstを使用し、オフライン時は`offline.html`へフォールバック
- 画像：パフォーマンスを最適化するCache-first
- 翻訳：バックグラウンド更新を行うStale-while-revalidate
- JS/CSS：常に最新バージョンを配信するNetwork-first
- `cache-updater.js`による自動バージョン管理

**Manifest**（`manifest.json`）：

- あらゆる端末向けのSVGおよびPNGアイコン
- モバイル端末へのインストールに対応（Add to Home Screen）
- アプリのような操作感を実現するstandalone設定
- テーマと配色をサポート

**ローカルでオフラインモードをテストします。** サーバーを起動してから、`http://localhost:8080`（または表示されたポート）を開きます。

```bash
npm run serve
```

手動の場合：開発者ツールのネットワークタブでネットワークを切断してオフラインモードにし、ページを再読み込みします。`offline.html`が表示される必要があります。

Puppeteerを使用して自動的に行う場合：

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

- **ESLint**：flat config（`eslint.config.js`）を使用したモダンな設定、ES2022 対応
- **Prettier**：コードの自動フォーマット（`.prettierrc`）
- **Stylelint**：CSS の検証（`.stylelintrc.json`）
- **JSDoc**：カバレッジ分析を伴う関数ドキュメントの自動生成

**重要なコーディング規則**：

- 未使用の変数とパラメーターを削除する（`no-unused-vars`）
- 具体的なエラー処理を使用する（空の catch は使用しない）
- `innerHTML` を避け、`security-utils.js` 関数を使用する
- 関数の認知的複雑度を 15 未満に保つ
- 複雑な関数を、より小さなヘルパーに分割する

**セキュリティ**：

- **XSS 対策**：`security-utils.js` の関数を使用する：
  - `innerHTML` の代わりに `appendSanitizedHTML()`
  - 安全な要素の作成には `createSafeElement()`
  - テキストコンテンツには `setSafeMessage()`
- **外部スクリプト**：`crossorigin="anonymous"` 属性を必須とする
- **入力検証**：外部データを必ずサニタイズする
- **Content Security Policy**：スクリプトの取得元を制限する CSP ヘッダー

**アクセシビリティ**：

- WCAG 2.1 AA 準拠
- 完全なキーボードナビゲーション
- 適切な ARIA ロールとラベル
- 基準に準拠した色のコントラスト

**パフォーマンス**：

- `lazy-loader.js` によるモジュールの遅延読み込み
- CSS の最適化とレスポンシブアセット
- インテリジェントなキャッシュのための Service Worker
- 本番環境でのコード分割と圧縮

## 📱 互換性

### 対応ブラウザー

インターフェースでは、色に `oklch()`、コンテキストに応じた状態に `:has()` を使用しているため、最低対応バージョンは次のとおりです：

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### デバイス

- **デスクトップ**：キーボードとマウスによる操作
- **タブレット**：タッチ操作に最適化されたインターフェース
- **スマートフォン**：適応型レスポンシブデザイン

### アクセシビリティ

- 完全なキーボードナビゲーション（Tab、矢印キー、Esc）
- スクリーンリーダー向けの ARIA ロールとラベル
- 基準に準拠した色のコントラスト
- 支援技術への対応

## 🌍 ローカライズ

完全な多言語対応：

- **フランス語**（既定の言語）
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

**`npm run i18n:verify`** - 翻訳キーの整合性を確認する

**`npm run i18n:unused`** - 未使用の翻訳キーを一覧表示する

**`npm run i18n:compare`** - 翻訳ファイルを fr.json（基準ファイル）と比較する

このスクリプト（`scripts/compare-translations.cjs`）は、すべての言語ファイルの同期を保証します：

**機能：**

- 不足しているキーの検出（fr.json には存在するが、ほかの言語には存在しないキー）
- 余分なキーの検出（ほかの言語には存在するが、fr.json には存在しないキー）
- 空の値（`""`、`null`、`undefined`、`[]`）の特定
- 型の整合性確認（string と array）
- ネストされた JSON 構造をドット記法で平坦化（例：`arcade.multiMemory.title`）
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

**翻訳範囲：**

- ユーザーインターフェース全体
- ゲームの説明
- エラーとフィードバックのメッセージ
- 説明文とコンテキストヘルプ
- アドベンチャーモードの物語コンテンツ
- アクセシビリティ用ラベルと ARIA ラベル

## 🔊 収録音声

ゲームでは、事前に合成・収録された音声で、問題、励ましの言葉、説明を読み上げます：

- フランス語では、ElevenLabs（Eleven v3 モデル）で作成された **Lucie**；
- 英語では、Mistral AI（Voxtral TTS）で作成された **Jane**。

ゲームが読み上げるのは、言語ごとに約 7,400 個の有限のフレーズだけです。すべて事前に収録されており、音声合成サービスを呼び出すことはありません。スペイン語では、現時点ではデバイスの音声を使用します。

- フレーズごとの**デバイス音声への自動フォールバック**：クリップが存在しないかエラーになった場合、ブラウザーが再生を拒否した場合、クリップが 1.5 秒以内に開始されない場合、またはオフライン時にクリップがキャッシュされていない場合。
- **設定**：上部バーの音声ボタンで読み上げを有効または無効にします。「収録音声」チェックボックス（アクセシビリティと操作）で、収録音声（Lucie または Jane）とデバイスの音声を切り替えます。
- **オフライン**：一度再生されたクリップはキャッシュに保持されます（service worker）。

### クリップはこのリポジトリに含まれていません

クリップは非公開リポジトリと専用の S3 バケットに保存され、`/voice/*` 上の CloudFront を通じて配信されます。そのため、フォークやローカル開発ではデバイスの音声が使用されます。リポジトリ内では `<meta name="leapmultix-voice-base">` タグは空で、本番デプロイ時にのみ `/voice/` が書き込まれます。

ローカル環境にクリップがある場合（ゲームの隣に `../leapmultix-voices` として非公開リポジトリをクローン）、`?voix=local` パラメーターにより開発サーバーからクリップを再生できます：

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### クリップを生成する

処理フローは `scripts/voice/` にスクリプト化されており、所有者のローカル環境で実行されます。公開 CI では決して実行されません。プロバイダーのキー（フランス語には ElevenLabs、英語には Mistral）は、リポジトリ外の `.env` ファイルに保存され、`node --env-file` を介して渡されます。キーが git に入ることはありません。Claude Code スキルの [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) には、手順（確認段階、承認、再開）が段階的に記載されています。詳細は [`docs/voix-enregistree.md`](docs/voix-enregistree.md) にあります。

1. **見積もる**：残りのフレーズ数と課金対象の文字数を見積もります（Eleven v3：1 文字あたり約 0.53 クレジット、Voxtral TTS：100 万文字あたり 16 ドル）。
2. **生成する**：同じコマンドを再実行すると、不足分から再開します。クレジットを使い切ると、スクリプトは書きかけのファイルを残さず正常に停止します（終了コード 3）。`--max-total-chars` はバージョンごとの累積支出に上限を設定します。課金された各レスポンスは受信直後に台帳へ記録されるため、突然停止しても記録は保持されます。参照可能な残高を提供していない Mistral では、これが唯一の保護手段です。
3. **検証する**：各フレーズにクリップがあり、各 MP3 が有効であることを確認します。その後、Whisper が各クリップをローカルで文字起こしし、検証処理が聞き間違えられた数字や異常な長さを検出します。`voice:review` は、Whisper、この検証、試聴ページを 1 つのコマンドで順に実行します。
4. **試聴する**：試聴ページ（`voice:listen`）で、検出されたクリップと、Whisper では区別できない女性形（「une fois 7」）のサンプルを試聴します。各クリップには「再作成」チェックボックスがあり、選択すると除外クリップの一覧に追加されます。
5. **再作成する**：除外されたクリップ（`--redo`）を再作成して Whisper を再実行し、2 つ目のページで各クリップの変更前と変更後を比較します。2、3 回試しても発音が不正確なクリップには、`SAID_OVERRIDES`（`scripts/voice/said-text.mjs`）で指定テキストを設定します。たとえば、数字をすべて文字で表記します。
6. **公開する**：クリップを公開し、オンラインで応答することを確認してから、まずテスター向けに言語インデックスを公開します（`?voix=test`）。
7. **全体公開する**：音声を全ユーザーに公開し、既定で有効にします。緊急停止機能（`voice:publish -- remove`）は対象言語をインデックスから削除し、ゲームをデバイスの音声へ戻します。

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

### 規則：読み上げるフレーズを変更した場合、本番投入前に再収録する

読み上げるすべてのフレーズは翻訳ファイル（`assets/translations/{fr,en,es}.json`）に由来し、コーパスの一部です。そのため、読み上げフレーズを変更すると、コーパスロックのテスト（`scripts/voice/corpus.lock.json`）が失敗します。収録音声がある言語では、変更対象フレーズのクリップを生成し、検証・試聴してから、マージする**前に**公開します。最後にロックを更新します（`npm run voice:corpus:lock`）。これらのクリップがない場合、変更されたフレーズはデバイスの音声で読み上げられます。

## 📊 データストレージ

### ユーザーデータ

- プロフィールと設定
- ゲームモードごとの進行状況
- アーケードゲームのスコアと統計
- カスタマイズ設定

### 技術的な機能

- フォールバックを備えたローカルストレージ（localStorage）
- ユーザーごとのデータ分離
- 進行状況の自動保存
- 古いデータの自動移行

## 🐛 問題を報告する

問題は GitHub の issue で報告できます。次の情報を含めてください：

- 問題の詳しい説明
- 再現手順
- ブラウザーとバージョン
- 必要に応じてスクリーンショット

## 💝 プロジェクトを支援する

**[☕ PayPal で寄付する](https://paypal.me/jls)**

## 📄 ライセンス

このプロジェクトは AGPL v3 の下でライセンスされています。詳細は `LICENSE` ファイルをご覧ください。

---

_LeapMultix — 四則演算を学ぶための自由な教育アプリケーション_

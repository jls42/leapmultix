<details>
<summary>このドキュメントは他の言語でも利用できます</summary>

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
![ライセンス : AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

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

## 目次

- [説明](#説明)
- [概要](#-概要)
- [機能](#-機能)
- [クイックスタート](#-クイックスタート)
- [アーキテクチャ](#-アーキテクチャ)
- [ゲームモード詳細](#-ゲームモード詳細)
- [開発](#-開発)
- [互換性](#-互換性)
- [ローカリゼーション](#-ローカリゼーション)
- [録音音声](#-録音音声)
- [データストレージ](#-データの保存)
- [問題を報告する](#-問題の報告)
- [ライセンス](#-ライセンス)

## 説明

LeapMultixは、6歳から12歳のお子様が四則演算（かけ算（×）、たし算（+）、ひき算（−）、わり算（÷））をマスターするための、インタラクティブな教育用ウェブアプリケーションです。直感的でアクセシビリティに配慮した多言語対応インターフェースに、**5つのゲームモード**と**4つのアーケードミニゲーム**を備えています。

**複数演算のサポート：** 5つのモードすべてが4つの演算に対応しています。演算の選択はホーム画面で行い、ゲーム全体に適用されます。

**開発者：** Julien LS (contact@jls42.org)

**公開URL：** https://leapmultix.jls42.org/

## 📸 概要

### 画面

|                                                                                               |                                                                                                     |
| :-------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
|           ![「だれがあそぶ？」画面：プロフィールの選択](docs/media/01-accueil.webp)           |                 ![メインメニュー：演算と5つのモードの選択](docs/media/02-menu.webp)                 |
|         **だれがあそぶ？** — お子様ごとにアバターと進捗を管理できる個別プロフィール。         |                   **メニュー** — ここで演算を選択すると、5つのモードが開きます。                    |
|            ![発見モード：ドットで表示される4のだん](docs/media/03-decouverte.webp)            |                ![クイズモード：不正解は赤、正解は緑で表示](docs/media/04-quiz.webp)                 |
|    **発見** — 各計算式がドット、ジャンプ、またはカウントで表示され、九九のコツも学べます。    | **クイズ** — お子様の選んだ回答が正解の横に表示されたまま残り、解説で計算手順を詳しく確認できます。 |
|           ![チャレンジモード：カウントダウンと連続正解数](docs/media/05-defi.webp)            |       ![アドベンチャーモード：10レベルのマップ、以降はロック中](docs/media/06-aventure.webp)        |
| **チャレンジ** — 時間との戦い。間違えた時は、正解を確認できるようにタイマーが一時停止します。 |              **アドベンチャー** — スターを集めて1つずつアンロックしていく全10レベル。               |
|               ![アーケードメニュー：4つのミニゲーム](docs/media/07-arcade.webp)               |         ![ダッシュボード：のだんごとのスターと統計情報](docs/media/08-tableau-de-bord.webp)         |
|              **アーケード** — 難易度調整や宇宙船の選択が可能な4つのミニゲーム。               |             **ダッシュボード** — のだんごとのスター、復習が必要なだん、モード別スコア。             |
|   ![カスタマイズ：アバター、テーマ、アクセシビリティ](docs/media/09-personnalisation.webp)    |                                                                                                     |
| **カスタマイズ** — アバター、カラーテーマ、文字サイズ、ハイコントラスト、ペアレンタルコード。 |                                                                                                     |

### アーケードミニゲーム

プレイエリアの上部に残り時間やライフとともに表示される同じ問題に挑戦しますが、ゲームごとに異なるアクションが求められる4つのゲームです。

|                                                                                                  |                                                                                    |
| :----------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |
|    ![MultiInvaders：数字をつけたモンスターと画面下の宇宙船](docs/media/10-multiinvaders.webp)    | ![MultiMiam：選択肢となる答えがドットに書かれた迷路](docs/media/11-multimiam.webp) |
| **MultiInvaders** — 不正解を撃ち、正解は守りましょう。正解の後ろには助け出す仲間が隠れています。 |  **MultiMiam** — モンスターを避けながら迷路を進み、正しい答えをゲットしましょう。  |
|   ![MultiMemory：カードグリッド、めくられた2枚に計算式と数字](docs/media/12-multimemory.webp)    |   ![MultiSnake：草原にいるヘビと数字付きのリンゴ](docs/media/13-multisnake.webp)   |
|       **MultiMemory** — めくった計算式の答えがどのカードにあるかを記憶から見つけ出します。       |   **MultiSnake** — 正しい数字を食べて体を伸ばし、それ以外の数字は避けましょう。    |

## ✨ 機能

### 🎮 ゲームモード

- **発見モード**：各演算に合わせた視覚的でインタラクティブな探究
- **クイズモード**：4つの演算（×、+、−、÷）に対応し、習熟度に応じて変化する選択式問題
- **チャレンジモード**：4つの演算（×、+、−、÷）と複数の難易度レベルを備えたタイムアタック
- **アドベンチャーモード**：4つの演算に対応したストーリー仕立てのステージ進行

### 🕹️ アーケードミニゲーム

- **MultiInvaders**：学習版インベーダーゲーム - 不正解を撃破
- **MultiMiam**：算数版パックマン - 正しい答えを回収
- **MultiMemory**：神経衰弱ゲーム - 計算式と答えをペアリング
- **MultiSnake**：学習版スネークゲーム - 正しい数字を食べて成長

### ➕ 複数演算のサポート

LeapMultixは、**すべてのモード**で4つの算術演算を総合的にトレーニングできます：

| モード         | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| クイズ         | ✅  | ✅  | ✅  | ✅  |
| チャレンジ     | ✅  | ✅  | ✅  | ✅  |
| 発見           | ✅  | ✅  | ✅  | ✅  |
| アドベンチャー | ✅  | ✅  | ✅  | ✅  |
| アーケード     | ✅  | ✅  | ✅  | ✅  |

### 🌍 全体共通機能

- **マルチユーザー**：進捗が保存される個別プロフィールの管理
- **多言語対応**：フランス語、英語、スペイン語に対応
- **カスタマイズ**：アバター、カラーテーマ、背景
- **アクセシビリティ**：キーボードナビゲーション、タッチ操作対応、WCAG 2.1 AA準拠
- **録音音声**：事前録音された合成音声で問題文や応援メッセージを読み上げることができ、端末の標準音声への自動フォールバックも備えています。音声ファイルはこのリポジトリには含まれていません。leapmultix.jls42.org では、フランス語にLucie、英語とスペイン語にSulafat、選択肢としてフランス語にSulafatとMarie、英語にJaneを提供しています（詳細は[録音音声](#-録音音声)を参照）
- **モバイルレスポンシブ**：タブレットやスマートフォンに最適化されたインターフェース
- **進捗システム**：スコア、バッジ、デイリーチャレンジ

## 🚀 クイックスタート

### 前提条件

- Node.js（バージョン16以上）
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

## 🧱 アーキテクチャ

### ファイル構成

JavaScriptモジュールは、`core/`、`components/`、`modes/`の3つのフォルダを除き、**`js/`内にフラットに配置**されています。そのため、グループ化はファイル名によって識別されます（`arcade-*`、`multimiam-*`、`i18n*`など）。

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

**モダンなES6モジュール**：ES6クラスとネイティブなimport/exportによるモジュール型アーキテクチャを採用しています。

**再利用可能なコンポーネント**：一元化されたUIコンポーネント（TopBar、InfoBar、Dashboard、Customization）で構築されたインターフェース。

**遅延読み込み（Lazy Loading）**：初期パフォーマンスを最適化するため、`lazy-loader.js`を介してオンデマンドでモジュールをインテリジェントに読み込みます。

**統合ストレージシステム**：フォールバック機能を備えたLocalStorageを介したユーザーデータの永続化のための集中型API。

**集中型オーディオ管理**：多言語サポートおよびユーザー別設定を備えたサウンド制御。

**イベントバス（Event Bus）**：メンテナンス性の高いアーキテクチャを実現する、コンポーネント間の疎結合なイベント駆動型通信。

**スライドナビゲーション**：`goToSlide()`による番号付きスライド（slide0、slide1など）に基づくナビゲーションシステム。

**セキュリティ**：DOM操作全般におけるXSS保護と`security-utils.js`によるサニタイズ。

## 🎯 ゲームモード詳細

### 発見モード

九九を視覚的に探究できるインターフェース：

- かけ算のインタラクティブな視覚化
- アニメーションとヒント・メモ
- 学習用ドラッグ＆ドロップ
- のだんごとの自由な進度

### クイズモード

選択式問題：

- 1セッションあたり10問
- 正解状況に応じたアダプティブな出題
- 仮想テンキー
- ストリークシステム（連続正解ボーナス）

### チャレンジモード

タイムアタック：

- 3段階の難易度（初級、中級、上級）
- 正解によるタイムボーナス
- ライフシステム
- ハイスコアランキング

### アドベンチャーモード

ストーリー仕立てのステージ進行：

- アンロック可能な10のテーマ別レベル
- 進行状況が視覚的にわかるインタラクティブマップ
- キャラクターが登場する没入感のあるストーリー
- スター＆報酬システム

### アーケードミニゲーム

各ミニゲームの特徴：

- 難易度選択とカスタマイズ
- ライフシステムとスコア
- キーボードおよびタッチ操作対応
- ユーザー別ランキング

## 🔧 開発

### 開発ワークフロー

**mainブランチに直接コミットしないでください。** このプロジェクトでは機能ブランチ単位で作業します。

**1. ブランチを作成します。** 新機能の場合は `feat/`、修正の場合は `fix/` を使用します：

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 開発と検証。** 最初にフォーマットを行います。CIではテストを実行する前にフォーマットエラーで弾かれます。

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. ブランチにコミット**し、プッシュします：

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. プルリクエストを作成**し、verify、Codacy、CodeFactor、SonarCloudの解析結果を待ちます。マージする前に、すべてのチェックがグリーン（合格）になるまで修正します。

**コミットスタイル**：簡潔なメッセージ、命令形（例: "Fix arcade init errors", "Refactor cache updater"）

**品質ゲート（Quality gate）**：コミット前に必ず `npm run lint`、`npm test`、`npm run test:coverage` がパスすることを確認してください

### コンポーネントアーキテクチャ

**GameMode（基底クラス）**：すべてのモードが標準化されたメソッドを持つ共通クラスを継承しています。

**GameModeManager**：モードの起動と管理を一元的に統括します。

**UIコンポーネント**：TopBar、InfoBar、Dashboard、Customizationが一貫したインターフェースを提供します。

**遅延読み込み（Lazy Loading）**：初期パフォーマンスを最適化するために、モジュールはオンデマンドで読み込まれます。

**イベントバス（Event Bus）**：イベントシステムを介してコンポーネント間を疎結合に通信します。

### テスト

プロジェクトには包括的なテストスイートが含まれています：

- コアモジュールの単体テスト
- コンポーネントの結合テスト
- ゲームモードのテスト
- 自動化されたコードカバレッジ

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### 本番ビルド

- **Rollup**：コード分割とソースマップを備えたESM形式で `js/main-es6.js` をバンドル
- **Terser**：最適化のための自動コード圧縮（縮小化）
- **ビルド後処理（Post-build）**：`css/` と `assets/`、ファビコン（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js` のコピー、およびハッシュ化されたエントリファイル（例: `main-es6-*.js`）への `dist/index.html` の書き換え
- **最終フォルダ**：静的配信可能な `dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 継続的インテグレーション（CI）

**GitHub Actions**：`.github/workflows/ci.yml`。`main` へのプッシュごと、およびプルリクエストごとにトリガーされます。

**`verify`** — ブロッキングされる品質ゲート：

- `npm ci`、その後に `npm run verify`（ESLint、Jestテスト、カバレッジ）
- `npm run format:check`（Prettier）

**`seo-report`** — `verify` の後：長期的なSEOメトリクスを追跡するための、公開サイトのLighthouse監査。

**プルリクエストに連携された外部解析**：Codacy、CodeFactor、SonarCloud。SonarCloudのゲートでは、新規コードにおいて信頼性、セキュリティ、保守性の評価でA評価が要求されます。

**デプロイ**：`./deploy.sh` がサイトをS3に同期し、CloudFrontのキャッシュを無効化します。このスクリプトは、Gitで管理されていないレスポンシブ画像を必要に応じて再生成します。

### PWA（プログレッシブウェブアプリ）

LeapMultixは、オフライン対応およびインストール機能を備えた完全なPWAです。

**Service Worker**（`sw.js`）：

- ナビゲーション：Network-first（ネットワーク優先）、オフライン時は `offline.html` へフォールバック
- 画像：パフォーマンス最適化のための Cache-first（キャッシュ優先）
- 翻訳：バックグラウンド更新のための Stale-while-revalidate
- JS/CSS：常に最新バージョンを配信するための Network-first
- `cache-updater.js` による自動バージョン管理

**Manifest**（`manifest.json`）：

- すべてのデバイス向けのSVGおよびPNGアイコン
- モバイルへのインストール対応（ホーム画面に追加）
- ネイティブアプリのような体験を提供するスタンドアロン設定
- テーマとカラーのサポート

**ローカルでオフラインモードをテストする。** サーバーを起動し、`http://localhost:8080`（または表示されたポート）を開きます：

```bash
npm run serve
```

手動テスト：開発者ツール（「Network」タブ、オフラインモード）でネットワークを切断し、ページをリロードします。`offline.html` が表示される必要があります。

Puppeteerによる自動テスト：

```bash
npm run test:pwa-offline
```

**Service Worker管理スクリプト**：

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### 品質基準

**コード品質ツール**:

- **ESLint**: フラット設定（`eslint.config.js`）によるモダンな設定、ES2022のサポート
- **Prettier**: コードの自動フォーマット（`.prettierrc`）
- **Stylelint** : CSSの検証（`.stylelintrc.json`）
- **JSDoc**: カバレッジ分析を伴う関数の自動ドキュメント生成

**重要なコードルール**:

- 未使用の変数やパラメータを削除する（`no-unused-vars`）
- 明示的なエラー処理を行う（空のcatchは禁止）
- `innerHTML` を避け、`security-utils.js` 関数を優先する
- 関数の認知的複雑度を15未満に維持する
- 複雑な関数は小さなヘルパー関数に抽出・分割する

**セキュリティ**:

- **XSS対策**: `security-utils.js` の関数を使用:
  - `innerHTML` ではなく `appendSanitizedHTML()`
  - 安全な要素を作成するための `createSafeElement()`
  - テキストコンテンツ用の `setSafeMessage()`
- **外部スクリプト**: `crossorigin="anonymous"` 属性が必須
- **入力検証**: 外部データは常にサニタイズする
- **Content Security Policy**: スクリプトの読み込み元を制限するCSPヘッダー

**アクセシビリティ**:

- WCAG 2.1 AA準拠
- 完全なキーボードナビゲーション
- 適切なARIAロールおよびラベル
- 適合したコントラスト比

**パフォーマンス**:

- `lazy-loader.js` によるモジュールの遅延読み込み
- CSSの最適化とレスポンシブアセット
- スマートなキャッシングのためのService Worker
- 本番環境におけるコード分割と圧縮（Minification）

## 📱 互換性

### サポート対象ブラウザ

UIは色に `oklch()` を、コンテキスト状態に `:has()` を利用しているため、以下の環境が下限となります。

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### デバイス

- **デスクトップ**: キーボードおよびマウスでの操作
- **タブレット**: 最適化されたタッチインターフェース
- **スマートフォン**: レスポンシブで適応的なデザイン

### アクセシビリティ

- 完全なキーボードナビゲーション（Tab、矢印キー、Esc）
- スクリーンリーダー向けのARIAロールおよびラベル
- 適合したコントラスト比
- 支援技術のサポート

## 🌍 ローカリゼーション

完全な多言語サポート:

- **フランス語**（デフォルト言語）
- **英語**
- **スペイン語**

### 翻訳の管理

**翻訳ファイル:** `assets/translations/*.json`

**フォーマット:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n管理スクリプト

**`npm run i18n:verify`** - 翻訳キーの整合性を確認

**`npm run i18n:unused`** - 未使用の翻訳キーを一覧表示

**`npm run i18n:compare`** - 翻訳ファイルを fr.json（基準）と比較

このスクリプト（`scripts/compare-translations.cjs`）は、すべての言語ファイルの同期を保証します。

**機能:**

- 不足しているキーの検出（fr.json には存在するが、他の言語には存在しないキー）
- 余剰なキーの検出（他の言語には存在するが、fr.json には存在しないキー）
- 空の値の特定（`""`、`null`、`undefined`、`[]`）
- 型の一貫性チェック（文字列 vs 配列）
- ネストされたJSON構造のドット記法へのフラット化（例: `arcade.multiMemory.title`）
- 詳細なコンソールレポートの生成
- JSONレポートの `docs/translations-comparison-report.json` への保存

**出力例:**

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

**翻訳の対象範囲:**

- ユーザーインターフェース全体
- ゲームの説明
- エラーメッセージおよびフィードバックメッセージ
- 説明文およびコンテキストヘルプ
- アドベンチャーモードのストーリーコンテンツ
- アクセシビリティおよびARIAラベル

## 🔊 録音音声

本ゲームは、問題、励ましの言葉、解説を音声で読み上げます。発話される文章は有限のセット（言語ごとに約7,400フレーズ）に限られているため、事前にまとめて録音しておくことができ、ゲームプレイ中に音声合成サービスを呼び出す必要がありません。音声クリップがない場合、ゲームはデバイスの内蔵音声で読み上げます。

### このリポジトリの内容: 音声抜きのアプリケーション

コードには事前録音されたクリップを再生する機能と、それを生成するパイプラインが含まれています。ただし、リポジトリ内にクリップ自体やプロバイダーのAPIキーは含まれていません。そのため、フォークやローカルインストール環境ではデバイスの内蔵音声で読み上げが行われます。

- **自動フォールバック**: クリップが存在しない、またはエラーが発生した場合、ブラウザによって再生が拒否された場合、1.5秒以内にクリップの再生が開始されない場合、キャッシュにクリップがないオフライン状態の場合、文章ごとに自動的にデバイスの音声へと切り替わります。
- **設定**: トップバーの音声ボタンで読み上げの有効/無効を切り替えます。「録音音声」（アクセシビリティと操作）のチェックボックスで、録音音声とデバイス音声のどちらを使用するかを選択します。この項目は、音声が公開されている言語でのみ表示されます。
- **オフライン**: 一度再生されたクリップはキャッシュ（Service Worker）に保持されます。
- **ゲームがクリップを検索する場所**: タグ `<meta name="leapmultix-voice-base">` 内（リポジトリ内では空）。本番環境のデプロイ時のみ、ここに `/voice/` が書き込まれます。

ローカルマシン上で独自のクリップを用意している場合（後述のパイプラインで生成し、ゲームの隣の `../leapmultix-voices` に配置）、パラメータ `?voix=local` を指定することで開発サーバーからそれらを読み込ませることができます。

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org 上でのホスティング音声

作者が公開しているサイトでは、以下の録音された合成音声を提供しています。

- フランス語: ElevenLabs（Eleven v3モデル）で作成された **Lucie**
- イギリス英語およびカスティリャ・スペイン語: Google Cloud Text-to-Speech（Chirp 3 HD 音声）で作成された **Sulafat**
- プレイヤーの選択により、3言語すべてで同じ声にするためのフランス語版 **Sulafat**
- 同じくプレイヤーの選択として、Mistral AI（Voxtral TTS）で作成されたフランス語の **Marie** および英語の **Jane**

クリップはプライベートリポジトリおよび専用のS3バケットに保管され、`/voice/*` のCloudFrontを通じて配信されます。これらは一度だけ生成され、ゲームプレイ中にこれらのサービスへデータが送信されることはありません。設定内の「音声」メニューでは、対象の言語に複数の音声がある場合に選択肢が表示され、再生中の音声の提供サービス名が明記されます。

### クリップの生成

パイプラインは `scripts/voice/` にスクリプト化されており、リポジトリ所有者のローカルマシン上で実行されます（公開CIでは一切実行されません）。プロバイダーのAPIキー（Lucie用のElevenLabs、Sulafat用のGoogle Cloud Text-to-Speech、MarieおよびJane用のMistral）は、リポジトリ外の `.env` ファイル内に保持され、`node --env-file` 経由で渡されます。そのため、キーがGitにコミットされることはありません。Claude Codeのスキル [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) が手順（ゲートチェック、承認、再開）を順を追って実行します。詳細は [`docs/voix-enregistree.md`](docs/voix-enregistree.md) を参照してください。

1. 残りの文章数と課金対象文字数を**見積もる**（Eleven v3: 1文字あたり約0.53クレジット、Chirp 3 HD: 100万文字あたり30ドル、毎月最初の100万文字は無料、Voxtral TTS: 100万文字あたり16ドル）。
2. **生成する**。同じコマンドを再実行すると、不足分から再開されます。クレジットを使い切った場合、スクリプトは中途半端なファイルを残すことなく正常に終了します（終了コード3）。`--max-total-chars` はバージョンの累積支出に上限を設けます。有料レスポンスは受信後すぐにレジストリへ記録されるため、予期せぬ強制終了が発生しても記録は保持されます。残高を直接確認できないGoogleやMistralにおいて、これが唯一の防護策となります。
3. **検証する**: すべての文章に対応するクリップが存在し、各MP3が有効であることを確認します。次にWhisperがローカルで各クリップを文字起こしし、検証処理が聞き取りミスのある数字や異常な再生時間を警告します。`voice:review` はWhisper、この検証、リスニングページの起動を1つのコマンドで連続実行します。
4. リスニングページ（`voice:listen`）で、警告されたクリップや、Whisperでは判別できない女性形のサンプル（「une fois 7」など）を**試聴する**。各クリップには「要再作成」のチェックボックスがあり、チェックを入れると除外クリップのリストに追加されます。
5. 除外されたクリップを**再作成し**（`--redo`）、Whisperを再実行した上で、2つ目のページで変更前後の各クリップを比較します。2〜3回試行しても発音がおかしいクリップには、`SAID_OVERRIDES` 内で指定テキスト（例: 数字をアルファベットで綴った表記など）を割り当てます（`scripts/voice/said-text.mjs`）。
6. クリップを**公開し**、オンラインで正常に応答することを確認してから、まずテスター向けに対象言語のインデックスを公開します（`?voix=test`）。
7. 音声を全員向けに**一般公開し**、デフォルトで有効にします。サーキットブレーカー（`voice:publish -- remove`）を使用するとインデックスから言語が除外され、ゲームはデバイスの内蔵音声に戻ります。

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

### ルール: 発話される文章を変更した場合は、本番反映前に再録音する

発話されるすべての文章は翻訳ファイル（`assets/translations/{fr,en,es}.json`）に由来し、コーパスの一部となっています。したがって、発話対象の文章を変更すると、コーパスロックのテスト（`scripts/voice/corpus.lock.json`）に失敗します。録音音声が存在する言語については、影響を受けた文章のクリップを生成し、検証および試聴を行い、マージする**前**に公開します。最後にロックを更新します（`npm run voice:corpus:lock`）。これらのクリップがない場合、変更された文章はデバイスの内蔵音声で読み上げられます。

## 📊 データの保存

### ユーザーデータ

- プロフィールと環境設定
- ゲームモードごとの進捗状況
- アーケードゲームのスコアと統計情報
- カスタマイズ設定

### 技術的特徴

- フォールバックを備えたローカルストレージ（localStorage）
- ユーザーごとのデータ分離
- 進捗状況の自動保存
- レガシーデータの自動移行

## 🐛 問題の報告

問題はGitHub Issuesから報告できます。以下の情報を含めてください:

- 問題の詳細な説明
- 再現手順
- ブラウザとそのバージョン
- 該当する場合はスクリーンショット

## 💝 プロジェクトを支援する

**[☕ PayPal経由で寄付する](https://paypal.me/jls)**

## 📄 ライセンス

このプロジェクトはAGPL v3ライセンスの下で公開されています。詳細については `LICENSE` ファイルを参照してください。

---

_LeapMultix — 四則演算を学ぶための自由な教育用アプリケーション_

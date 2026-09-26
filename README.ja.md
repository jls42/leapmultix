<details>
<summary>このドキュメントは他の言語でもご覧いただけます</summary>

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
- [ローカライズ](#-ローカライゼーション)
- [録音音声](#-録音音声)
- [データストレージ](#-データストレージ)
- [問題の報告](#-問題の報告)
- [ライセンス](#-ライセンス)

## 説明

LeapMultixは、6歳から12歳の子どもたちが掛け算（×）、足し算（+）、引き算（−）、割り算（÷）の4つの算術演算を習得するためのインタラクティブな教育用ウェブアプリケーションです。直感的でアクセシビリティに配慮した多言語インターフェースの中で、**5つのゲームモード**と**4つのアーケードミニゲーム**を提供します。

**マルチ演算対応：** 5つのモードすべてが4つの演算に対応しています。ホーム画面で選択した演算は、プレイ全体に適用されます。

**開発者：** Julien LS (contact@jls42.org)

**オンラインURL：** https://leapmultix.jls42.org/

## 📸 概要

### 画面一覧

|                                                                                               |                                                                                                     |
| :-------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
|           ![「だれがあそぶ？」画面：プロフィールの選択](docs/media/01-accueil.webp)           |                 ![メインメニュー：演算と5つのモードの選択](docs/media/02-menu.webp)                 |
|        **だれがあそぶ？** — アバターと進行状況を備えた、子どもごとの個別プロフィール。        |                   **メニュー** — ここで演算を選択すると、5つのモードが開きます。                    |
|            ![はっけんモード：ドットで示される4の段](docs/media/03-decouverte.webp)            |                ![クイズモード：不正解は赤、正解は緑で表示](docs/media/04-quiz.webp)                 |
|  **はっけん** — 各計算式がドット、ジャンプ、またはカウントで表示され、九九のコツも学べます。  | **クイズ** — 子どもの選んだ解答が正解の隣に表示されたまま残り、解説で計算手順が詳しく説明されます。 |
|           ![チャレンジモード：カウントダウンと連続正解数](docs/media/05-defi.webp)            |      ![ぼうけんモード：10レベルのマップ、以降のレベルはロック中](docs/media/06-aventure.webp)       |
|  **チャレンジ** — 時間との戦い。間違えると、正解を確認できるようにタイマーが一時停止します。  |              **ぼうけん** — スターを集めることで次々とアンロックされていく10のレベル。              |
|               ![アーケードメニュー：4つのミニゲーム](docs/media/07-arcade.webp)               |           ![ダッシュボード：段ごとのスターと統計情報](docs/media/08-tableau-de-bord.webp)           |
|              **アーケード** — 難易度設定や宇宙船の選択が可能な4つのミニゲーム。               |               **ダッシュボード** — 段ごとのスター、復習が必要な段、モード別のスコア。               |
|   ![カスタマイズ：アバター、テーマ、アクセシビリティ](docs/media/09-personnalisation.webp)    |                                                                                                     |
| **カスタマイズ** — アバター、カラーテーマ、文字サイズ、ハイコントラスト、ペアレンタルコード。 |                                                                                                     |

### アーケードミニゲーム

ゲームエリアの上部に残り時間やライフとともに表示される同一の計算問題に対し、それぞれ異なる操作方法で答える4つのゲームです。

|                                                                                                    |                                                                                    |
| :------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |
|  ![MultiInvaders：数字を帯びたモンスターたちと画面下部の宇宙船](docs/media/10-multiinvaders.webp)  |    ![MultiMiam：選択肢となる回答が配置された迷路](docs/media/11-multimiam.webp)    |
| **MultiInvaders** — 誤った答えを撃ち、正しい答えは撃たずに残します。救出すべき仲間が隠れています。 | **MultiMiam** — モンスターを避けながら迷路を進み、正しい計算結果をキャッチします。 |
|    ![MultiMemory：めくられた計算式と数字のカードが並ぶグリッド](docs/media/12-multimemory.webp)    |   ![MultiSnake：草原にいるヘビと番号付きのリンゴ](docs/media/13-multisnake.webp)   |
|           **MultiMemory** — めくった計算式の答えがどのカードにあるかを記憶から探します。           |     **MultiSnake** — 正しい数字を食べて体を伸ばし、それ以外の数字は避けます。      |

## ✨ 機能

### 🎮 ゲームモード

- **はっけんモード**：各演算に適した視覚的でインタラクティブな探究
- **クイズモード**：4つの演算（×、+、−、÷）に対応し、習熟度に応じて変化する4択問題
- **チャレンジモード**：4つの演算（×、+、−、÷）と複数の難易度を備えたタイムアタック
- **ぼうけんモード**：4つの演算に対応した、レベル制のストーリー進行型モード

### 🕹️ アーケードミニゲーム

- **MultiInvaders**：学習型スペースインベーダー - 誤った答えを撃破
- **MultiMiam**：算数パックマン - 正しい答えを収集
- **MultiMemory**：神経衰弱ゲーム - 計算式と結果をマッチング
- **MultiSnake**：学習型スネークゲーム - 正しい数字を食べて成長

### ➕ マルチ演算対応

LeapMultixは、**すべてのモード**で4つの算術演算の包括的なトレーニングを提供します：

| モード     | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| クイズ     | ✅  | ✅  | ✅  | ✅  |
| チャレンジ | ✅  | ✅  | ✅  | ✅  |
| はっけん   | ✅  | ✅  | ✅  | ✅  |
| ぼうけん   | ✅  | ✅  | ✅  | ✅  |
| アーケード | ✅  | ✅  | ✅  | ✅  |

### 🌍 横断的な機能

- **マルチユーザー**：個別の進行状況を保存できるプロフィール管理
- **多言語対応**：フランス語、英語、スペイン語のサポート
- **カスタマイズ**：アバター、カラーテーマ、背景の変更
- **アクセシビリティ**：キーボードナビゲーション、タッチ操作対応、WCAG 2.1 AA準拠
- **録音音声**：事前録音された合成音声で問題や励ましのメッセージを読み上げ可能。端末側の音声合成への自動フォールバック機能付き。音声ファイルはこのリポジトリには含まれていません。サイト leapmultix.jls42.org ではフランス語でLucie、英語とスペイン語でSulafatを使用しています（[録音音声](#-録音音声)を参照）
- **モバイルレスポンシブ**：タブレットやスマートフォンに最適化されたUI
- **進行システム**：スコア、バッジ、デイリーチャレンジ

## 🚀 クイックスタート

### 前提条件

- Node.js（バージョン16以上）
- モダンなウェブブラウザ

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

JavaScriptモジュールは、`core/`、`components/`、`modes/`の3つのフォルダを除き、**`js/`の直下にフラットに配置**されています。そのため、ファイル名によってグループ分けが行われています（`arcade-*`、`multimiam-*`、`i18n*`…）。

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

**モダンなES6モジュール**：ES6クラスおよびネイティブのimport/exportを用いたモジュール設計を採用しています。

**再利用可能なコンポーネント**：一元管理されたUIコンポーネント（TopBar、InfoBar、Dashboard、Customization）で構築されたインターフェース。

**遅延読み込み（Lazy Loading）**：初回読み込みのパフォーマンスを最適化するため、`lazy-loader.js`を介してオンデマンドでモジュールをスマートにロードします。

**統合ストレージシステム**：フォールバック機能を備えたLocalStorage経由でユーザーデータを永続化する一元化API。

**一元管理された音声制御**：多言語対応およびユーザー別設定を備えたサウンド制御。

**Event Bus**：保守性の高いアーキテクチャを実現するための、コンポーネント間の疎結合なイベント駆動型通信。

**スライド式ナビゲーション**：`goToSlide()`を用いた番号付きスライド（slide0、slide1など）に基づくナビゲーションシステム。

**セキュリティ**：すべてのDOM操作に対する`security-utils.js`によるサニタイズとXSS保護。

## 🎯 ゲームモード詳細

### はっけんモード

以下の機能を備えた、九九を視覚的に探究できるインターフェース：

- 掛け算のインタラクティブな視覚化
- アニメーションと覚え方のヒント
- 教育的なドラッグ＆ドロップ
- 段ごとの自由な学習進行

### クイズモード

以下の機能を備えた選択式問題：

- 1セッションあたり10問
- 正解状況に応じた難易度の自動調整
- 画面上の仮想テンキー
- ストリークシステム（連続正解ボーナス）

### チャレンジモード

以下の機能を備えたタイムアタック：

- 3段階の難易度（初級、中級、上級）
- 正解時のタイムボーナス
- ライフ制
- ハイスコアランキング

### ぼうけんモード

以下の機能を備えたストーリー進行型モード：

- アンロック可能な10のテーマ別レベル
- 進行状況が視覚的にわかるインタラクティブマップ
- キャラクターが登場する没入型ストーリー
- スターおよび報酬システム

### アーケードミニゲーム

各ミニゲームの共通機能：

- 難易度選択とカスタマイズ
- ライフ制およびスコア機能
- キーボードおよびタッチ操作対応
- ユーザーごとの個別ランキング

## 🔧 開発

### 開発ワークフロー

**mainブランチには直接コミットしないでください。** このプロジェクトではフィーチャーブランチを使用して開発を進めます。

**1. ブランチを作成する**。新機能の場合は`feat/`、修正の場合は`fix/`：

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 開発と検証。** フォーマットの確認を最初に行います。CIではテストの実行前にフォーマット違反を検出して拒否します。

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

**4. プルリクエストを作成**し、各種解析（verify、Codacy、CodeFactor、SonarCloud）の完了を待ちます。マージする前に、すべてのチェックが合格（グリーン）になるまで修正します。

**コミットメッセージのスタイル**：簡潔で命令形のメッセージ（例：「Fix arcade init errors」、「Refactor cache updater」）

**Quality Gate**：各コミットの前に`npm run lint`、`npm test`、`npm run test:coverage`がパスすることを確認してください。

### コンポーネントのアーキテクチャ

**GameMode（基底クラス）**：すべてのモードが、標準化されたメソッドを持つ共通クラスを継承しています。

**GameModeManager**：モードの起動と管理を一元的に統括します。

**UIコンポーネント**：TopBar、InfoBar、Dashboard、Customizationが一貫したインターフェースを提供します。

**遅延読み込み（Lazy Loading）**：初回パフォーマンスを最適化するため、モジュールはオンデマンドで読み込まれます。

**Event Bus**：イベントシステムを介してコンポーネント間の疎結合な通信を実現します。

### テスト

プロジェクトには包括的なテストスイートが含まれています：

- コアモジュールの単体テスト
- コンポーネントの統合テスト
- 各ゲームモードのテスト
- 自動コードカバレッジ計測

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### プロダクションビルド

- **Rollup**：コード分割とソースマップを適用し、`js/main-es6.js`をESMとしてバンドル
- **Terser**：最適化のための自動コード圧縮（Minification）
- **ビルド後処理**：`css/`、`assets/`、ファビコン類（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js`のコピー、および`dist/index.html`内のエントリファイルをハッシュ付きファイル名（例：`main-es6-*.js`）へ書き換え
- **最終出力ディレクトリ**：静的配信可能な`dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 継続的インテグレーション（CI）

**GitHub Actions**：`.github/workflows/ci.yml`。`main`へのプッシュごと、およびプルリクエストごとに実行されます。

**`verify`** — ブロッキング品質ゲート：

- `npm ci`、続いて`npm run verify`（ESLint、Jestテスト、カバレッジ）
- `npm run format:check`（Prettier）

**`seo-report`** — `verify`実行後：長期的なSEOメトリクスを追跡するための、稼働中サイトに対するLighthouse監査。

**プルリクエストに連携された外部解析**：Codacy、CodeFactor、SonarCloud。SonarCloudの品質ゲートでは、新規コードに対して信頼性、セキュリティ、保守性の各評価でAランクを要求します。

**デプロイ**：`./deploy.sh`がサイトをS3へ同期し、CloudFrontのキャッシュを無効化します。スクリプトは、Gitで管理されていないレスポンシブ画像を必要に応じて再生成します。

### PWA（Progressive Web App）

LeapMultixは、オフライン対応およびインストール機能を備えた完全なPWAです。

**Service Worker** (`sw.js`)：

- ナビゲーション：Network-first（オフライン時は`offline.html`へフォールバック）
- 画像：パフォーマンス最適化のためのCache-first
- 翻訳ファイル：バックグラウンド更新のためのStale-while-revalidate
- JS/CSS：常に最新バージョンを提供するためのNetwork-first
- `cache-updater.js`による自動バージョン管理

**Manifest** (`manifest.json`)：

- あらゆるデバイスに対応するSVGおよびPNGアイコン
- モバイル端末へのインストール対応（ホーム画面に追加）
- アプリのような体験を提供するスタンドアロン設定
- テーマおよびカラーのサポート

**ローカルでのオフラインモードのテスト**。サーバーを起動し、`http://localhost:8080`（または表示されたポート番号）を開きます：

```bash
npm run serve
```

手動テスト：開発者ツールの「Network」タブでオフラインモードに切り替え、ページをリロードします。`offline.html`が表示される必要があります。

Puppeteerを使用した自動テスト：

```bash
npm run test:pwa-offline
```

**Service Workerの管理スクリプト**：

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### 品質基準

**コード品質ツール**:

- **ESLint**: フラット設定（`eslint.config.js`）によるモダンな構成、ES2022サポート
- **Prettier**: コードの自動フォーマット（`.prettierrc`）
- **Stylelint**: CSSの検証（`.stylelintrc.json`）
- **JSDoc**: カバレッジ分析を伴う関数の自動ドキュメント生成

**重要なコーディング規約**:

- 未使用の変数およびパラメータの削除（`no-unused-vars`）
- 具体的なエラー処理の実装（空のcatch句は禁止）
- `innerHTML` を避け、`security-utils.js` 関数を優先
- 関数の循環的・認知的複雑度を15未満に維持
- 複雑な関数をより小さなヘルパー関数へと抽出

**セキュリティ**:

- **XSS保護**: `security-utils.js` の機能を利用:
  - `innerHTML` の代わりに `appendSanitizedHTML()`
  - 安全な要素を作成するための `createSafeElement()`
  - テキストコンテンツ用の `setSafeMessage()`
- **外部スクリプト**: `crossorigin="anonymous"` 属性の必須化
- **入力の検証**: 外部データは常にサニタイズ
- **Content Security Policy**: スクリプトソースを制限するCSPヘッダー

**アクセシビリティ**:

- WCAG 2.1 AA準拠
- 完全なキーボードナビゲーション
- 適切なARIAロールおよびラベル
- 準拠したカラーコントラスト

**パフォーマンス**:

- `lazy-loader.js` によるモジュールの遅延読み込み（Lazy loading）
- CSSおよびレスポンシブアセットの最適化
- インテリジェントなキャッシュを実現するService Worker
- 本番環境でのコード分割（Code splitting）および縮小化（Minification）

## 📱 互換性

### サポート対象ブラウザ

インターフェースはカラー処理に `oklch()` を、コンテキスト状態の管理に `:has()` を採用しており、これにより以下の最低動作環境が定められています:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### デバイス

- **デスクトップ**: キーボードおよびマウス操作
- **タブレット**: 最適化されたタッチインターフェース
- **スマートフォン**: アダプティブなレスポンシブデザイン

### アクセシビリティ

- 完全なキーボードナビゲーション（Tab、矢印キー、Esc）
- スクリーンリーダー向けのARIAロールおよびラベル
- 準拠したカラーコントラスト
- 支援技術のサポート

## 🌍 ローカライゼーション

多言語を完全にサポート:

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

**`npm run i18n:verify`** - 翻訳キーの一貫性を検証

**`npm run i18n:unused`** - 未使用の翻訳キーを一覧表示

**`npm run i18n:compare`** - 翻訳ファイルをfr.json（基準）と比較

このスクリプト（`scripts/compare-translations.cjs`）は、すべての言語ファイルの同期を保証します:

**機能:**

- 不足しているキーの検出（fr.jsonには存在するが他の言語に存在しないもの）
- 余分なキーの検出（他の言語には存在するがfr.jsonには存在しないもの）
- 空の値の特定（`""`、`null`、`undefined`、`[]`）
- 型の一貫性の検証（文字列 vs 配列）
- ネストされたJSON構造のドット記法への平坦化（例: `arcade.multiMemory.title`）
- 詳細なコンソールレポートの生成
- `docs/translations-comparison-report.json` へのJSONレポートの保存

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

- 完全なユーザーインターフェース
- ゲームの説明手順
- エラーおよびフィードバックメッセージ
- 説明およびコンテキストヘルプ
- アドベンチャーモードのストーリーコンテンツ
- アクセシビリティおよびARIAラベル

## 🔊 録音音声

ゲームは問題、励ましの言葉、解説を音声で読み上げます。発話されるフレーズは有限のセット（各言語約7,400フレーズ）に限られているため、一度すべて録音してしまえば、プレイ中に音声合成サービスを呼び出す必要は一切ありません。音声クリップがない場合、ゲームはデバイスの音声を使用して読み上げを行います。

### 本リポジトリ内：音声を除いたアプリケーション

コードには事前録音されたクリップを再生する機能と、それらを生成するパイプラインが含まれています。ただし、クリップ本体やプロバイダーのAPIキーは含まれていません。そのため、フォークやローカルへのインストールではデバイスの音声で読み上げられます。

- フレーズごとのデバイス音声への**自動フォールバック**：クリップの欠落またはエラー、ブラウザによる再生拒否、1.5秒以内に開始しないクリップ、またはキャッシュにクリップがないオフライン状態。
- **設定**：トップバーの音声ボタンで読み上げの有効化/ミュートを切り替えます。「録音音声」チェックボックス（「アクセシビリティと操作」内）で、録音音声とデバイスの音声を選択できます。この設定は、音声が公開されている言語でのみ表示されます。
- **オフライン**：一度再生されたクリップはキャッシュ（Service Worker）に保持されます。
- **ゲームがクリップを検索する場所**：リポジトリ内では空になっている `<meta name="leapmultix-voice-base">` タグ内です。本番デプロイ時のみ、ここに `/voice/` が書き込まれます。

ローカル環境に独自のクリップがある場合（以下のパイプラインで作成され、ゲームと並んで `../leapmultix-voices` に配置されている場合）、`?voix=local` パラメータを使用することで開発サーバーからそれらを読み込ませることができます:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org 上：ホスティング版の音声

作者が提供するサイトでは、録音された合成音声が配信されています:

- フランス語：ElevenLabs（Eleven v3モデル）で作成された **Lucie**
- イギリス英語およびスペイン（カスティーリャ）語：Google Cloud Text-to-Speech（Chirp 3 HD音声）で作成された **Sulafat**

クリップはプライベートリポジトリおよび専用のS3バケットに保管され、CloudFront経由で `/voice/*` から配信されます。設定画面では、各言語ごとに音声を生成したサービス名が表示されます。

### クリップの生成

パイプラインは `scripts/voice/` 内でスクリプト化されており、公開CIではなくオーナーのマシン上で実行されます。プロバイダーのキー（フランス語用のElevenLabs、英語およびスペイン語用のGoogle Cloud Text-to-Speech。Mistralも接続可能）は、リポジトリ外にある `.env` ファイル内に保持され、`node --env-file` 経由で渡されます。そのため、キーがGitに入り込むことはありません。Claude Codeのスキルである [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) が手順を順を追って案内します（ゲート、合意、再試行）。詳細は [`docs/voix-enregistree.md`](docs/voix-enregistree.md) に記載されています。

1. 残りのフレーズと課金対象となる文字数を**見積もる**（Eleven v3：1文字あたり約0.53クレジット、Chirp 3 HD：100万文字あたり30ドル、各月最初の100万文字は無料、Voxtral TTS：100万文字あたり16ドル）。
2. **生成する**。同じコマンドを再実行すると、不足している分が再開されます。クレジットが切れると、スクリプトは中途半端に書き込まれたファイルを残さずに正常に停止（コード3）します。`--max-total-chars` により、そのバージョンの累積支出に上限が設定されます。有料レスポンスは受信と同時に台帳に記録され、強制終了が発生しても保持されます。残高を直接確認できないGoogleやMistralにおいては、これが唯一の保護策となります。
3. **検証する**：すべてのフレーズにクリップが存在し、各MP3が正常であることを確認します。次にWhisperがローカルで各クリップを文字起こしし、検証によって聞き取りミスのある数字や異常な長さが報告されます。`voice:review` は、Whisper、この検証、そして試聴ページの起動を1つのコマンドで連続実行します。
4. 試聴ページ（`voice:listen`）で、報告されたクリップおよびWhisperでは識別できない女性形（「une fois 7」など）のサンプルを**聴取する**。各クリップには「やり直す」チェックボックスがあり、除外クリップのリストに追加できます。
5. 除外されたクリップを**再作成する**（`--redo`）。Whisperを再実行し、2つ目のページで各クリップの前後の状態を比較します。2〜3回試行しても正しく発音されないクリップには、`SAID_OVERRIDES` 内で指定テキストを適用します（`scripts/voice/said-text.mjs`。例：数字をスペルアウトした表記）。
6. クリップを**公開する**。オンラインで正常に応答することを確認してから、まずテスター向けに言語のインデックスを公開します（`?voix=test`）。
7. 音声を全員向けに**開放する**。その後、デフォルトで有効化します。サーキットブレーカー（`voice:publish -- remove`）を使用すると、インデックスから特定の言語を削除してゲームをデバイスの音声へと戻すことができます。

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

### ルール：発話フレーズを変更した場合は、本番反映前に再録音すること

発話されるすべてのフレーズは翻訳（`assets/translations/{fr,en,es}.json`）に由来し、コーパスの一部となっています。そのため、発話フレーズを変更するとコーパスロックのテスト（`scripts/voice/corpus.lock.json`）が失敗します。録音音声を持つ言語の場合、変更対象となるフレーズのクリップを生成・検証・試聴し、マージする**前**に公開します。最後にロックを更新します（`npm run voice:corpus:lock`）。これらのクリップがない場合、変更されたフレーズはデバイスの音声で読み上げられます。

## 📊 データストレージ

### ユーザーデータ

- プロファイルと設定
- ゲームモードごとの進捗状況
- アーケードゲームのスコアと統計
- カスタマイズ設定

### 技術的特徴

- フォールバックを備えたローカルストレージ（localStorage）
- ユーザーごとのデータ分離
- 進捗状況の自動保存
- 古いデータの自動マイグレーション

## 🐛 問題の報告

不具合や問題はGitHubのIssuesから報告できます。報告の際は以下を含めてください:

- 問題の詳細な説明
- 再現手順
- ブラウザとそのバージョン
- 該当する場合はスクリーンショット

## 💝 プロジェクトへの支援

**[☕ PayPalで寄付する](https://paypal.me/jls)**

## 📄 ライセンス

このプロジェクトはAGPL v3ライセンスの下で公開されています。詳細については `LICENSE` ファイルを参照してください。

---

_LeapMultix — 四則演算を学ぶためのオープンソース教育アプリケーション_

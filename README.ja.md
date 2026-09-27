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
![ライセンス：AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![信頼性評価](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![セキュリティ評価](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![保守性評価](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![技術的負債](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![バグ](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![脆弱性](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![コードスメル](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![重複行率（%）](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
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
- [ローカライズ](#-ローカライゼーション)
- [録音音声](#-録音音声)
- [データストレージ](#-データの保存)
- [問題を報告する](#-問題の報告)
- [ライセンス](#-ライセンス)

## 説明

LeapMultixは、6歳から12歳のお子様が掛け算（×）、足し算（+）、引き算（−）、割り算（÷）の4つの算術演算をマスターできるように設計された、インタラクティブな教育用ウェブアプリケーションです。直感的でアクセシブル、かつ多言語対応のインターフェース内に、**5つのゲームモード**と**4つのアーケードミニゲーム**を提供します。

**マルチ演算対応：** 5つのモードすべてで4つの演算をサポートしています。ホーム画面で演算を選択すると、学習セッション全体に適用されます。

**開発者：** Julien LS (contact@jls42.org)

**オンラインURL：** https://leapmultix.jls42.org/

## 📸 概要

### 画面一覧

|                                                                                                 |                                                                                                |
| :---------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: |
|            ![「だれがあそぶ？」画面：プロフィールの選択](docs/media/01-accueil.webp)            |              ![メインメニュー：演算と5つのモードの選択](docs/media/02-menu.webp)               |
|           **だれがあそぶ？** — お子様ごとにアバターと進捗状況を保持するプロフィール。           |                 **メニュー** — ここで演算を選択すると、5つのモードが開きます。                 |
|                ![発見モード：点で表示された4の段](docs/media/03-decouverte.webp)                |               ![クイズモード：誤答は赤、正答は緑で表示](docs/media/04-quiz.webp)               |
|       **発見** — 各計算式がドット、ジャンプ、カウントで視覚化され、九九のコツも学べます。       |  **クイズ** — お子様が選んだ回答が正解の横に表示され続け、解説で計算手順が詳しく示されます。   |
|         ![チャレンジモード：カウントダウンと現在の連続正解数](docs/media/05-defi.webp)          | ![アドベンチャーモード：10レベルのマップ（以降のレベルはロック）](docs/media/06-aventure.webp) |
| **チャレンジ** — 時間との戦い。間違えた場合は、正解を確認できるようにタイマーが一時停止します。 |            **アドベンチャー** — スターを集めて順番にアンロックしていく10のレベル。             |
|                ![アーケードメニュー：4つのミニゲーム](docs/media/07-arcade.webp)                |        ![ダッシュボード：段ごとのスターと統計情報](docs/media/08-tableau-de-bord.webp)         |
|               **アーケード** — 難易度調整や宇宙船の選択が可能な4つのミニゲーム。                |            **ダッシュボード** — 段ごとのスター、復習が必要な段、モード別のスコア。             |
|    ![カスタマイズ：アバター、テーマ、アクセシビリティ](docs/media/09-personnalisation.webp)     |                                                                                                |
|   **カスタマイズ** — アバター、カラーテーマ、文字サイズ、ハイコントラスト、保護者用暗証番号。   |                                                                                                |

### アーケードミニゲーム

4つのゲームはすべて同じ問題（プレイエリア上部に残り時間やライフとともに表示）を出題しますが、それぞれ異なるアクションが求められます。

|                                                                                                       |                                                                                    |
| :---------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |
|       ![MultiInvaders：数字を運ぶモンスターと画面下の宇宙船](docs/media/10-multiinvaders.webp)        | ![MultiMiam：選択肢の数字が書かれたドットが並ぶ迷路](docs/media/11-multimiam.webp) |
|      **MultiInvaders** — 誤答を撃ち、正解は残します。正解の後ろには助け出す仲間が隠れています。       |     **MultiMiam** — モンスターを避けながら迷路を進み、正しい答えを回収します。     |
| ![MultiMemory：カードのグリッド、計算式と数字がめくられた2枚のカード](docs/media/12-multimemory.webp) |   ![MultiSnake：草原のヘビと数字の書かれたリンゴ](docs/media/13-multisnake.webp)   |
|        **MultiMemory** — めくられた計算式の答えがどのカードにあるかを記憶から見つけ出します。         |     **MultiSnake** — 正しい数字を食べて体を伸ばし、それ以外の数字を避けます。      |

## ✨ 機能

### 🎮 ゲームモード

- **発見モード**：各演算に合わせた視覚的でインタラクティブな探求
- **クイズモード**：4つの演算（×、+、−、÷）に対応した選択式問題と適応型プログレッション
- **チャレンジモード**：4つの演算（×、+、−、÷）と選べる難易度によるタイムアタック
- **アドベンチャーモード**：4つの演算に対応したレベル別のストーリー進行

### 🕹️ アーケードミニゲーム

- **MultiInvaders**：教育版スペースインベーダー - 誤答を破壊する
- **MultiMiam**：算数パックマン - 正解を集める
- **MultiMemory**：神経衰弱ゲーム - 計算式と答えを結びつける
- **MultiSnake**：教育版スネークゲーム - 正しい数字を食べて成長する

### ➕ 複数演算のサポート

LeapMultixは、**すべてのモード**で4つの算術演算の包括的な練習を提供します：

| モード         | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| クイズ         | ✅  | ✅  | ✅  | ✅  |
| チャレンジ     | ✅  | ✅  | ✅  | ✅  |
| 発見           | ✅  | ✅  | ✅  | ✅  |
| アドベンチャー | ✅  | ✅  | ✅  | ✅  |
| アーケード     | ✅  | ✅  | ✅  | ✅  |

### 🌍 共通機能

- **マルチユーザー**：進捗状況を保存できる個別プロフィール管理
- **多言語対応**：フランス語、英語、スペイン語をサポート
- **カスタマイズ**：アバター、カラーテーマ、背景
- **アクセシビリティ**：キーボードナビゲーション、タッチ操作対応、WCAG 2.1 AA準拠
- **録音音声**：事前に録音された合成音声で問題や励ましのメッセージを読み上げることができ、自動的に端末内蔵の音声へフォールバックします。音声データはこのリポジトリには含まれていません。leapmultix.jls42.orgサイトでは、フランス語にLucie、英語とスペイン語にSulafat、英語の選択肢としてJaneを提供しています（[録音音声](#-録音音声)を参照）
- **モバイルレスポンシブ**：タブレットやスマートフォンに最適化されたUI
- **プログレッションシステム**：スコア、バッジ、デイリーチャレンジ

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

JavaScriptモジュールは、`core/`、`components/`、`modes/`の3つのフォルダを除き、**`js/`内にフラットに配置**されています。そのため、ファイル名によってグループ化が行われています（`arcade-*`、`multimiam-*`、`i18n*`など）。

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

**モダンなES6モジュール**：ES6クラスとネイティブのインポート/エクスポートを採用したモジュラーアーキテクチャを使用しています。

**再利用可能なコンポーネント**：中央管理されたUIコンポーネント（TopBar、InfoBar、Dashboard、Customization）で構築されたインターフェース。

**遅延読み込み（Lazy Loading）**：初期パフォーマンスを最適化するため、`lazy-loader.js`を介して必要に応じてモジュールをスマートにオンデマンド読み込み。

**統合ストレージシステム**：フォールバック機能を備えたLocalStorageを介してユーザーデータを永続化する集中型API。

**一元化されたオーディオ管理**：多言語対応およびユーザー別設定を備えたサウンド制御。

**イベントバス（Event Bus）**：保守性の高いアーキテクチャを実現するための、コンポーネント間の疎結合なイベント駆動通信。

**スライド式ナビゲーション**：`goToSlide()`を使用した、番号付きスライド（slide0、slide1など）に基づくナビゲーションシステム。

**セキュリティ**：すべてのDOM操作に対して`security-utils.js`によるXSS保護とサニタイズを実施。

## 🎯 ゲームモードの詳細

### 発見モード

以下を備えた、九九の視覚的探求インターフェース：

- 掛け算のインタラクティブな視覚化
- アニメーションと虎の巻
- 教育的なドラッグ＆ドロップ
- 段ごとの自由な進捗

### クイズモード

以下を備えた選択式問題：

- 1セッションあたり10問
- 正解率に応じた適応型プログレッション
- バーチャルテンキー
- ストリーク（連続正解）システム

### チャレンジモード

以下を備えたタイムアタック：

- 3段階の難易度（初級、中級、上級）
- 正解によるタイムボーナス
- ライフシステム
- ハイスコアランキング

### アドベンチャーモード

以下を備えたストーリー進行：

- アンロック可能な10のテーマ別レベル
- 進行状況が視覚的にわかるインタラクティブマップ
- キャラクターが登場する没入型ストーリー
- スターと報酬システム

### アーケードミニゲーム

各ミニゲームで提供される機能：

- 難易度選択とカスタマイズ
- ライフとスコアのシステム
- キーボードおよびタッチ操作
- ユーザーごとの個別ランキング

## 🔧 開発

### 開発ワークフロー

**mainブランチへ直接コミットしないでください。** このプロジェクトではフィーチャーブランチを使用して作業します。

**1. ブランチを作成します**。機能追加の場合は`feat/`、修正の場合は`fix/`：

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 開発と検証を行います。** まずフォーマットを確認してください。フォーマットエラーがあると、CIはテストを実行する前に失敗します。

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

**4. プルリクエストを作成**し、各種解析（verify、Codacy、CodeFactor、SonarCloud）の完了を待ちます。マージする前に、すべてグリーン（成功）になるまで修正します。

**コミットスタイル**：簡潔なメッセージ、命令形（例: "Fix arcade init errors", "Refactor cache updater"）

**品質ゲート（Quality Gate）**：各コミットの前に`npm run lint`、`npm test`、`npm run test:coverage`がパスすることを確認してください。

### コンポーネントアーキテクチャ

**GameMode（基底クラス）**：すべてのモードが標準化されたメソッドを持つ共通クラスを継承します。

**GameModeManager**：モードの起動と管理を一元的にオーケストレーションします。

**UIコンポーネント**：TopBar、InfoBar、Dashboard、Customizationが一貫したインターフェースを提供します。

**遅延読み込み（Lazy Loading）**：初期パフォーマンスを最適化するため、モジュールはオンデマンドで読み込まれます。

**イベントバス（Event Bus）**：イベントシステムを介したコンポーネント間の疎結合な通信。

### テスト

プロジェクトには包括的なテストスイートが含まれています：

- コアモジュールの単体テスト
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

### プロダクションビルド

- **Rollup**：コードスプリッティングとソースマップを備えたESM形式での`js/main-es6.js`のバンドル
- **Terser**：最適化のための自動圧縮（ミニファイ）
- **ポストビルド**：`css/`と`assets/`、ファビコン（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js`のコピー、およびハッシュ付きエントリファイル（例: `main-es6-*.js`）への`dist/index.html`の書き換え
- **最終フォルダ**：静的配信可能な状態の`dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 継続的インテグレーション（CI）

**GitHub Actions**：`.github/workflows/ci.yml`。`main`へのプッシュごと、およびプルリクエストごとにトリガーされます。

**`verify`** — ブロッキングされる品質ゲート：

- `npm ci`、続いて`npm run verify`（ESLint、Jestテスト、カバレッジ）
- `npm run format:check`（Prettier）

**`seo-report`** — `verify`の後に実行：長期間にわたるSEOメトリクスを追跡するための、公開サイトのLighthouse監査。

**プルリクエストに連携された外部解析**：Codacy、CodeFactor、SonarCloud。SonarCloudゲートでは、新規コードに対して信頼性、セキュリティ、保守性の評価でAが要求されます。

**デプロイ**：`./deploy.sh`がサイトをS3に同期し、CloudFrontキャッシュを無効化します。スクリプトは、Gitに含まれていないレスポンシブ画像を必要に応じて再生成します。

### PWA（プログレッシブウェブアプリ）

LeapMultixは、オフライン対応およびインストール機能を備えた完全なPWAです。

**Service Worker** (`sw.js`)：

- ナビゲーション：Network-first（オフライン時は`offline.html`へフォールバック）
- 画像：パフォーマンス最適化のためのCache-first
- 翻訳：バックグラウンド更新のためのStale-while-revalidate
- JS/CSS：常に最新バージョンを提供するためのNetwork-first
- `cache-updater.js`による自動バージョン管理

**マニフェスト** (`manifest.json`)：

- すべてのデバイス向けのSVGおよびPNGアイコン
- モバイルへのインストール対応（ホーム画面に追加）
- アプリのような体験を提供するスタンドアロン設定
- テーマおよびカラーのサポート

**ローカルでオフラインモードをテストする。** サーバーを起動し、`http://localhost:8080`（または表示されたポート）を開きます：

```bash
npm run serve
```

手動テスト：開発者ツールの「Network」タブでオフラインモードに切り替え、ページをリロードします。`offline.html`が表示されるはずです。

Puppeteerを使用した自動テスト：

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

- **ESLint**: フラット設定（`eslint.config.js`）を備えたモダンな構成、ES2022 サポート
- **Prettier**: コードの自動フォーマット（`.prettierrc`）
- **Stylelint**: CSS の検証（`.stylelintrc.json`）
- **JSDoc**: カバレッジ分析を伴う関数の自動ドキュメント生成

**重要なコード規則**:

- 未使用の変数やパラメータを削除する（`no-unused-vars`）
- 具体的なエラー処理を行う（空の catch は禁止）
- `innerHTML` を避け、`security-utils.js` 関数を優先する
- 関数の循環的複雑度（Cognitive Complexity）を 15 未満に維持する
- 複雑な関数はより小さなヘルパー関数に分割・抽出する

**セキュリティ**:

- **XSS 対策**: `security-utils.js` の関数を使用する:
  - `innerHTML` の代わりに `appendSanitizedHTML()`
  - 安全な要素を作成するための `createSafeElement()`
  - テキストコンテンツ用の `setSafeMessage()`
- **外部スクリプト**: `crossorigin="anonymous"` 属性が必須
- **入力の検証**: 外部データは常にサニタイズする
- **Content Security Policy**: スクリプトの読み込み元を制限する CSP ヘッダー

**アクセシビリティ**:

- WCAG 2.1 AA 準拠
- 完全なキーボードナビゲーション
- 適切な ARIA ロールとラベル
- 基準を満たすカラーコントラスト

**パフォーマンス**:

- `lazy-loader.js` によるモジュールの遅延読み込み（Lazy loading）
- CSS の最適化とレスポンシブなアセット
- インテリジェントなキャッシュのための Service Worker
- 本番環境でのコード分割（Code splitting）と軽量化（Minification）

## 📱 互換性

### 対応ブラウザ

インターフェースは色指定に `oklch()`、コンテキスト状態に `:has()` を使用しており、以下の環境を最小動作要件としています:

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
- スクリーンリーダー用の ARIA ロールとラベル
- 基準を満たすカラーコントラスト
- 支援技術（アシスティブテクノロジー）のサポート

## 🌍 ローカライゼーション

多言語に完全対応:

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

### i18n 管理スクリプト

**`npm run i18n:verify`** - 翻訳キーの一貫性を検証

**`npm run i18n:unused`** - 未使用の翻訳キーを一覧表示

**`npm run i18n:compare`** - 翻訳ファイルを fr.json（基準）と比較

このスクリプト（`scripts/compare-translations.cjs`）はすべての言語ファイルの同期を保証します:

**機能:**

- 不足しているキーの検出（fr.json に存在するが他の言語に存在しない）
- 余分なキーの検出（他の言語に存在するが fr.json に存在しない）
- 空の値の特定（`""`、`null`、`undefined`、`[]`）
- 型の一貫性の検証（文字列 vs 配列）
- ネストされた JSON 構造をドット記法にフラット化（例: `arcade.multiMemory.title`）
- 詳細なコンソールレポートの生成
- JSON レポートを `docs/translations-comparison-report.json` に保存

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
- エラーメッセージとフィードバック
- 説明およびコンテキストヘルプ
- アドベンチャーモードのストーリーコンテンツ
- アクセシビリティおよび ARIA ラベル

## 🔊 録音音声

ゲームは問題、応援の言葉、解説を声に出して読み上げます。発声するフレーズは限定されており、1言語あたり約 7,400 種類です。そのため、一度録音してしまえば、プレイ中に音声合成サービスを呼び出す必要はありません。音声クリップがない場合、ゲームはデバイスの標準音声で読み上げます。

### このリポジトリの内容: 音声なしのアプリケーション

コードには事前録音されたクリップを再生する処理と、それらを生成するツールチェーンが含まれています。クリップ自体やプロバイダーの API キーはここには含まれていません。フォークやローカルインストール環境では、デバイスの音声で読み上げられます。

- デバイス音声への**自動フォールバック**（文単位）: クリップの欠落やエラー、ブラウザによる再生拒否、1.5秒以内に再生が開始されない場合、またはクリップがキャッシュされていないオフライン時。
- **設定**: トップバーの音声ボタンで読み上げの有効化/ミュートを切り替えます。「録音音声」チェックボックス（アクセシビリティと操作）で録音音声とデバイス音声を選択します。この項目は、音声が公開されている言語でのみ表示されます。
- **オフライン**: 一度再生されたクリップはキャッシュ（Service Worker）に保持されます。
- **ゲームがクリップを探す場所**: リポジトリ内では空になっている `<meta name="leapmultix-voice-base">` タグ内です。本番環境へのデプロイ時のみ、ここに `/voice/` が書き込まれます。

ローカル環境に独自のクリップ（下記のツールチェーンで生成し、ゲームの横の `../leapmultix-voices` に配置）がある場合、パラメータ `?voix=local` を指定することで開発サーバーからそれらを読み込ませることができます:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org 上での動作: ホスティング環境の音声

作者が提供するサイトでは、録音された合成音声が配信されます:

- フランス語: ElevenLabs（Eleven v3 モデル）で作成された **Lucie**
- イギリス英語およびスペイン（カスティーリャ）語: Google Cloud Text-to-Speech（Chirp 3 HD 音声）で作成された **Sulafat**
- 英語（プレイヤーが選択可能）: Mistral AI（Voxtral TTS）で作成された **Jane**

クリップはプライベートリポジトリと専用の S3 バケットに配置され、`/voice/*` 上で CloudFront を介して配信されます。設定の「音声」メニューでは、対象の言語に複数の音声がある場合に選択肢が表示され、再生中の音声の提供元サービス名が表示されます。

### クリップの生成

ツールチェーンは `scripts/voice/` にスクリプト化されており、公開 CI ではなく必ずオーナーのマシン上で実行されます。プロバイダーのキー（フランス語用 ElevenLabs、英語・スペイン語用 Google Cloud Text-to-Speech、Jane 用 Mistral）はリポジトリ外の `.env` ファイルに保持され、`node --env-file` 経由で渡されます。git にキーが含まれることはありません。Claude Code スキル [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) はステップバイステップで手順（ゲート、承認、リトライ）を実行します。詳細は [`docs/voix-enregistree.md`](docs/voix-enregistree.md) に記載されています。

1. **見積もり**: 残りのフレーズ数と支払対象となる文字数を算出します（Eleven v3: 1文字あたり約0.53クレジット、Chirp 3 HD: 100万文字あたり30ドル・毎月最初の100万文字は無料、Voxtral TTS: 100万文字あたり16ドル）。
2. **生成**: 同じコマンドを再実行すると、不足分が再開されます。クレジットが枯渇すると、スクリプトは書きかけのファイルを残さず正常に停止します（終了コード 3）。`--max-total-chars` はバージョンの累積支出に上限を設定します。支払われた各レスポンスは受信後すぐにレジストリに記録され、予期せぬ強制終了が発生しても保持されます。残高を直接確認できない Google や Mistral では、これが唯一の保護策となります。
3. **検証**: すべてのフレーズに対応するクリップが存在し、各 MP3 が有効であるかを確認します。その後、Whisper がローカルで各クリップを文字起こしし、チェック処理によって誤認された数値や異常な長さの音声にフラグが立てられます。`voice:review` は Whisper、この検証、そして試聴ページの起動を1つのコマンドで連続実行します。
4. **試聴**: 試聴ページ（`voice:listen`）で、フラグが立てられたクリップや、Whisper が判別できない女性形表現（「une fois 7」など）のサンプルを確認します。各クリップには「やり直し」チェックボックスがあり、除外クリップのリストに追加できます。
5. **再生成**: 除外されたクリップを再生成（`--redo`）して再度 Whisper を実行し、2つ目のページで各クリップの生成前後の状態を比較します。2〜3回試行しても正しく発音されないクリップには、`SAID_OVERRIDES`（`scripts/voice/said-text.mjs`）で指定テキスト（例: 数値を単語としてスペルアウトした形式）を強制適用します。
6. **公開**: クリップを公開し、オンラインでアクセスできることを確認したら、まずはテスター向けに言語インデックスを公開します（`?voix=test`）。
7. **一般公開**: 音声を全員に開放し、デフォルトで有効にします。サーキットブレーカー（`voice:publish -- remove`）を使用すると、インデックスから特定の言語を削除してゲームをデバイス音声に戻すことができます。

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

### ルール: 変更された発話フレーズは本番デプロイ前に再録音する

発話されるすべてのフレーズは翻訳（`assets/translations/{fr,en,es}.json`）に由来し、コーパスの一部となっています。したがって、読み上げフレーズを変更すると、コーパスロックのテスト（`scripts/voice/corpus.lock.json`）が失敗します。録音音声が存在する言語の場合、影響を受けるフレーズのクリップを生成し、検証と試聴を行ってから、マージする**前**に公開します。最後にロックを更新します（`npm run voice:corpus:lock`）。これらのクリップがない場合、変更されたフレーズはデバイスの音声で読み上げられます。

## 📊 データの保存

### ユーザーデータ

- プロフィールと設定
- ゲームモードごとの進行状況
- アーケードゲームのスコアと統計
- カスタマイズ設定

### 技術的特徴

- フォールバックを備えたローカルストレージ（localStorage）
- ユーザーごとのデータ分離
- 進行状況の自動保存
- 旧データの自動マイグレーション

## 🐛 問題の報告

問題の報告は GitHub の Issues から受け付けています。以下の内容を含めてください:

- 問題の詳細な説明
- 再現手順
- ブラウザとそのバージョン
- 該当する場合はスクリーンショット

## 💝 プロジェクトを支援する

**[☕ PayPal 経由で寄付する](https://paypal.me/jls)**

## 📄 ライセンス

このプロジェクトは AGPL v3 ライセンスのもとで公開されています。詳細については `LICENSE` ファイルを参照してください。

---

_LeapMultix — 四則演算を学ぶためのオープンソース教育アプリケーション_

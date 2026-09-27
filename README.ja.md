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
![ライセンス: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

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
- [プレビュー](#-プレビュー)
- [機能](#-機能)
- [クイックスタート](#-クイックスタート)
- [アーキテクチャ](#-アーキテクチャ)
- [ゲームモード詳細](#-ゲームモード詳細)
- [開発](#-開発)
- [互換性](#-互換性)
- [多言語対応](#-ローカリゼーション)
- [録音音声](#-録音音声)
- [データストレージ](#-データ保存)
- [問題の報告](#-問題の報告)
- [ライセンス](#-ライセンス)

## 説明

LeapMultixは、6歳から12歳の子どもたちが算数の4つの基本演算（掛け算（×）、足し算（+）、引き算（−）、割り算（÷））をマスターするためのインタラクティブな教育用Webアプリケーションです。直感的でアクセシブル、かつ多言語対応のインターフェースで、**5つのゲームモード**と**4つのアーケードミニゲーム**を提供します。

**複数演算に対応：** 5つのモードすべてが4つの演算に対応しています。ホーム画面で選択し、プレイ全体に適用されます。

**開発者：** Julien LS (contact@jls42.org)

**オンラインURL：** https://leapmultix.jls42.org/

## 📸 プレビュー

### 画面

|                                                                                                   |                                                                                                   |
| :-----------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
|             ![「だれがあそぶ？」画面：プロフィールの選択](docs/media/01-accueil.webp)             |                ![メインメニュー：演算と5つのモードの選択](docs/media/02-menu.webp)                |
|       **だれがあそぶ？** — 子どもごとに1つのプロフィールがあり、アバターと進捗状況を保持。        |                  **メニュー** — ここで演算を選択すると、5つのモードが開きます。                   |
|              ![はっけんモード：ドットで示された4の段](docs/media/03-decouverte.webp)              |               ![クイズモード：不正解は赤、正解は緑で表示](docs/media/04-quiz.webp)                |
| **はっけん** — 各計算式がドット、ジャンプ、またはカウントで視覚化され、九九のコツも表示されます。 | **クイズ** — 子どもが選んだ答えが正解の隣に表示されたままとなり、詳しい計算の解説も確認できます。 |
|          ![チャレンジモード：カウントダウンと現在の連続正解数](docs/media/05-defi.webp)           |    ![ぼうけんモード：10レベルのマップ（以降のレベルはロック中）](docs/media/06-aventure.webp)     |
|        **チャレンジ** — 時間との戦い。間違えるとタイマーが一時停止し、正解を確認できます。        |                **ぼうけん** — 星を獲得することで次々にアンロックされる10のレベル。                |
|                 ![アーケードメニュー：4つのミニゲーム](docs/media/07-arcade.webp)                 |            ![ダッシュボード：段ごとの星と統計情報](docs/media/08-tableau-de-bord.webp)            |
|                **アーケード** — 難易度調整や宇宙船の選択が可能な4つのミニゲーム。                 |               **ダッシュボード** — 段ごとの星、復習が必要な段、モードごとのスコア。               |
|     ![カスタマイズ：アバター、テーマ、アクセシビリティ](docs/media/09-personnalisation.webp)      |                                                                                                   |
|   **カスタマイズ** — アバター、カラーテーマ、文字サイズ、ハイコントラスト、ペアレンタルコード。   |                                                                                                   |

### アーケードミニゲーム

ゲームエリアの上部に残り時間やライフとともに表示される同じ問題に対し、ゲームごとに異なる操作で挑む4つのミニゲームです。

|                                                                                                       |                                                                                    |
| :---------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |
|     ![MultiInvaders：数字を背負ったモンスターと画面下の宇宙船](docs/media/10-multiinvaders.webp)      | ![MultiMiam：答えの候補となるドットが配置された迷路](docs/media/11-multimiam.webp) |
|       **MultiInvaders** — 不正解を撃ち、正解は残す：正解の後ろには助け出す仲間が隠れています。        |       **MultiMiam** — モンスターを避けながら迷路を進み、正しい答えをゲット。       |
| ![MultiMemory：カードのグリッド、計算式と数字がめくられた2枚のカード](docs/media/12-multimemory.webp) |   ![MultiSnake：草原の中のヘビと数字付きのリンゴ](docs/media/13-multisnake.webp)   |
|           **MultiMemory** — めくられた計算式の答えがどのカードにあるかを記憶から探し出す。            |      **MultiSnake** — 正しい数字を食べて体を伸ばし、それ以外の数字は避ける。       |

## ✨ 機能

### 🎮 ゲームモード

- **はっけんモード**：各演算に合わせた視覚的でインタラクティブな探求
- **クイズモード**：4つの演算（×、+、−、÷）に対応した選択式問題と適応型プログレッション
- **チャレンジモード**：4つの演算（×、+、−、÷）と複数の難易度を備えたタイムアタック
- **ぼうけんモード**：4つの演算に対応したストーリー形式のレベル進行

### 🕹️ アーケードミニゲーム

- **MultiInvaders**：教育型Space Invaders - 不正解を撃破
- **MultiMiam**：算数版Pac-Man - 正解を集める
- **MultiMemory**：神経衰弱ゲーム - 計算式と答えをマッチング
- **MultiSnake**：教育型Snake - 正しい数字を食べて成長

### ➕ 複数演算への対応

LeapMultixは、**すべてのモード**で算数の4つの基本演算の包括的なトレーニングを提供します：

| モード     | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| クイズ     | ✅  | ✅  | ✅  | ✅  |
| チャレンジ | ✅  | ✅  | ✅  | ✅  |
| はっけん   | ✅  | ✅  | ✅  | ✅  |
| ぼうけん   | ✅  | ✅  | ✅  | ✅  |
| アーケード | ✅  | ✅  | ✅  | ✅  |

### 🌍 共通機能

- **マルチユーザー**：進捗が保存される個別プロフィールの管理
- **多言語対応**：フランス語、英語、スペイン語に対応
- **カスタマイズ**：アバター、カラーテーマ、背景
- **アクセシビリティ**：キーボードナビゲーション、タッチ操作対応、WCAG 2.1 AA準拠
- **録音音声**：あらかじめ録音された合成音声で問題や応援メッセージを読み上げることができ、利用できない場合は端末の内蔵音声へ自動的にフォールバックします。音声データはこのリポジトリには含まれていません。leapmultix.jls42.org ではフランス語のLucie、英語およびスペイン語のSulafat、さらに選択制でフランス語のMarieと英語のJaneを配信しています（[録音音声](#-録音音声)を参照）。
- **モバイルレスポンシブ**：タブレットやスマートフォン向けに最適化されたインターフェース
- **進捗システム**：スコア、バッジ、毎日のチャレンジ

## 🚀 クイックスタート

### 前提条件

- Node.js（バージョン16以上）
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
npm run voice:generate     # Générer les clips (ElevenLabs, Google ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 アーキテクチャ

### ファイル構成

JavaScriptモジュールは、`core/`、`components/`、`modes/` の3つのフォルダを除き、**`js/` 直下にフラットに配置**されています。そのため、グループ分けはファイル名によって行われています（`arcade-*`、`multimiam-*`, `i18n*`など）。

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

**最新のES6モジュール**：ES6クラスとネイティブのインポート/エクスポートによるモジュール構成を採用しています。

**再利用可能なコンポーネント**：集約されたUIコンポーネント（TopBar、InfoBar、Dashboard、Customization）で構築されたインターフェース。

**遅延読み込み（Lazy Loading）**：初期パフォーマンスを最適化するため、`lazy-loader.js` を通じてオンデマンドでモジュールを効率的に読み込みます。

**統合ストレージシステム**：フォールバック機能を備えたLocalStorageを介し、ユーザーデータを永続化する集中API。

**集中オーディオ管理**：多言語対応およびユーザーごとの環境設定に対応したサウンド制御。

**イベントバス**：保守性の高いアーキテクチャを実現する、コンポーネント間の疎結合なイベント駆動型通信。

**スライドナビゲーション**：`goToSlide()` を使用した、番号付きスライド（slide0、slide1など）に基づくナビゲーションシステム。

**セキュリティ**：すべてのDOM操作に対して `security-utils.js` によるサニタイズとXSS保護を実施。

## 🎯 ゲームモード詳細

### はっけんモード

九九の表を視覚的に探求できるインターフェース：

- 掛け算のインタラクティブな視覚化
- アニメーションとヒント/覚え方
- 教育的なドラッグ＆ドロップ
- 段ごとの自由な進捗

### クイズモード

以下を備えた選択式問題：

- 1セッションあたり10問
- 正解率に応じた適応型進行
- 仮想テンキー
- ストリークシステム（連続正解数）

### チャレンジモード

以下を備えたタイムアタック：

- 3段階の難易度（初級、中級、上級）
- 正解によるタイムボーナス
- ライフシステム
- ハイスコアランキング

### ぼうけんモード

以下を備えたストーリー進行：

- アンロック可能な10のテーマ別レベル
- 進行状況が視覚的にわかるインタラクティブマップ
- キャラクターが登場する没入型ストーリー
- 星とリワードのシステム

### アーケードミニゲーム

各ミニゲームの主な特徴：

- 難易度選択とカスタマイズ
- ライフシステムとスコア
- キーボードおよびタッチ操作
- ユーザーごとの個別ランキング

## 🔧 開発

### 開発ワークフロー

**mainブランチへ直接コミットしないでください。** このプロジェクトではフィーチャーブランチを使用して開発を進めます。

**1. ブランチを作成します。** 新機能の場合は `feat/`、修正の場合は `fix/` を使用します：

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 開発と検証を行います。** フォーマットの確認を最初に行ってください。CIはテストを実行する前にフォーマット違反を検出して拒否します。

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. ブランチにコミットし**、プッシュします：

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. プルリクエストを作成し**、各種解析（verify、Codacy、CodeFactor、SonarCloud）の完了を待ちます。マージする前に、すべてグリーンになるまで修正します。

**コミットスタイル**：簡潔なメッセージ、命令形（例: 「Fix arcade init errors」、「Refactor cache updater」）

**Quality Gate**：各コミットの前に `npm run lint`、`npm test`、`npm run test:coverage` がパスすることを確認してください。

### コンポーネント構成

**GameMode（基底クラス）**：すべてのモードは、標準化されたメソッドを持つ共通クラスを継承しています。

**GameModeManager**：モードの起動と管理を一元的に統括。

**UIコンポーネント**：TopBar、InfoBar、Dashboard、Customization が一貫したインターフェースを提供。

**遅延読み込み（Lazy Loading）**：初期パフォーマンスを最適化するため、モジュールはオンデマンドで読み込まれます。

**イベントバス**：イベントシステムを介したコンポーネント間の疎結合通信。

### テスト

プロジェクトには包括的なテストスイートが含まれています：

- コアモジュールの単体テスト
- コンポーネントの結合テスト
- ゲームモードのテスト
- 自動コードカバレッジ

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### 本番用ビルド

- **Rollup**：コード分割とソースマップを備えたESM形式で `js/main-es6.js` をバンドル
- **Terser**：最適化のための自動コード圧縮（縮小化）
- **ビルド後処理**：`css/` と `assets/`、ファビコン（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js` をコピーし、`dist/index.html` 内のエントリファイルをハッシュ化されたファイル（例: `main-es6-*.js`）へ書き換え
- **出力ディレクトリ**：静的ホスティングの準備が整った `dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 継続的インテグレーション（CI）

**GitHub Actions**：`.github/workflows/ci.yml`。`main` への各プッシュ時およびプルリクエスト作成時にトリガーされます。

**`verify`** — ブロッキング品質ゲート：

- `npm ci`、続いて `npm run verify`（ESLint、Jestテスト、カバレッジ）
- `npm run format:check`（Prettier）

**`seo-report`** — `verify` の後：長期的なSEO指標を追跡するための本番サイトのLighthouse監査。

**プルリクエストに連携した外部解析**：Codacy、CodeFactor、SonarCloud。SonarCloudのQuality Gateでは、新規コードに対して信頼性、セキュリティ、保守性の評価でA評価が必須となります。

**デプロイ**：`./deploy.sh` がサイトをS3へ同期し、CloudFrontのキャッシュを無効化します。スクリプトは、Gitで管理されていないレスポンシブ画像を必要に応じて再生成します。

### PWA（プログレッシブウェブアプリ）

LeapMultixは、オフライン対応およびインストール機能を備えたフルスペックのPWAです。

**Service Worker** (`sw.js`)：

- ナビゲーション：Network-first（オフライン時は `offline.html` にフォールバック）
- 画像：パフォーマンス向上のためのCache-first
- 翻訳：バックグラウンド更新のためのStale-while-revalidate
- JS/CSS：常に最新バージョンを配信するためのNetwork-first
- `cache-updater.js` による自動バージョン管理

**マニフェスト** (`manifest.json`)：

- 全デバイス向けのSVGおよびPNGアイコン
- モバイル端末でのインストール対応（ホーム画面に追加）
- アプリのような操作感を提供するスタンドアロン設定
- テーマとカラーのサポート

**ローカルでオフラインモードをテストする。** サーバーを起動し、`http://localhost:8080`（または表示されたポート）を開きます：

```bash
npm run serve
```

手動の場合：開発者ツールの「ネットワーク」タブでオフラインモードに切り替えてからページを再読み込みします。`offline.html` が表示されるはずです。

Puppeteerによる自動テストの場合：

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

- **ESLint**: Flat config（`eslint.config.js`）によるモダンな設定、ES2022のサポート
- **Prettier**: コードの自動フォーマット（`.prettierrc`）
- **Stylelint**: CSSの検証（`.stylelintrc.json`）
- **JSDoc**: カバレッジ分析を伴う関数の自動ドキュメント生成

**重要なコードルール**:

- 未使用の変数およびパラメータの削除（`no-unused-vars`）
- 具体的なエラー処理の実装（空のcatchは禁止）
- `innerHTML` を避け、`security-utils.js` 関数を優先
- 関数の認知的複雑度を15未満に維持
- 複雑な関数はより小さなヘルパー関数に抽出

**セキュリティ**:

- **XSS対策**: `security-utils.js` の関数を使用:
  - `innerHTML` の代わりに `appendSanitizedHTML()`
  - 安全な要素を作成するための `createSafeElement()`
  - テキストコンテンツ用の `setSafeMessage()`
- **外部スクリプト**: `crossorigin="anonymous"` 属性が必須
- **入力検証**: 外部データは常にサニタイズ
- **Content Security Policy**: スクリプトの読み込み元を制限するCSPヘッダー

**アクセシビリティ**:

- WCAG 2.1 AA準拠
- 完全なキーボードナビゲーション
- 適切なARIAロールとラベル
- 準拠したカラーコントラスト

**パフォーマンス**:

- `lazy-loader.js` によるモジュールの遅延読み込み（Lazy loading）
- CSSの最適化とレスポンシブアセット
- インテリジェントなキャッシュのためのService Worker
- 本番環境におけるコード分割と最小化（Minification）

## 📱 互換性

### サポート対象ブラウザ

インターフェースは色に `oklch()` を、コンテキスト状態に `:has()` を使用しており、これらが最低要件となります:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### デバイス

- **デスクトップ**: キーボードおよびマウスによる操作
- **タブレット**: 最適化されたタッチインターフェース
- **スマートフォン**: レスポンシブで適応性のあるデザイン

### アクセシビリティ

- 完全なキーボードナビゲーション（Tab、矢印キー、Esc）
- スクリーンリーダー用のARIAロールとラベル
- 準拠したカラーコントラスト
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

このスクリプト（`scripts/compare-translations.cjs`）は、すべての言語ファイルの同期を確保します:

**機能:**

- 不足しているキーの検出（fr.json には存在するが他の言語に存在しないキー）
- 余分なキーの検出（他の言語には存在するが fr.json には存在しないキー）
- 空の値の識別（`""`、`null`、`undefined`、`[]`）
- 型の整合性チェック（文字列 vs 配列）
- ネストされたJSON構造のドット記法へのフラット化（例: `arcade.multiMemory.title`）
- 詳細なコンソールレポートの生成
- JSONレポートを `docs/translations-comparison-report.json` に保存

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

**翻訳の適用範囲:**

- 完全なユーザーインターフェース
- ゲームの説明・指示
- エラーメッセージおよびフィードバックメッセージ
- 説明文およびコンテキストヘルプ
- アドベンチャーモードのストーリーコンテンツ
- アクセシビリティおよびARIAラベル

## 🔊 録音音声

ゲームは問題、励ましの言葉、解説を音声で読み上げます。発声するフレーズは有限で言語ごとに約7,400文のみです。そのため一度すべて録音してしまえば、プレイ中に音声合成サービスを呼び出す必要はありません。音声クリップがない場合、ゲームはデバイスの標準音声で読み上げます。

### このリポジトリの内容: 音声なしのアプリケーション

コードには事前録音されたクリップを再生する機能と、それを生成するツールチェーンが含まれています。クリップ自体やプロバイダーのAPIキーはここには含まれていないため、フォーク環境やローカルインストールではデバイスの標準音声で再生されます。

- **自動フォールバック**: フレーズ単位でデバイスの標準音声に切り替わります（クリップが存在しないかエラーの場合、ブラウザが再生を拒否した場合、1.5秒以内にクリップが開始しない場合、またはキャッシュにクリップがないオフライン状態の場合）。
- **設定**: トップバーの音声ボタンで読み上げの有効/無効を切り替えます。「録音音声」（「アクセシビリティと操作」内）のチェックボックスで、録音音声とデバイスの標準音声を選択できます。この項目は、音声が公開されている言語でのみ表示されます。
- **オフライン**: 一度再生されたクリップはキャッシュ（Service Worker）に残ります。
- **ゲームがクリップを検索する場所**: `<meta name="leapmultix-voice-base">` タグ内（リポジトリ内では空）。本番デプロイ時のみ、ここに `/voice/` が書き込まれます。

ローカルマシン上に独自のクリップがある場合（以下のツールチェーンで作成され、ゲームと同じ階層の `../leapmultix-voices` に配置されている場合）、`?voix=local` パラメータにより開発サーバーから読み込ませることができます:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org 上でホストされている音声

作者によってホストされているサイトでは、録音された合成音声が提供されています:

- フランス語: ElevenLabs（Eleven v3モデル）で作成された **Lucie**
- イギリス英語およびカスティーリャ・スペイン語: Google Cloud Text-to-Speech（Chirp 3 HD 音声）で作成された **Sulafat**
- プレイヤーの選択可能音声: Mistral AI（Voxtral TTS）で作成されたフランス語の **Marie** と英語の **Jane**

クリップはプライベートリポジトリおよび専用のS3バケットに保存され、`/voice/*` 上のCloudFront経由で配信されます。設定の「音声」メニューでは、言語に複数の音声がある場合に選択肢が表示され、再生中の音声のサービス名が明記されます。

### クリップの生成

ツールチェーンは `scripts/voice/` でスクリプト化されており、所有者のマシン上でのみ実行され、公開CIでは実行されません。プロバイダーのAPIキー（フランス語用のElevenLabs、英語およびスペイン語用のGoogle Cloud Text-to-Speech、MarieおよびJane用のMistral）は、リポジトリ外の `.env` ファイルに保持され、`node --env-file` 経由で渡されます。そのためキーがGitに含まれることはありません。Claude Codeスキル [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) が手順を順を追って実行します（ゲート、合意、再試行）。詳細は [`docs/voix-enregistree.md`](docs/voix-enregistree.md) に記載されています。

1. 残りのフレーズ数と課金対象となる文字数を**見積もる**（Eleven v3: 1文字あたり約0.53クレジット、Chirp 3 HD: 100万文字あたり30ドル、毎月最初の100万文字は無料、Voxtral TTS: 100万文字あたり16ドル）。
2. **生成する**。同じコマンドを再実行すると不足分から再開されます。クレジットを使い果たした場合、スクリプトは中途半端なファイルを残さずに正常に停止します（終了コード 3）。`--max-total-chars` はバージョンの累積支出に上限を設定します。課金対象となったレスポンスは受信後すぐにレジストリに記録され、予期せぬ強制終了が発生しても保持されます。利用可能残高を取得できないGoogleやMistralにおいて、これが唯一の保護策となります。
3. **検証する**: すべてのフレーズに対応するクリップが存在し、各MP3が有効であることを確認します。次にWhisperが各クリップをローカルで文字起こしし、検証処理によって聞き取りミスのある数値や異常な再生時間が報告されます。`voice:review` はWhisper、この検証処理、試聴ページを1つのコマンドで連続実行します。
4. 試聴ページ（`voice:listen`）で、フラグが立てられたクリップや、Whisperでは判別できない女性形（「une fois 7」など）のサンプルを**試聴する**。各クリップには「やり直す」チェックボックスがあり、除外クリップのリストに追加できます。
5. 除外されたクリップを**再生成し**（`--redo`）、Whisperを再実行してから、2つ目のページで各クリップの前後の違いを比較します。2〜3回試行してもうまく発音されないクリップは、`SAID_OVERRIDES`（`scripts/voice/said-text.mjs`）で指定されたテキスト（例：数字をアルファベットで綴った表記など）を割り当てます。
6. クリップを**公開し**、オンラインで正常に応答することを確認した上で、まずテスター向けに言語インデックスを公開します（`?voix=test`）。
7. 音声を全ユーザーに**開放し**、デフォルトで有効にします。サーキットブレーカー（`voice:publish -- remove`）はインデックスから言語を削除し、ゲームをデバイスの標準音声に戻します。

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

### ルール: 発声フレーズを変更した場合は本番リリースの前に再録音する

発声されるすべてのフレーズは翻訳（`assets/translations/{fr,en,es}.json`）から取得され、コーパスの一部となっています。そのため、発話されるフレーズを変更するとコーパスロックのテスト（`scripts/voice/corpus.lock.json`）が失敗します。録音音声が存在する言語の場合、影響を受けるフレーズのクリップを生成し、検証・試聴を行った上で、マージ**前**に公開します。最後にロックを更新します（`npm run voice:corpus:lock`）。これらのクリップがない場合、変更されたフレーズはデバイスの標準音声で読み上げられます。

## 📊 データ保存

### ユーザーデータ

- プロフィールおよび設定
- ゲームモード別の進捗状況
- アーケードゲームのスコアと統計情報
- カスタマイズ設定

### 技術的な機能

- フォールバックを備えたローカルストレージ（localStorage）
- ユーザーごとのデータ分離
- 進捗の自動保存
- 以前のデータの自動移行

## 🐛 問題の報告

問題はGitHubのIssueを通じて報告できます。以下の情報を含めてください:

- 問題の詳細な説明
- 再現手順
- ブラウザとそのバージョン
- 該当する場合はスクリーンショット

## 💝 プロジェクトの支援

**[☕ PayPal経由で寄付する](https://paypal.me/jls)**

## 📄 ライセンス

このプロジェクトはAGPL v3ライセンスの下で公開されています。詳細については `LICENSE` ファイルを参照してください。

---

_LeapMultix — 四則演算を学ぶためのオープンソース教育アプリケーション_

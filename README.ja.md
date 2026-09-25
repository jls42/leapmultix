<details>
<summary>このドキュメントは他の言語でもご利用いただけます</summary>

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
[![品質ゲートの状態](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

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

- [概要](#概要)
- [プレビュー](#-プレビュー)
- [機能](#-機能)
- [クイックスタート](#-クイックスタート)
- [アーキテクチャ](#-アーキテクチャ)
- [ゲームモードの詳細](#-ゲームモードの詳細)
- [開発](#-開発)
- [互換性](#-互換性)
- [ローカライズ](#-ローカライズ)
- [録音音声](#-録音済み音声)
- [データストレージ](#-データストレージ)
- [問題の報告](#-問題を報告する)
- [ライセンス](#-ライセンス)

## 概要

LeapMultix は、6歳から12歳までの子どもが、乗算（×）、加算（+）、減算（−）、除算（÷）という4つの算術演算を習得するための、インタラクティブな教育用ウェブアプリケーションです。直感的でアクセシブルな多言語インターフェース上で、**5つのゲームモード**と**4つのアーケードミニゲーム**を提供します。

**複数演算への対応：** 5つのモードすべてで4種類の演算を利用できます。演算はホーム画面で選択し、その後のすべての進行に適用されます。

**開発者：** Julien LS（contact@jls42.org）

**オンラインURL：** https://leapmultix.jls42.org/

## 📸 プレビュー

### 画面

|                                                                                                         |                                                                                                  |
| :-----------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
|                  ![「誰が遊ぶ？」画面：プロフィールの選択](docs/media/01-accueil.webp)                  |               ![メインメニュー：演算と5つのモードの選択](docs/media/02-menu.webp)                |
|             **誰が遊ぶ？** — 子どもごとに、アバターと進捗を持つプロフィールを用意できます。             |                 **メニュー** — ここで演算を選択してから、5つのモードを開きます。                 |
|                      ![発見モード：点で表した4の段](docs/media/03-decouverte.webp)                      |               ![クイズモード：不正解は赤、正解は緑で表示](docs/media/04-quiz.webp)               |
|            **発見** — 各等式を点、ジャンプ、または数え上げで示し、その段のコツも表示します。            |   **クイズ** — 子どもが選んだ答えを正解の横に表示したままにし、解説で計算を詳しく説明します。    |
|             ![チャレンジモード：カウントダウンと現在の連続正解数](docs/media/05-defi.webp)              | ![アドベンチャーモード：全10レベルのマップとロックされた次のレベル](docs/media/06-aventure.webp) |
| **チャレンジ** — 時間との勝負です。間違えると、正解を読む時間を確保するためにタイマーが一時停止します。 |           **アドベンチャー** — 星を獲得しながら、10のレベルを順番に開放していきます。            |
|                    ![アーケードメニュー：4つのミニゲーム](docs/media/07-arcade.webp)                    |             ![ダッシュボード：段ごとの星と統計](docs/media/08-tableau-de-bord.webp)              |
|                **アーケード** — 難易度の設定と宇宙船の選択ができる4つのミニゲームです。                 |         **ダッシュボード** — 段ごとの星、復習が必要な段、モード別のスコアを表示します。          |
|        ![カスタマイズ：アバター、テーマ、アクセシビリティ](docs/media/09-personnalisation.webp)         |                                                                                                  |
|  **カスタマイズ** — アバター、配色テーマ、文字サイズ、ハイコントラスト、保護者用コードを設定できます。  |                                                                                                  |

### アーケードミニゲーム

4つのゲームでは、プレイエリアの上に残り時間とライフとともに表示される同じ問題に答えますが、ゲームごとに異なる操作が必要です。

|                                                                                                                |                                                                                    |
| :------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |
|       ![MultiInvaders：数字を身につけたモンスターと、画面下部の宇宙船](docs/media/10-multiinvaders.webp)       | ![MultiMiam：選択可能な答えが付いたドットのある迷路](docs/media/11-multimiam.webp) |
| **MultiInvaders** — 間違った答えを撃ち、正解は撃たずに残します。正解の後ろには、救出すべき仲間が隠れています。 |     **MultiMiam** — モンスターを避けながら迷路を進み、正しい答えを捕まえます。     |
|  ![MultiMemory：カードのグリッドと、計算式と数字を表示した2枚の表向きカード](docs/media/12-multimemory.webp)   |   ![MultiSnake：草原にいるヘビと番号付きのリンゴ](docs/media/13-multisnake.webp)   |
|              **MultiMemory** — 裏返された計算カードの答えが書かれたカードを記憶から探し出します。              |    **MultiSnake** — 正しい数字を食べて成長し、それ以外の数字をすべて避けます。     |

## ✨ 機能

### 🎮 ゲームモード

- **発見モード**：各演算に適した視覚的でインタラクティブな学習
- **クイズモード**：4種類の演算（×、+、−、÷）に対応した選択問題と適応型の進捗
- **チャレンジモード**：4種類の演算（×、+、−、÷）と複数の難易度を備えたタイムアタック
- **アドベンチャーモード**：4種類の演算に対応した、レベルごとに進むストーリー形式の進行

### 🕹️ アーケードミニゲーム

- **MultiInvaders**：教育版 Space Invaders - 間違った答えを破壊
- **MultiMiam**：算数版 Pac-Man - 正しい答えを収集
- **MultiMemory**：記憶ゲーム - 演算と答えを組み合わせる
- **MultiSnake**：教育版 Snake - 正しい数字を食べて成長

### ➕ 複数演算への対応

LeapMultix では、**すべてのモード**で4種類の算術演算を総合的に練習できます。

| モード         | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| クイズ         | ✅  | ✅  | ✅  | ✅  |
| チャレンジ     | ✅  | ✅  | ✅  | ✅  |
| 発見           | ✅  | ✅  | ✅  | ✅  |
| アドベンチャー | ✅  | ✅  | ✅  | ✅  |
| アーケード     | ✅  | ✅  | ✅  | ✅  |

### 🌍 共通機能

- **マルチユーザー**：保存された進捗を持つ個別プロフィールの管理
- **多言語対応**：フランス語、英語、スペイン語に対応
- **カスタマイズ**：アバター、配色テーマ、背景
- **アクセシビリティ**：キーボード操作、タッチ操作、WCAG 2.1 AA準拠
- **録音音声**：合成音声で事前録音された問題と励ましの言葉（ElevenLabs で作成）を再生し、利用できない場合は端末の音声へ自動的に切り替えます。音声クリップは公開リポジトリには含まれません（[録音音声](#-録音済み音声)を参照）
- **モバイル対応**：タブレットとスマートフォンに最適化されたインターフェース
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

# Voix enregistrée (poste du propriétaire, clips hors dépôt)
npm run voice:corpus       # Résumé des phrases dites, par langue
npm run voice:corpus:lock  # Mettre à jour le verrou du corpus
npm run voice:generate     # Générer les clips (ElevenLabs)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 アーキテクチャ

### ファイル構成

JavaScript モジュールは、`core/`、`components/`、`modes/` の3つのフォルダーを除き、**`js/` の直下に配置されています**。そのため、ファイル名によってグループ分けが示されます（`arcade-*`、`multimiam-*`、`i18n*`…）。

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

**最新の ES6 モジュール**：プロジェクトでは、ES6 クラスとネイティブの import/export を使用したモジュール式アーキテクチャを採用しています。

**再利用可能なコンポーネント**：一元管理された UI コンポーネント（TopBar、InfoBar、Dashboard、Customization）で構築されたインターフェースです。

**Lazy Loading**：初期パフォーマンスを最適化するため、`lazy-loader.js` を通じて必要に応じてモジュールを効率的に読み込みます。

**統合ストレージシステム**：フォールバックを備えた LocalStorage により、ユーザーデータを永続化するための一元化された API を提供します。

**一元化された音声管理**：多言語対応とユーザーごとの設定を備えたサウンド制御です。

**Event Bus**：保守しやすいアーキテクチャを実現するため、コンポーネント間で疎結合なイベント通信を行います。

**スライドによるナビゲーション**：`goToSlide()` を使用した、番号付きスライド（slide0、slide1 など）に基づくナビゲーションシステムです。

**セキュリティ**：すべての DOM 操作に対して、`security-utils.js` による XSS 対策とサニタイズを行います。

## 🎯 ゲームモードの詳細

### 発見モード

次の機能を備えた、九九を視覚的に学習するためのインターフェースです。

- 乗算のインタラクティブな視覚化
- アニメーションと覚え方のヒント
- 教育的なドラッグ＆ドロップ
- 段ごとに自由に進められる学習

### クイズモード

次の機能を備えた選択問題です。

- 1セッションにつき10問
- 正答状況に応じた適応型の進行
- 仮想テンキー
- 連続正解システム

### チャレンジモード

次の機能を備えたタイムアタックです。

- 3段階の難易度（初級、中級、上級）
- 正解時の時間ボーナス
- ライフシステム
- ハイスコアランキング

### アドベンチャーモード

次の機能を備えたストーリー形式の進行です。

- 開放可能な10のテーマ別レベル
- 進捗を視覚化するインタラクティブマップ
- キャラクターとともに楽しめる没入感のある物語
- 星と報酬のシステム

### アーケードミニゲーム

各ミニゲームには、次の機能があります。

- 難易度の選択とカスタマイズ
- ライフとスコアのシステム
- キーボードとタッチ操作
- ユーザーごとの個別ランキング

## 🔧 開発

### 開発ワークフロー

**main に直接コミットしないでください。** このプロジェクトでは、機能ブランチを使用して作業します。

**1. ブランチを作成します。** 機能開発には `feat/`、修正には `fix/` を使用します。

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 開発して検証します。** 最初にフォーマットを行ってください。CI はテストを実行する前に、フォーマット違反を理由に処理を拒否します。

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

**4. pull request を開き**、verify、Codacy、CodeFactor、SonarCloud の解析が完了するまで待ちます。すべて成功するまで修正してからマージします。

**コミットのスタイル**：簡潔な命令形のメッセージ（例："Fix arcade init errors"、"Refactor cache updater"）

**品質ゲート**：各コミットの前に、`npm run lint`、`npm test`、`npm run test:coverage` が成功することを確認してください

### コンポーネントアーキテクチャ

**GameMode（基底クラス）**：すべてのモードは、標準化されたメソッドを持つ共通クラスを継承します。

**GameModeManager**：モードの起動と管理を一元的に統括します。

**UI コンポーネント**：TopBar、InfoBar、Dashboard、Customization が一貫したインターフェースを提供します。

**Lazy Loading**：初期パフォーマンスを最適化するため、必要に応じてモジュールを読み込みます。

**Event Bus**：イベントシステムを通じて、コンポーネント間の通信を疎結合にします。

### テスト

プロジェクトには、包括的なテストスイートが含まれています。

- core モジュールの単体テスト
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

### 本番用ビルド

- **Rollup**：`js/main-es6.js` を、コード分割とソースマップを備えた ESM としてバンドル
- **Terser**：最適化のための自動ミニファイ
- **ビルド後処理**：`css/` と `assets/`、favicon（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js` をコピーし、`dist/index.html` をハッシュ付きエントリーファイル（例：`main-es6-*.js`）へ書き換え
- **最終フォルダー**：静的配信の準備が整った `dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 継続的インテグレーション

**GitHub Actions**：`.github/workflows/ci.yml` は、`main` への push および各 pull request で実行されます。

**`verify`** — 処理をブロックする品質ゲート：

- `npm ci`、続いて `npm run verify`（ESLint、Jest テスト、カバレッジ）
- `npm run format:check`（Prettier）

**`seo-report`** — `verify` の後に、公開中のサイトを Lighthouse で監査し、SEO 指標を継続的に追跡します。

**pull request に連携された外部解析**：Codacy、CodeFactor、SonarCloud。SonarCloud の品質ゲートでは、新しいコードの信頼性、セキュリティ、保守性について、すべて A 評価が求められます。

**デプロイ**：`./deploy.sh` はサイトを S3 に同期し、CloudFront のキャッシュを無効化します。必要に応じて、git に含まれていないレスポンシブ画像をスクリプトが再生成します。

### PWA（Progressive Web App）

LeapMultix は、オフライン対応とインストール機能を備えた完全な PWA です。

**Service Worker**（`sw.js`）：

- ナビゲーション：Network-first を使用し、オフライン時は `offline.html` にフォールバック
- 画像：パフォーマンスを最適化するための Cache-first
- 翻訳：バックグラウンドで更新するための Stale-while-revalidate
- JS/CSS：常に最新バージョンを配信するための Network-first
- `cache-updater.js` による自動バージョン管理

**Manifest**（`manifest.json`）：

- すべてのデバイス向けの SVG および PNG アイコン
- モバイル端末にインストール可能（ホーム画面に追加）
- アプリのような操作感を実現する standalone 構成
- テーマと配色に対応

**オフラインモードをローカルでテストします。** サーバーを起動し、`http://localhost:8080`（または表示されたポート）を開きます。

```bash
npm run serve
```

手動の場合：開発者ツール（ネットワークタブ、オフラインモード）でネットワークを切断し、ページを再読み込みします。`offline.html` が表示される必要があります。

Puppeteer を使用して自動的に行う場合：

```bash
npm run test:pwa-offline
```

**Service Worker 管理スクリプト**：

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### 品質基準

**コード品質ツール**：

- **ESLint**：flat config（`eslint.config.js`）を使用した最新の設定、ES2022 対応
- **Prettier**：コードの自動フォーマット（`.prettierrc`）
- **Stylelint**：CSS の検証（`.stylelintrc.json`）
- **JSDoc**：カバレッジ分析を伴う関数ドキュメントの自動生成

**重要なコーディング規則**：

- 未使用の変数とパラメーターを削除する（`no-unused-vars`）
- 具体的なエラー処理を使用する（空の catch を使用しない）
- `innerHTML` を避け、`security-utils.js` 関数を使用する
- 関数の認知的複雑度を 15 未満に保つ
- 複雑な関数を、より小さなヘルパーに分割する

**セキュリティ**：

- **XSS 対策**：`security-utils.js` の関数を使用する：
  - `innerHTML` の代わりに `appendSanitizedHTML()` を使用する
  - 安全な要素の作成には `createSafeElement()` を使用する
  - テキストコンテンツには `setSafeMessage()` を使用する
- **外部スクリプト**：`crossorigin="anonymous"` 属性を必須とする
- **入力検証**：外部データを必ずサニタイズする
- **Content Security Policy**：スクリプトの取得元を制限する CSP ヘッダー

**アクセシビリティ**：

- WCAG 2.1 AA 準拠
- 完全なキーボード操作
- 適切な ARIA ロールとラベル
- 基準に準拠した色のコントラスト

**パフォーマンス**：

- `lazy-loader.js` によるモジュールの遅延読み込み
- CSS の最適化とレスポンシブ対応アセット
- インテリジェントなキャッシュのための Service Worker
- 本番環境でのコード分割と圧縮

## 📱 互換性

### 対応ブラウザー

インターフェースでは、色に `oklch()`、コンテキストに応じた状態に `:has()` を使用しているため、最低要件は次のとおりです：

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### デバイス

- **デスクトップ**：キーボードとマウスによる操作
- **タブレット**：タッチ操作に最適化されたインターフェース
- **スマートフォン**：画面に適応するレスポンシブデザイン

### アクセシビリティ

- 完全なキーボード操作（Tab、矢印キー、Esc）
- スクリーンリーダー向けの ARIA ロールとラベル
- 基準に準拠した色のコントラスト
- 支援技術への対応

## 🌍 ローカライズ

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

**`npm run i18n:verify`** - 翻訳キーの整合性を確認する

**`npm run i18n:unused`** - 未使用の翻訳キーを一覧表示する

**`npm run i18n:compare`** - 翻訳ファイルを fr.json（基準）と比較する

このスクリプト（`scripts/compare-translations.cjs`）は、すべての言語ファイルの同期を保証します：

**機能：**

- 不足しているキーの検出（fr.json には存在するが、ほかの言語には存在しないキー）
- 余分なキーの検出（ほかの言語には存在するが、fr.json には存在しないキー）
- 空の値の特定（`""`、`null`、`undefined`、`[]`）
- 型の整合性確認（string と array）
- ネストされた JSON 構造をドット記法へ平坦化（例：`arcade.multiMemory.title`）
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

**翻訳対象：**

- ユーザーインターフェース全体
- ゲームの説明
- エラーおよびフィードバックメッセージ
- 説明文とコンテキストヘルプ
- アドベンチャーモードの物語コンテンツ
- アクセシビリティおよび ARIA ラベル

## 🔊 録音済み音声

ゲームは、問題、励ましの言葉、解説を音声で読み上げます。フランス語では、ElevenLabs（Eleven v3 モデル）で作成された合成音声の **Lucie** を使用します。ゲームが読み上げるフレーズは言語ごとに約 7,400 件の有限のセットに限られており、すべて事前に録音されているため、ElevenLabs を呼び出す箇所はありません。英語とスペイン語では、現時点ではデバイスの音声を使用します。

- フレーズごとのデバイス音声への**自動フォールバック**：クリップが存在しないかエラーになった場合、ブラウザーに再生を拒否された場合、クリップが 1.5 秒以内に再生を開始しない場合、またはオフライン時にクリップがキャッシュされていない場合。
- **設定**：上部バーの音声ボタンで読み上げのオンとオフを切り替えます。「録音済み音声」チェックボックス（アクセシビリティと操作）で、Lucie とデバイスの音声を切り替えます。
- **オフライン**：一度再生されたクリップはキャッシュに保持されます（service worker）。

### クリップはこのリポジトリに含まれていません

クリップは非公開リポジトリと専用の S3 bucket に保存され、`/voice/*` の CloudFront から配信されます。そのため、フォークやローカル開発ではデバイスの音声が使用されます。リポジトリ内では `<meta name="leapmultix-voice-base">` タグが空であり、本番デプロイ時にのみ `/voice/` が書き込まれます。

クリップがローカル環境にある場合（ゲームの隣の `../leapmultix-voices` に非公開リポジトリをクローン）、`?voix=local` パラメーターを指定すると、開発サーバーからクリップが読み込まれます：

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### クリップを生成する

処理手順は `scripts/voice/` にスクリプト化されており、公開 CI では決して実行せず、所有者のローカル環境で実行します。ElevenLabs のキーはリポジトリ外の `.env` ファイルに保持し、`node --env-file` を介して渡します。キーが git に含まれることはありません。Claude Code の skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) では、手順（確認事項、承認、再実行）を段階的に案内しています。詳細は [`docs/voix-enregistree.md`](docs/voix-enregistree.md) にあります。

1. **見積もる**：残りのフレーズ数と課金対象の文字数を見積もります（Eleven v3：約 0.53 クレジット／文字）。
2. **生成する**：同じコマンドを再実行すると、不足分から再開されます。クレジットを使い切ると、書きかけのファイルを残さず、スクリプトが正常に停止します（コード 3）。
3. **検証する**：各フレーズにクリップがあり、各 MP3 が有効であることを確認します。その後、Whisper が各クリップをローカルで文字起こしし、`voice:check` が聞き間違えられた数字や異常な長さを検出します。
4. **試聴する**：試聴ページ（`voice:listen`）で、検出されたクリップと、Whisper では区別できない女性形のサンプル（「une fois 7」）を確認します。各クリップには「再作成」チェックボックスがあり、選択すると除外クリップの一覧に追加されます。
5. **再作成する**：除外したクリップを再作成し（`--redo`）、Whisper を再実行したうえで、2 番目のページで各クリップの変更前と変更後を比較します。2～3 回試しても発音が正しくならないクリップには、`SAID_OVERRIDES`（`scripts/voice/said-text.mjs`）で、たとえば数字をすべて文字で表記するなど、指定のテキストを設定します。
6. **公開する**：クリップを公開してオンラインで応答することを確認し、まずテスター向けに言語インデックスを公開します（`?voix=test`）。
7. **全員に音声を公開する**：その後、デフォルトで有効にします。緊急停止機能（`voice:publish -- remove`）によって言語をインデックスから削除すると、ゲームはデバイスの音声へ戻ります。

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

### 規則：読み上げるフレーズを変更した場合は、本番環境への反映前に再録音する

読み上げるすべてのフレーズは翻訳（`assets/translations/{fr,en,es}.json`）に由来し、コーパスの一部です。そのため、読み上げフレーズを変更すると、コーパスロックのテスト（`scripts/voice/corpus.lock.json`）が失敗します。録音済み音声がある言語では、変更されたフレーズのクリップを生成し、検証と試聴を行ってから、マージする**前に**公開します。最後にロックを更新します（`npm run voice:corpus:lock`）。これらのクリップがない場合、変更されたフレーズはデバイスの音声で読み上げられます。

## 📊 データストレージ

### ユーザーデータ

- プロフィールと設定
- ゲームモードごとの進捗
- アーケードゲームのスコアと統計
- カスタマイズ設定

### 技術的な機能

- フォールバックを備えたローカルストレージ（localStorage）
- ユーザーごとのデータ分離
- 進捗の自動保存
- 古いデータの自動移行

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

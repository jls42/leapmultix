<details>
<summary>この文書は他の言語でも利用できます</summary>

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

![継続的インテグレーション](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
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

- [説明](#説明)
- [概要](#-概要)
- [機能](#-機能)
- [クイックスタート](#-クイックスタート)
- [アーキテクチャ](#-アーキテクチャ)
- [ゲームモードの詳細](#-ゲームモードの詳細)
- [開発](#-開発)
- [互換性](#-互換性)
- [ローカライズ](#-ローカライズ)
- [録音済み音声](#-録音音声)
- [データ保存](#-データストレージ)
- [問題を報告する](#-問題を報告する)
- [ライセンス](#-ライセンス)

## 説明

LeapMultix は、6～12歳の子どもが乗算（×）、加算（+）、減算（−）、除算（÷）の4つの算術演算を習得するための、インタラクティブな教育用ウェブアプリケーションです。直感的でアクセシブルな多言語インターフェースで、**6つのゲームモード**と**4つのアーケードミニゲーム**を提供します。

**複数演算への対応：** すべてのモードで4つの演算を利用できます。ホーム画面で選択した演算が、すべての学習過程に適用されます。

**開発者：** Julien LS（contact@jls42.org）

**オンライン版URL：** https://leapmultix.jls42.org/

## 📸 概要

### 各画面

|                                                                                                               |                                                                                                  |
| :-----------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
|                     ![「誰が遊ぶ？」画面：プロフィールの選択](docs/media/01-accueil.webp)                     |               ![メインメニュー：演算とゲームモードの選択](docs/media/02-menu.webp)               |
|                 **誰が遊ぶ？** — 子どもごとに、アバターと進捗を含むプロフィールを用意します。                 |                  **メニュー** — ここで演算を選び、次にゲームモードを選びます。                   |
|                        ![発見モード：点で示された4の段](docs/media/03-decouverte.webp)                        |               ![クイズモード：不正解は赤、正解は緑で表示](docs/media/04-quiz.webp)               |
|                    **発見** — 各等式を点、跳躍、数え上げで示し、その段のコツも紹介します。                    |     **クイズ** — 子どもが選んだ答えを正解の横に残して表示し、解説で計算を詳しく説明します。      |
|                ![チャレンジモード：カウントダウンと現在の連続正解数](docs/media/05-defi.webp)                 | ![アドベンチャーモード：全10レベルのマップとロックされた後続レベル](docs/media/06-aventure.webp) |
|              **チャレンジ** — 時間との勝負です。間違えると、正解を読む間はタイマーが停止します。              |              **アドベンチャー** — 星を獲得すると、10のレベルが順番に開放されます。               |
|                ![タイムアタックモード：減算の競争、タイマー、進捗](docs/media/14-chrono.webp)                 |                ![アーケードメニュー：4つのミニゲーム](docs/media/07-arcade.webp)                 |
|  **タイムアタック** — 選んだ演算で、時間を競いながら10問正解します。間違えた計算は復習リストに追加されます。  |             **アーケード** — 難易度の設定と宇宙船の選択ができる4つのミニゲームです。             |
|  ![ダッシュボード：演算別に詳しく表示された各モードのプレイ、記録、回答](docs/media/08-tableau-de-bord.webp)  |     ![カスタマイズ：アバター、テーマ、アクセシビリティ](docs/media/09-personnalisation.webp)     |
| **ダッシュボード** — 各モードのプレイ状況と記録を演算別に表示します。乗算では、星と復習する段も確認できます。 |      **カスタマイズ** — アバター、配色テーマ、文字サイズ、ハイコントラストを設定できます。       |

### アーケードミニゲーム

4つのゲームでは、プレイ領域の上に残り時間やライフとともに表示される同じ形式の問題に、
それぞれ異なる操作で答えます。

|                                                                                                                |                                                                                      |
| :------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: |
|         ![MultiInvaders：数字を付けたモンスターと、画面下部の宇宙船](docs/media/10-multiinvaders.webp)         | ![MultiMiam：選択可能な答えが書かれたドットのある迷路](docs/media/11-multimiam.webp) |
| **MultiInvaders** — 間違った答えを撃ち、正解は撃たないようにします。正解の中には、助け出す仲間が隠れています。 |       **MultiMiam** — モンスターを避けながら迷路を進み、正しい答えを取ります。       |
|    ![MultiMemory：カードのグリッドと、計算式と数字を示す2枚の表向きカード](docs/media/12-multimemory.webp)     |  ![MultiSnake：草原にいるヘビと、数字の付いたリンゴ](docs/media/13-multisnake.webp)  |
|                  **MultiMemory** — めくられた計算式の答えが書かれたカードを記憶から探します。                  |     **MultiSnake** — 正しい数字を食べて成長し、それ以外の数字をすべて避けます。      |

## ✨ 機能

### 🎮 ゲームモード

- **発見モード**：各演算に合わせた視覚的でインタラクティブな学習
- **クイズモード**：4つの演算（×、+、−、÷）に対応した選択式問題と適応型の進捗
- **チャレンジモード**：4つの演算（×、+、−、÷）と複数の難易度に対応した時間制チャレンジ
- **アドベンチャーモード**：4つの演算に対応した、レベルごとに物語が進む学習
- **タイムアタックモード**：止まらないタイマーを相手に、4つの演算（×、+、−、÷）で10問正解し、自己ベストを目指すモード

### 🕹️ アーケードミニゲーム

- **MultiInvaders**：教育版 Space Invaders - 間違った答えを破壊
- **MultiMiam**：数学版 Pac-Man - 正しい答えを収集
- **MultiMemory**：記憶ゲーム - 演算と答えを組み合わせる
- **MultiSnake**：教育版 Snake - 正しい数字を食べて成長

### ➕ 複数演算への対応

LeapMultix では、**すべてのモード**で4つの算術演算を総合的に練習できます。

| モード         | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| クイズ         | ✅  | ✅  | ✅  | ✅  |
| チャレンジ     | ✅  | ✅  | ✅  | ✅  |
| 発見           | ✅  | ✅  | ✅  | ✅  |
| アドベンチャー | ✅  | ✅  | ✅  | ✅  |
| タイムアタック | ✅  | ✅  | ✅  | ✅  |
| アーケード     | ✅  | ✅  | ✅  | ✅  |

### 🌍 共通機能

- **複数ユーザー**：保存された進捗を持つ個別プロフィールの管理
- **多言語**：フランス語、英語、スペイン語に対応
- **カスタマイズ**：アバター、配色テーマ、背景
- **アクセシビリティ**：キーボード操作、タッチ操作、WCAG 2.1 AA準拠
- **録音済み音声**：録音済みの合成音声で問題や励ましの言葉を読み上げ、利用できない場合は端末の音声へ自動的に切り替えます。音声はこのリポジトリには含まれていません。leapmultix.jls42.org では、フランス語に Lucie、英語とスペイン語に Sulafat を使用し、さらにフランス語では Sulafat と Marie、英語では Jane から選択できます（[録音済み音声](#-録音音声)を参照）
- **モバイル対応**：タブレットとスマートフォン向けに最適化されたインターフェース
- **進捗システム**：プロフィール別ダッシュボード（プレイ数、記録、復習する段を演算別に表示）、バッジ、デイリーチャレンジ

## 🚀 クイックスタート

### 前提条件

- Node.js（バージョン16以降）
- 最新のウェブブラウザー

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

JavaScript モジュールは、`core/`、`components/`、`modes/` の3つのフォルダーを除き、**`js/` 直下にフラットに配置**されています。
そのため、グループ分けはファイル名（`arcade-*`、`multimiam-*`、`i18n*`…）によって表されます。

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
│   │   ├── audio.js, theme.js                # Son, thèmes
│   │   ├── eventBus.js, mainInit.js          # Événements, amorçage DOM
│   │   ├── adventure-data.js                 # Niveaux du mode Aventure
│   │   ├── mult-stats.js, challenge-stats.js, operation-stats.js
│   │   ├── chrono-stats.js, chrono-questions.js, chrono-input.js   # Mode Chrono
│   │   ├── mode-stats.js, adventure-progress.js   # Compteurs du tableau de bord
│   │   ├── daily-challenge.js, tablePreferences.js, stats-migration.js
│   │   ├── userUi.js, utils.js               # Utilitaires (source canonique)
│   │   └── operations/                       # Une classe par opération
│   │       ├── Operation.js, OperationRegistry.js
│   │       └── Multiplication.js, Addition.js, Subtraction.js, Division.js
│   ├── components/         # Composants d'interface
│   │   ├── topBar.js, infoBar.js, dashboard.js, customization.js
│   │   ├── operationSelector.js, operationModeAvailability.js
│   │   └── icons.js, tableSettingsModal.js
│   ├── modes/              # Les six modes de jeu
│   │   ├── DiscoveryMode.js, QuizMode.js, ChallengeMode.js
│   │   └── AdventureMode.js, ChronoMode.js, ArcadeMode.js
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

**最新の ES6 モジュール**：このプロジェクトは、ES6 クラスとネイティブのインポート／エクスポートを使用したモジュール式アーキテクチャを採用しています。

**再利用可能なコンポーネント**：一元管理された UI コンポーネント（TopBar、InfoBar、Dashboard、Customization）でインターフェースを構築しています。

**Lazy Loading**：初期パフォーマンスを最適化するため、`lazy-loader.js` を介して必要に応じてモジュールを効率的に読み込みます。

**統合ストレージシステム**：フォールバックを備えた LocalStorage を介して、ユーザーデータを永続化するための API を一元管理しています。

**音声の一元管理**：多言語対応とユーザー別設定を備えた音声制御を行います。

**Event Bus**：保守しやすいアーキテクチャを実現するため、コンポーネント間を疎結合なイベント通信で連携します。

**スライド式ナビゲーション**：番号付きスライド（slide0、slide1 など）と `goToSlide()` に基づくナビゲーションシステムです。

**セキュリティ**：すべての DOM 操作で `security-utils.js` を使用し、XSS 対策とサニタイズを行います。

## 🎯 ゲームモードの詳細

### 発見モード

各演算に合わせた視覚的な学習インターフェースで、次の機能を備えています。

- 乗算のインタラクティブな視覚化
- アニメーションと覚え方のヒント
- 教育的なドラッグ＆ドロップ
- 段ごとの自由な進行

### クイズモード

次の機能を備えた選択式問題です。

- 1回につき10問
- 正解状況に応じた適応型の進行
- 仮想テンキー
- 連続正解システム

### チャレンジモード

次の機能を備えた時間制チャレンジです。

- 3段階の難易度（初級、中級、上級）
- 正解時の時間ボーナス
- ライフシステム
- ハイスコアランキング

### アドベンチャーモード

次の機能を備え、物語に沿って進行します。

- 開放可能な10のテーマ別レベル
- 進捗を視覚的に示すインタラクティブマップ
- キャラクターとともに楽しむ没入感のある物語
- 星と報酬のシステム

### タイムアタックモード

止まらないタイマーを相手に、できるだけ速く10問正解します。

- 4つの演算：掛け算の段（「段の設定」で指定）と、
  すべての足し算（7 + k）、引き算（(7 + k) − 7）、割り算（(7 × k) ÷ 7）の段
- 選択式またはテンキーで回答し、クリックとキーボードの両方に対応
- 演算別のベストタイム、平均タイム、直近のプレイ結果を示すグラフ
- 「復習する計算」：演算ごとのリストを両方向で復習（6 × 7 と 7 × 6、
  15 − 7 と 15 − 8）

### ダッシュボード

プロフィールごとに、子どもが実際に遊んだ内容を表示します。

- アドベンチャーの星と、復習する掛け算の段（各段の直近20回答）
- クイズ、チャレンジ、アドベンチャー、タイムアタックの問題数と正解数
- 各モードと各ミニゲームのプレイ数および記録（途中終了も含む）。複数の演算を練習し始めると、
  演算別に詳しく表示

### アーケードミニゲーム

各ミニゲームでは次の機能を利用できます。

- 難易度の選択とカスタマイズ
- ライフとスコアのシステム
- キーボード操作とタッチ操作
- ユーザー別の個人ランキング

## 🔧 開発

### 開発ワークフロー

**main に直接コミットしないでください。** このプロジェクトでは、
機能ブランチを使用します。

**1. ブランチを作成します。** 機能追加には `feat/`、修正には `fix/` を使用します。

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 開発して検証します。** まずフォーマットを確認してください。CI はテストを
実行する前にフォーマット違反を検出して失敗します。

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

**4. pull request を作成**し、verify、Codacy、CodeFactor、SonarCloud の解析完了を待ちます。
すべて成功するまで修正してからマージします。

**コミット形式**：簡潔な命令形のメッセージ（例："Fix arcade init errors"、"Refactor cache updater"）

**品質ゲート**：各コミット前に `npm run lint`、`npm test`、`npm run test:coverage` が成功することを確認してください

### コンポーネントアーキテクチャ

**GameMode（基底クラス）**：すべてのモードは、標準化されたメソッドを持つ共通クラスを継承します。

**GameModeManager**：モードの起動と管理を一元的に統括します。

**UI コンポーネント**：TopBar、InfoBar、Dashboard、Customization が一貫したインターフェースを提供します。

**Lazy Loading**：初期パフォーマンスを最適化するため、必要に応じてモジュールを読み込みます。

**Event Bus**：イベントシステムを介して、コンポーネント間を疎結合に通信させます。

### テスト

このプロジェクトには包括的なテストスイートが含まれています。

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

- **Rollup**：`js/main-es6.js` を、コード分割とソースマップを備えた ESM としてバンドル
- **Terser**：最適化のための自動ミニファイ
- **ビルド後処理**：`css/`、`assets/`、favicon（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js` をコピーし、`dist/index.html` をハッシュ付きエントリーファイル（例：`main-es6-*.js`）へ書き換え
- **最終フォルダー**：静的配信の準備が整った `dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 継続的インテグレーション

**GitHub Actions**：`.github/workflows/ci.yml`。`main` への各 push と、
各 pull request で実行されます。

**`verify`** — マージを阻止できる品質ゲートです。

- `npm ci`、続いて `npm run verify`（ESLint、Jest テスト、カバレッジ）
- `npm run format:check`（Prettier）

**`seo-report`** — `verify` の後に、公開サイトを Lighthouse で監査し、
SEO 指標を継続的に追跡します。

**pull request に連携された外部解析**：Codacy、CodeFactor、SonarCloud。SonarCloud の品質ゲートでは、
新規コードの信頼性、セキュリティ、保守性で評価 A が必須です。

**デプロイ**：`./deploy.sh` がサイトを S3 に同期し、CloudFront のキャッシュを
無効化します。このスクリプトは、git に含まれていないレスポンシブ画像を必要に応じて再生成します。

### PWA（Progressive Web App）

LeapMultix は、オフライン対応とインストール機能を備えた完全な PWA です。

**Service Worker**（`sw.js`）：

- ナビゲーション：Network-first、オフライン時は `offline.html` にフォールバック
- 画像：パフォーマンスを最適化する Cache-first
- 翻訳：バックグラウンド更新を行う Stale-while-revalidate
- JS/CSS：常に最新バージョンを提供する Network-first
- `cache-updater.js` による自動バージョン管理

**Manifest**（`manifest.json`）：

- あらゆるデバイス向けの SVG および PNG アイコン
- モバイルへのインストールに対応（ホーム画面に追加）
- アプリのような操作感を実現する standalone 設定
- テーマと色に対応

**オフラインモードをローカルでテストする。** サーバーを起動し、
`http://localhost:8080`（または表示されたポート）を開きます：

```bash
npm run serve
```

手動の場合：開発者ツールでネットワークを切断し（「ネットワーク」タブ、
オフラインモード）、ページを再読み込みします。`offline.html` が表示されるはずです。

Puppeteer を使って自動で行う場合：

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

- **ESLint**：flat config（`eslint.config.js`）を使用したモダンな設定、ES2022 対応
- **Prettier**：コードの自動フォーマット（`.prettierrc`）
- **Stylelint**：CSS の検証（`.stylelintrc.json`）
- **JSDoc**：カバレッジ分析を伴う関数ドキュメントの自動生成

**重要なコーディング規則**：

- 未使用の変数と引数を削除する（`no-unused-vars`）
- 具体的なエラー処理を使用する（空の catch は使用しない）
- `innerHTML` を避け、`security-utils.js` 関数を使用する
- 関数の認知的複雑度を 15 未満に保つ
- 複雑な関数を、より小さな helper に分割する

**セキュリティ**：

- **XSS 対策**：`security-utils.js` の関数を使用する：
  - `innerHTML` の代わりに `appendSanitizedHTML()`
  - 安全な要素の作成には `createSafeElement()`
  - テキストコンテンツには `setSafeMessage()`
- **外部スクリプト**：`crossorigin="anonymous"` 属性を必須とする
- **入力検証**：外部データは必ずサニタイズする
- **Content Security Policy**：スクリプトの取得元を制限する CSP header

**アクセシビリティ**：

- WCAG 2.1 AA 準拠
- 完全なキーボードナビゲーション
- 適切な ARIA role と label
- 基準に準拠した色のコントラスト

**パフォーマンス**：

- `lazy-loader.js` による module の lazy loading
- CSS の最適化と responsive asset
- インテリジェントなキャッシュのための Service Worker
- 本番環境での code splitting と minification

## 📱 互換性

### 対応ブラウザー

インターフェースでは、色に `oklch()`、コンテキストに応じた
状態に `:has()` を使用しているため、最低要件は次のとおりです：

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### デバイス

- **デスクトップ**：キーボードとマウスによる操作
- **タブレット**：タッチ操作に最適化されたインターフェース
- **スマートフォン**：適応型 responsive design

### アクセシビリティ

- 完全なキーボードナビゲーション（Tab、矢印キー、Esc）
- スクリーンリーダー向けの ARIA role と label
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

このスクリプト（`scripts/compare-translations.cjs`）は、すべての言語ファイルを同期します：

**機能：**

- 不足しているキーの検出（fr.json には存在するが、ほかの言語には存在しないキー）
- 余分なキーの検出（ほかの言語には存在するが、fr.json には存在しないキー）
- 空の値（`""`、`null`、`undefined`、`[]`）の特定
- 型の整合性確認（string と array）
- ネストされた JSON 構造をドット記法に平坦化（例：`arcade.multiMemory.title`）
- 詳細な console report の生成
- JSON report を `docs/translations-comparison-report.json` に保存

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
- エラーおよびフィードバックメッセージ
- 説明文とコンテキストヘルプ
- アドベンチャーモードの物語コンテンツ
- アクセシビリティおよび ARIA label

## 🔊 録音音声

ゲームは問題、励まし、解説を音声で読み上げます。読み上げるのは言語ごとに約 7,400 個の有限のフレーズだけです。そのため、すべてを一度録音すれば、どの部分からも音声合成サービスを呼び出す必要はありません。クリップがない場合、ゲームはデバイスの音声を使用して読み上げます。

### このリポジトリに含まれるもの：音声を除くアプリケーション

コードは事前録音されたクリップを再生でき、それらを生成する処理系も含んでいます。ただし、クリップもプロバイダーのキーも含まれていません。そのため、fork やローカルインストールではデバイスの音声を使用して読み上げます。

- フレーズごとにデバイスの音声へ**自動フォールバック**：クリップが存在しないかエラーになった場合、ブラウザーに再生を拒否された場合、クリップが 1.5 秒以内に開始されない場合、またはオフライン時にクリップがキャッシュされていない場合。
- **設定**：上部バーの音声ボタンで読み上げを有効または無効にします。「録音音声」チェックボックス（アクセシビリティと操作）で、録音音声とデバイスの音声を切り替えます。この項目は、音声が公開されている言語でのみ表示されます。
- **オフライン**：一度再生されたクリップはキャッシュに残ります（Service Worker）。
- **ゲームがクリップを探す場所**：リポジトリでは空になっている `<meta name="leapmultix-voice-base">` タグです。本番環境へのデプロイ時にのみ `/voice/` が書き込まれます。

以下の処理系で生成し、ゲームの隣にある `../leapmultix-voices` に配置した独自のクリップをローカル環境で使用する場合、`?voix=local` パラメーターを指定すると開発サーバーから再生できます：

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org：ホスティングで提供される音声

作者が提供するサイトでは、録音済みの合成音声を配信しています：

- フランス語では、ElevenLabs（Eleven v3 モデル）で作成された **Lucie**；
- イギリス英語とスペインのスペイン語では、Google Cloud Text-to-Speech（Chirp 3 HD 音声）で作成された **Sulafat**；
- プレイヤーの選択により、3 言語すべてで同じ音声を維持するため、フランス語でも **Sulafat**；
- 同じくプレイヤーの選択により、Mistral AI（Voxtral TTS）で作成されたフランス語の **Marie** と英語の **Jane**。

クリップは非公開リポジトリと専用の S3 bucket に保存され、`/voice/*` 上の CloudFront から配信されます。クリップは一度だけ生成されます。ゲームの実行中に、これらのサービスへ何かが送信されることはありません。設定の「音声」メニューでは、複数の音声がある言語について音声を選択でき、表示される注記には再生中の音声サービス名が示されます。

### クリップを生成する

処理系は `scripts/voice/` にスクリプト化されており、公開 CI ではなく、所有者のローカル環境でのみ実行されます。プロバイダーのキー（Lucie 用の ElevenLabs、Sulafat 用の Google Cloud Text-to-Speech、Marie と Jane 用の Mistral）はリポジトリ外の `.env` ファイルに保存され、`node --env-file` を介して渡されます。キーが git に入ることはありません。Claude Code skill の [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) では、手順（ゲート、承認、再開）を段階的に案内しています。詳細は [`docs/voix-enregistree.md`](docs/voix-enregistree.md) にあります。

1. 残りのフレーズ数と料金対象文字数を**見積もる**（Eleven v3：1 文字あたり約 0.53 credit、Chirp 3 HD：100 万文字あたり 30 ドル、毎月最初の 100 万文字は無料、Voxtral TTS：100 万文字あたり 16 ドル）。
2. **生成する**。同じコマンドを再実行すると、不足分から再開されます。credit が尽きると、スクリプトは書きかけのファイルを残さず正常に停止します（終了 code 3）。`--max-total-chars` はバージョンごとの累積支出に上限を設定します。料金が発生した各レスポンスは受信直後に台帳へ記録され、その台帳は異常終了後も保持されます。確認可能な残高を提供しない Google と Mistral では、これが唯一の保護手段です。
3. **検証する**：各フレーズに対応するクリップがあり、各 MP3 が有効であることを確認します。その後、Whisper が各クリップをローカルで文字起こしし、検証処理が聞き間違えられた数字や異常な長さを報告します。`voice:review` は、Whisper、この検証、試聴ページを 1 つのコマンドで順に実行します。
4. 試聴ページ（`voice:listen`）で、報告されたクリップと、Whisper では区別できない女性形の表現（「une fois 7」）のサンプルを**試聴する**。各クリップには「再作成」チェックボックスがあり、選択すると除外クリップ一覧に追加されます。
5. 除外したクリップを**再作成する**（`--redo`）。Whisper を再実行し、2 つ目のページで各クリップの変更前と変更後を比較します。2 回または 3 回試しても発音が正しくならないクリップには、`SAID_OVERRIDES`（`scripts/voice/said-text.mjs`）で、たとえば数字を文字で表記した強制テキストを設定します。
6. クリップを**公開し**、オンラインで応答することを確認してから、まずテスター向けに言語 index を公開します（`?voix=test`）。
7. 音声を全員に**公開し**、その後デフォルトで有効にします。kill switch（`voice:publish -- remove`）で言語を index から削除すると、ゲームはデバイスの音声へ戻ります。

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

### 規則：読み上げフレーズを変更した場合、本番環境への反映前に再録音する

読み上げられるすべてのフレーズは翻訳（`assets/translations/{fr,en,es}.json`）に由来し、corpus の一部です。そのため、読み上げフレーズを変更すると corpus lock のテスト（`scripts/voice/corpus.lock.json`）が失敗します。録音音声がある言語では、変更されたフレーズのクリップを生成し、検証および試聴してから、マージする**前に**公開します。最後に lock を更新します（`npm run voice:corpus:lock`）。これらのクリップがない場合、変更されたフレーズはデバイスの音声で読み上げられます。

## 📊 データストレージ

### ユーザーデータ

- プロフィールと設定
- ゲームモードごとの進行状況
- arcade game のスコアと統計
- カスタマイズ設定

### 技術機能

- フォールバックを備えたローカルストレージ（localStorage）
- プロフィールごとに整理されたゲームデータ（計算ごとの統計はデバイス内で共通）
- 進行状況の自動保存
- 古いデータの自動移行

## 🐛 問題を報告する

問題は GitHub issue で報告できます。以下を含めてください：

- 問題の詳細な説明
- 再現手順
- ブラウザーとバージョン
- 必要に応じてスクリーンショット

## 💝 プロジェクトを支援する

**[☕ PayPal で寄付する](https://paypal.me/jls)**

## 📄 ライセンス

このプロジェクトは AGPL v3 の下でライセンスされています。詳細は `LICENSE` ファイルを参照してください。

---

_LeapMultix — 四則演算を学ぶための自由な教育アプリケーション_

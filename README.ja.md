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

- [説明](#説明)
- [概要](#-概要)
- [機能](#-機能)
- [クイックスタート](#-クイックスタート)
- [アーキテクチャ](#-アーキテクチャ)
- [ゲームモードの詳細](#-ゲームモードの詳細)
- [開発](#-開発)
- [互換性](#-互換性)
- [ローカライズ](#-ローカライゼーション)
- [録音済み音声](#-録音音声)
- [データストレージ](#-データストレージ)
- [問題を報告する](#-問題を報告する)
- [ライセンス](#-ライセンス)

## 説明

LeapMultix は、6～12歳の子どもが掛け算（×）、足し算（+）、引き算（−）、割り算（÷）の4つの算術演算を習得するための、インタラクティブな教育用ウェブアプリケーションです。直感的でアクセシブルな多言語インターフェースで、**6つのゲームモード**と**4つのアーケードミニゲーム**を提供します。

**複数演算への対応：** すべてのモードが4つの演算に対応しています。ホーム画面で選択した演算が、プレイ全体に適用されます。

**開発者：** Julien LS（contact@jls42.org）

**オンライン版URL：** https://leapmultix.jls42.org/

## 📸 概要

### 画面

|                                                                                                               |                                                                                                         |
| :-----------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|                    ![「だれが遊ぶ？」画面：プロフィールの選択](docs/media/01-accueil.webp)                    |                  ![メインメニュー：演算とゲームモードの選択](docs/media/02-menu.webp)                   |
|            **だれが遊ぶ？** — 子どもごとに、アバターと進捗状況を備えたプロフィールを作成できます。            |                     **メニュー** — ここで演算を選び、次にゲームモードを選択します。                     |
|                        ![発見モード：点で表された4の段](docs/media/03-decouverte.webp)                        |                  ![クイズモード：不正解は赤、正解は緑で表示](docs/media/04-quiz.webp)                   |
|               **発見** — 各等式を点、ジャンプ、または数え上げで表示し、その段のコツも示します。               |       **クイズ** — 子どもが選んだ答えを正解の横に表示したままにし、解説で計算を詳しく説明します。       |
|                ![チャレンジモード：カウントダウンと現在の連続正解数](docs/media/05-defi.webp)                 |    ![アドベンチャーモード：全10レベルのマップとロックされた次のレベル](docs/media/06-aventure.webp)     |
|             **チャレンジ** — 時間との勝負です。間違えた場合は、正解を読む間タイマーが停止します。             |               **アドベンチャー** — 星を獲得しながら、10のレベルを順番に解放していきます。               |
|             ![タイムアタックモード：引き算の挑戦、タイマー、進捗状況](docs/media/14-chrono.webp)              |                    ![アーケードメニュー：4つのミニゲーム](docs/media/07-arcade.webp)                    |
|  **タイムアタック** — 選択した演算で、時間内に10問正解を目指します。間違えた計算は復習リストに追加されます。  |                      **アーケード** — 難易度と宇宙船を選べる4つのミニゲームです。                       |
|      ![ダッシュボード：各モードのプレイ数、記録、解答を演算別に表示](docs/media/08-tableau-de-bord.webp)      |        ![カスタマイズ：アバター、テーマ、アクセシビリティ](docs/media/09-personnalisation.webp)         |
| **ダッシュボード** — 各モードのプレイ数と記録を演算別に表示します。掛け算では星と復習すべき段も確認できます。 | **カスタマイズ** — コインで解放できるアバター、カラーテーマ、文字サイズ、高コントラストを設定できます。 |

### アーケードミニゲーム

4つのゲームでは、プレイエリアの上に残り時間やライフとともに表示される同じ形式の問題に答えますが、ゲームごとに異なる操作が求められます。

|                                                                                                             |                                                                                |
| :---------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
|        ![MultiInvaders：数字を掲げたモンスターと画面下部の宇宙船](docs/media/10-multiinvaders.webp)         |     ![MultiMiam：選択肢の数字が置かれた迷路](docs/media/11-multimiam.webp)     |
|  **MultiInvaders** — 間違った答えを撃ち、正解は撃たずに残します。正解の中には救出する仲間が隠れています。   |  **MultiMiam** — モンスターを避けながら迷路を進み、正しい答えをつかまえます。  |
| ![MultiMemory：計算式と数字が描かれた2枚のカードがめくられたカードグリッド](docs/media/12-multimemory.webp) | ![MultiSnake：草原にいるヘビと数字付きのリンゴ](docs/media/13-multisnake.webp) |
|              **MultiMemory** — めくられた計算式の答えがどのカードにあるかを記憶から探します。               |  **MultiSnake** — 正しい数字を食べて成長し、それ以外の数字をすべて避けます。   |

## ✨ 機能

### 🎮 ゲームモード

- **発見モード**：各演算に合わせた視覚的でインタラクティブな探索
- **クイズモード**：4つの演算（×、+、−、÷）に対応した選択式問題と適応型進捗
- **チャレンジモード**：4つの演算（×、+、−、÷）と複数の難易度に対応した時間制チャレンジ
- **アドベンチャーモード**：4つの演算に対応したレベル別の物語形式の進行
- **タイムアタックモード**：止まらないタイマーで自己ベスト更新を目指し、4つの演算（×、+、−、÷）で10問正解するモード

### 🕹️ アーケードミニゲーム

- **MultiInvaders**：教育版 Space Invaders - 間違った答えを破壊する
- **MultiMiam**：算数版 Pac-Man - 正しい答えを集める
- **MultiMemory**：記憶ゲーム - 演算と答えを組み合わせる
- **MultiSnake**：教育版 Snake - 正しい数字を食べて成長する

### ➕ 複数演算への対応

LeapMultix は、**すべてのモード**で4つの算術演算を総合的に練習できます。

| モード         | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| クイズ         | ✅  | ✅  | ✅  | ✅  |
| チャレンジ     | ✅  | ✅  | ✅  | ✅  |
| 発見           | ✅  | ✅  | ✅  | ✅  |
| アドベンチャー | ✅  | ✅  | ✅  | ✅  |
| タイムアタック | ✅  | ✅  | ✅  | ✅  |
| アーケード     | ✅  | ✅  | ✅  | ✅  |

### 🌍 共通機能

- **マルチユーザー**：子どもごとに進捗状況を持つプロフィールを作成できます。教室の端末では、名前の並べ替え、10人以上の場合の絞り込み、30日間のごみ箱、プレイヤーデータのファイル保存に対応しています
- **多言語**：フランス語、英語、スペイン語に対応
- **カスタマイズ**：アバター（最初の1つは自由に選択でき、残りはプレイで獲得したコインを各50枚使って解放）、カラーテーマ、背景
- **アクセシビリティ**：完全なキーボード操作、タッチ操作、アーケードでの一時停止、文字サイズ、高コントラストに対応しています。axe-core で検証され、確認対象の画面では WCAG のレベルAまたはAAの違反はありません
- **録音済み音声**：事前に録音した合成音声で問題や励ましの言葉を読み上げ、利用できない場合は端末の音声へ自動的に切り替えます。音声はこのリポジトリに含まれていません。leapmultix.jls42.org では、フランス語に Lucie、英語とスペイン語に Sulafat を使用し、さらにフランス語では Sulafat と Marie、英語では Jane から選択できます（[録音済み音声](#-録音音声)を参照）
- **モバイル対応**：タブレットとスマートフォン向けに最適化されたインターフェース
- **進捗システム**：プロフィール別のダッシュボード（プレイ数、記録、復習すべき段を演算別に表示）、バッジ、デイリーチャレンジ、コイン（タイムアタック、アドベンチャー、チャレンジ、今日のチャレンジで獲得）

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
npm run test:pwa-offline # Hors ligne de bout en bout (Puppeteer, serveur intégré)

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

JavaScript モジュールは、`core/`、`components/`、`modes/` の3つのフォルダーを除き、**`js/` 直下にフラットに配置**されています。そのため、ファイル名によってグループ分けされています（`arcade-*`、`multimiam-*`、`i18n*` など）。

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
│   │   ├── profile-operation-stats.js        # Statistiques par calcul, rangées dans le profil
│   │   ├── players-trash.js, players-backup.js   # Corbeille et sauvegarde des joueurs
│   │   ├── avatar-shop.js                    # Avatars débloqués avec les pièces (prix, achat)
│   │   ├── daily-challenge.js, tablePreferences.js, stats-migration.js
│   │   ├── userUi.js, utils.js               # Utilitaires (source canonique)
│   │   └── operations/                       # Une classe par opération
│   │       ├── Operation.js, OperationRegistry.js
│   │       └── Multiplication.js, Addition.js, Subtraction.js, Division.js
│   ├── components/         # Composants d'interface
│   │   ├── topBar.js, infoBar.js, dashboard.js, customization.js
│   │   ├── operationSelector.js, operationModeAvailability.js
│   │   ├── playerTools.js  # « Qui joue ? » sur un poste de classe : filtre, corbeille, sauvegarde
│   │   ├── loadErrorNotice.js   # Avis d'un jeu qui n'a pas pu s'ouvrir (hors ligne…)
│   │   ├── confirm-dialog.js, avatarShop.js   # Fenêtre de confirmation du jeu, boutique d'avatars
│   │   └── icons.js, tableSettingsModal.js
│   ├── modes/              # Les six modes de jeu
│   │   ├── DiscoveryMode.js, QuizMode.js, ChallengeMode.js
│   │   └── AdventureMode.js, ChronoMode.js, ArcadeMode.js
│   ├── arcade*.js          # Orchestrateur et briques communes des mini-jeux (temps et pause :
│   │                       #   arcade-time.js ; plein écran : arcade-fullscreen.js)
│   ├── multimiam*.js       # Mini-jeu Pac-Man (moteur, rendu, contrôles…)
│   ├── multisnake.js       # Mini-jeu Snake
│   ├── i18n.js, i18n-store.js                # Internationalisation
│   ├── security-utils.js, error-handlers.js, logger.js
│   ├── accessibility.js, keyboard-navigation.js, touch-support.js, speech.js
│   ├── voice-clips.js      # Lecteur de la voix enregistrée (repli : speech.js)
│   ├── slides.js, mode-orchestrator.js, lazy-loader.js, game-cleanup.js
│   ├── game-exit.js        # Une seule règle pour quitter une partie en cours
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
│   ├── precache-list.mjs   # Liste de préchargement hors ligne de sw.js (npm run precache:update)
│   └── voice/              # Voix enregistrée : corpus, génération, écoute, publication
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### 技術アーキテクチャ

**最新の ES6 モジュール**：このプロジェクトは、ES6 クラスとネイティブの import/export を使用したモジュール式アーキテクチャを採用しています。

**再利用可能なコンポーネント**：一元管理された UI コンポーネント（TopBar、InfoBar、Dashboard、Customization）でインターフェースを構築しています。

**Lazy Loading**：初期パフォーマンスを最適化するため、`lazy-loader.js` を介して必要に応じてモジュールを効率的に読み込みます。

**統合ストレージシステム**：フォールバックを備えた LocalStorage を介し、一元化された API でユーザーデータを永続化します。

**一元化された音声管理**：多言語対応とユーザーごとの設定を備えた音声制御を提供します。

**Event Bus**：保守しやすいアーキテクチャを実現するため、コンポーネント間を疎結合にしたイベント通信を使用します。

**スライド式ナビゲーション**：`goToSlide()` を使用した番号付きスライド（slide0、slide1 など）ベースのナビゲーションシステムです。

**セキュリティ**：すべての DOM 操作で `security-utils.js` を使用し、XSS 対策とサニタイズを行います。

## 🎯 ゲームモードの詳細

### 発見モード

各演算に合わせた視覚的な探索インターフェースで、次の機能を備えています。

- 掛け算のインタラクティブな視覚化
- アニメーションと覚え方のヒント
- 教育的なドラッグ＆ドロップ
- 段ごとに自由に進められる学習

### クイズモード

次の機能を備えた選択式問題です。

- 1セッションにつき10問
- 正答状況に応じた適応型進捗
- 仮想テンキー
- ストリーク（連続正解）システム

### チャレンジモード

次の機能を備えた時間制チャレンジです。

- 3段階の難易度（初級、中級、上級）
- 正解時の時間ボーナス
- ライフシステム
- ハイスコアランキング

### アドベンチャーモード

次の機能を備えた物語形式の進行です。

- 解放可能な10のテーマ別レベル
- 進捗を視覚的に確認できるインタラクティブマップ
- キャラクターが登場する没入感のある物語
- 星と報酬のシステム

### タイムアタックモード

止まらないタイマーを相手に、できるだけ速く10問正解します。

- 4つの演算：掛け算の段（段の設定で指定）と、足し算（7 + k）、引き算（(7 + k) − 7）、割り算（(7 × k) ÷ 7）のすべての段
- 選択肢またはテンキーで回答し、クリックとキーボードの両方で操作可能
- 演算ごとのベストタイム、平均タイム、最近のプレイ履歴グラフ
- 「復習する計算」：演算ごとのリストを両方向で復習（6 × 7 と 7 × 6、15 − 7 と 15 − 8）

### ダッシュボード

子どもが実際にプレイした内容をプロフィールごとに確認できます。

- アドベンチャーの星と復習すべき掛け算の段（各段の直近20回答）
- クイズ、チャレンジ、アドベンチャー、タイムアタックの問題数と正解数
- 各モードと各ミニゲームのプレイ数と記録（途中終了を含む）。子どもが複数の演算を練習すると演算別に表示

### アーケードミニゲーム

各ミニゲームには次の機能があります。

- 4つの演算で3段階の難易度
- ライフとスコアのシステム
- マウス、キーボード、タッチによる操作。操作方法は各ゲームの説明画面に記載
- 一時停止：時間表示の横にあるボタンまたは P キーを使用します。タブが非表示になった場合も自動的に一時停止し、勝手に再開することはありません
- MultiMemory：時間制限なしのプレイを選択可能
- 利用可能な領域に合わせたゲーム盤（縦向きのスマートフォンでは横幅より高さを優先）と全画面表示。パソコンとスマートフォンの両方に対応し、スマートフォンを回転した場合も利用可能です（ブラウザーが対応していない iPhone を除く）
- プレイヤーごとのハイスコア。「リセット」では削除される内容をすべて明示

## 🔧 開発

### 開発ワークフロー

**main に直接コミットしないでください。** このプロジェクトでは機能ブランチを使用します。

**1. ブランチを作成します。** 機能追加には `feat/`、修正には `fix/` を使用します。

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 開発して検証します。** まずフォーマットを行ってください。CI はテストを実行する前にフォーマット違反を検出して失敗します。

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

**4. pull request を作成し**、verify、Codacy、CodeFactor、SonarCloud の解析結果を待ちます。すべて成功するまで修正してからマージします。

**コミットのスタイル**：簡潔な命令形のメッセージ（例："Fix arcade init errors"、"Refactor cache updater"）

**Quality gate**：各コミットの前に `npm run lint`、`npm test`、`npm run test:coverage` が成功することを確認してください

### コンポーネントアーキテクチャ

**GameMode（基底クラス）**：すべてのモードは、標準化されたメソッドを持つ共通クラスを継承します。

**GameModeManager**：モードの起動と管理を一元的に統括します。

**UI コンポーネント**：TopBar、InfoBar、Dashboard、Customization が一貫したインターフェースを提供します。

**Lazy Loading**：初期パフォーマンスを最適化するため、必要に応じてモジュールを読み込みます。

**Event Bus**：イベントシステムを介してコンポーネント間を疎結合に通信させます。

### テスト

このプロジェクトには包括的なテストスイートが含まれています。

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

**GitHub Actions**：`.github/workflows/ci.yml`。`main` への各 push および各 pull request で実行されます。

**`verify`** — 必須の品質ゲート：

- `npm ci`、続いて `npm run verify`（ESLint、Jest テスト、カバレッジ）
- `npm run format:check`（Prettier）

**`seo-report`** — `verify` の後：公開中のサイトに対する Lighthouse 監査を行い、SEO 指標を継続的に追跡します。

pull request に連携された**外部解析**：Codacy、CodeFactor、SonarCloud。SonarCloud ゲートでは、新規コードの信頼性、セキュリティ、保守性について A 評価が必須です。

**デプロイ**：`./deploy.sh` はサイトを S3 に同期し、CloudFront のキャッシュを無効化します。git に存在しないレスポンシブ画像は、必要に応じてスクリプトが再生成します。

### PWA（Progressive Web App）

LeapMultix は、オフライン対応とインストール機能を備えた完全な PWA です。

**Service Worker**（`sw.js`）：

- インストール：ゲームが必要とするすべてのものを事前読み込みします。リストは `scripts/precache-list.mjs` によりコードから生成され（`npm run precache:update`、テストで検証）、初回訪問後は6つのモードと4つの Arcade ゲームをオフラインで起動できます
- ナビゲーション：Network-first（4 秒の期限付き）。期限を過ぎた場合（学校の Wi-Fi やキャプティブポータルなど、応答しないネットワーク）またはオフライン時は、キャッシュ済みのゲームページを使用します（未保存のページに限り `offline.html`）
- 画像：Cache-first。オフライン時は、同じスプライトの別サイズまたは同じアバターの別背景を使用します
- 翻訳：バックグラウンド更新のための Stale-while-revalidate
- JS/CSS：このバージョンのファイル（`?v=` 付きのアドレス、つまりデプロイ済みサイトのもの）は、まず事前読み込みされたコピーから提供されます。構造上、同じバージョンです。サーバーは `?v=` を無視するため、そうしないとデプロイ後に別のバージョンが返される可能性があります。それ以外（開発時の `?v=` なし）：Network-first で、このバージョンのコピーに切り替える前に同じ 4 秒の期限を設けます
- 音声とフォント：Cache-first、バイト範囲配信に対応（Safari のオーディオプレーヤー）
- `cache-updater.js` による自動バージョン管理

**マニフェスト**（`manifest.json`）：

- すべての端末向けの SVG および PNG アイコン
- モバイル端末にインストール可能（ホーム画面に追加）
- アプリのような操作感を実現する standalone 構成
- テーマとカラーに対応

**オフラインモードをローカルでテストする。** サーバーを起動し、`http://localhost:8080`（または表示されたポート）を開きます：

```bash
npm run serve
```

手動の場合：Service Worker がゲームを登録するまでページを開いたままにし、サーバーを停止するか端末のネットワークを切断してから、ページを更新します。ゲームが表示され、各モードを起動できる必要があります。

Puppeteer による自動テスト：

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

- **ESLint**：flat config（`eslint.config.js`）を使用した最新構成、ES2022 対応
- **Prettier**：コードの自動フォーマット（`.prettierrc`）
- **Stylelint**：CSS 検証（`.stylelintrc.json`）
- **JSDoc**：カバレッジ解析を伴う関数ドキュメントの自動生成

**重要なコーディング規則**：

- 未使用の変数と引数を削除する（`no-unused-vars`）
- 具体的なエラー処理を行う（空の catch を使用しない）
- `innerHTML` を避け、`security-utils.js` 関数を使用する
- 関数の認知的複雑度を15未満に保つ
- 複雑な関数を、より小さなヘルパーに分割する

**セキュリティ**：

- **XSS 対策**：`security-utils.js` の関数を使用する：
  - `innerHTML` の代わりに `appendSanitizedHTML()`
  - 安全な要素の作成には `createSafeElement()`
  - テキストコンテンツには `setSafeMessage()`
- **外部スクリプト**：`crossorigin="anonymous"` 属性が必須
- **入力検証**：外部データは必ずサニタイズする
- **Content Security Policy**：スクリプトの取得元を制限する CSP ヘッダー

**アクセシビリティ**：

- WCAG 2.1 レベル AA を目標とし、axe-core で検証：レベル A、AA、およびベストプラクティスの違反なし
- 完全なキーボードナビゲーション
- ARIA ロールとアクセシブルネーム
- axe-core によるコントラスト検証

**パフォーマンス**：

- `lazy-loader.js` によるモジュールの遅延読み込み
- CSS の最適化とレスポンシブなアセット
- Service Worker によるインテリジェントなキャッシュ
- 本番環境でのコード分割とミニファイ

## 📱 互換性

### 対応ブラウザー

インターフェースでは、カラーに `oklch()`、コンテキストに応じた状態に `:has()` を使用しているため、最低要件は次のとおりです：

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### 端末

- **デスクトップ**：キーボードとマウスによる操作
- **タブレット**：最適化されたタッチインターフェース
- **スマートフォン**：適応型レスポンシブデザイン

### アクセシビリティ

- 完全なキーボードナビゲーション：Tab、回答グリッドと MultiMemory カード内の矢印キー、Enter、Esc。ホーム画面上部に「ゲームモードへ移動」リンク
- ゲームを終了する方法は1つの規則に統一：「あきらめる」、Esc、または上部バーのボタンはいずれも同じ確認を表示し、子どもが拒否すればゲームは続行されます
- スクリーンリーダー：各回答は対応する質問に関連付けられ、各画面にレベル1の見出しが1つあり、メッセージは読み上げられます
- ページはピンチ操作で拡大可能です（Arcade ゲームを除く）。文字サイズ、ハイコントラスト、動きを抑えた表示、および初学者向けに設計された Andika 派生の読みやすいフォントに対応しています
- Arcade：一時停止（ボタン、P キー、またはタブが非表示になったとき）。MultiMemory では時間制限なしを選択可能
- axe-core（WCAG 2.0～2.2、レベル A と AA、およびベストプラクティス）で検証済み：デスクトップ幅の41画面とスマートフォン幅（390 px）の40画面で違反なし。夜間テーマとハイコントラストを含みます

## 🌍 ローカライゼーション

完全な多言語対応：

- **フランス語**（既定の言語）
- **英語**
- **スペイン語**

### 翻訳管理

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

- 不足キーの検出（fr.json には存在するが、ほかの言語には存在しないキー）
- 余分なキーの検出（ほかの言語には存在するが、fr.json には存在しないキー）
- 空の値の特定（`""`、`null`、`undefined`、`[]`）
- 型の整合性確認（string と array）
- ネストされた JSON 構造をドット記法に平坦化（例：`arcade.multiMemory.title`）
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
- エラーおよびフィードバックメッセージ
- 説明文とコンテキストヘルプ
- アドベンチャーモードの物語コンテンツ
- アクセシビリティおよび ARIA ラベル

## 🔊 録音音声

ゲームは質問、励まし、説明を音声で読み上げます。読み上げるのは言語ごとに約7,400件の有限のフレーズだけなので、一度録音すれば、その後ゲーム中に音声合成サービスを呼び出す必要はありません。クリップがない場合は、端末の音声で読み上げます。

### このリポジトリの内容：音声を含まないアプリケーション

コードは事前録音されたクリップを再生でき、その生成パイプラインも含んでいます。ただし、クリップもプロバイダーのキーも含まれていません。fork またはローカルインストールでは、端末の音声で読み上げます。

- フレーズごとの**端末音声への自動フォールバック**：クリップがないかエラーになった場合、ブラウザーが再生を拒否した場合、クリップが1.5秒以内に開始しない場合、またはオフラインでクリップがキャッシュされていない場合。
- **設定**：上部バーの音声ボタンで読み上げを有効または無効にします。「録音音声」チェックボックス（アクセシビリティと操作）で、録音音声と端末の音声を切り替えます。この項目は、録音音声が公開されている言語でのみ表示されます。
- **オフライン**：一度再生されたクリップはキャッシュに残ります（Service Worker）。
- **ゲームがクリップを探す場所**：`<meta name="leapmultix-voice-base">` タグ内です。リポジトリでは空になっています。本番デプロイのみが `/voice/` を書き込みます。

下記のパイプラインで作成し、ゲームと同じ場所の `../leapmultix-voices` に配置した独自のローカルクリップがある場合、`?voix=local` パラメーターにより開発サーバーから再生できます：

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org：ホスティング環境の音声

作者が提供するサイトでは、録音済みの合成音声を配信しています：

- フランス語では、ElevenLabs（Eleven v3 モデル）で作成された **Lucie**
- イギリス英語とスペインのスペイン語では、Google Cloud Text-to-Speech（Chirp 3 HD 音声）で作成された **Sulafat**
- プレイヤーの選択により、3言語で同じ音声を使い続けるためのフランス語版 **Sulafat**
- 同じくプレイヤーの選択により、Mistral AI（Voxtral TTS）で作成されたフランス語版 **Marie** と英語版 **Jane**

クリップは非公開リポジトリと専用の S3 bucket に保存され、`/voice/*` の CloudFront を通じて配信されます。生成は一度だけ行われ、ゲーム中にこれらのサービスへ何も送信されません。設定の「音声」メニューでは、複数の音声がある言語について音声を選択でき、注記には再生中の音声サービス名が表示されます。

### クリップの生成

パイプラインは `scripts/voice/` にスクリプト化されており、所有者の端末上で実行されます。公開 CI では決して実行されません。プロバイダーのキー（Lucie 用の ElevenLabs、Sulafat 用の Google Cloud Text-to-Speech、Marie と Jane 用の Mistral）は、リポジトリ外の `.env` ファイルに保存し、`node --env-file` で渡します。キーが git に入ることはありません。Claude Code skill の [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) が手順（ゲート、確認、再開）を段階的に案内し、詳細は [`docs/voix-enregistree.md`](docs/voix-enregistree.md) に記載されています。

1. **見積もる**：残りのフレーズ数と課金対象の文字数を見積もります（Eleven v3：1文字あたり約0.53クレジット、Chirp 3 HD：100万文字あたり30ドル、毎月最初の100万文字は無料、Voxtral TTS：100万文字あたり16ドル）。
2. **生成する**：同じコマンドを再実行すると、不足分から再開されます。クレジットを使い切ると、スクリプトは書きかけのファイルを残さず正常に停止します（コード3）。`--max-total-chars` はバージョンごとの累積支出に上限を設定します。課金された各レスポンスは受信直後に台帳へ記録されるため、突然停止しても記録は残ります。残高を読み取る方法がない Google と Mistral では、これが唯一の保護手段です。
3. **検証する**：各フレーズにクリップがあり、各 MP3 が有効であることを確認します。続いて Whisper が各クリップをローカルで文字起こしし、検証処理が聞き間違えられた数字と異常な長さを報告します。`voice:review` は、Whisper、この検証、試聴ページを1つのコマンドで順に実行します。
4. **試聴する**：試聴ページ（`voice:listen`）で、報告されたクリップと、Whisper では区別できない女性形（「une fois 7」）のサンプルを聴きます。各クリップには「再作成」チェックボックスがあり、選択すると除外クリップの一覧に追加されます。
5. **再作成する**：除外したクリップを再生成し（`--redo`）、Whisper を再実行してから、2つ目のページで各クリップの変更前後を比較します。2回または3回試しても発音が正しくないクリップには、`SAID_OVERRIDES`（`scripts/voice/said-text.mjs`）で、たとえば数字を単語で表記した指定テキストを設定します。
6. **公開する**：クリップを公開し、オンラインで応答することを確認してから、まずテスター向けに言語インデックスを公開します（`?voix=test`）。
7. **一般公開する**：音声をすべてのユーザーに公開し、その後、既定で有効にします。緊急停止機能（`voice:publish -- remove`）は言語をインデックスから削除し、ゲームを端末の音声に戻します。

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

### 規則：読み上げフレーズを変更した場合は、本番投入前に再録音する

読み上げられるすべてのフレーズは翻訳（`assets/translations/{fr,en,es}.json`）から取得され、コーパスの一部です。そのため、読み上げフレーズを変更すると、コーパスロックのテスト（`scripts/voice/corpus.lock.json`）が失敗します。録音音声がある言語では、変更されたフレーズのクリップを生成し、検証して試聴した後、マージする**前に**公開します。最後にロックを更新します（`npm run voice:corpus:lock`）。これらのクリップがない場合、変更されたフレーズは端末の音声で読み上げられます。

## 📊 データストレージ

### ユーザーデータ

- プロフィールと設定
- ゲームモード別の進捗
- Arcade ゲームのスコアと統計
- カスタマイズ設定

### 技術的機能

- フォールバック付きローカルストレージ（localStorage）。ブラウザーにはデータを自動的に削除しないよう要求します（`navigator.storage.persist()`）
- 削除されたプレイヤー用のごみ箱：すべてのデータを30日間保持し、「だれがプレイする？」から復元可能
- プレイヤーを JSON ファイルにバックアップし、この端末または別の端末で復元可能（既存のプレイヤーが上書きされることはありません）
- 計算ごとの統計を含め、ゲームデータをプロフィール別に保存：共有端末でも、あるプレイヤーの間違いが別のプレイヤーへの出題に影響することはありません
- 進捗の自動保存
- 旧データの自動移行

## 🐛 問題を報告する

問題は GitHub issues から報告できます。次の情報を含めてください：

- 問題の詳しい説明
- 再現手順
- ブラウザーとバージョン
- 必要に応じてスクリーンショット

## 💝 プロジェクトを支援する

**[☕ PayPal で寄付する](https://paypal.me/jls)**

## 📄 ライセンス

このプロジェクトは AGPL v3 の下でライセンスされています。詳細については `LICENSE` ファイルを参照してください。

---

_LeapMultix — 四則演算を学ぶための自由な教育アプリケーション_

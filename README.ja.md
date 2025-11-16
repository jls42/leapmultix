<details>
<summary>このドキュメントは他の言語でも利用可能です</summary>

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

<!-- バッジ（GitHub移行後に<owner>/<repo>を更新） -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## 目次

- [説明](#説明)
- [機能](#-機能)
- [クイックスタート](#-クイックスタート)
- [アーキテクチャ](#-アーキテクチャ)
- [詳細なゲームモード](#-詳細なゲームモード)
- [開発](#-開発)
- [互換性](#-互換性)
- [ローカリゼーション](#-ローカリゼーション)
- [データストレージ](#-データストレージ)
- [問題の報告](#-問題の報告)
- [ライセンス](#-ライセンス)

## 説明

LeapMultixは、子供（8〜12歳）が九九をマスターするための最新のインタラクティブな教育ウェブアプリケーションです。このアプリケーションは、直感的でアクセスしやすく、多言語対応のインターフェースで**4つのクラシックゲームモード**と**4つのアーケードミニゲーム**を提供します。

**開発者：** Julien LS (contact@jls42.org)

**オンラインURL：** https://leapmultix.jls42.org/

## ✨ 機能

### 🎮 ゲームモード

- **ディスカバリーモード**：九九の視覚的でインタラクティブな探求
- **クイズモード**：適応的な進行を備えた多肢選択問題
- **チャレンジモード**：さまざまな難易度レベルでのタイムトライアル
- **アドベンチャーモード**：インタラクティブなマップを備えたレベルごとの物語的な進行

### 🕹️ アーケードミニゲーム

- **MultiInvaders**：教育的なスペースインベーダー - 間違った答えを破壊する
- **MultiMiam**：数学的なパックマン - 正しい答えを集める
- **MultiMemory**：記憶ゲーム - 掛け算と結果を一致させる
- **MultiSnake**：教育的なスネーク - 正しい数字を食べて成長する

### 🌍 横断的な機能

- **マルチユーザー**：保存された進行状況を持つ個別のプロファイルの管理
- **多言語対応**：フランス語、英語、スペイン語のサポート
- **カスタマイズ**：アバター、カラーテーマ、背景
- **アクセシビリティ**：キーボードナビゲーション、タッチサポート、WCAG 2.1 AA準拠
- **モバイルレスポンシブ**：タブレットとスマートフォンに最適化されたインターフェース
- **進行システム**：スコア、バッジ、毎日のチャレンジ

## 🚀 クイックスタート

### 前提条件

- Node.js（バージョン16以降）
- 最新のウェブブラウザ

### インストール

```bash
# プロジェクトをクローンする
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# 依存関係をインストールする
npm install

# 開発サーバーを起動する（オプション1）
npm run serve
# アプリケーションはhttp://localhost:8080（または次に利用可能なポート）でアクセスできます

# またはPythonを使用する（オプション2）
python3 -m http.server 8000
# アプリケーションはhttp://localhost:8000でアクセスできます
```

### 利用可能なスクリプト

```bash
# 開発
npm run serve          # ローカルサーバー（http://localhost:8080）
npm run lint           # ESLintによるコードチェック
npm run lint:fix       # ESLintの問題を自動修正
npm run format:check   # コードのフォーマットをチェック（コミット前に必ず）
npm run format         # Prettierでコードをフォーマット
npm run verify         # 品質ゲート：lint + test + coverage

# テスト
npm run test           # すべてのテストを実行（CJS）
npm run test:watch     # ウォッチモードでテスト
npm run test:coverage  # カバレッジレポート付きのテスト
npm run test:core      # コアモジュールのみのテスト
npm run test:integration # 統合テスト
npm run test:storage   # ストレージシステムのテスト
npm run test:esm       # ESMテスト（tests-esm/フォルダー、Jest vm-modules）
npm run test:verbose   # 詳細な出力付きのテスト
npm run test:pwa-offline # PWAオフラインテスト（Puppeteerが必要）、`npm run serve`の後

# 分析とメンテナンス
npm run analyze:jsdoc  # ドキュメント分析
npm run improve:jsdoc  # JSDocの自動改善
npm run audit:mobile   # モバイルレスポンシブテスト
npm run audit:accessibility # アクセシビリティテスト
npm run dead-code      # 未使用コードの検出
npm run analyze:globals # グローバル変数の分析
npm run analyze:dependencies # 依存関係の使用状況分析
npm run verify:cleanup # 複合分析（未使用コード+グローバル）

# アセット管理
npm run assets:generate    # レスポンシブ画像を生成
npm run assets:backgrounds # 背景をWebPに変換
npm run assets:analyze     # レスポンシブアセットの分析
npm run assets:diff        # アセットの比較

# 国際化
npm run i18n:verify    # 翻訳キーの整合性を検証
npm run i18n:unused    # 未使用の翻訳キーをリストアップ
npm run i18n:compare   # 翻訳（en/es）をfr.json（参照）と比較

# ビルドと配信
npm run build          # 本番ビルド（Rollup）+ポストビルド（完全なdist/）
npm run serve:dist     # http://localhost:5000（または利用可能なポート）でdist/を配信

# PWAとサービスワーカー
npm run sw:disable     # サービスワーカーを無効にする
npm run sw:fix         # サービスワーカーの問題を修正する
```

## 🏗️ アーキテクチャ

### ファイル構造

```
leapmultix/
├── index.html              # メインエントリポイント
├── js/
│   ├── core/               # コアES6モジュール
│   │   ├── GameMode.js     # モードの基本クラス
│   │   ├── GameModeManager.js # ゲームモード管理
│   │   ├── storage.js      # LocalStorageストレージAPI
│   │   ├── audio.js        # サウンド管理
│   │   ├── utils.js        # 汎用ユーティリティ（正規ソース）
│   │   ├── eventBus.js     # イベント駆動型通信
│   │   ├── userState.js    # ユーザーセッション管理
│   │   ├── mainInit.js     # DOM-ready初期化
│   │   ├── theme.js        # テーマシステム
│   │   ├── userUi.js       # ユーザーインターフェースユーティリティ
│   │   ├── parental.js     # 保護者による制限
│   │   ├── adventure-data.js # アドベンチャーモードのデータ
│   │   ├── mult-stats.js   # 掛け算の統計
│   │   ├── challenge-stats.js # チャレンジの統計
│   │   └── daily-challenge.js # 毎日のチャレンジ管理
│   ├── components/         # 再利用可能なUIコンポーネント
│   │   ├── topBar.js       # ナビゲーションバー
│   │   ├── infoBar.js      # ゲーム情報バー
│   │   ├── dashboard.js    # ユーザーダッシュボード
│   │   └── customization.js # カスタマイズインターフェース
│   ├── modes/              # ゲームモード
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # アーケードミニゲーム
│   │   ├── arcade.js       # メインアーケードオーケストレーター
│   │   ├── arcade-invasion.js # スペースインベーダー（31 KB）
│   │   ├── arcade-multimemory.js # 記憶ゲーム（31 KB）
│   │   ├── arcade-multimiam.js # MultiMiam統合
│   │   ├── arcade-multisnake.js # スネーク統合
│   │   ├── arcade-common.js, arcade-utils.js # 共有ユーティリティ
│   │   ├── arcade-message.js, arcade-points.js # UIコンポーネント
│   │   └── arcade-scores.js # スコア管理
│   ├── multimiam/          # パックマンゲーム（分解されたアーキテクチャ）
│   │   ├── multimiam.js    # メインコントローラー
│   │   ├── multimiam-engine.js # ゲームエンジン（15 KB）
│   │   ├── multimiam-renderer.js # レンダリングシステム（9 KB）
│   │   ├── multimiam-controls.js # コントロール管理（7 KB）
│   │   ├── multimiam-questions.js # 問題生成（6 KB）
│   │   └── multimiam-ui.js # インターフェース要素
│   ├── multisnake.js       # スネークゲーム（38 KB）
│   ├── navigation/         # ナビゲーションシステム
│   │   ├── slides.js       # スライドベースのナビゲーション（goToSlide, showSlide）
│   │   └── keyboard-navigation.js # キーボードサポート
│   ├── ui/                 # ユーザーインターフェースとフィードバック
│   │   ├── uiUtils.js      # インターフェースユーティリティ
│   │   ├── ui-feedback.js  # フィードバックメカニズム
│   │   ├── touch-support.js # タッチサポート（7 KB）
│   │   ├── virtual-keyboard.js # 仮想キーボード
│   │   ├── coin-display.js, coin-effects.js # 通貨システム
│   │   ├── notifications.js # 通知システム
│   │   └── badges.js       # バッジシステム
│   ├── media/              # メディア管理
│   │   ├── VideoManager.js # ビデオ再生管理（12 KB）
│   │   └── responsive-image-loader.js # 画像読み込み（9 KB）
│   ├── orchestration/      # オーケストレーションと読み込み
│   │   ├── mode-orchestrator.js # モード切り替え
│   │   ├── lazy-loader.js  # 動的読み込み（10 KB）
│   │   └── game-cleanup.js # 状態のクリーンアップ
│   ├── utils/              # ユーティリティ
│   │   ├── utils-es6.js    # メインアグリゲーター（5 KB）
│   │   ├── main-helpers.js # アプリケーションヘルパー
│   │   ├── helpers.js      # レガシーヘルパー関数
│   │   ├── stats-utils.js  # 統計ユーティリティ
│   │   ├── difficulty.js   # 難易度管理
│   │   └── questionGenerator.js # 問題生成
│   ├── storage/            # ストレージと状態
│   │   ├── storage.js      # レガシーストレージラッパー
│   │   └── userManager.js  # マルチユーザー管理（19 KB）
│   ├── i18n/               # 国際化
│   │   ├── i18n.js         # i18nシステム
│   │   └── i18n-store.js   # 翻訳ストレージ
│   ├── security/           # セキュリティとエラー処理
│   │   ├── security-utils.js # XSS保護、サニタイズ
│   │   ├── error-handlers.js # グローバルエラー処理
│   │   └── logger.js       # ロギングシステム
│   ├── accessibility/      # アクセシビリティ
│   │   ├── accessibility.js # アクセシビリティ機能
│   │   └── speech.js       # 音声合成サポート
│   ├── integration/        # 統合と分析
│   │   ├── plausible-init.js # Plausible分析
│   │   ├── cache-updater.js # キャッシュ管理（10 KB）
│   │   └── imports.js      # インポートユーティリティ
│   ├── main-es6.js         # ES6エントリポイント
│   ├── main.js             # メインオーケストレーター
│   ├── bootstrap.js        # ES6イベントハンドラーの設定
│   └── game.js             # 状態管理と毎日のチャレンジ
├── css/                    # モジュラースタイル
├── assets/                 # リソース
│   ├── images/             # 画像とスプライト
│   ├── generated-images/   # 生成されたレスポンシブ画像
│   ├── sounds/             # 効果音
│   ├── translations/       # 翻訳ファイル（fr, en, es）
│   └── videos/             # チュートリアルビデオ
├── tests/                  # 自動テスト
│   ├── __tests__/          # ユニットテストと統合テスト
│   └── tests-esm/          # ESMテスト（.mjs）
├── scripts/                # メンテナンススクリプト
│   ├── compare-translations.cjs # 翻訳比較
│   └── cleanup-i18n-keys.cjs # i18nキークリーンアップ
└── dist/                   # 本番ビルド（生成済み）
```

### 技術アーキテクチャ

**最新のES6モジュール**：プロジェクトは、ネイティブのES6クラスとインポート/エクスポートを備えたモジュラーアーキテクチャを使用しています。

**再利用可能なコンポーネント**：中央集権化されたUIコンポーネント（TopBar、InfoBar、Dashboard、Customization）で構築されたインターフェース。

**遅延読み込み（Lazy Loading）**：初期パフォーマンスを最適化するために、`lazy-loader.js`を介してオンデマンドでモジュールをスマートに読み込みます。

**統一されたストレージシステム**：フォールバック付きのLocalStorageを介したユーザーデータの永続化のための中央集権化されたAPI。

**中央集権化されたオーディオ管理**：ユーザーごとの設定と多言語サポートを備えたサウンドコントロール。

**イベントバス（Event Bus）**：保守可能なアーキテクチャのためのコンポーネント間の分離されたイベント駆動型通信。

**スライドベースのナビゲーション**：`goToSlide()`を使用した番号付きスライド（slide0、slide1など）に基づくナビゲーションシステム。

**セキュリティ**：すべてのDOM操作に対する`security-utils.js`を介したXSS保護とサニタイズ。

## 🎯 詳細なゲームモード

### ディスカバリーモード

九九の視覚的な探求インターフェース：

- 掛け算のインタラクティブな視覚化
- アニメーションと記憶補助
- 教育的なドラッグアンドドロップ
- テーブルごとの自由な進行

### クイズモード

多肢選択問題：

- セッションごとに10問
- 成功に基づく適応的な進行
- 仮想テンキー
- ストリークシステム（連続正解）

### チャレンジモード

タイムトライアル：

- 3つの難易度レベル（初心者、中級、上級）
- 正解に対する時間ボーナス
- ライフシステム
- ハイスコアリーダーボード

### アドベンチャーモード

物語的な進行：

- 12のアンロック可能なテーマ別レベル
- 視覚的な進行を備えたインタラクティブなマップ
- キャラクターとの没入型ストーリー
- スターと報酬システム

### アーケードミニゲーム

各ミニゲームが提供するもの：

- 難易度の選択とカスタマイズ
- ライフとスコアシステム
- キーボードとタッチコントロール
- ユーザーごとの個別リーダーボード

## 🛠️ 開発

### 開発ワークフロー

**重要：mainに直接コミットしないでください**

プロジェクトは、機能ブランチに基づくワークフローを使用しています。

1. **ブランチを作成する**：

   ```bash
   git checkout -b feat/feature-name
   # または
   git checkout -b fix/bug-name
   ```

2. **開発とテスト**：

   ```bash
   npm run format:check  # 常に最初にフォーマットをチェック
   npm run format        # 必要に応じてフォーマット
   npm run lint          # コードの品質をチェック
   npm run test          # テストを実行
   npm run test:coverage # カバレッジをチェック
   ```

3. **ブランチにコミットする**：

   ```bash
   git add .
   git commit -m "feat: 機能の説明"
   ```

4. **プッシュしてプルリクエストを作成する**：
   ```bash
   git push -u origin feat/feature-name
   ```

**コミットスタイル**：簡潔なメッセージ、命令形（例：「Fix arcade init errors」、「Refactor cache updater」）

**品質ゲート**：各コミットの前に`npm run lint`、`npm run test`、`npm run test:coverage`がパスすることを確認する

### コンポーネントアーキテクチャ

**GameMode（基本クラス）**：すべてのモードは、標準化されたメソッドを持つ共通のクラスから継承します。

**GameModeManager**：モードの起動と管理のための中央集権化されたオーケストレーション。

**UIコンポーネント**：TopBar、InfoBar、Dashboard、Customizationは、一貫したインターフェースを提供します。

**遅延読み込み（Lazy Loading）**：初期パフォーマンスを最適化するために、モジュールはオンデマンドで読み込まれます。

**イベントバス（Event Bus）**：イベントシステムを介したコンポーネント間の分離された通信。

### テスト

プロジェクトには、完全なテストスイートが含まれています。

- コアモジュールのユニットテスト
- コンポーネントの統合テスト
- ゲームモードのテスト
- 自動化されたコードカバレッジ

```bash
npm test              # すべてのテスト（CJS）
npm test:core         # コアモジュールテスト
npm test:integration  # 統合テスト
npm test:coverage     # カバレッジレポート
npm run test:esm      # ESMテスト（例：components/dashboard）vm-modules経由
```

### 本番ビルド

- **Rollup**：`js/main-es6.js`をコード分割とソースマップ付きのESMにバンドルします
- **Terser**：最適化のための自動ミニフィケーション
- **ポストビルド**：`css/`と`assets/`、ファビコン（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js`をコピーし、`dist/index.html`をハッシュ化されたエントリファイル（例：`main-es6-*.js`）に書き換えます
- **最終フォルダー**：`dist/`は静的に配信される準備ができています

```bash
npm run build      # dist/を生成します
npm run serve:dist # dist/を配信します（ポート5000）
```

### 継続的インテグレーション

**GitHub Actions**：`.github/workflows/ci.yml`の自動化されたパイプライン

CI/CDパイプラインは、すべてのプッシュとプルリクエストで自動的に実行されます。

**主なジョブ**：

1. **build-test**：主な検証ジョブ
   - 依存関係のインストール：`npm ci`
   - フォーマットのチェック：`npm run format:check`
   - 静的分析：`npm run lint`
   - ユニットテスト：`npm run test`
   - セキュリティ監査：`npm audit`
   - カバレッジアーティファクトの生成

2. **accessibility**：アクセシビリティ監査（非ブロッキング）
   - `npm run audit:accessibility`を実行します
   - WCAG 2.1 AAアクセシビリティレポートを生成します

3. **test-esm**：ES6モジュールテスト
   - Jest VMモジュールで`npm run test:esm`を実行します
   - ES6のインポート/エクスポートを検証します

4. **lighthouse**：パフォーマンス監査（非ブロッキング）
   - モバイルパフォーマンス監査
   - Lighthouseレポートアーティファクトの生成
   - Core Web Vitalsメトリクス

**品質バッジ**：

- CIビルドステータス（GitHub Actions）
- CodeFactorグレード
- Codacyバッジ
- SonarCloud品質ゲート

### PWA（プログレッシブウェブアプリ）

LeapMultixは、オフラインサポートとインストール可能性を備えたフル機能のPWAです。

**サービスワーカー**（`sw.js`）：

- ナビゲーション：`offline.html`へのオフラインフォールバック付きのネットワークファースト
- 画像：パフォーマンスを最適化するためのキャッシュファースト
- 翻訳：バックグラウンド更新のためのStale-while-revalidate
- JS/CSS：常に最新バージョンを配信するためのネットワークファースト
- `cache-updater.js`による自動バージョン管理

**マニフェスト**（`manifest.json`）：

- すべてのデバイス用のSVGおよびPNGアイコン
- モバイルへのインストール可能（ホーム画面に追加）
- アプリのような体験のためのスタンドアロン構成
- テーマと色のサポート

**オフラインモードをローカルでテストする**：

1. 開発サーバーを起動します：

   ```bash
   npm run serve
   ```

   `http://localhost:8080`（または表示されたポート）を開きます

2. 手動でテストします：
   - DevToolsでネットワークを切断します（ネットワークタブ→オフライン）
   - ページを更新します→`offline.html`が表示されます

3. 自動テスト（Puppeteerが必要）：
   ```bash
   npm run test:pwa-offline
   ```

**サービスワーカー管理スクリプト**：

```bash
npm run sw:disable  # サービスワーカーを無効にする
npm run sw:fix      # キャッシュの問題を修正する
```

### 品質基準

**コード品質ツール**：

- **ESLint**：フラット構成（`eslint.config.js`）、ES2022サポートを備えた最新の構成
- **Prettier**：自動コードフォーマット（`.prettierrc`）
- **Stylelint**：CSS検証（`.stylelintrc.json`）
- **JSDoc**：カバレッジ分析付きの自動関数ドキュメント

**重要なコードルール**：

- 未使用の変数とパラメーターを削除する（`no-unused-vars`）
- 特定のエラー処理を使用する（空のcatchブロックなし）
- `security-utils.js`関数の代わりに`innerHTML`を避ける
- 関数の認知複雑度を15未満に維持する
- 複雑な関数をより小さなヘルパーに抽出する

**セキュリティ**：

- **XSS保護**：`security-utils.js`の関数を使用します：
  - `innerHTML`の代わりに`appendSanitizedHTML()`
  - 安全な要素を作成するための`createSafeElement()`
  - テキストコンテンツ用の`setSafeMessage()`
- **外部スクリプト**：`crossorigin="anonymous"`属性は必須です
- **入力検証**：常に外部データをサニタイズします
- **コンテンツセキュリティポリシー**：スクリプトソースを制限するためのCSPヘッダー

**アクセシビリティ**：

- WCAG 2.1 AA準拠
- 完全なキーボードナビゲーション
- 適切なARIAロールとラベル
- 準拠した色のコントラスト

**パフォーマンス**：

- `lazy-loader.js`によるモジュールの遅延読み込み
- CSSの最適化とレスポンシブアセット
- スマートキャッシングのためのサービスワーカー
- 本番環境でのコード分割とミニフィケーション

## 📱 互換性

### サポートされているブラウザ

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### デバイス

- **デスクトップ**：キーボードとマウスのコントロール
- **タブレット**：最適化されたタッチインターフェース
- **スマートフォン**：適応型レスポンシブデザイン

### アクセシビリティ

- 完全なキーボードナビゲーション（Tab、矢印、Esc）
- スクリーンリーダー用のARIAロールとラベル
- 準拠した色のコントラスト
- 支援技術のサポート

## 🌍 ローカリゼーション

完全な多言語サポート：

- **フランス語**（デフォルト言語）
- **英語**
- **スペイン語**

### 翻訳管理

**翻訳ファイル：** `assets/translations/*.json`

**フォーマット：**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n管理スクリプト

**`npm run i18n:verify`** - 翻訳キーの整合性を検証します

**`npm run i18n:unused`** - 未使用の翻訳キーをリストアップします

**`npm run i18n:compare`** - 翻訳ファイルをfr.json（参照）と比較します

このスクリプト（`scripts/compare-translations.cjs`）は、すべての言語ファイルの同期を保証します。

**機能：**

- 不足しているキーの検出（fr.jsonには存在するが他の言語には存在しない）
- 追加のキーの検出（他の言語には存在するがfr.jsonには存在しない）
- 空の値の識別（`""`、`null`、`undefined`、`[]`）
- 型の整合性チェック（文字列対配列）
- ネストされたJSON構造をドット表記にフラット化（例：`arcade.multiMemory.title`）
- 詳細なコンソールレポートの生成
- JSONレポートを`docs/translations-comparison-report.json`に保存

**出力例：**

```
🔍 Analyse comparative des fichiers de traduction

📚 Langue de référence: fr.json
✅ fr.json: 335 clés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de clés: 335
✅ Aucune clé manquante
✅ Aucune clé supplémentaire
✅ Aucune valeur vide

📊 RÉSUMÉ FINAL
  fr.json: 335 clés
  en.json: 335 clés
  es.json: 335 clés

✅ Tous les fichiers de traduction sont parfaitement synchronisés !
```

**翻訳カバレッジ：**

- 完全なユーザーインターフェース
- ゲームの説明
- エラーとフィードバックメッセージ
- 説明とコンテキストヘルプ
- アドベンチャーモードの物語コンテンツ
- アクセシビリティとARIAラベル

## 📊 データストレージ

### ユーザーデータ

- プロファイルと設定
- ゲームモードごとの進行状況
- アーケードゲームのスコアと統計
- カスタマイズ設定

### 技術的特徴

- フォールバック付きのローカルストレージ（localStorage）
- ユーザーごとのデータ分離
- 自動進行状況保存
- 古いデータの自動移行

## 🐛 問題の報告

問題はGitHubの問題を介して報告できます。以下を含めてください：

- 問題の詳細な説明
- 再現する手順
- ブラウザとバージョン
- 関連する場合はスクリーンショット

## 💝 プロジェクトをサポートする

**[☕ PayPal経由で寄付する](https://paypal.me/jls)**

## 📄 ライセンス

このプロジェクトはAGPL v3ライセンスの下でライセンスされています。詳細については、`LICENSE`ファイルを参照してください。

---

_LeapMultix - 九九を学ぶための最新の教育アプリケーション_

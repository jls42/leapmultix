<details>
<summary>このドキュメントは他の言語でも利用可能です</summary>

- [Français](./README.md)
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
- [한국어](./README.ko.md)

</details>

# LeapMultix

<!-- バッジ (GitHub移行後に <owner>/<repo> を更新) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![ライセンス: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## 目次

- [説明](#説明)
- [機能](#-機能)
- [クイックスタート](#-クイックスタート)
- [アーキテクチャ](#-アーキテクチャ)
- [詳細なゲームモード](#-詳細なゲームモード)
- [開発](#-開発)
- [互換性](#-互換性)
- [ローカリゼーション](#-ローカリゼーション)
- [データ保存](#-データ保存)
- [問題を報告する](#-問題を報告する)
- [ライセンス](#-ライセンス)

## 説明

LeapMultixは、子供たち（8〜12歳）が4つの算術演算（掛け算（×）、足し算（+）、引き算（−）、割り算（÷））を習得するために設計された、最新のインタラクティブな教育Webアプリケーションです。このアプリは、直感的でアクセシブルな多言語インターフェースで、**5つのゲームモード**と**4つのアーケードミニゲーム**を提供します。

**多重演算サポート:** クイズモードとチャレンジモードでは、すべての演算を練習できます。発見モード、アドベンチャーモード、アーケードモードは掛け算に焦点を当てています。

**開発者:** Julien LS (contact@jls42.org)

**オンラインURL:** https://leapmultix.jls42.org/

## ✨ 機能

### 🎮 ゲームモード

- **発見モード**: 九九の視覚的かつインタラクティブな探索
- **クイズモード** ⭐: 4つの演算（×、+、−、÷）をサポートする多肢選択問題と適応型進行
- **チャレンジモード** ⭐: 4つの演算（×、+、−、÷）とさまざまな難易度レベルでのタイムアタックレース
- **アドベンチャーモード**: インタラクティブマップを使用したレベルごとの物語の進行（掛け算）

⭐ = 4つの算術演算すべての完全なサポート

### 🕹️ アーケードミニゲーム

- **MultiInvaders**: 教育的スペースインベーダー - 間違った答えを破壊する（掛け算）
- **MultiMiam**: 数学的パックマン - 正しい答えを集める（掛け算）
- **MultiMemory**: 神経衰弱 - 掛け算とその結果を一致させる
- **MultiSnake**: 教育的スネークゲーム - 正しい数字を食べて成長する（掛け算）

### ➕ 多重演算サポート

LeapMultixは、単なる掛け算を超えて、4つの算術演算の完全なトレーニングを提供します。

| モード         | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| クイズ         | ✅  | ✅  | ✅  | ✅  |
| チャレンジ     | ✅  | ✅  | ✅  | ✅  |
| 発見           | ✅  | ❌  | ❌  | ❌  |
| アドベンチャー | ✅  | ❌  | ❌  | ❌  |
| アーケード     | ✅  | ❌  | ❌  | ❌  |

**注:** 発見、アドベンチャー、アーケードモードの演算サポートは、将来のバージョンで計画されています。

### 🌍 横断的な機能

- **マルチユーザー**: 保存された進行状況を持つ個々のプロファイルの管理
- **多言語**: フランス語、英語、スペイン語のサポート
- **カスタマイズ**: アバター、カラーテーマ、背景
- **アクセシビリティ**: キーボードナビゲーション、タッチサポート、WCAG 2.1 AA準拠
- **モバイルレスポンシブ**: タブレットやスマートフォン向けに最適化されたインターフェース
- **進行システム**: スコア、バッジ、デイリーチャレンジ

## 🚀 クイックスタート

### 前提条件

- Node.js (バージョン16以上)
- 最新のWebブラウザ

### インストール

```bash
# プロジェクトのクローン
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# 依存関係のインストール
npm install

# 開発サーバーの起動 (オプション 1)
npm run serve
# アプリケーションは http://localhost:8080 (または次に利用可能なポート) でアクセス可能になります

# またはPythonを使用 (オプション 2)
python3 -m http.server 8000
# アプリケーションは http://localhost:8000 でアクセス可能になります
```

### 利用可能なスクリプト

```bash
# 開発
npm run serve          # ローカルサーバー (http://localhost:8080)
npm run lint           # ESLintによるコードチェック
npm run lint:fix       # ESLintの問題を自動修正
npm run format:check   # コードフォーマットの確認 (コミット前に必ず実行)
npm run format         # Prettierによるコードフォーマット
npm run verify         # クオリティゲート: lint + test + coverage

# テスト
npm run test           # すべてのテストを実行 (CJS)
npm run test:watch     # ウォッチモードでのテスト
npm run test:coverage  # カバレッジレポート付きテスト
npm run test:core      # コアモジュールのテストのみ
npm run test:integration # 統合テスト
npm run test:storage   # ストレージシステムのテスト
npm run test:esm       # ESMテスト (tests-esm/ フォルダー, Jest vm-modules)
npm run test:verbose   # 詳細出力付きテスト
npm run test:pwa-offline # PWAオフラインテスト (Puppeteerが必要), `npm run serve` の後に実行

# 分析とメンテナンス
npm run analyze:jsdoc  # ドキュメント分析
npm run improve:jsdoc  # JSDocの自動改善
npm run audit:mobile   # モバイルレスポンシブテスト
npm run audit:accessibility # アクセシビリティテスト
npm run dead-code      # 未使用コードの検出
npm run analyze:globals # グローバル変数の分析
npm run analyze:dependencies # 依存関係の使用状況分析
npm run verify:cleanup # 複合分析 (デッドコード + グローバル)

# アセット管理
npm run assets:generate    # レスポンシブ画像の生成
npm run assets:backgrounds # 背景をWebPに変換
npm run assets:analyze     # レスポンシブアセットの分析
npm run assets:diff        # アセットの比較

# 国際化
npm run i18n:verify    # 翻訳キーの一貫性を確認
npm run i18n:unused    # 未使用の翻訳キーをリストアップ
npm run i18n:compare   # 翻訳 (en/es) を fr.json (参照) と比較

# ビルドと配信
npm run build          # 本番ビルド (Rollup) + ポストビルド (完全な dist/)
npm run serve:dist     # http://localhost:5000 (または利用可能なポート) で dist/ を提供

# PWAとサービスワーカー
npm run sw:disable     # サービスワーカーを無効化
npm run sw:fix         # サービスワーカーの問題を修正
```

## 🏗️ アーキテクチャ

### ファイル構造

```
leapmultix/
├── index.html              # メインエントリーポイント
├── js/
│   ├── core/               # コアES6モジュール
│   │   ├── GameMode.js     # モードの基本クラス
│   │   ├── GameModeManager.js # ゲームモード管理
│   │   ├── storage.js      # LocalStorage API
│   │   ├── audio.js        # 音声管理
│   │   ├── utils.js        # 汎用ユーティリティ (正規ソース)
│   │   ├── eventBus.js     # イベント通信
│   │   ├── userState.js    # ユーザーセッション管理
│   │   ├── mainInit.js     # DOM準備完了時の初期化
│   │   ├── theme.js        # テーマシステム
│   │   ├── userUi.js       # ユーザーインターフェースユーティリティ
│   │   ├── parental.js     # ペアレンタルコントロール
│   │   ├── adventure-data.js # アドベンチャーモードデータ
│   │   ├── mult-stats.js   # 掛け算の統計
│   │   ├── challenge-stats.js # チャレンジの統計
│   │   └── daily-challenge.js # デイリーチャレンジ管理
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
│   │   ├── arcade-invasion.js # スペースインベーダー (31 KB)
│   │   ├── arcade-multimemory.js # 神経衰弱 (31 KB)
│   │   ├── arcade-multimiam.js # Multimiam統合
│   │   ├── arcade-multisnake.js # Snake統合
│   │   ├── arcade-common.js, arcade-utils.js # 共有ユーティリティ
│   │   ├── arcade-message.js, arcade-points.js # UIコンポーネント
│   │   └── arcade-scores.js # スコア管理
│   ├── multimiam/          # パックマンゲーム (分解されたアーキテクチャ)
│   │   ├── multimiam.js    # メインコントローラー
│   │   ├── multimiam-engine.js # ゲームエンジン (15 KB)
│   │   ├── multimiam-renderer.js # レンダリングシステム (9 KB)
│   │   ├── multimiam-controls.js # コントロール管理 (7 KB)
│   │   ├── multimiam-questions.js # 質問生成 (6 KB)
│   │   └── multimiam-ui.js # インターフェース要素
│   ├── multisnake.js       # Snakeゲーム (38 KB)
│   ├── navigation/         # ナビゲーションシステム
│   │   ├── slides.js       # スライドベースのナビゲーション (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # キーボードサポート
│   ├── ui/                 # ユーザーインターフェースとフィードバック
│   │   ├── uiUtils.js      # インターフェースユーティリティ
│   │   ├── ui-feedback.js  # フィードバックメカニズム
│   │   ├── touch-support.js # タッチサポート (7 KB)
│   │   ├── virtual-keyboard.js # 仮想キーボード
│   │   ├── coin-display.js, coin-effects.js # 通貨システム
│   │   ├── notifications.js # 通知システム
│   │   └── badges.js       # バッジシステム
│   ├── media/              # メディア管理
│   │   ├── VideoManager.js # 動画再生管理 (12 KB)
│   │   └── responsive-image-loader.js # 画像読み込み (9 KB)
│   ├── orchestration/      # オーケストレーションと読み込み
│   │   ├── mode-orchestrator.js # モード切り替え
│   │   ├── lazy-loader.js  # 動的読み込み (10 KB)
│   │   └── game-cleanup.js # 状態クリーンアップ
│   ├── utils/              # ユーティリティ
│   │   ├── utils-es6.js    # メインアグリゲーター (5 KB)
│   │   ├── main-helpers.js # アプリケーションヘルパー
│   │   ├── helpers.js      # レガシーヘルパー関数
│   │   ├── stats-utils.js  # 統計ユーティリティ
│   │   ├── difficulty.js   # 難易度管理
│   │   └── questionGenerator.js # 質問生成
│   ├── storage/            # ストレージと状態
│   │   ├── storage.js      # レガシーストレージラッパー
│   │   └── userManager.js  # マルチユーザー管理 (19 KB)
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
│   │   ├── plausible-init.js # Plausibleアナリティクス
│   │   ├── cache-updater.js # キャッシュ管理 (10 KB)
│   │   └── imports.js      # インポートユーティリティ
│   ├── main-es6.js         # ES6エントリーポイント
│   ├── main.js             # メインオーケストレーター
│   ├── bootstrap.js        # ES6イベントハンドラー設定
│   └── game.js             # 状態管理とデイリーチャレンジ
├── css/                    # モジュラースタイル
├── assets/                 # リソース
│   ├── images/             # 画像とスプライト
│   ├── generated-images/   # 生成されたレスポンシブ画像
│   ├── sounds/             # 効果音
│   ├── translations/       # 翻訳ファイル (fr, en, es)
│   └── videos/             # チュートリアル動画
├── tests/                  # 自動テスト
│   ├── __tests__/          # ユニットテストと統合テスト
│   └── tests-esm/          # ESMテスト (.mjs)
├── scripts/                # メンテナンススクリプト
│   ├── compare-translations.cjs # 翻訳比較
│   └── cleanup-i18n-keys.cjs # i18nキーのクリーンアップ
└── dist/                   # 本番ビルド (生成済み)
```

### 技術アーキテクチャ

**モダンES6モジュール**: プロジェクトは、ES6クラスとネイティブのインポート/エクスポートを備えたモジュラーアーキテクチャを使用しています。

**再利用可能なコンポーネント**: 集中管理されたUIコンポーネント（TopBar、InfoBar、Dashboard、Customization）で構築されたインターフェース。

**遅延読み込み (Lazy Loading)**: `lazy-loader.js` を介してモジュールをオンデマンドでインテリジェントに読み込み、初期パフォーマンスを最適化します。

**統一ストレージシステム**: フォールバックを備えたLocalStorageを介したユーザーデータの永続性のための集中API。

**集中オーディオ管理**: 多言語サポートとユーザーごとの設定を備えたサウンドコントロール。

**イベントバス**: メンテナンス可能なアーキテクチャのために、コンポーネント間の疎結合なイベントベースの通信。

**スライドナビゲーション**: `goToSlide()` を使用した番号付きスライド（slide0、slide1など）に基づくナビゲーションシステム。

**セキュリティ**: すべてのDOM操作に対する `security-utils.js` を介したXSS保護とサニタイズ。

## 🎯 詳細なゲームモード

### 発見モード

以下の機能を備えた九九の視覚的探索インターフェース:

- インタラクティブな掛け算の視覚化
- アニメーションと記憶補助
- 教育的なドラッグアンドドロップ
- テーブルごとの自由な進行

### クイズモード

以下の機能を備えた多肢選択問題:

- セッションごとに10問
- 成功に基づいた適応型進行
- 仮想テンキー
- ストリークシステム（正解の連続）

### チャレンジモード

以下の機能を備えたタイムアタックレース:

- 3つの難易度レベル（初級、中級、上級）
- 正解に対する時間ボーナス
- ライフシステム
- ハイスコアランキング

### アドベンチャーモード

以下の機能を備えた物語の進行:

- 12のロック解除可能なテーマレベル
- 視覚的な進行状況を示すインタラクティブマップ
- キャラクターが登場する没入型ストーリー
- 星と報酬のシステム

### アーケードミニゲーム

各ミニゲームは以下を提供します:

- 難易度の選択とカスタマイズ
- ライフとスコアシステム
- キーボードとタッチコントロール
- ユーザーごとの個別ランキング

## 🛠️ 開発

### 開発ワークフロー

**重要: mainに直接コミットしないでください**

プロジェクトは、機能ブランチベースのワークフローを使用しています:

1. **ブランチの作成**:

   ```bash
   git checkout -b feat/機能名
   # または
   git checkout -b fix/バグ名
   ```

2. **開発とテスト**:

   ```bash
   npm run format:check  # 必ず最初にフォーマットを確認してください
   npm run format        # 必要に応じてフォーマット
   npm run lint          # コード品質を確認
   npm run test          # テストを実行
   npm run test:coverage # カバレッジを確認
   ```

3. **ブランチでのコミット**:

   ```bash
   git add .
   git commit -m "feat: 機能の説明"
   ```

4. **プッシュとプルリクエストの作成**:
   ```bash
   git push -u origin feat/機能名
   ```

**コミットスタイル**: 簡潔な命令形（例: "Fix arcade init errors", "Refactor cache updater"）

**クオリティゲート**: 各コミットの前に `npm run lint`、`npm test`、`npm run test:coverage` が通過することを確認してください。

### コンポーネントアーキテクチャ

**GameMode (基本クラス)**: すべてのモードは、標準化されたメソッドを持つ共通クラスを継承します。

**GameModeManager**: モードの起動と管理の集中オーケストレーション。

**UIコンポーネント**: TopBar、InfoBar、Dashboard、Customizationは、一貫したインターフェースを提供します。

**遅延読み込み**: モジュールは、初期パフォーマンスを最適化するためにオンデマンドで読み込まれます。

**イベントバス**: イベントシステムを介したコンポーネント間の疎結合通信。

### テスト

プロジェクトには包括的なテストスイートが含まれています:

- コアモジュールのユニットテスト
- コンポーネントの統合テスト
- ゲームモードのテスト
- 自動化されたコードカバレッジ

```bash
npm test              # すべてのテスト (CJS)
npm test:core         # コアモジュールのテスト
npm test:integration  # 統合テスト
npm test:coverage     # カバレッジレポート
npm run test:esm      # vm-modulesを介したESMテスト (例: components/dashboard)
```

### 本番ビルド

- **Rollup**: コード分割とソースマップを使用して `js/main-es6.js` をESMにバンドルします
- **Terser**: 最適化のための自動ミニファイ
- **ポストビルド**: `css/` と `assets/`、ファビコン (`favicon.ico`, `favicon.png`, `favicon.svg`)、`sw.js` をコピーし、ハッシュ化されたエントリーファイル (例: `main-es6-*.js`) に向けて `dist/index.html` を書き換えます
- **最終フォルダー**: 静的に提供する準備ができた `dist/`

```bash
npm run build      # dist/ を生成
npm run serve:dist # dist/ を提供 (ポート 5000)
```

### 継続的インテグレーション (CI)

**GitHub Actions**: `.github/workflows/ci.yml` 内の自動化されたパイプライン

CI/CDパイプラインは、プッシュおよびプルリクエストごとに自動的に実行されます:

**主要ジョブ**:

1. **build-test**: メイン検証ジョブ
   - 依存関係のインストール: `npm ci`
   - フォーマット確認: `npm run format:check`
   - 静的分析: `npm run lint`
   - ユニットテスト: `npm run test`
   - セキュリティ監査: `npm audit`
   - カバレッジアーティファクトの生成

2. **accessibility**: アクセシビリティ監査 (ノンブロッキング)
   - `npm run audit:accessibility` を実行
   - WCAG 2.1 AA アクセシビリティレポートを生成

3. **test-esm**: ES6モジュールテスト
   - Jest VM modules で `npm run test:esm` を実行
   - ES6 インポート/エクスポートを検証

4. **lighthouse**: パフォーマンス監査 (ノンブロッキング)
   - モバイルパフォーマンス監査
   - Lighthouseレポートアーティファクトの生成
   - Core Web Vitals メトリクス

**品質バッジ**:

- CIビルドステータス (GitHub Actions)
- CodeFactorグレード
- Codacyバッジ
- SonarCloudクオリティゲート

### PWA (プログレッシブウェブアプリ)

LeapMultixは、オフラインサポートとインストール機能を備えた完全なPWAです。

**サービスワーカー** (`sw.js`):

- ナビゲーション: `offline.html` へのオフラインフォールバックを備えたネットワークファースト
- 画像: パフォーマンスを最適化するためのキャッシュファースト
- 翻訳: バックグラウンド更新のためのStale-while-revalidate
- JS/CSS: 常に最新バージョンを提供するためのネットワークファースト
- `cache-updater.js` による自動バージョン管理

**マニフェスト** (`manifest.json`):

- すべてのデバイス用のSVGおよびPNGアイコン
- モバイルでのインストール可能（ホーム画面に追加）
- アプリのような体験のためのスタンドアロン構成
- テーマと色のサポート

**オフラインモードをローカルでテストする**:

1. 開発サーバーを起動:

   ```bash
   npm run serve
   ```

   `http://localhost:8080` (または表示されたポート) を開く

2. 手動テスト:
   - DevToolsでネットワークを切断 (Networkタブ → Offline)
   - ページを更新 → `offline.html` が表示される

3. 自動テスト (Puppeteerが必要):
   ```bash
   npm run test:pwa-offline
   ```

**サービスワーカー管理スクリプト**:

```bash
npm run sw:disable  # サービスワーカーを無効化
npm run sw:fix      # キャッシュの問題を修正
```

### 品質基準

**コード品質ツール**:

- **ESLint**: フラット設定 (`eslint.config.js`) を備えた最新構成、ES2022サポート
- **Prettier**: 自動コードフォーマット (`.prettierrc`)
- **Stylelint**: CSS検証 (`.stylelintrc.json`)
- **JSDoc**: カバレッジ分析を備えた自動関数ドキュメント

**重要なコードルール**:

- 未使用の変数とパラメータを削除 (`no-unused-vars`)
- 特定のエラー処理を使用（空のcatchブロックなし）
- `innerHTML` を避けて `security-utils.js` 関数を使用
- 関数の認知的複雑度を15未満に保つ
- 複雑な関数をより小さなヘルパーに抽出

**セキュリティ**:

- **XSS保護**: `security-utils.js` 関数を使用:
  - `innerHTML` の代わりに `appendSanitizedHTML()`
  - 安全な要素作成のための `createSafeElement()`
  - テキストコンテンツのための `setSafeMessage()`
- **外部スクリプト**: `crossorigin="anonymous"` 属性が必須
- **入力検証**: 常に外部データをサニタイズ
- **コンテンツセキュリティポリシー**: スクリプトソースを制限するためのCSPヘッダー

**アクセシビリティ**:

- WCAG 2.1 AA準拠
- 完全なキーボードナビゲーション
- ARIAロールと適切なラベル
- 準拠した色のコントラスト

**パフォーマンス**:

- `lazy-loader.js` によるモジュールの遅延読み込み
- CSSとレスポンシブアセットの最適化
- インテリジェントなキャッシュのためのサービスワーカー
- 本番環境でのコード分割とミニファイ

## 📱 互換性

### サポートされているブラウザ

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### デバイス

- **デスクトップ**: キーボードとマウスによる操作
- **タブレット**: 最適化されたタッチインターフェース
- **スマートフォン**: 適応型レスポンシブデザイン

### アクセシビリティ

- 完全なキーボードナビゲーション (Tab, 矢印, Esc)
- スクリーンリーダー用のARIAロールとラベル
- 準拠した色のコントラスト
- 支援技術のサポート

## 🌍 ローカリゼーション

完全な多言語サポート:

- **フランス語** (デフォルト言語)
- **英語**
- **スペイン語**

### 翻訳管理

**翻訳ファイル:** `assets/translations/*.json`

**形式:**

```json
{
  "menu_start": "開始",
  "quiz_correct": "よくできました！",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n管理スクリプト

**`npm run i18n:verify`** - 翻訳キーの一貫性を検証

**`npm run i18n:unused`** - 未使用の翻訳キーをリストアップ

**`npm run i18n:compare`** - 翻訳ファイルをfr.json (参照) と比較

このスクリプト (`scripts/compare-translations.cjs`) は、すべての言語ファイルの同期を保証します:

**機能:**

- 欠落しているキーの検出（fr.jsonには存在するが、他の言語には存在しない）
- 余分なキーの検出（他の言語には存在するが、fr.jsonには存在しない）
- 空の値の識別 (`""`, `null`, `undefined`, `[]`)
- 型の一貫性チェック（文字列 vs 配列）
- ネストされたJSON構造のドット表記への平坦化（例: `arcade.multiMemory.title`）
- 詳細なコンソールレポートの生成
- JSONレポートを `docs/translations-comparison-report.json` に保存

**出力例:**

```
🔍 翻訳ファイルの比較分析

📚 参照言語: fr.json
✅ fr.json: 335 キー

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 en.json の分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 総キー数: 335
✅ 欠落しているキーなし
✅ 余分なキーなし
✅ 空の値なし

📊 最終概要
  fr.json: 335 キー
  en.json: 335 キー
  es.json: 335 キー

✅ すべての翻訳ファイルは完全に同期されています！
```

**翻訳カバレッジ:**

- 完全なユーザーインターフェース
- ゲームの指示
- エラーおよびフィードバックメッセージ
- 説明とコンテキストヘルプ
- アドベンチャーモードの物語コンテンツ
- アクセシビリティラベルとARIA

## 📊 データ保存

### ユーザーデータ

- プロファイルと設定
- ゲームモードごとの進行状況
- アーケードゲームのスコアと統計
- カスタマイズ設定

### 技術的機能

- フォールバック付きのローカルストレージ (localStorage)
- ユーザーごとのデータ分離
- 進行状況の自動保存
- 古いデータの自動移行

## 🐛 問題を報告する

問題はGitHubのissueを通じて報告できます。以下を含めてください:

- 問題の詳細な説明
- 再現手順
- ブラウザとバージョン
- 関連する場合はスクリーンショット

## 💝 プロジェクトを支援する

**[☕ PayPal経由で寄付する](https://paypal.me/jls)**

## 📄 ライセンス

このプロジェクトはAGPL v3の下でライセンスされています。詳細については、`LICENSE` ファイルを参照してください。

---

_LeapMultix - 九九を学ぶための最新の教育アプリケーション_

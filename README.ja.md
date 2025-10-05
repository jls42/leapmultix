<details>
<summary>このドキュメントは他の言語でも利用できます</summary>

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

LeapMultixは、子供（8〜12歳）が九九をマスターするための、現代的でインタラクティブな教育用Webアプリケーションです。このアプリケーションは、直感的でアクセスしやすく、多言語対応のインターフェースで、**4つのクラシックなゲームモード**と**4つのアーケードミニゲーム**を提供します。

**開発者：** Julien LS (contact@jls42.org)

**オンラインURL：** https://leapmultix.jls42.org/

## ✨ 機能

### 🎮 ゲームモード

- **発見モード**：九九の視覚的でインタラクティブな探求。
- **クイズモード**：適応的な進行を備えた多肢選択問題。
- **チャレンジモード**：さまざまな難易度レベルでのタイムトライアル。
- **アドベンチャーモード**：インタラクティブなマップを備えたレベルごとの物語的な進行。

### 🕹️ アーケードミニゲーム

- **MultiInvaders**：教育的なスペースインベーダー - 間違った答えを破壊します。
- **MultiMiam**：数学的なパックマン - 正しい答えを集めます。
- **MultiMemory**：記憶ゲーム - 掛け算と答えを一致させます。
- **MultiSnake**：教育的なスネーク - 正しい数字を食べて成長します。

### 🌍 横断的な機能

- **マルチユーザー**：保存された進行状況を持つ個別のプロファイルの管理。
- **多言語**：フランス語、英語、スペイン語のサポート。
- **カスタマイズ**：アバター、カラーテーマ、背景。
- **アクセシビリティ**：キーボードナビゲーション、タッチサポート、WCAG 2.1 AA準拠。
- **モバイルレスポンシブ**：タブレットとスマートフォンに最適化されたインターフェース。
- **プログレッションシステム**：スコア、バッジ、デイリーチャレンジ。

## 🚀 クイックスタート

### 前提条件

- Node.js（バージョン16以降）
- 最新のWebブラウザ

### インストール

```bash
# プロジェクトをクローンする
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# 依存関係をインストールする
npm install

# 開発サーバーを起動する（オプション1）
npm run serve
# アプリケーションは http://localhost:8080（または次の利用可能なポート）でアクセスできます

# またはPythonを使用する（オプション2）
python3 -m http.server 8000
# アプリケーションは http://localhost:8000 でアクセスできます
```

### 利用可能なスクリプト

```bash
# 開発
npm run serve          # ローカルサーバー
npm run lint           # コードのリンティング
npm run test           # すべてのテストを実行（CJS）
npm run test:coverage  # カバレッジ付きのテスト
npm run test:esm       # ESMテスト（tests-esm/フォルダー、Jest vm-modules）
npm run test:pwa-offline # PWAオフラインテスト（Puppeteerが必要）、`npm run serve`の後

# 分析とメンテナンス
npm run analyze:jsdoc  # ドキュメント分析
npm run improve:jsdoc  # JSDocの自動改善
npm run audit:mobile   # モバイルレスポンシブテスト
npm run audit:accessibility # アクセシビリティテスト
npm run dead-code      # 未使用コードの検出
npm run analyze:globals # グローバル変数の分析
npm run analyze:dependencies # 依存関係の使用状況分析
npm run assets:analyze # レスポンシブアセットの分析
npm run assets:diff    # アセットの比較

# ビルドと配信
npm run build          # 本番ビルド（Rollup）+ ポストビルド（完全なdist/）
npm run serve:dist     # dist/をhttp://localhost:5000（または利用可能なポート）で提供
```

## 🏗️ アーキテクチャ

### ファイル構造

```
leapmultix/
├── index.html              # メインエントリポイント
├── js/
│   ├── core/               # コアES6モジュール
│   │   ├── GameMode.js     # ゲームモードの基本クラス
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # ストレージAPI
│   │   ├── audio.js        # サウンド管理
│   │   └── utils.js        # 汎用ユーティリティ
│   ├── components/         # 再利用可能なUIコンポーネント
│   │   ├── topBar.js       # ナビゲーションバー
│   │   ├── infoBar.js      # ゲーム情報バー
│   │   ├── dashboard.js    # ユーザーダッシュボード
│   │   └── customization.js # カスタマイズインターフェース
│   ├── modes/              # リファクタリングされたゲームモード
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # アーケードミニゲーム
│   ├── multimiam-*.js      # パックマンゲームモジュール
│   ├── multisnake.js       # 教育的なスネークゲーム
│   ├── main-es6.js         # ES6エントリポイント
│   ├── main.js             # メインオーケストレーター
│   ├── lazy-loader.js      # オンデマンド読み込み
│   └── utils-es6.js        # ES6ユーティリティ
├── css/                    # モジュラースタイル
├── assets/                 # リソース
│   ├── images/             # 画像とスプライト
│   ├── sounds/             # 効果音
│   ├── translations/       # 翻訳ファイル
│   └── videos/             # チュートリアルビデオ
└── tests/                  # 自動テスト
```

### 技術アーキテクチャ

**モダンES6モジュール**：プロジェクトは、ES6クラスとネイティブのインポート/エクスポートを使用したモジュラーアーキテクチャを採用しています。

**再利用可能なコンポーネント**：インターフェースは、集中管理されたUIコンポーネント（TopBar、InfoBar、Dashboard）で構築されています。

**遅延読み込み**：パフォーマンスを最適化するために、モジュールをオンデマンドでスマートに読み込みます。

**統一ストレージシステム**：ユーザーデータの永続化のための中央集権化されたAPI。

**集中オーディオ管理**：多言語サポートとユーザーごとの設定を備えたサウンドコントロール。

## 🎯 詳細なゲームモード

### 発見モード

九九の視覚的な探索インターフェース：

- 掛け算のインタラクティブな視覚化
- アニメーションと記憶補助
- 教育的なドラッグアンドドロップ
- テーブルごとの自由な進行

### クイズモード

多肢選択問題：

- セッションごとに10問
- 成功に基づいた適応的な進行
- 仮想テンキー
- ストリークシステム（連続正解）

### チャレンジモード

タイムトライアル：

- 3つの難易度レベル（初級、中級、上級）
- 正解に対する時間ボーナス
- ライフシステム
- ハイスコアリーダーボード

### アドベンチャーモード

物語的な進行：

- 12のアンロック可能なテーマ別レベル
- 視覚的な進行を示すインタラクティブなマップ
- キャラクターとの没入型ストーリー
- スターと報酬システム

### アーケードミニゲーム

各ミニゲームが提供するもの：

- 難易度とカスタマイズの選択
- ライフとスコアシステム
- キーボードとタッチコントロール
- ユーザーごとの個別リーダーボード

## 🛠️ 開発

### コンポーネントアーキテクチャ

**GameMode（基本クラス）**：すべてのモードは、標準化されたメソッドを持つ共通のクラスを継承します。

**GameModeManager**：モードの起動と管理のための中央集権化されたオーケストレーション。

**UIコンポーネント**：TopBar、InfoBar、Dashboard、Customizationが一貫したインターフェースを提供します。

**遅延読み込み**：初期パフォーマンスを最適化するために、モジュールはオンデマンドで読み込まれます。

### テスト

プロジェクトには包括的なテストスイートが含まれています：

- コアモジュールの単体テスト
- コンポーネントの統合テスト
- ゲームモードテスト
- 自動化されたコードカバレッジ

```bash
npm test              # すべてのテスト（CJS）
npm test:core         # コアモジュールテスト
npm test:integration  # 統合テスト
npm test:coverage     # カバレッジレポート
npm run test:esm      # ESMテスト（例：components/dashboard）vm-modules経由
```

### 本番ビルド

- **Rollup**：`js/main-es6.js`をコード分割とソースマップ付きでESMにバンドルします。
- **Terser**：最適化のための自動圧縮。
- **ポストビルド**：`css/`と`assets/`、ファビコン（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js`をコピーし、`dist/index.html`をハッシュ化されたエントリファイル（例：`main-es6-*.js`）を指すように書き換えます。
- **最終フォルダー**：`dist/`は静的に提供される準備ができています。

```bash
npm run build      # dist/を生成
npm run serve:dist # dist/を提供（ポート5000）
```

### 継続的インテグレーション

**GitHub Actions**：`.github/workflows/ci.yml`

- **build-test**：`npm ci`、`lint`、`test`、`audit` + カバレッジアーティファクト。
- **accessibility**：`npm run audit:accessibility`（非ブロッキング）。
- **test-esm**：VMモジュールを使用した`npm run test:esm`。
- **lighthouse**：モバイルパフォーマンス監査（非ブロッキング）、アーティファクトとしてのレポート。

### PWA（オフラインとインストール）

- **Service Worker**：オフラインフォールバック付きのネットワークファースト戦略。キャッシュファースト戦略の画像。stale-while-revalidateの翻訳。ネットワークファーストのJS/CSS。
- **Manifest**：SVG/PNGアイコン。モバイルでのインストールが可能。
- **ローカルでのオフラインテスト**：
  1. `npm run serve`を実行し、`http://localhost:8080`（または表示されたポート）を開きます。
  2. ネットワークを切断してページを更新すると、`offline.html`が表示されます。
  3. 自動テスト（Puppeteerが必要）：`npm run test:pwa-offline`。

### 品質基準

- **ESLint**：JavaScriptコードの検証。
- **Prettier**：自動フォーマット。
- **JSDoc**：関数の自動ドキュメント化。
- **アクセシビリティ**：WCAG 2.1 AA準拠。
- **パフォーマンス**：遅延読み込み、CSS最適化。

## 📱 互換性

### サポートされているブラウザ

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### デバイス

- **デスクトップ**：キーボードとマウスのコントロール。
- **タブレット**：最適化されたタッチインターフェース。
- **スマートフォン**：適応型レスポンシブデザイン。

### アクセシビリティ

- 完全なキーボードナビゲーション（Tab、矢印、Esc）。
- スクリーンリーダー用のARIAロールとラベル。
- 準拠したカラーコントラスト。
- 支援技術のサポート。

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
  "menu_start": "開始",
  "quiz_correct": "よくできました！",
  "arcade_invasion_title": "MultiInvaders"
}
```

**管理スクリプト：**

```bash
npm run i18n:verify  # 不足/不整合なキーを確認
npm run i18n:unused  # 未使用のキーをリストアップ
```

**翻訳カバレッジ：**

- 完全なユーザーインターフェース
- ゲームの説明
- エラーとフィードバックメッセージ
- 説明と文脈ヘルプ

## 📊 データストレージ

### ユーザーデータ

- プロファイルと設定
- ゲームモードごとの進行状況
- アーケードゲームのスコアと統計
- カスタマイズ設定

### 技術的特徴

- フォールバック付きのローカルストレージ（localStorage）。
- ユーザーごとのデータ分離。
- 自動進行状況保存。
- 古いデータの自動移行。

## 🐛 問題の報告

問題はGitHubのissueで報告できます。以下を含めてください：

- 問題の詳細な説明。
- 再現手順。
- ブラウザとバージョン。
- 関連する場合のスクリーンショット。

## 💝 プロジェクトをサポート

**[☕ PayPalで寄付する](https://paypal.me/jls)**

## 📄 ライセンス

このプロジェクトはAGPL v3ライセンスの下でライセンスされています。詳細については、`LICENSE`ファイルを参照してください。

---

_LeapMultix - 九九を学ぶための現代的な教育アプリケーション。_

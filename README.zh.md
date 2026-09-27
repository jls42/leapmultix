<details>
<summary>本文档还提供其他语言版本</summary>

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
![许可证：AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy 徽章](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![质量阈状态](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![可靠性评级](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![安全性评级](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![可维护性评级](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![技术债务](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Bug](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![漏洞](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![代码异味](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![重复行 (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![代码行数](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## 目录

- [描述](#描述)
- [概览](#-概览)
- [功能特性](#-功能特性)
- [快速入门](#-快速入门)
- [架构](#-架构)
- [详细游戏模式](#-详细游戏模式)
- [开发](#-开发)
- [兼容性](#-兼容性)
- [本地化](#-本地化)
- [录制语音](#-录制语音)
- [数据存储](#-数据存储)
- [报告问题](#-问题反馈)
- [许可证](#-许可证)

## 描述

LeapMultix 是一款面向 6 至 12 岁儿童的交互式教育 Web 应用程序，帮助他们掌握 4 种算术运算：乘法（×）、加法（+）、减法（−）和除法（÷）。它在直观、易用且多语言的界面中提供了 **5 种游戏模式** 和 **4 款街机小游戏**。

**多运算支持：** 五种模式均支持这四种运算。在主屏幕上进行选择，并贯穿整个游戏流程。

**开发者：** Julien LS (contact@jls42.org)

**在线网址：** https://leapmultix.jls42.org/

## 📸 概览

### 游戏界面

|                                                                        |                                                                              |
| :--------------------------------------------------------------------: | :--------------------------------------------------------------------------: |
|      ![“谁在玩？”屏幕：选择个人档案](docs/media/01-accueil.webp)       |          ![主菜单：选择运算类型和五种模式](docs/media/02-menu.webp)          |
|         **谁在玩？** —— 每个孩子一个专属档案，包含头像和进度。         |               **菜单** —— 在此选择运算类型，随后解锁五种模式。               |
|   ![探索模式：用点阵展示 4 的乘法表](docs/media/03-decouverte.webp)    | ![测验模式：错误答案显示为红色，正确答案显示为绿色](docs/media/04-quiz.webp) |
| **探索** —— 每个算式以点阵、跳跃或数数的形式展示，并附带乘法表小技巧。 |       **测验** —— 孩子的选项会保留显示在正确答案旁，并有详细计算说明。       |
|         ![挑战模式：倒计时与当前连胜](docs/media/05-defi.webp)         |   ![冒险模式：十个关卡的地图，后续关卡已锁定](docs/media/06-aventure.webp)   |
|      **挑战** —— 争分夺秒。出错时，计时器会暂停以便查看正确答案。      |                     **冒险** —— 凭星星依次解锁十个关卡。                     |
|           ![街机菜单：四款小游戏](docs/media/07-arcade.webp)           |   ![仪表盘：各运算表星星数与统计数据](docs/media/08-tableau-de-bord.webp)    |
|            **街机** —— 四款小游戏，支持难度调节与飞船选择。            |               **仪表盘** —— 各表星星、需复习的表、各模式得分。               |
| ![个性化：头像、主题、无障碍功能](docs/media/09-personnalisation.webp) |                                                                              |
|     **个性化** —— 头像、色彩主题、字体大小、高对比度、家长控制码。     |                                                                              |

### 街机小游戏

四款游戏提出相同的问题 —— 显示在游戏区域上方，并附有剩余时间和生命值 —— 但每次都需要不同的操作方式。

|                                                                                        |                                                                                  |
| :------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
|   ![MultiInvaders：携带数字的怪物，屏幕底部的飞船](docs/media/10-multiinvaders.webp)   |       ![MultiMiam：迷宫中带有备选答案的豆子](docs/media/11-multimiam.webp)       |
|      **MultiInvaders** —— 射击错误答案，避开正确答案：它背后藏着等待解救的朋友。       |            **MultiMiam** —— 穿梭于迷宫中收集正确结果，同时避开怪物。             |
| ![MultiMemory：卡片网格，翻开的两张分别显示算式和数字](docs/media/12-multimemory.webp) | ![MultiSnake：草地上的一条贪吃蛇和带有编号的苹果](docs/media/13-multisnake.webp) |
|              **MultiMemory** —— 凭记忆找出哪张卡片对应所翻开算式的结果。               |             **MultiSnake** —— 吞食正确数字以变长，避开所有其他数字。             |

## ✨ 功能特性

### 🎮 游戏模式

- **探索模式**：针对每种运算量身定制的直观交互式探索
- **测验模式**：支持 4 种运算（×、+、−、÷）的多选题，具备自适应进阶机制
- **挑战模式**：支持 4 种运算（×、+、−、÷）的限时竞速挑战，包含不同难度级别
- **冒险模式**：支持 4 种运算的故事性关卡进阶

### 🕹️ 街机小游戏

- **MultiInvaders**：教育版 Space Invaders —— 消灭错误答案
- **MultiMiam**：数学版吃豆人 —— 收集正确答案
- **MultiMemory**：记忆游戏 —— 将算式与结果配对
- **MultiSnake**：教育版贪吃蛇 —— 吞食正确数字成长

### ➕ 多运算支持

LeapMultix 在**所有模式**中为 4 种算术运算提供全面的训练：

| 模式 | ×   | +   | −   | ÷   |
| ---- | --- | --- | --- | --- |
| 测验 | ✅  | ✅  | ✅  | ✅  |
| 挑战 | ✅  | ✅  | ✅  | ✅  |
| 探索 | ✅  | ✅  | ✅  | ✅  |
| 冒险 | ✅  | ✅  | ✅  | ✅  |
| 街机 | ✅  | ✅  | ✅  | ✅  |

### 🌍 通用功能

- **多用户支持**：个人档案管理，进度实时保存
- **多语言**：支持法语、英语和西班牙语
- **个性化定制**：头像、色彩主题、背景
- **无障碍支持**：键盘导航、触控支持、符合 WCAG 2.1 AA 标准
- **录制语音**：游戏可通过预录制的合成语音朗读题目与鼓励语，并在需要时自动回退到设备自带语音。语音文件不在此代码仓库中：leapmultix.jls42.org 网站提供法语 Lucie、英语和西班牙语 Sulafat，以及英语可选的 Jane（参见 [录制语音](#-录制语音)）
- **移动端响应式**：针对平板电脑和智能手机进行了界面优化
- **进度体系**：积分、徽章、每日挑战

## 🚀 快速入门

### 环境要求

- Node.js（16 或更高版本）
- 现代 Web 浏览器

### 安装

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

### 可用脚本

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

## 🧱 架构

### 文件结构

JavaScript 模块**扁平存放在 `js/` 中**，仅有三个子目录例外：`core/`、`components/` 和 `modes/`。因此，文件按命名前缀进行逻辑分组（`arcade-*`、`multimiam-*`、`i18n*` 等）。

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

### 技术架构

**现代 ES6 模块**：项目采用基于 ES6 类和原生导入/导出（import/export）的模块化架构。

**可复用组件**：通过集中式的 UI 组件（TopBar、InfoBar、Dashboard、Customization）构建界面。

**懒加载（Lazy Loading）**：通过 `lazy-loader.js` 按需智能加载模块，优化初始加载性能。

**统一存储系统**：通过具有回退机制的 LocalStorage 提供用户数据持久化的集中式 API。

**集中式音频管理**：支持多语言的声音控制与每位用户的偏好设置。

**事件总线（Event Bus）**：组件间解耦的事件驱动通信，确保架构的高可维护性。

**幻灯片式导航**：基于编号幻灯片（slide0、slide1 等）与 `goToSlide()` 的导航系统。

**安全性**：针对所有 DOM 操作，通过 `security-utils.js` 进行 XSS 防护和数据净化。

## 🎯 详细游戏模式

### 探索模式

乘法表的直观视觉探索界面，包含：

- 乘法的交互式可视化
- 动画效果与助记提示
- 寓教于乐的拖放操作
- 按表格自由进阶

### 测验模式

多选题模式，包含：

- 每轮 10 道题目
- 根据答题正确率自适应调整进度
- 虚拟数字小键盘
- 连击系统（连续答对加成）

### 挑战模式

限时竞速挑战，包含：

- 3 个难度级别（初级、中级、高级）
- 答对获得时间奖励
- 生命值机制
- 高分排行榜

### 冒险模式

故事剧情进阶，包含：

- 10 个可解锁的主题关卡
- 带有直观进度的交互式地图
- 包含角色的沉浸式故事
- 星级与奖励系统

### 街机小游戏

每款小游戏均提供：

- 难度选择与个性化设置
- 生命值与得分系统
- 键盘与触控操作
- 各用户专属排行榜

## 🔧 开发

### 开发工作流

**切勿直接提交到 main 分支。** 本项目采用功能分支工作流。

**1. 创建分支**，新功能使用 `feat/`，缺陷修复使用 `fix/`：

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 开发并验证。** 代码格式化优先：CI 会在运行测试之前就拒绝格式不合格的代码。

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. 提交到分支**，然后推送：

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. 创建 Pull Request** 并等待分析：verify、Codacy、CodeFactor 和 SonarCloud。在合并之前须持续修复直至全部通过（显示绿灯）。

**Commit 规范**：信息简洁，采用祈使语气（例如：“Fix arcade init errors”、“Refactor cache updater”）

**质量阈（Quality Gate）**：每次提交前确保 `npm run lint`、`npm test` 和 `npm run test:coverage` 通过

### 组件架构

**GameMode（基类）**：所有模式均继承自包含标准化方法的通用类。

**GameModeManager**：集中编排模式的启动与管理。

**UI 组件**：TopBar、InfoBar、Dashboard 和 Customization 提供一致的界面。

**懒加载**：按需加载模块以优化初始性能。

**事件总线**：通过事件系统实现组件间的解耦通信。

### 测试

项目包含完整的测试套件：

- 核心模块的单元测试
- 组件集成测试
- 游戏模式测试
- 自动化代码覆盖率

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### 生产环境构建

- **Rollup**：将 `js/main-es6.js` 打包为 ESM 格式，支持代码分割与 Source Map
- **Terser**：自动代码压缩以进行优化
- **构建后处理（Post-build）**：复制 `css/` 和 `assets/`、网站图标（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js`，并将 `dist/index.html` 重写为指向带哈希的入口文件（例如：`main-es6-*.js`）
- **最终目录**：`dist/`，可直接用于静态托管

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 持续集成（CI）

**GitHub Actions**：`.github/workflows/ci.yml`，在每次推送到 `main` 以及每次 Pull Request 时触发。

**`verify`** —— 阻塞性质量阈：

- 先运行 `npm ci`，随后运行 `npm run verify`（ESLint、Jest 测试、覆盖率）
- `npm run format:check`（Prettier）

**`seo-report`** —— 在 `verify` 之后：对在线网站进行 Lighthouse 审查，以长期跟踪 SEO 指标。

**接入 Pull Request 的外部分析**：Codacy、CodeFactor 和 SonarCloud。SonarCloud 质量阈要求新代码在可靠性、安全性和可维护性方面均达到 A 级评级。

**部署**：`./deploy.sh` 将网站同步至 S3 并刷新 CloudFront 缓存。该脚本还会视需要重新生成未包含在 Git 中的响应式图片。

### PWA（渐进式 Web 应用）

LeapMultix 是一款功能完备的 PWA，支持离线运行和本地安装。

**Service Worker**（`sw.js`）：

- 导航：网络优先（Network-first），离线时回退到 `offline.html`
- 图片：缓存优先（Cache-first）以优化性能
- 翻译：过时重新验证（Stale-while-revalidate），实现后台更新
- JS/CSS：网络优先（Network-first），始终提供最新版本
- 通过 `cache-updater.js` 进行自动版本管理

**Manifest**（`manifest.json`）：

- 适用于所有设备的 SVG 和 PNG 图标
- 支持在移动设备上安装（添加到主屏幕 / Add to Home Screen）
- 独立模式（standalone）配置，提供原生应用般的体验
- 支持主题与色彩配置

**在本地测试离线模式。** 启动服务器，然后打开 `http://localhost:8080`（或显示的端口）：

```bash
npm run serve
```

手动测试：在开发者工具中切断网络（“网络”（Network）选项卡，切换至离线模式），然后刷新页面。应当显示 `offline.html`。

使用 Puppeteer 自动化测试：

```bash
npm run test:pwa-offline
```

**Service Worker 管理脚本**：

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### 质量标准

**代码质量工具**：

- **ESLint**：采用 Flat Config（`eslint.config.js`）的现代化配置，支持 ES2022
- **Prettier**：代码自动格式化（`.prettierrc`）
- **Stylelint**：CSS 校验（`.stylelintrc.json`）
- **JSDoc**：带有覆盖率分析的函数文档自动生成

**重要代码规范**：

- 清理未使用的变量与参数（`no-unused-vars`）
- 使用具体的错误处理（禁止空的 catch 块）
- 避免使用 `innerHTML`，推荐使用 `security-utils.js` 函数
- 函数的认知复杂度保持在 < 15
- 将复杂函数拆分为更小的辅助函数

**安全性**：

- **XSS 防护**：使用 `security-utils.js` 中的函数：
  - 使用 `appendSanitizedHTML()` 代替 `innerHTML`
  - 使用 `createSafeElement()` 创建安全元素
  - 使用 `setSafeMessage()` 处理文本内容
- **外部脚本**：强制使用 `crossorigin="anonymous"` 属性
- **输入校验**：始终对外部数据进行净化
- **内容安全策略**：通过 CSP 头限制脚本源

**无障碍访问**：

- 符合 WCAG 2.1 AA 标准
- 完整的键盘导航支持
- 合适的 ARIA 角色与标签
- 符合规范的颜色对比度

**性能**：

- 通过 `lazy-loader.js` 进行模块懒加载
- CSS 优化与响应式资源
- 用于智能缓存的 Service Worker
- 生产环境下的代码分割与代码压缩

## 📱 兼容性

### 支持的浏览器

界面依赖 `oklch()` 处理颜色，并依赖 `:has()` 处理上下文状态，因此最低支持版本为：

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### 设备支持

- **桌面端**：键盘与鼠标控制
- **平板电脑**：触控优化界面
- **智能手机**：自适应响应式设计

### 无障碍访问

- 完整的键盘导航（Tab、方向键、Esc）
- 面向屏幕阅读器的 ARIA 角色与标签
- 符合规范的颜色对比度
- 支持辅助技术

## 🌍 本地化

完整的多语言支持：

- **法语**（默认语言）
- **英语**
- **西班牙语**

### 翻译管理

**翻译文件：**`assets/translations/*.json`

**格式：**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n 管理脚本

**`npm run i18n:verify`** - 检查翻译键的一致性

**`npm run i18n:unused`** - 列出未使用的翻译键

**`npm run i18n:compare`** - 将翻译文件与 fr.json（基准参考）进行对比

该脚本（`scripts/compare-translations.cjs`）用于确保所有语言文件的同步：

**功能特性：**

- 检测缺失的键（存在于 fr.json 但在其他语言中缺失）
- 检测多余的键（存在于其他语言中但不在 fr.json 中）
- 识别空值（`""`、`null`、`undefined`、`[]`）
- 类型一致性检查（string 与 array）
- 将嵌套 JSON 结构扁平化为点号表示法（例如：`arcade.multiMemory.title`）
- 生成详细的控制台报告
- 将 JSON 报告保存至 `docs/translations-comparison-report.json`

**输出示例：**

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

**翻译覆盖范围：**

- 完整的用户界面
- 游戏说明
- 错误与反馈信息
- 描述与上下文帮助
- 冒险模式叙事内容
- 无障碍与 ARIA 标签

## 🔊 录制语音

游戏会朗读题目、鼓励语句和解说。它只朗读有限的固定句集，每种语言约 7,400 句：因此可以一次性录制完毕，在游戏过程中无需调用语音合成服务。若缺少音频片段，游戏将使用设备自带的语音进行朗读。

### 在此仓库中：包含应用程序，不含语音

代码支持播放预录制的音频片段，并包含生成这些片段的工具链。但仓库中并不包含音频片段本身，也没有服务商密钥：Fork 或本地安装的版本将使用设备语音朗读。

- **自动降级回退**至设备语音，按句判断：音频片段缺失或报错、浏览器拒绝播放、音频在 1.5 秒内未开始播放，或者离线时缓存中没有该片段。
- **设置**：顶部栏的语音按钮可开启或关闭朗读；“录制语音”复选框（位于“无障碍与控制”中）可在录制语音与设备语音之间切换。该选项仅在已发布语音的语言中显示。
- **离线使用**：已听过的音频片段会保存在缓存中（Service Worker）。
- **游戏查找音频片段的位置**：位于 `<meta name="leapmultix-voice-base">` 标签中，该标签在仓库中为空。仅在生产环境部署时才会向其写入 `/voice/`。

若您在本地机器上拥有自己的音频片段（通过下述工具链生成，并存放在与游戏平级的 `../leapmultix-voices` 目录中），参数 `?voix=local` 可让开发服务器读取它们：

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### 在 leapmultix.jls42.org 上：托管站点的语音

作者提供的站点提供了录制的合成语音：

- 法语：**Lucie**，使用 ElevenLabs（Eleven v3 模型）生成；
- 英式英语和西班牙语（西班牙）：**Sulafat**，使用 Google Cloud Text-to-Speech（Chirp 3 HD 语音）生成；
- 英语（玩家可选）：**Jane**，使用 Mistral AI（Voxtral TTS）生成。

音频片段保存在一个私有仓库和专用的 S3 存储桶中，通过 CloudFront 在 `/voice/*` 上提供服务。在设置中，当某语言有多个语音可选时，“语音”菜单会列出相应语音，并在提示说明中注明当前播放语音所使用的服务。

### 生成音频片段

工具链由 `scripts/voice/` 中的脚本实现，在维护者本地机器上运行，绝不会在公共 CI 中执行。服务商密钥（用于法语的 ElevenLabs、用于英语和西班牙语的 Google Cloud Text-to-Speech、用于 Jane 的 Mistral）保存在仓库外的 `.env` 文件中，通过 `node --env-file` 传递：任何密钥都不会提交到 Git。Claude Code 技能 [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) 详细介绍了分步流程（门禁、确认、重试）；详情请参阅 [`docs/voix-enregistree.md`](docs/voix-enregistree.md)。

1. **估算**剩余语句数量及需付费的字符数（Eleven v3：每字符约 0.53 积分；Chirp 3 HD：每百万字符 30 美元，每月前一百万字符免费；Voxtral TTS：每百万字符 16 美元）。
2. **生成**。重新运行相同的命令将从缺失部分继续。当额度耗尽时，脚本会正常退出（状态码 3），不会留下半写的文件。`--max-total-chars` 为该版本的累计花销设定了上限：每次收到付费响应时都会立即写入登记表，即使发生异常终止也不会丢失。对于未提供直观余额查询的 Google 和 Mistral，这是唯一的保护措施。
3. **检查**：确保每句都有对应的音频片段，且每个 MP3 文件均有效。随后 Whisper 在本地对每个片段进行转录，检查机制会标出识别错误的数字和异常时长。`voice:review` 可一条命令串联运行 Whisper、检查机制与试听页面。
4. **试听**：在试听页面（`voice:listen`）上试听被标记的片段以及 Whisper 无法区分的阴性形式样本（如“une fois 7”）。每个片段都配有“重做”复选框，选中即可将其加入待排除列表。
5. **重做**被排除的片段（`--redo`）并重新运行 Whisper，然后在第二个页面上对比每个片段修改前后的效果。经过两三次尝试后发音仍不理想的片段，可在 `SAID_OVERRIDES`（`scripts/voice/said-text.mjs`）中指定强制文本，例如拼写出完整数字。
6. **发布**音频片段，验证它们能在线正常访问，然后发布该语言的索引，先向测试人员提供（`?voix=test`）。
7. **全员开放**该语音，随后将其设为默认。熔断开关（`voice:publish -- remove`）可从索引中移除某种语言：游戏将回退至设备语音。

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

### 规则：修改过的朗读语句必须在上线生产环境前重新录制

所有朗读的语句均来自翻译文件（`assets/translations/{fr,en,es}.json`），属于语料库的一部分。因此，修改朗读语句会导致语料库锁检验（`scripts/voice/corpus.lock.json`）失败。对于已录制语音的语言，需要生成受影响语句的音频片段，进行检查与试听，并在合并**之前**发布它们。最后更新锁文件（`npm run voice:corpus:lock`）。若没有这些音频片段，修改后的语句将使用设备语音朗读。

## 📊 数据存储

### 用户数据

- 个人资料与偏好设置
- 各游戏模式的进度
- 街机游戏的得分与统计数据
- 个性化设置

### 技术特性

- 本地存储（localStorage）及后备方案
- 按用户进行数据隔离
- 进度自动保存
- 旧版数据自动迁移

## 🐛 问题反馈

可以通过 GitHub Issues 反馈问题。请提供以下信息：

- 问题的详细描述
- 重现步骤
- 浏览器及其版本
- 相关截图（如有）

## 💝 支持项目

**[☕ 通过 PayPal 赞助](https://paypal.me/jls)**

## 📄 许可证

本项目采用 AGPL v3 许可证。详情请参阅 `LICENSE` 文件。

---

_LeapMultix — 用于学习四则运算的自由开源教育应用_

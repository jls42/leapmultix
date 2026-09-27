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
- [报告问题](#-反馈问题)
- [许可证](#-许可证)

## 描述

LeapMultix 是一款面向 6 至 12 岁儿童的交互式教育 Web 应用，帮助他们掌握四则算术运算：乘法（×）、加法（+）、减法（−）和除法（÷）。它在直观、易用且支持多语言的界面中提供了 **5 种游戏模式** 和 **4 款街机小游戏**。

**多运算支持：** 五种模式均支持全部四则运算。可在主屏幕进行选择，并应用于整个流程。

**开发者：** Julien LS (contact@jls42.org)

**在线网址：** https://leapmultix.jls42.org/

## 📸 概览

### 屏幕截图

|                                                                        |                                                                              |
| :--------------------------------------------------------------------: | :--------------------------------------------------------------------------: |
|      ![“谁在玩？”屏幕：选择个人资料](docs/media/01-accueil.webp)       |          ![主菜单：选择运算类型和五种模式](docs/media/02-menu.webp)          |
|       **谁在玩？** —— 每个孩子一个个人资料，包含专属头像和进度。       |             **菜单** —— 在此选择运算类型，随后即可开启五种模式。             |
|  ![探索模式：以圆点展示的 4 的乘法表](docs/media/03-decouverte.webp)   | ![测验模式：错误答案显示为红色，正确答案显示为绿色](docs/media/04-quiz.webp) |
|   **探索** —— 每个等式都通过圆点、跳跃或计数展示，并附带运算表诀窍。   |      **测验** —— 孩子的选项会与正确答案并列显示，并提供详细的计算说明。      |
|         ![挑战模式：倒计时与当前连胜](docs/media/05-defi.webp)         |   ![冒险模式：十个关卡的地图，后续关卡已锁定](docs/media/06-aventure.webp)   |
|     **挑战** —— 与时间赛跑。答错时计时器会暂停，以便阅读正确答案。     |                 **冒险** —— 十个关卡依次解锁，收集星星通关。                 |
|           ![街机菜单：四款小游戏](docs/media/07-arcade.webp)           |   ![仪表板：各运算表的星星与统计数据](docs/media/08-tableau-de-bord.webp)    |
|            **街机** —— 四款小游戏，支持难度调节和飞船选择。            |            **仪表板** —— 各运算表的星星、待复习的表、各模式得分。            |
| ![个性化：头像、主题、无障碍功能](docs/media/09-personnalisation.webp) |                                                                              |
|      **个性化** —— 头像、颜色主题、字体大小、高对比度、家长密码。      |                                                                              |

### 街机小游戏

四款游戏提出相同的问题 —— 显示在游戏区域上方，并附有剩余时间和生命值 —— 但每次都需要不同的操作方式。

|                                                                                    |                                                                            |
| :--------------------------------------------------------------------------------: | :------------------------------------------------------------------------: |
| ![MultiInvaders：携带数字的怪物，屏幕下方的飞船](docs/media/10-multiinvaders.webp) |     ![MultiMiam：药丸带有可选答案的迷宫](docs/media/11-multimiam.webp)     |
| **MultiInvaders** —— 射击错误答案，保留正确答案：正确答案背后藏着等待解救的朋友。  |         **MultiMiam** —— 穿梭于迷宫中获取正确结果，同时避开怪物。          |
| ![MultiMemory：卡片网格，翻开的两张显示算式和数字](docs/media/12-multimemory.webp) | ![MultiSnake：草地上带有编号的苹果和一条蛇](docs/media/13-multisnake.webp) |
|           **MultiMemory** —— 凭记忆找出哪张卡片带有翻开算式的计算结果。            |         **MultiSnake** —— 吞食正确的数字来变长，避开所有其他数字。         |

## ✨ 功能特性

### 🎮 游戏模式

- **探索模式**：针对每种运算量身定制的可视化交互式探索
- **测验模式**：支持四则运算（×、+、−、÷）的多选题与自适应进度
- **挑战模式**：支持四则运算（×、+、−、÷）与多种难度级别的计时挑战
- **冒险模式**：支持四则运算的故事推进式分关卡进度

### 🕹️ 街机小游戏

- **MultiInvaders**：益智太空侵略者 —— 消灭错误答案
- **MultiMiam**：数学吃豆人 —— 收集正确答案
- **MultiMemory**：记忆配对游戏 —— 将算式与结果相匹配
- **MultiSnake**：益智贪吃蛇 —— 吞食正确数字以变长

### ➕ 多运算支持

LeapMultix 在**所有模式**中提供四则算术运算的全面训练：

| 模式 | ×   | +   | −   | ÷   |
| ---- | --- | --- | --- | --- |
| 测验 | ✅  | ✅  | ✅  | ✅  |
| 挑战 | ✅  | ✅  | ✅  | ✅  |
| 探索 | ✅  | ✅  | ✅  | ✅  |
| 冒险 | ✅  | ✅  | ✅  | ✅  |
| 街机 | ✅  | ✅  | ✅  | ✅  |

### 🌍 通用功能

- **多用户**：管理保存进度的独立个人资料
- **多语言**：支持法语、英语和西班牙语
- **个性化**：头像、颜色主题、背景
- **无障碍**：键盘导航、触控支持、符合 WCAG 2.1 AA 标准
- **录制语音**：游戏能够使用预录制的合成语音朗读题目与鼓励语，并在需要时自动回退到设备自带语音。语音文件不包含在此仓库中：leapmultix.jls42.org 网站提供法语的 Lucie、英语与西班牙语的 Sulafat，以及可选的法语 Sulafat 和 Marie、英语 Jane（参见 [录制语音](#-录制语音)）
- **移动端响应式**：针对平板电脑和智能手机优化的界面
- **进度系统**：得分、徽章、每日挑战

## 🚀 快速入门

### 环境要求

- Node.js（版本 16 或更高）
- 现代网络浏览器

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

除三个文件夹（`core/`、`components/` 和 `modes/`）外，JavaScript 模块**扁平存放在 `js/`** 中。因此，文件的逻辑归类直接体现在其命名上（`arcade-*`、`multimiam-*`、`i18n*`……）。

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

**现代 ES6 模块**：项目采用模块化架构，使用 ES6 类及原生导入/导出。

**可复用组件**：使用集中式 UI 组件（TopBar、InfoBar、Dashboard、Customization）构建界面。

**懒加载**：通过 `lazy-loader.js` 按需智能加载模块，以优化初始性能。

**统一存储系统**：通过 LocalStorage 提供集中式 API 实现用户数据持久化，并具备降级回退机制。

**集中式音频管理**：支持多语言及每个用户的偏好设置的声音控制。

**事件总线（Event Bus）**：组件间解耦的事件驱动通信，实现高可维护性架构。

**滑动页面导航**：基于编号滑动页面（slide0、slide1 等）并配合 `goToSlide()` 的导航系统。

**安全防护**：对所有 DOM 操作通过 `security-utils.js` 进行 XSS 防护与数据净化。

## 🎯 详细游戏模式

### 探索模式

乘法表的可视化探索界面，包含：

- 乘法交互式可视化
- 动画与记忆卡片
- 教学拖放操作
- 按运算表自由推进

### 测验模式

多选题，包含：

- 每轮 10 道题目
- 根据正确率自适应调整难度
- 虚拟数字键盘
- 连胜（连续答对）系统

### 挑战模式

计时挑战，包含：

- 3 种难度级别（初学者、中等、困难）
- 答对奖励时间
- 生命值系统
- 高分排行榜

### 冒险模式

故事推进模式，包含：

- 10 个可解锁的主题关卡
- 带有可视化进度的互动地图
- 包含角色的沉浸式故事
- 星级与奖励系统

### 街机小游戏

每款小游戏提供：

- 难度选择与个性化设置
- 生命值与得分系统
- 键盘与触屏控制
- 每个用户的专属排行榜

## 🔧 开发

### 开发工作流

**切勿直接提交到 main 分支。** 本项目按特性分支（feature branch）进行协作开发。

**1. 创建分支**，功能开发使用 `feat/`，缺陷修复使用 `fix/`：

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 开发并验证。** 代码格式化排在第一位：CI 会在运行测试之前就因格式问题而直接拒绝。

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

**4. 发起 Pull Request** 并等待各项分析完成：verify、Codacy、CodeFactor 和 SonarCloud。在合并之前必须修复所有问题直到全部通过（绿灯）。

**提交规范**：信息简洁明了，采用祈使语气（例如：“Fix arcade init errors”、“Refactor cache updater”）

**质量门禁（Quality gate）**：每次提交前确保通过 `npm run lint`、`npm test` 和 `npm run test:coverage`

### 组件架构

**GameMode（基类）**：所有模式均继承自一个通用类，包含标准化方法。

**GameModeManager**：集中调度模式的启动与管理。

**UI 组件**：TopBar、InfoBar、Dashboard 和 Customization 提供统一的界面。

**懒加载**：按需加载模块以优化初始性能。

**事件总线（Event Bus）**：通过事件系统实现组件间的解耦通信。

### 测试

项目包含完整的测试套件：

- 核心模块的单元测试
- 组件集成测试
- 游戏模式测试
- 自动化代码覆盖率检查

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### 生产环境构建

- **Rollup**：将 `js/main-es6.js` 打包为 ESM 格式，支持代码分割（code-splitting）和 sourcemap
- **Terser**：自动代码压缩以进行优化
- **构建后处理**：复制 `css/` 与 `assets/`、网站图标（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js`，并将 `dist/index.html` 重写为指向带哈希的入口文件（例如：`main-es6-*.js`）
- **最终目录**：`dist/` 可直接用于静态资源托管

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 持续集成

**GitHub Actions**：`.github/workflows/ci.yml`，在每次推送到 `main` 以及每次 Pull Request 时触发。

**`verify`** —— 质量门禁，阻断性检查：

- `npm ci`，随后执行 `npm run verify`（ESLint、Jest 测试、覆盖率）
- `npm run format:check`（Prettier）

**`seo-report`** —— 在 `verify` 之后运行：对线上网站进行 Lighthouse 审计，以长期跟踪 SEO 指标。

**外部代码分析**已接入 Pull Request：Codacy、CodeFactor 和 SonarCloud。SonarCloud 质量门禁要求对新增代码在可靠性、安全性和可维护性方面均达到 A 级评分。

**部署**：`./deploy.sh` 将网站同步到 S3 并刷新 CloudFront 缓存。该脚本会在需要时重新生成未纳入 git 的响应式图片。

### PWA（渐进式 Web 应用）

LeapMultix 是一款功能完备的 PWA，支持离线运行并可安装到设备。

**Service Worker**（`sw.js`）：

- 页面导航：网络优先（Network-first），离线时回退到 `offline.html`
- 图片资源：缓存优先（Cache-first）以优化性能
- 翻译文本：过期重新验证（Stale-while-revalidate）以在后台静默更新
- JS/CSS：网络优先（Network-first）以始终提供最新版本
- 通过 `cache-updater.js` 进行自动版本管理

**Manifest 清单**（`manifest.json`）：

- 适用于所有设备的 SVG 与 PNG 图标
- 支持在移动设备上安装（添加到主屏幕）
- 独立模式（standalone）配置，带来类似原生应用的体验
- 支持主题与配色定制

**在本地测试离线模式。** 启动服务器，然后打开 `http://localhost:8080`（或显示的端口）：

```bash
npm run serve
```

手动测试：在开发者工具中切断网络（“网络”选项卡，离线模式），然后刷新页面。此时应显示 `offline.html`。

自动测试，使用 Puppeteer：

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
- **JSDoc**：包含覆盖率分析的函数文档自动生成

**重要代码规范**：

- 移除未使用的变量与参数（`no-unused-vars`）
- 使用针对性的错误处理（禁止空的 catch 块）
- 避免使用 `innerHTML`，推荐使用 `security-utils.js` 函数
- 函数认知复杂度保持 < 15
- 将复杂函数拆分为更小的辅助函数（helpers）

**安全**：

- **XSS 防护**：使用 `security-utils.js` 的函数：
  - 使用 `appendSanitizedHTML()` 代替 `innerHTML`
  - 使用 `createSafeElement()` 创建安全元素
  - 文本内容使用 `setSafeMessage()`
- **外部脚本**：强制使用 `crossorigin="anonymous"` 属性
- **输入验证**：始终清理外部数据
- **内容安全策略**：通过 CSP 响应头限制脚本来源

**无障碍**：

- 符合 WCAG 2.1 AA 标准
- 完整的键盘导航支持
- 合适的 ARIA 角色与标签
- 符合标准的颜色对比度

**性能**：

- 通过 `lazy-loader.js` 实现模块懒加载
- CSS 优化与响应式资源
- 用于智能缓存的 Service Worker
- 生产环境下的代码分割与混淆压缩

## 📱 兼容性

### 支持的浏览器

界面依靠 `oklch()` 处理颜色，并依靠 `:has()` 处理上下文状态，由此确定了最低版本要求：

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### 设备

- **桌面端**：键盘和鼠标控制
- **平板电脑**：触控优化界面
- **智能手机**：自适应响应式设计

### 无障碍

- 完整的键盘导航（Tab、方向键、Esc）
- 屏幕阅读器的 ARIA 角色与标签
- 符合标准的颜色对比度
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

该脚本（`scripts/compare-translations.cjs`）确保所有语言文件的同步：

**功能：**

- 检测缺失的键（存在于 fr.json 但在其他语言中缺失）
- 检测多余的键（存在于其他语言但未在 fr.json 中定义）
- 识别空值（`""`、`null`、`undefined`、`[]`）
- 类型一致性检查（string 对比 array）
- 将嵌套的 JSON 结构展平为点记法（例如：`arcade.multiMemory.title`）
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
- 游戏说明与指导
- 错误提示与反馈信息
- 描述与上下文帮助
- 冒险模式的剧情内容
- 无障碍与 ARIA 标签

## 🔊 录制语音

游戏会朗读题目、鼓励语句和解释。它只包含有限的句子集合，每种语言大约 7,400 句：因此可以一次性录制完成，实际游戏过程中无需调用任何语音合成服务。若没有音频片段，游戏将使用设备的系统语音进行朗读。

### 本仓库内：应用（不含语音）

代码能够播放预录制的音频片段，并包含用于生成这些片段的处理链。但仓库中不包含音频片段，也不包含供应商的 API 密钥：派生或本地安装的项目默认使用设备自带语音朗读。

- **自动降级回退**到设备语音，逐句进行：音频片段缺失或出错、浏览器拒绝播放、音频片段在 1.5 秒内未开始播放，或者离线且缓存中没有该片段。
- **设置**：顶部栏的语音按钮可开启或关闭朗读；“录制语音”复选框（无障碍与控制）用于在录制语音与设备语音之间切换。该选项仅在已发布录制语音的语言中显示。
- **离线使用**：听过的音频片段会保留在缓存中（Service Worker）。
- **游戏从何处寻找音频片段**：在 `<meta name="leapmultix-voice-base">` 标签中查找，该标签在仓库中为空。仅在生产环境部署时才会写入 `/voice/`。

如果您在本地计算机上有自己的音频片段（通过下述处理链制作，存放在游戏同级的 `../leapmultix-voices` 中），参数 `?voix=local` 可让开发服务器读取它们：

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### 在 leapmultix.jls42.org 上：托管版语音

作者提供的站点提供了已录制的合成语音：

- 法语：**Lucie**，使用 ElevenLabs（Eleven v3 模型）生成；
- 英式英语和西班牙语（西班牙）：**Sulafat**，使用 Google Cloud Text-to-Speech（Chirp 3 HD 语音）生成；
- 玩家也可选择法语版的 **Sulafat**，以便在三种语言中保持同一种声音；
- 玩家亦可选用法语的 **Marie** 和英语的 **Jane**，由 Mistral AI（Voxtral TTS）生成。

音频片段保存在私有仓库和专用的 S3 存储桶中，并通过 CloudFront 在 `/voice/*` 上提供分发。它们只生成一次：在游戏进行期间，不会向这些服务发送任何请求。在设置中，如果某语言拥有多种语音，“语音”菜单会列出该语言可用的语音，相关说明也会标注当前收听语音所对应的服务商。

### 生成音频片段

该流程已在 `scripts/voice/` 中脚本化，且仅在维护者本地机器上运行，绝不在公开 CI 中执行。供应商密钥（ElevenLabs 对应 Lucie，Google Cloud Text-to-Speech 对应 Sulafat，Mistral 对应 Marie 和 Jane）存放在仓库外的 `.env` 文件中，通过 `node --env-file` 传递：没有任何密钥会被提交到 git。Claude Code skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) 提供了逐步执行的流程（检查点、授权确认、断点续传）；详细说明请参阅 [`docs/voix-enregistree.md`](docs/voix-enregistree.md)。

1. **估算**剩余句子数量和需要计费的字符数（Eleven v3：约每字符 0.53 点积分；Chirp 3 HD：每百万字符 30 美元，每月前一百万字符免费；Voxtral TTS：每百万字符 16 美元）。
2. **生成**。重新运行相同命令可续传缺失部分。当配额或额度耗尽时，脚本会正常退出（退出代码 3），而不会留下未写完的文件。`--max-total-chars` 为该版本的累计花销设定了上限：每收到一次付费响应，就会立即记录在登记册中，即使意外中断也不会丢失记录。对于不提供可读余额的 Google 和 Mistral，这是唯一的保护措施。
3. **检查**：确保每个句子都有对应的音频片段且每个 MP3 文件有效。随后 Whisper 会在本地对每个片段进行转录，检查程序会标出听错的数字和异常的时长。`voice:review` 可通过一条命令串联运行 Whisper、此项检查及试听页面。
4. **试听**：在试听页面（`voice:listen`）上检查被标记的片段以及部分阴性形式样本（如 “une fois 7”），Whisper 无法区分这些形式。每个片段都有一个“重做”复选框，勾选后会将其添加到待重录片段列表中。
5. **重录**被剔除的片段（`--redo`）并重新运行 Whisper，然后在第二个页面上对比每个片段修改前后的效果。如果某个片段经过两三次尝试后发音仍然有误，则可以在 `SAID_OVERRIDES`（`scripts/voice/said-text.mjs`）中指定固定的发音文本，例如拼写出完整的数字文字。
6. **发布**音频片段，验证它们在线上能正常响应，然后先面向测试人员发布该语言的索引（`?voix=test`）。
7. **向所有人开放**语音，随后将其设为默认启用。熔断开关（`voice:publish -- remove`）可从索引中移除某种语言：游戏将回退至设备自带语音。

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

### 规则：已修改的有声文本在发布到生产环境前必须重新录制

所有有声台词均来自翻译文件（`assets/translations/{fr,en,es}.json`）且属于语料库的一部分。因此，修改任何口播句子都会导致语料库锁定测试（`scripts/voice/corpus.lock.json`）失败。对于已拥有录制语音的语言，需要为受影响的句子生成音频片段，进行检查与试听，并在合并分支**之前**完成发布。最后再更新锁定文件（`npm run voice:corpus:lock`）。如果没有这些音频片段，修改后的句子将使用设备语音朗读。

## 📊 数据存储

### 用户数据

- 用户档案与偏好设置
- 各游戏模式的进度
- 街机游戏的得分与统计数据
- 个性化设置

### 技术特性

- 本地存储（localStorage）及后备降级方案
- 按用户进行数据隔离
- 自动保存进度
- 旧数据自动迁移

## 🐛 反馈问题

可通过 GitHub Issues 报告问题。请提供以下信息：

- 问题的详细描述
- 复现步骤
- 浏览器及版本
- 相关截图（若适用）

## 💝 支持本项目

**[☕ 通过 PayPal 赞助](https://paypal.me/jls)**

## 📄 许可证

本项目采用 AGPL v3 许可证。详情请参阅 `LICENSE` 文件。

---

_LeapMultix — 用于学习四则运算的自由开源教育应用_

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

- [简介](#简介)
- [概览](#-概览)
- [功能特性](#-功能特性)
- [快速入门](#-快速入门)
- [架构](#-架构)
- [详细游戏模式](#-详细游戏模式)
- [开发](#-开发)
- [兼容性](#-兼容性)
- [本地化](#-本地化)
- [录音语音](#-录制语音)
- [数据存储](#-数据存储)
- [报告问题](#-报告问题)
- [许可证](#-许可证)

## 简介

LeapMultix 是一款面向 6 至 12 岁儿童的交互式教育 Web 应用程序，旨在帮助他们掌握 4 种算术运算：乘法（×）、加法（+）、减法（−）和除法（÷）。它在直观、无障碍且支持多语言的界面中提供 **5 种游戏模式**与 **4 款街机迷你游戏**。

**多运算支持：** 这五种模式均支持全部四种运算。在主屏幕上进行选择后即可应用于整个学习流程。

**开发者：** Julien LS (contact@jls42.org)

**在线网址：** https://leapmultix.jls42.org/

## 📸 概览

### 界面截图

|                                                                          |                                                                              |
| :----------------------------------------------------------------------: | :--------------------------------------------------------------------------: |
|       ![“谁在玩？”屏幕：选择个人资料](docs/media/01-accueil.webp)        |            ![主菜单：选择运算及五种模式](docs/media/02-menu.webp)            |
|         **谁在玩？**——每个孩子一个个人资料，包含头像和学习进度。         |                **菜单**——在此选择运算方式，随后开启五种模式。                |
|    ![探索模式：以圆点展示 4 的乘法表](docs/media/03-decouverte.webp)     | ![测验模式：错误答案显示为红色，正确答案显示为绿色](docs/media/04-quiz.webp) |
| **探索**——每个等式均通过圆点、数轴跳跃或计数展示，并配有乘法表口诀技巧。 |        **测验**——孩子的选择会保留在正确答案旁，并提供详细的计算解析。        |
|          ![挑战模式：倒计时与当前连击](docs/media/05-defi.webp)          |    ![冒险模式：十个关卡地图，后续关卡已锁定](docs/media/06-aventure.webp)    |
|       **挑战**——与时间赛跑。答错时计时器会暂停，以便阅读正确答案。       |                  **冒险**——十个关卡依次解锁，收集星星通关。                  |
|           ![街机菜单：四款迷你游戏](docs/media/07-arcade.webp)           |   ![仪表盘：各运算表星星数与统计数据](docs/media/08-tableau-de-bord.webp)    |
|             **街机**——四款迷你游戏，支持难度调节与飞船选择。             |             **仪表盘**——各表获得的星星、待复习的表、各模式得分。             |
|    ![个性化：头像、主题、无障碍](docs/media/09-personnalisation.webp)    |                                                                              |
|    **个性化**——头像、颜色主题、字体大小、高对比度模式、家长控制密码。    |                                                                              |

### 街机迷你游戏

四款游戏提出相同的问题——显示在游戏区域上方，附带剩余时间和生命值——但每次都需要不同的操作方式。

|                                                                                            |                                                                                |
| :----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
|     ![MultiInvaders：带有数字的怪物，屏幕底部的飞船](docs/media/10-multiinvaders.webp)     |     ![MultiMiam：带有代表备选答案豆子的迷宫](docs/media/11-multimiam.webp)     |
|        **MultiInvaders**——射击错误答案，保留正确答案：它隐藏着一个等待解救的伙伴。         |              **MultiMiam**——穿行迷宫收集正确结果，同时避开怪物。               |
| ![MultiMemory：卡片网格，两张翻开的卡片分别显示算式和数字](docs/media/12-multimemory.webp) | ![MultiSnake：草地上带有数字的苹果和一条贪吃蛇](docs/media/13-multisnake.webp) |
|              **MultiMemory**——凭借记忆找出哪张卡片对应所翻开算式的计算结果。               |          **MultiSnake**——通过吞下正确数字不断变长，避开所有其他数字。          |

## ✨ 功能特性

### 🎮 游戏模式

- **探索模式**：针对每种运算量身定制的直观交互式探索
- **测验模式**：支持 4 种运算（×、+、−、÷）并具备自适应进度的多选题
- **挑战模式**：涵盖 4 种运算（×、+、−、÷）且具备不同难度级别的限时竞速
- **冒险模式**：支持 4 种运算的关卡剧情式进阶

### 🕹️ 街机迷你游戏

- **MultiInvaders**：教育版 Space Invaders - 消灭错误答案
- **MultiMiam**：数学版吃豆人 - 收集正确答案
- **MultiMemory**：记忆游戏 - 匹配算式与结果
- **MultiSnake**：教育版贪吃蛇 - 吃下正确数字不断变长

### ➕ 多运算支持

LeapMultix 在**所有模式**中均提供对 4 种算术运算的全面训练：

| 模式 | ×   | +   | −   | ÷   |
| ---- | --- | --- | --- | --- |
| 测验 | ✅  | ✅  | ✅  | ✅  |
| 挑战 | ✅  | ✅  | ✅  | ✅  |
| 探索 | ✅  | ✅  | ✅  | ✅  |
| 冒险 | ✅  | ✅  | ✅  | ✅  |
| 街机 | ✅  | ✅  | ✅  | ✅  |

### 🌍 通用功能

- **多用户**：独立档案管理并保存进度
- **多语言**：支持法语、英语和西班牙语
- **个性化**：头像、颜色主题、背景
- **无障碍支持**：键盘导航、触控支持、符合 WCAG 2.1 AA 规范
- **录音语音**：游戏能够使用预录制的合成语音朗读题目与鼓励语，并在需要时自动回退到设备自带语音。语音文件不包含在此仓库中：leapmultix.jls42.org 网站在法语中提供 Lucie，在英语和西班牙语中提供 Sulafat，并可选用法语的 Marie 和英语的 Jane（参见[录音语音](#-录制语音)）
- **移动端自适应**：针对平板电脑和智能手机进行了优化界面
- **成长体系**：积分、徽章、每日挑战

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

除三个文件夹（`core/`、`components/` 和 `modes/`）外，JavaScript 模块均**扁平存放在 `js/`** 下。因此，文件分组由文件名决定（`arcade-*`、`multimiam-*`、`i18n*`……）。

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

**可复用组件**：界面通过中心化的 UI 组件（TopBar、InfoBar、Dashboard、Customization）构建。

**懒加载（Lazy Loading）**：通过 `lazy-loader.js` 按需智能加载模块，优化首屏性能。

**统一存储系统**：通过 LocalStorage 并带有回退机制的中心化 API 实现用户数据持久化。

**集中式音频管理**：具备多语言支持与针对每位用户偏好设置的声音控制。

**事件总线（Event Bus）**：组件间解耦的事件通信，确保架构的高可维护性。

**幻灯片导航**：基于编号幻灯片（slide0、slide1 等）并借助 `goToSlide()` 实现的导航系统。

**安全性**：针对所有 DOM 操作，通过 `security-utils.js` 进行 XSS 防御与数据清洗净化。

## 🎯 详细游戏模式

### 探索模式

乘法表的直观探索界面，包含：

- 乘法的交互式可视化
- 动画与记忆辅助工具
- 教育性拖放操作
- 按运算表自由进阶

### 测验模式

多选题，包含：

- 每轮 10 道题目
- 根据答题成功率实现的自适应进度
- 虚拟数字键盘
- 连胜系统（连续正确回答）

### 挑战模式

限时竞速，包含：

- 3 个难度级别（初学者、中等、困难）
- 正确回答获得时间奖励
- 生命值系统
- 最佳成绩排行榜

### 冒险模式

剧情式进阶，包含：

- 10 个可解锁的主题关卡
- 带有可视化进度的互动地图
- 带有角色设定的沉浸式故事
- 星星与奖励系统

### 街机迷你游戏

每款迷你游戏均提供：

- 难度选择与个性化定制
- 生命值与得分系统
- 键盘与触控控制
- 每位用户的独立排行榜

## 🔧 开发

### 开发工作流

**切勿直接提交至 main 分支。** 项目基于特性分支进行开发。

**1. 创建分支**，功能开发使用 `feat/`，缺陷修复使用 `fix/`：

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 开发并验证。** 代码格式化优先：CI 会在运行测试之前就对其进行检查并拒绝不合规格式。

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. 在分支上提交**，然后推送分支：

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. 提交 Pull Request** 并等待各项分析：verify、Codacy、CodeFactor 和 SonarCloud。持续修复直到全部变绿后再合并。

**提交规范**：简洁的消息，祈使语气（例如："Fix arcade init errors", "Refactor cache updater"）

**质量门禁（Quality gate）**：确保每次提交前 `npm run lint`、`npm test` 和 `npm run test:coverage` 均通过

### 组件架构

**GameMode（基类）**：所有模式均继承自包含标准化方法的通用类。

**GameModeManager**：集中编排模式的启动与管理。

**UI 组件**：TopBar、InfoBar、Dashboard 和 Customization 提供一致的界面。

**懒加载**：模块按需加载以优化初始性能。

**事件总线**：通过事件系统在组件之间实现解耦通信。

### 测试

项目包含完整的测试套件：

- 核心模块的单元测试
- 组件集成测试
- 游戏模式测试
- 自动化代码覆盖率统计

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### 生产环境构建

- **Rollup**：将 `js/main-es6.js` 打包为支持代码分割和 sourcemap 的 ESM 格式
- **Terser**：自动代码压缩以进行优化
- **构建后处理（Post-build）**：复制 `css/` 和 `assets/`、网站图标（`favicon.ico`、`favicon.png`、`favicon.svg`）、`sw.js`，并将 `dist/index.html` 重写为指向带哈希的入口文件（例如：`main-es6-*.js`）
- **最终产物目录**：`dist/`，可直接用于静态托管服务

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 持续集成

**GitHub Actions**：`.github/workflows/ci.yml`，在每次推送到 `main` 以及每次提交 pull request 时触发。

**`verify`**——阻塞性质量门禁：

- `npm ci` 然后执行 `npm run verify`（ESLint、Jest 测试、覆盖率）
- `npm run format:check`（Prettier）

**`seo-report`**——在 `verify` 之后运行：对线上网站进行 Lighthouse 审计，以长期跟踪 SEO 指标。

**接入 Pull Request 的外部分析**：Codacy、CodeFactor 和 SonarCloud。SonarCloud 门禁要求新代码在可靠性、安全性和可维护性方面均达到 A 级评分。

**部署**：`./deploy.sh` 将站点同步至 S3 并刷新 CloudFront 缓存。该脚本会根据需要重新生成 git 中未包含的自适应图片。

### PWA（渐进式 Web 应用）

LeapMultix 是一款功能完备的 PWA，支持离线运行和本地安装。

**Service Worker**（`sw.js`）：

- 导航：网络优先（Network-first），离线时回退到 `offline.html`
- 图像：缓存优先（Cache-first）以优化性能
- 翻译文件：陈旧重验证（Stale-while-revalidate）以在后台更新
- JS/CSS：网络优先以始终提供最新版本
- 通过 `cache-updater.js` 自动管理版本

**Manifest**（`manifest.json`）：

- 适用于所有设备的 SVG 和 PNG 图标
- 支持移动端安装（添加到主屏幕）
- 独立（standalone）配置带来类似原生应用的体验
- 主题和配色支持

**在本地测试离线模式。** 启动服务器，然后打开 `http://localhost:8080`（或显示的端口）：

```bash
npm run serve
```

手动测试：在开发者工具中切断网络（“网络”选项卡，离线模式），然后刷新页面。此时应显示 `offline.html`。

使用 Puppeteer 进行自动化测试：

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

- **ESLint**：支持 flat config（`eslint.config.js`）的现代化配置，支持 ES2022
- **Prettier**：代码自动格式化（`.prettierrc`）
- **Stylelint**：CSS 校验（`.stylelintrc.json`）
- **JSDoc**：带覆盖率分析的函数自动化文档

**重要代码规则**：

- 移除未使用的变量与参数（`no-unused-vars`）
- 使用具体的错误处理（杜绝空的 catch 块）
- 避免使用 `innerHTML`，优先采用 `security-utils.js` 函数
- 函数认知复杂度保持 < 15
- 将复杂函数提取为更小的辅助函数

**安全性**：

- **XSS 防护**：使用 `security-utils.js` 的函数：
  - 使用 `appendSanitizedHTML()` 代替 `innerHTML`
  - 使用 `createSafeElement()` 创建安全元素
  - 使用 `setSafeMessage()` 处理文本内容
- **外部脚本**：强制使用 `crossorigin="anonymous"` 属性
- **输入验证**：始终对外部数据进行净化
- **内容安全策略**：使用 CSP 请求头限制脚本来源

**可访问性**：

- 符合 WCAG 2.1 AA 标准
- 完整的键盘导航
- 适当的 ARIA 角色与标签
- 符合规范的颜色对比度

**性能**：

- 通过 `lazy-loader.js` 延迟加载模块
- CSS 优化与响应式资源
- 用于智能缓存的 Service Worker
- 生产环境中的代码分割与代码压缩

## 📱 兼容性

### 支持的浏览器

界面依赖 `oklch()` 处理颜色，并依赖 `:has()` 处理上下文状态，因此设定的最低兼容要求如下：

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### 设备

- **桌面端**：键盘和鼠标控制
- **平板电脑**：优化的触控界面
- **智能手机**：自适应响应式设计

### 可访问性

- 完整的键盘导航（Tab、方向键、Esc）
- 适用于屏幕阅读器的 ARIA 角色与标签
- 符合规范的颜色对比度
- 支持辅助技术

## 🌍 本地化

完整的全多语言支持：

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

**功能特性：**

- 检测缺失的键（存在于 fr.json 但在其他语言中缺失）
- 检测多余的键（存在于其他语言但不存在于 fr.json）
- 识别空值（`""`、`null`、`undefined`、`[]`）
- 检查类型一致性（string 对比 array）
- 将嵌套的 JSON 结构展平为点分表示法（例如：`arcade.multiMemory.title`）
- 生成详细的控制台报告
- 将 JSON 报告保存到 `docs/translations-comparison-report.json`

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

- 完整用户界面
- 游戏说明与指导
- 错误与反馈消息
- 描述与上下文帮助
- 冒险模式叙事内容
- 可访问性与 ARIA 标签

## 🔊 录制语音

游戏会朗读题目、鼓励语句和解析。它所朗诵的句子集合是有限的，每种语言约 7,400 句：因此可以一次性录制完成，这样游戏在进行时就无需调用任何语音合成服务。在没有音频片段时，游戏会使用设备的默认语音进行朗读。

### 在此仓库中：无语音的应用

代码能够播放预录制的音频片段，并且包含生成这些音频的工具链。仓库中不包含音频片段本身，也不包含供应商的密钥：Fork 本项目或在本地安装运行时，将使用设备的语音进行朗读。

- **逐句自动降级**为设备语音：音频片段缺失或出错、浏览器拒绝播放、音频在 1.5 秒内未能开始播放，或离线且缓存中没有该片段。
- **设置**：顶部栏的语音按钮可开启或静音朗读；“录制语音”复选框（位于“可访问性与控制”中）可在录制语音与设备语音之间进行选择。该选项仅在已发布语音的语言中显示。
- **离线使用**：已听过的音频片段会保留在缓存中（Service Worker）。
- **游戏在何处寻找音频片段**：在 `<meta name="leapmultix-voice-base">` 标签中查找，在仓库中该标签为空。仅生产环境部署会在其中写入 `/voice/`。

如果你在本地计算机上有自己的音频片段（由下述工具链生成，并存放在游戏旁边的 `../leapmultix-voices` 中），参数 `?voix=local` 可让开发服务器读取它们：

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### 在 leapmultix.jls42.org 上：托管站点的语音

作者提供的站点提供以下录制的合成语音：

- 法语：**Lucie**，使用 ElevenLabs（Eleven v3 模型）生成；
- 英式英语与西班牙语（西班牙）：**Sulafat**，使用 Google Cloud Text-to-Speech（Chirp 3 HD 语音）生成；
- 供玩家选择的还有法语的 **Marie** 与英语的 **Jane**，由 Mistral AI（Voxtral TTS）生成。

音频片段存放在一个私有仓库和一个专用的 S3 存储桶中，通过位于 `/voice/*` 的 CloudFront 分发。在设置中，如果某种语言有多个语音，则“语音”菜单会列出这些语音，并且标注会指明当前收听语音的服务提供商。

### 生成音频片段

该工具链通过 `scripts/voice/` 中的脚本实现，在项目所有者的计算机上运行，绝不在公开 CI 中运行。各提供商的密钥（法语使用 ElevenLabs，英语和西班牙语使用 Google Cloud Text-to-Speech，Marie 和 Jane 使用 Mistral）保存在仓库外的 `.env` 文件中，并通过 `node --env-file` 传递：没有任何密钥会进入 git。Claude Code 技能 [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) 逐步执行此流程（门禁、一致性、恢复中断）；详细信息见 [`docs/voix-enregistree.md`](docs/voix-enregistree.md)。

1. **预估**剩余句子以及需付费的字符数（Eleven v3：每字符约 0.53 积分；Chirp 3 HD：每百万字符 30 美元，每月前一百万字符免费；Voxtral TTS：每百万字符 16 美元）。
2. **生成**。重新运行相同的命令会续传未完成的部分。当积分耗尽时，脚本会正常退出（退出码 3），不会留下写入一半的文件。`--max-total-chars` 对该版本的累计支出设置了上限：每次付费响应在接收时就会记录在日志中，即使异常中断也能留存。由于 Google 和 Mistral 不提供可读取的余额信息，这是唯一的保护措施。
3. **检查**：确保每个句子都有对应的音频片段且每个 MP3 均有效。随后 Whisper 会在本地对每个音频片段进行转录，检查工具会标记出听错的数字和异常时长。`voice:review` 可以通过一条命令串联运行 Whisper、此项检查以及试听页面。
4. **试听**：在试听页面（`voice:listen`）上收听被标记的音频片段以及部分阴性形式样本（如“une fois 7”），后者 Whisper 无法区分。每个片段都有一个“重新录制”复选框，勾选后会将其添加到剔除片段列表中。
5. **重录**剔除的音频片段（`--redo`）并重新运行 Whisper，然后在第二个页面上对比每个片段的前后效果。如果尝试两三次后发音仍然有误的片段，可在 `SAID_OVERRIDES`（`scripts/voice/said-text.mjs`）中指定发音文本，例如将数字写为文字拼写形式。
6. **发布**音频片段，验证它们是否可以在线访问，然后发布该语言的索引，首先供测试人员使用（`?voix=test`）。
7. **全员开放**该语音，随后设为默认启用。熔断机制（`voice:publish -- remove`）可从索引中移除某种语言：游戏将回退至设备语音。

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

### 规则：修改过的口播句子必须在上线生产前重新录制

所有口播句子均来自翻译文件（`assets/translations/{fr,en,es}.json`）且属于语料库的一部分。因此，修改口播句子会导致语料库锁测试（`scripts/voice/corpus.lock.json`）失败。对于已录制语音的语言，需要为受影响的句子生成音频片段，进行检查和试听，并在合并**之前**发布。最后再更新锁文件（`npm run voice:corpus:lock`）。如果没有这些音频片段，修改后的句子将使用设备语音朗读。

## 📊 数据存储

### 用户数据

- 配置文件与偏好设置
- 各游戏模式的进度
- 街机游戏得分与统计数据
- 个性化设置

### 技术特性

- 带降级备用方案的本地存储（localStorage）
- 按用户进行数据隔离
- 进度自动保存
- 旧数据自动迁移

## 🐛 报告问题

可以通过 GitHub Issues 报告问题。请附上：

- 问题的详细描述
- 重现步骤
- 浏览器及其版本
- 相关的屏幕截图（如有）

## 💝 支持项目

**[☕ 通过 PayPal 捐赠](https://paypal.me/jls)**

## 📄 许可证

本项目遵循 AGPL v3 许可证。详见 `LICENSE` 文件。

---

_LeapMultix — 用于学习四则运算的自由开源教育应用_

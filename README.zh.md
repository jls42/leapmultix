<details>
<summary>本文档还提供其他语言版本</summary>

- [英语](./README.en.md)
- [西班牙语](./README.es.md)
- [葡萄牙语](./README.pt.md)
- [德语](./README.de.md)
- [中文](./README.zh.md)
- [印地语](./README.hi.md)
- [阿拉伯语](./README.ar.md)
- [意大利语](./README.it.md)
- [瑞典语](./README.sv.md)
- [波兰语](./README.pl.md)
- [荷兰语](./README.nl.md)
- [罗马尼亚语](./README.ro.md)
- [日语](./README.ja.md)
- [韩语](./README.ko.md)

</details>

# LeapMultix

![持续集成](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![许可证：AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy 徽章](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![质量门禁状态](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![可靠性评级](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![安全性评级](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![可维护性评级](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![技术债务](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![缺陷](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![漏洞](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![代码异味](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![重复行（%）](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![代码行数](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## 目录

- [说明](#说明)
- [预览](#-预览)
- [功能](#-功能)
- [快速开始](#-快速开始)
- [架构](#-架构)
- [游戏模式详解](#-游戏模式详解)
- [开发](#-开发)
- [兼容性](#-兼容性)
- [本地化](#-本地化)
- [预录语音](#-录制语音)
- [数据存储](#-数据存储)
- [报告问题](#-报告问题)
- [许可证](#-许可证)

## 说明

LeapMultix 是一款面向 6 至 12 岁儿童的交互式教育 Web 应用，旨在帮助他们掌握四则算术运算：乘法（×）、加法（+）、减法（−）和除法（÷）。它通过直观、无障碍且支持多语言的界面，提供 **6 种游戏模式**和 **4 款街机小游戏**。

**支持多种运算：**所有模式均支持四种运算。可在主屏幕上选择运算类型，该选择将应用于整个游戏流程。

**开发者：** Julien LS（contact@jls42.org）

**在线网址：** https://leapmultix.jls42.org/

## 📸 预览

### 各个界面

|                                                                                           |                                                                                  |
| :---------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
|                ![“谁来玩？”界面：选择用户档案](docs/media/01-accueil.webp)                |              ![主菜单：选择运算和游戏模式](docs/media/02-menu.webp)              |
|           **谁来玩？** — 每个孩子拥有独立的用户档案，其中包含其头像和学习进度。           |                   **菜单** — 先在此选择运算，再选择游戏模式。                    |
|             ![探索模式：用圆点展示 4 的乘法表](docs/media/03-decouverte.webp)             |   ![测验模式：错误答案显示为红色，正确答案显示为绿色](docs/media/04-quiz.webp)   |
|       **探索** — 每个等式都通过圆点、跳跃或计数进行展示，并附有该乘法表的记忆技巧。       |   **测验** — 孩子选择的答案会与正确答案并排保留显示，同时提供详细的计算讲解。    |
|              ![挑战模式：倒计时和当前连续答对次数](docs/media/05-defi.webp)               | ![冒险模式：十个关卡的地图，后续关卡仍处于锁定状态](docs/media/06-aventure.webp) |
|              **挑战** — 与时间赛跑。答错时，计时器会暂停，以便查看正确答案。              |                **冒险** — 十个依次解锁的关卡，需要使用星星开启。                 |
|          ![计时模式：一场减法竞赛，以及计时器和进度](docs/media/14-chrono.webp)           |                ![街机菜单：四款小游戏](docs/media/07-arcade.webp)                |
|         **计时** — 在所选运算中与时间赛跑，答对十题；答错的算式会加入待复习列表。         |                  **街机** — 四款小游戏，可设置难度并选择飞船。                   |
| ![仪表板：按运算详细列出各模式的对局、纪录和答题情况](docs/media/08-tableau-de-bord.webp) |    ![个性化设置：头像、主题和无障碍选项](docs/media/09-personnalisation.webp)    |
|   **仪表板** — 按运算详细列出各模式的对局和纪录；乘法模式还会显示星星和待复习的乘法表。   |    **个性化设置** — 使用金币解锁头像，并可调整配色主题、文字大小和高对比度。     |

### 街机小游戏

四款游戏都会提出同一个问题——问题显示在游戏区域上方，同时显示剩余时间和生命值——但每款游戏都需要采用不同的操作方式。

|                                                                                                        |                                                                              |
| :----------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------: |
|       ![MultiInvaders：携带数字的怪物，以及屏幕底部的一艘飞船](docs/media/10-multiinvaders.webp)       |   ![MultiMiam：迷宫中的圆点上标有可能的答案](docs/media/11-multimiam.webp)   |
|          **MultiInvaders** — 射击错误答案并放过正确答案：正确答案背后藏着一位等待解救的朋友。          |             **MultiMiam** — 穿过迷宫抓取正确结果，同时避开怪物。             |
| ![MultiMemory：卡片网格，其中两张翻开的卡片分别显示一道算式和一个数字](docs/media/12-multimemory.webp) | ![MultiSnake：草地上的一条蛇和带有数字的苹果](docs/media/13-multisnake.webp) |
|                       **MultiMemory** — 凭记忆找出哪张卡片写有已翻开算式的结果。                       |        **MultiSnake** — 吃下正确数字让身体变长，并避开其他所有数字。         |

## ✨ 功能

### 🎮 游戏模式

- **探索模式**：适配每种运算的可视化交互式探索
- **测验模式**：支持四种运算（×、+、−、÷）并具有自适应进度的选择题
- **挑战模式**：支持四种运算（×、+、−、÷）并提供不同难度级别的限时竞赛
- **冒险模式**：支持四种运算的叙事式关卡进度
- **计时模式**：在永不停下的计时器下答对 10 题，以打破自己的最佳时间纪录，支持四种运算（×、+、−、÷）

### 🕹️ 街机小游戏

- **MultiInvaders**：教育版 Space Invaders——消灭错误答案
- **MultiMiam**：数学版 Pac-Man——收集正确答案
- **MultiMemory**：记忆游戏——匹配运算与结果
- **MultiSnake**：教育版 Snake——吃下正确数字，让身体变长

### ➕ 支持多种运算

LeapMultix 在**所有模式**中均提供完整的四则算术运算训练：

| 模式 | ×   | +   | −   | ÷   |
| ---- | --- | --- | --- | --- |
| 测验 | ✅  | ✅  | ✅  | ✅  |
| 挑战 | ✅  | ✅  | ✅  | ✅  |
| 探索 | ✅  | ✅  | ✅  | ✅  |
| 冒险 | ✅  | ✅  | ✅  | ✅  |
| 计时 | ✅  | ✅  | ✅  | ✅  |
| 街机 | ✅  | ✅  | ✅  | ✅  |

### 🌍 通用功能

- **多用户**：每个孩子拥有独立的用户档案和学习进度；在教室设备上，名字按顺序排列，玩家达到 10 人后提供筛选功能，回收站保留 30 天，并可将玩家数据保存到文件中
- **多语言**：支持法语、英语和西班牙语
- **个性化设置**：头像（第一个可自由选择，其余头像可使用游戏中获得的金币解锁，每个需要 50 枚金币）、配色主题和背景
- **无障碍功能**：完整的键盘导航、触控支持、街机模式暂停、文字大小和高对比度；已使用 axe-core 检查，浏览过的界面不存在 WCAG A 级或 AA 级违规
- **预录语音**：游戏可以使用预先录制的合成语音朗读问题和鼓励语，并在无法使用时自动回退到设备语音。这些语音不包含在本仓库中：网站 leapmultix.jls42.org 的法语默认使用 Lucie，英语和西班牙语使用 Sulafat；法语还可在 Sulafat 和 Marie 之间选择，英语可选择 Jane（参见[预录语音](#-录制语音)）
- **移动端响应式设计**：针对平板电脑和智能手机优化的界面
- **进度系统**：按用户档案提供仪表板（按运算详细列出对局、纪录和待复习的乘法表）、徽章、每日挑战和金币（可在计时、冒险、挑战和每日挑战中获得）

## 🚀 快速开始

### 前置要求

- Node.js（版本 16 或更高）
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

## 🧱 架构

### 文件结构

JavaScript 模块**平铺在 `js/` 中**，仅有三个例外目录：
`core/`、`components/` 和 `modes/`。因此，文件名本身用于表示分组
（`arcade-*`、`multimiam-*`、`i18n*`……）。

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

### 技术架构

**现代 ES6 模块**：项目采用模块化架构，使用 ES6 类和原生导入/导出。

**可复用组件**：界面使用集中管理的 UI 组件构建（TopBar、InfoBar、Dashboard、Customization）。

**Lazy Loading**：通过 `lazy-loader.js` 按需智能加载模块，以优化初始性能。

**统一存储系统**：通过 LocalStorage 及其回退方案，使用集中式 API 持久化用户数据。

**集中式音频管理**：支持多语言和按用户设置偏好的声音控制。

**Event Bus**：组件之间通过解耦的事件通信实现易于维护的架构。

**幻灯片式导航**：基于编号幻灯片（slide0、slide1 等）并使用 `goToSlide()` 的导航系统。

**安全性**：所有 DOM 操作均通过 `security-utils.js` 提供 XSS 防护和净化处理。

## 🎯 游戏模式详解

### 探索模式

适配每种运算的可视化探索界面，包括：

- 乘法的交互式可视化
- 动画和记忆提示
- 教育性拖放操作
- 按乘法表自由学习

### 测验模式

选择题功能包括：

- 每轮 10 道题
- 根据答题表现自适应调整进度
- 虚拟数字键盘
- 连续答对计数系统

### 挑战模式

限时竞赛功能包括：

- 3 个难度级别（初级、中级、困难）
- 答对可获得时间奖励
- 生命值系统
- 最高分排行榜

### 冒险模式

叙事式进度功能包括：

- 10 个可解锁的主题关卡
- 具有可视化进度的交互式地图
- 包含角色的沉浸式故事
- 星星和奖励系统

### 计时模式

在永不停下的计时器下尽快答对十题：

- 四种运算：乘法表（在乘法表设置中配置），以及所有加法表（7 + k）、减法表（(7 + k) − 7）和除法表（(7 × k) ÷ 7）
- 可通过选择或数字键盘作答，支持点击和键盘操作
- 按运算分别记录最佳时间、平均时间和最近几轮的曲线图
- “我的待复习算式”：每种运算各有一个列表，并从两个方向复习（6 × 7 和 7 × 6，15 − 7 和 15 − 8）

### 仪表板

按用户档案展示孩子实际玩过的内容：

- 冒险模式的星星和待复习的乘法表（每张乘法表最近 20 次作答）
- 测验、挑战、冒险和计时模式中的题目数与正确答案数
- 每种模式和每款小游戏的对局与纪录，包括中途退出的对局；当孩子练习多种运算时，还会按运算详细列出

### 街机小游戏

每款小游戏均提供：

- 四种运算中的三个难度级别
- 生命值和得分系统
- 鼠标、键盘和触控操作，具体说明见游戏介绍页
- 暂停：点击时间旁边的按钮或按 P 键；标签页被隐藏时游戏也会暂停，且绝不会自动恢复
- MultiMemory：可选择不限时对局
- 游戏区域会充分利用可用空间（手机竖屏时高度大于宽度），并可在电脑和手机上全屏显示，包括旋转后的手机（iPhone 除外，因为其浏览器不支持）
- 每位玩家的最高分；“重置”操作会明确说明将删除哪些内容

## 🔧 开发

### 开发工作流

**切勿直接提交到 main。** 项目通过功能分支进行开发。

**1. 创建分支**，功能使用 `feat/`，修复使用 `fix/`：

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. 开发并验证。** 首先进行格式化：CI 会在运行测试之前就拒绝格式不合规的代码。

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. 在分支上提交**，然后推送：

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. 创建 pull request**并等待分析完成：verify、Codacy、CodeFactor 和 SonarCloud。修复所有问题，确保状态全部变绿后再合并。

**提交风格**：消息应简洁并使用祈使语气（例如：“Fix arcade init errors”“Refactor cache updater”）

**质量门禁**：确保每次提交前 `npm run lint`、`npm test` 和 `npm run test:coverage` 均能通过

### 组件架构

**GameMode（基类）**：所有模式都继承自一个具有标准化方法的公共类。

**GameModeManager**：集中协调各模式的启动和管理。

**UI 组件**：TopBar、InfoBar、Dashboard 和 Customization 提供一致的界面。

**Lazy Loading**：按需加载模块以优化初始性能。

**Event Bus**：组件通过事件系统进行解耦通信。

### 测试

项目包含完整的测试套件：

- 核心模块的单元测试
- 组件的集成测试
- 游戏模式测试
- 自动化代码覆盖率统计

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### 生产构建

- **Rollup**：将 `js/main-es6.js` 打包为 ESM，并启用代码拆分和 sourcemap
- **Terser**：自动压缩以进行优化
- **构建后处理**：复制 `css/` 和 `assets/`、favicon（`favicon.ico`、`favicon.png`、`favicon.svg`）以及 `sw.js`，并将 `dist/index.html` 重写为带哈希的入口文件（例如 `main-es6-*.js`）
- **最终目录**：`dist/`，可直接作为静态内容提供

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### 持续集成

**GitHub Actions**：`.github/workflows/ci.yml`，在每次推送到
`main` 以及每次 pull request 时触发。

**`verify`**——阻断式质量门禁：

- `npm ci`，然后是 `npm run verify`（ESLint、Jest 测试、覆盖率）
- `npm run format:check`（Prettier）

**`seo-report`**——在 `verify` 之后：对线上网站执行 Lighthouse 审计，以便
长期跟踪 SEO 指标。

连接到 pull request 的**外部分析**：Codacy、CodeFactor 和
SonarCloud。SonarCloud 门禁要求新代码在可靠性、安全性和
可维护性方面均获得 A 级评分。

**部署**：`./deploy.sh` 将网站同步到 S3，并使
CloudFront 缓存失效。必要时，该脚本会重新生成 git 中没有的响应式图片。

### PWA（Progressive Web App）

LeapMultix 是一款完整的 PWA，支持离线使用和安装。

**Service Worker**（`sw.js`）：

- 安装：预加载游戏所需的所有内容，其列表由 `scripts/precache-list.mjs` 从代码生成（`npm run precache:update`，并由测试验证）：首次访问后，6 种模式和 4 款 Arcade 游戏都可离线启动
- 导航：Network-first；离线时使用缓存中的游戏页面（仅从未缓存过页面时使用 `offline.html`）
- 图片：Cache-first；离线时使用同一 sprite 的其他尺寸，或同一头像的其他背景
- 翻译：使用 Stale-while-revalidate 在后台更新
- JS/CSS：Network-first，以始终提供最新版本，并保留离线缓存
- 声音和字体：Cache-first，并支持提供字节范围（Safari 音频播放器）
- 通过 `cache-updater.js` 自动管理版本

**Manifest**（`manifest.json`）：

- 为所有设备提供 SVG 和 PNG 图标
- 可在移动设备上安装（Add to Home Screen）
- 使用 standalone 配置，提供类似原生应用的体验
- 支持主题和颜色

**在本地测试离线模式。** 启动服务器，然后打开
`http://localhost:8080`（或显示的端口）：

```bash
npm run serve
```

手动测试：保持页面打开，等待 service worker 注册游戏，然后停止
服务器（或断开设备网络），再刷新页面。游戏应能
正常显示，并且每种模式都应能启动。

使用 Puppeteer 自动测试：

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

- **ESLint**：采用 flat config 的现代配置（`eslint.config.js`），支持 ES2022
- **Prettier**：自动格式化代码（`.prettierrc`）
- **Stylelint**：验证 CSS（`.stylelintrc.json`）
- **JSDoc**：自动生成函数文档并分析覆盖率

**重要代码规则**：

- 删除未使用的变量和参数（`no-unused-vars`）
- 使用明确的错误处理（不得使用空 catch）
- 避免使用 `innerHTML`，改用 `security-utils.js` 函数
- 函数的认知复杂度保持在 15 以下
- 将复杂函数提取为更小的 helper

**安全性**：

- **XSS 防护**：使用 `security-utils.js` 中的函数：
  - 使用 `appendSanitizedHTML()`，而不是 `innerHTML`
  - 使用 `createSafeElement()` 创建安全元素
  - 使用 `setSafeMessage()` 处理文本内容
- **外部脚本**：必须使用 `crossorigin="anonymous"` 属性
- **输入验证**：始终净化外部数据
- **Content Security Policy**：使用 CSP header 限制脚本来源

**无障碍性**：

- 目标为 WCAG 2.1 AA 级，并使用 axe-core 检查：不得存在 A 级、AA 级或最佳实践违规
- 完整支持键盘导航
- 提供 ARIA role 和无障碍名称
- 使用 axe-core 检查对比度

**性能**：

- 通过 `lazy-loader.js` 延迟加载模块
- CSS 优化和响应式资源
- 使用 Service Worker 实现智能缓存
- 在生产环境中进行代码拆分和压缩

## 📱 兼容性

### 支持的浏览器

界面的颜色依赖 `oklch()`，上下文状态依赖 `:has()`，
因此最低版本要求如下：

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### 设备

- **桌面设备**：键盘和鼠标控制
- **平板电脑**：经过优化的触控界面
- **智能手机**：自适应响应式设计

### 无障碍性

- 完整的键盘导航：Tab、在答案网格和 MultiMemory 卡片中使用方向键、Enter、Esc；首页顶部提供“前往游戏模式”链接
- 退出游戏只遵循一条规则：“放弃”、Esc 或顶部栏按钮都会提出相同的问题；如果孩子拒绝，游戏将继续
- 屏幕阅读器：每个答案都与对应问题关联；每个界面有一个一级标题；消息会被朗读
- 页面支持双指缩放（Arcade 游戏除外）；支持调整文本大小、高对比度、减少动画，以及一种衍生自 Andika、专为初学阅读者设计的字体
- Arcade：支持暂停（按钮、P 键或标签页隐藏时）；MultiMemory 可选择不限时
- 使用 axe-core 检查（WCAG 2.0 至 2.2、A 级和 AA 级以及最佳实践）：在桌面宽度下的 41 个界面和手机宽度（390 px）下的 40 个界面中均无违规，包括夜间主题和高对比度模式

## 🌍 本地化

完整的多语言支持：

- **法语**（默认语言）
- **英语**
- **西班牙语**

### 翻译管理

**翻译文件：** `assets/translations/*.json`

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

**`npm run i18n:compare`** - 将翻译文件与 fr.json（基准）进行比较

该脚本（`scripts/compare-translations.cjs`）确保所有语言文件保持同步：

**功能：**

- 检测缺失的键（存在于 fr.json 中，但其他语言中没有）
- 检测额外的键（存在于其他语言中，但 fr.json 中没有）
- 识别空值（`""`、`null`、`undefined`、`[]`）
- 检查类型一致性（string 与 array）
- 将嵌套 JSON 结构展平为点号表示法（例如：`arcade.multiMemory.title`）
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

- 完整的用户界面
- 游戏说明
- 错误和反馈消息
- 说明和上下文帮助
- 冒险模式的叙事内容
- 无障碍标签和 ARIA

## 🔊 录制语音

游戏会大声朗读问题、鼓励语和说明。它只会说一组有限的句子，每种语言约 7,400 句，因此可以一次性全部录制，此后任何游戏过程都无需调用语音合成服务。没有音频片段时，游戏会使用设备语音朗读。

### 此仓库中：应用程序，但不含语音

代码能够播放预录制的音频片段，并包含生成这些片段的流水线。音频片段和服务提供商的密钥均不包含在仓库中：fork 或本地安装会使用设备语音朗读。

- **自动回退**到设备语音，并逐句处理：音频片段缺失或出错、浏览器拒绝播放、音频片段在 1.5 秒内未开始播放，或离线时缓存中没有该片段。
- **设置**：顶部栏的语音按钮用于启用或关闭朗读；“录制语音”复选框（无障碍与控制）用于在录制语音和设备语音之间选择。它仅在已发布语音的语言中显示。
- **离线**：已经听过的音频片段会保留在缓存中（service worker）。
- **游戏在哪里查找音频片段**：在 `<meta name="leapmultix-voice-base">` 标签中查找，该标签在仓库中为空。只有生产部署会向其中写入 `/voice/`。

如果本机上有自己的音频片段（由下述流水线生成，并与游戏一同放在 `../leapmultix-voices` 中），参数 `?voix=local` 会让开发服务器播放这些片段：

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### 在 leapmultix.jls42.org 上：托管语音

作者提供的网站会播放已录制的合成语音：

- 法语使用 **Lucie**，由 ElevenLabs 创建（Eleven v3 模型）；
- 英式英语和西班牙西班牙语使用 **Sulafat**，由 Google Cloud Text-to-Speech 创建（Chirp 3 HD 语音）；
- 玩家也可以在法语中选择 **Sulafat**，从而在三种语言中保持相同的声音；
- 玩家还可以选择法语的 **Marie** 和英语的 **Jane**，它们由 Mistral AI 创建（Voxtral TTS）。

音频片段存放在私有仓库和专用 S3 bucket 中，并通过 CloudFront 在 `/voice/*` 上提供。它们只生成一次：游戏过程中不会向这些服务发送任何内容。在设置中，如果一种语言有多个语音，“语音”菜单会提供相应选项，并标明当前所听语音使用的服务。

### 生成音频片段

该流水线编写在 `scripts/voice/` 中，只在所有者的电脑上运行，绝不会在公共 CI 中运行。服务提供商的密钥（Lucie 使用 ElevenLabs、Sulafat 使用 Google Cloud Text-to-Speech、Marie 和 Jane 使用 Mistral）保存在仓库外的 `.env` 文件中，并通过 `node --env-file` 传入：任何密钥都不会进入 git。Claude Code skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) 会逐步执行流程（门禁、确认、恢复）；详细说明见 [`docs/voix-enregistree.md`](docs/voix-enregistree.md)。

1. **估算**剩余句子数量和需要付费的字符数（Eleven v3：每个字符约 0.53 个额度；Chirp 3 HD：每百万字符 30 美元，每月首个一百万字符免费；Voxtral TTS：每百万字符 16 美元）。
2. **生成**。重新运行同一命令会继续生成缺失内容。当额度耗尽时，脚本会正常停止（代码 3），不会留下写入不完整的文件。`--max-total-chars` 限制该版本的累计支出：每次收到付费响应后都会立即登记到记录中，即使进程突然中止，记录也会保留。对于无法查询余额的 Google 和 Mistral，这是唯一的保护措施。
3. **检查**：每个句子都有对应的音频片段，并且每个 MP3 都有效。随后 Whisper 会在本地转录每个片段，检查程序会标记听错的数字和异常时长。`voice:review` 可通过一条命令依次运行 Whisper、该检查以及试听页面。
4. 在试听页面（`voice:listen`）上**试听**被标记的音频片段，以及一组阴性形式样本（“一次 7”），因为 Whisper 无法区分这些形式。每个片段都有一个“重新生成”复选框，选中后会将其加入弃用片段列表。
5. **重新生成**弃用的音频片段（`--redo`），再次运行 Whisper，然后在第二个页面上逐个比较重新生成前后的片段。如果某个片段尝试两三次后发音仍然错误，则在 `SAID_OVERRIDES`（`scripts/voice/said-text.mjs`）中为其指定文本，例如将数字完整拼写出来。
6. **发布**音频片段，确认它们可在线访问，然后发布该语言的索引，并先向测试人员开放（`?voix=test`）。
7. 向所有人**开放**该语音，然后将其设为默认语音。熔断开关（`voice:publish -- remove`）可从索引中移除一种语言：游戏将恢复使用设备语音。

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

### 规则：修改任何朗读句子后，必须在投入生产环境前重新录制

所有朗读句子都来自翻译文件（`assets/translations/{fr,en,es}.json`），并属于语料库的一部分。因此，修改朗读句子会导致语料库锁定测试（`scripts/voice/corpus.lock.json`）失败。对于已有录制语音的语言，需要生成受影响句子的音频片段，进行检查和试听，然后在合并**之前**发布。最后更新锁定文件（`npm run voice:corpus:lock`）。如果没有这些音频片段，修改后的句子将使用设备语音朗读。

## 📊 数据存储

### 用户数据

- 个人资料和偏好设置
- 各游戏模式的进度
- Arcade 游戏的分数和统计数据
- 个性化设置

### 技术功能

- 使用带 fallback 的本地存储（localStorage）；并请求浏览器不要自行清除这些数据（`navigator.storage.persist()`）
- 已删除玩家的回收站：完整数据保留 30 天，可从“谁在玩？”中恢复
- 将玩家数据备份到 JSON 文件，可在本设备或另一台设备上恢复（绝不会覆盖已存在的玩家）
- 游戏数据按个人资料隔离，包括按计算项目划分的统计数据：在共享设备上，一名玩家的错误不会影响另一名玩家收到的问题
- 自动保存进度
- 自动迁移旧数据

## 🐛 报告问题

可以通过 GitHub issue 报告问题。请包含：

- 问题的详细说明
- 重现步骤
- 浏览器及其版本
- 相关的截图

## 💝 支持项目

**[☕ 通过 PayPal 捐赠](https://paypal.me/jls)**

## 📄 许可证

本项目采用 AGPL v3 许可证。更多详情请参阅 `LICENSE` 文件。

---

_LeapMultix——用于学习四则运算的自由教育应用程序_

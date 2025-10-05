<details>
<summary>本文档也提供其他语言版本</summary>

- [Français](./README.md)
- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Deutsch](./README.de.md)
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

<!-- 徽章（GitHub迁移后更新<owner>/<repo>） -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## 目录

- [描述](#描述)
- [功能](#-功能)
- [快速入门](#-快速入门)
- [架构](#-架构)
- [详细游戏模式](#-详细游戏模式)
- [开发](#-开发)
- [兼容性](#-兼容性)
- [本地化](#-本地化)
- [数据存储](#-数据存储)
- [报告问题](#-报告问题)
- [许可证](#-许可证)

## 描述

LeapMultix 是一款现代化的互动式教育网络应用程序，专为儿童（8-12岁）设计，旨在帮助他们掌握乘法表。该应用程序通过一个直观、易于访问和多语言的界面，提供 **4 种经典游戏模式** 和 **4 种街机迷你游戏**。

**开发者：** Julien LS (contact@jls42.org)

**在线网址：** https://leapmultix.jls42.org/

## ✨ 功能

### 🎮 游戏模式

- **发现模式**：对乘法表进行视觉和互动式探索。
- **测验模式**：带有自适应进度的多项选择题。
- **挑战模式**：与时间赛跑，设有不同难度级别。
- **冒险模式**：通过带有互动地图的关卡进行叙事性晋级。

### 🕹️ 街机迷你游戏

- **MultiInvaders**：一款教育性的太空侵略者游戏 - 摧毁错误的答案。
- **MultiMiam**：一款数学吃豆人游戏 - 收集正确的答案。
- **MultiMemory**：一款记忆游戏 - 将乘法与其结果配对。
- **MultiSnake**：一款教育性的贪吃蛇游戏 - 通过吃掉正确的数字来成长。

### 🌍 通用功能

- **多用户**：管理个人配置文件并保存进度。
- **多语言**：支持法语、英语和西班牙语。
- **个性化**：头像、颜色主题、背景。
- **无障碍性**：键盘导航、触摸支持、符合WCAG 2.1 AA标准。
- **移动响应式**：为平板电脑和智能手机优化的界面。
- **进度系统**：分数、徽章、每日挑战。

## 🚀 快速入门

### 先决条件

- Node.js（版本16或更高）
- 现代网络浏览器

### 安装

```bash
# 克隆项目
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# 安装依赖项
npm install

# 启动开发服务器（选项1）
npm run serve
# 应用程序将可在 http://localhost:8080（或下一个可用端口）上访问

# 或使用Python（选项2）
python3 -m http.server 8000
# 应用程序将可在 http://localhost:8000 上访问
```

### 可用脚本

```bash
# 开发
npm run serve          # 本地服务器
npm run lint           # 代码检查
npm run test           # 运行所有测试 (CJS)
npm run test:coverage  # 带覆盖率的测试
npm run test:esm       # ESM测试 (tests-esm/ 文件夹, Jest vm-modules)
npm run test:pwa-offline # PWA离线测试 (需要Puppeteer), 在 `npm run serve` 之后运行

# 分析与维护
npm run analyze:jsdoc  # 文档分析
npm run improve:jsdoc  # 自动改进JSDoc
npm run audit:mobile   # 移动响应性测试
npm run audit:accessibility # 无障碍性测试
npm run dead-code      # 未使用代码检测
npm run analyze:globals # 全局变量分析
npm run analyze:dependencies # 依赖使用情况分析
npm run assets:analyze # 响应式资产分析
npm run assets:diff    # 资产比较
npm run i18n:compare   # 比较翻译 (en/es) 与 fr.json (参考)

# 构建与交付
npm run build          # 生产构建 (Rollup) + 构建后处理 (完整的 dist/)
npm run serve:dist     # 在 http://localhost:5000 (或可用端口) 上提供 dist/
```

## 🏗️ 架构

### 文件结构

```
leapmultix/
├── index.html              # 主入口点
├── js/
│   ├── core/               # 核心ES6模块
│   │   ├── GameMode.js     # 游戏模式基类
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # 存储API
│   │   ├── audio.js        # 声音管理
│   │   └── utils.js        # 通用工具
│   ├── components/         # 可重用UI组件
│   │   ├── topBar.js       # 导航栏
│   │   ├── infoBar.js      # 游戏信息栏
│   │   ├── dashboard.js    # 用户仪表板
│   │   └── customization.js # 个性化界面
│   ├── modes/              # 重构的游戏模式
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # 街机迷你游戏
│   ├── multimiam-*.js      # 吃豆人游戏模块
│   ├── multisnake.js       # 教育性贪吃蛇游戏
│   ├── main-es6.js         # ES6入口点
│   ├── main.js             # 主协调器
│   ├── lazy-loader.js      # 按需加载
│   └── utils-es6.js        # ES6工具
├── css/                    # 模块化样式
├── assets/                 # 资源
│   ├── images/             # 图像和精灵图
│   ├── sounds/             # 音效
│   ├── translations/       # 翻译文件
│   └── videos/             # 教程视频
└── tests/                  # 自动化测试
```

### 技术架构

**现代ES6模块**：项目使用模块化架构，采用ES6类和原生导入/导出。

**可重用组件**：界面使用集中的UI组件（TopBar、InfoBar、Dashboard）构建。

**懒加载**：按需智能加载模块以优化性能。

**统一存储系统**：用于用户数据持久化的集中式API。

**集中式音频管理**：支持多语言和用户偏好的声音控制。

## 🎯 详细游戏模式

### 发现模式

用于乘法表的视觉探索界面，具有：

- 乘法的互动式可视化
- 动画和助记符
- 教育性拖放
- 按表自由晋级

### 测验模式

多项选择题，具有：

- 每节10个问题
- 根据成功情况自适应晋级
- 虚拟数字键盘
- 连胜系统（一系列正确答案）

### 挑战模式

与时间赛跑，具有：

- 3个难度级别（初级、中级、困难）
- 正确答案的时间奖励
- 生命系统
- 高分排行榜

### 冒险模式

叙事性晋级，具有：

- 12个可解锁的主题关卡
- 带有视觉进度的互动地图
- 带有角色的沉浸式故事
- 星星和奖励系统

### 街机迷你游戏

每个迷你游戏提供：

- 难度选择和个性化
- 生命和分数系统
- 键盘和触摸控制
- 每个用户的个人排行榜

## 🛠️ 开发

### 组件架构

**GameMode（基类）**：所有模式都继承自一个具有标准化方法的通用类。

**GameModeManager**：用于启动和管理模式的集中式协调。

**UI组件**：TopBar、InfoBar、Dashboard和Customization提供一致的界面。

**懒加载**：模块按需加载以优化初始性能。

### 测试

该项目包括一个全面的测试套件：

- 核心模块的单元测试
- 组件的集成测试
- 游戏模式测试
- 自动化代码覆盖率

```bash
npm test              # 所有测试 (CJS)
npm test:core         # 核心模块测试
npm test:integration  # 集成测试
npm test:coverage     # 覆盖率报告
npm run test:esm      # ESM测试 (例如 components/dashboard) 通过 vm-modules
```

### 生产构建

- **Rollup**：将 `js/main-es6.js` 捆绑为ESM，具有代码拆分和sourcemaps。
- **Terser**：自动压缩以进行优化。
- **构建后处理**：复制 `css/` 和 `assets/`、favicons (`favicon.ico`, `favicon.png`, `favicon.svg`)、`sw.js`，并重写 `dist/index.html` 以指向哈希入口文件（例如 `main-es6-*.js`）。
- **最终文件夹**：`dist/` 已准备好进行静态部署。

```bash
npm run build      # 生成 dist/
npm run serve:dist # 部署 dist/ (端口 5000)
```

### 持续集成

**GitHub Actions**：`.github/workflows/ci.yml`

- **build-test**：`npm ci`、`lint`、`test`、`audit` + 覆盖率产物。
- **accessibility**：`npm run audit:accessibility`（非阻塞）。
- **test-esm**：`npm run test:esm` 与VM模块。
- **lighthouse**：移动性能审计（非阻塞），报告为产物。

### PWA（离线和安装）

- **Service Worker**：网络优先策略，带有离线回退；图像采用缓存优先策略；翻译采用stale-while-revalidate；JS/CSS采用网络优先。
- **Manifest**：SVG/PNG图标；可在移动设备上安装。
- **本地离线测试**：
  1. 运行 `npm run serve` 并打开 `http://localhost:8080`（或显示的端口）。
  2. 断开网络并刷新页面 → 将显示 `offline.html`。
  3. 自动化测试（需要Puppeteer）：`npm run test:pwa-offline`。

### 质量标准

- **ESLint**：JavaScript代码验证。
- **Prettier**：自动格式化。
- **JSDoc**：自动函数文档。
- **无障碍性**：符合WCAG 2.1 AA标准。
- **性能**：懒加载、CSS优化。

## 📱 兼容性

### 支持的浏览器

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 设备

- **桌面**：键盘和鼠标控制。
- **平板电脑**：优化的触摸界面。
- **智能手机**：自适应响应式设计。

### 无障碍性

- 完整的键盘导航（Tab、箭头、Esc）。
- 用于屏幕阅读器的ARIA角色和标签。
- 符合标准的颜色对比度。
- 支持辅助技术。

## 🌍 本地化

完全多语言支持：

- **法语**（默认语言）
- **英语**
- **西班牙语**

### 翻译管理

**翻译文件：** `assets/translations/*.json`

**格式：**

```json
{
  "menu_start": "开始",
  "quiz_correct": "做得好！",
  "arcade_invasion_title": "MultiInvaders"
}
```

**管理脚本：**

```bash
npm run i18n:verify  # 检查缺失/不一致的键
npm run i18n:unused  # 列出未使用的键
npm run i18n:compare   # 比较翻译 (en/es) 与 fr.json (参考)
```

**翻译覆盖范围：**

- 完整的用户界面
- 游戏说明
- 错误和反馈消息
- 描述和上下文帮助

## 📊 数据存储

### 用户数据

- 个人资料和偏好
- 按游戏模式的进度
- 街机游戏分数和统计数据
- 个性化设置

### 技术特点

- 本地存储（localStorage）与回退。
- 用户数据隔离。
- 自动进度保存。
- 旧数据的自动迁移。

## 🐛 报告问题

可以通过GitHub issues报告问题。请包括：

- 问题的详细描述。
- 重现问题的步骤。
- 浏览器和版本。
- 如果相关，请提供屏幕截图。

## 💝 支持项目

**[☕ 通过PayPal捐赠](https://paypal.me/jls)**

## 📄 许可证

该项目根据AGPL v3许可证授权。有关更多详细信息，请参阅 `LICENSE` 文件。

---

_LeapMultix - 一款用于学习乘法表的现代教育应用程序。_

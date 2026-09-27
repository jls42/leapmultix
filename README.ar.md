<details>
<summary>هذا المستند متاح أيضاً بلغات أخرى</summary>

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
![الترخيص: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![شارة Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![حالة بوابة الجودة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![تقييم الموثوقية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![تقييم الأمان](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![تقييم قابلية الصيانة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الديون التقنية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![الأخطاء البرمجية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الثغرات الأمنية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![مؤشرات رداءة الكود](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الأسطر المكررة (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![أسطر الكود](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## جدول المحتويات

- [الوصف](#الوصف)
- [نظرة عامة](#-نظرة-عامة)
- [الميزات](#-الميزات)
- [البدء السريع](#-البدء-السريع)
- [البنية البرمجية](#-البنية-البرمجية)
- [أوضاع اللعب بالتفصيل](#-أوضاع-اللعب-بالتفصيل)
- [التطوير](#-التطوير)
- [التوافق](#-التوافق)
- [التوطين](#-التعريب-والترجمة)
- [الصوت المسجل](#-الصوت-المسجل)
- [تخزين البيانات](#-تخزين-البيانات)
- [الإبلاغ عن مشكلة](#-الإبلاغ-عن-مشكلة)
- [الترخيص](#-الترخيص)

## الوصف

تطبيق LeapMultix هو تطبيق ويب تعليمي تفاعلي مخصص للأطفال من سن 6 إلى 12 عاماً لإتقان العمليات الحسابية الأربع: الضرب (×)، والجمع (+)، والطرح (−)، والقسمة (÷). يتيح التطبيق **5 أوضاع لعب** و**4 ألعاب أركيد مصغرة** عبر واجهة بديهية، وميسرة، ومتعددة اللغات.

**دعم العمليات المتعددة:** تدعم الأوضاع الخمسة العمليات الأربع جميعها. يتم الاختيار من شاشة البداية ويسري على كامل مسار اللعب.

**تطوير:** Julien LS (contact@jls42.org)

**الرابط على الإنترنت:** https://leapmultix.jls42.org/

## 📸 نظرة عامة

### الشاشات

|                                                                                          |                                                                                                  |
| :--------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
|           ![شاشة «من يلعب؟»: اختيار الملف الشخصي](docs/media/01-accueil.webp)            |           ![القائمة الرئيسية: اختيار العملية والأوضاع الخمسة](docs/media/02-menu.webp)           |
|             **من يلعب؟** — ملف شخصي لكل طفل، مع صورته الرمزية ومستوى تقدمه.              |                   **القائمة** — تُحدد العملية من هنا، ثم تتاح الأوضاع الخمسة.                    |
|    ![وضع الاستكشاف: جدول الضرب للعدد 4 معروض بالنقاط](docs/media/03-decouverte.webp)     | ![وضع الاختبار: الإجابة الخاطئة باللون الأحمر والإجابة الصحيحة بالأخضر](docs/media/04-quiz.webp) |
|       **الاستكشاف** — تُعرض كل معادلة بالنقاط أو القفزات أو العد، مع حيلة الجدول.        |     **الاختبار** — يظل خيار الطفل معروضاً بجوار الإجابة الصحيحة، مع شرح مفصل لطريقة الحساب.      |
|        ![وضع التحدي: عد تنازلي وسلسلة الإجابات الحالية](docs/media/05-defi.webp)         |  ![وضع المغامرة: خريطة المستويات العشرة مع قفل المستويات التالية](docs/media/06-aventure.webp)   |
|      **التحدي** — سباق مع الزمن. عند حدوث خطأ، يتوقف المؤقت لقراءة الإجابة الصحيحة.      |                     **المغامرة** — عشرة مستويات تفتح تباعاً في مقابل النجوم.                     |
|           ![قائمة الأركيد: الألعاب المصغرة الأربع](docs/media/07-arcade.webp)            |       ![لوحة التحكم: النجوم بحسب كل جدول والإحصائيات](docs/media/08-tableau-de-bord.webp)        |
|             **الأركيد** — أربع ألعاب مصغرة، مع ضبط الصعوبة واختيار المركبة.              |      **لوحة التحكم** — النجوم بحسب الجدول، والجداول المطلوب مراجعتها، والنتائج بحسب كل وضع.      |
| ![التخصيص: الصور الرمزية، والسمات، وإمكانية الوصول](docs/media/09-personnalisation.webp) |                                                                                                  |
|   **التخصيص** — الصورة الرمزية، سمة الألوان، حجم النص، التباين العالي، والرمز الأبوي.    |                                                                                                  |

### ألعاب الأركيد المصغرة

أربع ألعاب تطرح السؤال نفسه — المعروض أعلى منطقة اللعب مع الوقت المتبقي والمحاولات — ولكنها تتطلب في كل مرة حركة مختلفة.

|                                                                                                          |                                                                                          |
| :------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: |
|         ![MultiInvaders: وحوش تحمل أرقاماً ومركبة أسفل الشاشة](docs/media/10-multiinvaders.webp)         | ![MultiMiam: متاهة تحتوي على كريات تحمل الإجابات المحتملة](docs/media/11-multimiam.webp) |
|      **MultiInvaders** — أطلق النار على الإجابات الخاطئة وتجنب الصحيحة: فهي تخفي صديقاً يجب تحريره.      |         **MultiMiam** — تجول في المتاهة لالتقاط النتيجة الصحيحة مع تفادي الوحوش.         |
| ![MultiMemory: شبكة بطاقات، اثنتان مقلوبتان تُظهران عملية حسابية ورقماً](docs/media/12-multimemory.webp) |         ![MultiSnake: ثعبان وتفاحات مرقمة في مرج](docs/media/13-multisnake.webp)         |
|             **MultiMemory** — تذكّر بالذاكرة أي بطاقة تحمل نتيجة العملية الحسابية المكشوفة.              |        **MultiSnake** — انمُ عبر ابتلاع الأرقام الصحيحة وتجنب كل الأرقام الأخرى.         |

## ✨ الميزات

### 🎮 أوضاع اللعب

- **وضع الاستكشاف**: استكشاف بصري وتفاعلي مخصص لكل عملية حسابية
- **وضع الاختبار**: أسئلة متعددة الخيارات مع دعم العمليات الأربع (×، +، −، ÷) وتقدم تكيفي
- **وضع التحدي**: سباق مع الزمن مع العمليات الأربع (×، +، −، ÷) ومستويات صعوبة متنوعة
- **وضع المغامرة**: تقدم قصصي عبر المستويات مع دعم العمليات الأربع

### 🕹️ ألعاب الأركيد المصغرة

- **MultiInvaders**: لعبة Space Invaders تعليمية - تدمير الإجابات الخاطئة
- **MultiMiam**: لعبة Pac-Man رياضية - جمع الإجابات الصحيحة
- **MultiMemory**: لعبة ذاكرة - مطابقة العمليات بالنتائج
- **MultiSnake**: لعبة Snake تعليمية - النمو عبر أكل الأرقام الصحيحة

### ➕ دعم العمليات المتعددة

يوفر LeapMultix تدريباً شاملاً على العمليات الحسابية الأربع في **جميع الأوضاع**:

| الوضع     | ×   | +   | −   | ÷   |
| --------- | --- | --- | --- | --- |
| الاختبار  | ✅  | ✅  | ✅  | ✅  |
| التحدي    | ✅  | ✅  | ✅  | ✅  |
| الاستكشاف | ✅  | ✅  | ✅  | ✅  |
| المغامرة  | ✅  | ✅  | ✅  | ✅  |
| الأركيد   | ✅  | ✅  | ✅  | ✅  |

### 🌍 الميزات العامة

- **تعدد المستخدمين**: إدارة ملفات تعريف فردية مع حفظ التقدم
- **متعدد اللغات**: دعم اللغات الفرنسية والإنجليزية والإسبانية
- **التخصيص**: صور رمزية، سمات ألوان، وخلفيات
- **إمكانية الوصول**: تنقل عبر لوحة المفاتيح، دعم اللمس، وامتثال لمعايير WCAG 2.1 AA
- **الصوت المسجل**: يمكن للعبة قراءة الأسئلة وعبارات التشجيع بصوت تركيبي مسجل مسبقاً، مع الرجوع التلقائي إلى صوت الجهاز عند الحاجة. التسجيلات الصوتية ليست ضمن هذا المستودع: يقدّم موقع leapmultix.jls42.org صوت Lucie بالفرنسية، وSulafat بالإنجليزية والإسبانية، ومع إمكانية اختيار Marie بالفرنسية وJane بالإنجليزية (انظر [الصوت المسجل](#-الصوت-المسجل))
- **التجاوب مع الهواتف المحمولة**: واجهة محسنة للأجهزة اللوحية والهواتف الذكية
- **نظام التقدم**: درجات، شارات، وتحديات يومية

## 🚀 البدء السريع

### المتطلبات الأساسية

- Node.js (الإصدار 16 أو أعلى)
- متصفح ويب حديث

### التثبيت

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

### البرامج النصية المتاحة

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

## 🧱 البنية البرمجية

### هيكل الملفات

توجد وحدات JavaScript البرمجية **مباشرة في المسار الأساسي داخل `js/`**، باستثناء ثلاثة مجلدات:
`core/` و`components/` و`modes/`. وبالتالي فإن اسم الملف هو ما يحدد
التجميع التصنيفي (`arcade-*`، `multimiam-*`، `i18n*`...).

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

### البنية التقنية

**وحدات ES6 الحديثة**: يعتمد المشروع بنية نمطية باستخدام فئات ES6 وعمليات استيراد/تصدير أصلية.

**مكونات قابلة لإعادة الاستخدام**: واجهة مستخدم مبنية باستخدام مكونات UI مركزية (TopBar، InfoBar، Dashboard، Customization).

**التحميل الكسول (Lazy Loading)**: تحميل ذكي للوحدات عند الطلب عبر `lazy-loader.js` لتحسين الأداء المبدئي.

**نظام تخزين موحد**: واجهة برمجة تطبيقات مركزية لحفظ بيانات المستخدم عبر LocalStorage مع آليات بديلة (fallbacks).

**إدارة صوتية مركزية**: التحكم بالصوت مع دعم متعدد اللغات وتفضيلات مخصصة لكل مستخدم.

**ناقل الأحداث (Event Bus)**: تواصل قائم على الأحداث ومفكك الارتباط بين المكونات لتوفير بنية برمجية يسهل صيانتها.

**التنقل عبر الشرائح**: نظام تنقل يعتمد على شرائح مرقمة (slide0، slide1، إلخ) باستخدام `goToSlide()`.

**الأمان**: حماية ضد هجمات XSS وتطهير البيانات عبر `security-utils.js` لجميع معالجات DOM.

## 🎯 أوضاع اللعب بالتفصيل

### وضع الاستكشاف

واجهة استكشاف بصري لجداول الضرب تتضمن:

- عرضاً تفاعلياً لعمليات الضرب
- رسوماً متحركة ووسائل مساعدة للتذكر
- سحباً وإفلاتاً تعليمياً
- تقدماً حراً بحسب كل جدول

### وضع الاختبار

أسئلة متعددة الخيارات تتضمن:

- 10 أسئلة لكل جلسة
- تقدماً تكيفياً وفقاً لمستوى الإجابات الصحيحة
- لوحة أرقام افتراضية
- نظام التتابع (streak) لسلسلة الإجابات الصحيحة

### وضع التحدي

سباق مع الزمن يتضمن:

- 3 مستويات صعوبة (مبتدئ، متوسط، صعب)
- وقتاً إضافياً كمكافأة على الإجابات الصحيحة
- نظام محاولات
- ترتيباً لأعلى النقاط

### وضع المغامرة

تقدم قصصي يتضمن:

- 10 مستويات ذات طابع خاص قابلة للفتح
- خريطة تفاعلية توضح مسار التقدم بصرياً
- قصة مشوقة بمشاركة شخصيات
- نظام نجوم ومكافآت

### ألعاب الأركيد المصغرة

تقدم كل لعبة مصغرة:

- إمكانية اختيار مستوى الصعوبة والتخصيص
- نظام محاولات ونقاط
- تحكماً عبر لوحة المفاتيح واللمس
- لوحات تصنيف فردية لكل مستخدم

## 🔧 التطوير

### سير عمل التطوير

**لا تقم بالإيداع (commit) مباشرة في الفرع main أبداً.** يعتمد المشروع على العمل عبر فروع الميزات.

**1. إنشاء فرع جديد**، `feat/` لإضافة ميزة، أو `fix/` لإصلاح خطأ:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. التطوير والتحقق.** يأتي التنسيق أولاً: فإجراءات CI سترفض الكود
قبل البدء في تشغيل الاختبارات.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. الإيداع (commit) في الفرع**، ثم رفعه:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. فتح طلب سحب (pull request)** وانتظار نتائج التحليلات: verify وCodacy وCodeFactor وSonarCloud. يتم التصحيح حتى تظهر العلامات الخضراء بالكامل قبل الدمج.

**نمط رسائل الإيداع**: رسائل موجزة بصيغة الأمر (مثال: "Fix arcade init errors"، "Refactor cache updater")

**بوابة الجودة (Quality gate)**: التأكد من اجتياز `npm run lint` و`npm test` و`npm run test:coverage` بنجاح قبل كل إيداع

### بنية المكونات

**GameMode (الفئة الأساسية)**: ترث جميع الأوضاع من فئة مشتركة ذات دوال قياسية.

**GameModeManager**: تنسيق مركزي لتشغيل الأوضاع وإدارتها.

**مكونات واجهة المستخدم (UI)**: توفر TopBar وInfoBar وDashboard وCustomization واجهة متناسقة.

**التحميل الكسول (Lazy Loading)**: تُحمَّل الوحدات عند الطلب لتحسين الأداء المبدئي.

**ناقل الأحداث (Event Bus)**: تواصل مفكك الارتباط بين المكونات عبر نظام الأحداث.

### الاختبارات

يتضمن المشروع حزمة اختبارات شاملة:

- اختبارات الوحدة للوحدات البرمجية الأساسية
- اختبارات التكامل للمكونات
- اختبارات أوضاع اللعب
- قياساً مؤتمتاً لتغطية الكود

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### بناء الإنتاج

- **Rollup**: تجميع `js/main-es6.js` بتنسيق ESM مع تقسيم الكود (code-splitting) وتوليد خرائط المصدر (sourcemaps)
- **Terser**: تقليص تلقائي لحجم الكود (Minification) للتحسين
- **ما بعد البناء**: نسخ `css/` و`assets/`، والأيقونات المفضلة (`favicon.ico`، `favicon.png`، `favicon.svg`)، و`sw.js`، وإعادة توجيه `dist/index.html` إلى ملف المدخل ذي الهاش (مثال: `main-es6-*.js`)
- **المجلد النهائي**: `dist/` جاهز ليُقدَّم كملفات ثابتة

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### التكامل المستمر

**GitHub Actions**: `.github/workflows/ci.yml`، يتم تشغيله مع كل دفع (push) إلى
`main` ومع كل طلب سحب (pull request).

**`verify`** — بوابة الجودة الإلزامية:

- `npm ci` ثم `npm run verify` (ESLint، اختبارات Jest، وتغطية الكود)
- `npm run format:check` (Prettier)

**`seo-report`** — بعد `verify`: فحص وتدقيق بواسطة Lighthouse للموقع المباشر، لمتابعة
مقاييس SEO بمرور الوقت.

**التحليلات الخارجية** المرتبطة بطلبات السحب: Codacy وCodeFactor وSonarCloud. تشترط بوابة SonarCloud الحصول على تقييمات A في الموثوقية والأمان وقابلية الصيانة للكود الجديد.

**النشر**: يقوم `./deploy.sh` بمزامنة الموقع مع S3 وإبطال ذاكرة التخزين المؤقت في CloudFront. كما يعيد البرنامج النصي إنشاء الصور المتجاوبة غير الموجودة في مستودع git عند الحاجة.

### تطبيق الويب التقدمي (PWA)

تطبيق LeapMultix هو تطبيق PWA متكامل يدعم العمل دون اتصال بالإنترنت وقابل للتثبيت.

**Service Worker** (`sw.js`):

- التنقل: الأولوية للشبكة (Network-first) مع الرجوع عند عدم الاتصال إلى `offline.html`
- الصور: الأولوية لذاكرة التخزين المؤقت (Cache-first) لتحسين الأداء
- الترجمات: استراتيجية Stale-while-revalidate للتحديث في الخلفية
- ملفات JS/CSS: الأولوية للشبكة (Network-first) لتقديم أحدث إصدار دائماً
- إدارة تلقائية للإصدارات عبر `cache-updater.js`

**Manifest** (`manifest.json`):

- أيقونات SVG وPNG لجميع الأجهزة
- إمكانية التثبيت على الهواتف المحمولة (إضافة إلى الشاشة الرئيسية)
- تهيئة بنمط مستقل (standalone) لتوفير تجربة شبيهة بالتطبيقات
- دعم السمات والألوان

**اختبار وضع عدم الاتصال محلياً.** شغّل الخادم، ثم افتح
`http://localhost:8080` (أو المنفذ المعروض):

```bash
npm run serve
```

يدوياً: افصل الاتصال بالشبكة من أدوات المطور (تبويب Network،
وضع Offline)، ثم أعد تحميل الصفحة. يجب أن تظهر الشاشة `offline.html`.

تلقائياً، باستخدام Puppeteer:

```bash
npm run test:pwa-offline
```

**البرامج النصية لإدارة Service Worker**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### معايير الجودة

**أدوات جودة الكود**:

- **ESLint**: إعداد حديث باستخدام flat config (`eslint.config.js`)، ودعم ES2022
- **Prettier**: تنسيق تلقائي للكود (`.prettierrc`)
- **Stylelint** : التحقق من صحة CSS (`.stylelintrc.json`)
- **JSDoc**: توثيق تلقائي للدوال مع تحليل التغطية

**قواعد برمجية هامة**:

- حذف المتغيرات والمعاملات غير المستخدمة (`no-unused-vars`)
- استخدام معالجة أخطاء محددة (تجنب كتل catch الفارغة)
- تجنب `innerHTML` واستخدام دوال `security-utils.js` بدلاً منها
- الحفاظ على تعقيد إدراكي (cognitive complexity) أقل من 15 للدوال
- استخراج الدوال المعقدة وتقسيمها إلى دوال مساعدة أصغر

**الأمان**:

- **الحماية من هجمات XSS**: استخدام دوال `security-utils.js`:
  - `appendSanitizedHTML()` بدلاً من `innerHTML`
  - `createSafeElement()` لإنشاء عناصر آمنة
  - `setSafeMessage()` للمحتوى النصي
- **البرمجيات النصية الخارجية**: السمة `crossorigin="anonymous"` إلزامية
- **التحقق من المدخلات**: تنقية البيانات الخارجية دائماً
- **Content Security Policy**: ترويسات CSP لتقييد مصادر البرمجيات النصية

**إمكانية الوصول**:

- التوافق مع WCAG 2.1 AA
- تنقل كامل عبر لوحة المفاتيح
- أدوار ARIA وتسميات مناسبة
- تباين ألوان متوافق

**الأداء**:

- التحميل الكسول (Lazy loading) للوحدات عبر `lazy-loader.js`
- تحسينات CSS وأصول متجاوبة
- استخدام Service Worker للتخزين المؤقت الذكي
- تقسيم الكود (Code splitting) والتصغير (minification) في بيئة الإنتاج

## 📱 التوافق

### المتصفحات المدعومة

تعتمد الواجهة على `oklch()` للألوان وعلى `:has()` للحالات
السياقية، مما يحدد الحد الأدنى للمتطلبات:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### الأجهزة

- **أجهزة سطح المكتب**: تحكم عبر لوحة المفاتيح والفأرة
- **الأجهزة اللوحية**: واجهة لمس محسّنة
- **الهواتف الذكية**: تصميم متجاوب وقابل للتكيف

### إمكانية الوصول

- تنقل كامل عبر لوحة المفاتيح (Tab، الأسهم، Esc)
- أدوار ARIA وتسميات لقارئات الشاشة
- تباين ألوان متوافق
- دعم التقنيات المساعدة

## 🌍 التعريب والترجمة

دعم كامل لتعدد اللغات:

- **الفرنسية** (اللغة الافتراضية)
- **الإنجليزية**
- **الإسبانية**

### إدارة الترجمات

**ملفات الترجمة:** `assets/translations/*.json`

**التنسيق:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### برمجيات إدارة i18n

**`npm run i18n:verify`** - التحقق من اتساق مفاتيح الترجمة

**`npm run i18n:unused`** - سرد مفاتيح الترجمة غير المستخدمة

**`npm run i18n:compare`** - مقارنة ملفات الترجمة مع fr.json (الملف المرجعي)

يضمن هذا السكريبت (`scripts/compare-translations.cjs`) مزامنة جميع ملفات اللغات:

**الميزات:**

- اكتشاف المفاتيح المفقودة (الموجودة في fr.json ولكنها غائبة في اللغات الأخرى)
- اكتشاف المفاتيح الزائدة (الموجودة في اللغات الأخرى ولكنها غير موجودة في fr.json)
- التعرف على القيم الفارغة (`""`، `null`، `undefined`، `[]`)
- التحقق من اتساق الأنواع (string مقابل array)
- تسطيح هياكل JSON المتداخلة باستخدام الترميز النقطي (مثال: `arcade.multiMemory.title`)
- إنشاء تقرير مفصل في الطرفية (console)
- حفظ تقرير JSON في `docs/translations-comparison-report.json`

**مثال على المخرجات:**

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

**تغطية الترجمات:**

- واجهة المستخدم بالكامل
- تعليمات الألعاب
- رسائل الأخطاء والملاحظات التقييمية
- الأوصاف والمساعدة السياقية
- المحتوى السردي لوضع المغامرة (Mode Aventure)
- تسميات إمكانية الوصول وARIA

## 🔊 الصوت المسجل

تقرأ اللعبة بصوت عالٍ الأسئلة وعبارات التشجيع والشروحات. وهي لا تنطق إلا بعدد محدد من الجمل، حوالي 7400 جملة لكل لغة: لذا يمكن تسجيلها مرة واحدة وإلى الأبد، وبالتالي لا تستدعي أي جولة لعب خدمة توليد كلام اصطناعي. وفي حال عدم توفر المقاطع الصوتية، تقرأ اللعبة بالصوت المدمج بالجهاز.

### في هذا المستودع: التطبيق بدون الأصوات

يستطيع الكود تشغيل المقاطع المسجلة مسبقاً، ويحتوي على خط الإنتاج البرمجي الذي ينشئها. المقاطع ليست موجودة هنا، وكذلك مفاتيح المزودين: لذا فإن أي تفريع (fork) أو تثبيت محلي سيقرأ بصوت الجهاز.

- **الرجوع التلقائي (Fallback)** إلى صوت الجهاز، جملة بجملة: عند غياب المقطع أو حدوث خطأ فيه، أو رفض المتصفح للتشغيل، أو عدم بدء المقطع خلال 1.5 ثانية، أو في حال عدم الاتصال دون وجود المقطع في الذاكرة المؤقتة.
- **الإعدادات**: يعمل زر الصوت في الشريط العلوي على تفعيل القراءة أو كتمها؛ ويحدد خيار «الصوت المسجل» (إمكانية الوصول وعناصر التحكم) الاختيار بين الصوت المسجل وصوت الجهاز. ولا يظهر هذا الخيار إلا في اللغات التي تم نشر صوت لها.
- **وضع عدم الاتصال**: تظل المقاطع التي تم الاستماع إليها مسبقاً مخزنة مؤقتاً (service worker).
- **أين تبحث اللعبة عن المقاطع**: في وسم `<meta name="leapmultix-voice-base">`، وهو فارغ في المستودع. فقط عملية النشر للإنتاج هي التي تكتب فيه `/voice/`.

عند توفر مقاطعك الصوتية الخاصة على الجهاز (التي يتم إنشاؤها عبر خط الإنتاج أدناه، والمحفوظة بجانب اللعبة في `../leapmultix-voices`)، فإن المعامل `?voix=local` يجعل خادم التطوير يقرؤها:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### على leapmultix.jls42.org: أصوات الاستضافة

يقدم الموقع الذي يوفره المؤلف أصوات توليف اصطناعية مسجلة:

- بالفرنسية، **Lucie**، تم إنشاؤها باستخدام ElevenLabs (نموذج Eleven v3)؛
- بالإنجليزية البريطانية والإسبانية (إسبانيا)، **Sulafat**، تم إنشاؤها باستخدام Google Cloud Text-to-Speech (صوت Chirp 3 HD)؛
- حسب اختيار اللاعب، **Marie** بالفرنسية و**Jane** بالإنجليزية، تم إنشاؤهما باستخدام Mistral AI (Voxtral TTS).

توجد المقاطع الصوتية في مستودع خاص وفي حاوية S3 مخصصة، ويتم تقديمها عبر CloudFront على `/voice/*`. وفي الإعدادات، تقترح قائمة «الأصوات» خيارات الأصوات للغة عندما تتوفر عدة أصوات لها، وتوضح الملاحظة اسم الخدمة الخاصة بالصوت المسموع.

### إنشاء المقاطع الصوتية

خط الإنتاج مكتوب بسكريبت في `scripts/voice/` ويعمل على جهاز المالك، ولا يعمل أبداً في CI العامة. تظل مفاتيح المزودين (ElevenLabs للفرنسية، وGoogle Cloud Text-to-Speech للإنجليزية والإسبانية، وMistral لـ Marie وJane) في ملف `.env` خارج المستودع، ويتم تمريرها عبر `node --env-file`: لا يدخل أي مفتاح في git. وتنفذ مهارة Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) الإجراء خطوة بخطوة (البوابات، الموافقات، الاستئناف)؛ التفاصيل متوفرة في [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **تقدير** الجمل المتبقية وعدد الأحرف المدفوعة (Eleven v3: حوالي 0.53 رصيد لكل حرف؛ Chirp 3 HD: 30 دولاراً لكل مليون حرف، مع تقديم أول مليون مجاناً كل شهر؛ Voxtral TTS: 16 دولاراً لكل مليون).
2. **التوليد**. إعادة تشغيل الأمر نفسه تستأنف ما ينقص. عند نفاد الرصيد، يتوقف السكريبت بشكل نظيف (الرمز 3) دون ترك ملف مكتوب بشكل جزئي. يضع `--max-total-chars` حداً أقصى للإنفاق التراكمي للإصدار: يتم تسجيل كل استجابة مدفوعة فور استلامها في سجل يظل محفوظاً حتى في حالة التوقف المفاجئ. وبالنسبة لـ Google وMistral، اللذين لا يتيحان رصيداً قابلاً للقراءة، فهذه هي الحماية الوحيدة.
3. **الفحص والتحقق**: لكل جملة مقطعها الصوتي وكل ملف MP3 صالح. يقوم Whisper بعد ذلك بنسخ كل مقطع صوتياً محلياً، وينبه الفحص إلى الأرقام غير المفهومة بوضوح والمدد الزمنية غير الطبيعية. يربط `voice:review` بين Whisper وهذا الفحص وصفحة الاستماع في أمر واحد.
4. **الاستماع** في صفحة الاستماع (`voice:listen`) إلى المقاطع التي تم التنبيه إليها وعينة من الصيغ المؤنثة («une fois 7»)، التي لا يميزها Whisper. يحتوي كل مقطع على مربع اختيار «لإعادة التسجيل»، والذي يضيفه إلى قائمة المقاطع المستبعدة.
5. **إعادة تسجيل** المقاطع المستبعدة (`--redo`) وإعادة تشغيل Whisper، ثم مقارنة كل مقطع قبل وبعد في صفحة ثانية. والمقطع الذي يظل نطقه غير سليم بعد محاولتين أو ثلاث يتلقى نصاً مفروضاً في `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`)، مثل كتابة الرقم بالحروف كاملة.
6. **نشر** المقاطع، والتحقق من عملها على الإنترنت، ثم نشر فهرس اللغة، أولاً للمختبرين (`?voix=test`).
7. **إتاحة** الصوت للجميع، ثم تفعيله افتراضياً. يقوم قاطع الدائرة (`voice:publish -- remove`) بإزالة لغة من الفهرس: فتعود اللعبة إلى صوت الجهاز.

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

### قاعدة: يجب إعادة تسجيل أي جملة منطوقة معدلة قبل الإطلاق في بيئة الإنتاج

تأتي كل جملة منطوقة من ملفات الترجمة (`assets/translations/{fr,en,es}.json`) وتُعد جزءاً من المتن النصي (corpus). لذا فإن تعديل أي جملة منطوقة يؤدي إلى فشل اختبار قفل المتن النصي (`scripts/voice/corpus.lock.json`). وبالنسبة للغة تتوفر لها أصوات مسجلة، نقوم حينئذٍ بإنشاء المقاطع الصوتية للجمل المتأثرة، ونفحصها ونستمع إليها، ثم ننشرها **قبل** الدمج. وأخيراً نقوم بتحديث القفل (`npm run voice:corpus:lock`). وبدون هذه المقاطع، تُقرأ الجملة المعدلة بصوت الجهاز.

## 📊 تخزين البيانات

### بيانات المستخدم

- الملفات الشخصية والتفضيلات
- التقدم المحرز في كل وضع لعب
- النقاط والإحصائيات الخاصة بألعاب الأركيد
- إعدادات التخصيص

### الميزات التقنية

- تخزين محلي (localStorage) مع حلول بديلة (fallbacks)
- عزل البيانات لكل مستخدم
- حفظ تلقائي للتقدم
- ترحيل تلقائي للبيانات القديمة

## 🐛 الإبلاغ عن مشكلة

يمكن الإبلاغ عن المشكلات عبر قسم Issues في GitHub. يُرجى تضمين ما يلي:

- وصف تفصيلي للمشكلة
- خطوات إعادة تكرار المشكلة
- المتصفح وإصداره
- لقطات شاشة إن كانت ملائمة

## 💝 دعم المشروع

**[☕ التبرع عبر PayPal](https://paypal.me/jls)**

## 📄 الترخيص

هذا المشروع مرخص بموجب رخصة AGPL v3. راجع الملف `LICENSE` لمزيد من التفاصيل.

---

_LeapMultix — تطبيق تعليمي حر ومفتوح المصدر لتعلم العمليات الحسابية الأربع_

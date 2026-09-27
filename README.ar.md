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

## جدول المحتويات

- [الوصف](#الوصف)
- [نظرة عامة](#-نظرة-عامة)
- [الميزات](#-الميزات)
- [البدء السريع](#-البدء-السريع)
- [البنية المعمارية](#-البنية-المعمارية)
- [أوضاع اللعب بالتفصيل](#-أوضاع-اللعب-بالتفصيل)
- [التطوير](#-التطوير)
- [التوافق](#-التوافق)
- [الترجمة والتوطين](#-التوطين-والترجمة)
- [الصوت المسجل](#-الصوت-المسجل)
- [تخزين البيانات](#-تخزين-البيانات)
- [الإبلاغ عن مشكلة](#-الإبلاغ-عن-مشكلة)
- [الترخيص](#-الترخيص)

## الوصف

LeapMultix هو تطبيق ويب تعليمي تفاعلي موجه للأطفال من سن 6 إلى 12 عاماً لإتقان العمليات الحسابية الأربع: الضرب (×)، والجمع (+)، والطرح (−)، والقسمة (÷). يقدّم التطبيق **5 أوضاع للعب** و**4 ألعاب أركيد مصغرة** ضمن واجهة بديهية وسهلة الوصول ومتعددة اللغات.

**دعم العمليات المتعددة:** تدعم الأوضاع الخمسة جميع العمليات الأربع. يتم الاختيار من شاشة البداية ويسري على مسار اللعب بأكمله.

**تطوير:** Julien LS (contact@jls42.org)

**الرابط المباشر:** https://leapmultix.jls42.org/

## 📸 نظرة عامة

### الشاشات

|                                                                                           |                                                                                                  |
| :---------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
|            ![شاشة «من يلعب؟»: اختيار الملف الشخصي](docs/media/01-accueil.webp)            |           ![القائمة الرئيسية: اختيار العملية والأوضاع الخمسة](docs/media/02-menu.webp)           |
|              **من يلعب؟** — ملف شخصي لكل طفل، مع صورته الرمزية ومستوى تقدمه.              |               **القائمة** — يتم اختيار العملية هنا، ثم تصبح الأوضاع الخمسة متاحة.                |
|    ![وضع الاستكشاف: جدول الضرب للعدد 4 معروضاً بالنقاط](docs/media/03-decouverte.webp)    | ![وضع الاختبار: الإجابة الخاطئة باللون الأحمر والإجابة الصحيحة بالأخضر](docs/media/04-quiz.webp) |
| **الاستكشاف** — تُعرض كل معادلة بالنقاط، أو القفزات، أو العد، مع تقديم حيلة خاصة بالجدول. |    **الاختبار** — يظل اختيار الطفل معروضاً بجوار الإجابة الصحيحة، مع شرح مفصل لطريقة الحساب.     |
|          ![وضع التحدي: عد تنازلي وسلسلة إجابات متتالية](docs/media/05-defi.webp)          |  ![وضع المغامرة: خريطة المستويات العشرة مع قفل المستويات التالية](docs/media/06-aventure.webp)   |
|   **التحدي** — سباق مع الوقت. عند حدوث خطأ، يتوقف المؤقت مؤقتاً لقراءة الإجابة الصحيحة.   |                 **المغامرة** — عشرة مستويات تُفتح واحداً تلو الآخر مقابل النجوم.                 |
|            ![قائمة الأركيد: الألعاب المصغرة الأربع](docs/media/07-arcade.webp)            |         ![لوحة التحكم: النجوم لكل جدول والإحصائيات](docs/media/08-tableau-de-bord.webp)          |
|          **الأركيد** — أربع ألعاب مصغرة مع إمكانية ضبط الصعوبة واختيار المركبة.           |              **لوحة التحكم** — نجوم لكل جدول، وجداول للمراجعة، والنتائج حسب الوضع.               |
|  ![التخصيص: الصور الرمزية، السمات، وإمكانية الوصول](docs/media/09-personnalisation.webp)  |                                                                                                  |
|    **التخصيص** — الصورة الرمزية، سمة الألوان، حجم النص، التباين العالي، والرمز الأبوي.    |                                                                                                  |

### ألعاب الأركيد المصغرة

أربع ألعاب تطرح نفس السؤال — المعروض فوق منطقة اللعب، إلى جانب الوقت المتبقي والمحاولات — ولكن تتطلب كل منها حركة مختلفة في كل مرة.

|                                                                                                        |                                                                                          |
| :----------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: |
|        ![MultiInvaders: وحوش تحمل أرقاماً ومركبة أسفل الشاشة](docs/media/10-multiinvaders.webp)        | ![MultiMiam: متاهة تحتوي على كريات تحمل الإجابات المحتملة](docs/media/11-multimiam.webp) |
| **MultiInvaders** — إطلاق النار على الإجابات الخاطئة والإبقاء على الصحيحة: فهي تخفي صديقاً يجب تحريره. |        **MultiMiam** — التنقل في المتاهة لالتقاط النتيجة الصحيحة مع تفادي الوحوش.        |
| ![MultiMemory: شبكة بطاقات، تظهر بطاقتان مقلوبتان عملية حسابية ورقماً](docs/media/12-multimemory.webp) |      ![MultiSnake: ثعبان وتفاحات مرقمة في مرج أخضر](docs/media/13-multisnake.webp)       |
|           **MultiMemory** — تذكر واسترجاع البطاقة التي تحمل نتيجة العملية الحسابية المكشوفة.           |     **MultiSnake** — النمو عن طريق التهام الأرقام الصحيحة وتجنب جميع الأرقام الأخرى.     |

## ✨ الميزات

### 🎮 أوضاع اللعب

- **وضع الاستكشاف**: استكشاف بصري وتفاعلي مخصص لكل عملية
- **وضع الاختبار**: أسئلة متعددة الخيارات مع دعم العمليات الأربع (×، +، −، ÷) وتقدم تكيّفي
- **وضع التحدي**: سباق مع الوقت مع العمليات الأربع (×، +، −، ÷) ومستويات صعوبة مختلفة
- **وضع المغامرة**: تقدم قصصي عبر المستويات مع دعم العمليات الأربع

### 🕹️ ألعاب الأركيد المصغرة

- **MultiInvaders**: لعبة Space Invaders تعليمية - تدمير الإجابات الخاطئة
- **MultiMiam**: لعبة Pac-Man حسابية - جمع الإجابات الصحيحة
- **MultiMemory**: لعبة ذاكرة - مطابقة العمليات بالنتائج
- **MultiSnake**: لعبة Snake تعليمية - النمو من خلال التهام الأرقام الصحيحة

### ➕ دعم العمليات المتعددة

يوفّر LeapMultix تدريباً شاملاً على العمليات الحسابية الأربع في **جميع الأوضاع**:

| الوضع     | ×   | +   | −   | ÷   |
| --------- | --- | --- | --- | --- |
| الاختبار  | ✅  | ✅  | ✅  | ✅  |
| التحدي    | ✅  | ✅  | ✅  | ✅  |
| الاستكشاف | ✅  | ✅  | ✅  | ✅  |
| المغامرة  | ✅  | ✅  | ✅  | ✅  |
| الأركيد   | ✅  | ✅  | ✅  | ✅  |

### 🌍 الميزات العامة

- **تعدد المستخدمين**: إدارة ملفات شخصية فردية مع حفظ التقدم
- **متعدد اللغات**: دعم للغات الفرنسية والإنجليزية والإسبانية
- **التخصيص**: صور رمزية، سمات ألوان، وخلفيات
- **إمكانية الوصول**: التنقل عبر لوحة المفاتيح، دعم اللمس، والتوافق مع معايير WCAG 2.1 AA
- **الصوت المسجل**: يستطيع اللعب قراءة الأسئلة وعبارات التشجيع بصوت تركيبي مسجل مسبقاً، مع الرجوع التلقائي إلى صوت الجهاز في حال عدم توفره. الأصوات ليست مضمنة في هذا المستودع: يقدّم موقع leapmultix.jls42.org صوت Lucie بالفرنسية، وSulafat بالإنجليزية والإسبانية، ومع خياري Sulafat وMarie بالفرنسية، وJane بالإنجليزية (انظر [الصوت المسجل](#-الصوت-المسجل))
- **متجاوب مع الأجهزة المحمولة**: واجهة محسّنة للأجهزة اللوحية والهواتف الذكية
- **نظام التقدم**: نقاط، شارات، وتحديات يومية

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

## 🧱 البنية المعمارية

### هيكل الملفات

تتوزع وحدات JavaScript **بشكل مسطح داخل `js/`**، باستثناء ثلاثة مجلدات: `core/` و`components/` و`modes/`. وبذلك فإن اسم الملف هو ما يحدد تصنيفه (`arcade-*`، `multimiam-*`، `i18n*`...).

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

**وحدات ES6 حديثة**: يعتمد المشروع بنية نمطية قائمة على فئات ES6 وعمليات استيراد/تصدير أصلية.

**مكونات قابلة لإعادة الاستخدام**: واجهة مبنية بمكونات واجهة مستخدم مركزية (TopBar، وInfoBar، وDashboard، وCustomization).

**التحميل الكسول (Lazy Loading)**: تحميل ذكي للوحدات عند الطلب عبر `lazy-loader.js` لتحسين الأداء المبدئي.

**نظام تخزين موحد**: واجهة برمجة تطبيقات (API) مركزية لحفظ بيانات المستخدم عبر LocalStorage مع بدائل احتياطية.

**إدارة صوتية مركزية**: تحكم بالصوت مع دعم متعدد اللغات وتفضيلات خاصة بكل مستخدم.

**ناقل الأحداث (Event Bus)**: تواصل قائم على الأحداث غير المترابطة بإحكام بين المكونات من أجل بنية قابلة للصيانة.

**التنقل عبر الشرائح**: نظام تنقل يعتمد على شرائح مرقمة (slide0، وslide1، إلخ) باستخدام `goToSlide()`.

**الأمان**: حماية من هجمات XSS وتعقيم للبيانات عبر `security-utils.js` لكافة عمليات معالجة شجرة DOM.

## 🎯 أوضاع اللعب بالتفصيل

### وضع الاستكشاف

واجهة استكشاف بصري لجداول الضرب تشمل:

- تمثيل مرئي تفاعلي لعمليات الضرب
- رسوم متحركة ووسائل مساعدة للتذكر
- سحب وإفلات تعليمي
- تقدم حر بحسب كل جدول

### وضع الاختبار

أسئلة اختيار من متعدد تشمل:

- 10 أسئلة في كل جلسة
- تقدم تكيّفي بحسب معدل النجاح
- لوحة أرقام افتراضية
- نظام التتابع (سلسلة الإجابات الصحيحة المتتالية)

### وضع التحدي

سباق مع الوقت يشمل:

- 3 مستويات صعوبة (مبتدئ، متوسط، صعب)
- وقت إضافي للإجابات الصحيحة
- نظام المحاولات (القلوب)
- قائمة بأعلى النتائج

### وضع المغامرة

تقدم قصصي يشمل:

- 10 مستويات ذات طابع خاص قابلة للفتح
- خريطة تفاعلية مع عرض مرئي لمستوى التقدم
- قصة غامرة مع شخصيات
- نظام النجوم والمكافآت

### ألعاب الأركيد المصغرة

تقدّم كل لعبة مصغرة:

- اختيار الصعوبة والتخصيص
- نظام للمحاولات والنتائج
- عناصر تحكم باللمس ولوحة المفاتيح
- لوحات تصنيف فردية لكل مستخدم

## 🔧 التطوير

### سير عمل التطوير

**لا تقم بالإيداع (commit) مباشرة في فرع main.** يعتمد المشروع على العمل باستخدام فروع الميزات.

**1. أنشئ فرعاً جديداً**، `feat/` لإضافة ميزة، أو `fix/` لإصلاح خطأ:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. قم بالتطوير والتحقق.** يأتي التنسيق أولاً: سيرفض نظام التكامل المستمر (CI) التغييرات قبل حتى تشغيل الاختبارات.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. قم بتنفيذ الإيداع (commit) على الفرع**، ثم ارفعه:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. افتح طلب سحب (Pull Request)** وانتظر اكتمال التحليلات: verify وCodacy وCodeFactor وSonarCloud. يتم تصحيح الأخطاء حتى تصبح المؤشرات كلها خضراء قبل الدمج.

**أسلوب رسائل الإيداع**: رسائل موجزة بصيغة الأمر (مثال: "Fix arcade init errors"، و"Refactor cache updater")

**معيار الجودة (Quality gate)**: التأكد من اجتياز `npm run lint` و`npm test` و`npm run test:coverage` بنجاح قبل كل عملية إيداع

### بنية المكونات

**GameMode (الفئة الأساسية)**: ترث جميع الأوضاع من فئة مشتركة ذات دوال قياسية.

**GameModeManager**: تنسيق مركزي لتشغيل الأوضاع وإدارتها.

**مكونات واجهة المستخدم (UI)**: توفر TopBar وInfoBar وDashboard وCustomization واجهة متناسقة.

**التحميل الكسول (Lazy Loading)**: يتم تحميل الوحدات عند الطلب لتحسين الأداء الأولي.

**ناقل الأحداث (Event Bus)**: تواصل غير مقترن بين المكونات عبر نظام الأحداث.

### الاختبارات

يتضمن المشروع مجموعة اختبارات شاملة:

- اختبارات الوحدة للوحدات الأساسية
- اختبارات التكامل للمكونات
- اختبارات أوضاع اللعب
- تغطية آلية للكود

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### بناء الإنتاج

- **Rollup**: تجميع `js/main-es6.js` بتنسيق ESM مع تقسيم الكود (code-splitting) وتوليد خرائط المصدر (sourcemaps)
- **Terser**: تقليص حجم الكود تلقائياً لتحسين الأداء
- **ما بعد البناء (Post-build)**: نسخ `css/` و`assets/`، والأيقونات المفضلة (`favicon.ico`، و`favicon.png`، و`favicon.svg`)، و`sw.js`، وإعادة كتابة `dist/index.html` للإشارة إلى ملف الإدخال ذي التجزئة المشفرة (مثل: `main-es6-*.js`)
- **المجلد النهائي**: `dist/` جاهز للاستضافة الثابتة

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### التكامل المستمر (CI)

**GitHub Actions**: `.github/workflows/ci.yml`، يتم تشغيله عند كل دفع (push) إلى `main` ومع كل طلب سحب (pull request).

**`verify`** — بوابة الجودة الإلزامية:

- `npm ci` ثم `npm run verify` (ESLint، واختبارات Jest، والتغطية)
- `npm run format:check` (Prettier)

**`seo-report`** — بعد `verify`: فحص وتدقيق Lighthouse للموقع المباشر لمتابعة مقاييس تحسين محركات البحث (SEO) بمرور الوقت.

**التحليلات الخارجية** المرتبطة بطلبات السحب: Codacy وCodeFactor وSonarCloud. تشترط بوابة SonarCloud الحصول على تصنيف A في الموثوقية والأمان وقابلية الصيانة للكود الجديد.

**النشر**: يقوم `./deploy.sh` بمزامنة الموقع مع S3 وإبطال التخزين المؤقت في CloudFront. كما يعيد البرنامج النصي توليد الصور المتجاوبة غير الموجودة في مستودع Git عند الحاجة.

### تطبيق الويب التقدمي (PWA)

LeapMultix هو تطبيق ويب تقدمي (PWA) متكامل يدعم العمل دون اتصال بالإنترنت وقابل للتثبيت.

**Service Worker** (`sw.js`):

- التصفح: الأولوية للشبكة (Network-first) مع بديل دون اتصال بالإنترنت إلى `offline.html`
- الصور: الأولوية للتخزين المؤقت (Cache-first) لتحسين الأداء
- الترجمات: استراتيجية Stale-while-revalidate للتحديث في الخلفية
- JS/CSS: الأولوية للشبكة (Network-first) لتقديم أحدث إصدار دائماً
- إدارة تلقائية للإصدارات عبر `cache-updater.js`

**Manifest** (`manifest.json`):

- أيقونات SVG وPNG لجميع الأجهزة
- إمكانية التثبيت على الهواتف المحمولة (إضافة إلى الشاشة الرئيسية)
- تهيئة مستقلة (standalone) لتوفير تجربة مماثلة للتطبيقات الأصلية
- دعم السمات والألوان

**اختبار وضع عدم الاتصال محلياً.** شغّل الخادم، ثم افتح `http://localhost:8080` (أو المنفذ المعروض):

```bash
npm run serve
```

يدوياً: اقطع الاتصال بالشبكة من أدوات المطور (تبويب الشبكة - Network، وضع عدم الاتصال - Offline)، ثم حدّث الصفحة. يجب أن يظهر `offline.html`.

تلقائياً، باستخدام Puppeteer:

```bash
npm run test:pwa-offline
```

**برامج نصية لإدارة Service Worker**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### معايير الجودة

**أدوات جودة الكود**:

- **ESLint**: إعداد حديث باستخدام flat config (`eslint.config.js`)، ودعم ES2022
- **Prettier**: تنسيق تلقائي للكود (`.prettierrc`)
- **Stylelint**: التحقق من صحة CSS (`.stylelintrc.json`)
- **JSDoc**: توثيق تلقائي للدوال مع تحليل التغطية

**قواعد برمجية هامة**:

- حذف المتغيرات والمعاملات غير المستخدمة (`no-unused-vars`)
- استخدام معالجة محددة للأخطاء (تجنب كتل catch الفارغة)
- تجنب `innerHTML` واستخدام دوال `security-utils.js` بدلاً منها
- الحفاظ على تعقيد إدراكي أقل من 15 للدوال
- استخراج الدوال المعقدة إلى دوال مساعدة أصغر

**الأمان**:

- **الحماية من هجمات XSS**: استخدام دوال `security-utils.js`:
  - `appendSanitizedHTML()` بدلاً من `innerHTML`
  - `createSafeElement()` لإنشاء عناصر آمنة
  - `setSafeMessage()` للمحتوى النصي
- **البرمجيات النصية الخارجية**: السمة `crossorigin="anonymous"` إلزامية
- **التحقق من المدخلات**: تطهير (sanitize) البيانات الخارجية دائماً
- **سياسة أمان المحتوى (Content Security Policy)**: ترويسات CSP لتقييد مصادر البرمجيات النصية

**إمكانية الوصول**:

- التوافق مع معايير WCAG 2.1 AA
- تنقل كامل عبر لوحة المفاتيح
- أدوار ARIA وتسميات ملائمة
- تباين ألوان متوافق مع المعايير

**الأداء**:

- التحميل الكسول (Lazy loading) للوحدات عبر `lazy-loader.js`
- تحسينات CSS وأصول متجاوبة
- مشغّل خدمة (Service Worker) للتخزين المؤقت الذكي
- تقسيم الكود (Code splitting) والتصغير (minification) في بيئة الإنتاج

## 📱 التوافق

### المتصفحات المدعومة

تعتمد الواجهة على `oklch()` للألوان وعلى `:has()` للحالات السياقية، مما يحدد الحد الأدنى للمتطلبات:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### الأجهزة

- **الحواسيب المكتبية**: تحكم كامل عبر الفأرة ولوحة المفاتيح
- **الأجهزة اللوحية**: واجهة لمسية محسّنة
- **الهواتف الذكية**: تصميم متجاوب ومتكيف

### إمكانية الوصول

- تنقل كامل عبر لوحة المفاتيح (Tab، الأسهم، Échap)
- أدوار ARIA وتسميات لقارئات الشاشة
- تباين ألوان متوافق مع المعايير
- دعم التقنيات المساعدة

## 🌍 التوطين والترجمة

دعم كامل للغات متعددة:

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

### برمجيات إدارة تدويل التطبيق (i18n)

**`npm run i18n:verify`** - التحقق من اتساق مفاتيح الترجمة

**`npm run i18n:unused`** - سرد مفاتيح الترجمة غير المستخدمة

**`npm run i18n:compare`** - مقارنة ملفات الترجمة مع fr.json (الملف المرجعي)

تضمن هذه البرمجية النصية (`scripts/compare-translations.cjs`) مزامنة جميع ملفات اللغات:

**الميزات:**

- كشف المفاتيح المفقودة (الموجودة في fr.json ولكنها غائبة في اللغات الأخرى)
- كشف المفاتيح الإضافية (الموجودة في اللغات الأخرى ولكنها غير موجودة في fr.json)
- تحديد القيم الفارغة (`""`، `null`، `undefined`، `[]`)
- التحقق من اتساق الأنواع (string مقابل array)
- تسطيح هياكل JSON المتداخلة إلى تنسيق مفصول بنقاط (مثل: `arcade.multiMemory.title`)
- إنشاء تقرير مفصل في موجه الأوامر (console)
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
- المحتوى السردي لنمط المغامرة
- تسميات إمكانية الوصول وARIA

## 🔊 الصوت المسجل

تقوم اللعبة بقراءة الأسئلة وعبارات التشجيع والشروحات بصوت عالٍ. وهي تنطق مجموعة محدودة فقط من العبارات، حوالي 7400 عبارة لكل لغة؛ وبالتالي يمكن تسجيلها مرة واحدة نهائياً، دون الحاجة إلى استدعاء أي خدمة تحويل نص إلى كلام أثناء اللعب. وفي حال غياب المقاطع الصوتية، تقرأ اللعبة بالصوت المدمج في الجهاز.

### في هذا المستودع: التطبيق بدون الأصوات

يحتوي الكود على إمكانية تشغيل مقاطع مسجلة مسبقاً، ويتضمن سلسلة الأدوات التي تقوم بإنشائها. المقاطع الصوتية ليست موجودة هنا، ولا مفاتيح مزودي الخدمة؛ وأي تفريع (fork) أو تثبيت محلي سيعمل بالصوت المدمج في الجهاز.

- **الرجوع التلقائي** إلى صوت الجهاز، عبارة بعبارة: في حال غياب المقطع أو حدوث خطأ، أو رفض المتصفح للتشغيل، أو عدم بدء المقطع خلال 1.5 ثانية، أو العمل دون اتصال بالإنترنت مع عدم وجود المقطع في الذاكرة المؤقتة.
- **الإعدادات**: يتيح زر الصوت في الشريط العلوي تفعيل القراءة أو كتمها؛ ويحدد خيار «صوت مسجل» (إمكانية الوصول وعناصر التحكم) الاختيار بين الصوت المسجل وصوت الجهاز. ولا يظهر هذا الخيار إلا في اللغات التي تم نشر صوت لها.
- **العمل دون اتصال بالإنترنت**: تظل المقاطع التي تم الاستماع إليها مسبقاً محفوظة في التخزين المؤقت (service worker).
- **أين تبحث اللعبة عن المقاطع الصوتية**: في الوسم `<meta name="leapmultix-voice-base">`، وهو فارغ في المستودع. عملية النشر في بيئة الإنتاج وحدها هي من يكتب فيه `/voice/`.

باستخدام مقاطعك الصوتية الخاصة على جهازك (المُنشأة بواسطة سلسلة الأدوات الموضحة أدناه، والموضوعة بجانب اللعبة في `../leapmultix-voices`)، يتيح المعامل `?voix=local` لخادم التطوير قراءتها:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### على leapmultix.jls42.org: أصوات الاستضافة

يقدم الموقع الذي يوفره المؤلف أصوات توليف مسجلة:

- بالفرنسية، **Lucie**، تم إنشاؤها عبر ElevenLabs (نموذج Eleven v3)؛
- بالإنجليزية البريطانية والإسبانية القشتالية، **Sulafat**، تم إنشاؤها عبر Google Cloud Text-to-Speech (صوت Chirp 3 HD)؛
- بحسب اختيار اللاعب، **Sulafat** بالفرنسية، للحفاظ على نفس الصوت في اللغات الثلاث؛
- بحسب اختيار اللاعب أيضاً، **Marie** بالفرنسية و**Jane** بالإنجليزية، تم إنشاؤهما عبر Mistral AI (Voxtral TTS).

توجد المقاطع الصوتية في مستودع خاص وحاوية S3 مخصصة، يتم توفيرها عبر CloudFront على `/voice/*`. ويتم توليدها مرة واحدة فقط: أثناء اللعب، لا يتم إرسال أي شيء إلى هذه الخدمات. في الإعدادات، تتيح قائمة «الصوت» اختيار أصوات اللغة عند توفر أكثر من صوت، وتوضح الملاحظة اسم الخدمة المستخدمة للصوت المستمع إليه.

### توليد المقاطع الصوتية

سلسلة الأدوات مبرمجة في `scripts/voice/` وتعمل على جهاز المالك، ولا تعمل أبداً في بيئة التكامل المستمر (CI) العامة. مفاتيح مزودي الخدمة (ElevenLabs لـ Lucie، وGoogle Cloud Text-to-Speech لـ Sulafat، وMistral لـ Marie وJane) تظل في ملف `.env` خارج المستودع، ويتم تمريرها عبر `node --env-file`: لا يتم إدخال أي مفتاح في git. وتتولى مهارة Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) تنفيذ الإجراء خطوة بخطوة (البوابات، الموافقات، الاستئناف)؛ والتفاصيل متوفرة في [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **تقدير** العبارات المتبقية وعدد الأحرف المدفوعة (Eleven v3: حوالي 0.53 رصيد لكل حرف؛ Chirp 3 HD: 30 دولاراً لكل مليون حرف، مع تقديم أول مليون حرف مجاناً كل شهر؛ Voxtral TTS: 16 دولاراً لكل مليون حرف).
2. **التوليد**. تؤدي إعادة تشغيل الأمر نفسه إلى استئناف ما ينقص. وعند نفاد الرصيد، يتوقف السكربت بشكل سليم (الرمز 3) دون ترك أي ملف مكتوب جزئياً. ويضع `--max-total-chars` حداً أقصى للإنفاق التراكمي للإصدار: حيث يتم تسجيل كل استجابة مدفوعة بمجرد استلامها في سجل يظل محفوظاً حتى عند التوقف المفاجئ. وفي Google وMistral اللذين لا يقدمان رصيداً قابلاً للقراءة، تعد هذه الحماية الوحيدة.
3. **الفحص**: التأكد من أن كل عبارة لها مقطعها وأن كل ملف MP3 صالح. بعد ذلك، يقوم Whisper بنسخ كل مقطع صوتياً محلياً، ويكشف الفحص عن الأرقام التي أُسيء فهمها والمُدد الزمنية غير الطبيعية. يجمع `voice:review` بين Whisper وهذا الفحص وصفحة الاستماع في أمر واحد.
4. **الاستماع** على صفحة الاستماع (`voice:listen`) إلى المقاطع التي تم الإبلاغ عنها وعينة من صيغ التأنيث («une fois 7»)، والتي لا يميزها Whisper. يحتوي كل مقطع على مربع اختيار «لإعادة التسجيل»، والذي يضيفه إلى قائمة المقاطع المستبعدة.
5. **إعادة توليد** المقاطع المستبعدة (`--redo`) وإعادة تشغيل Whisper، ثم مقارنة كل مقطع قبل وبعد على صفحة ثانية. والمقطع الذي يظل نطقه غير دقيق بعد محاولتين أو ثلاث يُخصص له نص إلزامي في `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`)، مثل كتابة الرقم بالحروف كاملة.
6. **نشر** المقاطع، والتحقق من استجابتها عبر الإنترنت، ثم نشر فهرس اللغة، للمختبرين أولاً (`?voix=test`).
7. **إتاحة** الصوت للجميع، ثم تفعيله افتراضياً. يقوم قاطع الدائرة (`voice:publish -- remove`) بإزالة اللغة من الفهرس: لتعود اللعبة إلى الصوت المدمج في الجهاز.

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

### قاعدة: أي عبارة منطوقة يتم تعديلها يعاد تسجيلها قبل النشر في بيئة الإنتاج

تأتي أي عبارة منطوقة من ملفات الترجمة (`assets/translations/{fr,en,es}.json`) وتُعد جزءاً من متن النصوص (corpus). وبالتالي، فإن تغيير عبارة منطوقة يؤدي إلى إفشال اختبار قفل المتن (`scripts/voice/corpus.lock.json`). وبالنسبة لأي لغة يتوفر لها صوت مسجل، يتم حينئذٍ توليد مقاطع العبارات المعنية وفحصها والاستماع إليها، ثم نشرها **قبل** دمج التعديلات. أخيراً، يتم تحديث القفل (`npm run voice:corpus:lock`). وبدون هذه المقاطع، تُقرأ العبارة المعدلة باستخدام الصوت المدمج في الجهاز.

## 📊 تخزين البيانات

### بيانات المستخدم

- الملفات الشخصية والتفضيلات
- التقدم المحرز في كل نمط لعب
- النتائج والإحصائيات الخاصة بألعاب الأركيد
- إعدادات التخصيص

### الميزات التقنية

- تخزين محلي (localStorage) مع حلول بديلة (fallbacks)
- عزل البيانات لكل مستخدم
- حفظ تلقائي للتقدم
- ترحيل تلقائي للبيانات القديمة

## 🐛 الإبلاغ عن مشكلة

يمكن الإبلاغ عن المشكلات عبر GitHub Issues. يُرجى تضمين ما يلي:

- وصف تفصيلي للمشكلة
- خطوات إعادة إنتاجها
- نوع المتصفح وإصداره
- لقطات شاشة إن كانت مفيدة

## 💝 دعم المشروع

**[☕ تقديم تبرع عبر PayPal](https://paypal.me/jls)**

## 📄 الترخيص

هذا المشروع مرخص بموجب رخصة AGPL v3. راجع ملف `LICENSE` لمزيد من التفاصيل.

---

_LeapMultix — تطبيق تعليمي مفتوح المصدر لتعلم العمليات الحسابية الأربع_

<details>
<summary>هذا المستند متوفر أيضاً بلغات أخرى</summary>

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
[![الدين التقني](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![الأخطاء البرمجية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الثغرات الأمنية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![شوائب الشيفرة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الأسطر المكررة (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![أسطر الشيفرة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## جدول المحتويات

- [الوصف](#الوصف)
- [نظرة عامة](#-نظرة-عامة)
- [الميزات](#-الميزات)
- [البدء السريع](#-البدء-السريع)
- [البنية البرمجية](#-البنية-البرمجية)
- [أوضاع اللعب بالتفصيل](#-أوضاع-اللعب-بالتفصيل)
- [التطوير](#-التطوير)
- [التوافق](#-التوافقية)
- [الترجمة والتعريب](#-التوطين)
- [الصوت المسجل](#-الصوت-المسجل)
- [تخزين البيانات](#-تخزين-البيانات)
- [الإبلاغ عن مشكلة](#-الإبلاغ-عن-مشكلة)
- [الترخيص](#-الترخيص)

## الوصف

LeapMultix هو تطبيق ويب تعليمي تفاعلي موجه للأطفال من سن 6 إلى 12 عاماً لإتقان العمليات الحسابية الأربع: الضرب (×)، والجمع (+)، والطرح (−)، والقسمة (÷). يقدم **5 أوضاع للعب** و**4 ألعاب أركيد مصغرة** عبر واجهة بديهية ومتاحة وسهلة الاستخدام ومتعددة اللغات.

**دعم العمليات المتعددة:** تدعم الأوضاع الخمسة العمليات الأربع. يتم الاختيار من الشاشة الرئيسية ويسري على مسار اللعب بالكامل.

**طوّره:** Julien LS (contact@jls42.org)

**الرابط المباشر:** https://leapmultix.jls42.org/

## 📸 نظرة عامة

### الشاشات

|                                                                                         |                                                                                                  |
| :-------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
|           ![شاشة «من يلعب؟»: اختيار الملف الشخصي](docs/media/01-accueil.webp)           |           ![القائمة الرئيسية: اختيار العملية والأوضاع الخمسة](docs/media/02-menu.webp)           |
|             **من يلعب؟** — ملف شخصي لكل طفل، مع صورته الرمزية ومستوى تقدمه.             |               **القائمة** — يتم اختيار العملية هنا، ثم تصبح الأوضاع الخمسة متاحة.                |
|        ![وضع الاستكشاف: جدول ضرب 4 معروض بالنقاط](docs/media/03-decouverte.webp)        | ![وضع الاختبار: الإجابة الخاطئة باللون الأحمر والإجابة الصحيحة بالأخضر](docs/media/04-quiz.webp) |
|       **الاستكشاف** — تُعرض كل معادلة بالنقاط أو القفزات أو العد، مع حيلة الجدول.       | **الاختبار** — يظل خيار الطفل معروضاً بجوار الإجابة الصحيحة، ويوضح الشرح طريقة الحساب بالتفصيل.  |
|     ![وضع التحدي: العد التنازلي وسلسلة الإجابات المتتالية](docs/media/05-defi.webp)     |  ![وضع المغامرة: خريطة المستويات العشرة، والمستويات التالية مقفلة](docs/media/06-aventure.webp)  |
| **التحدي** — سباق مع الوقت. عند ارتكاب خطأ، يتوقف المؤقت مؤقتاً لقراءة الإجابة الصحيحة. |                 **المغامرة** — عشرة مستويات تفتح واحداً تلو الآخر مقابل النجوم.                  |
|           ![قائمة الأركيد: الألعاب الأربع المصغرة](docs/media/07-arcade.webp)           |       ![لوحة التحكم: النجوم بحسب كل جدول والإحصائيات](docs/media/08-tableau-de-bord.webp)        |
|             **الأركيد** — أربع ألعاب مصغرة، مع ضبط الصعوبة واختيار المركبة.             |      **لوحة التحكم** — النجوم لكل جدول، والجداول التي تحتاج لمراجعة، والنتائج بحسب كل وضع.       |
| ![التخصيص: الصور الرمزية، السمات، إمكانية الوصول](docs/media/09-personnalisation.webp)  |                                                                                                  |
|   **التخصيص** — الصورة الرمزية، سمة الألوان، حجم النص، التباين العالي، والرمز الأبوي.   |                                                                                                  |

### ألعاب الأركيد المصغرة

أربع ألعاب تطرح السؤال نفسه — المعروض أعلى منطقة اللعب، مع الوقت المتبقي وعدد المحاولات — ولكن تتطلب في كل مرة حركة مختلفة.

|                                                                                                           |                                                                                        |
| :-------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: |
|         ![MultiInvaders: وحوش تحمل أرقاماً، ومركبة أسفل الشاشة](docs/media/10-multiinvaders.webp)         | ![MultiMiam: متاهة تحتوي أقراصاً تحمل الإجابات المحتملة](docs/media/11-multimiam.webp) |
| **MultiInvaders** — إطلاق النار على الإجابات الخاطئة، وتفادي الإجابة الصحيحة: فهي تخفي صديقاً يجب تحريره. |       **MultiMiam** — التنقل في المتاهة لالتقاط النتيجة الصحيحة مع تجنب الوحوش.        |
| ![MultiMemory: شبكة بطاقات، اثنتان مقلوبتان تُظهران مسألة حسابية ورقماً](docs/media/12-multimemory.webp)  |        ![MultiSnake: ثعبان وتفاحات مرقمة في حقل](docs/media/13-multisnake.webp)        |
|                **MultiMemory** — تذكّر البطاقة التي تحمل نتيجة المسألة الحسابية المكشوفة.                 |  **MultiSnake** — زيادة طول الثعبان بالتهام الأرقام الصحيحة وتجنب كل الأرقام الأخرى.   |

## ✨ الميزات

### 🎮 أوضاع اللعب

- **وضع الاستكشاف**: استكشاف بصري وتفاعلي ملائم لكل عملية حسابية
- **وضع الاختبار**: أسئلة متعددة الخيارات مع دعم العمليات الأربع (×، +، −، ÷) وتقدم تكيّفي
- **وضع التحدي**: سباق مع الوقت للعمليات الأربع (×، +، −، ÷) بمستويات صعوبة متعددة
- **وضع المغامرة**: تقدم قصصي عبر المستويات مع دعم العمليات الأربع

### 🕹️ ألعاب الأركيد المصغرة

- **MultiInvaders**: نسخة تعليمية من Space Invaders - تدمير الإجابات الخاطئة
- **MultiMiam**: نسخة رياضية من Pac-Man - جمع الإجابات الصحيحة
- **MultiMemory**: لعبة ذاكرة - مطابقة العمليات بالنتائج
- **MultiSnake**: نسخة تعليمية من لعبة Snake - النمو عبر التهام الأرقام الصحيحة

### ➕ دعم العمليات المتعددة

يقدم LeapMultix تدريباً شاملاً على العمليات الحسابية الأربع في **جميع الأوضاع**:

| الوضع     | ×   | +   | −   | ÷   |
| --------- | --- | --- | --- | --- |
| الاختبار  | ✅  | ✅  | ✅  | ✅  |
| التحدي    | ✅  | ✅  | ✅  | ✅  |
| الاستكشاف | ✅  | ✅  | ✅  | ✅  |
| المغامرة  | ✅  | ✅  | ✅  | ✅  |
| الأركيد   | ✅  | ✅  | ✅  | ✅  |

### 🌍 ميزات عامة وشاملة

- **تعدد المستخدمين**: إدارة ملفات شخصية فردية مع حفظ التقدم
- **متعدد اللغات**: دعم الفرنسية والإنجليزية والإسبانية
- **التخصيص**: صور رمزية، وسمات ألوان، وخلفيات
- **إمكانية الوصول**: التنقل عبر لوحة المفاتيح، ودعم اللمس، والتوافق مع WCAG 2.1 AA
- **الصوت المسجل**: تستطيع اللعبة قراءة الأسئلة وعبارات التشجيع بصوت توليفي مسجل مسبقاً، مع الرجوع التلقائي إلى صوت الجهاز عند الحاجة. الأصوات ليست مضمنة في هذا المستودع: يقدّم موقع leapmultix.jls42.org صوت Lucie بالفرنسية وصوت Sulafat بالإنجليزية والإسبانية (انظر [الصوت المسجل](#-الصوت-المسجل))
- **متجاوب مع الهواتف**: واجهة محسّنة للأجهزة اللوحية والهواتف الذكية
- **نظام التقدم**: نقاط، وأوسمة، وتحديات يومية

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

### البرامج النصية (Scripts) المتاحة

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

### هيكلية الملفات

توجد وحدات JavaScript البرمجية **مباشرة في المسار الأساسي لـ `js/`**، باستثناء ثلاثة مجلدات: `core/` و`components/` و`modes/`. ولذلك فإن اسم الملف هو ما يحدد التجميع (`arcade-*` و`multimiam-*` و`i18n*`...).

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

**وحدات ES6 الحديثة**: يستخدم المشروع بنية معيارية مع فئات ES6 وعمليات استيراد/تصدير أصلية.

**مكونات قابلة لإعادة الاستخدام**: واجهة مبنية باستخدام مكونات واجهة مستخدم (UI) مركزية (TopBar، InfoBar، Dashboard، Customization).

**التحميل الكسول (Lazy Loading)**: تحميل ذكي للوحدات عند الطلب عبر `lazy-loader.js` لتحسين الأداء المبدئي.

**نظام تخزين موحد**: واجهة برمجة تطبيقات (API) مركزية لحفظ بيانات المستخدمين عبر LocalStorage مع آليات بديلة (fallbacks).

**إدارة صوتية مركزية**: التحكم في الصوت مع دعم متعدد اللغات وتفضيلات مخصصة لكل مستخدم.

**ناقل الأحداث (Event Bus)**: تواصل معتمد على الأحداث وغير مقترن (decoupled) بين المكونات من أجل بنية برمجية قابلة للصيانة.

**التنقل عبر الشرائح**: نظام تنقل يعتمد على شرائح مرقمة (slide0، slide1، إلخ) باستخدام `goToSlide()`.

**الأمان**: حماية من هجمات XSS وتنقية البيانات (sanitization) عبر `security-utils.js` لجميع معالجات DOM.

## 🎯 أوضاع اللعب بالتفصيل

### وضع الاستكشاف

واجهة استكشاف بصري لجداول الضرب مع:

- تصور بصري تفاعلي لعمليات الضرب
- رسوم متحركة وتلميحات تذكيرية
- سحب وإفلات تعليمي
- تقدم حر بحسب كل جدول

### وضع الاختبار

أسئلة متعددة الخيارات تتضمن:

- 10 أسئلة في كل جلسة
- تقدم تكيّفي بحسب النجاحات
- لوحة أرقام افتراضية
- نظام التتابع (streak) لسلسلة الإجابات الصحيحة

### وضع التحدي

سباق مع الوقت يتضمن:

- 3 مستويات صعوبة (مبتدئ، متوسط، صعب)
- وقت إضافي مكافأة على الإجابات الصحيحة
- نظام المحاولات (القلوب)
- لوحة صدارة لأعلى النقاط

### وضع المغامرة

تقدم قصصي يتضمن:

- 10 مستويات ذات طابع خاص قابلة للفتح
- خريطة تفاعلية توضح التقدم بصرياً
- قصة غامرة وشخصيات متنوعة
- نظام نجوم ومكافآت

### ألعاب الأركيد المصغرة

تقدم كل لعبة مصغرة:

- اختيار الصعوبة والتخصيص
- نظام المحاولات واحتساب النقاط
- عناصر تحكم بلوحة المفاتيح واللمس
- تصنيفات فردية لكل مستخدم

## 🔧 التطوير

### سير عمل التطوير

**لا تقم بالإيداع (commit) مباشرة على الفرع main أبداً.** يعتمد المشروع على الفروع الخاصة بالميزات.

**1. أنشئ فرعاً**، `feat/` لميزة جديدة، أو `fix/` لإصلاح خطأ:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. طوّر وتحقق.** يأتي التنسيق أولاً: سترفضه بيئة التكامل المستمر (CI) قبل حتى تشغيل الاختبارات.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. قم بالإيداع (commit) على الفرع**، ثم ارفعه (push):

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. افتح طلب سحب (pull request)** وانتظر نتائج التحليلات: verify وCodacy وCodeFactor وSonarCloud. يتم تصحيح الأخطاء حتى تصبح المؤشرات كلها خضراء قبل الدمج.

**أسلوب الإيداع (Commit style)**: رسائل موجزة بصيغة الأمر (مثال: "Fix arcade init errors" أو "Refactor cache updater")

**بوابة الجودة (Quality gate)**: تأكد من نجاح `npm run lint` و`npm test` و`npm run test:coverage` قبل كل إيداع (commit)

### بنية المكونات

**GameMode (الفئة الأساسية)**: ترث جميع الأوضاع من فئة مشتركة ذات دوال قياسية.

**GameModeManager**: تنسيق مركزي لتشغيل الأوضاع وإدارتها.

**مكونات واجهة المستخدم (UI)**: توفر TopBar وInfoBar وDashboard وCustomization واجهة متناسقة.

**التحميل الكسول (Lazy Loading)**: يتم تحميل الوحدات عند الطلب لتحسين الأداء المبدئي.

**ناقل الأحداث (Event Bus)**: تواصل غير مقترن بين المكونات عبر نظام الأحداث.

### الاختبارات

يتضمن المشروع مجموعة اختبارات شاملة:

- اختبارات الوحدة للوحدات الأساسية (core)
- اختبارات التكامل للمكونات
- اختبارات أوضاع اللعب
- تغطية آلية للشيفرة البرمجية

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### حزمة الإنتاج (Production Build)

- **Rollup**: حزم `js/main-es6.js` بتنسيق ESM مع تقسيم الشيفرة (code-splitting) وتضمين sourcemaps
- **Terser**: تقليص الشيفرة تلقائياً (minification) للتحسين
- **ما بعد البناء (Post-build)**: نسخ `css/` و`assets/`، وأيقونات المفضلة (`favicon.ico`، و`favicon.png`، و`favicon.svg`)، و`sw.js`، وإعادة كتابة `dist/index.html` للإشارة إلى ملف الدخول ذي التجزئة المشفرة (مثال: `main-es6-*.js`)
- **المجلد النهائي**: `dist/` جاهز للتقديم كملفات ثابتة

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### التكامل المستمر (CI)

**GitHub Actions**: `.github/workflows/ci.yml`، يُشغّل عند كل رفع (push) إلى `main` ومع كل طلب سحب (pull request).

**`verify`** — بوابة الجودة الإلزامية:

- `npm ci` ثم `npm run verify` (أداة ESLint، واختبارات Jest، والتغطية)
- `npm run format:check` (أداة Prettier)

**`seo-report`** — بعد `verify`: فحص Lighthouse للموقع المباشر لمتابعة مقاييس تحسين محركات البحث (SEO) بمرور الوقت.

**التحليلات الخارجية** المرتبطة بطلبات السحب: Codacy وCodeFactor وSonarCloud. تشترط بوابة SonarCloud الحصول على الدرجة A في الموثوقية والأمان وقابلية الصيانة للشيفرة الجديدة.

**النشر**: يقوم `./deploy.sh` بمزامنة الموقع إلى S3 وإبطال ذاكرة التخزين المؤقت في CloudFront. يعيد البرنامج النصي توليد الصور المتجاوبة غير الموجودة في مستودع git عند الحاجة.

### تطبيق الويب التقدمي (PWA)

تطبيق LeapMultix هو تطبيق ويب تقدمي (PWA) متكامل يدعم العمل بدون اتصال وقابلية التثبيت.

**عامل الخدمة (Service Worker)** (`sw.js`):

- التنقل: الأولوية للشبكة (Network-first) مع الرجوع عند عدم الاتصال إلى `offline.html`
- الصور: الأولوية للذاكرة المؤقتة (Cache-first) لتحسين الأداء
- الترجمات: الاستخدام أثناء إعادة التحقق (Stale-while-revalidate) للتحديث في الخلفية
- JS/CSS: الأولوية للشبكة (Network-first) لتقديم أحدث إصدار دائماً
- إدارة تلقائية للإصدارات عبر `cache-updater.js`

**ملف البيان (Manifest)** (`manifest.json`):

- أيقونات SVG وPNG لجميع الأجهزة
- إمكانية التثبيت على الهاتف المحمول (الإضافة إلى الشاشة الرئيسية)
- إعداد العمل المستقل (standalone) لتجربة شبيهة بالتطبيقات الأصلية
- دعم السمات والألوان

**اختبار وضع عدم الاتصال محلياً.** شغّل الخادم، ثم افتح `http://localhost:8080` (أو المنفذ المعروض):

```bash
npm run serve
```

يدوياً: اقطع الاتصال بالشبكة من أدوات المطور (تبويب الشبكة Network، وضع عدم الاتصال Offline)، ثم حدّث الصفحة. يجب أن يظهر `offline.html`.

تلقائياً، باستخدام Puppeteer:

```bash
npm run test:pwa-offline
```

**نصوص إدارة Service Worker**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### معايير الجودة

**أدوات جودة الشيفرة البرمجية**:

- **ESLint**: إعداد حديث باستخدام التكوين المسطح (`eslint.config.js`)، ودعم ES2022
- **Prettier**: التنسيق التلقائي للشيفرة البرمجية (`.prettierrc`)
- **Stylelint**: التحقق من صحة CSS (`.stylelintrc.json`)
- **JSDoc**: توثيق تلقائي للدوال مع تحليل التغطية

**قواعد الشيفرة البرمجية الهامة**:

- إزالة المتغيرات والمعاملات غير المستخدمة (`no-unused-vars`)
- استخدام معالجة محددة للأخطاء (تجنب كتل catch الفارغة)
- تجنب `innerHTML` لصالح الدوال `security-utils.js`
- الحفاظ على تعقيد إدراكي أقل من 15 للدوال
- استخراج الدوال المعقدة إلى دوال مساعدة أصغر

**الأمان**:

- **الحماية من هجمات XSS**: استخدام دوال `security-utils.js`:
  - `appendSanitizedHTML()` بدلاً من `innerHTML`
  - `createSafeElement()` لإنشاء عناصر آمنة
  - `setSafeMessage()` للمحتوى النصي
- **البرمجيات النصية الخارجية**: السمة `crossorigin="anonymous"` إلزامية
- **التحقق من المدخلات**: تعقيم البيانات الخارجية دائمًا
- **سياسة أمان المحتوى (Content Security Policy)**: ترويسات CSP لتقييد مصادر البرمجيات النصية

**إمكانية الوصول**:

- التوافق مع معايير WCAG 2.1 AA
- التنقل الكامل عبر لوحة المفاتيح
- أدوار ARIA وتسميات توضيحية مناسبة
- تباين ألوان متوافق مع المعايير

**الأداء**:

- التحميل الكسول للوحدات عبر `lazy-loader.js`
- تحسينات CSS وأصول متجاوبة
- مشغل خدمة (Service Worker) للتخزين المؤقت الذكي
- تقسيم الشيفرة والضغط في بيئة الإنتاج

## 📱 التوافقية

### المتصفحات المدعومة

تعتمد الواجهة على `oklch()` للألوان وعلى `:has()` للحالات السياقية، مما يحدد الحد الأدنى للدعم:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### الأجهزة

- **الحواسيب المكتبية**: التحكم عبر لوحة المفاتيح والفأرة
- **الأجهزة اللوحية**: واجهة لمس محسّنة
- **الهواتف الذكية**: تصميم متجاوب وقابل للتكيف

### إمكانية الوصول

- تنقل كامل عبر لوحة المفاتيح (Tab، الأسهم، Esc)
- أدوار ARIA وتسميات توضيحية لقرّاء الشاشة
- تباين ألوان متوافق مع المعايير
- دعم التقنيات المساعدة

## 🌍 التوطين

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

### برمجيات إدارة التدويل (i18n)

**`npm run i18n:verify`** - التحقق من اتساق مفاتيح الترجمة

**`npm run i18n:unused`** - سرد مفاتيح الترجمة غير المستخدمة

**`npm run i18n:compare`** - مقارنة ملفات الترجمة مع fr.json (المرجع)

يضمن هذا البرنامج النصي (`scripts/compare-translations.cjs`) مزامنة جميع ملفات اللغات:

**الميزات:**

- اكتشاف المفاتيح المفقودة (الموجودة في fr.json ولكنها غائبة في اللغات الأخرى)
- اكتشاف المفاتيح الزائدة (الموجودة في لغات أخرى ولكنها غير موجودة في fr.json)
- تحديد القيم الفارغة (`""`، `null`، `undefined`، `[]`)
- التحقق من اتساق الأنواع (سلسلة نصية مقابل مصفوفة)
- تسطيح هياكل JSON المتداخلة إلى صيغة التنقيط (مثل: `arcade.multiMemory.title`)
- إنشاء تقرير مفصل في موجه الأوامر
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

- واجهة المستخدم الكاملة
- تعليمات الألعاب
- رسائل الخطأ والتغذية الراجعة
- الأوصاف والمساعدة السياقية
- المحتوى السردي لوضع المغامرة
- تسميات إمكانية الوصول وARIA

## 🔊 الصوت المسجل

تقرأ اللعبة بصوت عالٍ الأسئلة والتشجيعات والتفسيرات. وهي لا تنطق إلا بمجموعة محددة من العبارات، حوالي 7,400 عبارة لكل لغة: لذا يمكن تسجيلها مرة واحدة نهائيًا، وبالتالي لا تستدعي أي جولة خدمة توليد صوت. في حال غياب المقاطع الصوتية، تقرأ اللعبة بالصوت المدمج في الجهاز.

### في هذا المستودع: التطبيق بدون الأصوات

يستطيع الكود تشغيل المقاطع المسجلة مسبقًا، ويحتوي على مسار العمل البرمجي الذي ينشئها. المقاطع الصوتية ليست موجودة فيه، ولا مفاتيح المزودين: لذلك فإن أي تفريع (fork) أو تثبيت محلي يقرأ بالصوت المدمج في الجهاز.

- **الرجوع التلقائي** إلى صوت الجهاز، عبارة بعبارة: في حال غياب المقطع أو حدوث خطأ، أو رفض المتصفح التشغيل، أو عدم بدء تشغيل المقطع خلال 1.5 ثانية، أو في وضع عدم الاتصال بدون وجود المقطع في الذاكرة المؤقتة.
- **الإعدادات**: زر الصوت في الشريط العلوي يفعّل القراءة أو يكتمها؛ وخانة الاختيار «صوت مسجل» (إمكانية الوصول وعناصر التحكم) تتيح الاختيار بين الصوت المسجل وصوت الجهاز. وهي تظهر فقط في اللغات التي تم نشر صوت لها.
- **بدون اتصال بالإنترنت**: المقاطع التي تم الاستماع إليها مسبقًا تظل محفوظة في الذاكرة المؤقتة (مشغل الخدمة).
- **أين تبحث اللعبة عن المقاطع**: في الوسم `<meta name="leapmultix-voice-base">`، وهو فارغ في المستودع. فقط نشر الإنتاج يكتب فيه `/voice/`.

مع مقاطعك الخاصة على جهازك (المُنشأة بواسطة مسار العمل أدناه، والموضوعة بجانب اللعبة في `../leapmultix-voices`)، يجعل المعامل `?voix=local` خادم التطوير يقرأها:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### على leapmultix.jls42.org: أصوات الاستضافة

يقدّم الموقع الذي يوفره المؤلف أصوات توليد اصطناعي مسجلة:

- بالفرنسية، **Lucie**، تم إنشاؤها باستخدام ElevenLabs (نموذج Eleven v3)؛
- بالإنجليزية البريطانية والإسبانية القشتالية، **Sulafat**، تم إنشاؤها باستخدام Google Cloud Text-to-Speech (صوت Chirp 3 HD).

توجد المقاطع في مستودع خاص وحاوية S3 مخصصة، ويتم تقديمها عبر CloudFront على `/voice/*`. في الإعدادات، تذكر كل لغة اسم الخدمة التي أنشأت صوتها.

### إنشاء المقاطع الصوتية

مسار العمل مبرمج في `scripts/voice/` ويعمل على جهاز المالك، ولا يعمل أبدًا في بيئة التكامل المستمر (CI) العامة. مفاتيح المزودين (ElevenLabs للفرنسية، وGoogle Cloud Text-to-Speech للإنجليزية والإسبانية؛ مع بقاء Mistral متاحًا) تظل في ملف `.env` خارج المستودع، ويتم تمريرها عبر `node --env-file`: لا يدخل أي مفتاح إلى git. تشرح مهارة Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) الإجراء خطوة بخطوة (البوابات، الموافقات، الاستئناف)؛ التفاصيل متوفرة في [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **تقدير** العبارات المتبقية وعدد الأحرف المطلوب دفع تكلفتها (Eleven v3: حوالي 0.53 رصيد لكل حرف؛ Chirp 3 HD: 30 دولارًا لكل مليون حرف، مع تقديم أول مليون حرف شهريًا مجانًا؛ Voxtral TTS: 16 دولارًا لكل مليون حرف).
2. **الإنشاء**. إعادة تشغيل الأمر نفسه تستأنف ما هو مفقود. عندما تنفد الأرصدة، يتوقف البرنامج النصي بنظافة (الرمز 3) دون ترك ملف مكتوب جزئيًا. يضع `--max-total-chars` حدًا أقصى للإنفاق التراكمي للإصدار: يتم تسجيل كل استجابة مدفوعة بمجرد استلامها في سجل، والذي ينجو من التوقف المفاجئ. لدى Google وMistral، اللذين لا يعرضان أي رصيد قابل للقراءة، تُعد هذه وسيلة الحماية الوحيدة.
3. **الفحص**: التأكد من أن لكل عبارة مقطعها وأن كل ملف MP3 صالح. بعد ذلك يفرّغ Whisper نصوص كل مقطع محليًا، ويشير الفحص إلى الأرقام غير المفهومة بوضوح والمدد الزمنية غير الطبيعية. يجمع `voice:review` بين Whisper وهذا الفحص وصفحة الاستماع في أمر واحد.
4. **الاستماع** في صفحة الاستماع (`voice:listen`) إلى المقاطع التي تم التنبيه إليها وعينة من الصيغ المؤنثة («une fois 7»)، والتي لا يميزها Whisper. يحتوي كل مقطع على مربع اختيار «لإعادة التسجيل»، والذي يضيفه إلى قائمة المقاطع المستبعدة.
5. **إعادة تسجيل** المقاطع المستبعدة (`--redo`) وإعادة تشغيل Whisper، ثم مقارنة كل مقطع قبل وبعد في صفحة ثانية. المقطع الذي يظل نطقه غير سليم بعد محاولتين أو ثلاث يتلقى نصًا مفروضًا في `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`)، كأن يُكتب الرقم بالحروف كاملة على سبيل المثال.
6. **نشر** المقاطع، والتحقق من استجابتها عبر الإنترنت، ثم نشر فهرس اللغة، أولاً للمختبرين (`?voix=test`).
7. **إتاحة** الصوت للجميع، ثم تفعيله افتراضيًا. يؤدي قاطع الدائرة (`voice:publish -- remove`) إلى إزالة لغة من الفهرس: لتعود اللعبة إلى صوت الجهاز.

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

تأتي كل عبارة منطوقة من ملفات الترجمة (`assets/translations/{fr,en,es}.json`) وتُعد جزءًا من المتن النصي (corpus). لذا فإن تغيير عبارة منطوقة يؤدي إلى فشل اختبار قفل المتن النصي (`scripts/voice/corpus.lock.json`). بالنسبة للغة تمتلك صوتًا مسجلاً، يتم بعد ذلك إنشاء مقاطع العبارات المعنية وفحصها والاستماع إليها، ثم نشرها **قبل** الدمج. وأخيرًا يتم تحديث القفل (`npm run voice:corpus:lock`). وبدون هذه المقاطع، تُقرأ العبارة المعدلة بالصوت المدمج في الجهاز.

## 📊 تخزين البيانات

### بيانات المستخدم

- الملفات الشخصية والتفضيلات
- التقدم المحرز في كل وضع لعب
- النتائج والإحصائيات الخاصة بألعاب الآركيد
- إعدادات التخصيص

### الميزات التقنية

- التخزين المحلي (localStorage) مع حلول بديلة احتياطية
- عزل البيانات لكل مستخدم
- الحفظ التلقائي للتقدم
- الترحيل التلقائي للبيانات القديمة

## 🐛 الإبلاغ عن مشكلة

يمكن الإبلاغ عن المشكلات عبر مساهمات GitHub (GitHub Issues). يُرجى تضمين:

- وصف مفصل للمشكلة
- خطوات إعادة تكرارها
- نوع المتصفح وإصداره
- لقطات شاشة إذا كانت ذات صلة

## 💝 دعم المشروع

**[☕ التبرع عبر PayPal](https://paypal.me/jls)**

## 📄 الترخيص

هذا المشروع مرخص بموجب رخصة AGPL v3. راجع ملف `LICENSE` للحصول على مزيد من التفاصيل.

---

_LeapMultix — تطبيق تعليمي حر لتعلم العمليات الحسابية الأربع_

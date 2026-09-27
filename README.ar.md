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
[![الدين التقني](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![الأخطاء البرمجية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الثغرات الأمنية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![روائح الكود](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الأسطر المكررة (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![أسطر الكود](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## جدول المحتويات

- [الوصف](#الوصف)
- [نظرة عامة](#-نظرة-عامة)
- [الميزات](#-الميزات)
- [البدء السريع](#-البدء-السريع)
- [البنية الهندسية](#-البنية-الهندسية)
- [أوضاع اللعب بالتفصيل](#-أوضاع-اللعب-بالتفصيل)
- [التطوير](#-التطوير)
- [التوافق](#-التوافق)
- [التعريب](#-التوطين)
- [الصوت المسجل](#-الصوت-المسجل)
- [تخزين البيانات](#-تخزين-البيانات)
- [الإبلاغ عن مشكلة](#-الإبلاغ-عن-مشكلة)
- [الترخيص](#-الترخيص)

## الوصف

LeapMultix هو تطبيق ويب تعليمي تفاعلي موجه للأطفال من سن 6 إلى 12 عاماً لإتقان العمليات الحسابية الأربع: الضرب (×)، الجمع (+)، الطرح (−)، والقسمة (÷). يقدم التطبيق **5 أوضاع للعب** و**4 ألعاب آركيد مصغرة** ضمن واجهة سهلة الاستخدام ومتاحة للجميع ومتعددة اللغات.

**دعم العمليات المتعددة:** تتيح الأوضاع الخمسة استخدام العمليات الأربع. ويتم الاختيار من الشاشة الرئيسية ويسري على كامل مراحل اللعب.

**تطوير:** Julien LS (contact@jls42.org)

**الرابط المباشر:** https://leapmultix.jls42.org/

## 📸 نظرة عامة

### الشاشات

|                                                                                        |                                                                                                |
| :------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: |
|          ![شاشة «من يلعب؟»: اختيار الملف الشخصي](docs/media/01-accueil.webp)           |          ![القائمة الرئيسية: اختيار العملية والأوضاع الخمسة](docs/media/02-menu.webp)          |
|            **من يلعب؟** — ملف شخصي لكل طفل، مع صورته الرمزية ومستوى تقدمه.             |              **القائمة** — يتم اختيار العملية هنا، ثم تصبح الأوضاع الخمسة متاحة.               |
|   ![وضع الاستكشاف: جدول الضرب للعدد 4 معروض بالنقاط](docs/media/03-decouverte.webp)    |  ![وضع الاختبار: الإجابة الخاطئة بالأحمر، والإجابة الصحيحة بالأخضر](docs/media/04-quiz.webp)   |
| **الاستكشاف** — تُعرض كل معادلة بالنقاط أو القفزات أو العد، مع الحيلة الخاصة بالجدول.  |    **الاختبار** — يظل خيار الطفل معروضاً بجوار الإجابة الصحيحة، مع شرح يوضح تفاصيل الحساب.     |
|     ![وضع التحدي: العد التنازلي وسلسلة الإجابات الحالية](docs/media/05-defi.webp)      | ![وضع المغامرة: خريطة المستويات العشرة، والمستويات التالية مقفلة](docs/media/06-aventure.webp) |
|  **التحدي** — سباق مع الوقت. عند حدوث خطأ، يتوقف المؤقت لإتاحة قراءة الإجابة الصحيحة.  |                **المغامرة** — عشرة مستويات تفتح واحداً تلو الآخر مقابل النجوم.                 |
|          ![قائمة الآركيد: الألعاب المصغرة الأربع](docs/media/07-arcade.webp)           |      ![لوحة التحكم: النجوم بحسب كل جدول والإحصائيات](docs/media/08-tableau-de-bord.webp)       |
|     **الآركيد** — أربع ألعاب مصغرة، مع ضبط مستوى الصعوبة واختيار المركبة الفضائية.     |    **لوحة التحكم** — النجوم بحسب الجدول، والجداول التي تحتاج لمراجعة، والنتائج بحسب الوضع.     |
| ![التخصيص: الصور الرمزية، السمات، إمكانية الوصول](docs/media/09-personnalisation.webp) |                                                                                                |
|  **التخصيص** — الصورة الرمزية، سمة الألوان، حجم النص، التباين العالي، والرمز الأبوي.   |                                                                                                |

### ألعاب الآركيد المصغرة

أربع ألعاب تطرح نفس السؤال — المعروض أعلى مساحة
اللعب، مع الوقت المتبقي وعدد المحاولات — ولكن تتطلب في كل مرة حركة
مختلفة.

|                                                                                                         |                                                                                          |
| :-----------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: |
|        ![MultiInvaders: وحوش تحمل أرقاماً، ومركبة أسفل الشاشة](docs/media/10-multiinvaders.webp)        | ![MultiMiam: متاهة تحتوي على كريات تحمل الإجابات المحتملة](docs/media/11-multimiam.webp) |
|     **MultiInvaders** — أطلق النار على الإجابات الخاطئة وتجنب الصحيحة: فهي تخفي صديقاً يجب تحريره.      |          **MultiMiam** — تجول في المتاهة لجمع النتيجة الصحيحة مع تفادي الوحوش.           |
| ![MultiMemory: شبكة بطاقات، اثنتان مقلوبتان تعرضان عملية حسابية ورقماً](docs/media/12-multimemory.webp) |      ![MultiSnake: ثعبان وتفاحات مرقمة في مرج أخضر](docs/media/13-multisnake.webp)       |
|                  **MultiMemory** — تذكر أي بطاقة تحمل نتيجة العملية الحسابية المكشوفة.                  |       **MultiSnake** — انمُ عبر التهام الأرقام الصحيحة وتجنب كافة الأرقام الأخرى.        |

## ✨ الميزات

### 🎮 أوضاع اللعب

- **وضع الاستكشاف**: استكشاف بصري وتفاعلي مخصص لكل عملية حسابية
- **وضع الاختبار**: أسئلة متعددة الخيارات مع دعم العمليات الأربع (×، +، −، ÷) وتقدم تكيّفي
- **وضع التحدي**: سباق ضد الساعة يغطي العمليات الأربع (×، +، −، ÷) مع مستويات صعوبة متعددة
- **وضع المغامرة**: تقدم قصصي قائم على المستويات مع دعم العمليات الأربع

### 🕹️ ألعاب الآركيد المصغرة

- **MultiInvaders**: لعبة Space Invaders تعليمية - تدمير الإجابات الخاطئة
- **MultiMiam**: لعبة Pac-Man حسابية - جمع الإجابات الصحيحة
- **MultiMemory**: لعبة ذاكرة - مطابقة العمليات بالنتائج
- **MultiSnake**: لعبة Snake تعليمية - النمو من خلال أكل الأرقام الصحيحة

### ➕ دعم العمليات المتعددة

يوفر LeapMultix تدريباً شاملاً على العمليات الحسابية الأربع في **كافة الأوضاع**:

| الوضع     | ×   | +   | −   | ÷   |
| --------- | --- | --- | --- | --- |
| الاختبار  | ✅  | ✅  | ✅  | ✅  |
| التحدي    | ✅  | ✅  | ✅  | ✅  |
| الاستكشاف | ✅  | ✅  | ✅  | ✅  |
| المغامرة  | ✅  | ✅  | ✅  | ✅  |
| الآركيد   | ✅  | ✅  | ✅  | ✅  |

### 🌍 الميزات العامة

- **تعدد المستخدمين**: إدارة ملفات شخصية مستقلة مع حفظ التقدم
- **متعدد اللغات**: دعم اللغات الفرنسية والإنجليزية والإسبانية
- **التخصيص**: صور رمزية، سمات ألوان، وخلفيات متنوعة
- **إمكانية الوصول**: التنقل عبر لوحة المفاتيح، دعم اللمس، والتوافق مع معايير WCAG 2.1 AA
- **الصوت المسجل**: تستطيع اللعبة قراءة الأسئلة وعبارات التشجيع بصوت تركيبي مسجل مسبقاً، مع الرجوع التلقائي إلى صوت الجهاز عند الحاجة. لا توجد الأصوات داخل هذا المستودع: يوفّر موقع leapmultix.jls42.org صوت Lucie للفرنسية، وSulafat للإنجليزية والإسبانية، وJane كخيار للإنجليزية (انظر [الصوت المسجل](#-الصوت-المسجل))
- **متجاوب مع الهواتف**: واجهة محسنة للأجهزة اللوحية والهواتف الذكية
- **نظام التقدم**: درجات، أوسمة، وتحديات يومية

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

## 🧱 البنية الهندسية

### بنية الملفات

توجد وحدات JavaScript البرمجية **بشكل مسطح داخل `js/`**، باستثناء ثلاثة مجلدات:
`core/` و`components/` و`modes/`. وبالتالي فإن اسم الملف هو ما يعبر عن
التصنيف (`arcade-*`، `multimiam-*`، `i18n*`...).

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

**وحدات ES6 حديثة**: يعتمد المشروع بنية تركيبية تستخدم أصناف ES6 وعمليات الاستيراد والتصدير الأصلية.

**مكونات قابلة لإعادة الاستخدام**: واجهة مستخدم مبنية باستخدام مكونات مركزية (TopBar، InfoBar، Dashboard، Customization).

**التحميل الكسول (Lazy Loading)**: تحميل ذكي للوحدات عند الطلب عبر `lazy-loader.js` لتحسين الأداء الأولي.

**نظام تخزين موحد**: واجهة برمجة تطبيقات مركزية لحفظ بيانات المستخدم عبر LocalStorage مع آليات بديلة (fallbacks).

**إدارة صوتية مركزية**: التحكم في الصوت مع دعم تعدد اللغات وتفضيلات كل مستخدم.

**ناقل الأحداث (Event Bus)**: تواصل مفكك الارتباط قائم على الأحداث بين المكونات لتوفير بنية برمجية يسهل صيانتها.

**التنقل عبر الشرائح**: نظام تنقل يعتمد على شرائح مرقمة (slide0، slide1، إلخ) باستخدام `goToSlide()`.

**الأمان**: حماية من هجمات XSS وتنقية البيانات عبر `security-utils.js` لجميع معالجات الـ DOM.

## 🎯 أوضاع اللعب بالتفصيل

### وضع الاستكشاف

واجهة استكشاف بصرية لجداول الضرب تتضمن:

- تصوراً تفاعلياً لعمليات الضرب
- رسوماً متحركة ووسائل مساعدة للتذكر
- خاصية السحب والإفلات التعليمية
- تقدماً حراً بحسب كل جدول

### وضع الاختبار

أسئلة من متعدد تشمل:

- 10 أسئلة في كل جلسة
- تقدماً تكيّفياً بناءً على نسبة النجاح
- لوحة أرقام افتراضية
- نظام التتابع (streak) للإجابات الصحيحة المتتالية

### وضع التحدي

سباق مع الوقت يتضمن:

- 3 مستويات صعوبة (مبتدئ، متوسط، صلب)
- وقتاً إضافياً عند تقديم إجابات صحيحة
- نظام محاولات (قلوب)
- قائمة بأعلى النتائج

### وضع المغامرة

مسار قصصي يتضمن:

- 10 مستويات ذات طابع خاص يمكن فتحها
- خريطة تفاعلية توضح مسار التقدم البصري
- قصة مشوقة بمشاركة شخصيات متنوعة
- نظام نجوم ومكافآت

### ألعاب الآركيد المصغرة

يقدم كل نمط مصغر:

- إمكانية تحديد الصعوبة والتخصيص
- نظام محاولات ونقاط
- تحكماً عبر لوحة المفاتيح والشاشات اللمسية
- لوحات تصنيف خاصة بكل مستخدم

## 🔧 التطوير

### سير عمل التطوير

**لا تقم بالإيداع (commit) مباشرة على الفرع main أبداً.** يعتمد المشروع العمل عبر فروع الميزات.

**1. إنشاء فرع جديد**، باستخدام `feat/` لإضافة ميزة، أو `fix/` لإصلاح خطأ:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. التطوير والتحقق.** التنسيق يأتي في المقام الأول: إذ يرفضه نظام التكامل المستمر (CI)
حتى قبل بدء تشغيل الاختبارات.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. تسجيل التعديلات (Commit) على الفرع**، ثم رفعه (Push):

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. فتح طلب سحب (Pull Request)** وانتظار نتائج التحليلات: verify وCodacy
وCodeFactor وSonarCloud. يجب إجراء التصحيحات حتى تصبح جميع المؤشرات خضراء قبل الدمج.

**نمط رسائل الإيداع**: رسائل موجزة بصيغة الأمر (مثل: "Fix arcade init errors"، "Refactor cache updater")

**بوابة الجودة (Quality gate)**: التأكد من اجتياز `npm run lint` و`npm test` و`npm run test:coverage` بنجاح قبل كل إيداع

### بنية المكونات

**GameMode (الفئة الأساسية)**: ترث كافة الأوضاع من صنف مشترك يوفر دوال قياسية موحدة.

**GameModeManager**: إدارة مركزية لتشغيل الأوضاع وتنسيقها.

**مكونات واجهة المستخدم (UI)**: توفر TopBar وInfoBar وDashboard وCustomization واجهة استخدام متسقة.

**التحميل الكسول (Lazy Loading)**: يتم تحميل الوحدات عند الحاجة لتعزيز سرعة الاستجابة الأولية.

**ناقل الأحداث (Event Bus)**: تواصل مفكك الارتباط بين المكونات من خلال نظام الأحداث.

### الاختبارات

يتضمن المشروع حزمة اختبارات شاملة:

- اختبارات الوحدة للوحدات البرمجية الأساسية
- اختبارات التكامل للمكونات
- اختبارات لأوضاع اللعب
- قياس آلي لنسبة تغطية الكود

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### بناء نسخة الإنتاج

- **Rollup**: تجميع `js/main-es6.js` بنظام ESM مع تقسيم الكود (code-splitting) وتوليد خرائط المصدر (sourcemaps)
- **Terser**: تقليص الكود تلقائياً لرفع مستوى الكفاءة
- **ما بعد البناء**: نسخ `css/` و`assets/`، وأيقونات المفضلة (`favicon.ico`، `favicon.png`، `favicon.svg`)، و`sw.js`، وإعادة كتابة `dist/index.html` للإشارة إلى ملف الدخول المرمز بـ hash (مثال: `main-es6-*.js`)
- **المجلد النهائي**: `dist/` جاهز للاستضافة الثابتة

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### التكامل المستمر (CI)

**GitHub Actions**: يتم تشغيل `.github/workflows/ci.yml` مع كل عملية دفع إلى
`main` ومع كل طلب سحب.

**`verify`** — بوابة الجودة الملزمة:

- `npm ci` يليه `npm run verify` (فحص ESLint، اختبارات Jest، التغطية)
- `npm run format:check` (Prettier)

**`seo-report`** — يتم بعد `verify`: فحص تدقيق عبر Lighthouse للموقع الحي،
لتتبع معايير تحسين محركات البحث (SEO) بمرور الوقت.

**التحليلات الخارجية** المرتبطة بطلبات السحب: Codacy وCodeFactor
وSonarCloud. تشترط بوابة SonarCloud الحصول على تقييم A في الموثوقية والأمان
وقابلية الصيانة للأكواد البرمجية الجديدة.

**النشر**: يتولى `./deploy.sh` مزامنة الموقع مع خادم S3 وإلغاء صلاحية كاش
CloudFront. كما يعيد السكريبت توليد الصور المتجاوبة غير المدرجة في git متى لزم الأمر.

### تطبيق الويب التقدمي (PWA)

يمثل LeapMultix تطبيق ويب تقدمي متكامل يدعم العمل دون اتصال بالإنترنت وإمكانية التثبيت.

**عامل الخدمة (Service Worker)** (`sw.js`):

- التنقل: Network-first مع بديل مخصص لحالة عدم الاتصال يوجه إلى `offline.html`
- الصور: Cache-first لتعزيز الأداء
- الترجمات: Stale-while-revalidate لتحديث المحتوى في الخلفية
- ملفات JS/CSS: بنمط Network-first لضمان تقديم أحدث إصدار دوماً
- إدارة آلية للإصدارات من خلال `cache-updater.js`

**بيان التطبيق (Manifest)** (`manifest.json`):

- أيقونات بصيغتي SVG وPNG تناسب جميع الأجهزة
- إمكانية التثبيت على الهواتف المحمولة (إضافة إلى الشاشة الرئيسية)
- تهيئة للعرض المستقل standalone لتوفير تجربة مماثلة للتطبيقات الأصلية
- دعم تخصيص السمات والألوان

**اختبار وضع عدم الاتصال محلياً.** شغّل الخادم، ثم افتح
`http://localhost:8080` (أو المنفذ المحدد):

```bash
npm run serve
```

يدوياً: افصل الاتصال بالشبكة من أدوات المطور (تبويب Network،
وضع offline)، ثم حدّث الصفحة. ينبغي أن تظهر صفحة `offline.html`.

تلقائياً، باستخدام Puppeteer:

```bash
npm run test:pwa-offline
```

**أوامر إدارة عامل الخدمة (Service Worker)**:

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

**قواعد برمجية مهمة**:

- إزالة المتغيرات والمعلمات غير المستخدمة (`no-unused-vars`)
- استخدام معالجة أخطاء محددة (دون كتل catch فارغة)
- تجنب `innerHTML` لصالح الدوال `security-utils.js`
- الحفاظ على تعقيد إدراكي < 15 للدوال
- استخراج الدوال المعقدة إلى دوال مساعدة (helpers) أصغر

**الأمان**:

- **الحماية من هجمات XSS**: استخدام دوال `security-utils.js`:
  - `appendSanitizedHTML()` بدلاً من `innerHTML`
  - `createSafeElement()` لإنشاء عناصر آمنة
  - `setSafeMessage()` للمحتوى النصي
- **السكربتات الخارجية**: السمة `crossorigin="anonymous"` إلزامية
- **التحقق من صحة المدخلات**: تعقيم البيانات الخارجية دائمًا
- **Content Security Policy**: ترويسات CSP لتقييد مصادر السكربتات

**إمكانية الوصول**:

- التوافق مع WCAG 2.1 AA
- تنقل كامل عبر لوحة المفاتيح
- أدوار وتسميات ARIA ملائمة
- تباين ألوان متوافق مع المعايير

**الأداء**:

- تحميل كسول (Lazy loading) للوحدات عبر `lazy-loader.js`
- تحسينات CSS وأصول متجاوبة
- Service Worker للتخزين المؤقت الذكي
- تقسيم الكود (Code splitting) وتصغيره في بيئة الإنتاج

## 📱 التوافق

### المتصفحات المدعومة

تعتمد الواجهة على `oklch()` للألوان وعلى `:has()` للحالات السياقية، مما يحدد الحد الأدنى للمتطلبات:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### الأجهزة

- **أجهزة سطح المكتب**: عناصر تحكم بلوحة المفاتيح والماوس
- **الأجهزة اللوحية**: واجهة لمس مُحسّنة
- **الهواتف الذكية**: تصميم متجاوب وتكيفي

### إمكانية الوصول

- تنقل كامل عبر لوحة المفاتيح (Tab، الأسهم، Esc)
- أدوار وتسميات ARIA لقارئات الشاشة
- تباين ألوان متوافق مع المعايير
- دعم التقنيات المساعدة

## 🌍 التوطين

دعم كامل للغات المتعددة:

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

### سكربتات إدارة i18n

**`npm run i18n:verify`** - التحقق من اتساق مفاتيح الترجمة

**`npm run i18n:unused`** - سرد مفاتيح الترجمة غير المستخدمة

**`npm run i18n:compare`** - مقارنة ملفات الترجمة مع fr.json (الملف المرجعي)

يضمن هذا السكربت (`scripts/compare-translations.cjs`) مزامنة جميع ملفات اللغات:

**الميزات:**

- اكتشاف المفاتيح المفقودة (الموجودة في fr.json ولكنها غائبة في لغات أخرى)
- اكتشاف المفاتيح الإضافية (الموجودة في لغات أخرى ولكنها غير موجودة في fr.json)
- تحديد القيم الفارغة (`""`، `null`، `undefined`، `[]`)
- التحقق من اتساق الأنواع (string مقابل array)
- تسطيح هياكل JSON المتداخلة باستخدام الترميز النقطي (مثل: `arcade.multiMemory.title`)
- إنشاء تقرير مفصل في الطرفية
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

- واجهة مستخدم كاملة
- تعليمات الألعاب
- رسائل الخطأ والتغذية الراجعة
- الأوصاف والمساعدة السياقية
- المحتوى السردي لطور المغامرة
- تسميات إمكانية الوصول وARIA

## 🔊 الصوت المسجل

تقرأ اللعبة بصوت عالٍ الأسئلة والتشجيعات والشروحات. وهي لا تنطق سوى مجموعة محددة من العبارات، حوالي 7400 عبارة لكل لغة: وبالتالي يمكن تسجيلها مرة واحدة نهائيًا، بحيث لا تستدعي أي جولة لعب خدمة تحويل النص إلى كلام. وبدون المقاطع الصوتية، تقرأ اللعبة بالصوت المدمج في الجهاز.

### في هذا المستودع: التطبيق بدون الأصوات

يستطيع الكود تشغيل المقاطع المسجلة مسبقًا، ويتضمن سلسلة الأدوات التي تنشئها. المقاطع الصوتية غير متضمنة فيه، وكذلك مفاتيح المزودين: لذا فإن أي تفريع (fork) أو تثبيت محلي يقرأ بالصوت المدمج في الجهاز.

- **الرجوع التلقائي** إلى صوت الجهاز، جملة بجملة: في حال غياب المقطع أو حدوث خطأ، أو رفض المتصفح للتشغيل، أو عدم بدء المقطع في غضون 1.5 ثانية، أو في وضع عدم الاتصال بدون وجود المقطع في التخزين المؤقت.
- **الإعدادات**: يفعّل زر الصوت في الشريط العلوي القراءة أو يكتمها؛ ويحدد مربع الاختيار «الصوت المسجل» (إمكانية الوصول وعناصر التحكم) الاختيار بين الصوت المسجل وصوت الجهاز. ولا يظهر هذا الخيار إلا في اللغات التي تم نشر صوت لها.
- **وضع عدم الاتصال**: تظل المقاطع التي تم الاستماع إليها مسبقًا محفوظة في التخزين المؤقت (service worker).
- **أين تبحث اللعبة عن المقاطع**: في الوسم `<meta name="leapmultix-voice-base">`، وهو فارغ في المستودع. فقط نشر بيئة الإنتاج يكتب فيه `/voice/`.

باستخدام مقاطعك الخاصة على جهازك (التي أُنشئت بواسطة السلسلة البرمجية أدناه، والمرتبة بجانب اللعبة في `../leapmultix-voices`)، يجعل المعامل `?voix=local` خادم التطوير يقرؤها:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### على leapmultix.jls42.org: أصوات الاستضافة

يقدم الموقع المتاح من قِبل المؤلف أصواتًا اصطناعية مسجلة:

- بالفرنسية، **Lucie**، تم إنشاؤها بواسطة ElevenLabs (نموذج Eleven v3)؛
- بالإنجليزية البريطانية والإسبانية (إسبانيا)، **Sulafat**، تم إنشاؤها بواسطة Google Cloud Text-to-Speech (صوت Chirp 3 HD)؛
- بالإنجليزية، حسب اختيار اللاعب، **Jane**، تم إنشاؤها بواسطة Mistral AI (Voxtral TTS).

توجد المقاطع في مستودع خاص وحاوية S3 مخصصة، تُقدَّم عبر CloudFront على `/voice/*`. وفي الإعدادات، تقترح قائمة «الصوت» أصوات اللغة عندما تتوفر عدة أصوات لها، ويذكر الإشعار اسم خدمة الصوت المسموع.

### توليد المقاطع الصوتية

تمت كتابة سكربتات هذه السلسلة في `scripts/voice/` وتعمل على جهاز المالك، ولا تعمل أبدًا في بيئة CI العامة. تظل مفاتيح المزودين (ElevenLabs للفرنسية، وGoogle Cloud Text-to-Speech للإنجليزية والإسبانية، وMistral لـ Jane) في ملف `.env` خارج المستودع، ويتم تمريرها عبر `node --env-file`: لا يدخل أي مفتاح إلى git. تشرح مهارة Claude Code المسماة [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) الإجراء خطوة بخطوة (البوابات، الموافقات، الاستئناف)؛ والتفاصيل موجودة في [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **تقدير** العبارات المتبقية وعدد الأحرف المدفوعة (Eleven v3: حوالي 0.53 رصيد لكل حرف؛ Chirp 3 HD: 30 دولارًا لكل مليون حرف، مع تقديم أول مليون حرف شهريًا مجانًا؛ Voxtral TTS: 16 دولارًا لكل مليون).
2. **التوليد**. تؤدي إعادة تشغيل نفس الأمر إلى استئناف ما ينقص. وعند نفاد الرصيد، يتوقف السكربت بشكل نظيف (الرمز 3) دون ترك ملف مكتوب جزئيًا. يضع `--max-total-chars` حدًا أقصى للإنفاق التراكمي للإصدار: يتم تسجيل كل استجابة مدفوعة فور استلامها في سجل ينجو من أي توقف مفاجئ. وتُعد هذه هي الحماية الوحيدة لدى Google وMistral، اللتين لا توفران أي رصيد يمكن قراءته.
3. **التحقق**: التأكد من أن كل عبارة لها مقطعها وأن كل ملف MP3 صالح. بعد ذلك، يقوم Whisper بنسخ كل مقطع محليًا، ويشير الفحص إلى الأرقام غير المفهومة بوضوح والمدد غير الطبيعية. يجمع `voice:review` بين Whisper وهذا الفحص وصفحة الاستماع في أمر واحد.
4. **الاستماع** على صفحة الاستماع (`voice:listen`) إلى المقاطع التي تم الإبلاغ عنها وعينة من صيغ التأنيث («une fois 7»)، والتي لا يميزها Whisper. يحتوي كل مقطع على مربع اختيار «إعادة الإجراء»، والذي يضيفه إلى قائمة المقاطع المستبعدة.
5. **إعادة إنشاء** المقاطع المستبعدة (`--redo`) وإعادة تشغيل Whisper، ثم مقارنة كل مقطع قبل وبعد على صفحة ثانية. والمقطع الذي يظل نطقه غير صحيح بعد محاولتين أو ثلاث يُمنح نصًا مخصصًا في `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`)، على سبيل المثال كتابة الرقم بالحروف كاملة.
6. **نشر** المقاطع، والتحقق من أنها تعمل عبر الإنترنت، ثم نشر فهرس اللغة، أولاً للمختبرين (`?voix=test`).
7. **إتاحة** الصوت للجميع، ثم تفعيله افتراضيًا. يؤدي قاطع الدائرة (`voice:publish -- remove`) إلى إزالة لغة من الفهرس: فتعود اللعبة إلى صوت الجهاز.

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

### قاعدة: كل عبارة منطوقة يتم تعديلها يُعاد تسجيلها قبل النشر في بيئة الإنتاج

تأتي كل عبارة منطوقة من ملفات الترجمة (`assets/translations/{fr,en,es}.json`) وتُعد جزءًا من متن النصوص. ولذلك فإن تغيير عبارة منطوقة يؤدي إلى فشل اختبار قفل المتن (`scripts/voice/corpus.lock.json`). بالنسبة للغة تحتوي على صوت مسجل، يتم بعد ذلك توليد مقاطع العبارات المعدلة، والتحقق منها والاستماع إليها، ثم نشرها **قبل** الدمج. وأخيرًا، يتم تحديث القفل (`npm run voice:corpus:lock`). وبدون هذه المقاطع، تُقرأ العبارة المعدلة بالصوت المدمج في الجهاز.

## 📊 تخزين البيانات

### بيانات المستخدم

- الملفات الشخصية والتفضيلات
- مستوى التقدم حسب طور اللعب
- النقاط والإحصائيات الخاصة بألعاب الآركيد
- إعدادات التخصيص

### الميزات التقنية

- التخزين المحلي (localStorage) مع حلول بديلة
- عزل البيانات لكل مستخدم
- الحفظ التلقائي لمستوى التقدم
- ترحيل تلقائي للبيانات القديمة

## 🐛 الإبلاغ عن مشكلة

يمكن الإبلاغ عن المشكلات عبر GitHub Issues. يُرجى تضمين ما يلي:

- وصف مفصل للمشكلة
- خطوات إعادة إنتاجها
- المتصفح والإصدار
- لقطات شاشة إذا كانت ذات صلة

## 💝 دعم المشروع

**[☕ التبرع عبر PayPal](https://paypal.me/jls)**

## 📄 الترخيص

هذا المشروع مرخص بموجب رخصة AGPL v3. راجع الملف `LICENSE` لمزيد من التفاصيل.

---

_LeapMultix — تطبيق تعليمي مفتوح المصدر لتعلم العمليات الحسابية الأربع_

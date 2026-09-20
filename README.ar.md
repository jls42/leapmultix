<details>
<summary>هذا المستند متاح أيضًا بلغات أخرى</summary>

- [الإنجليزية](./README.en.md)
- [الإسبانية](./README.es.md)
- [البرتغالية](./README.pt.md)
- [الألمانية](./README.de.md)
- [الصينية](./README.zh.md)
- [الهندية](./README.hi.md)
- [العربية](./README.ar.md)
- [الإيطالية](./README.it.md)
- [السويدية](./README.sv.md)
- [البولندية](./README.pl.md)
- [الهولندية](./README.nl.md)
- [الرومانية](./README.ro.md)
- [اليابانية](./README.ja.md)
- [الكورية](./README.ko.md)

</details>

# LeapMultix

![التكامل المستمر](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![الترخيص: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![شارة Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![حالة بوابة الجودة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![تقييم الموثوقية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![تقييم الأمان](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![تقييم قابلية الصيانة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الدين التقني](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![الأخطاء](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الثغرات الأمنية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![مشكلات جودة الشيفرة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الأسطر المكررة (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![أسطر الشيفرة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## جدول المحتويات

- [الوصف](#الوصف)
- [نظرة عامة](#-نظرة-عامة)
- [الميزات](#-الميزات)
- [البدء السريع](#-البدء-السريع)
- [البنية](#-البنية)
- [أوضاع اللعب بالتفصيل](#-أوضاع-اللعب-بالتفصيل)
- [التطوير](#-التطوير)
- [التوافق](#-التوافق)
- [التوطين](#-التوطين)
- [تخزين البيانات](#-تخزين-البيانات)
- [الإبلاغ عن مشكلة](#-الإبلاغ-عن-مشكلة)
- [الترخيص](#-الترخيص)

## الوصف

LeapMultix هو تطبيق ويب تعليمي تفاعلي مخصص للأطفال من عمر 6 إلى 12 عامًا لإتقان العمليات الحسابية الأربع: الضرب (×)، والجمع (+)، والطرح (−)، والقسمة (÷). ويقدم **5 أوضاع لعب** و**4 ألعاب مصغّرة من نمط Arcade** ضمن واجهة سهلة الاستخدام ومتاحة للجميع ومتعددة اللغات.

**دعم عمليات متعددة:** تقبل الأوضاع الخمسة العمليات الأربع. ويُحدَّد الاختيار من الشاشة الرئيسية ويُطبَّق على المسار بأكمله.

**طوّره:** Julien LS (contact@jls42.org)

**الرابط المباشر:** https://leapmultix.jls42.org/

## 📸 نظرة عامة

### الشاشات

|                                                                                             |                                                                                                        |
| :-----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|             ![شاشة «من يلعب؟»: اختيار الملف الشخصي](docs/media/01-accueil.webp)             |            ![القائمة الرئيسية: اختيار العملية وأوضاع اللعب الخمسة](docs/media/02-menu.webp)            |
|                  **من يلعب؟** — ملف شخصي لكل طفل، مع صورته الرمزية وتقدمه.                  |                       **القائمة** — تُختار العملية هنا، ثم تُفتح الأوضاع الخمسة.                       |
|         ![وضع الاستكشاف: جدول العدد 4 معروض بالنقاط](docs/media/03-decouverte.webp)         |           ![وضع الاختبار: الإجابة الخاطئة بالأحمر والصحيحة بالأخضر](docs/media/04-quiz.webp)           |
|        **الاستكشاف** — تُعرض كل مساواة بالنقاط أو القفزات أو العدّ، مع حيلة الجدول.         | **الاختبار** — يظل اختيار الطفل ظاهرًا بجوار الإجابة الصحيحة، ويشرح التوضيح العملية الحسابية بالتفصيل. |
|               ![وضع التحدي: عدّ تنازلي وسلسلة حالية](docs/media/05-defi.webp)               |     ![وضع المغامرة: خريطة المستويات العشرة مع قفل المستويات التالية](docs/media/06-aventure.webp)      |
| **التحدي** — سباق مع الزمن. عند حدوث خطأ، يتوقف المؤقت مؤقتًا لإتاحة قراءة الإجابة الصحيحة. |                    **المغامرة** — عشرة مستويات تُفتح واحدًا تلو الآخر مقابل النجوم.                    |
|             ![قائمة Arcade: الألعاب المصغّرة الأربع](docs/media/07-arcade.webp)             |          ![لوحة المعلومات: النجوم حسب الجدول والإحصاءات](docs/media/08-tableau-de-bord.webp)           |
|            **Arcade** — أربع ألعاب مصغّرة، مع ضبط مستوى الصعوبة واختيار المركبة.            |       **لوحة المعلومات** — النجوم حسب الجدول، والجداول التي ينبغي مراجعتها، والنتائج حسب الوضع.        |
|   ![التخصيص: الصور الرمزية والسمات وإمكانية الوصول](docs/media/09-personnalisation.webp)    |                                                                                                        |
|   **التخصيص** — الصورة الرمزية، ونسق الألوان، وحجم النص، والتباين العالي، والرمز الأبوي.    |                                                                                                        |

### ألعاب Arcade المصغّرة

أربع ألعاب تطرح السؤال نفسه — المعروض أعلى منطقة
اللعب، مع الوقت المتبقي وعدد الأرواح — لكنها تتطلب في كل مرة حركة
مختلفة.

|                                                                                                        |                                                                                      |
| :----------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: |
|      ![MultiInvaders: وحوش تحمل أرقامًا ومركبة في أسفل الشاشة](docs/media/10-multiinvaders.webp)       | ![MultiMiam: متاهة تحمل فيها النقاط الإجابات المحتملة](docs/media/11-multimiam.webp) |
|     **MultiInvaders** — إطلاق النار على الإجابات الخاطئة وترك الصحيحة: فهي تخفي صديقًا يجب تحريره.     |        **MultiMiam** — اجتياز المتاهة لالتقاط النتيجة الصحيحة مع تجنب الوحوش.        |
| ![MultiMemory: شبكة بطاقات، انقلبت بطاقتان تعرضان عملية حسابية ورقمًا](docs/media/12-multimemory.webp) |       ![MultiSnake: ثعبان وتفاحات مرقمة في مرج](docs/media/13-multisnake.webp)       |
|               **MultiMemory** — تذكّر البطاقة التي تحمل نتيجة العملية الحسابية الظاهرة.                |      **MultiSnake** — النمو بابتلاع الأرقام الصحيحة وتجنب جميع الأرقام الأخرى.       |

## ✨ الميزات

### 🎮 أوضاع اللعب

- **وضع الاستكشاف**: استكشاف مرئي وتفاعلي ملائم لكل عملية
- **وضع الاختبار**: أسئلة متعددة الخيارات تدعم العمليات الأربع (×، +، −، ÷) مع تقدم تكيّفي
- **وضع التحدي**: سباق مع الزمن باستخدام العمليات الأربع (×، +، −، ÷) ومستويات صعوبة مختلفة
- **وضع المغامرة**: تقدم قصصي عبر المستويات مع دعم العمليات الأربع

### 🕹️ ألعاب Arcade المصغّرة

- **MultiInvaders**: لعبة Space Invaders تعليمية - تدمير الإجابات الخاطئة
- **MultiMiam**: لعبة Pac-Man رياضية - جمع الإجابات الصحيحة
- **MultiMemory**: لعبة ذاكرة - مطابقة العمليات بنتائجها
- **MultiSnake**: لعبة Snake تعليمية - النمو بأكل الأرقام الصحيحة

### ➕ دعم عمليات متعددة

يقدم LeapMultix تدريبًا شاملًا على العمليات الحسابية الأربع في **جميع الأوضاع**:

| الوضع     | ×   | +   | −   | ÷   |
| --------- | --- | --- | --- | --- |
| الاختبار  | ✅  | ✅  | ✅  | ✅  |
| التحدي    | ✅  | ✅  | ✅  | ✅  |
| الاستكشاف | ✅  | ✅  | ✅  | ✅  |
| المغامرة  | ✅  | ✅  | ✅  | ✅  |
| Arcade    | ✅  | ✅  | ✅  | ✅  |

### 🌍 ميزات مشتركة

- **تعدد المستخدمين**: إدارة ملفات شخصية فردية مع حفظ التقدم
- **تعدد اللغات**: دعم الفرنسية والإنجليزية والإسبانية
- **التخصيص**: صور رمزية وسمات لونية وخلفيات
- **إمكانية الوصول**: التنقل بلوحة المفاتيح ودعم اللمس والتوافق مع WCAG 2.1 AA
- **تجاوب الأجهزة المحمولة**: واجهة محسّنة للأجهزة اللوحية والهواتف الذكية
- **نظام التقدم**: نتائج وشارات وتحديات يومية

## 🚀 البدء السريع

### المتطلبات الأساسية

- Node.js (الإصدار 16 أو أحدث)
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
```

## 🏗️ البنية

### بنية الملفات

توجد وحدات JavaScript **بصورة مسطحة داخل `js/`**، باستثناء ثلاثة مجلدات:
`core/` و`components/` و`modes/`. ولذلك فإن اسم الملف هو الذي يعبّر عن
التجميع (`arcade-*`، و`multimiam-*`، و`i18n*`…).

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
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### البنية التقنية

**وحدات ES6 حديثة**: يستخدم المشروع بنية معيارية تضم أصناف ES6 وعمليات استيراد وتصدير أصلية.

**مكوّنات قابلة لإعادة الاستخدام**: واجهة مبنية باستخدام مكوّنات UI مركزية (TopBar وInfoBar وDashboard وCustomization).

**Lazy Loading**: تحميل ذكي للوحدات عند الطلب عبر `lazy-loader.js` لتحسين الأداء الأولي.

**نظام تخزين موحّد**: API مركزية للاحتفاظ ببيانات المستخدم عبر LocalStorage مع حلول احتياطية.

**إدارة مركزية للصوت**: التحكم بالصوت مع دعم تعدد اللغات وتفضيلات خاصة بكل مستخدم.

**Event Bus**: تواصل قائم على الأحداث وغير مترابط بين المكوّنات لضمان بنية قابلة للصيانة.

**التنقل عبر الشرائح**: نظام تنقل يستند إلى شرائح مرقمة (slide0 وslide1 وما إلى ذلك) باستخدام `goToSlide()`.

**الأمان**: الحماية من XSS وتنقية المدخلات عبر `security-utils.js` لجميع عمليات معالجة DOM.

## 🎯 أوضاع اللعب بالتفصيل

### وضع الاستكشاف

واجهة للاستكشاف المرئي لجداول الضرب تتضمن:

- عرضًا تفاعليًا لعمليات الضرب
- رسومًا متحركة ووسائل مساعدة على التذكر
- سحبًا وإفلاتًا تعليميًا
- تقدمًا حرًا حسب الجدول

### وضع الاختبار

أسئلة متعددة الخيارات تتضمن:

- 10 أسئلة في كل جلسة
- تقدمًا تكيّفيًا وفقًا للإجابات الصحيحة
- لوحة أرقام افتراضية
- نظام سلسلة من الإجابات الصحيحة

### وضع التحدي

سباق مع الزمن يتضمن:

- 3 مستويات صعوبة (مبتدئ، متوسط، صعب)
- وقتًا إضافيًا مقابل الإجابات الصحيحة
- نظام أرواح
- ترتيبًا لأفضل النتائج

### وضع المغامرة

تقدم قصصي يتضمن:

- 10 مستويات ذات سمات مختلفة قابلة للفتح
- خريطة تفاعلية تعرض التقدم بصريًا
- قصة غامرة مع شخصيات
- نظام نجوم ومكافآت

### ألعاب Arcade المصغّرة

تقدم كل لعبة مصغّرة:

- اختيار مستوى الصعوبة والتخصيص
- نظام أرواح ونتائج
- تحكمًا بلوحة المفاتيح واللمس
- ترتيبًا فرديًا لكل مستخدم

## 🛠️ التطوير

### سير عمل التطوير

**لا تُجرِ أي commit مباشرة على main مطلقًا.** يعمل المشروع من خلال فروع
الميزات.

**1. إنشاء فرع**، باستخدام `feat/` لميزة و`fix/` لإصلاح:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. التطوير والتحقق.** يأتي التنسيق أولًا، إذ ترفضه CI
حتى قبل تشغيل الاختبارات.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. إجراء commit على الفرع**، ثم دفعه:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. فتح pull request** وانتظار التحليلات: verify وCodacy
وCodeFactor وSonarCloud. تُصلح المشكلات حتى تصبح جميع النتائج خضراء قبل الدمج.

**أسلوب commit**: رسائل موجزة بصيغة الأمر (مثل: "Fix arcade init errors" و"Refactor cache updater")

**بوابة الجودة**: التأكد من نجاح `npm run lint` و`npm test` و`npm run test:coverage` قبل كل commit

### بنية المكوّنات

**GameMode (الصنف الأساسي)**: ترث جميع الأوضاع من صنف مشترك ذي أساليب موحّدة.

**GameModeManager**: تنظيم مركزي لتشغيل الأوضاع وإدارتها.

**مكوّنات UI**: توفر TopBar وInfoBar وDashboard وCustomization واجهة متسقة.

**Lazy Loading**: تُحمَّل الوحدات عند الطلب لتحسين الأداء الأولي.

**Event Bus**: تواصل غير مترابط بين المكوّنات عبر نظام الأحداث.

### الاختبارات

يتضمن المشروع حزمة اختبارات شاملة:

- اختبارات وحدات لوحدات core
- اختبارات تكامل للمكوّنات
- اختبارات أوضاع اللعب
- تغطية آلية للشيفرة

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### نسخة الإنتاج

- **Rollup**: تجميع `js/main-es6.js` بصيغة ESM مع code-splitting وsourcemaps
- **Terser**: تصغير آلي لأغراض التحسين
- **Post-build**: نسخ `css/` و`assets/`، وأيقونات favicons ‏(`favicon.ico` و`favicon.png` و`favicon.svg`)، و`sw.js`، وإعادة كتابة `dist/index.html` إلى ملف الإدخال ذي الاسم المرمّز (مثل: `main-es6-*.js`)
- **المجلد النهائي**: `dist/` جاهز للتقديم بصورة ثابتة

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### التكامل المستمر

**GitHub Actions**: ‏`.github/workflows/ci.yml`، ويُشغَّل مع كل push إلى
`main` ومع كل pull request.

**`verify`** — بوابة الجودة الإلزامية:

- `npm ci` ثم `npm run verify` ‏(ESLint واختبارات Jest والتغطية)
- `npm run format:check` ‏(Prettier)

**`seo-report`** — بعد `verify`: تدقيق Lighthouse للموقع المباشر
لتتبّع مقاييس SEO بمرور الوقت.

**التحليلات الخارجية** المرتبطة بطلبات pull request: ‏Codacy وCodeFactor
وSonarCloud. تتطلب بوابة SonarCloud الحصول على تقييم A في الموثوقية والأمان
وقابلية الصيانة للشيفرة الجديدة.

**النشر**: يزامن `./deploy.sh` الموقع مع S3 ويبطل ذاكرة التخزين المؤقت
لـCloudFront. ويعيد البرنامج النصي إنشاء الصور المتجاوبة عند الحاجة، إذ إنها غير موجودة في git.

### PWA (Progressive Web App)

LeapMultix هو تطبيق PWA متكامل يدعم العمل دون اتصال ويمكن تثبيته.

**Service Worker** ‏(`sw.js`):

- التنقل: Network-first مع رجوع احتياطي دون اتصال إلى `offline.html`
- الصور: Cache-first لتحسين الأداء
- الترجمات: Stale-while-revalidate للتحديث في الخلفية
- JS/CSS: ‏Network-first لتقديم أحدث إصدار دائمًا
- إدارة تلقائية للإصدارات عبر `cache-updater.js`

**Manifest** ‏(`manifest.json`):

- أيقونات SVG وPNG لجميع الأجهزة
- إمكانية التثبيت على الأجهزة المحمولة (Add to Home Screen)
- إعداد standalone لتجربة شبيهة بالتطبيقات
- دعم السمات والألوان

**اختبار وضع عدم الاتصال محليًا.** شغّل الخادم، ثم افتح
`http://localhost:8080` (أو المنفذ المعروض):

```bash
npm run serve
```

يدويًا: اقطع الاتصال بالشبكة من أدوات التطوير (علامة تبويب الشبكة،
وضع عدم الاتصال)، ثم حدّث الصفحة. يجب أن يظهر `offline.html`.

تلقائيًا باستخدام Puppeteer:

```bash
npm run test:pwa-offline
```

**برامج إدارة Service Worker النصية**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### معايير الجودة

**أدوات جودة الشيفرة**:

- **ESLint**: إعداد حديث باستخدام flat config ‏(`eslint.config.js`)، مع دعم ES2022
- **Prettier**: تنسيق تلقائي للشيفرة (`.prettierrc`)
- **Stylelint**: التحقق من CSS ‏(`.stylelintrc.json`)
- **JSDoc**: توثيق تلقائي للدوال مع تحليل التغطية

**قواعد مهمة للشيفرة**:

- إزالة المتغيرات والمعاملات غير المستخدمة (`no-unused-vars`)
- استخدام معالجة محددة للأخطاء (من دون كتل catch فارغة)
- تجنب `innerHTML` لصالح دوال `security-utils.js`
- إبقاء التعقيد المعرفي للدوال أقل من 15
- استخراج الدوال المعقدة إلى دوال مساعدة أصغر

**الأمان**:

- **الحماية من XSS**: استخدام دوال `security-utils.js`:
  - `appendSanitizedHTML()` بدلًا من `innerHTML`
  - `createSafeElement()` لإنشاء عناصر آمنة
  - `setSafeMessage()` للمحتوى النصي
- **البرامج النصية الخارجية**: السمة `crossorigin="anonymous"` إلزامية
- **التحقق من المدخلات**: تنقية البيانات الخارجية دائمًا
- **Content Security Policy**: ترويسات CSP لتقييد مصادر البرامج النصية

**إمكانية الوصول**:

- التوافق مع WCAG 2.1 AA
- تنقل كامل بلوحة المفاتيح
- أدوار ARIA وتسميات مناسبة
- تباينات ألوان متوافقة

**الأداء**:

- Lazy loading للوحدات عبر `lazy-loader.js`
- تحسينات CSS وأصول متجاوبة
- Service Worker للتخزين المؤقت الذكي
- Code splitting وتصغير الشيفرة في الإنتاج

## 📱 التوافق

### المتصفحات المدعومة

تعتمد الواجهة على `oklch()` للألوان وعلى `:has()` للحالات
السياقية، مما يحدد الحد الأدنى التالي:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### الأجهزة

- **أجهزة سطح المكتب**: عناصر تحكم بلوحة المفاتيح والفأرة
- **الأجهزة اللوحية**: واجهة لمسية محسّنة
- **الهواتف الذكية**: تصميم متجاوب وتكيّفي

### إمكانية الوصول

- تنقّل كامل بلوحة المفاتيح (Tab، الأسهم، Escape)
- أدوار ARIA وتسميات لقارئات الشاشة
- تباينات ألوان متوافقة
- دعم التقنيات المساعدة

## 🌍 التوطين

دعم كامل لعدة لغات:

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

### نصوص إدارة i18n البرمجية

**`npm run i18n:verify`** - التحقق من اتساق مفاتيح الترجمة

**`npm run i18n:unused`** - سرد مفاتيح الترجمة غير المستخدمة

**`npm run i18n:compare`** - مقارنة ملفات الترجمة مع fr.json (المرجع)

يضمن هذا النص البرمجي (`scripts/compare-translations.cjs`) مزامنة جميع ملفات اللغات:

**الميزات:**

- اكتشاف المفاتيح المفقودة (الموجودة في fr.json والغائبة عن اللغات الأخرى)
- اكتشاف المفاتيح الإضافية (الموجودة في اللغات الأخرى وغير الموجودة في fr.json)
- تحديد القيم الفارغة (`""`، `null`، `undefined`، `[]`)
- التحقق من اتساق الأنواع (string مقابل array)
- تسطيح بُنى JSON المتداخلة باستخدام ترميز النقاط (مثال: `arcade.multiMemory.title`)
- إنشاء تقرير مفصّل في وحدة التحكم
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
- رسائل الخطأ والملاحظات
- الأوصاف والمساعدة السياقية
- المحتوى السردي لوضع المغامرة
- تسميات إمكانية الوصول وARIA

## 📊 تخزين البيانات

### بيانات المستخدم

- الملفات الشخصية والتفضيلات
- التقدّم حسب وضع اللعب
- النتائج والإحصاءات لألعاب الأركيد
- إعدادات التخصيص

### الميزات التقنية

- التخزين المحلي (localStorage) مع حلول بديلة
- عزل البيانات حسب المستخدم
- الحفظ التلقائي للتقدّم
- الترحيل التلقائي للبيانات القديمة

## 🐛 الإبلاغ عن مشكلة

يمكن الإبلاغ عن المشكلات عبر GitHub Issues. يُرجى تضمين:

- وصف مفصّل للمشكلة
- خطوات إعادة إنتاجها
- المتصفح وإصداره
- لقطات شاشة إن كانت ذات صلة

## 💝 دعم المشروع

**[☕ التبرع عبر PayPal](https://paypal.me/jls)**

## 📄 الترخيص

هذا المشروع مرخّص بموجب AGPL v3. راجع الملف `LICENSE` لمزيد من التفاصيل.

---

_LeapMultix — تطبيق تعليمي حرّ لتعلّم العمليات الحسابية الأربع_

<details>
<summary>يتوفر هذا المستند أيضًا بلغات أخرى</summary>

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

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
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
[![روائح الشيفرة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الأسطر المكررة (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![أسطر الشيفرة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## جدول المحتويات

- [الوصف](#الوصف)
- [نظرة عامة](#-نظرة-عامة)
- [الميزات](#-الميزات)
- [البدء السريع](#-البدء-السريع)
- [البنية](#-البنية)
- [تفاصيل أوضاع اللعب](#-تفاصيل-أوضاع-اللعب)
- [التطوير](#-التطوير)
- [التوافق](#-التوافق)
- [التوطين](#-التوطين)
- [الصوت المسجّل](#-الصوت-المسجّل)
- [تخزين البيانات](#-تخزين-البيانات)
- [الإبلاغ عن مشكلة](#-الإبلاغ-عن-مشكلة)
- [الترخيص](#-الترخيص)

## الوصف

LeapMultix هو تطبيق ويب تعليمي تفاعلي مخصّص للأطفال من سن 6 إلى 12 عامًا لإتقان العمليات الحسابية الأربع: الضرب (×)، والجمع (+)، والطرح (−)، والقسمة (÷). ويوفّر **5 أوضاع لعب** و**4 ألعاب Arcade مصغّرة** ضمن واجهة سهلة الاستخدام ومتاحة ومتعددة اللغات.

**دعم العمليات المتعددة:** تقبل الأوضاع الخمسة العمليات الأربع. تُختار العملية من الشاشة الرئيسية وتُطبّق على المسار بأكمله.

**طوّره:** Julien LS (contact@jls42.org)

**الرابط المباشر:** https://leapmultix.jls42.org/

## 📸 نظرة عامة

### الشاشات

|                                                                                              |                                                                                                        |
| :------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|             ![شاشة «من يلعب؟»: اختيار الملف الشخصي](docs/media/01-accueil.webp)              |              ![القائمة الرئيسية: اختيار العملية والأوضاع الخمسة](docs/media/02-menu.webp)              |
|                  **من يلعب؟** — ملف شخصي لكل طفل، مع صورته الرمزية وتقدّمه.                  |                       **القائمة** — تُختار العملية هنا، ثم تُفتح الأوضاع الخمسة.                       |
|          ![وضع الاكتشاف: عرض جدول 4 باستخدام النقاط](docs/media/03-decouverte.webp)          |           ![وضع الاختبار: الإجابة الخاطئة بالأحمر والصحيحة بالأخضر](docs/media/04-quiz.webp)           |
|      **الاكتشاف** — تُعرض كل مساواة بالنقاط أو القفزات أو العدّ، مع حيلة خاصة بالجدول.       | **الاختبار** — يظل اختيار الطفل ظاهرًا بجانب الإجابة الصحيحة، ويشرح التوضيح العملية الحسابية بالتفصيل. |
|           ![وضع التحدي: العدّ التنازلي والسلسلة الحالية](docs/media/05-defi.webp)            |     ![وضع المغامرة: خريطة المستويات العشرة، والمستويات التالية مقفلة](docs/media/06-aventure.webp)     |
| **التحدي** — سباق مع الزمن. عند حدوث خطأ، يتوقف المؤقّت مؤقتًا لإتاحة قراءة الإجابة الصحيحة. |                    **المغامرة** — عشرة مستويات تُفتح واحدًا تلو الآخر مقابل النجوم.                    |
|             ![قائمة Arcade: الألعاب المصغّرة الأربع](docs/media/07-arcade.webp)              |          ![لوحة المعلومات: النجوم حسب الجدول والإحصاءات](docs/media/08-tableau-de-bord.webp)           |
|        **Arcade** — أربع ألعاب مصغّرة، مع ضبط مستوى الصعوبة واختيار المركبة الفضائية.        |       **لوحة المعلومات** — النجوم حسب الجدول، والجداول التي ينبغي مراجعتها، والنتائج حسب الوضع.        |
|    ![التخصيص: الصور الرمزية والسمات وإمكانية الوصول](docs/media/09-personnalisation.webp)    |                                                                                                        |
|   **التخصيص** — الصورة الرمزية، وسمات الألوان، وحجم النص، والتباين العالي، والرمز الأبوي.    |                                                                                                        |

### ألعاب Arcade المصغّرة

أربع ألعاب تطرح السؤال نفسه — وهو السؤال المعروض أعلى منطقة
اللعب، مع الوقت المتبقي وعدد فرص الحياة — لكنها تتطلب في كل مرة حركة
مختلفة.

|                                                                                                            |                                                                                        |
| :--------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: |
|      ![MultiInvaders: وحوش تحمل أرقامًا ومركبة فضائية أسفل الشاشة](docs/media/10-multiinvaders.webp)       | ![MultiMiam: متاهة تحمل فيها الحبيبات الإجابات المحتملة](docs/media/11-multimiam.webp) |
|      **MultiInvaders** — إطلاق النار على الإجابات الخاطئة وترك الصحيحة: فهي تخفي صديقًا ينبغي تحريره.      |        **MultiMiam** — اجتياز المتاهة لالتقاط النتيجة الصحيحة مع تجنّب الوحوش.         |
| ![MultiMemory: شبكة بطاقات، قُلبت منها بطاقتان تعرضان عملية حسابية ورقمًا](docs/media/12-multimemory.webp) |       ![MultiSnake: ثعبان وتفاحات مرقّمة في مرج](docs/media/13-multisnake.webp)        |
|                 **MultiMemory** — تذكّر البطاقة التي تحمل نتيجة العملية الحسابية المكشوفة.                 |       **MultiSnake** — النمو بابتلاع الأرقام الصحيحة وتجنّب جميع الأرقام الأخرى.       |

## ✨ الميزات

### 🎮 أوضاع اللعب

- **وضع الاكتشاف**: استكشاف بصري وتفاعلي ملائم لكل عملية
- **وضع الاختبار**: أسئلة متعددة الخيارات تدعم العمليات الأربع (×، +، −، ÷) وتقدّمًا تكيّفيًا
- **وضع التحدي**: سباق مع الزمن باستخدام العمليات الأربع (×، +، −، ÷) ومستويات صعوبة مختلفة
- **وضع المغامرة**: تقدّم سردي عبر مستويات مع دعم العمليات الأربع

### 🕹️ ألعاب Arcade المصغّرة

- **MultiInvaders**: لعبة Space Invaders تعليمية - تدمير الإجابات الخاطئة
- **MultiMiam**: لعبة Pac-Man رياضية - جمع الإجابات الصحيحة
- **MultiMemory**: لعبة ذاكرة - مطابقة العمليات بنتائجها
- **MultiSnake**: لعبة Snake تعليمية - النمو عبر أكل الأرقام الصحيحة

### ➕ دعم العمليات المتعددة

يوفّر LeapMultix تدريبًا شاملًا على العمليات الحسابية الأربع في **جميع الأوضاع**:

| الوضع    | ×   | +   | −   | ÷   |
| -------- | --- | --- | --- | --- |
| الاختبار | ✅  | ✅  | ✅  | ✅  |
| التحدي   | ✅  | ✅  | ✅  | ✅  |
| الاكتشاف | ✅  | ✅  | ✅  | ✅  |
| المغامرة | ✅  | ✅  | ✅  | ✅  |
| Arcade   | ✅  | ✅  | ✅  | ✅  |

### 🌍 الميزات العامة

- **تعدد المستخدمين**: إدارة ملفات شخصية فردية مع حفظ التقدّم
- **تعدد اللغات**: دعم الفرنسية والإنجليزية والإسبانية
- **التخصيص**: صور رمزية وسمات ألوان وخلفيات
- **إمكانية الوصول**: التنقل بلوحة المفاتيح ودعم اللمس والتوافق مع WCAG 2.1 AA
- **الصوت المسجّل**: أسئلة وعبارات تشجيعية يقرؤها صوت اصطناعي مسجّل مسبقًا (أُنشئ باستخدام ElevenLabs)، مع الرجوع تلقائيًا إلى صوت الجهاز؛ المقاطع غير موجودة في المستودع العام (راجع [الصوت المسجّل](#-الصوت-المسجّل))
- **تصميم متجاوب مع الأجهزة المحمولة**: واجهة محسّنة للأجهزة اللوحية والهواتف الذكية
- **نظام التقدّم**: نتائج وشارات وتحديات يومية

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

### السكربتات المتاحة

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
npm run voice:generate     # Générer les clips (ElevenLabs)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 البنية

### بنية الملفات

توجد وحدات JavaScript **بشكل مسطّح داخل `js/`**، باستثناء ثلاثة مجلدات:
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

**وحدات ES6 حديثة**: يستخدم المشروع بنية معيارية تعتمد على أصناف ES6 وعمليات الاستيراد والتصدير الأصلية.

**مكوّنات قابلة لإعادة الاستخدام**: واجهة مبنية باستخدام مكوّنات UI مركزية (TopBar وInfoBar وDashboard وCustomization).

**Lazy Loading**: تحميل ذكي للوحدات عند الطلب عبر `lazy-loader.js` لتحسين الأداء الأولي.

**نظام تخزين موحّد**: API مركزي لحفظ بيانات المستخدم عبر LocalStorage مع آليات احتياطية.

**إدارة صوت مركزية**: التحكّم في الصوت مع دعم تعدد اللغات وتفضيلات خاصة بكل مستخدم.

**Event Bus**: تواصل قائم على الأحداث وغير مترابط بين المكوّنات لتوفير بنية قابلة للصيانة.

**التنقل عبر الشرائح**: نظام تنقل يعتمد على شرائح مرقّمة (slide0 وslide1 وما إلى ذلك) باستخدام `goToSlide()`.

**الأمان**: الحماية من XSS وتنقية المحتوى عبر `security-utils.js` في جميع عمليات معالجة DOM.

## 🎯 تفاصيل أوضاع اللعب

### وضع الاكتشاف

واجهة للاستكشاف البصري لجداول الضرب، وتتضمن:

- عرضًا تفاعليًا لعمليات الضرب
- رسومًا متحركة ووسائل مساعدة على التذكّر
- سحبًا وإفلاتًا تعليميًا
- تقدّمًا حرًا حسب الجدول

### وضع الاختبار

أسئلة متعددة الخيارات، وتتضمن:

- 10 أسئلة في كل جلسة
- تقدّمًا تكيّفيًا وفقًا للإجابات الصحيحة
- لوحة أرقام افتراضية
- نظام سلسلة من الإجابات الصحيحة

### وضع التحدي

سباق مع الزمن، ويتضمن:

- 3 مستويات صعوبة (مبتدئ، متوسط، صعب)
- وقتًا إضافيًا عند تقديم إجابات صحيحة
- نظام فرص حياة
- ترتيبًا لأفضل النتائج

### وضع المغامرة

تقدّم سردي، ويتضمن:

- 10 مستويات موضوعية قابلة للفتح
- خريطة تفاعلية تعرض التقدّم بصريًا
- قصة غامرة تضم شخصيات
- نظام نجوم ومكافآت

### ألعاب Arcade المصغّرة

توفّر كل لعبة مصغّرة:

- اختيار مستوى الصعوبة والتخصيص
- نظام فرص حياة ونتائج
- تحكّمًا بلوحة المفاتيح واللمس
- تصنيفات فردية لكل مستخدم

## 🔧 التطوير

### سير عمل التطوير

**يجب عدم تنفيذ commit مباشرة على main مطلقًا.** يعتمد المشروع على فروع
الميزات.

**1. إنشاء فرع**، باستخدام `feat/` لميزة و`fix/` لإصلاح:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. التطوير والتحقق.** يأتي التنسيق أولًا، إذ ترفضه CI
قبل تشغيل الاختبارات حتى.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. تنفيذ commit على الفرع**، ثم دفعه:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. فتح pull request** وانتظار التحليلات: verify وCodacy
وCodeFactor وSonarCloud. تُصحّح المشكلات حتى تصبح جميع النتائج خضراء قبل الدمج.

**أسلوب commit**: رسائل موجزة بصيغة الأمر (مثل: "Fix arcade init errors" و"Refactor cache updater")

**بوابة الجودة**: التأكد من نجاح `npm run lint` و`npm test` و`npm run test:coverage` قبل كل commit

### بنية المكوّنات

**GameMode (الصنف الأساسي)**: ترث جميع الأوضاع من صنف مشترك ذي أساليب موحّدة.

**GameModeManager**: تنسيق مركزي لتشغيل الأوضاع وإدارتها.

**مكوّنات UI**: توفّر TopBar وInfoBar وDashboard وCustomization واجهة متّسقة.

**Lazy Loading**: تُحمّل الوحدات عند الطلب لتحسين الأداء الأولي.

**Event Bus**: تواصل غير مترابط بين المكوّنات عبر نظام الأحداث.

### الاختبارات

يتضمن المشروع حزمة اختبارات شاملة:

- اختبارات وحدات لوحدات core
- اختبارات تكامل للمكوّنات
- اختبارات لأوضاع اللعب
- تغطية آلية للشيفرة

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### بناء إصدار الإنتاج

- **Rollup**: تجميع `js/main-es6.js` بصيغة ESM مع تقسيم الشيفرة وخرائط المصدر
- **Terser**: تصغير تلقائي لتحسين الأداء
- **ما بعد البناء**: نسخ `css/` و`assets/`، وأيقونات favicons ‏(`favicon.ico` و`favicon.png` و`favicon.svg`)، و`sw.js`، وإعادة كتابة `dist/index.html` للإشارة إلى ملف الإدخال ذي الاسم المتضمن للتجزئة (مثل: `main-es6-*.js`)
- **المجلد النهائي**: `dist/` جاهز للتقديم بصورة ثابتة

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### التكامل المستمر

**GitHub Actions**: ‏`.github/workflows/ci.yml`، ويُشغّل عند كل push إلى
`main` وعند كل pull request.

**`verify`** — بوابة الجودة الإلزامية:

- `npm ci` ثم `npm run verify` ‏(ESLint واختبارات Jest والتغطية)
- `npm run format:check` ‏(Prettier)

**`seo-report`** — بعد `verify`: تدقيق Lighthouse للموقع المنشور من أجل
تتبّع مقاييس SEO بمرور الوقت.

**التحليلات الخارجية** المرتبطة بطلبات pull request: ‏Codacy وCodeFactor
وSonarCloud. تشترط بوابة SonarCloud الحصول على تقييم A في الموثوقية والأمان
وقابلية الصيانة للشيفرة الجديدة.

**النشر**: يزامن `./deploy.sh` الموقع مع S3 ويلغي صلاحية ذاكرة
CloudFront المؤقتة. يعيد السكربت إنشاء الصور المتجاوبة غير الموجودة في git عند الحاجة.

### PWA (Progressive Web App)

LeapMultix هو PWA متكامل يدعم العمل دون اتصال ويمكن تثبيته.

**Service Worker** ‏(`sw.js`):

- التنقل: Network-first مع رجوع احتياطي دون اتصال إلى `offline.html`
- الصور: Cache-first لتحسين الأداء
- الترجمات: Stale-while-revalidate للتحديث في الخلفية
- JS/CSS: ‏Network-first لتقديم أحدث إصدار دائمًا
- إدارة تلقائية للإصدارات عبر `cache-updater.js`

**Manifest** ‏(`manifest.json`):

- أيقونات SVG وPNG لجميع الأجهزة
- إمكانية التثبيت على الأجهزة المحمولة (Add to Home Screen)
- إعداد standalone لتوفير تجربة شبيهة بالتطبيقات
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

**سكربتات إدارة Service Worker**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### معايير الجودة

**أدوات جودة الكود**:

- **ESLint**: إعداد حديث باستخدام flat config ‏(`eslint.config.js`)، مع دعم ES2022
- **Prettier**: تنسيق تلقائي للكود (`.prettierrc`)
- **Stylelint**: التحقق من صحة CSS ‏(`.stylelintrc.json`)
- **JSDoc**: توثيق تلقائي للدوال مع تحليل التغطية

**قواعد مهمة للكود**:

- حذف المتغيرات والمعاملات غير المستخدمة (`no-unused-vars`)
- استخدام معالجة محددة للأخطاء (من دون كتل catch فارغة)
- تجنّب `innerHTML` واستخدام دوال `security-utils.js` بدلًا منه
- إبقاء التعقيد المعرفي للدوال أقل من 15
- استخراج الدوال المعقدة إلى دوال مساعدة أصغر

**الأمان**:

- **الحماية من XSS**: استخدام دوال `security-utils.js`:
  - `appendSanitizedHTML()` بدلًا من `innerHTML`
  - `createSafeElement()` لإنشاء عناصر آمنة
  - `setSafeMessage()` للمحتوى النصي
- **البرامج النصية الخارجية**: السمة `crossorigin="anonymous"` إلزامية
- **التحقق من المدخلات**: تعقيم البيانات الخارجية دائمًا
- **Content Security Policy**: ترويسات CSP لتقييد مصادر البرامج النصية

**إمكانية الوصول**:

- التوافق مع WCAG 2.1 AA
- تنقّل كامل باستخدام لوحة المفاتيح
- أدوار ARIA وتسميات مناسبة
- تباينات ألوان متوافقة

**الأداء**:

- التحميل الكسول للوحدات عبر `lazy-loader.js`
- تحسينات CSS وأصول متجاوبة
- Service Worker للتخزين المؤقت الذكي
- تقسيم الكود وتصغيره في بيئة الإنتاج

## 📱 التوافق

### المتصفحات المدعومة

تعتمد الواجهة على `oklch()` للألوان وعلى `:has()` للحالات
السياقية، مما يحدد الحد الأدنى التالي:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### الأجهزة

- **أجهزة سطح المكتب**: التحكم بلوحة المفاتيح والفأرة
- **الأجهزة اللوحية**: واجهة محسّنة للمس
- **الهواتف الذكية**: تصميم متجاوب وتكيّفي

### إمكانية الوصول

- تنقّل كامل باستخدام لوحة المفاتيح (Tab، الأسهم، Escape)
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

### البرامج النصية لإدارة i18n

**`npm run i18n:verify`** - التحقق من اتساق مفاتيح الترجمة

**`npm run i18n:unused`** - سرد مفاتيح الترجمة غير المستخدمة

**`npm run i18n:compare`** - مقارنة ملفات الترجمة مع fr.json (المرجع)

يضمن هذا البرنامج النصي (`scripts/compare-translations.cjs`) مزامنة جميع ملفات اللغات:

**الوظائف:**

- اكتشاف المفاتيح المفقودة (الموجودة في fr.json والغائبة عن اللغات الأخرى)
- اكتشاف المفاتيح الإضافية (الموجودة في اللغات الأخرى وغير الموجودة في fr.json)
- تحديد القيم الفارغة (`""`، `null`، `undefined`، `[]`)
- التحقق من اتساق الأنواع (string مقابل array)
- تسطيح بُنى JSON المتداخلة باستخدام الترميز النقطي (مثال: `arcade.multiMemory.title`)
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

- واجهة المستخدم كاملة
- تعليمات الألعاب
- رسائل الخطأ والتغذية الراجعة
- الأوصاف والمساعدة السياقية
- المحتوى السردي لوضع المغامرة
- تسميات إمكانية الوصول وARIA

## 🔊 الصوت المسجّل

تقرأ اللعبة الأسئلة وعبارات التشجيع والشروحات بصوت عالٍ. في الفرنسية، يكون الصوت هو **Lucie**، وهو صوت اصطناعي أُنشئ باستخدام ElevenLabs (نموذج Eleven v3). لا تنطق اللعبة سوى مجموعة محدودة من العبارات، نحو 7,400 عبارة لكل لغة: جميعها مسجّلة مسبقًا، ولا يتصل أي جزء من اللعبة بـ ElevenLabs. تحتفظ الإنجليزية والإسبانية حاليًا بصوت الجهاز.

- **الرجوع التلقائي** إلى صوت الجهاز، عبارةً بعبارة: عند غياب المقطع أو حدوث خطأ فيه، أو رفض المتصفح تشغيله، أو عدم بدء المقطع خلال 1.5 ثانية، أو عند العمل دون اتصال مع عدم وجود المقطع في ذاكرة التخزين المؤقت.
- **الإعدادات**: يفعّل زر الصوت في الشريط العلوي القراءة أو يكتمها؛ ويتيح مربع «الصوت المسجّل» (إمكانية الوصول وعناصر التحكم) الاختيار بين Lucie وصوت الجهاز.
- **دون اتصال**: تبقى المقاطع التي سبق الاستماع إليها في ذاكرة التخزين المؤقت (service worker).

### المقاطع غير موجودة في هذا المستودع

توجد المقاطع في مستودع خاص وفي حاوية S3 مخصصة، وتُقدَّم عبر CloudFront على `/voice/*`. لذلك يستخدم أي fork أو تطوير محلي صوت الجهاز: ففي المستودع تكون العلامة `<meta name="leapmultix-voice-base">` فارغة، ولا يكتب فيها `/voice/` إلا نشر الإنتاج.

عند وجود المقاطع على الجهاز (بعد استنساخ المستودع الخاص بجانب اللعبة، في `../leapmultix-voices`)، يجعلها المعامل `?voix=local` قابلة للتشغيل بواسطة خادم التطوير:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### إنشاء المقاطع

تُنفَّذ سلسلة العمل ببرنامج نصي في `scripts/voice/`، وتعمل على جهاز المالك، ولا تعمل مطلقًا في CI العامة. يبقى مفتاح ElevenLabs في ملف `.env` خارج المستودع، ويُمرَّر عبر `node --env-file`: ولا يدخل أي مفتاح إلى git. يشرح skill الخاص بـ Claude Code ‏[`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) الإجراء خطوة بخطوة (البوابات، والموافقات، والاستئناف)؛ وترد التفاصيل في [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **تقدير** العبارات المتبقية وعدد الأحرف المدفوعة (Eleven v3: نحو 0.53 رصيد لكل حرف).
2. **الإنشاء**. يؤدي تشغيل الأمر نفسه مجددًا إلى استكمال ما ينقص. عندما ينفد الرصيد، يتوقف البرنامج النصي بصورة سليمة (الرمز 3) من دون ترك ملف مكتوب جزئيًا.
3. **التحقق**: لكل عبارة مقطع خاص بها، وكل ملف MP3 صالح. بعد ذلك ينسخ Whisper كل مقطع محليًا، ويشير `voice:check` إلى الأرقام التي أُسيء سماعها والمدد غير الطبيعية.
4. **الاستماع** في صفحة الاستماع (`voice:listen`) إلى المقاطع المشار إليها وإلى عيّنة من الصيغ المؤنثة («واحد في 7»)، التي لا يستطيع Whisper تمييزها. يحتوي كل مقطع على مربع «إعادة التسجيل»، يضيفه إلى قائمة المقاطع المستبعدة.
5. **إعادة تسجيل** المقاطع المستبعدة (`--redo`) وتشغيل Whisper مجددًا، ثم مقارنة كل مقطع قبل التعديل وبعده في صفحة ثانية. يُمنح المقطع الذي يظل منطوقًا بصورة خاطئة بعد محاولتين أو ثلاث نصًا مفروضًا في `SAID_OVERRIDES` ‏(`scripts/voice/said-text.mjs`)، مثل كتابة العدد بالحروف.
6. **نشر** المقاطع، والتحقق من استجابتها عبر الإنترنت، ثم نشر فهرس اللغة، أولًا للمختبرين (`?voix=test`).
7. **إتاحة** الصوت للجميع، ثم تفعيله افتراضيًا. يزيل مفتاح الإيقاف الطارئ (`voice:publish -- remove`) لغةً من الفهرس، فتعود اللعبة إلى صوت الجهاز.

```bash
# 1. Estimer (sans frais)
npm run voice:generate -- --lang fr --dry-run
# 2. Générer (payant)
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --reserve 5000
# 3. Contrôler (Whisper s'installe une fois : voir l'en-tête de whisper_transcribe.py)
npm run voice:check -- --lang fr --probe
.venv-whisper/bin/python scripts/voice/whisper_transcribe.py --manifest ../leapmultix-voices/manifests/fr/<version>.json --clips ../leapmultix-voices/clips/fr/<version> --lang fr --out transcripts-fr.jsonl
npm run voice:check -- --lang fr --transcripts transcripts-fr.jsonl
# 4. Écouter (page locale ; la liste « à refaire » va dans ecartes.txt)
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl
# 5. Refaire (payant), relancer Whisper (il ne transcrit que les clips refaits), comparer
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --redo ecartes.txt
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl --compare ecartes.txt
# 6. Publier
npm run voice:publish -- clips --lang fr --bucket <bucket>
npm run voice:check-online -- --lang fr
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience test
# 7. Ouvrir
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience all --default-on
```

### القاعدة: تُعاد تسجيل أي عبارة منطوقة جرى تعديلها قبل النشر في بيئة الإنتاج

تأتي كل عبارة منطوقة من الترجمات (`assets/translations/{fr,en,es}.json`) وتشكّل جزءًا من مجموعة النصوص. لذلك يؤدي تغيير عبارة منطوقة إلى فشل اختبار قفل مجموعة النصوص (`scripts/voice/corpus.lock.json`). وبالنسبة إلى اللغة التي يتوفر لها صوت مسجّل، تُنشأ مقاطع العبارات المتأثرة، ثم تُفحص ويُستمع إليها، وبعد ذلك تُنشر **قبل** الدمج. وأخيرًا، يُحدَّث القفل (`npm run voice:corpus:lock`). من دون هذه المقاطع، تُقرأ العبارة المعدّلة بصوت الجهاز.

## 📊 تخزين البيانات

### بيانات المستخدم

- الملفات الشخصية والتفضيلات
- التقدم بحسب وضع اللعب
- النقاط وإحصاءات ألعاب الآركيد
- إعدادات التخصيص

### الوظائف التقنية

- تخزين محلي (localStorage) مع آليات رجوع احتياطية
- عزل البيانات لكل مستخدم
- حفظ التقدم تلقائيًا
- ترحيل البيانات القديمة تلقائيًا

## 🐛 الإبلاغ عن مشكلة

يمكن الإبلاغ عن المشكلات عبر issues في GitHub. يُرجى تضمين ما يلي:

- وصف مفصّل للمشكلة
- خطوات إعادة إنتاجها
- المتصفح وإصداره
- لقطات شاشة إن كانت ذات صلة

## 💝 دعم المشروع

**[☕ التبرع عبر PayPal](https://paypal.me/jls)**

## 📄 الترخيص

هذا المشروع مرخّص بموجب AGPL v3. راجع الملف `LICENSE` لمزيد من التفاصيل.

---

_LeapMultix — تطبيق تعليمي حر لتعلّم العمليات الحسابية الأربع_

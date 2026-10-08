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
[![مشكلات جودة الكود](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الأسطر المكررة (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![أسطر الكود](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

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
- [الصوت المسجّل](#-الصوت-المسجّل)
- [تخزين البيانات](#-تخزين-البيانات)
- [الإبلاغ عن مشكلة](#-الإبلاغ-عن-مشكلة)
- [الترخيص](#-الترخيص)

## الوصف

LeapMultix هو تطبيق ويب تعليمي تفاعلي موجّه إلى الأطفال من سن 6 إلى 12 عامًا لإتقان العمليات الحسابية الأربع: الضرب (×)، والجمع (+)، والطرح (−)، والقسمة (÷). ويقدّم **6 أوضاع لعب** و**4 ألعاب Arcade مصغّرة** ضمن واجهة سهلة الاستخدام ومتاحة للجميع ومتعددة اللغات.

**دعم عمليات متعددة:** تدعم جميع الأوضاع العمليات الأربع. ويُحدَّد الاختيار من الشاشة الرئيسية ويظل ساريًا طوال المسار.

**طوّره:** Julien LS (contact@jls42.org)

**الرابط المباشر:** https://leapmultix.jls42.org/

## 📸 نظرة عامة

### الشاشات

|                                                                                                                          |                                                                                                        |
| :----------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|                           ![شاشة «من يلعب؟»: اختيار الملف الشخصي](docs/media/01-accueil.webp)                            |                ![القائمة الرئيسية: اختيار العملية ووضع اللعب](docs/media/02-menu.webp)                 |
|                                **من يلعب؟** — ملف شخصي لكل طفل، مع صورته الرمزية وتقدّمه.                                |                            **القائمة** — تُختار العملية هنا، ثم وضع اللعب.                             |
|                       ![وضع الاستكشاف: عرض جدول 4 باستخدام النقاط](docs/media/03-decouverte.webp)                        |           ![وضع الاختبار: الإجابة الخاطئة بالأحمر والصحيحة بالأخضر](docs/media/04-quiz.webp)           |
|                       **الاستكشاف** — تُعرض كل مساواة بالنقاط أو القفزات أو العدّ، مع حيلة الجدول.                       | **الاختبار** — يظل اختيار الطفل ظاهرًا بجانب الإجابة الصحيحة، ويشرح التوضيح العملية الحسابية بالتفصيل. |
|                          ![وضع التحدي: العد التنازلي والسلسلة الحالية](docs/media/05-defi.webp)                          |     ![وضع المغامرة: خريطة المستويات العشرة مع قفل المستويات التالية](docs/media/06-aventure.webp)      |
|               **التحدي** — سباق مع الزمن. عند وقوع خطأ، يتوقف المؤقت مؤقتًا لإتاحة قراءة الإجابة الصحيحة.                |                    **المغامرة** — عشرة مستويات تُفتح الواحد تلو الآخر مقابل النجوم.                    |
|                    ![وضع السباق الزمني: سباق في الطرح مع المؤقت والتقدّم](docs/media/14-chrono.webp)                     |                  ![قائمة Arcade: الألعاب المصغّرة الأربع](docs/media/07-arcade.webp)                   |
|  **السباق الزمني** — عشر إجابات صحيحة في سباق مع الزمن ضمن العملية المختارة؛ وتُضاف المسائل الخاطئة إلى قائمة للمراجعة.  |                 **Arcade** — أربع ألعاب مصغّرة، مع ضبط مستوى الصعوبة واختيار المركبة.                  |
| ![لوحة المعلومات: الجولات والأرقام القياسية والإجابات في كل وضع، مفصّلة حسب العملية](docs/media/08-tableau-de-bord.webp) |         ![التخصيص: الصور الرمزية والسمات وإمكانية الوصول](docs/media/09-personnalisation.webp)         |
| **لوحة المعلومات** — الجولات والأرقام القياسية لكل وضع، مفصّلة حسب العملية؛ والنجوم والجداول المطلوب مراجعتها في الضرب.  |                  **التخصيص** — الصورة الرمزية وسمة الألوان وحجم النص والتباين العالي.                  |

### ألعاب Arcade المصغّرة

أربع ألعاب تطرح السؤال نفسه — المعروض أعلى منطقة
اللعب مع الوقت المتبقي وعدد الأرواح — لكنها تتطلب في كل مرة حركة
مختلفة.

|                                                                                                               |                                                                                        |
| :-----------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: |
|          ![MultiInvaders: وحوش تحمل أرقامًا ومركبة في أسفل الشاشة](docs/media/10-multiinvaders.webp)          | ![MultiMiam: متاهة تحمل فيها الحبيبات الإجابات المحتملة](docs/media/11-multimiam.webp) |
|       **MultiInvaders** — أطلق النار على الإجابات الخاطئة واترك الصحيحة: فهي تخفي صديقًا ينبغي تحريره.        |       **MultiMiam** — تنقّل في المتاهة لالتقاط النتيجة الصحيحة مع تجنّب الوحوش.        |
| ![MultiMemory: شبكة من البطاقات، تظهر على بطاقتين مقلوبتين عملية حسابية وعدد](docs/media/12-multimemory.webp) |       ![MultiSnake: ثعبان وتفاحات مرقّمة في مرج](docs/media/13-multisnake.webp)        |
|                   **MultiMemory** — تذكّر البطاقة التي تحمل نتيجة العملية الحسابية الظاهرة.                   |       **MultiSnake** — انمُ بابتلاع الأرقام الصحيحة وتجنّب جميع الأرقام الأخرى.        |

## ✨ الميزات

### 🎮 أوضاع اللعب

- **وضع الاستكشاف**: استكشاف بصري وتفاعلي ملائم لكل عملية
- **وضع الاختبار**: أسئلة متعددة الخيارات تدعم العمليات الأربع (×، +، −، ÷) مع تقدّم تكيفي
- **وضع التحدي**: سباق مع الزمن باستخدام العمليات الأربع (×، +، −، ÷) ومستويات صعوبة مختلفة
- **وضع المغامرة**: تقدّم سردي عبر المستويات مع دعم العمليات الأربع
- **وضع السباق الزمني**: 10 إجابات صحيحة في مواجهة مؤقت لا يتوقف، بهدف تحطيم أفضل زمن، مع العمليات الأربع (×، +، −، ÷)

### 🕹️ ألعاب Arcade المصغّرة

- **MultiInvaders**: لعبة Space Invaders تعليمية - دمّر الإجابات الخاطئة
- **MultiMiam**: لعبة Pac-Man رياضية - اجمع الإجابات الصحيحة
- **MultiMemory**: لعبة ذاكرة - طابق العمليات مع النتائج
- **MultiSnake**: لعبة Snake تعليمية - انمُ بأكل الأرقام الصحيحة

### ➕ دعم عمليات متعددة

يقدّم LeapMultix تدريبًا شاملًا على العمليات الحسابية الأربع في **جميع الأوضاع**:

| الوضع         | ×   | +   | −   | ÷   |
| ------------- | --- | --- | --- | --- |
| الاختبار      | ✅  | ✅  | ✅  | ✅  |
| التحدي        | ✅  | ✅  | ✅  | ✅  |
| الاستكشاف     | ✅  | ✅  | ✅  | ✅  |
| المغامرة      | ✅  | ✅  | ✅  | ✅  |
| السباق الزمني | ✅  | ✅  | ✅  | ✅  |
| Arcade        | ✅  | ✅  | ✅  | ✅  |

### 🌍 ميزات مشتركة

- **تعدد المستخدمين**: إدارة ملفات شخصية منفردة مع حفظ التقدّم
- **تعدد اللغات**: دعم الفرنسية والإنجليزية والإسبانية
- **التخصيص**: صور رمزية وسمات ألوان وخلفيات
- **إمكانية الوصول**: التنقّل بلوحة المفاتيح ودعم اللمس والتوافق مع WCAG 2.1 AA
- **الصوت المسجّل**: تستطيع اللعبة قراءة الأسئلة وعبارات التشجيع بصوت اصطناعي مسجّل مسبقًا، مع الرجوع تلقائيًا إلى صوت الجهاز. الأصوات غير موجودة في هذا المستودع: يقدّم الموقع leapmultix.jls42.org صوت Lucie بالفرنسية، وSulafat بالإنجليزية والإسبانية، كما يتيح الاختيار بين Sulafat وMarie بالفرنسية، وJane بالإنجليزية (راجع [الصوت المسجّل](#-الصوت-المسجّل))
- **متجاوب مع الأجهزة المحمولة**: واجهة محسّنة للأجهزة اللوحية والهواتف الذكية
- **نظام التقدّم**: لوحة معلومات لكل ملف شخصي (الجولات والأرقام القياسية والجداول المطلوب مراجعتها، مفصّلة حسب العملية)، وشارات وتحديات يومية

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

### النصوص البرمجية المتاحة

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

## 🧱 البنية

### بنية الملفات

وحدات JavaScript **موضوعة مباشرة داخل `js/`** باستثناء ثلاثة مجلدات:
`core/` و`components/` و`modes/`. لذلك يحمل اسم الملف دلالة
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
│   │   ├── audio.js, theme.js                # Son, thèmes
│   │   ├── eventBus.js, mainInit.js          # Événements, amorçage DOM
│   │   ├── adventure-data.js                 # Niveaux du mode Aventure
│   │   ├── mult-stats.js, challenge-stats.js, operation-stats.js
│   │   ├── chrono-stats.js, chrono-questions.js, chrono-input.js   # Mode Chrono
│   │   ├── mode-stats.js, adventure-progress.js   # Compteurs du tableau de bord
│   │   ├── daily-challenge.js, tablePreferences.js, stats-migration.js
│   │   ├── userUi.js, utils.js               # Utilitaires (source canonique)
│   │   └── operations/                       # Une classe par opération
│   │       ├── Operation.js, OperationRegistry.js
│   │       └── Multiplication.js, Addition.js, Subtraction.js, Division.js
│   ├── components/         # Composants d'interface
│   │   ├── topBar.js, infoBar.js, dashboard.js, customization.js
│   │   ├── operationSelector.js, operationModeAvailability.js
│   │   └── icons.js, tableSettingsModal.js
│   ├── modes/              # Les six modes de jeu
│   │   ├── DiscoveryMode.js, QuizMode.js, ChallengeMode.js
│   │   └── AdventureMode.js, ChronoMode.js, ArcadeMode.js
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

**وحدات ES6 حديثة**: يستخدم المشروع بنية معيارية تعتمد على فئات ES6 وعمليات الاستيراد والتصدير الأصلية.

**مكوّنات قابلة لإعادة الاستخدام**: واجهة مبنية باستخدام مكوّنات UI مركزية (TopBar، وInfoBar، وDashboard، وCustomization).

**Lazy Loading**: تحميل ذكي للوحدات عند الطلب عبر `lazy-loader.js` لتحسين الأداء الأولي.

**نظام تخزين موحّد**: API مركزي لحفظ بيانات المستخدم عبر LocalStorage مع آليات احتياطية.

**إدارة صوت مركزية**: التحكّم في الصوت مع دعم تعدد اللغات وتفضيلات خاصة بكل مستخدم.

**Event Bus**: تواصل قائم على الأحداث وغير مترابط بين المكوّنات لبنية قابلة للصيانة.

**التنقّل عبر الشرائح**: نظام تنقّل قائم على شرائح مرقّمة (slide0، وslide1، وما إلى ذلك) باستخدام `goToSlide()`.

**الأمان**: حماية من XSS وتنقية عبر `security-utils.js` لجميع عمليات معالجة DOM.

## 🎯 أوضاع اللعب بالتفصيل

### وضع الاستكشاف

واجهة استكشاف بصري ملائمة لكل عملية، وتضم:

- عرضًا تفاعليًا لعمليات الضرب
- رسومًا متحركة ووسائل مساعدة على التذكّر
- سحبًا وإفلاتًا تعليميًا
- تقدّمًا حرًا حسب الجدول

### وضع الاختبار

أسئلة متعددة الخيارات تشمل:

- 10 أسئلة في كل جلسة
- تقدّمًا تكيفيًا وفقًا للإجابات الصحيحة
- لوحة أرقام افتراضية
- نظام streak (سلسلة من الإجابات الصحيحة)

### وضع التحدي

سباق مع الزمن يشمل:

- 3 مستويات للصعوبة (مبتدئ، ومتوسط، وصعب)
- وقتًا إضافيًا للإجابات الصحيحة
- نظام أرواح
- ترتيبًا لأفضل النتائج

### وضع المغامرة

تقدّم سردي يشمل:

- 10 مستويات ذات سمات مختلفة قابلة للفتح
- خريطة تفاعلية مع عرض مرئي للتقدّم
- قصة غامرة مع شخصيات
- نظام نجوم ومكافآت

### وضع السباق الزمني

عشر إجابات صحيحة بأسرع وقت ممكن، في مواجهة مؤقت لا يتوقف:

- العمليات الأربع: جداول الضرب (المضبوطة في إعدادات الجداول)، وجميع جداول
  الجمع (7 + k)، والطرح ((7 + k) − 7)، والقسمة ((7 × k) ÷ 7)
- الإجابة بالاختيار أو بلوحة الأرقام، بالنقر أو باستخدام لوحة المفاتيح
- أفضل الأزمنة ومتوسط الزمن ومنحنى الجولات الأخيرة، حسب العملية
- «مسائلي المطلوب مراجعتها»: قائمة لكل عملية تُراجع في الاتجاهين (6 × 7 و7 × 6،
  و15 − 7 و15 − 8)

### لوحة المعلومات

ما لعبه الطفل فعليًا، ملفًا شخصيًا تلو الآخر:

- نجوم المغامرة وجداول الضرب المطلوب مراجعتها (آخر 20 إجابة في كل جدول)
- الأسئلة والإجابات الصحيحة في الاختبار والتحدي والمغامرة والسباق الزمني
- الجولات والأرقام القياسية لكل وضع وكل لعبة مصغّرة، بما في ذلك الجولات المتروكة، مفصّلة حسب العملية
  بمجرد أن يتدرّب الطفل على أكثر من عملية

### ألعاب Arcade المصغّرة

تقدّم كل لعبة مصغّرة:

- اختيار مستوى الصعوبة والتخصيص
- نظام أرواح ونقاط
- التحكّم بلوحة المفاتيح واللمس
- ترتيبًا فرديًا لكل مستخدم

## 🔧 التطوير

### سير عمل التطوير

**لا تجرِ commit مباشرة على main مطلقًا.** يعمل المشروع باستخدام فروع
الميزات.

**1. أنشئ فرعًا**، باستخدام `feat/` لميزة و`fix/` لإصلاح:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. طوّر وتحقّق.** يأتي التنسيق أولًا: ترفضه CI
حتى قبل تشغيل الاختبارات.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. نفّذ commit على الفرع**، ثم ادفعه:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. افتح pull request** وانتظر التحليلات: verify، وCodacy،
وCodeFactor، وSonarCloud. أصلح المشكلات حتى تصبح جميع النتائج خضراء قبل الدمج.

**أسلوب commit**: رسائل موجزة بصيغة الأمر (مثل: "Fix arcade init errors"، و"Refactor cache updater")

**بوابة الجودة**: تأكّد من نجاح `npm run lint` و`npm test` و`npm run test:coverage` قبل كل commit

### بنية المكوّنات

**GameMode (الفئة الأساسية)**: ترث جميع الأوضاع من فئة مشتركة ذات أساليب موحّدة.

**GameModeManager**: تنسيق مركزي لتشغيل الأوضاع وإدارتها.

**مكوّنات UI**: توفّر TopBar وInfoBar وDashboard وCustomization واجهة متناسقة.

**Lazy Loading**: تُحمّل الوحدات عند الطلب لتحسين الأداء الأولي.

**Event Bus**: تواصل غير مترابط بين المكوّنات عبر نظام الأحداث.

### الاختبارات

يتضمّن المشروع حزمة اختبارات شاملة:

- اختبارات وحدات لوحدات core
- اختبارات تكامل للمكوّنات
- اختبارات لأوضاع اللعب
- تغطية آلية للكود

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### إصدار الإنتاج

- **Rollup**: يجمع `js/main-es6.js` بصيغة ESM مع code-splitting وsourcemaps
- **Terser**: تصغير تلقائي للتحسين
- **Post-build**: نسخ `css/` و`assets/`، وأيقونات favicons ‏(`favicon.ico`، و`favicon.png`، و`favicon.svg`)، و`sw.js`، وإعادة كتابة `dist/index.html` إلى ملف الإدخال ذي الاسم المبني على hash (مثل: `main-es6-*.js`)
- **المجلد النهائي**: `dist/` جاهز للتقديم بشكل ثابت

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### التكامل المستمر

**GitHub Actions**: ‏`.github/workflows/ci.yml`، ويُشغّل عند كل push إلى
`main` وعند كل pull request.

**`verify`** — بوابة الجودة الإلزامية:

- `npm ci` ثم `npm run verify` ‏(ESLint، واختبارات Jest، والتغطية)
- `npm run format:check` ‏(Prettier)

**`seo-report`** — بعد `verify`: تدقيق Lighthouse للموقع المباشر من أجل
متابعة مقاييس SEO بمرور الوقت.

**التحليلات الخارجية** المرتبطة بطلبات pull request: ‏Codacy، وCodeFactor،
وSonarCloud. تشترط بوابة SonarCloud الحصول على تقييم A في الموثوقية والأمان
وقابلية الصيانة للكود الجديد.

**النشر**: يزامن `./deploy.sh` الموقع مع S3 ويلغي صلاحية ذاكرة
CloudFront المؤقتة. ويعيد النص البرمجي عند الحاجة إنشاء الصور المتجاوبة غير الموجودة في git.

### PWA (تطبيق ويب تقدمي)

LeapMultix هو تطبيق PWA متكامل يدعم العمل دون اتصال وإمكانية التثبيت.

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

يدويًا: اقطع الاتصال بالشبكة من أدوات المطور (تبويب الشبكة،
وضع عدم الاتصال)، ثم حدّث الصفحة. يجب أن يظهر `offline.html`.

تلقائيًا، باستخدام Puppeteer:

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
- **Stylelint**: التحقق من صحة CSS ‏(`.stylelintrc.json`)
- **JSDoc**: توثيق تلقائي للدوال مع تحليل التغطية

**قواعد مهمة للشيفرة**:

- حذف المتغيرات والمعاملات غير المستخدمة (`no-unused-vars`)
- استخدام معالجة محددة للأخطاء (من دون كتل catch فارغة)
- تجنّب `innerHTML` لصالح دوال `security-utils.js`
- الحفاظ على تعقيد إدراكي أقل من 15 للدوال
- استخراج الدوال المعقدة إلى دوال helpers أصغر

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
- تنقل كامل بلوحة المفاتيح
- أدوار ARIA وتسميات مناسبة
- تباينات ألوان متوافقة

**الأداء**:

- التحميل الكسول للوحدات عبر `lazy-loader.js`
- تحسينات CSS وموارد متجاوبة
- Service Worker للتخزين المؤقت الذكي
- تقسيم الشيفرة وتصغيرها في بيئة الإنتاج

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
- **الأجهزة اللوحية**: واجهة لمسية محسّنة
- **الهواتف الذكية**: تصميم متجاوب وتكيّفي

### إمكانية الوصول

- تنقل كامل بلوحة المفاتيح (Tab، الأسهم، Esc)
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

### برامج إدارة i18n النصية

**`npm run i18n:verify`** - التحقق من اتساق مفاتيح الترجمة

**`npm run i18n:unused`** - سرد مفاتيح الترجمة غير المستخدمة

**`npm run i18n:compare`** - مقارنة ملفات الترجمة مع fr.json (المرجع)

يضمن هذا البرنامج النصي (`scripts/compare-translations.cjs`) مزامنة جميع ملفات اللغات:

**الميزات:**

- اكتشاف المفاتيح المفقودة (الموجودة في fr.json والغائبة عن اللغات الأخرى)
- اكتشاف المفاتيح الإضافية (الموجودة في اللغات الأخرى وغير الموجودة في fr.json)
- تحديد القيم الفارغة (`""`، `null`، `undefined`، `[]`)
- التحقق من اتساق الأنواع (string مقابل array)
- تسطيح بنى JSON المتداخلة باستخدام ترميز النقاط (مثال: `arcade.multiMemory.title`)
- إنشاء تقرير مفصل في وحدة التحكم
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
- رسائل الخطأ والملاحظات
- الأوصاف والمساعدة السياقية
- المحتوى السردي لوضع المغامرة
- تسميات إمكانية الوصول وARIA

## 🔊 الصوت المسجّل

تقرأ اللعبة الأسئلة وعبارات التشجيع والشروحات بصوت عالٍ. وهي لا تنطق سوى مجموعة محدودة من العبارات، نحو 7,400 عبارة لكل لغة؛ لذا يمكن تسجيلها مرة واحدة نهائيًا، وعندئذ لا يستدعي أي جزء خدمة توليف صوتي. في غياب المقاطع، تقرأ اللعبة بصوت الجهاز.

### في هذا المستودع: التطبيق من دون الأصوات

تستطيع الشيفرة تشغيل المقاطع المسجّلة مسبقًا، وتتضمن سلسلة الأدوات التي تُنشئها. لا توجد المقاطع فيه، ولا مفاتيح المزوّدين؛ لذا تستخدم أي نسخة متفرعة أو تثبيت محلي صوت الجهاز.

- **رجوع تلقائي** إلى صوت الجهاز، عبارةً بعبارة: إذا كان المقطع غائبًا أو حدث فيه خطأ، أو رفض المتصفح التشغيل، أو لم يبدأ المقطع خلال 1.5 ثانية، أو عند عدم الاتصال إذا لم يكن المقطع موجودًا في ذاكرة التخزين المؤقت.
- **الإعدادات**: يفعّل زر الصوت في الشريط العلوي القراءة أو يوقفها؛ ويتيح مربع «الصوت المسجّل» (إمكانية الوصول وعناصر التحكم) الاختيار بين الصوت المسجّل وصوت الجهاز. ولا يظهر إلا في اللغات التي نُشر لها صوت.
- **عدم الاتصال**: تبقى المقاطع التي سبق الاستماع إليها في ذاكرة التخزين المؤقت (Service Worker).
- **أين تبحث اللعبة عن المقاطع**: في الوسم `<meta name="leapmultix-voice-base">`، وهو فارغ في المستودع. ولا يكتب فيه سوى نشر الإنتاج القيمة `/voice/`.

عند وجود مقاطعك الخاصة على الجهاز (المنشأة بالسلسلة أدناه والموضوعة بجانب اللعبة في `../leapmultix-voices`)، يجعل المعامل `?voix=local` خادم التطوير يشغّلها:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### على leapmultix.jls42.org: أصوات الاستضافة

يقدّم الموقع الذي يوفره المؤلف أصواتًا اصطناعية مسجّلة:

- بالفرنسية، **Lucie**، أُنشئت باستخدام ElevenLabs (النموذج Eleven v3)؛
- بالإنجليزية البريطانية والإسبانية الإسبانية، **Sulafat**، أُنشئت باستخدام Google Cloud Text-to-Speech (الصوت Chirp 3 HD)؛
- وباختيار اللاعب، **Sulafat** بالفرنسية، للحفاظ على الصوت نفسه في اللغات الثلاث؛
- وباختيار اللاعب أيضًا، **Marie** بالفرنسية و**Jane** بالإنجليزية، أُنشئتا باستخدام Mistral AI ‏(Voxtral TTS).

توجد المقاطع في مستودع خاص وفي حاوية S3 مخصصة، وتُقدَّم عبر CloudFront على `/voice/*`. وتُنشأ مرة واحدة؛ فلا يُرسل شيء إلى هذه الخدمات أثناء اللعب. في الإعدادات، تعرض قائمة «الصوت» أصوات اللغة عندما يتوفر لها أكثر من صوت، ويذكر التنويه الخدمة الخاصة بالصوت المسموع.

### إنشاء المقاطع

سلسلة الأدوات مؤتمتة ببرامج نصية في `scripts/voice/`، وتعمل على جهاز المالك فقط، وليس في CI العام مطلقًا. تبقى مفاتيح المزوّدين (ElevenLabs لصوت Lucie، وGoogle Cloud Text-to-Speech لصوت Sulafat، وMistral لصوتي Marie وJane) في ملف `.env` خارج المستودع، ويُمرَّر عبر `node --env-file`؛ ولا يدخل أي مفتاح إلى git. يشرح skill الخاص بـClaude Code ‏[`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) الإجراء خطوة بخطوة (البوابات، والموافقات، وعمليات الاستئناف)؛ وتوجد التفاصيل في [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **تقدير** العبارات المتبقية وعدد الأحرف المدفوعة (Eleven v3: نحو 0.53 رصيد لكل حرف؛ Chirp 3 HD: ‏30 دولارًا لكل مليون حرف، مع إعفاء أول مليون كل شهر؛ Voxtral TTS: ‏16 دولارًا لكل مليون).
2. **الإنشاء**. تؤدي إعادة تشغيل الأمر نفسه إلى استكمال ما ينقص. عند نفاد الأرصدة، يتوقف البرنامج النصي بصورة سليمة (الرمز 3) من دون ترك ملف مكتوب جزئيًا. يضع `--max-total-chars` حدًا أقصى للإنفاق التراكمي للإصدار: تُسجَّل كل استجابة مدفوعة فور استلامها في سجل يبقى محفوظًا حتى عند التوقف المفاجئ. ولدى Google وMistral، اللتين لا تعرضان أي رصيد قابل للقراءة، تمثل هذه الحماية الوحيدة.
3. **التحقق**: لكل عبارة مقطعها، وكل ملف MP3 صالح. بعد ذلك ينسخ Whisper كل مقطع محليًا، ويشير الفحص إلى الأرقام التي أسيء سماعها والمدد غير الطبيعية. يجمع `voice:review` تشغيل Whisper وهذا الفحص وصفحة الاستماع في أمر واحد.
4. **الاستماع** في صفحة الاستماع (`voice:listen`) إلى المقاطع المشار إليها وإلى عينة من الصيغ المؤنثة («واحدة في 7»)، التي لا يميزها Whisper. لكل مقطع مربع «إعادة الإنشاء»، يضيفه إلى قائمة المقاطع المستبعدة.
5. **إعادة إنشاء** المقاطع المستبعدة (`--redo`) وإعادة تشغيل Whisper، ثم مقارنة كل مقطع قبل الإعادة وبعدها في صفحة ثانية. يُعطى المقطع الذي يظل منطوقًا بصورة خاطئة بعد محاولتين أو ثلاث نصًا مفروضًا في `SAID_OVERRIDES` ‏(`scripts/voice/said-text.mjs`)، مثل كتابة العدد بالحروف.
6. **نشر** المقاطع، والتحقق من استجابتها عبر الإنترنت، ثم نشر فهرس اللغة، أولًا للمختبرين (`?voix=test`).
7. **إتاحة** الصوت للجميع، ثم تفعيله افتراضيًا. يزيل قاطع الطوارئ (`voice:publish -- remove`) لغةً من الفهرس؛ فتعود اللعبة إلى صوت الجهاز.

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

### القاعدة: تُعاد عملية تسجيل أي عبارة منطوقة معدّلة قبل نقلها إلى بيئة الإنتاج

تأتي كل عبارة منطوقة من الترجمات (`assets/translations/{fr,en,es}.json`) وتشكل جزءًا من المتن. لذلك يؤدي تغيير عبارة منطوقة إلى فشل اختبار قفل المتن (`scripts/voice/corpus.lock.json`). بالنسبة إلى لغة يتوفر لها صوت مسجّل، تُنشأ عندئذ مقاطع العبارات المتأثرة، ويُتحقق منها ويُستمع إليها، ثم تُنشر **قبل** الدمج. وأخيرًا يُحدَّث القفل (`npm run voice:corpus:lock`). من دون هذه المقاطع، تُقرأ العبارة المعدّلة بصوت الجهاز.

## 📊 تخزين البيانات

### بيانات المستخدم

- الملفات الشخصية والتفضيلات
- التقدم حسب وضع اللعب
- نتائج ألعاب Arcade وإحصاءاتها
- إعدادات التخصيص

### الميزات التقنية

- تخزين محلي (localStorage) مع آليات رجوع احتياطية
- بيانات اللعبة مرتبة حسب الملف الشخصي (تبقى الإحصاءات الخاصة بكل عملية حسابية مشتركة على الجهاز)
- حفظ تلقائي للتقدم
- ترحيل تلقائي للبيانات القديمة

## 🐛 الإبلاغ عن مشكلة

يمكن الإبلاغ عن المشكلات عبر GitHub Issues. يُرجى تضمين:

- وصف تفصيلي للمشكلة
- خطوات إعادة إنتاجها
- المتصفح وإصداره
- لقطات شاشة إن كانت ذات صلة

## 💝 دعم المشروع

**[☕ التبرع عبر PayPal](https://paypal.me/jls)**

## 📄 الترخيص

هذا المشروع مرخّص بموجب AGPL v3. راجع الملف `LICENSE` لمزيد من التفاصيل.

---

_LeapMultix — تطبيق تعليمي حر لتعلّم العمليات الحسابية الأربع_

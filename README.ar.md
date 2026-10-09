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

![التكامل المستمر](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![الترخيص: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![شارة Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![حالة بوابة الجودة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![تقييم الموثوقية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![تقييم الأمان](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![تقييم قابلية الصيانة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الدَّين التقني](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![الأخطاء البرمجية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![الثغرات الأمنية](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![مؤشرات سوء جودة الشيفرة](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
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
- [الصوت المسجل](#-صوت-مسجّل)
- [تخزين البيانات](#-تخزين-البيانات)
- [الإبلاغ عن مشكلة](#-الإبلاغ-عن-مشكلة)
- [الترخيص](#-الترخيص)

## الوصف

LeapMultix هو تطبيق ويب تعليمي تفاعلي مخصص للأطفال من سن 6 إلى 12 عامًا لإتقان العمليات الحسابية الأربع: الضرب (×)، والجمع (+)، والطرح (−)، والقسمة (÷). ويقدم **6 أوضاع لعب** و**4 ألعاب Arcade مصغرة** ضمن واجهة سهلة الاستخدام ومتاحة ومتعددة اللغات.

**دعم العمليات المتعددة:** تقبل جميع الأوضاع العمليات الأربع. ويُختار نوع العملية من الشاشة الرئيسية ويُطبَّق طوال المسار.

**طوّره:** Julien LS (contact@jls42.org)

**الرابط المباشر:** https://leapmultix.jls42.org/

## 📸 نظرة عامة

### الشاشات

|                                                                                                                        |                                                                                                        |
| :--------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|                          ![شاشة «من يلعب؟»: اختيار الملف الشخصي](docs/media/01-accueil.webp)                           |                ![القائمة الرئيسية: اختيار العملية ووضع اللعب](docs/media/02-menu.webp)                 |
|                               **من يلعب؟** — ملف شخصي لكل طفل، مع صورته الرمزية وتقدمه.                                |                            **القائمة** — تُختار العملية هنا، ثم وضع اللعب.                             |
|                         ![وضع الاستكشاف: جدول 4 معروض بالنقاط](docs/media/03-decouverte.webp)                          |           ![وضع الاختبار: الإجابة الخاطئة بالأحمر والصحيحة بالأخضر](docs/media/04-quiz.webp)           |
|                      **الاستكشاف** — تُعرض كل مساواة بالنقاط أو القفزات أو العد، مع حيلة الجدول.                       | **الاختبار** — يظل اختيار الطفل ظاهرًا بجوار الإجابة الصحيحة، ويشرح التوضيح العملية الحسابية بالتفصيل. |
|                         ![وضع التحدي: العد التنازلي والسلسلة الحالية](docs/media/05-defi.webp)                         |     ![وضع المغامرة: خريطة المستويات العشرة، والمستويات التالية مقفلة](docs/media/06-aventure.webp)     |
|                **التحدي** — سباق مع الزمن. عند الخطأ، يتوقف المؤقت مؤقتًا لإتاحة قراءة الإجابة الصحيحة.                |                         **المغامرة** — عشرة مستويات تُفتح تباعًا مقابل النجوم.                         |
|                   ![وضع السباق الزمني: سباق في الطرح، مع المؤقت والتقدم](docs/media/14-chrono.webp)                    |                   ![قائمة Arcade: الألعاب المصغرة الأربع](docs/media/07-arcade.webp)                   |
| **السباق الزمني** — عشر إجابات صحيحة في سباق مع الزمن ضمن العملية المختارة؛ وتُضاف المسائل الخاطئة إلى قائمة للمراجعة. |                     **Arcade** — أربع ألعاب مصغرة، مع ضبط الصعوبة واختيار المركبة.                     |
| ![لوحة المعلومات: الجولات والأرقام القياسية والإجابات لكل وضع، مفصلة حسب العملية](docs/media/08-tableau-de-bord.webp)  |         ![التخصيص: الصور الرمزية والسمات وإمكانية الوصول](docs/media/09-personnalisation.webp)         |
|  **لوحة المعلومات** — الجولات والأرقام القياسية لكل وضع، مفصلة حسب العملية؛ والنجوم وجداول الضرب التي ينبغي مراجعتها.  |          **التخصيص** — صور رمزية تُفتح بالقطع النقدية، وسمات لونية، وحجم النص، وتباين مرتفع.           |

### ألعاب Arcade المصغرة

أربع ألعاب تطرح السؤال نفسه — المعروض فوق منطقة
اللعب، مع الوقت المتبقي وعدد المحاولات — لكنها تتطلب في كل مرة حركة
مختلفة.

|                                                                                                          |                                                                                 |
| :------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
|       ![MultiInvaders: وحوش تحمل أرقامًا ومركبة في أسفل الشاشة](docs/media/10-multiinvaders.webp)        | ![MultiMiam: متاهة تحمل حباتها الإجابات المحتملة](docs/media/11-multimiam.webp) |
|     **MultiInvaders** — أطلق النار على الإجابات الخاطئة واترك الصحيحة: فهي تخفي صديقًا ينبغي تحريره.     |    **MultiMiam** — تنقّل في المتاهة لالتقاط النتيجة الصحيحة مع تجنب الوحوش.     |
| ![MultiMemory: شبكة بطاقات، بطاقتان مقلوبتان تعرضان عملية حسابية ورقمًا](docs/media/12-multimemory.webp) |     ![MultiSnake: أفعى وتفاحات مرقمة في مرج](docs/media/13-multisnake.webp)     |
|                **MultiMemory** — تذكّر البطاقة التي تحمل نتيجة العملية الحسابية المكشوفة.                |        **MultiSnake** — انمُ بابتلاع الأرقام الصحيحة وتجنب سائر الأرقام.        |

## ✨ الميزات

### 🎮 أوضاع اللعب

- **وضع الاستكشاف**: استكشاف مرئي وتفاعلي ملائم لكل عملية
- **وضع الاختبار**: أسئلة متعددة الخيارات تدعم العمليات الأربع (×، +، −، ÷) مع تقدم تكيفي
- **وضع التحدي**: سباق مع الزمن باستخدام العمليات الأربع (×، +، −، ÷) ومستويات صعوبة مختلفة
- **وضع المغامرة**: تقدم قصصي عبر المستويات مع دعم العمليات الأربع
- **وضع السباق الزمني**: 10 إجابات صحيحة في سباق مع مؤقت لا يتوقف لتحطيم أفضل وقت، باستخدام العمليات الأربع (×، +، −، ÷)

### 🕹️ ألعاب Arcade المصغرة

- **MultiInvaders**: لعبة Space Invaders تعليمية - دمّر الإجابات الخاطئة
- **MultiMiam**: لعبة Pac-Man رياضية - اجمع الإجابات الصحيحة
- **MultiMemory**: لعبة ذاكرة - طابق العمليات مع النتائج
- **MultiSnake**: لعبة Snake تعليمية - انمُ عبر أكل الأرقام الصحيحة

### ➕ دعم العمليات المتعددة

يوفر LeapMultix تدريبًا متكاملًا على العمليات الحسابية الأربع في **جميع الأوضاع**:

| الوضع         | ×   | +   | −   | ÷   |
| ------------- | --- | --- | --- | --- |
| الاختبار      | ✅  | ✅  | ✅  | ✅  |
| التحدي        | ✅  | ✅  | ✅  | ✅  |
| الاستكشاف     | ✅  | ✅  | ✅  | ✅  |
| المغامرة      | ✅  | ✅  | ✅  | ✅  |
| السباق الزمني | ✅  | ✅  | ✅  | ✅  |
| Arcade        | ✅  | ✅  | ✅  | ✅  |

### 🌍 الميزات العامة

- **تعدد المستخدمين**: ملف شخصي لكل طفل مع تقدمه؛ وعلى حاسوب الفصل تُرتَّب الأسماء الأولى، ويظهر مرشح ابتداءً من 10 لاعبين، وتتوفر سلة محذوفات لمدة 30 يومًا وإمكانية حفظ اللاعبين في ملف
- **متعدد اللغات**: دعم الفرنسية والإنجليزية والإسبانية
- **التخصيص**: صور رمزية (تُختار الأولى بحرية، وتُفتح البقية بالقطع النقدية المكتسبة أثناء اللعب، 50 قطعة لكل منها)، وسمات لونية، وخلفيات
- **إمكانية الوصول**: تنقل كامل بلوحة المفاتيح، ودعم اللمس، وإيقاف مؤقت في Arcade، وضبط حجم النص والتباين المرتفع؛ جرى التحقق منها باستخدام axe-core من دون انتهاكات للمستويين A أو AA من WCAG في الشاشات المختبرة
- **الصوت المسجل**: تستطيع اللعبة قراءة الأسئلة والعبارات التشجيعية بصوت اصطناعي مسجل مسبقًا، مع الرجوع تلقائيًا إلى صوت الجهاز. الأصوات غير موجودة في هذا المستودع: يقدم الموقع leapmultix.jls42.org صوت Lucie بالفرنسية، وصوت Sulafat بالإنجليزية والإسبانية، كما يتيح الاختيار بين Sulafat وMarie للفرنسية، وصوت Jane للإنجليزية (راجع [الصوت المسجل](#-صوت-مسجّل))
- **متجاوب مع الأجهزة المحمولة**: واجهة محسّنة للأجهزة اللوحية والهواتف الذكية
- **نظام التقدم**: لوحة معلومات لكل ملف شخصي (الجولات والأرقام القياسية والجداول التي ينبغي مراجعتها، مفصلة حسب العملية)، وشارات، وتحديات يومية، وقطع نقدية (في السباق الزمني والمغامرة والتحدي وتحدي اليوم)

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

## 🧱 البنية

### بنية الملفات

وحدات JavaScript **موجودة مباشرة داخل `js/`**، باستثناء ثلاثة مجلدات:
`core/` و`components/` و`modes/`. لذلك، يحمل اسم الملف نفسه دلالة
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

### البنية التقنية

**وحدات ES6 حديثة**: يستخدم المشروع بنية معيارية تضم فئات ES6 وعمليات استيراد وتصدير أصلية.

**مكونات قابلة لإعادة الاستخدام**: واجهة مبنية بمكونات UI مركزية (TopBar وInfoBar وDashboard وCustomization).

**Lazy Loading**: تحميل ذكي للوحدات عند الطلب عبر `lazy-loader.js` لتحسين الأداء الأولي.

**نظام تخزين موحد**: API مركزية لحفظ بيانات المستخدم عبر LocalStorage مع حلول احتياطية.

**إدارة صوت مركزية**: التحكم في الصوت مع دعم تعدد اللغات وتفضيلات خاصة بكل مستخدم.

**Event Bus**: تواصل قائم على الأحداث وغير مترابط بين المكونات لضمان بنية سهلة الصيانة.

**التنقل عبر الشرائح**: نظام تنقل يستند إلى شرائح مرقمة (slide0 وslide1 وما إلى ذلك) باستخدام `goToSlide()`.

**الأمان**: حماية من XSS وتنقية عبر `security-utils.js` لجميع عمليات معالجة DOM.

## 🎯 أوضاع اللعب بالتفصيل

### وضع الاستكشاف

واجهة استكشاف مرئية ملائمة لكل عملية، وتوفر:

- عرضًا تفاعليًا لعمليات الضرب
- رسومًا متحركة ووسائل مساعدة على التذكر
- سحبًا وإفلاتًا تعليميًا
- تقدمًا حرًا حسب الجدول

### وضع الاختبار

أسئلة متعددة الخيارات، مع:

- 10 أسئلة في كل جلسة
- تقدم تكيفي بحسب الإجابات الصحيحة
- لوحة أرقام افتراضية
- نظام سلسلة من الإجابات الصحيحة

### وضع التحدي

سباق مع الزمن، مع:

- 3 مستويات صعوبة (مبتدئ، متوسط، صعب)
- وقت إضافي للإجابات الصحيحة
- نظام محاولات
- ترتيب لأفضل النتائج

### وضع المغامرة

تقدم قصصي، مع:

- 10 مستويات ذات موضوعات مختلفة قابلة للفتح
- خريطة تفاعلية تعرض التقدم بصريًا
- قصة غامرة بشخصيات
- نظام للنجوم والمكافآت

### وضع السباق الزمني

عشر إجابات صحيحة بأسرع ما يمكن، في سباق مع مؤقت لا يتوقف:

- العمليات الأربع: جداول الضرب (المضبوطة في إعدادات الجداول)، وجميع
  جداول الجمع (7 + k)، والطرح ((7 + k) − 7)، والقسمة ((7 × k) ÷ 7)
- الإجابة بالاختيار أو بلوحة الأرقام، بالنقر أو بلوحة المفاتيح
- أفضل الأوقات ومتوسط الوقت ومنحنى الجولات الأخيرة، حسب العملية
- «مسائلي التي ينبغي مراجعتها»: قائمة لكل عملية، تُراجع في الاتجاهين (6 × 7 و7 × 6،
  و15 − 7 و15 − 8)

### لوحة المعلومات

ما لعبه الطفل فعليًا، ملفًا شخصيًا تلو الآخر:

- نجوم المغامرة وجداول الضرب التي ينبغي مراجعتها (آخر 20 إجابة لكل جدول)
- الأسئلة والإجابات الصحيحة في الاختبار والتحدي والمغامرة والسباق الزمني
- الجولات والأرقام القياسية لكل وضع ولكل لعبة مصغرة، بما في ذلك الجولات المتروكة، ومفصلة حسب العملية
  بمجرد أن يتدرب الطفل على أكثر من عملية

### ألعاب Arcade المصغرة

تقدم كل لعبة مصغرة:

- ثلاثة مستويات صعوبة في العمليات الأربع
- نظام محاولات ونتيجة
- عناصر تحكم بالفأرة ولوحة المفاتيح والإصبع، موضحة في بطاقة اللعبة
- إيقافًا مؤقتًا: زر بجوار الوقت أو المفتاح P؛ وتتوقف اللعبة مؤقتًا أيضًا عندما تكون علامة التبويب
  مخفية، ولا تستأنف أبدًا من تلقاء نفسها
- MultiMemory: جولة بلا حد زمني، حسب الاختيار
- لوحة تستغل المساحة المتاحة (أطول من عرضها على هاتف في الوضع الرأسي) ووضع ملء الشاشة،
  على الحاسوب والهاتف، بما في ذلك عند تدوير الهاتف (باستثناء iPhone، إذ لا يسمح
  متصفحه بذلك)
- أفضل نتائج كل لاعب؛ ويوضح خيار «إعادة التعيين» كل ما سيمحوه

## 🔧 التطوير

### سير عمل التطوير

**لا تلتزم بالتغييرات مباشرةً على main أبدًا.** يعمل المشروع عبر فروع
الميزات.

**1. أنشئ فرعًا**، باستخدام `feat/` لميزة أو `fix/` لإصلاح:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. طوّر وتحقق.** يأتي التنسيق أولًا: ترفضه CI
حتى قبل تشغيل الاختبارات.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. التزم بالتغييرات على الفرع**، ثم ادفعه:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. افتح pull request** وانتظر التحليلات: verify وCodacy
وCodeFactor وSonarCloud. أصلح المشكلات حتى تصبح جميع النتائج خضراء قبل الدمج.

**أسلوب رسائل الالتزام**: رسائل موجزة بصيغة الأمر (مثل: "Fix arcade init errors" و"Refactor cache updater")

**بوابة الجودة**: تأكد من نجاح `npm run lint` و`npm test` و`npm run test:coverage` قبل كل التزام

### بنية المكونات

**GameMode (الفئة الأساسية)**: ترث جميع الأوضاع من فئة مشتركة ذات أساليب موحدة.

**GameModeManager**: تنسيق مركزي لتشغيل الأوضاع وإدارتها.

**مكونات UI**: توفر TopBar وInfoBar وDashboard وCustomization واجهة متسقة.

**Lazy Loading**: تُحمَّل الوحدات عند الطلب لتحسين الأداء الأولي.

**Event Bus**: تواصل غير مترابط بين المكونات عبر نظام الأحداث.

### الاختبارات

يتضمن المشروع حزمة اختبارات شاملة:

- اختبارات وحدات للوحدات الأساسية
- اختبارات تكامل للمكونات
- اختبارات لأوضاع اللعب
- تغطية آلية للشيفرة

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### إصدار الإنتاج

- **Rollup**: يجمع `js/main-es6.js` بصيغة ESM مع تقسيم الشيفرة وخرائط المصدر
- **Terser**: تصغير آلي للتحسين
- **Post-build**: نسخ `css/` و`assets/`، وأيقونات المواقع المفضلة (`favicon.ico` و`favicon.png` و`favicon.svg`)، و`sw.js`، وإعادة كتابة `dist/index.html` للإشارة إلى ملف الإدخال ذي الاسم المجزأ (مثل: `main-es6-*.js`)
- **المجلد النهائي**: `dist/` جاهز للتقديم بصورة ثابتة

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### التكامل المستمر

**GitHub Actions**: ‏`.github/workflows/ci.yml`، يُشغَّل عند كل عملية دفع إلى
`main` وعند كل طلب سحب.

**`verify`** — بوابة الجودة الإلزامية:

- ‏`npm ci` ثم `npm run verify` ‏(ESLint، اختبارات Jest، التغطية)
- ‏`npm run format:check` ‏(Prettier)

**`seo-report`** — بعد `verify`: تدقيق Lighthouse للموقع المنشور، من أجل
تتبّع مقاييس SEO بمرور الوقت.

**تحليلات خارجية** مرتبطة بطلبات السحب: Codacy وCodeFactor و
SonarCloud. تشترط بوابة SonarCloud الحصول على التقدير A في الموثوقية والأمان
وقابلية الصيانة للكود الجديد.

**النشر**: يقوم `./deploy.sh` بمزامنة الموقع مع S3 وإبطال ذاكرة التخزين المؤقت
لـCloudFront. يعيد السكربت عند الحاجة إنشاء الصور المتجاوبة غير الموجودة في git.

### ‏PWA ‏(Progressive Web App)

LeapMultix هو تطبيق PWA متكامل يدعم العمل دون اتصال بالإنترنت ويمكن تثبيته.

**Service Worker** ‏(`sw.js`):

- التثبيت: تحميل مسبق لكل ما تتطلبه اللعبة، من قائمة ينشئها
  `scripts/precache-list.mjs` من الكود (`npm run precache:update`، وتتحقق منها الاختبارات): بعد
  الزيارة الأولى، تعمل الأوضاع الستة وألعاب Arcade الأربع دون اتصال
- التنقل: Network-first؛ وعند انقطاع الاتصال، تُستخدم صفحة اللعبة المخزنة مؤقتًا (`offline.html` فقط
  لصفحة لم يسبق حفظها)
- الصور: Cache-first؛ وعند انقطاع الاتصال، يُستخدم حجم آخر من الصورة المتحركة نفسها أو خلفية أخرى للصورة الرمزية نفسها
- الترجمات: Stale-while-revalidate للتحديث في الخلفية
- ‏JS/CSS: ‏Network-first لتقديم أحدث إصدار دائمًا، مع تخزين مؤقت للعمل دون اتصال
- الأصوات والخطوط: Cache-first، مع تقديم نطاقات البايتات (مشغّل الصوت في Safari)
- إدارة تلقائية للإصدارات عبر `cache-updater.js`

**ملف Manifest** ‏(`manifest.json`):

- أيقونات SVG وPNG لجميع الأجهزة
- إمكانية التثبيت على الأجهزة المحمولة (Add to Home Screen)
- إعداد standalone لتجربة شبيهة بالتطبيقات
- دعم السمات والألوان

**اختبار وضع عدم الاتصال محليًا.** شغّل الخادم، ثم افتح
`http://localhost:8080` (أو المنفذ المعروض):

```bash
npm run serve
```

يدويًا: اترك الصفحة مفتوحة مدة تكفي لتسجيل Service Worker للعبة، ثم أوقف
الخادم (أو اقطع اتصال الجهاز بالشبكة)، وبعد ذلك حدّث الصفحة. يجب أن
تظهر اللعبة وأن يعمل كل وضع.

تلقائيًا، باستخدام Puppeteer:

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

**قواعد الكود المهمة**:

- حذف المتغيرات والمعاملات غير المستخدمة (`no-unused-vars`)
- استخدام معالجة محددة للأخطاء (من دون كتل catch فارغة)
- تجنّب `innerHTML` لصالح دوال `security-utils.js`
- إبقاء التعقيد الإدراكي للدوال أقل من 15
- استخراج الدوال المعقدة إلى دوال مساعدة أصغر

**الأمان**:

- **الحماية من XSS**: استخدام دوال `security-utils.js`:
  - ‏`appendSanitizedHTML()` بدلًا من `innerHTML`
  - ‏`createSafeElement()` لإنشاء عناصر آمنة
  - ‏`setSafeMessage()` للمحتوى النصي
- **السكربتات الخارجية**: السمة `crossorigin="anonymous"` إلزامية
- **التحقق من المدخلات**: تنقية البيانات الخارجية دائمًا
- **Content Security Policy**: ترويسات CSP لتقييد مصادر السكربتات

**إمكانية الوصول**:

- استهداف المستوى AA من WCAG 2.1، والتحقق منه باستخدام axe-core: لا انتهاكات من المستوى A أو AA ولا
  انتهاكات لأفضل الممارسات
- تنقل كامل بلوحة المفاتيح
- أدوار ARIA وأسماء قابلة للوصول
- التحقق من التباين باستخدام axe-core

**الأداء**:

- التحميل الكسول للوحدات عبر `lazy-loader.js`
- تحسينات CSS وموارد متجاوبة
- ‏Service Worker للتخزين المؤقت الذكي
- تقسيم الكود وتصغيره في بيئة الإنتاج

## 📱 التوافق

### المتصفحات المدعومة

تعتمد الواجهة على `oklch()` للألوان وعلى `:has()` للحالات
السياقية، ما يحدد الحد الأدنى التالي:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### الأجهزة

- **الحواسيب المكتبية**: تحكم بلوحة المفاتيح والفأرة
- **الأجهزة اللوحية**: واجهة محسّنة للمس
- **الهواتف الذكية**: تصميم متجاوب ومتكيّف

### إمكانية الوصول

- تنقل كامل بلوحة المفاتيح: Tab، والأسهم داخل شبكات الإجابات وبطاقات
  MultiMemory، وEnter، وEscape؛ ورابط «الانتقال إلى أوضاع اللعب» أعلى الصفحة الرئيسية
- قاعدة واحدة فقط لمغادرة لعبة: يطرح «الاستسلام» أو Escape أو أحد أزرار الشريط العلوي
  السؤال نفسه، وتستمر اللعبة إذا رفض الطفل
- قارئات الشاشة: كل إجابة مرتبطة بسؤالها، ويوجد عنوان واحد من المستوى الأول في كل شاشة، كما
  يُعلَن عن الرسائل
- يمكن تكبير الصفحة بالأصابع (خارج ألعاب Arcade)؛ مع حجم للنص، وتباين عالٍ،
  وحركات مخفّضة، وخط للقراءة مشتق من Andika ومصمم للقراء
  المبتدئين
- ‏Arcade: إيقاف مؤقت (بزر أو بالمفتاح P أو عند إخفاء علامة التبويب)؛ وإمكانية اختيار MultiMemory بلا حد زمني
- جرى التحقق باستخدام axe-core ‏(WCAG من 2.0 إلى 2.2، والمستويان A وAA، وأفضل الممارسات): لا
  انتهاكات في 40 شاشة بعرض الحاسوب و39 شاشة بعرض الهاتف (390 px)، بما
  يشمل سمة الليل والتباين العالي

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

### سكربتات إدارة i18n

**`npm run i18n:verify`** - التحقق من اتساق مفاتيح الترجمة

**`npm run i18n:unused`** - سرد مفاتيح الترجمة غير المستخدمة

**`npm run i18n:compare`** - مقارنة ملفات الترجمة مع fr.json (المرجع)

يضمن هذا السكربت (`scripts/compare-translations.cjs`) مزامنة جميع ملفات اللغات:

**الميزات:**

- اكتشاف المفاتيح المفقودة (الموجودة في fr.json والغائبة عن اللغات الأخرى)
- اكتشاف المفاتيح الإضافية (الموجودة في اللغات الأخرى وغير الموجودة في fr.json)
- تحديد القيم الفارغة (`""`، `null`، `undefined`، `[]`)
- التحقق من اتساق الأنواع (string مقابل array)
- تسطيح بُنى JSON المتداخلة باستخدام ترميز النقاط (مثال: `arcade.multiMemory.title`)
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

- واجهة المستخدم كاملة
- تعليمات الألعاب
- رسائل الخطأ والملاحظات
- الأوصاف والمساعدة السياقية
- المحتوى السردي لوضع المغامرة
- تسميات إمكانية الوصول وARIA

## 🔊 صوت مسجّل

تقرأ اللعبة الأسئلة وعبارات التشجيع والتفسيرات بصوت مرتفع. ولا تنطق سوى مجموعة محدودة من العبارات، نحو 7,400 عبارة لكل لغة: لذلك يمكن تسجيلها مرة واحدة نهائيًا، وعندئذ لا تستدعي أي لعبة خدمة توليد صوت. ومن دون المقاطع، تقرأ اللعبة بصوت الجهاز.

### في هذا المستودع: التطبيق من دون الأصوات

يستطيع الكود تشغيل مقاطع مسجّلة مسبقًا، ويتضمن سلسلة الأدوات التي تنشئها. لا توجد المقاطع فيه، وكذلك مفاتيح مزوّدي الخدمات: إذ يقرأ أي fork أو تثبيت محلي بصوت الجهاز.

- **رجوع تلقائي** إلى صوت الجهاز، عبارةً تلو الأخرى: عند غياب المقطع أو حدوث خطأ فيه، أو رفض المتصفح التشغيل، أو عدم بدء المقطع خلال 1.5 s، أو عند انقطاع الاتصال مع عدم وجود المقطع في ذاكرة التخزين المؤقت.
- **الإعدادات**: يفعّل زر الصوت في الشريط العلوي القراءة أو يوقفها؛ ويتيح مربع «صوت مسجّل» (إمكانية الوصول وعناصر التحكم) الاختيار بين الصوت المسجّل وصوت الجهاز. ولا يظهر إلا في اللغات التي نُشر لها صوت.
- **دون اتصال**: تبقى المقاطع التي سبق الاستماع إليها في ذاكرة التخزين المؤقت (Service Worker).
- **مكان بحث اللعبة عن المقاطع**: في الوسم `<meta name="leapmultix-voice-base">`، وهو فارغ في المستودع. وحده نشر بيئة الإنتاج يكتب فيه `/voice/`.

عند وجود مقاطعك الخاصة على الجهاز (المُنشأة عبر السلسلة أدناه والموضوعة إلى جانب اللعبة في `../leapmultix-voices`)، يجعلها المعامل `?voix=local` قابلة للتشغيل عبر خادم التطوير:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### على leapmultix.jls42.org: أصوات الاستضافة

يقدّم الموقع الذي يوفره المؤلف أصواتًا اصطناعية مسجّلة:

- بالفرنسية، **Lucie**، أُنشئت باستخدام ElevenLabs ‏(النموذج Eleven v3)؛
- بالإنجليزية البريطانية والإسبانية الإسبانية، **Sulafat**، أُنشئت باستخدام Google Cloud Text-to-Speech ‏(الصوت Chirp 3 HD)؛
- وبحسب اختيار اللاعب، **Sulafat** بالفرنسية، للحفاظ على الصوت نفسه في اللغات الثلاث؛
- وبحسب اختيار اللاعب أيضًا، **Marie** بالفرنسية و**Jane** بالإنجليزية، أُنشئتا باستخدام Mistral AI ‏(Voxtral TTS).

توجد المقاطع في مستودع خاص وفي bucket مخصص على S3، يقدمه CloudFront عبر `/voice/*`. تُنشأ مرة واحدة: أثناء اللعب، لا يُرسل شيء إلى هذه الخدمات. في الإعدادات، تعرض قائمة «الصوت» أصوات اللغة عندما يتوفر لها أكثر من صوت، ويذكر التنويه الخدمة التي أنشأت الصوت المسموع.

### إنشاء المقاطع

توجد سكربتات السلسلة في `scripts/voice/` وتعمل على جهاز المالك، ولا تعمل مطلقًا ضمن CI العامة. تبقى مفاتيح المزوّدين (ElevenLabs لـLucie، وGoogle Cloud Text-to-Speech لـSulafat، وMistral لـMarie وJane) في ملف `.env` خارج المستودع، ويُمرّر عبر `node --env-file`: لا يدخل أي مفتاح إلى git. يشرح skill الخاص بـClaude Code ‏[`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) الإجراء خطوة بخطوة (البوابات، والموافقات، والاستئناف)؛ وتوجد التفاصيل في [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **تقدير** العبارات المتبقية وعدد الأحرف المدفوعة (Eleven v3: نحو 0.53 رصيد لكل حرف؛ Chirp 3 HD: ‏30 $ لكل مليون حرف، مع إتاحة المليون الأول من كل شهر مجانًا؛ Voxtral TTS: ‏16 $ لكل مليون).
2. **الإنشاء**. يؤدي تشغيل الأمر نفسه مجددًا إلى استكمال ما ينقص. عند نفاد الأرصدة، يتوقف السكربت بصورة سليمة (الرمز 3) من دون ترك ملف مكتوب جزئيًا. يضع `--max-total-chars` حدًا أقصى للإنفاق التراكمي للإصدار: تُسجّل كل استجابة مدفوعة فور استلامها في سجل يظل محفوظًا حتى بعد التوقف المفاجئ. ولدى Google وMistral، اللتين لا تعرضان رصيدًا يمكن قراءته، تكون هذه الحماية الوحيدة.
3. **التحقق**: لكل عبارة مقطع خاص بها، وكل ملف MP3 صالح. ينسخ Whisper بعد ذلك كل مقطع محليًا، ويشير الفحص إلى الأرقام التي أسيء فهمها والمدد غير الطبيعية. يجمع `voice:review` بين Whisper وهذا الفحص وصفحة الاستماع في أمر واحد.
4. **الاستماع** في صفحة الاستماع (`voice:listen`) إلى المقاطع المشار إليها وإلى عينة من الصيغ المؤنثة («واحد في 7»)، التي لا يميزها Whisper. لكل مقطع مربع «إعادة الإنشاء» يضيفه إلى قائمة المقاطع المستبعدة.
5. **إعادة إنشاء** المقاطع المستبعدة (`--redo`) وتشغيل Whisper مجددًا، ثم مقارنة كل مقطع قبل التعديل وبعده في صفحة ثانية. يُمنح المقطع الذي يظل منطوقًا بصورة خاطئة بعد محاولتين أو ثلاث نصًا مفروضًا في `SAID_OVERRIDES` ‏(`scripts/voice/said-text.mjs`)، مثل كتابة العدد بالحروف.
6. **نشر** المقاطع، والتحقق من استجابتها عبر الإنترنت، ثم نشر فهرس اللغة، أولًا للمختبرين (`?voix=test`).
7. **إتاحة** الصوت للجميع، ثم تفعيله افتراضيًا. يزيل مفتاح الإيقاف الطارئ (`voice:publish -- remove`) لغةً من الفهرس، فتعود اللعبة إلى صوت الجهاز.

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

### القاعدة: تُعاد عملية تسجيل أي عبارة منطوقة معدّلة قبل النشر في بيئة الإنتاج

تأتي كل عبارة منطوقة من الترجمات (`assets/translations/{fr,en,es}.json`) وتُعد جزءًا من المتن. لذلك يؤدي تغيير عبارة منطوقة إلى فشل اختبار قفل المتن (`scripts/voice/corpus.lock.json`). بالنسبة إلى لغة يتوفر لها صوت مسجّل، تُنشأ عندئذ مقاطع العبارات المتأثرة، ويُتحقق منها ويُستمع إليها، ثم تُنشر **قبل** الدمج. وأخيرًا، يُحدَّث القفل (`npm run voice:corpus:lock`). ومن دون هذه المقاطع، تُقرأ العبارة المعدّلة بصوت الجهاز.

## 📊 تخزين البيانات

### بيانات المستخدم

- الملفات الشخصية والتفضيلات
- التقدم حسب وضع اللعب
- نتائج وإحصاءات ألعاب Arcade
- إعدادات التخصيص

### الميزات التقنية

- تخزين محلي (localStorage) مع وسائل رجوع احتياطية؛ ويُطلب من المتصفح عدم حذفه
  تلقائيًا (`navigator.storage.persist()`)
- سلة محذوفات للاعبين المحذوفين: الاحتفاظ بجميع بياناتهم لمدة 30 يومًا، مع الاستعادة من
  «من يلعب؟»
- حفظ اللاعبين في ملف JSON، واستعادتهم على هذا الجهاز أو جهاز آخر (لا يُستبدل مطلقًا
  أي لاعب موجود بالفعل)
- تنظيم بيانات اللعب حسب الملف الشخصي، بما فيها الإحصاءات الخاصة بكل عملية حسابية: على جهاز مشترك، لا تؤثر أخطاء لاعب في الأسئلة المقدمة للاعب آخر
- حفظ التقدم تلقائيًا
- ترحيل البيانات القديمة تلقائيًا

## 🐛 الإبلاغ عن مشكلة

يمكن الإبلاغ عن المشكلات عبر GitHub issues. يُرجى تضمين:

- وصف مفصل للمشكلة
- خطوات إعادة حدوثها
- المتصفح وإصداره
- لقطات شاشة إن كانت ذات صلة

## 💝 دعم المشروع

**[☕ التبرع عبر PayPal](https://paypal.me/jls)**

## 📄 الترخيص

هذا المشروع مرخّص بموجب AGPL v3. راجع الملف `LICENSE` لمزيد من التفاصيل.

---

_LeapMultix — تطبيق تعليمي حر لتعلّم العمليات الحسابية الأربع_

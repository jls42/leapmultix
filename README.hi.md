<details>
<summary>यह दस्तावेज़ अन्य भाषाओं में भी उपलब्ध है</summary>

- [अंग्रेज़ी](./README.en.md)
- [स्पेनिश](./README.es.md)
- [पुर्तगाली](./README.pt.md)
- [जर्मन](./README.de.md)
- [चीनी](./README.zh.md)
- [हिन्दी](./README.hi.md)
- [अरबी](./README.ar.md)
- [इतालवी](./README.it.md)
- [स्वीडिश](./README.sv.md)
- [पोलिश](./README.pl.md)
- [डच](./README.nl.md)
- [रोमानियाई](./README.ro.md)
- [जापानी](./README.ja.md)
- [कोरियाई](./README.ko.md)

</details>

# LeapMultix

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![लाइसेंस: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy बैज](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![गुणवत्ता गेट की स्थिति](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![विश्वसनीयता रेटिंग](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![सुरक्षा रेटिंग](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![रखरखाव-योग्यता रेटिंग](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![तकनीकी ऋण](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![बग](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![कमज़ोरियाँ](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![कोड संबंधी समस्याएँ](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![दोहराई गई पंक्तियाँ (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![कोड की पंक्तियाँ](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## विषय-सूची

- [विवरण](#विवरण)
- [अवलोकन](#-अवलोकन)
- [विशेषताएँ](#-विशेषताएँ)
- [त्वरित शुरुआत](#-त्वरित-शुरुआत)
- [आर्किटेक्चर](#-आर्किटेक्चर)
- [गेम मोड का विस्तृत विवरण](#-गेम-मोड-का-विस्तृत-विवरण)
- [विकास](#-विकास)
- [संगतता](#-संगतता)
- [स्थानीयकरण](#-स्थानीयकरण)
- [डेटा संग्रहण](#-डेटा-संग्रहण)
- [समस्या की रिपोर्ट करें](#-समस्या-की-रिपोर्ट-करें)
- [लाइसेंस](#-लाइसेंस)

## विवरण

LeapMultix एक संवादात्मक शैक्षिक वेब एप्लिकेशन है, जिसे 6 से 12 वर्ष के बच्चों को चार अंकगणितीय संक्रियाओं—गुणा (×), जोड़ (+), घटाव (−) और भाग (÷)—में निपुण बनाने के लिए बनाया गया है। यह सहज, सुलभ और बहुभाषी इंटरफ़ेस में **5 गेम मोड** और **4 आर्केड मिनी-गेम** प्रदान करता है।

**एकाधिक संक्रियाओं का समर्थन:** पाँचों मोड चारों संक्रियाओं का समर्थन करते हैं। संक्रिया का चयन होम स्क्रीन पर किया जाता है और यह पूरे अभ्यास के दौरान लागू रहता है।

**डेवलपर:** Julien LS (contact@jls42.org)

**ऑनलाइन URL:** https://leapmultix.jls42.org/

## 📸 अवलोकन

### स्क्रीन

|                                                                                                           |                                                                                                             |
| :-------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
|               ![「कौन खेल रहा है?」 स्क्रीन: प्रोफ़ाइल का चयन](docs/media/01-accueil.webp)                |                     ![मुख्य मेनू: संक्रिया और पाँच मोड का चयन](docs/media/02-menu.webp)                     |
|            **कौन खेल रहा है?** — प्रत्येक बच्चे के लिए उसके अवतार और प्रगति सहित एक प्रोफ़ाइल।            |                      **मेनू** — यहाँ संक्रिया चुनी जाती है, फिर पाँचों मोड खुलते हैं।                       |
|           ![खोज मोड: 4 की तालिका बिंदुओं के रूप में दिखाई गई है](docs/media/03-decouverte.webp)           |               ![क्विज़ मोड: गलत उत्तर लाल और सही उत्तर हरे रंग में](docs/media/04-quiz.webp)                |
| **खोज** — प्रत्येक समीकरण को बिंदुओं, छलाँगों या गिनती के रूप में, तालिका की तरकीब के साथ दिखाया जाता है। | **क्विज़** — बच्चे का चयन सही उत्तर के बगल में दिखाई देता रहता है और व्याख्या गणना को विस्तार से समझाती है। |
|                     ![चुनौती मोड: उलटी गिनती और जारी शृंखला](docs/media/05-defi.webp)                     |            ![रोमांच मोड: दस स्तरों का मानचित्र, अगले स्तर लॉक हैं](docs/media/06-aventure.webp)             |
|  **चुनौती** — समय के विरुद्ध दौड़। गलती होने पर सही उत्तर पढ़ने के लिए टाइमर कुछ समय के लिए रुक जाता है।  |                      **रोमांच** — दस स्तर, जो सितारों के बदले एक के बाद एक खुलते हैं।                       |
|                          ![आर्केड मेनू: चार मिनी-गेम](docs/media/07-arcade.webp)                          |            ![डैशबोर्ड: प्रत्येक तालिका के सितारे और आँकड़े](docs/media/08-tableau-de-bord.webp)             |
|                     **आर्केड** — कठिनाई समायोजन और अंतरिक्षयान चयन वाले चार मिनी-गेम।                     |         **डैशबोर्ड** — प्रत्येक तालिका के सितारे, दोहराने योग्य तालिकाएँ और प्रत्येक मोड के स्कोर।          |
|                 ![वैयक्तिकरण: अवतार, थीम और सुलभता](docs/media/09-personnalisation.webp)                  |                                                                                                             |
|              **वैयक्तिकरण** — अवतार, रंग थीम, पाठ का आकार, उच्च कंट्रास्ट और अभिभावकीय कोड।               |                                                                                                             |

### आर्केड मिनी-गेम

चार गेम एक ही प्रश्न पूछते हैं—जो खेल क्षेत्र के ऊपर शेष समय और जीवनों के साथ
दिखाया जाता है—लेकिन हर बार अलग क्रिया करने को कहते हैं।

|                                                                                                                           |                                                                                                    |
| :-----------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: |
|      ![MultiInvaders: संख्याएँ धारण किए राक्षस और स्क्रीन के नीचे एक अंतरिक्षयान](docs/media/10-multiinvaders.webp)       | ![MultiMiam: एक भूलभुलैया, जिसमें गोलियों पर संभावित उत्तर लिखे हैं](docs/media/11-multimiam.webp) |
| **MultiInvaders** — गलत उत्तरों पर गोली चलाएँ और सही उत्तर को छोड़ दें: उसके पीछे मुक्त किया जाने वाला एक मित्र छिपा है।  |          **MultiMiam** — राक्षसों से बचते हुए सही परिणाम पाने के लिए भूलभुलैया में घूमें।          |
| ![MultiMemory: कार्डों की ग्रिड, जिसमें पलटे गए दो कार्ड एक गणना और एक संख्या दिखाते हैं](docs/media/12-multimemory.webp) |      ![MultiSnake: घास के मैदान में एक साँप और क्रमांकित सेब](docs/media/13-multisnake.webp)       |
|                     **MultiMemory** — याद करके वह कार्ड खोजें जिस पर पलटी गई गणना का परिणाम लिखा है।                      |                  **MultiSnake** — सही संख्याएँ निगलकर बढ़ें और अन्य सभी से बचें।                   |

## ✨ विशेषताएँ

### 🎮 गेम मोड

- **खोज मोड**: प्रत्येक संक्रिया के अनुरूप दृश्यात्मक और संवादात्मक अन्वेषण
- **क्विज़ मोड**: चारों संक्रियाओं (×, +, −, ÷) के समर्थन और अनुकूली प्रगति वाले बहुविकल्पीय प्रश्न
- **चुनौती मोड**: चारों संक्रियाओं (×, +, −, ÷) और कठिनाई के विभिन्न स्तरों के साथ समय के विरुद्ध दौड़
- **रोमांच मोड**: चारों संक्रियाओं के समर्थन के साथ स्तरों के माध्यम से कथात्मक प्रगति

### 🕹️ आर्केड मिनी-गेम

- **MultiInvaders**: शैक्षिक Space Invaders — गलत उत्तरों को नष्ट करें
- **MultiMiam**: गणितीय Pac-Man — सही उत्तर एकत्र करें
- **MultiMemory**: स्मृति का खेल — संक्रियाओं को परिणामों से मिलाएँ
- **MultiSnake**: शैक्षिक Snake — सही संख्याएँ खाकर बढ़ें

### ➕ एकाधिक संक्रियाओं का समर्थन

LeapMultix **सभी मोड** में चारों अंकगणितीय संक्रियाओं का संपूर्ण अभ्यास प्रदान करता है:

| मोड    | ×   | +   | −   | ÷   |
| ------ | --- | --- | --- | --- |
| क्विज़ | ✅  | ✅  | ✅  | ✅  |
| चुनौती | ✅  | ✅  | ✅  | ✅  |
| खोज    | ✅  | ✅  | ✅  | ✅  |
| रोमांच | ✅  | ✅  | ✅  | ✅  |
| आर्केड | ✅  | ✅  | ✅  | ✅  |

### 🌍 सभी मोड में उपलब्ध विशेषताएँ

- **एकाधिक उपयोगकर्ता**: सहेजी गई प्रगति के साथ व्यक्तिगत प्रोफ़ाइल का प्रबंधन
- **बहुभाषी**: फ़्रेंच, अंग्रेज़ी और स्पेनिश का समर्थन
- **वैयक्तिकरण**: अवतार, रंग थीम और पृष्ठभूमियाँ
- **सुलभता**: कीबोर्ड नेविगेशन, स्पर्श समर्थन और WCAG 2.1 AA अनुपालन
- **मोबाइल अनुकूल**: टैबलेट और स्मार्टफ़ोन के लिए अनुकूलित इंटरफ़ेस
- **प्रगति प्रणाली**: स्कोर, बैज और दैनिक चुनौतियाँ

## 🚀 त्वरित शुरुआत

### पूर्वापेक्षाएँ

- Node.js (संस्करण 16 या उससे नया)
- एक आधुनिक वेब ब्राउज़र

### स्थापना

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

### उपलब्ध स्क्रिप्ट

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

## 🏗️ आर्किटेक्चर

### फ़ाइल संरचना

JavaScript मॉड्यूल **`js/` में सपाट रूप से व्यवस्थित हैं**, केवल तीन फ़ोल्डरों को छोड़कर:
`core/`, `components/` और `modes/`। इसलिए फ़ाइल का नाम ही
समूहीकरण दर्शाता है (`arcade-*`, `multimiam-*`, `i18n*`…)।

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

### तकनीकी आर्किटेक्चर

**आधुनिक ES6 मॉड्यूल**: यह प्रोजेक्ट ES6 क्लास और मूल import/export वाली मॉड्यूलर आर्किटेक्चर का उपयोग करता है।

**पुनः उपयोग योग्य कंपोनेंट**: इंटरफ़ेस केंद्रीकृत UI कंपोनेंट (TopBar, InfoBar, Dashboard, Customization) से बनाया गया है।

**Lazy Loading**: आरंभिक प्रदर्शन को अनुकूलित करने के लिए `lazy-loader.js` के माध्यम से आवश्यकता पड़ने पर मॉड्यूल को समझदारी से लोड किया जाता है।

**एकीकृत संग्रहण प्रणाली**: LocalStorage और fallback के माध्यम से उपयोगकर्ता डेटा को स्थायी रखने के लिए केंद्रीकृत API।

**केंद्रीकृत ऑडियो प्रबंधन**: बहुभाषी समर्थन और प्रत्येक उपयोगकर्ता की प्राथमिकताओं के साथ ध्वनि नियंत्रण।

**Event Bus**: रखरखाव-योग्य आर्किटेक्चर के लिए कंपोनेंट के बीच असंबद्ध इवेंट-आधारित संचार।

**स्लाइड-आधारित नेविगेशन**: `goToSlide()` के साथ क्रमांकित स्लाइड (slide0, slide1 आदि) पर आधारित नेविगेशन प्रणाली।

**सुरक्षा**: सभी DOM परिचालनों के लिए `security-utils.js` के माध्यम से XSS सुरक्षा और सैनिटाइज़ेशन।

## 🎯 गेम मोड का विस्तृत विवरण

### खोज मोड

गुणा तालिकाओं का दृश्यात्मक अन्वेषण इंटरफ़ेस, जिसमें शामिल हैं:

- गुणाओं का संवादात्मक प्रदर्शन
- ऐनिमेशन और स्मृति-सहायक संकेत
- शैक्षिक ड्रैग-एंड-ड्रॉप
- प्रत्येक तालिका में स्वतंत्र प्रगति

### क्विज़ मोड

बहुविकल्पीय प्रश्न, जिनमें शामिल हैं:

- प्रत्येक सत्र में 10 प्रश्न
- सफलताओं के अनुसार अनुकूली प्रगति
- वर्चुअल संख्यात्मक कीपैड
- लगातार सही उत्तरों की शृंखला प्रणाली

### चुनौती मोड

समय के विरुद्ध दौड़, जिसमें शामिल हैं:

- कठिनाई के 3 स्तर (शुरुआती, मध्यम, कठिन)
- सही उत्तरों के लिए अतिरिक्त समय
- जीवन प्रणाली
- सर्वोच्च स्कोर की रैंकिंग

### रोमांच मोड

कथात्मक प्रगति, जिसमें शामिल हैं:

- अनलॉक किए जा सकने वाले 10 विषयगत स्तर
- प्रगति के दृश्य प्रदर्शन वाला संवादात्मक मानचित्र
- पात्रों वाली रोचक कहानी
- सितारों और पुरस्कारों की प्रणाली

### आर्केड मिनी-गेम

प्रत्येक मिनी-गेम में शामिल हैं:

- कठिनाई का चयन और वैयक्तिकरण
- जीवन और स्कोर प्रणाली
- कीबोर्ड और स्पर्श नियंत्रण
- प्रत्येक उपयोगकर्ता के लिए व्यक्तिगत रैंकिंग

## 🛠️ विकास

### विकास कार्यप्रवाह

**कभी भी सीधे main पर commit न करें।** प्रोजेक्ट में सुविधाओं के लिए अलग-अलग
branch पर काम किया जाता है।

**1. एक branch बनाएँ**, सुविधा के लिए `feat/` और सुधार के लिए `fix/`:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. विकास और सत्यापन करें।** फ़ॉर्मैटिंग सबसे पहले होती है: परीक्षण शुरू होने
से पहले ही CI इसके उल्लंघन को अस्वीकार कर देता है।

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. branch पर commit करें**, फिर उसे push करें:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. एक pull request खोलें** और विश्लेषण की प्रतीक्षा करें: verify, Codacy,
CodeFactor और SonarCloud। merge करने से पहले सभी जाँचों के सफल होने तक सुधार करें।

**Commit शैली**: संक्षिप्त, आज्ञार्थक संदेश (उदाहरण: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: प्रत्येक commit से पहले सुनिश्चित करें कि `npm run lint`, `npm test` और `npm run test:coverage` सफल हों

### कंपोनेंट आर्किटेक्चर

**GameMode (आधार क्लास)**: सभी मोड मानकीकृत विधियों वाली एक सामान्य क्लास से विरासत प्राप्त करते हैं।

**GameModeManager**: मोड शुरू करने और प्रबंधित करने का केंद्रीकृत संचालन।

**UI कंपोनेंट**: TopBar, InfoBar, Dashboard और Customization एक सुसंगत इंटरफ़ेस प्रदान करते हैं।

**Lazy Loading**: आरंभिक प्रदर्शन को अनुकूलित करने के लिए मॉड्यूल आवश्यकता पड़ने पर लोड किए जाते हैं।

**Event Bus**: इवेंट प्रणाली के माध्यम से कंपोनेंट के बीच असंबद्ध संचार।

### परीक्षण

प्रोजेक्ट में एक संपूर्ण परीक्षण सुइट शामिल है:

- core मॉड्यूल के यूनिट परीक्षण
- कंपोनेंट के एकीकरण परीक्षण
- गेम मोड के परीक्षण
- स्वचालित कोड कवरेज

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### उत्पादन बिल्ड

- **Rollup**: code-splitting और sourcemap के साथ `js/main-es6.js` को ESM में bundle करता है
- **Terser**: अनुकूलन के लिए स्वचालित minification
- **Post-build**: `css/` और `assets/`, favicon (`favicon.ico`, `favicon.png`, `favicon.svg`) तथा `sw.js` की प्रतिलिपि बनाता है और `dist/index.html` को hash की गई प्रवेश फ़ाइल की ओर पुनर्लिखता है (उदाहरण: `main-es6-*.js`)
- **अंतिम फ़ोल्डर**: `dist/` स्थिर रूप से उपलब्ध कराने के लिए तैयार है

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### सतत एकीकरण

**GitHub Actions**: `.github/workflows/ci.yml`, जो `main` पर प्रत्येक push
और प्रत्येक pull request पर शुरू होता है।

**`verify`** — अनिवार्य गुणवत्ता गेट:

- `npm ci`, फिर `npm run verify` (ESLint, Jest परीक्षण, कवरेज)
- `npm run format:check` (Prettier)

**`seo-report`** — `verify` के बाद: समय के साथ SEO मेट्रिक पर नज़र रखने के लिए
ऑनलाइन साइट का Lighthouse ऑडिट।

**Pull request से जुड़े बाहरी विश्लेषण**: Codacy, CodeFactor और
SonarCloud। SonarCloud गेट नए कोड के लिए विश्वसनीयता, सुरक्षा और
रखरखाव-योग्यता में A रेटिंग की माँग करता है।

**परिनियोजन**: `./deploy.sh` साइट को S3 के साथ सिंक्रनाइज़ करता है और
CloudFront cache को अमान्य करता है। आवश्यकता पड़ने पर स्क्रिप्ट git में अनुपस्थित responsive image दोबारा बनाती है।

### PWA (Progressive Web App)

LeapMultix एक संपूर्ण PWA है, जिसमें ऑफ़लाइन समर्थन और स्थापना की सुविधा है।

**Service Worker** (`sw.js`):

- नेविगेशन: `offline.html` पर ऑफ़लाइन fallback के साथ Network-first
- चित्र: प्रदर्शन अनुकूलित करने के लिए Cache-first
- अनुवाद: पृष्ठभूमि में अद्यतन के लिए Stale-while-revalidate
- JS/CSS: हमेशा नवीनतम संस्करण उपलब्ध कराने के लिए Network-first
- `cache-updater.js` के माध्यम से स्वचालित संस्करण प्रबंधन

**Manifest** (`manifest.json`):

- सभी उपकरणों के लिए SVG और PNG आइकन
- मोबाइल पर स्थापना संभव (Add to Home Screen)
- ऐप जैसा अनुभव देने के लिए standalone कॉन्फ़िगरेशन
- थीम और रंगों का समर्थन

**ऑफ़लाइन मोड का स्थानीय रूप से परीक्षण करें।** सर्वर शुरू करें, फिर
`http://localhost:8080` (या दिखाया गया port) खोलें:

```bash
npm run serve
```

स्वयं परीक्षण करने के लिए: डेवलपर टूल के नेटवर्क टैब में नेटवर्क बंद करें
(ऑफ़लाइन मोड), फिर पृष्ठ रीफ़्रेश करें। `offline.html` दिखाई देना चाहिए।

Puppeteer के साथ स्वचालित रूप से:

```bash
npm run test:pwa-offline
```

**Service Worker प्रबंधन स्क्रिप्ट**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### गुणवत्ता मानक

**कोड गुणवत्ता उपकरण**:

- **ESLint**: flat config (`eslint.config.js`) और ES2022 समर्थन वाला आधुनिक कॉन्फ़िगरेशन
- **Prettier**: स्वचालित कोड फ़ॉर्मैटिंग (`.prettierrc`)
- **Stylelint**: CSS सत्यापन (`.stylelintrc.json`)
- **JSDoc**: कवरेज विश्लेषण के साथ फ़ंक्शन का स्वचालित दस्तावेज़ीकरण

**महत्वपूर्ण कोड नियम**:

- अप्रयुक्त variable और parameter हटाएँ (`no-unused-vars`)
- विशिष्ट त्रुटि प्रबंधन का उपयोग करें (खाली catch नहीं)
- `innerHTML` से बचें और उसके स्थान पर `security-utils.js` फ़ंक्शन का उपयोग करें
- फ़ंक्शन की संज्ञानात्मक जटिलता < 15 रखें
- जटिल फ़ंक्शन को छोटे helper में विभाजित करें

**सुरक्षा**:

- **XSS सुरक्षा**: `security-utils.js` के फ़ंक्शन का उपयोग करें:
  - `innerHTML` के स्थान पर `appendSanitizedHTML()`
  - सुरक्षित element बनाने के लिए `createSafeElement()`
  - पाठ्य सामग्री के लिए `setSafeMessage()`
- **बाहरी स्क्रिप्ट**: `crossorigin="anonymous"` attribute अनिवार्य है
- **इनपुट सत्यापन**: बाहरी डेटा को हमेशा sanitize करें
- **Content Security Policy**: script source सीमित करने के लिए CSP header

**सुलभता**:

- WCAG 2.1 AA अनुपालन
- पूर्ण कीबोर्ड नेविगेशन
- उपयुक्त ARIA role और label
- मानकों के अनुरूप रंग कंट्रास्ट

**प्रदर्शन**:

- `lazy-loader.js` के माध्यम से मॉड्यूल की Lazy loading
- CSS अनुकूलन और responsive asset
- समझदारी से cache करने के लिए Service Worker
- उत्पादन में code splitting और minification

## 📱 संगतता

### समर्थित ब्राउज़र

इंटरफ़ेस रंगों के लिए `oklch()` और संदर्भगत स्थितियों के लिए `:has()` पर निर्भर करता है, जिससे न्यूनतम आवश्यकताएँ निर्धारित होती हैं:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### उपकरण

- **Desktop**: कीबोर्ड और माउस नियंत्रण
- **Tablets**: अनुकूलित स्पर्श इंटरफ़ेस
- **Smartphones**: अनुकूली responsive design

### अभिगम्यता

- पूर्ण कीबोर्ड नेविगेशन (Tab, तीर कुंजियाँ, Escape)
- स्क्रीन रीडर के लिए ARIA भूमिकाएँ और लेबल
- मानकों के अनुरूप रंग कंट्रास्ट
- सहायक प्रौद्योगिकियों का समर्थन

## 🌍 स्थानीयकरण

पूर्ण बहुभाषी समर्थन:

- **फ़्रेंच** (डिफ़ॉल्ट भाषा)
- **अंग्रेज़ी**
- **स्पेनिश**

### अनुवाद प्रबंधन

**अनुवाद फ़ाइलें:** `assets/translations/*.json`

**प्रारूप:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n प्रबंधन स्क्रिप्ट

**`npm run i18n:verify`** - अनुवाद कुंजियों की संगति जाँचना

**`npm run i18n:unused`** - अप्रयुक्त अनुवाद कुंजियों को सूचीबद्ध करना

**`npm run i18n:compare`** - अनुवाद फ़ाइलों की fr.json (संदर्भ) से तुलना करना

यह स्क्रिप्ट (`scripts/compare-translations.cjs`) सभी भाषा फ़ाइलों का समन्वयन सुनिश्चित करती है:

**विशेषताएँ:**

- अनुपलब्ध कुंजियों का पता लगाना (fr.json में मौजूद, लेकिन अन्य भाषाओं में अनुपस्थित)
- अतिरिक्त कुंजियों का पता लगाना (अन्य भाषाओं में मौजूद, लेकिन fr.json में अनुपस्थित)
- रिक्त मानों की पहचान (`""`, `null`, `undefined`, `[]`)
- प्रकारों की संगति की जाँच (string बनाम array)
- नेस्टेड JSON संरचनाओं को डॉट नोटेशन में समतल करना (उदाहरण: `arcade.multiMemory.title`)
- विस्तृत console रिपोर्ट तैयार करना
- JSON रिपोर्ट को `docs/translations-comparison-report.json` में सहेजना

**आउटपुट का उदाहरण:**

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

**अनुवाद कवरेज:**

- संपूर्ण उपयोगकर्ता इंटरफ़ेस
- खेलों के निर्देश
- त्रुटि और feedback संदेश
- विवरण और संदर्भगत सहायता
- Adventure मोड की कथात्मक सामग्री
- अभिगम्यता और ARIA लेबल

## 📊 डेटा संग्रहण

### उपयोगकर्ता डेटा

- प्रोफ़ाइल और प्राथमिकताएँ
- प्रत्येक गेम मोड की प्रगति
- arcade खेलों के स्कोर और आँकड़े
- वैयक्तिकरण सेटिंग्स

### तकनीकी विशेषताएँ

- fallbacks सहित स्थानीय संग्रहण (localStorage)
- प्रत्येक उपयोगकर्ता के डेटा का पृथक्करण
- प्रगति की स्वचालित बचत
- पुराने डेटा का स्वचालित माइग्रेशन

## 🐛 समस्या की रिपोर्ट करें

समस्याओं की रिपोर्ट GitHub issues के माध्यम से की जा सकती है। कृपया निम्नलिखित शामिल करें:

- समस्या का विस्तृत विवरण
- उसे पुनरुत्पन्न करने के चरण
- ब्राउज़र और संस्करण
- प्रासंगिक होने पर स्क्रीनशॉट

## 💝 परियोजना का समर्थन करें

**[☕ PayPal के माध्यम से दान करें](https://paypal.me/jls)**

## 📄 लाइसेंस

यह परियोजना AGPL v3 लाइसेंस के अंतर्गत है। अधिक जानकारी के लिए `LICENSE` फ़ाइल देखें।

---

_LeapMultix — चारों अंकगणितीय संक्रियाएँ सीखने के लिए एक मुक्त शैक्षिक एप्लिकेशन_

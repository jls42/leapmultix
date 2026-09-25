<details>
<summary>यह दस्तावेज़ अन्य भाषाओं में भी उपलब्ध है</summary>

- [अंग्रेज़ी](./README.en.md)
- [स्पेनी](./README.es.md)
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
[![गुणवत्ता द्वार की स्थिति](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

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
- [रिकॉर्ड की गई आवाज़](#-रिकॉर्ड-की-गई-आवाज़)
- [डेटा संग्रहण](#-डेटा-संग्रहण)
- [समस्या की सूचना दें](#-समस्या-की-रिपोर्ट-करें)
- [लाइसेंस](#-लाइसेंस)

## विवरण

LeapMultix, 6 से 12 वर्ष के बच्चों के लिए बनाया गया एक इंटरैक्टिव शैक्षिक वेब अनुप्रयोग है, जो चार अंकगणितीय संक्रियाओं—गुणा (×), जोड़ (+), घटाव (−) और भाग (÷)—में निपुण होने में सहायता करता है। यह सहज, सुलभ और बहुभाषी इंटरफ़ेस में **5 गेम मोड** और **4 आर्केड मिनी-गेम** प्रदान करता है।

**एकाधिक संक्रियाओं का समर्थन:** सभी पाँच मोड चारों संक्रियाओं को स्वीकार करते हैं। संक्रिया का चयन होम स्क्रीन पर किया जाता है और पूरी गतिविधि के दौरान वही लागू रहता है।

**डेवलपर:** Julien LS (contact@jls42.org)

**ऑनलाइन URL:** https://leapmultix.jls42.org/

## 📸 अवलोकन

### स्क्रीन

|                                                                                                           |                                                                                                              |
| :-------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
|                  ![“कौन खेल रहा है?” स्क्रीन: प्रोफ़ाइल चयन](docs/media/01-accueil.webp)                  |                     ![मुख्य मेनू: संक्रिया और पाँच मोड का चयन](docs/media/02-menu.webp)                      |
|           **कौन खेल रहा है?** — प्रत्येक बच्चे के लिए उसके अवतार और प्रगति सहित अलग प्रोफ़ाइल।            |                    **मेनू** — यहाँ संक्रिया चुनी जाती है, फिर पाँचों मोड उपलब्ध होते हैं।                    |
|          ![खोज मोड: 4 का पहाड़ा बिंदुओं के रूप में दिखाया गया है](docs/media/03-decouverte.webp)          |                ![क्विज़ मोड: गलत उत्तर लाल और सही उत्तर हरे रंग में](docs/media/04-quiz.webp)                |
| **खोज** — प्रत्येक समानता को बिंदुओं, छलाँगों या गिनती के रूप में, पहाड़े की तरकीब के साथ दिखाया जाता है। | **क्विज़** — बच्चे का चयन सही उत्तर के पास दिखाई देता रहता है और व्याख्या में गणना विस्तार से समझाई जाती है। |
|                     ![चुनौती मोड: उलटी गिनती और जारी शृंखला](docs/media/05-defi.webp)                     |             ![रोमांच मोड: दस स्तरों का मानचित्र, अगले स्तर लॉक हैं](docs/media/06-aventure.webp)             |
|  **चुनौती** — समय के विरुद्ध दौड़। गलती होने पर सही उत्तर पढ़ने के लिए टाइमर कुछ समय के लिए रुक जाता है।  |                       **रोमांच** — दस स्तर जो सितारों के बदले एक के बाद एक खुलते हैं।                        |
|                          ![आर्केड मेनू: चार मिनी-गेम](docs/media/07-arcade.webp)                          |             ![डैशबोर्ड: प्रत्येक पहाड़े के सितारे और आँकड़े](docs/media/08-tableau-de-bord.webp)             |
|                         **आर्केड** — कठिनाई समायोजन और यान चयन सहित चार मिनी-गेम।                         |           **डैशबोर्ड** — प्रत्येक पहाड़े के सितारे, दोहराने योग्य पहाड़े और प्रत्येक मोड के स्कोर।           |
|                 ![वैयक्तिकरण: अवतार, थीम और सुलभता](docs/media/09-personnalisation.webp)                  |                                                                                                              |
|              **वैयक्तिकरण** — अवतार, रंग थीम, पाठ का आकार, उच्च कंट्रास्ट और अभिभावकीय कोड।               |                                                                                                              |

### आर्केड मिनी-गेम

चार गेम एक ही प्रश्न पूछते हैं—जो शेष समय और जीवन के साथ खेल क्षेत्र के ऊपर
दिखाया जाता है—लेकिन हर बार अलग क्रिया करने की आवश्यकता होती है।

|                                                                                                                          |                                                                                                   |
| :----------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
|          ![MultiInvaders: संख्याएँ धारण किए राक्षस और स्क्रीन के नीचे एक यान](docs/media/10-multiinvaders.webp)          | ![MultiMiam: एक भूलभुलैया जिसमें गोलियों पर संभावित उत्तर लिखे हैं](docs/media/11-multimiam.webp) |
| **MultiInvaders** — गलत उत्तरों पर गोली चलाएँ और सही उत्तर को छोड़ दें: उसके पीछे मुक्त किया जाने वाला एक मित्र छिपा है। |       **MultiMiam** — राक्षसों से बचते हुए सही परिणाम पाने के लिए भूलभुलैया में आगे बढ़ें।        |
|      ![MultiMemory: कार्डों का ग्रिड, दो पलटे हुए कार्डों पर एक गणना और एक संख्या](docs/media/12-multimemory.webp)       |      ![MultiSnake: घास के मैदान में एक साँप और क्रमांकित सेब](docs/media/13-multisnake.webp)      |
|                     **MultiMemory** — याद करके पता लगाएँ कि किस कार्ड पर पलटी हुई गणना का परिणाम है।                     |                **MultiSnake** — सही संख्याएँ निगलकर बड़े बनें और अन्य सभी से बचें।                |

## ✨ विशेषताएँ

### 🎮 गेम मोड

- **खोज मोड**: प्रत्येक संक्रिया के अनुकूल दृश्यात्मक और इंटरैक्टिव अन्वेषण
- **क्विज़ मोड**: चारों संक्रियाओं (×, +, −, ÷) के समर्थन और अनुकूली प्रगति सहित बहुविकल्पीय प्रश्न
- **चुनौती मोड**: चारों संक्रियाओं (×, +, −, ÷) और कठिनाई के विभिन्न स्तरों के साथ समय के विरुद्ध दौड़
- **रोमांच मोड**: चारों संक्रियाओं के समर्थन सहित स्तर-आधारित कथात्मक प्रगति

### 🕹️ आर्केड मिनी-गेम

- **MultiInvaders**: शैक्षिक Space Invaders — गलत उत्तरों को नष्ट करें
- **MultiMiam**: गणितीय Pac-Man — सही उत्तर एकत्र करें
- **MultiMemory**: स्मृति का खेल — संक्रियाओं को परिणामों से मिलाएँ
- **MultiSnake**: शैक्षिक Snake — सही संख्याएँ खाकर बड़े बनें

### ➕ एकाधिक संक्रियाओं का समर्थन

LeapMultix **सभी मोड में** चारों अंकगणितीय संक्रियाओं का संपूर्ण अभ्यास प्रदान करता है:

| मोड    | ×   | +   | −   | ÷   |
| ------ | --- | --- | --- | --- |
| क्विज़ | ✅  | ✅  | ✅  | ✅  |
| चुनौती | ✅  | ✅  | ✅  | ✅  |
| खोज    | ✅  | ✅  | ✅  | ✅  |
| रोमांच | ✅  | ✅  | ✅  | ✅  |
| आर्केड | ✅  | ✅  | ✅  | ✅  |

### 🌍 सभी मोड में उपलब्ध विशेषताएँ

- **एकाधिक उपयोगकर्ता**: सहेजी गई प्रगति के साथ व्यक्तिगत प्रोफ़ाइल प्रबंधन
- **बहुभाषी**: फ़्रेंच, अंग्रेज़ी और स्पेनी भाषाओं का समर्थन
- **वैयक्तिकरण**: अवतार, रंग थीम और पृष्ठभूमियाँ
- **सुलभता**: कीबोर्ड नेविगेशन, टच समर्थन और WCAG 2.1 AA अनुपालन
- **रिकॉर्ड की गई आवाज़**: पहले से रिकॉर्ड की गई संश्लेषित आवाज़ (ElevenLabs से निर्मित) द्वारा पढ़े जाने वाले प्रश्न और प्रोत्साहन, तथा उपलब्ध न होने पर डिवाइस की आवाज़ का स्वतः उपयोग; क्लिप सार्वजनिक रिपॉज़िटरी में नहीं हैं (देखें [रिकॉर्ड की गई आवाज़](#-रिकॉर्ड-की-गई-आवाज़))
- **मोबाइल के अनुकूल**: टैबलेट और स्मार्टफ़ोन के लिए अनुकूलित इंटरफ़ेस
- **प्रगति प्रणाली**: स्कोर, बैज और दैनिक चुनौतियाँ

## 🚀 त्वरित शुरुआत

### पूर्वापेक्षाएँ

- Node.js (संस्करण 16 या उससे नया)
- एक आधुनिक वेब ब्राउज़र

### इंस्टॉलेशन

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

# Voix enregistrée (poste du propriétaire, clips hors dépôt)
npm run voice:corpus       # Résumé des phrases dites, par langue
npm run voice:corpus:lock  # Mettre à jour le verrou du corpus
npm run voice:generate     # Générer les clips (ElevenLabs)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 आर्किटेक्चर

### फ़ाइल संरचना

JavaScript मॉड्यूल **`js/` में सपाट रूप से व्यवस्थित हैं**, केवल तीन फ़ोल्डर इसके अपवाद हैं:
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

### तकनीकी आर्किटेक्चर

**आधुनिक ES6 मॉड्यूल**: परियोजना ES6 क्लास और मूल imports/exports सहित मॉड्यूलर आर्किटेक्चर का उपयोग करती है।

**पुनः उपयोग योग्य कॉम्पोनेंट**: इंटरफ़ेस केंद्रीकृत UI कॉम्पोनेंट (TopBar, InfoBar, Dashboard, Customization) से बनाया गया है।

**Lazy Loading**: आरंभिक प्रदर्शन को अनुकूलित करने के लिए `lazy-loader.js` के माध्यम से आवश्यकतानुसार मॉड्यूल को समझदारी से लोड किया जाता है।

**एकीकृत संग्रहण प्रणाली**: LocalStorage और fallback के माध्यम से उपयोगकर्ता डेटा बनाए रखने के लिए केंद्रीकृत API।

**केंद्रीकृत ऑडियो प्रबंधन**: बहुभाषी समर्थन और प्रत्येक उपयोगकर्ता की प्राथमिकताओं सहित ध्वनि नियंत्रण।

**Event Bus**: रखरखाव योग्य आर्किटेक्चर के लिए कॉम्पोनेंट के बीच असंबद्ध इवेंट-आधारित संचार।

**स्लाइड-आधारित नेविगेशन**: `goToSlide()` सहित क्रमांकित स्लाइड (slide0, slide1 आदि) पर आधारित नेविगेशन प्रणाली।

**सुरक्षा**: सभी DOM हेरफेर के लिए `security-utils.js` के माध्यम से XSS सुरक्षा और सैनिटाइज़ेशन।

## 🎯 गेम मोड का विस्तृत विवरण

### खोज मोड

पहाड़ों के दृश्यात्मक अन्वेषण का इंटरफ़ेस, जिसमें शामिल हैं:

- गुणा का इंटरैक्टिव दृश्यांकन
- एनिमेशन और स्मृति-सहायक संकेत
- शैक्षिक ड्रैग-एंड-ड्रॉप
- प्रत्येक पहाड़े में स्वतंत्र प्रगति

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
- सर्वश्रेष्ठ स्कोर की रैंकिंग

### रोमांच मोड

कथात्मक प्रगति, जिसमें शामिल हैं:

- अनलॉक किए जा सकने वाले 10 विषयगत स्तर
- दृश्यात्मक प्रगति सहित इंटरैक्टिव मानचित्र
- पात्रों सहित मनमोहक कहानी
- सितारा और पुरस्कार प्रणाली

### आर्केड मिनी-गेम

प्रत्येक मिनी-गेम में उपलब्ध हैं:

- कठिनाई चयन और वैयक्तिकरण
- जीवन और स्कोर प्रणाली
- कीबोर्ड और टच नियंत्रण
- प्रत्येक उपयोगकर्ता की व्यक्तिगत रैंकिंग

## 🔧 विकास

### विकास कार्यप्रवाह

**कभी भी सीधे main पर commit न करें।** परियोजना में सुविधाओं के लिए अलग-अलग
branch पर काम किया जाता है।

**1. एक branch बनाएँ**, किसी सुविधा के लिए `feat/` और किसी सुधार के लिए `fix/`:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. विकसित करें और जाँचें।** फ़ॉर्मेटिंग सबसे पहले होती है: CI परीक्षण शुरू करने से
पहले ही इसे अस्वीकार कर देता है।

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
CodeFactor और SonarCloud। merge करने से पहले सभी जाँचें सफल होने तक सुधार करें।

**Commit शैली**: संक्षिप्त संदेश और आदेशात्मक शैली (उदाहरण: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: प्रत्येक commit से पहले सुनिश्चित करें कि `npm run lint`, `npm test` और `npm run test:coverage` सफल हों

### कॉम्पोनेंट आर्किटेक्चर

**GameMode (आधार क्लास)**: सभी मोड मानकीकृत विधियों वाली एक साझा क्लास से इनहेरिट होते हैं।

**GameModeManager**: मोड शुरू करने और प्रबंधित करने का केंद्रीकृत संचालन।

**UI कॉम्पोनेंट**: TopBar, InfoBar, Dashboard और Customization एक सुसंगत इंटरफ़ेस प्रदान करते हैं।

**Lazy Loading**: आरंभिक प्रदर्शन को अनुकूलित करने के लिए मॉड्यूल आवश्यकतानुसार लोड किए जाते हैं।

**Event Bus**: इवेंट प्रणाली के माध्यम से कॉम्पोनेंट के बीच असंबद्ध संचार।

### परीक्षण

परियोजना में एक संपूर्ण परीक्षण सुइट शामिल है:

- core मॉड्यूल के unit test
- कॉम्पोनेंट के integration test
- गेम मोड के परीक्षण
- स्वचालित code coverage

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### प्रोडक्शन बिल्ड

- **Rollup**: code-splitting और sourcemap सहित `js/main-es6.js` को ESM में bundle करता है
- **Terser**: अनुकूलन के लिए स्वचालित minification
- **Post-build**: `css/` और `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`) तथा `sw.js` की प्रतिलिपि बनाता है, और `dist/index.html` को hashed entry फ़ाइल की ओर पुनर्लिखता है (उदाहरण: `main-es6-*.js`)
- **अंतिम फ़ोल्डर**: `dist/` स्थिर रूप से serve किए जाने के लिए तैयार है

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### सतत एकीकरण

**GitHub Actions**: `.github/workflows/ci.yml`, जो `main` पर प्रत्येक push और
प्रत्येक pull request पर सक्रिय होता है।

**`verify`** — अनिवार्य गुणवत्ता द्वार:

- `npm ci` और फिर `npm run verify` (ESLint, Jest परीक्षण, coverage)
- `npm run format:check` (Prettier)

**`seo-report`** — `verify` के बाद: समय के साथ SEO metrics पर नज़र रखने के लिए
ऑनलाइन साइट का Lighthouse audit।

**Pull request से जुड़े बाहरी विश्लेषण**: Codacy, CodeFactor और
SonarCloud। SonarCloud द्वार नए कोड की विश्वसनीयता, सुरक्षा और
रखरखाव-योग्यता में A रेटिंग की माँग करता है।

**Deployment**: `./deploy.sh` साइट को S3 से सिंक्रनाइज़ करता है और
CloudFront cache को अमान्य करता है। आवश्यकता होने पर स्क्रिप्ट उन responsive images को पुनः बनाती है जो git में उपलब्ध नहीं हैं।

### PWA (Progressive Web App)

LeapMultix एक संपूर्ण PWA है, जिसमें ऑफ़लाइन समर्थन और इंस्टॉलेशन की सुविधा उपलब्ध है।

**Service Worker** (`sw.js`):

- नेविगेशन: `offline.html` के ऑफ़लाइन fallback सहित Network-first
- छवियाँ: प्रदर्शन को अनुकूलित करने के लिए Cache-first
- अनुवाद: पृष्ठभूमि में अपडेट करने के लिए Stale-while-revalidate
- JS/CSS: हमेशा नवीनतम संस्करण serve करने के लिए Network-first
- `cache-updater.js` के माध्यम से स्वचालित संस्करण प्रबंधन

**Manifest** (`manifest.json`):

- सभी डिवाइस के लिए SVG और PNG आइकन
- मोबाइल पर इंस्टॉल करने की सुविधा (Add to Home Screen)
- app-like अनुभव के लिए standalone कॉन्फ़िगरेशन
- थीम और रंगों का समर्थन

**ऑफ़लाइन मोड का स्थानीय रूप से परीक्षण करें।** सर्वर शुरू करें, फिर
`http://localhost:8080` (या प्रदर्शित port) खोलें:

```bash
npm run serve
```

मैन्युअल रूप से: development tools में नेटवर्क बंद करें (नेटवर्क टैब,
ऑफ़लाइन मोड), फिर पृष्ठ refresh करें। `offline.html` प्रदर्शित होना चाहिए।

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

**कोड गुणवत्ता उपकरण** :

- **ESLint** : flat config (`eslint.config.js`) के साथ आधुनिक कॉन्फ़िगरेशन, ES2022 का समर्थन
- **Prettier** : कोड का स्वचालित स्वरूपण (`.prettierrc`)
- **Stylelint** : CSS सत्यापन (`.stylelintrc.json`)
- **JSDoc** : कवरेज विश्लेषण के साथ फ़ंक्शन का स्वचालित दस्तावेज़ीकरण

**महत्वपूर्ण कोड नियम** :

- अप्रयुक्त वेरिएबल और पैरामीटर हटाएँ (`no-unused-vars`)
- विशिष्ट त्रुटि प्रबंधन का उपयोग करें (खाली catch नहीं)
- `security-utils.js` फ़ंक्शन के पक्ष में `innerHTML` से बचें
- फ़ंक्शन की संज्ञानात्मक जटिलता < 15 बनाए रखें
- जटिल फ़ंक्शन को छोटे helpers में विभाजित करें

**सुरक्षा** :

- **XSS सुरक्षा** : `security-utils.js` के फ़ंक्शन का उपयोग करें :
  - `innerHTML` के बजाय `appendSanitizedHTML()`
  - सुरक्षित तत्व बनाने के लिए `createSafeElement()`
  - पाठ्य सामग्री के लिए `setSafeMessage()`
- **बाहरी scripts** : `crossorigin="anonymous"` एट्रिब्यूट अनिवार्य है
- **इनपुट सत्यापन** : बाहरी डेटा को हमेशा sanitize करें
- **Content Security Policy** : scripts के स्रोतों को सीमित करने के लिए CSP headers

**अभिगम्यता** :

- WCAG 2.1 AA का अनुपालन
- पूर्ण कीबोर्ड नेविगेशन
- उपयुक्त ARIA भूमिकाएँ और labels
- मानकों के अनुरूप रंग कंट्रास्ट

**प्रदर्शन** :

- `lazy-loader.js` के माध्यम से modules की lazy loading
- CSS अनुकूलन और responsive assets
- बुद्धिमत्तापूर्ण caching के लिए Service Worker
- उत्पादन में code splitting और minification

## 📱 संगतता

### समर्थित ब्राउज़र

इंटरफ़ेस रंगों के लिए `oklch()` और संदर्भगत स्थितियों के लिए `:has()` पर निर्भर है,
जिससे न्यूनतम संस्करण ये निर्धारित होते हैं :

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### उपकरण

- **Desktop** : कीबोर्ड और माउस नियंत्रण
- **Tablets** : स्पर्श के लिए अनुकूलित इंटरफ़ेस
- **Smartphones** : अनुकूलनशील responsive design

### अभिगम्यता

- पूर्ण कीबोर्ड नेविगेशन (Tab, तीर कुंजियाँ, Esc)
- स्क्रीन रीडर के लिए ARIA भूमिकाएँ और labels
- मानकों के अनुरूप रंग कंट्रास्ट
- सहायक तकनीकों का समर्थन

## 🌍 स्थानीयकरण

पूर्ण बहुभाषी समर्थन :

- **फ़्रेंच** (डिफ़ॉल्ट भाषा)
- **अंग्रेज़ी**
- **स्पैनिश**

### अनुवाद प्रबंधन

**अनुवाद फ़ाइलें :** `assets/translations/*.json`

**प्रारूप :**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n प्रबंधन scripts

**`npm run i18n:verify`** - अनुवाद keys की संगति जाँचें

**`npm run i18n:unused`** - अप्रयुक्त अनुवाद keys सूचीबद्ध करें

**`npm run i18n:compare`** - अनुवाद फ़ाइलों की fr.json (संदर्भ) से तुलना करें

यह script (`scripts/compare-translations.cjs`) सभी भाषा फ़ाइलों का समन्वयन सुनिश्चित करती है :

**विशेषताएँ :**

- अनुपलब्ध keys की पहचान (fr.json में मौजूद लेकिन अन्य भाषाओं में अनुपस्थित)
- अतिरिक्त keys की पहचान (अन्य भाषाओं में मौजूद लेकिन fr.json में अनुपस्थित)
- खाली values की पहचान (`""`, `null`, `undefined`, `[]`)
- types की संगति की जाँच (string बनाम array)
- nested JSON संरचनाओं को dot notation में समतल करना (उदाहरण : `arcade.multiMemory.title`)
- विस्तृत console report तैयार करना
- JSON report को `docs/translations-comparison-report.json` में सहेजना

**आउटपुट का उदाहरण :**

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

**अनुवाद कवरेज :**

- संपूर्ण उपयोगकर्ता इंटरफ़ेस
- खेलों के निर्देश
- त्रुटि और प्रतिक्रिया संदेश
- विवरण और संदर्भगत सहायता
- Adventure mode की कथात्मक सामग्री
- अभिगम्यता और ARIA labels

## 🔊 रिकॉर्ड की गई आवाज़

खेल प्रश्नों, प्रोत्साहनों और व्याख्याओं को ऊँची आवाज़ में पढ़ता है। फ़्रेंच में यह **Lucie** है, जो ElevenLabs (Eleven v3 मॉडल) से बनाई गई संश्लेषित आवाज़ है। खेल केवल वाक्यांशों का एक सीमित समूह बोलता है, प्रति भाषा लगभग 7,400 : वे सभी पहले से रिकॉर्ड किए गए हैं और कोई भी भाग ElevenLabs को कॉल नहीं करता। अंग्रेज़ी और स्पैनिश में फ़िलहाल उपकरण की आवाज़ ही उपयोग की जाती है।

- **स्वचालित fallback**, हर वाक्यांश के लिए अलग-अलग : clip अनुपस्थित हो या उसमें त्रुटि हो, ब्राउज़र playback अस्वीकार कर दे, clip 1.5 सेकंड में शुरू न हो, या clip cache में न होने पर उपकरण offline हो।
- **सेटिंग्स** : शीर्ष bar का आवाज़ बटन playback को चालू या बंद करता है; “रिकॉर्ड की गई आवाज़” checkbox (अभिगम्यता और नियंत्रण) Lucie तथा उपकरण की आवाज़ के बीच चयन करता है।
- **Offline** : पहले सुने गए clips cache में बने रहते हैं (service worker)।

### Clips इस repository में नहीं हैं

Clips एक निजी repository और समर्पित S3 bucket में रखे जाते हैं, जिन्हें CloudFront द्वारा `/voice/*` पर उपलब्ध कराया जाता है। इसलिए fork या स्थानीय विकास में उपकरण की आवाज़ बनी रहती है : repository में `<meta name="leapmultix-voice-base">` tag खाली है और केवल production deployment ही उसमें `/voice/` लिखता है।

जब clips स्थानीय मशीन पर उपलब्ध हों (निजी repository को खेल के बगल में `../leapmultix-voices` में clone किया गया हो), तो `?voix=local` पैरामीटर development server से उन्हें चलाता है :

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Clips तैयार करना

यह प्रक्रिया `scripts/voice/` में scripted है और स्वामी की मशीन पर चलती है, सार्वजनिक CI में कभी नहीं। ElevenLabs key repository से बाहर `.env` फ़ाइल में रहती है और `node --env-file` के माध्यम से दी जाती है : कोई भी key git में नहीं जाती। Claude Code skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) प्रक्रिया को चरण-दर-चरण संचालित करती है (gates, approvals, पुनः प्रयास); विस्तृत जानकारी [`docs/voix-enregistree.md`](docs/voix-enregistree.md) में है।

1. **अनुमान लगाएँ** कि कितने वाक्यांश शेष हैं और कितने characters के लिए भुगतान करना होगा (Eleven v3 : प्रति character लगभग 0.53 credit)।
2. **तैयार करें**। उसी command को दोबारा चलाने पर शेष कार्य जारी रहता है। Credits समाप्त होने पर script बिना कोई आधी लिखी फ़ाइल छोड़े सुचारु रूप से रुक जाती है (code 3)।
3. **जाँचें** : प्रत्येक वाक्यांश का clip मौजूद हो और प्रत्येक MP3 वैध हो। इसके बाद Whisper हर clip को स्थानीय रूप से transcribe करता है और `voice:check` गलत सुनी गई संख्याओं तथा असामान्य अवधियों की सूचना देता है।
4. **सुनें** : listening page (`voice:listen`) पर चिह्नित clips और स्त्रीलिंग रूपों (“सात का एक गुना”) का एक नमूना सुनें, जिन्हें Whisper अलग नहीं कर पाता। प्रत्येक clip में “फिर से बनाना है” checkbox होता है, जो उसे अस्वीकृत clips की सूची में जोड़ देता है।
5. **दोबारा बनाएँ** : अस्वीकृत clips (`--redo`) को फिर से बनाएँ और Whisper दोबारा चलाएँ, फिर दूसरे page पर प्रत्येक clip के पहले और बाद के संस्करणों की तुलना करें। दो या तीन प्रयासों के बाद भी गलत बोले गए clip को `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`) में निर्धारित पाठ दिया जाता है, उदाहरण के लिए संख्या को शब्दों में लिखकर।
6. **प्रकाशित करें** : clips प्रकाशित करें, जाँचें कि वे online उपलब्ध हैं, फिर भाषा का index पहले testers के लिए प्रकाशित करें (`?voix=test`)।
7. **सभी के लिए खोलें** : आवाज़ को सभी के लिए उपलब्ध करें, फिर उसे डिफ़ॉल्ट रूप से सक्रिय करें। Kill switch (`voice:publish -- remove`) किसी भाषा को index से हटा देता है : खेल उपकरण की आवाज़ पर वापस आ जाता है।

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

### नियम : बोले जाने वाले संशोधित वाक्यांश को production में भेजने से पहले दोबारा रिकॉर्ड किया जाता है

प्रत्येक बोला जाने वाला वाक्यांश अनुवादों (`assets/translations/{fr,en,es}.json`) से आता है और corpus का हिस्सा होता है। इसलिए बोले जाने वाले वाक्यांश को बदलने पर corpus lock test (`scripts/voice/corpus.lock.json`) विफल हो जाता है। जिस भाषा में रिकॉर्ड की गई आवाज़ उपलब्ध है, उसके लिए प्रभावित वाक्यांशों के clips तैयार किए जाते हैं, उनकी जाँच की जाती है और उन्हें सुना जाता है, फिर merge करने से **पहले** प्रकाशित किया जाता है। अंत में lock को update किया जाता है (`npm run voice:corpus:lock`)। इन clips के बिना संशोधित वाक्यांश उपकरण की आवाज़ में पढ़ा जाता है।

## 📊 डेटा संग्रहण

### उपयोगकर्ता डेटा

- Profiles और प्राथमिकताएँ
- प्रत्येक game mode की प्रगति
- Arcade games के scores और आँकड़े
- वैयक्तिकरण सेटिंग्स

### तकनीकी विशेषताएँ

- Fallbacks के साथ स्थानीय संग्रहण (localStorage)
- प्रत्येक उपयोगकर्ता के डेटा का पृथक्करण
- प्रगति का स्वचालित backup
- पुराने डेटा का स्वचालित migration

## 🐛 समस्या की रिपोर्ट करें

समस्याओं की रिपोर्ट GitHub issues के माध्यम से की जा सकती है। कृपया ये शामिल करें :

- समस्या का विस्तृत विवरण
- उसे पुनः उत्पन्न करने के चरण
- ब्राउज़र और संस्करण
- प्रासंगिक होने पर screenshots

## 💝 परियोजना का समर्थन करें

**[☕ PayPal के माध्यम से दान करें](https://paypal.me/jls)**

## 📄 लाइसेंस

यह परियोजना AGPL v3 लाइसेंस के अंतर्गत है। अधिक जानकारी के लिए `LICENSE` फ़ाइल देखें।

---

_LeapMultix — चारों अंकगणितीय संक्रियाएँ सीखने के लिए मुक्त शैक्षिक अनुप्रयोग_

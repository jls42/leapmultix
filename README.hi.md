<details>
<summary>यह दस्तावेज़ अन्य भाषाओं में भी उपलब्ध है</summary>

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
![लाइसेंस: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

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

## विषय सूची

- [विवरण](#विवरण)
- [पूर्वावलोकन](#-पूर्वावलोकन)
- [सुविधाएँ](#-सुविधाएँ)
- [त्वरित शुरुआत](#-त्वरित-शुरुआत)
- [आर्किटेक्चर](#-आर्किटेक्चर)
- [खेल के विस्तृत मोड](#-खेल-के-विस्तृत-मोड)
- [विकास](#-विकास)
- [संगतता](#-संगतता)
- [स्थानीयकरण](#-स्थानीयकरण)
- [रिकॉर्ड की गई आवाज़](#-रिकॉर्ड-की-गई-आवाज़)
- [डेटा भंडारण](#-डेटा-भंडारण)
- [समस्या की रिपोर्ट करें](#-समस्या-की-रिपोर्ट-करें)
- [लाइसेंस](#-लाइसेंस)

## विवरण

LeapMultix 6 से 12 वर्ष के बच्चों के लिए 4 अंकगणितीय संक्रियाओं: गुणा (×), जोड़ (+), घटाव (−) और भाग (÷) में महारत हासिल करने के लिए एक इंटरैक्टिव शैक्षिक वेब एप्लिकेशन है। यह एक सहज, सुलभ और बहुभाषी इंटरफ़ेस में **5 गेम मोड** और **4 आर्केड मिनी-गेम** प्रदान करता है।

**मल्टी-ऑपरेशन समर्थन:** पाँचों मोड चारों संक्रियाओं को स्वीकार करते हैं। चयन होम स्क्रीन पर किया जाता है और यह पूरे सत्र के लिए मान्य होता है।

**द्वारा विकसित:** Julien LS (contact@jls42.org)

**ऑनलाइन URL:** https://leapmultix.jls42.org/

## 📸 पूर्वावलोकन

### स्क्रीन

|                                                                                                                              |                                                                                                            |
| :--------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: |
|                         ![« कौन खेल रहा है? » स्क्रीन: प्रोफ़ाइल का चयन](docs/media/01-accueil.webp)                         |                   ![मुख्य मेनू: संक्रिया और पाँचों मोड का चयन](docs/media/02-menu.webp)                    |
|                    **कौन खेल रहा है?** — प्रत्येक बच्चे के लिए एक प्रोफ़ाइल, उनके अवतार और प्रगति के साथ।                    |                      **मेनू** — संक्रिया यहाँ चुनी जाती है, फिर पाँचों मोड खुलते हैं।                      |
|                      ![डिस्कवरी मोड: 4 का पहाड़ा बिंदुओं में दिखाया गया](docs/media/03-decouverte.webp)                      |            ![क्विज़ मोड: गलत उत्तर लाल रंग में, सही उत्तर हरे रंग में](docs/media/04-quiz.webp)            |
| **डिस्कवरी** — प्रत्येक समीकरण को बिंदुओं, छलांगों या गिनती के रूप में दिखाया जाता है, साथ ही पहाड़े की ट्रिक भी दी जाती है। | **क्विज़** — बच्चे का चयन सही उत्तर के बगल में प्रदर्शित रहता है, और स्पष्टीकरण में गणना का विवरण होता है। |
|                              ![चैलेंज मोड: उलटी गिनती और जारी स्ट्रीक](docs/media/05-defi.webp)                              |             ![एडवेंचर मोड: दस स्तरों का नक्शा, अगले स्तर लॉक हैं](docs/media/06-aventure.webp)             |
|                  **चैलेंज** — समय के ख़िलाफ़ दौड़। किसी गलती पर, सही उत्तर पढ़ने के लिए टाइमर रुक जाता है।                   |                   **एडवेंचर** — दस स्तर जो सितारों के बदले एक के बाद एक अनलॉक होते हैं।                    |
|                                   ![आर्केड मेनू: चार मिनी-गेम](docs/media/07-arcade.webp)                                    |            ![डैशबोर्ड: प्रत्येक पहाड़े के सितारे और आँकड़े](docs/media/08-tableau-de-bord.webp)            |
|                           **आर्केड** — चार मिनी-गेम, कठिनाई समायोजन और अंतरिक्ष यान के चयन के साथ।                           |            **डैशबोर्ड** — प्रत्येक पहाड़े के सितारे, दोहराए जाने वाले पहाड़े, प्रति मोड स्कोर।             |
|                           ![कस्टमाइज़ेशन: अवतार, थीम, सुलभता](docs/media/09-personnalisation.webp)                           |                                                                                                            |
|                       **कस्टमाइज़ेशन** — अवतार, रंग थीम, टेक्स्ट का आकार, उच्च कंट्रास्ट, पैरेंटल कोड।                       |                                                                                                            |

### आर्केड मिनी-गेम

चार खेल जो एक ही सवाल पूछते हैं — खेल क्षेत्र के ऊपर प्रदर्शित सवाल, शेष समय और जीवन के साथ — लेकिन हर बार एक अलग क्रिया की आवश्यकता होती है।

|                                                                                                                        |                                                                                                 |
| :--------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
|       ![MultiInvaders: संख्याओं वाले राक्षस, स्क्रीन के नीचे एक अंतरिक्ष यान](docs/media/10-multiinvaders.webp)        | ![MultiMiam: एक भूलभुलैया जहाँ गोलियों पर संभावित उत्तर लिखे हैं](docs/media/11-multimiam.webp) |
|    **MultiInvaders** — गलत उत्तरों पर गोली चलाएं, सही उत्तर को बचाएं: वह आज़ाद किए जाने वाले एक मित्र को छुपाता है।    |    **MultiMiam** — राक्षसों से बचते हुए सही परिणाम प्राप्त करने के लिए भूलभुलैया में घूमें।     |
| ![MultiMemory: कार्ड्स का ग्रिड, दो पलटे हुए कार्ड जो एक गणना और एक संख्या दिखाते हैं](docs/media/12-multimemory.webp) |   ![MultiSnake: एक घास के मैदान में एक साँप और क्रमांकित सेब](docs/media/13-multisnake.webp)    |
|                **MultiMemory** — याददाश्त से पता लगाएं कि कौन सा कार्ड पलटी गई गणना का परिणाम रखता है।                 |                **MultiSnake** — सही संख्याओं को खाकर बड़े हों, बाकी सभी से बचें।                |

## ✨ सुविधाएँ

### 🎮 खेल के मोड

- **डिस्कवरी मोड**: प्रत्येक संक्रिया के लिए अनुकूलित दृश्य और इंटरैक्टिव अन्वेषण
- **क्विज़ मोड**: 4 संक्रियाओं (×, +, −, ÷) के समर्थन और अनुकूली प्रगति के साथ बहुविकल्पीय प्रश्न
- **चैलेंज मोड**: 4 संक्रियाओं (×, +, −, ÷) और विभिन्न कठिनाई स्तरों के साथ समय के ख़िलाफ़ दौड़
- **एडवेंचर मोड**: 4 संक्रियाओं के समर्थन के साथ स्तरों के माध्यम से कहानी-आधारित प्रगति

### 🕹️ आर्केड मिनी-गेम

- **MultiInvaders**: शैक्षिक Space Invaders - गलत उत्तरों को नष्ट करें
- **MultiMiam**: गणितीय Pac-Man - सही उत्तर एकत्र करें
- **MultiMemory**: मेमोरी गेम - संक्रियाओं और परिणामों का मिलान करें
- **MultiSnake**: शैक्षिक Snake - सही संख्याएँ खाकर बड़े हों

### ➕ मल्टी-ऑपरेशन समर्थन

LeapMultix **सभी मोड** में 4 अंकगणितीय संक्रियाओं का संपूर्ण अभ्यास प्रदान करता है:

| मोड      | ×   | +   | −   | ÷   |
| -------- | --- | --- | --- | --- |
| क्विज़   | ✅  | ✅  | ✅  | ✅  |
| चैलेंज   | ✅  | ✅  | ✅  | ✅  |
| डिस्कवरी | ✅  | ✅  | ✅  | ✅  |
| एडवेंचर  | ✅  | ✅  | ✅  | ✅  |
| आर्केड   | ✅  | ✅  | ✅  | ✅  |

### 🌍 सार्वभौमिक सुविधाएँ

- **मल्टी-यूज़र**: सहेजी गई प्रगति के साथ व्यक्तिगत प्रोफ़ाइलों का प्रबंधन
- **बहुभाषी**: फ्रेंच, अंग्रेज़ी और स्पेनिश का समर्थन
- **कस्टमाइज़ेशन**: अवतार, रंग थीम, पृष्ठभूमि
- **सुलभता**: कीबोर्ड नेविगेशन, टच समर्थन, WCAG 2.1 AA अनुपालन
- **रिकॉर्ड की गई आवाज़**: खेल डिवाइस की आवाज़ पर स्वचालित फ़ॉलबैक के साथ, पहले से रिकॉर्ड की गई सिंथेटिक आवाज़ के साथ प्रश्नों और प्रोत्साहन को पढ़ सकता है। आवाज़ें इस रिपॉजिटरी में नहीं हैं: leapmultix.jls42.org साइट फ्रेंच में Lucie, अंग्रेज़ी और स्पेनिश में Sulafat, तथा विकल्प के रूप में फ्रेंच में Marie और अंग्रेज़ी में Jane प्रदान करती है (देखें [रिकॉर्ड की गई आवाज़](#-रिकॉर्ड-की-गई-आवाज़))
- **मोबाइल रिस्पॉन्सिव**: टैबलेट और स्मार्टफोन के लिए अनुकूलित इंटरफ़ेस
- **प्रगति प्रणाली**: स्कोर, बैज, दैनिक चुनौतियाँ

## 🚀 त्वरित शुरुआत

### पूर्वापेक्षाएँ

- Node.js (संस्करण 16 या उच्चतर)
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
npm run voice:generate     # Générer les clips (ElevenLabs, Google ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 आर्किटेक्चर

### फ़ाइल संरचना

जावास्क्रिप्ट मॉड्यूल **`js/` में सीधे** रखे गए हैं, केवल तीन फ़ोल्डरों को छोड़कर: `core/`, `components/` और `modes/`। इसलिए फ़ाइल का नाम ही समूहीकरण तय करता है (`arcade-*`, `multimiam-*`, `i18n*`…)।

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

**आधुनिक ES6 मॉड्यूल**: यह प्रोजेक्ट ES6 क्लास और नेटिव imports/exports के साथ एक मॉड्यूलर आर्किटेक्चर का उपयोग करता है।

**पुन: प्रयोज्य घटक**: केंद्रीकृत UI घटकों (TopBar, InfoBar, Dashboard, Customization) के साथ निर्मित इंटरफ़ेस।

**Lazy Loading**: प्रारंभिक प्रदर्शन को अनुकूलित करने के लिए `lazy-loader.js` के माध्यम से मांग पर मॉड्यूल का स्मार्ट लोडिंग।

**एकीकृत भंडारण प्रणाली**: फ़ॉलबैक के साथ LocalStorage के माध्यम से उपयोगकर्ता डेटा स्थायित्व के लिए केंद्रीकृत API।

**केंद्रीकृत ऑडियो प्रबंधन**: बहुभाषी समर्थन और प्रति-उपयोगकर्ता प्राथमिकताओं के साथ ध्वनि नियंत्रण।

**Event Bus**: रखरखाव योग्य आर्किटेक्चर के लिए घटकों के बीच डिकपल्ड इवेंट-आधारित संचार।

**स्लाइड्स द्वारा नेविगेशन**: `goToSlide()` के साथ क्रमांकित स्लाइड्स (slide0, slide1, आदि) पर आधारित नेविगेशन प्रणाली।

**सुरक्षा**: सभी DOM जोड़-तोड़ के लिए `security-utils.js` के माध्यम से XSS सुरक्षा और सैनिटाइजेशन।

## 🎯 खेल के विस्तृत मोड

### डिस्कवरी मोड

इसके साथ पहाड़ों का दृश्य अन्वेषण इंटरफ़ेस:

- गुणा का इंटरैक्टिव विज़ुअलाइज़ेशन
- एनिमेशन और मेमोरी टिप्स
- शैक्षिक ड्रैग-एंड-ड्रॉप
- प्रति पहाड़ा स्वतंत्र प्रगति

### क्विज़ मोड

इसके साथ बहुविकल्पीय प्रश्न:

- प्रति सत्र 10 प्रश्न
- सफलता के अनुसार अनुकूली प्रगति
- वर्चुअल न्यूमेरिक कीपैड
- स्ट्रीक सिस्टम (लगातार सही उत्तरों की श्रृंखला)

### चैलेंज मोड

समय के ख़िलाफ़ दौड़ जिसमें शामिल हैं:

- 3 कठिनाई स्तर (शुरुआती, मध्यम, कठिन)
- सही उत्तरों के लिए समय बोनस
- जीवन प्रणाली
- सर्वश्रेष्ठ स्कोर की रैंकिंग

### एडवेंचर मोड

कहानी-आधारित प्रगति जिसमें शामिल हैं:

- 10 अनलॉक करने योग्य थीम वाले स्तर
- दृश्य प्रगति के साथ इंटरैक्टिव नक्शा
- पात्रों के साथ इमर्सिव कहानी
- सितारे और पुरस्कार प्रणाली

### आर्केड मिनी-गेम

प्रत्येक मिनी-गेम प्रदान करता है:

- कठिनाई का चयन और कस्टमाइज़ेशन
- जीवन प्रणाली और स्कोर
- कीबोर्ड और टच नियंत्रण
- प्रति उपयोगकर्ता व्यक्तिगत रैंकिंग

## 🔧 विकास

### विकास कार्यप्रवाह

**कभी भी सीधे main पर कमिट न करें।** यह प्रोजेक्ट फ़ीचर शाखाओं पर काम करता है।

**1. एक शाखा बनाएं**, किसी नई सुविधा के लिए `feat/`, बग फिक्स के लिए `fix/`:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. विकास करें और जाँचें।** फ़ॉर्मेटिंग सबसे पहले आती है: CI परीक्षण शुरू करने से पहले ही इसे अस्वीकार कर देता है।

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. शाखा पर कमिट करें**, फिर उसे पुश करें:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. एक पुल रिक्वेस्ट खोलें** और विश्लेषणों की प्रतीक्षा करें: verify, Codacy, CodeFactor और SonarCloud। मर्ज करने से पहले तब तक सुधार करें जब तक सब हरा न हो जाए।

**कमिट शैली**: संक्षिप्त संदेश, आज्ञासूचक मोड (उदा: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: सुनिश्चित करें कि प्रत्येक कमिट से पहले `npm run lint`, `npm test` और `npm run test:coverage` पास हों

### घटकों का आर्किटेक्चर

**GameMode (बेस क्लास)**: सभी मोड मानकीकृत विधियों वाली एक सामान्य क्लास से इनहेरिट करते हैं।

**GameModeManager**: मोड के लॉन्च और प्रबंधन का केंद्रीकृत संयोजन।

**UI घटक**: TopBar, InfoBar, Dashboard और Customization एक सुसंगत इंटरफ़ेस प्रदान करते हैं।

**Lazy Loading**: प्रारंभिक प्रदर्शन को अनुकूलित करने के लिए मॉड्यूल मांग पर लोड किए जाते हैं।

**Event Bus**: इवेंट सिस्टम के माध्यम से घटकों के बीच डिकपल्ड संचार।

### परीक्षण

प्रोजेक्ट में एक संपूर्ण परीक्षण सुइट शामिल है:

- कोर मॉड्यूल के यूनिट परीक्षण
- घटकों के एकीकरण परीक्षण
- गेम मोड के परीक्षण
- स्वचालित कोड कवरेज

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### प्रोडक्शन बिल्ड

- **Rollup**: कोड-स्प्लिटिंग और sourcemaps के साथ ESM में `js/main-es6.js` को बंडल करता है
- **Terser**: अनुकूलन के लिए स्वचालित मिनिमाइज़ेशन
- **Post-build**: `css/` और `assets/`, फ़ेविकॉन्स (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` को कॉपी करता है, और `dist/index.html` को हैश की गई इनपुट फ़ाइल (उदा: `main-es6-*.js`) पर फिर से लिखता है
- **अंतिम फ़ोल्डर**: `dist/` स्थिर रूप से परोसे जाने के लिए तैयार है

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### निरंतर एकीकरण

**GitHub Actions**: `.github/workflows/ci.yml`, जो `main` पर प्रत्येक पुश और प्रत्येक पुल रिक्वेस्ट पर ट्रिगर होता है।

**`verify`** — क्वालिटी गेट, जो अवरोधक है:

- `npm ci` फिर `npm run verify` (ESLint, Jest परीक्षण, कवरेज)
- `npm run format:check` (Prettier)

**`seo-report`** — `verify` के बाद: समय के साथ SEO मेट्रिक्स को ट्रैक करने के लिए ऑनलाइन साइट का Lighthouse ऑडिट।

**बाहरी विश्लेषण** जो पुल रिक्वेस्ट से जुड़े हैं: Codacy, CodeFactor और SonarCloud। SonarCloud गेट नए कोड पर विश्वसनीयता, सुरक्षा और रखरखाव क्षमता में A ग्रेड की मांग करता है।

**डिप्लॉयमेंट**: `./deploy.sh` साइट को S3 से सिंक्रनाइज़ करता है और CloudFront कैश को अमान्य करता है। यह स्क्रिप्ट आवश्यकता पड़ने पर रिस्पॉन्सिव छवियों को फिर से उत्पन्न करती है, जो git में मौजूद नहीं हैं।

### PWA (Progressive Web App)

LeapMultix ऑफ़लाइन समर्थन और इंस्टॉलेशन की सुविधा के साथ एक पूर्ण PWA है।

**Service Worker** (`sw.js`):

- नेविगेशन: `offline.html` पर ऑफ़लाइन फ़ॉलबैक के साथ Network-first
- छवियाँ: प्रदर्शन को अनुकूलित करने के लिए Cache-first
- अनुवाद: पृष्ठभूमि में अपडेट के लिए Stale-while-revalidate
- JS/CSS: हमेशा नवीनतम संस्करण प्रदान करने के लिए Network-first
- `cache-updater.js` के माध्यम से स्वचालित संस्करण प्रबंधन

**Manifest** (`manifest.json`):

- सभी उपकरणों के लिए SVG और PNG आइकन
- मोबाइल पर इंस्टॉलेशन संभव (Add to Home Screen)
- ऐप-जैसे अनुभव के लिए स्टैंडअलोन कॉन्फ़िगरेशन
- थीम और रंगों का समर्थन

**स्थानीय रूप से ऑफ़लाइन मोड का परीक्षण करें।** सर्वर शुरू करें, फिर `http://localhost:8080` (या प्रदर्शित पोर्ट) खोलें:

```bash
npm run serve
```

मैन्युअल रूप से: डेवलपर टूल्स में नेटवर्क बंद करें (नेटवर्क टैब, ऑफ़लाइन मोड), फिर पेज को रीफ़्रेश करें। `offline.html` प्रदर्शित होना चाहिए।

स्वचालित रूप से, Puppeteer के साथ:

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

- **ESLint**: flat config (`eslint.config.js`) के साथ आधुनिक कॉन्फ़िगरेशन, ES2022 सपोर्ट
- **Prettier**: स्वचालित कोड फ़ॉर्मेटिंग (`.prettierrc`)
- **Stylelint**: CSS सत्यापन (`.stylelintrc.json`)
- **JSDoc**: कवरेज विश्लेषण के साथ फ़ंक्शनों का स्वचालित दस्तावेज़ीकरण

**महत्वपूर्ण कोड नियम**:

- अप्रयुक्त वेरिएबल्स और पैरामीटर्स हटाएं (`no-unused-vars`)
- विशिष्ट त्रुटि प्रबंधन का उपयोग करें (कोई खाली catch नहीं)
- `security-utils.js` फ़ंक्शनों के पक्ष में `innerHTML` से बचें
- फ़ंक्शनों के लिए संज्ञानात्मक जटिलता (cognitive complexity) < 15 बनाए रखें
- जटिल फ़ंक्शनों को छोटे हेल्पर्स में विभाजित करें

**सुरक्षा**:

- **XSS सुरक्षा**: `security-utils.js` के फ़ंक्शनों का उपयोग करें:
  - `innerHTML` के बजाय `appendSanitizedHTML()`
  - सुरक्षित तत्व बनाने के लिए `createSafeElement()`
  - टेक्स्ट सामग्री के लिए `setSafeMessage()`
- **बाहरी स्क्रिप्ट्स**: `crossorigin="anonymous"` विशेषता अनिवार्य
- **इनपुट सत्यापन**: हमेशा बाहरी डेटा को सैनिटाइज़ करें
- **Content Security Policy**: स्क्रिप्ट स्रोतों को प्रतिबंधित करने के लिए CSP हेडर

**एक्सेसिबिलिटी**:

- WCAG 2.1 AA अनुपालन
- पूर्ण कीबोर्ड नेविगेशन
- उपयुक्त ARIA भूमिकाएँ और लेबल्स
- मानकों के अनुरूप रंग कंट्रास्ट

**प्रदर्शन**:

- `lazy-loader.js` के माध्यम से मॉड्यूल की लेज़ी लोडिंग
- CSS अनुकूलन और रिस्पॉन्सिव एसेट्स
- स्मार्ट कैशिंग के लिए Service Worker
- प्रोडक्शन में कोड स्प्लिटिंग और मिनिफिकेशन

## 📱 संगतता

### समर्थित ब्राउज़र

इंटरफ़ेस रंगों के लिए `oklch()` और प्रासंगिक स्थितियों के लिए `:has()` पर निर्भर करता है, जो न्यूनतम आवश्यकताएं निर्धारित करता है:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### डिवाइस

- **डेस्कटॉप**: कीबोर्ड और माउस नियंत्रण
- **टैबलेट**: अनुकूलित टच इंटरफ़ेस
- **स्मार्टफ़ोन**: अनुकूली रिस्पॉन्सिव डिज़ाइन

### एक्सेसिबिलिटी

- पूर्ण कीबोर्ड नेविगेशन (Tab, तीर कुंजियाँ, Esc)
- स्क्रीन रीडर्स के लिए ARIA भूमिकाएँ और लेबल्स
- मानकों के अनुरूप रंग कंट्रास्ट
- सहायक तकनीकों का समर्थन

## 🌍 स्थानीयकरण

पूर्ण बहुभाषी समर्थन:

- **फ़्रेंच** (डिफ़ॉल्ट भाषा)
- **अंग्रेज़ी**
- **स्पैनिश**

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

### i18n प्रबंधन स्क्रिप्ट्स

**`npm run i18n:verify`** - अनुवाद कुंजियों की सुसंगतता सत्यापित करें

**`npm run i18n:unused`** - अप्रयुक्त अनुवाद कुंजियों को सूचीबद्ध करें

**`npm run i18n:compare`** - fr.json (संदर्भ) के साथ अनुवाद फ़ाइलों की तुलना करें

यह स्क्रिप्ट (`scripts/compare-translations.cjs`) सभी भाषा फ़ाइलों का सिंक्रोनाइज़ेशन सुनिश्चित करती है:

**विशेषताएँ:**

- अनुपलब्ध कुंजियों की पहचान (fr.json में उपस्थित लेकिन अन्य भाषाओं में अनुपस्थित)
- अतिरिक्त कुंजियों की पहचान (अन्य भाषाओं में उपस्थित लेकिन fr.json में नहीं)
- खाली मानों की पहचान (`""`, `null`, `undefined`, `[]`)
- प्रकार सुसंगतता की जांच (string बनाम array)
- नेस्टेड JSON संरचनाओं को डॉट नोटेशन में समतल करना (उदा: `arcade.multiMemory.title`)
- विस्तृत कंसोल रिपोर्ट तैयार करना
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

- संपूर्ण यूज़र इंटरफ़ेस
- खेलों के निर्देश
- त्रुटि और फ़ीडबैक संदेश
- विवरण और प्रासंगिक सहायता
- एडवेंचर मोड की कथा सामग्री
- एक्सेसिबिलिटी और ARIA लेबल्स

## 🔊 रिकॉर्ड की गई आवाज़

खेल प्रश्नों, प्रोत्साहनों और व्याख्याओं को बोलकर पढ़ता है। यह केवल सीमित संख्या में वाक्य बोलता है, लगभग 7,400 प्रति भाषा: इसलिए इन्हें एक बार हमेशा के लिए रिकॉर्ड किया जा सकता है, और तब खेल का कोई भी हिस्सा किसी सिंथेसिस सेवा को कॉल नहीं करता है। क्लिप्स के बिना, खेल डिवाइस की आवाज़ के साथ पढ़ता है।

### इस रिपॉजिटरी में: बिना आवाज़ों के एप्लिकेशन

कोड पहले से रिकॉर्ड किए गए क्लिप्स को चलाना जानता है, और इसमें वह पाइपलाइन शामिल है जो उन्हें बनाती है। क्लिप्स इसमें नहीं हैं, और न ही प्रदाताओं की कुंजियाँ हैं: कोई भी फ़ॉर्क या स्थानीय इंस्टॉलेशन डिवाइस की आवाज़ के साथ पढ़ता है।

- डिवाइस की आवाज़ पर वाक्य-दर-वाक्य **स्वचालित फ़ॉलबैक**: क्लिप अनुपस्थित या त्रुटिपूर्ण होने पर, ब्राउज़र द्वारा प्लेबैक अस्वीकार करने पर, क्लिप 1.5 सेकंड में शुरू न होने पर, या कैश्ड क्लिप के बिना ऑफ़लाइन होने पर।
- **सेटिंग्स**: शीर्ष पट्टी में आवाज़ का बटन प्लेबैक को सक्षम या म्यूट करता है; "रिकॉर्ड की गई आवाज़" चेकबॉक्स (एक्सेसिबिलिटी और नियंत्रण) रिकॉर्ड की गई आवाज़ और डिवाइस की आवाज़ के बीच चयन करता है। यह केवल उन भाषाओं में दिखाई देता है जिनमें कोई आवाज़ प्रकाशित की गई है।
- **ऑफ़लाइन**: पहले सुनी जा चुकी क्लिप्स कैश में रहती हैं (service worker)।
- **खेल क्लिप्स कहाँ ढूँढता है**: `<meta name="leapmultix-voice-base">` टैग में, जो रिपॉजिटरी में खाली है। केवल प्रोडक्शन डिप्लॉयमेंट ही इसमें `/voice/` लिखता है।

मशीन पर अपने स्वयं के क्लिप्स के साथ (नीचे दी गई प्रक्रिया द्वारा निर्मित, गेम के साथ `../leapmultix-voices` में व्यवस्थित), `?voix=local` पैरामीटर उन्हें डेवलपमेंट सर्वर द्वारा चलाता है:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org पर: होस्टिंग की आवाज़ें

लेखक द्वारा प्रदान की गई साइट रिकॉर्ड की गई सिंथेटिक आवाज़ें प्रदान करती है:

- फ़्रेंच में, **Lucie**, जिसे ElevenLabs (Eleven v3 मॉडल) के साथ बनाया गया है;
- ब्रिटिश अंग्रेज़ी और स्पेन की स्पैनिश में, **Sulafat**, जिसे Google Cloud Text-to-Speech (Chirp 3 HD आवाज़) के साथ बनाया गया है;
- खिलाड़ी की पसंद के अनुसार, फ़्रेंच में **Marie** और अंग्रेज़ी में **Jane**, जिन्हें Mistral AI (Voxtral TTS) के साथ बनाया गया है।

क्लिप्स एक निजी रिपॉजिटरी में और एक समर्पित S3 बकेट में रहते हैं, जिसे CloudFront द्वारा `/voice/*` पर प्रस्तुत किया जाता है। सेटिंग्स में, "आवाज़" मेनू उस भाषा की आवाज़ें प्रदान करता है जब उसमें कई आवाज़ें उपलब्ध हों, और विवरण सुनी गई आवाज़ की सेवा का नाम बताता है।

### क्लिप्स जनरेट करना

पाइपलाइन को `scripts/voice/` में स्क्रिप्ट किया गया है और यह स्वामी की मशीन पर चलती है, कभी भी सार्वजनिक CI में नहीं। प्रदाताओं की कुंजियाँ (फ़्रेंच के लिए ElevenLabs, अंग्रेज़ी और स्पैनिश के लिए Google Cloud Text-to-Speech, Marie और Jane के लिए Mistral) रिपॉजिटरी से बाहर एक `.env` फ़ाइल में रहती हैं, जिसे `node --env-file` द्वारा पास किया जाता है: कोई भी कुंजी git में नहीं जाती है। Claude Code स्किल [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) चरण-दर-चरण प्रक्रिया (गेट्स, स्वीकृतियां, पुनरारंभ) का विवरण देती है; विस्तृत विवरण [`docs/voix-enregistree.md`](docs/voix-enregistree.md) में है।

1. **अनुमान लगाएं**: शेष वाक्यों और भुगतान किए जाने वाले वर्णों का (Eleven v3: लगभग 0.53 क्रेडिट प्रति वर्ण; Chirp 3 HD: $30 प्रति 10 लाख वर्ण, प्रत्येक माह के पहले 10 लाख वर्ण निःशुल्क; Voxtral TTS: $16 प्रति 10 लाख)।
2. **जनरेट करें**। वही कमांड फिर से चलाने पर जो छूट गया है वह वहीं से जारी रहता है। जब क्रेडिट समाप्त हो जाते हैं, तो स्क्रिप्ट आधी लिखी फ़ाइल छोड़े बिना ठीक से रुक जाती है (कोड 3)। `--max-total-chars` संस्करण के संचयी व्यय की सीमा तय करता है: प्राप्त होते ही प्रत्येक भुगतान की गई प्रतिक्रिया को एक रजिस्टर में दर्ज किया जाता है, जो अचानक रुकने पर भी सुरक्षित रहता है। Google और Mistral के मामले में, जो कोई पठनीय शेष राशि नहीं देते हैं, यह एकमात्र सुरक्षा है।
3. **सत्यापित करें**: प्रत्येक वाक्य की अपनी क्लिप होती है और प्रत्येक MP3 मान्य होता है। Whisper फिर स्थानीय स्तर पर प्रत्येक क्लिप को ट्रांसक्राइब करता है, और सत्यापन गलत सुने गए नंबरों और असामान्य अवधियों को फ़्लैग करता है। `voice:review` Whisper, इस सत्यापन और सुनने वाले पेज को एक ही कमांड में जोड़ता है।
4. **सुनें**: सुनने वाले पेज (`voice:listen`) पर फ़्लैग किए गए क्लिप्स और स्त्रीलिंग रूपों ("une fois 7") के नमूने सुनें, जिन्हें Whisper अलग नहीं कर पाता। प्रत्येक क्लिप में एक "फिर से करें" बॉक्स होता है, जो इसे अस्वीकृत क्लिप्स की सूची में जोड़ देता है।
5. **फिर से बनाएं**: अस्वीकृत क्लिप्स (`--redo`) को फिर से बनाएं और Whisper को पुनः चलाएं, फिर एक दूसरे पेज पर पहले और बाद के प्रत्येक क्लिप की तुलना करें। दो या तीन प्रयासों के बाद भी गलत उच्चारित क्लिप को `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`) में एक निर्दिष्ट पाठ दिया जाता है, उदाहरण के लिए शब्दों में लिखी गई संख्या।
6. **प्रकाशित करें**: क्लिप्स प्रकाशित करें, सत्यापित करें कि वे ऑनलाइन प्रतिक्रिया दे रहे हैं, और फिर भाषा का इंडेक्स प्रकाशित करें, पहले परीक्षकों के लिए (`?voix=test`)।
7. **उपलब्ध कराएं**: आवाज़ को सभी के लिए खोलें, फिर इसे डिफ़ॉल्ट रूप से सक्रिय करें। सर्किट ब्रेकर (`voice:publish -- remove`) इंडेक्स से किसी भाषा को हटा देता है: खेल वापस डिवाइस की आवाज़ पर लौट आता है।

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

### नियम: संशोधित बोले गए वाक्य को प्रोडक्शन में डालने से पहले फिर से रिकॉर्ड किया जाता है

प्रत्येक बोला गया वाक्य अनुवाद (`assets/translations/{fr,en,es}.json`) से आता है और कॉर्पस का हिस्सा होता है। इसलिए किसी बोले गए वाक्य को बदलने से कॉर्पस लॉक टेस्ट (`scripts/voice/corpus.lock.json`) विफल हो जाता है। जिस भाषा में रिकॉर्ड की गई आवाज़ है, उसके लिए प्रभावित वाक्यों के क्लिप्स जनरेट किए जाते हैं, उनकी जांच की जाती है और उन्हें सुना जाता है, फिर मर्ज करने से **पहले** उन्हें प्रकाशित किया जाता है। अंत में लॉक को अपडेट किया जाता है (`npm run voice:corpus:lock`)। इन क्लिप्स के बिना, संशोधित वाक्य डिवाइस की आवाज़ के साथ पढ़ा जाता है।

## 📊 डेटा भंडारण

### उपयोगकर्ता डेटा

- प्रोफ़ाइल और प्राथमिकताएं
- गेम मोड के अनुसार प्रगति
- आर्केड गेम के स्कोर और आँकड़े
- वैयक्तिकरण सेटिंग्स

### तकनीकी विशेषताएँ

- फ़ॉलबैक के साथ स्थानीय भंडारण (localStorage)
- प्रति उपयोगकर्ता डेटा अलगाव
- प्रगति का स्वचालित बैकअप
- पुराने डेटा का स्वचालित माइग्रेशन

## 🐛 समस्या की रिपोर्ट करें

समस्याओं की रिपोर्ट GitHub issues के माध्यम से की जा सकती है। कृपया निम्नलिखित शामिल करें:

- समस्या का विस्तृत विवरण
- इसे पुनरुत्पादित करने के चरण
- ब्राउज़र और संस्करण
- यदि प्रासंगिक हो तो स्क्रीनशॉट

## 💝 प्रोजेक्ट का समर्थन करें

**[☕ PayPal के माध्यम से दान करें](https://paypal.me/jls)**

## 📄 लाइसेंस

यह प्रोजेक्ट AGPL v3 लाइसेंस के तहत है। अधिक जानकारी के लिए `LICENSE` फ़ाइल देखें।

---

_LeapMultix — चारों बुनियादी गणितीय संक्रियाओं को सीखने के लिए एक निःशुल्क शैक्षिक एप्लिकेशन_

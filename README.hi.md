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
[![रखरखाव-क्षमता रेटिंग](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![तकनीकी ऋण](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![बग](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![कमज़ोरियाँ](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![दोहराई गई पंक्तियाँ (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![कोड की पंक्तियाँ](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## विषय-सूची

- [विवरण](#विवरण)
- [अवलोकन](#-अवलोकन)
- [विशेषताएँ](#-विशेषताएँ)
- [त्वरित शुरुआत](#-त्वरित-शुरुआत)
- [आर्किटेक्चर](#-आर्किटेक्चर)
- [गेम मोड का विस्तृत विवरण](#-गेम-मोड-का-विस्तृत-विवरण)
- [डेवलपमेंट](#-डेवलपमेंट)
- [संगतता](#-संगतता)
- [स्थानीयकरण](#-स्थानीयकरण)
- [रिकॉर्ड की गई आवाज़](#-रिकॉर्ड-की-गई-आवाज़)
- [डेटा संग्रहण](#-डेटा-संग्रहण)
- [समस्या की रिपोर्ट करें](#-समस्या-की-रिपोर्ट-करें)
- [लाइसेंस](#-लाइसेंस)

## विवरण

LeapMultix एक इंटरैक्टिव शैक्षिक वेब एप्लिकेशन है, जिसे 6 से 12 वर्ष के बच्चों को चार अंकगणितीय संक्रियाओं—गुणा (×), जोड़ (+), घटाव (−) और भाग (÷)—में निपुण बनाने के लिए तैयार किया गया है। यह सहज, सुलभ और बहुभाषी इंटरफ़ेस में **6 गेम मोड** और **4 आर्केड मिनी-गेम** प्रदान करता है।

**कई संक्रियाओं का समर्थन:** सभी मोड चारों संक्रियाओं का समर्थन करते हैं। संक्रिया का चयन होम स्क्रीन पर किया जाता है और पूरे अभ्यास के दौरान वही लागू रहता है।

**डेवलपर:** Julien LS (contact@jls42.org)

**ऑनलाइन URL:** https://leapmultix.jls42.org/

## 📸 अवलोकन

### स्क्रीन

|                                                                                                                           |                                                                                                         |
| :-----------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|                       ![« कौन खेल रहा है? » स्क्रीन: प्रोफ़ाइल का चयन](docs/media/01-accueil.webp)                        |                   ![मुख्य मेनू: संक्रिया और गेम मोड का चयन](docs/media/02-menu.webp)                    |
|                    **कौन खेल रहा है?** — प्रत्येक बच्चे के लिए उसके अवतार और प्रगति सहित एक प्रोफ़ाइल।                    |                       **मेनू** — पहले यहाँ संक्रिया और फिर गेम मोड चुना जाता है।                        |
|                  ![खोज मोड: 4 की पहाड़ा बिंदुओं के रूप में दिखाया गया है](docs/media/03-decouverte.webp)                  |             ![क्विज़ मोड: गलत उत्तर लाल और सही उत्तर हरे रंग में](docs/media/04-quiz.webp)              |
|        **खोज** — प्रत्येक समानता को बिंदुओं, छलाँगों या गिनती के रूप में, पहाड़े की युक्ति के साथ दिखाया जाता है।         | **क्विज़** — बच्चे का चयन सही उत्तर के पास दिखाई देता रहता है और व्याख्या गणना को विस्तार से समझाती है। |
|                           ![चुनौती मोड: उलटी गिनती और वर्तमान शृंखला](docs/media/05-defi.webp)                            |          ![रोमांच मोड: दस स्तरों का मानचित्र, आगामी स्तर लॉक हैं](docs/media/06-aventure.webp)          |
|            **चुनौती** — समय के विरुद्ध दौड़। गलती होने पर सही उत्तर पढ़ने के लिए टाइमर कुछ समय तक रुक जाता है।            |                    **रोमांच** — दस स्तर, जो सितारों के बदले एक के बाद एक खुलते हैं।                     |
|                       ![टाइम ट्रायल मोड: घटाव की दौड़, टाइमर और प्रगति](docs/media/14-chrono.webp)                        |                         ![आर्केड मेनू: चार मिनी-गेम](docs/media/07-arcade.webp)                         |
| **टाइम ट्रायल** — चुनी गई संक्रिया में समय के विरुद्ध दस सही उत्तर; गलत हुई गणनाएँ दोबारा देखने की सूची में चली जाती हैं। |                      **आर्केड** — कठिनाई समायोजन और यान के चयन वाले चार मिनी-गेम।                       |
|    ![डैशबोर्ड: प्रत्येक मोड के गेम, रिकॉर्ड और उत्तर, संक्रिया के अनुसार विस्तृत](docs/media/08-tableau-de-bord.webp)     |                ![वैयक्तिकरण: अवतार, थीम और सुलभता](docs/media/09-personnalisation.webp)                 |
| **डैशबोर्ड** — प्रत्येक मोड के गेम और रिकॉर्ड, संक्रिया के अनुसार विस्तृत; गुणा में दोबारा देखने योग्य सितारे और पहाड़े।  |                   **वैयक्तिकरण** — अवतार, रंग थीम, टेक्स्ट का आकार और उच्च कंट्रास्ट।                   |

### आर्केड मिनी-गेम

चार गेम एक ही प्रश्न पूछते हैं—जो खेल क्षेत्र के ऊपर शेष समय और जीवन के साथ
दिखाया जाता है—लेकिन हर बार अलग क्रिया करने को कहते हैं।

|                                                                                                                            |                                                                                                   |
| :------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
|           ![MultiInvaders: संख्याएँ लिए हुए राक्षस और स्क्रीन के नीचे एक यान](docs/media/10-multiinvaders.webp)            | ![MultiMiam: एक भूलभुलैया जिसमें बिंदुओं पर संभावित उत्तर लिखे हैं](docs/media/11-multimiam.webp) |
|  **MultiInvaders** — गलत उत्तरों पर गोली चलाएँ और सही उत्तर को छोड़ दें: उसके पीछे मुक्त किया जाने वाला एक मित्र छिपा है।  |        **MultiMiam** — राक्षसों से बचते हुए सही परिणाम पकड़ने के लिए भूलभुलैया में घूमें।         |
| ![MultiMemory: कार्डों की ग्रिड, जिसमें पलटे हुए दो कार्ड एक गणना और एक संख्या दिखाते हैं](docs/media/12-multimemory.webp) |      ![MultiSnake: घास के मैदान में एक साँप और क्रमांकित सेब](docs/media/13-multisnake.webp)      |
|                   **MultiMemory** — याद करके पता लगाएँ कि किस कार्ड पर पलटी हुई गणना का परिणाम लिखा है।                    |             **MultiSnake** — सही संख्याएँ खाकर बड़े हों और अन्य सभी संख्याओं से बचें।             |

## ✨ विशेषताएँ

### 🎮 गेम मोड

- **खोज मोड**: प्रत्येक संक्रिया के अनुरूप दृश्य और इंटरैक्टिव अन्वेषण
- **क्विज़ मोड**: चारों संक्रियाओं (×, +, −, ÷) के समर्थन और अनुकूली प्रगति वाले बहुविकल्पीय प्रश्न
- **चुनौती मोड**: चारों संक्रियाओं (×, +, −, ÷) और कठिनाई के विभिन्न स्तरों के साथ समय के विरुद्ध दौड़
- **रोमांच मोड**: चारों संक्रियाओं के समर्थन के साथ स्तरों के माध्यम से कथात्मक प्रगति
- **टाइम ट्रायल मोड**: अपना सर्वश्रेष्ठ समय सुधारने के लिए बिना रुके चलते टाइमर के विरुद्ध 10 सही उत्तर, चारों संक्रियाओं (×, +, −, ÷) के साथ

### 🕹️ आर्केड मिनी-गेम

- **MultiInvaders**: शैक्षिक Space Invaders — गलत उत्तरों को नष्ट करें
- **MultiMiam**: गणितीय Pac-Man — सही उत्तर एकत्र करें
- **MultiMemory**: स्मृति का खेल — संक्रियाओं को परिणामों से मिलाएँ
- **MultiSnake**: शैक्षिक Snake — सही संख्याएँ खाकर बड़े हों

### ➕ कई संक्रियाओं का समर्थन

LeapMultix **सभी मोड में** चारों अंकगणितीय संक्रियाओं का संपूर्ण अभ्यास प्रदान करता है:

| मोड         | ×   | +   | −   | ÷   |
| ----------- | --- | --- | --- | --- |
| क्विज़      | ✅  | ✅  | ✅  | ✅  |
| चुनौती      | ✅  | ✅  | ✅  | ✅  |
| खोज         | ✅  | ✅  | ✅  | ✅  |
| रोमांच      | ✅  | ✅  | ✅  | ✅  |
| टाइम ट्रायल | ✅  | ✅  | ✅  | ✅  |
| आर्केड      | ✅  | ✅  | ✅  | ✅  |

### 🌍 सभी मोड में उपलब्ध विशेषताएँ

- **बहु-उपयोगकर्ता**: सहेजी गई प्रगति के साथ अलग-अलग प्रोफ़ाइल का प्रबंधन
- **बहुभाषी**: फ़्रेंच, अंग्रेज़ी और स्पेनिश का समर्थन
- **वैयक्तिकरण**: अवतार, रंग थीम और पृष्ठभूमियाँ
- **सुलभता**: कीबोर्ड नेविगेशन, टच समर्थन और WCAG 2.1 AA अनुपालन
- **रिकॉर्ड की गई आवाज़**: गेम पहले से रिकॉर्ड की गई संश्लेषित आवाज़ में प्रश्न और प्रोत्साहन पढ़ सकता है तथा आवश्यकता पड़ने पर अपने-आप डिवाइस की आवाज़ का उपयोग करता है। आवाज़ें इस रिपॉज़िटरी में नहीं हैं: leapmultix.jls42.org साइट फ़्रेंच में Lucie, अंग्रेज़ी और स्पेनिश में Sulafat तथा विकल्प के रूप में फ़्रेंच में Sulafat और Marie एवं अंग्रेज़ी में Jane उपलब्ध कराती है (देखें [रिकॉर्ड की गई आवाज़](#-रिकॉर्ड-की-गई-आवाज़))
- **मोबाइल रिस्पॉन्सिव**: टैबलेट और स्मार्टफ़ोन के लिए अनुकूलित इंटरफ़ेस
- **प्रगति प्रणाली**: प्रत्येक प्रोफ़ाइल का डैशबोर्ड (गेम, रिकॉर्ड और दोबारा देखने योग्य पहाड़े, संक्रिया के अनुसार विस्तृत), बैज और दैनिक चुनौतियाँ

## 🚀 त्वरित शुरुआत

### आवश्यकताएँ

- Node.js (संस्करण 16 या उसके बाद का)
- कोई आधुनिक वेब ब्राउज़र

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

### तकनीकी आर्किटेक्चर

**आधुनिक ES6 मॉड्यूल**: प्रोजेक्ट ES6 क्लास और नेटिव imports/exports वाले मॉड्यूलर आर्किटेक्चर का उपयोग करता है।

**पुनः उपयोग योग्य कॉम्पोनेंट**: इंटरफ़ेस केंद्रीकृत UI कॉम्पोनेंट (TopBar, InfoBar, Dashboard, Customization) से बनाया गया है।

**Lazy Loading**: आरंभिक प्रदर्शन को बेहतर बनाने के लिए `lazy-loader.js` के माध्यम से माँग पर मॉड्यूल को समझदारी से लोड किया जाता है।

**एकीकृत संग्रहण प्रणाली**: LocalStorage और fallbacks के माध्यम से उपयोगकर्ता डेटा को स्थायी रखने के लिए केंद्रीकृत API।

**केंद्रीकृत ऑडियो प्रबंधन**: बहुभाषी समर्थन और प्रत्येक उपयोगकर्ता की प्राथमिकताओं के साथ ध्वनि नियंत्रण।

**Event Bus**: रखरखाव योग्य आर्किटेक्चर के लिए कॉम्पोनेंट के बीच अलग-अलग की गई इवेंट-आधारित संचार व्यवस्था।

**स्लाइड-आधारित नेविगेशन**: `goToSlide()` के साथ क्रमांकित स्लाइड (slide0, slide1 आदि) पर आधारित नेविगेशन प्रणाली।

**सुरक्षा**: सभी DOM परिचालनों के लिए `security-utils.js` के माध्यम से XSS सुरक्षा और सैनिटाइज़ेशन।

## 🎯 गेम मोड का विस्तृत विवरण

### खोज मोड

प्रत्येक संक्रिया के अनुरूप दृश्य अन्वेषण इंटरफ़ेस, जिसमें शामिल हैं:

- गुणा का इंटरैक्टिव दृश्यांकन
- एनिमेशन और स्मृति-सहायक संकेत
- शैक्षिक ड्रैग-एंड-ड्रॉप
- प्रत्येक पहाड़े में स्वतंत्र प्रगति

### क्विज़ मोड

बहुविकल्पीय प्रश्न, जिनमें शामिल हैं:

- प्रत्येक सत्र में 10 प्रश्न
- सफलताओं के अनुसार अनुकूली प्रगति
- वर्चुअल संख्यात्मक कीपैड
- स्ट्रीक प्रणाली (लगातार सही उत्तरों की शृंखला)

### चुनौती मोड

समय के विरुद्ध दौड़, जिसमें शामिल हैं:

- कठिनाई के 3 स्तर (आरंभिक, मध्यम, कठिन)
- सही उत्तरों के लिए अतिरिक्त समय
- जीवन प्रणाली
- सर्वश्रेष्ठ स्कोर की रैंकिंग

### रोमांच मोड

कथात्मक प्रगति, जिसमें शामिल हैं:

- अनलॉक किए जा सकने वाले 10 विषयगत स्तर
- दृश्य प्रगति वाला इंटरैक्टिव मानचित्र
- पात्रों वाली मनमोहक कहानी
- सितारों और पुरस्कारों की प्रणाली

### टाइम ट्रायल मोड

बिना रुके चलते टाइमर के विरुद्ध यथासंभव तेज़ी से दस सही उत्तर:

- चारों संक्रियाएँ: गुणा के पहाड़े (पहाड़ा सेटिंग में निर्धारित) और
  जोड़ (7 + k), घटाव ((7 + k) − 7) तथा भाग ((7 × k) ÷ 7) के सभी पहाड़े
- विकल्पों या संख्यात्मक कीपैड से उत्तर, क्लिक और कीबोर्ड दोनों के माध्यम से
- प्रत्येक संक्रिया के लिए सर्वश्रेष्ठ समय, औसत समय और हाल के गेम का ग्राफ़
- « दोबारा देखने के लिए मेरी गणनाएँ »: प्रत्येक संक्रिया के लिए एक सूची, जिसका दोनों दिशाओं में अभ्यास किया जाता है (6 × 7 और 7 × 6,
  15 − 7 और 15 − 8)

### डैशबोर्ड

हर प्रोफ़ाइल के लिए बच्चे ने वास्तव में क्या खेला है:

- रोमांच के सितारे और दोबारा देखने योग्य गुणा के पहाड़े (प्रत्येक पहाड़े के अंतिम 20 उत्तर)
- क्विज़, चुनौती, रोमांच और टाइम ट्रायल में प्रश्न और सही उत्तर
- प्रत्येक मोड और प्रत्येक मिनी-गेम के गेम तथा रिकॉर्ड, छोड़े गए गेम सहित, संक्रिया के अनुसार विस्तृत
  जैसे ही बच्चा एक से अधिक संक्रियाओं का अभ्यास करता है

### आर्केड मिनी-गेम

प्रत्येक मिनी-गेम में उपलब्ध हैं:

- कठिनाई का चयन और वैयक्तिकरण
- जीवन और स्कोर प्रणाली
- कीबोर्ड और टच नियंत्रण
- प्रत्येक उपयोगकर्ता के लिए अलग रैंकिंग

## 🔧 डेवलपमेंट

### डेवलपमेंट वर्कफ़्लो

**कभी भी सीधे main पर commit न करें।** प्रोजेक्ट में कार्य
फ़ीचर ब्रांच के माध्यम से किया जाता है।

**1. ब्रांच बनाएँ**, किसी फ़ीचर के लिए `feat/`, किसी सुधार के लिए `fix/`:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. डेवलप करें और जाँचें।** फ़ॉर्मैटिंग पहले आती है: CI इसे
टेस्ट चलाने से पहले ही अस्वीकार कर देता है।

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. ब्रांच पर commit करें**, फिर उसे push करें:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. pull request खोलें** और विश्लेषण की प्रतीक्षा करें: verify, Codacy,
CodeFactor और SonarCloud। merge करने से पहले सभी जाँचें सफल होने तक सुधार किए जाते हैं।

**Commit शैली**: संक्षिप्त संदेश, आदेशात्मक शैली (उदाहरण: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: प्रत्येक commit से पहले सुनिश्चित करें कि `npm run lint`, `npm test` और `npm run test:coverage` सफल हों

### कॉम्पोनेंट आर्किटेक्चर

**GameMode (बेस क्लास)**: सभी मोड मानकीकृत विधियों वाली एक साझा क्लास से विरासत प्राप्त करते हैं।

**GameModeManager**: मोड को शुरू करने और प्रबंधित करने की केंद्रीकृत व्यवस्था।

**UI कॉम्पोनेंट**: TopBar, InfoBar, Dashboard और Customization एक सुसंगत इंटरफ़ेस प्रदान करते हैं।

**Lazy Loading**: आरंभिक प्रदर्शन को बेहतर बनाने के लिए मॉड्यूल माँग पर लोड किए जाते हैं।

**Event Bus**: इवेंट प्रणाली के माध्यम से कॉम्पोनेंट के बीच अलग-अलग की गई संचार व्यवस्था।

### टेस्ट

प्रोजेक्ट में एक संपूर्ण टेस्ट सुइट शामिल है:

- core मॉड्यूल के यूनिट टेस्ट
- कॉम्पोनेंट के इंटीग्रेशन टेस्ट
- गेम मोड के टेस्ट
- स्वचालित कोड कवरेज

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### प्रोडक्शन बिल्ड

- **Rollup**: code-splitting और sourcemaps के साथ `js/main-es6.js` को ESM में बंडल करता है
- **Terser**: अनुकूलन के लिए स्वचालित minification
- **Post-build**: `css/` और `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`) तथा `sw.js` को कॉपी करता है और `dist/index.html` को hashed entry file की ओर पुनर्लिखता है (उदाहरण: `main-es6-*.js`)
- **अंतिम फ़ोल्डर**: `dist/` स्थिर रूप से सर्व किए जाने के लिए तैयार

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### सतत एकीकरण

**GitHub Actions**: `.github/workflows/ci.yml`, जो
`main` पर प्रत्येक push और प्रत्येक pull request पर ट्रिगर होता है।

**`verify`** — अनिवार्य quality gate:

- `npm ci` और फिर `npm run verify` (ESLint, Jest टेस्ट, कवरेज)
- `npm run format:check` (Prettier)

**`seo-report`** — `verify` के बाद: ऑनलाइन साइट का Lighthouse audit,
जिससे समय के साथ SEO मेट्रिक्स पर नज़र रखी जा सके।

**pull request से जुड़े बाहरी विश्लेषण**: Codacy, CodeFactor और
SonarCloud। SonarCloud gate नए कोड की विश्वसनीयता, सुरक्षा और
रखरखाव-क्षमता में A रेटिंग अनिवार्य करता है।

**डिप्लॉयमेंट**: `./deploy.sh` साइट को S3 पर सिंक करता है और
CloudFront cache को अमान्य करता है। आवश्यकता होने पर स्क्रिप्ट git में अनुपस्थित responsive images दोबारा बनाती है।

### PWA (Progressive Web App)

LeapMultix एक पूर्ण PWA है, जिसमें ऑफ़लाइन समर्थन और इंस्टॉलेशन की सुविधा उपलब्ध है।

**Service Worker** (`sw.js`) :

- नेविगेशन: `offline.html` पर ऑफ़लाइन फ़ॉलबैक के साथ Network-first
- इमेज: प्रदर्शन बेहतर बनाने के लिए Cache-first
- अनुवाद: बैकग्राउंड में अपडेट करने के लिए Stale-while-revalidate
- JS/CSS: हमेशा नवीनतम संस्करण उपलब्ध कराने के लिए Network-first
- `cache-updater.js` के माध्यम से स्वचालित संस्करण प्रबंधन

**Manifest** (`manifest.json`) :

- सभी उपकरणों के लिए SVG और PNG आइकन
- मोबाइल पर इंस्टॉलेशन संभव (Add to Home Screen)
- ऐप-जैसे अनुभव के लिए standalone कॉन्फ़िगरेशन
- थीम और रंगों का समर्थन

**ऑफ़लाइन मोड का स्थानीय रूप से परीक्षण करें।** सर्वर शुरू करें, फिर
`http://localhost:8080` (या प्रदर्शित पोर्ट) खोलें:

```bash
npm run serve
```

मैन्युअल रूप से: डेवलपमेंट टूल्स में नेटवर्क बंद करें (नेटवर्क टैब,
ऑफ़लाइन मोड), फिर पेज रीफ़्रेश करें। `offline.html` प्रदर्शित होना चाहिए।

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

**कोड गुणवत्ता टूल्स**:

- **ESLint**: flat config (`eslint.config.js`) के साथ आधुनिक कॉन्फ़िगरेशन, ES2022 समर्थन
- **Prettier**: स्वचालित कोड फ़ॉर्मैटिंग (`.prettierrc`)
- **Stylelint**: CSS सत्यापन (`.stylelintrc.json`)
- **JSDoc**: कवरेज विश्लेषण सहित फ़ंक्शनों का स्वचालित दस्तावेज़ीकरण

**महत्वपूर्ण कोड नियम**:

- अप्रयुक्त वेरिएबल और पैरामीटर हटाएँ (`no-unused-vars`)
- विशिष्ट त्रुटि प्रबंधन का उपयोग करें (खाली catch नहीं)
- `security-utils.js` फ़ंक्शनों के पक्ष में `innerHTML` से बचें
- फ़ंक्शनों की संज्ञानात्मक जटिलता < 15 रखें
- जटिल फ़ंक्शनों को छोटे helpers में विभाजित करें

**सुरक्षा**:

- **XSS सुरक्षा**: `security-utils.js` के फ़ंक्शनों का उपयोग करें:
  - `innerHTML` के बजाय `appendSanitizedHTML()`
  - सुरक्षित एलिमेंट बनाने के लिए `createSafeElement()`
  - टेक्स्ट सामग्री के लिए `setSafeMessage()`
- **बाहरी स्क्रिप्ट**: `crossorigin="anonymous"` एट्रिब्यूट अनिवार्य है
- **इनपुट सत्यापन**: बाहरी डेटा को हमेशा sanitize करें
- **Content Security Policy**: स्क्रिप्ट स्रोतों को सीमित करने के लिए CSP headers

**सुलभता**:

- WCAG 2.1 AA अनुपालन
- पूर्ण कीबोर्ड नेविगेशन
- उपयुक्त ARIA roles और labels
- मानकों के अनुरूप रंग कंट्रास्ट

**प्रदर्शन**:

- `lazy-loader.js` के माध्यम से मॉड्यूल का Lazy loading
- CSS अनुकूलन और responsive assets
- बुद्धिमत्तापूर्ण caching के लिए Service Worker
- प्रोडक्शन में Code splitting और minification

## 📱 संगतता

### समर्थित ब्राउज़र

इंटरफ़ेस रंगों के लिए `oklch()` और संदर्भानुसार स्थितियों के लिए `:has()` पर
निर्भर करता है, जिससे न्यूनतम आवश्यकताएँ ये हैं:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### उपकरण

- **Desktop**: कीबोर्ड और माउस नियंत्रण
- **टैबलेट**: अनुकूलित टच इंटरफ़ेस
- **स्मार्टफ़ोन**: अनुकूलनशील responsive design

### सुलभता

- पूर्ण कीबोर्ड नेविगेशन (Tab, तीर कुंजियाँ, Esc)
- स्क्रीन रीडर के लिए ARIA roles और labels
- मानकों के अनुरूप रंग कंट्रास्ट
- सहायक तकनीकों का समर्थन

## 🌍 स्थानीयकरण

पूर्ण बहुभाषी समर्थन:

- **फ़्रेंच** (डिफ़ॉल्ट भाषा)
- **अंग्रेज़ी**
- **स्पेनिश**

### अनुवाद प्रबंधन

**अनुवाद फ़ाइलें:** `assets/translations/*.json`

**फ़ॉर्मैट:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n प्रबंधन स्क्रिप्ट

**`npm run i18n:verify`** - अनुवाद कुंजियों की संगति जाँचें

**`npm run i18n:unused`** - अप्रयुक्त अनुवाद कुंजियों की सूची बनाएँ

**`npm run i18n:compare`** - अनुवाद फ़ाइलों की fr.json (संदर्भ) से तुलना करें

यह स्क्रिप्ट (`scripts/compare-translations.cjs`) सभी भाषा फ़ाइलों का समन्वय सुनिश्चित करती है:

**सुविधाएँ:**

- अनुपस्थित कुंजियों की पहचान (जो fr.json में मौजूद हैं, लेकिन अन्य भाषाओं में नहीं)
- अतिरिक्त कुंजियों की पहचान (जो अन्य भाषाओं में मौजूद हैं, लेकिन fr.json में नहीं)
- खाली मानों की पहचान (`""`, `null`, `undefined`, `[]`)
- प्रकारों की संगति की जाँच (string बनाम array)
- नेस्टेड JSON संरचनाओं को डॉट नोटेशन में समतल करना (उदाहरण: `arcade.multiMemory.title`)
- विस्तृत console report बनाना
- JSON report को `docs/translations-comparison-report.json` में सहेजना

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
- खेल के निर्देश
- त्रुटि और फ़ीडबैक संदेश
- विवरण और संदर्भानुसार सहायता
- Adventure मोड की कथात्मक सामग्री
- सुलभता और ARIA labels

## 🔊 रिकॉर्ड की गई आवाज़

खेल सवालों, प्रोत्साहन और स्पष्टीकरणों को ज़ोर से पढ़ता है। यह केवल सीमित संख्या में वाक्य बोलता है, प्रत्येक भाषा में लगभग 7,400: इसलिए उन्हें एक बार स्थायी रूप से रिकॉर्ड किया जा सकता है और फिर किसी भी हिस्से को synthesis सेवा बुलाने की आवश्यकता नहीं होती। क्लिप उपलब्ध न होने पर खेल उपकरण की आवाज़ से पढ़ता है।

### इस repository में: ऐप्लिकेशन, आवाज़ों के बिना

कोड पहले से रिकॉर्ड की गई क्लिप चला सकता है और उन्हें बनाने वाली pipeline भी इसमें शामिल है। क्लिप और provider keys इसमें शामिल नहीं हैं: कोई fork या स्थानीय इंस्टॉलेशन उपकरण की आवाज़ से पढ़ता है।

- **स्वचालित फ़ॉलबैक** वाक्य-दर-वाक्य उपकरण की आवाज़ पर होता है: क्लिप अनुपस्थित हो या उसमें त्रुटि हो, ब्राउज़र प्लेबैक अस्वीकार कर दे, क्लिप 1.5 सेकंड में शुरू न हो, या क्लिप cache में न रहते हुए उपकरण ऑफ़लाइन हो।
- **सेटिंग्स**: ऊपरी बार का आवाज़ बटन पढ़ने की सुविधा चालू या बंद करता है; “रिकॉर्ड की गई आवाज़” चेकबॉक्स (सुलभता और नियंत्रण) रिकॉर्ड की गई आवाज़ और उपकरण की आवाज़ के बीच चयन करता है। यह केवल उन भाषाओं में दिखाई देता है जिनके लिए कोई आवाज़ प्रकाशित की गई है।
- **ऑफ़लाइन**: पहले सुनी गई क्लिप cache में बनी रहती हैं (service worker)।
- **खेल क्लिप कहाँ खोजता है**: `<meta name="leapmultix-voice-base">` टैग में, जो repository में खाली है। केवल production deployment इसमें `/voice/` लिखता है।

अपने कंप्यूटर पर उपलब्ध क्लिप के साथ (नीचे दी गई pipeline से बनाई गई और खेल के पास `../leapmultix-voices` में रखी गई), `?voix=local` पैरामीटर development server से उन्हें चलवाता है:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org पर: होस्ट की गई आवाज़ें

लेखक द्वारा उपलब्ध कराई गई साइट रिकॉर्ड की गई synthetic आवाज़ें प्रस्तुत करती है:

- फ़्रेंच में **Lucie**, ElevenLabs (Eleven v3 मॉडल) से बनाई गई;
- ब्रिटिश अंग्रेज़ी और स्पेन की स्पेनिश में **Sulafat**, Google Cloud Text-to-Speech (Chirp 3 HD आवाज़) से बनाई गई;
- खिलाड़ी की पसंद पर तीनों भाषाओं में एक ही आवाज़ बनाए रखने के लिए फ़्रेंच में **Sulafat**;
- खिलाड़ी की पसंद पर फ़्रेंच में **Marie** और अंग्रेज़ी में **Jane**, जो Mistral AI (Voxtral TTS) से बनाई गई हैं।

क्लिप एक निजी repository और समर्पित S3 bucket में रखी जाती हैं, जिन्हें CloudFront द्वारा `/voice/*` पर प्रस्तुत किया जाता है। वे एक बार बनाई जाती हैं: खेल के दौरान इन सेवाओं को कुछ भी नहीं भेजा जाता। सेटिंग्स में “आवाज़” मेन्यू किसी भाषा में एकाधिक आवाज़ें उपलब्ध होने पर उनके विकल्प देता है, और उल्लेख में सुनी जा रही आवाज़ की सेवा का नाम बताया जाता है।

### क्लिप बनाना

इस pipeline की script `scripts/voice/` में है और यह स्वामी के कंप्यूटर पर चलती है, सार्वजनिक CI में कभी नहीं। provider keys (Lucie के लिए ElevenLabs, Sulafat के लिए Google Cloud Text-to-Speech, तथा Marie और Jane के लिए Mistral) repository से बाहर एक `.env` फ़ाइल में रहती हैं, जिसे `node --env-file` के माध्यम से दिया जाता है: कोई key git में नहीं जाती। Claude Code skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) प्रक्रिया को चरण-दर-चरण पूरा कराता है (gates, approvals, retries); विस्तृत जानकारी [`docs/voix-enregistree.md`](docs/voix-enregistree.md) में है।

1. **अनुमान लगाएँ** कि कितने वाक्य शेष हैं और कितने characters के लिए भुगतान करना होगा (Eleven v3: प्रति character लगभग 0.53 credit; Chirp 3 HD: प्रति दस लाख characters 30 $, प्रत्येक महीने पहला दस लाख निःशुल्क; Voxtral TTS: प्रति दस लाख 16 $)।
2. **बनाएँ**। उसी command को दोबारा चलाने पर केवल शेष सामग्री बनाई जाती है। credits समाप्त होने पर script बिना कोई अधूरी लिखी फ़ाइल छोड़े व्यवस्थित रूप से रुक जाती है (code 3)। `--max-total-chars` संस्करण के कुल खर्च की सीमा तय करता है: भुगतान वाली प्रत्येक response मिलते ही एक register में दर्ज होती है, जो अचानक रुकने पर भी सुरक्षित रहता है। Google और Mistral में, जहाँ शेष राशि पढ़ने योग्य रूप में उपलब्ध नहीं होती, यही एकमात्र सुरक्षा है।
3. **जाँचें**: प्रत्येक वाक्य की अपनी क्लिप हो और प्रत्येक MP3 वैध हो। इसके बाद Whisper प्रत्येक क्लिप को स्थानीय रूप से transcribe करता है और जाँच गलत सुनी गई संख्याओं तथा असामान्य अवधि की सूचना देती है। `voice:review` एक command में Whisper, यह जाँच और सुनने वाला पेज क्रमशः चलाता है।
4. **सुनने वाले पेज** (`voice:listen`) पर चिह्नित क्लिप और स्त्रीलिंग रूपों (“एक गुणा 7”) का एक नमूना **सुनें**, जिन्हें Whisper अलग नहीं पहचानता। प्रत्येक क्लिप में “फिर से बनाएँ” चेकबॉक्स होता है, जो उसे अस्वीकृत क्लिप की सूची में जोड़ देता है।
5. अस्वीकृत क्लिप (`--redo`) **फिर से बनाएँ**, Whisper दोबारा चलाएँ, फिर दूसरे पेज पर प्रत्येक क्लिप के पहले और बाद के संस्करण की तुलना करें। दो या तीन प्रयासों के बाद भी गलत उच्चारित क्लिप को `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`) में एक निर्धारित टेक्स्ट दिया जाता है, उदाहरण के लिए संख्या को शब्दों में लिखा जाता है।
6. क्लिप **प्रकाशित करें**, जाँचें कि वे ऑनलाइन उपलब्ध हैं, फिर भाषा का index प्रकाशित करें, पहले परीक्षकों के लिए (`?voix=test`)।
7. आवाज़ को सभी के लिए **उपलब्ध करें**, फिर उसे डिफ़ॉल्ट रूप से सक्रिय करें। आपात स्विच (`voice:publish -- remove`) किसी भाषा को index से हटा देता है: खेल उपकरण की आवाज़ पर लौट जाता है।

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

### नियम: बोले जाने वाले वाक्य में बदलाव होने पर production में भेजने से पहले उसे दोबारा रिकॉर्ड करें

बोला जाने वाला प्रत्येक वाक्य अनुवादों (`assets/translations/{fr,en,es}.json`) से आता है और corpus का हिस्सा होता है। इसलिए किसी बोले जाने वाले वाक्य को बदलने पर corpus lock test (`scripts/voice/corpus.lock.json`) विफल हो जाता है। जिस भाषा की रिकॉर्ड की गई आवाज़ उपलब्ध है, उसके लिए बदले गए वाक्यों की क्लिप बनाई जाती हैं, उनकी जाँच की जाती है और उन्हें सुना जाता है, फिर merge करने से **पहले** प्रकाशित किया जाता है। अंत में lock अपडेट किया जाता है (`npm run voice:corpus:lock`)। इन क्लिप के बिना बदला गया वाक्य उपकरण की आवाज़ से पढ़ा जाता है।

## 📊 डेटा संग्रहण

### उपयोगकर्ता डेटा

- प्रोफ़ाइल और प्राथमिकताएँ
- प्रत्येक खेल मोड की प्रगति
- arcade खेलों के स्कोर और आँकड़े
- वैयक्तिकरण सेटिंग्स

### तकनीकी सुविधाएँ

- fallbacks सहित स्थानीय संग्रहण (localStorage)
- प्रोफ़ाइल के अनुसार व्यवस्थित खेल डेटा (प्रत्येक गणना के आँकड़े उपकरण पर साझा रहते हैं)
- प्रगति का स्वचालित बैकअप
- पुराने डेटा का स्वचालित माइग्रेशन

## 🐛 समस्या की रिपोर्ट करें

समस्याओं की रिपोर्ट GitHub issues के माध्यम से की जा सकती है। कृपया यह जानकारी शामिल करें:

- समस्या का विस्तृत विवरण
- उसे दोहराने के चरण
- ब्राउज़र और संस्करण
- प्रासंगिक होने पर स्क्रीनशॉट

## 💝 परियोजना का समर्थन करें

**[☕ PayPal के माध्यम से दान करें](https://paypal.me/jls)**

## 📄 लाइसेंस

यह परियोजना AGPL v3 लाइसेंस के अंतर्गत है। अधिक जानकारी के लिए `LICENSE` फ़ाइल देखें।

---

_LeapMultix — चार मूल गणितीय संक्रियाएँ सीखने के लिए मुक्त शैक्षिक ऐप्लिकेशन_

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
[![गुणवत्ता गेट की स्थिति](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![विश्वसनीयता रेटिंग](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![सुरक्षा रेटिंग](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![रखरखाव-योग्यता रेटिंग](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![तकनीकी ऋण](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![बग](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![कमज़ोरियाँ](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![कोड की समस्याएँ](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
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
- [डेटा संग्रहण](#-data-संग्रहण)
- [समस्या की रिपोर्ट करें](#-समस्या-की-सूचना-दें)
- [लाइसेंस](#-license)

## विवरण

LeapMultix 6 से 12 वर्ष के बच्चों के लिए एक संवादात्मक शैक्षिक वेब एप्लिकेशन है, जो उन्हें चार अंकगणितीय संक्रियाओं में दक्ष बनाता है: गुणा (×), जोड़ (+), घटाव (−) और भाग (÷)। यह सहज, सुलभ और बहुभाषी इंटरफ़ेस में **6 गेम मोड** और **4 आर्केड मिनी-गेम** प्रदान करता है।

**बहु-संक्रिया समर्थन:** सभी मोड चारों संक्रियाओं का समर्थन करते हैं। चयन होम स्क्रीन पर किया जाता है और पूरी गतिविधि के दौरान लागू रहता है।

**डेवलपर:** Julien LS (contact@jls42.org)

**ऑनलाइन URL:** https://leapmultix.jls42.org/

## 📸 अवलोकन

### स्क्रीन

|                                                                                                                          |                                                                                                             |
| :----------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
|                       ![« कौन खेल रहा है? » स्क्रीन: प्रोफ़ाइल का चयन](docs/media/01-accueil.webp)                       |                    ![मुख्य मेन्यू: संक्रिया और गेम मोड का चयन](docs/media/02-menu.webp)                     |
|                   **कौन खेल रहा है?** — प्रत्येक बच्चे के लिए उसके अवतार और प्रगति सहित एक प्रोफ़ाइल।                    |                        **मेन्यू** — यहाँ पहले संक्रिया और फिर गेम मोड चुना जाता है।                         |
|                 ![खोज मोड: 4 का पहाड़ा बिंदुओं के रूप में दिखाया गया है](docs/media/03-decouverte.webp)                  |           ![क्विज़ मोड: गलत उत्तर लाल रंग में और सही उत्तर हरे रंग में](docs/media/04-quiz.webp)            |
|        **खोज** — प्रत्येक समानता को बिंदुओं, छलाँगों या गिनती के रूप में, पहाड़े की तरकीब के साथ दिखाया जाता है।         | **क्विज़** — बच्चे का चयन सही उत्तर के पास दिखाई देता रहता है और व्याख्या गणना का विस्तार से वर्णन करती है। |
|                            ![चुनौती मोड: उलटी गिनती और जारी सिलसिला](docs/media/05-defi.webp)                            |           ![साहसिक मोड: दस स्तरों का मानचित्र, आगे के स्तर लॉक हैं](docs/media/06-aventure.webp)            |
|               **चुनौती** — समय के विरुद्ध दौड़। गलती होने पर सही उत्तर पढ़ने के समय तक टाइमर रुक जाता है।                |                      **साहसिक** — दस स्तर, जो सितारों के बदले एक के बाद एक खुलते हैं।                       |
|                       ![टाइम ट्रायल मोड: घटाव की दौड़, टाइमर और प्रगति](docs/media/14-chrono.webp)                       |                          ![आर्केड मेन्यू: चार मिनी-गेम](docs/media/07-arcade.webp)                          |
| **टाइम ट्रायल** — चुनी गई संक्रिया में समय के विरुद्ध दस सही उत्तर; छूटी हुई गणनाएँ पुनरावलोकन की सूची में चली जाती हैं। |                         **आर्केड** — कठिनाई समायोजन और यान चयन के साथ चार मिनी-गेम।                         |
|    ![डैशबोर्ड: प्रत्येक मोड के खेल, रिकॉर्ड और उत्तर, संक्रिया के अनुसार विस्तृत](docs/media/08-tableau-de-bord.webp)    |                  ![वैयक्तिकरण: अवतार, थीम और सुलभता](docs/media/09-personnalisation.webp)                   |
|   **डैशबोर्ड** — प्रत्येक मोड के खेल और रिकॉर्ड, संक्रिया के अनुसार विस्तृत; गुणा में सितारे और दोहराने योग्य पहाड़े।    |     **वैयक्तिकरण** — सिक्कों से अनलॉक किए जाने वाले अवतार, रंग थीम, टेक्स्ट का आकार और उच्च कंट्रास्ट।      |

### आर्केड मिनी-गेम

चार गेम एक ही प्रश्न पूछते हैं — जो खेल क्षेत्र के ऊपर शेष समय और जीवनों के साथ
दिखाई देता है — लेकिन हर बार अलग क्रिया की माँग करते हैं।

|                                                                                                                          |                                                                                                   |
| :----------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
|          ![MultiInvaders: संख्याएँ धारण किए राक्षस और स्क्रीन के नीचे एक यान](docs/media/10-multiinvaders.webp)          | ![MultiMiam: एक भूलभुलैया जिसमें गोलियों पर संभावित उत्तर लिखे हैं](docs/media/11-multimiam.webp) |
| **MultiInvaders** — गलत उत्तरों पर गोली चलाएँ और सही उत्तर को छोड़ दें: उसके पीछे मुक्त किया जाने वाला एक मित्र छिपा है। |        **MultiMiam** — राक्षसों से बचते हुए सही परिणाम पकड़ने के लिए भूलभुलैया में घूमें।         |
|      ![MultiMemory: कार्डों का ग्रिड, दो पलटे हुए कार्डों पर एक गणना और एक संख्या](docs/media/12-multimemory.webp)       |      ![MultiSnake: घास के मैदान में एक साँप और क्रमांकित सेब](docs/media/13-multisnake.webp)      |
|                     **MultiMemory** — याद करके पता लगाएँ कि किस कार्ड पर पलटी गई गणना का परिणाम है।                      |                **MultiSnake** — सही संख्याओं को निगलकर बढ़ें और बाकी सभी से बचें।                 |

## ✨ विशेषताएँ

### 🎮 गेम मोड

- **खोज मोड**: प्रत्येक संक्रिया के अनुकूल दृश्यात्मक और संवादात्मक अन्वेषण
- **क्विज़ मोड**: चारों संक्रियाओं (×, +, −, ÷) के समर्थन और अनुकूली प्रगति वाले बहुविकल्पीय प्रश्न
- **चुनौती मोड**: चारों संक्रियाओं (×, +, −, ÷) और विभिन्न कठिनाई स्तरों के साथ समय के विरुद्ध दौड़
- **साहसिक मोड**: चारों संक्रियाओं के समर्थन के साथ स्तरों में कथात्मक प्रगति
- **टाइम ट्रायल मोड**: अपना सर्वोत्तम समय सुधारने के लिए बिना रुके चलते टाइमर के विरुद्ध 10 सही उत्तर, चारों संक्रियाओं (×, +, −, ÷) के साथ

### 🕹️ आर्केड मिनी-गेम

- **MultiInvaders**: शैक्षिक Space Invaders - गलत उत्तरों को नष्ट करें
- **MultiMiam**: गणितीय Pac-Man - सही उत्तर एकत्र करें
- **MultiMemory**: स्मृति गेम - संक्रियाओं और परिणामों का मिलान करें
- **MultiSnake**: शैक्षिक Snake - सही संख्याएँ खाकर बढ़ें

### ➕ बहु-संक्रिया समर्थन

LeapMultix **सभी मोड में** चारों अंकगणितीय संक्रियाओं का संपूर्ण अभ्यास प्रदान करता है:

| मोड         | ×   | +   | −   | ÷   |
| ----------- | --- | --- | --- | --- |
| क्विज़      | ✅  | ✅  | ✅  | ✅  |
| चुनौती      | ✅  | ✅  | ✅  | ✅  |
| खोज         | ✅  | ✅  | ✅  | ✅  |
| साहसिक      | ✅  | ✅  | ✅  | ✅  |
| टाइम ट्रायल | ✅  | ✅  | ✅  | ✅  |
| आर्केड      | ✅  | ✅  | ✅  | ✅  |

### 🌍 सर्वव्यापी विशेषताएँ

- **बहु-उपयोगकर्ता**: प्रत्येक बच्चे के लिए उसकी प्रगति सहित एक प्रोफ़ाइल; कक्षा के कंप्यूटर पर नाम क्रमबद्ध रहते हैं, 10 खिलाड़ियों से फ़िल्टर उपलब्ध होता है, 30 दिनों की रीसायकल बिन मिलती है और खिलाड़ियों को फ़ाइल में सहेजा जा सकता है
- **बहुभाषी**: फ़्रेंच, अंग्रेज़ी और स्पेनी का समर्थन
- **वैयक्तिकरण**: अवतार (पहला पसंद से, बाकी खेलकर कमाए गए सिक्कों से अनलॉक होते हैं, प्रत्येक के लिए 50 सिक्के), रंग थीम और पृष्ठभूमियाँ
- **सुलभता**: पूर्ण कीबोर्ड नेविगेशन, टच समर्थन, आर्केड में विराम, टेक्स्ट का आकार और उच्च कंट्रास्ट; axe-core से जाँचा गया, परीक्षण की गई स्क्रीनों पर WCAG स्तर A या AA का कोई उल्लंघन नहीं
- **रिकॉर्ड की गई आवाज़**: गेम पहले से रिकॉर्ड की गई संश्लेषित आवाज़ में प्रश्न और प्रोत्साहन पढ़ सकता है तथा अपने-आप डिवाइस की आवाज़ का सहारा लेता है। आवाज़ें इस रिपॉज़िटरी में नहीं हैं: leapmultix.jls42.org साइट फ़्रेंच में Lucie, अंग्रेज़ी और स्पेनी में Sulafat उपलब्ध कराती है तथा फ़्रेंच में Sulafat और Marie में से, और अंग्रेज़ी में Jane का विकल्प देती है ([रिकॉर्ड की गई आवाज़](#-रिकॉर्ड-की-गई-आवाज़) देखें)
- **मोबाइल रेस्पॉन्सिव**: टैबलेट और स्मार्टफ़ोन के लिए अनुकूलित इंटरफ़ेस
- **प्रगति प्रणाली**: प्रत्येक प्रोफ़ाइल का डैशबोर्ड (खेल, रिकॉर्ड और दोहराने योग्य पहाड़े, संक्रिया के अनुसार विस्तृत), बैज, दैनिक चुनौतियाँ और सिक्के (टाइम ट्रायल, साहसिक, चुनौती और आज की चुनौती में)

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

### तकनीकी आर्किटेक्चर

**आधुनिक ES6 मॉड्यूल**: परियोजना ES6 क्लास और मूल imports/exports वाले मॉड्यूलर आर्किटेक्चर का उपयोग करती है।

**पुनः उपयोग योग्य कंपोनेंट**: केंद्रीकृत UI कंपोनेंट (TopBar, InfoBar, Dashboard, Customization) से निर्मित इंटरफ़ेस।

**Lazy Loading**: आरंभिक प्रदर्शन को अनुकूलित करने के लिए `lazy-loader.js` के माध्यम से आवश्यकतानुसार मॉड्यूल की बुद्धिमत्तापूर्ण लोडिंग।

**एकीकृत संग्रहण प्रणाली**: fallbacks सहित LocalStorage के माध्यम से उपयोगकर्ता डेटा को स्थायी रखने के लिए केंद्रीकृत API।

**केंद्रीकृत ऑडियो प्रबंधन**: बहुभाषी समर्थन और प्रत्येक उपयोगकर्ता की प्राथमिकताओं के साथ ध्वनि नियंत्रण।

**Event Bus**: रखरखाव-योग्य आर्किटेक्चर के लिए कंपोनेंटों के बीच पृथक इवेंट-आधारित संचार।

**स्लाइड-आधारित नेविगेशन**: `goToSlide()` के साथ क्रमांकित स्लाइडों (slide0, slide1 आदि) पर आधारित नेविगेशन प्रणाली।

**सुरक्षा**: सभी DOM परिचालनों के लिए `security-utils.js` के माध्यम से XSS सुरक्षा और sanitization।

## 🎯 गेम मोड का विस्तृत विवरण

### खोज मोड

प्रत्येक संक्रिया के अनुकूल दृश्यात्मक अन्वेषण इंटरफ़ेस, जिसमें शामिल हैं:

- गुणा का संवादात्मक दृश्यांकन
- एनिमेशन और स्मृति-सहायक संकेत
- शैक्षिक ड्रैग-एंड-ड्रॉप
- प्रत्येक पहाड़े के अनुसार स्वतंत्र प्रगति

### क्विज़ मोड

बहुविकल्पीय प्रश्न, जिनमें शामिल हैं:

- प्रत्येक सत्र में 10 प्रश्न
- सफलताओं के अनुसार अनुकूली प्रगति
- वर्चुअल संख्यात्मक कीपैड
- streak प्रणाली (लगातार सही उत्तरों का सिलसिला)

### चुनौती मोड

समय के विरुद्ध दौड़, जिसमें शामिल हैं:

- कठिनाई के 3 स्तर (शुरुआती, मध्यम, कठिन)
- सही उत्तरों के लिए अतिरिक्त समय
- जीवन प्रणाली
- सर्वोच्च स्कोर की रैंकिंग

### साहसिक मोड

कथात्मक प्रगति, जिसमें शामिल हैं:

- अनलॉक किए जा सकने वाले 10 विषयगत स्तर
- दृश्यात्मक प्रगति वाला संवादात्मक मानचित्र
- पात्रों वाली तल्लीनकारी कहानी
- सितारों और पुरस्कारों की प्रणाली

### टाइम ट्रायल मोड

बिना रुके चलते टाइमर के विरुद्ध यथासंभव तेज़ी से दस सही उत्तर:

- चारों संक्रियाएँ: गुणा के पहाड़े (पहाड़ा सेटिंग में निर्धारित), और
  जोड़ (7 + k), घटाव ((7 + k) − 7) तथा भाग ((7 × k) ÷ 7) के सभी पहाड़े
- विकल्पों या संख्यात्मक कीपैड से उत्तर, क्लिक और कीबोर्ड दोनों द्वारा
- प्रत्येक संक्रिया के अनुसार सर्वोत्तम समय, औसत समय और हाल के खेलों का ग्राफ़
- « मेरी दोहराने योग्य गणनाएँ »: प्रत्येक संक्रिया की एक सूची, जिसका दोनों दिशाओं में अभ्यास होता है (6 × 7 और 7 × 6,
  15 − 7 और 15 − 8)

### डैशबोर्ड

प्रत्येक प्रोफ़ाइल के अनुसार बच्चे ने वास्तव में क्या खेला:

- साहसिक के सितारे और दोहराने योग्य गुणा के पहाड़े (प्रत्येक पहाड़े के अंतिम 20 उत्तर)
- क्विज़, चुनौती, साहसिक और टाइम ट्रायल में प्रश्न और सही उत्तर
- प्रत्येक मोड और प्रत्येक मिनी-गेम के खेल और रिकॉर्ड, छोड़े गए खेलों सहित, संक्रिया के अनुसार विस्तृत
  जैसे ही बच्चा एक से अधिक संक्रियाओं का अभ्यास करता है

### आर्केड मिनी-गेम

प्रत्येक मिनी-गेम में शामिल हैं:

- चारों संक्रियाओं में कठिनाई के तीन स्तर
- जीवन और स्कोर प्रणाली
- माउस, कीबोर्ड और उँगली से नियंत्रण, जिनका वर्णन गेम की जानकारी में है
- विराम: समय के पास वाला बटन या P कुंजी; टैब
  छिपने पर भी गेम रुक जाता है और कभी अपने-आप पुनः आरंभ नहीं होता
- MultiMemory: विकल्प के रूप में बिना समय-सीमा वाला खेल
- उपलब्ध स्थान के अनुरूप बोर्ड (पोर्ट्रेट मोड वाले फ़ोन पर चौड़ाई से अधिक ऊँचा) और पूर्ण स्क्रीन,
  कंप्यूटर तथा फ़ोन दोनों पर, फ़ोन घुमाने पर भी (iPhone को छोड़कर, जिसका ब्राउज़र
  इसकी अनुमति नहीं देता)
- प्रत्येक खिलाड़ी के सर्वोत्तम स्कोर; « रीसेट करें » स्पष्ट रूप से बताता है कि वह क्या-क्या मिटाता है

## 🔧 विकास

### विकास वर्कफ़्लो

**कभी भी सीधे main पर commit न करें।** परियोजना
फ़ीचर शाखाओं के माध्यम से काम करती है।

**1. एक शाखा बनाएँ**, फ़ीचर के लिए `feat/`, सुधार के लिए `fix/`:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. विकसित करें और जाँचें।** फ़ॉर्मेटिंग सबसे पहले आती है: CI परीक्षण
चलाने से पहले ही इसे अस्वीकार कर देता है।

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. शाखा पर commit करें**, फिर उसे push करें:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. एक pull request खोलें** और विश्लेषणों की प्रतीक्षा करें: verify, Codacy,
CodeFactor और SonarCloud। merge करने से पहले सभी जाँचों के सफल होने तक सुधार करें।

**Commit शैली**: संक्षिप्त संदेश, आदेशात्मक शैली में (उदाहरण: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: प्रत्येक commit से पहले सुनिश्चित करें कि `npm run lint`, `npm test` और `npm run test:coverage` सफल हों

### कंपोनेंट आर्किटेक्चर

**GameMode (आधार क्लास)**: सभी मोड मानकीकृत विधियों वाली एक साझा क्लास से विरासत लेते हैं।

**GameModeManager**: मोड आरंभ करने और प्रबंधित करने का केंद्रीकृत संयोजन।

**UI कंपोनेंट**: TopBar, InfoBar, Dashboard और Customization एक सुसंगत इंटरफ़ेस प्रदान करते हैं।

**Lazy Loading**: आरंभिक प्रदर्शन को अनुकूलित करने के लिए मॉड्यूल आवश्यकतानुसार लोड किए जाते हैं।

**Event Bus**: इवेंट प्रणाली के माध्यम से कंपोनेंटों के बीच पृथक संचार।

### परीक्षण

परियोजना में एक संपूर्ण परीक्षण सुइट शामिल है:

- core मॉड्यूलों के यूनिट परीक्षण
- कंपोनेंटों के एकीकरण परीक्षण
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

- **Rollup**: code-splitting और sourcemaps के साथ `js/main-es6.js` को ESM में bundle करता है
- **Terser**: अनुकूलन के लिए स्वचालित minification
- **Post-build**: `css/` और `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` की प्रतिलिपि तथा `dist/index.html` को hash किए गए entry file की ओर पुनर्लेखित करना (उदाहरण: `main-es6-*.js`)
- **अंतिम फ़ोल्डर**: स्थिर रूप से प्रस्तुत किए जाने के लिए तैयार `dist/`

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### सतत एकीकरण

**GitHub Actions**: `.github/workflows/ci.yml`, `main` पर प्रत्येक push और प्रत्येक pull request पर सक्रिय होता है।

**`verify`** — अनिवार्य गुणवत्ता द्वार:

- `npm ci` फिर `npm run verify` (ESLint, Jest परीक्षण, कवरेज)
- `npm run format:check` (Prettier)

**`seo-report`** — `verify` के बाद: ऑनलाइन साइट का Lighthouse ऑडिट, ताकि समय के साथ SEO मेट्रिक्स पर नज़र रखी जा सके।

**बाहरी विश्लेषण** pull requests से जुड़े हैं: Codacy, CodeFactor और SonarCloud। SonarCloud द्वार नए कोड की विश्वसनीयता, सुरक्षा और रखरखाव-योग्यता में A ग्रेड की माँग करता है।

**परिनियोजन**: `./deploy.sh` साइट को S3 से समकालित करता है और CloudFront cache को अमान्य करता है। आवश्यकता होने पर script उन responsive images को फिर से बनाती है जो git में मौजूद नहीं हैं।

### PWA (Progressive Web App)

LeapMultix पूर्ण PWA है, जिसमें offline समर्थन और स्थापना की सुविधा है।

**Service Worker** (`sw.js`):

- स्थापना: खेल के लिए आवश्यक हर चीज़ को पहले से लोड करना; सूची `scripts/precache-list.mjs` द्वारा code से बनाई जाती है (`npm run precache:update`, परीक्षणों द्वारा सत्यापित): पहली बार आने के बाद सभी 6 modes और 4 Arcade खेल offline शुरू होते हैं
- नेविगेशन: Network-first; offline होने पर cache में मौजूद खेल का पृष्ठ (कभी cache न किए गए पृष्ठ के लिए केवल `offline.html`)
- Images: Cache-first; offline होने पर उसी sprite का कोई अन्य आकार या उसी avatar की कोई अन्य पृष्ठभूमि
- अनुवाद: पृष्ठभूमि में अद्यतन के लिए Stale-while-revalidate
- JS/CSS: हमेशा नवीनतम version उपलब्ध कराने के लिए Network-first, offline cache के साथ
- ध्वनियाँ और fonts: Cache-first, byte ranges उपलब्ध कराई जाती हैं (Safari audio player)
- `cache-updater.js` के माध्यम से स्वचालित version प्रबंधन

**Manifest** (`manifest.json`):

- सभी devices के लिए SVG और PNG icons
- mobile पर स्थापना संभव (Add to Home Screen)
- app-जैसे अनुभव के लिए standalone configuration
- themes और colors का समर्थन

**स्थानीय रूप से offline mode का परीक्षण करें।** Server शुरू करें, फिर `http://localhost:8080` (या दिखाया गया port) खोलें:

```bash
npm run serve
```

हाथ से: पृष्ठ को तब तक खुला रखें जब तक service worker खेल को पंजीकृत न कर ले, server बंद करें (या device का network बंद कर दें), फिर पृष्ठ को refresh करें। खेल दिखाई देना चाहिए और प्रत्येक mode शुरू होना चाहिए।

Puppeteer के साथ स्वचालित रूप से:

```bash
npm run test:pwa-offline
```

**Service Worker प्रबंधन scripts**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### गुणवत्ता मानक

**Code गुणवत्ता के tools**:

- **ESLint**: flat config (`eslint.config.js`) के साथ आधुनिक configuration, ES2022 समर्थन
- **Prettier**: स्वचालित code formatting (`.prettierrc`)
- **Stylelint**: CSS validation (`.stylelintrc.json`)
- **JSDoc**: coverage analysis के साथ functions का स्वचालित documentation

**महत्वपूर्ण code नियम**:

- उपयोग न किए गए variables और parameters हटाएँ (`no-unused-vars`)
- विशिष्ट error handling का उपयोग करें (खाली catch नहीं)
- `security-utils.js` functions के पक्ष में `innerHTML` से बचें
- Functions के लिए cognitive complexity < 15 बनाए रखें
- जटिल functions को छोटे helpers में निकालें

**सुरक्षा**:

- **XSS सुरक्षा**: `security-utils.js` के functions का उपयोग करें:
  - `innerHTML` के बजाय `appendSanitizedHTML()`
  - सुरक्षित elements बनाने के लिए `createSafeElement()`
  - text content के लिए `setSafeMessage()`
- **बाहरी scripts**: `crossorigin="anonymous"` attribute अनिवार्य है
- **Input validation**: बाहरी data को हमेशा sanitize करें
- **Content Security Policy**: script sources को सीमित करने के लिए CSP headers

**अभिगम्यता**:

- WCAG 2.1 स्तर AA का लक्ष्य, axe-core से जाँचा गया: स्तर A या AA अथवा best practices का कोई उल्लंघन नहीं
- पूर्ण keyboard navigation
- ARIA roles और सुलभ नाम
- axe-core द्वारा सत्यापित contrasts

**प्रदर्शन**:

- `lazy-loader.js` के माध्यम से modules की Lazy loading
- CSS optimizations और responsive assets
- बुद्धिमत्तापूर्ण caching के लिए Service Worker
- Production में code splitting और minification

## 📱 संगतता

### समर्थित browsers

Interface colors के लिए `oklch()` और contextual states के लिए `:has()` पर निर्भर करता है, जिससे न्यूनतम versions ये निर्धारित होते हैं:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Devices

- **Desktop**: Keyboard और mouse controls
- **Tablets**: अनुकूलित touch interface
- **Smartphones**: अनुकूलनशील responsive design

### अभिगम्यता

- पूर्ण keyboard navigation: Tab, उत्तर grids और MultiMemory cards में arrow keys, Enter, Escape; मुख्य पृष्ठ के ऊपर « खेल modes पर जाएँ » link
- खेल छोड़ने के लिए केवल एक नियम: « छोड़ें », Escape या top bar का कोई button एक ही प्रश्न पूछते हैं, और यदि बच्चा मना करता है तो खेल जारी रहता है
- Screen readers: प्रत्येक उत्तर अपने प्रश्न से जुड़ा है, प्रत्येक screen पर एक level 1 heading है और messages की घोषणा की जाती है
- पृष्ठ को उँगलियों से zoom किया जा सकता है (Arcade खेलों को छोड़कर); text size, high contrast, reduced animations और शुरुआती पाठकों के लिए बनाई गई Andika से व्युत्पन्न reading font
- Arcade: pause (button, P key या छिपा हुआ tab); MultiMemory में इच्छानुसार कोई time limit नहीं
- axe-core से जाँचा गया (WCAG 2.0 से 2.2, स्तर A और AA तथा best practices): desktop width वाली 40 screens और phone width (390 px) वाली 39 screens पर कोई उल्लंघन नहीं, जिसमें Night theme और high contrast शामिल हैं

## 🌍 स्थानीयकरण

पूर्ण बहुभाषी समर्थन:

- **फ़्रेंच** (डिफ़ॉल्ट भाषा)
- **अंग्रेज़ी**
- **स्पेनिश**

### अनुवाद प्रबंधन

**अनुवाद files:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n प्रबंधन scripts

**`npm run i18n:verify`** - अनुवाद keys की संगतता जाँचें

**`npm run i18n:unused`** - उपयोग न की गई अनुवाद keys सूचीबद्ध करें

**`npm run i18n:compare`** - अनुवाद files की fr.json (reference) से तुलना करें

यह script (`scripts/compare-translations.cjs`) सभी language files का synchronization सुनिश्चित करती है:

**विशेषताएँ:**

- अनुपस्थित keys का पता लगाना (fr.json में मौजूद लेकिन अन्य भाषाओं में अनुपस्थित)
- अतिरिक्त keys का पता लगाना (अन्य भाषाओं में मौजूद लेकिन fr.json में अनुपस्थित)
- खाली values की पहचान (`""`, `null`, `undefined`, `[]`)
- Types की संगतता जाँचना (string बनाम array)
- Nested JSON structures को dot notation में flatten करना (उदाहरण: `arcade.multiMemory.title`)
- विस्तृत console report बनाना
- JSON report को `docs/translations-comparison-report.json` में सहेजना

**Output का उदाहरण:**

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

- संपूर्ण user interface
- खेल निर्देश
- Error और feedback messages
- विवरण और contextual help
- Adventure mode की narrative content
- अभिगम्यता और ARIA labels

## 🔊 रिकॉर्ड की गई आवाज़

खेल प्रश्नों, प्रोत्साहनों और स्पष्टीकरणों को ऊँची आवाज़ में पढ़ता है। यह केवल वाक्यों का एक सीमित समूह बोलता है, प्रत्येक भाषा में लगभग 7,400: इसलिए उन्हें हमेशा के लिए एक बार रिकॉर्ड किया जा सकता है और फिर खेल का कोई भी हिस्सा synthesis service को call नहीं करता। Clips न होने पर खेल device की आवाज़ से पढ़ता है।

### इस repository में: application, आवाज़ों के बिना

Code पहले से रिकॉर्ड किए गए clips चला सकता है और उसमें उन्हें बनाने की पूरी प्रक्रिया शामिल है। न तो clips इसमें हैं, न providers की keys: fork या स्थानीय installation device की आवाज़ से पढ़ती है।

- **स्वचालित fallback** प्रत्येक वाक्य के लिए device की आवाज़ पर होता है: clip अनुपस्थित हो या उसमें error आए, browser playback अस्वीकार कर दे, clip 1.5 s में शुरू न हो या offline रहते हुए clip cache में न हो।
- **Settings**: top bar का voice button पढ़ना चालू या बंद करता है; « रिकॉर्ड की गई आवाज़ » checkbox (अभिगम्यता और controls) रिकॉर्ड की गई आवाज़ और device की आवाज़ में से चुनता है। यह केवल उन्हीं भाषाओं में दिखाई देता है जिनके लिए कोई आवाज़ प्रकाशित है।
- **Offline**: पहले सुने गए clips cache में बने रहते हैं (service worker)।
- **खेल clips कहाँ खोजता है**: `<meta name="leapmultix-voice-base">` tag में, जो repository में खाली है। केवल production deployment इसमें `/voice/` लिखता है।

अपने स्थानीय computer पर मौजूद clips के साथ (नीचे दी गई प्रक्रिया से बनाए गए और खेल के पास `../leapmultix-voices` में रखे गए), `?voix=local` parameter उन्हें development server से चलाता है:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### leapmultix.jls42.org पर: hosting की आवाज़ें

लेखक द्वारा प्रस्तुत site रिकॉर्ड की गई synthesized voices उपलब्ध कराती है:

- फ़्रेंच में **Lucie**, ElevenLabs (Eleven v3 model) से बनाई गई;
- ब्रिटिश अंग्रेज़ी और स्पेन की स्पेनिश में **Sulafat**, Google Cloud Text-to-Speech (Chirp 3 HD voice) से बनाई गई;
- खिलाड़ी की पसंद पर, तीनों भाषाओं में एक ही आवाज़ बनाए रखने के लिए फ़्रेंच में **Sulafat**;
- खिलाड़ी की पसंद पर फ़्रेंच में **Marie** और अंग्रेज़ी में **Jane**, Mistral AI (Voxtral TTS) से बनाई गईं।

Clips एक private repository और समर्पित S3 bucket में रहते हैं, जिन्हें CloudFront द्वारा `/voice/*` पर उपलब्ध कराया जाता है। वे एक ही बार बनाए जाते हैं: खेल के दौरान इन services को कुछ भी नहीं भेजा जाता। Settings में « आवाज़ » menu किसी भाषा में एक से अधिक आवाज़ें होने पर उन्हें प्रस्तुत करता है और उल्लेख सुनी जा रही आवाज़ की service का नाम बताता है।

### Clips बनाएँ

यह प्रक्रिया `scripts/voice/` में scripted है और मालिक के computer पर चलती है, public CI में कभी नहीं। Providers की keys (Lucie के लिए ElevenLabs, Sulafat के लिए Google Cloud Text-to-Speech, Marie और Jane के लिए Mistral) repository से बाहर `.env` file में रहती हैं, जिसे `node --env-file` के माध्यम से दिया जाता है: कोई key git में नहीं जाती। Claude Code skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) प्रक्रिया को चरण-दर-चरण पूरा करता है (द्वार, स्वीकृतियाँ, पुनः आरंभ); विवरण [`docs/voix-enregistree.md`](docs/voix-enregistree.md) में है।

1. **अनुमान लगाएँ** कि कितने वाक्य शेष हैं और कितने characters के लिए भुगतान करना होगा (Eleven v3: लगभग 0.53 credit प्रति character; Chirp 3 HD: प्रति दस लाख characters 30 $, हर महीने पहला दस लाख निःशुल्क; Voxtral TTS: प्रति दस लाख 16 $)।
2. **बनाएँ**। वही command दोबारा चलाने पर शेष कार्य जारी रहता है। Credits समाप्त होने पर script किसी आधी लिखी file को छोड़े बिना व्यवस्थित ढंग से रुकती है (code 3)। `--max-total-chars` version का कुल खर्च सीमित करता है: भुगतान किया गया प्रत्येक response मिलते ही एक register में दर्ज किया जाता है, जो अचानक रुकने पर भी सुरक्षित रहता है। Google और Mistral के यहाँ, जहाँ कोई पठनीय balance नहीं मिलता, यही एकमात्र सुरक्षा है।
3. **जाँचें**: प्रत्येक वाक्य का clip मौजूद हो और प्रत्येक MP3 मान्य हो। फिर Whisper प्रत्येक clip को स्थानीय रूप से transcribe करता है और जाँच गलत सुनी गई संख्याओं तथा असामान्य durations की सूचना देती है। `voice:review` एक command में Whisper, यह जाँच और सुनने वाला पृष्ठ क्रमशः चलाता है।
4. **सुनने वाले पृष्ठ** (`voice:listen`) पर चिह्नित clips और स्त्रीलिंग रूपों (« एक गुणा 7 ») का एक sample सुनें, जिन्हें Whisper अलग नहीं पहचानता। प्रत्येक clip में « फिर से बनाएँ » checkbox होता है, जो उसे अस्वीकृत clips की सूची में जोड़ देता है।
5. अस्वीकृत clips को **फिर से बनाएँ** (`--redo`) और Whisper दोबारा चलाएँ, फिर दूसरे पृष्ठ पर प्रत्येक clip के पहले और बाद के versions की तुलना करें। दो या तीन प्रयासों के बाद भी गलत बोले गए clip को `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`) में निर्धारित text दिया जाता है, उदाहरण के लिए संख्या को शब्दों में।
6. Clips **प्रकाशित करें**, जाँचें कि वे online उपलब्ध हैं, फिर भाषा का index प्रकाशित करें, पहले testers के लिए (`?voix=test`)।
7. आवाज़ को सभी के लिए **खोलें**, फिर उसे डिफ़ॉल्ट रूप से सक्रिय करें। Circuit breaker (`voice:publish -- remove`) किसी भाषा को index से हटा देता है: खेल device की आवाज़ पर लौट जाता है।

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

### नियम: बोले जाने वाले संशोधित वाक्य को production में भेजने से पहले फिर से रिकॉर्ड करें

प्रत्येक बोला जाने वाला वाक्य अनुवादों (`assets/translations/{fr,en,es}.json`) से आता है और corpus का हिस्सा होता है। इसलिए बोले जाने वाले वाक्य को बदलने पर corpus lock test (`scripts/voice/corpus.lock.json`) विफल हो जाता है। जिस भाषा की रिकॉर्ड की गई आवाज़ मौजूद है, उसमें प्रभावित वाक्यों के clips बनाए जाते हैं, उनकी जाँच की जाती है और उन्हें सुना जाता है, फिर merge करने से **पहले** प्रकाशित किया जाता है। अंत में lock को update किया जाता है (`npm run voice:corpus:lock`)। इन clips के बिना संशोधित वाक्य device की आवाज़ से पढ़ा जाता है।

## 📊 Data संग्रहण

### User data

- Profiles और preferences
- प्रत्येक game mode की progress
- Arcade खेलों के scores और statistics
- Personalization settings

### तकनीकी विशेषताएँ

- Fallbacks के साथ local storage (localStorage); browser से अनुरोध किया जाता है कि वह इसे स्वयं न मिटाए (`navigator.storage.persist()`)
- हटाए गए खिलाड़ियों की trash: उनके सभी data 30 दिनों तक सुरक्षित, « कौन खेल रहा है? » से restore करना संभव
- खिलाड़ियों को JSON file में save करना, इस device या किसी अन्य पर restore करना (पहले से मौजूद खिलाड़ी को कभी overwrite नहीं किया जाता)
- Game data को profile के अनुसार अलग रखना, जिसमें calculation-based statistics भी शामिल हैं: साझा computer पर एक खिलाड़ी की गलतियाँ दूसरे खिलाड़ी के प्रश्नों को प्रभावित नहीं करतीं
- Progress का स्वचालित backup
- पुराने data का स्वचालित migration

## 🐛 समस्या की सूचना दें

समस्याओं की सूचना GitHub issues के माध्यम से दी जा सकती है। कृपया शामिल करें:

- समस्या का विस्तृत विवरण
- उसे दोहराने के चरण
- Browser और version
- प्रासंगिक होने पर screenshots

## 💝 परियोजना का समर्थन करें

**[☕ PayPal के माध्यम से दान करें](https://paypal.me/jls)**

## 📄 License

यह परियोजना AGPL v3 के अंतर्गत licensed है। अधिक जानकारी के लिए `LICENSE` file देखें।

---

_LeapMultix — चार संक्रियाएँ सीखने के लिए मुक्त शैक्षिक application_

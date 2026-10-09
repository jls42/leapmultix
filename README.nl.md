<details>
<summary>Dit document is ook beschikbaar in andere talen</summary>

- [Engels](./README.en.md)
- [Spaans](./README.es.md)
- [Portugees](./README.pt.md)
- [Duits](./README.de.md)
- [Chinees](./README.zh.md)
- [Hindi](./README.hi.md)
- [Arabisch](./README.ar.md)
- [Italiaans](./README.it.md)
- [Zweeds](./README.sv.md)
- [Pools](./README.pl.md)
- [Nederlands](./README.nl.md)
- [Roemeens](./README.ro.md)
- [Japans](./README.ja.md)
- [Koreaans](./README.ko.md)

</details>

# LeapMultix

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Licentie: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy-badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate-status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Betrouwbaarheidsbeoordeling](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Beveiligingsbeoordeling](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Onderhoudbaarheidsbeoordeling](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Technische schuld](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Kwetsbaarheden](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Gedupliceerde regels (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Regels code](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## Inhoudsopgave

- [Beschrijving](#beschrijving)
- [Overzicht](#-overzicht)
- [Functies](#-functies)
- [Snel aan de slag](#-snel-aan-de-slag)
- [Architectuur](#-architectuur)
- [Gedetailleerde spelmodi](#-gedetailleerde-spelmodi)
- [Ontwikkeling](#-ontwikkeling)
- [Compatibiliteit](#-compatibiliteit)
- [Lokalisatie](#-lokalisatie)
- [Opgenomen stem](#-opgenomen-stem)
- [Gegevensopslag](#-gegevensopslag)
- [Een probleem melden](#-een-probleem-melden)
- [Licentie](#-licentie)

## Beschrijving

LeapMultix is een interactieve educatieve webapplicatie voor kinderen van 6 tot 12 jaar waarmee ze de 4 rekenbewerkingen onder de knie kunnen krijgen: vermenigvuldigen (×), optellen (+), aftrekken (−) en delen (÷). De applicatie biedt **6 spelmodi** en **4 arcade-minigames** in een intuïtieve, toegankelijke en meertalige interface.

**Ondersteuning voor meerdere bewerkingen:** alle modi ondersteunen de vier bewerkingen. De keuze wordt op het startscherm gemaakt en geldt voor het volledige traject.

**Ontwikkeld door:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## 📸 Overzicht

### De schermen

|                                                                                                                                     |                                                                                                                     |
| :---------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------: |
|                                ![Scherm ‘Wie speelt er?’: profielkeuze](docs/media/01-accueil.webp)                                 |                    ![Hoofdmenu: keuze van de bewerking en de spelmodus](docs/media/02-menu.webp)                    |
|                             **Wie speelt er?** — één profiel per kind, met een avatar en de voortgang.                              |                         **Het menu** — kies hier eerst de bewerking en daarna de spelmodus.                         |
|                     ![Ontdekkingsmodus: de tafel van 4 weergegeven met stippen](docs/media/03-decouverte.webp)                      |                ![Quizmodus: fout antwoord in rood, goed antwoord in groen](docs/media/04-quiz.webp)                 |
|           **Ontdekking** — elke gelijkheid wordt weergegeven met stippen, sprongen of tellen, samen met het tafeltrucje.            |    **Quiz** — de keuze van het kind blijft naast het juiste antwoord staan en de uitleg licht de berekening toe.    |
|                               ![Uitdagingsmodus: aftellen en huidige reeks](docs/media/05-defi.webp)                                |     ![Avontuurmodus: kaart met tien niveaus, waarbij de volgende vergrendeld zijn](docs/media/06-aventure.webp)     |
|       **Uitdaging** — race tegen de klok. Bij een fout stopt de timer tijdelijk zodat het juiste antwoord kan worden gelezen.       |                   **Avontuur** — tien niveaus die na elkaar worden geopend in ruil voor sterren.                    |
|                          ![Tijdmodus: een aftrekrace, de timer en de voortgang](docs/media/14-chrono.webp)                          |                             ![Arcademenu: de vier minigames](docs/media/07-arcade.webp)                             |
| **Tijd** — tien juiste antwoorden tegen de klok, met de gekozen bewerking; gemiste sommen komen op een lijst om opnieuw te oefenen. |         **Arcade** — vier minigames, met instelling van de moeilijkheidsgraad en keuze van het ruimteschip.         |
|     ![Dashboard: spellen, records en antwoorden van elke modus, uitgesplitst per bewerking](docs/media/08-tableau-de-bord.webp)     |             ![Personalisatie: avatars, thema's, toegankelijkheid](docs/media/09-personnalisation.webp)              |
| **Dashboard** — spellen en records van elke modus, uitgesplitst per bewerking; sterren en te herhalen tafels voor vermenigvuldigen. | **Personalisatie** — avatars die met munten kunnen worden ontgrendeld, kleurenthema, tekstgrootte en hoog contrast. |

### De arcade-minigames

Vier spellen die dezelfde vraag stellen — die boven het speelveld wordt
weergegeven, samen met de resterende tijd en de levens — maar telkens een andere
handeling vereisen.

|                                                                                                                                              |                                                                                                        |
| :------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|               ![MultiInvaders: monsters met getallen en een ruimteschip onderaan het scherm](docs/media/10-multiinvaders.webp)               | ![MultiMiam: een doolhof waarin bolletjes de mogelijke antwoorden tonen](docs/media/11-multimiam.webp) |
|          **MultiInvaders** — schiet op de foute antwoorden en spaar het juiste: daarachter zit een vriend die bevrijd moet worden.           |    **MultiMiam** — doorkruis het doolhof om het juiste resultaat te pakken en ontwijk de monsters.     |
| ![MultiMemory: een raster met kaarten, waarvan er twee zijn omgedraaid en een berekening en een getal tonen](docs/media/12-multimemory.webp) |       ![MultiSnake: een slang en genummerde appels in een weide](docs/media/13-multisnake.webp)        |
|                           **MultiMemory** — onthoud welke kaart het resultaat van de omgedraaide berekening bevat.                           |           **MultiSnake** — groei door de juiste getallen op te eten en vermijd alle andere.            |

## ✨ Functies

### 🎮 Spelmodi

- **Ontdekkingsmodus**: visuele en interactieve verkenning, aangepast aan elke bewerking
- **Quizmodus**: meerkeuzevragen met ondersteuning voor de 4 bewerkingen (×, +, −, ÷) en adaptieve voortgang
- **Uitdagingsmodus**: race tegen de klok met de 4 bewerkingen (×, +, −, ÷) en verschillende moeilijkheidsniveaus
- **Avontuurmodus**: verhalende voortgang per niveau met ondersteuning voor de 4 bewerkingen
- **Tijdmodus**: 10 juiste antwoorden tegen een timer die niet stopt, om de beste tijd te verbeteren, met de 4 bewerkingen (×, +, −, ÷)

### 🕹️ Arcade-minigames

- **MultiInvaders**: educatieve Space Invaders - Vernietig de foute antwoorden
- **MultiMiam**: wiskundige Pac-Man - Verzamel de juiste antwoorden
- **MultiMemory**: geheugenspel - Koppel bewerkingen aan resultaten
- **MultiSnake**: educatieve Snake - Groei door de juiste getallen te eten

### ➕ Ondersteuning voor meerdere bewerkingen

LeapMultix biedt in **alle modi** een volledige training van de 4 rekenbewerkingen:

| Modus      | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Uitdaging  | ✅  | ✅  | ✅  | ✅  |
| Ontdekking | ✅  | ✅  | ✅  | ✅  |
| Avontuur   | ✅  | ✅  | ✅  | ✅  |
| Tijd       | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Algemene functies

- **Meerdere gebruikers**: één profiel per kind, met de voortgang; op een computer in de klas worden voornamen gesorteerd, verschijnt vanaf 10 spelers een filter, is er een prullenbak met een bewaartermijn van 30 dagen en kunnen spelers in een bestand worden opgeslagen
- **Meertalig**: ondersteuning voor Frans, Engels en Spaans
- **Personalisatie**: avatars (de eerste is vrij te kiezen, de andere worden ontgrendeld met tijdens het spelen verdiende munten en kosten elk 50 munten), kleurenthema's en achtergronden
- **Toegankelijkheid**: volledige toetsenbordnavigatie, ondersteuning voor aanraking, pauzeren in Arcade, tekstgrootte en hoog contrast; gecontroleerd met axe-core, zonder WCAG-overtredingen van niveau A of AA op de doorlopen schermen
- **Opgenomen stem**: het spel kan vragen en aanmoedigingen voorlezen met een vooraf opgenomen synthetische stem, met automatische terugval op de stem van het apparaat. De stemmen staan niet in deze repository: de website leapmultix.jls42.org gebruikt Lucie voor Frans, Sulafat voor Engels en Spaans, en biedt voor Frans de keuze tussen Sulafat en Marie en voor Engels Jane (zie [Opgenomen stem](#-opgenomen-stem))
- **Mobiel responsive**: interface geoptimaliseerd voor tablets en smartphones
- **Voortgangssysteem**: dashboard per profiel (spellen, records en opnieuw te oefenen tafels, uitgesplitst per bewerking), badges, dagelijkse uitdagingen en munten (in Tijd, Avontuur, Uitdaging en de Uitdaging van de dag)

## 🚀 Snel aan de slag

### Vereisten

- Node.js (versie 16 of hoger)
- Een moderne webbrowser

### Installatie

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

### Beschikbare scripts

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

## 🧱 Architectuur

### Bestandsstructuur

De JavaScript-modules staan **vlak in `js/`**, op drie mappen na:
`core/`, `components/` en `modes/`. De bestandsnaam geeft dus de
groepering aan (`arcade-*`, `multimiam-*`, `i18n*`…).

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

### Technische architectuur

**Moderne ES6-modules**: het project gebruikt een modulaire architectuur met ES6-klassen en native imports/exports.

**Herbruikbare componenten**: interface gebouwd met gecentraliseerde UI-componenten (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: intelligente on-demand-lading van modules via `lazy-loader.js` om de initiële prestaties te optimaliseren.

**Uniform opslagsysteem**: gecentraliseerde API voor het persistent opslaan van gebruikersgegevens via LocalStorage met fallbacks.

**Gecentraliseerd audiobeheer**: geluidsbediening met meertalige ondersteuning en voorkeuren per gebruiker.

**Event Bus**: ontkoppelde communicatie op basis van gebeurtenissen tussen componenten voor een onderhoudbare architectuur.

**Navigatie via slides**: navigatiesysteem gebaseerd op genummerde slides (slide0, slide1 enzovoort) met `goToSlide()`.

**Beveiliging**: XSS-bescherming en sanitization via `security-utils.js` voor alle DOM-manipulaties.

## 🎯 Gedetailleerde spelmodi

### Ontdekkingsmodus

Visuele verkenningsinterface, aangepast aan elke bewerking, met:

- Interactieve visualisatie van vermenigvuldigingen
- Animaties en geheugensteuntjes
- Educatieve drag-and-drop
- Vrije voortgang per tafel

### Quizmodus

Meerkeuzevragen met:

- 10 vragen per sessie
- Adaptieve voortgang op basis van successen
- Virtueel numeriek toetsenblok
- Streak-systeem (reeks juiste antwoorden)

### Uitdagingsmodus

Race tegen de klok met:

- 3 moeilijkheidsniveaus (Beginner, Gemiddeld, Moeilijk)
- Tijdbonus voor juiste antwoorden
- Levenssysteem
- Ranglijst met de beste scores

### Avontuurmodus

Verhalende voortgang met:

- 10 ontgrendelbare thematische niveaus
- Interactieve kaart met visuele voortgang
- Meeslepend verhaal met personages
- Systeem met sterren en beloningen

### Tijdmodus

Zo snel mogelijk tien juiste antwoorden geven, tegen een timer die niet stopt:

- De vier bewerkingen: de tafels van vermenigvuldiging (ingesteld in de Tafelinstellingen), en
  alle opteltafels (7 + k), aftrektafels ((7 + k) − 7) en deeltafels ((7 × k) ÷ 7)
- Antwoorden via een keuze of het numerieke toetsenblok, door te klikken of met het toetsenbord
- Beste tijden, gemiddelde tijd en grafiek van de laatste spellen, per bewerking
- ‘Mijn sommen om opnieuw te oefenen’: één lijst per bewerking, die in beide richtingen wordt geoefend (6 × 7 en 7 × 6,
  15 − 7 en 15 − 8)

### Dashboard

Wat het kind werkelijk heeft gespeeld, profiel voor profiel:

- Sterren van Avontuur en opnieuw te oefenen tafels van vermenigvuldiging (de laatste 20 antwoorden van elke tafel)
- Vragen en juiste antwoorden in Quiz, Uitdaging, Avontuur en Tijd
- Spellen en records van elke modus en elke minigame, inclusief afgebroken spellen, uitgesplitst per bewerking
  zodra het kind meerdere bewerkingen oefent

### Arcade-minigames

Elke minigame biedt:

- Drie moeilijkheidsniveaus voor de vier bewerkingen
- Levens- en scoresysteem
- Bediening met muis, toetsenbord en vinger, beschreven op de spelpagina
- Pauze: knop naast de tijd of de P-toets; het spel pauzeert ook wanneer het tabblad
  verborgen is en wordt nooit vanzelf hervat
- MultiMemory: naar keuze een spel zonder tijdslimiet
- Speelbord dat de beschikbare ruimte benut (hoger dan breed op een telefoon in portretstand) en volledig scherm,
  zowel op een computer als een telefoon, ook wanneer de telefoon gedraaid is (behalve op een iPhone, waarvan de browser
  dit niet toestaat)
- Beste scores van elke speler; ‘Opnieuw instellen’ vermeldt alles wat wordt gewist

## 🔧 Ontwikkeling

### Ontwikkelingsworkflow

**Commit nooit rechtstreeks naar main.** Het project werkt met
featurebranches.

**1. Maak een branch**, `feat/` voor een functie, `fix/` voor een bugfix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Ontwikkel en controleer.** Opmaak komt eerst: de CI wijst deze af
voordat de tests zelfs maar worden gestart.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Commit naar de branch** en push deze vervolgens:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Open een pull request** en wacht op de analyses: verify, Codacy,
CodeFactor en SonarCloud. Los problemen op tot alles groen is voordat je samenvoegt.

**Commitstijl**: beknopte berichten in de gebiedende wijs (bijvoorbeeld: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: zorg ervoor dat `npm run lint`, `npm test` en `npm run test:coverage` slagen vóór elke commit

### Componentarchitectuur

**GameMode (basisklasse)**: alle modi erven van een gemeenschappelijke klasse met gestandaardiseerde methoden.

**GameModeManager**: gecentraliseerde orkestratie van het starten en beheren van modi.

**UI-componenten**: TopBar, InfoBar, Dashboard en Customization zorgen voor een consistente interface.

**Lazy Loading**: modules worden op aanvraag geladen om de initiële prestaties te optimaliseren.

**Event Bus**: ontkoppelde communicatie tussen componenten via het gebeurtenissysteem.

### Tests

Het project bevat een volledige testsuite:

- Unittests van de core-modules
- Integratietests van de componenten
- Tests van de spelmodi
- Geautomatiseerde codedekking

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Productiebuild

- **Rollup**: bundelt `js/main-es6.js` als ESM met code-splitting en sourcemaps
- **Terser**: automatische minification voor optimalisatie
- **Post-build**: kopieert `css/` en `assets/`, de favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, en herschrijft `dist/index.html` naar het gehashte invoerbestand (bijvoorbeeld `main-es6-*.js`)
- **Eindmap**: `dist/` klaar om statisch te worden geserveerd

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continue integratie

**GitHub Actions**: `.github/workflows/ci.yml`, geactiveerd bij elke push naar
`main` en bij elke pull request.

**`verify`** — de blokkerende kwaliteitspoort:

- `npm ci` en vervolgens `npm run verify` (ESLint, Jest-tests, dekking)
- `npm run format:check` (Prettier)

**`seo-report`** — na `verify`: Lighthouse-audit van de online website, om
de SEO-metrieken door de tijd heen te volgen.

**Externe analyses** gekoppeld aan pull requests: Codacy, CodeFactor en
SonarCloud. De SonarCloud-poort vereist beoordelingen A voor betrouwbaarheid, beveiliging en
onderhoudbaarheid van nieuwe code.

**Implementatie**: `./deploy.sh` synchroniseert de website met S3 en maakt de
CloudFront-cache ongeldig. Het script genereert indien nodig de responsieve afbeeldingen opnieuw die
niet in git staan.

### PWA (Progressive Web App)

LeapMultix is een volledige PWA met offlineondersteuning en installatiemogelijkheid.

**Service Worker** (`sw.js`):

- Installatie: vooraf laden van alles wat het spel nodig heeft, met een lijst die op basis van de code
  wordt gegenereerd door `scripts/precache-list.mjs` (`npm run precache:update`, gecontroleerd door de tests): na
  een eerste bezoek starten de 6 modi en de 4 Arcade-spellen offline
- Navigatie: Network-first; offline wordt de gecachte spelpagina gebruikt (`offline.html` alleen
  voor een pagina die nooit is opgeslagen)
- Afbeeldingen: Cache-first; offline wordt een ander formaat van dezelfde sprite of een andere achtergrond van dezelfde avatar gebruikt
- Vertalingen: Stale-while-revalidate voor updates op de achtergrond
- JS/CSS: Network-first om altijd de nieuwste versie te leveren, met een offlinecache
- Geluiden en lettertypen: Cache-first, met levering van bytebereiken (audiospeler van Safari)
- Automatisch versiebeheer via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- en PNG-pictogrammen voor alle apparaten
- Installatie mogelijk op mobiele apparaten (Add to Home Screen)
- Standalone-configuratie voor een app-achtige ervaring
- Ondersteuning voor thema's en kleuren

**De offlinemodus lokaal testen.** Start de server en open vervolgens
`http://localhost:8080` (of de weergegeven poort):

```bash
npm run serve
```

Handmatig: laat de pagina openstaan totdat de service worker het spel heeft geregistreerd, stop
de server (of verbreek de netwerkverbinding van het apparaat) en vernieuw vervolgens de pagina. Het spel moet
worden weergegeven en elke modus moet starten.

Automatisch, met Puppeteer:

```bash
npm run test:pwa-offline
```

**Scripts voor het beheer van de Service Worker**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Kwaliteitsnormen

**Tools voor codekwaliteit**:

- **ESLint**: Moderne configuratie met flat config (`eslint.config.js`), ondersteuning voor ES2022
- **Prettier**: Automatische codeopmaak (`.prettierrc`)
- **Stylelint**: CSS-validatie (`.stylelintrc.json`)
- **JSDoc**: Automatische documentatie van functies met dekkingsanalyse

**Belangrijke coderegels**:

- Ongebruikte variabelen en parameters verwijderen (`no-unused-vars`)
- Specifieke foutafhandeling gebruiken (geen lege catch-blokken)
- `innerHTML` vermijden ten gunste van `security-utils.js`-functies
- Een cognitieve complexiteit < 15 voor functies handhaven
- Complexe functies opsplitsen in kleinere helpers

**Beveiliging**:

- **XSS-bescherming**: De functies van `security-utils.js` gebruiken:
  - `appendSanitizedHTML()` in plaats van `innerHTML`
  - `createSafeElement()` om veilige elementen te maken
  - `setSafeMessage()` voor tekstinhoud
- **Externe scripts**: Attribuut `crossorigin="anonymous"` verplicht
- **Invoervalidatie**: Externe gegevens altijd saniteren
- **Content Security Policy**: CSP-headers om scriptbronnen te beperken

**Toegankelijkheid**:

- Doelstelling WCAG 2.1 niveau AA, gecontroleerd met axe-core: geen schendingen van niveau A of AA, noch van
  best practices
- Volledige toetsenbordnavigatie
- ARIA-rollen en toegankelijke namen
- Contrasten gecontroleerd met axe-core

**Prestaties**:

- Lazy loading van modules via `lazy-loader.js`
- CSS-optimalisaties en responsieve assets
- Service Worker voor intelligente caching
- Code splitting en minificatie in productie

## 📱 Compatibiliteit

### Ondersteunde browsers

De interface gebruikt `oklch()` voor kleuren en `:has()` voor
contextuele toestanden, waarmee de minimumvereisten worden bepaald:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Apparaten

- **Desktop**: Bediening met toetsenbord en muis
- **Tablets**: Geoptimaliseerde aanraakinterface
- **Smartphones**: Adaptief responsief ontwerp

### Toegankelijkheid

- Volledige toetsenbordnavigatie: Tab, pijltjestoetsen in de antwoordrasters en op de kaarten van
  MultiMemory, Enter, Escape; link ‘Naar de spelmodi’ bovenaan de startpagina
- Eén regel om een spel te verlaten: ‘Opgeven’, Escape of een knop in de bovenste balk
  stelt dezelfde vraag, en het spel gaat verder als het kind weigert
- Schermlezers: elk antwoord is gekoppeld aan de bijbehorende vraag, één kop van niveau 1 per scherm en
  meldingen worden aangekondigd
- De pagina kan met de vingers worden vergroot (buiten de Arcade-spellen); tekstgrootte, hoog contrast,
  verminderde animaties en een van Andika afgeleid leeslettertype, ontworpen voor beginnende
  lezers
- Arcade: pauze (knop, P-toets of verborgen tabblad); MultiMemory desgewenst zonder tijdslimiet
- Gecontroleerd met axe-core (WCAG 2.0 tot 2.2, niveaus A en AA en best practices): geen
  schendingen op 41 schermen met desktopbreedte en 40 met telefoonbreedte (390 px), inclusief het thema
  Nacht en hoog contrast

## 🌍 Lokalisatie

Volledige meertalige ondersteuning:

- **Frans** (standaardtaal)
- **Engels**
- **Spaans**

### Vertalingen beheren

**Vertaalbestanden:** `assets/translations/*.json`

**Indeling:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripts voor i18n-beheer

**`npm run i18n:verify`** - De consistentie van vertaalsleutels controleren

**`npm run i18n:unused`** - Ongebruikte vertaalsleutels weergeven

**`npm run i18n:compare`** - Vertaalbestanden vergelijken met fr.json (referentie)

Dit script (`scripts/compare-translations.cjs`) zorgt ervoor dat alle taalbestanden gesynchroniseerd blijven:

**Functies:**

- Ontbrekende sleutels detecteren (aanwezig in fr.json maar afwezig in andere talen)
- Extra sleutels detecteren (aanwezig in andere talen maar niet in fr.json)
- Lege waarden identificeren (`""`, `null`, `undefined`, `[]`)
- De consistentie van typen controleren (string versus array)
- Geneste JSON-structuren afvlakken tot puntnotatie (bijv. `arcade.multiMemory.title`)
- Een gedetailleerd consolerapport genereren
- Het JSON-rapport opslaan in `docs/translations-comparison-report.json`

**Voorbeeld van uitvoer:**

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

**Vertaaldekking:**

- Volledige gebruikersinterface
- Spelinstructies
- Fout- en feedbackmeldingen
- Beschrijvingen en contextuele hulp
- Verhalende inhoud van de Avontuurmodus
- Toegankelijkheids- en ARIA-labels

## 🔊 Opgenomen stem

Het spel leest vragen, aanmoedigingen en uitleg hardop voor. Het spreekt slechts een eindige verzameling zinnen uit, ongeveer 7.400 per taal: die kunnen dus voor eens en altijd worden opgenomen, zodat tijdens het spelen geen enkele externe spraaksyntheseservice wordt aangeroepen. Zonder clips leest het spel voor met de stem van het apparaat.

### In deze repository: de applicatie, zonder stemmen

De code kan vooraf opgenomen clips afspelen en bevat de pipeline waarmee ze worden gemaakt. De clips staan er niet in, evenmin als de sleutels van de providers: een fork of lokale installatie leest voor met de stem van het apparaat.

- **Automatische terugval** op de stem van het apparaat, zin voor zin: ontbrekende clip of fout in de clip, afspelen geweigerd door de browser, clip die niet binnen 1,5 s start, of offline zonder dat de clip in de cache staat.
- **Instellingen**: de stemknop in de bovenste balk schakelt het voorlezen in of uit; het selectievakje ‘Opgenomen stem’ (Toegankelijkheid en bediening) kiest tussen de opgenomen stem en de stem van het apparaat. Het verschijnt alleen voor talen waarvoor een stem is gepubliceerd.
- **Offline**: eerder beluisterde clips blijven in de cache (service worker).
- **Waar het spel naar clips zoekt**: in de tag `<meta name="leapmultix-voice-base">`, die leeg is in de repository. Alleen de productie-implementatie schrijft daar `/voice/` in.

Met uw eigen lokale clips (gemaakt met de onderstaande pipeline en naast het spel geplaatst in `../leapmultix-voices`) laat de parameter `?voix=local` ze afspelen door de ontwikkelserver:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Op leapmultix.jls42.org: de stemmen van de hosting

De door de auteur aangeboden website levert opgenomen synthetische stemmen:

- in het Frans **Lucie**, gemaakt met ElevenLabs (model Eleven v3);
- in Brits-Engels en Spaans uit Spanje **Sulafat**, gemaakt met Google Cloud Text-to-Speech (stem Chirp 3 HD);
- naar keuze van de speler **Sulafat** in het Frans, om in alle drie de talen dezelfde stem te behouden;
- eveneens naar keuze van de speler **Marie** in het Frans en **Jane** in het Engels, gemaakt met Mistral AI (Voxtral TTS).

De clips bevinden zich in een privérepository en in een aparte S3-bucket, die via CloudFront wordt aangeboden op `/voice/*`. Ze worden één keer gegenereerd: tijdens het spelen wordt niets naar deze services verzonden. In de instellingen toont het menu ‘Stem’ de stemmen voor de taal wanneer er meerdere zijn, en vermeldt de aanduiding de service van de stem die wordt gehoord.

### De clips genereren

De pipeline is vastgelegd in scripts in `scripts/voice/` en draait op de computer van de eigenaar, nooit in de openbare CI. De sleutels van de providers (ElevenLabs voor Lucie, Google Cloud Text-to-Speech voor Sulafat, Mistral voor Marie en Jane) blijven in een bestand `.env` buiten de repository, dat via `node --env-file` wordt doorgegeven: geen enkele sleutel komt in git terecht. De Claude Code-skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) doorloopt de procedure stap voor stap (poorten, goedkeuringen, hervattingen); de details staan in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Schat** het aantal resterende zinnen en het aantal betaalde tekens (Eleven v3: ongeveer 0,53 krediet per teken; Chirp 3 HD: $ 30 per miljoen tekens, waarbij het eerste miljoen van elke maand gratis is; Voxtral TTS: $ 16 per miljoen).
2. **Genereer**. Door dezelfde opdracht opnieuw uit te voeren, wordt hervat wat nog ontbreekt. Wanneer de kredieten zijn opgebruikt, stopt het script netjes (code 3) zonder een halfgeschreven bestand achter te laten. `--max-total-chars` begrenst de cumulatieve uitgaven van de versie: elk betaald antwoord wordt direct na ontvangst in een register vastgelegd, dat ook na een abrupte onderbreking behouden blijft. Bij Google en Mistral, die geen uitleesbaar saldo bieden, is dit de enige bescherming.
3. **Controleer**: elke zin heeft een clip en elke MP3 is geldig. Whisper transcribeert vervolgens elke clip lokaal, waarna de controle verkeerd begrepen getallen en abnormale speelduur meldt. `voice:review` voert Whisper, deze controle en de luisterpagina achter elkaar uit met één opdracht.
4. **Beluister** op de luisterpagina (`voice:listen`) de gemarkeerde clips en een steekproef van vrouwelijke vormen (‘één keer 7’), die Whisper niet onderscheidt. Elke clip heeft een selectievakje ‘opnieuw maken’, waarmee deze aan de lijst met afgekeurde clips wordt toegevoegd.
5. **Maak** de afgekeurde clips opnieuw (`--redo`), voer Whisper nogmaals uit en vergelijk vervolgens elke clip vóór en na op een tweede pagina. Een clip die na twee of drie pogingen nog steeds verkeerd wordt uitgesproken, krijgt een opgelegde tekst in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), bijvoorbeeld het getal voluit geschreven.
6. **Publiceer** de clips, controleer of ze online beschikbaar zijn en publiceer vervolgens de index van de taal, eerst voor de testers (`?voix=test`).
7. **Stel** de stem beschikbaar voor iedereen en activeer deze vervolgens standaard. De noodschakelaar (`voice:publish -- remove`) verwijdert een taal uit de index: het spel valt dan terug op de stem van het apparaat.

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

### Regel: een gewijzigde gesproken zin wordt opnieuw opgenomen vóór de productie-implementatie

Elke gesproken zin komt uit de vertalingen (`assets/translations/{fr,en,es}.json`) en maakt deel uit van het corpus. Het wijzigen van een gesproken zin doet daarom de vergrendelingstest van het corpus mislukken (`scripts/voice/corpus.lock.json`). Voor een taal met een opgenomen stem worden dan de clips voor de gewijzigde zinnen gegenereerd, gecontroleerd en beluisterd, waarna ze **vóór** het samenvoegen worden gepubliceerd. Ten slotte wordt de vergrendeling bijgewerkt (`npm run voice:corpus:lock`). Zonder deze clips wordt de gewijzigde zin voorgelezen met de stem van het apparaat.

## 📊 Gegevensopslag

### Gebruikersgegevens

- Profielen en voorkeuren
- Voortgang per spelmodus
- Scores en statistieken van de Arcade-spellen
- Personalisatie-instellingen

### Technische functies

- Lokale opslag (localStorage) met fallbacks; de browser wordt gevraagd deze niet
  zelf te wissen (`navigator.storage.persist()`)
- Prullenbak voor verwijderde spelers: 30 dagen met al hun gegevens, herstel via
  ‘Wie speelt er?’
- Spelers opslaan in een JSON-bestand en hervatten op dit of een ander apparaat (een
  reeds aanwezige speler wordt nooit overschreven)
- Spelgegevens per profiel opgeslagen, inclusief statistieken per rekensom: op een gedeeld apparaat beïnvloeden de fouten van de ene speler de vragen van een andere speler niet
- Automatische opslag van de voortgang
- Automatische migratie van oude gegevens

## 🐛 Een probleem melden

Problemen kunnen via GitHub Issues worden gemeld. Vermeld daarbij:

- Een gedetailleerde beschrijving van het probleem
- Stappen om het probleem te reproduceren
- Browser en versie
- Schermafbeeldingen indien relevant

## 💝 Het project steunen

**[☕ Doneren via PayPal](https://paypal.me/jls)**

## 📄 Licentie

Dit project valt onder de AGPL v3-licentie. Zie het bestand `LICENSE` voor meer informatie.

---

_LeapMultix — vrije educatieve applicatie om de vier rekenbewerkingen te leren_

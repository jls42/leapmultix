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
[![Status van de kwaliteitscontrole](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Betrouwbaarheidsscore](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Beveiligingsscore](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Onderhoudbaarheidsscore](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Technische schuld](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Kwetsbaarheden](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code smells](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Gedupliceerde regels (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Regels code](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## Inhoudsopgave

- [Beschrijving](#beschrijving)
- [Overzicht](#-overzicht)
- [Functionaliteiten](#-functionaliteiten)
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

LeapMultix is een interactieve educatieve webapplicatie voor kinderen van 6 tot 12 jaar waarmee ze de 4 rekenkundige bewerkingen leren beheersen: vermenigvuldigen (×), optellen (+), aftrekken (−) en delen (÷). De applicatie biedt **5 spelmodi** en **4 arcade-minigames** in een intuïtieve, toegankelijke en meertalige interface.

**Ondersteuning voor meerdere bewerkingen:** alle vijf modi ondersteunen de vier bewerkingen. De bewerking wordt op het startscherm gekozen en geldt voor het hele traject.

**Ontwikkeld door:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## 📸 Overzicht

### De schermen

|                                                                                                                                    |                                                                                                               |
| :--------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: |
|                                ![Scherm ‘Wie speelt er?’: profielkeuze](docs/media/01-accueil.webp)                                |                 ![Hoofdmenu: keuze van de bewerking en de vijf modi](docs/media/02-menu.webp)                 |
|                             **Wie speelt er?** — een profiel per kind, met een avatar en de voortgang.                             |              **Het menu** — hier wordt de bewerking gekozen, waarna de vijf modi worden geopend.              |
|                     ![Ontdekkingsmodus: de tafel van 4 weergegeven met punten](docs/media/03-decouverte.webp)                      |             ![Quizmodus: fout antwoord in rood, goed antwoord in groen](docs/media/04-quiz.webp)              |
|             **Ontdekking** — elke gelijkheid wordt weergegeven met punten, sprongen of tellen, samen met de tafeltruc.             | **Quiz** — de keuze van het kind blijft naast het juiste antwoord staan en de uitleg werkt de berekening uit. |
|                               ![Uitdagingsmodus: aftellen en huidige reeks](docs/media/05-defi.webp)                               |        ![Avontuurmodus: kaart met tien niveaus, de volgende vergrendeld](docs/media/06-aventure.webp)         |
| **Uitdaging** — race tegen de klok. Bij een fout wordt de chronometer stilgezet, zodat er tijd is om het juiste antwoord te lezen. |                **Avontuur** — tien niveaus die na elkaar worden geopend in ruil voor sterren.                 |
|                                    ![Arcademenu: de vier minigames](docs/media/07-arcade.webp)                                     |              ![Dashboard: sterren per tafel en statistieken](docs/media/08-tableau-de-bord.webp)              |
|                     **Arcade** — vier minigames, met een moeilijkheidsinstelling en keuze van het ruimteschip.                     |                 **Dashboard** — sterren per tafel, tafels om te herhalen en scores per modus.                 |
|                     ![Personalisatie: avatars, thema's, toegankelijkheid](docs/media/09-personnalisation.webp)                     |                                                                                                               |
|                        **Personalisatie** — avatar, kleurenthema, tekstgrootte, hoog contrast en oudercode.                        |                                                                                                               |

### De arcade-minigames

Vier spellen die dezelfde vraag stellen — de vraag die boven het speelveld wordt
weergegeven, samen met de resterende tijd en de levens — maar telkens een andere
handeling vereisen.

|                                                                                                                                          |                                                                                                         |
| :--------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|             ![MultiInvaders: monsters met getallen en een ruimteschip onderaan het scherm](docs/media/10-multiinvaders.webp)             | ![MultiMiam: een doolhof waarin bolletjes de mogelijke antwoorden dragen](docs/media/11-multimiam.webp) |
|        **MultiInvaders** — schiet op de foute antwoorden en spaar het juiste: daarachter zit een vriend die moet worden bevrijd.         |    **MultiMiam** — beweeg door het doolhof om het juiste resultaat te pakken en ontwijk de monsters.    |
| ![MultiMemory: een raster met kaarten, waarvan er twee zijn omgedraaid en een berekening en getal tonen](docs/media/12-multimemory.webp) |       ![MultiSnake: een slang en genummerde appels in een weiland](docs/media/13-multisnake.webp)       |
|                       **MultiMemory** — onthoud op welke kaart het resultaat van de omgedraaide berekening staat.                        |            **MultiSnake** — groei door de juiste getallen op te eten en vermijd alle andere.            |

## ✨ Functionaliteiten

### 🎮 Spelmodi

- **Ontdekkingsmodus**: Visuele en interactieve verkenning, aangepast aan elke bewerking
- **Quizmodus**: Meerkeuzevragen met ondersteuning voor de 4 bewerkingen (×, +, −, ÷) en adaptieve voortgang
- **Uitdagingsmodus**: Race tegen de klok met de 4 bewerkingen (×, +, −, ÷) en verschillende moeilijkheidsniveaus
- **Avontuurmodus**: Verhalende voortgang per niveau met ondersteuning voor de 4 bewerkingen

### 🕹️ Arcade-minigames

- **MultiInvaders**: Educatieve Space Invaders - Vernietig de foute antwoorden
- **MultiMiam**: Wiskundige Pac-Man - Verzamel de juiste antwoorden
- **MultiMemory**: Geheugenspel - Koppel bewerkingen aan resultaten
- **MultiSnake**: Educatieve Snake - Groei door de juiste getallen te eten

### ➕ Ondersteuning voor meerdere bewerkingen

LeapMultix biedt in **alle modi** een volledige training voor de 4 rekenkundige bewerkingen:

| Modus      | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Uitdaging  | ✅  | ✅  | ✅  | ✅  |
| Ontdekking | ✅  | ✅  | ✅  | ✅  |
| Avontuur   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Algemene functionaliteiten

- **Meerdere gebruikers**: Beheer van individuele profielen met opgeslagen voortgang
- **Meertalig**: Ondersteuning voor Frans, Engels en Spaans
- **Personalisatie**: Avatars, kleurenthema's en achtergronden
- **Toegankelijkheid**: Toetsenbordnavigatie, aanraakbediening en conformiteit met WCAG 2.1 AA
- **Opgenomen stem**: vragen en aanmoedigingen die worden voorgelezen door een vooraf opgenomen synthetische stem (gemaakt met ElevenLabs), met automatische terugval op de stem van het apparaat; clips bevinden zich buiten de openbare repository (zie [Opgenomen stem](#-opgenomen-stem))
- **Mobiel responsive**: Interface geoptimaliseerd voor tablets en smartphones
- **Voortgangssysteem**: Scores, badges en dagelijkse uitdagingen

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

## 🧱 Architectuur

### Bestandsstructuur

De JavaScript-modules staan **plat in `js/`**, met uitzondering van drie mappen:
`core/`, `components/` en `modes/`. De bestandsnaam bepaalt dus de
groepering (`arcade-*`, `multimiam-*`, `i18n*`…).

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

### Technische architectuur

**Moderne ES6-modules**: Het project gebruikt een modulaire architectuur met ES6-klassen en native imports/exports.

**Herbruikbare componenten**: Interface opgebouwd met gecentraliseerde UI-componenten (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Slim laden van modules op aanvraag via `lazy-loader.js` om de initiële prestaties te optimaliseren.

**Uniform opslagsysteem**: Gecentraliseerde API voor het persistent opslaan van gebruikersgegevens via LocalStorage met fallbacks.

**Gecentraliseerd audiobeheer**: Geluidsregeling met meertalige ondersteuning en voorkeuren per gebruiker.

**Event Bus**: Ontkoppelde gebeurteniscommunicatie tussen componenten voor een onderhoudbare architectuur.

**Navigatie via slides**: Navigatiesysteem gebaseerd op genummerde slides (slide0, slide1 enzovoort) met `goToSlide()`.

**Beveiliging**: XSS-bescherming en sanitization via `security-utils.js` voor alle DOM-bewerkingen.

## 🎯 Gedetailleerde spelmodi

### Ontdekkingsmodus

Interface voor het visueel verkennen van de tafels van vermenigvuldiging met:

- Interactieve visualisatie van vermenigvuldigingen
- Animaties en geheugensteuntjes
- Educatieve drag-and-drop
- Vrije voortgang per tafel

### Quizmodus

Meerkeuzevragen met:

- 10 vragen per sessie
- Adaptieve voortgang op basis van de resultaten
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
- Sterren- en beloningssysteem

### Arcade-minigames

Elke minigame biedt:

- Keuze van moeilijkheidsgraad en personalisatie
- Levens- en scoresysteem
- Toetsenbord- en aanraakbediening
- Individuele ranglijsten per gebruiker

## 🔧 Ontwikkeling

### Ontwikkelworkflow

**Commit nooit rechtstreeks naar main.** Het project werkt met
feature branches.

**1. Maak een branch**, `feat/` voor een functionaliteit, `fix/` voor een bugfix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Ontwikkel en controleer.** De opmaak komt eerst: de CI weigert deze
nog voordat de tests worden uitgevoerd.

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
CodeFactor en SonarCloud. Los problemen op totdat alles groen is voordat je samenvoegt.

**Commitstijl**: Beknopte berichten in de gebiedende wijs (bijvoorbeeld: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Zorg ervoor dat `npm run lint`, `npm test` en `npm run test:coverage` vóór elke commit slagen

### Componentarchitectuur

**GameMode (basisklasse)**: Alle modi erven van een gemeenschappelijke klasse met gestandaardiseerde methoden.

**GameModeManager**: Gecentraliseerde orkestratie van het starten en beheren van modi.

**UI-componenten**: TopBar, InfoBar, Dashboard en Customization bieden een consistente interface.

**Lazy Loading**: Modules worden op aanvraag geladen om de initiële prestaties te optimaliseren.

**Event Bus**: Ontkoppelde communicatie tussen componenten via het gebeurtenissysteem.

### Tests

Het project bevat een volledige testsuite:

- Unittests voor de core-modules
- Integratietests voor de componenten
- Tests voor de spelmodi
- Geautomatiseerde codedekking

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Productiebuild

- **Rollup**: Bundelt `js/main-es6.js` als ESM met code-splitting en sourcemaps
- **Terser**: Automatische minification voor optimalisatie
- **Post-build**: Kopieert `css/` en `assets/`, de favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, en herschrijft `dist/index.html` naar het gehashte entrybestand (bijvoorbeeld `main-es6-*.js`)
- **Eindmap**: `dist/` klaar om statisch te worden aangeboden

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continue integratie

**GitHub Actions**: `.github/workflows/ci.yml`, geactiveerd bij elke push naar
`main` en bij elke pull request.

**`verify`** — de blokkerende quality gate:

- `npm ci` gevolgd door `npm run verify` (ESLint, Jest-tests, dekking)
- `npm run format:check` (Prettier)

**`seo-report`** — na `verify`: Lighthouse-audit van de online website om
de SEO-statistieken in de loop van de tijd te volgen.

**Externe analyses** gekoppeld aan pull requests: Codacy, CodeFactor en
SonarCloud. De SonarCloud-gate vereist een A-score voor betrouwbaarheid, beveiliging en
onderhoudbaarheid van nieuwe code.

**Implementatie**: `./deploy.sh` synchroniseert de website met S3 en maakt de
CloudFront-cache ongeldig. Het script genereert indien nodig de responsive afbeeldingen opnieuw, die niet in git staan.

### PWA (Progressive Web App)

LeapMultix is een volledige PWA met offlineondersteuning en installatiemogelijkheid.

**Service Worker** (`sw.js`):

- Navigatie: Network-first met offlinefallback naar `offline.html`
- Afbeeldingen: Cache-first om de prestaties te optimaliseren
- Vertalingen: Stale-while-revalidate voor updates op de achtergrond
- JS/CSS: Network-first om altijd de nieuwste versie aan te bieden
- Automatisch versiebeheer via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- en PNG-pictogrammen voor alle apparaten
- Installatie mogelijk op mobiele apparaten (Add to Home Screen)
- Standalone-configuratie voor een app-achtige ervaring
- Ondersteuning voor thema's en kleuren

**Test de offlinemodus lokaal.** Start de server en open vervolgens
`http://localhost:8080` (of de weergegeven poort):

```bash
npm run serve
```

Handmatig: schakel het netwerk uit in de ontwikkelaarstools (tabblad Netwerk,
offlinemodus) en vernieuw vervolgens de pagina. `offline.html` moet worden weergegeven.

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
- **Prettier**: Automatische codeformattering (`.prettierrc`)
- **Stylelint**: CSS-validatie (`.stylelintrc.json`)
- **JSDoc**: Automatische documentatie van functies met dekkingsanalyse

**Belangrijke coderegels**:

- Ongebruikte variabelen en parameters verwijderen (`no-unused-vars`)
- Specifieke foutafhandeling gebruiken (geen lege catch-blokken)
- `innerHTML` vermijden ten gunste van `security-utils.js`-functies
- Een cognitieve complexiteit van < 15 voor functies handhaven
- Complexe functies opsplitsen in kleinere helpers

**Beveiliging**:

- **XSS-bescherming**: De functies van `security-utils.js` gebruiken:
  - `appendSanitizedHTML()` in plaats van `innerHTML`
  - `createSafeElement()` om veilige elementen te maken
  - `setSafeMessage()` voor tekstinhoud
- **Externe scripts**: Attribuut `crossorigin="anonymous"` verplicht
- **Invoervalidatie**: Externe gegevens altijd sanitizen
- **Content Security Policy**: CSP-headers om scriptbronnen te beperken

**Toegankelijkheid**:

- Conformiteit met WCAG 2.1 AA
- Volledige toetsenbordnavigatie
- Geschikte ARIA-rollen en labels
- Conforme kleurcontrasten

**Prestaties**:

- Lazy loading van modules via `lazy-loader.js`
- CSS-optimalisaties en responsieve assets
- Service Worker voor intelligente caching
- Code splitting en minificatie in productie

## 📱 Compatibiliteit

### Ondersteunde browsers

De interface gebruikt `oklch()` voor kleuren en `:has()` voor
contextuele statussen, waarmee de ondergrens wordt bepaald:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Apparaten

- **Desktop**: Bediening met toetsenbord en muis
- **Tablets**: Geoptimaliseerde aanraakinterface
- **Smartphones**: Adaptief responsive design

### Toegankelijkheid

- Volledige toetsenbordnavigatie (Tab, pijltjestoetsen, Escape)
- ARIA-rollen en labels voor schermlezers
- Conforme kleurcontrasten
- Ondersteuning voor hulptechnologieën

## 🌍 Lokalisatie

Volledige meertalige ondersteuning:

- **Frans** (standaardtaal)
- **Engels**
- **Spaans**

### Vertaalbeheer

**Vertaalbestanden:** `assets/translations/*.json`

**Formaat:**

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

- Detectie van ontbrekende sleutels (aanwezig in fr.json maar afwezig in andere talen)
- Detectie van extra sleutels (aanwezig in andere talen maar niet in fr.json)
- Identificatie van lege waarden (`""`, `null`, `undefined`, `[]`)
- Controle van typeconsistentie (string versus array)
- Afvlakken van geneste JSON-structuren naar puntnotatie (bijvoorbeeld `arcade.multiMemory.title`)
- Genereren van een gedetailleerd consolerapport
- Opslaan van het JSON-rapport in `docs/translations-comparison-report.json`

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
- Fout- en feedbackberichten
- Beschrijvingen en contextuele hulp
- Verhalende inhoud van de Avontuurmodus
- Toegankelijkheids- en ARIA-labels

## 🔊 Opgenomen stem

Het spel leest vragen, aanmoedigingen en uitleg hardop voor. In het Frans is dit **Lucie**, een synthetische stem die met ElevenLabs (model Eleven v3) is gemaakt. Het spel spreekt slechts een eindige reeks zinnen uit, ongeveer 7.400 per taal: ze zijn allemaal vooraf opgenomen en geen enkel onderdeel roept ElevenLabs aan. Voor Engels en Spaans wordt voorlopig de stem van het apparaat gebruikt.

- **Automatische fallback** naar de stem van het apparaat, per zin: ontbrekende clip of fout, afspelen geweigerd door de browser, clip die niet binnen 1,5 s start, of offline zonder de clip in de cache.
- **Instellingen**: de stemknop in de bovenste balk schakelt het voorlezen in of uit; het selectievakje ‘Opgenomen stem’ (Toegankelijkheid en bediening) kiest tussen Lucie en de stem van het apparaat.
- **Offline**: eerder beluisterde clips blijven in de cache (service worker).

### De clips staan niet in deze repository

De clips staan in een privérepository en in een speciale S3-bucket, die via CloudFront op `/voice/*` wordt aangeboden. Een fork of lokale ontwikkelomgeving gebruikt daarom de stem van het apparaat: in de repository is de tag `<meta name="leapmultix-voice-base">` leeg en alleen tijdens de productie-implementatie wordt `/voice/` erin geschreven.

Als de clips lokaal beschikbaar zijn (privérepository die naast het spel in `../leapmultix-voices` is gekloond), zorgt de parameter `?voix=local` ervoor dat de ontwikkelserver ze afspeelt:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### De clips genereren

De pipeline is gescript in `scripts/voice/` en draait op de computer van de eigenaar, nooit in de openbare CI. De ElevenLabs-sleutel blijft in een bestand `.env` buiten de repository en wordt doorgegeven via `node --env-file`: er komt geen enkele sleutel in git terecht. De Claude Code-skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) doorloopt de procedure stap voor stap (poorten, goedkeuringen, hervattingen); de details staan in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Schatten** hoeveel zinnen en te betalen tekens er nog over zijn (Eleven v3: ongeveer 0,53 krediet per teken).
2. **Genereren**. Dezelfde opdracht opnieuw uitvoeren vult aan wat nog ontbreekt. Wanneer de kredieten op zijn, stopt het script correct (code 3) zonder een halfgeschreven bestand achter te laten.
3. **Controleren**: elke zin heeft een clip en elke MP3 is geldig. Whisper transcribeert vervolgens elke clip lokaal en `voice:check` signaleert verkeerd verstane getallen en abnormale speelduur.
4. **Beluisteren** op de luisterpagina (`voice:listen` van de gesignaleerde clips en een steekproef van vrouwelijke vormen (‘één keer 7’), die Whisper niet onderscheidt. Elke clip heeft een selectievakje ‘opnieuw maken’, waarmee deze aan de lijst met afgekeurde clips wordt toegevoegd.
5. **Opnieuw maken** van de afgekeurde clips (`--redo`) en Whisper opnieuw uitvoeren, waarna elke clip voor en na wordt vergeleken op een tweede pagina. Een clip die na twee of drie pogingen nog steeds verkeerd wordt uitgesproken, krijgt een voorgeschreven tekst in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), bijvoorbeeld het getal voluit geschreven.
6. **Publiceren** van de clips, controleren of ze online bereikbaar zijn en vervolgens de taalindex publiceren, eerst voor de testers (`?voix=test`).
7. **Beschikbaar stellen** van de stem aan iedereen en deze vervolgens standaard inschakelen. De noodschakelaar (`voice:publish -- remove`) verwijdert een taal uit de index: het spel schakelt terug naar de stem van het apparaat.

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

### Regel: een gewijzigde gesproken zin wordt vóór de productie-implementatie opnieuw opgenomen

Elke gesproken zin komt uit de vertalingen (`assets/translations/{fr,en,es}.json`) en maakt deel uit van het corpus. Het wijzigen van een gesproken zin laat daarom de vergrendelingstest van het corpus (`scripts/voice/corpus.lock.json`) mislukken. Voor een taal met een opgenomen stem worden dan de clips voor de gewijzigde zinnen gegenereerd, gecontroleerd en beluisterd, waarna ze **vóór** het samenvoegen worden gepubliceerd. Ten slotte wordt de vergrendeling bijgewerkt (`npm run voice:corpus:lock`). Zonder deze clips wordt de gewijzigde zin met de stem van het apparaat voorgelezen.

## 📊 Gegevensopslag

### Gebruikersgegevens

- Profielen en voorkeuren
- Voortgang per spelmodus
- Scores en statistieken van arcadespellen
- Personalisatie-instellingen

### Technische functies

- Lokale opslag (localStorage) met fallbacks
- Isolatie van gegevens per gebruiker
- Automatisch opslaan van de voortgang
- Automatische migratie van oude gegevens

## 🐛 Een probleem melden

Problemen kunnen via GitHub issues worden gemeld. Vermeld daarbij:

- Gedetailleerde beschrijving van het probleem
- Stappen om het te reproduceren
- Browser en versie
- Schermafbeeldingen indien relevant

## 💝 Het project steunen

**[☕ Doneren via PayPal](https://paypal.me/jls)**

## 📄 Licentie

Dit project valt onder de AGPL v3-licentie. Zie het bestand `LICENSE` voor meer informatie.

---

_LeapMultix — vrije educatieve applicatie om de vier rekenbewerkingen te leren_

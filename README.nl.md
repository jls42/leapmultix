<details>
<summary>Dit document is ook beschikbaar in andere talen</summary>

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
![Licentie: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy-badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Status van de kwaliteitscontrole](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Betrouwbaarheidsbeoordeling](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Beveiligingsbeoordeling](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Onderhoudbaarheidsbeoordeling](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Technische schuld](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Kwetsbaarheden](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code smells](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Gedupliceerde regels (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Coderegels](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

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

LeapMultix is een interactieve educatieve webapplicatie voor kinderen van 6 tot 12 jaar waarmee ze de 4 rekenkundige bewerkingen onder de knie kunnen krijgen: vermenigvuldigen (×), optellen (+), aftrekken (−) en delen (÷). De applicatie biedt **5 spelmodi** en **4 arcade-minigames** in een intuïtieve, toegankelijke en meertalige interface.

**Ondersteuning voor meerdere bewerkingen:** alle vijf modi ondersteunen de vier bewerkingen. De keuze wordt gemaakt op het startscherm en geldt voor het hele traject.

**Ontwikkeld door:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## 📸 Overzicht

### De schermen

|                                                                                                                             |                                                                                                               |
| :-------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: |
|                            ![Scherm ‘Wie speelt er?’: profielkeuze](docs/media/01-accueil.webp)                             |                 ![Hoofdmenu: keuze van de bewerking en de vijf modi](docs/media/02-menu.webp)                 |
|                             **Wie speelt er?** — één profiel per kind, met avatar en voortgang.                             |                **Het menu** — kies hier de bewerking en open vervolgens een van de vijf modi.                 |
|                 ![Ontdekkingsmodus: de tafel van 4 weergegeven met stippen](docs/media/03-decouverte.webp)                  |             ![Quizmodus: fout antwoord in rood, juist antwoord in groen](docs/media/04-quiz.webp)             |
|       **Ontdekking** — elke gelijkheid wordt weergegeven met stippen, sprongen of tellingen, samen met de tafeltruc.        | **Quiz** — de keuze van het kind blijft naast het juiste antwoord staan en de uitleg licht de berekening toe. |
|                           ![Uitdagingsmodus: aftelling en huidige reeks](docs/media/05-defi.webp)                           |      ![Avontuurmodus: kaart met tien niveaus, de volgende zijn vergrendeld](docs/media/06-aventure.webp)      |
| **Uitdaging** — race tegen de klok. Bij een fout wordt de timer stilgezet zodat er tijd is om het juiste antwoord te lezen. |               **Avontuur** — tien niveaus die één voor één worden geopend in ruil voor sterren.               |
|                                 ![Arcademenu: de vier minigames](docs/media/07-arcade.webp)                                 |              ![Dashboard: sterren per tafel en statistieken](docs/media/08-tableau-de-bord.webp)              |
|                **Arcade** — vier minigames, met instelbare moeilijkheidsgraad en keuze van het ruimteschip.                 |                 **Dashboard** — sterren per tafel, tafels om te herhalen en scores per modus.                 |
|                ![Personalisatie: avatars, thema's en toegankelijkheid](docs/media/09-personnalisation.webp)                 |                                                                                                               |
|                    **Personalisatie** — avatar, kleurenthema, tekstgrootte, hoog contrast en oudercode.                     |                                                                                                               |

### De arcade-minigames

Vier spellen die dezelfde vraag stellen — de vraag die boven het speelveld wordt
weergegeven, samen met de resterende tijd en levens — maar telkens om een andere
handeling vragen.

|                                                                                                                                              |                                                                                                         |
| :------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|               ![MultiInvaders: monsters met getallen en een ruimteschip onderaan het scherm](docs/media/10-multiinvaders.webp)               | ![MultiMiam: een doolhof waarin bolletjes de mogelijke antwoorden dragen](docs/media/11-multimiam.webp) |
|          **MultiInvaders** — schiet op de foute antwoorden en spaar het juiste: daarachter zit een vriend die bevrijd moet worden.           |     **MultiMiam** — doorkruis het doolhof om het juiste resultaat te pakken en ontwijk de monsters.     |
| ![MultiMemory: een raster met kaarten, waarvan er twee zijn omgedraaid en een berekening en een getal tonen](docs/media/12-multimemory.webp) |        ![MultiSnake: een slang en genummerde appels in een weide](docs/media/13-multisnake.webp)        |
|                           **MultiMemory** — onthoud welke kaart het resultaat van de omgedraaide berekening bevat.                           |         **MultiSnake** — groei door de juiste getallen op te eten en alle andere te vermijden.          |

## ✨ Functies

### 🎮 Spelmodi

- **Ontdekkingsmodus**: visuele en interactieve verkenning, aangepast aan elke bewerking
- **Quizmodus**: meerkeuzevragen met ondersteuning voor de 4 bewerkingen (×, +, −, ÷) en adaptieve voortgang
- **Uitdagingsmodus**: race tegen de klok met de 4 bewerkingen (×, +, −, ÷) en verschillende moeilijkheidsniveaus
- **Avontuurmodus**: verhalende voortgang door niveaus met ondersteuning voor de 4 bewerkingen

### 🕹️ Arcade-minigames

- **MultiInvaders**: educatieve Space Invaders - Vernietig de foute antwoorden
- **MultiMiam**: wiskundige Pac-Man - Verzamel de juiste antwoorden
- **MultiMemory**: geheugenspel - Koppel bewerkingen aan resultaten
- **MultiSnake**: educatieve Snake - Groei door de juiste getallen op te eten

### ➕ Ondersteuning voor meerdere bewerkingen

LeapMultix biedt in **alle modi** volledige oefenmogelijkheden voor de 4 rekenkundige bewerkingen:

| Modus      | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Uitdaging  | ✅  | ✅  | ✅  | ✅  |
| Ontdekking | ✅  | ✅  | ✅  | ✅  |
| Avontuur   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Algemene functies

- **Meerdere gebruikers**: beheer van individuele profielen met opgeslagen voortgang
- **Meertalig**: ondersteuning voor Frans, Engels en Spaans
- **Personalisatie**: avatars, kleurenthema's en achtergronden
- **Toegankelijkheid**: toetsenbordnavigatie, aanraakondersteuning en naleving van WCAG 2.1 AA
- **Opgenomen stem**: vragen en aanmoedigingen voorgelezen door een vooraf opgenomen synthetische stem (Lucie in het Frans, gemaakt met ElevenLabs; Jane in het Engels, gemaakt met Mistral AI), met automatische terugval op de stem van het apparaat; clips bevinden zich buiten de openbare repository (zie [Opgenomen stem](#-opgenomen-stem))
- **Mobiel responsive**: interface geoptimaliseerd voor tablets en smartphones
- **Voortgangssysteem**: scores, badges en dagelijkse uitdagingen

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
npm run voice:generate     # Générer les clips (ElevenLabs ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Architectuur

### Bestandsstructuur

De JavaScript-modules staan **rechtstreeks in `js/`**, op drie mappen na:
`core/`, `components/` en `modes/`. De groepering wordt dus aangegeven door
de bestandsnaam (`arcade-*`, `multimiam-*`, `i18n*`…).

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

**Moderne ES6-modules**: het project gebruikt een modulaire architectuur met ES6-klassen en native imports/exports.

**Herbruikbare componenten**: de interface is opgebouwd met gecentraliseerde UI-componenten (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: modules worden slim op aanvraag geladen via `lazy-loader.js` om de initiële prestaties te optimaliseren.

**Uniform opslagsysteem**: gecentraliseerde API voor het bewaren van gebruikersgegevens via LocalStorage met fallbacks.

**Gecentraliseerd audiobeheer**: geluidsregeling met meertalige ondersteuning en voorkeuren per gebruiker.

**Event Bus**: ontkoppelde gebeurtenisgestuurde communicatie tussen componenten voor een onderhoudbare architectuur.

**Navigatie via slides**: navigatiesysteem gebaseerd op genummerde slides (slide0, slide1 enz.) met `goToSlide()`.

**Beveiliging**: XSS-bescherming en opschoning via `security-utils.js` voor alle DOM-manipulaties.

## 🎯 Gedetailleerde spelmodi

### Ontdekkingsmodus

Interface voor het visueel verkennen van de tafels van vermenigvuldiging met:

- Interactieve visualisatie van vermenigvuldigingen
- Animaties en geheugensteuntjes
- Educatief slepen en neerzetten
- Vrije voortgang per tafel

### Quizmodus

Meerkeuzevragen met:

- 10 vragen per sessie
- Adaptieve voortgang op basis van goede antwoorden
- Virtueel numeriek toetsenblok
- Streak-systeem (reeks goede antwoorden)

### Uitdagingsmodus

Race tegen de klok met:

- 3 moeilijkheidsniveaus (Beginner, Gemiddeld, Moeilijk)
- Tijdbonus voor goede antwoorden
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
featurebranches.

**1. Maak een branch**, `feat/` voor een functie, `fix/` voor een bugfix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Ontwikkel en controleer.** Formatteren komt eerst: de CI keurt de code af
voordat de tests zelfs maar worden uitgevoerd.

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

**Commitstijl**: beknopte berichten in de gebiedende wijs (bijv. "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: zorg ervoor dat `npm run lint`, `npm test` en `npm run test:coverage` vóór elke commit slagen

### Componentarchitectuur

**GameMode (basisklasse)**: alle modi erven van een gemeenschappelijke klasse met gestandaardiseerde methoden.

**GameModeManager**: gecentraliseerde orkestratie van het starten en beheren van modi.

**UI-componenten**: TopBar, InfoBar, Dashboard en Customization zorgen voor een consistente interface.

**Lazy Loading**: modules worden op aanvraag geladen om de initiële prestaties te optimaliseren.

**Event Bus**: ontkoppelde communicatie tussen componenten via het gebeurtenissysteem.

### Tests

Het project bevat een uitgebreide testsuite:

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

- **Rollup**: bundelt `js/main-es6.js` als ESM met code-splitting en sourcemaps
- **Terser**: automatische minificatie voor optimalisatie
- **Post-build**: kopieert `css/` en `assets/`, de favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, en herschrijft `dist/index.html` naar het gehashte invoerbestand (bijv. `main-es6-*.js`)
- **Eindmap**: `dist/` klaar om statisch te worden geserveerd

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continue integratie

**GitHub Actions**: `.github/workflows/ci.yml`, geactiveerd bij elke push naar
`main` en bij elke pull request.

**`verify`** — de blokkerende kwaliteitspoort:

- `npm ci` gevolgd door `npm run verify` (ESLint, Jest-tests, dekking)
- `npm run format:check` (Prettier)

**`seo-report`** — na `verify`: Lighthouse-audit van de online website om
de SEO-statistieken in de loop van de tijd te volgen.

**Externe analyses** gekoppeld aan pull requests: Codacy, CodeFactor en
SonarCloud. De SonarCloud-kwaliteitspoort vereist beoordelingen van niveau A voor betrouwbaarheid, beveiliging en
onderhoudbaarheid van nieuwe code.

**Implementatie**: `./deploy.sh` synchroniseert de website met S3 en maakt de
CloudFront-cache ongeldig. Het script genereert indien nodig de responsive afbeeldingen opnieuw, die niet in git staan.

### PWA (Progressive Web App)

LeapMultix is een volwaardige PWA met offline-ondersteuning en installatiemogelijkheid.

**Service Worker** (`sw.js`):

- Navigatie: Network-first met offline fallback naar `offline.html`
- Afbeeldingen: Cache-first om de prestaties te optimaliseren
- Vertalingen: Stale-while-revalidate voor updates op de achtergrond
- JS/CSS: Network-first om altijd de nieuwste versie te leveren
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

**Beheerscripts voor de Service Worker**:

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

- **XSS-beveiliging**: De functies van `security-utils.js` gebruiken:
  - `appendSanitizedHTML()` in plaats van `innerHTML`
  - `createSafeElement()` om veilige elementen te maken
  - `setSafeMessage()` voor tekstinhoud
- **Externe scripts**: Het attribuut `crossorigin="anonymous"` is verplicht
- **Invoervalidatie**: Externe gegevens altijd saniteren
- **Content Security Policy**: CSP-headers om scriptbronnen te beperken

**Toegankelijkheid**:

- Voldoet aan WCAG 2.1 AA
- Volledige toetsenbordnavigatie
- Passende ARIA-rollen en labels
- Voldoende kleurcontrasten

**Prestaties**:

- Lazy loading van modules via `lazy-loader.js`
- CSS-optimalisaties en responsieve assets
- Service Worker voor intelligente caching
- Code splitting en minificatie in productie

## 📱 Compatibiliteit

### Ondersteunde browsers

De interface gebruikt `oklch()` voor kleuren en `:has()` voor
contextuele statussen, wat de minimumversies bepaalt:

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
- Voldoende kleurcontrasten
- Ondersteuning voor ondersteunende technologieën

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

Dit script (`scripts/compare-translations.cjs`) zorgt voor de synchronisatie van alle taalbestanden:

**Functies:**

- Ontbrekende sleutels detecteren (aanwezig in fr.json maar afwezig in andere talen)
- Extra sleutels detecteren (aanwezig in andere talen maar niet in fr.json)
- Lege waarden identificeren (`""`, `null`, `undefined`, `[]`)
- De consistentie van typen controleren (string versus array)
- Geneste JSON-structuren afvlakken naar puntnotatie (bijv. `arcade.multiMemory.title`)
- Een gedetailleerd consolerapport genereren
- Het JSON-rapport opslaan in `docs/translations-comparison-report.json`

**Voorbeelduitvoer:**

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

Het spel leest vragen, aanmoedigingen en uitleg hardop voor met een vooraf opgenomen synthetische stem:

- in het Frans **Lucie**, gemaakt met ElevenLabs (model Eleven v3);
- in het Engels **Jane**, gemaakt met Mistral AI (Voxtral TTS).

Het spel spreekt slechts een eindige verzameling zinnen uit, ongeveer 7.400 per taal: ze zijn allemaal vooraf opgenomen en geen enkel onderdeel doet een beroep op een synthesedienst. Voor het Spaans wordt voorlopig de stem van het apparaat gebruikt.

- **Automatische fallback** naar de stem van het apparaat, per zin: ontbrekende clip of fout bij de clip, afspelen geweigerd door de browser, een clip die niet binnen 1,5 s start, of offline zonder dat de clip in de cache staat.
- **Instellingen**: de stemknop in de bovenste balk schakelt het voorlezen in of uit; het selectievakje ‘Opgenomen stem’ (Toegankelijkheid en bediening) kiest tussen de opgenomen stem (Lucie of Jane) en de stem van het apparaat.
- **Offline**: reeds beluisterde clips blijven in de cache (service worker).

### De clips staan niet in deze repository

De clips staan in een privérepository en in een speciale S3-bucket, die via CloudFront op `/voice/*` wordt aangeboden. Een fork of de lokale ontwikkelomgeving blijft daarom de stem van het apparaat gebruiken: in de repository is de tag `<meta name="leapmultix-voice-base">` leeg en alleen tijdens de productie-implementatie wordt `/voice/` erin geschreven.

Als de clips lokaal beschikbaar zijn (de privérepository is naast het spel gekloond, in `../leapmultix-voices`), laat de parameter `?voix=local` ze door de ontwikkelserver afspelen:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### De clips genereren

De pipeline is vastgelegd in scripts in `scripts/voice/` en draait op het systeem van de eigenaar, nooit in de openbare CI. De sleutels van de providers (ElevenLabs voor het Frans, Mistral voor het Engels) blijven in een bestand `.env` buiten de repository, dat via `node --env-file` wordt doorgegeven: er komt geen enkele sleutel in git terecht. De Claude Code-skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) doorloopt de procedure stap voor stap (controles, goedkeuringen, hervattingen); de details staan in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Schatten** hoeveel zinnen en te betalen tekens er nog over zijn (Eleven v3: ongeveer 0,53 credit per teken; Voxtral TTS: $ 16 per miljoen tekens).
2. **Genereren**. Door dezelfde opdracht opnieuw uit te voeren, wordt verdergegaan met wat nog ontbreekt. Wanneer de credits op zijn, stopt het script correct (code 3) zonder een half geschreven bestand achter te laten. `--max-total-chars` begrenst de totale uitgaven van de versie: elke betaalde respons wordt onmiddellijk na ontvangst vastgelegd in een register dat ook na een abrupt einde behouden blijft. Bij Mistral, dat geen uitleesbaar saldo biedt, is dit de enige beveiliging.
3. **Controleren**: elke zin heeft een clip en elke MP3 is geldig. Vervolgens transcribeert Whisper elke clip lokaal en meldt de controle verkeerd verstane getallen en afwijkende duurwaarden. `voice:review` voert Whisper, deze controle en de luisterpagina achter elkaar uit met één opdracht.
4. **Beluisteren** op de luisterpagina (`voice:listen`): de gemarkeerde clips en een steekproef van vrouwelijke vormen (‘une fois 7’), die Whisper niet van elkaar kan onderscheiden. Elke clip heeft een selectievakje ‘opnieuw maken’, waarmee deze aan de lijst met afgekeurde clips wordt toegevoegd.
5. **Opnieuw maken** van de afgekeurde clips (`--redo`), Whisper opnieuw uitvoeren en vervolgens elke clip vóór en na de wijziging vergelijken op een tweede pagina. Een clip die na twee of drie pogingen nog steeds verkeerd wordt uitgesproken, krijgt een opgelegde tekst in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), bijvoorbeeld het getal voluit geschreven.
6. **Publiceren** van de clips, controleren of ze online bereikbaar zijn en vervolgens de taalindex publiceren, eerst voor de testers (`?voix=test`).
7. **Beschikbaar stellen** van de stem aan iedereen en deze vervolgens standaard inschakelen. De noodschakelaar (`voice:publish -- remove`) verwijdert een taal uit de index: het spel schakelt dan terug naar de stem van het apparaat.

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

### Regel: een gewijzigde gesproken zin wordt vóór de productie-implementatie opnieuw opgenomen

Elke gesproken zin komt uit de vertalingen (`assets/translations/{fr,en,es}.json`) en maakt deel uit van het corpus. Het wijzigen van een gesproken zin zorgt er daarom voor dat de test voor de corpusvergrendeling (`scripts/voice/corpus.lock.json`) mislukt. Voor een taal met een opgenomen stem worden vervolgens de clips van de betrokken zinnen gegenereerd, gecontroleerd en beluisterd, waarna ze **vóór** het samenvoegen worden gepubliceerd. Ten slotte wordt de vergrendeling bijgewerkt (`npm run voice:corpus:lock`). Zonder deze clips wordt de gewijzigde zin met de stem van het apparaat voorgelezen.

## 📊 Gegevensopslag

### Gebruikersgegevens

- Profielen en voorkeuren
- Voortgang per spelmodus
- Scores en statistieken van arcadespellen
- Personalisatie-instellingen

### Technische functies

- Lokale opslag (localStorage) met fallbacks
- Isolatie van gegevens per gebruiker
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

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

## Inhoudsopgave

- [Beschrijving](#beschrijving)
- [Overzicht](#-overzicht)
- [Functies](#-functies)
- [Snelle start](#-snelle-start)
- [Architectuur](#-architectuur)
- [Gedetailleerde spelmodi](#-gedetailleerde-spelmodi)
- [Ontwikkeling](#-ontwikkeling)
- [Compatibiliteit](#-compatibiliteit)
- [Lokalisatie](#-lokalisatie)
- [Ingesproken stem](#-opgenomen-stem)
- [Gegevensopslag](#-gegevensopslag)
- [Een probleem melden](#-een-probleem-melden)
- [Licentie](#-licentie)

## Beschrijving

LeapMultix is een interactieve educatieve webapplicatie bedoeld voor kinderen van 6 tot 12 jaar om de 4 rekenkundige bewerkingen onder de knie te krijgen: vermenigvuldigen (×), optellen (+), aftrekken (−) en delen (÷). Het biedt **5 spelmodi** en **4 arcade-minigames** in een intuïtieve, toegankelijke en meertalige interface.

**Ondersteuning voor meerdere bewerkingen:** de vijf modi ondersteunen alle vier de bewerkingen. De keuze wordt gemaakt op het startscherm en geldt voor het hele traject.

**Ontwikkeld door:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## 📸 Overzicht

### De schermen

|                                                                                                                  |                                                                                                                    |
| :--------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------: |
|                       ![Scherm "Wie speelt er?": profielkeuze](docs/media/01-accueil.webp)                       |                      ![Hoofdmenu: keuze van bewerking en vijf modi](docs/media/02-menu.webp)                       |
|                       **Wie speelt er?** — een profiel per kind, met avatar en voortgang.                        |                    **Het menu** — de bewerking wordt hier gekozen, waarna de vijf modi openen.                     |
|            ![Ontdekkingsmodus: de tafel van 4 weergegeven in stippen](docs/media/03-decouverte.webp)             |               ![Quizmodus: fout antwoord in rood, juist antwoord in groen](docs/media/04-quiz.webp)                |
|  **Ontdekking** — elke vergelijking wordt getoond in stippen, sprongen of tellen, met het trucje van de tafel.   | **Quiz** — de keuze van het kind blijft zichtbaar naast het juiste antwoord, en de uitleg licht de berekening toe. |
|                     ![Uitdagingsmodus: aftelklok en lopende reeks](docs/media/05-defi.webp)                      |         ![Avonturenmodus: kaart van de tien niveaus, de volgende vergrendeld](docs/media/06-aventure.webp)         |
| **Uitdaging** — race tegen de klok. Bij een fout pauzeert de timer zodat het juiste antwoord kan worden gelezen. |                **Avontuur** — tien niveaus die na elkaar worden ontgrendeld, in ruil voor sterren.                 |
|                           ![Arcademenu: de vier minigames](docs/media/07-arcade.webp)                            |                ![Dashboard: sterren per tafel en statistieken](docs/media/08-tableau-de-bord.webp)                 |
|             **Arcade** — vier minigames, met instelbare moeilijkheidsgraad en keuze van ruimteschip.             |                      **Dashboard** — sterren per tafel, te herhalen tafels, scores per modus.                      |
|              ![Aanpassing: avatars, thema's, toegankelijkheid](docs/media/09-personnalisation.webp)              |                                                                                                                    |
|            **Aanpassing** — avatar, kleurthema, tekstgrootte, hoog contrast, ouderlijk toezichtcode.             |                                                                                                                    |

### De arcade-minigames

Vier spellen die dezelfde vraag stellen — weergegeven boven het speelveld, samen
met de resterende tijd en levens — maar telkens om een andere actie
vragen.

|                                                                                                                               |                                                                                                       |
| :---------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: |
|        ![MultiInvaders: monsters met getallen, een ruimteschip onderaan het scherm](docs/media/10-multiinvaders.webp)         | ![MultiMiam: een doolhof waarin stippen de mogelijke antwoorden dragen](docs/media/11-multimiam.webp) |
|  **MultiInvaders** — schiet op de verkeerde antwoorden, spaar het juiste: daar zit een vriend in verborgen om te bevrijden.   |    **MultiMiam** — doorkruis het doolhof om het juiste resultaat te pakken en ontwijk de monsters.    |
| ![MultiMemory: een raster met kaarten, twee omgedraaid die een berekening en een getal tonen](docs/media/12-multimemory.webp) |      ![MultiSnake: een slang en genummerde appels in een weiland](docs/media/13-multisnake.webp)      |
|            **MultiMemory** — vind uit het geheugen welke kaart het resultaat van de omgedraaide berekening toont.             |            **MultiSnake** — groei door de juiste getallen op te eten, vermijd alle andere.            |

## ✨ Functies

### 🎮 Spelmodi

- **Ontdekkingsmodus**: Visuele en interactieve verkenning aangepast aan elke bewerking
- **Quizmodus**: Meerkeuzevragen met ondersteuning voor de 4 bewerkingen (×, +, −, ÷) en adaptieve voortgang
- **Uitdagingsmodus**: Race tegen de klok met de 4 bewerkingen (×, +, −, ÷) en verschillende moeilijkheidsgraden
- **Avonturenmodus**: Verhalende voortgang per niveau met ondersteuning voor de 4 bewerkingen

### 🕹️ Arcade-minigames

- **MultiInvaders**: Educatieve Space Invaders - Vernietig de verkeerde antwoorden
- **MultiMiam**: Wiskundige Pac-Man - Verzamel de juiste antwoorden
- **MultiMemory**: Geheugenspel - Koppel bewerkingen aan uitkomsten
- **MultiSnake**: Educatieve Snake - Groei door de juiste getallen te eten

### ➕ Ondersteuning voor meerdere bewerkingen

LeapMultix biedt een complete training voor de 4 rekenkundige bewerkingen in **alle modi**:

| Modus      | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Uitdaging  | ✅  | ✅  | ✅  | ✅  |
| Ontdekking | ✅  | ✅  | ✅  | ✅  |
| Avontuur   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Algemene functies

- **Meerdere gebruikers**: Beheer van individuele profielen met opgeslagen voortgang
- **Meertalig**: Ondersteuning voor Frans, Engels en Spaans
- **Personalisatie**: Avatars, kleurthema's, achtergronden
- **Toegankelijkheid**: Toetsenbordnavigatie, touch-ondersteuning, naleving van WCAG 2.1 AA
- **Ingesproken stem**: het spel kan vragen en aanmoedigingen voorlezen met een vooraf opgenomen synthetische stem, met automatische terugval op de stem van het apparaat. De stemmen bevinden zich niet in deze repository: de site leapmultix.jls42.org levert Lucie in het Frans, Sulafat in het Engels en Spaans, en naar keuze Marie in het Frans en Jane in het Engels (zie [Ingesproken stem](#-opgenomen-stem))
- **Mobiel responsief**: Interface geoptimaliseerd voor tablets en smartphones
- **Voortgangssysteem**: Scores, badges, dagelijkse uitdagingen

## 🚀 Snelle start

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
npm run voice:generate     # Générer les clips (ElevenLabs, Google ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Architectuur

### Bestandsstructuur

De JavaScript-modules staan **plat in `js/`**, op drie mappen na:
`core/`, `components/` en `modes/`. Het is dus de bestandsnaam die voor de
groepering zorgt (`arcade-*`, `multimiam-*`, `i18n*`…).

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

**Moderne ES6-modules**: Het project maakt gebruik van een modulaire architectuur met ES6-classes en native imports/exports.

**Herbruikbare componenten**: Interface opgebouwd met gecentraliseerde UI-componenten (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligent laden van modules op aanvraag via `lazy-loader.js` om de initiële prestaties te optimaliseren.

**Uniform opslagsysteem**: Gecentraliseerde API voor gebruikersgegevenspersistentie via LocalStorage met fallbacks.

**Gecentraliseerd audiobeheer**: Geluidsregeling met meertalige ondersteuning en voorkeuren per gebruiker.

**Event Bus**: Ontkoppelde communicatie via events tussen componenten voor een onderhoudbare architectuur.

**Navigatie via slides**: Navigatiesysteem gebaseerd op genummerde slides (slide0, slide1, enz.) met `goToSlide()`.

**Beveiliging**: XSS-bescherming en opschoning via `security-utils.js` voor alle DOM-manipulaties.

## 🎯 Gedetailleerde spelmodi

### Ontdekkingsmodus

Visuele verkenningsinterface voor de tafels van vermenigvuldiging met:

- Interactieve visualisatie van vermenigvuldigingen
- Animaties en geheugensteuntjes
- Educatief slepen en neerzetten
- Vrije voortgang per tafel

### Quizmodus

Meerkeuzevragen met:

- 10 vragen per sessie
- Adaptieve voortgang op basis van prestaties
- Virtueel numeriek toetsenblok
- Streak-systeem (reeks goede antwoorden)

### Uitdagingsmodus

Race tegen de klok met:

- 3 moeilijkheidsgraden (Beginner, Gemiddeld, Moeilijk)
- Tijdbonus voor goede antwoorden
- Levenssysteem
- Ranglijst met topscores

### Avonturenmodus

Verhalende voortgang met:

- 10 ontgrendelbare thematische niveaus
- Interactieve kaart met visuele voortgang
- Meeslepend verhaal met personages
- Sterren- en beloningssysteem

### Arcade-minigames

Elke minigame biedt:

- Keuze uit moeilijkheidsgraad en personalisatie
- Levenssysteem en score
- Toetsenbord- en touch-bediening
- Individuele ranglijsten per gebruiker

## 🔧 Ontwikkeling

### Ontwikkelingsworkflow

**Commit nooit rechtstreeks op main.** Het project werkt met feature branches.

**1. Maak een branch aan**, `feat/` voor een functie, `fix/` voor een bugfix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Ontwikkel en controleer.** Formattering komt op de eerste plaats: de CI wijst het
al af vóór de tests worden uitgevoerd.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Commit op de branch**, en push deze vervolgens:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Open een pull request** en wacht op de analyses: verify, Codacy,
CodeFactor en SonarCloud. Er wordt gecorrigeerd tot alles op groen staat alvorens te mergen.

**Commitstijl**: Beknopte berichten, gebiedende wijs (bijv.: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Zorg ervoor dat `npm run lint`, `npm test` en `npm run test:coverage` slagen vóór elke commit

### Componentarchitectuur

**GameMode (basisklasse)**: Alle modi erven over van een gemeenschappelijke klasse met gestandaardiseerde methoden.

**GameModeManager**: Gecentraliseerde orkestratie voor het starten en beheren van de modi.

**UI-componenten**: TopBar, InfoBar, Dashboard en Customization zorgen voor een consistente interface.

**Lazy Loading**: Modules worden op aanvraag geladen om de initiële prestaties te optimaliseren.

**Event Bus**: Ontkoppelde communicatie tussen componenten via het event-systeem.

### Tests

Het project bevat een complete testsuite:

- Unittests voor core modules
- Integratietests voor componenten
- Tests voor spelmodi
- Geautomatiseerde codedekking

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Productie-build

- **Rollup**: Bundelt `js/main-es6.js` in ESM met code-splitting en sourcemaps
- **Terser**: Automatische minificatie voor optimalisatie
- **Post-build**: Kopieert `css/` en `assets/`, de favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, en herschrijft `dist/index.html` naar het gehashte startbestand (bijv.: `main-es6-*.js`)
- **Eindmap**: `dist/` klaar om statisch te worden geserveerd

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continue integratie

**GitHub Actions**: `.github/workflows/ci.yml`, geactiveerd bij elke push naar
`main` en bij elke pull request.

**`verify`** — de kwaliteitscontrole, blokkerend:

- `npm ci` vervolgens `npm run verify` (ESLint, Jest-tests, dekking)
- `npm run format:check` (Prettier)

**`seo-report`** — na `verify`: Lighthouse-audit van de live site, om
de SEO-statistieken op de lange termijn te volgen.

**Externe analyses** gekoppeld aan pull requests: Codacy, CodeFactor en
SonarCloud. De SonarCloud-gate vereist A-beoordelingen voor betrouwbaarheid, beveiliging en
onderhoudbaarheid op nieuwe code.

**Implementatie**: `./deploy.sh` synchroniseert de site naar S3 en invalideert de CloudFront-cache.
Het script regenereert indien nodig de responsieve afbeeldingen, die niet in git zijn opgenomen.

### PWA (Progressive Web App)

LeapMultix is een volledige PWA met offline ondersteuning en de mogelijkheid tot installatie.

**Service Worker** (`sw.js`):

- Navigatie: Network-first met offline terugval naar `offline.html`
- Afbeeldingen: Cache-first om prestaties te optimaliseren
- Vertalingen: Stale-while-revalidate voor updates op de achtergrond
- JS/CSS: Network-first om altijd de nieuwste versie aan te bieden
- Automatisch versiebeheer via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- en PNG-pictogrammen voor alle apparaten
- Installatie mogelijk op mobiel (Add to Home Screen)
- Standalone configuratie voor een app-achtige ervaring
- Ondersteuning voor thema's en kleuren

**De offline modus lokaal testen.** Start de server en open vervolgens
`http://localhost:8080` (of de weergegeven poort):

```bash
npm run serve
```

Handmatig: schakel het netwerk uit in de ontwikkelhulpprogramma's (tabblad Netwerk,
offlinemodus) en vernieuw de pagina. `offline.html` moet worden weergegeven.

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

**Hulpmiddelen voor codekwaliteit**:

- **ESLint**: Moderne configuratie met flat config (`eslint.config.js`), ES2022-ondersteuning
- **Prettier**: Automatische codeformattering (`.prettierrc`)
- **Stylelint**: CSS-validatie (`.stylelintrc.json`)
- **JSDoc**: Automatische functiedocumentatie met dekkingsanalyse

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
- **Validatie van invoer**: Externe gegevens altijd opschonen (sanitizen)
- **Content Security Policy**: CSP-headers om scriptbronnen te beperken

**Toegankelijkheid**:

- WCAG 2.1 AA-naleving
- Volledige toetsenbordnavigatie
- Passende ARIA-rollen en labels
- Conforme kleurcontrasten

**Prestaties**:

- Lazy loading van modules via `lazy-loader.js`
- CSS-optimalisaties en responsieve assets
- Service Worker voor slimme caching
- Code splitting en minificatie in productie

## 📱 Compatibiliteit

### Ondersteunde browsers

De interface is gebaseerd op `oklch()` voor kleuren en op `:has()` voor
contextuele toestanden, wat de ondergrens bepaalt:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Apparaten

- **Desktop**: Toetsenbord- en muisbediening
- **Tablets**: Geoptimaliseerde aanraakinterface
- **Smartphones**: Adaptief responsief ontwerp

### Toegankelijkheid

- Volledige toetsenbordnavigatie (Tab, pijltjestoetsen, Esc)
- ARIA-rollen en labels voor schermlezers
- Conforme kleurcontrasten
- Ondersteuning voor ondersteunende technologieën

## 🌍 Lokalisatie

Volledige meertalige ondersteuning:

- **Frans** (standaardtaal)
- **Engels**
- **Spaans**

### Beheer van vertalingen

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

**`npm run i18n:verify`** - Consistentie van vertaalsleutels controleren

**`npm run i18n:unused`** - Ongebruikte vertaalsleutels tonen

**`npm run i18n:compare`** - Vertaalbestanden vergelijken met fr.json (referentie)

Dit script (`scripts/compare-translations.cjs`) zorgt voor de synchronisatie van alle taalbestanden:

**Functionaliteiten:**

- Detectie van ontbrekende sleutels (aanwezig in fr.json maar afwezig in andere talen)
- Detectie van overtollige sleutels (aanwezig in andere talen maar niet in fr.json)
- Identificatie van lege waarden (`""`, `null`, `undefined`, `[]`)
- Consistentiecontrole van typen (string vs array)
- Afvlakken van geneste JSON-structuren naar puntnotatie (bijv.: `arcade.multiMemory.title`)
- Generatie van een gedetailleerd consolerepport
- Opslag van het JSON-rapport in `docs/translations-comparison-report.json`

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

**Dekkingsgraad van vertalingen:**

- Volledige gebruikersinterface
- Spelinstructies
- Fout- en feedbackberichten
- Beschrijvingen en contextuele hulp
- Verhalende inhoud van de Avontuur-modus
- Toegankelijkheids- en ARIA-labels

## 🔊 Opgenomen stem

Het spel leest vragen, aanmoedigingen en uitleg hardop voor. Het spreekt slechts een eindige set zinnen uit, ongeveer 7.400 per taal: ze kunnen dus eens en voor altijd worden opgenomen, waardoor geen enkel spel een spraaksynthesedienst aanroept. Zonder audiofragmenten leest het spel voor met de stem van het apparaat.

### In deze repository: de applicatie, zonder de stemmen

De code kan vooraf opgenomen fragmenten afspelen en bevat de pipeline die ze produceert. De audiofragmenten zitten er niet in, net zomin als de API-sleutels van de providers: een fork of een lokale installatie leest voor met de stem van het apparaat.

- **Automatische terugval** op de stem van het apparaat, zin voor zin: ontbrekend of foutief fragment, weergave geweigerd door de browser, fragment dat niet binnen 1,5 s start, of offline zonder het fragment in de cache.
- **Instellingen**: de stemknop in de bovenste balk schakelt het voorlezen in of uit; het selectievakje "Opgenomen stem" (Toegankelijkheid en bediening) kiest tussen de opgenomen stem en de stem van het apparaat. Deze verschijnt alleen in talen waarin een stem is gepubliceerd.
- **Offline**: reeds beluisterde fragmenten blijven in de cache (service worker).
- **Waar het spel zoekt naar fragmenten**: in de tag `<meta name="leapmultix-voice-base">`, die leeg is in de repository. Alleen de productie-implementatie schrijft daar `/voice/`.

Met eigen fragmenten op het systeem (gemaakt via de onderstaande pipeline, geplaatst naast het spel in `../leapmultix-voices`), zorgt de parameter `?voix=local` ervoor dat de ontwikkelserver ze afspeelt:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Op leapmultix.jls42.org: de stemmen van de hosting

De door de auteur aangeboden website levert opgenomen synthetische stemmen:

- in het Frans: **Lucie**, gemaakt met ElevenLabs (model Eleven v3);
- in het Brits-Engels en Europees Spaans: **Sulafat**, gemaakt met Google Cloud Text-to-Speech (stem Chirp 3 HD);
- naar keuze van de speler: **Marie** in het Frans en **Jane** in het Engels, gemaakt met Mistral AI (Voxtral TTS).

De fragmenten bevinden zich in een privé-repository en in een speciale S3-bucket, geserveerd via CloudFront op `/voice/*`. In de instellingen toont het menu "Stem" de stemmen van de taal wanneer er meerdere zijn, en de vermelding noemt de service van de gehoorde stem.

### Fragmenten genereren

De pipeline is gescript in `scripts/voice/` en draait op het apparaat van de eigenaar, nooit in openbare CI. De sleutels van de providers (ElevenLabs voor het Frans, Google Cloud Text-to-Speech voor het Engels en Spaans, Mistral voor Marie en Jane) blijven in een bestand `.env` buiten de repository, doorgegeven via `node --env-file`: er komt geen enkele sleutel in git terecht. De Claude Code-skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) doorloopt de procedure stap voor stap (checks, goedkeuringen, hervattingen); details staan in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Schatten** van de resterende zinnen en de te betalen tekens (Eleven v3: ongeveer 0,53 credit per teken; Chirp 3 HD: $ 30 per miljoen tekens, het eerste miljoen van elke maand is gratis; Voxtral TTS: $ 16 per miljoen).
2. **Genereren**. Het opnieuw uitvoeren van hetzelfde commando gaat verder met wat ontbreekt. Wanneer de credits op zijn, stopt het script netjes (code 3) zonder een halfgeschreven bestand achter te laten. `--max-total-chars` maximeert de gecumuleerde uitgaven van de versie: elk betaald antwoord wordt direct na ontvangst geregistreerd in een logboek, dat een abrupte stop overleeft. Bij Google en Mistral, die geen inzichtelijk saldo tonen, is dit de enige bescherming.
3. **Controleren**: elke zin heeft zijn fragment en elk MP3-bestand is geldig. Whisper transcribeert vervolgens elk fragment lokaal, en de controle signaleert verkeerd verstane getallen en abnormale speelduur. `voice:review` koppelt Whisper, deze controle en de luisterpagina aaneen in één commando.
4. **Luisteren** op de luisterpagina (`voice:listen`) naar gesignaleerde fragmenten en een steekproef van vrouwelijke vormen ("une fois 7"), die Whisper niet onderscheidt. Elk fragment heeft een selectievakje "opnieuw doen", waarmee het wordt toegevoegd aan de lijst met afgekeurde fragmenten.
5. **Opnieuw doen** van de afgekeurde fragmenten (`--redo`) en Whisper opnieuw uitvoeren, en vervolgens elk fragment vóór en na vergelijken op een tweede pagina. Een fragment dat na twee of drie pogingen nog steeds niet goed wordt uitgesproken, krijgt een afgedwongen tekst in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), bijvoorbeeld het getal voluit geschreven.
6. **Publiceren** van de fragmenten, verifiëren dat ze online reageren, en vervolgens de index van de taal publiceren, eerst voor testers (`?voix=test`).
7. **Openstellen** van de stem voor iedereen, en deze vervolgens standaard activeren. De noodschakelaar (`voice:publish -- remove`) verwijdert een taal uit de index: het spel valt terug op de stem van het apparaat.

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

### Regel: een gewijzigde gesproken zin wordt vóór ingebruikname opnieuw opgenomen

Elke gesproken zin is afkomstig uit de vertalingen (`assets/translations/{fr,en,es}.json`) en maakt deel uit van het corpus. Het wijzigen van een gesproken zin zorgt er daarom voor dat de test van de corpusvergrendeling (`scripts/voice/corpus.lock.json`) mislukt. Voor een taal met een opgenomen stem worden vervolgens de fragmenten van de gewijzigde zinnen gegenereerd, gecontroleerd en beluisterd, en daarna gepubliceerd **vóór** het samenvoegen (mergen). Ten slotte wordt de vergrendeling bijgewerkt (`npm run voice:corpus:lock`). Zonder deze fragmenten wordt de gewijzigde zin voorgelezen met de stem van het apparaat.

## 📊 Gegevensopslag

### Gebruikersgegevens

- Profielen en voorkeuren
- Voortgang per spelmodus
- Scores en statistieken van arcadespellen
- Aanpassingsinstellingen

### Technische kenmerken

- Lokale opslag (localStorage) met fallbacks
- Gegevensisolatie per gebruiker
- Automatische opslag van voortgang
- Automatische migratie van oude gegevens

## 🐛 Een probleem melden

Problemen kunnen worden gemeld via GitHub Issues. Gelieve het volgende toe te voegen:

- Gedetailleerde beschrijving van het probleem
- Stappen om het te reproduceren
- Browser en versie
- Screenshots indien relevant

## 💝 Het project steunen

**[☕ Een donatie doen via PayPal](https://paypal.me/jls)**

## 📄 Licentie

Dit project is gelicentieerd onder de AGPL v3-licentie. Zie het bestand `LICENSE` voor meer informatie.

---

_LeapMultix — open source educatieve applicatie om de vier basisbewerkingen te leren_

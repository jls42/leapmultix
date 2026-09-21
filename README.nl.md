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
- [Snel aan de slag](#-snel-aan-de-slag)
- [Architectuur](#-architectuur)
- [Gedetailleerde spelmodi](#-gedetailleerde-spelmodi)
- [Ontwikkeling](#-ontwikkeling)
- [Compatibiliteit](#-compatibiliteit)
- [Lokalisatie](#-lokalisatie)
- [Gegevensopslag](#-gegevensopslag)
- [Een probleem melden](#-een-probleem-melden)
- [Licentie](#-licentie)

## Beschrijving

LeapMultix is een interactieve educatieve webapplicatie waarmee kinderen van 6 tot 12 jaar de vier rekenkundige bewerkingen onder de knie kunnen krijgen: vermenigvuldigen (×), optellen (+), aftrekken (−) en delen (÷). De applicatie biedt **5 spelmodi** en **4 arcade-minigames** in een intuïtieve, toegankelijke en meertalige interface.

**Ondersteuning voor meerdere bewerkingen:** alle vijf modi ondersteunen de vier bewerkingen. De bewerking wordt op het startscherm gekozen en geldt voor het volledige traject.

**Ontwikkeld door:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## 📸 Overzicht

### De schermen

|                                                                                                                         |                                                                                                                   |
| :---------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------: |
|                          ![Scherm ‘Wie speelt er?’: profielkeuze](docs/media/01-accueil.webp)                           |                   ![Hoofdmenu: keuze van de bewerking en de vijf modi](docs/media/02-menu.webp)                   |
|                       **Wie speelt er?** — één profiel per kind, met een avatar en de voortgang.                        |                **Het menu** — hier wordt de bewerking gekozen, waarna de vijf modi worden geopend.                |
|               ![Ontdekkingsmodus: de tafel van 4 weergegeven met stippen](docs/media/03-decouverte.webp)                |               ![Quizmodus: fout antwoord in rood, goed antwoord in groen](docs/media/04-quiz.webp)                |
|  **Ontdekking** — elke gelijkheid wordt weergegeven met stippen, sprongen of tellen, samen met de truc voor de tafel.   | **Quiz** — de keuze van het kind blijft naast het juiste antwoord zichtbaar en de uitleg licht de berekening toe. |
|                         ![Uitdagingsmodus: aftelling en huidige reeks](docs/media/05-defi.webp)                         |    ![Avontuurmodus: kaart met tien niveaus, waarbij de volgende vergrendeld zijn](docs/media/06-aventure.webp)    |
| **Uitdaging** — race tegen de klok. Bij een fout wordt de timer stilgezet zodat het juiste antwoord kan worden gelezen. |                **Avontuur** — tien niveaus die na elkaar worden ontgrendeld in ruil voor sterren.                 |
|                               ![Arcademenu: de vier minigames](docs/media/07-arcade.webp)                               |                ![Dashboard: sterren per tafel en statistieken](docs/media/08-tableau-de-bord.webp)                |
|           **Arcade** — vier minigames, met instelling van de moeilijkheidsgraad en keuze van het ruimteschip.           |                   **Dashboard** — sterren per tafel, tafels om te herhalen en scores per modus.                   |
|              ![Personalisatie: avatars, thema's en toegankelijkheid](docs/media/09-personnalisation.webp)               |                                                                                                                   |
|                  **Personalisatie** — avatar, kleurenthema, tekstgrootte, hoog contrast en oudercode.                   |                                                                                                                   |

### De arcade-minigames

Vier spellen die dezelfde vraag stellen — de vraag die boven het speelveld wordt
weergegeven, samen met de resterende tijd en de levens — maar telkens een andere
handeling vereisen.

|                                                                                                                                              |                                                                                                         |
| :------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|               ![MultiInvaders: monsters met getallen en een ruimteschip onderaan het scherm](docs/media/10-multiinvaders.webp)               | ![MultiMiam: een doolhof waarin bolletjes de mogelijke antwoorden dragen](docs/media/11-multimiam.webp) |
|          **MultiInvaders** — schiet op de foute antwoorden en spaar het juiste: daarachter zit een vriend die moet worden bevrijd.           |     **MultiMiam** — doorkruis het doolhof om het juiste resultaat te pakken en ontwijk de monsters.     |
| ![MultiMemory: een raster met kaarten, waarvan er twee zijn omgedraaid en een berekening en een getal tonen](docs/media/12-multimemory.webp) |        ![MultiSnake: een slang en genummerde appels in een weide](docs/media/13-multisnake.webp)        |
|                           **MultiMemory** — onthoud welke kaart het resultaat van de omgedraaide berekening bevat.                           |            **MultiSnake** — groei door de juiste getallen op te eten en ontwijk alle andere.            |

## ✨ Functies

### 🎮 Spelmodi

- **Ontdekkingsmodus**: visuele en interactieve verkenning die aan elke bewerking is aangepast
- **Quizmodus**: meerkeuzevragen met ondersteuning voor de 4 bewerkingen (×, +, −, ÷) en adaptieve voortgang
- **Uitdagingsmodus**: race tegen de klok met de 4 bewerkingen (×, +, −, ÷) en verschillende moeilijkheidsgraden
- **Avontuurmodus**: verhalende voortgang door niveaus met ondersteuning voor de 4 bewerkingen

### 🕹️ Arcade-minigames

- **MultiInvaders**: educatieve Space Invaders — vernietig de foute antwoorden
- **MultiMiam**: wiskundige Pac-Man — verzamel de juiste antwoorden
- **MultiMemory**: geheugenspel — koppel bewerkingen aan resultaten
- **MultiSnake**: educatieve Snake — groei door de juiste getallen te eten

### ➕ Ondersteuning voor meerdere bewerkingen

LeapMultix biedt in **alle modi** een volledige training voor de 4 rekenkundige bewerkingen:

| Modus      | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Uitdaging  | ✅  | ✅  | ✅  | ✅  |
| Ontdekking | ✅  | ✅  | ✅  | ✅  |
| Avontuur   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Overkoepelende functies

- **Meerdere gebruikers**: beheer van individuele profielen met opgeslagen voortgang
- **Meertalig**: ondersteuning voor Frans, Engels en Spaans
- **Personalisatie**: avatars, kleurenthema's en achtergronden
- **Toegankelijkheid**: toetsenbordnavigatie, ondersteuning voor touchscreens en conformiteit met WCAG 2.1 AA
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
```

## 🏗️ Architectuur

### Bestandsstructuur

De JavaScript-modules staan **plat in `js/`**, met uitzondering van drie mappen:
`core/`, `components/` en `modes/`. De groepering wordt dus aangegeven door de
bestandsnaam (`arcade-*`, `multimiam-*`, `i18n*`…).

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

### Technische architectuur

**Moderne ES6-modules**: het project gebruikt een modulaire architectuur met ES6-klassen en native imports/exports.

**Herbruikbare componenten**: de interface is opgebouwd met gecentraliseerde UI-componenten (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: modules worden intelligent op aanvraag geladen via `lazy-loader.js` om de initiële prestaties te optimaliseren.

**Uniform opslagsysteem**: gecentraliseerde API voor het bewaren van gebruikersgegevens via LocalStorage met fallbacks.

**Gecentraliseerd audiobeheer**: geluidsregeling met meertalige ondersteuning en voorkeuren per gebruiker.

**Event Bus**: ontkoppelde, gebeurtenisgestuurde communicatie tussen componenten voor een onderhoudbare architectuur.

**Navigatie met slides**: navigatiesysteem gebaseerd op genummerde slides (slide0, slide1 enzovoort) met `goToSlide()`.

**Beveiliging**: XSS-bescherming en sanitization via `security-utils.js` voor alle DOM-manipulaties.

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
- Adaptieve voortgang op basis van de resultaten
- Virtueel numeriek toetsenblok
- Streak-systeem (reeks goede antwoorden)

### Uitdagingsmodus

Race tegen de klok met:

- 3 moeilijkheidsgraden (Beginner, Gemiddeld, Moeilijk)
- Tijdbonus voor juiste antwoorden
- Levenssysteem
- Ranglijst met topscores

### Avontuurmodus

Verhalende voortgang met:

- 10 ontgrendelbare thematische niveaus
- Interactieve kaart met visuele voortgang
- Meeslepend verhaal met personages
- Systeem met sterren en beloningen

### Arcade-minigames

Elke minigame biedt:

- Keuze van moeilijkheidsgraad en personalisatie
- Levens- en scoresysteem
- Bediening met toetsenbord en touchscreen
- Individuele ranglijsten per gebruiker

## 🛠️ Ontwikkeling

### Ontwikkelworkflow

**Commit nooit rechtstreeks naar main.** Het project werkt met
feature branches.

**1. Maak een branch**, `feat/` voor een functie, `fix/` voor een correctie:

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

**Commitstijl**: beknopte berichten in de gebiedende wijs (bijvoorbeeld: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: zorg ervoor dat `npm run lint`, `npm test` en `npm run test:coverage` vóór elke commit slagen

### Componentarchitectuur

**GameMode (basisklasse)**: alle modi erven van een gemeenschappelijke klasse met gestandaardiseerde methoden.

**GameModeManager**: gecentraliseerde orkestratie van het starten en beheren van de modi.

**UI-componenten**: TopBar, InfoBar, Dashboard en Customization zorgen voor een consistente interface.

**Lazy Loading**: de modules worden op aanvraag geladen om de initiële prestaties te optimaliseren.

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
- **Post-build**: kopieert `css/` en `assets/`, de favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, en herschrijft `dist/index.html` naar het gehashte entry-bestand (bijvoorbeeld `main-es6-*.js`)
- **Eindmap**: `dist/`, klaar om statisch te worden aangeboden

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continue integratie

**GitHub Actions**: `.github/workflows/ci.yml`, geactiveerd bij elke push naar
`main` en bij elke pull request.

**`verify`** — de blokkerende quality gate:

- `npm ci` en vervolgens `npm run verify` (ESLint, Jest-tests, dekking)
- `npm run format:check` (Prettier)

**`seo-report`** — na `verify`: Lighthouse-audit van de online website om
de SEO-metrics op lange termijn te volgen.

**Externe analyses** die aan pull requests zijn gekoppeld: Codacy, CodeFactor en
SonarCloud. De SonarCloud-gate vereist voor nieuwe code een A-score voor betrouwbaarheid, beveiliging en
onderhoudbaarheid.

**Implementatie**: `./deploy.sh` synchroniseert de website met S3 en maakt de
CloudFront-cache ongeldig. Het script genereert indien nodig de responsive afbeeldingen opnieuw, die niet in git staan.

### PWA (Progressive Web App)

LeapMultix is een volledige PWA met offline ondersteuning en de mogelijkheid om de app te installeren.

**Service Worker** (`sw.js`):

- Navigatie: Network-first met offline fallback naar `offline.html`
- Afbeeldingen: Cache-first om de prestaties te optimaliseren
- Vertalingen: Stale-while-revalidate voor updates op de achtergrond
- JS/CSS: Network-first om altijd de nieuwste versie aan te bieden
- Automatisch versiebeheer via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- en PNG-pictogrammen voor alle apparaten
- Installatie mogelijk op mobiele apparaten (Add to Home Screen)
- Standalone-configuratie voor een app-achtige ervaring
- Ondersteuning voor thema's en kleuren

**Test de offline modus lokaal.** Start de server en open vervolgens
`http://localhost:8080` (of de weergegeven poort):

```bash
npm run serve
```

Handmatig: schakel het netwerk uit in de ontwikkelaarstools (tabblad Netwerk,
offline modus) en vernieuw vervolgens de pagina. `offline.html` moet worden weergegeven.

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

- **ESLint**: moderne configuratie met flat config (`eslint.config.js`), ondersteuning voor ES2022
- **Prettier**: automatische codeopmaak (`.prettierrc`)
- **Stylelint**: CSS-validatie (`.stylelintrc.json`)
- **JSDoc**: automatische documentatie van functies met dekkingsanalyse

**Belangrijke coderegels**:

- Verwijder ongebruikte variabelen en parameters (`no-unused-vars`)
- Gebruik specifieke foutafhandeling (geen lege catch-blokken)
- Vermijd `innerHTML` ten gunste van de functies `security-utils.js`
- Houd de cognitieve complexiteit van functies onder 15
- Splits complexe functies op in kleinere helpers

**Beveiliging**:

- **XSS-bescherming**: gebruik de functies van `security-utils.js`:
  - `appendSanitizedHTML()` in plaats van `innerHTML`
  - `createSafeElement()` om veilige elementen te maken
  - `setSafeMessage()` voor tekstinhoud
- **Externe scripts**: attribuut `crossorigin="anonymous"` verplicht
- **Invoervalidatie**: sanitize externe gegevens altijd
- **Content Security Policy**: CSP-headers om scriptbronnen te beperken

**Toegankelijkheid**:

- Conformiteit met WCAG 2.1 AA
- Volledige toetsenbordnavigatie
- Passende ARIA-rollen en labels
- Conforme kleurcontrasten

**Prestaties**:

- Lazy loading van modules via `lazy-loader.js`
- CSS-optimalisaties en responsive assets
- Service Worker voor intelligente caching
- Code splitting en minification in productie

## 📱 Compatibiliteit

### Ondersteunde browsers

De interface gebruikt `oklch()` voor kleuren en `:has()` voor contextuele
statussen, wat de minimumvereisten bepaalt:

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
- Kleurcontrasten die aan de normen voldoen
- Ondersteuning voor hulptechnologieën

## 🌍 Lokalisatie

Volledige meertalige ondersteuning:

- **Frans** (standaardtaal)
- **Engels**
- **Spaans**

### Vertalingen beheren

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

**Functionaliteiten:**

- Detectie van ontbrekende sleutels (aanwezig in fr.json, maar afwezig in andere talen)
- Detectie van extra sleutels (aanwezig in andere talen, maar niet in fr.json)
- Identificatie van lege waarden (`""`, `null`, `undefined`, `[]`)
- Controle van typeconsistentie (string versus array)
- Afvlakking van geneste JSON-structuren naar puntnotatie (bijvoorbeeld: `arcade.multiMemory.title`)
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

**Dekking van de vertalingen:**

- Volledige gebruikersinterface
- Spelinstructies
- Fout- en feedbackberichten
- Beschrijvingen en contextuele hulp
- Verhalende inhoud van de Avontuurmodus
- Toegankelijkheids- en ARIA-labels

## 📊 Gegevensopslag

### Gebruikersgegevens

- Profielen en voorkeuren
- Voortgang per spelmodus
- Scores en statistieken van arcadespellen
- Personalisatie-instellingen

### Technische functionaliteiten

- Lokale opslag (localStorage) met fallbacks
- Gegevensisolatie per gebruiker
- Automatische opslag van de voortgang
- Automatische migratie van oude gegevens

## 🐛 Een probleem melden

Problemen kunnen via GitHub-issues worden gemeld. Vermeld daarbij:

- Een gedetailleerde beschrijving van het probleem
- Stappen om het probleem te reproduceren
- Browser en versie
- Schermafbeeldingen indien relevant

## 💝 Het project steunen

**[☕ Doneren via PayPal](https://paypal.me/jls)**

## 📄 Licentie

Dit project valt onder de AGPL v3-licentie. Raadpleeg het bestand `LICENSE` voor meer informatie.

---

_LeapMultix — vrije educatieve applicatie om de vier rekenkundige bewerkingen te leren_

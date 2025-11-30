<details>
<summary>Dit document is ook beschikbaar in andere talen</summary>

- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Deutsch](./README.de.md)
- [中文](./README.zh.md)
- [हिन्दी](./README.hi.md)
- [العربية](./README.ar.md)
- [Français](./README.md)
- [Italiano](./README.it.md)
- [Svenska](./README.sv.md)
- [Polski](./README.pl.md)
- [Română](./README.ro.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)

</details>

# LeapMultix

<!-- Badges (update <owner>/<repo> na GitHub migratie) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Inhoudsopgave

- [Beschrijving](#beschrijving)
- [Functies](#-functies)
- [Snel aan de slag](#-snel-aan-de-slag)
- [Architectuur](#-architectuur)
- [Gedetailleerde Spelmodi](#-gedetailleerde-spelmodi)
- [Ontwikkeling](#-ontwikkeling)
- [Compatibiliteit](#-compatibiliteit)
- [Lokalisatie](#-lokalisatie)
- [Gegevensopslag](#-gegevensopslag)
- [Een probleem melden](#-een-probleem-melden)
- [Licentie](#-licentie)

## Beschrijving

LeapMultix is een moderne interactieve educatieve webapplicatie ontworpen voor kinderen (8–12 jaar) om de 4 rekenkundige bewerkingen onder de knie te krijgen: vermenigvuldigen (×), optellen (+), aftrekken (−) en delen (÷). De applicatie biedt **5 spelmodi** en **4 arcade minigames** in een intuïtieve, toegankelijke en meertalige interface.

**Ondersteuning voor meerdere bewerkingen:** De Quiz- en Uitdagingsmodi maken het mogelijk om alle bewerkingen te oefenen. De Ontdekkings-, Avontuur- en Arcademodi richten zich op vermenigvuldigen maar zijn ontworpen om alle bewerkingen te ondersteunen.

**Ontwikkeld door:** Julien LS (contact@jls42.org)

**Online URL:** https://leapmultix.jls42.org/

## ✨ Functies

### 🎮 Spelmodi

- **Ontdekkingsmodus**: Visuele en interactieve verkenning aangepast aan elke bewerking
- **Quizmodus**: Meerkeuzevragen met ondersteuning voor alle 4 de bewerkingen (×, +, −, ÷) en adaptieve voortgang
- **Uitdagingsmodus**: Race tegen de klok met alle 4 de bewerkingen (×, +, −, ÷) en verschillende moeilijkheidsgraden
- **Avontuurmodus**: Verhalende voortgang per niveau met ondersteuning voor alle 4 de bewerkingen

### 🕹️ Arcade Minigames

- **MultiInvaders**: Educatieve Space Invaders - Vernietig de foute antwoorden
- **MultiMiam**: Wiskundige Pac-Man - Verzamel de juiste antwoorden
- **MultiMemory**: Geheugenspel - Combineer bewerkingen en resultaten
- **MultiSnake**: Educatieve Snake - Groei door de juiste getallen te eten

### ➕ Ondersteuning voor Meerdere Bewerkingen

LeapMultix biedt volledige training voor de 4 rekenkundige bewerkingen in **alle modi**:

| Modus      | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Uitdaging  | ✅  | ✅  | ✅  | ✅  |
| Ontdekking | ✅  | ✅  | ✅  | ✅  |
| Avontuur   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Dwarsdoorsnijdende Functies

- **Multi-user**: Beheer van individuele profielen met opgeslagen voortgang
- **Meertalig**: Ondersteuning voor Frans, Engels en Spaans
- **Aanpassing**: Avatars, kleurthema's, achtergronden
- **Toegankelijkheid**: Toetsenbordnavigatie, aanraakondersteuning, WCAG 2.1 AA-naleving
- **Mobiel responsief**: Interface geoptimaliseerd voor tablets en smartphones
- **Voortgangssysteem**: Scores, badges, dagelijkse uitdagingen

## 🚀 Snel aan de slag

### Vereisten

- Node.js (versie 16 of hoger)
- Een moderne webbrowser

### Installatie

```bash
# Kloon het project
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Installeer afhankelijkheden
npm install

# Start de ontwikkelserver (optie 1)
npm run serve
# De applicatie is toegankelijk op http://localhost:8080 (of de volgende beschikbare poort)

# Of met Python (optie 2)
python3 -m http.server 8000
# De applicatie is toegankelijk op http://localhost:8000
```

### Beschikbare Scripts

```bash
# Ontwikkeling
npm run serve          # Lokale server (http://localhost:8080)
npm run lint           # Codeverificatie met ESLint
npm run lint:fix       # Automatisch oplossen van ESLint-problemen
npm run format:check   # Codeformattering controleren (ALTIJD vóór commit)
npm run format         # Code formatteren met Prettier
npm run verify         # Kwaliteitspoort: lint + test + coverage

# Tests
npm run test           # Alle tests uitvoeren (CJS)
npm run test:watch     # Tests in watch-modus
npm run test:coverage  # Tests met dekkingsrapport
npm run test:core      # Alleen tests voor kernmodules
npm run test:integration # Integratietests
npm run test:storage   # Opslagsysteemtests
npm run test:esm       # ESM-tests (mappen tests-esm/, Jest vm-modules)
npm run test:verbose   # Tests met gedetailleerde uitvoer
npm run test:pwa-offline # PWA offline test (vereist Puppeteer), na `npm run serve`

# Analyse en Onderhoud
npm run analyze:jsdoc  # Documentatieanalyse
npm run improve:jsdoc  # Automatische JSDoc-verbetering
npm run audit:mobile   # Mobiele responsiviteitstests
npm run audit:accessibility # Toegankelijkheidstests
npm run dead-code      # Detectie van ongebruikte code
npm run analyze:globals # Analyse van globale variabelen
npm run analyze:dependencies # Analyse van afhankelijkheidsgebruik
npm run verify:cleanup # Gecombineerde analyse (dode code + globaal)

# Assetbeheer
npm run assets:generate    # Responsieve afbeeldingen genereren
npm run assets:backgrounds # Achtergronden converteren naar WebP
npm run assets:analyze     # Analyse van responsieve assets
npm run assets:diff        # Assetvergelijking

# Internationalisering
npm run i18n:verify    # Consistentie van vertaalsleutels verifiëren
npm run i18n:unused    # Ongebruikte vertaalsleutels weergeven
npm run i18n:compare   # Vertalingen (en/es) vergelijken met fr.json (referentie)

# Build & Levering
npm run build          # Productiebuild (Rollup) + postbuild (complete dist/)
npm run serve:dist     # Serveer dist/ op http://localhost:5000 (of beschikbare poort)

# PWA en Service Worker
npm run sw:disable     # Service worker uitschakelen
npm run sw:fix         # Service worker problemen oplossen
```

## 🏗️ Architectuur

### Bestandsstructuur

```
leapmultix/
├── index.html              # Hoofdingangspunt
├── js/
│   ├── core/               # ES6 kernmodules
│   │   ├── GameMode.js     # Basisklasse voor modi
│   │   ├── GameModeManager.js # Spelmodusbeheer
│   │   ├── storage.js      # LocalStorage API
│   │   ├── audio.js        # Geluidsbeheer
│   │   ├── utils.js        # Generieke hulpprogramma's (canonieke bron)
│   │   ├── eventBus.js     # Gebeurteniscommunicatie
│   │   ├── userState.js    # Gebruikerssessiebeheer
│   │   ├── mainInit.js     # DOM-ready initialisatie
│   │   ├── theme.js        # Themasysteem
│   │   ├── userUi.js       # Gebruikersinterface-hulpprogramma's
│   │   ├── parental.js     # Ouderlijk toezicht
│   │   ├── adventure-data.js # Gegevens avontuurmodus
│   │   ├── mult-stats.js   # Vermenigvuldigingsstatistieken
│   │   ├── challenge-stats.js # Uitdagingsstatistieken
│   │   └── daily-challenge.js # Beheer dagelijkse uitdagingen
│   ├── components/         # Herbruikbare UI-componenten
│   │   ├── topBar.js       # Navigatiebalk
│   │   ├── infoBar.js      # Spelinformatiebalken
│   │   ├── dashboard.js    # Gebruikersdashboard
│   │   └── customization.js # Aanpassingsinterface
│   ├── modes/              # Spelmodi
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Arcade minigames
│   │   ├── arcade.js       # Hoofd arcade-orkestrator
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Geheugenspel (31 KB)
│   │   ├── arcade-multimiam.js # MultiMiam integratie
│   │   ├── arcade-multisnake.js # Snake integratie
│   │   ├── arcade-common.js, arcade-utils.js # Gedeelde hulpprogramma's
│   │   ├── arcade-message.js, arcade-points.js # UI-componenten
│   │   └── arcade-scores.js # Scorebeheer
│   ├── multimiam/          # Pac-Man spel (ontlede architectuur)
│   │   ├── multimiam.js    # Hoofdcontroller
│   │   ├── multimiam-engine.js # Spelengine (15 KB)
│   │   ├── multimiam-renderer.js # Rendersysteem (9 KB)
│   │   ├── multimiam-controls.js # Besturingsbeheer (7 KB)
│   │   ├── multimiam-questions.js # Vraaggeneratie (6 KB)
│   │   └── multimiam-ui.js # Interface-elementen
│   ├── multisnake.js       # Snake spel (38 KB)
│   ├── navigation/         # Navigatiesysteem
│   │   ├── slides.js       # Slide-gebaseerde navigatie (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Toetsenbordondersteuning
│   ├── ui/                 # Gebruikersinterface en feedback
│   │   ├── uiUtils.js      # Interface-hulpprogramma's
│   │   ├── ui-feedback.js  # Feedbackmechanismen
│   │   ├── touch-support.js # Aanraakondersteuning (7 KB)
│   │   ├── virtual-keyboard.js # Virtueel toetsenbord
│   │   ├── coin-display.js, coin-effects.js # Valutasysteem
│   │   ├── notifications.js # Meldingensysteem
│   │   └── badges.js       # Badgesysteem
│   ├── media/              # Mediabeheer
│   │   ├── VideoManager.js # Videoweergavebeheer (12 KB)
│   │   └── responsive-image-loader.js # Afbeeldingen laden (9 KB)
│   ├── orchestration/      # Orkestratie en laden
│   │   ├── mode-orchestrator.js # Modus wisselen
│   │   ├── lazy-loader.js  # Dynamisch laden (10 KB)
│   │   └── game-cleanup.js # Statusopschoning
│   ├── utils/              # Hulpprogramma's
│   │   ├── utils-es6.js    # Hoofdaggregator (5 KB)
│   │   ├── main-helpers.js # Applicatie-helpers
│   │   ├── helpers.js      # Oude helperfuncties
│   │   ├── stats-utils.js  # Statistiekhulpprogramma's
│   │   ├── difficulty.js   # Moeilijkheidsbeheer
│   │   └── questionGenerator.js # Vraaggeneratie
│   ├── storage/            # Opslag en status
│   │   ├── storage.js      # Oude opslagwrapper
│   │   └── userManager.js  # Multi-user beheer (19 KB)
│   ├── i18n/               # Internationalisering
│   │   ├── i18n.js         # i18n-systeem
│   │   └── i18n-store.js   # Vertalingsopslag
│   ├── security/           # Beveiliging en foutafhandeling
│   │   ├── security-utils.js # XSS-bescherming, opschoning
│   │   ├── error-handlers.js # Globale foutafhandeling
│   │   └── logger.js       # Loggingsysteem
│   ├── accessibility/      # Toegankelijkheid
│   │   ├── accessibility.js # Toegankelijkheidsfuncties
│   │   └── speech.js       # Spraaksyntheseondersteuning
│   ├── integration/        # Integratie en analyse
│   │   ├── plausible-init.js # Plausible analytics
│   │   ├── cache-updater.js # Cachebeheer (10 KB)
│   │   └── imports.js      # Import-hulpprogramma's
│   ├── main-es6.js         # ES6-ingangspunt
│   ├── main.js             # Hoofdorkestrator
│   ├── bootstrap.js        # ES6 gebeurtenisafhandelaars setup
│   └── game.js             # Statusbeheer en dagelijkse uitdagingen
├── css/                    # Modulaire stijlen
├── assets/                 # Bronnen
│   ├── images/             # Afbeeldingen en sprites
│   ├── generated-images/   # Gegenereerde responsieve afbeeldingen
│   ├── sounds/             # Geluidseffecten
│   ├── translations/       # Vertaalbestanden (fr, en, es)
│   └── videos/             # Instructievideo's
├── tests/                  # Geautomatiseerde tests
│   ├── __tests__/          # Unit- en integratietests
│   └── tests-esm/          # ESM-tests (.mjs)
├── scripts/                # Onderhoudsscripts
│   ├── compare-translations.cjs # Vertalingsvergelijking
│   └── cleanup-i18n-keys.cjs # i18n-sleutelopschoning
└── dist/                   # Productiebuild (gegenereerd)
```

### Technische Architectuur

**Moderne ES6 Modules**: Het project gebruikt een modulaire architectuur met ES6-klassen en native imports/exports.

**Herbruikbare Componenten**: Interface gebouwd met gecentraliseerde UI-componenten (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligent on-demand laden van modules via `lazy-loader.js` om de initiële prestaties te optimaliseren.

**Uniform Opslagsysteem**: Gecentraliseerde API voor persistentie van gebruikersgegevens via LocalStorage met fallbacks.

**Gecentraliseerd Audiobeheer**: Geluidsregeling met meertalige ondersteuning en voorkeuren per gebruiker.

**Event Bus**: Ontkoppelde gebeurtenisgestuurde communicatie tussen componenten voor een onderhoudbare architectuur.

**Slide Navigatie**: Navigatiesysteem gebaseerd op genummerde dia's (slide0, slide1, enz.) met `goToSlide()`.

**Beveiliging**: XSS-bescherming en opschoning via `security-utils.js` voor alle DOM-manipulaties.

## 🎯 Gedetailleerde Spelmodi

### Ontdekkingsmodus

Visuele verkenningsinterface voor tafels van vermenigvuldiging met:

- Interactieve visualisatie van vermenigvuldigingen
- Animaties en geheugensteuntjes
- Educatieve drag-and-drop
- Vrije voortgang per tafel

### Quizmodus

Meerkeuzevragen met:

- 10 vragen per sessie
- Adaptieve voortgang op basis van succes
- Virtueel numeriek toetsenbord
- Streak-systeem (reeks juiste antwoorden)

### Uitdagingsmodus

Race tegen de klok met:

- 3 moeilijkheidsgraden (Beginner, Gemiddeld, Moeilijk)
- Tijdbonus voor juiste antwoorden
- Levenssysteem
- Leaderboard van beste scores

### Avontuurmodus

Verhalende voortgang met:

- 12 ontgrendelbare thematische niveaus
- Interactieve kaart met visuele voortgang
- Meeslepend verhaal met personages
- Sterren systeem en beloningen

### Arcade Minigames

Elke minigame biedt:

- Keuze uit moeilijkheidsgraad en aanpassing
- Levenssysteem en score
- Toetsenbord- en aanraakbediening
- Individuele leaderboards per gebruiker

## 🛠️ Ontwikkeling

### Ontwikkelingsworkflow

**BELANGRIJK: Commit nooit rechtstreeks naar main**

Het project gebruikt een workflow gebaseerd op feature branches:

1.  **Maak een branch**:

    ```bash
    git checkout -b feat/naam-van-feature
    # of
    git checkout -b fix/naam-van-bug
    ```

2.  **Ontwikkel en test**:

    ```bash
    npm run format:check  # Controleer ALTIJD eerst de formattering
    npm run format        # Formatteer indien nodig
    npm run lint          # Controleer codekwaliteit
    npm run test          # Voer tests uit
    npm run test:coverage # Controleer dekking
    ```

3.  **Commit naar de branch**:

    ```bash
    git add .
    git commit -m "feat: beschrijving van de feature"
    ```

4.  **Push en maak een Pull Request**:
    ```bash
    git push -u origin feat/naam-van-feature
    ```

**Commitstijl**: Beknopt, gebiedende wijs (bijv. "Fix arcade init errors", "Refactor cache updater")

**Kwaliteitspoort**: Zorg ervoor dat `npm run lint`, `npm test` en `npm run test:coverage` slagen vóór elke commit

### Componentarchitectuur

**GameMode (basisklasse)**: Alle modi erven van een gemeenschappelijke klasse met gestandaardiseerde methoden.

**GameModeManager**: Gecentraliseerde orkestratie van het starten en beheren van modi.

**UI Componenten**: TopBar, InfoBar, Dashboard en Customization bieden een consistente interface.

**Lazy Loading**: Modules worden op aanvraag geladen om de initiële prestaties te optimaliseren.

**Event Bus**: Ontkoppelde communicatie tussen componenten via het gebeurtenissysteem.

### Tests

Het project bevat een uitgebreide testsuite:

- Unittests voor kernmodules
- Integratietests voor componenten
- Spelmodustests
- Geautomatiseerde codedekking

```bash
npm test              # Alle tests (CJS)
npm test:core         # Kernmoduletests
npm test:integration  # Integratietests
npm test:coverage     # Dekkingsrapport
npm run test:esm      # ESM-tests (bijv. components/dashboard) via vm-modules
```

### Productiebuild

- **Rollup**: Bundelt `js/main-es6.js` in ESM met code-splitting en sourcemaps
- **Terser**: Automatische verkleining voor optimalisatie
- **Post-build**: Kopieert `css/` en `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, en herschrijft `dist/index.html` naar het gehashte invoerbestand (bijv. `main-es6-*.js`)
- **Uiteindelijke map**: `dist/` klaar om statisch te worden geserveerd

```bash
npm run build      # genereert dist/
npm run serve:dist # serveert dist/ (poort 5000)
```

### Continue Integratie

**GitHub Actions**: Geautomatiseerde pipeline in `.github/workflows/ci.yml`

De CI/CD-pipeline wordt automatisch uitgevoerd bij elke push en pull request:

**Hoofdtaken**:

1.  **build-test**: Hoofdvalidatietaak
    - Installatie afhankelijkheden: `npm ci`
    - Formatteringscontrole: `npm run format:check`
    - Statische analyse: `npm run lint`
    - Unittests: `npm run test`
    - Beveiligingsaudit: `npm audit`
    - Generatie dekkingsartefact

2.  **accessibility**: Toegankelijkheidsaudit (niet-blokkerend)
    - Voert `npm run audit:accessibility` uit
    - Genereert WCAG 2.1 AA toegankelijkheidsrapport

3.  **test-esm**: ES6 moduletests
    - Voert `npm run test:esm` uit met Jest VM modules
    - Valideert ES6 imports/exports

4.  **lighthouse**: Prestatie-audit (niet-blokkerend)
    - Mobiele prestatie-audit
    - Genereert Lighthouse-rapportartefacten
    - Core Web Vitals metrieken

**Kwaliteitsbadges**:

- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix is een volledige PWA met offline ondersteuning en installatiemogelijkheid.

**Service Worker** (`sw.js`):

- Navigatie: Network-first met offline fallback naar `offline.html`
- Afbeeldingen: Cache-first om prestaties te optimaliseren
- Vertalingen: Stale-while-revalidate voor updates op de achtergrond
- JS/CSS: Network-first om altijd de nieuwste versie te serveren
- Automatisch versiebeheer via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- en PNG-pictogrammen voor alle apparaten
- Installatie mogelijk op mobiel (Toevoegen aan startscherm)
- Standalone configuratie voor app-achtige ervaring
- Ondersteuning voor thema's en kleuren

**Offline modus lokaal testen**:

1.  Start de ontwikkelserver:

    ```bash
    npm run serve
    ```

    Open `http://localhost:8080` (of de weergegeven poort)

2.  Handmatig testen:
    - Verbreek het netwerk in DevTools (Network tabblad → Offline)
    - Vernieuw de pagina → `offline.html` wordt weergegeven

3.  Geautomatiseerde test (vereist Puppeteer):
    ```bash
    npm run test:pwa-offline
    ```

**Service Worker Beheerscripts**:

```bash
npm run sw:disable  # Service worker uitschakelen
npm run sw:fix      # Cacheproblemen oplossen
```

### Kwaliteitsnormen

**Codekwaliteitstools**:

- **ESLint**: Moderne configuratie met flat config (`eslint.config.js`), ES2022-ondersteuning
- **Prettier**: Automatische codeformattering (`.prettierrc`)
- **Stylelint**: CSS-validatie (`.stylelintrc.json`)
- **JSDoc**: Automatische functiedocumentatie met dekkingsanalyse

**Belangrijke Coderegels**:

- Verwijder ongebruikte variabelen en parameters (`no-unused-vars`)
- Gebruik specifieke foutafhandeling (geen lege catches)
- Vermijd `innerHTML` ten gunste van `security-utils.js` functies
- Houd cognitieve complexiteit < 15 voor functies
- Extraheer complexe functies in kleinere helpers

**Beveiliging**:

- **XSS-bescherming**: Gebruik functies van `security-utils.js`:
  - `appendSanitizedHTML()` in plaats van `innerHTML`
  - `createSafeElement()` om veilige elementen te maken
  - `setSafeMessage()` voor tekstinhoud
- **Externe Scripts**: `crossorigin="anonymous"` attribuut verplicht
- **Invoervalidatie**: Reinig altijd externe gegevens
- **Content Security Policy**: CSP-headers om scriptbronnen te beperken

**Toegankelijkheid**:

- WCAG 2.1 AA naleving
- Volledige toetsenbordnavigatie
- ARIA-rollen en geschikte labels
- Conform kleurcontrast

**Prestaties**:

- Lazy loading van modules via `lazy-loader.js`
- CSS- en responsieve asset-optimalisaties
- Service Worker voor intelligente caching
- Code splitting en verkleining in productie

## 📱 Compatibiliteit

### Ondersteunde Browsers

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Apparaten

- **Desktop**: Toetsenbord- en muisbesturing
- **Tablets**: Geoptimaliseerde aanraakinterface
- **Smartphones**: Adaptief responsief ontwerp

### Toegankelijkheid

- Volledige toetsenbordnavigatie (Tab, Pijlen, Escape)
- ARIA-rollen en labels voor schermlezers
- Conform kleurcontrast
- Ondersteuning voor ondersteunende technologie

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
  "menu_start": "Starten",
  "quiz_correct": "Goed gedaan!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n Beheerscripts

**`npm run i18n:verify`** - Consistentie van vertaalsleutels verifiëren

**`npm run i18n:unused`** - Ongebruikte vertaalsleutels weergeven

**`npm run i18n:compare`** - Vertaalbestanden vergelijken met fr.json (referentie)

Dit script (`scripts/compare-translations.cjs`) zorgt voor synchronisatie van alle taalbestanden:

**Functies:**

- Detectie van ontbrekende sleutels (aanwezig in fr.json maar afwezig in andere talen)
- Detectie van extra sleutels (aanwezig in andere talen maar niet in fr.json)
- Identificatie van lege waarden (`""`, `null`, `undefined`, `[]`)
- Typeconsistentiecontrole (string vs array)
- Afvlakken van geneste JSON-structuren naar puntnotatie (bijv. `arcade.multiMemory.title`)
- Generatie van gedetailleerd consolerapport
- Opslaan van JSON-rapport in `docs/translations-comparison-report.json`

**Uitvoervoorbeeld:**

```
🔍 Vergelijkende analyse van vertaalbestanden

📚 Referentietaal: fr.json
✅ fr.json: 335 sleutels

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse van en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Totaal sleutels: 335
✅ Geen ontbrekende sleutels
✅ Geen extra sleutels
✅ Geen lege waarden

📊 EINDRESUMÉ
  fr.json: 335 sleutels
  en.json: 335 sleutels
  es.json: 335 sleutels

✅ Alle vertaalbestanden zijn perfect gesynchroniseerd!
```

**Vertalingsdekking:**

- Volledige gebruikersinterface
- Spelinstructies
- Fout- en feedbackberichten
- Beschrijvingen en contextuele hulp
- Verhalende inhoud avontuurmodus
- Toegankelijkheids- en ARIA-labels

## 📊 Gegevensopslag

### Gebruikersgegevens

- Profielen en voorkeuren
- Voortgang per spelmodus
- Arcade spelscores en statistieken
- Aanpassingsinstellingen

### Technische Functies

- Lokale opslag (localStorage) met fallbacks
- Gegevensisolatie per gebruiker
- Automatisch opslaan van voortgang
- Automatische migratie van oude gegevens

## 🐛 Een probleem melden

Problemen kunnen worden gemeld via GitHub issues. Vermeld alstublieft:

- Gedetailleerde beschrijving van het probleem
- Stappen om te reproduceren
- Browser en versie
- Screenshots indien relevant

## 💝 Steun het project

**[☕ Doneer via PayPal](https://paypal.me/jls)**

## 📄 Licentie

Dit project is gelicentieerd onder de AGPL v3 licentie. Zie het bestand `LICENSE` voor meer details.

---

_LeapMultix - Moderne educatieve applicatie voor het leren van tafels van vermenigvuldiging_

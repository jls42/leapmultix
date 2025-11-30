<details>
<summary>Dit document is ook beschikbaar in andere talen</summary>

- [Français](./README.md)
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
- [Probleem melden](#-probleem-melden)
- [Licentie](#-licentie)

## Beschrijving

LeapMultix is een moderne interactieve educatieve webapplicatie ontworpen voor kinderen (8–12 jaar) om de 4 rekenkundige bewerkingen te beheersen: vermenigvuldigen (×), optellen (+), aftrekken (−) en delen (÷). De app biedt **5 spelmodi** en **4 arcade minigames** in een intuïtieve, toegankelijke en meertalige interface.

**Ondersteuning voor meerdere bewerkingen:** Quiz- en Uitdagingsmodi maken oefenen met alle bewerkingen mogelijk. Ontdekkings-, Avonturen- en Arcademodi richten zich op vermenigvuldigen.

**Ontwikkeld door:** Julien LS (contact@jls42.org)

**Online URL:** https://leapmultix.jls42.org/

## ✨ Functies

### 🎮 Spelmodi

- **Ontdekkingsmodus**: Visuele en interactieve verkenning van de tafels van vermenigvuldiging
- **Quizmodus** ⭐: Meerkeuzevragen met ondersteuning voor alle 4 bewerkingen (×, +, −, ÷) en adaptieve voortgang
- **Uitdagingsmodus** ⭐: Race tegen de klok met alle 4 bewerkingen (×, +, −, ÷) en verschillende moeilijkheidsgraden
- **Avonturenmodus**: Verhalende voortgang door niveaus met interactieve kaart (vermenigvuldigen)

⭐ = Volledige ondersteuning voor alle 4 rekenkundige bewerkingen

### 🕹️ Arcade Minigames

- **MultiInvaders**: Educatieve Space Invaders - Vernietig de foute antwoorden (vermenigvuldigen)
- **MultiMiam**: Wiskundige Pac-Man - Verzamel de juiste antwoorden (vermenigvuldigen)
- **MultiMemory**: Geheugenspel - Combineer vermenigvuldigingen met hun uitkomsten
- **MultiSnake**: Educatieve Snake - Groei door de juiste getallen te eten (vermenigvuldigen)

### ➕ Ondersteuning voor Meerdere Bewerkingen

LeapMultix gaat verder dan simpel vermenigvuldigen door een complete training voor de 4 rekenkundige bewerkingen aan te bieden:

| Modus      | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Uitdaging  | ✅  | ✅  | ✅  | ✅  |
| Ontdekking | ✅  | ❌  | ❌  | ❌  |
| Avontuur   | ✅  | ❌  | ❌  | ❌  |
| Arcade     | ✅  | ❌  | ❌  | ❌  |

**Opmerking:** Ondersteuning voor bewerkingen voor Ontdekkings-, Avonturen- en Arcademodi is gepland voor een toekomstige versie.

### 🌍 Cross-functionele Functies

- **Multi-gebruiker**: Beheer van individuele profielen met opgeslagen voortgang
- **Meertalig**: Ondersteuning voor Frans, Engels en Spaans
- **Aanpassing**: Avatars, kleurthema's, achtergronden
- **Toegankelijkheid**: Toetsenbordnavigatie, aanraakondersteuning, WCAG 2.1 AA-conformiteit
- **Mobiel responsief**: Geoptimaliseerde interface voor tablets en smartphones
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

# Start ontwikkelserver (optie 1)
npm run serve
# De applicatie zal toegankelijk zijn op http://localhost:8080 (of volgende beschikbare poort)

# Of met Python (optie 2)
python3 -m http.server 8000
# De applicatie zal toegankelijk zijn op http://localhost:8000
```

### Beschikbare scripts

```bash
# Ontwikkeling
npm run serve          # Lokale server (http://localhost:8080)
npm run lint           # Code controleren met ESLint
npm run lint:fix       # ESLint-problemen automatisch oplossen
npm run format:check   # Codeformattering controleren (ALTIJD voor commit)
npm run format         # Code formatteren met Prettier
npm run verify         # Quality gate: lint + test + coverage

# Tests
npm run test           # Alle tests uitvoeren (CJS)
npm run test:watch     # Tests in watch-modus
npm run test:coverage  # Tests met dekkingsrapport
npm run test:core      # Alleen tests voor core-modules
npm run test:integration # Integratietests
npm run test:storage   # Opslagsysteemtests
npm run test:esm       # ESM tests (tests-esm/ map, Jest vm-modules)
npm run test:verbose   # Tests met gedetailleerde uitvoer
npm run test:pwa-offline # PWA offline test (vereist Puppeteer), na `npm run serve`

# Analyse en onderhoud
npm run analyze:jsdoc  # Documentatie-analyse
npm run improve:jsdoc  # Automatische JSDoc-verbetering
npm run audit:mobile   # Mobiele responsiviteitstests
npm run audit:accessibility # Toegankelijkheidstests
npm run dead-code      # Ongebruikte code detectie
npm run analyze:globals # Analyse globale variabelen
npm run analyze:dependencies # Analyse afhankelijkheidsgebruik
npm run verify:cleanup # Gecombineerde analyse (dode code + globals)

# Assetbeheer
npm run assets:generate    # Responsieve afbeeldingen genereren
npm run assets:backgrounds # Achtergronden converteren naar WebP
npm run assets:analyze     # Analyse responsieve assets
npm run assets:diff        # Vergelijking assets

# Internationalisatie
npm run i18n:verify    # Consistentie vertaalsleutels verifiëren
npm run i18n:unused    # Ongebruikte vertaalsleutels oplijsten
npm run i18n:compare   # Vertalingen vergelijken (en/es) met fr.json (referentie)

# Build & levering
npm run build          # Productiebuild (Rollup) + postbuild (volledige dist/)
npm run serve:dist     # dist/ serveren op http://localhost:5000 (of beschikbare poort)

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
│   ├── core/               # Core ES6 modules
│   │   ├── GameMode.js     # Basisklasse voor modi
│   │   ├── GameModeManager.js # Spelmodusbeheer
│   │   ├── storage.js      # LocalStorage API
│   │   ├── audio.js        # Geluidsbeheer
│   │   ├── utils.js        # Generieke hulpprogramma's (canonieke bron)
│   │   ├── eventBus.js     # Event-communicatie
│   │   ├── userState.js    # Gebruikerssessiebeheer
│   │   ├── mainInit.js     # DOM-ready initialisatie
│   │   ├── theme.js        # Themasysteem
│   │   ├── userUi.js       # Gebruikersinterface hulpprogramma's
│   │   ├── parental.js     # Ouderlijk toezicht
│   │   ├── adventure-data.js # Gegevens avonturenmodus
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
│   │   ├── arcade-multimiam.js # Multimiam integratie
│   │   ├── arcade-multisnake.js # Snake integratie
│   │   ├── arcade-common.js, arcade-utils.js # Gedeelde hulpprogramma's
│   │   ├── arcade-message.js, arcade-points.js # UI-componenten
│   │   └── arcade-scores.js # Scorebeheer
│   ├── multimiam/          # Pac-Man spel (ontbonden architectuur)
│   │   ├── multimiam.js    # Hoofdcontroller
│   │   ├── multimiam-engine.js # Game-engine (15 KB)
│   │   ├── multimiam-renderer.js # Rendersysteem (9 KB)
│   │   ├── multimiam-controls.js # Besturingsbeheer (7 KB)
│   │   ├── multimiam-questions.js # Vragengeneratie (6 KB)
│   │   └── multimiam-ui.js # Interface-elementen
│   ├── multisnake.js       # Snake spel (38 KB)
│   ├── navigation/         # Navigatiesysteem
│   │   ├── slides.js       # Slide-gebaseerde navigatie (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Toetsenbordondersteuning
│   ├── ui/                 # Gebruikersinterface en feedback
│   │   ├── uiUtils.js      # Interface hulpprogramma's
│   │   ├── ui-feedback.js  # Feedbackmechanismen
│   │   ├── touch-support.js # Aanraakondersteuning (7 KB)
│   │   ├── virtual-keyboard.js # Virtueel toetsenbord
│   │   ├── coin-display.js, coin-effects.js # Valutasysteem
│   │   ├── notifications.js # Notificatiesysteem
│   │   └── badges.js       # Badgesysteem
│   ├── media/              # Mediabeheer
│   │   ├── VideoManager.js # Videoweergavebeheer (12 KB)
│   │   └── responsive-image-loader.js # Afbeeldingen laden (9 KB)
│   ├── orchestration/      # Orkestratie en laden
│   │   ├── mode-orchestrator.js # Moduswisseling
│   │   ├── lazy-loader.js  # Dynamisch laden (10 KB)
│   │   └── game-cleanup.js # Statusopschoning
│   ├── utils/              # Hulpprogramma's
│   │   ├── utils-es6.js    # Hoofdaggregator (5 KB)
│   │   ├── main-helpers.js # Applicatiehelpers
│   │   ├── helpers.js      # Legacy helperfuncties
│   │   ├── stats-utils.js  # Statistiekhulpprogramma's
│   │   ├── difficulty.js   # Moeilijkheidsgraadbeheer
│   │   └── questionGenerator.js # Vragengeneratie
│   ├── storage/            # Opslag en status
│   │   ├── storage.js      # Legacy opslagwrapper
│   │   └── userManager.js  # Multi-gebruikersbeheer (19 KB)
│   ├── i18n/               # Internationalisatie
│   │   ├── i18n.js         # i18n-systeem
│   │   └── i18n-store.js   # Vertalingenopslag
│   ├── security/           # Beveiliging en foutafhandeling
│   │   ├── security-utils.js # XSS-bescherming, opschoning
│   │   ├── error-handlers.js # Globale foutafhandeling
│   │   └── logger.js       # Loggingsysteem
│   ├── accessibility/      # Toegankelijkheid
│   │   ├── accessibility.js # Toegankelijkheidsfuncties
│   │   └── speech.js       # Tekst-naar-spraak ondersteuning
│   ├── integration/        # Integratie en analytics
│   │   ├── plausible-init.js # Plausible analytics
│   │   ├── cache-updater.js # Cachebeheer (10 KB)
│   │   └── imports.js      # Importhulpprogramma's
│   ├── main-es6.js         # ES6-ingangspunt
│   ├── main.js             # Hoofdorkestrator
│   ├── bootstrap.js        # ES6 event handlers setup
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
│   └── tests-esm/          # ESM tests (.mjs)
├── scripts/                # Onderhoudsscripts
│   ├── compare-translations.cjs # Vertalingen vergelijken
│   └── cleanup-i18n-keys.cjs # i18n-sleutels opschonen
└── dist/                   # Productiebuild (gegenereerd)
```

### Technische Architectuur

**Moderne ES6 Modules**: Het project gebruikt een modulaire architectuur met ES6-klassen en native imports/exports.

**Herbruikbare Componenten**: Interface gebouwd met gecentraliseerde UI-componenten (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligent laden van modules op aanvraag via `lazy-loader.js` om initiële prestaties te optimaliseren.

**Verenigd Opslagsysteem**: Gecentraliseerde API voor persistentie van gebruikersgegevens via LocalStorage met fallbacks.

**Gecentraliseerd Audiobeheer**: Geluidscontrole met meertalige ondersteuning en voorkeuren per gebruiker.

**Event Bus**: Losgekoppelde event-gebaseerde communicatie tussen componenten voor een onderhoudbare architectuur.

**Slide Navigatie**: Op slides gebaseerd navigatiesysteem (slide0, slide1, enz.) met `goToSlide()`.

**Beveiliging**: XSS-bescherming en opschoning via `security-utils.js` voor alle DOM-manipulaties.

## 🎯 Gedetailleerde Spelmodi

### Ontdekkingsmodus

Visuele interface voor het verkennen van vermenigvuldigingstabellen met:

- Interactieve vermenigvuldigingsvisualisatie
- Animaties en geheugensteuntjes
- Educatieve drag-and-drop
- Vrije voortgang per tafel

### Quizmodus

Meerkeuzevragen met:

- 10 vragen per sessie
- Adaptieve voortgang op basis van succes
- Virtueel numeriek toetsenblok
- Streak-systeem (reeks juiste antwoorden)

### Uitdagingsmodus

Race tegen de klok met:

- 3 moeilijkheidsgraden (Beginner, Gemiddeld, Moeilijk)
- Tijd bonus voor juiste antwoorden
- Levenssysteem
- Highscore-ranglijst

### Avonturenmodus

Verhalende voortgang met:

- 12 vrij te spelen thematische niveaus
- Interactieve kaart met visuele voortgang
- Meeslepend verhaal met personages
- Sterren- en beloningssysteem

### Arcade Minigames

Elke minigame biedt:

- Keuze uit moeilijkheidsgraad en aanpassing
- Levens- en scoresysteem
- Toetsenbord- en aanraakbediening
- Individuele ranglijsten per gebruiker

## 🛠️ Ontwikkeling

### Ontwikkelingsworkflow

**BELANGRIJK: Nooit rechtstreeks naar main committen**

Het project gebruikt een workflow gebaseerd op feature branches:

1. **Maak een branch**:

   ```bash
   git checkout -b feat/naam-van-functie
   # of
   git checkout -b fix/naam-van-bug
   ```

2. **Ontwikkel en test**:

   ```bash
   npm run format:check  # ALTIJD eerst formattering controleren
   npm run format        # Formatteren indien nodig
   npm run lint          # Codekwaliteit controleren
   npm run test          # Tests uitvoeren
   npm run test:coverage # Dekking controleren
   ```

3. **Commit op de branch**:

   ```bash
   git add .
   git commit -m "feat: beschrijving van de functie"
   ```

4. **Push en maak een Pull Request**:
   ```bash
   git push -u origin feat/naam-van-functie
   ```

**Commit-stijl**: Beknopt, gebiedende wijs (bijv. "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Zorg ervoor dat `npm run lint`, `npm test` en `npm run test:coverage` slagen voor elke commit

### Componentarchitectuur

**GameMode (basisklasse)**: Alle modi erven van een gemeenschappelijke klasse met gestandaardiseerde methoden.

**GameModeManager**: Gecentraliseerde orkestratie van starten en beheren van modi.

**UI-componenten**: TopBar, InfoBar, Dashboard en Customization bieden een consistente interface.

**Lazy Loading**: Modules worden op aanvraag geladen om initiële prestaties te optimaliseren.

**Event Bus**: Losgekoppelde communicatie tussen componenten via het eventsysteem.

### Tests

Het project bevat een uitgebreide testsuite:

- Unittests voor core-modules
- Integratietests voor componenten
- Spelmodustests
- Geautomatiseerde code-dekking

```bash
npm test              # Alle tests (CJS)
npm test:core         # Core module tests
npm test:integration  # Integratietests
npm test:coverage     # Dekkingsrapport
npm run test:esm      # ESM tests (bijv. components/dashboard) via vm-modules
```

### Productiebuild

- **Rollup**: Bundelt `js/main-es6.js` in ESM met code-splitting en sourcemaps
- **Terser**: Automatische minificatie voor optimalisatie
- **Post-build**: Kopieert `css/` en `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, en herschrijft `dist/index.html` naar het gehashte invoerbestand (bijv. `main-es6-*.js`)
- **Eindmap**: `dist/` klaar om statisch geserveerd te worden

```bash
npm run build      # genereert dist/
npm run serve:dist # serveert dist/ (poort 5000)
```

### Continue Integratie

**GitHub Actions**: Geautomatiseerde pijplijn in `.github/workflows/ci.yml`

De CI/CD-pijplijn draait automatisch bij elke push en pull request:

**Hoofdtaken**:

1. **build-test**: Hoofdvalidatietaak
   - Installatie afhankelijkheden: `npm ci`
   - Formatteringscontrole: `npm run format:check`
   - Statische analyse: `npm run lint`
   - Unittests: `npm run test`
   - Beveiligingsaudit: `npm audit`
   - Generatie dekkingsartefact

2. **accessibility**: Toegankelijkheidsaudit (niet-blokkerend)
   - Voert `npm run audit:accessibility` uit
   - Genereert WCAG 2.1 AA toegankelijkheidsrapport

3. **test-esm**: ES6 module tests
   - Voert `npm run test:esm` uit met Jest VM modules
   - Valideert ES6 imports/exports

4. **lighthouse**: Prestatie-audit (niet-blokkerend)
   - Mobiele prestatie-audit
   - Generatie Lighthouse rapport artefacten
   - Core Web Vitals statistieken

**Kwaliteitsbadges**:

- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix is een volledige PWA met offline ondersteuning en installeerbaarheid.

**Service Worker** (`sw.js`):

- Navigatie: Network-first met offline fallback naar `offline.html`
- Afbeeldingen: Cache-first om prestaties te optimaliseren
- Vertalingen: Stale-while-revalidate voor updates op de achtergrond
- JS/CSS: Network-first om altijd de laatste versie te serveren
- Automatisch versiebeheer via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- en PNG-pictogrammen voor alle apparaten
- Installeerbaar op mobiel (Toevoegen aan startscherm)
- Standalone configuratie voor app-achtige ervaring
- Thema- en kleurondersteuning

**Offline modus lokaal testen**:

1. Start de ontwikkelserver:

   ```bash
   npm run serve
   ```

   Open `http://localhost:8080` (of de weergegeven poort)

2. Handmatige test:
   - Schakel netwerk uit in DevTools (Tabblad Network → Offline)
   - Vernieuw de pagina → `offline.html` wordt weergegeven

3. Geautomatiseerde test (Vereist Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Service Worker beheerscripts**:

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

**Belangrijke coderegels**:

- Verwijder ongebruikte variabelen en parameters (`no-unused-vars`)
- Gebruik specifieke foutafhandeling (geen lege catch-blokken)
- Vermijd `innerHTML` ten gunste van `security-utils.js` functies
- Houd cognitieve complexiteit voor functies onder 15
- Extraheer complexe functies in kleinere helpers

**Beveiliging**:

- **XSS-bescherming**: Gebruik `security-utils.js` functies:
  - `appendSanitizedHTML()` in plaats van `innerHTML`
  - `createSafeElement()` voor veilig elementen maken
  - `setSafeMessage()` voor tekstinhoud
- **Externe Scripts**: Attribuut `crossorigin="anonymous"` verplicht
- **Invoervalidatie**: Sanitize altijd externe gegevens
- **Content Security Policy**: CSP-headers om scriptbronnen te beperken

**Toegankelijkheid**:

- WCAG 2.1 AA conformiteit
- Volledige toetsenbordnavigatie
- ARIA-rollen en passende labels
- Conforme kleurcontrasten

**Prestaties**:

- Lazy loading van modules via `lazy-loader.js`
- CSS en responsieve asset-optimalisaties
- Service Worker voor intelligente caching
- Code splitting en minificatie in productie

## 📱 Compatibiliteit

### Ondersteunde browsers

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Apparaten

- **Desktop**: Toetsenbord- en muisbediening
- **Tablets**: Geoptimaliseerde aanraakinterface
- **Smartphones**: Adaptief responsief ontwerp

### Toegankelijkheid

- Volledige toetsenbordnavigatie (Tab, pijlen, Esc)
- ARIA-rollen en labels voor schermlezers
- Conforme kleurcontrasten
- Ondersteuning voor ondersteunende technologieën

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

### i18n beheerscripts

**`npm run i18n:verify`** - Vertaalsleutelconsistentie verifiëren

**`npm run i18n:unused`** - Ongebruikte vertaalsleutels oplijsten

**`npm run i18n:compare`** - Vertaalbestanden vergelijken met fr.json (referentie)

Dit script (`scripts/compare-translations.cjs`) zorgt voor synchronisatie van alle taalbestanden:

**Functies:**

- Detectie van ontbrekende sleutels (aanwezig in fr.json maar afwezig in andere talen)
- Detectie van extra sleutels (aanwezig in andere talen maar niet in fr.json)
- Identificatie van lege waarden (`""`, `null`, `undefined`, `[]`)
- Consistentiecontrole van typen (string vs array)
- Afvlakken van geneste JSON-structuren naar puntnotatie (bijv. `arcade.multiMemory.title`)
- Generatie van gedetailleerd consolerapport
- JSON-rapport opslaan in `docs/translations-comparison-report.json`

**Voorbeelduitvoer:**

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

📊 EINDSAMENVATTING
  fr.json: 335 sleutels
  en.json: 335 sleutels
  es.json: 335 sleutels

✅ Alle vertaalbestanden zijn perfect gesynchroniseerd!
```

**Vertaaldekking:**

- Volledige gebruikersinterface
- Spelinstructies
- Fout- en feedbackberichten
- Beschrijvingen en contextgevoelige hulp
- Verhalende inhoud avonturenmodus
- Toegankelijkheidslabels en ARIA

## 📊 Gegevensopslag

### Gebruikersgegevens

- Profielen en voorkeuren
- Voortgang per spelmodus
- Scores en statistieken arcade games
- Aanpassingsinstellingen

### Technische functies

- Lokale opslag (localStorage) met fallbacks
- Gegevensisolatie per gebruiker
- Automatisch opslaan van voortgang
- Automatische migratie van oude gegevens

## 🐛 Probleem melden

Problemen kunnen gemeld worden via GitHub issues. Vermeld alstublieft:

- Gedetailleerde beschrijving van het probleem
- Stappen om het te reproduceren
- Browser en versie
- Screenshots indien relevant

## 💝 Steun het project

**[☕ Doneer via PayPal](https://paypal.me/jls)**

## 📄 Licentie

Dit project valt onder de AGPL v3 licentie. Zie het bestand `LICENSE` voor meer details.

---

_LeapMultix - Moderne educatieve applicatie voor het leren van de tafels van vermenigvuldiging_

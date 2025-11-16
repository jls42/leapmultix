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

<!-- Badges (update <owner>/<repo> na GitHub-migratie) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Inhoudsopgave

- [Beschrijving](#beschrijving)
- [Functies](#-functies)
- [Snelstart](#-snelstart)
- [Architectuur](#-architectuur)
- [Gedetailleerde Spelmodi](#-gedetailleerde-spelmodi)
- [Ontwikkeling](#-ontwikkeling)
- [Compatibiliteit](#-compatibiliteit)
- [Lokalisatie](#-lokalisatie)
- [Gegevensopslag](#-gegevensopslag)
- [Een probleem melden](#-een-probleem-melden)
- [Licentie](#-licentie)

## Beschrijving

LeapMultix is een moderne, interactieve educatieve webapplicatie voor kinderen (8-12 jaar) om de tafels van vermenigvuldiging onder de knie te krijgen. De applicatie biedt **4 klassieke spelmodi** en **4 arcade-minigames** in een intuïtieve, toegankelijke en meertalige interface.

**Ontwikkeld door:** Julien LS (contact@jls42.org)

**Online URL:** https://leapmultix.jls42.org/

## ✨ Functies

### 🎮 Spelmodi

- **Ontdekkingsmodus**: Visuele en interactieve verkenning van de tafels van vermenigvuldiging
- **Quizmodus**: Meerkeuzevragen met adaptieve voortgang
- **Uitdagingsmodus**: Race tegen de klok met verschillende moeilijkheidsgraden
- **Avontuurmodus**: Verhalende voortgang door levels met een interactieve kaart

### 🕹️ Arcade-minigames

- **MultiInvaders**: Educatieve Space Invaders - Vernietig de foute antwoorden
- **MultiMiam**: Wiskundige Pac-Man - Verzamel de juiste antwoorden
- **MultiMemory**: Geheugenspel - Koppel vermenigvuldigingen aan resultaten
- **MultiSnake**: Educatieve Snake - Groei door de juiste getallen te eten

### 🌍 Overkoepelende functies

- **Multi-user**: Beheer van individuele profielen met opgeslagen voortgang
- **Meertalig**: Ondersteuning voor Frans, Engels en Spaans
- **Personalisatie**: Avatars, kleurenthema's, achtergronden
- **Toegankelijkheid**: Toetsenbordnavigatie, touch-ondersteuning, WCAG 2.1 AA-conformiteit
- **Mobiel responsief**: Geoptimaliseerde interface voor tablets en smartphones
- **Voortgangssysteem**: Scores, badges, dagelijkse uitdagingen

## 🚀 Snelstart

### Vereisten

- Node.js (versie 16 of hoger)
- Een moderne webbrowser

### Installatie

```bash
# Kloon het project
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Installeer de afhankelijkheden
npm install

# Start de ontwikkelserver (optie 1)
npm run serve
# De applicatie is toegankelijk op http://localhost:8080 (of de volgende beschikbare poort)

# Of met Python (optie 2)
python3 -m http.server 8000
# De applicatie is toegankelijk op http://localhost:8000
```

### Beschikbare scripts

```bash
# Ontwikkeling
npm run serve          # Lokale server (http://localhost:8080)
npm run lint           # Codecontrole met ESLint
npm run lint:fix       # Automatische correctie van ESLint-problemen
npm run format:check   # Controleer de code-opmaak (ALTIJD voor het committen)
npm run format         # Code opmaken met Prettier
npm run verify         # Kwaliteitspoort: lint + test + coverage

# Tests
npm run test           # Voer alle tests uit (CJS)
npm run test:watch     # Tests in watch-modus
npm run test:coverage  # Tests met dekkingsrapport
npm run test:core      # Alleen tests van de kernmodules
npm run test:integration # Integratietests
npm run test:storage   # Tests van het opslagsysteem
npm run test:esm       # ESM-tests (mappen tests-esm/, Jest vm-modules)
npm run test:verbose   # Tests met gedetailleerde uitvoer
npm run test:pwa-offline # PWA offline test (vereist Puppeteer), na `npm run serve`

# Analyse en onderhoud
npm run analyze:jsdoc  # Documentatieanalyse
npm run improve:jsdoc  # Automatische JSDoc-verbetering
npm run audit:mobile   # Tests voor mobiele responsiviteit
npm run audit:accessibility # Toegankelijkheidstests
npm run dead-code      # Detectie van ongebruikte code
npm run analyze:globals # Analyse van globale variabelen
npm run analyze:dependencies # Analyse van afhankelijkheidsgebruik
npm run verify:cleanup # Gecombineerde analyse (ongebruikte code + globale variabelen)

# Assetbeheer
npm run assets:generate    # Genereer responsieve afbeeldingen
npm run assets:backgrounds # Converteer achtergronden naar WebP
npm run assets:analyze     # Analyse van responsieve assets
npm run assets:diff        # Vergelijking van assets

# Internationalisatie
npm run i18n:verify    # Controleer de consistentie van vertaalsleutels
npm run i18n:unused    # Lijst van ongebruikte vertaalsleutels
npm run i18n:compare   # Vergelijk vertalingen (en/es) met fr.json (referentie)

# Build & levering
npm run build          # Productiebuild (Rollup) + postbuild (volledige dist/)
npm run serve:dist     # Serveer dist/ op http://localhost:5000 (of beschikbare poort)

# PWA en Service Worker
npm run sw:disable     # Schakel de service worker uit
npm run sw:fix         # Los problemen met de service worker op
```

## 🏗️ Architectuur

### Bestandsstructuur

```
leapmultix/
├── index.html              # Hoofdingangspunt
├── js/
│   ├── core/               # Centrale ES6-modules
│   │   ├── GameMode.js     # Basisklasse van de modi
│   │   ├── GameModeManager.js # Beheer van spelmodi
│   │   ├── storage.js      # LocalStorage-opslag-API
│   │   ├── audio.js        # Geluidsbeheer
│   │   ├── utils.js        # Algemene hulpprogramma's (canonieke bron)
│   │   ├── eventBus.js     # Gebeurtenisgestuurde communicatie
│   │   ├── userState.js    # Beheer van gebruikerssessies
│   │   ├── mainInit.js     # DOM-ready initialisatie
│   │   ├── theme.js        # Themasysteem
│   │   ├── userUi.js       # Hulpprogramma's voor de gebruikersinterface
│   │   ├── parental.js     # Ouderlijk toezicht
│   │   ├── adventure-data.js # Gegevens van de avontuurmodus
│   │   ├── mult-stats.js   # Vermenigvuldigingsstatistieken
│   │   ├── challenge-stats.js # Uitdagingsstatistieken
│   │   └── daily-challenge.js # Beheer van dagelijkse uitdagingen
│   ├── components/         # Herbruikbare UI-componenten
│   │   ├── topBar.js       # Navigatiebalk
│   │   ├── infoBar.js      # Informatiebalken van de spellen
│   │   ├── dashboard.js    # Gebruikersdashboard
│   │   └── customization.js # Aanpassingsinterface
│   ├── modes/              # Spelmodi
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Arcade-minigames
│   │   ├── arcade.js       # Hoofd-arcade-orkestrator
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Geheugenspel (31 KB)
│   │   ├── arcade-multimiam.js # Multimiam-integratie
│   │   ├── arcade-multisnake.js # Snake-integratie
│   │   ├── arcade-common.js, arcade-utils.js # Gedeelde hulpprogramma's
│   │   ├── arcade-message.js, arcade-points.js # UI-componenten
│   │   └── arcade-scores.js # Scorebeheer
│   ├── multimiam/          # Pac-Man-spel (opgedeelde architectuur)
│   │   ├── multimiam.js    # Hoofdcontroller
│   │   ├── multimiam-engine.js # Spelengine (15 KB)
│   │   ├── multimiam-renderer.js # Renderingsysteem (9 KB)
│   │   ├── multimiam-controls.js # Besturingsbeheer (7 KB)
│   │   ├── multimiam-questions.js # Vragengeneratie (6 KB)
│   │   └── multimiam-ui.js # Interface-elementen
│   ├── multisnake.js       # Snake-spel (38 KB)
│   ├── navigation/         # Navigatiesysteem
│   │   ├── slides.js       # Navigatie per dia (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Toetsenbordondersteuning
│   ├── ui/                 # Gebruikersinterface en feedback
│   │   ├── uiUtils.js      # Interface-hulpprogramma's
│   │   ├── ui-feedback.js  # Feedbackmechanismen
│   │   ├── touch-support.js # Touch-ondersteuning (7 KB)
│   │   ├── virtual-keyboard.js # Virtueel toetsenbord
│   │   ├── coin-display.js, coin-effects.js # Valutasysteem
│   │   ├── notifications.js # Meldingssysteem
│   │   └── badges.js       # Badgesysteem
│   ├── media/              # Mediabeheer
│   │   ├── VideoManager.js # Videoweergavebeheer (12 KB)
│   │   └── responsive-image-loader.js # Laden van afbeeldingen (9 KB)
│   ├── orchestration/      # Orkestratie en laden
│   │   ├── mode-orchestrator.js # Moduswisseling
│   │   ├── lazy-loader.js  # Dynamisch laden (10 KB)
│   │   └── game-cleanup.js # Statusopschoning
│   ├── utils/              # Hulpprogramma's
│   │   ├── utils-es6.js    # Hoofdaggregator (5 KB)
│   │   ├── main-helpers.js # Helpers van de applicatie
│   │   ├── helpers.js      # Legacy-helperfuncties
│   │   ├── stats-utils.js  # Statistiekhulpprogramma's
│   │   ├── difficulty.js   # Moeilijkheidsbeheer
│   │   └── questionGenerator.js # Vragengeneratie
│   ├── storage/            # Opslag en status
│   │   ├── storage.js      # Legacy-opslagwrapper
│   │   └── userManager.js  # Multi-userbeheer (19 KB)
│   ├── i18n/               # Internationalisatie
│   │   ├── i18n.js         # i18n-systeem
│   │   └── i18n-store.js   # Opslag van vertalingen
│   ├── security/           # Beveiliging en foutafhandeling
│   │   ├── security-utils.js # XSS-bescherming, sanering
│   │   ├── error-handlers.js # Globale foutafhandeling
│   │   └── logger.js       # Loggingsysteem
│   ├── accessibility/      # Toegankelijkheid
│   │   ├── accessibility.js # Toegankelijkheidsfuncties
│   │   └── speech.js       # Ondersteuning voor spraaksynthese
│   ├── integration/        # Integratie en analyse
│   │   ├── plausible-init.js # Plausible-analyse
│   │   ├── cache-updater.js # Cachebeheer (10 KB)
│   │   └── imports.js      # Importhulpprogramma's
│   ├── main-es6.js         # ES6-ingangspunt
│   ├── main.js             # Hoofdorkestrator
│   ├── bootstrap.js        # Configuratie van ES6-eventhandlers
│   └── game.js             # Statusbeheer en dagelijkse uitdagingen
├── css/                    # Modulaire stijlen
├── assets/                 # Bronnen
│   ├── images/             # Afbeeldingen en sprites
│   ├── generated-images/   # Gegenereerde responsieve afbeeldingen
│   ├── sounds/             # Geluidseffecten
│   ├── translations/       # Vertaalbestanden (fr, en, es)
│   └── videos/             # Tutorialvideo's
├── tests/                  # Geautomatiseerde tests
│   ├── __tests__/          # Unit- en integratietests
│   └── tests-esm/          # ESM-tests (.mjs)
├── scripts/                # Onderhoudsscripts
│   ├── compare-translations.cjs # Vergelijking van vertalingen
│   └── cleanup-i18n-keys.cjs # Opschoning van i18n-sleutels
└── dist/                   # Productiebuild (gegenereerd)
```

### Technische architectuur

**Moderne ES6-modules**: Het project maakt gebruik van een modulaire architectuur met native ES6-klassen en imports/exports.

**Herbruikbare componenten**: Interface gebouwd met gecentraliseerde UI-componenten (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Slim laden van modules op aanvraag via `lazy-loader.js` om de initiële prestaties te optimaliseren.

**Verenigd opslagsysteem**: Gecentraliseerde API voor persistentie van gebruikersgegevens via LocalStorage met fallbacks.

**Gecentraliseerd audiobeheer**: Geluidsregeling met meertalige ondersteuning en voorkeuren per gebruiker.

**Event Bus**: Ontkoppelde gebeurtenisgestuurde communicatie tussen componenten voor een onderhoudbare architectuur.

**Navigatie per dia**: Navigatiesysteem gebaseerd op genummerde dia's (slide0, slide1, etc.) met `goToSlide()`.

**Beveiliging**: XSS-bescherming en sanering via `security-utils.js` voor alle DOM-manipulaties.

## 🎯 Gedetailleerde Spelmodi

### Ontdekkingsmodus

Visuele verkenningsinterface van de tafels van vermenigvuldiging met:

- Interactieve visualisatie van vermenigvuldigingen
- Animaties en ezelsbruggetjes
- Educatieve slepen-en-neerzetten
- Vrije voortgang per tafel

### Quizmodus

Meerkeuzevragen met:

- 10 vragen per sessie
- Adaptieve voortgang op basis van successen
- Virtueel numeriek toetsenbord
- Streak-systeem (reeks juiste antwoorden)

### Uitdagingsmodus

Race tegen de klok met:

- 3 moeilijkheidsgraden (Beginner, Gemiddeld, Moeilijk)
- Tijd bonus voor juiste antwoorden
- Levenssysteem
- Ranglijst van de beste scores

### Avontuurmodus

Verhalende voortgang met:

- 12 ontgrendelbare thematische levels
- Interactieve kaart met visuele voortgang
- Meeslepend verhaal met personages
- Sterren- en beloningssysteem

### Arcade-minigames

Elke minigame biedt:

- Keuze van moeilijkheidsgraad en personalisatie
- Levens- en scoresysteem
- Toetsenbord- en touch-bediening
- Individuele ranglijsten per gebruiker

## 🛠️ Ontwikkeling

### Ontwikkelingsworkflow

**BELANGRIJK: Nooit rechtstreeks op main committen**

Het project maakt gebruik van een workflow gebaseerd op feature-branches:

1. **Maak een branch**:

   ```bash
   git checkout -b feat/feature-naam
   # of
   git checkout -b fix/bug-naam
   ```

2. **Ontwikkel en test**:

   ```bash
   npm run format:check  # ALTIJD eerst de opmaak controleren
   npm run format        # Formatteer indien nodig
   npm run lint          # Controleer de codekwaliteit
   npm run test          # Voer de tests uit
   npm run test:coverage # Controleer de dekking
   ```

3. **Commit op de branch**:

   ```bash
   git add .
   git commit -m "feat: beschrijving van de functionaliteit"
   ```

4. **Push en maak een Pull Request**:
   ```bash
   git push -u origin feat/feature-naam
   ```

**Commit-stijl**: Beknopte berichten, imperatieve modus (bijv. "Fix arcade init errors", "Refactor cache updater")

**Kwaliteitspoort**: Zorg ervoor dat `npm run lint`, `npm run test` en `npm run test:coverage` slagen voor elke commit

### Componentenarchitectuur

**GameMode (basisklasse)**: Alle modi erven van een gemeenschappelijke klasse met gestandaardiseerde methoden.

**GameModeManager**: Gecentraliseerde orkestratie van het starten en beheren van de modi.

**UI-componenten**: TopBar, InfoBar, Dashboard en Customization bieden een consistente interface.

**Lazy Loading**: Modules worden op aanvraag geladen om de initiële prestaties te optimaliseren.

**Event Bus**: Ontkoppelde communicatie tussen componenten via het gebeurtenissysteem.

### Tests

Het project omvat een volledige testsuite:

- Unit-tests van de kernmodules
- Integratietests van de componenten
- Tests van de spelmodi
- Geautomatiseerde codedekking

```bash
npm test              # Alle tests (CJS)
npm test:core         # Tests van de kernmodules
npm test:integration  # Integratietests
npm test:coverage     # Dekkingsrapport
npm run test:esm      # ESM-tests (bijv. components/dashboard) via vm-modules
```

### Productiebuild

- **Rollup**: Bundelt `js/main-es6.js` in ESM met code-splitting en sourcemaps
- **Terser**: Automatische minificatie voor optimalisatie
- **Post-build**: Kopieert `css/` en `assets/`, de favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, en herschrijft `dist/index.html` naar het gehashte invoerbestand (bijv. `main-es6-*.js`)
- **Eindmap**: `dist/` klaar om statisch te worden geserveerd

```bash
npm run build      # genereert dist/
npm run serve:dist # serveert dist/ (poort 5000)
```

### Continue Integratie

**GitHub Actions**: Geautomatiseerde pijplijn in `.github/workflows/ci.yml`

De CI/CD-pijplijn wordt automatisch uitgevoerd bij elke push en pull request:

**Hoofdtaken**:

1. **build-test**: Hoofdvalidatietaak
   - Installatie van afhankelijkheden: `npm ci`
   - Controle van de opmaak: `npm run format:check`
   - Statische analyse: `npm run lint`
   - Unit-tests: `npm run test`
   - Beveiligingsaudit: `npm audit`
   - Generatie van het dekkingsartefact

2. **accessibility**: Toegankelijkheidsaudit (niet-blokkerend)
   - Voert `npm run audit:accessibility` uit
   - Genereert een WCAG 2.1 AA-toegankelijkheidsrapport

3. **test-esm**: Tests van de ES6-modules
   - Voert `npm run test:esm` uit met Jest VM-modules
   - Valideert ES6-imports/exports

4. **lighthouse**: Prestatie-audit (niet-blokkerend)
   - Mobiele prestatie-audit
   - Generatie van Lighthouse-rapportartefacten
   - Core Web Vitals-metrieken

**Kwaliteitsbadges**:

- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix is een volledige PWA met offline ondersteuning en installatiemogelijkheid.

**Service Worker** (`sw.js`):

- Navigatie: Network-first met offline fallback naar `offline.html`
- Afbeeldingen: Cache-first om de prestaties te optimaliseren
- Vertalingen: Stale-while-revalidate voor achtergrondupdates
- JS/CSS: Network-first om altijd de nieuwste versie te serveren
- Automatisch versiebeheer via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- en PNG-pictogrammen voor alle apparaten
- Installatie mogelijk op mobiel (Toevoegen aan startscherm)
- Standalone-configuratie voor een app-achtige ervaring
- Ondersteuning voor thema's en kleuren

**Offline-modus lokaal testen**:

1. Start de ontwikkelserver:

   ```bash
   npm run serve
   ```

   Open `http://localhost:8080` (of de weergegeven poort)

2. Handmatig testen:
   - Verbreek het netwerk in de DevTools (tabblad Netwerk → Offline)
   - Ververs de pagina → `offline.html` wordt weergegeven

3. Geautomatiseerde test (Puppeteer vereist):
   ```bash
   npm run test:pwa-offline
   ```

**Scripts voor het beheer van de Service Worker**:

```bash
npm run sw:disable  # Schakel de service worker uit
npm run sw:fix      # Los cacheproblemen op
```

### Kwaliteitsnormen

**Codekwaliteitstools**:

- **ESLint**: Moderne configuratie met flat config (`eslint.config.js`), ES2022-ondersteuning
- **Prettier**: Automatische code-opmaak (`.prettierrc`)
- **Stylelint**: CSS-validatie (`.stylelintrc.json`)
- **JSDoc**: Automatische documentatie van functies met dekkingsanalyse

**Belangrijke coderegels**:

- Verwijder ongebruikte variabelen en parameters (`no-unused-vars`)
- Gebruik specifieke foutafhandeling (geen lege catch-blokken)
- Vermijd `innerHTML` ten gunste van `security-utils.js`-functies
- Houd een cognitieve complexiteit < 15 voor functies
- Extraheer complexe functies in kleinere helpers

**Beveiliging**:

- **XSS-bescherming**: Gebruik de functies van `security-utils.js`:
  - `appendSanitizedHTML()` in plaats van `innerHTML`
  - `createSafeElement()` om veilige elementen te maken
  - `setSafeMessage()` voor tekstinhoud
- **Externe scripts**: Attribuut `crossorigin="anonymous"` verplicht
- **Invoervalidatie**: Externe gegevens altijd saneren
- **Content Security Policy**: CSP-headers om scriptbronnen te beperken

**Toegankelijkheid**:

- WCAG 2.1 AA-conformiteit
- Volledige toetsenbordnavigatie
- Geschikte ARIA-rollen en labels
- Conforme kleurcontrasten

**Prestaties**:

- Lazy loading van modules via `lazy-loader.js`
- CSS-optimalisaties en responsieve assets
- Service Worker voor slimme caching
- Code-splitting en minificatie in productie

## 📱 Compatibiliteit

### Ondersteunde browsers

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Apparaten

- **Desktop**: Toetsenbord- en muisbediening
- **Tablets**: Geoptimaliseerde touch-interface
- **Smartphones**: Adaptief responsief ontwerp

### Toegankelijkheid

- Volledige toetsenbordnavigatie (Tab, pijlen, Esc)
- ARIA-rollen en labels voor schermlezers
- Conforme kleurcontrasten
- Ondersteuning van ondersteunende technologieën

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

### i18n-beheerscripts

**`npm run i18n:verify`** - Controleer de consistentie van vertaalsleutels

**`npm run i18n:unused`** - Lijst van ongebruikte vertaalsleutels

**`npm run i18n:compare`** - Vergelijk vertaalbestanden met fr.json (referentie)

Dit script (`scripts/compare-translations.cjs`) zorgt voor de synchronisatie van alle taalbestanden:

**Functies:**

- Detectie van ontbrekende sleutels (aanwezig in fr.json maar afwezig in andere talen)
- Detectie van extra sleutels (aanwezig in andere talen maar niet in fr.json)
- Identificatie van lege waarden (`""`, `null`, `undefined`, `[]`)
- Controle van typeconsistentie (string vs array)
- Afvlakken van geneste JSON-structuren naar puntnotatie (bijv. `arcade.multiMemory.title`)
- Generatie van een gedetailleerd console-rapport
- Opslaan van het JSON-rapport in `docs/translations-comparison-report.json`

**Voorbeelduitvoer:**

```
🔍 Analyse comparative des fichiers de traduction

📚 Langue de référence: fr.json
✅ fr.json: 335 clés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de clés: 335
✅ Aucune clé manquante
✅ Aucune clé supplémentaire
✅ Aucune valeur vide

📊 RÉSUMÉ FINAL
  fr.json: 335 clés
  en.json: 335 clés
  es.json: 335 clés

✅ Tous les fichiers de traduction sont parfaitement synchronisés !
```

**Vertaaldekking:**

- Volledige gebruikersinterface
- Spelinstructies
- Fout- en feedbackberichten
- Beschrijvingen en contextuele hulp
- Verhalende inhoud van de avontuurmodus
- Toegankelijkheids- en ARIA-labels

## 📊 Gegevensopslag

### Gebruikersgegevens

- Profielen en voorkeuren
- Voortgang per spelmodus
- Scores en statistieken van de arcadespellen
- Aanpassingsinstellingen

### Technische functies

- Lokale opslag (localStorage) met fallbacks
- Isolatie van gegevens per gebruiker
- Automatische opslag van de voortgang
- Automatische migratie van oude gegevens

## 🐛 Een probleem melden

Problemen kunnen worden gemeld via de GitHub-issues. Gelieve op te nemen:

- Gedetailleerde beschrijving van het probleem
- Stappen om het te reproduceren
- Browser en versie
- Screenshots indien relevant

## 💝 Het project ondersteunen

**[☕ Doneer via PayPal](https://paypal.me/jls)**

## 📄 Licentie

Dit project is gelicentieerd onder de AGPL v3-licentie. Zie het `LICENSE`-bestand voor meer details.

---

_LeapMultix - Moderne educatieve applicatie voor het leren van de tafels van vermenigvuldiging_

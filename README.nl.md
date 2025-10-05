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

<!-- Badges (update <eigenaar>/<repo> na GitHub-migratie) -->

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
- [Een Probleem Melden](#-een-probleem-melden)
- [Licentie](#-licentie)

## Beschrijving

LeapMultix is een moderne, interactieve en educatieve webapplicatie bedoeld voor kinderen (8-12 jaar) om de tafels van vermenigvuldiging onder de knie te krijgen. De applicatie biedt **4 klassieke spelmodi** en **4 arcade-minigames** in een intuïtieve, toegankelijke en meertalige interface.

**Ontwikkeld door:** Julien LS (contact@jls42.org)

**Online URL:** https://leapmultix.jls42.org/

## ✨ Functies

### 🎮 Spelmodi

- **Ontdekkingsmodus**: Visuele en interactieve verkenning van de tafels van vermenigvuldiging.
- **Quizmodus**: Meerkeuzevragen met adaptieve voortgang.
- **Uitdagingsmodus**: Een race tegen de klok met verschillende moeilijkheidsgraden.
- **Avontuurmodus**: Verhalende voortgang door levels met een interactieve kaart.

### 🕹️ Arcade-minigames

- **MultiInvaders**: Een educatieve Space Invaders - Vernietig de foute antwoorden.
- **MultiMiam**: Een wiskundige Pac-Man - Verzamel de juiste antwoorden.
- **MultiMemory**: Een geheugenspel - Koppel vermenigvuldigingen aan hun resultaten.
- **MultiSnake**: Een educatieve Snake - Groei door de juiste getallen te eten.

### 🌍 Overkoepelende Functies

- **Multi-user**: Beheer van individuele profielen met opgeslagen voortgang.
- **Meertalig**: Ondersteuning voor Frans, Engels en Spaans.
- **Personalisatie**: Avatars, kleurthema's, achtergronden.
- **Toegankelijkheid**: Toetsenbordnavigatie, touch-ondersteuning, WCAG 2.1 AA-conformiteit.
- **Mobiel responsief**: Geoptimaliseerde interface voor tablets en smartphones.
- **Voortgangssysteem**: Scores, badges, dagelijkse uitdagingen.

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

# Start de ontwikkelingsserver (optie 1)
npm run serve
# De applicatie is beschikbaar op http://localhost:8080 (of de volgende beschikbare poort)

# Of met Python (optie 2)
python3 -m http.server 8000
# De applicatie is beschikbaar op http://localhost:8000
```

### Beschikbare Scripts

```bash
# Ontwikkeling
npm run serve          # Lokale server
npm run lint           # Codecontrole
npm run test           # Voer alle tests uit (CJS)
npm run test:coverage  # Tests met dekking
npm run test:esm       # ESM-tests (tests-esm/ mappen, Jest vm-modules)
npm run test:pwa-offline # PWA offline test (vereist Puppeteer), na `npm run serve`

# Analyse en onderhoud
npm run analyze:jsdoc  # Documentatieanalyse
npm run improve:jsdoc  # Automatische JSDoc-verbetering
npm run audit:mobile   # Tests voor mobiele responsiviteit
npm run audit:accessibility # Toegankelijkheidstests
npm run dead-code      # Detectie van ongebruikte code
npm run analyze:globals # Analyse van globale variabelen
npm run analyze:dependencies # Analyse van afhankelijkhedengebruik
npm run assets:analyze # Analyse van responsieve assets
npm run assets:diff    # Vergelijking van assets
npm run i18n:compare   # Vertalingen (en/es) vergelijken met fr.json (referentie)

# Build & levering
npm run build          # Productiebuild (Rollup) + post-build (volledige dist/)
npm run serve:dist     # Serveer dist/ op http://localhost:5000 (of beschikbare poort)
```

## 🏗️ Architectuur

### Bestandsstructuur

```
leapmultix/
├── index.html              # Hoofdingangspunt
├── js/
│   ├── core/               # Centrale ES6-modules
│   │   ├── GameMode.js     # Basisklasse voor spelmodi
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # Opslag-API
│   │   ├── audio.js        # Geluidsbeheer
│   │   └── utils.js        # Algemene hulpprogramma's
│   ├── components/         # Herbruikbare UI-componenten
│   │   ├── topBar.js       # Navigatiebalk
│   │   ├── infoBar.js      # Spelinformatiebalken
│   │   ├── dashboard.js    # Gebruikersdashboard
│   │   └── customization.js # Personalisatie-interface
│   ├── modes/              # Herontworpen spelmodi
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # Arcade-minigames
│   ├── multimiam-*.js      # Pac-Man-spelmodules
│   ├── multisnake.js       # Educatief Snake-spel
│   ├── main-es6.js         # ES6-ingangspunt
│   ├── main.js             # Hoofdorkestrator
│   ├── lazy-loader.js      # Op aanvraag laden
│   └── utils-es6.js        # ES6-hulpprogramma's
├── css/                    # Modulaire stijlen
├── assets/                 # Bronnen
│   ├── images/             # Afbeeldingen en sprites
│   ├── sounds/             # Geluidseffecten
│   ├── translations/       # Vertaalbestanden
│   └── videos/             # Instructievideo's
└── tests/                  # Geautomatiseerde tests
```

### Technische Architectuur

**Moderne ES6-modules**: Het project maakt gebruik van een modulaire architectuur met ES6-klassen en native imports/exports.

**Herbruikbare Componenten**: De interface is opgebouwd met gecentraliseerde UI-componenten (TopBar, InfoBar, Dashboard).

**Lazy Loading**: Slim laden van modules op aanvraag om de prestaties te optimaliseren.

**Geünificeerd Opslagsysteem**: Gecentraliseerde API voor de persistentie van gebruikersgegevens.

**Gecentraliseerd Audiobeheer**: Geluidscontrole met meertalige ondersteuning en voorkeuren per gebruiker.

## 🎯 Gedetailleerde Spelmodi

### Ontdekkingsmodus

Visuele verkenningsinterface voor de tafels van vermenigvuldiging met:

- Interactieve visualisatie van vermenigvuldigingen
- Animaties en geheugensteuntjes
- Educatief slepen en neerzetten
- Vrije voortgang per tafel

### Quizmodus

Meerkeuzevragen met:

- 10 vragen per sessie
- Adaptieve voortgang op basis van succes
- Virtueel numeriek toetsenbord
- Streak-systeem (reeks van juiste antwoorden)

### Uitdagingsmodus

Een race tegen de klok met:

- 3 moeilijkheidsgraden (Beginner, Gemiddeld, Moeilijk)
- Tijd bonus voor juiste antwoorden
- Levenssysteem
- Ranglijst met hoge scores

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

### Componentenarchitectuur

**GameMode (basisklasse)**: Alle modi erven van een gemeenschappelijke klasse met gestandaardiseerde methoden.

**GameModeManager**: Gecentraliseerde orkestratie voor het starten en beheren van de modi.

**UI-componenten**: TopBar, InfoBar, Dashboard en Customization zorgen voor een consistente interface.

**Lazy Loading**: Modules worden op aanvraag geladen om de initiële prestaties te optimaliseren.

### Tests

Het project omvat een uitgebreide testsuite:

- Unittests van de kernmodules
- Integratietests van de componenten
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

- **Rollup**: Bundelt `js/main-es6.js` in ESM met code-splitting en sourcemaps.
- **Terser**: Automatische minificatie voor optimalisatie.
- **Post-build**: Kopieert `css/` en `assets/`, de favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, en herschrijft `dist/index.html` om te verwijzen naar het gehashte ingangsbestand (bijv. `main-es6-*.js`).
- **Eindmap**: `dist/` klaar om statisch te worden geserveerd.

```bash
npm run build      # genereert dist/
npm run serve:dist # serveert dist/ (poort 5000)
```

### Continue Integratie

**GitHub Actions**: `.github/workflows/ci.yml`

- **build-test**: `npm ci`, `lint`, `test`, `audit` + dekkingsartefact.
- **accessibility**: `npm run audit:accessibility` (niet-blokkerend).
- **test-esm**: `npm run test:esm` met VM-modules.
- **lighthouse**: Mobiele prestatie-audit (niet-blokkerend), rapporten als artefacten.

### PWA (offline en installatie)

- **Service Worker**: Netwerk-eerst-strategie met offline fallback; afbeeldingen met cache-eerst-strategie; vertalingen met stale-while-revalidate; JS/CSS met netwerk-eerst.
- **Manifest**: SVG/PNG-iconen; installatie mogelijk op mobiel.
- **Lokaal offline testen**:
  1. Voer `npm run serve` uit en open `http://localhost:8080` (of de weergegeven poort).
  2. Verbreek de netwerkverbinding en vernieuw de pagina → `offline.html` wordt weergegeven.
  3. Geautomatiseerde test (vereist Puppeteer): `npm run test:pwa-offline`.

### Kwaliteitsnormen

- **ESLint**: Validatie van JavaScript-code.
- **Prettier**: Automatische opmaak.
- **JSDoc**: Automatische documentatie van functies.
- **Toegankelijkheid**: WCAG 2.1 AA-conformiteit.
- **Prestaties**: Lazy loading, CSS-optimalisaties.

## 📱 Compatibiliteit

### Ondersteunde Browsers

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Apparaten

- **Desktop**: Toetsenbord- en muisbediening.
- **Tablets**: Geoptimaliseerde touch-interface.
- **Smartphones**: Adaptief responsief ontwerp.

### Toegankelijkheid

- Volledige toetsenbordnavigatie (Tab, pijlen, Esc).
- ARIA-rollen en labels voor schermlezers.
- Conforme kleurcontrasten.
- Ondersteuning voor ondersteunende technologieën.

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
  "menu_start": "Start",
  "quiz_correct": "Goed gedaan!",
  "arcade_invasion_title": "MultiInvaders"
}
```

**Beheerscripts:**

```bash
npm run i18n:verify  # Controleer op ontbrekende/inconsistente sleutels
npm run i18n:unused  # Lijst ongebruikte sleutels
npm run i18n:compare   # Vertalingen (en/es) vergelijken met fr.json (referentie)
```

**Vertaaldekking:**

- Volledige gebruikersinterface
- Spelinstructies
- Fout- en feedbackberichten
- Beschrijvingen en contextuele hulp

## 📊 Gegevensopslag

### Gebruikersgegevens

- Profielen en voorkeuren
- Voortgang per spelmodus
- Arcade-spelscores en statistieken
- Personalisatie-instellingen

### Technische Functies

- Lokale opslag (localStorage) met fallbacks.
- Isolatie van gebruikersgegevens.
- Automatische voortgangsopslag.
- Automatische migratie van oude gegevens.

## 🐛 Een Probleem Melden

Problemen kunnen worden gemeld via GitHub-issues. Gelieve het volgende te vermelden:

- Gedetailleerde beschrijving van het probleem.
- Stappen om het te reproduceren.
- Browser en versie.
- Screenshots indien relevant.

## 💝 Steun het Project

**[☕ Doneer via PayPal](https://paypal.me/jls)**

## 📄 Licentie

Dit project is gelicentieerd onder de AGPL v3-licentie. Zie het `LICENSE`-bestand voor meer details.

---

_LeapMultix - Een moderne educatieve applicatie voor het leren van de tafels van vermenigvuldiging._

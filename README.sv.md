<details>
<summary>Detta dokument finns även på andra språk</summary>

- [Français](./README.md)
- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Deutsch](./README.de.md)
- [中文](./README.zh.md)
- [हिन्दी](./README.hi.md)
- [العربية](./README.ar.md)
- [Italiano](./README.it.md)
- [Polski](./README.pl.md)
- [Nederlands](./README.nl.md)
- [Română](./README.ro.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)

</details>

# LeapMultix

<!-- Märken (uppdatera <ägare>/<repo> efter GitHub-migrering) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Innehållsförteckning

- [Beskrivning](#beskrivning)
- [Funktioner](#-funktioner)
- [Snabbstart](#-snabbstart)
- [Arkitektur](#-arkitektur)
- [Detaljerade Spellägen](#-detaljerade-spellägen)
- [Utveckling](#-utveckling)
- [Kompatibilitet](#-kompatibilitet)
- [Lokalisering](#-lokalisering)
- [Datalagring](#-datalagring)
- [Rapportera ett Problem](#-rapportera-ett-problem)
- [Licens](#-licens)

## Beskrivning

LeapMultix är en modern, interaktiv och pedagogisk webbapplikation avsedd för barn (8–12 år) för att bemästra multiplikationstabellerna. Applikationen erbjuder **4 klassiska spellägen** och **4 arkad-minispel** i ett intuitivt, tillgängligt och flerspråkigt gränssnitt.

**Utvecklad av:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## ✨ Funktioner

### 🎮 Spellägen

- **Upptäcktsläge**: Visuell och interaktiv utforskning av multiplikationstabellerna.
- **Frågesportläge**: Flervalsfrågor med anpassningsbar progression.
- **Utmaningsläge**: En kapplöpning mot tiden med olika svårighetsgrader.
- **Äventyrsläge**: Berättelsedriven progression genom nivåer med en interaktiv karta.

### 🕹️ Arkad-minispel

- **MultiInvaders**: Ett pedagogiskt Space Invaders - Förstör de felaktiga svaren.
- **MultiMiam**: En matematisk Pac-Man - Samla de korrekta svaren.
- **MultiMemory**: Ett minnesspel - Para ihop multiplikationer med deras resultat.
- **MultiSnake**: En pedagogisk Snake - Väx genom att äta de rätta siffrorna.

### 🌍 Övergripande Funktioner

- **Fleranvändare**: Hantering av individuella profiler med sparad progression.
- **Flerspråkig**: Stöd för franska, engelska och spanska.
- **Anpassning**: Avatarer, färgteman, bakgrunder.
- **Tillgänglighet**: Tangentbordsnavigering, pekskärmsstöd, WCAG 2.1 AA-överensstämmelse.
- **Mobilanpassad**: Optimerat gränssnitt för surfplattor och smartphones.
- **Progressionssystem**: Poäng, märken, dagliga utmaningar.

## 🚀 Snabbstart

### Förutsättningar

- Node.js (version 16 eller högre)
- En modern webbläsare

### Installation

```bash
# Klona projektet
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Installera beroenden
npm install

# Starta utvecklingsservern (alternativ 1)
npm run serve
# Applikationen kommer att vara tillgänglig på http://localhost:8080 (eller nästa lediga port)

# Eller med Python (alternativ 2)
python3 -m http.server 8000
# Applikationen kommer att vara tillgänglig på http://localhost:8000
```

### Tillgängliga Skript

```bash
# Utveckling
npm run serve          # Lokal server
npm run lint           # Kodgranskning
npm run test           # Kör alla tester (CJS)
npm run test:coverage  # Tester med täckning
npm run test:esm       # ESM-tester (tests-esm/ mappar, Jest vm-modules)
npm run test:pwa-offline # PWA offline-test (kräver Puppeteer), efter `npm run serve`

# Analys och underhåll
npm run analyze:jsdoc  # Dokumentationsanalys
npm run improve:jsdoc  # Automatisk JSDoc-förbättring
npm run audit:mobile   # Tester för mobil responsivitet
npm run audit:accessibility # Tillgänglighetstester
npm run dead-code      # Upptäckt av oanvänd kod
npm run analyze:globals # Analys av globala variabler
npm run analyze:dependencies # Analys av beroendeanvändning
npm run assets:analyze # Analys av responsiva tillgångar
npm run assets:diff    # Jämförelse av tillgångar
npm run i18n:compare   # Jämför översättningar (en/es) med fr.json (referens)

# Bygge & leverans
npm run build          # Produktionsbygge (Rollup) + efterbygge (fullständig dist/)
npm run serve:dist     # Servera dist/ på http://localhost:5000 (eller ledig port)
```

## 🏗️ Arkitektur

### Filstruktur

```
leapmultix/
├── index.html              # Huvudingångspunkt
├── js/
│   ├── core/               # Centrala ES6-moduler
│   │   ├── GameMode.js     # Basklass för spellägen
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # Lagrings-API
│   │   ├── audio.js        # Ljudhantering
│   │   └── utils.js        # Allmänna verktyg
│   ├── components/         # Återanvändbara UI-komponenter
│   │   ├── topBar.js       # Navigationsfält
│   │   ├── infoBar.js      # Spelinformationsfält
│   │   ├── dashboard.js    # Användarens instrumentpanel
│   │   └── customization.js # Anpassningsgränssnitt
│   ├── modes/              # Omarbetade spellägen
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # Arkad-minispel
│   ├── multimiam-*.js      # Pac-Man-spelmoduler
│   ├── multisnake.js       # Pedagogiskt Snake-spel
│   ├── main-es6.js         # ES6-ingångspunkt
│   ├── main.js             # Huvudorkestrerare
│   ├── lazy-loader.js      # Lat laddning
│   └── utils-es6.js        # ES6-verktyg
├── css/                    # Modulära stilar
├── assets/                 # Resurser
│   ├── images/             # Bilder och sprites
│   ├── sounds/             # Ljudeffekter
│   ├── translations/       # Översättningsfiler
│   └── videos/             # Handledningsvideor
└── tests/                  # Automatiserade tester
```

### Teknisk Arkitektur

**Moderna ES6-moduler**: Projektet använder en modulär arkitektur med ES6-klasser och inbyggda importer/exporter.

**Återanvändbara Komponenter**: Gränssnittet är byggt med centraliserade UI-komponenter (TopBar, InfoBar, Dashboard).

**Lat Laddning (Lazy Loading)**: Smart laddning av moduler vid behov för att optimera prestanda.

**Enhetligt Lagringssystem**: Centraliserat API för beständighet av användardata.

**Centraliserad Ljudhantering**: Ljudkontroll med flerspråkigt stöd och användarspecifika preferenser.

## 🎯 Detaljerade Spellägen

### Upptäcktsläge

Visuellt utforskningsgränssnitt för multiplikationstabeller med:

- Interaktiv visualisering av multiplikationer
- Animationer och minneshjälpmedel
- Pedagogiskt dra-och-släpp
- Fri progression per tabell

### Frågesportläge

Flervalsfrågor med:

- 10 frågor per session
- Anpassningsbar progression baserad på framgång
- Virtuellt numeriskt tangentbord
- Streak-system (serie av korrekta svar)

### Utmaningsläge

En kapplöpning mot tiden med:

- 3 svårighetsgrader (Nybörjare, Medel, Svår)
- Tidsbonus för korrekta svar
- Livssystem
- Topplista för höga poäng

### Äventyrsläge

Berättelsedriven progression med:

- 12 upplåsbara tematiska nivåer
- Interaktiv karta med visuell progression
- Uppslukande berättelse med karaktärer
- Stjärn- och belöningssystem

### Arkad-minispel

Varje minispel erbjuder:

- Val av svårighetsgrad och anpassning
- Livs- och poängsystem
- Tangentbords- och pekkontroller
- Individuella topplistor per användare

## 🛠️ Utveckling

### Komponentarkitektur

**GameMode (basklass)**: Alla lägen ärver från en gemensam klass med standardiserade metoder.

**GameModeManager**: Centraliserad orkestrering för att starta och hantera lägen.

**UI-komponenter**: TopBar, InfoBar, Dashboard och Customization ger ett konsekvent gränssnitt.

**Lat Laddning**: Moduler laddas vid behov för att optimera den initiala prestandan.

### Tester

Projektet inkluderar en omfattande testsvit:

- Enhetstester för kärnmoduler
- Integrationstester för komponenter
- Spellägestester
- Automatiserad kodtäckning

```bash
npm test              # Alla tester (CJS)
npm test:core         # Kärnmodultester
npm test:integration  # Integrationstester
npm test:coverage     # Täckningsrapport
npm run test:esm      # ESM-tester (t.ex. components/dashboard) via vm-modules
```

### Produktionsbygge

- **Rollup**: Buntar `js/main-es6.js` till ESM med koddelning och källkartor.
- **Terser**: Automatisk minifiering för optimering.
- **Efterbygge**: Kopierar `css/` och `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, och skriver om `dist/index.html` för att peka på den hashade ingångsfilen (t.ex. `main-es6-*.js`).
- **Slutlig mapp**: `dist/` redo att serveras statiskt.

```bash
npm run build      # genererar dist/
npm run serve:dist # serverar dist/ (port 5000)
```

### Kontinuerlig Integration

**GitHub Actions**: `.github/workflows/ci.yml`

- **build-test**: `npm ci`, `lint`, `test`, `audit` + täckningsartefakt.
- **accessibility**: `npm run audit:accessibility` (icke-blockerande).
- **test-esm**: `npm run test:esm` med VM-moduler.
- **lighthouse**: Mobil prestandagranskning (icke-blockerande), rapporter som artefakter.

### PWA (offline och installation)

- **Service Worker**: Nätverk-först-strategi med offline-fallback; bilder med cache-först-strategi; översättningar med stale-while-revalidate; JS/CSS med nätverk-först.
- **Manifest**: SVG/PNG-ikoner; installation möjlig på mobila enheter.
- **Testa offline lokalt**:
  1. Kör `npm run serve` och öppna `http://localhost:8080` (eller den visade porten).
  2. Koppla från nätverket och uppdatera sidan → `offline.html` kommer att visas.
  3. Automatiserat test (kräver Puppeteer): `npm run test:pwa-offline`.

### Kvalitetsstandarder

- **ESLint**: Validering av JavaScript-kod.
- **Prettier**: Automatisk formatering.
- **JSDoc**: Automatisk funktionsdokumentation.
- **Tillgänglighet**: WCAG 2.1 AA-överensstämmelse.
- **Prestanda**: Lat laddning, CSS-optimeringar.

## 📱 Kompatibilitet

### Stödda Webbläsare

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Enheter

- **Skrivbord**: Tangentbords- och muskontroller.
- **Surfplattor**: Optimerat pekgränssnitt.
- **Smartphones**: Anpassningsbar responsiv design.

### Tillgänglighet

- Fullständig tangentbordsnavigering (Tab, pilar, Esc).
- ARIA-roller och etiketter för skärmläsare.
- Överensstämmande färgkontraster.
- Stöd för hjälpmedelsteknik.

## 🌍 Lokalisering

Fullständigt flerspråkigt stöd:

- **Franska** (standardspråk)
- **Engelska**
- **Spanska**

### Översättningshantering

**Översättningsfiler:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Starta",
  "quiz_correct": "Bra gjort!",
  "arcade_invasion_title": "MultiInvaders"
}
```

**Hanteringsskript:**

```bash
npm run i18n:verify  # Kontrollera saknade/inkonsekventa nycklar
npm run i18n:unused  # Lista oanvända nycklar
npm run i18n:compare   # Jämför översättningar (en/es) med fr.json (referens)
```

**Översättningstäckning:**

- Fullständigt användargränssnitt
- Spelinstruktioner
- Fel- och återkopplingsmeddelanden
- Beskrivningar och kontextuell hjälp

## 📊 Datalagring

### Användardata

- Profiler och preferenser
- Progression per spelläge
- Arkadspelpoäng och statistik
- Anpassningsinställningar

### Tekniska Funktioner

- Lokal lagring (localStorage) med fallbacks.
- Användardataisolering.
- Automatisk progressionssparning.
- Automatisk migrering av gamla data.

## 🐛 Rapportera ett Problem

Problem kan rapporteras via GitHub-issues. Vänligen inkludera:

- Detaljerad beskrivning av problemet.
- Steg för att återskapa det.
- Webbläsare och version.
- Skärmdumpar om relevant.

## 💝 Stöd Projektet

**[☕ Donera via PayPal](https://paypal.me/jls)**

## 📄 Licens

Detta projekt är licensierat under AGPL v3-licensen. Se `LICENSE`-filen för mer information.

---

_LeapMultix - En modern pedagogisk applikation för att lära sig multiplikationstabeller._

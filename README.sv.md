<details>
<summary>Detta dokument finns även på andra språk</summary>

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

<!-- Märken (uppdatera <owner>/<repo> efter GitHub-migrering) -->

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
- [Rapportera ett problem](#-rapportera-ett-problem)
- [Licens](#-licens)

## Beskrivning

LeapMultix är en modern interaktiv pedagogisk webbapplikation för barn (8–12 år) för att bemästra multiplikationstabellerna. Applikationen erbjuder **4 klassiska spellägen** och **4 arkadminispel** i ett intuitivt, tillgängligt och flerspråkigt gränssnitt.

**Utvecklad av:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## ✨ Funktioner

### 🎮 Spellägen

- **Upptäcktsläge**: Visuell och interaktiv utforskning av multiplikationstabellerna
- **Frågesportläge**: Flervalsfrågor med adaptiv progression
- **Utmaningsläge**: Tävling mot klockan med olika svårighetsgrader
- **Äventyrsläge**: Berättande progression genom nivåer med en interaktiv karta

### 🕹️ Arkadminispel

- **MultiInvaders**: Pedagogiska Space Invaders - förstör de felaktiga svaren
- **MultiMiam**: Matematisk Pac-Man - samla de korrekta svaren
- **MultiMemory**: Minnesspel - matcha multiplikationer och resultat
- **MultiSnake**: Pedagogisk Snake - väx genom att äta de korrekta siffrorna

### 🌍 Övergripande funktioner

- **Fleranvändare**: Hantering av individuella profiler med sparad progression
- **Flerspråkig**: Stöd för franska, engelska och spanska
- **Anpassning**: Avatarer, färgteman, bakgrunder
- **Tillgänglighet**: Tangentbordsnavigering, pekskärmsstöd, WCAG 2.1 AA-överensstämmelse
- **Mobilresponsiv**: Optimerat gränssnitt för surfplattor och smartphones
- **Progressionssystem**: Poäng, märken, dagliga utmaningar

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
# Applikationen kommer att vara tillgänglig på http://localhost:8080 (eller nästa tillgängliga port)

# Eller med Python (alternativ 2)
python3 -m http.server 8000
# Applikationen kommer att vara tillgänglig på http://localhost:8000
```

### Tillgängliga skript

```bash
# Utveckling
npm run serve          # Lokal server (http://localhost:8080)
npm run lint           # Kodkontroll med ESLint
npm run lint:fix       # Automatisk korrigering av ESLint-problem
npm run format:check   # Kontrollera kodformatering (ALLTID före commit)
npm run format         # Formatera kod med Prettier
npm run verify         # Kvalitetsgrind: lint + test + täckning

# Tester
npm run test           # Kör alla tester (CJS)
npm run test:watch     # Tester i bevakningsläge
npm run test:coverage  # Tester med täckningsrapport
npm run test:core      # Endast tester av kärnmoduler
npm run test:integration # Integrationstester
npm run test:storage   # Tester av lagringssystemet
npm run test:esm       # ESM-tester (mappar tests-esm/, Jest vm-modules)
npm run test:verbose   # Tester med detaljerad utdata
npm run test:pwa-offline # PWA offline-test (kräver Puppeteer), efter `npm run serve`

# Analys och underhåll
npm run analyze:jsdoc  # Dokumentationsanalys
npm run improve:jsdoc  # Automatisk JSDoc-förbättring
npm run audit:mobile   # Tester för mobil responsivitet
npm run audit:accessibility # Tillgänglighetstester
npm run dead-code      # Upptäckt av oanvänd kod
npm run analyze:globals # Analys av globala variabler
npm run analyze:dependencies # Analys av beroendeanvändning
npm run verify:cleanup # Kombinerad analys (oanvänd kod + globala variabler)

# Tillgångshantering
npm run assets:generate    # Generera responsiva bilder
npm run assets:backgrounds # Konvertera bakgrunder till WebP
npm run assets:analyze     # Analys av responsiva tillgångar
npm run assets:diff        # Jämförelse av tillgångar

# Internationalisering
npm run i18n:verify    # Verifiera konsekvensen av översättningsnycklar
npm run i18n:unused    # Lista oanvända översättningsnycklar
npm run i18n:compare   # Jämför översättningar (en/es) med fr.json (referens)

# Bygg & leverans
npm run build          # Produktionsbygg (Rollup) + efterbygg (fullständig dist/)
npm run serve:dist     # Servera dist/ på http://localhost:5000 (eller tillgänglig port)

# PWA och Service Worker
npm run sw:disable     # Inaktivera service worker
npm run sw:fix         # Åtgärda problem med service worker
```

## 🏗️ Arkitektur

### Filstruktur

```
leapmultix/
├── index.html              # Huvudingångspunkt
├── js/
│   ├── core/               # Centrala ES6-moduler
│   │   ├── GameMode.js     # Basklass för lägen
│   │   ├── GameModeManager.js # Hantering av spellägen
│   │   ├── storage.js      # LocalStorage-lagrings-API
│   │   ├── audio.js        # Ljudhantering
│   │   ├── utils.js        # Allmänna verktyg (kanonisk källa)
│   │   ├── eventBus.js     # Händelsedriven kommunikation
│   │   ├── userState.js    # Hantering av användarsessioner
│   │   ├── mainInit.js     # DOM-klar initialisering
│   │   ├── theme.js        # Temasystem
│   │   ├── userUi.js       # Verktyg för användargränssnitt
│   │   ├── parental.js     # Föräldrakontroller
│   │   ├── adventure-data.js # Data för äventyrsläge
│   │   ├── mult-stats.js   # Multiplikationsstatistik
│   │   ├── challenge-stats.js # Utmaningsstatistik
│   │   └── daily-challenge.js # Hantering av dagliga utmaningar
│   ├── components/         # Återanvändbara UI-komponenter
│   │   ├── topBar.js       # Navigeringsfält
│   │   ├── infoBar.js      # Informationsfält för spel
│   │   ├── dashboard.js    # Användarpanel
│   │   └── customization.js # Anpassningsgränssnitt
│   ├── modes/              # Spellägen
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Arkadminispel
│   │   ├── arcade.js       # Huvudarkadorkestrerare
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Minnesspel (31 KB)
│   │   ├── arcade-multimiam.js # Multimiam-integration
│   │   ├── arcade-multisnake.js # Snake-integration
│   │   ├── arcade-common.js, arcade-utils.js # Delade verktyg
│   │   ├── arcade-message.js, arcade-points.js # UI-komponenter
│   │   └── arcade-scores.js # Poänghantering
│   ├── multimiam/          # Pac-Man-spel (uppdelad arkitektur)
│   │   ├── multimiam.js    # Huvudkontroller
│   │   ├── multimiam-engine.js # Spelmotor (15 KB)
│   │   ├── multimiam-renderer.js # Renderingssystem (9 KB)
│   │   ├── multimiam-controls.js # Kontrollhantering (7 KB)
│   │   ├── multimiam-questions.js # Frågegenerering (6 KB)
│   │   └── multimiam-ui.js # Gränssnittselement
│   ├── multisnake.js       # Snake-spel (38 KB)
│   ├── navigation/         # Navigationssystem
│   │   ├── slides.js       # Bildbaserad navigering (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Tangentbordsstöd
│   ├── ui/                 # Användargränssnitt och feedback
│   │   ├── uiUtils.js      # Gränssnittsverktyg
│   │   ├── ui-feedback.js  # Feedbackmekanismer
│   │   ├── touch-support.js # Pekskärmsstöd (7 KB)
│   │   ├── virtual-keyboard.js # Virtuellt tangentbord
│   │   ├── coin-display.js, coin-effects.js # Valutasystem
│   │   ├── notifications.js # Meddelandesystem
│   │   └── badges.js       # Märkessystem
│   ├── media/              # Mediahantering
│   │   ├── VideoManager.js # Videouppspelningshantering (12 KB)
│   │   └── responsive-image-loader.js # Bildladdning (9 KB)
│   ├── orchestration/      # Orkestrering och laddning
│   │   ├── mode-orchestrator.js # Lägesväxling
│   │   ├── lazy-loader.js  # Dynamisk laddning (10 KB)
│   │   └── game-cleanup.js # Tillståndsrensning
│   ├── utils/              # Verktyg
│   │   ├── utils-es6.js    # Huvudaggregator (5 KB)
│   │   ├── main-helpers.js # Applikationshjälpare
│   │   ├── helpers.js      # Äldre hjälpfunktioner
│   │   ├── stats-utils.js  # Statistikverktyg
│   │   ├── difficulty.js   # Svårighetshantering
│   │   └── questionGenerator.js # Frågegenerering
│   ├── storage/            # Lagring och tillstånd
│   │   ├── storage.js      # Äldre lagringsomslag
│   │   └── userManager.js  # Fleranvändarhantering (19 KB)
│   ├── i18n/               # Internationalisering
│   │   ├── i18n.js         # i18n-system
│   │   └── i18n-store.js   # Översättningslagring
│   ├── security/           # Säkerhet och felhantering
│   │   ├── security-utils.js # XSS-skydd, sanering
│   │   ├── error-handlers.js # Global felhantering
│   │   └── logger.js       # Loggningssystem
│   ├── accessibility/      # Tillgänglighet
│   │   ├── accessibility.js # Tillgänglighetsfunktioner
│   │   └── speech.js       # Stöd för talsyntes
│   ├── integration/        # Integration och analys
│   │   ├── plausible-init.js # Plausible-analys
│   │   ├── cache-updater.js # Cachehantering (10 KB)
│   │   └── imports.js      # Importverktyg
│   ├── main-es6.js         # ES6-ingångspunkt
│   ├── main.js             # Huvudorkestrerare
│   ├── bootstrap.js        # Konfiguration av ES6-händelsehanterare
│   └── game.js             # Tillståndshantering och dagliga utmaningar
├── css/                    # Modulära stilar
├── assets/                 # Resurser
│   ├── images/             # Bilder och sprites
│   ├── generated-images/   # Genererade responsiva bilder
│   ├── sounds/             # Ljudeffekter
│   ├── translations/       # Översättningsfiler (fr, en, es)
│   └── videos/             # Handledningsvideor
├── tests/                  # Automatiserade tester
│   ├── __tests__/          # Enhets- och integrationstester
│   └── tests-esm/          # ESM-tester (.mjs)
├── scripts/                # Underhållsskript
│   ├── compare-translations.cjs # Jämförelse av översättningar
│   └── cleanup-i18n-keys.cjs # Rengöring av i18n-nycklar
└── dist/                   # Produktionsbygg (genererad)
```

### Teknisk arkitektur

**Moderna ES6-moduler**: Projektet använder en modulär arkitektur med inbyggda ES6-klasser och importer/exporter.

**Återanvändbara komponenter**: Gränssnitt byggt med centraliserade UI-komponenter (TopBar, InfoBar, Dashboard, Customization).

**Lat laddning (Lazy Loading)**: Smart laddning av moduler vid behov via `lazy-loader.js` för att optimera den initiala prestandan.

**Enhetligt lagringssystem**: Centraliserad API för beständighet av användardata via LocalStorage med reservalternativ.

**Centraliserad ljudhantering**: Ljudkontroll med flerspråkigt stöd och användarspecifika preferenser.

**Händelsebuss (Event Bus)**: Frikopplad händelsedriven kommunikation mellan komponenter för en underhållbar arkitektur.

**Bildbaserad navigering**: Navigationssystem baserat på numrerade bilder (slide0, slide1, etc.) med `goToSlide()`.

**Säkerhet**: XSS-skydd och sanering via `security-utils.js` för alla DOM-manipulationer.

## 🎯 Detaljerade Spellägen

### Upptäcktsläge

Visuellt utforskningsgränssnitt för multiplikationstabellerna med:

- Interaktiv visualisering av multiplikationer
- Animationer och minneshjälpmedel
- Pedagogisk dra-och-släpp
- Fri progression per tabell

### Frågesportläge

Flervalsfrågor med:

- 10 frågor per session
- Adaptiv progression baserat på framgång
- Virtuellt numeriskt tangentbord
- Streak-system (serie av korrekta svar)

### Utmaningsläge

Tävling mot klockan med:

- 3 svårighetsgrader (Nybörjare, Medel, Svår)
- Tidsbonus för korrekta svar
- Livssystem
- Topplista med högsta poäng

### Äventyrsläge

Berättande progression med:

- 12 upplåsbara tematiska nivåer
- Interaktiv karta med visuell progression
- Uppslukande berättelse med karaktärer
- Stjärn- och belöningssystem

### Arkadminispel

Varje minispel erbjuder:

- Val av svårighetsgrad och anpassning
- Livs- och poängsystem
- Tangentbords- och pekkontroller
- Individuella topplistor per användare

## 🛠️ Utveckling

### Utvecklingsarbetsflöde

**VIKTIGT: Committa aldrig direkt till main**

Projektet använder ett arbetsflöde baserat på funktionsgrenar:

1. **Skapa en gren**:
   ```bash
   git checkout -b feat/funktionsnamn
   # eller
   git checkout -b fix/buggnamn
   ```

2. **Utveckla och testa**:
   ```bash
   npm run format:check  # Kontrollera ALLTID formateringen först
   npm run format        # Formatera vid behov
   npm run lint          # Kontrollera kodkvaliteten
   npm run test          # Kör testerna
   npm run test:coverage # Kontrollera täckningen
   ```

3. **Committa på grenen**:
   ```bash
   git add .
   git commit -m "feat: beskrivning av funktionen"
   ```

4. **Pusha och skapa en Pull Request**:
   ```bash
   git push -u origin feat/funktionsnamn
   ```

**Commit-stil**: Koncisa meddelanden, imperativ stämning (t.ex. "Fix arcade init errors", "Refactor cache updater")

**Kvalitetsgrind**: Se till att `npm run lint`, `npm run test` och `npm run test:coverage` passerar före varje commit

### Komponentarkitektur

**GameMode (basklass)**: Alla lägen ärver från en gemensam klass med standardiserade metoder.

**GameModeManager**: Centraliserad orkestrering för att starta och hantera lägen.

**UI-komponenter**: TopBar, InfoBar, Dashboard och Customization ger ett konsekvent gränssnitt.

**Lat laddning (Lazy Loading)**: Moduler laddas vid behov för att optimera den initiala prestandan.

**Händelsebuss (Event Bus)**: Frikopplad kommunikation mellan komponenter via händelsesystemet.

### Tester

Projektet inkluderar en komplett testsvit:

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

### Produktionsbygg

- **Rollup**: Buntar `js/main-es6.js` till ESM med koddelning och källkartor
- **Terser**: Automatisk minifiering för optimering
- **Efterbygg**: Kopierar `css/` och `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, och skriver om `dist/index.html` till den hashade indatafilen (t.ex. `main-es6-*.js`)
- **Slutlig mapp**: `dist/` redo att serveras statiskt

```bash
npm run build      # genererar dist/
npm run serve:dist # serverar dist/ (port 5000)
```

### Kontinuerlig Integration

**GitHub Actions**: Automatiserad pipeline i `.github/workflows/ci.yml`

CI/CD-pipelinen körs automatiskt vid varje push och pull request:

**Huvudjobb**:

1. **build-test**: Huvudvalideringsjobb
   - Installation av beroenden: `npm ci`
   - Kontroll av formatering: `npm run format:check`
   - Statisk analys: `npm run lint`
   - Enhetstester: `npm run test`
   - Säkerhetsgranskning: `npm audit`
   - Generering av täckningsartefakt

2. **accessibility**: Tillgänglighetsgranskning (icke-blockerande)
   - Kör `npm run audit:accessibility`
   - Genererar en WCAG 2.1 AA-tillgänglighetsrapport

3. **test-esm**: ES6-modultester
   - Kör `npm run test:esm` med Jest VM-moduler
   - Validerar ES6-importer/exporter

4. **lighthouse**: Prestandagranskning (icke-blockerande)
   - Mobil prestandagranskning
   - Generering av Lighthouse-rapportartefakter
   - Core Web Vitals-mått

**Kvalitetsmärken**:
- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix är en fullfjädrad PWA med offline-stöd och installerbarhet.

**Service Worker** (`sw.js`):
- Navigering: Network-first med offline-fallback till `offline.html`
- Bilder: Cache-first för att optimera prestanda
- Översättningar: Stale-while-revalidate för bakgrundsuppdateringar
- JS/CSS: Network-first för att alltid servera den senaste versionen
- Automatisk versionshantering via `cache-updater.js`

**Manifest** (`manifest.json`):
- SVG- och PNG-ikoner för alla enheter
- Installerbar på mobil (Lägg till på hemskärmen)
- Fristående konfiguration för en app-liknande upplevelse
- Stöd för teman och färger

**Testa offline-läge lokalt**:

1. Starta utvecklingsservern:
   ```bash
   npm run serve
   ```
   Öppna `http://localhost:8080` (eller den visade porten)

2. Testa manuellt:
   - Koppla från nätverket i DevTools (fliken Nätverk → Offline)
   - Uppdatera sidan → `offline.html` visas

3. Automatiserat test (Puppeteer krävs):
   ```bash
   npm run test:pwa-offline
   ```

**Skript för hantering av Service Worker**:
```bash
npm run sw:disable  # Inaktivera service worker
npm run sw:fix      # Åtgärda cacheproblem
```

### Kvalitetsstandarder

**Kodkvalitetsverktyg**:
- **ESLint**: Modern konfiguration med platt konfiguration (`eslint.config.js`), ES2022-stöd
- **Prettier**: Automatisk kodformatering (`.prettierrc`)
- **Stylelint**: CSS-validering (`.stylelintrc.json`)
- **JSDoc**: Automatisk funktionsdokumentation med täckningsanalys

**Viktiga kodregler**:
- Ta bort oanvända variabler och parametrar (`no-unused-vars`)
- Använd specifik felhantering (inga tomma catch-block)
- Undvik `innerHTML` till förmån för `security-utils.js`-funktioner
- Håll en kognitiv komplexitet < 15 för funktioner
- Extrahera komplexa funktioner till mindre hjälpare

**Säkerhet**:
- **XSS-skydd**: Använd funktioner från `security-utils.js`:
  - `appendSanitizedHTML()` istället för `innerHTML`
  - `createSafeElement()` för att skapa säkra element
  - `setSafeMessage()` för textinnehåll
- **Externa skript**: Attributet `crossorigin="anonymous"` är obligatoriskt
- **Indatavalidering**: Sanera alltid externa data
- **Content Security Policy**: CSP-huvuden för att begränsa skriptkällor

**Tillgänglighet**:
- WCAG 2.1 AA-överensstämmelse
- Fullständig tangentbordsnavigering
- Lämpliga ARIA-roller och etiketter
- Överensstämmande färgkontraster

**Prestanda**:
- Lat laddning av moduler via `lazy-loader.js`
- CSS-optimeringar och responsiva tillgångar
- Service Worker för smart cachning
- Koddelning och minifiering i produktion

## 📱 Kompatibilitet

### Webbläsare som stöds

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Enheter

- **Skrivbord**: Tangentbords- och muskontroller
- **Surfplattor**: Optimerat pekgränssnitt
- **Smartphones**: Adaptiv responsiv design

### Tillgänglighet

- Fullständig tangentbordsnavigering (Tab, pilar, Esc)
- ARIA-roller och etiketter för skärmläsare
- Överensstämmande färgkontraster
- Stöd för hjälpmedelsteknik

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
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n-hanteringsskript

**`npm run i18n:verify`** - Verifiera konsekvensen av översättningsnycklar

**`npm run i18n:unused`** - Lista oanvända översättningsnycklar

**`npm run i18n:compare`** - Jämför översättningsfiler med fr.json (referens)

Detta skript (`scripts/compare-translations.cjs`) säkerställer synkroniseringen av alla språkfiler:

**Funktioner:**
- Upptäckt av saknade nycklar (finns i fr.json men saknas i andra språk)
- Upptäckt av extra nycklar (finns i andra språk men inte i fr.json)
- Identifiering av tomma värden (`""`, `null`, `undefined`, `[]`)
- Typkonsekvenskontroll (sträng vs array)
- Platta ut nästlade JSON-strukturer till punktnotation (t.ex. `arcade.multiMemory.title`)
- Generering av en detaljerad konsolrapport
- Spara JSON-rapporten i `docs/translations-comparison-report.json`

**Exempel på utdata:**

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

**Översättningstäckning:**

- Fullständigt användargränssnitt
- Spelinstruktioner
- Fel- och feedbackmeddelanden
- Beskrivningar och kontextuell hjälp
- Berättande innehåll i äventyrsläget
- Tillgänglighets- och ARIA-etiketter

## 📊 Datalagring

### Användardata

- Profiler och preferenser
- Progression per spelläge
- Poäng och statistik för arkadspel
- Anpassningsinställningar

### Tekniska funktioner

- Lokal lagring (localStorage) med reservalternativ
- Isolering av data per användare
- Automatisk sparande av progression
- Automatisk migrering av gamla data

## 🐛 Rapportera ett problem

Problem kan rapporteras via GitHub-issues. Vänligen inkludera:

- Detaljerad beskrivning av problemet
- Steg för att återskapa det
- Webbläsare och version
- Skärmdumpar om relevant

## 💝 Stöd projektet

**[☕ Donera via PayPal](https://paypal.me/jls)**

## 📄 Licens

Detta projekt är licensierat under AGPL v3-licensen. Se `LICENSE`-filen för mer information.

---

_LeapMultix - Modern pedagogisk applikation för att lära sig multiplikationstabellerna_

<details>
<summary>Detta dokument finns även tillgängligt på andra språk</summary>

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

<!-- Märken (uppdatera <owner>/<repo> efter GitHub-migrering) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![Licens: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

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

LeapMultix är en modern interaktiv pedagogisk webbapplikation utformad för barn (8–12 år) för att bemästra de 4 aritmetiska operationerna: multiplikation (×), addition (+), subtraktion (−) och division (÷). Appen erbjuder **5 spellägen** och **4 arkadminispel** i ett intuitivt, tillgängligt och flerspråkigt gränssnitt.

**Stöd för flera operationer:** Frågesport- och Utmaningslägen möjliggör övning av alla operationer. Upptäckts-, Äventyrs- och Arkadlägen fokuserar på multiplikation.

**Utvecklad av:** Julien LS (contact@jls42.org)

**Online URL:** https://leapmultix.jls42.org/

## ✨ Funktioner

### 🎮 Spellägen

- **Upptäcktsläge**: Visuell och interaktiv utforskning av multiplikationstabellerna
- **Frågesportläge** ⭐: Flervalsfrågor med stöd för de 4 operationerna (×, +, −, ÷) och adaptiv progression
- **Utmaningsläge** ⭐: Tävling mot klockan med de 4 operationerna (×, +, −, ÷) och olika svårighetsgrader
- **Äventyrsläge**: Narrativ progression genom nivåer med interaktiv karta (multiplikation)

⭐ = Fullt stöd för alla 4 aritmetiska operationer

### 🕹️ Arkadminispel

- **MultiInvaders**: Pedagogiskt Space Invaders - Förstör fel svar (multiplikation)
- **MultiMiam**: Matematisk Pac-Man - Samla rätt svar (multiplikation)
- **MultiMemory**: Minnesspel - Matcha multiplikationer med deras resultat
- **MultiSnake**: Pedagogiskt Snake - Väx genom att äta rätt nummer (multiplikation)

### ➕ Stöd för Flera Operationer

LeapMultix går längre än enkel multiplikation genom att erbjuda komplett träning för de 4 aritmetiska operationerna:

| Läge       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Frågesport | ✅  | ✅  | ✅  | ✅  |
| Utmaning   | ✅  | ✅  | ✅  | ✅  |
| Upptäckt   | ✅  | ❌  | ❌  | ❌  |
| Äventyr    | ✅  | ❌  | ❌  | ❌  |
| Arkad      | ✅  | ❌  | ❌  | ❌  |

**Obs:** Stöd för operationer för Upptäckts-, Äventyrs- och Arkadlägen planeras i en framtida version.

### 🌍 Tvärfunktionella Funktioner

- **Fleranvändare**: Hantering av individuella profiler med sparade framsteg
- **Flerspråkig**: Stöd för franska, engelska och spanska
- **Anpassning**: Avatarer, färgteman, bakgrunder
- **Tillgänglighet**: Tangentbordsnavigering, touchstöd, WCAG 2.1 AA-efterlevnad
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
# Applikationen kommer att vara tillgänglig på http://localhost:8080 (eller nästa lediga port)

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
npm run verify         # Quality gate: lint + test + coverage

# Tester
npm run test           # Kör alla tester (CJS)
npm run test:watch     # Tester i watch-läge
npm run test:coverage  # Tester med täckningsrapport
npm run test:core      # Tester endast för kärnmoduler
npm run test:integration # Integrationstester
npm run test:storage   # Tester för lagringssystem
npm run test:esm       # ESM-tester (mappen tests-esm/, Jest vm-modules)
npm run test:verbose   # Tester med detaljerad utdata
npm run test:pwa-offline # PWA offline-test (kräver Puppeteer), efter `npm run serve`

# Analys och underhåll
npm run analyze:jsdoc  # Dokumentationsanalys
npm run improve:jsdoc  # Automatisk JSDoc-förbättring
npm run audit:mobile   # Mobil responsivitetstester
npm run audit:accessibility # Tillgänglighetstester
npm run dead-code      # Detektering av oanvänd kod
npm run analyze:globals # Analys av globala variabler
npm run analyze:dependencies # Analys av beroendeanvändning
npm run verify:cleanup # Kombinerad analys (död kod + globala)

# Tillgångshantering
npm run assets:generate    # Generera responsiva bilder
npm run assets:backgrounds # Konvertera bakgrunder till WebP
npm run assets:analyze     # Analys av responsiva tillgångar
npm run assets:diff        # Jämförelse av tillgångar

# Internationalisering
npm run i18n:verify    # Verifiera konsistens för översättningsnycklar
npm run i18n:unused    # Lista oanvända översättningsnycklar
npm run i18n:compare   # Jämför översättningar (en/es) med fr.json (referens)

# Bygge & leverans
npm run build          # Produktionsbygge (Rollup) + postbuild (komplett dist/)
npm run serve:dist     # Servera dist/ på http://localhost:5000 (eller ledig port)

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
│   ├── core/               # ES6 kärnmoduler
│   │   ├── GameMode.js     # Basklass för lägen
│   │   ├── GameModeManager.js # Hantering av spellägen
│   │   ├── storage.js      # LocalStorage API
│   │   ├── audio.js        # Ljudhantering
│   │   ├── utils.js        # Generiska verktyg (kanonisk källa)
│   │   ├── eventBus.js     # Händelsebaserad kommunikation
│   │   ├── userState.js    # Hantering av användarsession
│   │   ├── mainInit.js     # DOM-ready initialisering
│   │   ├── theme.js        # Temasystem
│   │   ├── userUi.js       # Användargränssnittsverktyg
│   │   ├── parental.js     # Föräldrakontroller
│   │   ├── adventure-data.js # Data för äventyrsläge
│   │   ├── mult-stats.js   # Multiplikationsstatistik
│   │   ├── challenge-stats.js # Utmaningsstatistik
│   │   └── daily-challenge.js # Hantering av dagliga utmaningar
│   ├── components/         # Återanvändbara UI-komponenter
│   │   ├── topBar.js       # Navigationsfält
│   │   ├── infoBar.js      # Spelinformationsfält
│   │   ├── dashboard.js    # Användardashboard
│   │   └── customization.js # Anpassningsgränssnitt
│   ├── modes/              # Spellägen
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Arkadminispel
│   │   ├── arcade.js       # Huvudarkadorkestrator
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
│   ├── navigation/         # Navigeringssystem
│   │   ├── slides.js       # Slide-baserad navigering (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Tangentbordsstöd
│   ├── ui/                 # Användargränssnitt och återkoppling
│   │   ├── uiUtils.js      # Gränssnittsverktyg
│   │   ├── ui-feedback.js  # Mekanismer för återkoppling
│   │   ├── touch-support.js # Touchstöd (7 KB)
│   │   ├── virtual-keyboard.js # Virtuellt tangentbord
│   │   ├── coin-display.js, coin-effects.js # Valutasystem
│   │   ├── notifications.js # Aviseringssystem
│   │   └── badges.js       # Märkessystem
│   ├── media/              # Mediahantering
│   │   ├── VideoManager.js # Videouppspelningshantering (12 KB)
│   │   └── responsive-image-loader.js # Bildinläsning (9 KB)
│   ├── orchestration/      # Orkestrering och laddning
│   │   ├── mode-orchestrator.js # Lägesväxling
│   │   ├── lazy-loader.js  # Dynamisk laddning (10 KB)
│   │   └── game-cleanup.js # Tillståndsrensning
│   ├── utils/              # Verktyg
│   │   ├── utils-es6.js    # Huvudaggregator (5 KB)
│   │   ├── main-helpers.js # Applikationshjälpare
│   │   ├── helpers.js      # Äldre hjälparfunktioner
│   │   ├── stats-utils.js  # Statistikverktyg
│   │   ├── difficulty.js   # Svårighetshantering
│   │   └── questionGenerator.js # Frågegenerering
│   ├── storage/            # Lagring och tillstånd
│   │   ├── storage.js      # Äldre lagringswrapper
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
│   │   └── speech.js       # Text-till-tal-stöd
│   ├── integration/        # Integration och analys
│   │   ├── plausible-init.js # Plausible analytics
│   │   ├── cache-updater.js # Cachehantering (10 KB)
│   │   └── imports.js      # Importverktyg
│   ├── main-es6.js         # ES6-ingångspunkt
│   ├── main.js             # Huvudorkestrator
│   ├── bootstrap.js        # ES6 händelsehanterarkonfiguration
│   └── game.js             # Tillståndshantering och dagliga utmaningar
├── css/                    # Modulära stilar
├── assets/                 # Resurser
│   ├── images/             # Bilder och sprites
│   ├── generated-images/   # Genererade responsiva bilder
│   ├── sounds/             # Ljudeffekter
│   ├── translations/       # Översättningsfiler (fr, en, es)
│   └── videos/             # Instruktionsvideor
├── tests/                  # Automatiserade tester
│   ├── __tests__/          # Enhets- och integrationstester
│   └── tests-esm/          # ESM-tester (.mjs)
├── scripts/                # Underhållsskript
│   ├── compare-translations.cjs # Jämförelse av översättningar
│   └── cleanup-i18n-keys.cjs # Rensning av i18n-nycklar
└── dist/                   # Produktionsbygge (genererat)
```

### Teknisk Arkitektur

**Moderna ES6-moduler**: Projektet använder en modulär arkitektur med ES6-klasser och inbyggda importer/exporter.

**Återanvändbara Komponenter**: Gränssnitt byggt med centraliserade UI-komponenter (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligent laddning av moduler på begäran via `lazy-loader.js` för att optimera initial prestanda.

**Enhetligt Lagringssystem**: Centraliserat API för persistens av användardata via LocalStorage med reservlösningar.

**Centraliserad Ljudhantering**: Ljudkontroll med flerspråkigt stöd och preferenser per användare.

**Event Bus**: Frikopplad händelsebaserad kommunikation mellan komponenter för en underhållbar arkitektur.

**Slide-navigering**: Navigeringssystem baserat på numrerade slides (slide0, slide1, etc.) med `goToSlide()`.

**Säkerhet**: XSS-skydd och sanering via `security-utils.js` för alla DOM-manipulationer.

## 🎯 Detaljerade Spellägen

### Upptäcktsläge

Visuellt gränssnitt för att utforska multiplikationstabeller med:

- Interaktiv multiplikationsvisualisering
- Animationer och minnesstöd
- Pedagogisk dra-och-släpp
- Fri progression per tabell

### Frågesportläge

Flervalsfrågor med:

- 10 frågor per session
- Adaptiv progression baserat på framgång
- Virtuellt numeriskt tangentbord
- Streak-system (serie av rätta svar)

### Utmaningsläge

Lopp mot klockan med:

- 3 svårighetsgrader (Nybörjare, Medel, Svår)
- Tidsbonus för rätta svar
- Livssystem
- Rankning av bästa poäng

### Äventyrsläge

Narrativ progression med:

- 12 upplåsbara tematiska nivåer
- Interaktiv karta med visuell progression
- Uppslukande berättelse med karaktärer
- Stjärn- och belöningssystem

### Arkadminispel

Varje minispel erbjuder:

- Val av svårighet och anpassning
- Liv- och poängsystem
- Tangentbords- och touchkontroller
- Individuella rankningar per användare

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
   npm run format:check  # Kontrollera ALLTID formatering först
   npm run format        # Formatera om nödvändigt
   npm run lint          # Kontrollera kodkvalitet
   npm run test          # Kör tester
   npm run test:coverage # Kontrollera täckning
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

**Commit-stil**: Kortfattad, imperativ form (t.ex. "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Säkerställ att `npm run lint`, `npm test` och `npm run test:coverage` passerar före varje commit

### Komponentarkitektur

**GameMode (basklass)**: Alla lägen ärver från en gemensam klass med standardiserade metoder.

**GameModeManager**: Centraliserad orkestrering av start och hantering av lägen.

**UI-komponenter**: TopBar, InfoBar, Dashboard och Customization ger ett konsekvent gränssnitt.

**Lazy Loading**: Moduler laddas på begäran för att optimera initial prestanda.

**Event Bus**: Frikopplad kommunikation mellan komponenter via händelsesystemet.

### Tester

Projektet inkluderar en omfattande testsvit:

- Enhetstester av kärnmoduler
- Integrationstester av komponenter
- Tester av spellägen
- Automatiserad kodtäckning

```bash
npm test              # Alla tester (CJS)
npm test:core         # Tester av centrala moduler
npm test:integration  # Integrationstester
npm test:coverage     # Täckningsrapport
npm run test:esm      # ESM-tester (t.ex. components/dashboard) via vm-modules
```

### Produktionsbygge

- **Rollup**: Buntar `js/main-es6.js` i ESM med koduppdelning och källkartor
- **Terser**: Automatisk minifiering för optimering
- **Post-build**: Kopierar `css/` och `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, och skriver om `dist/index.html` till den hashade ingångsfilen (t.ex. `main-es6-*.js`)
- **Slutlig mapp**: `dist/` redo att serveras statiskt

```bash
npm run build      # genererar dist/
npm run serve:dist # serverar dist/ (port 5000)
```

### Kontinuerlig Integration (CI)

**GitHub Actions**: Automatiserad pipeline i `.github/workflows/ci.yml`

CI/CD-pipelinen körs automatiskt vid varje push och pull request:

**Huvudjobb**:

1. **build-test**: Huvudvalideringsjobb
   - Installation av beroenden: `npm ci`
   - Formateringskontroll: `npm run format:check`
   - Statisk analys: `npm run lint`
   - Enhetstester: `npm run test`
   - Säkerhetsrevision: `npm audit`
   - Generering av täckningsartefakt

2. **accessibility**: Tillgänglighetsrevision (icke-blockerande)
   - Kör `npm run audit:accessibility`
   - Genererar WCAG 2.1 AA tillgänglighetsrapport

3. **test-esm**: ES6-modultester
   - Kör `npm run test:esm` med Jest VM-moduler
   - Validerar ES6-importer/exporter

4. **lighthouse**: Prestandarevision (icke-blockerande)
   - Mobil prestandarevision
   - Generering av Lighthouse-rapportartefakter
   - Core Web Vitals-mätvärden

**Kvalitetsmärken**:

- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix är en fullständig PWA med offline-stöd och installationsmöjlighet.

**Service Worker** (`sw.js`):

- Navigering: Network-first med offline-fallback till `offline.html`
- Bilder: Cache-first för att optimera prestanda
- Översättningar: Stale-while-revalidate för bakgrundsuppdatering
- JS/CSS: Network-first för att alltid servera den senaste versionen
- Automatisk versionshantering via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- och PNG-ikoner för alla enheter
- Installerbar på mobil (Lägg till på hemskärmen)
- Standalone-konfiguration för app-liknande upplevelse
- Stöd för teman och färger

**Testa offline-läge lokalt**:

1. Starta utvecklingsservern:

   ```bash
   npm run serve
   ```

   Öppna `http://localhost:8080` (eller den visade porten)

2. Manuellt test:
   - Stäng av nätverket i DevTools (Fliken Network → Offline)
   - Uppdatera sidan → `offline.html` visas

3. Automatiserat test (Kräver Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Hanteringsskript för Service Worker**:

```bash
npm run sw:disable  # Inaktivera service worker
npm run sw:fix      # Åtgärda cacheproblem
```

### Kvalitetsstandarder

**Verktyg för kodkvalitet**:

- **ESLint**: Modern konfiguration med flat config (`eslint.config.js`), ES2022-stöd
- **Prettier**: Automatisk kodformatering (`.prettierrc`)
- **Stylelint**: CSS-validering (`.stylelintrc.json`)
- **JSDoc**: Automatisk funktionsdokumentation med täckningsanalys

**Viktiga kodregler**:

- Ta bort oanvända variabler och parametrar (`no-unused-vars`)
- Använd specifik felhantering (inga tomma catch-block)
- Undvik `innerHTML` till förmån för `security-utils.js`-funktioner
- Håll kognitiv komplexitet under 15 för funktioner
- Extrahera komplexa funktioner till mindre hjälpare

**Säkerhet**:

- **XSS-skydd**: Använd `security-utils.js`-funktioner:
  - `appendSanitizedHTML()` istället för `innerHTML`
  - `createSafeElement()` för säkert elementskapande
  - `setSafeMessage()` för textinnehåll
- **Externa Skript**: Attributet `crossorigin="anonymous"` obligatoriskt
- **Indatavalidering**: Sanera alltid externa data
- **Content Security Policy**: CSP-headers för att begränsa skriptkällor

**Tillgänglighet**:

- WCAG 2.1 AA-efterlevnad
- Full tangentbordsnavigering
- ARIA-roller och lämpliga etiketter
- Efterlevande färgkontraster

**Prestanda**:

- Lazy loading av moduler via `lazy-loader.js`
- CSS och responsiva tillgångsoptimeringar
- Service Worker för intelligent cachning
- Koduppdelning och minifiering i produktion

## 📱 Kompatibilitet

### Stödda webbläsare

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Enheter

- **Desktop**: Tangentbords- och muskontroller
- **Surfplattor**: Optimerat touchgränssnitt
- **Smartphones**: Adaptiv responsiv design

### Tillgänglighet

- Full tangentbordsnavigering (Tab, pilar, Esc)
- ARIA-roller och etiketter för skärmläsare
- Efterlevande färgkontraster
- Stöd för hjälpmedelstekniker

## 🌍 Lokalisering

Fullt flerspråkigt stöd:

- **Franska** (standardspråk)
- **Engelska**
- **Spanska**

### Översättningshantering

**Översättningsfiler:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Starta",
  "quiz_correct": "Bra jobbat!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n-hanteringsskript

**`npm run i18n:verify`** - Verifiera konsistens för översättningsnycklar

**`npm run i18n:unused`** - Lista oanvända översättningsnycklar

**`npm run i18n:compare`** - Jämför översättningsfiler med fr.json (referens)

Detta skript (`scripts/compare-translations.cjs`) säkerställer synkronisering av alla språkfiler:

**Funktioner:**

- Detektering av saknade nycklar (finns i fr.json men saknas på andra språk)
- Detektering av extra nycklar (finns på andra språk men inte i fr.json)
- Identifiering av tomma värden (`""`, `null`, `undefined`, `[]`)
- Kontroll av typkonsistens (sträng vs array)
- Utjämning av kapslade JSON-strukturer till punktnotation (t.ex. `arcade.multiMemory.title`)
- Generering av detaljerad konsolrapport
- Sparande av JSON-rapport till `docs/translations-comparison-report.json`

**Exempelutdata:**

```
🔍 Jämförande analys av översättningsfiler

📚 Referensspråk: fr.json
✅ fr.json: 335 nycklar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analys av en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Totalt nycklar: 335
✅ Inga saknade nycklar
✅ Inga extra nycklar
✅ Inga tomma värden

📊 SLUTSAMMANFATTNING
  fr.json: 335 nycklar
  en.json: 335 nycklar
  es.json: 335 nycklar

✅ Alla översättningsfiler är perfekt synkroniserade!
```

**Översättningstäckning:**

- Komplett användargränssnitt
- Spelinstruktioner
- Fel- och återkopplingsmeddelanden
- Beskrivningar och kontextkänslig hjälp
- Narrativt innehåll i äventyrsläge
- Tillgänglighetsetiketter och ARIA

## 📊 Datalagring

### Användardata

- Profiler och preferenser
- Framsteg per spelläge
- Poäng och statistik för arkadspel
- Anpassningsinställningar

### Tekniska funktioner

- Lokal lagring (localStorage) med reservlösningar
- Dataisolering per användare
- Automatisk sparande av framsteg
- Automatisk migrering av gamla data

## 🐛 Rapportera ett problem

Problem kan rapporteras via GitHub issues. Vänligen inkludera:

- Detaljerad beskrivning av problemet
- Steg för att reproducera
- Webbläsare och version
- Skärmdumpar om relevant

## 💝 Stöd projektet

**[☕ Donera via PayPal](https://paypal.me/jls)**

## 📄 Licens

Detta projekt är licensierat under AGPL v3. Se filen `LICENSE` för mer information.

---

_LeapMultix - Modern utbildningsapplikation för att lära sig multiplikationstabeller_

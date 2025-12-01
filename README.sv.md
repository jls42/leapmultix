<details>
<summary>Detta dokument finns även på andra språk</summary>

- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Deutsch](./README.de.md)
- [中文](./README.zh.md)
- [हिन्दी](./README.hi.md)
- [العربية](./README.ar.md)
- [Français](./README.md)
- [Italiano](./README.it.md)
- [Polski](./README.pl.md)
- [Nederlands](./README.nl.md)
- [Română](./README.ro.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)

</details>

# LeapMultix

<!-- Badges (uppdatera <owner>/<repo> efter GitHub-migrering) -->

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

LeapMultix är en modern interaktiv pedagogisk webbapplikation utformad för barn (8–12 år) att bemästra de 4 räknesätten: multiplikation (×), addition (+), subtraktion (−) och division (÷). Applikationen erbjuder **5 spellägen** och **4 arkadminispel** i ett intuitivt, tillgängligt och flerspråkigt gränssnitt.

**Stöd för flera räknesätt:** Quiz- och Utmaningslägen tillåter övning av alla räknesätt. Upptäckts-, Äventyrs- och Arkadlägen fokuserar på multiplikation men är utformade för att stödja alla räknesätt.

**Utvecklad av:** Julien LS (contact@jls42.org)

**URL Online:** https://leapmultix.jls42.org/

## ✨ Funktioner

### 🎮 Spellägen

- **Upptäcktsläge**: Visuell och interaktiv utforskning anpassad till varje räknesätt
- **Quizläge**: Flervalsfrågor med stöd för alla 4 räknesätt (×, +, −, ÷) och adaptiv progression
- **Utmaningsläge**: Race mot klockan med alla 4 räknesätt (×, +, −, ÷) och olika svårighetsgrader
- **Äventyrsläge**: Berättande progression via nivåer med stöd för alla 4 räknesätt

### 🕹️ Arkadminispel

- **MultiInvaders**: Pedagogiskt Space Invaders - Förstör fel svar
- **MultiMiam**: Matematisk Pac-Man - Samla de rätta svaren
- **MultiMemory**: Minnesspel - Matcha operationer och resultat
- **MultiSnake**: Pedagogisk Snake - Väx genom att äta rätt nummer

### ➕ Stöd för Flera Räknesätt

LeapMultix erbjuder komplett träning för de 4 räknesätten i **alla lägen**:

| Läge     | ×   | +   | −   | ÷   |
| -------- | --- | --- | --- | --- |
| Quiz     | ✅  | ✅  | ✅  | ✅  |
| Utmaning | ✅  | ✅  | ✅  | ✅  |
| Upptäckt | ✅  | ✅  | ✅  | ✅  |
| Äventyr  | ✅  | ✅  | ✅  | ✅  |
| Arkad    | ✅  | ✅  | ✅  | ✅  |

### 🌍 Övergripande Funktioner

- **Fleranvändare**: Hantering av individuella profiler med sparad progression
- **Flerspråkig**: Stöd för franska, engelska och spanska
- **Anpassning**: Avatarer, färgteman, bakgrunder
- **Tillgänglighet**: Tangentbordsnavigering, touchstöd, WCAG 2.1 AA-efterlevnad
- **Mobilanpassad**: Gränssnitt optimerat för surfplattor och smartphones
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

### Tillgängliga Skript

```bash
# Utveckling
npm run serve          # Lokal server (http://localhost:8080)
npm run lint           # Kodverifiering med ESLint
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
npm run test:storage   # Lagringssystemtester
npm run test:esm       # ESM-tester (mappar tests-esm/, Jest vm-modules)
npm run test:verbose   # Tester med detaljerad utdata
npm run test:pwa-offline # PWA offline-test (kräver Puppeteer), efter `npm run serve`

# Analys och Underhåll
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
npm run i18n:verify    # Verifiera konsistens av översättningsnycklar
npm run i18n:unused    # Lista oanvända översättningsnycklar
npm run i18n:compare   # Jämför översättningar (en/es) med fr.json (referens)

# Bygg & Leverans
npm run build          # Produktionsbygge (Rollup) + postbuild (komplett dist/)
npm run serve:dist     # Servera dist/ på http://localhost:5000 (eller tillgänglig port)

# PWA och Service Worker
npm run sw:disable     # Inaktivera service worker
npm run sw:fix         # Åtgärda service worker-problem
```

## 🏗️ Arkitektur

### Filstruktur

```
leapmultix/
├── index.html              # Huvudingångspunkt
├── js/
│   ├── core/               # ES6 kärnmoduler
│   │   ├── GameMode.js     # Basklass för lägen
│   │   ├── GameModeManager.js # Spellägeshantering
│   │   ├── storage.js      # LocalStorage API
│   │   ├── audio.js        # Ljudhantering
│   │   ├── utils.js        # Generiska verktyg (kanonisk källa)
│   │   ├── eventBus.js     # Händelsekommunikation
│   │   ├── userState.js    # Användarsessionshantering
│   │   ├── mainInit.js     # DOM-ready initialisering
│   │   ├── theme.js        # Temasystem
│   │   ├── userUi.js       # Användargränssnittsverktyg
│   │   ├── parental.js     # Föräldrakontroll
│   │   ├── adventure-data.js # Äventyrslägesdata
│   │   ├── mult-stats.js   # Multiplikationsstatistik
│   │   ├── challenge-stats.js # Utmaningsstatistik
│   │   └── daily-challenge.js # Hantering av dagliga utmaningar
│   ├── components/         # Återanvändbara UI-komponenter
│   │   ├── topBar.js       # Navigeringsfält
│   │   ├── infoBar.js      # Spelinfofält
│   │   ├── dashboard.js    # Användarpanel
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
│   │   ├── arcade-multimiam.js # MultiMiam-integration
│   │   ├── arcade-multisnake.js # Snake-integration
│   │   ├── arcade-common.js, arcade-utils.js # Delade verktyg
│   │   ├── arcade-message.js, arcade-points.js # UI-komponenter
│   │   └── arcade-scores.js # Poänghantering
│   ├── multimiam/          # Pac-Man spel (uppdelad arkitektur)
│   │   ├── multimiam.js    # Huvudkontroller
│   │   ├── multimiam-engine.js # Spelmotor (15 KB)
│   │   ├── multimiam-renderer.js # Renderingssystem (9 KB)
│   │   ├── multimiam-controls.js # Kontrollhantering (7 KB)
│   │   ├── multimiam-questions.js # Frågegenerering (6 KB)
│   │   └── multimiam-ui.js # Gränssnittselement
│   ├── multisnake.js       # Snake spel (38 KB)
│   ├── navigation/         # Navigeringssystem
│   │   ├── slides.js       # Slide-baserad navigering (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Tangentbordsstöd
│   ├── ui/                 # Användargränssnitt och feedback
│   │   ├── uiUtils.js      # Gränssnittsverktyg
│   │   ├── ui-feedback.js  # Feedbackmekanismer
│   │   ├── touch-support.js # Touchstöd (7 KB)
│   │   ├── virtual-keyboard.js # Virtuellt tangentbord
│   │   ├── coin-display.js, coin-effects.js # Valutasystem
│   │   ├── notifications.js # Aviseringssystem
│   │   └── badges.js       # Märkessystem
│   ├── media/              # Mediehantering
│   │   ├── VideoManager.js # Videouppspelningshantering (12 KB)
│   │   └── responsive-image-loader.js # Bildladdning (9 KB)
│   ├── orchestration/      # Orkestrering och laddning
│   │   ├── mode-orchestrator.js # Lägesväxling
│   │   ├── lazy-loader.js  # Dynamisk laddning (10 KB)
│   │   └── game-cleanup.js # Tillståndsstädning
│   ├── utils/              # Verktyg
│   │   ├── utils-es6.js    # Huvudaggregator (5 KB)
│   │   ├── main-helpers.js # Applikationshjälpare
│   │   ├── helpers.js      # Äldre hjälpfunktioner
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
│   │   └── speech.js       # Stöd för talsyntes
│   ├── integration/        # Integration och analys
│   │   ├── plausible-init.js # Plausible analys
│   │   ├── cache-updater.js # Cachehantering (10 KB)
│   │   └── imports.js      # Importverktyg
│   ├── main-es6.js         # ES6 ingångspunkt
│   ├── main.js             # Huvudorkestrator
│   ├── bootstrap.js        # ES6 händelsehanterare inställning
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
│   ├── compare-translations.cjs # Översättningsjämförelse
│   └── cleanup-i18n-keys.cjs # i18n nyckelstädning
└── dist/                   # Produktionsbygge (genererat)
```

### Teknisk Arkitektur

**Moderna ES6-moduler**: Projektet använder en modulär arkitektur med ES6-klasser och inbyggd import/export.

**Återanvändbara Komponenter**: Gränssnitt byggt med centraliserade UI-komponenter (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligent laddning av moduler på begäran via `lazy-loader.js` för att optimera initial prestanda.

**Enhetligt Lagringssystem**: Centraliserat API för persistens av användardata via LocalStorage med fallbacks.

**Centraliserad Ljudhantering**: Ljudkontroll med flerspråkigt stöd och preferenser per användare.

**Händelsebuss**: Frikopplad händelsestyrd kommunikation mellan komponenter för en underhållbar arkitektur.

**Slidenavigering**: Navigeringssystem baserat på numrerade slides (slide0, slide1, etc.) med `goToSlide()`.

**Säkerhet**: XSS-skydd och sanering via `security-utils.js` för alla DOM-manipulationer.

## 🎯 Detaljerade Spellägen

### Upptäcktsläge

Visuellt utforskningsgränssnitt för multiplikationstabeller med:

- Interaktiv visualisering av multiplikationer
- Animationer och minneshjälpmedel
- Pedagogisk drag-and-drop
- Fri progression per tabell

### Quizläge

Flervalsfrågor med:

- 10 frågor per session
- Adaptiv progression baserad på framgång
- Virtuell numerisk knappsats
- Streak-system (serie av korrekta svar)

### Utmaningsläge

Race mot klockan med:

- 3 svårighetsgrader (Nybörjare, Medel, Svår)
- Tidsbonus för korrekta svar
- Livssystem
- Topplista över bästa poäng

### Äventyrsläge

Berättande progression med:

- 12 upplåsbara tematiska nivåer
- Interaktiv karta med visuell progression
- Uppslukande berättelse med karaktärer
- Stjärnsystem och belöningar

### Arkadminispel

Varje minispel erbjuder:

- Val av svårighetsgrad och anpassning
- Livssystem och poäng
- Tangentbords- och touchkontroller
- Individuella topplistor per användare

## 🛠️ Utveckling

### Utvecklingsarbetsflöde

**VIKTIGT: Committa aldrig direkt till main**

Projektet använder ett arbetsflöde baserat på funktionsgrenar:

1.  **Skapa en gren**:

    ```bash
    git checkout -b feat/funktionsnamn
    # eller
    git checkout -b fix/buggnamn
    ```

2.  **Utveckla och testa**:

    ```bash
    npm run format:check  # Kontrollera ALLTID formatering först
    npm run format        # Formatera om det behövs
    npm run lint          # Kontrollera kodkvalitet
    npm run test          # Kör tester
    npm run test:coverage # Kontrollera täckning
    ```

3.  **Committa till grenen**:

    ```bash
    git add .
    git commit -m "feat: beskrivning av funktionen"
    ```

4.  **Pusha och skapa en Pull Request**:
    ```bash
    git push -u origin feat/funktionsnamn
    ```

**Commit-stil**: Kortfattad, imperativt läge (t.ex. "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Se till att `npm run lint`, `npm test` och `npm run test:coverage` passerar före varje commit

### Komponentarkitektur

**GameMode (basklass)**: Alla lägen ärver från en gemensam klass med standardiserade metoder.

**GameModeManager**: Centraliserad orkestrering av start och hantering av lägen.

**UI-komponenter**: TopBar, InfoBar, Dashboard och Customization ger ett konsekvent gränssnitt.

**Lazy Loading**: Moduler laddas på begäran för att optimera initial prestanda.

**Händelsebuss**: Frikopplad kommunikation mellan komponenter via händelsesystemet.

### Tester

Projektet innehåller en omfattande testsvit:

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

- **Rollup**: Bundlar `js/main-es6.js` till ESM med koduppdelning och källkartor
- **Terser**: Automatisk minifiering för optimering
- **Post-build**: Kopierar `css/` och `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, och skriver om `dist/index.html` till den hashade ingångsfilen (t.ex. `main-es6-*.js`)
- **Slutmapp**: `dist/` redo att serveras statiskt

```bash
npm run build      # genererar dist/
npm run serve:dist # serverar dist/ (port 5000)
```

### Kontinuerlig Integration

**GitHub Actions**: Automatiserad pipeline i `.github/workflows/ci.yml`

CI/CD-pipelinen körs automatiskt vid varje push och pull request:

**Huvudjobb**:

1.  **build-test**: Huvudvalideringsjobb
    - Beroendeinstallation: `npm ci`
    - Formateringskontroll: `npm run format:check`
    - Statisk analys: `npm run lint`
    - Enhetstester: `npm run test`
    - Säkerhetsrevision: `npm audit`
    - Generering av täckningsartefakt

2.  **accessibility**: Tillgänglighetsrevision (icke-blockerande)
    - Kör `npm run audit:accessibility`
    - Genererar WCAG 2.1 AA tillgänglighetsrapport

3.  **test-esm**: ES6-modultester
    - Kör `npm run test:esm` med Jest VM-moduler
    - Validerar ES6 import/export

4.  **lighthouse**: Prestandarevision (icke-blockerande)
    - Mobil prestandarevision
    - Genererar Lighthouse-rapportartefakter
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
- Översättningar: Stale-while-revalidate för bakgrundsuppdateringar
- JS/CSS: Network-first för att alltid servera den senaste versionen
- Automatisk versionshantering via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- och PNG-ikoner för alla enheter
- Installation möjlig på mobil (Lägg till på hemskärmen)
- Fristående konfiguration för app-liknande upplevelse
- Stöd för teman och färger

**Testa offline-läge lokalt**:

1.  Starta utvecklingsservern:

    ```bash
    npm run serve
    ```

    Öppna `http://localhost:8080` (eller den visade porten)

2.  Testa manuellt:
    - Klipp nätverket i DevTools (Fliken Network → Offline)
    - Uppdatera sidan → `offline.html` visas

3.  Automatiserat test (kräver Puppeteer):
    ```bash
    npm run test:pwa-offline
    ```

**Service Worker Hanteringsskript**:

```bash
npm run sw:disable  # Inaktivera service worker
npm run sw:fix      # Åtgärda cacheproblem
```

### Kvalitetsstandarder

**Kodkvalitetsverktyg**:

- **ESLint**: Modern konfiguration med flat config (`eslint.config.js`), ES2022-stöd
- **Prettier**: Automatisk kodformatering (`.prettierrc`)
- **Stylelint**: CSS-validering (`.stylelintrc.json`)
- **JSDoc**: Automatisk funktionsdokumentation med täckningsanalys

**Viktiga Kodregler**:

- Ta bort oanvända variabler och parametrar (`no-unused-vars`)
- Använd specifik felhantering (inga tomma catch)
- Undvik `innerHTML` till förmån för `security-utils.js`-funktioner
- Håll kognitiv komplexitet < 15 för funktioner
- Extrahera komplexa funktioner till mindre hjälpare

**Säkerhet**:

- **XSS-skydd**: Använd funktioner från `security-utils.js`:
  - `appendSanitizedHTML()` istället för `innerHTML`
  - `createSafeElement()` för att skapa säkra element
  - `setSafeMessage()` för textinnehåll
- **Externa Skript**: `crossorigin="anonymous"` attribut obligatoriskt
- **Indatavalidering**: Sanera alltid extern data
- **Content Security Policy**: CSP-rubriker för att begränsa skriptkällor

**Tillgänglighet**:

- WCAG 2.1 AA-efterlevnad
- Full tangentbordsnavigering
- ARIA-roller och lämpliga etiketter
- Efterlevande färgkontrast

**Prestanda**:

- Lazy loading av moduler via `lazy-loader.js`
- CSS- och responsiva tillgångsoptimeringar
- Service Worker för intelligent cachning
- Koduppdelning och minifiering i produktion

## 📱 Kompatibilitet

### Stödda Webbläsare

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Enheter

- **Skrivbord**: Tangentbords- och muskontroller
- **Surfplattor**: Optimerat touchgränssnitt
- **Smartphones**: Adaptiv responsiv design

### Tillgänglighet

- Full tangentbordsnavigering (Tab, Pilar, Escape)
- ARIA-roller och etiketter för skärmläsare
- Efterlevande färgkontrast
- Stöd för hjälpmedelsteknik

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

### i18n Hanteringsskript

**`npm run i18n:verify`** - Verifiera konsistens av översättningsnycklar

**`npm run i18n:unused`** - Lista oanvända översättningsnycklar

**`npm run i18n:compare`** - Jämför översättningsfiler med fr.json (referens)

Detta skript (`scripts/compare-translations.cjs`) säkerställer synkronisering av alla språkfiler:

**Funktioner:**

- Detektering av saknade nycklar (finns i fr.json men saknas på andra språk)
- Detektering av extra nycklar (finns på andra språk men inte i fr.json)
- Identifiering av tomma värden (`""`, `null`, `undefined`, `[]`)
- Typkonsistenskontroll (sträng vs array)
- Utplattning av kapslade JSON-strukturer till punktnotation (t.ex. `arcade.multiMemory.title`)
- Generering av detaljerad konsolrapport
- Spara JSON-rapport till `docs/translations-comparison-report.json`

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

📊 SLUTLIG SAMMANFATTNING
  fr.json: 335 nycklar
  en.json: 335 nycklar
  es.json: 335 nycklar

✅ Alla översättningsfiler är perfekt synkroniserade!
```

**Översättningstäckning:**

- Komplett användargränssnitt
- Spelinstruktioner
- Fel- och feedbackmeddelanden
- Beskrivningar och kontextuell hjälp
- Berättande innehåll i äventyrsläge
- Tillgänglighets- och ARIA-etiketter

## 📊 Datalagring

### Användardata

- Profiler och preferenser
- Progression per spelläge
- Arkadspelpoäng och statistik
- Anpassningsinställningar

### Tekniska Funktioner

- Lokal lagring (localStorage) med fallbacks
- Dataisolering per användare
- Automatisk progressionssparning
- Automatisk migrering av gamla data

## 🐛 Rapportera ett problem

Problem kan rapporteras via GitHub issues. Vänligen inkludera:

- Detaljerad beskrivning av problemet
- Steg för att återskapa
- Webbläsare och version
- Skärmdumpar om relevant

## 💝 Stöd Projektet

**[☕ Donera via PayPal](https://paypal.me/jls)**

## 📄 Licens

Detta projekt är licensierat under AGPL v3-licensen. Se filen `LICENSE` för mer information.

---

_LeapMultix - Modern pedagogisk applikation för att lära sig multiplikationstabeller_

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

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Licens: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

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

## Innehållsförteckning

- [Beskrivning](#beskrivning)
- [Översikt](#-översikt)
- [Funktioner](#-funktioner)
- [Snabbstart](#-snabbstart)
- [Arkitektur](#-arkitektur)
- [Detaljerade spellägen](#-detaljerade-spellägen)
- [Utveckling](#-utveckling)
- [Kompatibilitet](#-kompatibilitet)
- [Lokalisering](#-lokalisering)
- [Inspelad röst](#-inspelad-röst)
- [Datalagring](#-datalagring)
- [Rapportera ett problem](#-rapportera-ett-problem)
- [Licens](#-licens)

## Beskrivning

LeapMultix är en interaktiv pedagogisk webbapplikation för barn mellan 6 och 12 år för att bemästra de 4 räknesätten: multiplikation (×), addition (+), subtraktion (−) och division (÷). Den erbjuder **5 spellägen** och **4 arkadminispel** i ett intuitivt, tillgängligt och flerspråkigt gränssnitt.

**Stöd för flera räknesätt:** de fem lägena stöder alla fyra räknesätt. Valet görs på startskärmen och gäller under hela sessionen.

**Utvecklad av:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## 📸 Översikt

### Skärmarna

|                                                                                                     |                                                                                                                     |
| :-------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------: |
|                   ![Skärmen "Vem spelar?": profilval](docs/media/01-accueil.webp)                   |                      ![Huvudmeny: val av räknesätt och de fem lägena](docs/media/02-menu.webp)                      |
|                 **Vem spelar?** — en profil per barn, med egen avatar och framsteg.                 |                           **Menyn** — räknesättet väljs här, sedan öppnas de fem lägena.                            |
|           ![Upptäcktsläge: 4:ans tabell visad med prickar](docs/media/03-decouverte.webp)           |                   ![Quizläge: felaktigt svar i rött, rätt svar i grönt](docs/media/04-quiz.webp)                    |
|   **Upptäck** — varje tal visas med prickar, hopp eller räkning, tillsammans med tabellens tips.    | **Quiz** — barnets val förblir synligt bredvid det rätta svaret, och förklaringen redogör för beräkningen i detalj. |
|               ![Utmaningsläge: nedräkning och pågående svit](docs/media/05-defi.webp)               |            ![Äventyrsläge: karta över de tio nivåerna, efterföljande låsta](docs/media/06-aventure.webp)            |
| **Utmaning** — kamp mot klockan. Vid fel pausar tidtagaren så att man hinner läsa det rätta svaret. |                         **Äventyr** — tio nivåer som låses upp efter varandra mot stjärnor.                         |
|                     ![Arkadmeny: de fyra minispelen](docs/media/07-arcade.webp)                     |              ![Översiktspanel: stjärnor per tabell och statistik](docs/media/08-tableau-de-bord.webp)               |
|             **Arkad** — fyra minispel, med svårighetsinställning och val av rymdskepp.              |                  **Översiktspanel** — stjärnor per tabell, tabeller att repetera, poäng per läge.                   |
|         ![Anpassning: avatarer, teman, tillgänglighet](docs/media/09-personnalisation.webp)         |                                                                                                                     |
|             **Anpassning** — avatar, färgtema, textstorlek, hög kontrast, föräldrakod.              |                                                                                                                     |

### Arkadminispelen

Fyra spel som ställer samma fråga — den som visas ovanför spelytan, tillsammans med återstående tid och liv — men som varje gång kräver en ny handling.

|                                                                                                                   |                                                                                             |
| :---------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: |
|   ![MultiInvaders: monster med siffror, ett rymdskepp längst ner på skärmen](docs/media/10-multiinvaders.webp)    |   ![MultiMiam: en labyrint där prickar visar möjliga svar](docs/media/11-multimiam.webp)    |
|         **MultiInvaders** — skjut på felaktiga svar, skona det rätta: det gömmer en vän som ska befrias.          | **MultiMiam** — navigera genom labyrinten för att samla rätt resultat och undvika monstren. |
| ![MultiMemory: ett kortrutnät, två vända kort som visar en beräkning och ett tal](docs/media/12-multimemory.webp) |     ![MultiSnake: en orm och numrerade äpplen på en äng](docs/media/13-multisnake.webp)     |
|         **MultiMemory** — hitta ur minnet vilket kort som har resultatet av den beräkning som vänts upp.          |               **MultiSnake** — väx genom att äta rätt tal, undvik alla andra.               |

## ✨ Funktioner

### 🎮 Spellägen

- **Upptäcktsläge**: Visuell och interaktiv utforskning anpassad för varje räknesätt
- **Quizläge**: Flervalsfrågor med stöd för de 4 räknesätten (×, +, −, ÷) och adaptiv progression
- **Utmaningsläge**: Kamp mot klockan med de 4 räknesätten (×, +, −, ÷) och olika svårighetsgrader
- **Äventyrsläge**: Berättelsedriven progression nivå för nivå med stöd för de 4 räknesätten

### 🕹️ Arkadminispel

- **MultiInvaders**: Pedagogiskt Space Invaders – Förstör felaktiga svar
- **MultiMiam**: Matematiskt Pac-Man – Samla de rätta svaren
- **MultiMemory**: Memoryspel – Para ihop beräkningar och resultat
- **MultiSnake**: Pedagogiskt Snake – Väx genom att äta rätt tal

### ➕ Stöd för flera räknesätt

LeapMultix erbjuder en komplett träning i de 4 räknesätten i **alla lägen**:

| Läge     | ×   | +   | −   | ÷   |
| -------- | --- | --- | --- | --- |
| Quiz     | ✅  | ✅  | ✅  | ✅  |
| Utmaning | ✅  | ✅  | ✅  | ✅  |
| Upptäck  | ✅  | ✅  | ✅  | ✅  |
| Äventyr  | ✅  | ✅  | ✅  | ✅  |
| Arkad    | ✅  | ✅  | ✅  | ✅  |

### 🌍 Övergripande funktioner

- **Flera användare**: Hantering av individuella profiler med sparade framsteg
- **Flerspråkigt**: Stöd för franska, engelska och spanska
- **Anpassning**: Avatarer, färgteman, bakgrunder
- **Tillgänglighet**: Tangentbordsnavigering, pekskärmsstöd, uppfyller WCAG 2.1 AA
- **Inspelad röst**: spelet kan läsa upp frågor och uppmuntran med en förinspelad syntetisk röst, med automatisk återgång till enhetens röst. Rösterna finns inte i detta arkiv: webbplatsen leapmultix.jls42.org tillhandahåller Lucie på franska, Sulafat på engelska och spanska, samt som alternativ Marie på franska och Jane på engelska (se [Inspelad röst](#-inspelad-röst))
- **Mobilanpassad (responsiv)**: Gränssnitt optimerat för surfplattor och smarttelefoner
- **Progressionssystem**: Poäng, märken, dagliga utmaningar

## 🚀 Snabbstart

### Förutsättningar

- Node.js (version 16 eller senare)
- En modern webbläsare

### Installation

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

### Tillgängliga skript

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

## 🧱 Arkitektur

### Filstruktur

JavaScript-modulerna ligger **platt i `js/`**, förutom tre mappar:
`core/`, `components/` och `modes/`. Det är alltså filnamnet som anger
grupperingen (`arcade-*`, `multimiam-*`, `i18n*`…).

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

### Teknisk arkitektur

**Moderna ES6-moduler**: Projektet använder en modulär arkitektur med ES6-klasser och inbyggda imports/exports.

**Återanvändbara komponenter**: Gränssnittet är uppbyggt med centraliserade UI-komponenter (TopBar, InfoBar, Dashboard, Customization).

**Lazy loading**: Smart inläsning av moduler vid behov via `lazy-loader.js` för att optimera den initiala prestandan.

**Enhetligt lagringssystem**: Centraliserat API för persistens av användardata via LocalStorage med fallbacks.

**Centraliserad ljudhantering**: Ljudkontroll med flerspråksstöd och inställningar per användare.

**Händelsebuss (Event Bus)**: Frånkopplad händelsestyrd kommunikation mellan komponenter för en underhållbar arkitektur.

**Slidenavigering**: Navigeringssystem baserat på numrerade slides (slide0, slide1 osv.) med `goToSlide()`.

**Säkerhet**: XSS-skydd och sanering via `security-utils.js` för all DOM-manipulering.

## 🎯 Detaljerade spellägen

### Upptäcktsläge

Gränssnitt för visuell utforskning av multiplikationstabellerna med:

- Interaktiv visualisering av multiplikationer
- Animeringar och minnesstöd
- Pedagogisk dra-och-släpp
- Fri progression per tabell

### Quizläge

Flervalsfrågor med:

- 10 frågor per session
- Adaptiv progression baserad på framgångar
- Virtuell sifferknappsats
- Streak-system (svit av rätta svar i rad)

### Utmaningsläge

Kamp mot klockan med:

- 3 svårighetsgrader (Nybörjare, Medel, Svår)
- Tidsbonus för rätta svar
- Livsystem
- Topplista över bästa poäng

### Äventyrsläge

Berättelsedriven progression med:

- 10 upplåsbara temanivåer
- Interaktiv karta med visuell progression
- Fängslande berättelse med karaktärer
- Stjärn- och belöningssystem

### Arkadminispel

Varje minispel erbjuder:

- Val av svårighetsgrad och anpassning
- Livsystem och poäng
- Tangentbords- och pekkontroller
- Individuella topplistor per användare

## 🔧 Utveckling

### Arbetsflöde för utveckling

**Gör aldrig commits direkt på main.** Projektet arbetar med funktionsgrenar.

**1. Skapa en gren**, `feat/` för en funktion, `fix/` för en buggfix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Utveckla och verifiera.** Formateringen kommer först: CI avvisar den
redan innan testerna körs.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Gör en commit på grenen**, och pusha den sedan:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Öppna en pull request** och invänta analyserna: verify, Codacy,
CodeFactor och SonarCloud. Åtgärda tills allt är grönt innan sammanslagning.

**Commit-stil**: Korta meddelanden, imperativ form (t.ex. "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Se till att `npm run lint`, `npm test` och `npm run test:coverage` passerar före varje commit

### Komponentarkitektur

**GameMode (basklass)**: Alla lägen ärver från en gemensam klass med standardiserade metoder.

**GameModeManager**: Centraliserad orkestrering av start och hantering av lägena.

**UI-komponenter**: TopBar, InfoBar, Dashboard och Customization ger ett enhetligt gränssnitt.

**Lazy loading**: Moduler läses in vid behov för att optimera den initiala prestandan.

**Händelsebuss (Event Bus)**: Frånkopplad kommunikation mellan komponenter via händelsesystemet.

### Tester

Projektet innehåller en komplett testsvit:

- Enhetstester av core-moduler
- Integrationstester av komponenter
- Tester av spellägen
- Automatiserad kodtäckning

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Produktionsbygge

- **Rollup**: Paketerar `js/main-es6.js` i ESM med koduppdelning och sourcemaps
- **Terser**: Automatisk minifiering för optimering
- **Post-build**: Kopierar `css/` och `assets/`, favikoner (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, samt omskrivning av `dist/index.html` till den hashade startfilen (t.ex. `main-es6-*.js`)
- **Slutlig mapp**: `dist/` redo att servas statiskt

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Kontinuerlig integration (CI)

**GitHub Actions**: `.github/workflows/ci.yml`, triggas vid varje push till
`main` och vid varje pull request.

**`verify`** — kvalitetsgrinden, blockerande:

- `npm ci` och sedan `npm run verify` (ESLint, Jest-tester, kodtäckning)
- `npm run format:check` (Prettier)

**`seo-report`** — efter `verify`: Lighthouse-granskning av live-webbplatsen för
att följa SEO-mått över tid.

**Externa analyser** kopplade till pull requests: Codacy, CodeFactor och
SonarCloud. SonarCloud-grinden kräver A-betyg i tillförlitlighet, säkerhet och
underhållbarhet för ny kod.

**Driftsättning**: `./deploy.sh` synkroniserar webbplatsen till S3 och ogiltigförklarar CloudFront-cachen.
Skriptet återskapar vid behov responsiva bilder som inte finns i git.

### PWA (Progressive Web App)

LeapMultix är en komplett PWA med offlinestöd och möjlighet till installation.

**Service Worker** (`sw.js`):

- Navigering: Network-first med offline-fallback till `offline.html`
- Bilder: Cache-first för att optimera prestanda
- Översättningar: Stale-while-revalidate för uppdatering i bakgrunden
- JS/CSS: Network-first för att alltid leverera den senaste versionen
- Automatisk versionshantering via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- och PNG-ikoner för alla enheter
- Möjlighet att installera på mobil (Lägg till på hemskärmen)
- Fristående konfiguration (standalone) för en appliknande upplevelse
- Stöd för teman och färger

**Testa offlineläget lokalt.** Starta servern och öppna sedan
`http://localhost:8080` (eller den port som visas):

```bash
npm run serve
```

Manuellt: koppla bort nätverket i utvecklarverktygen (fliken Nätverk,
offlineläge) och uppdatera sedan sidan. `offline.html` ska visas.

Automatiskt med Puppeteer:

```bash
npm run test:pwa-offline
```

**Hanteringsskript för Service Worker**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Kvalitetsstandarder

**Verktyg för kodkvalitet**:

- **ESLint**: Modern konfiguration med flat config (`eslint.config.js`), stöd för ES2022
- **Prettier**: Automatisk kodformatering (`.prettierrc`)
- **Stylelint**: CSS-validering (`.stylelintrc.json`)
- **JSDoc**: Automatisk funktionsdokumentation med täckningsanalys

**Viktiga kodregler**:

- Ta bort oanvända variabler och parametrar (`no-unused-vars`)
- Använd specifik felhantering (inga tomma catch-block)
- Undvik `innerHTML` till förmån för `security-utils.js`-funktioner
- Håll funktionernas kognitiva komplexitet < 15
- Bryt ut komplexa funktioner i mindre hjälpfunktioner (helpers)

**Säkerhet**:

- **XSS-skydd**: Använd funktionerna i `security-utils.js`:
  - `appendSanitizedHTML()` istället för `innerHTML`
  - `createSafeElement()` för att skapa säkra element
  - `setSafeMessage()` för textinnehåll
- **Externa skript**: Attributet `crossorigin="anonymous"` är obligatoriskt
- **Indatavalidering**: Sanera alltid externa data
- **Content Security Policy**: CSP-headers för att begränsa skriptkällor

**Tillgänglighet**:

- Efterlevnad av WCAG 2.1 AA
- Fullständig tangentbordsnavigering
- Lämpliga ARIA-roller och etiketter
- Färgkontraster som uppfyller kraven

**Prestanda**:

- Lazy loading av moduler via `lazy-loader.js`
- CSS-optimeringar och responsiva resurser
- Service Worker för intelligent cachning
- Koddelning (code splitting) och minifiering i produktion

## 📱 Kompatibilitet

### Webbläsare som stöds

Gränssnittet bygger på `oklch()` för färger och på `:has()` för
kontextuella tillstånd, vilket sätter minimikraven:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Enheter

- **Stationär/bärbar dator**: Tangentbords- och musstyrning
- **Surfplattor**: Optimerat pekgränssnitt
- **Smarttelefoner**: Adaptiv responsiv design

### Tillgänglighet

- Fullständig tangentbordsnavigering (Tabb, piltangenter, Esc)
- ARIA-roller och etiketter för skärmläsare
- Färgkontraster som uppfyller kraven
- Stöd för hjälpmedelsteknik

## 🌍 Lokalisering

Fullständigt flerspråksstöd:

- **Franska** (standardspråk)
- **Engelska**
- **Spanska**

### Hantering av översättningar

**Översättningsfiler:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Skript för i18n-hantering

**`npm run i18n:verify`** – Kontrollera enhetligheten hos översättningsnycklar

**`npm run i18n:unused`** – Lista oanvända översättningsnycklar

**`npm run i18n:compare`** – Jämför översättningsfilerna med fr.json (referens)

Detta skript (`scripts/compare-translations.cjs`) säkerställer synkroniseringen av alla språkfiler:

**Funktioner:**

- Identifiering av saknade nycklar (finns i fr.json men saknas i andra språk)
- Identifiering av överflödiga nycklar (finns i andra språk men inte i fr.json)
- Identifiering av tomma värden (`""`, `null`, `undefined`, `[]`)
- Typkontroll för enhetlighet (sträng vs array)
- Utplattning av kapslade JSON-strukturer till punktnotation (t.ex. `arcade.multiMemory.title`)
- Generering av en detaljerad konsolrapport
- Sparar JSON-rapporten i `docs/translations-comparison-report.json`

**Exempel på utdata:**

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

**Översättningstäckning:**

- Komplett användargränssnitt
- Spelinstruktioner
- Felmeddelanden och feedback
- Beskrivningar och kontextuell hjälp
- Berättande innehåll i äventyrsläget
- Tillgänglighets- och ARIA-etiketter

## 🔊 Inspelad röst

Spelet läser upp frågor, uppmuntran och förklaringar. Det säger endast en begränsad uppsättning fraser, cirka 7 400 per språk: de kan därför spelas in en gång för alla, och inget spelanrop görs då till en talsyntestjänst. Utan ljudklipp läser spelet med enhetens röst.

### I detta arkiv: applikationen, utan rösterna

Koden kan spela upp förinspelade klipp och innehåller kedjan som skapar dem. Klippen finns inte här, och inte heller leverantörernas nycklar: en fork eller lokal installation läser med enhetens röst.

- **Automatisk återgång (fallback)** till enhetens röst, fras för fras: klipp saknas eller felar, uppspelning nekas av webbläsaren, klipp som inte startar inom 1,5 s, eller offline utan cachat klipp.
- **Inställningar**: röstknappen i det övre fältet aktiverar eller stänger av uppspelningen; kryssrutan "Inspelad röst" (Tillgänglighet och kontroller) väljer mellan inspelad röst och enhetens röst. Den visas endast för språk där en röst har publicerats.
- **Offline**: klipp som redan har spelats upp ligger kvar i cachen (service worker).
- **Var spelet letar efter klippen**: i taggen `<meta name="leapmultix-voice-base">`, som är tom i arkivet. Endast produktionsdriftsättningen skriver `/voice/` där.

Med dina egna klipp på datorn (skapade med kedjan nedan, placerade intill spelet i `../leapmultix-voices`) gör parametern `?voix=local` att utvecklingsservern spelar upp dem:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### På leapmultix.jls42.org: värdmiljöns röster

Webbplatsen som tillhandahålls av skaparen levererar inspelade syntetiska röster:

- på franska, **Lucie**, skapad med ElevenLabs (modellen Eleven v3);
- på brittisk engelska och spansk spanska, **Sulafat**, skapad med Google Cloud Text-to-Speech (rösten Chirp 3 HD);
- efter spelarens val, **Marie** på franska och **Jane** på engelska, skapade med Mistral AI (Voxtral TTS).

Klippen finns i ett privat arkiv och i en dedikerad S3-bucket, som levereras via CloudFront på `/voice/*`. I inställningarna erbjuder menyn "Röst" de olika rösterna för språket när det finns flera, och texten anger tjänsten bakom den röst som hörs.

### Generera klippen

Kedjan är skriptad i `scripts/voice/` och körs på ägarens dator, aldrig i den offentliga CI:n. Leverantörernas nycklar (ElevenLabs för franska, Google Cloud Text-to-Speech för engelska och spanska, Mistral för Marie och Jane) stannar i en `.env`-fil utanför arkivet, skickad via `node --env-file`: ingen nyckel hamnar i git. Claude Code-skillen [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) går igenom proceduren steg för steg (grindar, överenskommelser, omtagningar); detaljerna finns i [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Uppskatta** återstående fraser och tecken att betala för (Eleven v3: ca 0,53 krediter per tecken; Chirp 3 HD: 30 $ per miljon tecken, den första miljonen varje månad gratis; Voxtral TTS: 16 $ per miljon).
2. **Generera**. Att köra samma kommando igen återupptar det som saknas. När krediterna tar slut avslutas skriptet kontrollerat (kod 3) utan att lämna några halvskrivna filer. `--max-total-chars` sätter ett tak för versionens ackumulerade kostnad: varje betalt svar registreras direkt vid mottagandet i en logg, som överlever ett plötsligt avbrott. Hos Google och Mistral, som inte tillhandahåller något läsbart saldo, är detta det enda skyddet.
3. **Kontrollera**: varje fras har sitt klipp och varje MP3-fil är giltig. Whisper transkriberar sedan varje klipp lokalt, och kontrollen flaggar felaktigt uppfattade siffror och onormala tidslängder. `voice:review` kedjar samman Whisper, denna kontroll och lyssningssidan i ett enda kommando.
4. **Lyssna** på lyssningssidan (`voice:listen`) på de flaggade klippen och ett urval av feminina former ("une fois 7"), som Whisper inte skiljer på. Varje klipp har en kryssruta "gör om", som lägger till det i listan över förkastade klipp.
5. **Gör om** de förkastade klippen (`--redo`) och kör Whisper igen, jämför sedan varje klipp före och efter på en andra sida. Ett klipp som fortfarande uttalas fel efter två eller tre försök får en tvingande text i `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), till exempel talet utskrivet med bokstäver.
6. **Publicera** klippen, verifiera att de svarar online, och publicera sedan språkindexet, först för testare (`?voix=test`).
7. **Öppna** rösten för alla och aktivera den sedan som standard. Nödstoppet/brytaren (`voice:publish -- remove`) tar bort ett språk från indexet: spelet återgår till enhetens röst.

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

### Regel: en ändrad uppläst fras spelas in på nytt före produktionssättning

Varje uppläst fras kommer från översättningarna (`assets/translations/{fr,en,es}.json`) och är en del av textkorpusen. Att ändra en talad fras gör därför att testet för korpuslåset (`scripts/voice/corpus.lock.json`) misslyckas. För ett språk som har en inspelad röst genererar man då klippen för de berörda fraserna, kontrollerar och lyssnar på dem, och publicerar dem sedan **innan** sammanslagning (merge). Slutligen uppdateras låset (`npm run voice:corpus:lock`). Utan dessa klipp läses den ändrade frasen upp med enhetens röst.

## 📊 Datalagring

### Användardata

- Profiler och inställningar
- Framsteg per spelläge
- Poäng och statistik för arkadspelen
- Anpassningsinställningar

### Tekniska funktioner

- Lokal lagring (localStorage) med fallbacks
- Dataisolering per användare
- Automatisk sparning av framsteg
- Automatisk migrering av äldre data

## 🐛 Rapportera ett problem

Problem kan rapporteras via GitHub Issues. Vänligen inkludera:

- Detaljerad beskrivning av problemet
- Steg för att återskapa det
- Webbläsare och version
- Skärmdumpar om det är relevant

## 💝 Stöd projektet

**[☕ Gör en donation via PayPal](https://paypal.me/jls)**

## 📄 Licens

Detta projekt är licensierat under AGPL v3. Se filen `LICENSE` för mer information.

---

_LeapMultix – öppen och fri pedagogisk applikation för att lära sig de fyra räknesätten_

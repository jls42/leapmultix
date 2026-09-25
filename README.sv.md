<details>
<summary>Det här dokumentet finns även på andra språk</summary>

- [Engelska](./README.en.md)
- [Spanska](./README.es.md)
- [Portugisiska](./README.pt.md)
- [Tyska](./README.de.md)
- [Kinesiska](./README.zh.md)
- [Hindi](./README.hi.md)
- [Arabiska](./README.ar.md)
- [Italienska](./README.it.md)
- [Svenska](./README.sv.md)
- [Polska](./README.pl.md)
- [Nederländska](./README.nl.md)
- [Rumänska](./README.ro.md)
- [Japanska](./README.ja.md)
- [Koreanska](./README.ko.md)

</details>

# LeapMultix

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Licens: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy-märke](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Status för kvalitetsgrind](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Tillförlitlighetsbetyg](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Säkerhetsbetyg](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Underhållbarhetsbetyg](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Teknisk skuld](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Buggar](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Sårbarheter](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Kodproblem](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Duplicerade rader (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Kodrader](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

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

LeapMultix är en interaktiv pedagogisk webbapplikation för barn mellan 6 och 12 år som hjälper dem att behärska de fyra räknesätten: multiplikation (×), addition (+), subtraktion (−) och division (÷). Den erbjuder **5 spellägen** och **4 arkadminispel** i ett intuitivt, tillgängligt och flerspråkigt gränssnitt.

**Stöd för flera räknesätt:** alla fem lägen stöder de fyra räknesätten. Valet görs på startskärmen och gäller under hela spelsessionen.

**Utvecklad av:** Julien LS (contact@jls42.org)

**Webbadress:** https://leapmultix.jls42.org/

## 📸 Översikt

### Skärmarna

|                                                                                                          |                                                                                                        |
| :------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|                   ![Skärmen ”Vem spelar?”: val av profil](docs/media/01-accueil.webp)                    |               ![Huvudmeny: val av räknesätt och de fem lägena](docs/media/02-menu.webp)                |
|                  **Vem spelar?** — en profil per barn, med barnets avatar och framsteg.                  |                   **Menyn** — här väljs räknesättet och sedan öppnas de fem lägena.                    |
|             ![Upptäckarläge: fyrans tabell visas med punkter](docs/media/03-decouverte.webp)             |                ![Quizläge: fel svar i rött, rätt svar i grönt](docs/media/04-quiz.webp)                |
| **Upptäck** — varje likhet visas med punkter, hopp eller räkning, tillsammans med tabellens minnesknep.  | **Quiz** — barnets val visas bredvid det rätta svaret och förklaringen beskriver uträkningen i detalj. |
|                 ![Utmaningsläge: nedräkning och pågående svit](docs/media/05-defi.webp)                  |     ![Äventyrsläge: karta över de tio nivåerna, de kommande är låsta](docs/media/06-aventure.webp)     |
| **Utmaning** — tävla mot klockan. Vid ett fel stannar tidtagningen så att det rätta svaret hinner läsas. |                 **Äventyr** — tio nivåer som öppnas en efter en i utbyte mot stjärnor.                 |
|                       ![Arkadmeny: de fyra minispelen](docs/media/07-arcade.webp)                        |        ![Översiktspanel: stjärnor per tabell och statistik](docs/media/08-tableau-de-bord.webp)        |
|            **Arkad** — fyra minispel med inställning av svårighetsgrad och val av rymdskepp.             |          **Översiktspanel** — stjärnor per tabell, tabeller att repetera och poäng per läge.           |
|          ![Anpassning: avatarer, teman och tillgänglighet](docs/media/09-personnalisation.webp)          |                                                                                                        |
|              **Anpassning** — avatar, färgtema, textstorlek, hög kontrast och föräldrakod.               |                                                                                                        |

### Arkadminispelen

Fyra spel som ställer samma fråga — den som visas ovanför spelområdet,
tillsammans med återstående tid och liv — men som varje gång kräver en annan
handling.

|                                                                                                                        |                                                                                          |
| :--------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: |
|     ![MultiInvaders: monster med nummer och ett rymdskepp längst ned på skärmen](docs/media/10-multiinvaders.webp)     | ![MultiMiam: en labyrint där prickarna visar möjliga svar](docs/media/11-multimiam.webp) |
|      **MultiInvaders** — skjut på de felaktiga svaren och skona det rätta: där gömmer sig en vän som ska befrias.      | **MultiMiam** — ta dig genom labyrinten för att fånga rätt resultat och undvik monstren. |
| ![MultiMemory: ett rutnät med kort, där två vända kort visar en uträkning och ett tal](docs/media/12-multimemory.webp) |   ![MultiSnake: en orm och numrerade äpplen på en äng](docs/media/13-multisnake.webp)    |
|                 **MultiMemory** — kom ihåg vilket kort som visar resultatet av den vända uträkningen.                  |            **MultiSnake** — väx genom att äta rätt tal och undvik alla andra.            |

## ✨ Funktioner

### 🎮 Spellägen

- **Upptäckarläge**: Visuell och interaktiv utforskning anpassad till varje räknesätt
- **Quizläge**: Flervalsfrågor med stöd för de fyra räknesätten (×, +, −, ÷) och adaptiv progression
- **Utmaningsläge**: Tävla mot klockan med de fyra räknesätten (×, +, −, ÷) och olika svårighetsgrader
- **Äventyrsläge**: Berättelsedriven progression genom nivåer med stöd för de fyra räknesätten

### 🕹️ Arkadminispel

- **MultiInvaders**: Pedagogiskt Space Invaders-spel – förstör de felaktiga svaren
- **MultiMiam**: Matematiskt Pac-Man-spel – samla in de rätta svaren
- **MultiMemory**: Memoryspel – para ihop räknesätt och resultat
- **MultiSnake**: Pedagogiskt Snake-spel – väx genom att äta rätt tal

### ➕ Stöd för flera räknesätt

LeapMultix erbjuder fullständig träning i de fyra räknesätten i **alla lägen**:

| Läge     | ×   | +   | −   | ÷   |
| -------- | --- | --- | --- | --- |
| Quiz     | ✅  | ✅  | ✅  | ✅  |
| Utmaning | ✅  | ✅  | ✅  | ✅  |
| Upptäck  | ✅  | ✅  | ✅  | ✅  |
| Äventyr  | ✅  | ✅  | ✅  | ✅  |
| Arkad    | ✅  | ✅  | ✅  | ✅  |

### 🌍 Övergripande funktioner

- **Flera användare**: Hantering av individuella profiler med sparade framsteg
- **Flerspråkighet**: Stöd för franska, engelska och spanska
- **Anpassning**: Avatarer, färgteman och bakgrunder
- **Tillgänglighet**: Tangentbordsnavigering, stöd för pekskärm och efterlevnad av WCAG 2.1 AA
- **Inspelad röst**: frågor och uppmuntrande meddelanden läses upp av en förinspelad syntetisk röst (skapad med ElevenLabs), med automatisk reservlösning via enhetens röst; klippen ingår inte i det offentliga kodförrådet (se [Inspelad röst](#-inspelad-röst))
- **Mobilanpassning**: Gränssnitt optimerat för surfplattor och smarttelefoner
- **Progressionssystem**: Poäng, märken och dagliga utmaningar

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
npm run voice:generate     # Générer les clips (ElevenLabs)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Arkitektur

### Filstruktur

JavaScript-modulerna ligger **direkt i `js/`**, med undantag för tre mappar:
`core/`, `components/` och `modes/`. Det är alltså filnamnet som anger
grupperingen (`arcade-*`, `multimiam-*`, `i18n*` …).

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

**Återanvändbara komponenter**: Gränssnittet är byggt med centraliserade UI-komponenter (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligent inläsning av moduler vid behov via `lazy-loader.js` för att optimera den initiala prestandan.

**Enhetligt lagringssystem**: Centraliserat API för beständig lagring av användardata via LocalStorage med reservlösningar.

**Centraliserad ljudhantering**: Ljudkontroll med flerspråkigt stöd och individuella användarinställningar.

**Event Bus**: Frikopplad händelsebaserad kommunikation mellan komponenter för en underhållbar arkitektur.

**Bildbaserad navigering**: Navigeringssystem baserat på numrerade bilder (slide0, slide1 osv.) med `goToSlide()`.

**Säkerhet**: XSS-skydd och sanering via `security-utils.js` för all DOM-manipulering.

## 🎯 Detaljerade spellägen

### Upptäckarläge

Gränssnitt för visuell utforskning av multiplikationstabeller med:

- Interaktiv visualisering av multiplikationer
- Animationer och minneshjälpmedel
- Pedagogisk dra-och-släpp-funktion
- Fri progression per tabell

### Quizläge

Flervalsfrågor med:

- 10 frågor per omgång
- Adaptiv progression baserad på resultaten
- Virtuellt numeriskt tangentbord
- System för sviter (flera rätta svar i rad)

### Utmaningsläge

Tävla mot klockan med:

- 3 svårighetsgrader (Nybörjare, Medel, Svår)
- Tidsbonus för rätta svar
- Livsystem
- Topplista över de bästa poängen

### Äventyrsläge

Berättelsedriven progression med:

- 10 tematiska nivåer som kan låsas upp
- Interaktiv karta med visuell progression
- Fängslande berättelse med karaktärer
- System med stjärnor och belöningar

### Arkadminispel

Varje minispel erbjuder:

- Val av svårighetsgrad och anpassning
- Liv- och poängsystem
- Styrning med tangentbord och pekskärm
- Individuella topplistor per användare

## 🔧 Utveckling

### Utvecklingsflöde

**Committa aldrig direkt till main.** Projektet arbetar med
funktionsgrenar.

**1. Skapa en gren**, `feat/` för en funktion, `fix/` för en korrigering:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Utveckla och verifiera.** Formateringen kommer först: CI avvisar den
innan testerna ens körs.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Committa på grenen** och pusha den sedan:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Öppna en pull request** och invänta analyserna: verify, Codacy,
CodeFactor och SonarCloud. Korrigera tills allt är grönt innan sammanslagning.

**Commitstil**: Koncisa meddelanden i imperativ form (t.ex. ”Fix arcade init errors”, ”Refactor cache updater”)

**Quality gate**: Säkerställ att `npm run lint`, `npm test` och `npm run test:coverage` godkänns före varje commit

### Komponentarkitektur

**GameMode (basklass)**: Alla lägen ärver från en gemensam klass med standardiserade metoder.

**GameModeManager**: Centraliserad orkestrering av start och hantering av lägen.

**UI-komponenter**: TopBar, InfoBar, Dashboard och Customization ger ett enhetligt gränssnitt.

**Lazy Loading**: Modulerna läses in vid behov för att optimera den initiala prestandan.

**Event Bus**: Frikopplad kommunikation mellan komponenter via händelsesystemet.

### Tester

Projektet innehåller en komplett testsvit:

- Enhetstester för core-moduler
- Integrationstester för komponenter
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

- **Rollup**: Paketerar `js/main-es6.js` som ESM med code-splitting och sourcemaps
- **Terser**: Automatisk minifiering för optimering
- **Post-build**: Kopierar `css/` och `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, och skriver om `dist/index.html` till den hashade startfilen (t.ex. `main-es6-*.js`)
- **Slutmapp**: `dist/` redo för statisk servering

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Kontinuerlig integration

**GitHub Actions**: `.github/workflows/ci.yml`, utlöses vid varje push till
`main` och vid varje pull request.

**`verify`** — den blockerande kvalitetsgrinden:

- `npm ci` och sedan `npm run verify` (ESLint, Jest-tester, täckning)
- `npm run format:check` (Prettier)

**`seo-report`** — efter `verify`: Lighthouse-granskning av den publicerade webbplatsen för att
följa SEO-mätvärden över tid.

**Externa analyser** kopplade till pull requests: Codacy, CodeFactor och
SonarCloud. SonarCloud-grinden kräver betyget A för tillförlitlighet, säkerhet och
underhållbarhet för ny kod.

**Driftsättning**: `./deploy.sh` synkroniserar webbplatsen till S3 och ogiltigförklarar
CloudFront-cachen. Skriptet återskapar vid behov de responsiva bilder som inte finns i git.

### PWA (Progressive Web App)

LeapMultix är en fullständig PWA med stöd för offlineläge och möjlighet till installation.

**Service Worker** (`sw.js`):

- Navigering: Network-first med offlinereserv till `offline.html`
- Bilder: Cache-first för att optimera prestandan
- Översättningar: Stale-while-revalidate för uppdatering i bakgrunden
- JS/CSS: Network-first för att alltid leverera den senaste versionen
- Automatisk versionshantering via `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- och PNG-ikoner för alla enheter
- Kan installeras på mobila enheter (Add to Home Screen)
- Standalone-konfiguration för en applikationsliknande upplevelse
- Stöd för teman och färger

**Testa offlineläget lokalt.** Starta servern och öppna sedan
`http://localhost:8080` (eller den port som visas):

```bash
npm run serve
```

Manuellt: stäng av nätverket i utvecklarverktygen (fliken Nätverk,
offlineläge) och uppdatera sedan sidan. `offline.html` ska visas.

Automatiskt med Puppeteer:

```bash
npm run test:pwa-offline
```

**Skript för hantering av Service Worker**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Kvalitetsstandarder

**Verktyg för kodkvalitet**:

- **ESLint**: Modern konfiguration med flat config (`eslint.config.js`), stöd för ES2022
- **Prettier**: Automatisk kodformatering (`.prettierrc`)
- **Stylelint**: CSS-validering (`.stylelintrc.json`)
- **JSDoc**: Automatisk dokumentation av funktioner med täckningsanalys

**Viktiga kodregler**:

- Ta bort oanvända variabler och parametrar (`no-unused-vars`)
- Använd specifik felhantering (inga tomma catch-block)
- Undvik `innerHTML` till förmån för `security-utils.js`-funktioner
- Håll den kognitiva komplexiteten < 15 för funktioner
- Dela upp komplexa funktioner i mindre helpers

**Säkerhet**:

- **XSS-skydd**: Använd funktionerna i `security-utils.js`:
  - `appendSanitizedHTML()` i stället för `innerHTML`
  - `createSafeElement()` för att skapa säkra element
  - `setSafeMessage()` för textinnehåll
- **Externa skript**: Attributet `crossorigin="anonymous"` är obligatoriskt
- **Indatavalidering**: Sanera alltid externa data
- **Content Security Policy**: CSP-headers för att begränsa skriptkällor

**Tillgänglighet**:

- Överensstämmelse med WCAG 2.1 AA
- Fullständig tangentbordsnavigering
- Lämpliga ARIA-roller och etiketter
- Färgkontraster som uppfyller kraven

**Prestanda**:

- Lazy loading av moduler via `lazy-loader.js`
- CSS-optimeringar och responsiva assets
- Service Worker för intelligent cachelagring
- Code splitting och minifiering i produktion

## 📱 Kompatibilitet

### Webbläsare som stöds

Gränssnittet använder `oklch()` för färger och `:has()` för
kontextuella tillstånd, vilket sätter den lägsta nivån till:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Enheter

- **Desktop**: Styrning med tangentbord och mus
- **Surfplattor**: Optimerat pekgränssnitt
- **Smartphones**: Anpassningsbar responsiv design

### Tillgänglighet

- Fullständig tangentbordsnavigering (Tabb, piltangenter, Esc)
- ARIA-roller och etiketter för skärmläsare
- Färgkontraster som uppfyller kraven
- Stöd för hjälpmedelsteknik

## 🌍 Lokalisering

Fullständigt flerspråkigt stöd:

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

**`npm run i18n:verify`** – Kontrollera att översättningsnycklarna är konsekventa

**`npm run i18n:unused`** – Lista oanvända översättningsnycklar

**`npm run i18n:compare`** – Jämför översättningsfilerna med fr.json (referens)

Det här skriptet (`scripts/compare-translations.cjs`) håller alla språkfiler synkroniserade:

**Funktioner:**

- Identifiering av saknade nycklar (finns i fr.json men saknas på andra språk)
- Identifiering av extra nycklar (finns på andra språk men inte i fr.json)
- Identifiering av tomma värden (`""`, `null`, `undefined`, `[]`)
- Kontroll av typöverensstämmelse (string jämfört med array)
- Utplattning av nästlade JSON-strukturer till punktnotation (t.ex. `arcade.multiMemory.title`)
- Generering av en detaljerad konsolrapport
- Lagring av JSON-rapporten i `docs/translations-comparison-report.json`

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

- Fullständigt användargränssnitt
- Spelinstruktioner
- Fel- och återkopplingsmeddelanden
- Beskrivningar och kontextuell hjälp
- Berättande innehåll i äventyrsläget
- Tillgänglighetsetiketter och ARIA-etiketter

## 🔊 Inspelad röst

Spelet läser upp frågor, uppmuntrande fraser och förklaringar. På franska används **Lucie**, en syntetisk röst skapad med ElevenLabs (modellen Eleven v3). Spelet använder endast en begränsad uppsättning fraser, omkring 7 400 per språk: samtliga spelas in i förväg och ingen del anropar ElevenLabs. Engelska och spanska använder tills vidare enhetens röst.

- **Automatisk reservlösning** med enhetens röst, fras för fras: om ett klipp saknas eller ger ett fel, om webbläsaren vägrar uppspelning, om klippet inte startar inom 1,5 s eller om enheten är offline och klippet inte finns i cachen.
- **Inställningar**: röstknappen i det övre fältet aktiverar eller stänger av uppläsningen; kryssrutan ”Inspelad röst” (Tillgänglighet och styrning) växlar mellan Lucie och enhetens röst.
- **Offline**: klipp som redan har spelats upp finns kvar i cachen (service worker).

### Klippen finns inte i det här repositoriet

Klippen finns i ett privat repositorium och i en särskild S3-bucket som levereras via CloudFront på `/voice/*`. En fork eller lokal utveckling använder därför enhetens röst: i repositoriet är taggen `<meta name="leapmultix-voice-base">` tom, och endast produktionsdistributionen skriver `/voice/` i den.

När klippen finns lokalt (det privata repositoriet har klonats bredvid spelet, i `../leapmultix-voices`) gör parametern `?voix=local` att utvecklingsservern levererar dem:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Generera klippen

Flödet är skriptat i `scripts/voice/` och körs på ägarens dator, aldrig i offentlig CI. ElevenLabs-nyckeln ligger kvar i en `.env`-fil utanför repositoriet och skickas via `node --env-file`: ingen nyckel hamnar i git. Claude Code-skillen [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) går igenom processen steg för steg (kontrollpunkter, godkännanden, återupptagningar); detaljer finns i [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Uppskatta** antalet återstående fraser och antalet tecken som ska betalas (Eleven v3: cirka 0,53 krediter per tecken).
2. **Generera**. Om samma kommando körs igen återupptas det som återstår. När krediterna är slut avslutas skriptet korrekt (kod 3) utan att lämna någon halvskriven fil.
3. **Kontrollera**: varje fras har ett klipp och varje MP3 är giltig. Whisper transkriberar sedan varje klipp lokalt, och `voice:check` markerar feluppfattade tal och avvikande längder.
4. **Lyssna** på lyssningssidan (`voice:listen`) på de markerade klippen och ett urval av feminina former (”en gång 7”), som Whisper inte kan skilja åt. Varje klipp har en kryssruta ”gör om”, som lägger till det i listan över underkända klipp.
5. **Gör om** de underkända klippen (`--redo`) och kör Whisper igen, jämför sedan varje klipp före och efter på en andra sida. Ett klipp som fortfarande uttalas fel efter två eller tre försök får en fastställd text i `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), till exempel talet utskrivet med bokstäver.
6. **Publicera** klippen, kontrollera att de är tillgängliga online och publicera sedan språkets index, först för testarna (`?voix=test`).
7. **Gör** rösten tillgänglig för alla och aktivera den sedan som standard. Nödstoppet (`voice:publish -- remove`) tar bort ett språk från indexet: spelet återgår då till enhetens röst.

```bash
# 1. Estimer (sans frais)
npm run voice:generate -- --lang fr --dry-run
# 2. Générer (payant)
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --reserve 5000
# 3. Contrôler (Whisper s'installe une fois : voir l'en-tête de whisper_transcribe.py)
npm run voice:check -- --lang fr --probe
.venv-whisper/bin/python scripts/voice/whisper_transcribe.py --manifest ../leapmultix-voices/manifests/fr/<version>.json --clips ../leapmultix-voices/clips/fr/<version> --lang fr --out transcripts-fr.jsonl
npm run voice:check -- --lang fr --transcripts transcripts-fr.jsonl
# 4. Écouter (page locale ; la liste « à refaire » va dans ecartes.txt)
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl
# 5. Refaire (payant), relancer Whisper (il ne transcrit que les clips refaits), comparer
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --redo ecartes.txt
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl --compare ecartes.txt
# 6. Publier
npm run voice:publish -- clips --lang fr --bucket <bucket>
npm run voice:check-online -- --lang fr
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience test
# 7. Ouvrir
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience all --default-on
```

### Regel: en ändrad uppläst fras spelas in på nytt före produktionssättning

Alla upplästa fraser kommer från översättningarna (`assets/translations/{fr,en,es}.json`) och ingår i korpusen. Om en talad fras ändras misslyckas därför testet av korpuslåset (`scripts/voice/corpus.lock.json`). För ett språk som har en inspelad röst genereras då klippen för de berörda fraserna, de kontrolleras och avlyssnas och publiceras sedan **innan** ändringarna slås samman. Slutligen uppdateras låset (`npm run voice:corpus:lock`). Utan dessa klipp läses den ändrade frasen upp med enhetens röst.

## 📊 Datalagring

### Användardata

- Profiler och inställningar
- Framsteg per spelläge
- Poäng och statistik för arkadspelen
- Anpassningsinställningar

### Tekniska funktioner

- Lokal lagring (localStorage) med reservlösningar
- Separering av data per användare
- Automatisk lagring av framsteg
- Automatisk migrering av äldre data

## 🐛 Rapportera ett problem

Problem kan rapporteras via GitHub issues. Inkludera gärna:

- En detaljerad beskrivning av problemet
- Steg för att återskapa det
- Webbläsare och version
- Skärmbilder om det är relevant

## 💝 Stöd projektet

**[☕ Donera via PayPal](https://paypal.me/jls)**

## 📄 Licens

Det här projektet är licensierat under AGPL v3. Se filen `LICENSE` för mer information.

---

_LeapMultix – en fri utbildningsapp för att lära sig de fyra räknesätten_

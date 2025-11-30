<details>
<summary>Acest document este disponibil și în alte limbi</summary>

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
- [Nederlands](./README.nl.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)

</details>

# LeapMultix

<!-- Insigne (actualizați <owner>/<repo> după migrarea GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Cuprins

- [Descriere](#descriere)
- [Caracteristici](#-caracteristici)
- [Start Rapid](#-start-rapid)
- [Arhitectură](#-arhitectură)
- [Moduri de Joc Detaliate](#-moduri-de-joc-detaliate)
- [Dezvoltare](#-dezvoltare)
- [Compatibilitate](#-compatibilitate)
- [Localizare](#-localizare)
- [Stocarea Datelor](#-stocarea-datelor)
- [Raportarea Problemelor](#-raportarea-problemelor)
- [Licență](#-licență)

## Descriere

LeapMultix este o aplicație web educațională interactivă modernă, concepută pentru copii (8–12 ani) pentru a stăpâni cele 4 operații aritmetice: înmulțirea (×), adunarea (+), scăderea (−) și împărțirea (÷). Aplicația oferă **5 moduri de joc** și **4 mini-jocuri arcade** într-o interfață intuitivă, accesibilă și multilingvă.

**Suport multi-operații:** Modurile Quiz și Provocare permit exersarea tuturor operațiilor. Modurile Descoperire, Aventură și Arcade se concentrează pe înmulțire, dar sunt concepute pentru a susține toate operațiile.

**Dezvoltat de:** Julien LS (contact@jls42.org)

**URL Online:** https://leapmultix.jls42.org/

## ✨ Caracteristici

### 🎮 Moduri de Joc

- **Modul Descoperire**: Explorare vizuală și interactivă adaptată fiecărei operații
- **Modul Quiz**: Întrebări cu răspunsuri multiple cu suport pentru toate cele 4 operații (×, +, −, ÷) și progresie adaptivă
- **Modul Provocare**: Cursă contra cronometru cu toate cele 4 operații (×, +, −, ÷) și diferite niveluri de dificultate
- **Modul Aventură**: Progresie narativă pe niveluri cu suport pentru toate cele 4 operații

### 🕹️ Mini-jocuri Arcade

- **MultiInvaders**: Space Invaders educațional - Distruge răspunsurile greșite
- **MultiMiam**: Pac-Man matematic - Colectează răspunsurile corecte
- **MultiMemory**: Joc de memorie - Potrivește operațiile și rezultatele
- **MultiSnake**: Snake educațional - Crește mâncând numerele corecte

### ➕ Suport Multi-Operații

LeapMultix oferă instruire completă pentru cele 4 operații aritmetice în **toate modurile**:

| Mod         | ×   | +   | −   | ÷   |
| ----------- | --- | --- | --- | --- |
| Quiz        | ✅  | ✅  | ✅  | ✅  |
| Provocare   | ✅  | ✅  | ✅  | ✅  |
| Descoperire | ✅  | ✅  | ✅  | ✅  |
| Aventură    | ✅  | ✅  | ✅  | ✅  |
| Arcade      | ✅  | ✅  | ✅  | ✅  |

### 🌍 Caracteristici Transversale

- **Multi-utilizator**: Gestionarea profilurilor individuale cu progres salvat
- **Multilingv**: Suport pentru franceză, engleză și spaniolă
- **Personalizare**: Avatare, teme de culoare, fundaluri
- **Accesibilitate**: Navigare prin tastatură, suport tactil, conformitate WCAG 2.1 AA
- **Mobile responsive**: Interfață optimizată pentru tablete și smartphone-uri
- **Sistem de progresie**: Scoruri, insigne, provocări zilnice

## 🚀 Start Rapid

### Cerințe Preliminare

- Node.js (versiunea 16 sau mai mare)
- Un browser web modern

### Instalare

```bash
# Clonează proiectul
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Instalează dependențele
npm install

# Pornește serverul de dezvoltare (opțiunea 1)
npm run serve
# Aplicația va fi accesibilă la http://localhost:8080 (sau următorul port disponibil)

# Sau cu Python (opțiunea 2)
python3 -m http.server 8000
# Aplicația va fi accesibilă la http://localhost:8000
```

### Scripturi Disponibile

```bash
# Dezvoltare
npm run serve          # Server local (http://localhost:8080)
npm run lint           # Verificare cod cu ESLint
npm run lint:fix       # Corectare automată a problemelor ESLint
npm run format:check   # Verifică formatarea codului (ÎNTOTDEAUNA înainte de commit)
npm run format         # Formatează codul cu Prettier
npm run verify         # Poartă de calitate: lint + test + coverage

# Teste
npm run test           # Rulează toate testele (CJS)
npm run test:watch     # Teste în mod watch
npm run test:coverage  # Teste cu raport de acoperire
npm run test:core      # Teste doar pentru modulele de bază
npm run test:integration # Teste de integrare
npm run test:storage   # Teste sistem de stocare
npm run test:esm       # Teste ESM (foldere tests-esm/, Jest vm-modules)
npm run test:verbose   # Teste cu ieșire detaliată
npm run test:pwa-offline # Test offline PWA (necesită Puppeteer), după `npm run serve`

# Analiză și Întreținere
npm run analyze:jsdoc  # Analiză documentație
npm run improve:jsdoc  # Îmbunătățire automată JSDoc
npm run audit:mobile   # Teste de responsivitate mobilă
npm run audit:accessibility # Teste de accesibilitate
npm run dead-code      # Detectare cod neutilizat
npm run analyze:globals # Analiză variabile globale
npm run analyze:dependencies # Analiză utilizare dependențe
npm run verify:cleanup # Analiză combinată (cod mort + globale)

# Gestionare Active
npm run assets:generate    # Generează imagini responsive
npm run assets:backgrounds # Convertește fundalurile în WebP
npm run assets:analyze     # Analiză active responsive
npm run assets:diff        # Comparare active

# Internaționalizare
npm run i18n:verify    # Verifică consistența cheilor de traducere
npm run i18n:unused    # Listează cheile de traducere neutilizate
npm run i18n:compare   # Compară traducerile (en/es) cu fr.json (referință)

# Build & Livrare
npm run build          # Build de producție (Rollup) + postbuild (dist/ complet)
npm run serve:dist     # Servește dist/ pe http://localhost:5000 (sau port disponibil)

# PWA și Service Worker
npm run sw:disable     # Dezactivează service worker
npm run sw:fix         # Corectează problemele service worker
```

## 🏗️ Arhitectură

### Structura Fișierelor

```
leapmultix/
├── index.html              # Punct de intrare principal
├── js/
│   ├── core/               # Module de bază ES6
│   │   ├── GameMode.js     # Clasă de bază pentru moduri
│   │   ├── GameModeManager.js # Gestionare moduri de joc
│   │   ├── storage.js      # API LocalStorage
│   │   ├── audio.js        # Gestionare sunet
│   │   ├── utils.js        # Utilitare generice (sursă canonică)
│   │   ├── eventBus.js     # Comunicare evenimente
│   │   ├── userState.js    # Gestionare sesiune utilizator
│   │   ├── mainInit.js     # Inițializare DOM-ready
│   │   ├── theme.js        # Sistem teme
│   │   ├── userUi.js       # Utilitare interfață utilizator
│   │   ├── parental.js     # Control parental
│   │   ├── adventure-data.js # Date modul aventură
│   │   ├── mult-stats.js   # Statistici înmulțire
│   │   ├── challenge-stats.js # Statistici provocare
│   │   └── daily-challenge.js # Gestionare provocări zilnice
│   ├── components/         # Componente UI reutilizabile
│   │   ├── topBar.js       # Bară de navigare
│   │   ├── infoBar.js      # Bare de informații joc
│   │   ├── dashboard.js    # Panou utilizator
│   │   └── customization.js # Interfață personalizare
│   ├── modes/              # Moduri de joc
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Mini-jocuri arcade
│   │   ├── arcade.js       # Orchestrator principal arcade
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Joc de memorie (31 KB)
│   │   ├── arcade-multimiam.js # Integrare MultiMiam
│   │   ├── arcade-multisnake.js # Integrare Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilitare partajate
│   │   ├── arcade-message.js, arcade-points.js # Componente UI
│   │   └── arcade-scores.js # Gestionare scoruri
│   ├── multimiam/          # Joc Pac-Man (arhitectură descompusă)
│   │   ├── multimiam.js    # Controler principal
│   │   ├── multimiam-engine.js # Motor joc (15 KB)
│   │   ├── multimiam-renderer.js # Sistem randare (9 KB)
│   │   ├── multimiam-controls.js # Gestionare controale (7 KB)
│   │   ├── multimiam-questions.js # Generare întrebări (6 KB)
│   │   └── multimiam-ui.js # Elemente interfață
│   ├── multisnake.js       # Joc Snake (38 KB)
│   ├── navigation/         # Sistem de navigare
│   │   ├── slides.js       # Navigare bazată pe slide-uri (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Suport tastatură
│   ├── ui/                 # Interfață utilizator și feedback
│   │   ├── uiUtils.js      # Utilitare interfață
│   │   ├── ui-feedback.js  # Mecanisme de feedback
│   │   ├── touch-support.js # Suport tactil (7 KB)
│   │   ├── virtual-keyboard.js # Tastatură virtuală
│   │   ├── coin-display.js, coin-effects.js # Sistem monedă
│   │   ├── notifications.js # Sistem notificări
│   │   └── badges.js       # Sistem insigne
│   ├── media/              # Gestionare media
│   │   ├── VideoManager.js # Gestionare redare video (12 KB)
│   │   └── responsive-image-loader.js # Încărcare imagini (9 KB)
│   ├── orchestration/      # Orchestrare și încărcare
│   │   ├── mode-orchestrator.js # Comutare moduri
│   │   ├── lazy-loader.js  # Încărcare dinamică (10 KB)
│   │   └── game-cleanup.js # Curățare stare
│   ├── utils/              # Utilitare
│   │   ├── utils-es6.js    # Agregator principal (5 KB)
│   │   ├── main-helpers.js # Ajutoare aplicație
│   │   ├── helpers.js      # Funcții ajutor vechi
│   │   ├── stats-utils.js  # Utilitare statistici
│   │   ├── difficulty.js   # Gestionare dificultate
│   │   └── questionGenerator.js # Generare întrebări
│   ├── storage/            # Stocare și stare
│   │   ├── storage.js      # Wrapper stocare vechi
│   │   └── userManager.js  # Gestionare multi-utilizator (19 KB)
│   ├── i18n/               # Internaționalizare
│   │   ├── i18n.js         # Sistem i18n
│   │   └── i18n-store.js   # Stocare traduceri
│   ├── security/           # Securitate și gestionare erori
│   │   ├── security-utils.js # Protecție XSS, igienizare
│   │   ├── error-handlers.js # Gestionare globală erori
│   │   └── logger.js       # Sistem jurnalizare
│   ├── accessibility/      # Accesibilitate
│   │   ├── accessibility.js # Funcții accesibilitate
│   │   └── speech.js       # Suport sinteză vocală
│   ├── integration/        # Integrare și analize
│   │   ├── plausible-init.js # Analize Plausible
│   │   ├── cache-updater.js # Gestionare cache (10 KB)
│   │   └── imports.js      # Utilitare import
│   ├── main-es6.js         # Punct de intrare ES6
│   ├── main.js             # Orchestrator principal
│   ├── bootstrap.js        # Configurare gestionare evenimente ES6
│   └── game.js             # Gestionare stare și provocări zilnice
├── css/                    # Stiluri modulare
├── assets/                 # Resurse
│   ├── images/             # Imagini și sprite-uri
│   ├── generated-images/   # Imagini responsive generate
│   ├── sounds/             # Efecte sonore
│   ├── translations/       # Fișiere traducere (fr, en, es)
│   └── videos/             # Videoclipuri tutoriale
├── tests/                  # Teste automate
│   ├── __tests__/          # Teste unitare și de integrare
│   └── tests-esm/          # Teste ESM (.mjs)
├── scripts/                # Scripturi de întreținere
│   ├── compare-translations.cjs # Comparare traduceri
│   └── cleanup-i18n-keys.cjs # Curățare chei i18n
└── dist/                   # Build de producție (generat)
```

### Arhitectură Tehnică

**Module ES6 Moderne**: Proiectul folosește o arhitectură modulară cu clase ES6 și import/export nativ.

**Componente Reutilizabile**: Interfață construită cu componente UI centralizate (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Încărcare inteligentă la cerere a modulelor via `lazy-loader.js` pentru a optimiza performanța inițială.

**Sistem de Stocare Unificat**: API centralizat pentru persistența datelor utilizatorului prin LocalStorage cu opțiuni de rezervă.

**Gestionare Audio Centralizată**: Control sunet cu suport multilingv și preferințe per utilizator.

**Event Bus**: Comunicare decuplată bazată pe evenimente între componente pentru o arhitectură ușor de întreținut.

**Navigare Slide**: Sistem de navigare bazat pe slide-uri numerotate (slide0, slide1 etc.) cu `goToSlide()`.

**Securitate**: Protecție XSS și igienizare via `security-utils.js` pentru toate manipulările DOM.

## 🎯 Moduri de Joc Detaliate

### Modul Descoperire

Interfață vizuală de explorare a tablelor înmulțirii cu:

- Vizualizare interactivă a înmulțirilor
- Animații și ajutoare de memorie
- Drag-and-drop educațional
- Progresie liberă per tablă

### Modul Quiz

Întrebări cu răspunsuri multiple cu:

- 10 întrebări pe sesiune
- Progresie adaptivă bazată pe succes
- Tastatură numerică virtuală
- Sistem de serii (serie de răspunsuri corecte)

### Modul Provocare

Cursă contra cronometru cu:

- 3 niveluri de dificultate (Începător, Mediu, Dificil)
- Bonus de timp pentru răspunsuri corecte
- Sistem de vieți
- Clasament cu cele mai bune scoruri

### Modul Aventură

Progresie narativă cu:

- 12 niveluri tematice deblocabile
- Hartă interactivă cu progresie vizuală
- Poveste imersivă cu personaje
- Sistem de stele și recompense

### Mini-jocuri Arcade

Fiecare mini-joc oferă:

- Alegerea dificultății și personalizare
- Sistem de vieți și scor
- Controale tastatură și tactile
- Clasamente individuale per utilizator

## 🛠️ Dezvoltare

### Flux de Lucru Dezvoltare

**IMPORTANT: Nu comiteți niciodată direct pe main**

Proiectul folosește un flux de lucru bazat pe ramuri de funcționalități:

1.  **Creează o ramură**:

    ```bash
    git checkout -b feat/nume-functionalitate
    # sau
    git checkout -b fix/nume-bug
    ```

2.  **Dezvoltă și testează**:

    ```bash
    npm run format:check  # ÎNTOTDEAUNA verifică formatarea mai întâi
    npm run format        # Formatează dacă este necesar
    npm run lint          # Verifică calitatea codului
    npm run test          # Rulează testele
    npm run test:coverage # Verifică acoperirea
    ```

3.  **Comite pe ramură**:

    ```bash
    git add .
    git commit -m "feat: descrierea funcționalității"
    ```

4.  **Împinge și creează un Pull Request**:
    ```bash
    git push -u origin feat/nume-functionalitate
    ```

**Stil commit**: Concis, mod imperativ (ex: "Fix arcade init errors", "Refactor cache updater")

**Poartă de calitate**: Asigurați-vă că `npm run lint`, `npm test` și `npm run test:coverage` trec înainte de fiecare commit

### Arhitectura Componentelor

**GameMode (clasă de bază)**: Toate modurile moștenesc dintr-o clasă comună cu metode standardizate.

**GameModeManager**: Orchestrare centralizată a lansării și gestionării modurilor.

**Componente UI**: TopBar, InfoBar, Dashboard și Customization oferă o interfață consistentă.

**Lazy Loading**: Modulele sunt încărcate la cerere pentru a optimiza performanța inițială.

**Event Bus**: Comunicare decuplată între componente prin sistemul de evenimente.

### Teste

Proiectul include o suită cuprinzătoare de teste:

- Teste unitare pentru modulele de bază
- Teste de integrare pentru componente
- Teste moduri de joc
- Acoperire automată a codului

```bash
npm test              # Toate testele (CJS)
npm test:core         # Teste module de bază
npm test:integration  # Teste de integrare
npm test:coverage     # Raport de acoperire
npm run test:esm      # Teste ESM (ex: components/dashboard) via vm-modules
```

### Build de Producție

- **Rollup**: Împachetează `js/main-es6.js` în ESM cu code-splitting și sourcemaps
- **Terser**: Minificare automată pentru optimizare
- **Post-build**: Copiază `css/` și `assets/`, favicon-urile (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, și rescrie `dist/index.html` la fișierul de intrare cu hash (ex: `main-es6-*.js`)
- **Folder final**: `dist/` gata pentru a fi servit static

```bash
npm run build      # generează dist/
npm run serve:dist # servește dist/ (port 5000)
```

### Integrare Continuă

**GitHub Actions**: Pipeline automatizat în `.github/workflows/ci.yml`

Pipeline-ul CI/CD rulează automat la fiecare push și pull request:

**Joburi Principale**:

1.  **build-test**: Job principal de validare
    - Instalare dependențe: `npm ci`
    - Verificare formatare: `npm run format:check`
    - Analiză statică: `npm run lint`
    - Teste unitare: `npm run test`
    - Audit securitate: `npm audit`
    - Generare artefact acoperire

2.  **accessibility**: Audit accesibilitate (neblocant)
    - Rulează `npm run audit:accessibility`
    - Generează raport accesibilitate WCAG 2.1 AA

3.  **test-esm**: Teste module ES6
    - Rulează `npm run test:esm` cu module Jest VM
    - Validează import/export ES6

4.  **lighthouse**: Audit performanță (neblocant)
    - Audit performanță mobilă
    - Generează artefacte raport Lighthouse
    - Metrici Core Web Vitals

**Insigne Calitate**:

- Status Build CI (GitHub Actions)
- Grad CodeFactor
- Insignă Codacy
- Poartă Calitate SonarCloud

### PWA (Progressive Web App)

LeapMultix este un PWA complet cu suport offline și capacitate de instalare.

**Service Worker** (`sw.js`):

- Navigare: Network-first cu fallback offline la `offline.html`
- Imagini: Cache-first pentru optimizarea performanței
- Traduceri: Stale-while-revalidate pentru actualizări în fundal
- JS/CSS: Network-first pentru a servi întotdeauna cea mai recentă versiune
- Gestionare automată a versiunilor via `cache-updater.js`

**Manifest** (`manifest.json`):

- Pictograme SVG și PNG pentru toate dispozitivele
- Instalare posibilă pe mobil (Adaugă la ecranul de pornire)
- Configurație standalone pentru experiență tip aplicație
- Suport pentru teme și culori

**Testare mod offline local**:

1.  Pornește serverul de dezvoltare:

    ```bash
    npm run serve
    ```

    Deschide `http://localhost:8080` (sau portul afișat)

2.  Testează manual:
    - Taie rețeaua în DevTools (fila Network → Offline)
    - Reîncarcă pagina → `offline.html` este afișat

3.  Test automat (necesită Puppeteer):
    ```bash
    npm run test:pwa-offline
    ```

**Scripturi Gestionare Service Worker**:

```bash
npm run sw:disable  # Dezactivează service worker
npm run sw:fix      # Corectează probleme cache
```

### Standarde de Calitate

**Instrumente Calitate Cod**:

- **ESLint**: Configurație modernă cu flat config (`eslint.config.js`), suport ES2022
- **Prettier**: Formatare automată cod (`.prettierrc`)
- **Stylelint**: Validare CSS (`.stylelintrc.json`)
- **JSDoc**: Documentare automată funcții cu analiză acoperire

**Reguli Cod Importante**:

- Elimină variabilele și parametrii neutilizați (`no-unused-vars`)
- Folosește gestionare erori specifică (fără catch-uri goale)
- Evită `innerHTML` în favoarea funcțiilor `security-utils.js`
- Menține complexitatea cognitivă < 15 pentru funcții
- Extrage funcțiile complexe în ajutoare mai mici

**Securitate**:

- **Protecție XSS**: Folosește funcții din `security-utils.js`:
  - `appendSanitizedHTML()` în loc de `innerHTML`
  - `createSafeElement()` pentru a crea elemente sigure
  - `setSafeMessage()` pentru conținut text
- **Scripturi Externe**: Atribut `crossorigin="anonymous"` obligatoriu
- **Validare Intrare**: Igienizează întotdeauna datele externe
- **Content Security Policy**: Antete CSP pentru a restricționa sursele scripturilor

**Accesibilitate**:

- Conformitate WCAG 2.1 AA
- Navigare completă prin tastatură
- Roluri ARIA și etichete adecvate
- Contrast culori conform

**Performanță**:

- Încărcare întârziată a modulelor via `lazy-loader.js`
- Optimizări CSS și active responsive
- Service Worker pentru caching inteligent
- Divizare cod și minificare în producție

## 📱 Compatibilitate

### Browsere Suportate

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispozitive

- **Desktop**: Controale tastatură și mouse
- **Tablete**: Interfață tactilă optimizată
- **Smartphone-uri**: Design responsive adaptiv

### Accesibilitate

- Navigare completă prin tastatură (Tab, Săgeți, Escape)
- Roluri ARIA și etichete pentru cititoare de ecran
- Contrast culori conform
- Suport tehnologie asistivă

## 🌍 Localizare

Suport multilingv complet:

- **Franceză** (limba implicită)
- **Engleză**
- **Spaniolă**

### Gestionare Traduceri

**Fișiere Traducere:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Start",
  "quiz_correct": "Bine lucrat!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripturi Gestionare i18n

**`npm run i18n:verify`** - Verifică consistența cheilor de traducere

**`npm run i18n:unused`** - Listează cheile de traducere neutilizate

**`npm run i18n:compare`** - Compară fișierele de traducere cu fr.json (referință)

Acest script (`scripts/compare-translations.cjs`) asigură sincronizarea tuturor fișierelor de limbă:

**Caracteristici:**

- Detectare chei lipsă (prezente în fr.json dar absente în alte limbi)
- Detectare chei suplimentare (prezente în alte limbi dar nu în fr.json)
- Identificare valori goale (`""`, `null`, `undefined`, `[]`)
- Verificare consistență tip (șir vs matrice)
- Aplatizare structuri JSON imbricate în notație cu punct (ex: `arcade.multiMemory.title`)
- Generare raport detaliat consolă
- Salvare raport JSON în `docs/translations-comparison-report.json`

**Exemplu Ieșire:**

```
🔍 Analiză comparativă a fișierelor de traducere

📚 Limbă referință: fr.json
✅ fr.json: 335 chei

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analiză en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total chei: 335
✅ Fără chei lipsă
✅ Fără chei suplimentare
✅ Fără valori goale

📊 REZUMAT FINAL
  fr.json: 335 chei
  en.json: 335 chei
  es.json: 335 chei

✅ Toate fișierele de traducere sunt perfect sincronizate!
```

**Acoperire Traduceri:**

- Interfață utilizator completă
- Instrucțiuni joc
- Mesaje eroare și feedback
- Descrieri și ajutor contextual
- Conținut narativ modul aventură
- Etichete accesibilitate și ARIA

## 📊 Stocarea Datelor

### Date Utilizator

- Profiluri și preferințe
- Progresie per mod de joc
- Scoruri și statistici jocuri arcade
- Setări personalizare

### Caracteristici Tehnice

- Stocare locală (localStorage) cu opțiuni de rezervă
- Izolare date per utilizator
- Salvare automată progres
- Migrare automată date vechi

## 🐛 Raportarea Problemelor

Problemele pot fi raportate prin GitHub issues. Vă rugăm să includeți:

- Descriere detaliată a problemei
- Pași pentru a reproduce
- Browser și versiune
- Capturi de ecran dacă sunt relevante

## 💝 Susține Proiectul

**[☕ Donează via PayPal](https://paypal.me/jls)**

## 📄 Licență

Acest proiect este licențiat sub licența AGPL v3. Vezi fișierul `LICENSE` pentru mai multe detalii.

---

_LeapMultix - Aplicație educațională modernă pentru învățarea tablei înmulțirii_

<details>
<summary>Acest document este disponibil și în alte limbi</summary>

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
- [Nederlands](./README.nl.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)

</details>

# LeapMultix

<!-- Insigne (actualizează <owner>/<repo> după migrarea GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![Licență: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Cuprins

- [Descriere](#descriere)
- [Funcționalități](#-funcționalități)
- [Pornire Rapidă](#-pornire-rapidă)
- [Arhitectură](#-arhitectură)
- [Moduri de Joc Detaliate](#-moduri-de-joc-detaliate)
- [Dezvoltare](#-dezvoltare)
- [Compatibilitate](#-compatibilitate)
- [Localizare](#-localizare)
- [Stocarea Datelor](#-stocarea-datelor)
- [Raportarea unei Probleme](#-raportarea-unei-probleme)
- [Licență](#-licență)

## Descriere

LeapMultix este o aplicație web educațională interactivă modernă, concepută pentru copii (8–12 ani) pentru a stăpâni cele 4 operații aritmetice: înmulțirea (×), adunarea (+), scăderea (−) și împărțirea (÷). Aplicația oferă **5 moduri de joc** și **4 minijocuri arcade** într-o interfață intuitivă, accesibilă și multilingvă.

**Suport pentru operații multiple:** Modurile Chestionar și Provocare permit exersarea tuturor operațiilor. Modurile Descoperire, Aventură și Arcade se concentrează pe înmulțire.

**Dezvoltat de:** Julien LS (contact@jls42.org)

**URL Online:** https://leapmultix.jls42.org/

## ✨ Funcționalități

### 🎮 Moduri de Joc

- **Modul Descoperire**: Explorare vizuală și interactivă a tablelor înmulțirii
- **Modul Chestionar** ⭐: Întrebări cu variante multiple cu suport pentru cele 4 operații (×, +, −, ÷) și progresie adaptivă
- **Modul Provocare** ⭐: Cursă contra cronometru cu cele 4 operații (×, +, −, ÷) și diferite niveluri de dificultate
- **Modul Aventură**: Progresie narativă prin niveluri cu hartă interactivă (înmulțire)

⭐ = Suport complet pentru cele 4 operații aritmetice

### 🕹️ Minijocuri Arcade

- **MultiInvaders**: Space Invaders educațional - Distruge răspunsurile greșite (înmulțire)
- **MultiMiam**: Pac-Man matematic - Colectează răspunsurile corecte (înmulțire)
- **MultiMemory**: Joc de memorie - Asociază înmulțirile cu rezultatele lor
- **MultiSnake**: Snake educațional - Crește mâncând numerele corecte (înmulțire)

### ➕ Suport pentru Operații Multiple

LeapMultix merge dincolo de simpla înmulțire oferind un antrenament complet pentru cele 4 operații aritmetice:

| Mod         | ×   | +   | −   | ÷   |
| ----------- | --- | --- | --- | --- |
| Chestionar  | ✅  | ✅  | ✅  | ✅  |
| Provocare   | ✅  | ✅  | ✅  | ✅  |
| Descoperire | ✅  | ❌  | ❌  | ❌  |
| Aventură    | ✅  | ❌  | ❌  | ❌  |
| Arcade      | ✅  | ❌  | ❌  | ❌  |

**Notă:** Suportul operațiilor pentru modurile Descoperire, Aventură și Arcade este planificat pentru o versiune viitoare.

### 🌍 Funcționalități Transversale

- **Multi-utilizator**: Gestionarea profilurilor individuale cu progres salvat
- **Multilingv**: Suport pentru franceză, engleză și spaniolă
- **Personalizare**: Avatare, teme de culoare, fundaluri
- **Accesibilitate**: Navigare prin tastatură, suport tactil, conformitate WCAG 2.1 AA
- **Mobile responsive**: Interfață optimizată pentru tablete și smartphone-uri
- **Sistem de progresie**: Scoruri, insigne, provocări zilnice

## 🚀 Pornire Rapidă

### Cerințe preliminare

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

### Scripturi disponibile

```bash
# Dezvoltare
npm run serve          # Server local (http://localhost:8080)
npm run lint           # Verificare cod cu ESLint
npm run lint:fix       # Corectare automată probleme ESLint
npm run format:check   # Verificare formatare cod (ÎNTOTDEAUNA înainte de commit)
npm run format         # Formatare cod cu Prettier
npm run verify         # Quality gate: lint + test + coverage

# Teste
npm run test           # Rulează toate testele (CJS)
npm run test:watch     # Teste în modul watch
npm run test:coverage  # Teste cu raport de acoperire
npm run test:core      # Teste doar pentru modulele de bază
npm run test:integration # Teste de integrare
npm run test:storage   # Teste sistem de stocare
npm run test:esm       # Teste ESM (dosar tests-esm/, Jest vm-modules)
npm run test:verbose   # Teste cu ieșire detaliată
npm run test:pwa-offline # Test offline PWA (necesită Puppeteer), după `npm run serve`

# Analiză și mentenanță
npm run analyze:jsdoc  # Analiză documentație
npm run improve:jsdoc  # Îmbunătățire automată JSDoc
npm run audit:mobile   # Teste responsivitate mobilă
npm run audit:accessibility # Teste accesibilitate
npm run dead-code      # Detectare cod neutilizat
npm run analyze:globals # Analiză variabile globale
npm run analyze:dependencies # Analiză utilizare dependențe
npm run verify:cleanup # Analiză combinată (cod mort + globale)

# Gestionare active
npm run assets:generate    # Generare imagini responsive
npm run assets:backgrounds # Convertire fundaluri în WebP
npm run assets:analyze     # Analiză active responsive
npm run assets:diff        # Comparare active

# Internaționalizare
npm run i18n:verify    # Verificare consistență chei traducere
npm run i18n:unused    # Listare chei traducere neutilizate
npm run i18n:compare   # Comparare traduceri (en/es) cu fr.json (referință)

# Construire & livrare
npm run build          # Build producție (Rollup) + postbuild (dist/ complet)
npm run serve:dist     # Servire dist/ la http://localhost:5000 (sau port disponibil)

# PWA și Service Worker
npm run sw:disable     # Dezactivare service worker
npm run sw:fix         # Corectare probleme service worker
```

## 🏗️ Arhitectură

### Structura fișierelor

```
leapmultix/
├── index.html              # Punct de intrare principal
├── js/
│   ├── core/               # Module de bază ES6
│   │   ├── GameMode.js     # Clasa de bază pentru moduri
│   │   ├── GameModeManager.js # Gestionarea modurilor de joc
│   │   ├── storage.js      # API LocalStorage
│   │   ├── audio.js        # Gestionare sunet
│   │   ├── utils.js        # Utilitare generice (sursă canonică)
│   │   ├── eventBus.js     # Comunicare prin evenimente
│   │   ├── userState.js    # Gestionare sesiune utilizator
│   │   ├── mainInit.js     # Inițializare DOM-ready
│   │   ├── theme.js        # Sistem de teme
│   │   ├── userUi.js       # Utilitare interfață utilizator
│   │   ├── parental.js     # Control parental
│   │   ├── adventure-data.js # Date mod aventură
│   │   ├── mult-stats.js   # Statistici înmulțire
│   │   ├── challenge-stats.js # Statistici provocare
│   │   └── daily-challenge.js # Gestionare provocări zilnice
│   ├── components/         # Componente UI reutilizabile
│   │   ├── topBar.js       # Bară de navigare
│   │   ├── infoBar.js      # Bare informații joc
│   │   ├── dashboard.js    # Tablou de bord utilizator
│   │   └── customization.js # Interfață personalizare
│   ├── modes/              # Moduri de joc
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Minijocuri arcade
│   │   ├── arcade.js       # Orchestrator principal arcade
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Joc de memorie (31 KB)
│   │   ├── arcade-multimiam.js # Integrare Multimiam
│   │   ├── arcade-multisnake.js # Integrare Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilitare partajate
│   │   ├── arcade-message.js, arcade-points.js # Componente UI
│   │   └── arcade-scores.js # Gestionare scoruri
│   ├── multimiam/          # Joc Pac-Man (arhitectură descompusă)
│   │   ├── multimiam.js    # Controler principal
│   │   ├── multimiam-engine.js # Motor de joc (15 KB)
│   │   ├── multimiam-renderer.js # Sistem de randare (9 KB)
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
│   │   ├── mode-orchestrator.js # Schimbare moduri
│   │   ├── lazy-loader.js  # Încărcare dinamică (10 KB)
│   │   └── game-cleanup.js # Curățare stare
│   ├── utils/              # Utilitare
│   │   ├── utils-es6.js    # Agregator principal (5 KB)
│   │   ├── main-helpers.js # Ajutoare aplicație
│   │   ├── helpers.js      # Funcții ajutătoare legacy
│   │   ├── stats-utils.js  # Utilitare statistici
│   │   ├── difficulty.js   # Gestionare dificultate
│   │   └── questionGenerator.js # Generare întrebări
│   ├── storage/            # Stocare și stare
│   │   ├── storage.js      # Wrapper stocare legacy
│   │   └── userManager.js  # Gestionare multi-utilizator (19 KB)
│   ├── i18n/               # Internaționalizare
│   │   ├── i18n.js         # Sistem i18n
│   │   └── i18n-store.js   # Stocare traduceri
│   ├── security/           # Securitate și gestionare erori
│   │   ├── security-utils.js # Protecție XSS, sanitizare
│   │   ├── error-handlers.js # Gestionare globală erori
│   │   └── logger.js       # Sistem jurnalizare
│   ├── accessibility/      # Accesibilitate
│   │   ├── accessibility.js # Funcționalități accesibilitate
│   │   └── speech.js       # Suport text-to-speech
│   ├── integration/        # Integrare și analiză
│   │   ├── plausible-init.js # Analiză Plausible
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
├── tests/                  # Teste automatizate
│   ├── __tests__/          # Teste unitare și de integrare
│   └── tests-esm/          # Teste ESM (.mjs)
├── scripts/                # Scripturi de mentenanță
│   ├── compare-translations.cjs # Comparare traduceri
│   └── cleanup-i18n-keys.cjs # Curățare chei i18n
└── dist/                   # Build producție (generat)
```

### Arhitectură tehnică

**Module ES6 Moderne**: Proiectul folosește o arhitectură modulară cu clase ES6 și importuri/exporturi native.

**Componente Reutilizabile**: Interfață construită cu componente UI centralizate (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Încărcare inteligentă a modulelor la cerere prin `lazy-loader.js` pentru a optimiza performanța inițială.

**Sistem de Stocare Unificat**: API centralizat pentru persistența datelor utilizatorului prin LocalStorage cu soluții de rezervă.

**Gestionare Audio Centralizată**: Controlul sunetului cu suport multilingv și preferințe per utilizator.

**Event Bus**: Comunicare decuplată bazată pe evenimente între componente pentru o arhitectură ușor de întreținut.

**Navigare prin Slide-uri**: Sistem de navigare bazat pe slide-uri numerotate (slide0, slide1 etc.) cu `goToSlide()`.

**Securitate**: Protecție XSS și sanitizare prin `security-utils.js` pentru toate manipulările DOM.

## 🎯 Moduri de Joc Detaliate

### Modul Descoperire

Interfață de explorare vizuală a tablelor înmulțirii cu:

- Vizualizare interactivă a înmulțirii
- Animații și mijloace mnemonice
- Drag-and-drop educațional
- Progresie liberă pe tablă

### Modul Chestionar

Întrebări cu variante multiple cu:

- 10 întrebări pe sesiune
- Progresie adaptivă în funcție de succes
- Tastatură numerică virtuală
- Sistem de serie (serie de răspunsuri corecte)

### Modul Provocare

Cursă contra cronometru cu:

- 3 niveluri de dificultate (Începător, Mediu, Dificil)
- Bonus de timp pentru răspunsuri corecte
- Sistem de vieți
- Clasament al celor mai bune scoruri

### Modul Aventură

Progresie narativă cu:

- 12 niveluri tematice deblocabile
- Hartă interactivă cu progresie vizuală
- Poveste imersivă cu personaje
- Sistem de stele și recompense

### Minijocuri Arcade

Fiecare minijoc oferă:

- Alegerea dificultății și personalizare
- Sistem de vieți și scor
- Controale tastatură și tactil
- Clasamente individuale per utilizator

## 🛠️ Dezvoltare

### Flux de lucru de dezvoltare

**IMPORTANT: Nu faceți niciodată commit direct pe main**

Proiectul folosește un flux de lucru bazat pe ramuri de funcționalități:

1. **Creează o ramură**:

   ```bash
   git checkout -b feat/numele-funcționalității
   # sau
   git checkout -b fix/numele-bug-ului
   ```

2. **Dezvoltă și testează**:

   ```bash
   npm run format:check  # Verifică ÎNTOTDEAUNA formatarea mai întâi
   npm run format        # Formatează dacă este necesar
   npm run lint          # Verifică calitatea codului
   npm run test          # Rulează testele
   npm run test:coverage # Verifică acoperirea
   ```

3. **Commit pe ramură**:

   ```bash
   git add .
   git commit -m "feat: descrierea funcționalității"
   ```

4. **Push și creare Pull Request**:
   ```bash
   git push -u origin feat/numele-funcționalității
   ```

**Stil commit**: Concis, mod imperativ (ex: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Asigură-te că `npm run lint`, `npm test` și `npm run test:coverage` trec înainte de fiecare commit

### Arhitectura componentelor

**GameMode (clasa de bază)**: Toate modurile moștenesc dintr-o clasă comună cu metode standardizate.

**GameModeManager**: Orchestrare centralizată a lansării și gestionării modurilor.

**Componente UI**: TopBar, InfoBar, Dashboard și Customization oferă o interfață consistentă.

**Lazy Loading**: Modulele sunt încărcate la cerere pentru a optimiza performanța inițială.

**Event Bus**: Comunicare decuplată între componente prin sistemul de evenimente.

### Teste

Proiectul include o suită completă de teste:

- Teste unitare ale modulelor de bază
- Teste de integrare ale componentelor
- Teste ale modurilor de joc
- Acoperire de cod automatizată

```bash
npm test              # Toate testele (CJS)
npm test:core         # Teste module centrale
npm test:integration  # Teste de integrare
npm test:coverage     # Raport de acoperire
npm run test:esm      # Teste ESM (ex: components/dashboard) via vm-modules
```

### Build de producție

- **Rollup**: Împachetează `js/main-es6.js` în ESM cu code-splitting și sourcemaps
- **Terser**: Minificare automată pentru optimizare
- **Post-build**: Copiază `css/` și `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, și rescrie `dist/index.html` către fișierul de intrare hash-uit (ex: `main-es6-*.js`)
- **Dosar final**: `dist/` gata de a fi servit static

```bash
npm run build      # generează dist/
npm run serve:dist # servește dist/ (port 5000)
```

### Integrare Continuă

**GitHub Actions**: Conductă automatizată în `.github/workflows/ci.yml`

Conducta CI/CD rulează automat la fiecare push și pull request:

**Joburi principale**:

1. **build-test**: Job principal de validare
   - Instalare dependențe: `npm ci`
   - Verificare formatare: `npm run format:check`
   - Analiză statică: `npm run lint`
   - Teste unitare: `npm run test`
   - Audit securitate: `npm audit`
   - Generare artefact acoperire

2. **accessibility**: Audit accesibilitate (neblocant)
   - Rulează `npm run audit:accessibility`
   - Generează raport accesibilitate WCAG 2.1 AA

3. **test-esm**: Teste module ES6
   - Rulează `npm run test:esm` cu Jest VM modules
   - Validează importuri/exporturi ES6

4. **lighthouse**: Audit performanță (neblocant)
   - Audit performanță mobilă
   - Generare artefacte raport Lighthouse
   - Metrice Core Web Vitals

**Insigne de calitate**:

- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix este o PWA completă cu suport offline și posibilitate de instalare.

**Service Worker** (`sw.js`):

- Navigare: Network-first cu fallback offline la `offline.html`
- Imagini: Cache-first pentru a optimiza performanța
- Traduceri: Stale-while-revalidate pentru actualizare în fundal
- JS/CSS: Network-first pentru a servi întotdeauna cea mai recentă versiune
- Gestionare automată versiune via `cache-updater.js`

**Manifest** (`manifest.json`):

- Pictograme SVG și PNG pentru toate dispozitivele
- Instalabil pe mobil (Adaugă la ecranul de pornire)
- Configurare standalone pentru experiență tip aplicație
- Suport teme și culori

**Testare mod offline local**:

1. Pornește serverul de dezvoltare:

   ```bash
   npm run serve
   ```

   Deschide `http://localhost:8080` (sau portul afișat)

2. Testare manuală:
   - Taie rețeaua în DevTools (Tab Network → Offline)
   - Reîncarcă pagina → se afișează `offline.html`

3. Testare automatizată (Necesită Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Scripturi gestionare Service Worker**:

```bash
npm run sw:disable  # Dezactivare service worker
npm run sw:fix      # Corectare probleme cache
```

### Standarde de calitate

**Instrumente calitate cod**:

- **ESLint**: Configurare modernă cu flat config (`eslint.config.js`), suport ES2022
- **Prettier**: Formatare automată cod (`.prettierrc`)
- **Stylelint**: Validare CSS (`.stylelintrc.json`)
- **JSDoc**: Documentare automată funcții cu analiză acoperire

**Reguli de cod importante**:

- Șterge variabilele și parametrii neutilizați (`no-unused-vars`)
- Folosește gestionare specifică a erorilor (fără catch-uri goale)
- Evită `innerHTML` în favoarea funcțiilor `security-utils.js`
- Menține complexitatea cognitivă sub 15 pentru funcții
- Extrage funcțiile complexe în ajutoare mai mici

**Securitate**:

- **Protecție XSS**: Folosește funcțiile din `security-utils.js`:
  - `appendSanitizedHTML()` în loc de `innerHTML`
  - `createSafeElement()` pentru creare elemente sigure
  - `setSafeMessage()` pentru conținut text
- **Scripturi externe**: Atribut `crossorigin="anonymous"` obligatoriu
- **Validare intrări**: Sanitizează întotdeauna datele externe
- **Content Security Policy**: Headere CSP pentru a restricționa sursele de scripturi

**Accesibilitate**:

- Conformitate WCAG 2.1 AA
- Navigare completă prin tastatură
- Roluri ARIA și etichete adecvate
- Contraste de culoare conforme

**Performanță**:

- Lazy loading module via `lazy-loader.js`
- Optimizări CSS și active responsive
- Service Worker pentru cache inteligent
- Code splitting și minificare în producție

## 📱 Compatibilitate

### Browsere suportate

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispozitive

- **Desktop**: Controale tastatură și mouse
- **Tablete**: Interfață tactilă optimizată
- **Smartphone-uri**: Design responsive adaptiv

### Accesibilitate

- Navigare completă prin tastatură (Tab, săgeți, Esc)
- Roluri ARIA și etichete pentru cititoare de ecran
- Contraste de culoare conforme
- Suport tehnologii de asistență

## 🌍 Localizare

Suport multilingv complet:

- **Franceză** (limba implicită)
- **Engleză**
- **Spaniolă**

### Gestionare traduceri

**Fișiere traducere:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Începe",
  "quiz_correct": "Bravo!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripturi gestionare i18n

**`npm run i18n:verify`** - Verificare consistență chei traducere

**`npm run i18n:unused`** - Listare chei traducere neutilizate

**`npm run i18n:compare`** - Comparare fișiere traducere cu fr.json (referință)

Acest script (`scripts/compare-translations.cjs`) asigură sincronizarea tuturor fișierelor de limbă:

**Funcționalități:**

- Detectarea cheilor lipsă (prezente în fr.json dar absente în alte limbi)
- Detectarea cheilor suplimentare (prezente în alte limbi dar nu în fr.json)
- Identificarea valorilor goale (`""`, `null`, `undefined`, `[]`)
- Verificarea consistenței tipurilor (string vs array)
- Aplatizarea structurilor JSON imbricate în notație cu punct (ex: `arcade.multiMemory.title`)
- Generarea unui raport detaliat în consolă
- Salvarea raportului JSON în `docs/translations-comparison-report.json`

**Exemplu de ieșire:**

```
🔍 Analiză comparativă a fișierelor de traducere

📚 Limbă de referință: fr.json
✅ fr.json: 335 chei

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analiză de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total chei: 335
✅ Nicio cheie lipsă
✅ Nicio cheie suplimentară
✅ Nicio valoare goală

📊 REZUMAT FINAL
  fr.json: 335 chei
  en.json: 335 chei
  es.json: 335 chei

✅ Toate fișierele de traducere sunt perfect sincronizate!
```

**Acoperire traduceri:**

- Interfață utilizator completă
- Instrucțiuni jocuri
- Mesaje de eroare și feedback
- Descrieri și ajutor contextual
- Conținut narativ mod Aventură
- Etichete accesibilitate și ARIA

## 📊 Stocarea Datelor

### Date utilizator

- Profiluri și preferințe
- Progres per mod de joc
- Scoruri și statistici jocuri arcade
- Setări personalizare

### Funcționalități tehnice

- Stocare locală (localStorage) cu soluții de rezervă
- Izolare date per utilizator
- Salvare automată progres
- Migrare automată date vechi

## 🐛 Raportarea unei Probleme

Problemele pot fi raportate prin intermediul GitHub issues. Vă rugăm să includeți:

- Descriere detaliată a problemei
- Pași pentru a reproduce
- Browser și versiune
- Capturi de ecran dacă sunt relevante

## 💝 Susține proiectul

**[☕ Donează via PayPal](https://paypal.me/jls)**

## 📄 Licență

Acest proiect este licențiat sub AGPL v3. Vezi fișierul `LICENSE` pentru mai multe detalii.

---

_LeapMultix - Aplicație educațională modernă pentru învățarea tablelor înmulțirii_

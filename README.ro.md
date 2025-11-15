<details>
<summary>Acest document este disponibil și în alte limbi</summary>

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

<!-- Insigne (actualizați <owner>/<repo> după migrarea pe GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Cuprins

- [Descriere](#descriere)
- [Caracteristici](#-caracteristici)
- [Pornire rapidă](#-pornire-rapidă)
- [Arhitectură](#-arhitectură)
- [Moduri de Joc Detaliate](#-moduri-de-joc-detaliate)
- [Dezvoltare](#-dezvoltare)
- [Compatibilitate](#-compatibilitate)
- [Localizare](#-localizare)
- [Stocarea datelor](#-stocarea-datelor)
- [Raportarea unei probleme](#-raportarea-unei-probleme)
- [Licență](#-licență)

## Descriere

LeapMultix este o aplicație web educațională interactivă modernă pentru copii (8-12 ani) pentru a stăpâni tablele înmulțirii. Aplicația oferă **4 moduri de joc clasice** și **4 mini-jocuri arcade** într-o interfață intuitivă, accesibilă și multilingvă.

**Dezvoltat de:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## ✨ Caracteristici

### 🎮 Moduri de Joc

- **Modul Descoperire**: Explorare vizuală și interactivă a tablelor înmulțirii
- **Modul Quiz**: Întrebări cu variante multiple de răspuns cu progres adaptiv
- **Modul Provocare**: Cursă contra cronometru cu diferite niveluri de dificultate
- **Modul Aventură**: Progres narativ pe niveluri cu o hartă interactivă

### 🕹️ Mini-jocuri Arcade

- **MultiInvaders**: Space Invaders educațional - Distruge răspunsurile greșite
- **MultiMiam**: Pac-Man matematic - Colectează răspunsurile corecte
- **MultiMemory**: Joc de memorie - Asociază înmulțirile cu rezultatele
- **MultiSnake**: Snake educațional - Crește mâncând numerele corecte

### 🌍 Caracteristici Transversale

- **Multi-utilizator**: Gestionarea profilurilor individuale cu progres salvat
- **Multilingv**: Suport pentru franceză, engleză și spaniolă
- **Personalizare**: Avatare, teme de culoare, fundaluri
- **Accesibilitate**: Navigare de la tastatură, suport tactil, conformitate WCAG 2.1 AA
- **Responsiv mobil**: Interfață optimizată pentru tablete și smartphone-uri
- **Sistem de progresie**: Scoruri, insigne, provocări zilnice

## 🚀 Pornire rapidă

### Cerințe preliminare

- Node.js (versiunea 16 sau o versiune ulterioară)
- Un browser web modern

### Instalare

```bash
# Clonează proiectul
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Instalează dependențele
npm install

# Lansează serverul de dezvoltare (opțiunea 1)
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
npm run lint           # Verificarea codului cu ESLint
npm run lint:fix       # Corectarea automată a problemelor ESLint
npm run format:check   # Verifică formatarea codului (ÎNTOTDEAUNA înainte de commit)
npm run format         # Formatează codul cu Prettier
npm run verify         # Poartă de calitate: lint + test + coverage

# Teste
npm run test           # Rulează toate testele (CJS)
npm run test:watch     # Teste în modul de urmărire
npm run test:coverage  # Teste cu raport de acoperire
npm run test:core      # Doar testele modulelor de bază
npm run test:integration # Teste de integrare
npm run test:storage   # Testele sistemului de stocare
npm run test:esm       # Teste ESM (dosare tests-esm/, Jest vm-modules)
npm run test:verbose   # Teste cu ieșire detaliată
npm run test:pwa-offline # Test PWA offline (necesită Puppeteer), după `npm run serve`

# Analiză și întreținere
npm run analyze:jsdoc  # Analiza documentației
npm run improve:jsdoc  # Îmbunătățirea automată a JSDoc
npm run audit:mobile   # Teste de responsivitate mobilă
npm run audit:accessibility # Teste de accesibilitate
npm run dead-code      # Detectarea codului neutilizat
npm run analyze:globals # Analiza variabilelor globale
npm run analyze:dependencies # Analiza utilizării dependențelor
npm run verify:cleanup # Analiză combinată (cod mort + globale)

# Gestionarea activelor
npm run assets:generate    # Generează imagini responsive
npm run assets:backgrounds # Convertește fundalurile în WebP
npm run assets:analyze     # Analiza activelor responsive
npm run assets:diff        # Comparația activelor

# Internaționalizare
npm run i18n:verify    # Verifică coerența cheilor de traducere
npm run i18n:unused    # Listează cheile de traducere neutilizate
npm run i18n:compare   # Compară traducerile (en/es) cu fr.json (referință)

# Build și livrare
npm run build          # Build de producție (Rollup) + postbuild (dist/ complet)
npm run serve:dist     # Servește dist/ pe http://localhost:5000 (sau portul disponibil)

# PWA și Service Worker
npm run sw:disable     # Dezactivează service worker-ul
npm run sw:fix         # Remediază problemele service worker-ului
```

## 🏗️ Arhitectură

### Structura fișierelor

```
leapmultix/
├── index.html              # Punct de intrare principal
├── js/
│   ├── core/               # Module centrale ES6
│   │   ├── GameMode.js     # Clasa de bază a modurilor
│   │   ├── GameModeManager.js # Gestionarea modurilor de joc
│   │   ├── storage.js      # API de stocare LocalStorage
│   │   ├── audio.js        # Gestionarea sunetului
│   │   ├── utils.js        # Utilitare generice (sursă canonică)
│   │   ├── eventBus.js     # Comunicare bazată pe evenimente
│   │   ├── userState.js    # Gestionarea sesiunii utilizatorului
│   │   ├── mainInit.js     # Inițializare DOM-ready
│   │   ├── theme.js        # Sistem de teme
│   │   ├── userUi.js       # Utilitare de interfață utilizator
│   │   ├── parental.js     # Controale parentale
│   │   ├── adventure-data.js # Datele modului Aventură
│   │   ├── mult-stats.js   # Statistici de înmulțire
│   │   ├── challenge-stats.js # Statistici de provocare
│   │   └── daily-challenge.js # Gestionarea provocărilor zilnice
│   ├── components/         # Componente UI reutilizabile
│   │   ├── topBar.js       # Bara de navigare
│   │   ├── infoBar.js      # Bare de informații ale jocurilor
│   │   ├── dashboard.js    # Panoul de bord al utilizatorului
│   │   └── customization.js # Interfața de personalizare
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
│   │   ├── arcade-multimiam.js # Integrare Multimiam
│   │   ├── arcade-multisnake.js # Integrare Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilitare partajate
│   │   ├── arcade-message.js, arcade-points.js # Componente UI
│   │   └── arcade-scores.js # Gestionarea scorurilor
│   ├── multimiam/          # Joc Pac-Man (arhitectură descompusă)
│   │   ├── multimiam.js    # Controler principal
│   │   ├── multimiam-engine.js # Motor de joc (15 KB)
│   │   ├── multimiam-renderer.js # Sistem de randare (9 KB)
│   │   ├── multimiam-controls.js # Gestionarea controalelor (7 KB)
│   │   ├── multimiam-questions.js # Generarea întrebărilor (6 KB)
│   │   └── multimiam-ui.js # Elemente de interfață
│   ├── multisnake.js       # Joc Snake (38 KB)
│   ├── navigation/         # Sistem de navigare
│   │   ├── slides.js       # Navigare prin diapozitive (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Suport pentru tastatură
│   ├── ui/                 # Interfață utilizator și feedback
│   │   ├── uiUtils.js      # Utilitare de interfață
│   │   ├── ui-feedback.js  # Mecanisme de feedback
│   │   ├── touch-support.js # Suport tactil (7 KB)
│   │   ├── virtual-keyboard.js # Tastatură virtuală
│   │   ├── coin-display.js, coin-effects.js # Sistem de monede
│   │   ├── notifications.js # Sistem de notificări
│   │   └── badges.js       # Sistem de insigne
│   ├── media/              # Gestionarea media
│   │   ├── VideoManager.js # Gestionarea redării video (12 KB)
│   │   └── responsive-image-loader.js # Încărcarea imaginilor (9 KB)
│   ├── orchestration/      # Orchestare și încărcare
│   │   ├── mode-orchestrator.js # Schimbarea modurilor
│   │   ├── lazy-loader.js  # Încărcare dinamică (10 KB)
│   │   └── game-cleanup.js # Curățarea stării
│   ├── utils/              # Utilitare
│   │   ├── utils-es6.js    # Agregator principal (5 KB)
│   │   ├── main-helpers.js # Ajutoare ale aplicației
│   │   ├── helpers.js      # Funcții ajutătoare vechi
│   │   ├── stats-utils.js  # Utilitare de statistici
│   │   ├── difficulty.js   # Gestionarea dificultății
│   │   └── questionGenerator.js # Generarea întrebărilor
│   ├── storage/            # Stocare și stare
│   │   ├── storage.js      # Wrapper de stocare vechi
│   │   └── userManager.js  # Gestionare multi-utilizator (19 KB)
│   ├── i18n/               # Internaționalizare
│   │   ├── i18n.js         # Sistem i18n
│   │   └── i18n-store.js   # Stocarea traducerilor
│   ├── security/           # Securitate și gestionarea erorilor
│   │   ├── security-utils.js # Protecție XSS, sanitizare
│   │   ├── error-handlers.js # Gestionarea globală a erorilor
│   │   └── logger.js       # Sistem de logging
│   ├── accessibility/      # Accesibilitate
│   │   ├── accessibility.js # Caracteristici de accesibilitate
│   │   └── speech.js       # Suport pentru sinteza vocală
│   ├── integration/        # Integrare și analiză
│   │   ├── plausible-init.js # Analiză Plausible
│   │   ├── cache-updater.js # Gestionarea cache-ului (10 KB)
│   │   └── imports.js      # Utilitare de import
│   ├── main-es6.js         # Punct de intrare ES6
│   ├── main.js             # Orchestrator principal
│   ├── bootstrap.js        # Configurația handler-elor de evenimente ES6
│   └── game.js             # Gestionarea stării și provocările zilnice
├── css/                    # Stiluri modulare
├── assets/                 # Resurse
│   ├── images/             # Imagini și sprite-uri
│   ├── generated-images/   # Imagini responsive generate
│   ├── sounds/             # Efecte sonore
│   ├── translations/       # Fișiere de traducere (fr, en, es)
│   └── videos/             # Videoclipuri tutorial
├── tests/                  # Teste automate
│   ├── __tests__/          # Teste unitare și de integrare
│   └── tests-esm/          # Teste ESM (.mjs)
├── scripts/                # Scripturi de întreținere
│   ├── compare-translations.cjs # Comparația traducerilor
│   └── cleanup-i18n-keys.cjs # Curățarea cheilor i18n
└── dist/                   # Build de producție (generat)
```

### Arhitectură tehnică

**Module ES6 moderne**: Proiectul utilizează o arhitectură modulară cu clase ES6 și importuri/exporturi native.

**Componente reutilizabile**: Interfață construită cu componente UI centralizate (TopBar, InfoBar, Dashboard, Customization).

**Încărcare leneșă (Lazy Loading)**: Încărcare inteligentă a modulelor la cerere prin `lazy-loader.js` pentru a optimiza performanța inițială.

**Sistem de stocare unificat**: API centralizat pentru persistența datelor utilizatorului prin LocalStorage cu fallback-uri.

**Gestionare audio centralizată**: Controlul sunetului cu suport multilingv și preferințe per utilizator.

**Bus de evenimente (Event Bus)**: Comunicare decuplată bazată pe evenimente între componente pentru o arhitectură mentenabilă.

**Navigare prin diapozitive**: Sistem de navigare bazat pe diapozitive numerotate (slide0, slide1, etc.) cu `goToSlide()`.

**Securitate**: Protecție XSS și sanitizare prin `security-utils.js` pentru toate manipulările DOM.

## 🎯 Moduri de Joc Detaliate

### Modul Descoperire

Interfață de explorare vizuală a tablelor înmulțirii cu:

- Vizualizare interactivă a înmulțirilor
- Animații și ajutoare de memorie
- Drag-and-drop educațional
- Progres liber pe tablă

### Modul Quiz

Întrebări cu variante multiple de răspuns cu:

- 10 întrebări pe sesiune
- Progres adaptiv în funcție de reușite
- Tastatură numerică virtuală
- Sistem de serie (serie de răspunsuri corecte)

### Modul Provocare

Cursă contra cronometru cu:

- 3 niveluri de dificultate (Începător, Mediu, Dificil)
- Bonus de timp pentru răspunsurile corecte
- Sistem de vieți
- Clasamentul celor mai bune scoruri

### Modul Aventură

Progres narativ cu:

- 12 niveluri tematice deblocabile
- Hartă interactivă cu progres vizual
- Poveste imersivă cu personaje
- Sistem de stele și recompense

### Mini-jocuri Arcade

Fiecare mini-joc oferă:

- Alegerea dificultății și personalizare
- Sistem de vieți și scor
- Controale de la tastatură și tactile
- Clasamente individuale per utilizator

## 🛠️ Dezvoltare

### Flux de lucru de dezvoltare

**IMPORTANT: Nu faceți niciodată commit direct pe main**

Proiectul utilizează un flux de lucru bazat pe ramuri de funcționalități:

1. **Creează o ramură**:
   ```bash
   git checkout -b feat/nume-funcționalitate
   # sau
   git checkout -b fix/nume-bug
   ```

2. **Dezvoltă și testează**:
   ```bash
   npm run format:check  # Verifică ÎNTOTDEAUNA formatarea mai întâi
   npm run format        # Formatează dacă este necesar
   npm run lint          # Verifică calitatea codului
   npm run test          # Rulează testele
   npm run test:coverage # Verifică acoperirea
   ```

3. **Fă commit pe ramură**:
   ```bash
   git add .
   git commit -m "feat: descrierea funcționalității"
   ```

4. **Fă push și creează un Pull Request**:
   ```bash
   git push -u origin feat/nume-funcționalitate
   ```

**Stilul commit-urilor**: Mesaje concise, în mod imperativ (ex: "Fix arcade init errors", "Refactor cache updater")

**Poartă de calitate**: Asigură-te că `npm run lint`, `npm run test` și `npm run test:coverage` trec înainte de fiecare commit

### Arhitectura componentelor

**GameMode (clasa de bază)**: Toate modurile moștenesc o clasă comună cu metode standardizate.

**GameModeManager**: Orchestare centralizată a lansării și gestionării modurilor.

**Componente UI**: TopBar, InfoBar, Dashboard și Customization oferă o interfață coerentă.

**Încărcare leneșă (Lazy Loading)**: Modulele sunt încărcate la cerere pentru a optimiza performanța inițială.

**Bus de evenimente (Event Bus)**: Comunicare decuplată între componente prin sistemul de evenimente.

### Teste

Proiectul include o suită completă de teste:

- Teste unitare ale modulelor de bază
- Teste de integrare ale componentelor
- Teste ale modurilor de joc
- Acoperire de cod automată

```bash
npm test              # Toate testele (CJS)
npm test:core         # Testele modulelor centrale
npm test:integration  # Teste de integrare
npm test:coverage     # Raport de acoperire
npm run test:esm      # Teste ESM (ex: components/dashboard) prin vm-modules
```

### Build de producție

- **Rollup**: Bundle `js/main-es6.js` în ESM cu code-splitting și sourcemaps
- **Terser**: Minificare automată pentru optimizare
- **Post-build**: Copiază `css/` și `assets/`, favicon-urile (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, și rescrie `dist/index.html` la fișierul de intrare cu hash (ex: `main-es6-*.js`)
- **Dosar final**: `dist/` gata de a fi servit static

```bash
npm run build      # generează dist/
npm run serve:dist # servește dist/ (port 5000)
```

### Integrare Continuă

**GitHub Actions**: Pipeline automatizat în `.github/workflows/ci.yml`

Pipeline-ul CI/CD se execută automat la fiecare push și pull request:

**Joburi principale**:

1. **build-test**: Job principal de validare
   - Instalarea dependențelor: `npm ci`
   - Verificarea formatării: `npm run format:check`
   - Analiză statică: `npm run lint`
   - Teste unitare: `npm run test`
   - Audit de securitate: `npm audit`
   - Generarea artefactului de acoperire

2. **accessibility**: Audit de accesibilitate (neblocant)
   - Execută `npm run audit:accessibility`
   - Generează un raport de accesibilitate WCAG 2.1 AA

3. **test-esm**: Teste ale modulelor ES6
   - Execută `npm run test:esm` cu modulele Jest VM
   - Validează importurile/exporturile ES6

4. **lighthouse**: Audit de performanță (neblocant)
   - Audit de performanță mobilă
   - Generarea artefactelor de raport Lighthouse
   - Metrici Core Web Vitals

**Insigne de calitate**:
- Starea build-ului CI (GitHub Actions)
- Grad CodeFactor
- Insignă Codacy
- Poartă de Calitate SonarCloud

### PWA (Progressive Web App)

LeapMultix este o PWA completă cu suport offline și posibilitate de instalare.

**Service Worker** (`sw.js`):
- Navigare: Network-first cu fallback offline la `offline.html`
- Imagini: Cache-first pentru a optimiza performanța
- Traduceri: Stale-while-revalidate pentru actualizare în fundal
- JS/CSS: Network-first pentru a servi întotdeauna cea mai recentă versiune
- Gestionare automată a versiunilor prin `cache-updater.js`

**Manifest** (`manifest.json`):
- Icoane SVG și PNG pentru toate dispozitivele
- Instalare posibilă pe mobil (Adaugă la ecranul de pornire)
- Configurație standalone pentru o experiență asemănătoare unei aplicații
- Suport pentru teme și culori

**Testarea modului offline local**:

1. Porniți serverul de dezvoltare:
   ```bash
   npm run serve
   ```
   Deschideți `http://localhost:8080` (sau portul afișat)

2. Testați manual:
   - Întrerupeți rețeaua în DevTools (fila Rețea → Offline)
   - Reîmprospătați pagina → se afișează `offline.html`

3. Test automatizat (necesită Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Scripturi de gestionare a Service Worker-ului**:
```bash
npm run sw:disable  # Dezactivează service worker-ul
npm run sw:fix      # Remediază problemele de cache
```

### Standarde de calitate

**Unelte de calitate a codului**:
- **ESLint**: Configurație modernă cu flat config (`eslint.config.js`), suport ES2022
- **Prettier**: Formatare automată a codului (`.prettierrc`)
- **Stylelint**: Validare CSS (`.stylelintrc.json`)
- **JSDoc**: Documentare automată a funcțiilor cu analiză de acoperire

**Reguli de cod importante**:
- Elimină variabilele și parametrii neutilizați (`no-unused-vars`)
- Utilizează o gestionare specifică a erorilor (fără blocuri catch goale)
- Evită `innerHTML` în favoarea funcțiilor `security-utils.js`
- Menține o complexitate cognitivă < 15 pentru funcții
- Extrage funcțiile complexe în ajutoare mai mici

**Securitate**:
- **Protecție XSS**: Utilizează funcțiile din `security-utils.js`:
  - `appendSanitizedHTML()` în loc de `innerHTML`
  - `createSafeElement()` pentru a crea elemente sigure
  - `setSafeMessage()` pentru conținutul text
- **Scripturi externe**: Atributul `crossorigin="anonymous"` este obligatoriu
- **Validarea intrărilor**: Sanitizați întotdeauna datele externe
- **Content Security Policy**: Antete CSP pentru a restricționa sursele de scripturi

**Accesibilitate**:
- Conformitate WCAG 2.1 AA
- Navigare completă de la tastatură
- Roluri și etichete ARIA corespunzătoare
- Contrast de culoare conform

**Performanță**:
- Încărcare leneșă a modulelor prin `lazy-loader.js`
- Optimizări CSS și active responsive
- Service Worker pentru caching inteligent
- Divizarea codului și minificare în producție

## 📱 Compatibilitate

### Browsere suportate

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispozitive

- **Desktop**: Controale de la tastatură și mouse
- **Tablete**: Interfață tactilă optimizată
- **Smartphone-uri**: Design responsiv adaptiv

### Accesibilitate

- Navigare completă de la tastatură (Tab, săgeți, Esc)
- Roluri și etichete ARIA pentru cititoarele de ecran
- Contrast de culoare conform
- Suport pentru tehnologiile de asistență

## 🌍 Localizare

Suport multilingv complet:

- **Franceză** (limba implicită)
- **Engleză**
- **Spaniolă**

### Gestionarea traducerilor

**Fișiere de traducere:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripturi de gestionare i18n

**`npm run i18n:verify`** - Verifică coerența cheilor de traducere

**`npm run i18n:unused`** - Listează cheile de traducere neutilizate

**`npm run i18n:compare`** - Compară fișierele de traducere cu fr.json (referință)

Acest script (`scripts/compare-translations.cjs`) asigură sincronizarea tuturor fișierelor de limbă:

**Caracteristici:**
- Detectarea cheilor lipsă (prezente în fr.json, dar absente în alte limbi)
- Detectarea cheilor suplimentare (prezente în alte limbi, dar nu în fr.json)
- Identificarea valorilor goale (`""`, `null`, `undefined`, `[]`)
- Verificarea coerenței tipurilor (string vs array)
- Aplatizarea structurilor JSON imbricate în notație cu puncte (ex: `arcade.multiMemory.title`)
- Generarea unui raport detaliat în consolă
- Salvarea raportului JSON în `docs/translations-comparison-report.json`

**Exemplu de ieșire:**

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

**Acoperirea traducerilor:**

- Interfață utilizator completă
- Instrucțiunile jocurilor
- Mesaje de eroare și de feedback
- Descrieri și ajutor contextual
- Conținut narativ al modului Aventură
- Etichete de accesibilitate și ARIA

## 📊 Stocarea datelor

### Datele utilizatorului

- Profiluri și preferințe
- Progres pe mod de joc
- Scoruri și statistici ale jocurilor arcade
- Setări de personalizare

### Caracteristici tehnice

- Stocare locală (localStorage) cu fallback-uri
- Izolarea datelor per utilizator
- Salvarea automată a progresului
- Migrarea automată a datelor vechi

## 🐛 Raportarea unei probleme

Problemele pot fi raportate prin intermediul problemelor GitHub. Vă rugăm să includeți:

- Descrierea detaliată a problemei
- Pașii pentru a o reproduce
- Browser și versiune
- Capturi de ecran, dacă este relevant

## 💝 Susțineți proiectul

**[☕ Donează prin PayPal](https://paypal.me/jls)**

## 📄 Licență

Acest proiect este licențiat sub licența AGPL v3. Consultați fișierul `LICENSE` pentru mai multe detalii.

---

_LeapMultix - Aplicație educațională modernă pentru învățarea tablelor înmulțirii_

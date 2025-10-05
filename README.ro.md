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

<!-- Insigne (actualizați <proprietar>/<repo> după migrarea pe GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Cuprins

- [Descriere](#descriere)
- [Caracteristici](#-caracteristici)
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

LeapMultix este o aplicație web educațională, interactivă și modernă, destinată copiilor (8-12 ani) pentru a stăpâni tablele înmulțirii. Aplicația oferă **4 moduri de joc clasice** și **4 mini-jocuri arcade** într-o interfață intuitivă, accesibilă și multilingvă.

**Dezvoltat de:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## ✨ Caracteristici

### 🎮 Moduri de Joc

- **Modul Descoperire**: Explorare vizuală și interactivă a tablelor înmulțirii.
- **Modul Quiz**: Întrebări cu variante multiple de răspuns, cu progresie adaptivă.
- **Modul Provocare**: O cursă contra cronometru cu diferite niveluri de dificultate.
- **Modul Aventură**: Progresie narativă prin niveluri, cu o hartă interactivă.

### 🕹️ Mini-jocuri Arcade

- **MultiInvaders**: Un Space Invaders educațional - Distruge răspunsurile greșite.
- **MultiMiam**: Un Pac-Man matematic - Colectează răspunsurile corecte.
- **MultiMemory**: Un joc de memorie - Asociază înmulțirile cu rezultatele lor.
- **MultiSnake**: Un Snake educațional - Crește mâncând numerele corecte.

### 🌍 Caracteristici Transversale

- **Multi-utilizator**: Gestionarea profilurilor individuale cu progres salvat.
- **Multilingv**: Suport pentru franceză, engleză și spaniolă.
- **Personalizare**: Avatare, teme de culoare, fundaluri.
- **Accesibilitate**: Navigare de la tastatură, suport tactil, conformitate WCAG 2.1 AA.
- **Responsiv mobil**: Interfață optimizată pentru tablete și smartphone-uri.
- **Sistem de Progresie**: Scoruri, insigne, provocări zilnice.

## 🚀 Pornire Rapidă

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
npm run serve          # Server local
npm run lint           # Verificarea codului
npm run test           # Rulează toate testele (CJS)
npm run test:coverage  # Teste cu acoperire
npm run test:esm       # Teste ESM (dosare tests-esm/, Jest vm-modules)
npm run test:pwa-offline # Test PWA offline (necesită Puppeteer), după `npm run serve`

# Analiză și întreținere
npm run analyze:jsdoc  # Analiza documentației
npm run improve:jsdoc  # Îmbunătățire automată JSDoc
npm run audit:mobile   # Teste de responsivitate mobilă
npm run audit:accessibility # Teste de accesibilitate
npm run dead-code      # Detectarea codului neutilizat
npm run analyze:globals # Analiza variabilelor globale
npm run analyze:dependencies # Analiza utilizării dependențelor
npm run assets:analyze # Analiza activelor responsive
npm run assets:diff    # Comparația activelor
npm run i18n:compare   # Comparați traducerile (en/es) cu fr.json (referință)

# Build & livrare
npm run build          # Build de producție (Rollup) + post-build (dist/ complet)
npm run serve:dist     # Servește dist/ pe http://localhost:5000 (sau portul disponibil)
```

## 🏗️ Arhitectură

### Structura Fișierelor

```
leapmultix/
├── index.html              # Punct de intrare principal
├── js/
│   ├── core/               # Module centrale ES6
│   │   ├── GameMode.js     # Clasa de bază pentru modurile de joc
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # API de stocare
│   │   ├── audio.js        # Gestionarea sunetului
│   │   └── utils.js        # Utilitare generice
│   ├── components/         # Componente UI reutilizabile
│   │   ├── topBar.js       # Bara de navigare
│   │   ├── infoBar.js      # Bare de informații ale jocului
│   │   ├── dashboard.js    # Panoul de bord al utilizatorului
│   │   └── customization.js # Interfața de personalizare
│   ├── modes/              # Moduri de joc refactorizate
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # Mini-jocuri arcade
│   ├── multimiam-*.js      # Modulele jocului Pac-Man
│   ├── multisnake.js       # Jocul Snake educațional
│   ├── main-es6.js         # Punct de intrare ES6
│   ├── main.js             # Orchestrator principal
│   ├── lazy-loader.js      # Încărcare la cerere
│   └── utils-es6.js        # Utilitare ES6
├── css/                    # Stiluri modulare
├── assets/                 # Resurse
│   ├── images/             # Imagini și sprite-uri
│   ├── sounds/             # Efecte sonore
│   ├── translations/       # Fișiere de traducere
│   └── videos/             # Videoclipuri tutoriale
└── tests/                  # Teste automate
```

### Arhitectură Tehnică

**Module ES6 Moderne**: Proiectul folosește o arhitectură modulară cu clase ES6 și importuri/exporturi native.

**Componente Reutilizabile**: Interfața este construită cu componente UI centralizate (TopBar, InfoBar, Dashboard).

**Lazy Loading**: Încărcare inteligentă a modulelor la cerere pentru a optimiza performanța.

**Sistem de Stocare Unificat**: API centralizat pentru persistența datelor utilizatorului.

**Gestionare Audio Centralizată**: Controlul sunetului cu suport multilingv și preferințe per utilizator.

## 🎯 Moduri de Joc Detaliate

### Modul Descoperire

Interfață de explorare vizuală a tablelor înmulțirii cu:

- Vizualizare interactivă a înmulțirilor
- Animații și ajutoare de memorie
- Drag-and-drop educațional
- Progresie liberă pe tablă

### Modul Quiz

Întrebări cu variante multiple de răspuns cu:

- 10 întrebări pe sesiune
- Progresie adaptivă în funcție de succes
- Tastatură numerică virtuală
- Sistem de serie (serie de răspunsuri corecte)

### Modul Provocare

O cursă contra cronometru cu:

- 3 niveluri de dificultate (Începător, Mediu, Dificil)
- Bonus de timp pentru răspunsuri corecte
- Sistem de vieți
- Clasament al celor mai mari scoruri

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
- Controale de la tastatură și tactile
- Clasamente individuale per utilizator

## 🛠️ Dezvoltare

### Arhitectura Componentelor

**GameMode (clasa de bază)**: Toate modurile moștenesc o clasă comună cu metode standardizate.

**GameModeManager**: Orchestrator centralizat pentru lansarea și gestionarea modurilor.

**Componente UI**: TopBar, InfoBar, Dashboard și Customization oferă o interfață coerentă.

**Lazy Loading**: Modulele sunt încărcate la cerere pentru a optimiza performanța inițială.

### Teste

Proiectul include o suită completă de teste:

- Teste unitare ale modulelor de bază
- Teste de integrare ale componentelor
- Teste ale modurilor de joc
- Acoperire automată a codului

```bash
npm test              # Toate testele (CJS)
npm test:core         # Testele modulelor de bază
npm test:integration  # Teste de integrare
npm test:coverage     # Raport de acoperire
npm run test:esm      # Teste ESM (ex: components/dashboard) prin vm-modules
```

### Build de Producție

- **Rollup**: Pachetează `js/main-es6.js` în ESM cu divizare de cod și hărți sursă.
- **Terser**: Minificare automată pentru optimizare.
- **Post-build**: Copiază `css/` și `assets/`, favicon-urile (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, și rescrie `dist/index.html` pentru a indica fișierul de intrare cu hash (ex: `main-es6-*.js`).
- **Dosar final**: `dist/` gata pentru a fi servit static.

```bash
npm run build      # generează dist/
npm run serve:dist # servește dist/ (port 5000)
```

### Integrare Continuă

**GitHub Actions**: `.github/workflows/ci.yml`

- **build-test**: `npm ci`, `lint`, `test`, `audit` + artefact de acoperire.
- **accessibility**: `npm run audit:accessibility` (non-blocant).
- **test-esm**: `npm run test:esm` cu module VM.
- **lighthouse**: Audit de performanță mobilă (non-blocant), rapoarte ca artefacte.

### PWA (offline și instalare)

- **Service Worker**: Strategie rețea-întâi cu fallback offline; imagini cu strategie cache-întâi; traduceri cu stale-while-revalidate; JS/CSS cu rețea-întâi.
- **Manifest**: Icoane SVG/PNG; instalare posibilă pe mobil.
- **Testare offline local**:
  1. Rulează `npm run serve` și deschide `http://localhost:8080` (sau portul afișat).
  2. Deconectează rețeaua și reîmprospătează pagina → se va afișa `offline.html`.
  3. Test automatizat (necesită Puppeteer): `npm run test:pwa-offline`.

### Standarde de Calitate

- **ESLint**: Validarea codului JavaScript.
- **Prettier**: Formatare automată.
- **JSDoc**: Documentare automată a funcțiilor.
- **Accesibilitate**: Conformitate WCAG 2.1 AA.
- **Performanță**: Lazy loading, optimizări CSS.

## 📱 Compatibilitate

### Browsere Suportate

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispozitive

- **Desktop**: Controale de la tastatură și mouse.
- **Tablete**: Interfață tactilă optimizată.
- **Smartphone-uri**: Design responsiv adaptiv.

### Accesibilitate

- Navigare completă de la tastatură (Tab, săgeți, Esc).
- Roluri ARIA și etichete pentru cititoarele de ecran.
- Contrast de culoare conform.
- Suport pentru tehnologii asistive.

## 🌍 Localizare

Suport multilingv complet:

- **Franceză** (limba implicită)
- **Engleză**
- **Spaniolă**

### Gestionarea Traducerilor

**Fișiere de traducere:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Începe",
  "quiz_correct": "Bravo!",
  "arcade_invasion_title": "MultiInvaders"
}
```

**Scripturi de gestionare:**

```bash
npm run i18n:verify  # Verifică cheile lipsă/inconsistente
npm run i18n:unused  # Listează cheile neutilizate
npm run i18n:compare   # Comparați traducerile (en/es) cu fr.json (referință)
```

**Acoperirea Traducerilor:**

- Interfață de utilizator completă
- Instrucțiunile jocurilor
- Mesaje de eroare și feedback
- Descrieri și ajutor contextual

## 📊 Stocarea Datelor

### Date Utilizator

- Profiluri și preferințe
- Progres pe mod de joc
- Scoruri și statistici ale jocurilor arcade
- Setări de personalizare

### Caracteristici Tehnice

- Stocare locală (localStorage) cu fallback-uri.
- Izolarea datelor per utilizator.
- Salvare automată a progresului.
- Migrare automată a datelor vechi.

## 🐛 Raportarea unei Probleme

Problemele pot fi raportate prin intermediul problemelor GitHub. Vă rugăm să includeți:

- Descrierea detaliată a problemei.
- Pașii pentru a o reproduce.
- Browser și versiune.
- Capturi de ecran, dacă este relevant.

## 💝 Susține Proiectul

**[☕ Donează prin PayPal](https://paypal.me/jls)**

## 📄 Licență

Acest proiect este licențiat sub Licența AGPL v3. Consultați fișierul `LICENSE` pentru mai multe detalii.

---

_LeapMultix - O aplicație educațională modernă pentru învățarea tablelor înmulțirii._

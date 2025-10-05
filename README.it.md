<details>
<summary>Questo documento è disponibile anche in altre lingue</summary>

- [Français](./README.md)
- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Deutsch](./README.de.md)
- [中文](./README.zh.md)
- [हिन्दी](./README.hi.md)
- [العربية](./README.ar.md)
- [Svenska](./README.sv.md)
- [Polski](./README.pl.md)
- [Nederlands](./README.nl.md)
- [Română](./README.ro.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)

</details>

# LeapMultix

<!-- Badge (aggiornare <owner>/<repo> dopo la migrazione a GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Indice

- [Descrizione](#descrizione)
- [Funzionalità](#-funzionalità)
- [Avvio Rapido](#-avvio-rapido)
- [Architettura](#-architettura)
- [Modalità di Gioco Dettagliate](#-modalità-di-gioco-dettagliate)
- [Sviluppo](#-sviluppo)
- [Compatibilità](#-compatibilità)
- [Localizzazione](#-localizzazione)
- [Archiviazione dei Dati](#-archiviazione-dei-dati)
- [Segnalare un Problema](#-segnalare-un-problema)
- [Licenza](#-licenza)

## Descrizione

LeapMultix è un'applicazione web educativa, interattiva e moderna, progettata per aiutare i bambini (8-12 anni) a padroneggiare le tabelline. L'applicazione offre **4 modalità di gioco classiche** e **4 mini-giochi arcade** in un'interfaccia intuitiva, accessibile e multilingue.

**Sviluppato da:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## ✨ Funzionalità

### 🎮 Modalità di Gioco

- **Modalità Scoperta**: Esplorazione visiva e interattiva delle tabelline.
- **Modalità Quiz**: Domande a scelta multipla con progressione adattiva.
- **Modalità Sfida**: Una corsa contro il tempo con diversi livelli di difficoltà.
- **Modalità Avventura**: Progressione narrativa attraverso i livelli con una mappa interattiva.

### 🕹️ Mini-giochi Arcade

- **MultiInvaders**: Un Space Invaders educativo - Distruggi le risposte sbagliate.
- **MultiMiam**: Un Pac-Man matematico - Raccogli le risposte corrette.
- **MultiMemory**: Un gioco di memoria - Abbina le moltiplicazioni ai loro risultati.
- **MultiSnake**: Un Snake educativo - Cresci mangiando i numeri corretti.

### 🌍 Funzionalità Trasversali

- **Multi-utente**: Gestione di profili individuali con salvataggio dei progressi.
- **Multilingue**: Supporto per francese, inglese e spagnolo.
- **Personalizzazione**: Avatar, temi di colore, sfondi.
- **Accessibilità**: Navigazione da tastiera, supporto touch, conformità WCAG 2.1 AA.
- **Responsive mobile**: Interfaccia ottimizzata per tablet e smartphone.
- **Sistema di Progressione**: Punteggi, badge, sfide giornaliere.

## 🚀 Avvio Rapido

### Prerequisiti

- Node.js (versione 16 o successiva)
- Un browser web moderno

### Installazione

```bash
# Clonare il progetto
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Installare le dipendenze
npm install

# Avviare il server di sviluppo (opzione 1)
npm run serve
# L'applicazione sarà accessibile su http://localhost:8080 (o la porta successiva disponibile)

# O con Python (opzione 2)
python3 -m http.server 8000
# L'applicazione sarà accessibile su http://localhost:8000
```

### Script Disponibili

```bash
# Sviluppo
npm run serve          # Server locale
npm run lint           # Controllo del codice
npm run test           # Esegui tutti i test (CJS)
npm run test:coverage  # Test con copertura
npm run test:esm       # Test ESM (cartelle tests-esm/, Jest vm-modules)
npm run test:pwa-offline # Test PWA offline (richiede Puppeteer), dopo `npm run serve`

# Analisi e manutenzione
npm run analyze:jsdoc  # Analisi della documentazione
npm run improve:jsdoc  # Miglioramento automatico JSDoc
npm run audit:mobile   # Test di reattività mobile
npm run audit:accessibility # Test di accessibilità
npm run dead-code      # Rilevamento di codice non utilizzato
npm run analyze:globals # Analisi delle variabili globali
npm run analyze:dependencies # Analisi dell'uso delle dipendenze
npm run assets:analyze # Analisi degli asset responsive
npm run assets:diff    # Confronto degli asset
npm run i18n:compare   # Confronta le traduzioni (en/es) con fr.json (riferimento)

# Build e distribuzione
npm run build          # Build di produzione (Rollup) + post-build (dist/ completa)
npm run serve:dist     # Servi dist/ su http://localhost:5000 (o porta disponibile)
```

## 🏗️ Architettura

### Struttura dei File

```
leapmultix/
├── index.html              # Punto di ingresso principale
├── js/
│   ├── core/               # Moduli centrali ES6
│   │   ├── GameMode.js     # Classe base per le modalità di gioco
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # API di archiviazione
│   │   ├── audio.js        # Gestione del suono
│   │   └── utils.js        # Utilità generiche
│   ├── components/         # Componenti UI riutilizzabili
│   │   ├── topBar.js       # Barra di navigazione
│   │   ├── infoBar.js      # Barre informative del gioco
│   │   ├── dashboard.js    # Dashboard dell'utente
│   │   └── customization.js # Interfaccia di personalizzazione
│   ├── modes/              # Modalità di gioco rifattorizzate
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # Mini-giochi arcade
│   ├── multimiam-*.js      # Moduli del gioco Pac-Man
│   ├── multisnake.js       # Gioco Snake educativo
│   ├── main-es6.js         # Punto di ingresso ES6
│   ├── main.js             # Orchestratore principale
│   ├── lazy-loader.js      # Caricamento su richiesta
│   └── utils-es6.js        # Utilità ES6
├── css/                    # Stili modulari
├── assets/                 # Risorse
│   ├── images/             # Immagini e sprite
│   ├── sounds/             # Effetti sonori
│   ├── translations/       # File di traduzione
│   └── videos/             # Video tutorial
└── tests/                  # Test automatizzati
```

### Architettura Tecnica

**Moduli ES6 Moderni**: Il progetto utilizza un'architettura modulare con classi ES6 e import/export nativi.

**Componenti Riutilizzabili**: L'interfaccia è costruita con componenti UI centralizzati (TopBar, InfoBar, Dashboard).

**Lazy Loading**: Caricamento intelligente dei moduli su richiesta per ottimizzare le prestazioni.

**Sistema di Archiviazione Unificato**: API centralizzata per la persistenza dei dati utente.

**Gestione Audio Centralizzata**: Controllo del suono con supporto multilingue e preferenze per utente.

## 🎯 Modalità di Gioco Dettagliate

### Modalità Scoperta

Interfaccia di esplorazione visiva delle tabelline con:

- Visualizzazione interattiva delle moltiplicazioni
- Animazioni e aiuti mnemonici
- Drag-and-drop educativo
- Progressione libera per tabellina

### Modalità Quiz

Domande a scelta multipla con:

- 10 domande per sessione
- Progressione adattiva in base al successo
- Tastierino numerico virtuale
- Sistema di serie (serie di risposte corrette)

### Modalità Sfida

Una corsa contro il tempo con:

- 3 livelli di difficoltà (Principiante, Medio, Difficile)
- Bonus di tempo per le risposte corrette
- Sistema di vite
- Classifica dei punteggi più alti

### Modalità Avventura

Progressione narrativa con:

- 12 livelli a tema sbloccabili
- Mappa interattiva con progressione visiva
- Storia coinvolgente con personaggi
- Sistema di stelle e ricompense

### Mini-giochi Arcade

Ogni mini-gioco offre:

- Scelta della difficoltà e personalizzazione
- Sistema di vite e punteggio
- Controlli da tastiera e touch
- Classifiche individuali per utente

## 🛠️ Sviluppo

### Architettura dei Componenti

**GameMode (classe base)**: Tutte le modalità ereditano da una classe comune con metodi standardizzati.

**GameModeManager**: Orchestrazione centralizzata per l'avvio e la gestione delle modalità.

**Componenti UI**: TopBar, InfoBar, Dashboard e Customization forniscono un'interfaccia coerente.

**Lazy Loading**: I moduli vengono caricati su richiesta per ottimizzare le prestazioni iniziali.

### Test

Il progetto include una suite di test completa:

- Test unitari dei moduli principali
- Test di integrazione dei componenti
- Test delle modalità di gioco
- Copertura del codice automatizzata

```bash
npm test              # Tutti i test (CJS)
npm test:core         # Test dei moduli principali
npm test:integration  # Test di integrazione
npm test:coverage     # Report di copertura
npm run test:esm      # Test ESM (es. components/dashboard) tramite vm-modules
```

### Build di Produzione

- **Rollup**: Raggruppa `js/main-es6.js` in ESM con code-splitting e sourcemap.
- **Terser**: Minificazione automatica per l'ottimizzazione.
- **Post-build**: Copia `css/` e `assets/`, le favicon (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e riscrive `dist/index.html` per puntare al file di ingresso hash (es. `main-es6-*.js`).
- **Cartella finale**: `dist/` pronta per essere servita staticamente.

```bash
npm run build      # genera dist/
npm run serve:dist # serve dist/ (porta 5000)
```

### Integrazione Continua

**GitHub Actions**: `.github/workflows/ci.yml`

- **build-test**: `npm ci`, `lint`, `test`, `audit` + artefatto di copertura.
- **accessibility**: `npm run audit:accessibility` (non bloccante).
- **test-esm**: `npm run test:esm` con moduli VM.
- **lighthouse**: Audit delle prestazioni mobile (non bloccante), report come artefatti.

### PWA (offline e installazione)

- **Service Worker**: Strategia network-first con fallback offline; immagini con strategia cache-first; traduzioni con stale-while-revalidate; JS/CSS con network-first.
- **Manifest**: Icone SVG/PNG; installazione possibile su mobile.
- **Testare offline localmente**:
  1. Eseguire `npm run serve` e aprire `http://localhost:8080` (o la porta visualizzata).
  2. Disconnettere la rete e aggiornare la pagina → verrà visualizzato `offline.html`.
  3. Test automatizzato (richiede Puppeteer): `npm run test:pwa-offline`.

### Standard di Qualità

- **ESLint**: Validazione del codice JavaScript.
- **Prettier**: Formattazione automatica.
- **JSDoc**: Documentazione automatica delle funzioni.
- **Accessibilità**: Conformità WCAG 2.1 AA.
- **Prestazioni**: Lazy loading, ottimizzazioni CSS.

## 📱 Compatibilità

### Browser Supportati

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivi

- **Desktop**: Controlli da tastiera e mouse.
- **Tablet**: Interfaccia touch ottimizzata.
- **Smartphone**: Design responsive adattivo.

### Accessibilità

- Navigazione completa da tastiera (Tab, frecce, Esc).
- Ruoli ARIA ed etichette per screen reader.
- Contrasti di colore conformi.
- Supporto per tecnologie assistive.

## 🌍 Localizzazione

Supporto multilingue completo:

- **Francese** (lingua predefinita)
- **Inglese**
- **Spagnolo**

### Gestione delle Traduzioni

**File di traduzione:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Inizia",
  "quiz_correct": "Bravo!",
  "arcade_invasion_title": "MultiInvaders"
}
```

**Script di gestione:**

```bash
npm run i18n:verify  # Verifica chiavi mancanti/incoerenti
npm run i18n:unused  # Elenca chiavi non utilizzate
npm run i18n:compare   # Confronta le traduzioni (en/es) con fr.json (riferimento)
```

**Copertura delle Traduzioni:**

- Interfaccia utente completa
- Istruzioni di gioco
- Messaggi di errore e feedback
- Descrizioni e aiuto contestuale

## 📊 Archiviazione dei Dati

### Dati Utente

- Profili e preferenze
- Progressi per modalità di gioco
- Punteggi e statistiche dei giochi arcade
- Impostazioni di personalizzazione

### Funzionalità Tecniche

- Archiviazione locale (localStorage) con fallback.
- Isolamento dei dati per utente.
- Salvataggio automatico dei progressi.
- Migrazione automatica dei dati vecchi.

## 🐛 Segnalare un Problema

I problemi possono essere segnalati tramite le issue di GitHub. Si prega di includere:

- Descrizione dettagliata del problema.
- Passi per riprodurlo.
- Browser e versione.
- Screenshot se pertinenti.

## 💝 Sostenere il Progetto

**[☕ Fai una donazione tramite PayPal](https://paypal.me/jls)**

## 📄 Licenza

Questo progetto è concesso in licenza con la Licenza AGPL v3. Vedere il file `LICENSE` per maggiori dettagli.

---

_LeapMultix - Un'applicazione educativa moderna per imparare le tabelline._

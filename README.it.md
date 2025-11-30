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

<!-- Badge (aggiornare <owner>/<repo> dopo la migrazione su GitHub) -->

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
- [Archiviazione Dati](#-archiviazione-dati)
- [Segnalare un Problema](#-segnalare-un-problema)
- [Licenza](#-licenza)

## Descrizione

LeapMultix è una moderna applicazione web educativa interattiva progettata per i bambini (8–12 anni) per padroneggiare le 4 operazioni aritmetiche: moltiplicazione (×), addizione (+), sottrazione (−) e divisione (÷). L'app offre **5 modalità di gioco** e **4 minigiochi arcade** in un'interfaccia intuitiva, accessibile e multilingue.

**Supporto multi-operazione:** Le modalità Quiz e Sfida permettono di esercitarsi con tutte le operazioni. Le modalità Scoperta, Avventura e Arcade si concentrano sulla moltiplicazione.

**Sviluppato da:** Julien LS (contact@jls42.org)

**URL Online:** https://leapmultix.jls42.org/

## ✨ Funzionalità

### 🎮 Modalità di Gioco

- **Modalità Scoperta**: Esplorazione visiva e interattiva delle tabelline
- **Modalità Quiz** ⭐: Domande a scelta multipla con supporto per le 4 operazioni (×, +, −, ÷) e progressione adattiva
- **Modalità Sfida** ⭐: Corsa contro il tempo con le 4 operazioni (×, +, −, ÷) e diversi livelli di difficoltà
- **Modalità Avventura**: Progressione narrativa attraverso livelli con mappa interattiva (moltiplicazione)

⭐ = Supporto completo per le 4 operazioni aritmetiche

### 🕹️ Minigiochi Arcade

- **MultiInvaders**: Space Invaders educativo - Distruggi le risposte sbagliate (moltiplicazione)
- **MultiMiam**: Pac-Man matematico - Raccogli le risposte corrette (moltiplicazione)
- **MultiMemory**: Gioco di memoria - Abbina le moltiplicazioni ai loro risultati
- **MultiSnake**: Snake educativo - Cresci mangiando i numeri corretti (moltiplicazione)

### ➕ Supporto Multi-Operazione

LeapMultix va oltre la semplice moltiplicazione offrendo un allenamento completo per le 4 operazioni aritmetiche:

| Modalità  | ×   | +   | −   | ÷   |
| --------- | --- | --- | --- | --- |
| Quiz      | ✅  | ✅  | ✅  | ✅  |
| Sfida     | ✅  | ✅  | ✅  | ✅  |
| Scoperta  | ✅  | ❌  | ❌  | ❌  |
| Avventura | ✅  | ❌  | ❌  | ❌  |
| Arcade    | ✅  | ❌  | ❌  | ❌  |

**Nota:** Il supporto delle operazioni per le modalità Scoperta, Avventura e Arcade è previsto in una versione futura.

### 🌍 Funzionalità Trasversali

- **Multi-utente**: Gestione di profili individuali con progressi salvati
- **Multilingue**: Supporto per francese, inglese e spagnolo
- **Personalizzazione**: Avatar, temi di colore, sfondi
- **Accessibilità**: Navigazione da tastiera, supporto touch, conformità WCAG 2.1 AA
- **Mobile responsive**: Interfaccia ottimizzata per tablet e smartphone
- **Sistema di progressione**: Punteggi, badge, sfide giornaliere

## 🚀 Avvio Rapido

### Prerequisiti

- Node.js (versione 16 o superiore)
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
# L'applicazione sarà accessibile su http://localhost:8080 (o successiva porta disponibile)

# O con Python (opzione 2)
python3 -m http.server 8000
# L'applicazione sarà accessibile su http://localhost:8000
```

### Script disponibili

```bash
# Sviluppo
npm run serve          # Server locale (http://localhost:8080)
npm run lint           # Verifica del codice con ESLint
npm run lint:fix       # Correzione automatica dei problemi ESLint
npm run format:check   # Verifica formattazione del codice (SEMPRE prima del commit)
npm run format         # Formatta il codice con Prettier
npm run verify         # Quality gate: lint + test + coverage

# Test
npm run test           # Esegui tutti i test (CJS)
npm run test:watch     # Test in modalità watch
npm run test:coverage  # Test con report di copertura
npm run test:core      # Test solo dei moduli core
npm run test:integration # Test di integrazione
npm run test:storage   # Test del sistema di archiviazione
npm run test:esm       # Test ESM (cartella tests-esm/, Jest vm-modules)
npm run test:verbose   # Test con output dettagliato
npm run test:pwa-offline # Test offline PWA (richiede Puppeteer), dopo `npm run serve`

# Analisi e manutenzione
npm run analyze:jsdoc  # Analisi della documentazione
npm run improve:jsdoc  # Miglioramento automatico JSDoc
npm run audit:mobile   # Test di reattività mobile
npm run audit:accessibility # Test di accessibilità
npm run dead-code      # Rilevamento codice non utilizzato
npm run analyze:globals # Analisi variabili globali
npm run analyze:dependencies # Analisi utilizzo dipendenze
npm run verify:cleanup # Analisi combinata (codice morto + globali)

# Gestione asset
npm run assets:generate    # Genera immagini responsive
npm run assets:backgrounds # Converti sfondi in WebP
npm run assets:analyze     # Analisi asset responsive
npm run assets:diff        # Confronto asset

# Internazionalizzazione
npm run i18n:verify    # Verifica coerenza chiavi di traduzione
npm run i18n:unused    # Elenca chiavi di traduzione non utilizzate
npm run i18n:compare   # Confronta traduzioni (en/es) con fr.json (riferimento)

# Build & consegna
npm run build          # Build di produzione (Rollup) + postbuild (dist/ completo)
npm run serve:dist     # Servi dist/ su http://localhost:5000 (o porta disponibile)

# PWA e Service Worker
npm run sw:disable     # Disabilita service worker
npm run sw:fix         # Correggi problemi service worker
```

## 🏗️ Architettura

### Struttura dei file

```
leapmultix/
├── index.html              # Punto di ingresso principale
├── js/
│   ├── core/               # Moduli core ES6
│   │   ├── GameMode.js     # Classe base per le modalità
│   │   ├── GameModeManager.js # Gestione modalità di gioco
│   │   ├── storage.js      # API LocalStorage
│   │   ├── audio.js        # Gestione audio
│   │   ├── utils.js        # Utilità generiche (fonte canonica)
│   │   ├── eventBus.js     # Comunicazione tramite eventi
│   │   ├── userState.js    # Gestione sessione utente
│   │   ├── mainInit.js     # Inizializzazione DOM-ready
│   │   ├── theme.js        # Sistema di temi
│   │   ├── userUi.js       # Utilità interfaccia utente
│   │   ├── parental.js     # Controlli parentali
│   │   ├── adventure-data.js # Dati modalità avventura
│   │   ├── mult-stats.js   # Statistiche moltiplicazione
│   │   ├── challenge-stats.js # Statistiche sfida
│   │   └── daily-challenge.js # Gestione sfide giornaliere
│   ├── components/         # Componenti UI riutilizzabili
│   │   ├── topBar.js       # Barra di navigazione
│   │   ├── infoBar.js      # Barre informazioni gioco
│   │   ├── dashboard.js    # Dashboard utente
│   │   └── customization.js # Interfaccia personalizzazione
│   ├── modes/              # Modalità di gioco
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Minigiochi arcade
│   │   ├── arcade.js       # Orchestratore arcade principale
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Gioco di memoria (31 KB)
│   │   ├── arcade-multimiam.js # Integrazione Multimiam
│   │   ├── arcade-multisnake.js # Integrazione Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilità condivise
│   │   ├── arcade-message.js, arcade-points.js # Componenti UI
│   │   └── arcade-scores.js # Gestione punteggi
│   ├── multimiam/          # Gioco Pac-Man (architettura scomposta)
│   │   ├── multimiam.js    # Controller principale
│   │   ├── multimiam-engine.js # Motore di gioco (15 KB)
│   │   ├── multimiam-renderer.js # Sistema di rendering (9 KB)
│   │   ├── multimiam-controls.js # Gestione controlli (7 KB)
│   │   ├── multimiam-questions.js # Generazione domande (6 KB)
│   │   └── multimiam-ui.js # Elementi interfaccia
│   ├── multisnake.js       # Gioco Snake (38 KB)
│   ├── navigation/         # Sistema di navigazione
│   │   ├── slides.js       # Navigazione a slide (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Supporto tastiera
│   ├── ui/                 # Interfaccia utente e feedback
│   │   ├── uiUtils.js      # Utilità interfaccia
│   │   ├── ui-feedback.js  # Meccanismi di feedback
│   │   ├── touch-support.js # Supporto touch (7 KB)
│   │   ├── virtual-keyboard.js # Tastiera virtuale
│   │   ├── coin-display.js, coin-effects.js # Sistema valuta
│   │   ├── notifications.js # Sistema notifiche
│   │   └── badges.js       # Sistema badge
│   ├── media/              # Gestione media
│   │   ├── VideoManager.js # Gestione riproduzione video (12 KB)
│   │   └── responsive-image-loader.js # Caricamento immagini (9 KB)
│   ├── orchestration/      # Orchestrazione e caricamento
│   │   ├── mode-orchestrator.js # Cambio modalità
│   │   ├── lazy-loader.js  # Caricamento dinamico (10 KB)
│   │   └── game-cleanup.js # Pulizia stato
│   ├── utils/              # Utilità
│   │   ├── utils-es6.js    # Aggregatore principale (5 KB)
│   │   ├── main-helpers.js # Helper applicazione
│   │   ├── helpers.js      # Funzioni helper legacy
│   │   ├── stats-utils.js  # Utilità statistiche
│   │   ├── difficulty.js   # Gestione difficoltà
│   │   └── questionGenerator.js # Generazione domande
│   ├── storage/            # Archiviazione e stato
│   │   ├── storage.js      # Wrapper archiviazione legacy
│   │   └── userManager.js  # Gestione multi-utente (19 KB)
│   ├── i18n/               # Internazionalizzazione
│   │   ├── i18n.js         # Sistema i18n
│   │   └── i18n-store.js   # Archiviazione traduzioni
│   ├── security/           # Sicurezza e gestione errori
│   │   ├── security-utils.js # Protezione XSS, sanificazione
│   │   ├── error-handlers.js # Gestione errori globale
│   │   └── logger.js       # Sistema di logging
│   ├── accessibility/      # Accessibilità
│   │   ├── accessibility.js # Funzionalità accessibilità
│   │   └── speech.js       # Supporto sintesi vocale
│   ├── integration/        # Integrazione e analytics
│   │   ├── plausible-init.js # Analytics Plausible
│   │   ├── cache-updater.js # Gestione cache (10 KB)
│   │   └── imports.js      # Utilità importazione
│   ├── main-es6.js         # Punto di ingresso ES6
│   ├── main.js             # Orchestratore principale
│   ├── bootstrap.js        # Configurazione event handler ES6
│   └── game.js             # Gestione stato e sfide giornaliere
├── css/                    # Stili modulari
├── assets/                 # Risorse
│   ├── images/             # Immagini e sprite
│   ├── generated-images/   # Immagini responsive generate
│   ├── sounds/             # Effetti sonori
│   ├── translations/       # File di traduzione (fr, en, es)
│   └── videos/             # Video tutorial
├── tests/                  # Test automatizzati
│   ├── __tests__/          # Test unitari e di integrazione
│   └── tests-esm/          # Test ESM (.mjs)
├── scripts/                # Script di manutenzione
│   ├── compare-translations.cjs # Confronto traduzioni
│   └── cleanup-i18n-keys.cjs # Pulizia chiavi i18n
└── dist/                   # Build di produzione (generata)
```

### Architettura tecnica

**Moduli ES6 Moderni**: Il progetto utilizza un'architettura modulare con classi ES6 e import/export nativi.

**Componenti Riutilizzabili**: Interfaccia costruita con componenti UI centralizzati (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Caricamento intelligente dei moduli su richiesta tramite `lazy-loader.js` per ottimizzare le prestazioni iniziali.

**Sistema di Archiviazione Unificato**: API centralizzata per la persistenza dei dati utente tramite LocalStorage con fallback.

**Gestione Audio Centralizzata**: Controllo del suono con supporto multilingue e preferenze per utente.

**Event Bus**: Comunicazione basata su eventi disaccoppiata tra componenti per un'architettura manutenibile.

**Navigazione a Slide**: Sistema di navigazione basato su slide numerate (slide0, slide1, ecc.) con `goToSlide()`.

**Sicurezza**: Protezione XSS e sanificazione tramite `security-utils.js` per tutte le manipolazioni DOM.

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
- Sistema di streak (serie di risposte corrette)

### Modalità Sfida

Corsa contro il tempo con:

- 3 livelli di difficoltà (Principiante, Medio, Difficile)
- Bonus di tempo per le risposte corrette
- Sistema di vite
- Classifica dei migliori punteggi

### Modalità Avventura

Progressione narrativa con:

- 12 livelli tematici sbloccabili
- Mappa interattiva con progressione visiva
- Storia immersiva con personaggi
- Sistema di stelle e ricompense

### Minigiochi Arcade

Ogni minigioco offre:

- Scelta della difficoltà e personalizzazione
- Sistema di vite e punteggio
- Controlli da tastiera e touch
- Classifiche individuali per utente

## 🛠️ Sviluppo

### Flusso di lavoro di sviluppo

**IMPORTANTE: Non eseguire mai commit direttamente su main**

Il progetto utilizza un flusso di lavoro basato sui branch delle funzionalità:

1. **Creare un branch**:

   ```bash
   git checkout -b feat/nome-funzionalita
   # o
   git checkout -b fix/nome-bug
   ```

2. **Sviluppare e testare**:

   ```bash
   npm run format:check  # Controllare SEMPRE prima la formattazione
   npm run format        # Formattare se necessario
   npm run lint          # Controllare la qualità del codice
   npm run test          # Eseguire i test
   npm run test:coverage # Controllare la copertura
   ```

3. **Eseguire il commit sul branch**:

   ```bash
   git add .
   git commit -m "feat: descrizione della funzionalità"
   ```

4. **Eseguire il push e creare una Pull Request**:
   ```bash
   git push -u origin feat/nome-funzionalita
   ```

**Stile dei commit**: Conciso, modo imperativo (es: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Assicurarsi che `npm run lint`, `npm test` e `npm run test:coverage` passino prima di ogni commit

### Architettura dei componenti

**GameMode (classe base)**: Tutte le modalità ereditano da una classe comune con metodi standardizzati.

**GameModeManager**: Orchestrazione centralizzata dell'avvio e della gestione delle modalità.

**Componenti UI**: TopBar, InfoBar, Dashboard e Customization forniscono un'interfaccia coerente.

**Lazy Loading**: I moduli vengono caricati su richiesta per ottimizzare le prestazioni iniziali.

**Event Bus**: Comunicazione disaccoppiata tra componenti tramite il sistema di eventi.

### Test

Il progetto include una suite di test completa:

- Test unitari dei moduli core
- Test di integrazione dei componenti
- Test delle modalità di gioco
- Copertura del codice automatizzata

```bash
npm test              # Tutti i test (CJS)
npm test:core         # Test dei moduli centrali
npm test:integration  # Test di integrazione
npm test:coverage     # Report di copertura
npm run test:esm      # Test ESM (es: components/dashboard) tramite vm-modules
```

### Build di produzione

- **Rollup**: Pacchettizza `js/main-es6.js` in ESM con code-splitting e sourcemap
- **Terser**: Minificazione automatica per ottimizzazione
- **Post-build**: Copia `css/` e `assets/`, le favicon (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e riscrive `dist/index.html` verso il file di entry con hash (es: `main-es6-*.js`)
- **Cartella finale**: `dist/` pronta per essere servita staticamente

```bash
npm run build      # genera dist/
npm run serve:dist # serve dist/ (porta 5000)
```

### Integrazione Continua

**GitHub Actions**: Pipeline automatizzata in `.github/workflows/ci.yml`

La pipeline CI/CD viene eseguita automaticamente a ogni push e pull request:

**Job principali**:

1. **build-test**: Job principale di convalida
   - Installazione dipendenze: `npm ci`
   - Verifica formattazione: `npm run format:check`
   - Analisi statica: `npm run lint`
   - Test unitari: `npm run test`
   - Audit di sicurezza: `npm audit`
   - Generazione artefatto di copertura

2. **accessibility**: Audit di accessibilità (non bloccante)
   - Esegue `npm run audit:accessibility`
   - Genera report di accessibilità WCAG 2.1 AA

3. **test-esm**: Test moduli ES6
   - Esegue `npm run test:esm` con Jest VM modules
   - Valida import/export ES6

4. **lighthouse**: Audit delle prestazioni (non bloccante)
   - Audit delle prestazioni mobile
   - Generazione artefatti report Lighthouse
   - Metriche Core Web Vitals

**Badge di qualità**:

- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix è una PWA completa con supporto offline e installabilità.

**Service Worker** (`sw.js`):

- Navigazione: Network-first con fallback offline a `offline.html`
- Immagini: Cache-first per ottimizzare le prestazioni
- Traduzioni: Stale-while-revalidate per aggiornamento in background
- JS/CSS: Network-first per servire sempre l'ultima versione
- Gestione versione automatica tramite `cache-updater.js`

**Manifest** (`manifest.json`):

- Icone SVG e PNG per tutti i dispositivi
- Installabile su mobile (Aggiungi a schermata Home)
- Configurazione standalone per esperienza simil-app
- Supporto temi e colori

**Testare la modalità offline localmente**:

1. Avviare il server di sviluppo:

   ```bash
   npm run serve
   ```

   Aprire `http://localhost:8080` (o la porta visualizzata)

2. Test manuale:
   - Disabilitare la rete nei DevTools (Tab Network → Offline)
   - Aggiornare la pagina → viene visualizzato `offline.html`

3. Test automatizzato (Richiede Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Script di gestione Service Worker**:

```bash
npm run sw:disable  # Disabilita service worker
npm run sw:fix      # Correggi problemi di cache
```

### Standard di qualità

**Strumenti di qualità del codice**:

- **ESLint**: Configurazione moderna con flat config (`eslint.config.js`), supporto ES2022
- **Prettier**: Formattazione automatica del codice (`.prettierrc`)
- **Stylelint**: Validazione CSS (`.stylelintrc.json`)
- **JSDoc**: Documentazione automatica delle funzioni con analisi della copertura

**Regole del codice importanti**:

- Rimuovere variabili e parametri non utilizzati (`no-unused-vars`)
- Utilizzare una gestione errori specifica (niente catch vuoti)
- Evitare `innerHTML` a favore delle funzioni `security-utils.js`
- Mantenere la complessità cognitiva < 15 per le funzioni
- Estrarre funzioni complesse in helper più piccoli

**Sicurezza**:

- **Protezione XSS**: Utilizzare le funzioni di `security-utils.js`:
  - `appendSanitizedHTML()` invece di `innerHTML`
  - `createSafeElement()` per creare elementi sicuri
  - `setSafeMessage()` per contenuto testuale
- **Script esterni**: Attributo `crossorigin="anonymous"` obbligatorio
- **Validazione input**: Sanificare sempre i dati esterni
- **Content Security Policy**: Header CSP per limitare le fonti degli script

**Accessibilità**:

- Conformità WCAG 2.1 AA
- Navigazione completa da tastiera
- Ruoli ARIA e label appropriate
- Contrasti di colore conformi

**Prestazioni**:

- Lazy loading dei moduli tramite `lazy-loader.js`
- Ottimizzazioni CSS e asset responsive
- Service Worker per caching intelligente
- Code splitting e minificazione in produzione

## 📱 Compatibilità

### Browser supportati

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivi

- **Desktop**: Controlli tastiera e mouse
- **Tablet**: Interfaccia touch ottimizzata
- **Smartphone**: Design responsive adattivo

### Accessibilità

- Navigazione completa da tastiera (Tab, frecce, Esc)
- Ruoli ARIA e label per screen reader
- Contrasti di colore conformi
- Supporto tecnologie assistite

## 🌍 Localizzazione

Supporto multilingue completo:

- **Francese** (lingua predefinita)
- **Inglese**
- **Spagnolo**

### Gestione traduzioni

**File di traduzione:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Inizia",
  "quiz_correct": "Ben fatto!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Script di gestione i18n

**`npm run i18n:verify`** - Verifica coerenza chiavi di traduzione

**`npm run i18n:unused`** - Elenca chiavi di traduzione non utilizzate

**`npm run i18n:compare`** - Confronta file di traduzione con fr.json (riferimento)

Questo script (`scripts/compare-translations.cjs`) assicura la sincronizzazione di tutti i file di lingua:

**Funzionalità:**

- Rilevamento chiavi mancanti (presenti in fr.json ma assenti in altre lingue)
- Rilevamento chiavi extra (presenti in altre lingue ma non in fr.json)
- Identificazione valori vuoti (`""`, `null`, `undefined`, `[]`)
- Verifica coerenza tipi (string vs array)
- Appiattimento strutture JSON annidate in notazione a punti (es: `arcade.multiMemory.title`)
- Generazione report console dettagliato
- Salvataggio report JSON in `docs/translations-comparison-report.json`

**Esempio di output:**

```
🔍 Analisi comparativa dei file di traduzione

📚 Lingua di riferimento: fr.json
✅ fr.json: 335 chiavi

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analisi di en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Totale chiavi: 335
✅ Nessuna chiave mancante
✅ Nessuna chiave extra
✅ Nessun valore vuoto

📊 RIEPILOGO FINALE
  fr.json: 335 chiavi
  en.json: 335 chiavi
  es.json: 335 chiavi

✅ Tutti i file di traduzione sono perfettamente sincronizzati!
```

**Copertura traduzioni:**

- Interfaccia utente completa
- Istruzioni di gioco
- Messaggi di errore e feedback
- Descrizioni e aiuto contestuale
- Contenuto narrativo modalità Aventura
- Label accessibilità e ARIA

## 📊 Archiviazione Dati

### Dati utente

- Profili e preferenze
- Progressione per modalità di gioco
- Punteggi e statistiche giochi arcade
- Impostazioni personalizzazione

### Funzionalità tecniche

- Local storage (localStorage) con fallback
- Isolamento dati per utente
- Salvataggio automatico progressione
- Migrazione automatica dati vecchi

## 🐛 Segnalare un Problema

I problemi possono essere segnalati tramite le issue di GitHub. Si prega di includere:

- Descrizione dettagliata del problema
- Passaggi per riprodurlo
- Browser e versione
- Screenshot se rilevanti

## 💝 Supportare il progetto

**[☕ Fai una donazione via PayPal](https://paypal.me/jls)**

## 📄 Licenza

Questo progetto è concesso in licenza sotto AGPL v3. Vedi il file `LICENSE` per maggiori dettagli.

---

_LeapMultix - Applicazione educativa moderna per l'apprendimento delle tabelline_

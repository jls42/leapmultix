<details>
<summary>Questo documento è disponibile anche in altre lingue</summary>

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

<!-- Badge (aggiornare <owner>/<repo> dopo la migrazione a GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Indice

- [Descrizione](#descrizione)
- [Funzionalità](#-funzionalità)
- [Avvio rapido](#-avvio-rapido)
- [Architettura](#-architettura)
- [Modalità di Gioco Dettagliate](#-modalità-di-gioco-dettagliate)
- [Sviluppo](#-sviluppo)
- [Compatibilità](#-compatibilità)
- [Localizzazione](#-localizzazione)
- [Archiviazione dei dati](#-archiviazione-dei-dati)
- [Segnalare un problema](#-segnalare-un-problema)
- [Licenza](#-licenza)

## Descrizione

LeapMultix è un'applicazione web educativa interattiva e moderna per bambini (8-12 anni) per padroneggiare le tabelline. L'applicazione offre **4 modalità di gioco classiche** e **4 mini-giochi arcade** in un'interfaccia intuitiva, accessibile e multilingue.

**Sviluppato da:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## ✨ Funzionalità

### 🎮 Modalità di Gioco

- **Modalità Scoperta**: Esplorazione visiva e interattiva delle tabelline
- **Modalità Quiz**: Domande a scelta multipla con progressione adattiva
- **Modalità Sfida**: Corsa contro il tempo con diversi livelli di difficoltà
- **Modalità Avventura**: Progressione narrativa attraverso i livelli con una mappa interattiva

### 🕹️ Mini-giochi Arcade

- **MultiInvaders**: Space Invaders educativo - Distruggi le risposte sbagliate
- **MultiMiam**: Pac-Man matematico - Raccogli le risposte corrette
- **MultiMemory**: Gioco di memoria - Abbina moltiplicazioni e risultati
- **MultiSnake**: Snake educativo - Cresci mangiando i numeri corretti

### 🌍 Funzionalità Trasversali

- **Multi-utente**: Gestione di profili individuali con progressi salvati
- **Multilingue**: Supporto per francese, inglese e spagnolo
- **Personalizzazione**: Avatar, temi di colore, sfondi
- **Accessibilità**: Navigazione da tastiera, supporto touch, conformità WCAG 2.1 AA
- **Mobile responsive**: Interfaccia ottimizzata per tablet e smartphone
- **Sistema di progressione**: Punteggi, badge, sfide giornaliere

## 🚀 Avvio rapido

### Prerequisiti

- Node.js (versione 16 o successiva)
- Un browser web moderno

### Installazione

```bash
# Clona il progetto
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Installa le dipendenze
npm install

# Avvia il server di sviluppo (opzione 1)
npm run serve
# L'applicazione sarà accessibile su http://localhost:8080 (o la porta successiva disponibile)

# O con Python (opzione 2)
python3 -m http.server 8000
# L'applicazione sarà accessibile su http://localhost:8000
```

### Script disponibili

```bash
# Sviluppo
npm run serve          # Server locale (http://localhost:8080)
npm run lint           # Controllo del codice con ESLint
npm run lint:fix       # Correzione automatica dei problemi di ESLint
npm run format:check   # Controlla la formattazione del codice (SEMPRE prima del commit)
npm run format         # Formatta il codice con Prettier
npm run verify         # Quality gate: lint + test + coverage

# Test
npm run test           # Esegui tutti i test (CJS)
npm run test:watch     # Test in modalità watch
npm run test:coverage  # Test con report di copertura
npm run test:core      # Solo test dei moduli principali
npm run test:integration # Test di integrazione
npm run test:storage   # Test del sistema di archiviazione
npm run test:esm       # Test ESM (cartelle tests-esm/, Jest vm-modules)
npm run test:verbose   # Test con output dettagliato
npm run test:pwa-offline # Test PWA offline (richiede Puppeteer), dopo `npm run serve`

# Analisi e manutenzione
npm run analyze:jsdoc  # Analisi della documentazione
npm run improve:jsdoc  # Miglioramento automatico di JSDoc
npm run audit:mobile   # Test di reattività mobile
npm run audit:accessibility # Test di accessibilità
npm run dead-code      # Rilevamento di codice non utilizzato
npm run analyze:globals # Analisi delle variabili globali
npm run analyze:dependencies # Analisi dell'uso delle dipendenze
npm run verify:cleanup # Analisi combinata (codice morto + globali)

# Gestione degli asset
npm run assets:generate    # Genera immagini reattive
npm run assets:backgrounds # Converti gli sfondi in WebP
npm run assets:analyze     # Analisi degli asset reattivi
npm run assets:diff        # Confronto degli asset

# Internazionalizzazione
npm run i18n:verify    # Verifica la coerenza delle chiavi di traduzione
npm run i18n:unused    # Elenca le chiavi di traduzione non utilizzate
npm run i18n:compare   # Confronta le traduzioni (en/es) con fr.json (riferimento)

# Build e distribuzione
npm run build          # Build di produzione (Rollup) + postbuild (dist/ completa)
npm run serve:dist     # Servi dist/ su http://localhost:5000 (o porta disponibile)

# PWA e Service Worker
npm run sw:disable     # Disabilita il service worker
npm run sw:fix         # Risolvi i problemi del service worker
```

## 🏗️ Architettura

### Struttura dei file

```
leapmultix/
├── index.html              # Punto di ingresso principale
├── js/
│   ├── core/               # Moduli principali ES6
│   │   ├── GameMode.js     # Classe base delle modalità
│   │   ├── GameModeManager.js # Gestione delle modalità di gioco
│   │   ├── storage.js      # API di archiviazione LocalStorage
│   │   ├── audio.js        # Gestione del suono
│   │   ├── utils.js        # Utilità generiche (sorgente canonica)
│   │   ├── eventBus.js     # Comunicazione basata su eventi
│   │   ├── userState.js    # Gestione della sessione utente
│   │   ├── mainInit.js     # Inizializzazione DOM-ready
│   │   ├── theme.js        # Sistema di temi
│   │   ├── userUi.js       # Utilità dell'interfaccia utente
│   │   ├── parental.js     # Controlli parentali
│   │   ├── adventure-data.js # Dati della modalità Avventura
│   │   ├── mult-stats.js   # Statistiche di moltiplicazione
│   │   ├── challenge-stats.js # Statistiche della sfida
│   │   └── daily-challenge.js # Gestione delle sfide giornaliere
│   ├── components/         # Componenti UI riutilizzabili
│   │   ├── topBar.js       # Barra di navigazione
│   │   ├── infoBar.js      # Barre informative dei giochi
│   │   ├── dashboard.js    # Dashboard dell'utente
│   │   └── customization.js # Interfaccia di personalizzazione
│   ├── modes/              # Modalità di gioco
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Mini-giochi arcade
│   │   ├── arcade.js       # Orchestratore principale dell'arcade
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Gioco di memoria (31 KB)
│   │   ├── arcade-multimiam.js # Integrazione di Multimiam
│   │   ├── arcade-multisnake.js # Integrazione di Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilità condivise
│   │   ├── arcade-message.js, arcade-points.js # Componenti UI
│   │   └── arcade-scores.js # Gestione dei punteggi
│   ├── multimiam/          # Gioco Pac-Man (architettura scomposta)
│   │   ├── multimiam.js    # Controller principale
│   │   ├── multimiam-engine.js # Motore di gioco (15 KB)
│   │   ├── multimiam-renderer.js # Sistema di rendering (9 KB)
│   │   ├── multimiam-controls.js # Gestione dei controlli (7 KB)
│   │   ├── multimiam-questions.js # Generazione di domande (6 KB)
│   │   └── multimiam-ui.js # Elementi dell'interfaccia
│   ├── multisnake.js       # Gioco Snake (38 KB)
│   ├── navigation/         # Sistema di navigazione
│   │   ├── slides.js       # Navigazione a diapositive (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Supporto da tastiera
│   ├── ui/                 # Interfaccia utente e feedback
│   │   ├── uiUtils.js      # Utilità dell'interfaccia
│   │   ├── ui-feedback.js  # Meccanismi di feedback
│   │   ├── touch-support.js # Supporto touch (7 KB)
│   │   ├── virtual-keyboard.js # Tastiera virtuale
│   │   ├── coin-display.js, coin-effects.js # Sistema di valuta
│   │   ├── notifications.js # Sistema di notifiche
│   │   └── badges.js       # Sistema di badge
│   ├── media/              # Gestione dei media
│   │   ├── VideoManager.js # Gestione della riproduzione video (12 KB)
│   │   └── responsive-image-loader.js # Caricamento di immagini (9 KB)
│   ├── orchestration/      # Orchestrazione e caricamento
│   │   ├── mode-orchestrator.js # Cambio di modalità
│   │   ├── lazy-loader.js  # Caricamento dinamico (10 KB)
│   │   └── game-cleanup.js # Pulizia dello stato
│   ├── utils/              # Utilità
│   │   ├── utils-es6.js    # Aggregatore principale (5 KB)
│   │   ├── main-helpers.js # Helper dell'applicazione
│   │   ├── helpers.js      # Funzioni helper legacy
│   │   ├── stats-utils.js  # Utilità statistiche
│   │   ├── difficulty.js   # Gestione della difficoltà
│   │   └── questionGenerator.js # Generazione di domande
│   ├── storage/            # Archiviazione e stato
│   │   ├── storage.js      # Wrapper di archiviazione legacy
│   │   └── userManager.js  # Gestione multi-utente (19 KB)
│   ├── i18n/               # Internazionalizzazione
│   │   ├── i18n.js         # Sistema i18n
│   │   └── i18n-store.js   # Archiviazione delle traduzioni
│   ├── security/           # Sicurezza e gestione degli errori
│   │   ├── security-utils.js # Protezione XSS, sanificazione
│   │   ├── error-handlers.js # Gestione globale degli errori
│   │   └── logger.js       # Sistema di logging
│   ├── accessibility/      # Accessibilità
│   │   ├── accessibility.js # Funzionalità di accessibilità
│   │   └── speech.js       # Supporto alla sintesi vocale
│   ├── integration/        # Integrazione e analisi
│   │   ├── plausible-init.js # Analisi di Plausible
│   │   ├── cache-updater.js # Gestione della cache (10 KB)
│   │   └── imports.js      # Utilità di importazione
│   ├── main-es6.js         # Punto di ingresso ES6
│   ├── main.js             # Orchestratore principale
│   ├── bootstrap.js        # Configurazione dei gestori di eventi ES6
│   └── game.js             # Gestione dello stato e sfide giornaliere
├── css/                    # Stili modulari
├── assets/                 # Risorse
│   ├── images/             # Immagini e sprite
│   ├── generated-images/   # Immagini reattive generate
│   ├── sounds/             # Effetti sonori
│   ├── translations/       # File di traduzione (fr, en, es)
│   └── videos/             # Video tutorial
├── tests/                  # Test automatizzati
│   ├── __tests__/          # Test unitari e di integrazione
│   └── tests-esm/          # Test ESM (.mjs)
├── scripts/                # Script di manutenzione
│   ├── compare-translations.cjs # Confronto delle traduzioni
│   └── cleanup-i18n-keys.cjs # Pulizia delle chiavi i18n
└── dist/                   # Build di produzione (generata)
```

### Architettura tecnica

**Moduli ES6 moderni**: Il progetto utilizza un'architettura modulare con classi ES6 e import/export nativi.

**Componenti riutilizzabili**: Interfaccia costruita con componenti UI centralizzati (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Caricamento intelligente dei moduli su richiesta tramite `lazy-loader.js` per ottimizzare le prestazioni iniziali.

**Sistema di archiviazione unificato**: API centralizzata per la persistenza dei dati utente tramite LocalStorage con fallback.

**Gestione audio centralizzata**: Controllo del suono con supporto multilingue e preferenze per utente.

**Event Bus**: Comunicazione disaccoppiata basata su eventi tra i componenti per un'architettura manutenibile.

**Navigazione a diapositive**: Sistema di navigazione basato su diapositive numerate (slide0, slide1, ecc.) con `goToSlide()`.

**Sicurezza**: Protezione XSS e sanificazione tramite `security-utils.js` per tutte le manipolazioni del DOM.

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
- Progressione adattiva in base ai successi
- Tastierino numerico virtuale
- Sistema di serie (serie di risposte corrette)

### Modalità Sfida

Corsa contro il tempo con:

- 3 livelli di difficoltà (Principiante, Medio, Difficile)
- Bonus di tempo per le risposte corrette
- Sistema di vite
- Classifica dei punteggi migliori

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

### Flusso di lavoro di sviluppo

**IMPORTANTE: Non fare mai commit direttamente su main**

Il progetto utilizza un flusso di lavoro basato sui rami di funzionalità:

1. **Crea un ramo**:

   ```bash
   git checkout -b feat/nome-della-funzionalità
   # o
   git checkout -b fix/nome-del-bug
   ```

2. **Sviluppa e testa**:

   ```bash
   npm run format:check  # Controlla SEMPRE prima la formattazione
   npm run format        # Formatta se necessario
   npm run lint          # Controlla la qualità del codice
   npm run test          # Esegui i test
   npm run test:coverage # Controlla la copertura
   ```

3. **Fai commit sul ramo**:

   ```bash
   git add .
   git commit -m "feat: descrizione della funzionalità"
   ```

4. **Fai push e crea una Pull Request**:
   ```bash
   git push -u origin feat/nome-della-funzionalità
   ```

**Stile dei commit**: Messaggi concisi, in modo imperativo (es: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Assicurarsi che `npm run lint`, `npm run test` e `npm run test:coverage` passino prima di ogni commit

### Architettura dei componenti

**GameMode (classe base)**: Tutte le modalità ereditano da una classe comune con metodi standardizzati.

**GameModeManager**: Orchestrazione centralizzata del lancio e della gestione delle modalità.

**Componenti UI**: TopBar, InfoBar, Dashboard e Customization forniscono un'interfaccia coerente.

**Lazy Loading**: I moduli vengono caricati su richiesta per ottimizzare le prestazioni iniziali.

**Event Bus**: Comunicazione disaccoppiata tra i componenti tramite il sistema di eventi.

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
npm run test:esm      # Test ESM (es: components/dashboard) tramite vm-modules
```

### Build di produzione

- **Rollup**: Raggruppa `js/main-es6.js` in ESM con code-splitting e sourcemap
- **Terser**: Minificazione automatica per l'ottimizzazione
- **Post-build**: Copia `css/` e `assets/`, le favicon (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, e riscrive `dist/index.html` nel file di ingresso con hash (es: `main-es6-*.js`)
- **Cartella finale**: `dist/` pronta per essere servita staticamente

```bash
npm run build      # genera dist/
npm run serve:dist # serve dist/ (porta 5000)
```

### Integrazione Continua

**GitHub Actions**: Pipeline automatizzata in `.github/workflows/ci.yml`

La pipeline CI/CD viene eseguita automaticamente ad ogni push e pull request:

**Job principali**:

1. **build-test**: Job di validazione principale
   - Installazione delle dipendenze: `npm ci`
   - Controllo della formattazione: `npm run format:check`
   - Analisi statica: `npm run lint`
   - Test unitari: `npm run test`
   - Audit di sicurezza: `npm audit`
   - Generazione dell'artefatto di copertura

2. **accessibility**: Audit di accessibilità (non bloccante)
   - Esegue `npm run audit:accessibility`
   - Genera un report di accessibilità WCAG 2.1 AA

3. **test-esm**: Test dei moduli ES6
   - Esegue `npm run test:esm` con i moduli Jest VM
   - Valida gli import/export ES6

4. **lighthouse**: Audit delle prestazioni (non bloccante)
   - Audit delle prestazioni mobile
   - Generazione di artefatti di report di Lighthouse
   - Metriche Core Web Vitals

**Badge di qualità**:

- Stato della build CI (GitHub Actions)
- Grado CodeFactor
- Badge Codacy
- Quality Gate SonarCloud

### PWA (Progressive Web App)

LeapMultix è una PWA completa con supporto offline e possibilità di installazione.

**Service Worker** (`sw.js`):

- Navigazione: Network-first con fallback offline a `offline.html`
- Immagini: Cache-first per ottimizzare le prestazioni
- Traduzioni: Stale-while-revalidate per l'aggiornamento in background
- JS/CSS: Network-first per servire sempre l'ultima versione
- Gestione automatica della versione tramite `cache-updater.js`

**Manifest** (`manifest.json`):

- Icone SVG e PNG per tutti i dispositivi
- Installazione possibile su mobile (Aggiungi a schermata Home)
- Configurazione standalone per un'esperienza simile a un'app
- Supporto per temi e colori

**Testare la modalità offline localmente**:

1. Avviare il server di sviluppo:

   ```bash
   npm run serve
   ```

   Aprire `http://localhost:8080` (o la porta visualizzata)

2. Testare manualmente:
   - Disconnettere la rete negli strumenti di sviluppo (scheda Rete → Offline)
   - Aggiornare la pagina → viene visualizzato `offline.html`

3. Test automatizzato (richiede Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Script di gestione del Service Worker**:

```bash
npm run sw:disable  # Disabilita il service worker
npm run sw:fix      # Risolvi i problemi di cache
```

### Standard di qualità

**Strumenti di qualità del codice**:

- **ESLint**: Configurazione moderna con flat config (`eslint.config.js`), supporto ES2022
- **Prettier**: Formattazione automatica del codice (`.prettierrc`)
- **Stylelint**: Validazione CSS (`.stylelintrc.json`)
- **JSDoc**: Documentazione automatica delle funzioni con analisi della copertura

**Regole di codice importanti**:

- Rimuovere variabili e parametri non utilizzati (`no-unused-vars`)
- Utilizzare una gestione specifica degli errori (nessun blocco catch vuoto)
- Evitare `innerHTML` a favore delle funzioni di `security-utils.js`
- Mantenere una complessità cognitiva < 15 per le funzioni
- Estrarre funzioni complesse in helper più piccoli

**Sicurezza**:

- **Protezione XSS**: Utilizzare le funzioni di `security-utils.js`:
  - `appendSanitizedHTML()` invece di `innerHTML`
  - `createSafeElement()` per creare elementi sicuri
  - `setSafeMessage()` per il contenuto testuale
- **Script esterni**: Attributo `crossorigin="anonymous"` obbligatorio
- **Validazione degli input**: Sanificare sempre i dati esterni
- **Content Security Policy**: Intestazioni CSP per limitare le fonti degli script

**Accessibilità**:

- Conformità WCAG 2.1 AA
- Navigazione completa da tastiera
- Ruoli e etichette ARIA appropriati
- Contrasti di colore conformi

**Prestazioni**:

- Lazy loading dei moduli tramite `lazy-loader.js`
- Ottimizzazioni CSS e asset reattivi
- Service Worker per la memorizzazione nella cache intelligente
- Code splitting e minificazione in produzione

## 📱 Compatibilità

### Browser supportati

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivi

- **Desktop**: Controlli da tastiera e mouse
- **Tablet**: Interfaccia touch ottimizzata
- **Smartphone**: Design reattivo adattivo

### Accessibilità

- Navigazione completa da tastiera (Tab, frecce, Esc)
- Ruoli ed etichette ARIA per lettori di schermo
- Contrasti di colore conformi
- Supporto delle tecnologie assistive

## 🌍 Localizzazione

Supporto multilingue completo:

- **Francese** (lingua predefinita)
- **Inglese**
- **Spagnolo**

### Gestione delle traduzioni

**File di traduzione:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Script di gestione i18n

**`npm run i18n:verify`** - Verifica la coerenza delle chiavi di traduzione

**`npm run i18n:unused`** - Elenca le chiavi di traduzione non utilizzate

**`npm run i18n:compare`** - Confronta i file di traduzione con fr.json (riferimento)

Questo script (`scripts/compare-translations.cjs`) assicura la sincronizzazione di tutti i file di lingua:

**Funzionalità:**

- Rilevamento delle chiavi mancanti (presenti in fr.json ma assenti in altre lingue)
- Rilevamento delle chiavi aggiuntive (presenti in altre lingue ma non in fr.json)
- Identificazione dei valori vuoti (`""`, `null`, `undefined`, `[]`)
- Verifica della coerenza dei tipi (stringa vs array)
- Appiattimento delle strutture JSON nidificate in notazione a punti (es: `arcade.multiMemory.title`)
- Generazione di un report dettagliato sulla console
- Salvataggio del report JSON in `docs/translations-comparison-report.json`

**Esempio di output:**

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

**Copertura delle traduzioni:**

- Interfaccia utente completa
- Istruzioni dei giochi
- Messaggi di errore e di feedback
- Descrizioni e aiuto contestuale
- Contenuto narrativo della modalità Avventura
- Etichette di accessibilità e ARIA

## 📊 Archiviazione dei dati

### Dati utente

- Profili e preferenze
- Progresso per modalità di gioco
- Punteggi e statistiche dei giochi arcade
- Impostazioni di personalizzazione

### Funzionalità tecniche

- Archiviazione locale (localStorage) con fallback
- Isolamento dei dati per utente
- Salvataggio automatico dei progressi
- Migrazione automatica dei dati vecchi

## 🐛 Segnalare un problema

I problemi possono essere segnalati tramite le issue di GitHub. Si prega di includere:

- Descrizione dettagliata del problema
- Passaggi per riprodurlo
- Browser e versione
- Screenshot se pertinenti

## 💝 Sostenere il progetto

**[☕ Fai una donazione tramite PayPal](https://paypal.me/jls)**

## 📄 Licenza

Questo progetto è concesso in licenza con la licenza AGPL v3. Vedere il file `LICENSE` per maggiori dettagli.

---

_LeapMultix - Applicazione educativa moderna per l'apprendimento delle tabelline_

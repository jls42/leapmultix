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

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Licenza: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Badge Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Stato del Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Valutazione dell'affidabilità](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Valutazione della sicurezza](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Valutazione della manutenibilità](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Debito tecnico](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Bug](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Vulnerabilità](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code smell](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Righe duplicate (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Righe di codice](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## Indice

- [Descrizione](#descrizione)
- [Panoramica](#-panoramica)
- [Funzionalità](#-funzionalità)
- [Avvio rapido](#-avvio-rapido)
- [Architettura](#-architettura)
- [Modalità di gioco dettagliate](#-modalità-di-gioco-dettagliate)
- [Sviluppo](#-sviluppo)
- [Compatibilità](#-compatibilità)
- [Localizzazione](#-localizzazione)
- [Archiviazione dei dati](#-archiviazione-dei-dati)
- [Segnalare un problema](#-segnalare-un-problema)
- [Licenza](#-licenza)

## Descrizione

LeapMultix è un'applicazione web educativa interattiva destinata ai bambini dai 6 ai 12 anni per imparare le 4 operazioni aritmetiche: moltiplicazione (×), addizione (+), sottrazione (−) e divisione (÷). Offre **5 modalità di gioco** e **4 minigiochi arcade** in un'interfaccia intuitiva, accessibile e multilingue.

**Supporto per più operazioni:** tutte e cinque le modalità supportano le quattro operazioni. La scelta si effettua nella schermata iniziale e si applica all'intero percorso.

**Sviluppato da:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## 📸 Panoramica

### Le schermate

|                                                                                                                                      |                                                                                                                                    |
| :----------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: |
|                              ![Schermata «Chi gioca?»: scelta del profilo](docs/media/01-accueil.webp)                               |                    ![Menu principale: scelta dell'operazione e delle cinque modalità](docs/media/02-menu.webp)                     |
|                         **Chi gioca?** — un profilo per ogni bambino, con il suo avatar e i suoi progressi.                          |                          **Il menu** — qui si sceglie l'operazione, quindi si aprono le cinque modalità.                           |
|                    ![Modalità Scoperta: la tabellina del 4 mostrata con dei punti](docs/media/03-decouverte.webp)                    |                  ![Modalità Quiz: risposta errata in rosso, risposta corretta in verde](docs/media/04-quiz.webp)                   |
|            **Scoperta** — ogni uguaglianza viene mostrata con punti, salti o conteggi, insieme al trucco della tabellina.            | **Quiz** — la scelta del bambino resta visibile accanto alla risposta corretta e la spiegazione illustra nel dettaglio il calcolo. |
|                           ![Modalità Sfida: conto alla rovescia e serie in corso](docs/media/05-defi.webp)                           |            ![Modalità Avventura: mappa dei dieci livelli, con quelli successivi bloccati](docs/media/06-aventure.webp)             |
| **Sfida** — corsa contro il tempo. In caso di errore, il cronometro si ferma per il tempo necessario a leggere la risposta corretta. |                         **Avventura** — dieci livelli che si aprono uno dopo l'altro in cambio di stelle.                          |
|                                   ![Menu Arcade: i quattro minigiochi](docs/media/07-arcade.webp)                                    |                        ![Dashboard: stelle per tabellina e statistiche](docs/media/08-tableau-de-bord.webp)                        |
|                     **Arcade** — quattro minigiochi, con impostazione della difficoltà e scelta dell'astronave.                      |                        **Dashboard** — stelle per tabellina, tabelline da ripassare, punteggi per modalità.                        |
|                        ![Personalizzazione: avatar, temi, accessibilità](docs/media/09-personnalisation.webp)                        |                                                                                                                                    |
|              **Personalizzazione** — avatar, tema cromatico, dimensione del testo, contrasto elevato, codice genitori.               |                                                                                                                                    |

### I minigiochi arcade

Quattro giochi che pongono la stessa domanda — quella visualizzata sopra l'area di
gioco, insieme al tempo rimanente e alle vite — ma richiedono ogni volta un'azione
diversa.

|                                                                                                                              |                                                                                                           |
| :--------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
| ![MultiInvaders: mostri con dei numeri, un'astronave nella parte inferiore dello schermo](docs/media/10-multiinvaders.webp)  | ![MultiMiam: un labirinto in cui le palline mostrano le possibili risposte](docs/media/11-multimiam.webp) |
|        **MultiInvaders** — sparare alle risposte errate, risparmiando quella corretta: nasconde un amico da liberare.        |     **MultiMiam** — attraversare il labirinto per prendere il risultato corretto, evitando i mostri.      |
| ![MultiMemory: una griglia di carte, due delle quali girate mostrano un calcolo e un numero](docs/media/12-multimemory.webp) |        ![MultiSnake: un serpente e delle mele numerate in un prato](docs/media/13-multisnake.webp)        |
|                     **MultiMemory** — ricordare quale carta contiene il risultato del calcolo mostrato.                      |             **MultiSnake** — crescere mangiando i numeri corretti ed evitare tutti gli altri.             |

## ✨ Funzionalità

### 🎮 Modalità di gioco

- **Modalità Scoperta**: esplorazione visiva e interattiva adattata a ogni operazione
- **Modalità Quiz**: domande a scelta multipla con supporto per le 4 operazioni (×, +, −, ÷) e progressione adattiva
- **Modalità Sfida**: corsa contro il tempo con le 4 operazioni (×, +, −, ÷) e diversi livelli di difficoltà
- **Modalità Avventura**: progressione narrativa per livelli con supporto per le 4 operazioni

### 🕹️ Minigiochi arcade

- **MultiInvaders**: Space Invaders educativo - Distruggere le risposte errate
- **MultiMiam**: Pac-Man matematico - Raccogliere le risposte corrette
- **MultiMemory**: gioco di memoria - Abbinare operazioni e risultati
- **MultiSnake**: Snake educativo - Crescere mangiando i numeri corretti

### ➕ Supporto per più operazioni

LeapMultix offre un allenamento completo sulle 4 operazioni aritmetiche in **tutte le modalità**:

| Modalità  | ×   | +   | −   | ÷   |
| --------- | --- | --- | --- | --- |
| Quiz      | ✅  | ✅  | ✅  | ✅  |
| Sfida     | ✅  | ✅  | ✅  | ✅  |
| Scoperta  | ✅  | ✅  | ✅  | ✅  |
| Avventura | ✅  | ✅  | ✅  | ✅  |
| Arcade    | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funzionalità trasversali

- **Multiutente**: gestione di profili individuali con progressi salvati
- **Multilingue**: supporto per francese, inglese e spagnolo
- **Personalizzazione**: avatar, temi cromatici, sfondi
- **Accessibilità**: navigazione da tastiera, supporto touch, conformità WCAG 2.1 AA
- **Responsive per dispositivi mobili**: interfaccia ottimizzata per tablet e smartphone
- **Sistema di progressione**: punteggi, badge, sfide giornaliere

## 🚀 Avvio rapido

### Prerequisiti

- Node.js (versione 16 o successiva)
- Un browser web moderno

### Installazione

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

### Script disponibili

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
```

## 🏗️ Architettura

### Struttura dei file

I moduli JavaScript sono **disposti senza sottocartelle in `js/`**, fatta eccezione per tre directory:
`core/`, `components/` e `modes/`. È quindi il nome del file a indicare il
raggruppamento (`arcade-*`, `multimiam-*`, `i18n*`…).

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
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### Architettura tecnica

**Moduli ES6 moderni**: il progetto utilizza un'architettura modulare con classi ES6 e import/export nativi.

**Componenti riutilizzabili**: interfaccia realizzata con componenti UI centralizzati (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: caricamento intelligente dei moduli su richiesta tramite `lazy-loader.js` per ottimizzare le prestazioni iniziali.

**Sistema di archiviazione unificato**: API centralizzata per la persistenza dei dati utente tramite LocalStorage con fallback.

**Gestione audio centralizzata**: controllo dell'audio con supporto multilingue e preferenze per utente.

**Event Bus**: comunicazione basata su eventi e disaccoppiata tra i componenti, per un'architettura manutenibile.

**Navigazione tramite slide**: sistema di navigazione basato su slide numerate (slide0, slide1, ecc.) con `goToSlide()`.

**Sicurezza**: protezione XSS e sanitizzazione tramite `security-utils.js` per tutte le manipolazioni del DOM.

## 🎯 Modalità di gioco dettagliate

### Modalità Scoperta

Interfaccia di esplorazione visiva delle tabelline con:

- Visualizzazione interattiva delle moltiplicazioni
- Animazioni e aiuti mnemonici
- Drag and drop educativo
- Progressione libera per tabellina

### Modalità Quiz

Domande a scelta multipla con:

- 10 domande per sessione
- Progressione adattiva in base ai risultati
- Tastierino numerico virtuale
- Sistema di streak (serie di risposte corrette)

### Modalità Sfida

Corsa contro il tempo con:

- 3 livelli di difficoltà (Principiante, Medio, Difficile)
- Bonus di tempo per le risposte corrette
- Sistema di vite
- Classifica dei punteggi migliori

### Modalità Avventura

Progressione narrativa con:

- 10 livelli tematici sbloccabili
- Mappa interattiva con progressione visiva
- Storia coinvolgente con personaggi
- Sistema di stelle e ricompense

### Minigiochi arcade

Ogni minigioco offre:

- Scelta della difficoltà e personalizzazione
- Sistema di vite e punteggio
- Controlli da tastiera e touch
- Classifiche individuali per utente

## 🛠️ Sviluppo

### Workflow di sviluppo

**Non eseguire mai commit direttamente su main.** Il progetto utilizza branch di
funzionalità.

**1. Creare un branch**, `feat/` per una funzionalità, `fix/` per una correzione:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Sviluppare e verificare.** La formattazione viene prima di tutto: la CI la rifiuta
ancor prima di eseguire i test.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Eseguire il commit sul branch**, quindi inviarlo:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Aprire una pull request** e attendere le analisi: verify, Codacy,
CodeFactor e SonarCloud. Correggere i problemi finché tutti i controlli non sono superati, prima di eseguire il merge.

**Stile dei commit**: messaggi concisi, in forma imperativa (es.: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: assicurarsi che `npm run lint`, `npm test` e `npm run test:coverage` vengano superati prima di ogni commit

### Architettura dei componenti

**GameMode (classe base)**: tutte le modalità ereditano da una classe comune con metodi standardizzati.

**GameModeManager**: orchestrazione centralizzata dell'avvio e della gestione delle modalità.

**Componenti UI**: TopBar, InfoBar, Dashboard e Customization forniscono un'interfaccia coerente.

**Lazy Loading**: i moduli vengono caricati su richiesta per ottimizzare le prestazioni iniziali.

**Event Bus**: comunicazione disaccoppiata tra i componenti tramite il sistema di eventi.

### Test

Il progetto include una suite di test completa:

- Test unitari dei moduli core
- Test di integrazione dei componenti
- Test delle modalità di gioco
- Copertura del codice automatizzata

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Build di produzione

- **Rollup**: crea il bundle di `js/main-es6.js` in ESM con code splitting e sourcemap
- **Terser**: minificazione automatica per l'ottimizzazione
- **Post-build**: copia di `css/` e `assets/`, delle favicon (`favicon.ico`, `favicon.png`, `favicon.svg`), di `sw.js`, e riscrittura di `dist/index.html` verso il file di ingresso con hash (es.: `main-es6-*.js`)
- **Directory finale**: `dist/` pronta per essere servita staticamente

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integrazione continua

**GitHub Actions**: `.github/workflows/ci.yml`, attivato a ogni push su
`main` e a ogni pull request.

**`verify`** — il quality gate, bloccante:

- `npm ci` seguito da `npm run verify` (ESLint, test Jest, copertura)
- `npm run format:check` (Prettier)

**`seo-report`** — dopo `verify`: audit Lighthouse del sito online, per
monitorare nel tempo le metriche SEO.

**Analisi esterne** integrate nelle pull request: Codacy, CodeFactor e
SonarCloud. Il quality gate di SonarCloud richiede valutazioni A per affidabilità, sicurezza e
manutenibilità del nuovo codice.

**Distribuzione**: `./deploy.sh` sincronizza il sito con S3 e invalida la cache
CloudFront. Se necessario, lo script rigenera le immagini responsive, assenti da git.

### PWA (Progressive Web App)

LeapMultix è una PWA completa con supporto offline e possibilità di installazione.

**Service Worker** (`sw.js`):

- Navigazione: Network-first con fallback offline verso `offline.html`
- Immagini: Cache-first per ottimizzare le prestazioni
- Traduzioni: Stale-while-revalidate per l'aggiornamento in background
- JS/CSS: Network-first per fornire sempre la versione più recente
- Gestione automatica della versione tramite `cache-updater.js`

**Manifest** (`manifest.json`):

- Icone SVG e PNG per tutti i dispositivi
- Possibilità di installazione su dispositivi mobili (Add to Home Screen)
- Configurazione standalone per un'esperienza simile a un'app
- Supporto per temi e colori

**Testare la modalità offline localmente.** Avviare il server, quindi aprire
`http://localhost:8080` (oppure la porta visualizzata):

```bash
npm run serve
```

Manualmente: disattivare la rete negli strumenti di sviluppo (scheda Rete,
modalità offline), quindi aggiornare la pagina. Dovrebbe apparire `offline.html`.

Automaticamente, con Puppeteer:

```bash
npm run test:pwa-offline
```

**Script di gestione del Service Worker**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Standard di qualità

**Strumenti per la qualità del codice**:

- **ESLint**: configurazione moderna con flat config (`eslint.config.js`), supporto ES2022
- **Prettier**: formattazione automatica del codice (`.prettierrc`)
- **Stylelint**: validazione CSS (`.stylelintrc.json`)
- **JSDoc**: documentazione automatica delle funzioni con analisi della copertura

**Regole importanti per il codice**:

- Eliminare le variabili e i parametri inutilizzati (`no-unused-vars`)
- Utilizzare una gestione specifica degli errori (nessun catch vuoto)
- Evitare `innerHTML` a favore delle funzioni `security-utils.js`
- Mantenere una complessità cognitiva < 15 per le funzioni
- Estrarre le funzioni complesse in helper più piccoli

**Sicurezza**:

- **Protezione XSS**: utilizzare le funzioni di `security-utils.js`:
  - `appendSanitizedHTML()` al posto di `innerHTML`
  - `createSafeElement()` per creare elementi sicuri
  - `setSafeMessage()` per il contenuto testuale
- **Script esterni**: attributo `crossorigin="anonymous"` obbligatorio
- **Validazione degli input**: sanitizzare sempre i dati esterni
- **Content Security Policy**: header CSP per limitare le origini degli script

**Accessibilità**:

- Conformità WCAG 2.1 AA
- Navigazione completa da tastiera
- Ruoli ARIA ed etichette appropriati
- Contrasti cromatici conformi

**Prestazioni**:

- Lazy loading dei moduli tramite `lazy-loader.js`
- Ottimizzazioni CSS e asset responsive
- Service Worker per una gestione intelligente della cache
- Code splitting e minificazione in produzione

## 📱 Compatibilità

### Browser supportati

L'interfaccia si basa su `oklch()` per i colori e su `:has()` per gli
stati contestuali, stabilendo i seguenti requisiti minimi:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispositivi

- **Desktop**: controlli tramite tastiera e mouse
- **Tablet**: interfaccia touch ottimizzata
- **Smartphone**: design responsive adattivo

### Accessibilità

- Navigazione completa tramite tastiera (Tab, frecce, Esc)
- Ruoli ARIA ed etichette per gli screen reader
- Contrasti cromatici conformi
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

**`npm run i18n:verify`** - Verificare la coerenza delle chiavi di traduzione

**`npm run i18n:unused`** - Elencare le chiavi di traduzione non utilizzate

**`npm run i18n:compare`** - Confrontare i file di traduzione con fr.json (riferimento)

Questo script (`scripts/compare-translations.cjs`) assicura la sincronizzazione di tutti i file di lingua:

**Funzionalità:**

- Rilevamento delle chiavi mancanti (presenti in fr.json ma assenti nelle altre lingue)
- Rilevamento delle chiavi aggiuntive (presenti nelle altre lingue ma non in fr.json)
- Identificazione dei valori vuoti (`""`, `null`, `undefined`, `[]`)
- Verifica della coerenza dei tipi (string vs array)
- Appiattimento delle strutture JSON nidificate in notazione puntata (es.: `arcade.multiMemory.title`)
- Generazione di un report dettagliato nella console
- Salvataggio del report JSON in `docs/translations-comparison-report.json`

**Esempio di output:**

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
- Progressione per modalità di gioco
- Punteggi e statistiche dei giochi arcade
- Impostazioni di personalizzazione

### Funzionalità tecniche

- Archiviazione locale (localStorage) con fallback
- Isolamento dei dati per utente
- Salvataggio automatico dei progressi
- Migrazione automatica dei dati precedenti

## 🐛 Segnalare un problema

I problemi possono essere segnalati tramite le issue di GitHub. Si prega di includere:

- Descrizione dettagliata del problema
- Passaggi per riprodurlo
- Browser e versione
- Screenshot, se pertinenti

## 💝 Sostenere il progetto

**[☕ Fare una donazione tramite PayPal](https://paypal.me/jls)**

## 📄 Licenza

Questo progetto è distribuito sotto licenza AGPL v3. Consultare il file `LICENSE` per maggiori dettagli.

---

_LeapMultix — applicazione educativa libera per imparare le quattro operazioni_

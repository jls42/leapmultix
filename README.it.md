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
- [Voce registrata](#-voce-registrata)
- [Archiviazione dei dati](#-archiviazione-dei-dati)
- [Segnalare un problema](#-segnalare-un-problema)
- [Licenza](#-licenza)

## Descrizione

LeapMultix è un'applicazione web educativa e interattiva pensata per bambini dai 6 ai 12 anni per padroneggiare le 4 operazioni aritmetiche: moltiplicazione (×), addizione (+), sottrazione (−) e divisione (÷). Offre **5 modalità di gioco** e **4 minigiochi arcade** all'interno di un'interfaccia intuitiva, accessibile e multilingue.

**Supporto multi-operazione:** le cinque modalità supportano tutte e quattro le operazioni. La selezione si effettua nella schermata iniziale ed è valida per l'intero percorso.

**Sviluppato da:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## 📸 Panoramica

### Le schermate

|                                                                                                                                      |                                                                                                                                        |
| :----------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: |
|                             ![Schermata « Chi gioca? »: scelta del profilo](docs/media/01-accueil.webp)                              |                      ![Menu principale: scelta dell'operazione e delle cinque modalità](docs/media/02-menu.webp)                       |
|                     **Chi gioca?** — un profilo per ciascun bambino, con il proprio avatar e i propri progressi.                     |                              **Il menu** — qui si sceglie l'operazione, poi si aprono le cinque modalità.                              |
|                     ![Modalità Scoperta: la tabellina del 4 mostrata con i punti](docs/media/03-decouverte.webp)                     |                    ![Modalità Quiz: risposta errata in rosso, risposta corretta in verde](docs/media/04-quiz.webp)                     |
|            **Scoperta** — ogni uguaglianza viene mostrata con punti, salti o conteggi, insieme al trucco della tabellina.            | **Quiz** — la scelta del bambino rimane visualizzata accanto alla risposta corretta e la spiegazione descrive in dettaglio il calcolo. |
|                           ![Modalità Sfida: conto alla rovescia e serie in corso](docs/media/05-defi.webp)                           |                 ![Modalità Avventura: mappa dei dieci livelli, con i successivi bloccati](docs/media/06-aventure.webp)                 |
| **Sfida** — corsa contro il tempo. In caso di errore, il cronometro si ferma per il tempo necessario a leggere la risposta corretta. |                        **Avventura** — dieci livelli che si sbloccano l'uno dopo l'altro, in cambio di stelle.                         |
|                                   ![Menu Arcade: i quattro minigiochi](docs/media/07-arcade.webp)                                    |                          ![Dashboard: stelle per tabellina e statistiche](docs/media/08-tableau-de-bord.webp)                          |
|                     **Arcade** — quattro minigiochi, con regolazione della difficoltà e scelta della navicella.                      |                          **Dashboard** — stelle per tabellina, tabelline da ripassare, punteggi per modalità.                          |
|                        ![Personalizzazione: avatar, temi, accessibilità](docs/media/09-personnalisation.webp)                        |                                                                                                                                        |
|                **Personalizzazione** — avatar, tema di colori, dimensione del testo, contrasto elevato, PIN genitori.                |                                                                                                                                        |

### I minigiochi arcade

Quattro giochi che pongono la stessa domanda — quella mostrata sopra l'area di
gioco, con il tempo rimanente e le vite — ma richiedono ogni volta un'azione
diversa.

|                                                                                                                                      |                                                                                                             |
| :----------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| ![MultiInvaders: mostri che trasportano numeri, una navicella nella parte inferiore dello schermo](docs/media/10-multiinvaders.webp) | ![MultiMiam: un labirinto in cui le pillole contengono le risposte possibili](docs/media/11-multimiam.webp) |
|            **MultiInvaders** — colpisci le risposte sbagliate, risparmia quella corretta: nasconde un amico da liberare.             |      **MultiMiam** — attraversa il labirinto per raccogliere il risultato corretto, evitando i mostri.      |
|        ![MultiMemory: una griglia di carte, due scoperte che mostrano un calcolo e un numero](docs/media/12-multimemory.webp)        |            ![MultiSnake: un serpente e mele numerate in un prato](docs/media/13-multisnake.webp)            |
|                      **MultiMemory** — ritrova a memoria quale carta riporta il risultato del calcolo scoperto.                      |                 **MultiSnake** — cresci mangiando i numeri giusti ed evita tutti gli altri.                 |

## ✨ Funzionalità

### 🎮 Modalità di Gioco

- **Modalità Scoperta**: Esplorazione visiva e interattiva adattata a ogni operazione
- **Modalità Quiz**: Domande a risposta multipla con supporto alle 4 operazioni (×, +, −, ÷) e progressione adattiva
- **Modalità Sfida**: Corsa contro il tempo con le 4 operazioni (×, +, −, ÷) e diversi livelli di difficoltà
- **Modalità Avventura**: Progressione narrativa a livelli con supporto alle 4 operazioni

### 🕹️ Minigiochi Arcade

- **MultiInvaders**: Space Invaders educativo - Distruggi le risposte errate
- **MultiMiam**: Pac-Man matematico - Raccogli le risposte corrette
- **MultiMemory**: Gioco di memoria - Abbina operazioni e risultati
- **MultiSnake**: Snake educativo - Cresci mangiando i numeri giusti

### ➕ Supporto Multi-Operazione

LeapMultix offre un allenamento completo sulle 4 operazioni aritmetiche in **tutte le modalità**:

| Modalità  | ×   | +   | −   | ÷   |
| --------- | --- | --- | --- | --- |
| Quiz      | ✅  | ✅  | ✅  | ✅  |
| Sfida     | ✅  | ✅  | ✅  | ✅  |
| Scoperta  | ✅  | ✅  | ✅  | ✅  |
| Avventura | ✅  | ✅  | ✅  | ✅  |
| Arcade    | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funzionalità Trasversali

- **Multiutente**: Gestione di profili individuali con progressi salvati
- **Multilingue**: Supporto per francese, inglese e spagnolo
- **Personalizzazione**: Avatar, temi di colore, sfondi
- **Accessibilità**: Navigazione da tastiera, supporto touch, conformità WCAG 2.1 AA
- **Voce registrata**: il gioco è in grado di leggere domande e incoraggiamenti con una voce di sintesi preregistrata, con fallback automatico sulla voce del dispositivo. Le voci non sono incluse in questo repository: il sito leapmultix.jls42.org include Lucie in francese, Sulafat in inglese e in spagnolo e, a scelta, Marie in francese e Jane in inglese (vedere [Voce registrata](#-voce-registrata))
- **Mobile responsive**: Interfaccia ottimizzata per tablet e smartphone
- **Sistema di progressione**: Punteggi, badge, sfide giornaliere

## 🚀 Avvio rapido

### Prerequisiti

- Node.js (versione 16 o superiore)
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

## 🧱 Architettura

### Struttura dei file

I moduli JavaScript sono **posizionati direttamente nella radice di `js/`**, a eccezione di tre cartelle:
`core/`, `components/` e `modes/`. È quindi il nome del file a definire il
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

### Architettura tecnica

**Moduli ES6 moderni**: Il progetto impiega un'architettura modulare con classi ES6 e import/export nativi.

**Componenti riutilizzabili**: Interfaccia realizzata con componenti UI centralizzati (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Caricamento intelligente dei moduli on-demand tramite `lazy-loader.js` per ottimizzare le prestazioni iniziali.

**Sistema di archiviazione unificato**: API centralizzata per la persistenza dei dati utente tramite LocalStorage con fallback.

**Gestione audio centralizzata**: Controllo del suono con supporto multilingue e preferenze per ciascun utente.

**Event Bus**: Comunicazione basata su eventi disaccoppiata tra componenti per un'architettura manutenibile.

**Navigazione a diapositive**: Sistema di navigazione basato su diapositive numerate (slide0, slide1, ecc.) con `goToSlide()`.

**Sicurezza**: Protezione XSS e sanificazione tramite `security-utils.js` per tutte le manipolazioni del DOM.

## 🎯 Modalità di gioco dettagliate

### Modalità Scoperta

Interfaccia di esplorazione visiva delle tabelline con:

- Visualizzazione interattiva delle moltiplicazioni
- Animazioni e promemoria
- Drag-and-drop educativo
- Progressione libera per tabellina

### Modalità Quiz

Domande a risposta multipla con:

- 10 domande per sessione
- Progressione adattiva in base ai successi
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
- Storia immersiva con personaggi
- Sistema di stelle e ricompense

### Minigiochi Arcade

Ciascun minigioco offre:

- Scelta della difficoltà e personalizzazione
- Sistema di vite e punteggio
- Controlli da tastiera e touch
- Classifiche individuali per utente

## 🔧 Sviluppo

### Flusso di lavoro per lo sviluppo

**Non effettuare mai commit direttamente su main.** Il progetto lavora per rami di
funzionalità.

**1. Creare un branch**, `feat/` per una funzionalità, `fix/` per un fix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Sviluppare e verificare.** La formattazione viene prima: la CI la rifiuterà
ancor prima di eseguire i test.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Eseguire il commit sul branch**, poi effettuarne il push:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Aprire una pull request** e attendere i controlli: verify, Codacy,
CodeFactor e SonarCloud. Si effettuano correzioni fino al via libera verde prima del merge.

**Stile dei commit**: Messaggi concisi, modo imperativo (es.: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Assicurarsi che `npm run lint`, `npm test` e `npm run test:coverage` passino prima di ogni commit

### Architettura dei componenti

**GameMode (classe base)**: Tutte le modalità ereditano da una classe comune con metodi standardizzati.

**GameModeManager**: Gestione e orchestrazione centralizzata dell'avvio delle modalità.

**Componenti UI**: TopBar, InfoBar, Dashboard e Customization forniscono un'interfaccia coerente.

**Lazy Loading**: I moduli vengono caricati on-demand per ottimizzare le prestazioni iniziali.

**Event Bus**: Comunicazione disaccoppiata tra componenti tramite il sistema a eventi.

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

- **Rollup**: Bundle di `js/main-es6.js` in ESM con code-splitting e sourcemap
- **Terser**: Minificazione automatica per l'ottimizzazione
- **Post-build**: Copia di `css/` e `assets/`, delle favicon (`favicon.ico`, `favicon.png`, `favicon.svg`), di `sw.js`, e riscrittura di `dist/index.html` verso il file di ingresso con hash (es.: `main-es6-*.js`)
- **Cartella finale**: `dist/` pronta per essere servita staticamente

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continuous Integration

**GitHub Actions**: `.github/workflows/ci.yml`, attivato a ogni push su
`main` e a ogni pull request.

**`verify`** — il quality gate bloccante:

- `npm ci` e poi `npm run verify` (ESLint, test Jest, copertura)
- `npm run format:check` (Prettier)

**`seo-report`** — dopo `verify`: audit Lighthouse del sito online, per
monitorare le metriche SEO nel tempo.

**Analisi esterne** collegate alle pull request: Codacy, CodeFactor e
SonarCloud. Il quality gate di SonarCloud richiede voti A in affidabilità, sicurezza e
manutenibilità sul codice nuovo.

**Distribuzione**: `./deploy.sh` sincronizza il sito su S3 e invalida la cache
di CloudFront. Lo script rigenera, se necessario, le immagini responsive non incluse in git.

### PWA (Progressive Web App)

LeapMultix è una PWA completa dotata di supporto offline e possibilità di installazione.

**Service Worker** (`sw.js`):

- Navigazione: Network-first con fallback offline verso `offline.html`
- Immagini: Cache-first per ottimizzare le prestazioni
- Traduzioni: Stale-while-revalidate per l'aggiornamento in background
- JS/CSS: Network-first per fornire sempre la versione più recente
- Gestione automatica delle versioni tramite `cache-updater.js`

**Manifest** (`manifest.json`):

- Icone SVG e PNG per tutti i dispositivi
- Installazione possibile su dispositivi mobili (Add to Home Screen)
- Configurazione standalone per un'esperienza app-like
- Supporto a temi e colori

**Testare la modalità offline in locale.** Avviare il server, quindi aprire
`http://localhost:8080` (o la porta visualizzata):

```bash
npm run serve
```

Manualmente: disattivare la rete negli strumenti di sviluppo (scheda Rete,
modalità offline), quindi aggiornare la pagina. Deve essere visualizzato `offline.html`.

Automaticamente, tramite Puppeteer:

```bash
npm run test:pwa-offline
```

**Script di gestione del Service Worker**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Standard di qualità

**Strumenti di qualità del codice**:

- **ESLint**: Configurazione moderna con flat config (`eslint.config.js`), supporto ES2022
- **Prettier**: Formattazione automatica del codice (`.prettierrc`)
- **Stylelint**: Validazione CSS (`.stylelintrc.json`)
- **JSDoc**: Documentazione automatica delle funzioni con analisi della copertura

**Regole di codice importanti**:

- Rimuovere le variabili e i parametri non utilizzati (`no-unused-vars`)
- Utilizzare una gestione degli errori specifica (nessun catch vuoto)
- Evitare `innerHTML` a favore delle funzioni `security-utils.js`
- Mantenere una complessità cognitiva < 15 per le funzioni
- Estrarre le funzioni complesse in helper più piccoli

**Sicurezza**:

- **Protezione XSS**: Utilizzare le funzioni di `security-utils.js`:
  - `appendSanitizedHTML()` al posto di `innerHTML`
  - `createSafeElement()` per creare elementi sicuri
  - `setSafeMessage()` per il contenuto testuale
- **Script esterni**: Attributo `crossorigin="anonymous"` obbligatorio
- **Validazione degli input**: Sanificare sempre i dati esterni
- **Content Security Policy**: Header CSP per limitare le origini degli script

**Accessibilità**:

- Conformità WCAG 2.1 AA
- Navigazione completa da tastiera
- Ruoli ARIA e label appropriati
- Contrasti di colore conformi

**Prestazioni**:

- Lazy loading dei moduli tramite `lazy-loader.js`
- Ottimizzazioni CSS e asset reattivi
- Service Worker per memorizzazione intelligente nella cache
- Code splitting e minificazione in produzione

## 📱 Compatibilità

### Browser supportati

L'interfaccia si basa su `oklch()` per i colori e su `:has()` per gli
stati contestuali, il che stabilisce i requisiti minimi:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispositivi

- **Desktop**: Controlli tramite tastiera e mouse
- **Tablet**: Interfaccia touch ottimizzata
- **Smartphone**: Design reattivo adattivo

### Accessibilità

- Navigazione completa da tastiera (Tab, frecce, Esc)
- Ruoli ARIA e label per screen reader
- Contrasti di colore conformi
- Supporto per le tecnologie assistive

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

Questo script (`scripts/compare-translations.cjs`) garantisce la sincronizzazione di tutti i file di lingua:

**Funzionalità:**

- Rilevamento delle chiavi mancanti (presenti in fr.json ma assenti in altre lingue)
- Rilevamento delle chiavi aggiuntive (presenti in altre lingue ma non in fr.json)
- Identificazione dei valori vuoti (`""`, `null`, `undefined`, `[]`)
- Verifica della coerenza dei tipi (string vs array)
- Appiattimento delle strutture JSON nidificate in notazione a punti (es: `arcade.multiMemory.title`)
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
- Descrizioni e guida contestuale
- Contenuto narrativo della modalità Avventura
- Label di accessibilità e ARIA

## 🔊 Voce registrata

Il gioco legge ad alta voce le domande, gli incoraggiamenti e le spiegazioni. Pronuncia solo un insieme finito di frasi, circa 7.400 per lingua: possono quindi essere registrate una volta per tutte, e nessuna partita chiama poi un servizio di sintesi. Senza clip, il gioco legge con la voce del dispositivo.

### In questo repository: l'applicazione, senza le voci

Il codice sa leggere clip preregistrate e include la pipeline che le genera. Le clip non sono presenti, così come non lo sono le chiavi dei fornitori: un fork o un'installazione locale legge con la voce del dispositivo.

- **Fallback automatico** sulla voce del dispositivo, frase per frase: clip assente o in errore, riproduzione rifiutata dal browser, clip che non si avvia entro 1,5 s o offline senza la clip in cache.
- **Impostazioni**: il pulsante della voce nella barra in alto attiva o disattiva la lettura; la casella «Voce registrata» (Accessibilità e controlli) sceglie tra la voce registrata e la voce del dispositivo. Compare solo nelle lingue in cui è pubblicata una voce.
- **Offline**: le clip già ascoltate rimangono in cache (service worker).
- **Dove il gioco cerca le clip**: nel tag `<meta name="leapmultix-voice-base">`, vuoto nel repository. Solo il deployment di produzione vi inserisce `/voice/`.

Con le proprie clip sul computer (generate dalla pipeline sottostante, collocate accanto al gioco in `../leapmultix-voices`), il parametro `?voix=local` le fa riprodurre dal server di sviluppo:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Su leapmultix.jls42.org: le voci dell'hosting

Il sito offerto dall'autore fornisce voci di sintesi registrate:

- in francese, **Lucie**, creata con ElevenLabs (modello Eleven v3);
- in inglese britannico e in spagnolo di Spagna, **Sulafat**, creata con Google Cloud Text-to-Speech (voce Chirp 3 HD);
- a scelta del giocatore, **Marie** in francese e **Jane** in inglese, create con Mistral AI (Voxtral TTS).

Le clip risiedono in un repository privato e in un bucket S3 dedicato, distribuito da CloudFront su `/voice/*`. Nelle impostazioni, il menu «Voce» propone le voci della lingua quando ne sono disponibili più di una, e la dicitura riporta il nome del servizio della voce ascoltata.

### Generare le clip

La pipeline è programmata tramite script in `scripts/voice/` e viene eseguita sulla postazione del proprietario, mai nella CI pubblica. Le chiavi dei fornitori (ElevenLabs per il francese, Google Cloud Text-to-Speech per l'inglese e lo spagnolo, Mistral per Marie e Jane) rimangono in un file `.env` esterno al repository, passato tramite `node --env-file`: nessuna chiave entra in git. La skill di Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) descrive la procedura passo dopo passo (controlli, accordi, riprese); i dettagli sono in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Stimare** le frasi rimanenti e i caratteri da pagare (Eleven v3: circa 0,53 crediti per carattere; Chirp 3 HD: 30 $ per milione di caratteri, con il primo milione al mese gratuito; Voxtral TTS: 16 $ per milione).
2. **Generare**. Rilanciare lo stesso comando riprende ciò che manca. Quando i crediti si esauriscono, lo script si arresta correttamente (codice 3) senza lasciare file scritti a metà. `--max-total-chars` limita la spesa cumulativa della versione: ogni risposta a pagamento viene registrata non appena ricevuta in un registro, che sopravvive a un arresto anomalo. Per Google e Mistral, che non forniscono alcun saldo leggibile, è l'unica protezione.
3. **Controllare**: ogni frase ha la sua clip e ogni MP3 è valido. Whisper trascrive quindi ogni clip localmente e il controllo segnala i numeri ascoltati male e le durate anomale. `voice:review` concatena Whisper, questo controllo e la pagina di ascolto in un unico comando.
4. **Ascoltare** sulla pagina di ascolto (`voice:listen`) le clip segnalate e un campione di forme femminili («une fois 7»), che Whisper non distingue. Ogni clip ha una casella «da rifare», che la aggiunge all'elenco delle clip scartate.
5. **Rifare** le clip scartate (`--redo`) e rilanciare Whisper, quindi confrontare ogni clip prima e dopo su una seconda pagina. Una clip ancora recitata male dopo due o tre tentativi riceve un testo imposto in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), ad esempio il numero scritto in lettere.
6. **Pubblicare** le clip, verificare che rispondano online, quindi pubblicare l'indice della lingua, prima per i tester (`?voix=test`).
7. **Aprire** la voce a tutti, quindi attivarla per impostazione predefinita. L'interruttore di emergenza (`voice:publish -- remove`) rimuove una lingua dall'indice: il gioco torna alla voce del dispositivo.

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

### Regola: una frase parlata modificata va registrata nuovamente prima del rilascio in produzione

Ogni frase parlata proviene dalle traduzioni (`assets/translations/{fr,en,es}.json`) e fa parte del corpus. La modifica di una frase pronunciata fa quindi fallire il test del blocco del corpus (`scripts/voice/corpus.lock.json`). Per una lingua che dispone di una voce registrata, si generano quindi le clip delle frasi modificate, si controllano e si ascoltano, per poi pubblicarle **prima** di effettuare il merge. Infine, si aggiorna il blocco (`npm run voice:corpus:lock`). Senza queste clip, la frase modificata viene letta con la voce del dispositivo.

## 📊 Archiviazione dei dati

### Dati utente

- Profili e preferenze
- Progressi per modalità di gioco
- Punteggi e statistiche dei giochi arcade
- Impostazioni di personalizzazione

### Funzionalità tecniche

- Archiviazione locale (localStorage) con fallback
- Isolamento dei dati per utente
- Salvataggio automatico dei progressi
- Migrazione automatica dei vecchi dati

## 🐛 Segnalare un problema

I problemi possono essere segnalati tramite le issue di GitHub. Si prega di includere:

- Descrizione dettagliata del problema
- Passaggi per riprodurlo
- Browser e versione
- Screenshot pertinenti

## 💝 Sostenere il progetto

**[☕ Fai una donazione tramite PayPal](https://paypal.me/jls)**

## 📄 Licenza

Questo progetto è distribuito con licenza AGPL v3. Consulta il file `LICENSE` per maggiori dettagli.

---

_LeapMultix — applicazione educativa libera per imparare le quattro operazioni_

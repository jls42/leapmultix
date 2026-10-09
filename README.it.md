<details>
<summary>Questo documento è disponibile anche in altre lingue</summary>

- [Inglese](./README.en.md)
- [Spagnolo](./README.es.md)
- [Portoghese](./README.pt.md)
- [Tedesco](./README.de.md)
- [Cinese](./README.zh.md)
- [Hindi](./README.hi.md)
- [Arabo](./README.ar.md)
- [Italiano](./README.it.md)
- [Svedese](./README.sv.md)
- [Polacco](./README.pl.md)
- [Olandese](./README.nl.md)
- [Rumeno](./README.ro.md)
- [Giapponese](./README.ja.md)
- [Coreano](./README.ko.md)

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
[![Code Smell](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
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
- [Voce registrata](#-voce-registrata)
- [Archiviazione dei dati](#-archiviazione-dei-dati)
- [Segnalare un problema](#-segnalare-un-problema)
- [Licenza](#-licenza)

## Descrizione

LeapMultix è un'applicazione web educativa interattiva destinata ai bambini dai 6 ai 12 anni, pensata per aiutarli a padroneggiare le 4 operazioni aritmetiche: moltiplicazione (×), addizione (+), sottrazione (−) e divisione (÷). Offre **6 modalità di gioco** e **4 minigiochi arcade** in un'interfaccia intuitiva, accessibile e multilingue.

**Supporto multi-operazione:** tutte le modalità accettano le quattro operazioni. La scelta viene effettuata nella schermata iniziale e si applica all'intero percorso.

**Sviluppato da:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## 📸 Panoramica

### Le schermate

|                                                                                                                                                  |                                                                                                                                       |
| :----------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: |
|                                    ![Schermata «Chi gioca?»: scelta del profilo](docs/media/01-accueil.webp)                                     |                     ![Menu principale: scelta dell'operazione e della modalità di gioco](docs/media/02-menu.webp)                     |
|                               **Chi gioca?** — un profilo per ogni bambino, con il suo avatar e i suoi progressi.                                |                                **Il menu** — qui si sceglie l'operazione, quindi la modalità di gioco.                                |
|                          ![Modalità Scoperta: la tabellina del 4 mostrata con dei punti](docs/media/03-decouverte.webp)                          |                    ![Modalità Quiz: risposta errata in rosso, risposta corretta in verde](docs/media/04-quiz.webp)                    |
|                  **Scoperta** — ogni uguaglianza viene mostrata con punti, salti o conteggi, insieme al trucco della tabellina.                  | **Quiz** — la scelta del bambino resta visualizzata accanto alla risposta corretta e la spiegazione illustra in dettaglio il calcolo. |
|                                 ![Modalità Sfida: conto alla rovescia e serie in corso](docs/media/05-defi.webp)                                 |                ![Modalità Avventura: mappa dei dieci livelli, con i successivi bloccati](docs/media/06-aventure.webp)                 |
|           **Sfida** — corsa contro il tempo. In caso di errore, il cronometro si ferma per consentire di leggere la risposta corretta.           |                          **Avventura** — dieci livelli che si aprono uno dopo l'altro, in cambio di stelle.                           |
|                    ![Modalità Cronometro: una gara di sottrazione, il cronometro e l'avanzamento](docs/media/14-chrono.webp)                     |                                    ![Menu Arcade: i quattro minigiochi](docs/media/07-arcade.webp)                                    |
| **Cronometro** — dieci risposte corrette contro il tempo, nell'operazione scelta; i calcoli sbagliati vengono aggiunti a un elenco da ripassare. |                      **Arcade** — quattro minigiochi, con regolazione della difficoltà e scelta dell'astronave.                       |
|            ![Dashboard: partite, record e risposte di ogni modalità, dettagliati per operazione](docs/media/08-tableau-de-bord.webp)             |                        ![Personalizzazione: avatar, temi, accessibilità](docs/media/09-personnalisation.webp)                         |
|      **Dashboard** — partite e record di ogni modalità, dettagliati per operazione; stelle e tabelline da ripassare per la moltiplicazione.      |          **Personalizzazione** — avatar da sbloccare con le monete, tema cromatico, dimensione del testo, contrasto elevato.          |

### I minigiochi arcade

Quattro giochi che pongono la stessa domanda — quella visualizzata sopra l'area di
gioco, insieme al tempo rimanente e alle vite — ma richiedono ogni volta un'azione
diversa.

|                                                                                                                                      |                                                                                                           |
| :----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
| ![MultiInvaders: mostri che mostrano numeri, con un'astronave nella parte inferiore dello schermo](docs/media/10-multiinvaders.webp) | ![MultiMiam: un labirinto in cui le palline mostrano le possibili risposte](docs/media/11-multimiam.webp) |
|          **MultiInvaders** — sparare alle risposte sbagliate e risparmiare quella corretta: nasconde un amico da liberare.           |    **MultiMiam** — attraversare il labirinto per raccogliere il risultato corretto, evitando i mostri.    |
|    ![MultiMemory: una griglia di carte, due delle quali scoperte mostrano un calcolo e un numero](docs/media/12-multimemory.webp)    |           ![MultiSnake: un serpente e mele numerate in un prato](docs/media/13-multisnake.webp)           |
|                          **MultiMemory** — ricordare quale carta mostra il risultato del calcolo scoperto.                           |             **MultiSnake** — crescere mangiando i numeri corretti ed evitare tutti gli altri.             |

## ✨ Funzionalità

### 🎮 Modalità di gioco

- **Modalità Scoperta**: esplorazione visiva e interattiva adattata a ogni operazione
- **Modalità Quiz**: domande a scelta multipla con supporto delle 4 operazioni (×, +, −, ÷) e progressione adattiva
- **Modalità Sfida**: corsa contro il tempo con le 4 operazioni (×, +, −, ÷) e diversi livelli di difficoltà
- **Modalità Avventura**: progressione narrativa a livelli con supporto delle 4 operazioni
- **Modalità Cronometro**: 10 risposte corrette contro un cronometro che non si ferma, per battere il proprio tempo migliore, con le 4 operazioni (×, +, −, ÷)

### 🕹️ Minigiochi Arcade

- **MultiInvaders**: Space Invaders educativo - Distruggere le risposte sbagliate
- **MultiMiam**: Pac-Man matematico - Raccogliere le risposte corrette
- **MultiMemory**: gioco di memoria - Associare operazioni e risultati
- **MultiSnake**: Snake educativo - Crescere mangiando i numeri corretti

### ➕ Supporto multi-operazione

LeapMultix offre un allenamento completo sulle 4 operazioni aritmetiche in **tutte le modalità**:

| Modalità   | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Sfida      | ✅  | ✅  | ✅  | ✅  |
| Scoperta   | ✅  | ✅  | ✅  | ✅  |
| Avventura  | ✅  | ✅  | ✅  | ✅  |
| Cronometro | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funzionalità trasversali

- **Multiutente**: un profilo per ogni bambino, con i suoi progressi; su una postazione scolastica, nomi ordinati, filtro a partire da 10 giocatori, cestino di 30 giorni e salvataggio dei giocatori in un file
- **Multilingue**: supporto per francese, inglese e spagnolo
- **Personalizzazione**: avatar (il primo a scelta, gli altri sbloccati con le monete guadagnate giocando, 50 monete ciascuno), temi cromatici, sfondi
- **Accessibilità**: navigazione completa da tastiera, supporto touch, pausa nell'Arcade, dimensione del testo e contrasto elevato; verificata con axe-core, senza violazioni WCAG di livello A o AA nelle schermate esaminate
- **Voce registrata**: il gioco può leggere domande e incoraggiamenti con una voce sintetica preregistrata, passando automaticamente alla voce del dispositivo quando necessario. Le voci non sono incluse in questo repository: il sito leapmultix.jls42.org utilizza Lucie in francese, Sulafat in inglese e spagnolo e, a scelta, Sulafat e Marie in francese, Jane in inglese (vedere [Voce registrata](#-voce-registrata))
- **Mobile responsive**: interfaccia ottimizzata per tablet e smartphone
- **Sistema di progressione**: dashboard per profilo (partite, record e tabelline da ripassare, dettagliati per operazione), badge, sfide quotidiane, monete (in Cronometro, Avventura, Sfida e nella Sfida del giorno)

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
npm run test:pwa-offline # Hors ligne de bout en bout (Puppeteer, serveur intégré)

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

I moduli JavaScript sono **disposti senza sottocartelle in `js/`**, fatta eccezione per tre cartelle:
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
│   │   ├── audio.js, theme.js                # Son, thèmes
│   │   ├── eventBus.js, mainInit.js          # Événements, amorçage DOM
│   │   ├── adventure-data.js                 # Niveaux du mode Aventure
│   │   ├── mult-stats.js, challenge-stats.js, operation-stats.js
│   │   ├── chrono-stats.js, chrono-questions.js, chrono-input.js   # Mode Chrono
│   │   ├── mode-stats.js, adventure-progress.js   # Compteurs du tableau de bord
│   │   ├── profile-operation-stats.js        # Statistiques par calcul, rangées dans le profil
│   │   ├── players-trash.js, players-backup.js   # Corbeille et sauvegarde des joueurs
│   │   ├── avatar-shop.js                    # Avatars débloqués avec les pièces (prix, achat)
│   │   ├── daily-challenge.js, tablePreferences.js, stats-migration.js
│   │   ├── userUi.js, utils.js               # Utilitaires (source canonique)
│   │   └── operations/                       # Une classe par opération
│   │       ├── Operation.js, OperationRegistry.js
│   │       └── Multiplication.js, Addition.js, Subtraction.js, Division.js
│   ├── components/         # Composants d'interface
│   │   ├── topBar.js, infoBar.js, dashboard.js, customization.js
│   │   ├── operationSelector.js, operationModeAvailability.js
│   │   ├── playerTools.js  # « Qui joue ? » sur un poste de classe : filtre, corbeille, sauvegarde
│   │   ├── loadErrorNotice.js   # Avis d'un jeu qui n'a pas pu s'ouvrir (hors ligne…)
│   │   ├── confirm-dialog.js, avatarShop.js   # Fenêtre de confirmation du jeu, boutique d'avatars
│   │   └── icons.js, tableSettingsModal.js
│   ├── modes/              # Les six modes de jeu
│   │   ├── DiscoveryMode.js, QuizMode.js, ChallengeMode.js
│   │   └── AdventureMode.js, ChronoMode.js, ArcadeMode.js
│   ├── arcade*.js          # Orchestrateur et briques communes des mini-jeux (temps et pause :
│   │                       #   arcade-time.js ; plein écran : arcade-fullscreen.js)
│   ├── multimiam*.js       # Mini-jeu Pac-Man (moteur, rendu, contrôles…)
│   ├── multisnake.js       # Mini-jeu Snake
│   ├── i18n.js, i18n-store.js                # Internationalisation
│   ├── security-utils.js, error-handlers.js, logger.js
│   ├── accessibility.js, keyboard-navigation.js, touch-support.js, speech.js
│   ├── voice-clips.js      # Lecteur de la voix enregistrée (repli : speech.js)
│   ├── slides.js, mode-orchestrator.js, lazy-loader.js, game-cleanup.js
│   ├── game-exit.js        # Une seule règle pour quitter une partie en cours
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
│   ├── precache-list.mjs   # Liste de préchargement hors ligne de sw.js (npm run precache:update)
│   └── voice/              # Voix enregistrée : corpus, génération, écoute, publication
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### Architettura tecnica

**Moduli ES6 moderni**: il progetto utilizza un'architettura modulare con classi ES6 e import/export nativi.

**Componenti riutilizzabili**: interfaccia costruita con componenti UI centralizzati (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: caricamento intelligente dei moduli su richiesta tramite `lazy-loader.js` per ottimizzare le prestazioni iniziali.

**Sistema di archiviazione unificato**: API centralizzata per la persistenza dei dati utente tramite LocalStorage con fallback.

**Gestione audio centralizzata**: controllo dell'audio con supporto multilingue e preferenze per utente.

**Event Bus**: comunicazione basata su eventi e disaccoppiata tra i componenti, per un'architettura manutenibile.

**Navigazione tramite slide**: sistema di navigazione basato su slide numerate (slide0, slide1, ecc.) con `goToSlide()`.

**Sicurezza**: protezione XSS e sanitizzazione tramite `security-utils.js` per tutte le manipolazioni del DOM.

## 🎯 Modalità di gioco dettagliate

### Modalità Scoperta

Interfaccia di esplorazione visiva, adattata a ogni operazione, con:

- Visualizzazione interattiva delle moltiplicazioni
- Animazioni e promemoria
- Trascinamento educativo
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
- Mappa interattiva con avanzamento visivo
- Storia coinvolgente con personaggi
- Sistema di stelle e ricompense

### Modalità Cronometro

Dieci risposte corrette nel minor tempo possibile, contro un cronometro che non si ferma:

- Le quattro operazioni: le tabelline (configurate nelle Impostazioni delle tabelline) e
  tutte le tabelle di addizione (7 + k), sottrazione ((7 + k) − 7) e divisione ((7 × k) ÷ 7)
- Risposta a scelta o tramite tastierino numerico, con clic o tastiera
- Tempi migliori, tempo medio e grafico delle ultime partite, per operazione
- «I miei calcoli da ripassare»: un elenco per operazione, ripassato in entrambe le direzioni (6 × 7 e 7 × 6,
  15 − 7 e 15 − 8)

### Dashboard

Ciò a cui il bambino ha effettivamente giocato, profilo per profilo:

- Stelle dell'Avventura e tabelline da ripassare (ultime 20 risposte di ogni tabellina)
- Domande e risposte corrette in Quiz, Sfida, Avventura e Cronometro
- Partite e record di ogni modalità e di ogni minigioco, inclusi gli abbandoni, dettagliati per operazione
  non appena il bambino ne pratica più di una

### Minigiochi Arcade

Ogni minigioco offre:

- Tre livelli di difficoltà, nelle quattro operazioni
- Sistema di vite e punteggio
- Comandi con mouse, tastiera e tocco, descritti nella scheda del gioco
- Pausa: pulsante accanto al tempo o tasto P; il gioco entra in pausa anche quando la scheda è
  nascosta e non riprende mai da solo
- MultiMemory: una partita senza limite di tempo, facoltativa
- Tabellone adattato allo spazio disponibile (più alto che largo su un telefono in verticale) e a schermo intero,
  sia su computer sia su telefono, anche con il telefono ruotato (tranne su iPhone, il cui browser
  non lo consente)
- Punteggi migliori di ogni giocatore; «Azzera» indica tutto ciò che elimina

## 🔧 Sviluppo

### Workflow di sviluppo

**Non effettuare mai commit direttamente su main.** Il progetto utilizza branch di
funzionalità.

**1. Creare un branch**, `feat/` per una funzionalità, `fix/` per una correzione:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Sviluppare e verificare.** La formattazione viene prima di tutto: la CI la rifiuta
prima ancora di eseguire i test.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Effettuare il commit sul branch**, quindi eseguire il push:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Aprire una pull request** e attendere le analisi: verify, Codacy,
CodeFactor e SonarCloud. Correggere i problemi finché tutti i controlli non sono verdi, prima di eseguire il merge.

**Stile dei commit**: messaggi concisi, modo imperativo (es.: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: assicurarsi che `npm run lint`, `npm test` e `npm run test:coverage` vengano completati correttamente prima di ogni commit

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

- **Rollup**: bundle di `js/main-es6.js` in ESM con code-splitting e sourcemap
- **Terser**: minificazione automatica per l'ottimizzazione
- **Post-build**: copia di `css/` e `assets/`, delle favicon (`favicon.ico`, `favicon.png`, `favicon.svg`), di `sw.js` e riscrittura di `dist/index.html` verso il file di ingresso con hash (es.: `main-es6-*.js`)
- **Cartella finale**: `dist/` pronta per essere servita staticamente

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integrazione continua

**GitHub Actions**: `.github/workflows/ci.yml`, attivato a ogni push su
`main` e a ogni pull request.

**`verify`** — il quality gate bloccante:

- `npm ci` poi `npm run verify` (ESLint, test Jest, copertura)
- `npm run format:check` (Prettier)

**`seo-report`** — dopo `verify`: audit Lighthouse del sito online, per
monitorare nel tempo le metriche SEO.

**Analisi esterne** collegate alle pull request: Codacy, CodeFactor e
SonarCloud. Il quality gate SonarCloud richiede valutazioni A in affidabilità, sicurezza e
manutenibilità per il codice nuovo.

**Distribuzione**: `./deploy.sh` sincronizza il sito con S3 e invalida la cache
CloudFront. Se necessario, lo script rigenera le immagini responsive assenti da git.

### PWA (Progressive Web App)

LeapMultix è una PWA completa con supporto offline e possibilità di installazione.

**Service Worker** (`sw.js`):

- Installazione: precaricamento di tutto ciò che il gioco richiede, con un elenco prodotto dal codice
  tramite `scripts/precache-list.mjs` (`npm run precache:update`, verificato dai test): dopo
  una prima visita, le 6 modalità e i 4 giochi Arcade si avviano offline
- Navigazione: Network-first, con un limite di 4 s: oltre questo limite (una rete che non risponde: wifi della scuola, captive portal) o offline, viene usata la pagina del gioco nella cache (`offline.html` solo per una pagina mai memorizzata)
- Immagini: Cache-first; offline, viene usata un'altra dimensione dello stesso sprite o un altro sfondo dello stesso avatar
- Traduzioni: Stale-while-revalidate per l'aggiornamento in background
- JS/CSS: quelli di questa versione (indirizzi con `?v=`, quelli di un sito pubblicato) arrivano prima dalla loro copia precaricata, della stessa versione per costruzione: il server ignora `?v=` e, dopo una pubblicazione, servirebbe altrimenti un'altra versione. Gli altri (senza `?v=` in sviluppo): Network-first, con lo stesso limite di 4 s prima della copia di questa versione
- Suoni e font: Cache-first, con intervalli di byte serviti (lettore audio di Safari)
- Gestione automatica della versione tramite `cache-updater.js`

**Manifest** (`manifest.json`):

- Icone SVG e PNG per tutti i dispositivi
- Possibilità di installazione su dispositivi mobili (Add to Home Screen)
- Configurazione standalone per un'esperienza simile a un'app
- Supporto di temi e colori

**Testare localmente la modalità offline.** Avviare il server, quindi aprire
`http://localhost:8080` (o la porta visualizzata):

```bash
npm run serve
```

Manualmente: lasciare la pagina aperta finché il service worker non registra il gioco, arrestare
il server (o disattivare la rete del dispositivo), quindi aggiornare la pagina. Il gioco deve
essere visualizzato e ogni modalità deve avviarsi.

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

- Eliminare variabili e parametri non utilizzati (`no-unused-vars`)
- Utilizzare una gestione specifica degli errori (nessun catch vuoto)
- Evitare `innerHTML` a favore delle funzioni `security-utils.js`
- Mantenere una complessità cognitiva < 15 per le funzioni
- Estrarre le funzioni complesse in helper più piccoli

**Sicurezza**:

- **Protezione XSS**: utilizzare le funzioni di `security-utils.js`:
  - `appendSanitizedHTML()` invece di `innerHTML`
  - `createSafeElement()` per creare elementi sicuri
  - `setSafeMessage()` per il contenuto testuale
- **Script esterni**: attributo `crossorigin="anonymous"` obbligatorio
- **Validazione degli input**: sanitizzare sempre i dati esterni
- **Content Security Policy**: header CSP per limitare le fonti degli script

**Accessibilità**:

- Obiettivo WCAG 2.1 livello AA, verificato con axe-core: nessuna violazione di livello A o AA, né delle
  buone pratiche
- Navigazione completa da tastiera
- Ruoli ARIA e nomi accessibili
- Contrasti verificati da axe-core

**Prestazioni**:

- Lazy loading dei moduli tramite `lazy-loader.js`
- Ottimizzazioni CSS e asset responsive
- Service Worker per una gestione intelligente della cache
- Code splitting e minificazione in produzione

## 📱 Compatibilità

### Browser supportati

L'interfaccia si basa su `oklch()` per i colori e su `:has()` per gli
stati contestuali, stabilendo così i requisiti minimi:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispositivi

- **Desktop**: controlli da tastiera e mouse
- **Tablet**: interfaccia touch ottimizzata
- **Smartphone**: design responsive adattivo

### Accessibilità

- Navigazione completa da tastiera: Tab, frecce nelle griglie delle risposte e nelle carte di
  MultiMemory, Invio, Esc; link «Vai alle modalità di gioco» nella parte superiore della pagina iniziale
- Un'unica regola per abbandonare una partita: «Abbandona», Esc o un pulsante della barra superiore
  pongono la stessa domanda e la partita continua se il bambino rifiuta
- Lettori di schermo: ogni risposta è associata alla relativa domanda, un titolo di livello 1 per schermata, i
  messaggi vengono annunciati
- La pagina può essere ingrandita con le dita (al di fuori dei giochi Arcade); dimensione del testo, contrasto elevato,
  animazioni ridotte e un font di lettura derivato da Andika, progettato per i lettori
  principianti
- Arcade: pausa (pulsante, tasto P o scheda nascosta); MultiMemory senza limite di tempo, a scelta
- Verificata con axe-core (WCAG da 2.0 a 2.2, livelli A e AA e buone pratiche): nessuna
  violazione su 41 schermate in larghezza desktop e 40 in larghezza telefono (390 px), inclusi il tema
  Notte e il contrasto elevato

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

- Rilevamento delle chiavi mancanti (presenti in fr.json ma assenti nelle altre lingue)
- Rilevamento delle chiavi aggiuntive (presenti nelle altre lingue ma non in fr.json)
- Identificazione dei valori vuoti (`""`, `null`, `undefined`, `[]`)
- Verifica della coerenza dei tipi (string vs array)
- Appiattimento delle strutture JSON annidate in notazione puntata (es.: `arcade.multiMemory.title`)
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
- Messaggi di errore e feedback
- Descrizioni e guida contestuale
- Contenuto narrativo della modalità Avventura
- Etichette di accessibilità e ARIA

## 🔊 Voce registrata

Il gioco legge ad alta voce le domande, gli incoraggiamenti e le spiegazioni. Pronuncia solo un insieme finito di frasi, circa 7.400 per lingua: possono quindi essere registrate una volta per tutte e, in tal caso, nessuna partita richiama un servizio di sintesi. In assenza di clip, il gioco utilizza la voce del dispositivo.

### In questo repository: l'applicazione, senza le voci

Il codice è in grado di riprodurre clip preregistrate e contiene la pipeline che le produce. Le clip non sono incluse, così come le chiavi dei fornitori: un fork o un'installazione locale utilizza la voce del dispositivo.

- **Fallback automatico** sulla voce del dispositivo, frase per frase: clip assente o con errore, riproduzione rifiutata dal browser, clip che non si avvia entro 1,5 s oppure modalità offline senza la clip nella cache.
- **Impostazioni**: il pulsante della voce nella barra superiore attiva o disattiva la lettura; la casella «Voce registrata» (Accessibilità e controlli) consente di scegliere tra la voce registrata e quella del dispositivo. Compare solo nelle lingue per le quali è pubblicata una voce.
- **Offline**: le clip già ascoltate rimangono nella cache (service worker).
- **Dove il gioco cerca le clip**: nel tag `<meta name="leapmultix-voice-base">`, vuoto nel repository. Solo la distribuzione in produzione vi scrive `/voice/`.

Con clip proprie sul computer (prodotte dalla pipeline descritta di seguito e collocate accanto al gioco in `../leapmultix-voices`), il parametro `?voix=local` consente al server di sviluppo di riprodurle:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Su leapmultix.jls42.org: le voci dell'hosting

Il sito offerto dall'autore fornisce voci sintetiche registrate:

- in francese, **Lucie**, creata con ElevenLabs (modello Eleven v3);
- in inglese britannico e in spagnolo di Spagna, **Sulafat**, creata con Google Cloud Text-to-Speech (voce Chirp 3 HD);
- a scelta del giocatore, **Sulafat** in francese, per mantenere la stessa voce nelle tre lingue;
- sempre a scelta del giocatore, **Marie** in francese e **Jane** in inglese, create con Mistral AI (Voxtral TTS).

Le clip risiedono in un repository privato e in un bucket S3 dedicato, distribuito da CloudFront su `/voice/*`. Vengono generate una sola volta: durante il gioco, nulla viene inviato a questi servizi. Nelle impostazioni, il menu «Voce» propone le voci disponibili per la lingua quando ce n'è più di una e la dicitura indica il servizio della voce riprodotta.

### Generare le clip

La pipeline è gestita dagli script in `scripts/voice/` e viene eseguita sul computer del proprietario, mai nella CI pubblica. Le chiavi dei fornitori (ElevenLabs per Lucie, Google Cloud Text-to-Speech per Sulafat, Mistral per Marie e Jane) rimangono in un file `.env` esterno al repository, passato tramite `node --env-file`: nessuna chiave entra in git. Lo skill Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) illustra la procedura passo dopo passo (quality gate, approvazioni, riprese); i dettagli sono disponibili in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Stimare** le frasi rimanenti e i caratteri da pagare (Eleven v3: circa 0,53 crediti per carattere; Chirp 3 HD: 30 $ per milione di caratteri, con il primo milione di ogni mese gratuito; Voxtral TTS: 16 $ per milione).
2. **Generare**. Eseguendo nuovamente lo stesso comando si riprende ciò che manca. Quando i crediti sono esauriti, lo script si arresta correttamente (codice 3) senza lasciare file scritti solo in parte. `--max-total-chars` limita la spesa cumulativa della versione: ogni risposta pagata viene registrata non appena ricevuta in un registro che sopravvive a un arresto improvviso. Per Google e Mistral, che non forniscono alcun saldo consultabile, questa è l'unica protezione.
3. **Controllare**: ogni frase dispone della propria clip e ogni MP3 è valido. Whisper trascrive quindi localmente ogni clip e il controllo segnala i numeri compresi erroneamente e le durate anomale. `voice:review` esegue in sequenza Whisper, questo controllo e la pagina di ascolto con un solo comando.
4. **Ascoltare** nella pagina di ascolto (`voice:listen`) le clip segnalate e un campione di forme femminili («une fois 7»), che Whisper non distingue. Ogni clip dispone di una casella «da rifare», che la aggiunge all'elenco delle clip scartate.
5. **Rifare** le clip scartate (`--redo`) ed eseguire nuovamente Whisper, quindi confrontare ogni clip prima e dopo in una seconda pagina. Una clip ancora pronunciata male dopo due o tre tentativi riceve un testo imposto in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), ad esempio il numero scritto in lettere.
6. **Pubblicare** le clip, verificare che rispondano online, quindi pubblicare l'indice della lingua, inizialmente per i tester (`?voix=test`).
7. **Rendere disponibile** la voce a tutti, quindi attivarla per impostazione predefinita. Il kill switch (`voice:publish -- remove`) rimuove una lingua dall'indice: il gioco torna alla voce del dispositivo.

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

### Regola: una frase pronunciata che viene modificata deve essere registrata nuovamente prima della messa in produzione

Ogni frase pronunciata proviene dalle traduzioni (`assets/translations/{fr,en,es}.json`) e fa parte del corpus. Modificare una frase parlata causa quindi il fallimento del test di blocco del corpus (`scripts/voice/corpus.lock.json`). Per una lingua che dispone della propria voce registrata, si generano quindi le clip delle frasi interessate, le si controlla e le si ascolta, poi le si pubblica **prima** del merge. Infine si aggiorna il blocco (`npm run voice:corpus:lock`). Senza queste clip, la frase modificata viene letta con la voce del dispositivo.

## 📊 Archiviazione dei dati

### Dati utente

- Profili e preferenze
- Progressi per modalità di gioco
- Punteggi e statistiche dei giochi arcade
- Impostazioni di personalizzazione

### Funzionalità tecniche

- Archiviazione locale (localStorage) con fallback; al browser viene richiesto di non cancellarla
  autonomamente (`navigator.storage.persist()`)
- Cestino dei giocatori eliminati: 30 giorni con tutti i loro dati, ripristino da
  «Chi gioca?»
- Salvataggio dei giocatori in un file JSON, ripristinabile su questo dispositivo o su un altro (un giocatore
  già presente non viene mai sovrascritto)
- Dati di gioco organizzati per profilo, incluse le statistiche per calcolo: su un dispositivo condiviso, gli errori di un giocatore non influenzano le domande di un altro
- Salvataggio automatico dei progressi
- Migrazione automatica dei dati precedenti

## 🐛 Segnalare un problema

I problemi possono essere segnalati tramite le issue GitHub. Includere:

- Descrizione dettagliata del problema
- Passaggi per riprodurlo
- Browser e versione
- Screenshot, se pertinenti

## 💝 Sostenere il progetto

**[☕ Fare una donazione tramite PayPal](https://paypal.me/jls)**

## 📄 Licenza

Questo progetto è distribuito con licenza AGPL v3. Consultare il file `LICENSE` per maggiori dettagli.

---

_LeapMultix — applicazione educativa libera per imparare le quattro operazioni_

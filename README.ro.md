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

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Licență: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

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

## Cuprins

- [Descriere](#descriere)
- [Prezentare generală](#-prezentare-generală)
- [Funcționalități](#-funcționalități)
- [Pornire rapidă](#-pornire-rapidă)
- [Arhitectură](#-arhitectură)
- [Moduri de joc detaliate](#-moduri-de-joc-detaliate)
- [Dezvoltare](#-dezvoltare)
- [Compatibilitate](#-compatibilitate)
- [Localizare](#-localizare)
- [Voce înregistrată](#-voce-înregistrată)
- [Stocarea datelor](#-stocarea-datelor)
- [Raportarea unei probleme](#-raportarea-unei-probleme)
- [Licență](#-licență)

## Descriere

LeapMultix este o aplicație web educațională interactivă destinată copiilor între 6 și 12 ani pentru a stăpâni cele 4 operații aritmetice: înmulțire (×), adunare (+), scădere (−) și împărțire (÷). Aceasta oferă **5 moduri de joc** și **4 mini-jocuri arcade** într-o interfață intuitivă, accesibilă și multilingvă.

**Suport multi-operații:** toate cele cinci moduri acceptă cele patru operații. Selectarea se face pe ecranul de pornire și este valabilă pentru întregul parcurs.

**Dezvoltat de:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## 📸 Prezentare generală

### Ecranele

|                                                                                                                             |                                                                                                              |
| :-------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
|                          ![Ecranul „Cine joacă?”: alegerea profilului](docs/media/01-accueil.webp)                          |           ![Meniul principal: alegerea operației și a celor cinci moduri](docs/media/02-menu.webp)           |
|                       **Cine joacă?** — un profil pentru fiecare copil, cu avatarul și progresul său.                       |                   **Meniul** — operația se alege aici, apoi se deschid cele cinci moduri.                    |
|                     ![Modul Descoperire: tabla lui 4 afișată în puncte](docs/media/03-decouverte.webp)                      |           ![Modul Quiz: răspuns greșit în roșu, răspuns corect în verde](docs/media/04-quiz.webp)            |
|        **Descoperire** — fiecare egalitate este afișată în puncte, salturi sau numărare, cu trucul specific tablei.         | **Quiz** — alegerea copilului rămâne afișată alături de răspunsul corect, iar explicația detaliază calculul. |
|                  ![Modul Provocare: numărătoare inversă și serie în desfășurare](docs/media/05-defi.webp)                   |     ![Modul Aventură: harta celor zece niveluri, următoarele fiind blocate](docs/media/06-aventure.webp)     |
| **Provocare** — cursă contra cronometru. La o greșeală, cronometrul se oprește pentru a permite citirea răspunsului corect. |           **Aventură** — zece niveluri care se deblochează unul după altul, în schimbul stelelor.            |
|                             ![Meniul Arcade: cele patru mini-jocuri](docs/media/07-arcade.webp)                             |             ![Tablou de bord: stele pe tablă și statistici](docs/media/08-tableau-de-bord.webp)              |
|                         **Arcade** — patru mini-jocuri, cu reglarea dificultății și alegerea navei.                         |                **Tablou de bord** — stele pe tablă, table de recapitulat, scoruri pe moduri.                 |
|                    ![Personalizare: avatare, teme, accesibilitate](docs/media/09-personnalisation.webp)                     |                                                                                                              |
|              **Personalizare** — avatar, temă de culori, dimensiunea textului, contrast ridicat, cod parental.              |                                                                                                              |

### Mini-jocurile arcade

Patru jocuri care pun aceeași întrebare — cea afișată deasupra zonei de
joc, cu timpul rămas și viețile — dar necesită de fiecare dată o acțiune
diferită.

|                                                                                                                          |                                                                                                       |
| :----------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: |
|     ![MultiInvaders: monștri purtând numere, o navă în partea de jos a ecranului](docs/media/10-multiinvaders.webp)      | ![MultiMiam: un labirint în care bulinele poartă răspunsurile posibile](docs/media/11-multimiam.webp) |
| **MultiInvaders** — trage în răspunsurile greșite, cruță-l pe cel corect: acesta ascunde un prieten ce trebuie eliberat. |       **MultiMiam** — parcurge labirintul pentru a prinde rezultatul corect, evitând monștrii.        |
|      ![MultiMemory: o grilă de cărți, două întoarse arătând un calcul și un număr](docs/media/12-multimemory.webp)       |        ![MultiSnake: un șarpe și mere numerotate pe o pajiște](docs/media/13-multisnake.webp)         |
|                   **MultiMemory** — găsește din memorie ce carte conține rezultatul calculului întors.                   |           **MultiSnake** — crește înghițind numerele corecte, evită-le pe toate celelalte.            |

## ✨ Funcționalități

### 🎮 Moduri de joc

- **Modul Descoperire** : Explorare vizuală și interactivă adaptată fiecărei operații
- **Modul Quiz** : Întrebări cu variante multiple de răspuns, cu suport pentru cele 4 operații (×, +, −, ÷) și progresie adaptivă
- **Modul Provocare** : Cursă contra cronometru cu cele 4 operații (×, +, −, ÷) și diferite niveluri de dificultate
- **Modul Aventură** : Progresie narativă pe niveluri cu suport pentru cele 4 operații

### 🕹️ Mini-jocuri arcade

- **MultiInvaders** : Space Invaders educațional - Distruge răspunsurile greșite
- **MultiMiam** : Pac-Man matematic - Colectează răspunsurile corecte
- **MultiMemory** : Joc de memorie - Asociază operații și rezultate
- **MultiSnake** : Snake educațional - Crește mâncând numerele corecte

### ➕ Suport multi-operații

LeapMultix oferă un antrenament complet pentru cele 4 operații aritmetice în **toate modurile** :

| Mod         | ×   | +   | −   | ÷   |
| ----------- | --- | --- | --- | --- |
| Quiz        | ✅  | ✅  | ✅  | ✅  |
| Provocare   | ✅  | ✅  | ✅  | ✅  |
| Descoperire | ✅  | ✅  | ✅  | ✅  |
| Aventură    | ✅  | ✅  | ✅  | ✅  |
| Arcade      | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funcționalități transversale

- **Multi-utilizator** : Gestionarea profilurilor individuale cu salvarea progresului
- **Multilingv** : Suport pentru franceză, engleză și spaniolă
- **Personalizare** : Avatare, teme de culori, fundaluri
- **Accesibilitate** : Navigare de la tastatură, suport tactil, conformitate cu WCAG 2.1 AA
- **Voce înregistrată** : jocul poate citi întrebările și încurajările cu o voce sintetică preînregistrată, cu revenire automată la vocea dispozitivului. Vocile nu se află în acest depozit: site-ul leapmultix.jls42.org oferă vocea Lucie în franceză, Sulafat în engleză și spaniolă, și opțional Sulafat și Marie în franceză, Jane în engleză (vezi [Voce înregistrată](#-voce-înregistrată))
- **Mobile responsive** : Interfață optimizată pentru tablete și smartphone-uri
- **Sistem de progresie** : Scoruri, insigne, provocări zilnice

## 🚀 Pornire rapidă

### Cerințe preliminare

- Node.js (versiunea 16 sau superioară)
- Un browser web modern

### Instalare

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

### Scripturi disponibile

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

## 🧱 Arhitectură

### Structura fișierelor

Modulele JavaScript sunt **la nivel rădăcină în `js/`**, cu excepția a trei dosare:
`core/`, `components/` și `modes/`. Prin urmare, numele fișierului este cel care definește
gruparea (`arcade-*`, `multimiam-*`, `i18n*`…).

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

### Arhitectură tehnică

**Module ES6 moderne** : Proiectul utilizează o arhitectură modulară cu clase ES6 și importuri/exporturi native.

**Componente reutilizabile** : Interfață construită cu componente UI centralizate (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading** : Încărcare inteligentă a modulelor la cerere prin `lazy-loader.js` pentru optimizarea performanței inițiale.

**Sistem unificat de stocare** : API centralizat pentru persistența datelor utilizatorului prin LocalStorage cu mecanisme de rezervă (fallbacks).

**Gestionare audio centralizată** : Control audio cu suport multilingv și preferințe per utilizator.

**Event Bus** : Comunicare bazată pe evenimente, decuplată între componente, pentru o arhitectură ușor de întreținut.

**Navigare prin slide-uri** : Sistem de navigare bazat pe slide-uri numerotate (slide0, slide1 etc.) cu `goToSlide()`.

**Securitate** : Protecție XSS și igienizare (sanitization) prin `security-utils.js` pentru toate manipulările DOM.

## 🎯 Moduri de joc detaliate

### Modul Descoperire

Interfață de explorare vizuală a tablelor înmulțirii cu:

- Vizualizare interactivă a înmulțirilor
- Animații și ghiduri vizuale
- Drag-and-drop educațional
- Progresie liberă pentru fiecare tablă

### Modul Quiz

Întrebări cu variante multiple de răspuns cu:

- 10 întrebări per sesiune
- Progresie adaptivă în funcție de reușite
- Tastatură numerică virtuală
- Sistem de serie (streak de răspunsuri corecte)

### Modul Provocare

Cursă contra cronometru cu:

- 3 niveluri de dificultate (Începător, Mediu, Dificil)
- Bonus de timp pentru răspunsurile corecte
- Sistem de vieți
- Clasament al celor mai bune scoruri

### Modul Aventură

Progresie narativă cu:

- 10 niveluri tematice deblocabile
- Hartă interactivă cu progresie vizuală
- Poveste captivantă cu personaje
- Sistem de stele și recompense

### Mini-jocuri arcade

Fiecare mini-joc oferă:

- Alegerea dificultății și personalizare
- Sistem de vieți și scor
- Comenzi de la tastatură și tactile
- Clasamente individuale pentru fiecare utilizator

## 🔧 Dezvoltare

### Flux de lucru pentru dezvoltare

**Nu faceți commit direct pe main.** Proiectul funcționează pe ramuri de
funcționalități.

**1. Creați o ramură**, `feat/` pentru o funcționalitate, `fix/` pentru o remediere de eroare:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Dezvoltați și verificați.** Formatarea este pe primul loc: CI-ul o respinge
chiar înainte de a rula testele.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Faceți commit pe ramură**, apoi trimiteți-o (push):

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Deschideți un pull request** și așteptați analizele: verify, Codacy,
CodeFactor și SonarCloud. Se corectează până când totul este verde înainte de a fuziona (merge).

**Stilul de commit** : Mesaje concise, la modul imperativ (ex.: „Fix arcade init errors”, „Refactor cache updater”)

**Quality gate** : Asigurați-vă că `npm run lint`, `npm test` și `npm run test:coverage` trec cu succes înainte de fiecare commit

### Arhitectura componentelor

**GameMode (clasă de bază)** : Toate modurile moștenesc o clasă comună cu metode standardizate.

**GameModeManager** : Orchestare centralizată a lansării și gestionării modurilor.

**Componente UI** : TopBar, InfoBar, Dashboard și Customization oferă o interfață coerentă.

**Lazy Loading** : Modulele sunt încărcate la cerere pentru a optimiza performanțele inițiale.

**Event Bus** : Comunicare decuplată între componente prin intermediul sistemului de evenimente.

### Teste

Proiectul include o suită completă de teste:

- Teste unitare pentru modulele de bază (core)
- Teste de integrare pentru componente
- Teste pentru modurile de joc
- Acoperire automată a codului

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Compilare pentru producție

- **Rollup** : Împachetează `js/main-es6.js` în ESM cu separare de cod (code-splitting) și sourcemaps
- **Terser** : Minificare automată pentru optimizare
- **Post-build** : Copiază `css/` și `assets/`, pictogramele favicon (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` și rescrie `dist/index.html` către fișierul de intrare cu hash (ex.: `main-es6-*.js`)
- **Dosar final** : `dist/` gata de a fi servit static

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integrare continuă

**GitHub Actions** : `.github/workflows/ci.yml`, declanșat la fiecare push pe
`main` și la fiecare pull request.

**`verify`** — poarta de calitate, blocantă:

- `npm ci`, apoi `npm run verify` (ESLint, teste Jest, acoperire)
- `npm run format:check` (Prettier)

**`seo-report`** — după `verify`: audit Lighthouse al site-ului online, pentru
a urmări metricile SEO în timp.

**Analize externe** conectate la pull request-uri: Codacy, CodeFactor și
SonarCloud. Poarta SonarCloud solicită calificative A pentru fiabilitate, securitate și
mentenanță pe codul nou.

**Implementare (Deployment)** : `./deploy.sh` sincronizează site-ul către S3 și invalidează memoria cache
CloudFront. Scriptul regenerează, la nevoie, imaginile responsive, care lipsesc din git.

### PWA (Progressive Web App)

LeapMultix este o aplicație PWA completă, cu suport offline și posibilitate de instalare.

**Service Worker** (`sw.js`) :

- Navigare: Network-first cu fallback offline către `offline.html`
- Imagini: Cache-first pentru a optimiza performanțele
- Traduceri: Stale-while-revalidate pentru actualizare în fundal
- JS/CSS: Network-first pentru a furniza întotdeauna cea mai recentă versiune
- Gestionare automată a versiunilor prin `cache-updater.js`

**Manifest** (`manifest.json`) :

- Pictograme SVG și PNG pentru toate dispozitivele
- Posibilitate de instalare pe mobil (Add to Home Screen)
- Configurație standalone pentru o experiență de tip aplicație nativă
- Suport pentru teme și culori

**Testarea modului offline la nivel local.** Porniți serverul, apoi deschideți
`http://localhost:8080` (sau portul afișat):

```bash
npm run serve
```

Manual: opriți rețeaua din instrumentele de dezvoltare (fila Rețea / Network,
modul offline), apoi reîmprospătați pagina. `offline.html` trebuie să se afișeze.

Automat, cu Puppeteer:

```bash
npm run test:pwa-offline
```

**Scripturi de gestionare a Service Worker-ului** :

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Standarde de calitate

**Instrumente de calitate a codului**:

- **ESLint**: Configurație modernă cu flat config (`eslint.config.js`), suport ES2022
- **Prettier**: Formatare automată a codului (`.prettierrc`)
- **Stylelint**: Validare CSS (`.stylelintrc.json`)
- **JSDoc**: Documentare automată a funcțiilor cu analiză de acoperire

**Reguli importante de cod**:

- Ștergerea variabilelor și a parametrilor neutilizați (`no-unused-vars`)
- Utilizarea unei gestionări specifice a erorilor (fără blocuri catch goale)
- Evitarea `innerHTML` în favoarea funcțiilor `security-utils.js`
- Menținerea unei complexități cognitive < 15 pentru funcții
- Extragerea funcțiilor complexe în funcții helper mai mici

**Securitate**:

- **Protecție XSS**: Utilizarea funcțiilor din `security-utils.js`:
  - `appendSanitizedHTML()` în loc de `innerHTML`
  - `createSafeElement()` pentru a crea elemente sigure
  - `setSafeMessage()` pentru conținutul text
- **Scripturi externe**: Atributul `crossorigin="anonymous"` obligatoriu
- **Validarea intrărilor**: Sanitizarea întotdeauna a datelor externe
- **Content Security Policy**: Header-e CSP pentru a restricționa sursele de scripturi

**Accesibilitate**:

- Conformitate WCAG 2.1 AA
- Navigare completă de la tastatură
- Roluri ARIA și etichete corespunzătoare
- Contraste de culoare conforme

**Performanță**:

- Lazy loading al modulelor prin `lazy-loader.js`
- Optimizări CSS și asset-uri responsive
- Service Worker pentru caching inteligent
- Code splitting și minificare în producție

## 📱 Compatibilitate

### Navigatoare acceptate

Interfața se bazează pe `oklch()` pentru culori și pe `:has()` pentru
stările contextuale, ceea ce stabilește cerințele minime:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispozitive

- **Desktop**: Controale prin tastatură și mouse
- **Tablete**: Interfață tactilă optimizată
- **Smartphone-uri**: Design responsive adaptiv

### Accesibilitate

- Navigare completă de la tastatură (Tab, săgeți, Esc)
- Roluri ARIA și etichete pentru cititoare de ecran
- Contraste de culoare conforme
- Suport pentru tehnologii de asistență

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

**`npm run i18n:verify`** - Verificarea coerenței cheilor de traducere

**`npm run i18n:unused`** - Listarea cheilor de traducere neutilizate

**`npm run i18n:compare`** - Compararea fișierelor de traducere cu fr.json (referință)

Acest script (`scripts/compare-translations.cjs`) asigură sincronizarea tuturor fișierelor de limbă:

**Funcționalități:**

- Detectarea cheilor lipsă (prezente în fr.json, dar absente în alte limbi)
- Detectarea cheilor suplimentare (prezente în alte limbi, dar nu și în fr.json)
- Identificarea valorilor goale (`""`, `null`, `undefined`, `[]`)
- Verificarea coerenței tipurilor (string vs array)
- Aplatizarea structurilor JSON imbricate în notație cu punct (ex.: `arcade.multiMemory.title`)
- Generarea unui raport detaliat în consolă
- Salvarea raportului JSON în `docs/translations-comparison-report.json`

**Exemplu de ieșire:**

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

**Acoperirea traducerilor:**

- Interfață de utilizator completă
- Instrucțiuni pentru jocuri
- Mesaje de eroare și feedback
- Descrieri și ajutor contextual
- Conținut narativ pentru modul Aventură
- Etichete de accesibilitate și ARIA

## 🔊 Voce înregistrată

Jocul citește cu voce tare întrebările, încurajările și explicațiile. Acesta rostește doar un set finit de fraze, aproximativ 7.400 pentru fiecare limbă: prin urmare, pot fi înregistrate o dată pentru totdeauna și nicio partidă nu apelează vreun serviciu de sinteză. Fără clipuri, jocul citește folosind vocea dispozitivului.

### În acest depozit: aplicația, fără voci

Codul poate reda clipuri preînregistrate și include lanțul care le produce. Clipurile nu se află aici, la fel cum nu se află nici cheile furnizorilor: un fork sau o instalare locală va citi folosind vocea dispozitivului.

- **Comutare automată (fallback)** pe vocea dispozitivului, frază cu frază: clip lipsă sau cu eroare, redare refuzată de navigator, clip care nu pornește în 1,5 s sau offline fără clipul în cache.
- **Setări**: butonul de voce din bara de sus activează sau dezactivează redarea; caseta „Voce înregistrată” (Accesibilitate și controale) alege între vocea înregistrată și vocea dispozitivului. Aceasta apare doar pentru limbile în care a fost publicată o voce.
- **Offline**: clipurile deja ascultate rămân în cache (service worker).
- **Unde caută jocul clipurile**: în tagul `<meta name="leapmultix-voice-base">`, gol în depozit. Doar implementarea de producție scrie acolo `/voice/`.

Cu propriile clipuri pe stația de lucru (produse prin lanțul de mai jos, așezate lângă joc în `../leapmultix-voices`), parametrul `?voix=local` le face să fie redate de serverul de dezvoltare:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Pe leapmultix.jls42.org: vocile de pe găzduire

Site-ul oferit de autor servește voci de sinteză înregistrate:

- în franceză, **Lucie**, creată cu ElevenLabs (modelul Eleven v3);
- în engleză britanică și spaniolă din Spania, **Sulafat**, creată cu Google Cloud Text-to-Speech (vocea Chirp 3 HD);
- la alegerea jucătorului, **Sulafat** în franceză, pentru a păstra aceeași voce în toate cele trei limbi;
- de asemenea la alegerea jucătorului, **Marie** în franceză și **Jane** în engleză, create cu Mistral AI (Voxtral TTS).

Clipurile se află într-un depozit privat și într-un bucket S3 dedicat, servit de CloudFront pe `/voice/*`. Ele sunt generate o singură dată: în timpul jocului, nimic nu este trimis către aceste servicii. În setări, meniul „Voce” oferă vocile limbii respective atunci când sunt disponibile mai multe, iar mențiunea indică serviciul vocii auzite.

### Generarea clipurilor

Lanțul este scriptat în `scripts/voice/` și rulează pe stația de lucru a proprietarului, niciodată în CI-ul public. Cheile furnizorilor (ElevenLabs pentru Lucie, Google Cloud Text-to-Speech pentru Sulafat, Mistral pentru Marie și Jane) rămân într-un fișier `.env` în afara depozitului, transmis prin `node --env-file`: nicio cheie nu ajunge în git. Skill-ul Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) parcurge procedura pas cu pas (puncte de control, acorduri, reluări); detaliile se găsesc în [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimarea** frazelor rămase și a caracterelor plătite (Eleven v3: aproximativ 0,53 credite per caracter; Chirp 3 HD: 30 $ per milion de caractere, primul milion din fiecare lună fiind gratuit; Voxtral TTS: 16 $ per milion).
2. **Generarea**. Reluarea aceleiași comenzi continuă cu ceea ce lipsește. Când creditele sunt epuizate, scriptul se oprește curat (codul 3) fără a lăsa fișiere scrise pe jumătate. `--max-total-chars` plafonează cheltuielile cumulate ale versiunii: fiecare răspuns plătit este înregistrat de îndată ce este primit într-un registru, care supraviețuiește unei opriri bruște. În cazul Google și Mistral, care nu oferă un sold lizibil, aceasta este singura protecție.
3. **Verificarea**: fiecare frază are clipul său și fiecare MP3 este valid. Whisper transcrie apoi fiecare clip local, iar verificarea semnalează numerele auzite greșit și duratele anormale. `voice:review` combină Whisper, această verificare și pagina de ascultare într-o singură comandă.
4. **Ascultarea** pe pagina de ascultare (`voice:listen`) a clipurilor semnalate și a unui eșantion de forme feminine („une fois 7”), pe care Whisper nu le distinge. Fiecare clip are o casetă „de refăcut”, care îl adaugă la lista clipurilor respinse.
5. **Refacerea** clipurilor respinse (`--redo`) și reluarea Whisper, apoi compararea fiecărui clip înainte și după pe o a doua pagină. Un clip rostit încă greșit după două sau trei încercări primește un text impus în `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), de exemplu numărul scris în cuvinte.
6. **Publicarea** clipurilor, verificarea faptului că răspund online, apoi publicarea indexului limbii, mai întâi pentru testeri (`?voix=test`).
7. **Deschiderea** vocii pentru toți, apoi activarea acesteia în mod implicit. Întrerupătorul de siguranță (`voice:publish -- remove`) elimină o limbă din index: jocul revine la vocea dispozitivului.

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

### Regulă: o frază rostită modificată se reînregistrează înainte de lansarea în producție

Orice frază rostită provine din traduceri (`assets/translations/{fr,en,es}.json`) și face parte din corpus. Modificarea unei fraze vorbite face astfel ca testul de blocare a corpusului (`scripts/voice/corpus.lock.json`) să eșueze. Pentru o limbă care are vocea înregistrată, se generează clipurile pentru frazele afectate, sunt verificate și ascultate, apoi publicate **înainte** de unire (merge). În final, se actualizează blocarea (`npm run voice:corpus:lock`). Fără aceste clipuri, fraza modificată este citită cu vocea dispozitivului.

## 📊 Stocarea datelor

### Date utilizator

- Profiluri și preferințe
- Progres pe fiecare mod de joc
- Scoruri și statistici pentru jocurile arcade
- Parametri de personalizare

### Funcționalități tehnice

- Stocare locală (localStorage) cu soluții de rezervă (fallbacks)
- Izolarea datelor per utilizator
- Salvare automată a progresului
- Migrare automată a datelor vechi

## 🐛 Raportarea unei probleme

Problemele pot fi raportate prin intermediul problemelor (issues) de pe GitHub. Vă rugăm să includeți:

- Descriere detaliată a problemei
- Pași pentru reproducerea acesteia
- Navigatorul și versiunea
- Capturi de ecran, dacă sunt relevante

## 💝 Susținerea proiectului

**[☕ Donează prin PayPal](https://paypal.me/jls)**

## 📄 Licență

Acest proiect este licențiat sub AGPL v3. Consultați fișierul `LICENSE` pentru mai multe detalii.

---

_LeapMultix — aplicație educațională liberă pentru învățarea celor patru operații_

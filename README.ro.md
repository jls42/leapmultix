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
[![Insignă Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Starea pragului de calitate](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Evaluarea fiabilității](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Evaluarea securității](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Evaluarea mentenabilității](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Datorie tehnică](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Erori](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Vulnerabilități](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Probleme de calitate a codului](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Linii duplicate (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Linii de cod](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

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

LeapMultix este o aplicație web educațională interactivă destinată copiilor cu vârste cuprinse între 6 și 12 ani, pentru a stăpâni cele 4 operații aritmetice: înmulțirea (×), adunarea (+), scăderea (−) și împărțirea (÷). Oferă **5 moduri de joc** și **4 mini-jocuri arcade** într-o interfață intuitivă, accesibilă și multilingvă.

**Compatibilitate cu mai multe operații:** toate cele cinci moduri acceptă cele patru operații. Alegerea se face pe ecranul de pornire și se aplică întregului parcurs.

**Dezvoltat de:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## 📸 Prezentare generală

### Ecranele

|                                                                                                                      |                                                                                                         |
| :------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|                      ![Ecranul „Cine joacă?”: alegerea profilului](docs/media/01-accueil.webp)                       |        ![Meniul principal: alegerea operației și a celor cinci moduri](docs/media/02-menu.webp)         |
|                 **Cine joacă?** — câte un profil pentru fiecare copil, cu avatarul și progresul său.                 |               **Meniul** — operația este aleasă aici, apoi se deschid cele cinci moduri.                |
|              ![Modul Descoperire: tabla lui 4 reprezentată prin puncte](docs/media/03-decouverte.webp)               |         ![Modul Quiz: răspuns greșit cu roșu, răspuns corect cu verde](docs/media/04-quiz.webp)         |
| **Descoperire** — fiecare egalitate este reprezentată prin puncte, salturi sau numărare, împreună cu trucul tablei.  | **Quiz** — alegerea copilului rămâne afișată lângă răspunsul corect, iar explicația detaliază calculul. |
|                  ![Modul Provocare: numărătoare inversă și serie în curs](docs/media/05-defi.webp)                   |    ![Modul Aventură: harta celor zece niveluri, cu următoarele blocate](docs/media/06-aventure.webp)    |
| **Provocare** — cursă contra cronometru. La o greșeală, cronometrul se oprește cât timp este citit răspunsul corect. |              **Aventură** — zece niveluri care se deschid succesiv, în schimbul stelelor.               |
|                         ![Meniul Arcade: cele patru mini-jocuri](docs/media/07-arcade.webp)                          |     ![Tablou de bord: stele pentru fiecare tablă și statistici](docs/media/08-tableau-de-bord.webp)     |
|                     **Arcade** — patru mini-jocuri, cu reglarea dificultății și alegerea navei.                      |         **Tablou de bord** — stele pentru fiecare tablă, table de revizuit, scoruri pe moduri.          |
|                 ![Personalizare: avatare, teme, accesibilitate](docs/media/09-personnalisation.webp)                 |                                                                                                         |
|          **Personalizare** — avatar, temă cromatică, dimensiunea textului, contrast ridicat, cod parental.           |                                                                                                         |

### Mini-jocurile arcade

Patru jocuri care pun aceeași întrebare — cea afișată deasupra zonei de
joc, alături de timpul rămas și de vieți — dar necesită de fiecare dată o acțiune
diferită.

|                                                                                                                                 |                                                                                                        |
| :-----------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|       ![MultiInvaders: monștri care poartă numere, o navă în partea de jos a ecranului](docs/media/10-multiinvaders.webp)       | ![MultiMiam: un labirint în care pastilele poartă răspunsurile posibile](docs/media/11-multimiam.webp) |
|       **MultiInvaders** — trage în răspunsurile greșite și cruță-l pe cel corect: acesta ascunde un prieten de eliberat.        |        **MultiMiam** — străbate labirintul pentru a prinde rezultatul corect, evitând monștrii.        |
| ![MultiMemory: o grilă de cărți, dintre care două sunt întoarse și arată un calcul și un număr](docs/media/12-multimemory.webp) |         ![MultiSnake: un șarpe și mere numerotate pe o pajiște](docs/media/13-multisnake.webp)         |
|                         **MultiMemory** — amintește-ți care carte conține rezultatul calculului întors.                         |           **MultiSnake** — crește înghițind numerele corecte și evită-le pe toate celelalte.           |

## ✨ Funcționalități

### 🎮 Moduri de joc

- **Modul Descoperire**: Explorare vizuală și interactivă adaptată fiecărei operații
- **Modul Quiz**: Întrebări cu variante multiple, compatibile cu cele 4 operații (×, +, −, ÷), și progres adaptiv
- **Modul Provocare**: Cursă contra cronometru cu cele 4 operații (×, +, −, ÷) și diferite niveluri de dificultate
- **Modul Aventură**: Progres narativ pe niveluri, compatibil cu cele 4 operații

### 🕹️ Mini-jocuri Arcade

- **MultiInvaders**: Space Invaders educațional - Distruge răspunsurile greșite
- **MultiMiam**: Pac-Man matematic - Colectează răspunsurile corecte
- **MultiMemory**: Joc de memorie - Asociază operațiile cu rezultatele
- **MultiSnake**: Snake educațional - Crește mâncând numerele corecte

### ➕ Compatibilitate cu mai multe operații

LeapMultix oferă exersarea completă a celor 4 operații aritmetice în **toate modurile**:

| Mod         | ×   | +   | −   | ÷   |
| ----------- | --- | --- | --- | --- |
| Quiz        | ✅  | ✅  | ✅  | ✅  |
| Provocare   | ✅  | ✅  | ✅  | ✅  |
| Descoperire | ✅  | ✅  | ✅  | ✅  |
| Aventură    | ✅  | ✅  | ✅  | ✅  |
| Arcade      | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funcționalități generale

- **Utilizatori multipli**: Gestionarea profilurilor individuale, cu progres salvat
- **Multilingv**: Compatibilitate cu limbile franceză, engleză și spaniolă
- **Personalizare**: Avatare, teme cromatice, fundaluri
- **Accesibilitate**: Navigare cu tastatura, compatibilitate tactilă, conformitate WCAG 2.1 AA
- **Voce înregistrată**: întrebări și încurajări citite de o voce sintetizată preînregistrată (Lucie în franceză, creată cu ElevenLabs; Jane în engleză, creată cu Mistral AI), cu revenire automată la vocea dispozitivului; clipurile nu sunt incluse în depozitul public (consultați [Voce înregistrată](#-voce-înregistrată))
- **Adaptare pentru dispozitive mobile**: Interfață optimizată pentru tablete și smartphone-uri
- **Sistem de progres**: Scoruri, insigne, provocări zilnice

## 🚀 Pornire rapidă

### Cerințe preliminare

- Node.js (versiunea 16 sau ulterioară)
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
npm run voice:generate     # Générer les clips (ElevenLabs ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Arhitectură

### Structura fișierelor

Modulele JavaScript sunt **organizate fără subdirectoare în `js/`**, cu excepția a trei directoare:
`core/`, `components/` și `modes/`. Prin urmare, numele fișierului indică
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

**Module ES6 moderne**: Proiectul utilizează o arhitectură modulară, cu clase ES6 și importuri/exporturi native.

**Componente reutilizabile**: Interfață construită cu componente UI centralizate (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Încărcarea inteligentă la cerere a modulelor prin `lazy-loader.js`, pentru optimizarea performanței inițiale.

**Sistem unificat de stocare**: API centralizat pentru persistența datelor utilizatorilor prin LocalStorage, cu mecanisme de rezervă.

**Gestionare audio centralizată**: Controlul sunetului, cu compatibilitate multilingvă și preferințe pentru fiecare utilizator.

**Event Bus**: Comunicare bazată pe evenimente și decuplată între componente, pentru o arhitectură ușor de întreținut.

**Navigare prin slide-uri**: Sistem de navigare bazat pe slide-uri numerotate (slide0, slide1 etc.), cu `goToSlide()`.

**Securitate**: Protecție XSS și sanitizare prin `security-utils.js` pentru toate manipulările DOM.

## 🎯 Moduri de joc detaliate

### Modul Descoperire

Interfață de explorare vizuală a tablelor înmulțirii, cu:

- Vizualizarea interactivă a înmulțirilor
- Animații și mijloace mnemonice
- Funcționalitate educațională de glisare și fixare
- Progres liber pentru fiecare tablă

### Modul Quiz

Întrebări cu variante multiple, cu:

- 10 întrebări pe sesiune
- Progres adaptiv în funcție de reușite
- Tastatură numerică virtuală
- Sistem de streak (serie de răspunsuri corecte)

### Modul Provocare

Cursă contra cronometru, cu:

- 3 niveluri de dificultate (Începător, Mediu, Dificil)
- Bonus de timp pentru răspunsurile corecte
- Sistem de vieți
- Clasamentul celor mai bune scoruri

### Modul Aventură

Progres narativ, cu:

- 10 niveluri tematice deblocabile
- Hartă interactivă, cu reprezentarea vizuală a progresului
- Poveste captivantă, cu personaje
- Sistem de stele și recompense

### Mini-jocuri Arcade

Fiecare mini-joc oferă:

- Alegerea dificultății și personalizare
- Sistem de vieți și scor
- Comenzi prin tastatură și ecran tactil
- Clasamente individuale pentru fiecare utilizator

## 🔧 Dezvoltare

### Flux de lucru pentru dezvoltare

**Nu efectuați niciodată commit direct pe main.** Proiectul utilizează ramuri pentru
funcționalități.

**1. Creați o ramură**, `feat/` pentru o funcționalitate, `fix/` pentru o remediere:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Dezvoltați și verificați.** Formatarea este verificată prima: CI respinge codul
înainte chiar de a rula testele.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Efectuați commit pe ramură**, apoi trimiteți-o:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Deschideți un pull request** și așteptați analizele: verify, Codacy,
CodeFactor și SonarCloud. Remediați problemele până când toate verificările sunt verzi, înainte de îmbinare.

**Stilul mesajelor de commit**: Mesaje concise, la modul imperativ (de exemplu: „Fix arcade init errors”, „Refactor cache updater”)

**Prag de calitate**: Asigurați-vă că `npm run lint`, `npm test` și `npm run test:coverage` trec înaintea fiecărui commit

### Arhitectura componentelor

**GameMode (clasă de bază)**: Toate modurile moștenesc o clasă comună, cu metode standardizate.

**GameModeManager**: Orchestrarea centralizată a pornirii și gestionării modurilor.

**Componente UI**: TopBar, InfoBar, Dashboard și Customization oferă o interfață coerentă.

**Lazy Loading**: Modulele sunt încărcate la cerere pentru optimizarea performanței inițiale.

**Event Bus**: Comunicare decuplată între componente prin sistemul de evenimente.

### Teste

Proiectul include o suită completă de teste:

- Teste unitare pentru modulele core
- Teste de integrare pentru componente
- Teste pentru modurile de joc
- Acoperire automatizată a codului

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Build de producție

- **Rollup**: Împachetează `js/main-es6.js` în ESM, cu code-splitting și sourcemaps
- **Terser**: Minificare automată pentru optimizare
- **Post-build**: Copiază `css/` și `assets/`, pictogramele favicon (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` și rescrie `dist/index.html` către fișierul de intrare cu hash (de exemplu: `main-es6-*.js`)
- **Director final**: `dist/`, pregătit pentru a fi servit static

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integrare continuă

**GitHub Actions**: `.github/workflows/ci.yml`, declanșat la fiecare push pe
`main` și la fiecare pull request.

**`verify`** — pragul de calitate, cu caracter blocant:

- `npm ci`, apoi `npm run verify` (ESLint, teste Jest, acoperire)
- `npm run format:check` (Prettier)

**`seo-report`** — după `verify`: audit Lighthouse al site-ului online, pentru
urmărirea în timp a metricilor SEO.

**Analize externe** conectate la pull request-uri: Codacy, CodeFactor și
SonarCloud. Pragul SonarCloud impune calificativul A pentru fiabilitatea, securitatea și
mentenabilitatea codului nou.

**Implementare**: `./deploy.sh` sincronizează site-ul cu S3 și invalidează memoria cache
CloudFront. Scriptul regenerează, dacă este necesar, imaginile responsive care lipsesc din git.

### PWA (Progressive Web App)

LeapMultix este o PWA completă, cu compatibilitate offline și posibilitate de instalare.

**Service Worker** (`sw.js`):

- Navigare: Network-first, cu fallback offline către `offline.html`
- Imagini: Cache-first pentru optimizarea performanței
- Traduceri: Stale-while-revalidate pentru actualizarea în fundal
- JS/CSS: Network-first pentru a furniza întotdeauna cea mai recentă versiune
- Gestionare automată a versiunii prin `cache-updater.js`

**Manifest** (`manifest.json`):

- Pictograme SVG și PNG pentru toate dispozitivele
- Posibilitate de instalare pe dispozitive mobile (Add to Home Screen)
- Configurație standalone pentru o experiență similară unei aplicații
- Compatibilitate cu teme și culori

**Testați local modul offline.** Porniți serverul, apoi deschideți
`http://localhost:8080` (sau portul afișat):

```bash
npm run serve
```

Manual: dezactivați rețeaua din instrumentele pentru dezvoltatori (fila Rețea,
modul offline), apoi reîmprospătați pagina. Trebuie să se afișeze `offline.html`.

Automat, cu Puppeteer:

```bash
npm run test:pwa-offline
```

**Scripturi de gestionare a Service Worker-ului**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Standarde de calitate

**Instrumente pentru calitatea codului**:

- **ESLint**: Configurație modernă cu flat config (`eslint.config.js`), suport ES2022
- **Prettier**: Formatarea automată a codului (`.prettierrc`)
- **Stylelint**: Validarea CSS (`.stylelintrc.json`)
- **JSDoc**: Documentarea automată a funcțiilor cu analiza acoperirii

**Reguli importante pentru cod**:

- Eliminarea variabilelor și parametrilor neutilizați (`no-unused-vars`)
- Utilizarea unei gestionări specifice a erorilor (fără blocuri catch goale)
- Evitarea `innerHTML` în favoarea funcțiilor `security-utils.js`
- Menținerea unei complexități cognitive < 15 pentru funcții
- Extragerea funcțiilor complexe în helpers mai mici

**Securitate**:

- **Protecție XSS**: Utilizarea funcțiilor din `security-utils.js`:
  - `appendSanitizedHTML()` în loc de `innerHTML`
  - `createSafeElement()` pentru crearea elementelor securizate
  - `setSafeMessage()` pentru conținutul text
- **Scripturi externe**: Atributul `crossorigin="anonymous"` este obligatoriu
- **Validarea datelor de intrare**: Datele externe trebuie întotdeauna sanitizate
- **Content Security Policy**: Headere CSP pentru restricționarea surselor de scripturi

**Accesibilitate**:

- Conformitate cu WCAG 2.1 AA
- Navigare completă cu tastatura
- Roluri ARIA și etichete adecvate
- Contraste de culoare conforme

**Performanță**:

- Lazy loading al modulelor prin `lazy-loader.js`
- Optimizări CSS și asset-uri responsive
- Service Worker pentru memorare inteligentă în cache
- Code splitting și minificare în producție

## 📱 Compatibilitate

### Browsere acceptate

Interfața se bazează pe `oklch()` pentru culori și pe `:has()` pentru
stările contextuale, ceea ce stabilește cerințele minime:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispozitive

- **Desktop**: Comenzi prin tastatură și mouse
- **Tablete**: Interfață tactilă optimizată
- **Smartphone-uri**: Design responsive adaptiv

### Accesibilitate

- Navigare completă cu tastatura (Tab, săgeți, Esc)
- Roluri ARIA și etichete pentru cititoarele de ecran
- Contraste de culoare conforme
- Suport pentru tehnologiile asistive

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

- Detectarea cheilor lipsă (prezente în fr.json, dar absente din alte limbi)
- Detectarea cheilor suplimentare (prezente în alte limbi, dar nu și în fr.json)
- Identificarea valorilor goale (`""`, `null`, `undefined`, `[]`)
- Verificarea coerenței tipurilor (string vs array)
- Aplatizarea structurilor JSON imbricate în notație cu puncte (de exemplu: `arcade.multiMemory.title`)
- Generarea unui raport detaliat în consolă
- Salvarea raportului JSON în `docs/translations-comparison-report.json`

**Exemplu de rezultat:**

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

- Interfață cu utilizatorul completă
- Instrucțiunile jocurilor
- Mesaje de eroare și feedback
- Descrieri și ajutor contextual
- Conținutul narativ al modului Aventură
- Etichete de accesibilitate și ARIA

## 🔊 Voce înregistrată

Jocul citește cu voce tare întrebările, încurajările și explicațiile, folosind o voce sintetizată și înregistrată în prealabil:

- în franceză, **Lucie**, creată cu ElevenLabs (modelul Eleven v3);
- în engleză, **Jane**, creată cu Mistral AI (Voxtral TTS).

Jocul rostește doar un set finit de fraze, aproximativ 7.400 pentru fiecare limbă: toate sunt înregistrate în prealabil și nicio componentă nu apelează un serviciu de sinteză. Pentru moment, limba spaniolă folosește în continuare vocea dispozitivului.

- **Revenire automată** la vocea dispozitivului, frază cu frază: clip absent sau cu eroare, redare refuzată de browser, clip care nu pornește în 1,5 s ori utilizare offline fără clipul în cache.
- **Setări**: butonul pentru voce din bara de sus activează sau dezactivează redarea; caseta „Voce înregistrată” (Accesibilitate și comenzi) permite alegerea între vocea înregistrată (Lucie sau Jane) și vocea dispozitivului.
- **Offline**: clipurile ascultate deja rămân în cache (service worker).

### Clipurile nu se află în acest depozit

Clipurile se află într-un depozit privat și într-un bucket S3 dedicat, distribuit prin CloudFront la `/voice/*`. Prin urmare, un fork sau mediul de dezvoltare locală păstrează vocea dispozitivului: în depozit, eticheta `<meta name="leapmultix-voice-base">` este goală și numai implementarea în producție scrie în ea `/voice/`.

Cu clipurile disponibile pe calculator (depozitul privat clonat lângă joc, în `../leapmultix-voices`), parametrul `?voix=local` permite redarea lor de către serverul de dezvoltare:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Generarea clipurilor

Fluxul este automatizat prin scripturi în `scripts/voice/` și rulează pe calculatorul proprietarului, niciodată în CI-ul public. Cheile furnizorilor (ElevenLabs pentru franceză, Mistral pentru engleză) rămân într-un fișier `.env` din afara depozitului, transmis prin `node --env-file`: nicio cheie nu ajunge în git. Skill-ul Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) descrie procedura pas cu pas (validări, aprobări, reluări); detaliile se află în [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimarea** frazelor rămase și a caracterelor care trebuie plătite (Eleven v3: aproximativ 0,53 credite per caracter; Voxtral TTS: 16 $ per milion de caractere).
2. **Generarea**. Rularea din nou a aceleiași comenzi continuă cu elementele lipsă. Când creditele se epuizează, scriptul se oprește în mod controlat (cod 3), fără a lăsa un fișier scris parțial. `--max-total-chars` limitează cheltuiala cumulată a versiunii: fiecare răspuns plătit este înscris într-un registru imediat ce este primit, iar registrul persistă după o oprire bruscă. Pentru Mistral, care nu furnizează un sold disponibil pentru citire, aceasta este singura protecție.
3. **Verificarea**: fiecare frază are propriul clip și fiecare fișier MP3 este valid. Apoi, Whisper transcrie local fiecare clip, iar verificarea semnalează numerele înțelese greșit și duratele anormale. `voice:review` execută succesiv Whisper, această verificare și pagina de ascultare printr-o singură comandă.
4. **Ascultarea** pe pagina de ascultare (`voice:listen`) a clipurilor semnalate și a unui eșantion de forme feminine („une fois 7”), pe care Whisper nu le distinge. Fiecare clip are o casetă „de refăcut”, care îl adaugă pe lista clipurilor respinse.
5. **Refacerea** clipurilor respinse (`--redo`) și rularea din nou a Whisper, apoi compararea fiecărui clip înainte și după pe o a doua pagină. Un clip care continuă să fie pronunțat greșit după două sau trei încercări primește un text impus în `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), de exemplu numărul scris cu litere.
6. **Publicarea** clipurilor, verificarea disponibilității lor online, apoi publicarea indexului limbii, mai întâi pentru testeri (`?voix=test`).
7. **Activarea** vocii pentru toți utilizatorii, apoi activarea ei în mod implicit. Mecanismul de oprire de urgență (`voice:publish -- remove`) elimină o limbă din index: jocul revine la vocea dispozitivului.

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

### Regulă: o frază rostită care a fost modificată este reînregistrată înainte de lansarea în producție

Fiecare frază rostită provine din traduceri (`assets/translations/{fr,en,es}.json`) și face parte din corpus. Prin urmare, modificarea unei fraze rostite determină eșuarea testului de blocare a corpusului (`scripts/voice/corpus.lock.json`). Pentru o limbă care dispune de voce înregistrată, se generează clipurile frazelor afectate, se verifică și se ascultă, apoi se publică **înainte** de integrare. La final, se actualizează blocarea (`npm run voice:corpus:lock`). Fără aceste clipuri, fraza modificată este redată cu vocea dispozitivului.

## 📊 Stocarea datelor

### Datele utilizatorului

- Profiluri și preferințe
- Progresul pentru fiecare mod de joc
- Scoruri și statistici pentru jocurile arcade
- Setări de personalizare

### Funcționalități tehnice

- Stocare locală (localStorage) cu mecanisme de rezervă
- Izolarea datelor pentru fiecare utilizator
- Salvarea automată a progresului
- Migrarea automată a datelor vechi

## 🐛 Raportarea unei probleme

Problemele pot fi raportate prin issues GitHub. Vă rugăm să includeți:

- Descrierea detaliată a problemei
- Pașii pentru reproducerea acesteia
- Browserul și versiunea
- Capturi de ecran, dacă sunt relevante

## 💝 Susținerea proiectului

**[☕ Faceți o donație prin PayPal](https://paypal.me/jls)**

## 📄 Licență

Acest proiect este distribuit sub licența AGPL v3. Consultați fișierul `LICENSE` pentru mai multe detalii.

---

_LeapMultix — aplicație educațională liberă pentru învățarea celor patru operații_

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

LeapMultix este o aplicație web educațională interactivă destinată copiilor cu vârste între 6 și 12 ani, pentru a stăpâni cele 4 operații aritmetice: înmulțirea (×), adunarea (+), scăderea (−) și împărțirea (÷). Aceasta oferă **6 moduri de joc** și **4 minijocuri arcade** într-o interfață intuitivă, accesibilă și multilingvă.

**Compatibilitate cu mai multe operații:** toate modurile acceptă cele patru operații. Alegerea se face pe ecranul de pornire și se aplică întregului parcurs.

**Dezvoltat de:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## 📸 Prezentare generală

### Ecranele

|                                                                                                                                                       |                                                                                                            |
| :---------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: |
|                                       ![Ecranul „Cine joacă?”: alegerea profilului](docs/media/01-accueil.webp)                                       |            ![Meniul principal: alegerea operației și a modului de joc](docs/media/02-menu.webp)            |
|                                 **Cine joacă?** — câte un profil pentru fiecare copil, cu avatarul și progresul său.                                  |                          **Meniul** — aici se alege operația, apoi modul de joc.                           |
|                               ![Modul Descoperire: tabla lui 4 reprezentată prin puncte](docs/media/03-decouverte.webp)                               |          ![Modul Quiz: răspuns greșit cu roșu, răspuns corect cu verde](docs/media/04-quiz.webp)           |
|               **Descoperire** — fiecare egalitate este reprezentată prin puncte, salturi sau numărare, împreună cu trucul pentru tablă.               |  **Quiz** — alegerea copilului rămâne afișată lângă răspunsul corect, iar explicația detaliază calculul.   |
|                               ![Modul Provocare: numărătoare inversă și serie în desfășurare](docs/media/05-defi.webp)                                |    ![Modul Aventură: harta celor zece niveluri, următoarele fiind blocate](docs/media/06-aventure.webp)    |
|                 **Provocare** — cursă contra cronometru. La o greșeală, cronometrul se oprește cât timp este citit răspunsul corect.                  |            **Aventură** — zece niveluri care se deschid unul după altul, în schimbul stelelor.             |
|                             ![Modul Cronometru: o cursă de scădere, cronometrul și progresul](docs/media/14-chrono.webp)                              |                     ![Meniul Arcade: cele patru minijocuri](docs/media/07-arcade.webp)                     |
| **Cronometru** — zece răspunsuri corecte contra cronometru, pentru operația aleasă; calculele greșite sunt adăugate într-o listă pentru recapitulare. |                 **Arcade** — patru minijocuri, cu reglarea dificultății și alegerea navei.                 |
|          ![Tablou de bord: partide, recorduri și răspunsuri pentru fiecare mod, detaliate după operație](docs/media/08-tableau-de-bord.webp)          |            ![Personalizare: avatare, teme, accesibilitate](docs/media/09-personnalisation.webp)            |
|         **Tablou de bord** — partidele și recordurile fiecărui mod, detaliate după operație; stelele și tablele de recapitulat la înmulțire.          | **Personalizare** — avatare de deblocat cu monede, temă de culori, dimensiunea textului, contrast ridicat. |

### Minijocurile arcade

Patru jocuri care adresează aceeași întrebare — cea afișată deasupra zonei de
joc, împreună cu timpul rămas și viețile — dar solicită de fiecare dată o acțiune
diferită.

|                                                                                                                                 |                                                                                                          |
| :-----------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
|       ![MultiInvaders: monștri care poartă numere, o navă în partea de jos a ecranului](docs/media/10-multiinvaders.webp)       | ![MultiMiam: un labirint în care pastilele afișează răspunsurile posibile](docs/media/11-multimiam.webp) |
|  **MultiInvaders** — trage în răspunsurile greșite și cruță-l pe cel corect: acesta ascunde un prieten care trebuie eliberat.   |         **MultiMiam** — străbate labirintul pentru a prinde rezultatul corect, evitând monștrii.         |
| ![MultiMemory: o grilă de cărți, dintre care două sunt întoarse și arată un calcul și un număr](docs/media/12-multimemory.webp) |          ![MultiSnake: un șarpe și mere numerotate pe o pajiște](docs/media/13-multisnake.webp)          |
|                         **MultiMemory** — amintește-ți care carte conține rezultatul calculului întors.                         |            **MultiSnake** — crește înghițind numerele corecte și evită-le pe toate celelalte.            |

## ✨ Funcționalități

### 🎮 Moduri de joc

- **Modul Descoperire**: explorare vizuală și interactivă adaptată fiecărei operații
- **Modul Quiz**: întrebări cu variante multiple de răspuns, cu suport pentru cele 4 operații (×, +, −, ÷) și progres adaptiv
- **Modul Provocare**: cursă contra cronometru cu cele 4 operații (×, +, −, ÷) și diferite niveluri de dificultate
- **Modul Aventură**: progres narativ pe niveluri, cu suport pentru cele 4 operații
- **Modul Cronometru**: 10 răspunsuri corecte contra unui cronometru care nu se oprește, pentru a-ți depăși cel mai bun timp, cu cele 4 operații (×, +, −, ÷)

### 🕹️ Minijocuri Arcade

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
| Cronometru  | ✅  | ✅  | ✅  | ✅  |
| Arcade      | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funcționalități generale

- **Mai mulți utilizatori**: câte un profil pentru fiecare copil, cu progresul său; pe un calculator din clasă, prenumele sunt sortate, filtrul apare de la 10 jucători, coșul păstrează elementele timp de 30 de zile, iar jucătorii pot fi salvați într-un fișier
- **Multilingv**: suport pentru franceză, engleză și spaniolă
- **Personalizare**: avatare (primul poate fi ales, iar celelalte se deblochează cu monedele câștigate jucând, câte 50 de monede fiecare), teme de culori, fundaluri
- **Accesibilitate**: navigare completă de la tastatură, suport tactil, pauză în Arcade, dimensiunea textului și contrast ridicat; verificată cu axe-core, fără încălcări WCAG de nivel A sau AA pe ecranele parcurse
- **Voce înregistrată**: jocul poate citi întrebările și încurajările cu o voce de sinteză preînregistrată, cu revenire automată la vocea dispozitivului. Vocile nu se află în acest depozit: site-ul leapmultix.jls42.org oferă Lucie în franceză, Sulafat în engleză și spaniolă, precum și, la alegere, Sulafat și Marie în franceză, Jane în engleză (consultați [Voce înregistrată](#-voce-înregistrată))
- **Adaptare pentru dispozitive mobile**: interfață optimizată pentru tablete și smartphone-uri
- **Sistem de progres**: tablou de bord pentru fiecare profil (partide, recorduri și table de recapitulat, detaliate după operație), insigne, provocări zilnice, monede (în Cronometru, Aventură, Provocare și Provocarea zilei)

## 🚀 Pornire rapidă

### Cerințe preliminare

- Node.js (versiunea 16 sau mai recentă)
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

### Arhitectură tehnică

**Module ES6 moderne**: proiectul utilizează o arhitectură modulară cu clase ES6 și importuri/exporturi native.

**Componente reutilizabile**: interfață construită cu componente UI centralizate (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: încărcarea inteligentă la cerere a modulelor prin `lazy-loader.js`, pentru optimizarea performanței inițiale.

**Sistem de stocare unificat**: API centralizat pentru persistența datelor utilizatorilor prin LocalStorage, cu mecanisme de rezervă.

**Gestionare audio centralizată**: controlul sunetului cu suport multilingv și preferințe pentru fiecare utilizator.

**Event Bus**: comunicare decuplată bazată pe evenimente între componente, pentru o arhitectură ușor de întreținut.

**Navigare prin slide-uri**: sistem de navigare bazat pe slide-uri numerotate (slide0, slide1 etc.), cu `goToSlide()`.

**Securitate**: protecție XSS și sanitizare prin `security-utils.js` pentru toate manipulările DOM.

## 🎯 Moduri de joc detaliate

### Modul Descoperire

Interfață de explorare vizuală, adaptată fiecărei operații, cu:

- Vizualizarea interactivă a înmulțirilor
- Animații și mijloace mnemonice
- Funcționalitate educațională de glisare și plasare
- Progres liber pentru fiecare tablă

### Modul Quiz

Întrebări cu variante multiple de răspuns, cu:

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
- Hartă interactivă cu afișarea vizuală a progresului
- Poveste captivantă cu personaje
- Sistem de stele și recompense

### Modul Cronometru

Zece răspunsuri corecte cât mai repede posibil, contra unui cronometru care nu se oprește:

- Cele patru operații: tablele înmulțirii (configurate în Setările tablelor) și
  toate tablele adunării (7 + k), scăderii ((7 + k) − 7) și împărțirii ((7 × k) ÷ 7)
- Răspuns prin alegere sau cu tastatura numerică, prin clic sau de la tastatură
- Cei mai buni timpi, timpul mediu și graficul ultimelor partide, pentru fiecare operație
- „Calculele mele de recapitulat”: câte o listă pentru fiecare operație, revizuită în ambele sensuri (6 × 7 și 7 × 6,
  15 − 7 și 15 − 8)

### Tablou de bord

Ce a jucat efectiv copilul, pentru fiecare profil:

- Stelele din Aventură și tablele înmulțirii de recapitulat (ultimele 20 de răspunsuri pentru fiecare tablă)
- Întrebările și răspunsurile corecte din Quiz, Provocare, Aventură și Cronometru
- Partidele și recordurile fiecărui mod și ale fiecărui minijoc, inclusiv abandonurile, detaliate după operație
  imediat ce copilul exersează mai multe

### Minijocuri Arcade

Fiecare minijoc oferă:

- Trei niveluri de dificultate, pentru cele patru operații
- Sistem de vieți și scor
- Comenzi cu mouse-ul, tastatura și degetul, descrise în fișa jocului
- Pauză: buton lângă timp sau tasta P; jocul intră în pauză și când fila este
  ascunsă și nu reîncepe niciodată singur
- MultiMemory: opțional, o partidă fără limită de timp
- Suprafață de joc adaptată spațiului disponibil (mai înaltă decât lată pe un telefon în modul portret) și mod ecran complet,
  atât pe calculator, cât și pe telefon, inclusiv când telefonul este rotit (cu excepția iPhone, al cărui browser
  nu permite acest lucru)
- Cele mai bune scoruri ale fiecărui jucător; „Resetează” precizează tot ce șterge

## 🔧 Dezvoltare

### Workflow de dezvoltare

**Nu faceți niciodată commit direct pe main.** Proiectul lucrează cu ramuri de
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

**3. Faceți commit pe ramură**, apoi publicați-o:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Deschideți un pull request** și așteptați analizele: verify, Codacy,
CodeFactor și SonarCloud. Corectați problemele până când toate verificările sunt verzi înainte de îmbinare.

**Stilul commit-urilor**: mesaje concise, la modul imperativ (de exemplu: „Fix arcade init errors”, „Refactor cache updater”)

**Prag de calitate**: asigurați-vă că `npm run lint`, `npm test` și `npm run test:coverage` trec înainte de fiecare commit

### Arhitectura componentelor

**GameMode (clasă de bază)**: toate modurile moștenesc o clasă comună cu metode standardizate.

**GameModeManager**: orchestrarea centralizată a lansării și gestionării modurilor.

**Componente UI**: TopBar, InfoBar, Dashboard și Customization oferă o interfață coerentă.

**Lazy Loading**: modulele sunt încărcate la cerere pentru optimizarea performanței inițiale.

**Event Bus**: comunicare decuplată între componente prin sistemul de evenimente.

### Teste

Proiectul include o suită completă de teste:

- Teste unitare pentru modulele core
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

### Build de producție

- **Rollup**: creează bundle-ul `js/main-es6.js` în ESM, cu code-splitting și sourcemaps
- **Terser**: minificare automată pentru optimizare
- **Post-build**: copierea `css/` și `assets/`, a faviconurilor (`favicon.ico`, `favicon.png`, `favicon.svg`), a `sw.js` și rescrierea `dist/index.html` către fișierul de intrare cu hash (de exemplu: `main-es6-*.js`)
- **Director final**: `dist/`, gata pentru a fi servit static

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integrare continuă

**GitHub Actions**: `.github/workflows/ci.yml`, declanșat la fiecare push pe
`main` și la fiecare pull request.

**`verify`** — pragul de calitate, obligatoriu:

- `npm ci`, apoi `npm run verify` (ESLint, teste Jest, acoperire)
- `npm run format:check` (Prettier)

**`seo-report`** — după `verify`: audit Lighthouse al site-ului online, pentru
urmărirea în timp a metricilor SEO.

**Analize externe** conectate la pull requests: Codacy, CodeFactor și
SonarCloud. Pragul SonarCloud impune calificativul A pentru fiabilitate, securitate și
mentenabilitate în codul nou.

**Implementare**: `./deploy.sh` sincronizează site-ul cu S3 și invalidează memoria cache
CloudFront. Scriptul regenerează, dacă este necesar, imaginile responsive absente din git.

### PWA (Progressive Web App)

LeapMultix este o PWA completă, cu funcționare offline și posibilitate de instalare.

**Service Worker** (`sw.js`):

- Instalare: preîncărcarea tuturor resurselor necesare jocului, pe baza unei liste generate din cod
  de `scripts/precache-list.mjs` (`npm run precache:update`, verificată prin teste): după
  o primă vizită, cele 6 moduri și cele 4 jocuri Arcade pornesc offline
- Navigare: Network-first; offline, pagina jocului din cache (`offline.html` doar
  pentru o pagină care nu a fost salvată niciodată)
- Imagini: Cache-first; offline, o altă dimensiune a aceluiași sprite sau un alt fundal al aceluiași avatar
- Traduceri: Stale-while-revalidate pentru actualizare în fundal
- JS/CSS: Network-first pentru a furniza întotdeauna cea mai recentă versiune, cu cache offline
- Sunete și fonturi: Cache-first, cu servirea intervalelor de octeți (playerul audio din Safari)
- Gestionare automată a versiunilor prin `cache-updater.js`

**Manifest** (`manifest.json`):

- Pictograme SVG și PNG pentru toate dispozitivele
- Posibilitate de instalare pe dispozitive mobile (Add to Home Screen)
- Configurare standalone pentru o experiență similară unei aplicații
- Suport pentru teme și culori

**Testarea modului offline local.** Porniți serverul, apoi deschideți
`http://localhost:8080` (sau portul afișat):

```bash
npm run serve
```

Manual: lăsați pagina deschisă cât timp service worker-ul înregistrează jocul, opriți
serverul (sau deconectați dispozitivul de la rețea), apoi reîmprospătați pagina. Jocul trebuie
să se afișeze, iar fiecare mod trebuie să pornească.

Automat, cu Puppeteer:

```bash
npm run test:pwa-offline
```

**Scripturi pentru gestionarea Service Worker-ului**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Standarde de calitate

**Instrumente pentru calitatea codului**:

- **ESLint**: Configurare modernă cu flat config (`eslint.config.js`), compatibilitate ES2022
- **Prettier**: Formatarea automată a codului (`.prettierrc`)
- **Stylelint**: Validarea CSS (`.stylelintrc.json`)
- **JSDoc**: Documentarea automată a funcțiilor cu analizarea acoperirii

**Reguli importante pentru cod**:

- Eliminarea variabilelor și parametrilor neutilizați (`no-unused-vars`)
- Utilizarea unei gestionări specifice a erorilor (fără blocuri catch goale)
- Evitarea `innerHTML` în favoarea funcțiilor `security-utils.js`
- Menținerea unei complexități cognitive < 15 pentru funcții
- Extragerea funcțiilor complexe în helpers mai mici

**Securitate**:

- **Protecție XSS**: Utilizați funcțiile din `security-utils.js`:
  - `appendSanitizedHTML()` în loc de `innerHTML`
  - `createSafeElement()` pentru crearea elementelor sigure
  - `setSafeMessage()` pentru conținutul textual
- **Scripturi externe**: Atributul `crossorigin="anonymous"` este obligatoriu
- **Validarea datelor de intrare**: Sanitizați întotdeauna datele externe
- **Content Security Policy**: Headere CSP pentru restricționarea surselor de scripturi

**Accesibilitate**:

- Obiectiv WCAG 2.1 nivelul AA, verificat cu axe-core: nicio încălcare de nivel A sau AA și nicio
  încălcare a bunelor practici
- Navigare completă cu tastatura
- Roluri ARIA și nume accesibile
- Contraste verificate cu axe-core

**Performanță**:

- Lazy loading al modulelor prin `lazy-loader.js`
- Optimizări CSS și asset-uri responsive
- Service Worker pentru stocare inteligentă în cache
- Code splitting și minificare în producție

## 📱 Compatibilitate

### Browsere compatibile

Interfața se bazează pe `oklch()` pentru culori și pe `:has()` pentru
stările contextuale, ceea ce stabilește versiunile minime:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispozitive

- **Desktop**: Comenzi prin tastatură și mouse
- **Tablete**: Interfață tactilă optimizată
- **Smartphone-uri**: Design responsive adaptiv

### Accesibilitate

- Navigare completă cu tastatura: Tab, săgeți în grilele de răspunsuri și pe cardurile
  MultiMemory, Enter, Escape; linkul „Mergi la modurile de joc” în partea de sus a paginii principale
- O singură regulă pentru ieșirea dintr-o partidă: „Abandonează”, Escape sau un buton din bara de sus
  afișează aceeași întrebare, iar partida continuă dacă copilul refuză
- Cititoare de ecran: fiecare răspuns este asociat cu întrebarea sa, există un titlu de nivelul 1 pe fiecare ecran, iar
  mesajele sunt anunțate
- Pagina permite mărirea prin gesturi tactile (în afara jocurilor Arcade); dimensiunea textului, contrast ridicat,
  animații reduse și un font de lectură derivat din Andika, conceput pentru cititorii
  începători
- Arcade: pauză (buton, tasta P sau filă ascunsă); MultiMemory fără limită de timp, la alegere
- Verificată cu axe-core (WCAG 2.0 până la 2.2, nivelurile A și AA și bune practici): nicio
  încălcare pe 40 de ecrane la lățime de computer și 39 la lățime de telefon (390 px), inclusiv cu tema
  Noapte și contrast ridicat

## 🌍 Localizare

Compatibilitate multilingvă completă:

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

### Scripturi pentru gestionarea i18n

**`npm run i18n:verify`** - Verificarea consecvenței cheilor de traducere

**`npm run i18n:unused`** - Listarea cheilor de traducere neutilizate

**`npm run i18n:compare`** - Compararea fișierelor de traducere cu fr.json (referință)

Acest script (`scripts/compare-translations.cjs`) asigură sincronizarea tuturor fișierelor de limbă:

**Funcționalități:**

- Detectarea cheilor lipsă (prezente în fr.json, dar absente din alte limbi)
- Detectarea cheilor suplimentare (prezente în alte limbi, dar nu în fr.json)
- Identificarea valorilor goale (`""`, `null`, `undefined`, `[]`)
- Verificarea consecvenței tipurilor (string vs array)
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

- Interfață completă cu utilizatorul
- Instrucțiunile jocurilor
- Mesaje de eroare și feedback
- Descrieri și ajutor contextual
- Conținutul narativ al modului Aventură
- Etichete de accesibilitate și ARIA

## 🔊 Voce înregistrată

Jocul citește cu voce tare întrebările, încurajările și explicațiile. Rostește doar un set finit de fraze, aproximativ 7.400 pentru fiecare limbă: acestea pot fi așadar înregistrate o dată pentru totdeauna, iar în timpul jocului nu mai este apelat niciun serviciu de sinteză. Fără clipuri, jocul utilizează vocea dispozitivului.

### În acest depozit: aplicația, fără voci

Codul poate reda clipuri preînregistrate și include fluxul care le produce. Clipurile nu sunt incluse aici și nici cheile furnizorilor: un fork sau o instalare locală utilizează vocea dispozitivului.

- **Revenire automată** la vocea dispozitivului, frază cu frază: clip absent sau cu eroare, redare refuzată de browser, clip care nu pornește în 1,5 s sau utilizare offline fără clipul în cache.
- **Setări**: butonul pentru voce din bara de sus activează sau dezactivează citirea; caseta „Voce înregistrată” (Accesibilitate și comenzi) permite alegerea între vocea înregistrată și vocea dispozitivului. Aceasta apare numai pentru limbile în care este publicată o voce.
- **Offline**: clipurile deja ascultate rămân în cache (service worker).
- **Unde caută jocul clipurile**: în tagul `<meta name="leapmultix-voice-base">`, gol în depozit. Numai implementarea în producție scrie acolo `/voice/`.

Cu propriile clipuri pe calculator (produse prin fluxul de mai jos și plasate lângă joc în `../leapmultix-voices`), parametrul `?voix=local` permite redarea lor de către serverul de dezvoltare:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Pe leapmultix.jls42.org: vocile găzduite

Site-ul oferit de autor furnizează voci sintetizate și înregistrate:

- în franceză, **Lucie**, creată cu ElevenLabs (modelul Eleven v3);
- în engleza britanică și spaniola din Spania, **Sulafat**, creată cu Google Cloud Text-to-Speech (vocea Chirp 3 HD);
- la alegerea jucătorului, **Sulafat** în franceză, pentru păstrarea aceleiași voci în toate cele trei limbi;
- tot la alegerea jucătorului, **Marie** în franceză și **Jane** în engleză, create cu Mistral AI (Voxtral TTS).

Clipurile se află într-un depozit privat și într-un bucket S3 dedicat, furnizat prin CloudFront la `/voice/*`. Acestea sunt generate o singură dată: în timpul jocului nu este trimis nimic către aceste servicii. În setări, meniul „Voce” oferă vocile disponibile pentru limbă atunci când aceasta are mai multe, iar mențiunea indică serviciul corespunzător vocii auzite.

### Generarea clipurilor

Fluxul este automatizat prin scripturi în `scripts/voice/` și rulează pe calculatorul proprietarului, niciodată în CI-ul public. Cheile furnizorilor (ElevenLabs pentru Lucie, Google Cloud Text-to-Speech pentru Sulafat, Mistral pentru Marie și Jane) rămân într-un fișier `.env` din afara depozitului, transmis prin `node --env-file`: nicio cheie nu ajunge în git. Skill-ul Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) descrie procedura pas cu pas (praguri, aprobări, reluări); detaliile se află în [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimarea** frazelor rămase și a caracterelor care trebuie plătite (Eleven v3: aproximativ 0,53 credite per caracter; Chirp 3 HD: 30 $ pentru un milion de caractere, primul milion din fiecare lună fiind gratuit; Voxtral TTS: 16 $ pentru un milion).
2. **Generarea**. Relansarea aceleiași comenzi continuă cu elementele lipsă. Când creditele sunt epuizate, scriptul se oprește corect (codul 3), fără a lăsa un fișier scris doar parțial. `--max-total-chars` limitează cheltuiala cumulată pentru versiune: fiecare răspuns plătit este înregistrat imediat după primire într-un registru care supraviețuiește unei opriri bruște. Pentru Google și Mistral, care nu oferă un sold ce poate fi consultat, aceasta este singura protecție.
3. **Verificarea**: fiecare frază are propriul clip și fiecare fișier MP3 este valid. Apoi Whisper transcrie local fiecare clip, iar verificarea semnalează numerele înțelese greșit și duratele neobișnuite. `voice:review` execută succesiv Whisper, această verificare și pagina de ascultare printr-o singură comandă.
4. **Ascultarea** pe pagina de ascultare (`voice:listen`) a clipurilor semnalate și a unui eșantion de forme feminine („o dată 7”), pe care Whisper nu le distinge. Fiecare clip are o casetă „de refăcut”, care îl adaugă în lista clipurilor respinse.
5. **Refacerea** clipurilor respinse (`--redo`) și relansarea Whisper, apoi compararea fiecărui clip înainte și după pe o a doua pagină. Un clip care este pronunțat în continuare greșit după două sau trei încercări primește un text impus în `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), de exemplu numărul scris cu litere.
6. **Publicarea** clipurilor, verificarea disponibilității lor online, apoi publicarea indexului limbii, mai întâi pentru testeri (`?voix=test`).
7. **Oferirea** vocii tuturor, apoi activarea ei în mod implicit. Întrerupătorul de siguranță (`voice:publish -- remove`) elimină o limbă din index: jocul revine la vocea dispozitivului.

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

### Regulă: o frază rostită care a fost modificată se reînregistrează înainte de lansarea în producție

Orice frază rostită provine din traduceri (`assets/translations/{fr,en,es}.json`) și face parte din corpus. Prin urmare, modificarea unei fraze rostite provoacă eșuarea testului de blocare a corpusului (`scripts/voice/corpus.lock.json`). Pentru o limbă care are o voce înregistrată, se generează clipurile frazelor afectate, se verifică și se ascultă, apoi se publică **înainte** de fuzionare. La final, se actualizează blocarea (`npm run voice:corpus:lock`). Fără aceste clipuri, fraza modificată este citită cu vocea dispozitivului.

## 📊 Stocarea datelor

### Datele utilizatorilor

- Profiluri și preferințe
- Progresul pentru fiecare mod de joc
- Scoruri și statistici pentru jocurile arcade
- Setări de personalizare

### Funcționalități tehnice

- Stocare locală (localStorage) cu mecanisme de fallback; browserului i se solicită să nu o șteargă
  automat (`navigator.storage.persist()`)
- Coș de gunoi pentru jucătorii șterși: 30 de zile cu toate datele lor, restaurare din
  „Cine joacă?”
- Salvarea jucătorilor într-un fișier JSON, cu restaurare pe acest dispozitiv sau pe altul (un jucător
  deja existent nu este suprascris niciodată)
- Datele jocului sunt organizate pe profiluri, inclusiv statisticile pentru fiecare calcul: pe un calculator partajat, greșelile unui jucător nu influențează întrebările altuia
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

Acest proiect este licențiat sub AGPL v3. Consultați fișierul `LICENSE` pentru mai multe detalii.

---

_LeapMultix — aplicație educațională liberă pentru învățarea celor patru operații_

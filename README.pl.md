<details>
<summary>Ten dokument jest dostępny również w innych językach</summary>

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
![Licencja: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

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

## Spis treści

- [Opis](#opis)
- [Przegląd](#-przegląd)
- [Funkcje](#-funkcje)
- [Szybki start](#-szybki-start)
- [Architektura](#-architektura)
- [Szczegółowe tryby gry](#-szczegółowe-tryby-gry)
- [Programowanie](#-programowanie)
- [Kompatybilność](#-kompatybilność)
- [Lokalizacja](#-lokalizacja)
- [Nagrany głos](#-nagrany-głos)
- [Przechowywanie danych](#-przechowywanie-danych)
- [Zgłoś problem](#-zgłaszanie-problemów)
- [Licencja](#-licencja)

## Opis

LeapMultix to interaktywna edukacyjna aplikacja internetowa przeznaczona dla dzieci w wieku od 6 do 12 lat, pomagająca opanować 4 podstawowe działania arytmetyczne: mnożenie (×), dodawanie (+), odejmowanie (−) i dzielenie (÷). Oferuje **5 trybów gry** i **4 minigry arcade** w intuicyjnym, przystępnym i wielojęzycznym interfejsie.

**Obsługa wielu działań:** wszystkie pięć trybów obsługuje cztery działania. Wyboru dokonuje się na ekranie głównym i obowiązuje on przez całą rozgrywkę.

**Autor:** Julien LS (contact@jls42.org)

**Adres URL online:** https://leapmultix.jls42.org/

## 📸 Przegląd

### Ekrany

|                                                                                                                                  |                                                                                                                         |
| :------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------: |
|                                  ![Ekran „Kto gra?”: wybór profilu](docs/media/01-accueil.webp)                                  |                        ![Menu główne: wybór działania i pięciu trybów](docs/media/02-menu.webp)                         |
|                            **Kto gra?** — profil dla każdego dziecka, z własnym awatarem i postępami.                            |                      **Menu** — tutaj wybiera się działanie, po czym odblokowuje się pięć trybów.                       |
|              ![Tryb Odkrywania: tabliczka mnożenia przez 4 przedstawiona w kropkach](docs/media/03-decouverte.webp)              |                ![Tryb Quizu: błędna odpowiedź na czerwono, poprawna na zielono](docs/media/04-quiz.webp)                |
| **Odkrywanie** — każde działanie jest przedstawiane za pomocą kropek, skoków lub liczenia, wraz ze wskazówką do danej tabliczki. | **Quiz** — wybór dziecka pozostaje wyświetlony obok poprawnej odpowiedzi, a wyjaśnienie szczegółowo opisuje obliczenia. |
|                           ![Tryb Wyzwania: odliczanie czasu i aktualna seria](docs/media/05-defi.webp)                           |              ![Tryb Przygody: mapa dziesięciu poziomów, kolejne zablokowane](docs/media/06-aventure.webp)               |
|        **Wyzwanie** — wyścig z czasem. W przypadku błędu stoper zatrzymuje się na czas przeczytania poprawnej odpowiedzi.        |                 **Przygoda** — dziesięć poziomów odblokowywanych jeden po drugim w zamian za gwiazdki.                  |
|                                    ![Menu Arcade: cztery minigry](docs/media/07-arcade.webp)                                     |          ![Panel główny: gwiazdki za poszczególne tabliczki i statystyki](docs/media/08-tableau-de-bord.webp)           |
|                           **Arcade** — cztery minigry z regulacją poziomu trudności i wyborem statku.                            |          **Panel główny** — gwiazdki za tabliczki, tabliczki do powtórzenia, wyniki w poszczególnych trybach.           |
|                       ![Personalizacja: awatary, motywy, dostępność](docs/media/09-personnalisation.webp)                        |                                                                                                                         |
|               **Personalizacja** — awatar, motyw kolorystyczny, rozmiar tekstu, wysoki kontrast, kod rodzicielski.               |                                                                                                                         |

### Minigry arcade

Cztery gry zadające to samo pytanie — wyświetlane nad obszarem
gry, wraz z pozostałym czasem i liczbą żyć — lecz każdorazowo wymagające innego
działania.

|                                                                                                             |                                                                                                    |
| :---------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: |
|        ![MultiInvaders: potwory z liczbami, statek na dole ekranu](docs/media/10-multiinvaders.webp)        | ![MultiMiam: labirynt, w którym kropki zawierają możliwe odpowiedzi](docs/media/11-multimiam.webp) |
| **MultiInvaders** — strzelaj w błędne odpowiedzi, oszczędzaj poprawną: kryje ona przyjaciela do uwolnienia. |        **MultiMiam** — przemierzaj labirynt, aby zdobyć poprawny wynik, unikając potworów.         |
|  ![MultiMemory: siatka kart, dwie odwrócone pokazujące działanie i liczbę](docs/media/12-multimemory.webp)  |          ![MultiSnake: wąż i ponumerowane jabłka na łące](docs/media/13-multisnake.webp)           |
|            **MultiMemory** — odszukaj z pamięci, która karta zawiera wynik odkrytego działania.             |        **MultiSnake** — rośnij, zjadając poprawne liczby, i unikaj wszystkich pozostałych.         |

## ✨ Funkcje

### 🎮 Tryby gry

- **Tryb Odkrywania**: Wizualna i interaktywna eksploracja dostosowana do każdego działania
- **Tryb Quizu**: Pytania wielokrotnego wyboru z obsługą 4 działań (×, +, −, ÷) i adaptacyjnym systemem postępów
- **Tryb Wyzwania**: Wyścig z czasem obejmujący 4 działania (×, +, −, ÷) oraz różne poziomy trudności
- **Tryb Przygody**: Progresja fabularna podzielona na poziomy z obsługą 4 działań

### 🕹️ Minigry arcade

- **MultiInvaders**: Edukacyjny Space Invaders – niszczenie błędnych odpowiedzi
- **MultiMiam**: Matematyczny Pac-Man – zbieranie poprawnych odpowiedzi
- **MultiMemory**: Gra pamięciowa – łączenie działań z wynikami
- **MultiSnake**: Edukacyjny Snake – rośnięcie poprzez zjadanie właściwych liczb

### ➕ Obsługa wielu działań

LeapMultix oferuje kompleksowy trening 4 działań arytmetycznych we **wszystkich trybach**:

| Tryb       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Wyzwanie   | ✅  | ✅  | ✅  | ✅  |
| Odkrywanie | ✅  | ✅  | ✅  | ✅  |
| Przygoda   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funkcje ogólne

- **Wielu użytkowników**: Zarządzanie indywidualnymi profilami z zapisem postępów
- **Wielojęzyczność**: Obsługa języka francuskiego, angielskiego i hiszpańskiego
- **Personalizacja**: Awatary, motywy kolorystyczne, tła
- **Dostępność**: Nawigacja za pomocą klawiatury, obsługa dotykowa, zgodność z WCAG 2.1 AA
- **Nagrany głos**: gra potrafi odczytywać pytania i słowa zachęty za pomocą nagranego głosu syntezatora, z automatycznym przełączeniem na głos urządzenia w razie potrzeby. Głosy nie znajdują się w tym repozytorium: strona leapmultix.jls42.org udostępnia głos Lucie w języku francuskim, Sulafat w języku angielskim i hiszpańskim, a także do wyboru Marie w języku francuskim i Jane w języku angielskim (zob. [Nagrany głos](#-nagrany-głos))
- **Responsywność mobilna**: Interfejs zoptymalizowany pod kątem tabletów i smartfonów
- **System postępów**: Wyniki, odznaki, codzienne wyzwania

## 🚀 Szybki start

### Wymagania wstępne

- Node.js (w wersji 16 lub nowszej)
- Nowoczesna przeglądarka internetowa

### Instalacja

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

### Dostępne skrypty

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

## 🧱 Architektura

### Struktura plików

Moduły JavaScript znajdują się **bezpośrednio w katalogu `js/`**, z wyjątkiem trzech folderów:
`core/`, `components/` oraz `modes/`. To nazwa pliku określa zatem jego
przynależność do grupy (`arcade-*`, `multimiam-*`, `i18n*`…).

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

### Architektura techniczna

**Nowoczesne moduły ES6**: Projekt wykorzystuje architekturę modułową z klasami ES6 oraz natywnymi importami/eksportami.

**Komponenty wielokrotnego użytku**: Interfejs zbudowany ze scentralizowanych komponentów UI (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Inteligentne ładowanie modułów na żądanie za pośrednictwem `lazy-loader.js` w celu optymalizacji wydajności początkowej.

**Ujednolicony system przechowywania danych**: Scentralizowane API do utrwalania danych użytkownika za pośrednictwem LocalStorage z mechanizmami awaryjnymi (fallbacks).

**Scentralizowane zarządzanie dźwiękiem**: Kontrola dźwięku z obsługą wielu języków i preferencjami dla poszczególnych użytkowników.

**Event Bus**: Rozproszona komunikacja oparta na zdarzeniach między komponentami w celu zapewnienia łatwej w utrzymaniu architektury.

**Nawigacja za pomocą slajdów**: System nawigacji oparty na ponumerowanych slajdach (slide0, slide1 itd.) z wykorzystaniem `goToSlide()`.

**Bezpieczeństwo**: Ochrona przed atakami XSS i sanityzacja danych za pośrednictwem `security-utils.js` dla wszystkich operacji na DOM.

## 🎯 Szczegółowe tryby gry

### Tryb Odkrywania

Interfejs do wizualnej eksploracji tabliczki mnożenia oferujący:

- Interaktywną wizualizację mnożenia
- Animacje i pomoce pamięciowe
- Edukacyjną mechanikę „przeciągnij i upuść”
- Swobodny postęp według wybranej tabliczki

### Tryb Quizu

Pytania wielokrotnego wyboru z:

- 10 pytaniami na sesję
- Adaptacyjną progresją zależną od poprawnych odpowiedzi
- Wirtualną klawiaturą numeryczną
- Systemem serii (streak) poprawnych odpowiedzi

### Tryb Wyzwania

Wyścig z czasem oferujący:

- 3 poziomy trudności (Początkujący, Średni, Trudny)
- Dodatkowy czas za poprawne odpowiedzi
- System żyć
- Tabelę najlepszych wyników

### Tryb Przygody

Fabularyzowana progresja z:

- 10 poziomami tematycznymi do odblokowania
- Interaktywną mapą z wizualnym wskaźnikiem postępu
- Wciągającą fabułą z postaciami
- Systemem gwiazdek i nagród

### Minigry arcade

Każda minigra oferuje:

- Wybór poziomu trudności i personalizację
- System żyć i punktacji
- Sterowanie klawiaturą oraz dotykowe
- Indywidualne rankingi dla poszczególnych użytkowników

## 🔧 Programowanie

### Przebieg prac programistycznych

**Nigdy nie commituj bezpośrednio do gałęzi main.** Prace w projekcie odbywają się na gałęziach
funkcjonalnych (feature branches).

**1. Utwórz gałąź**, `feat/` dla nowej funkcji, `fix/` dla poprawki błędu:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Programuj i sprawdzaj.** Formatowanie kodu jest najważniejsze: CI odrzuci go
jeszcze przed uruchomieniem testów.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Zatwierdź zmiany (commit) na gałęzi**, a następnie ją wypchnij (push):

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Otwórz pull request** i poczekaj na wyniki analiz: verify, Codacy,
CodeFactor oraz SonarCloud. Poprawki wprowadza się aż do uzyskania zielonego statusu przed scaleniem.

**Styl commitów**: Zwięzłe komunikaty w trybie rozkazującym (np. "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Przed każdym commitem upewnij się, że `npm run lint`, `npm test` i `npm run test:coverage` przechodzą pomyślnie

### Architektura komponentów

**GameMode (klasa bazowa)**: Wszystkie tryby dziedziczą ze wspólnej klasy o ustandaryzowanych metodach.

**GameModeManager**: Scentralizowana orkiestracja uruchamiania i zarządzania trybami.

**Komponenty UI**: TopBar, InfoBar, Dashboard i Customization zapewniają spójny interfejs.

**Lazy Loading**: Moduły są ładowane na żądanie, aby zoptymalizować początkową wydajność.

**Event Bus**: Rozproszona komunikacja między komponentami za pośrednictwem systemu zdarzeń.

### Testy

Projekt zawiera kompleksowy zestaw testów:

- Testy jednostkowe modułów core
- Testy integracyjne komponentów
- Testy trybów gry
- Zautomatyzowane pokrycie kodu

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Kompilacja produkcyjna

- **Rollup**: Pakowanie `js/main-es6.js` do formatu ESM z podziałem kodu (code-splitting) i mapami źródłowymi (sourcemaps)
- **Terser**: Automatyczna minifikacja w celu optymalizacji
- **Post-build**: Kopiowanie `css/` i `assets/`, faviconów (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` oraz przepisanie `dist/index.html` do haszowanego pliku wejściowego (np. `main-es6-*.js`)
- **Folder końcowy**: `dist/` gotowy do serwowania jako pliki statyczne

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Ciągła integracja (CI)

**GitHub Actions**: `.github/workflows/ci.yml`, uruchamiane przy każdym wypchnięciu (push) do
`main` oraz przy każdym pull requeście.

**`verify`** — bramka jakości (quality gate), blokująca:

- `npm ci`, a następnie `npm run verify` (ESLint, testy Jest, pokrycie kodu)
- `npm run format:check` (Prettier)

**`seo-report`** — po `verify`: audyt Lighthouse działającej witryny w celu
długoterminowego monitorowania wskaźników SEO.

**Zewnętrzne analizy** powiązane z pull requestami: Codacy, CodeFactor i
SonarCloud. Bramka SonarCloud wymaga oceny A pod względem niezawodności, bezpieczeństwa i
łatwości konserwacji dla nowego kodu.

**Wdrożenie**: `./deploy.sh` synchronizuje witrynę z S3 i unieważnia pamięć podręczną
CloudFront. W razie potrzeby skrypt ponownie generuje obrazy responsywne, których nie ma w gicie.

### PWA (Progressive Web App)

LeapMultix to pełnoprawna aplikacja PWA z obsługą trybu offline i możliwością instalacji.

**Service Worker** (`sw.js`):

- Nawigacja: Network-first z trybem awaryjnym offline do `offline.html`
- Obrazy: Cache-first w celu optymalizacji wydajności
- Tłumaczenia: Stale-while-revalidate do aktualizacji w tle
- JS/CSS: Network-first, aby zawsze serwować najnowszą wersję
- Automatyczne zarządzanie wersjami za pośrednictwem `cache-updater.js`

**Manifest** (`manifest.json`):

- Ikony SVG i PNG dla wszystkich urządzeń
- Możliwość instalacji na urządzeniach mobilnych (Dodaj do ekranu głównego)
- Konfiguracja w trybie autonomicznym (standalone) zapewniająca wrażenia typowe dla aplikacji natywnej
- Obsługa motywów i kolorów

**Testowanie trybu offline lokalnie.** Uruchom serwer, a następnie otwórz
`http://localhost:8080` (lub wyświetlony port):

```bash
npm run serve
```

Ręcznie: odłącz sieć w narzędziach deweloperskich (karta Sieć,
tryb offline), a następnie odśwież stronę. Powinien wyświetlić się plik `offline.html`.

Automatycznie za pomocą Puppeteer:

```bash
npm run test:pwa-offline
```

**Skrypty zarządzania Service Workerem**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Standardy jakości

**Narzędzia jakości kodu**:

- **ESLint**: Nowoczesna konfiguracja typu flat config (`eslint.config.js`), obsługa ES2022
- **Prettier**: Automatyczne formatowanie kodu (`.prettierrc`)
- **Stylelint**: Walidacja CSS (`.stylelintrc.json`)
- **JSDoc**: Automatyczna dokumentacja funkcji z analizą pokrycia

**Ważne reguły kodu**:

- Usuwanie nieużywanych zmiennych i parametrów (`no-unused-vars`)
- Stosowanie precyzyjnej obsługi błędów (brak pustych bloków catch)
- Unikanie `innerHTML` na rzecz funkcji `security-utils.js`
- Utrzymywanie złożoności poznawczej funkcji < 15
- Wydzielanie złożonych funkcji do mniejszych funkcji pomocniczych (helpers)

**Bezpieczeństwo**:

- **Ochrona przed XSS**: Używanie funkcji z `security-utils.js`:
  - `appendSanitizedHTML()` zamiast `innerHTML`
  - `createSafeElement()` do tworzenia bezpiecznych elementów
  - `setSafeMessage()` dla zawartości tekstowej
- **Zewnętrzne skrypty**: Wymagany atrybut `crossorigin="anonymous"`
- **Walidacja danych wejściowych**: Zawsze sanityzować dane zewnętrzne
- **Content Security Policy**: Nagłówki CSP ograniczające źródła skryptów

**Dostępność**:

- Zgodność z WCAG 2.1 AA
- Pełna nawigacja za pomocą klawiatury
- Odpowiednie role ARIA i etykiety
- Zgodne kontrasty kolorów

**Wydajność**:

- Lazy loading modułów poprzez `lazy-loader.js`
- Optymalizacje CSS i responsywne zasoby
- Service Worker do inteligentnego buforowania
- Code splitting i minifikacja na produkcji

## 📱 Kompatybilność

### Obsługiwane przeglądarki

Interfejs opiera się na `oklch()` w zakresie kolorów oraz na `:has()` w zakresie
stanów kontekstowych, co wyznacza wymagania minimalne:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Urządzenia

- **Komputery stacjonarne**: Obsługa za pomocą klawiatury i myszy
- **Tablety**: Zoptymalizowany interfejs dotykowy
- **Smartfony**: Adaptacyjny, responsywny design

### Dostępność

- Pełna nawigacja za pomocą klawiatury (Tab, strzałki, Esc)
- Role ARIA i etykiety dla czytników ekranu
- Zgodne kontrasty kolorów
- Obsługa technologii wspomagających

## 🌍 Lokalizacja

Pełne wsparcie wielojęzyczne:

- **Francuski** (język domyślny)
- **Angielski**
- **Hiszpański**

### Zarządzanie tłumaczeniami

**Pliki tłumaczeń:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Skrypty zarządzania i18n

**`npm run i18n:verify`** - Sprawdzanie spójności kluczy tłumaczeń

**`npm run i18n:unused`** - Wyświetlanie listy nieużywanych kluczy tłumaczeń

**`npm run i18n:compare`** - Porównywanie plików tłumaczeń z fr.json (wzorzec)

Ten skrypt (`scripts/compare-translations.cjs`) zapewnia synchronizację wszystkich plików językowych:

**Funkcjonalności:**

- Wykrywanie brakujących kluczy (obecnych w fr.json, ale brakujących w innych językach)
- Wykrywanie nadmiarowych kluczy (obecnych w innych językach, ale nie w fr.json)
- Identyfikacja pustych wartości (`""`, `null`, `undefined`, `[]`)
- Weryfikacja spójności typów (string vs array)
- Spłaszczanie zagnieżdżonych struktur JSON do notacji kropkowej (np. `arcade.multiMemory.title`)
- Generowanie szczegółowego raportu w konsoli
- Zapisywanie raportu JSON w `docs/translations-comparison-report.json`

**Przykładowy wynik:**

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

**Pokrycie tłumaczeń:**

- Kompletny interfejs użytkownika
- Instrukcje do gier
- Komunikaty błędów i informacje zwrotne
- Opisy i pomoc kontekstowa
- Zawartość fabularna trybu Przygoda
- Etykiety dostępności i ARIA

## 🔊 Nagrany głos

Gra odczytuje na głos pytania, słowa zachęty i wyjaśnienia. Wypowiada jedynie skończony zbiór zdań, około 7400 na język: można je zatem nagrać raz na zawsze, dzięki czemu żadna rozgrywka nie odwołuje się do usługi syntezy mowy. Bez nagrań gra czyta głosem urządzenia.

### W tym repozytorium: aplikacja bez głosów

Kod potrafi odtwarzać wstępnie nagrane klipy i zawiera cały proces do ich generowania. Klipów jednak w nim nie ma, podobnie jak kluczy dostawców: fork lub instalacja lokalna odczytuje teksty za pomocą głosu urządzenia.

- **Automatyczne przełączanie awaryjne** na głos urządzenia, zdanie po zdaniu: brak klipu lub błąd, odmowa odtworzenia przez przeglądarkę, klip nierozpoczynający się w ciągu 1,5 s lub praca w trybie offline bez klipu w pamięci podręcznej.
- **Ustawienia**: przycisk głosu na górnym pasku włącza lub wycisza odczyt; pole wyboru „Nagrany głos” (Dostępność i sterowanie) pozwala wybrać między nagranym głosem a głosem urządzenia. Pojawia się ono tylko w językach, dla których głos został opublikowany.
- **Tryb offline**: już odsłuchane klipy pozostają w pamięci podręcznej (service worker).
- **Gdzie gra szuka klipów**: w znaczniku `<meta name="leapmultix-voice-base">`, pustym w repozytorium. Tylko wdrożenie produkcyjne wpisuje tam `/voice/`.

Mając własne klipy na maszynie lokalnej (wygenerowane przez poniższy proces, umieszczone obok gry w `../leapmultix-voices`), parametr `?voix=local` sprawia, że są one odczytywane przez serwer deweloperski:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Na leapmultix.jls42.org: głosy z hostingu

Strona udostępniona przez autora serwuje nagrane głosy syntezy:

- po francusku: **Lucie**, utworzona za pomocą ElevenLabs (model Eleven v3);
- w brytyjskim angielskim i hiszpańskim z Hiszpanii: **Sulafat**, utworzona za pomocą Google Cloud Text-to-Speech (głos Chirp 3 HD);
- do wyboru przez gracza: **Marie** po francusku i **Jane** po angielsku, utworzone za pomocą Mistral AI (Voxtral TTS).

Klipy znajdują się w prywatnym repozytorium oraz w dedykowanym buckecie S3, serwowanym przez CloudFront pod adresem `/voice/*`. W ustawieniach menu „Głos” proponuje głosy dostępne dla danego języka, jeśli jest ich kilka, a dopisek wskazuje usługę, z której pochodzi odsłuchiwany głos.

### Generowanie klipów

Proces jest oskryptowany w `scripts/voice/` i uruchamiany na maszynie właściciela, nigdy w publicznym CI. Klucze dostawców (ElevenLabs dla francuskiego, Google Cloud Text-to-Speech dla angielskiego i hiszpańskiego, Mistral dla Marie i Jane) pozostają w pliku `.env` poza repozytorium, przekazywanym przez `node --env-file`: żaden klucz nie trafia do gita. Umiejętność Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) prowadzi krok po kroku przez procedurę (bramki, zatwierdzenia, wznowienia); szczegóły znajdują się w [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Oszacować** pozostałe zdania i płatne znaki (Eleven v3: około 0,53 kredytu za znak; Chirp 3 HD: 30 $ za milion znaków, pierwszy milion każdego miesiąca za darmo; Voxtral TTS: 16 $ za milion).
2. **Wygenerować**. Ponowne uruchomienie tego samego polecenia wznawia brakujące elementy. Gdy kredyty się wyczerpią, skrypt kończy działanie w czysty sposób (kod 3), nie pozostawiając częściowo zapisanego pliku. `--max-total-chars` ogranicza łączny wydatek dla danej wersji: każda opłacona odpowiedź jest zapisywana natychmiast po odebraniu w rejestrze, który przetrwa nagłe przerwanie działania. W przypadku Google i Mistral, które nie podają czytelnego salda, jest to jedyna ochrona.
3. **Sprawdzić**: każde zdanie ma swój klip, a każdy plik MP3 jest prawidłowy. Następnie Whisper dokonuje lokalnej transkrypcji każdego klipu, a kontrola zgłasza błędnie usłyszane liczby oraz nietypowe długości trwania. `voice:review` łączy Whisper, tę kontrolę i stronę odsłuchu w jedno polecenie.
4. **Odsłuchać** na stronie odsłuchu (`voice:listen`) zgłoszone klipy oraz próbkę form żeńskich („une fois 7”), których Whisper nie rozróżnia. Każdy klip ma pole wyboru „do poprawki”, które dodaje go do listy odrzuconych klipów.
5. **Poprawić** odrzucone klipy (`--redo`) i ponownie uruchomić Whisper, a następnie porównać każdy klip przed i po na drugiej stronie. Klip, który po dwóch lub trzech próbach nadal jest niepoprawnie wypowiadany, otrzymuje narzucony tekst w `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), na przykład liczbę słownie.
6. **Opublikować** klipy, sprawdzić, czy odpowiadają w sieci, a następnie opublikować indeks danego języka, najpierw dla testerów (`?voix=test`).
7. **Udostępnić** głos wszystkim, a następnie włączyć go domyślnie. Mechanizm awaryjny (`voice:publish -- remove`) usuwa język z indeksu: gra powraca do głosu urządzenia.

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

### Reguła: zmienione wypowiadane zdanie należy nagrać ponownie przed wdrożeniem na produkcję

Każde wypowiadane zdanie pochodzi z tłumaczeń (`assets/translations/{fr,en,es}.json`) i jest częścią korpusu. Zmiana wypowiadanego zdania powoduje więc niepowodzenie testu blokady korpusu (`scripts/voice/corpus.lock.json`). W przypadku języka, który posiada nagrany głos, generuje się wtedy klipy dla zmienionych zdań, sprawdza je i odsłuchuje, a następnie publikuje **przed** scaleniem. Na koniec aktualizuje się plik blokady (`npm run voice:corpus:lock`). Bez tych klipów zmodyfikowane zdanie jest odczytywane głosem urządzenia.

## 📊 Przechowywanie danych

### Dane użytkownika

- Profile i preferencje
- Postępy w poszczególnych trybach gry
- Wyniki i statystyki gier zręcznościowych
- Ustawienia personalizacji

### Funkcjonalności techniczne

- Pamięć lokalna (localStorage) z mechanizmami zapasowymi
- Izolacja danych na poziomie użytkownika
- Automatyczny zapis postępów
- Automatyczna migracja starszych danych

## 🐛 Zgłaszanie problemów

Problemy można zgłaszać za pośrednictwem GitHub Issues. Prosimy o dołączenie:

- Szczegółowego opisu problemu
- Kroków do jego odtworzenia
- Nazwy przeglądarki i jej wersji
- Zrzutów ekranu, jeśli są istotne

## 💝 Wsparcie projektu

**[☕ Przekaż darowiznę przez PayPal](https://paypal.me/jls)**

## 📄 Licencja

Ten projekt jest objęty licencją AGPL v3. Więcej szczegółów znajduje się w pliku `LICENSE`.

---

_LeapMultix — darmowa, otwarta aplikacja edukacyjna do nauki czterech działań arytmetycznych_

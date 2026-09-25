<details>
<summary>Ten dokument jest również dostępny w innych językach</summary>

- [Angielski](./README.en.md)
- [Hiszpański](./README.es.md)
- [Portugalski](./README.pt.md)
- [Niemiecki](./README.de.md)
- [Chiński](./README.zh.md)
- [Hindi](./README.hi.md)
- [Arabski](./README.ar.md)
- [Włoski](./README.it.md)
- [Szwedzki](./README.sv.md)
- [Polski](./README.pl.md)
- [Niderlandzki](./README.nl.md)
- [Rumuński](./README.ro.md)
- [Japoński](./README.ja.md)
- [Koreański](./README.ko.md)

</details>

# LeapMultix

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Licencja: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Odznaka Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Stan bramki jakości](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Ocena niezawodności](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Ocena bezpieczeństwa](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Ocena łatwości utrzymania](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Dług techniczny](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Błędy](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Podatności](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Problemy z jakością kodu](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Zduplikowane wiersze (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Wiersze kodu](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## Spis treści

- [Opis](#opis)
- [Przegląd](#-przegląd)
- [Funkcje](#-funkcje)
- [Szybki start](#-szybki-start)
- [Architektura](#-architektura)
- [Szczegółowe tryby gry](#-szczegółowe-tryby-gry)
- [Programowanie](#-programowanie)
- [Zgodność](#-zgodność)
- [Lokalizacja](#-lokalizacja)
- [Nagrany głos](#-nagrany-głos)
- [Przechowywanie danych](#-przechowywanie-danych)
- [Zgłaszanie problemów](#-zgłaszanie-problemu)
- [Licencja](#-licencja)

## Opis

LeapMultix to interaktywna edukacyjna aplikacja internetowa przeznaczona dla dzieci w wieku od 6 do 12 lat, pomagająca opanować 4 działania arytmetyczne: mnożenie (×), dodawanie (+), odejmowanie (−) i dzielenie (÷). Oferuje **5 trybów gry** i **4 minigry zręcznościowe** w intuicyjnym, dostępnym i wielojęzycznym interfejsie.

**Obsługa wielu działań:** wszystkie pięć trybów obsługuje cztery działania. Wyboru dokonuje się na ekranie głównym i obowiązuje on podczas całej rozgrywki.

**Autor:** Julien LS (contact@jls42.org)

**Adres online:** https://leapmultix.jls42.org/

## 📸 Przegląd

### Ekrany

|                                                                                                                                  |                                                                                                                            |
| :------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: |
|                                  ![Ekran „Kto gra?”: wybór profilu](docs/media/01-accueil.webp)                                  |                     ![Menu główne: wybór działania i jednego z pięciu trybów](docs/media/02-menu.webp)                     |
|                          **Kto gra?** — jeden profil dla każdego dziecka, z jego awatarem i postępami.                           |                     **Menu** — tutaj wybiera się działanie, a następnie otwiera jeden z pięciu trybów.                     |
|           ![Tryb Odkrywanie: tabliczka mnożenia przez 4 przedstawiona za pomocą kropek](docs/media/03-decouverte.webp)           |                 ![Tryb Quiz: błędna odpowiedź na czerwono, prawidłowa na zielono](docs/media/04-quiz.webp)                 |
| **Odkrywanie** — każde równanie jest przedstawiane za pomocą kropek, skoków lub liczenia, wraz ze wskazówką dotyczącą tabliczki. | **Quiz** — wybór dziecka pozostaje widoczny obok prawidłowej odpowiedzi, a wyjaśnienie szczegółowo przedstawia obliczenie. |
|                              ![Tryb Wyzwanie: odliczanie i bieżąca seria](docs/media/05-defi.webp)                               |              ![Tryb Przygoda: mapa dziesięciu poziomów, kolejne są zablokowane](docs/media/06-aventure.webp)               |
|    **Wyzwanie** — wyścig z czasem. Po błędzie stoper zatrzymuje się na czas potrzebny do przeczytania prawidłowej odpowiedzi.    |                   **Przygoda** — dziesięć poziomów odblokowywanych jeden po drugim w zamian za gwiazdki.                   |
|                                    ![Menu Arcade: cztery minigry](docs/media/07-arcade.webp)                                     |                    ![Panel: gwiazdki według tabliczki i statystyki](docs/media/08-tableau-de-bord.webp)                    |
|                     **Arcade** — cztery minigry z możliwością ustawienia poziomu trudności i wyboru statku.                      |                   **Panel** — gwiazdki według tabliczki, tabliczki do powtórzenia i wyniki według trybu.                   |
|                       ![Personalizacja: awatary, motywy, dostępność](docs/media/09-personnalisation.webp)                        |                                                                                                                            |
|              **Personalizacja** — awatar, motyw kolorystyczny, rozmiar tekstu, wysoki kontrast i kod rodzicielski.               |                                                                                                                            |

### Minigry zręcznościowe

Cztery gry, które zadają to samo pytanie — wyświetlane nad obszarem
gry wraz z pozostałym czasem i liczbą żyć — ale za każdym razem wymagają
innego działania.

|                                                                                                                             |                                                                                                        |
| :-------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|                ![MultiInvaders: potwory z liczbami i statek u dołu ekranu](docs/media/10-multiinvaders.webp)                | ![MultiMiam: labirynt, w którym kropki przedstawiają możliwe odpowiedzi](docs/media/11-multimiam.webp) |
| **MultiInvaders** — strzelaj do błędnych odpowiedzi, oszczędzając właściwą: ukrywa ona przyjaciela, którego trzeba uwolnić. |         **MultiMiam** — przemierzaj labirynt, aby złapać prawidłowy wynik, unikając potworów.          |
|           ![MultiMemory: siatka kart, dwie odwrócone pokazują działanie i liczbę](docs/media/12-multimemory.webp)           |            ![MultiSnake: wąż i ponumerowane jabłka na łące](docs/media/13-multisnake.webp)             |
|               **MultiMemory** — przypomnij sobie, na której karcie znajduje się wynik odwróconego działania.                |          **MultiSnake** — rośnij, połykając właściwe liczby, i unikaj wszystkich pozostałych.          |

## ✨ Funkcje

### 🎮 Tryby gry

- **Tryb Odkrywanie**: Wizualna i interaktywna nauka dostosowana do każdego działania
- **Tryb Quiz**: Pytania wielokrotnego wyboru z obsługą 4 działań (×, +, −, ÷) i adaptacyjnym systemem postępów
- **Tryb Wyzwanie**: Wyścig z czasem obejmujący 4 działania (×, +, −, ÷) i różne poziomy trudności
- **Tryb Przygoda**: Fabularne przechodzenie kolejnych poziomów z obsługą 4 działań

### 🕹️ Minigry Arcade

- **MultiInvaders**: Edukacyjne Space Invaders — niszczenie błędnych odpowiedzi
- **MultiMiam**: Matematyczny Pac-Man — zbieranie prawidłowych odpowiedzi
- **MultiMemory**: Gra pamięciowa — łączenie działań z wynikami
- **MultiSnake**: Edukacyjny Snake — rośnięcie poprzez zjadanie właściwych liczb

### ➕ Obsługa wielu działań

LeapMultix zapewnia kompleksowy trening 4 działań arytmetycznych we **wszystkich trybach**:

| Tryb       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Wyzwanie   | ✅  | ✅  | ✅  | ✅  |
| Odkrywanie | ✅  | ✅  | ✅  | ✅  |
| Przygoda   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funkcje wspólne

- **Wielu użytkowników**: Zarządzanie indywidualnymi profilami z zapisywaniem postępów
- **Wielojęzyczność**: Obsługa języka francuskiego, angielskiego i hiszpańskiego
- **Personalizacja**: Awatary, motywy kolorystyczne i tła
- **Dostępność**: Nawigacja za pomocą klawiatury, obsługa dotyku i zgodność z WCAG 2.1 AA
- **Nagrany głos**: pytania i słowa zachęty odczytywane przez wcześniej nagrany głos syntetyczny (utworzony za pomocą ElevenLabs), z automatycznym przełączeniem na głos urządzenia; klipy nie znajdują się w publicznym repozytorium (zobacz [Nagrany głos](#-nagrany-głos))
- **Responsywność mobilna**: Interfejs zoptymalizowany dla tabletów i smartfonów
- **System postępów**: Wyniki, odznaki i codzienne wyzwania

## 🚀 Szybki start

### Wymagania wstępne

- Node.js (wersja 16 lub nowsza)
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
npm run voice:generate     # Générer les clips (ElevenLabs)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Architektura

### Struktura plików

Moduły JavaScript znajdują się **bezpośrednio w `js/`**, z wyjątkiem trzech katalogów:
`core/`, `components/` i `modes/`. Dlatego to nazwa pliku określa jego
grupę (`arcade-*`, `multimiam-*`, `i18n*`…).

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

**Nowoczesne moduły ES6**: Projekt wykorzystuje architekturę modułową z klasami ES6 oraz natywnymi importami i eksportami.

**Komponenty wielokrotnego użytku**: Interfejs zbudowano z użyciem scentralizowanych komponentów UI (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Inteligentne ładowanie modułów na żądanie za pomocą `lazy-loader.js` w celu optymalizacji początkowej wydajności.

**Ujednolicony system przechowywania**: Scentralizowane API do utrwalania danych użytkownika za pomocą LocalStorage z mechanizmami awaryjnymi.

**Scentralizowane zarządzanie dźwiękiem**: Sterowanie dźwiękiem z obsługą wielu języków i preferencjami dla poszczególnych użytkowników.

**Event Bus**: Rozdzielona komunikacja oparta na zdarzeniach między komponentami, zapewniająca łatwą w utrzymaniu architekturę.

**Nawigacja za pomocą slajdów**: System nawigacji oparty na numerowanych slajdach (slide0, slide1 itd.) z użyciem `goToSlide()`.

**Bezpieczeństwo**: Ochrona przed XSS i sanityzacja za pomocą `security-utils.js` przy wszystkich operacjach na DOM.

## 🎯 Szczegółowe tryby gry

### Tryb Odkrywanie

Interfejs do wizualnego poznawania tabliczki mnożenia, obejmujący:

- Interaktywną wizualizację mnożenia
- Animacje i pomoce pamięciowe
- Edukacyjne przeciąganie i upuszczanie
- Swobodny postęp w obrębie każdej tabliczki

### Tryb Quiz

Pytania wielokrotnego wyboru obejmujące:

- 10 pytań na sesję
- Adaptacyjny postęp zależny od poprawnych odpowiedzi
- Wirtualną klawiaturę numeryczną
- System streak (serii poprawnych odpowiedzi)

### Tryb Wyzwanie

Wyścig z czasem obejmujący:

- 3 poziomy trudności (Początkujący, Średni, Trudny)
- Premię czasową za prawidłowe odpowiedzi
- System żyć
- Ranking najlepszych wyników

### Tryb Przygoda

Fabularne przechodzenie kolejnych etapów obejmujące:

- 10 tematycznych poziomów do odblokowania
- Interaktywną mapę z wizualizacją postępów
- Wciągającą historię z postaciami
- System gwiazdek i nagród

### Minigry Arcade

Każda minigra oferuje:

- Wybór poziomu trudności i personalizację
- System żyć i punktacji
- Sterowanie klawiaturą i dotykiem
- Indywidualne rankingi dla każdego użytkownika

## 🔧 Programowanie

### Workflow programistyczny

**Nigdy nie commituj bezpośrednio do main.** W projekcie używa się osobnych gałęzi dla
poszczególnych funkcji.

**1. Utwórz gałąź** — `feat/` dla nowej funkcji lub `fix/` dla poprawki:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Wprowadź zmiany i je sprawdź.** Formatowanie jest wykonywane jako pierwsze: CI odrzuca je
jeszcze przed uruchomieniem testów.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Utwórz commit na gałęzi**, a następnie ją wypchnij:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Otwórz pull request** i poczekaj na analizy: verify, Codacy,
CodeFactor oraz SonarCloud. Przed scaleniem poprawiaj błędy, aż wszystkie kontrole zakończą się powodzeniem.

**Styl commitów**: Zwięzłe komunikaty w trybie rozkazującym (np. „Fix arcade init errors”, „Refactor cache updater”)

**Quality gate**: Przed każdym commitem upewnij się, że `npm run lint`, `npm test` i `npm run test:coverage` przechodzą pomyślnie

### Architektura komponentów

**GameMode (klasa bazowa)**: Wszystkie tryby dziedziczą po wspólnej klasie ze standaryzowanymi metodami.

**GameModeManager**: Scentralizowana koordynacja uruchamiania trybów i zarządzania nimi.

**Komponenty UI**: TopBar, InfoBar, Dashboard i Customization zapewniają spójny interfejs.

**Lazy Loading**: Moduły są ładowane na żądanie w celu optymalizacji początkowej wydajności.

**Event Bus**: Rozdzielona komunikacja między komponentami za pośrednictwem systemu zdarzeń.

### Testy

Projekt zawiera kompletny zestaw testów:

- Testy jednostkowe modułów core
- Testy integracyjne komponentów
- Testy trybów gry
- Automatyczny pomiar pokrycia kodu

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Build produkcyjny

- **Rollup**: Tworzy bundle `js/main-es6.js` w formacie ESM z code-splittingiem i sourcemapami
- **Terser**: Automatyczna minifikacja w celu optymalizacji
- **Post-build**: Kopiuje `css/` i `assets/`, favikony (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` oraz przepisuje `dist/index.html`, wskazując plik wejściowy z hashem (np. `main-es6-*.js`)
- **Katalog wynikowy**: `dist/` gotowy do statycznego udostępniania

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Ciągła integracja

**GitHub Actions**: `.github/workflows/ci.yml`, uruchamiany przy każdym pushu do
`main` oraz przy każdym pull requeście.

**`verify`** — obowiązkowa bramka jakości:

- `npm ci`, a następnie `npm run verify` (ESLint, testy Jest, pokrycie)
- `npm run format:check` (Prettier)

**`seo-report`** — po `verify`: audyt Lighthouse witryny online służący do
długoterminowego śledzenia metryk SEO.

**Zewnętrzne analizy** podłączone do pull requestów: Codacy, CodeFactor i
SonarCloud. Bramka SonarCloud wymaga ocen A za niezawodność, bezpieczeństwo i
łatwość utrzymania nowego kodu.

**Wdrożenie**: `./deploy.sh` synchronizuje witrynę z S3 i unieważnia pamięć podręczną
CloudFront. W razie potrzeby skrypt ponownie generuje responsywne obrazy, których nie ma w git.

### PWA (Progressive Web App)

LeapMultix to kompletna PWA z obsługą trybu offline i możliwością instalacji.

**Service Worker** (`sw.js`):

- Nawigacja: Network-first z awaryjnym przejściem offline do `offline.html`
- Obrazy: Cache-first w celu optymalizacji wydajności
- Tłumaczenia: Stale-while-revalidate umożliwiające aktualizację w tle
- JS/CSS: Network-first, aby zawsze udostępniać najnowszą wersję
- Automatyczne zarządzanie wersjami za pomocą `cache-updater.js`

**Manifest** (`manifest.json`):

- Ikony SVG i PNG dla wszystkich urządzeń
- Możliwość instalacji na urządzeniach mobilnych (Add to Home Screen)
- Konfiguracja standalone zapewniająca doświadczenie podobne do aplikacji
- Obsługa motywów i kolorów

**Lokalne testowanie trybu offline.** Uruchom serwer, a następnie otwórz
`http://localhost:8080` (lub wyświetlony port):

```bash
npm run serve
```

Ręcznie: wyłącz sieć w narzędziach deweloperskich (karta Sieć,
tryb offline), a następnie odśwież stronę. Powinien wyświetlić się `offline.html`.

Automatycznie, za pomocą Puppeteer:

```bash
npm run test:pwa-offline
```

**Skrypty do zarządzania Service Workerem**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Standardy jakości

**Narzędzia jakości kodu**:

- **ESLint**: Nowoczesna konfiguracja z flat config (`eslint.config.js`), obsługa ES2022
- **Prettier**: Automatyczne formatowanie kodu (`.prettierrc`)
- **Stylelint**: Walidacja CSS (`.stylelintrc.json`)
- **JSDoc**: Automatyczna dokumentacja funkcji z analizą pokrycia

**Ważne reguły dotyczące kodu**:

- Usuwać nieużywane zmienne i parametry (`no-unused-vars`)
- Stosować szczegółową obsługę błędów (bez pustych bloków catch)
- Unikać `innerHTML` na rzecz funkcji `security-utils.js`
- Utrzymywać złożoność poznawczą funkcji poniżej 15
- Wydzielać złożone funkcje do mniejszych helperów

**Bezpieczeństwo**:

- **Ochrona przed XSS**: Używać funkcji z `security-utils.js`:
  - `appendSanitizedHTML()` zamiast `innerHTML`
  - `createSafeElement()` do tworzenia bezpiecznych elementów
  - `setSafeMessage()` do treści tekstowej
- **Skrypty zewnętrzne**: Atrybut `crossorigin="anonymous"` jest obowiązkowy
- **Walidacja danych wejściowych**: Zawsze sanityzować dane zewnętrzne
- **Content Security Policy**: Nagłówki CSP ograniczające źródła skryptów

**Dostępność**:

- Zgodność z WCAG 2.1 AA
- Pełna nawigacja za pomocą klawiatury
- Odpowiednie role i etykiety ARIA
- Zgodne kontrasty kolorów

**Wydajność**:

- Lazy loading modułów za pomocą `lazy-loader.js`
- Optymalizacja CSS i responsywnych zasobów
- Service Worker do inteligentnego buforowania
- Code splitting i minifikacja w środowisku produkcyjnym

## 📱 Zgodność

### Obsługiwane przeglądarki

Interfejs wykorzystuje `oklch()` do kolorów oraz `:has()` do stanów
kontekstowych, co wyznacza minimalne wersje:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Urządzenia

- **Komputery**: Sterowanie klawiaturą i myszą
- **Tablety**: Zoptymalizowany interfejs dotykowy
- **Smartfony**: Adaptacyjny design responsywny

### Dostępność

- Pełna nawigacja za pomocą klawiatury (Tab, strzałki, Escape)
- Role i etykiety ARIA dla czytników ekranu
- Zgodne kontrasty kolorów
- Obsługa technologii wspomagających

## 🌍 Lokalizacja

Pełna obsługa wielu języków:

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

### Skrypty do zarządzania i18n

**`npm run i18n:verify`** — Sprawdzanie spójności kluczy tłumaczeń

**`npm run i18n:unused`** — Wyświetlanie listy nieużywanych kluczy tłumaczeń

**`npm run i18n:compare`** — Porównywanie plików tłumaczeń z fr.json (plik referencyjny)

Ten skrypt (`scripts/compare-translations.cjs`) zapewnia synchronizację wszystkich plików językowych:

**Funkcje:**

- Wykrywanie brakujących kluczy (obecnych w fr.json, ale nieobecnych w innych językach)
- Wykrywanie dodatkowych kluczy (obecnych w innych językach, ale nieobecnych w fr.json)
- Identyfikowanie pustych wartości (`""`, `null`, `undefined`, `[]`)
- Sprawdzanie spójności typów (string vs array)
- Spłaszczanie zagnieżdżonych struktur JSON do notacji kropkowej (np. `arcade.multiMemory.title`)
- Generowanie szczegółowego raportu w konsoli
- Zapisywanie raportu JSON w `docs/translations-comparison-report.json`

**Przykładowe dane wyjściowe:**

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

**Zakres tłumaczeń:**

- Kompletny interfejs użytkownika
- Instrukcje do gier
- Komunikaty o błędach i informacje zwrotne
- Opisy i pomoc kontekstowa
- Treści fabularne trybu Przygody
- Etykiety dostępności i ARIA

## 🔊 Nagrany głos

Gra odczytuje na głos pytania, zachęty i wyjaśnienia. W języku francuskim jest to **Lucie**, syntetyczny głos utworzony za pomocą ElevenLabs (model Eleven v3). Gra wypowiada wyłącznie skończony zestaw zdań, około 7 400 na język: wszystkie są nagrywane z wyprzedzeniem i żadna część aplikacji nie wywołuje ElevenLabs. W języku angielskim i hiszpańskim na razie pozostaje głos urządzenia.

- **Automatyczny fallback** na głos urządzenia, osobno dla każdego zdania: brak klipu lub błąd, odmowa odtwarzania przez przeglądarkę, klip nieuruchomiony w ciągu 1,5 s albo praca offline bez klipu w pamięci podręcznej.
- **Ustawienia**: przycisk głosu na górnym pasku włącza lub wyłącza odczytywanie; pole „Nagrany głos” (Dostępność i sterowanie) pozwala wybrać między Lucie a głosem urządzenia.
- **Offline**: wcześniej odsłuchane klipy pozostają w pamięci podręcznej (service worker).

### Klipy nie znajdują się w tym repozytorium

Klipy znajdują się w prywatnym repozytorium i dedykowanym bucket S3, udostępnianym przez CloudFront pod adresem `/voice/*`. Fork lub lokalne środowisko deweloperskie korzystają zatem z głosu urządzenia: w repozytorium znacznik `<meta name="leapmultix-voice-base">` jest pusty i tylko wdrożenie produkcyjne zapisuje w nim `/voice/`.

Gdy klipy znajdują się na komputerze (prywatne repozytorium sklonowane obok gry w `../leapmultix-voices`), parametr `?voix=local` umożliwia odczytywanie ich przez serwer deweloperski:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Generowanie klipów

Proces jest obsługiwany przez skrypty w `scripts/voice/` i uruchamiany na komputerze właściciela, nigdy w publicznym CI. Klucz ElevenLabs pozostaje w pliku `.env` poza repozytorium i jest przekazywany przez `node --env-file`: żaden klucz nie trafia do git. Skill Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) prowadzi krok po kroku przez procedurę (punkty kontrolne, zatwierdzenia, wznowienia); szczegóły znajdują się w [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Oszacować** liczbę pozostałych zdań i liczbę płatnych znaków (Eleven v3: około 0,53 kredytu za znak).
2. **Wygenerować**. Ponowne uruchomienie tego samego polecenia uzupełnia brakujące elementy. Po wyczerpaniu kredytów skrypt zatrzymuje się prawidłowo (kod 3), nie pozostawiając częściowo zapisanego pliku.
3. **Sprawdzić**: każde zdanie ma klip, a każdy plik MP3 jest prawidłowy. Następnie Whisper lokalnie transkrybuje każdy klip, a `voice:check` sygnalizuje błędnie rozpoznane liczby i nietypowy czas trwania.
4. **Odsłuchać** na stronie odsłuchu (`voice:listen`) oznaczone klipy oraz próbkę form żeńskich („une fois 7”), których Whisper nie rozróżnia. Każdy klip ma pole „do ponownego nagrania”, które dodaje go do listy odrzuconych klipów.
5. **Ponownie nagrać** odrzucone klipy (`--redo`) i ponownie uruchomić Whisper, a następnie porównać każdy klip przed zmianą i po niej na drugiej stronie. Klip, który po dwóch lub trzech próbach nadal jest wymawiany nieprawidłowo, otrzymuje wymuszony tekst w `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), na przykład liczbę zapisaną słownie.
6. **Opublikować** klipy, sprawdzić, czy są dostępne online, a następnie opublikować indeks języka, najpierw dla testerów (`?voix=test`).
7. **Udostępnić** głos wszystkim, a następnie domyślnie go włączyć. Wyłącznik awaryjny (`voice:publish -- remove`) usuwa język z indeksu: gra powraca do głosu urządzenia.

```bash
# 1. Estimer (sans frais)
npm run voice:generate -- --lang fr --dry-run
# 2. Générer (payant)
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --reserve 5000
# 3. Contrôler (Whisper s'installe une fois : voir l'en-tête de whisper_transcribe.py)
npm run voice:check -- --lang fr --probe
.venv-whisper/bin/python scripts/voice/whisper_transcribe.py --manifest ../leapmultix-voices/manifests/fr/<version>.json --clips ../leapmultix-voices/clips/fr/<version> --lang fr --out transcripts-fr.jsonl
npm run voice:check -- --lang fr --transcripts transcripts-fr.jsonl
# 4. Écouter (page locale ; la liste « à refaire » va dans ecartes.txt)
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl
# 5. Refaire (payant), relancer Whisper (il ne transcrit que les clips refaits), comparer
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --redo ecartes.txt
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl --compare ecartes.txt
# 6. Publier
npm run voice:publish -- clips --lang fr --bucket <bucket>
npm run voice:check-online -- --lang fr
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience test
# 7. Ouvrir
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience all --default-on
```

### Reguła: zmodyfikowane wypowiadane zdanie należy ponownie nagrać przed wdrożeniem produkcyjnym

Każde wypowiadane zdanie pochodzi z tłumaczeń (`assets/translations/{fr,en,es}.json`) i stanowi część korpusu. Zmiana wypowiadanego zdania powoduje więc niepowodzenie testu blokady korpusu (`scripts/voice/corpus.lock.json`). W przypadku języka z nagranym głosem należy wtedy wygenerować klipy zmienionych zdań, sprawdzić je i odsłuchać, a następnie opublikować **przed** scaleniem. Na koniec należy zaktualizować blokadę (`npm run voice:corpus:lock`). Bez tych klipów zmodyfikowane zdanie zostanie odczytane głosem urządzenia.

## 📊 Przechowywanie danych

### Dane użytkownika

- Profile i preferencje
- Postępy w poszczególnych trybach gry
- Wyniki i statystyki gier arcade
- Ustawienia personalizacji

### Funkcje techniczne

- Pamięć lokalna (localStorage) z fallbackami
- Izolacja danych poszczególnych użytkowników
- Automatyczne zapisywanie postępów
- Automatyczna migracja starszych danych

## 🐛 Zgłaszanie problemu

Problemy można zgłaszać za pośrednictwem issues GitHub. Prosimy podać:

- Szczegółowy opis problemu
- Kroki pozwalające go odtworzyć
- Przeglądarkę i jej wersję
- Zrzuty ekranu, jeśli są istotne

## 💝 Wsparcie projektu

**[☕ Przekaż darowiznę przez PayPal](https://paypal.me/jls)**

## 📄 Licencja

Ten projekt jest objęty licencją AGPL v3. Więcej informacji znajduje się w pliku `LICENSE`.

---

_LeapMultix — bezpłatna aplikacja edukacyjna do nauki czterech działań matematycznych_

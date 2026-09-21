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
[![Nieprawidłowości w kodzie](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Zduplikowane wiersze (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Wiersze kodu](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## Spis treści

- [Opis](#opis)
- [Podgląd](#-podgląd)
- [Funkcje](#-funkcje)
- [Szybki start](#-szybki-start)
- [Architektura](#-architektura)
- [Szczegółowy opis trybów gry](#-szczegółowy-opis-trybów-gry)
- [Programowanie](#-programowanie)
- [Kompatybilność](#-kompatybilność)
- [Lokalizacja](#-lokalizacja)
- [Przechowywanie danych](#-przechowywanie-danych)
- [Zgłaszanie problemu](#-zgłaszanie-problemu)
- [Licencja](#-licencja)

## Opis

LeapMultix to interaktywna edukacyjna aplikacja internetowa przeznaczona dla dzieci w wieku od 6 do 12 lat, pomagająca opanować 4 działania arytmetyczne: mnożenie (×), dodawanie (+), odejmowanie (−) i dzielenie (÷). Oferuje **5 trybów gry** oraz **4 zręcznościowe minigry** w intuicyjnym, dostępnym i wielojęzycznym interfejsie.

**Obsługa wielu działań:** wszystkie pięć trybów obsługuje cztery działania. Wyboru dokonuje się na ekranie głównym i obowiązuje on podczas całej rozgrywki.

**Autor:** Julien LS (contact@jls42.org)

**Adres wersji online:** https://leapmultix.jls42.org/

## 📸 Podgląd

### Ekrany

|                                                                                                                                   |                                                                                                                          |
| :-------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------: |
|                                  ![Ekran „Kto gra?”: wybór profilu](docs/media/01-accueil.webp)                                   |                    ![Menu główne: wybór działania i jednego z pięciu trybów](docs/media/02-menu.webp)                    |
|                                **Kto gra?** — profil każdego dziecka z jego awatarem i postępami.                                 |                        **Menu** — tutaj wybiera się działanie, a następnie jeden z pięciu trybów.                        |
|           ![Tryb Odkrywanie: tabliczka mnożenia przez 4 przedstawiona za pomocą punktów](docs/media/03-decouverte.webp)           |                 ![Tryb Quiz: błędna odpowiedź na czerwono, poprawna na zielono](docs/media/04-quiz.webp)                 |
| **Odkrywanie** — każde równanie jest przedstawiane za pomocą punktów, skoków lub liczenia, wraz ze wskazówką dotyczącą tabliczki. | **Quiz** — wybór dziecka pozostaje widoczny obok poprawnej odpowiedzi, a objaśnienie szczegółowo przedstawia obliczenie. |
|                              ![Tryb Wyzwanie: odliczanie i trwająca seria](docs/media/05-defi.webp)                               |             ![Tryb Przygoda: mapa dziesięciu poziomów, kolejne są zablokowane](docs/media/06-aventure.webp)              |
|     **Wyzwanie** — wyścig z czasem. Po błędzie stoper zatrzymuje się na czas potrzebny do przeczytania poprawnej odpowiedzi.      |                      **Przygoda** — dziesięć poziomów odblokowywanych kolejno w zamian za gwiazdki.                      |
|                                     ![Menu Arcade: cztery minigry](docs/media/07-arcade.webp)                                     |                   ![Panel: gwiazdki według tabliczki i statystyki](docs/media/08-tableau-de-bord.webp)                   |
|                           **Arcade** — cztery minigry z ustawieniem poziomu trudności i wyborem statku.                           |                  **Panel** — gwiazdki według tabliczki, tabliczki do powtórzenia i wyniki według trybu.                  |
|                    ![Personalizacja: awatary, motywy, ułatwienia dostępu](docs/media/09-personnalisation.webp)                    |                                                                                                                          |
|               **Personalizacja** — awatar, motyw kolorystyczny, rozmiar tekstu, wysoki kontrast i kod rodzicielski.               |                                                                                                                          |

### Zręcznościowe minigry

Cztery gry zadające to samo pytanie — wyświetlane nad obszarem
gry wraz z pozostałym czasem i liczbą żyć — lecz za każdym razem wymagające
innego działania.

|                                                                                                                         |                                                                                                    |
| :---------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: |
|             ![MultiInvaders: potwory z liczbami i statek na dole ekranu](docs/media/10-multiinvaders.webp)              | ![MultiMiam: labirynt, w którym kropki zawierają możliwe odpowiedzi](docs/media/11-multimiam.webp) |
| **MultiInvaders** — strzelaj do błędnych odpowiedzi, oszczędzając poprawną: ukrywa się za nią przyjaciel do uwolnienia. |        **MultiMiam** — przemierzaj labirynt, aby złapać poprawny wynik, unikając potworów.         |
|   ![MultiMemory: siatka kart, z których dwie odwrócono, ukazując działanie i liczbę](docs/media/12-multimemory.webp)    |          ![MultiSnake: wąż i ponumerowane jabłka na łące](docs/media/13-multisnake.webp)           |
|                **MultiMemory** — zapamiętaj, na której karcie znajduje się wynik odwróconego działania.                 |        **MultiSnake** — rośnij, połykając właściwe liczby, i unikaj wszystkich pozostałych.        |

## ✨ Funkcje

### 🎮 Tryby gry

- **Tryb Odkrywanie**: Wizualna i interaktywna nauka dostosowana do każdego działania
- **Tryb Quiz**: Pytania wielokrotnego wyboru z obsługą 4 działań (×, +, −, ÷) i adaptacyjnym postępem
- **Tryb Wyzwanie**: Wyścig z czasem obejmujący 4 działania (×, +, −, ÷) i różne poziomy trudności
- **Tryb Przygoda**: Fabularne przechodzenie kolejnych poziomów z obsługą 4 działań

### 🕹️ Minigry Arcade

- **MultiInvaders**: Edukacyjne Space Invaders — niszczenie błędnych odpowiedzi
- **MultiMiam**: Matematyczny Pac-Man — zbieranie poprawnych odpowiedzi
- **MultiMemory**: Gra pamięciowa — łączenie działań z wynikami
- **MultiSnake**: Edukacyjny Snake — rośnięcie poprzez zjadanie właściwych liczb

### ➕ Obsługa wielu działań

LeapMultix zapewnia kompleksowe ćwiczenia z 4 działań arytmetycznych we **wszystkich trybach**:

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
- **Dostępność**: Nawigacja za pomocą klawiatury, obsługa dotykowa i zgodność z WCAG 2.1 AA
- **Responsywność mobilna**: Interfejs zoptymalizowany pod kątem tabletów i smartfonów
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
```

## 🏗️ Architektura

### Struktura plików

Moduły JavaScript znajdują się **bezpośrednio w `js/`**, z wyjątkiem trzech katalogów:
`core/`, `components/` i `modes/`. Grupowanie określa zatem nazwa pliku
(`arcade-*`, `multimiam-*`, `i18n*`…).

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

### Architektura techniczna

**Nowoczesne moduły ES6**: Projekt wykorzystuje architekturę modułową z klasami ES6 oraz natywnymi importami i eksportami.

**Komponenty wielokrotnego użytku**: Interfejs zbudowany z użyciem scentralizowanych komponentów UI (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Inteligentne ładowanie modułów na żądanie za pomocą `lazy-loader.js` w celu optymalizacji początkowej wydajności.

**Ujednolicony system przechowywania**: Scentralizowane API do utrwalania danych użytkowników za pomocą LocalStorage z mechanizmami awaryjnymi.

**Scentralizowane zarządzanie dźwiękiem**: Sterowanie dźwiękiem z obsługą wielu języków i preferencji poszczególnych użytkowników.

**Event Bus**: Oddzielona komunikacja oparta na zdarzeniach między komponentami, zapewniająca łatwą w utrzymaniu architekturę.

**Nawigacja oparta na slajdach**: System nawigacji bazujący na ponumerowanych slajdach (slide0, slide1 itd.) z użyciem `goToSlide()`.

**Bezpieczeństwo**: Ochrona przed XSS i sanityzacja za pomocą `security-utils.js` podczas wszystkich operacji na DOM.

## 🎯 Szczegółowy opis trybów gry

### Tryb Odkrywanie

Interfejs do wizualnej nauki tabliczki mnożenia obejmujący:

- Interaktywną wizualizację mnożenia
- Animacje i pomoce pamięciowe
- Edukacyjne przeciąganie i upuszczanie
- Swobodny postęp w obrębie poszczególnych tabliczek

### Tryb Quiz

Pytania wielokrotnego wyboru obejmujące:

- 10 pytań w każdej sesji
- Adaptacyjny postęp zależny od poprawnych odpowiedzi
- Wirtualną klawiaturę numeryczną
- System streak (serii poprawnych odpowiedzi)

### Tryb Wyzwanie

Wyścig z czasem obejmujący:

- 3 poziomy trudności (Początkujący, Średni, Trudny)
- Premie czasowe za poprawne odpowiedzi
- System żyć
- Ranking najlepszych wyników

### Tryb Przygoda

Fabularny postęp obejmujący:

- 10 możliwych do odblokowania poziomów tematycznych
- Interaktywną mapę z wizualizacją postępów
- Wciągającą historię z postaciami
- System gwiazdek i nagród

### Minigry Arcade

Każda minigra oferuje:

- Wybór poziomu trudności i personalizację
- System żyć i punktacji
- Sterowanie za pomocą klawiatury i ekranu dotykowego
- Indywidualne rankingi dla każdego użytkownika

## 🛠️ Programowanie

### Workflow programistyczny

**Nigdy nie commituj bezpośrednio do main.** W projekcie praca odbywa się na branchach
funkcjonalności.

**1. Utwórz branch** — `feat/` dla funkcjonalności lub `fix/` dla poprawki:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Wprowadź zmiany i je zweryfikuj.** Formatowanie jest sprawdzane jako pierwsze: CI odrzuca je
jeszcze przed uruchomieniem testów.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Utwórz commit na branchu**, a następnie go wypchnij:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Otwórz pull request** i poczekaj na analizy: verify, Codacy,
CodeFactor oraz SonarCloud. Przed scaleniem poprawiaj kod, aż wszystkie kontrole zakończą się powodzeniem.

**Styl commitów**: Zwięzłe komunikaty w trybie rozkazującym (np. „Fix arcade init errors”, „Refactor cache updater”)

**Quality gate**: Przed każdym commitem upewnij się, że `npm run lint`, `npm test` i `npm run test:coverage` kończą się powodzeniem

### Architektura komponentów

**GameMode (klasa bazowa)**: Wszystkie tryby dziedziczą po wspólnej klasie ze standaryzowanymi metodami.

**GameModeManager**: Scentralizowana orkiestracja uruchamiania trybów i zarządzania nimi.

**Komponenty UI**: TopBar, InfoBar, Dashboard i Customization zapewniają spójny interfejs.

**Lazy Loading**: Moduły są ładowane na żądanie w celu optymalizacji początkowej wydajności.

**Event Bus**: Oddzielona komunikacja między komponentami za pośrednictwem systemu zdarzeń.

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
- **Post-build**: Kopiuje `css/` i `assets/`, favikony (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` oraz przepisuje `dist/index.html` tak, aby wskazywał plik wejściowy z hashem (np. `main-es6-*.js`)
- **Katalog wynikowy**: `dist/` gotowy do statycznego serwowania

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continuous Integration

**GitHub Actions**: `.github/workflows/ci.yml`, uruchamiany przy każdym pushu do
`main` i przy każdym pull requeście.

**`verify`** — obowiązkowa bramka jakości:

- `npm ci`, a następnie `npm run verify` (ESLint, testy Jest, pokrycie)
- `npm run format:check` (Prettier)

**`seo-report`** — po `verify`: audyt Lighthouse witryny online w celu
długoterminowego monitorowania metryk SEO.

**Zewnętrzne analizy** podłączone do pull requestów: Codacy, CodeFactor oraz
SonarCloud. Bramka SonarCloud wymaga ocen A za niezawodność, bezpieczeństwo i
łatwość utrzymania nowego kodu.

**Wdrażanie**: `./deploy.sh` synchronizuje witrynę z S3 i unieważnia pamięć podręczną
CloudFront. W razie potrzeby skrypt ponownie generuje obrazy responsywne, których nie ma w repozytorium git.

### PWA (Progressive Web App)

LeapMultix to kompletna PWA z obsługą trybu offline i możliwością instalacji.

**Service Worker** (`sw.js`):

- Nawigacja: Network-first z awaryjnym przejściem offline do `offline.html`
- Obrazy: Cache-first w celu optymalizacji wydajności
- Tłumaczenia: Stale-while-revalidate do aktualizacji w tle
- JS/CSS: Network-first, aby zawsze udostępniać najnowszą wersję
- Automatyczne zarządzanie wersjami za pomocą `cache-updater.js`

**Manifest** (`manifest.json`):

- Ikony SVG i PNG dla wszystkich urządzeń
- Możliwość instalacji na urządzeniach mobilnych (Add to Home Screen)
- Konfiguracja standalone zapewniająca środowisko podobne do aplikacji
- Obsługa motywów i kolorów

**Testowanie trybu offline lokalnie.** Uruchom serwer, a następnie otwórz
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

**Narzędzia do zapewniania jakości kodu**:

- **ESLint**: Nowoczesna konfiguracja z flat config (`eslint.config.js`), obsługa ES2022
- **Prettier**: Automatyczne formatowanie kodu (`.prettierrc`)
- **Stylelint**: Walidacja CSS (`.stylelintrc.json`)
- **JSDoc**: Automatyczna dokumentacja funkcji z analizą pokrycia

**Ważne zasady dotyczące kodu**:

- Usuwaj nieużywane zmienne i parametry (`no-unused-vars`)
- Stosuj precyzyjną obsługę błędów (bez pustych bloków catch)
- Unikaj `innerHTML` na rzecz funkcji `security-utils.js`
- Utrzymuj złożoność poznawczą funkcji poniżej 15
- Wydzielaj złożone funkcje do mniejszych helperów

**Bezpieczeństwo**:

- **Ochrona przed XSS**: Używaj funkcji z `security-utils.js`:
  - `appendSanitizedHTML()` zamiast `innerHTML`
  - `createSafeElement()` do tworzenia bezpiecznych elementów
  - `setSafeMessage()` do treści tekstowej
- **Skrypty zewnętrzne**: Atrybut `crossorigin="anonymous"` jest obowiązkowy
- **Walidacja danych wejściowych**: Zawsze sanityzuj dane zewnętrzne
- **Content Security Policy**: Nagłówki CSP ograniczające źródła skryptów

**Dostępność**:

- Zgodność z WCAG 2.1 AA
- Pełna nawigacja za pomocą klawiatury
- Odpowiednie role i etykiety ARIA
- Zgodne poziomy kontrastu kolorów

**Wydajność**:

- Lazy loading modułów za pomocą `lazy-loader.js`
- Optymalizacja CSS i responsywnych assetów
- Service Worker do inteligentnego buforowania
- Code splitting i minifikacja w środowisku produkcyjnym

## 📱 Kompatybilność

### Obsługiwane przeglądarki

Interfejs wykorzystuje `oklch()` dla kolorów oraz `:has()` dla stanów
kontekstowych, co wyznacza minimalne wymagania:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Urządzenia

- **Komputery stacjonarne**: Sterowanie za pomocą klawiatury i myszy
- **Tablety**: Zoptymalizowany interfejs dotykowy
- **Smartfony**: Adaptacyjny design responsive

### Dostępność

- Pełna nawigacja za pomocą klawiatury (Tab, strzałki, Escape)
- Role ARIA i etykiety dla czytników ekranu
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
- Sprawdzanie spójności typów (string i array)
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
- Treści narracyjne trybu Przygoda
- Etykiety dostępności i ARIA

## 📊 Przechowywanie danych

### Dane użytkownika

- Profile i preferencje
- Postępy w poszczególnych trybach gry
- Wyniki i statystyki gier arcade
- Ustawienia personalizacji

### Funkcje techniczne

- Pamięć lokalna (localStorage) z mechanizmami rezerwowymi
- Izolacja danych poszczególnych użytkowników
- Automatyczne zapisywanie postępów
- Automatyczna migracja starszych danych

## 🐛 Zgłaszanie problemu

Problemy można zgłaszać za pośrednictwem issues GitHub. Należy podać:

- Szczegółowy opis problemu
- Kroki pozwalające go odtworzyć
- Przeglądarkę i jej wersję
- Zrzuty ekranu, jeśli są istotne

## 💝 Wsparcie projektu

**[☕ Przekaż darowiznę przez PayPal](https://paypal.me/jls)**

## 📄 Licencja

Ten projekt jest objęty licencją AGPL v3. Więcej informacji znajduje się w pliku `LICENSE`.

---

_LeapMultix — wolna aplikacja edukacyjna do nauki czterech działań arytmetycznych_

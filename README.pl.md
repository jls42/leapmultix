<details>
<summary>Ten dokument jest również dostępny w innych językach</summary>

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
- [Szczegółowy opis trybów gry](#-szczegółowy-opis-trybów-gry)
- [Rozwój projektu](#-rozwój-projektu)
- [Kompatybilność](#-kompatybilność)
- [Lokalizacja](#-lokalizacja)
- [Nagrany głos](#-nagrany-głos)
- [Przechowywanie danych](#-przechowywanie-danych)
- [Zgłaszanie problemów](#-zgłaszanie-problemu)
- [Licencja](#-licencja)

## Opis

LeapMultix to interaktywna, edukacyjna aplikacja internetowa stworzona dla dzieci w wieku od 6 do 12 lat, ułatwiająca opanowanie 4 podstawowych operacji arytmetycznych: mnożenia (×), dodawania (+), odejmowania (−) oraz dzielenia (÷). Oferuje **5 trybów gry** i **4 minigry arcade** w intuicyjnym, dostępnym i wielojęzycznym interfejsie.

**Wsparcie dla wielu operacji:** wszystkie pięć trybów obsługuje cztery działania. Wyboru dokonuje się na ekranie głównym i obowiązuje on przez całą rozgrywkę.

**Autor projektu:** Julien LS (contact@jls42.org)

**Adres URL online:** https://leapmultix.jls42.org/

## 📸 Przegląd

### Ekrany

|                                                                                                                                 |                                                                                                                         |
| :-----------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------: |
|                                 ![Ekran „Kto gra?”: wybór profilu](docs/media/01-accueil.webp)                                  |                         ![Menu główne: wybór operacji i pięciu trybów](docs/media/02-menu.webp)                         |
|                             **Kto gra?** — profil dla każdego dziecka, z jego awatarem i postępami.                             |                      **Menu** — tutaj wybiera się działanie, po czym odblokowuje się pięć trybów.                       |
|             ![Tryb Odkrywania: tabliczka mnożenia przez 4 przedstawiona w kropkach](docs/media/03-decouverte.webp)              |                ![Tryb Quizu: błędna odpowiedź na czerwono, poprawna na zielono](docs/media/04-quiz.webp)                |
| **Odkrywanie** — każde działanie jest prezentowane za pomocą kropek, skoków lub liczenia, wraz ze wskazówką do danej tabliczki. | **Quiz** — wybór dziecka pozostaje wyświetlony obok poprawnej odpowiedzi, a wyjaśnienie szczegółowo opisuje obliczenie. |
|                          ![Tryb Wyzwania: odliczanie czasu i trwająca seria](docs/media/05-defi.webp)                           |              ![Tryb Przygody: mapa dziesięciu poziomów, kolejne zablokowane](docs/media/06-aventure.webp)               |
|   **Wyzwanie** — wyścig z czasem. Przy błędzie stoper zatrzymuje się na czas potrzebny na przeczytanie poprawnej odpowiedzi.    |                 **Przygoda** — dziesięć poziomów odblokowywanych jeden po drugim w zamian za gwiazdki.                  |
|                                    ![Menu Arcade: cztery minigry](docs/media/07-arcade.webp)                                    |         ![Panel główny: gwiazdki dla poszczególnych tabliczek i statystyki](docs/media/08-tableau-de-bord.webp)         |
|                           **Arcade** — cztery minigry z regulacją poziomu trudności i wyborem statku.                           |          **Panel główny** — gwiazdki dla tabliczek, tabliczki do powtórzenia, wyniki w poszczególnych trybach.          |
|                       ![Personalizacja: awatary, motywy, dostępność](docs/media/09-personnalisation.webp)                       |                                                                                                                         |
|              **Personalizacja** — awatar, motyw kolorystyczny, rozmiar tekstu, wysoki kontrast, kod rodzicielski.               |                                                                                                                         |

### Minigry arcade

Cztery gry, które zadają to samo pytanie — wyświetlane nad obszarem gry, wraz z
pozostałym czasem i liczbą żyć — ale za każdym razem wymagają innego
działania.

|                                                                                                                 |                                                                                                   |
| :-------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
|          ![MultiInvaders: potwory z liczbami, statek na dole ekranu](docs/media/10-multiinvaders.webp)          | ![MultiMiam: labirynt, w którym kulki zawierają możliwe odpowiedzi](docs/media/11-multimiam.webp) |
| **MultiInvaders** — strzelaj do błędnych odpowiedzi, oszczędzaj poprawną: ukrywa ona przyjaciela do uwolnienia. |        **MultiMiam** — przemierzaj labirynt, aby zebrać właściwy wynik, unikając potworów.        |
|    ![MultiMemory: siatka kart, dwie odwrócone pokazujące działanie i liczbę](docs/media/12-multimemory.webp)    |          ![MultiSnake: wąż i ponumerowane jabłka na łące](docs/media/13-multisnake.webp)          |
|             **MultiMemory** — odnajdź z pamięci, która karta zawiera wynik odsłoniętego działania.              |         **MultiSnake** — rośnij, zjadając właściwe liczby, unikaj wszystkich pozostałych.         |

## ✨ Funkcje

### 🎮 Tryby gry

- **Tryb Odkrywania**: Wizualna i interaktywna eksploracja dostosowana do każdego działania
- **Tryb Quizu**: Pytania wielokrotnego wyboru z obsługą 4 działań (×, +, −, ÷) i adaptacyjnym poziomem trudności
- **Tryb Wyzwania**: Wyścig z czasem obejmujący 4 działania (×, +, −, ÷) z różnymi poziomami trudności
- **Tryb Przygody**: Progresja fabularna z poziomami i obsługą 4 działań

### 🕹️ Minigry Arcade

- **MultiInvaders**: Edukacyjne Space Invaders – niszczenie błędnych odpowiedzi
- **MultiMiam**: Matematyczny Pac-Man – zbieranie poprawnych odpowiedzi
- **MultiMemory**: Gra pamięciowa – łączenie działań z ich wynikami
- **MultiSnake**: Edukacyjny Snake – powiększanie węża poprzez zjadanie właściwych liczb

### ➕ Obsługa wielu operacji

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
- **Wielojęzyczność**: Wsparcie dla języka francuskiego, angielskiego i hiszpańskiego
- **Personalizacja**: Awatary, motywy kolorystyczne, tła
- **Dostępność**: Nawigacja za pomocą klawiatury, obsługa ekranów dotykowych, zgodność z WCAG 2.1 AA
- **Nagrany głos**: Gra potrafi odczytywać pytania oraz słowa zachęty przy użyciu wstępnie nagranego głosu syntezatora, z automatycznym przełączeniem na głos urządzenia w razie potrzeby. Głosy nie znajdują się w tym repozytorium: strona leapmultix.jls42.org udostępnia głos Lucie w języku francuskim, Sulafat w języku angielskim i hiszpańskim, a także do wyboru Sulafat i Marie w języku francuskim oraz Jane w języku angielskim (zobacz [Nagrany głos](#-nagrany-głos))
- **Dostosowanie do urządzeń mobilnych**: Interfejs zoptymalizowany pod kątem tabletów i smartfonów
- **System osiągnięć**: Wyniki punktowe, odznaki, codzienne wyzwania

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
npm run voice:generate     # Générer les clips (ElevenLabs, Google ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Architektura

### Struktura plików

Moduły JavaScript znajdują się **bezpośrednio w folderze `js/`**, z wyjątkiem trzech podkatalogów:
`core/`, `components/` oraz `modes/`. Grupowanie logiczne wynika
zatem z nazw plików (`arcade-*`, `multimiam-*`, `i18n*`…).

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

**Nowoczesne moduły ES6**: Projekt wykorzystuje architekturę modułową opartą na klasach ES6 oraz natywnych instrukcjach import/export.

**Komponenty wielokrotnego użytku**: Interfejs zbudowany w oparciu o scentralizowane komponenty UI (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Inteligentne ładowanie modułów na żądanie za pośrednictwem `lazy-loader.js` w celu optymalizacji początkowej wydajności.

**Ujednolicony system przechowywania danych**: Scentralizowane API do utrwalania danych użytkowników za pomocą LocalStorage z mechanizmami awaryjnymi.

**Scentralizowane zarządzanie dźwiękiem**: Kontrola dźwięku ze wsparciem dla wielu języków i preferencji per użytkownik.

**Event Bus**: Odseparowana komunikacja oparta na zdarzeniach między komponentami, zapewniająca łatwą w utrzymaniu architekturę.

**Nawigacja za pomocą slajdów**: System nawigacji oparty na ponumerowanych slajdach (slide0, slide1 itd.) z wykorzystaniem `goToSlide()`.

**Bezpieczeństwo**: Ochrona przed XSS oraz sanityzacja za pomocą `security-utils.js` dla wszystkich operacji na drzewie DOM.

## 🎯 Szczegółowy opis trybów gry

### Tryb Odkrywania

Interfejs wizualnej eksploracji tabliczki mnożenia oferujący:

- Interaktywną wizualizację mnożenia
- Animacje i mnemotechniki
- Edukacyjną mechanikę przeciągnij i upuść
- Dowolną progresję dla poszczególnych tabliczek

### Tryb Quizu

Pytania wielokrotnego wyboru zawierające:

- 10 pytań na sesję
- Adaptacyjną progresję w zależności od osiąganych wyników
- Wirtualną klawiaturę numeryczną
- System serii poprawnych odpowiedzi (streak)

### Tryb Wyzwania

Wyścig z czasem oferujący:

- 3 poziomy trudności (Początkujący, Średni, Trudny)
- Dodatkowy czas za poprawne odpowiedzi
- System żyć
- Ranking najlepszych wyników

### Tryb Przygody

Fabularyzowana progresja zawierająca:

- 10 tematycznych poziomów do odblokowania
- Interaktywną mapę z wizualną prezentacją postępów
- Wciągającą historię z postaciami
- System gwiazdek i nagród

### Minigry Arcade

Każda minigra oferuje:

- Wybór poziomu trudności i personalizację
- System żyć oraz punktację
- Sterowanie klawiaturą oraz dotykiem
- Indywidualne rankingi dla poszczególnych użytkowników

## 🔧 Rozwój projektu

### Organizacja pracy (workflow)

**Nigdy nie commituj bezpośrednio do gałęzi main.** Prace w projekcie odbywają się na dedykowanych
gałęziach funkcjonalności.

**1. Utwórz gałąź**, `feat/` dla nowej funkcji, `fix/` dla poprawki:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Wprowadź zmiany i zweryfikuj je.** Formatowanie jest sprawdzane w pierwszej kolejności: system CI odrzuci je
jeszcze przed uruchomieniem testów.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Utwórz commit na gałęzi**, a następnie wypchnij go do repozytorium:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Otwórz pull request** i poczekaj na wyniki analiz: verify, Codacy,
CodeFactor oraz SonarCloud. Poprawki należy nanosić aż do uzyskania zielonego statusu przed scaleniem.

**Styl commitów**: Zwięzłe komunikaty w trybie rozkazującym (np.: "Fix arcade init errors", "Refactor cache updater")

**Wymogi jakościowe (Quality gate)**: Przed każdym commitem upewnij się, że polecenia `npm run lint`, `npm test` oraz `npm run test:coverage` wykonują się pomyślnie

### Architektura komponentów

**GameMode (klasa bazowa)**: Wszystkie tryby dziedziczą po wspólnej klasie ze standaryzowanymi metodami.

**GameModeManager**: Scentralizowana orkiestracja uruchamiania i zarządzania trybami.

**Komponenty UI**: TopBar, InfoBar, Dashboard oraz Customization zapewniają spójny interfejs.

**Lazy Loading**: Moduły ładowane są na żądanie w celu zoptymalizowania wydajności początkowej.

**Event Bus**: Niezależna komunikacja między komponentami za pośrednictwem systemu zdarzeń.

### Testy

Projekt zawiera kompleksowy zestaw testów:

- Testy jednostkowe modułów bazowych (core)
- Testy integracyjne komponentów
- Testy trybów gry
- Automatyczne sprawdzanie pokrycia kodu

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Kompilacja produkcyjna

- **Rollup**: Pakowanie pliku `js/main-es6.js` do formatu ESM z podziałem kodu (code-splitting) i mapami źródeł (sourcemaps)
- **Terser**: Automatyczna minifikacja na potrzeby optymalizacji
- **Post-build**: Kopiowanie plików `css/` i `assets/`, ikon favicon (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` oraz przepisanie referencji w pliku `dist/index.html` do zahashowanego pliku wejściowego (np. `main-es6-*.js`)
- **Katalog docelowy**: Folder `dist/` gotowy do statycznego serwowania

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Ciągła integracja (CI)

**GitHub Actions**: Plik `.github/workflows/ci.yml`, uruchamiany przy każdym wypchnięciu (push) na gałąź
`main` oraz przy każdym pull requeście.

**`verify`** — bramka jakościowa, blokująca:

- `npm ci`, a następnie `npm run verify` (ESLint, testy Jest, pokrycie kodu)
- `npm run format:check` (Prettier)

**`seo-report`** — po wykonaniu `verify`: audyt Lighthouse działającej witryny online w celu
długoterminowego monitorowania wskaźników SEO.

**Analizy zewnętrzne** podpięte pod pull requesty: Codacy, CodeFactor oraz
SonarCloud. Bramka SonarCloud wymaga oceny A w kategoriach niezawodności, bezpieczeństwa i
utrzymywalności nowego kodu.

**Wdrożenie**: Skrypt `./deploy.sh` synchronizuje stronę z usługą S3 i unieważnia pamięć podręczną
CloudFront. W razie potrzeby generuje także responsywne obrazy, które nie są śledzone w repozytorium git.

### PWA (Progressive Web App)

LeapMultix to pełnoprawna aplikacja PWA z obsługą trybu offline i możliwością instalacji.

**Service Worker** (`sw.js`):

- Nawigacja: Strategia Network-first z przejściem w tryb offline do `offline.html`
- Obrazy: Strategia Cache-first dla optymalizacji wydajności
- Tłumaczenia: Strategia Stale-while-revalidate dla aktualizacji w tle
- JS/CSS: Strategia Network-first, aby zawsze serwować najnowszą wersję
- Automatyczne zarządzanie wersjami za pośrednictwem `cache-updater.js`

**Manifest** (`manifest.json`):

- Ikony SVG i PNG dla wszystkich typów urządzeń
- Możliwość instalacji na urządzeniach mobilnych (Dodaj do ekranu głównego)
- Konfiguracja typu standalone zapewniająca wrażenia natywnej aplikacji
- Obsługa motywów i palet kolorystycznych

**Testowanie trybu offline lokalnie.** Uruchom serwer, a następnie otwórz
`http://localhost:8080` (lub wyświetlony port):

```bash
npm run serve
```

Ręcznie: wyłącz sieć w narzędziach deweloperskich (zakładka Sieć/Network,
tryb offline), a następnie odśwież stronę. Powinien wyświetlić się plik `offline.html`.

Automatycznie, za pomocą Puppeteera:

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

- **ESLint**: nowoczesna konfiguracja typu flat config (`eslint.config.js`), obsługa ES2022
- **Prettier**: automatyczne formatowanie kodu (`.prettierrc`)
- **Stylelint**: walidacja CSS (`.stylelintrc.json`)
- **JSDoc**: automatyczna dokumentacja funkcji wraz z analizą pokrycia

**Ważne reguły kodu**:

- Usuwanie nieużywanych zmiennych i parametrów (`no-unused-vars`)
- Stosowanie precyzyjnej obsługi błędów (brak pustych bloków catch)
- Unikanie `innerHTML` na rzecz funkcji `security-utils.js`
- Utrzymywanie złożoności poznawczej (cognitive complexity) < 15 dla funkcji
- Wydzielanie złożonych funkcji do mniejszych funkcji pomocniczych (helpers)

**Bezpieczeństwo**:

- **Ochrona przed XSS**: używanie funkcji z `security-utils.js`:
  - `appendSanitizedHTML()` zamiast `innerHTML`
  - `createSafeElement()` do bezpiecznego tworzenia elementów
  - `setSafeMessage()` dla zawartości tekstowej
- **Skrypty zewnętrzne**: obowiązkowy atrybut `crossorigin="anonymous"`
- **Walidacja danych wejściowych**: bezwzględna sanityzacja danych zewnętrznych
- **Content Security Policy**: nagłówki CSP ograniczające źródła skryptów

**Dostępność**:

- Zgodność z WCAG 2.1 AA
- Pełna nawigacja klawiaturą
- Odpowiednie role i etykiety ARIA
- Zgodne kontrasty kolorów

**Wydajność**:

- Leniwe ładowanie (lazy loading) modułów za pomocą `lazy-loader.js`
- Optymalizacje CSS i responsywne zasoby
- Service Worker dla inteligentnego buforowania
- Dzielenie kodu (code splitting) i minifikacja na produkcji

## 📱 Kompatybilność

### Obsługiwane przeglądarki

Interfejs opiera się na `oklch()` w zakresie kolorów oraz na `:has()` dla stanów kontekstowych, co wyznacza wymagania minimalne:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Urządzenia

- **Komputery stacjonarne**: sterowanie klawiaturą i myszą
- **Tablety**: zoptymalizowany interfejs dotykowy
- **Smartfony**: responsywny design adaptacyjny

### Dostępność

- Pełna nawigacja klawiaturą (Tab, strzałki, Esc)
- Role ARIA i etykiety dla czytników ekranu
- Zgodne kontrasty kolorów
- Wsparcie dla technologii wspomagających

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

### Skrypty do zarządzania i18n

**`npm run i18n:verify`** – weryfikacja spójności kluczy tłumaczeń

**`npm run i18n:unused`** – lista nieużywanych kluczy tłumaczeń

**`npm run i18n:compare`** – porównanie plików tłumaczeń z fr.json (plik referencyjny)

Ten skrypt (`scripts/compare-translations.cjs`) zapewnia synchronizację wszystkich plików językowych:

**Funkcje:**

- Wykrywanie brakujących kluczy (obecnych w fr.json, ale brakujących w innych językach)
- Wykrywanie nadmiarowych kluczy (obecnych w innych językach, ale nieobecnych w fr.json)
- Identyfikacja pustych wartości (`""`, `null`, `undefined`, `[]`)
- Sprawdzanie spójności typów (string vs array)
- Spłaszczanie zagnieżdżonych struktur JSON do notacji kropkowej (np. `arcade.multiMemory.title`)
- Generowanie szczegółowego raportu w konsoli
- Zapis raportu JSON w `docs/translations-comparison-report.json`

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

**Pokrycie tłumaczeniami:**

- Kompletny interfejs użytkownika
- Instrukcje do gier
- Komunikaty błędów i informacji zwrotnych
- Opisy i pomoc kontekstowa
- Treść narracyjna trybu Przygody
- Etykiety dostępności i ARIA

## 🔊 Nagrany głos

Gra czyta na głos pytania, słowa zachęty i objaśnienia. Wypowiada jedynie skończony zbiór zdań, około 7400 na język: można je zatem nagrać raz na zawsze, dzięki czemu żadna rozgrywka nie odwołuje się do usługi syntezy mowy. Bez nagrań gra czyta głosem urządzenia.

### W tym repozytorium: aplikacja bez głosów

Kod potrafi odtwarzać wstępnie nagrane klipy i zawiera łańcuch narzędziowy do ich tworzenia. Nie ma w nim samych klipów ani kluczy dostawców: fork lub instalacja lokalna korzysta z głosu urządzenia.

- **Automatyczne przełączanie awaryjne** na głos urządzenia, zdanie po zdaniu: brakujący lub uszkodzony klip, odmowa odtworzenia przez przeglądarkę, klip nierozpoczynający się w ciągu 1,5 s lub brak połączenia z siecią bez zapisanego klipu w pamięci podręcznej.
- **Ustawienia**: przycisk głosu na górnym pasku włącza lub wycisza czytanie; pole wyboru „Nagrany głos” (Dostępność i sterowanie) pozwala wybrać między nagranym głosem a głosem urządzenia. Pojawia się ono tylko w językach, dla których opublikowano głos.
- **Tryb offline**: już odsłuchane klipy pozostają w pamięci podręcznej (service worker).
- **Gdzie gra szuka klipów**: w znaczniku `<meta name="leapmultix-voice-base">`, pustym w repozytorium. Tylko wdrożenie produkcyjne wpisuje tam `/voice/`.

Mając własne klipy na komputerze (utworzone za pomocą poniższego łańcucha narzędzi i umieszczone obok gry w `../leapmultix-voices`), parametr `?voix=local` powoduje ich odczytywanie przez serwer deweloperski:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Na leapmultix.jls42.org: głosy z hostingu

Serwis udostępniany przez autora serwuje nagrane głosy syntezy:

- w języku francuskim: **Lucie**, wygenerowana za pomocą ElevenLabs (model Eleven v3);
- w brytyjskim angielskim i hiszpańskim z Hiszpanii: **Sulafat**, wygenerowana za pomocą Google Cloud Text-to-Speech (głos Chirp 3 HD);
- do wyboru przez gracza: **Sulafat** w języku francuskim, aby zachować ten sam głos we wszystkich trzech językach;
- również do wyboru przez gracza: **Marie** po francusku oraz **Jane** po angielsku, wygenerowane za pomocą Mistral AI (Voxtral TTS).

Klipy znajdują się w prywatnym repozytorium oraz w dedykowanym zasobniku S3, serwowanym przez CloudFront pod adresem `/voice/*`. Są generowane jednorazowo: podczas gry nic nie jest wysyłane do tych usług. W ustawieniach menu „Głos” oferuje głosy dla danego języka, jeśli jest ich kilka, a adnotacja wskazuje usługę, z której pochodzi słyszany głos.

### Generowanie klipów

Łańcuch narzędziowy jest oskryptowany w `scripts/voice/` i uruchamiany na maszynie właściciela, nigdy w publicznym CI. Klucze dostawców (ElevenLabs dla Lucie, Google Cloud Text-to-Speech dla Sulafat, Mistral dla Marie i Jane) pozostają w pliku `.env` poza repozytorium, przekazywanym przez `node --env-file`: żaden klucz nie trafia do gita. Umiejętność Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) prowadzi przez procedurę krok po kroku (bramki, zgody, ponawianie); szczegóły znajdują się w [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Oszacowanie** pozostałych zdań i znaków do opłacenia (Eleven v3: około 0,53 kredytu za znak; Chirp 3 HD: 30 $ za milion znaków, pierwszy milion każdego miesiąca za darmo; Voxtral TTS: 16 $ za milion).
2. **Generowanie**. Ponowne uruchomienie tego samego polecenia wznawia brakujące elementy. Gdy kredyty się wyczerpią, skrypt kończy działanie w czysty sposób (kod 3), nie pozostawiając częściowo zapisanych plików. `--max-total-chars` ogranicza łączny koszt dla danej wersji: każda opłacona odpowiedź jest zapisywana natychmiast po jej odebraniu w rejestrze, który przetrwa nagłe przerwanie. W przypadku Google i Mistral, które nie podają czytelnego salda, jest to jedyne zabezpieczenie.
3. **Kontrola**: każde zdanie ma swój klip, a każdy plik MP3 jest poprawny. Następnie Whisper lokalnie transkrybuje każdy klip, a kontrola zgłasza błędnie usłyszane liczby oraz nietypowe czasy trwania. `voice:review` łączy Whisper, tę kontrolę i stronę odsłuchu w jedno polecenie.
4. **Odsłuchiwanie** na stronie odsłuchu (`voice:listen`) oznaczonych klipów oraz próbki form żeńskich („une fois 7”), których Whisper nie rozróżnia. Każdy klip ma pole wyboru „do poprawy”, które dodaje go do listy odrzuconych klipów.
5. **Ponowne nagranie** odrzuconych klipów (`--redo`) i ponowne uruchomienie Whispera, a następnie porównanie każdego klipu przed i po na drugiej stronie. Klip, który po dwóch lub trzech próbach nadal brzmi niepoprawnie, otrzymuje wymuszony tekst w `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), na przykład liczbę zapisaną słownie.
6. **Publikacja** klipów, weryfikacja ich dostępności online, a następnie publikacja indeksu języka, najpierw dla testerów (`?voix=test`).
7. **Udostępnienie** głosu wszystkim, a następnie włączenie go domyślnie. Wyłącznik awaryjny (`voice:publish -- remove`) usuwa język z indeksu: gra powraca do głosu urządzenia.

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

### Reguła: zmodyfikowane zdanie mówione należy nagrać ponownie przed wdrożeniem na produkcję

Każde wypowiadane zdanie pochodzi z tłumaczeń (`assets/translations/{fr,en,es}.json`) i jest częścią korpusu. Zmiana mówionego zdania powoduje więc niepowodzenie testu blokady korpusu (`scripts/voice/corpus.lock.json`). W przypadku języka, który ma nagrany głos, generuje się wtedy klipy dla zmienionych zdań, sprawdza je i odsłuchuje, a następnie publikuje **przed** scaleniem. Na koniec aktualizuje się blokadę (`npm run voice:corpus:lock`). Bez tych klipów zmodyfikowane zdanie będzie czytane głosem urządzenia.

## 📊 Przechowywanie danych

### Dane użytkownika

- Profile i preferencje
- Postępy w poszczególnych trybach gry
- Wyniki i statystyki gier zręcznościowych
- Ustawienia personalizacji

### Funkcje techniczne

- Pamięć lokalna (localStorage) z mechanizmami awaryjnymi
- Izolacja danych dla każdego użytkownika
- Automatyczny zapis postępów
- Automatyczna migracja starszych danych

## 🐛 Zgłaszanie problemu

Problemy można zgłaszać poprzez GitHub Issues. Prosimy o dołączenie:

- Szczegółowego opisu problemu
- Kroków do jego odtworzenia
- Przeglądarki i jej wersji
- Zrzutów ekranu, jeśli są istotne

## 💝 Wesprzyj projekt

**[☕ Przekaż darowiznę przez PayPal](https://paypal.me/jls)**

## 📄 Licencja

Ten projekt jest objęty licencją AGPL v3. Szczegółowe informacje znajdują się w pliku `LICENSE`.

---

_LeapMultix — wolna aplikacja edukacyjna do nauki czterech działań_

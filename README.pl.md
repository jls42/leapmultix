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
[![Odznaka Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Stan bramki jakości](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Ocena niezawodności](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Ocena bezpieczeństwa](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Ocena łatwości utrzymania](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Dług techniczny](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Błędy](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Luki w zabezpieczeniach](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Problemy z jakością kodu](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Powielone wiersze (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Wiersze kodu](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## Spis treści

- [Opis](#opis)
- [Podgląd](#-podgląd)
- [Funkcje](#-funkcje)
- [Szybki start](#-szybki-start)
- [Architektura](#-architektura)
- [Szczegółowy opis trybów gry](#-szczegółowy-opis-trybów-gry)
- [Programowanie](#-programowanie)
- [Zgodność](#-kompatybilność)
- [Lokalizacja](#-lokalizacja)
- [Nagrany głos](#-nagrany-głos)
- [Przechowywanie danych](#-przechowywanie-danych)
- [Zgłaszanie problemu](#-zgłaszanie-problemu)
- [Licencja](#-licencja)

## Opis

LeapMultix to interaktywna edukacyjna aplikacja internetowa przeznaczona dla dzieci w wieku od 6 do 12 lat, która pomaga opanować 4 działania arytmetyczne: mnożenie (×), dodawanie (+), odejmowanie (−) i dzielenie (÷). Oferuje **5 trybów gry** i **4 minigry zręcznościowe** w intuicyjnym, dostępnym i wielojęzycznym interfejsie.

**Obsługa wielu działań:** wszystkie pięć trybów obsługuje cztery działania. Wyboru dokonuje się na ekranie głównym i obowiązuje on przez całą rozgrywkę.

**Autor:** Julien LS (contact@jls42.org)

**Adres aplikacji:** https://leapmultix.jls42.org/

## 📸 Podgląd

### Ekrany

|                                                                                                                                   |                                                                                                                          |
| :-------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------: |
|                                  ![Ekran „Kto gra?”: wybór profilu](docs/media/01-accueil.webp)                                   |                    ![Menu główne: wybór działania i jednego z pięciu trybów](docs/media/02-menu.webp)                    |
|                             **Kto gra?** — osobny profil dla każdego dziecka, z awatarem i postępami.                             |                        **Menu** — tutaj wybiera się działanie, a następnie jeden z pięciu trybów.                        |
|           ![Tryb Odkrywanie: tabliczka mnożenia przez 4 przedstawiona za pomocą punktów](docs/media/03-decouverte.webp)           |                 ![Tryb Quiz: błędna odpowiedź na czerwono, poprawna na zielono](docs/media/04-quiz.webp)                 |
| **Odkrywanie** — każde równanie jest przedstawiane za pomocą punktów, skoków lub liczenia, wraz ze wskazówką dotyczącą tabliczki. | **Quiz** — wybór dziecka pozostaje widoczny obok poprawnej odpowiedzi, a wyjaśnienie szczegółowo przedstawia obliczenie. |
|                               ![Tryb Wyzwanie: odliczanie i bieżąca seria](docs/media/05-defi.webp)                               |             ![Tryb Przygoda: mapa dziesięciu poziomów, kolejne są zablokowane](docs/media/06-aventure.webp)              |
|     **Wyzwanie** — wyścig z czasem. Po błędzie stoper zatrzymuje się na czas potrzebny do przeczytania poprawnej odpowiedzi.      |                  **Przygoda** — dziesięć poziomów odblokowywanych jeden po drugim w zamian za gwiazdki.                  |
|                                     ![Menu Arcade: cztery minigry](docs/media/07-arcade.webp)                                     |                   ![Panel: gwiazdki według tabliczki i statystyki](docs/media/08-tableau-de-bord.webp)                   |
|                      **Arcade** — cztery minigry z możliwością ustawienia poziomu trudności i wyboru statku.                      |                  **Panel** — gwiazdki według tabliczki, tabliczki do powtórzenia, wyniki według trybu.                   |
|                        ![Personalizacja: awatary, motywy, dostępność](docs/media/09-personnalisation.webp)                        |                                                                                                                          |
|               **Personalizacja** — awatar, motyw kolorystyczny, rozmiar tekstu, wysoki kontrast, kod rodzicielski.                |                                                                                                                          |

### Minigry zręcznościowe

Cztery gry zadające to samo pytanie — wyświetlane nad obszarem
gry wraz z pozostałym czasem i liczbą żyć — lecz za każdym razem wymagające
innej czynności.

|                                                                                                                                   |                                                                                                       |
| :-------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: |
|                   ![MultiInvaders: potwory z liczbami i statek u dołu ekranu](docs/media/10-multiinvaders.webp)                   | ![MultiMiam: labirynt, w którym kulki przedstawiają możliwe odpowiedzi](docs/media/11-multimiam.webp) |
| **MultiInvaders** — strzelaj do błędnych odpowiedzi, oszczędzając poprawną: ukrywa się za nią przyjaciel, którego trzeba uwolnić. |          **MultiMiam** — przemierzaj labirynt, aby złapać poprawny wynik, unikając potworów.          |
|         ![MultiMemory: siatka kart, z których dwie odwrócone pokazują działanie i liczbę](docs/media/12-multimemory.webp)         |            ![MultiSnake: wąż i ponumerowane jabłka na łące](docs/media/13-multisnake.webp)            |
|                  **MultiMemory** — przypomnij sobie, na której karcie znajduje się wynik odwróconego działania.                   |         **MultiSnake** — rośnij, połykając właściwe liczby, i unikaj wszystkich pozostałych.          |

## ✨ Funkcje

### 🎮 Tryby gry

- **Tryb Odkrywanie**: wizualna i interaktywna eksploracja dostosowana do każdego działania
- **Tryb Quiz**: pytania wielokrotnego wyboru z obsługą 4 działań (×, +, −, ÷) i adaptacyjnym postępem
- **Tryb Wyzwanie**: wyścig z czasem obejmujący 4 działania (×, +, −, ÷) i różne poziomy trudności
- **Tryb Przygoda**: fabularne przechodzenie kolejnych poziomów z obsługą 4 działań

### 🕹️ Minigry Arcade

- **MultiInvaders**: edukacyjny Space Invaders — niszcz błędne odpowiedzi
- **MultiMiam**: matematyczny Pac-Man — zbieraj poprawne odpowiedzi
- **MultiMemory**: gra pamięciowa — łącz działania z wynikami
- **MultiSnake**: edukacyjny Snake — rośnij, zjadając właściwe liczby

### ➕ Obsługa wielu działań

LeapMultix oferuje kompleksowy trening 4 działań arytmetycznych we **wszystkich trybach**:

| Tryb       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Wyzwanie   | ✅  | ✅  | ✅  | ✅  |
| Odkrywanie | ✅  | ✅  | ✅  | ✅  |
| Przygoda   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funkcje wspólne

- **Wielu użytkowników**: zarządzanie indywidualnymi profilami z zapisywaniem postępów
- **Wielojęzyczność**: obsługa języka francuskiego, angielskiego i hiszpańskiego
- **Personalizacja**: awatary, motywy kolorystyczne, tła
- **Dostępność**: nawigacja za pomocą klawiatury, obsługa dotyku, zgodność z WCAG 2.1 AA
- **Nagrany głos**: pytania i zachęty odczytywane przez wcześniej nagrany głos syntetyczny (Lucie po francusku, utworzona za pomocą ElevenLabs; Jane po angielsku, utworzona za pomocą Mistral AI), z automatycznym przełączeniem na głos urządzenia; klipy nie są dostępne w publicznym repozytorium (zobacz [Nagrany głos](#-nagrany-głos))
- **Responsywność mobilna**: interfejs zoptymalizowany pod kątem tabletów i smartfonów
- **System postępów**: wyniki, odznaki, codzienne wyzwania

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
npm run voice:generate     # Générer les clips (ElevenLabs ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Architektura

### Struktura plików

Moduły JavaScript znajdują się **bezpośrednio w `js/`**, z wyjątkiem trzech katalogów:
`core/`, `components/` i `modes/`. Dlatego to nazwa pliku wskazuje
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

**Nowoczesne moduły ES6**: projekt korzysta z architektury modułowej z klasami ES6 oraz natywnymi importami i eksportami.

**Komponenty wielokrotnego użytku**: interfejs zbudowany ze scentralizowanych komponentów UI (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: inteligentne ładowanie modułów na żądanie za pomocą `lazy-loader.js` w celu zoptymalizowania początkowej wydajności.

**Ujednolicony system przechowywania danych**: scentralizowane API do utrwalania danych użytkownika za pomocą LocalStorage z mechanizmami rezerwowymi.

**Scentralizowane zarządzanie dźwiękiem**: sterowanie dźwiękiem z obsługą wielu języków i preferencji poszczególnych użytkowników.

**Event Bus**: niezależna komunikacja zdarzeniowa między komponentami zapewniająca łatwą w utrzymaniu architekturę.

**Nawigacja za pomocą slajdów**: system nawigacji oparty na numerowanych slajdach (slide0, slide1 itd.) z użyciem `goToSlide()`.

**Bezpieczeństwo**: ochrona przed XSS i oczyszczanie danych za pomocą `security-utils.js` przy wszystkich operacjach na DOM.

## 🎯 Szczegółowy opis trybów gry

### Tryb Odkrywanie

Interfejs wizualnego poznawania tabliczki mnożenia obejmujący:

- Interaktywną wizualizację mnożenia
- Animacje i pomoce ułatwiające zapamiętywanie
- Edukacyjne przeciąganie i upuszczanie
- Swobodne postępy w każdej tabliczce

### Tryb Quiz

Pytania wielokrotnego wyboru obejmujące:

- 10 pytań na sesję
- Adaptacyjny postęp zależny od poprawnych odpowiedzi
- Wirtualną klawiaturę numeryczną
- System streak (serii poprawnych odpowiedzi)

### Tryb Wyzwanie

Wyścig z czasem obejmujący:

- 3 poziomy trudności (Początkujący, Średni, Trudny)
- Premię czasową za poprawne odpowiedzi
- System żyć
- Ranking najlepszych wyników

### Tryb Przygoda

Fabularne przechodzenie kolejnych etapów obejmujące:

- 10 możliwych do odblokowania poziomów tematycznych
- Interaktywną mapę z wizualizacją postępów
- Wciągającą historię z postaciami
- System gwiazdek i nagród

### Minigry Arcade

Każda minigra oferuje:

- Wybór poziomu trudności i personalizację
- System żyć i punktacji
- Sterowanie za pomocą klawiatury i dotyku
- Indywidualne rankingi dla każdego użytkownika

## 🔧 Programowanie

### Workflow programistyczny

**Nigdy nie commituj bezpośrednio do main.** W projekcie prace prowadzone są w osobnych gałęziach
funkcjonalności.

**1. Utwórz gałąź**, `feat/` dla funkcji, `fix/` dla poprawki:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Wprowadź zmiany i je zweryfikuj.** Formatowanie jest sprawdzane jako pierwsze: CI odrzuci zmiany,
zanim jeszcze uruchomi testy.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Utwórz commit w gałęzi**, a następnie ją wypchnij:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Otwórz pull request** i poczekaj na analizy: verify, Codacy,
CodeFactor oraz SonarCloud. Przed scaleniem poprawiaj problemy, aż wszystkie kontrole zakończą się pomyślnie.

**Styl commitów**: zwięzłe komunikaty w trybie rozkazującym (np. „Fix arcade init errors”, „Refactor cache updater”)

**Quality gate**: przed każdym commitem upewnij się, że `npm run lint`, `npm test` i `npm run test:coverage` kończą się powodzeniem

### Architektura komponentów

**GameMode (klasa bazowa)**: wszystkie tryby dziedziczą po wspólnej klasie ze standaryzowanymi metodami.

**GameModeManager**: scentralizowane koordynowanie uruchamiania trybów i zarządzania nimi.

**Komponenty UI**: TopBar, InfoBar, Dashboard i Customization zapewniają spójny interfejs.

**Lazy Loading**: moduły są ładowane na żądanie w celu zoptymalizowania początkowej wydajności.

**Event Bus**: niezależna komunikacja między komponentami za pośrednictwem systemu zdarzeń.

### Testy

Projekt zawiera kompletny zestaw testów:

- Testy jednostkowe modułów core
- Testy integracyjne komponentów
- Testy trybów gry
- Automatyczne pokrycie kodu

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Build produkcyjny

- **Rollup**: tworzy bundle `js/main-es6.js` w formacie ESM z code-splittingiem i sourcemapami
- **Terser**: automatyczna minifikacja w celu optymalizacji
- **Post-build**: kopiuje `css/` i `assets/`, favikony (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` oraz przepisuje `dist/index.html` tak, aby wskazywał plik wejściowy z hashem (np. `main-es6-*.js`)
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

**`seo-report`** — po `verify`: audyt Lighthouse witryny online w celu
długoterminowego śledzenia metryk SEO.

**Zewnętrzne analizy** podłączone do pull requestów: Codacy, CodeFactor oraz
SonarCloud. Bramka SonarCloud wymaga ocen A za niezawodność, bezpieczeństwo i
łatwość utrzymania nowego kodu.

**Wdrożenie**: `./deploy.sh` synchronizuje witrynę z S3 i unieważnia pamięć podręczną
CloudFront. W razie potrzeby skrypt ponownie generuje responsywne obrazy, których nie ma w git.

### PWA (Progressive Web App)

LeapMultix jest kompletną aplikacją PWA z obsługą trybu offline i możliwością instalacji.

**Service Worker** (`sw.js`):

- Nawigacja: Network-first z rezerwowym przejściem w trybie offline do `offline.html`
- Obrazy: Cache-first w celu optymalizacji wydajności
- Tłumaczenia: Stale-while-revalidate do aktualizacji w tle
- JS/CSS: Network-first, aby zawsze udostępniać najnowszą wersję
- Automatyczne zarządzanie wersją za pomocą `cache-updater.js`

**Manifest** (`manifest.json`):

- Ikony SVG i PNG dla wszystkich urządzeń
- Możliwość instalacji na urządzeniach mobilnych (Add to Home Screen)
- Konfiguracja standalone zapewniająca wrażenia podobne do aplikacji
- Obsługa motywów i kolorów

**Testowanie trybu offline lokalnie.** Uruchom serwer, a następnie otwórz
`http://localhost:8080` (lub wyświetlony port):

```bash
npm run serve
```

Ręcznie: wyłącz sieć w narzędziach programistycznych (karta Sieć,
tryb offline), a następnie odśwież stronę. Powinien wyświetlić się `offline.html`.

Automatycznie za pomocą Puppeteer:

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

- Usuwanie nieużywanych zmiennych i parametrów (`no-unused-vars`)
- Stosowanie konkretnej obsługi błędów (bez pustych bloków catch)
- Unikanie `innerHTML` na rzecz funkcji `security-utils.js`
- Utrzymywanie złożoności poznawczej funkcji poniżej 15
- Wydzielanie złożonych funkcji do mniejszych helperów

**Bezpieczeństwo**:

- **Ochrona przed XSS**: Korzystanie z funkcji `security-utils.js`:
  - `appendSanitizedHTML()` zamiast `innerHTML`
  - `createSafeElement()` do tworzenia bezpiecznych elementów
  - `setSafeMessage()` dla treści tekstowej
- **Skrypty zewnętrzne**: Obowiązkowy atrybut `crossorigin="anonymous"`
- **Walidacja danych wejściowych**: Zawsze sanityzować dane zewnętrzne
- **Content Security Policy**: Nagłówki CSP ograniczające źródła skryptów

**Dostępność**:

- Zgodność z WCAG 2.1 AA
- Pełna nawigacja za pomocą klawiatury
- Odpowiednie role i etykiety ARIA
- Zgodny kontrast kolorów

**Wydajność**:

- Lazy loading modułów za pomocą `lazy-loader.js`
- Optymalizacja CSS i responsywnych zasobów
- Service Worker do inteligentnego buforowania
- Code splitting i minifikacja w środowisku produkcyjnym

## 📱 Kompatybilność

### Obsługiwane przeglądarki

Interfejs opiera się na `oklch()` w przypadku kolorów oraz na `:has()` w przypadku
stanów kontekstowych, co wyznacza następujące minimalne wersje:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Urządzenia

- **Komputery stacjonarne**: Sterowanie za pomocą klawiatury i myszy
- **Tablety**: Zoptymalizowany interfejs dotykowy
- **Smartfony**: Adaptacyjny design responsywny

### Dostępność

- Pełna nawigacja za pomocą klawiatury (Tab, strzałki, Esc)
- Role i etykiety ARIA dla czytników ekranu
- Zgodny kontrast kolorów
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

### Skrypty zarządzania i18n

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

**Zakres tłumaczeń:**

- Kompletny interfejs użytkownika
- Instrukcje do gier
- Komunikaty o błędach i informacje zwrotne
- Opisy i pomoc kontekstowa
- Treści narracyjne trybu Przygoda
- Etykiety dostępności i ARIA

## 🔊 Nagrany głos

Gra odczytuje na głos pytania, słowa zachęty i objaśnienia, korzystając z wcześniej nagranego głosu syntetycznego:

- po francusku — **Lucie**, utworzona za pomocą ElevenLabs (model Eleven v3);
- po angielsku — **Jane**, utworzona za pomocą Mistral AI (Voxtral TTS).

Gra wypowiada tylko skończony zbiór fraz, około 7 400 na język: wszystkie są nagrywane wcześniej i żadna część nie wywołuje usługi syntezy. W wersji hiszpańskiej na razie używany jest głos urządzenia.

- **Automatyczne przełączanie awaryjne** na głos urządzenia dla każdej frazy: gdy klipu brakuje lub wystąpił błąd, przeglądarka odrzuciła odtwarzanie, klip nie uruchomił się w ciągu 1,5 s albo urządzenie jest offline, a klipu nie ma w pamięci podręcznej.
- **Ustawienia**: przycisk głosu na górnym pasku włącza lub wyłącza odczytywanie; pole „Nagrany głos” (Dostępność i sterowanie) pozwala wybrać między nagranym głosem (Lucie lub Jane) a głosem urządzenia.
- **Offline**: wcześniej odsłuchane klipy pozostają w pamięci podręcznej (service worker).

### Klipów nie ma w tym repozytorium

Klipy znajdują się w prywatnym repozytorium i dedykowanym bucket S3, udostępnianym przez CloudFront pod adresem `/voice/*`. Fork oraz lokalne środowisko deweloperskie korzystają więc z głosu urządzenia: w repozytorium znacznik `<meta name="leapmultix-voice-base">` jest pusty i tylko wdrożenie produkcyjne zapisuje w nim `/voice/`.

Jeśli klipy znajdują się na komputerze (prywatne repozytorium sklonowane obok gry w `../leapmultix-voices`), parametr `?voix=local` umożliwia ich odtwarzanie przez serwer deweloperski:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Generowanie klipów

Proces jest zautomatyzowany skryptami w `scripts/voice/` i uruchamiany na komputerze właściciela, nigdy w publicznym CI. Klucze dostawców (ElevenLabs dla języka francuskiego, Mistral dla angielskiego) pozostają w pliku `.env` poza repozytorium, przekazywanym przez `node --env-file`: żaden klucz nie trafia do git. Skill Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) prowadzi krok po kroku przez procedurę (bramki, zatwierdzenia, wznowienia); szczegóły znajdują się w [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Oszacuj** pozostałe frazy i liczbę płatnych znaków (Eleven v3: około 0,53 kredytu za znak; Voxtral TTS: 16 USD za milion znaków).
2. **Wygeneruj**. Ponowne uruchomienie tego samego polecenia uzupełnia brakujące elementy. Po wyczerpaniu kredytów skrypt kończy działanie w kontrolowany sposób (kod 3), nie pozostawiając częściowo zapisanego pliku. `--max-total-chars` ogranicza łączny koszt wersji: każda płatna odpowiedź jest zapisywana w rejestrze natychmiast po jej otrzymaniu, a rejestr zachowuje dane nawet po nagłym zatrzymaniu. W przypadku Mistral, który nie udostępnia możliwego do odczytania salda, jest to jedyne zabezpieczenie.
3. **Sprawdź**: każda fraza ma klip, a każdy plik MP3 jest prawidłowy. Następnie Whisper lokalnie transkrybuje każdy klip, a kontrola zgłasza błędnie rozpoznane liczby i nietypowy czas trwania. `voice:review` uruchamia kolejno Whisper, tę kontrolę i stronę odsłuchową za pomocą jednego polecenia.
4. **Odsłuchaj** na stronie odsłuchowej (`voice:listen`) zgłoszone klipy oraz próbkę form żeńskich („jeden razy 7”), których Whisper nie rozróżnia. Każdy klip ma pole „do ponownego nagrania”, które dodaje go do listy odrzuconych klipów.
5. **Nagraj ponownie** odrzucone klipy (`--redo`) i ponownie uruchom Whisper, a następnie porównaj każdy klip przed zmianą i po niej na drugiej stronie. Klip nadal wymawiany nieprawidłowo po dwóch lub trzech próbach otrzymuje wymuszony tekst w `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), na przykład liczbę zapisaną słownie.
6. **Opublikuj** klipy, sprawdź, czy są dostępne online, a następnie opublikuj indeks języka, najpierw dla testerów (`?voix=test`).
7. **Udostępnij** głos wszystkim użytkownikom, a następnie włącz go domyślnie. Wyłącznik awaryjny (`voice:publish -- remove`) usuwa język z indeksu: gra powraca wtedy do głosu urządzenia.

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

### Reguła: zmienioną wypowiadaną frazę należy nagrać ponownie przed wdrożeniem produkcyjnym

Każda wypowiadana fraza pochodzi z tłumaczeń (`assets/translations/{fr,en,es}.json`) i jest częścią korpusu. Zmiana wypowiadanej frazy powoduje więc niepowodzenie testu blokady korpusu (`scripts/voice/corpus.lock.json`). Dla języka z nagranym głosem należy wówczas wygenerować klipy zmienionych fraz, sprawdzić je i odsłuchać, a następnie opublikować **przed** scaleniem. Na koniec należy zaktualizować blokadę (`npm run voice:corpus:lock`). Bez tych klipów zmieniona fraza jest odczytywana głosem urządzenia.

## 📊 Przechowywanie danych

### Dane użytkownika

- Profile i preferencje
- Postępy według trybu gry
- Wyniki i statystyki gier zręcznościowych
- Ustawienia personalizacji

### Funkcje techniczne

- Pamięć lokalna (localStorage) z mechanizmami fallback
- Izolacja danych poszczególnych użytkowników
- Automatyczne zapisywanie postępów
- Automatyczna migracja starszych danych

## 🐛 Zgłaszanie problemu

Problemy można zgłaszać za pomocą issues GitHub. Prosimy podać:

- Szczegółowy opis problemu
- Kroki umożliwiające jego odtworzenie
- Nazwę i wersję przeglądarki
- Zrzuty ekranu, jeśli są istotne

## 💝 Wesprzyj projekt

**[☕ Przekaż darowiznę przez PayPal](https://paypal.me/jls)**

## 📄 Licencja

Ten projekt jest objęty licencją AGPL v3. Więcej informacji znajduje się w pliku `LICENSE`.

---

_LeapMultix — otwarta aplikacja edukacyjna do nauki czterech działań arytmetycznych_

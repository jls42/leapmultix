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
![Licence : AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

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
- [Rozwój](#-rozwój)
- [Kompatybilność](#-kompatybilność)
- [Lokalizacja](#-lokalizacja)
- [Nagrany głos](#-nagrany-głos)
- [Przechowywanie danych](#-przechowywanie-danych)
- [Zgłaszanie problemów](#-zgłaszanie-problemów)
- [Licencja](#-licencja)

## Opis

LeapMultix to interaktywna edukacyjna aplikacja internetowa przeznaczona dla dzieci w wieku od 6 do 12 lat, służąca do opanowania 4 operacji arytmetycznych: mnożenia (×), dodawania (+), odejmowania (−) i dzielenia (÷). Oferuje **5 trybów gry** i **4 minigry arcade** w intuicyjnym, dostępnym i wielojęzycznym interfejsie.

**Obsługa wielu operacji:** wszystkie pięć trybów akceptuje cztery operacje. Wyboru dokonuje się na ekranie głównym i obowiązuje on na całej ścieżce.

**Opracowane przez:** Julien LS (contact@jls42.org)

**Adres URL online:** https://leapmultix.jls42.org/

## 📸 Przegląd

### Ekrany

|                                                                                                                        |                                                                                                                         |
| :--------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------: |
|                             ![Ekran „Kto gra?”: wybór profilu](docs/media/01-accueil.webp)                             |                         ![Menu główne: wybór operacji i pięciu trybów](docs/media/02-menu.webp)                         |
|                        **Kto gra?** — profil dla każdego dziecka, z jego awatarem i postępami.                         |                         **Menu** — tutaj wybiera się operację, po czym otwiera się pięć trybów.                         |
|           ![Tryb Odkrywanie: tabliczka mnożenia przez 4 pokazana w punktach](docs/media/03-decouverte.webp)            |                ![Tryb Quiz: błędna odpowiedź na czerwono, poprawna na zielono](docs/media/04-quiz.webp)                 |
| **Odkrywanie** — każde działanie jest przedstawione w postaci punktów, skoków lub liczenia, ze wskazówką do tabliczki. | **Quiz** — wybór dziecka pozostaje wyświetlony obok poprawnej odpowiedzi, a wyjaśnienie szczegółowo opisuje obliczenia. |
|                         ![Tryb Wyzwanie: odliczanie i bieżąca seria](docs/media/05-defi.webp)                          |              ![Tryb Przygoda: mapa dziesięciu poziomów, kolejne zablokowane](docs/media/06-aventure.webp)               |
|     **Wyzwanie** — wyścig z czasem. Przy błędzie stoper zatrzymuje się na czas przeczytania poprawnej odpowiedzi.      |                 **Przygoda** — dziesięć poziomów odblokowywanych jeden po drugim w zamian za gwiazdki.                  |
|                               ![Menu Arcade: cztery minigry](docs/media/07-arcade.webp)                                |            ![Pulpit nawigacyjny: gwiazdki według tabliczki i statystyki](docs/media/08-tableau-de-bord.webp)            |
|                      **Arcade** — cztery minigry z regulacją poziomu trudności i wyborem statku.                       |           **Pulpit nawigacyjny** — gwiazdki według tabliczki, tabliczki do powtórzenia, wyniki według trybów.           |
|                  ![Personalizacja: awatary, motywy, dostępność](docs/media/09-personnalisation.webp)                   |                                                                                                                         |
|          **Personalizacja** — awatar, motyw kolorystyczny, rozmiar tekstu, wysoki kontrast, kod rodzicielski.          |                                                                                                                         |

### Minigry arcade

Cztery gry zadające to samo pytanie — wyświetlane nad obszarem
gry, wraz z pozostałym czasem i życiami — lecz wymagające za każdym razem innego
działania.

|                                                                                                             |                                                                                                    |
| :---------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: |
|        ![MultiInvaders: potwory z liczbami, statek na dole ekranu](docs/media/10-multiinvaders.webp)        | ![MultiMiam: labirynt, w którym kropki zawierają możliwe odpowiedzi](docs/media/11-multimiam.webp) |
| **MultiInvaders** — strzelaj w błędne odpowiedzi, oszczędzaj poprawną: kryje ona przyjaciela do uwolnienia. |        **MultiMiam** — przemierzaj labirynt, aby zebrać właściwy wynik, unikając potworów.         |
| ![MultiMemory: siatka kart, dwie odwrócone pokazujące obliczenie i liczbę](docs/media/12-multimemory.webp)  |          ![MultiSnake: wąż i ponumerowane jabłka na łące](docs/media/13-multisnake.webp)           |
|                **MultiMemory** — odnajduj z pamięci kartę z wynikiem odwróconego obliczenia.                |         **MultiSnake** — rośnij, zjadając właściwe liczby, unikaj wszystkich pozostałych.          |

## ✨ Funkcje

### 🎮 Tryby gry

- **Tryb Odkrywanie**: Wizualna i interaktywna eksploracja dostosowana do każdej operacji
- **Tryb Quiz**: Pytania wielokrotnego wyboru z obsługą 4 operacji (×, +, −, ÷) i adaptacyjną progresją
- **Tryb Wyzwanie**: Wyścig z czasem obejmujący 4 operacje (×, +, −, ÷) oraz różne poziomy trudności
- **Tryb Przygoda**: Progresja fabularna według poziomów z obsługą 4 operacji

### 🕹️ Minigry arcade

- **MultiInvaders**: Edukacyjny Space Invaders - Niszczenie błędnych odpowiedzi
- **MultiMiam**: Matematyczny Pac-Man - Zbieranie poprawnych odpowiedzi
- **MultiMemory**: Gra pamięciowa - Dopasowywanie operacji i wyników
- **MultiSnake**: Edukacyjny Snake - Rośnięcie poprzez zjadanie właściwych liczb

### ➕ Obsługa wielu operacji

LeapMultix oferuje pełny trening 4 operacji arytmetycznych we **wszystkich trybach**:

| Tryb       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Wyzwanie   | ✅  | ✅  | ✅  | ✅  |
| Odkrywanie | ✅  | ✅  | ✅  | ✅  |
| Przygoda   | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funkcje ogólne

- **Wielu użytkowników**: Zarządzanie indywidualnymi profilami z zapisanymi postępami
- **Wielojęzyczność**: Obsługa języka francuskiego, angielskiego i hiszpańskiego
- **Personalizacja**: Awatary, motywy kolorystyczne, tła
- **Dostępność**: Nawigacja klawiaturą, obsługa dotykowa, zgodność z WCAG 2.1 AA
- **Nagrany głos**: gra potrafi odczytywać pytania i słowa zachęty za pomocą wstępnie nagranego głosu syntezy, z automatycznym przełączaniem na głos urządzenia. Głosy nie znajdują się w tym repozytorium: strona leapmultix.jls42.org udostępnia Lucie w języku francuskim, Sulafat w języku angielskim i hiszpańskim oraz Jane do wyboru w języku angielskim (zobacz [Nagrany głos](#-nagrany-głos))
- **Responsywność mobilna**: Interfejs zoptymalizowany pod kątem tabletów i smartfonów
- **System progresji**: Punkty, odznaki, codzienne wyzwania

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

Moduły JavaScript znajdują się **bezpośrednio w katalogu `js/`**, z wyjątkiem trzech folderów:
`core/`, `components/` i `modes/`. To nazwa pliku określa
grupowanie (`arcade-*`, `multimiam-*`, `i18n*`…).

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

**Lazy Loading**: Inteligentne ładowanie modułów na żądanie za pomocą `lazy-loader.js` w celu optymalizacji początkowej wydajności.

**Ujednolicony system przechowywania danych**: Scentralizowane API do utrwalania danych użytkownika przez LocalStorage z mechanizmami fallback.

**Scentralizowane zarządzanie dźwiękiem**: Kontrola dźwięku z obsługą wielu języków i preferencjami dla każdego użytkownika.

**Event Bus**: Rozproszona komunikacja oparta na zdarzeniach między komponentami zapewniająca łatwą w utrzymaniu architekturę.

**Nawigacja za pomocą slajdów**: System nawigacji oparty na ponumerowanych slajdach (slide0, slide1 itp.) z `goToSlide()`.

**Bezpieczeństwo**: Ochrona przed atakami XSS i sanityzacja danych za pomocą `security-utils.js` dla wszystkich operacji na DOM.

## 🎯 Szczegółowe tryby gry

### Tryb Odkrywanie

Interfejs wizualnej eksploracji tabliczki mnożenia oferujący:

- Interaktywną wizualizację mnożenia
- Animacje i pomoce pamięciowe
- Edukacyjne przeciąganie i upuszczanie (drag-and-drop)
- Swobodną progresję według tabliczek

### Tryb Quiz

Pytania wielokrotnego wyboru zawierające:

- 10 pytań na sesję
- Adaptacyjną progresję zależną od trafności odpowiedzi
- Wirtualną klawiaturę numeryczną
- System serii (streak poprawnych odpowiedzi)

### Tryb Wyzwanie

Wyścig z czasem obejmujący:

- 3 poziomy trudności (Początkujący, Średni, Trudny)
- Dodatkowy czas za poprawne odpowiedzi
- System żyć
- Ranking najlepszych wyników

### Tryb Przygoda

Progresja narracyjna oferująca:

- 10 poziomów tematycznych do odblokowania
- Interaktywną mapę z wizualizacją postępów
- Wciągającą fabułę z postaciami
- System gwiazdek i nagród

### Minigry arcade

Każda minigra oferuje:

- Wybór trudności i personalizację
- System żyć i punktacji
- Sterowanie za pomocą klawiatury i dotyku
- Indywidualne rankingi dla każdego użytkownika

## 🔧 Rozwój

### Workflow programistyczny

**Nigdy nie commituj bezpośrednio do gałęzi main.** Projekt opiera się na gałęziach
funkcjonalności.

**1. Utwórz gałąź**, `feat/` dla nowej funkcji, `fix/` dla poprawki:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Rozwijaj i weryfikuj.** Formatowanie jest na pierwszym miejscu: system CI odrzuci je
jeszcze przed uruchomieniem testów.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Zacommituj zmiany w gałęzi**, a następnie wypchnij ją:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Otwórz pull request** i poczekaj na analizy: verify, Codacy,
CodeFactor oraz SonarCloud. Poprawki wprowadza się aż do uzyskania zielonego statusu przed scaleniem.

**Styl commitów**: Zwięzłe komunikaty w trybie rozkazującym (np.: „Fix arcade init errors”, „Refactor cache updater”)

**Quality gate**: Przed każdym commitem upewnij się, że `npm run lint`, `npm test` i `npm run test:coverage` przechodzą pomyślnie

### Architektura komponentów

**GameMode (klasa bazowa)**: Wszystkie tryby dziedziczą ze wspólnej klasy ze standaryzowanymi metodami.

**GameModeManager**: Scentralizowana orkiestracja uruchamiania i zarządzania trybami.

**Komponenty UI**: TopBar, InfoBar, Dashboard i Customization zapewniają spójny interfejs.

**Lazy Loading**: Moduły są ładowane na żądanie, aby zoptymalizować początkową wydajność.

**Event Bus**: Rozproszona komunikacja między komponentami za pośrednictwem systemu zdarzeń.

### Testy

Projekt zawiera kompletny zestaw testów:

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

### Build produkcyjny

- **Rollup**: Pakowanie `js/main-es6.js` do formatu ESM z dzieleniem kodu (code-splitting) i mapami źródłowymi (sourcemaps)
- **Terser**: Automatyczna minifikacja dla celów optymalizacji
- **Post-build**: Kopiowanie `css/` i `assets/`, faviconów (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` oraz przepisanie `dist/index.html` na haszowany plik wejściowy (np.: `main-es6-*.js`)
- **Katalog końcowy**: `dist/` gotowy do serwowania statycznego

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Ciągła integracja (CI)

**GitHub Actions**: `.github/workflows/ci.yml`, uruchamiane przy każdym wypchnięciu do
`main` oraz przy każdym pull requeście.

**`verify`** — blokująca bramka jakości:

- `npm ci`, a następnie `npm run verify` (ESLint, testy Jest, pokrycie kodu)
- `npm run format:check` (Prettier)

**`seo-report`** — po `verify`: audyt Lighthouse działającej witryny w celu
długoterminowego śledzenia wskaźników SEO.

**Zewnętrzne analizy** podpięte pod pull requesty: Codacy, CodeFactor i
SonarCloud. Bramka SonarCloud wymaga ocen A w zakresie niezawodności, bezpieczeństwa i
utrzymywalności nowego kodu.

**Wdrożenie**: `./deploy.sh` synchronizuje stronę z S3 i unieważnia pamięć podręczną
CloudFront. Skrypt w razie potrzeby ponownie generuje responsywne obrazy, które nie znajdują się w repozytorium git.

### PWA (Progressive Web App)

LeapMultix to pełnoprawna aplikacja PWA z obsługą trybu offline i możliwością instalacji.

**Service Worker** (`sw.js`):

- Nawigacja: Network-first z trybem awaryjnym offline do `offline.html`
- Obrazy: Cache-first w celu optymalizacji wydajności
- Tłumaczenia: Stale-while-revalidate dla aktualizacji w tle
- JS/CSS: Network-first, aby zawsze serwować najnowszą wersję
- Automatyczne zarządzanie wersjami za pomocą `cache-updater.js`

**Manifest** (`manifest.json`):

- Ikony SVG i PNG dla wszystkich urządzeń
- Możliwość instalacji na urządzeniach mobilnych (Dodaj do ekranu głównego)
- Konfiguracja standalone zapewniająca doświadczenie zbliżone do natywnej aplikacji
- Obsługa motywów i kolorów

**Lokalne testowanie trybu offline.** Uruchom serwer, a następnie otwórz
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

- **ESLint**: nowoczesna konfiguracja z flat config (`eslint.config.js`), obsługa ES2022
- **Prettier**: automatyczne formatowanie kodu (`.prettierrc`)
- **Stylelint**: walidacja CSS (`.stylelintrc.json`)
- **JSDoc**: automatyczna dokumentacja funkcji z analizą pokrycia

**Ważne zasady pisania kodu**:

- Usuwać nieużywane zmienne i parametry (`no-unused-vars`)
- Stosować specyficzną obsługę błędów (brak pustych bloków catch)
- Unikać `innerHTML` na rzecz funkcji `security-utils.js`
- Utrzymywać złożoność kognitywną < 15 dla funkcji
- Wydzielać złożone funkcje do mniejszych funkcji pomocniczych

**Bezpieczeństwo**:

- **Ochrona przed XSS**: używać funkcji z `security-utils.js`:
  - `appendSanitizedHTML()` zamiast `innerHTML`
  - `createSafeElement()` do bezpiecznego tworzenia elementów
  - `setSafeMessage()` dla zawartości tekstowej
- **Zewnętrzne skrypty**: atrybut `crossorigin="anonymous"` jest obowiązkowy
- **Walidacja danych wejściowych**: zawsze oczyszczać dane zewnętrzne
- **Content Security Policy**: nagłówki CSP w celu ograniczenia źródeł skryptów

**Dostępność**:

- Zgodność z WCAG 2.1 AA
- Pełna nawigacja za pomocą klawiatury
- Odpowiednie role ARIA i etykiety
- Zgodne kontrasty kolorów

**Wydajność**:

- Lazy loading modułów za pomocą `lazy-loader.js`
- Optymalizacje CSS i responsywne zasoby
- Service Worker dla inteligentnego buforowania
- Code splitting i minifikacja na produkcji

## 📱 Kompatybilność

### Obsługiwane przeglądarki

Interfejs opiera się na `oklch()` w zakresie kolorów oraz na `:has()` w zakresie stanów kontekstowych, co wyznacza wymagania minimalne:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Urządzenia

- **Komputery stacjonarne**: obsługa klawiaturą i myszą
- **Tablety**: zoptymalizowany interfejs dotykowy
- **Smartfony**: adaptacyjny, responsywny design

### Dostępność

- Pełna nawigacja za pomocą klawiatury (Tab, strzałki, Esc)
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

**`npm run i18n:verify`** – Weryfikacja spójności kluczy tłumaczeń

**`npm run i18n:unused`** – Wyświetlanie nieużywanych kluczy tłumaczeń

**`npm run i18n:compare`** – Porównywanie plików tłumaczeń z fr.json (wzorzec)

Ten skrypt (`scripts/compare-translations.cjs`) zapewnia synchronizację wszystkich plików językowych:

**Funkcje:**

- Wykrywanie brakujących kluczy (obecnych w fr.json, ale nieobecnych w innych językach)
- Wykrywanie nadmiarowych kluczy (obecnych w innych językach, ale nie w fr.json)
- Identyfikacja pustych wartości (`""`, `null`, `undefined`, `[]`)
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
- Komunikaty błędów i informacje zwrotne
- Opisy i pomoc kontekstowa
- Treści narracyjne trybu Przygoda
- Etykiety dostępności i ARIA

## 🔊 Nagrany głos

Gra odczytuje na głos pytania, słowa zachęty i wyjaśnienia. Wypowiada jedynie skończony zbiór zdań, około 7 400 na język – mogą one zatem zostać nagrane raz na zawsze, dzięki czemu żadna rozgrywka nie odwołuje się do usługi syntezy mowy. Bez nagrań gra czyta głosem urządzenia.

### W tym repozytorium: aplikacja bez głosów

Kod potrafi odtwarzać wstępnie nagrane klipy i zawiera ciąg narzędziowy do ich tworzenia. Klipów jednak w nim nie ma, podobnie jak kluczy dostawców: fork lub instalacja lokalna korzysta z głosu urządzenia.

- **Automatyczny fallback** na głos urządzenia, zdanie po zdaniu: brakujący klip lub błąd, odrzucenie odtwarzania przez przeglądarkę, klip nierozpoczynający się w ciągu 1,5 s lub tryb offline bez klipu w pamięci podręcznej.
- **Ustawienia**: przycisk głosu na górnym pasku włącza lub wyłącza odczytywanie; pole wyboru „Nagrany głos” (Dostępność i sterowanie) pozwala wybrać między nagranym głosem a głosem urządzenia. Pojawia się ono tylko w tych językach, dla których głos został opublikowany.
- **Offline**: odsłuchane wcześniej klipy pozostają w pamięci podręcznej (service worker).
- **Gdzie gra szuka klipów**: w tagu `<meta name="leapmultix-voice-base">`, pustym w repozytorium. Tylko wdrożenie produkcyjne wpisuje tam `/voice/`.

Mając własne klipy na maszynie lokalnej (wygenerowane przez poniższy ciąg narzędzi, umieszczone obok gry w `../leapmultix-voices`), parametr `?voix=local` sprawia, że serwer deweloperski je odczytuje:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Na leapmultix.jls42.org: głosy z hostingu

Serwis udostępniany przez autora serwuje nagrane głosy syntetyczne:

- w języku francuskim: **Lucie**, stworzony za pomocą ElevenLabs (model Eleven v3);
- w brytyjskim angielskim i hiszpańskim z Hiszpanii: **Sulafat**, stworzony za pomocą Google Cloud Text-to-Speech (głos Chirp 3 HD);
- w języku angielskim, do wyboru przez gracza: **Jane**, stworzony za pomocą Mistral AI (Voxtral TTS).

Klipy znajdują się w prywatnym repozytorium oraz w dedykowanym zasobniku S3, serwowanym przez CloudFront pod adresem `/voice/*`. W ustawieniach menu „Głos” oferuje dostępne głosy dla danego języka (jeśli jest ich kilka), a adnotacja wskazuje usługę, z której pochodzi odsłuchiwany głos.

### Generowanie klipów

Ciąg narzędziowy jest oskryptowany w `scripts/voice/` i uruchamiany na maszynie właściciela, nigdy w publicznym CI. Klucze dostawców (ElevenLabs dla francuskiego, Google Cloud Text-to-Speech dla angielskiego i hiszpańskiego, Mistral dla Jane) pozostają w pliku `.env` poza repozytorium, przekazywanym przez `node --env-file`: żaden klucz nie trafia do gita. Umiejętność Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) prowadzi przez procedurę krok po kroku (bramki, zgody, ponowne próby); szczegóły znajdują się w [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Oszacować** pozostałe zdania i płatne znaki (Eleven v3: około 0,53 kredytu za znak; Chirp 3 HD: 30 $ za milion znaków, pierwszy milion każdego miesiąca za darmo; Voxtral TTS: 16 $ za milion).
2. **Wygenerować**. Ponowne uruchomienie tego samego polecenia wznawia brakujące elementy. Gdy kredyty się wyczerpią, skrypt zatrzymuje się w sposób kontrolowany (kod 3), nie pozostawiając na wpół zapisanych plików. `--max-total-chars` ogranicza łączny koszt danej wersji: każda opłacona odpowiedź jest rejestrowana od razu po odebraniu w rejestrze, który przetrwa nagłe przerwanie działania. W przypadku Google i Mistrala, które nie podają czytelnego salda, jest to jedyne zabezpieczenie.
3. **Skontrolować**: każde zdanie ma swój klip, a każdy plik MP3 jest poprawny. Następnie Whisper transkrybuje lokalnie każdy klip, a kontrola zgłasza błędnie usłyszane liczby oraz nietypowe czasy trwania. `voice:review` łączy uruchomienie Whispera, tę kontrolę oraz stronę odsłuchową w jedno polecenie.
4. **Odsłuchać** na stronie odsłuchowej (`voice:listen`) zgłoszone klipy oraz próbkę form żeńskich („une fois 7”), których Whisper nie rozróżnia. Każdy klip ma pole „do powtórzenia”, które dodaje go do listy odrzuconych klipów.
5. **Nagrać ponownie** odrzucone klipy (`--redo`) i ponownie uruchomić Whispera, a następnie porównać każdy klip przed i po na drugiej stronie. Klip nadal niepoprawnie wypowiadany po dwóch lub trzech próbach otrzymuje narzucony tekst w `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), na przykład liczbę słownie.
6. **Opublikować** klipy, upewnić się, że odpowiadają online, a następnie opublikować indeks języka, początkowo dla testerów (`?voix=test`).
7. **Udostępnić** głos wszystkim, a następnie włączyć go domyślnie. Wyłącznik bezpieczeństwa (`voice:publish -- remove`) usuwa język z indeksu: gra powraca do głosu urządzenia.

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

### Zasada: zmodyfikowane zdanie mówione nagrywa się ponownie przed wdrożeniem na produkcję

Każde wypowiadane zdanie pochodzi z tłumaczeń (`assets/translations/{fr,en,es}.json`) i jest częścią korpusu. Zmiana zdania mówionego powoduje więc niepowodzenie testu blokady korpusu (`scripts/voice/corpus.lock.json`). W przypadku języka, który posiada nagrany głos, generuje się wtedy klipy dla zmienionych zdań, weryfikuje je i odsłuchuje, a następnie publikuje **przed** scaleniem. Na koniec aktualizuje się blokadę (`npm run voice:corpus:lock`). Bez tych klipów zmodyfikowane zdanie jest odczytywane głosem urządzenia.

## 📊 Przechowywanie danych

### Dane użytkownika

- Profile i preferencje
- Postępy w poszczególnych trybach gry
- Wyniki i statystyki gier zręcznościowych
- Ustawienia personalizacji

### Kwestie techniczne

- Pamięć lokalna (localStorage) z mechanizmami awaryjnymi
- Izolacja danych per użytkownik
- Automatyczny zapis postępów
- Automatyczna migracja starszych danych

## 🐛 Zgłaszanie problemów

Problemy można zgłaszać poprzez zgłoszenia w serwisie GitHub. Prosimy o dołączenie:

- Szczegółowego opisu problemu
- Kroków do jego odtworzenia
- Przeglądarki i jej wersji
- Zrzutów ekranu, jeśli są przydatne

## 💝 Wesprzyj projekt

**[☕ Przekaż darowiznę przez PayPal](https://paypal.me/jls)**

## 📄 Licencja

Ten projekt jest objęty licencją AGPL v3. Więcej szczegółów znajduje się w pliku `LICENSE`.

---

_LeapMultix – bezpłatna aplikacja edukacyjna do nauki czterech działań arytmetycznych_

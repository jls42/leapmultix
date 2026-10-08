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
- [Podgląd](#-podgląd)
- [Funkcje](#-funkcje)
- [Szybki start](#-szybki-start)
- [Architektura](#-architektura)
- [Szczegółowy opis trybów gry](#-szczegółowy-opis-trybów-gry)
- [Programowanie](#-programowanie)
- [Kompatybilność](#-zgodność)
- [Lokalizacja](#-lokalizacja)
- [Nagrany głos](#-nagrany-głos)
- [Przechowywanie danych](#-przechowywanie-danych)
- [Zgłaszanie problemu](#-zgłaszanie-problemu)
- [Licencja](#-licencja)

## Opis

LeapMultix to interaktywna edukacyjna aplikacja internetowa przeznaczona dla dzieci w wieku od 6 do 12 lat, pomagająca opanować 4 działania arytmetyczne: mnożenie (×), dodawanie (+), odejmowanie (−) i dzielenie (÷). Oferuje **6 trybów gry** i **4 minigry arcade** w intuicyjnym, dostępnym i wielojęzycznym interfejsie.

**Obsługa wielu działań:** wszystkie tryby obsługują cztery działania. Wyboru dokonuje się na ekranie głównym i obowiązuje on przez całą rozgrywkę.

**Autor:** Julien LS (contact@jls42.org)

**Adres strony:** https://leapmultix.jls42.org/

## 📸 Podgląd

### Ekrany

|                                                                                                                                                          |                                                                                                                            |
| :------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: |
|                                              ![Ekran „Kto gra?”: wybór profilu](docs/media/01-accueil.webp)                                              |                            ![Menu główne: wybór działania i trybu gry](docs/media/02-menu.webp)                            |
|                                      **Kto gra?** — osobny profil dla każdego dziecka, z jego awatarem i postępami.                                      |                               **Menu** — tutaj wybiera się działanie, a następnie tryb gry.                                |
|                      ![Tryb Odkrywanie: tabliczka mnożenia przez 4 przedstawiona za pomocą punktów](docs/media/03-decouverte.webp)                       |                 ![Tryb Quiz: błędna odpowiedź na czerwono, prawidłowa na zielono](docs/media/04-quiz.webp)                 |
|            **Odkrywanie** — każde równanie jest przedstawiane za pomocą punktów, skoków lub liczenia, wraz ze wskazówką dotyczącą tabliczki.             | **Quiz** — wybór dziecka pozostaje widoczny obok prawidłowej odpowiedzi, a objaśnienie szczegółowo przedstawia obliczenie. |
|                                          ![Tryb Wyzwanie: odliczanie i bieżąca seria](docs/media/05-defi.webp)                                           |              ![Tryb Przygoda: mapa dziesięciu poziomów, kolejne są zablokowane](docs/media/06-aventure.webp)               |
|                    **Wyzwanie** — wyścig z czasem. Po błędzie stoper zatrzymuje się, aby można było przeczytać prawidłową odpowiedź.                     |                       **Przygoda** — dziesięć poziomów odblokowywanych kolejno w zamian za gwiazdki.                       |
|                                  ![Tryb Na czas: rozgrywka z odejmowaniem, stoper i postęp](docs/media/14-chrono.webp)                                   |                                 ![Menu Arcade: cztery minigry](docs/media/07-arcade.webp)                                  |
| **Na czas** — dziesięć prawidłowych odpowiedzi w wyścigu z czasem, dla wybranego działania; błędnie rozwiązane obliczenia trafiają na listę do powtórki. |                       **Arcade** — cztery minigry z ustawieniem poziomu trudności i wyborem statku.                        |
|             ![Panel wyników: rozgrywki, rekordy i odpowiedzi w każdym trybie, z podziałem na działania](docs/media/08-tableau-de-bord.webp)              |                ![Personalizacja: awatary, motywy, ułatwienia dostępu](docs/media/09-personnalisation.webp)                 |
|             **Panel wyników** — rozgrywki i rekordy w każdym trybie, z podziałem na działania; gwiazdki i tabliczki do powtórki w mnożeniu.              |        **Personalizacja** — awatary odblokowywane za monety, motyw kolorystyczny, rozmiar tekstu i wysoki kontrast.        |

### Minigry arcade

Cztery gry zadające to samo pytanie — wyświetlane nad obszarem gry wraz z pozostałym czasem i liczbą żyć — ale każda z nich wymaga wykonania innej czynności.

|                                                                                                                               |                                                                                                   |
| :---------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
|                 ![MultiInvaders: potwory z liczbami i statek u dołu ekranu](docs/media/10-multiinvaders.webp)                 | ![MultiMiam: labirynt, w którym kulki zawierają możliwe odpowiedzi](docs/media/11-multimiam.webp) |
| **MultiInvaders** — strzelaj do błędnych odpowiedzi, oszczędzając prawidłową: ukrywa ona przyjaciela, którego trzeba uwolnić. |       **MultiMiam** — przemierzaj labirynt, aby złapać prawidłowy wynik, unikając potworów.       |
|            ![MultiMemory: siatka kart, dwie odwrócone pokazują działanie i liczbę](docs/media/12-multimemory.webp)            |          ![MultiSnake: wąż i ponumerowane jabłka na łące](docs/media/13-multisnake.webp)          |
|                **MultiMemory** — przypomnij sobie, na której karcie znajduje się wynik odwróconego działania.                 |      **MultiSnake** — rośnij, połykając prawidłowe liczby, i unikaj wszystkich pozostałych.       |

## ✨ Funkcje

### 🎮 Tryby gry

- **Tryb Odkrywanie**: wizualne i interaktywne poznawanie dostosowane do każdego działania
- **Tryb Quiz**: pytania wielokrotnego wyboru z obsługą 4 działań (×, +, −, ÷) i adaptacyjnym postępem
- **Tryb Wyzwanie**: wyścig z czasem obejmujący 4 działania (×, +, −, ÷) i różne poziomy trudności
- **Tryb Przygoda**: fabularne przechodzenie kolejnych poziomów z obsługą 4 działań
- **Tryb Na czas**: 10 prawidłowych odpowiedzi przy nieustannie działającym stoperze, aby pobić swój najlepszy czas, z wykorzystaniem 4 działań (×, +, −, ÷)

### 🕹️ Minigry Arcade

- **MultiInvaders**: edukacyjna gra typu Space Invaders — niszczenie błędnych odpowiedzi
- **MultiMiam**: matematyczna gra typu Pac-Man — zbieranie prawidłowych odpowiedzi
- **MultiMemory**: gra pamięciowa — dopasowywanie działań do wyników
- **MultiSnake**: edukacyjna gra typu Snake — rośnięcie poprzez zjadanie prawidłowych liczb

### ➕ Obsługa wielu działań

LeapMultix oferuje kompleksowe ćwiczenia z 4 działań arytmetycznych we **wszystkich trybach**:

| Tryb       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Wyzwanie   | ✅  | ✅  | ✅  | ✅  |
| Odkrywanie | ✅  | ✅  | ✅  | ✅  |
| Przygoda   | ✅  | ✅  | ✅  | ✅  |
| Na czas    | ✅  | ✅  | ✅  | ✅  |
| Arcade     | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funkcje przekrojowe

- **Wielu użytkowników**: osobny profil dla każdego dziecka wraz z jego postępami; na komputerze klasowym imiona są sortowane, filtr pojawia się od 10 graczy, kosz przechowuje dane przez 30 dni, a dane graczy można zapisać do pliku
- **Wielojęzyczność**: obsługa języka francuskiego, angielskiego i hiszpańskiego
- **Personalizacja**: awatary (pierwszy do wyboru, pozostałe odblokowywane za monety zdobyte podczas gry, po 50 monet każdy), motywy kolorystyczne, tła
- **Dostępność**: pełna obsługa za pomocą klawiatury, obsługa dotykowa, pauza w trybie Arcade, rozmiar tekstu i wysoki kontrast; sprawdzono za pomocą axe-core, bez naruszeń WCAG poziomu A lub AA na przetestowanych ekranach
- **Nagrany głos**: gra potrafi odczytywać pytania i słowa zachęty za pomocą nagranego wcześniej głosu syntetycznego, z automatycznym przełączeniem na głos urządzenia. Głosy nie znajdują się w tym repozytorium: witryna leapmultix.jls42.org udostępnia głos Lucie w języku francuskim, Sulafat w języku angielskim i hiszpańskim, a także do wyboru Sulafat i Marie w języku francuskim oraz Jane w języku angielskim (zobacz [Nagrany głos](#-nagrany-głos))
- **Responsywność mobilna**: interfejs zoptymalizowany pod kątem tabletów i smartfonów
- **System postępów**: panel wyników dla każdego profilu (rozgrywki, rekordy i tabliczki do powtórki, z podziałem na działania), odznaki, codzienne wyzwania, monety (w trybach Na czas, Przygoda, Wyzwanie oraz w Wyzwaniu dnia)

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

## 🧱 Architektura

### Struktura plików

Moduły JavaScript znajdują się **bezpośrednio w `js/`**, z wyjątkiem trzech katalogów:
`core/`, `components/` i `modes/`. Dlatego to nazwa pliku określa
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

### Architektura techniczna

**Nowoczesne moduły ES6**: projekt wykorzystuje architekturę modułową z klasami ES6 oraz natywnymi importami i eksportami.

**Komponenty wielokrotnego użytku**: interfejs zbudowany z centralnie zarządzanych komponentów UI (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: inteligentne ładowanie modułów na żądanie za pomocą `lazy-loader.js` w celu zoptymalizowania początkowej wydajności.

**Ujednolicony system przechowywania**: scentralizowane API do utrwalania danych użytkownika za pomocą LocalStorage z mechanizmami rezerwowymi.

**Scentralizowane zarządzanie dźwiękiem**: sterowanie dźwiękiem z obsługą wielu języków i preferencjami poszczególnych użytkowników.

**Event Bus**: rozdzielona komunikacja oparta na zdarzeniach między komponentami, zapewniająca łatwą w utrzymaniu architekturę.

**Nawigacja za pomocą slajdów**: system nawigacji oparty na numerowanych slajdach (slide0, slide1 itd.) z użyciem `goToSlide()`.

**Bezpieczeństwo**: ochrona przed XSS i sanityzacja za pomocą `security-utils.js` przy wszystkich operacjach na DOM.

## 🎯 Szczegółowy opis trybów gry

### Tryb Odkrywanie

Interfejs wizualnego poznawania dostosowany do każdego działania, obejmujący:

- Interaktywną wizualizację mnożenia
- Animacje i pomoce pamięciowe
- Edukacyjne przeciąganie i upuszczanie
- Swobodny postęp w obrębie każdej tabliczki

### Tryb Quiz

Pytania wielokrotnego wyboru obejmujące:

- 10 pytań w każdej sesji
- Adaptacyjny postęp zależny od poprawnych odpowiedzi
- Wirtualną klawiaturę numeryczną
- System streak (serię prawidłowych odpowiedzi)

### Tryb Wyzwanie

Wyścig z czasem obejmujący:

- 3 poziomy trudności (Początkujący, Średni, Trudny)
- Premię czasową za prawidłowe odpowiedzi
- System żyć
- Ranking najlepszych wyników

### Tryb Przygoda

Fabularny postęp obejmujący:

- 10 tematycznych poziomów do odblokowania
- Interaktywną mapę z wizualizacją postępów
- Wciągającą historię z postaciami
- System gwiazdek i nagród

### Tryb Na czas

Dziesięć prawidłowych odpowiedzi w jak najkrótszym czasie, przy nieustannie działającym stoperze:

- Cztery działania: tabliczki mnożenia (skonfigurowane w Ustawieniach tabliczek) oraz
  wszystkie tabliczki dodawania (7 + k), odejmowania ((7 + k) − 7) i dzielenia ((7 × k) ÷ 7)
- Odpowiadanie przez wybór lub za pomocą klawiatury numerycznej, kliknięciem albo z klawiatury
- Najlepsze czasy, średni czas i wykres ostatnich rozgrywek dla każdego działania
- „Moje obliczenia do powtórki”: osobna lista dla każdego działania, powtarzana w obu kierunkach (6 × 7 i 7 × 6,
  15 − 7 i 15 − 8)

### Panel wyników

Rzeczywista aktywność dziecka, osobno dla każdego profilu:

- Gwiazdki z Przygody i tabliczki mnożenia do powtórki (20 ostatnich odpowiedzi z każdej tabliczki)
- Pytania i prawidłowe odpowiedzi w trybach Quiz, Wyzwanie, Przygoda i Na czas
- Rozgrywki i rekordy w każdym trybie i każdej minigrze, łącznie z przerwanymi rozgrywkami, z podziałem na działania,
  gdy tylko dziecko zacznie ćwiczyć więcej niż jedno

### Minigry Arcade

Każda minigra oferuje:

- Trzy poziomy trudności w czterech działaniach
- System żyć i punktację
- Sterowanie myszą, klawiaturą i dotykiem, opisane na karcie gry
- Pauzę: przycisk obok czasu lub klawisz P; gra jest również wstrzymywana po ukryciu karty
  i nigdy nie wznawia się samoczynnie
- MultiMemory: opcjonalnie rozgrywkę bez limitu czasu
- Planszę dopasowaną do dostępnej przestrzeni (wyższą niż szerszą na telefonie w orientacji pionowej) oraz tryb pełnoekranowy,
  zarówno na komputerze, jak i na telefonie, także po obróceniu telefonu (z wyjątkiem iPhone'a, którego przeglądarka
  na to nie pozwala)
- Najlepsze wyniki każdego gracza; opcja „Wyzeruj” dokładnie informuje, co usuwa

## 🔧 Programowanie

### Workflow programistyczny

**Nigdy nie commituj bezpośrednio do main.** Projekt wykorzystuje osobne branche
dla poszczególnych funkcji.

**1. Utwórz branch**, `feat/` dla funkcji lub `fix/` dla poprawki:

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

**4. Otwórz pull request** i zaczekaj na analizy: verify, Codacy,
CodeFactor i SonarCloud. Poprawiaj błędy aż do uzyskania zielonego wyniku, zanim dokonasz scalenia.

**Styl commitów**: zwięzłe komunikaty w trybie rozkazującym (np. „Fix arcade init errors”, „Refactor cache updater”)

**Quality gate**: przed każdym commitem upewnij się, że `npm run lint`, `npm test` i `npm run test:coverage` przechodzą pomyślnie

### Architektura komponentów

**GameMode (klasa bazowa)**: wszystkie tryby dziedziczą po wspólnej klasie ze standaryzowanymi metodami.

**GameModeManager**: scentralizowana koordynacja uruchamiania trybów i zarządzania nimi.

**Komponenty UI**: TopBar, InfoBar, Dashboard i Customization zapewniają spójny interfejs.

**Lazy Loading**: moduły są ładowane na żądanie w celu zoptymalizowania początkowej wydajności.

**Event Bus**: rozdzielona komunikacja między komponentami za pomocą systemu zdarzeń.

### Testy

Projekt zawiera kompletny zestaw testów:

- Testy jednostkowe modułów core
- Testy integracyjne komponentów
- Testy trybów gry
- Automatyczne mierzenie pokrycia kodu

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
- **Post-build**: kopiuje `css/` i `assets/`, favikony (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` oraz przepisuje `dist/index.html` na zahaszowany plik wejściowy (np. `main-es6-*.js`)
- **Katalog wynikowy**: `dist/` gotowy do udostępniania statycznego

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Ciągła integracja

**GitHub Actions**: `.github/workflows/ci.yml`, uruchamiany przy każdym pushu do
`main` oraz przy każdym pull requeście.

**`verify`** — blokująca bramka jakości:

- `npm ci`, a następnie `npm run verify` (ESLint, testy Jest, pokrycie)
- `npm run format:check` (Prettier)

**`seo-report`** — po `verify`: audyt Lighthouse witryny online w celu
długoterminowego śledzenia metryk SEO.

**Zewnętrzne analizy** podłączone do pull requestów: Codacy, CodeFactor i
SonarCloud. Bramka SonarCloud wymaga ocen A za niezawodność, bezpieczeństwo i
łatwość utrzymania nowego kodu.

**Wdrażanie**: `./deploy.sh` synchronizuje witrynę z S3 i unieważnia pamięć podręczną
CloudFront. W razie potrzeby skrypt ponownie generuje obrazy responsywne, których nie ma w git.

### PWA (Progressive Web App)

LeapMultix jest kompletną aplikacją PWA z obsługą trybu offline i możliwością instalacji.

**Service Worker** (`sw.js`):

- Instalacja: wstępne ładowanie wszystkiego, czego wymaga gra, z listy wygenerowanej na podstawie kodu
  przez `scripts/precache-list.mjs` (`npm run precache:update`, sprawdzanej przez testy): po
  pierwszej wizycie 6 trybów i 4 gry Arcade uruchamiają się offline
- Nawigacja: Network-first; offline używana jest strona gry z pamięci podręcznej (`offline.html` tylko
  dla strony, która nigdy nie została zapisana)
- Obrazy: Cache-first; offline używany jest inny rozmiar tego samego sprite’a lub inne tło tego samego awatara
- Tłumaczenia: Stale-while-revalidate w celu aktualizacji w tle
- JS/CSS: Network-first, aby zawsze udostępniać najnowszą wersję, z pamięcią podręczną offline
- Dźwięki i fonty: Cache-first, z obsługą zakresów bajtów (odtwarzacz audio Safari)
- Automatyczne zarządzanie wersjami za pomocą `cache-updater.js`

**Manifest** (`manifest.json`):

- Ikony SVG i PNG dla wszystkich urządzeń
- Możliwość instalacji na urządzeniach mobilnych (Add to Home Screen)
- Konfiguracja standalone zapewniająca działanie podobne do aplikacji
- Obsługa motywów i kolorów

**Testowanie trybu offline lokalnie.** Uruchom serwer, a następnie otwórz
`http://localhost:8080` (lub wyświetlony port):

```bash
npm run serve
```

Ręcznie: pozostaw stronę otwartą, dopóki service worker nie zapisze gry, zatrzymaj
serwer (lub wyłącz sieć urządzenia), a następnie odśwież stronę. Gra powinna
się wyświetlić, a każdy tryb powinien się uruchamiać.

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

**Narzędzia zapewniania jakości kodu**:

- **ESLint**: nowoczesna konfiguracja z flat config (`eslint.config.js`), obsługa ES2022
- **Prettier**: automatyczne formatowanie kodu (`.prettierrc`)
- **Stylelint**: walidacja CSS (`.stylelintrc.json`)
- **JSDoc**: automatyczna dokumentacja funkcji wraz z analizą pokrycia

**Ważne reguły dotyczące kodu**:

- Usuwanie nieużywanych zmiennych i parametrów (`no-unused-vars`)
- Stosowanie konkretnej obsługi błędów (bez pustych bloków catch)
- Unikanie `innerHTML` na rzecz funkcji `security-utils.js`
- Utrzymywanie złożoności poznawczej funkcji poniżej 15
- Wydzielanie złożonych funkcji do mniejszych helperów

**Bezpieczeństwo**:

- **Ochrona przed XSS**: używanie funkcji z `security-utils.js`:
  - `appendSanitizedHTML()` zamiast `innerHTML`
  - `createSafeElement()` do bezpiecznego tworzenia elementów
  - `setSafeMessage()` dla treści tekstowych
- **Skrypty zewnętrzne**: wymagany atrybut `crossorigin="anonymous"`
- **Walidacja danych wejściowych**: zawsze sanityzować dane zewnętrzne
- **Content Security Policy**: nagłówki CSP ograniczające źródła skryptów

**Dostępność**:

- Cel: WCAG 2.1 na poziomie AA, kontrolowany za pomocą axe-core: brak naruszeń poziomu A lub AA ani
  dobrych praktyk
- Pełna nawigacja za pomocą klawiatury
- Role ARIA i dostępne nazwy
- Kontrast sprawdzany przez axe-core

**Wydajność**:

- Lazy loading modułów za pomocą `lazy-loader.js`
- Optymalizacja CSS i responsywnych zasobów
- Service Worker do inteligentnego buforowania
- Code splitting i minifikacja w środowisku produkcyjnym

## 📱 Zgodność

### Obsługiwane przeglądarki

Interfejs wykorzystuje `oklch()` do kolorów oraz `:has()` do
stanów kontekstowych, co określa minimalne wersje:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Urządzenia

- **Komputery**: sterowanie za pomocą klawiatury i myszy
- **Tablety**: zoptymalizowany interfejs dotykowy
- **Smartfony**: adaptacyjny design responsywny

### Dostępność

- Pełna nawigacja za pomocą klawiatury: Tab, strzałki w siatkach odpowiedzi i na kartach
  MultiMemory, Enter, Escape; łącze „Przejdź do trybów gry” u góry strony głównej
- Jedna zasada opuszczania rozgrywki: „Poddaj się”, Escape lub przycisk na górnym pasku
  wyświetlają to samo pytanie, a rozgrywka trwa dalej, jeśli dziecko odmówi
- Czytniki ekranu: każda odpowiedź jest powiązana ze swoim pytaniem, każdy ekran ma jeden nagłówek
  poziomu 1, a komunikaty są odczytywane
- Stronę można powiększać gestem szczypania (poza grami Arcade); dostępne są ustawienia rozmiaru tekstu,
  wysokiego kontrastu i ograniczonych animacji oraz font do nauki czytania oparty na Andika,
  zaprojektowany dla początkujących czytelników
- Arcade: pauza (przycisk, klawisz P lub ukrycie karty); opcjonalnie MultiMemory bez limitu czasu
- Kontrola za pomocą axe-core (WCAG od 2.0 do 2.2, poziomy A i AA oraz dobre praktyki): brak
  naruszeń na 40 ekranach w szerokości komputerowej i 39 w szerokości telefonu (390 px), również
  z motywem Noc i wysokim kontrastem

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

**`npm run i18n:verify`** — sprawdzanie spójności kluczy tłumaczeń

**`npm run i18n:unused`** — wyświetlanie nieużywanych kluczy tłumaczeń

**`npm run i18n:compare`** — porównywanie plików tłumaczeń z fr.json (plikiem referencyjnym)

Ten skrypt (`scripts/compare-translations.cjs`) zapewnia synchronizację wszystkich plików językowych:

**Funkcje:**

- Wykrywanie brakujących kluczy (obecnych w fr.json, ale nieobecnych w innych językach)
- Wykrywanie dodatkowych kluczy (obecnych w innych językach, ale nieobecnych w fr.json)
- Identyfikowanie pustych wartości (`""`, `null`, `undefined`, `[]`)
- Sprawdzanie spójności typów (string a array)
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

## 🔊 Nagrany głos

Gra odczytuje na głos pytania, słowa zachęty i wyjaśnienia. Wypowiada tylko skończony zbiór zdań, około 7400 na język, można je więc nagrać raz na zawsze, dzięki czemu podczas rozgrywki nie jest wywoływana żadna usługa syntezy mowy. Bez klipów gra korzysta z głosu urządzenia.

### W tym repozytorium: aplikacja bez głosów

Kod potrafi odtwarzać wcześniej nagrane klipy i zawiera pipeline służący do ich tworzenia. Nie ma w nim ani klipów, ani kluczy dostawców: fork lub instalacja lokalna korzysta z głosu urządzenia.

- **Automatyczny fallback** na głos urządzenia, osobno dla każdego zdania: brak klipu lub błąd klipu, odmowa odtworzenia przez przeglądarkę, brak rozpoczęcia odtwarzania klipu w ciągu 1,5 s albo praca offline bez klipu w pamięci podręcznej.
- **Ustawienia**: przycisk głosu na górnym pasku włącza lub wyłącza odczytywanie; pole wyboru „Nagrany głos” (Dostępność i sterowanie) pozwala wybrać między nagranym głosem a głosem urządzenia. Pojawia się tylko w językach, dla których opublikowano głos.
- **Offline**: wcześniej odsłuchane klipy pozostają w pamięci podręcznej (service worker).
- **Gdzie gra szuka klipów**: w znaczniku `<meta name="leapmultix-voice-base">`, pustym w repozytorium. Tylko wdrożenie produkcyjne zapisuje w nim `/voice/`.

Aby korzystać z własnych klipów na komputerze (utworzonych za pomocą opisanego niżej pipeline’u i umieszczonych obok gry w `../leapmultix-voices`), parametr `?voix=local` pozwala serwerowi deweloperskiemu je odtwarzać:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### W witrynie leapmultix.jls42.org: głosy udostępniane przez hosting

Witryna udostępniana przez autora oferuje nagrane głosy syntetyczne:

- po francusku **Lucie**, utworzoną za pomocą ElevenLabs (model Eleven v3);
- w brytyjskiej odmianie angielskiego i europejskiej odmianie hiszpańskiego **Sulafat**, utworzoną za pomocą Google Cloud Text-to-Speech (głos Chirp 3 HD);
- według wyboru gracza **Sulafat** po francusku, aby zachować ten sam głos we wszystkich trzech językach;
- również według wyboru gracza **Marie** po francusku i **Jane** po angielsku, utworzone za pomocą Mistral AI (Voxtral TTS).

Klipy znajdują się w prywatnym repozytorium oraz w dedykowanym buckecie S3, udostępnianym przez CloudFront pod adresem `/voice/*`. Są generowane jednorazowo: podczas gry nic nie jest wysyłane do tych usług. W ustawieniach menu „Głos” pozwala wybrać głosy dostępne dla danego języka, jeśli jest ich kilka, a informacja obok wskazuje usługę, z której pochodzi słyszany głos.

### Generowanie klipów

Pipeline jest oskryptowany w `scripts/voice/` i uruchamiany na komputerze właściciela, nigdy w publicznym CI. Klucze dostawców (ElevenLabs dla Lucie, Google Cloud Text-to-Speech dla Sulafat, Mistral dla Marie i Jane) pozostają w pliku `.env` poza repozytorium, przekazywanym przez `node --env-file`: żaden klucz nie trafia do git. Skill Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) prowadzi krok po kroku przez procedurę (bramki, potwierdzenia, wznawianie); szczegóły znajdują się w [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Oszacuj** liczbę pozostałych zdań i liczbę płatnych znaków (Eleven v3: około 0,53 kredytu za znak; Chirp 3 HD: 30 USD za milion znaków, przy czym pierwszy milion w każdym miesiącu jest bezpłatny; Voxtral TTS: 16 USD za milion).
2. **Wygeneruj**. Ponowne uruchomienie tego samego polecenia uzupełnia brakujące elementy. Po wyczerpaniu kredytów skrypt zatrzymuje się prawidłowo (kod 3), nie pozostawiając częściowo zapisanego pliku. `--max-total-chars` ogranicza łączne wydatki danej wersji: każda opłacona odpowiedź jest zapisywana w rejestrze natychmiast po odebraniu, a rejestr przetrwa nagłe zatrzymanie. W przypadku Google i Mistral, które nie udostępniają możliwego do odczytania salda, jest to jedyne zabezpieczenie.
3. **Sprawdź**: każde zdanie ma swój klip, a każdy plik MP3 jest prawidłowy. Następnie Whisper transkrybuje lokalnie każdy klip, a kontrola zgłasza błędnie rozpoznane liczby i nietypowe czasy trwania. `voice:review` uruchamia kolejno Whisper, tę kontrolę i stronę odsłuchu za pomocą jednego polecenia.
4. **Odsłuchaj** na stronie odsłuchu (`voice:listen`) zgłoszone klipy oraz próbkę form żeńskich („jeden razy 7”), których Whisper nie rozróżnia. Każdy klip ma pole wyboru „do ponownego nagrania”, które dodaje go do listy odrzuconych klipów.
5. **Nagraj ponownie** odrzucone klipy (`--redo`), ponownie uruchom Whisper, a następnie porównaj każdy klip przed zmianą i po niej na drugiej stronie. Klip, który po dwóch lub trzech próbach nadal jest nieprawidłowo wymawiany, otrzymuje narzucony tekst w `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), na przykład liczbę zapisaną słownie.
6. **Opublikuj** klipy, sprawdź, czy są dostępne online, a następnie opublikuj indeks języka, najpierw dla testerów (`?voix=test`).
7. **Udostępnij** głos wszystkim, a następnie włącz go domyślnie. Wyłącznik awaryjny (`voice:publish -- remove`) usuwa język z indeksu: gra powraca wtedy do głosu urządzenia.

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

### Zasada: zmienione wypowiadane zdanie należy nagrać ponownie przed wdrożeniem produkcyjnym

Każde wypowiadane zdanie pochodzi z tłumaczeń (`assets/translations/{fr,en,es}.json`) i należy do korpusu. Zmiana wypowiadanego zdania powoduje więc niepowodzenie testu blokady korpusu (`scripts/voice/corpus.lock.json`). W przypadku języka mającego nagrany głos należy wygenerować klipy dla zmienionych zdań, sprawdzić je i odsłuchać, a następnie opublikować **przed** scaleniem. Na końcu aktualizuje się blokadę (`npm run voice:corpus:lock`). Bez tych klipów zmienione zdanie zostanie odczytane głosem urządzenia.

## 📊 Przechowywanie danych

### Dane użytkownika

- Profile i preferencje
- Postępy według trybu gry
- Wyniki i statystyki gier Arcade
- Ustawienia personalizacji

### Funkcje techniczne

- Pamięć lokalna (localStorage) z mechanizmami fallback; przeglądarka otrzymuje żądanie, aby nie usuwała jej
  samodzielnie (`navigator.storage.persist()`)
- Kosz usuniętych graczy: 30 dni wraz ze wszystkimi ich danymi, przywracanie z ekranu
  „Kto gra?”
- Zapisywanie graczy do pliku JSON, możliwość wznowienia na tym lub innym urządzeniu (istniejący gracz
  nigdy nie jest nadpisywany)
- Dane gry przechowywane osobno dla każdego profilu, w tym statystyki dla poszczególnych działań: na współdzielonym urządzeniu błędy jednego gracza nie wpływają na pytania zadawane innemu
- Automatyczne zapisywanie postępów
- Automatyczna migracja starszych danych

## 🐛 Zgłaszanie problemu

Problemy można zgłaszać za pomocą issues GitHub. Prosimy podać:

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

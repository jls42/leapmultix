<details>
<summary>Ten dokument jest również dostępny w innych językach</summary>

- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Deutsch](./README.de.md)
- [中文](./README.zh.md)
- [हिन्दी](./README.hi.md)
- [العربية](./README.ar.md)
- [Français](./README.md)
- [Italiano](./README.it.md)
- [Svenska](./README.sv.md)
- [Nederlands](./README.nl.md)
- [Română](./README.ro.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)

</details>

# LeapMultix

<!-- Odznaki (zaktualizuj <owner>/<repo> po migracji na GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Spis treści

- [Opis](#opis)
- [Funkcje](#-funkcje)
- [Szybki Start](#-szybki-start)
- [Architektura](#-architektura)
- [Szczegółowe Tryby Gry](#-szczegółowe-tryby-gry)
- [Rozwój](#-rozwój)
- [Kompatybilność](#-kompatybilność)
- [Lokalizacja](#-lokalizacja)
- [Przechowywanie Danych](#-przechowywanie-danych)
- [Zgłaszanie Problemów](#-zgłaszanie-problemów)
- [Licencja](#-licencja)

## Opis

LeapMultix to nowoczesna interaktywna aplikacja internetowa o charakterze edukacyjnym, zaprojektowana dla dzieci (8–12 lat) w celu opanowania 4 operacji arytmetycznych: mnożenia (×), dodawania (+), odejmowania (−) i dzielenia (÷). Aplikacja oferuje **5 trybów gry** i **4 minigry zręcznościowe** w intuicyjnym, dostępnym i wielojęzycznym interfejsie.

**Obsługa wielu operacji:** Tryby Quizu i Wyzwania pozwalają ćwiczyć wszystkie operacje. Tryby Odkrywania, Przygody i Zręcznościowe koncentrują się na mnożeniu, ale są zaprojektowane tak, aby obsługiwać wszystkie operacje.

**Opracowane przez:** Julien LS (contact@jls42.org)

**Adres URL online:** https://leapmultix.jls42.org/

## ✨ Funkcje

### 🎮 Tryby Gry

- **Tryb Odkrywania**: Wizualna i interaktywna eksploracja dostosowana do każdej operacji
- **Tryb Quizu**: Pytania wielokrotnego wyboru z obsługą wszystkich 4 operacji (×, +, −, ÷) i adaptacyjnym postępem
- **Tryb Wyzwania**: Wyścig z czasem ze wszystkimi 4 operacjami (×, +, −, ÷) i różnymi poziomami trudności
- **Tryb Przygody**: Narracyjny postęp według poziomów z obsługą wszystkich 4 operacji

### 🕹️ Minigry Zręcznościowe

- **MultiInvaders**: Edukacyjne Space Invaders - Niszcz błędne odpowiedzi
- **MultiMiam**: Matematyczny Pac-Man - Zbieraj poprawne odpowiedzi
- **MultiMemory**: Gra pamięciowa - Dopasuj działania i wyniki
- **MultiSnake**: Edukacyjny Snake - Rośnij, jedząc właściwe liczby

### ➕ Obsługa Wielu Operacji

LeapMultix oferuje pełny trening dla 4 operacji arytmetycznych we **wszystkich trybach**:

| Tryb          | ×   | +   | −   | ÷   |
| ------------- | --- | --- | --- | --- |
| Quiz          | ✅  | ✅  | ✅  | ✅  |
| Wyzwanie      | ✅  | ✅  | ✅  | ✅  |
| Odkrywanie    | ✅  | ✅  | ✅  | ✅  |
| Przygoda      | ✅  | ✅  | ✅  | ✅  |
| Zręcznościowy | ✅  | ✅  | ✅  | ✅  |

### 🌍 Funkcje Przekrojowe

- **Wieloużytkownikowość**: Zarządzanie indywidualnymi profilami z zapisanym postępem
- **Wielojęzyczność**: Obsługa języka francuskiego, angielskiego i hiszpańskiego
- **Personalizacja**: Awatary, motywy kolorystyczne, tła
- **Dostępność**: Nawigacja klawiaturą, obsługa dotyku, zgodność z WCAG 2.1 AA
- **Responsywność mobilna**: Interfejs zoptymalizowany dla tabletów i smartfonów
- **System postępów**: Wyniki, odznaki, codzienne wyzwania

## 🚀 Szybki Start

### Wymagania Wstępne

- Node.js (wersja 16 lub nowsza)
- Nowoczesna przeglądarka internetowa

### Instalacja

```bash
# Sklonuj projekt
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski (opcja 1)
npm run serve
# Aplikacja będzie dostępna pod adresem http://localhost:8080 (lub następnym dostępnym portem)

# Lub za pomocą Pythona (opcja 2)
python3 -m http.server 8000
# Aplikacja będzie dostępna pod adresem http://localhost:8000
```

### Dostępne Skrypty

```bash
# Rozwój
npm run serve          # Lokalny serwer (http://localhost:8080)
npm run lint           # Weryfikacja kodu za pomocą ESLint
npm run lint:fix       # Automatyczna naprawa problemów ESLint
npm run format:check   # Sprawdź formatowanie kodu (ZAWSZE przed commitem)
npm run format         # Formatuj kod za pomocą Prettier
npm run verify         # Brama jakości: lint + test + coverage

# Testy
npm run test           # Uruchom wszystkie testy (CJS)
npm run test:watch     # Testy w trybie watch
npm run test:coverage  # Testy z raportem pokrycia
npm run test:core      # Testy tylko dla modułów rdzenia
npm run test:integration # Testy integracyjne
npm run test:storage   # Testy systemu przechowywania
npm run test:esm       # Testy ESM (foldery tests-esm/, Jest vm-modules)
npm run test:verbose   # Testy ze szczegółowym wyjściem
npm run test:pwa-offline # Test offline PWA (wymaga Puppeteer), po `npm run serve`

# Analiza i Konserwacja
npm run analyze:jsdoc  # Analiza dokumentacji
npm run improve:jsdoc  # Automatyczna poprawa JSDoc
npm run audit:mobile   # Testy responsywności mobilnej
npm run audit:accessibility # Testy dostępności
npm run dead-code      # Wykrywanie nieużywanego kodu
npm run analyze:globals # Analiza zmiennych globalnych
npm run analyze:dependencies # Analiza użycia zależności
npm run verify:cleanup # Połączona analiza (martwy kod + globalne)

# Zarządzanie Zasobami
npm run assets:generate    # Generuj responsywne obrazy
npm run assets:backgrounds # Konwertuj tła na WebP
npm run assets:analyze     # Analiza responsywnych zasobów
npm run assets:diff        # Porównanie zasobów

# Internacjonalizacja
npm run i18n:verify    # Weryfikuj spójność kluczy tłumaczeń
npm run i18n:unused    # Lista nieużywanych kluczy tłumaczeń
npm run i18n:compare   # Porównaj tłumaczenia (en/es) z fr.json (referencja)

# Budowanie i Dostarczanie
npm run build          # Build produkcyjny (Rollup) + postbuild (kompletny dist/)
npm run serve:dist     # Serwuj dist/ na http://localhost:5000 (lub dostępnym porcie)

# PWA i Service Worker
npm run sw:disable     # Wyłącz service worker
npm run sw:fix         # Napraw problemy z service worker
```

## 🏗️ Architektura

### Struktura Plików

```
leapmultix/
├── index.html              # Główny punkt wejścia
├── js/
│   ├── core/               # Moduły rdzenia ES6
│   │   ├── GameMode.js     # Klasa bazowa dla trybów
│   │   ├── GameModeManager.js # Zarządzanie trybami gry
│   │   ├── storage.js      # API LocalStorage
│   │   ├── audio.js        # Zarządzanie dźwiękiem
│   │   ├── utils.js        # Ogólne narzędzia (źródło kanoniczne)
│   │   ├── eventBus.js     # Komunikacja zdarzeniowa
│   │   ├── userState.js    # Zarządzanie sesją użytkownika
│   │   ├── mainInit.js     # Inicjalizacja DOM-ready
│   │   ├── theme.js        # System motywów
│   │   ├── userUi.js       # Narzędzia interfejsu użytkownika
│   │   ├── parental.js     # Kontrola rodzicielska
│   │   ├── adventure-data.js # Dane trybu przygody
│   │   ├── mult-stats.js   # Statystyki mnożenia
│   │   ├── challenge-stats.js # Statystyki wyzwań
│   │   └── daily-challenge.js # Zarządzanie codziennymi wyzwaniami
│   ├── components/         # Komponenty UI wielokrotnego użytku
│   │   ├── topBar.js       # Pasek nawigacji
│   │   ├── infoBar.js      # Paski informacji o grze
│   │   ├── dashboard.js    # Panel użytkownika
│   │   └── customization.js # Interfejs personalizacji
│   ├── modes/              # Tryby gry
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Minigry zręcznościowe
│   │   ├── arcade.js       # Główny orkiestrator arcade
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Gra pamięciowa (31 KB)
│   │   ├── arcade-multimiam.js # Integracja MultiMiam
│   │   ├── arcade-multisnake.js # Integracja Snake
│   │   ├── arcade-common.js, arcade-utils.js # Współdzielone narzędzia
│   │   ├── arcade-message.js, arcade-points.js # Komponenty UI
│   │   └── arcade-scores.js # Zarządzanie wynikami
│   ├── multimiam/          # Gra Pac-Man (zdekomponowana architektura)
│   │   ├── multimiam.js    # Główny kontroler
│   │   ├── multimiam-engine.js # Silnik gry (15 KB)
│   │   ├── multimiam-renderer.js # System renderowania (9 KB)
│   │   ├── multimiam-controls.js # Zarządzanie sterowaniem (7 KB)
│   │   ├── multimiam-questions.js # Generowanie pytań (6 KB)
│   │   └── multimiam-ui.js # Elementy interfejsu
│   ├── multisnake.js       # Gra Snake (38 KB)
│   ├── navigation/         # System nawigacji
│   │   ├── slides.js       # Nawigacja oparta na slajdach (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Obsługa klawiatury
│   ├── ui/                 # Interfejs użytkownika i informacje zwrotne
│   │   ├── uiUtils.js      # Narzędzia interfejsu
│   │   ├── ui-feedback.js  # Mechanizmy informacji zwrotnej
│   │   ├── touch-support.js # Obsługa dotyku (7 KB)
│   │   ├── virtual-keyboard.js # Klawiatura wirtualna
│   │   ├── coin-display.js, coin-effects.js # System walutowy
│   │   ├── notifications.js # System powiadomień
│   │   └── badges.js       # System odznak
│   ├── media/              # Zarządzanie mediami
│   │   ├── VideoManager.js # Zarządzanie odtwarzaniem wideo (12 KB)
│   │   └── responsive-image-loader.js # Ładowanie obrazów (9 KB)
│   ├── orchestration/      # Orkiestracja i ładowanie
│   │   ├── mode-orchestrator.js # Przełączanie trybów
│   │   ├── lazy-loader.js  # Dynamiczne ładowanie (10 KB)
│   │   └── game-cleanup.js # Czyszczenie stanu
│   ├── utils/              # Narzędzia
│   │   ├── utils-es6.js    # Główny agregator (5 KB)
│   │   ├── main-helpers.js # Pomocnicy aplikacji
│   │   ├── helpers.js      # Przestarzałe funkcje pomocnicze
│   │   ├── stats-utils.js  # Narzędzia statystyczne
│   │   ├── difficulty.js   # Zarządzanie trudnością
│   │   └── questionGenerator.js # Generowanie pytań
│   ├── storage/            # Przechowywanie i stan
│   │   ├── storage.js      # Przestarzały wrapper przechowywania
│   │   └── userManager.js  # Zarządzanie wieloma użytkownikami (19 KB)
│   ├── i18n/               # Internacjonalizacja
│   │   ├── i18n.js         # System i18n
│   │   └── i18n-store.js   # Przechowywanie tłumaczeń
│   ├── security/           # Bezpieczeństwo i obsługa błędów
│   │   ├── security-utils.js # Ochrona XSS, sanityzacja
│   │   ├── error-handlers.js # Globalna obsługa błędów
│   │   └── logger.js       # System logowania
│   ├── accessibility/      # Dostępność
│   │   ├── accessibility.js # Funkcje dostępności
│   │   └── speech.js       # Obsługa syntezy mowy
│   ├── integration/        # Integracja i analityka
│   │   ├── plausible-init.js # Analityka Plausible
│   │   ├── cache-updater.js # Zarządzanie pamięcią podręczną (10 KB)
│   │   └── imports.js      # Narzędzia importu
│   ├── main-es6.js         # Punkt wejścia ES6
│   ├── main.js             # Główny orkiestrator
│   ├── bootstrap.js        # Konfiguracja obsługi zdarzeń ES6
│   └── game.js             # Zarządzanie stanem i codzienne wyzwania
├── css/                    # Modułowe style
├── assets/                 # Zasoby
│   ├── images/             # Obrazy i duszki
│   ├── generated-images/   # Wygenerowane responsywne obrazy
│   ├── sounds/             # Efekty dźwiękowe
│   ├── translations/       # Pliki tłumaczeń (fr, en, es)
│   └── videos/             # Filmy instruktażowe
├── tests/                  # Testy automatyczne
│   ├── __tests__/          # Testy jednostkowe i integracyjne
│   └── tests-esm/          # Testy ESM (.mjs)
├── scripts/                # Skrypty konserwacyjne
│   ├── compare-translations.cjs # Porównanie tłumaczeń
│   └── cleanup-i18n-keys.cjs # Czyszczenie kluczy i18n
└── dist/                   # Build produkcyjny (wygenerowany)
```

### Architektura Techniczna

**Nowoczesne Moduły ES6**: Projekt wykorzystuje architekturę modułową z klasami ES6 i natywnym importem/eksportem.

**Komponenty Wielokrotnego Użytku**: Interfejs zbudowany ze scentralizowanych komponentów UI (TopBar, InfoBar, Dashboard, Customization).

**Leniwe Ładowanie**: Inteligentne ładowanie modułów na żądanie za pomocą `lazy-loader.js` w celu optymalizacji początkowej wydajności.

**Jednolity System Przechowywania**: Scentralizowane API do trwałości danych użytkownika za pośrednictwem LocalStorage z opcjami awaryjnymi.

**Scentralizowane Zarządzanie Dźwiękiem**: Kontrola dźwięku z obsługą wielu języków i preferencjami dla każdego użytkownika.

**Szyna Zdarzeń**: Oddzielona komunikacja sterowana zdarzeniami między komponentami dla łatwej w utrzymaniu architektury.

**Nawigacja Slajdowa**: System nawigacji oparty na numerowanych slajdach (slide0, slide1 itp.) z `goToSlide()`.

**Bezpieczeństwo**: Ochrona XSS i sanityzacja za pomocą `security-utils.js` dla wszystkich manipulacji DOM.

## 🎯 Szczegółowe Tryby Gry

### Tryb Odkrywania

Wizualny interfejs eksploracji tabliczki mnożenia z:

- Interaktywną wizualizacją mnożenia
- Animacjami i pomocami pamięciowymi
- Edukacyjnym przeciągnij i upuść
- Swobodnym postępem dla każdej tablicy

### Tryb Quizu

Pytania wielokrotnego wyboru z:

- 10 pytaniami na sesję
- Adaptacyjnym postępem opartym na sukcesie
- Wirtualną klawiaturą numeryczną
- Systemem serii (seria poprawnych odpowiedzi)

### Tryb Wyzwania

Wyścig z czasem z:

- 3 poziomami trudności (Początkujący, Średni, Trudny)
- Premią czasową za poprawne odpowiedzi
- Systemem życia
- Tabelą najlepszych wyników

### Tryb Przygody

Narracyjny postęp z:

- 12 odblokowywalnymi poziomami tematycznymi
- Interaktywną mapą z wizualnym postępem
- Wciągającą historią z postaciami
- Systemem gwiazdek i nagród

### Minigry Zręcznościowe

Każda minigra oferuje:

- Wybór trudności i personalizacji
- System życia i wynik
- Sterowanie klawiaturą i dotykiem
- Indywidualne tabele wyników dla każdego użytkownika

## 🛠️ Rozwój

### Przepływ Pracy Rozwoju

**WAŻNE: Nigdy nie commituj bezpośrednio do main**

Projekt wykorzystuje przepływ pracy oparty na gałęziach funkcji:

1.  **Utwórz gałąź**:

    ```bash
    git checkout -b feat/nazwa-funkcji
    # lub
    git checkout -b fix/nazwa-bledu
    ```

2.  **Rozwijaj i testuj**:

    ```bash
    npm run format:check  # ZAWSZE najpierw sprawdź formatowanie
    npm run format        # Formatuj w razie potrzeby
    npm run lint          # Sprawdź jakość kodu
    npm run test          # Uruchom testy
    npm run test:coverage # Sprawdź pokrycie
    ```

3.  **Zcommituj do gałęzi**:

    ```bash
    git add .
    git commit -m "feat: opis funkcji"
    ```

4.  **Wypchnij i utwórz Pull Request**:
    ```bash
    git push -u origin feat/nazwa-funkcji
    ```

**Styl commita**: Zwięzły, tryb rozkazujący (np. "Fix arcade init errors", "Refactor cache updater")

**Brama jakości**: Upewnij się, że `npm run lint`, `npm test` i `npm run test:coverage` przechodzą przed każdym commitem

### Architektura Komponentów

**GameMode (klasa bazowa)**: Wszystkie tryby dziedziczą ze wspólnej klasy ze standaryzowanymi metodami.

**GameModeManager**: Scentralizowana orkiestracja uruchamiania i zarządzania trybami.

**Komponenty UI**: TopBar, InfoBar, Dashboard i Customization zapewniają spójny interfejs.

**Leniwe Ładowanie**: Moduły są ładowane na żądanie, aby zoptymalizować początkową wydajność.

**Szyna Zdarzeń**: Oddzielona komunikacja między komponentami za pośrednictwem systemu zdarzeń.

### Testy

Projekt zawiera kompleksowy zestaw testów:

- Testy jednostkowe dla modułów rdzenia
- Testy integracyjne dla komponentów
- Testy trybów gry
- Zautomatyzowane pokrycie kodu

```bash
npm test              # Wszystkie testy (CJS)
npm test:core         # Testy modułów rdzenia
npm test:integration  # Testy integracyjne
npm test:coverage     # Raport pokrycia
npm run test:esm      # Testy ESM (np. components/dashboard) przez vm-modules
```

### Build Produkcyjny

- **Rollup**: Pakuje `js/main-es6.js` do ESM z podziałem kodu i mapami źródeł
- **Terser**: Automatyczna minifikacja dla optymalizacji
- **Post-build**: Kopiuje `css/` i `assets/`, favicony (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` i przepisuje `dist/index.html` na haszowany plik wejściowy (np. `main-es6-*.js`)
- **Folder końcowy**: `dist/` gotowy do serwowania statycznego

```bash
npm run build      # generuje dist/
npm run serve:dist # serwuje dist/ (port 5000)
```

### Ciągła Integracja

**GitHub Actions**: Zautomatyzowany potok w `.github/workflows/ci.yml`

Potok CI/CD uruchamia się automatycznie przy każdym pushu i pull requeście:

**Główne Zadania**:

1.  **build-test**: Główne zadanie walidacji
    - Instalacja zależności: `npm ci`
    - Sprawdzanie formatowania: `npm run format:check`
    - Analiza statyczna: `npm run lint`
    - Testy jednostkowe: `npm run test`
    - Audyt bezpieczeństwa: `npm audit`
    - Generowanie artefaktu pokrycia

2.  **accessibility**: Audyt dostępności (nieblokujący)
    - Uruchamia `npm run audit:accessibility`
    - Generuje raport dostępności WCAG 2.1 AA

3.  **test-esm**: Testy modułów ES6
    - Uruchamia `npm run test:esm` z modułami Jest VM
    - Waliduje import/eksport ES6

4.  **lighthouse**: Audyt wydajności (nieblokujący)
    - Audyt wydajności mobilnej
    - Generuje artefakty raportu Lighthouse
    - Metryki Core Web Vitals

**Odznaki Jakości**:

- Status Builda CI (GitHub Actions)
- Ocena CodeFactor
- Odznaka Codacy
- Brama Jakości SonarCloud

### PWA (Progresywna Aplikacja Internetowa)

LeapMultix to pełne PWA z obsługą offline i możliwością instalacji.

**Service Worker** (`sw.js`):

- Nawigacja: Network-first z fallbackiem offline do `offline.html`
- Obrazy: Cache-first w celu optymalizacji wydajności
- Tłumaczenia: Stale-while-revalidate dla aktualizacji w tle
- JS/CSS: Network-first, aby zawsze serwować najnowszą wersję
- Automatyczne zarządzanie wersjami przez `cache-updater.js`

**Manifest** (`manifest.json`):

- Ikony SVG i PNG dla wszystkich urządzeń
- Możliwa instalacja na telefonie (Dodaj do ekranu głównego)
- Konfiguracja standalone dla doświadczenia przypominającego aplikację
- Obsługa motywów i kolorów

**Testowanie trybu offline lokalnie**:

1.  Uruchom serwer deweloperski:

    ```bash
    npm run serve
    ```

    Otwórz `http://localhost:8080` (lub wyświetlony port)

2.  Testuj ręcznie:
    - Odłącz sieć w DevTools (karta Network → Offline)
    - Odśwież stronę → wyświetla się `offline.html`

3.  Test automatyczny (wymaga Puppeteer):
    ```bash
    npm run test:pwa-offline
    ```

**Skrypty Zarządzania Service Worker**:

```bash
npm run sw:disable  # Wyłącz service worker
npm run sw:fix      # Napraw problemy z pamięcią podręczną
```

### Standardy Jakości

**Narzędzia Jakości Kodu**:

- **ESLint**: Nowoczesna konfiguracja z flat config (`eslint.config.js`), wsparcie ES2022
- **Prettier**: Automatyczne formatowanie kodu (`.prettierrc`)
- **Stylelint**: Walidacja CSS (`.stylelintrc.json`)
- **JSDoc**: Automatyczna dokumentacja funkcji z analizą pokrycia

**Ważne Zasady Kodu**:

- Usuń nieużywane zmienne i parametry (`no-unused-vars`)
- Używaj konkretnej obsługi błędów (brak pustych catch)
- Unikaj `innerHTML` na rzecz funkcji `security-utils.js`
- Utrzymuj złożoność poznawczą < 15 dla funkcji
- Wyodrębnij złożone funkcje do mniejszych pomocników

**Bezpieczeństwo**:

- **Ochrona XSS**: Używaj funkcji z `security-utils.js`:
  - `appendSanitizedHTML()` zamiast `innerHTML`
  - `createSafeElement()` do tworzenia bezpiecznych elementów
  - `setSafeMessage()` dla treści tekstowych
- **Zewnętrzne Skrypty**: Atrybut `crossorigin="anonymous"` obowiązkowy
- **Walidacja Wejścia**: Zawsze sanityzuj dane zewnętrzne
- **Polityka Bezpieczeństwa Treści**: Nagłówki CSP do ograniczenia źródeł skryptów

**Dostępność**:

- Zgodność z WCAG 2.1 AA
- Pełna nawigacja klawiaturą
- Role ARIA i odpowiednie etykiety
- Zgodny kontrast kolorów

**Wydajność**:

- Leniwe ładowanie modułów przez `lazy-loader.js`
- Optymalizacje CSS i responsywnych zasobów
- Service Worker dla inteligentnego buforowania
- Podział kodu i minifikacja w produkcji

## 📱 Kompatybilność

### Obsługiwane Przeglądarki

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Urządzenia

- **Komputer stacjonarny**: Sterowanie klawiaturą i myszą
- **Tablety**: Zoptymalizowany interfejs dotykowy
- **Smartfony**: Adaptacyjny projekt responsywny

### Dostępność

- Pełna nawigacja klawiaturą (Tab, Strzałki, Escape)
- Role ARIA i etykiety dla czytników ekranu
- Zgodny kontrast kolorów
- Obsługa technologii wspomagających

## 🌍 Lokalizacja

Pełna obsługa wielojęzyczna:

- **Francuski** (język domyślny)
- **Angielski**
- **Hiszpański**

### Zarządzanie Tłumaczeniami

**Pliki Tłumaczeń:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Start",
  "quiz_correct": "Dobra robota!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Skrypty Zarządzania i18n

**`npm run i18n:verify`** - Weryfikuj spójność kluczy tłumaczeń

**`npm run i18n:unused`** - Lista nieużywanych kluczy tłumaczeń

**`npm run i18n:compare`** - Porównaj pliki tłumaczeń z fr.json (referencja)

Ten skrypt (`scripts/compare-translations.cjs`) zapewnia synchronizację wszystkich plików językowych:

**Funkcje:**

- Wykrywanie brakujących kluczy (obecne w fr.json, ale nieobecne w innych językach)
- Wykrywanie dodatkowych kluczy (obecne w innych językach, ale nie w fr.json)
- Identyfikacja pustych wartości (`""`, `null`, `undefined`, `[]`)
- Sprawdzanie spójności typów (ciąg znaków vs tablica)
- Spłaszczanie zagnieżdżonych struktur JSON do notacji kropkowej (np. `arcade.multiMemory.title`)
- Generowanie szczegółowego raportu konsoli
- Zapisywanie raportu JSON do `docs/translations-comparison-report.json`

**Przykładowe Wyjście:**

```
🔍 Analiza porównawcza plików tłumaczeń

📚 Język referencyjny: fr.json
✅ fr.json: 335 kluczy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analiza en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Łącznie kluczy: 335
✅ Brak brakujących kluczy
✅ Brak dodatkowych kluczy
✅ Brak pustych wartości

📊 PODSUMOWANIE KOŃCOWE
  fr.json: 335 kluczy
  en.json: 335 kluczy
  es.json: 335 kluczy

✅ Wszystkie pliki tłumaczeń są idealnie zsynchronizowane!
```

**Pokrycie Tłumaczeń:**

- Kompletny interfejs użytkownika
- Instrukcje gry
- Komunikaty o błędach i informacje zwrotne
- Opisy i pomoc kontekstowa
- Treść narracyjna trybu przygody
- Etykiety dostępności i ARIA

## 📊 Przechowywanie Danych

### Dane Użytkownika

- Profile i preferencje
- Postęp według trybu gry
- Wyniki i statystyki gier zręcznościowych
- Ustawienia personalizacji

### Funkcje Techniczne

- Lokalna pamięć (localStorage) z opcjami awaryjnymi
- Izolacja danych na użytkownika
- Automatyczne zapisywanie postępów
- Automatyczna migracja starych danych

## 🐛 Zgłaszanie Problemów

Problemy można zgłaszać za pośrednictwem issues na GitHubie. Prosimy o podanie:

- Szczegółowego opisu problemu
- Kroków do powtórzenia
- Przeglądarki i wersji
- Zrzutów ekranu, jeśli są istotne

## 💝 Wesprzyj Projekt

**[☕ Przekaż darowiznę przez PayPal](https://paypal.me/jls)**

## 📄 Licencja

Ten projekt jest licencjonowany na licencji AGPL v3. Zobacz plik `LICENSE`, aby uzyskać więcej informacji.

---

_LeapMultix - Nowoczesna aplikacja edukacyjna do nauki tabliczki mnożenia_

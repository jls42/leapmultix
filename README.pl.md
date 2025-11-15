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

<!-- Odznaki (zaktualizuj <owner>/<repo> po migracji na GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Spis treści

- [Opis](#opis)
- [Funkcje](#-funkcje)
- [Szybki start](#-szybki-start)
- [Architektura](#-architektura)
- [Szczegółowe tryby gry](#-szczegółowe-tryby-gry)
- [Rozwój](#-rozwój)
- [Kompatybilność](#-kompatybilność)
- [Lokalizacja](#-lokalizacja)
- [Przechowywanie danych](#-przechowywanie-danych)
- [Zgłaszanie problemu](#-zgłaszanie-problemu)
- [Licencja](#-licencja)

## Opis

LeapMultix to nowoczesna, interaktywna aplikacja internetowa do nauki dla dzieci (8-12 lat), która pomaga opanować tabliczkę mnożenia. Aplikacja oferuje **4 klasyczne tryby gry** i **4 minigry zręcznościowe** w intuicyjnym, dostępnym i wielojęzycznym interfejsie.

**Opracowane przez:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## ✨ Funkcje

### 🎮 Tryby gry

- **Tryb odkrywania**: Wizualna i interaktywna eksploracja tabliczki mnożenia
- **Tryb quizu**: Pytania wielokrotnego wyboru z adaptacyjnym postępem
- **Tryb wyzwania**: Wyścig z czasem na różnych poziomach trudności
- **Tryb przygodowy**: Postęp fabularny przez poziomy z interaktywną mapą

### 🕹️ Minigry zręcznościowe

- **MultiInvaders**: Edukacyjni Space Invaders - niszcz złe odpowiedzi
- **MultiMiam**: Matematyczny Pac-Man - zbieraj poprawne odpowiedzi
- **MultiMemory**: Gra pamięciowa - dopasuj mnożenie do wyników
- **MultiSnake**: Edukacyjny wąż - rośnij, jedząc poprawne liczby

### 🌍 Funkcje przekrojowe

- **Wielu użytkowników**: Zarządzanie indywidualnymi profilami z zapisanym postępem
- **Wielojęzyczność**: Wsparcie dla języka francuskiego, angielskiego i hiszpańskiego
- **Personalizacja**: Awatary, motywy kolorystyczne, tła
- **Dostępność**: Nawigacja za pomocą klawiatury, obsługa dotyku, zgodność z WCAG 2.1 AA
- **Responsywność mobilna**: Zoptymalizowany interfejs dla tabletów i smartfonów
- **System postępów**: Wyniki, odznaki, codzienne wyzwania

## 🚀 Szybki start

### Wymagania wstępne

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

### Dostępne skrypty

```bash
# Rozwój
npm run serve          # Lokalny serwer (http://localhost:8080)
npm run lint           # Sprawdzanie kodu za pomocą ESLint
npm run lint:fix       # Automatyczna naprawa problemów ESLint
npm run format:check   # Sprawdź formatowanie kodu (ZAWSZE przed commitem)
npm run format         # Sformatuj kod za pomocą Prettier
npm run verify         # Brama jakości: lint + test + coverage

# Testy
npm run test           # Uruchom wszystkie testy (CJS)
npm run test:watch     # Testy w trybie watch
npm run test:coverage  # Testy z raportem pokrycia
npm run test:core      # Tylko testy modułów podstawowych
npm run test:integration # Testy integracyjne
npm run test:storage   # Testy systemu przechowywania
npm run test:esm       # Testy ESM (foldery tests-esm/, Jest vm-modules)
npm run test:verbose   # Testy z szczegółowym wyjściem
npm run test:pwa-offline # Test PWA w trybie offline (wymaga Puppeteer), po `npm run serve`

# Analiza i konserwacja
npm run analyze:jsdoc  # Analiza dokumentacji
npm run improve:jsdoc  # Automatyczna poprawa JSDoc
npm run audit:mobile   # Testy responsywności mobilnej
npm run audit:accessibility # Testy dostępności
npm run dead-code      # Wykrywanie nieużywanego kodu
npm run analyze:globals # Analiza zmiennych globalnych
npm run analyze:dependencies # Analiza wykorzystania zależności
npm run verify:cleanup # Połączona analiza (nieużywany kod + zmienne globalne)

# Zarządzanie zasobami
npm run assets:generate    # Generuj responsywne obrazy
npm run assets:backgrounds # Konwertuj tła na WebP
npm run assets:analyze     # Analiza responsywnych zasobów
npm run assets:diff        # Porównanie zasobów

# Internacjonalizacja
npm run i18n:verify    # Sprawdź spójność kluczy tłumaczeń
npm run i18n:unused    # Wyświetl listę nieużywanych kluczy tłumaczeń
npm run i18n:compare   # Porównaj tłumaczenia (en/es) z fr.json (referencja)

# Budowanie i dostarczanie
npm run build          # Budowanie produkcyjne (Rollup) + postbuild (pełny dist/)
npm run serve:dist     # Serwuj dist/ na http://localhost:5000 (lub dostępnym porcie)

# PWA i Service Worker
npm run sw:disable     # Wyłącz service workera
npm run sw:fix         # Napraw problemy z service workerem
```

## 🏗️ Architektura

### Struktura plików

```
leapmultix/
├── index.html              # Główny punkt wejścia
├── js/
│   ├── core/               # Główne moduły ES6
│   │   ├── GameMode.js     # Klasa bazowa trybów
│   │   ├── GameModeManager.js # Zarządzanie trybami gry
│   │   ├── storage.js      # API przechowywania LocalStorage
│   │   ├── audio.js        # Zarządzanie dźwiękiem
│   │   ├── utils.js        # Ogólne narzędzia (źródło kanoniczne)
│   │   ├── eventBus.js     # Komunikacja oparta na zdarzeniach
│   │   ├── userState.js    # Zarządzanie sesją użytkownika
│   │   ├── mainInit.js     # Inicjalizacja DOM-ready
│   │   ├── theme.js        # System motywów
│   │   ├── userUi.js       # Narzędzia interfejsu użytkownika
│   │   ├── parental.js     # Kontrola rodzicielska
│   │   ├── adventure-data.js # Dane trybu przygodowego
│   │   ├── mult-stats.js   # Statystyki mnożenia
│   │   ├── challenge-stats.js # Statystyki wyzwań
│   │   └── daily-challenge.js # Zarządzanie codziennymi wyzwaniami
│   ├── components/         # Komponenty UI wielokrotnego użytku
│   │   ├── topBar.js       # Pasek nawigacyjny
│   │   ├── infoBar.js      # Paski informacyjne gier
│   │   ├── dashboard.js    # Panel użytkownika
│   │   └── customization.js # Interfejs personalizacji
│   ├── modes/              # Tryby gry
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Minigry zręcznościowe
│   │   ├── arcade.js       # Główny orkiestrator zręcznościowy
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Gra pamięciowa (31 KB)
│   │   ├── arcade-multimiam.js # Integracja MultiMiam
│   │   ├── arcade-multisnake.js # Integracja Węża
│   │   ├── arcade-common.js, arcade-utils.js # Wspólne narzędzia
│   │   ├── arcade-message.js, arcade-points.js # Komponenty UI
│   │   └── arcade-scores.js # Zarządzanie wynikami
│   ├── multimiam/          # Gra Pac-Man (architektura zdekomponowana)
│   │   ├── multimiam.js    # Główny kontroler
│   │   ├── multimiam-engine.js # Silnik gry (15 KB)
│   │   ├── multimiam-renderer.js # System renderowania (9 KB)
│   │   ├── multimiam-controls.js # Zarządzanie sterowaniem (7 KB)
│   │   ├── multimiam-questions.js # Generowanie pytań (6 KB)
│   │   └── multimiam-ui.js # Elementy interfejsu
│   ├── multisnake.js       # Gra Wąż (38 KB)
│   ├── navigation/         # System nawigacji
│   │   ├── slides.js       # Nawigacja oparta na slajdach (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Obsługa klawiatury
│   ├── ui/                 # Interfejs użytkownika i opinie
│   │   ├── uiUtils.js      # Narzędzia interfejsu
│   │   ├── ui-feedback.js  # Mechanizmy opinii
│   │   ├── touch-support.js # Obsługa dotyku (7 KB)
│   │   ├── virtual-keyboard.js # Klawiatura wirtualna
│   │   ├── coin-display.js, coin-effects.js # System walutowy
│   │   ├── notifications.js # System powiadomień
│   │   └── badges.js       # System odznak
│   ├── media/              # Zarządzanie mediami
│   │   ├── VideoManager.js # Zarządzanie odtwarzaniem wideo (12 KB)
│   │   └── responsive-image-loader.js # Ładowanie obrazów (9 KB)
│   ├── orchestration/      # Orkiestracja i ładowanie
│   │   ├── mode-orchestrator.js # Zmiana trybów
│   │   ├── lazy-loader.js  # Ładowanie dynamiczne (10 KB)
│   │   └── game-cleanup.js # Czyszczenie stanu
│   ├── utils/              # Narzędzia
│   │   ├── utils-es6.js    # Główny agregator (5 KB)
│   │   ├── main-helpers.js # Pomocnicy aplikacji
│   │   ├── helpers.js      # Starsze funkcje pomocnicze
│   │   ├── stats-utils.js  # Narzędzia statystyczne
│   │   ├── difficulty.js   # Zarządzanie trudnością
│   │   └── questionGenerator.js # Generowanie pytań
│   ├── storage/            # Przechowywanie i stan
│   │   ├── storage.js      # Starszy wrapper przechowywania
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
│   │   └── speech.js       # Wsparcie syntezy mowy
│   ├── integration/        # Integracja i analityka
│   │   ├── plausible-init.js # Analityka Plausible
│   │   ├── cache-updater.js # Zarządzanie pamięcią podręczną (10 KB)
│   │   └── imports.js      # Narzędzia importu
│   ├── main-es6.js         # Punkt wejścia ES6
│   ├── main.js             # Główny orkiestrator
│   ├── bootstrap.js        # Konfiguracja obsługi zdarzeń ES6
│   └── game.js             # Zarządzanie stanem i codzienne wyzwania
├── css/                    # Style modułowe
├── assets/                 # Zasoby
│   ├── images/             # Obrazy i sprite'y
│   ├── generated-images/   # Wygenerowane obrazy responsywne
│   ├── sounds/             # Efekty dźwiękowe
│   ├── translations/       # Pliki tłumaczeń (fr, en, es)
│   └── videos/             # Filmy instruktażowe
├── tests/                  # Testy zautomatyzowane
│   ├── __tests__/          # Testy jednostkowe i integracyjne
│   └── tests-esm/          # Testy ESM (.mjs)
├── scripts/                # Skrypty konserwacyjne
│   ├── compare-translations.cjs # Porównanie tłumaczeń
│   └── cleanup-i18n-keys.cjs # Czyszczenie kluczy i18n
└── dist/                   # Budowanie produkcyjne (wygenerowane)
```

### Architektura techniczna

**Nowoczesne moduły ES6**: Projekt wykorzystuje architekturę modułową z natywnymi klasami ES6 oraz importami/eksportami.

**Komponenty wielokrotnego użytku**: Interfejs zbudowany z scentralizowanych komponentów UI (TopBar, InfoBar, Dashboard, Customization).

**Leniwe ładowanie (Lazy Loading)**: Inteligentne ładowanie modułów na żądanie za pomocą `lazy-loader.js` w celu optymalizacji początkowej wydajności.

**Zunifikowany system przechowywania**: Scentralizowane API do utrwalania danych użytkownika za pomocą LocalStorage z rezerwami.

**Scentralizowane zarządzanie dźwiękiem**: Kontrola dźwięku z obsługą wielu języków i preferencjami dla każdego użytkownika.

**Magistrala zdarzeń (Event Bus)**: Oddzielona komunikacja oparta na zdarzeniach między komponentami dla łatwej w utrzymaniu architektury.

**Nawigacja oparta na slajdach**: System nawigacji oparty na ponumerowanych slajdach (slide0, slide1, itp.) z `goToSlide()`.

**Bezpieczeństwo**: Ochrona przed XSS i sanityzacja za pomocą `security-utils.js` dla wszystkich manipulacji DOM.

## 🎯 Szczegółowe tryby gry

### Tryb odkrywania

Wizualny interfejs eksploracji tabliczki mnożenia z:

- Interaktywną wizualizacją mnożenia
- Animacjami i pomocami pamięciowymi
- Edukacyjnym przeciąganiem i upuszczaniem
- Swobodnym postępem według tabliczki

### Tryb quizu

Pytania wielokrotnego wyboru z:

- 10 pytań na sesję
- Adaptacyjnym postępem w zależności od sukcesów
- Wirtualną klawiaturą numeryczną
- Systemem passy (seria poprawnych odpowiedzi)

### Tryb wyzwania

Wyścig z czasem z:

- 3 poziomami trudności (Początkujący, Średni, Trudny)
- Bonusem czasowym za poprawne odpowiedzi
- Systemem żyć
- Rankingiem najlepszych wyników

### Tryb przygodowy

Postęp fabularny z:

- 12 odblokowywanymi poziomami tematycznymi
- Interaktywną mapą z wizualnym postępem
- Wciągającą historią z postaciami
- Systemem gwiazdek i nagród

### Minigry zręcznościowe

Każda minigra oferuje:

- Wybór trudności i personalizację
- System żyć i wyników
- Sterowanie klawiaturą i dotykiem
- Indywidualne rankingi dla każdego użytkownika

## 🛠️ Rozwój

### Przepływ pracy programistycznej

**WAŻNE: Nigdy nie commituj bezpośrednio na gałąź main**

Projekt wykorzystuje przepływ pracy oparty na gałęziach funkcyjnych:

1. **Utwórz gałąź**:
   ```bash
   git checkout -b feat/nazwa-funkcjonalnosci
   # lub
   git checkout -b fix/nazwa-bledu
   ```

2. **Rozwijaj i testuj**:
   ```bash
   npm run format:check  # ZAWSZE najpierw sprawdzaj formatowanie
   npm run format        # Sformatuj w razie potrzeby
   npm run lint          # Sprawdź jakość kodu
   npm run test          # Uruchom testy
   npm run test:coverage # Sprawdź pokrycie
   ```

3. **Commituj na gałęzi**:
   ```bash
   git add .
   git commit -m "feat: opis funkcjonalności"
   ```

4. **Wypchnij i utwórz Pull Request**:
   ```bash
   git push -u origin feat/nazwa-funkcjonalnosci
   ```

**Styl commitów**: Zwięzłe komunikaty, tryb rozkazujący (np. "Fix arcade init errors", "Refactor cache updater")

**Brama jakości**: Upewnij się, że `npm run lint`, `npm run test` i `npm run test:coverage` przechodzą pomyślnie przed każdym commitem

### Architektura komponentów

**GameMode (klasa bazowa)**: Wszystkie tryby dziedziczą po wspólnej klasie ze standardowymi metodami.

**GameModeManager**: Scentralizowana orkiestracja uruchamiania i zarządzania trybami.

**Komponenty UI**: TopBar, InfoBar, Dashboard i Customization zapewniają spójny interfejs.

**Leniwe ładowanie (Lazy Loading)**: Moduły są ładowane na żądanie w celu optymalizacji początkowej wydajności.

**Magistrala zdarzeń (Event Bus)**: Oddzielona komunikacja między komponentami za pomocą systemu zdarzeń.

### Testy

Projekt zawiera kompletny zestaw testów:

- Testy jednostkowe modułów podstawowych
- Testy integracyjne komponentów
- Testy trybów gry
- Zautomatyzowane pokrycie kodu

```bash
npm test              # Wszystkie testy (CJS)
npm test:core         # Testy modułów podstawowych
npm test:integration  # Testy integracyjne
npm test:coverage     # Raport pokrycia
npm run test:esm      # Testy ESM (np. components/dashboard) za pomocą vm-modules
```

### Budowanie produkcyjne

- **Rollup**: Bundluje `js/main-es6.js` do ESM z podziałem kodu i sourcemapami
- **Terser**: Automatyczna minifikacja w celu optymalizacji
- **Post-build**: Kopiuje `css/` i `assets/`, favikony (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` i przepisuje `dist/index.html` na haszowany plik wejściowy (np. `main-es6-*.js`)
- **Folder końcowy**: `dist/` gotowy do statycznego serwowania

```bash
npm run build      # generuje dist/
npm run serve:dist # serwuje dist/ (port 5000)
```

### Ciągła Integracja

**GitHub Actions**: Zautomatyzowany potok w `.github/workflows/ci.yml`

Potok CI/CD jest uruchamiany automatycznie przy każdym pushu i pull requeście:

**Główne zadania**:

1. **build-test**: Główne zadanie walidacyjne
   - Instalacja zależności: `npm ci`
   - Sprawdzanie formatowania: `npm run format:check`
   - Analiza statyczna: `npm run lint`
   - Testy jednostkowe: `npm run test`
   - Audyt bezpieczeństwa: `npm audit`
   - Generowanie artefaktu pokrycia

2. **accessibility**: Audyt dostępności (nieblokujący)
   - Uruchamia `npm run audit:accessibility`
   - Generuje raport dostępności WCAG 2.1 AA

3. **test-esm**: Testy modułów ES6
   - Uruchamia `npm run test:esm` z modułami Jest VM
   - Waliduje importy/eksporty ES6

4. **lighthouse**: Audyt wydajności (nieblokujący)
   - Audyt wydajności mobilnej
   - Generowanie artefaktów raportów Lighthouse
   - Metryki Core Web Vitals

**Odznaki jakości**:
- Status budowania CI (GitHub Actions)
- Ocena CodeFactor
- Odznaka Codacy
- Brama jakości SonarCloud

### PWA (Progressive Web App)

LeapMultix to w pełni funkcjonalna PWA z obsługą offline i możliwością instalacji.

**Service Worker** (`sw.js`):
- Nawigacja: Network-first z rezerwą offline do `offline.html`
- Obrazy: Cache-first w celu optymalizacji wydajności
- Tłumaczenia: Stale-while-revalidate do aktualizacji w tle
- JS/CSS: Network-first, aby zawsze serwować najnowszą wersję
- Automatyczne zarządzanie wersjami za pomocą `cache-updater.js`

**Manifest** (`manifest.json`):
- Ikony SVG i PNG dla wszystkich urządzeń
- Możliwość instalacji na urządzeniach mobilnych (Dodaj do ekranu głównego)
- Konfiguracja standalone dla doświadczenia podobnego do aplikacji
- Obsługa motywów i kolorów

**Testowanie trybu offline lokalnie**:

1. Uruchom serwer deweloperski:
   ```bash
   npm run serve
   ```
   Otwórz `http://localhost:8080` (lub wyświetlony port)

2. Testuj ręcznie:
   - Odłącz sieć w DevTools (zakładka Sieć → Offline)
   - Odśwież stronę → wyświetli się `offline.html`

3. Test zautomatyzowany (wymaga Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Skrypty do zarządzania Service Workerem**:
```bash
npm run sw:disable  # Wyłącz service workera
npm run sw:fix      # Napraw problemy z pamięcią podręczną
```

### Standardy jakości

**Narzędzia jakości kodu**:
- **ESLint**: Nowoczesna konfiguracja z płaską konfiguracją (`eslint.config.js`), obsługa ES2022
- **Prettier**: Automatyczne formatowanie kodu (`.prettierrc`)
- **Stylelint**: Walidacja CSS (`.stylelintrc.json`)
- **JSDoc**: Automatyczna dokumentacja funkcji z analizą pokrycia

**Ważne zasady kodowania**:
- Usuwaj nieużywane zmienne i parametry (`no-unused-vars`)
- Używaj specyficznej obsługi błędów (bez pustych bloków catch)
- Unikaj `innerHTML` na rzecz funkcji `security-utils.js`
- Utrzymuj złożoność poznawczą < 15 dla funkcji
- Wyodrębniaj złożone funkcje do mniejszych pomocników

**Bezpieczeństwo**:
- **Ochrona XSS**: Używaj funkcji z `security-utils.js`:
  - `appendSanitizedHTML()` zamiast `innerHTML`
  - `createSafeElement()` do tworzenia bezpiecznych elementów
  - `setSafeMessage()` dla treści tekstowej
- **Skrypty zewnętrzne**: Atrybut `crossorigin="anonymous"` jest obowiązkowy
- **Walidacja danych wejściowych**: Zawsze sanityzuj dane zewnętrzne
- **Polityka Bezpieczeństwa Treści (CSP)**: Nagłówki CSP w celu ograniczenia źródeł skryptów

**Dostępność**:
- Zgodność z WCAG 2.1 AA
- Pełna nawigacja za pomocą klawiatury
- Odpowiednie role i etykiety ARIA
- Zgodne kontrasty kolorów

**Wydajność**:
- Leniwe ładowanie modułów za pomocą `lazy-loader.js`
- Optymalizacje CSS i responsywne zasoby
- Service Worker do inteligentnego buforowania
- Podział kodu i minifikacja w produkcji

## 📱 Kompatybilność

### Obsługiwane przeglądarki

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Urządzenia

- **Komputer stacjonarny**: Sterowanie za pomocą klawiatury i myszy
- **Tablety**: Zoptymalizowany interfejs dotykowy
- **Smartfony**: Adaptacyjny responsywny design

### Dostępność

- Pełna nawigacja za pomocą klawiatury (Tab, strzałki, Esc)
- Role i etykiety ARIA для czytników ekranu
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

**`npm run i18n:verify`** - Sprawdź spójność kluczy tłumaczeń

**`npm run i18n:unused`** - Wyświetl listę nieużywanych kluczy tłumaczeń

**`npm run i18n:compare`** - Porównaj pliki tłumaczeń z fr.json (referencja)

Ten skrypt (`scripts/compare-translations.cjs`) zapewnia synchronizację wszystkich plików językowych:

**Funkcje:**
- Wykrywanie brakujących kluczy (obecnych w fr.json, ale nieobecnych w innych językach)
- Wykrywanie dodatkowych kluczy (obecnych w innych językach, ale nie w fr.json)
- Identyfikacja pustych wartości (`""`, `null`, `undefined`, `[]`)
- Sprawdzanie spójności typów (ciąg znaków vs tablica)
- Spłaszczanie zagnieżdżonych struktur JSON do notacji kropkowej (np. `arcade.multiMemory.title`)
- Generowanie szczegółowego raportu w konsoli
- Zapisywanie raportu JSON w `docs/translations-comparison-report.json`

**Przykładowe wyjście:**

```
🔍 Analyse comparative des fichiers de traduction

📚 Langue de référence: fr.json
✅ fr.json: 335 clés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de clés: 335
✅ Aucune clé manquante
✅ Aucune clé supplémentaire
✅ Aucune valeur vide

📊 RÉSUMÉ FINAL
  fr.json: 335 clés
  en.json: 335 clés
  es.json: 335 clés

✅ Tous les fichiers de traduction sont parfaitement synchronisés !
```

**Pokrycie tłumaczeń:**

- Pełny interfejs użytkownika
- Instrukcje gier
- Komunikaty o błędach i opinie
- Opisy i pomoc kontekstowa
- Treść fabularna trybu przygodowego
- Etykiety dostępności i ARIA

## 📊 Przechowywanie danych

### Dane użytkownika

- Profile i preferencje
- Postęp w każdym trybie gry
- Wyniki i statystyki gier zręcznościowych
- Ustawienia personalizacji

### Funkcje techniczne

- Przechowywanie lokalne (localStorage) z rezerwami
- Izolacja danych dla każdego użytkownika
- Automatyczne zapisywanie postępów
- Automatyczna migracja starych danych

## 🐛 Zgłaszanie problemu

Problemy można zgłaszać za pośrednictwem issues na GitHub. Prosimy o dołączenie:

- Szczegółowego opisu problemu
- Kroków do jego odtworzenia
- Przeglądarki i wersji
- Zrzutów ekranu, jeśli są istotne

## 💝 Wspieraj projekt

**[☕ Przekaż darowiznę przez PayPal](https://paypal.me/jls)**

## 📄 Licencja

Ten projekt jest objęty licencją AGPL v3. Zobacz plik `LICENSE`, aby uzyskać więcej szczegółów.

---

_LeapMultix - Nowoczesna aplikacja edukacyjna do nauki tabliczki mnożenia_

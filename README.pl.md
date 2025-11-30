<details>
<summary>Ten dokument jest również dostępny w innych językach</summary>

- [Français](./README.md)
- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Deutsch](./README.de.md)
- [中文](./README.zh.md)
- [हिन्दी](./README.hi.md)
- [العربية](./README.ar.md)
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

![Licencja: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Spis treści

- [Opis](#opis)
- [Funkcje](#-funkcje)
- [Szybki start](#-szybki-start)
- [Architektura](#-architektura)
- [Szczegółowe Tryby Gry](#-szczegółowe-tryby-gry)
- [Rozwój](#-rozwój)
- [Kompatybilność](#-kompatybilność)
- [Lokalizacja](#-lokalizacja)
- [Przechowywanie danych](#-przechowywanie-danych)
- [Zgłaszanie problemów](#-zgłaszanie-problemów)
- [Licencja](#-licencja)

## Opis

LeapMultix to nowoczesna interaktywna aplikacja edukacyjna online, zaprojektowana dla dzieci (8–12 lat), aby opanować 4 działania arytmetyczne: mnożenie (×), dodawanie (+), odejmowanie (−) i dzielenie (÷). Aplikacja oferuje **5 trybów gry** i **4 minigry zręcznościowe** w intuicyjnym, dostępnym i wielojęzycznym interfejsie.

**Obsługa wielu działań:** Tryby Quiz i Wyzwanie pozwalają ćwiczyć wszystkie działania. Tryby Odkrywania, Przygody i Arcade koncentrują się na mnożeniu.

**Stworzone przez:** Julien LS (contact@jls42.org)

**Adres online:** https://leapmultix.jls42.org/

## ✨ Funkcje

### 🎮 Tryby Gry

- **Tryb Odkrywania**: Wizualna i interaktywna eksploracja tabliczki mnożenia
- **Tryb Quizu** ⭐: Pytania wielokrotnego wyboru z obsługą 4 działań (×, +, −, ÷) i adaptacyjnym postępem
- **Tryb Wyzwania** ⭐: Wyścig z czasem z 4 działaniami (×, +, −, ÷) i różnymi poziomami trudności
- **Tryb Przygody**: Narracyjny postęp przez poziomy z interaktywną mapą (mnożenie)

⭐ = Pełne wsparcie dla wszystkich 4 działań arytmetycznych

### 🕹️ Minigry Zręcznościowe

- **MultiInvaders**: Edukacyjne Space Invaders - Niszcz błędne odpowiedzi (mnożenie)
- **MultiMiam**: Matematyczny Pac-Man - Zbieraj poprawne odpowiedzi (mnożenie)
- **MultiMemory**: Gra pamięciowa - Dopasuj działania mnożenia do ich wyników
- **MultiSnake**: Edukacyjny Snake - Rośnij, jedząc poprawne liczby (mnożenie)

### ➕ Obsługa Wielu Działań

LeapMultix wykracza poza proste mnożenie, oferując kompletny trening 4 działań arytmetycznych:

| Tryb       | ×   | +   | −   | ÷   |
| ---------- | --- | --- | --- | --- |
| Quiz       | ✅  | ✅  | ✅  | ✅  |
| Wyzwanie   | ✅  | ✅  | ✅  | ✅  |
| Odkrywanie | ✅  | ❌  | ❌  | ❌  |
| Przygoda   | ✅  | ❌  | ❌  | ❌  |
| Arcade     | ✅  | ❌  | ❌  | ❌  |

**Uwaga:** Obsługa działań dla trybów Odkrywania, Przygody i Arcade jest planowana w przyszłej wersji.

### 🌍 Funkcje Przekrojowe

- **Wielu użytkowników**: Zarządzanie indywidualnymi profilami z zapisanym postępem
- **Wielojęzyczność**: Obsługa języka francuskiego, angielskiego i hiszpańskiego
- **Personalizacja**: Awatary, motywy kolorystyczne, tła
- **Dostępność**: Nawigacja klawiaturą, obsługa dotykowa, zgodność z WCAG 2.1 AA
- **Responsywność mobilna**: Zoptymalizowany interfejs dla tabletów i smartfonów
- **System postępu**: Wyniki, odznaki, codzienne wyzwania

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
# Aplikacja będzie dostępna pod adresem http://localhost:8080 (lub kolejnym dostępnym porcie)

# Lub z Pythonem (opcja 2)
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
npm run format         # Formatuj kod za pomocą Prettier
npm run verify         # Quality gate: lint + test + coverage

# Testy
npm run test           # Uruchom wszystkie testy (CJS)
npm run test:watch     # Testy w trybie obserwacji
npm run test:coverage  # Testy z raportem pokrycia
npm run test:core      # Testy tylko modułów głównych
npm run test:integration # Testy integracyjne
npm run test:storage   # Testy systemu przechowywania
npm run test:esm       # Testy ESM (folder tests-esm/, Jest vm-modules)
npm run test:verbose   # Testy ze szczegółowym wyjściem
npm run test:pwa-offline # Test offline PWA (wymaga Puppeteer), po `npm run serve`

# Analiza i konserwacja
npm run analyze:jsdoc  # Analiza dokumentacji
npm run improve:jsdoc  # Automatyczne ulepszanie JSDoc
npm run audit:mobile   # Testy responsywności mobilnej
npm run audit:accessibility # Testy dostępności
npm run dead-code      # Wykrywanie nieużywanego kodu
npm run analyze:globals # Analiza zmiennych globalnych
npm run analyze:dependencies # Analiza użycia zależności
npm run verify:cleanup # Połączona analiza (martwy kod + zmienne globalne)

# Zarządzanie zasobami
npm run assets:generate    # Generuj responsywne obrazy
npm run assets:backgrounds # Konwertuj tła do WebP
npm run assets:analyze     # Analiza responsywnych zasobów
npm run assets:diff        # Porównanie zasobów

# Internacjonalizacja
npm run i18n:verify    # Weryfikuj spójność kluczy tłumaczeń
npm run i18n:unused    # Lista nieużywanych kluczy tłumaczeń
npm run i18n:compare   # Porównaj tłumaczenia (en/es) z fr.json (odniesienie)

# Budowanie i dostarczanie
npm run build          # Budowanie produkcyjne (Rollup) + postbuild (kompletny dist/)
npm run serve:dist     # Serwuj dist/ na http://localhost:5000 (lub dostępnym porcie)

# PWA i Service Worker
npm run sw:disable     # Wyłącz service worker
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
│   │   ├── storage.js      # API LocalStorage
│   │   ├── audio.js        # Zarządzanie dźwiękiem
│   │   ├── utils.js        # Ogólne narzędzia (źródło kanoniczne)
│   │   ├── eventBus.js     # Komunikacja zdarzeniowa
│   │   ├── userState.js    # Zarządzanie sesją użytkownika
│   │   ├── mainInit.js     # Inicjalizacja po załadowaniu DOM
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
│   │   ├── dashboard.js    # Pulpit użytkownika
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
│   │   ├── arcade-multimiam.js # Integracja Multimiam
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
│   │   ├── slides.js       # Nawigacja slajdowa (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Obsługa klawiatury
│   ├── ui/                 # Interfejs użytkownika i informacje zwrotne
│   │   ├── uiUtils.js      # Narzędzia interfejsu
│   │   ├── ui-feedback.js  # Mechanizmy informacji zwrotnej
│   │   ├── touch-support.js # Obsługa dotyku (7 KB)
│   │   ├── virtual-keyboard.js # Klawiatura wirtualna
│   │   ├── coin-display.js, coin-effects.js # System waluty
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
│   ├── generated-images/   # Wygenerowane obrazy responsywne
│   ├── sounds/             # Efekty dźwiękowe
│   ├── translations/       # Pliki tłumaczeń (fr, en, es)
│   └── videos/             # Filmy instruktażowe
├── tests/                  # Testy automatyczne
│   ├── __tests__/          # Testy jednostkowe i integracyjne
│   └── tests-esm/          # Testy ESM (.mjs)
├── scripts/                # Skrypty konserwacyjne
│   ├── compare-translations.cjs # Porównanie tłumaczeń
│   └── cleanup-i18n-keys.cjs # Czyszczenie kluczy i18n
└── dist/                   # Budowanie produkcyjne (wygenerowane)
```

### Architektura techniczna

**Nowoczesne moduły ES6**: Projekt wykorzystuje architekturę modułową z klasami ES6 i natywnymi importami/eksportami.

**Komponenty wielokrotnego użytku**: Interfejs zbudowany z scentralizowanych komponentów UI (TopBar, InfoBar, Dashboard, Customization).

**Leniwe ładowanie (Lazy Loading)**: Inteligentne ładowanie modułów na żądanie za pomocą `lazy-loader.js` w celu optymalizacji wydajności początkowej.

**Ujednolicony system przechowywania**: Scentralizowane API do trwałego przechowywania danych użytkownika za pomocą LocalStorage z mechanizmami awaryjnymi.

**Scentralizowane zarządzanie dźwiękiem**: Kontrola dźwięku z obsługą wielu języków i preferencjami dla każdego użytkownika.

**Szyna zdarzeń (Event Bus)**: Odsprzężona komunikacja oparta na zdarzeniach między komponentami dla łatwiejszej konserwacji architektury.

**Nawigacja slajdowa**: System nawigacji oparty na numerowanych slajdach (slide0, slide1 itp.) z `goToSlide()`.

**Bezpieczeństwo**: Ochrona przed XSS i sanityzacja za pomocą `security-utils.js` dla wszystkich manipulacji DOM.

## 🎯 Szczegółowe Tryby Gry

### Tryb Odkrywania

Wizualny interfejs do eksploracji tabliczki mnożenia z:

- Interaktywną wizualizacją mnożenia
- Animacjami i pomocami pamięciowymi
- Edukacyjnym przeciągnij i upuść
- Swobodnym postępem według tabeli

### Tryb Quizu

Pytania wielokrotnego wyboru z:

- 10 pytaniami na sesję
- Adaptacyjnym postępem w zależności od sukcesu
- Wirtualną klawiaturą numeryczną
- Systemem serii (seria poprawnych odpowiedzi)

### Tryb Wyzwania

Wyścig z czasem z:

- 3 poziomami trudności (Początkujący, Średni, Trudny)
- Bonusem czasowym za poprawne odpowiedzi
- Systemem życia
- Rankingiem najlepszych wyników

### Tryb Przygody

Narracyjny postęp z:

- 12 możliwymi do odblokowania tematycznymi poziomami
- Interaktywną mapą z wizualnym postępem
- Wciągającą historią z postaciami
- Systemem gwiazdek i nagród

### Minigry Zręcznościowe

Każda minigra oferuje:

- Wybór trudności i personalizację
- System życia i punktacji
- Sterowanie klawiaturą i dotykiem
- Indywidualne rankingi dla każdego użytkownika

## 🛠️ Rozwój

### Przepływ pracy programistycznej

**WAŻNE: Nigdy nie commituj bezpośrednio do main**

Projekt wykorzystuje przepływ pracy oparty na gałęziach funkcji:

1. **Utwórz gałąź**:

   ```bash
   git checkout -b feat/nazwa-funkcji
   # lub
   git checkout -b fix/nazwa-bledu
   ```

2. **Rozwijaj i testuj**:

   ```bash
   npm run format:check  # ZAWSZE najpierw sprawdź formatowanie
   npm run format        # Formatuj w razie potrzeby
   npm run lint          # Sprawdź jakość kodu
   npm run test          # Uruchom testy
   npm run test:coverage # Sprawdź pokrycie
   ```

3. **Zatwierdź (commit) na gałęzi**:

   ```bash
   git add .
   git commit -m "feat: opis funkcji"
   ```

4. **Wypchnij (push) i utwórz Pull Request**:
   ```bash
   git push -u origin feat/nazwa-funkcji
   ```

**Styl commitów**: Zwięzły, tryb rozkazujący (np. "Fix arcade init errors", "Refactor cache updater")

**Bramka jakości (Quality gate)**: Upewnij się, że `npm run lint`, `npm test` i `npm run test:coverage` przechodzą przed każdym commitem

### Architektura komponentów

**GameMode (klasa bazowa)**: Wszystkie tryby dziedziczą ze wspólnej klasy ze standardowymi metodami.

**GameModeManager**: Scentralizowana orkiestracja uruchamiania i zarządzania trybami.

**Komponenty UI**: TopBar, InfoBar, Dashboard i Customization zapewniają spójny interfejs.

**Leniwe ładowanie**: Moduły są ładowane na żądanie, aby zoptymalizować wydajność początkową.

**Szyna zdarzeń**: Odsprzężona komunikacja między komponentami za pośrednictwem systemu zdarzeń.

### Testy

Projekt zawiera kompleksowy zestaw testów:

- Testy jednostkowe modułów głównych
- Testy integracyjne komponentów
- Testy trybów gry
- Automatyczne pokrycie kodu

```bash
npm test              # Wszystkie testy (CJS)
npm test:core         # Testy modułów głównych
npm test:integration  # Testy integracyjne
npm test:coverage     # Raport pokrycia
npm run test:esm      # Testy ESM (np. components/dashboard) przez vm-modules
```

### Budowanie produkcyjne

- **Rollup**: Pakuje `js/main-es6.js` do ESM z podziałem kodu (code-splitting) i mapami źródeł (sourcemaps)
- **Terser**: Automatyczna minifikacja dla optymalizacji
- **Post-build**: Kopiuje `css/` i `assets/`, ikony favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` i przepisuje `dist/index.html` do haszowanego pliku wejściowego (np. `main-es6-*.js`)
- **Folder końcowy**: `dist/` gotowy do serwowania statycznego

```bash
npm run build      # generuje dist/
npm run serve:dist # serwuje dist/ (port 5000)
```

### Ciągła Integracja (CI)

**GitHub Actions**: Zautomatyzowany potok w `.github/workflows/ci.yml`

Potok CI/CD uruchamia się automatycznie przy każdym wypchnięciu (push) i pull request:

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

- CI Build Status (GitHub Actions)
- Ocena CodeFactor
- Odznaka Codacy
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix to w pełni funkcjonalna aplikacja PWA z obsługą offline i możliwością instalacji.

**Service Worker** (`sw.js`):

- Nawigacja: Network-first z rezerwowym trybem offline do `offline.html`
- Obrazy: Cache-first, aby zoptymalizować wydajność
- Tłumaczenia: Stale-while-revalidate dla aktualizacji w tle
- JS/CSS: Network-first, aby zawsze serwować najnowszą wersję
- Automatyczne zarządzanie wersjami przez `cache-updater.js`

**Manifest** (`manifest.json`):

- Ikony SVG i PNG dla wszystkich urządzeń
- Możliwość instalacji na urządzeniach mobilnych (Dodaj do ekranu głównego)
- Konfiguracja standalone dla wrażeń podobnych do aplikacji natywnej
- Obsługa motywów i kolorów

**Testowanie trybu offline lokalnie**:

1. Uruchom serwer deweloperski:

   ```bash
   npm run serve
   ```

   Otwórz `http://localhost:8080` (lub wyświetlony port)

2. Test ręczny:
   - Wyłącz sieć w DevTools (Zakładka Network → Offline)
   - Odśwież stronę → wyświetla się `offline.html`

3. Test automatyczny (Wymaga Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Skrypty zarządzania Service Worker**:

```bash
npm run sw:disable  # Wyłącz service worker
npm run sw:fix      # Napraw problemy z pamięcią podręczną
```

### Standardy jakości

**Narzędzia jakości kodu**:

- **ESLint**: Nowoczesna konfiguracja z płaską konfiguracją (`eslint.config.js`), obsługa ES2022
- **Prettier**: Automatyczne formatowanie kodu (`.prettierrc`)
- **Stylelint**: Walidacja CSS (`.stylelintrc.json`)
- **JSDoc**: Automatyczna dokumentacja funkcji z analizą pokrycia

**Ważne zasady kodu**:

- Usuwaj nieużywane zmienne i parametry (`no-unused-vars`)
- Używaj konkretnej obsługi błędów (brak pustych bloków catch)
- Unikaj `innerHTML` na rzecz funkcji z `security-utils.js`
- Utrzymuj złożoność poznawczą funkcji poniżej 15
- Wyodrębniaj złożone funkcje do mniejszych pomocników

**Bezpieczeństwo**:

- **Ochrona XSS**: Używaj funkcji z `security-utils.js`:
  - `appendSanitizedHTML()` zamiast `innerHTML`
  - `createSafeElement()` do bezpiecznego tworzenia elementów
  - `setSafeMessage()` dla treści tekstowej
- **Skrypty zewnętrzne**: Atrybut `crossorigin="anonymous"` obowiązkowy
- **Walidacja danych wejściowych**: Zawsze sanityzuj dane zewnętrzne
- **Content Security Policy**: Nagłówki CSP do ograniczania źródeł skryptów

**Dostępność**:

- Zgodność z WCAG 2.1 AA
- Pełna nawigacja klawiaturą
- Role ARIA i odpowiednie etykiety
- Zgodne kontrasty kolorów

**Wydajność**:

- Leniwe ładowanie modułów przez `lazy-loader.js`
- Optymalizacje CSS i responsywnych zasobów
- Service Worker do inteligentnego buforowania
- Podział kodu (code splitting) i minifikacja w produkcji

## 📱 Kompatybilność

### Obsługiwane przeglądarki

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Urządzenia

- **Pulpit**: Sterowanie klawiaturą i myszą
- **Tablety**: Zoptymalizowany interfejs dotykowy
- **Smartfony**: Adaptacyjny responsywny design

### Dostępność

- Pełna nawigacja klawiaturą (Tab, strzałki, Esc)
- Role ARIA i etykiety dla czytników ekranu
- Zgodne kontrasty kolorów
- Obsługa technologii wspomagających

## 🌍 Lokalizacja

Pełna obsługa wielojęzyczna:

- **Francuski** (język domyślny)
- **Angielski**
- **Hiszpański**

### Zarządzanie tłumaczeniami

**Pliki tłumaczeń:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Start",
  "quiz_correct": "Dobra robota!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Skrypty zarządzania i18n

**`npm run i18n:verify`** - Weryfikuj spójność kluczy tłumaczeń

**`npm run i18n:unused`** - Lista nieużywanych kluczy tłumaczeń

**`npm run i18n:compare`** - Porównaj pliki tłumaczeń z fr.json (odniesienie)

Ten skrypt (`scripts/compare-translations.cjs`) zapewnia synchronizację wszystkich plików językowych:

**Funkcje:**

- Wykrywanie brakujących kluczy (obecnych w fr.json, ale nieobecnych w innych językach)
- Wykrywanie dodatkowych kluczy (obecnych w innych językach, ale nie w fr.json)
- Identyfikacja pustych wartości (`""`, `null`, `undefined`, `[]`)
- Sprawdzanie spójności typów (ciąg znaków vs tablica)
- Spłaszczanie zagnieżdżonych struktur JSON do notacji kropkowej (np. `arcade.multiMemory.title`)
- Generowanie szczegółowego raportu w konsoli
- Zapisywanie raportu JSON do `docs/translations-comparison-report.json`

**Przykładowe wyjście:**

```
🔍 Analiza porównawcza plików tłumaczeń

📚 Język odniesienia: fr.json
✅ fr.json: 335 kluczy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analiza en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Razem kluczy: 335
✅ Brak brakujących kluczy
✅ Brak dodatkowych kluczy
✅ Brak pustych wartości

📊 PODSUMOWANIE KOŃCOWE
  fr.json: 335 kluczy
  en.json: 335 kluczy
  es.json: 335 kluczy

✅ Wszystkie pliki tłumaczeń są idealnie zsynchronizowane!
```

**Pokrycie tłumaczeń:**

- Kompletny interfejs użytkownika
- Instrukcje gry
- Komunikaty o błędach i informacje zwrotne
- Opisy i pomoc kontekstowa
- Treść narracyjna trybu przygody
- Etykiety dostępności i ARIA

## 📊 Przechowywanie danych

### Dane użytkownika

- Profile i preferencje
- Postęp według trybu gry
- Wyniki i statystyki gier arcade
- Ustawienia personalizacji

### Funkcje techniczne

- Lokalna pamięć masowa (localStorage) z mechanizmami awaryjnymi
- Izolacja danych dla każdego użytkownika
- Automatyczne zapisywanie postępu
- Automatyczna migracja starych danych

## 🐛 Zgłaszanie problemów

Problemy można zgłaszać za pośrednictwem issues na GitHubie. Prosimy o dołączenie:

- Szczegółowego opisu problemu
- Kroków do odtworzenia
- Przeglądarki i wersji
- Zrzutów ekranu, jeśli są istotne

## 💝 Wsparcie projektu

**[☕ Przekaż darowiznę przez PayPal](https://paypal.me/jls)**

## 📄 Licencja

Ten projekt jest objęty licencją AGPL v3. Zobacz plik `LICENSE` po więcej szczegółów.

---

_LeapMultix - Nowoczesna aplikacja edukacyjna do nauki tabliczki mnożenia_

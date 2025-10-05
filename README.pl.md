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

<!-- Odznaki (zaktualizuj <właściciel>/<repo> po migracji na GitHub) -->

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

LeapMultix to nowoczesna, interaktywna i edukacyjna aplikacja internetowa przeznaczona dla dzieci (w wieku 8–12 lat) do opanowania tabliczki mnożenia. Aplikacja oferuje **4 klasyczne tryby gry** oraz **4 minigry zręcznościowe** w intuicyjnym, dostępnym i wielojęzycznym interfejsie.

**Opracowane przez:** Julien LS (contact@jls42.org)

**URL online:** https://leapmultix.jls42.org/

## ✨ Funkcje

### 🎮 Tryby gry

- **Tryb odkrywania**: Wizualna i interaktywna eksploracja tabliczki mnożenia.
- **Tryb quizu**: Pytania wielokrotnego wyboru z adaptacyjnym postępem.
- **Tryb wyzwania**: Wyścig z czasem na różnych poziomach trudności.
- **Tryb przygodowy**: Postęp fabularny przez poziomy z interaktywną mapą.

### 🕹️ Minigry zręcznościowe

- **MultiInvaders**: Edukacyjna wersja Space Invaders - niszcz złe odpowiedzi.
- **MultiMiam**: Matematyczny Pac-Man - zbieraj poprawne odpowiedzi.
- **MultiMemory**: Gra pamięciowa - dopasuj mnożenie do jego wyniku.
- **MultiSnake**: Edukacyjna wersja Snake'a - rośnij, jedząc właściwe liczby.

### 🌍 Funkcje przekrojowe

- **Wielu użytkowników**: Zarządzanie indywidualnymi profilami z zapisanym postępem.
- **Wielojęzyczność**: Wsparcie dla języka francuskiego, angielskiego i hiszpańskiego.
- **Personalizacja**: Awatary, motywy kolorystyczne, tła.
- **Dostępność**: Nawigacja za pomocą klawiatury, obsługa dotykowa, zgodność z WCAG 2.1 AA.
- **Responsywność mobilna**: Zoptymalizowany interfejs dla tabletów i smartfonów.
- **System postępów**: Wyniki, odznaki, codzienne wyzwania.

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
# Aplikacja będzie dostępna pod adresem http://localhost:8080 (lub następnym wolnym portem)

# Lub za pomocą Pythona (opcja 2)
python3 -m http.server 8000
# Aplikacja będzie dostępna pod adresem http://localhost:8000
```

### Dostępne skrypty

```bash
# Rozwój
npm run serve          # Serwer lokalny
npm run lint           # Sprawdzanie kodu
npm run test           # Uruchom wszystkie testy (CJS)
npm run test:coverage  # Testy z pokryciem
npm run test:esm       # Testy ESM (foldery tests-esm/, Jest vm-modules)
npm run test:pwa-offline # Test PWA w trybie offline (wymaga Puppeteer), po `npm run serve`

# Analiza i konserwacja
npm run analyze:jsdoc  # Analiza dokumentacji
npm run improve:jsdoc  # Automatyczna poprawa JSDoc
npm run audit:mobile   # Testy responsywności mobilnej
npm run audit:accessibility # Testy dostępności
npm run dead-code      # Wykrywanie martwego kodu
npm run analyze:globals # Analiza zmiennych globalnych
npm run analyze:dependencies # Analiza wykorzystania zależności
npm run assets:analyze # Analiza zasobów responsywnych
npm run assets:diff    # Porównanie zasobów

# Budowanie i dostarczanie
npm run build          # Budowanie produkcyjne (Rollup) + post-build (pełny dist/)
npm run serve:dist     # Serwuj dist/ na http://localhost:5000 (lub dostępnym porcie)
```

## 🏗️ Architektura

### Struktura plików

```
leapmultix/
├── index.html              # Główny punkt wejścia
├── js/
│   ├── core/               # Główne moduły ES6
│   │   ├── GameMode.js     # Klasa bazowa dla trybów gry
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # API przechowywania
│   │   ├── audio.js        # Zarządzanie dźwiękiem
│   │   └── utils.js        # Ogólne narzędzia
│   ├── components/         # Komponenty interfejsu wielokrotnego użytku
│   │   ├── topBar.js       # Pasek nawigacyjny
│   │   ├── infoBar.js      # Paski informacyjne gry
│   │   ├── dashboard.js    # Pulpit użytkownika
│   │   └── customization.js # Interfejs personalizacji
│   ├── modes/              # Zrefaktoryzowane tryby gry
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # Minigry zręcznościowe
│   ├── multimiam-*.js      # Moduły gry Pac-Man
│   ├── multisnake.js       # Edukacyjna gra Snake
│   ├── main-es6.js         # Punkt wejścia ES6
│   ├── main.js             # Główny orkiestrator
│   ├── lazy-loader.js      # Leniwe ładowanie
│   └── utils-es6.js        # Narzędzia ES6
├── css/                    # Style modułowe
├── assets/                 # Zasoby
│   ├── images/             # Obrazy i sprite'y
│   ├── sounds/             # Efekty dźwiękowe
│   ├── translations/       # Pliki tłumaczeń
│   └── videos/             # Filmy instruktażowe
└── tests/                  # Testy automatyczne
```

### Architektura techniczna

**Nowoczesne moduły ES6**: Projekt wykorzystuje architekturę modułową z klasami ES6 i natywnymi importami/eksportami.

**Komponenty wielokrotnego użytku**: Interfejs jest zbudowany z scentralizowanych komponentów interfejsu użytkownika (TopBar, InfoBar, Dashboard).

**Leniwe ładowanie (Lazy Loading)**: Inteligentne ładowanie modułów na żądanie w celu optymalizacji wydajności.

**Zunifikowany system przechowywania**: Scentralizowane API do utrwalania danych użytkownika.

**Scentralizowane zarządzanie dźwiękiem**: Kontrola dźwięku z obsługą wielu języków i preferencjami dla poszczególnych użytkowników.

## 🎯 Szczegółowe tryby gry

### Tryb odkrywania

Interfejs do wizualnej eksploracji tabliczki mnożenia z:

- Interaktywną wizualizacją mnożenia
- Animacjami i pomocami pamięciowymi
- Edukacyjnym przeciąganiem i upuszczaniem
- Swobodnym postępem według tabliczki

### Tryb quizu

Pytania wielokrotnego wyboru z:

- 10 pytań na sesję
- Adaptacyjnym postępem w oparciu o sukces
- Wirtualną klawiaturą numeryczną
- Systemem serii (seria poprawnych odpowiedzi)

### Tryb wyzwania

Wyścig z czasem z:

- 3 poziomami trudności (Początkujący, Średni, Trudny)
- Bonusem czasowym za poprawne odpowiedzi
- Systemem żyć
- Tablicą najlepszych wyników

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
- Sterowanie za pomocą klawiatury i dotyku
- Indywidualne tablice wyników dla każdego użytkownika

## 🛠️ Rozwój

### Architektura komponentów

**GameMode (klasa bazowa)**: Wszystkie tryby dziedziczą po wspólnej klasie ze standardowymi metodami.

**GameModeManager**: Scentralizowana orkiestracja uruchamiania i zarządzania trybami.

**Komponenty interfejsu użytkownika**: TopBar, InfoBar, Dashboard i Customization zapewniają spójny interfejs.

**Leniwe ładowanie**: Moduły są ładowane na żądanie w celu optymalizacji początkowej wydajności.

### Testy

Projekt zawiera kompleksowy zestaw testów:

- Testy jednostkowe modułów głównych
- Testy integracyjne komponentów
- Testy trybów gry
- Zautomatyzowane pokrycie kodu

```bash
npm test              # Wszystkie testy (CJS)
npm test:core         # Testy modułów głównych
npm test:integration  # Testy integracyjne
npm test:coverage     # Raport pokrycia
npm run test:esm      # Testy ESM (np. components/dashboard) przez vm-modules
```

### Budowanie produkcyjne

- **Rollup**: Pakuje `js/main-es6.js` do formatu ESM z podziałem kodu i mapami źródeł.
- **Terser**: Automatyczna minifikacja w celu optymalizacji.
- **Post-build**: Kopiuje `css/` i `assets/`, favikony (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` i przepisuje `dist/index.html`, aby wskazywał na plik wejściowy z hashem (np. `main-es6-*.js`).
- **Folder końcowy**: `dist/` gotowy do statycznego serwowania.

```bash
npm run build      # generuje dist/
npm run serve:dist # serwuje dist/ (port 5000)
```

### Ciągła integracja

**GitHub Actions**: `.github/workflows/ci.yml`

- **build-test**: `npm ci`, `lint`, `test`, `audit` + artefakt pokrycia.
- **accessibility**: `npm run audit:accessibility` (nieblokujące).
- **test-esm**: `npm run test:esm` z modułami VM.
- **lighthouse**: Audyt wydajności mobilnej (nieblokujący), raporty jako artefakty.

### PWA (offline i instalacja)

- **Service Worker**: Strategia „najpierw sieć” z rezerwą offline; obrazy ze strategią „najpierw pamięć podręczna”; tłumaczenia ze strategią „stale-while-revalidate”; JS/CSS ze strategią „najpierw sieć”.
- **Manifest**: Ikony SVG/PNG; możliwa instalacja na urządzeniach mobilnych.
- **Testowanie offline lokalnie**:
  1. Uruchom `npm run serve` i otwórz `http://localhost:8080` (lub wyświetlony port).
  2. Odłącz sieć i odśwież stronę → wyświetli się `offline.html`.
  3. Test zautomatyzowany (wymaga Puppeteer): `npm run test:pwa-offline`.

### Standardy jakości

- **ESLint**: Walidacja kodu JavaScript.
- **Prettier**: Automatyczne formatowanie.
- **JSDoc**: Automatyczna dokumentacja funkcji.
- **Dostępność**: Zgodność z WCAG 2.1 AA.
- **Wydajność**: Leniwe ładowanie, optymalizacje CSS.

## 📱 Kompatybilność

### Obsługiwane przeglądarki

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Urządzenia

- **Komputer stacjonarny**: Sterowanie za pomocą klawiatury i myszy.
- **Tablety**: Zoptymalizowany interfejs dotykowy.
- **Smartfony**: Adaptacyjny, responsywny design.

### Dostępność

- Pełna nawigacja za pomocą klawiatury (Tab, strzałki, Esc).
- Role i etykiety ARIA для czytników ekranu.
- Zgodne kontrasty kolorów.
- Wsparcie dla technologii wspomagających.

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
  "menu_start": "Start",
  "quiz_correct": "Dobra robota!",
  "arcade_invasion_title": "MultiInvaders"
}
```

**Skrypty zarządzania:**

```bash
npm run i18n:verify  # Sprawdź brakujące/niespójne klucze
npm run i18n:unused  # Wyświetl listę nieużywanych kluczy
```

**Pokrycie tłumaczeń:**

- Pełny interfejs użytkownika
- Instrukcje do gier
- Komunikaty o błędach i informacje zwrotne
- Opisy i pomoc kontekstowa

## 📊 Przechowywanie danych

### Dane użytkownika

- Profile i preferencje
- Postęp w poszczególnych trybach gry
- Wyniki i statystyki gier zręcznościowych
- Ustawienia personalizacji

### Funkcje techniczne

- Przechowywanie lokalne (localStorage) z rezerwami.
- Izolacja danych według użytkownika.
- Automatyczne zapisywanie postępów.
- Automatyczna migracja starych danych.

## 🐛 Zgłaszanie problemu

Problemy można zgłaszać za pośrednictwem zgłoszeń na GitHub. Prosimy o dołączenie:

- Szczegółowego opisu problemu.
- Kroków do jego odtworzenia.
- Przeglądarki i jej wersji.
- Zrzutów ekranu, jeśli są istotne.

## 💝 Wspieranie projektu

**[☕ Przekaż darowiznę przez PayPal](https://paypal.me/jls)**

## 📄 Licencja

Ten projekt jest objęty licencją AGPL v3. Więcej szczegółów można znaleźć w pliku `LICENSE`.

---

_LeapMultix - Nowoczesna aplikacja edukacyjna do nauki tabliczki mnożenia._

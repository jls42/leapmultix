<details>
<summary>Dieses Dokument ist auch in anderen Sprachen verfügbar</summary>

- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Français](./README.md)
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

<!-- Abzeichen (aktualisiere <owner>/<repo> nach GitHub-Migration) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Inhaltsverzeichnis

- [Beschreibung](#beschreibung)
- [Funktionen](#-funktionen)
- [Schnellstart](#-schnellstart)
- [Architektur](#-architektur)
- [Detaillierte Spielmodi](#-detaillierte-spielmodi)
- [Entwicklung](#-entwicklung)
- [Kompatibilität](#-kompatibilität)
- [Lokalisierung](#-lokalisierung)
- [Datenspeicherung](#-datenspeicherung)
- [Probleme melden](#-probleme-melden)
- [Lizenz](#-lizenz)

## Beschreibung

LeapMultix ist eine moderne, interaktive Bildungs-Webanwendung, die für Kinder (8–12 Jahre) entwickelt wurde, um die 4 Grundrechenarten zu meistern: Multiplikation (×), Addition (+), Subtraktion (−) und Division (÷). Die Anwendung bietet **5 Spielmodi** und **4 Arcade-Minispiele** in einer intuitiven, zugänglichen und mehrsprachigen Oberfläche.

**Unterstützung mehrerer Rechenarten:** Die Modi Quiz und Herausforderung ermöglichen das Üben aller Rechenarten. Die Modi Entdeckung, Abenteuer und Arcade konzentrieren sich auf die Multiplikation, sind aber so konzipiert, dass sie alle Rechenarten unterstützen.

**Entwickelt von:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## ✨ Funktionen

### 🎮 Spielmodi

- **Entdeckungsmodus**: Visuelle und interaktive Erkundung, angepasst an jede Rechenart
- **Quizmodus**: Multiple-Choice-Fragen mit Unterstützung für alle 4 Rechenarten (×, +, −, ÷) und adaptivem Fortschritt
- **Herausforderungsmodus**: Wettlauf gegen die Zeit mit allen 4 Rechenarten (×, +, −, ÷) und verschiedenen Schwierigkeitsgraden
- **Abenteuermodus**: Narrative Progression durch Level mit Unterstützung für alle 4 Rechenarten

### 🕹️ Arcade-Minispiele

- **MultiInvaders**: Pädagogisches Space Invaders - Zerstöre die falschen Antworten
- **MultiMiam**: Mathematisches Pac-Man - Sammle die richtigen Antworten
- **MultiMemory**: Memory-Spiel - Ordne Operationen und Ergebnisse zu
- **MultiSnake**: Pädagogisches Snake - Wachse, indem du die richtigen Zahlen isst

### ➕ Multi-Operationen-Unterstützung

LeapMultix bietet ein vollständiges Training für die 4 Grundrechenarten in **allen Modi**:

| Modus           | ×   | +   | −   | ÷   |
| --------------- | --- | --- | --- | --- |
| Quiz            | ✅  | ✅  | ✅  | ✅  |
| Herausforderung | ✅  | ✅  | ✅  | ✅  |
| Entdeckung      | ✅  | ✅  | ✅  | ✅  |
| Abenteuer       | ✅  | ✅  | ✅  | ✅  |
| Arcade          | ✅  | ✅  | ✅  | ✅  |

### 🌍 Übergreifende Funktionen

- **Mehrbenutzer**: Verwaltung individueller Profile mit gespeichertem Fortschritt
- **Mehrsprachig**: Unterstützung für Französisch, Englisch und Spanisch
- **Anpassung**: Avatare, Farbthemen, Hintergründe
- **Barrierefreiheit**: Tastaturnavigation, Touch-Unterstützung, WCAG 2.1 AA-Konformität
- **Mobile Responsive**: Oberfläche optimiert für Tablets und Smartphones
- **Fortschrittssystem**: Punkte, Abzeichen, tägliche Herausforderungen

## 🚀 Schnellstart

### Voraussetzungen

- Node.js (Version 16 oder höher)
- Ein moderner Webbrowser

### Installation

```bash
# Projekt klonen
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten (Option 1)
npm run serve
# Die Anwendung ist unter http://localhost:8080 erreichbar (oder nächster verfügbarer Port)

# Oder mit Python (Option 2)
python3 -m http.server 8000
# Die Anwendung ist unter http://localhost:8000 erreichbar
```

### Verfügbare Skripte

```bash
# Entwicklung
npm run serve          # Lokaler Server (http://localhost:8080)
npm run lint           # Code-Überprüfung mit ESLint
npm run lint:fix       # Automatische Behebung von ESLint-Problemen
npm run format:check   # Code-Formatierung prüfen (IMMER vor Commit)
npm run format         # Code mit Prettier formatieren
npm run verify         # Quality Gate: Lint + Test + Coverage

# Tests
npm run test           # Alle Tests ausführen (CJS)
npm run test:watch     # Tests im Watch-Modus
npm run test:coverage  # Tests mit Abdeckungsbericht
npm run test:core      # Nur Tests für Core-Module
npm run test:integration # Integrationstests
npm run test:storage   # Speichersystem-Tests
npm run test:esm       # ESM-Tests (Ordner tests-esm/, Jest vm-modules)
npm run test:verbose   # Tests mit detaillierter Ausgabe
npm run test:pwa-offline # PWA-Offline-Test (erfordert Puppeteer), nach `npm run serve`

# Analyse und Wartung
npm run analyze:jsdoc  # Dokumentationsanalyse
npm run improve:jsdoc  # Automatische JSDoc-Verbesserung
npm run audit:mobile   # Mobile Responsiveness Tests
npm run audit:accessibility # Barrierefreiheitstests
npm run dead-code      # Erkennung von ungenutztem Code
npm run analyze:globals # Analyse globaler Variablen
npm run analyze:dependencies # Analyse der Abhängigkeitsnutzung
npm run verify:cleanup # Kombinierte Analyse (toter Code + Globale)

# Asset-Management
npm run assets:generate    # Generierung responsiver Bilder
npm run assets:backgrounds # Hintergründe in WebP konvertieren
npm run assets:analyze     # Analyse responsiver Assets
npm run assets:diff        # Asset-Vergleich

# Internationalisierung
npm run i18n:verify    # Konsistenz der Übersetzungsschlüssel prüfen
npm run i18n:unused    # Ungenutzte Übersetzungsschlüssel auflisten
npm run i18n:compare   # Übersetzungen (en/es) mit fr.json (Referenz) vergleichen

# Build & Auslieferung
npm run build          # Produktions-Build (Rollup) + Postbuild (komplettes dist/)
npm run serve:dist     # dist/ unter http://localhost:5000 bereitstellen (oder verfügbarer Port)

# PWA und Service Worker
npm run sw:disable     # Service Worker deaktivieren
npm run sw:fix         # Service Worker Probleme beheben
```

## 🏗️ Architektur

### Dateistruktur

```
leapmultix/
├── index.html              # Haupteinstiegspunkt
├── js/
│   ├── core/               # ES6 Core-Module
│   │   ├── GameMode.js     # Basisklasse für Modi
│   │   ├── GameModeManager.js # Spielmodus-Verwaltung
│   │   ├── storage.js      # LocalStorage API
│   │   ├── audio.js        # Sound-Verwaltung
│   │   ├── utils.js        # Generische Hilfsprogramme (kanonische Quelle)
│   │   ├── eventBus.js     # Ereigniskommunikation
│   │   ├── userState.js    # Benutzersitzungsverwaltung
│   │   ├── mainInit.js     # DOM-Ready-Initialisierung
│   │   ├── theme.js        # Themensystem
│   │   ├── userUi.js       # Benutzeroberflächen-Hilfsprogramme
│   │   ├── parental.js     # Kindersicherung
│   │   ├── adventure-data.js # Daten für den Abenteuermodus
│   │   ├── mult-stats.js   # Multiplikationsstatistiken
│   │   ├── challenge-stats.js # Herausforderungsstatistiken
│   │   └── daily-challenge.js # Verwaltung täglicher Herausforderungen
│   ├── components/         # Wiederverwendbare UI-Komponenten
│   │   ├── topBar.js       # Navigationsleiste
│   │   ├── infoBar.js      # Spiel-Infoleisten
│   │   ├── dashboard.js    # Benutzer-Dashboard
│   │   └── customization.js # Anpassungsoberfläche
│   ├── modes/              # Spielmodi
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Arcade-Minispiele
│   │   ├── arcade.js       # Haupt-Arcade-Orchestrator
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Memory-Spiel (31 KB)
│   │   ├── arcade-multimiam.js # MultiMiam-Integration
│   │   ├── arcade-multisnake.js # Snake-Integration
│   │   ├── arcade-common.js, arcade-utils.js # Geteilte Hilfsprogramme
│   │   ├── arcade-message.js, arcade-points.js # UI-Komponenten
│   │   └── arcade-scores.js # Punkteverwaltung
│   ├── multimiam/          # Pac-Man-Spiel (zerlegte Architektur)
│   │   ├── multimiam.js    # Haupt-Controller
│   │   ├── multimiam-engine.js # Spiel-Engine (15 KB)
│   │   ├── multimiam-renderer.js # Rendering-System (9 KB)
│   │   ├── multimiam-controls.js # Steuerungsverwaltung (7 KB)
│   │   ├── multimiam-questions.js # Fragengenerierung (6 KB)
│   │   └── multimiam-ui.js # Oberflächenelemente
│   ├── multisnake.js       # Snake-Spiel (38 KB)
│   ├── navigation/         # Navigationssystem
│   │   ├── slides.js       # Folienbasierte Navigation (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Tastaturunterstützung
│   ├── ui/                 # Benutzeroberfläche und Feedback
│   │   ├── uiUtils.js      # Oberflächen-Hilfsprogramme
│   │   ├── ui-feedback.js  # Feedback-Mechanismen
│   │   ├── touch-support.js # Touch-Unterstützung (7 KB)
│   │   ├── virtual-keyboard.js # Virtuelle Tastatur
│   │   ├── coin-display.js, coin-effects.js # Währungssystem
│   │   ├── notifications.js # Benachrichtigungssystem
│   │   └── badges.js       # Abzeichensystem
│   ├── media/              # Medienverwaltung
│   │   ├── VideoManager.js # Videowiedergabeverwaltung (12 KB)
│   │   └── responsive-image-loader.js # Bildladen (9 KB)
│   ├── orchestration/      # Orchestrierung und Laden
│   │   ├── mode-orchestrator.js # Moduswechsel
│   │   ├── lazy-loader.js  # Dynamisches Laden (10 KB)
│   │   └── game-cleanup.js # Zustandsbereinigung
│   ├── utils/              # Hilfsprogramme
│   │   ├── utils-es6.js    # Hauptaggregator (5 KB)
│   │   ├── main-helpers.js # Anwendungshelfer
│   │   ├── helpers.js      # Legacy-Hilfsfunktionen
│   │   ├── stats-utils.js  # Statistik-Hilfsprogramme
│   │   ├── difficulty.js   # Schwierigkeitsverwaltung
│   │   └── questionGenerator.js # Fragengenerierung
│   ├── storage/            # Speicherung und Zustand
│   │   ├── storage.js      # Legacy-Speicher-Wrapper
│   │   └── userManager.js  # Mehrbenutzerverwaltung (19 KB)
│   ├── i18n/               # Internationalisierung
│   │   ├── i18n.js         # i18n-System
│   │   └── i18n-store.js   # Übersetzungsspeicher
│   ├── security/           # Sicherheit und Fehlerbehandlung
│   │   ├── security-utils.js # XSS-Schutz, Bereinigung
│   │   ├── error-handlers.js # Globale Fehlerbehandlung
│   │   └── logger.js       # Protokollierungssystem
│   ├── accessibility/      # Barrierefreiheit
│   │   ├── accessibility.js # Barrierefreiheitsfunktionen
│   │   └── speech.js       # Sprachsyntheseunterstützung
│   ├── integration/        # Integration und Analyse
│   │   ├── plausible-init.js # Plausible Analytics
│   │   ├── cache-updater.js # Cache-Verwaltung (10 KB)
│   │   └── imports.js      # Import-Hilfsprogramme
│   ├── main-es6.js         # ES6-Einstiegspunkt
│   ├── main.js             # Haupt-Orchestrator
│   ├── bootstrap.js        # Einrichtung von ES6-Event-Handlern
│   └── game.js             # Zustandsverwaltung und tägliche Herausforderungen
├── css/                    # Modulare Stile
├── assets/                 # Ressourcen
│   ├── images/             # Bilder und Sprites
│   ├── generated-images/   # Generierte responsive Bilder
│   ├── sounds/             # Soundeffekte
│   ├── translations/       # Übersetzungsdateien (fr, en, es)
│   └── videos/             # Tutorial-Videos
├── tests/                  # Automatisierte Tests
│   ├── __tests__/          # Unit- und Integrationstests
│   └── tests-esm/          # ESM-Tests (.mjs)
├── scripts/                # Wartungsskripte
│   ├── compare-translations.cjs # Übersetzungsvergleich
│   └── cleanup-i18n-keys.cjs # Bereinigung von i18n-Schlüsseln
└── dist/                   # Produktions-Build (generiert)
```

### Technische Architektur

**Moderne ES6-Module**: Das Projekt verwendet eine modulare Architektur mit ES6-Klassen und nativen Importen/Exporten.

**Wiederverwendbare Komponenten**: Benutzeroberfläche aufgebaut mit zentralisierten UI-Komponenten (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligentes Laden von Modulen bei Bedarf über `lazy-loader.js`, um die anfängliche Leistung zu optimieren.

**Vereinheitlichtes Speichersystem**: Zentralisierte API für die Persistenz von Benutzerdaten über LocalStorage mit Fallbacks.

**Zentralisierte Audioverwaltung**: Soundsteuerung mit mehrsprachiger Unterstützung und benutzerspezifischen Einstellungen.

**Event Bus**: Entkoppelte ereignisgesteuerte Kommunikation zwischen Komponenten für eine wartbare Architektur.

**Foliennavigation**: Navigationssystem basierend auf nummerierten Folien (slide0, slide1, etc.) mit `goToSlide()`.

**Sicherheit**: XSS-Schutz und Bereinigung über `security-utils.js` für alle DOM-Manipulationen.

## 🎯 Detaillierte Spielmodi

### Entdeckungsmodus

Visuelle Erkundungsoberfläche für Multiplikationstabellen mit:

- Interaktive Visualisierung von Multiplikationen
- Animationen und Gedächtnishilfen
- Pädagogisches Drag-and-Drop
- Freier Fortschritt pro Tabelle

### Quizmodus

Multiple-Choice-Fragen mit:

- 10 Fragen pro Sitzung
- Adaptiver Fortschritt basierend auf Erfolg
- Virtueller Ziffernblock
- Streak-System (Serie richtiger Antworten)

### Herausforderungsmodus

Wettlauf gegen die Zeit mit:

- 3 Schwierigkeitsstufen (Anfänger, Mittel, Schwer)
- Zeitbonus für richtige Antworten
- Lebenssystem
- Bestenliste der höchsten Punktzahlen

### Abenteuermodus

Narrative Progression mit:

- 12 freischaltbaren thematischen Levels
- Interaktive Karte mit visuellem Fortschritt
- Immersive Geschichte mit Charakteren
- Sternesystem und Belohnungen

### Arcade-Minispiele

Jedes Minispiel bietet:

- Wahl der Schwierigkeit und Anpassung
- Lebenssystem und Punktzahl
- Tastatur- und Touch-Steuerung
- Individuelle Bestenlisten pro Benutzer

## 🛠️ Entwicklung

### Entwicklungs-Workflow

**WICHTIG: Niemals direkt auf main committen**

Das Projekt verwendet einen Workflow, der auf Feature-Branches basiert:

1.  **Einen Branch erstellen**:

    ```bash
    git checkout -b feat/name-des-features
    # oder
    git checkout -b fix/name-des-bugs
    ```

2.  **Entwickeln und testen**:

    ```bash
    npm run format:check  # IMMER zuerst Formatierung prüfen
    npm run format        # Formatieren, falls nötig
    npm run lint          # Code-Qualität prüfen
    npm run test          # Tests ausführen
    npm run test:coverage # Abdeckung prüfen
    ```

3.  **Auf dem Branch committen**:

    ```bash
    git add .
    git commit -m "feat: Beschreibung des Features"
    ```

4.  **Pushen und einen Pull Request erstellen**:
    ```bash
    git push -u origin feat/name-des-features
    ```

**Commit-Stil**: Prägnant, Imperativ (z. B. "Fix arcade init errors", "Refactor cache updater")

**Quality Gate**: Sicherstellen, dass `npm run lint`, `npm test` und `npm run test:coverage` vor jedem Commit erfolgreich sind

### Komponentenarchitektur

**GameMode (Basisklasse)**: Alle Modi erben von einer gemeinsamen Klasse mit standardisierten Methoden.

**GameModeManager**: Zentralisierte Orchestrierung des Startens und Verwaltens von Modi.

**UI-Komponenten**: TopBar, InfoBar, Dashboard und Customization bieten eine konsistente Oberfläche.

**Lazy Loading**: Module werden bei Bedarf geladen, um die anfängliche Leistung zu optimieren.

**Event Bus**: Entkoppelte Kommunikation zwischen Komponenten über das Ereignissystem.

### Tests

Das Projekt enthält eine umfassende Testsuite:

- Unit-Tests für Core-Module
- Integrationstests für Komponenten
- Tests für Spielmodi
- Automatisierte Code-Abdeckung

```bash
npm test              # Alle Tests (CJS)
npm test:core         # Tests für Core-Module
npm test:integration  # Integrationstests
npm test:coverage     # Abdeckungsbericht
npm run test:esm      # ESM-Tests (z. B. components/dashboard) via vm-modules
```

### Produktions-Build

- **Rollup**: Bündelt `js/main-es6.js` in ESM mit Code-Splitting und Sourcemaps
- **Terser**: Automatische Minifizierung zur Optimierung
- **Post-Build**: Kopiert `css/` und `assets/`, Favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` und schreibt `dist/index.html` auf die gehashte Eingabedatei um (z. B. `main-es6-*.js`)
- **Finaler Ordner**: `dist/` bereit für statische Bereitstellung

```bash
npm run build      # generiert dist/
npm run serve:dist # stellt dist/ bereit (Port 5000)
```

### Continuous Integration

**GitHub Actions**: Automatisierte Pipeline in `.github/workflows/ci.yml`

Die CI/CD-Pipeline läuft automatisch bei jedem Push und Pull Request:

**Haupt-Jobs**:

1.  **build-test**: Hauptvalidierungsjob
    - Installation von Abhängigkeiten: `npm ci`
    - Überprüfung der Formatierung: `npm run format:check`
    - Statische Analyse: `npm run lint`
    - Unit-Tests: `npm run test`
    - Sicherheitsaudit: `npm audit`
    - Generierung des Abdeckungsartefakts

2.  **accessibility**: Barrierefreiheitsaudit (nicht blockierend)
    - Führt `npm run audit:accessibility` aus
    - Generiert WCAG 2.1 AA Barrierefreiheitsbericht

3.  **test-esm**: Tests für ES6-Module
    - Führt `npm run test:esm` mit Jest VM-Modulen aus
    - Validiert ES6-Importe/Exporte

4.  **lighthouse**: Leistungs-Audit (nicht blockierend)
    - Mobile Leistungsprüfung
    - Generiert Lighthouse-Berichtsartefakte
    - Core Web Vitals Metriken

**Qualitätsabzeichen**:

- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix ist eine vollständige PWA mit Offline-Unterstützung und Installationsmöglichkeit.

**Service Worker** (`sw.js`):

- Navigation: Network-first mit Offline-Fallback auf `offline.html`
- Bilder: Cache-first zur Leistungsoptimierung
- Übersetzungen: Stale-while-revalidate für Updates im Hintergrund
- JS/CSS: Network-first, um immer die neueste Version bereitzustellen
- Automatische Versionsverwaltung über `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- und PNG-Symbole für alle Geräte
- Installation auf Mobilgeräten möglich (Zum Startbildschirm hinzufügen)
- Standalone-Konfiguration für App-ähnliches Erlebnis
- Unterstützung für Themen und Farben

**Offline-Modus lokal testen**:

1.  Entwicklungsserver starten:

    ```bash
    npm run serve
    ```

    Öffnen Sie `http://localhost:8080` (oder den angezeigten Port)

2.  Manuell testen:
    - Netzwerk in den DevTools trennen (Tab Netzwerk → Offline)
    - Seite aktualisieren → `offline.html` wird angezeigt

3.  Automatisierter Test (erfordert Puppeteer):
    ```bash
    npm run test:pwa-offline
    ```

**Service Worker Verwaltungsskripte**:

```bash
npm run sw:disable  # Service Worker deaktivieren
npm run sw:fix      # Cache-Probleme beheben
```

### Qualitätsstandards

**Code-Qualitätstools**:

- **ESLint**: Moderne Konfiguration mit Flat Config (`eslint.config.js`), ES2022-Unterstützung
- **Prettier**: Automatische Code-Formatierung (`.prettierrc`)
- **Stylelint**: CSS-Validierung (`.stylelintrc.json`)
- **JSDoc**: Automatische Funktionsdokumentation mit Abdeckungsanalyse

**Wichtige Code-Regeln**:

- Ungenutzte Variablen und Parameter entfernen (`no-unused-vars`)
- Spezifische Fehlerbehandlung verwenden (keine leeren Catches)
- `innerHTML` zugunsten von `security-utils.js`-Funktionen vermeiden
- Kognitive Komplexität < 15 für Funktionen beibehalten
- Komplexe Funktionen in kleinere Helfer extrahieren

**Sicherheit**:

- **XSS-Schutz**: Funktionen aus `security-utils.js` verwenden:
  - `appendSanitizedHTML()` anstelle von `innerHTML`
  - `createSafeElement()` zum Erstellen sicherer Elemente
  - `setSafeMessage()` für Textinhalte
- **Externe Skripte**: `crossorigin="anonymous"` Attribut obligatorisch
- **Eingabevalidierung**: Externe Daten immer bereinigen
- **Content Security Policy**: CSP-Header zur Einschränkung von Skriptquellen

**Barrierefreiheit**:

- WCAG 2.1 AA Konformität
- Vollständige Tastaturnavigation
- ARIA-Rollen und angemessene Labels
- Konformer Farbkontrast

**Leistung**:

- Lazy Loading von Modulen über `lazy-loader.js`
- CSS- und responsive Asset-Optimierungen
- Service Worker für intelligentes Caching
- Code-Splitting und Minifizierung in der Produktion

## 📱 Kompatibilität

### Unterstützte Browser

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Geräte

- **Desktop**: Tastatur- und Maussteuerung
- **Tablets**: Optimierte Touch-Oberfläche
- **Smartphones**: Adaptives responsives Design

### Barrierefreiheit

- Vollständige Tastaturnavigation (Tab, Pfeile, Escape)
- ARIA-Rollen und Labels für Screenreader
- Konformer Farbkontrast
- Unterstützung für assistive Technologien

## 🌍 Lokalisierung

Vollständige mehrsprachige Unterstützung:

- **Französisch** (Standardsprache)
- **Englisch**
- **Spanisch**

### Übersetzungsmanagement

**Übersetzungsdateien:** `assets/translations/*.json`

**Format:**

```json
{
  "menu_start": "Starten",
  "quiz_correct": "Gut gemacht!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n-Verwaltungsskripte

**`npm run i18n:verify`** - Konsistenz der Übersetzungsschlüssel prüfen

**`npm run i18n:unused`** - Ungenutzte Übersetzungsschlüssel auflisten

**`npm run i18n:compare`** - Übersetzungsdateien mit fr.json (Referenz) vergleichen

Dieses Skript (`scripts/compare-translations.cjs`) stellt die Synchronisation aller Sprachdateien sicher:

**Funktionen:**

- Erkennung fehlender Schlüssel (in fr.json vorhanden, aber in anderen Sprachen fehlend)
- Erkennung zusätzlicher Schlüssel (in anderen Sprachen vorhanden, aber nicht in fr.json)
- Identifizierung leerer Werte (`""`, `null`, `undefined`, `[]`)
- Typkonsistenzprüfung (String vs. Array)
- Abflachung verschachtelter JSON-Strukturen in Punktnotation (z. B. `arcade.multiMemory.title`)
- Generierung eines detaillierten Konsolenberichts
- Speichern des JSON-Berichts in `docs/translations-comparison-report.json`

**Beispielausgabe:**

```
🔍 Vergleichende Analyse der Übersetzungsdateien

📚 Referenzsprache: fr.json
✅ fr.json: 335 Schlüssel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse von en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Gesamtschlüssel: 335
✅ Keine fehlenden Schlüssel
✅ Keine zusätzlichen Schlüssel
✅ Keine leeren Werte

📊 ABSCHLUSSBERICHT
  fr.json: 335 Schlüssel
  en.json: 335 Schlüssel
  es.json: 335 Schlüssel

✅ Alle Übersetzungsdateien sind perfekt synchronisiert!
```

**Übersetzungsabdeckung:**

- Vollständige Benutzeroberfläche
- Spielanweisungen
- Fehler- und Feedbacknachrichten
- Beschreibungen und kontextbezogene Hilfe
- Narrativer Inhalt des Abenteuermodus
- Barrierefreiheits- und ARIA-Labels

## 📊 Datenspeicherung

### Benutzerdaten

- Profile und Einstellungen
- Fortschritt pro Spielmodus
- Arcade-Spielstände und Statistiken
- Anpassungseinstellungen

### Technische Funktionen

- Lokaler Speicher (localStorage) mit Fallbacks
- Datenisolation pro Benutzer
- Automatisches Speichern des Fortschritts
- Automatische Migration alter Daten

## 🐛 Probleme melden

Probleme können über GitHub Issues gemeldet werden. Bitte geben Sie an:

- Detaillierte Beschreibung des Problems
- Schritte zum Reproduzieren
- Browser und Version
- Screenshots, falls relevant

## 💝 Projekt unterstützen

**[☕ Spenden via PayPal](https://paypal.me/jls)**

## 📄 Lizenz

Dieses Projekt ist unter der AGPL v3 Lizenz lizenziert. Siehe die Datei `LICENSE` für weitere Details.

---

_LeapMultix - Moderne Bildungsanwendung zum Erlernen des Einmaleins_

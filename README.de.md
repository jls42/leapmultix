<details>
<summary>Dieses Dokument ist auch in anderen Sprachen verfügbar</summary>

- [Français](./README.md)
- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
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

<!-- Badges (aktualisieren <owner>/<repo> nach GitHub-Migration) -->

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
- [Ein Problem melden](#-ein-problem-melden)
- [Lizenz](#-lizenz)

## Beschreibung

LeapMultix ist eine moderne interaktive Bildungs-Webanwendung, die für Kinder (8–12 Jahre) entwickelt wurde, um die 4 Grundrechenarten zu meistern: Multiplikation (×), Addition (+), Subtraktion (−) und Division (÷). Die App bietet **5 Spielmodi** und **4 Arcade-Minispiele** in einer intuitiven, zugänglichen und mehrsprachigen Benutzeroberfläche.

**Unterstützung für mehrere Operationen:** Quiz- und Herausforderungsmodi ermöglichen das Üben aller Operationen. Entdeckungs-, Abenteuer- und Arcade-Modi konzentrieren sich auf die Multiplikation.

**Entwickelt von:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## ✨ Funktionen

### 🎮 Spielmodi

- **Entdeckungsmodus**: Visuelle und interaktive Erkundung der Multiplikationstabellen
- **Quizmodus** ⭐: Multiple-Choice-Fragen mit Unterstützung für alle 4 Operationen (×, +, −, ÷) und adaptivem Fortschritt
- **Herausforderungsmodus** ⭐: Rennen gegen die Zeit mit allen 4 Operationen (×, +, −, ÷) und verschiedenen Schwierigkeitsgraden
- **Abenteuermodus**: Narrative Progression durch Level mit interaktiver Karte (Multiplikation)

⭐ = Volle Unterstützung für alle 4 Grundrechenarten

### 🕹️ Arcade-Minispiele

- **MultiInvaders**: Pädagogisches Space Invaders - Zerstöre die falschen Antworten (Multiplikation)
- **MultiMiam**: Mathematisches Pac-Man - Sammle die richtigen Antworten (Multiplikation)
- **MultiMemory**: Memory-Spiel - Ordne Multiplikationen ihren Ergebnissen zu
- **MultiSnake**: Pädagogisches Snake - Wachse, indem du die richtigen Zahlen isst (Multiplikation)

### ➕ Unterstützung für mehrere Operationen

LeapMultix geht über die einfache Multiplikation hinaus und bietet ein vollständiges Training für die 4 Grundrechenarten:

| Modus           | ×   | +   | −   | ÷   |
| --------------- | --- | --- | --- | --- |
| Quiz            | ✅  | ✅  | ✅  | ✅  |
| Herausforderung | ✅  | ✅  | ✅  | ✅  |
| Entdeckung      | ✅  | ❌  | ❌  | ❌  |
| Abenteuer       | ✅  | ❌  | ❌  | ❌  |
| Arcade          | ✅  | ❌  | ❌  | ❌  |

**Hinweis:** Die Unterstützung der Operationen für die Modi Entdeckung, Abenteuer und Arcade ist für eine spätere Version geplant.

### 🌍 Übergreifende Funktionen

- **Mehrbenutzer**: Verwaltung individueller Profile mit gespeichertem Fortschritt
- **Mehrsprachig**: Unterstützung für Französisch, Englisch und Spanisch
- **Anpassung**: Avatare, Farbthemen, Hintergründe
- **Barrierefreiheit**: Tastaturnavigation, Touch-Unterstützung, WCAG 2.1 AA-Konformität
- **Mobile Responsive**: Optimierte Oberfläche für Tablets und Smartphones
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
npm run format:check   # Code-Formatierung prüfen (IMMER vor dem Commit)
npm run format         # Code mit Prettier formatieren
npm run verify         # Quality Gate: Lint + Test + Coverage

# Tests
npm run test           # Alle Tests ausführen (CJS)
npm run test:watch     # Tests im Watch-Modus
npm run test:coverage  # Tests mit Abdeckungsbericht
npm run test:core      # Nur Tests der Core-Module
npm run test:integration # Integrationstests
npm run test:storage   # Tests des Speichersystems
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
npm run verify:cleanup # Kombinierte Analyse (Dead Code + Globals)

# Asset-Management
npm run assets:generate    # Responsive Bilder generieren
npm run assets:backgrounds # Hintergründe in WebP konvertieren
npm run assets:analyze     # Analyse responsiver Assets
npm run assets:diff        # Vergleich von Assets

# Internationalisierung
npm run i18n:verify    # Konsistenz der Übersetzungsschlüssel prüfen
npm run i18n:unused    # Ungenutzte Übersetzungsschlüssel auflisten
npm run i18n:compare   # Übersetzungen vergleichen (en/es) mit fr.json (Referenz)

# Build & Auslieferung
npm run build          # Produktions-Build (Rollup) + Postbuild (vollständiges dist/)
npm run serve:dist     # dist/ unter http://localhost:5000 servieren (oder verfügbarer Port)

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
│   │   ├── GameModeManager.js # Verwaltung der Spielmodi
│   │   ├── storage.js      # LocalStorage API
│   │   ├── audio.js        # Tonverwaltung
│   │   ├── utils.js        # Generische Dienstprogramme (kanonische Quelle)
│   │   ├── eventBus.js     # Ereignisbasierte Kommunikation
│   │   ├── userState.js    # Benutzersitzungsverwaltung
│   │   ├── mainInit.js     # DOM-Ready Initialisierung
│   │   ├── theme.js        # Themensystem
│   │   ├── userUi.js       # Benutzeroberflächen-Dienstprogramme
│   │   ├── parental.js     # Kindersicherung
│   │   ├── adventure-data.js # Daten für den Abenteuermodus
│   │   ├── mult-stats.js   # Multiplikationsstatistiken
│   │   ├── challenge-stats.js # Herausforderungsstatistiken
│   │   └── daily-challenge.js # Verwaltung täglicher Herausforderungen
│   ├── components/         # Wiederverwendbare UI-Komponenten
│   │   ├── topBar.js       # Navigationsleiste
│   │   ├── infoBar.js      # Informationsleisten der Spiele
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
│   │   ├── arcade-multimiam.js # Multimiam-Integration
│   │   ├── arcade-multisnake.js # Snake-Integration
│   │   ├── arcade-common.js, arcade-utils.js # Gemeinsame Dienstprogramme
│   │   ├── arcade-message.js, arcade-points.js # UI-Komponenten
│   │   └── arcade-scores.js # Punkteverwaltung
│   ├── multimiam/          # Pac-Man Spiel (zerlegte Architektur)
│   │   ├── multimiam.js    # Hauptcontroller
│   │   ├── multimiam-engine.js # Spiel-Engine (15 KB)
│   │   ├── multimiam-renderer.js # Rendering-System (9 KB)
│   │   ├── multimiam-controls.js # Steuerungsverwaltung (7 KB)
│   │   ├── multimiam-questions.js # Fragengenerierung (6 KB)
│   │   └── multimiam-ui.js # Oberflächenelemente
│   ├── multisnake.js       # Snake Spiel (38 KB)
│   ├── navigation/         # Navigationssystem
│   │   ├── slides.js       # Folienbasierte Navigation (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Tastaturunterstützung
│   ├── ui/                 # Benutzeroberfläche und Feedback
│   │   ├── uiUtils.js      # Oberflächendienstprogramme
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
│   ├── utils/              # Dienstprogramme
│   │   ├── utils-es6.js    # Hauptaggregator (5 KB)
│   │   ├── main-helpers.js # Anwendungshelfer
│   │   ├── helpers.js      # Legacy-Helper-Funktionen
│   │   ├── stats-utils.js  # Statistik-Dienstprogramme
│   │   ├── difficulty.js   # Schwierigkeitsgradverwaltung
│   │   └── questionGenerator.js # Fragengenerierung
│   ├── storage/            # Speicher und Zustand
│   │   ├── storage.js      # Legacy-Speicher-Wrapper
│   │   └── userManager.js  # Mehrbenutzerverwaltung (19 KB)
│   ├── i18n/               # Internationalisierung
│   │   ├── i18n.js         # i18n-System
│   │   └── i18n-store.js   # Übersetzungsspeicher
│   ├── security/           # Sicherheit und Fehlerbehandlung
│   │   ├── security-utils.js # XSS-Schutz, Bereinigung
│   │   ├── error-handlers.js # Globale Fehlerbehandlung
│   │   └── logger.js       # Logging-System
│   ├── accessibility/      # Barrierefreiheit
│   │   ├── accessibility.js # Barrierefreiheitsfunktionen
│   │   └── speech.js       # Text-to-Speech-Unterstützung
│   ├── integration/        # Integration und Analyse
│   │   ├── plausible-init.js # Plausible Analytics
│   │   ├── cache-updater.js # Cache-Verwaltung (10 KB)
│   │   └── imports.js      # Import-Dienstprogramme
│   ├── main-es6.js         # ES6-Einstiegspunkt
│   ├── main.js             # Haupt-Orchestrator
│   ├── bootstrap.js        # ES6 Event-Handler-Setup
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

**Wiederverwendbare Komponenten**: Schnittstelle aufgebaut mit zentralisierten UI-Komponenten (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligentes Laden von Modulen bei Bedarf über `lazy-loader.js` zur Optimierung der anfänglichen Leistung.

**Einheitliches Speichersystem**: Zentralisierte API für die Persistenz von Benutzerdaten über LocalStorage mit Fallbacks.

**Zentralisierte Audioverwaltung**: Tonsteuerung mit mehrsprachiger Unterstützung und benutzerbezogenen Einstellungen.

**Event Bus**: Entkoppelte ereignisbasierte Kommunikation zwischen Komponenten für eine wartbare Architektur.

**Foliennavigation**: Auf nummerierten Folien basierendes Navigationssystem (slide0, slide1 usw.) mit `goToSlide()`.

**Sicherheit**: XSS-Schutz und Bereinigung über `security-utils.js` für alle DOM-Manipulationen.

## 🎯 Detaillierte Spielmodi

### Entdeckungsmodus

Visuelle Schnittstelle zur Erkundung der Multiplikationstabellen mit:

- Interaktive Multiplikationsvisualisierung
- Animationen und Gedächtnisstützen
- Pädagogisches Drag-and-Drop
- Freier Fortschritt nach Tabelle

### Quizmodus

Multiple-Choice-Fragen mit:

- 10 Fragen pro Sitzung
- Adaptiver Fortschritt basierend auf Erfolg
- Virtueller Ziffernblock
- Streak-System (Serie richtiger Antworten)

### Herausforderungsmodus

Rennen gegen die Zeit mit:

- 3 Schwierigkeitsgraden (Anfänger, Mittel, Schwer)
- Zeitbonus für richtige Antworten
- Lebenssystem
- Highscore-Rangliste

### Abenteuermodus

Narrative Progression mit:

- 12 freischaltbaren thematischen Leveln
- Interaktive Karte mit visuellem Fortschritt
- Immersive Geschichte mit Charakteren
- Stern- und Belohnungssystem

### Arcade-Minispiele

Jedes Minispiel bietet:

- Wahl des Schwierigkeitsgrads und Anpassung
- Lebens- und Punktesystem
- Tastatur- und Touch-Steuerung
- Individuelle Ranglisten pro Benutzer

## 🛠️ Entwicklung

### Entwicklungs-Workflow

**WICHTIG: Niemals direkt auf main committen**

Das Projekt verwendet einen auf Feature-Branches basierenden Workflow:

1. **Branch erstellen**:

   ```bash
   git checkout -b feat/name-der-funktion
   # oder
   git checkout -b fix/name-des-bugs
   ```

2. **Entwickeln und Testen**:

   ```bash
   npm run format:check  # IMMER zuerst die Formatierung prüfen
   npm run format        # Formatieren, falls erforderlich
   npm run lint          # Code-Qualität prüfen
   npm run test          # Tests ausführen
   npm run test:coverage # Abdeckung prüfen
   ```

3. **Auf dem Branch committen**:

   ```bash
   git add .
   git commit -m "feat: Beschreibung der Funktion"
   ```

4. **Pushen und Pull Request erstellen**:
   ```bash
   git push -u origin feat/name-der-funktion
   ```

**Commit-Stil**: Prägnant, imperativer Modus (z. B. "Fix arcade init errors", "Refactor cache updater")

**Quality Gate**: Sicherstellen, dass `npm run lint`, `npm test` und `npm run test:coverage` vor jedem Commit bestanden werden

### Komponentenarchitektur

**GameMode (Basisklasse)**: Alle Modi erben von einer gemeinsamen Klasse mit standardisierten Methoden.

**GameModeManager**: Zentralisierte Orchestrierung von Start und Verwaltung der Modi.

**UI-Komponenten**: TopBar, InfoBar, Dashboard und Customization bieten eine konsistente Schnittstelle.

**Lazy Loading**: Module werden bei Bedarf geladen, um die anfängliche Leistung zu optimieren.

**Event Bus**: Entkoppelte Kommunikation zwischen Komponenten über das Ereignissystem.

### Tests

Das Projekt enthält eine umfassende Testsuite:

- Unit-Tests für Core-Module
- Integrationstests für Komponenten
- Spielmodus-Tests
- Automatisierte Code-Abdeckung

```bash
npm test              # Alle Tests (CJS)
npm test:core         # Tests der zentralen Module
npm test:integration  # Integrationstests
npm test:coverage     # Abdeckungsbericht
npm run test:esm      # ESM-Tests (z. B. components/dashboard) über vm-modules
```

### Produktions-Build

- **Rollup**: Bündelt `js/main-es6.js` in ESM mit Code-Splitting und Sourcemaps
- **Terser**: Automatische Minifizierung zur Optimierung
- **Post-Build**: Kopiert `css/` und `assets/`, Favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` und schreibt `dist/index.html` auf die gehashte Eingabedatei um (z. B. `main-es6-*.js`)
- **Endgültiger Ordner**: `dist/` bereit zum statischen Servieren

```bash
npm run build      # generiert dist/
npm run serve:dist # serviert dist/ (Port 5000)
```

### Kontinuierliche Integration (CI)

**GitHub Actions**: Automatisierte Pipeline in `.github/workflows/ci.yml`

Die CI/CD-Pipeline wird automatisch bei jedem Push und Pull Request ausgeführt:

**Hauptjobs**:

1. **build-test**: Hauptvalidierungsjob
   - Installation von Abhängigkeiten: `npm ci`
   - Formatierungsprüfung: `npm run format:check`
   - Statische Analyse: `npm run lint`
   - Unit-Tests: `npm run test`
   - Sicherheitsaudit: `npm audit`
   - Generierung des Abdeckungsartefakts

2. **accessibility**: Barrierefreiheitsaudit (nicht blockierend)
   - Führt `npm run audit:accessibility` aus
   - Generiert WCAG 2.1 AA Barrierefreiheitsbericht

3. **test-esm**: ES6-Modultests
   - Führt `npm run test:esm` mit Jest VM-Modulen aus
   - Validiert ES6-Importe/Exporte

4. **lighthouse**: Leistungsprüfung (nicht blockierend)
   - Mobile Leistungsprüfung
   - Generierung von Lighthouse-Berichtsartefakten
   - Core Web Vitals Metriken

**Qualitätsabzeichen**:

- CI Build Status (GitHub Actions)
- CodeFactor Note
- Codacy Abzeichen
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix ist eine vollständige PWA mit Offline-Unterstützung und Installationsmöglichkeit.

**Service Worker** (`sw.js`):

- Navigation: Network-First mit Offline-Fallback auf `offline.html`
- Bilder: Cache-First zur Leistungsoptimierung
- Übersetzungen: Stale-while-revalidate für Aktualisierungen im Hintergrund
- JS/CSS: Network-First, um immer die neueste Version zu servieren
- Automatische Versionsverwaltung über `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- und PNG-Symbole für alle Geräte
- Auf Mobilgeräten installierbar (Zum Startbildschirm hinzufügen)
- Standalone-Konfiguration für App-ähnliches Erlebnis
- Unterstützung für Themen und Farben

**Offline-Modus lokal testen**:

1. Entwicklungsserver starten:

   ```bash
   npm run serve
   ```

   `http://localhost:8080` (oder den angezeigten Port) öffnen

2. Manueller Test:
   - Netzwerk in den DevTools deaktivieren (Tab Network → Offline)
   - Seite aktualisieren → `offline.html` wird angezeigt

3. Automatisierter Test (Puppeteer erforderlich):
   ```bash
   npm run test:pwa-offline
   ```

**Service Worker Verwaltungsskripte**:

```bash
npm run sw:disable  # Service Worker deaktivieren
npm run sw:fix      # Cache-Probleme beheben
```

### Qualitätsstandards

**Code-Qualitätswerkzeuge**:

- **ESLint**: Moderne Konfiguration mit Flat Config (`eslint.config.js`), ES2022-Unterstützung
- **Prettier**: Automatische Code-Formatierung (`.prettierrc`)
- **Stylelint**: CSS-Validierung (`.stylelintrc.json`)
- **JSDoc**: Automatische Funktionsdokumentation mit Abdeckungsanalyse

**Wichtige Code-Regeln**:

- Ungenutzte Variablen und Parameter entfernen (`no-unused-vars`)
- Spezifische Fehlerbehandlung verwenden (keine leeren Catch-Blöcke)
- `innerHTML` zugunsten von `security-utils.js`-Funktionen vermeiden
- Kognitive Komplexität von Funktionen unter 15 halten
- Komplexe Funktionen in kleinere Helper extrahieren

**Sicherheit**:

- **XSS-Schutz**: `security-utils.js`-Funktionen verwenden:
  - `appendSanitizedHTML()` anstelle von `innerHTML`
  - `createSafeElement()` zum Erstellen sicherer Elemente
  - `setSafeMessage()` für Textinhalte
- **Externe Skripte**: Attribut `crossorigin="anonymous"` obligatorisch
- **Eingabevalidierung**: Externe Daten immer bereinigen
- **Content Security Policy (CSP)**: CSP-Header zur Einschränkung von Skriptquellen

**Barrierefreiheit**:

- WCAG 2.1 AA Konformität
- Vollständige Tastaturnavigation
- ARIA-Rollen und entsprechende Labels
- Konforme Farbkontraste

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

- Vollständige Tastaturnavigation (Tab, Pfeile, Esc)
- ARIA-Rollen und Labels für Screenreader
- Konforme Farbkontraste
- Unterstützung für assistierende Technologien

## 🌍 Lokalisierung

Vollständige mehrsprachige Unterstützung:

- **Französisch** (Standardsprache)
- **Englisch**
- **Spanisch**

### Übersetzungsverwaltung

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

- Erkennung fehlender Schlüssel (vorhanden in fr.json, aber fehlend in anderen Sprachen)
- Erkennung zusätzlicher Schlüssel (vorhanden in anderen Sprachen, aber nicht in fr.json)
- Identifizierung leerer Werte (`""`, `null`, `undefined`, `[]`)
- Typprüfung (String vs. Array)
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

📊 ENDZUSAMMENFASSUNG
  fr.json: 335 Schlüssel
  en.json: 335 Schlüssel
  es.json: 335 Schlüssel

✅ Alle Übersetzungsdateien sind perfekt synchronisiert!
```

**Übersetzungsabdeckung:**

- Vollständige Benutzeroberfläche
- Spielanleitungen
- Fehler- und Feedbacknachrichten
- Beschreibungen und kontextbezogene Hilfe
- Narrativer Inhalt des Abenteuermodus
- Barrierefreiheitslabels und ARIA

## 📊 Datenspeicherung

### Benutzerdaten

- Profile und Einstellungen
- Fortschritt nach Spielmodus
- Spielstände und Statistiken der Arcade-Spiele
- Anpassungseinstellungen

### Technische Funktionen

- Lokaler Speicher (localStorage) mit Fallbacks
- Datenisolierung pro Benutzer
- Automatisches Speichern des Fortschritts
- Automatische Migration alter Daten

## 🐛 Ein Problem melden

Probleme können über GitHub Issues gemeldet werden. Bitte geben Sie an:

- Detaillierte Beschreibung des Problems
- Schritte zum Reproduzieren
- Browser und Version
- Screenshots, falls relevant

## 💝 Das Projekt unterstützen

**[☕ Spenden via PayPal](https://paypal.me/jls)**

## 📄 Lizenz

Dieses Projekt steht unter der Lizenz AGPL v3. Siehe die Datei `LICENSE` für weitere Details.

---

_LeapMultix - Moderne Bildungsanwendung zum Lernen des Einmaleins_

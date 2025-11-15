<details>
<summary>Dieses Dokument ist auch in anderen Sprachen verfügbar</summary>

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

<!-- Abzeichen (nach GitHub-Migration <owner>/<repo> aktualisieren) -->

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

LeapMultix ist eine moderne, interaktive Lern-Webanwendung für Kinder (8–12 Jahre) zum Meistern der Multiplikationstabellen. Die Anwendung bietet **4 klassische Spielmodi** und **4 Arcade-Minispiele** in einer intuitiven, zugänglichen und mehrsprachigen Benutzeroberfläche.

**Entwickelt von:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## ✨ Funktionen

### 🎮 Spielmodi

- **Entdeckungsmodus**: Visuelle und interaktive Erkundung der Multiplikationstabellen
- **Quizmodus**: Multiple-Choice-Fragen mit adaptivem Fortschritt
- **Herausforderungsmodus**: Rennen gegen die Zeit mit verschiedenen Schwierigkeitsgraden
- **Abenteuermodus**: Narrativer Fortschritt durch Level mit interaktiver Karte

### 🕹️ Arcade-Minispiele

- **MultiInvaders**: Lern-Space-Invaders - Zerstöre die falschen Antworten
- **MultiMiam**: Mathematisches Pac-Man - Sammle die richtigen Antworten
- **MultiMemory**: Memory-Spiel - Verbinde Multiplikationen mit Ergebnissen
- **MultiSnake**: Lern-Snake - Wachse, indem du die richtigen Zahlen isst

### 🌍 Übergreifende Funktionen

- **Multi-User**: Verwaltung individueller Profile mit gespeichertem Fortschritt
- **Mehrsprachig**: Unterstützung für Französisch, Englisch und Spanisch
- **Personalisierung**: Avatare, Farbthemen, Hintergründe
- **Barrierefreiheit**: Tastaturnavigation, Touch-Unterstützung, WCAG 2.1 AA-Konformität
- **Mobile-Responsive**: Optimierte Benutzeroberfläche für Tablets und Smartphones
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
# Die Anwendung ist unter http://localhost:8080 (oder dem nächsten verfügbaren Port) erreichbar

# Oder mit Python (Option 2)
python3 -m http.server 8000
# Die Anwendung ist unter http://localhost:8000 erreichbar
```

### Verfügbare Skripte

```bash
# Entwicklung
npm run serve          # Lokaler Server (http://localhost:8080)
npm run lint           # Code-Überprüfung mit ESLint
npm run lint:fix       # Automatische Korrektur von ESLint-Problemen
npm run format:check   # Code-Formatierung überprüfen (IMMER vor dem Commit)
npm run format         # Code mit Prettier formatieren
npm run verify         # Quality Gate: lint + test + coverage

# Tests
npm run test           # Alle Tests ausführen (CJS)
npm run test:watch     # Tests im Watch-Modus
npm run test:coverage  # Tests mit Abdeckungsbericht
npm run test:core      # Nur Tests der Kernmodule
npm run test:integration # Integrationstests
npm run test:storage   # Tests des Speichersystems
npm run test:esm       # ESM-Tests (Ordner tests-esm/, Jest vm-modules)
npm run test:verbose   # Tests mit detaillierter Ausgabe
npm run test:pwa-offline # PWA-Offline-Test (erfordert Puppeteer), nach `npm run serve`

# Analyse und Wartung
npm run analyze:jsdoc  # Analyse der Dokumentation
npm run improve:jsdoc  # Automatische JSDoc-Verbesserung
npm run audit:mobile   # Tests zur mobilen Reaktionsfähigkeit
npm run audit:accessibility # Barrierefreiheitstests
npm run dead-code      # Erkennung von ungenutztem Code
npm run analyze:globals # Analyse globaler Variablen
npm run analyze:dependencies # Analyse der Abhängigkeitsnutzung
npm run verify:cleanup # Kombinierte Analyse (dead code + globals)

# Asset-Management
npm run assets:generate    # Responsive Bilder generieren
npm run assets:backgrounds # Hintergründe in WebP konvertieren
npm run assets:analyze     # Analyse der responsiven Assets
npm run assets:diff        # Vergleich der Assets

# Internationalisierung
npm run i18n:verify    # Konsistenz der Übersetzungsschlüssel überprüfen
npm run i18n:unused    # Ungenutzte Übersetzungsschlüssel auflisten
npm run i18n:compare   # Übersetzungen (en/es) mit fr.json (Referenz) vergleichen

# Build & Auslieferung
npm run build          # Prod-Build (Rollup) + Postbuild (komplettes dist/)
npm run serve:dist     # dist/ unter http://localhost:5000 (oder verfügbarem Port) bereitstellen

# PWA und Service Worker
npm run sw:disable     # Service Worker deaktivieren
npm run sw:fix         # Service Worker-Probleme beheben
```

## 🏗️ Architektur

### Dateistruktur

```
leapmultix/
├── index.html              # Haupteinstiegspunkt
├── js/
│   ├── core/               # Zentrale ES6-Module
│   │   ├── GameMode.js     # Basisklasse der Modi
│   │   ├── GameModeManager.js # Verwaltung der Spielmodi
│   │   ├── storage.js      # LocalStorage-Speicher-API
│   │   ├── audio.js        # Soundverwaltung
│   │   ├── utils.js        # Allgemeine Hilfsprogramme (kanonische Quelle)
│   │   ├── eventBus.js     # Ereignisgesteuerte Kommunikation
│   │   ├── userState.js    # Verwaltung der Benutzersitzung
│   │   ├── mainInit.js     # DOM-ready-Initialisierung
│   │   ├── theme.js        # Themensystem
│   │   ├── userUi.js       # Hilfsprogramme für die Benutzeroberfläche
│   │   ├── parental.js     # Kindersicherung
│   │   ├── adventure-data.js # Daten des Abenteuermodus
│   │   ├── mult-stats.js   # Multiplikationsstatistiken
│   │   ├── challenge-stats.js # Herausforderungsstatistiken
│   │   └── daily-challenge.js # Verwaltung der täglichen Herausforderungen
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
│   │   ├── arcade-common.js, arcade-utils.js # Geteilte Hilfsprogramme
│   │   ├── arcade-message.js, arcade-points.js # UI-Komponenten
│   │   └── arcade-scores.js # Punkteverwaltung
│   ├── multimiam/          # Pac-Man-Spiel (zerlegte Architektur)
│   │   ├── multimiam.js    # Hauptcontroller
│   │   ├── multimiam-engine.js # Spiel-Engine (15 KB)
│   │   ├── multimiam-renderer.js # Rendering-System (9 KB)
│   │   ├── multimiam-controls.js # Steuerungsverwaltung (7 KB)
│   │   ├── multimiam-questions.js # Fragengenerierung (6 KB)
│   │   └── multimiam-ui.js # Oberflächenelemente
│   ├── multisnake.js       # Snake-Spiel (38 KB)
│   ├── navigation/         # Navigationssystem
│   │   ├── slides.js       # Navigation nach Folien (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Tastaturunterstützung
│   ├── ui/                 # Benutzeroberfläche und Feedback
│   │   ├── uiUtils.js      # Hilfsprogramme für die Oberfläche
│   │   ├── ui-feedback.js  # Feedback-Mechanismen
│   │   ├── touch-support.js # Touch-Unterstützung (7 KB)
│   │   ├── virtual-keyboard.js # Virtuelle Tastatur
│   │   ├── coin-display.js, coin-effects.js # Währungssystem
│   │   ├── notifications.js # Benachrichtigungssystem
│   │   └── badges.js       # Abzeichensystem
│   ├── media/              # Medienverwaltung
│   │   ├── VideoManager.js # Videowiedergabeverwaltung (12 KB)
│   │   └── responsive-image-loader.js # Laden von Bildern (9 KB)
│   ├── orchestration/      # Orchestrierung und Laden
│   │   ├── mode-orchestrator.js # Moduswechsel
│   │   ├── lazy-loader.js  # Dynamisches Laden (10 KB)
│   │   └── game-cleanup.js # Zustandsbereinigung
│   ├── utils/              # Hilfsprogramme
│   │   ├── utils-es6.js    # Hauptaggregator (5 KB)
│   │   ├── main-helpers.js # Helfer der Anwendung
│   │   ├── helpers.js      # Legacy-Helferfunktionen
│   │   ├── stats-utils.js  # Statistik-Hilfsprogramme
│   │   ├── difficulty.js   # Schwierigkeitsverwaltung
│   │   └── questionGenerator.js # Fragengenerierung
│   ├── storage/            # Speicherung und Zustand
│   │   ├── storage.js      # Legacy-Speicher-Wrapper
│   │   └── userManager.js  # Multi-User-Verwaltung (19 KB)
│   ├── i18n/               # Internationalisierung
│   │   ├── i18n.js         # i18n-System
│   │   └── i18n-store.js   # Speicherung der Übersetzungen
│   ├── security/           # Sicherheit und Fehlerbehandlung
│   │   ├── security-utils.js # XSS-Schutz, Sanitisierung
│   │   ├── error-handlers.js # Globale Fehlerbehandlung
│   │   └── logger.js       # Logging-System
│   ├── accessibility/      # Barrierefreiheit
│   │   ├── accessibility.js # Barrierefreiheitsfunktionen
│   │   └── speech.js       # Unterstützung für Sprachsynthese
│   ├── integration/        # Integration und Analytik
│   │   ├── plausible-init.js # Plausible-Analytik
│   │   ├── cache-updater.js # Cache-Verwaltung (10 KB)
│   │   └── imports.js      # Import-Hilfsprogramme
│   ├── main-es6.js         # ES6-Einstiegspunkt
│   ├── main.js             # Haupt-Orchestrator
│   ├── bootstrap.js        # Konfiguration der ES6-Event-Handler
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
│   ├── compare-translations.cjs # Vergleich der Übersetzungen
│   └── cleanup-i18n-keys.cjs # Bereinigung der i18n-Schlüssel
└── dist/                   # Produktions-Build (generiert)
```

### Technische Architektur

**Moderne ES6-Module**: Das Projekt verwendet eine modulare Architektur mit nativen ES6-Klassen und Importen/Exporten.

**Wiederverwendbare Komponenten**: Die Benutzeroberfläche ist mit zentralisierten UI-Komponenten (TopBar, InfoBar, Dashboard, Customization) aufgebaut.

**Lazy Loading**: Intelligentes Laden von Modulen bei Bedarf über `lazy-loader.js` zur Optimierung der anfänglichen Leistung.

**Einheitliches Speichersystem**: Zentralisierte API zur Persistenz von Benutzerdaten über LocalStorage mit Fallbacks.

**Zentralisierte Audioverwaltung**: Soundsteuerung mit mehrsprachiger Unterstützung und benutzerspezifischen Einstellungen.

**Event Bus**: Entkoppelte ereignisgesteuerte Kommunikation zwischen Komponenten für eine wartbare Architektur.

**Folienbasierte Navigation**: Navigationssystem basierend auf nummerierten Folien (slide0, slide1, etc.) mit `goToSlide()`.

**Sicherheit**: XSS-Schutz und Sanitisierung über `security-utils.js` für alle DOM-Manipulationen.

## 🎯 Detaillierte Spielmodi

### Entdeckungsmodus

Visuelle Erkundungsoberfläche der Multiplikationstabellen mit:

- Interaktiver Visualisierung von Multiplikationen
- Animationen und Merkhilfen
- Pädagogisches Drag-and-Drop
- Freier Fortschritt pro Tabelle

### Quizmodus

Multiple-Choice-Fragen mit:

- 10 Fragen pro Sitzung
- Adaptiver Fortschritt je nach Erfolg
- Virtuelles Ziffernfeld
- Streak-System (Serie richtiger Antworten)

### Herausforderungsmodus

Rennen gegen die Zeit mit:

- 3 Schwierigkeitsgraden (Anfänger, Mittel, Schwer)
- Zeitbonus für richtige Antworten
- Lebenssystem
- Rangliste der besten Ergebnisse

### Abenteuermodus

Narrativer Fortschritt mit:

- 12 freischaltbaren thematischen Levels
- Interaktive Karte mit visuellem Fortschritt
- Immersive Geschichte mit Charakteren
- Sternen- und Belohnungssystem

### Arcade-Minispiele

Jedes Minispiel bietet:

- Schwierigkeitsauswahl und Personalisierung
- Lebens- und Punktesystem
- Tastatur- und Touch-Steuerung
- Individuelle Ranglisten pro Benutzer

## 🛠️ Entwicklung

### Entwicklungs-Workflow

**WICHTIG: Niemals direkt auf main committen**

Das Projekt verwendet einen auf Feature-Branches basierenden Workflow:

1. **Einen Branch erstellen**:
   ```bash
   git checkout -b feat/feature-name
   # oder
   git checkout -b fix/bug-name
   ```

2. **Entwickeln und testen**:
   ```bash
   npm run format:check  # IMMER zuerst die Formatierung überprüfen
   npm run format        # Bei Bedarf formatieren
   npm run lint          # Codequalität überprüfen
   npm run test          # Tests ausführen
   npm run test:coverage # Abdeckung überprüfen
   ```

3. **Auf dem Branch committen**:
   ```bash
   git add .
   git commit -m "feat: Beschreibung der Funktionalität"
   ```

4. **Pushen und einen Pull Request erstellen**:
   ```bash
   git push -u origin feat/feature-name
   ```

**Commit-Stil**: Prägnante Nachrichten im Imperativ (z.B. "Fix arcade init errors", "Refactor cache updater")

**Quality Gate**: Sicherstellen, dass `npm run lint`, `npm test` und `npm run test:coverage` vor jedem Commit erfolgreich sind

### Komponentenarchitektur

**GameMode (Basisklasse)**: Alle Modi erben von einer gemeinsamen Klasse mit standardisierten Methoden.

**GameModeManager**: Zentralisierte Orchestrierung des Starts und der Verwaltung der Modi.

**UI-Komponenten**: TopBar, InfoBar, Dashboard und Customization bieten eine konsistente Benutzeroberfläche.

**Lazy Loading**: Module werden bei Bedarf geladen, um die anfängliche Leistung zu optimieren.

**Event Bus**: Entkoppelte Kommunikation zwischen Komponenten über das Ereignissystem.

### Tests

Das Projekt umfasst eine vollständige Testsuite:

- Unit-Tests der Kernmodule
- Integrationstests der Komponenten
- Tests der Spielmodi
- Automatisierte Code-Abdeckung

```bash
npm test              # Alle Tests (CJS)
npm test:core         # Tests der Kernmodule
npm test:integration  # Integrationstests
npm test:coverage     # Abdeckungsbericht
npm run test:esm      # ESM-Tests (z.B. components/dashboard) über vm-modules
```

### Produktions-Build

- **Rollup**: Bündelt `js/main-es6.js` in ESM mit Code-Splitting und Sourcemaps
- **Terser**: Automatische Minifizierung zur Optimierung
- **Post-Build**: Kopiert `css/` und `assets/`, die Favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` und schreibt `dist/index.html` auf die gehashte Eingabedatei um (z.B. `main-es6-*.js`)
- **Endgültiger Ordner**: `dist/` ist bereit, statisch bereitgestellt zu werden

```bash
npm run build      # generiert dist/
npm run serve:dist # stellt dist/ bereit (Port 5000)
```

### Kontinuierliche Integration

**GitHub Actions**: Automatisierte Pipeline in `.github/workflows/ci.yml`

Die CI/CD-Pipeline wird bei jedem Push und Pull Request automatisch ausgeführt:

**Haupt-Jobs**:

1. **build-test**: Hauptvalidierungsjob
   - Installation der Abhängigkeiten: `npm ci`
   - Überprüfung der Formatierung: `npm run format:check`
   - Statische Analyse: `npm run lint`
   - Unit-Tests: `npm run test`
   - Sicherheitsaudit: `npm audit`
   - Erstellung des Abdeckungsartefakts

2. **accessibility**: Barrierefreiheitsaudit (nicht blockierend)
   - Führt `npm run audit:accessibility` aus
   - Erstellt einen WCAG 2.1 AA-Barrierefreiheitsbericht

3. **test-esm**: Tests der ES6-Module
   - Führt `npm run test:esm` mit Jest VM-Modulen aus
   - Validiert ES6-Importe/Exporte

4. **lighthouse**: Leistungs-Audit (nicht blockierend)
   - Mobiles Leistungs-Audit
   - Erstellung von Lighthouse-Berichtsartefakten
   - Core Web Vitals-Metriken

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
- Übersetzungen: Stale-while-revalidate für Hintergrundaktualisierungen
- JS/CSS: Network-first, um immer die neueste Version bereitzustellen
- Automatische Versionsverwaltung über `cache-updater.js`

**Manifest** (`manifest.json`):
- SVG- und PNG-Symbole für alle Geräte
- Installation auf Mobilgeräten möglich (Zum Startbildschirm hinzufügen)
- Standalone-Konfiguration für eine App-ähnliche Erfahrung
- Unterstützung für Themen und Farben

**Offline-Modus lokal testen**:

1. Entwicklungsserver starten:
   ```bash
   npm run serve
   ```
   Öffnen Sie `http://localhost:8080` (oder den angezeigten Port)

2. Manuell testen:
   - Netzwerk in den DevTools trennen (Registerkarte Netzwerk → Offline)
   - Seite aktualisieren → `offline.html` wird angezeigt

3. Automatisierter Test (Puppeteer erforderlich):
   ```bash
   npm run test:pwa-offline
   ```

**Skripte zur Verwaltung des Service Workers**:
```bash
npm run sw:disable  # Service Worker deaktivieren
npm run sw:fix      # Cache-Probleme beheben
```

### Qualitätsstandards

**Code-Qualitätswerkzeuge**:
- **ESLint**: Moderne Konfiguration mit Flat-Config (`eslint.config.js`), ES2022-Unterstützung
- **Prettier**: Automatische Code-Formatierung (`.prettierrc`)
- **Stylelint**: CSS-Validierung (`.stylelintrc.json`)
- **JSDoc**: Automatische Dokumentation von Funktionen mit Abdeckungsanalyse

**Wichtige Code-Regeln**:
- Ungenutzte Variablen und Parameter entfernen (`no-unused-vars`)
- Spezifische Fehlerbehandlung verwenden (keine leeren catch-Blöcke)
- `innerHTML` zugunsten von `security-utils.js`-Funktionen vermeiden
- Kognitive Komplexität < 15 für Funktionen beibehalten
- Komplexe Funktionen in kleinere Helfer extrahieren

**Sicherheit**:
- **XSS-Schutz**: Verwenden Sie die Funktionen von `security-utils.js`:
  - `appendSanitizedHTML()` anstelle von `innerHTML`
  - `createSafeElement()` zum Erstellen sicherer Elemente
  - `setSafeMessage()` für Textinhalte
- **Externe Skripte**: Attribut `crossorigin="anonymous"` obligatorisch
- **Eingabevalidierung**: Externe Daten immer bereinigen
- **Content Security Policy**: CSP-Header zur Einschränkung von Skriptquellen

**Barrierefreiheit**:
- WCAG 2.1 AA-Konformität
- Vollständige Tastaturnavigation
- Geeignete ARIA-Rollen und Labels
- Konforme Farbkontraste

**Leistung**:
- Lazy Loading von Modulen über `lazy-loader.js`
- CSS-Optimierungen und responsive Assets
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
- ARIA-Rollen und Labels für Bildschirmleser
- Konforme Farbkontraste
- Unterstützung von Hilfstechnologien

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
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### i18n-Verwaltungsskripte

**`npm run i18n:verify`** - Konsistenz der Übersetzungsschlüssel überprüfen

**`npm run i18n:unused`** - Ungenutzte Übersetzungsschlüssel auflisten

**`npm run i18n:compare`** - Übersetzungsdateien mit fr.json (Referenz) vergleichen

Dieses Skript (`scripts/compare-translations.cjs`) stellt die Synchronisation aller Sprachdateien sicher:

**Funktionen:**
- Erkennung fehlender Schlüssel (in fr.json vorhanden, aber in anderen Sprachen fehlend)
- Erkennung zusätzlicher Schlüssel (in anderen Sprachen vorhanden, aber nicht in fr.json)
- Identifizierung leerer Werte (`""`, `null`, `undefined`, `[]`)
- Überprüfung der Typkonsistenz (String vs. Array)
- Abflachen verschachtelter JSON-Strukturen in Punktnotation (z.B. `arcade.multiMemory.title`)
- Erstellung eines detaillierten Konsolenberichts
- Speichern des JSON-Berichts in `docs/translations-comparison-report.json`

**Beispielausgabe:**

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

**Übersetzungsabdeckung:**

- Vollständige Benutzeroberfläche
- Spielanleitungen
- Fehler- und Feedback-Nachrichten
- Beschreibungen und kontextbezogene Hilfe
- Narrativer Inhalt des Abenteuermodus
- Barrierefreiheits- und ARIA-Labels

## 📊 Datenspeicherung

### Benutzerdaten

- Profile und Einstellungen
- Fortschritt pro Spielmodus
- Punkte und Statistiken der Arcade-Spiele
- Anpassungseinstellungen

### Technische Funktionen

- Lokaler Speicher (localStorage) mit Fallbacks
- Isolierung der Daten pro Benutzer
- Automatische Speicherung des Fortschritts
- Automatische Migration alter Daten

## 🐛 Ein Problem melden

Probleme können über die GitHub-Issues gemeldet werden. Bitte fügen Sie hinzu:

- Detaillierte Beschreibung des Problems
- Schritte zur Reproduktion
- Browser und Version
- Screenshots, falls relevant

## 💝 Das Projekt unterstützen

**[☕ Über PayPal spenden](https://paypal.me/jls)**

## 📄 Lizenz

Dieses Projekt steht unter der AGPL v3-Lizenz. Weitere Details finden Sie in der `LICENSE`-Datei.

---

_LeapMultix - Moderne Lernanwendung zum Erlernen der Multiplikationstabellen_

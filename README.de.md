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

<!-- Abzeichen (nach der GitHub-Migration <owner>/<repo> aktualisieren) -->

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

LeapMultix ist eine moderne, interaktive und lehrreiche Webanwendung für Kinder (8–12 Jahre), um das Einmaleins zu meistern. Die Anwendung bietet **4 klassische Spielmodi** und **4 Arcade-Minispiele** in einer intuitiven, zugänglichen und mehrsprachigen Benutzeroberfläche.

**Entwickelt von:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## ✨ Funktionen

### 🎮 Spielmodi

- **Entdeckermodus**: Visuelle und interaktive Erkundung des Einmaleins.
- **Quizmodus**: Multiple-Choice-Fragen mit adaptivem Fortschritt.
- **Herausforderungsmodus**: Ein Wettlauf gegen die Zeit mit verschiedenen Schwierigkeitsgraden.
- **Abenteuermodus**: Narrativer Fortschritt durch Level mit einer interaktiven Karte.

### 🕹️ Arcade-Minispiele

- **MultiInvaders**: Ein lehrreiches Space Invaders - Zerstöre die falschen Antworten.
- **MultiMiam**: Ein mathematisches Pac-Man - Sammle die richtigen Antworten.
- **MultiMemory**: Ein Memory-Spiel - Ordne Multiplikationen ihren Ergebnissen zu.
- **MultiSnake**: Ein lehrreiches Snake - Wachse, indem du die richtigen Zahlen isst.

### 🌍 Übergreifende Funktionen

- **Mehrbenutzerfähig**: Verwaltung individueller Profile mit gespeichertem Fortschritt.
- **Mehrsprachig**: Unterstützung für Französisch, Englisch und Spanisch.
- **Anpassung**: Avatare, Farbthemen, Hintergründe.
- **Barrierefreiheit**: Tastaturnavigation, Touch-Unterstützung, WCAG 2.1 AA-Konformität.
- **Mobil responsiv**: Optimierte Benutzeroberfläche für Tablets und Smartphones.
- **Fortschrittssystem**: Punktzahlen, Abzeichen, tägliche Herausforderungen.

## 🚀 Schnellstart

### Voraussetzungen

- Node.js (Version 16 oder höher)
- Ein moderner Webbrowser

### Installation

```bash
# Das Projekt klonen
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Abhängigkeiten installieren
npm install

# Den Entwicklungsserver starten (Option 1)
npm run serve
# Die Anwendung ist unter http://localhost:8080 (oder dem nächsten verfügbaren Port) erreichbar

# Oder mit Python (Option 2)
python3 -m http.server 8000
# Die Anwendung ist unter http://localhost:8000 erreichbar
```

### Verfügbare Skripte

```bash
# Entwicklung
npm run serve          # Lokaler Server
npm run lint           # Code-Überprüfung
npm run test           # Alle Tests ausführen (CJS)
npm run test:coverage  # Tests mit Abdeckung
npm run test:esm       # ESM-Tests (tests-esm/ Ordner, Jest vm-modules)
npm run test:pwa-offline # PWA-Offline-Test (erfordert Puppeteer), nach `npm run serve`

# Analyse und Wartung
npm run analyze:jsdoc  # Dokumentationsanalyse
npm run improve:jsdoc  # Automatische JSDoc-Verbesserung
npm run audit:mobile   # Tests zur mobilen Reaktionsfähigkeit
npm run audit:accessibility # Barrierefreiheitstests
npm run dead-code      # Erkennung von totem Code
npm run analyze:globals # Analyse globaler Variablen
npm run analyze:dependencies # Analyse der Abhängigkeitsnutzung
npm run assets:analyze # Analyse responsiver Assets
npm run assets:diff    # Vergleich von Assets
npm run i18n:compare   # Übersetzungen (en/es) mit fr.json (Referenz) vergleichen

# Build & Auslieferung
npm run build          # Produktions-Build (Rollup) + Post-Build (vollständiges dist/)
npm run serve:dist     # dist/ unter http://localhost:5000 (oder verfügbarem Port) bereitstellen
```

## 🏗️ Architektur

### Dateistruktur

```
leapmultix/
├── index.html              # Haupteinstiegspunkt
├── js/
│   ├── core/               # Zentrale ES6-Module
│   │   ├── GameMode.js     # Basisklasse für Spielmodi
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # Speicher-API
│   │   ├── audio.js        # Soundverwaltung
│   │   └── utils.js        # Allgemeine Dienstprogramme
│   ├── components/         # Wiederverwendbare UI-Komponenten
│   │   ├── topBar.js       # Navigationsleiste
│   │   ├── infoBar.js      # Spielinformationsleisten
│   │   ├── dashboard.js    # Benutzer-Dashboard
│   │   └── customization.js # Anpassungsoberfläche
│   ├── modes/              # Refaktorisierte Spielmodi
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # Arcade-Minispiele
│   ├── multimiam-*.js      # Pac-Man-Spielmodule
│   ├── multisnake.js       # Lehrreiches Snake-Spiel
│   ├── main-es6.js         # ES6-Einstiegspunkt
│   ├── main.js             # Haupt-Orchestrator
│   ├── lazy-loader.js      # Bedarfsgesteuertes Laden (Lazy Loading)
│   └── utils-es6.js        # ES6-Dienstprogramme
├── css/                    # Modulare Stile
├── assets/                 # Ressourcen
│   ├── images/             # Bilder und Sprites
│   ├── sounds/             # Soundeffekte
│   ├── translations/       # Übersetzungsdateien
│   └── videos/             # Tutorial-Videos
└── tests/                  # Automatisierte Tests
```

### Technische Architektur

**Moderne ES6-Module**: Das Projekt verwendet eine modulare Architektur mit ES6-Klassen und nativen Importen/Exporten.

**Wiederverwendbare Komponenten**: Die Benutzeroberfläche ist mit zentralisierten UI-Komponenten (TopBar, InfoBar, Dashboard) aufgebaut.

**Lazy Loading**: Intelligentes Laden von Modulen bei Bedarf zur Leistungsoptimierung.

**Einheitliches Speichersystem**: Zentralisierte API für die Persistenz von Benutzerdaten.

**Zentralisierte Audioverwaltung**: Soundsteuerung mit mehrsprachiger Unterstützung und benutzerspezifischen Einstellungen.

## 🎯 Detaillierte Spielmodi

### Entdeckermodus

Visuelle Erkundungsoberfläche für das Einmaleins mit:

- Interaktiver Visualisierung von Multiplikationen
- Animationen und Gedächtnisstützen
- Lehrreichem Drag-and-Drop
- Freiem Fortschritt pro Tabelle

### Quizmodus

Multiple-Choice-Fragen mit:

- 10 Fragen pro Sitzung
- Adaptivem Fortschritt basierend auf dem Erfolg
- Virtuellem Ziffernblock
- Streak-System (Serie richtiger Antworten)

### Herausforderungsmodus

Ein Wettlauf gegen die Zeit mit:

- 3 Schwierigkeitsgraden (Anfänger, Mittel, Schwer)
- Zeitbonus für richtige Antworten
- Lebenssystem
- Highscore-Bestenliste

### Abenteuermodus

Narrativer Fortschritt mit:

- 12 freischaltbaren thematischen Levels
- Interaktiver Karte mit visuellem Fortschritt
- Immersiver Geschichte mit Charakteren
- Sternen- und Belohnungssystem

### Arcade-Minispiele

Jedes Minispiel bietet:

- Wahl des Schwierigkeitsgrads und Anpassung
- Lebens- und Punktesystem
- Tastatur- und Touch-Steuerung
- Individuelle Bestenlisten pro Benutzer

## 🛠️ Entwicklung

### Komponentenarchitektur

**GameMode (Basisklasse)**: Alle Modi erben von einer gemeinsamen Klasse mit standardisierten Methoden.

**GameModeManager**: Zentralisierte Orchestrierung zum Starten und Verwalten der Modi.

**UI-Komponenten**: TopBar, InfoBar, Dashboard und Customization bieten eine konsistente Benutzeroberfläche.

**Lazy Loading**: Module werden bei Bedarf geladen, um die anfängliche Leistung zu optimieren.

### Tests

Das Projekt umfasst eine umfassende Testsuite:

- Unit-Tests für Kernmodule
- Integrationstests für Komponenten
- Spielmodus-Tests
- Automatisierte Code-Abdeckung

```bash
npm test              # Alle Tests (CJS)
npm test:core         # Kernmodul-Tests
npm test:integration  # Integrationstests
npm test:coverage     # Abdeckungsbericht
npm run test:esm      # ESM-Tests (z. B. components/dashboard) über vm-modules
```

### Produktions-Build

- **Rollup**: Bündelt `js/main-es6.js` in ESM mit Code-Splitting und Sourcemaps.
- **Terser**: Automatische Minifizierung zur Optimierung.
- **Post-Build**: Kopiert `css/` und `assets/`, Favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` und schreibt `dist/index.html` neu, um auf die gehashte Eintragsdatei zu verweisen (z. B. `main-es6-*.js`).
- **Endgültiger Ordner**: `dist/` ist bereit, statisch bereitgestellt zu werden.

```bash
npm run build      # erzeugt dist/
npm run serve:dist # stellt dist/ bereit (Port 5000)
```

### Kontinuierliche Integration

**GitHub Actions**: `.github/workflows/ci.yml`

- **build-test**: `npm ci`, `lint`, `test`, `audit` + Abdeckungsartefakt.
- **accessibility**: `npm run audit:accessibility` (nicht blockierend).
- **test-esm**: `npm run test:esm` mit VM-Modulen.
- **lighthouse**: Mobile Leistungsprüfung (nicht blockierend), Berichte als Artefakte.

### PWA (offline und Installation)

- **Service Worker**: Netzwerk-zuerst-Strategie mit Offline-Fallback; Bilder mit Cache-zuerst-Strategie; Übersetzungen mit stale-while-revalidate; JS/CSS mit Netzwerk-zuerst.
- **Manifest**: SVG/PNG-Symbole; Installation auf Mobilgeräten möglich.
- **Offline lokal testen**:
  1. `npm run serve` ausführen und `http://localhost:8080` (oder den angezeigten Port) öffnen.
  2. Das Netzwerk trennen und die Seite aktualisieren → `offline.html` wird angezeigt.
  3. Automatisierter Test (erfordert Puppeteer): `npm run test:pwa-offline`.

### Qualitätsstandards

- **ESLint**: JavaScript-Code-Validierung.
- **Prettier**: Automatische Formatierung.
- **JSDoc**: Automatische Funktionsdokumentation.
- **Barrierefreiheit**: WCAG 2.1 AA-Konformität.
- **Leistung**: Lazy Loading, CSS-Optimierungen.

## 📱 Kompatibilität

### Unterstützte Browser

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Geräte

- **Desktop**: Tastatur- und Maussteuerung.
- **Tablets**: Optimierte Touch-Oberfläche.
- **Smartphones**: Adaptives responsives Design.

### Barrierefreiheit

- Vollständige Tastaturnavigation (Tab, Pfeile, Esc).
- ARIA-Rollen und Labels für Bildschirmleser.
- Konforme Farbkontraste.
- Unterstützung für Hilfstechnologien.

## 🌍 Lokalisierung

Volle mehrsprachige Unterstützung:

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

**Verwaltungsskripte:**

```bash
npm run i18n:verify  # Auf fehlende/inkonsistente Schlüssel prüfen
npm run i18n:unused  # Nicht verwendete Schlüssel auflisten
npm run i18n:compare   # Übersetzungen (en/es) mit fr.json (Referenz) vergleichen
```

**Übersetzungsabdeckung:**

- Vollständige Benutzeroberfläche
- Spielanleitungen
- Fehler- und Feedback-Meldungen
- Beschreibungen und kontextbezogene Hilfe

## 📊 Datenspeicherung

### Benutzerdaten

- Profile und Einstellungen
- Fortschritt pro Spielmodus
- Arcade-Spielstände und Statistiken
- Anpassungseinstellungen

### Technische Funktionen

- Lokaler Speicher (localStorage) mit Fallbacks.
- Benutzerdatenisolierung.
- Automatische Fortschrittsspeicherung.
- Automatische Migration alter Daten.

## 🐛 Ein Problem melden

Probleme können über GitHub-Issues gemeldet werden. Bitte fügen Sie hinzu:

- Detaillierte Beschreibung des Problems.
- Schritte zur Reproduktion.
- Browser und Version.
- Screenshots, falls relevant.

## 💝 Das Projekt unterstützen

**[☕ Über PayPal spenden](https://paypal.me/jls)**

## 📄 Lizenz

Dieses Projekt ist unter der AGPL v3-Lizenz lizenziert. Weitere Details finden Sie in der `LICENSE`-Datei.

---

_LeapMultix - Eine moderne Bildungsanwendung zum Erlernen des Einmaleins._

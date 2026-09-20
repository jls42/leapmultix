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

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Lizenz: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy-Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality-Gate-Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Zuverlässigkeitsbewertung](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Sicherheitsbewertung](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Wartbarkeitsbewertung](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Technische Schulden](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Fehler](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Schwachstellen](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Duplizierte Zeilen (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Codezeilen](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## Inhaltsverzeichnis

- [Beschreibung](#beschreibung)
- [Überblick](#-überblick)
- [Funktionen](#-funktionen)
- [Schnellstart](#-schnellstart)
- [Architektur](#-architektur)
- [Detaillierte Spielmodi](#-detaillierte-spielmodi)
- [Entwicklung](#-entwicklung)
- [Kompatibilität](#-kompatibilität)
- [Lokalisierung](#-lokalisierung)
- [Datenspeicherung](#-datenspeicherung)
- [Problem melden](#-problem-melden)
- [Lizenz](#-lizenz)

## Beschreibung

LeapMultix ist eine interaktive Lern-Webanwendung für Kinder von 6 bis 12 Jahren, mit der sie die vier Grundrechenarten beherrschen lernen: Multiplikation (×), Addition (+), Subtraktion (−) und Division (÷). Sie bietet **5 Spielmodi** und **4 Arcade-Minispiele** in einer intuitiven, barrierefreien und mehrsprachigen Benutzeroberfläche.

**Unterstützung mehrerer Rechenarten:** Alle fünf Modi unterstützen die vier Rechenarten. Die Auswahl erfolgt auf dem Startbildschirm und gilt für den gesamten Ablauf.

**Entwickelt von:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## 📸 Überblick

### Die Bildschirme

|                                                                                                                                                          |                                                                                                                                        |
| :------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: |
|                                          ![Bildschirm „Wer spielt?“: Profilauswahl](docs/media/01-accueil.webp)                                          |                             ![Hauptmenü: Auswahl der Rechenart und der fünf Modi](docs/media/02-menu.webp)                             |
|                                            **Wer spielt?** — ein Profil pro Kind, mit Avatar und Fortschritt.                                            |                     **Das Menü** — hier wird die Rechenart ausgewählt, danach stehen die fünf Modi zur Verfügung.                      |
|                                 ![Entdeckungsmodus: die 4er-Reihe als Punkte dargestellt](docs/media/03-decouverte.webp)                                 |                        ![Quizmodus: falsche Antwort in Rot, richtige Antwort in Grün](docs/media/04-quiz.webp)                         |
|           **Entdeckung** — jede Gleichung wird mit Punkten, Sprüngen oder Zählen dargestellt, zusammen mit dem Trick für die jeweilige Reihe.            | **Quiz** — die Auswahl des Kindes bleibt neben der richtigen Antwort sichtbar, und die Erklärung erläutert die Berechnung ausführlich. |
|                                     ![Herausforderungsmodus: Countdown und aktuelle Serie](docs/media/05-defi.webp)                                      |                   ![Abenteuermodus: Karte der zehn Level, die folgenden sind gesperrt](docs/media/06-aventure.webp)                    |
| **Herausforderung** — Wettlauf gegen die Zeit. Bei einem Fehler wird die Stoppuhr angehalten, damit genügend Zeit bleibt, die richtige Antwort zu lesen. |                     **Abenteuer** — zehn Level, die nacheinander im Austausch gegen Sterne freigeschaltet werden.                      |
|                                              ![Arcade-Menü: die vier Minispiele](docs/media/07-arcade.webp)                                              |                           ![Dashboard: Sterne pro Reihe und Statistiken](docs/media/08-tableau-de-bord.webp)                           |
|                              **Arcade** — vier Minispiele mit einstellbarem Schwierigkeitsgrad und Auswahl des Raumschiffs.                              |                          **Dashboard** — Sterne pro Reihe, zu wiederholende Reihen und Punktzahlen pro Modus.                          |
|                               ![Personalisierung: Avatare, Designs, Barrierefreiheit](docs/media/09-personnalisation.webp)                               |                                                                                                                                        |
|                                   **Personalisierung** — Avatar, Farbdesign, Textgröße, hoher Kontrast und Elterncode.                                   |                                                                                                                                        |

### Die Arcade-Minispiele

Vier Spiele stellen dieselbe Frage — sie wird oberhalb des Spielfelds
zusammen mit der verbleibenden Zeit und den Leben angezeigt — erfordern jedoch jedes Mal eine andere
Aktion.

|                                                                                                                                                    |                                                                                                                       |
| :------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
|                ![MultiInvaders: Monster mit Zahlen und ein Raumschiff am unteren Bildschirmrand](docs/media/10-multiinvaders.webp)                 |        ![MultiMiam: ein Labyrinth, in dem Punkte die möglichen Antworten tragen](docs/media/11-multimiam.webp)        |
| **MultiInvaders** — auf die falschen Antworten schießen und die richtige verschonen: Hinter ihr verbirgt sich ein Freund, der befreit werden muss. | **MultiMiam** — durch das Labyrinth laufen, um das richtige Ergebnis einzusammeln, und dabei den Monstern ausweichen. |
|            ![MultiMemory: ein Kartenraster, zwei umgedrehte Karten zeigen eine Rechnung und eine Zahl](docs/media/12-multimemory.webp)             |           ![MultiSnake: eine Schlange und nummerierte Äpfel auf einer Wiese](docs/media/13-multisnake.webp)           |
|                     **MultiMemory** — sich merken und herausfinden, welche Karte das Ergebnis der aufgedeckten Rechnung trägt.                     |           **MultiSnake** — wachsen, indem die richtigen Zahlen gefressen und alle anderen vermieden werden.           |

## ✨ Funktionen

### 🎮 Spielmodi

- **Entdeckungsmodus**: Visuelle und interaktive Erkundung, angepasst an jede Rechenart
- **Quizmodus**: Multiple-Choice-Fragen mit Unterstützung der 4 Rechenarten (×, +, −, ÷) und adaptivem Fortschritt
- **Herausforderungsmodus**: Wettlauf gegen die Zeit mit den 4 Rechenarten (×, +, −, ÷) und verschiedenen Schwierigkeitsgraden
- **Abenteuermodus**: Narrativer Fortschritt durch Level mit Unterstützung der 4 Rechenarten

### 🕹️ Arcade-Minispiele

- **MultiInvaders**: Pädagogisches Space Invaders – die falschen Antworten zerstören
- **MultiMiam**: Mathematisches Pac-Man – die richtigen Antworten einsammeln
- **MultiMemory**: Gedächtnisspiel – Rechenaufgaben und Ergebnisse einander zuordnen
- **MultiSnake**: Pädagogisches Snake – durch das Fressen der richtigen Zahlen wachsen

### ➕ Unterstützung mehrerer Rechenarten

LeapMultix bietet in **allen Modi** ein umfassendes Training der 4 Grundrechenarten:

| Modus           | ×   | +   | −   | ÷   |
| --------------- | --- | --- | --- | --- |
| Quiz            | ✅  | ✅  | ✅  | ✅  |
| Herausforderung | ✅  | ✅  | ✅  | ✅  |
| Entdeckung      | ✅  | ✅  | ✅  | ✅  |
| Abenteuer       | ✅  | ✅  | ✅  | ✅  |
| Arcade          | ✅  | ✅  | ✅  | ✅  |

### 🌍 Übergreifende Funktionen

- **Mehrere Benutzer**: Verwaltung einzelner Profile mit gespeichertem Fortschritt
- **Mehrsprachig**: Unterstützung für Französisch, Englisch und Spanisch
- **Personalisierung**: Avatare, Farbdesigns und Hintergründe
- **Barrierefreiheit**: Tastaturnavigation, Touch-Unterstützung und Konformität mit WCAG 2.1 AA
- **Mobile Responsive**: Für Tablets und Smartphones optimierte Benutzeroberfläche
- **Fortschrittssystem**: Punktzahlen, Abzeichen und tägliche Herausforderungen

## 🚀 Schnellstart

### Voraussetzungen

- Node.js (Version 16 oder höher)
- Ein moderner Webbrowser

### Installation

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

### Verfügbare Skripte

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
```

## 🏗️ Architektur

### Dateistruktur

Die JavaScript-Module liegen bis auf drei Ordner **direkt in `js/`**:
`core/`, `components/` und `modes/`. Die Gruppierung erfolgt daher über den
Dateinamen (`arcade-*`, `multimiam-*`, `i18n*` …).

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
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### Technische Architektur

**Moderne ES6-Module**: Das Projekt verwendet eine modulare Architektur mit ES6-Klassen und nativen Imports/Exports.

**Wiederverwendbare Komponenten**: Die Benutzeroberfläche wird mit zentralisierten UI-Komponenten aufgebaut (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligentes Laden der Module bei Bedarf über `lazy-loader.js`, um die anfängliche Performance zu optimieren.

**Einheitliches Speichersystem**: Zentralisierte API zur Persistierung von Benutzerdaten über LocalStorage mit Fallbacks.

**Zentralisierte Audioverwaltung**: Tonsteuerung mit mehrsprachiger Unterstützung und benutzerspezifischen Einstellungen.

**Event Bus**: Entkoppelte ereignisbasierte Kommunikation zwischen Komponenten für eine wartbare Architektur.

**Slide-basierte Navigation**: Navigationssystem auf Grundlage nummerierter Slides (slide0, slide1 usw.) mit `goToSlide()`.

**Sicherheit**: XSS-Schutz und Sanitization über `security-utils.js` für sämtliche DOM-Manipulationen.

## 🎯 Detaillierte Spielmodi

### Entdeckungsmodus

Benutzeroberfläche zur visuellen Erkundung der Einmaleinsreihen mit:

- Interaktiver Visualisierung der Multiplikationen
- Animationen und Merkhilfen
- Pädagogischem Drag-and-drop
- Freiem Fortschritt pro Reihe

### Quizmodus

Multiple-Choice-Fragen mit:

- 10 Fragen pro Sitzung
- Adaptivem Fortschritt entsprechend den Erfolgen
- Virtuellem Ziffernblock
- Streak-System (Serie richtiger Antworten)

### Herausforderungsmodus

Wettlauf gegen die Zeit mit:

- 3 Schwierigkeitsgraden (Anfänger, Mittel, Schwierig)
- Zeitbonus für richtige Antworten
- Lebenssystem
- Bestenliste

### Abenteuermodus

Narrativer Fortschritt mit:

- 10 freischaltbaren Themenleveln
- Interaktiver Karte mit visueller Fortschrittsanzeige
- Fesselnder Geschichte mit Charakteren
- System aus Sternen und Belohnungen

### Arcade-Minispiele

Jedes Minispiel bietet:

- Auswahl des Schwierigkeitsgrads und Personalisierung
- Lebens- und Punktesystem
- Tastatur- und Touch-Steuerung
- Individuelle Bestenlisten pro Benutzer

## 🛠️ Entwicklung

### Entwicklungsworkflow

**Niemals direkt auf main committen.** Das Projekt arbeitet mit
Feature-Branches.

**1. Einen Branch erstellen**, `feat/` für ein Feature, `fix/` für einen Bugfix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Entwickeln und überprüfen.** Die Formatierung kommt zuerst: Die CI lehnt sie ab,
noch bevor die Tests ausgeführt werden.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Auf dem Branch committen** und ihn anschließend pushen:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Einen Pull Request öffnen** und die Analysen abwarten: verify, Codacy,
CodeFactor und SonarCloud. Vor dem Mergen werden Fehler behoben, bis alle Prüfungen grün sind.

**Commit-Stil**: Prägnante Nachrichten im Imperativ (z. B. „Fix arcade init errors“, „Refactor cache updater“)

**Quality Gate**: Vor jedem Commit sicherstellen, dass `npm run lint`, `npm test` und `npm run test:coverage` erfolgreich durchlaufen

### Komponentenarchitektur

**GameMode (Basisklasse)**: Alle Modi erben von einer gemeinsamen Klasse mit standardisierten Methoden.

**GameModeManager**: Zentralisierte Orchestrierung des Starts und der Verwaltung der Modi.

**UI-Komponenten**: TopBar, InfoBar, Dashboard und Customization sorgen für eine konsistente Benutzeroberfläche.

**Lazy Loading**: Die Module werden bei Bedarf geladen, um die anfängliche Performance zu optimieren.

**Event Bus**: Entkoppelte Kommunikation zwischen Komponenten über das Ereignissystem.

### Tests

Das Projekt enthält eine umfassende Testsuite:

- Unit-Tests der Core-Module
- Integrationstests der Komponenten
- Tests der Spielmodi
- Automatisierte Code-Coverage

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Produktions-Build

- **Rollup**: Bündelt `js/main-es6.js` als ESM mit Code-Splitting und Sourcemaps
- **Terser**: Automatische Minifizierung zur Optimierung
- **Post-Build**: Kopiert `css/` und `assets/`, die Favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` und schreibt `dist/index.html` auf die gehashte Einstiegsdatei um (z. B. `main-es6-*.js`)
- **Finaler Ordner**: `dist/`, bereit zur statischen Bereitstellung

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continuous Integration

**GitHub Actions**: `.github/workflows/ci.yml`, wird bei jedem Push auf
`main` und bei jedem Pull Request ausgelöst.

**`verify`** — das blockierende Quality Gate:

- `npm ci`, anschließend `npm run verify` (ESLint, Jest-Tests, Coverage)
- `npm run format:check` (Prettier)

**`seo-report`** — nach `verify`: Lighthouse-Audit der Online-Website, um
die SEO-Metriken langfristig zu verfolgen.

**Externe Analysen**, die an Pull Requests angebunden sind: Codacy, CodeFactor und
SonarCloud. Das SonarCloud-Quality-Gate verlangt für neuen Code die Bewertung A bei Zuverlässigkeit, Sicherheit und
Wartbarkeit.

**Deployment**: `./deploy.sh` synchronisiert die Website mit S3 und invalidiert den
CloudFront-Cache. Das Skript erzeugt bei Bedarf die responsiven Bilder neu, die nicht in git enthalten sind.

### PWA (Progressive Web App)

LeapMultix ist eine vollständige PWA mit Offline-Unterstützung und Installationsmöglichkeit.

**Service Worker** (`sw.js`):

- Navigation: Network-first mit Offline-Fallback auf `offline.html`
- Bilder: Cache-first zur Optimierung der Performance
- Übersetzungen: Stale-while-revalidate für Aktualisierungen im Hintergrund
- JS/CSS: Network-first, damit stets die neueste Version bereitgestellt wird
- Automatische Versionsverwaltung über `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- und PNG-Symbole für alle Geräte
- Installation auf Mobilgeräten möglich (Add to Home Screen)
- Standalone-Konfiguration für ein App-ähnliches Erlebnis
- Unterstützung für Designs und Farben

**Den Offline-Modus lokal testen.** Den Server starten und anschließend
`http://localhost:8080` (oder den angezeigten Port) öffnen:

```bash
npm run serve
```

Manuell: In den Entwicklertools das Netzwerk deaktivieren (Registerkarte Netzwerk,
Offline-Modus) und anschließend die Seite neu laden. `offline.html` muss angezeigt werden.

Automatisch mit Puppeteer:

```bash
npm run test:pwa-offline
```

**Skripte zur Verwaltung des Service Workers**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Qualitätsstandards

**Werkzeuge für Codequalität**:

- **ESLint**: Moderne Konfiguration mit Flat Config (`eslint.config.js`), Unterstützung für ES2022
- **Prettier**: Automatische Codeformatierung (`.prettierrc`)
- **Stylelint**: CSS-Validierung (`.stylelintrc.json`)
- **JSDoc**: Automatische Dokumentation von Funktionen mit Coverage-Analyse

**Wichtige Coderegeln**:

- Nicht verwendete Variablen und Parameter entfernen (`no-unused-vars`)
- Eine spezifische Fehlerbehandlung verwenden (keine leeren catch-Blöcke)
- `innerHTML` zugunsten der Funktionen `security-utils.js` vermeiden
- Die kognitive Komplexität von Funktionen unter 15 halten
- Komplexe Funktionen in kleinere Helper auslagern

**Sicherheit**:

- **XSS-Schutz**: Die Funktionen aus `security-utils.js` verwenden:
  - `appendSanitizedHTML()` anstelle von `innerHTML`
  - `createSafeElement()` zum Erstellen sicherer Elemente
  - `setSafeMessage()` für Textinhalte
- **Externe Skripte**: Attribut `crossorigin="anonymous"` ist verpflichtend
- **Eingabevalidierung**: Externe Daten immer bereinigen
- **Content Security Policy**: CSP-Header zur Einschränkung der Skriptquellen

**Barrierefreiheit**:

- Konformität mit WCAG 2.1 AA
- Vollständige Tastaturnavigation
- Geeignete ARIA-Rollen und Labels
- Konforme Farbkontraste

**Performance**:

- Lazy Loading der Module über `lazy-loader.js`
- CSS-Optimierungen und responsive Assets
- Service Worker für intelligentes Caching
- Code-Splitting und Minifizierung in der Produktion

## 📱 Kompatibilität

### Unterstützte Browser

Die Benutzeroberfläche verwendet `oklch()` für Farben und `:has()` für kontextbezogene
Zustände, wodurch sich folgende Mindestversionen ergeben:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Geräte

- **Desktop**: Steuerung über Tastatur und Maus
- **Tablets**: Optimierte Touch-Oberfläche
- **Smartphones**: Adaptives responsives Design

### Barrierefreiheit

- Vollständige Tastaturnavigation (Tabulatortaste, Pfeiltasten, Escape)
- ARIA-Rollen und Beschriftungen für Screenreader
- Normgerechte Farbkontraste
- Unterstützung assistiver Technologien

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
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Skripte zur i18n-Verwaltung

**`npm run i18n:verify`** - Konsistenz der Übersetzungsschlüssel überprüfen

**`npm run i18n:unused`** - Nicht verwendete Übersetzungsschlüssel auflisten

**`npm run i18n:compare`** - Übersetzungsdateien mit fr.json (Referenz) vergleichen

Dieses Skript (`scripts/compare-translations.cjs`) stellt die Synchronisierung aller Sprachdateien sicher:

**Funktionen:**

- Erkennung fehlender Schlüssel (in fr.json vorhanden, aber in anderen Sprachen nicht)
- Erkennung zusätzlicher Schlüssel (in anderen Sprachen vorhanden, aber nicht in fr.json)
- Erkennung leerer Werte (`""`, `null`, `undefined`, `[]`)
- Überprüfung der Typkonsistenz (string vs array)
- Abflachung verschachtelter JSON-Strukturen in Punktnotation (z. B. `arcade.multiMemory.title`)
- Erstellung eines detaillierten Konsolenberichts
- Speicherung des JSON-Berichts unter `docs/translations-comparison-report.json`

**Beispielausgabe:**

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

**Übersetzungsabdeckung:**

- Vollständige Benutzeroberfläche
- Spielanleitungen
- Fehler- und Feedbackmeldungen
- Beschreibungen und kontextbezogene Hilfe
- Narrative Inhalte des Abenteuermodus
- Beschriftungen für Barrierefreiheit und ARIA

## 📊 Datenspeicherung

### Benutzerdaten

- Profile und Einstellungen
- Fortschritt je Spielmodus
- Punktestände und Statistiken der Arcade-Spiele
- Personalisierungseinstellungen

### Technische Funktionen

- Lokale Speicherung (localStorage) mit Fallbacks
- Isolierung der Daten pro Benutzer
- Automatische Speicherung des Fortschritts
- Automatische Migration älterer Daten

## 🐛 Ein Problem melden

Probleme können über GitHub Issues gemeldet werden. Bitte Folgendes angeben:

- Detaillierte Beschreibung des Problems
- Schritte zur Reproduktion
- Browser und Version
- Screenshots, falls relevant

## 💝 Das Projekt unterstützen

**[☕ Über PayPal spenden](https://paypal.me/jls)**

## 📄 Lizenz

Dieses Projekt ist unter der AGPL-v3-Lizenz lizenziert. Weitere Einzelheiten finden Sie in der Datei `LICENSE`.

---

_LeapMultix — freie Lernanwendung zum Erlernen der vier Grundrechenarten_

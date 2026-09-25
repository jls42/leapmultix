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

## Inhaltsverzeichnis

- [Beschreibung](#beschreibung)
- [Übersicht](#-übersicht)
- [Funktionen](#-funktionen)
- [Schnellstart](#-schnellstart)
- [Architektur](#-architektur)
- [Ausführliche Spielmodi](#-ausführliche-spielmodi)
- [Entwicklung](#-entwicklung)
- [Kompatibilität](#-kompatibilität)
- [Lokalisierung](#-lokalisierung)
- [Aufgezeichnete Stimme](#-aufgezeichnete-stimme)
- [Datenspeicherung](#-datenspeicherung)
- [Problem melden](#-ein-problem-melden)
- [Lizenz](#-lizenz)

## Beschreibung

LeapMultix ist eine interaktive Lern-Webanwendung für Kinder von 6 bis 12 Jahren, mit der sie die vier Grundrechenarten meistern können: Multiplikation (×), Addition (+), Subtraktion (−) und Division (÷). Sie bietet **5 Spielmodi** und **4 Arcade-Minispiele** in einer intuitiven, barrierefreien und mehrsprachigen Benutzeroberfläche.

**Unterstützung mehrerer Rechenarten:** Alle fünf Modi unterstützen die vier Rechenarten. Die Auswahl erfolgt auf dem Startbildschirm und gilt für den gesamten Ablauf.

**Entwickelt von:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## 📸 Übersicht

### Die Bildschirme

|                                                                                                                                               |                                                                                                                            |
| :-------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: |
|                                    ![Bildschirm „Wer spielt?“: Profilauswahl](docs/media/01-accueil.webp)                                     |                       ![Hauptmenü: Auswahl der Rechenart und der fünf Modi](docs/media/02-menu.webp)                       |
|                                       **Wer spielt?** — ein Profil pro Kind mit Avatar und Fortschritt.                                       |               **Das Menü** — hier wird die Rechenart ausgewählt, danach stehen die fünf Modi zur Verfügung.                |
|                           ![Entdeckungsmodus: die 4er-Reihe als Punkte dargestellt](docs/media/03-decouverte.webp)                            |                  ![Quizmodus: falsche Antwort in Rot, richtige Antwort in Grün](docs/media/04-quiz.webp)                   |
|                **Entdeckung** — jede Gleichung wird mit Punkten, Sprüngen oder Zählen sowie einem Tipp zur Reihe dargestellt.                 | **Quiz** — die Auswahl des Kindes bleibt neben der richtigen Antwort sichtbar, und die Erklärung erläutert die Berechnung. |
|                                ![Herausforderungsmodus: Countdown und aktuelle Serie](docs/media/05-defi.webp)                                |             ![Abenteuermodus: Karte der zehn Level, die folgenden sind gesperrt](docs/media/06-aventure.webp)              |
| **Herausforderung** — Wettlauf gegen die Zeit. Bei einem Fehler wird die Stoppuhr angehalten, damit die richtige Antwort gelesen werden kann. |                      **Abenteuer** — zehn Level, die nacheinander gegen Sterne freigeschaltet werden.                      |
|                                        ![Arcade-Menü: die vier Minispiele](docs/media/07-arcade.webp)                                         |                     ![Dashboard: Sterne pro Reihe und Statistiken](docs/media/08-tableau-de-bord.webp)                     |
|                        **Arcade** — vier Minispiele mit einstellbarem Schwierigkeitsgrad und Auswahl des Raumschiffs.                         |                   **Dashboard** — Sterne pro Reihe, zu wiederholende Reihen und Punktestände pro Modus.                    |
|                          ![Personalisierung: Avatare, Themes, Barrierefreiheit](docs/media/09-personnalisation.webp)                          |                                                                                                                            |
|                             **Personalisierung** — Avatar, Farb-Theme, Textgröße, hoher Kontrast und Elterncode.                              |                                                                                                                            |

### Die Arcade-Minispiele

Vier Spiele, die dieselbe Frage stellen — sie wird über dem Spielbereich
zusammen mit der verbleibenden Zeit und den Leben angezeigt —, aber jedes Mal
eine andere Aktion erfordern.

|                                                                                                                                                    |                                                                                                                       |
| :------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
|                ![MultiInvaders: Monster mit Zahlen und ein Raumschiff am unteren Bildschirmrand](docs/media/10-multiinvaders.webp)                 |        ![MultiMiam: ein Labyrinth, in dem Punkte die möglichen Antworten tragen](docs/media/11-multimiam.webp)        |
| **MultiInvaders** — auf die falschen Antworten schießen und die richtige verschonen: Hinter ihr verbirgt sich ein Freund, der befreit werden muss. | **MultiMiam** — das Labyrinth durchqueren, um das richtige Ergebnis einzusammeln und dabei den Monstern auszuweichen. |
|        ![MultiMemory: ein Kartenraster, in dem zwei aufgedeckte Karten eine Rechnung und eine Zahl zeigen](docs/media/12-multimemory.webp)         |           ![MultiSnake: eine Schlange und nummerierte Äpfel auf einer Wiese](docs/media/13-multisnake.webp)           |
|                             **MultiMemory** — sich merken, welche Karte das Ergebnis der aufgedeckten Rechnung trägt.                              |           **MultiSnake** — durch das Verschlingen der richtigen Zahlen wachsen und alle anderen vermeiden.            |

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

### 🌍 Modusübergreifende Funktionen

- **Mehrere Benutzer**: Verwaltung individueller Profile mit gespeichertem Fortschritt
- **Mehrsprachig**: Unterstützung für Französisch, Englisch und Spanisch
- **Personalisierung**: Avatare, Farb-Themes und Hintergründe
- **Barrierefreiheit**: Tastaturnavigation, Touch-Unterstützung und Konformität mit WCAG 2.1 AA
- **Aufgezeichnete Stimme**: Fragen und Ermutigungen werden von einer vorab aufgezeichneten synthetischen Stimme vorgelesen (erstellt mit ElevenLabs), mit automatischem Rückgriff auf die Stimme des Geräts; die Clips befinden sich nicht im öffentlichen Repository (siehe [Aufgezeichnete Stimme](#-aufgezeichnete-stimme))
- **Mobile responsive**: Für Tablets und Smartphones optimierte Benutzeroberfläche
- **Fortschrittssystem**: Punktestände, Abzeichen und tägliche Herausforderungen

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

### Verfügbare Scripts

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

# Voix enregistrée (poste du propriétaire, clips hors dépôt)
npm run voice:corpus       # Résumé des phrases dites, par langue
npm run voice:corpus:lock  # Mettre à jour le verrou du corpus
npm run voice:generate     # Générer les clips (ElevenLabs)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Architektur

### Dateistruktur

Die JavaScript-Module liegen **bis auf drei Verzeichnisse flach in `js/`**:
`core/`, `components/` und `modes/`. Daher erfolgt die Gruppierung über den
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
│   ├── voice-clips.js      # Lecteur de la voix enregistrée (repli : speech.js)
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
│   └── voice/              # Voix enregistrée : corpus, génération, écoute, publication
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### Technische Architektur

**Moderne ES6-Module**: Das Projekt verwendet eine modulare Architektur mit ES6-Klassen und nativen Imports/Exports.

**Wiederverwendbare Komponenten**: Die Benutzeroberfläche wird mit zentralisierten UI-Komponenten erstellt (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligentes bedarfsgesteuertes Laden der Module über `lazy-loader.js`, um die anfängliche Performance zu optimieren.

**Einheitliches Speichersystem**: Zentralisierte API zur Persistenz von Benutzerdaten über LocalStorage mit Fallbacks.

**Zentrale Audioverwaltung**: Audiosteuerung mit mehrsprachiger Unterstützung und benutzerspezifischen Einstellungen.

**Event Bus**: Entkoppelte ereignisbasierte Kommunikation zwischen Komponenten für eine wartbare Architektur.

**Slide-basierte Navigation**: Navigationssystem auf Basis nummerierter Slides (slide0, slide1 usw.) mit `goToSlide()`.

**Sicherheit**: XSS-Schutz und Sanitization über `security-utils.js` für sämtliche DOM-Manipulationen.

## 🎯 Ausführliche Spielmodi

### Entdeckungsmodus

Benutzeroberfläche zur visuellen Erkundung der Einmaleinsreihen mit:

- Interaktiver Visualisierung der Multiplikationen
- Animationen und Merkhilfen
- Pädagogischem Drag-and-drop
- Freiem Fortschritt nach Reihe

### Quizmodus

Multiple-Choice-Fragen mit:

- 10 Fragen pro Sitzung
- Adaptivem Fortschritt je nach Erfolgen
- Virtuellem Ziffernblock
- Streak-System (Serie richtiger Antworten)

### Herausforderungsmodus

Wettlauf gegen die Zeit mit:

- 3 Schwierigkeitsgraden (Anfänger, Mittel, Schwer)
- Zeitbonus für richtige Antworten
- Lebenssystem
- Bestenliste

### Abenteuermodus

Narrativer Fortschritt mit:

- 10 freischaltbaren thematischen Leveln
- Interaktiver Karte mit visueller Fortschrittsanzeige
- Fesselnder Geschichte mit Figuren
- Sternen- und Belohnungssystem

### Arcade-Minispiele

Jedes Minispiel bietet:

- Auswahl des Schwierigkeitsgrads und Personalisierung
- Lebens- und Punktesystem
- Tastatur- und Touch-Steuerung
- Individuelle Bestenlisten pro Benutzer

## 🔧 Entwicklung

### Entwicklungsworkflow

**Niemals direkt auf main committen.** Das Projekt arbeitet mit
Feature-Branches.

**1. Einen Branch erstellen**, `feat/` für ein Feature, `fix/` für einen Bugfix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Entwickeln und prüfen.** Die Formatierung kommt zuerst: Die CI lehnt den Build
noch vor dem Ausführen der Tests ab, wenn sie nicht stimmt.

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

**4. Eine Pull Request öffnen** und die Analysen abwarten: verify, Codacy,
CodeFactor und SonarCloud. Fehler werden behoben, bis alles grün ist, bevor gemergt wird.

**Commit-Stil**: Prägnante Nachrichten im Imperativ (z. B. „Fix arcade init errors“, „Refactor cache updater“)

**Quality Gate**: Vor jedem Commit sicherstellen, dass `npm run lint`, `npm test` und `npm run test:coverage` erfolgreich durchlaufen

### Komponentenarchitektur

**GameMode (Basisklasse)**: Alle Modi erben von einer gemeinsamen Klasse mit standardisierten Methoden.

**GameModeManager**: Zentrale Orchestrierung des Starts und der Verwaltung der Modi.

**UI-Komponenten**: TopBar, InfoBar, Dashboard und Customization sorgen für eine einheitliche Benutzeroberfläche.

**Lazy Loading**: Module werden bei Bedarf geladen, um die anfängliche Performance zu optimieren.

**Event Bus**: Entkoppelte Kommunikation zwischen Komponenten über das Ereignissystem.

### Tests

Das Projekt umfasst eine vollständige Testsuite:

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
- **Post-Build**: Kopiert `css/` und `assets/`, die Favicons (`favicon.ico`, `favicon.png`, `favicon.svg`) sowie `sw.js` und schreibt `dist/index.html` auf die gehashte Einstiegsdatei um (z. B. `main-es6-*.js`)
- **Ausgabeverzeichnis**: `dist/`, bereit für die statische Bereitstellung

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continuous Integration

**GitHub Actions**: `.github/workflows/ci.yml`, wird bei jedem Push auf
`main` und bei jeder Pull Request ausgelöst.

**`verify`** — das blockierende Quality Gate:

- `npm ci`, dann `npm run verify` (ESLint, Jest-Tests, Coverage)
- `npm run format:check` (Prettier)

**`seo-report`** — nach `verify`: Lighthouse-Audit der Online-Website, um
die SEO-Metriken langfristig zu verfolgen.

**Externe Analysen**, die in Pull Requests eingebunden sind: Codacy, CodeFactor und
SonarCloud. Das SonarCloud-Gate verlangt für neuen Code jeweils die Bewertung A bei Zuverlässigkeit, Sicherheit und
Wartbarkeit.

**Bereitstellung**: `./deploy.sh` synchronisiert die Website mit S3 und invalidiert den
CloudFront-Cache. Das Script erzeugt bei Bedarf die responsiven Bilder neu, die nicht in git enthalten sind.

### PWA (Progressive Web App)

LeapMultix ist eine vollständige PWA mit Offline-Unterstützung und Installationsmöglichkeit.

**Service Worker** (`sw.js`):

- Navigation: Network-first mit Offline-Fallback auf `offline.html`
- Bilder: Cache-first zur Performance-Optimierung
- Übersetzungen: Stale-while-revalidate für Aktualisierungen im Hintergrund
- JS/CSS: Network-first, damit stets die neueste Version bereitgestellt wird
- Automatische Versionsverwaltung über `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- und PNG-Symbole für alle Geräte
- Installation auf Mobilgeräten möglich (Add to Home Screen)
- Standalone-Konfiguration für ein App-ähnliches Nutzungserlebnis
- Unterstützung für Themes und Farben

**Offline-Modus lokal testen.** Den Server starten und anschließend
`http://localhost:8080` (oder den angezeigten Port) öffnen:

```bash
npm run serve
```

Manuell: Das Netzwerk in den Entwicklertools deaktivieren (Registerkarte Netzwerk,
Offline-Modus) und anschließend die Seite aktualisieren. `offline.html` muss angezeigt werden.

Automatisch mit Puppeteer:

```bash
npm run test:pwa-offline
```

**Scripts zur Verwaltung des Service Workers**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Qualitätsstandards

**Tools zur Codequalität**:

- **ESLint**: Moderne Konfiguration mit flat config (`eslint.config.js`), Unterstützung für ES2022
- **Prettier**: Automatische Codeformatierung (`.prettierrc`)
- **Stylelint**: CSS-Validierung (`.stylelintrc.json`)
- **JSDoc**: Automatische Dokumentation von Funktionen mit Abdeckungsanalyse

**Wichtige Coderegeln**:

- Nicht verwendete Variablen und Parameter entfernen (`no-unused-vars`)
- Eine spezifische Fehlerbehandlung verwenden (keine leeren catch-Blöcke)
- `innerHTML` zugunsten von `security-utils.js`-Funktionen vermeiden
- Die kognitive Komplexität von Funktionen unter 15 halten
- Komplexe Funktionen in kleinere Helper-Funktionen aufteilen

**Sicherheit**:

- **XSS-Schutz**: Die Funktionen von `security-utils.js` verwenden:
  - `appendSanitizedHTML()` anstelle von `innerHTML`
  - `createSafeElement()` zum Erstellen sicherer Elemente
  - `setSafeMessage()` für Textinhalte
- **Externe Skripte**: Attribut `crossorigin="anonymous"` erforderlich
- **Eingabevalidierung**: Externe Daten immer bereinigen
- **Content Security Policy**: CSP-Header zur Einschränkung von Skriptquellen

**Barrierefreiheit**:

- Konformität mit WCAG 2.1 AA
- Vollständige Tastaturnavigation
- Geeignete ARIA-Rollen und Labels
- Konforme Farbkontraste

**Performance**:

- Lazy Loading von Modulen über `lazy-loader.js`
- CSS-Optimierungen und responsive Assets
- Service Worker für intelligentes Caching
- Code Splitting und Minifizierung in der Produktion

## 📱 Kompatibilität

### Unterstützte Browser

Die Benutzeroberfläche verwendet `oklch()` für Farben und `:has()` für
kontextbezogene Zustände, wodurch folgende Mindestversionen gelten:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Geräte

- **Desktop**: Steuerung per Tastatur und Maus
- **Tablets**: Optimierte Touch-Oberfläche
- **Smartphones**: Adaptives responsives Design

### Barrierefreiheit

- Vollständige Tastaturnavigation (Tab, Pfeiltasten, Esc)
- ARIA-Rollen und Labels für Screenreader
- Konforme Farbkontraste
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

**`npm run i18n:verify`** – Konsistenz der Übersetzungsschlüssel prüfen

**`npm run i18n:unused`** – Nicht verwendete Übersetzungsschlüssel auflisten

**`npm run i18n:compare`** – Übersetzungsdateien mit fr.json (Referenz) vergleichen

Dieses Skript (`scripts/compare-translations.cjs`) stellt die Synchronisierung aller Sprachdateien sicher:

**Funktionen:**

- Erkennung fehlender Schlüssel (in fr.json vorhanden, aber in anderen Sprachen nicht)
- Erkennung zusätzlicher Schlüssel (in anderen Sprachen vorhanden, aber nicht in fr.json)
- Identifizierung leerer Werte (`""`, `null`, `undefined`, `[]`)
- Prüfung der Typkonsistenz (string vs array)
- Abflachung verschachtelter JSON-Strukturen in Punktnotation (z. B. `arcade.multiMemory.title`)
- Erstellung eines detaillierten Konsolenberichts
- Speicherung des JSON-Berichts in `docs/translations-comparison-report.json`

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
- Labels für Barrierefreiheit und ARIA

## 🔊 Aufgezeichnete Stimme

Das Spiel liest Fragen, Ermutigungen und Erklärungen laut vor. Auf Französisch ist dies **Lucie**, eine mit ElevenLabs (Modell Eleven v3) erstellte synthetische Stimme. Das Spiel verwendet nur eine begrenzte Anzahl von Sätzen, etwa 7.400 pro Sprache: Alle werden im Voraus aufgezeichnet, und kein Teil des Spiels ruft ElevenLabs auf. Englisch und Spanisch verwenden vorerst weiterhin die Stimme des Geräts.

- **Automatischer Rückgriff** auf die Stimme des Geräts, Satz für Satz: wenn ein Clip fehlt oder fehlerhaft ist, die Wiedergabe vom Browser verweigert wird, der Clip nicht innerhalb von 1,5 s startet oder der Clip offline nicht im Cache vorhanden ist.
- **Einstellungen**: Die Sprachtaste in der oberen Leiste aktiviert oder deaktiviert die Wiedergabe; das Kontrollkästchen „Aufgezeichnete Stimme“ (Barrierefreiheit und Steuerung) wählt zwischen Lucie und der Stimme des Geräts.
- **Offline**: Bereits gehörte Clips bleiben im Cache (Service Worker).

### Die Clips befinden sich nicht in diesem Repository

Die Clips befinden sich in einem privaten Repository und in einem eigenen S3-Bucket, der über CloudFront unter `/voice/*` bereitgestellt wird. Ein Fork oder die lokale Entwicklungsumgebung verwendet daher weiterhin die Stimme des Geräts: Im Repository ist das Tag `<meta name="leapmultix-voice-base">` leer, und nur beim Produktions-Deployment wird dort `/voice/` eingetragen.

Wenn sich die Clips auf dem lokalen Rechner befinden (privates Repository neben dem Spiel in `../leapmultix-voices` geklont), sorgt der Parameter `?voix=local` dafür, dass sie vom Entwicklungsserver bereitgestellt werden:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Clips generieren

Die Pipeline ist in `scripts/voice/` geskriptet und läuft auf dem Rechner des Eigentümers, niemals in der öffentlichen CI. Der ElevenLabs-Schlüssel verbleibt in einer nicht im Repository enthaltenen Datei `.env`, die über `node --env-file` übergeben wird: Kein Schlüssel gelangt in git. Der Claude Code Skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) führt Schritt für Schritt durch das Verfahren (Prüfpunkte, Freigaben, Wiederaufnahmen); Einzelheiten stehen in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Schätzen** der verbleibenden Sätze und der zu bezahlenden Zeichen (Eleven v3: ungefähr 0,53 Credits pro Zeichen).
2. **Generieren**. Beim erneuten Ausführen desselben Befehls wird die Generierung der noch fehlenden Clips fortgesetzt. Wenn die Credits aufgebraucht sind, beendet sich das Skript ordnungsgemäß (Code 3), ohne eine unvollständig geschriebene Datei zu hinterlassen.
3. **Prüfen**: Jeder Satz besitzt einen Clip und jede MP3-Datei ist gültig. Anschließend transkribiert Whisper jeden Clip lokal, und `voice:check` meldet falsch verstandene Zahlen und ungewöhnliche Laufzeiten.
4. **Anhören** der gemeldeten Clips und einer Stichprobe weiblicher Formen („une fois 7“), die Whisper nicht unterscheidet, auf der Seite zum Anhören (`voice:listen`). Jeder Clip verfügt über ein Kontrollkästchen „erneut erstellen“, das ihn der Liste verworfener Clips hinzufügt.
5. **Erneut erstellen** der verworfenen Clips (`--redo`), Whisper erneut ausführen und anschließend jeden Clip vor und nach der Neuerstellung auf einer zweiten Seite vergleichen. Ein Clip, der auch nach zwei oder drei Versuchen noch falsch gesprochen wird, erhält in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`) einen vorgegebenen Text, beispielsweise die ausgeschriebene Zahl.
6. **Veröffentlichen** der Clips, prüfen, ob sie online erreichbar sind, und anschließend den Sprachindex veröffentlichen, zunächst für die Tester (`?voix=test`).
7. **Freigeben** der Stimme für alle und sie anschließend standardmäßig aktivieren. Der Kill Switch (`voice:publish -- remove`) entfernt eine Sprache aus dem Index: Das Spiel greift dann wieder auf die Stimme des Geräts zurück.

```bash
# 1. Estimer (sans frais)
npm run voice:generate -- --lang fr --dry-run
# 2. Générer (payant)
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --reserve 5000
# 3. Contrôler (Whisper s'installe une fois : voir l'en-tête de whisper_transcribe.py)
npm run voice:check -- --lang fr --probe
.venv-whisper/bin/python scripts/voice/whisper_transcribe.py --manifest ../leapmultix-voices/manifests/fr/<version>.json --clips ../leapmultix-voices/clips/fr/<version> --lang fr --out transcripts-fr.jsonl
npm run voice:check -- --lang fr --transcripts transcripts-fr.jsonl
# 4. Écouter (page locale ; la liste « à refaire » va dans ecartes.txt)
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl
# 5. Refaire (payant), relancer Whisper (il ne transcrit que les clips refaits), comparer
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --redo ecartes.txt
npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl --compare ecartes.txt
# 6. Publier
npm run voice:publish -- clips --lang fr --bucket <bucket>
npm run voice:check-online -- --lang fr
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience test
# 7. Ouvrir
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience all --default-on
```

### Regel: Ein geänderter gesprochener Satz wird vor dem Produktions-Deployment neu aufgezeichnet

Jeder gesprochene Satz stammt aus den Übersetzungen (`assets/translations/{fr,en,es}.json`) und ist Teil des Korpus. Das Ändern eines gesprochenen Satzes führt daher dazu, dass der Test der Korpussperre (`scripts/voice/corpus.lock.json`) fehlschlägt. Für eine Sprache mit aufgezeichneter Stimme werden dann die Clips der betroffenen Sätze generiert, geprüft und angehört und anschließend **vor** dem Merge veröffentlicht. Abschließend wird die Sperre aktualisiert (`npm run voice:corpus:lock`). Ohne diese Clips wird der geänderte Satz mit der Stimme des Geräts vorgelesen.

## 📊 Datenspeicherung

### Benutzerdaten

- Profile und Einstellungen
- Fortschritt nach Spielmodus
- Punktestände und Statistiken der Arcade-Spiele
- Personalisierungseinstellungen

### Technische Funktionen

- Lokale Speicherung (localStorage) mit Fallbacks
- Trennung der Daten nach Benutzer
- Automatische Speicherung des Fortschritts
- Automatische Migration alter Daten

## 🐛 Ein Problem melden

Probleme können über GitHub Issues gemeldet werden. Bitte Folgendes angeben:

- Detaillierte Beschreibung des Problems
- Schritte zum Reproduzieren
- Browser und Version
- Screenshots, falls relevant

## 💝 Das Projekt unterstützen

**[☕ Über PayPal spenden](https://paypal.me/jls)**

## 📄 Lizenz

Dieses Projekt ist unter der AGPL v3 lizenziert. Weitere Einzelheiten finden Sie in der Datei `LICENSE`.

---

_LeapMultix — freie Lernanwendung zum Erlernen der vier Grundrechenarten_

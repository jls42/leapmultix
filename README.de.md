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
- [Detaillierte Spielmodi](#-detaillierte-spielmodi)
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

|                                                                                                                                    |                                                                                                                           |
| :--------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: |
|                               ![Bildschirm „Wer spielt?“: Profilauswahl](docs/media/01-accueil.webp)                               |                      ![Hauptmenü: Auswahl der Rechenart und der fünf Modi](docs/media/02-menu.webp)                       |
|                               **Wer spielt?** — ein Profil pro Kind, mit Avatar und Lernfortschritt.                               |             **Das Menü** — hier wird die Rechenart ausgewählt, anschließend lassen sich die fünf Modi öffnen.             |
|                      ![Entdeckungsmodus: die 4er-Reihe als Punkte dargestellt](docs/media/03-decouverte.webp)                      |                  ![Quizmodus: falsche Antwort in Rot, richtige Antwort in Grün](docs/media/04-quiz.webp)                  |
|     **Entdecken** — jede Gleichung wird mit Punkten, Sprüngen oder durch Zählen dargestellt, ergänzt durch den Tipp zur Reihe.     | **Quiz** — die Auswahl des Kindes bleibt neben der richtigen Antwort sichtbar und die Erklärung erläutert die Berechnung. |
|                          ![Herausforderungsmodus: Countdown und aktuelle Serie](docs/media/05-defi.webp)                           |               ![Abenteuermodus: Karte der zehn Level, die folgenden gesperrt](docs/media/06-aventure.webp)                |
| **Herausforderung** — Wettlauf gegen die Zeit. Bei einem Fehler hält der Timer an, damit die richtige Antwort gelesen werden kann. |                **Abenteuer** — zehn Level, die nacheinander im Tausch gegen Sterne freigeschaltet werden.                 |
|                                   ![Arcade-Menü: die vier Minispiele](docs/media/07-arcade.webp)                                   |                    ![Dashboard: Sterne pro Reihe und Statistiken](docs/media/08-tableau-de-bord.webp)                     |
|                   **Arcade** — vier Minispiele mit einstellbarem Schwierigkeitsgrad und Auswahl des Raumschiffs.                   |                   **Dashboard** — Sterne pro Reihe, zu wiederholende Reihen und Punktzahlen nach Modus.                   |
|                    ![Personalisierung: Avatare, Designs, Barrierefreiheit](docs/media/09-personnalisation.webp)                    |                                                                                                                           |
|                        **Personalisierung** — Avatar, Farbdesign, Textgröße, hoher Kontrast und Elterncode.                        |                                                                                                                           |

### Die Arcade-Minispiele

Vier Spiele, die dieselbe Frage stellen — sie wird oberhalb des
Spielfelds zusammen mit der verbleibenden Zeit und den Leben angezeigt —, aber jedes Mal eine andere
Aktion erfordern.

|                                                                                                                                          |                                                                                                                      |
| :--------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: |
|           ![MultiInvaders: Monster mit Zahlen und ein Raumschiff am unteren Bildschirmrand](docs/media/10-multiinvaders.webp)            |       ![MultiMiam: ein Labyrinth, in dem Punkte die möglichen Antworten tragen](docs/media/11-multimiam.webp)        |
| **MultiInvaders** — auf die falschen Antworten schießen und die richtige verschonen: Sie verbirgt einen Freund, der befreit werden muss. | **MultiMiam** — das Labyrinth durchqueren, um das richtige Ergebnis einzusammeln, und dabei den Monstern ausweichen. |
|       ![MultiMemory: ein Kartenraster, zwei umgedrehte Karten zeigen eine Rechnung und eine Zahl](docs/media/12-multimemory.webp)        |          ![MultiSnake: eine Schlange und nummerierte Äpfel auf einer Wiese](docs/media/13-multisnake.webp)           |
|                    **MultiMemory** — sich daran erinnern, welche Karte das Ergebnis der aufgedeckten Rechnung trägt.                     |               **MultiSnake** — durch das Fressen der richtigen Zahlen wachsen und alle anderen meiden.               |

## ✨ Funktionen

### 🎮 Spielmodi

- **Entdeckungsmodus**: Visuelles und interaktives Erkunden, angepasst an jede Rechenart
- **Quizmodus**: Multiple-Choice-Fragen mit Unterstützung der 4 Rechenarten (×, +, −, ÷) und adaptivem Fortschritt
- **Herausforderungsmodus**: Wettlauf gegen die Zeit mit den 4 Rechenarten (×, +, −, ÷) und verschiedenen Schwierigkeitsgraden
- **Abenteuermodus**: Erzählerischer Fortschritt über Level mit Unterstützung der 4 Rechenarten

### 🕹️ Arcade-Minispiele

- **MultiInvaders**: Lehrreiches Space Invaders – die falschen Antworten zerstören
- **MultiMiam**: Mathematisches Pac-Man – die richtigen Antworten einsammeln
- **MultiMemory**: Gedächtnisspiel – Rechenaufgaben und Ergebnisse zuordnen
- **MultiSnake**: Lehrreiches Snake – durch das Fressen der richtigen Zahlen wachsen

### ➕ Unterstützung mehrerer Rechenarten

LeapMultix bietet in **allen Modi** ein umfassendes Training der 4 Grundrechenarten:

| Modus           | ×   | +   | −   | ÷   |
| --------------- | --- | --- | --- | --- |
| Quiz            | ✅  | ✅  | ✅  | ✅  |
| Herausforderung | ✅  | ✅  | ✅  | ✅  |
| Entdecken       | ✅  | ✅  | ✅  | ✅  |
| Abenteuer       | ✅  | ✅  | ✅  | ✅  |
| Arcade          | ✅  | ✅  | ✅  | ✅  |

### 🌍 Übergreifende Funktionen

- **Mehrbenutzerbetrieb**: Verwaltung individueller Profile mit gespeichertem Fortschritt
- **Mehrsprachigkeit**: Unterstützung für Französisch, Englisch und Spanisch
- **Personalisierung**: Avatare, Farbdesigns und Hintergründe
- **Barrierefreiheit**: Tastaturnavigation, Touch-Unterstützung und Konformität mit WCAG 2.1 AA
- **Aufgezeichnete Stimme**: Fragen und Ermutigungen werden von einer vorab aufgezeichneten synthetischen Stimme vorgelesen (Lucie auf Französisch, erstellt mit ElevenLabs; Jane auf Englisch, erstellt mit Mistral AI), mit automatischem Rückgriff auf die Stimme des Geräts; die Clips befinden sich nicht im öffentlichen Repository (siehe [Aufgezeichnete Stimme](#-aufgezeichnete-stimme))
- **Mobile responsive**: Für Tablets und Smartphones optimierte Benutzeroberfläche
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

# Voix enregistrée (poste du propriétaire, clips hors dépôt)
npm run voice:corpus       # Résumé des phrases dites, par langue
npm run voice:corpus:lock  # Mettre à jour le verrou du corpus
npm run voice:generate     # Générer les clips (ElevenLabs ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Architektur

### Dateistruktur

Die JavaScript-Module liegen **mit Ausnahme von drei Ordnern direkt in `js/`**:
`core/`, `components/` und `modes/`. Die Gruppierung ergibt sich daher aus dem
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

**Wiederverwendbare Komponenten**: Die Benutzeroberfläche ist mit zentralisierten UI-Komponenten aufgebaut (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligentes bedarfsgesteuertes Laden der Module über `lazy-loader.js`, um die anfängliche Performance zu optimieren.

**Einheitliches Speichersystem**: Zentralisierte API zur Persistierung von Benutzerdaten über LocalStorage mit Fallbacks.

**Zentralisierte Audioverwaltung**: Audiosteuerung mit mehrsprachiger Unterstützung und benutzerspezifischen Einstellungen.

**Event Bus**: Entkoppelte ereignisbasierte Kommunikation zwischen Komponenten für eine wartbare Architektur.

**Navigation über Slides**: Navigationssystem auf Basis nummerierter Slides (slide0, slide1 usw.) mit `goToSlide()`.

**Sicherheit**: XSS-Schutz und Sanitization über `security-utils.js` für sämtliche DOM-Manipulationen.

## 🎯 Detaillierte Spielmodi

### Entdeckungsmodus

Benutzeroberfläche zum visuellen Erkunden der Einmaleinsreihen mit:

- Interaktiver Darstellung der Multiplikationen
- Animationen und Merkhilfen
- Lehrreichem Drag-and-drop
- Freiem Fortschritt pro Reihe

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

Erzählerischer Fortschritt mit:

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

**1. Einen Branch erstellen**, `feat/` für eine Funktion, `fix/` für eine Fehlerbehebung:

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

**4. Eine Pull Request öffnen** und die Analysen abwarten: verify, Codacy,
CodeFactor und SonarCloud. Fehler werden behoben, bis alles grün ist, bevor gemergt wird.

**Commit-Stil**: Prägnante Nachrichten im Imperativ (z. B. „Fix arcade init errors“, „Refactor cache updater“)

**Quality Gate**: Vor jedem Commit sicherstellen, dass `npm run lint`, `npm test` und `npm run test:coverage` erfolgreich durchlaufen

### Komponentenarchitektur

**GameMode (Basisklasse)**: Alle Modi erben von einer gemeinsamen Klasse mit standardisierten Methoden.

**GameModeManager**: Zentralisierte Orchestrierung des Starts und der Verwaltung der Modi.

**UI-Komponenten**: TopBar, InfoBar, Dashboard und Customization sorgen für eine einheitliche Benutzeroberfläche.

**Lazy Loading**: Die Module werden bei Bedarf geladen, um die anfängliche Performance zu optimieren.

**Event Bus**: Entkoppelte Kommunikation zwischen Komponenten über das Ereignissystem.

### Tests

Das Projekt enthält eine umfassende Testsuite:

- Unit-Tests der Core-Module
- Integrationstests der Komponenten
- Tests der Spielmodi
- Automatisierte Codeabdeckung

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
- **Post-build**: Kopiert `css/` und `assets/`, die Favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` und schreibt `dist/index.html` auf die gehashte Einstiegsdatei um (z. B. `main-es6-*.js`)
- **Zielordner**: `dist/`, bereit zur statischen Bereitstellung

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continuous Integration

**GitHub Actions**: `.github/workflows/ci.yml`, wird bei jedem Push auf
`main` und bei jeder Pull Request ausgelöst.

**`verify`** — das blockierende Quality Gate:

- `npm ci`, anschließend `npm run verify` (ESLint, Jest-Tests, Abdeckung)
- `npm run format:check` (Prettier)

**`seo-report`** — nach `verify`: Lighthouse-Audit der Online-Website, um
die SEO-Metriken langfristig zu verfolgen.

**Externe Analysen**, die in die Pull Requests eingebunden sind: Codacy, CodeFactor und
SonarCloud. Das SonarCloud-Gate verlangt für neuen Code die Bewertung A bei Zuverlässigkeit, Sicherheit und
Wartbarkeit.

**Deployment**: `./deploy.sh` synchronisiert die Website mit S3 und invalidiert den
CloudFront-Cache. Das Skript erzeugt bei Bedarf die responsiven Bilder neu, die nicht in git enthalten sind.

### PWA (Progressive Web App)

LeapMultix ist eine vollständige PWA mit Offline-Unterstützung und Installationsmöglichkeit.

**Service Worker** (`sw.js`):

- Navigation: Network-first mit Offline-Fallback auf `offline.html`
- Bilder: Cache-first zur Optimierung der Performance
- Übersetzungen: Stale-while-revalidate für Aktualisierungen im Hintergrund
- JS/CSS: Network-first, um stets die neueste Version bereitzustellen
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

**Tools zur Codequalität**:

- **ESLint**: Moderne Konfiguration mit Flat Config (`eslint.config.js`), Unterstützung für ES2022
- **Prettier**: Automatische Codeformatierung (`.prettierrc`)
- **Stylelint**: CSS-Validierung (`.stylelintrc.json`)
- **JSDoc**: Automatische Dokumentation von Funktionen mit Abdeckungsanalyse

**Wichtige Coderegeln**:

- Nicht verwendete Variablen und Parameter entfernen (`no-unused-vars`)
- Eine spezifische Fehlerbehandlung verwenden (keine leeren Catch-Blöcke)
- `innerHTML` zugunsten von `security-utils.js`-Funktionen vermeiden
- Eine kognitive Komplexität < 15 für Funktionen einhalten
- Komplexe Funktionen in kleinere Helper auslagern

**Sicherheit**:

- **XSS-Schutz**: Die Funktionen von `security-utils.js` verwenden:
  - `appendSanitizedHTML()` anstelle von `innerHTML`
  - `createSafeElement()` zum Erstellen sicherer Elemente
  - `setSafeMessage()` für Textinhalte
- **Externe Skripte**: Attribut `crossorigin="anonymous"` obligatorisch
- **Eingabevalidierung**: Externe Daten immer bereinigen
- **Content Security Policy**: CSP-Header zur Beschränkung der Skriptquellen

**Barrierefreiheit**:

- Konformität mit WCAG 2.1 AA
- Vollständige Tastaturnavigation
- Geeignete ARIA-Rollen und Labels
- Konforme Farbkontraste

**Performance**:

- Lazy Loading der Module über `lazy-loader.js`
- CSS-Optimierungen und responsive Assets
- Service Worker für intelligentes Caching
- Code Splitting und Minifizierung in der Produktion

## 📱 Kompatibilität

### Unterstützte Browser

Die Benutzeroberfläche verwendet `oklch()` für Farben und `:has()` für
kontextbezogene Zustände, wodurch sich folgende Mindestversionen ergeben:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Geräte

- **Desktop**: Steuerung mit Tastatur und Maus
- **Tablets**: Optimierte Touch-Oberfläche
- **Smartphones**: Adaptives Responsive Design

### Barrierefreiheit

- Vollständige Tastaturnavigation (Tab, Pfeiltasten, Escape)
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

**`npm run i18n:verify`** – Konsistenz der Übersetzungsschlüssel überprüfen

**`npm run i18n:unused`** – Nicht verwendete Übersetzungsschlüssel auflisten

**`npm run i18n:compare`** – Übersetzungsdateien mit fr.json (Referenz) vergleichen

Dieses Skript (`scripts/compare-translations.cjs`) stellt die Synchronisierung aller Sprachdateien sicher:

**Funktionen:**

- Erkennung fehlender Schlüssel (in fr.json vorhanden, aber in anderen Sprachen nicht vorhanden)
- Erkennung zusätzlicher Schlüssel (in anderen Sprachen vorhanden, aber nicht in fr.json)
- Identifizierung leerer Werte (`""`, `null`, `undefined`, `[]`)
- Überprüfung der Typkonsistenz (String vs. Array)
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
- Labels für Barrierefreiheit und ARIA

## 🔊 Aufgezeichnete Stimme

Das Spiel liest Fragen, Ermutigungen und Erklärungen mit einer vorab aufgezeichneten synthetischen Stimme laut vor:

- auf Französisch **Lucie**, erstellt mit ElevenLabs (Modell Eleven v3);
- auf Englisch **Jane**, erstellt mit Mistral AI (Voxtral TTS).

Das Spiel verwendet nur eine begrenzte Anzahl von Sätzen, etwa 7.400 pro Sprache: Alle werden im Voraus aufgezeichnet und kein Teil ruft einen Sprachsynthesedienst auf. Für Spanisch wird vorerst weiterhin die Stimme des Geräts verwendet.

- **Automatischer Fallback** auf die Stimme des Geräts, Satz für Satz: Clip fehlt oder ist fehlerhaft, Wiedergabe wird vom Browser verweigert, Clip startet nicht innerhalb von 1,5 s oder das Gerät ist offline und der Clip nicht im Cache.
- **Einstellungen**: Mit der Sprachtaste in der oberen Leiste lässt sich die Wiedergabe ein- oder ausschalten; das Kontrollkästchen „Aufgezeichnete Stimme“ (Barrierefreiheit und Steuerung) wählt zwischen der aufgezeichneten Stimme (Lucie oder Jane) und der Stimme des Geräts.
- **Offline**: Bereits gehörte Clips bleiben im Cache (Service Worker).

### Die Clips befinden sich nicht in diesem Repository

Die Clips befinden sich in einem privaten Repository und einem eigenen S3-Bucket, der über CloudFront unter `/voice/*` bereitgestellt wird. Ein Fork oder die lokale Entwicklungsumgebung verwendet daher weiterhin die Stimme des Geräts: Im Repository ist das Tag `<meta name="leapmultix-voice-base">` leer und nur das Produktions-Deployment trägt dort `/voice/` ein.

Wenn die Clips lokal verfügbar sind (das private Repository wurde neben dem Spiel nach `../leapmultix-voices` geklont), sorgt der Parameter `?voix=local` dafür, dass sie vom Entwicklungsserver wiedergegeben werden:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Clips generieren

Die Pipeline ist in `scripts/voice/` skriptgesteuert und wird auf dem Rechner des Eigentümers ausgeführt, niemals in der öffentlichen CI. Die Schlüssel der Anbieter (ElevenLabs für Französisch, Mistral für Englisch) verbleiben in einer Datei `.env` außerhalb des Repositorys, die über `node --env-file` übergeben wird: Kein Schlüssel gelangt in Git. Der Claude-Code-Skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) führt Schritt für Schritt durch das Verfahren (Prüfpunkte, Freigaben, Wiederaufnahmen); Einzelheiten stehen in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Schätzen** der verbleibenden Sätze und der abzurechnenden Zeichen (Eleven v3: etwa 0,53 Credits pro Zeichen; Voxtral TTS: 16 $ pro Million Zeichen).
2. **Generieren**. Wird derselbe Befehl erneut ausgeführt, wird mit den fehlenden Elementen fortgefahren. Sind die Credits aufgebraucht, beendet sich das Skript ordnungsgemäß (Code 3), ohne eine teilweise geschriebene Datei zu hinterlassen. `--max-total-chars` begrenzt die Gesamtausgaben der Version: Jede kostenpflichtige Antwort wird unmittelbar nach ihrem Eingang in einem Register erfasst, das auch einen abrupten Abbruch übersteht. Bei Mistral, wo kein auslesbares Guthaben verfügbar ist, ist dies der einzige Schutz.
3. **Prüfen**: Jeder Satz besitzt einen Clip und jede MP3-Datei ist gültig. Anschließend transkribiert Whisper jeden Clip lokal, und die Prüfung meldet falsch verstandene Zahlen sowie ungewöhnliche Laufzeiten. `voice:review` führt Whisper, diese Prüfung und die Anhörseite mit einem einzigen Befehl nacheinander aus.
4. **Anhören** der gemeldeten Clips und einer Auswahl weiblicher Formen („une fois 7“), die Whisper nicht unterscheidet, auf der Anhörseite (`voice:listen`). Jeder Clip besitzt ein Kontrollkästchen „erneut erstellen“, das ihn der Liste der verworfenen Clips hinzufügt.
5. **Erneut erstellen** der verworfenen Clips (`--redo`) und erneutes Ausführen von Whisper; anschließend jeden Clip auf einer zweiten Seite vor und nach der Neuerstellung vergleichen. Ein Clip, der nach zwei oder drei Versuchen weiterhin falsch ausgesprochen wird, erhält in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`) einen vorgegebenen Text, beispielsweise die ausgeschriebene Zahl.
6. **Veröffentlichen** der Clips, Überprüfung ihrer Online-Erreichbarkeit und anschließende Veröffentlichung des Sprachindex, zunächst für die Tester (`?voix=test`).
7. **Freigeben** der Stimme für alle und anschließendes Aktivieren als Standard. Der Notausschalter (`voice:publish -- remove`) entfernt eine Sprache aus dem Index: Das Spiel kehrt zur Stimme des Geräts zurück.

```bash
# 1. Estimer (sans frais)
npm run voice:generate -- --lang fr --dry-run
# 2. Générer (payant), plafond cumulé en caractères ; --reserve protège les crédits ElevenLabs
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --reserve 5000 --max-total-chars <plafond>
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang en --max-total-chars <plafond>
# 3. Contrôler : Whisper (installé une fois : voir l'en-tête de whisper_transcribe.py), contrôle, page d'écoute
npm run voice:review -- --lang fr
npm run voice:check -- --lang fr --probe
# 4. Écouter sur la page indiquée (la liste « à refaire » va dans ecartes.txt)
# 5. Refaire (payant), puis comparer avant/après (Whisper ne transcrit que les clips refaits)
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --redo ecartes.txt --max-total-chars <plafond>
npm run voice:review -- --lang fr --compare ecartes.txt
# 6. Publier
npm run voice:publish -- clips --lang fr --bucket <bucket>
npm run voice:check-online -- --lang fr
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience test
# 7. Ouvrir
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience all --default-on
```

### Regel: Ein geänderter gesprochener Satz wird vor dem Produktionsstart neu aufgezeichnet

Jeder gesprochene Satz stammt aus den Übersetzungen (`assets/translations/{fr,en,es}.json`) und ist Teil des Korpus. Die Änderung eines gesprochenen Satzes führt daher dazu, dass der Test der Korpussperre (`scripts/voice/corpus.lock.json`) fehlschlägt. Für eine Sprache mit aufgezeichneter Stimme werden dann die Clips der betroffenen Sätze generiert, geprüft und angehört und anschließend **vor** dem Zusammenführen veröffentlicht. Abschließend wird die Sperre aktualisiert (`npm run voice:corpus:lock`). Ohne diese Clips wird der geänderte Satz mit der Stimme des Geräts vorgelesen.

## 📊 Datenspeicherung

### Benutzerdaten

- Profile und Einstellungen
- Fortschritt je Spielmodus
- Punktzahlen und Statistiken der Arcade-Spiele
- Personalisierungseinstellungen

### Technische Funktionen

- Lokale Speicherung (localStorage) mit Fallbacks
- Trennung der Daten nach Benutzer
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

Dieses Projekt steht unter der Lizenz AGPL v3. Weitere Einzelheiten finden Sie in der Datei `LICENSE`.

---

_LeapMultix — freie Lernanwendung zum Erlernen der vier Grundrechenarten_

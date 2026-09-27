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
- [Aufgenommene Stimme](#-aufgenommene-stimme)
- [Datenspeicherung](#-datenspeicherung)
- [Ein Problem melden](#-ein-problem-melden)
- [Lizenz](#-lizenz)

## Beschreibung

LeapMultix ist eine interaktive Bildungs-Webanwendung für Kinder von 6 bis 12 Jahren, um die 4 Grundrechenarten zu meistern: Multiplikation (×), Addition (+), Subtraktion (−) und Division (÷). Sie bietet **5 Spielmodi** und **4 Arcade-Minispiele** in einer intuitiven, barrierefreien und mehrsprachigen Benutzeroberfläche.

**Unterstützung mehrerer Rechenarten:** Alle fünf Modi unterstützen die vier Grundrechenarten. Die Auswahl erfolgt auf dem Startbildschirm und gilt für den gesamten Durchlauf.

**Entwickelt von:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## 📸 Übersicht

### Die Bildschirme

|                                                                                                                                       |                                                                                                                              |
| :-----------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|                                ![Bildschirm „Wer spielt?“: Profilauswahl](docs/media/01-accueil.webp)                                 |                        ![Hauptmenü: Auswahl der Rechenart und der fünf Modi](docs/media/02-menu.webp)                        |
|                               **Wer spielt?** — ein Profil pro Kind mit eigenem Avatar und Fortschritt.                               |                  **Das Menü** — hier wird die Rechenart gewählt, anschließend stehen die fünf Modi bereit.                   |
|                       ![Entdeckungsmodus: Die 4er-Reihe in Punkten dargestellt](docs/media/03-decouverte.webp)                        |                   ![Quizmodus: falsche Antwort in Rot, richtige Antwort in Grün](docs/media/04-quiz.webp)                    |
|          **Entdeckung** — jede Gleichung wird in Punkten, Sprüngen oder als Zählung dargestellt, samt Rechentrick zur Reihe.          | **Quiz** — die Auswahl des Kindes bleibt neben der richtigen Antwort stehen, und die Erklärung erläutert die Rechnung genau. |
|                            ![Herausforderungsmodus: Countdown und laufende Serie](docs/media/05-defi.webp)                            |                 ![Abenteuermodus: Karte der zehn Level, nachfolgende gesperrt](docs/media/06-aventure.webp)                  |
| **Herausforderung** — Wettlauf gegen die Zeit. Bei einem Fehler hält der Timer an, um Zeit zum Lesen der richtigen Antwort zu lassen. |                       **Abenteuer** — zehn Level, die nacheinander gegen Sterne freigeschaltet werden.                       |
|                                    ![Arcade-Menü: Die vier Minispiele](docs/media/07-arcade.webp)                                     |                      ![Dashboard: Sterne pro Reihe und Statistiken](docs/media/08-tableau-de-bord.webp)                      |
|                           **Arcade** — vier Minispiele mit Schwierigkeitseinstellung und Raumschiffauswahl.                           |                         **Dashboard** — Sterne pro Reihe, zu wiederholende Reihen, Punkte pro Modus.                         |
|                         ![Anpassung: Avatare, Themes, Barrierefreiheit](docs/media/09-personnalisation.webp)                          |                                                                                                                              |
|                            **Anpassung** — Avatar, Farbschema, Textgröße, hoher Kontrast, PIN für Eltern.                             |                                                                                                                              |

### Die Arcade-Minispiele

Vier Spiele, die dieselbe Frage stellen – die oberhalb des Spielfelds zusammen mit der
verbleibenden Zeit und den Leben angezeigt wird –, aber jedes Mal eine andere Aktion
erfordern.

|                                                                                                                    |                                                                                                             |
| :----------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
|  ![MultiInvaders: Monster mit Zahlen, ein Raumschiff am unteren Bildschirmrand](docs/media/10-multiinvaders.webp)  |   ![MultiMiam: Ein Labyrinth, in dem Punkte die möglichen Antworten tragen](docs/media/11-multimiam.webp)   |
| **MultiInvaders** — falsche Antworten abschießen, die richtige verschonen: Sie verbirgt einen Freund zum Befreien. | **MultiMiam** — durch das Labyrinth laufen, um das richtige Ergebnis einzusammeln, und Monstern ausweichen. |
|       ![MultiMemory: Ein Kartengitter, zwei umgedreht mit Rechnung und Zahl](docs/media/12-multimemory.webp)       |      ![MultiSnake: Eine Schlange und nummerierte Äpfel auf einer Wiese](docs/media/13-multisnake.webp)      |
|      **MultiMemory** — aus dem Gedächtnis finden, welche Karte das Ergebnis der aufgedeckten Rechnung zeigt.       |            **MultiSnake** — wachsen, indem man die richtigen Zahlen frisst, alle anderen meiden.            |

## ✨ Funktionen

### 🎮 Spielmodi

- **Entdeckungsmodus**: Visuelle und interaktive Erkundung, angepasst an jede Rechenart
- **Quizmodus**: Multiple-Choice-Fragen mit Unterstützung aller 4 Rechenarten (×, +, −, ÷) und adaptiver Progression
- **Herausforderungsmodus**: Wettlauf gegen die Zeit mit allen 4 Rechenarten (×, +, −, ÷) und verschiedenen Schwierigkeitsgraden
- **Abenteuermodus**: Narrative Progression über Level hinweg mit Unterstützung aller 4 Rechenarten

### 🕹️ Arcade-Minispiele

- **MultiInvaders**: Pädagogisches Space Invaders – Falsche Antworten zerstören
- **MultiMiam**: Mathematisches Pac-Man – Richtige Antworten einsammeln
- **MultiMemory**: Memory-Spiel – Rechnungen und Ergebnisse einander zuordnen
- **MultiSnake**: Pädagogisches Snake – Wachsen durch das Fressen der richtigen Zahlen

### ➕ Multi-Rechenarten-Unterstützung

LeapMultix bietet ein umfassendes Training für alle 4 Grundrechenarten in **allen Modi**:

| Modus           | ×   | +   | −   | ÷   |
| --------------- | --- | --- | --- | --- |
| Quiz            | ✅  | ✅  | ✅  | ✅  |
| Herausforderung | ✅  | ✅  | ✅  | ✅  |
| Entdeckung      | ✅  | ✅  | ✅  | ✅  |
| Abenteuer       | ✅  | ✅  | ✅  | ✅  |
| Arcade          | ✅  | ✅  | ✅  | ✅  |

### 🌍 Übergreifende Funktionen

- **Mehrbenutzer**: Verwaltung einzelner Profile mit gespeichertem Fortschritt
- **Mehrsprachig**: Unterstützung für Französisch, Englisch und Spanisch
- **Personalisierung**: Avatare, Farbschemata, Hintergründe
- **Barrierefreiheit**: Tastaturnavigation, Touch-Unterstützung, Konformität mit WCAG 2.1 AA
- **Aufgenommene Stimme**: Das Spiel kann Fragen und Ermutigungen mit einer voraufgezeichneten synthetischen Stimme vorlesen, mit automatischem Fallback auf die Systemstimme des Geräts. Die Stimmen befinden sich nicht in diesem Repository: Die Website leapmultix.jls42.org stellt Lucie auf Französisch bereit, Sulafat auf Englisch und Spanisch sowie wahlweise Jane auf Englisch (siehe [Aufgenommene Stimme](#-aufgenommene-stimme))
- **Mobile Responsive**: Optimierte Benutzeroberfläche für Tablets und Smartphones
- **Fortschrittssystem**: Punkte, Abzeichen, tägliche Herausforderungen

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
npm run voice:generate     # Générer les clips (ElevenLabs, Google ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Architektur

### Dateistruktur

Die JavaScript-Module liegen **flach in `js/`**, abgesehen von drei Ordnern:
`core/`, `components/` und `modes/`. Die Gruppierung erfolgt daher über den
Dateinamen (`arcade-*`, `multimiam-*`, `i18n*`…).

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

**Wiederverwendbare Komponenten**: Benutzeroberfläche aufgebaut mit zentralisierten UI-Komponenten (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligentes Nachladen von Modulen bei Bedarf über `lazy-loader.js`, um die anfängliche Performance zu optimieren.

**Einheitliches Speichersystem**: Zentralisierte API zur Persistenz von Benutzerdaten über LocalStorage mit Fallbacks.

**Zentralisierte Audioverwaltung**: Soundsteuerung mit Mehrsprachenunterstützung und Einstellungen pro Benutzer.

**Event Bus**: Entkoppelte ereignisbasierte Kommunikation zwischen Komponenten für eine wartbare Architektur.

**Folienbasierte Navigation**: Navigationssystem basierend auf nummerierten Folien (slide0, slide1 etc.) mit `goToSlide()`.

**Sicherheit**: XSS-Schutz und Bereinigung über `security-utils.js` für alle DOM-Manipulationen.

## 🎯 Detaillierte Spielmodi

### Entdeckungsmodus

Visuelle Erkundungsoberfläche für das Einmaleins mit:

- Interaktiver Visualisierung von Multiplikationen
- Animationen und Merkhilfen
- Pädagogischem Drag & Drop
- Freiem Fortschritt pro Reihe

### Quizmodus

Multiple-Choice-Fragen mit:

- 10 Fragen pro Durchgang
- Adaptiver Progression basierend auf Erfolgen
- Virtuellem Ziffernblock
- Streak-System (Serie richtiger Antworten)

### Herausforderungsmodus

Wettlauf gegen die Zeit mit:

- 3 Schwierigkeitsgraden (Anfänger, Mittel, Schwer)
- Zeitbonus für richtige Antworten
- Lebenssystem
- Highscore-Bestenliste

### Abenteuermodus

Narrative Progression mit:

- 10 freischaltbaren thematischen Leveln
- Interaktiver Karte mit visueller Fortschrittsanzeige
- Immersiver Geschichte mit Charakteren
- Sternen- und Belohnungssystem

### Arcade-Minispiele

Jedes Minispiel bietet:

- Auswahl des Schwierigkeitsgrads und Personalisierung
- Lebens- und Punktesystem
- Tastatur- und Touch-Steuerung
- Individuelle Bestenlisten pro Benutzer

## 🔧 Entwicklung

### Entwicklungs-Workflow

**Niemals direkt auf main committen.** Im Projekt wird mit Feature-Branches gearbeitet.

**1. Einen Branch erstellen**, `feat/` für ein Feature, `fix/` für einen Fix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Entwickeln und überprüfen.** Die Formatierung kommt zuerst: Die CI bricht ab,
noch bevor die Tests ausgeführt werden.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Auf den Branch committen**, dann pushen:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Einen Pull Request öffnen** und die Analysen abwarten: verify, Codacy,
CodeFactor und SonarCloud. Es wird nachgebessert, bis alles grün ist, bevor gemergt wird.

**Commit-Stil**: Prägnante Nachrichten im Imperativ (z. B. "Fix arcade init errors", "Refactor cache updater")

**Quality Gate**: Sicherstellen, dass `npm run lint`, `npm test` und `npm run test:coverage` vor jedem Commit erfolgreich durchlaufen

### Komponentenarchitektur

**GameMode (Basisklasse)**: Alle Modi erben von einer gemeinsamen Klasse mit standardisierten Methoden.

**GameModeManager**: Zentrale Orchestrierung des Starts und der Verwaltung der Modi.

**UI-Komponenten**: TopBar, InfoBar, Dashboard und Customization bieten eine einheitliche Oberfläche.

**Lazy Loading**: Module werden bei Bedarf geladen, um die anfängliche Performance zu optimieren.

**Event Bus**: Entkoppelte Kommunikation zwischen Komponenten über das Ereignissystem.

### Tests

Das Projekt umfasst eine vollständige Testsuite:

- Unit-Tests der Kernmodule
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

- **Rollup**: Bündelt `js/main-es6.js` in ESM mit Code-Splitting und Sourcemaps
- **Terser**: Automatische Minifizierung zur Optimierung
- **Post-Build**: Kopiert `css/` und `assets/`, die Favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` und schreibt `dist/index.html` auf die gehashte Einstiegsdatei um (z. B. `main-es6-*.js`)
- **Zielordner**: `dist/` bereit für die statische Bereitstellung

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Kontinuierliche Integration

**GitHub Actions**: `.github/workflows/ci.yml`, ausgelöst bei jedem Push auf
`main` und bei jedem Pull Request.

**`verify`** — das blockierende Quality Gate:

- `npm ci`, danach `npm run verify` (ESLint, Jest-Tests, Abdeckung)
- `npm run format:check` (Prettier)

**`seo-report`** — nach `verify`: Lighthouse-Audit der Live-Website, um
SEO-Metriken im Zeitverlauf zu überwachen.

**Externe Analysen**, angebunden an Pull Requests: Codacy, CodeFactor und
SonarCloud. Das SonarCloud-Gate verlangt für neuen Code A-Bewertungen in Zuverlässigkeit, Sicherheit und
Wartbarkeit.

**Bereitstellung**: `./deploy.sh` synchronisiert die Website nach S3 und invalidiert den Cache
von CloudFront. Das Skript generiert bei Bedarf responsive Bilder neu, die nicht in Git enthalten sind.

### PWA (Progressive Web App)

LeapMultix ist eine vollwertige PWA mit Offline-Unterstützung und Installationsmöglichkeit.

**Service Worker** (`sw.js`):

- Navigation: Network-first mit Offline-Fallback zu `offline.html`
- Bilder: Cache-first zur Performanceoptimierung
- Übersetzungen: Stale-while-revalidate für Aktualisierungen im Hintergrund
- JS/CSS: Network-first, um stets die neueste Version auszuliefern
- Automatische Versionsverwaltung über `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- und PNG-Icons für alle Geräte
- Installation auf Mobilgeräten möglich (Add to Home Screen)
- Standalone-Konfiguration für ein App-ähnliches Erlebnis
- Unterstützung von Themes und Farben

**Den Offline-Modus lokal testen.** Den Server starten, dann
`http://localhost:8080` (oder den angezeigten Port) öffnen:

```bash
npm run serve
```

Manuell: Das Netzwerk in den Entwicklertools trennen (Reiter Netzwerk,
Offline-Modus) und die Seite aktualisieren. `offline.html` muss angezeigt werden.

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

**Code-Qualitätswerkzeuge**:

- **ESLint**: Moderne Konfiguration mit Flat Config (`eslint.config.js`), ES2022-Unterstützung
- **Prettier**: Automatische Codeformatierung (`.prettierrc`)
- **Stylelint**: CSS-Validierung (`.stylelintrc.json`)
- **JSDoc**: Automatische Funktionsdokumentation mit Abdeckungsanalyse

**Wichtige Coderegeln**:

- Nicht verwendete Variablen und Parameter entfernen (`no-unused-vars`)
- Spezifische Fehlerbehandlung verwenden (keine leeren Catch-Blöcke)
- `innerHTML` zugunsten von `security-utils.js`-Funktionen vermeiden
- Kognitive Komplexität < 15 für Funktionen beibehalten
- Komplexe Funktionen in kleinere Helper auslagern

**Sicherheit**:

- **XSS-Schutz**: Funktionen von `security-utils.js` verwenden:
  - `appendSanitizedHTML()` anstelle von `innerHTML`
  - `createSafeElement()` zum Erstellen sicherer Elemente
  - `setSafeMessage()` für Textinhalte
- **Externe Skripte**: Erforderliches `crossorigin="anonymous"`-Attribut
- **Eingabevalidierung**: Externe Daten immer bereinigen
- **Content Security Policy**: CSP-Header zur Einschränkung von Skriptquellen

**Barrierefreiheit**:

- WCAG 2.1 AA-Konformität
- Vollständige Tastaturnavigation
- Passende ARIA-Rollen und Labels
- Konforme Farbkontraste

**Leistung**:

- Lazy Loading von Modulen über `lazy-loader.js`
- CSS-Optimierungen und responsive Assets
- Service Worker für intelligentes Caching
- Code-Splitting und Minifizierung in der Produktion

## 📱 Kompatibilität

### Unterstützte Browser

Die Benutzeroberfläche stützt sich auf `oklch()` für Farben und auf `:has()` für
kontextuelle Zustände, was die Mindestvoraussetzungen festlegt:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Geräte

- **Desktop**: Tastatur- und Maussteuerung
- **Tablets**: Optimierte Touch-Bedienung
- **Smartphones**: Adaptives responsives Design

### Barrierefreiheit

- Vollständige Tastaturnavigation (Tab, Pfeiltasten, Esc)
- ARIA-Rollen und Labels für Screenreader
- Konforme Farbkontraste
- Unterstützung von Hilfstechnologien

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

### i18n-Verwaltungsskripte

**`npm run i18n:verify`** - Konsistenz der Übersetzungsschlüssel prüfen

**`npm run i18n:unused`** - Nicht verwendete Übersetzungsschlüssel auflisten

**`npm run i18n:compare`** - Übersetzungsdateien mit fr.json vergleichen (Referenz)

Dieses Skript (`scripts/compare-translations.cjs`) stellt die Synchronisierung aller Sprachdateien sicher:

**Funktionen:**

- Erkennung fehlender Schlüssel (in fr.json vorhanden, aber in anderen Sprachen fehlend)
- Erkennung überflüssiger Schlüssel (in anderen Sprachen vorhanden, aber nicht in fr.json)
- Identifizierung leerer Werte (`""`, `null`, `undefined`, `[]`)
- Konsistenzprüfung der Typen (String vs. Array)
- Verflachung geschachtelter JSON-Strukturen in Punktnotation (z. B.: `arcade.multiMemory.title`)
- Erstellung eines detaillierten Konsolenberichts
- Speichern des JSON-Berichts in `docs/translations-comparison-report.json`

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
- Fehler- und Feedback-Meldungen
- Beschreibungen und kontextbezogene Hilfe
- Erzählinhalte des Abenteuermodus
- Barrierefreiheits- und ARIA-Labels

## 🔊 Aufgenommene Stimme

Das Spiel liest Fragen, Ermutigungen und Erklärungen laut vor. Es spricht nur eine begrenzte Menge an Sätzen, etwa 7.400 pro Sprache: Sie können daher ein für alle Mal aufgenommen werden, und kein Spieldurchlauf ruft dann einen Sprachsynthesedienst auf. Ohne Clips liest das Spiel mit der Gerätestimme vor.

### In diesem Repository: die Anwendung ohne Stimmen

Der Code kann voraufgenommene Clips abspielen und enthält die Toolchain zu deren Erstellung. Die Clips sind darin nicht enthalten, ebenso wenig wie die API-Schlüssel der Anbieter: Ein Fork oder eine lokale Installation liest mit der Gerätestimme vor.

- **Automatischer Fallback** auf die Gerätestimme, Satz für Satz: Clip fehlt oder ist fehlerhaft, Wiedergabe vom Browser verweigert, Clip startet nicht innerhalb von 1,5 s oder offline ohne gecachten Clip.
- **Einstellungen**: Die Voice-Schaltfläche in der oberen Leiste aktiviert oder deaktiviert das Vorlesen; das Kontrollkästchen „Aufgenommene Stimme“ (Barrierefreiheit und Steuerung) wählt zwischen der aufgenommenen Stimme und der Gerätestimme. Es erscheint nur in Sprachen, für die eine Stimme veröffentlicht ist.
- **Offline**: Bereits gehörte Clips bleiben im Cache (Service Worker).
- **Wo das Spiel nach Clips sucht**: im Tag `<meta name="leapmultix-voice-base">`, leer im Repository. Nur das Produktions-Deployment schreibt dort `/voice/` hinein.

Mit eigenen Clips auf dem Rechner (erstellt durch die unten beschriebene Toolchain, abgelegt neben dem Spiel in `../leapmultix-voices`) sorgt der Parameter `?voix=local` dafür, dass sie vom Entwicklungsserver abgespielt werden:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Auf leapmultix.jls42.org: die Stimmen des Hostings

Die vom Autor bereitgestellte Website liefert aufgenommene Synthesestimmen aus:

- auf Französisch: **Lucie**, erstellt mit ElevenLabs (Modell Eleven v3);
- auf britischem Englisch und spanischem Spanisch: **Sulafat**, erstellt mit Google Cloud Text-to-Speech (Stimme Chirp 3 HD);
- auf Englisch, nach Wahl des Spielers: **Jane**, erstellt mit Mistral AI (Voxtral TTS).

Die Clips liegen in einem privaten Repository und in einem dedizierten S3-Bucket, der über CloudFront unter `/voice/*` bereitgestellt wird. In den Einstellungen bietet das Menü „Stimme“ die Stimmen der Sprache an, wenn mehrere vorhanden sind, und der Hinweis nennt den Dienst der gehörten Stimme.

### Clips generieren

Die Toolchain ist in `scripts/voice/` geskriptet und läuft auf dem Rechner des Betreibers, niemals in der öffentlichen CI. Die Anbieterschlüssel (ElevenLabs für Französisch, Google Cloud Text-to-Speech für Englisch und Spanisch, Mistral für Jane) verbleiben in einer `.env`-Datei außerhalb des Repositorys, übergeben via `node --env-file`: Kein Schlüssel gelangt in Git. Der Claude Code Skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) führt Schritt für Schritt durch das Verfahren (Gates, Freigaben, Wiederholungen); Details befinden sich in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Schätzen** der verbleibenden Sätze und der zu bezahlenden Zeichen (Eleven v3: ca. 0,53 Credits pro Zeichen; Chirp 3 HD: 30 $ pro Million Zeichen, die erste Million pro Monat kostenlos; Voxtral TTS: 16 $ pro Million).
2. **Generieren**. Das erneute Ausführen desselben Befehls setzt dort an, was noch fehlt. Wenn das Guthaben aufgebraucht ist, stoppt das Skript sauber (Exit-Code 3), ohne eine halb geschriebene Datei zu hinterlassen. `--max-total-chars` deckelt die kumulierten Ausgaben der Version: Jede bezahlte Antwort wird direkt nach Eingang in einem Register vermerkt, das auch einen plötzlichen Abbruch übersteht. Bei Google und Mistral, die kein einsehbares Guthaben liefern, ist dies der einzige Schutz.
3. **Prüfen**: Jeder Satz hat seinen Clip und jede MP3-Datei ist gültig. Whisper transkribiert anschließend jeden Clip lokal, und die Prüfung meldet falsch verstandene Zahlen sowie unnormale Laufzeiten. `voice:review` führt Whisper, diese Prüfung und die Abhörseite in einem einzigen Befehl nacheinander aus.
4. **Abhören** der gemeldeten Clips sowie einer Stichprobe weiblicher Formen („une fois 7“), die Whisper nicht unterscheidet, auf der Abhörseite (`voice:listen`). Jeder Clip hat ein Kontrollkästchen „Wiederholen“, das ihn zur Liste der verworfenen Clips hinzufügt.
5. **Wiederholen** der verworfenen Clips (`--redo`) und erneutes Ausführen von Whisper, anschließend Vergleichen jedes Clips vor und nach der Änderung auf einer zweiten Seite. Ein Clip, der nach zwei oder drei Versuchen immer noch falsch ausgesprochen wird, erhält einen erzwungenen Text in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), z. B. die Zahl als Wort ausgeschrieben.
6. **Veröffentlichen** der Clips, Überprüfen, ob sie online erreichbar sind, und anschließendes Veröffentlichen des Sprachindexes, zunächst für Tester (`?voix=test`).
7. **Freigeben** der Stimme für alle und anschließende Aktivierung als Standard. Der Not-Aus-Schalter (`voice:publish -- remove`) entfernt eine Sprache aus dem Index: Das Spiel fällt auf die Gerätestimme zurück.

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

### Regel: Ein geänderter gesprochener Satz wird vor dem Release in die Produktion neu aufgenommen

Jeder gesprochene Satz stammt aus den Übersetzungen (`assets/translations/{fr,en,es}.json`) und ist Teil des Korpus. Die Änderung eines gesprochenen Satzes führt daher zum Fehlschlagen des Korpus-Lock-Tests (`scripts/voice/corpus.lock.json`). Für eine Sprache, die über eine aufgenommene Stimme verfügt, werden dann die Clips der betroffenen Sätze generiert, geprüft und abgehört und anschließend **vor** dem Mergen veröffentlicht. Schließlich wird das Lockfile aktualisiert (`npm run voice:corpus:lock`). Ohne diese Clips wird der geänderte Satz mit der Gerätestimme vorgelesen.

## 📊 Datenspeicherung

### Benutzerdaten

- Profile und Einstellungen
- Fortschritt pro Spielmodus
- Punktzahlen und Statistiken der Arcade-Spiele
- Personalisierungseinstellungen

### Technische Merkmale

- Lokale Speicherung (localStorage) mit Fallbacks
- Datentrennung pro Benutzer
- Automatisches Speichern des Fortschritts
- Automatische Migration älterer Daten

## 🐛 Ein Problem melden

Probleme können über GitHub Issues gemeldet werden. Bitte folgendes angeben:

- Detaillierte Problembeschreibung
- Schritte zur Reproduktion
- Browser und Version
- Screenshots, falls relevant

## 💝 Das Projekt unterstützen

**[☕ Über PayPal spenden](https://paypal.me/jls)**

## 📄 Lizenz

Dieses Projekt steht unter der AGPL v3-Lizenz. Weitere Details finden sich in der Datei `LICENSE`.

---

_LeapMultix — freie Bildungs-App zum Erlernen der vier Grundrechenarten_

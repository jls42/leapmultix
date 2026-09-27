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

LeapMultix ist eine interaktive Lern-Web-App für Kinder von 6 bis 12 Jahren zum Meistern der 4 Grundrechenarten: Multiplikation (×), Addition (+), Subtraktion (−) und Division (÷). Sie bietet **5 Spielmodi** und **4 Arcade-Minispiele** in einer intuitiven, barrierefreien und mehrsprachigen Benutzeroberfläche.

**Unterstützung mehrerer Rechenarten:** Alle fünf Modi unterstützen die vier Grundrechenarten. Die Auswahl erfolgt auf dem Startbildschirm und gilt für den gesamten Verlauf.

**Entwickelt von:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## 📸 Übersicht

### Die Bildschirme

|                                                                                                                                   |                                                                                                                                    |
| :-------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: |
|                              ![Bildschirm „Wer spielt?“: Profilauswahl](docs/media/01-accueil.webp)                               |                           ![Hauptmenü: Auswahl der Rechenart und der fünf Modi](docs/media/02-menu.webp)                           |
|                              **Wer spielt?** – Ein Profil pro Kind, mit Avatar und Lernfortschritt.                               |                        **Das Menü** – Die Rechenart wird hier ausgewählt, danach öffnen sich die fünf Modi.                        |
|                      ![Entdecker-Modus: Die 4er-Reihe in Punkten dargestellt](docs/media/03-decouverte.webp)                      |                      ![Quiz-Modus: Falsche Antwort in Rot, richtige Antwort in Grün](docs/media/04-quiz.webp)                      |
| **Entdecken** – Jede Gleichung wird in Punkten, Sprüngen oder durch Zählen dargestellt, zusammen mit dem Rechentrick der Tabelle. | **Quiz** – Die Auswahl des Kindes bleibt neben der richtigen Antwort sichtbar, und die Erklärung erläutert die Rechnung im Detail. |
|                         ![Herausforderungs-Modus: Countdown und aktuelle Serie](docs/media/05-defi.webp)                          |                    ![Abenteuer-Modus: Karte der zehn Level, nachfolgende gesperrt](docs/media/06-aventure.webp)                    |
| **Herausforderung** – Wettlauf gegen die Zeit. Bei einem Fehler stoppt die Zeit, damit die richtige Antwort gelesen werden kann.  |                         **Abenteuer** – Zehn Level, die nach und nach gegen Sterne freigeschaltet werden.                          |
|                                  ![Arcade-Menü: Die vier Minispiele](docs/media/07-arcade.webp)                                   |                         ![Dashboard: Sterne pro Reihe und Statistiken](docs/media/08-tableau-de-bord.webp)                         |
|                     **Arcade** – Vier Minispiele mit einstellbarem Schwierigkeitsgrad und Raumschiffauswahl.                      |                        **Dashboard** – Sterne pro Reihe, zu wiederholende Reihen, Punktestände nach Modus.                         |
|                 ![Personalisierung: Avatare, Farbschemata, Barrierefreiheit](docs/media/09-personnalisation.webp)                 |                                                                                                                                    |
|                         **Personalisierung** – Avatar, Farbschema, Textgröße, hoher Kontrast, Elterncode.                         |                                                                                                                                    |

### Die Arcade-Minispiele

Vier Spiele, die dieselbe Frage stellen – die oberhalb des Spielfelds zusammen mit der
verbleibenden Zeit und den Leben angezeigt wird –, aber jedes Mal eine andere Aktion
erfordern.

|                                                                                                                                       |                                                                                                                  |
| :-----------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: |
|           ![MultiInvaders: Monster mit Zahlen, ein Raumschiff am unteren Bildschirmrand](docs/media/10-multiinvaders.webp)            |     ![MultiMiam: Ein Labyrinth, in dem Punkte die möglichen Antworten tragen](docs/media/11-multimiam.webp)      |
| **MultiInvaders** – Auf die falschen Antworten schießen, die richtige verschonen: Sie verbirgt einen Freund, den es zu befreien gilt. | **MultiMiam** – Durch das Labyrinth navigieren, um das richtige Ergebnis einzusammeln und Monstern auszuweichen. |
|     ![MultiMemory: Ein Kartengitter, zwei aufgedeckte Karten zeigen eine Rechnung und eine Zahl](docs/media/12-multimemory.webp)      |        ![MultiSnake: Eine Schlange und nummerierte Äpfel auf einer Wiese](docs/media/13-multisnake.webp)         |
|             **MultiMemory** – Aus dem Gedächtnis herausfinden, welche Karte das Ergebnis der aufgedeckten Rechnung zeigt.             |         **MultiSnake** – Wachsen, indem die richtigen Zahlen gefressen werden, allen anderen ausweichen.         |

## ✨ Funktionen

### 🎮 Spielmodi

- **Entdecker-Modus**: Visuelle und interaktive Erkundung, angepasst an jede Rechenart
- **Quiz-Modus**: Multiple-Choice-Fragen mit Unterstützung aller 4 Grundrechenarten (×, +, −, ÷) und adaptivem Lernfortschritt
- **Herausforderungs-Modus**: Wettlauf gegen die Zeit mit den 4 Grundrechenarten (×, +, −, ÷) und verschiedenen Schwierigkeitsgraden
- **Abenteuer-Modus**: Narrative Progression über Level hinweg mit Unterstützung der 4 Grundrechenarten

### 🕹️ Arcade-Minispiele

- **MultiInvaders**: Pädagogisches Space Invaders – Die falschen Antworten zerstören
- **MultiMiam**: Mathematisches Pac-Man – Die richtigen Antworten einsammeln
- **MultiMemory**: Gedächtnisspiel – Rechnungen und Ergebnisse einander zuordnen
- **MultiSnake**: Pädagogisches Snake – Wachsen, indem die richtigen Zahlen gefressen werden

### ➕ Unterstützung mehrerer Rechenarten

LeapMultix bietet ein umfassendes Training aller 4 Grundrechenarten in **allen Modi**:

| Modus           | ×   | +   | −   | ÷   |
| --------------- | --- | --- | --- | --- |
| Quiz            | ✅  | ✅  | ✅  | ✅  |
| Herausforderung | ✅  | ✅  | ✅  | ✅  |
| Entdecken       | ✅  | ✅  | ✅  | ✅  |
| Abenteuer       | ✅  | ✅  | ✅  | ✅  |
| Arcade          | ✅  | ✅  | ✅  | ✅  |

### 🌍 Übergreifende Funktionen

- **Mehrbenutzer**: Verwaltung individueller Profile mit gespeichertem Fortschritt
- **Mehrsprachigkeit**: Unterstützung für Französisch, Englisch und Spanisch
- **Personalisierung**: Avatare, Farbschemata, Hintergründe
- **Barrierefreiheit**: Tastaturnavigation, Touch-Unterstützung, Konformität mit WCAG 2.1 AA
- **Aufgenommene Stimme**: Das Spiel kann Fragen und Ermutigungen mit einer voraufgezeichneten synthetischen Stimme vorlesen, mit automatischem Fallback auf die Systemstimme des Geräts. Die Stimmen befinden sich nicht in diesem Repository: Die Website leapmultix.jls42.org stellt Lucie auf Französisch, Sulafat auf Englisch und Spanisch sowie wahlweise Marie auf Französisch und Jane auf Englisch bereit (siehe [Aufgenommene Stimme](#-aufgenommene-stimme))
- **Mobile Responsive**: Optimierte Benutzeroberfläche für Tablets und Smartphones
- **Fortschrittssystem**: Punktestände, Abzeichen, tägliche Herausforderungen

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
`core/`, `components/` und `modes/`. Die Gruppierung ergibt sich daher
aus dem Dateinamen (`arcade-*`, `multimiam-*`, `i18n*`…).

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

**Lazy Loading**: Intelligentes Laden von Modulen bei Bedarf über `lazy-loader.js`, um die anfängliche Performance zu optimieren.

**Einheitliches Speichersystem**: Zentralisierte API zur Persistenz von Benutzerdaten über LocalStorage mit Fallbacks.

**Zentralisierte Audio-Verwaltung**: Audiosteuerung mit Mehrsprachenunterstützung und Einstellungen pro Benutzer.

**Event Bus**: Entkoppelte ereignisbasierte Kommunikation zwischen Komponenten für eine wartbare Architektur.

**Folienbasierte Navigation**: Navigationssystem basierend auf nummerierten Folien (slide0, slide1 etc.) mit `goToSlide()`.

**Sicherheit**: XSS-Schutz und Bereinigung über `security-utils.js` für alle DOM-Manipulationen.

## 🎯 Detaillierte Spielmodi

### Entdecker-Modus

Oberfläche zur visuellen Erkundung des Einmaleins mit:

- Interaktiver Visualisierung von Multiplikationen
- Animationen und Merkhilfen
- Pädagogischem Drag-and-Drop
- Freiem Fortschritt nach Reihe

### Quiz-Modus

Multiple-Choice-Fragen mit:

- 10 Fragen pro Durchgang
- Adaptivem Fortschritt je nach Trefferquote
- Virtuellem Ziffernblock
- Streak-System (Serie richtiger Antworten)

### Herausforderungs-Modus

Wettlauf gegen die Zeit mit:

- 3 Schwierigkeitsgraden (Anfänger, Mittel, Schwer)
- Zeitbonus für richtige Antworten
- Lebenssystem
- Bestenliste der Höchstpunktzahlen

### Abenteuer-Modus

Narrative Progression mit:

- 10 freischaltbaren thematischen Leveln
- Interaktiver Karte mit visuellem Fortschritt
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

**Niemals direkt auf main committen.** Im Projekt wird mit Feature-Branches
gearbeitet.

**1. Einen Branch erstellen**, `feat/` für ein Feature, `fix/` für einen Bugfix:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Entwickeln und überprüfen.** Die Formatierung kommt zuerst: Die CI bricht
bereits vor dem Ausführen der Tests ab, wenn die Formatierung nicht stimmt.

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

**Commit-Stil**: Prägnante Nachrichten, Imperativ (z. B.: "Fix arcade init errors", "Refactor cache updater")

**Quality Gate**: Sicherstellen, dass `npm run lint`, `npm test` und `npm run test:coverage` vor jedem Commit erfolgreich durchlaufen

### Komponentenarchitektur

**GameMode (Basisklasse)**: Alle Modi erben von einer gemeinsamen Klasse mit standardisierten Methoden.

**GameModeManager**: Zentralisierte Orchestrierung des Starts und der Verwaltung der Modi.

**UI-Komponenten**: TopBar, InfoBar, Dashboard und Customization bieten eine einheitliche Oberfläche.

**Lazy Loading**: Module werden bei Bedarf geladen, um die initiale Performance zu optimieren.

**Event Bus**: Entkoppelte Kommunikation zwischen Komponenten über das Ereignissystem.

### Tests

Das Projekt enthält eine vollständige Testsuite:

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

### Production-Build

- **Rollup**: Bündelt `js/main-es6.js` in ESM mit Code-Splitting und Sourcemaps
- **Terser**: Automatische Minifizierung zur Optimierung
- **Post-Build**: Kopiert `css/` und `assets/`, die Favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` und schreibt `dist/index.html` auf die gehashte Einstiegsdatei um (z. B.: `main-es6-*.js`)
- **Zielordner**: `dist/` bereit zur statischen Bereitstellung

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Kontinuierliche Integration

**GitHub Actions**: `.github/workflows/ci.yml`, ausgelöst bei jedem Push auf
`main` und bei jedem Pull Request.

**`verify`** – das blockierende Quality Gate:

- `npm ci`, danach `npm run verify` (ESLint, Jest-Tests, Abdeckung)
- `npm run format:check` (Prettier)

**`seo-report`** – nach `verify`: Lighthouse-Audit der Live-Site, um
die SEO-Metriken langfristig zu überwachen.

**Externe Analysen**, die an Pull Requests angebunden sind: Codacy, CodeFactor und
SonarCloud. Das SonarCloud-Gate verlangt A-Bewertungen in Zuverlässigkeit, Sicherheit und
Wartbarkeit für neuen Code.

**Bereitstellung**: `./deploy.sh` synchronisiert die Website nach S3 und invalidiert den
CloudFront-Cache. Das Skript generiert bei Bedarf die responsiven Bilder neu, die nicht in Git enthalten sind.

### PWA (Progressive Web App)

LeapMultix ist eine vollständige PWA mit Offline-Unterstützung und Installationsmöglichkeit.

**Service Worker** (`sw.js`):

- Navigation: Network-First mit Offline-Fallback zu `offline.html`
- Bilder: Cache-First zur Performance-Optimierung
- Übersetzungen: Stale-While-Revalidate für Aktualisierungen im Hintergrund
- JS/CSS: Network-First, um stets die neueste Version auszuliefern
- Automatische Versionsverwaltung über `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- und PNG-Icons für alle Geräte
- Installation auf Mobilgeräten möglich (Zum Startbildschirm hinzufügen)
- Standalone-Konfiguration für ein App-ähnliches Erlebnis
- Unterstützung von Themes und Farben

**Den Offline-Modus lokal testen.** Den Server starten, dann
`http://localhost:8080` (oder den angezeigten Port) aufrufen:

```bash
npm run serve
```

Manuell: Das Netzwerk in den Entwicklertools trennen (Reiter Netzwerk,
Offline-Modus), dann die Seite neu laden. `offline.html` muss angezeigt werden.

Automatisch mit Puppeteer:

```bash
npm run test:pwa-offline
```

**Skripte zur Service-Worker-Verwaltung**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Qualitätsstandards

**Code-Qualitäts-Tools**:

- **ESLint**: Moderne Konfiguration mit Flat Config (`eslint.config.js`), ES2022-Unterstützung
- **Prettier**: Automatische Codeformatierung (`.prettierrc`)
- **Stylelint**: CSS-Validierung (`.stylelintrc.json`)
- **JSDoc**: Automatische Funktionsdokumentation mit Abdeckungsanalyse

**Wichtige Coderegeln**:

- Nicht verwendete Variablen und Parameter entfernen (`no-unused-vars`)
- Spezifische Fehlerbehandlung verwenden (keine leeren catch-Blöcke)
- `innerHTML` zugunsten von `security-utils.js`-Funktionen vermeiden
- Kognitive Komplexität für Funktionen unter 15 halten
- Komplexe Funktionen in kleinere Helper auslagern

**Sicherheit**:

- **XSS-Schutz**: Funktionen aus `security-utils.js` verwenden:
  - `appendSanitizedHTML()` statt `innerHTML`
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
- Code Splitting und Minifizierung in der Produktion

## 📱 Kompatibilität

### Unterstützte Browser

Die Benutzeroberfläche stützt sich auf `oklch()` für Farben und auf `:has()` für
kontextuelle Zustände, was die Mindestanforderung festlegt:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Geräte

- **Desktop**: Tastatur- und Maussteuerung
- **Tablets**: Optimierte Touch-Oberfläche
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

**`npm run i18n:verify`** – Konsistenz der Übersetzungsschlüssel prüfen

**`npm run i18n:unused`** – Nicht verwendete Übersetzungsschlüssel auflisten

**`npm run i18n:compare`** – Übersetzungsdateien mit fr.json (Referenz) vergleichen

Dieses Skript (`scripts/compare-translations.cjs`) stellt die Synchronisierung aller Sprachdateien sicher:

**Funktionen:**

- Erkennung fehlender Schlüssel (in fr.json vorhanden, aber in anderen Sprachen fehlend)
- Erkennung überflüssiger Schlüssel (in anderen Sprachen vorhanden, aber nicht in fr.json)
- Identifizierung leerer Werte (`""`, `null`, `undefined`, `[]`)
- Typenkonsistenzprüfung (String vs. Array)
- Flaches Darstellen verschachtelter JSON-Strukturen in Punktnotation (z. B. `arcade.multiMemory.title`)
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

**Abdeckung der Übersetzungen:**

- Vollständige Benutzeroberfläche
- Spielanleitungen
- Fehlermeldungen und Feedback
- Beschreibungen und kontextbezogene Hilfe
- Narrative Inhalte des Abenteuermodus
- Barrierefreiheits- und ARIA-Labels

## 🔊 Aufgenommene Stimme

Das Spiel liest Fragen, Ermutigungen und Erklärungen laut vor. Es spricht nur eine begrenzte Menge an Sätzen, etwa 7.400 pro Sprache: Sie können daher ein für alle Mal aufgenommen werden, sodass während des Spiels kein Sprachsynthesedienst aufgerufen werden muss. Ohne Audioclips liest das Spiel mit der Stimme des Geräts vor.

### In diesem Repository: die Anwendung, ohne die Stimmen

Der Code kann vorab aufgenommene Clips abspielen und enthält die Toolchain zu deren Erstellung. Die Clips selbst sind darin nicht enthalten, ebenso wenig wie die API-Schlüssel der Anbieter: Ein Fork oder eine lokale Installation liest mit der Stimme des Geräts vor.

- **Automatischer Fallback** auf die Gerätestimme, Satz für Satz: Clip fehlt oder ist fehlerhaft, Wiedergabe vom Browser verweigert, Clip startet nicht innerhalb von 1,5 s oder offline ohne gecachten Clip.
- **Einstellungen**: Die Sprachschaltfläche in der oberen Leiste aktiviert oder deaktiviert die Wiedergabe; das Kontrollkästchen „Aufgenommene Stimme“ (Barrierefreiheit und Steuerung) wählt zwischen der aufgenommenen Stimme und der Gerätestimme. Es erscheint nur in den Sprachen, für die eine Stimme veröffentlicht wurde.
- **Offline**: Bereits gehörte Clips bleiben im Cache (Service Worker).
- **Wo das Spiel nach den Clips sucht**: Im Tag `<meta name="leapmultix-voice-base">`, das im Repository leer ist. Nur das Produktions-Deployment schreibt dort `/voice/` hinein.

Mit eigenen Clips auf dem Rechner (erstellt über die unten beschriebene Toolchain, abgelegt neben dem Spiel in `../leapmultix-voices`) sorgt der Parameter `?voix=local` dafür, dass der Entwicklungsserver sie abspielt:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Auf leapmultix.jls42.org: die Stimmen des Hostings

Die vom Autor bereitgestellte Website liefert aufgenommene synthetische Stimmen:

- auf Französisch: **Lucie**, erstellt mit ElevenLabs (Modell Eleven v3);
- auf britischem Englisch und spanischem Spanisch: **Sulafat**, erstellt mit Google Cloud Text-to-Speech (Stimme Chirp 3 HD);
- nach Wahl des Spielers: **Marie** auf Französisch und **Jane** auf Englisch, erstellt mit Mistral AI (Voxtral TTS).

Die Clips liegen in einem privaten Repository und in einem dedizierten S3-Bucket, der über CloudFront auf `/voice/*` ausgeliefert wird. In den Einstellungen bietet das Menü „Stimme“ die Stimmen der Sprache an, wenn mehrere vorhanden sind, und der Hinweis nennt den Dienst der gehörten Stimme.

### Clips generieren

Die Toolchain ist in `scripts/voice/` skriptgesteuert und läuft auf dem Rechner des Betreibers, niemals in der öffentlichen CI. Die Anbieterschlüssel (ElevenLabs für Französisch, Google Cloud Text-to-Speech für Englisch und Spanisch, Mistral für Marie und Jane) verbleiben in einer `.env`-Datei außerhalb des Repositorys, die über `node --env-file` übergeben wird: Kein Schlüssel gelangt in Git. Der Claude-Code-Skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) führt Schritt für Schritt durch das Verfahren (Gates, Genehmigungen, Wiederaufnahmen); Details finden sich in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Schätzen** der verbleibenden Sätze und der zu bezahlenden Zeichen (Eleven v3: ca. 0,53 Credits pro Zeichen; Chirp 3 HD: 30 $ pro Million Zeichen, die erste Million jedes Monats kostenlos; Voxtral TTS: 16 $ pro Million).
2. **Generieren**. Das erneute Ausführen desselben Befehls setzt dort an, was noch fehlt. Wenn das Guthaben aufgebraucht ist, bricht das Skript sauber ab (Code 3), ohne eine halb geschriebene Datei zu hinterlassen. `--max-total-chars` begrenzt die kumulierten Ausgaben der Version: Jede bezahlte Antwort wird direkt nach Erhalt in einem Register erfasst, das auch einen abrupten Abbruch übersteht. Bei Google und Mistral, die kein einsehbares Guthaben anzeigen, ist dies die einzige Schutzmaßnahme.
3. **Prüfen**: Jeder Satz hat seinen Clip und jede MP3-Datei ist gültig. Whisper transkribiert danach jeden Clip lokal, und die Prüfung meldet falsch verstandene Zahlen sowie unübliche Längen. `voice:review` verkettet Whisper, diese Prüfung und die Abhörseite in einem einzigen Befehl.
4. **Anhören** der gemeldeten Clips sowie einer Stichprobe weiblicher Formen („une fois 7“), die Whisper nicht unterscheidet, auf der Abhörseite (`voice:listen`). Jeder Clip verfügt über ein Kontrollkästchen „neu aufnehmen“, wodurch er der Liste der verworfenen Clips hinzugefügt wird.
5. **Neu aufnehmen** der verworfenen Clips (`--redo`) und erneutes Ausführen von Whisper, anschließend Vorher-Nachher-Vergleich jedes Clips auf einer zweiten Seite. Ein Clip, der nach zwei oder drei Versuchen immer noch fehlerhaft ausgesprochen wird, erhält einen vorgegebenen Text in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), beispielsweise die Zahl als Wort ausgeschrieben.
6. **Veröffentlichen** der Clips, prüfen, ob sie online erreichbar sind, und anschließend den Index der Sprache veröffentlichen, zunächst für Tester (`?voix=test`).
7. **Freigeben** der Stimme für alle und anschließendes Aktivieren als Standard. Der Not-Aus-Schalter (`voice:publish -- remove`) entfernt eine Sprache aus dem Index: Das Spiel wechselt wieder zur Gerätestimme.

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

### Regel: Ein geänderter gesprochener Satz wird vor dem Produktivgang neu aufgenommen

Jeder gesprochene Satz stammt aus den Übersetzungen (`assets/translations/{fr,en,es}.json`) und ist Teil des Korpus. Das Ändern eines gesprochenen Satzes führt daher zum Fehlschlagen des Korpus-Sperrtests (`scripts/voice/corpus.lock.json`). Für eine Sprache mit aufgenommener Stimme generiert man daher die Clips für die betroffenen Sätze, prüft und hört sie an und veröffentlicht sie **vor** dem Mergen. Schließlich aktualisiert man die Sperre (`npm run voice:corpus:lock`). Ohne diese Clips wird der geänderte Satz mit der Gerätestimme vorgelesen.

## 📊 Datenspeicherung

### Benutzerdaten

- Profile und Einstellungen
- Fortschritt nach Spielmodus
- Punktzahlen und Statistiken der Arcade-Spiele
- Personalisierungseinstellungen

### Technische Funktionen

- Lokale Speicherung (localStorage) mit Fallbacks
- Datentrennung pro Benutzer
- Automatisches Speichern des Fortschritts
- Automatische Migration von Altdaten

## 🐛 Ein Problem melden

Probleme können über GitHub-Issues gemeldet werden. Bitte Folgendes angeben:

- Detaillierte Problembeschreibung
- Schritte zur Reproduktion
- Browser und Version
- Screenshots, falls relevant

## 💝 Das Projekt unterstützen

**[☕ Über PayPal spenden](https://paypal.me/jls)**

## 📄 Lizenz

Dieses Projekt ist unter der AGPL v3 lizenziert. Weitere Details finden sich in der Datei `LICENSE`.

---

_LeapMultix – freie Lernanwendung zum Erlernen der vier Grundrechenarten_

<details>
<summary>Dieses Dokument ist auch in anderen Sprachen verfügbar</summary>

- [Englisch](./README.en.md)
- [Spanisch](./README.es.md)
- [Portugiesisch](./README.pt.md)
- [Deutsch](./README.de.md)
- [Chinesisch](./README.zh.md)
- [Hindi](./README.hi.md)
- [Arabisch](./README.ar.md)
- [Italienisch](./README.it.md)
- [Schwedisch](./README.sv.md)
- [Polnisch](./README.pl.md)
- [Niederländisch](./README.nl.md)
- [Rumänisch](./README.ro.md)
- [Japanisch](./README.ja.md)
- [Koreanisch](./README.ko.md)

</details>

# LeapMultix

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Lizenz: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy-Abzeichen](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Status des Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

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
- [Übersicht](#-übersicht)
- [Funktionen](#-funktionen)
- [Schnellstart](#-schnellstart)
- [Architektur](#-architektur)
- [Detaillierte Spielmodi](#-detaillierte-spielmodi)
- [Entwicklung](#-entwicklung)
- [Kompatibilität](#-kompatibilität)
- [Lokalisierung](#-lokalisierung)
- [Aufgezeichnete Stimme](#-aufgenommene-stimme)
- [Datenspeicherung](#-datenspeicherung)
- [Problem melden](#-ein-problem-melden)
- [Lizenz](#-lizenz)

## Beschreibung

LeapMultix ist eine interaktive Lern-Webanwendung für Kinder im Alter von 6 bis 12 Jahren, mit der sie die vier Grundrechenarten beherrschen lernen: Multiplikation (×), Addition (+), Subtraktion (−) und Division (÷). Sie bietet **6 Spielmodi** und **4 Arcade-Minispiele** in einer intuitiven, barrierefreien und mehrsprachigen Benutzeroberfläche.

**Unterstützung mehrerer Rechenarten:** Alle Modi unterstützen die vier Rechenarten. Die Auswahl erfolgt auf dem Startbildschirm und gilt für den gesamten Spielverlauf.

**Entwickelt von:** Julien LS (contact@jls42.org)

**Online-URL:** https://leapmultix.jls42.org/

## 📸 Übersicht

### Die Bildschirme

|                                                                                                                                                   |                                                                                                                            |
| :-----------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: |
|                                      ![Bildschirm „Wer spielt?“: Profilauswahl](docs/media/01-accueil.webp)                                       |                      ![Hauptmenü: Auswahl der Rechenart und des Spielmodus](docs/media/02-menu.webp)                       |
|                                        **Wer spielt?** — ein Profil pro Kind, mit Avatar und Fortschritt.                                         |                     **Das Menü** — hier wird zuerst die Rechenart und dann der Spielmodus ausgewählt.                      |
|                             ![Entdeckungsmodus: die 4er-Reihe als Punkte dargestellt](docs/media/03-decouverte.webp)                              |                  ![Quizmodus: falsche Antwort in Rot, richtige Antwort in Grün](docs/media/04-quiz.webp)                   |
|           **Entdeckung** — jede Gleichung wird als Punkte, Sprünge oder Zählvorgang dargestellt, zusammen mit dem Trick für die Reihe.            | **Quiz** — die Auswahl des Kindes bleibt neben der richtigen Antwort sichtbar, und die Erklärung erläutert die Berechnung. |
|                                  ![Herausforderungsmodus: Countdown und aktuelle Serie](docs/media/05-defi.webp)                                  |              ![Abenteuermodus: Karte der zehn Level, die nächsten sind gesperrt](docs/media/06-aventure.webp)              |
| **Herausforderung** — ein Wettlauf gegen die Zeit. Bei einem Fehler wird die Stoppuhr angehalten, damit die richtige Antwort gelesen werden kann. |                      **Abenteuer** — zehn Level, die nacheinander gegen Sterne freigeschaltet werden.                      |
|                          ![Zeitmodus: ein Subtraktionslauf, die Stoppuhr und der Fortschritt](docs/media/14-chrono.webp)                          |                               ![Arcade-Menü: die vier Minispiele](docs/media/07-arcade.webp)                               |
| **Zeitmodus** — zehn richtige Antworten gegen die Zeit in der ausgewählten Rechenart; falsch gelöste Aufgaben kommen auf eine Wiederholungsliste. |               **Arcade** — vier Minispiele mit einstellbarem Schwierigkeitsgrad und Auswahl des Raumschiffs.               |
|            ![Dashboard: Spiele, Rekorde und Antworten jedes Modus, nach Rechenart aufgeschlüsselt](docs/media/08-tableau-de-bord.webp)            |                ![Personalisierung: Avatare, Designs, Barrierefreiheit](docs/media/09-personnalisation.webp)                |
|    **Dashboard** — Spiele und Rekorde jedes Modus, nach Rechenart aufgeschlüsselt; Sterne und zu wiederholende Reihen bei der Multiplikation.     |            **Personalisierung** — mit Münzen freischaltbare Avatare, Farbschema, Textgröße und hoher Kontrast.             |

### Die Arcade-Minispiele

Vier Spiele, die dieselbe Frage stellen — sie wird oberhalb des Spielfelds
zusammen mit der verbleibenden Zeit und den Leben angezeigt —, aber jeweils eine andere
Aktion erfordern.

|                                                                                                                                                    |                                                                                                                       |
| :------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
|                ![MultiInvaders: Monster mit Zahlen und ein Raumschiff am unteren Bildschirmrand](docs/media/10-multiinvaders.webp)                 |        ![MultiMiam: ein Labyrinth, in dem Punkte die möglichen Antworten tragen](docs/media/11-multimiam.webp)        |
| **MultiInvaders** — auf die falschen Antworten schießen und die richtige verschonen: Hinter ihr verbirgt sich ein Freund, der befreit werden muss. | **MultiMiam** — durch das Labyrinth laufen, um das richtige Ergebnis einzusammeln, und dabei den Monstern ausweichen. |
|         ![MultiMemory: ein Kartenraster, in dem zwei aufgedeckte Karten eine Aufgabe und eine Zahl zeigen](docs/media/12-multimemory.webp)         |           ![MultiSnake: eine Schlange und nummerierte Äpfel auf einer Wiese](docs/media/13-multisnake.webp)           |
|                              **MultiMemory** — sich merken, welche Karte das Ergebnis der aufgedeckten Aufgabe trägt.                              |              **MultiSnake** — durch das Fressen der richtigen Zahlen wachsen und alle anderen vermeiden.              |

## ✨ Funktionen

### 🎮 Spielmodi

- **Entdeckungsmodus**: Visuelle und interaktive Erkundung, angepasst an jede Rechenart
- **Quizmodus**: Multiple-Choice-Fragen mit Unterstützung der vier Rechenarten (×, +, −, ÷) und adaptivem Fortschritt
- **Herausforderungsmodus**: Wettlauf gegen die Zeit mit den vier Rechenarten (×, +, −, ÷) und verschiedenen Schwierigkeitsgraden
- **Abenteuermodus**: Erzählerischer Fortschritt durch Level mit Unterstützung der vier Rechenarten
- **Zeitmodus**: 10 richtige Antworten gegen eine ununterbrochen laufende Stoppuhr, um die eigene Bestzeit zu schlagen, mit den vier Rechenarten (×, +, −, ÷)

### 🕹️ Arcade-Minispiele

- **MultiInvaders**: Lernspiel im Stil von Space Invaders – die falschen Antworten zerstören
- **MultiMiam**: Mathematisches Pac-Man – die richtigen Antworten einsammeln
- **MultiMemory**: Gedächtnisspiel – Rechenaufgaben und Ergebnisse einander zuordnen
- **MultiSnake**: Lernspiel im Stil von Snake – durch das Fressen der richtigen Zahlen wachsen

### ➕ Unterstützung mehrerer Rechenarten

LeapMultix bietet in **allen Modi** ein umfassendes Training der vier Grundrechenarten:

| Modus           | ×   | +   | −   | ÷   |
| --------------- | --- | --- | --- | --- |
| Quiz            | ✅  | ✅  | ✅  | ✅  |
| Herausforderung | ✅  | ✅  | ✅  | ✅  |
| Entdeckung      | ✅  | ✅  | ✅  | ✅  |
| Abenteuer       | ✅  | ✅  | ✅  | ✅  |
| Zeitmodus       | ✅  | ✅  | ✅  | ✅  |
| Arcade          | ✅  | ✅  | ✅  | ✅  |

### 🌍 Modusübergreifende Funktionen

- **Mehrere Benutzer**: ein Profil pro Kind mit seinem Fortschritt; auf einem Klassenrechner sortierte Vornamen, Filter ab 10 Spielern, ein Papierkorb mit 30 Tagen Aufbewahrungsfrist und Sicherung der Spieler in einer Datei
- **Mehrsprachig**: Unterstützung für Französisch, Englisch und Spanisch
- **Personalisierung**: Avatare (der erste ist frei wählbar, die anderen werden mit beim Spielen verdienten Münzen freigeschaltet, jeweils 50 Münzen), Farbschemata, Hintergründe
- **Barrierefreiheit**: vollständige Tastaturnavigation, Touch-Unterstützung, Pause im Arcade-Modus, Textgröße und hoher Kontrast; mit axe-core geprüft, ohne Verstöße gegen WCAG der Stufe A oder AA auf den getesteten Bildschirmen
- **Aufgezeichnete Stimme**: Das Spiel kann Fragen und Ermutigungen mit einer vorab aufgezeichneten synthetischen Stimme vorlesen und greift automatisch auf die Stimme des Geräts zurück. Die Stimmen sind nicht in diesem Repository enthalten: Die Website leapmultix.jls42.org stellt Lucie auf Französisch sowie Sulafat auf Englisch und Spanisch bereit; auf Französisch kann zwischen Sulafat und Marie gewählt werden, auf Englisch steht Jane zur Verfügung (siehe [Aufgezeichnete Stimme](#-aufgenommene-stimme))
- **Mobil responsiv**: Für Tablets und Smartphones optimierte Benutzeroberfläche
- **Fortschrittssystem**: Dashboard pro Profil (Spiele, Rekorde und zu wiederholende Reihen, nach Rechenart aufgeschlüsselt), Abzeichen, tägliche Herausforderungen, Münzen (im Zeitmodus, im Abenteuer, in der Herausforderung und bei der Herausforderung des Tages)

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
npm run test:pwa-offline # Hors ligne de bout en bout (Puppeteer, serveur intégré)

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

Die JavaScript-Module liegen mit Ausnahme von drei Verzeichnissen **direkt in `js/`**:
`core/`, `components/` und `modes/`. Daher übernimmt der Dateiname die
Gruppierung (`arcade-*`, `multimiam-*`, `i18n*` …).

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
│   │   ├── audio.js, theme.js                # Son, thèmes
│   │   ├── eventBus.js, mainInit.js          # Événements, amorçage DOM
│   │   ├── adventure-data.js                 # Niveaux du mode Aventure
│   │   ├── mult-stats.js, challenge-stats.js, operation-stats.js
│   │   ├── chrono-stats.js, chrono-questions.js, chrono-input.js   # Mode Chrono
│   │   ├── mode-stats.js, adventure-progress.js   # Compteurs du tableau de bord
│   │   ├── profile-operation-stats.js        # Statistiques par calcul, rangées dans le profil
│   │   ├── players-trash.js, players-backup.js   # Corbeille et sauvegarde des joueurs
│   │   ├── avatar-shop.js                    # Avatars débloqués avec les pièces (prix, achat)
│   │   ├── daily-challenge.js, tablePreferences.js, stats-migration.js
│   │   ├── userUi.js, utils.js               # Utilitaires (source canonique)
│   │   └── operations/                       # Une classe par opération
│   │       ├── Operation.js, OperationRegistry.js
│   │       └── Multiplication.js, Addition.js, Subtraction.js, Division.js
│   ├── components/         # Composants d'interface
│   │   ├── topBar.js, infoBar.js, dashboard.js, customization.js
│   │   ├── operationSelector.js, operationModeAvailability.js
│   │   ├── playerTools.js  # « Qui joue ? » sur un poste de classe : filtre, corbeille, sauvegarde
│   │   ├── loadErrorNotice.js   # Avis d'un jeu qui n'a pas pu s'ouvrir (hors ligne…)
│   │   ├── confirm-dialog.js, avatarShop.js   # Fenêtre de confirmation du jeu, boutique d'avatars
│   │   └── icons.js, tableSettingsModal.js
│   ├── modes/              # Les six modes de jeu
│   │   ├── DiscoveryMode.js, QuizMode.js, ChallengeMode.js
│   │   └── AdventureMode.js, ChronoMode.js, ArcadeMode.js
│   ├── arcade*.js          # Orchestrateur et briques communes des mini-jeux (temps et pause :
│   │                       #   arcade-time.js ; plein écran : arcade-fullscreen.js)
│   ├── multimiam*.js       # Mini-jeu Pac-Man (moteur, rendu, contrôles…)
│   ├── multisnake.js       # Mini-jeu Snake
│   ├── i18n.js, i18n-store.js                # Internationalisation
│   ├── security-utils.js, error-handlers.js, logger.js
│   ├── accessibility.js, keyboard-navigation.js, touch-support.js, speech.js
│   ├── voice-clips.js      # Lecteur de la voix enregistrée (repli : speech.js)
│   ├── slides.js, mode-orchestrator.js, lazy-loader.js, game-cleanup.js
│   ├── game-exit.js        # Une seule règle pour quitter une partie en cours
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
│   ├── precache-list.mjs   # Liste de préchargement hors ligne de sw.js (npm run precache:update)
│   └── voice/              # Voix enregistrée : corpus, génération, écoute, publication
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### Technische Architektur

**Moderne ES6-Module**: Das Projekt verwendet eine modulare Architektur mit ES6-Klassen und nativen Imports/Exports.

**Wiederverwendbare Komponenten**: Die Benutzeroberfläche ist aus zentralisierten UI-Komponenten aufgebaut (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Intelligentes Laden der Module bei Bedarf über `lazy-loader.js`, um die anfängliche Leistung zu optimieren.

**Einheitliches Speichersystem**: Zentralisierte API zur dauerhaften Speicherung von Benutzerdaten über LocalStorage mit Fallbacks.

**Zentralisierte Audioverwaltung**: Tonsteuerung mit mehrsprachiger Unterstützung und benutzerspezifischen Einstellungen.

**Event Bus**: Entkoppelte ereignisbasierte Kommunikation zwischen Komponenten für eine wartbare Architektur.

**Navigation über Slides**: Navigationssystem auf Basis nummerierter Slides (slide0, slide1 usw.) mit `goToSlide()`.

**Sicherheit**: XSS-Schutz und Bereinigung über `security-utils.js` für alle DOM-Manipulationen.

## 🎯 Detaillierte Spielmodi

### Entdeckungsmodus

Eine an jede Rechenart angepasste visuelle Erkundungsoberfläche mit:

- Interaktiver Visualisierung von Multiplikationen
- Animationen und Merkhilfen
- Lernorientiertem Drag-and-drop
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
- Rangliste der besten Punktzahlen

### Abenteuermodus

Erzählerischer Fortschritt mit:

- 10 freischaltbaren thematischen Leveln
- Interaktiver Karte mit visueller Fortschrittsanzeige
- Fesselnder Geschichte mit Figuren
- System aus Sternen und Belohnungen

### Zeitmodus

Zehn richtige Antworten so schnell wie möglich, gegen eine ununterbrochen laufende Stoppuhr:

- Die vier Rechenarten: die Einmaleinsreihen (in den Reiheneinstellungen festgelegt) sowie
  alle Additionsreihen (7 + k), Subtraktionsreihen ((7 + k) − 7) und Divisionsreihen ((7 × k) ÷ 7)
- Antwortauswahl oder Ziffernblock, per Klick oder Tastatur
- Bestzeiten, Durchschnittszeit und Verlaufskurve der letzten Spiele, nach Rechenart
- „Meine zu wiederholenden Aufgaben“: eine Liste pro Rechenart, die in beiden Richtungen geübt wird (6 × 7 und 7 × 6,
  15 − 7 und 15 − 8)

### Dashboard

Was das Kind tatsächlich gespielt hat, Profil für Profil:

- Sterne aus dem Abenteuer und zu wiederholende Einmaleinsreihen (die letzten 20 Antworten jeder Reihe)
- Fragen und richtige Antworten in Quiz, Herausforderung, Abenteuer und Zeitmodus
- Spiele und Rekorde jedes Modus und jedes Minispiels, einschließlich abgebrochener Spiele, nach Rechenart aufgeschlüsselt,
  sobald das Kind mehrere Rechenarten übt

### Arcade-Minispiele

Jedes Minispiel bietet:

- Drei Schwierigkeitsgrade in den vier Rechenarten
- Lebens- und Punktesystem
- Steuerung per Maus, Tastatur und Finger, beschrieben auf der Spielseite
- Pause: Schaltfläche neben der Zeit oder Taste P; das Spiel pausiert auch, wenn der Tab
  ausgeblendet wird, und wird nie automatisch fortgesetzt
- MultiMemory: wahlweise eine Partie ohne Zeitlimit
- Spielfeld im verfügbaren Raum (auf einem Smartphone im Hochformat höher als breit) und Vollbildmodus,
  sowohl auf Computern als auch auf Smartphones, einschließlich gedrehtem Smartphone (außer auf dem iPhone, dessen Browser
  dies nicht zulässt)
- Bestleistungen jedes Spielers; „Zurücksetzen“ nennt alles, was dabei gelöscht wird

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
CodeFactor und SonarCloud. Fehler werden behoben, bis alles grün ist, bevor zusammengeführt wird.

**Commit-Stil**: Knapp formulierte Nachrichten im Imperativ (z. B. „Fix arcade init errors“, „Refactor cache updater“)

**Quality Gate**: Sicherstellen, dass `npm run lint`, `npm test` und `npm run test:coverage` vor jedem Commit erfolgreich durchlaufen

### Komponentenarchitektur

**GameMode (Basisklasse)**: Alle Modi erben von einer gemeinsamen Klasse mit standardisierten Methoden.

**GameModeManager**: Zentralisierte Orchestrierung des Starts und der Verwaltung der Modi.

**UI-Komponenten**: TopBar, InfoBar, Dashboard und Customization sorgen für eine einheitliche Benutzeroberfläche.

**Lazy Loading**: Die Module werden bei Bedarf geladen, um die anfängliche Leistung zu optimieren.

**Event Bus**: Entkoppelte Kommunikation zwischen Komponenten über das Ereignissystem.

### Tests

Das Projekt umfasst eine vollständige Testsuite:

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
- **Post-Build**: Kopiert `css/` und `assets/`, die Favicons (`favicon.ico`, `favicon.png`, `favicon.svg`) sowie `sw.js` und schreibt `dist/index.html` auf die gehashte Einstiegsdatei um (z. B. `main-es6-*.js`)
- **Zielverzeichnis**: `dist/` ist für die statische Bereitstellung bereit

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Continuous Integration

**GitHub Actions**: `.github/workflows/ci.yml`, ausgelöst bei jedem Push auf
`main` und bei jedem Pull Request.

**`verify`** — das blockierende Qualitäts-Gate:

- `npm ci`, dann `npm run verify` (ESLint, Jest-Tests, Abdeckung)
- `npm run format:check` (Prettier)

**`seo-report`** — nach `verify`: Lighthouse-Audit der Live-Website, um
die SEO-Metriken langfristig zu verfolgen.

**Externe Analysen**, die an die Pull Requests angebunden sind: Codacy, CodeFactor und
SonarCloud. Das SonarCloud-Gate verlangt für neuen Code die Bewertungen A bei Zuverlässigkeit, Sicherheit und
Wartbarkeit.

**Bereitstellung**: `./deploy.sh` synchronisiert die Website mit S3 und invalidiert den
CloudFront-Cache. Das Skript erzeugt bei Bedarf die responsiven Bilder neu, die nicht in git enthalten sind.

### PWA (Progressive Web App)

LeapMultix ist eine vollständige PWA mit Offline-Unterstützung und Installationsmöglichkeit.

**Service Worker** (`sw.js`):

- Installation: Vorladen aller vom Spiel benötigten Ressourcen anhand einer aus dem Code
  durch `scripts/precache-list.mjs` erzeugten Liste (`npm run precache:update`, durch Tests überprüft): Nach
  einem ersten Besuch starten die 6 Modi und die 4 Arcade-Spiele offline
- Navigation: Network-first mit einer Frist von 4 Sekunden: danach (ein Netz, das nicht antwortet: Schul-WLAN, Captive Portal) oder offline wird die zwischengespeicherte Spielseite verwendet (`offline.html` nur für eine Seite, die nie gespeichert wurde)
- Bilder: Cache-first; offline eine andere Größe desselben Sprites oder ein anderer Hintergrund desselben Avatars
- Übersetzungen: Stale-while-revalidate für Aktualisierungen im Hintergrund
- JS/CSS: Dateien dieser Version (Adressen mit `?v=`, wie auf einer bereitgestellten Website) kommen zuerst aus ihrer vorab gespeicherten Kopie, die konstruktionsbedingt dieselbe Version ist: Der Server ignoriert `?v=` und würde nach einer Bereitstellung sonst eine andere Version liefern. Die übrigen (ohne `?v=` in der Entwicklung): Network-first mit derselben Frist von 4 Sekunden vor der Kopie dieser Version
- Sounds und Schriftarten: Cache-first, Bereitstellung von Byte-Bereichen (Safari-Audioplayer)
- Automatische Versionsverwaltung über `cache-updater.js`

**Manifest** (`manifest.json`):

- SVG- und PNG-Symbole für alle Geräte
- Installation auf Mobilgeräten möglich (Add to Home Screen)
- Standalone-Konfiguration für ein App-ähnliches Erlebnis
- Unterstützung für Themes und Farben

**Offline-Modus lokal testen.** Den Server starten und anschließend
`http://localhost:8080` (oder den angezeigten Port) öffnen:

```bash
npm run serve
```

Manuell: Die Seite so lange geöffnet lassen, bis der Service Worker das Spiel gespeichert hat, den
Server stoppen (oder die Netzwerkverbindung des Geräts trennen) und dann die Seite aktualisieren. Das Spiel muss
angezeigt werden und jeder Modus starten.

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

**Werkzeuge für die Codequalität**:

- **ESLint**: Moderne Konfiguration mit Flat Config (`eslint.config.js`), Unterstützung für ES2022
- **Prettier**: Automatische Codeformatierung (`.prettierrc`)
- **Stylelint**: CSS-Validierung (`.stylelintrc.json`)
- **JSDoc**: Automatische Dokumentation der Funktionen mit Abdeckungsanalyse

**Wichtige Coderegeln**:

- Nicht verwendete Variablen und Parameter entfernen (`no-unused-vars`)
- Eine spezifische Fehlerbehandlung verwenden (keine leeren catch-Blöcke)
- `innerHTML` zugunsten der Funktionen `security-utils.js` vermeiden
- Eine kognitive Komplexität < 15 für Funktionen einhalten
- Komplexe Funktionen in kleinere Hilfsfunktionen auslagern

**Sicherheit**:

- **XSS-Schutz**: Die Funktionen von `security-utils.js` verwenden:
  - `appendSanitizedHTML()` anstelle von `innerHTML`
  - `createSafeElement()` zum Erstellen sicherer Elemente
  - `setSafeMessage()` für Textinhalte
- **Externe Skripte**: Attribut `crossorigin="anonymous"` obligatorisch
- **Eingabevalidierung**: Externe Daten immer bereinigen
- **Content Security Policy**: CSP-Header zur Beschränkung der Skriptquellen

**Barrierefreiheit**:

- Ziel WCAG 2.1 Stufe AA, geprüft mit axe-core: keine Verstöße der Stufe A oder AA und keine
  Verstöße gegen bewährte Praktiken
- Vollständige Tastaturnavigation
- ARIA-Rollen und zugängliche Namen
- Mit axe-core geprüfte Kontraste

**Performance**:

- Lazy Loading der Module über `lazy-loader.js`
- CSS-Optimierungen und responsive Assets
- Service Worker für intelligentes Caching
- Code Splitting und Minifizierung in der Produktion

## 📱 Kompatibilität

### Unterstützte Browser

Die Benutzeroberfläche stützt sich bei Farben auf `oklch()` und bei
kontextabhängigen Zuständen auf `:has()`, wodurch folgende Mindestversionen gelten:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Geräte

- **Desktop**: Tastatur- und Maussteuerung
- **Tablets**: Optimierte Touch-Oberfläche
- **Smartphones**: Adaptives responsives Design

### Barrierefreiheit

- Vollständige Tastaturnavigation: Tabulatortaste, Pfeiltasten in den Antwortgittern und den
  MultiMemory-Karten, Eingabetaste, Escape-Taste; Link „Zu den Spielmodi“ oben auf der Startseite
- Eine einzige Regel zum Verlassen einer Partie: „Aufgeben“, die Escape-Taste oder eine Schaltfläche in der oberen Leiste
  stellen dieselbe Frage, und die Partie wird fortgesetzt, wenn das Kind ablehnt
- Screenreader: Jede Antwort ist mit ihrer Frage verknüpft, ein Titel der Ebene 1 pro Bildschirm, die
  Meldungen werden vorgelesen
- Die Seite lässt sich mit den Fingern vergrößern (außerhalb der Arcade-Spiele); Textgröße, hoher Kontrast,
  reduzierte Animationen und eine von Andika abgeleitete Leseschrift, die für
  Leseanfänger entworfen wurde
- Arcade: Pause (Schaltfläche, Taste P oder ausgeblendeter Tab); MultiMemory wahlweise ohne Zeitbegrenzung
- Geprüft mit axe-core (WCAG 2.0 bis 2.2, Stufen A und AA sowie bewährte Praktiken): keine
  Verstöße auf 41 Bildschirmen in Desktopbreite und 40 in Smartphonebreite (390 px), einschließlich
  Nacht-Theme und hohem Kontrast

## 🌍 Lokalisierung

Vollständige mehrsprachige Unterstützung:

- **Französisch** (Standardsprache)
- **Englisch**
- **Spanisch**

### Verwaltung der Übersetzungen

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

Dieses Skript (`scripts/compare-translations.cjs`) gewährleistet die Synchronisierung aller Sprachdateien:

**Funktionen:**

- Erkennung fehlender Schlüssel (in fr.json vorhanden, in anderen Sprachen jedoch nicht)
- Erkennung zusätzlicher Schlüssel (in anderen Sprachen vorhanden, aber nicht in fr.json)
- Erkennung leerer Werte (`""`, `null`, `undefined`, `[]`)
- Überprüfung der Typkonsistenz (String gegenüber Array)
- Abflachung verschachtelter JSON-Strukturen in Punktnotation (z. B. `arcade.multiMemory.title`)
- Erstellung eines ausführlichen Konsolenberichts
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
- Erzählerischer Inhalt des Abenteuermodus
- Bezeichnungen für Barrierefreiheit und ARIA

## 🔊 Aufgenommene Stimme

Das Spiel liest Fragen, Ermutigungen und Erklärungen laut vor. Es spricht nur eine begrenzte Menge von Sätzen, etwa 7.400 pro Sprache: Sie können daher ein für alle Mal aufgenommen werden, sodass während einer Partie kein Sprachsynthesedienst aufgerufen wird. Ohne Clips liest das Spiel mit der Stimme des Geräts vor.

### In diesem Repository: die Anwendung ohne Stimmen

Der Code kann vorab aufgenommene Clips wiedergeben und enthält die Pipeline, mit der sie erstellt werden. Die Clips sind ebenso wenig enthalten wie die Schlüssel der Anbieter: Ein Fork oder eine lokale Installation liest mit der Stimme des Geräts vor.

- **Automatischer Rückgriff** auf die Stimme des Geräts, Satz für Satz: fehlender oder fehlerhafter Clip, vom Browser verweigerte Wiedergabe, Clip startet nicht innerhalb von 1,5 s oder Offlinebetrieb ohne zwischengespeicherten Clip.
- **Einstellungen**: Die Sprachschaltfläche in der oberen Leiste schaltet das Vorlesen ein oder aus; das Kontrollkästchen „Aufgenommene Stimme“ (Barrierefreiheit und Steuerung) wählt zwischen der aufgenommenen Stimme und der Stimme des Geräts. Es wird nur in Sprachen angezeigt, für die eine Stimme veröffentlicht wurde.
- **Offline**: Bereits gehörte Clips bleiben im Cache (Service Worker).
- **Wo das Spiel nach den Clips sucht**: im Tag `<meta name="leapmultix-voice-base">`, das im Repository leer ist. Nur die Produktionsbereitstellung schreibt dort `/voice/` hinein.

Mit eigenen Clips auf dem Rechner (mit der unten beschriebenen Pipeline erstellt und neben dem Spiel in `../leapmultix-voices` abgelegt) veranlasst der Parameter `?voix=local` den Entwicklungsserver, sie wiederzugeben:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Auf leapmultix.jls42.org: die Stimmen des Hostings

Die vom Autor bereitgestellte Website verwendet aufgezeichnete synthetische Stimmen:

- auf Französisch **Lucie**, erstellt mit ElevenLabs (Modell Eleven v3);
- auf britischem Englisch und spanischem Spanisch **Sulafat**, erstellt mit Google Cloud Text-to-Speech (Stimme Chirp 3 HD);
- nach Wahl des Spielers **Sulafat** auf Französisch, um in allen drei Sprachen dieselbe Stimme beizubehalten;
- ebenfalls nach Wahl des Spielers **Marie** auf Französisch und **Jane** auf Englisch, erstellt mit Mistral AI (Voxtral TTS).

Die Clips befinden sich in einem privaten Repository und in einem dafür vorgesehenen S3-Bucket, der über CloudFront unter `/voice/*` bereitgestellt wird. Sie werden einmalig erzeugt: Während des Spiels wird nichts an diese Dienste gesendet. In den Einstellungen bietet das Menü „Stimme“ die Stimmen der jeweiligen Sprache an, wenn mehrere verfügbar sind, und der Hinweis nennt den Dienst der gerade gehörten Stimme.

### Clips erzeugen

Die Pipeline ist in `scripts/voice/` skriptgesteuert und läuft auf dem Rechner des Eigentümers, niemals in der öffentlichen CI. Die Schlüssel der Anbieter (ElevenLabs für Lucie, Google Cloud Text-to-Speech für Sulafat, Mistral für Marie und Jane) verbleiben in einer Datei `.env` außerhalb des Repositorys, die über `node --env-file` übergeben wird: Kein Schlüssel gelangt in git. Der Claude-Code-Skill [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) führt Schritt für Schritt durch das Verfahren (Gates, Bestätigungen, Wiederaufnahmen); Einzelheiten stehen in [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Schätzen** der verbleibenden Sätze und der kostenpflichtigen Zeichen (Eleven v3: etwa 0,53 Credits pro Zeichen; Chirp 3 HD: 30 $ pro Million Zeichen, wobei die erste Million jedes Monats kostenlos ist; Voxtral TTS: 16 $ pro Million).
2. **Erzeugen**. Ein erneuter Aufruf desselben Befehls ergänzt die fehlenden Clips. Wenn die Credits aufgebraucht sind, beendet sich das Skript ordnungsgemäß (Code 3), ohne eine unvollständig geschriebene Datei zu hinterlassen. `--max-total-chars` begrenzt die kumulierten Ausgaben der Version: Jede bezahlte Antwort wird unmittelbar nach ihrem Empfang in ein Register eingetragen, das auch einen abrupten Abbruch übersteht. Bei Google und Mistral, die kein auslesbares Guthaben anzeigen, ist dies der einzige Schutz.
3. **Prüfen**: Jeder Satz besitzt einen Clip und jede MP3-Datei ist gültig. Anschließend transkribiert Whisper jeden Clip lokal, und die Prüfung meldet falsch verstandene Zahlen sowie ungewöhnliche Laufzeiten. `voice:review` führt Whisper, diese Prüfung und die Anhörseite mit einem einzigen Befehl aus.
4. **Anhören** der gemeldeten Clips und einer Auswahl weiblicher Formen („einmal 7“), die Whisper nicht unterscheidet, auf der Anhörseite (`voice:listen`). Jeder Clip verfügt über ein Kontrollkästchen „neu erstellen“, das ihn der Liste der verworfenen Clips hinzufügt.
5. **Neu erstellen** der verworfenen Clips (`--redo`), Whisper erneut ausführen und anschließend jeden Clip vor und nach der Änderung auf einer zweiten Seite vergleichen. Ein Clip, der nach zwei oder drei Versuchen noch immer falsch ausgesprochen wird, erhält in `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`) einen vorgegebenen Text, beispielsweise die ausgeschriebene Zahl.
6. **Veröffentlichen** der Clips, ihre Online-Erreichbarkeit prüfen und anschließend zunächst für die Tester den Sprachindex veröffentlichen (`?voix=test`).
7. **Freischalten** der Stimme für alle und sie anschließend standardmäßig aktivieren. Der Notausschalter (`voice:publish -- remove`) entfernt eine Sprache aus dem Index: Das Spiel kehrt zur Stimme des Geräts zurück.

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

### Regel: Ein geänderter gesprochener Satz wird vor der Produktionsbereitstellung neu aufgenommen

Jeder gesprochene Satz stammt aus den Übersetzungen (`assets/translations/{fr,en,es}.json`) und gehört zum Korpus. Das Ändern eines gesprochenen Satzes lässt daher den Test der Korpussperre (`scripts/voice/corpus.lock.json`) fehlschlagen. Für eine Sprache mit aufgenommener Stimme werden dann die Clips der betroffenen Sätze erzeugt, geprüft und angehört und anschließend **vor** dem Zusammenführen veröffentlicht. Zum Schluss wird die Sperre aktualisiert (`npm run voice:corpus:lock`). Ohne diese Clips wird der geänderte Satz mit der Stimme des Geräts vorgelesen.

## 📊 Datenspeicherung

### Benutzerdaten

- Profile und Einstellungen
- Fortschritt je Spielmodus
- Punktzahlen und Statistiken der Arcade-Spiele
- Personalisierungseinstellungen

### Technische Funktionen

- Lokale Speicherung (localStorage) mit Fallbacks; der Browser wird aufgefordert, sie nicht
  selbstständig zu löschen (`navigator.storage.persist()`)
- Papierkorb für gelöschte Spieler: 30 Tage lang mit all ihren Daten, Wiederherstellung über
  „Wer spielt?“
- Sicherung der Spieler in einer JSON-Datei, Wiederherstellung auf diesem oder einem anderen Gerät (ein bereits
  vorhandener Spieler wird niemals überschrieben)
- Nach Profil getrennte Spieldaten einschließlich der Statistiken für jede Rechenart: Auf einem gemeinsam genutzten Gerät beeinflussen die Fehler eines Spielers nicht die Fragen eines anderen
- Automatische Speicherung des Fortschritts
- Automatische Migration älterer Daten

## 🐛 Ein Problem melden

Probleme können über GitHub Issues gemeldet werden. Bitte Folgendes angeben:

- Ausführliche Beschreibung des Problems
- Schritte zur Reproduktion
- Browser und Version
- Screenshots, falls relevant

## 💝 Das Projekt unterstützen

**[☕ Über PayPal spenden](https://paypal.me/jls)**

## 📄 Lizenz

Dieses Projekt steht unter der Lizenz AGPL v3. Weitere Einzelheiten finden Sie in der Datei `LICENSE`.

---

_LeapMultix — freie Lernanwendung zum Erlernen der vier Grundrechenarten_

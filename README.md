# LeapMultix

<!-- Badges (mettre à jour <owner>/<repo> après migration GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/86c4dd46474844e789aead3a001c76e7)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Table des matières

- [Description](#description)
- [Fonctionnalités](#-fonctionnalités)
- [Démarrage rapide](#-démarrage-rapide)
- [Architecture](#-architecture)
- [Modes de Jeu Détaillés](#-modes-de-jeu-détaillés)
- [Développement](#-développement)
- [Compatibilité](#-compatibilité)
- [Localisation](#-localisation)
- [Stockage des données](#-stockage-des-données)
- [Signaler un problème](#-signaler-un-problème)
- [Licence](#-licence)

## Description

LeapMultix est une application web éducative interactive moderne destinée aux enfants (8–12 ans) pour maîtriser les tables de multiplication. L'application propose **4 modes de jeu classiques** et **4 mini-jeux d'arcade** dans une interface intuitive, accessible et multilingue.

**Développé par :** Julien LS (contact@jls42.org)

**URL en ligne :** https://leapmultix.jls42.org/

## ✨ Fonctionnalités

### 🎮 Modes de Jeu

- **Mode Découverte** : Exploration visuelle et interactive des tables de multiplication
- **Mode Quiz** : Questions à choix multiples avec progression adaptative
- **Mode Défi** : Course contre la montre avec différents niveaux de difficulté
- **Mode Aventure** : Progression narrative par niveaux avec carte interactive

### 🕹️ Mini-jeux Arcade

- **MultiInvaders** : Space Invaders éducatif - Détruire les mauvaises réponses
- **MultiMiam** : Pac-Man mathématique - Collecter les bonnes réponses
- **MultiMemory** : Jeu de mémoire - Associer multiplications et résultats
- **MultiSnake** : Snake éducatif - Grandir en mangeant les bons nombres

### 🌍 Fonctionnalités Transversales

- **Multi-utilisateurs** : Gestion de profils individuels avec progression sauvegardée
- **Multilingue** : Support français, anglais et espagnol
- **Personnalisation** : Avatars, thèmes de couleur, arrière-plans
- **Accessibilité** : Navigation clavier, support tactile, conformité WCAG 2.1 AA
- **Mobile responsive** : Interface optimisée pour tablettes et smartphones
- **Système de progression** : Scores, badges, défis quotidiens

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 16 ou supérieure)
- Un navigateur web moderne

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

### Scripts disponibles

```bash
# Développement
npm run serve          # Serveur local
npm run lint           # Vérification du code
npm run test           # Lancer tous les tests (CJS)
npm run test:coverage  # Tests avec couverture
npm run test:esm       # Tests ESM (dossiers tests-esm/, Jest vm-modules)
npm run test:pwa-offline # Test offline PWA (nécessite Puppeteer), après `npm run serve`

# Analyse et maintenance
npm run analyze:jsdoc  # Analyse de la documentation
npm run improve:jsdoc  # Amélioration automatique JSDoc
npm run audit:mobile   # Tests responsivité mobile
npm run audit:accessibility # Tests d'accessibilité
npm run dead-code      # Détection de code non utilisé
npm run analyze:globals # Analyse des variables globales
npm run analyze:dependencies # Analyse usage des dépendances
npm run assets:analyze # Analyse des assets responsive
npm run assets:diff    # Comparaison des assets

# Build & livraison
npm run build          # Build de prod (Rollup) + postbuild (dist/ complet)
npm run serve:dist     # Servir dist/ sur http://localhost:5000 (ou port disponible)
```

## 🏗️ Architecture

### Structure des fichiers

```
leapmultix/
├── index.html              # Point d'entrée principal
├── js/
│   ├── core/               # Modules centraux ES6
│   │   ├── GameMode.js     # Classe de base des modes
│   │   ├── GameModeManager.js
│   │   ├── storage.js      # API de stockage
│   │   ├── audio.js        # Gestion du son
│   │   └── utils.js        # Utilitaires génériques
│   ├── components/         # Composants UI réutilisables
│   │   ├── topBar.js       # Barre de navigation
│   │   ├── infoBar.js      # Barres d'information des jeux
│   │   ├── dashboard.js    # Tableau de bord utilisateur
│   │   └── customization.js # Interface de personnalisation
│   ├── modes/              # Modes de jeu refactorisés
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade-*.js         # Mini-jeux arcade
│   ├── multimiam-*.js      # Modules du jeu Pac-Man
│   ├── multisnake.js       # Jeu Snake éducatif
│   ├── main-es6.js         # Point d'entrée ES6
│   ├── main.js             # Orchestrateur principal
│   ├── lazy-loader.js      # Chargement à la demande
│   └── utils-es6.js        # Utilitaires ES6
├── css/                    # Styles modulaires
├── assets/                 # Ressources
│   ├── images/             # Images et sprites
│   ├── sounds/             # Effets sonores
│   ├── translations/       # Fichiers de traduction
│   └── videos/             # Vidéos tutoriels
└── tests/                  # Tests automatisés
```

### Architecture technique

**Modules ES6 modernes** : Le projet utilise une architecture modulaire avec des classes ES6 et des imports/exports natifs.

**Composants réutilisables** : Interface construite avec des composants UI centralisés (TopBar, InfoBar, Dashboard).

**Lazy Loading** : Chargement intelligent des modules à la demande pour optimiser les performances.

**Système de stockage unifié** : API centralisée pour la persistance des données utilisateur.

**Gestion audio centralisée** : Contrôle du son avec support multilingue et préférences par utilisateur.

## 🎯 Modes de Jeu Détaillés

### Mode Découverte

Interface d'exploration visuelle des tables de multiplication avec :

- Visualisation interactive des multiplications
- Animations et aide-mémoires
- Glisser-déposer éducatif
- Progression libre par table

### Mode Quiz

Questions à choix multiples avec :

- 10 questions par session
- Progression adaptative selon les réussites
- Pavé numérique virtuel
- Système de streak (série de bonnes réponses)

### Mode Défi

Course contre la montre avec :

- 3 niveaux de difficulté (Débutant, Moyen, Difficile)
- Bonus de temps pour les bonnes réponses
- Système de vies
- Classement des meilleurs scores

### Mode Aventure

Progression narrative avec :

- 12 niveaux thématiques débloquables
- Carte interactive avec progression visuelle
- Histoire immersive avec personnages
- Système d'étoiles et de récompenses

### Mini-jeux Arcade

Chaque mini-jeu propose :

- Choix de difficulté et personnalisation
- Système de vies et score
- Contrôles clavier et tactile
- Classements individuels par utilisateur

## 🛠️ Développement

### Architecture des composants

**GameMode (classe de base)** : Tous les modes héritent d'une classe commune avec méthodes standardisées.

**GameModeManager** : Orchestration centralisée du lancement et de la gestion des modes.

**Composants UI** : TopBar, InfoBar, Dashboard et Customization fournissent une interface cohérente.

**Lazy Loading** : Les modules sont chargés à la demande pour optimiser les performances initiales.

### Tests

Le projet inclut une suite de tests complète :

- Tests unitaires des modules core
- Tests d'intégration des composants
- Tests des modes de jeu
- Couverture de code automatisée

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Build de production

- **Rollup** : Bundle `js/main-es6.js` en ESM avec code-splitting et sourcemaps
- **Terser** : Minification automatique pour optimisation
- **Post-build** : Copie `css/` et `assets/`, `favicon.svg`, `sw.js`, et réécriture de `dist/index.html` vers le fichier d'entrée hashé (ex: `main-es6-*.js`)
- **Dossier final** : `dist/` prêt à être servi statiquement

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Intégration Continue

**GitHub Actions** : `.github/workflows/ci.yml`

- **build-test** : `npm ci`, `lint`, `test`, `audit` + artefact coverage
- **accessibility** : `npm run audit:accessibility` (non bloquant)
- **test-esm** : `npm run test:esm` avec VM modules
- **lighthouse** : Audit performance mobile (non bloquant), rapports artefacts

### PWA (hors‑ligne et installation)

- Service Worker: navigation réseau d'abord + fallback hors-ligne; images cache-first; traductions stale-while-revalidate; JS/CSS réseau d'abord.
- Manifest: icônes SVG/PNG; installation possible sur mobile.
- Tester hors‑ligne localement:
  1. `npm run serve` et ouvrir `http://localhost:8080` (ou port affiché)
  2. Couper le réseau et rafraîchir la page → `offline.html` s'affiche
  3. Test automatisé (Puppeteer installé): `npm run test:pwa-offline`

### Standards de qualité

- **ESLint** : Validation du code JavaScript
- **Prettier** : Formatage automatique
- **JSDoc** : Documentation automatique des fonctions
- **Accessibilité** : Conformité WCAG 2.1 AA
- **Performance** : Lazy loading, optimisations CSS

## 📱 Compatibilité

### Navigateurs supportés

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Appareils

- **Desktop** : Contrôles clavier et souris
- **Tablettes** : Interface tactile optimisée
- **Smartphones** : Design responsive adaptatif

### Accessibilité

- Navigation clavier complète (Tab, flèches, Échap)
- Rôles ARIA et labels pour lecteurs d'écran
- Contrastes de couleur conformes
- Support des technologies d'assistance

## 🌍 Localisation

Support multilingue complet :

- **Français** (langue par défaut)
- **Anglais**
- **Espagnol**

### Gestion des traductions

**Fichiers de traduction :** `assets/translations/*.json`

**Format :**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

**Scripts de gestion :**

```bash
npm run i18n:verify  # Vérifier clés manquantes/incohérentes
npm run i18n:unused  # Lister clés non utilisées
```

**Couverture des traductions :**

- Interface utilisateur complète
- Instructions des jeux
- Messages d'erreur et de feedback
- Descriptions et aide contextuelle

## 📊 Stockage des données

### Données utilisateur

- Profils et préférences
- Progression par mode de jeu
- Scores et statistiques des jeux arcade
- Paramètres de personnalisation

### Fonctionnalités techniques

- Stockage local (localStorage) avec fallbacks
- Isolation des données par utilisateur
- Sauvegarde automatique de la progression
- Migration automatique des données anciennes

## 🐛 Signaler un problème

Les problèmes peuvent être signalés via les issues GitHub. Merci d'inclure :

- Description détaillée du problème
- Étapes pour le reproduire
- Navigateur et version
- Captures d'écran si pertinentes

## 💝 Soutenir le projet

**[☕ Faire un don via PayPal](https://paypal.me/jls)**

## 📄 Licence

Ce projet est sous licence AGPL v3. Voir le fichier `LICENSE` pour plus de détails.

---

_LeapMultix - Application éducative moderne pour l'apprentissage des tables de multiplication_

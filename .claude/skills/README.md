# Claude Code Skills - leapmultix

Ce répertoire contient les Skills Claude Code pour le projet leapmultix. Les Skills sont des capacités modulaires qui étendent les fonctionnalités de Claude en fournissant des instructions standardisées pour des workflows répétitifs.

## Skills disponibles

### 🔴 Haute priorité (implémentées)

#### 1. I18n Translation Sync

**Emplacement :** `i18n-sync/`
**Description :** Vérifie la synchronisation des fichiers de traduction (fr.json, en.json, es.json)
**Utilisation :** Claude active automatiquement cette skill quand vous travaillez sur les traductions

**Commandes manuelles :**

```bash
npm run i18n:compare
npm run i18n:verify
npm run i18n:unused
```

#### 2. Code Quality Gate

**Emplacement :** `code-quality/`
**Description :** Exécute les vérifications de qualité (format:check, ESLint, Jest) avant commits
**Utilisation :** Claude active cette skill avant les commits et lors des revues de code

**Commandes manuelles :**

```bash
npm run format:check
npm run format
npm run lint
npm run lint:fix
npm test
npm run verify
```

#### 3. New Game Mode Creator

**Emplacement :** `game-mode/`
**Description :** Guide la création de nouveaux modes de jeu suivant l'architecture GameMode.js
**Utilisation :** Claude active cette skill lors de la création de nouveaux modes de jeu

**Fichiers de référence :**

- `js/core/GameMode.js` - Classe abstraite
- `js/modes/QuizMode.js` - Exemple simple
- `js/modes/ChallengeMode.js` - Exemple complexe

#### 4. TDD with Jest

**Emplacement :** `tdd-jest/`
**Description :** Implémente les fonctionnalités en suivant le cycle RED/GREEN/REFACTOR avec Jest
**Utilisation :** Claude active cette skill lors de l'ajout de features, corrections de bugs, ou refactoring

**Commandes manuelles :**

```bash
npm test                    # Tous les tests
npm run test:watch         # Tests en mode watch
npm run test:coverage      # Tests avec couverture
npm run test:verbose       # Output détaillé
```

**Concepts couverts :**

- Cycle TDD : RED → GREEN → REFACTOR
- Assertions Jest (toBe, toEqual, toThrow, etc.)
- Mocking et spies
- Tests asynchrones
- Patterns pour Game Modes et Event Bus

#### 5. Accessibility Validator

**Emplacement :** `accessibility/`
**Description :** Valide l'accessibilité web selon les standards WCAG 2.1 niveau AA
**Utilisation :** Claude active cette skill lors de modifications UI ou audits d'accessibilité

**Commandes manuelles :**

```bash
npm run audit:accessibility    # Audit a11y complet
npm run audit:mobile          # Audit mobile responsive
```

**Standards couverts :**

- Structure sémantique HTML
- Navigation clavier (Tab, Enter, Escape)
- Attributs ARIA (labels, roles, états)
- Contraste des couleurs (4.5:1 min)
- Alternatives textuelles (alt, aria-label)
- Focus visible et gestion du focus
- Tests avec lecteurs d'écran

#### 6. PWA Service Worker Manager

**Emplacement :** `pwa-service-worker/`
**Description :** Gère les mises à jour du Service Worker avec versioning du cache et tests offline
**Utilisation :** Claude active cette skill lors de modifications du SW ou ajout de ressources

**Commandes manuelles :**

```bash
npm run test:pwa-offline      # Tester fonctionnalité offline
npm run sw:disable            # Désactiver SW temporairement
npm run sw:fix                # Réparer SW en cas de problèmes
```

**Concepts couverts :**

- Versioning de cache (SemVer)
- Stratégies de cache (Cache First, Network First)
- Événements SW (install, activate, fetch)
- Debugging avec Chrome DevTools
- Tests offline et mise à jour forcée

### 🟢 Phase 3 - Skills avancées (implémentées)

#### 7. JSDoc Generator

**Emplacement :** `jsdoc-generator/`
**Description :** Génère automatiquement la documentation JSDoc pour modules ES6
**Utilisation :** Claude active cette skill lors de documentation de fonctions/classes

**Commandes manuelles :**

```bash
npm run analyze:jsdoc       # Analyser couverture JSDoc
npm run improve:jsdoc       # Suggestions amélioration
```

**Concepts couverts :**

- Format JSDoc standard (@param, @returns, @throws, @example)
- Types TypeScript-like dans JSDoc
- Documentation de classes et modules
- @typedef pour types personnalisés
- Génération HTML avec JSDoc CLI

#### 8. Performance Profiler

**Emplacement :** `performance-profiler/`
**Description :** Analyse et optimise les performances (temps de chargement, FPS, mémoire)
**Utilisation :** Claude active cette skill lors de ralentissements ou optimisation

**Outils couverts :**

- Chrome DevTools Performance
- Lighthouse audits
- Performance API (performance.mark/measure)
- FPS monitoring
- Memory leak detection

**Objectifs :**

- FPS ≥ 60 dans jeux arcade
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Memory usage stable

#### 9. Bundle Size Optimizer

**Emplacement :** `bundle-size-optimizer/`
**Description :** Analyse et réduit la taille des bundles JavaScript
**Utilisation :** Claude active cette skill lors d'ajout de dépendances ou bundle > 200 KB

**Commandes manuelles :**

```bash
npm run analyze:dependencies  # Analyser dépendances
npm run verify:dead-code      # Détecter code mort
```

**Stratégies :**

- Tree shaking et code splitting
- Lazy loading (déjà implémenté dans lazy-loader.js)
- Minification avec Terser
- Bundle analysis avec visualizer

#### 10. Asset Optimizer

**Emplacement :** `asset-optimizer/`
**Description :** Optimise images, sprites, sons et médias pour réduire bande passante
**Utilisation :** Claude active cette skill avant d'ajouter gros assets

**Commandes manuelles :**

```bash
npm run assets:generate      # Générer versions responsive
npm run assets:analyze       # Analyser utilisation
npm run assets:diff          # Comparer avant/après
```

**Optimisations :**

- Compression images (PNG, JPG, WebP, AVIF)
- Sprite sheets et lazy loading
- Audio compression (MP3 96 kbps)
- Formats modernes avec fallback

### 🎮 Phase 4 - Skills spécialisées (implémentées)

#### 11. Arcade Game Creator

**Emplacement :** `arcade-game-creator/`
**Description :** Crée des jeux arcade canvas HTML5 suivant les patterns leapmultix
**Utilisation :** Claude active cette skill lors de création de nouveaux mini-jeux

**Architecture :**

- Engine (logique jeu)
- Renderer (rendu canvas)
- Controls (clavier + touch)
- Questions (intégration multiplication)

**Jeux de référence :**

- `multisnake.js` (38 KB) - Snake game
- `arcade-invasion.js` (31 KB) - Space Invaders
- `multimiam-*.js` - Multimiam décomposé

#### 12. Animation System Helper

**Emplacement :** `animation-system/`
**Description :** Crée animations CSS et JavaScript (keyframes, transitions, sprite animations)
**Utilisation :** Claude active cette skill lors d'ajout d'animations visuelles

**Types d'animations :**

- CSS Keyframes (@keyframes fadeIn, pulse, shake, etc.)
- CSS Transitions (hover, active states)
- JavaScript requestAnimationFrame
- Sprite animations canvas
- Particle systems

**Performance :**

- GPU acceleration (transform, opacity)
- prefers-reduced-motion support
- 60 FPS maintenu

#### 13. Sound Effect Manager

**Emplacement :** `sound-effect-manager/`
**Description :** Gère effets sonores et audio pour feedback utilisateur
**Utilisation :** Claude active cette skill lors d'ajout de nouveaux sons

**Module existant :**

- `js/core/audio.js` - AudioManager complet
- playSound(), setVolume(), toggleMute()

**Patterns :**

- Sound pools (sons répétitifs)
- Fade in/out
- Musique de fond avec loop
- Web Audio API avancé
- Mobile autoplay handling

#### 14. Sprite Management

**Emplacement :** `sprite-management/`
**Description :** Gère sprites, sprite sheets, animations et collisions
**Utilisation :** Claude active cette skill lors de création de jeux ou ajout de personnages

**Features :**

- Sprite simple et sprite sheets
- Animations (idle, walk, jump, attack)
- Collisions (AABB, circle, spatial grid)
- Sprites directionnels (4 directions)
- Object pooling et culling

**Optimisations :**

- Batch rendering
- Spatial hashing pour collisions
- Culling (dessiner seulement visible)

## Comment utiliser les Skills

### Activation automatique

Les Skills s'activent automatiquement quand Claude détecte que le contexte correspond à leur description. Vous n'avez rien à faire de spécial.

**Exemples :**

```
Vous : "Je veux ajouter une nouvelle traduction pour le mode arcade"
→ Claude active automatiquement la skill "I18n Translation Sync"

Vous : "Je suis prêt à committer mes changements"
→ Claude active automatiquement la skill "Code Quality Gate"

Vous : "Je veux créer un nouveau mode de jeu pour apprendre les divisions"
→ Claude active automatiquement la skill "New Game Mode Creator"

Vous : "Je veux implémenter une nouvelle fonction en TDD"
→ Claude active automatiquement la skill "TDD with Jest"

Vous : "Peux-tu vérifier l'accessibilité de cette page ?"
→ Claude active automatiquement la skill "Accessibility Validator"

Vous : "Je dois mettre à jour le Service Worker"
→ Claude active automatiquement la skill "PWA Service Worker Manager"
```

### Vérifier les Skills disponibles

Demandez à Claude :

```
Quelles skills sont disponibles pour ce projet ?
```

### Tester une Skill

Posez une question qui correspond à la description de la skill :

```
Peux-tu vérifier que mes traductions sont synchronisées ?
→ Active "I18n Translation Sync"

Est-ce que mon code est prêt à être committé ?
→ Active "Code Quality Gate"

Comment créer un nouveau mode de jeu ?
→ Active "New Game Mode Creator"

Écris les tests en TDD pour cette fonction
→ Active "TDD with Jest"

Vérifie l'accessibilité de ce composant
→ Active "Accessibility Validator"

Comment mettre à jour le cache du Service Worker ?
→ Active "PWA Service Worker Manager"
```

## Structure d'une Skill

```
skill-name/
├── SKILL.md              # Fichier principal (obligatoire)
├── resources/            # Documentation additionnelle (optionnel)
│   ├── reference.md
│   ├── examples.md
│   └── patterns.md
└── templates/            # Templates de code (optionnel)
    └── template.js
```

### Anatomie de SKILL.md

```yaml
---
name: "Nom de la Skill"
description: "Description claire de QUAND et COMMENT utiliser cette skill"
---

# Titre de la Skill

## Quand utiliser cette skill
- Cas d'usage 1
- Cas d'usage 2

## Instructions étape par étape
1. Étape 1
2. Étape 2

## Exemples
Code ou exemples concrets

## Bonnes pratiques
Recommandations

## Voir aussi
Liens vers documentation
```

## Créer une nouvelle Skill

### Étape 1 : Créer la structure

```bash
mkdir -p .claude/skills/ma-skill
touch .claude/skills/ma-skill/SKILL.md
```

### Étape 2 : Écrire SKILL.md

Utilisez le template ci-dessus et assurez-vous que :

- Le `description` explique QUAND utiliser la skill
- Les instructions sont claires et actionnables
- Des exemples concrets sont fournis
- Les bonnes pratiques sont documentées

### Étape 3 : Tester la Skill

Redémarrez Claude Code et testez avec une question correspondante :

```
Peux-tu m'aider avec [description de ta skill] ?
```

### Étape 4 : Itérer

Basé sur l'utilisation :

- Raffiner la description pour meilleure découverte
- Ajouter des exemples manquants
- Déplacer le contenu long dans resources/
- Ajouter templates si nécessaire

## Bonnes pratiques

### Description efficace

**❌ Trop vague :**

```yaml
description: 'Aide avec les données'
```

**✅ Spécifique :**

```yaml
description: 'Vérifie la synchronisation des fichiers i18n (fr, en, es) et détecte clés manquantes, valeurs vides, incohérences de types. Utiliser lors de modifications de traductions.'
```

### Garder SKILL.md concis

- Maximum 500 lignes recommandé
- Déplacer détails dans resources/
- Utiliser progressive disclosure
- Privilégier exemples aux explications longues

### Organisation des fichiers

```
resources/
├── reference.md        # Documentation détaillée
├── patterns.md         # Patterns de code
├── examples.md         # Exemples concrets
└── troubleshooting.md  # Solutions aux problèmes courants

templates/
├── class-template.js   # Template de classe
├── test-template.js    # Template de test
└── config-template.json # Template de config
```

### Noms de fichiers descriptifs

**✅ Bon :**

- `resources/jest-patterns.md`
- `resources/gamemode-lifecycle.md`
- `templates/GameModeTemplate.js`

**❌ Éviter :**

- `resources/doc1.md`
- `resources/info.md`
- `templates/template.js`

## Partage et versioning

### Git

Les Skills dans `.claude/skills/` sont versionnées avec le projet :

```bash
git add .claude/skills/
git commit -m "Add i18n-sync skill"
git push
```

Les membres de l'équipe obtiennent automatiquement les skills après `git pull`.

### Documentation des versions

Ajoutez une section historique dans SKILL.md :

```markdown
## Historique des versions

- v1.1.0 (2025-10-19) : Ajout vérification types array/string
- v1.0.0 (2025-10-15) : Version initiale
```

## Debugging

### Skill ne s'active pas

**Vérifier :**

1. Description assez spécifique ?
2. YAML frontmatter valide ?
3. Fichier dans bon emplacement ?

**Tester :**

```bash
# Vérifier existence
ls .claude/skills/*/SKILL.md

# Vérifier frontmatter
cat .claude/skills/ma-skill/SKILL.md | head -n 10

# Mode debug
claude --debug
```

### Conflicts entre Skills

Si plusieurs skills correspondent, rendez les descriptions plus distinctes :

**❌ Trop similaire :**

```yaml
# Skill 1
description: "Pour l'analyse de données"

# Skill 2
description: "Pour analyser les données"
```

**✅ Distinct :**

```yaml
# Skill 1
description: "Analyser données de ventes Excel/CRM pour rapports revenus"

# Skill 2
description: "Analyser fichiers logs et métriques système pour diagnostics"
```

## Ressources

### Documentation officielle

- [Claude Code Skills Guide](https://docs.claude.com/en/docs/claude-code/skills)
- [Agent Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)

### Exemples communautaires

- [Anthropic Official Skills](https://github.com/anthropics/skills)
- [obra/superpowers](https://github.com/obra/superpowers) - Core skills library
- [obra/superpowers-skills](https://github.com/obra/superpowers-skills) - Community skills

### Projet leapmultix

- `CLAUDE.md` - Documentation principale du projet
- `package.json` - Scripts npm disponibles
- `eslint.config.js` - Configuration ESLint
- `.prettierrc` - Configuration Prettier

## Contribution

Pour proposer une nouvelle skill :

1. Créer la skill dans votre branche
2. Tester avec cas d'usage réels
3. Documenter exemples et bonnes pratiques
4. Créer PR avec description du problème résolu
5. Équipe review et merge

## Support

Questions ou problèmes avec les Skills ?

1. Vérifier ce README
2. Consulter SKILL.md de la skill concernée
3. Tester avec `claude --debug`
4. Demander à Claude : "Explique-moi comment fonctionne la skill X"

## Roadmap

### Phase 1 ✅ - Skills de base (Complétée)

- [x] I18n Translation Sync
- [x] Code Quality Gate
- [x] New Game Mode Creator

### Phase 2 ✅ - Skills intermédiaires (Complétée)

- [x] TDD with Jest
- [x] Accessibility Validator
- [x] PWA Service Worker Manager

### Phase 3 ✅ - Skills avancées (Complétée)

- [x] JSDoc Generator - Documentation ES6 automatisée
- [x] Performance Profiler - Analyse et optimisation performance
- [x] Bundle Size Optimizer - Optimisation taille bundles
- [x] Asset Optimizer - Optimisation images et médias

### Phase 4 ✅ - Skills spécialisées (Complétée)

- [x] Arcade Game Creator - Template jeux arcade canvas
- [x] Animation System Helper - Animations CSS/JS
- [x] Sound Effect Manager - Gestion effets sonores
- [x] Sprite Management - Gestion sprites et animations

## 🎉 Toutes les skills ont été créées !

**Total : 14 skills opérationnelles** couvrant l'ensemble du cycle de développement de leapmultix, de la qualité du code aux jeux arcade en passant par l'optimisation et l'accessibilité.

## Licence

Ces Skills sont spécifiques au projet leapmultix et partagent la même licence que le projet principal.

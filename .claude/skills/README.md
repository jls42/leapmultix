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

### 🟡 Moyenne priorité (à créer)

#### 4. TDD with Jest
**Description :** Implémenter features avec TDD (RED/GREEN/REFACTOR)
**Quand créer :** Quand vous voulez standardiser l'approche TDD

#### 5. Accessibility Validator
**Description :** Tester l'accessibilité avec WCAG 2.1 AA
**Quand créer :** Si vous voulez automatiser les audits a11y

#### 6. PWA Service Worker Manager
**Description :** Gérer les mises à jour du service worker en toute sécurité
**Quand créer :** Avant de modifier le service worker

#### 7. JSDoc Generator
**Description :** Générer documentation JSDoc pour modules ES6
**Quand créer :** Pour standardiser la documentation du code

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
description: "Aide avec les données"
```

**✅ Spécifique :**
```yaml
description: "Vérifie la synchronisation des fichiers i18n (fr, en, es) et détecte clés manquantes, valeurs vides, incohérences de types. Utiliser lors de modifications de traductions."
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

### Phase 1 (Actuelle) - Skills de base
- [x] I18n Translation Sync
- [x] Code Quality Gate
- [x] New Game Mode Creator

### Phase 2 - Skills intermédiaires
- [ ] TDD with Jest
- [ ] Accessibility Validator
- [ ] PWA Service Worker Manager

### Phase 3 - Skills avancées
- [ ] JSDoc Generator
- [ ] Performance Profiler
- [ ] Bundle Size Optimizer
- [ ] Asset Optimizer

### Phase 4 - Skills spécialisées
- [ ] Arcade Game Creator
- [ ] Animation System Helper
- [ ] Sound Effect Manager
- [ ] Sprite Management

## Licence

Ces Skills sont spécifiques au projet leapmultix et partagent la même licence que le projet principal.

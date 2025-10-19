---
name: "Code Quality Gate"
description: "Exécute les vérifications de qualité du code (format:check, ESLint, Jest) avant chaque commit selon les standards du projet leapmultix"
---

# Code Quality Gate

Cette skill garantit que tout le code respecte les standards de qualité du projet avant commit.

## Quand utiliser cette skill
- Avant chaque commit
- Avant de créer une Pull Request
- Après modification de fichiers JavaScript
- Quand demandé explicitement par l'utilisateur

## Workflow obligatoire AVANT COMMIT

### Étape 1 : Vérification du formatage (CRITIQUE)

```bash
npm run format:check
```

**IMPORTANT :** Cette commande DOIT être exécutée en premier. La CI/CD échouera si le code n'est pas formatté.

**Si format:check échoue :**
```bash
npm run format
```

Cela formate automatiquement le code avec Prettier.

### Étape 2 : Linting

```bash
npm run lint
```

**Si le linting échoue :**
```bash
npm run lint:fix
```

Cela corrige automatiquement les problèmes ESLint.

### Étape 3 : Tests

```bash
npm test
```

**Pour une vérification complète avec couverture :**
```bash
npm run test:coverage
```

### Étape 4 : Gate complet (recommandé)

Pour exécuter toutes les vérifications d'un coup :

```bash
npm run verify
```

Cette commande exécute : lint + test + coverage

## Standards de code

### JavaScript/ES6

**Règles obligatoires :**

1. **Pas de variables inutilisées** (no-unused-vars)
   ```javascript
   // ❌ Mauvais
   function calculate(a, b, unused) {
     return a + b;
   }

   // ✅ Bon
   function calculate(a, b) {
     return a + b;
   }
   ```

2. **Pas de blocs catch vides**
   ```javascript
   // ❌ Mauvais
   try {
     riskyOperation();
   } catch (e) {}

   // ✅ Bon
   try {
     riskyOperation();
   } catch (e) {
     console.error('Operation failed:', e);
     // ou au minimum :
     // eslint-disable-next-line no-empty -- Intentionally ignoring errors
   }
   ```

3. **Utiliser security-utils pour DOM**
   ```javascript
   // ❌ Mauvais
   element.innerHTML = userContent;

   // ✅ Bon
   import { appendSanitizedHTML } from './security-utils.js';
   appendSanitizedHTML(element, userContent);
   ```

4. **Complexité cognitive < 15**
   - Si une fonction est trop complexe, la découper en helpers
   - Extraire la logique dans des fonctions nommées

### CSS

**Notation couleur moderne :**
```css
/* ❌ Mauvais */
color: rgba(255, 255, 255, 0.9);

/* ✅ Bon */
color: rgb(255 255 255 / 0.9);
```

Préférer `rgb` à l'alias `rgba`.

### Sécurité

**Règles importantes :**

1. **Toujours sanitiser le HTML**
   ```javascript
   import { appendSanitizedHTML, setSafeMessage } from './security-utils.js';

   // Pour HTML
   appendSanitizedHTML(element, htmlContent);

   // Pour texte
   setSafeMessage(element, textContent);
   ```

2. **Scripts externes**
   - Ajouter `crossorigin="anonymous"` aux scripts externes
   - Utiliser integrity hashes pour bibliothèques statiques
   - **NE PAS** utiliser integrity pour analytics (Plausible, Google Analytics)

3. **Validation des entrées**
   - Valider toutes les entrées externes
   - Ne jamais utiliser innerHTML avec données utilisateur

## Gestion des faux positifs

### ESLint/SonarCloud

Utiliser les commentaires ESLint pour les faux positifs légitimes :

**Ligne unique :**
```javascript
// eslint-disable-next-line no-console -- Debug output for development
console.log('debug');
```

**Bloc de code :**
```javascript
/* eslint-disable no-console */
console.log('debug 1');
console.log('debug 2');
/* eslint-enable no-console */
```

**Fichier entier :**
```javascript
/* eslint-disable */
```

### Faux positifs courants

**1. getTranslation() est sécurisé**
```javascript
// eslint-disable-next-line security/detect-object-injection, sonarjs/no-unsafe-string-usage -- False positive: getTranslation returns safe internal content
const html = getTranslation('key');
```

**2. appendSanitizedHTML() est sécurisé**
```javascript
// eslint-disable-next-line security/detect-unsafe-regex, sonarjs/no-html-injection -- Safe: using appendSanitizedHTML for proper sanitization
appendSanitizedHTML(element, html);
```

**3. Nettoyage avec innerHTML vide**
```javascript
// eslint-disable-next-line no-restricted-properties -- Safe: clearing with empty string
element.innerHTML = '';
```

**4. Scripts analytics sans integrity**
```html
<!-- eslint-disable-next-line sonarjs/no-script-without-integrity -- Analytics script auto-updates, integrity would break functionality -->
<script src="https://plausible.io/js/script.js"></script>
```

## Conventions de commit

**Style des messages :**
- Mode impératif ("Fix" pas "Fixed" ou "Fixes")
- Concis et descriptif
- Exemples : "Fix arcade init errors", "Refactor cache updater"

**Avant de committer :**
1. ✅ `npm run format:check` passe (ou `format` exécuté)
2. ✅ `npm run lint` passe (ou `lint:fix` exécuté)
3. ✅ `npm test` passe
4. ✅ `npm run test:coverage` montre couverture acceptable
5. ✅ Aucun secret, API key, ou fichier Terraform state

## Configuration des outils

**ESLint :** `eslint.config.js` (flat config, ES2022)
**Prettier :** `.prettierrc`
**Stylelint :** `.stylelintrc.json`
**Jest :** `jest.config.cjs`

## Commandes de test disponibles

```bash
npm test                    # Tous les tests
npm run test:watch         # Tests en mode watch
npm run test:coverage      # Tests avec rapport de couverture
npm run test:core          # Tests du core uniquement
npm run test:integration   # Tests d'intégration
npm run test:storage       # Tests storage
npm run test:esm           # Tests modules ES (.mjs)
npm run test:verbose       # Output détaillé
```

## Checklist pré-commit

- [ ] Code formatté (`format:check` passe)
- [ ] Pas d'erreurs ESLint (`lint` passe)
- [ ] Tests passent (`test` passe)
- [ ] Couverture acceptable (`test:coverage`)
- [ ] Pas de console.log oubliés (sauf debug intentionnel)
- [ ] Pas de variables inutilisées
- [ ] Sécurité vérifiée (security-utils utilisé)
- [ ] Message de commit descriptif

## Gate CI/CD

La CI/CD échouera si :
- Code non formatté (Prettier)
- Erreurs ESLint
- Tests en échec
- Couverture insuffisante

**Toujours exécuter localement AVANT de pusher.**

## Règles spéciales

### Suppression de code mort

Utiliser les scripts d'analyse :
```bash
npm run verify:dead-code     # Détecte code inutilisé
npm run analyze:globals      # Analyse variables globales
npm run verify:cleanup       # Exécute les deux
```

### Documentation JSDoc

Utiliser les scripts :
```bash
npm run analyze:jsdoc        # Analyse couverture JSDoc
npm run improve:jsdoc        # Améliore documentation
```

## Voir aussi
- `eslint.config.js` - Configuration ESLint
- `.prettierrc` - Configuration Prettier
- `jest.config.cjs` - Configuration Jest
- `CLAUDE.md` - Conventions du projet
- `security-utils.js` - Fonctions de sécurité

---
name: 'Security Audit'
description: "Audite la sécurité de l'application (XSS, CSP, dépendances vulnérables, CORS). Utiliser avant release, après ajout dépendances, ou modification security-utils.js"
---

# Security Audit

Cette skill audite la sécurité de l'application web éducative selon les standards OWASP et best practices pour PWA.

## Quand utiliser cette skill

- Avant chaque release en production
- Après ajout ou mise à jour de dépendances npm
- Lors de modifications de `security-utils.js`
- Quand des warnings eslint-plugin-security apparaissent
- Avant de committer du code manipulant du HTML dynamique
- Lors de l'ajout de scripts externes (CDN, analytics)

## Domaines de sécurité couverts

### 1. XSS (Cross-Site Scripting) Prevention

**Patterns sécurisés du projet:**

```javascript
// ✅ SÉCURISÉ - Utiliser security-utils.js
import { appendSanitizedHTML, createSafeElement, setSafeMessage } from './security-utils.js';

// Insérer HTML dynamique de manière sécurisée
appendSanitizedHTML(element, htmlString);

// Créer un élément avec contenu sécurisé
const div = createSafeElement('div', { className: 'message' }, textContent);

// Définir un message texte (pas de HTML)
setSafeMessage(element, textContent);
```

```javascript
// ❌ DANGEREUX - Éviter
element.innerHTML = userInput; // XSS vulnerability
element.innerHTML = getTranslation('key'); // Acceptable mais préférer setSafeMessage

// ✅ EXCEPTIONS SÉCURISÉES
element.innerHTML = ''; // Safe: clearing with empty string
// eslint-disable-next-line no-restricted-properties -- Safe: clearing with empty string
```

**Audit checklist XSS:**

- [ ] Tous les `innerHTML` utilisent `appendSanitizedHTML()` ou sont justifiés
- [ ] `getTranslation()` output n'est jamais combiné avec user input
- [ ] Pas de `eval()`, `Function()`, ou `setTimeout(string)` avec données externes
- [ ] Les attributs HTML sont correctement échappés
- [ ] Les event handlers ne proviennent pas d'entrées utilisateur

### 2. Content Security Policy (CSP)

**Configuration recommandée pour leapmultix:**

```html
<!-- index.html - Ajouter dans <head> -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'nonce-RANDOM_NONCE' https://plausible.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://plausible.io;
  media-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
"
/>
```

**Scripts externes - Gestion integrity hashes:**

```html
<!-- ✅ AVEC integrity - Scripts statiques avec versions fixes -->
<script
  src="https://cdn.example.com/lib@1.0.0/library.js"
  integrity="sha384-HASH_HERE"
  crossorigin="anonymous"
></script>

<!-- ✅ SANS integrity - Scripts analytics qui auto-update -->
<!-- eslint-disable-next-line sonarjs/no-script-without-integrity -- Analytics script auto-updates, integrity would break functionality -->
<script
  src="https://plausible.io/js/script.js"
  data-domain="example.com"
  crossorigin="anonymous"
></script>
```

**CSP Audit checklist:**

- [ ] Meta tag CSP présent dans `index.html`
- [ ] `default-src 'self'` comme baseline restrictive
- [ ] Scripts analytics sans integrity documentés (commentaires)
- [ ] Pas de `'unsafe-eval'` dans script-src
- [ ] `'unsafe-inline'` limité au strict nécessaire (styles uniquement si besoin)
- [ ] `crossorigin="anonymous"` sur tous les scripts externes
- [ ] `frame-ancestors 'none'` pour prévenir clickjacking

### 3. Dependency Vulnerabilities

**Commandes de scan:**

```bash
# Audit npm pour vulnérabilités connues
npm audit

# Audit avec détails complets
npm audit --json > audit-report.json

# Fix automatique des vulnérabilités (patch/minor)
npm audit fix

# Fix incluant breaking changes (attention!)
npm audit fix --force

# Vérifier les packages outdated
npm outdated
```

**Workflow recommandé:**

1. **Exécuter `npm audit` régulièrement** (avant chaque commit majeur)
2. **Analyser le rapport:**
   - `Critical` et `High` → Fix immédiatement
   - `Moderate` → Fix avant release
   - `Low` → Fix quand possible
3. **Vérifier les breaking changes** avant `npm audit fix --force`
4. **Tester après updates:** `npm test && npm run verify`

**Dependency audit checklist:**

- [ ] `npm audit` ne montre aucune vulnérabilité Critical/High
- [ ] Toutes les dépendances sont à jour (vérifier `npm outdated`)
- [ ] Pas de packages depreciated
- [ ] `package-lock.json` est commité et à jour
- [ ] Pas de dépendances inutilisées (utiliser `npm run analyze:dependencies`)

### 4. ESLint Security Plugin

**Installation:**

```bash
npm install --save-dev eslint-plugin-security
```

**Configuration dans `eslint.config.js`:**

```javascript
import security from 'eslint-plugin-security';

export default [
  {
    plugins: {
      security,
    },
    rules: {
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'warn',
      'security/detect-buffer-noassert': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'error',
    },
  },
];
```

**Gestion des false positives:**

```javascript
// Multiple règles pour couverture complète Codacy/SonarCloud
// eslint-disable-next-line security/detect-object-injection, sonarjs/no-unsafe-string-usage -- False positive: getTranslation returns safe internal content
const text = getTranslation('key.path');

// eslint-disable-next-line security/detect-unsafe-regex, sonarjs/no-html-injection -- Safe: using appendSanitizedHTML for proper sanitization
appendSanitizedHTML(element, sanitizedHTML);

// eslint-disable-next-line no-restricted-properties -- Safe: clearing with empty string
element.innerHTML = '';
```

**ESLint security checklist:**

- [ ] `eslint-plugin-security` installé et configuré
- [ ] Toutes les règles security activées (error ou warn)
- [ ] False positives documentés avec justifications claires
- [ ] `npm run lint` passe sans erreurs security non justifiées

### 5. CORS (Cross-Origin Resource Sharing)

**Pour leapmultix (PWA offline-first):**

Comme le projet est une PWA statique sans backend:

- ✅ Pas de configuration CORS nécessaire
- ✅ Toutes les ressources servies depuis même origine
- ✅ Service Worker gère le cache offline

**Si API externe ajoutée à l'avenir:**

```javascript
// ✅ CORS safe fetch
fetch('https://api.example.com/data', {
  method: 'GET',
  mode: 'cors', // Explicitly request CORS
  credentials: 'omit', // Don't send cookies cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**CORS audit checklist (si API externe):**

- [ ] `Access-Control-Allow-Origin` configuré côté serveur
- [ ] Pas de wildcard `*` en production
- [ ] `credentials: 'omit'` pour requêtes non authentifiées
- [ ] Preflight requests (OPTIONS) gérées correctement

### 6. LocalStorage Security

**Best practices pour leapmultix:**

```javascript
// ✅ SÉCURISÉ - Ne jamais stocker de données sensibles
Storage.set('userProgress', progressData); // OK: données de progression
Storage.set('currentUser', username); // OK: username (pas sensible)

// ❌ DANGEREUX - Ne JAMAIS stocker
Storage.set('password', hashedPassword); // Même hashé, non!
Storage.set('apiKey', key); // Clés API en localStorage = vulnérable
Storage.set('sessionToken', token); // Tokens en localStorage = XSS risk
```

**LocalStorage audit checklist:**

- [ ] Aucune donnée sensible stockée (passwords, tokens, API keys)
- [ ] Validation des données lues depuis LocalStorage (peuvent être modifiées)
- [ ] Gestion des données corrompues (try/catch, fallbacks)
- [ ] Pas de code exécutable stocké en LocalStorage

### 7. Subresource Integrity (SRI)

**Quand utiliser integrity hashes:**

```html
<!-- ✅ UTILISER integrity - Bibliothèques statiques avec versions fixes -->
<script
  src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"
  integrity="sha384-kjOc+8xOjVdF8qY8lBa6xBw6KfFmJZp9bCLPZgZyZ7aK8..."
  crossorigin="anonymous"
></script>

<!-- ✅ NE PAS utiliser integrity - Scripts analytics qui auto-update -->
<!-- Suppressing static analysis warnings:
sonarjs:S5725 - External scripts without integrity acceptable for analytics
-->
<!-- eslint-disable-next-line sonarjs/no-script-without-integrity -- Analytics auto-updates -->
<script src="https://plausible.io/js/script.js" crossorigin="anonymous"></script>
```

**Générer integrity hash:**

```bash
# Télécharger le fichier
curl https://cdn.example.com/library.js -o library.js

# Générer hash SHA-384
openssl dgst -sha384 -binary library.js | openssl base64 -A

# Ou utiliser l'outil en ligne: https://www.srihash.org/
```

**SRI audit checklist:**

- [ ] Tous les scripts CDN statiques ont `integrity` et `crossorigin`
- [ ] Scripts analytics sans integrity sont documentés
- [ ] Integrity hashes correspondent aux versions des scripts
- [ ] Mise à jour des hashes quand versions CDN changent

## Workflows de sécurité

### Avant chaque commit

```bash
# 1. Vérifier le linting avec règles security
npm run lint

# 2. Audit des dépendances
npm audit

# 3. Tests de sécurité (si implémentés)
npm test -- security

# 4. Vérifier les patterns dangereux
git diff | grep -i "innerHTML\|eval\|Function("
```

### Avant chaque release

```bash
# Audit complet de sécurité
npm audit --audit-level=moderate
npm run lint
npm test
npm run verify

# Vérifier CSP headers
curl -I https://your-domain.com | grep -i "content-security-policy"

# Scan avec outils externes (optionnel)
# - Lighthouse security audit
# - OWASP ZAP
# - Snyk scan
```

### Code review checklist sécurité

Lors de la review de code, vérifier:

- [ ] Aucun `innerHTML` sans justification ou sans `appendSanitizedHTML()`
- [ ] Tous les scripts externes ont `crossorigin="anonymous"`
- [ ] Pas de secrets/tokens/API keys dans le code
- [ ] Validation des entrées utilisateur (forms, localStorage)
- [ ] Gestion des erreurs sécurisée (pas de stack traces exposées)
- [ ] False positives ESLint documentés avec `--` commentaires
- [ ] Pas de `eval()`, `Function()`, `setTimeout(string)` avec données externes

## Outils et ressources

### Outils recommandés

- **ESLint Security Plugin**: `npm install eslint-plugin-security`
- **npm audit**: Intégré à npm
- **Snyk**: `npm install -g snyk` - Scan vulnerabilities avancé
- **Lighthouse**: Audit sécurité via Chrome DevTools
- **OWASP ZAP**: Scan de sécurité web approfondi

### Ressources de référence

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CSP Quick Reference Guide](https://content-security-policy.com/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)

## Integration avec autres Skills

Utilise ces Skills en complément:

- **@code-quality** - Lint et format avant security audit
- **@tdd-jest** - Tests unitaires incluant security edge cases
- **@pwa-service-worker** - Sécurité du Service Worker et cache

## Expert Agents recommandés

- **@code-reviewer** - Review sécurité dans le code, utilise ce Skill
- **@debugger** - Investigation de failles de sécurité découvertes
- **@web-research-specialist** - Recherche de CVEs, advisories, patches

## Voir aussi

- `js/security-utils.js` - Fonctions de sécurité du projet
- `eslint.config.js` - Configuration ESLint avec règles security
- `CLAUDE.md` - Guidelines sécurité et suppression false positives
- `.claude/skills/code-quality/` - Workflow qualité de code

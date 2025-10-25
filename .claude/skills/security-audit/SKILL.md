---
name: 'security-audit'
description: "Audite la sécurité de l'application (XSS, CSP, dépendances vulnérables, CORS). Utiliser avant release, après ajout dépendances, ou modification security-utils.js"
---

# Security Audit

Audite la sécurité de l'application web selon standards OWASP et best practices.

## Quand utiliser

- Avant chaque release en production
- Après ajout/mise à jour dépendances npm
- Modifications de `security-utils.js`
- Warnings eslint-plugin-security
- Avant commit manipulant HTML dynamique
- Ajout de scripts externes (CDN, analytics)

## Domaines de sécurité

### 1. XSS (Cross-Site Scripting) Prevention

**Règle absolue : Utiliser security-utils.js**

Trouve security-utils.js pour voir fonctions disponibles :
- `appendSanitizedHTML()` - Insérer HTML dynamique
- `createSafeElement()` - Créer élément avec contenu sécurisé
- `setSafeMessage()` - Définir texte (pas HTML)

**Dangers :**
- `innerHTML` avec user input → XSS
- Fonctions d'exécution dynamique avec données externes
- Event handlers depuis user input

**Exceptions sécurisées :**
- `innerHTML = ''` (nettoyage)
- `getTranslation()` output (contenu interne)

### 2. Content Security Policy (CSP)

**Principe : Meta tag CSP dans index.html**

Examine index.html pour voir configuration CSP actuelle.

**Baseline restrictive :**
- `default-src 'self'`
- Pas de `'unsafe-eval'` dans script-src
- `'unsafe-inline'` limité au strict nécessaire
- `frame-ancestors 'none'` pour prévenir clickjacking

**Scripts externes :**
- Toujours `crossorigin="anonymous"`
- Integrity hashes pour bibliothèques statiques
- PAS d'integrity pour analytics (auto-update)
- Documenter exceptions avec commentaires

### 3. Dependency Vulnerabilities

**Commandes audit :**

```bash
npm audit                 # Scan vulnérabilités
npm audit --json         # Rapport détaillé
npm audit fix            # Fix auto (patch/minor)
npm audit fix --force    # Fix breaking (attention!)
```

**Niveaux de sévérité :**
- **Critical/High** : Fix immédiatement avant release
- **Moderate** : Fix dans sprint suivant
- **Low** : Monitorer, fix si possible

**Vérifier :**
- Pas de dépendances deprecated
- Versions à jour (pas trop anciennes)
- Licences compatibles

### 4. HTTPS et Mixed Content

**Vérifier :**
- HTTPS obligatoire en production
- Pas de resources HTTP (mixed content)
- Redirection HTTP → HTTPS
- HSTS header

Examine configuration serveur ou CDN.

### 5. Secrets et Credentials

**Règles :**
- **JAMAIS** committer secrets (API keys, tokens, passwords)
- **JAMAIS** stocker passwords en LocalStorage
- Utiliser variables d'environnement
- .gitignore pour fichiers sensibles (.env, credentials.json)

**Vérifier :**
- Pas de secrets hardcodés dans code
- .env dans .gitignore
- Terraform state pas committé

### 6. LocalStorage Security

**Données sensibles :**
- **JAMAIS** tokens d'authentification
- **JAMAIS** passwords ou PII
- OK pour préférences utilisateur non sensibles

**Vérifier :**
- storage.js utilise localStorage correctement
- Pas de données sensibles stockées
- Données validées avant lecture

## Checklist sécurité

- [ ] Tous `innerHTML` utilisent `appendSanitizedHTML()` ou justifiés
- [ ] Pas de fonctions d'exécution dynamique avec données externes
- [ ] Meta tag CSP présent dans index.html
- [ ] `crossorigin="anonymous"` sur scripts externes
- [ ] `npm audit` sans Critical/High
- [ ] Pas de secrets hardcodés
- [ ] Pas de données sensibles en LocalStorage
- [ ] HTTPS en production
- [ ] Pas de mixed content
- [ ] Tests sécurité passent

## Outils d'audit

**ESLint Security :**
```bash
npm run lint  # Inclut eslint-plugin-security
```

**Dependency Scan :**
```bash
npm audit
```

**Lighthouse Security Audit :**
- Lance Chrome DevTools → Lighthouse
- Vérifie section Security
- Score doit être 100

**OWASP ZAP (optionnel) :**
- Scan automatisé pour vulnérabilités web
- Tests de pénétration

## En cas de doute

**Source :** security-utils.js + CLAUDE.md

**Fichiers clés :**
1. `js/security-utils.js` - Fonctions sécurité du projet
2. `eslint.config.js` - Règles security ESLint
3. `index.html` - Configuration CSP
4. `CLAUDE.md` - Guidelines sécurité

**Règles absolues :**
1. TOUJOURS utiliser security-utils.js pour manipulation DOM
2. TOUJOURS audit avant release (`npm audit`)
3. JAMAIS `innerHTML` avec user input direct
4. JAMAIS stocker données sensibles en LocalStorage
5. JAMAIS scripts externes sans `crossorigin="anonymous"`

**Workflow minimal avant commit :**
```bash
npm run lint   # ESLint security rules
npm audit      # Dependency check
npm test       # Security tests
```

**Workflow complet avant release :**
```bash
npm run verify                        # Full quality gate
npm audit --audit-level=moderate      # Dependency audit
# Lighthouse security audit
# Review index.html CSP config
```

**Red flags (arrêter immédiatement) :**
- Fonctions d'exécution dynamique avec données externes
- `innerHTML = userInput`
- Tokens/passwords en LocalStorage
- npm audit Critical/High
- Scripts CDN sans crossorigin

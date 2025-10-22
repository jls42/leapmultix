---
name: 'Accessibility Validator'
description: "Valide l'accessibilité web selon les standards WCAG 2.1 AA pour les utilisateurs en situation de handicap. Utiliser lors de modifications UI, ajout de composants, ou audits d'accessibilité"
---

# Accessibility Validator

Cette skill guide la validation et l'amélioration de l'accessibilité web selon les standards WCAG 2.1 niveau AA.

## Quand utiliser cette skill

- Ajout de nouveaux composants UI
- Modification d'interfaces existantes
- Avant chaque release majeure
- Suite à un feedback utilisateur sur l'accessibilité
- Audit d'accessibilité complet

## Standards WCAG 2.1 niveau AA

### Quatre principes POUR (WCAG)

1. **Perceptible** - L'information doit être présentée de manière perceptible
2. **Opérable** - Les composants UI doivent être opérables
3. **Compréhensible** - L'information et l'UI doivent être compréhensibles
4. **Robuste** - Le contenu doit être robuste pour différents agents utilisateurs

## Commandes d'audit disponibles

### Audit d'accessibilité complet

```bash
npm run audit:accessibility
```

Cette commande vérifie :

- Attributs ARIA appropriés
- Navigation clavier
- Contraste des couleurs
- Alternatives textuelles
- Structure sémantique HTML

### Audit mobile responsive

```bash
npm run audit:mobile
```

Vérifie l'accessibilité sur mobile :

- Taille des zones tactiles
- Orientation écran
- Zoom et redimensionnement

## Checklist d'accessibilité

### 1. Structure sémantique HTML

**✅ Utiliser les balises HTML appropriées**

```html
<!-- ✅ Bon -->
<header>
  <nav aria-label="Navigation principale">
    <ul>
      <li><a href="#home">Accueil</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Titre principal</h1>
    <section>
      <h2>Sous-titre</h2>
      <p>Contenu...</p>
    </section>
  </article>
</main>

<footer>
  <p>Copyright 2025</p>
</footer>

<!-- ❌ Mauvais -->
<div class="header">
  <div class="nav">
    <div><span onclick="navigate()">Accueil</span></div>
  </div>
</div>
```

**✅ Hiérarchie des titres**

```html
<!-- ✅ Bon - Hiérarchie logique -->
<h1>Titre principal</h1>
<h2>Section 1</h2>
<h3>Sous-section 1.1</h3>
<h2>Section 2</h2>

<!-- ❌ Mauvais - Hiérarchie cassée -->
<h1>Titre principal</h1>
<h3>Section 1</h3>
<!-- Manque h2 -->
<h2>Section 2</h2>
```

### 2. Navigation clavier

**Tous les éléments interactifs doivent être accessibles au clavier**

```javascript
// ✅ Bon - Élément focusable avec gestion clavier
<button onClick={handleClick} onKeyPress={handleKeyPress}>
  Cliquer
</button>

// ❌ Mauvais - Div non focusable
<div onClick={handleClick}>
  Cliquer
</div>

// ✅ Correction - Ajouter tabindex et rôle
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyPress={handleKeyPress}
  aria-label="Cliquer pour continuer">
  Cliquer
</div>
```

**Navigation avec Tab**

- `Tab` : Naviguer vers l'élément suivant
- `Shift + Tab` : Naviguer vers l'élément précédent
- `Enter` ou `Space` : Activer l'élément
- `Escape` : Fermer modal/dialog

**Ordre de tab logique**

```html
<!-- ✅ Bon - Ordre visuel = ordre dans le DOM -->
<nav>
  <a href="#section1" tabindex="0">Section 1</a>
  <a href="#section2" tabindex="0">Section 2</a>
  <a href="#section3" tabindex="0">Section 3</a>
</nav>

<!-- ❌ Mauvais - Ordre forcé confusant -->
<nav>
  <a href="#section1" tabindex="3">Section 1</a>
  <a href="#section2" tabindex="1">Section 2</a>
  <a href="#section3" tabindex="2">Section 3</a>
</nav>
```

### 3. Attributs ARIA

**ARIA Labels pour contexte**

```html
<!-- ✅ Bon - Label descriptif -->
<button aria-label="Fermer la fenêtre de dialogue">
  <span aria-hidden="true">×</span>
</button>

<!-- ✅ Navigation avec label -->
<nav aria-label="Navigation principale">
  <ul>
    ...
  </ul>
</nav>

<!-- ✅ Région identifiable -->
<section aria-labelledby="game-title">
  <h2 id="game-title">Jeu des multiplications</h2>
</section>
```

**États ARIA dynamiques**

```javascript
// ✅ Bon - États ARIA mis à jour
<button
  aria-expanded={isOpen}
  aria-controls="menu-content">
  Menu
</button>

<div
  id="menu-content"
  aria-hidden={!isOpen}>
  Contenu du menu
</div>

// Pour messages live
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true">
  {errorMessage}
</div>
```

**ARIA Roles appropriés**

```html
<!-- ✅ Composants interactifs -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Titre du dialogue</h2>
  <div role="document">Contenu...</div>
</div>

<!-- ✅ Navigation et structure -->
<div role="navigation" aria-label="Navigation secondaire">...</div>

<div role="main">Contenu principal</div>

<!-- ✅ État de chargement -->
<div role="status" aria-live="polite">Chargement en cours...</div>
```

### 4. Alternatives textuelles

**Images**

```html
<!-- ✅ Image informative -->
<img src="multiplication-table.png" alt="Table de multiplication de 1 à 10" />

<!-- ✅ Image décorative -->
<img src="decoration.png" alt="" role="presentation" />

<!-- ✅ Image avec caption -->
<figure>
  <img src="graph.png" alt="Graphique des scores" />
  <figcaption>Progression des scores sur 7 jours</figcaption>
</figure>

<!-- ❌ Mauvais - Alt manquant -->
<img src="important.png" />
```

**Icônes**

```html
<!-- ✅ Icône avec texte alternatif -->
<button aria-label="Paramètres">
  <span class="icon-settings" aria-hidden="true"></span>
</button>

<!-- ✅ Icône avec texte visible -->
<button>
  <span class="icon-save" aria-hidden="true"></span>
  <span>Sauvegarder</span>
</button>
```

**Contenus vidéo et audio**

```html
<!-- ✅ Vidéo avec sous-titres -->
<video controls>
  <source src="tutorial.mp4" type="video/mp4" />
  <track kind="captions" src="captions-fr.vtt" srclang="fr" label="Français" />
  <track kind="captions" src="captions-en.vtt" srclang="en" label="English" />
</video>
```

### 5. Contraste des couleurs

**Ratio minimum WCAG AA :**

- Texte normal : 4.5:1
- Texte large (18pt+) : 3:1
- Composants UI : 3:1

```css
/* ✅ Bon - Contraste suffisant */
.text {
  color: #212121; /* Noir foncé */
  background: #ffffff; /* Blanc */
  /* Ratio: 16.1:1 */
}

.button {
  color: #ffffff;
  background: #1976d2; /* Bleu */
  /* Ratio: 4.6:1 */
}

/* ❌ Mauvais - Contraste insuffisant */
.light-text {
  color: #cccccc; /* Gris clair */
  background: #ffffff;
  /* Ratio: 1.6:1 - Trop faible */
}
```

**Vérifier le contraste :**

```bash
# Outils en ligne
- WebAIM Contrast Checker
- Chrome DevTools (Lighthouse)
```

### 6. Formulaires accessibles

**Labels explicites**

```html
<!-- ✅ Bon - Label associé -->
<label for="username">Nom d'utilisateur:</label>
<input
  type="text"
  id="username"
  name="username"
  aria-required="true"
  aria-describedby="username-hint"
/>
<span id="username-hint">Entre 3 et 20 caractères</span>

<!-- ❌ Mauvais - Placeholder seul -->
<input type="text" placeholder="Nom d'utilisateur" />
```

**Messages d'erreur**

```html
<!-- ✅ Bon - Erreur annoncée -->
<label for="email">Email:</label>
<input type="email" id="email" aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert" aria-live="assertive"> Format d'email invalide </span>
```

**Groupes de champs**

```html
<!-- ✅ Bon - Fieldset avec legend -->
<fieldset>
  <legend>Choisir une difficulté</legend>
  <label>
    <input type="radio" name="difficulty" value="easy" />
    Facile
  </label>
  <label>
    <input type="radio" name="difficulty" value="medium" />
    Moyen
  </label>
  <label>
    <input type="radio" name="difficulty" value="hard" />
    Difficile
  </label>
</fieldset>
```

### 7. Focus visible

**Toujours garder un indicateur de focus visible**

```css
/* ✅ Bon - Focus visible personnalisé */
button:focus,
a:focus {
  outline: 3px solid #1976d2;
  outline-offset: 2px;
}

/* ❌ Mauvais - Supprimer le focus */
*:focus {
  outline: none; /* Ne JAMAIS faire ça */
}

/* ✅ Acceptable si focus alternatif fourni */
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.5);
}
```

### 8. Motion et animation

**Respecter prefers-reduced-motion**

```css
/* ✅ Bon - Animations désactivables */
@media (prefers-reduced-motion: no-preference) {
  .animated {
    animation: slide 0.3s ease-in-out;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
    transition: none;
  }
}
```

```javascript
// ✅ Détection en JavaScript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Activer les animations
}
```

### 9. Zones tactiles (mobile)

**Taille minimum : 44×44 pixels**

```css
/* ✅ Bon - Zone tactile suffisante */
.mobile-button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}

/* ✅ Espacement entre boutons */
.button-group button {
  margin: 8px;
}
```

### 10. Landmarks ARIA

**Structure des régions**

```html
<!-- ✅ Bon - Landmarks ARIA -->
<header role="banner">
  <nav role="navigation" aria-label="Navigation principale">...</nav>
</header>

<main role="main">
  <section aria-labelledby="game-section">
    <h2 id="game-section">Jeu</h2>
    ...
  </section>
</main>

<aside role="complementary" aria-label="Statistiques">...</aside>

<footer role="contentinfo">...</footer>
```

## Tests d'accessibilité

### Tests manuels au clavier

**Checklist de navigation :**

1. **Débrancher la souris** (forcer l'utilisation du clavier)
2. Parcourir toute l'application avec `Tab`
3. Vérifier que :
   - [ ] Tous les éléments interactifs sont accessibles
   - [ ] L'ordre de tab est logique
   - [ ] Le focus est toujours visible
   - [ ] `Enter`/`Space` activent les éléments
   - [ ] `Escape` ferme les modals/dialogs
   - [ ] Les raccourcis clavier fonctionnent

### Tests avec lecteur d'écran

**Lecteurs d'écran à tester :**

- **NVDA** (Windows, gratuit)
- **JAWS** (Windows, payant)
- **VoiceOver** (macOS/iOS, intégré)
- **TalkBack** (Android, intégré)

**Points à vérifier :**

- [ ] Navigation par landmarks (`D` dans NVDA)
- [ ] Navigation par titres (`H`)
- [ ] Lecture du contenu des images
- [ ] Annonce des états (expanded, checked, etc.)
- [ ] Messages d'erreur annoncés
- [ ] Contenu dynamique annoncé (aria-live)

### Tests automatisés

```bash
# Audit d'accessibilité
npm run audit:accessibility

# Test PWA offline (inclut a11y)
npm run test:pwa-offline
```

## Patterns accessibles leapmultix

### Modal accessible

```javascript
// Modal avec gestion du focus
function showModal() {
  const modal = document.getElementById('modal');
  const previousFocus = document.activeElement;

  // Afficher modal
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');

  // Focus sur premier élément focusable
  const firstFocusable = modal.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  firstFocusable?.focus();

  // Piéger le focus dans la modal
  modal.addEventListener('keydown', trapFocus);

  // Restaurer focus à la fermeture
  modal.addEventListener('close', () => {
    previousFocus?.focus();
  });
}
```

### Bouton de slide accessible

```html
<!-- ✅ Bouton de navigation accessible -->
<button class="slide-nav" aria-label="Aller à la slide suivante" onClick="goToSlide(2)">
  Suivant
</button>
```

### Annonces live de score

```javascript
// Annoncer changement de score
function updateScore(newScore) {
  gameState.score = newScore;

  // Mise à jour visuelle
  document.getElementById('score').textContent = newScore;

  // Annonce pour lecteur d'écran
  const announcement = document.getElementById('score-announcement');
  announcement.textContent = `Nouveau score : ${newScore} points`;
}
```

```html
<div
  id="score-announcement"
  role="status"
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
></div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

### Mode jeu accessible

```javascript
// Annonces pendant le jeu
function startGame() {
  announce('Le jeu commence', 'assertive');
}

function handleCorrectAnswer() {
  announce('Bonne réponse !', 'polite');
  playSound('correct');
}

function announce(message, priority = 'polite') {
  const announcer = document.getElementById('announcer');
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = message;
}
```

## Outils de validation

### Extensions navigateur

- **axe DevTools** (Chrome/Firefox)
- **WAVE** (Chrome/Firefox)
- **Lighthouse** (Chrome intégré)

### Outils en ligne

- **WAVE Web Accessibility Evaluation Tool**
- **WebAIM Contrast Checker**
- **aXe Accessibility Checker**

### Outils CLI

```bash
# Lighthouse CLI
npx lighthouse https://localhost:8000 --only-categories=accessibility

# Pa11y
npx pa11y https://localhost:8000
```

## Checklist finale d'accessibilité

Avant chaque release :

- [ ] Navigation clavier complète fonctionne
- [ ] Tous les formulaires ont des labels
- [ ] Toutes les images ont alt approprié
- [ ] Contraste des couleurs respecté (4.5:1 min)
- [ ] Titres en hiérarchie logique
- [ ] Landmarks ARIA présents
- [ ] Focus toujours visible
- [ ] ARIA labels sur éléments interactifs
- [ ] États ARIA mis à jour dynamiquement
- [ ] prefers-reduced-motion respecté
- [ ] Zones tactiles ≥ 44×44px sur mobile
- [ ] Testé avec lecteur d'écran
- [ ] Audit automatisé passé
- [ ] Mobile responsive accessible

## Agents disponibles pour audit d'accessibilité

Pour des vérifications approfondies d'accessibilité :

**Code-reviewer Agent :**

- Use the **code-reviewer agent** pour une analyse complète incluant WCAG 2.1 AA
- Il vérifie : navigation clavier, ARIA labels, color contrast, semantic HTML, touch targets
- Fournit feedback structuré par sévérité (Critical/Important/Suggestion)

**Test-writer Agent (pour tests a11y) :**

- Use the **test-writer agent** pour créer des tests automatisés d'accessibilité
- Tests pour : keyboard navigation, screen reader compatibility, ARIA attributes
- Intégration dans suite Jest

**Chrome-devtools-tester Agent :**

- Use the **chrome-devtools-tester agent** pour valider dans le navigateur
- Tests visuels : focus indicators, responsive design, animations
- Vérification console errors liés à a11y

**Workflow recommandé :**

1. Modifier UI ou ajouter composant
2. Use **code-reviewer agent** pour vérifier WCAG compliance
3. Use **test-writer agent** pour tests automatisés
4. Use **chrome-devtools-tester agent** pour validation navigateur
5. Tester manuellement avec lecteur d'écran
6. Exécuter `npm run audit:accessibility`

## Ressources

### Documentation WCAG

- WCAG 2.1 Quick Reference: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM Articles: https://webaim.org/articles/

### Scripts projet

- `npm run audit:accessibility` - Audit a11y
- `npm run audit:mobile` - Audit mobile
- `js/accessibility.js` - Module accessibilité
- `js/keyboard-navigation.js` - Navigation clavier

### Fichiers de référence

- `js/keyboard-navigation.js` - Navigation clavier implémentée
- `js/accessibility.js` - Utilitaires accessibilité
- `js/speech.js` - Support synthèse vocale

## Voir aussi

- `code-quality/SKILL.md` - Standards de code incluant a11y
- `CLAUDE.md` - Architecture et conventions du projet
- W3C ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

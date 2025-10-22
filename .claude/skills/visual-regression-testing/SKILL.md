---
name: 'Visual Regression Testing'
description: 'Tests de régression visuelle pour jeux canvas et UI responsive. Utiliser après modifications canvas, CSS, ou ajout de nouveaux jeux arcade'
---

# Visual Regression Testing

Cette skill automatise la détection de régressions visuelles dans les jeux canvas et l'interface utilisateur responsive, critique pour un projet éducatif avec 4 jeux arcade.

## Quand utiliser cette skill

- Après toute modification de code canvas (Multimiam, Multisnake, Invasion, Memory)
- Lors de changements CSS ou refactoring de styles
- Après ajout d'un nouveau jeu arcade
- Avant chaque release majeure
- Quand des bugs visuels sont reportés
- Après modifications du système de thèmes ou personnalisation
- Lors de mises à jour de dépendances affectant le rendu

## Pourquoi les tests visuels sont critiques

### Limites des tests unitaires traditionnels

```javascript
// ❌ Test unitaire Jest - Ne détecte PAS les bugs visuels
test('Multimiam renders player', () => {
  const game = new Multimiam();
  game.init();
  expect(game.player).toBeDefined();
  expect(game.player.x).toBe(100);
  // ✅ La logique fonctionne...
  // ❌ Mais le joueur pourrait être invisible à l'écran!
  // ❌ Les couleurs pourraient être incorrectes!
  // ❌ Les animations pourraient être cassées!
});
```

### Ce que les tests visuels détectent

✅ **Canvas rendering bugs:**

- Sprites mal positionnés ou manquants
- Couleurs incorrectes ou palettes cassées
- Animations saccadées ou gelées
- Collisions visuelles incorrectes
- Artefacts de rendu (flickering, tearing)

✅ **CSS/Layout regressions:**

- Éléments mal alignés
- Responsive breakpoints cassés
- Overlapping elements
- Font rendering issues
- Z-index problems

✅ **Theme/Customization bugs:**

- Thèmes appliqués incorrectement
- Avatars non affichés
- Couleurs personnalisées non appliquées

## Architecture de test visuel pour leapmultix

### 1. Stratégie de testing

**Test hierarchy:**

```
visual-regression/
├── baselines/              # Images de référence "golden master"
│   ├── desktop/
│   │   ├── multimiam-start.png
│   │   ├── multimiam-gameplay.png
│   │   ├── multisnake-start.png
│   │   └── ...
│   ├── tablet/
│   └── mobile/
├── current/                # Captures actuelles (auto-générées)
│   ├── desktop/
│   ├── tablet/
│   └── mobile/
└── diffs/                  # Images diff (auto-générées si différence)
    └── ...
```

**Viewports à tester:**

- **Desktop**: 1920×1080 (principale résolution)
- **Tablet**: 768×1024 (iPad landscape/portrait)
- **Mobile**: 375×667 (iPhone SE, minimal)

### 2. Configuration Playwright pour Visual Testing

**Installation:**

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

**Configuration `playwright.config.js`:**

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',

  // Timeout pour tests visuels (canvas peut être lent)
  timeout: 30000,

  // Retry sur échec (canvas peut avoir timing issues)
  retries: 2,

  use: {
    // Base URL du serveur local
    baseURL: 'http://localhost:8000',

    // Screenshots pour debug
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',

    // Stabilité pour canvas animations
    actionTimeout: 5000,
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'Mobile',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 375, height: 667 },
      },
    },
  ],

  // Dev server auto-start
  webServer: {
    command: 'python3 -m http.server --directory ./leapmultix 8000',
    port: 8000,
    reuseExistingServer: true,
  },
});
```

### 3. Tests visuels pour jeux arcade

**Fichier `tests/visual/arcade-games.spec.js`:**

```javascript
import { test, expect } from '@playwright/test';

/**
 * Helper: Attendre que canvas soit stable (animations terminées)
 */
async function waitForCanvasStable(page, selector, timeout = 3000) {
  await page.waitForSelector(selector);
  await page.waitForTimeout(timeout); // Attendre animations
}

test.describe('Multimiam Visual Regression', () => {
  test('écran de démarrage', async ({ page }) => {
    await page.goto('/');

    // Naviguer vers Multimiam
    await page.click('[data-testid="arcade-mode"]');
    await page.click('[data-testid="multimiam-game"]');

    // Attendre canvas stable
    await waitForCanvasStable(page, '#multimiamCanvas');

    // Capture visuelle
    await expect(page).toHaveScreenshot('multimiam-start.png', {
      maxDiffPixels: 100, // Tolérance: 100 pixels différents acceptés
      threshold: 0.2, // 20% de différence maximum
    });
  });

  test('gameplay avec question', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="arcade-mode"]');
    await page.click('[data-testid="multimiam-game"]');

    // Démarrer le jeu
    await page.keyboard.press('Space');
    await page.waitForTimeout(2000); // Laisser question apparaître

    // Capture pendant gameplay
    await expect(page).toHaveScreenshot('multimiam-gameplay.png', {
      maxDiffPixels: 200, // Plus de tolérance (animations)
    });
  });

  test('écran de game over', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="arcade-mode"]');
    await page.click('[data-testid="multimiam-game"]');

    // Simuler game over (mouvement vers fantôme)
    await page.keyboard.press('Space');
    // ... logique pour trigger game over ...

    await expect(page).toHaveScreenshot('multimiam-gameover.png');
  });
});

test.describe('Multisnake Visual Regression', () => {
  test('écran de démarrage', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="arcade-mode"]');
    await page.click('[data-testid="multisnake-game"]');

    await waitForCanvasStable(page, '#multisnakeCanvas');

    await expect(page).toHaveScreenshot('multisnake-start.png', {
      maxDiffPixels: 100,
    });
  });

  test('gameplay avec snake en mouvement', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="arcade-mode"]');
    await page.click('[data-testid="multisnake-game"]');

    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    // Mouvement du snake
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('multisnake-gameplay.png', {
      maxDiffPixels: 300, // Snake en mouvement = plus de variance
    });
  });
});

test.describe('Space Invasion Visual Regression', () => {
  test('écran de démarrage', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="arcade-mode"]');
    await page.click('[data-testid="invasion-game"]');

    await waitForCanvasStable(page, '#invasionCanvas');

    await expect(page).toHaveScreenshot('invasion-start.png');
  });

  test('gameplay avec ennemis', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="arcade-mode"]');
    await page.click('[data-testid="invasion-game"]');

    await page.keyboard.press('Space');
    await page.waitForTimeout(1500);

    await expect(page).toHaveScreenshot('invasion-gameplay.png', {
      maxDiffPixels: 200,
    });
  });
});

test.describe('MultiMemory Visual Regression', () => {
  test('grille de cartes', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="arcade-mode"]');
    await page.click('[data-testid="multimemory-game"]');

    await waitForCanvasStable(page, '#multimemoryCanvas');

    await expect(page).toHaveScreenshot('multimemory-grid.png', {
      maxDiffPixels: 50,
    });
  });

  test('cartes retournées', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="arcade-mode"]');
    await page.click('[data-testid="multimemory-game"]');

    // Cliquer sur 2 cartes
    await page.click('#multimemoryCanvas', { position: { x: 100, y: 100 } });
    await page.waitForTimeout(300);
    await page.click('#multimemoryCanvas', { position: { x: 300, y: 100 } });
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('multimemory-flipped.png', {
      maxDiffPixels: 100,
    });
  });
});
```

### 4. Tests visuels pour UI responsive

**Fichier `tests/visual/responsive-ui.spec.js`:**

```javascript
import { test, expect } from '@playwright/test';

test.describe('Dashboard Responsive', () => {
  test('desktop layout', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.click('[data-testid="dashboard"]');

    await expect(page).toHaveScreenshot('dashboard-desktop.png');
  });

  test('tablet layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.click('[data-testid="dashboard"]');

    await expect(page).toHaveScreenshot('dashboard-tablet.png');
  });

  test('mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.click('[data-testid="dashboard"]');

    await expect(page).toHaveScreenshot('dashboard-mobile.png');
  });
});

test.describe('Top Bar Responsive', () => {
  test('navigation desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.locator('#topBar')).toHaveScreenshot('topbar-desktop.png');
  });

  test('navigation mobile (burger menu)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Ouvrir burger menu
    await page.click('[data-testid="burger-menu"]');
    await page.waitForTimeout(300); // Animation

    await expect(page.locator('#topBar')).toHaveScreenshot('topbar-mobile-open.png');
  });
});

test.describe('Customization Theme', () => {
  test('thème par défaut', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="customization"]');

    await expect(page).toHaveScreenshot('customization-default.png');
  });

  test('thème sombre', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="customization"]');

    // Activer thème sombre
    await page.click('[data-testid="theme-dark"]');
    await page.waitForTimeout(200);

    await expect(page).toHaveScreenshot('customization-dark.png');
  });

  test('couleur personnalisée', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="customization"]');

    // Sélectionner couleur
    await page.fill('[data-testid="color-picker"]', '#FF5733');
    await page.waitForTimeout(200);

    await expect(page).toHaveScreenshot('customization-custom-color.png');
  });
});
```

### 5. Chrome DevTools MCP pour Visual Testing

**Alternative légère sans Playwright:**

```javascript
// Utiliser Chrome DevTools MCP directement
// Avantages: Pas d'installation Playwright, utilise MCP déjà configuré

// Script: tests/visual/mcp-visual-test.js
import { chromeMCP } from './mcp-client.js';

async function captureGameScreenshot(gameName, screenshotName) {
  // Naviguer vers le jeu
  await chromeMCP.navigate(`http://localhost:8000`);
  await chromeMCP.click(`[data-testid="arcade-mode"]`);
  await chromeMCP.click(`[data-testid="${gameName}-game"]`);

  // Attendre stabilité
  await chromeMCP.wait(3000);

  // Capture
  await chromeMCP.screenshot({
    filePath: `./visual-regression/current/${screenshotName}.png`,
    fullPage: false,
  });
}

// Exécuter captures
await captureGameScreenshot('multimiam', 'multimiam-start');
await captureGameScreenshot('multisnake', 'multisnake-start');
// ...
```

## Workflows de test visuel

### Workflow complet

```bash
# 1. Démarrer le serveur local
npm run serve

# 2. Exécuter tests visuels Playwright
npx playwright test --project="Desktop Chrome"

# 3. Review des différences (si échec)
npx playwright show-report

# 4. Update baselines (si changements intentionnels)
npx playwright test --update-snapshots

# 5. Commit les nouvelles baselines
git add tests/visual/baselines/
git commit -m "Update visual regression baselines after UI changes"
```

### Commandes npm recommandées

**Ajouter à `package.json`:**

```json
{
  "scripts": {
    "test:visual": "playwright test tests/visual",
    "test:visual:update": "playwright test tests/visual --update-snapshots",
    "test:visual:ui": "playwright test tests/visual --ui",
    "test:visual:debug": "playwright test tests/visual --debug",
    "test:visual:desktop": "playwright test tests/visual --project='Desktop Chrome'",
    "test:visual:mobile": "playwright test tests/visual --project='Mobile'",
    "test:visual:report": "playwright show-report"
  }
}
```

### Intégration CI/CD

**Ajouter à `.gitlab-ci.yml` ou GitHub Actions:**

```yaml
visual-regression-tests:
  stage: test
  image: mcr.microsoft.com/playwright:latest
  script:
    - npm ci
    - npm run serve &
    - npx playwright test tests/visual
  artifacts:
    when: on_failure
    paths:
      - playwright-report/
      - visual-regression/diffs/
    expire_in: 30 days
  only:
    - merge_requests
    - main
```

## Configuration des seuils de tolérance

### Comprendre maxDiffPixels et threshold

```javascript
await expect(page).toHaveScreenshot('screenshot.png', {
  // Option 1: Nombre absolu de pixels différents acceptés
  maxDiffPixels: 100, // Max 100 pixels peuvent différer

  // Option 2: Pourcentage de pixels différents acceptés
  threshold: 0.2, // 20% de pixels peuvent différer

  // Combiner les deux (OU logique)
  maxDiffPixels: 100,
  threshold: 0.2, // Accepte si < 100px OU < 20%
});
```

### Recommandations par type de contenu

**UI statique (Dashboard, Customization):**

```javascript
maxDiffPixels: 50,  // Très strict
threshold: 0.1      // 10% max
```

**Canvas avec animations (Jeux arcade):**

```javascript
maxDiffPixels: 200, // Plus tolérant
threshold: 0.2      // 20% max (animations variant)
```

**Responsive layouts:**

```javascript
maxDiffPixels: 100,
threshold: 0.15     // Tolérance moyenne
```

## Gestion des faux positifs

### Problèmes courants et solutions

**1. Animations canvas variables:**

```javascript
// ❌ PROBLÈME: Animations causent échecs aléatoires
test('multimiam gameplay', async ({ page }) => {
  await page.goto('/multimiam');
  await expect(page).toHaveScreenshot(); // Échoue aléatoirement
});

// ✅ SOLUTION: Pause animations avant capture
test('multimiam gameplay', async ({ page }) => {
  await page.goto('/multimiam');

  // Mettre en pause animations via code injection
  await page.evaluate(() => {
    window.cancelAnimationFrame = () => {}; // Freeze animations
  });

  await page.waitForTimeout(500);
  await expect(page).toHaveScreenshot();
});
```

**2. Timestamps et contenu dynamique:**

```javascript
// ❌ PROBLÈME: Timestamp change à chaque test
// ✅ SOLUTION: Masquer zones dynamiques
await expect(page).toHaveScreenshot({
  mask: [page.locator('[data-testid="timestamp"]')],
  maxDiffPixels: 50,
});
```

**3. Fonts rendering variance:**

```javascript
// Activer font smoothing cohérent
await page.evaluate(() => {
  document.body.style.webkitFontSmoothing = 'antialiased';
  document.body.style.mozOsxFontSmoothing = 'grayscale';
});
```

## Debugging des échecs visuels

### Analyser un échec

```bash
# 1. Voir le rapport HTML avec diffs visuels
npx playwright show-report

# 2. Mode UI interactif (meilleur pour debug)
npx playwright test --ui

# 3. Mode debug pas-à-pas
npx playwright test tests/visual/arcade-games.spec.js --debug
```

### Diff images générées

Après un échec, Playwright génère automatiquement:

- `baseline.png` - Image de référence originale
- `actual.png` - Capture actuelle qui a échoué
- `diff.png` - Visualisation des différences (pixels rouges)

**Localisation:**

```
playwright-report/
└── data/
    └── {test-id}/
        ├── {screenshot}-expected.png
        ├── {screenshot}-actual.png
        └── {screenshot}-diff.png
```

## Checklist de test visuel

Avant chaque commit touchant le visuel:

- [ ] Tests visuels passent sur Desktop (1920×1080)
- [ ] Tests visuels passent sur Tablet (768×1024)
- [ ] Tests visuels passent sur Mobile (375×667)
- [ ] Si changements intentionnels: baselines mises à jour avec `--update-snapshots`
- [ ] Nouvelles baselines commitées avec message descriptif
- [ ] Pas de faux positifs dus à animations ou timestamps
- [ ] Seuils de tolérance appropriés pour le type de contenu
- [ ] Diffs reviewed manuellement (pas d'approval automatique)

## Integration avec autres Skills

- **@arcade-game-creator** - Ajouter tests visuels lors de création nouveau jeu
- **@performance-profiler** - Vérifier FPS n'impacte pas rendu visuel
- **@accessibility** - Tests visuels avec high contrast modes
- **@pwa-service-worker** - Tester rendu offline vs online

## Expert Agents recommandés

- **@chrome-devtools-tester** - Utilise ce Skill pour captures visuelles
- **@arcade-specialist** - Expertise canvas pour debug régressions visuelles
- **@debugger** - Investigation de bugs visuels complexes

## Voir aussi

- `tests/visual/` - Répertoire des tests visuels (à créer)
- `playwright.config.js` - Configuration Playwright
- `.claude/skills/mobile-responsive-testing/` - Testing responsive complémentaire
- Chrome DevTools MCP - Alternative pour captures sans Playwright

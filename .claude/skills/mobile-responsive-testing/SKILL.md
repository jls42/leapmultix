---
name: 'Mobile Responsive Testing'
description: 'Tests de responsive design et compatibilité mobile (touch, viewports, performance mobile). Utiliser après modifications CSS responsive, touch controls, ou avant release'
---

# Mobile Responsive Testing

Cette skill garantit que la PWA éducative leapmultix fonctionne parfaitement sur les appareils des étudiants (tablettes et téléphones), un critère critique pour l'accessibilité éducative.

## Quand utiliser cette skill

- Après toute modification CSS responsive ou media queries
- Lors de changements dans `touch-support.js` (7 KB)
- Après ajout de nouveaux composants UI
- Avant chaque release (PWA doit être mobile-ready)
- Quand des bugs mobile sont reportés
- Après modifications des jeux arcade (touch controls)
- Lors de refactoring du layout ou navigation

## Pourquoi le mobile est critique pour leapmultix

### Contexte éducatif

✅ **Étudiants utilisent:** Tablettes (iPad, Android), smartphones
✅ **Environnement:** Écoles avec BYOD (Bring Your Own Device)
✅ **Contraintes:** Performance limitée, écrans tactiles uniquement
✅ **Accessibilité:** Doit fonctioner sans clavier/souris

### Statistiques d'usage mobile (PWA éducatives)

- 60% des étudiants accèdent depuis tablettes
- 30% depuis smartphones
- 10% depuis ordinateurs de bureau
- Touch-only: 90% des utilisations mobiles

## Viewports de test standards

### Résolutions prioritaires

**1. Mobile Portrait (375×667)** 🔴 PRIORITÉ HAUTE

- iPhone SE (2020), iPhone 8
- Résolution minimale à supporter
- Layout 1 colonne obligatoire
- Touch targets ≥ 44×44px

**2. Mobile Landscape (667×375)** 🟡 PRIORITÉ MOYENNE

- iPhone en mode paysage
- Jeux arcade utilisent souvent landscape
- Adaptation layout nécessaire

**3. Tablet Portrait (768×1024)** 🔴 PRIORITÉ HAUTE

- iPad, iPad Mini
- Layout 2 colonnes possible
- Principal device éducatif

**4. Tablet Landscape (1024×768)** 🟡 PRIORITÉ MOYENNE

- iPad en mode paysage
- Layout proche desktop

**5. Desktop (1920×1080)** 🟢 BASELINE

- Référence pour comparaison
- Layout complet 3 colonnes

### Media Queries à implémenter

```css
/* Mobile Portrait */
@media (max-width: 767px) {
  /* Layout 1 colonne, touch targets 44px, font-size augmenté */
}

/* Tablet Portrait */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Layout 2 colonnes, mixte touch/souris */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Layout complet, souris/clavier */
}

/* Landscape spécifique */
@media (orientation: landscape) and (max-height: 500px) {
  /* Header réduit, jeux full-screen */
}
```

## Testing avec Chrome DevTools

### 1. Device Emulation

**Ouvrir DevTools:**

```
Ctrl+Shift+M (Windows/Linux)
Cmd+Shift+M (Mac)
```

**Devices à tester:**

```javascript
// Devices recommandés pour leapmultix
const testDevices = [
  // Mobile
  { name: 'iPhone SE', width: 375, height: 667, dpr: 2 },
  { name: 'iPhone 12 Pro', width: 390, height: 844, dpr: 3 },
  { name: 'Samsung Galaxy S20', width: 360, height: 800, dpr: 3 },

  // Tablet
  { name: 'iPad Mini', width: 768, height: 1024, dpr: 2 },
  { name: 'iPad Pro 11"', width: 834, height: 1194, dpr: 2 },
  { name: 'iPad Pro 12.9"', width: 1024, height: 1366, dpr: 2 },

  // Desktop
  { name: 'Desktop FHD', width: 1920, height: 1080, dpr: 1 },
];
```

**Script de test automatisé avec MCP Chrome DevTools:**

```javascript
// tests/mobile/responsive-test.js
import { chromeMCP } from './mcp-client.js';

async function testResponsive(url, deviceName, width, height) {
  await chromeMCP.navigate(url);

  // Resize viewport
  await chromeMCP.resize(width, height);

  // Attendre reflow
  await chromeMCP.wait(500);

  // Capture screenshot
  await chromeMCP.screenshot({
    filePath: `./screenshots/${deviceName.replace(/\s/g, '-')}.png`,
  });

  // Vérifier console errors
  const errors = await chromeMCP.getConsoleErrors();
  if (errors.length > 0) {
    console.error(`❌ ${deviceName}: Console errors detected`, errors);
  }

  // Vérifier layout overflow
  const hasOverflow = await chromeMCP.evaluate(() => {
    return document.body.scrollWidth > window.innerWidth;
  });

  if (hasOverflow) {
    console.warn(`⚠️  ${deviceName}: Horizontal overflow detected`);
  }
}

// Exécuter tests
for (const device of testDevices) {
  await testResponsive('http://localhost:8000', device.name, device.width, device.height);
}
```

### 2. Touch Event Testing

**Simuler touch events:**

```javascript
// Tests touch avec Chrome DevTools MCP
async function testTouchControls() {
  await chromeMCP.navigate('http://localhost:8000');

  // Activer touch emulation
  await chromeMCP.emulateTouch(true);

  // Naviguer vers jeu
  await chromeMCP.click('[data-testid="arcade-mode"]');
  await chromeMCP.click('[data-testid="multimiam-game"]');

  // Tester swipe gestures
  await chromeMCP.swipe({ from: { x: 100, y: 200 }, to: { x: 300, y: 200 } });

  // Tester tap
  await chromeMCP.tap({ x: 200, y: 300 });

  // Vérifier réactivité
  const responsiveness = await chromeMCP.measure(() => {
    // Mesurer temps de réponse touch
  });

  console.log(`Touch responsiveness: ${responsiveness}ms`);
}
```

### 3. Network Throttling (Mobile 3G/4G)

**Simuler connexions lentes:**

```javascript
// Test avec throttling réseau
async function testMobileNetwork() {
  await chromeMCP.navigate('http://localhost:8000');

  // Activer throttling 3G
  await chromeMCP.setNetworkThrottling('Slow 3G');

  // Mesurer temps de chargement
  const startTime = Date.now();
  await chromeMCP.waitForLoad();
  const loadTime = Date.now() - startTime;

  console.log(`Load time on Slow 3G: ${loadTime}ms`);

  if (loadTime > 5000) {
    console.error('❌ Load time > 5s on Slow 3G (trop lent)');
  }

  // Désactiver throttling
  await chromeMCP.setNetworkThrottling('No throttling');
}
```

**Profils réseau recommandés:**

- **Slow 3G**: Download 400 Kbps, Upload 400 Kbps, Latency 2000ms
- **Fast 3G**: Download 1.6 Mbps, Upload 750 Kbps, Latency 562ms
- **4G**: Download 9 Mbps, Upload 9 Mbps, Latency 85ms

## Touch Targets et Accessibilité Mobile

### WCAG 2.1 Guidelines pour Touch

**Minimum touch target size: 44×44px** (WCAG 2.1 Level AAA)

```css
/* ✅ CONFORME - Touch targets suffisamment grands */
.button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
  touch-action: manipulation; /* Désactive double-tap zoom */
}

.icon-button {
  width: 48px; /* Même mieux que 44px */
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ❌ NON CONFORME - Touch targets trop petits */
.small-button {
  width: 24px;
  height: 24px;
  /* Difficile à tapper sur mobile */
}
```

**Espacement entre touch targets: 8px minimum**

```css
/* ✅ CONFORME - Espacement suffisant */
.button-group button {
  margin: 8px;
}

/* ❌ NON CONFORME - Boutons collés */
.button-group button {
  margin: 2px; /* Risque de taps accidentels */
}
```

### Audit automatisé des touch targets

```javascript
// Script: tests/mobile/touch-target-audit.js
async function auditTouchTargets() {
  await chromeMCP.navigate('http://localhost:8000');
  await chromeMCP.resize(375, 667); // iPhone SE

  const violations = await chromeMCP.evaluate(() => {
    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
    const violations = [];

    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width < 44 || height < 44) {
        violations.push({
          element: el.tagName,
          id: el.id || 'N/A',
          class: el.className,
          width: Math.round(width),
          height: Math.round(height),
          location: `${Math.round(rect.x)}, ${Math.round(rect.y)}`,
        });
      }
    });

    return violations;
  });

  if (violations.length > 0) {
    console.error('❌ Touch target violations detected:');
    console.table(violations);
  } else {
    console.log('✅ All touch targets conform to WCAG 2.1 (≥44px)');
  }

  return violations;
}
```

## Performance Mobile

### 1. FPS Monitoring sur Mobile

**Objectif: 60 FPS constant sur mobile (jeux arcade)**

```javascript
// Mesurer FPS pendant gameplay mobile
async function measureMobileFPS() {
  await chromeMCP.navigate('http://localhost:8000');
  await chromeMCP.resize(375, 667);

  // Activer CPU throttling (simuler device mobile)
  await chromeMCP.setCPUThrottling(4); // 4x slowdown

  // Naviguer vers jeu
  await chromeMCP.click('[data-testid="multimiam-game"]');
  await chromeMCP.wait(1000);

  // Mesurer FPS pendant 10 secondes
  const fps = await chromeMCP.evaluate(() => {
    let frameCount = 0;
    const startTime = performance.now();

    function countFrame() {
      frameCount++;
      if (performance.now() - startTime < 10000) {
        requestAnimationFrame(countFrame);
      }
    }

    return new Promise(resolve => {
      countFrame();
      setTimeout(() => {
        const avgFPS = frameCount / 10;
        resolve(avgFPS);
      }, 10000);
    });
  });

  console.log(`Average FPS on mobile (4x CPU throttling): ${fps}`);

  if (fps < 30) {
    console.error('❌ FPS < 30 sur mobile (injouable)');
  } else if (fps < 60) {
    console.warn('⚠️  FPS < 60 sur mobile (expérience dégradée)');
  } else {
    console.log('✅ FPS ≥ 60 sur mobile (optimal)');
  }

  // Désactiver throttling
  await chromeMCP.setCPUThrottling(1);
}
```

### 2. Memory Usage Mobile

**Limite mobile: 256 MB pour PWA**

```javascript
// Monitorer utilisation mémoire
async function checkMobileMemory() {
  await chromeMCP.navigate('http://localhost:8000');

  // Jouer pendant 5 minutes (simuler session)
  await simulateGameplay(5 * 60 * 1000);

  const memoryUsage = await chromeMCP.evaluate(() => {
    if (performance.memory) {
      return {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
      };
    }
    return null;
  });

  console.log('Memory usage after 5min gameplay:', memoryUsage);

  if (memoryUsage.usedJSHeapSize > 256) {
    console.error('❌ Memory > 256 MB (risque crash sur mobile)');
  }
}
```

### 3. Battery Impact

**Techniques d'optimisation batterie:**

```javascript
// Réduire activité quand app en background
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations, reduce polling
    cancelAnimationFrame(gameLoop);
    clearInterval(pollInterval);
  } else {
    // Resume
    requestAnimationFrame(gameLoop);
  }
});

// Utiliser passive event listeners (meilleur pour scroll performance)
element.addEventListener('touchstart', handler, { passive: true });
element.addEventListener('touchmove', handler, { passive: true });
```

## Layout Testing Mobile

### 1. Viewport Meta Tag

**Configuration obligatoire pour mobile:**

```html
<!-- ✅ CONFORME - Configuration recommandée PWA mobile -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
/>

<!-- ❌ NON CONFORME - Désactive zoom (accessibilité) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
```

**Vérification automatique:**

```javascript
async function checkViewportMeta() {
  const viewport = await chromeMCP.evaluate(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    return meta ? meta.content : null;
  });

  const hasUserScalableNo = viewport?.includes('user-scalable=no');
  const hasMaxScale1 = viewport?.includes('maximum-scale=1');

  if (hasUserScalableNo || hasMaxScale1) {
    console.error('❌ Viewport bloque le zoom (violation WCAG)');
  }
}
```

### 2. Horizontal Scroll Detection

**Détecter overflow horizontal non intentionnel:**

```javascript
async function detectHorizontalOverflow() {
  await chromeMCP.navigate('http://localhost:8000');
  await chromeMCP.resize(375, 667);

  const overflowElements = await chromeMCP.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const overflowing = [];

    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth || rect.left < 0) {
        overflowing.push({
          tag: el.tagName,
          id: el.id || 'N/A',
          class: el.className,
          width: Math.round(rect.width),
          overflowRight: Math.round(rect.right - window.innerWidth),
          overflowLeft: Math.round(Math.abs(Math.min(0, rect.left))),
        });
      }
    });

    return overflowing;
  });

  if (overflowElements.length > 0) {
    console.error('❌ Horizontal overflow detected:');
    console.table(overflowElements);
  }
}
```

### 3. Font Size Readability

**Minimum font size mobile: 16px** (évite auto-zoom iOS)

```css
/* ✅ CONFORME - Font sizes appropriées mobile */
body {
  font-size: 16px; /* Base 16px minimum */
}

h1 {
  font-size: 28px; /* Titles proportionnels */
}

button {
  font-size: 16px; /* Évite zoom iOS sur focus */
}

/* ❌ NON CONFORME - Font trop petite mobile */
.small-text {
  font-size: 12px; /* Illisible sur mobile */
}
```

**Audit automatisé des font sizes:**

```javascript
async function auditFontSizes() {
  await chromeMCP.resize(375, 667);

  const smallFonts = await chromeMCP.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const violations = [];

    allElements.forEach(el => {
      const fontSize = parseInt(window.getComputedStyle(el).fontSize);
      const isVisible = el.offsetWidth > 0 && el.offsetHeight > 0;

      if (isVisible && fontSize < 16) {
        violations.push({
          tag: el.tagName,
          id: el.id || 'N/A',
          fontSize: fontSize,
          textContent: el.textContent.substring(0, 50),
        });
      }
    });

    return violations;
  });

  if (smallFonts.length > 0) {
    console.warn('⚠️  Font sizes < 16px detected (peut causer auto-zoom iOS):');
    console.table(smallFonts);
  }
}
```

## Real Device Testing

### 1. BrowserStack / LambdaTest (Cloud)

**Configuration BrowserStack:**

```javascript
// playwright.config.js avec BrowserStack
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    browserName: 'webkit', // Safari mobile
    browserWSEndpoint: 'wss://cdp.browserstack.com/playwright',
    connectOptions: {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.BROWSERSTACK_USERNAME + ':' + process.env.BROWSERSTACK_ACCESS_KEY).toString('base64')}`,
      },
    },
  },
});
```

**Devices à tester sur BrowserStack:**

- iPhone 13 Pro (iOS 15)
- iPhone SE (iOS 14)
- iPad Pro 11" (iPadOS 15)
- Samsung Galaxy S21 (Android 11)
- Samsung Galaxy Tab S7 (Android 11)

### 2. Local Device Testing

**Accès depuis device local sur même réseau:**

```bash
# 1. Trouver IP locale
hostname -I  # Linux
ipconfig getifaddr en0  # Mac

# 2. Démarrer serveur sur toutes les interfaces
python3 -m http.server --directory ./leapmultix 8000 --bind 0.0.0.0

# 3. Accéder depuis mobile
# http://192.168.1.X:8000
```

**Remote debugging depuis mobile:**

```bash
# Android Chrome Remote Debugging
# 1. Activer Developer Options sur Android
# 2. Brancher USB + autoriser debugging
# 3. Chrome DevTools > More Tools > Remote Devices
# 4. Inspect device

# iOS Safari Remote Debugging
# 1. Réglages > Safari > Avancé > Inspecteur Web
# 2. Brancher USB
# 3. Safari Desktop > Develop > [Device Name]
```

## Checklist de test mobile

### Avant chaque commit responsive

- [ ] Test sur iPhone SE portrait (375×667) - layout 1 colonne
- [ ] Test sur iPad portrait (768×1024) - layout 2 colonnes
- [ ] Test sur mobile landscape - jeux arcade full-screen
- [ ] Touch targets ≥ 44×44px (audit automatisé passé)
- [ ] Font size ≥ 16px (évite auto-zoom iOS)
- [ ] Pas d'horizontal overflow (script détection passé)
- [ ] Viewport meta conforme (user-scalable=yes)
- [ ] Touch events fonctionnels (swipe, tap, pinch-zoom)

### Avant chaque release

- [ ] FPS ≥ 30 sur mobile avec CPU throttling 4x
- [ ] Memory usage < 256 MB après 5min gameplay
- [ ] Load time < 5s sur Slow 3G
- [ ] Tests visuels passent sur 3 viewports (mobile/tablet/desktop)
- [ ] Real device testing sur au moins 1 iOS + 1 Android
- [ ] Lighthouse mobile score ≥ 90
- [ ] PWA installable et fonctionne offline sur mobile

## Workflows npm recommandés

**Ajouter à `package.json`:**

```json
{
  "scripts": {
    "test:mobile": "playwright test tests/mobile --project='Mobile'",
    "test:mobile:touch": "node tests/mobile/touch-target-audit.js",
    "test:mobile:fps": "node tests/mobile/measure-fps.js",
    "test:mobile:network": "node tests/mobile/test-throttling.js",
    "test:responsive": "playwright test tests/mobile --project='Mobile' --project='Tablet'",
    "lighthouse:mobile": "lighthouse http://localhost:8000 --preset=mobile --view"
  }
}
```

## Integration avec autres Skills

- **@visual-regression-testing** - Screenshots multi-viewports
- **@performance-profiler** - FPS et memory profiling mobile
- **@accessibility** - Touch targets et mobile a11y
- **@pwa-service-worker** - Offline functionality sur mobile

## Expert Agents recommandés

- **@chrome-devtools-tester** - Utilise ce Skill pour tests responsive
- **@accessibility-auditor** - Audit touch targets et mobile a11y
- **@performance-analyzer** - Profiling performance mobile
- **@pwa-expert** - Tests PWA mobile et installation

## Voir aussi

- `js/touch-support.js` (7 KB) - Gestion touch events
- `tests/mobile/` - Répertoire tests mobile (à créer)
- Chrome DevTools MCP - Device emulation et throttling
- Lighthouse CLI - Audits mobile automatisés

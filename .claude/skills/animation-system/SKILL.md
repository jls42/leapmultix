---
name: "Animation System Helper"
description: "Crée et gère animations CSS et JavaScript (keyframes, transitions, sprite animations, canvas animations). Utiliser lors d'ajout d'animations visuelles ou feedback utilisateur"
---

# Animation System Helper

Cette skill guide la création d'animations fluides pour améliorer l'expérience utilisateur.

## Quand utiliser cette skill
- Ajout de feedback visuel (boutons, transitions)
- Animations de sprites (jeux arcade)
- Transitions entre slides
- Effets visuels (particules, explosions)
- Micro-interactions UI
- Animations canvas pour jeux

## Types d'animations

### 1. CSS Animations (keyframes)

**Définir animation :**

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

**Animations courantes :**

```css
/* Pulse (battement) */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Shake (secousse) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

/* Bounce (rebond) */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Rotate (rotation) */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Flash (clignotement) */
@keyframes flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

**Appliquer :**

```css
.correct-answer {
  animation: pulse 0.5s ease-in-out;
}

.wrong-answer {
  animation: shake 0.5s ease-in-out;
}

.loading {
  animation: rotate 1s linear infinite;
}
```

### 2. CSS Transitions

**Transitions simples :**

```css
button {
  background: #1976D2;
  transform: scale(1);
  transition: all 0.2s ease;
}

button:hover {
  background: #1565C0;
  transform: scale(1.05);
}

button:active {
  transform: scale(0.95);
}
```

**Transitions complexes :**

```css
.card {
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease,
    background 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
```

**Courbes de timing :**

```css
/* ease : démarrage lent, puis rapide, puis lent */
transition: all 0.3s ease;

/* ease-in : démarrage lent */
transition: all 0.3s ease-in;

/* ease-out : fin lente */
transition: all 0.3s ease-out;

/* ease-in-out : démarrage et fin lents */
transition: all 0.3s ease-in-out;

/* linear : vitesse constante */
transition: all 0.3s linear;

/* cubic-bezier : courbe personnalisée */
transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 3. JavaScript Animations (requestAnimationFrame)

**Animation simple :**

```javascript
function animate(element, property, from, to, duration) {
  const startTime = performance.now();

  function frame(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const eased = 1 - Math.pow(1 - progress, 3);

    // Interpolation
    const current = from + (to - from) * eased;

    // Appliquer
    element.style[property] = current + 'px';

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

// Utilisation
animate(element, 'left', 0, 300, 500); // De 0 à 300px en 500ms
```

**Animation avec callback :**

```javascript
function animateWithCallback(element, props, duration, onComplete) {
  const startTime = performance.now();
  const startValues = {};

  // Capturer valeurs initiales
  Object.keys(props).forEach(prop => {
    startValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
  });

  function frame(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    // Appliquer toutes les props
    Object.keys(props).forEach(prop => {
      const from = startValues[prop];
      const to = props[prop];
      const current = from + (to - from) * eased;

      element.style[prop] = current + (prop === 'opacity' ? '' : 'px');
    });

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else if (onComplete) {
      onComplete();
    }
  }

  requestAnimationFrame(frame);
}

// Easing functions
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Utilisation
animateWithCallback(element, {
  opacity: 1,
  left: 300,
  top: 200
}, 500, () => {
  console.log('Animation terminée');
});
```

### 4. Sprite Animations (canvas)

**Sprite sheet animation :**

```javascript
class SpriteAnimation {
  constructor(image, frameWidth, frameHeight, frameCount, fps = 10) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.fps = fps;
    this.currentFrame = 0;
    this.lastFrameTime = 0;
  }

  update(deltaTime) {
    this.lastFrameTime += deltaTime;

    const frameInterval = 1000 / this.fps;

    if (this.lastFrameTime >= frameInterval) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      this.lastFrameTime = 0;
    }
  }

  draw(ctx, x, y) {
    const sourceX = this.currentFrame * this.frameWidth;

    ctx.drawImage(
      this.image,
      sourceX, 0, // Source position
      this.frameWidth, this.frameHeight, // Source size
      x, y, // Destination position
      this.frameWidth, this.frameHeight // Destination size
    );
  }

  reset() {
    this.currentFrame = 0;
    this.lastFrameTime = 0;
  }
}

// Utilisation
const monsterWalk = new SpriteAnimation(
  monsterImage,
  64, 64, // Frame width/height
  8, // 8 frames
  12 // 12 FPS
);

function gameLoop(deltaTime) {
  monsterWalk.update(deltaTime);
  monsterWalk.draw(ctx, monsterX, monsterY);
  requestAnimationFrame(gameLoop);
}
```

**Animation avec directions :**

```javascript
class DirectionalSpriteAnimation {
  constructor(spritesheet, config) {
    this.spritesheet = spritesheet;
    this.animations = config; // { walk_left: {...}, walk_right: {...} }
    this.currentAnimation = null;
    this.currentFrame = 0;
    this.frameTime = 0;
  }

  play(animationName) {
    if (this.currentAnimation !== animationName) {
      this.currentAnimation = animationName;
      this.currentFrame = 0;
      this.frameTime = 0;
    }
  }

  update(deltaTime) {
    if (!this.currentAnimation) return;

    const anim = this.animations[this.currentAnimation];
    this.frameTime += deltaTime;

    const frameInterval = 1000 / anim.fps;

    if (this.frameTime >= frameInterval) {
      this.currentFrame = (this.currentFrame + 1) % anim.frameCount;
      this.frameTime = 0;
    }
  }

  draw(ctx, x, y) {
    if (!this.currentAnimation) return;

    const anim = this.animations[this.currentAnimation];
    const sourceX = anim.startFrame + this.currentFrame * anim.frameWidth;
    const sourceY = anim.row * anim.frameHeight;

    ctx.drawImage(
      this.spritesheet,
      sourceX, sourceY,
      anim.frameWidth, anim.frameHeight,
      x, y,
      anim.frameWidth, anim.frameHeight
    );
  }
}

// Configuration
const playerAnimations = new DirectionalSpriteAnimation(playerSpritesheet, {
  idle: { row: 0, startFrame: 0, frameCount: 4, frameWidth: 64, frameHeight: 64, fps: 8 },
  walk_right: { row: 1, startFrame: 0, frameCount: 6, frameWidth: 64, frameHeight: 64, fps: 10 },
  walk_left: { row: 2, startFrame: 0, frameCount: 6, frameWidth: 64, frameHeight: 64, fps: 10 },
  jump: { row: 3, startFrame: 0, frameCount: 3, frameWidth: 64, frameHeight: 64, fps: 15 }
});

// Utilisation
playerAnimations.play('walk_right');
```

### 5. Particle Systems

**Système de particules simple :**

```javascript
class Particle {
  constructor(x, y, velocityX, velocityY, life, color) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.size = 5;
  }

  update(deltaTime) {
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
    this.velocityY += 0.1; // Gravité
    this.life -= deltaTime;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  isDead() {
    return this.life <= 0;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count, color = '255,200,0') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed;
      const life = 500 + Math.random() * 500;

      this.particles.push(
        new Particle(x, y, velocityX, velocityY, life, color)
      );
    }
  }

  update(deltaTime) {
    this.particles.forEach(particle => particle.update(deltaTime));
    this.particles = this.particles.filter(p => !p.isDead());
  }

  draw(ctx) {
    this.particles.forEach(particle => particle.draw(ctx));
  }
}

// Utilisation
const particleSystem = new ParticleSystem();

// Émettre particules lors de collision
function onCollision(x, y) {
  particleSystem.emit(x, y, 20); // 20 particules
}
```

## Patterns leapmultix

### Animation de feedback (réponse correcte)

```javascript
// Classe ou fonction utilitaire
export function showCorrectFeedback(element) {
  element.classList.add('correct-feedback');

  // Retirer classe après animation
  setTimeout(() => {
    element.classList.remove('correct-feedback');
  }, 500);
}

// CSS
```css
.correct-feedback {
  animation: correctPulse 0.5s ease-out;
}

@keyframes correctPulse {
  0% {
    transform: scale(1);
    background: transparent;
  }
  50% {
    transform: scale(1.1);
    background: rgba(76, 175, 80, 0.3);
  }
  100% {
    transform: scale(1);
    background: transparent;
  }
}
```

### Animation de transition entre slides

```javascript
// core/navigation.js
export function goToSlide(slideNumber, direction = 'forward') {
  const currentSlide = document.querySelector('.slide:not([style*="display: none"])');
  const nextSlide = document.getElementById(`slide${slideNumber}`);

  if (!nextSlide) return;

  // Préparer animation
  nextSlide.style.display = 'block';

  if (direction === 'forward') {
    nextSlide.style.transform = 'translateX(100%)';
  } else {
    nextSlide.style.transform = 'translateX(-100%)';
  }

  // Animation
  requestAnimationFrame(() => {
    currentSlide.style.transition = 'transform 0.3s ease-out';
    nextSlide.style.transition = 'transform 0.3s ease-out';

    if (direction === 'forward') {
      currentSlide.style.transform = 'translateX(-100%)';
      nextSlide.style.transform = 'translateX(0)';
    } else {
      currentSlide.style.transform = 'translateX(100%)';
      nextSlide.style.transform = 'translateX(0)';
    }

    // Cleanup après transition
    setTimeout(() => {
      currentSlide.style.display = 'none';
      currentSlide.style.transform = '';
      currentSlide.style.transition = '';
      nextSlide.style.transition = '';
    }, 300);
  });
}
```

### Animation de coins/points

```javascript
// coin-effects.js
export function animateCoinGain(amount, fromElement) {
  const coin = document.createElement('div');
  coin.className = 'coin-animation';
  coin.textContent = `+${amount}`;

  const rect = fromElement.getBoundingClientRect();
  coin.style.left = rect.left + 'px';
  coin.style.top = rect.top + 'px';

  document.body.appendChild(coin);

  // Animer vers compteur de coins
  const target = document.getElementById('coinDisplay');
  const targetRect = target.getBoundingClientRect();

  animateElement(coin, {
    left: targetRect.left,
    top: targetRect.top,
    opacity: 0
  }, 800, () => {
    coin.remove();
    updateCoinDisplay(amount);
  });
}
```

### Accessibility et prefers-reduced-motion

```css
/* Respecter préférence utilisateur */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```javascript
// Détecter préférence en JS
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (!prefersReducedMotion) {
  // Activer animations complexes
  enableParticleEffects();
} else {
  // Feedback simple
  enableSimpleFeedback();
}
```

## Performance des animations

### Optimisations

**1. Utiliser transform et opacity (GPU) :**

```css
/* ✅ Bon : GPU accelerated */
.animated {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ❌ Mauvais : CPU layout/paint */
.animated {
  left: 100px;
  background: rgba(0,0,0,0.5);
}
```

**2. will-change hint :**

```css
.will-animate {
  will-change: transform, opacity;
}

/* Retirer après animation */
.animated-done {
  will-change: auto;
}
```

**3. Batch requestAnimationFrame :**

```javascript
const animationQueue = [];
let rafScheduled = false;

export function scheduleAnimation(callback) {
  animationQueue.push(callback);

  if (!rafScheduled) {
    rafScheduled = true;
    requestAnimationFrame(() => {
      animationQueue.forEach(cb => cb());
      animationQueue.length = 0;
      rafScheduled = false;
    });
  }
}
```

## Easing functions

```javascript
export const Easing = {
  linear: t => t,

  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  easeInElastic: t => {
    if (t === 0 || t === 1) return t;
    const p = 0.3;
    return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 2 * Math.PI / p);
  },

  easeOutElastic: t => {
    if (t === 0 || t === 1) return t;
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 2 * Math.PI / p) + 1;
  },

  easeOutBounce: t => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }
};

// Utilisation
animate(element, 'left', 0, 300, 500, Easing.easeOutCubic);
```

## Checklist animations

- [ ] CSS utilisé pour animations simples
- [ ] requestAnimationFrame pour animations complexes
- [ ] transform et opacity privilégiés (GPU)
- [ ] prefers-reduced-motion respecté
- [ ] Sprite animations optimisées (FPS adaptatif)
- [ ] Particules limitées (< 100 simultanées)
- [ ] Easing functions appropriées
- [ ] Cleanup après animations
- [ ] Performance 60 FPS maintenue

## Voir aussi

- `arcade-game-creator/SKILL.md` - Jeux arcade avec animations
- `sprite-management/SKILL.md` - Gestion sprites animés
- `performance-profiler/SKILL.md` - Optimisation FPS
- `accessibility/SKILL.md` - prefers-reduced-motion
- `coin-effects.js` - Animations coins (projet)

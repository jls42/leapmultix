---
name: "Sprite Management"
description: "Gère sprites, sprite sheets, animations de sprites pour jeux arcade (chargement, rendu, collisions). Utiliser lors de création de jeux ou ajout de personnages animés"
---

# Sprite Management

Cette skill guide la gestion des sprites et sprite sheets pour les jeux arcade de leapmultix.

## Quand utiliser cette skill
- Ajout de nouveaux personnages/ennemis
- Création de sprite sheets
- Animations de sprites (marche, saut, etc.)
- Détection de collisions
- Optimisation rendu sprites
- Sprites directionnels (gauche/droite/haut/bas)

## Sprites dans leapmultix

**Sprites existants :**
- Monsters (jeux arcade)
- Player characters
- Power-ups
- Obstacles

**Formats utilisés :**
- PNG avec transparence
- Sprite sheets (multiples frames)
- Résolutions multiples (@1x, @2x, @3x)

## Créer un sprite simple

### 1. Préparer image

**Spécifications :**
- Format : PNG (transparence)
- Taille : 64×64px (base) ou multiples de 16
- Résolutions : 1x, 2x, 3x pour Retina

```
assets/sprites/
├── monster-1x.png    # 64×64
├── monster-2x.png    # 128×128
└── monster-3x.png    # 192×192
```

### 2. Classe Sprite de base

```javascript
/**
 * Sprite simple
 */
export class Sprite {
  constructor(imageSrc, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageSrc;
    this.loaded = false;

    this.image.onload = () => {
      this.loaded = true;
    };
  }

  draw(ctx) {
    if (!this.loaded) return;

    ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  // Bounding box pour collisions
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  // Vérifier collision avec autre sprite
  collidesWith(other) {
    const a = this.getBounds();
    const b = other.getBounds();

    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}

// Utilisation
const monster = new Sprite('assets/sprites/monster.png', 100, 100, 64, 64);

function render(ctx) {
  monster.draw(ctx);
}
```

## Sprite Sheets

### 1. Créer sprite sheet

**Layout horizontal :**

```
sprite-sheet.png (512×64)
┌────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┐
│Frame 0 │Frame 1 │Frame 2 │Frame 3 │Frame 4 │Frame 5 │Frame 6 │Frame 7 │
│ 64×64  │ 64×64  │ 64×64  │ 64×64  │ 64×64  │ 64×64  │ 64×64  │ 64×64  │
└────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┘
```

**Layout grille :**

```
sprite-sheet.png (256×256)
┌────────┬────────┬────────┬────────┐
│Frame 0 │Frame 1 │Frame 2 │Frame 3 │ Row 0: Idle
├────────┼────────┼────────┼────────┤
│Frame 4 │Frame 5 │Frame 6 │Frame 7 │ Row 1: Walk
├────────┼────────┼────────┼────────┤
│Frame 8 │Frame 9 │Frame10 │Frame11 │ Row 2: Jump
├────────┼────────┼────────┼────────┤
│Frame12 │Frame13 │Frame14 │Frame15 │ Row 3: Attack
└────────┴────────┴────────┴────────┘
```

### 2. Classe SpriteSheet

```javascript
/**
 * Sprite sheet avec animations
 */
export class SpriteSheet {
  constructor(imageSrc, frameWidth, frameHeight) {
    this.image = new Image();
    this.image.src = imageSrc;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.loaded = false;

    this.image.onload = () => {
      this.loaded = true;
      this.cols = this.image.width / frameWidth;
      this.rows = this.image.height / frameHeight;
    };
  }

  /**
   * Dessine une frame spécifique
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} frameIndex - Index de la frame
   * @param {number} x - Position X
   * @param {number} y - Position Y
   */
  drawFrame(ctx, frameIndex, x, y) {
    if (!this.loaded) return;

    const col = frameIndex % this.cols;
    const row = Math.floor(frameIndex / this.cols);

    ctx.drawImage(
      this.image,
      col * this.frameWidth,       // Source X
      row * this.frameHeight,       // Source Y
      this.frameWidth,              // Source Width
      this.frameHeight,             // Source Height
      x,                            // Dest X
      y,                            // Dest Y
      this.frameWidth,              // Dest Width
      this.frameHeight              // Dest Height
    );
  }

  /**
   * Dessine frame d'une row spécifique (pour animations directionnelles)
   */
  drawFrameFromRow(ctx, row, frameIndex, x, y) {
    if (!this.loaded) return;

    ctx.drawImage(
      this.image,
      frameIndex * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth,
      this.frameHeight
    );
  }
}

// Utilisation
const monsterSheet = new SpriteSheet('assets/sprites/monster-sheet.png', 64, 64);

let currentFrame = 0;

function render(ctx) {
  monsterSheet.drawFrame(ctx, currentFrame, 100, 100);

  // Animer
  currentFrame = (currentFrame + 1) % 8;
}
```

### 3. Animated Sprite (complet)

```javascript
/**
 * Sprite animé avec gestion des animations
 */
export class AnimatedSprite {
  constructor(spriteSheet, x, y) {
    this.spriteSheet = spriteSheet;
    this.x = x;
    this.y = y;
    this.animations = new Map();
    this.currentAnimation = null;
    this.currentFrame = 0;
    this.frameTime = 0;
    this.facing = 'right';
  }

  /**
   * Définit une animation
   *
   * @param {string} name - Nom de l'animation
   * @param {Object} config - Configuration
   * @param {number} config.row - Ligne dans la sprite sheet
   * @param {number} config.frameCount - Nombre de frames
   * @param {number} config.fps - Frames par seconde
   * @param {boolean} config.loop - Boucler l'animation
   */
  addAnimation(name, config) {
    this.animations.set(name, {
      row: config.row,
      frameCount: config.frameCount,
      fps: config.fps || 10,
      loop: config.loop !== false,
      frameInterval: 1000 / (config.fps || 10)
    });
  }

  /**
   * Joue une animation
   */
  play(animationName) {
    if (this.currentAnimation === animationName) return;

    if (!this.animations.has(animationName)) {
      console.warn(`Animation "${animationName}" not found`);
      return;
    }

    this.currentAnimation = animationName;
    this.currentFrame = 0;
    this.frameTime = 0;
  }

  /**
   * Met à jour l'animation
   */
  update(deltaTime) {
    if (!this.currentAnimation) return;

    const anim = this.animations.get(this.currentAnimation);
    this.frameTime += deltaTime;

    if (this.frameTime >= anim.frameInterval) {
      this.currentFrame++;

      if (this.currentFrame >= anim.frameCount) {
        if (anim.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = anim.frameCount - 1;
        }
      }

      this.frameTime = 0;
    }
  }

  /**
   * Dessine le sprite
   */
  draw(ctx) {
    if (!this.currentAnimation) return;

    const anim = this.animations.get(this.currentAnimation);

    ctx.save();

    // Flip horizontal si facing left
    if (this.facing === 'left') {
      ctx.scale(-1, 1);
      ctx.translate(-this.x - this.spriteSheet.frameWidth, 0);
    }

    this.spriteSheet.drawFrameFromRow(
      ctx,
      anim.row,
      this.currentFrame,
      this.x,
      this.y
    );

    ctx.restore();
  }

  setFacing(direction) {
    this.facing = direction;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Utilisation
const player = new AnimatedSprite(playerSheet, 100, 100);

// Définir animations
player.addAnimation('idle', { row: 0, frameCount: 4, fps: 8 });
player.addAnimation('walk', { row: 1, frameCount: 6, fps: 10 });
player.addAnimation('jump', { row: 2, frameCount: 3, fps: 15, loop: false });

// Jouer
player.play('walk');
player.setFacing('right');

function gameLoop(deltaTime) {
  player.update(deltaTime);
  player.draw(ctx);
}
```

## Détection de collisions

### 1. AABB (Axis-Aligned Bounding Box)

```javascript
/**
 * Collision rectangulaire simple
 */
function checkAABBCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Utilisation
if (checkAABBCollision(player, enemy)) {
  console.log('Collision détectée!');
}
```

### 2. Collision circulaire

```javascript
/**
 * Collision pour sprites circulaires
 */
function checkCircleCollision(a, b) {
  const dx = (a.x + a.width / 2) - (b.x + b.width / 2);
  const dy = (a.y + a.height / 2) - (b.y + b.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  const radiusSum = (a.width / 2) + (b.width / 2);

  return distance < radiusSum;
}
```

### 3. Spatial hashing (optimisation)

```javascript
/**
 * Grid spatiale pour optimiser détection collisions
 */
class SpatialGrid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  getCellKey(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  insert(sprite) {
    const key = this.getCellKey(sprite.x, sprite.y);

    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }

    this.grid.get(key).push(sprite);
  }

  getNearby(sprite) {
    const nearby = [];
    const cellX = Math.floor(sprite.x / this.cellSize);
    const cellY = Math.floor(sprite.y / this.cellSize);

    // Vérifier cellule et cellules adjacentes
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${cellX + dx},${cellY + dy}`;
        if (this.grid.has(key)) {
          nearby.push(...this.grid.get(key));
        }
      }
    }

    return nearby;
  }

  clear() {
    this.grid.clear();
  }
}

// Utilisation
const spatialGrid = new SpatialGrid(64);

function checkCollisions() {
  spatialGrid.clear();

  // Insérer tous sprites
  allSprites.forEach(sprite => spatialGrid.insert(sprite));

  // Vérifier collisions seulement avec sprites proches
  allSprites.forEach(sprite => {
    const nearby = spatialGrid.getNearby(sprite);

    nearby.forEach(other => {
      if (sprite !== other && sprite.collidesWith(other)) {
        handleCollision(sprite, other);
      }
    });
  });
}
```

## Optimisation sprites

### 1. Object pooling

```javascript
/**
 * Pool de sprites pour réutilisation
 */
class SpritePool {
  constructor(SpriteClass, size) {
    this.pool = [];
    this.active = [];

    for (let i = 0; i < size; i++) {
      this.pool.push(new SpriteClass());
    }
  }

  get() {
    let sprite;

    if (this.pool.length > 0) {
      sprite = this.pool.pop();
    } else {
      sprite = new this.SpriteClass();
    }

    this.active.push(sprite);
    return sprite;
  }

  release(sprite) {
    const index = this.active.indexOf(sprite);
    if (index !== -1) {
      this.active.splice(index, 1);
      this.pool.push(sprite);
    }
  }

  updateAll(deltaTime) {
    this.active.forEach(sprite => sprite.update(deltaTime));
  }

  drawAll(ctx) {
    this.active.forEach(sprite => sprite.draw(ctx));
  }
}

// Utilisation
const bulletPool = new SpritePool(Bullet, 50);

function shoot() {
  const bullet = bulletPool.get();
  bullet.reset(playerX, playerY);
}

function onBulletHit(bullet) {
  bulletPool.release(bullet);
}
```

### 2. Culling (ne dessiner que visible)

```javascript
/**
 * Dessiner seulement sprites visibles à l'écran
 */
function isVisible(sprite, camera) {
  return (
    sprite.x + sprite.width > camera.x &&
    sprite.x < camera.x + camera.width &&
    sprite.y + sprite.height > camera.y &&
    sprite.y < camera.y + camera.height
  );
}

function render(ctx, camera) {
  sprites.forEach(sprite => {
    if (isVisible(sprite, camera)) {
      sprite.draw(ctx);
    }
  });
}
```

### 3. Batch rendering

```javascript
/**
 * Regrouper sprites par texture pour réduire changements de contexte
 */
function batchRender(ctx, sprites) {
  // Grouper par texture
  const batches = new Map();

  sprites.forEach(sprite => {
    const texture = sprite.getTexture();

    if (!batches.has(texture)) {
      batches.set(texture, []);
    }

    batches.get(texture).push(sprite);
  });

  // Dessiner par batch
  batches.forEach((batch, texture) => {
    batch.forEach(sprite => sprite.draw(ctx));
  });
}
```

## Sprites directionnels

```javascript
/**
 * Sprite avec 4 directions
 */
class DirectionalSprite extends AnimatedSprite {
  constructor(spriteSheet, x, y) {
    super(spriteSheet, x, y);
    this.direction = 'down'; // down, up, left, right
  }

  setDirection(direction) {
    this.direction = direction;

    // Mapper direction à row de sprite sheet
    const directionMap = {
      down: 0,
      left: 1,
      right: 2,
      up: 3
    };

    // Changer animation en fonction de direction
    this.play(`walk_${direction}`);
  }

  moveInDirection(speed) {
    switch (this.direction) {
      case 'up':
        this.y -= speed;
        break;
      case 'down':
        this.y += speed;
        break;
      case 'left':
        this.x -= speed;
        break;
      case 'right':
        this.x += speed;
        break;
    }
  }
}

// Utilisation
const player = new DirectionalSprite(playerSheet, 100, 100);

// Définir animations pour chaque direction
player.addAnimation('walk_down', { row: 0, frameCount: 4, fps: 10 });
player.addAnimation('walk_left', { row: 1, frameCount: 4, fps: 10 });
player.addAnimation('walk_right', { row: 2, frameCount: 4, fps: 10 });
player.addAnimation('walk_up', { row: 3, frameCount: 4, fps: 10 });

// Contrôles
if (keys.has('ArrowUp')) {
  player.setDirection('up');
  player.moveInDirection(2);
}
```

## Checklist sprites

- [ ] Images PNG avec transparence
- [ ] Résolutions multiples (@1x, @2x, @3x)
- [ ] Sprite sheets organisées (grille)
- [ ] Animations définies (idle, walk, jump, etc.)
- [ ] Collisions implémentées (AABB ou circle)
- [ ] Culling pour performance
- [ ] Object pooling si beaucoup de sprites
- [ ] Spatial grid si > 100 sprites
- [ ] Flip horizontal/vertical fonctionnel
- [ ] Assets optimisés (< 50 KB par sheet)

## Voir aussi

- `arcade-game-creator/SKILL.md` - Jeux utilisant sprites
- `animation-system/SKILL.md` - Animations de sprites
- `asset-optimizer/SKILL.md` - Optimisation images
- `performance-profiler/SKILL.md` - Performance rendu
- Jeux existants : `multisnake.js`, `arcade-invasion.js` (exemples de gestion sprites)

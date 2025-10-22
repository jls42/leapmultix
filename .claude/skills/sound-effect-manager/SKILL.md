---
name: 'Sound Effect Manager'
description: "Gère effets sonores et audio pour feedback utilisateur (sons correct/wrong, musiques, volume). Utiliser lors d'ajout de nouveaux sons ou gestion audio"
---

# Sound Effect Manager

Cette skill guide la gestion des effets sonores et de l'audio dans leapmultix.

## Quand utiliser cette skill

- Ajout de nouveaux effets sonores
- Gestion du volume et mute
- Musique de fond pour jeux
- Feedback audio utilisateur
- Optimisation chargement audio
- Support multi-formats audio

## Module audio existant

Le projet a déjà un **AudioManager** complet (`js/core/audio.js`) :

```javascript
import { playSound, setVolume, toggleMute, isMuted } from './core/audio.js';

// Jouer un son
playSound('correct');
playSound('wrong');
playSound('victory');

// Contrôles volume
setVolume(0.7); // 0.0 à 1.0
toggleMute();
const muted = isMuted();
```

## Sons disponibles

**Catalogue actuel :**

- `correct` - Réponse correcte
- `wrong` - Réponse incorrecte
- `victory` - Victoire/fin de jeu
- `click` - Click UI
- `coin` - Gain de pièces
- `levelup` - Montée de niveau

## Ajouter un nouveau son

### 1. Préparer fichiers audio

**Formats recommandés :**

- MP3 : Compatibilité universelle
- OGG : Alternative open-source
- WebM : Format moderne léger

```bash
# Convertir WAV→MP3 (96 kbps pour effets)
ffmpeg -i input.wav -b:a 96k output.mp3

# Convertir MP3→OGG
ffmpeg -i input.mp3 -c:a libvorbis -q:a 4 output.ogg

# Convertir MP3→WebM
ffmpeg -i input.mp3 -c:a libopus -b:a 96k output.webm
```

**Taille cible :** < 50 KB par fichier

### 2. Placer dans assets/sounds/

```
assets/sounds/
├── correct.mp3
├── correct.ogg
├── wrong.mp3
├── wrong.ogg
├── new-sound.mp3  ← Nouveau
├── new-sound.ogg  ← Nouveau
└── ...
```

### 3. Enregistrer dans AudioManager

```javascript
// core/audio.js
const SOUND_CATALOG = {
  correct: 'assets/sounds/correct.mp3',
  wrong: 'assets/sounds/wrong.mp3',
  victory: 'assets/sounds/victory.mp3',
  click: 'assets/sounds/click.mp3',
  coin: 'assets/sounds/coin.mp3',
  levelup: 'assets/sounds/levelup.mp3',
  // Ajouter nouveau son
  newSound: 'assets/sounds/new-sound.mp3',
};
```

### 4. Utiliser le son

```javascript
import { playSound } from './core/audio.js';

function onSpecialEvent() {
  playSound('newSound');
}
```

## API AudioManager

### playSound(soundName, options)

```javascript
// Son simple
playSound('correct');

// Avec options
playSound('backgroundMusic', {
  loop: true, // Répéter en boucle
  volume: 0.3, // Volume spécifique (0.0-1.0)
});
```

### setVolume(volume)

```javascript
// Volume global (0.0 = muet, 1.0 = max)
setVolume(0.5);
```

### toggleMute()

```javascript
// Basculer mute on/off
const button = document.getElementById('muteBtn');
button.addEventListener('click', toggleMute);
```

### isMuted()

```javascript
// Vérifier état mute
if (isMuted()) {
  console.log('Audio muted');
}
```

## Patterns audio

### 1. Préchargement des sons

```javascript
// Précharger sons critiques au démarrage
const sounds = ['correct', 'wrong', 'click'];

sounds.forEach(soundName => {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = SOUND_CATALOG[soundName];
});
```

### 2. Pool d'objets Audio

**Problème :** Si même son joué rapidement, peut se chevaucher

**Solution :** Créer plusieurs instances

```javascript
class SoundPool {
  constructor(src, poolSize = 3) {
    this.pool = [];
    this.currentIndex = 0;

    for (let i = 0; i < poolSize; i++) {
      const audio = new Audio(src);
      this.pool.push(audio);
    }
  }

  play(volume = 1.0) {
    const audio = this.pool[this.currentIndex];
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(e => console.warn('Audio play failed:', e));

    this.currentIndex = (this.currentIndex + 1) % this.pool.length;
  }
}

// Utilisation
const clickSound = new SoundPool('assets/sounds/click.mp3', 5);

// Peut être joué rapidement plusieurs fois
button.addEventListener('click', () => clickSound.play());
```

### 3. Fade in/out

```javascript
function fadeIn(audio, duration = 1000) {
  audio.volume = 0;
  audio.play();

  const steps = 20;
  const stepDuration = duration / steps;
  const volumeStep = 1 / steps;

  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    audio.volume = Math.min(volumeStep * currentStep, 1);

    if (currentStep >= steps) {
      clearInterval(interval);
    }
  }, stepDuration);
}

function fadeOut(audio, duration = 1000) {
  const startVolume = audio.volume;
  const steps = 20;
  const stepDuration = duration / steps;
  const volumeStep = startVolume / steps;

  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);

    if (currentStep >= steps) {
      clearInterval(interval);
      audio.pause();
      audio.currentTime = 0;
    }
  }, stepDuration);
}

// Utilisation
fadeIn(backgroundMusic, 2000);
fadeOut(backgroundMusic, 1000);
```

### 4. Musique de fond

```javascript
class BackgroundMusic {
  constructor(src) {
    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.volume = 0.3; // Plus bas que effets sonores
  }

  play() {
    this.audio.play().catch(e => {
      console.warn('Background music autoplay blocked:', e);
      // Autoplay peut être bloqué - attendre interaction utilisateur
    });
  }

  pause() {
    this.audio.pause();
  }

  setVolume(volume) {
    this.audio.volume = volume;
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}

// Utilisation
const bgMusic = new BackgroundMusic('assets/music/game-theme.mp3');

// Démarrer après interaction utilisateur
startButton.addEventListener('click', () => {
  bgMusic.play();
});

// Arrêter à la fin du jeu
function endGame() {
  bgMusic.stop();
}
```

### 5. Web Audio API (avancé)

**Pour effets plus complexes :**

```javascript
class WebAudioManager {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = new Map();
  }

  async loadSound(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

    this.sounds.set(name, audioBuffer);
  }

  play(name, options = {}) {
    const buffer = this.sounds.get(name);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;

    // Gain (volume)
    const gainNode = this.context.createGain();
    gainNode.gain.value = options.volume || 1.0;

    // Connections
    source.connect(gainNode);
    gainNode.connect(this.context.destination);

    // Playback rate (pitch)
    if (options.playbackRate) {
      source.playbackRate.value = options.playbackRate;
    }

    source.start(0);
  }

  // Effet spatial (panning)
  playPanned(name, pan = 0) {
    // pan: -1 (gauche) à 1 (droite)
    const buffer = this.sounds.get(name);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;

    const panner = this.context.createStereoPanner();
    panner.pan.value = pan;

    source.connect(panner);
    panner.connect(this.context.destination);

    source.start(0);
  }
}

// Utilisation
const audioManager = new WebAudioManager();

await audioManager.loadSound('laser', 'assets/sounds/laser.mp3');

// Jouer avec pitch varié
audioManager.play('laser', { playbackRate: 1.5 }); // Plus aigu

// Jouer à gauche
audioManager.playPanned('laser', -0.8);
```

## Optimisation audio

### 1. Compression

**Bitrate recommandé :**

- Effets sonores : 96 kbps
- Musique : 128 kbps
- Voix : 64 kbps

```bash
ffmpeg -i input.wav -b:a 96k output.mp3
```

### 2. Formats multiples

**HTML5 audio avec fallback :**

```html
<audio id="correctSound">
  <source src="correct.webm" type="audio/webm" />
  <source src="correct.mp3" type="audio/mpeg" />
  <source src="correct.ogg" type="audio/ogg" />
</audio>
```

### 3. Lazy loading sons

**Charger sons à la demande :**

```javascript
const soundCache = new Map();

async function loadSound(name) {
  if (soundCache.has(name)) {
    return soundCache.get(name);
  }

  const audio = new Audio(SOUND_CATALOG[name]);
  await new Promise((resolve, reject) => {
    audio.addEventListener('canplaythrough', resolve, { once: true });
    audio.addEventListener('error', reject, { once: true });
  });

  soundCache.set(name, audio);
  return audio;
}

// Utilisation
const audio = await loadSound('victory');
audio.play();
```

## Gestion mobile

### Autoplay restrictions

**Mobile Safari et Chrome bloquent autoplay** - Nécessite interaction :

```javascript
let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  const sound = new Audio('assets/sounds/silence.mp3'); // Fichier silence court
  sound
    .play()
    .then(() => {
      audioUnlocked = true;
      console.log('Audio unlocked');
    })
    .catch(() => {
      console.log('Audio still locked');
    });
}

// Débloquer sur première interaction
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });
```

### Optimisation batterie

```javascript
// Pause audio quand app en background
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    backgroundMusic.pause();
  } else {
    backgroundMusic.play();
  }
});
```

## Accessibilité audio

### Respecter prefers-reduced-motion

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Désactiver sons ou réduire fréquence
  audioEnabled = false;
}
```

### Sous-titres pour contenus audio importants

```html
<audio controls>
  <source src="tutorial.mp3" type="audio/mpeg" />
  <track kind="captions" src="tutorial-fr.vtt" srclang="fr" label="Français" />
  <track kind="captions" src="tutorial-en.vtt" srclang="en" label="English" />
</audio>
```

## Checklist audio

- [ ] Sons compressés (< 50 KB)
- [ ] Formats multiples (MP3, OGG, WebM)
- [ ] Volume configurable par utilisateur
- [ ] Bouton mute accessible
- [ ] Préférence sauvegardée (localStorage)
- [ ] Préchargement sons critiques
- [ ] Autoplay mobile géré
- [ ] Pas de son par défaut sans interaction
- [ ] Sons stoppés au changement de slide
- [ ] Cleanup lors de mode.cleanup()

## Integration leapmultix

### Utilisation typique dans game mode

```javascript
import { playSound } from './core/audio.js';

export default class QuizMode extends GameMode {
  handleCorrectAnswer(question) {
    playSound('correct');
    this.updateScore(10);
  }

  handleWrongAnswer(question) {
    playSound('wrong');
    this.showCorrection();
  }

  async cleanup() {
    // Stopper musique de fond si active
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
    }
  }
}
```

### UI contrôles audio

```html
<!-- Bouton mute -->
<button id="muteBtn" aria-label="Mute/Unmute">
  <span id="muteIcon">🔊</span>
</button>

<!-- Slider volume -->
<input type="range" id="volumeSlider" min="0" max="100" value="70" aria-label="Volume" />
```

```javascript
import { setVolume, toggleMute, isMuted } from './core/audio.js';

// Mute button
document.getElementById('muteBtn').addEventListener('click', () => {
  toggleMute();
  updateMuteIcon();
});

function updateMuteIcon() {
  const icon = document.getElementById('muteIcon');
  icon.textContent = isMuted() ? '🔇' : '🔊';
}

// Volume slider
document.getElementById('volumeSlider').addEventListener('input', e => {
  const volume = e.target.value / 100;
  setVolume(volume);
});
```

## Voir aussi

- `core/audio.js` - AudioManager du projet
- `arcade-game-creator/SKILL.md` - Sons dans jeux arcade
- `animation-system/SKILL.md` - Sync audio/animations
- `accessibility/SKILL.md` - Accessibilité audio

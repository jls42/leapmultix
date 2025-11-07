---
name: managing-sound-effects
description: Manages sound effects and audio for user feedback (correct/wrong sounds, music, volume). Use when adding new sounds or managing audio
allowed-tools: Read, Write, Grep, Glob, Bash
---

# Sound Effect Manager

Gère effets sonores et feedback audio pour meilleure expérience utilisateur.

## Quand utiliser

- Ajout de nouveaux effets sonores
- Gestion du volume et mute
- Musique de fond pour jeux
- Feedback audio utilisateur
- Optimisation chargement audio

## AudioManager (js/core/audio.js)

**API :**

- `playSound(soundName, options)` - Jouer son
- `setVolume(volume)` - Volume global (0.0-1.0)
- `toggleMute()` / `isMuted()` - Mute control

**Sons disponibles (examine audio.js) :**
correct, wrong, victory, click, coin, levelup

## Ajouter un nouveau son

1. **Compresser :** < 50 KB (96 kbps pour effets, 128 kbps musique)
2. **Formats :** MP3, OGG, WebM (fallback)
3. **Placer :** assets/sounds/
4. **Enregistrer :** SOUND_CATALOG dans audio.js
5. **Utiliser :**
   ```javascript
   import { playSound } from './core/audio.js';
   playSound('yourSound');
   ```

## Patterns essentiels

- **Préchargement :** Sons critiques avant utilisation
- **Pool audio :** Instances multiples pour chevauchement
- **Musique fond :** Volume 0.3, loop activé, cleanup dans destroy
- **Mobile :** Autoplay nécessite interaction utilisateur
- **Accessibilité :** Respecter prefers-reduced-motion

## Gestion du lifecycle

**Mode avec musique :**

```javascript
// Lancer musique
playSound('background-music', { loop: true, volume: 0.3 });

// cleanup() → stopper musique
```

Examine QuizMode/ChallengeMode pour patterns existants.

## Checklist ajout son

- [ ] Fichier compressé < 50 KB
- [ ] Formats multiples (MP3, OGG, WebM)
- [ ] Ajouté au SOUND_CATALOG
- [ ] Volume testé
- [ ] Mute fonctionne
- [ ] Cleanup musique si loop
- [ ] Mobile autoplay OK

## En cas de doute

**Règles absolues :**

1. Utiliser audio.js API (jamais créer Audio directement)
2. < 50 KB par fichier
3. Stopper musique dans cleanup()
4. Pas d'autoplay sans interaction utilisateur
5. Volume par défaut ≤ 0.7

**Référence :**

- `js/core/audio.js` - API complète
- `assets/sounds/` - Catalogues existants
- Modes (QuizMode, ChallengeMode) - Exemples d'utilisation

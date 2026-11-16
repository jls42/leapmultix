---
name: generating-sound-effects
description: >-
  Génère des bruitages pour LeapMultix avec ElevenLabs (sound-generation), les fait écouter et
  choisir au propriétaire sur une page publiée en artifact privé (le choix reste dans le stockage
  de la page, que Claude relit), puis installe le son choisi dans le jeu. À utiliser quand on
  crée du contenu qui a besoin d'un son : un coup, un clic, une récompense, un effet de jeu
  d'Arcade (« un effet sonore », « un bruit quand… », « générer des sons »). Pas pour les
  phrases lues à voix haute : c'est le skill generating-voice-clips, et rien de neuf n'y est
  dit sans réenregistrement payant.
---

# Bruitages ElevenLabs

Premier lot : le maillet de MultiPop (16/11/2026), six sons de 0,5 s pour 36 crédits, « pop-2 »
choisi. Le lot `lots/maillet.json` sert de modèle.

## Règles

- **Le propriétaire choisit** sur la page d'écoute ; rien n'entre dans le jeu avant. Il a donné
  son accord pour générer (« si besoin génère des sons via ElevenLabs ») : dire le coût avant et
  après, en crédits.
- **La clé** ELEVENLABS_API_KEY vient du `.env` du dépôt des voix (`../leapmultix-voices/.env`),
  lue sur sa seule ligne par `generate.py` ; jamais affichée, jamais cherchée ailleurs.
- **Pour des enfants de 6 à 12 ans** : doux, rigolo, jamais agressif ni effrayant ; consignes en
  anglais, terminées par « child friendly, clean, no background, no voice ».

## Procédure

```
- [ ] 1. Le lot : moment du jeu, consignes, plafond
- [ ] 2. Génération, puis mesure
- [ ] 3. Page d'écoute publiée, choix relu
- [ ] 4. Installation dans le jeu, tests, Chrome
```

### 1. Le lot

`lots/<nom>.json` : `lot`, `title` (titre de la page), `intro`, `ceiling` (crédits au plus),
`sounds` (nom, consigne, `duration`, `variations`) et, si le son part avec un son du jeu,
`reference` (fichier, libellé du bouton, son volume dans le jeu, celui du nouveau son, délai).
Durée : 0,5 s au moins (minimum de l'API), raccourcie à l'installation. Deux ou trois variantes
par consigne, trois consignes de styles différents. `generate.py plan <lot>` donne la dépense
au plus (prix documenté : 40 crédits par seconde ; facturé le 16/11 : 6 pour 0,5 s).

### 2. Génération et mesure

```bash
python3 -I .claude/skills/generating-sound-effects/generate.py usage
python3 -I .claude/skills/generating-sound-effects/generate.py generate <lot>
```

Sons et fiches dans `analysis/sons/<lot>/` (non versionné : le lot versionné garde les
consignes, le choix va dans `chosen`). Un son déjà là n'est pas refait : le lot se reprend.

### 3. Page d'écoute

```bash
python3 -I .claude/skills/generating-sound-effects/page.py <lot> <scratchpad>/page-<lot>
```

Le script mesure chaque son (un ou plusieurs coups, attaque, crête), écarte un son presque muet,
ramène les autres à la même force et affiche le `file_path` et la table `files` à publier :
Artifact avec `capabilities: {"db": {}}`. Une description écrite après écoute des mesures se
met dans `notes` du lot (`{"pop-2": "…"}`) ; sinon la page montre les mesures. Le choix se relit
avec ArtifactData : collection `choix`, document `<lot>` (`{choix, note}` ; `aucun` : refaire).

### 4. Installation

- **En `.wav`** dans `assets/sounds/` : la liste hors ligne (`scripts/precache-list.mjs`) ne
  prend pas les `.mp3`. Raccourcir au son utile, avec un fondu de 50 ms :
  `ffmpeg -i <page>/a/<id>.mp3 -t 0.3 -af "afade=t=out:st=0.25:d=0.05" -ac 1 -c:a pcm_s16le assets/sounds/<nom>.wav`
  (la version de la page est déjà à la bonne force).
- **Au catalogue** de `js/core/audio.js` (`sounds`, et `soundVolumes` si le son part avec un
  autre : 0,7 pour le maillet, sous la bonne réponse jouée à 0,4), puis
  `AudioManager.playSound('<nom>')` **dans le geste du joueur** (le gestionnaire de la tape ou
  de la touche), comme le son de la réponse : lancé plus tard par la boucle du jeu, Safari peut
  le refuser, et `playSound` se tait alors sans rien dire. Le maillet sonne donc à la tape, et
  touche le monstre 80 ms plus tard. `npm run precache:update`.
- **Test** : `jest.spyOn(AudioManager, 'playSound')`, compter les appels du son juste après le
  geste, et jamais quand il ne doit pas sonner ; le voir échouer en retirant l'appel.
- **Chrome** : avant le chargement, envelopper `window.Audio` (`initScript` qui note la source
  et l'heure de chaque son créé, et si `play()` a été accepté) pour mesurer quand il part et
  s'il part. Safari sur iPhone reste à essayer en vrai. En local, les modules du jeu sont
  chargés sans `?v=` : un script de mesure les importe sous la même adresse, sinon il obtient
  une autre copie du module (taille du plateau inconnue, points faux d'un facteur 3).

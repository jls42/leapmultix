---
name: filming-store-video
description: >-
  Tourne et monte la vidéo de présentation de LeapMultix pour sa fiche Google Play : Chrome
  sans fenêtre joue au jeu (accueil, six modes, menu Arcade, six jeux d'Arcade) en lisant ce
  que chaque plateau dessine, filme une scène par écran en 1920 × 1080, puis le montage coupe
  autour des moments marqués et ajoute un carton de fin, une vidéo par langue (fr, en, es). À
  utiliser quand le propriétaire demande une vidéo du jeu, une « preview » de la fiche, de la
  refaire après un changement d'écran ou de jeu, d'en changer l'ordre ou les durées, d'ajouter
  une scène ou un jeu au tournage, ou de filmer une vraie partie pour une annonce. Pas pour une
  vidéo générée ni pour un film d'animation : ici tout est une vraie capture du jeu.
---

# Vidéo de la fiche : tourner, monter, contrôler

Tout est dans ce dossier : `base.mjs` (ouvrir le jeu, toucher, lire un plateau, enregistrer),
`modes.mjs` (questions des modes), `arcade.mjs` (les six jeux), `filmer.mjs` (les scènes),
`monter.mjs` et `carton.html` (le montage), `sonde-jeu.mjs` (repérage). Il faut `ffmpeg` et le
Chrome de Puppeteer (`npm install`). Prises et vidéos vont dans `analysis/video-fiche/`, que git
ignore.

## Règles

- **Une vraie capture du jeu**, jouée par la session : aucune image générée dans les scènes.
- **Le jeu filmé est celui de l'appli** : le `www/` du dépôt voisin `../leapmultix-android`
  quand il existe (`LEAPMULTIX_ANDROID` pour un autre emplacement, `RACINE` pour un autre site),
  sinon ce dépôt. `filmer.mjs` écrit lequel. Le site dit « dans ton navigateur » là où l'appli
  dit autre chose : pour la fiche, filmer l'appli, à la version qui est en ligne sur le Play
  Store.
- **Aucune fête à l'image** (`?saison=aucune`, posé par `base.mjs`) : Google demande de ne rien
  montrer de daté.
- **Le propriétaire décide** l'ordre, les durées et le carton, met lui-même les vidéos sur
  YouTube et colle leur adresse dans la fiche.
- **Des images peuvent s'écarter du montage** : le tournage note `ami` quand un héros apparaît
  en « ami » (toujours dans MultiPop ; dans MultiInvaders, seulement ceux que nomme
  `AMIS_ECARTES=<début du nom de l'image>,…`), et le montage choisit un extrait sans ces
  instants. Ce que le propriétaire veut écarter des visuels de la fiche est dans les notes
  privées du dépôt (`CLAUDE.local.md`) : les lire avant de tourner.

## Ce que Google demande (aide Play Console, « Ajouter des éléments d'aperçu »)

À relire avant un nouveau tournage, la page change :
<https://support.google.com/googleplay/android-developer/answer/9866151>. Lu en novembre 2026 :

- La vidéo peut se lire toute seule, **sans le son, 30 secondes au plus** : ce qui compte passe
  avant 30 s, le carton en dernier. Montrer le jeu dans les 10 premières secondes ; au moins
  80 % de la durée sur l'usage réel ; peu d'écrans titres ; ni mains ni doigts filmés.
- Texte à l'écran : rien qui vante (« le meilleur », « numéro 1 », « nouveau », « remise »),
  **aucune invitation** (« Télécharger », « Installer », « Jouer », « Essayer »).
- YouTube : vidéo publique ou non répertoriée, **publicités et monétisation désactivées**, sans
  limite d'âge, intégration autorisée ; l'adresse d'une vidéo, sans liste ni code temporel.
- Le carton reprend l'image d'en-tête de la fiche : si elle a été déclarée « générée par
  l'IA », le dire au propriétaire au moment de la déclaration de la vidéo.

## Procédure (copier la liste et la cocher)

```
- [ ] 1. Tourner une langue, lire le compte rendu
- [ ] 2. Monter, regarder chaque planche
- [ ] 3. Corriger ce que les planches montrent, refilmer la scène, remonter
- [ ] 4. Les deux autres langues
- [ ] 5. Envoyer les vidéos au propriétaire, avec ce qu'il a à trancher
```

1. **Tourner** (5 minutes par langue, en tâche de fond) :
   `node .claude/skills/filming-store-video/filmer.mjs fr`, ou seulement des scènes :
   `… filmer.mjs fr quiz multimiam`. Scènes : `accueil quiz decouverte defi chrono aventure
arcade-menu multipop multigoal invasion multimiam multisnake multimemory`. Chaque scène écrit
   `analysis/video-fiche/prises/<langue>/<scène>.webm` et ses moments dans `journal.json`. Une
   prise où le montage ne trouverait pas son extrait est refaite toute seule, trois fois au
   plus ; la ligne dit `bonne` ou `à refaire`, et la commande sort en erreur s'il en reste.
2. **Monter** : `node .claude/skills/filming-store-video/monter.mjs fr` écrit
   `analysis/video-fiche/sorties/leapmultix-fr.mp4` (H.264, sans son) et des planches
   `planche-fr-N.jpg`, deux images par seconde. **Regarder chaque planche** : c'est la seule
   vraie vérification. Y chercher un extrait qui ne montre pas ce qu'il doit (pas de bonne
   réponse, écran de transition), une faute, une image à écarter, une langue qui n'est pas la
   bonne, une fête.
3. **Régler** : l'ordre et les durées sont le tableau `PLAN` de `monter.mjs` (secondes avant et
   après le moment marqué) ; remonter ne demande pas de refilmer. Les deux lignes du carton sont
   dans `carton.html`, reprises des descriptions courtes de la fiche.
4. **Envoyer** les MP4 au propriétaire. Dire ce qui reste à lui : l'ordre, les durées, un mot à
   l'écran par scène ou non (Google le recommande, la vidéo se lisant sans le son), puis
   YouTube et la fiche (une modification de fiche repart en examen).

## Comment le script joue juste

`base.mjs` pose, avant le chargement de la page, un relevé de tout ce qu'un plateau écrit
(`fillText`) et dessine (`drawImage`) : le script sait où est le nombre de la bonne réponse
sans toucher au code du jeu. Chaque geste passe par l'écran tactile, avec un rond qui le montre.

| Jeu                 | Façon de jouer                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| MultiPop, MultiGoal | toucher le nombre de la bonne réponse                                                                                         |
| MultiInvaders       | tirer sur la mauvaise réponse la plus basse                                                                                   |
| MultiSnake          | toucher la bonne pomme : le serpent y va                                                                                      |
| MultiMiam           | lire le labyrinthe sur ses tuiles, calculer le plus court chemin, glisser le doigt à chaque virage (un toucher ne suffit pas) |
| MultiMemory         | retourner les cartes, retenir leur valeur, jouer une paire connue ; la scène s'arrête à deux paires                           |

Les modes : `readQuestion` lit le calcul et trouve la réponse, y compris un nombre manquant, un
vrai ou faux et des réponses écrites en lettres (le mot vient du jeu, `numberToWords`). Le Quiz
joue jusqu'à une bonne réponse sur un calcul à quatre choix, puis se trompe exprès pour montrer
l'explication. Le Chrono tape la réponse au pavé : le jeu valide seul.

## Quand un jeu ou un écran change

- Un jeu ne marque plus de point, ou un nouveau jeu arrive :
  `node .claude/skills/filming-store-video/sonde-jeu.mjs <jeu> 3000` liste les images (nom,
  taille, place) et les textes de son plateau. Écrire ensuite sa façon de jouer dans
  `arcade.mjs`, sa scène dans `filmer.mjs` (`SCENES`, `GAMES`) et son extrait dans `PLAN`.
- **Un plateau qui ne se redessine que quand il change** (MultiMemory) ne laisse rien dans une
  fenêtre de relevé courte : lire sur une fenêtre longue (`60000`).
- **Un geste qui ne suffit pas** (MultiMiam) se voit au journal : beaucoup de `geste`, aucun
  `gagne`. Regarder une planche de la prise brute avant de corriger :
  `ffmpeg -i <prise>.webm -vf "fps=2,scale=480:-1,tile=6x5" -frames:v 1 planche.jpg`.
- Les marques du journal sont justes à 0,05 s ; `gagne` tombe environ 0,3 s après le geste.
- La taille : 960 × 540 points à la densité 2. Sans `--force-device-scale-factor`, Chrome
  enregistre à la taille en points, soit le quart de l'image.
- En paysage large, le bouton de langue est à l'écran ; ailleurs il est dans le menu
  (`setLanguage` fait les deux).

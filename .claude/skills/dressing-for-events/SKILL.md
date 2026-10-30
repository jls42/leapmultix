---
name: dressing-for-events
description: >-
  Habille LeapMultix pour une fête du calendrier (Halloween, Noël, Nouvel An…) : le thème par
  défaut change seul pendant ses dates (deux thèmes de couleur, clair et sombre), et le jeu se
  costume partout (têtes, corps et monstres de l'Arcade, fusées de MultiInvaders, serpent, pommes et herbe
  de MultiSnake, murs et réponses de MultiMiam, logos des modes et des jeux d'Arcade, plusieurs
  fonds par personnage, image des héros de l'accueil), dessiné par Codex à partir des originaux ; tout revient seul le lendemain. À utiliser quand
  le propriétaire demande un thème de fête, de « déguiser » ou « habiller » les personnages ou
  le jeu pour un événement, de préparer Noël ou le Nouvel An, de refaire ou corriger une image
  costumée, d'ajouter des fonds de fête, ou de changer les dates d'une fête
  (js/core/seasons.js, scripts/seasons/). Pas pour un thème de couleur permanent : celui-là ne
  touche que css/themes.css et la Personnalisation.
allowed-tools: Read, Grep, Glob
---

# Habiller LeapMultix pour une fête

Socle posé pour Halloween 2026. Le thème par défaut suit le calendrier : chaque fête est une
entrée de `SEASONS` dans `js/core/seasons.js`, avec ses dates (bornes incluses, date de
l'appareil, passage d'année géré), ses deux thèmes de couleur, les familles d'images qu'elle
costume et son nombre de fonds par avatar (`worlds`). Deux fêtes ne se chevauchent jamais
(test) : un jour donné a au plus un thème de fête, sinon le thème ordinaire. Familles, une
porte dans le code chacune, toutes lues par `costumed(nom, famille)` :

| Famille       | Images                                                                           | Porte                   |
| ------------- | -------------------------------------------------------------------------------- | ----------------------- |
| `heads`       | `assets/images/arcade/<avatar>_<fête>_head_avatar.png`                           | `js/avatar-heads.js`    |
| `bodies`      | `assets/images/arcade/<avatar>_<fête>.png` (MultiMiam)                           | `arcade-sprite-catalog` |
| `monsters`    | `assets/images/arcade/monstre<NN>_right_<fête>.png` (155, tournés à droite)      | `arcade-sprite-catalog` |
| `ships`       | `assets/images/arcade/<fusée>_<fête>.png` (dix fusées)                           | `arcade-sprite-catalog` |
| `snake`       | 14 morceaux `<morceau>_<fête>.png`, `snake_apple_<fête>.png`, `herbe_<fête>.png` | `arcade-sprite-catalog` |
| `miam`        | `mur_<fête>.png`, `multimiam_reponse_<fête>.png` (sous chaque réponse)           | `arcade-sprite-catalog` |
| `logos`       | `logo_mode_<mode>_<fête>.png` (six), `logo_multi<jeu>_<fête>.png` (quatre)       | `js/logos.js`           |
| `backgrounds` | `img/background_<avatar>_<fête>_001.png` à `_00<worlds>`                         | `js/main-helpers.js`    |
| `hero`        | `assets/social/leapmultix-social-card-<fête>.webp`                               | `js/main-helpers.js`    |

Une nouvelle famille : une porte qui appelle `costumed()`, une ligne dans `FAMILY_FILES` de
`tests-esm/season-images.esm.test.mjs`, une ligne dans la table ci-dessus. Le reste du jeu
suit sans autre réglage :

- pendant la fête, chaque enfant reçoit le thème de la fête de même clarté que son thème
  ordinaire (Nuit, Spatial, Forêt, Braise → sombre ; les autres → clair) ; un thème ordinaire choisi pendant la
  fête la retire jusqu'à l'édition suivante (`seasonChoice`, rattaché à l'année) ; le thème
  ordinaire n'est jamais réécrit ;
- les images ne se costument que quand un thème de la fête est appliqué (`wearSeason`, posé
  par `js/core/theme.js`) : repli toujours classique, images de fête hors du préchargement
  (`isSeasonalImage`, lu par `scripts/precache-list.mjs`) ;
- le lendemain de la fête, tout revient seul : rien à retirer du code, ni à déployer.

## Règles, toujours

- **Calendrier** : la PR fusionnée et déployée **au moins deux jours avant** le début (25 à
  35 min de déploiement après la fusion, plus la relecture des images). Les images se lancent
  dès l'accord sur les costumes : c'est le chemin critique.
- **Jamais effrayant** (enfants de 6 à 12 ans) : ni sang, ni crocs, ni squelette. **Aucun
  texte** dans une image, sauf ceux des originaux, demandés à l'identique dans la consigne :
  titre « LeapMultix » de l'image des héros, calculs des logos des modes, titres des logos
  d'Arcade.
- **Le propriétaire valide la planche** avant l'intégration ; une image ratée se refait seule.
- **Rien de nouveau n'est dit à voix haute** : un message parlé ajouté se réenregistre (payant,
  skill `generating-voice-clips`). Le message « Thème … appliqué ! » est muet.
- **Un thème ne change que des jetons** (DESIGN.md) ; `tests-esm/theme-contrast.esm.test.mjs`
  doit rester vert (texte 4,5:1, focus et contours 3:1).
- **Noms neufs** : la prod sert les images 30 jours sans les revérifier ; une image costumée
  porte toujours le suffixe de sa fête.

## Procédure (copier la liste et la cocher)

```
- [ ] 1. Dates, thèmes et costumes validés par le propriétaire
- [ ] 2. Entrée dans SEASONS (js/core/seasons.js)
- [ ] 3. Consignes des images (scripts/seasons/<fête>/prompts.tsv)
- [ ] 4. Images dessinées par Codex, recolorations, planche validée
- [ ] 5. Fonds WebP, variantes, liste hors ligne
- [ ] 6. Deux palettes et leurs boutons, textes fr, en, es
- [ ] 7. Tests adaptés à la fête, batterie, Chrome
- [ ] 8. APP_VERSION, commit, PR, analyseurs
```

### 1. Dates, thèmes, costumes

Demander au propriétaire : premier et dernier jour (inclus), noms des deux thèmes (clair,
sombre) dans les trois langues, un costume par personnage. Un costume se reconnaît sur une
vignette de 56 px : un grand accessoire de forme simple (chapeau, capuche, col, casque peint),
le même sur la tête, le corps, les fusées et le fond. Halloween 2026 : chapeau de sorcier violet
(renard), capuche-citrouille (panda), diadème de citrouilles et cape (licorne), cape de vampire
(dragon), casque peint en citrouille (astronaute). Noël 2026 : bonnet de Père Noël (renard),
serre-tête de bois de renne (panda), couronne de houx et cape rouge (licorne), bonnet de lutin
à grelot (dragon), casque peint en boule de sapin (astronaute).

### 2. Registre

Une entrée par fête, `themes: { light, dark }` en identifiants sans tiret (classes
`theme-<id>`, clés `color_theme_<id>`), `costumes` limité à ce qui sera vraiment dessiné : une
famille absente garde ses images classiques. Ajouter aussi l'identifiant à `SEASON_IDS` de
`sw.js` (test) : hors ligne, le service worker sert l'image classique à la place d'une image
costumée jamais gardée (`classicPath`), sans requête en échec.

### 3. Consignes

Copier `scripts/seasons/halloween/prompts.tsv` : une ligne par image (cible, références, format,
consigne). La clause de style commune (`scripts/seasons/style.txt`) est ajoutée à chaque
consigne, mot pour mot. Noms des cibles :

- `assets/images/arcade/<avatar>_<fête>.png` (corps) puis
  `assets/images/arcade/<avatar>_<fête>_head_avatar.png` (tête, avec le corps costumé en
  seconde référence pour que l'accessoire soit le même) ;
- `assets/social/leapmultix-social-card-<fête>.webp` (héros, les cinq têtes costumées en références) ;
- `img/background_<avatar>_<fête>_001.png` à `_00<worlds>` (fonds, réf. : **un fond d'origine
  différent pour chacun** + le corps costumé ; consigne « le même lieu que la 1re image ») :
  en thème ordinaire, chaque avatar a 11 à 17 fonds tirés d'une session à l'autre, la fête en
  garde plusieurs (Halloween : 4) ;
- `assets/images/arcade/<fusée>_<fête>.png` pour les dix fusées pilotées (réf. : la fusée
  d'origine + la tête costumée) ;
- `assets/images/arcade/monstre<NN>_right_<fête>.png` pour les 155 monstres (réf. : le monstre
  d'origine seul, au format de sa source, `carre-transparent` ou `portrait-transparent`) :
  « habille-le, ne le redessine pas », un accessoire de la fête par monstre, varié d'un monstre
  à l'autre (Noël : bonnet de Père Noël, de lutin, bois de renne, couronne de houx, cache-oreilles
  et écharpe, guirlande lumineuse, cadeau ou boule tenus) ;
- `assets/images/arcade/logo_mode_<mode>_<fête>.png` pour les six logos des modes (réf. : le
  logo d'origine ; Chrono prend aussi le corps costumé du renard). Les cartes de calcul et le
  « ? » des logos sont à garder, écrits dans la consigne (« 7×8 », « 6×9 »…) ;
- `assets/images/arcade/logo_multi<jeu>_<fête>.png` pour les quatre logos des jeux d'Arcade
  (réf. : le logo d'origine + les héros costumés qu'il montre) : leur titre (« MULTI
  INVADERS »…) est le seul texte, à garder tel quel, écrit dans la consigne ;
- `assets/images/arcade/snake_apple_<fête>.png`, la nourriture du serpent, et
  `assets/images/arcade/multimiam_reponse_<fête>.png`, l'image posée sous les réponses de
  MultiMiam (hors fête, une pastille dessinée par le jeu) : un nombre blanc cerné de noir
  s'écrit dessus, d'où un centre uni assez foncé. Halloween : une citrouille et un bonbon
  violet couché, dont le corps fait 55 % de la largeur et 30 % de la hauteur du cadre
  (`drawAnswerToken` de `js/multimiam-renderer.js` règle sa taille là-dessus) ;
- les morceaux du serpent, l'herbe et les murs ne se dessinent pas : étape 4.

Ces dossiers sont imposés : `js/webp-images.js` et le catalogue d'Arcade ne lisent que
`assets/images/arcade/`, et `scripts/convert-backgrounds.cjs` ne lit que `img/` à plat.

### 4. Dessin par Codex

`bash scripts/seasons/dress-up.sh <fête>`, lancé **en tâche de fond** (une à deux minutes par
image). Le script est reprenable (il saute une cible conforme), contrôle taille et transparence,
écrit son journal et la planche dans `analysis/seasons/<fête>/`. À court de quota, il lit l'heure
de reprise dans le refus de Codex (« try again at 2:20 AM »), sinon dans le journal des sessions
(`~/.codex/sessions`, `rate_limits`), attend, puis reprend : consigne du propriétaire, on continue
dès que le quota revient. Refaire une image : `bash scripts/seasons/dress-up.sh <fête> <cible>`.

Recolorations : `bash scripts/seasons/recolor.sh <fête>` lit
`scripts/seasons/<fête>/recolor.tsv` (source, méthode, réglage) et écrit `<source>_<fête>.png`
à la même taille, pour ce qui doit se raccorder case à case et qu'un dessin refait ne
garantirait pas : les 14 morceaux du serpent (méthode `serpent`, seuls les verts tournent ;
Halloween : `190 68`, dos violet, ventre orangé, yeux et langue gardés), l'herbe de MultiSnake
et les murs de MultiMiam (méthode `teinte`, `-modulate` sur toute l'image). Le chemin de
MultiMiam reste classique : orange, il effaçait le renard qui court dessus. Un couvre-chef sur
le serpent (Noël : le bonnet du logo, demandé par le propriétaire en jouant) : dessiné seul par
Codex (`scripts/seasons/<fête>/bonnet.png`), posé par la méthode `bonnet` sur l'arrière de la
tête de droite, dans la case, puis reporté sur les trois autres têtes par `comme` (elles sont
cette même image retournée ou tournée, ce que le script vérifie au pixel près).

Relire la planche, dans l'ordre de la liste : personnage reconnaissable, même côté que
l'original (les sprites d'Arcade se retournent selon `facing`), accessoire lisible en petit,
fond transparent sans halo, aucun texte parasite, calculs des logos intacts, rien d'effrayant.
Puis la montrer au propriétaire, avec MultiSnake et MultiMiam en jeu.

### 5. Variantes et hors ligne

`npm run assets:backgrounds` (WebP des fonds, versionnés), `npm run assets:generate` (variantes
de toutes les images d'`assets/images/arcade/` ; `seasonalSpriteSpecs()` du catalogue, tirée
des familles de la fête, donne 512 et 1024 aux corps, fusées, textures et réponses),
`npm run precache:update` : aucune image de fête ne doit y entrer (test).

### 6. Palettes, boutons, textes

`css/themes.css` : `.theme-<clair>` après les thèmes clairs, `.theme-<sombre>` dans le bloc
commun des thèmes sombres (`.theme-blue, .theme-dark, …`) puis son propre bloc. `index.html` :
deux boutons `hidden` en tête de `.color-theme-selector`. Textes `color_theme_<id>` en fr, en,
es (`npm run i18n:compare`).

### 7. Tests et vérification

Deux tests parcourent tout le registre et disent ce qui manque à une fête ajoutée, sans rien
y écrire de neuf :

- `tests-esm/core/seasons-registry.esm.test.mjs` : dates valides, aucun chevauchement avec
  une autre fête (chaque jour d'une année bissextile), pour chaque thème sa palette
  (`.theme-<id> {`, le sombre dans le bloc commun des thèmes sombres), son bouton `hidden` et
  son nom en fr, en, es, l'identifiant dans `SEASON_IDS` de `sw.js` ;
- `tests-esm/season-images.esm.test.mjs` : pour chaque famille annoncée, chaque image que
  demandent les portes du code existe (fonds de 001 à `worlds`, PNG et WebP), et rien n'est
  costumé sans fête portée.

À adapter à la main : `tests-esm/core/seasons.esm.test.mjs` (bornes, passage d'année), le test
de contraste et le test d'Halloween de `tests-esm/e2e/screen-images.test.mjs` (motif des têtes
costumées, `avatarsOf`).
Batterie complète du CLAUDE.md, puis Chrome avec `?saison=<fête>` (`?saison=aucune` pour la
retirer) : accueil (logos des modes), menu de l'Arcade (logos des jeux), « Qui joue ? »,
Personnalisation (les deux thèmes, puis un thème ordinaire), tableau de bord, une partie,
MultiMiam (murs, réponses), MultiSnake (serpent, nourriture, herbe), MultiInvaders (les deux fusées), deux sessions pour voir les fonds changer,
clavier, 390 px, contraste élevé par-dessus. Aucun test ne doit dépendre du jour : horloge
simulée (`jest.useFakeTimers({ now })`).

### 8. Mise en prod

`APP_VERSION` et `VERSION` de `sw.js` ensemble ; commits avec `helping-with-commits` ; PR et
boucle des analyseurs. Après la fusion, vérifier la version servie, puis la fête en prod.

## Pièges rencontrés (Halloween 2026)

- **Codex lit les `AGENTS.md` du dossier où on le lance** : `dress-up.sh` le fait travailler
  dans un dossier temporaire, hors du dépôt.
- **Quota** : mesuré sur les 26 images, environ 1 % de la fenêtre de 5 h et 0,5 % de la
  semaine par image, 1,5 à 3,5 min chacune (52 min en tout) : une fête tient dans une fenêtre
  neuve, pas dans une fenêtre déjà entamée à 72 %. Le refus arrive en 2 secondes et la session
  refusée écrit des fenêtres vides dans son journal (d'où la lecture de l'heure dans le message).
  La semaine compte aussi : après les 155 monstres de Noël 2026, Codex a refusé le 30/10 jusqu'au
  04/11 (journal de session à 67 % de la semaine), trop tard pour ceux d'Halloween la même
  année. Une longue liste part au moins une semaine avant la fête.
- **Ne rien modifier pendant une génération** : la boucle lit la liste qu'elle a ouverte au
  départ (un `sed -i` sur `prompts.tsv` n'y est pas vu), et bash lit son script au fil de
  l'exécution (le modifier peut casser la suite). Attendre la fin, puis relancer : les cibles
  conformes sont sautées et la planche est refaite.
- **Accessoire trop petit** au premier essai (chapeau illisible à 56 px) : le demander grand.
- **Oubliés au premier passage**, vus par le propriétaire en jouant : les logos des six modes
  et des quatre jeux d'Arcade (accueil et menu restaient classiques sous un thème de fête), le
  serpent, ses pommes et son herbe, le labyrinthe de MultiMiam, et un seul fond par avatar là
  où le thème ordinaire en fait alterner plusieurs. D'où les familles `logos`, `snake` et
  `miam`, et `worlds`. Avant la planche, faire le tour des écrans : tout ce qui est dessiné
  (pas une icône) a sa version de fête, ou une raison écrite de ne pas l'avoir (fusées sans
  pilote, vidéos d'intro). Les 155 monstres de l'Arcade sont venus à Noël 2026 (`monsters`).
- **Serpent** : 14 morceaux qui se raccordent case à case et une tête par direction, dessinés
  séparément. Un dessin refait ne garantit ni les raccords ni la taille : recoloration
  (`recolor.sh`). Un chapeau se pose sur la tête sans dépasser la case (méthode `bonnet`).
- **Image propre à la fête, sans image classique** (bonbon des réponses de MultiMiam) : hors
  ligne, le service worker n'a rien à servir à sa place. Il répond 404 (`classicImage` de
  `sw.js`), pas une erreur réseau, et le jeu garde son dessin (la pastille) ; vu par
  `tests-esm/e2e/offline-pwa.test.mjs`, lancé pendant la fête.
- **Cimetière de MultiMiam écarté** (idée du propriétaire, « peut-être trop hardcore ») : le
  renard y aurait mangé des tombes, image de la mort pour des enfants de 6 ans. À la place,
  des bonbons, dans l'esprit de « Miam » et de « des bonbons ou un sort ».
- **Un nom de PNG ajouté dans le code entre au préchargement** (`precache-list.mjs` lit les
  noms écrits en clair) : `logo_mode_arcade.png`, nommé par `js/logos.js`, y est entré,
  variantes de 256 px au plus, voulu. Jamais un nom d'image de fête : `isSeasonalImage` les
  écarte.
- **Fidélité** : avec le dessin d'origine en première référence et la consigne d'habiller sans
  redessiner, Codex a gardé visage, pose et côté des cinq personnages, la silhouette des dix
  fusées, les calculs des logos des modes et le titre des logos d'Arcade, écrits dans la
  consigne ; aucune image d'Halloween 2026 n'a été refaite.
- **Deux générations à la fois** : pour ne pas attendre la fin d'une liste, une liste à part
  (`scripts/seasons/<fête>-<lot>/prompts.tsv`, lancée comme une fête) tourne en parallèle sans
  gêner l'autre ; la verser ensuite dans la liste de la fête et effacer le dossier. Noël
  2026 : un lot par personnage (corps puis tête), puis, lancés chacun dès que la référence
  attendue apparaît dans le journal (« fait : … »), un lot de fonds et un lot de fusées par
  personnage : 53 images en 15 minutes, environ 1 % de la fenêtre de 5 h chacune. Monstres :
  huit lots d'une vingtaine (`scripts/seasons/christmas-monstres<N>/`), 155 images sans un
  échec, sur deux fenêtres de 5 h et environ 25 % de la semaine ; tailles comparées aux
  originaux (boîte des pixels opaques) avant de les verser.
- **Planche faite à la main** : jamais `ls … | xargs montage … <sortie>`. xargs place les
  fichiers après la sortie : le dernier devient la sortie de montage et il est écrasé par la
  planche (Noël 2026 : une fusée à redessiner). Passer la liste avant la sortie
  (`montage $(ls …) … <sortie>`).
- **Couleurs à croiser** : la recoloration du serpent et la nourriture se voient ensemble, les
  murs et les réponses de MultiMiam aussi. Noël : serpent rouge, donc nourriture d'une autre
  couleur ; papillotes rouges, donc murs vert sapin.
- **Variantes** : `assets/generated-images/` n'étant pas versionné, un worktree neuf les refait
  toutes avec `npm run assets:generate` (plus de 10 min, en tâche de fond).
  `npm run assets:backgrounds` reconvertit tous les fonds, mais les WebP classiques en sortent
  identiques à l'octet (seuls les nouveaux apparaissent dans `git status`). Une image refaite
  sous le même nom refait ses variantes : le générateur compare les dates. Avant Noël 2026, il
  gardait celles du premier dessin, et les têtes du serpent restaient sans bonnet en jeu.
- **Ordre d'initialisation** : `initThemes()` passe en tête de `runInit()` (`js/core/mainInit.js`)
  pour que le costume soit porté avant que le fond et les têtes ne se posent.
- **Tests à la date du jour** : un test qui appelle `initThemes()` sans horloge simulée change
  de résultat pendant la fête.
- **Bout en bout qui lit les noms d'images** (`tests-esm/e2e/screen-images.test.mjs`) : sauté
  sans `assets/generated-images/`, il n'a échoué qu'une fois les variantes produites, pendant
  la fête (têtes `fox_halloween_head_avatar-…` là où il attendait `fox_head_avatar-…`). Il
  ouvre le jeu en `?saison=aucune` et a un test qui force la fête : faire de même pour tout
  test qui reconnaît une image à son nom. Une famille de plus en touche d'autres : avec le
  serpent costumé, `arcade-screen`, `arcade-density` et `arcade-mobile` attendaient
  `tete_haut.png` ; eux, `arcade-sharpness` et `image-requests` s'ouvrent désormais hors fête.
  Pour une famille ajoutée, chercher son nom dans `tests-esm/e2e/`. Lancer la batterie
  **après** `npm run assets:generate`, pendant les dates de la fête ou avec `?saison=`.

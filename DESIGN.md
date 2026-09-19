---
name: LeapMultix
description: Un vrai jeu de calcul pour les 6–12 ans, calme et lisible, où les personnages portent le caractère.
colors:
  page: 'oklch(93% 0.02 235deg)'
  surface: 'oklch(99.5% 0.001 248deg)'
  surface-sunken: 'oklch(96.5% 0.008 248deg)'
  border: 'oklch(88.5% 0.014 248deg)'
  border-strong: 'oklch(64% 0.02 248deg)'
  ink: 'oklch(29% 0.03 248deg)'
  ink-muted: 'oklch(49% 0.025 248deg)'
  ink-heading: 'oklch(42% 0.106 245deg)'
  action: 'oklch(52% 0.131 245deg)'
  action-hover: 'oklch(47% 0.117 245deg)'
  action-edge: 'oklch(38% 0.095 245deg)'
  action-ink: 'oklch(47% 0.118 245deg)'
  action-tint: 'oklch(94.5% 0.027 245deg)'
  on-action: 'oklch(100% 0 0deg)'
  focus: 'oklch(58% 0.156 245deg)'
  success-tint: 'oklch(95.5% 0.045 155deg)'
  success-edge: 'oklch(60% 0.15 152deg)'
  success-ink: 'oklch(44% 0.11 152deg)'
  danger-tint: 'oklch(95.5% 0.021 25deg)'
  danger-edge: 'oklch(62% 0.17 27deg)'
  danger-ink: 'oklch(50% 0.17 27deg)'
  warning-tint: 'oklch(96% 0.042 85deg)'
  warning-edge: 'oklch(66% 0.14 72deg)'
  warning-ink: 'oklch(46% 0.1 70deg)'
  reward: 'oklch(84% 0.16 88deg)'
  reward-edge: 'oklch(62% 0.13 70deg)'
typography:
  display:
    fontFamily: "Baloo2, 'LeapMultix Lecture', system-ui, sans-serif"
    fontSize: '3rem'
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Baloo2, 'LeapMultix Lecture', system-ui, sans-serif"
    fontSize: '2.25rem'
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Baloo2, 'LeapMultix Lecture', system-ui, sans-serif"
    fontSize: '1.75rem'
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "'LeapMultix Lecture', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'LeapMultix Lecture', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '1rem'
    fontWeight: 700
    lineHeight: 1.2
rounded:
  sm: '8px'
  md: '14px'
  lg: '20px'
  pill: '999px'
spacing:
  '1': '4px'
  '2': '8px'
  '3': '12px'
  '4': '16px'
  '5': '24px'
  '6': '32px'
  '7': '48px'
  '8': '64px'
components:
  button-primary:
    backgroundColor: '{colors.action}'
    textColor: '{colors.on-action}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '0.7em 1.3em'
    height: '48px'
  button-primary-hover:
    backgroundColor: '{colors.action-hover}'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.action-ink}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '0.7em 1.3em'
    height: '48px'
  button-secondary-hover:
    backgroundColor: '{colors.action-tint}'
  button-quiet:
    textColor: '{colors.action-ink}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: 'clamp(16px, 4vw, 32px)'
  tile:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: '16px 12px 12px'
  tile-correct:
    backgroundColor: '{colors.success-tint}'
    textColor: '{colors.success-ink}'
  tile-selected:
    backgroundColor: '{colors.action-tint}'
    textColor: '{colors.ink}'
  input:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.md}'
    height: '48px'
  segment:
    backgroundColor: '{colors.surface-sunken}'
    textColor: '{colors.ink-muted}'
    rounded: '{rounded.sm}'
    height: '44px'
  segment-active:
    backgroundColor: '{colors.action}'
    textColor: '{colors.on-action}'
---

# Design System: LeapMultix

## 1. Overview

**Creative North Star: « La scène des personnages »**

L'interface est une scène calme et bien éclairée ; les personnages (panda, renard, licorne, dragon, astronaute) et leurs mondes illustrés sont les acteurs. Tout ce qui entoure la question (cartes, boutons, barres) est plein, net et silencieux, pour que l'enfant regarde le calcul et son personnage, rien d'autre. Le jeu se sent dans les mains : chaque élément pressable est une touche avec une tranche qui s'enfonce, chaque réponse donne un retour immédiat, sobre et bienveillant.

Le système refuse explicitement les quatre anti-références de PRODUCT.md : le « bonbon » générique IA, l'appli ludo-éducative criarde, le cahier d'exercices scolaire et le jeu mobile manipulateur. Il se tient entre les deux pentes : assez joyeux pour qu'un enfant de 6 ans ait envie de jouer, assez sobre pour qu'un élève de 6e ne le trouve pas bébé. La couleur vive vient des illustrations ; l'interface garde une seule couleur d'action (le bleu du thème Classique), des neutres teintés et des couleurs d'état réservées à leur sens.

Densité : généreuse. Cibles tactiles de 44 px minimum, tuiles de réponse de 56 px et plus, texte de 16 px minimum, une seule surface (la carte) par écran. Les thèmes Nature, Orangé, Spatial et Nuit ne redéfinissent que les jetons : aucun composant n'a de règle propre à un thème.

**Key Characteristics:**

- Une surface pleine par écran, posée sur l'illustration ; jamais de carte dans la carte.
- Des touches franches : tranche de 4 px de leur propre teinte, qui s'enfonce à l'appui.
- Encre contrastée partout (WCAG 2.1 AA vérifié pour chaque thème).
- Deux familles de caractères : Baloo 2 pour les titres et les nombres, LeapMultix Lecture (Andika) pour tout ce qui se lit.
- Mouvement court (120 à 320 ms), en décélération, uniquement pour un changement d'état.
- Pendant une partie, l'illustration de fond se retire derrière un voile.

## 2. Colors: La palette de la scène

Des neutres légèrement teintés vers le bleu du thème, une seule couleur d'action, et des couleurs d'état qui ne servent qu'à leur sens.

### Primary

- **Bleu d'action** (oklch(52% 0.131 245deg)) : boutons primaires, option sélectionnée, segment actif. Le blanc posé dessus atteint 5,5:1. Sa tranche est le **bleu profond** (oklch(38% 0.095 245deg)), son survol le **bleu appuyé** (oklch(47% 0.117 245deg)).
- **Encre d'action** (oklch(47% 0.118 245deg)) : liens, texte des boutons secondaires et discrets. 6,7:1 sur la surface.
- **Voile d'action** (oklch(94.5% 0.027 245deg)) : fond d'un élément choisi ou survolé ; le texte y reste à l'encre normale.

### Neutral

- **Surface** (oklch(99.5% 0.001 248deg)) : la carte de chaque écran, les tuiles, les champs.
- **Surface creusée** (oklch(96.5% 0.008 248deg)) : zone de question, sélecteurs segmentés, encadrés internes (sans ombre).
- **Page** (oklch(93% 0.02 235deg)) : repli sous l'illustration tant qu'elle n'est pas chargée.
- **Encre** (oklch(29% 0.03 248deg)) : tout le texte courant (13,8:1).
- **Encre atténuée** (oklch(49% 0.025 248deg)) : descriptions et mentions secondaires (6,1:1) ; jamais plus pâle.
- **Encre des titres** (oklch(42% 0.106 245deg)) : titres Baloo 2 (8,3:1).
- **Filet** (oklch(88.5% 0.014 248deg)) et **contour** (oklch(64% 0.02 248deg)) : séparations internes ; le contour (3,3:1) délimite les champs et la tranche des tuiles neutres.
- **Voile de jeu** (oklch(96.5% 0.008 248deg / 0.8)) : posé sur l'illustration pendant une partie. **Voile de fenêtre** (oklch(20% 0.02 250deg / 0.55)) : derrière la vidéo, la fenêtre des tables et la vérification parentale.

### Tertiary

- **Succès** : voile (oklch(95.5% 0.045 155deg)), contour (oklch(60% 0.15 152deg)), encre (oklch(44% 0.11 152deg)). La bonne réponse, toujours accompagnée d'une coche.
- **Attention** : voile (oklch(95.5% 0.021 25deg)), contour (oklch(62% 0.17 27deg)), encre (oklch(50% 0.17 27deg)). Actions destructives uniquement (supprimer un profil), jamais une erreur de calcul.
- **Avertissement** : voile (oklch(96% 0.042 85deg)), contour (oklch(66% 0.14 72deg)), encre (oklch(46% 0.1 70deg)). Chrono presque écoulé, indices et mémos.
- **Récompense** (oklch(84% 0.16 88deg), contour oklch(62% 0.13 70deg)) : étoiles et pièces, en remplissage seulement.

### Named Rules

**La règle de l'encre.** Aucun texte n'est écrit dans une couleur de surface ou de récompense : ni jaune, ni rose, ni bleu clair, ni blanc sur fond clair. Chaque texte atteint 4,5:1 (3:1 au-delà de 24 px).

**La règle du sens.** Le vert veut dire « juste », l'orangé « attention au temps », le rouge « action destructive ». Une erreur de l'enfant n'est jamais rouge.

**La règle des thèmes.** Un thème ne change que des jetons. Si un composant a besoin d'une règle `.theme-xxx`, c'est qu'il n'utilise pas les jetons.

## 3. Typography

**Display Font:** Baloo 2 (repli : LeapMultix Lecture, system-ui)
**Body Font:** LeapMultix Lecture, dérivée d'Andika de SIL International (repli : system-ui, -apple-system, Segoe UI)

**Character:** Baloo 2 donne la voix du jeu, ronde et franche, sur les titres, les noms de modes et les nombres. Andika est une police d'apprentissage de la lecture : « a » et « g » scolaires, l, I et 1 distincts, b, d, p et q qui ne sont pas des miroirs. Un enfant de CP y reconnaît les lettres de sa classe.

### Hierarchy

- **Display** (700, 3rem, 1.2) : le calcul de la question (« 7 × 8 = ? »).
- **Headline** (700, 2.25rem, 1.2) : titre d'écran (« Qui joue ? »).
- **Title** (700, 1.75rem, 1.2) : titre de section (« Choisis ton mode de jeu ») ; 1.375rem pour les sous-sections, 1.125rem pour les noms de modes.
- **Body** (400, 1rem, 1.5) : consignes, descriptions, explications ; 70 caractères par ligne au plus.
- **Label** (700, 1rem, 1.2) : boutons, onglets, libellés de champs ; 0.875rem pour les mentions secondaires.

Les tailles sont en rem : le réglage « Taille du texte » (petit 87,5 %, grand 112,5 %) agrandit toute l'échelle.

### Named Rules

**La règle des deux familles.** Baloo 2 pour ce qu'on regarde (titres, nombres), LeapMultix Lecture pour ce qu'on lit (phrases, boutons, libellés). Aucune troisième police.

**La règle de la typographie française.** Espace insécable avant « : ; ! ? » et à l'intérieur des guillemets « ». Majuscule en début de libellé seulement (« Tableau de bord »).

## 4. Elevation

Un seul niveau de profondeur par écran : la carte, posée sur l'illustration avec une ombre neutre diffuse. À l'intérieur de la carte, tout est à plat : les groupes se distinguent par l'espace, un filet ou une surface creusée. Les touches ne flottent pas : leur relief est une tranche pleine, pas une ombre.

### Shadow Vocabulary

- **Ombre de carte** (`box-shadow: 0 2px 6px oklch(25% 0.03 250deg / 0.08), 0 18px 44px oklch(25% 0.03 250deg / 0.18)`) : la carte de contenu et les fenêtres.
- **Ombre de barre** (`box-shadow: 0 1px 3px oklch(25% 0.03 250deg / 0.08), 0 6px 16px oklch(25% 0.03 250deg / 0.1)`) : barre du haut, toasts, menus.
- **Ombre légère** (`box-shadow: 0 1px 2px oklch(25% 0.03 250deg / 0.1)`) : bulle de la mascotte, badges.
- **Tranche de touche** (`box-shadow: 0 4px 0 <teinte profonde>`) : boutons et tuiles pressables ; disparaît à l'appui (translateY de 4 px).

### Named Rules

**La règle de la carte unique.** Une carte ne contient jamais une autre carte. Si un groupe a besoin de se détacher, il prend la surface creusée, sans ombre ni bordure épaisse.

**La règle des ombres neutres.** Les ombres sont grises, teintées du bleu de l'encre. Une ombre colorée ou lumineuse est interdite.

## 5. Components

### Buttons

- **Shape :** coins doucement arrondis (14 px), hauteur de 48 px minimum.
- **Primaire :** fond bleu d'action, texte blanc en Lecture 700, tranche bleu profond de 4 px ; padding 0,7em × 1,3em.
- **Survol / focus :** le fond fonce ; le focus clavier ajoute un anneau de 3 px (oklch(58% 0.156 245deg)) décalé de 3 px, jamais retiré.
- **Appui :** la touche descend de 4 px et sa tranche disparaît (120 ms, décélération).
- **Secondaire :** surface, contour de 2 px, encre d'action, tranche du contour ; survol en voile d'action.
- **Discret :** texte souligné à l'encre d'action, sans fond ni tranche ; combiné à l'encre d'attention pour une action destructive (« Supprimer »), jamais en gros bouton rouge.

### Tiles (modes, réponses, tables)

- **Style :** surface, bordure de 2 px en filet, rayon de 20 px, tranche neutre de 4 px.
- **Survol :** seule la bordure passe au bleu d'action ; la tuile ne se remplit jamais (le texte reste lisible).
- **Réponse juste :** voile succès, contour succès, encre succès, et une coche ✓ ; jamais la couleur seule.
- **Choix de l'enfant, s'il est faux :** la tuile reste enfoncée (sans tranche), fond creusé, encre normale.

### Cards / Containers

- **Corner Style :** 20 px.
- **Background :** surface.
- **Shadow Strategy :** ombre de carte (voir Elevation).
- **Border :** filet de 1 px.
- **Internal Padding :** de 16 à 32 px selon la largeur.

### Inputs / Fields

- **Style :** surface, contour de 2 px (3,3:1), rayon de 14 px, 48 px de haut, texte de 18 px (évite le zoom d'iOS).
- **Focus :** anneau de focus de 3 px.
- **Erreur :** message calme sous le champ, à l'encre normale, relié par `aria-describedby`.

### Navigation

- **Barre du haut :** surface pleine, ombre de barre ; icônes SVG au trait de 2 px (24 px) dans des cibles de 44 px, chacune nommée pour les lecteurs d'écran.
- **Langues :** contrôle segmenté « FR · EN · ES », la langue active pleine (`aria-pressed`).
- **Mobile :** menu repliable où chaque icône affiche aussi son libellé.

### Sélecteur segmenté (opération, langue)

- **Style :** fond creusé, segments de 48 px (opérations) et 44 px (langues) ; segment actif en bleu d'action avec texte blanc et coche.
- **Désactivé :** encre atténuée (5,6:1) et icône désaturée, jamais un gris illisible.

### Mascotte et bulle

- **Style :** visage de l'avatar (72 px) et bulle en surface avec filet, pointe tournée vers la mascotte ; une seule ligne de texte, à l'encre.

## 6. Do's and Don'ts

### Do:

- **Do** poser chaque écran sur une seule carte pleine et laisser l'illustration visible autour.
- **Do** utiliser uniquement les jetons de `css/themes.css` (`--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--ease-*`, `--dur-*`, `--text-*`).
- **Do** marquer la bonne réponse avec le vert de succès et une coche, et laisser l'explication affichée jusqu'à ce que l'enfant appuie sur « Continuer ».
- **Do** garder des animations de 120 à 320 ms en décélération (`--ease-out`), pour un changement d'état seulement, avec leur équivalent en `prefers-reduced-motion`.
- **Do** écrire « Presque ! » plutôt que « Incorrect ! » : une erreur est une étape, pas une sanction.
- **Do** vérifier chaque écran en Classique et en Nuit, et en contraste élevé.

### Don't:

- **Don't** retomber dans le « bonbon » générique IA : fond crème, dégradés pastel, ombres colorées, blobs et rebonds partout.
- **Don't** faire l'appli ludo-éducative criarde : pièces, confettis et récompenses qui clignotent en permanence.
- **Don't** faire le cahier d'exercices scolaire : austère, fait de fiches et de consignes, sans plaisir de jeu.
- **Don't** faire le jeu mobile manipulateur : séries à ne pas casser, culpabilisation, mécanismes addictifs.
- **Don't** utiliser de courbe à rebond ou élastique, ni d'animation infinie décorative (mascotte qui rebondit, pulsation, clignotement).
- **Don't** mettre une bordure latérale colorée de plus de 1 px, un texte en dégradé, du glassmorphism ou un sur-titre en capitales au-dessus des sections.
- **Don't** afficher un gros chiffre décoratif avec une petite étiquette : un résultat s'écrit en phrase (« 7 bonnes réponses sur 10 »).
- **Don't** utiliser un émoji comme icône d'interface : les icônes sont des SVG au trait, nommés pour les lecteurs d'écran.
- **Don't** écrire du texte en jaune, rose ou bleu clair, ni du blanc sur un fond clair.
- **Don't** ajouter une troisième police ni un `z-index` arbitraire (utiliser `--z-*`).

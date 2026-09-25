# À faire

## Accessibilité : revue WCAG complète (à planifier)

L'application vise la conformité WCAG. Des briques existent déjà — jetons de
couleur vérifiés en contraste AA, thème « contraste élevé », trois tailles de
texte, navigation clavier, `prefers-reduced-motion`, libellés traduits pour les
lecteurs d'écran — mais aucune revue d'ensemble n'a été menée critère par
critère.

À instruire avant de coder (passage par `/plan`) :

1. **Cadrer le niveau visé** : WCAG 2.2, niveau AA, et décider ce qu'on retient
   de AAA (contraste 7:1, cible 44 px partout, aide contextuelle).
2. **Auditer les 4 principes** sur chaque écran (accueil, 5 modes, arcade,
   tableau de bord, personnalisation, pages statiques) : perceptible,
   utilisable, compréhensible, robuste.
3. **Mesurer**, pas supposer : axe-core ou Lighthouse en plus de la revue
   manuelle au clavier et au lecteur d'écran.
4. **Proposer les réglages manquants**, par besoin plutôt que par étiquette :
   - vision : contraste renforcé, thème monochrome, taille de texte au-delà de
     « grand », désactivation des fonds illustrés derrière le texte ;
   - daltonisme : ne jamais faire porter une information par la seule couleur
     (déjà le cas pour les réponses, à vérifier partout) ;
   - motricité : cibles plus larges, temps de réponse allongé ou sans limite
     dans les modes chronométrés, pas de geste obligatoire ;
   - cognition : mode « calme » (moins d'animation, moins de sons, moins
     d'éléments à l'écran), consignes plus courtes ;
   - audition : rien d'essentiel porté par le seul son.
5. **Décider ce qui devient un thème** et ce qui devient un réglage à part, puis
   où ces réglages vivent (écran Personnalisation, profil, ou les deux).

## Voix enregistrée : skill de génération (fait, à éprouver)

Le skill `.claude/skills/generating-voice-clips/` porte la procédure (estimation, portes,
génération, contrôles, sauvegarde, publication, ouverture, coupe-circuit, nouvelle langue),
écrit d'après la documentation officielle des skills et relu (`plugin-dev:skill-reviewer`).
Local seulement : il touche une clé privée et un dépôt privé.

Reste à faire : l'éprouver sur une vraie session (génération de l'anglais ou de l'espagnol),
puis, s'il se déclenche mal ou saute une étape, lui écrire des évaluations
(`claude plugin eval`, voir la documentation des plugins).

## Voix enregistrée : essayer le TTS de Mistral (à instruire)

Idée du 25/09 : le TTS de Mistral coûterait sans doute moins cher qu'ElevenLabs,
par exemple pour une voix masculine ou pour une autre langue. À comparer avant la
prochaine génération :

1. **Prix** par caractère (le français seul fait environ 222 000 caractères, voir
   `npm run voice:corpus`) et limites de l'API (débit, concurrence).
2. **Qualité** sur un échantillon du corpus en fr, en et es : questions
   (« Combien font 7 fois 8 ? »), formes féminines (« une fois 7 », « vingt et une
   pommes »), énoncés longs ; même banc d'écoute et même contrôle Whisper que pour
   Lucie.
3. **Voix disponibles** (masculine, par langue) et **licence** de l'audio généré.
4. **Branchement** : `scripts/voice/generate.mjs` sépare le fournisseur du reste
   (corpus, texte dit, traitement ffmpeg, idempotence) ; un fournisseur de plus
   s'ajoute sans toucher au reste, avec sa voix dans `scripts/voice/voices.json`.

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

## Voix enregistrée : Mistral pour l'anglais (fait le 26/09)

Le TTS de Mistral (Voxtral, `voxtral-mini-tts-2603`) a été retenu pour l'anglais.

- **Prix** : 16 $ le million de caractères, environ 3,40 $ pour l'anglais.
- **Banc** : 0 doute de Whisper sur 72 clips.
- **Voix** : Jane - Neutral.
- **Branchement** : fournisseur `scripts/voice/providers/mistral.mjs`, dans la même chaîne que
  Lucie. Voir `docs/voix-enregistree.md`.

## Voix enregistrée : l'espagnol (à décider)

Mistral n'a aucune voix espagnole prête au 26/09/2026 : Jane et Oliver en anglais
britannique, Paul en anglais américain, Marie en français. L'essai croisé du 25/09 a échoué :
Jane disait les nombres en anglais (« tengo sixteen caramelos »), et Marie gardait un accent
français marqué.

Options :

1. **Cloner une voix native** avec Voxtral, à partir de 2 à 3 s d'enregistrement d'une
   locutrice qui donne son accord explicite (règle d'usage de Mistral). Coût : environ 3,60 $
   pour les 223 758 caractères.
2. **ElevenLabs**, voix de bibliothèque espagnole : environ 123 000 crédits.
3. **Garder la voix de l'appareil** en espagnol.

Le jour où l'espagnol est publié, la mention `recorded_voice_hint` d'`es.json` doit nommer son
fournisseur. Elle dit ElevenLabs aujourd'hui, et reste invisible tant que l'espagnol n'a pas de
clips.

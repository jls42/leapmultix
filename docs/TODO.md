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

Éprouvé le 26/09/2026 sur toute la génération de l'anglais, de l'estimation à l'ouverture.
Deux leçons pour les outils de contrôle, intégrées ensuite à `voice:check` (voir le skill,
étape « Contrôles ») :

- **La borne de durée était calée sur Lucie** (0,2 s par caractère au plus) : 404 clips sains
  de Jane la dépassaient. Elle se rapporte désormais au débit médian de la voix.
- **La règle de Whisper laissait passer des défauts** : un clip aux bons nombres n'était
  signalé que sous 0,5 de ressemblance. En anglais et en espagnol, le seuil passe à 0,85 et
  un mot en trop de plus signale le clip ; les écritures de Whisper sans défaut (« watt »,
  « 18-4 », « 8 x 10 ») ne comptent plus.

Reste à faire : s'il se déclenche mal ou saute une étape, lui écrire des évaluations
(`claude plugin eval`, voir la documentation des plugins).

## Voix enregistrée : Mistral pour l'anglais (fait le 26/09)

Le TTS de Mistral (Voxtral, `voxtral-mini-tts-2603`) a été retenu pour l'anglais.

- **Prix** : 16 $ le million de caractères, environ 3,40 $ pour l'anglais.
- **Banc** : 0 doute de Whisper sur 72 clips.
- **Voix** : Jane - Neutral.
- **Branchement** : fournisseur `scripts/voice/providers/mistral.mjs`, dans la même chaîne que
  Lucie. Voir `docs/voix-enregistree.md`.
- **En ligne le 26/09/2026**, ouverte à tous et activée par défaut : 7 437 clips `jane-v1-1`,
  212 636 caractères payés (environ 3,40 $), aucun texte refusé par la modération.
- **36 clips refaits** après Whisper et l'écoute du propriétaire (deux l'ont été deux fois) :
  attaques de mot trop faibles (« Ten » entendu « hen », « Table » entendu « Pable »), un
  charabia inventé, quelques débits très lents.

## Voix enregistrée : l'espagnol (décidé le 26/09, génération à faire)

Mistral n'a aucune voix espagnole prête : ses 30 voix sont anglaises ou françaises. Au banc
des 30 voix, le propriétaire retient **Jane - Neutral**, la voix de l'anglais.

- **Nombres en lettres** : en chiffres, Jane les dit en anglais. Le texte dit espagnol les
  écrit donc tous en lettres (`scripts/voice/said-text.mjs`) : 5 phrases sur 5 justes à
  Whisper, contre 6 sur 8 en chiffres.
- **Coût** : 323 098 caractères, environ 5,17 $. Vérifier le solde Mistral avant.
- **Mention** : `es.json` nomme Mistral AI (v27), avant toute entrée `es` dans l'index.
- **Accent** : Jane est britannique ; un hispanophone l'entend. Ouvrir à tous, avec ou sans
  `--default-on`, reste au choix du propriétaire.
- **Mieux, plus tard** : cloner une voix native avec Voxtral, à partir de 2 à 3 s
  d'enregistrement d'une locutrice qui donne son accord explicite (règle d'usage de Mistral).

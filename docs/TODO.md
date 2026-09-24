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

## Voix enregistrée : un skill pour la génération (à instruire)

La génération des clips (voir `docs/voix-enregistree.md`) enchaîne des étapes
qu'il ne faut ni oublier ni inverser : portes (crédits, licence), estimation,
génération incrémentale, contrôles (fichiers, transcription Whisper locale,
écoute des formes féminines), envoi des clips, vérification en ligne, index,
invalidation, ouverture par étapes, coupe-circuit. Un skill Claude Code pourrait
porter cette procédure.

À instruire avant de coder :

1. **Lire la documentation officielle de création de skills** (Claude Code :
   structure de `SKILL.md`, description qui déclenche le skill, fichiers de
   référence, scripts fournis) et les conventions du dépôt : skills locaux dans
   `.claude/skills/`, copies dans `leapmultix-marketplace/` (voir CLAUDE.md).
2. **Décider du périmètre** : skill local seulement (il touche une clé privée et
   un dépôt privé), ou partie publiable sans secret.
3. **Écrire le skill** une fois les outils de génération en place, en
   s'appuyant sur les scripts du dépôt plutôt qu'en les recopiant ; le faire
   relire (agent `plugin-dev:skill-reviewer`).

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

## Voix enregistrée : Mistral pour l'anglais (26/09, remplacée par Sulafat, puis au choix)

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

## Voix enregistrée : Sulafat (Google Chirp 3 HD) en espagnol et en anglais (26/09)

Jane, voix anglaise, a d'abord été générée en espagnol (374 895 caractères, environ 6 $), puis
écartée à l'écoute : l'accent anglais s'entend trop. Ses clips espagnols ne sont pas publiés.

- **Bancs du 26/09** (pages d'écoute du propriétaire, mêmes phrases du corpus, dont des 11) :
  Gemini 3.8 Flash-Lite et Flash (9 voix natives castillanes de la bibliothèque Gemini, plus
  Sulafat) et Chirp 3 HD (14 voix féminines es-ES). Whisper : 129/130, 128/130 et 180/182 ; les
  seuls doutes de Chirp portent sur « Modo Quiz ». Le propriétaire retient **Sulafat en Chirp 3
  HD**, puis, après un banc anglais face à Jane, **Sulafat en anglais britannique**.
- **Prix** : 30 $ le million de caractères, mais le premier million de chaque mois est offert.
  L'espagnol (323 098 caractères) et l'anglais (211 923), refaits compris, tiennent dans un mois.
- **Clé** : une clé API classique (`AIza…`) restreinte à Cloud Text-to-Speech. Les clés liées à
  un compte de service (`AQ.…`, celles d'AI Studio) sont refusées par ce service.
- **Brut en WAV** (LINEAR16, sans perte) : le MP3 de Cloud TTS n'est qu'à 32 kb/s.
- **Mentions** : `es.json` et `en.json` nomment Google Cloud Text-to-Speech (v28).
- **Clause d'âge** : les conditions de Google interdisent d'utiliser leurs services d'IA
  générative « as part of » un site destiné aux moins de 18 ans. Le jeu n'appelle jamais Google,
  il sert des fichiers générés une fois : le propriétaire a jugé l'usage permis, en connaissance
  de cause.
- **Clips espagnols de Jane** : supprimés le 27/09 à la demande du propriétaire (jamais
  publiés ni commités).
- **README et ses 14 traductions** : à jour le 27/09. Le README sépare l'application du dépôt
  (sans voix) de l'hébergement leapmultix.jls42.org (Lucie, Sulafat) ; traductions par Gemini
  via agy (`AIPMT_PROVIDER=--use_antigravity npm run i18n:readme`, aipmt ≥ 1.15.0, quota de
  l'abonnement Google). « À propos » et la FAQ du site présentent aussi les voix.

## Voix enregistrée : choisir sa voix dans les paramètres (fait, v30)

Menu « Voix » sous la case « Voix enregistrée » (Accessibilité et contrôles), visible là où la
langue propose plusieurs voix : en anglais, Sulafat (Google) ou Jane (Mistral AI).

- **Index** : deux champs facultatifs, `provider` et `alternatives` (au plus 4 autres voix par
  langue). Un jeu d'avant la v30 les ignore et lit la voix par défaut.
- **Jeu** : choix gardé par langue, mention qui nomme le service de la voix entendue, cache hors
  ligne qui garde les clips de chaque voix annoncée, événement Plausible qui nomme la voix.
- **Outils** : `scripts/voice/alternatives.json`, `--version` sur chaque outil de la voix, et
  `voice:publish -- alternative` pour ajouter ou retirer une autre voix.
- **En ligne le 27/09/2026** : Jane ouverte à tous comme autre voix de l'anglais, après un
  essai en prod avec `?voix=test` ; Sulafat reste la voix par défaut. Les index fr, en et es
  portent leur `provider`. FAQ, À propos, page parents et README la présentent.
- Les clips `jane-v1-1` restent en ligne : ne pas les retirer du bucket.
- Diffuser les clips (dépôt ouvert, par exemple) : la sortie appartient au client chez Mistral
  (conditions commerciales, §3.1) comme chez Google (« Generated Output is Customer Data »).
  Relire les conditions propres à chaque voix avant de publier.

## Voix enregistrée : Marie (Mistral) en français, au choix du joueur (27/09)

Le propriétaire veut aussi le français chez Mistral, en autre voix : Lucie (ElevenLabs) reste la
voix par défaut.

- **Banc** : Marie - Neutral et Marie - Curious sur 22 phrases du corpus, face à Lucie. 0 doute
  de Whisper pour les deux ; le propriétaire retient **Curious** (`marie-v1-1`).
- **Génération du 27/09** : 7 437 clips, aucun refus de la modération. Whisper en signalait 133
  à la première prise (syllabe du début avalée par le modèle : « rente » pour « trente ») :
  164 nouvelles prises en 5 tours, puis deux phrases dites en lettres pour Marie seule
  (`saidOverrides`). Plus aucun clip signalé ; 225 455 caractères pour la voix et 1 690 pour
  le banc et les essais (environ 3,63 $), sous le plafond accordé de 240 000.
- **Sauvegardé** dans le dépôt privé (première prise, puis prises finales).
- **Publiée** le 27/09 (v32) : testeurs, essai en prod, puis tous ; la PR #72 la présente (FAQ,
  À propos, page parents, README).

## Voix enregistrée : Sulafat (Google) en français, au choix du joueur (27/09)

Le propriétaire veut la même voix dans les trois langues : Sulafat, déjà voix de l'anglais et de
l'espagnol, devient une autre voix du français. Lucie (ElevenLabs) reste la voix par défaut.

- **Banc d'écoute**, premier fait avec l'outil versionné (`npm run voice:bench`, skill
  `comparing-voices`) : Sulafat, Leda, Aoede et Achernar (Chirp 3 HD fr-FR) face à Lucie et
  Marie, 22 phrases du corpus, 2 552 caractères. Le propriétaire retient **Sulafat**, au choix
  (choix relu dans le stockage de la page).
- **Écoute réduite** (décision du propriétaire) : un clip que Whisper juge juste après les refaits
  n'est plus réécouté ; le propriétaire n'écoute que ce que Whisper n'a pas validé et 12 accords.
- **Génération du 27/09** : 7 437 clips, aucun échec ; trois tours de refaits (112, 53, 31
  clips), puis l'écoute du propriétaire sur 11 clips et 12 accords. Deux défauts de Sulafat,
  corrigés par 99 textes dits propres à elle : « 1 » final écrit « un », et « 2 plus » écrit
  « plusse » (elle disait « plu », ce que Whisper n'entend pas). 228 239 caractères, plus 673
  d'essais et 2 552 de banc, sous le plafond accordé de 240 000 : 0 $ (quota Google du mois).
- **Publiée** le 27/09 : testeurs, essai en prod (menu « Voix », clips lus depuis `/voice/`,
  aucune requête vers Google), puis tous.
- **Outil corrigé** : `voice:check` écartait de la liste à réécouter un clip revenu à un
  contenu déjà transcrit (même son renvoyé par Google), le croyant périmé.
- **Point ouvert, à l'arbitrage du propriétaire** : le texte dit fait dire « 9 boîtes de une
  pomme » au lieu de « d'une pomme » (accord de `said-text.mjs`, commun à toutes les voix du
  français). Le corriger change le texte dit de ces phrases, donc demande d'en refaire les clips
  pour Lucie (payant), Marie et Sulafat.

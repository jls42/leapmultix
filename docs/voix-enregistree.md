# Voix enregistrée

LeapMultix lit à voix haute les questions, les encouragements et les explications. La
synthèse du navigateur rend très différemment selon l'appareil : bonne sous Chrome
Linux, mais imposée et lente sur Android, compacte sur Mac et iPhone. La version v21
l'a donc coupée par défaut (#53).

La voix enregistrée remplace cette synthèse par des phrases pré-enregistrées, avec
repli automatique sur la voix de l'appareil. Ce document décrit le choix, ce qui est en
place et ce qui vient ensuite.

## Choix

- **Voix, une par langue et par fournisseur** :
  - **Français : « Lucie »**, ElevenLabs.
    - Voix de bibliothèque `YxrwjAKoUKULGd0g8K9Y`, avec un préavis de retrait de 730 jours ;
      modèle Eleven v3.
    - Retenue après un banc d'écoute ; un essai sur la table de 7 a été validé sur téléphone.
  - **Anglais : « Jane - Neutral »**, Mistral Voxtral TTS (`voxtral-mini-tts-2603`).
    - Voix prête `82c99ee6-f932-423f-a4a3-d403c8914b8d`, femme, anglais britannique, avec
      un préavis de retrait (`retention_notice`) de 30.
    - Retenue le 25/09/2026 après un banc de 3 variantes × 24 phrases du corpus :
      - 0 doute de Whisper ;
      - la plus nette et la plus régulière ;
      - 0,126 s par caractère sur les questions, contre 0,079 pour Lucie.
    - Mistral a été choisi pour son coût : environ 3,40 $ pour tout l'anglais.
  - **Espagnol : Jane - Neutral aussi**, décidé le 26/09/2026. Mistral n'a aucune voix
    espagnole.
    - Banc des 30 voix prêtes : le propriétaire retient Jane, les autres ne convainquent pas.
    - En chiffres, Jane dit les nombres en anglais (« 7 por 8 » : charabia pour Whisper,
      « 9 » dit « nine ») : 6 phrases sur 8 justes. En lettres (« siete por ocho »), 5 sur 5.
    - Le texte dit espagnol écrit donc **tous les nombres en lettres** (`said-text.mjs`), avec
      l'accord devant un nom (« veintiún caramelos », « veintiuna manzanas »).
    - Coût : 323 098 caractères, environ 5,17 $ (3,58 $ en chiffres).
    - Jane reste une voix britannique qui parle espagnol : un hispanophone entend l'accent.
- **Corpus fini** : le jeu ne dit qu'environ 7 400 phrases par langue. Elles sont
  toutes enregistrées à l'avance ; aucun appel à un fournisseur pendant une partie.
- **Format** : MP3 mono. Safari et iOS ne lisent l'Opus en WebM qu'à partir de 17.4
  (en partie) et 18.4.
- **Encodage** : 64 kb/s et 0,15 s de silence avant la phrase. À 48 kb/s avec 0,05 s, Whisper
  entendait mal le début du premier mot (« vingt », « huit ») : sur 17 clips qu'il entendait
  juste en brut et faux une fois traités, 0 redevenait juste ; à 64 kb/s avec 0,15 s, 11.
- **Audio hors du dépôt public** : les clips vivent dans un dépôt privé et dans un
  bucket S3 dédié, servi par CloudFront sur `/voice/*`. Les forks et le développement
  local gardent la voix de l'appareil.
- **Repli** : la voix de l'appareil reprend si un clip manque, est en erreur, est
  refusé par le navigateur, ne démarre pas en 1,5 s, ou n'est pas en cache hors ligne.

## Règle : toute phrase dite passe par les traductions

Une phrase prononcée vient toujours de `assets/translations/{fr,en,es}.json`, jamais
d'un texte écrit dans le code. Sinon elle n'a pas de clip, ou le jeu parle français au
milieu d'une partie en anglais.

- Une traduction manquante (`[clé]`) n'est jamais prononcée.
- Un texte de repli (message d'arcade non traduit, par exemple) s'affiche mais ne se
  lit pas.
- Les accords au pluriel s'écrivent dans la traduction :
  `{n, plural, one {# boîte} other {# boîtes}}` (`js/core/message-format.js`).
- Toute nouvelle phrase : les trois langues, puis le corpus, puis les clips.

## En place : les phrases et leur corpus

- **Questions** : « Combien font 7 fois 8 ? » (et non « 7 fois 8 égale ? », que
  l'oreille n'entend pas comme une question), « 7 fois combien égale 56 ? » pour la
  question à trou, l'égalité proposée lue telle quelle pour le vrai/faux.
- **Énoncés** accordés au singulier dans les trois langues (« 1 boîte de 7 pommes »).
- **Fin d'arcade** : une phrase sans le score, qui reste affiché.
- **Formes parlées et empreinte** : `js/core/spoken-text.js`. `voiceKey(texte)` est
  l'empreinte cyrb53 de la forme canonique de la phrase (NFC, apostrophes, blancs) ;
  le jeu et les scripts appellent la même fonction.
- **Corpus** : `scripts/voice/corpus.mjs` énumère, par langue, tout ce que le jeu peut
  passer à `speak()`, en important le code du jeu (opérations et leurs plages, formes
  parlées, données de l'Aventure et de la Découverte). `npm run voice:corpus` le
  résume, `node scripts/voice/corpus.mjs --list fr` en donne les phrases.
- **Verrou** : `scripts/voice/corpus.lock.json` garde, par langue, le nombre de phrases
  et leur sha256. Changer une phrase parlée fait échouer la CI tant que le verrou n'est
  pas mis à jour (`npm run voice:corpus:lock`), ce qui rappelle de régénérer les clips.
- **Tests de garde** (`tests-esm/voice/`) : verrou et empreintes uniques ; inventaire
  des appels à `speak()` ; vrais modes joués dans les trois langues, chaque phrase dite
  devant être dans le corpus.

Chiffres au moment de l'écriture : 7 437 phrases par langue ; 221 587 caractères en
français, 211 923 en anglais.

## En place : une seule file de parole

`js/speech.js` ne confie au moteur qu'une phrase à la fois, exactement celle passée à
`speak()` : plus aucun texte recollé (« Mode Quiz. Combien font… »), donc chaque phrase
dite reste une phrase du corpus.

- **Deux emplacements**, chacun avec son jeton : la phrase active, même pendant qu'un
  moteur la prépare, et une phrase en attente. Une phrase coupée ou remplacée est
  invalidée : ses événements tardifs (fin, erreur, clip arrivé trop tard) ne font rien.
- **Annonce** (`priority: 'high'`) : elle coupe tout, la dernière gagne. Une phrase
  normale arrivée pendant une annonce attend sa fin, sans la couper ; sinon elle coupe la
  phrase en cours.
- **Question en file** (`queue: true`) : après une bonne réponse, la question suivante
  attend la fin du « Bravo » ; elle est oubliée si l'enfant répond avant. Après une
  erreur, dans le Défi, la question suivante coupe la fin de l'explication.
- **Fin bornée** : au-delà d'une durée estimée d'après le texte (large : 3 s plus 200 ms
  par caractère, pour ne jamais couper une voix lente), la phrase est tenue pour finie et
  la file avance. Un son bloqué ne retient rien.
- **Arrêts** (`cancelSpeech()`) : réponse de l'enfant, « Continuer », sortie de mode,
  navigation, écran de fin d'arcade, changement de langue, voix ou son coupés, onglet
  caché. Un mode n'annonce qu'après la navigation, qui arrête l'ancien mode.
- **iPhone** : le premier geste (`click`, `touchend` ou `keydown`, jamais `pointerdown`)
  amorce la synthèse par un énoncé vide et muet ; un échec réarme le geste suivant.
- **Bip de bonne réponse** rogné à 0,25 s (le son utile durait 0,196 s sur 2 s) ; le
  « Bravo » part 0,2 s après lui, jamais par-dessus.
- **Contrat de moteur**, pour la voix enregistrée : `setSpeechEngine(moteur)` branche un
  moteur `{ start(texte, { lang, token, volume, onStarted, onEnded, onFailed,
setDeadline }) → { stop(), setVolume?() }, isAvailable?(), unlock?() }` ; la synthèse
  du navigateur (`getSynthesisEngine()`) reste le moteur par défaut et le repli. Détail en
  tête de `js/speech.js`.

## En place : le lecteur de clips

`js/voice-clips.js`, branché sur la file par `setSpeechEngine`.

- **Adresse de base** : balise `<meta name="leapmultix-voice-base">`, vide dans le dépôt ;
  `deploy.sh` y écrit `/voice/` (variable de dépôt `VOICE_BASE`, exigée par le job de
  déploiement), seule valeur acceptée. Sans elle (forks, développement), aucune requête.
  En local, `?voix=local` lit `/voice/` du serveur de développement.
- **Index** `/voice/index.json` (`js/core/voice-index.js`) : langue, voix, version,
  audience (`test` ou `all`), `defaultOn`. Lu sans cache, sa dernière copie sert hors ligne.
  `?voix=test` marque le navigateur comme testeur, `?voix=off` retire les marques.
- **Activation** (`js/core/voice-activation.js`) : la voix est disponible si la langue est
  dans l'index, ouverte à ce navigateur et que le MP3 est lisible ; la parole est active
  selon le choix du joueur (bouton de la barre du haut), sinon selon `defaultOn` ; le moteur
  est la voix enregistrée sauf si la case « Voix enregistrée » est décochée (la parole
  continue alors avec la voix de l'appareil).
- **Lecture** : un seul `<audio>`, partagé et déverrouillé au premier geste par un silence
  MP3 inclus dans le code (la CSP refuse `data:`) ; clip téléchargé par `fetch()` puis joué
  depuis une URL `blob:`, libérée à la fin. Fin bornée à la durée du clip plus 1 s.
- **Repli sur la voix de l'appareil**, phrase par phrase : clip absent (403/404, retenu pour
  la session), réponse qui n'est pas un MP3, réseau coupé, lecture refusée, erreur, ou clip
  pas démarré en 1,5 s (le téléchargement continue alors pour le cache). Plausible compte
  une fois par session chaque cause (`Voice fallback`).
- **Préchargement** : les annonces de mode et les « Bravo » dès que la voix est branchée ;
  pendant chaque question, la phrase de son erreur (« Presque ! La bonne réponse est 56. »),
  une fois le clip de la question parti pour ne pas lui prendre la bande passante. Dite à la
  réponse, elle sort du cache.
- **Première visite** (ni copie de l'index ni choix du joueur) : la décision « parole
  active ? » attend l'index, au plus 1,5 s. Les phrases demandées entre-temps attendent avec
  elle (les trois dernières), et le bouton de voix de la barre du haut reste masqué, à sa
  place, jusqu'à la décision. Au-delà, le jeu décide sans l'index (voix coupée) et se reprend
  à son arrivée.
- **iPhone** : `navigator.audioSession.type = 'playback'`. La voix enregistrée suit la
  règle des bruitages : c'est le bouton muet du jeu qui fait foi.
- **Service worker** (`sw.js`) : clips en cache d'abord dans `leapmultix-voice` (épargné
  par les changements de version), gardés seulement s'ils sont un vrai MP3 du site ; index
  en réseau d'abord ; chaque nouvel index purge les clips des versions qu'il n'annonce plus,
  plafond d'environ 2 000 clips.
- **Réglage** : case « Voix enregistrée » dans Accessibilité et contrôles, visible là où la
  voix est disponible.
- **Mention « voix de synthèse »**, dans la langue du jeu (`recorded_voice_hint`) : créée
  avec ElevenLabs en français, avec Mistral AI en anglais et en espagnol.
  - Elle doit être en ligne **avant** l'entrée de la langue dans l'index, puisque la case
    s'affiche dès que la langue y entre.
  - La page parents et le README présentent aussi les voix.
- **Plausible** : l'événement `Voice fallback` compte chaque cause de repli, une fois par
  session et par langue (`{ cause, lang }`).

## En place : l'infra

Dépôt `leapmultix-infra` (GitLab), fichier `voices.tf` :

- bucket privé `leapmultix-voices` (propriétaire imposé, accès public bloqué, versionné,
  chiffré, TLS seulement), lu par la distribution du site (OAC) sous `voice/` seulement,
  sans `s3:ListBucket` : une clé absente répond 403 ;
- deux comportements en tête : `/voice/index.json` jamais en cache à la périphérie
  (coupe-circuit immédiat), `/voice/*` au cache de l'objet (un an, immuable) ; politiques de
  cache gérées par AWS (quota de politiques personnalisées atteint) et politique d'en-têtes
  qui laisse `Cache-Control` à l'objet ;
- fonction `voice_guard` : `/voice/*` n'est servi qu'aux `fetch()` du jeu
  (`Sec-Fetch-Site: same-origin`), un frein à l'aspiration des voix, pas une protection
  absolue ; un navigateur sans cet en-tête (iOS avant 16.4) garde la voix de l'appareil ;
- `media-src 'self' blob:` dans les trois CSP.

## Génération des clips

Tout est scripté (`scripts/voice/`) et tourne sur le poste du propriétaire, jamais dans la
CI publique : les clés des fournisseurs et le dépôt privé des voix n'en sortent pas.

**Dépôt privé des voix** (`../leapmultix-voices`, GitHub privé `jls42/leapmultix-voices`) :

- `clips/<langue>/<version>/<empreinte>.mp3` : les clips traités, ceux que le jeu lit ;
- `manifests/<langue>/<version>.json` : pour chaque clip, la phrase, le texte dit, la
  durée, l'empreinte sha256, l'identifiant de requête et le coût en crédits (quand le
  fournisseur le dit). À côté :
  - `<version>.runs.jsonl` garde le bilan de chaque exécution ;
  - `<version>.billed.jsonl` inscrit chaque réponse payée dès sa réception, ce qui fait le
    total du plafond cumulé ;
- `raw/` : sorties brutes du fournisseur, gardées en local (hors git) pour retraiter sans
  payer ;
- `ecoute/` (hors git) : pages d'écoute, et dans `avant/` le dernier clip remplacé de chaque
  empreinte (`--redo`, texte dit changé), pour la comparaison avant/après.

**Voix** : `scripts/voice/voices.json` fixe, par langue, le fournisseur, la voix, le
modèle, les réglages et l'encodage, sous une version (`lucie-v3-2` en français,
`jane-v1-1` en anglais).

- Changer un réglage impose une nouvelle version : le générateur refuse de mélanger deux
  réglages sous une même version.
- **Fournisseurs** (`scripts/voice/providers/`) : `elevenlabs.mjs` et `mistral.mjs`.
  - Ils ont la même interface et partagent `common.mjs` : erreurs classées, lecture des
    corps d'erreur, contrôle du MP3.
  - Un autre moteur s'ajoute sans toucher au corpus, au texte dit ni au traitement.
  - Chaque fournisseur a sa clé : `ELEVENLABS_API_KEY` ou `MISTRAL_API_KEY`, lue dans un
    fichier `.env` hors dépôt.

1. **Portes** : crédits ou solde suffisants, licence confirmée, et un plafond de caractères
   accordé par le propriétaire.
2. **Estimation** : `npm run voice:generate -- --lang <langue> --dry-run` donne les phrases
   restantes, leurs caractères et ce qui a déjà été payé pour la version (`billedChars`).
   - **ElevenLabs** : Eleven v3 décompte environ 0,53 crédit par caractère. Le coût vient de
     l'en-tête `character-cost` de chaque réponse et il est noté au manifeste.
   - **Mistral** : 16 $ le million de caractères. L'API ne dit ni le coût d'un appel ni le
     solde.
3. **Génération** :
   `node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang <langue> --max-total-chars <plafond>`,
   plus `--reserve 5000` chez ElevenLabs.
   - **Plafond cumulé** (`--max-total-chars`) :
     - il vaut pour toute la version, relances et refaits compris ;
     - il se compte sur le registre `billed.jsonl`, qui résiste à un arrêt brutal ;
     - avec Mistral, sans solde lisible, il est obligatoire ;
     - atteint, il arrête l'exécution dès son départ.
   - **Modération de Mistral** : un texte refusé (403) ne fait échouer que sa phrase, et la
     génération continue. Le propriétaire choisit alors un texte dit de même sens
     (`SAID_OVERRIDES`), ou la voix de l'appareil pour cette phrase (`--allow-missing` à la
     publication).
   - Ordre : annonces, bravos, phrases fixes, erreurs, questions, questions à trou,
     vrai/faux, Découverte, énoncés (les plus longs, en dernier) ; × puis ÷, + et −.
   - **Idempotent** : relancer la même commande ne génère que ce qui manque ; un brut déjà
     payé est retraité sans nouvel appel.
   - **Aucun fichier à moitié** : chaque fichier s'écrit en `.part`, puis est renommé une
     fois complet et vérifié (ffprobe) ; les restes d'une exécution interrompue (crédits
     épuisés, Ctrl+C, plantage) sont supprimés au démarrage suivant.
   - **Crédits ou solde épuisés** : arrêt propre (code de sortie 3). Reprendre plus tard avec
     la même commande, au besoin avec la clé d'un autre compte.
     - ElevenLabs : une voix de bibliothèque garde son identifiant. Si l'outil la dit
       inaccessible, l'ajouter à ce compte depuis la bibliothèque de voix.
     - Mistral : une voix prête est commune à tous les comptes.
   - **Texte dit** (`said-text.mjs`) : les nombres en 1 s'accordent avec le nom qui suit
     (« Combien font une fois 7 ? », « vingt et une pommes », en espagnol « una caja »,
     « veintiún niños ») ; la phrase de `speak()` reste la clé du clip. Une phrase mal dite
     essai après essai reçoit un texte imposé (`SAID_OVERRIDES`) : « 108 divisé par 12 égale
     9 » se dit « Cent huit divisé par douze égale neuf » (trois essais en chiffres, trois
     débuts mal dits). En anglais, le texte dit est la phrase elle-même.
   - **Traitement** (`audio-process.mjs`) : silences de début et de fin coupés, −20 LUFS,
     pic −1 dBFS, 0,15 s de silence gardé avant la phrase, MP3 mono 64 kb/s ; un clip muet est
     refusé. Un clic isolé par un long silence part avec lui. Changer l'encodage demande une
     nouvelle version, reconstruite depuis les bruts sans appel
     (`generate.mjs --lang fr --limit 0 --raw-from <ancienne version>`).
4. **Contrôles** :
   - **`npm run voice:review -- --lang <langue>`** enchaîne les trois étapes ci-dessous en une
     commande :
     1. Whisper, sur les clips nouveaux ou changés ;
     2. le contrôle de `voice:check`, avec `a-reecouter-<langue>.txt` ;
     3. la page d'écoute.

     Avec `--compare ecartes.txt`, elle construit la page avant/après.

   - `npm run voice:check -- --lang fr --probe` : chaque phrase a son clip, manifeste et
     fichiers concordent, chaque MP3 est valide et n'a pas bougé depuis sa génération.
   - **Whisper, en local** (modèle `large-v3-turbo`, GPU si présent) :
     `.venv-whisper/bin/python scripts/voice/whisper_transcribe.py --manifest <dépôt>/manifests/fr/<version>.json --clips <dépôt>/clips/fr/<version> --lang fr --out transcripts-fr.jsonl`
     (installation dans l'en-tête du script), puis
     `npm run voice:check -- --lang fr --transcripts transcripts-fr.jsonl --flagged a-reecouter.txt` :
     nombres entendus différents de la phrase, phrase trop différente ou durée anormale.
   - **Ce qui est signalé** :
     - un nombre entendu différent, en trop ou en moins ;
     - une phrase éloignée : en français, sous 0,5 de ressemblance, à cause des homophones de
       Whisper ; en anglais et en espagnol (voix Mistral), sous 0,85 ou plus d'un mot en trop,
       réglé sur les 7 437 clips de Jane (attaques de mot ratées, charabia inventé) ;
     - une durée au-delà du double du débit médian de la voix, ou en deçà du tiers. Une borne
       fixe (0,2 s par caractère, calée sur Lucie) signalait 404 clips sains de Jane.

     Les écritures de Whisper sans défaut de voix (« watt », « 18-4 », « 8 x 10 ») sont
     ramenées aux mots de la phrase avant la comparaison.

   - **Écoute** : `npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl`
     écrit une page locale (`ecoute/fr-<version>.html` dans le dépôt des voix) : les clips
     signalés, puis un échantillon de formes féminines, que Whisper ne distingue pas (« un »
     et « une » s'écrivent « 1 »). Une case « à refaire » par clip ; les cases cochées
     forment la liste à copier dans `ecartes.txt`.
   - **Refaire** : `generate.mjs --lang fr --redo ecartes.txt` (seulement les clips écartés
     à l'écoute ; l'ancien de chacun est mis de côté dans `ecoute/avant/`). Whisper
     retranscrit ensuite les clips refaits (leur sha256 a changé), puis
     `npm run voice:listen -- --lang fr --transcripts transcripts-fr.jsonl --compare ecartes.txt`
     compare l'ancien et le nouveau de chaque clip, avec le verdict de Whisper.

5. **Envoi**, une fois l'infra en place :
   - `npm run voice:publish -- clips --lang fr --bucket <bucket>` : seulement les clips
     absents du bucket, en `audio/mpeg`, cache d'un an immuable. Un clip publié n'est
     jamais réécrit : une correction crée une nouvelle version de la voix.
   - `npm run voice:check-online -- --lang fr` : chaque adresse répond 200 en `audio/mpeg`,
     avec la taille du manifeste. Un index qui annonce encore une autre version est une
     erreur, sauf avec `--allow-other-version` (clips d'une nouvelle version envoyés, index
     pas encore publié).
   - `npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience test` :
     la langue entre dans l'index (sans cache), puis invalidation CloudFront. Seulement si
     chaque clip du manifeste est en ligne et identique, et si chaque phrase du corpus a son
     clip : `--allow-missing` accepte des phrases sans clip (voix de l'appareil pour
     elles), jamais un clip en conflit.
   - L'index distant n'est réécrit qu'après une lecture sûre : une erreur de lecture, un
     JSON illisible ou un index invalide arrêtent `index` et `remove`. `--force` repart
     alors d'un index vide, **les autres langues sont perdues** : dernier recours.
6. **Ouverture par étapes** : testeurs (`?voix=test`), puis la commande `index` avec
   `--audience all` (les joueurs qui avaient allumé la voix), puis avec
   `--audience all --default-on`. Chaque `index` réécrit toute l'entrée de la langue : sans
   `--audience all`, l'audience revient à `test`.

**Coupe-circuit** : `npm run voice:publish -- remove --lang fr --bucket <bucket> --distribution <id>` ;
le jeu revient à la voix de l'appareil au prochain chargement en ligne.

**Essai local** : `npm run voice:publish -- local --lang fr --audience all --default-on`
relie le dossier `voice/` du site (ignoré par git) aux clips du dépôt privé ; `npm run serve`,
puis ouvrir `http://localhost:8080/index.html?voix=local` (`serve-lite` liste les fichiers à la
racine : viser `index.html`).

## Licence et mentions

- **Chaque fournisseur a ses conditions**, à confirmer avant toute génération payante :
  - **ElevenLabs** : voix de bibliothèque Lucie, avec un préavis de retrait de 730 jours ;
  - **Mistral**, conditions commerciales :
    - §3.1 : la sortie appartient au client ;
    - §3.2 : ne pas présenter la voix comme humaine, d'où la mention « voix de synthèse » ;
    - le préavis de retrait des voix prêtes (30) ne touche pas les clips déjà générés, mais
      une phrase nouvelle ne pourrait plus être dite par Jane après le retrait.
- **La mention « voix de synthèse »** et son fournisseur sont en ligne, dans la langue, avant
  l'ouverture de cette langue au public.
- Les adresses des clips se déduisent du texte public : l'audio peut être téléchargé
  en masse, comme tout son d'un site.

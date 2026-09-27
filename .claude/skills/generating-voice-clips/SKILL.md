---
name: generating-voice-clips
description: Génère, contrôle et publie les clips de la voix enregistrée de LeapMultix, Lucie en français (ElevenLabs) et Sulafat en anglais et en espagnol (Google Cloud Text-to-Speech, Chirp 3 HD), plus Jane en anglais et Marie en français au choix du joueur (Mistral Voxtral TTS), rangés dans le dépôt privé leapmultix-voices et servis par CloudFront sur /voice/ depuis un bucket S3. À utiliser pour estimer le coût, générer ou compléter les clips d'une langue, reprendre une génération interrompue ou à court de crédits, régénérer après un changement de phrase parlée (verrou du corpus en échec), contrôler les clips en une commande (npm run voice:review, Whisper local, page d'écoute), refaire ceux mal prononcés avec comparaison avant/après, les publier, ouvrir la voix aux testeurs ou à tous, couper une langue (coupe-circuit), ajouter une langue, une voix ou un fournisseur, proposer une autre voix au choix du joueur (menu « Voix », alternatives.json, --version), ou préparer un essai local (?voix=local). (project)
allowed-tools: Read, Grep, Glob
---

# Voix enregistrée : générer, contrôler, publier

Référence complète : `docs/voix-enregistree.md`. Outils : `scripts/voice/`, lancés depuis la
racine du dépôt du jeu. Détails, codes de sortie et dépannage : [reference.md](reference.md).

## Voix et fournisseurs

| Langue | Voix (version)           | Fournisseur                                            | Clé                  | Coût                                                             | Solde lisible             |
| ------ | ------------------------ | ------------------------------------------------------ | -------------------- | ---------------------------------------------------------------- | ------------------------- |
| fr     | Lucie (`lucie-v3-2`)     | ElevenLabs, Eleven v3                                  | `ELEVENLABS_API_KEY` | environ 0,53 crédit par caractère (en-tête `character-cost`)     | oui : `--reserve` protège |
| en     | Sulafat (`sulafat-v1-1`) | Google Cloud Text-to-Speech, `en-GB-Chirp3-HD-Sulafat` | `GOOGLE_TTS_API_KEY` | 30 $ le million de caractères, le premier million du mois offert | non                       |
| es     | Sulafat (`sulafat-v1-1`) | Google Cloud Text-to-Speech, `es-ES-Chirp3-HD-Sulafat` | `GOOGLE_TTS_API_KEY` | idem ; nombres dits en lettres                                   | non                       |

`scripts/voice/voices.json` fixe, par langue, le fournisseur, la voix et la version.
`generate.mjs` lit la clé du fournisseur de la voix.

Mistral (Voxtral TTS, `MISTRAL_API_KEY`, 16 $ le million de caractères) reste branché : Jane
(`jane-v1-1`), la voix anglaise jusqu'au passage à Sulafat, est une **autre voix** de
l'anglais, au choix du joueur ; Marie (`marie-v1-1`, « Marie - Curious ») est l'autre voix du
français.

**Autres voix** : `scripts/voice/alternatives.json` déclare, par langue, les voix proposées en
plus de la voix par défaut (mêmes champs que `voices.json`). Le jeu les montre dans le menu
« Voix » des réglages. Chaque outil vise l'une d'elles avec `--version <version>` ; sans
`--version`, c'est la voix par défaut de `voices.json`.

**Clé Google** : une clé API classique (`AIza…`), restreinte à Cloud Text-to-Speech, dans un
projet avec facturation, rangée dans le même fichier `.env` hors dépôt que les autres clés. Les clés liées à un compte de service (`AQ.…`, celles d'AI Studio)
sont refusées par ce service (401 `CREDENTIALS_MISSING`). Le brut se demande en WAV sans perte
(`sourceFormat: "wav"`, LINEAR16) : le MP3 de Cloud TTS n'est qu'à 32 kb/s.

## Règles, toujours

- **Aucune clé écrite nulle part**, ni dans un fichier suivi, ni dans une commande affichée,
  ni dans un message. La clé vient d'un fichier `.env` hors dépôt, passé par
  `node --env-file=<fichier>`.
  - **Ne jamais lire ni afficher ce fichier**, ni par Read ni par `cat` : n'en passer que le
    chemin.
  - Pour vérifier la variable : `grep -c '^GOOGLE_TTS_API_KEY=' <fichier>` (ou
    `MISTRAL_API_KEY`, `ELEVENLABS_API_KEY`).
- **Aucun appel payant, aucune publication sans l'accord explicite du propriétaire** dans la
  conversation.
  - C'est le cas de la génération, et de `publish clips|index|remove`, qui écrivent en ligne.
  - Montrer d'abord l'aperçu : la même commande avec `--dry-run`, qui ne fait que lire.
  - L'accord donne un **plafond en caractères**.
- **Chaque commande payante porte `--max-total-chars <plafond accordé>`.**
  - Le registre `manifests/<l>/<version>.billed.jsonl` inscrit chaque réponse payée dès sa
    réception : le total survit à un arrêt brutal.
  - `--max-chars` seul repart de zéro à chaque relance.
  - Chez Google et Mistral, sans solde lisible, c'est la seule protection.
- **Un clip publié n'est jamais réécrit.**
  - Corriger un clip déjà en ligne (réglage, voix, règle de `said-text.mjs`, `--redo`)
    impose une nouvelle `version` dans `scripts/voice/voices.json`, donc toute la langue à
    régénérer.
  - Écouter et refaire **avant** de publier.
- **Toute phrase dite vient des traductions** (fr, en, es). Changer une phrase, c'est
  changer le corpus (`npm run voice:corpus:lock`), donc générer ses clips **pour chaque voix
  de la langue** : la voix par défaut et chacune de ses autres voix (`--version`). Une voix
  sans le clip d'une phrase la lit avec la voix de l'appareil.

## Procédure (copier la liste et la cocher)

```
- [ ] 1. État
- [ ] 2. Estimation
- [ ] 3. Portes : solde, licence, accord du propriétaire avec un plafond
- [ ] 4. Génération (reprise possible)
- [ ] 5. Contrôles : voice:review, écoute, refaits
- [ ] 6. Sauvegarde du dépôt privé
- [ ] 7. Publication : clips, contrôle en ligne, index en test
- [ ] 8. Ouverture par étapes
```

1. **État.**
   - `git -C ../leapmultix-voices pull`, pour ne jamais repayer des clips déjà poussés.
   - `node scripts/voice/corpus.mjs --check`. S'il échoue, des phrases ont changé : générer
     leurs clips pour chaque voix de la langue (étapes 2 à 7, `--version <version>` pour une
     autre voix), puis `npm run voice:corpus:lock`.
2. **Estimation** : `npm run voice:generate -- --lang <l> --dry-run`. La commande rend les
   phrases restantes, leurs caractères (`toDoChars`) et ce qui a déjà été payé pour la
   version (`billedChars`).
   - **ElevenLabs** : environ 0,53 crédit par caractère (mesuré).
     `node --env-file=<.env> scripts/voice/generate.mjs --lang fr --limit 0` vérifie, sans
     frais, la clé, la voix et les crédits restants.
   - **Google** : 30 $ le million de caractères, le premier million de chaque mois offert.
     `--limit 0 --max-total-chars <n>` vérifie la clé et la voix (liste des voix, gratuite).
     La consommation du mois se lit dans la console Google Cloud.
   - **Mistral** : 16 $ le million de caractères. `--limit 0 --max-total-chars <n>` vérifie
     la clé et la voix. Le solde, lui, se lit dans la console Mistral.
3. **Portes** : solde suffisant, licence confirmée, accord écrit du propriétaire avec un
   plafond en caractères.
4. **Génération.** Elle est longue : la lancer en tâche de fond.
   - Commande :
     `node --env-file=<.env> scripts/voice/generate.mjs --lang <l> --concurrency <n> --max-total-chars <plafond>`,
     plus `--reserve 5000` chez ElevenLabs.
   - **Google et Mistral : d'abord un essai de 25 phrases** (`--limit 25`) : annonces, bravos
     et phrases fixes, dont « Oops! Don't shoot the right answer. ». La modération de Mistral
     s'y voit tôt, comme le débit. Garder `--concurrency 3`, sauf si l'essai ne montre aucun
     429 ; Google tient 175 à 200 clips par minute à ce réglage.
   - Relancer la même commande reprend ce qui manque.
   - Code 3 : quota ou solde épuisé. Reprendre plus tard, éventuellement avec un autre
     compte.
   - Code 4 : des phrases sont en échec. Lire les lignes « échec » en fin de journal.
   - **Phrase refusée par la modération de Mistral** (403 « modération ») : elle échoue seule,
     le reste continue. Le propriétaire choisit entre deux sorties :
     - un texte dit de même sens (`SAID_OVERRIDES`, `scripts/voice/said-text.mjs`) ;
     - ou la voix de l'appareil pour cette phrase (`--allow-missing` à la publication).
5. **Contrôles : pages d'écoute, jusqu'à l'accord du propriétaire.**
   - **`npm run voice:review -- --lang <l>`**, en tâche de fond : Whisper transcrit les clips
     nouveaux ou changés (environ 200 par minute sur ce poste, 40 minutes pour une langue),
     puis la commande fait le contrôle de `voice:check`, écrit `a-reecouter-<l>.txt` et la
     **page d'écoute** des clips signalés, dont elle affiche l'adresse. Le code 0 est exigé,
     avec `--allow-missing` seulement sur accord. Pour Whisper, installer une fois
     `python3 -m venv .venv-whisper && .venv-whisper/bin/pip install -r scripts/voice/requirements-whisper.txt`,
     ou passer `--python <interpréteur>`.
   - **Ce qui est signalé** (`transcript-compare.mjs`, `check.mjs`) :
     - un nombre entendu différent, en trop ou en moins ;
     - une phrase éloignée. En français, sous 0,5 de ressemblance : Whisper y confond des
       homophones. En anglais et en espagnol, sous 0,85, ou plus d'un mot en
       trop : attaque de mot ratée (« Try » entendu « Cry », « Ten » entendu « hen »),
       charabia inventé par la synthèse ;
     - une durée au-delà du double du débit médian de la voix (mots en trop, longues pauses)
       ou en deçà du tiers (clip coupé).

     Les écritures de Whisper sans défaut de voix ne comptent pas : « watt » pour « what »,
     « 18-4 » pour « 18 minus 4 », « 8 x 10 » pour « 8 times 10 ».

     Restent signalées, mais saines à l'écoute (Sulafat en espagnol, 26/09/2026) : « es tres »
     entendu « estrés », « cuánto es » entendu « cuántos », et les intitulés courts (« Suma,
     Fácil ») longs seulement en proportion, à cause des silences fixes. Les refaire ne change
     rien : les laisser à l'écoute du propriétaire.

   - `npm run voice:check -- --lang <l> --probe` vérifie que chaque MP3 est valide et
     inchangé (ffprobe, plus lent).
   - **Page d'écoute** (`ecoute/<l>-<version>.html`, à ouvrir pour le propriétaire :
     `xdg-open <page>`). Il écoute les clips signalés et, en fr et en es, un échantillon des
     formes féminines (« une fois 7 »), que Whisper ne distingue pas. Il coche « à refaire » ;
     la liste du bandeau se colle dans `ecartes.txt` (racine du jeu, ignoré par git).
     L'écoute revient au propriétaire : ne jamais cocher à sa place.
   - **Propriétaire loin du poste** : publier la page de contrôle en artifact, les clips
     joints en fichiers, avec des cases « à refaire » gardées dans le stockage de l'artifact.
     Les relire ensuite pour écrire `ecartes.txt`.
   - **Refaits** (payants : accord) :
     `node --env-file=<.env> scripts/voice/generate.mjs --lang <l> --redo ecartes.txt --max-total-chars <plafond>`.
     Seuls ces clips sont refaits, l'ancien de chacun mis de côté dans `ecoute/avant/`.
   - **Page avant/après** : `npm run voice:review -- --lang <l> --compare <liste>`. Pour
     chaque clip de la liste, l'ancien et le nouveau, ce que Whisper a entendu, son verdict
     sur le nouveau, et une case « à refaire ». La liste peut réunir plusieurs tours de
     refaits (`sort -u ecartes-1.txt ecartes-2.txt > ecartes-toutes.txt`) : le propriétaire
     valide en une page les versions finales. Ses coches restent d'une ouverture à l'autre,
     sauf sur un clip refait depuis.
   - **Boucler** jusqu'à ce que le propriétaire valide. Un clip encore mal dit après deux ou
     trois essais (un nombre en tête de phrase, par exemple) reçoit un texte dit imposé ;
     relancer ensuite `generate.mjs` sans `--redo` : le texte dit a changé, donc le clip est
     refait seul. Deux endroits :
     - `SAID_OVERRIDES` (`said-text.mjs`) change le texte dit de **toute la langue**, donc de
       chacune de ses voix : à réserver à une langue dont aucun clip de la phrase n'est publié,
       puisqu'un clip publié ne se réécrit pas ;
     - `saidOverrides` dans l'entrée de la voix (`voices.json` ou `alternatives.json`) ne
       change que cette voix : `{ "<phrase de speak()>": "<texte dit>" }`. Il reste hors des
       empreintes des réglages, et une phrase absente du corpus est refusée. Exemple : Marie
       disait « Combien font 41 ? » pour « Combien font 49 moins 41 ? » ; avec les nombres en
       lettres, elle le dit juste.

6. **Sauvegarde** : proposer au propriétaire le commit du dépôt privé (`clips/`,
   `manifests/`, registre compris), puis le pousser. `raw/` et `ecoute/` restent locaux.
7. **Publication.** Accord explicite, aperçu `--dry-run` d'abord, identifiants AWS du poste.
   - Enchaîner :
     1. `npm run voice:publish -- clips --lang <l> --bucket leapmultix-voices` ;
     2. `npm run voice:check-online -- --lang <l>`, qui doit rendre 0 échec ;
     3. `npm run voice:publish -- index --lang <l> --bucket leapmultix-voices --distribution <id> --audience test`.
   - `<id>` est la distribution du site (`gh variable get CLOUDFRONT_DISTRIB`). `publish.mjs`
     lit aussi `VOICE_BUCKET` et `CLOUDFRONT_DISTRIB` dans l'environnement.
   - `index` :
     - refuse une entrée que le jeu écarterait (nom, version) ;
     - refuse tant qu'un clip manque ou diffère ;
     - garde les autres langues de l'index, et les autres voix de la langue. Après
       publication, relire `/voice/index.json`.
   - `--version` ne va qu'avec `clips`, `local` et `alternative` : `index` et `remove` ne
     publient que la voix par défaut.
   - Deux options, seulement sur accord explicite :
     - `--allow-missing` : des phrases sans clip, lues par la voix de l'appareil ;
     - `--force` : l'index distant est illisible, on repart d'un index vide, et les autres
       langues sont perdues.
   - Nouvelle version : entre l'envoi de ses clips et son index, `voice:check-online` demande
     `--allow-other-version`.
8. **Ouverture.** Accord à chaque étape, et la prod doit servir la balise
   `leapmultix-voice-base` à `/voice/` (variable de dépôt `VOICE_BASE`).
   - Tester sur le site avec `?voix=test`, dans la langue du jeu concernée (`?voix=off`
     retire la marque).
   - Puis relancer la commande `index` de l'étape 7 avec `--audience all`, puis avec
     `--audience all --default-on`.
   - **Chaque `index` réécrit toute l'entrée de la langue** : sans `--audience all`,
     l'audience revient à `test`.
   - Après chaque `index`, `npm run voice:check-online -- --lang <l> --sample 50` montre
     l'entrée réellement servie.
   - Le choix de voix du joueur vaut pour toutes les langues : un joueur qui a allumé la voix
     en français l'entend dans la nouvelle langue dès `--audience all`.

**Coupe-circuit** : `npm run voice:publish -- remove --lang <l> --bucket leapmultix-voices --distribution <id>`.

**Autre voix au choix du joueur** (menu « Voix », au plus 4 par langue) :

1. La déclarer sous sa langue dans `scripts/voice/alternatives.json`, avec un nom et une
   version distincts de ceux de la voix par défaut. Son `provider` doit être connu du jeu :
   voir [reference.md](reference.md#autres-voix-dune-langue).
2. Générer, contrôler et sauvegarder ses clips (étapes 2 à 6), avec `--version <version>` sur
   chaque commande. `voice:review` range alors ses fichiers de travail sous la version
   (`transcripts-<l>-<version>.jsonl`).
3. Publier, accord et `--dry-run` d'abord :
   1. `npm run voice:publish -- clips --lang <l> --version <version> --bucket leapmultix-voices` ;
   2. `npm run voice:check-online -- --lang <l> --version <version> --allow-other-version` ;
   3. `npm run voice:publish -- alternative --lang <l> --version <version> --bucket leapmultix-voices --distribution <id> --audience test`,
      refusé tant qu'un clip manque ou diffère.
4. Tester avec `?voix=test` (menu « Voix » de la langue), puis relancer `alternative` avec
   `--audience all`. `voice:check-online -- --lang <l> --version <version>` montre alors
   l'entrée servie.
5. Retirer : `alternative` avec `--remove`. La voix par défaut n'est pas touchée.

**Essai local** :

1. `npm run voice:publish -- local --lang <l> --audience all --default-on`. La commande
   garde les autres langues de l'index local. Pour le menu « Voix », ajouter ensuite une
   autre voix : `npm run voice:publish -- local --lang <l> --version <version> --audience all`.
2. `npm run serve`.
3. Ouvrir `http://localhost:8080/index.html?voix=local`. Cela ne marche que sur localhost,
   et `?voix=local` y vaut marque de testeur. `serve-lite` liste les fichiers à la racine,
   d'où `index.html`.

**Nouvelle langue, nouvelle voix ou nouveau fournisseur** : voir
[reference.md](reference.md#nouvelle-langue-ou-nouvelle-voix).

---
name: generating-voice-clips
description: Génère, contrôle et publie les clips de la voix enregistrée de LeapMultix, Lucie en français (ElevenLabs) et Jane en anglais (Mistral Voxtral TTS), rangés dans le dépôt privé leapmultix-voices et servis par CloudFront sur /voice/ depuis un bucket S3. À utiliser pour estimer le coût, générer ou compléter les clips d'une langue, reprendre une génération interrompue ou à court de crédits, régénérer après un changement de phrase parlée (verrou du corpus en échec), contrôler les clips en une commande (npm run voice:review, Whisper local, page d'écoute), refaire ceux mal prononcés avec comparaison avant/après, les publier, ouvrir la voix aux testeurs ou à tous, couper une langue (coupe-circuit), ajouter une langue, une voix ou un fournisseur, ou préparer un essai local (?voix=local). (project)
allowed-tools: Read, Grep, Glob
---

# Voix enregistrée : générer, contrôler, publier

Référence complète : `docs/voix-enregistree.md`. Outils : `scripts/voice/`, lancés depuis la
racine du dépôt du jeu. Détails, codes de sortie et dépannage : [reference.md](reference.md).

## Voix et fournisseurs

| Langue | Voix (version)               | Fournisseur                                    | Clé                  | Coût                                                         | Solde lisible             |
| ------ | ---------------------------- | ---------------------------------------------- | -------------------- | ------------------------------------------------------------ | ------------------------- |
| fr     | Lucie (`lucie-v3-2`)         | ElevenLabs, Eleven v3                          | `ELEVENLABS_API_KEY` | environ 0,53 crédit par caractère (en-tête `character-cost`) | oui : `--reserve` protège |
| en     | Jane - Neutral (`jane-v1-1`) | Mistral, Voxtral TTS (`voxtral-mini-tts-2603`) | `MISTRAL_API_KEY`    | 16 $ le million de caractères, que l'API ne dit pas          | non                       |
| es     | aucune pour l'instant        | –                                              | –                    | –                                                            | –                         |

`scripts/voice/voices.json` fixe, par langue, le fournisseur, la voix et la version.
`generate.mjs` lit la clé du fournisseur de la voix.

## Règles, toujours

- **Aucune clé écrite nulle part**, ni dans un fichier suivi, ni dans une commande affichée,
  ni dans un message. La clé vient d'un fichier `.env` hors dépôt, passé par
  `node --env-file=<fichier>`.
  - **Ne jamais lire ni afficher ce fichier**, ni par Read ni par `cat` : n'en passer que le
    chemin.
  - Pour vérifier la variable : `grep -c '^MISTRAL_API_KEY=' <fichier>` (ou
    `ELEVENLABS_API_KEY`).
- **Aucun appel payant, aucune publication sans l'accord explicite du propriétaire** dans la
  conversation.
  - C'est le cas de la génération, et de `publish clips|index|remove`, qui écrivent en ligne.
  - Montrer d'abord l'aperçu : la même commande avec `--dry-run`, qui ne fait que lire.
  - L'accord donne un **plafond en caractères**.
- **Chaque commande payante porte `--max-total-chars <plafond accordé>`.**
  - Le registre `manifests/<l>/<version>.billed.jsonl` inscrit chaque réponse payée dès sa
    réception : le total survit à un arrêt brutal.
  - `--max-chars` seul repart de zéro à chaque relance.
  - Chez Mistral, sans solde lisible, c'est la seule protection.
- **Un clip publié n'est jamais réécrit.**
  - Corriger un clip déjà en ligne (réglage, voix, règle de `said-text.mjs`, `--redo`)
    impose une nouvelle `version` dans `scripts/voice/voices.json`, donc toute la langue à
    régénérer.
  - Écouter et refaire **avant** de publier.
- **Toute phrase dite vient des traductions** (fr, en, es). Changer une phrase, c'est
  changer le corpus (`npm run voice:corpus:lock`), donc générer ses clips.

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
     leurs clips (étapes 2 à 6), puis `npm run voice:corpus:lock`.
2. **Estimation** : `npm run voice:generate -- --lang <l> --dry-run`. La commande rend les
   phrases restantes, leurs caractères (`toDoChars`) et ce qui a déjà été payé pour la
   version (`billedChars`).
   - **ElevenLabs** : environ 0,53 crédit par caractère (mesuré).
     `node --env-file=<.env> scripts/voice/generate.mjs --lang fr --limit 0` vérifie, sans
     frais, la clé, la voix et les crédits restants.
   - **Mistral** : 16 $ le million de caractères. `--limit 0 --max-total-chars <n>` vérifie
     la clé et la voix. Le solde, lui, se lit dans la console Mistral.
3. **Portes** : solde suffisant, licence confirmée, accord écrit du propriétaire avec un
   plafond en caractères.
4. **Génération.** Elle est longue : la lancer en tâche de fond.
   - Commande :
     `node --env-file=<.env> scripts/voice/generate.mjs --lang <l> --concurrency <n> --max-total-chars <plafond>`,
     plus `--reserve 5000` chez ElevenLabs.
   - **Mistral : d'abord un essai de 25 phrases** (`--limit 25`) : annonces, bravos et
     phrases fixes, dont « Oops! Don't shoot the right answer. ». La modération s'y voit tôt,
     comme le débit. Garder `--concurrency 3`, sauf si l'essai ne montre aucun 429.
   - Relancer la même commande reprend ce qui manque.
   - Code 3 : quota ou solde épuisé. Reprendre plus tard, éventuellement avec un autre
     compte.
   - Code 4 : des phrases sont en échec. Lire les lignes « échec » en fin de journal.
   - **Phrase refusée par la modération de Mistral** (403 « modération ») : elle échoue seule,
     le reste continue. Le propriétaire choisit entre deux sorties :
     - un texte dit de même sens (`SAID_OVERRIDES`, `scripts/voice/said-text.mjs`) ;
     - ou la voix de l'appareil pour cette phrase (`--allow-missing` à la publication).
5. **Contrôles.**
   - **`npm run voice:review -- --lang <l>`**, en tâche de fond : plus de 10 minutes pour
     7 000 clips. La commande :
     - lance Whisper sur les clips nouveaux ou changés, vers `transcripts-<l>.jsonl` ;
     - fait le contrôle de `voice:check` ;
     - écrit `a-reecouter-<l>.txt` et la page d'écoute, dont elle affiche l'adresse.

     Le code 0 est exigé, avec `--allow-missing` seulement sur accord. Pour Whisper,
     installer une fois
     `python3 -m venv .venv-whisper && .venv-whisper/bin/pip install -r scripts/voice/requirements-whisper.txt`,
     ou passer `--python <interpréteur>`.

   - `npm run voice:check -- --lang <l> --probe` vérifie que chaque MP3 est valide et
     inchangé (ffprobe, plus lent).
   - **Écoute.** Le propriétaire ouvre la page et écoute :
     - les clips signalés ;
     - en fr et en es, un échantillon des formes féminines (« une fois 7 »), que Whisper ne
       distingue pas.

     Il coche « à refaire », et la liste se colle dans `ecartes.txt` (racine du jeu, ignoré
     par git). L'écoute revient au propriétaire : ne jamais cocher à sa place.

   - **Refaits** (payants : accord) :
     `node --env-file=<.env> scripts/voice/generate.mjs --lang <l> --redo ecartes.txt --max-total-chars <plafond>`.
     - Seuls ces clips sont refaits, et l'ancien de chacun est mis de côté dans
       `ecoute/avant/`.
     - Puis `npm run voice:review -- --lang <l> --compare ecartes.txt` : page avant/après,
       avec le verdict de Whisper sur chaque nouveau clip.
     - Un clip encore mal dit après deux ou trois essais (un nombre en tête de phrase, par
       exemple) reçoit un texte dit imposé dans `SAID_OVERRIDES`. Relancer ensuite
       `generate.mjs` sans `--redo` : le texte dit a changé, donc le clip est refait seul.

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
     - garde les autres langues de l'index. Après publication, relire `/voice/index.json`.
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

**Essai local** :

1. `npm run voice:publish -- local --lang <l> --audience all --default-on`. La commande
   garde les autres langues de l'index local.
2. `npm run serve`.
3. Ouvrir `http://localhost:8080/index.html?voix=local`. Cela ne marche que sur localhost,
   et `?voix=local` y vaut marque de testeur. `serve-lite` liste les fichiers à la racine,
   d'où `index.html`.

**Nouvelle langue, nouvelle voix ou nouveau fournisseur** : voir
[reference.md](reference.md#nouvelle-langue-ou-nouvelle-voix).

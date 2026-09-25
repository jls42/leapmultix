---
name: generating-voice-clips
description: Génère, contrôle et publie les clips de la voix enregistrée de LeapMultix (voix ElevenLabs « Lucie », dépôt privé leapmultix-voices, bucket S3 servi par CloudFront sur /voice/). À utiliser pour estimer le coût en crédits, générer ou compléter les clips d'une langue, reprendre une génération interrompue ou à court de crédits, régénérer après un changement de phrase parlée (verrou du corpus en échec), vérifier les clips (Whisper local), faire écouter les clips signalés sur la page d'écoute (npm run voice:listen) et refaire ceux mal prononcés avec comparaison avant/après, les publier, ouvrir la voix aux testeurs ou à tous, couper une langue (coupe-circuit), ajouter une langue ou une voix, ou préparer un essai local (?voix=local). (project)
allowed-tools: Read, Grep, Glob
---

# Voix enregistrée : générer, contrôler, publier

Référence complète : `docs/voix-enregistree.md`. Outils : `scripts/voice/` (lancés depuis la
racine du dépôt du jeu). Détails, codes de sortie et dépannage : [reference.md](reference.md).

## Règles, toujours

- **Aucune clé écrite nulle part** (fichier suivi, commande affichée, message) : la clé
  ElevenLabs vient d'un fichier `.env` hors dépôt, passé par `node --env-file=<fichier>`.
  **Ne jamais lire ni afficher ce fichier** (ni Read ni `cat`) : n'en passer que le chemin.
  Pour vérifier la variable : `grep -c '^ELEVENLABS_API_KEY=' <fichier>`.
- **Aucun appel payant, aucune publication sans l'accord explicite du propriétaire** dans la
  conversation : génération (crédits), `publish clips|index|remove` (en ligne). Montrer
  d'abord l'aperçu : la même commande avec `--dry-run` (lecture seule).
- **Un clip publié n'est jamais réécrit** : corriger un clip déjà en ligne (réglage, voix,
  règle de `said-text.mjs`, `--redo`) impose une nouvelle `version` dans
  `scripts/voice/voices.json`, donc toute la langue à régénérer : écouter et refaire
  **avant** de publier.
- **Toute phrase dite vient des traductions** (fr, en, es) : changer une phrase, c'est
  changer le corpus (`npm run voice:corpus:lock`), donc générer ses clips.

## Procédure (copier la liste et la cocher)

```
- [ ] 1. État
- [ ] 2. Estimation
- [ ] 3. Portes : crédits, licence, accord du propriétaire
- [ ] 4. Génération (reprise possible)
- [ ] 5. Contrôles : fichiers, Whisper, écoute
- [ ] 6. Sauvegarde du dépôt privé
- [ ] 7. Publication : clips, contrôle en ligne, index en test
- [ ] 8. Ouverture par étapes
```

1. **État** : `git -C ../leapmultix-voices pull` (ne jamais repayer des clips déjà
   poussés) ; `node scripts/voice/corpus.mjs --check`. S'il échoue, des phrases ont changé :
   générer leurs clips (étapes 2 à 6), puis `npm run voice:corpus:lock`.
2. **Estimation** : `npm run voice:generate -- --lang <l> --dry-run` rend les phrases
   restantes et leurs caractères (`toDoChars`). Eleven v3 : environ 0,53 crédit par
   caractère (mesuré). Sans frais : `node --env-file=<.env> scripts/voice/generate.mjs
--lang <l> --limit 0` vérifie la clé, la voix et les crédits restants.
3. **Portes** : crédits suffisants, licence confirmée, accord écrit du propriétaire.
4. **Génération** (longue : la lancer en tâche de fond) :
   `node --env-file=<.env> scripts/voice/generate.mjs --lang <l> --reserve 5000 --max-chars <toDoChars>`.
   Relancer la même commande reprend ce qui manque ; code 3 : crédits épuisés, reprendre
   plus tard (autre compte possible). Si le journal dit « Crédits : illisibles », `--reserve`
   ne protège rien : seul `--max-chars` plafonne. Lire le bilan JSON et les lignes
   « échec » en fin de journal.
5. **Contrôles** :
   - `npm run voice:check -- --lang <l> --probe` doit sortir en code 0 (ni manquant, ni
     périmé, ni invalide, ni modifié) ; « hors corpus » et « durées à réécouter » se
     lisent sans faire échouer ;
   - Whisper (installation une fois :
     `python3 -m venv .venv-whisper && .venv-whisper/bin/pip install -r scripts/voice/requirements-whisper.txt`),
     en tâche de fond :
     `.venv-whisper/bin/python scripts/voice/whisper_transcribe.py --manifest ../leapmultix-voices/manifests/<l>/<version>.json --clips ../leapmultix-voices/clips/<l>/<version> --lang <l> --out transcripts-<l>.jsonl`,
     puis `npm run voice:check -- --lang <l> --transcripts transcripts-<l>.jsonl --flagged a-reecouter.txt` ;
   - page d'écoute : `npm run voice:listen -- --lang <l> --transcripts transcripts-<l>.jsonl`
     écrit `../leapmultix-voices/ecoute/<l>-<version>.html` (hors git) et en affiche
     l'adresse : les clips signalés, puis un échantillon des formes féminines (« une fois
     7 »), que Whisper ne distingue pas. Le propriétaire l'ouvre dans son navigateur, écoute,
     coche « à refaire » ; la liste des cases cochées se colle dans `ecartes.txt` (racine du
     jeu, ignoré par git) ;
   - refaire les clips écartés (payant : accord) :
     `node --env-file=<.env> scripts/voice/generate.mjs --lang <l> --redo ecartes.txt`
     (seulement ces empreintes ; l'ancien clip de chacune est mis de côté dans
     `ecoute/avant/`), puis relancer Whisper (il ne transcrit que les clips refaits),
     `voice:check`, et
     `npm run voice:listen -- --lang <l> --transcripts transcripts-<l>.jsonl --compare ecartes.txt` :
     page avant/après (`<l>-<version>-refaits.html`) avec le verdict de Whisper sur chaque
     nouveau clip, à faire réécouter. Un clip encore mal dit après deux ou trois essais (un
     nombre en tête de phrase, par exemple) : lui imposer un texte dit dans `SAID_OVERRIDES`
     (`scripts/voice/said-text.mjs`, nombre en toutes lettres), puis relancer `generate.mjs`
     sans `--redo` : le texte dit a changé, le clip est refait seul (l'ancien mis de côté
     lui aussi ; comparer avec `--compare` sur un fichier qui contient son empreinte).
6. **Sauvegarde** : proposer au propriétaire le commit du dépôt privé (`clips/`,
   `manifests/` ; `raw/` reste local), puis le pousser.
7. **Publication** (accord explicite, aperçu `--dry-run` d'abord ; identifiants AWS du
   poste) : `npm run voice:publish -- clips --lang <l> --bucket leapmultix-voices`, puis
   `npm run voice:check-online -- --lang <l>` (0 échec exigé), puis
   `npm run voice:publish -- index --lang <l> --bucket leapmultix-voices --distribution <id> --audience test`.
   `<id>` : distribution du site (`gh variable get CLOUDFRONT_DISTRIB`) ; `publish.mjs` lit
   aussi `VOICE_BUCKET` et `CLOUDFRONT_DISTRIB` dans l'environnement. `index` refuse tant
   qu'un clip manque ou diffère : `--allow-missing` (phrases sans clip, voix de l'appareil)
   et `--force` (index distant illisible : repart d'un index vide, les autres langues
   perdues) seulement sur accord explicite. Nouvelle version : entre l'envoi de ses clips
   et son index, `voice:check-online` demande `--allow-other-version`.
8. **Ouverture** (accord à chaque étape ; la prod doit servir la balise
   `leapmultix-voice-base` à `/voice/`, variable de dépôt `VOICE_BASE`) : tester sur le site
   avec `?voix=test` (`?voix=off` retire la marque), puis relancer la commande `index` de
   l'étape 7 avec `--audience all`, puis avec `--audience all --default-on`. **Chaque `index`
   réécrit toute l'entrée** : sans `--audience all`, l'audience revient à `test`. Après
   chaque `index`, `npm run voice:check-online -- --lang <l> --sample 50` montre l'entrée
   réellement servie.

**Coupe-circuit** : `npm run voice:publish -- remove --lang <l> --bucket leapmultix-voices --distribution <id>`.

**Essai local** : `npm run voice:publish -- local --lang <l> --audience all --default-on`,
`npm run serve`, puis ouvrir `http://localhost:8080/index.html?voix=local` (localhost
seulement ; `serve-lite` liste les fichiers à la racine, d'où `index.html`).

**Nouvelle langue ou nouvelle voix** : voir [reference.md](reference.md#nouvelle-langue-ou-nouvelle-voix).

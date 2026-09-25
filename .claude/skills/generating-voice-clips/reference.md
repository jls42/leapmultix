# Voix enregistrée : référence

## Dépôt privé des voix (`../leapmultix-voices`, GitHub privé `jls42/leapmultix-voices`)

| Chemin                                | Contenu                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------- |
| `clips/<l>/<version>/<empreinte>.mp3` | clips traités, MP3 mono 64 kb/s, −20 LUFS : ceux que le jeu lit           |
| `manifests/<l>/<version>.json`        | par clip : phrase, texte dit, durée, sha256, coût, identifiant de requête |
| `manifests/<l>/<version>.runs.jsonl`  | bilan de chaque exécution de la génération                                |
| `raw/` (hors git)                     | sorties brutes d'ElevenLabs, pour retraiter sans payer                    |

L'empreinte est `voiceKey(phrase)` (`js/core/spoken-text.js`) : la phrase exacte passée à
`speak()`. Le texte envoyé à la synthèse peut différer (`scripts/voice/said-text.mjs`).

## Génération : codes de sortie et arrêts

| Code | `stop` du bilan           | Que faire                                                                                                                   |
| ---- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 0    | `null`                    | tout est fait                                                                                                               |
| 0    | `budget` / `limit`        | `--max-chars`, `--reserve` ou `--limit` atteints : relancer plus tard                                                       |
| 3    | `quota`                   | crédits épuisés : relancer après recharge ou avec une autre clé                                                             |
| 4    | `failures` ou échecs      | des phrases en échec (arrêt à 20) : lire les lignes « échec » qui suivent le bilan, ou `failed` dans `<version>.runs.jsonl` |
| 1    | `auth` / `voice` / erreur | clé refusée, voix inaccessible, réglages changés (voir ci-dessous)                                                          |
| 130  | `interrupted`             | Ctrl+C : relancer la même commande                                                                                          |

Garanties : aucun fichier sous son nom final avant d'être complet et vérifié (ffprobe) ;
les `.part` d'une exécution interrompue sont supprimés au démarrage ; un brut déjà payé est
retraité sans nouvel appel ; un clip de plus de 30 s (hallucination du modèle) est refusé.

## Dépannage

- **« ELEVENLABS_API_KEY manquante » ou « mal formée »** : `--env-file` oublié, variable mal
  nommée ou valeur sur plusieurs lignes ; vérifier avec `grep -c`, jamais en l'affichant.
- **« Traitement impossible, brut gardé »** (code 1) : ffmpeg ou ffprobe en panne ou absent ;
  le brut payé reste, la relance le retraite sans nouvel appel.
- **« Une génération tourne déjà »** : une autre exécution tient le verrou
  (`manifests/<l>/<version>.lock`) ; attendre sa fin. Un verrou laissé par un processus
  disparu est repris tout seul.
- **Clips à long silence ou à clic final** : corriger `audio-process.mjs`, puis
  `generate.mjs --lang <l> --reprocess` (depuis les bruts, gratuit), tant que rien n'est
  publié.
- **« n'est pas utilisable avec cette clé »** : la voix de bibliothèque n'est pas dans ce
  compte ; l'ajouter depuis la bibliothèque de voix (propriétaire public : champ
  `publicOwnerId` de `voices.json`). Son identifiant reste le même.
- **« Les réglages de la voix … ont changé »** : `voices.json` a changé sous une version
  existante ; remettre les réglages, ou créer une nouvelle version (nouvelle génération).
- **Clip signalé par Whisper** : Whisper n'entend pas « un » / « une » et se trompe parfois
  sur les phrases courtes ; faire écouter avant de refaire.
- **`curl` sur `/voice/` répond 403** : la fonction CloudFront `voice_guard` ne sert que les
  requêtes du jeu (`Sec-Fetch-Site: same-origin`) ; `check-online.mjs` envoie cet en-tête.
- **Clip absent en ligne** : 403 (pas de listage du bucket) ; le jeu passe à la voix de
  l'appareil pour cette phrase.

## Nouvelle langue ou nouvelle voix

1. Choisir la voix (écoute comparée) ; lire ses réglages : `GET /v1/voices/<voice_id>`.
2. Ajouter l'entrée de la langue dans `scripts/voice/voices.json` : `provider`, `voice`,
   `version`, `voiceId`, `publicOwnerId`, `model`, `languageCode`, `sourceFormat`,
   `settings`, `encoding`.
3. Règles du texte dit pour la langue (`said-text.mjs`) : le test
   `tests-esm/voice/said-text.esm.test.mjs` exige que chaque mot qui suit un nombre dans le
   corpus soit classé.
4. Un autre fournisseur (par exemple le TTS de Mistral) s'ajoute dans
   `scripts/voice/providers/` avec la même interface que `elevenlabs.mjs` : `credits()`,
   `checkVoice(voice)`, `synthesize({ text, voice, signal })` qui rend
   `{ audio, requestId, cost }`, erreurs `ProviderError`. Puis l'inscrire dans `PROVIDERS`
   de `generate.mjs`, dont `main` ne passe aujourd'hui que `ELEVENLABS_API_KEY`.

## Infra (dépôt `leapmultix-infra`, `voices.tf`)

Bucket privé `leapmultix-voices` (préfixe `voice/`, versionné), lu par la distribution du
site seulement ; `/voice/index.json` jamais en cache à la périphérie, `/voice/*` au cache de
l'objet. Voir `docs/voix-enregistree.md`, section « En place : l'infra ».

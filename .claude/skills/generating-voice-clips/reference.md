# Voix enregistrée : référence

## Dépôt privé des voix (`../leapmultix-voices`, GitHub privé `jls42/leapmultix-voices`)

| Chemin                                 | Contenu                                                                          |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| `clips/<l>/<version>/<empreinte>.mp3`  | clips traités, MP3 mono 64 kb/s, −20 LUFS : ceux que le jeu lit                  |
| `manifests/<l>/<version>.json`         | par clip : phrase, texte dit, durée, sha256, coût, identifiant de requête        |
| `manifests/<l>/<version>.runs.jsonl`   | bilan de chaque exécution de la génération                                       |
| `manifests/<l>/<version>.billed.jsonl` | registre : une ligne par réponse payée, écrite dès sa réception (plafond cumulé) |
| `raw/` (hors git)                      | sorties brutes du fournisseur, pour retraiter sans payer                         |
| `ecoute/` (hors git)                   | pages d'écoute (`voice:listen`) ; `avant/<l>/<version>/` : clips remplacés       |

L'empreinte est `voiceKey(phrase)` (`js/core/spoken-text.js`) : la phrase exacte passée à
`speak()`. Le texte envoyé à la synthèse peut différer (`scripts/voice/said-text.mjs`).

## Fournisseurs

`scripts/voice/providers/` : un module par fournisseur (`elevenlabs.mjs`, `mistral.mjs`),
avec la même interface :

- `credits()` : `{ used, limit }`, ou `null` si le solde n'est pas lisible ;
- `checkVoice(voice)` ;
- `synthesize({ text, voice, signal })`, qui rend `{ audio, requestId, cost }`.

Les erreurs sont des `ProviderError` (`providers/common.mjs`), classées par kind :

- `quota`, `auth`, `voice`, `response` arrêtent toute la génération ;
- `rate`, `server`, `network` sont réessayés ;
- `request` ne fait échouer que sa phrase.

Le classement est propre à chaque fournisseur :

|             | ElevenLabs (fr)                                      | Mistral (en)                                                               |
| ----------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| Clé         | `ELEVENLABS_API_KEY`, en-tête `xi-api-key`           | `MISTRAL_API_KEY`, en-tête `Authorization: Bearer`                         |
| Coût        | en-tête `character-cost` (≈ 0,53 crédit/caractère)   | inconnu de l'API ; 16 $ le million de caractères                           |
| Solde       | `credits()` lisible, `--reserve`                     | aucun : `--max-total-chars` obligatoire                                    |
| 401 / 403   | clé refusée (`auth`)                                 | 401 clé refusée ; **403 : modération**, la phrase seule échoue (`request`) |
| Voix        | bibliothèque (préavis de 730 jours), `publicOwnerId` | voix prête (`retention_notice` : 30), ou clonage avec consentement         |
| Identifiant | en-tête `request-id`                                 | en-tête `mistral-correlation-id`                                           |

## Page d'écoute (`npm run voice:listen`)

`npm run voice:review -- --lang <l> [--compare <fichier>]` enchaîne Whisper, le contrôle et
cette page : c'est la commande habituelle. `voice:listen` refait seulement la page.

`scripts/voice/listen-page.mjs --lang <l> [--transcripts <fichier.jsonl>] [--sample <n>]
[--compare <fichier>] [--out <dépôt des voix>]` écrit une page HTML autonome dans
`ecoute/` du dépôt des voix et en affiche l'adresse `file://`.

- **Sans `--compare`** (`<l>-<version>.html`) : clips signalés, par les règles de
  `voice:check` (voir l'étape « Contrôles » du skill : nombres, ressemblance et mots en trop,
  durée rapportée au débit de la voix), puis un échantillon
  (`--sample`, 24 par défaut) des phrases dont le texte dit diffère : textes imposés
  (`SAID_OVERRIDES`) d'abord, puis accords en genre régulièrement espacés. Sans
  `--transcripts`, seules les durées signalent.
- **Avec `--compare <fichier>`** (`<l>-<version>-refaits.html`) : pour chaque empreinte de la
  liste, l'ancien clip (mis de côté par `generate.mjs` dans `ecoute/avant/`, le dernier
  remplacé seulement) et le nouveau, ce que Whisper a entendu de chacun, et son verdict sur
  le nouveau (juste, douteux, pas encore transcrit). Une empreinte sans clip est listée à
  part (génération à relancer).
- **Cases « à refaire »** : les cases cochées forment la liste à copier (bouton « Copier la
  liste », sinon la liste est sélectionnée pour Ctrl+C). Elles restent cochées d'une
  ouverture à l'autre (stockage local du navigateur, par page), tant que le clip n'a pas
  changé : un clip refait depuis n'est plus coché.
- Les listes d'empreintes (`--compare`, comme `--redo` et `--keys` de `generate.mjs`) sont
  vérifiées : une empreinte mal formée arrête le script.

## Génération : codes de sortie et arrêts

| Code | `stop` du bilan           | Que faire                                                                                                                   |
| ---- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 0    | `null`                    | tout est fait                                                                                                               |
| 0    | `budget` / `limit`        | `--max-chars`, `--max-total-chars`, `--reserve` ou `--limit` atteints : relancer plus tard                                  |
| 3    | `quota`                   | crédits ou solde épuisés : relancer après recharge ou avec une autre clé                                                    |
| 4    | `failures` ou échecs      | des phrases en échec (arrêt à 20) : lire les lignes « échec » qui suivent le bilan, ou `failed` dans `<version>.runs.jsonl` |
| 1    | `auth` / `voice` / erreur | clé refusée, voix inaccessible, réglages changés (voir ci-dessous)                                                          |
| 130  | `interrupted`             | Ctrl+C : relancer la même commande                                                                                          |

Plafond cumulé déjà atteint au démarrage (`--max-total-chars`) : refus immédiat, code 1, avec
les caractères déjà payés et le plafond.

Garanties : aucun fichier sous son nom final avant d'être complet et vérifié (ffprobe) ;
les `.part` d'une exécution interrompue sont supprimés au démarrage ; un brut déjà payé est
retraité sans nouvel appel ; un clip de plus de 30 s (hallucination du modèle) est refusé.

## Dépannage

- **« ELEVENLABS_API_KEY manquante » ou « MISTRAL_API_KEY manquante »**, ou « mal formée » :
  `--env-file` oublié, variable mal nommée ou valeur sur plusieurs lignes ; vérifier avec
  `grep -c`, jamais en l'affichant. La variable lue est celle du fournisseur de la voix.
- **« Crédits illisibles avec cette clé »** : donner `--max-total-chars` (ou `--max-chars`).
- **Mistral 403 (modération)** : la phrase est refusée à chaque essai. Texte dit de même
  sens dans `SAID_OVERRIDES`, ou voix de l'appareil pour elle (`--allow-missing` à la
  publication), au choix du propriétaire.
- **Mistral 429** : débit dépassé, réessayé tout seul ; s'il revient souvent, baisser
  `--concurrency`.
- **« Traitement impossible, brut gardé »** (code 1) : ffmpeg ou ffprobe en panne ou absent ;
  le brut payé reste, la relance le retraite sans nouvel appel.
- **« Une génération tourne déjà »** : une autre exécution tient le verrou
  (`manifests/<l>/<version>.lock`) ; attendre sa fin. Un verrou laissé par un processus
  disparu est repris tout seul.
- **Clips à long silence ou à clic final** : corriger `audio-process.mjs`, puis
  `generate.mjs --lang <l> --reprocess` (depuis les bruts, gratuit), tant que rien n'est
  publié.
- **« n'est pas utilisable avec cette clé »** (ElevenLabs) : la voix de bibliothèque n'est
  pas dans ce compte ; l'ajouter depuis la bibliothèque de voix (propriétaire public : champ
  `publicOwnerId` de `voices.json`). Son identifiant reste le même.
- **« n'existe plus ou n'est pas accessible »** (Mistral) : la voix prête a été retirée
  (préavis `retention_notice`) ou l'identifiant est faux ; lister les voix par
  `GET /v1/audio/voices`. Les clips déjà générés restent.
- **« Les réglages de la voix … ont changé »** : `voices.json` a changé sous une version
  existante ; remettre les réglages, ou créer une nouvelle version (nouvelle génération).
- **Clip signalé par Whisper** : Whisper n'entend pas « un » / « une » et se trompe parfois
  sur les phrases courtes ; faire écouter avant de refaire.
- **`curl` sur `/voice/` répond 403** : la fonction CloudFront `voice_guard` ne sert que les
  requêtes du jeu (`Sec-Fetch-Site: same-origin`) ; `check-online.mjs` envoie cet en-tête.
- **Clip absent en ligne** : 403 (pas de listage du bucket) ; le jeu passe à la voix de
  l'appareil pour cette phrase.

## Nouvelle langue ou nouvelle voix

1. **Choisir la voix.**
   - Faire un banc d'écoute : quelques phrases du vrai corpus, dans les voix candidates,
     traitées comme les clips du jeu, et passées dans Whisper.
   - Voix disponibles :
     - ElevenLabs : `GET /v1/voices/<voice_id>` ;
     - Mistral : `GET /v1/audio/voices`. Au 26/09/2026, les voix prêtes étaient Jane (femme)
       et Oliver en anglais britannique, Paul en anglais américain, et Marie (femme) en
       français, **aucune en espagnol**. Le modèle parle pourtant 9 langues : une voix d'une
       autre langue garde son accent, ou dit les nombres dans sa langue.
2. **Ajouter l'entrée de la langue** dans `scripts/voice/voices.json` : `provider`, `voice`
   (nom de l'index : `^[a-z0-9][a-z0-9-]{0,31}$`), `version`, `voiceId`, `model`,
   `languageCode`, `sourceFormat`, `settings`, `encoding`.
   - `publicOwnerId` (ElevenLabs) et `voiceName` sont descriptifs : ils restent hors des
     empreintes.
3. **Règles du texte dit** pour la langue (`said-text.mjs`) : le test
   `tests-esm/voice/said-text.esm.test.mjs` exige que chaque mot qui suit un nombre dans le
   corpus soit classé. L'anglais n'en a pas besoin.
4. **Mention « voix de synthèse »** : `recorded_voice_hint` du fichier de traduction de la
   langue nomme le fournisseur. Elle part en ligne **avant** l'index de la langue, puisque la
   case s'affiche dès que la langue y entre.
5. **Nouveau fournisseur** :
   - un module dans `scripts/voice/providers/`, sur l'interface ci-dessus, avec les outils de
     `common.mjs` ;
   - son entrée dans `PROVIDERS` de `generate.mjs` : fabrique, variable de la clé, adresse
     de test, conseil quand la voix est inaccessible ;
   - des tests sur le modèle de `tests-esm/voice/mistral.esm.test.mjs`, sur les réponses
     réelles de l'API.

## Infra (dépôt `leapmultix-infra`, `voices.tf`)

Bucket privé `leapmultix-voices` (préfixe `voice/`, versionné), lu par la distribution du
site seulement ; `/voice/index.json` jamais en cache à la périphérie, `/voice/*` au cache de
l'objet. Voir `docs/voix-enregistree.md`, section « En place : l'infra ».

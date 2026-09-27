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

`scripts/voice/providers/` : un module par fournisseur (`elevenlabs.mjs`, `google.mjs`,
`mistral.mjs`),
avec la même interface :

- `credits()` : `{ used, limit }`, ou `null` si le solde n'est pas lisible ;
- `checkVoice(voice)` ;
- `synthesize({ text, voice, signal })`, qui rend `{ audio, requestId, cost }`.

Les erreurs sont des `ProviderError` (`providers/common.mjs`), classées par kind :

- `quota`, `auth`, `voice`, `response` arrêtent toute la génération ;
- `rate`, `server`, `network` sont réessayés ;
- `request` ne fait échouer que sa phrase.

Le classement est propre à chaque fournisseur :

|             | ElevenLabs (fr)                                      | Google (en, es)                                                                                | Mistral (Jane en anglais, Marie en français)                               |
| ----------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Clé         | `ELEVENLABS_API_KEY`, en-tête `xi-api-key`           | `GOOGLE_TTS_API_KEY` (classique, `AIza…`), en-tête `x-goog-api-key`                            | `MISTRAL_API_KEY`, en-tête `Authorization: Bearer`                         |
| Coût        | en-tête `character-cost` (≈ 0,53 crédit/caractère)   | inconnu de l'API ; 30 $ le million de caractères, le premier million du mois offert            | inconnu de l'API ; 16 $ le million de caractères                           |
| Solde       | `credits()` lisible, `--reserve`                     | aucun : `--max-total-chars` obligatoire                                                        | aucun : `--max-total-chars` obligatoire                                    |
| 401 / 403   | clé refusée (`auth`)                                 | clé refusée (`auth`), sauf 403 `BILLING_DISABLED` (`quota`) ; 400 `API_KEY_INVALID` : `auth`   | 401 clé refusée ; **403 : modération**, la phrase seule échoue (`request`) |
| Voix        | bibliothèque (préavis de 730 jours), `publicOwnerId` | Chirp 3 HD, une voix par langue (`es-ES-Chirp3-HD-Sulafat`) ; 400 « does not exist » : `voice` | voix prête (`retention_notice` : 30), ou clonage avec consentement         |
| Brut        | MP3 128 kb/s                                         | WAV sans perte (LINEAR16, `sourceFormat: "wav"`)                                               | MP3                                                                        |
| Identifiant | en-tête `request-id`                                 | aucun                                                                                          | en-tête `mistral-correlation-id`                                           |

## Autres voix d'une langue

Le menu « Voix » des réglages (v30) propose, dans une langue, plusieurs voix enregistrées :
en anglais, Sulafat (Google) et Jane (Mistral AI).

- **Déclaration** : `scripts/voice/alternatives.json`, `{ "<langue>": [ { …champs de
voices.json… } ] }`. `loadVoiceVersion(lang, version)` (`generate.mjs`) rend la voix par
  défaut sans version ou avec la sienne, sinon l'autre voix de cette version, sinon une erreur
  (« Aucune voix … »).
- **Index** : l'entrée de la langue garde la voix par défaut en tête, puis `alternatives`,
  chacune `{ voice, version, format, audience, provider }`. Le jeu écarte une autre voix
  invalide, au nom ou à la version déjà pris, ou au-delà de 4 ; `publish alternative` refuse
  de l'écrire. Un jeu d'avant la v30 ignore `alternatives` et `provider`.
- **Jeu** : menu visible dès que deux voix de la langue sont ouvertes à ce navigateur ;
  choix gardé par langue (`recordedVoiceChoice`), qui revient à la voix par défaut si le
  choix quitte l'index. Chaque voix a son moteur de clips ; la mention nomme son service
  (`recorded_voice_hint_<provider>`). Le service worker garde les clips de chaque version
  annoncée, par défaut ou autre. `Voice fallback` porte `{ cause, lang, voice }`.
- **Outils** : `--version` sur `generate.mjs`, `voice:review`, `voice:check`,
  `voice:listen`, `voice:check-online` et `voice:publish -- clips|local|alternative`.
  `voice:check-online --version` accepte un index qui annonce la version parmi les autres
  voix ; avant `alternative`, il lui faut `--allow-other-version`.
- **Publication** : `alternative --version <v> [--audience test|all]` ajoute ou met à jour
  l'autre voix, aux conditions de `index` (clips en ligne et identiques, corpus couvert) ;
  `--remove` la retire sans rien vérifier. La langue doit déjà être dans l'index. `index`
  garde les autres voix, sauf celle qui deviendrait la voix par défaut.

## Page d'écoute (`npm run voice:listen`)

`npm run voice:review -- --lang <l> [--compare <fichier>]` enchaîne Whisper, le contrôle et
cette page : c'est la commande habituelle. `voice:listen` refait seulement la page.

`scripts/voice/listen-page.mjs --lang <l> [--transcripts <fichier.jsonl>] [--sample <n>]
[--compare <fichier>] [--out <dépôt des voix>]` écrit une page HTML autonome dans
`ecoute/` du dépôt des voix et en affiche l'adresse `file://`.

- **Sans `--compare`** (`<l>-<version>.html`) : clips signalés, par les règles de
  `voice:check` (voir l'étape « Contrôles » du skill : nombres, ressemblance et mots en trop,
  durée rapportée au débit de la voix), puis un échantillon
  (`--sample`, 12 par défaut) des phrases dont le texte dit diffère : textes imposés
  (`SAID_OVERRIDES`) d'abord, puis les phrases où un nombre s'accorde en genre (« une fois 7 »,
  « una caja »), régulièrement espacées. En espagnol, où les nombres se disent en lettres,
  presque tous les textes dits diffèrent : seuls les accords s'écoutent. Sans
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

- **« ELEVENLABS_API_KEY manquante », « GOOGLE_TTS_API_KEY manquante » ou « MISTRAL_API_KEY
  manquante »**, ou « mal formée » :
  `--env-file` oublié, variable mal nommée ou valeur sur plusieurs lignes ; vérifier avec
  `grep -c`, jamais en l'affichant. La variable lue est celle du fournisseur de la voix.
- **« Crédits illisibles avec cette clé »** : donner `--max-total-chars` (ou `--max-chars`).
- **Mistral 403 (modération)** : la phrase est refusée à chaque essai. Texte dit de même
  sens dans `SAID_OVERRIDES`, ou voix de l'appareil pour elle (`--allow-missing` à la
  publication), au choix du propriétaire.
- **Mistral 429, Google 429** : débit dépassé, réessayé tout seul ; s'il revient souvent,
  baisser `--concurrency`.
- **Google 401 « API keys are not supported by this API »** (`CREDENTIALS_MISSING`) : clé liée
  à un compte de service (`AQ.…`, créée par AI Studio ou avec la case « Authentifier les appels
  d'API via un compte de service »). Créer une clé classique (`AIza…`), case décochée, restreinte
  à Cloud Text-to-Speech.
- **Google 403 `API_KEY_SERVICE_BLOCKED`** : la clé est restreinte à une autre API ; y ajouter
  Cloud Text-to-Speech. **403 `SERVICE_DISABLED`** : activer l'API dans le projet de la clé.
  **403 `BILLING_DISABLED`** : rattacher un compte de facturation, même pour le quota gratuit.
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
- **« n'existe pas pour <langue> »** (Google) : nom de voix ou code de langue faux ; lister
  les voix par `GET /v1/voices?languageCode=<xx-XX>`.
- **« n'existe plus ou n'est pas accessible »** (Mistral) : la voix prête a été retirée
  (préavis `retention_notice`) ou l'identifiant est faux ; lister les voix par
  `GET /v1/audio/voices`. Les clips déjà générés restent.
- **Une voix avale un mot ou une syllabe** (« rente » pour « trente », « Combien font 41 ? »
  pour « Combien font 49 moins 41 ? ») : Whisper sur le brut (`raw/<l>/s-<réglages>/`) dit si
  le défaut vient du modèle ou du traitement. Du modèle : une nouvelle prise suffit le plus
  souvent (`--redo`) ; s'il résiste, un texte dit propre à la voix (`saidOverrides`).
- **« Texte dit propre à la voix pour une phrase absente du corpus »** : clé de
  `saidOverrides` mal recopiée ; elle doit être la phrase exacte de `speak()`.
- **« Les réglages de la voix … ont changé »** : `voices.json` a changé sous une version
  existante ; remettre les réglages, ou créer une nouvelle version (nouvelle génération).
- **Clip signalé par Whisper** : le refaire d'abord, deux ou trois tours ; ne faire écouter
  que ce qui reste signalé. Whisper n'entend pas « un » / « une » (échantillon d'accords à
  l'écoute) et se trompe parfois sur les phrases courtes.
- **`curl` sur `/voice/` répond 403** : la fonction CloudFront `voice_guard` ne sert que les
  requêtes du jeu (`Sec-Fetch-Site: same-origin`) ; `check-online.mjs` envoie cet en-tête.
- **Clip absent en ligne** : 403 (pas de listage du bucket) ; le jeu passe à la voix de
  l'appareil pour cette phrase.

## Nouvelle langue ou nouvelle voix

1. **Choisir la voix.**
   - Faire un banc d'écoute avec le skill `comparing-voices` (`npm run voice:bench`) : 22
     phrases du vrai corpus dans les voix candidates, traitées comme les clips du jeu,
     passées dans Whisper, sur une page où le propriétaire choisit.
   - Voix disponibles :
     - ElevenLabs : `GET /v1/voices/<voice_id>` ;
     - Google : `GET /v1/voices?languageCode=<xx-XX>` (Cloud Text-to-Speech). Au 26/09/2026,
       30 voix Chirp 3 HD par langue, dont 14 féminines (Achernar, Aoede, Autonoe, Callirrhoe,
       Despina, Erinome, Gacrux, Kore, Laomedeia, Leda, Pulcherrima, Sulafat, Vindemiatrix,
       Zephyr), natives de la langue demandée. Gemini TTS (API Gemini) a aussi une bibliothèque
       de voix régionales, mais facture la durée de l'audio, sans quota gratuit ;
     - Mistral : `GET /v1/audio/voices`. Au 26/09/2026, les voix prêtes étaient Jane (femme)
       et Oliver en anglais britannique, Paul en anglais américain, et Marie (femme) en
       français, **aucune en espagnol**. Le modèle parle pourtant 9 langues : une voix d'une
       autre langue garde son accent, ou dit les nombres dans sa langue. Marie existe en six
       variantes (Neutral, Curious, Happy, Excited, Sad, Angry) : Curious a été retenue le
       27/09/2026 après un banc de 22 phrases face à Neutral (0 doute de Whisper pour les
       deux).
2. **Ajouter l'entrée de la langue** dans `scripts/voice/voices.json` : `provider`, `voice`
   (nom de l'index : `^[a-z0-9][a-z0-9-]{0,31}$`), `version`, `voiceId`, `model`,
   `languageCode`, `sourceFormat`, `settings`, `encoding`.
   - `publicOwnerId` (ElevenLabs) et `voiceName` sont descriptifs : ils restent hors des
     empreintes.
3. **Règles du texte dit** pour la langue (`said-text.mjs`) : le test
   `tests-esm/voice/said-text.esm.test.mjs` exige que chaque mot qui suit un nombre dans le
   corpus soit classé. L'anglais n'en a pas besoin.
4. **Mention « voix de synthèse »** : `recorded_voice_hint_<provider>` (fr, en, es) nomme le
   service de la voix entendue, d'après le `provider` de l'index ; `recorded_voice_hint` de la
   langue sert quand l'index ne le donne pas, et doit nommer le service de sa voix par défaut.
   Elles partent en ligne **avant** l'index de la langue, puisque la case s'affiche dès que la
   langue y entre.
5. **Nouveau fournisseur** :
   - un module dans `scripts/voice/providers/`, sur l'interface ci-dessus, avec les outils de
     `common.mjs` ;
   - son entrée dans `PROVIDERS` de `generate.mjs` : fabrique, variable de la clé, adresse
     de test, conseil quand la voix est inaccessible ;
   - des tests sur le modèle de `tests-esm/voice/google.esm.test.mjs` ou `mistral.esm.test.mjs`, sur les réponses
     réelles de l'API ;
   - côté jeu : son nom dans `VOICE_PROVIDERS` (`js/core/voice-index.js`) et
     `PROVIDER_LABELS` (`js/voice-clips.js`), sa mention `recorded_voice_hint_<provider>` en
     fr, en et es. Sans eux, l'index publié ne porte pas son `provider`, le menu la nomme sans
     service et la mention reste celle de la langue.

## Infra (dépôt `leapmultix-infra`, `voices.tf`)

Bucket privé `leapmultix-voices` (préfixe `voice/`, versionné), lu par la distribution du
site seulement ; `/voice/index.json` jamais en cache à la périphérie, `/voice/*` au cache de
l'objet. Voir `docs/voix-enregistree.md`, section « En place : l'infra ».

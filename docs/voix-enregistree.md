# Voix enregistrée

LeapMultix lit à voix haute les questions, les encouragements et les explications. La
synthèse du navigateur rend très différemment selon l'appareil : bonne sous Chrome
Linux, mais imposée et lente sur Android, compacte sur Mac et iPhone. La version v21
l'a donc coupée par défaut (#53).

La voix enregistrée remplace cette synthèse par des phrases pré-enregistrées, avec
repli automatique sur la voix de l'appareil. Ce document décrit le choix, ce qui est en
place et ce qui vient ensuite.

## Choix

- **Voix** : ElevenLabs, voix de bibliothèque « Lucie » (`YxrwjAKoUKULGd0g8K9Y`, préavis
  de retrait de 730 jours), modèle Eleven v3, retenue après un banc d'écoute. Un essai
  sur la table de 7 a été validé sur téléphone.
- **Corpus fini** : le jeu ne dit qu'environ 7 400 phrases par langue. Elles sont
  toutes enregistrées à l'avance ; aucun appel à ElevenLabs pendant une partie.
- **Format** : MP3 mono. Safari et iOS ne lisent l'Opus en WebM qu'à partir de 17.4
  (en partie) et 18.4.
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

Chiffres au moment de l'écriture : 7 437 phrases par langue, 221 587 caractères en
français.

## À venir

1. **File de parole unique** (`js/speech.js`) : une annonce va au bout, la phrase
   suivante attend, sans collage ; arrêts propres (changement de mode, de langue,
   onglet caché) ; déverrouillage du son sur iPhone au premier toucher.
2. **Outils de génération** (`scripts/voice/`) : génération, contrôles et envoi,
   décrits ci-dessous.
3. **Lecteur de clips** : index `/voice/index.json` (voix, version, audience, défaut),
   lecture et repli, service worker, réglage « Voix enregistrée » ; les textes de
   l'interface ajoutés passent eux aussi par les trois langues.
4. **Infra** (dépôt `leapmultix-infra`) : bucket privé, seconde origine CloudFront,
   règles de cache propres à `/voice/*`, `blob:` dans la CSP.

## Génération des clips

Tout est scripté ; le script tourne sur le poste du propriétaire, jamais dans la CI
publique (clé ElevenLabs et dépôt privé).

1. **Portes** : crédits suffisants et licence confirmée, avant toute génération payante.
2. **Estimation** : `--dry-run` compte les caractères, donc les crédits.
3. **Génération** incrémentale : seules les phrases nouvelles ou modifiées sont
   générées. Le texte envoyé peut différer de la phrase-clé quand la prononciation
   l'exige (« une boîte », « vingt et une billes », en espagnol « una caja »).
   Silences rognés, volume égalisé (−20 LUFS), MP3 mono ; sortie dans le dépôt privé.
4. **Contrôles** : chaque phrase a son fichier ; transcription Whisper **en local**
   (modèle `large-v3-turbo`), qui compare les nombres entendus à ceux de la phrase et
   liste les clips à réécouter ; écoute d'un échantillon, surtout des formes féminines,
   que Whisper ne distingue pas (« un » et « une » s'écrivent « 1 »).
5. **Envoi** : les clips d'abord (`audio/mpeg`, cache long et immuable), une
   vérification en ligne, puis l'index (`no-cache`) et son invalidation CloudFront.
6. **Ouverture par étapes** : testeurs (`?voix=test`), puis les joueurs qui avaient
   allumé la voix, puis la voix activée par défaut.

Un clip publié n'est jamais réécrit : une correction crée une nouvelle version.
**Coupe-circuit** : retirer la langue de l'index, puis l'invalider ; le jeu revient à
la voix de l'appareil au prochain chargement en ligne.

## Licence et mentions

- La licence de l'audio est à confirmer avant la génération payante.
- Les mentions « voix de synthèse » et les crédits sont en ligne avant l'ouverture au
  public.
- Les adresses des clips se déduisent du texte public : l'audio peut être téléchargé
  en masse, comme tout son d'un site.

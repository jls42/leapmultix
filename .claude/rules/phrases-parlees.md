---
paths:
  - 'scripts/voice/**'
  - 'js/speech.js'
  - 'js/voice-*.js'
  - 'js/core/spoken-text.js'
  - 'js/core/message-format.js'
  - 'js/core/operations/**'
  - 'js/core/adventure-data.js'
  - 'js/modes/**'
  - 'assets/translations/*.json'
  - 'tests-esm/voice/**'
  - 'docs/voix-enregistree.md'
---

# Phrases parlées : corpus et verrou

**Règle, sans exception : une phrase dite modifiée se réenregistre avant sa mise en prod.**
Chaque phrase que le jeu lit à voix haute a son clip MP3 dans chaque voix de sa langue
(voix par défaut : Lucie en français, Sulafat en anglais et en espagnol ; d'autres au choix du
joueur), retrouvé par l'empreinte du texte exact. Toucher ce texte
(traduction fr/en/es, gabarit, forme d'une question, plage d'opérandes, nouvelle phrase) le
prive de clip : le jeu la lit alors avec la voix de l'appareil, sans erreur ni alerte. Donc,
dans la même PR que le changement de texte :

1. le test du verrou échoue exprès : c'est le rappel ;
2. générer les clips manquants avec le skill `generating-voice-clips` (payant : estimation
   `--dry-run` d'abord, accord du propriétaire), contrôler (Whisper, `voice:check`, refaits
   tant que Whisper doute), faire écouter ce qu'il n'a pas validé et un échantillon
   d'accords (page d'écoute : `npm run voice:listen`) ;
3. publier les nouveaux clips (`voice:publish clips`, puis `voice:check-online`) **avant**
   de fusionner, puis `npm run voice:corpus:lock`.

Un clip qui reste mal dit après plusieurs essais reçoit un texte dit imposé
(`SAID_OVERRIDES` de `scripts/voice/said-text.mjs`, par exemple un nombre en toutes
lettres) : la phrase affichée et l'empreinte du clip ne changent pas.

Tout ce que le jeu lit à voix haute est énuméré par `scripts/voice/corpus.mjs`, à partir
du code du jeu (opérations, formateur, formes parlées de `js/core/spoken-text.js`, données
des modes). `scripts/voice/corpus.lock.json` garde, par langue, le nombre de phrases et
leur empreinte.

- Changer une phrase parlée fait échouer `tests-esm/voice/corpus.esm.test.mjs` : clips
  d'abord (ci-dessus), verrou ensuite.
- Un nouvel appel à `speak()` fait échouer `tests-esm/voice/speak-inventory.esm.test.mjs` :
  ajouter sa phrase au corpus, puis mettre l'inventaire à jour.
- `tests-esm/voice/modes-in-corpus.esm.test.mjs` fait jouer les vrais modes dans les trois
  langues et exige que chaque phrase dite soit dans le corpus.
- `npm run voice:corpus` résume le corpus ; `--list fr` en donne les phrases.

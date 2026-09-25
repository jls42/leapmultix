#!/usr/bin/env python3
"""Transcrit les clips d'une voix avec Whisper, en local (faster-whisper), pour contrôle.

Usage :
  python3 scripts/voice/whisper_transcribe.py --manifest <dépôt>/manifests/fr/<version>.json \\
      --clips <dépôt>/clips/fr/<version> --lang fr --out transcripts-fr.jsonl

Écrit une ligne JSON par clip : {"key": ..., "sha256": ..., "heard": ...}, que lit
`node scripts/voice/check.mjs --transcripts`. Reprend là où il s'est arrêté : un clip déjà
transcrit dans le fichier de sortie (ou dans ceux de --also-done) est sauté, sauf si son
contenu a changé depuis (sha256 du manifeste différent, clip refait par --redo).

Plusieurs processus se partagent un GPU avec --shard K/N (clips dont le rang modulo N vaut
K), chacun avec son fichier de sortie ; concaténer les fichiers pour check.mjs.

Un agent lance ce script (skill generating-voice-clips) : chaque chemin est résolu, liens
compris, avant tout accès au disque. Il est refusé s'il sort du dossier courant, du dossier
personnel et du dossier temporaire, ou s'il n'a pas le type attendu : manifeste .json,
dossier des clips, fichiers de transcriptions .jsonl (ceux de --also-done existent déjà).

Installation (une fois) :
  python3 -m venv .venv-whisper
  .venv-whisper/bin/pip install -r scripts/voice/requirements-whisper.txt
Le modèle (large-v3-turbo, ~1,6 Go) se télécharge au premier lancement ; sur GPU NVIDIA,
compter une dizaine de minutes pour 7 500 clips, bien plus sur CPU.
"""

import argparse
import json
import os
import sys
import tempfile
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--clips", required=True)
    parser.add_argument("--lang", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--model", default="large-v3-turbo")
    parser.add_argument("--device", default="auto", choices=["auto", "cuda", "cpu"])
    parser.add_argument("--shard", default="0/1", help="part K/N des clips (défaut : tous)")
    parser.add_argument("--also-done", action="append", default=[],
                        help="autre fichier de transcriptions dont les clips sont sautés")
    args = parser.parse_args()
    # Aucun chemin ne sert tel que tapé : chacun est remplacé par sa version vérifiée
    args.manifest = existing_file("--manifest", args.manifest, ".json")
    args.clips = existing_dir("--clips", args.clips)
    args.out = output_file("--out", args.out)
    args.also_done = [existing_file("--also-done", extra, ".jsonl") for extra in args.also_done]
    return args


def allowed_roots():
    """Arborescences où le script lit et écrit : dossiers courant, personnel et temporaire"""
    return {os.path.realpath(root) for root in (os.getcwd(), Path.home(), tempfile.gettempdir())}


def resolved(flag, value):
    """Chemin réel d'un argument, liens résolus, refusé hors des arborescences permises"""
    path = os.path.realpath(value)
    for root in allowed_roots():
        if os.path.commonpath([root, path]) == root:
            return path
    raise SystemExit(f"{flag} {value} : hors des dossiers courant, personnel et temporaire")


def existing_file(flag, value, suffix):
    path = resolved(flag, value)
    if not (path.endswith(suffix) and os.path.isfile(path)):
        raise SystemExit(f"{flag} {value} : fichier {suffix} introuvable")
    return Path(path)


def existing_dir(flag, value):
    path = resolved(flag, value)
    if not os.path.isdir(path):
        raise SystemExit(f"{flag} {value} : dossier introuvable")
    return Path(path)


def output_file(flag, value):
    """Transcriptions .jsonl : fichier existant (reprise) ou à créer dans un dossier existant"""
    path = resolved(flag, value)
    if not path.endswith(".jsonl"):
        raise SystemExit(f"{flag} {value} : fichier .jsonl attendu")
    creatable = not os.path.exists(path) and os.path.isdir(os.path.dirname(path))
    if not (os.path.isfile(path) or creatable):
        raise SystemExit(f"{flag} {value} : ni un fichier, ni à créer dans un dossier existant")
    return Path(path)


def load_model(name, device):
    import ctranslate2
    from faster_whisper import WhisperModel

    if device == "auto":
        device = "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
    compute = "float16" if device == "cuda" else "int8"
    print(f"Modèle {name} sur {device} ({compute})", file=sys.stderr)
    return WhisperModel(name, device=device, compute_type=compute)


def done_pairs(out):
    """Clips déjà transcrits : (empreinte, sha256) ; sha256 vaut None pour une ligne ancienne"""
    if not out.exists():
        return set()
    with out.open(encoding="utf-8") as handle:
        lines = [json.loads(line) for line in handle if line.strip()]
    return {(line["key"], line.get("sha256")) for line in lines}


def is_done(key, sha256, already):
    """Transcrit dans l'état actuel du clip, ou par une ligne ancienne sans sha256"""
    return (key, sha256) in already or (key, None) in already


def pending(clips, already, shard):
    """Clips de la part K/N (--shard) qui restent à transcrire"""
    part, parts = (int(n) for n in shard.split("/"))
    return [key for index, key in enumerate(sorted(clips))
            if index % parts == part and not is_done(key, clips[key].get("sha256"), already)]


def transcribe_all(model, args, clips, todo):
    """Ajoute au fichier de sortie une ligne par clip transcrit"""
    with args.out.open("a", encoding="utf-8") as out:
        for index, key in enumerate(todo, 1):
            segments, _ = model.transcribe(
                str(args.clips / f"{key}.mp3"),
                language=args.lang,
                beam_size=5,
                temperature=0.0,
                vad_filter=False,
                condition_on_previous_text=False,
                without_timestamps=True,
            )
            heard = "".join(segment.text for segment in segments).strip()
            line = {"key": key, "sha256": clips[key].get("sha256"), "heard": heard}
            out.write(json.dumps(line, ensure_ascii=False) + "\n")
            if index % 250 == 0:
                out.flush()
                print(f"  {index}/{len(todo)}", file=sys.stderr)


def main():
    args = parse_args()
    clips = json.loads(args.manifest.read_text(encoding="utf-8"))["clips"]
    already = done_pairs(args.out)
    for extra in args.also_done:
        already |= done_pairs(extra)
    todo = pending(clips, already, args.shard)
    print(f"{len(todo)} clips à transcrire ({len(already)} déjà faits)", file=sys.stderr)
    if todo:
        transcribe_all(load_model(args.model, args.device), args, clips, todo)


if __name__ == "__main__":
    main()

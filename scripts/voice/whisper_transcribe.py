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

Installation (une fois) :
  python3 -m venv .venv-whisper
  .venv-whisper/bin/pip install -r scripts/voice/requirements-whisper.txt
Le modèle (large-v3-turbo, ~1,6 Go) se télécharge au premier lancement ; sur GPU NVIDIA,
compter une dizaine de minutes pour 7 500 clips, bien plus sur CPU.
"""

import argparse
import json
import sys
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--clips", required=True, type=Path)
    parser.add_argument("--lang", required=True)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--model", default="large-v3-turbo")
    parser.add_argument("--device", default="auto", choices=["auto", "cuda", "cpu"])
    parser.add_argument("--shard", default="0/1", help="part K/N des clips (défaut : tous)")
    parser.add_argument("--also-done", action="append", type=Path, default=[],
                        help="autre fichier de transcriptions dont les clips sont sautés")
    return parser.parse_args()


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


def main():
    args = parse_args()
    clips = json.loads(args.manifest.read_text(encoding="utf-8"))["clips"]
    already = done_pairs(args.out)
    for extra in args.also_done:
        already |= done_pairs(extra)

    def is_done(key):
        return (key, clips[key].get("sha256")) in already or (key, None) in already

    part, parts = (int(n) for n in args.shard.split("/"))
    todo = [key for index, key in enumerate(sorted(clips))
            if index % parts == part and not is_done(key)]
    print(f"{len(todo)} clips à transcrire ({len(already)} déjà faits)", file=sys.stderr)
    if not todo:
        return 0
    model = load_model(args.model, args.device)
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
    return 0


if __name__ == "__main__":
    sys.exit(main())

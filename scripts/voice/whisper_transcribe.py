#!/usr/bin/env python3
"""Transcrit les clips d'une voix avec Whisper, en local (faster-whisper), pour contrôle.

Usage :
  python3 scripts/voice/whisper_transcribe.py --manifest <dépôt>/manifests/fr/<version>.json \\
      --clips <dépôt>/clips/fr/<version> --lang fr --out transcripts-fr.jsonl

Écrit une ligne JSON par clip : {"key": ..., "heard": ...}, que lit
`node scripts/voice/check.mjs --transcripts`. Reprend là où il s'est arrêté : les clips
déjà présents dans le fichier de sortie (ou dans ceux de --also-done) sont sautés.

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


def done_keys(out):
    if not out.exists():
        return set()
    with out.open(encoding="utf-8") as handle:
        return {json.loads(line)["key"] for line in handle if line.strip()}


def main():
    args = parse_args()
    clips = json.loads(args.manifest.read_text(encoding="utf-8"))["clips"]
    already = done_keys(args.out)
    for extra in args.also_done:
        already |= done_keys(extra)
    part, parts = (int(n) for n in args.shard.split("/"))
    todo = [key for index, key in enumerate(sorted(clips))
            if index % parts == part and key not in already]
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
            out.write(json.dumps({"key": key, "heard": heard}, ensure_ascii=False) + "\n")
            if index % 250 == 0:
                out.flush()
                print(f"  {index}/{len(todo)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Prépare la page d'écoute d'un lot de bruitages, à publier en artifact privé.

  python3 -I .claude/skills/generating-sound-effects/page.py <lot> <dossier de sortie>

Chaque candidat d'analysis/sons/<lot>/ est mesuré (attaque, crête, nombre de coups), ramené à
la même force (−20 dBFS rms sur la partie qui sonne, crêtes à −3 dBFS au plus : on compare des
sons, pas des volumes) et écrit en mono dans <sortie>/a/. Un son presque muet (crête sous
−20 dBFS) est écarté. Le son de référence du lot (celui du jeu qui sonne en même temps) est
copié tel quel. Écrit aussi <sortie>/sons.json (lu par la page) et <sortie>/<lot>.html.
Demande ffmpeg et numpy.
"""
import json
import math
import pathlib
import subprocess
import sys

import numpy as np

SKILL = pathlib.Path(__file__).resolve().parent
ROOT = SKILL.parents[2]
RATE = 44100
TARGET_RMS = -20.0
PEAK_MAX = -3.0
SILENT_PEAK = -20.0
BARS = 40


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(RATE),
                          "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def encode(samples, path):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(RATE), "-ac", "1", "-i", "-",
                    "-b:a", "128k", str(path)], input=samples.astype(np.float32).tobytes(), check=True)


def decibels(value):
    return 20 * math.log10(max(value, 1e-9))


def envelope(samples):
    step = max(1, len(samples) // BARS)
    bars = [float(np.max(np.abs(samples[i:i + step]))) for i in range(0, step * BARS, step)]
    top = max(bars) or 1.0
    return [round(b / top, 3) for b in bars]


def hits(bars):
    """Coups entendus : chaque remontée au-dessus de 40 % après un creux sous 25 %."""
    count, low = 0, True
    for level in bars:
        if low and level >= 0.4:
            count, low = count + 1, False
        elif level < 0.25:
            low = True
    return count


def describe(samples, bars):
    peak_at = int(np.argmax(np.abs(samples))) * 1000 // RATE
    loud = np.flatnonzero(np.abs(samples) > 0.1 * np.max(np.abs(samples)))
    attack = int(loud[0]) * 1000 // RATE if loud.size else 0
    n = hits(bars)
    shots = "un seul coup" if n == 1 else f"{n} coups"
    return f"{shots}, attaque à {attack} ms, le plus fort à {peak_at} ms"


def normalize(samples):
    sounding = samples[np.abs(samples) > 10 ** (-50 / 20)]
    rms = decibels(float(np.sqrt(np.mean(sounding ** 2)))) if sounding.size else -99.0
    peak = decibels(float(np.max(np.abs(samples))))
    gain = min(10 ** ((TARGET_RMS - rms) / 20), 10 ** ((PEAK_MAX - peak) / 20))
    return samples * gain, peak


def main(argv):
    if len(argv) != 2:
        sys.exit(__doc__)
    lot = json.loads((SKILL / "lots" / f"{argv[0]}.json").read_text(encoding="utf-8"))
    out = pathlib.Path(argv[1])
    (out / "a").mkdir(parents=True, exist_ok=True)
    notes = lot.get("notes", {})
    sounds = []
    for path in sorted((ROOT / "analysis/sons" / lot["lot"]).glob("*.mp3")):
        sound_id = path.stem.removeprefix(f"{lot['lot']}-")
        samples = decode(path)
        level, peak = normalize(samples)
        if peak < SILENT_PEAK:
            print(f"{sound_id} : écarté, presque muet (crête {peak:.1f} dBFS)")
            continue
        encode(level, out / "a" / f"{sound_id}.mp3")
        bars = envelope(level)
        sounds.append({"id": sound_id, "name": sound_id.replace("-", " ").capitalize(),
                       "desc": notes.get(sound_id, describe(samples, bars)), "envelope": bars})
        print(f"{sound_id} : {sounds[-1]['desc']}")
    reference = lot.get("reference")
    if reference:
        encode(decode(ROOT / reference["file"]), out / "a" / "reference.mp3")
    page = {"lot": lot["lot"], "title": lot.get("title", f"Bruitages {lot['lot']}"),
            "intro": lot.get("intro", ""), "sounds": sounds, "reference": reference}
    (out / "sons.json").write_text(json.dumps(page, ensure_ascii=False), encoding="utf-8")
    template = (SKILL / "page.html").read_text(encoding="utf-8")
    (out / f"{lot['lot']}.html").write_text(template.replace("__TITRE__", page["title"]), encoding="utf-8")
    files = {f"a/{p.name}": str(p) for p in sorted((out / "a").glob("*.mp3"))}
    files["sons.json"] = str(out / "sons.json")
    print(json.dumps({"file_path": str(out / f"{lot['lot']}.html"), "files": files}, indent=2))


main(sys.argv[1:])

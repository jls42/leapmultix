#!/usr/bin/env python3
"""Bruitages de LeapMultix par ElevenLabs (sound-generation), un lot à la fois.

Un lot (lots/<nom>.json) liste les consignes ; chaque son est écrit dans analysis/sons/<lot>/
(non versionné), avec sa fiche : consigne, réglages, crédits facturés (en-tête character-cost).
Rien n'entre dans le jeu avant le choix du propriétaire.

  python3 -I .claude/skills/generating-sound-effects/generate.py usage
  python3 -I .claude/skills/generating-sound-effects/generate.py plan <lot>
  python3 -I .claude/skills/generating-sound-effects/generate.py generate <lot>

La clé est lue sur sa seule ligne ELEVENLABS_API_KEY : variable d'environnement, sinon le .env
du dépôt des voix (../leapmultix-voices/.env). Elle n'est jamais affichée ni écrite ailleurs.
Le plafond du lot (« ceiling ») borne la dépense : aucun son ne part si son estimation le
dépasse ; un son déjà là n'est pas refait (le lot se reprend).
"""
import json
import os
import pathlib
import sys
import urllib.error
import urllib.request

SKILL = pathlib.Path(__file__).resolve().parent
ROOT = SKILL.parents[2]
ENV_FILE = ROOT.parent / "leapmultix-voices/.env"
API = "https://api.elevenlabs.io/v1"
MODEL = "eleven_text_to_sound_v2"
# Prix documenté : 40 crédits par seconde demandée ; mesuré le 16/11/2026 : 6 pour 0,5 s.
# L'estimation reste le prix documenté, une borne haute.
CREDITS_PER_SECOND = 40


def key():
    value = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if value:
        return value
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        name, sep, value = line.partition("=")
        if sep and name.strip().removeprefix("export ").strip() == "ELEVENLABS_API_KEY":
            return value.strip().strip("\"'")
    sys.exit(f"ÉCHEC : pas de ELEVENLABS_API_KEY dans l'environnement ni dans {ENV_FILE}")


def request(path, body=None):
    data = json.dumps(body).encode("utf-8") if body is not None else None
    url = f"{API}{path}"
    # Toujours l'API, en https : jamais file:/ ni un autre schéma ou un autre hôte
    if not url.startswith("https://api.elevenlabs.io/"):
        sys.exit(f"ÉCHEC : adresse refusée {url}")
    req = urllib.request.Request(url, data=data, method="POST" if data else "GET")
    req.add_header("xi-api-key", key())
    if data:
        req.add_header("Content-Type", "application/json")
    try:
        # Adresse vérifiée juste au-dessus (l'API, en https) : Bandit (B310) la signale quand même
        with urllib.request.urlopen(req, timeout=300) as response:  # nosec B310
            return response.read(), response.headers.get("character-cost", "")
    except urllib.error.HTTPError as error:
        sys.exit(f"ÉCHEC HTTP {error.code} sur {path} : {error.read().decode('utf-8', 'replace')[:300]}")


def load(name):
    path = SKILL / "lots" / f"{name}.json"
    if not path.exists():
        sys.exit(f"ÉCHEC : lot introuvable {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def estimate(entry):
    return round(CREDITS_PER_SECOND * entry["duration"])


def usage():
    raw, _ = request("/user/subscription")
    info = json.loads(raw)
    used, limit = info.get("character_count", 0), info.get("character_limit", 0)
    print(f"crédits : {used} utilisés sur {limit}, reste {limit - used}")


def plan(lot):
    total = 0
    for entry in lot["sounds"]:
        cost = estimate(entry) * entry.get("variations", 1)
        total += cost
        print(f"{entry['name']} × {entry.get('variations', 1)}, {entry['duration']} s : ≤ {cost} crédits")
    print(f"total ≤ {total} crédits (plafond du lot : {lot['ceiling']})")


def generate(lot):
    out = ROOT / "analysis/sons" / lot["lot"]
    out.mkdir(parents=True, exist_ok=True)
    paid = sum(json.loads(p.read_text(encoding="utf-8"))["credits"] for p in out.glob("*.json"))
    for entry in lot["sounds"]:
        for n in range(1, entry.get("variations", 1) + 1):
            target = out / f"{lot['lot']}-{entry['name']}-{n}.mp3"
            if target.exists():
                continue
            if paid + estimate(entry) > lot["ceiling"]:
                sys.exit(f"ARRÊT : plafond de {lot['ceiling']} crédits ({paid} déjà payés)")
            body = {"text": entry["prompt"], "model_id": MODEL, "duration_seconds": entry["duration"],
                    "prompt_influence": entry.get("promptInfluence", 0.5), "loop": False}
            audio, billed = request("/sound-generation?output_format=mp3_44100_128", body)
            cost = int(billed) if billed.isdigit() else estimate(entry)
            paid += cost
            target.write_bytes(audio)
            sidecar = {"prompt": entry["prompt"], "model": MODEL, "duration": entry["duration"],
                       "credits": cost, "creditsFrom": "character-cost" if billed.isdigit() else "estimate"}
            target.with_suffix(".json").write_text(json.dumps(sidecar, ensure_ascii=False, indent=2))
            print(f"{target.relative_to(ROOT)} : {cost} crédits")
    print(f"payé pour ce lot : {paid} crédits")


def main(argv):
    if argv[:1] == ["usage"]:
        return usage()
    if len(argv) != 2 or argv[0] not in ("plan", "generate"):
        sys.exit(__doc__)
    lot = load(argv[1])
    return plan(lot) if argv[0] == "plan" else generate(lot)


main(sys.argv[1:])

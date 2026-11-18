#!/bin/bash
#
# Clé du cache des images générées (assets/generated-images/), lue par le job « images » de la
# CI (.github/workflows/ci.yml) : l'empreinte de tout ce qui détermine leur contenu.
# - les originaux (assets/images/, que lit scripts/generate-responsive-assets.cjs) ;
# - le générateur et les modules qu'il charge (GENERATOR_FILES, liste tenue à jour par
#   tests-esm/scripts/generated-images-key.test.mjs) ;
# - les versions de sharp et de libvips (package-lock.json).
# Une seule de ces entrées qui change, et la clé change : la CI régénère alors toutes les
# images, comme sans cache.
#
# Usage : bash scripts/generated-images-key.sh   (depuis la racine du dépôt)
# Sortie : generated-images-v1-<empreinte>

set -euo pipefail
export LC_ALL=C

GENERATOR_FILES=(
    scripts/generate-responsive-assets.cjs
    scripts/lib/in-sequence.cjs
    js/arcade-sprite-catalog.js
    js/core/seasons.js
)

empreinte=$(
    {
        find assets/images -type f -print0 | sort -z | xargs -0 -r sha256sum
        sha256sum "${GENERATOR_FILES[@]}"
        jq -r '.packages | to_entries[]
            | select(.key == "node_modules/sharp" or (.key | startswith("node_modules/@img/")))
            | "\(.key)@\(.value.version)"' package-lock.json
    } | sha256sum | cut -c1-40
)

echo "generated-images-v1-$empreinte"

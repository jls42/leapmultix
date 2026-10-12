#!/bin/bash
#
# Garde-fou des images générées (assets/generated-images/) avant le déploiement, appelé par
# les deux jobs de la CI (.github/workflows/ci.yml) :
# - la synchronisation S3 utilise --delete : une génération absente ou partielle effacerait
#   les images du site ;
# - les images viennent du job « images » (artefact), le seul à exécuter le code des
#   dépendances npm : rien d'autre que des images (.webp, .png) et leur carte
#   (image-map.json), en fichiers ordinaires, ne doit partir avec elles.
#
# Usage : bash scripts/check-generated-images.sh   (depuis la racine du dépôt)

set -eu

DIR=assets/generated-images

if [[ ! -d "$DIR" || -L "$DIR" ]]; then
    echo "::error::$DIR absent, ou lien symbolique : déploiement interrompu"
    exit 1
fi

sources=$(find assets/images img -name '*.png' | wc -l)
generes=$(find "$DIR" -type f | wc -l)
echo "PNG sources : $sources — fichiers générés : $generes"
if (( generes < sources )); then
    echo "::error::Génération incomplète — déploiement interrompu"
    exit 1
fi

inattendus=$(find "$DIR" -mindepth 1 ! -type d \
    ! \( -type f \( -name '*.webp' -o -name '*.png' -o -path "$DIR/image-map.json" \) \) -print)
if [[ -n "$inattendus" ]]; then
    echo "::error::Fichiers inattendus parmi les images générées — déploiement interrompu"
    sed -n '1,10p' <<< "$inattendus"
    exit 1
fi
echo "Images générées complètes, rien d'autre que des images."

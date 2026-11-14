#!/bin/bash
#
# Images d'une fête obtenues en recolorant les dessins d'origine, sans les redessiner : chaque
# ligne de scripts/seasons/<fête>/recolor.tsv donne une image source, une méthode et son
# réglage ; la sortie est « <source>_<fête>.png », à la même taille. Pour ce qui doit se
# raccorder case à case (textures du plateau), qu'un dessin refait ne garantirait pas. Le
# serpent de MultiSnake, lui, est dessiné par le code (son habit : js/multisnake-skins.js).
#
# Méthode (teintes de -modulate d'ImageMagick : 100 garde la couleur, chaque pas de 100
# tourne de 180°) :
# - teinte <luminosité,saturation,teinte> : toute l'image (herbe, murs).
#
# Usage : bash scripts/seasons/recolor.sh <fête>   (depuis la racine du dépôt)
# Prérequis : ImageMagick (convert, identify).

set -eu

SEASON="${1:?usage : recolor.sh <fête>}"
LIST="scripts/seasons/$SEASON/recolor.tsv"

[[ -f "$LIST" ]] || { echo "Liste introuvable : $LIST" >&2; exit 1; }
for tool in convert identify; do
    command -v "$tool" >/dev/null || { echo "Outil manquant : $tool" >&2; exit 1; }
done

while IFS=$'\t' read -r source method setting; do
    [[ -z "$source" || "$source" == \#* ]] && continue
    [[ -s "$source" ]] || { echo "Image absente : $source" >&2; exit 1; }
    target="${source%.png}_$SEASON.png"
    case "$method" in
        teinte)
            convert "$source" -modulate "$setting" "$target" ;;
        *)
            echo "Méthode inconnue : $method ($source)" >&2
            exit 1 ;;
    esac
    if [[ "$(identify -format '%wx%h' "$source")" != "$(identify -format '%wx%h' "$target")" ]]; then
        echo "Taille changée : $target" >&2
        exit 1
    fi
    echo "fait : $target"
done <"$LIST"

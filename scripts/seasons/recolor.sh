#!/bin/bash
#
# Images d'une fête obtenues en recolorant les dessins d'origine, sans les redessiner : chaque
# ligne de scripts/seasons/<fête>/recolor.tsv donne une image source, une méthode et son
# réglage ; la sortie est « <source>_<fête>.png », à la même taille. Pour ce qui doit se
# raccorder case à case (morceaux du serpent, textures du plateau), qu'un dessin refait ne
# garantirait pas.
#
# Méthodes (teintes de -modulate d'ImageMagick : 100 garde la couleur, chaque pas de 100
# tourne de 180°) :
# - serpent <teinte du dos> <teinte du ventre> : seuls les verts tournent, le vert du dos vers
#   une teinte, le vert-jaune du ventre vers une autre ; yeux, langue et transparence gardés ;
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
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# Serpent : dos et ventre recolorés séparément, d'après la teinte HSL (0 à 1) de chaque point
snake() {
    local source="$1" target="$2" back_hue="$3" belly_hue="$4"
    convert "$source" -alpha off -colorspace HSL -channel R -separate +channel "$work/hue.png"
    convert "$work/hue.png" -fx 'u>=0.19&&u<0.29' "$work/belly.png"
    convert "$work/hue.png" -fx 'u>=0.29&&u<0.50' "$work/back.png"
    convert "$source" -modulate 100,105,"$back_hue" "$work/back-color.png"
    convert "$source" -modulate 100,110,"$belly_hue" "$work/belly-color.png"
    convert "$source" "$work/back-color.png" "$work/back.png" -composite \
        "$work/belly-color.png" "$work/belly.png" -composite \
        \( "$source" -alpha extract \) -compose CopyOpacity -composite "$target"
}

while IFS=$'\t' read -r source method setting; do
    [[ -z "$source" || "$source" == \#* ]] && continue
    [[ -s "$source" ]] || { echo "Image absente : $source" >&2; exit 1; }
    target="${source%.png}_$SEASON.png"
    case "$method" in
        serpent)
            read -r back belly <<<"$setting"
            snake "$source" "$target" "$back" "$belly" ;;
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

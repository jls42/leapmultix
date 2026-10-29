#!/bin/bash
#
# Costumes d'une fête : chaque ligne de scripts/seasons/<fête>/prompts.tsv devient une image,
# dessinée par Codex (outil image_gen de la CLI, compris dans l'abonnement ChatGPT : aucune clé
# d'API, rien de facturé) à partir des dessins d'origine joints en référence.
#
# - Reprenable : une cible déjà là et conforme est sautée. Pour en refaire une, l'effacer, ou
#   la nommer en argument (elle est alors redessinée même si elle existe).
# - À court de quota, le script attend la remise à zéro que Codex écrit dans le journal de ses
#   sessions (rate_limits : fenêtre de 5 h et semaine), plus une minute, puis reprend.
# - Codex travaille dans un dossier temporaire hors du dépôt (il y lirait sinon AGENTS.md) ;
#   l'image est ensuite mise au format de sa cible (taille exacte, transparence contrôlée).
# - Journal et planche de contact, dans l'ordre de la liste : analysis/seasons/<fête>/.
#
# Usage : bash scripts/seasons/dress-up.sh <fête> [cible…]   (depuis la racine du dépôt)
# Prérequis : codex (connecté), jq, ImageMagick (convert, identify, montage).

set -eu

SEASON="${1:?usage : dress-up.sh <fête> [cible…]}"
shift
ONLY=("$@")

LIST="scripts/seasons/$SEASON/prompts.tsv"
STYLE_FILE="scripts/seasons/style.txt"
OUT_DIR="analysis/seasons/$SEASON"
LOG="$OUT_DIR/journal.txt"
SESSIONS="${CODEX_HOME:-$HOME/.codex}/sessions"
# Essais par image quand Codex ne rend rien pour une autre raison que le quota
MAX_TRIES=3
# Attente quand le journal de Codex ne donne pas d'heure de remise à zéro
DEFAULT_WAIT=900
QUOTA_ERROR='usage limit|rate limit|quota|limit reached|too many requests|429'

[[ -f "$LIST" ]] || { echo "Liste introuvable : $LIST" >&2; exit 1; }
for tool in codex jq convert identify montage; do
    command -v "$tool" >/dev/null || { echo "Outil manquant : $tool" >&2; exit 1; }
done
mkdir -p "$OUT_DIR"

log() {
    printf '%s  %s\n' "$(date '+%d/%m %H:%M:%S')" "$*" | tee -a "$LOG"
}

format_clause() {
    case "$1" in
        carre-transparent)
            echo "Format carré 1024 × 1024. Fond TRANSPARENT (PNG avec canal alpha), sans sol, sans ombre portée ni halo : le sujet seul. Même place et même taille dans le cadre que la 1re image jointe ; un accessoire qui dépasse peut réduire l'ensemble de 10 % au plus. Les éléments du costume restent lisibles sur une vignette de 56 pixels : grands, de formes simples et bien contrastées." ;;
        portrait-transparent)
            echo "Format portrait 1024 × 1536. Fond TRANSPARENT (PNG avec canal alpha), sans sol, sans ombre portée ni halo : le sujet seul. Même place et même taille dans le cadre que la 1re image jointe ; un accessoire qui dépasse peut réduire l'ensemble de 10 % au plus. Les éléments du costume restent lisibles sur une vignette de 56 pixels : grands, de formes simples et bien contrastées." ;;
        paysage)
            echo "Format paysage 1536 × 1024, image pleine, sans bord ni cadre : elle sert de fond derrière l'interface du jeu." ;;
        bandeau)
            echo "Format paysage large : l'image sera recadrée en bandeau 1200 × 630, garde tout l'essentiel dans la bande centrale (ni titre ni personnage coupé en haut ou en bas)." ;;
        *) return 1 ;;
    esac
}

# Taille exacte de chaque format
format_size() {
    case "$1" in
        carre-transparent) echo 1024x1024 ;;
        portrait-transparent) echo 1024x1536 ;;
        paysage) echo 1536x1024 ;;
        bandeau) echo 1200x630 ;;
        *) return 1 ;;
    esac
}

# La cible est-elle là, à la bonne taille, et transparente quand il le faut ?
conforms() {
    local target="$1" format="$2" size corner
    [[ -s "$target" ]] || return 1
    size="$(identify -format '%wx%h' "$target" 2>/dev/null)" || return 1
    [[ "$size" == "$(format_size "$format")" ]] || return 1
    if [[ "$format" == *-transparent ]]; then
        corner="$(convert "$target" -format '%[fx:p{0,0}.a]' info: 2>/dev/null)" || return 1
        [[ "$corner" == 0 ]] || return 1
    fi
}

# Met l'image rendue par Codex au format de la cible
finish() {
    local raw="$1" target="$2" format="$3" size
    size="$(format_size "$format")"
    mkdir -p "$(dirname "$target")"
    case "$format" in
        *-transparent)
            convert "$raw" -resize "$size" -background none -gravity center -extent "$size" "$target" ;;
        *)
            convert "$raw" -resize "$size^" -gravity center -extent "$size" -alpha off -quality 90 "$target" ;;
    esac
}

# Dernier état du quota écrit par Codex : « pourcentage_utilisé remise_à_zéro » de la fenêtre
# la plus entamée (fenêtre de 5 h ou semaine), lu dans la session la plus récente qui en parle
# (une session refusée pour quota écrit des fenêtres vides) ; rien si aucune n'en dit rien
latest_quota() {
    local journal quota
    while read -r journal; do
        quota="$(grep '"rate_limits"' "$journal" 2>/dev/null | jq -r '
            [.payload.rate_limits.primary, .payload.rate_limits.secondary]
            | map(select(. != null)) | max_by(.used_percent) // empty
            | "\(.used_percent) \(.resets_at)"' 2>/dev/null | tail -n 1)"
        if [[ -n "$quota" ]]; then
            echo "$quota"
            return 0
        fi
    done < <(find "$SESSIONS" -name '*.jsonl' -printf '%T@ %p\n' 2>/dev/null \
        | sort -rn | head -n 20 | cut -d' ' -f2-)
}

# Quota après une image, pour le journal : « 5 h : 3 %, semaine : 17 % » (session la plus récente)
quota_summary() {
    local journal
    journal="$(find "$SESSIONS" -name '*.jsonl' -printf '%T@ %p\n' 2>/dev/null \
        | sort -rn | head -n 1 | cut -d' ' -f2-)"
    [[ -n "$journal" ]] || return 0
    grep '"rate_limits"' "$journal" 2>/dev/null | jq -r '.payload.rate_limits
        | "5 h : \(.primary.used_percent // "?") %, semaine : \(.secondary.used_percent // "?") %"' \
        2>/dev/null | tail -n 1
}

# Heure de reprise donnée par le refus de Codex (« try again at 2:20 AM. »), en secondes
# depuis 1970 ; vide si le message n'en donne pas
RETRY_AT=''
retry_time_from() {
    local when epoch
    when="$(grep -Eoh 'try again at [^.]+' "$@" 2>/dev/null | tail -n 1 | sed -E 's/^try again at //; s/([0-9])(st|nd|rd|th)/\1/g')"
    [[ -n "$when" ]] || return 0
    epoch="$(date -d "$when" +%s 2>/dev/null)" || return 0
    # Une heure seule déjà passée aujourd'hui désigne demain
    if [[ "$epoch" -le "$(date +%s)" ]]; then
        epoch=$((epoch + 86400))
    fi
    echo "$epoch"
}

# Attend que le quota revienne à 100 % : jusqu'à l'heure donnée par le refus, sinon jusqu'à la
# remise à zéro du journal, plus une minute
wait_for_quota() {
    local quota resets now delay
    now="$(date +%s)"
    resets="$RETRY_AT"
    if [[ -z "$resets" ]]; then
        quota="$(latest_quota)"
        resets="${quota#* }"
    fi
    if [[ "$resets" =~ ^[0-9]+$ && "$resets" -gt "$now" ]]; then
        delay=$((resets - now + 60))
    else
        delay="$DEFAULT_WAIT"
    fi
    RETRY_AT=''
    log "quota Codex épuisé : reprise à $(date -d "@$((now + delay))" '+%d/%m %H:%M')"
    sleep "$delay"
    log "reprise"
}

# Le quota est-il déjà plein d'après le dernier journal ? (évite un appel perdu)
quota_exhausted() {
    local quota used resets
    quota="$(latest_quota)"
    [[ -n "$quota" ]] || return 1
    used="${quota%% *}"
    resets="${quota#* }"
    [[ "${used%.*}" -ge 100 && "$resets" -gt "$(date +%s)" ]]
}

# Une image : rend 0 si elle est faite, 2 si le quota l'a empêchée, 1 sinon
draw() {
    local target="$1" refs="$2" format="$3" brief="$4"
    local work name prompt raw rc=0
    local -a images=()
    IFS=',' read -r -a ref_list <<<"$refs"
    for ref in "${ref_list[@]}"; do
        [[ -s "$ref" ]] || { log "  référence absente : $ref"; return 1; }
        images+=("--image=$ref")
    done
    work="$(mktemp -d)"
    name="$(basename "${target%.*}").png"
    prompt="$work/consigne.txt"
    {
        cat "$STYLE_FILE"
        echo
        format_clause "$format"
        echo
        echo "CONSIGNE : $brief"
        echo
        echo "Avec ton outil de génération d'images, produis UNE seule image, puis copie-la dans le répertoire de travail sous le nom EXACT « $name »."
        echo "N'écris aucun autre fichier, ne modifie rien d'autre. Termine ta réponse par le chemin absolu du fichier écrit, et rien d'autre."
    } >"$prompt"
    codex exec -C "$work" -s workspace-write --skip-git-repo-check "${images[@]}" \
        -o "$work/reponse.txt" - <"$prompt" >"$work/codex.log" 2>&1 || rc=$?
    raw="$work/$name"
    if [[ -s "$raw" ]]; then
        finish "$raw" "$target" "$format"
        if conforms "$target" "$format"; then
            rm -rf "$work"
            return 0
        fi
        log "  image non conforme (taille ou transparence) : $target"
        rm -f "$target"
    elif grep -Eqi "$QUOTA_ERROR" "$work/codex.log" "$work/reponse.txt" 2>/dev/null; then
        RETRY_AT="$(retry_time_from "$work/codex.log" "$work/reponse.txt")"
        log "  refus de Codex : $(grep -Eohi "[^.]*($QUOTA_ERROR)[^.]*" "$work/codex.log" | tail -n 1)"
        rm -rf "$work"
        return 2
    else
        log "  aucune image (code $rc), dernière réponse :"
        tail -n 5 "$work/codex.log" | sed 's/^/    /' | tee -a "$LOG" >/dev/null
    fi
    rm -rf "$work"
    return 1
}

wanted() {
    local target="$1"
    [[ ${#ONLY[@]} -eq 0 ]] && return 0
    for only in "${ONLY[@]}"; do
        [[ "$only" == "$target" ]] && return 0
    done
    return 1
}

log "début : $LIST"
done_count=0
failed=()
while IFS=$'\t' read -r target refs format brief; do
    [[ -z "$target" || "$target" == \#* ]] && continue
    wanted "$target" || continue
    if [[ ${#ONLY[@]} -eq 0 ]] && conforms "$target" "$format"; then
        log "déjà là : $target"
        continue
    fi
    tries=0
    while :; do
        if quota_exhausted; then
            wait_for_quota
        fi
        log "dessin : $target"
        rc=0
        draw "$target" "$refs" "$format" "$brief" </dev/null || rc=$?
        if [[ $rc -eq 0 ]]; then
            log "  fait : $target (quota utilisé : $(quota_summary))"
            done_count=$((done_count + 1))
            break
        elif [[ $rc -eq 2 ]]; then
            wait_for_quota
        else
            tries=$((tries + 1))
            if [[ $tries -ge $MAX_TRIES ]]; then
                log "  abandon après $MAX_TRIES essais : $target"
                failed+=("$target")
                break
            fi
        fi
    done
done <"$LIST"

# Planche de contact dans l'ordre exact de la liste
sheet=()
while IFS=$'\t' read -r target _; do
    [[ -z "$target" || "$target" == \#* ]] && continue
    [[ -s "$target" ]] && sheet+=("$target")
done <"$LIST"
if [[ ${#sheet[@]} -gt 0 ]]; then
    montage "${sheet[@]}" -tile 6x -geometry 260x260+4+4 -background '#7a6a8a' "$OUT_DIR/planche.png"
fi

log "fin : $done_count dessinée(s), ${#failed[@]} en échec${failed:+ (${failed[*]})}"
[[ ${#failed[@]} -eq 0 ]]

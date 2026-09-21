#!/usr/bin/env bash
# Régénère les traductions du README à partir de README.md (français, référence).
#
# Outil : aipmt (ai-powered-markdown-translator). Par défaut il passe par le CLI
# Codex, donc sur le quota de l'abonnement ChatGPT : aucune clé d'API, aucune
# facturation à l'usage. `codex login` doit avoir été fait au préalable.
#
#   ./scripts/regen-readme-translations.sh              # toutes les langues
#   ./scripts/regen-readme-translations.sh en es        # seulement celles-ci
#   AIPMT_PROVIDER=--use_claude ./scripts/...           # autre fournisseur
#
# Deux particularités de ce dépôt, prises en charge ici :
#
#   1. aipmt écrit « README-en.md » ; nos fichiers s'appellent « README.en.md ».
#      Le script renomme après chaque traduction réussie.
#   2. aipmt refuse d'écrire un fichier douteux (jeton perdu, passage resté en
#      français). C'est une sécurité, pas une panne : elle se déclenche parfois
#      sur les commentaires des blocs de code. D'où les relances ci-dessous.
set -euo pipefail

cd "$(dirname "$0")/.."

SOURCE=README.md
LANGUE_SOURCE=fr
LANGUES_PAR_DEFAUT=(en es pt de zh hi ar it sv pl nl ro ja ko)
PROVIDER="${AIPMT_PROVIDER:---use_codex}"
ESSAIS="${AIPMT_ESSAIS:-3}"
# Codex prend 3 à 5 minutes sur un README de cette taille ; la marge évite
# qu'un appel lent soit abattu avant d'avoir répondu.
DELAI="${AIPMT_TIMEOUT:-1800}"

if ! command -v aipmt > /dev/null; then
  echo "ERREUR : aipmt introuvable. Installer avec « pipx install ai-powered-markdown-translator »." >&2
  exit 1
fi
if [[ ! -f "$SOURCE" ]]; then
  echo "ERREUR : $SOURCE introuvable." >&2
  exit 1
fi

langues=("$@")
[[ ${#langues[@]} -eq 0 ]] && langues=("${LANGUES_PAR_DEFAUT[@]}")

# Les images du README doivent se retrouver telles quelles dans chaque
# traduction : une seule perdue casse l'aperçu, sans que rien ne le signale.
medias_attendus=$(grep -oE '\(docs/media/[^)]+\)' "$SOURCE" | sort -u)
nb_medias=$(printf '%s\n' "$medias_attendus" | grep -c . || true)

echo "Source      : $SOURCE ($LANGUE_SOURCE)"
echo "Fournisseur : $PROVIDER"
echo "Langues     : ${langues[*]}"
echo "Médias à préserver : $nb_medias"
echo

# Contrôle préalable. aipmt ne met à l'abri que les blocs dont la clôture est en
# colonne 0 : son motif est ancré, une clôture indentée dans une liste numérotée
# lui échappe. Le contenu part alors au modèle comme de la prose, revient tel
# quel, et la garde anti-passthrough refuse le fichier — pour les quatorze
# langues, sans jamais nommer la cause. Autant la nommer ici.
indentees=$(grep -cE '^[[:space:]]+```' "$SOURCE" || true)
if [[ "$indentees" -gt 0 ]]; then
  echo "ERREUR : $SOURCE contient $indentees clôture(s) de bloc de code indentée(s)." >&2
  grep -nE '^[[:space:]]+```' "$SOURCE" | head -5 >&2
  echo 'aipmt ne protège que les blocs dont les ``` commencent en colonne 0.' >&2
  echo "Sortir ces blocs des listes numérotées avant de relancer." >&2
  exit 1
fi

echecs=()

# Une langue d'abord, seule : si la source a un défaut, il se voit sur la
# première et il est inutile de dépenser le quota sur les treize autres.
canari="${langues[0]}"
echo "Canari : $canari (on ne poursuit que s'il passe)"
echo

for langue in "${langues[@]}"; do
  cible="README.${langue}.md"
  intermediaire="README-${langue}.md"
  reussi=0

  for essai in $(seq 1 "$ESSAIS"); do
    echo "── $langue (tentative $essai/$ESSAIS)"
    rm -f "$intermediaire"
    # PROVIDER peut porter plusieurs options (par exemple « --use_gemini --eco ») :
    # les guillemets casseraient la découpe, d'où la dérogation ci-dessous.
    # shellcheck disable=SC2086
    if timeout "$DELAI" aipmt \
      --file "$SOURCE" --target_dir . \
      --source_lang "$LANGUE_SOURCE" --target_lang "$langue" \
      $PROVIDER --force > /dev/null 2>&1 && [[ -f "$intermediaire" ]]; then

      # Contrôle d'intégrité avant de remplacer le fichier existant.
      manquants=0
      while IFS= read -r media; do
        [[ -z "$media" ]] && continue
        grep -qF "$media" "$intermediaire" || manquants=$((manquants + 1))
      done <<< "$medias_attendus"

      if [[ "$manquants" -gt 0 ]]; then
        echo "   $manquants média(s) perdu(s) : on rejette et on relance"
        rm -f "$intermediaire"
        continue
      fi

      mv -f "$intermediaire" "$cible"
      echo "   $cible écrit ($(wc -l < "$cible") lignes)"
      reussi=1
      break
    fi
    echo "   échec"
  done

  if [[ "$reussi" -ne 1 ]]; then
    echecs+=("$langue")
    if [[ "$langue" == "$canari" ]]; then
      echo >&2
      echo "ERREUR : le canari « $canari » a échoué après $ESSAIS tentatives." >&2
      echo "La source est sans doute en cause : on s'arrête avant d'y passer le quota." >&2
      echo "Relancer une traduction seule, sans masquer la sortie, pour voir le motif :" >&2
      echo "  aipmt --file $SOURCE --source_lang $LANGUE_SOURCE --target_lang $canari \\" >&2
      echo "        --target_dir /tmp $PROVIDER --force" >&2
      exit 1
    fi
  fi
done

echo
if [[ ${#echecs[@]} -gt 0 ]]; then
  echo "ERREUR : langues non traduites après $ESSAIS tentatives : ${echecs[*]}" >&2
  echo "Les fichiers existants n'ont pas été modifiés pour ces langues." >&2
  exit 1
fi

echo "Terminé. Penser à « npm run format » : Prettier normalise les tableaux."

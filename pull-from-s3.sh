#!/bin/bash
#
# Récupération du site LeapMultix depuis le bucket S3, contrôlée avant toute écriture
# Usage: ./pull-from-s3.sh [--config fichier-config] [--dry-run]
#
# Le bucket reçoit une copie transformée par deploy.sh (version dans les adresses des
# modules, balises de déploiement d'index.html). scripts/check-s3-copy.mjs défait ces
# changements, puis compare la copie aux fichiers suivis de HEAD : un seul fichier différent,
# ou inconnu de git, et rien n'est écrit dans le dépôt. Sinon, seules les images générées
# (assets/generated-images/, ignorées par git) y sont copiées : les fichiers suivis,
# identiques, ne sont pas touchés.
#

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'aide
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --config FILE    Utiliser un fichier de configuration spécifique"
    echo "  --dry-run        Simuler la récupération sans l'exécuter"
    echo "  --help           Afficher cette aide"
    echo ""
    echo "Variables d'environnement supportées:"
    echo "  S3_BUCKET              Nom du bucket S3"
    echo "  TF_VAR_leapmultixs3bucket  Variable Terraform (priorité sur S3_BUCKET)"
    echo ""
    echo "Ce script compare le contenu du bucket aux fichiers suivis de HEAD et refuse toute"
    echo "différence. S'il n'y en a aucune, il copie les images générées dans le dépôt."
    echo ""
}

# Valeurs par défaut
CONFIG_FILE="deploy.config"
DRY_RUN=false
TEMP_DIR=""

# Parsing des arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Argument inconnu: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Fonction de nettoyage
cleanup() {
    if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
        echo -e "${YELLOW}🧹 Nettoyage du répertoire temporaire...${NC}"
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

echo -e "${BLUE}⬇️  Récupération LeapMultix depuis S3${NC}"
echo "=================================="

# Chargement de la configuration
if [[ -f "$CONFIG_FILE" ]]; then
    echo -e "${GREEN}📝 Chargement de la configuration: $CONFIG_FILE${NC}"
    # Fichier choisi à l'exécution (--config), hors dépôt : rien à suivre pour ShellCheck
    # shellcheck source=/dev/null
    source "$CONFIG_FILE"
else
    echo -e "${YELLOW}⚠️  Fichier de configuration non trouvé: $CONFIG_FILE${NC}"
    echo -e "${YELLOW}   Utilisation des variables d'environnement uniquement${NC}"
fi

# Détermination du bucket S3
if [[ -n "$TF_VAR_leapmultixs3bucket" ]]; then
    S3_BUCKET="$TF_VAR_leapmultixs3bucket"
    echo -e "${GREEN}🪣 Bucket S3 (Terraform): $S3_BUCKET${NC}"
elif [[ -n "$S3_BUCKET" ]]; then
    echo -e "${GREEN}🪣 Bucket S3: $S3_BUCKET${NC}"
else
    echo -e "${RED}❌ Erreur: Aucun bucket S3 configuré${NC}"
    echo -e "${YELLOW}   Définissez S3_BUCKET ou TF_VAR_leapmultixs3bucket${NC}"
    exit 1
fi

# Vérification des prérequis
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ Erreur: AWS CLI non installé${NC}"
    exit 1
fi

# Vérification que le bucket existe et est accessible
if ! aws s3 ls "s3://$S3_BUCKET" > /dev/null 2>&1; then
    echo -e "${RED}❌ Erreur: Impossible d'accéder au bucket S3: $S3_BUCKET${NC}"
    echo -e "${YELLOW}   Vérifiez vos credentials AWS et l'existence du bucket${NC}"
    exit 1
fi

# Création du répertoire temporaire
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}📁 Répertoire temporaire: $TEMP_DIR${NC}"

# Synchronisation depuis S3, vers le dossier temporaire seulement. Mêmes fichiers que ceux
# que deploy.sh publie ; la commande est un tableau, sans eval
echo -e "${BLUE}☁️  Téléchargement depuis S3...${NC}"

SYNC_ARGS=(
  s3 sync "s3://$S3_BUCKET" "$TEMP_DIR/"
  --exclude "*"
  --include "index.html"
  --include "parents.html"
  --include "modes.html"
  --include "pwa.html"
  --include "offline.html"
  --include "sw.js"
  --include "manifest.json"
  --include "favicon.svg"
  --include "favicon.ico"
  --include "favicon.png"
  --include "robots.txt"
  --include "sitemap.xml"
  --include "assets/*"
  --include "css/*"
  --include "js/*"
  --include "img/*"
  --exclude "assets/voice/*"
)

if [[ "$DRY_RUN" == "true" ]]; then
    echo -e "${YELLOW}🔍 Mode dry-run - Commande qui serait exécutée:${NC}"
    # L'option de l'AWS CLI s'écrit --dryrun, sans tiret (même correction que deploy.sh)
    echo "aws ${SYNC_ARGS[*]} --dryrun"
    aws "${SYNC_ARGS[@]}" --dryrun
    exit 0
fi

echo -e "${GREEN}📥 Téléchargement en cours...${NC}"

if ! aws "${SYNC_ARGS[@]}"; then
    echo -e "${RED}❌ Erreur lors du téléchargement depuis S3${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Téléchargement S3 terminé${NC}"

# Vérification qu'il y a bien des fichiers téléchargés
if [[ ! -f "$TEMP_DIR/index.html" ]]; then
    echo -e "${RED}❌ Erreur: Aucun fichier téléchargé ou index.html manquant${NC}"
    exit 1
fi

# Contrôle de la copie, puis copie des seules images générées : rien d'autre n'entre dans
# le dépôt, et rien du tout si le bucket diffère de git
echo -e "${BLUE}🔎 Comparaison avec les fichiers suivis de HEAD...${NC}"
if ! node scripts/check-s3-copy.mjs "$TEMP_DIR" --restore; then
    echo -e "${RED}❌ Récupération refusée : le contenu du bucket diffère de git${NC}"
    exit 1
fi

# Affichage du résumé
echo ""
echo "=================================="
echo -e "${GREEN}🎉 Récupération terminée : bucket conforme à git${NC}"
echo -e "${BLUE}📊 Fichiers comparés depuis: s3://$S3_BUCKET${NC}"
echo ""

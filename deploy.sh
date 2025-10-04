#!/bin/bash
#
# Script de déploiement LeapMultix avec remplacement de placeholders
# Usage: ./deploy.sh [--config fichier-config]
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
    echo "  --dry-run        Simuler le déploiement sans l'exécuter"
    echo "  --help           Afficher cette aide"
    echo ""
    echo "Variables d'environnement supportées:"
    echo "  PLAUSIBLE_DOMAIN        Domaine pour Plausible Analytics"
    echo "  S3_BUCKET              Nom du bucket S3"
    echo "  CLOUDFRONT_DISTRIB     ID de distribution CloudFront pour invalidation"
    echo "  TF_VAR_leapmultixs3bucket  Variable Terraform (priorité sur S3_BUCKET)"
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

echo -e "${BLUE}🚀 Déploiement LeapMultix${NC}"
echo "=================================="

# Chargement de la configuration
if [[ -f "$CONFIG_FILE" ]]; then
    echo -e "${GREEN}📝 Chargement de la configuration: $CONFIG_FILE${NC}"
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

# Vérification du domaine Plausible (optionnel)
if [[ -n "$PLAUSIBLE_DOMAIN" ]]; then
    echo -e "${GREEN}📊 Domaine Plausible: $PLAUSIBLE_DOMAIN${NC}"
else
    echo -e "${YELLOW}⚠️  Domaine Plausible non configuré - analytics désactivés${NC}"
    PLAUSIBLE_DOMAIN=""
fi

# Vérification de CloudFront (optionnel)
if [[ -n "$CLOUDFRONT_DISTRIB" ]]; then
    echo -e "${GREEN}☁️  Distribution CloudFront: $CLOUDFRONT_DISTRIB${NC}"
else
    echo -e "${YELLOW}⚠️  CloudFront non configuré - pas d'invalidation${NC}"
fi

# Vérification des prérequis
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ Erreur: AWS CLI non installé${NC}"
    exit 1
fi

# Création du répertoire temporaire
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}📁 Répertoire temporaire: $TEMP_DIR${NC}"

# Copie uniquement les fichiers nécessaires au déploiement
echo -e "${BLUE}📋 Copie des fichiers sources...${NC}"
rsync -av \
  --include='index.html' \
  --include='offline.html' \
  --include='sw.js' \
  --include='manifest.json' \
  --include='favicon.svg' \
  --include='favicon.ico' \
  --include='favicon.png' \
  --include='assets/***' \
  --include='css/***' \
  --include='js/***' \
  --include='img/***' \
  --exclude='*' \
  . "$TEMP_DIR/"

# Remplacement des placeholders
echo -e "${BLUE}🔄 Remplacement des placeholders...${NC}"

# Remplacement du domaine Plausible dans index.html
if [[ -n "$PLAUSIBLE_DOMAIN" ]]; then
    sed -i "s/{{PLAUSIBLE_DOMAIN}}/$PLAUSIBLE_DOMAIN/g" "$TEMP_DIR/index.html"
    echo -e "${GREEN}   ✅ Domaine Plausible configuré${NC}"
else
    # Supprimer complètement les scripts Plausible si pas de domaine
    sed -i '/<!-- Analytics Plausible/,/^[[:space:]]*<\/script>/d' "$TEMP_DIR/index.html"
    echo -e "${YELLOW}   ⚠️  Scripts Plausible supprimés (pas de domaine)${NC}"
fi

# Autres remplacements potentiels peuvent être ajoutés ici
# sed -i "s/{{AUTRE_PLACEHOLDER}}/valeur/g" "$TEMP_DIR/fichier.html"

# Vérification du résultat
if grep -q "{{" "$TEMP_DIR/index.html"; then
    echo -e "${YELLOW}⚠️  Placeholders non remplacés détectés:${NC}"
    grep -n "{{.*}}" "$TEMP_DIR/index.html" || true
fi

# Synchronisation S3
echo -e "${BLUE}☁️  Synchronisation S3...${NC}"

SYNC_CMD="aws s3 sync --size-only --delete \
  \"$TEMP_DIR/\" s3://$S3_BUCKET \
  --exclude \"*\" \
  --include \"index.html\" \
  --include \"offline.html\" \
  --include \"sw.js\" \
  --include \"manifest.json\" \
  --include \"favicon.svg\" \
  --include \"favicon.ico\" \
  --include \"favicon.png\" \
  --include \"assets/*\" \
  --include \"css/*\" \
  --include \"js/*\" \
  --include \"img/*\""

if [[ "$DRY_RUN" == "true" ]]; then
    echo -e "${YELLOW}🔍 Mode dry-run - Commande qui serait exécutée:${NC}"
    echo "$SYNC_CMD --dry-run"
    eval "$SYNC_CMD --dry-run"
else
    echo -e "${GREEN}📤 Synchronisation en cours...${NC}"

    if eval "$SYNC_CMD"; then
        echo -e "${GREEN}✅ Synchronisation S3 terminée avec succès !${NC}"

        # Invalidation CloudFront si configuré
        if [[ -n "$CLOUDFRONT_DISTRIB" ]]; then
            echo -e "${BLUE}🔄 Invalidation du cache CloudFront...${NC}"
            if aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIB" --paths "/*" > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Cache CloudFront invalidé${NC}"
            else
                echo -e "${YELLOW}⚠️  Erreur lors de l'invalidation CloudFront (non critique)${NC}"
            fi
        fi

        echo -e "${GREEN}🎉 Déploiement terminé avec succès !${NC}"
        if [[ -n "$PLAUSIBLE_DOMAIN" ]]; then
            echo -e "${BLUE}📊 Analytics Plausible configuré pour: $PLAUSIBLE_DOMAIN${NC}"
        fi
    else
        echo -e "${RED}❌ Erreur lors du déploiement${NC}"
        exit 1
    fi
fi

echo "=================================="
echo -e "${GREEN}🎉 Déploiement terminé${NC}"

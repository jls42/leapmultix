#!/bin/bash
#
# Script de récupération LeapMultix depuis AWS S3
# Usage: ./pull-from-s3.sh [--config fichier-config]
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
    echo "  --backup         Créer une sauvegarde avant de télécharger"
    echo "  --help           Afficher cette aide"
    echo ""
    echo "Variables d'environnement supportées:"
    echo "  S3_BUCKET              Nom du bucket S3"
    echo "  TF_VAR_leapmultixs3bucket  Variable Terraform (priorité sur S3_BUCKET)"
    echo ""
    echo "Ce script récupère les fichiers depuis S3 et les place dans le répertoire courant."
    echo "Il restaure aussi les placeholders pour le développement local."
    echo ""
}

# Valeurs par défaut
CONFIG_FILE="deploy.config"
DRY_RUN=false
BACKUP=false
TEMP_DIR=""
BACKUP_DIR=""

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
        --backup)
            BACKUP=true
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

# Création d'une sauvegarde si demandée
if [[ "$BACKUP" == "true" ]]; then
    BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
    echo -e "${BLUE}💾 Création d'une sauvegarde: $BACKUP_DIR${NC}"
    mkdir -p "$BACKUP_DIR"

    # Sauvegarde des fichiers existants
    for dir in assets css js img; do
        if [[ -d "$dir" ]]; then
            cp -r "$dir" "$BACKUP_DIR/"
        fi
    done

    for file in index.html offline.html sw.js manifest.json favicon.svg; do
        if [[ -f "$file" ]]; then
            cp "$file" "$BACKUP_DIR/"
        fi
    done

    echo -e "${GREEN}✅ Sauvegarde créée dans: $BACKUP_DIR${NC}"
fi

# Création du répertoire temporaire
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}📁 Répertoire temporaire: $TEMP_DIR${NC}"

# Synchronisation depuis S3
echo -e "${BLUE}☁️  Téléchargement depuis S3...${NC}"

SYNC_CMD="aws s3 sync s3://$S3_BUCKET \"$TEMP_DIR/\" \
  --exclude \"*\" \
  --include \"index.html\" \
  --include \"offline.html\" \
  --include \"sw.js\" \
  --include \"manifest.json\" \
  --include \"favicon.svg\" \
  --include \"assets/*\" \
  --include \"css/*\" \
  --include \"js/*\" \
  --include \"img/*\""

if [[ "$DRY_RUN" == "true" ]]; then
    echo -e "${YELLOW}🔍 Mode dry-run - Commande qui serait exécutée:${NC}"
    echo "$SYNC_CMD --dry-run"
    eval "$SYNC_CMD --dry-run"
    exit 0
fi

echo -e "${GREEN}📥 Téléchargement en cours...${NC}"

if ! eval "$SYNC_CMD"; then
    echo -e "${RED}❌ Erreur lors du téléchargement depuis S3${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Téléchargement S3 terminé${NC}"

# Vérification qu'il y a bien des fichiers téléchargés
if [[ ! -f "$TEMP_DIR/index.html" ]]; then
    echo -e "${RED}❌ Erreur: Aucun fichier téléchargé ou index.html manquant${NC}"
    exit 1
fi

# Restauration des placeholders pour le développement local
echo -e "${BLUE}🔄 Restauration des placeholders pour le développement...${NC}"

if [[ -f "$TEMP_DIR/index.html" ]]; then
    # Restaurer le placeholder Plausible si analytics sont détectés
    if grep -q "plausible.io/js/script.js" "$TEMP_DIR/index.html"; then
        echo -e "${GREEN}   📊 Analytics Plausible détectés - restauration du placeholder${NC}"

        # Extraire le domaine actuel
        CURRENT_DOMAIN=$(grep -o 'data-domain="[^"]*"' "$TEMP_DIR/index.html" | sed 's/data-domain="//' | sed 's/"//' | head -1)
        if [[ -n "$CURRENT_DOMAIN" ]]; then
            echo -e "${BLUE}   🔍 Domaine détecté: $CURRENT_DOMAIN${NC}"
            # Remplacer le domaine par le placeholder
            sed -i "s/data-domain=\"$CURRENT_DOMAIN\"/data-domain=\"{{PLAUSIBLE_DOMAIN}}\"/g" "$TEMP_DIR/index.html"
        fi
    else
        echo -e "${YELLOW}   ⚠️  Aucun analytics Plausible détecté${NC}"
    fi
fi

# Copie des fichiers vers le répertoire courant
echo -e "${BLUE}📋 Copie des fichiers vers le répertoire local...${NC}"

# Créer les répertoires si nécessaire
for dir in assets css js img; do
    if [[ -d "$TEMP_DIR/$dir" ]]; then
        mkdir -p "$dir"
        cp -r "$TEMP_DIR/$dir"/* "$dir/" 2>/dev/null || true
    fi
done

# Copier les fichiers racine
for file in index.html offline.html sw.js manifest.json favicon.svg; do
    if [[ -f "$TEMP_DIR/$file" ]]; then
        cp "$TEMP_DIR/$file" .
        echo -e "${GREEN}   ✅ $file${NC}"
    fi
done

echo -e "${GREEN}✅ Copie des fichiers terminée${NC}"

# Affichage du résumé
echo ""
echo "=================================="
echo -e "${GREEN}🎉 Récupération terminée avec succès !${NC}"
echo ""
echo -e "${BLUE}📊 Fichiers récupérés depuis: s3://$S3_BUCKET${NC}"

if [[ "$BACKUP" == "true" ]]; then
    echo -e "${BLUE}💾 Sauvegarde locale créée dans: $BACKUP_DIR${NC}"
fi

echo -e "${YELLOW}⚠️  N'oubliez pas de:${NC}"
echo -e "${YELLOW}   1. Vérifier les modifications avec 'git status'${NC}"
echo -e "${YELLOW}   2. Configurer les variables locales si nécessaire${NC}"
echo -e "${YELLOW}   3. Tester l'application avec 'npm run serve'${NC}"

if [[ -f "$TEMP_DIR/index.html" ]] && grep -q "{{PLAUSIBLE_DOMAIN}}" "$TEMP_DIR/index.html"; then
    echo -e "${GREEN}   ✅ Placeholders restaurés pour le développement${NC}"
fi

echo ""
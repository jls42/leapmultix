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
    echo "  --force-version  Générer automatiquement une nouvelle version pour sw.js et cache-updater"
    echo "  -fv              Raccourci pour --force-version"
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
FORCE_VERSION=false

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
        --force-version|-fv)
            FORCE_VERSION=true
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
  --include='parents.html' \
  --include='modes.html' \
  --include='pwa.html' \
  --include='offline.html' \
  --include='sw.js' \
  --include='manifest.json' \
  --include='favicon.svg' \
  --include='favicon.ico' \
  --include='favicon.png' \
  --include='robots.txt' \
  --include='sitemap.xml' \
  --include='assets/***' \
  --include='css/***' \
  --include='js/***' \
  --include='img/***' \
  --exclude='*' \
  . "$TEMP_DIR/"

# Forcer la version SW/cache-updater si demandé
if [[ "$FORCE_VERSION" == "true" ]]; then
    NEW_VERSION="v$(date -u +%Y%m%d%H%M%S)"
    echo -e "${YELLOW}⚡ Force version activée - nouvelle version: ${NEW_VERSION}${NC}"

    if [[ -f "$TEMP_DIR/sw.js" ]]; then
        sed -i.bak "s/^const VERSION = '.*';/const VERSION = '${NEW_VERSION}';/" "$TEMP_DIR/sw.js" && rm "$TEMP_DIR/sw.js.bak"
        if ! grep -q "const VERSION = '${NEW_VERSION}';" "$TEMP_DIR/sw.js"; then
            echo -e "${RED}❌ Échec mise à jour VERSION dans sw.js${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ sw.js introuvable dans le répertoire temporaire${NC}"
        exit 1
    fi

    if [[ -f "$TEMP_DIR/js/cache-updater.js" ]]; then
        sed -i.bak "s/^export const APP_VERSION = '.*';/export const APP_VERSION = '${NEW_VERSION}';/" "$TEMP_DIR/js/cache-updater.js" && rm "$TEMP_DIR/js/cache-updater.js.bak"
        if ! grep -q "export const APP_VERSION = '${NEW_VERSION}';" "$TEMP_DIR/js/cache-updater.js"; then
            echo -e "${RED}❌ Échec mise à jour APP_VERSION dans js/cache-updater.js${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ js/cache-updater.js introuvable dans le répertoire temporaire${NC}"
        exit 1
    fi
fi

# Remplacement des placeholders
echo -e "${BLUE}🔄 Remplacement des placeholders...${NC}"

# Remplacement du domaine Plausible dans index.html
if [[ -n "$PLAUSIBLE_DOMAIN" ]]; then
    sed -i.bak "s/{{PLAUSIBLE_DOMAIN}}/$PLAUSIBLE_DOMAIN/g" "$TEMP_DIR/index.html" && rm "$TEMP_DIR/index.html.bak"
    echo -e "${GREEN}   ✅ Domaine Plausible configuré${NC}"
else
    # Supprimer complètement les scripts Plausible si pas de domaine
    sed -i.bak '/<!-- Analytics Plausible/,/^[[:space:]]*<\/script>/d' "$TEMP_DIR/index.html" && rm "$TEMP_DIR/index.html.bak"
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
  --include \"parents.html\" \
  --include \"modes.html\" \
  --include \"pwa.html\" \
  --include \"offline.html\" \
  --include \"sw.js\" \
  --include \"manifest.json\" \
  --include \"favicon.svg\" \
  --include \"favicon.ico\" \
  --include \"favicon.png\" \
  --include \"robots.txt\" \
  --include \"sitemap.xml\" \
  --include \"assets/*\" \
  --include \"css/*\" \
  --include \"js/*\" \
  --include \"img/*\""

if [[ "$DRY_RUN" == "true" ]]; then
    echo -e "${YELLOW}🔍 Mode dry-run - Commande qui serait exécutée:${NC}"
    # L'option de l'AWS CLI s'écrit --dryrun, sans tiret : avec --dry-run, la
    # commande échouait en « Unknown options » et la simulation ne montrait rien.
    echo "$SYNC_CMD --dryrun"
    eval "$SYNC_CMD --dryrun"
else
    echo -e "${GREEN}📤 Synchronisation en cours...${NC}"

    if eval "$SYNC_CMD"; then
        echo -e "${GREEN}✅ Synchronisation S3 terminée avec succès !${NC}"

        # La synchronisation compare les tailles (--size-only). Or la montée de
        # version ne change pas la taille : « v19 » et « v20 » font le même
        # nombre d'octets. Les deux fichiers qui la portent n'étaient donc
        # JAMAIS renvoyés, et le renouvellement du cache n'arrivait pas en
        # production — constaté le 21/09/2026, sw.js resté en v19 en ligne alors
        # que le dépôt était en v20. On les force, ils pèsent quinze kilo-octets.
        echo -e "${BLUE}📌 Envoi forcé des fichiers porteurs de version...${NC}"
        for fichier in sw.js js/cache-updater.js; do
            if [[ -f "$TEMP_DIR/$fichier" ]]; then
                aws s3 cp "$TEMP_DIR/$fichier" "s3://$S3_BUCKET/$fichier" \
                    --content-type "text/javascript" --metadata-directive REPLACE > /dev/null
                echo -e "${GREEN}   ✅ $fichier${NC}"
            else
                echo -e "${RED}   ❌ $fichier introuvable — déploiement incohérent${NC}"
                exit 1
            fi
        done

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

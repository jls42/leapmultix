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
            echo -e "${RED}Argument inconnu: $1${NC}" >&2
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
    echo -e "${RED}❌ Erreur: Aucun bucket S3 configuré${NC}" >&2
    echo -e "${YELLOW}   Définissez S3_BUCKET ou TF_VAR_leapmultixs3bucket${NC}" >&2
    exit 1
fi
# Nom de bucket seul (règles d'AWS : minuscules, chiffres, points et tirets) : il entre tel
# quel dans l'adresse s3:// de la synchronisation, qui efface ce qui n'est pas dans la copie
if [[ ! "$S3_BUCKET" =~ ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$ ]]; then
    echo -e "${RED}❌ Nom de bucket S3 invalide : $S3_BUCKET${NC}" >&2
    exit 1
fi

# Vérification du domaine Plausible (optionnel)
if [[ -n "$PLAUSIBLE_DOMAIN" ]]; then
    # Nom d'hôte seul : il est écrit tel quel dans index.html (sed), puis lu par
    # js/plausible-init.js ; un « / », un « & » ou un guillemet casserait la page
    if [[ ! "$PLAUSIBLE_DOMAIN" =~ ^[A-Za-z0-9.-]{1,253}$ ]]; then
        echo -e "${RED}❌ Domaine Plausible invalide (nom d'hôte attendu) : $PLAUSIBLE_DOMAIN${NC}" >&2
        exit 1
    fi
    echo -e "${GREEN}📊 Domaine Plausible: $PLAUSIBLE_DOMAIN${NC}"
else
    echo -e "${YELLOW}⚠️  Domaine Plausible non configuré - analytics désactivés${NC}"
    PLAUSIBLE_DOMAIN=""
fi

# Voix enregistrée (optionnel) : adresse de base des clips, écrite dans index.html.
# Seule valeur acceptée : /voice/ (servi par CloudFront depuis le bucket des voix). Sans
# elle, le jeu garde la voix de l'appareil.
if [[ -n "$VOICE_BASE" ]]; then
    if [[ "$VOICE_BASE" != "/voice/" ]]; then
        echo -e "${RED}❌ VOICE_BASE doit valoir /voice/ (reçu : $VOICE_BASE)${NC}" >&2
        exit 1
    fi
    echo -e "${GREEN}🔊 Voix enregistrée : $VOICE_BASE${NC}"
else
    echo -e "${YELLOW}⚠️  VOICE_BASE non définie - voix enregistrée désactivée${NC}"
fi

# Vérification de CloudFront (optionnel)
if [[ -n "$CLOUDFRONT_DISTRIB" ]]; then
    # Identifiant seul (majuscules et chiffres), jamais une adresse ou un ARN
    if [[ ! "$CLOUDFRONT_DISTRIB" =~ ^[A-Z0-9]{8,32}$ ]]; then
        echo -e "${RED}❌ Identifiant de distribution CloudFront invalide : $CLOUDFRONT_DISTRIB${NC}" >&2
        exit 1
    fi
    echo -e "${GREEN}☁️  Distribution CloudFront: $CLOUDFRONT_DISTRIB${NC}"
else
    echo -e "${YELLOW}⚠️  CloudFront non configuré - pas d'invalidation${NC}"
fi

# Vérification des prérequis
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ Erreur: AWS CLI non installé${NC}" >&2
    exit 1
fi

# Création du répertoire temporaire
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}📁 Répertoire temporaire: $TEMP_DIR${NC}"

# Copie uniquement les fichiers nécessaires au déploiement : ni lien symbolique (sa cible
# partirait, ou serait réécrite par le versionnage des modules), ni fichier caché
echo -e "${BLUE}📋 Copie des fichiers sources...${NC}"
rsync -av --no-links \
  --exclude='.*' \
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
  --exclude='assets/voice/***' \
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
            echo -e "${RED}❌ Échec mise à jour VERSION dans sw.js${NC}" >&2
            exit 1
        fi
    else
        echo -e "${RED}❌ sw.js introuvable dans le répertoire temporaire${NC}" >&2
        exit 1
    fi

    if [[ -f "$TEMP_DIR/js/cache-updater.js" ]]; then
        sed -i.bak "s/^export const APP_VERSION = '.*';/export const APP_VERSION = '${NEW_VERSION}';/" "$TEMP_DIR/js/cache-updater.js" && rm "$TEMP_DIR/js/cache-updater.js.bak"
        if ! grep -q "export const APP_VERSION = '${NEW_VERSION}';" "$TEMP_DIR/js/cache-updater.js"; then
            echo -e "${RED}❌ Échec mise à jour APP_VERSION dans js/cache-updater.js${NC}" >&2
            exit 1
        fi
    else
        echo -e "${RED}❌ js/cache-updater.js introuvable dans le répertoire temporaire${NC}" >&2
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
    # Pas de domaine : les blocs de Plausible partent, entre leurs marqueurs (index.html).
    # L'ancienne règle allait jusqu'à la première ligne commençant par </script> : le bloc se
    # ferme par « ></script> », et la suppression emportait le reste de la page (1 416 lignes)
    sed -i.bak '/<!-- plausible:start -->/,/<!-- plausible:end -->/d' "$TEMP_DIR/index.html" && rm "$TEMP_DIR/index.html.bak"
    echo -e "${YELLOW}   ⚠️  Scripts Plausible supprimés (pas de domaine)${NC}"
fi

# Adresse de base de la voix enregistrée (balise vide dans le dépôt)
if [[ -n "$VOICE_BASE" ]]; then
    VOICE_META_EMPTY='<meta name="leapmultix-voice-base" content="" />'
    VOICE_META='<meta name="leapmultix-voice-base" content="/voice/" />'
    sed -i.bak "s|$VOICE_META_EMPTY|$VOICE_META|" "$TEMP_DIR/index.html" && rm "$TEMP_DIR/index.html.bak"
    if ! grep -qF "$VOICE_META" "$TEMP_DIR/index.html"; then
        echo -e "${RED}❌ Balise leapmultix-voice-base introuvable dans index.html${NC}" >&2
        exit 1
    fi
    echo -e "${GREEN}   ✅ Voix enregistrée configurée${NC}"
fi

# Autres remplacements potentiels peuvent être ajoutés ici
# sed -i "s/{{AUTRE_PLACEHOLDER}}/valeur/g" "$TEMP_DIR/fichier.html"

# Vérification du résultat
if grep -q "{{" "$TEMP_DIR/index.html"; then
    echo -e "${YELLOW}⚠️  Placeholders non remplacés détectés:${NC}"
    grep -n "{{.*}}" "$TEMP_DIR/index.html" || true
fi

# Numéro de version dans chaque adresse de module et de feuille de style. Les modules
# s'importent entre eux sans version et le navigateur les garde une semaine sans consulter
# le service worker : sans cela, un joueur déjà venu mélangeait anciens et nouveaux
# modules après un déploiement (export absent, mode qui ne démarre pas). Constaté le
# 25/09/2026 au passage en v22. Voir scripts/version-module-urls.mjs.
APP_VERSION_SITE=$(sed -n "s/^export const APP_VERSION = '\(.*\)';$/\1/p" "$TEMP_DIR/js/cache-updater.js")
if [[ -z "$APP_VERSION_SITE" ]]; then
    echo -e "${RED}❌ APP_VERSION introuvable dans js/cache-updater.js${NC}" >&2
    exit 1
fi
# Le service worker renouvelle sa copie quand VERSION change : une VERSION différente
# d'APP_VERSION laisserait les joueurs déjà venus sur l'ancienne copie des modules
SW_VERSION=$(sed -n "s/^const VERSION = '\([^']*\)';.*$/\1/p" "$TEMP_DIR/sw.js")
if [[ "$SW_VERSION" != "$APP_VERSION_SITE" ]]; then
    echo -e "${RED}❌ VERSION de sw.js (${SW_VERSION:-absente}) différente d'APP_VERSION (${APP_VERSION_SITE})${NC}" >&2
    exit 1
fi
echo -e "${BLUE}🔢 Version dans les adresses des modules : ${APP_VERSION_SITE}${NC}"
if ! node scripts/version-module-urls.mjs "$TEMP_DIR" "$APP_VERSION_SITE"; then
    echo -e "${RED}❌ Versionnage des adresses des modules en échec${NC}" >&2
    exit 1
fi

# Synchronisation S3
echo -e "${BLUE}☁️  Synchronisation S3...${NC}"

# La commande est un tableau, sans eval ; aucun lien suivi (la copie n'en a pas : rsync
# --no-links). Sans filtre : la copie ne contient que le site (liste rsync ci-dessus), et le
# bucket en devient le miroir exact. --delete efface donc aussi ce qu'un ancien déploiement a
# laissé hors de cette liste (813 fichiers de 2025 trouvés le 12/10/2026, dont dist/, une
# ancienne version du jeu servie sur le même domaine). Les voix sont dans un autre bucket.
SYNC_ARGS=(
  s3 sync --size-only --delete --no-follow-symlinks
  "$TEMP_DIR/" "s3://$S3_BUCKET"
)

if [[ "$DRY_RUN" == "true" ]]; then
    echo -e "${YELLOW}🔍 Mode dry-run - Commande qui serait exécutée:${NC}"
    # L'option de l'AWS CLI s'écrit --dryrun, sans tiret : avec --dry-run, la
    # commande échouait en « Unknown options » et la simulation ne montrait rien.
    echo "aws ${SYNC_ARGS[*]} --dryrun"
    aws "${SYNC_ARGS[@]}" --dryrun
else
    echo -e "${GREEN}📤 Synchronisation en cours...${NC}"

    if aws "${SYNC_ARGS[@]}"; then
        echo -e "${GREEN}✅ Synchronisation S3 terminée avec succès !${NC}"

        # La synchronisation compare les tailles (--size-only). Or un fichier texte
        # peut changer sans changer de taille, et n'était alors JAMAIS renvoyé :
        # - la version : « v19 » et « v20 » font le même nombre d'octets.
        #   Constaté le 21/09/2026, sw.js resté en v19 en ligne alors que le
        #   dépôt était en v20 : le renouvellement du cache n'arrivait pas ;
        # - les dates du sitemap : « 2025-11-10 » et « 2025-12-06 » aussi.
        #   Constaté le 24/09/2026, la prod gardait les anciennes dates ;
        # - les imports des modules JS, qui portent la version (« v22 » → « v23 ») ;
        # - un mot remplacé par un autre de même longueur. Constaté le 26/09/2026 :
        #   en.json resté en ligne avec « made with ElevenLabs » au lieu de
        #   « made with Mistral AI ».
        # Tous les fichiers texte du site partent donc d'office, avec le type que S3
        # leur donne : quelques centaines de kilo-octets. Seuls les fichiers binaires
        # (images, sons, vidéos, polices) s'en tiennent à la taille. Une nouvelle
        # sorte de fichier texte s'ajoute à la liste des extensions ci-dessous.
        echo -e "${BLUE}📌 Envoi forcé des fichiers texte (modifiés à taille constante)...${NC}"
        for fichier in sw.js js/cache-updater.js sitemap.xml index.html; do
            if [[ ! -f "$TEMP_DIR/$fichier" ]]; then
                echo -e "${RED}   ❌ $fichier introuvable — déploiement incohérent${NC}" >&2
                exit 1
            fi
        done
        for entree in '*.html:text/html' '*.js:text/javascript' '*.css:text/css' \
            '*.json:application/json' '*.xml:application/xml' '*.txt:text/plain'; do
            motif="${entree%%:*}"
            type_mime="${entree#*:}"
            if aws s3 cp "$TEMP_DIR" "s3://$S3_BUCKET" --recursive --no-follow-symlinks \
                --exclude "*" --include "$motif" \
                --content-type "$type_mime" --metadata-directive REPLACE > /dev/null; then
                echo -e "${GREEN}   ✅ $motif${NC}"
            else
                echo -e "${RED}   ❌ Envoi des fichiers $motif en échec${NC}" >&2
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
        echo -e "${RED}❌ Erreur lors du déploiement${NC}" >&2
        exit 1
    fi
fi

echo "=================================="
echo -e "${GREEN}🎉 Déploiement terminé${NC}"

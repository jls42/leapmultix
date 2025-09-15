#!/bin/bash
# 🚨 Commandes Lighthouse Mobile Phase 8.4
# Exécuter depuis le répertoire leapmultix

echo "🚨 AUDIT LIGHTHOUSE MOBILE - PHASE 8.4"
echo "======================================"

# S'assurer que Lighthouse est installé
if ! command -v lighthouse &> /dev/null; then
    echo "📦 Installation Lighthouse CLI..."
    npm install -g lighthouse
fi

# URLs à tester (ajuster selon votre configuration)
BASE_URL="http://localhost:8000"
REPORT_DIR="analysis/lighthouse-reports"

# Créer le répertoire de rapports
mkdir -p "$REPORT_DIR"

echo "📱 Test mobile principal..."
lighthouse "$BASE_URL" \
    --form-factor=mobile \
    --throttling-method=devtools \
    --throttling.rttMs=150 \
    --throttling.throughputKbps=1638.4 \
    --throttling.cpuSlowdownMultiplier=4 \
    --emulated-user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15" \
    --output=html,json \
    --output-path="$REPORT_DIR/mobile-main" \
    --chrome-flags="--headless --no-sandbox" \
    --disable-extensions \
    --quiet

echo "🎮 Test page jeu arcade mobile..."
lighthouse "$BASE_URL#arcade" \
    --form-factor=mobile \
    --throttling-method=devtools \
    --throttling.rttMs=150 \
    --throttling.throughputKbps=1638.4 \
    --throttling.cpuSlowdownMultiplier=4 \
    --output=html,json \
    --output-path="$REPORT_DIR/mobile-arcade" \
    --chrome-flags="--headless --no-sandbox" \
    --quiet

echo "⚙️ Test page customisation mobile..."
lighthouse "$BASE_URL#customization" \
    --form-factor=mobile \
    --throttling-method=devtools \
    --throttling.rttMs=150 \
    --throttling.throughputKbps=1638.4 \
    --throttling.cpuSlowdownMultiplier=4 \
    --output=html,json \
    --output-path="$REPORT_DIR/mobile-customization" \
    --chrome-flags="--headless --no-sandbox" \
    --quiet

echo ""
echo "✅ Audits Lighthouse mobile terminés !"
echo "📄 Rapports disponibles dans : $REPORT_DIR/"
echo ""
echo "📊 RÉSULTATS RAPIDES :"
echo "======================"

# Extraction scores rapide depuis JSON
for file in "$REPORT_DIR"/*.json; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .json)
        echo "📱 $filename :"
        
        # Performance
        perf=$(jq '.categories.performance.score * 100' "$file" 2>/dev/null | cut -d. -f1)
        echo "  ⚡ Performance: $perf/100"
        
        # Accessibilité  
        a11y=$(jq '.categories.accessibility.score * 100' "$file" 2>/dev/null | cut -d. -f1)
        echo "  ♿ Accessibility: $a11y/100"
        
        # Best Practices
        bp=$(jq '.categories["best-practices"].score * 100' "$file" 2>/dev/null | cut -d. -f1)
        echo "  ✅ Best Practices: $bp/100"
        
        echo ""
    fi
done

echo "🌐 Ouvrir rapports HTML :"
echo "========================"
echo "📱 Principal : file://$(pwd)/$REPORT_DIR/mobile-main.report.html"
echo "🎮 Arcade : file://$(pwd)/$REPORT_DIR/mobile-arcade.report.html"  
echo "⚙️ Custom : file://$(pwd)/$REPORT_DIR/mobile-customization.report.html"

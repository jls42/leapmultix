#!/usr/bin/env node

/**
 * Analyseur d'usage des images responsives
 * Vérifie l'implémentation et identifie les optimisations possibles
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ResponsiveUsageAnalyzer {
  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      jsFiles: 0,
      htmlFiles: 0,
      imagesInCode: [],
      responsiveImages: [],
      nonOptimizedImages: [],
      recommendations: [],
      coverage: {
        total: 0,
        optimized: 0,
        percentage: 0,
      },
    };
  }

  async analyze() {
    console.log('🔍 Analyse usage images responsives...');

    try {
      await this.scanCodebase();
      await this.checkImageMap();
      this.generateRecommendations();
      this.writeReport();
      this.displayResults();
    } catch (error) {
      console.error('❌ Erreur analyse:', error.message);
    }
  }

  async scanCodebase() {
    // Scanner les fichiers JS
    const jsFiles = this.findFiles('./js', '**/*.js');
    this.report.jsFiles = jsFiles.length;

    // Scanner les fichiers HTML
    const htmlFiles = this.findFiles('.', '*.html');
    this.report.htmlFiles = htmlFiles.length;

    // Analyser les références d'images dans le code
    [...jsFiles, ...htmlFiles].forEach(file => {
      this.analyzeFile(file);
    });

    console.log(`📊 Analysé ${jsFiles.length} JS + ${htmlFiles.length} HTML`);
  }

  findFiles(directory, pattern) {
    try {
      const result = execSync(`find ${directory} -name "${pattern}" -type f 2>/dev/null`, {
        encoding: 'utf-8',
      });
      return result
        .trim()
        .split('\n')
        .filter(file => file.length > 0);
    } catch (error) {
      return [];
    }
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Patterns de recherche d'images
      const patterns = [
        /src=['"]([^'"]*\.(png|jpg|jpeg|webp|svg))['"]/gi,
        /url\(['"]?([^'"]*\.(png|jpg|jpeg|webp|svg))['"]?\)/gi,
        /background-image:\s*url\(['"]?([^'"]*\.(png|jpg|jpeg|webp|svg))['"]?\)/gi,
        /\.src\s*=\s*['"]([^'"]*\.(png|jpg|jpeg|webp|svg))['"]/gi,
      ];

      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const imagePath = match[1];
          const isResponsive =
            content.includes('data-responsive') ||
            content.includes('ResponsiveImageLoader') ||
            content.includes('optimizeImage');

          const imageInfo = {
            file: filePath,
            imagePath: imagePath,
            isResponsive: isResponsive,
            context: this.detectImageContext(imagePath),
          };

          this.report.imagesInCode.push(imageInfo);

          if (isResponsive) {
            this.report.responsiveImages.push(imageInfo);
          } else {
            this.report.nonOptimizedImages.push(imageInfo);
          }
        }
      });
    } catch (error) {
      console.warn(`⚠️ Erreur lecture ${filePath}:`, error.message);
    }
  }

  detectImageContext(imagePath) {
    const filename = imagePath.toLowerCase();

    if (filename.includes('monstre') || filename.includes('monster')) {
      return 'monster';
    }
    if (filename.includes('logo')) {
      return 'logo';
    }
    if (filename.includes('background') || filename.includes('bg_')) {
      return 'background';
    }
    return 'ui';
  }

  async checkImageMap() {
    const imageMapPath = './dist/assets/images/image-map.json';

    if (fs.existsSync(imageMapPath)) {
      try {
        const imageMap = JSON.parse(fs.readFileSync(imageMapPath, 'utf-8'));
        const mapKeys = Object.keys(imageMap);

        console.log(`📋 Image map trouvée: ${mapKeys.length} assets mappés`);

        // Vérifier la couverture
        this.report.coverage.total = this.report.imagesInCode.length;
        this.report.coverage.optimized = this.report.responsiveImages.length;
        this.report.coverage.percentage =
          this.report.coverage.total > 0
            ? ((this.report.coverage.optimized / this.report.coverage.total) * 100).toFixed(1)
            : 0;
      } catch (error) {
        console.warn('⚠️ Erreur lecture image map:', error.message);
      }
    } else {
      console.warn('⚠️ Image map non trouvée - Exécuter npm run assets:generate');
      this.report.recommendations.push({
        type: 'critical',
        message: 'Générer la map des images: npm run assets:generate',
      });
    }
  }

  generateRecommendations() {
    // Recommandations basées sur l'analyse
    if (this.report.nonOptimizedImages.length > 0) {
      this.report.recommendations.push({
        type: 'optimization',
        message: `${this.report.nonOptimizedImages.length} images non optimisées détectées`,
        details: this.report.nonOptimizedImages.slice(0, 5).map(img => ({
          file: img.file,
          image: img.imagePath,
          suggestion: `Ajouter data-responsive="true" et utiliser ResponsiveImageLoader`,
        })),
      });
    }

    // Grouper par contexte pour recommandations spécifiques
    const contextGroups = {};
    this.report.nonOptimizedImages.forEach(img => {
      if (!contextGroups[img.context]) {
        contextGroups[img.context] = [];
      }
      contextGroups[img.context].push(img);
    });

    Object.entries(contextGroups).forEach(([context, images]) => {
      if (images.length > 3) {
        this.report.recommendations.push({
          type: 'pattern',
          message: `Optimisation groupée recommandée pour contexte "${context}"`,
          details: {
            context: context,
            count: images.length,
            suggestion: `Utiliser imageLoader.preloadImages() ou optimizeImageBySelector()`,
          },
        });
      }
    });

    // Recommandations performance
    if (this.report.coverage.percentage < 80) {
      this.report.recommendations.push({
        type: 'performance',
        message: 'Couverture responsive insuffisante',
        details: {
          current: `${this.report.coverage.percentage}%`,
          target: '80%+',
          suggestion: 'Migrer les images critiques vers le système responsive',
        },
      });
    }
  }

  writeReport() {
    const reportPath = './analysis/responsive-usage-report.json';

    fs.mkdirSync('./analysis', { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));

    console.log(`📄 Rapport sauvegardé: ${reportPath}`);
  }

  displayResults() {
    console.log('\n📊 Résultats analyse:');
    console.log(`🖼️  Images totales: ${this.report.coverage.total}`);
    console.log(`✅ Images optimisées: ${this.report.coverage.optimized}`);
    console.log(`📈 Couverture: ${this.report.coverage.percentage}%`);

    if (this.report.recommendations.length > 0) {
      console.log('\n💡 Recommandations:');
      this.report.recommendations.forEach((rec, index) => {
        const icon =
          rec.type === 'critical'
            ? '🔴'
            : rec.type === 'optimization'
              ? '🟡'
              : rec.type === 'performance'
                ? '🟠'
                : '🔵';
        console.log(`${icon} ${rec.message}`);
      });
    }

    // Top 5 des images à optimiser en priorité
    if (this.report.nonOptimizedImages.length > 0) {
      console.log('\n🎯 Top images à optimiser:');
      this.report.nonOptimizedImages.slice(0, 5).forEach((img, index) => {
        console.log(`${index + 1}. ${img.imagePath} (${img.context}) dans ${img.file}`);
      });
    }

    if (this.report.coverage.percentage >= 80) {
      console.log('\n🎉 Excellente couverture responsive !');
    }
  }
}

// Utilitaire pour migration rapide
function generateMigrationScript() {
  console.log('\n🔧 Script de migration rapide:');
  console.log(`
// Ajouter à votre code JS:
import ResponsiveImageLoader from './responsive-image-loader.js';

const imageLoader = new ResponsiveImageLoader();

// Pour optimiser toutes les images d'un conteneur:
document.querySelectorAll('.game-container img').forEach(img => {
  img.setAttribute('data-responsive', 'true');
  imageLoader.optimizeImage(img);
});

// Pour précharger des assets de jeu:
const monsterImages = ['monstre01.png', 'monstre02.png'];
imageLoader.preloadImages(monsterImages, 'monster');
  `);
}

if (require.main === module) {
  const analyzer = new ResponsiveUsageAnalyzer();
  analyzer.analyze().then(() => {
    if (process.argv.includes('--migration')) {
      generateMigrationScript();
    }
  });
}

module.exports = ResponsiveUsageAnalyzer;

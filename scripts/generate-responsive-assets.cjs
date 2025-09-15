#!/usr/bin/env node

/**
 * Générateur d'assets responsive multi-résolutions
 * Garde les originaux PNG, génère WebP optimisés par taille d'écran
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_SOURCE = './assets/images'; // Originaux
const ASSETS_DIST = './dist/assets/images'; // Build optimisés
const REPORT_FILE = './analysis/responsive-assets-report.json';

// Configuration des résolutions cibles
const RESOLUTION_TARGETS = {
  // Format: suffix -> {width, quality, description}
  64: { width: 64, quality: 85, desc: 'Icons/thumbnails' },
  128: { width: 128, quality: 85, desc: 'Mobile small' },
  256: { width: 256, quality: 80, desc: 'Mobile/tablet' },
  512: { width: 512, quality: 80, desc: 'Desktop standard' },
  1024: { width: 1024, quality: 75, desc: 'High-DPI/4K' },
};

// Patterns spéciaux par type d'asset
const ASSET_PATTERNS = {
  monsters: /monstre\d+/i,
  logos: /logo_mode/i,
  ui: /button|icon|arrow/i,
  backgrounds: /background|bg_/i,
};

class ResponsiveAssetGenerator {
  constructor() {
    this.report = {
      startTime: new Date().toISOString(),
      sourceFiles: 0,
      generatedFiles: 0,
      sizeBefore: 0,
      sizeAfter: 0,
      skippedFiles: 0,
      errors: [],
      resolutions: {},
    };

    // Initialiser compteurs par résolution
    Object.keys(RESOLUTION_TARGETS).forEach(res => {
      this.report.resolutions[res] = 0;
    });
  }

  async generate() {
    console.log('🎨 Génération assets responsive...');

    try {
      const hasTools = this.checkDependencies();

      if (!hasTools) {
        await this.fallbackMode();
        return;
      }

      await this.scanAndProcess();
      await this.generateImageMap();
      this.writeReport();
      this.displaySummary();
    } catch (error) {
      console.error('❌ Erreur critique:', error.message);
      process.exit(1);
    }
  }

  async fallbackMode() {
    console.log('🔄 Mode fallback: copie assets originaux...');

    try {
      // Créer mapping basique des assets existants
      const existingFiles = this.findSourceFiles();
      this.report.sourceFiles = existingFiles.length;

      // Copier les originaux vers dist (s'ils n'y sont pas déjà)
      existingFiles.forEach(sourceFile => {
        const relativePath = path.relative(ASSETS_SOURCE, sourceFile);
        const destFile = path.join(ASSETS_DIST, relativePath);
        const destDir = path.dirname(destFile);

        fs.mkdirSync(destDir, { recursive: true });

        if (!fs.existsSync(destFile)) {
          fs.copyFileSync(sourceFile, destFile);
        }
      });

      console.log(`📋 Copié ${existingFiles.length} assets originaux`);
      this.writeReport();
    } catch (error) {
      console.warn('⚠️ Mode fallback échoué:', error.message);
    }
  }

  checkDependencies() {
    const tools = ['cwebp', 'identify'];
    const missing = [];

    for (const tool of tools) {
      try {
        execSync(`which ${tool}`, { stdio: 'pipe' });
      } catch (e) {
        missing.push(tool);
      }
    }

    if (missing.length > 0) {
      console.warn(`⚠️  Outils manquants: ${missing.join(', ')}`);
      console.log(`💡 Pour optimisation complète:`);
      console.log(`   sudo apt install webp imagemagick optipng`);
      console.log(`🔄 Mode fallback: copie des originaux seulement`);
      return false;
    }
    return true;
  }

  async scanAndProcess() {
    if (!fs.existsSync(ASSETS_SOURCE)) {
      console.error(`❌ Dossier source introuvable: ${ASSETS_SOURCE}`);
      process.exit(1);
    }

    // Créer structure de destination
    fs.mkdirSync(ASSETS_DIST, { recursive: true });

    // Scanner tous les PNG sources
    const sourceFiles = this.findSourceFiles();
    this.report.sourceFiles = sourceFiles.length;

    console.log(`📊 Trouvé ${sourceFiles.length} fichiers PNG sources`);

    for (let i = 0; i < sourceFiles.length; i++) {
      const sourceFile = sourceFiles[i];
      try {
        await this.processFile(sourceFile);

        if ((i + 1) % 10 === 0) {
          console.log(`⏳ Progression: ${i + 1}/${sourceFiles.length} fichiers`);
        }
      } catch (error) {
        console.error(`❌ Erreur sur ${sourceFile}:`, error.message);
        this.report.errors.push({
          file: sourceFile,
          error: error.message,
        });
      }
    }
  }

  findSourceFiles() {
    try {
      const result = execSync(`find ${ASSETS_SOURCE} -name "*.png" -type f`, {
        encoding: 'utf-8',
      });
      return result
        .trim()
        .split('\n')
        .filter(file => file.length > 0);
    } catch (error) {
      console.error('❌ Erreur lors du scan des fichiers sources');
      return [];
    }
  }

  async processFile(sourceFile) {
    const relativePath = path.relative(ASSETS_SOURCE, sourceFile);
    const sourceStats = fs.statSync(sourceFile);
    this.report.sizeBefore += sourceStats.size;

    // Créer dossier de destination
    const destDir = path.join(ASSETS_DIST, path.dirname(relativePath));
    fs.mkdirSync(destDir, { recursive: true });

    // Copier l'original (pour fallback et contributeurs)
    const originalDest = path.join(ASSETS_DIST, relativePath);
    if (!fs.existsSync(originalDest)) {
      fs.copyFileSync(sourceFile, originalDest);
    }

    // Obtenir dimensions originales
    const dimensions = this.getImageDimensions(sourceFile);
    const baseName = path.basename(sourceFile, '.png');

    // Déterminer quelles résolutions générer
    const targetResolutions = this.getTargetResolutions(sourceFile, dimensions);

    for (const [suffix, config] of Object.entries(targetResolutions)) {
      await this.generateResolution(sourceFile, destDir, baseName, suffix, config);
      this.report.resolutions[suffix]++;
      this.report.generatedFiles++;
    }
  }

  getImageDimensions(filePath) {
    try {
      const output = execSync(`identify -format "%wx%h" "${filePath}"`, {
        encoding: 'utf-8',
      });
      const [width, height] = output.trim().split('x').map(Number);
      return { width, height };
    } catch (error) {
      console.warn(`⚠️  Impossible de lire dimensions: ${filePath}`);
      return { width: 1024, height: 1024 }; // Défaut
    }
  }

  getTargetResolutions(sourceFile, originalDimensions) {
    const filename = path.basename(sourceFile).toLowerCase();
    const targets = {};

    // Stratégie par type d'asset
    if (ASSET_PATTERNS.monsters.test(filename)) {
      // Monstres: toutes les résolutions
      Object.entries(RESOLUTION_TARGETS).forEach(([suffix, config]) => {
        if (config.width <= originalDimensions.width) {
          targets[suffix] = config;
        }
      });
    } else if (ASSET_PATTERNS.logos.test(filename)) {
      // Logos: résolutions moyennes
      ['128', '256', '512'].forEach(suffix => {
        if (RESOLUTION_TARGETS[suffix].width <= originalDimensions.width) {
          targets[suffix] = RESOLUTION_TARGETS[suffix];
        }
      });
    } else {
      // UI/autres: résolutions petites et moyennes
      ['64', '128', '256'].forEach(suffix => {
        if (RESOLUTION_TARGETS[suffix].width <= originalDimensions.width) {
          targets[suffix] = RESOLUTION_TARGETS[suffix];
        }
      });
    }

    return targets;
  }

  async generateResolution(sourceFile, destDir, baseName, suffix, config) {
    const webpFile = path.join(destDir, `${baseName}-${suffix}.webp`);

    // Skip si déjà généré
    if (fs.existsSync(webpFile)) {
      const stats = fs.statSync(webpFile);
      this.report.sizeAfter += stats.size;
      return;
    }

    try {
      // Générer WebP redimensionné avec transparence
      const cmd = `cwebp -resize ${config.width} 0 -q ${config.quality} -alpha_q 100 -mt "${sourceFile}" -o "${webpFile}"`;
      execSync(cmd, { stdio: 'pipe' });

      const stats = fs.statSync(webpFile);
      this.report.sizeAfter += stats.size;
    } catch (error) {
      throw new Error(`Échec génération ${webpFile}: ${error.message}`);
    }
  }

  async generateImageMap() {
    // Créer un mapping JSON pour le runtime
    const imageMap = {};

    try {
      const webpFiles = execSync(`find ${ASSETS_DIST} -name "*.webp" -type f`, {
        encoding: 'utf-8',
      })
        .trim()
        .split('\n')
        .filter(file => file.length > 0);

      webpFiles.forEach(webpFile => {
        const relativePath = path.relative(ASSETS_DIST, webpFile);
        const match = relativePath.match(/(.+)-(\d+)\.webp$/);

        if (match) {
          const baseName = match[1];
          const resolution = match[2];

          if (!imageMap[baseName]) {
            imageMap[baseName] = {
              original: `${baseName}.png`,
              resolutions: {},
            };
          }

          imageMap[baseName].resolutions[resolution] = relativePath;
        }
      });

      // Écrire le mapping
      const mapFile = path.join(ASSETS_DIST, 'image-map.json');
      fs.writeFileSync(mapFile, JSON.stringify(imageMap, null, 2));

      console.log(`📋 Image map générée: ${Object.keys(imageMap).length} assets`);
    } catch (error) {
      console.warn('⚠️  Impossible de générer image map:', error.message);
    }
  }

  writeReport() {
    this.report.endTime = new Date().toISOString();
    this.report.compressionRatio =
      this.report.sizeBefore > 0
        ? (
            ((this.report.sizeBefore - this.report.sizeAfter) / this.report.sizeBefore) *
            100
          ).toFixed(2)
        : 0;

    fs.mkdirSync('./analysis', { recursive: true });
    fs.writeFileSync(REPORT_FILE, JSON.stringify(this.report, null, 2));
  }

  displaySummary() {
    console.log('\n🎉 Génération terminée !');
    console.log(`📊 Sources: ${this.report.sourceFiles} fichiers PNG`);
    console.log(`🎨 Générés: ${this.report.generatedFiles} assets responsives`);
    console.log(`💾 Ratio compression: ${this.report.compressionRatio}%`);
    console.log(`📋 Résolutions:`);

    Object.entries(this.report.resolutions).forEach(([res, count]) => {
      if (count > 0) {
        console.log(`   ${res}px: ${count} fichiers (${RESOLUTION_TARGETS[res].desc})`);
      }
    });

    if (this.report.errors.length > 0) {
      console.log(`⚠️  Erreurs: ${this.report.errors.length} fichiers`);
    }

    console.log(`📄 Rapport détaillé: ${REPORT_FILE}`);
  }
}

// Exécution si script appelé directement
if (require.main === module) {
  const generator = new ResponsiveAssetGenerator();
  generator.generate();
}

module.exports = ResponsiveAssetGenerator;

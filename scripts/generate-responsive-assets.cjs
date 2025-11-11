#!/usr/bin/env node

/**
 * Générateur d'assets responsive multi-résolutions
 * Garde les originaux PNG, génère WebP optimisés par taille d'écran
 */

const fs = require('fs');
const path = require('path');
let sharp = null;

try {
  // sharp fournit la conversion WebP + resize avec support alpha
  sharp = require('sharp');
} catch (error) {
  // La dépendance n'est peut-être pas installée dans l'environnement courant
  console.warn('⚠️  Module "sharp" introuvable. Activera le mode fallback.');
}

const ASSETS_SOURCE = './assets/images'; // Originaux
const ASSETS_DIST = './dist/assets/images'; // Build optimisés pour futur build
const PUBLIC_ASSETS_DIR = './assets/generated-images'; // Compatible deploy.sh actuel
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
      await this.syncToPublicDir();
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
      await this.syncToPublicDir();
      this.writeReport();
    } catch (error) {
      console.warn('⚠️ Mode fallback échoué:', error.message);
    }
  }

  checkDependencies() {
    if (!sharp) {
      console.warn("⚠️  sharp n'est pas installé.");
      console.log('💡 Pour activer la génération WebP: npm install --save-dev sharp');
      console.log('🔄 Mode fallback: copie des originaux seulement');
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
    return this.walkFiles(ASSETS_SOURCE, '.png');
  }

  walkFiles(rootDir, extension) {
    const files = [];

    const walk = currentDir => {
      if (!fs.existsSync(currentDir)) {
        return;
      }

      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) {
          files.push(fullPath);
        }
      }
    };

    walk(rootDir);
    return files;
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
    const dimensions = await this.getImageDimensions(sourceFile);
    const baseName = path.basename(sourceFile, '.png');

    // Déterminer quelles résolutions générer
    const targetResolutions = this.getTargetResolutions(sourceFile, dimensions);

    for (const [suffix, config] of Object.entries(targetResolutions)) {
      await this.generateResolution(sourceFile, destDir, baseName, suffix, config);
      this.report.resolutions[suffix]++;
      this.report.generatedFiles++;
    }
  }

  async getImageDimensions(filePath) {
    try {
      if (!sharp) {
        return { width: 1024, height: 1024 };
      }
      const metadata = await sharp(filePath).metadata();
      return {
        width: metadata.width || 1024,
        height: metadata.height || 1024,
      };
    } catch (error) {
      console.warn(`⚠️  Impossible de lire dimensions: ${filePath}`);
      return { width: 1024, height: 1024 };
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
      if (!sharp) {
        throw new Error('sharp non disponible');
      }

      await sharp(sourceFile)
        .resize({ width: config.width, withoutEnlargement: true })
        .webp({
          quality: config.quality,
          alphaQuality: 100,
          effort: 5,
        })
        .toFile(webpFile);

      const stats = fs.statSync(webpFile);
      this.report.sizeAfter += stats.size;
    } catch (error) {
      throw new Error(`Échec génération ${webpFile}: ${error.message}`);
    }
  }

  async generateImageMap() {
    const imageMap = {};

    try {
      const webpFiles = this.walkFiles(ASSETS_DIST, '.webp');

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

      const mapFile = path.join(ASSETS_DIST, 'image-map.json');
      fs.writeFileSync(mapFile, JSON.stringify(imageMap, null, 2));

      console.log(`📋 Image map générée: ${Object.keys(imageMap).length} assets`);
    } catch (error) {
      console.warn('⚠️  Impossible de générer image map:', error.message);
    }
  }

  async syncToPublicDir() {
    if (!PUBLIC_ASSETS_DIR) {
      return;
    }

    try {
      fs.rmSync(PUBLIC_ASSETS_DIR, { recursive: true, force: true });
      fs.mkdirSync(path.dirname(PUBLIC_ASSETS_DIR), { recursive: true });
      fs.cpSync(ASSETS_DIST, PUBLIC_ASSETS_DIR, { recursive: true });
      console.log(`📦 Assets copiés vers ${PUBLIC_ASSETS_DIR} (déploiement direct)`);
    } catch (error) {
      console.warn(
        '⚠️  Impossible de copier les assets générés vers assets/generated-images:',
        error.message
      );
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

#!/usr/bin/env node

/**
 * Générateur d'assets responsive multi-résolutions
 * Garde les originaux PNG, génère WebP optimisés par taille d'écran
 */

const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { inSequence } = require('./lib/in-sequence.cjs');
let sharp = null;

try {
  // sharp fournit la conversion WebP + resize avec support alpha
  sharp = require('sharp');
} catch {
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
  // Logos des modes (accueil, tableau de bord) et des jeux (menu de l'Arcade), cadeaux de
  // l'Aventure, têtes des avatars (leur source de 1024 px) : affichés de 40 à 144 px,
  // jusqu'à 512 pour un écran de densité 3
  illustrations: /logo_(?:mode|multi)|cadeau_|(?:_head_avatar\.png$)/i,
  ui: /button|icon|arrow/i,
  backgrounds: /background|bg_/i,
};

// Catalogue des images des jeux d'Arcade (module ES lu par import dynamique)
const ARCADE_CATALOG = path.resolve(__dirname, '../js/arcade-sprite-catalog.js');
// Une image d'Arcade demandée au-delà de 256 px (fusées, personnages, textures) : dessinée en
// grand sur un écran dense, sa source reçoit toutes les résolutions, 512 et 1024 compris
const SMALL_SET_MAX_WIDTH = 256;

/** Chemin d'une source relatif à assets/images, avec des « / » (« arcade/fox.png ») */
function sourceKey(sourceFile) {
  return path.relative(ASSETS_SOURCE, sourceFile).split(path.sep).join('/');
}

/** Fins de ligne : le « . » d'une expression régulière ne les traverse pas */
const LINE_BREAKS = ['\n', '\r', '\u2028', '\u2029'];

/**
 * Base et largeur d'une variante « <base>-<largeur>.webp », comme le faisait
 * /(.+)-(\d+)\.webp$/, sans ses retours arrière : le suffixe d'abord, puis la base devant
 * lui, depuis la dernière fin de ligne (que « . » ne traverse pas)
 * @param {string} relativePath
 * @returns {{baseName: string, resolution: string} | null}
 */
function variantOf(relativePath) {
  const suffix = /-(\d+)\.webp$/.exec(relativePath);
  if (!suffix) return null;
  const head = relativePath.slice(0, suffix.index);
  const baseName = head.slice(Math.max(...LINE_BREAKS.map(mark => head.lastIndexOf(mark))) + 1);
  return baseName ? { baseName, resolution: suffix[1] } : null;
}

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

    // Sources haute définition des jeux d'Arcade (loadArcadeSources)
    this.arcadeHdSources = new Set();
  }

  /**
   * Sources que les jeux d'Arcade peuvent demander au-delà de 256 px, d'après leur
   * catalogue (js/arcade-sprite-catalog.js) : seules elles reçoivent 512 et 1024.
   */
  async loadArcadeSources() {
    const catalog = await import(pathToFileURL(ARCADE_CATALOG).href);
    const large = catalog.arcadeSpriteSpecs().filter(spec => spec.maxWidth > SMALL_SET_MAX_WIDTH);
    this.arcadeHdSources = new Set(large.map(spec => `arcade/${spec.source}.png`));
  }

  async generate() {
    console.log('🎨 Génération assets responsive...');

    try {
      const hasTools = this.checkDependencies();

      if (!hasTools) {
        await this.fallbackMode();
        return;
      }

      await this.loadArcadeSources();
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

    await inSequence(sourceFiles, async (sourceFile, i) => {
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
    });
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

    await inSequence(Object.entries(targetResolutions), async ([suffix, config]) => {
      await this.generateResolution(sourceFile, destDir, baseName, suffix, config);
      this.report.resolutions[suffix]++;
      this.report.generatedFiles++;
    });
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
    } catch {
      console.warn(`⚠️  Impossible de lire dimensions: ${filePath}`);
      return { width: 1024, height: 1024 };
    }
  }

  getTargetResolutions(sourceFile, originalDimensions) {
    const filename = path.basename(sourceFile).toLowerCase();
    const targets = {};

    // Stratégie par type d'asset
    if (ASSET_PATTERNS.monsters.test(filename) || this.arcadeHdSources.has(sourceKey(sourceFile))) {
      // Monstres, et sources haute définition des jeux d'Arcade (js/arcade-sprite-catalog.js) :
      // toutes les résolutions, pour une image nette en grand écran comme sur un téléphone
      return Object.fromEntries(
        Object.entries(RESOLUTION_TARGETS).filter(
          ([, config]) => config.width <= originalDimensions.width
        )
      );
    } else if (ASSET_PATTERNS.illustrations.test(filename)) {
      // Logos, cadeaux et têtes : résolutions moyennes
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
        const match = variantOf(relativePath);

        if (match) {
          const { baseName, resolution } = match;

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
  // Un échec doit faire échouer le déploiement : code de sortie 1, jamais un succès muet
  generator.generate().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = ResponsiveAssetGenerator;

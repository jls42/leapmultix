/**
 * Système de chargement intelligent d'images responsives
 * Sélection automatique de la résolution optimale selon le device
 */

class ResponsiveImageLoader {
  constructor() {
    this.imageMap = null;
    this.imageMapPaths = [
      '/assets/generated-images/image-map.json',
      '/assets/images/image-map.json',
    ];
    this.activeImageMapPath = null;
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.screenWidth = window.innerWidth;
    this.imageCache = new Map();
    this.loadingPromises = new Map();

    // Configuration des breakpoints
    this.breakpoints = {
      mobile: 480,
      tablet: 768,
      desktop: 1200,
      largeDesktop: 1920,
    };

    // Mapping tailles selon contexte
    this.sizeContexts = {
      monster: {
        mobile: 128,
        tablet: 256,
        desktop: 512,
        largeDesktop: 512,
      },
      logo: {
        mobile: 128,
        tablet: 256,
        desktop: 256,
        largeDesktop: 256,
      },
      ui: {
        mobile: 64,
        tablet: 64,
        desktop: 128,
        largeDesktop: 128,
      },
      background: {
        mobile: 256,
        tablet: 512,
        desktop: 1024,
        largeDesktop: 1024,
      },
    };

    // Démarrer l'initialisation async séparément du constructeur
    setTimeout(() => this.init(), 0);
  }

  async init() {
    try {
      await this.loadImageMap();
      this.setupEventListeners();
      console.log('🎨 Responsive Image Loader initialisé');
    } catch (error) {
      console.warn('⚠️ Erreur init ResponsiveImageLoader:', error);
      // Fallback vers comportement classique
    }
  }

  async loadImageMap() {
    for (const candidate of this.imageMapPaths) {
      try {
        const response = await fetch(candidate, { cache: 'reload' });
        if (!response.ok) {
          continue;
        }
        this.imageMap = await response.json();
        this.activeImageMapPath = candidate;
        console.log(`🗺️  Image map chargée depuis ${candidate}`);
        return;
      } catch {
        // essayer prochain candidat
      }
    }

    console.warn('⚠️ Image map non disponible, mode fallback');
    this.imageMap = null;
  }

  setupEventListeners() {
    // Réévaluer les images lors du redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.screenWidth = window.innerWidth;
        this.reloadVisibleImages();
      }, 250);
    });

    // Observer les mutations DOM pour nouvelles images
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            // Element node
            this.processNewImages(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  processNewImages(element) {
    const images =
      element.tagName === 'IMG'
        ? [element]
        : Array.from(element.querySelectorAll('img[data-responsive]'));

    images.forEach(img => this.optimizeImage(img));
  }

  /**
   * Optimise une image selon l'écran et le contexte
   * @param {HTMLImageElement} img - Element image à optimiser
   * @param {string} context - Contexte: 'monster', 'logo', 'ui', 'background'
   */
  async optimizeImage(img, context = null) {
    try {
      if (img?.dataset?.responsive === 'false') {
        return;
      }
      const imagePath = img.src || img.dataset.src;
      if (!imagePath) return;

      // Déterminer le contexte automatiquement si non fourni
      if (!context) {
        context = this.detectImageContext(imagePath);
      }

      // Calculer la taille optimale
      const optimalSize = this.calculateOptimalSize(context);
      const optimalUrl = this.getOptimalImageUrl(imagePath, optimalSize);

      // Charger l'image optimale
      if (optimalUrl !== imagePath) {
        await this.loadOptimalImage(img, optimalUrl, imagePath);
      }
    } catch (error) {
      console.warn('⚠️ Erreur optimisation image:', error);
      // L'image originale reste en fallback
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

  calculateOptimalSize(context) {
    const deviceCategory = this.getDeviceCategory();

    const baseSize = this.sizeContexts[context]?.[deviceCategory] || 256;

    // Ajuster selon pixel ratio pour écrans haute densité
    if (this.devicePixelRatio > 1.5) {
      return Math.min(baseSize * 1.5, 1024);
    }

    return baseSize;
  }

  getDeviceCategory() {
    const width = this.screenWidth;

    if (width <= this.breakpoints.mobile) return 'mobile';
    if (width <= this.breakpoints.tablet) return 'tablet';
    if (width <= this.breakpoints.desktop) return 'desktop';
    return 'largeDesktop';
  }

  getOptimalImageUrl(originalUrl, targetSize) {
    if (!this.imageMap) return originalUrl;

    // Extraire le nom de base de l'image
    const baseName = this.extractBaseName(originalUrl);

    const imageConfig = this.imageMap[baseName];

    if (!imageConfig?.resolutions) return originalUrl;

    // Trouver la résolution la plus proche
    const availableSizes = Object.keys(imageConfig.resolutions)
      .map(Number)
      .sort((a, b) => a - b);
    const bestSize = this.findBestSize(availableSizes, targetSize);

    if (bestSize && imageConfig.resolutions[bestSize]) {
      return `/assets/generated-images/${imageConfig.resolutions[bestSize]}`;
    }

    return originalUrl;
  }

  extractBaseName(url) {
    // Extract relative path with directory (e.g., "arcade/monstre04_left_128x128")
    // Input: "assets/images/arcade/monstre04_left_128x128.png"
    // Output: "arcade/monstre04_left_128x128"
    const relativePath = url
      .replace(/^.*assets\/images\//, '')
      .replace(/\.(png|webp|jpg|jpeg)$/i, '');
    return relativePath;
  }

  findBestSize(availableSizes, targetSize) {
    // Préférer la taille immédiatement supérieure, ou la plus proche
    const larger = availableSizes.find(size => size >= targetSize);
    if (larger) return larger;

    // Si aucune taille supérieure, prendre la plus grande disponible
    return availableSizes[availableSizes.length - 1];
  }

  async loadOptimalImage(img, optimalUrl, fallbackUrl) {
    const cacheKey = optimalUrl;

    // Éviter les chargements multiples de la même image
    if (this.loadingPromises.has(cacheKey)) {
      await this.loadingPromises.get(cacheKey);
      return;
    }

    const loadingPromise = new Promise((resolve, reject) => {
      const testImg = new Image();

      testImg.onload = () => {
        // Image chargée avec succès, l'utiliser
        img.src = optimalUrl;
        this.imageCache.set(cacheKey, true);
        resolve();
      };

      testImg.onerror = () => {
        // Fallback vers image originale
        if (img.src !== fallbackUrl) {
          img.src = fallbackUrl;
        }
        reject(new Error('Optimal image failed to load'));
      };

      // Support WebP avec fallback PNG
      if (optimalUrl.endsWith('.webp') && !this.supportsWebP()) {
        const pngUrl = optimalUrl.replace('.webp', '.png');
        testImg.src = pngUrl;
      } else {
        testImg.src = optimalUrl;
      }
    });

    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      await loadingPromise;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  supportsWebP() {
    if (this._webpSupport === undefined) {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      this._webpSupport = canvas.toDataURL('image/webp').startsWith('data:image/webp');
    }
    return this._webpSupport;
  }

  reloadVisibleImages() {
    const images = document.querySelectorAll('img[data-responsive]');
    const visibleImages = Array.from(images).filter(img => {
      const rect = img.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });

    visibleImages.forEach(img => this.optimizeImage(img));
  }

  /**
   * Utilitaire pour optimiser programmatiquement une image
   * @param {string} selector - Sélecteur CSS de l'image
   * @param {string} context - Contexte optionnel
   */
  optimizeImageBySelector(selector, context = null) {
    const img = document.querySelector(selector);
    if (img) {
      img.setAttribute('data-responsive', 'true');
      this.optimizeImage(img, context);
    }
  }

  /**
   * Préchargement d'images pour un contexte donné
   * @param {string[]} imageUrls - URLs des images à précharger
   * @param {string} context - Contexte des images
   */
  async preloadImages(imageUrls, context = 'monster') {
    const optimalSize = this.calculateOptimalSize(context);

    const preloadPromises = imageUrls.map(async url => {
      const optimalUrl = this.getOptimalImageUrl(url, optimalSize);

      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Continuer même en cas d'erreur
        img.src = optimalUrl;
      });
    });

    await Promise.all(preloadPromises);
    console.log(`🎨 Préchargement terminé: ${imageUrls.length} images (${context})`);
  }
}

// Export pour utilisation comme module
export default ResponsiveImageLoader;

// Instance globale pour rétrocompatibilité
window.ResponsiveImageLoader = ResponsiveImageLoader;

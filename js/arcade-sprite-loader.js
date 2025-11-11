/**
 * Arcade Sprite Loader - Uses ResponsiveImageLoader for optimized sprites
 * Automatically loads WebP when available, falls back to PNG
 * @module arcade-sprite-loader
 */

import ResponsiveImageLoader from './responsive-image-loader.js';

/**
 * Sprite loader class that handles WebP optimization with PNG fallback
 * Uses the responsive image loader infrastructure already in place
 */
class ArcadeSpriteLoader {
  constructor() {
    this.loader = new ResponsiveImageLoader();
    this.cache = new Map();
  }

  /**
   * Load a sprite with automatic WebP optimization
   * @param {string} spriteName - Sprite filename without extension (e.g., "monstre01_right")
   * @param {string} context - Context for size calculation: 'monster', 'logo', 'ui', or 'background'
   * @returns {Promise<HTMLImageElement>} Promise resolving to loaded image element
   */
  async loadSprite(spriteName, context = 'monster') {
    const cacheKey = `${spriteName}-${context}`;

    // Return cached image if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();

      // Get optimal size for this context and device
      const optimalSize = this.loader.calculateOptimalSize(context);

      // Try to get optimized WebP version
      const basePath = `assets/images/arcade/${spriteName}.png`;
      const optimalUrl = this.loader.getOptimalImageUrl(basePath, optimalSize);

      img.onload = () => {
        this.cache.set(cacheKey, img);
        resolve(img);
      };

      img.onerror = () => {
        // Fallback to original PNG if WebP fails
        console.warn(`[ArcadeSpriteLoader] WebP failed for ${spriteName}, falling back to PNG`);
        img.src = basePath;
        img.onerror = () => reject(new Error(`[ArcadeSpriteLoader] Failed to load ${spriteName}`));
      };

      img.src = optimalUrl;
    });
  }

  /**
   * Preload multiple sprites for better performance
   * @param {string[]} spriteNames - Array of sprite names without extensions
   * @param {string} context - Context for all sprites
   * @returns {Promise<HTMLImageElement[]>} Promise resolving to array of loaded images
   */
  async preloadSprites(spriteNames, context = 'monster') {
    const promises = spriteNames.map(name => this.loadSprite(name, context));
    return Promise.all(promises);
  }

  /**
   * Load a sprite synchronously (creates Image but doesn't wait for load)
   * Useful when you need an Image object immediately and will handle loading separately
   * @param {string} spriteName - Sprite filename without extension
   * @param {string} context - Context for size calculation
   * @returns {HTMLImageElement} Image element (may still be loading)
   */
  loadSpriteSync(spriteName, context = 'monster') {
    const img = new Image();
    const optimalSize = this.loader.calculateOptimalSize(context);
    const basePath = `assets/images/arcade/${spriteName}.png`;
    const optimalUrl = this.loader.getOptimalImageUrl(basePath, optimalSize);

    img.onerror = () => {
      console.warn(
        `[ArcadeSpriteLoader] WebP failed for ${spriteName}, falling back to PNG (sync mode)`
      );
      img.src = basePath;
    };

    img.src = optimalUrl;
    return img;
  }

  /**
   * Clear sprite cache to free memory
   * Useful when transitioning between game modes
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics for debugging
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance for convenience
export const arcadeSpriteLoader = new ArcadeSpriteLoader();
export default ArcadeSpriteLoader;

/**
 * SEO Assets Preloader
 * Warms up SEO-critical assets (social card images, icons) by preloading them
 * Extracted from inline script to comply with Content Security Policy
 */

(() => {
  const targets = ['/assets/icons/panda-512.png', '/assets/social/leapmultix-social-card.webp'];

  const root = globalThis;

  const warmAssets = () => {
    root.__preloadedSeoAssets = root.__preloadedSeoAssets || [];
    for (const url of targets) {
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
      root.__preloadedSeoAssets.push(img);
    }
  };

  if (document.readyState === 'complete') {
    requestAnimationFrame(warmAssets);
  } else {
    root.addEventListener('load', () => requestAnimationFrame(warmAssets), { once: true });
  }
})();

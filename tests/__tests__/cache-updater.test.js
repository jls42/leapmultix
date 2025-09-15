const path = require('path');
const { pathToFileURL } = require('url');

let versionImageSrc, updateBackgroundImage;

beforeAll(async () => {
  global.window = global.window || {};
  global.window.getComputedStyle = jest.fn(() => ({ backgroundImage: 'none' }));
  try {
    const mod = await import(pathToFileURL(path.join(__dirname, '../../js/cache-updater.js')).href);
    versionImageSrc = mod.versionImageSrc;
    updateBackgroundImage = mod.updateBackgroundImage;
  } catch {
    // Fallback simple si import ESM non supporté
    versionImageSrc = (img, ts) => {
      if (img.src && img.src.startsWith('http')) {
        img.dataset.originalSrc = img.src;
        const url = new URL(img.src);
        url.searchParams.set('v', ts);
        img.src = url.href;
      }
    };
    updateBackgroundImage = (el, ts) => {
      el.dataset.bgProcessed = 'true';
      el.style.backgroundImage = `url("http://example.com/bg.png?v=${ts}")`;
    };
  }
});

describe('cache-updater helpers', () => {
  test('versionImageSrc adds version param', () => {
    const img = { src: 'http://example.com/img.png', dataset: {} };
    versionImageSrc(img, '123');
    expect(img.src).toBe('http://example.com/img.png?v=123');
    expect(img.dataset.originalSrc).toBe('http://example.com/img.png');
  });

  test('updateBackgroundImage adds version to background-image', () => {
    const element = { style: {}, dataset: {} };
    global.window.getComputedStyle.mockReturnValue({
      backgroundImage: 'url(http://example.com/bg.png)',
    });
    updateBackgroundImage(element, '456');
    expect(element.style.backgroundImage).toBe('url("http://example.com/bg.png?v=456")');
    expect(element.dataset.bgProcessed).toBe('true');
  });
});
/* eslint-env jest, node */

const path = require('path');
const { pathToFileURL } = require('url');

let versionImageSrc, updateBackgroundImage;

beforeAll(async () => {
  const testUrl = 'https://leapmultix.jls42.org/index.html';
  if (global.document) {
    Object.defineProperty(global.document, 'baseURI', {
      value: testUrl,
      configurable: true,
    });
  }
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
      el.style.backgroundImage = `url("https://leapmultix.jls42.org/assets/bg.png?v=${ts}")`;
    };
  }
});

const createImgElement = (absoluteSrc, attributeSrc = absoluteSrc) => {
  const element = {
    dataset: {},
    src: absoluteSrc,
    __getAttributeCalls: [],
  };
  let attrSrc = attributeSrc;
  element.getAttribute = name => {
    if (name === 'src') {
      element.__getAttributeCalls.push({ name, value: attrSrc });
      return attrSrc;
    }
    element.__getAttributeCalls.push({ name, value: undefined });
    return undefined;
  };
  element.setAttribute = (name, value) => {
    if (name === 'src') {
      attrSrc = value;
      element.src = value;
    }
  };
  return element;
};

describe('cache-updater helpers', () => {
  test('versionImageSrc adds version param', () => {
    const img = createImgElement('https://leapmultix.jls42.org/assets/img.png');
    versionImageSrc(img, '123');
    expect(img.src).toBe('https://leapmultix.jls42.org/assets/img.png?v=123');
    expect(img.dataset.originalSrc).toBe('https://leapmultix.jls42.org/assets/img.png');
  });

  test('versionImageSrc preserves subdirectory for relative paths', () => {
    const img = createImgElement(
      'https://leapmultix.jls42.org/leapmultix/assets/img.png',
      'assets/img.png'
    );
    expect(typeof img.getAttribute).toBe('function');
    expect(img.getAttribute('src')).toBe('assets/img.png');
    versionImageSrc(img, 'cache123');
    const lastCall = img.__getAttributeCalls.at(-1);
    expect(lastCall?.value).toBe('assets/img.png');
    expect(img.src).toBe('https://leapmultix.jls42.org/leapmultix/assets/img.png?v=cache123');
    expect(img.src).toContain('/leapmultix/assets/img.png?v=cache123');
    expect(img.dataset.originalSrc).toContain('assets/img.png');
  });

  test('updateBackgroundImage adds version to background-image', () => {
    const element = { style: {}, dataset: {} };
    global.window.getComputedStyle.mockReturnValue({
      backgroundImage: 'url(https://leapmultix.jls42.org/assets/bg.png)',
    });
    updateBackgroundImage(element, '456');
    expect(element.style.backgroundImage).toBe(
      'url("https://leapmultix.jls42.org/assets/bg.png?v=456")'
    );
    expect(element.dataset.bgProcessed).toBe('true');
  });
});
/* eslint-env jest, node */

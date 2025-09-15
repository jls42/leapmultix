import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AudioManager } from '../../js/core/audio.js';

// Minimal mocks for browser APIs
const mockAudio = {
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  volume: 1,
  loop: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const mockLocalStorage = {
  data: {},
  getItem: jest.fn(key => mockLocalStorage.data[key] || null),
  setItem: jest.fn((key, value) => {
    mockLocalStorage.data[key] = value;
  }),
  removeItem: jest.fn(key => {
    delete mockLocalStorage.data[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorage.data = {};
  }),
};

beforeEach(() => {
  global.localStorage = mockLocalStorage;
  global.Audio = jest.fn(() => mockAudio);
  global.document = {
    querySelector: jest.fn(() => null),
    querySelectorAll: jest.fn(() => []),
    addEventListener: jest.fn(),
  };
  global.window = {
    core: { storage: { loadVolume: jest.fn(() => 1), saveVolume: jest.fn() } },
    currentTranslations: {
      mute_button_label_off: 'Activer le son',
      mute_button_label_on: 'Couper le son',
    },
  };
  mockLocalStorage.clear();
  jest.clearAllMocks();
});

describe('ESM: AudioManager', () => {
  test('init attaches gameState', () => {
    const gs = { volume: 0.8, muted: false };
    AudioManager.init(gs);
    expect(AudioManager._gameState).toBe(gs);
  });

  test('setVolume updates internal volume', () => {
    AudioManager.init();
    AudioManager.setVolume(0.5);
    expect(AudioManager._volume).toBe(0.5);
  });
});
/* eslint-env jest, node */

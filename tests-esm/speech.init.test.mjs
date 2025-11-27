import { jest } from '@jest/globals';

const originalReadyStateDescriptor = Object.getOwnPropertyDescriptor(document, 'readyState');

describe('Speech audio sync initialization', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    if (originalReadyStateDescriptor) {
      Object.defineProperty(document, 'readyState', {
        ...originalReadyStateDescriptor,
        configurable: true,
        value: 'complete',
      });
    } else {
      Object.defineProperty(document, 'readyState', {
        configurable: true,
        enumerable: true,
        value: 'complete',
      });
    }
  });

  afterEach(() => {
    if (originalReadyStateDescriptor) {
      Object.defineProperty(document, 'readyState', originalReadyStateDescriptor);
    } else {
      delete document.readyState;
    }
    delete globalThis.speechSynthesis;
    delete globalThis.SpeechSynthesisUtterance;
  });

  test('late imports stay in sync with current mute state', async () => {
    const getVolumeMock = jest.fn(() => 0.3);
    const isMutedMock = jest.fn(() => true);
    const eventBusOnMock = jest.fn();
    const cancelMock = jest.fn();
    const speakMock = jest.fn();

    jest.unstable_mockModule('../js/core/audio.js', () => ({
      AudioManager: {
        getVolume: getVolumeMock,
        isMuted: isMutedMock,
      },
    }));

    jest.unstable_mockModule('../js/core/eventBus.js', () => ({
      eventBus: {
        on: eventBusOnMock,
      },
    }));

    jest.unstable_mockModule('../js/core/storage.js', () => ({
      default: {
        loadVoiceEnabled: jest.fn(() => true),
      },
    }));

    globalThis.speechSynthesis = {
      cancel: cancelMock,
      speak: speakMock,
      speaking: false,
      pending: false,
      getVoices: jest.fn(() => []),
    };
    globalThis.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) {
      this.text = String(text ?? '');
      this.volume = 1;
      this.rate = 1;
      this.pitch = 1;
      this.lang = 'fr-FR';
    };

    const speechModule = await import('../js/speech.js');

    expect(getVolumeMock).toHaveBeenCalledTimes(1);
    expect(isMutedMock).toHaveBeenCalledTimes(1);
    expect(cancelMock).toHaveBeenCalledTimes(1);
    expect(eventBusOnMock).toHaveBeenCalledTimes(1);
    expect(eventBusOnMock.mock.calls[0][0]).toBe('volumeChanged');
    expect(typeof eventBusOnMock.mock.calls[0][1]).toBe('function');

    speechModule.speak('Message muet');
    expect(speakMock).not.toHaveBeenCalled();

    const handler = eventBusOnMock.mock.calls[0][1];
    handler({ detail: { volume: 0.8, muted: false } });

    speechModule.speak('Message audible');
    expect(speakMock).toHaveBeenCalledTimes(1);
  });
});

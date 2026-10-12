/**
 * Voix de l'appareil (js/speech.js, getBestVoice) : une voix locale d'abord, rien ne quitte
 * l'appareil ; une voix réseau (« Google français » de Chrome, qui envoie chaque phrase à
 * son service) seulement si l'appareil n'a aucune voix de la langue. Les voix de piètre
 * qualité (eSpeak…) restent écartées, et la région exacte passe avant les autres.
 */
import { jest } from '@jest/globals';

const voice = (name, lang, localService) => ({ name, lang, localService });

/** Voix que le jeu donne à sa première phrase, l'appareil ayant ces voix */
async function chosenVoice(voices, gameLang = 'fr') {
  jest.resetModules();
  jest.unstable_mockModule('../js/core/audio.js', () => ({
    AudioManager: { getVolume: () => 1, isMuted: () => false },
  }));
  jest.unstable_mockModule('../js/core/eventBus.js', () => ({ eventBus: { on: () => {} } }));
  jest.unstable_mockModule('../js/core/storage.js', () => ({
    default: { loadVoiceEnabled: () => true },
  }));
  const spoken = [];
  globalThis.speechSynthesis = {
    cancel: () => {},
    speak: utterance => spoken.push(utterance),
    speaking: false,
    pending: false,
    getVoices: () => voices,
  };
  globalThis.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) {
    this.text = String(text ?? '');
  };
  const speech = await import('../js/speech.js');
  speech.updateSpeechVoice(gameLang);
  speech.speak('Bonjour');
  return spoken.at(-1)?.voice?.name ?? null;
}

afterEach(() => {
  delete globalThis.speechSynthesis;
  delete globalThis.SpeechSynthesisUtterance;
});

const GOOGLE_FR = voice('Google français', 'fr-FR', false);

describe('Voix de l’appareil', () => {
  test('une voix locale passe avant « Google français », voix réseau de Chrome', async () => {
    const hortense = voice('Microsoft Hortense - French (France)', 'fr-FR', true);
    expect(await chosenVoice([GOOGLE_FR, hortense])).toBe(hortense.name);
  });

  test('une voix locale préférée passe avant les autres voix locales', async () => {
    const voices = [voice('Autre', 'fr-FR', true), voice('Amelie', 'fr-FR', true), GOOGLE_FR];
    expect(await chosenVoice(voices)).toBe('Amelie');
  });

  test('la région exacte d’abord, entre voix locales', async () => {
    const voices = [voice('Sylvie', 'fr-CA', true), voice('Julie', 'fr-FR', true), GOOGLE_FR];
    expect(await chosenVoice(voices)).toBe('Julie');
  });

  test('aucune voix locale : la voix réseau préférée', async () => {
    const voices = [voice('Autre réseau', 'fr-FR', false), GOOGLE_FR];
    expect(await chosenVoice(voices)).toBe('Google français');
  });

  test('une voix locale de piètre qualité (eSpeak) ne passe pas devant la voix réseau', async () => {
    const voices = [voice('eSpeak French', 'fr', true), GOOGLE_FR];
    expect(await chosenVoice(voices)).toBe('Google français');
  });

  test('anglais : une voix locale passe avant « Google US English »', async () => {
    const voices = [
      voice('Google US English', 'en-US', false),
      voice('Microsoft Zira - English (United States)', 'en-US', true),
    ];
    expect(await chosenVoice(voices, 'en')).toBe('Microsoft Zira - English (United States)');
  });
});

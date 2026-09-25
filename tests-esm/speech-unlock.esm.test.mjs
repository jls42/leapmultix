/* eslint-env jest, node */
/**
 * Déverrouillage du son (iOS) : la première lecture doit partir d'un geste. Le module
 * n'est chargé qu'une fois et son état ne va que dans un sens (déverrouillé, écouteurs
 * retirés) : les tests se suivent dans l'ordre, comme les gestes d'un joueur.
 */
import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals';

const storageState = { voiceEnabled: false };

jest.unstable_mockModule('../js/core/storage.js', () => ({
  default: { loadVoiceEnabled: () => storageState.voiceEnabled },
}));
jest.unstable_mockModule('../js/core/audio.js', () => ({
  AudioManager: { getVolume: () => 1, isMuted: () => false },
}));
jest.unstable_mockModule('../js/core/eventBus.js', () => ({ eventBus: { on: () => {} } }));

const primers = [];
globalThis.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) {
  this.text = String(text ?? '');
};
globalThis.speechSynthesis = {
  speak: utterance => primers.push(utterance),
  cancel: () => {},
  getVoices: () => [],
  speaking: false,
  pending: false,
};

const { setSpeechEngine } = await import('../js/speech.js');

let nextResult;
const engine = {
  start: () => ({ stop: () => {} }),
  unlock: jest.fn(() => nextResult()),
};

function gesture(type) {
  const event =
    type === 'keydown' ? new KeyboardEvent('keydown', { key: 'Enter' }) : new Event(type);
  document.body.dispatchEvent(event);
}

/** Laisse la promesse du déverrouillage se régler */
const settle = () => new Promise(resolve => setTimeout(resolve, 0));

beforeAll(() => {
  setSpeechEngine(engine);
});

afterAll(() => {
  delete globalThis.speechSynthesis;
  delete globalThis.SpeechSynthesisUtterance;
});

describe('Déverrouillage du son au premier geste', () => {
  test('voix coupée : aucun geste ne déverrouille (un geste suivant s’en chargera)', async () => {
    nextResult = () => true;
    gesture('click');
    await settle();
    expect(engine.unlock).not.toHaveBeenCalled();
    expect(primers).toHaveLength(0);
  });

  test('pointerdown ne compte pas : WebKit ne l’accepte pas comme geste pour un doigt', async () => {
    storageState.voiceEnabled = true;
    gesture('pointerdown');
    await settle();
    expect(engine.unlock).not.toHaveBeenCalled();
  });

  test('touchend puis click du même toucher, ou une touche répétée : un seul essai', async () => {
    let fail;
    nextResult = () =>
      new Promise((_, reject) => {
        fail = reject;
      });
    gesture('touchend');
    gesture('click');
    gesture('keydown');
    gesture('keydown');
    expect(engine.unlock).toHaveBeenCalledTimes(1);
    // La synthèse est amorcée par un seul énoncé vide et muet
    expect(primers.map(p => [p.text, p.volume])).toEqual([['', 0]]);

    // Refus du navigateur : la promesse est interceptée, sans rejet non géré
    fail(new Error('NotAllowedError'));
    await settle();
  });

  test('après un échec, le geste suivant réessaie', async () => {
    nextResult = () => false;
    gesture('keydown');
    await settle();
    expect(engine.unlock).toHaveBeenCalledTimes(2);

    nextResult = () => {
      throw new Error('play() refusé');
    };
    gesture('click');
    await settle();
    expect(engine.unlock).toHaveBeenCalledTimes(3);
  });

  test('après une réussite, les écouteurs sont retirés', async () => {
    nextResult = () => Promise.resolve(true);
    gesture('click');
    await settle();
    expect(engine.unlock).toHaveBeenCalledTimes(4);

    gesture('click');
    gesture('touchend');
    gesture('keydown');
    await settle();
    expect(engine.unlock).toHaveBeenCalledTimes(4);
  });
});

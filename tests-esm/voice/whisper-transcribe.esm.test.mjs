/**
 * @jest-environment node
 */
/* eslint-env jest, node */
/**
 * Modèle de Whisper (scripts/voice/whisper_transcribe.py) : chargé à un commit fixé du Hub.
 * Sans ce commit, chaque chargement demande au Hub celui de « main » et prend le nouveau s'il a
 * bougé : d'autres transcriptions, donc d'autres clips jugés justes, sans relecture. Le test
 * remplace faster-whisper et ctranslate2 par des modules factices qui notent l'appel.
 */
import { describe, test, expect } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const VOICE_DIR = path.resolve('scripts/voice');

/** load_model(name, 'cpu') avec des modules factices ; rend les options reçues par WhisperModel */
function loadModelOptions(name) {
  const program = `
import json, sys, types
received = {}
class WhisperModel:
    def __init__(self, name, **options):
        received.update(options, name=name)
fake = types.ModuleType("faster_whisper")
fake.WhisperModel = WhisperModel
ct2 = types.ModuleType("ctranslate2")
ct2.get_cuda_device_count = lambda: 0
sys.modules.update(faster_whisper=fake, ctranslate2=ct2)
sys.path.insert(0, sys.argv[1])
import whisper_transcribe
whisper_transcribe.load_model(sys.argv[2], "cpu")
print(json.dumps(received))
`;
  // -B : aucun __pycache__ laissé dans scripts/voice
  const result = spawnSync('python3', ['-I', '-B', '-c', program, VOICE_DIR, name], {
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(result.stderr);
  return { options: JSON.parse(result.stdout), stderr: result.stderr };
}

describe('Modèle de Whisper', () => {
  test('large-v3-turbo, le modèle par défaut, se charge à son commit fixé', () => {
    const { options } = loadModelOptions('large-v3-turbo');
    expect(options.name).toBe('large-v3-turbo');
    expect(options.revision).toBe('0a363e9161cbc7ed1431c9597a8ceaf0c4f78fcf');
  });

  test('un autre modèle part sans commit fixé, et la sortie le dit', () => {
    const { options, stderr } = loadModelOptions('small');
    expect(options.revision ?? null).toBeNull();
    expect(stderr).toContain('sans commit fixé');
  });
});

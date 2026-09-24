/* eslint-env jest, node */
/**
 * LazyLoader.loadScript : quels scripts partent en module ES.
 */
import { afterEach, describe, expect, test } from '@jest/globals';

const { LazyLoader } = await import('../js/lazy-loader.js');

/** Balise créée par loadScript (jsdom ne charge pas le fichier : la promesse reste en attente) */
function scriptTagFor(scriptPath) {
  new LazyLoader().loadScript(scriptPath);
  return [...document.head.querySelectorAll('script')].find(s =>
    s.getAttribute('src').startsWith(scriptPath)
  );
}

describe('LazyLoader.loadScript', () => {
  afterEach(() => {
    document.head.replaceChildren();
  });

  test.each([
    'js/modes/QuizMode.js',
    'js/questionGenerator.js',
    'js/stats-es6.js',
    'js/loaderES6.js',
    'js/quiz.js',
    'js/challenge.js',
    'js/adventure.js',
    'js/discovery.js',
    'js/arcade-utils.js',
    'js/arcade-invasion.js',
    'js/arcade-common.js',
    'js/arcade.js',
    'js/arcade-multimemory.js',
    'js/arcade-multimiam.js',
    'js/arcade-multisnake.js',
    'js/multimiam.js',
    'js/multimiam-questions.js',
    'js/multimiam-renderer.js',
    'js/multimiam-engine.js',
    'js/multimiam-controls.js',
    'js/multimiam-ui.js',
    'js/multisnake.js',
  ])('%s est chargé en module ES', scriptPath => {
    expect(scriptTagFor(scriptPath).type).toBe('module');
  });

  test.each(['js/speech.js', 'js/vendor/legacy.js'])('%s reste un script classique', scriptPath => {
    expect(scriptTagFor(scriptPath).type).toBe('');
  });

  test('ne recrée pas un script déjà présent', async () => {
    const existing = document.createElement('script');
    existing.setAttribute('src', 'js/deja-la.js');
    document.head.appendChild(existing);

    await expect(new LazyLoader().loadScript('js/deja-la.js')).resolves.toBeUndefined();
    expect(document.head.querySelectorAll('script')).toHaveLength(1);
  });
});

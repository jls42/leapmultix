/* eslint-env jest, node */
/**
 * Bouton « Ne plus compter mes visites » (js/audience-choice.js) et sa place dans la politique
 * de confidentialité (index.html, #slide10) : un appui retient le refus sur l'appareil, un
 * second le lève et relance la mesure ; le bouton et la phrase d'état disent toujours l'état.
 */
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const ensureAudience = jest.fn(() => true);
const listeners = new Map();

jest.unstable_mockModule('../js/i18n.js', () => ({ getTranslation: key => `«${key}»` }));
jest.unstable_mockModule('../js/core/eventBus.js', () => ({
  eventBus: { on: (event, handler) => listeners.set(event, handler) },
}));
jest.unstable_mockModule('../js/plausible-init.js', () => ({ ensureAudience }));

const { mountAudienceChoice } = await import('../js/audience-choice.js');
const PAGE = new DOMParser().parseFromString(read('index.html'), 'text/html');
const POLICY = PAGE.querySelector('#slide10 .legal-body');

/** Le bloc de la politique, tel qu'il est écrit dans index.html */
function mount() {
  document.body.replaceChildren(
    document.importNode(POLICY.querySelector('[data-audience-summary]'), true)
  );
  mountAudienceChoice(document);
  return {
    button: document.querySelector('[data-audience-toggle]'),
    status: document.querySelector('[data-audience-status]'),
    summary: document.querySelector('[data-audience-summary]'),
  };
}

beforeEach(() => {
  ensureAudience.mockClear();
  document.documentElement.lang = 'fr';
});
afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe('Bouton de refus de la mesure d’audience', () => {
  test('au départ : les visites sont comptées, le bouton propose de ne plus l’être', () => {
    const { button, status } = mount();
    expect(button.dataset.translate).toBe('audience_choice_refuse');
    expect(button.textContent).toBe('«audience_choice_refuse»');
    expect(status.dataset.translate).toBe('audience_status_counted');
  });

  test('un appui retient le refus sur l’appareil et le dit', () => {
    const { button, status } = mount();
    button.click();
    expect(localStorage.getItem('plausible_ignore')).toBe('true');
    expect(button.dataset.translate).toBe('audience_choice_resume');
    expect(status.textContent).toBe('«audience_status_refused»');
    expect(ensureAudience).not.toHaveBeenCalled();
  });

  test('un second appui lève le refus et relance la mesure sans attendre', async () => {
    const { button, status } = mount();
    button.click();
    button.click();
    expect(localStorage.getItem('plausible_ignore')).toBeNull();
    expect(status.dataset.translate).toBe('audience_status_counted');
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(ensureAudience).toHaveBeenCalledTimes(1);
  });

  test('refus déjà retenu à l’ouverture de la page : le bouton propose de reprendre', () => {
    localStorage.setItem('plausible_ignore', 'true');
    const { button, status } = mount();
    expect(button.dataset.translate).toBe('audience_choice_resume');
    expect(status.dataset.translate).toBe('audience_status_refused');
  });

  test('stockage interdit : le choix n’est pas retenu, et la page le dit', () => {
    const { button, status } = mount();
    jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('interdit');
    });
    button.click();
    expect(status.dataset.translate).toBe('audience_status_unavailable');
    expect(button.dataset.translate).toBe('audience_choice_refuse');
  });

  test('changement de langue : les textes sont réécrits, le résumé prend la langue', () => {
    const { button, summary } = mount();
    button.click();
    document.documentElement.lang = 'es';
    listeners.get('languageChanged')();
    expect(summary.lang).toBe('es');
    expect(button.dataset.translate).toBe('audience_choice_resume');
  });
});

describe('Politique de confidentialité du site', () => {
  const text = element => element.textContent.replaceAll(/\s+/g, ' ');

  test('nomme le responsable du traitement et donne son contact', () => {
    const section = [...POLICY.querySelectorAll('.privacy-section')].find(part =>
      part.textContent.includes('Responsable du traitement')
    );
    expect(text(section)).toContain('Julien Le Saux');
    expect(section.querySelector('a[href="mailto:contact@jls42.org"]')).not.toBeNull();
  });

  test('porte le bouton de refus et sa phrase d’état, en tête du texte', () => {
    const first = POLICY.querySelector('.privacy-section');
    expect(first.matches('[data-audience-summary]')).toBe(true);
    expect(first.querySelector('button[data-audience-toggle]')).not.toBeNull();
    expect(first.querySelector('output[data-audience-status]')).not.toBeNull();
  });

  test.each(['slide9', 'slide10'])(
    '#%s ne dit plus les statistiques « anonymes » ni l’éditeur « anonyme »',
    id => {
      expect(text(PAGE.querySelector(`#${id} .legal-body`))).not.toMatch(/anonym/i);
    }
  );

  test('chaque texte du bouton et du résumé existe en fr, en et es', () => {
    const keys = [
      'privacy_summary_title',
      'privacy_summary_text',
      'audience_choice_refuse',
      'audience_choice_resume',
      'audience_status_counted',
      'audience_status_refused',
      'audience_status_unavailable',
    ];
    for (const lang of ['fr', 'en', 'es']) {
      const texts = new Map(Object.entries(JSON.parse(read(`assets/translations/${lang}.json`))));
      const missing = keys.filter(key => !texts.get(key));
      expect({ lang, missing }).toEqual({ lang, missing: [] });
    }
  });
});

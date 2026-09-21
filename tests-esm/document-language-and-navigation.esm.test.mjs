/* eslint-env jest, node */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { setTranslations } from '../js/i18n-store.js';

const { applyDocumentLanguage } = await import('../js/i18n.js');
const { AccessibilityManager } = await import('../js/accessibility.js');
const { TopBar } = await import('../js/components/topBar.js');
const { watchSlideChanges } = await import('../js/core/mainInit.js');

describe('i18n : langue et titre du document', () => {
  afterEach(() => {
    document.documentElement.lang = 'fr';
    document.title = '';
  });

  test('<html lang> et le titre de l’onglet suivent la langue choisie', () => {
    setTranslations({ document_title: 'LeapMultix - Interactive practice' });
    applyDocumentLanguage('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('LeapMultix - Interactive practice');
  });

  test('sans traduction du titre, seul lang change (pas de « [document_title] »)', () => {
    document.title = 'LeapMultix - Titre de départ';
    setTranslations({});
    applyDocumentLanguage('es');
    expect(document.documentElement.lang).toBe('es');
    expect(document.title).toBe('LeapMultix - Titre de départ');
  });
});

describe('Échap : un menu ouvert compte comme une fenêtre ouverte', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('isDialogOpen voit le menu de la barre du haut quand il est ouvert', () => {
    const manager = new AccessibilityManager();
    document.body.innerHTML = '<div class="top-bar"><div class="top-bar-nav"></div></div>';
    const nav = document.querySelector('.top-bar-nav');
    nav.checkVisibility = () => true; // jsdom ne calcule pas la mise en page
    expect(manager.isDialogOpen()).toBe(false);

    nav.classList.add('is-open');
    expect(manager.isDialogOpen()).toBe(true);
  });
});

describe('Changement d’écran : retour en haut et menus refermés', () => {
  let scrollSpy;

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="slide1" class="slide active-slide"></section>
      <section id="slide7" class="slide"></section>
    `;
    TopBar.injectTopBarIntoSlides();
    scrollSpy = jest.fn();
    globalThis.scrollTo = scrollSpy;
    watchSlideChanges();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  const flush = () => new Promise(resolve => setTimeout(resolve, 0));

  test('une slide qui devient active remonte en haut et ferme les menus', async () => {
    const bar1 = document.querySelector('#slide1 .top-bar');
    TopBar.setMenuOpen(bar1, true);
    const slide7 = document.getElementById('slide7');
    slide7.scrollTop = 120;

    document.getElementById('slide1').classList.remove('active-slide');
    slide7.classList.add('active-slide', 'slide-slide-in');
    await flush();

    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
    expect(slide7.scrollTop).toBe(0);
    expect(bar1.querySelector('.top-bar-nav').classList.contains('is-open')).toBe(false);
  });

  test('réafficher la slide déjà active ne fait pas défiler', async () => {
    document.getElementById('slide1').classList.add('active-slide', 'slide-slide-in');
    await flush();
    expect(scrollSpy).not.toHaveBeenCalled();
  });
});

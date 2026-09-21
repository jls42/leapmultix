import { describe, beforeAll, beforeEach, afterEach, test, expect } from '@jest/globals';
import { setTranslations } from '../../js/i18n-store.js';
import Storage from '../../js/core/storage.js';

const { TopBar } = await import('../../js/components/topBar.js');
const { UserManager } = await import('../../js/userManager.js');

const EMOJI = /\p{Extended_Pictographic}/u;

const TRANSLATIONS = {
  home_button_label: 'Accueil',
  about_button_label: 'À propos',
  table_settings_button_label: 'Paramètres des tables',
  mute_button_label_on: 'Couper le son',
  mute_button_label_off: 'Activer le son',
  voice_toggle_on: 'Activer la voix',
  voice_toggle_off: 'Désactiver la voix',
  change_user: 'Changer de joueur',
};

describe('TopBar : icônes SVG, libellés et états', () => {
  beforeAll(() => {
    setTranslations(TRANSLATIONS);
  });

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="slide0" class="slide"></section>
      <section id="slide1" class="slide"></section>
      <section id="slide7" class="slide"></section>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test("n'affiche plus aucun émoji et nomme chaque bouton d'icône", () => {
    const bar = TopBar.buildTopBarElement('slide7');
    expect(EMOJI.test(bar.textContent)).toBe(false);

    const iconButtons = bar.querySelectorAll('.icon-btn');
    expect(iconButtons.length).toBeGreaterThanOrEqual(6);
    for (const btn of iconButtons) {
      expect(btn.getAttribute('aria-label')).toBeTruthy();
      expect(btn.getAttribute('type')).toBe('button');
      const svg = btn.querySelector(':scope > svg.icon');
      expect(svg).toBeTruthy();
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    }
    expect(bar.querySelector('.home-btn').getAttribute('aria-label')).toBe('Accueil');
    expect(bar.querySelector('.about-btn').dataset.slide).toBe('8');
    expect(bar.querySelector('.table-settings-btn').title).toBe('Paramètres des tables');
  });

  test('langues : boutons texte FR/EN/ES, nom de la langue, une seule active', () => {
    const bar = TopBar.buildTopBarElement('slide7');
    const langs = [...bar.querySelectorAll('.lang-btn')];
    expect(langs.map(b => b.textContent)).toEqual(['FR', 'EN', 'ES']);
    // Le nom accessible reste le texte visible (WCAG 2.5.3) ; le nom complet est l'infobulle
    expect(langs.every(b => !b.hasAttribute('aria-label'))).toBe(true);
    expect(langs.map(b => b.title)).toEqual(['Français', 'English', 'Español']);
    expect(langs.map(b => b.lang)).toEqual(['fr', 'en', 'es']);
    expect(langs.filter(b => b.getAttribute('aria-pressed') === 'true')).toHaveLength(1);
    expect(bar.querySelector('.language-selector').getAttribute('role')).toBe('group');

    document.getElementById('slide7').appendChild(bar);
    TopBar.updateLanguageButtons('en');
    expect(langs.map(b => b.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false']);
    expect(langs[1].classList.contains('active')).toBe(true);
  });

  test('« Changer de joueur » : touche secondaire, icône et libellé traduisible', () => {
    const bar = TopBar.buildTopBarElement('slide7');
    const change = bar.querySelector('.change-user-btn');
    expect(change.classList.contains('btn-secondary')).toBe(true);
    expect(change.dataset.slide).toBe('0');
    expect(change.hasAttribute('data-translate')).toBe(false);
    expect(change.querySelector('svg.icon-users')).toBeTruthy();
    const label = change.querySelector('[data-translate="change_user"]');
    expect(label.textContent).toBe('Changer de joueur');
  });

  test('variantes : accueil masqué sur les slides 0 et 1, pas de pièces sur la slide 0', () => {
    expect(TopBar.buildTopBarElement('slide1').querySelector('.home-btn').hidden).toBe(true);
    expect(TopBar.buildTopBarElement('slide7').querySelector('.home-btn').hidden).toBe(false);

    const slide0 = TopBar.buildTopBarElement('slide0');
    expect(slide0.classList.contains('top-bar--slide0')).toBe(true);
    expect(slide0.querySelector('.coin-display')).toBeNull();
    expect(slide0.querySelector('.table-settings-btn')).toBeNull();
    expect(slide0.querySelector('.change-user-btn')).toBeNull();
  });

  test('les deux chemins de rendu produisent le même balisage', () => {
    const fromDom = TopBar.buildTopBarElement('slide7').outerHTML;
    expect(TopBar.generateTopBarHTML('slide7')).toBe(fromDom);
  });

  test('voix : nom fixe, aria-pressed, icône et infobulle cohérents avec l’état', () => {
    Storage.saveVoiceEnabled(true);
    TopBar.injectTopBarIntoSlides();
    const btn = document.querySelector('#slide7 .voice-toggle');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Lecture à voix haute');
    expect(btn.title).toBe('Désactiver la voix');
    expect(btn.querySelector('svg').getAttribute('data-icon')).toBe('speech');

    TopBar.updateVoiceToggleUI(false);
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Lecture à voix haute');
    expect(btn.title).toBe('Activer la voix');
    expect(btn.dataset.translateTitle).toBe('voice_toggle_on');
    expect(btn.querySelector('svg').getAttribute('data-icon')).toBe('speech-off');
  });

  test('son : l’état suit le volume, même si un émoji a remplacé le contenu', () => {
    TopBar.injectTopBarIntoSlides();
    const btn = document.querySelector('#slide7 .mute-btn');
    btn.textContent = '🔊'; // ce que fait encore AudioManager.updateVolumeControls()

    TopBar.updateVolumeControls(0, true);
    expect(EMOJI.test(btn.textContent)).toBe(false);
    expect(btn.querySelectorAll('svg').length).toBe(1);
    expect(btn.querySelector('svg').getAttribute('data-icon')).toBe('volume-x');
    expect(btn.getAttribute('aria-label')).toBe('Activer le son');
    expect(btn.dataset.translateAriaLabel).toBe('mute_button_label_off');
    expect(btn.querySelector('.icon-btn-label').textContent).toBe('Activer le son');
    expect(document.querySelector('#slide7 .volume-slider').value).toBe('0');

    TopBar.updateVolumeControls(0.6, false);
    expect(btn.querySelector('svg').getAttribute('data-icon')).toBe('volume-2');
    expect(btn.getAttribute('aria-label')).toBe('Couper le son');
  });

  test('menu : aria-expanded et icône suivent l’ouverture', () => {
    TopBar.injectTopBarIntoSlides();
    const bar = document.querySelector('#slide7 .top-bar');
    const burger = bar.querySelector('.burger-menu-btn');
    const nav = bar.querySelector('.top-bar-nav');
    expect(burger.getAttribute('aria-controls')).toBe(nav.id);
    expect(burger.getAttribute('aria-expanded')).toBe('false');

    TopBar.setMenuOpen(bar, true);
    expect(nav.classList.contains('is-open')).toBe(true);
    expect(burger.getAttribute('aria-expanded')).toBe('true');
    expect(burger.querySelector('svg').getAttribute('data-icon')).toBe('x');

    TopBar.setMenuOpen(bar, false);
    expect(nav.classList.contains('is-open')).toBe(false);
    expect(burger.getAttribute('aria-expanded')).toBe('false');
    expect(burger.querySelector('svg').getAttribute('data-icon')).toBe('menu');
  });
});

describe('TopBar : sans joueur choisi et touche Échap', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="slide1" class="slide active-slide"></section>
      <section id="slide8" class="slide"></section>
    `;
    UserManager._players = { Lina: { avatar: 'panda', nickname: 'Lina' } };
    UserManager._currentUser = null;
    TopBar.injectTopBarIntoSlides();
  });

  afterEach(() => {
    UserManager._players = {};
    UserManager._currentUser = null;
    document.body.innerHTML = '';
  });

  test('pièces, réglages des tables et « Changer de joueur » suivent le joueur courant', () => {
    const bar = document.querySelector('#slide8 .top-bar');
    const profileControls = () =>
      ['.coin-display', '.table-settings-btn', '.change-user-btn'].map(
        sel => bar.querySelector(sel).hidden
      );

    TopBar.updatePlayerControls();
    expect(profileControls()).toEqual([true, true, true]);
    // L'accueil reste proposé : sans joueur, il ramène au choix du joueur
    expect(bar.querySelector('.home-btn').hidden).toBe(false);

    UserManager._currentUser = 'Lina';
    TopBar.attachPlayerWatcher();
    document.dispatchEvent(new CustomEvent('userChanged', { detail: { user: 'Lina' } }));
    expect(profileControls()).toEqual([false, false, false]);

    // Suppression du joueur courant : userManager.js émet userChanged avec user = null
    UserManager.deleteUser('Lina');
    expect(profileControls()).toEqual([true, true, true]);
  });

  test('Échap ferme le menu ouvert même si le focus est hors de la barre', () => {
    TopBar.attachMenuEscapeWatcher();
    const bar = document.querySelector('#slide1 .top-bar');
    TopBar.setMenuOpen(bar, true);
    document.body.focus();

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.body.dispatchEvent(event);

    expect(bar.querySelector('.top-bar-nav').classList.contains('is-open')).toBe(false);
    expect(bar.querySelector('.burger-menu-btn').getAttribute('aria-expanded')).toBe('false');
    // La touche est consommée : le raccourci global « Échap = choix du joueur » l'ignore
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(bar.querySelector('.burger-menu-btn'));
  });

  test('Échap sans menu ouvert reste disponible pour les autres raccourcis', () => {
    TopBar.attachMenuEscapeWatcher();
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.body.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  test('closeAllMenus referme les menus de toutes les barres', () => {
    const bars = [...document.querySelectorAll('.top-bar')];
    for (const bar of bars) TopBar.setMenuOpen(bar, true);
    expect(TopBar.closeAllMenus()).toHaveLength(2);
    expect(document.querySelectorAll('.top-bar-nav.is-open')).toHaveLength(0);
  });
});

import { describe, beforeAll, beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import { setTranslations } from '../../js/i18n-store.js';
import Storage from '../../js/core/storage.js';
import { eventBus } from '../../js/core/eventBus.js';
import fs from 'node:fs';

const { TopBar } = await import('../../js/components/topBar.js');
const { isVoiceEnabled, setVoiceEnabledResolver, setSpeechEngine, holdSpeechDecision } =
  await import('../../js/speech.js');
const { UserManager } = await import('../../js/userManager.js');
const { AudioManager } = await import('../../js/core/audio.js');

const EMOJI = /\p{Extended_Pictographic}/u;

const TRANSLATIONS = {
  home_button_label: 'Accueil',
  about_button_label: 'À propos',
  table_settings_button_label: 'Paramètres des tables',
  sound_state_on: 'Son : activé',
  sound_state_off: 'Son : coupé',
  voice_state_on: 'Voix : activée',
  voice_state_off: 'Voix : coupée',
  voice_state_sound_off: 'Voix : coupée avec le son',
  effects_toggle_caption: 'Bruitages',
  effects_state_on: 'Bruitages : activés',
  effects_state_off: 'Bruitages : coupés',
  effects_state_sound_off: 'Bruitages : coupés avec le son',
  volume_label: 'Volume',
  change_user: 'Changer de joueur',
  dashboard_button_label: 'Mes progrès',
  dashboard_button_caption: 'Progrès',
  personalization_button_label: 'Personnaliser',
  theme_mode_dark: 'Mode sombre',
  theme_mode_caption: 'Sombre',
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
    // Le son est celui du vrai gestionnaire : chaque test repart du son allumé
    AudioManager.setVolume(1);
    AudioManager.setEffectsEnabled(true);
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

  test('« Mes progrès » et « Personnaliser » : dans la barre (le menu sur téléphone), nommés, vers leur écran', () => {
    const nav = TopBar.buildTopBarElement('slide1').querySelector('.top-bar-nav');
    const shortcut = selector => {
      const btn = nav.querySelector(selector);
      return [btn.dataset.slide, btn.getAttribute('aria-label'), btn.hidden];
    };
    expect(shortcut('.dashboard-btn')).toEqual(['7', 'Mes progrès', false]);
    expect(shortcut('.personalization-btn')).toEqual(['6', 'Personnaliser', false]);
  });

  test('« Mode sombre » : interrupteur sur chaque écran, choix du joueur compris, état suivi', () => {
    for (const slide of ['slide0', 'slide1', 'slide7']) {
      const toggle = TopBar.buildTopBarElement(slide).querySelector('[data-theme-mode-switch]');
      expect([toggle.getAttribute('role'), toggle.getAttribute('aria-label')]).toEqual([
        'switch',
        'Mode sombre',
      ]);
      expect(toggle.getAttribute('aria-checked')).toBe('false');
      expect(toggle.querySelector('svg.icon').dataset.icon).toBe('moon');
    }
    document.body.dataset.colorMode = 'dark';
    const dark = TopBar.buildTopBarElement('slide1').querySelector('[data-theme-mode-switch]');
    expect(dark.getAttribute('aria-checked')).toBe('true');
    delete document.body.dataset.colorMode;
  });

  test('« Mode sombre » : un clic demande la bascule au thème par le bus', () => {
    const asked = jest.fn();
    eventBus.on('colorMode:toggle', asked);
    TopBar.injectTopBarIntoSlides();
    TopBar.attachThemeModeSwitches();
    document.querySelector('#slide1 [data-theme-mode-switch]').click();
    eventBus.off('colorMode:toggle', asked);
    expect(asked).toHaveBeenCalledTimes(1);
  });

  test('paramètres des tables : une grille, pas un engrenage', () => {
    const tables = TopBar.buildTopBarElement('slide1').querySelector('.table-settings-btn');
    expect(tables.querySelector('svg.icon').dataset.icon).toBe('grid-3x3');
  });

  test('sur son propre écran, le bouton est masqué ; aucun sur le choix du joueur', () => {
    expect(TopBar.buildTopBarElement('slide7').querySelector('.dashboard-btn').hidden).toBe(true);
    expect(TopBar.buildTopBarElement('slide6').querySelector('.personalization-btn').hidden).toBe(
      true
    );
    const choice = TopBar.buildTopBarElement('slide0');
    expect(choice.querySelector('.dashboard-btn, .personalization-btn')).toBeNull();
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

  test('voix : le nom, le libellé du menu, l’infobulle et l’icône disent son état', () => {
    Storage.saveVoiceEnabled(true);
    TopBar.injectTopBarIntoSlides();
    const btn = document.querySelector('#slide7 .voice-toggle');
    const said = () => [
      btn.getAttribute('aria-label'),
      btn.title,
      btn.querySelector('.icon-btn-label').textContent,
    ];
    TopBar.updateVolumeControls(0.6, false);
    expect(btn.hasAttribute('data-voice-on')).toBe(true);
    expect(said()).toEqual(Array(3).fill('Voix : activée'));
    expect(btn.querySelector('svg').getAttribute('data-icon')).toBe('speech');
    // Le nom porte l'état : pas d'aria-pressed en plus, qui le dirait deux fois
    expect(btn.hasAttribute('aria-pressed')).toBe(false);
    expect(btn.hasAttribute('aria-disabled')).toBe(false);

    TopBar.updateVoiceToggleUI(false);
    expect(btn.hasAttribute('data-voice-on')).toBe(false);
    expect(said()).toEqual(Array(3).fill('Voix : coupée'));
    expect(btn.dataset.translateTitle).toBe('voice_state_off');
    expect(btn.dataset.translateAriaLabel).toBe('voice_state_off');
    expect(btn.querySelector('.icon-btn-label').dataset.translate).toBe('voice_state_off');
    expect(btn.querySelector('svg').getAttribute('data-icon')).toBe('speech-off');
    // Le mot sous l'icône (grand écran) reste contenu dans le nom du bouton (WCAG 2.5.3)
    expect(btn.getAttribute('aria-label').toLowerCase()).toContain(
      btn.querySelector('.icon-btn-caption').textContent.toLowerCase()
    );
  });

  test('voix : son coupé, elle se dit « coupée avec le son » ; la toucher rend le son sans changer son réglage', () => {
    Storage.saveVoiceEnabled(true);
    AudioManager.setVolume(0.6);
    TopBar.init();
    const btn = document.querySelector('#slide7 .voice-toggle');
    const state = () => [
      btn.getAttribute('aria-label'),
      btn.querySelector('.icon-btn-label').textContent,
      btn.querySelector('svg').getAttribute('data-icon'),
      btn.hasAttribute('data-voice-on'),
      btn.hasAttribute('data-sound-muted'),
      btn.hasAttribute('data-cut'),
    ];
    TopBar.updateVolumeControls();
    expect(state()).toEqual(['Voix : activée', 'Voix : activée', 'speech', true, false, false]);

    // Le son se coupe (touche « Son », curseur à zéro) : la voix se tait avec lui
    AudioManager.setVolume(0);
    TopBar.updateVolumeControls();
    expect(state()).toEqual([
      'Voix : coupée avec le son',
      'Voix : coupée avec le son',
      'speech-off',
      false,
      true,
      false,
    ]);
    // Le bouton agit toujours : rien ne le dit désactivé
    expect(btn.hasAttribute('aria-disabled')).toBe(false);

    // La toucher pendant ce temps rend le son, au volume d'avant, sans toucher à son réglage
    btn.click();
    expect(AudioManager.getVolume()).toBeCloseTo(0.6);
    expect(Storage.loadVoiceEnabled()).toBe(true);
    TopBar.updateVolumeControls();
    expect(state()).toEqual(['Voix : activée', 'Voix : activée', 'speech', true, false, false]);

    // Voix coupée par son réglage : elle le reste quand le son revient, et le dit en ambre
    Storage.saveVoiceEnabled(false);
    AudioManager.setVolume(0);
    AudioManager.setVolume(0.6);
    TopBar.updateVolumeControls();
    expect(state()).toEqual(['Voix : coupée', 'Voix : coupée', 'speech-off', false, false, true]);
  });

  test('bruitages : un interrupteur à part, qui dit son état et ne touche ni à la voix ni au volume', async () => {
    Storage.saveVoiceEnabled(true);
    AudioManager.setVolume(0.6);
    AudioManager.setEffectsEnabled(true);
    TopBar.init();
    const btn = document.querySelector('#slide7 .effects-toggle');
    const state = () => [
      btn.getAttribute('aria-label'),
      btn.title,
      btn.querySelector('.icon-btn-label').textContent,
      btn.querySelector('svg').getAttribute('data-icon'),
      btn.hasAttribute('data-effects-on'),
      btn.hasAttribute('data-cut'),
      btn.hasAttribute('data-sound-muted'),
    ];
    TopBar.updateVolumeControls();
    expect(state()).toEqual([...Array(3).fill('Bruitages : activés'), 'note', true, false, false]);
    // Le mot sous l'icône (grand écran) reste contenu dans le nom du bouton (WCAG 2.5.3)
    expect(btn.getAttribute('aria-label').toLowerCase()).toContain(
      btn.querySelector('.icon-btn-caption').textContent.toLowerCase()
    );

    btn.click();
    expect(AudioManager.areEffectsEnabled()).toBe(false);
    expect(Storage.loadSoundEffectsEnabled()).toBe(false);
    expect(state()).toEqual([
      ...Array(3).fill('Bruitages : coupés'),
      'note-off',
      false,
      true,
      false,
    ]);
    // La voix et le volume général n'ont pas bougé
    expect(Storage.loadVoiceEnabled()).toBe(true);
    expect(AudioManager.getVolume()).toBeCloseTo(0.6);
    expect(document.querySelector('#slide7 .voice-toggle').hasAttribute('data-voice-on')).toBe(
      true
    );
    // Les interrupteurs des autres écrans suivent
    expect(document.querySelector('#slide1 .effects-toggle').getAttribute('aria-label')).toBe(
      'Bruitages : coupés'
    );

    // Une seule bascule par geste (singleActivation) : le geste suivant vient après
    await new Promise(resolve => setTimeout(resolve, 5));
    btn.click();
    expect(AudioManager.areEffectsEnabled()).toBe(true);
    expect(state()[0]).toBe('Bruitages : activés');
  });

  test('bruitages : son coupé, « coupés avec le son » ; les toucher rend le son sans changer leur réglage', () => {
    AudioManager.setVolume(0.6);
    AudioManager.setEffectsEnabled(true);
    TopBar.init();
    const btn = document.querySelector('#slide7 .effects-toggle');
    AudioManager.setVolume(0);
    TopBar.updateVolumeControls();
    expect(btn.getAttribute('aria-label')).toBe('Bruitages : coupés avec le son');
    expect(btn.querySelector('svg').getAttribute('data-icon')).toBe('note-off');
    expect(btn.hasAttribute('data-sound-muted')).toBe(true);
    expect(btn.hasAttribute('data-cut')).toBe(false);

    btn.click();
    expect(AudioManager.getVolume()).toBeCloseTo(0.6);
    expect(AudioManager.areEffectsEnabled()).toBe(true);
    TopBar.updateVolumeControls();
    expect(btn.getAttribute('aria-label')).toBe('Bruitages : activés');
  });

  test('touche « Son » de la barre : bruitages ou voix coupés par le joueur, elle le montre et le dit ; elle ne dit plus « Son : activé » sans plus', () => {
    Storage.saveVoiceEnabled(true);
    AudioManager.setVolume(0.6);
    TopBar.init();
    const quick = document.querySelector('#slide7 .mute-btn-quick');
    const said = () => [
      quick.hasAttribute('data-partial'),
      quick.getAttribute('aria-label'),
      quick.title,
    ];
    TopBar.updateVolumeControls();
    expect(said()).toEqual([false, 'Son : activé', 'Son : activé']);
    expect(quick.dataset.translateAriaLabel).toBe('sound_state_on');

    // Les bruitages coupés : le son reste allumé, la touche porte la pastille et dit les trois
    document.querySelector('#slide7 .effects-toggle').click();
    const partial = 'Son : activé. Bruitages : coupés. Voix : activée.';
    expect(said()).toEqual([true, partial, partial]);
    // Nom composé : aucune clé ne le ferait remplacer par « Son : activé » seul…
    expect(quick.dataset.translateAriaLabel).toBeUndefined();
    expect(quick.dataset.translateTitle).toBeUndefined();
    // … et un changement de langue le recompose
    TopBar.updateTranslations();
    expect(said()).toEqual([true, partial, partial]);
    // Le mot sous l'icône reste contenu dans le nom du bouton (WCAG 2.5.3)
    expect(quick.getAttribute('aria-label')).toContain(
      quick.querySelector('.icon-btn-caption').textContent
    );
    // La touche « Son » du menu, à côté des deux interrupteurs, n'a pas besoin de pastille
    expect(
      document.querySelector('#slide7 .top-bar-nav .mute-btn').hasAttribute('data-partial')
    ).toBe(false);

    // La voix coupée aussi : le jeu est muet, la touche le dit
    Storage.saveVoiceEnabled(false);
    TopBar.updateVoiceToggleUI(false);
    expect(said()[1]).toBe('Son : activé. Bruitages : coupés. Voix : coupée.');

    // Le son coupé : c'est lui qui parle, sans pastille
    AudioManager.setVolume(0);
    TopBar.updateVolumeControls();
    expect(said()).toEqual([false, 'Son : coupé', 'Son : coupé']);

    // Tout rallumé : retour au nom simple, avec sa clé
    AudioManager.setVolume(0.6);
    AudioManager.setEffectsEnabled(true);
    Storage.saveVoiceEnabled(true);
    TopBar.updateVoiceToggleUI(true);
    TopBar.updateEffectsToggleUI();
    expect(said()).toEqual([false, 'Son : activé', 'Son : activé']);
    expect(quick.dataset.translateAriaLabel).toBe('sound_state_on');
  });

  test('voix éteinte par défaut (jamais réglée) : ni teinte d’alerte ni pastille ; coupée par le joueur : les deux', () => {
    localStorage.removeItem('voiceEnabled');
    AudioManager.setVolume(0.6);
    TopBar.init();
    const voice = document.querySelector('#slide7 .voice-toggle');
    const quick = document.querySelector('#slide7 .mute-btn-quick');
    TopBar.updateVolumeControls();
    expect(voice.getAttribute('aria-label')).toBe('Voix : coupée');
    expect([voice.hasAttribute('data-cut'), quick.hasAttribute('data-partial')]).toEqual([
      false,
      false,
    ]);

    // Le joueur la règle lui-même sur « coupée » : l'alerte dit « tu l'as coupée »
    Storage.saveVoiceEnabled(false);
    TopBar.updateVoiceToggleUI(false);
    expect([voice.hasAttribute('data-cut'), quick.hasAttribute('data-partial')]).toEqual([
      true,
      true,
    ]);

    // Bruitages coupés, voix éteinte par défaut : le jeu est muet, la pastille le dit quand même
    localStorage.removeItem('voiceEnabled');
    AudioManager.setEffectsEnabled(false);
    TopBar.updateVoiceToggleUI(false);
    TopBar.updateEffectsToggleUI();
    expect(voice.hasAttribute('data-cut')).toBe(false);
    expect(quick.getAttribute('aria-label')).toBe(
      'Son : activé. Bruitages : coupés. Voix : coupée.'
    );
  });

  test('menu du téléphone : le curseur porte son nom, « Bruitages » puis « Voix » le suivent', () => {
    const nav = TopBar.buildTopBarElement('slide1').querySelector('.top-bar-nav');
    const volume = nav.querySelector('.global-volume-controls');
    expect([...volume.children].map(el => el.className.split(' ').pop())).toEqual([
      'mute-btn',
      'volume-caption',
      'volume-slider',
    ]);
    expect(volume.querySelector('.volume-caption').dataset.translate).toBe('volume_label');
    const order = [...nav.children].map(el => el.className.split(' ')[0]);
    expect(order.indexOf('effects-toggle-controls')).toBe(
      order.indexOf('global-volume-controls') + 1
    );
    expect(order.indexOf('voice-toggle-controls')).toBe(
      order.indexOf('effects-toggle-controls') + 1
    );
    // Feuille de style : la touche « Son » du menu s'efface sous 993 px (elle est dans la barre)
    const css = fs.readFileSync('css/topbar.css', 'utf8');
    expect(css).toMatch(/\.top-bar-nav \.global-volume-controls \.mute-btn \{\s*display: none;/);
  });

  test('voix : désactivée tant que le joueur ne l’a pas demandée', () => {
    localStorage.removeItem('voiceEnabled');
    expect(Storage.loadVoiceEnabled()).toBe(false);
    expect(isVoiceEnabled()).toBe(false);

    TopBar.injectTopBarIntoSlides();
    const btn = document.querySelector('#slide7 .voice-toggle');
    expect(btn.hasAttribute('data-voice-on')).toBe(false);
    expect(btn.title).toBe('Voix : coupée');

    Storage.saveVoiceEnabled(true);
    expect(isVoiceEnabled()).toBe(true);
  });

  test('voix enregistrée active par défaut : le bouton l’affiche, le premier clic la coupe', () => {
    localStorage.removeItem('voiceEnabled');
    // Règle de la voix enregistrée : sans choix du joueur, la parole est active
    setVoiceEnabledResolver(() => Storage.get('voiceEnabled', null) ?? true);
    try {
      TopBar.injectTopBarIntoSlides();
      TopBar.attachVoiceToggles();
      const btn = document.querySelector('#slide7 .voice-toggle');
      expect(btn.hasAttribute('data-voice-on')).toBe(true);
      btn.click();
      expect(localStorage.getItem('voiceEnabled')).toBe('false');
      expect(isVoiceEnabled()).toBe(false);
      expect(btn.hasAttribute('data-voice-on')).toBe(false);
    } finally {
      setVoiceEnabledResolver(null);
      localStorage.removeItem('voiceEnabled');
    }
  });

  test('voix allumée par le bouton : ce clic déverrouille le son du moteur', async () => {
    localStorage.setItem('voiceEnabled', 'false');
    const engine = {
      start: () => ({ stop: () => {} }),
      isAvailable: () => true,
      unlock: jest.fn(() => true),
    };
    setSpeechEngine(engine);
    try {
      TopBar.injectTopBarIntoSlides();
      TopBar.attachVoiceToggles();
      document.querySelector('#slide7 .voice-toggle').click();
      expect(engine.unlock).toHaveBeenCalledTimes(1);
    } finally {
      setSpeechEngine(null);
      localStorage.removeItem('voiceEnabled');
    }
  });

  test('voix : le bouton suit l’état décidé par la voix enregistrée (voice:changed)', () => {
    TopBar.init();
    const btn = document.querySelector('#slide7 .voice-toggle');
    eventBus.emit('voice:changed', { available: true, active: true, engine: 'clips' });
    expect(btn.hasAttribute('data-voice-on')).toBe(true);
    eventBus.emit('voice:changed', { available: false, active: false, engine: 'synthesis' });
    expect(btn.hasAttribute('data-voice-on')).toBe(false);
  });

  test('voix, première visite : bouton masqué tant que la décision attend, puis son état', () => {
    const release = holdSpeechDecision();
    try {
      TopBar.init();
      const btn = document.querySelector('#slide7 .voice-toggle');
      expect(btn.hasAttribute('data-voice-pending')).toBe(true);
      // Un état annoncé pendant l'attente ne le montre pas encore
      eventBus.emit('voice:changed', { available: false, active: false, engine: 'synthesis' });
      expect(btn.hasAttribute('data-voice-pending')).toBe(true);
      release();
      eventBus.emit('voice:changed', { available: true, active: true, engine: 'clips' });
      expect(btn.hasAttribute('data-voice-pending')).toBe(false);
      expect(btn.hasAttribute('data-voice-on')).toBe(true);
    } finally {
      release();
    }
  });

  test('voix : l’activation se dit dans la langue du jeu, jamais en français codé en dur', () => {
    const spoken = [];
    globalThis.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) {
      this.text = String(text ?? '');
    };
    globalThis.speechSynthesis = {
      speak: utterance => spoken.push(utterance.text),
      cancel: () => {},
      getVoices: () => [],
      speaking: false,
      pending: false,
    };
    try {
      localStorage.removeItem('voiceEnabled');
      setTranslations({ ...TRANSLATIONS, voice_enabled: 'Voice enabled' });
      TopBar.injectTopBarIntoSlides();
      TopBar.attachVoiceToggles();
      document.querySelector('#slide7 .voice-toggle').click();
      // L'énoncé vide est l'amorce du déverrouillage (iOS), faite par ce même clic
      expect(spoken.filter(Boolean)).toEqual(['Voice enabled']);

      // Traduction absente : rien n'est dit, ni « [voice_enabled] » ni un repli français
      localStorage.removeItem('voiceEnabled');
      setTranslations(TRANSLATIONS);
      TopBar.injectTopBarIntoSlides();
      TopBar.attachVoiceToggles();
      document.querySelector('#slide7 .voice-toggle').click();
      expect(spoken.filter(Boolean)).toEqual(['Voice enabled']);
    } finally {
      delete globalThis.speechSynthesis;
      delete globalThis.SpeechSynthesisUtterance;
      setTranslations(TRANSLATIONS);
    }
  });

  test('son : l’état suit le volume, même si un émoji a remplacé le contenu', () => {
    TopBar.injectTopBarIntoSlides();
    const btn = document.querySelector('#slide7 .mute-btn');
    btn.textContent = '🔊'; // ce que fait encore AudioManager.updateVolumeControls()

    TopBar.updateVolumeControls(0, true);
    expect(EMOJI.test(btn.textContent)).toBe(false);
    expect(btn.querySelectorAll('svg').length).toBe(1);
    expect(btn.querySelector('svg').getAttribute('data-icon')).toBe('volume-x');
    expect(btn.getAttribute('aria-label')).toBe('Son : coupé');
    expect(btn.dataset.translateAriaLabel).toBe('sound_state_off');
    expect(btn.querySelector('.icon-btn-label').textContent).toBe('Son : coupé');
    expect(document.querySelector('#slide7 .volume-slider').value).toBe('0');

    TopBar.updateVolumeControls(0.6, false);
    expect(btn.querySelector('svg').getAttribute('data-icon')).toBe('volume-2');
    expect(btn.getAttribute('aria-label')).toBe('Son : activé');
  });

  test('son : une touche dans la barre elle-même, juste avant le menu, de même état que celle du menu', async () => {
    const { AudioManager } = await import('../../js/core/audio.js');
    TopBar.injectTopBarIntoSlides();
    TopBar.attachVolumeControls();
    const bar = document.querySelector('#slide7 .top-bar');
    const quick = bar.querySelector(':scope > .mute-btn-quick');
    const inMenu = bar.querySelector('.top-bar-nav .mute-btn');
    expect(quick.nextElementSibling).toBe(bar.querySelector('.burger-menu-btn'));
    expect(inMenu).not.toBe(quick);
    const states = () =>
      [quick, inMenu].map(btn => [
        btn.getAttribute('aria-label'),
        btn.querySelector('svg').getAttribute('data-icon'),
        btn.hasAttribute('data-sound-off'),
      ]);

    TopBar.updateVolumeControls(0.6, false);
    expect(states()).toEqual(Array(2).fill(['Son : activé', 'volume-2', false]));
    // Son coupé : l'état se lit sur les deux touches (teinte d'alerte de css/topbar.css)
    TopBar.updateVolumeControls(0, true);
    expect(states()).toEqual(Array(2).fill(['Son : coupé', 'volume-x', true]));

    // Un toucher sur la touche de la barre bascule le son, comme celle du menu
    const toggle = jest.spyOn(AudioManager, 'toggleMute').mockImplementation(() => {});
    quick.click();
    expect(toggle).toHaveBeenCalledTimes(1);
    toggle.mockRestore();
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

  test('« Tableau de bord » et « Personnalisation » suivent aussi le joueur courant', () => {
    const bar = document.querySelector('#slide8 .top-bar');
    const shortcuts = () =>
      ['.dashboard-btn', '.personalization-btn'].map(sel => bar.querySelector(sel).hidden);
    TopBar.updatePlayerControls();
    expect(shortcuts()).toEqual([true, true]);
    UserManager._currentUser = 'Lina';
    TopBar.updatePlayerControls();
    expect(shortcuts()).toEqual([false, false]);
    // Sur l'écran du tableau de bord, son propre bouton reste masqué
    const own = document.createElement('section');
    own.id = 'slide7';
    own.className = 'slide';
    document.body.appendChild(own);
    TopBar.injectTopBarIntoSlides();
    TopBar.updatePlayerControls();
    expect(own.querySelector('.dashboard-btn').hidden).toBe(true);
    expect(own.querySelector('.personalization-btn').hidden).toBe(false);
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

  test('toucher hors de la barre : le menu se ferme, le focus reste où il est', () => {
    TopBar.attachOutsideClickWatcher();
    const bar = document.querySelector('#slide1 .top-bar');
    const elsewhere = document.createElement('button');
    document.querySelector('#slide1').appendChild(elsewhere);
    TopBar.setMenuOpen(bar, true);
    elsewhere.focus();
    elsewhere.click();
    expect(bar.querySelector('.top-bar-nav').classList.contains('is-open')).toBe(false);
    expect(document.activeElement).toBe(elsewhere);
  });

  test('une fenêtre ouverte depuis le menu y rend le focus en se fermant : il passe au bouton ☰', () => {
    // Clic sur « Fermer » (ou une réponse) : la fenêtre rend d'abord le focus à son bouton
    // d'origine, dans le menu ; le même clic, hors de la barre, referme ensuite le menu
    TopBar.attachOutsideClickWatcher();
    const bar = document.querySelector('#slide1 .top-bar');
    const opener = bar.querySelector('.top-bar-nav .lang-btn');
    const closeButton = document.createElement('button');
    closeButton.addEventListener('click', () => opener.focus());
    document.body.appendChild(closeButton);
    TopBar.setMenuOpen(bar, true);
    closeButton.click();
    expect(bar.querySelector('.top-bar-nav').classList.contains('is-open')).toBe(false);
    expect(document.activeElement).toBe(bar.querySelector('.burger-menu-btn'));
  });

  test('menu ouvert : un voile se pose juste avant la barre, et part quand le menu se ferme', () => {
    TopBar.init();
    const bar = document.querySelector('#slide1 .top-bar');
    expect(document.querySelector('.top-bar-veil')).toBeNull();

    TopBar.setMenuOpen(bar, true);
    TopBar.setMenuOpen(bar, true);
    const veils = document.querySelectorAll('.top-bar-veil');
    expect(veils).toHaveLength(1);
    expect(bar.previousElementSibling).toBe(veils[0]);
    expect(veils[0].getAttribute('aria-hidden')).toBe('true');

    // Bouton retour d'Android et Échap passent par closeAllMenus
    TopBar.closeAllMenus();
    expect(document.querySelector('.top-bar-veil')).toBeNull();
  });

  test('toucher le voile ferme le menu', () => {
    TopBar.init();
    const bar = document.querySelector('#slide1 .top-bar');
    TopBar.setMenuOpen(bar, true);
    document.querySelector('.top-bar-veil').click();
    expect(bar.querySelector('.top-bar-nav').classList.contains('is-open')).toBe(false);
    expect(document.querySelector('.top-bar-veil')).toBeNull();
  });

  test('le focus qui sort de la barre ferme le menu ; celui qui y reste le laisse ouvert', () => {
    TopBar.init();
    const bar = document.querySelector('#slide1 .top-bar');
    const nav = bar.querySelector('.top-bar-nav');
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    const leave = (from, to) =>
      from.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: to }));

    TopBar.setMenuOpen(bar, true);
    const [first, second] = nav.querySelectorAll('button');
    leave(first, second);
    expect(nav.classList.contains('is-open')).toBe(true);
    // Focus perdu sans destination (toucher sur une zone inerte) : le clic s'en charge
    leave(first, null);
    expect(nav.classList.contains('is-open')).toBe(true);

    leave(second, outside);
    expect(nav.classList.contains('is-open')).toBe(false);
    expect(bar.querySelector('.burger-menu-btn').getAttribute('aria-expanded')).toBe('false');
    outside.remove();
  });

  test('closeAllMenus referme les menus de toutes les barres', () => {
    const bars = [...document.querySelectorAll('.top-bar')];
    for (const bar of bars) TopBar.setMenuOpen(bar, true);
    expect(TopBar.closeAllMenus()).toHaveLength(2);
    expect(document.querySelectorAll('.top-bar-nav.is-open')).toHaveLength(0);
  });
});

describe('Accueil : plus de boutons sous le contenu', () => {
  test('« Personnalisation » et « Tableau de bord » ont quitté le bas de l’accueil', async () => {
    const { readFileSync } = await import('node:fs');
    const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
    const home = html.match(/<section id="slide1"[\s\S]*?<\/section>/)[0];
    expect(home).not.toMatch(/data-slide="[67]"/);
    expect(home).not.toContain('home-links');
  });
});

describe('TopBar : mots sous les icônes', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test.each(['fr', 'en', 'es'])(
    '%s : chaque mot affiché est contenu dans le nom accessible de son bouton (WCAG 2.5.3)',
    lang => {
      setTranslations(JSON.parse(fs.readFileSync(`assets/translations/${lang}.json`, 'utf8')));
      const bar = TopBar.buildTopBarElement('slide1');
      const pairs = [...bar.querySelectorAll('.icon-btn, .change-user-btn')].map(btn => [
        btn.querySelector('.icon-btn-caption')?.textContent ?? '',
        btn.getAttribute('aria-label') ??
          btn.querySelector('.change-user-label')?.textContent ??
          '',
      ]);
      expect(pairs.length).toBeGreaterThanOrEqual(8);
      expect(pairs.filter(([caption]) => !caption)).toEqual([]);
      expect(
        pairs.filter(
          ([caption, name]) =>
            !name.toLocaleLowerCase(lang).includes(caption.toLocaleLowerCase(lang))
        )
      ).toEqual([]);
      setTranslations(TRANSLATIONS);
    }
  );

  test('le mot reste sous l’icône quand le son change d’état', () => {
    const bar = TopBar.buildTopBarElement('slide1');
    document.body.appendChild(bar);
    const mute = bar.querySelector('.mute-btn');
    mute.textContent = '🔇';
    TopBar.updateVolumeControls(0, true);
    expect(mute.querySelector('.icon-btn-caption')?.textContent).toBe('Son');
    expect(mute.getAttribute('aria-label')).toBe('Son : coupé');
    TopBar.updateVolumeControls(1, false);
    expect(mute.querySelectorAll('.icon-btn-caption')).toHaveLength(1);
  });
});

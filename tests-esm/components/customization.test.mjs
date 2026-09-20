import { describe, beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import { setTranslations } from '../../js/i18n-store.js';

const { Customization } = await import('../../js/components/customization.js');
const { UserManager } = await import('../../js/userManager.js');
const { eventBus } = await import('../../js/core/eventBus.js');
const { applyFontSize, initThemes } = await import('../../js/core/theme.js');

const EMOJI = /\p{Extended_Pictographic}/u;

const SLIDE6 = `
  <section id="slide6" class="slide">
    <div class="content-card">
      <div class="customization-section">
        <div class="color-theme-selector">
          <button class="color-theme-btn active" data-color-theme="default" data-translate="color_theme_default" aria-pressed="true">🎨 Classique</button>
          <button class="color-theme-btn" data-color-theme="blue" data-translate="color_theme_blue" aria-pressed="false">🔷 Bleu Spatial</button>
          <button class="color-theme-btn" data-color-theme="dark" data-translate="color_theme_dark" aria-pressed="false">🌙 Nuit</button>
        </div>
      </div>
      <div class="customization-section">
        <div class="accessibility-options">
          <label><input type="checkbox" id="high-contrast-toggle" /><span>Contraste élevé</span></label>
          <div class="font-size-selector">
            <span>Taille du texte :</span>
            <button class="btn btn btn-sm-desktop font-size-btn" data-size="small">A</button>
            <button class="btn btn btn-sm-desktop font-size-btn active" data-size="medium">A</button>
            <button class="btn btn btn-sm-desktop font-size-btn" data-size="large">A</button>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

describe('Personnalisation : pastilles de thème et réglages', () => {
  beforeEach(() => {
    setTranslations({
      color_theme_default: 'Classique',
      color_theme_blue: 'Spatial',
      color_theme_dark: 'Nuit',
      color_theme_applied: 'Thème {{themeName}} appliqué !',
      clear_cache_button: 'Vider le cache',
    });
    document.body.className = '';
    document.body.innerHTML = SLIDE6;
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
    document.body.className = '';
  });

  test('chaque thème devient pastille + libellé, sans émoji, une seule fois', () => {
    Customization.enhanceStaticControls();
    Customization.enhanceStaticControls();

    for (const btn of document.querySelectorAll('.color-theme-btn')) {
      const theme = btn.dataset.colorTheme;
      expect(btn.hasAttribute('data-translate')).toBe(false);
      expect(btn.querySelectorAll('.color-theme-swatch')).toHaveLength(1);
      const swatch = btn.querySelector('.color-theme-swatch');
      expect(swatch.getAttribute('aria-hidden')).toBe('true');
      const fill = swatch.querySelector('.color-theme-swatch-fill');
      expect(fill.dataset.themePreview).toBe(theme);
      const label = btn.querySelector('.color-theme-label');
      expect(label.dataset.translate).toBe(`color_theme_${theme}`);
      expect(EMOJI.test(btn.textContent)).toBe(false);
    }

    const [classic, space] = document.querySelectorAll('.color-theme-btn');
    expect(classic.textContent).toBe('Classique');
    expect(space.textContent).toBe('Spatial');
    // Classique n'a pas de classe de thème : ses jetons viennent de data-theme-preview
    expect(classic.querySelector('.color-theme-swatch-fill').className).toBe(
      'color-theme-swatch-fill'
    );
    expect(space.querySelector('.color-theme-swatch-fill').classList.contains('theme-blue')).toBe(
      true
    );
  });

  test('les trois « A » sont nommés et groupés, « Vider le cache » est un bouton discret', () => {
    Customization.enhanceStaticControls();
    Customization.enhanceStaticControls();

    const group = document.querySelector('.font-size-selector');
    expect(group.getAttribute('role')).toBe('group');
    const caption = document.getElementById(group.getAttribute('aria-labelledby'));
    expect(caption.textContent).toBe('Taille du texte :');

    const buttons = [...group.querySelectorAll('.font-size-btn')];
    expect(buttons.map(b => b.getAttribute('aria-label'))).toEqual(['Petit', 'Moyen', 'Grand']);
    expect(buttons.map(b => b.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false']);
    expect(buttons.every(b => b.type === 'button')).toBe(true);

    const clear = document.querySelectorAll('#clear-cache-btn');
    expect(clear).toHaveLength(1);
    expect(clear[0].className).toBe('btn btn-quiet btn-sm clear-cache-btn');
    expect(clear[0].hasAttribute('style')).toBe(false);
    expect(clear[0].textContent).toBe('Vider le cache');
  });

  test('changer de thème : classe du body, aria-pressed et message lisible', () => {
    jest.useFakeTimers();
    Customization.enhanceStaticControls();
    Customization.updateColorTheme('dark');

    expect(document.body.classList.contains('theme-dark')).toBe(true);
    const pressed = [...document.querySelectorAll('.color-theme-btn')].map(b =>
      b.getAttribute('aria-pressed')
    );
    expect(pressed).toEqual(['false', 'false', 'true']);
    expect(localStorage.getItem('colorTheme')).toBe('dark');
    jest.advanceTimersByTime(10); // showMessage remplit le toast juste après l'avoir inséré
    expect(document.querySelector('.message-popup').textContent).toBe('Thème Nuit appliqué !');

    Customization.updateColorTheme('default');
    expect(document.body.classList.contains('theme-dark')).toBe(false);
  });

  test('le modèle à accolades simples donne le même message', () => {
    jest.useFakeTimers();
    setTranslations({
      color_theme_dark: 'Nuit',
      color_theme_applied: 'Thème {themeName} appliqué !',
    });
    Customization.updateColorTheme('dark');
    jest.advanceTimersByTime(10);
    expect(document.querySelector('.message-popup').textContent).toBe('Thème Nuit appliqué !');
  });
});

describe('theme.js : état des boutons de thème et de taille', () => {
  beforeEach(() => {
    document.body.className = '';
    // eslint-disable-next-line no-restricted-properties -- Montage de test : gabarit littéral du fichier, aucune donnée utilisateur
    document.body.innerHTML = SLIDE6;
  });

  afterEach(() => {
    document.body.replaceChildren();
    document.body.className = '';
  });

  test('applyFontSize marque le « A » choisi (classe et aria-pressed)', () => {
    applyFontSize('large');
    const buttons = [...document.querySelectorAll('.font-size-btn')];
    expect(buttons.map(b => b.getAttribute('aria-pressed'))).toEqual(['false', 'false', 'true']);
    expect(buttons[2].classList.contains('active')).toBe(true);
    expect(document.body.classList.contains('font-size-large')).toBe(true);

    applyFontSize('inconnu');
    expect(buttons.map(b => b.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false']);
    expect(localStorage.getItem('fontSize')).toBe('medium');
  });

  test('initThemes applique le thème enregistré et son aria-pressed', () => {
    localStorage.setItem('colorTheme', 'blue');
    initThemes();
    expect(document.body.classList.contains('theme-blue')).toBe(true);
    const pressed = [...document.querySelectorAll('.color-theme-btn')].map(b =>
      b.getAttribute('aria-pressed')
    );
    expect(pressed).toEqual(['false', 'true', 'false']);
  });
});

describe('Personnalisation : avatar du joueur', () => {
  const AVATAR_MARKUP = `
    <div id="user-list"></div>
    <section id="slide6" class="slide">
      <div class="current-avatar"><img id="current-avatar-img" alt="" /></div>
      <div class="avatar-selector" role="radiogroup">
        <button class="avatar-btn active" data-avatar="fox"><span class="avatar-label">Renard</span></button>
        <button class="avatar-btn" data-avatar="panda"><span class="avatar-label">Panda</span></button>
      </div>
    </section>
  `;

  beforeEach(() => {
    setTranslations({ fox: 'Renard', panda: 'Panda' });
    document.body.innerHTML = AVATAR_MARKUP;
    UserManager._players = {
      Lina: { avatar: 'fox', nickname: 'Lina', unlockedAvatars: ['fox', 'panda'] },
    };
    UserManager._currentUser = 'Lina';
    UserManager.refreshUserList();
  });

  afterEach(() => {
    UserManager._players = {};
    UserManager._currentUser = null;
    document.body.innerHTML = '';
  });

  test('changer d’avatar met aussitôt à jour la tuile de « Qui joue ? »', () => {
    const face = () => document.querySelector('#user-list .user-tile-face').getAttribute('src');
    expect(face()).toContain('fox_head');

    Customization.show();
    document.querySelector('#slide6 .avatar-btn[data-avatar="panda"]').click();

    expect(UserManager._players.Lina.avatar).toBe('panda');
    expect(face()).toContain('panda_head');
  });

  test('le texte de « Avatar actuel » suit la langue choisie', () => {
    Customization.init();
    Customization.show();
    const img = document.getElementById('current-avatar-img');
    expect(img.alt).toBe('Renard');

    setTranslations({ fox: 'Fox', panda: 'Panda' });
    eventBus.emit('languageChanged', { lang: 'en' });
    expect(img.alt).toBe('Fox');
  });
});

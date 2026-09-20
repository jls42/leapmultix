/* eslint-env jest, node */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

// Traductions : une clé connue, les autres renvoient « [clé] » comme js/i18n.js
jest.unstable_mockModule('../js/i18n.js', () => ({
  getTranslation: k => (k === 'arcade_life_lost' ? 'Vie perdue' : `[${k}]`),
}));
const speakMock = jest.fn();
jest.unstable_mockModule('../js/speech.js', () => ({
  speak: speakMock,
  isVoiceEnabled: () => false,
}));
const playSoundMock = jest.fn();
jest.unstable_mockModule('../js/core/audio.js', () => ({
  AudioManager: { playSound: playSoundMock },
}));
jest.unstable_mockModule('../js/arcade.js', () => ({ isArcadeActive: () => true }));

const { showArcadeMessage, createArcadeToast, resolveArcadeTone, getArcadeText } = await import(
  '../js/arcade-message.js'
);
const { showArcadePoints, showArcadePenalty } = await import('../js/arcade-points.js');
const {
  showGameInstructions,
  getCanvasFont,
  getCanvasFontFamily,
  getCanvasContentRect,
  clientToCanvasPoint,
  canvasToClientPoint,
  readableCanvasFontSize,
  getArcadeCanvasBox,
  prepareArcadeStage,
} = await import('../js/arcade-common.js');

/** Zone de jeu telle que la crée le gabarit commun (js/components/infoBar.js) */
function renderStage() {
  document.body.innerHTML = `
    <section id="slide4" class="slide">
      <div id="game">
        <div class="arcade-mult-display"></div>
        <div class="arcade-game-ui" style="margin-top: 8px; width: 100%; height: 80vh; display: flex; justify-content: center; align-items: center;">
          <canvas id="c"></canvas>
          <button class="btn btn-secondary" id="abandon">Abandonner</button>
        </div>
      </div>
    </section>`;
  return document.getElementById('c');
}

/**
 * Remplace getComputedStyle et getBoundingClientRect pour décrire une mise en page
 * (jsdom ne calcule pas la mise en page).
 */
function mockLayout(entries) {
  const styles = new Map();
  for (const [el, { rect, style }] of entries) {
    if (rect) {
      el.getBoundingClientRect = () => ({
        left: rect[0],
        top: rect[1],
        width: rect[2],
        height: rect[3],
        right: rect[0] + rect[2],
        bottom: rect[1] + rect[3],
        x: rect[0],
        y: rect[1],
      });
    }
    styles.set(el, style || {});
  }
  const original = globalThis.getComputedStyle;
  globalThis.getComputedStyle = el => ({ ...original(el), ...styles.get(el) });
  return () => {
    globalThis.getComputedStyle = original;
  };
}

beforeEach(() => {
  jest.useFakeTimers();
  playSoundMock.mockClear();
  document.body.innerHTML =
    '<div id="game"><div class="arcade-game-ui"><canvas></canvas></div></div>';
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Messages d’arcade : ton porté par une classe, jamais par une couleur en ligne', () => {
  test('showArcadeMessage affiche le texte traduit avec la classe du ton', () => {
    showArcadeMessage('arcade_life_lost', 'neutral', 1500);
    const toast = document.querySelector('#game .arcade-toast');
    expect(toast).toBeTruthy();
    expect(toast.classList.contains('arcade-toast--neutral')).toBe(true);
    expect(toast.textContent).toBe('Vie perdue');
    expect(toast.getAttribute('style')).toBeNull();
  });

  test('le message disparaît après la durée demandée', () => {
    showArcadeMessage('arcade_life_lost', 'success', 1000);
    expect(document.querySelector('.arcade-toast')).toBeTruthy();
    jest.advanceTimersByTime(1000);
    expect(document.querySelector('.arcade-toast')).toBeNull();
  });

  test('un ton inconnu (ex. ancienne couleur hexadécimale) retombe sur neutre', () => {
    expect(resolveArcadeTone('#F44336')).toBe('neutral');
    expect(resolveArcadeTone('WARNING')).toBe('warning');
    expect(createArcadeToast('Salut', undefined).className).toContain('arcade-toast--neutral');
  });

  test('pas de ton « danger » : une erreur de l’enfant n’est jamais rouge', () => {
    expect(resolveArcadeTone('danger')).toBe('neutral');
    showArcadeMessage('arcade_life_lost', 'danger');
    const toast = document.querySelector('.arcade-toast');
    expect(toast.classList.contains('arcade-toast--danger')).toBe(false);
    expect(toast.classList.contains('arcade-toast--neutral')).toBe(true);
  });

  test('une clé absente affiche le texte de repli, pas « [clé] »', () => {
    expect(getArcadeText('cle_absente', 'Texte de repli')).toBe('Texte de repli');
    expect(getArcadeText('arcade_life_lost')).toBe('Vie perdue');
    showArcadeMessage('cle_absente', 'neutral', 1000, 'Oups ! Ne tire pas sur la bonne réponse.');
    expect(document.querySelector('.arcade-toast').textContent).toBe(
      'Oups ! Ne tire pas sur la bonne réponse.'
    );
  });
});

describe('Points d’arcade : signe et ton', () => {
  test('un gain affiche « +100 » avec la classe gain', () => {
    const canvas = document.querySelector('canvas');
    showArcadePoints(100, canvas);
    const el = document.querySelector('.arcade-points');
    expect(el.textContent).toBe('+100');
    expect(el.classList.contains('arcade-points--gain')).toBe(true);
    expect(el.style.color).toBe('');
    expect(playSoundMock).toHaveBeenCalledWith('good', { volume: 0.4 });
  });

  test('une perte affiche un vrai signe moins et la classe perte, puis s’efface', () => {
    const canvas = document.querySelector('canvas');
    showArcadePoints(-50, canvas);
    const el = document.querySelector('.arcade-points');
    expect(el.textContent).toBe('−50');
    expect(el.classList.contains('arcade-points--loss')).toBe(true);
    jest.advanceTimersByTime(500);
    expect(el.classList.contains('is-leaving')).toBe(true);
    jest.advanceTimersByTime(400);
    expect(document.querySelector('.arcade-points')).toBeNull();
  });

  test('la pastille se pose au point du jeu concerné, pas au milieu de l’écran', () => {
    const canvas = document.querySelector('canvas');
    showArcadePoints(100, canvas, { x: 40, y: 30 });
    const el = document.querySelector('.arcade-points');
    expect(el.classList.contains('arcade-points--at')).toBe(true);
    expect(el.style.left).toBe('40px');
    expect(el.style.top).toBe('30px');
  });

  test('une pénalité montre les points vraiment retirés (75 en Moyen)', () => {
    const canvas = document.querySelector('canvas');
    showArcadePenalty(75, canvas);
    expect(document.querySelector('.arcade-points').textContent).toBe('−75');
    expect(playSoundMock).toHaveBeenCalledWith('bad', { volume: 0.4 });
  });

  test('score déjà à zéro : pas de « −50 » trompeur, seulement le son', () => {
    const canvas = document.querySelector('canvas');
    showArcadePenalty(0, canvas);
    expect(document.querySelector('.arcade-points')).toBeNull();
    expect(playSoundMock).toHaveBeenCalledWith('bad', { volume: 0.4 });
  });
});

describe('Consigne de jeu', () => {
  test('dans la vraie zone de jeu, la consigne se place sous le canevas, avant « Abandonner »', () => {
    const canvas = renderStage();
    const el = showGameInstructions(canvas, 'Utilise les flèches');
    expect(el).toBeTruthy();
    expect(el.previousElementSibling).toBe(canvas);
    expect(el.nextElementSibling.id).toBe('abandon');
    expect(el.getAttribute('role')).toBe('status');
  });

  test('la consigne prend la classe de ton et se masque après la durée', () => {
    document.body.innerHTML = '<div class="arcade-game-container"><canvas id="c"></canvas></div>';
    const canvas = document.getElementById('c');
    const el = showGameInstructions(canvas, 'Utilise les flèches', 'warning', 2000);
    expect(el.className).toBe('game-instructions game-instructions--warning');
    expect(el.textContent).toBe('Utilise les flèches');
    expect(el.getAttribute('style')).toBeNull();
    jest.advanceTimersByTime(2000);
    expect(el.classList.contains('is-leaving')).toBe(true);
    jest.advanceTimersByTime(320);
    expect(el.hidden).toBe(true);
  });

  test('un second affichage n’est pas masqué par la minuterie du premier', () => {
    const canvas = renderStage();
    showGameInstructions(canvas, 'Première', 'neutral', 1000);
    jest.advanceTimersByTime(900);
    const el = showGameInstructions(canvas, 'Seconde', 'neutral', 5000);
    jest.advanceTimersByTime(1000);
    expect(el.hidden).toBe(false);
    expect(el.classList.contains('is-leaving')).toBe(false);
    expect(document.querySelectorAll('.game-instructions')).toHaveLength(1);
  });

  test('un ton non prévu pour une consigne retombe sur neutre', () => {
    document.body.innerHTML = '<div class="arcade-game-container"><canvas id="c"></canvas></div>';
    const el = showGameInstructions(document.getElementById('c'), 'Go', 'danger');
    expect(el.classList.contains('game-instructions--neutral')).toBe(true);
  });
});

describe('Zone de jeu : hauteur libre et place du canevas', () => {
  test('prepareArcadeStage retire la hauteur de 80vh posée en ligne par le gabarit', () => {
    const canvas = renderStage();
    const stage = prepareArcadeStage(canvas);
    expect(stage.classList.contains('arcade-game-ui')).toBe(true);
    expect(stage.style.height).toBe('');
    expect(stage.style.justifyContent).toBe('');
    expect(stage.style.width).toBe('100%');
  });

  test('la place du canevas tient dans l’écran, consigne et « Abandonner » déduits', () => {
    const canvas = renderStage();
    const instructions = showGameInstructions(canvas, 'Consigne');
    const stage = canvas.parentElement;
    const abandon = document.getElementById('abandon');
    Object.defineProperty(stage, 'clientWidth', { value: 1200, configurable: true });
    const restore = mockLayout([
      [stage, { rect: [32, 200, 1200, 500], style: { rowGap: '12px', paddingBottom: '12px' } }],
      [
        canvas,
        {
          style: {
            borderTopWidth: '2px',
            borderBottomWidth: '2px',
            borderLeftWidth: '2px',
            borderRightWidth: '2px',
          },
        },
      ],
      [instructions, { rect: [0, 0, 400, 42] }],
      [abandon, { rect: [0, 0, 137, 48] }],
    ]);
    const previousHeight = globalThis.innerHeight;
    globalThis.innerHeight = 800;
    try {
      const box = getArcadeCanvasBox(canvas);
      // 800 − 200 (haut de la zone) − (42 + 12) − (48 + 12) − 12 (bas) − 4 (cadre)
      expect(box.height).toBe(470);
      expect(box.width).toBe(1196);
    } finally {
      globalThis.innerHeight = previousHeight;
      restore();
    }
  });
});

describe('Géométrie du canevas : le pointeur tombe où l’enfant vise', () => {
  test('bandes d’object-fit: contain prises en compte (canevas réduit en hauteur)', () => {
    const canvas = renderStage();
    canvas.width = 853;
    canvas.height = 640;
    // Boîte de 853 × 520 (bordure de 2 px) : le dessin est réduit à 0,8125 et centré
    const restore = mockLayout([
      [
        canvas,
        {
          rect: [206, 208, 857, 524],
          style: {
            objectFit: 'contain',
            objectPosition: '50% 50%',
            borderTopWidth: '2px',
            borderRightWidth: '2px',
            borderBottomWidth: '2px',
            borderLeftWidth: '2px',
          },
        },
      ],
    ]);
    try {
      const content = getCanvasContentRect(canvas);
      expect(content.width).toBeCloseTo(693.0625, 3);
      expect(content.left).toBeCloseTo(208 + (853 - 693.0625) / 2, 3);
      // Le centre d'un monstre dessiné à x = 100 (coordonnées internes)
      const screen = canvasToClientPoint(canvas, 100, 60);
      const back = clientToCanvasPoint(canvas, screen.x, screen.y);
      expect(back.x).toBeCloseTo(100, 5);
      expect(back.y).toBeCloseTo(60, 5);
      // L'ancien calcul (largeur interne / largeur de la boîte) visait 80 px trop à gauche
      const naiveX = (screen.x - 206) * (canvas.width / 857);
      expect(Math.abs(naiveX - 100)).toBeGreaterThan(50);
    } finally {
      restore();
    }
  });

  test('nombres lisibles : 16 px à l’écran même quand le canevas est réduit', () => {
    const canvas = renderStage();
    canvas.width = 370;
    canvas.height = 556;
    const restore = mockLayout([[canvas, { rect: [30, 291, 281, 422], style: {} }]]);
    try {
      // 281 / 370 ≈ 0,759 : il faut ≈ 21 px internes pour 16 px à l'écran
      expect(readableCanvasFontSize(canvas, 12)).toBeCloseTo(16 / (281 / 370), 3);
      expect(readableCanvasFontSize(canvas, 30)).toBe(30);
    } finally {
      restore();
    }
  });
});

describe('Police des nombres dessinés dans les canvas', () => {
  test('repli système tant que le jeton --font-display est absent', () => {
    expect(getCanvasFont(24)).toBe('700 24px system-ui, sans-serif');
  });

  test('utilise le jeton --font-display dès qu’il est défini', () => {
    document.documentElement.style.setProperty('--font-display', "'Baloo2', sans-serif");
    expect(getCanvasFontFamily()).toBe("'Baloo2', sans-serif");
    expect(getCanvasFont(17.6, 600)).toBe("600 18px 'Baloo2', sans-serif");
    document.documentElement.style.removeProperty('--font-display');
  });
});

/* eslint-env jest, node */
/**
 * Bouton « retour » du téléphone dans l'appli Android (js/back-navigation.js) : l'appli
 * envoie « backbutton » au document, la page l'annule quand elle a su reculer d'un écran.
 * Fenêtre ouverte, partie en cours, bouton de retour de l'écran, écran d'où l'on venait ;
 * sur le premier écran, l'événement n'est pas annulé : l'appli se ferme.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { closeOpenDialog, openDialog } from './helpers/confirm-dialog-helpers.mjs';

/** Écrans de la page : goToSlide affiche le sien et prévient le fil, comme mainInit.js */
jest.unstable_mockModule('../js/slides.js', () => ({
  goToSlide: jest.fn(async target => {
    const id = typeof target === 'number' ? `slide${target}` : target;
    for (const slide of document.querySelectorAll('.slide')) {
      slide.classList.toggle('active-slide', slide.id === id);
    }
    const { slideShown } = await import('../js/back-navigation.js');
    slideShown(id);
  }),
}));

const { goToSlide } = await import('../js/slides.js');
const { BACK_EVENT, forgetScreens, goBack, installBackNavigation } = await import(
  '../js/back-navigation.js'
);
const { confirmDialog } = await import('../js/components/confirm-dialog.js');
const store = await import('../js/i18n-store.js');
const FR = JSON.parse(
  readFileSync(new URL('../assets/translations/fr.json', import.meta.url), 'utf8')
);

const activeScreen = () => document.querySelector('.slide.active-slide')?.id;
/** La suite d'un retour : slides.js est chargé à la demande */
const settle = () => new Promise(resolve => setTimeout(resolve, 0));

/** Ce que l'appli fait : true si le jeu a reculé (événement annulé) */
async function pressBack() {
  const handled = !document.dispatchEvent(new Event(BACK_EVENT, { cancelable: true }));
  await settle();
  return handled;
}

/** Presse retour tant que le jeu recule ; rend les écrans traversés, puis « ferme » */
async function backUntilClosed(limit = 12) {
  const path = [];
  for (let presses = 0; presses < limit; presses += 1) {
    if (!(await pressBack())) return [...path, 'ferme'];
    path.push(activeScreen());
  }
  return [...path, 'bloqué'];
}

function mountScreens() {
  document.body.replaceChildren();
  for (const number of [0, 1, 4, 5, 6, 7, 8, 9, 10, 11]) {
    const slide = document.createElement('section');
    slide.id = `slide${number}`;
    slide.className = 'slide';
    document.body.appendChild(slide);
  }
}

/** Parcourt des écrans, du premier au dernier, comme un joueur */
async function visit(...numbers) {
  for (const number of numbers) await goToSlide(number);
}

/** Bouton posé dans l'écran affiché ; jsdom ne calcule pas la mise en page */
function addButton({ back = false, visible = true, disabled = false } = {}) {
  const button = document.createElement('button');
  if (back) button.dataset.back = '';
  button.disabled = disabled;
  button.checkVisibility = () => visible;
  button.onclick = jest.fn();
  document.querySelector('.slide.active-slide').appendChild(button);
  return button;
}

beforeAll(() => {
  store.setTranslations(FR);
  store.setCurrentLanguage('fr');
  mountScreens();
  document.getElementById('slide0').classList.add('active-slide');
  installBackNavigation();
});

beforeEach(async () => {
  mountScreens();
  forgetScreens();
  await visit(0);
  goToSlide.mockClear();
});

afterEach(() => {
  closeOpenDialog();
});

describe('écran d’où l’on venait', () => {
  test('sur « Qui joue ? », le retour n’est pas pris : l’appli se ferme', async () => {
    expect(await pressBack()).toBe(false);
    expect(goToSlide).not.toHaveBeenCalled();
    expect(activeScreen()).toBe('slide0');
  });

  test('de l’accueil, il revient à « Qui joue ? », puis l’appli se ferme', async () => {
    await visit(1);
    expect(await backUntilClosed()).toEqual(['slide0', 'ferme']);
  });

  test('d’un écran de jeu ou de résultats, il revient à l’accueil, jamais dans la partie', async () => {
    await visit(1, 4, 5);
    expect(await backUntilClosed()).toEqual(['slide1', 'slide0', 'ferme']);
  });

  test('il remonte les écrans dans l’ordre où ils ont été ouverts', async () => {
    await visit(1, 8, 10);
    expect(await backUntilClosed()).toEqual(['slide8', 'slide1', 'slide0', 'ferme']);
  });

  test('la confidentialité ouverte depuis l’accueil ramène à l’accueil', async () => {
    await visit(1, 10);
    expect(await pressBack()).toBe(true);
    expect(activeScreen()).toBe('slide1');
  });

  test('revenir par un bouton de la page ne fait pas tourner en rond', async () => {
    // À propos, confidentialité, puis « Retour à À propos »
    await visit(1, 8, 10, 8);
    expect(await backUntilClosed()).toEqual(['slide1', 'slide0', 'ferme']);
  });

  test('un écran revu fait oublier ceux ouverts après lui', async () => {
    // À propos, confidentialité, « Retour à À propos », puis le tableau de bord
    await visit(1, 8, 10, 8, 7);
    expect(await backUntilClosed()).toEqual(['slide8', 'slide1', 'slide0', 'ferme']);
  });

  test('après une partie, le tableau de bord ramène à l’accueil', async () => {
    await visit(1, 4, 5, 7);
    expect(await backUntilClosed()).toEqual(['slide1', 'slide0', 'ferme']);
  });

  test('un écran que le fil ne connaît pas ramène à « Qui joue ? »', async () => {
    await visit(1, 7);
    forgetScreens();
    expect(await backUntilClosed()).toEqual(['slide0', 'ferme']);
  });

  test.each([[[1]], [[1, 4]], [[1, 6, 7, 8, 9, 10, 11]], [[1, 8, 1, 7, 6, 4, 5, 7]]])(
    'hors partie, des retours répétés finissent toujours par fermer l’appli (%j)',
    async screens => {
      await visit(...screens);
      expect((await backUntilClosed()).at(-1)).toBe('ferme');
    }
  );
});

describe('bouton de retour de l’écran', () => {
  test('le retour presse le bouton marqué, sans changer d’écran lui-même', async () => {
    await visit(1, 4);
    goToSlide.mockClear();
    const back = addButton({ back: true });
    const home = addButton();
    expect(await pressBack()).toBe(true);
    expect(back.onclick).toHaveBeenCalledTimes(1);
    expect(home.onclick).not.toHaveBeenCalled();
    expect(goToSlide).not.toHaveBeenCalled();
    expect(activeScreen()).toBe('slide4');
  });

  test('un bouton caché ou désactivé ne compte pas : le premier qui se voit est pressé', async () => {
    await visit(1, 4);
    const hidden = addButton({ back: true, visible: false });
    const disabled = addButton({ back: true, disabled: true });
    const seen = addButton({ back: true });
    expect(await pressBack()).toBe(true);
    expect(hidden.onclick).not.toHaveBeenCalled();
    expect(disabled.onclick).not.toHaveBeenCalled();
    expect(seen.onclick).toHaveBeenCalledTimes(1);
  });

  test('le bouton d’un autre écran ne compte pas', async () => {
    await visit(1, 4);
    const elsewhere = addButton({ back: true });
    await visit(1, 7);
    expect(await pressBack()).toBe(true);
    expect(elsewhere.onclick).not.toHaveBeenCalled();
    expect(activeScreen()).toBe('slide1');
  });
});

describe('fenêtre ouverte, partie en cours', () => {
  test('une fenêtre ouverte se ferme, l’écran ne change pas', async () => {
    await visit(1, 7);
    goToSlide.mockClear();
    const answer = confirmDialog({ title: 'Titre', message: 'Question ?' });
    openDialog().checkVisibility = () => true;
    expect(await pressBack()).toBe(true);
    expect(openDialog()).toBeNull();
    expect(await answer).toBe(false);
    expect(goToSlide).not.toHaveBeenCalled();
    expect(activeScreen()).toBe('slide7');
    // La fenêtre fermée, le retour reprend son chemin
    expect(await pressBack()).toBe(true);
    expect(activeScreen()).toBe('slide1');
  });

  test('pendant un jeu d’Arcade, il pose la question de « Abandonner » et ne quitte pas l’écran', async () => {
    await visit(1, 4);
    goToSlide.mockClear();
    const game = document.createElement('div');
    game.className = 'arcade-game-ui';
    game.appendChild(
      Object.assign(document.createElement('button'), { id: 'multipop-abandon-btn' })
    );
    document.getElementById('slide4').appendChild(game);
    const back = addButton({ back: true });
    expect(await pressBack()).toBe(true);
    // La question du jeu (game-exit.js) : la partie attend la réponse
    expect(openDialog()).not.toBeNull();
    expect(back.onclick).not.toHaveBeenCalled();
    expect(goToSlide).not.toHaveBeenCalled();
    // Un second retour ferme la question : la partie continue, sur le même écran
    openDialog().checkVisibility = () => true;
    expect(await pressBack()).toBe(true);
    expect(openDialog()).toBeNull();
    expect(activeScreen()).toBe('slide4');
  });
});

describe('sans l’appli', () => {
  test('goBack dit s’il a reculé', async () => {
    expect(goBack()).toBe(false);
    await visit(1);
    expect(goBack()).toBe(true);
  });

  test('installer deux fois ne double pas le retour', async () => {
    installBackNavigation();
    await visit(1, 4);
    const back = addButton({ back: true });
    expect(await pressBack()).toBe(true);
    expect(back.onclick).toHaveBeenCalledTimes(1);
  });
});

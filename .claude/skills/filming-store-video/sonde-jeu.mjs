// Repérage : ce qu'un jeu d'Arcade dessine sur son plateau (noms des images, textes), pour
// écrire ou corriger la façon d'y jouer dans arcade.mjs.
//   node .claude/skills/filming-store-video/sonde-jeu.mjs <jeu> [fenêtre en ms]
// Une fenêtre longue (60000) montre aussi ce qui n'est dessiné qu'une fois (MultiMemory).
import {
  BOARD,
  arcadeQuestion,
  boardBox,
  boardImages,
  boardTexts,
  launchArcade,
  open,
  wait,
} from './base.mjs';

const [game = 'multimiam', fresh = '300'] = process.argv.slice(2);
const place = item => `${Math.round(item.x)},${Math.round(item.y)}`;
const { page, close } = await open('fr');
try {
  await launchArcade(page, game);
  await wait(2500);
  const groups = new Map();
  for (const image of await boardImages(page, BOARD, Number(fresh))) {
    const key = `${image.src} ${Math.round(image.w)}x${Math.round(image.h)}`;
    groups.set(key, [...(groups.get(key) ?? []), place(image)]);
  }
  for (const [key, places] of groups) console.log(key, places.length, places.slice(0, 6).join(' '));
  const texts = await boardTexts(page, BOARD, Number(fresh));
  console.log('textes', texts.map(text => `${text.t}@${place(text)}`).join(' '));
  console.log('question', JSON.stringify(await arcadeQuestion(page)));
  console.log('plateau', JSON.stringify(await boardBox(page)));
} finally {
  await close();
}

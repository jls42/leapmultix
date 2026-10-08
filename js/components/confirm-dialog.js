/**
 * Fenêtre de confirmation du jeu, à la place de window.confirm : une question, deux boutons.
 * - role="alertdialog", modale (aria-modal), titre et texte reliés (aria-labelledby,
 *   aria-describedby) ;
 * - le focus va d'abord sur le bouton sans risque (annuler) : une touche répétée (Espace,
 *   Entrée) ne confirme jamais par mégarde ; Échap annule ; Tab reste dans la fenêtre ;
 * - pendant la question, le reste de la page est inerte et ne reçoit aucune touche : un jeu
 *   ne tire ni ne tape derrière la fenêtre ;
 * - à la fermeture, le focus revient à l'élément d'origine.
 * Une seule question à la fois : une seconde demande reçoit la réponse de la première.
 * En plein écran, la fenêtre se pose dans l'élément affiché (ailleurs, elle serait invisible)
 * et revient dans la page quand il en sort.
 */

const TITLE_ID = 'confirm-dialog-title';
const MESSAGE_ID = 'confirm-dialog-message';

/** Question affichée : {layer, buttons, origin, inerted, answer, resolve}, ou null */
let current = null;

/**
 * Bouton de réponse
 * @param {string} answer - « cancel » ou « confirm »
 * @param {string} label
 * @param {string} className
 * @returns {HTMLButtonElement}
 */
function createAnswerButton(answer, label, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.dataset.answer = answer;
  button.textContent = label;
  return button;
}

/**
 * La fenêtre et son voile. Le bouton sans risque vient d'abord, en touche principale ; la
 * confirmation, destructive, reste secondaire. Une action qui ne détruit rien (un achat)
 * passe en touche principale (emphasis « confirm »), le refus gardant le focus. Sans
 * confirmLabel, il reste seul : la fenêtre informe.
 * @returns {{layer: HTMLElement, buttons: HTMLButtonElement[]}}
 */
function buildDialog({ title, message, confirmLabel, cancelLabel, emphasis }) {
  const layer = document.createElement('div');
  layer.className = 'confirm-dialog-layer';
  const scrim = document.createElement('div');
  scrim.className = 'confirm-dialog-scrim';
  const box = document.createElement('div');
  box.className = 'confirm-dialog';
  box.setAttribute('role', 'alertdialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', TITLE_ID);
  const heading = document.createElement('h2');
  heading.id = TITLE_ID;
  heading.className = 'confirm-dialog-title';
  heading.textContent = title;
  box.appendChild(heading);
  if (message) {
    const text = document.createElement('p');
    text.id = MESSAGE_ID;
    text.className = 'confirm-dialog-message';
    text.textContent = message;
    box.setAttribute('aria-describedby', MESSAGE_ID);
    box.appendChild(text);
  }
  const actionFirst = emphasis === 'confirm';
  const buttons = [
    createAnswerButton('cancel', cancelLabel, actionFirst ? 'btn btn-secondary' : 'btn'),
  ];
  if (confirmLabel) {
    const confirmClass = actionFirst ? 'btn' : 'btn btn-secondary btn-danger';
    buttons.push(createAnswerButton('confirm', confirmLabel, confirmClass));
  }
  const actions = document.createElement('div');
  actions.className = 'confirm-dialog-actions';
  actions.append(...buttons);
  box.appendChild(actions);
  layer.append(scrim, box);
  return { layer, buttons };
}

/**
 * Rend inerte tout ce qui n'est pas la fenêtre : ses voisins, puis ceux de chacun de ses
 * ancêtres jusqu'à la page (en plein écran, la barre du haut l'est aussi)
 * @param {Element} layer
 * @returns {Element[]} Les éléments rendus inertes, à rétablir
 */
function makeOthersInert(layer) {
  const inerted = [];
  for (let node = layer; node.parentElement && node !== document.body; node = node.parentElement) {
    for (const sibling of node.parentElement.children) {
      if (sibling === node || sibling.hasAttribute('inert')) continue;
      sibling.setAttribute('inert', '');
      inerted.push(sibling);
    }
  }
  return inerted;
}

/**
 * Pose la fenêtre dans l'élément affiché : celui qui est en plein écran, sinon la page
 * @param {{layer: HTMLElement, inerted: Element[]}} dialog
 */
function place(dialog) {
  for (const el of dialog.inerted) el.removeAttribute('inert');
  (document.fullscreenElement ?? document.body).appendChild(dialog.layer);
  dialog.inerted = makeOthersInert(dialog.layer);
}

/** Le plein écran a changé pendant la question : la fenêtre suit, le focus reste sur son bouton */
function followFullscreen() {
  if (!current || current.layer.parentElement === (document.fullscreenElement ?? document.body)) {
    return;
  }
  const focused = current.buttons.find(button => button === document.activeElement);
  place(current);
  (focused ?? current.buttons[0]).focus({ preventScroll: true });
}

/**
 * Tab et Maj+Tab passent d'un bouton à l'autre, sans sortir de la fenêtre
 * @param {KeyboardEvent} event
 * @param {HTMLButtonElement[]} buttons
 */
function cycleFocus(event, buttons) {
  const index = buttons.indexOf(document.activeElement);
  const step = event.shiftKey ? -1 : 1;
  buttons.at((index + step) % buttons.length)?.focus();
}

/**
 * Touches pendant la question, en capture sur le document : aucune ne va plus loin (jeu,
 * raccourcis, navigation clavier) ; les boutons gardent leur activation native.
 * @param {KeyboardEvent} event
 */
function handleKey(event) {
  if (!current) return;
  event.stopPropagation();
  if (event.key === 'Escape') {
    event.preventDefault();
    close(false);
  } else if (event.key === 'Tab') {
    event.preventDefault();
    cycleFocus(event, current.buttons);
  } else if (!current.layer.contains(document.activeElement)) {
    // Focus sorti de la fenêtre (clic sur le voile) : il y revient, la touche s'arrête là
    event.preventDefault();
    current.buttons[0].focus();
  }
}

/**
 * Ferme la fenêtre, rétablit la page et rend la réponse
 * @param {boolean} confirmed
 */
function close(confirmed) {
  if (!current) return;
  const { layer, inerted, origin, resolve } = current;
  current = null;
  document.removeEventListener('keydown', handleKey, true);
  document.removeEventListener('fullscreenchange', followFullscreen);
  layer.remove();
  for (const el of inerted) el.removeAttribute('inert');
  if (origin?.isConnected) origin.focus?.({ preventScroll: true });
  resolve(confirmed);
}

/**
 * Pose une question et attend la réponse
 * @param {Object} options
 * @param {string} options.title - La question (titre de la fenêtre)
 * @param {string} [options.message] - Ce qu'elle implique (texte de la fenêtre)
 * @param {string} [options.confirmLabel] - Bouton qui confirme (« Abandonner ») ; sans lui,
 *   la fenêtre n'a que le bouton cancelLabel et rend toujours false
 * @param {string} options.cancelLabel - Bouton sans risque, qui a le focus (« Continuer… »)
 * @param {HTMLElement|null} [options.returnFocusTo] - Où rendre le focus (par défaut,
 *   l'élément qui l'avait à l'ouverture)
 * @param {'cancel'|'confirm'} [options.emphasis] - Bouton principal : le refus (par défaut)
 *   ou, pour une action qui ne détruit rien, la confirmation
 * @returns {Promise<boolean>} true si confirmé
 */
export function confirmDialog({
  title,
  message = '',
  confirmLabel,
  cancelLabel,
  returnFocusTo,
  emphasis = 'cancel',
}) {
  if (current) return current.answer;
  const { layer, buttons } = buildDialog({ title, message, confirmLabel, cancelLabel, emphasis });
  const dialog = { layer, buttons, origin: returnFocusTo ?? document.activeElement, inerted: [] };
  dialog.answer = new Promise(resolve => {
    dialog.resolve = resolve;
  });
  buttons[0].addEventListener('click', () => close(false));
  buttons[1]?.addEventListener('click', () => close(true));
  current = dialog;
  document.addEventListener('keydown', handleKey, true);
  document.addEventListener('fullscreenchange', followFullscreen);
  place(dialog);
  buttons[0].focus({ preventScroll: true });
  return dialog.answer;
}

/**
 * Avatars à débloquer avec les pièces (décision du propriétaire, 08/10/2026), sous ceux du
 * joueur dans Personnalisation. Chaque avatar verrouillé est un bouton qui dit son prix ; le
 * toucher ouvre la fenêtre de confirmation du jeu (components/confirm-dialog.js) :
 * - assez de pièces : « Débloquer » débloque l'avatar, débite les pièces et l'enregistre, puis
 *   l'événement « avatarUnlocked » laisse la personnalisation le mettre ;
 * - sinon, la fenêtre dit combien il en manque et comment en gagner, et rien ne change.
 * Un bouton plutôt qu'un bouton radio désactivé : il se joint au clavier, et le groupe des
 * avatars ne propose que des choix possibles. Rien n'est lu à voix haute.
 */
import { AVATAR_PRICE, buyAvatar, coinBalance, missingCoins } from '../core/avatar-shop.js';
import { HEAD_SIZES, setAvatarHead } from '../avatar-heads.js';
import { UserState } from '../core/userState.js';
import { eventBus } from '../core/eventBus.js';
import { gameState } from '../game.js';
import { updateCoinDisplay } from '../coin-display.js';
import { translate } from '../i18n-store.js';
import { showMessage } from '../ui-feedback.js';
import { confirmDialog } from './confirm-dialog.js';
import { createIcon } from './icons.js';

const SHOP_ID = 'avatar-shop';
const INTRO_ID = 'avatar-shop-intro';

/** Solde et prix, réécrits à chaque affichage et à chaque changement de langue */
function writeShopTexts() {
  const intro = document.getElementById(INTRO_ID);
  if (intro) {
    const coins = coinBalance(UserState.getCurrentUserData());
    intro.textContent = translate('avatar_shop_intro', { price: AVATAR_PRICE, coins });
  }
  for (const price of document.querySelectorAll(`#${SHOP_ID} .avatar-price-text`)) {
    price.textContent = translate('avatar_price', { price: AVATAR_PRICE });
  }
}

/**
 * Le joueur choisit « Débloquer » : l'achat se fait sur le profil relu à ce moment
 * @param {string} avatarId
 */
function unlockAvatar(avatarId) {
  const userData = UserState.getCurrentUserData();
  if (buyAvatar(userData, avatarId) !== 'unlocked') return;
  UserState.updateUserData(userData);
  // « Enregistrer » réécrit le profil avec gameState : il doit connaître l'achat
  gameState.unlockedAvatars = [...userData.unlockedAvatars];
  updateCoinDisplay();
  eventBus.emit('avatarUnlocked', { avatar: avatarId });
  showMessage(translate('avatar_bought', { avatar: translate(avatarId) }));
}

/**
 * Fenêtre d'un avatar touché : l'achat proposé, ou ce qui manque pour le faire
 * @param {string} avatarId
 */
async function offerAvatar(avatarId) {
  const userData = UserState.getCurrentUserData();
  const avatar = translate(avatarId);
  const missing = missingCoins(userData);
  if (missing > 0) {
    // Une information : un seul bouton, qui ferme la fenêtre
    await confirmDialog({
      title: translate('avatar_buy_missing', { missing, avatar }),
      message: translate('avatar_buy_earn'),
      cancelLabel: translate('avatar_buy_ok'),
    });
    return;
  }
  const confirmed = await confirmDialog({
    title: translate('avatar_buy_question', { avatar, price: AVATAR_PRICE }),
    message: translate('avatar_buy_left', { left: coinBalance(userData) - AVATAR_PRICE }),
    confirmLabel: translate('avatar_buy_confirm'),
    cancelLabel: translate('avatar_buy_cancel'),
    // Un achat ne détruit rien : « Débloquer » en bouton principal, le focus reste sur le refus
    emphasis: 'confirm',
  });
  if (confirmed) unlockAvatar(avatarId);
}

/** Prix d'un avatar : la pièce dessinée, puis « 50 pièces » */
function priceTag() {
  const price = document.createElement('span');
  price.className = 'avatar-price';
  const icon = createIcon('coin', { size: 16, className: 'coin-icon' });
  if (icon) price.appendChild(icon);
  const text = document.createElement('span');
  text.className = 'avatar-price-text';
  price.appendChild(text);
  return price;
}

/**
 * Bouton d'un avatar à débloquer : son visage, son nom, son prix et le cadenas
 * @param {string} avatarId
 * @returns {HTMLButtonElement}
 */
function shopButton(avatarId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'avatar-btn avatar-buy-btn';
  button.dataset.avatar = avatarId;
  button.setAttribute('aria-describedby', INTRO_ID);
  const img = document.createElement('img');
  // La même taille que les avatars du joueur, juste au-dessus
  setAvatarHead(img, avatarId, HEAD_SIZES.choice);
  img.width = 100;
  img.height = 100;
  img.alt = '';
  const name = document.createElement('span');
  name.className = 'avatar-label';
  // Un changement de langue réécrit le nom (i18n.js), le prix suit writeShopTexts
  name.dataset.translate = avatarId;
  name.textContent = translate(avatarId);
  const lock = document.createElement('span');
  lock.className = 'lock-icon';
  lock.setAttribute('aria-hidden', 'true');
  const lockIcon = createIcon('lock', { size: 18 });
  if (lockIcon) lock.appendChild(lockIcon);
  button.append(img, ' ', name, ' ', priceTag(), lock);
  button.addEventListener('click', () => void offerAvatar(avatarId));
  return button;
}

/**
 * Boutons des avatars à débloquer, sous la grille ; la boutique disparaît quand tout est
 * débloqué
 * @param {string[]} lockedAvatars - Identifiants, dans l'ordre de la grille
 */
export function renderAvatarShop(lockedAvatars) {
  const shop = document.getElementById(SHOP_ID);
  if (!shop) return;
  shop.hidden = lockedAvatars.length === 0;
  shop
    .querySelector('.avatar-shop-list')
    ?.replaceChildren(...lockedAvatars.map(avatarId => shopButton(avatarId)));
  writeShopTexts();
}

eventBus.on('languageChanged', writeShopTexts);

/**
 * « Qui joue ? » sur un poste partagé par une classe (slide 0) : filtre des prénoms dès
 * 10 joueurs et raccourci vers « Nouveau joueur », au-dessus des tuiles.
 *
 * Les tuiles sont dessinées par UserManager.refreshUserList, triées par prénom ; chaque rendu
 * est signalé par l'événement « playersChanged », qui remet cette barre à jour.
 */
import { eventBus } from '../core/eventBus.js';
import { getCurrentLanguage } from '../i18n-store.js';
import { getTranslation } from '../i18n.js';
import { normalizeUsername } from '../security-utils.js';
import { preferredScrollBehavior } from '../ui-feedback.js';

/** Nombre de joueurs à partir duquel le filtre apparaît */
export const FILTER_THRESHOLD = 10;

/**
 * Traduction, ou texte de secours tant que la clé manque
 * @param {string} key
 * @param {string} fallback
 * @param {Object} [params]
 * @returns {string}
 */
function translateOr(key, fallback, params = {}) {
  const value = getTranslation(key, params);
  return typeof value === 'string' && !/^\[.*\]$/.test(value) ? value : fallback;
}

/** Comparaison sans accents ni majuscules, dans la langue du jeu */
const baseCollator = () => new Intl.Collator(getCurrentLanguage(), { sensitivity: 'base' });

/**
 * Le prénom, ou l'un de ses mots, commence-t-il par ce qui est tapé ? Sans tenir compte des
 * accents ni des majuscules : « lea » trouve « Léa », « luc » trouve « Jean-Luc ».
 * @param {string} name
 * @param {string} query
 * @param {Intl.Collator} [collator]
 * @returns {boolean}
 */
export function nameMatches(name, query, collator = baseCollator()) {
  const wanted = normalizeUsername(query);
  if (!wanted) return true;
  const startsWith = part => collator.compare(part.slice(0, wanted.length), wanted) === 0;
  return startsWith(name) || name.split(/[\s'’-]+/u).some(startsWith);
}

export const PlayerTools = {
  _wired: false,

  /**
   * Branche la barre (une fois, par délégation sur le document) et la met à jour à chaque
   * rendu des tuiles
   */
  init() {
    if (!this._wired) {
      this._wired = true;
      eventBus.on('playersChanged', () => this.refresh());
      document.addEventListener('input', event => this._onInput(event));
      // En capture : Entrée s'arrête ici, avant la navigation clavier globale
      document.addEventListener('keydown', event => this._onFilterEnter(event), true);
      document.addEventListener('click', event => this._onClick(event));
    }
    this.refresh();
  },

  /**
   * Barre visible dès qu'il y a un joueur ; filtre dès FILTER_THRESHOLD joueurs
   */
  refresh() {
    const tools = document.getElementById('user-list-tools');
    if (!tools) return;
    const count = document.querySelectorAll('#user-list .user-container').length;
    tools.hidden = count === 0;
    this._showFilter(count >= FILTER_THRESHOLD);
    this.applyFilter();
  },

  /**
   * @param {boolean} visible
   * @private
   */
  _showFilter(visible) {
    const filter = document.getElementById('user-filter');
    if (!filter) return;
    filter.hidden = !visible;
    // Un filtre caché ne cache rien
    const input = document.getElementById('user-filter-input');
    if (!visible && input) input.value = '';
  },

  /**
   * Cache les tuiles dont le prénom ne correspond pas à ce qui est tapé
   */
  applyFilter() {
    const query = document.getElementById('user-filter-input')?.value || '';
    const collator = baseCollator();
    let shown = 0;
    for (const item of document.querySelectorAll('#user-list .user-container')) {
      item.hidden = !nameMatches(item.dataset.player || '', query, collator);
      if (!item.hidden) shown += 1;
    }
    this._showNoMatch(normalizeUsername(query), shown);
  },

  /**
   * « Aucun prénom ne commence par « xyz ». »
   * @param {string} query
   * @param {number} shown
   * @private
   */
  _showNoMatch(query, shown) {
    const empty = document.getElementById('user-filter-empty');
    if (!empty) return;
    empty.hidden = !query || shown > 0;
    empty.textContent = empty.hidden
      ? ''
      : translateOr('user_filter_empty', `Aucun prénom ne commence par «\u00a0${query}\u00a0».`, {
          query,
        });
  },

  /**
   * Le champ « Ton prénom », amené à l'écran
   */
  goToNewPlayer() {
    const field = document.getElementById('new-user-name');
    if (!field) return;
    field.scrollIntoView?.({ block: 'center', behavior: preferredScrollBehavior() });
    field.focus({ preventScroll: true });
  },

  /** @private */
  _onInput(event) {
    if (event.target?.id === 'user-filter-input') this.applyFilter();
  },

  /**
   * Entrée dans le filtre mène à la première tuile trouvée, sans la choisir. La touche
   * s'arrête ici : remontée jusqu'à la navigation clavier globale (keyboard-navigation.js),
   * elle cliquerait cette tuile.
   * @private
   */
  _onFilterEnter(event) {
    if (event.key !== 'Enter' || event.target?.id !== 'user-filter-input') return;
    event.preventDefault();
    event.stopPropagation();
    document.querySelector('#user-list .user-container:not([hidden]) .user-tile')?.focus();
  },

  /** @private */
  _onClick(event) {
    if (event.target?.closest?.('#new-player-shortcut')) this.goToNewPlayer();
  },
};

export default PlayerTools;

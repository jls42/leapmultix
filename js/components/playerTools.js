/**
 * « Qui joue ? » sur un poste partagé par une classe (slide 0) : filtre des prénoms dès
 * 10 joueurs, raccourci vers « Nouveau joueur » et corbeille, au-dessus des tuiles ;
 * sauvegarde des joueurs dans un fichier, et reprise, sous « Nouveau joueur ».
 *
 * Les tuiles sont dessinées par UserManager.refreshUserList, triées par prénom ; chaque rendu
 * est signalé par l'événement « playersChanged », qui remet cette barre à jour.
 */
import UserManager from '../userManager.js';
import { eventBus } from '../core/eventBus.js';
import { TRASH_DAYS, restorableTrash, trashExpiry } from '../core/players-trash.js';
import {
  BACKUP_MAX_BYTES,
  backupFileName,
  readPlayersBackup,
  requestPersistentStorage,
} from '../core/players-backup.js';
import { getCurrentLanguage } from '../i18n-store.js';
import { getTranslation } from '../i18n.js';
import { HEAD_SIZES, setAvatarHead } from '../avatar-heads.js';
import { normalizeUsername } from '../security-utils.js';
import { createTrashIcon, preferredScrollBehavior } from '../ui-feedback.js';

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

/**
 * Date de l'effacement pour de bon : « jusqu'au 7 novembre »
 * @param {{deletedAt: number}} entry
 * @returns {string}
 */
function expiryLabel(entry) {
  const format = new Intl.DateTimeFormat(getCurrentLanguage(), { day: 'numeric', month: 'long' });
  const date = format.format(new Date(trashExpiry(entry)));
  return translateOr('trash_until', `jusqu’au ${date}`, { date });
}

/**
 * Une ligne de la corbeille : visage, prénom, date d'effacement, « Restaurer »
 * @param {{name: string, deletedAt: number, data: Object}} entry
 * @returns {HTMLLIElement}
 */
function trashItem(entry) {
  const item = document.createElement('li');
  item.className = 'trash-entry';
  const face = document.createElement('img');
  face.className = 'trash-entry-face';
  setAvatarHead(face, entry.data?.avatar, HEAD_SIZES.trash);
  face.alt = '';
  face.width = 40;
  face.height = 40;
  const name = document.createElement('span');
  name.className = 'trash-entry-name';
  name.textContent = entry.name;
  const until = document.createElement('span');
  until.className = 'trash-entry-until';
  until.textContent = expiryLabel(entry);
  const restore = document.createElement('button');
  restore.type = 'button';
  restore.className = 'btn btn-secondary btn-sm trash-restore-btn';
  restore.textContent = translateOr('trash_restore', 'Restaurer');
  const label = `Restaurer «\u00a0${entry.name}\u00a0»`;
  restore.setAttribute(
    'aria-label',
    translateOr('trash_restore_label', label, { name: entry.name })
  );
  restore.dataset.trashName = entry.name;
  restore.dataset.trashDeletedAt = String(entry.deletedAt);
  item.append(face, name, until, restore);
  return item;
}

/**
 * Ce que dit la barre après « Restaurer »
 * @param {{ok: boolean, name: string, problem?: string}} result
 * @returns {string}
 */
function restoreMessage({ ok, name, problem }) {
  if (ok) {
    const fallback = `«\u00a0${name}\u00a0» est de retour dans la liste.`;
    return translateOr('trash_restored', fallback, { name });
  }
  if (problem === 'exists') {
    const fallback = `«\u00a0${name}\u00a0» est déjà dans la liste.`;
    return translateOr('trash_restore_exists', fallback, { name });
  }
  return translateOr('trash_restore_failed', 'Ce joueur n’a pas pu être restauré.');
}

/**
 * Télécharge un fichier JSON (lien temporaire vers un Blob)
 * @param {Object} payload
 * @param {string} fileName
 */
function downloadJson(payload, fileName) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Pourquoi un fichier n'a rien ajouté
 * @param {string} error - 'version', 'storage', ou autre (fichier illisible)
 * @returns {string}
 */
function importErrorMessage(error) {
  if (error === 'version') {
    const fallback = 'Ce fichier vient d’une version plus récente de LeapMultix.';
    return translateOr('import_newer_version', fallback);
  }
  if (error === 'storage') {
    const fallback = 'Le navigateur manque de place\u00a0: aucun joueur n’a été ajouté.';
    return translateOr('import_storage_full', fallback);
  }
  return translateOr(
    'import_bad_file',
    'Ce fichier n’est pas une sauvegarde de joueurs LeapMultix.'
  );
}

/**
 * Prénoms en liste dans la langue du jeu : « Léa, Tom et Zoé »
 * @param {string[]} names
 * @returns {string}
 */
function listOfNames(names) {
  try {
    return new Intl.ListFormat(getCurrentLanguage(), { type: 'conjunction' }).format(names);
  } catch {
    return names.join(', ');
  }
}

/** Au-delà, les joueurs laissés tels quels sont comptés, pas nommés */
const SKIPPED_NAMES_MAX = 5;

/**
 * Joueurs déjà là, laissés tels quels : nommés s'ils sont peu, comptés sinon
 * @param {string[]} skipped
 * @returns {string}
 */
function skippedMessage(skipped) {
  const count = skipped.length;
  if (count > SKIPPED_NAMES_MAX) {
    const fallback = `${count} joueurs déjà dans la liste, laissés tels quels.`;
    return translateOr('import_skipped_many', fallback, { n: count });
  }
  const names = listOfNames(skipped);
  const fallback = `Déjà dans la liste, laissés tels quels\u00a0: ${names}.`;
  return translateOr('import_skipped', fallback, { names });
}

/**
 * Bilan d'une reprise : ajoutés, laissés tels quels, illisibles
 * @param {{added: string[], skipped: string[]}} result
 * @param {number} rejected
 * @returns {string}
 */
function importSummary({ added, skipped }, rejected) {
  const count = added.length;
  const parts = [translateOr('import_done', `${count} joueurs ajoutés.`, { n: count })];
  if (skipped.length > 0) parts.push(skippedMessage(skipped));
  if (rejected > 0) {
    const fallback = `${rejected} joueurs illisibles écartés.`;
    parts.push(translateOr('import_rejected', fallback, { n: rejected }));
  }
  return parts.join(' ');
}

/** Boutons de la barre, branchés par délégation : sélecteur, puis action */
const CLICK_ACTIONS = [
  ['#new-player-shortcut', tools => tools.goToNewPlayer()],
  ['#player-trash-toggle', tools => tools.toggleTrash()],
  ['.trash-restore-btn', (tools, button) => tools.restore(button)],
  ['#export-players-btn', tools => tools.exportPlayers()],
  ['#import-players-btn', tools => tools.pickImportFile()],
];

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
      eventBus.on('playerTrashed', event => this._announceTrashed(event?.detail?.name));
      document.addEventListener('input', event => this._onInput(event));
      // En capture : Entrée s'arrête ici, avant la navigation clavier globale
      document.addEventListener('keydown', event => this._onFilterEnter(event), true);
      document.addEventListener('click', event => this._onClick(event));
      document.addEventListener('change', event => this._onImportChosen(event));
    }
    this.refresh();
  },

  /**
   * Barre visible dès qu'il y a un joueur, ou un joueur dans la corbeille ; filtre dès
   * FILTER_THRESHOLD joueurs
   */
  refresh() {
    const tools = document.getElementById('user-list-tools');
    if (!tools) return;
    const count = document.querySelectorAll('#user-list .user-container').length;
    const trash = restorableTrash();
    tools.hidden = count === 0 && trash.length === 0;
    // Sans joueur, le formulaire « Nouveau joueur » suit déjà, et il n'y a rien à enregistrer
    for (const id of ['new-player-shortcut', 'export-players-btn']) {
      const button = document.getElementById(id);
      if (button) button.hidden = count === 0;
    }
    this.say('');
    this._showFilter(count >= FILTER_THRESHOLD);
    this.applyFilter();
    this._renderTrash(trash);
  },

  /**
   * Message de la barre (région « status », lue par les lecteurs d'écran)
   * @param {string} text
   */
  say(text) {
    const message = document.getElementById('user-tools-message');
    if (message) message.textContent = text;
  },

  /**
   * Bouton « Corbeille (n) », règle de vidage et joueurs à restaurer
   * @param {Array<Object>} trash
   * @private
   */
  _renderTrash(trash) {
    const toggle = document.getElementById('player-trash-toggle');
    const list = document.getElementById('player-trash-list');
    if (!toggle || !list) return;
    toggle.hidden = trash.length === 0;
    if (trash.length === 0) this._setTrashOpen(false);
    if (!toggle.querySelector('.trash-icon')) toggle.prepend(createTrashIcon());
    const label = toggle.querySelector('.player-trash-label');
    const count = trash.length;
    if (label)
      label.textContent = translateOr('trash_toggle', `Corbeille (${count})`, { n: count });
    const rule = document.getElementById('player-trash-rule');
    const ruleText = `Un joueur supprimé attend ici ${TRASH_DAYS} jours, puis il est effacé pour de bon.`;
    if (rule) rule.textContent = translateOr('trash_rule', ruleText, { days: TRASH_DAYS });
    list.replaceChildren(...trash.map(trashItem));
  },

  /**
   * @param {boolean} open
   * @private
   */
  _setTrashOpen(open) {
    const toggle = document.getElementById('player-trash-toggle');
    const panel = document.getElementById('player-trash-panel');
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  },

  /**
   * Ouvre ou referme la corbeille
   */
  toggleTrash() {
    const toggle = document.getElementById('player-trash-toggle');
    this._setTrashOpen(toggle?.getAttribute('aria-expanded') !== 'true');
  },

  /**
   * « Restaurer » : le joueur revient dans la liste, sa tuile reçoit le focus
   * @param {HTMLButtonElement} button
   */
  restore(button) {
    const result = UserManager.restoreFromTrash({
      name: button.dataset.trashName,
      deletedAt: Number(button.dataset.trashDeletedAt),
    });
    if (result.ok) {
      // Un filtre en cours cacherait la tuile revenue
      const input = document.getElementById('user-filter-input');
      if (input) input.value = '';
      UserManager.refreshUserList();
      this._focusTile(result.name);
    }
    this.say(restoreMessage(result));
  },

  /**
   * @param {string} name
   * @private
   */
  _focusTile(name) {
    const items = [...document.querySelectorAll('#user-list .user-container')];
    items
      .find(item => item.dataset.player === name)
      ?.querySelector('.user-tile')
      ?.focus();
  },

  /**
   * « Léa est dans la corbeille. », après « Supprimer » (userManager.js)
   * @param {string} name
   * @private
   */
  _announceTrashed(name) {
    if (!name) return;
    const fallback = `«\u00a0${name}\u00a0» est dans la corbeille.`;
    this.say(translateOr('trash_added', fallback, { name }));
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

  /**
   * « Enregistrer les joueurs dans un fichier » : le fichier du jour se télécharge
   */
  exportPlayers() {
    const backup = UserManager.exportPlayers();
    const count = Object.keys(backup.players).length;
    const prefix = translateOr('players_file_prefix', 'leapmultix-joueurs');
    const file = backupFileName(prefix, new Date());
    downloadJson(backup, file);
    void requestPersistentStorage();
    const fallback = `${count} joueurs enregistrés dans «\u00a0${file}\u00a0».`;
    this._sayBackup(translateOr('export_done', fallback, { n: count, file }));
  },

  /**
   * « Reprendre des joueurs d'un fichier » : le choix du fichier s'ouvre
   */
  pickImportFile() {
    const input = document.getElementById('import-players-input');
    if (!input) return;
    // Le même fichier choisi deux fois de suite déclenche encore « change »
    input.value = '';
    input.click();
  },

  /**
   * Relit un fichier de sauvegarde, ajoute ses joueurs sans écraser personne, et dit le bilan
   * @param {File} file
   * @returns {Promise<void>}
   */
  async importFile(file) {
    const text = file.size > BACKUP_MAX_BYTES ? '' : await file.text().catch(() => '');
    const backup = readPlayersBackup(text);
    if (backup.error) {
      this._sayBackup(importErrorMessage(backup.error));
      return;
    }
    const result = UserManager.importPlayers(backup.players);
    if (result.error) {
      this._sayBackup(importErrorMessage(result.error));
      return;
    }
    if (result.added.length > 0) {
      UserManager.refreshUserList();
      void requestPersistentStorage();
    }
    this._sayBackup(importSummary(result, backup.rejected));
  },

  /**
   * @param {string} text
   * @private
   */
  _sayBackup(text) {
    const message = document.getElementById('players-backup-message');
    if (message) message.textContent = text;
  },

  /** @private */
  _onImportChosen(event) {
    const file = event.target?.id === 'import-players-input' ? event.target.files?.[0] : null;
    if (file) void this.importFile(file);
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
    for (const [selector, action] of CLICK_ACTIONS) {
      const element = event.target?.closest?.(selector);
      if (element) {
        action(this, element);
        return;
      }
    }
  },
};

export default PlayerTools;

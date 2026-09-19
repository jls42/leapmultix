/**
 * Modale de paramétrage des tables à exclure
 * Une fenêtre de dialogue : titre, interrupteur, touches à bascule par table.
 * Échap ou le fond la ferment ; le focus y entre à l'ouverture et revient
 * au bouton d'origine à la fermeture.
 *
 * Ce qui s'affiche est ce qui s'applique : une table n'est barrée que si elle est
 * réellement retirée des jeux (interrupteur allumé). Toucher une table quand
 * l'interrupteur est coupé l'allume et retire cette table.
 */

import { TablePreferences } from '../core/tablePreferences.js';
import { UserManager } from '../userManager.js';
import { getTranslation } from '../utils-es6.js';
import { createSafeElement } from '../security-utils.js';
import { singleActivation } from '../ui-feedback.js';
import eventBus from '../core/eventBus.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const TITLE_ID = 'table-settings-title';
const FOCUSABLE_SELECTOR = 'button:not([disabled]), input:not([disabled])';

/**
 * Icône « fermer » dessinée (deux traits), masquée aux lecteurs d'écran :
 * le bouton porte son nom accessible.
 * @returns {SVGSVGElement}
 */
function createCloseIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M6 6l12 12M18 6L6 18');
  svg.appendChild(path);
  return svg;
}

export const TableSettingsModal = {
  modalElement: null,
  isOpen: false,
  returnFocusTo: null,
  keydownListener: null,

  /**
   * Ouvrir la modale
   */
  open() {
    if (this.isOpen) return;

    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) {
      console.warn("⚠️ Pas d'utilisateur connecté");
      return;
    }

    this.create();
    this.show();
    this.loadCurrentState();
  },

  /**
   * Créer la modale
   */
  create() {
    if (this.modalElement) {
      return; // Déjà créée
    }

    const { modal, content } = this.buildModalShell();
    content.appendChild(this.buildHeaderSection());
    content.appendChild(this.buildDescriptionSection());
    content.appendChild(this.buildToggleSection());
    content.appendChild(this.buildTablesGrid());
    content.appendChild(this.buildStatusSection());
    document.body.appendChild(modal);

    this.modalElement = modal;
  },

  /**
   * Crée la structure de base de la modale (conteneur + overlay + contenu)
   * @returns {{modal: HTMLElement, content: HTMLElement}}
   */
  buildModalShell() {
    const modal = createSafeElement('div', '', {
      class: 'table-settings-modal',
      id: 'table-settings-modal',
    });

    const overlay = createSafeElement('div', '', {
      class: 'modal-overlay',
    });
    overlay.addEventListener('click', () => this.close());

    const content = createSafeElement('div', '', {
      class: 'modal-content',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': TITLE_ID,
    });

    modal.appendChild(overlay);
    modal.appendChild(content);

    return { modal, content };
  },

  /**
   * Construit l'entête de la modale
   * @returns {HTMLElement}
   */
  buildHeaderSection() {
    const header = createSafeElement('div', '', {
      class: 'modal-header',
    });

    const title = createSafeElement('h2', '', {
      class: 'modal-title',
      id: TITLE_ID,
    });
    title.dataset.translate = 'table_settings_title';
    title.textContent = getTranslation('table_settings_title');

    const closeBtn = createSafeElement('button', '', {
      type: 'button',
      class: 'modal-close-btn',
    });
    closeBtn.dataset.translateAriaLabel = 'close_button';
    closeBtn.setAttribute('aria-label', getTranslation('close_button'));
    closeBtn.appendChild(createCloseIcon());
    closeBtn.addEventListener('click', () => this.close());

    header.appendChild(title);
    header.appendChild(closeBtn);

    return header;
  },

  /**
   * Construit la description introductive de la modale
   * @returns {HTMLElement}
   */
  buildDescriptionSection() {
    const description = createSafeElement('p', '', {
      class: 'modal-description',
    });
    description.dataset.translate = 'table_settings_description';
    description.textContent = getTranslation('table_settings_description');
    return description;
  },

  /**
   * Construit le bloc de bascule (toggle) principal.
   * Le libellé visible nomme la case (pas d'aria-label figé en français).
   * @returns {HTMLElement}
   */
  buildToggleSection() {
    const toggleContainer = createSafeElement('div', '', {
      class: 'toggle-container',
    });

    const toggleLabel = createSafeElement('label', '', {
      class: 'toggle-label',
    });

    const toggleInput = createSafeElement('input', '', {
      type: 'checkbox',
      id: 'global-exclusion-toggle',
      class: 'toggle-input',
      role: 'switch',
    });
    toggleInput.addEventListener('change', e => this.handleToggleChange(e.target.checked));

    const toggleText = createSafeElement('span', '', {
      class: 'toggle-text',
    });
    toggleText.dataset.translate = 'global_exclusion_enable';
    toggleText.textContent = getTranslation('global_exclusion_enable');

    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(toggleText);
    toggleContainer.appendChild(toggleLabel);
    return toggleContainer;
  },

  /**
   * Crée la grille de boutons pour sélectionner les tables
   * @returns {HTMLElement}
   */
  buildTablesGrid() {
    const gridContainer = createSafeElement('div', '', {
      class: 'tables-grid',
      id: 'tables-grid',
      role: 'group',
      'aria-labelledby': TITLE_ID,
    });

    for (let i = 1; i <= 10; i++) {
      const btn = createSafeElement('button', '', {
        type: 'button',
        class: 'table-btn',
      });
      btn.dataset.table = i;
      btn.textContent = i;
      btn.setAttribute('aria-label', `${getTranslation('table_label')} ${i}`);
      btn.setAttribute('aria-pressed', 'false');
      // Entrée déclenche deux clics (gestionnaires globaux) : la bascule s'annulait
      btn.addEventListener(
        'click',
        singleActivation(() => this.toggleTable(i))
      );
      gridContainer.appendChild(btn);
    }
    return gridContainer;
  },

  /**
   * Construit le bloc affichant les tables exclues
   * @returns {HTMLElement}
   */
  buildStatusSection() {
    const statusContainer = createSafeElement('p', '', {
      class: 'exclusion-status',
      id: 'exclusion-status',
      'aria-live': 'polite',
    });
    statusContainer.hidden = true;

    const statusLabel = createSafeElement('span', '');
    statusLabel.dataset.translate = 'excluded_tables_label';
    statusLabel.textContent = getTranslation('excluded_tables_label');

    const statusList = createSafeElement('strong', '', {
      id: 'excluded-tables-list',
      class: 'excluded-list',
    });

    statusContainer.appendChild(statusLabel);
    statusContainer.appendChild(document.createTextNode(' '));
    statusContainer.appendChild(statusList);
    return statusContainer;
  },

  /**
   * Éléments focalisables de la fenêtre, dans l'ordre
   * @returns {HTMLElement[]}
   */
  getFocusableElements() {
    const content = this.modalElement?.querySelector('.modal-content');
    return content ? Array.from(content.querySelectorAll(FOCUSABLE_SELECTOR)) : [];
  },

  /**
   * Clavier (écouté en phase de capture pendant que la fenêtre est ouverte) :
   * Échap ferme la fenêtre sans atteindre le raccourci global qui ramène au
   * choix du profil ; Tab reste dans la fenêtre.
   * @param {KeyboardEvent} e
   */
  handleKeydown(e) {
    if (!this.isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.close();
      return;
    }

    if (e.key !== 'Tab') return;
    const focusable = this.getFocusableElements();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  },

  /**
   * Afficher la modale
   */
  show() {
    if (this.modalElement) {
      this.returnFocusTo = document.activeElement;
      this.modalElement.classList.add('visible');
      this.isOpen = true;
      // Désactiver le scroll de la page
      document.body.style.overflow = 'hidden';
      if (!this.keydownListener) {
        this.keydownListener = e => this.handleKeydown(e);
      }
      document.addEventListener('keydown', this.keydownListener, true);
      // Le focus entre dans la fenêtre (le bouton Fermer, premier élément)
      this.getFocusableElements()[0]?.focus({ preventScroll: true });
    }
  },

  /**
   * Fermer la modale
   */
  close() {
    if (this.modalElement) {
      this.modalElement.classList.remove('visible');
      this.isOpen = false;
      if (this.keydownListener) {
        document.removeEventListener('keydown', this.keydownListener, true);
      }
      // Réactiver le scroll de la page
      document.body.style.overflow = '';
      // Rendre le focus au bouton qui a ouvert la fenêtre
      if (this.returnFocusTo && document.contains(this.returnFocusTo)) {
        this.returnFocusTo.focus({ preventScroll: true });
      }
      this.returnFocusTo = null;
    }
  },

  /**
   * Charger l'état actuel depuis les données utilisateur
   */
  loadCurrentState() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    // Mettre à jour le toggle
    const toggleInput = document.getElementById('global-exclusion-toggle');
    if (toggleInput) {
      toggleInput.checked = TablePreferences.isGlobalEnabled(currentUser);
    }

    // Mettre à jour les boutons de tables et l'indicateur
    this.renderTables();
    this.updateStatusDisplay();
  },

  /**
   * Touches des tables : barrée et enfoncée (aria-pressed) seulement si la table est
   * réellement retirée des jeux. Interrupteur coupé : aucune table n'est retirée, la
   * sélection enregistrée revient quand on le rallume.
   */
  renderTables() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser || !this.modalElement) return;

    const enabled = TablePreferences.isGlobalEnabled(currentUser);
    const exclusions = new Set(enabled ? TablePreferences.getGlobalExclusions(currentUser) : []);

    this.modalElement.querySelectorAll('.table-btn').forEach(btn => {
      const isExcluded = exclusions.has(Number(btn.dataset.table));
      btn.classList.toggle('excluded', isExcluded);
      btn.setAttribute('aria-pressed', String(isExcluded));
    });
  },

  /**
   * Gérer le changement du toggle
   */
  handleToggleChange(enabled) {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    TablePreferences.setGlobalEnabled(currentUser, enabled);
    this.renderTables();
    this.updateStatusDisplay();
    eventBus.emit('tablePreferences:changed');
  },

  /**
   * Basculer l'exclusion d'une table. Interrupteur coupé : aucune table n'était
   * barrée, donc la sélection repart de cette seule table et l'interrupteur s'allume.
   */
  toggleTable(table) {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    const wasEnabled = TablePreferences.isGlobalEnabled(currentUser);
    const exclusions = new Set(wasEnabled ? TablePreferences.getGlobalExclusions(currentUser) : []);

    if (exclusions.has(table)) {
      exclusions.delete(table);
    } else {
      exclusions.add(table);
    }

    // Sauvegarder
    const updated = Array.from(exclusions).sort((a, b) => a - b);
    TablePreferences.setGlobalExclusions(currentUser, updated);

    if (!wasEnabled) {
      TablePreferences.setGlobalEnabled(currentUser, true);
      const toggleInput = document.getElementById('global-exclusion-toggle');
      if (toggleInput) toggleInput.checked = true;
    }

    // Mettre à jour l'UI
    this.renderTables();
    this.updateStatusDisplay();
    eventBus.emit('tablePreferences:changed');
  },

  /**
   * Mettre à jour l'indicateur d'état
   */
  updateStatusDisplay() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    const statusContainer = document.getElementById('exclusion-status');
    const statusList = document.getElementById('excluded-tables-list');
    const enabled = TablePreferences.isGlobalEnabled(currentUser);
    const exclusions = TablePreferences.getGlobalExclusions(currentUser);

    if (statusContainer && statusList) {
      if (enabled && exclusions.length > 0) {
        statusList.textContent = [...exclusions].sort((a, b) => a - b).join(', ');
        statusContainer.hidden = false;
      } else {
        statusContainer.hidden = true;
      }
    }
  },
};

export default TableSettingsModal;

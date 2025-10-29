/**
 * Modale de paramétrage des tables à exclure
 * Interface moderne et ludique pour enfants 8-12 ans
 */

import { TablePreferences } from '../core/tablePreferences.js';
import { UserManager } from '../userManager.js';
import { getTranslation } from '../utils-es6.js';
import { createSafeElement } from '../security-utils.js';
import eventBus from '../core/eventBus.js';

export const TableSettingsModal = {
  modalElement: null,
  isOpen: false,

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
    });
    title.textContent = '⚙️ ';

    const titleText = createSafeElement('span', '');
    titleText.dataset.translate = 'table_settings_title';
    titleText.textContent = getTranslation('table_settings_title') || 'Paramètres des tables';

    const closeBtn = createSafeElement('button', '', {
      class: 'modal-close-btn',
    });
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Fermer');
    closeBtn.addEventListener('click', () => this.close());

    title.appendChild(titleText);
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
    description.textContent =
      getTranslation('table_settings_description') ||
      'Choisis les tables à exclure de tes jeux (sauf Découverte et Aventure) :';
    return description;
  },

  /**
   * Construit le bloc de bascule (toggle) principal
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
    });
    toggleInput.setAttribute('aria-label', "Activer l'exclusion globale");
    toggleInput.addEventListener('change', e => this.handleToggleChange(e.target.checked));

    const toggleSlider = createSafeElement('span', '', {
      class: 'toggle-slider',
    });

    const toggleText = createSafeElement('span', '', {
      class: 'toggle-text',
    });
    toggleText.dataset.translate = 'global_exclusion_enable';
    toggleText.textContent =
      getTranslation('global_exclusion_enable') || "Activer l'exclusion globale";

    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(toggleSlider);
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
    });

    for (let i = 1; i <= 10; i++) {
      const btn = createSafeElement('button', '', {
        class: 'table-btn',
      });
      btn.dataset.table = i;
      btn.textContent = i;
      btn.setAttribute('aria-label', `Table ${i}`);
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => this.toggleTable(i));
      gridContainer.appendChild(btn);
    }
    return gridContainer;
  },

  /**
   * Construit le bloc affichant les tables exclues
   * @returns {HTMLElement}
   */
  buildStatusSection() {
    const statusContainer = createSafeElement('div', '', {
      class: 'exclusion-status',
      id: 'exclusion-status',
    });
    statusContainer.style.display = 'none';

    const statusLabel = createSafeElement('span', '');
    statusLabel.dataset.translate = 'excluded_tables_label';
    statusLabel.textContent = getTranslation('excluded_tables_label') || 'Tables exclues :';

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
   * Afficher la modale
   */
  show() {
    if (this.modalElement) {
      this.modalElement.classList.add('visible');
      this.isOpen = true;
      // Désactiver le scroll de la page
      document.body.style.overflow = 'hidden';
    }
  },

  /**
   * Fermer la modale
   */
  close() {
    if (this.modalElement) {
      this.modalElement.classList.remove('visible');
      this.isOpen = false;
      // Réactiver le scroll de la page
      document.body.style.overflow = '';
    }
  },

  /**
   * Charger l'état actuel depuis les données utilisateur
   */
  loadCurrentState() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    const exclusions = new Set(TablePreferences.getGlobalExclusions(currentUser));
    const enabled = TablePreferences.isGlobalEnabled(currentUser);

    // Mettre à jour le toggle
    const toggleInput = document.getElementById('global-exclusion-toggle');
    if (toggleInput) {
      toggleInput.checked = enabled;
    }

    // Mettre à jour les boutons de tables
    for (let i = 1; i <= 10; i++) {
      const btn = document.querySelector(`.table-btn[data-table="${i}"]`);
      if (btn) {
        if (exclusions.has(i)) {
          btn.classList.add('excluded');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.classList.remove('excluded');
          btn.setAttribute('aria-pressed', 'false');
        }
      }
    }

    // Mettre à jour l'indicateur
    this.updateStatusDisplay();
  },

  /**
   * Gérer le changement du toggle
   */
  handleToggleChange(enabled) {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    TablePreferences.setGlobalEnabled(currentUser, enabled);
    this.updateStatusDisplay();
    eventBus.emit('tablePreferences:changed');
  },

  /**
   * Basculer l'exclusion d'une table
   */
  toggleTable(table) {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    const exclusions = new Set(TablePreferences.getGlobalExclusions(currentUser));
    let isExcluded;

    if (exclusions.has(table)) {
      // Retirer l'exclusion
      exclusions.delete(table);
      isExcluded = false;
    } else {
      // Ajouter l'exclusion
      exclusions.add(table);
      isExcluded = true;
    }

    // Sauvegarder
    const updated = Array.from(exclusions).sort((a, b) => a - b);
    TablePreferences.setGlobalExclusions(currentUser, updated);

    // Mettre à jour l'UI
    const btn = document.querySelector(`.table-btn[data-table="${table}"]`);
    if (btn) {
      btn.classList.toggle('excluded', isExcluded);
      btn.setAttribute('aria-pressed', String(isExcluded));
    }

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
        statusContainer.style.display = 'block';
      } else {
        statusContainer.style.display = 'none';
      }
    }
  },
};

export default TableSettingsModal;

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

    // Container principal
    const modal = createSafeElement('div', '', {
      class: 'table-settings-modal',
      id: 'table-settings-modal',
    });

    // Overlay (fond sombre)
    const overlay = createSafeElement('div', '', {
      class: 'modal-overlay',
    });
    overlay.addEventListener('click', () => this.close());
    modal.appendChild(overlay);

    // Contenu de la modale
    const content = createSafeElement('div', '', {
      class: 'modal-content',
    });

    // En-tête
    const header = createSafeElement('div', '', {
      class: 'modal-header',
    });

    const title = createSafeElement('h2', '', {
      class: 'modal-title',
    });
    title.textContent = '⚙️ ';
    const titleText = createSafeElement('span', '');
    titleText.setAttribute('data-translate', 'table_settings_title');
    titleText.textContent = getTranslation('table_settings_title') || 'Paramètres des tables';
    title.appendChild(titleText);

    const closeBtn = createSafeElement('button', '', {
      class: 'modal-close-btn',
    });
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Fermer');
    closeBtn.addEventListener('click', () => this.close());

    header.appendChild(title);
    header.appendChild(closeBtn);
    content.appendChild(header);

    // Description
    const description = createSafeElement('p', '', {
      class: 'modal-description',
    });
    description.setAttribute('data-translate', 'table_settings_description');
    description.textContent =
      getTranslation('table_settings_description') ||
      'Choisis les tables à exclure de tes jeux (sauf Découverte et Aventure) :';
    content.appendChild(description);

    // Toggle principal
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
    toggleText.setAttribute('data-translate', 'global_exclusion_enable');
    toggleText.textContent =
      getTranslation('global_exclusion_enable') || "Activer l'exclusion globale";

    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(toggleSlider);
    toggleLabel.appendChild(toggleText);
    toggleContainer.appendChild(toggleLabel);
    content.appendChild(toggleContainer);

    // Grille de sélection des tables
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
    content.appendChild(gridContainer);

    // Indicateur des tables exclues
    const statusContainer = createSafeElement('div', '', {
      class: 'exclusion-status',
      id: 'exclusion-status',
    });
    statusContainer.style.display = 'none';

    const statusLabel = createSafeElement('span', '');
    statusLabel.setAttribute('data-translate', 'excluded_tables_label');
    statusLabel.textContent = getTranslation('excluded_tables_label') || 'Tables exclues :';

    const statusList = createSafeElement('strong', '', {
      id: 'excluded-tables-list',
      class: 'excluded-list',
    });

    statusContainer.appendChild(statusLabel);
    statusContainer.appendChild(document.createTextNode(' '));
    statusContainer.appendChild(statusList);
    content.appendChild(statusContainer);

    modal.appendChild(content);
    document.body.appendChild(modal);

    this.modalElement = modal;
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

    const exclusions = [...TablePreferences.getGlobalExclusions(currentUser)];
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
        if (exclusions.includes(i)) {
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

    const exclusions = [...TablePreferences.getGlobalExclusions(currentUser)];
    const idx = exclusions.indexOf(table);

    if (idx >= 0) {
      // Retirer l'exclusion
      exclusions.splice(idx, 1);
    } else {
      // Ajouter l'exclusion
      exclusions.push(table);
    }

    // Sauvegarder
    TablePreferences.setGlobalExclusions(currentUser, exclusions);

    // Mettre à jour l'UI
    const btn = document.querySelector(`.table-btn[data-table="${table}"]`);
    if (btn) {
      btn.classList.toggle('excluded');
      btn.setAttribute('aria-pressed', idx >= 0 ? 'false' : 'true');
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

/**
 * Composant de sélection d'opération arithmétique
 * Permet à l'utilisateur de choisir entre ×, +, −, ÷
 */

import { getTranslation } from '../utils-es6.js';
import { UserState } from '../core/userState.js';
import { createSafeElement } from '../security-utils.js';

export class OperationSelector {
  /**
   * Injecte le sélecteur d'opération dans un conteneur
   * @param {string} containerId - ID du conteneur DOM
   */
  static inject(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`[OperationSelector] Conteneur #${containerId} non trouvé`);
      return;
    }

    const userData = UserState.getCurrentUserData();
    const currentOp = userData.preferredOperator || '×';

    // Conteneur principal
    const wrapper = document.createElement('div');
    wrapper.className = 'operation-selector-wrapper';
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', getTranslation('operation_selector_title'));

    // Titre
    const title = createSafeElement('h3', getTranslation('operation_selector_title'));
    wrapper.appendChild(title);

    // Conteneur des boutons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'operation-selector-buttons';

    // Opérations disponibles (R1-R3: ×, +, −, ÷)
    const operations = [
      { symbol: '×', key: 'operation_multiplication', enabled: true },
      { symbol: '+', key: 'operation_addition', enabled: true },
      { symbol: '−', key: 'operation_subtraction', enabled: true },
      { symbol: '÷', key: 'operation_division', enabled: true }, // R3: Division activée
    ];

    operations.forEach(op => {
      const btn = document.createElement('button');
      btn.className = `btn operation-btn ${currentOp === op.symbol ? 'active' : ''}`;
      btn.textContent = getTranslation(op.key);
      btn.dataset.operator = op.symbol;
      btn.disabled = !op.enabled;
      btn.setAttribute('aria-label', getTranslation(op.key));
      btn.setAttribute('aria-pressed', currentOp === op.symbol ? 'true' : 'false');

      if (op.enabled) {
        btn.addEventListener('click', () => {
          OperationSelector.selectOperation(op.symbol);

          // Mettre à jour visuellement tous les boutons
          buttonsContainer.querySelectorAll('.operation-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        });
      } else {
        btn.title = getTranslation('operation_division_coming_soon');
        btn.style.cursor = 'not-allowed';
      }

      buttonsContainer.appendChild(btn);
    });

    wrapper.appendChild(buttonsContainer);
    container.appendChild(wrapper);

    console.log(`✓ Sélecteur d'opération injecté (opération actuelle: ${currentOp})`);
  }

  /**
   * Sélectionne une opération et la sauvegarde dans UserState
   * @param {string} operator - Symbole de l'opération (×, +, −, ÷)
   */
  static selectOperation(operator) {
    const userData = UserState.getCurrentUserData();
    const oldOperator = userData.preferredOperator || '×';

    userData.preferredOperator = operator;
    UserState.updateUserData(userData);

    console.log(`✓ Opération changée: ${oldOperator} → ${operator}`);

    // Déclencher événement personnalisé pour réactivité
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(
        new CustomEvent('operation-changed', {
          detail: { operator, oldOperator },
        })
      );
    }
  }

  /**
   * Obtient l'opération actuellement sélectionnée
   * @returns {string} Symbole de l'opération (×, +, −, ÷)
   */
  static getCurrentOperation() {
    const userData = UserState.getCurrentUserData();
    return userData.preferredOperator || '×';
  }

  /**
   * Rafraîchit l'affichage du sélecteur (utile après changement de langue)
   * @param {string} containerId - ID du conteneur
   */
  static refresh(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Vider et réinjecter
    // eslint-disable-next-line no-restricted-properties -- Safe: clearing with empty string
    container.innerHTML = '';
    OperationSelector.inject(containerId);
  }
}

// Export par défaut
export default OperationSelector;

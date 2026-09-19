/**
 * Composant de sélection d'opération arithmétique
 * Contrôle segmenté compact : ×, +, −, ÷ (icône + libellé), une seule option active.
 */

import { getTranslation } from '../utils-es6.js';
import { UserState } from '../core/userState.js';
import { createSafeElement } from '../security-utils.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// Opérations disponibles (R1-R3 : ×, +, −, ÷)
const OPERATIONS = [
  { symbol: '×', key: 'operation_multiplication', image: 'multiplication', enabled: true },
  { symbol: '+', key: 'operation_addition', image: 'addition', enabled: true },
  { symbol: '−', key: 'operation_subtraction', image: 'soustraction', enabled: true },
  { symbol: '÷', key: 'operation_division', image: 'division', enabled: true },
];

function translateOr(key, fallback) {
  const value = getTranslation(key);
  return typeof value === 'string' && !/^\[.*\]$/.test(value) ? value : fallback;
}

// Coche de l'option active : la sélection ne repose pas sur la seule couleur
function createCheckIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'operation-check');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const mark = document.createElementNS(SVG_NS, 'polyline');
  mark.setAttribute('points', '4 12.5 9.5 18 20 6.5');
  mark.setAttribute('fill', 'none');
  mark.setAttribute('stroke', 'currentColor');
  mark.setAttribute('stroke-width', '3');
  mark.setAttribute('stroke-linecap', 'round');
  mark.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(mark);
  return svg;
}

function createOperationIcon(op) {
  const icon = document.createElement('img');
  icon.src = `assets/images/operators/${op.image}-64.webp`;
  icon.srcset = [
    `assets/images/operators/${op.image}-32.webp 32w`,
    `assets/images/operators/${op.image}-64.webp 64w`,
    `assets/images/operators/${op.image}-128.webp 128w`,
  ].join(', ');
  icon.sizes = '32px';
  // Le libellé visible nomme déjà le bouton
  icon.alt = '';
  icon.className = 'operation-icon';
  icon.width = 32;
  icon.height = 32;
  return icon;
}

function markActive(buttonsContainer, activeButton) {
  buttonsContainer.querySelectorAll('.operation-btn').forEach(b => {
    const isActive = b === activeButton;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

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
    const labelId = `${containerId}-label`;

    // Groupe de boutons bascule, nommé par son libellé visible
    const wrapper = document.createElement('div');
    wrapper.className = 'operation-selector';
    wrapper.setAttribute('role', 'group');
    wrapper.setAttribute('aria-labelledby', labelId);

    const title = createSafeElement(
      'p',
      translateOr('select_operation', getTranslation('operation_selector_title')),
      { id: labelId, class: 'operation-selector-label' }
    );
    wrapper.appendChild(title);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'operation-selector-buttons';

    OPERATIONS.forEach(op => {
      const isActive = currentOp === op.symbol;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `operation-btn${isActive ? ' active' : ''}`;
      btn.dataset.operator = op.symbol;
      btn.disabled = !op.enabled;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');

      btn.appendChild(createOperationIcon(op));

      const label = document.createElement('span');
      label.textContent = getTranslation(op.key);
      label.className = 'operation-label';
      btn.appendChild(label);

      btn.appendChild(createCheckIcon());

      if (op.enabled) {
        btn.addEventListener('click', () => {
          OperationSelector.selectOperation(op.symbol);
          markActive(buttonsContainer, btn);
        });
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
    if (globalThis.window !== undefined) {
      globalThis.dispatchEvent?.(
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

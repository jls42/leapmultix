// ES module: Virtual Keyboard helper extracted from main.js
import { getTranslation, addArrowKeyNavigation } from './utils-es6.js';

export function createVirtualKeyboard(inputElement, container) {
  const keyboardId = `virtual-keyboard-${inputElement.id}`;
  let keyboardContainer = document.getElementById(keyboardId);

  if (!keyboardContainer) {
    keyboardContainer = document.createElement('div');
    keyboardContainer.id = keyboardId;
    keyboardContainer.className = 'virtual-keyboard';
    container.appendChild(keyboardContainer);
  } else {
    while (keyboardContainer.firstChild)
      keyboardContainer.removeChild(keyboardContainer.firstChild);
  }

  const rows = [
    ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
    ['W', 'X', 'C', 'V', 'B', 'N', '⌫'],
  ];

  rows.forEach(row => {
    const rowElement = document.createElement('div');
    rowElement.className = 'keyboard-row';

    row.forEach(key => {
      const keyButton = document.createElement('button');
      keyButton.className = 'keyboard-key';
      keyButton.textContent = key;
      keyButton.addEventListener('click', () => {
        if (key === '⌫') {
          inputElement.value = inputElement.value.slice(0, -1);
        } else {
          inputElement.value += key;
        }
        inputElement.focus();
      });
      rowElement.appendChild(keyButton);
    });

    keyboardContainer.appendChild(rowElement);
  });

  const spaceRow = document.createElement('div');
  spaceRow.className = 'keyboard-row';
  const spaceKey = document.createElement('button');
  spaceKey.className = 'keyboard-key keyboard-space';
  spaceKey.textContent = getTranslation('virtual_keyboard_space');
  spaceKey.addEventListener('click', () => {
    inputElement.value += ' ';
    inputElement.focus();
  });
  spaceRow.appendChild(spaceKey);
  keyboardContainer.appendChild(spaceRow);

  addArrowKeyNavigation(keyboardContainer, '.keyboard-key');

  return keyboardContainer;
}

// Backward-compat global for legacy code
// ESM-only usage; no window bridge

export default createVirtualKeyboard;

// Script de la page d'écoute, inséré tel quel par scripts/voice/listen-page.mjs : cases
// « à refaire », liste à copier, un seul clip joué à la fois. Les cases cochées sont gardées
// dans le stockage du navigateur, chacune repérée par l'empreinte du clip et le début de son
// sha256 : un clip refait depuis n'est plus coché.
(() => {
  const panel = document.getElementById('redo-panel');
  const list = document.getElementById('redo-list');
  const count = document.getElementById('redo-count');
  const status = document.getElementById('redo-status');
  const boxes = [...document.querySelectorAll('.redo-box')];
  const { store, one, many } = panel.dataset;
  const identity = box => `${box.value}@${box.dataset.sha}`;

  /** Cases cochées à la dernière ouverture ; aucune si le stockage est illisible */
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(store) ?? '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      return new Set();
    }
  }

  /** Garde les cases cochées ; false si le navigateur refuse le stockage */
  function save(ids) {
    try {
      localStorage.setItem(store, JSON.stringify(ids));
      return true;
    } catch {
      return false;
    }
  }

  function render() {
    const checked = boxes.filter(box => box.checked);
    list.value = checked.map(box => box.value).join('\n');
    count.textContent = `${checked.length} ${checked.length > 1 ? many : one}`;
    for (const box of boxes) box.closest('.card').classList.toggle('checked', box.checked);
    if (!save(checked.map(identity))) {
      status.textContent = 'Stockage refusé : les cases ne seront pas gardées.';
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(list.value);
      status.textContent = 'Liste copiée.';
    } catch {
      list.select();
      status.textContent = 'Copie refusée : la liste est sélectionnée, Ctrl+C pour la copier.';
    }
  }

  const saved = load();
  for (const box of boxes) {
    box.checked = saved.has(identity(box));
    box.addEventListener('change', render);
  }
  document.getElementById('redo-copy').addEventListener('click', copy);
  // Un seul clip à la fois : en lancer un arrête les autres
  document.addEventListener(
    'play',
    event => {
      for (const audio of document.querySelectorAll('audio')) {
        if (audio !== event.target) audio.pause();
      }
    },
    true
  );
  render();
})();

// Script de la page d'un banc d'écoute (bench-page.mjs), inséré dans la page.
// - Lecture : un clip, une voix entière (« Tout écouter ») ou une phrase par toutes les voix
//   (« Toutes »), l'un après l'autre ; « Stop » arrête tout.
// - Choix du propriétaire : chaque réponse est gardée dans le stockage partagé de l'artifact
//   (document data-doc du formulaire), que Claude relit ; hors artifact, ou s'il est
//   indisponible, dans ce navigateur seulement (data-store).
(() => {
  const audio = new Audio();
  audio.preload = 'none';
  const bar = document.getElementById('player-bar');
  const now = document.getElementById('now');
  let queue = [];
  let current = null;

  const mark = (button, on) => button?.classList.toggle('playing', on);

  function play(button) {
    mark(current, false);
    current = button;
    mark(current, true);
    audio.src = button.dataset.src;
    now.textContent = button.dataset.label;
    bar.hidden = false;
    Promise.resolve(audio.play()).catch(() => {
      now.textContent = 'Lecture refusée : touchez à nouveau le bouton';
    });
  }

  function stop() {
    queue = [];
    audio.pause();
    mark(current, false);
    current = null;
    bar.hidden = true;
  }

  function start(buttons) {
    queue = buttons;
    const first = queue.shift();
    if (first) play(first);
  }

  audio.addEventListener('ended', () => {
    const next = queue.shift();
    if (next) play(next);
    else stop();
  });
  document.getElementById('stop').addEventListener('click', stop);

  const rows = [...document.querySelectorAll('.item')];
  const plays = selector => [...document.querySelectorAll(selector)];
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.classList.contains('play')) start([button]);
    if (button.classList.contains('every')) {
      start([...rows[Number(button.dataset.row)].querySelectorAll('button.play')]);
    }
    if (button.classList.contains('all')) {
      start(plays(`button.play[data-voice="${button.dataset.voice}"]`));
    }
  });

  const form = document.getElementById('choice');
  const status = document.getElementById('status');
  const note = document.getElementById('remarque');
  const questions = [...form.querySelectorAll('fieldset[data-question]')].map(
    fieldset => fieldset.dataset.question
  );
  let db = null;
  let chain = Promise.resolve();
  let timer = null;

  const picked = name => form.querySelector(`input[name="${name}"]:checked`)?.value ?? null;

  function value() {
    const answers = Object.fromEntries(questions.map(id => [id, picked(`q-${id}`)]));
    return { voice: picked('pick'), answers, comment: note.value.trim() };
  }

  function tick(name, wanted) {
    for (const input of form.querySelectorAll(`input[name="${name}"]`)) {
      input.checked = input.value === wanted;
    }
  }

  function apply(data) {
    if (!data || typeof data !== 'object') return;
    tick('pick', data.voice);
    const answers = new Map(Object.entries(data.answers ?? {}));
    for (const id of questions) tick(`q-${id}`, answers.get(id));
    if (typeof data.comment === 'string') note.value = data.comment;
  }

  function keepHere(data) {
    try {
      localStorage.setItem(form.dataset.store, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  function save() {
    const data = value();
    const kept = keepHere(data);
    if (!db) {
      status.textContent = kept ? 'Gardé dans ce navigateur seulement.' : 'Non gardé.';
      return;
    }
    status.textContent = 'Enregistrement…';
    chain = chain
      .then(() => db.doc(form.dataset.doc).set({ ...data, updatedAt: new Date().toISOString() }))
      .then(() => {
        status.textContent = 'Enregistré : Claude le lira.';
      })
      .catch(() => {
        status.textContent = 'Non enregistré en ligne : gardé dans ce navigateur seulement.';
      });
  }

  try {
    apply(JSON.parse(localStorage.getItem(form.dataset.store) || 'null'));
  } catch {
    // Stockage du navigateur indisponible : la page marche sans
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('change', event => {
    if (event.target.type === 'radio') save();
  });
  note.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(save, 700);
  });

  const unavailable = () => {
    status.textContent = 'Stockage partagé indisponible : choix gardé dans ce navigateur.';
  };
  const claude = window.claude;
  if (claude && typeof claude.use === 'function') {
    claude
      .use('db')
      .then(found => {
        if (!found) return unavailable();
        db = found;
        return db
          .doc(form.dataset.doc)
          .get()
          .then(snap => {
            if (snap.exists) apply(snap.data());
            status.textContent = 'Choix partagé avec Claude.';
          });
      })
      .catch(unavailable);
  }
})();

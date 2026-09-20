import { getTranslation } from './utils-es6.js';

/**
 * Module de Gestion des Vidéos de Personnages
 * Gère la lecture des vidéos d'introduction des avatars
 * Phase 4.1 - Système vidéo immersif
 */

// Durée de l'ouverture et de la fermeture : suit le jeton --dur-base (css/themes.css)
const MODAL_TRANSITION_MS = 200;
// Juste après l'ouverture, un clic (ou un appui) ne ferme pas la vidéo : c'est le second
// clic d'un double-clic sur « Créer », ou une touche restée enfoncée
const OPEN_GUARD_MS = 600;
const SVG_NS = 'http://www.w3.org/2000/svg';
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])';

/**
 * L'utilisateur a demandé moins d'animations (réglage du système).
 * @returns {boolean}
 */
function prefersReducedMotion() {
  try {
    return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
  } catch {
    return false;
  }
}

function now() {
  return globalThis.performance?.now?.() ?? Date.now();
}

/**
 * Traduction avec texte de repli tant que la clé manque (getTranslation renvoie « [clé] »).
 * @param {string} key - Clé de traduction
 * @param {string} fallback - Texte affiché si la clé est absente
 * @returns {string}
 */
function translateOr(key, fallback) {
  const value = typeof getTranslation === 'function' ? getTranslation(key) : '';
  if (typeof value !== 'string' || !value || /^\[[^\]]+\]$/.test(value)) return fallback;
  return value;
}

/**
 * Crée une icône SVG décorative dessinée à la couleur du texte (currentColor).
 * @param {{d: string, filled?: boolean}[]} shapes - Tracés de l'icône (grille 24 × 24)
 * @returns {SVGSVGElement}
 */
function createIcon(shapes) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  for (const { d, filled } of shapes) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', filled ? 'currentColor' : 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
  }
  return svg;
}

/**
 * Élément à focaliser pour garder la tabulation dans la fenêtre : le premier ou
 * le dernier selon le sens, rien si le focus reste à l'intérieur.
 * @param {Element} container
 * @param {Element[]} focusables
 * @param {boolean} versLArriere - Tabulation avec Maj
 * @returns {Element|null}
 */
function nextTrappedFocus(container, focusables, versLArriere) {
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;
  if (!container.contains(active)) return versLArriere ? last : first;
  if (versLArriere && active === first) return last;
  if (!versLArriere && active === last) return first;
  return null;
}

export const VideoManager = {
  // Configuration des vidéos par avatar
  CHARACTER_VIDEOS: new Map([
    [
      'fox',
      {
        base: 'renard_intro_vid',
      },
    ],
    [
      'panda',
      {
        base: 'panda_intro_vid',
      },
    ],
    [
      'unicorn',
      {
        base: 'licorne_intro_vide',
      },
    ],
    [
      'dragon',
      {
        base: 'dragon_intro_vid',
      },
    ],
    [
      'astronaut',
      {
        base: 'astronaut_intro_vid',
      },
    ],
  ]),

  // État interne
  _currentVideo: null,
  _modal: null,
  _skipCallback: null,
  _isMobile: false,
  _supportsWebm: false,
  _isLowPower: false,
  _sourceQueue: [],
  _currentSourceIndex: 0,
  _currentAvatar: null,
  _readyHandler: null,
  _readyTimeout: null,
  _hideTimeout: null,
  _returnFocusTo: null,
  _openedAt: 0,
  _autoplay: true,
  _inertTargets: [],
  _keyListenerReady: false,

  /**
   * Initialiser le gestionnaire vidéo
   */
  init() {
    this.detectDevice();
    this.detectPerformanceProfile();
    this._supportsWebm = this.detectWebmSupport();
    this.createVideoModal();
    this.setupEventListeners();
  },

  /**
   * Détecter si l'appareil est mobile pour optimiser
   */
  detectDevice() {
    this._isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      globalThis.navigator?.userAgent || ''
    );

    // Détecter aussi la connexion lente
    if (globalThis.navigator && globalThis.navigator.connection) {
      const slowConnection = ['slow-2g', '2g', '3g'].includes(
        globalThis.navigator.connection.effectiveType
      );
      this._isMobile = this._isMobile || slowConnection;
    }
  },

  detectPerformanceProfile() {
    const concurrency = globalThis.navigator?.hardwareConcurrency || 4;
    const deviceMemory = globalThis.navigator?.deviceMemory || 4;
    this._isLowPower = concurrency <= 4 || deviceMemory <= 4;
  },

  detectWebmSupport() {
    const videoEl = document.createElement('video');
    if (!videoEl.canPlayType) return false;
    return videoEl.canPlayType('video/webm; codecs="vp9"') !== '';
  },

  /**
   * Créer la modal vidéo dans le DOM
   */
  createVideoModal() {
    // Éviter la duplication
    if (document.getElementById('character-intro-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'character-intro-modal';
    modal.className = 'video-modal';
    modal.style.display = 'none';

    const overlay = document.createElement('div');
    overlay.className = 'video-modal-overlay';
    modal.appendChild(overlay);

    // Le panneau est la fenêtre de dialogue ; la phrase du personnage lui sert de titre
    const container = document.createElement('div');
    container.className = 'video-container';
    container.setAttribute('role', 'dialog');
    container.setAttribute('aria-modal', 'true');
    container.setAttribute('aria-labelledby', 'video-welcome-message');
    modal.appendChild(container);

    const header = document.createElement('div');
    header.className = 'video-header';
    const welcome = document.createElement('p');
    welcome.className = 'video-welcome-message';
    welcome.id = 'video-welcome-message';
    header.appendChild(welcome);
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.id = 'video-close-btn';
    closeBtn.className = 'video-close-btn';
    const closeLabel = translateOr('close_video', 'Fermer la vidéo');
    closeBtn.setAttribute('data-translate-aria-label', 'close_video');
    closeBtn.setAttribute('aria-label', closeLabel);
    closeBtn.setAttribute('data-translate-title', 'close_video');
    closeBtn.title = closeLabel;
    closeBtn.appendChild(createIcon([{ d: 'M6 6l12 12M18 6 6 18' }]));
    header.appendChild(closeBtn);
    container.appendChild(header);

    const video = document.createElement('video');
    video.id = 'character-intro-video';
    video.autoplay = false;
    video.muted = true;
    video.preload = 'auto';
    video.playsInline = true;
    const source = document.createElement('source');
    source.id = 'video-source';
    source.src = '';
    source.type = 'video/mp4';
    video.appendChild(source);
    const fallbackP = document.createElement('p');
    fallbackP.setAttribute('data-translate', 'video_not_supported');
    fallbackP.textContent = translateOr(
      'video_not_supported',
      'Ton navigateur ne peut pas lire cette vidéo.'
    );
    video.appendChild(fallbackP);
    container.appendChild(video);

    const controls = document.createElement('div');
    controls.className = 'video-controls';
    // « Voir la vidéo » : proposé quand la vidéo ne démarre pas seule (moins d'animations)
    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.id = 'play-intro-btn';
    playBtn.className = 'btn play-intro-btn';
    playBtn.hidden = true;
    playBtn.appendChild(createIcon([{ d: 'M8 5.5v13l10-6.5z', filled: true }]));
    const playLabel = document.createElement('span');
    playLabel.setAttribute('data-translate', 'play_video');
    playLabel.textContent = translateOr('play_video', 'Voir la vidéo');
    playBtn.appendChild(playLabel);
    controls.appendChild(playBtn);
    // « Passer » : touche secondaire commune ; l'icône aide qui ne lit pas encore
    const skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.id = 'skip-intro-btn';
    skipBtn.className = 'btn btn-secondary skip-btn';
    const skipLabel = document.createElement('span');
    skipLabel.setAttribute('data-translate', 'skip_video');
    skipLabel.textContent = translateOr('skip_video', 'Passer');
    skipBtn.appendChild(skipLabel);
    skipBtn.appendChild(
      createIcon([{ d: 'M5 5.5v13l10-6.5z', filled: true }, { d: 'M19 5.5v13' }])
    );
    controls.appendChild(skipBtn);
    // Progression purement visuelle : le temps restant est écrit à côté
    const progress = document.createElement('div');
    progress.className = 'video-progress';
    progress.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('div');
    fill.id = 'video-progress-bar';
    fill.className = 'video-progress-fill';
    progress.appendChild(fill);
    controls.appendChild(progress);
    const info = document.createElement('div');
    info.className = 'video-info';
    const timer = document.createElement('span');
    timer.id = 'video-timer';
    timer.textContent = '0:05';
    info.appendChild(timer);
    controls.appendChild(info);
    container.appendChild(controls);

    document.body.appendChild(modal);
    this._modal = modal;
    this._currentVideo = video;
  },

  /**
   * Configurer les écouteurs d'événements
   */
  setupEventListeners() {
    const skipBtn = document.getElementById('skip-intro-btn');
    const closeBtn = document.getElementById('video-close-btn');
    const playBtn = document.getElementById('play-intro-btn');
    const overlay = this._modal.querySelector('.video-modal-overlay');

    // Passer, Fermer et le voile : jamais sur le second clic d'un double-clic
    // ni dans l'instant qui suit l'ouverture (voir isAccidentalClose)
    const closeOnPurpose = e => {
      if (this.isAccidentalClose(e)) return;
      this.skipVideo();
    };
    skipBtn.addEventListener('click', closeOnPurpose);
    closeBtn.addEventListener('click', closeOnPurpose);
    overlay.addEventListener('click', closeOnPurpose);
    playBtn?.addEventListener('click', () => this.startRequestedPlayback());

    // Échap ferme la vidéo, et seulement elle : capté avant tout le monde puis arrêté,
    // sinon le raccourci global « Échap = retour au choix du joueur » s'appliquerait aussi.
    // Tab et Maj+Tab restent dans la fenêtre (aria-modal) : on ne peut pas activer
    // un bouton caché derrière le voile. (Un seul écouteur, même si la fenêtre est recréée.)
    if (!this._keyListenerReady) {
      this._keyListenerReady = true;
      globalThis.addEventListener(
        'keydown',
        e => {
          if (!this.isOpen()) return;
          if (e.key === 'Tab') {
            this.keepFocusInside(e);
            return;
          }
          if (e.key !== 'Escape') return;
          e.preventDefault();
          e.stopPropagation();
          this.skipVideo();
        },
        true
      );
    }

    // Événements vidéo
    this._currentVideo.addEventListener('ended', () => this.onVideoEnded());
    this._currentVideo.addEventListener('error', () => this.onVideoError());
    this._currentVideo.addEventListener('loadstart', () => this.onVideoLoadStart());
    this._currentVideo.addEventListener('canplay', () => this.onVideoCanPlay());
    this._currentVideo.addEventListener('timeupdate', () => this.updateProgress());
  },

  /**
   * La fenêtre vidéo est affichée (ou en train de se fermer).
   * @returns {boolean}
   */
  isOpen() {
    return Boolean(this._modal) && this._modal.style.display !== 'none';
  },

  /**
   * Clic qui ne doit pas fermer la vidéo : le second clic d'un double-clic (celui qui
   * a ouvert la vidéo sur « Créer » ou « Revoir ma vidéo »), ou tout clic dans l'instant
   * qui suit l'ouverture (double appui au doigt, touche Entrée restée enfoncée).
   * @param {Event} e
   * @returns {boolean}
   */
  isAccidentalClose(e) {
    if (e && e.detail > 1) return true;
    return now() - this._openedAt < OPEN_GUARD_MS;
  },

  /**
   * Garde Tab et Maj+Tab dans la fenêtre : du dernier bouton on revient au premier.
   * @param {KeyboardEvent} e
   */
  keepFocusInside(e) {
    const container = this._modal.querySelector('.video-container') || this._modal;
    const focusables = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
      el => !el.disabled && !el.hidden && !el.closest('[hidden]')
    );
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }
    const target = nextTrappedFocus(container, focusables, e.shiftKey);
    if (!target) return;
    e.preventDefault();
    target.focus();
  },

  /**
   * Rend le reste de la page inerte pendant la vidéo (ni focus, ni clic, ni lecteur
   * d'écran derrière le voile), puis le libère. Les zones d'annonce restent actives.
   * @param {boolean} inert
   */
  setBackgroundInert(inert) {
    if (!inert) {
      this._inertTargets.forEach(el => el.removeAttribute('inert'));
      this._inertTargets = [];
      return;
    }
    this.setBackgroundInert(false);
    for (const el of Array.from(document.body.children)) {
      if (el === this._modal || el.hasAttribute('inert')) continue;
      if (el.matches('script, style, link, meta, template, [aria-live]')) continue;
      el.setAttribute('inert', '');
      this._inertTargets.push(el);
    }
  },

  /**
   * Jouer la vidéo d'introduction d'un personnage
   * @param {string} avatar - Nom de l'avatar
   * @param {Function} callback - Fonction appelée à la fin
   * @param {{autoplay?: boolean}} [options] - autoplay : démarrer seule. Par défaut, la
   *   vidéo ouverte automatiquement (création d'un profil, avec une suite à donner) ne
   *   démarre pas seule si l'utilisateur a demandé moins d'animations : une image fixe
   *   et « Voir la vidéo » la remplacent. Une demande explicite (« Revoir ma vidéo »,
   *   sans suite) démarre tout de suite.
   */
  playCharacterIntro(avatar, callback = null, { autoplay } = {}) {
    if (!this.CHARACTER_VIDEOS.has(avatar)) {
      console.error(`❌ Vidéo non trouvée pour l'avatar: ${avatar}`);
      if (callback) callback();
      return;
    }

    this._skipCallback = callback;

    // Choisir la version appropriée (mobile ou desktop)
    const sources = this.buildSourceQueue(avatar);
    if (!sources.length) {
      console.error(`❌ Aucune source vidéo disponible pour l'avatar: ${avatar}`);
      if (callback) callback();
      return;
    }

    this._sourceQueue = sources;
    this._currentSourceIndex = 0;
    this._currentAvatar = avatar;
    this._autoplay =
      typeof autoplay === 'boolean' ? autoplay : !callback || !prefersReducedMotion();

    const videoSource = document.getElementById('video-source');
    const welcomeMessage = document.getElementById('video-welcome-message');

    // 🎬 Ajouter le message d'accueil personnalisé
    if (welcomeMessage) {
      const personalMessage = this.getCharacterWelcomeMessage(avatar);
      welcomeMessage.textContent = personalMessage;
    }

    this.resetProgress();
    this.preparePlayback();

    // Configurer la source vidéo
    this.applyCurrentSource(videoSource);

    // Afficher la modal
    this.showModal();
  },

  /**
   * Obtenir le chemin de la vidéo selon l'appareil
   * @param {string} avatar - Nom de l'avatar
   * @returns {string} Chemin vers la vidéo
   */
  getVideoPath(avatar) {
    const [firstSource] = this.buildSourceQueue(avatar);
    return firstSource?.src ?? '';
  },

  buildSourceQueue(avatar) {
    const config = this.CHARACTER_VIDEOS.get(avatar);
    if (!config) return [];

    const sources = [];
    const basePath = 'assets/videos/';
    const baseName = config.base;

    const mobileSource = {
      src: `${basePath}mobile/${baseName}_mobile.mp4`,
      type: 'video/mp4',
      quality: 'mobile',
    };

    const mp4Optimized = {
      src: `${basePath}${baseName}_720.mp4`,
      type: 'video/mp4',
      quality: '720-mp4',
    };

    const webmOptimized = {
      src: `${basePath}${baseName}_720.webm`,
      type: 'video/webm',
      quality: '720-webm',
    };

    if (this._isMobile) {
      sources.push(mobileSource, mp4Optimized);
    } else {
      sources.push(mp4Optimized);
      if (this._supportsWebm && !this._isLowPower) {
        sources.push(webmOptimized);
      }
    }

    sources.push({
      src: `${basePath}${baseName}.mp4`,
      type: 'video/mp4',
      quality: 'original',
    });

    if (!this._isMobile) {
      sources.push(mobileSource);
    }

    return sources;
  },

  applyCurrentSource(videoSourceEl = document.getElementById('video-source')) {
    const current = this._sourceQueue[this._currentSourceIndex];
    if (!current || !videoSourceEl) return;

    videoSourceEl.src = current.src;
    if (current.type) {
      videoSourceEl.type = current.type;
    } else {
      videoSourceEl.removeAttribute('type');
    }
    videoSourceEl.dataset.quality = current.quality || '';
    this._currentVideo.load();
  },

  preparePlayback() {
    if (!this._currentVideo) return;

    this.cleanupPlaybackPreparation();

    const videoEl = this._currentVideo;
    videoEl.pause();
    videoEl.currentTime = 0;

    // Pas de lecture automatique : la première image reste affichée avec « Voir la vidéo »
    this.setWaitingForPlay(!this._autoplay);
    if (!this._autoplay) return;

    const startPlayback = () => {
      this.cleanupPlaybackPreparation();
      requestAnimationFrame(() => {
        const playPromise = videoEl.play();
        if (typeof playPromise?.catch === 'function') {
          playPromise.catch(err => {
            if (err?.name !== 'AbortError') {
              console.warn('Video playback interrupted', err);
            }
          });
        }
      });
    };

    this._readyHandler = startPlayback;
    videoEl.addEventListener('canplaythrough', this._readyHandler);
    videoEl.addEventListener('canplay', this._readyHandler);
    this._readyTimeout = globalThis.setTimeout(startPlayback, 4000);
  },

  /**
   * Affiche (ou retire) « Voir la vidéo » ; la barre de progression n'a de sens
   * qu'une fois la lecture lancée.
   * @param {boolean} waiting
   */
  setWaitingForPlay(waiting) {
    const playBtn = this._modal?.querySelector('#play-intro-btn');
    if (playBtn) playBtn.hidden = !waiting;
    this._modal?.querySelector('.video-controls')?.classList.toggle('is-waiting', waiting);
  },

  /**
   * « Voir la vidéo » : la lecture démarre à la demande, le clavier passe sur « Passer ».
   */
  startRequestedPlayback() {
    this._autoplay = true;
    this.preparePlayback();
    const skipBtn = this._modal?.querySelector('#skip-intro-btn');
    try {
      skipBtn?.focus({ preventScroll: true });
    } catch {
      skipBtn?.focus();
    }
  },

  cleanupPlaybackPreparation() {
    if (!this._currentVideo) return;
    if (this._readyHandler) {
      this._currentVideo.removeEventListener('canplaythrough', this._readyHandler);
      this._currentVideo.removeEventListener('canplay', this._readyHandler);
      this._readyHandler = null;
    }
    if (this._readyTimeout) {
      globalThis.clearTimeout(this._readyTimeout);
      this._readyTimeout = null;
    }
  },

  /**
   * 🎬 Obtenir le message d'accueil personnalisé du personnage
   * @param {string} avatar - Nom de l'avatar
   * @returns {string} Message d'accueil traduit
   */
  getCharacterWelcomeMessage(avatar) {
    // Les messages par défaut (fallback)
    const defaultMessages = {
      fox: "Salut ! Merci de m'avoir choisi, on va bien s'amuser ensemble !",
      panda: 'Hello ! Tu as choisi le bon personnage, on va passer des moments magiques !',
      unicorn: 'Coucou ! Ensemble nous allons apprendre en nous amusant comme jamais !',
      dragon:
        'Salut petit aventurier ! Prêt pour explorer le monde fantastique des multiplications ?',
      astronaut:
        "Bonjour explorateur ! Direction l'espace des mathématiques pour de super aventures !",
    };

    const fallback = defaultMessages[avatar] || "Merci de m'avoir choisi, on va bien s'amuser !";
    return translateOr(`character_intro_${avatar}`, fallback);
  },

  /**
   * Afficher la modal vidéo (apparition en fondu, durées et courbes : jetons CSS)
   */
  showModal() {
    if (this._hideTimeout) {
      globalThis.clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }
    const active = document.activeElement;
    this._returnFocusTo = active && active !== document.body ? active : null;

    this._modal.classList.remove('is-open', 'is-closing');
    this._modal.style.display = 'flex';
    this._openedAt = now();
    document.body.style.overflow = 'hidden'; // Empêcher le scroll
    this.setBackgroundInert(true);

    // Lire la mise en page pour que la transition parte bien de l'état fermé
    void this._modal.offsetWidth;
    this._modal.classList.add('is-open');

    // Le clavier arrive dans la fenêtre, sur « Voir la vidéo » si la lecture attend
    // l'enfant, sinon sur « Passer »
    const playBtn = this._modal.querySelector('#play-intro-btn');
    const target =
      playBtn && !playBtn.hidden ? playBtn : this._modal.querySelector('#skip-intro-btn');
    try {
      target?.focus({ preventScroll: true });
    } catch {
      target?.focus();
    }
  },

  /**
   * Masquer la modal vidéo
   */
  hideModal() {
    this._modal.classList.remove('is-open');
    this._modal.classList.add('is-closing');
    // La page redevient utilisable tout de suite : la suite (choix du joueur…) peut
    // y placer le focus pendant le fondu de fermeture
    this.setBackgroundInert(false);

    if (this._hideTimeout) globalThis.clearTimeout(this._hideTimeout);
    this._hideTimeout = globalThis.setTimeout(() => {
      this._hideTimeout = null;
      this._modal.style.display = 'none';
      this._modal.classList.remove('is-closing');
      document.body.style.overflow = ''; // Restaurer le scroll
      this._currentVideo.pause();
      this._currentVideo.currentTime = 0;
      this._sourceQueue = [];
      this._currentSourceIndex = 0;
      this._currentAvatar = null;
      this.cleanupPlaybackPreparation();
      this.setWaitingForPlay(false);
      this.restoreFocus();
    }, MODAL_TRANSITION_MS);
  },

  /**
   * Rendre le focus à l'élément qui avait ouvert la vidéo, s'il est toujours là
   * et si l'application n'a pas déjà placé le focus ailleurs.
   */
  restoreFocus() {
    const target = this._returnFocusTo;
    this._returnFocusTo = null;
    const active = document.activeElement;
    // Perdu : sur la page, ou resté sur un bouton de la modale maintenant masquée
    const focusIsLost = !active || active === document.body || this._modal.contains(active);
    if (!focusIsLost || !target?.isConnected || typeof target.focus !== 'function') return;
    try {
      target.focus({ preventScroll: true });
    } catch {
      /* élément devenu non focalisable : rien à rendre */
    }
  },

  /**
   * Passer la vidéo
   */
  skipVideo() {
    this.hideModal();

    if (this._skipCallback) {
      this._skipCallback();
      this._skipCallback = null;
    }
  },

  /**
   * Vidéo terminée naturellement
   */
  onVideoEnded() {
    this.hideModal();

    if (this._skipCallback) {
      this._skipCallback();
      this._skipCallback = null;
    }
  },

  /**
   * Erreur de lecture vidéo
   */
  onVideoError() {
    console.error('❌ Erreur de lecture vidéo');

    if (this._sourceQueue.length) {
      const nextIndex = this._currentSourceIndex + 1;
      if (nextIndex < this._sourceQueue.length) {
        this._currentSourceIndex = nextIndex;
        this.preparePlayback();
        this.applyCurrentSource();
        return;
      }
    }

    this.hideModal();

    if (this._skipCallback) {
      this._skipCallback();
      this._skipCallback = null;
    }
  },

  /**
   * Vidéo commence à charger
   */
  onVideoLoadStart() {
    // Optionnel: afficher un loader
  },

  /**
   * Vidéo prête à être lue
   */
  onVideoCanPlay() {
    // La lecture commence automatiquement grâce à autoplay
  },

  /**
   * Mettre à jour la barre de progression
   */
  updateProgress() {
    if (!this._currentVideo.duration) return;

    const ratio = Math.min(
      1,
      Math.max(0, this._currentVideo.currentTime / this._currentVideo.duration)
    );
    const progressBar = document.getElementById('video-progress-bar');
    const timer = document.getElementById('video-timer');

    // Mise à l'échelle horizontale plutôt que largeur : aucun recalcul de mise en page
    if (progressBar) {
      progressBar.style.transform = `scaleX(${ratio})`;
    }

    if (timer) {
      const remaining = Math.ceil(this._currentVideo.duration - this._currentVideo.currentTime);
      timer.textContent = `0:${remaining.toString().padStart(2, '0')}`;
    }
  },

  /**
   * Remettre la barre de progression à zéro (nouvelle lecture)
   */
  resetProgress() {
    const progressBar = document.getElementById('video-progress-bar');
    if (progressBar) progressBar.style.transform = 'scaleX(0)';
  },

  /**
   * Obtenir l'avatar actuel depuis la source vidéo
   * @returns {string|null} Nom de l'avatar
   */
  getCurrentAvatar() {
    return this._currentAvatar;
  },

  /**
   * Rejouer la vidéo d'un personnage (pour le tableau de bord)
   * @param {string} avatar - Nom de l'avatar à rejouer
   */
  replayCharacterIntro(avatar) {
    this.playCharacterIntro(avatar, null, { autoplay: true });
  },
};

import { getTranslation } from './utils-es6.js';

/**
 * Module de Gestion des Vidéos de Personnages
 * Gère la lecture des vidéos d'introduction des avatars
 * Phase 4.1 - Système vidéo immersif
 */

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

    const container = document.createElement('div');
    container.className = 'video-container';
    modal.appendChild(container);

    const header = document.createElement('div');
    header.className = 'video-header';
    const closeBtn = document.createElement('button');
    closeBtn.id = 'video-close-btn';
    closeBtn.className = 'video-close-btn';
    closeBtn.title = 'Fermer';
    closeBtn.textContent = '✕';
    header.appendChild(closeBtn);
    container.appendChild(header);

    const welcome = document.createElement('div');
    welcome.className = 'video-welcome-message';
    welcome.id = 'video-welcome-message';
    container.appendChild(welcome);

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
    fallbackP.textContent = 'Votre navigateur ne supporte pas la lecture vidéo.';
    video.appendChild(fallbackP);
    container.appendChild(video);

    const controls = document.createElement('div');
    controls.className = 'video-controls';
    const skipBtn = document.createElement('button');
    skipBtn.id = 'skip-intro-btn';
    skipBtn.className = 'skip-btn';
    const skipLabel = document.createElement('span');
    skipLabel.setAttribute('data-translate', 'skip_video');
    skipLabel.textContent = 'Passer';
    skipBtn.appendChild(skipLabel);
    skipBtn.appendChild(document.createTextNode(' ⏭️'));
    controls.appendChild(skipBtn);
    const progress = document.createElement('div');
    progress.className = 'video-progress';
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
    const overlay = this._modal.querySelector('.video-modal-overlay');

    // Bouton Passer
    skipBtn.addEventListener('click', () => this.skipVideo());

    // Bouton Fermer et overlay
    closeBtn.addEventListener('click', () => this.skipVideo());
    overlay.addEventListener('click', () => this.skipVideo());

    // Échap pour fermer
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this._modal.style.display !== 'none') {
        this.skipVideo();
      }
    });

    // Événements vidéo
    this._currentVideo.addEventListener('ended', () => this.onVideoEnded());
    this._currentVideo.addEventListener('error', () => this.onVideoError());
    this._currentVideo.addEventListener('loadstart', () => this.onVideoLoadStart());
    this._currentVideo.addEventListener('canplay', () => this.onVideoCanPlay());
    this._currentVideo.addEventListener('timeupdate', () => this.updateProgress());
  },

  /**
   * Jouer la vidéo d'introduction d'un personnage
   * @param {string} avatar - Nom de l'avatar
   * @param {Function} callback - Fonction appelée à la fin
   */
  playCharacterIntro(avatar, callback = null) {
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

    const videoSource = document.getElementById('video-source');
    const welcomeMessage = document.getElementById('video-welcome-message');

    // 🎬 Ajouter le message d'accueil personnalisé
    if (welcomeMessage) {
      const personalMessage = this.getCharacterWelcomeMessage(avatar);
      welcomeMessage.textContent = personalMessage;
    }

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
      sources.push(mobileSource);
      sources.push(mp4Optimized);
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

    // Utiliser la traduction si disponible
    if (typeof getTranslation === 'function') {
      return getTranslation(`character_intro_${avatar}`, defaultMessages[avatar]);
    }

    return defaultMessages[avatar] || "Merci de m'avoir choisi, on va bien s'amuser !";
  },

  /**
   * Afficher la modal vidéo
   */
  showModal() {
    this._modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Empêcher le scroll

    // Animation d'entrée
    this._modal.style.opacity = '0';
    this._modal.style.transform = 'scale(0.9)';

    setTimeout(() => {
      this._modal.style.transition = 'all 0.3s ease-out';
      this._modal.style.opacity = '1';
      this._modal.style.transform = 'scale(1)';
    }, 10);
  },

  /**
   * Masquer la modal vidéo
   */
  hideModal() {
    this._modal.style.transition = 'all 0.2s ease-in';
    this._modal.style.opacity = '0';
    this._modal.style.transform = 'scale(0.9)';

    setTimeout(() => {
      this._modal.style.display = 'none';
      document.body.style.overflow = ''; // Restaurer le scroll
      this._currentVideo.pause();
      this._currentVideo.currentTime = 0;
      this._sourceQueue = [];
      this._currentSourceIndex = 0;
      this._currentAvatar = null;
      this.cleanupPlaybackPreparation();
    }, 200);
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

    const progress = (this._currentVideo.currentTime / this._currentVideo.duration) * 100;
    const progressBar = document.getElementById('video-progress-bar');
    const timer = document.getElementById('video-timer');

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (timer) {
      const remaining = Math.ceil(this._currentVideo.duration - this._currentVideo.currentTime);
      timer.textContent = `0:${remaining.toString().padStart(2, '0')}`;
    }
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
    this.playCharacterIntro(avatar);
  },
};

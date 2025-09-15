import { getTranslation } from './utils-es6.js';

/**
 * Module de Gestion des Vidéos de Personnages
 * Gère la lecture des vidéos d'introduction des avatars
 * Phase 4.1 - Système vidéo immersif
 */

export const VideoManager = {
  // Configuration des vidéos par avatar
  CHARACTER_VIDEOS: new Map([
    ['fox', 'renard_intro_vid.mp4'],
    ['panda', 'panda_intro_vid.mp4'],
    ['unicorn', 'licorne_intro_vide.mp4'],
    ['dragon', 'dragon_intro_vid.mp4'],
    ['astronaut', 'astronaut_intro_vid.mp4'],
  ]),

  // État interne
  _currentVideo: null,
  _modal: null,
  _skipCallback: null,
  _isMobile: false,

  /**
   * Initialiser le gestionnaire vidéo
   */
  init() {
    this.detectDevice();
    this.createVideoModal();
    this.setupEventListeners();
    console.log('🎬 VideoManager initialisé');
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

    console.log(`📱 Détection appareil: ${this._isMobile ? 'Mobile/Lent' : 'Desktop'}`);
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
    video.autoplay = true;
    video.muted = true;
    video.preload = 'metadata';
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
    const videoPath = this.getVideoPath(avatar);
    const videoSource = document.getElementById('video-source');
    const welcomeMessage = document.getElementById('video-welcome-message');

    // 🎬 Ajouter le message d'accueil personnalisé
    if (welcomeMessage) {
      const personalMessage = this.getCharacterWelcomeMessage(avatar);
      welcomeMessage.textContent = personalMessage;
    }

    // Configurer la source vidéo
    videoSource.src = videoPath;
    this._currentVideo.load(); // Recharger avec la nouvelle source

    // Afficher la modal
    this.showModal();

    console.log(`🎬 Lecture vidéo: ${avatar} (${this._isMobile ? 'mobile' : 'desktop'})`);
  },

  /**
   * Obtenir le chemin de la vidéo selon l'appareil
   * @param {string} avatar - Nom de l'avatar
   * @returns {string} Chemin vers la vidéo
   */
  getVideoPath(avatar) {
    const filename = this.CHARACTER_VIDEOS.get(avatar);
    const basePath = 'assets/videos/';

    if (this._isMobile) {
      // Version mobile compressée
      const mobileFilename = filename.replace('.mp4', '_mobile.mp4');
      return `${basePath}mobile/${mobileFilename}`;
    } else {
      // Version desktop originale
      return `${basePath}${filename}`;
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
    }, 200);
  },

  /**
   * Passer la vidéo
   */
  skipVideo() {
    console.log("⏭️ Vidéo passée par l'utilisateur");
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
    console.log('✅ Vidéo terminée');
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

    // Essayer la version alternative si échec
    if (!this._isMobile) {
      console.log('🔄 Tentative version mobile...');
      this._isMobile = true;
      const avatar = this.getCurrentAvatar();
      if (avatar) {
        const videoSource = document.getElementById('video-source');
        videoSource.src = this.getVideoPath(avatar);
        this._currentVideo.load();
        return;
      }
    }

    // Fallback: fermer la modal
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
    console.log('📥 Chargement vidéo...');
    // Optionnel: afficher un loader
  },

  /**
   * Vidéo prête à être lue
   */
  onVideoCanPlay() {
    console.log('▶️ Vidéo prête');
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
    const source = document.getElementById('video-source');
    if (!source.src) return null;

    for (const [avatar, filename] of Object.entries(this.CHARACTER_VIDEOS)) {
      if (source.src.includes(filename.replace('.mp4', ''))) {
        return avatar;
      }
    }
    return null;
  },

  /**
   * Rejouer la vidéo d'un personnage (pour le tableau de bord)
   * @param {string} avatar - Nom de l'avatar à rejouer
   */
  replayCharacterIntro(avatar) {
    console.log(`🔄 Replay vidéo demandé: ${avatar}`);
    this.playCharacterIntro(avatar);
  },
};

console.log('🎬 Module VideoManager chargé');

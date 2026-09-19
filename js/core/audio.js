/**
 * Module audio centralisé
 * Centralise toutes les opérations audio (sons, volume, mute)
 * Phase 2.2 - Consolidation des utilitaires
 */
import { UserState } from './userState.js';
import { UserManager } from '../userManager.js';
import Storage from './storage.js';
import { gameState } from '../game.js';
import { eventBus } from './eventBus.js';

/**
 * API audio centralisée
 */
const AudioManager = {
  // Catalogue des sons disponibles
  sounds: new Map([
    ['good', 'assets/sounds/mixkit-electronic-lock-success-beeps-2852.wav'],
    ['bad', 'assets/sounds/mixkit-failure-arcade-alert-notification-240.wav'],
    ['shoot', 'assets/sounds/mixkit-short-laser-gun-shot-1670.wav'],
  ]),

  // État audio interne
  _volume: 1,
  _muted: false,
  _lastVolume: 1,
  _gameState: null, // Référence vers gameState global
  activeSounds: new Set(),

  /**
   * Initialiser le gestionnaire audio
   * @param {Object} gameState - Référence vers l'état global du jeu
   */
  init(gameState = null) {
    this._gameState = gameState;

    // Charger les préférences sauvegardées
    this.loadPreferences();

    // Initialiser les contrôles UI
    this.initSoundControls();
  },

  /**
   * Charger les préférences audio depuis le stockage
   */
  loadPreferences() {
    let volumeLoaded = false;

    // 1. Priorité: volume depuis les données utilisateur actuelles
    if (UserManager && UserManager.getCurrentUser()) {
      const currentUserData = UserState.getCurrentUserData();
      /**
       * Fonction if
       * @param {*} currentUserData.volume - Description du paramètre
       * @returns {*} Description du retour
       */
      if (currentUserData.volume !== undefined) {
        this._volume = Math.max(0, Math.min(1, currentUserData.volume));
        volumeLoaded = true;
      }
    }

    // 2. Fallback: volume global via Storage API
    if (!volumeLoaded) {
      try {
        this._volume = Storage.loadVolume();
      } catch {
        const savedVolume = localStorage.getItem('volume');
        this._volume = savedVolume !== null ? parseFloat(savedVolume) : 1;
      }
    }

    this._muted = this._volume === 0;

    // Initialize _lastVolume with the loaded volume if it's not 0
    if (this._volume > 0) {
      this._lastVolume = this._volume;
    }

    // Synchroniser avec gameState si disponible
    if (this._gameState) {
      this._gameState.volume = this._volume;
      this._gameState.muted = this._muted;
    }

    // Notifier les autres modules de l'état initial
    eventBus.emit('volumeChanged', { volume: this._volume, muted: this._muted });
  },

  /**
   * Sauvegarder les préférences audio
   */
  savePreferences() {
    // 1. Sauvegarde globale via Storage API
    try {
      Storage.saveVolume(this._volume);
    } catch {
      localStorage.setItem('volume', this._volume);
    }

    // 2. Sauvegarde dans les données utilisateur si possible
    if (UserManager && UserManager.getCurrentUser()) {
      const currentUserData = UserState.getCurrentUserData();
      currentUserData.volume = this._volume;

      // Sauvegarder les données utilisateur mises à jour
      UserState.updateUserData(currentUserData);
    }

    // 3. Synchroniser avec gameState si disponible
    /**
     * Fonction if
     * @param {*} this._gameState - Description du paramètre
     * @returns {*} Description du retour
     */
    if (this._gameState) {
      this._gameState.volume = this._volume;
      this._gameState.muted = this._muted;
    }
  },

  /**
   * Obtenir le volume actuel
   * @returns {number} Volume entre 0 et 1
   */
  getVolume() {
    return this._volume;
  },

  /**
   * Définir le volume
   * @param {number} volume - Volume entre 0 et 1
   */
  setVolume(volume) {
    // Valider et normaliser
    this._volume = Math.max(0, Math.min(1, volume));
    this._muted = this._volume === 0;

    // If the new volume is not zero, remember it for the next unmute
    if (this._volume > 0) {
      this._lastVolume = this._volume;
    }

    // Mettre à jour le volume des sons actifs
    for (const audio of this.activeSounds) {
      try {
        audio.volume = this._volume;
      } catch {
        // ignore
      }
    }

    // Sauvegarder
    this.savePreferences();

    // Mettre à jour l'UI
    this.updateVolumeControls();

    // Notifier les autres modules
    eventBus.emit('volumeChanged', { volume: this._volume, muted: this._muted });
  },

  /**
   * État muet
   * @returns {boolean} True si muet
   */
  isMuted() {
    return this._muted || this._volume === 0;
  },

  /**
   * Basculer muet/son
   */
  toggleMute() {
    if (this.isMuted()) {
      this.setVolume(this._lastVolume || 1); // Restore to last known volume, or 1 as a fallback
    } else {
      this.setVolume(0); // Mute
    }
  },

  /**
   * Jouer un son
   * @param {string} name - Nom du son ('good', 'bad', 'shoot', etc.)
   * @param {Object} options - Options { volume: 0-1, loop: false }
   */
  playSound(name, options = {}) {
    // Vérifier si audio est désactivé
    if (this.isMuted()) return;

    // Vérifier si le son existe
    if (typeof name !== 'string' || !/^[a-z0-9_-]+$/i.test(name)) return;
    const src = this.sounds.get(name);
    /**
     * Fonction if
     * @param {*} !src - Description du paramètre
     * @returns {*} Description du retour
     */
    if (!src) {
      console.warn(`Son "${name}" non trouvé dans le catalogue`);
      return;
    }

    try {
      // Créer l'instance audio
      const audio = new Audio(src);

      // Appliquer le volume (global * local)
      let effectiveVolume = this._volume;
      /**
       * Fonction if
       * @param {*} options.volume - Description du paramètre
       * @returns {*} Description du retour
       */
      if (options.volume !== undefined) {
        effectiveVolume *= options.volume;
      }
      audio.volume = Math.max(0, Math.min(1, effectiveVolume));

      // Appliquer les options
      /**
       * Fonction if
       * @param {*} options.loop - Description du paramètre
       * @returns {*} Description du retour
       */
      if (options.loop) {
        audio.loop = true;
      }

      // Suivre le son actif

      this.activeSounds.add(audio);

      audio.addEventListener('ended', () => this.activeSounds.delete(audio));

      // Jouer le son (gérer proprement les erreurs de promesse)
      audio.play().catch(error => {
        const msg = String(error?.message || error || '');
        const nameErr = String(error?.name || '');
        // Chrome/Firefox: AbortError quand play() est interrompu par pause()
        // ou navigation rapide: ignorer silencieusement (comportement attendu)
        const isAbort = nameErr === 'AbortError' || msg.includes('play() request was interrupted');
        // Autoplay bloqué par le navigateur (sans interaction): ne pas spammer la console
        const isNotAllowed =
          nameErr === 'NotAllowedError' || msg.toLowerCase().includes('notallowed');
        if (isAbort) {
          // no-op: lecture interrompue volontairement
        } else if (isNotAllowed) {
          // Optionnel: signaler une seule fois si besoin
          // console.debug(`[Audio] Autoplay bloqué pour "${name}"`);
        } else {
          console.warn(`Erreur lecture audio "${name}":`, error);
        }
        this.activeSounds.delete(audio);
      });
    } catch (error) {
      console.error(`Erreur création audio "${name}":`, error);
    }
  },

  /**
   * Ajouter un nouveau son au catalogue
   * @param {string} name - Nom du son
   * @param {string} path - Chemin vers le fichier audio
   */
  addSound(name, path) {
    if (typeof name !== 'string' || !/^[a-z0-9_-]+$/i.test(name)) return;
    if (typeof path !== 'string' || !/^assets\/sounds\//.test(path)) return;
    this.sounds.set(name, path);
  },

  /**
   * Initialiser les contrôles audio dans l'UI
   */
  initSoundControls() {
    // Cibler tous les boutons mute et sliders
    const muteButtons = document.querySelectorAll('.mute-btn');
    const volumeSliders = document.querySelectorAll('.volume-slider');

    // Mettre à jour l'UI initiale
    this.updateVolumeControls();

    // Ajouter les écouteurs à tous les contrôles
    muteButtons.forEach(btn => {
      // Éviter d'ajouter plusieurs écouteurs
      /**
       * Fonction if
       * @param {*} !btn.dataset.audioListenerAttached - Description du paramètre
       * @returns {*} Description du retour
       */
      if (!btn.dataset.audioListenerAttached) {
        btn.addEventListener('click', () => {
          this.toggleMute();
        });
        btn.dataset.audioListenerAttached = 'true';
      }
    });

    volumeSliders.forEach(slider => {
      /**
       * Fonction if
       * @param {*} !slider.dataset.audioListenerAttached - Description du paramètre
       * @returns {*} Description du retour
       */
      if (!slider.dataset.audioListenerAttached) {
        slider.addEventListener('input', e => {
          const newVolume = parseFloat(e.target.value);
          this.setVolume(newVolume);
        });
        slider.dataset.audioListenerAttached = 'true';
      }
    });
  },

  /**
   * Mettre à jour tous les contrôles de volume dans l'UI
   */
  updateVolumeControls() {
    // L'icône et le libellé des boutons son sont gérés par la barre du haut
    // (TopBar.updateVolumeControls, via l'événement volumeChanged) : ici, seulement les curseurs.
    document.querySelectorAll('.volume-slider').forEach(slider => {
      slider.value = this._volume;
    });
  },

  /**
   * Arrêter tous les sons en cours
   */
  stopAll() {
    this.activeSounds.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignore
      }
    });
    this.activeSounds.clear();
  },

  /**
   * Réinitialiser les écouteurs audio (utile après changement de contenu DOM)
   */
  reinitControls() {
    // Marquer tous les contrôles comme non-attachés
    document.querySelectorAll('.mute-btn, .volume-slider').forEach(control => {
      delete control.dataset.audioListenerAttached;
    });

    // Réinitialiser
    this.initSoundControls();
  },
};

// Plus d'alias globaux: utiliser uniquement les imports ESM (AudioManager)

// Auto-initialisation si gameState est disponible
/**
 * Fonction if
 * @param {*} typeof - Description du paramètre
 * @returns {*} Description du retour
 */
try {
  AudioManager.init(gameState);
} catch {
  // Initialisation différée si l'import n'a pas encore initialisé gameState
  document.addEventListener('DOMContentLoaded', () => {
    try {
      AudioManager.init(gameState);
    } catch (e) {
      void e;
    }
  });
}

export { AudioManager };

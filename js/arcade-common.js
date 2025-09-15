/* =====================
   Fonctions communes pour les jeux d'arcade (ESM)
   - Fonctions partagées par tous les jeux arcade pour une cohérence d'interface
   ===================== */

// Fonction pour afficher des instructions au-dessus du canvas (plus ergonomique)
export function showGameInstructions(canvas, message, bgColor = '#4CAF50', duration = 5000) {
  if (!canvas) return;

  // Trouver le conteneur du jeu
  const gameContainer = canvas.closest('.arcade-game-container');
  if (!gameContainer) return;

  // Vérifier si l'élément d'instructions existe déjà
  let instructionsElement = gameContainer.querySelector('.game-instructions');
  if (!instructionsElement) {
    // Créer un élément pour les instructions s'il n'existe pas
    instructionsElement = document.createElement('div');
    instructionsElement.className = 'game-instructions';
    // Insérer avant le canvas
    gameContainer.insertBefore(instructionsElement, canvas);
  }

  // Ajouter le message d'instruction sans innerHTML
  while (instructionsElement.firstChild)
    instructionsElement.removeChild(instructionsElement.firstChild);
  const p = document.createElement('p');
  p.textContent = message;
  instructionsElement.appendChild(p);
  instructionsElement.style.cssText = `
        background-color: ${bgColor}; 
        color: white; 
        padding: 8px; 
        border-radius: 5px; 
        margin-bottom: 10px; 
        text-align: center; 
        font-weight: bold;
        opacity: 1;
        transition: opacity 0.5s;
        pointer-events: none;
    `;

  // Faire disparaître le message après la durée spécifiée
  setTimeout(() => {
    instructionsElement.style.opacity = '0';
    setTimeout(() => {
      instructionsElement.style.display = 'none';
    }, 500);
  }, duration);

  return instructionsElement;
}

// Plus de pont global: importer showGameInstructions via ESM

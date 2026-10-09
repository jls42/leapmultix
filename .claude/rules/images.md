---
paths:
  - 'scripts/generate-responsive-assets.cjs'
  - 'scripts/convert-backgrounds.cjs'
  - 'assets/images/**'
  - 'img/**'
  - 'js/arcade-sprite*.js'
  - 'js/webp-images.js'
  - 'js/avatar-heads.js'
---

# Images : sources, variantes WebP, préchargement

- Sources haute définition : dessins d'`assets/images/` (1024 px pour la plupart, plus de 1 Mo),
  fonds de l'avatar `img/background_<avatar>_NNN.png` (1536 × 1024). Le jeu ne sert jamais une
  source telle quelle : il prend ses variantes WebP.
- `npm run assets:generate` produit `assets/generated-images/` (non versionné, refait par la CI au
  déploiement), obligatoire dès qu'un PNG est ajouté ou modifié. Il saute une variante qui existe
  déjà : pour essayer d'autres réglages, régénérer dans un dossier neuf.
- Réglages de `scripts/generate-responsive-assets.cjs` : 256, 512 et 1024 en WebP quasi sans
  perte (niveau 40), 64 et 128 en qualité 90 avec sharp YUV. En qualité 75 à 80, les contours des
  dessins bavaient (mesuré le 09/10/2026, dessin au canevas comme dans les jeux : 36,6 à 37,8 dB
  de la réduction parfaite de la source, contre 39 à 42,5) : ne pas les baisser sans mesure.
- Fonds : `npm run assets:backgrounds` (WebP versionnés à côté des PNG), qualité 85 avec sharp YUV.
- Hors ligne : à l'installation, le service worker garde les variantes de 256 px au plus de
  chaque image (`PRECACHE_MAX_WIDTH` de `sw.js`) ; les grandes viennent à la demande. Sans ce
  plafond, une première visite téléchargeait 13,2 Mo au lieu de 9,3 (mesuré le 09/10/2026).
  Peser ce que télécharge l'installation, variantes comprises, pas les PNG de la liste.
- La prod sert les images 30 jours sans les revérifier (`immutable`) et les variantes n'ont pas de
  `?v=` : une image qui change de contenu change de nom.
- Arcade : chaque image passe par `js/arcade-sprite-catalog.js` (source, plus grande variante,
  repli PNG) ; illustrations des écrans : `js/webp-images.js` ; têtes d'avatar :
  `js/avatar-heads.js` (`setAvatarHead`, jamais `img.src` seul quand l'image a un `srcset`).
  Garder le nom du PNG en clair dans le code : `scripts/precache-list.mjs` y trouve les images à
  garder hors ligne.

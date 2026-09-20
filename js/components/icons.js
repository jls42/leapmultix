/**
 * Icônes d'interface : SVG en ligne, trait de 2 px, grille de 24 px.
 *
 * Les SVG sont créés avec document.createElementNS (aucune chaîne HTML) et portent
 * aria-hidden="true" : le nom accessible vient toujours du bouton qui les contient.
 * Couleur : currentColor (le trait suit la couleur du texte du bouton).
 *
 * Provenance des tracés : Lucide v1.8.0 (https://lucide.dev), licence ISC ci-dessous.
 * « info », « lock », « x » et le cercle de « coin » font partie des icônes Lucide
 * dérivées de Feather : elles relèvent en plus de la licence MIT reproduite ci-dessous.
 * Compositions propres à LeapMultix, publiées sous la même licence ISC :
 * - « speech-off » : la tête de « speech » et la croix de « volume-x » ;
 * - « coin » : deux cercles concentriques, remplis par la feuille de style.
 *
 * ---------------------------------------------------------------------------
 * ISC License
 *
 * Copyright (c) 2026 Lucide Icons and Contributors
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---------------------------------------------------------------------------
 * The MIT License (MIT) (for the icons derived from the Feather project:
 * info, lock, x, circle)
 *
 * Copyright (c) 2013-present Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ---------------------------------------------------------------------------
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/* Tête de « speech » et croix de « volume-x », partagées par deux icônes */
const SPEECH_HEAD = [
  'path',
  {
    d: 'M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20',
  },
];
const VOLUME_BODY = [
  'path',
  {
    d: 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z',
  },
];
const CROSS_RIGHT = [
  ['line', { x1: '22', x2: '16', y1: '9', y2: '15' }],
  ['line', { x1: '16', x2: '22', y1: '9', y2: '15' }],
];

/** Définitions [balise, attributs] au format des nœuds Lucide */
const ICONS = Object.freeze({
  house: [
    ['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' }],
    [
      'path',
      {
        d: 'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
      },
    ],
  ],
  info: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'M12 16v-4' }],
    ['path', { d: 'M12 8h.01' }],
  ],
  settings: [
    [
      'path',
      {
        d: 'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915',
      },
    ],
    ['circle', { cx: '12', cy: '12', r: '3' }],
  ],
  'volume-2': [
    VOLUME_BODY,
    ['path', { d: 'M16 9a5 5 0 0 1 0 6' }],
    ['path', { d: 'M19.364 18.364a9 9 0 0 0 0-12.728' }],
  ],
  'volume-x': [VOLUME_BODY, ...CROSS_RIGHT],
  speech: [
    SPEECH_HEAD,
    ['path', { d: 'M19.8 17.8a7.5 7.5 0 0 0 .003-10.603' }],
    ['path', { d: 'M17 15a3.5 3.5 0 0 0-.025-4.975' }],
  ],
  'speech-off': [SPEECH_HEAD, ...CROSS_RIGHT],
  menu: [
    ['path', { d: 'M4 5h16' }],
    ['path', { d: 'M4 12h16' }],
    ['path', { d: 'M4 19h16' }],
  ],
  x: [
    ['path', { d: 'M18 6 6 18' }],
    ['path', { d: 'm6 6 12 12' }],
  ],
  users: [
    ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }],
    ['path', { d: 'M16 3.128a4 4 0 0 1 0 7.744' }],
    ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }],
    ['circle', { cx: '9', cy: '7', r: '4' }],
  ],
  'circle-play': [
    [
      'path',
      {
        d: 'M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z',
      },
    ],
    ['circle', { cx: '12', cy: '12', r: '10' }],
  ],
  star: [
    [
      'path',
      {
        d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
      },
    ],
  ],
  lock: [
    ['rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2' }],
    ['path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' }],
  ],
  coin: [
    ['circle', { cx: '12', cy: '12', r: '9' }],
    ['circle', { cx: '12', cy: '12', r: '5' }],
  ],
});

/** Noms d'icônes disponibles */
export const ICON_NAMES = Object.freeze(Object.keys(ICONS));

/**
 * Crée une icône SVG décorative.
 * @param {string} name - Nom de l'icône (voir ICON_NAMES)
 * @param {Object} [options]
 * @param {number} [options.size=24] - Taille en pixels (largeur = hauteur)
 * @param {string} [options.className] - Classes supplémentaires
 * @returns {SVGSVGElement|null} L'icône, ou null si le nom est inconnu
 */
// Attributs partagés par toutes les icônes : trait de 2 px, décoratives
const ICON_BASE_ATTRIBUTES = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

/**
 * Ajoute les tracés d'une icône au SVG.
 * @param {SVGSVGElement} svg
 * @param {Array<[string, Object]>} nodes
 */
function appendIconShapes(svg, nodes) {
  for (const [tag, attributes] of nodes) {
    const child = document.createElementNS(SVG_NS, tag);
    for (const [attribute, value] of Object.entries(attributes)) {
      child.setAttribute(attribute, value);
    }
    svg.appendChild(child);
  }
}

export function createIcon(name, { size = 24, className = '' } = {}) {
  const nodes = Object.hasOwn(ICONS, name) ? ICONS[name] : null;
  if (!nodes || typeof document === 'undefined') return null;

  const svg = document.createElementNS(SVG_NS, 'svg');
  for (const [attribute, value] of Object.entries(ICON_BASE_ATTRIBUTES)) {
    svg.setAttribute(attribute, value);
  }
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('class', ['icon', `icon-${name}`, className].filter(Boolean).join(' '));
  svg.dataset.icon = name;

  appendIconShapes(svg, nodes);
  return svg;
}

/**
 * Place (ou remplace) l'icône d'un élément, en première position.
 * Ne touche pas au DOM si l'icône affichée est déjà la bonne.
 * @param {Element} element - Bouton ou conteneur
 * @param {string} name - Nom de l'icône
 * @returns {SVGSVGElement|null} L'icône affichée
 */
export function setIcon(element, name) {
  if (!element) return null;
  const current = element.querySelector(':scope > svg.icon');
  if (current?.dataset.icon === name) return current;
  const icon = createIcon(name);
  if (!icon) return current;
  if (current) current.replaceWith(icon);
  else element.prepend(icon);
  return icon;
}

export default { createIcon, setIcon, ICON_NAMES };

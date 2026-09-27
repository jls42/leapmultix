<details>
<summary>Este documento también está disponible en otros idiomas</summary>

- [English](./README.en.md)
- [Español](./README.es.md)
- [Português](./README.pt.md)
- [Deutsch](./README.de.md)
- [中文](./README.zh.md)
- [हिन्दी](./README.hi.md)
- [العربية](./README.ar.md)
- [Italiano](./README.it.md)
- [Svenska](./README.sv.md)
- [Polski](./README.pl.md)
- [Nederlands](./README.nl.md)
- [Română](./README.ro.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)

</details>

# LeapMultix

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)
![Licencia: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## Tabla de contenidos

- [Descripción](#descripción)
- [Vista previa](#-vista-previa)
- [Características](#-características)
- [Inicio rápido](#-inicio-rápido)
- [Arquitectura](#-arquitectura)
- [Modos de juego detallados](#-modos-de-juego-detallados)
- [Desarrollo](#-desarrollo)
- [Compatibilidad](#-compatibilidad)
- [Localización](#-localización)
- [Voz grabada](#-voz-grabada)
- [Almacenamiento de datos](#-almacenamiento-de-datos)
- [Informar de un problema](#-reportar-un-problema)
- [Licencia](#-licencia)

## Descripción

LeapMultix es una aplicación web educativa e interactiva diseñada para que niños de 6 a 12 años dominen las 4 operaciones aritméticas: multiplicación (×), suma (+), resta (−) y división (÷). Ofrece **5 modos de juego** y **4 minijuegos arcade** en una interfaz intuitiva, accesible y multilingüe.

**Soporte multioperación:** los cinco modos admiten las cuatro operaciones. La elección se realiza en la pantalla de inicio y se aplica a todo el recorrido.

**Desarrollado por:** Julien LS (contact@jls42.org)

**URL en línea:** https://leapmultix.jls42.org/

## 📸 Vista previa

### Las pantallas

|                                                                                                                                     |                                                                                                                      |
| :---------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: |
|                            ![Pantalla «¿Quién juega?»: selección de perfil](docs/media/01-accueil.webp)                             |              ![Menú principal: selección de la operación y de los cinco modos](docs/media/02-menu.webp)              |
|                                **¿Quién juega?** — un perfil por niño, con su avatar y su progreso.                                 |                      **El menú** — la operación se elige aquí y luego se abren los cinco modos.                      |
|                      ![Modo Descubrimiento: la tabla del 4 mostrada en puntos](docs/media/03-decouverte.webp)                       |           ![Modo Quiz: respuesta incorrecta en rojo, respuesta correcta en verde](docs/media/04-quiz.webp)           |
|              **Descubrimiento** — cada igualdad se muestra en puntos, en saltos o contando, con el truco de la tabla.               | **Quiz** — la elección del niño permanece visible junto a la respuesta correcta y la explicación detalla el cálculo. |
|                               ![Modo Desafío: cuenta atrás y racha en curso](docs/media/05-defi.webp)                               |          ![Modo Aventura: mapa de los diez niveles, los siguientes bloqueados](docs/media/06-aventure.webp)          |
| **Desafío** — carrera contra el reloj. Ante un error, el cronómetro se congela el tiempo necesario para leer la respuesta correcta. |                 **Aventura** — diez niveles que se desbloquean uno tras otro, a cambio de estrellas.                 |
|                                  ![Menú Arcade: los cuatro minijuegos](docs/media/07-arcade.webp)                                   |             ![Panel de control: estrellas por tabla y estadísticas](docs/media/08-tableau-de-bord.webp)              |
|                            **Arcade** — cuatro minijuegos, con ajuste de dificultad y elección de nave.                             |               **Panel de control** — estrellas por tabla, tablas para repasar, puntuaciones por modo.                |
|                       ![Personalización: avatares, temas, accesibilidad](docs/media/09-personnalisation.webp)                       |                                                                                                                      |
|                  **Personalización** — avatar, tema de colores, tamaño del texto, alto contraste, código parental.                  |                                                                                                                      |

### Los minijuegos arcade

Cuatro juegos que plantean la misma pregunta —la mostrada sobre la zona de
juego, con el tiempo restante y las vidas—, pero que exigen cada vez una acción
diferente.

|                                                                                                                                |                                                                                                             |
| :----------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
|    ![MultiInvaders: monstruos con números, una nave en la parte inferior de la pantalla](docs/media/10-multiinvaders.webp)     | ![MultiMiam: un laberinto donde las pastillas llevan las respuestas posibles](docs/media/11-multimiam.webp) |
|       **MultiInvaders** — disparar a las respuestas incorrectas y salvar la correcta: esconde a un amigo al que liberar.       |     **MultiMiam** — recorrer el laberinto para atrapar el resultado correcto evitando a los monstruos.      |
| ![MultiMemory: una cuadrícula de cartas, dos dadas la vuelta mostrando un cálculo y un número](docs/media/12-multimemory.webp) |        ![MultiSnake: una serpiente y manzanas numeradas en un prado](docs/media/13-multisnake.webp)         |
|                        **MultiMemory** — recordar qué carta contiene el resultado del cálculo revelado.                        |            **MultiSnake** — crecer comiendo los números correctos y esquivando todos los demás.             |

## ✨ Características

### 🎮 Modos de juego

- **Modo Descubrimiento**: Exploración visual e interactiva adaptada a cada operación
- **Modo Quiz**: Preguntas de opción múltiple compatibles con las 4 operaciones (×, +, −, ÷) y progresión adaptativa
- **Modo Desafío**: Carrera contra el reloj con las 4 operaciones (×, +, −, ÷) y diferentes niveles de dificultad
- **Modo Aventura**: Progresión narrativa por niveles compatible con las 4 operaciones

### 🕹️ Minijuegos Arcade

- **MultiInvaders**: Space Invaders educativo - Destruir las respuestas incorrectas
- **MultiMiam**: Pac-Man matemático - Recolectar las respuestas correctas
- **MultiMemory**: Juego de memoria - Emparejar operaciones y resultados
- **MultiSnake**: Snake educativo - Crecer comiendo los números correctos

### ➕ Soporte multioperación

LeapMultix ofrece un entrenamiento completo en las 4 operaciones aritméticas en **todos los modos**:

| Modo           | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| Quiz           | ✅  | ✅  | ✅  | ✅  |
| Desafío        | ✅  | ✅  | ✅  | ✅  |
| Descubrimiento | ✅  | ✅  | ✅  | ✅  |
| Aventura       | ✅  | ✅  | ✅  | ✅  |
| Arcade         | ✅  | ✅  | ✅  | ✅  |

### 🌍 Características transversales

- **Multiusuario**: Gestión de perfiles individuales con guardado de progreso
- **Multilingüe**: Compatible con francés, inglés y español
- **Personalización**: Avatares, temas de color, fondos
- **Accesibilidad**: Navegación por teclado, soporte táctil, conformidad con WCAG 2.1 AA
- **Voz grabada**: el juego puede leer preguntas y ánimos con una voz sintetizada pregrabada, con cambio automático a la voz del dispositivo. Las voces no están en este repositorio: el sitio leapmultix.jls42.org ofrece a Lucie en francés, Sulafat en inglés y español, y Jane como opción en inglés (ver [Voz grabada](#-voz-grabada))
- **Mobile responsive**: Interfaz optimizada para tabletas y teléfonos inteligentes
- **Sistema de progresión**: Puntuaciones, insignias, desafíos diarios

## 🚀 Inicio rápido

### Requisitos previos

- Node.js (versión 16 o superior)
- Un navegador web moderno

### Instalación

```bash
# Cloner le projet
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Installer les dépendances
npm install

# Lancer le serveur de développement (option 1)
npm run serve
# L'application sera accessible sur http://localhost:8080 (ou port suivant disponible)

# Ou avec Python (option 2)
python3 -m http.server 8000
# L'application sera accessible sur http://localhost:8000
```

### Scripts disponibles

```bash
# Développement
npm run serve          # Serveur local (http://localhost:8080)
npm run lint           # Vérification du code avec ESLint
npm run lint:fix       # Correction automatique des problèmes ESLint
npm run format:check   # Vérifier le formatage du code (TOUJOURS avant commit)
npm run format         # Formater le code avec Prettier
npm run verify         # Quality gate: lint + test + coverage

# Tests
npm run test           # Lancer tous les tests (CJS)
npm run test:watch     # Tests en mode watch
npm run test:coverage  # Tests avec rapport de couverture
npm run test:core      # Tests des modules core uniquement
npm run test:integration # Tests d'intégration
npm run test:storage   # Tests du système de stockage
npm run test:esm       # Tests ESM (dossiers tests-esm/, Jest vm-modules)
npm run test:verbose   # Tests avec sortie détaillée
npm run test:pwa-offline # Test offline PWA (nécessite Puppeteer), après `npm run serve`

# Analyse et maintenance
npm run analyze:jsdoc  # Analyse de la documentation
npm run improve:jsdoc  # Amélioration automatique JSDoc
npm run audit:mobile   # Tests responsivité mobile
npm run audit:accessibility # Tests d'accessibilité
npm run dead-code      # Détection de code non utilisé
npm run analyze:globals # Analyse des variables globales
npm run analyze:dependencies # Analyse usage des dépendances
npm run verify:cleanup # Analyse combinée (dead code + globals)

# Gestion des assets
npm run assets:generate    # Générer les images responsives
npm run assets:backgrounds # Convertir les fonds en WebP
npm run assets:analyze     # Analyse des assets responsive
npm run assets:diff        # Comparaison des assets

# Internationalisation
npm run i18n:verify    # Vérifier la cohérence des clés de traduction
npm run i18n:unused    # Lister les clés de traduction non utilisées
npm run i18n:compare   # Comparer les traductions (en/es) avec fr.json (référence)

# Build & livraison
npm run build          # Build de prod (Rollup) + postbuild (dist/ complet)
npm run serve:dist     # Servir dist/ sur http://localhost:5000 (ou port disponible)

# PWA et Service Worker
npm run sw:disable     # Désactiver le service worker
npm run sw:fix         # Corriger les problèmes de service worker

# Voix enregistrée (poste du propriétaire, clips hors dépôt)
npm run voice:corpus       # Résumé des phrases dites, par langue
npm run voice:corpus:lock  # Mettre à jour le verrou du corpus
npm run voice:generate     # Générer les clips (ElevenLabs, Google ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Arquitectura

### Estructura de archivos

Los módulos JavaScript se encuentran **en la raíz de `js/`**, a excepción de tres carpetas:
`core/`, `components/` y `modes/`. Por lo tanto, es el nombre del archivo el que define la
agrupación (`arcade-*`, `multimiam-*`, `i18n*`…).

```
leapmultix/
├── index.html              # Application (navigation par slides)
├── modes.html              # Page publique : les modes de jeu
├── parents.html            # Page publique : guide parents et enseignants
├── pwa.html                # Page publique : installation hors ligne
├── offline.html            # Page servie hors ligne par le service worker
├── sw.js                   # Service worker (version alignée sur js/cache-updater.js)
├── deploy.sh               # Déploiement S3 + invalidation CloudFront
├── js/
│   ├── core/               # Socle applicatif
│   │   ├── GameMode.js, GameModeManager.js   # Classe de base des modes
│   │   ├── storage.js, userState.js          # Persistance et session
│   │   ├── audio.js, theme.js, parental.js   # Son, thèmes, contrôle parental
│   │   ├── eventBus.js, mainInit.js          # Événements, amorçage DOM
│   │   ├── adventure-data.js                 # Niveaux du mode Aventure
│   │   ├── mult-stats.js, challenge-stats.js, operation-stats.js
│   │   ├── daily-challenge.js, tablePreferences.js, stats-migration.js
│   │   ├── userUi.js, utils.js               # Utilitaires (source canonique)
│   │   └── operations/                       # Une classe par opération
│   │       ├── Operation.js, OperationRegistry.js
│   │       └── Multiplication.js, Addition.js, Subtraction.js, Division.js
│   ├── components/         # Composants d'interface
│   │   ├── topBar.js, infoBar.js, dashboard.js, customization.js
│   │   ├── operationSelector.js, operationModeAvailability.js
│   │   └── icons.js, tableSettingsModal.js
│   ├── modes/              # Les cinq modes de jeu
│   │   ├── DiscoveryMode.js, QuizMode.js, ChallengeMode.js
│   │   └── AdventureMode.js, ArcadeMode.js
│   ├── arcade*.js          # Orchestrateur et briques communes des mini-jeux
│   ├── multimiam*.js       # Mini-jeu Pac-Man (moteur, rendu, contrôles…)
│   ├── multisnake.js       # Mini-jeu Snake
│   ├── i18n.js, i18n-store.js                # Internationalisation
│   ├── security-utils.js, error-handlers.js, logger.js
│   ├── accessibility.js, keyboard-navigation.js, touch-support.js, speech.js
│   ├── voice-clips.js      # Lecteur de la voix enregistrée (repli : speech.js)
│   ├── slides.js, mode-orchestrator.js, lazy-loader.js, game-cleanup.js
│   ├── VideoManager.js, responsive-image-loader.js
│   ├── userManager.js, main-helpers.js, utils-es6.js, questionGenerator.js
│   └── main-es6.js, main.js, bootstrap.js, game.js   # Points d'entrée
├── css/                    # Feuilles de style (jetons de design : themes.css)
├── assets/
│   ├── images/             # Sources PNG (avatars, sprites, fonds)
│   ├── generated-images/   # Variantes responsives (généré, hors git)
│   ├── fonts/, sounds/, videos/, icons/, social/
│   └── translations/       # fr.json, en.json, es.json
├── tests/__tests__/        # Tests Jest (jsdom, et bout-en-bout via Puppeteer)
├── tests-esm/              # Tests Jest en modules ES (.mjs)
├── scripts/                # Génération d'assets, i18n, rapports
│   └── voice/              # Voix enregistrée : corpus, génération, écoute, publication
├── docs/media/             # Captures et animations du README
└── dist/                   # Build de production (généré)
```

### Arquitectura técnica

**Módulos ES6 modernos**: El proyecto utiliza una arquitectura modular con clases ES6 e importaciones/exportaciones nativas.

**Componentes reutilizables**: Interfaz construida con componentes de interfaz de usuario centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Carga inteligente de módulos bajo demanda mediante `lazy-loader.js` para optimizar el rendimiento inicial.

**Sistema de almacenamiento unificado**: API centralizada para la persistencia de los datos del usuario a través de LocalStorage con mecanismos de reserva (fallbacks).

**Gestión de audio centralizada**: Control del sonido con soporte multilingüe y preferencias por usuario.

**Event Bus**: Comunicación desacoplada basada en eventos entre componentes para una arquitectura mantenible.

**Navegación por diapositivas**: Sistema de navegación basado en diapositivas numeradas (slide0, slide1, etc.) con `goToSlide()`.

**Seguridad**: Protección contra XSS y sanitización mediante `security-utils.js` para todas las manipulaciones del DOM.

## 🎯 Modos de juego detallados

### Modo Descubrimiento

Interfaz de exploración visual de las tablas de multiplicar con:

- Visualización interactiva de las multiplicaciones
- Animaciones y reglas mnemotécnicas
- Arrastrar y soltar educativo
- Progresión libre por tabla

### Modo Quiz

Preguntas de opción múltiple con:

- 10 preguntas por sesión
- Progresión adaptativa según los aciertos
- Teclado numérico virtual
- Sistema de racha (streak de respuestas correctas)

### Modo Desafío

Carrera contra el reloj con:

- 3 niveles de dificultad (Principiante, Medio, Difícil)
- Bonificación de tiempo por respuestas correctas
- Sistema de vidas
- Clasificación de mejores puntuaciones

### Modo Aventura

Progresión narrativa con:

- 10 niveles temáticos desbloqueables
- Mapa interactivo con progresión visual
- Historia inmersiva con personajes
- Sistema de estrellas y recompensas

### Minijuegos Arcade

Cada minijuego ofrece:

- Elección de dificultad y personalización
- Sistema de vidas y puntuación
- Controles por teclado y táctiles
- Clasificaciones individuales por usuario

## 🔧 Desarrollo

### Flujo de trabajo de desarrollo

**No hacer commit nunca directamente en main.** El proyecto trabaja mediante ramas de
funcionalidad.

**1. Crear una rama**, `feat/` para una funcionalidad, `fix/` para una corrección:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Desarrollar y verificar.** El formateo va primero: la CI lo rechaza
incluso antes de ejecutar los tests.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Hacer commit en la rama** y luego subirla:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Abrir una pull request** y esperar los análisis: verify, Codacy,
CodeFactor y SonarCloud. Se corrige hasta que todo esté en verde antes de fusionar.

**Estilo de commit**: Mensajes concisos, modo imperativo (ej.: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Asegurarse de que `npm run lint`, `npm test` y `npm run test:coverage` pasen antes de cada commit

### Arquitectura de componentes

**GameMode (clase base)**: Todos los modos heredan de una clase común con métodos estandarizados.

**GameModeManager**: Orquestación centralizada del inicio y gestión de los modos.

**Componentes UI**: TopBar, InfoBar, Dashboard y Customization proporcionan una interfaz coherente.

**Lazy Loading**: Los módulos se cargan bajo demanda para optimizar el rendimiento inicial.

**Event Bus**: Comunicación desacoplada entre componentes a través del sistema de eventos.

### Tests

El proyecto incluye una suite de pruebas completa:

- Pruebas unitarias de los módulos principales
- Pruebas de integración de componentes
- Pruebas de los modos de juego
- Cobertura de código automatizada

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Build de producción

- **Rollup**: Empaqueta `js/main-es6.js` en ESM con code-splitting y sourcemaps
- **Terser**: Minificación automática para optimización
- **Post-build**: Copia `css/` y `assets/`, los favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js` y reescribe `dist/index.html` hacia el archivo de entrada con hash (ej.: `main-es6-*.js`)
- **Carpeta final**: `dist/` lista para servirse estáticamente

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integración Continua

**GitHub Actions**: `.github/workflows/ci.yml`, activado en cada push a
`main` y en cada pull request.

**`verify`** — la puerta de calidad, bloqueante:

- `npm ci` y luego `npm run verify` (ESLint, pruebas Jest, cobertura)
- `npm run format:check` (Prettier)

**`seo-report`** — tras `verify`: auditoría de Lighthouse del sitio en línea, para
hacer un seguimiento de las métricas SEO a lo largo del tiempo.

**Análisis externos** vinculados a las pull requests: Codacy, CodeFactor y
SonarCloud. La puerta de SonarCloud exige calificaciones A en fiabilidad, seguridad y
mantenibilidad en el código nuevo.

**Despliegue**: `./deploy.sh` sincroniza el sitio con S3 e invalida la caché de
CloudFront. El script regenera, en caso necesario, las imágenes adaptativas que no están en git.

### PWA (Progressive Web App)

LeapMultix es una PWA completa con soporte sin conexión y posibilidad de instalación.

**Service Worker** (`sw.js`):

- Navegación: Network-first con reserva sin conexión hacia `offline.html`
- Imágenes: Cache-first para optimizar el rendimiento
- Traducciones: Stale-while-revalidate para actualización en segundo plano
- JS/CSS: Network-first para servir siempre la última versión
- Gestión automática de versiones mediante `cache-updater.js`

**Manifest** (`manifest.json`):

- Iconos SVG y PNG para todos los dispositivos
- Posibilidad de instalación en dispositivos móviles (Add to Home Screen)
- Configuración independiente para una experiencia app-like
- Compatibilidad con temas y colores

**Probar el modo sin conexión localmente.** Iniciar el servidor y luego abrir
`http://localhost:8080` (o el puerto mostrado):

```bash
npm run serve
```

De forma manual: cortar la red en las herramientas de desarrollo (pestaña Red,
modo sin conexión) y recargar la página. Debe mostrarse `offline.html`.

De forma automática, con Puppeteer:

```bash
npm run test:pwa-offline
```

**Scripts de gestión del Service Worker**:

```bash
npm run sw:disable  # Désactiver le service worker
npm run sw:fix      # Corriger les problèmes de cache
```

### Estándares de calidad

**Herramientas de calidad del código**:

- **ESLint**: Configuración moderna con flat config (`eslint.config.js`), soporte ES2022
- **Prettier**: Formateo automático del código (`.prettierrc`)
- **Stylelint**: Validación de CSS (`.stylelintrc.json`)
- **JSDoc**: Documentación automática de funciones con análisis de cobertura

**Reglas de código importantes**:

- Eliminar las variables y parámetros no utilizados (`no-unused-vars`)
- Utilizar una gestión de errores específica (sin bloques catch vacíos)
- Evitar `innerHTML` en favor de las funciones `security-utils.js`
- Mantener una complejidad cognitiva < 15 para las funciones
- Extraer las funciones complejas en helpers más pequeños

**Seguridad**:

- **Protección XSS**: Utilizar las funciones de `security-utils.js`:
  - `appendSanitizedHTML()` en lugar de `innerHTML`
  - `createSafeElement()` para crear elementos seguros
  - `setSafeMessage()` para el contenido de texto
- **Scripts externos**: Atributo `crossorigin="anonymous"` obligatorio
- **Validación de entradas**: Sanitizar siempre los datos externos
- **Content Security Policy**: Encabezados CSP para restringir los orígenes de scripts

**Accesibilidad**:

- Conformidad con WCAG 2.1 AA
- Navegación completa por teclado
- Roles ARIA y etiquetas adecuadas
- Contrastes de color conformes

**Rendimiento**:

- Carga diferida (lazy loading) de módulos mediante `lazy-loader.js`
- Optimizaciones de CSS y recursos adaptables
- Service Worker para almacenamiento en caché inteligente
- División de código (code splitting) y minificación en producción

## 📱 Compatibilidad

### Navegadores compatibles

La interfaz se basa en `oklch()` para los colores y en `:has()` para los
estados contextuales, lo que establece el requisito mínimo:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispositivos

- **Escritorio**: Controles con teclado y ratón
- **Tabletas**: Interfaz táctil optimizada
- **Smartphones**: Diseño adaptable y responsivo

### Accesibilidad

- Navegación completa por teclado (Tab, flechas, Esc)
- Roles ARIA y etiquetas para lectores de pantalla
- Contrastes de color conformes
- Soporte para tecnologías de asistencia

## 🌍 Localización

Soporte multilingüe completo:

- **Francés** (idioma por defecto)
- **Inglés**
- **Español**

### Gestión de traducciones

**Archivos de traducción:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Commencer",
  "quiz_correct": "Bravo !",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripts de gestión de i18n

**`npm run i18n:verify`** - Comprobar la coherencia de las claves de traducción

**`npm run i18n:unused`** - Listar las claves de traducción no utilizadas

**`npm run i18n:compare`** - Comparar los archivos de traducción con fr.json (referencia)

Este script (`scripts/compare-translations.cjs`) asegura la sincronización de todos los archivos de idioma:

**Funcionalidades:**

- Detección de claves faltantes (presentes en fr.json pero ausentes en otros idiomas)
- Detección de claves adicionales (presentes en otros idiomas pero no en fr.json)
- Identificación de valores vacíos (`""`, `null`, `undefined`, `[]`)
- Verificación de coherencia de tipos (string vs array)
- Aplanamiento de estructuras JSON anidadas mediante notación por puntos (ej.: `arcade.multiMemory.title`)
- Generación de un informe detallado en consola
- Guardado del informe JSON en `docs/translations-comparison-report.json`

**Ejemplo de salida:**

```
🔍 Analyse comparative des fichiers de traduction

📚 Langue de référence: fr.json
✅ fr.json: 570 clés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de clés: 570
✅ Aucune clé manquante
✅ Aucune clé supplémentaire
✅ Aucune valeur vide

📊 RÉSUMÉ FINAL
  fr.json: 570 clés
  en.json: 570 clés
  es.json: 570 clés

✅ Tous les fichiers de traduction sont parfaitement synchronisés !
```

**Cobertura de las traducciones:**

- Interfaz de usuario completa
- Instrucciones de los juegos
- Mensajes de error y de retroalimentación
- Descripciones y ayuda contextual
- Contenido narrativo del modo Aventura
- Etiquetas de accesibilidad y ARIA

## 🔊 Voz grabada

El juego lee en voz alta las preguntas, los ánimos y las explicaciones. Solo pronuncia un conjunto finito de frases, alrededor de 7 400 por idioma: por lo tanto, pueden grabarse de una vez por todas y ninguna partida llama a un servicio de síntesis. Sin clips, el juego lee con la voz del dispositivo.

### En este repositorio: la aplicación, sin las voces

El código puede reproducir clips pregrabados y contiene la cadena que los genera. Los clips no están incluidos, como tampoco las claves de los proveedores: una bifurcación (fork) o una instalación local lee con la voz del dispositivo.

- **Recurso automático** a la voz del dispositivo, frase por frase: clip ausente o con error, reproducción rechazada por el navegador, clip que no se inicia en 1,5 s o sin conexión sin el clip en caché.
- **Ajustes**: el botón de voz de la barra superior activa o desactiva la reproducción; la casilla «Voz grabada» (Accesibilidad y controles) permite elegir entre la voz grabada y la voz del dispositivo. Solo aparece en los idiomas en los que se ha publicado una voz.
- **Sin conexión**: los clips ya escuchados permanecen en caché (service worker).
- **Dónde busca el juego los clips**: en la etiqueta `<meta name="leapmultix-voice-base">`, vacía en el repositorio. Solo el despliegue de producción escribe allí `/voice/`.

Con sus propios clips en el equipo (generados por la cadena descrita a continuación, ubicados junto al juego en `../leapmultix-voices`), el parámetro `?voix=local` hace que el servidor de desarrollo los reproduzca:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run voice:publish -- local --lang en --audience all --default-on
npm run voice:publish -- local --lang en --version jane-v1-1 --audience all   # autre voix de l'anglais (menu « Voix »)
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### En leapmultix.jls42.org: las voces del alojamiento

El sitio web ofrecido por el autor proporciona voces sintéticas grabadas:

- en francés, **Lucie**, creada con ElevenLabs (modelo Eleven v3);
- en inglés británico y en español de España, **Sulafat**, creada con Google Cloud Text-to-Speech (voz Chirp 3 HD);
- en inglés, a elección del jugador, **Jane**, creada con Mistral AI (Voxtral TTS).

Los clips residen en un repositorio privado y en un bucket S3 dedicado, servido por CloudFront en `/voice/*`. En los ajustes, el menú «Voz» ofrece las voces del idioma cuando hay varias disponibles, y una mención indica el servicio de la voz escuchada.

### Generar los clips

La cadena está automatizada mediante scripts en `scripts/voice/` y se ejecuta en el equipo del propietario, nunca en la CI pública. Las claves de los proveedores (ElevenLabs para el francés, Google Cloud Text-to-Speech para el inglés y el español, Mistral para Jane) permanecen en un archivo `.env` fuera del repositorio, pasado mediante `node --env-file`: ninguna clave entra en git. La skill de Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) detalla el procedimiento paso a paso (puertas, aprobaciones, reanudaciones); los detalles se encuentran en [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimar** las frases restantes y los caracteres que se deben abonar (Eleven v3: aproximadamente 0,53 créditos por carácter; Chirp 3 HD: 30 $ por millón de caracteres, con el primer millón mensual gratis; Voxtral TTS: 16 $ por millón).
2. **Generar**. Volver a ejecutar el mismo comando retoma lo que falta. Cuando se agotan los créditos, el script se detiene de forma limpia (código 3) sin dejar ningún archivo a medio escribir. `--max-total-chars` limita el gasto acumulado de la versión: cada respuesta pagada se registra tan pronto como se recibe en un registro que sobrevive a una detención abrupta. En el caso de Google y Mistral, que no ofrecen ningún saldo legible, esta es la única protección.
3. **Controlar**: cada frase tiene su clip y cada MP3 es válido. A continuación, Whisper transcribe cada clip en local y el control señala los números mal reconocidos y las duraciones anormales. `voice:review` encadena Whisper, este control y la página de escucha en un solo comando.
4. **Escuchar** en la página de escucha (`voice:listen`) los clips señalados y una muestra de formas femeninas («une fois 7»), que Whisper no distingue. Cada clip tiene una casilla «por rehacer», que lo añade a la lista de clips descartados.
5. **Rehacer** los clips descartados (`--redo`) y volver a ejecutar Whisper, para luego comparar cada clip antes y después en una segunda página. Un clip que aún no se pronuncie correctamente después de dos o tres intentos recibe un texto forzado en `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), por ejemplo, el número escrito con letras.
6. **Publicar** los clips, comprobar que respondan en línea y luego publicar el índice del idioma, inicialmente para los evaluadores (`?voix=test`).
7. **Abrir** la voz a todos y, a continuación, activarla por defecto. El mecanismo de desconexión (`voice:publish -- remove`) retira un idioma del índice: el juego vuelve a la voz del dispositivo.

```bash
# 1. Estimer (sans frais)
npm run voice:generate -- --lang fr --dry-run
# 2. Générer (payant), plafond cumulé en caractères ; --reserve protège les crédits ElevenLabs
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --reserve 5000 --max-total-chars <plafond>
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang en --max-total-chars <plafond>
# 3. Contrôler : Whisper (installé une fois : voir l'en-tête de whisper_transcribe.py), contrôle, page d'écoute
npm run voice:review -- --lang fr
npm run voice:check -- --lang fr --probe
# 4. Écouter sur la page indiquée (la liste « à refaire » va dans ecartes.txt)
# 5. Refaire (payant), puis comparer avant/après (Whisper ne transcrit que les clips refaits)
node --env-file=<fichier .env hors dépôt> scripts/voice/generate.mjs --lang fr --redo ecartes.txt --max-total-chars <plafond>
npm run voice:review -- --lang fr --compare ecartes.txt
# 6. Publier
npm run voice:publish -- clips --lang fr --bucket <bucket>
npm run voice:check-online -- --lang fr
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience test
# 7. Ouvrir
npm run voice:publish -- index --lang fr --bucket <bucket> --distribution <id> --audience all --default-on
```

### Regla: una frase locutada que se modifique debe volver a grabarse antes de pasar a producción

Cualquier frase hablada procede de las traducciones (`assets/translations/{fr,en,es}.json`) y forma parte del corpus. Por lo tanto, modificar una frase hablada hace que falle la prueba de bloqueo del corpus (`scripts/voice/corpus.lock.json`). Para un idioma que cuente con su propia voz grabada, se generan entonces los clips de las frases afectadas, se verifican y escuchan, y luego se publican **antes** de fusionar. Finalmente, se actualiza el bloqueo (`npm run voice:corpus:lock`). Sin estos clips, la frase modificada se reproduce con la voz del dispositivo.

## 📊 Almacenamiento de datos

### Datos de usuario

- Perfiles y preferencias
- Progreso por modo de juego
- Puntuaciones y estadísticas de los juegos arcade
- Parámetros de personalización

### Características técnicas

- Almacenamiento local (localStorage) con mecanismos de reserva (fallbacks)
- Aislamiento de datos por usuario
- Guardado automático del progreso
- Migración automática de datos antiguos

## 🐛 Reportar un problema

Los problemas se pueden reportar a través de las issues de GitHub. Por favor, incluya:

- Descripción detallada del problema
- Pasos para reproducirlo
- Navegador y versión
- Capturas de pantalla si son pertinentes

## 💝 Apoyar el proyecto

**[☕ Hacer una donación a través de PayPal](https://paypal.me/jls)**

## 📄 Licencia

Este proyecto está bajo la licencia AGPL v3. Consulte el archivo `LICENSE` para obtener más detalles.

---

_LeapMultix — aplicación educativa libre para aprender las cuatro operaciones_

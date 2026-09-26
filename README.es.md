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
[![Insignia de Codacy](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Estado de la puerta de calidad](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Índice de fiabilidad](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Índice de seguridad](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Índice de mantenibilidad](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Deuda técnica](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Errores](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Vulnerabilidades](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Líneas duplicadas (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Líneas de código](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

## Índice

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
- [Informar de un problema](#-informar-de-un-problema)
- [Licencia](#-licencia)

## Descripción

LeapMultix es una aplicación web educativa interactiva destinada a niños de 6 a 12 años para dominar las 4 operaciones aritméticas: multiplicación (×), suma (+), resta (−) y división (÷). Ofrece **5 modos de juego** y **4 minijuegos arcade** en una interfaz intuitiva, accesible y multilingüe.

**Compatibilidad con múltiples operaciones:** los cinco modos admiten las cuatro operaciones. La elección se realiza en la pantalla de inicio y se aplica a todo el recorrido.

**Desarrollado por:** Julien LS (contact@jls42.org)

**URL en línea:** https://leapmultix.jls42.org/

## 📸 Vista previa

### Las pantallas

|                                                                                                                       |                                                                                                                      |
| :-------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: |
|                     ![Pantalla «¿Quién juega?»: elección del perfil](docs/media/01-accueil.webp)                      |              ![Menú principal: elección de la operación y de los cinco modos](docs/media/02-menu.webp)               |
|                         **¿Quién juega?** — un perfil por niño, con su avatar y su progreso.                          |                     **El menú** — aquí se elige la operación y después se abren los cinco modos.                     |
|               ![Modo Descubrimiento: la tabla del 4 mostrada con puntos](docs/media/03-decouverte.webp)               |               ![Modo Quiz: respuesta incorrecta en rojo y correcta en verde](docs/media/04-quiz.webp)                |
|    **Descubrimiento** — cada igualdad se muestra mediante puntos, saltos o conteo, junto con el truco de la tabla.    | **Quiz** — la elección del niño permanece visible junto a la respuesta correcta y la explicación detalla el cálculo. |
|                         ![Modo Desafío: cuenta atrás y racha actual](docs/media/05-defi.webp)                         |        ![Modo Aventura: mapa de los diez niveles, con los siguientes bloqueados](docs/media/06-aventure.webp)        |
| **Desafío** — carrera contrarreloj. Tras un error, el cronómetro se detiene para permitir leer la respuesta correcta. |                    **Aventura** — diez niveles que se abren uno tras otro a cambio de estrellas.                     |
|                           ![Menú Arcade: los cuatro minijuegos](docs/media/07-arcade.webp)                            |             ![Panel de control: estrellas por tabla y estadísticas](docs/media/08-tableau-de-bord.webp)              |
|                    **Arcade** — cuatro minijuegos, con ajuste de dificultad y elección de la nave.                    |               **Panel de control** — estrellas por tabla, tablas para repasar y puntuaciones por modo.               |
|               ![Personalización: avatares, temas y accesibilidad](docs/media/09-personnalisation.webp)                |                                                                                                                      |
|          **Personalización** — avatar, tema de colores, tamaño del texto, contraste alto y código parental.           |                                                                                                                      |

### Los minijuegos arcade

Cuatro juegos que plantean la misma pregunta —la que aparece sobre la zona de
juego, junto con el tiempo restante y las vidas—, pero exigen cada vez una acción
diferente.

|                                                                                                                                      |                                                                                                             |
| :----------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
|   ![MultiInvaders: monstruos que llevan números y una nave en la parte inferior de la pantalla](docs/media/10-multiinvaders.webp)    | ![MultiMiam: un laberinto donde las bolitas muestran las posibles respuestas](docs/media/11-multimiam.webp) |
|      **MultiInvaders** — disparar a las respuestas incorrectas y evitar la correcta: oculta a un amigo al que hay que liberar.       |     **MultiMiam** — recorrer el laberinto para atrapar el resultado correcto evitando a los monstruos.      |
| ![MultiMemory: una cuadrícula de cartas, dos de ellas descubiertas mostrando un cálculo y un número](docs/media/12-multimemory.webp) |       ![MultiSnake: una serpiente y manzanas numeradas en una pradera](docs/media/13-multisnake.webp)       |
|                         **MultiMemory** — recordar qué carta contiene el resultado del cálculo descubierto.                          |              **MultiSnake** — crecer comiendo los números correctos y evitar todos los demás.               |

## ✨ Características

### 🎮 Modos de juego

- **Modo Descubrimiento**: exploración visual e interactiva adaptada a cada operación
- **Modo Quiz**: preguntas de opción múltiple compatibles con las 4 operaciones (×, +, −, ÷) y progreso adaptativo
- **Modo Desafío**: carrera contrarreloj con las 4 operaciones (×, +, −, ÷) y diferentes niveles de dificultad
- **Modo Aventura**: progreso narrativo por niveles compatible con las 4 operaciones

### 🕹️ Minijuegos arcade

- **MultiInvaders**: Space Invaders educativo - Destruir las respuestas incorrectas
- **MultiMiam**: Pac-Man matemático - Recoger las respuestas correctas
- **MultiMemory**: juego de memoria - Asociar operaciones y resultados
- **MultiSnake**: Snake educativo - Crecer comiendo los números correctos

### ➕ Compatibilidad con múltiples operaciones

LeapMultix ofrece un entrenamiento completo de las 4 operaciones aritméticas en **todos los modos**:

| Modo           | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| Quiz           | ✅  | ✅  | ✅  | ✅  |
| Desafío        | ✅  | ✅  | ✅  | ✅  |
| Descubrimiento | ✅  | ✅  | ✅  | ✅  |
| Aventura       | ✅  | ✅  | ✅  | ✅  |
| Arcade         | ✅  | ✅  | ✅  | ✅  |

### 🌍 Características transversales

- **Múltiples usuarios**: gestión de perfiles individuales con el progreso guardado
- **Multilingüe**: compatible con francés, inglés y español
- **Personalización**: avatares, temas de color y fondos
- **Accesibilidad**: navegación mediante teclado, compatibilidad táctil y conformidad con WCAG 2.1 AA
- **Voz grabada**: preguntas y mensajes de ánimo leídos por una voz sintética pregrabada (Lucie en francés, creada con ElevenLabs; Jane en inglés, creada con Mistral AI), con cambio automático a la voz del dispositivo; clips fuera del repositorio público (véase [Voz grabada](#-voz-grabada))
- **Diseño adaptable para móviles**: interfaz optimizada para tabletas y smartphones
- **Sistema de progreso**: puntuaciones, insignias y desafíos diarios

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
npm run voice:generate     # Générer les clips (ElevenLabs ou Mistral)
npm run voice:check        # Contrôler les clips (fichiers, MP3, Whisper)
npm run voice:review       # Whisper, contrôle et page d'écoute en une commande
npm run voice:listen       # Page d'écoute : clips signalés, avant/après
npm run voice:publish      # Publier les clips et l'index de la langue
npm run voice:check-online # Vérifier les clips servis en ligne
```

## 🧱 Arquitectura

### Estructura de archivos

Los módulos JavaScript están **todos al mismo nivel en `js/`**, salvo tres carpetas:
`core/`, `components/` y `modes/`. Por tanto, el nombre del archivo es el que indica la
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

**Módulos ES6 modernos**: el proyecto utiliza una arquitectura modular con clases ES6 e imports/exports nativos.

**Componentes reutilizables**: interfaz construida con componentes UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: carga inteligente de módulos bajo demanda mediante `lazy-loader.js` para optimizar el rendimiento inicial.

**Sistema de almacenamiento unificado**: API centralizada para la persistencia de los datos de usuario mediante LocalStorage con fallbacks.

**Gestión de audio centralizada**: control del sonido con compatibilidad multilingüe y preferencias por usuario.

**Event Bus**: comunicación basada en eventos y desacoplada entre componentes para lograr una arquitectura mantenible.

**Navegación por slides**: sistema de navegación basado en slides numerados (slide0, slide1, etc.) con `goToSlide()`.

**Seguridad**: protección contra XSS y sanitización mediante `security-utils.js` para todas las manipulaciones del DOM.

## 🎯 Modos de juego detallados

### Modo Descubrimiento

Interfaz de exploración visual de las tablas de multiplicar con:

- Visualización interactiva de las multiplicaciones
- Animaciones y ayudas mnemotécnicas
- Funcionalidad educativa de arrastrar y soltar
- Progreso libre por tabla

### Modo Quiz

Preguntas de opción múltiple con:

- 10 preguntas por sesión
- Progreso adaptativo según los aciertos
- Teclado numérico virtual
- Sistema de streak (racha de respuestas correctas)

### Modo Desafío

Carrera contrarreloj con:

- 3 niveles de dificultad (Principiante, Medio, Difícil)
- Bonificación de tiempo por las respuestas correctas
- Sistema de vidas
- Clasificación de las mejores puntuaciones

### Modo Aventura

Progreso narrativo con:

- 10 niveles temáticos desbloqueables
- Mapa interactivo con progreso visual
- Historia inmersiva con personajes
- Sistema de estrellas y recompensas

### Minijuegos arcade

Cada minijuego ofrece:

- Elección de dificultad y personalización
- Sistema de vidas y puntuación
- Controles mediante teclado y pantalla táctil
- Clasificaciones individuales por usuario

## 🔧 Desarrollo

### Workflow de desarrollo

**Nunca hacer commit directamente en main.** El proyecto trabaja con ramas de
funcionalidad.

**1. Crear una rama**, `feat/` para una funcionalidad, `fix/` para una corrección:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Desarrollar y verificar.** El formato es lo primero: la CI lo rechaza
incluso antes de ejecutar los tests.

```bash
npm run format:check  # TOUJOURS en premier : la CI refuse un code non formaté
npm run format        # Formater si nécessaire
npm run lint          # Qualité du code
npm run test          # Tests
npm run test:coverage # Couverture
```

**3. Hacer commit en la rama** y después hacer push:

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push -u origin feat/nom-de-la-fonctionnalite
```

**4. Abrir una pull request** y esperar los análisis: verify, Codacy,
CodeFactor y SonarCloud. Se corrigen los problemas hasta que todo esté en verde antes de fusionar.

**Estilo de commit**: mensajes concisos en modo imperativo (por ejemplo: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: asegurarse de que `npm run lint`, `npm test` y `npm run test:coverage` se completen correctamente antes de cada commit

### Arquitectura de los componentes

**GameMode (clase base)**: todos los modos heredan de una clase común con métodos estandarizados.

**GameModeManager**: coordinación centralizada del inicio y la gestión de los modos.

**Componentes UI**: TopBar, InfoBar, Dashboard y Customization proporcionan una interfaz coherente.

**Lazy Loading**: los módulos se cargan bajo demanda para optimizar el rendimiento inicial.

**Event Bus**: comunicación desacoplada entre componentes mediante el sistema de eventos.

### Tests

El proyecto incluye una suite de tests completa:

- Tests unitarios de los módulos core
- Tests de integración de los componentes
- Tests de los modos de juego
- Cobertura de código automatizada

```bash
npm test              # Tous les tests (CJS)
npm test:core         # Tests des modules centraux
npm test:integration  # Tests d'intégration
npm test:coverage     # Rapport de couverture
npm run test:esm      # Tests ESM (ex: components/dashboard) via vm-modules
```

### Build de producción

- **Rollup**: empaqueta `js/main-es6.js` en ESM con code-splitting y sourcemaps
- **Terser**: minificación automática para la optimización
- **Post-build**: copia `css/` y `assets/`, los favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, y reescribe `dist/index.html` para que apunte al archivo de entrada con hash (por ejemplo: `main-es6-*.js`)
- **Carpeta final**: `dist/` lista para servirse de forma estática

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integración continua

**GitHub Actions**: `.github/workflows/ci.yml`, activado con cada push a
`main` y con cada pull request.

**`verify`** — la puerta de calidad, bloqueante:

- `npm ci` y después `npm run verify` (ESLint, tests Jest, cobertura)
- `npm run format:check` (Prettier)

**`seo-report`** — después de `verify`: auditoría Lighthouse del sitio en línea para
supervisar las métricas SEO a lo largo del tiempo.

**Análisis externos** conectados a las pull requests: Codacy, CodeFactor y
SonarCloud. La puerta de SonarCloud exige calificaciones A en fiabilidad, seguridad y
mantenibilidad para el código nuevo.

**Despliegue**: `./deploy.sh` sincroniza el sitio con S3 e invalida la caché de
CloudFront. El script vuelve a generar cuando es necesario las imágenes adaptables, que no están incluidas en git.

### PWA (Progressive Web App)

LeapMultix es una PWA completa con compatibilidad sin conexión y posibilidad de instalación.

**Service Worker** (`sw.js`):

- Navegación: Network-first con fallback sin conexión a `offline.html`
- Imágenes: Cache-first para optimizar el rendimiento
- Traducciones: Stale-while-revalidate para la actualización en segundo plano
- JS/CSS: Network-first para servir siempre la última versión
- Gestión automática de versiones mediante `cache-updater.js`

**Manifest** (`manifest.json`):

- Iconos SVG y PNG para todos los dispositivos
- Posibilidad de instalación en dispositivos móviles (Add to Home Screen)
- Configuración standalone para una experiencia similar a una aplicación
- Compatibilidad con temas y colores

**Probar el modo sin conexión localmente.** Iniciar el servidor y después abrir
`http://localhost:8080` (o el puerto mostrado):

```bash
npm run serve
```

Manualmente: desconectar la red en las herramientas de desarrollo (pestaña Red,
modo sin conexión) y después actualizar la página. Debe mostrarse `offline.html`.

Automáticamente, con Puppeteer:

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

- **ESLint**: Configuración moderna con flat config (`eslint.config.js`), compatibilidad con ES2022
- **Prettier**: Formateo automático del código (`.prettierrc`)
- **Stylelint**: Validación de CSS (`.stylelintrc.json`)
- **JSDoc**: Documentación automática de las funciones con análisis de cobertura

**Reglas de código importantes**:

- Eliminar las variables y los parámetros no utilizados (`no-unused-vars`)
- Utilizar una gestión de errores específica (sin catch vacíos)
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
- **Content Security Policy**: Headers CSP para restringir las fuentes de scripts

**Accesibilidad**:

- Conformidad con WCAG 2.1 AA
- Navegación completa mediante teclado
- Roles ARIA y labels adecuados
- Contrastes de color conformes

**Rendimiento**:

- Lazy loading de módulos mediante `lazy-loader.js`
- Optimizaciones de CSS y assets responsivos
- Service Worker para almacenamiento inteligente en caché
- Code splitting y minificación en producción

## 📱 Compatibilidad

### Navegadores compatibles

La interfaz se basa en `oklch()` para los colores y en `:has()` para los
estados contextuales, lo que establece los requisitos mínimos:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispositivos

- **Desktop**: Controles mediante teclado y ratón
- **Tablets**: Interfaz táctil optimizada
- **Smartphones**: Diseño responsive adaptativo

### Accesibilidad

- Navegación completa mediante teclado (Tab, flechas, Escape)
- Roles ARIA y labels para lectores de pantalla
- Contrastes de color conformes
- Compatibilidad con tecnologías de asistencia

## 🌍 Localización

Compatibilidad multilingüe completa:

- **Francés** (idioma predeterminado)
- **Inglés**
- **Español**

### Gestión de las traducciones

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

**`npm run i18n:unused`** - Enumerar las claves de traducción no utilizadas

**`npm run i18n:compare`** - Comparar los archivos de traducción con fr.json (referencia)

Este script (`scripts/compare-translations.cjs`) garantiza la sincronización de todos los archivos de idioma:

**Funcionalidades:**

- Detección de claves ausentes (presentes en fr.json pero ausentes en otros idiomas)
- Detección de claves adicionales (presentes en otros idiomas pero no en fr.json)
- Identificación de valores vacíos (`""`, `null`, `undefined`, `[]`)
- Comprobación de la coherencia de tipos (string frente a array)
- Aplanamiento de estructuras JSON anidadas mediante notación de puntos (p. ej.: `arcade.multiMemory.title`)
- Generación de un informe detallado en la consola
- Almacenamiento del informe JSON en `docs/translations-comparison-report.json`

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
- Mensajes de error y de feedback
- Descripciones y ayuda contextual
- Contenido narrativo del modo Aventura
- Labels de accesibilidad y ARIA

## 🔊 Voz grabada

El juego lee en voz alta las preguntas, los mensajes de ánimo y las explicaciones mediante una voz de síntesis grabada previamente:

- en francés, **Lucie**, creada con ElevenLabs (modelo Eleven v3);
- en inglés, **Jane**, creada con Mistral AI (Voxtral TTS).

El juego solo pronuncia un conjunto finito de frases, unas 7400 por idioma: todas se graban previamente y ninguna parte llama a un servicio de síntesis. Por ahora, el español mantiene la voz del dispositivo.

- **Fallback automático** a la voz del dispositivo, frase por frase: clip ausente o con errores, reproducción rechazada por el navegador, clip que no se inicia en 1,5 s o modo offline sin el clip en caché.
- **Ajustes**: el botón de voz de la barra superior activa o desactiva la reproducción; la casilla «Voz grabada» (Accesibilidad y controles) permite elegir entre la voz grabada (Lucie o Jane) y la voz del dispositivo.
- **Offline**: los clips ya escuchados permanecen en caché (service worker).

### Los clips no están en este repositorio

Los clips se encuentran en un repositorio privado y en un bucket S3 dedicado, servido mediante CloudFront en `/voice/*`. Por tanto, un fork o el desarrollo local mantiene la voz del dispositivo: en el repositorio, la etiqueta `<meta name="leapmultix-voice-base">` está vacía y solo el despliegue de producción escribe en ella `/voice/`.

Con los clips en el equipo (repositorio privado clonado junto al juego, en `../leapmultix-voices`), el parámetro `?voix=local` hace que el servidor de desarrollo los reproduzca:

```bash
npm run voice:publish -- local --lang fr --audience all --default-on   # relie voice/ (ignoré par git) aux clips
npm run serve
# puis ouvrir http://localhost:8080/index.html?voix=local
```

### Generar los clips

El proceso está automatizado mediante scripts en `scripts/voice/` y se ejecuta en el equipo del propietario, nunca en la CI pública. Las claves de los proveedores (ElevenLabs para el francés y Mistral para el inglés) permanecen en un archivo `.env` fuera del repositorio, pasado mediante `node --env-file`: ninguna clave entra en git. El skill de Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) detalla el procedimiento paso a paso (controles, aprobaciones y reanudaciones); los detalles se encuentran en [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimar** las frases restantes y los caracteres que deben pagarse (Eleven v3: aproximadamente 0,53 créditos por carácter; Voxtral TTS: 16 $ por millón de caracteres).
2. **Generar**. Volver a ejecutar el mismo comando reanuda lo que falta. Cuando se agotan los créditos, el script se detiene correctamente (código 3) sin dejar ningún archivo escrito a medias. `--max-total-chars` limita el gasto acumulado de la versión: cada respuesta pagada se registra en cuanto se recibe en un registro que sobrevive a una interrupción brusca. Con Mistral, que no proporciona ningún saldo consultable, esta es la única protección.
3. **Comprobar**: cada frase tiene su clip y cada MP3 es válido. A continuación, Whisper transcribe cada clip localmente y la comprobación señala los números mal interpretados y las duraciones anómalas. `voice:review` encadena Whisper, esta comprobación y la página de escucha en un solo comando.
4. **Escuchar** en la página de escucha (`voice:listen`) los clips señalados y una muestra de formas femeninas («una vez 7»), que Whisper no distingue. Cada clip tiene una casilla «rehacer» que lo añade a la lista de clips descartados.
5. **Rehacer** los clips descartados (`--redo`) y volver a ejecutar Whisper; después, comparar cada clip antes y después en una segunda página. Un clip que siga pronunciándose mal tras dos o tres intentos recibe un texto impuesto en `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), por ejemplo, el número escrito con letras.
6. **Publicar** los clips, comprobar que responden online y, a continuación, publicar el índice del idioma, primero para los testers (`?voix=test`).
7. **Habilitar** la voz para todos y después activarla de forma predeterminada. El kill switch (`voice:publish -- remove`) elimina un idioma del índice: el juego vuelve a utilizar la voz del dispositivo.

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

### Regla: cualquier frase pronunciada que se modifique debe volver a grabarse antes de pasar a producción

Todas las frases pronunciadas proceden de las traducciones (`assets/translations/{fr,en,es}.json`) y forman parte del corpus. Por tanto, cambiar una frase hablada hace que falle el test del bloqueo del corpus (`scripts/voice/corpus.lock.json`). Para un idioma que tenga voz grabada, se generan los clips de las frases afectadas, se comprueban y se escuchan y, después, se publican **antes** de hacer merge. Finalmente, se actualiza el bloqueo (`npm run voice:corpus:lock`). Sin estos clips, la frase modificada se reproduce con la voz del dispositivo.

## 📊 Almacenamiento de datos

### Datos de usuario

- Perfiles y preferencias
- Progreso por modo de juego
- Puntuaciones y estadísticas de los juegos arcade
- Parámetros de personalización

### Funcionalidades técnicas

- Almacenamiento local (localStorage) con fallbacks
- Aislamiento de datos por usuario
- Guardado automático del progreso
- Migración automática de datos antiguos

## 🐛 Informar de un problema

Los problemas pueden notificarse mediante las issues de GitHub. Incluye:

- Descripción detallada del problema
- Pasos para reproducirlo
- Navegador y versión
- Capturas de pantalla si son pertinentes

## 💝 Apoyar el proyecto

**[☕ Hacer una donación mediante PayPal](https://paypal.me/jls)**

## 📄 Licencia

Este proyecto está bajo la licencia AGPL v3. Consulta el archivo `LICENSE` para obtener más información.

---

_LeapMultix — aplicación educativa libre para aprender las cuatro operaciones_

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
[![Estado de Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Calificación de fiabilidad](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Calificación de seguridad](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Calificación de mantenibilidad](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Deuda técnica](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Vulnerabilidades](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Líneas duplicadas (%)](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)
[![Líneas de código](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

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
- [Informar de un problema](#-informar-de-un-problema)
- [Licencia](#-licencia)

## Descripción

LeapMultix es una aplicación web educativa interactiva dirigida a niños de 6 a 12 años para dominar las 4 operaciones aritméticas: multiplicación (×), suma (+), resta (−) y división (÷). Ofrece **5 modos de juego** y **4 minijuegos de arcade** en una interfaz intuitiva, accesible y multilingüe.

**Soporte multioperación:** los cinco modos admiten las cuatro operaciones. La elección se realiza en la pantalla de inicio y se aplica a todo el recorrido.

**Desarrollado por:** Julien LS (contact@jls42.org)

**URL en línea:** https://leapmultix.jls42.org/

## 📸 Vista previa

### Las pantallas

|                                                                                                                                  |                                                                                                                       |
| :------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
|                           ![Pantalla «¿Quién juega?»: elección del perfil](docs/media/01-accueil.webp)                           |               ![Menú principal: elección de la operación y de los cinco modos](docs/media/02-menu.webp)               |
|                               **¿Quién juega?** — un perfil por niño, con su avatar y su progreso.                               |                      **El menú** — la operación se elige aquí, y luego se abren los cinco modos.                      |
|                     ![Modo Descubrimiento: la tabla del 4 mostrada en puntos](docs/media/03-decouverte.webp)                     |           ![Modo Quiz: respuesta incorrecta en rojo, respuesta correcta en verde](docs/media/04-quiz.webp)            |
|            **Descubrimiento** — cada igualdad se muestra en puntos, saltos o conteo, junto con el truco de la tabla.             | **Quiz** — la elección del niño permanece visible junto a la respuesta correcta, y la explicación detalla el cálculo. |
|                              ![Modo Desafío: cuenta atrás y racha actual](docs/media/05-defi.webp)                               |          ![Modo Aventura: mapa de los diez niveles, los siguientes bloqueados](docs/media/06-aventure.webp)           |
| **Desafío** — carrera contrarreloj. Ante un error, el cronómetro se congela el tiempo necesario para leer la respuesta correcta. |                 **Aventura** — diez niveles que se desbloquean uno tras otro, a cambio de estrellas.                  |
|                                 ![Menú Arcade: los cuatro minijuegos](docs/media/07-arcade.webp)                                 |              ![Panel de control: estrellas por tabla y estadísticas](docs/media/08-tableau-de-bord.webp)              |
|                           **Arcade** — cuatro minijuegos, con ajuste de dificultad y elección de nave.                           |                 **Panel de control** — estrellas por tabla, tablas a repasar, puntuaciones por modo.                  |
|                     ![Personalización: avatares, temas, accesibilidad](docs/media/09-personnalisation.webp)                      |                                                                                                                       |
|                 **Personalización** — avatar, tema de color, tamaño del texto, alto contraste, código parental.                  |                                                                                                                       |

### Los minijuegos de arcade

Cuatro juegos que plantean la misma pregunta —la que se muestra encima de la zona de juego, junto con el tiempo restante y las vidas— pero exigen en cada caso una acción diferente.

|                                                                                                                                |                                                                                                             |
| :----------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
|    ![MultiInvaders: monstruos con números, una nave en la parte inferior de la pantalla](docs/media/10-multiinvaders.webp)     | ![MultiMiam: un laberinto donde las pastillas llevan las respuestas posibles](docs/media/11-multimiam.webp) |
|       **MultiInvaders** — disparar a las respuestas incorrectas y salvar la correcta: esconde a un amigo al que liberar.       |    **MultiMiam** — recorrer el laberinto para atrapar el resultado correcto, esquivando a los monstruos.    |
| ![MultiMemory: una cuadrícula de cartas, dos dadas la vuelta mostrando un cálculo y un número](docs/media/12-multimemory.webp) |       ![MultiSnake: una serpiente y manzanas numeradas en una pradera](docs/media/13-multisnake.webp)       |
|                        **MultiMemory** — recordar qué carta contiene el resultado del cálculo revelado.                        |             **MultiSnake** — crecer tragando los números correctos y esquivar todos los demás.              |

## ✨ Características

### 🎮 Modos de juego

- **Modo Descubrimiento**: Exploración visual e interactiva adaptada a cada operación
- **Modo Quiz**: Preguntas de opción múltiple con soporte para las 4 operaciones (×, +, −, ÷) y progresión adaptativa
- **Modo Desafío**: Carrera contrarreloj con las 4 operaciones (×, +, −, ÷) y diferentes niveles de dificultad
- **Modo Aventura**: Progresión narrativa por niveles con soporte para las 4 operaciones

### 🕹️ Minijuegos Arcade

- **MultiInvaders**: Space Invaders educativo - Destruir las respuestas incorrectas
- **MultiMiam**: Pac-Man matemático - Recolectar las respuestas correctas
- **MultiMemory**: Juego de memoria - Asociar operaciones y resultados
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

### 🌍 Funcionalidades transversales

- **Multiusuario**: Gestión de perfiles individuales con guardado de progreso
- **Multilingüe**: Soporte en francés, inglés y español
- **Personalización**: Avatares, temas de color, fondos
- **Accesibilidad**: Navegación por teclado, soporte táctil, conformidad con WCAG 2.1 AA
- **Voz grabada**: el juego puede leer preguntas y ánimos mediante una voz sintetizada pregrabada, con cambio automático a la voz del dispositivo si es necesario. Las voces no se incluyen en este repositorio: el sitio leapmultix.jls42.org sirve a Lucie en francés, a Sulafat en inglés y español, y como opción a Marie en francés y a Jane en inglés (véase [Voz grabada](#-voz-grabada))
- **Adaptable a móviles**: Interfaz optimizada para tabletas y teléfonos inteligentes
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
`core/`, `components/` e `modes/`. Por tanto, es el nombre del archivo el que define la
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

**Módulos ES6 modernos**: El proyecto utiliza una arquitectura modular basada en clases ES6 e importaciones/exportaciones nativas.

**Componentes reutilizables**: Interfaz construida con componentes de IU centralizados (TopBar, InfoBar, Dashboard, Customization).

**Carga diferida (Lazy Loading)**: Carga inteligente de módulos bajo demanda mediante `lazy-loader.js` para optimizar el rendimiento inicial.

**Sistema de almacenamiento unificado**: API centralizada para la persistencia de datos del usuario mediante LocalStorage con mecanismos de reserva.

**Gestión de audio centralizada**: Control de sonido con soporte multilingüe y preferencias por usuario.

**Bus de eventos (Event Bus)**: Comunicación desacoplada basada en eventos entre componentes para una arquitectura mantenible.

**Navegación por diapositivas**: Sistema de navegación basado en diapositivas numeradas (slide0, slide1, etc.) mediante `goToSlide()`.

**Seguridad**: Protección contra XSS y sanitización mediante `security-utils.js` en todas las manipulaciones del DOM.

## 🎯 Modos de juego detallados

### Modo Descubrimiento

Interfaz de exploración visual de las tablas de multiplicar con:

- Visualización interactiva de las multiplicaciones
- Animaciones y reglas mnemotécnicas
- Función de arrastrar y soltar con fines educativos
- Progresión libre por tabla

### Modo Quiz

Preguntas de opción múltiple con:

- 10 preguntas por sesión
- Progresión adaptativa según los aciertos
- Teclado numérico virtual
- Sistema de racha (serie de respuestas correctas)

### Modo Desafío

Carrera contrarreloj con:

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

- Selección de dificultad y personalización
- Sistema de vidas y puntuación
- Controles por teclado y táctiles
- Clasificaciones individuales por usuario

## 🔧 Desarrollo

### Flujo de trabajo de desarrollo

**Nunca hagas commit directamente en main.** El proyecto trabaja con ramas de
funcionalidad.

**1. Crear una rama**, `feat/` para una funcionalidad, `fix/` para una corrección:

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

**2. Desarrollar y verificar.** El formateo va primero: la CI lo rechazará
incluso antes de ejecutar las pruebas.

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

**4. Abrir un pull request** y esperar los análisis: verify, Codacy,
CodeFactor y SonarCloud. Se corrige hasta que todo esté en verde antes de fusionar.

**Estilo de commits**: Mensajes concisos, en modo imperativo (ej.: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Asegurarse de que `npm run lint`, `npm test` e `npm run test:coverage` pasen antes de cada commit

### Arquitectura de componentes

**GameMode (clase base)**: Todos los modos heredan de una clase común con métodos estandarizados.

**GameModeManager**: Orquestación centralizada del lanzamiento y gestión de los modos.

**Componentes de IU**: TopBar, InfoBar, Dashboard y Customization proporcionan una interfaz coherente.

**Carga diferida**: Los módulos se cargan bajo demanda para optimizar el rendimiento inicial.

**Bus de eventos**: Comunicación desacoplada entre componentes a través del sistema de eventos.

### Pruebas

El proyecto incluye una completa suite de pruebas:

- Pruebas unitarias de los módulos core
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

### Compilación para producción

- **Rollup**: Empaqueta `js/main-es6.js` en ESM con división de código (code-splitting) y mapas de origen (sourcemaps)
- **Terser**: Minificación automática para optimización
- **Poscompilación**: Copia `css/` y `assets/`, los favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, y reescribe `dist/index.html` hacia el archivo de entrada con hash (ej.: `main-es6-*.js`)
- **Carpeta final**: `dist/` lista para ser servida de forma estática

```bash
npm run build      # génère dist/
npm run serve:dist # sert dist/ (port 5000)
```

### Integración continua

**GitHub Actions**: `.github/workflows/ci.yml`, activado en cada push a
`main` y en cada pull request.

**`verify`** — el control de calidad, bloqueante:

- `npm ci` y luego `npm run verify` (ESLint, pruebas de Jest, cobertura)
- `npm run format:check` (Prettier)

**`seo-report`** — después de `verify`: auditoría de Lighthouse del sitio en línea, para
hacer seguimiento de las métricas SEO a lo largo del tiempo.

**Análisis externos** vinculados a los pull requests: Codacy, CodeFactor y
SonarCloud. El control de SonarCloud exige calificaciones A en fiabilidad, seguridad y
mantenibilidad en el código nuevo.

**Despliegue**: `./deploy.sh` sincroniza el sitio con S3 e invalida la caché
de CloudFront. El script regenera, en caso necesario, las imágenes adaptables no incluidas en git.

### PWA (Progressive Web App)

LeapMultix es una PWA completa con soporte sin conexión y posibilidad de instalación.

**Service Worker** (`sw.js`):

- Navegación: Network-first con reserva sin conexión hacia `offline.html`
- Imágenes: Cache-first para optimizar el rendimiento
- Traducciones: Stale-while-revalidate para actualización en segundo plano
- JS/CSS: Network-first para servir siempre la versión más reciente
- Gestión de versiones automática mediante `cache-updater.js`

**Manifiesto** (`manifest.json`):

- Iconos SVG y PNG para todos los dispositivos
- Instalación posible en móviles (Añadir a la pantalla de inicio)
- Configuración independiente (standalone) para una experiencia similar a una app nativa
- Compatibilidad con temas y colores

**Probar el modo sin conexión localmente.** Iniciar el servidor y luego abrir
`http://localhost:8080` (o el puerto mostrado):

```bash
npm run serve
```

Manualmente: cortar la conexión de red en las herramientas de desarrollo (pestaña Red,
modo fuera de línea) y luego recargar la página. Debe mostrarse `offline.html`.

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

**Herramientas de calidad de código**:

- **ESLint**: Configuración moderna con flat config (`eslint.config.js`), soporte para ES2022
- **Prettier**: Formateo automático de código (`.prettierrc`)
- **Stylelint**: Validación de CSS (`.stylelintrc.json`)
- **JSDoc**: Documentación automática de funciones con análisis de cobertura

**Reglas de código importantes**:

- Eliminar variables y parámetros no utilizados (`no-unused-vars`)
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
- Roles ARIA y etiquetas apropiadas
- Contrastes de color conformes

**Rendimiento**:

- Carga diferida (lazy loading) de módulos mediante `lazy-loader.js`
- Optimizaciones de CSS y recursos adaptables
- Service Worker para almacenamiento en caché inteligente
- División de código (code splitting) y minificación en producción

## 📱 Compatibilidad

### Navegadores compatibles

La interfaz se basa en `oklch()` para los colores y en `:has()` para los
estados contextuales, lo que establece los requisitos mínimos:

- Chrome / Chromium 111+
- Edge 111+
- Firefox 121+
- Safari 15.4+

### Dispositivos

- **Escritorio**: Controles mediante teclado y ratón
- **Tabletas**: Interfaz táctil optimizada
- **Smartphones**: Diseño adaptable y responsivo

### Accesibilidad

- Navegación completa por teclado (Tab, flechas, Esc)
- Roles ARIA y etiquetas para lectores de pantalla
- Contrastes de color conformes
- Compatibilidad con tecnologías de asistencia

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
- Detección de claves sobrantes (presentes en otros idiomas pero ausentes en fr.json)
- Identificación de valores vacíos (`""`, `null`, `undefined`, `[]`)
- Comprobación de coherencia de tipos (string vs array)
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

El juego lee en voz alta las preguntas, los ánimos y las explicaciones. Solo pronuncia un conjunto finito de frases, unas 7.400 por idioma: por lo tanto, pueden grabarse de una vez por todas, y ninguna partida necesita llamar a un servicio de síntesis. Sin clips, el juego lee con la voz del dispositivo.

### En este repositorio: la aplicación, sin las voces

El código puede reproducir clips pregrabados y contiene la cadena que los produce. Los clips no están incluidos aquí, así como tampoco las claves de los proveedores: una bifurcación o instalación local lee con la voz del dispositivo.

- **Respaldo automático** a la voz del dispositivo, frase por frase: clip ausente o con error, reproducción rechazada por el navegador, clip que no inicia en 1,5 s, o sin conexión y sin el clip en caché.
- **Ajustes**: el botón de voz de la barra superior activa o silencia la reproducción; la casilla «Voz grabada» (Accesibilidad y controles) permite elegir entre la voz grabada y la voz del dispositivo. Solo aparece en los idiomas que cuentan con una voz publicada.
- **Sin conexión**: los clips ya escuchados permanecen en la caché (service worker).
- **Dónde busca los clips el juego**: en la etiqueta `<meta name="leapmultix-voice-base">`, vacía en el repositorio. Solo el despliegue de producción escribe allí `/voice/`.

Con sus propios clips en el equipo local (generados mediante la cadena descrita a continuación, ubicados junto al juego en `../leapmultix-voices`), el parámetro `?voix=local` hace que el servidor de desarrollo los reproduzca:

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
- a elección del jugador, **Marie** en francés y **Jane** en inglés, creadas con Mistral AI (Voxtral TTS).

Los clips residen en un repositorio privado y en un bucket S3 dedicado, servido a través de CloudFront en `/voice/*`. En los ajustes, el menú «Voz» ofrece las distintas opciones de voz para el idioma si cuenta con más de una, y la mención indica el servicio de la voz reproducida.

### Generar los clips

La cadena de procesamiento está automatizada mediante scripts en `scripts/voice/` y se ejecuta en el equipo del propietario, nunca en la CI pública. Las claves de los proveedores (ElevenLabs para el francés, Google Cloud Text-to-Speech para el inglés y el español, Mistral para Marie y Jane) permanecen en un archivo `.env` fuera del repositorio, pasado mediante `node --env-file`: ninguna clave entra en git. La skill de Claude Code [`generating-voice-clips`](.claude/skills/generating-voice-clips/SKILL.md) detalla el procedimiento paso a paso (puertas, acuerdos, reanudaciones); la información detallada se encuentra en [`docs/voix-enregistree.md`](docs/voix-enregistree.md).

1. **Estimar** las frases restantes y los caracteres a pagar (Eleven v3: aproximadamente 0,53 créditos por carácter; Chirp 3 HD: 30 $ por millón de caracteres, el primer millón de cada mes es gratuito; Voxtral TTS: 16 $ por millón).
2. **Generar**. Volver a ejecutar el mismo comando reanuda lo que falte. Cuando se agotan los créditos, el script se detiene de forma limpia (código 3) sin dejar archivos a medio escribir. `--max-total-chars` limita el gasto acumulado de la versión: cada respuesta de pago se registra inmediatamente al recibirla en un registro que sobrevive a una interrupción abrupta. En Google y Mistral, que no proporcionan un saldo legible, esta es la única protección.
3. **Comprobar**: cada frase tiene su clip y cada MP3 es válido. Whisper transcribe a continuación cada clip localmente, y el control señala los números mal entendidos y las duraciones anormales. `voice:review` encadena Whisper, este control y la página de escucha en un solo comando.
4. **Escuchar** en la página de escucha (`voice:listen`) los clips señalados y una muestra de formas femeninas («una vez 7»), que Whisper no distingue. Cada clip dispone de una casilla «para rehacer», que lo añade a la lista de clips descartados.
5. **Rehacer** los clips descartados (`--redo`) y volver a ejecutar Whisper, para luego comparar cada clip antes y después en una segunda página. Un clip que aún se pronuncie mal tras dos o tres intentos recibe un texto forzado en `SAID_OVERRIDES` (`scripts/voice/said-text.mjs`), por ejemplo el número escrito con letras.
6. **Publicar** los clips, verificar que respondan en línea y luego publicar el índice del idioma, primero para los evaluadores (`?voix=test`).
7. **Abrir** la voz para todos y luego activarla por defecto. El mecanismo de desconexión (`voice:publish -- remove`) retira un idioma del índice: el juego regresa a la voz del dispositivo.

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

### Regla: una frase locutada que se modifique se vuelve a grabar antes de pasar a producción

Cualquier frase locutada proviene de las traducciones (`assets/translations/{fr,en,es}.json`) y forma parte del corpus. Por lo tanto, modificar una frase hablada hace fallar la prueba de bloqueo del corpus (`scripts/voice/corpus.lock.json`). Para un idioma que cuenta con su voz grabada, se generan entonces los clips de las frases afectadas, se verifican, se escuchan y luego se publican **antes** de fusionar. Finalmente, se actualiza el archivo de bloqueo (`npm run voice:corpus:lock`). Sin estos clips, la frase modificada se reproduce con la voz del dispositivo.

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

## 🐛 Informar de un problema

Los problemas se pueden notificar a través de las issues de GitHub. Por favor, incluya:

- Descripción detallada del problema
- Pasos para reproducirlo
- Navegador y versión
- Capturas de pantalla si procede

## 💝 Apoyar el proyecto

**[☕ Hacer una donación a través de PayPal](https://paypal.me/jls)**

## 📄 Licencia

Este proyecto está bajo la licencia AGPL v3. Consulte el archivo `LICENSE` para más detalles.

---

_LeapMultix — aplicación educativa libre para aprender las cuatro operaciones_

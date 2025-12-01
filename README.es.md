<details>
<summary>Este documento también está disponible en otros idiomas</summary>

- [English](./README.en.md)
- [Français](./README.md)
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

<!-- Badges (actualizar <owner>/<repo> después de la migración a GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#-características)
- [Inicio Rápido](#-inicio-rápido)
- [Arquitectura](#-arquitectura)
- [Modos de Juego Detallados](#-modos-de-juego-detallados)
- [Desarrollo](#-desarrollo)
- [Compatibilidad](#-compatibilidad)
- [Localización](#-localización)
- [Almacenamiento de Datos](#-almacenamiento-de-datos)
- [Reportar Problemas](#-reportar-problemas)
- [Licencia](#-licencia)

## Descripción

LeapMultix es una aplicación web educativa moderna e interactiva diseñada para que los niños (8–12 años) dominen las 4 operaciones aritméticas: multiplicación (×), suma (+), resta (−) y división (÷). La aplicación ofrece **5 modos de juego** y **4 minijuegos arcade** en una interfaz intuitiva, accesible y multilingüe.

**Soporte multi-operación:** Los modos Cuestionario y Desafío permiten practicar todas las operaciones. Los modos Descubrimiento, Aventura y Arcade se centran en la multiplicación pero están diseñados para soportar todas las operaciones.

**Desarrollado por:** Julien LS (contact@jls42.org)

**URL en línea:** https://leapmultix.jls42.org/

## ✨ Características

### 🎮 Modos de Juego

- **Modo Descubrimiento**: Exploración visual e interactiva adaptada a cada operación
- **Modo Cuestionario**: Preguntas de opción múltiple con soporte para las 4 operaciones (×, +, −, ÷) y progresión adaptativa
- **Modo Desafío**: Carrera contra el tiempo con las 4 operaciones (×, +, −, ÷) y diferentes niveles de dificultad
- **Modo Aventura**: Progresión narrativa por niveles con soporte para las 4 operaciones

### 🕹️ Minijuegos Arcade

- **MultiInvaders**: Space Invaders educativo - Destruye las respuestas incorrectas
- **MultiMiam**: Pac-Man matemático - Recoge las respuestas correctas
- **MultiMemory**: Juego de memoria - Asocia operaciones y resultados
- **MultiSnake**: Snake educativo - Crece comiendo los números correctos

### ➕ Soporte Multi-Operaciones

LeapMultix ofrece entrenamiento completo para las 4 operaciones aritméticas en **todos los modos**:

| Modo           | ×   | +   | −   | ÷   |
| -------------- | --- | --- | --- | --- |
| Cuestionario   | ✅  | ✅  | ✅  | ✅  |
| Desafío        | ✅  | ✅  | ✅  | ✅  |
| Descubrimiento | ✅  | ✅  | ✅  | ✅  |
| Aventura       | ✅  | ✅  | ✅  | ✅  |
| Arcade         | ✅  | ✅  | ✅  | ✅  |

### 🌍 Características Transversales

- **Multiusuario**: Gestión de perfiles individuales con progresión guardada
- **Multilingüe**: Soporte para francés, inglés y español
- **Personalización**: Avatares, temas de color, fondos
- **Accesibilidad**: Navegación por teclado, soporte táctil, cumplimiento WCAG 2.1 AA
- **Mobile responsive**: Interfaz optimizada para tabletas y teléfonos inteligentes
- **Sistema de progresión**: Puntuaciones, insignias, desafíos diarios

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js (versión 16 o superior)
- Un navegador web moderno

### Instalación

```bash
# Clonar el proyecto
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo (opción 1)
npm run serve
# La aplicación será accesible en http://localhost:8080 (o el siguiente puerto disponible)

# O con Python (opción 2)
python3 -m http.server 8000
# La aplicación será accesible en http://localhost:8000
```

### Scripts Disponibles

```bash
# Desarrollo
npm run serve          # Servidor local (http://localhost:8080)
npm run lint           # Verificación de código con ESLint
npm run lint:fix       # Corrección automática de problemas ESLint
npm run format:check   # Verificar formato de código (SIEMPRE antes de commit)
npm run format         # Formatear código con Prettier
npm run verify         # Quality gate: lint + test + coverage

# Tests
npm run test           # Ejecutar todos los tests (CJS)
npm run test:watch     # Tests en modo watch
npm run test:coverage  # Tests con informe de cobertura
npm run test:core      # Tests de módulos core solamente
npm run test:integration # Tests de integración
npm run test:storage   # Tests del sistema de almacenamiento
npm run test:esm       # Tests ESM (carpetas tests-esm/, Jest vm-modules)
npm run test:verbose   # Tests con salida detallada
npm run test:pwa-offline # Test offline PWA (requiere Puppeteer), después de `npm run serve`

# Análisis y Mantenimiento
npm run analyze:jsdoc  # Análisis de documentación
npm run improve:jsdoc  # Mejora automática JSDoc
npm run audit:mobile   # Tests de responsividad móvil
npm run audit:accessibility # Tests de accesibilidad
npm run dead-code      # Detección de código no utilizado
npm run analyze:globals # Análisis de variables globales
npm run analyze:dependencies # Análisis de uso de dependencias
npm run verify:cleanup # Análisis combinado (código muerto + globales)

# Gestión de Assets
npm run assets:generate    # Generar imágenes responsivas
npm run assets:backgrounds # Convertir fondos a WebP
npm run assets:analyze     # Análisis de assets responsivos
npm run assets:diff        # Comparación de assets

# Internacionalización
npm run i18n:verify    # Verificar consistencia de claves de traducción
npm run i18n:unused    # Listar claves de traducción no utilizadas
npm run i18n:compare   # Comparar traducciones (en/es) con fr.json (referencia)

# Build y Entrega
npm run build          # Build de producción (Rollup) + postbuild (dist/ completo)
npm run serve:dist     # Servir dist/ en http://localhost:5000 (o puerto disponible)

# PWA y Service Worker
npm run sw:disable     # Desactivar service worker
npm run sw:fix         # Corregir problemas de service worker
```

## 🏗️ Arquitectura

### Estructura de Archivos

```
leapmultix/
├── index.html              # Punto de entrada principal
├── js/
│   ├── core/               # Módulos centrales ES6
│   │   ├── GameMode.js     # Clase base para modos
│   │   ├── GameModeManager.js # Gestión de modos de juego
│   │   ├── storage.js      # API de LocalStorage
│   │   ├── audio.js        # Gestión de sonido
│   │   ├── utils.js        # Utilidades genéricas (fuente canónica)
│   │   ├── eventBus.js     # Comunicación por eventos
│   │   ├── userState.js    # Gestión de sesión de usuario
│   │   ├── mainInit.js     # Inicialización DOM-ready
│   │   ├── theme.js        # Sistema de temas
│   │   ├── userUi.js       # Utilidades de interfaz de usuario
│   │   ├── parental.js     # Controles parentales
│   │   ├── adventure-data.js # Datos del modo Aventura
│   │   ├── mult-stats.js   # Estadísticas de multiplicación
│   │   ├── challenge-stats.js # Estadísticas de desafío
│   │   └── daily-challenge.js # Gestión de desafíos diarios
│   ├── components/         # Componentes UI reutilizables
│   │   ├── topBar.js       # Barra de navegación
│   │   ├── infoBar.js      # Barras de información del juego
│   │   ├── dashboard.js    # Tablero de usuario
│   │   └── customization.js # Interfaz de personalización
│   ├── modes/              # Modos de juego
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Minijuegos arcade
│   │   ├── arcade.js       # Orquestador principal arcade
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Juego de memoria (31 KB)
│   │   ├── arcade-multimiam.js # Integración MultiMiam
│   │   ├── arcade-multisnake.js # Integración Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilidades compartidas
│   │   ├── arcade-message.js, arcade-points.js # Componentes UI
│   │   └── arcade-scores.js # Gestión de puntuaciones
│   ├── multimiam/          # Juego Pac-Man (arquitectura descompuesta)
│   │   ├── multimiam.js    # Controlador principal
│   │   ├── multimiam-engine.js # Motor de juego (15 KB)
│   │   ├── multimiam-renderer.js # Sistema de renderizado (9 KB)
│   │   ├── multimiam-controls.js # Gestión de controles (7 KB)
│   │   ├── multimiam-questions.js # Generación de preguntas (6 KB)
│   │   └── multimiam-ui.js # Elementos de interfaz
│   ├── multisnake.js       # Juego Snake (38 KB)
│   ├── navigation/         # Sistema de navegación
│   │   ├── slides.js       # Navegación basada en diapositivas (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Soporte de teclado
│   ├── ui/                 # Interfaz de usuario y feedback
│   │   ├── uiUtils.js      # Utilidades de interfaz
│   │   ├── ui-feedback.js  # Mecanismos de feedback
│   │   ├── touch-support.js # Soporte táctil (7 KB)
│   │   ├── virtual-keyboard.js # Teclado virtual
│   │   ├── coin-display.js, coin-effects.js # Sistema de monedas
│   │   ├── notifications.js # Sistema de notificaciones
│   │   └── badges.js       # Sistema de insignias
│   ├── media/              # Gestión de medios
│   │   ├── VideoManager.js # Gestión de reproducción de video (12 KB)
│   │   └── responsive-image-loader.js # Carga de imágenes (9 KB)
│   ├── orchestration/      # Orquestación y carga
│   │   ├── mode-orchestrator.js # Cambio de modo
│   │   ├── lazy-loader.js  # Carga dinámica (10 KB)
│   │   └── game-cleanup.js # Limpieza de estado
│   ├── utils/              # Utilidades
│   │   ├── utils-es6.js    # Agregador principal (5 KB)
│   │   ├── main-helpers.js # Helpers de la aplicación
│   │   ├── helpers.js      # Funciones helper legacy
│   │   ├── stats-utils.js  # Utilidades de estadísticas
│   │   ├── difficulty.js   # Gestión de dificultad
│   │   └── questionGenerator.js # Generación de preguntas
│   ├── storage/            # Almacenamiento y estado
│   │   ├── storage.js      # Wrapper de almacenamiento legacy
│   │   └── userManager.js  # Gestión multiusuario (19 KB)
│   ├── i18n/               # Internacionalización
│   │   ├── i18n.js         # Sistema i18n
│   │   └── i18n-store.js   # Almacenamiento de traducciones
│   ├── security/           # Seguridad y manejo de errores
│   │   ├── security-utils.js # Protección XSS, sanitización
│   │   ├── error-handlers.js # Manejo global de errores
│   │   └── logger.js       # Sistema de logging
│   ├── accessibility/      # Accesibilidad
│   │   ├── accessibility.js # Características de accesibilidad
│   │   └── speech.js       # Soporte de síntesis de voz
│   ├── integration/        # Integración y analíticas
│   │   ├── plausible-init.js # Analíticas Plausible
│   │   ├── cache-updater.js # Gestión de caché (10 KB)
│   │   └── imports.js      # Utilidades de importación
│   ├── main-es6.js         # Punto de entrada ES6
│   ├── main.js             # Orquestador principal
│   ├── bootstrap.js        # Configuración de manejadores de eventos ES6
│   └── game.js             # Gestión de estado y desafíos diarios
├── css/                    # Estilos modulares
├── assets/                 # Recursos
│   ├── images/             # Imágenes y sprites
│   ├── generated-images/   # Imágenes responsivas generadas
│   ├── sounds/             # Efectos de sonido
│   ├── translations/       # Archivos de traducción (fr, en, es)
│   └── videos/             # Videos tutoriales
├── tests/                  # Pruebas automatizadas
│   ├── __tests__/          # Pruebas unitarias y de integración
│   └── tests-esm/          # Pruebas ESM (.mjs)
├── scripts/                # Scripts de mantenimiento
│   ├── compare-translations.cjs # Comparación de traducciones
│   └── cleanup-i18n-keys.cjs # Limpieza de claves i18n
└── dist/                   # Build de producción (generado)
```

### Arquitectura Técnica

**Módulos ES6 Modernos**: El proyecto utiliza una arquitectura modular con clases ES6 e importaciones/exportaciones nativas.

**Componentes Reutilizables**: Interfaz construida con componentes UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Lazy Loading**: Carga inteligente de módulos bajo demanda a través de `lazy-loader.js` para optimizar el rendimiento inicial.

**Sistema de Almacenamiento Unificado**: API centralizada para la persistencia de datos de usuario a través de LocalStorage con fallbacks.

**Gestión de Audio Centralizada**: Control de sonido con soporte multilingüe y preferencias por usuario.

**Event Bus**: Comunicación por eventos desacoplada entre componentes para una arquitectura mantenible.

**Navegación por Diapositivas**: Sistema de navegación basado en diapositivas numeradas (slide0, slide1, etc.) con `goToSlide()`.

**Seguridad**: Protección XSS y sanitización a través de `security-utils.js` para todas las manipulaciones del DOM.

## 🎯 Modos de Juego Detallados

### Modo Descubrimiento

Interfaz de exploración visual de las tablas de multiplicar con:

- Visualización interactiva de multiplicaciones
- Animaciones y ayudas de memoria
- Arrastrar y soltar educativo
- Progresión libre por tabla

### Modo Cuestionario

Preguntas de opción múltiple con:

- 10 preguntas por sesión
- Progresión adaptativa basada en el éxito
- Teclado numérico virtual
- Sistema de racha (serie de respuestas correctas)

### Modo Desafío

Carrera contra el tiempo con:

- 3 niveles de dificultad (Principiante, Medio, Difícil)
- Bonificación de tiempo por respuestas correctas
- Sistema de vidas
- Tabla de clasificación de mejores puntuaciones

### Modo Aventura

Progresión narrativa con:

- 12 niveles temáticos desbloqueables
- Mapa interactivo con progresión visual
- Historia inmersiva con personajes
- Sistema de estrellas y recompensas

### Minijuegos Arcade

Cada minijuego ofrece:

- Elección de dificultad y personalización
- Sistema de vidas y puntuación
- Controles de teclado y táctiles
- Tablas de clasificación individuales por usuario

## 🛠️ Desarrollo

### Flujo de Trabajo de Desarrollo

**IMPORTANTE: Nunca hacer commit directamente en main**

El proyecto utiliza un flujo de trabajo basado en ramas de características:

1.  **Crear una rama**:

    ```bash
    git checkout -b feat/nombre-de-la-caracteristica
    # o
    git checkout -b fix/nombre-del-bug
    ```

2.  **Desarrollar y probar**:

    ```bash
    npm run format:check  # SIEMPRE verificar formato primero
    npm run format        # Formatear si es necesario
    npm run lint          # Verificar calidad del código
    npm run test          # Ejecutar tests
    npm run test:coverage # Verificar cobertura
    ```

3.  **Hacer commit en la rama**:

    ```bash
    git add .
    git commit -m "feat: descripción de la característica"
    ```

4.  **Empujar y crear un Pull Request**:
    ```bash
    git push -u origin feat/nombre-de-la-caracteristica
    ```

**Estilo de commit**: Conciso, modo imperativo (ej: "Fix arcade init errors", "Refactor cache updater")

**Quality gate**: Asegurarse de que `npm run lint`, `npm test` y `npm run test:coverage` pasen antes de cada commit

### Arquitectura de Componentes

**GameMode (clase base)**: Todos los modos heredan de una clase común con métodos estandarizados.

**GameModeManager**: Orquestación centralizada del lanzamiento y gestión de modos.

**Componentes UI**: TopBar, InfoBar, Dashboard y Customization proporcionan una interfaz consistente.

**Lazy Loading**: Los módulos se cargan bajo demanda para optimizar el rendimiento inicial.

**Event Bus**: Comunicación desacoplada entre componentes a través del sistema de eventos.

### Tests

El proyecto incluye una suite de pruebas completa:

- Tests unitarios para módulos core
- Tests de integración para componentes
- Tests de modos de juego
- Cobertura de código automatizada

```bash
npm test              # Todos los tests (CJS)
npm test:core         # Tests de módulos centrales
npm test:integration  # Tests de integración
npm test:coverage     # Informe de cobertura
npm run test:esm      # Tests ESM (ej: components/dashboard) vía vm-modules
```

### Build de Producción

- **Rollup**: Empaqueta `js/main-es6.js` en ESM con code-splitting y sourcemaps
- **Terser**: Minificación automática para optimización
- **Post-build**: Copia `css/` y `assets/`, favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, y reescribe `dist/index.html` al archivo de entrada con hash (ej: `main-es6-*.js`)
- **Carpeta final**: `dist/` lista para ser servida estáticamente

```bash
npm run build      # genera dist/
npm run serve:dist # sirve dist/ (puerto 5000)
```

### Integración Continua

**GitHub Actions**: Pipeline automatizado en `.github/workflows/ci.yml`

El pipeline CI/CD se ejecuta automáticamente en cada push y pull request:

**Jobs Principales**:

1.  **build-test**: Job de validación principal
    - Instalación de dependencias: `npm ci`
    - Verificación de formato: `npm run format:check`
    - Análisis estático: `npm run lint`
    - Tests unitarios: `npm run test`
    - Auditoría de seguridad: `npm audit`
    - Generación de artefacto de cobertura

2.  **accessibility**: Auditoría de accesibilidad (no bloqueante)
    - Ejecuta `npm run audit:accessibility`
    - Genera informe de accesibilidad WCAG 2.1 AA

3.  **test-esm**: Tests de módulos ES6
    - Ejecuta `npm run test:esm` con Jest VM modules
    - Valida importaciones/exportaciones ES6

4.  **lighthouse**: Auditoría de rendimiento (no bloqueante)
    - Auditoría de rendimiento móvil
    - Genera artefactos de informe Lighthouse
    - Métricas Core Web Vitals

**Insignias de Calidad**:

- CI Build Status (GitHub Actions)
- CodeFactor Grade
- Codacy Badge
- SonarCloud Quality Gate

### PWA (Progressive Web App)

LeapMultix es una PWA completa con soporte offline y capacidad de instalación.

**Service Worker** (`sw.js`):

- Navegación: Network-first con fallback offline a `offline.html`
- Imágenes: Cache-first para optimizar rendimiento
- Traducciones: Stale-while-revalidate para actualizaciones en segundo plano
- JS/CSS: Network-first para servir siempre la última versión
- Gestión de versiones automática vía `cache-updater.js`

**Manifest** (`manifest.json`):

- Iconos SVG y PNG para todos los dispositivos
- Instalación posible en móvil (Add to Home Screen)
- Configuración standalone para experiencia tipo app
- Soporte para temas y colores

**Probar modo offline localmente**:

1.  Iniciar el servidor de desarrollo:

    ```bash
    npm run serve
    ```

    Abrir `http://localhost:8080` (o el puerto mostrado)

2.  Probar manualmente:
    - Cortar la red en DevTools (pestaña Network → Offline)
    - Refrescar la página → se muestra `offline.html`

3.  Test automatizado (requiere Puppeteer):
    ```bash
    npm run test:pwa-offline
    ```

**Scripts de Gestión del Service Worker**:

```bash
npm run sw:disable  # Desactivar service worker
npm run sw:fix      # Corregir problemas de caché
```

### Estándares de Calidad

**Herramientas de Calidad de Código**:

- **ESLint**: Configuración moderna con flat config (`eslint.config.js`), soporte ES2022
- **Prettier**: Formateo automático de código (`.prettierrc`)
- **Stylelint**: Validación CSS (`.stylelintrc.json`)
- **JSDoc**: Documentación automática de funciones con análisis de cobertura

**Reglas de Código Importantes**:

- Eliminar variables y parámetros no utilizados (`no-unused-vars`)
- Usar manejo de errores específico (no catch vacíos)
- Evitar `innerHTML` a favor de funciones de `security-utils.js`
- Mantener complejidad cognitiva < 15 para funciones
- Extraer funciones complejas en helpers más pequeños

**Seguridad**:

- **Protección XSS**: Usar funciones de `security-utils.js`:
  - `appendSanitizedHTML()` en lugar de `innerHTML`
  - `createSafeElement()` para crear elementos seguros
  - `setSafeMessage()` para contenido de texto
- **Scripts Externos**: Atributo `crossorigin="anonymous"` obligatorio
- **Validación de Entradas**: Siempre sanitizar datos externos
- **Content Security Policy**: Headers CSP para restringir fuentes de scripts

**Accesibilidad**:

- Cumplimiento WCAG 2.1 AA
- Navegación completa por teclado
- Roles ARIA y etiquetas apropiadas
- Contraste de color conforme

**Rendimiento**:

- Lazy loading de módulos vía `lazy-loader.js`
- Optimizaciones de CSS y assets responsivos
- Service Worker para caché inteligente
- Code splitting y minificación en producción

## 📱 Compatibilidad

### Navegadores Soportados

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos

- **Escritorio**: Controles de teclado y ratón
- **Tabletas**: Interfaz táctil optimizada
- **Smartphones**: Diseño responsivo adaptativo

### Accesibilidad

- Navegación completa por teclado (Tab, Flechas, Escape)
- Roles ARIA y etiquetas para lectores de pantalla
- Contraste de color conforme
- Soporte de tecnología de asistencia

## 🌍 Localización

Soporte multilingüe completo:

- **Francés** (idioma predeterminado)
- **Inglés**
- **Español**

### Gestión de Traducciones

**Archivos de Traducción:** `assets/translations/*.json`

**Formato:**

```json
{
  "menu_start": "Comenzar",
  "quiz_correct": "¡Bien hecho!",
  "arcade_invasion_title": "MultiInvaders"
}
```

### Scripts de Gestión i18n

**`npm run i18n:verify`** - Verificar consistencia de claves de traducción

**`npm run i18n:unused`** - Listar claves de traducción no utilizadas

**`npm run i18n:compare`** - Comparar archivos de traducción con fr.json (referencia)

Este script (`scripts/compare-translations.cjs`) asegura la sincronización de todos los archivos de idioma:

**Características:**

- Detección de claves faltantes (presentes en fr.json pero ausentes en otros idiomas)
- Detección de claves extra (presentes en otros idiomas pero no en fr.json)
- Identificación de valores vacíos (`""`, `null`, `undefined`, `[]`)
- Verificación de consistencia de tipos (string vs array)
- Aplanamiento de estructuras JSON anidadas a notación de puntos (ej: `arcade.multiMemory.title`)
- Generación de informe detallado en consola
- Guardado de informe JSON en `docs/translations-comparison-report.json`

**Ejemplo de Salida:**

```
🔍 Análisis comparativo de archivos de traducción

📚 Idioma de referencia: fr.json
✅ fr.json: 335 claves

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Análisis de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de claves: 335
✅ Ninguna clave faltante
✅ Ninguna clave extra
✅ Ningún valor vacío

📊 RESUMEN FINAL
  fr.json: 335 claves
  en.json: 335 claves
  es.json: 335 claves

✅ ¡Todos los archivos de traducción están perfectamente sincronizados!
```

**Cobertura de Traducciones:**

- Interfaz de usuario completa
- Instrucciones de juego
- Mensajes de error y feedback
- Descripciones y ayuda contextual
- Contenido narrativo del modo Aventura
- Etiquetas de accesibilidad y ARIA

## 📊 Almacenamiento de Datos

### Datos de Usuario

- Perfiles y preferencias
- Progresión por modo de juego
- Puntuaciones y estadísticas de juegos arcade
- Ajustes de personalización

### Características Técnicas

- Almacenamiento local (localStorage) con fallbacks
- Aislamiento de datos por usuario
- Guardado automático de progresión
- Migración automática de datos antiguos

## 🐛 Reportar Problemas

Los problemas pueden reportarse a través de los issues de GitHub. Por favor incluya:

- Descripción detallada del problema
- Pasos para reproducirlo
- Navegador y versión
- Capturas de pantalla si son relevantes

## 💝 Apoyar el Proyecto

**[☕ Hacer una donación vía PayPal](https://paypal.me/jls)**

## 📄 Licencia

Este proyecto está bajo la licencia AGPL v3. Ver el archivo `LICENSE` para más detalles.

---

_LeapMultix - Aplicación educativa moderna para aprender las tablas de multiplicar_

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

<!-- Insignias (actualizar <owner>/<repo> después de la migración de GitHub) -->

![CI](https://img.shields.io/github/actions/workflow/status/jls42/leapmultix/ci.yml?branch=main)

[![CodeFactor](https://www.codefactor.io/repository/github/jls42/leapmultix/badge)](https://www.codefactor.io/repository/github/jls42/leapmultix)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe7c2fbbea5e484889ac9b435c8d9956)](https://app.codacy.com/gh/jls42/leapmultix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jls42_leapmultix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jls42_leapmultix)

![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)

## Índice

- [Descripción](#descripción)
- [Funcionalidades](#-funcionalidades)
- [Inicio rápido](#-inicio-rápido)
- [Arquitectura](#-arquitectura)
- [Modos de Juego Detallados](#-modos-de-juego-detallados)
- [Desarrollo](#-desarrollo)
- [Compatibilidad](#-compatibilidad)
- [Localización](#-localización)
- [Almacenamiento de datos](#-almacenamiento-de-datos)
- [Informar de un problema](#-informar-de-un-problema)
- [Licencia](#-licencia)

## Descripción

LeapMultix es una aplicación web educativa interactiva y moderna para que los niños (8–12 años) dominen las tablas de multiplicar. La aplicación ofrece **4 modos de juego clásicos** y **4 minijuegos de arcade** en una interfaz intuitiva, accesible y multilingüe.

**Desarrollado por:** Julien LS (contact@jls42.org)

**URL en línea:** https://leapmultix.jls42.org/

## ✨ Funcionalidades

### 🎮 Modos de Juego

- **Modo Descubrimiento**: Exploración visual e interactiva de las tablas de multiplicar
- **Modo Quiz**: Preguntas de opción múltiple con progresión adaptativa
- **Modo Desafío**: Carrera contrarreloj con diferentes niveles de dificultad
- **Modo Aventura**: Progresión narrativa por niveles con un mapa interactivo

### 🕹️ Minijuegos Arcade

- **MultiInvaders**: Space Invaders educativo - Destruye las respuestas incorrectas
- **MultiMiam**: Pac-Man matemático - Recoge las respuestas correctas
- **MultiMemory**: Juego de memoria - Empareja multiplicaciones y resultados
- **MultiSnake**: Snake educativo - Crece comiendo los números correctos

### 🌍 Funcionalidades Transversales

- **Multiusuario**: Gestión de perfiles individuales con progreso guardado
- **Multilingüe**: Soporte para francés, inglés y español
- **Personalización**: Avatares, temas de color, fondos
- **Accesibilidad**: Navegación por teclado, soporte táctil, conformidad con WCAG 2.1 AA
- **Adaptable a móviles**: Interfaz optimizada para tabletas y teléfonos inteligentes
- **Sistema de progresión**: Puntuaciones, insignias, desafíos diarios

## 🚀 Inicio rápido

### Prerrequisitos

- Node.js (versión 16 o superior)
- Un navegador web moderno

### Instalación

```bash
# Clonar el proyecto
git clone https://github.com/jls42/leapmultix.git
cd leapmultix

# Instalar las dependencias
npm install

# Iniciar el servidor de desarrollo (opción 1)
npm run serve
# La aplicación estará accesible en http://localhost:8080 (o el siguiente puerto disponible)

# O con Python (opción 2)
python3 -m http.server 8000
# La aplicación estará accesible en http://localhost:8000
```

### Scripts disponibles

```bash
# Desarrollo
npm run serve          # Servidor local (http://localhost:8080)
npm run lint           # Verificación del código con ESLint
npm run lint:fix       # Corrección automática de problemas de ESLint
npm run format:check   # Verificar el formato del código (SIEMPRE antes de hacer commit)
npm run format         # Formatear el código con Prettier
npm run verify         # Puerta de calidad: lint + test + coverage

# Pruebas
npm run test           # Ejecutar todas las pruebas (CJS)
npm run test:watch     # Pruebas en modo de vigilancia
npm run test:coverage  # Pruebas con informe de cobertura
npm run test:core      # Solo pruebas de los módulos principales
npm run test:integration # Pruebas de integración
npm run test:storage   # Pruebas del sistema de almacenamiento
npm run test:esm       # Pruebas ESM (carpetas tests-esm/, Jest vm-modules)
npm run test:verbose   # Pruebas con salida detallada
npm run test:pwa-offline # Prueba PWA sin conexión (requiere Puppeteer), después de `npm run serve`

# Análisis y mantenimiento
npm run analyze:jsdoc  # Análisis de la documentación
npm run improve:jsdoc  # Mejora automática de JSDoc
npm run audit:mobile   # Pruebas de capacidad de respuesta móvil
npm run audit:accessibility # Pruebas de accesibilidad
npm run dead-code      # Detección de código no utilizado
npm run analyze:globals # Análisis de variables globales
npm run analyze:dependencies # Análisis del uso de dependencias
npm run verify:cleanup # Análisis combinado (código muerto + globales)

# Gestión de activos
npm run assets:generate    # Generar imágenes adaptables
npm run assets:backgrounds # Convertir fondos a WebP
npm run assets:analyze     # Análisis de activos adaptables
npm run assets:diff        # Comparación de activos

# Internacionalización
npm run i18n:verify    # Verificar la coherencia de las claves de traducción
npm run i18n:unused    # Listar claves de traducción no utilizadas
npm run i18n:compare   # Comparar traducciones (en/es) con fr.json (referencia)

# Construcción y entrega
npm run build          # Construcción de producción (Rollup) + post-construcción (dist/ completo)
npm run serve:dist     # Servir dist/ en http://localhost:5000 (o puerto disponible)

# PWA y Service Worker
npm run sw:disable     # Desactivar el service worker
npm run sw:fix         # Corregir problemas del service worker
```

## 🏗️ Arquitectura

### Estructura de archivos

```
leapmultix/
├── index.html              # Punto de entrada principal
├── js/
│   ├── core/               # Módulos centrales ES6
│   │   ├── GameMode.js     # Clase base de los modos
│   │   ├── GameModeManager.js # Gestión de los modos de juego
│   │   ├── storage.js      # API de almacenamiento LocalStorage
│   │   ├── audio.js        # Gestión del sonido
│   │   ├── utils.js        # Utilidades genéricas (fuente canónica)
│   │   ├── eventBus.js     # Comunicación por eventos
│   │   ├── userState.js    # Gestión de la sesión de usuario
│   │   ├── mainInit.js     # Inicialización DOM-ready
│   │   ├── theme.js        # Sistema de temas
│   │   ├── userUi.js       # Utilidades de la interfaz de usuario
│   │   ├── parental.js     # Controles parentales
│   │   ├── adventure-data.js # Datos del modo Aventura
│   │   ├── mult-stats.js   # Estadísticas de multiplicación
│   │   ├── challenge-stats.js # Estadísticas de desafío
│   │   └── daily-challenge.js # Gestión de desafíos diarios
│   ├── components/         # Componentes de UI reutilizables
│   │   ├── topBar.js       # Barra de navegación
│   │   ├── infoBar.js      # Barras de información de los juegos
│   │   ├── dashboard.js    # Panel de control del usuario
│   │   └── customization.js # Interfaz de personalización
│   ├── modes/              # Modos de juego
│   │   ├── QuizMode.js
│   │   ├── ChallengeMode.js
│   │   ├── AdventureMode.js
│   │   ├── DiscoveryMode.js
│   │   └── ArcadeMode.js
│   ├── arcade/             # Minijuegos de arcade
│   │   ├── arcade.js       # Orquestador principal de arcade
│   │   ├── arcade-invasion.js # Space Invaders (31 KB)
│   │   ├── arcade-multimemory.js # Juego de memoria (31 KB)
│   │   ├── arcade-multimiam.js # Integración de Multimiam
│   │   ├── arcade-multisnake.js # Integración de Snake
│   │   ├── arcade-common.js, arcade-utils.js # Utilidades compartidas
│   │   ├── arcade-message.js, arcade-points.js # Componentes de UI
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
│   │   ├── slides.js       # Navegación por diapositivas (goToSlide, showSlide)
│   │   └── keyboard-navigation.js # Soporte de teclado
│   ├── ui/                 # Interfaz de usuario y retroalimentación
│   │   ├── uiUtils.js      # Utilidades de interfaz
│   │   ├── ui-feedback.js  # Mecanismos de retroalimentación
│   │   ├── touch-support.js # Soporte táctil (7 KB)
│   │   ├── virtual-keyboard.js # Teclado virtual
│   │   ├── coin-display.js, coin-effects.js # Sistema de monedas
│   │   ├── notifications.js # Sistema de notificaciones
│   │   └── badges.js       # Sistema de insignias
│   ├── media/              # Gestión de medios
│   │   ├── VideoManager.js # Gestión de reproducción de video (12 KB)
│   │   └── responsive-image-loader.js # Carga de imágenes (9 KB)
│   ├── orchestration/      # Orquestación y carga
│   │   ├── mode-orchestrator.js # Cambio de modos
│   │   ├── lazy-loader.js  # Carga dinámica (10 KB)
│   │   └── game-cleanup.js # Limpieza de estado
│   ├── utils/              # Utilidades
│   │   ├── utils-es6.js    # Agregador principal (5 KB)
│   │   ├── main-helpers.js # Ayudantes de la aplicación
│   │   ├── helpers.js      # Funciones de ayuda heredadas
│   │   ├── stats-utils.js  # Utilidades de estadísticas
│   │   ├── difficulty.js   # Gestión de la dificultad
│   │   └── questionGenerator.js # Generación de preguntas
│   ├── storage/            # Almacenamiento y estado
│   │   ├── storage.js      # Envoltorio de almacenamiento heredado
│   │   └── userManager.js  # Gestión multiusuario (19 KB)
│   ├── i18n/               # Internacionalización
│   │   ├── i18n.js         # Sistema i18n
│   │   └── i18n-store.js   # Almacenamiento de traducciones
│   ├── security/           # Seguridad y gestión de errores
│   │   ├── security-utils.js # Protección XSS, sanitización
│   │   ├── error-handlers.js # Gestión global de errores
│   │   └── logger.js       # Sistema de registro
│   ├── accessibility/      # Accesibilidad
│   │   ├── accessibility.js # Funciones de accesibilidad
│   │   └── speech.js       # Soporte de síntesis de voz
│   ├── integration/        # Integración y análisis
│   │   ├── plausible-init.js # Análisis de Plausible
│   │   ├── cache-updater.js # Gestión de caché (10 KB)
│   │   └── imports.js      # Utilidades de importación
│   ├── main-es6.js         # Punto de entrada ES6
│   ├── main.js             # Orquestador principal
│   ├── bootstrap.js        # Configuración de los manejadores de eventos ES6
│   └── game.js             # Gestión de estado y desafíos diarios
├── css/                    # Estilos modulares
├── assets/                 # Recursos
│   ├── images/             # Imágenes y sprites
│   ├── generated-images/   # Imágenes adaptables generadas
│   ├── sounds/             # Efectos de sonido
│   ├── translations/       # Archivos de traducción (fr, en, es)
│   └── videos/             # Vídeos tutoriales
├── tests/                  # Pruebas automatizadas
│   ├── __tests__/          # Pruebas unitarias y de integración
│   └── tests-esm/          # Pruebas ESM (.mjs)
├── scripts/                # Scripts de mantenimiento
│   ├── compare-translations.cjs # Comparación de traducciones
│   └── cleanup-i18n-keys.cjs # Limpieza de claves i18n
└── dist/                   # Construcción de producción (generada)
```

### Arquitectura técnica

**Módulos ES6 modernos**: El proyecto utiliza una arquitectura modular con clases ES6 e importaciones/exportaciones nativas.

**Componentes reutilizables**: Interfaz construida con componentes de UI centralizados (TopBar, InfoBar, Dashboard, Customization).

**Carga diferida (Lazy Loading)**: Carga inteligente de módulos bajo demanda a través de `lazy-loader.js` para optimizar el rendimiento inicial.

**Sistema de almacenamiento unificado**: API centralizada para la persistencia de datos de usuario a través de LocalStorage con alternativas.

**Gestión de audio centralizada**: Control de sonido con soporte multilingüe y preferencias por usuario.

**Bus de eventos (Event Bus)**: Comunicación desacoplada basada en eventos entre componentes para una arquitectura mantenible.

**Navegación por diapositivas**: Sistema de navegación basado en diapositivas numeradas (slide0, slide1, etc.) con `goToSlide()`.

**Seguridad**: Protección contra XSS y sanitización a través de `security-utils.js` para todas las manipulaciones del DOM.

## 🎯 Modos de Juego Detallados

### Modo Descubrimiento

Interfaz de exploración visual de las tablas de multiplicar con:

- Visualización interactiva de las multiplicaciones
- Animaciones y ayudas de memoria
- Arrastrar y soltar educativo
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
- Clasificación de las mejores puntuaciones

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
- Clasificaciones individuales por usuario

## 🛠️ Desarrollo

### Flujo de trabajo de desarrollo

**IMPORTANTE: Nunca hacer commit directamente en main**

El proyecto utiliza un flujo de trabajo basado en ramas de funcionalidad:

1. **Crear una rama**:

   ```bash
   git checkout -b feat/nombre-de-la-funcionalidad
   # o
   git checkout -b fix/nombre-del-bug
   ```

2. **Desarrollar y probar**:

   ```bash
   npm run format:check  # SIEMPRE verificar el formato primero
   npm run format        # Formatear si es necesario
   npm run lint          # Verificar la calidad del código
   npm run test          # Ejecutar las pruebas
   npm run test:coverage # Verificar la cobertura
   ```

3. **Hacer commit en la rama**:

   ```bash
   git add .
   git commit -m "feat: descripción de la funcionalidad"
   ```

4. **Hacer push y crear una Pull Request**:
   ```bash
   git push -u origin feat/nombre-de-la-funcionalidad
   ```

**Estilo de commit**: Mensajes concisos, en modo imperativo (ej: "Fix arcade init errors", "Refactor cache updater")

**Puerta de calidad**: Asegurarse de que `npm run lint`, `npm test` y `npm run test:coverage` pasen antes de cada commit

### Arquitectura de componentes

**GameMode (clase base)**: Todos los modos heredan de una clase común con métodos estandarizados.

**GameModeManager**: Orquestación centralizada del lanzamiento y la gestión de los modos.

**Componentes de UI**: TopBar, InfoBar, Dashboard y Customization proporcionan una interfaz coherente.

**Carga diferida (Lazy Loading)**: Los módulos se cargan bajo demanda para optimizar el rendimiento inicial.

**Bus de eventos (Event Bus)**: Comunicación desacoplada entre componentes a través del sistema de eventos.

### Pruebas

El proyecto incluye un conjunto completo de pruebas:

- Pruebas unitarias de los módulos principales
- Pruebas de integración de los componentes
- Pruebas de los modos de juego
- Cobertura de código automatizada

```bash
npm test              # Todas las pruebas (CJS)
npm test:core         # Pruebas de los módulos centrales
npm test:integration  # Pruebas de integración
npm test:coverage     # Informe de cobertura
npm run test:esm      # Pruebas ESM (ej: components/dashboard) a través de vm-modules
```

### Construcción de producción

- **Rollup**: Empaqueta `js/main-es6.js` en ESM con división de código y sourcemaps
- **Terser**: Minificación automática para optimización
- **Post-construcción**: Copia `css/` y `assets/`, los favicons (`favicon.ico`, `favicon.png`, `favicon.svg`), `sw.js`, y reescribe `dist/index.html` al archivo de entrada con hash (ej: `main-es6-*.js`)
- **Carpeta final**: `dist/` lista para ser servida estáticamente

```bash
npm run build      # genera dist/
npm run serve:dist # sirve dist/ (puerto 5000)
```

### Integración Continua

**GitHub Actions**: Tubería automatizada en `.github/workflows/ci.yml`

La tubería de CI/CD se ejecuta automáticamente en cada push y pull request:

**Trabajos principales**:

1. **build-test**: Trabajo principal de validación
   - Instalación de dependencias: `npm ci`
   - Verificación del formato: `npm run format:check`
   - Análisis estático: `npm run lint`
   - Pruebas unitarias: `npm run test`
   - Auditoría de seguridad: `npm audit`
   - Generación del artefacto de cobertura

2. **accessibility**: Auditoría de accesibilidad (no bloqueante)
   - Ejecuta `npm run audit:accessibility`
   - Genera un informe de accesibilidad WCAG 2.1 AA

3. **test-esm**: Pruebas de los módulos ES6
   - Ejecuta `npm run test:esm` con módulos Jest VM
   - Valida las importaciones/exportaciones de ES6

4. **lighthouse**: Auditoría de rendimiento (no bloqueante)
   - Auditoría de rendimiento móvil
   - Generación de artefactos de informes de Lighthouse
   - Métricas de Core Web Vitals

**Insignias de calidad**:

- Estado de construcción de CI (GitHub Actions)
- Calificación de CodeFactor
- Insignia de Codacy
- Puerta de calidad de SonarCloud

### PWA (Progressive Web App)

LeapMultix es una PWA completa con soporte sin conexión y posibilidad de instalación.

**Service Worker** (`sw.js`):

- Navegación: Network-first con alternativa sin conexión a `offline.html`
- Imágenes: Cache-first para optimizar el rendimiento
- Traducciones: Stale-while-revalidate para actualización en segundo plano
- JS/CSS: Network-first para servir siempre la última versión
- Gestión automática de versiones a través de `cache-updater.js`

**Manifiesto** (`manifest.json`):

- Iconos SVG y PNG para todos los dispositivos
- Instalación posible en móviles (Añadir a la pantalla de inicio)
- Configuración independiente para una experiencia similar a una aplicación
- Soporte de temas y colores

**Probar el modo sin conexión localmente**:

1. Iniciar el servidor de desarrollo:

   ```bash
   npm run serve
   ```

   Abrir `http://localhost:8080` (o el puerto que se muestre)

2. Probar manualmente:
   - Cortar la red en las DevTools (pestaña Network → Offline)
   - Refrescar la página → se muestra `offline.html`

3. Prueba automatizada (requiere Puppeteer):
   ```bash
   npm run test:pwa-offline
   ```

**Scripts de gestión del Service Worker**:

```bash
npm run sw:disable  # Desactivar el service worker
npm run sw:fix      # Corregir problemas de caché
```

### Estándares de calidad

**Herramientas de calidad del código**:

- **ESLint**: Configuración moderna con flat config (`eslint.config.js`), soporte para ES2022
- **Prettier**: Formateo automático del código (`.prettierrc`)
- **Stylelint**: Validación de CSS (`.stylelintrc.json`)
- **JSDoc**: Documentación automática de funciones con análisis de cobertura

**Reglas de código importantes**:

- Eliminar variables y parámetros no utilizados (`no-unused-vars`)
- Usar un manejo de errores específico (no bloques catch vacíos)
- Evitar `innerHTML` en favor de las funciones de `security-utils.js`
- Mantener una complejidad cognitiva < 15 para las funciones
- Extraer funciones complejas en ayudantes más pequeños

**Seguridad**:

- **Protección XSS**: Usar las funciones de `security-utils.js`:
  - `appendSanitizedHTML()` en lugar de `innerHTML`
  - `createSafeElement()` para crear elementos seguros
  - `setSafeMessage()` para el contenido de texto
- **Scripts externos**: Atributo `crossorigin="anonymous"` obligatorio
- **Validación de entradas**: Siempre sanitizar los datos externos
- **Política de Seguridad de Contenido (CSP)**: Cabeceras CSP para restringir las fuentes de scripts

**Accesibilidad**:

- Conformidad con WCAG 2.1 AA
- Navegación completa por teclado
- Roles y etiquetas ARIA apropiados
- Contrastes de color conformes

**Rendimiento**:

- Carga diferida de módulos a través de `lazy-loader.js`
- Optimizaciones de CSS y activos adaptables
- Service Worker para almacenamiento en caché inteligente
- División de código y minificación en producción

## 📱 Compatibilidad

### Navegadores compatibles

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos

- **Escritorio**: Controles de teclado y ratón
- **Tabletas**: Interfaz táctil optimizada
- **Teléfonos inteligentes**: Diseño adaptable y responsivo

### Accesibilidad

- Navegación completa por teclado (Tab, flechas, Esc)
- Roles y etiquetas ARIA para lectores de pantalla
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

**`npm run i18n:verify`** - Verificar la coherencia de las claves de traducción

**`npm run i18n:unused`** - Listar las claves de traducción no utilizadas

**`npm run i18n:compare`** - Comparar los archivos de traducción con fr.json (referencia)

Este script (`scripts/compare-translations.cjs`) asegura la sincronización de todos los archivos de idioma:

**Funcionalidades:**

- Detección de claves faltantes (presentes en fr.json pero ausentes en otros idiomas)
- Detección de claves adicionales (presentes en otros idiomas pero no en fr.json)
- Identificación de valores vacíos (`""`, `null`, `undefined`, `[]`)
- Verificación de coherencia de tipos (cadena vs array)
- Aplanamiento de estructuras JSON anidadas en notación de puntos (ej: `arcade.multiMemory.title`)
- Generación de un informe detallado en la consola
- Guardado del informe JSON en `docs/translations-comparison-report.json`

**Ejemplo de salida:**

```
🔍 Analyse comparative des fichiers de traduction

📚 Langue de référence: fr.json
✅ fr.json: 335 clés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Analyse de en.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total de clés: 335
✅ Aucune clé manquante
✅ Aucune clé supplémentaire
✅ Aucune valeur vide

📊 RÉSUMÉ FINAL
  fr.json: 335 clés
  en.json: 335 clés
  es.json: 335 clés

✅ Tous les fichiers de traduction sont parfaitement synchronisés !
```

**Cobertura de las traducciones:**

- Interfaz de usuario completa
- Instrucciones de los juegos
- Mensajes de error y retroalimentación
- Descripciones y ayuda contextual
- Contenido narrativo del modo Aventura
- Etiquetas de accesibilidad y ARIA

## 📊 Almacenamiento de datos

### Datos del usuario

- Perfiles y preferencias
- Progreso por modo de juego
- Puntuaciones y estadísticas de los juegos de arcade
- Configuración de personalización

### Funcionalidades técnicas

- Almacenamiento local (localStorage) con alternativas
- Aislamiento de los datos por usuario
- Guardado automático del progreso
- Migración automática de datos antiguos

## 🐛 Informar de un problema

Los problemas se pueden informar a través de los issues de GitHub. Por favor, incluya:

- Descripción detallada del problema
- Pasos para reproducirlo
- Navegador y versión
- Capturas de pantalla si son relevantes

## 💝 Apoyar el proyecto

**[☕ Donar a través de PayPal](https://paypal.me/jls)**

## 📄 Licencia

Este proyecto está bajo la licencia AGPL v3. Consulte el archivo `LICENSE` para más detalles.

---

_LeapMultix - Aplicación educativa moderna para aprender las tablas de multiplicar_
